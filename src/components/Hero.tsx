import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { ActionLink } from "@/components/Action";
import { XMark, YoutubeMark } from "@/components/ChannelIcons";
import { channels, site } from "@/content/site";
import { asset } from "@/lib/paths";
import { EASE_OUT_EXPO } from "@/lib/reveal-motion";

/**
 * Letterhead hero.
 *
 * Deliberately not the arch-split hero this site was cloned from. That one was
 * built for a soft, rounded, pastel character: a big arch frame on the right and
 * a soft curve carrying every corner. This palette and this character want the
 * opposite language — a monarch's letterhead, a secretary's dossier — so the
 * hero is a framed document instead:
 *
 *   - the whole hero is one hairline-bordered panel, not two floating columns
 *   - gold rules divide the panel into header / name / bio / actions, so the
 *     sections read as fields on a form rather than as a page's worth of blocks
 *   - the name is set in the didone at display size, which is where Bodoni earns
 *     its contrast; the same face at body size would be unreadable
 *
 * The artwork sits behind the whole panel rather than beside it. Beside is what
 * it used to do, and it read as a document with a photo stapled to it; behind is
 * what puts the artwork in the room rather than in a frame next to the room.
 *
 * Height is `min-h-[calc(100dvh-4rem)]`, never `h-screen`, so a collapsing mobile
 * address bar cannot clip the actions.
 */
/**
 * The dark theme's text tokens, applied to the panel while artwork is showing.
 *
 * Declared at module scope rather than inline so the object identity is stable
 * across renders -- a fresh literal each render makes Motion re-serialise styles
 * on every frame of the enter animation for no reason.
 */
const PANEL_TEXT_VARS = {
  "--fg": "#f7e6e4",
  "--fg-muted": "#e8b9b7",
  "--fg-subtle": "#c08b89",
  "--accent": "#e5a93c",
  "--accent-contrast": "#1a0003",
  "--line": "#4d1a1c",
  "--line-strong": "#d32f2f",
} as React.CSSProperties;

export function Hero() {
  const reduceMotion = useReducedMotion();

  const artwork = site.heroBackground;
  // One artwork, loaded directly.
  //
  // This used to walk a candidate list and hold an avatar inset on screen until
  // a picture appeared, branching the whole panel three ways on a loading flag.
  // There is exactly one committed asset, so the list was one entry with two
  // permanent 404s behind it, and the branch was a flash of the avatar on every
  // cold load -- the placeholder appearing to be replaced by the thing it was a
  // placeholder for. The card now renders once.
  //
  // `artLoaded` still earns its keep, but for a narrower job: holding back the
  // artwork's dark text tokens and the scrim until the pixels are actually there,
  // so pale text is never painted over a background that has not arrived. That is
  // a paint-ordering concern, not a fallback.
  const artSrc = artwork ? artwork.sources[0] : null;
  const [artLoaded, setArtLoaded] = useState(false);

  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: EASE_OUT_EXPO },
        };

  return (
    <section id="atas" className="relative isolate overflow-hidden" aria-labelledby="hero-name">
      <div aria-hidden="true" className="dawn-wash absolute inset-0 -z-10" />

      <div className="shell grid min-h-[calc(100dvh-4rem)] items-center py-14 md:py-20">
        <motion.div {...enter(0.04)} className="relative isolate">
          <div
            /*
              The frame. One bordered panel. With artwork it becomes the frame for
              the picture; without, it is the document itself.

              A plain div rather than a second motion element, because this is where
              the custom-property override lives and Motion's `style` prop is typed
              as MotionStyle, which fights both a React.CSSProperties object and an
              explicit `undefined` under exactOptionalPropertyTypes. The animation
              is on the wrapper, which is where the transform belongs anyway.
            */
            className="relative isolate overflow-hidden border border-line-strong/60"
            /*
              The panel keeps the dark theme's text colours while the artwork is in
              place, in the light theme too.

              Done by overriding the custom properties on the panel rather than by
              giving each element its own class. Every token-based colour inside --
              the heading, the identity rule, the bio, the header labels, the action
              buttons -- resolves through these, so one override re-themes the whole
              panel and none of them can be missed. Adding a new element inside the
              hero later gets the right colour for free, which per-element classes
              would not.

              It has to be this: the artwork is dark in both themes, so a visitor who
              picks light mode is looking at pale text on a dark picture. Flipping
              the page's text to near-black there would make the name unreadable, and
              the theme switch is a preference about the rest of the page, not a
              statement about a photograph.

              The heading carries an explicit `text-fg` for a reason that is easy to
              miss. It had no colour class of its own and inherited `color` from
              body -- where `--fg` had already been resolved, so the panel's override
              never reached it and the name stayed dark-on-dark. An inherited value
              is computed once at the ancestor and handed down; overriding a custom
              property further down cannot retroactively change it. Anything inside
              this panel that should follow the override has to name the token
              itself.
            */
            style={artLoaded ? PANEL_TEXT_VARS : undefined}
          >
          {/*
            The artwork, behind everything.

            object-[50%_calc(50%-4px)] on mobile, object-[100%_calc(50%+5px)] from
            md up. Centred below md because the panel is nearly the viewport width
            there and an image anchored to the right edge puts the character
            half off-screen; anchored right above md, where there is room for the
            picture beside the text rather than under it.

            The vertical offsets read the way they do because object-position
            moves the image, not the subject. A negative offset raises the image
            and therefore clips more off the top -- which is how the first attempt
            at this cut the character's head off. To show more of the top of the
            artwork the image has to move down, so the desktop offset is positive
            and only the mobile one is negative.

            It is an <img>, not a CSS background, because `onError` is how the
            next candidate is tried when a file is missing. A CSS background that
            404s is simply not painted, and there is no event to notice it by.
          */}
          {artSrc && (
            <img
              src={asset(artSrc)}
              alt={artLoaded && artwork ? artwork.alt : ""}
              // Above the fold and the largest paint on the page: fetch it first
              // and decode eagerly. A GIF cannot be progressively painted, so
              // eager decode is the difference between a hero that appears and a
              // hero that pops in late.
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setArtLoaded(true)}
              className="absolute inset-0 -z-10 size-full object-cover object-[50%_calc(50%-4px)] md:object-[100%_calc(50%+5px)]"
            />
          )}

          {/*
            The scrim, and the reason the text is still readable.

            Two gradients doing different jobs. The horizontal one is opaque
            under the text column and thins out towards the artwork on the right,
            so the picture is visible where there is nothing to read and hidden
            where there is. The vertical one is a separate top-down wash that
            keeps the header rule legible over a bright sky.

            Both are anchored to this site's ground colour rather than to black.
            A neutral black over a crimson-black panel reads as a grey haze.
          */}
          {artLoaded && (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1a0003]/95 via-[#1a0003]/85 to-[#1a0003]/40"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#1a0003]/85 to-transparent"
              />
            </>
          )}

          {/* Header row: who she is, and the channel mark. */}
          <div className="flex items-center justify-between gap-4 border-b border-line-strong/40 px-6 py-4 md:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {site.role}
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-fg-subtle sm:block">
              {site.channelTitle}
            </p>
          </div>

          <div className="px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-[52ch]">
              <motion.h1
                {...enter(0.1)}
                id="hero-name"
                className="text-fg text-[clamp(2.4rem,6.5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight"
              >
                {site.name}
              </motion.h1>

              {/* The identity line, on its own gold-ruled field. */}
              <motion.p
                {...enter(0.16)}
                className="mt-5 inline-flex items-center gap-3 border-y border-line-strong/40 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted"
              >
                {site.identity}
              </motion.p>

              <motion.p
                {...enter(0.22)}
                className="mt-6 max-w-[48ch] leading-relaxed text-fg-muted"
              >
                {site.bio}
              </motion.p>

              <motion.div {...enter(0.3)} className="mt-8 flex flex-wrap items-center gap-3">
                <ActionLink href={channels.youtube.url} external size="lg">
                  <YoutubeMark size={18} />
                  Tonton di YouTube
                </ActionLink>
                <ActionLink href={channels.x.url} external variant="quiet" size="lg">
                  <XMark size={18} />
                  Ikuti di X
                </ActionLink>
              </motion.div>
            </div>
          </div>
          {/* Closing the plain panel div, then the motion wrapper around it. */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}