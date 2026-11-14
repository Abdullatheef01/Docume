import { ArrowUpRight } from "lucide-react";
import { REPO_PRESETS } from "../data/documeData";
import { MarkdownPreview } from "./MarkdownPreview";
const TEMPLATE_SUBTITLES = {
  cli: "Repome \xB7 Command-line tools",
  saas: "Repome \xB7 Full-stack web apps",
  profile: "Imme \xB7 GitHub profile README",
  api: "Repome \xB7 SDKs & REST packages"
};
export function TemplatesGallery({ onSelectTemplate }) {
  const handleUseTemplate = (markdown) => {
    onSelectTemplate(markdown);
    const heroEl = document.getElementById("hero");
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: "smooth" });
    }
  };
  return <section id="templates" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              Templates gallery
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
            Start from proven{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              documentation layouts
            </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Choose a starting layout for your repository or GitHub profile and load it{" "}<br className="hidden sm:inline" />
            straight into the live editor.
          </p></div><div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">{REPO_PRESETS.map((preset) => <article
    key={preset.id}
    className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.16] bg-[radial-gradient(circle_at_18%_0%,rgba(186,222,255,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(13,18,25,0.62)_52%,rgba(5,7,10,0.82)_100%)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),inset_0_-1px_1px_rgba(168,210,255,0.1),inset_0_0_24px_rgba(255,255,255,0.04),0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/55 before:to-transparent hover:border-white/[0.28] sm:p-7"
  ><div><div className="flex items-start justify-between gap-4"><div><p className="text-xs text-zinc-400">{TEMPLATE_SUBTITLES[preset.id] ?? "Docume template"}</p><h3 className="mt-1 text-lg font-medium tracking-tight text-white">{preset.label}</h3></div><button
    type="button"
    onClick={() => handleUseTemplate(preset.markdown)}
    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-3.5 py-1.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-colors hover:bg-white hover:text-[#0d1219] whitespace-nowrap shrink-0 cursor-pointer"
  ><span>Load template</span><ArrowUpRight className="h-3.5 w-3.5" /></button></div><div className="mt-5 h-52 overflow-hidden rounded-2xl border border-white/[0.1] bg-black/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"><MarkdownPreview markdown={preset.markdown} compact /></div></div></article>)}</div></div></section>;
}
