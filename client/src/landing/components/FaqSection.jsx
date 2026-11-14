import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "../data/documeData";
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const handleToggle = (index) => {
    setOpenIndex((prev) => prev === index ? null : index);
  };
  return <section id="faq" className="relative py-20 sm:py-24"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl text-center"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              FAQ
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h2 className="text-balance text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-[clamp(2.25rem,4.3vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white">
            Common{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal">
              questions
            </span></h2><p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 opacity-65 sm:text-sm">
            Clear answers about pricing, privacy, AI models, and usage limits{" "}<br className="hidden sm:inline" />
            before you get started.
          </p></div><div className="mt-12 space-y-3">{FAQ_ITEMS.map((item, idx) => {
    const isOpen = openIndex === idx;
    return <div
      key={item.question}
      className="card-surface overflow-hidden rounded-2xl transition-colors duration-150"
    ><button
      type="button"
      onClick={() => handleToggle(idx)}
      aria-expanded={isOpen}
      aria-controls={`faq-panel-${idx}`}
      id={`faq-button-${idx}`}
      className="flex min-h-[60px] w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400"
    ><span className="text-sm font-medium text-white sm:text-base">{item.question}</span><ChevronDown
      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-sky-300" : ""}`}
    /></button>{isOpen ? <div
      id={`faq-panel-${idx}`}
      role="region"
      aria-labelledby={`faq-button-${idx}`}
      className="border-t border-white/[0.06] px-6 py-4 text-sm leading-relaxed text-zinc-400"
    >{item.answer}</div> : null}</div>;
  })}</div></div></section>;
}
