import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  /**
   * O prefixo das URLs do build.
   *
   * `/` serve o app na raiz de um domínio — é o caso do `npm start` e de
   * qualquer hospedagem própria. O GitHub Pages de um repositório serve em
   * `usuario.github.io/NOME-DO-REPO/`, uma SUBPASTA: ali todo caminho
   * absoluto (`/assets/...`, `/icones/...`) apontaria para a raiz do domínio
   * e voltaria 404 — a tela abriria em branco.
   *
   * Por variável de ambiente para que o mesmo código sirva aos dois destinos
   * sem ninguém precisar lembrar de editar (e esquecer de desfazer) um valor
   * fixo aqui. Quem publica no Pages define `SAGA_BASE=/SAGA/`.
   */
  base: process.env.SAGA_BASE || "/",
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
