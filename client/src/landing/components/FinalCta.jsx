export function FinalCta({ onOpenAuth }) {
  return <section id="cta" className="relative overflow-hidden py-24 sm:py-32">{
    /* Sweeping luminous steel-blue horizon glow */
  }<div
    aria-hidden="true"
    className="theme-glow-horizon pointer-events-none absolute inset-0 mx-auto max-w-6xl"
  /><div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
            Get started
          </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
          Ready to write your{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
            README?
          </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
          Generate your first repository or GitHub profile README in seconds{" "}<br className="hidden sm:inline" />
          with Repome and Imme.
        </p><div className="mt-8 flex justify-center"><button
    type="button"
    onClick={onOpenAuth}
    className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-[#0d1219] transition-colors duration-150 hover:bg-zinc-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
            Start for free
          </button></div></div></section>;
}
