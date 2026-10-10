/**
 * Sierra's own fan art gallery, transcribed once from her site.
 *
 * Source: https://sierramooniva.framer.website/fanart -- her curated wall, where
 * every piece carries the artist's credit. That page is a static Framer build with
 * no feed behind it, so this is a transcription rather than a fetch: there is
 * nothing to re-read, and a credit that only lives in a screenshot of someone's
 * site is a credit that stops being correct the moment she edits it.
 *
 * Kept out of /api/fanart on purpose. That route reads Nitter and is the only part
 * of this site that can fail; a curated archive that depends on it would go blank
 * whenever the instance did.
 *
 * Images stay on Framer's CDN rather than being copied into public/. They are her
 * files on her host, and a copy here would be a second thing to keep in step with
 * her site.
 *
 * Credits are transcribed as given: 55 pieces link an X profile and carry a handle,
 * the rest are a plain display name with no profile to link. Inventing a profile
 * for those would be a link that might point at a stranger who happens to share the
 * name, so they render as text.
 *
 * 76 pieces at the time of writing.
 */
export interface CuratedFanart {
  /** Stable key. Framer's filename, which does not change when the order does. */
  id: string;
  image: string;
  /** Display name, with the leading @ dropped. */
  artist: string;
  /** X handle, only where her page linked a profile for this person. */
  handle: string | null;
  /** That profile. Null when there is nothing to link. */
  href: string | null;
}

export const CURATED_FANART: readonly CuratedFanart[] = [
  {
    id: "framer:s1zJESPD9qssiO9Z92R6jMUzEU.png",
    image: "https://framerusercontent.com/images/s1zJESPD9qssiO9Z92R6jMUzEU.png?width=4600&height=2700",
    artist: "kzkazuu",
    handle: "kzkazuu",
    href: "https://x.com/kzkazuu",
  },
  {
    id: "framer:CbR7b2T98yi0brENmBMVVnt3h0.jpg",
    image: "https://framerusercontent.com/images/CbR7b2T98yi0brENmBMVVnt3h0.jpg?width=1335&height=2048",
    artist: "kevinlim39",
    handle: "kevinlim39",
    href: "https://x.com/kevinlim39",
  },
  {
    id: "framer:iPshSS6aLWenET4dHgpOOEpXOyg.jpg",
    image: "https://framerusercontent.com/images/iPshSS6aLWenET4dHgpOOEpXOyg.jpg?width=1536&height=2048",
    artist: "DavinciAkuma",
    handle: "DavinciAkuma",
    href: "https://x.com/DavinciAkuma",
  },
  {
    id: "framer:w3VCwAIeQImRr6lthnpqiiGEYVw.jpg",
    image: "https://framerusercontent.com/images/w3VCwAIeQImRr6lthnpqiiGEYVw.jpg?width=2676&height=3771",
    artist: "MaguroShouta",
    handle: "MaguroShouta",
    href: "https://x.com/MaguroShouta",
  },
  {
    id: "framer:wJUbfTHUnEllMuVRIXEopB0fvo.jpeg",
    image: "https://framerusercontent.com/images/wJUbfTHUnEllMuVRIXEopB0fvo.jpeg?width=2048&height=2048",
    artist: "ExileSyahputra",
    handle: "ExileSyahputra",
    href: "https://x.com/ExileSyahputra",
  },
  {
    id: "framer:zPNSeI2q7fI4pwdC1Azck5ZKU.jpeg",
    image: "https://framerusercontent.com/images/zPNSeI2q7fI4pwdC1Azck5ZKU.jpeg?width=1536&height=2048",
    artist: "ExileSyahputra",
    handle: "ExileSyahputra",
    href: "https://x.com/ExileSyahputra",
  },
  {
    id: "framer:DNifWGecBRq2E4oPCSsLfTWcfE.jpeg",
    image: "https://framerusercontent.com/images/DNifWGecBRq2E4oPCSsLfTWcfE.jpeg?width=1479&height=2252",
    artist: "ExileSyahputra",
    handle: "ExileSyahputra",
    href: "https://x.com/ExileSyahputra",
  },
  {
    id: "framer:SnFDujgLcieaKtV3C1OzhNOVwE.jpeg",
    image: "https://framerusercontent.com/images/SnFDujgLcieaKtV3C1OzhNOVwE.jpeg?width=2048&height=1259",
    artist: "ExileSyahputra",
    handle: "ExileSyahputra",
    href: "https://x.com/ExileSyahputra",
  },
  {
    id: "framer:CNunZEP08flkl01YXFA6AASMPig.jpg",
    image: "https://framerusercontent.com/images/CNunZEP08flkl01YXFA6AASMPig.jpg?width=2480&height=2953",
    artist: "GushikenMiya",
    handle: "GushikenMiya",
    href: "https://x.com/GushikenMiya",
  },
  {
    id: "framer:8BLP3PuTfoFqim6CRWWotEqiY.jpg",
    image: "https://framerusercontent.com/images/8BLP3PuTfoFqim6CRWWotEqiY.jpg?width=4096&height=2867",
    artist: "devil_norze",
    handle: "devil_norze",
    href: "https://x.com/devil_norze",
  },
  {
    id: "framer:I9aI63wsEvqULjIdhNTpCBhkIA.jpg",
    image: "https://framerusercontent.com/images/I9aI63wsEvqULjIdhNTpCBhkIA.jpg?width=2048&height=1152",
    artist: "Juupran",
    handle: "Juupran",
    href: "https://x.com/Juupran",
  },
  {
    id: "framer:pXcT4zUGrp5qj524mDOHpNVIg.jpg",
    image: "https://framerusercontent.com/images/pXcT4zUGrp5qj524mDOHpNVIg.jpg?width=1317&height=2048",
    artist: "Gowtherkyoko",
    handle: "Gowtherkyoko",
    href: "https://x.com/Gowtherkyoko",
  },
  {
    id: "framer:pJYrJ0bDJJxk7BW9rC3d7Q1emI.gif",
    image: "https://framerusercontent.com/images/pJYrJ0bDJJxk7BW9rC3d7Q1emI.gif?width=575&height=580",
    artist: "Ravennn893",
    handle: null,
    href: null,
  },
  {
    id: "framer:wMg0qSZiuuv5uxC78yEjbRUBPKc.jpeg",
    image: "https://framerusercontent.com/images/wMg0qSZiuuv5uxC78yEjbRUBPKc.jpeg?width=3800&height=3000",
    artist: "devil_norze",
    handle: "devil_norze",
    href: "https://x.com/devil_norze",
  },
  {
    id: "framer:O8Dsv5MdGfFzTFdo7Q5hFPdIo.jpeg",
    image: "https://framerusercontent.com/images/O8Dsv5MdGfFzTFdo7Q5hFPdIo.jpeg?width=2480&height=3508",
    artist: "BossNoMann",
    handle: "BossNoMann",
    href: "https://x.com/BossNoMann",
  },
  {
    id: "framer:zX7bMb7av5wy6TdRe6Bvlr8jw.jpeg",
    image: "https://framerusercontent.com/images/zX7bMb7av5wy6TdRe6Bvlr8jw.jpeg?width=3326&height=4096",
    artist: "dwinskyy",
    handle: "dwinskyy",
    href: "https://x.com/dwinskyy",
  },
  {
    id: "framer:yypKFrx1CLBWZfUaWys6VnvlKQ.jpg",
    image: "https://framerusercontent.com/images/yypKFrx1CLBWZfUaWys6VnvlKQ.jpg?width=2365&height=2160",
    artist: "Hira_Keiji",
    handle: "Hira_Keiji",
    href: "https://x.com/Hira_Keiji",
  },
  {
    id: "framer:K1Q7r9b9MWwE5RVma58TYOs8Os.png",
    image: "https://framerusercontent.com/images/K1Q7r9b9MWwE5RVma58TYOs8Os.png?width=1000&height=1000",
    artist: "JonaNiel12",
    handle: "JonaNiel12",
    href: "https://x.com/JonaNiel12",
  },
  {
    id: "framer:OxLGygZSMGyY6S1rPqB4nHm9Sg.png",
    image: "https://framerusercontent.com/images/OxLGygZSMGyY6S1rPqB4nHm9Sg.png?width=1280&height=1280",
    artist: "Ankerokun",
    handle: "Ankerokun",
    href: "https://x.com/Ankerokun",
  },
  {
    id: "framer:DafNoEGC3mO5I5P97xbhifDTc.jpg",
    image: "https://framerusercontent.com/images/DafNoEGC3mO5I5P97xbhifDTc.jpg?width=6000&height=8000",
    artist: "Farhan",
    handle: null,
    href: null,
  },
  {
    id: "framer:ZdJle69XEjz4UxVPp9W7sZYVFo.png",
    image: "https://framerusercontent.com/images/ZdJle69XEjz4UxVPp9W7sZYVFo.png?width=1600&height=1600",
    artist: "kangCakri",
    handle: "kangCakri",
    href: "https://x.com/KangCakri",
  },
  {
    id: "framer:Z4w7Sv3jqHYvB1TaUIK8S8HeTM.png",
    image: "https://framerusercontent.com/images/Z4w7Sv3jqHYvB1TaUIK8S8HeTM.png?width=360&height=825",
    artist: "King of Vtuber",
    handle: null,
    href: null,
  },
  {
    id: "framer:ZSosqKIZriNFVPeu731hbHzQbKc.png",
    image: "https://framerusercontent.com/images/ZSosqKIZriNFVPeu731hbHzQbKc.png?width=2075&height=2905",
    artist: "Ariras TR",
    handle: null,
    href: null,
  },
  {
    id: "framer:HSnaHmw4FnYpXVtGd9dsF5vYU.jpg",
    image: "https://framerusercontent.com/images/HSnaHmw4FnYpXVtGd9dsF5vYU.jpg?width=1246&height=1440",
    artist: "Rafly",
    handle: null,
    href: null,
  },
  {
    id: "framer:umPNL8ukvPf7kVbVfqALdyVMTdI.jpg",
    image: "https://framerusercontent.com/images/umPNL8ukvPf7kVbVfqALdyVMTdI.jpg?width=3000&height=4000",
    artist: "devil_norze",
    handle: "devil_norze",
    href: "https://x.com/devil_norze",
  },
  {
    id: "framer:xZRbeiuNeajs2iXz64o5zHllnt8.jpg",
    image: "https://framerusercontent.com/images/xZRbeiuNeajs2iXz64o5zHllnt8.jpg?width=1672&height=1912",
    artist: "capcaysin",
    handle: "capcaysin",
    href: "https://x.com/capcaysin",
  },
  {
    id: "framer:YYj1DSkOSca0IiRG3DNti17y3I.jpg",
    image: "https://framerusercontent.com/images/YYj1DSkOSca0IiRG3DNti17y3I.jpg?width=3277&height=4096",
    artist: "DavinciAkuma",
    handle: "DavinciAkuma",
    href: "https://x.com/DavinciAkuma",
  },
  {
    id: "framer:IzvpzgOf6lQWPa1PTU4yH6UeGU0.jpg",
    image: "https://framerusercontent.com/images/IzvpzgOf6lQWPa1PTU4yH6UeGU0.jpg?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:c76CCQdbgNEmm52zkGL7Q2KCVE.jpg",
    image: "https://framerusercontent.com/images/c76CCQdbgNEmm52zkGL7Q2KCVE.jpg?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:SCeyWybgCdLr2S2BPSvdOk7HFQ.jpg",
    image: "https://framerusercontent.com/images/SCeyWybgCdLr2S2BPSvdOk7HFQ.jpg?width=2048&height=1792",
    artist: "OphioHebi",
    handle: "OphioHebi",
    href: "https://x.com/OphioHebi",
  },
  {
    id: "framer:KlUHIh3M2AEitmXs667FzCw8pQ.jpg",
    image: "https://framerusercontent.com/images/KlUHIh3M2AEitmXs667FzCw8pQ.jpg?width=2048&height=2048",
    artist: "DimensionCosmo",
    handle: "DimensionCosmo",
    href: "https://x.com/DimensionCosmo",
  },
  {
    id: "framer:9vaitZdknR4kXL5rdCji8m228.jpg",
    image: "https://framerusercontent.com/images/9vaitZdknR4kXL5rdCji8m228.jpg?width=895&height=894",
    artist: "CaptainRunee",
    handle: "CaptainRunee",
    href: "https://x.com/CaptainRunee",
  },
  {
    id: "framer:YgEGPozyUfwqDq9BmggmE3Vg.jpg",
    image: "https://framerusercontent.com/images/YgEGPozyUfwqDq9BmggmE3Vg.jpg?width=1142&height=2028",
    artist: "anyabunbun",
    handle: "anyabunbun",
    href: "https://x.com/anyabunbun",
  },
  {
    id: "framer:8HHEiFvnYfFiO9XsHIL0BnPlOMY.jpg",
    image: "https://framerusercontent.com/images/8HHEiFvnYfFiO9XsHIL0BnPlOMY.jpg?width=2926&height=4096",
    artist: "devil_norze",
    handle: "devil_norze",
    href: "https://x.com/devil_norze",
  },
  {
    id: "framer:uhda8DlgMlDivs7TRfHRYqigk.png",
    image: "https://framerusercontent.com/images/uhda8DlgMlDivs7TRfHRYqigk.png?width=1200&height=1200",
    artist: "JonaNiel12",
    handle: "JonaNiel12",
    href: "https://x.com/JonaNiel12",
  },
  {
    id: "framer:CdgHUW673mu1UyEpesTklHoouU.png",
    image: "https://framerusercontent.com/images/CdgHUW673mu1UyEpesTklHoouU.png?width=2228&height=1152",
    artist: "appliedlalala",
    handle: null,
    href: null,
  },
  {
    id: "framer:tobu0ohq9Dvvncijh6CwOhC3DeI.png",
    image: "https://framerusercontent.com/images/tobu0ohq9Dvvncijh6CwOhC3DeI.png?width=1540&height=1570",
    artist: "JonaNiel12",
    handle: "JonaNiel12",
    href: "https://x.com/JonaNiel12",
  },
  {
    id: "framer:Lu2azq0HC8cgYXU8CMve87iQuM.png",
    image: "https://framerusercontent.com/images/Lu2azq0HC8cgYXU8CMve87iQuM.png?width=1080&height=1350",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:1AwA2vv4QRsv81zDj5vxSOlbWnA.png",
    image: "https://framerusercontent.com/images/1AwA2vv4QRsv81zDj5vxSOlbWnA.png?width=2048&height=2048",
    artist: "Ilhan_Mlds",
    handle: "Ilhan_Mlds",
    href: "https://x.com/Ilhan_Mlds",
  },
  {
    id: "framer:2UIHxHLiV77myqpSM5sN4IAyE.png",
    image: "https://framerusercontent.com/images/2UIHxHLiV77myqpSM5sN4IAyE.png?width=768&height=1024",
    artist: "Shirozora",
    handle: null,
    href: null,
  },
  {
    id: "framer:UFcuqXk9IdEjolhDc7odVKZ8Y04.png",
    image: "https://framerusercontent.com/images/UFcuqXk9IdEjolhDc7odVKZ8Y04.png?width=1080&height=1350",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:VjgEzXqafPDvQheXSJvEzCIOJM.png",
    image: "https://framerusercontent.com/images/VjgEzXqafPDvQheXSJvEzCIOJM.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:uHFhDNDUwwYAhBmUvq4k8A8Mo.png",
    image: "https://framerusercontent.com/images/uHFhDNDUwwYAhBmUvq4k8A8Mo.png?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:1PsTZS4SNvwp7TmvO8qlNLskK1o.png",
    image: "https://framerusercontent.com/images/1PsTZS4SNvwp7TmvO8qlNLskK1o.png?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:IyKky2ZvTbdAiSRirvcUR4W2A.png",
    image: "https://framerusercontent.com/images/IyKky2ZvTbdAiSRirvcUR4W2A.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:QB9ypZjZGfmLhIlPTDuI9MQT5Q.jpg",
    image: "https://framerusercontent.com/images/QB9ypZjZGfmLhIlPTDuI9MQT5Q.jpg?width=1024&height=1024",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:HZvuNSSW1UKebJA5z5WtktqSjM.png",
    image: "https://framerusercontent.com/images/HZvuNSSW1UKebJA5z5WtktqSjM.png?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:JEs0bULNYs4lmZL9sSJ4HQsI.png",
    image: "https://framerusercontent.com/images/JEs0bULNYs4lmZL9sSJ4HQsI.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:uLhY3lfNR2xI3xZ2z2Q8ZiEMmg.png",
    image: "https://framerusercontent.com/images/uLhY3lfNR2xI3xZ2z2Q8ZiEMmg.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:7ulj8ek8QBiIBFrQ9F7LNdJUgCg.png",
    image: "https://framerusercontent.com/images/7ulj8ek8QBiIBFrQ9F7LNdJUgCg.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:Xs8qTM68bs3lFctAvl86DCpYJ6g.png",
    image: "https://framerusercontent.com/images/Xs8qTM68bs3lFctAvl86DCpYJ6g.png?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:MD5CP0erzOr0lfegNL83JZoJo.png",
    image: "https://framerusercontent.com/images/MD5CP0erzOr0lfegNL83JZoJo.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:rgSUspT1rin7CKAawxGg75EKWDg.jpg",
    image: "https://framerusercontent.com/images/rgSUspT1rin7CKAawxGg75EKWDg.jpg?width=3508&height=4961",
    artist: "BossNoMann",
    handle: "BossNoMann",
    href: "https://x.com/BossNoMann",
  },
  {
    id: "framer:cMi8ObuM9LrBrY6r1oilNvc5syg.png",
    image: "https://framerusercontent.com/images/cMi8ObuM9LrBrY6r1oilNvc5syg.png?width=2048&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:P3W6odSlsg8bv4NURzM21rQeSVg.png",
    image: "https://framerusercontent.com/images/P3W6odSlsg8bv4NURzM21rQeSVg.png?width=1536&height=2048",
    artist: "APpiippo",
    handle: "APpiippo",
    href: "https://x.com/APpiippo",
  },
  {
    id: "framer:NMK6azvT3P8G9FZ5qEV3f9Cs.jpg",
    image: "https://framerusercontent.com/images/NMK6azvT3P8G9FZ5qEV3f9Cs.jpg?width=2739&height=3657",
    artist: "WenLau",
    handle: null,
    href: null,
  },
  {
    id: "framer:lpvf1cu2v8OBuKSOtremW3uXJoc.png",
    image: "https://framerusercontent.com/images/lpvf1cu2v8OBuKSOtremW3uXJoc.png?width=540&height=960",
    artist: "Pivot Trooper",
    handle: null,
    href: null,
  },
  {
    id: "framer:pt37Ecic5PzIq8yQztLm3aMtfbk.png",
    image: "https://framerusercontent.com/images/pt37Ecic5PzIq8yQztLm3aMtfbk.png?width=960&height=960",
    artist: "Pivot Trooper",
    handle: null,
    href: null,
  },
  {
    id: "framer:UXGkRdizPz8qTDxnKSmu3BBg.png",
    image: "https://framerusercontent.com/images/UXGkRdizPz8qTDxnKSmu3BBg.png?width=2000&height=2000",
    artist: "priyo_mw",
    handle: "priyo_mw",
    href: "https://x.com/priyo_mw",
  },
  {
    id: "framer:OEuTvV7ppvU4KoTcZb7G2VxvWnY.png",
    image: "https://framerusercontent.com/images/OEuTvV7ppvU4KoTcZb7G2VxvWnY.png?width=1698&height=2400",
    artist: "kazootoku",
    handle: "kazootoku",
    href: "https://x.com/kazootoku",
  },
  {
    id: "framer:Tu4mF0zf9QRbCodanfTXgUJIJbI.png",
    image: "https://framerusercontent.com/images/Tu4mF0zf9QRbCodanfTXgUJIJbI.png?width=1920&height=1080",
    artist: "kazootoku",
    handle: "kazootoku",
    href: "https://x.com/kazootoku",
  },
  {
    id: "framer:outL30LYwDsliZF7MlrtOwUyAdk.png",
    image: "https://framerusercontent.com/images/outL30LYwDsliZF7MlrtOwUyAdk.png?width=500&height=500",
    artist: "JonaNiel12",
    handle: "JonaNiel12",
    href: "https://x.com/JonaNiel12",
  },
  {
    id: "framer:Hm4kssnLpKBWeocfq6ngzFsne4.png",
    image: "https://framerusercontent.com/images/Hm4kssnLpKBWeocfq6ngzFsne4.png?width=2015&height=1748",
    artist: "Suzume",
    handle: null,
    href: null,
  },
  {
    id: "framer:fqK5yEzVb8kzNuSrK4rLUZhags.png",
    image: "https://framerusercontent.com/images/fqK5yEzVb8kzNuSrK4rLUZhags.png?width=500&height=500",
    artist: "JonaNiel12",
    handle: "JonaNiel12",
    href: "https://x.com/JonaNiel12",
  },
  {
    id: "framer:OYhwvWGdlt2ZvjXXCyJNBTirvNA.png",
    image: "https://framerusercontent.com/images/OYhwvWGdlt2ZvjXXCyJNBTirvNA.png?width=1200&height=1200",
    artist: "MolenCaramel",
    handle: "MolenCaramel",
    href: "https://x.com/MolenCaramel",
  },
  {
    id: "framer:JJkbNEL0WmqtUm5KHUU1BL16N4.png",
    image: "https://framerusercontent.com/images/JJkbNEL0WmqtUm5KHUU1BL16N4.png?width=1536&height=2048",
    artist: "Halley",
    handle: null,
    href: null,
  },
  {
    id: "framer:IroukTiqUDwEFVFArjL8vwi9EA.png",
    image: "https://framerusercontent.com/images/IroukTiqUDwEFVFArjL8vwi9EA.png?width=2480&height=3508",
    artist: "Kala",
    handle: null,
    href: null,
  },
  {
    id: "framer:iiO7hb2MeIiagvQtCu5nLkzDXc.jpg",
    image: "https://framerusercontent.com/images/iiO7hb2MeIiagvQtCu5nLkzDXc.jpg?width=1813&height=2048",
    artist: "?!?!!??!",
    handle: null,
    href: null,
  },
  {
    id: "framer:63LvSfbP4LZUikTG8yIT2YlFa4Q.png",
    image: "https://framerusercontent.com/images/63LvSfbP4LZUikTG8yIT2YlFa4Q.png?width=3000&height=3000",
    artist: "graneliers",
    handle: "graneliers",
    href: "https://x.com/graneliers",
  },
  {
    id: "framer:O1WakCmZkE4MfJrQ42h1yjUZs.png",
    image: "https://framerusercontent.com/images/O1WakCmZkE4MfJrQ42h1yjUZs.png?width=2100&height=2200",
    artist: "OphioHebi",
    handle: "OphioHebi",
    href: "https://x.com/OphioHebi",
  },
  {
    id: "framer:t9jIg07g1NUtwjehW9yKSMwnqo.png",
    image: "https://framerusercontent.com/images/t9jIg07g1NUtwjehW9yKSMwnqo.png?width=1024&height=1024",
    artist: "Ethel",
    handle: null,
    href: null,
  },
  {
    id: "framer:n0QYpRgAJhgQsVDM9Q6EAOkpVg.jpg",
    image: "https://framerusercontent.com/images/n0QYpRgAJhgQsVDM9Q6EAOkpVg.jpg?width=1000&height=1000",
    artist: "CursedHolo",
    handle: "CursedHolo",
    href: "https://x.com/CursedHolo",
  },
  {
    id: "framer:S2LeBCgctEsGcLxhc3QvJ3TAoxk.jpg",
    image: "https://framerusercontent.com/images/S2LeBCgctEsGcLxhc3QvJ3TAoxk.jpg?width=806&height=716",
    artist: "capcaysin",
    handle: "capcaysin",
    href: "https://x.com/capcaysin",
  },
  {
    id: "framer:jzsAmwNRzKFMFKGPlSZzi4tNFlk.png",
    image: "https://framerusercontent.com/images/jzsAmwNRzKFMFKGPlSZzi4tNFlk.png?width=1024&height=1536",
    artist: "kazootoku",
    handle: "kazootoku",
    href: "https://x.com/kazootoku",
  },
  {
    id: "framer:Nv3P3P9TYSJFmYmVjQbIThvXxI.png",
    image: "https://framerusercontent.com/images/Nv3P3P9TYSJFmYmVjQbIThvXxI.png?width=1149&height=790",
    artist: "Keana Alya",
    handle: null,
    href: null,
  },
  {
    id: "framer:NHW6BxMe6skoHJioZV5bQOgTs.jpg",
    image: "https://framerusercontent.com/images/NHW6BxMe6skoHJioZV5bQOgTs.jpg?width=1536&height=2048",
    artist: "MurahaArt",
    handle: "MurahaArt",
    href: "https://x.com/MurahaArt",
  },
];

/**
 * Posts to drop from the #MoonivArt feed, because the artwork is already above.
 *
 * Found by comparing both sets perceptually rather than by URL: Framer and Twitter
 * host the same image under completely different names, so no string comparison
 * could ever have matched them. Eleven of the seventy-six curated pieces also turn
 * up in the hashtag feed -- six of them because Sierra herself reposted them -- so
 * without this the wall shows eleven pictures twice.
 *
 * Twelve ids rather than eleven, because BossNoMann's piece is in the feed twice
 * over: Sierra reposted it, Twitter kept the original media id, and both posts
 * carry the same image.
 *
 * These are post ids rather than artwork signatures because of which side has to
 * give way. The curated entry is the durable record: it is in the repository, it
 * is credited, and it cannot scroll out of anything. A hashtag post can. Dropping
 * the fetched copy means that if the post later falls out of the feed the artwork
 * stays on the page; dropping the curated copy instead would delete a piece of her
 * archive because a retweet expired.
 *
 * The trade-off: if the same artwork is ever posted under a *new* id, this list
 * will not catch it. That is accepted rather than solved -- matching on pixels
 * needs every image on the page downloaded and hashed at render time, which is a
 * lot of work to hide a duplicate that a curator would fix in one edit.
 */
export const DUPLICATE_POST_IDS: ReadonlySet<string> = new Set([
  "1993158831329915216",
  "1993158843623522813",
  "1993158835192869071",
  "2003317221154771121",
  "1993158848073679199",
  "2001950319966838888",
  "1993158826561093693",
  "2002323320629571739",
  "1993158854037979632",
  "2001441533107802375",
  // One piece, two posts: Sierra reposted BossNoMann's art and Twitter kept the
  // original media id, so both copies carry the same image and both have to go.
  "1993320134703038963",
  "1993308709934842087",
]);
