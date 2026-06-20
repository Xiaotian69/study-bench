// 一次性脚本：从 Google Fonts 抓取拉丁字体 woff2 并自托管到 public/fonts，
// 生成 app/fonts.css（@font-face 指向本地文件）。
// 目的：中国大陆访客不再依赖运行时访问 fonts.gstatic.com。
// 运行：node scripts/fetch-fonts.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "fonts");
const CSS_OUT = join(process.cwd(), "app", "fonts.css");
const KEEP_SUBSETS = new Set(["latin", "latin-ext"]);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const FAMILIES = [
  { name: "Spectral", url: "https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" },
  { name: "Source Serif 4", url: "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&display=swap" },
  { name: "IBM Plex Mono", url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const faceBlocks = [];

  for (const fam of FAMILIES) {
    const res = await fetch(fam.url, { headers: { "User-Agent": UA } });
    const css = await res.text();
    const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(css))) {
      const subset = m[1];
      if (!KEEP_SUBSETS.has(subset)) continue;
      const body = m[2];
      const family = (body.match(/font-family:\s*'([^']+)'/) || [])[1] || fam.name;
      const style = (body.match(/font-style:\s*(\w+)/) || [])[1] || "normal";
      const weight = (body.match(/font-weight:\s*(\d+)/) || [])[1] || "400";
      const url = (body.match(/src:\s*url\(([^)]+)\)/) || [])[1];
      const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
      if (!url) continue;

      const file = `${slug(family)}-${weight}-${style}-${subset}.woff2`;
      const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
      await writeFile(join(OUT_DIR, file), buf);
      console.log(`saved ${file} (${(buf.length / 1024).toFixed(1)} KB)`);

      faceBlocks.push(
        `@font-face {\n  font-family: '${family}';\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url('/fonts/${file}') format('woff2');\n  unicode-range: ${range};\n}`,
      );
    }
  }

  const header = "/* 自托管字体 —— 由 scripts/fetch-fonts.mjs 生成，请勿手改。\n   中文走本地宋体/思源回退（见 globals.css 字体栈）。 */\n\n";
  await writeFile(CSS_OUT, header + faceBlocks.join("\n\n") + "\n");
  console.log(`\n${faceBlocks.length} @font-face -> app/fonts.css`);
}

run().catch((e) => { console.error(e); process.exit(1); });
