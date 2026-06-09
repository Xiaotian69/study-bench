import katex from "katex";
import type { ReactNode } from "react";

function normalizeLatex(latex: string) {
  return latex.replace(/\\\\/g, "\\");
}

function renderLatex(latex: string, displayMode: boolean) {
  return katex.renderToString(normalizeLatex(latex), {
    displayMode,
    strict: "ignore",
    throwOnError: false
  });
}

function renderInlineParts(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g).filter((p) => p.length > 0);
  return parts.map((part, index) => {
    const isDisplay = part.startsWith("$$") && part.endsWith("$$");
    const isInline = !isDisplay && part.startsWith("$") && part.endsWith("$");

    if (isDisplay || isInline) {
      const delimLen = isDisplay ? 2 : 1;
      const latex = part.slice(delimLen, -delimLen);
      const html = renderLatex(latex, isDisplay);
      const Tag = isDisplay ? "div" : "span";
      return <Tag dangerouslySetInnerHTML={{ __html: html }} key={`${keyPrefix}-${index}`} />;
    }

    return (
      <span key={`${keyPrefix}-${index}`}>
        {part.split("\n").flatMap((line, li, arr) => {
          const nodes: ReactNode[] = [line];
          if (li < arr.length - 1) nodes.push(<br key={`${keyPrefix}-${index}-br-${li}`} />);
          return nodes;
        })}
      </span>
    );
  });
}

export function MathText({ className, text }: { className?: string; text: string }) {
  const paragraphs = text.split(/\n{2,}/);

  if (paragraphs.length === 1) {
    return <span className={className}>{renderInlineParts(text, "p0")}</span>;
  }

  return (
    <span className={className}>
      {paragraphs.map((para, i) => (
        <p key={i}>
          {renderInlineParts(para.trim(), `p${i}`)}
        </p>
      ))}
    </span>
  );
}
