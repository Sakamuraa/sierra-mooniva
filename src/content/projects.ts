/**
 * Projects: the cover songs and the tournament VODs.
 *
 * Provenance, so none of this has to be taken on faith:
 *   - video ids, and which section each belongs to ... rendered /projects page
 *   - every title ................................. YouTube oEmbed for that id
 *   - collaborator credit ........................ the oEmbed title, where it
 *     names one
 *
 * Two corrections to the obvious approach, both of which would have shipped
 * wrong data:
 *
 * Uploading channel. Sierra's own channel hosts ten of the thirteen covers, but
 * three are not hers: "Cat Loving Dangdut" is on Avy Inkaiserin's channel, the
 * "Memory Berkasih" cover is on Rukuman Nuru's, and the five-way "Dilema" cover
 * is on NapLive's. Hardcoding her name on all thirteen would misattribute three
 * of them, so `channel` is read off oEmbed per video and shown on the card.
 *
 * Original title. Her own page paraphrases -- "Bunny Girl (Cover)" for a video
 * she titled "【COVER】Bunny Girl / バニーガール【Sierra Mooniva】". `title` keeps
 * what she published; the paraphrase is kept separately so nothing is lost
 * either way.
 */

export type Project = {
  id: string;
  url: string;
  /** Her own title, as published on YouTube. */
  title: string;
  /** How the projects page refers to it. Null where it has no separate label. */
  shortTitle: string | null;
  /** Who it is with. Empty string where she is alone on the track. */
  credit: string;
  /** Channel that actually hosts the upload. */
  channel: string;
  /** Thumbnail, from YouTube's own image host. */
  thumbnail: string;
};

const Y = (id: string, title: string, credit: string, channel: string, shortTitle: string | null = null): Project => ({
  id,
  url: `https://www.youtube.com/watch?v=${id}`,
  title,
  shortTitle,
  credit,
  channel,
  thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
});

/**
 * Cover songs, thirteen, newest first by upload order on her own page.
 */
export const covers: readonly Project[] = [
  Y("_tC30Ac35Y0", "Bring Me to Life", "ft. Noroi Alanera", "Sierra Mooniva", "Bring Me To Life (Cover)"),
  Y("FiGmF50lRQY", "Bunny Girl / バニーガール", "", "Sierra Mooniva", "Bunny Girl (Cover)"),
  Y("3I9RZMwyH8Y", "Cat Loving Dangdut Ver.", "Avy Inkaiserin, Sierra Mooniva & Nezufu Senshirou", "Avy Inkaiserin 【AFTERAIN】", "Cat Loving Dangdut (Cover)"),
  Y("Pa_WBWNpx5w", "Waktu yang Salah", "Fiersa Besari · with Raversa", "Sierra Mooniva", "Waktu Yang Salah (Cover)"),
  Y("wnweYY9ciGE", "Heart Gata Virus", "JKT48 · with Flein Ryst & Zerion Leoreign", "Sierra Mooniva", "Heart Gata Virus (Cover)"),
  Y("NSOvglRC0Is", "Rindu Dalam Hati", "Arsy Widianto, Brisia Jodie · with Alfachri", "Sierra Mooniva", "Rindu Dalam Hati (Cover)"),
  Y("WCD4a-u_kIc", "Kopi Dangdut", "", "Sierra Mooniva", "Kopi Dangdut (Cover)"),
  Y("pG2A79mvXcM", "Memory Berkasih", "Gerry Mahesa ft. Tasya Rosmala · with Rukuman Nuru", "Rukuman Nuru", "Memori Berkasih (Cover)"),
  Y("7DutrdA5Muk", "ラブカ？Love Ka?", "", "Sierra Mooniva", null),
  Y("_ZdzE3gEZ6k", "Aishite Aishite Aishite", "愛して愛して愛して · Kikuo", "Sierra Mooniva", "Aishite Aishite Aishite (Cover)"),
  Y("5Z2afSQpAys", "Siapkah Kau Tuk Jatuh Cinta Lagi", "with Hira Keiji", "Sierra Mooniva", "Siapkah Kau Tuk Jatuh Cinta Lagi (Cover)"),
  Y("KDwDdPSf3vc", "アイデンティティ / Identity", "Kanaria · with Rythea Ruvona", "Sierra Mooniva", "アイデンティティ / Identity (Cover)"),
  Y("_l1LUhWYXas", "Dilema", "Cherrybelle · with NapLive, Pingu Stardine, Mizu Hamzazu & Gepii Gepeng", "NapLive", "Dilema (Cover)"),
] as const;

/**
 * Tournament recordings, four. Kept apart from the covers because they are
 * matches rather than songs, and lumping the two together would read as though
 * she had published three more songs.
 */
export const tournaments: readonly Project[] = [
  Y("nObxmEabgBs", "Nu Era Clash — Marvel Rivals Tournament", "", "Sierra Mooniva", "Nu Era Clash - Marvel Rivals Tournament"),
  Y("NzNS8p8YmeU", "Nu Era Clash — Day 1", "", "Sierra Mooniva", "Day 1"),
  Y("Pxj6rVKPI3M", "Nu Era Clash — Day 2", "", "Sierra Mooniva", "Day 2"),
  Y("irboGMivMEQ", "Peak Fun Match IKZ!!", "", "Sierra Mooniva", "Fun Match Peak"),
] as const;

/** Where the list comes from, for the page's own attribution line. */
export const projectSource = {
  label: "sierramooniva.framer.website/projects",
  url: "https://sierramooniva.framer.website/projects",
} as const;