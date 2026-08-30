import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // O acervo histórico não é código vivo: mantê-lo fora da suíte impede que
    // testes de cópias antigas inflem a contagem e mascarem a saúde real.
    // `scripts/**` fica de fora da suíte normal: a simulação de Monte Carlo do
    // aprendiz sintético leva minutos, e `npm test` precisa continuar sendo
    // algo que se roda a cada mudança. O `npm run simular` a traz de volta
    // sobrescrevendo este `exclude` na linha de comando.
    exclude: ['**/node_modules/**', '**/dist/**', 'AI_Studio_Lab/**', 'scripts/**'],
    setupFiles: ['src/test/setup.ts'],
  },
});
