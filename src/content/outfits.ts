/**
 * Outfit sheets.
 *
 * Provenance, because nothing here should have to be trusted on faith:
 *   - name, image ............ sierramooniva.framer.website/outfit, rendered.
 *     The page ships no server HTML for its images -- the payload contains only
 *     SVG and RichTextContainer nodes and every sheet mounts client-side -- so
 *     the page was opened in a browser and read in document order.
 *   - credits ................ sierramooniva.framer.website/credits
 *   - order .................. newest first, derived from "Sixth" down to "First"
 *
 * The sheet images sit directly ABOVE their heading on the source page, which is
 * the only reason the pairing is trustworthy. An earlier pass paired them by raw
 * offset in the HTML instead and came out one row off, which had "Metal/rock"
 * wearing the maid outfit.
 *
 * Her own headings are inconsistent -- "First outfit", "Second outfit theme",
 * "Third Outfit Theme" -- so `name` is normalised to a clean label and `original`
 * keeps the exact wording. Fixing the capitalisation is fine; quietly changing
 * "motorcyle" is not, so that spelling stays.
 */

export type Outfit = {
  /** Stable key. Also the filename stem for renders under public/media/outfit. */
  slug: "office" | "casual" | "metal" | "maid" | "kimono" | "medieval" | "chibi";
  /** Clean label for display. */
  name: string;
  /** Her own heading, verbatim, for anyone who wants the exact wording. */
  original: string;
  /** Order on her own site, as written. Empty where she does not number it. */
  ordinal: string;
  /**
   * The flat character sheet, or null where there is none.
   *
   * Chibi has no sheet of its own -- the outfit page never lists it, because it
   * is not one of the six numbered outfits. It exists only on the credits page,
   * as renders. Null rather than a placeholder path so the card can fall back to
   * showing a render instead of pointing at a file that is not there.
   */
  image: string | null;
  alt: string;
  /** Role/name pairs, from the credits page. Empty where she lists none. */
  credits: ReadonlyArray<{ role: string; name: string }>;
  /**
   * Model renders, for the lightbox.
   *
   * From the credits page rather than the outfit page: the outfit page carries
   * only the flat character sheets, while the credits page shows each outfit as
   * a running model on a transparent background. Those are what a close-up wants.
   *
   * Order is the credits page's own order, which is also the order they were
   * presented in. Filenames are `{slug}-{n}.webp` under public/media/outfit.
   */
  renders: readonly string[];
};

/**
 * Newest first.
 *
 * "Sixth Outfit Theme: Medieval Fantasy" is the most recent by her own numbering,
 * so it leads. The source page itself is not in that order -- it opens with
 * "Second outfit theme" -- and reproducing that would mean presenting the oldest
 * outfit as the newest.
 */
export const outfits: readonly Outfit[] = [
  {
    slug: "medieval",
    name: "Medieval Fantasy",
    original: "Sixth Outfit Theme: Medieval Fantasy (Alternative)",
    ordinal: "Sixth",
    image: "/media/outfit/medieval.webp",
    alt: "Sheet karakter Sierra Mooniva berpakaian Medieval Fantasy: mantel panjang, aksesoris kompas, naga kecil bersayap merah",
    credits: [{ role: "Character Sheets", name: "DavinciAkuma" }],
    renders: ["/media/outfit/medieval-1.webp", "/media/outfit/medieval-2.webp"],
  },
  {
    slug: "kimono",
    name: "Japanese Kimono",
    original: "Fifth Outfit Theme: Japanese Kimono",
    ordinal: "Fifth",
    image: "/media/outfit/kimono.webp",
    alt: "Sheet karakter Sierra Mooniva berpakaian kimono Jepang merah dan hitam dengan anting merah",
    credits: [{ role: "L2D", name: "Ruc_kaa" }],
    renders: ["/media/outfit/kimono-1.webp", "/media/outfit/kimono-2.webp"],
  },
  {
    slug: "maid",
    name: "Maid",
    original: "Fourth Outfit Theme: Maid",
    ordinal: "Fourth",
    image: "/media/outfit/maid.webp",
    alt: "Sheet karakter Sierra Mooniva berpakaian maid dengan telinga kucing dan pita",
    credits: [
      { role: "L2D", name: "Suzume" },
      { role: "Rigger", name: "Suzume" },
    ],
    renders: ["/media/outfit/maid-1.webp", "/media/outfit/maid-2.webp"],
  },
  {
    slug: "metal",
    name: "Metal / Rock",
    original: "Third Outfit Theme: Metal/rock/motorcyle",
    ordinal: "Third",
    image: "/media/outfit/metal.webp",
    alt: "Sheet karakter Sierra Mooniva berpakaian metal dan rock: jaket kulit hitam, rantai, dan kacamata merah",
    credits: [
      { role: "Character Sheets", name: "DavinciAkuma" },
      { role: "Rigger", name: "Aino" },
    ],
    renders: [
      "/media/outfit/metal-1.webp",
      "/media/outfit/metal-2.webp",
      "/media/outfit/metal-3.webp",
      "/media/outfit/metal-4.webp",
    ],
  },
  {
    slug: "casual",
    name: "Casual / Date",
    original: "Second outfit theme: Casual/date",
    ordinal: "Second",
    image: "/media/outfit/casual.webp",
    alt: "Sheet karakter Sierra Mooniva berpakaian kasual: atasan putih tanpa lengan dan rok hitam",
    credits: [{ role: "Stylist", name: "DavinciAkuma" }],
    renders: ["/media/outfit/casual-1.webp", "/media/outfit/casual-2.webp"],
  },
  {
slug: "office",
    name: "Office",
    original: "First outfit: Office",
    ordinal: "First",
    image: "/media/outfit/office.webp",
    alt: "Sheet karakter Sierra Mooniva sebagai sekretaris kantor: kemeja putih, dasi hitam, dan suspender",
    credits: [
      { role: "L2D", name: "Sierra Mooniva" },
      { role: "Rigger", name: "Noe Hakase" },
    ],
    renders: ["/media/outfit/office-1.webp", "/media/outfit/office-2.webp"],
  },

  /*
    Chibi last, and unnumbered.
    She calls it "Sierra Mooniva Chibi Ver." on the credits page and gives it no
    place in the First..Sixth run on the outfit page -- it is a model variant, not
    a seventh outfit. So it carries no ordinal and no sheet, and sits after the
    numbered six rather than being slotted into a sequence it is not part of.
  */
  {
    slug: "chibi",
    name: "Chibi",
    original: "Sierra Mooniva Chibi Ver.",
    ordinal: "",
    image: null,
    alt: "",
    credits: [
      { role: "L2D", name: "Sierra Mooniva" },
      { role: "Rigger", name: "Aino" },
    ],
    renders: ["/media/outfit/chibi-1.webp", "/media/outfit/chibi-2.webp"],
  },
] as const;

/** Where the sheets come from, for the page's own attribution line. */
export const outfitSource = {
  label: "sierramooniva.framer.website/outfit",
  url: "https://sierramooniva.framer.website/outfit",
  creditsUrl: "https://sierramooniva.framer.website/credits",
} as const;