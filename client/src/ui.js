// Shared Tailwind class strings
export const iconBtn =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-panel2 hover:text-white'

export const btnPrimary =
  'rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50'

export const btnGhost = 'rounded-lg px-4 py-2 font-medium text-muted hover:bg-panel2'

export const linkBtn = 'text-accent underline underline-offset-2'

// pill toggle used for Imme/Repome and File/Raw
export const pillWrap = 'inline-flex items-center gap-1.5 rounded-full border border-line bg-[#151b24] p-1.5'
export const pillBtn = (on, size = 'px-5') =>
  `rounded-full ${size} py-1 text-l transition-colors ${
    on ? 'bg-[#e6edf3] font-medium text-[#0b0f16]' : 'text-muted hover:text-white'
  }`
