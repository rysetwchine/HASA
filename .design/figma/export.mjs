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

// Full document so we can read real fonts, colours and spacing.
const file = await api(`https://api.figma.com/v1/files/${KEY}`);
await writeFile(path.join(OUT, "file-full.json"), JSON.stringify(file));

const frames = [
  ["1:1048", "login"],
  ["42:107", "dashboard"],
  ["50:189", "lessons"],
  ["65:5", "practice"],
  ["74:628", "rewards"],
  ["80:2", "progress"],
];

const ids = frames.map(([id]) => id).join(",");
const images = await api(
  `https://api.figma.com/v1/images/${KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`,
);
console.log(JSON.stringify(images.err ?? {}, null, 2));

for (const [id, slug] of frames) {
  const url = images.images[id];
  if (!url) {
    console.log("missing image", id, slug);
    continue;
  }
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT, `${slug}.png`), buf);
  console.log(slug, buf.length, "bytes");
}
