import { ArrowSquareOut, Trophy } from "@phosphor-icons/react";

import { Reveal, StaggerGroup, StaggerItem } from "@/lib/reveal";
import { covers, projectSource, tournaments, type Project } from "@/content/projects";

/**
 * Projects.
 *
 * Two sections kept apart on purpose. The covers are the work; the tournament
 * recordings are matches she entered. Presenting them as one list would read as
 * though she had published four more songs, which is a small way of telling
 * someone something untrue about their own work.
 *
 * Every card links to YouTube rather than embedding a player. A thumbnail that
 * goes somewhere is honest about being an index; seventeen inline players would
 * be a video page wearing a fan page's clothes.
 */
export function Project() {
  return (
    <section id="isi-project" aria-labelledby="project-heading" className="pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="shell">
        <Reveal amount={0.3}>
          <p className="text-sm font-medium text-accent">Karya dan rekamannya</p>
          <h1
            id="project-heading"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
          >
            Project
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-fg-muted md:text-lg">
            Cover, kolab, dan rekaman pertandingan. Video yang diunggah tidak
            selalu berada di channel-nya sendiri.
          </p>
        </Reveal>

        <Reveal amount={0.2} delay={0.04}>
          <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight text-fg">
            Cover Songs
          </h2>
          <p className="mt-2 text-sm text-fg-subtle">
            {covers.length} cover. Sebagian diunggah di channel kolabolatornya.
          </p>
        </Reveal>

        <StaggerGroup
          className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.04}
          amount={0.02}
        >
          {covers.map((project) => (
            <StaggerItem key={project.id} className="min-w-0">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal amount={0.2} delay={0.04}>
          <h2 className="mt-20 font-display text-2xl font-semibold tracking-tight text-fg">
            Turnamen
          </h2>
          <p className="mt-2 text-sm text-fg-subtle">
            Rekaman pertandingan, bukan lagu.
          </p>
        </Reveal>

        <StaggerGroup
          className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.04}
          amount={0.02}
        >
          {tournaments.map((project) => (
            <StaggerItem key={project.id} className="min-w-0">
              <ProjectCard project={project} showTrophy />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/*
          AfterRain is her own project, not a cover of someone else's song, so it
          does not belong in either list above -- lumping it in with the covers
          would present her own work as another collaboration. It gets its own
          band instead, credited to the role she actually holds: COO of
          @afterainPROJECT, which is her own claim from her X bio.
        */}
        <Reveal amount={0.2} delay={0.04}>
          <div className="mt-20 border-t border-line pt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
              AfterRain
            </h2>

            <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:items-center md:gap-12">
              <div className="overflow-hidden rounded-card border border-line bg-surface p-6">
                <img
                  src="/media/afterrain.webp"
                  alt="Logo AfterRain"
                  width={1019}
                  height={227}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.14em] text-accent">
                  COO · @afterainPROJECT
                </p>
                <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-fg-muted">
                  Sierra Mooniva adalah COO dari AfterRain.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal amount={0.2} delay={0.05}>
          <p className="mt-14 text-xs leading-relaxed text-fg-subtle">
            Daftar diambil dari{" "}
            <a
              href={projectSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-fg"
            >
              halaman project
            </a>
            -nya. Semua lagu tetap milik pencipta dan penyanyinya.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ project, showTrophy = false }: { project: Project; showTrophy?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden bg-surface-deep"
      >
        <img
          src={project.thumbnail}
          alt=""
          width={480}
          height={360}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </a>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="flex items-center gap-2 text-xs text-fg-subtle">
          {showTrophy && <Trophy size={13} aria-hidden="true" />}
          <span className="truncate">{project.channel}</span>
        </p>

        <h3 className="mt-2 font-display text-lg font-medium leading-snug tracking-tight text-fg">
          {project.shortTitle ?? project.title}
        </h3>

        {/* Only when it differs from what the heading already says, so a solo
            cover does not carry an empty credit line. */}
        {project.credit && (
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{project.credit}</p>
        )}

        {/* Her published title, where the projects page paraphrased it. */}
        {project.shortTitle && project.shortTitle !== project.title && (
          <p className="mt-2 text-xs leading-relaxed text-fg-subtle">{project.title}</p>
        )}

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs text-fg-subtle transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span>Buka di YouTube</span>
          <ArrowSquareOut size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}