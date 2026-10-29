import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const KEY = "RnfdX0GYsOwcpp7b30d6bn";
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) throw new Error("FIGMA_TOKEN missing");

const DIR = path.resolve(".design/figma/assets");
await mkdir(DIR, { recursive: true });

const file = JSON.parse(await readFile(".design/figma/file-full.json", "utf8"));
const nodes = [];
const walk = (n) => {
  if ((n.fills ?? []).some((p) => p.type === "IMAGE")) {
    const b = n.absoluteBoundingBox ?? {};
    nodes.push({
      id: n.id,
      name: n.name,
      w: Math.round(b.width ?? 0),
      h: Math.round(b.height ?? 0),
      ref: n.fills.find((p) => p.type === "IMAGE").imageRef,
    });
  }
  for (const c of n.children ?? []) walk(c);
};
walk(file.document);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One request for every image node. Figma batches internally.
let json = null;
for (let attempt = 0; attempt < 6; attempt++) {
  const res = await fetch(
    `https://api.figma.com/v1/images/${KEY}?ids=${encodeURIComponent(nodes.map((n) => n.id).join(","))}&format=png&scale=2`,
    { headers: { "X-Figma-Token": TOKEN } },
  );
  if (res.status === 429) {
    console.log("429, retrying in", 30 * (attempt + 1), "s");
    await sleep(30000 * (attempt + 1));
    continue;
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  json = await res.json();
  break;
}
if (!json) throw new Error("could not get image urls");

const manifest = [];
for (const node of nodes) {
  const url = json.images[node.id];
  if (!url) {
    console.log("missing", node.id);
    continue;
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const safe = node.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const filename = `${node.id.replace(":", "-")}-${safe}.png`;
  await writeFile(path.join(DIR, filename), buf);
  manifest.push({
    ...node,
    file: filename,
    bytes: buf.length,
    hash: createHash("sha1").update(buf).digest("hex").slice(0, 10),
  });
}

await writeFile(path.join(DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("exported", manifest.length, "unique hashes", new Set(manifest.map((m) => m.hash)).size);
