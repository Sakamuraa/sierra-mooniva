import { SealCheck } from "@phosphor-icons/react";

import { StaggerGroup, StaggerItem } from "@/lib/reveal";
import { Reveal } from "@/lib/reveal";
import { hashtags, site } from "@/content/site";

/**
 * Profile.
 *
 * Every claim here comes from a place that can be checked. The version inherited
 * from the clone carried a character descriptor, a venue name, a Live 2D format, a
 * join date and a set of measured stream intervals, none of which belonged to
 * Sierra Mooniva.
 *
 * What was removed, and why:
 *   - "Bintang Nyasar", "Starpaw Cafe", "Cat Cafe" .... the clone creator's
 *   - "Live 2D" and the model/rig credit block ........ she claims no such
 *     credits in her bio
 *   - "delapan stream terakhir berjarak sembilan hari" ... measured off the other
 *     channel's streams
 *   - the join date ................................... not read off her own header,
 *     and the /about page carries other channels' metadata
 *   - a "cover channel, never streams" claim .......... read off /videos and never
 *     checked against /streams. She streams. Both tabs are hers.
 *
 * `detail` promotes the heading to an h1 and pads the top, for when this is the
 * whole page rather than the closing block of the home page. Two headings on one
 * page is the thing that flag exists to prevent.
 */
export function Profile({ detail = false }: { detail?: boolean } = {}) {
  const Heading = detail ? "h1" : "h2";

  return (
    <section
      aria-labelledby="profile-heading"
      // pt- swaps the top gap only. The bottom gap has to stay, or the last row
      // butts straight into the footer.
      className={detail ? "pb-24 pt-24 md:pb-32 md:pt-32" : "py-24 md:py-32"}
    >
      <div className="shell">
        {detail && (
          <Reveal amount={0.3}>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {site.channelTitle}
            </p>
            <Heading
              id="profile-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
            >
              Tentang Sierra
            </Heading>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-fg-muted md:text-lg">
              Halaman ini mengumpulkan apa yang tertulis tentang dirinya, dan tidak
              lebih dari itu.
            </p>
          </Reveal>
        )}

        <div className={`grid gap-14 md:grid-cols-12 md:gap-12 ${detail ? "mt-16" : ""}`}>
          <Reveal className="md:col-span-5" amount={0.3}>
            {/* Her own words, in her own order. The X bio and the YouTube
                description say the same thing two ways, which is why both appear
                here rather than one being paraphrased into the other. */}
            {detail ? (
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {site.role}
              </h2>
            ) : (
              <h2
                id="profile-heading"
                className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
              >
                {site.role}
              </h2>
            )}

            <figure className="mt-8 border-l-2 border-gold pl-5">
              <SealCheck size={22} className="text-crimson" aria-hidden="true" />
              <blockquote className="mt-3 font-display text-xl leading-relaxed">
                Virtual Corporate Secretary here~
              </blockquote>
              <figcaption className="mt-3 text-sm text-fg-subtle">
                Dari bio X-nya, ditulis sendiri olehnya.
              </figcaption>
            </figure>

            {/* Only on the full page: what the hashtag is for, spelled out. */}
            {detail && (
              <dl className="mt-10">
                {hashtags.map((tag) => (
                  <div
                    key={tag.tag}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                  >
                    <dt className="font-medium text-fg">{tag.tag}</dt>
                    <dd className="shrink-0 text-sm text-fg-subtle">{tag.use}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>

          <Reveal className="md:col-span-6 md:col-start-7" delay={0.08} amount={0.3}>
            {/*
              Both columns are read off her own tabs rather than asserted, and the
              second one is a correction: an earlier version of this file claimed
              the channel was covers only, on the strength of the /videos tab
              alone. The /streams tab says otherwise, and it says it clearly --
              Fire Emblem, Kitaria Fables 2, DotA 2, VALORANT, plus collabs. Both
              tabs are hers; reading one and generalising from it is how a cover
              channel became a claim about a streaming channel.
            */}
            <StaggerGroup className="mt-0 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
              <StaggerItem className="bg-surface p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-subtle">
                  Bahasa
                </p>
                <p className="mt-2 text-sm leading-snug text-fg">
                  Inggris, dan Indonesia
                </p>
              </StaggerItem>
              <StaggerItem className="bg-surface p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-subtle">
                  Isi channel
                </p>
                <p className="mt-2 text-sm leading-snug text-fg">Stream dan cover</p>
              </StaggerItem>
            </StaggerGroup>

            <ul className="mt-8 flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <li
                  key={tag.tag}
                  className="inline-flex items-center gap-2 rounded-btn border border-line-strong px-3 py-1.5 text-sm text-fg-muted"
                >
                  <span className="font-medium text-fg">{tag.tag}</span>
                  <span className="text-fg-subtle">{tag.use}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}