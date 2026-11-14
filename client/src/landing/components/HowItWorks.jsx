import { Download, Link2, Sparkles } from "lucide-react";
const STEPS = [
  {
    number: "01",
    title: "Paste or describe",
    description: "Drop in a public GitHub repository link, pick a profile template, or write a short sentence about what your project does.",
    icon: Link2
  },
  {
    number: "02",
    title: "AI writes it",
    description: "Docume analyzes your structure, stack, and scripts, then generates a clean, readable README with clear headings and code blocks.",
    icon: Sparkles
  },
  {
    number: "03",
    title: "Edit and download",
    description: "Refine any section with the magic wand, add skill icons or badges, verify the live preview, and copy or download README.md.",
    icon: Download
  }
];
export function HowItWorks() {
  return <section id="how-it-works" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              How it works
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
            Three steps from blank file to{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              ready README
            </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Designed to get out of your way so you can document every project{" "}<br className="hidden sm:inline" />
            as fast as you ship your code.
          </p></div><div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">{STEPS.map((step) => {
    const Icon = step.icon;
    return <div
      key={step.number}
      className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-sky-300/[0.18] bg-[radial-gradient(circle_at_85%_0%,rgba(125,211,252,0.14),transparent_55%),radial-gradient(circle_at_15%_100%,rgba(56,189,248,0.08),transparent_50%),linear-gradient(180deg,rgba(224,242,254,0.08)_0%,rgba(13,18,25,0.68)_54%,rgba(5,8,13,0.86)_100%)] p-6 shadow-[inset_0_1px_1px_rgba(224,242,254,0.3),inset_0_-1px_1px_rgba(56,189,248,0.1),0_18px_45px_rgba(2,12,27,0.55)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-sky-200/65 before:to-transparent hover:-translate-y-0.5 hover:border-sky-300/35 sm:p-8"
    ><div><div className="flex items-center justify-between gap-4"><span className="inline-flex items-center rounded-full border border-sky-300/20 bg-sky-400/[0.08] px-2.5 py-0.5 font-mono text-xs font-medium text-sky-200 tabular-nums">{step.number}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200/20 bg-sky-300/[0.08] text-sky-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"><Icon className="h-4 w-4" /></span></div><h3 className="mt-6 text-xl font-medium tracking-tight text-white">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300/80">{step.description}</p></div></div>;
  })}</div></div></section>;
}
