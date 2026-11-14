import { useState } from "react";
import CodeEditor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import { ArrowRight, Check, Copy, Download, Sparkles } from "lucide-react";
import { MarkdownPreview } from "./MarkdownPreview";
import { generateReadmeFromPrompt } from "../data/documeData";
const highlightMd = (code) => Prism.highlight(code, Prism.languages.markdown, "markdown");
export function Hero({ markdown, onChangeMarkdown, onOpenAuth }) {
  const [promptInput, setPromptInput] = useState("");
  const [mobilePane, setMobilePane] = useState("code");
  const [copied, setCopied] = useState(false);
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onChangeMarkdown(generateReadmeFromPrompt(promptInput));
    setPromptInput("");
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };
  return <section
    id="hero"
    className="relative overflow-hidden pt-6 pb-14 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24"
  ><div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{
    /* Centered Headline Block */
  }<div className="mx-auto max-w-4xl pt-[29px] text-center sm:pt-[37px] lg:pt-[45px]"><div className="mb-6 flex items-center justify-center gap-3 sm:gap-4"><span aria-hidden="true" className="flex items-center"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-white/90 sm:w-16" /><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /></span><span className="rounded-full border border-white/[0.14] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_12px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md whitespace-nowrap shrink-0">
              AI README Generator
            </span><span aria-hidden="true" className="flex items-center"><span className="h-1 w-1 rotate-45 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.75)]" /><span className="h-[1px] w-10 bg-gradient-to-l from-transparent via-white/30 to-white/90 sm:w-16" /></span></div><h1 className="font-medium tracking-tight text-white"><span className="mt-4 block whitespace-nowrap text-[clamp(1.5rem,7.2vw,2.65rem)] leading-[1.08] sm:text-[clamp(2.65rem,5.6vw,4.35rem)] text-zinc-100 sm:mt-5">
              Write a great{" "}<span className="font-['Playfair_Display',Georgia,serif] font-medium italic tracking-normal text-[#17cafc] ">
                Readme
              </span></span><span className="mt-1.5 block whitespace-nowrap text-[clamp(1.6rem,7.6vw,3rem)] leading-[1.04] sm:text-[clamp(3rem,6.2vw,4.85rem)] text-white">
              in seconds, not hours.
            </span></h1><p className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-white/55 sm:text-sm">
            Docume is a free AI README generator. Paste a GitHub repo link or idea and get a clean README.
          </p><div className="mt-8 flex flex-wrap items-center justify-center gap-3"><button
    type="button"
    onClick={onOpenAuth}
    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0d1219] transition-colors duration-150 hover:bg-zinc-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
              Start for free
            </button><a
    href="#how-it-works"
    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/[0.1] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
  >
              See how it works
            </a></div><p className="mt-3.5 text-xs text-zinc-400">
            Login with Google or GitHub. No credit card.
          </p></div></div>{
    /* Mock Editor Full-Width Stage (Black top -> #0d1219 Steel Blue -> Luminous Ice White -> Rounded Bottom Corners) */
  }<div className="relative mt-6 w-full px-1 sm:mt-8 sm:px-2"><div className="hero-stage-backdrop relative overflow-hidden rounded-b-[15px] px-3 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-14 lg:px-14">{
    /* Frosted Crystal Glass Bezel around Editor Window */
  }<div className="relative z-10 mx-auto max-w-5xl rounded-[28px] border border-white/30 bg-white/[0.09] p-2.5 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(255,255,255,0.18),0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl backdrop-saturate-150 sm:rounded-[34px] sm:p-3.5"><div className="overflow-hidden rounded-[20px] border border-white/[0.14] bg-[#05070a] sm:rounded-[22px]">{
    /* Editor Top Toolbar */
  }<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3"><div className="flex items-center gap-3"><span className="font-mono text-xs font-medium text-zinc-300">README.md</span><div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5 lg:hidden"><button
    type="button"
    onClick={() => setMobilePane("code")}
    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${mobilePane === "code" ? "bg-white text-[#0d1219]" : "text-zinc-400 hover:text-white"}`}
  >
                      Markdown
                    </button><button
    type="button"
    onClick={() => setMobilePane("preview")}
    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${mobilePane === "preview" ? "bg-white text-[#0d1219]" : "text-zinc-400 hover:text-white"}`}
  >
                      Preview
                    </button></div></div><div className="flex items-center gap-2"><button
    type="button"
    onClick={handleCopy}
    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.09] cursor-pointer whitespace-nowrap"
  >{copied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Copied</span></> : <><Copy className="h-3.5 w-3.5 text-zinc-400" /><span>Copy</span></>}</button><button
    type="button"
    onClick={handleDownload}
    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.09] cursor-pointer whitespace-nowrap"
  ><Download className="h-3.5 w-3.5 text-zinc-400" /><span>Download</span></button></div></div>{
    /* Split Editor & Preview Body */
  }<div className="grid grid-cols-1 divide-y divide-white/[0.07] lg:grid-cols-2 lg:divide-x lg:divide-y-0">{
    /* Left: Markdown Code */
  }<div
    className={`flex flex-col bg-[#05070a] ${mobilePane === "preview" ? "hidden lg:flex" : "flex"}`}
  ><div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2"><span className="text-[11px] font-medium tracking-wide text-zinc-500">
                      Markdown Source
                    </span><span className="font-mono text-[11px] text-zinc-500 tabular-nums">{markdown.split("\n").length} lines
                    </span></div><div className="landing-scroll h-[320px] overflow-auto sm:h-[360px]"><CodeEditor
    className="code-editor min-h-full"
    textareaClassName="focus:outline-none"
    value={markdown}
    onValueChange={onChangeMarkdown}
    highlight={highlightMd}
    padding={20}
    tabSize={2}
    aria-label="Markdown source editor"
    style={{ minHeight: "100%" }}
  /></div></div>{
    /* Right: Rendered Preview */
  }<div
    className={`flex flex-col bg-[#0d1219] ${mobilePane === "code" ? "hidden lg:flex" : "flex"}`}
  ><div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2"><span className="text-[11px] font-medium tracking-wide text-zinc-500">
                      Rendered Preview
                    </span><span className="text-[11px] text-zinc-500">GitHub Flavored</span></div><div className="landing-scroll h-[320px] overflow-y-auto p-4 sm:h-[360px] sm:p-5"><MarkdownPreview markdown={markdown} /></div></div></div>{
    /* Bottom Pill Input */
  }<div className="border-t border-white/[0.07] bg-[#05070a] p-3 sm:p-4"><form
    onSubmit={handleGenerate}
    className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-white/[0.12] bg-[#0d1219] py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-sky-400/50"
  ><Sparkles className="hidden h-4 w-4 shrink-0 text-sky-300 sm:block" /><input
    type="text"
    value={promptInput}
    onChange={(e) => setPromptInput(e.target.value)}
    placeholder="Paste a GitHub repo link or describe your project..."
    aria-label="Paste a GitHub repo link or describe your project"
    className="min-w-0 flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none sm:text-sm"
  /><button
    type="submit"
    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#0d1219] transition-colors hover:bg-zinc-200 whitespace-nowrap shrink-0 cursor-pointer"
  ><span>Draft</span><ArrowRight className="h-3.5 w-3.5" /></button></form></div></div></div></div></div></section>;
}
