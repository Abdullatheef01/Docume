import { useState } from "react";
import { Award, Eye, History, Wand2 } from "lucide-react";
const BADGE_OPTIONS = ["MIT License", "TypeScript", "PRs Welcome", "v2.0 Ready"];
export function MoreFeatures() {
  const [polished, setPolished] = useState(true);
  const [selectedBadges, setSelectedBadges] = useState(["MIT License", "TypeScript"]);
  const toggleBadge = (badge) => {
    setSelectedBadges(
      (prev) => prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };
  return <section id="more-features" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              More features
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
            Everything needed to{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              polish and ship
            </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Fine-tune individual sections, insert clean badges, preview rendered output,{" "}<br className="hidden sm:inline" />
            and keep every draft organized in one place.
          </p></div><div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">{
    /* Card 1: Magic wand */
  }<div className="card-surface flex flex-col justify-between rounded-[26px] p-6 sm:p-7"><div><div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-200"><Wand2 className="h-5 w-5" /></span><button
    type="button"
    onClick={() => setPolished((prev) => !prev)}
    className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.1] cursor-pointer whitespace-nowrap"
  >{polished ? "Show original" : "Polish section"}</button></div><h3 className="mt-5 text-lg font-medium tracking-tight text-white">
                Magic wand
              </h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Improve any section without regenerating the entire document. Tighten copy, expand
                setup instructions, or clarify usage examples in one click.
              </p></div><div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#05070a] p-4 font-mono text-xs leading-6 text-zinc-300">{polished ? "Run `npm run dev` to start the local server on port 3000 with hot reload enabled." : "run npm run dev to start the app locally on your machine"}</div></div>{
    /* Card 2: Icons and badges picker */
  }<div className="card-surface flex flex-col justify-between rounded-[26px] p-6 sm:p-7"><div><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-200"><Award className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-medium tracking-tight text-white">
                Icons and badges picker
              </h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Browse technology icons, license tags, and status badges and insert clean Markdown
                shields without searching external cheat sheets.
              </p></div><div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-white/[0.07] bg-[#05070a] p-4">{BADGE_OPTIONS.map((badge) => {
    const active = selectedBadges.includes(badge);
    return <button
      key={badge}
      type="button"
      onClick={() => toggleBadge(badge)}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer whitespace-nowrap ${active ? "border-sky-400/50 bg-sky-500/20 text-white" : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-200"}`}
    >{badge}</button>;
  })}</div></div>{
    /* Card 3: Live preview */
  }<div className="card-surface flex flex-col justify-between rounded-[26px] p-6 sm:p-7"><div><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-200"><Eye className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-medium tracking-tight text-white">
                Live preview
              </h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Edit raw Markdown on the left and inspect exact GitHub-style headings, tables, and
                code blocks side by side on the right.
              </p></div><div className="mt-6 grid grid-cols-2 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-[#05070a]"><div className="p-3.5 font-mono text-[11px] leading-5 text-zinc-400"><p>## API</p><p>`GET /health`</p></div><div className="p-3.5 text-xs text-zinc-200"><p className="font-semibold text-white">API</p><p className="mt-1 font-mono text-[11px] text-sky-200">GET /health</p></div></div></div>{
    /* Card 4: Saved chats */
  }<div className="card-surface flex flex-col justify-between rounded-[26px] p-6 sm:p-7"><div><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-200"><History className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-medium tracking-tight text-white">
                Saved chats
              </h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Every repository and profile session stays saved in your workspace so you can
                return later, ask for updates, and export again.
              </p></div><div className="mt-6 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.07] bg-[#05070a] px-4"><div className="flex items-center justify-between py-2.5 text-xs"><span className="font-medium text-zinc-200">docume-cli</span><span className="text-zinc-500">Repome · 2h ago</span></div><div className="flex items-center justify-between py-2.5 text-xs"><span className="font-medium text-zinc-200">abdul-profile</span><span className="text-zinc-500">Imme · Yesterday</span></div></div></div></div></div></section>;
}
