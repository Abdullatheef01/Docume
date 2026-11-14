export function Footer({ onOpenLegal }) {
  const handleLegalClick = (e, doc) => {
    e.preventDefault();
    onOpenLegal(doc);
  };
  return <footer className="relative overflow-hidden border-t border-white/[0.08] bg-black pt-14 pb-12"><div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"><div className="space-y-2"><div className="flex items-center gap-2.5"><img src="/assets/aistudio/docume__3__8edd037f.png" alt="Docume logo" className="h-7 w-7 rounded-full object-contain" /><span className="text-base font-semibold tracking-tight text-white">Docume</span></div><p className="text-xs text-zinc-400">
            © 2026 Docume ·{" "}<a
    href="https://docume.co.in"
    target="_blank"
    rel="noreferrer"
    className="text-zinc-300 transition-colors hover:text-white"
  >
              docume.co.in
            </a></p></div><div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-400"><a href="#features" className="transition-colors hover:text-white whitespace-nowrap">
            Features
          </a><a href="#how-it-works" className="transition-colors hover:text-white whitespace-nowrap">
            How it works
          </a><a href="#templates" className="transition-colors hover:text-white whitespace-nowrap">
            Templates
          </a><a
    href="/privacy"
    onClick={(e) => handleLegalClick(e, "privacy")}
    className="transition-colors hover:text-white whitespace-nowrap"
  >
            Privacy
          </a><a
    href="/terms"
    onClick={(e) => handleLegalClick(e, "terms")}
    className="transition-colors hover:text-white whitespace-nowrap"
  >
            Terms
          </a></div></div></footer>;
}
