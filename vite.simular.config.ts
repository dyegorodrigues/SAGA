import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Configuração só do `npm run simular`.
 *
 * A simulação de Monte Carlo do aprendiz sintético fica fora da suíte normal
 * pelo `exclude` da `vite.config.ts` — ela leva minutos, e `npm test` precisa
 * continuar sendo algo que se roda a cada mudança. Trazê-la de volta pela linha
 * de comando não funciona: o `--exclude` do vitest ACRESCENTA ao da config em
 * vez de substituí-lo, e o arquivo continuava invisível.
 *
 * Então a simulação tem config própria, que aponta direto para ela. Uma config
 * separada é mais honesta que um sinalizador escondido: quem lê o
 * `package.json` vê qual arquivo roda, e por quê.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    include: ["scripts/simular.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: ["src/test/setup.ts"],
  },
});
