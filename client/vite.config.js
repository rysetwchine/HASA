import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Ang `/api` proxy ay para sa susunod na yugto (Stage 2).
// Sa development, ang browser at API ay magkaparehong origin, kaya
// awtomatikong maipapadala ang httpOnly session cookie nang walang CORS.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: false,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
    include: ["src/**/*.test.{js,jsx}"],
  },
});
