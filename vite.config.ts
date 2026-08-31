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
  /**
   * O aplicativo saía num arquivo só de 2,9 MB (815 KB comprimidos). No 4G de
   * um tablet isso é dezena de segundos de tela branca antes do primeiro
   * desenho — e é a primeira impressão de quem abre o link.
   *
   * A separação não diminui o total baixado na primeira visita; ela muda o que
   * acontece DEPOIS. React e Firebase quase não mudam entre uma publicação e
   * outra: em pedaço próprio, o navegador os guarda e a atualização seguinte
   * só rebaixa o pedaço do SAGA. Como o app se republica a cada mudança, essa
   * é a diferença entre a criança esperar tudo de novo toda semana ou não.
   */
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
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
