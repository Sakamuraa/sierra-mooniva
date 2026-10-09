import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";

import { outfits, type Outfit } from "@/content/outfits";

/**
 * Outfit lightbox.
 *
 * A close-up slider over the model renders, opened by clicking an outfit card.
 *
 * Why renders and not the character sheet: the sheet is a 16:9 document with six
 * poses on it, and zooming it shows you part of a wall of artwork. The credits
 * page carries the same outfits as isolated model renders on a transparent
 * background, which is what a close-up is for. Those are pre-cut, so nothing here
 * has to remove a background at runtime.
 *
 * Animation is anime.js, deliberately alongside the Motion-based scroll reveals
 * rather than instead of them. The two do different jobs and neither subsumes the
 * other: Motion drives elements in as the page scrolls, anime.js drives a
 * one-shot transition between two images that already exist. Motion has no
 * timeline primitive for that without hand-rolling the sequencing.
 *
 * Flat traversal rather than a nested slider per outfit. Outfits have one to four
 * renders each, so a nested control would mean two levels of prev/next to learn
 * for no gain; the dots group by outfit so it is still obvious where you are.
 */

/** One entry per render, carrying the outfit it belongs to. */
type Slide = {
  outfit: Outfit;
  /** Index within that outfit's own renders, for the dots. */
  inOutfit: number;
  src: string;
};

const SLIDES: Slide[] = outfits.flatMap((outfit) =>
  outfit.renders.map((src, inOutfit) => ({ outfit, inOutfit, src })),
);

export function OutfitLightbox({
  openIndex,
  onClose,
}: {
  /** Which outfit card was clicked, or null when the lightbox is shut. */
  openIndex: number | null;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const [busy, setBusy] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = openIndex !== null;
  const current = SLIDES[slide];

  /** Where the first render of the clicked outfit sits in the flat list. */
  const startFor = useCallback((outfitIndex: number) => {
    let at = 0;
    for (let i = 0; i < outfitIndex && i < outfits.length; i++) at += outfits[i].renders.length;
    return at;
  }, []);

  // ---- open / close animation -------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    setSlide(startFor(openIndex));

    if (reduceMotion) {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
      panel.style.transform = "none";
      closeRef.current?.focus();
      return;
    }

    animate(overlay, { opacity: [0, 1], duration: 260, ease: "outQuad" });
    animate(panel, {
      opacity: [0, 1],
      scale: [0.94, 1],
      duration: 420,
      ease: "out(3)",
    });

    closeRef.current?.focus();
  }, [isOpen, openIndex, reduceMotion, startFor]);

  /**
   * Closing animates out and only then unmounts.
   *
   * Unmounting on the click would make the exit a hard cut, and a modal that
   * vanishes is disorienting in a way a modal that fades is not. `dismissRef`
   * keeps a programmatic close -- Escape, a back navigation -- on the same path
   * as the button rather than only animating one of them.
   */
  const dismissRef = useRef(onClose);
  dismissRef.current = onClose;

  const close = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (reduceMotion || !overlay || !panel) {
      dismissRef.current();
      return;
    }
    setBusy(true);
    animate(panel, { opacity: 0, scale: 0.96, duration: 200, ease: "in(2)" });
    animate(overlay, {
      opacity: 0,
      duration: 220,
      ease: "inQuad",
      onComplete: () => {
        setBusy(false);
        dismissRef.current();
      },
    });
  }, [reduceMotion]);

  // ---- stepping ---------------------------------------------------------
  /**
   * Step within the open outfit only.
   *
   * The traversal is deliberately bounded by the current outfit rather than
   * wrapping over every render on the page. Stepping past the last render of one
   * outfit silently became the first render of the next, which meant the heading
   * and the credit list changed underneath a control that reads as "slide within
   * this outfit". Moving between outfits is what opening that outfit's card is
   * for, and the dots show exactly where you are inside the current one.
   */
  const go = useCallback(
    (delta: number) => {
      if (busy) return;

      const first = SLIDES.findIndex((s) => s.outfit.slug === current.outfit.slug);
      const last = first + current.outfit.renders.length - 1;
      if (first < 0) return;

      // Clamp, and bounce back to the same end rather than wrapping. Wrapping
      // here would be the old behaviour in miniature: pressing next on the last
      // render would jump to the first instead of refusing to move.
      const next = slide + delta;
      if (next < first || next > last) return;

      setSlide(next);

      const figure = figureRef.current;
      if (!figure || reduceMotion) return;

      // Slide in the direction of travel, so "next" reads as forward motion
      // rather than as an unrelated crossfade.
      animate(figure, {
        opacity: [0, 1],
        x: [delta > 0 ? 36 : -36, 0],
        duration: 320,
        ease: "out(3)",
      });
    },
    [busy, current.outfit, reduceMotion, slide],
  );

  // ---- keyboard ---------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Tab") {
        // Keep focus inside. Only four focusable things here, so this is cheap
        // and it stops Tab from walking into the page behind the modal.
        event.preventDefault();
        const focusable = [closeRef.current];
        const step = event.shiftKey ? -1 : 1;
        const at = focusable.findIndex((el) => el === document.activeElement);
        const nextIndex = (at + step + focusable.length) % focusable.length;
        focusable[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, go, isOpen]);

  // ---- scroll lock ------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen || !current) return null;

  const outfitDots = current.outfit.renders.length;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.outfit.name} — model close-up`}
      /*
 * Fully opaque, not `bg-black/92`.
 *
 * At 92% the page behind stays faintly legible -- measured, a white page pixel
 * came through at (23,23,23) rather than (0,0,0) -- which reads as the outfit
 * cards showing through the model. Opaque is what the viewer is for, and it is
 * also what stops the page scrolling behind from flickering at the edges.
 */
className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 sm:p-8"
      onClick={(event) => {
        // Only a click on the backdrop itself closes. A click that started
        // inside and ended outside -- a drag-release over the backdrop -- must
        // not dismiss the thing the visitor is reading.
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center"
      >
        <div className="relative">
          <div
            ref={stageRef}
            className="relative flex h-[52vh] items-center justify-center overflow-hidden sm:h-[60vh]"
          >
            <div ref={figureRef} className="flex h-full w-full items-center justify-center">
              <img
                key={current.src}
                src={current.src}
                alt={`${current.outfit.name} — model ${current.inOutfit + 1}`}
                className="max-h-full w-auto max-w-full object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
              />
            </div>

            {/*
   Arrows only when there is somewhere to go. An outfit with a single render --
   Office has one -- would otherwise show two controls that do nothing, and a
   button that ignores you is worse than no button.
 */}
{outfitDots > 1 && (
              <>
                <StepButton side="left" onClick={() => go(-1)} label="Sebelumnya" />
                <StepButton side="right" onClick={() => go(1)} label="Berikutnya" />
              </>
            )}

            {/* Dots, grouped by outfit: this render is the 2nd of 4 on a 4-render
                outfit, and the group boundary is visible. */}
            {outfitDots > 1 && (
              <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
                {Array.from({ length: outfitDots }, (_, n) => {
                  const at = SLIDES.findIndex((s) => s.outfit === current.outfit && s.inOutfit === n);
                  const active = at === slide;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        if (busy) return;
                        setSlide(at);
                        const figure = figureRef.current;
                        if (figure && !reduceMotion) {
                          animate(figure, { opacity: [0, 1], duration: 260, ease: "out(3)" });
                        }
                      }}
                      aria-label={`Render ${n + 1} dari ${outfitDots}`}
                      aria-current={active ? "true" : undefined}
                      className={`size-2 rounded-full border transition-colors ${
                        active
                          ? "border-gold bg-gold"
                          : "border-white/45 bg-transparent hover:border-white/80"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="text-left lg:pl-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Sierra Mooniva {current.outfit.name}
          </h2>

          {/* Chibi carries no ordinal, so it must not print an empty one. */}
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/55">
            {[current.outfit.ordinal, `${current.inOutfit + 1} dari ${outfitDots}`]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <dl className="mt-5 space-y-1.5">
            {current.outfit.credits.map((credit) => (
              <div key={`${credit.role}-${credit.name}`} className="text-sm">
                <dt className="inline text-white/60">{credit.role}: </dt>
                <dd className="inline text-white/90">{credit.name}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-white/45">
            {current.outfit.original}.
            {current.outfit.image && " Sheet karakter ada di halaman outfit."}
          </p>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Tutup"
          className="absolute -top-2 right-0 inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-top-4 sm:-right-4"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function StepButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  const Icon = side === "left" ? CaretLeft : CaretRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/85 backdrop-blur-sm transition-colors hover:border-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      <Icon size={22} aria-hidden="true" />
    </button>
  );
}

/** Read once, then subscribe, so the effect does not re-run on every scroll. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}