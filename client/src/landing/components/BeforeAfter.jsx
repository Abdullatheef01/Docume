import { CheckCircle2, FileWarning } from "lucide-react";
export function BeforeAfter() {
  return <section id="before-after" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              Comparison
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
            From overlooked file to clear{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              first impression
            </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Stop shipping empty boilerplate — give contributors and recruiters everything they need{" "}<br className="hidden sm:inline" />
            to understand your project immediately.
          </p></div><div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">{
    /* Left Card: A plain repo README (Pure dark red gradient) */
  }<div className="flex flex-col justify-between rounded-[26px] border border-red-500/20 bg-[radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.07),transparent_50%),linear-gradient(165deg,#150507_0%,#0e0305_52%,#070203_100%)] p-6 shadow-[inset_0_1px_0_0_rgba(248,113,113,0.1),0_16px_40px_rgba(127,29,29,0.09)] sm:p-8"><div><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-medium tracking-tight text-red-400">
                  A plain repo README
                </h3><FileWarning className="h-4 w-4 text-red-400" /></div><p className="mt-2 text-sm text-red-200">
                Minimal context, missing setup steps, and no overview of how the project works.
              </p><div className="mt-6 rounded-2xl border border-red-500/20 bg-[#070203] p-5 font-mono text-xs leading-6 text-zinc-400"><p className="text-zinc-300"># my-project</p><p className="mt-3">node app</p><p className="mt-3">## install</p><p>npm i</p><p>npm start</p><p className="mt-3 text-red-400/80">TODO: add docs later</p></div></div><div className="mt-6 flex items-center gap-2 text-xs text-red-300"><span>No stack overview</span><span aria-hidden="true">·</span><span>No env vars</span><span aria-hidden="true">·</span><span>Hard to adopt</span></div></div>{
    /* Right Card: Written by Docume (Pure dark green gradient) */
  }<div className="flex flex-col justify-between rounded-[26px] border border-green-500/20 bg-[radial-gradient(circle_at_85%_15%,rgba(34,197,94,0.07),transparent_50%),linear-gradient(165deg,#05160c_0%,#030e07_52%,#020704_100%)] p-6 shadow-[inset_0_1px_0_0_rgba(74,222,128,0.1),0_16px_40px_rgba(20,83,45,0.09)] sm:p-8"><div><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-medium tracking-tight text-green-400">
                  Written by Docume
                </h3><CheckCircle2 className="h-4 w-4 text-green-400" /></div><p className="mt-2 text-sm text-green-200">
                Complete project summary, setup commands, environment variables, and clean hierarchy.
              </p><div className="mt-6 rounded-2xl border border-green-500/20 bg-[#030704] p-5 text-xs leading-relaxed text-zinc-300"><div className="border-b border-white/[0.08] pb-3"><p className="text-base font-semibold tracking-tight text-white">
                    Relay API Gateway
                  </p><p className="mt-1 text-zinc-400">
                    Lightweight Express and MongoDB webhook router with typed retry queues.
                  </p></div><div className="mt-3.5 space-y-2.5"><div><p className="font-semibold text-zinc-100">Quick Start</p><pre className="mt-1.5 rounded-lg bg-green-500/10 px-3 py-2 font-mono text-[11px] text-green-300">
                      git clone ... && npm install && npm run dev
                    </pre></div><div><p className="font-semibold text-zinc-100">Environment</p><div className="mt-1.5 grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-400"><span>PORT=3000</span><span>MONGO_URI=...</span></div></div></div></div></div><div className="mt-6 flex items-center gap-2 text-xs text-green-300"><span>Structured sections</span><span aria-hidden="true">·</span><span>Accurate commands</span><span aria-hidden="true">·</span><span>Ready to commit</span></div></div></div></div></section>;
}
