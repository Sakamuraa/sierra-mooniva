import { useEffect, useState } from "react";

export type ContentItem = {
  videoId: string;
  url: string;
  title: string;
  thumbnail: string;
  live: boolean;
  viewers: number | null;
  /** "5 jam lalu", as the channel's own grid writes it. */
  age: string | null;
  /** Runtime of a finished video, e.g. "2.03.50". Null on a broadcast. */
  duration: string | null;
  /** Publishing channel, on the clips tab only. */
  channel?: string;
};

type ApiPayload = {
  fetchedAt: string;
  liveCount: number;
  sources: Record<"streams" | "videos" | "clips", boolean>;
  streams: ContentItem[];
  videos: ContentItem[];
  clips: ContentItem[];
};

type State = {
  streams: ContentItem[];
  videos: ContentItem[];
  clips: ContentItem[];
  /** True when at least one broadcast is confirmed live. */
  live: boolean;
  /** "api" once a response lands, "snapshot" while on the bundled copy. */
  source: "api" | "snapshot" | "loading";
  error: string | null;
};

/** When the snapshot's ages were measured, so the client can keep them honest. */
const SNAPSHOT_AT = "2026-10-09T00:00:00.000Z";

/**
 * Bundled copies of the lists, captured 2026-10-09 from the channel's own tabs.
 *
 * The fallback for a static host with no serverless runtime, and for the window
 * before the fetch resolves. Ages are YouTube's own labels from that moment,
 * stored as seconds so `formatAge` can advance them: a snapshot that keeps
 * saying "1 bulan lalu" two months later would be lying, and this is the only
 * part of the page that can go stale with no server to refresh it.
 *
 * Note what is absent. There is no stream archive: she is a cover channel, and a
 * fabricated one would be the single worst thing this file could contain.
 * /konten falls back to the newest upload when the stream window is empty.
 */
const SNAPSHOT_VIDEOS: ContentItem[] = [
  { videoId: "au-y_d_gm_Q", url: "https://www.youtube.com/watch?v=au-y_d_gm_Q", title: "【COVER】ベテルギウス (BETELGEUSE) - 優里 (Yuuri) / Cover by Sierra Mooniva", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "KDwDdPSf3vc", url: "https://www.youtube.com/watch?v=KDwDdPSf3vc", title: "【COVER】アイデンティティ / Identity - Kanaria | Cover by Sierra Mooniva & @Ryth", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "5Z2afSQpAys", url: "https://www.youtube.com/watch?v=5Z2afSQpAys", title: "【COVER】Siapkah Kau Tuk Jatuh Cinta Lagi / Cover by Sierra Mooniva & @Hira Keiji Ch.", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "_ZdzE3gEZ6k", url: "https://www.youtube.com/watch?v=_ZdzE3gEZ6k", title: "【COVER】Aishite Aishite Aishite 【愛して愛して愛して】- Kikuo / Cover by Sierra Mooniva", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "7DutrdA5Muk", url: "https://www.youtube.com/watch?v=7DutrdA5Muk", title: "【COVER】 ラブカ？(Love Ka?) / Cover by Sierra Mooniva #utaindorelay", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "WCD4a-u_kIc", url: "https://www.youtube.com/watch?v=WCD4a-u_kIc", title: "【COVER】 Kopi Dangdut / Cover by Sierra Mooniva", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "NSOvglRC0Is", url: "https://www.youtube.com/watch?v=NSOvglRC0Is", title: "【COVER】Rindu Dalam Hati - Arsy Widianto, Brisia Jodie / Cover by Sierra Mooniva & NapLive", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "wnweYY9ciGE", url: "https://www.youtube.com/watch?v=wnweYY9ciGE", title: "【COVER】 JKT48 - Heart Gata Virus (Cover by Sierra Mooniva x @FleinRys)", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "Pa_WBWNpx5w", url: "https://www.youtube.com/watch?v=Pa_WBWNpx5w", title: "【COVER】Waktu yang Salah - Fiersa Besari / Cover by Sierra Mooniva & raversa", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "FeLAccxCMDE", url: "https://www.youtube.com/watch?v=FeLAccxCMDE", title: "【NEW OUTFIT】Moonlit Monarch", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "FiGmF50lRQY", url: "https://www.youtube.com/watch?v=FiGmF50lRQY", title: "【COVER】Bunny Girl / バニーガール【Sierra Mooniva】", thumbnail: "", live: false, viewers: null, age: null, duration: null },
  { videoId: "_tC30Ac35Y0", url: "https://www.youtube.com/watch?v=_tC30Ac35Y0", title: "【COVER】Bring Me to Life / Sierra Mooniva Ft. Noroi Alanera", thumbnail: "", live: false, viewers: null, age: null, duration: null },
];

/**
 * Streams, deliberately empty.
 *
 * She publishes covers rather than broadcasts, so there is no archive to bundle.
 * The route reads live from /api/stream and falls back to the newest upload when
 * the window is empty, which is why this can be an empty array without the page
 * breaking.
 */
const SNAPSHOT_STREAMS: ContentItem[] = [];

/**
 * Clips, deliberately empty.
 *
 * Nothing on her channel is a clip of someone else, and there is no measured pool
 * for this channel yet -- the clip wall is built from a search whose results were
 * never verified the way the seeded list on the sibling sites was. An empty wall
 * that says so beats a wall of another creator's clips.
 */
const SNAPSHOT_CLIPS: ContentItem[] = [];

/**
 * Ages as measured at capture time, in seconds.
 *
 * Read off the channel's own labels on the /videos tab at SNAPSHOT_AT, not
 * calculated, so they match what a visitor would see on YouTube that day. Note
 * the `mgg` and `bln` abbreviations: YouTube writes weeks and months that way in
 * Indonesian, and the parser in api/content.ts carries the same units.
 */
const SNAPSHOT_AGES: Record<string, number> = {
  "au-y_d_gm_Q": 14 * 86400,
  KDwDdPSf3vc: 30 * 86400,
  "5Z2afSQpAys": 30 * 86400,
  _ZdzE3gEZ6k: 30 * 86400,
  "7DutrdA5Muk": 61 * 86400,
  "WCD4a-u_kIc": 122 * 86400,
  NSOvglRC0Is: 122 * 86400,
  wnweYY9ciGE: 122 * 86400,
  Pa_WBWNpx5w: 152 * 86400,
  FeLAccxCMDE: 213 * 86400,
  FiGmF50lRQY: 274 * 86400,
  _tC30Ac35Y0: 305 * 86400,
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

/**
 * Re-render a duration as the age label the card shows.
 *
 * Boundaries match YouTube's own grids closely enough to read the same: they drop
 * to days around a day, to weeks around a week, to months around a month. A value
 * under a minute reads as "beberapa detik", which is what YouTube says for that
 * window rather than the number zero.
 */
export function formatAge(ms: number): string {
  if (ms < MINUTE) return "beberapa detik lalu";
  if (ms < HOUR) return `${Math.floor(ms / MINUTE)} menit lalu`;
  if (ms < DAY) return `${Math.floor(ms / HOUR)} jam lalu`;
  if (ms < WEEK) return `${Math.floor(ms / DAY)} hari lalu`;
  if (ms < MONTH) return `${Math.floor(ms / WEEK)} minggu lalu`;
  return `${Math.floor(ms / MONTH)} bulan lalu`;
}

/**
 * The age to render for one item, from whichever source supplied it.
 *
 * The API path needs no work: its label was read moments ago. The snapshot path
 * carries the measured duration, so the label advances on its own instead of
 * ageing in place.
 */
export function ageLabel(item: ContentItem): string | null {
  if (item.age) return item.age;

  const captured = SNAPSHOT_AGES[item.videoId];
  if (captured === undefined) return null;

  const elapsed = Date.now() - new Date(SNAPSHOT_AT).getTime();
  // A clock behind the capture would produce a negative age, which is worse than
  // showing nothing.
  if (!Number.isFinite(elapsed) || elapsed < 0) return null;

  return formatAge(captured * SECOND + elapsed);
}

/** The API's list when it has one, otherwise the previous one, otherwise none. */
function pick(fresh: unknown, fallback: ContentItem[]): ContentItem[] {
  return Array.isArray(fresh) && fresh.length > 0 ? fresh : fallback;
}

const INITIAL: State = {
  streams: [],
  videos: [],
  clips: [],
  live: false,
  source: "loading",
  error: null,
};

/**
 * All three content lists.
 *
 * `/api/content` supplies the fresh lists and the one thing a bundled snapshot
 * cannot know: whether a stream is running right now. Until it answers the cards
 * come from the snapshot, so no section is ever empty. If the endpoint is missing
 * or errors, the snapshot stays and the visitor sees a correct, slightly older
 * page with no error.
 */
/**
 * How often to re-read the feed.
 *
 * Short enough that a stream starting is noticed while someone is looking at the
 * page, long enough not to hammer a serverless function. The endpoint's own edge
 * cache is what this sits behind.
 */
const POLL_MS = 60_000;

export function useContent(): State {
  const [state, setState] = useState<State>(INITIAL);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failed = false;

    /*
     * Re-reads on a timer rather than once.
     *
     * A stream starts and ends while the page is open. Fetched once on mount, the
     * page would keep calling a finished broadcast live, or miss one that began
     * after it loaded, until the visitor reloaded by hand. The same reasoning the
     * endpoint caches for: a stale answer is worse here than a slightly late one,
     * because "live" is a claim about right now.
     *
     * Polling stops while the tab is hidden and resumes when it comes back, so a
     * tab left open in the background costs nothing.
     */
    async function load() {
      try {
        const res = await fetch("/api/content", {
          signal: controller.signal,
          // The edge holds this for minutes; without a bypass a poll would read
          // the same cached copy it just read.
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`api returned ${res.status}`);

        const payload = (await res.json()) as ApiPayload;
        if (!Array.isArray(payload.streams) || payload.streams.length === 0) {
          throw new Error("api returned no streams");
        }

        failed = false;
        setState((prev) => ({
          streams: payload.streams,
          /*
           * A tab that comes back empty keeps whatever the last good response had.
           *
           * The endpoint already carries a previous list forward rather than
           * serving a hole, but a tab can still read empty on the very first
           * response after a deploy. Falling back to the snapshot there means the
           * page shows a slightly older list instead of an empty grid, which is
           * the difference between "this is what she uploaded in October" and
           * "there is nothing here", and only the first one is true.
           */
          videos: pick(payload.videos, prev.videos.length ? prev.videos : SNAPSHOT_VIDEOS),
          clips: pick(payload.clips, prev.clips.length ? prev.clips : SNAPSHOT_CLIPS),
          live: payload.streams.some((item) => item.live),
          source: "api",
          error: null,
        }));
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        failed = true;
        setState({
          streams: SNAPSHOT_STREAMS,
          videos: SNAPSHOT_VIDEOS,
          clips: SNAPSHOT_CLIPS,
          live: false,
          source: "snapshot",
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Give up rather than retry a broken endpoint forever.
      if (!failed && !controller.signal.aborted) timer = setTimeout(load, POLL_MS);
    }

    void load();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        if (timer) clearTimeout(timer);
        void load();
      } else if (timer) {
        clearTimeout(timer);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer) clearTimeout(timer);
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return state;
}