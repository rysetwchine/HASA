import { readFile, writeFile } from "node:fs/promises";

const file = JSON.parse(await readFile(".design/figma/file-full.json", "utf8"));
const frames = {
  "1:1048": "login",
  "42:107": "dashboard",
  "50:189": "lessons",
  "65:5": "practice",
  "74:628": "rewards",
  "80:2": "progress",
};

const hex = (c) =>
  "#" +
  [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");

function fill(node) {
  const f = (node.fills ?? []).filter((p) => p.visible !== false);
  if (!f.length) return "";
  return f
    .map((p) => {
      if (p.type === "SOLID") return hex(p.color) + (p.opacity != null && p.opacity < 1 ? `@${p.opacity}` : "");
      if (p.type?.startsWith("IMAGE")) return "IMG";
      if (p.type?.includes("GRADIENT")) return "GRAD";
      return p.type;
    })
    .join("+");
}

const lines = [];
function walk(node, depth = 0) {
  const b = node.absoluteBoundingBox ?? {};
  const props = [];
  if (node.type === "TEXT") {
    const s = node.style ?? {};
    props.push(`"${(node.characters ?? "").replace(/\n/g, "\\n").slice(0, 70)}"`);
    props.push(`${s.fontFamily} ${s.fontWeight} ${Math.round(s.fontSize)}px`);
    if (s.lineHeightPx) props.push(`lh${Math.round(s.lineHeightPx)}`);
    if (s.letterSpacing) props.push(`ls${s.letterSpacing}`);
    if (s.textAlignHorizontal && s.textAlignHorizontal !== "LEFT") props.push(s.textAlignHorizontal);
  }
  const f = fill(node);
  if (f) props.push(`bg:${f}`);
  if (node.cornerRadius) props.push(`r:${node.cornerRadius}`);
  if (node.strokes?.length) props.push(`stroke:${(node.strokes ?? []).map((p) => (p.type === "SOLID" ? hex(p.color) : p.type)).join(",")}${node.strokeWeight ? "/" + node.strokeWeight : ""}`);
  if (node.layoutMode && node.layoutMode !== "NONE") {
    props.push(`flex:${node.layoutMode}`);
    props.push(`pad:${node.paddingTop ?? 0},${node.paddingRight ?? 0},${node.paddingBottom ?? 0},${node.paddingLeft ?? 0}`);
    if (node.itemSpacing) props.push(`gap:${node.itemSpacing}`);
  }
  lines.push(
    `${"  ".repeat(depth)}${node.type} ${node.id} [${Math.round(b.x ?? 0)},${Math.round(b.y ?? 0)} ${Math.round(b.width ?? 0)}x${Math.round(b.height ?? 0)}] ${node.name.replace(/\n/g, " ")} ${props.join(" ")}`,
  );
  for (const c of node.children ?? []) walk(c, depth + 1);
}

const doc = file.document;
for (const page of doc.children) {
  for (const frame of page.children ?? []) {
    if (!frames[frame.id]) continue;
    lines.push(`\n\n========== ${frames[frame.id].toUpperCase()} (${frame.id}) ==========`);
    walk(frame, 0);
  }
}
await writeFile(".design/figma/outline.txt", lines.join("\n"));
console.log("written", lines.length, "lines");
