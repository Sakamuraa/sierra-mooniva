import { motion, useReducedMotion } from "motion/react";

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
 *   - the avatar is a small rectangular inset, the size a photo on a document
 *     actually is, rather than a portrait that fills half the viewport
 *   - gold rules divide the panel into header / name / bio / actions, so the
 *     sections read as fields on a form rather than as a page's worth of blocks
 *   - the name is set in the didone at display size, which is where Bodoni earns
 *     its contrast; the same face at body size would be unreadable
 *
 * Height is `min-h-[calc(100dvh-4rem)]`, never `h-screen`, so a collapsing mobile
 * address bar cannot clip the actions.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

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
        <motion.div
          {...enter(0.04)}
          /*
            The frame. A single bordered panel with the avatar inset into its top
            left corner, overlapping the header rule — which is what stops this
            reading as a card with a picture on it.
          */
          className="relative border border-line-strong/60 bg-surface/40"
        >
          {/* Header row: who she is, and the channel mark. */}
          <div className="flex items-center justify-between gap-4 border-b border-line-strong/40 px-6 py-4 md:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {site.role}
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-fg-subtle sm:block">
              {site.channelTitle}
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 md:grid-cols-[auto_1fr] md:gap-10 md:px-8 md:py-10">
            {/*
              The inset. Square, sharp-cornered, pulled up over the header rule so
              it reads as a document photo rather than an illustration.
            */}
            <figure className="relative -mt-12 shrink-0 self-start md:-ml-12 md:mt-6">
              <div className="border border-gold/50 bg-surface-deep p-1.5">
                <img
                  src={asset(site.avatar)}
                  alt={site.avatarAlt}
                  width={800}
                  height={800}
                  // Above the fold and the largest paint: fetch early, decode
                  // eagerly, and keep the square ratio reserved so CLS stays 0.
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="size-28 object-cover md:size-40"
                />
              </div>
            </figure>

            <div className="min-w-0">
              <motion.h1
                {...enter(0.1)}
                id="hero-name"
                className="text-[clamp(2.4rem,6.5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight"
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
        </motion.div>
      </div>
    </section>
  );
}