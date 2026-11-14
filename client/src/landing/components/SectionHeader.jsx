export function SectionHeader({ kicker, title, subtitle }) {
  return <div className="mx-auto max-w-2xl text-center"><div className="mb-6 flex items-center justify-center gap-3"><span
    aria-hidden="true"
    className="h-px w-12 bg-gradient-to-r from-transparent to-white/25 sm:w-20"
  /><span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/60" /><span className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1 text-xs font-medium tracking-wide text-zinc-200 whitespace-nowrap shrink-0">{kicker}</span><span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/60" /><span
    aria-hidden="true"
    className="h-px w-12 bg-gradient-to-l from-transparent to-white/25 sm:w-20"
  /></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,1.875rem)] font-medium tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">{title}</h2>{subtitle ? <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">{subtitle}</p> : null}</div>;
}
