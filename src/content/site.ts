/**
 * Identity strings, sourced from the real channel.
 *
 * Provenance, so nothing here has to be trusted on faith:
 *   - name, bio ................ YouTube channel description + X profile bio
 *   - avatar ................... yt3.googleusercontent.com, channel og:image
 *   - character ............... the creator's own words in both bios
 *   - hashtag ................. the X profile bio, first hashtag
 *
 * Everything below was read off @SierraMooniva on YouTube and @SierraMooniva on X.
 * Nothing is inferred and nothing is invented -- in particular there is no
 * subscriber count here, because the about page ships metadata for every channel
 * it recommends and the first extraction of this channel picked up a stranger's
 * "14,4 rb subscriber". Until a number can be read off her own header it is not
 * on the page at all.
 *
 * The content lists are NOT here. They come from /api/content at request time and
 * keep only a bundled snapshot in src/lib/useContent.ts.
 */

export const site = {
  name: "Sierra Mooniva",
  /** Name as it appears on the channel, verbatim. */
  channelTitle: "Sierra Mooniva",
  /**
   * The channel description exactly as published.
   *
   * Kept verbatim including "Slav-", which is the creator's own spelling and not
   * a typo to be tidied. Correcting someone's bio is how a fan page starts
   * saying things they never said.
   */
  bio: "Hewwo! Virtual Corporate Slav- Secretary who love playing JRPG is here! Nice to meet you! :3 Vtuber~",
  /**
   * Production origin. Served from its own subdomain, so the origin and the site
   * URL are the same thing. Kept in sync with index.html, robots.txt and
   * sitemap.xml.
   *
   * Placeholder: no domain is registered for this site yet.
   */
  url: "https://sierra-mooniva.vtube-info.xyz",
  locale: "id_ID",
  avatar: "/media/avatar-youtube.webp",
  /**
   * Alt text for the channel avatar.
   *
   * Deliberately does not describe the picture. The artwork is Sierra's own
   * design and any description here would be invented rather than read off it,
   * which serves a screen reader worse than naming what the image is for.
   */
  avatarAlt: "Avatar kanal YouTube Sierra Mooniva",
  /** Smaller crop used for the nav mark. */
  avatarSmall: "/media/avatar-x.webp",
  /** Her own self-description, in her own words. */
  role: "Virtual Corporate Secretary",
  /** What she is on the channel, in her own words. */
  identity: "VTuber · Stream · Cover · JRPG",
} as const;

/**
 * Only channels confirmed to be hers.
 *
 * The YouTube handle is the one the X bio itself links, so the pairing is the
 * creator's rather than inferred from a similar name.
 *
 * Note for whoever adds the next channel: do not read a support or donation link
 * off an X profile without checking it against the creator's own bio. Nitter
 * renders an instance-wide navigation link on every profile it serves, and that
 * link is the operator's, not the profile owner's.
 */
export const channels = {
  youtube: {
    label: "YouTube",
    handle: "@SierraMooniva",
    url: "https://www.youtube.com/@SierraMooniva",
    note: "Stream dan cover",
  },
  x: {
    label: "X",
    handle: "@SierraMooniva",
    url: "https://x.com/SierraMooniva",
    note: "Update harian",
  },
  website: {
    label: "Website",
    handle: "sierramooniva.framer.website",
    url: "https://sierramooniva.framer.website",
    note: "Situs pribadinya",
  },
} as const;

/**
 * Route table.
 *
 * Owned here rather than in App.tsx so the nav and the router cannot disagree
 * about which paths exist.
 */
export const ROUTES = [
  "/",
  "/tentang",
  "/konten",
  "/konten/streams",
  "/konten/video",
  "/konten/clips",
  "/tweets",
  "/fanart",
  "/channel",
] as const;

export type Route = (typeof ROUTES)[number];

/**
 * Hashtags, as published by her: one general tag, then one per kind of post.
 *
 * Taken from her own listing rather than scraped out of a timeline, because the
 * timeline is full of other people's words -- an earlier pass picked up
 * #VtuberDebut and #tapiocaalice from a post promoting another creator's debut,
 * which would have been a guess dressed as a fact.
 *
 * `#SierraonAir` and `#Sierramoonclips` are not in the X bio; they are the live and
 * clip tags she lists alongside the other two, and they are what the fanart and
 * clip routes should be reading.
 */
export const hashtags = [
  { tag: "#SierraMooniva", use: "General" },
  { tag: "#SierraonAir", use: "Live" },
  { tag: "#MoonivArt", use: "Art" },
  { tag: "#Sierramoonclips", use: "Clips" },
] as const;

/**
 * Affiliation, from the X bio.
 *
 * "COO of @afterainPROJECT" is the creator's own claim about herself, so it is
 * quoted rather than paraphrased into something stronger.
 */
export const affiliations = [
  { role: "COO", name: "@afterainPROJECT" },
] as const;

/**
 * Series names exactly as they appear between the brackets in the upload titles.
 *
 * Read off both of her tabs, not just the one that was convenient. The /videos tab
 * is bracketed COVER almost throughout; the /streams tab is bracketed game
 * titles, several of them a series she is partway through -- Fire Emblem: Fortune's
 * Weave runs "#1" through "#4" across separate uploads, which is what a running
 * playthrough looks like.
 *
 * An earlier version of this file listed COVER alone and called the channel a
 * cover channel. That came from reading /videos and generalising. Both tabs are
 * hers, so both are here.
 */
export const series = [
  { name: "COVER", kind: "Cover" },
  { name: "Fire Emblem: Fortune's Weave", kind: "Playthrough" },
] as const;

/**
 * Colophon. A credit line naming who built the page. Kept as a footnote, not a
 * showcase section.
 */
export const colophon = {
  credit: "Developed by Sakamura",
} as const;

/**
 * Nav links.
 *
 * Every href is a full route, never a bare "#anchor". `satisfies` ties every
 * href to the Route union, so a typo becomes a type error rather than a link that
 * quietly goes nowhere.
 */
export const navigation = [
  { label: "Tentang", href: "/tentang" },
  { label: "Konten", href: "/konten" },
  { label: "Tweets", href: "/tweets" },
  { label: "Fan Art", href: "/fanart" },
  { label: "Channel", href: "/channel" },
] as const satisfies ReadonlyArray<{ label: string; href: Route }>;