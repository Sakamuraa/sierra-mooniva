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
  /**
   * Absolute publish instant behind `age`.
   *
   * The API path sends this so the label can be re-derived from it rather than
   * read verbatim. The string alone is a snapshot of one moment -- an edge cache
   * happily serves the same payload for an hour, and a card that prints the
   * cached string keeps claiming "6 jam lalu" long after the stream is nine hours
   * old. Measuring from an instant cannot go stale that way.
   */
  publishedAt?: string | null;
  /** Runtime of a finished video, e.g. "2.03.50". Null on a broadcast. */
  duration: string | null;
  /** Publishing channel, on the clips tab only. */
  channel?: string;
  /** Scheduled but not started. Separate from live: one is now, one is later. */
  upcoming?: boolean;
};

type ApiPayload = {
  fetchedAt: string;
  liveCount: number;
  sources: Record<"streams" | "videos" | "clips", boolean>;
  streams: ContentItem[];
  videos: ContentItem[];
  clips: ContentItem[];
  /** Scheduled broadcast, or null. */
  upcoming?: ContentItem | null;
};

type State = {
  streams: ContentItem[];
  videos: ContentItem[];
  clips: ContentItem[];
  /** Scheduled but not started, when there is one. */
  upcoming: ContentItem | null;
  /** True when at least one broadcast is confirmed live. */
  live: boolean;
  /** "api" once a response lands, "snapshot" while on the bundled copy. */
  source: "api" | "snapshot" | "loading";
  error: string | null;
};

/** When the snapshot's ages were measured, so the client can keep them honest. */
const SNAPSHOT_AT = "2026-10-09T03:49:47.206Z";

/**
 * Bundled copies of the three lists, captured 2026-10-09
 * by calling the handlers in-process and keeping exactly what they returned.
 *
 * The fallback for a static host with no serverless runtime, and for the window
 * before the fetch resolves. Ages are YouTube's own labels from that moment,
 * stored as seconds so `formatAge` can advance them: a snapshot that keeps saying
 * "1 hari lalu" next month would be lying, and this is the only part of the page
 * that can go stale with no server to refresh it.
 *
 * All three lists are real. An earlier version of this file shipped streams and
 * clips as empty arrays, on the claim that she is a cover channel -- that was read
 * off the /videos tab and never checked against /streams, which has eight
 * broadcasts in it. She streams: Fire Emblem, Kitaria Fables 2, DotA 2, VALORANT,
 * and collabs. Reading one tab and generalising from it is how a cover upload tab
 * became a claim about the whole channel.
 */
const SNAPSHOT_STREAMS: ContentItem[] = [
  { videoId: "lxR4SuXgXco", url: "https://www.youtube.com/watch?v=lxR4SuXgXco", title: "【Kitaria Fables 2】ayuk kita cobain demonya!! First Impression", thumbnail: "https://i.ytimg.com/vi/lxR4SuXgXco/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBz3SiT5kO7NOvTjpYy5j9jcbYugA", live: false, viewers: null, age: null, duration: null },
  { videoId: "nJSHdMGIR-E", url: "https://www.youtube.com/watch?v=nJSHdMGIR-E", title: "【BOMBANANA!】jadi monyet bareng @FleinRyst @PoffieHunni", thumbnail: "https://i.ytimg.com/vi/nJSHdMGIR-E/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCr_8_x9ZY8lO1-b-gNtJQoGwGJDg", live: false, viewers: null, age: null, duration: null },
  { videoId: "SAMi9ShU0hA", url: "https://www.youtube.com/watch?v=SAMi9ShU0hA", title: "【Fire Emblem: Fortune's Weave】Cai's Route Part 3! #4", thumbnail: "https://i.ytimg.com/vi/SAMi9ShU0hA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLADsZjCUCwLEaidShzEy2UHeaQ3Hg", live: false, viewers: null, age: null, duration: null },
  { videoId: "mnHjjvFmnI0", url: "https://www.youtube.com/watch?v=mnHjjvFmnI0", title: "【Fire Emblem: Fortune's Weave】CAI'S POV PART 2 #3", thumbnail: "https://i.ytimg.com/vi/mnHjjvFmnI0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAjnWED7_UD-qbYLlCD4LJJ8Pn05Q", live: false, viewers: null, age: null, duration: null },
  { videoId: "J92t3lMQZ2o", url: "https://www.youtube.com/watch?v=J92t3lMQZ2o", title: "【DotA 2】main dota di carry @dazyzylphia", thumbnail: "https://i.ytimg.com/vi/J92t3lMQZ2o/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAM5QOxpacBbucwWh29RTw-eFjGGQ", live: false, viewers: null, age: null, duration: null },
  { videoId: "9C2z0Kx2M6k", url: "https://www.youtube.com/watch?v=9C2z0Kx2M6k", title: "【Fire Emblem: Fortune's Weave】CAI'S POV PART 1 #2", thumbnail: "https://i.ytimg.com/vi/9C2z0Kx2M6k/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBECHU7rRK15nlLZ5S_qVcFlmyJRQ", live: false, viewers: null, age: null, duration: null },
  { videoId: "JHKGdSuwwLc", url: "https://www.youtube.com/watch?v=JHKGdSuwwLc", title: "【VALORANT】sakit jadinya maen palo ajh..", thumbnail: "https://i.ytimg.com/vi/JHKGdSuwwLc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD4ViyGv7zYzbzyvubwHir6HVLxCA", live: false, viewers: null, age: null, duration: null },
  { videoId: "si8D1HR6L2M", url: "https://www.youtube.com/watch?v=si8D1HR6L2M", title: "【Fire Emblem: Fortune's Weave】SAATNYAAA BERKONFLIK #1", thumbnail: "https://i.ytimg.com/vi/si8D1HR6L2M/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCeQBhvAybgDIur9qoU7SXfhDPqZg", live: false, viewers: null, age: null, duration: null },
];

const SNAPSHOT_VIDEOS: ContentItem[] = [
  { videoId: "au-y_d_gm_Q", url: "https://www.youtube.com/watch?v=au-y_d_gm_Q", title: "【COVER】ベテルギウス (BETELGEUSE) - 優里 (Yuuri) / Cover by Sierra Mooniva", thumbnail: "https://i.ytimg.com/vi/au-y_d_gm_Q/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBrPLLTgBTRrMaAwbi11yq1NVg1CA", live: false, viewers: null, age: null, duration: null },
  { videoId: "KDwDdPSf3vc", url: "https://www.youtube.com/watch?v=KDwDdPSf3vc", title: "【COVER】アイデンティティ / Identity - Kanaria | Cover by Sierra Mooniva & @RytheaRuvona", thumbnail: "https://i.ytimg.com/vi/KDwDdPSf3vc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDBaT80nokuDkRLVF4kQ7QnwPb5nw", live: false, viewers: null, age: null, duration: null },
  { videoId: "5Z2afSQpAys", url: "https://www.youtube.com/watch?v=5Z2afSQpAys", title: "【COVER】Siapkah Kau Tuk Jatuh Cinta Lagi / Cover by Sierra Mooniva & @Hira_Keiji ​", thumbnail: "https://i.ytimg.com/vi/5Z2afSQpAys/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBs1am_juv5fSo7ST7oILRxQBdw7A", live: false, viewers: null, age: null, duration: null },
  { videoId: "_ZdzE3gEZ6k", url: "https://www.youtube.com/watch?v=_ZdzE3gEZ6k", title: "【COVER】Aishite Aishite Aishite 【愛して愛して愛して】- Kikuo / Cover by Sierra Mooniva", thumbnail: "https://i.ytimg.com/vi/_ZdzE3gEZ6k/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBY6zQxJVr_e9XYb5yrmKkLRWl_4A", live: false, viewers: null, age: null, duration: null },
  { videoId: "7DutrdA5Muk", url: "https://www.youtube.com/watch?v=7DutrdA5Muk", title: "【COVER】 ラブカ？(Love Ka?) / Cover by Sierra Mooniva #utaindorelay", thumbnail: "https://i.ytimg.com/vi/7DutrdA5Muk/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCt4RDcRhO0JmR-oY7y1BlObLud7w", live: false, viewers: null, age: null, duration: null },
  { videoId: "WCD4a-u_kIc", url: "https://www.youtube.com/watch?v=WCD4a-u_kIc", title: "【COVER】 Kopi Dangdut / Cover by Sierra Mooniva", thumbnail: "https://i.ytimg.com/vi/WCD4a-u_kIc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCZbUMqh8kdi_hIqYFmVsbEN34DOg", live: false, viewers: null, age: null, duration: null },
  { videoId: "NSOvglRC0Is", url: "https://www.youtube.com/watch?v=NSOvglRC0Is", title: "【COVER】Rindu Dalam Hati - Arsy Widianto, Brisia Jodie / Cover by Sierra Mooniva & @naplive7", thumbnail: "https://i.ytimg.com/vi/NSOvglRC0Is/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBff4uFrHnPN_4iVc6O_N1RxI4wlA", live: false, viewers: null, age: null, duration: null },
  { videoId: "wnweYY9ciGE", url: "https://www.youtube.com/watch?v=wnweYY9ciGE", title: "【COVER】 JKT48 - Heart Gata Virus  (Cover by Sierra Mooniva x @FleinRyst x @ZerionLeoreign)", thumbnail: "https://i.ytimg.com/vi/wnweYY9ciGE/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDRJvgNpdL2nJ9uMEzeYOzkrvRZXw", live: false, viewers: null, age: null, duration: null },
  { videoId: "Pa_WBWNpx5w", url: "https://www.youtube.com/watch?v=Pa_WBWNpx5w", title: "【COVER】Waktu yang Salah - Fiersa Besari / Cover by Sierra Mooniva & @raversa_", thumbnail: "https://i.ytimg.com/vi/Pa_WBWNpx5w/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC9CjHckgCBEGFXZuI5XCu8YVrJVA", live: false, viewers: null, age: null, duration: null },
  { videoId: "FeLAccxCMDE", url: "https://www.youtube.com/watch?v=FeLAccxCMDE", title: "【NEW OUTFIT】Moonlit Monarch", thumbnail: "https://i.ytimg.com/vi/FeLAccxCMDE/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_ID0oOjAP&rs=AOn4CLB5MAaVeRXhHx-AYW7DtXnOFB4YUw", live: false, viewers: null, age: null, duration: null },
  { videoId: "FiGmF50lRQY", url: "https://www.youtube.com/watch?v=FiGmF50lRQY", title: "【COVER】Bunny Girl / バニーガール【Sierra Mooniva】", thumbnail: "https://i.ytimg.com/vi/FiGmF50lRQY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDnbz2drMMNzhLkWmzAofKvgNSzOw", live: false, viewers: null, age: null, duration: null },
  { videoId: "_tC30Ac35Y0", url: "https://www.youtube.com/watch?v=_tC30Ac35Y0", title: "【COVER】Bring Me to Life / Sierra Mooniva Ft. Noroi Alanera", thumbnail: "https://i.ytimg.com/vi/_tC30Ac35Y0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCaUIiPeyZ05_MobxeumquRcIxCKQ", live: false, viewers: null, age: null, duration: null },
];

/**
 * Clips, from the ten search queries in api/content.ts.
 *
 * These are other people's channels, mostly Exile Syahputra's, and several name a
 * co-star in the title. That is what a clip wall is: an index of where she was
 * clipped, linking back to the original, not a gallery of her own uploads.
 */
const SNAPSHOT_CLIPS: ContentItem[] = [
  { videoId: "pG2A79mvXcM", url: "https://www.youtube.com/watch?v=pG2A79mvXcM", title: "[COVER] Memory Berkasih (Koplo) - Gerry Mahesa ft. Tasya Rosmala (Cover By Nuru ft. Sierra Mooniva)", thumbnail: "https://i.ytimg.com/vi/pG2A79mvXcM/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCCfX9bgchs5nFGb6BNXG8nVkLWIQ", live: false, viewers: null, age: null, duration: "6.34", channel: "Rukuman Nuru dan Sierra Mooniva" },
  { videoId: "kfa34MQBPMM", url: "https://www.youtube.com/watch?v=kfa34MQBPMM", title: "Walau Nyeker, tapi Tetap Cantik! [Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/kfa34MQBPMM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBEZJm3wM1-0aPoytmoUl1u0AE2Pg", live: false, viewers: null, age: null, duration: "2.24", channel: "LangLang" },
  { videoId: "3I9RZMwyH8Y", url: "https://www.youtube.com/watch?v=3I9RZMwyH8Y", title: "✦ COVER ✦ Cat Loving Dangdut Ver. (Avy Inkaiserin, Sierra Mooniva & Nezufu Senshirou)", thumbnail: "https://i.ytimg.com/vi/3I9RZMwyH8Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBeeIxvBS4mfsbw6m8rmQYSxX07Fw", live: false, viewers: null, age: null, duration: "2.51", channel: "Avy Inkaiserin 【AFTERAIN】 dan 2 lainnya" },
  { videoId: "6bzZf-izJVs", url: "https://www.youtube.com/watch?v=6bzZf-izJVs", title: "Bang Al Pertama Kali Mendengar Suara Sigma Sierra 😂 [Sierra Mooniva - Naplive]", thumbnail: "https://i.ytimg.com/vi/6bzZf-izJVs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDg0DRcUl3kQ7YQWcORiqgoI8Fwxg", live: false, viewers: null, age: null, duration: "2.01", channel: "Exile Syahputra" },
  { videoId: "n2Ld_fA2nq0", url: "https://www.youtube.com/watch?v=n2Ld_fA2nq0", title: "Sierra Mengaktifkan Mode Tsundere Bang Al Sampai Tak Berkutik 🤣 [Sierra Mooniva - Naplive]", thumbnail: "https://i.ytimg.com/vi/n2Ld_fA2nq0/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAs8-8mf0WnkCpe8VK0UKVjZXlc_Q", live: false, viewers: null, age: null, duration: "2.17", channel: "Exile Syahputra" },
  { videoId: "7JNXS5Pw5Dw", url: "https://www.youtube.com/watch?v=7JNXS5Pw5Dw", title: "Sierra Berjakun Pun Aku Tetap Cinta 😌 [Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/7JNXS5Pw5Dw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_Cqfy3KnuF1maCCRAyR90eCd2bA", live: false, viewers: null, age: null, duration: "1.28", channel: "Exile Syahputra" },
  { videoId: "o4qSgr0cT5Q", url: "https://www.youtube.com/watch?v=o4qSgr0cT5Q", title: "Sierra Dan Exile Saling Counter? Siapakah Yang Akan Menang? 🤔 [Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/o4qSgr0cT5Q/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBS8eOEYftygDentU37m3-biG96wA", live: false, viewers: null, age: null, duration: "2.43", channel: "Exile Syahputra" },
  { videoId: "aupeiPrMreA", url: "https://www.youtube.com/watch?v=aupeiPrMreA", title: "Ternyata Sierra kayak kucing bagi bang Al😾 [Naplive - Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/aupeiPrMreA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDMeMuB_SHIpiUlYjpAKqFERJIxcQ", live: false, viewers: null, age: null, duration: "1.25", channel: "Delion【Vermak】" },
  { videoId: "gSdDHEznuLc", url: "https://www.youtube.com/watch?v=gSdDHEznuLc", title: "Bang Al Memuji Sierra Cantik 🥰 [Naplive - Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/gSdDHEznuLc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8UKSvkmZFqnFOQJ1CqrkxbrHVMQ", live: false, viewers: null, age: null, duration: "1.53", channel: "Exile Syahputra" },
  { videoId: "rIGhqHLAdPY", url: "https://www.youtube.com/watch?v=rIGhqHLAdPY", title: "Sierra Penasaran Tentang Bang Al Dan Yuki Eruma 🤔 [Sierra Mooniva - Naplive]", thumbnail: "https://i.ytimg.com/vi/rIGhqHLAdPY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAqRVhYIkfAfu_BQ9rC5DNKtjestA", live: false, viewers: null, age: null, duration: "1.55", channel: "Exile Syahputra" },
  { videoId: "pTldukU4gQs", url: "https://www.youtube.com/watch?v=pTldukU4gQs", title: "Sierra Ngobrol Bareng Bang Al Lewat Portal Medishare [Naplive - Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/pTldukU4gQs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCyHdTE-eVrhaZSSmF-dXs4XV7UAw", live: false, viewers: null, age: null, duration: "2.09", channel: "Exile Syahputra" },
  { videoId: "ZxN2r88pLT8", url: "https://www.youtube.com/watch?v=ZxN2r88pLT8", title: "Siap Jalan Sama Ayank Sepulang Kerja [Sierra Mooniva]", thumbnail: "https://i.ytimg.com/vi/ZxN2r88pLT8/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDCGyVAad6pVtO4EW4bt25ebZl4MQ", live: false, viewers: null, age: null, duration: "2.05", channel: "Fuutaba Clips" },
];

/**
 * Ages as measured at capture time, in seconds, snapped to whole days.
 *
 * Read off the channel's own labels rather than calculated from anything else, so
 * they match what a visitor would see on YouTube that day. Note the `mgg` and
 * `bln` abbreviations in the source labels: YouTube writes weeks and months that
 * way in Indonesian, and the parser in api/content.ts carries the same units.
 *
 * Snapping to days is deliberate. A clip's age is a caption, not a broadcast
 * status, and rounding to the nearest day keeps a stale snapshot from being wrong
 * by hours -- while still advancing on its own through formatAge.
 */
const SNAPSHOT_AGES: Record<string, number> = {
  "lxR4SuXgXco": 86400,
  "nJSHdMGIR-E": 172800,
  "SAMi9ShU0hA": 345600,
  "mnHjjvFmnI0": 432000,
  "J92t3lMQZ2o": 691200,
  "9C2z0Kx2M6k": 1036800,
  "JHKGdSuwwLc": 1209600,
  "si8D1HR6L2M": 1209600,
  "au-y_d_gm_Q": 1209600,
  "KDwDdPSf3vc": 2592000,
  "5Z2afSQpAys": 2592000,
  "_ZdzE3gEZ6k": 2592000,
  "7DutrdA5Muk": 5184000,
  "WCD4a-u_kIc": 10368000,
  "NSOvglRC0Is": 10368000,
  "wnweYY9ciGE": 10368000,
  "Pa_WBWNpx5w": 12960000,
  "FeLAccxCMDE": 18144000,
  "FiGmF50lRQY": 23328000,
  "_tC30Ac35Y0": 25920000,
  "pG2A79mvXcM": 7776000,
  "kfa34MQBPMM": 18144000,
  "3I9RZMwyH8Y": 20736000,
  "6bzZf-izJVs": 23328000,
  "n2Ld_fA2nq0": 25920000,
  "7JNXS5Pw5Dw": 25920000,
  "o4qSgr0cT5Q": 25920000,
  "aupeiPrMreA": 25920000,
  "gSdDHEznuLc": 28512000,
  "rIGhqHLAdPY": 28512000,
  "pTldukU4gQs": 28512000,
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
/**
 * A year, at 365 days rather than 365.25.
 *
 * The same figure api/content.ts uses for `tahun`, so a label the API is able to
 * produce is one this can render. The labels are coarse either way -- "1 tahun
 * lalu" on YouTube covers anything from 12 to 24 months -- so the extra precision
 * would be precision the source does not have.
 */
const YEAR = 365 * DAY;

/**
 * Re-render a duration as the age label the card shows.
 *
 * Boundaries match YouTube's own grids closely enough to read the same: they drop
 * to days around a day, to weeks around a week, to months around a month, and to
 * years around a year. A value under a minute reads as "beberapa detik", which is
 * what YouTube says for that window rather than the number zero.
 *
 * The year tier exists because two of the endpoints can return "tahun" and this
 * could not say it: an eleven-year-old clip came out as "133 bulan lalu", which is
 * a true number and a meaningless one. Every bundled snapshot also holds entries
 * older than a year, so the same label appeared on those without any API involved.
 */
export function formatAge(ms: number): string {
  if (ms < MINUTE) return "beberapa detik lalu";
  if (ms < HOUR) return `${Math.floor(ms / MINUTE)} menit lalu`;
  if (ms < DAY) return `${Math.floor(ms / HOUR)} jam lalu`;
  if (ms < WEEK) return `${Math.floor(ms / DAY)} hari lalu`;
  if (ms < MONTH) return `${Math.floor(ms / WEEK)} minggu lalu`;
  if (ms < YEAR) return `${Math.floor(ms / MONTH)} bulan lalu`;
  return `${Math.floor(ms / YEAR)} tahun lalu`;
}

/**
 * The age to render for one item, from whichever source supplied it.
 *
 * The API path is measured, not quoted. `publishedAt` is a wall-clock instant, so
 * the label is re-derived from it every render and stays correct however long the
 * payload sat in a cache. The `age` string is kept only as a fallback for a
 * response that predates the field.
 *
 * The snapshot path carries the measured duration instead, so its label advances
 * the same way -- a copy that keeps saying "1 jam lalu" a week later would be
 * lying, and caching is the only part of this page that can go stale with no
 * server to refresh it.
 */
export function ageLabel(item: ContentItem): string | null {
  if (item.publishedAt) {
    const elapsed = Date.now() - new Date(item.publishedAt).getTime();
    if (Number.isFinite(elapsed) && elapsed >= 0) return formatAge(elapsed);
  }

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
  // Null until the endpoint answers, and deliberately not a bundled copy.
  // Every other list falls back to the snapshot because a slightly old
  // upload is still true; a scheduled stream is a claim about a future
  // that can be cancelled, so the card waits for the endpoint.
  upcoming: null,
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

          // The endpoint decides whether anything is scheduled, so its answer
          // replaces the bundled copy outright: a stale upcoming card is a
          // claim about the future and must not age in place.
          upcoming: payload.upcoming ?? null,
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
          // No snapshot copy on this path -- see the note on INITIAL.
          upcoming: null,
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