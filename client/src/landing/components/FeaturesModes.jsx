import { Code2, FolderGit2, Layers, Terminal, UserCheck } from "lucide-react";
const PROFILE_SKILLS = ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind"];
export function FeaturesModes() {
  return <section id="features" className="relative overflow-hidden py-20 sm:py-24"><span
    aria-hidden="true"
    className="features-silk-backdrop pointer-events-none absolute inset-0 z-0"
  /><div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              Two core modes
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white"><span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              Built
            </span>{" "}
            for repositories and developer profiles
          </h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Switch effortlessly between technical repository documentation and personal{" "}<br className="hidden sm:inline" />
            GitHub profile showcases in one workspace.
          </p></div><div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">{
    /* Mode 1: Repome */
  }<div className="card-surface-accent card-shine-sweep flex flex-col justify-between rounded-[28px] p-6 shadow-[0_0_0_6px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.14),0_24px_60px_rgba(0,0,0,0.65)] sm:p-8"><div><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-sky-200"><FolderGit2 className="h-5 w-5" /></span><div><h3 className="text-xl font-medium tracking-tight text-white">Repome</h3><p className="text-xs text-zinc-400">Repository Mode</p></div></div></div><p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                README for your repo from a GitHub link. Docume inspects your repository tree,
                dependencies, and scripts to write accurate setup guides and feature overviews.
              </p>{
    /* Visual Repo Inspector Preview */
  }<div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#05070a] p-4 sm:p-5"><div className="flex items-center justify-between border-b border-white/[0.07] pb-3 font-mono text-xs text-zinc-300"><span>github.com/abdul/docume-api</span><span className="text-zinc-500">main</span></div><div className="mt-3.5 space-y-2.5 font-mono text-xs text-zinc-400"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-zinc-200"><Code2 className="h-3.5 w-3.5 text-sky-300" />
                      package.json
                    </span><span className="text-zinc-500">Detected Express, MongoDB</span></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-zinc-200"><Layers className="h-3.5 w-3.5 text-sky-300" />
                      src/routes/
                    </span><span className="text-zinc-500">6 API endpoints mapped</span></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-zinc-200"><Terminal className="h-3.5 w-3.5 text-sky-300" />
                      .env.example
                    </span><span className="text-zinc-500">Environment table built</span></div></div></div></div><div className="mt-6 flex items-center gap-2 text-xs text-zinc-400"><span>Public GitHub URLs</span><span aria-hidden="true">·</span><span>Auto dependency detection</span><span aria-hidden="true">·</span><span>Clean Markdown export</span></div></div>{
    /* Mode 2: Imme */
  }<div className="card-surface-accent card-shine-sweep card-shine-sweep-delayed flex flex-col justify-between rounded-[28px] p-6 shadow-[0_0_0_6px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.14),0_24px_60px_rgba(0,0,0,0.65)] sm:p-8"><div><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-sky-200"><UserCheck className="h-5 w-5" /></span><div><h3 className="text-xl font-medium tracking-tight text-white">Imme</h3><p className="text-xs text-zinc-400">Profile Mode</p></div></div></div><p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                README for your GitHub profile with templates, skill icons and badges. Stand out
                on your GitHub home page without hand-coding HTML tables or SVG links.
              </p>{
    /* Visual Profile Preview */
  }<div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#05070a] p-4 sm:p-5"><div className="flex items-center gap-3 border-b border-white/[0.07] pb-3.5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/60 to-slate-800 text-sm font-semibold text-white">
                    A
                  </div><div><p className="text-sm font-medium text-white">Hey, I&apos;m Abdul</p><p className="text-xs text-zinc-400">Full-stack Engineer · Open Source</p></div></div><div className="mt-4"><p className="text-[11px] font-medium text-zinc-500">Tech Stack Icons</p><div className="mt-2 flex flex-wrap gap-2">{PROFILE_SKILLS.map((skill) => <span
    key={skill}
    className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-200"
  >{skill}</span>)}</div></div></div></div><div className="mt-6 flex items-center gap-2 text-xs text-zinc-400"><span>Curated layouts</span><span aria-hidden="true">·</span><span>Skill icons</span><span aria-hidden="true">·</span><span>GitHub badges</span></div></div></div></div></section>;
}
