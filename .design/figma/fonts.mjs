import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=" +
  [
    "Inter:wght@100..900",
    "Roboto:wght@100..900",
    "Playfair+Display:wght@400..900",
    "IBM+Plex+Mono:wght@700",
  ].join("&family=") +
  "&display=swap";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const PUB = path.resolve("client/public/fonts");
const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();
await mkdir(PUB, { recursive: true });

const out = [];
const seen = new Map();
const blocks = css.split("@font-face").slice(1);
for (const block of blocks) {
  if (!/font-family/.test(block)) continue;
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const weight = block.match(/font-weight:\s*([\d ]+)/)?.[1];
  const style = block.match(/font-style:\s*(\w+)/)?.[1];
  const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const unicode = block.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!family || !url) continue;
  const isLatin = /U\+0000-00FF/.test(unicode ?? "");

  let file = seen.get(url);
  if (!file) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`font fetch ${res.status}`);
    file = (jsonSafe(family) + "-" + path.basename(url)).toLowerCase();
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(PUB, file), buf);
    seen.set(url, file);
  }
  out.push(
    `@font-face {\n  font-family: "${family}";\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url("/fonts/${file}") format("woff2");\n  unicode-range: ${unicode};\n}`,
  );
}

await writeFile(path.resolve("client/src/styles/fonts.css"), out.join("\n\n") + "\n");
console.log(out.length, "font-face rules,", seen.size, "files");
await readFile(path.join(PUB, [...seen.values()][0]));

function jsonSafe(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
