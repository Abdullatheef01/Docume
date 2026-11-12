import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { pillBtn, pillWrap } from '../ui.js'

// GitHub-like sanitising, but allow the attributes READMEs rely on (align, width, height)
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'align'],
    img: [...(defaultSchema.attributes?.img ?? []), 'width', 'height', 'align'],
  },
}

export default function Preview({ markdown, view, onViewChange, contentRef }) {
  return (
    <section
      className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-panel"
      aria-label="Preview"
    >
      <div className="min-h-0 flex-1 overflow-auto px-6 pb-20 pt-5 code-editor-wrap">
        {view === 'file' ? (
          <div className="md" ref={contentRef}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="raw m-0 whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-[#c9d1d9]">
            <code>{markdown}</code>
          </pre>
        )}
      </div>

   <div className={`${pillWrap} absolute bottom-4 right-4`} role="tablist" aria-label="Preview mode">
  <button role="tab" aria-selected={view === 'file'} className={pillBtn(view === 'file', 'px-2')} onClick={() => onViewChange('file')}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M8,18h8V16H8v2Zm0-4h8V12H8v2ZM6,22q-.82,0-1.41-.59T4,20V4Q4,3.17 4.59,2.59T6,2h8l6,6V20q0,.82-.59,1.41T18,22H6ZM13,9V4H6V20H18V9H13Z"/>
    </svg>
  </button>
 <button role="tab" aria-selected={view === 'raw'} className={pillBtn(view === 'raw', 'px-2')} onClick={() => onViewChange('raw')}>
  <span className="material-symbols-outlined text-[16px]">code</span>
</button>
</div>
    </section>
  )
}
