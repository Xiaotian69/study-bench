// Text/math parser — converts markdown+LaTeX text into rich-text node arrays
// rich-text nodes: {name, attrs:{style}, children:[]} | {type:'text', text:''}

const DISPLAY_MATH_STYLE = [
  'background:#f6f0e4',
  'border-left:3rpx solid #8a2b2b',
  'padding:12rpx 20rpx',
  'margin:12rpx 0',
  'font-family:Courier New,monospace',
  'font-size:26rpx',
  'color:#211c16',
  'display:block',
  'word-break:break-all',
  'white-space:pre-wrap',
].join(';');

const INLINE_MATH_STYLE = [
  'font-family:Courier New,monospace',
  'color:#8a2b2b',
  'font-size:0.95em',
].join(';');

const PARA_STYLE = 'margin:0 0 16rpx 0;line-height:1.8;display:block;';

function normalizeLatex(str) {
  // JSON stores 4 backslashes per LaTeX backslash; normalize to single
  return str.replace(/\\\\/g, '\\');
}

function parseBoldItalic(text) {
  const nodes = [];
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      nodes.push({
        name: 'strong',
        attrs: { style: 'font-weight:700;' },
        children: [{ type: 'text', text: p.slice(2, -2) }],
      });
    } else if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      nodes.push({
        name: 'em',
        attrs: { style: 'font-style:italic;' },
        children: [{ type: 'text', text: p.slice(1, -1) }],
      });
    } else {
      nodes.push({ type: 'text', text: p });
    }
  }
  return nodes;
}

function parseInline(text) {
  const nodes = [];
  // Split on inline math $...$
  const parts = text.split(/(\$[^$\n]+\$)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      nodes.push({
        name: 'span',
        attrs: { style: INLINE_MATH_STYLE },
        children: [{ type: 'text', text: part.slice(1, -1) }],
      });
    } else {
      // Handle newlines and bold/italic
      const lines = part.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) nodes.push({ name: 'br', attrs: {}, children: [] });
        nodes.push(...parseBoldItalic(lines[i]));
      }
    }
  }
  return nodes;
}

function parseText(text) {
  if (!text) return [];
  const normalized = normalizeLatex(text);

  // First split on display math $$...$$
  const chunks = normalized.split(/(\$\$[\s\S]+?\$\$)/g);
  const topNodes = [];

  for (const chunk of chunks) {
    if (!chunk) continue;
    if (chunk.startsWith('$$') && chunk.endsWith('$$')) {
      topNodes.push({
        name: 'div',
        attrs: { style: DISPLAY_MATH_STYLE },
        children: [{ type: 'text', text: chunk.slice(2, -2).trim() }],
      });
    } else {
      // Split on paragraph breaks
      const paragraphs = chunk.split(/\n{2,}/);
      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;
        topNodes.push({
          name: 'div',
          attrs: { style: PARA_STYLE },
          children: parseInline(trimmed),
        });
      }
    }
  }

  return topNodes;
}

module.exports = { parseText, normalizeLatex };
