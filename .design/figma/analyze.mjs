import { readFile } from "node:fs/promises";

const file = JSON.parse(await readFile(".design/figma/file-full.json", "utf8"));

const fontCount = new Map();
const colors = new Map();
const radii = new Map();
const shadows = new Map();
const effects = new Map();

const rgbToHex = (c) =>
  "#" +
  [c.r, c.g, c.b]
    .map((v) => Math.round(v * 255).toString(16).padStart(2, "0"))
    .join("");

function collect(node) {
  if (node.style?.fontFamily) {
    const key = `${node.style.fontFamily} | ${node.style.fontWeight} | ${Math.round(node.style.fontSize)}px`;
    fontCount.set(key, (fontCount.get(key) ?? 0) + 1);
  }
  for (const paint of [...(node.fills ?? []), ...(node.strokes ?? [])]) {
    if (paint.type === "SOLID" && paint.visible !== false) {
      const hex = rgbToHex(paint.color);
      colors.set(hex, (colors.get(hex) ?? 0) + 1);
    }
  }
  for (const r of [node.cornerRadius, ...(node.rectangleCornerRadii ?? [])]) {
    if (typeof r === "number" && r > 0) radii.set(r, (radii.get(r) ?? 0) + 1);
  }
  for (const e of node.effects ?? []) {
    if (e.visible === false) continue;
    const key = `${e.type} ${e.radius ?? ""} ${e.offset ? `${e.offset.x},${e.offset.y}` : ""} ${e.color ? rgbToHex(e.color) + "/" + e.color.a?.toFixed(2) : ""}`;
    effects.set(key, (effects.get(key) ?? 0) + 1);
  }
  for (const c of node.children ?? []) collect(c);
}

collect(file.document);

const top = (map, n = 25) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

console.log("=== FONTS (family | weight | size) xcount ===");
for (const [k, v] of top(fontCount, 40)) console.log(String(v).padStart(4), k);

console.log("\n=== COLORS ===");
for (const [k, v] of top(colors, 40)) console.log(String(v).padStart(4), k);

console.log("\n=== RADII ===");
for (const [k, v] of top(radii, 20)) console.log(String(v).padStart(4), k);

console.log("\n=== EFFECTS ===");
for (const [k, v] of top(effects, 20)) console.log(String(v).padStart(4), k);
