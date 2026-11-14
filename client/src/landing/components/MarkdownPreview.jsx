import React from "react";
function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return <code
        key={idx}
        className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.82em] text-sky-200"
      >{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={idx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
export function MarkdownPreview({ markdown, compact = false }) {
  const lines = markdown.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          className={`overflow-x-auto rounded-xl border border-white/[0.08] bg-[#05070a] font-mono text-zinc-200 ${compact ? "my-2 p-2.5 text-[11px]" : "my-3 p-3.5 text-xs"}`}
        ><code>{codeLines.join("\n")}</code></pre>
      );
      i++;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const raw = lines[i].trim();
        const cells = raw.slice(1, raw.endsWith("|") ? -1 : void 0).split("|").map((c) => c.trim());
        const isSeparator = cells.every((c) => /^:?-{2,}:?$/.test(c));
        if (!isSeparator) {
          tableRows.push(cells);
        }
        i++;
      }
      if (tableRows.length > 0) {
        const [header, ...body] = tableRows;
        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-xl border border-white/[0.08]"
          ><table className="w-full text-left text-xs"><thead className="border-b border-white/[0.08] bg-white/[0.03] text-zinc-200"><tr>{header.map((cell, ci) => <th key={ci} className="px-3 py-2 font-medium">{renderInline(cell)}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.06] text-zinc-400">{body.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="px-3 py-2">{renderInline(cell)}</td>)}</tr>)}</tbody></table></div>
        );
      }
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h3
          key={`h1-${i}`}
          className={`border-b border-white/[0.08] pb-2 font-semibold tracking-tight text-white ${compact ? "mb-2 text-base" : "mb-3 text-lg"}`}
        >{renderInline(line.slice(2))}</h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h4
          key={`h2-${i}`}
          className={`font-semibold tracking-tight text-zinc-100 ${compact ? "mt-3 mb-1.5 text-xs" : "mt-4 mb-2 text-sm"}`}
        >{renderInline(line.slice(3))}</h4>
      );
      i++;
      continue;
    }
    if (line.trim().startsWith("- ")) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className={`list-disc space-y-1 pl-4 text-zinc-300 ${compact ? "my-1.5 text-[11px]" : "my-2.5 text-xs sm:text-[13px]"}`}
        >{listItems.map((item, li) => <li key={li}>{renderInline(item)}</li>)}</ul>
      );
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    elements.push(
      <p
        key={`p-${i}`}
        className={`leading-relaxed text-zinc-300 ${compact ? "my-1.5 text-[11px]" : "my-2 text-xs sm:text-[13px]"}`}
      >{renderInline(line)}</p>
    );
    i++;
  }
  return <div className="space-y-0.5">{elements}</div>;
}
