import { writeFile, mkdir } from "node:fs/promises";

const FRAMES = {
  login: { id: "1:1048", x: -2160, y: -3058, file: "login.png" },
  dashboard: { id: "42:107", x: -2160, y: -1739, file: "dashboard.png" },
  lessons: { id: "50:189", x: -2160, y: -294, file: "lessons.png" },
  practice: { id: "65:5", x: -462, y: -294, file: "practice.png" },
  rewards: { id: "74:628", x: -462, y: -1739, file: "rewards.png" },
};

// name -> [frame, x, y, w, h] in design coordinates
const CROPS = {
  "logo-books": ["dashboard", -2125, -1677, 129, 129],
  "nav-dashboard": ["dashboard", -2076, -1453, 48, 48],
  "nav-lessons": ["dashboard", -2076, -1339, 48, 48],
  "nav-ai": ["dashboard", -2076, -1225, 48, 48],
  "nav-practice": ["dashboard", -2076, -1109, 48, 48],
  "nav-rewards": ["dashboard", -2071, -990, 48, 48],
  "nav-progress": ["dashboard", -2076, -875, 48, 48],
  "icon-logout": ["dashboard", -2040, -490, 40, 40],
  "icon-bell": ["dashboard", -755, -1691, 29, 29],
  "mascot-hello": ["dashboard", -1189, -1622, 104, 104],
  "icon-trophy": ["dashboard", -1639, -1084, 41, 41],
  "icon-medal": ["dashboard", -1619, -977, 40, 40],
  "icon-megaphone": ["dashboard", -1620, -875, 44, 44],
  "icon-book": ["dashboard", -1653, -730, 41, 41],
  "icon-new": ["dashboard", -1640, -643, 54, 56],

  "logo-hasa": ["login", -1175, -3045, 457, 351],
  "feat-xp": ["login", -2071, -2444, 52, 48],
  "feat-ai": ["login", -2071, -2340, 52, 48],
  "feat-track": ["login", -2071, -2237, 52, 48],
  "input-lock": ["login", -1267, -2230, 28, 28],
  "input-user": ["login", -1268, -2331, 28, 28],
  "role-student": ["login", -1216, -2483, 33, 33],
  "role-teacher": ["login", -862, -2483, 33, 33],

  "banner-lessons": ["lessons", -1737, -295, 1235, 288],
  "icon-header-lessons": ["lessons", -2122, -239, 129, 129],
  "icon-header-practice": ["practice", 97, -119, 100, 100],
  "icon-header-rewards": ["rewards", 97, -1564, 100, 100],
  "search": ["lessons", -1682, 54, 20, 20],
  "view-grid": ["lessons", -1675, 148, 41, 41],
  "view-list": ["lessons", -655, 152, 22, 22],
  "thumb-1": ["lessons", -1649, 247, 261, 188],
  "thumb-2": ["lessons", -1268, 248, 261, 188],
  "thumb-3": ["lessons", -869, 247, 261, 188],
  "thumb-4": ["lessons", -1648, 588, 261, 188],
  "thumb-5": ["lessons", -1267, 589, 261, 188],
  "thumb-6": ["lessons", -868, 588, 261, 188],
  "diff-easy": ["lessons", -1640, 504, 14, 14],
  "diff-medium": ["lessons", -1637, 845, 14, 14],
  "diff-hard": ["lessons", -1259, 505, 14, 14],
  "action-review": ["lessons", -1462, 502, 15, 15],
  "action-star": ["lessons", -683, 502, 15, 15],
  "tip-icon": ["lessons", -1605, 944, 33, 33],
  "streak-fire": ["practice", 71, 103, 15, 15],
  "practice-trophy": ["practice", 427, 93, 52, 52],
  "practice-sparkle": ["practice", 447, 65, 126, 126],
  "practice-badge": ["practice", 653, 131, 32, 32],
  "practice-q": ["practice", 639, 277, 23, 23],
  "practice-xp": ["practice", 774, 279, 20, 20],
  "practice-play": ["practice", 828, 341, 10, 10],
  "challenge-check": ["practice", 41, 456, 25, 25],
  "challenge-1": ["practice", 57, 564, 28, 28],
  "challenge-2": ["practice", 464, 570, 28, 28],
  "challenge-3": ["practice", 871, 566, 28, 28],
  "challenge-4": ["practice", 56, 805, 28, 28],
  "challenge-5": ["practice", 870, 807, 28, 28],
  "challenge-6": ["practice", 463, 811, 28, 28],
};

await mkdir(".design/figma/crops", { recursive: true });
const list = Object.entries(CROPS).map(([name, [frameKey, x, y, w, h]]) => {
  const f = FRAMES[frameKey];
  return {
    name,
    file: f.file,
    x: Math.round((x - f.x) * 2),
    y: Math.round((y - f.y) * 2),
    w: Math.round(w * 2),
    h: Math.round(h * 2),
  };
});
await writeFile(".design/figma/crops.json", JSON.stringify(list, null, 2));
console.log(list.length, "crops");
