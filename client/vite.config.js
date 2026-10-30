import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Sa development, ang `/api` ay naka-proxy sa local API (port 3000), kaya
 * magkaparehong origin ang browser at API at awtomatikong naipapadala ang
 * httpOnly session cookie nang walang CORS.
 *
 * Sa production, itakda ang `VITE_API_URL` sa pinagmulan ng API (walang
 * `/api`), hal. https://hasa-api.onrender.com. Kung blangko, gagamitin ang
 * `/api` sa parehong domain — kapaki-pakinabang kapag ang API ay nasa
 * ilalim ng parehong origin sa pamamagitan ng rewrite.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Walang source map sa production build.
    sourcemap: false,
    // Ang bawat pahina ay hiwalay nang chunk dahil sa lazy routes sa
    // app/router.jsx — hindi na kailangan ng manual chunking.
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_API_TARGET || "http://localhost:3000",
        changeOrigin: false,
      },
    },
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
    include: ["src/**/*.test.{js,jsx}"],
  },
});
