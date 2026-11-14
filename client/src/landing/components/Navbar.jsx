import { useState } from "react";
import { Menu, X } from "lucide-react";
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "FAQ", href: "#faq" }
];
export function Navbar({ onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <header className="pointer-events-none sticky top-3 z-40 px-4 sm:top-4 sm:px-6 lg:px-8">{mobileOpen ? <div
    aria-hidden="true"
    onClick={() => setMobileOpen(false)}
    className="pointer-events-auto fixed inset-0 -z-10 bg-black/40 backdrop-blur-md md:hidden"
  /> : null}<div className="pointer-events-auto relative mx-auto flex h-12 w-full max-w-md items-center justify-between gap-6 overflow-hidden rounded-full border border-white/[0.18] bg-gradient-to-b from-white/[0.11] via-[#0d1219]/55 to-[#090d14]/70 px-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.34),inset_0_-1px_1px_rgba(168,210,255,0.12),inset_0_0_20px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent md:max-w-2xl md:px-5">{
    /* Zone 1: Brand Wordmark */
  }<a
    href="#"
    className="flex items-center gap-2 text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
  ><span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center overflow-hidden rounded-full"><img
    src="/assets/aistudio/docume__3__8edd037f.png"
    alt="Docume logo"
    referrerPolicy="no-referrer"
    className="h-[26px] w-[26px] object-contain"
  /></span><span className="text-[17px] font-semibold tracking-tight">Docume</span></a>{
    /* Zone 2: Navigation Links */
  }<nav
    aria-label="Primary navigation"
    className="hidden items-center gap-5 md:flex"
  >{NAV_LINKS.map((link) => <a
    key={link.href}
    href={link.href}
    className="text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
  >{link.label}</a>)}</nav>{
    /* Zone 3: Primary Action + Mobile Trigger */
  }<div className="flex items-center gap-2.5 shrink-0"><button
    type="button"
    onClick={onOpenAuth}
    className="hidden rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#0d1219] transition-colors duration-150 hover:bg-zinc-200 whitespace-nowrap shrink-0 cursor-pointer md:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
            Get started
          </button><button
    type="button"
    onClick={() => setMobileOpen((prev) => !prev)}
    aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={mobileOpen}
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors hover:bg-white/[0.08] md:hidden"
  >{mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button></div></div>{
    /* Mobile Navigation Drawer */
  }{mobileOpen ? <div className="pointer-events-auto mx-auto mt-2 max-w-2xl rounded-3xl border border-white/[0.1] bg-[#0d1219]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"><nav className="flex flex-col gap-1" aria-label="Mobile navigation">{NAV_LINKS.map((link) => <a
    key={link.href}
    href={link.href}
    onClick={() => setMobileOpen(false)}
    className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
  >{link.label}</a>)}<button
    type="button"
    onClick={() => {
      setMobileOpen(false);
      onOpenAuth();
    }}
    className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0d1219] transition-colors hover:bg-zinc-200"
  >
              Login
            </button></nav></div> : null}</header>;
}
