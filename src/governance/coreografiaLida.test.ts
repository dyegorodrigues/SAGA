import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "../curriculum/fichas";

/**
 * Catraca da coreografia LIDA — a chave que a ficha declara e ninguém lê.
 *
 * ## O que esta catraca acha que a irmã não acha
 *
 * `coreografiaViva.test.tsx` renderiza os palcos e pergunta "a tela mudou?".
 * É a pergunta certa, mas cara: leva meio minuto, é cega para efeito que só
 * vive em `transform`, e quando acusa não diz POR QUÊ.
 *
 * Esta aqui pergunta a montante e em estático: **cada chave que alguma ficha
 * escreve dentro de `show` é lida por algum componente?** Em segundos, sem
 * render, sem sorteio, e apontando a chave e a ficha pelo nome.
 *
 * A medida da primeira execução: **185 chaves declaradas, 64 lidas, 129
 * órfãs.** Os 215 passos mortos que a irmã contou não são 215 defeitos
 * independentes — são, em grande parte, estas 129 palavras que as fichas
 * falam e os palcos não entendem. `destacarTodos`, `pulsarTampa`,
 * `fecharMoldura`, `destacarMoeda`, `piscarLados`: escritas na ficha,
 * ignoradas na tela.
 *
 * ## Por que as duas, e não uma
 *
 * Esta sozinha se engana: basta alguém escrever `mostrar?.foo` num canto para
 * a chave sair da lista sem nada aparecer na tela. A irmã sozinha é cega para
 * `transform` e não sabe dizer a causa. Juntas, fechar o buraco exige que a
 * chave seja LIDA e que a tela MUDE — e nenhuma das duas cede à outra.
 *
 * ## Como se descobre o que é "lido"
 *
 * Varre-se `src/components` atrás de `mostrar?.chave` / `mostrar.chave` e das
 * chaves declaradas no tipo `mostrar?: { ... }` de cada palco. É descoberta
 * sobre o código que existe, nunca lista escrita à mão (D068) — e por isso
 * acompanha sozinha qualquer palco novo.
 */

const CAMINHO = resolve(__dirname, "coreografia-lida.baseline.json");
const COMPONENTES = resolve(__dirname, "..", "components");

/** Toda chave que alguma ficha da jornada escreve dentro de um `show`. */
function chavesDeclaradas(): Map<string, Set<string>> {
  const mapa = new Map<string, Set<string>>();
  for (const ficha of JOURNEY_FICHAS) {
    for (const micro of ficha.micros ?? []) {
      const bruto = (micro.params as { tutorial?: unknown } | undefined)?.tutorial;
      const passos: { show?: Record<string, unknown> }[] = Array.isArray(bruto) ? bruto : [];
      for (const passo of passos) {
        for (const chave of Object.keys(passo?.show ?? {})) {
          if (!mapa.has(chave)) mapa.set(chave, new Set());
          mapa.get(chave)!.add(ficha.id);
        }
      }
    }
  }
  return mapa;
}

/** Toda chave que algum componente lê de `mostrar`. */
function chavesLidas(): Set<string> {
  const lidas = new Set<string>();
  const varrer = (dir: string) => {
    for (const entrada of readdirSync(dir)) {
      const caminho = join(dir, entrada);
      if (statSync(caminho).isDirectory()) { varrer(caminho); continue; }
      if (!/\.tsx?$/.test(entrada) || /\.test\./.test(entrada)) continue;
      const fonte = readFileSync(caminho, "utf8");
      // O acesso direto: `mostrar?.destacarMaior`, `mostrar.taparN`.
      for (const m of fonte.matchAll(/mostrar\??\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) lidas.add(m[1]);
      // E o contrato do palco: `mostrar?: { destacarMaior?: boolean; ... }`.
      for (const m of fonte.matchAll(/mostrar\??:\s*\{([^}]*)\}/gs)) {
        for (const linha of m[1].split(/[,\n]/)) {
          const nome = linha.trim().split(/[?:=\s]/)[0];
          if (nome && /^[a-zA-Z_]/.test(nome)) lidas.add(nome);
        }
      }
    }
  };
  varrer(COMPONENTES);
  return lidas;
}

describe("catraca da coreografia lida", () => {
  it("nenhuma chave nova de micro-aula nasce órfã, e as consertadas saem da lista", () => {
    const declaradas = chavesDeclaradas();
    const lidas = chavesLidas();
    const orfas = [...declaradas.keys()].filter(c => !lidas.has(c)).sort();

    if (process.env.ATUALIZAR_COREOGRAFIA === "1") {
      writeFileSync(CAMINHO, `${JSON.stringify(orfas, null, 2)}\n`);
      return;
    }

    const baseline: string[] = JSON.parse(readFileSync(CAMINHO, "utf8"));
    const novas = orfas.filter(c => !baseline.includes(c));
    expect(
      novas,
      [
        "Chaves de micro-aula que nenhuma tela lê:",
        ...novas.map(c => `  ${c}  (${[...(declaradas.get(c) ?? [])].join(", ")})`),
        "",
        "Declarar coreografia que ninguém lê é prometer uma aula que não acontece.",
      ].join("\n"),
    ).toEqual([]);

    const ligadas = baseline.filter(c => !orfas.includes(c));
    expect(
      ligadas.length,
      [
        `${ligadas.length} chaves foram ligadas e a baseline não desceu: ${ligadas.join(", ")}`,
        "Rode `npm run coreografia:baseline`. A catraca só desce.",
      ].join("\n"),
    ).toBe(0);
  });
});
