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
  identity: "VTuber · Cover artist · JRPG",
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
    note: "Cover dan upload",
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
 * Her hashtag, taken from the one in her own X bio.
 *
 * "#MoonivArt" appears on the second line of the bio, above the project mention,
 * which is where a creator puts the tag they want fan art under. Nothing else is
 * listed, so nothing else is here.
 */
export const hashtags = [{ tag: "#MoonivArt", use: "Fan Art" }] as const;

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
 * Read off the channel's own /videos tab. "COVER" is what she calls this channel
 * in practice -- the titles are almost entirely bracketed covers -- so it is the
 * one series listed. This channel is a cover channel: of the twelve newest
 * uploads, ten are bracketed covers, and the two that are not are an outfit
 * reveal and a mascot. That is the plain reading of the channel and the page says
 * so rather than implying a stream schedule it does not have.
 */
export const series = [{ name: "COVER", kind: "Cover" }] as const;

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