import { useCallback, useEffect, useRef, useState } from "react";

import { DUPLICATE_POST_IDS } from "@/content/fanart";

export type Fanart = {
  id: string;
  /** Canonical x.com post. */
  url: string;
  author: string;
  /** Display name, when it differs from the handle. */
  fullname: string;
  /** Caption with the tag, markup and any bare link removed. */
  caption: string;
  /** Served from Twitter's own image host, not a proxy that will go away. */
  image: string;
  /** Same instant in WIB, matching the tweets route. Null when Nitter omits it. */
  postedLabel: string | null;
  /** True when the poster is reposting someone else's artwork. */
  isRetweet: boolean;
  /**
   * Engagement. Null rather than 0 when the instance did not report it, so the
   * card omits the row instead of printing a confident zero.
   */
  replies: number | null;
  retweets: number | null;
  likes: number | null;
  views: number | null;
};

type Payload = {
  reason?: string;
  hashtag?: string;
  searchUrl?: string;
  fanart?: Fanart[];
  nextCursor?: string | null;
};

type State = {
  fanart: Fanart[];
  reason: "loading" | "live" | "unavailable";
  /** Where to send someone who wants the whole stream rather than this page. */
  searchUrl: string;
  /**
   * Opaque continuation. Null once the archive is exhausted, which is the only
   * honest way to hide the button.
   */
  nextCursor: string | null;
  /** True while a "load more" is in flight, so the button cannot be double-fired. */
  loadingMore: boolean;
  /**
   * How many items the first response carried.
   *
   * Everything past this index was appended after the grid had already animated
   * in, so it has to skip its entrance -- see the note on StaggerItem's
   * `immediate`. Tracked here rather than derived from the list length so that
   * re-merging a page that adds nothing new does not reset the boundary.
   */
  initialCount: number;
};

/** Kept in step with api/fanart.ts so the two cannot disagree on page size. */
export const FANART_LIMIT = 48;

/**
 * Ceiling on what the page will hold, across every page loaded.
 *
 * Deliberately much larger than FANART_LIMIT. That constant caps a single
 * response; applying it to the merged list would cap the wall at 48 pieces and
 * the "load more" button would keep appearing while adding nothing, which is the
 * exact failure this whole change exists to remove. Set where the ceiling is a
 * memory concern rather than a design one -- 240 cards is a few megabytes of
 * <img> tags and a page nobody scrolls past.
 */
const MAX_ITEMS = 240;

/** Search results move slowly; a long window costs nothing. */
const POLL_MS = 300_000;

/**
 * Merge pages without duplicates.
 *
 * Nitter repeats items across page boundaries -- a page's last row reappears as
 * the next page's first -- so a plain append would show the same artwork twice
 * and React would warn about duplicate keys. Keyed on the status id, which is
 * unique per post.
 */
function merge(existing: Fanart[], incoming: Fanart[]): Fanart[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of incoming) byId.set(item.id, { ...byId.get(item.id), ...item });
  return [...byId.values()].slice(0, MAX_ITEMS);
}

/**
 * Drop what the wall would otherwise show twice.
 *
 * Two passes, both needed:
 *
 * The curated list already carries some of this artwork, so those posts go by id.
 *
 * Then the same media file is collapsed within the feed itself. Reposting on X
 * reuses the original's media id rather than copying it, so a repost and the
 * original arrive as two posts pointing at one image. That is not hypothetical
 * here: BossNoMann's piece was in the feed twice for exactly that reason. Where
 * both survive, the newer post wins, because the list is ordered newest first and
 * the older one has already had its moment.
 *
 * Applied on every read rather than once at load, so a duplicate caught by a later
 * poll is filtered too and the count cannot drift between refreshes.
 */
function withoutDuplicates(items: Fanart[]): Fanart[] {
  const seenMedia = new Set<string>();
  const out: Fanart[] = [];

  for (const item of items) {
    if (DUPLICATE_POST_IDS.has(item.id)) continue;

    // pbs.twimg.com/media/<id>.<ext> -- the id is what stays the same across a
    // repost, the extension does not.
    const media = item.image.split("/").pop()?.replace(/\.[a-z]+$/i, "") ?? item.image;
    if (seenMedia.has(media)) continue;

    seenMedia.add(media);
    out.push(item);
  }

  return out;
}

/**
 * Fan art posted under the hashtag.
 *
 * Polled on a long cycle. Art shows up whenever people feel like it rather than
 * on a schedule, and the endpoint is edge-cached, so anything faster would
 * re-read the same copy.
 *
 * A hashtag search is not one page. Nitter hands back four items on the first
 * request and the rest behind a cursor, so the endpoint walks a few pages itself
 * and returns a cursor for the remainder -- without it this page showed four
 * pictures out of the hundred-odd that exist. `loadMore` follows that cursor on
 * demand rather than the hook walking everything up front, because each page is a
 * separate request to an instance that rate-limits hard.
 *
 * A failed read keeps the last good result rather than blanking the page: a
 * transient error should not turn a wall of artwork into a wall of text.
 */
export function useFanart(): State & { loadMore: () => void } {
  const [state, setState] = useState<State>({
    fanart: [],
    reason: "loading",
    searchUrl: "https://x.com/search?q=%23Moonivart&src=typed_query&f=live",
    nextCursor: null,
    loadingMore: false,
    initialCount: 0,
  });

  // Kept in a ref rather than read from state inside loadMore: the callback has
  // to see the cursor from the latest response, and a state read would close over
  // whichever value the render happened to capture.
  const cursorRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      try {
        const res = await fetch("/api/fanart", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`api returned ${res.status}`);

        const payload = (await res.json()) as Payload;
        const list = Array.isArray(payload.fanart) ? payload.fanart.slice(0, FANART_LIMIT) : [];
        const kept = withoutDuplicates(list);

        cursorRef.current = payload.nextCursor ?? null;
        setState((prev) => ({
          /*
           * `kept`, not `list`. The previous value is only kept when the endpoint
           * returned nothing at all, so a transient failure does not blank the wall.
           * A response that consists entirely of curated duplicates is not a
           * failure and must be allowed to render as the empty section it is --
           * falling back here would leave stale posts on screen next to the very
           * gallery they duplicate.
           */
          fanart: list.length > 0 ? kept : prev.fanart,
          reason: list.length > 0 ? "live" : "unavailable",
          searchUrl: payload.searchUrl ?? prev.searchUrl,
          nextCursor: payload.nextCursor ?? null,
          loadingMore: false,
          // Only the first response sets the boundary; a later poll that returns
          // fewer items must not shrink it and re-animate rows already on screen.
          initialCount: prev.initialCount || list.length,
        }));
      } catch {
        if (controller.signal.aborted) return;
        setState((prev) => (prev.fanart.length > 0 ? prev : { ...prev, reason: "unavailable" }));
      }

      if (!controller.signal.aborted) timer = setTimeout(load, POLL_MS);
    }

    void load();

    return () => {
      if (timer) clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const loadMore = useCallback(() => {
    // Guarded by a ref, not by state: two clicks in the same frame both read the
    // same pre-update state and both would fire.
    if (busyRef.current || !cursorRef.current) return;
    busyRef.current = true;
    const cursor = cursorRef.current;
    setState((prev) => ({ ...prev, loadingMore: true }));

    void (async () => {
      try {
        const res = await fetch(`/api/fanart?cursor=${encodeURIComponent(cursor)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`api returned ${res.status}`);
        const payload = (await res.json()) as Payload;
        const incoming = Array.isArray(payload.fanart) ? payload.fanart : [];

        // A page that returned nothing new still means the end has been reached,
        // so the cursor is cleared even when nothing was added.
        cursorRef.current = payload.nextCursor ?? null;

        setState((prev) => ({
          ...prev,
          fanart: merge(prev.fanart, incoming),
          reason: prev.reason === "unavailable" && incoming.length > 0 ? "live" : prev.reason,
          nextCursor: payload.nextCursor ?? null,
          loadingMore: false,
        }));
      } catch {
        // The cursor is kept, so the visitor can try again rather than losing the
        // rest of the archive to one bad response.
        setState((prev) => ({ ...prev, loadingMore: false }));
      } finally {
        busyRef.current = false;
      }
    })();
  }, []);

  return { ...state, loadMore };
}
