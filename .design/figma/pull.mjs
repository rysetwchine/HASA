import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const KEY = "RnfdX0GYsOwcpp7b30d6bn";
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) throw new Error("FIGMA_TOKEN missing");

const OUT = path.resolve(".design/figma");
await mkdir(OUT, { recursive: true });

const api = async (url) => {
  const res = await fetch(url, { headers: { "X-Figma-Token": TOKEN } });
  if (!res.ok) throw new Error(`${res.status} ${url}: ${await res.text()}`);
  return res.json();
};

const file = await api(`https://api.figma.com/v1/files/${KEY}?depth=2`);
await writeFile(path.join(OUT, "file.json"), JSON.stringify(file, null, 2));

const lines = [];
lines.push(`name: ${file.name}  lastModified: ${file.lastModified}`);
for (const page of file.document.children) {
  lines.push(`\nPAGE ${page.id}  "${page.name}"  (${page.children?.length ?? 0} children)`);
  for (const node of page.children ?? []) {
    const box = node.absoluteBoundingBox || {};
    lines.push(
      `  ${node.type.padEnd(12)} ${node.id.padEnd(12)} ${String(Math.round(box.width ?? 0)).padStart(5)}x${String(Math.round(box.height ?? 0)).padStart(5)}  ${node.name}`,
    );
  }
}
console.log(lines.join("\n"));
