import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        app: resolve(process.cwd(), "index.html"),
        creatureLab: resolve(process.cwd(), "creature-lab.html"),
      },
    },
  },
  test: {
    // O acervo histórico não é código vivo: mantê-lo fora da suíte impede que
    // testes de cópias antigas inflem a contagem e mascarem a saúde real.
    exclude: ["**/node_modules/**", "**/dist/**", "AI_Studio_Lab/**"],
    setupFiles: ["src/test/setup.ts"],
  },
});
