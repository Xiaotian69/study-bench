// Text/math parser — converts markdown+LaTeX text into rich-text node arrays
// rich-text nodes: {name, attrs:{style}, children:[]} | {type:'text', text:''}

const DISPLAY_MATH_STYLE = [
  'display:block',
  'background:#f6f0e4',
  'border-left:4rpx solid #8a2b2b',
  'padding:12rpx 20rpx',
  'margin:12rpx 0',
  'font-family:Courier New,monospace',
  'font-size:26rpx',
  'color:#211c16',
  'word-break:break-all',
  'white-space:pre-wrap',
  'line-height:1.7',
].join(';');

const INLINE_MATH_STYLE = [
  'font-family:Courier New,monospace',
  'color:#8a2b2b',
  'font-size:0.93em',
  'letter-spacing:-0.01em',
].join(';');

const PARA_STYLE = 'display:block;margin:0 0 14rpx 0;line-height:1.8;';
const BULLET_ITEM_STYLE = 'display:block;padding-left:24rpx;margin-bottom:8rpx;line-height:1.8;position:relative;';
const BULLET_STYLE = 'position:absolute;left:0;color:#8a2b2b;font-weight:700;';
const ORDERED_ITEM_STYLE = 'display:block;padding-left:36rpx;margin-bottom:8rpx;line-height:1.8;position:relative;';
const ORDERED_NUM_STYLE = 'position:absolute;left:0;color:#8a2b2b;font-weight:700;font-size:0.9em;';

function normalizeLatex(str) {
  return str.replace(/\\\\/g, '\\');
}

// ── Inline parsers ────────────────────────────────────────────

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
        attrs: { style: 'font-style:italic;color:#4a3728;' },
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
      const lines = part.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) nodes.push({ name: 'br', attrs: {}, children: [] });
        nodes.push(...parseBoldItalic(lines[i]));
      }
    }
  }
  return nodes;
}

// ── Block-level line classification ──────────────────────────

function classifyLine(line) {
  if (/^[-·•]\s/.test(line)) return { type: 'bullet', content: line.replace(/^[-·•]\s/, '') };
  if (/^\d+[.)]\s/.test(line)) {
    const m = line.match(/^(\d+)[.)]\s(.*)/);
    return { type: 'ordered', num: m[1], content: m[2] };
  }
  return { type: 'text', content: line };
}

// ── Block builder ─────────────────────────────────────────────

function buildListItem(content, prefix, prefixStyle, itemStyle) {
  return {
    name: 'div',
    attrs: { style: itemStyle },
    children: [
      { name: 'span', attrs: { style: prefixStyle }, children: [{ type: 'text', text: prefix }] },
      ...parseInline(content),
    ],
  };
}

function buildParagraphNodes(text) {
  const lines = text.split('\n');
  const nodes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    const classified = classifyLine(line);

    if (classified.type === 'bullet') {
      // Collect consecutive bullet items
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; break; }
        const c = classifyLine(l);
        if (c.type !== 'bullet') break;
        items.push(c.content);
        i++;
      }
      nodes.push({
        name: 'div',
        attrs: { style: 'margin:8rpx 0 14rpx 0;' },
        children: items.map(item =>
          buildListItem(item, '·', BULLET_STYLE, BULLET_ITEM_STYLE)
        ),
      });
    } else if (classified.type === 'ordered') {
      // Collect consecutive ordered items
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; break; }
        const c = classifyLine(l);
        if (c.type !== 'ordered') break;
        items.push({ num: c.num, content: c.content });
        i++;
      }
      nodes.push({
        name: 'div',
        attrs: { style: 'margin:8rpx 0 14rpx 0;' },
        children: items.map(item =>
          buildListItem(item.content, item.num + '.', ORDERED_NUM_STYLE, ORDERED_ITEM_STYLE)
        ),
      });
    } else {
      // Regular text line — group consecutive text lines into a paragraph
      const textLines = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; break; }
        if (classifyLine(l).type !== 'text') break;
        textLines.push(l);
        i++;
      }
      // Build as a single paragraph with <br> between lines
      const children = [];
      for (let j = 0; j < textLines.length; j++) {
        if (j > 0) children.push({ name: 'br', attrs: {}, children: [] });
        children.push(...parseInline(textLines[j]));
      }
      nodes.push({ name: 'div', attrs: { style: PARA_STYLE }, children });
    }
  }

  return nodes;
}

// ── Main entry ────────────────────────────────────────────────

function parseText(text) {
  if (!text) return [];
  const normalized = normalizeLatex(text);

  // Split on display math $$...$$ first
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
      // Split into paragraphs
      const paragraphs = chunk.split(/\n{2,}/);
      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;
        topNodes.push(...buildParagraphNodes(trimmed));
      }
    }
  }

  return topNodes;
}

module.exports = { parseText, normalizeLatex };
