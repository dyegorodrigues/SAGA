import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // O acervo histórico não é código vivo: mantê-lo fora da suíte impede que
    // testes de cópias antigas inflem a contagem e mascarem a saúde real.
    exclude: ['**/node_modules/**', '**/dist/**', 'AI_Studio_Lab/**'],
    setupFiles: ['src/test/setup.ts'],
  },
});
