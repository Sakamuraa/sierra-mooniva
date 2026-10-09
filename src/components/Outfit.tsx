import { useState } from "react";
import { ArrowSquareOut, ArrowsOut, Palette } from "@phosphor-icons/react";

import { Reveal, StaggerGroup, StaggerItem } from "@/lib/reveal";
import { outfitSource, outfits } from "@/content/outfits";
import { OutfitLightbox } from "@/components/OutfitLightbox";

/**
 * Outfit sheets.
 *
 * One entry per outfit, newest first, each carrying the credit the credits page
 * lists for it. The art belongs to Sierra and to the people who drew it, so
 * every card links back to the page it came from and names whoever made it.
 *
 * Images are held locally in public/media/outfit rather than hotlinked from
 * Framer. The source page is a client-rendered Framer build, so its asset URLs
 * are not stable enough to depend on, and a fan page should not empty itself
 * because someone reorganised their own site.
 *
 * Layout: one sheet per row on narrow screens, two across from md. The sheets are
 * 16:9 and read as landscape documents, so a two-up keeps them large enough to
 * actually see the detail rather than shrinking six of them into a tile grid.
 */
export function Outfit() {
  // Which card was clicked, or null when the lightbox is shut. An index rather
  // than a slug because the lightbox opens on the clicked outfit's first render
  // and then walks a flat list from there.
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="isi-outfit" aria-labelledby="outfit-heading" className="pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="shell">
        <Reveal amount={0.3}>
          <p className="text-sm font-medium text-accent">Semua yang pernah dipakai</p>
          <h1
            id="outfit-heading"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
          >
            Outfit
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-fg-muted md:text-lg">
            Enam setelan, dari yang terbaru. Klik setelan untuk melihat modelnya
            lebih dekat. Sheet karakter dan kreditnya diambil dari halaman miliknya
            sendiri.
          </p>
        </Reveal>

        <StaggerGroup
          className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2"
          stagger={0.05}
          amount={0.02}
        >
          {outfits.map((outfit, index) => (
            <StaggerItem key={outfit.slug} className="min-w-0">
              <OutfitCard outfit={outfit} onOpen={() => setLightbox(index)} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal amount={0.2} delay={0.05}>
          <p className="mt-14 text-xs leading-relaxed text-fg-subtle">
            Sheet karakter milik Sierra Mooniva. Keterangan tambahan ada di{" "}
            <a
              href={outfitSource.creditsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-fg"
            >
              halaman kredit
            </a>
            .
          </p>
        </Reveal>
      </div>

      <OutfitLightbox openIndex={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}

function OutfitCard({
  outfit,
  onOpen,
}: {
  outfit: (typeof outfits)[number];
  onOpen: () => void;
}) {
  return (
    <article className="flex flex-col">
      {/*
        The whole card opens the lightbox, so the click target is the sheet
        rather than a small icon in the corner of it. Kept as a button rather
        than a div so it is reachable by keyboard and announced as activatable.
      */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Perbesar ${outfit.name}`}
        className="group relative block overflow-hidden rounded-card border border-line bg-surface-deep text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* Chibi has no character sheet, so its card shows a render instead.
            Same control, same lightbox -- just a different picture to open from. */}
        <img
          src={outfit.image ?? outfit.renders[0]}
          alt={outfit.image ? outfit.alt : `${outfit.name} — model ${outfit.renders.length} render`}
          width={outfit.image ? 1600 : 900}
          height={outfit.image ? 900 : 900}
          loading="lazy"
          decoding="async"
          className={`w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
            outfit.image ? "" : "object-contain p-6"
          }`}
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-btn bg-black/70 px-2.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
          <ArrowsOut size={13} aria-hidden="true" />
          Perbesar
        </span>
      </button>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
          {outfit.name}
        </h2>
        {outfit.ordinal && (
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">
            {outfit.ordinal}
          </span>
        )}
      </div>

      {/* Her exact heading, where it differs from the label above. The source is
          inconsistent -- "First outfit", "Second outfit theme", "Third Outfit
          Theme" -- and quietly normalising that would lose what she actually
          wrote. */}
      <p className="mt-1.5 text-sm text-fg-subtle">{outfit.original}</p>

      {outfit.credits.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-subtle">
          {outfit.credits.map((credit) => (
            <li key={`${credit.role}-${credit.name}`}>
              <span className="text-fg-muted">{credit.role}:</span> {credit.name}
            </li>
          ))}
        </ul>
      )}

      <a
        href={outfitSource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 self-start text-xs text-fg-subtle transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Palette size={13} aria-hidden="true" />
        <span>Lihat di situs aslinya</span>
        <ArrowSquareOut size={12} aria-hidden="true" />
      </a>
    </article>
  );
}