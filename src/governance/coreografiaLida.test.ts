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
 * A medida: **185 chaves declaradas dentro de `show`, 55 lidas de verdade,
 * 130 órfãs.** Os 215 passos mortos que a irmã contou não são 215 defeitos
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
      // Só o ACESSO conta: `mostrar?.destacarMaior`, `mostrar.taparN`.
      //
      // A primeira versão também contava as chaves declaradas no tipo
      // `mostrar?: { ... }` de cada palco, e isso era duas coisas erradas ao
      // mesmo tempo. Uma: chave no tipo e nunca lida no corpo é exatamente o
      // defeito que esta catraca existe para achar — o `MolduraStage` tipa
      // `pulsarTampa` e `contarUmAUm` e não usa nenhum dos dois. Outra: o
      // recorte `[^}]*` parava na primeira chave fechada, então um tipo com
      // objeto aninhado (`moldura?: { vazia?: boolean }`) era lido pela
      // metade. Medido: nenhum palco desestrutura `mostrar`, e só 3 chaves
      // viviam apenas no tipo, então a fonte inteira sai sem perda.
      for (const m of fonte.matchAll(/mostrar\??\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) lidas.add(m[1]);
    }
  };
  varrer(COMPONENTES);
  return lidas;
}

const CAMINHO_SEM = resolve(__dirname, "coreografia-ausente.baseline.json");
const CAMINHO_SEM_N1 = resolve(__dirname, "coreografia-ausente-nivel1.baseline.json");

/** Esta micro declara micro-aula? */
function temAula(micro: unknown): boolean {
  const bruto = (micro as { params?: { tutorial?: unknown } } | undefined)?.params?.tutorial;
  return Array.isArray(bruto) && bruto.length > 0;
}

/** As fichas que não declaram micro-aula nenhuma, em nível nenhum. */
function fichasSemCoreografia(): string[] {
  return JOURNEY_FICHAS
    .filter(ficha => !(ficha.micros ?? []).some(temAula))
    .map(ficha => ficha.id)
    .sort();
}

/**
 * A micro que o nível 1 realmente entrega — a mesma resolução do `Composer`.
 *
 * ⚠️ Não é `micros[0]`. O nível escolhe a micro por `niveis[n].micro`, e só
 * cai na primeira quando aquele nome não existe. Medir pelo índice daria
 * resposta certa por acaso em algumas fichas e errada nas outras.
 */
function microDoNivel(ficha: (typeof JOURNEY_FICHAS)[number], nivel: number): unknown {
  const nome = (ficha as { niveis?: Record<number, { micro?: string }> }).niveis?.[nivel]?.micro;
  const micros = (ficha.micros ?? []) as { id?: string }[];
  return (nome ? micros.find(m => m.id === nome) : null) ?? micros[0];
}

/** As fichas que abrem o NÍVEL 1 sem micro-aula. */
function fichasSemCoreografiaNoNivel1(): string[] {
  return JOURNEY_FICHAS
    .filter(ficha => (ficha.micros ?? []).length > 0 && !temAula(microDoNivel(ficha, 1)))
    .map(ficha => ficha.id)
    .sort();
}

describe("catraca da coreografia lida", () => {
  /**
   * ⚠️ A ficha que não tem aula nenhuma.
   *
   * As duas catracas irmãs medem aula QUEBRADA. Esta mede aula AUSENTE, que é
   * mais barato de achar e pior de ter: a criança abre o exercício e não
   * existe "Como faz?" — só o enunciado, que ela não lê.
   *
   * **13 das 90 fichas não declaram micro-aula em nível nenhum**, e uma delas
   * é a `GM.02`, que está entre as SETE que a criança encontra ao abrir o app
   * pela primeira vez. Seis das sete têm demonstração; essa não tem.
   *
   * Não escrevo a coreografia que falta aqui. A regra do projeto é que a
   * coreografia é "§8 transcrita" da ficha pedagógica, e a §8 da GM.02 não
   * existe na Bíblia — inventá-la seria pôr pedagogia minha na boca do app,
   * que é pior do que a dívida. O que cabe é a dívida ficar MEDIDA, com nome
   * e tamanho, e não poder crescer.
   */
  it("nenhuma ficha perde a micro-aula que tem", () => {
    const sem = fichasSemCoreografia();

    if (process.env.ATUALIZAR_COREOGRAFIA === "1") {
      writeFileSync(CAMINHO_SEM, `${JSON.stringify(sem, null, 2)}\n`);
      return;
    }

    const baseline: string[] = JSON.parse(readFileSync(CAMINHO_SEM, "utf8"));
    const novas = sem.filter(id => !baseline.includes(id));
    expect(
      novas,
      [
        "Fichas que deixaram de ter micro-aula:",
        ...novas.map(id => `  ${id}`),
        "",
        "Quem não lê só tem o 'Como faz?'. Sem ele, o exercício abre mudo.",
      ].join("\n"),
    ).toEqual([]);

    const ganharam = baseline.filter(id => !sem.includes(id));
    expect(
      ganharam.length,
      [
        `${ganharam.length} fichas ganharam aula e a baseline não desceu: ${ganharam.join(", ")}`,
        "Rode `npm run coreografia:baseline`. A catraca só desce.",
      ].join("\n"),
    ).toBe(0);
  });

  /**
   * ⚠️ A ficha que tem aula — em outro nível.
   *
   * A catraca acima mede ficha sem aula em nível NENHUM, e passou a dizer 13.
   * Medindo no navegador, achei palcos que abrem sem "Como faz?" e não estão
   * nessas 13: a `GE.02` ("Formas planas básicas") abre o nível 1 com *"Qual é
   * o círculo?"* e três botões escritos — `o círculo`, `o quadrado`, `o
   * triângulo` — e nenhuma demonstração. Ela declara aula, só não no nível em
   * que a criança entra.
   *
   * Para a catraca irmã isso é uma ficha com aula. Para a criança de seis
   * anos que não lê, é tela muda: ela nunca chega ao nível 3 onde a aula
   * existe, porque não passa do 1.
   *
   * **O nível 1 é a porta: é o nível que TODA criança encontra, em todas as
   * noventa competências.** Então ele se mede separado.
   *
   * Vale a mesma regra da irmã: a dívida fica medida, com nome e tamanho, e
   * não pode crescer. Não se escreve aqui a coreografia que falta — ela é
   * "§8 transcrita" da ficha pedagógica, e inventá-la seria pôr pedagogia
   * minha na boca do app.
   */
  it("nenhuma ficha passa a abrir o nível 1 sem micro-aula", () => {
    const sem = fichasSemCoreografiaNoNivel1();

    if (process.env.ATUALIZAR_COREOGRAFIA === "1") {
      writeFileSync(CAMINHO_SEM_N1, `${JSON.stringify(sem, null, 2)}\n`);
      return;
    }

    const baseline: string[] = JSON.parse(readFileSync(CAMINHO_SEM_N1, "utf8"));
    const novas = sem.filter(id => !baseline.includes(id));
    expect(
      novas,
      [
        "Fichas que passaram a abrir o nível 1 sem micro-aula:",
        ...novas.map(id => `  ${id}`),
        "",
        "O nível 1 é a porta de entrada: sem 'Como faz?' ali, quem não lê não entra.",
      ].join("\n"),
    ).toEqual([]);

    const ganharam = baseline.filter(id => !sem.includes(id));
    expect(
      ganharam.length,
      [
        `${ganharam.length} fichas ganharam aula no nível 1 e a baseline não desceu: ${ganharam.join(", ")}`,
        "Rode `npm run coreografia:baseline`. A catraca só desce.",
      ].join("\n"),
    ).toBe(0);
  });

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
