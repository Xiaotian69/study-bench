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

function renderTextWithBreaks(text: string, keyPrefix: string): ReactNode[] {
  return text.split("\n").flatMap((line, index, lines) => {
    const nodes: ReactNode[] = [`${line}`];
    if (index < lines.length - 1) {
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
    }
    return nodes;
  });
}

export function MathText({ className, text }: { className?: string; text: string }) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g).filter((part) => part.length > 0);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isDisplay = part.startsWith("$$") && part.endsWith("$$");
        const isInline = part.startsWith("$") && part.endsWith("$");

        if (isDisplay || isInline) {
          const delimiterLength = isDisplay ? 2 : 1;
          const latex = part.slice(delimiterLength, -delimiterLength);
          const html = renderLatex(latex, isDisplay);
          const Tag = isDisplay ? "div" : "span";

          return <Tag dangerouslySetInnerHTML={{ __html: html }} key={`${index}-${part}`} />;
        }

        return renderTextWithBreaks(part, `text-${index}`);
      })}
    </span>
  );
}
