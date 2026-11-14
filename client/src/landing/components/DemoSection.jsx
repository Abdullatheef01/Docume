import { useEffect, useState } from "react";
import { FolderGit2, Pause, Play, RotateCcw } from "lucide-react";
const DEMO_STEPS = [
  { time: "00:02", label: "Reading github.com/abdul/docume-cli" },
  { time: "00:05", label: "Scanning package.json, src/, and scripts" },
  { time: "00:08", label: "Structuring installation, usage, and badges" },
  { time: "00:10", label: "README.md ready to edit and download" }
];
export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= DEMO_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);
  const handleTogglePlay = () => {
    if (stepIndex === DEMO_STEPS.length - 1 && !isPlaying) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };
  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };
  const progress = (stepIndex + 1) / DEMO_STEPS.length * 100;
  return <section id="demo" className="relative py-20 sm:py-24"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              Product walkthrough
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.35rem)] sm:text-[clamp(2.35rem,4.6vw,3.75rem)] font-medium leading-[1.1] tracking-tight text-white">
            Watch a repo turn into clean docs
          </h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            No manual formatting, boilerplate setup, or template hunting — just drop your repo link{" "}<br className="hidden sm:inline" />
            and get a ready README file in seconds.
          </p></div><div className="mx-auto mt-12 max-w-4xl"><div className="card-surface-accent relative overflow-hidden rounded-[28px] p-3 sm:p-4">{
    /* 16:9 Demo Canvas */
  }<div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#05070a]">{
    /* Subtle radial highlight */
  }<div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,130,214,0.22),transparent_70%)]"
  />{
    /* Visual simulated frame inside 16:9 player */
  }<div className="relative flex h-full flex-col justify-between p-5 sm:p-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2.5 text-xs text-zinc-300"><FolderGit2 className="h-4 w-4 text-sky-300" /><span className="font-mono">github.com/abdul/docume-cli</span></div><span className="font-mono text-xs text-zinc-400 tabular-nums">{DEMO_STEPS[stepIndex].time} / 00:10
                  </span></div>{
    /* Center Play Trigger */
  }<div className="my-auto flex flex-col items-center text-center"><button
    type="button"
    onClick={handleTogglePlay}
    aria-label={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
    className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white text-[#0d1219] shadow-lg transition-transform duration-150 hover:scale-105 cursor-pointer sm:h-20 sm:w-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
  >{isPlaying ? <Pause className="h-6 w-6 fill-current sm:h-7 sm:w-7" /> : <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />}</button><p className="mt-5 text-sm font-medium text-white sm:text-base">{DEMO_STEPS[stepIndex].label}</p></div>{
    /* Bottom Timeline & Controls */
  }<div className="space-y-2.5"><div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]"><div
    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-300 transition-all duration-300"
    style={{ width: `${progress}%` }}
  /></div><div className="flex items-center justify-between text-xs text-zinc-400"><span className="font-mono tabular-nums">
                      Step {stepIndex + 1} of {DEMO_STEPS.length}</span><button
    type="button"
    onClick={handleReset}
    className="inline-flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-white cursor-pointer"
  ><RotateCcw className="h-3.5 w-3.5" /><span>Replay</span></button></div></div></div></div><p className="mt-4 mb-1 text-center text-sm font-medium text-zinc-300">
              Repo link to README in 10 seconds
            </p></div></div></div></section>;
}
