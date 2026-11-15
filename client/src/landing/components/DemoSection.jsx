import { useRef } from "react";
export function DemoSection() {
  const videoRef = useRef(null);
  return <section id="demo" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              Promo video
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.35rem)] sm:text-[clamp(2.35rem,4.6vw,3.75rem)] font-medium leading-[1.1] tracking-tight text-white">
            Watch Docume in 10 seconds
          </h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            No manual formatting, boilerplate setup, or template hunting — just drop your repo link{" "}<br className="hidden sm:inline" />
            and inspect the generated Markdown in seconds.
          </p></div><div className="mx-auto mt-12 max-w-4xl"><div className="card-surface-accent relative overflow-hidden rounded-[28px] p-3 sm:p-4"><div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-black"><video
    ref={videoRef}
    className="h-full w-full object-contain"
    controls
    playsInline
    preload="metadata"
    poster="/assets/docume-demo-poster.jpg"
    aria-label="Docume promo video"
  ><source src="/assets/docume-demo.mp4" type="video/mp4" />Your browser does not support the video tag.</video></div><p className="mt-4 mb-1 text-center text-sm font-medium text-zinc-300">
              Docume: write a great README in seconds
            </p></div></div></div></section>;
}
