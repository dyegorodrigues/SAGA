import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Composer } from "./Composer";
import { FichaCompetencia, KindType } from "./schema";

/**
 * O portão dos **kinds que o tipo promete e o motor não entrega**.
 *
 * ---
 *
 * ### O defeito que isto impede
 *
 * `KindType` é a lista de primitivas que uma ficha pode declarar. Ela é um tipo
 * do TypeScript, então escrever `primitiva: "sentencebuilder"` **compila** — e
 * só na hora de gerar a questão o Composer descobre que não sabe construir
 * aquilo, e lança. Na frente da criança.
 *
 * Nove dos trinta e nove kinds estavam nesse estado, e nada dizia. É a mesma
 * família de defeito que este bloco já encontrou quatro vezes:
 *
 * | achado | onde estava declarado | onde faltava |
 * |---|---|---|
 * | primitiva órfã (`AudioChoice`, `TouchPlace`, `ShapeCanvas`, `Grupo`) | no código | em ficha nenhuma |
 * | tag testada e nunca emitida | no teste | no palco |
 * | distrator ausente do banco | no diagnóstico | na tela |
 * | evidência exigida sem emissor (P13) | na §9 da ficha | no motor |
 * | **kind sem builder** | **no `KindType`** | **no Composer** |
 *
 * Sempre a mesma forma: **declarado num lugar, esperado noutro, e nada ligando
 * os dois.** O tipo faz o inventário parecer completo.
 *
 * ### Por que a lista abaixo não é anistia
 *
 * Ela é escrita **ao contrário**: o segundo teste FALHA quando um kind da lista
 * ganha builder e a linha não é removida. Sem isso, a lista viraria perdão
 * permanente — alguém constrói a primitiva, ninguém apaga a linha, e o portão
 * segue desligado para um kind que já está são.
 *
 * É o mesmo formato do `DIVIDA_DECLARADA` em `conformidadeDeFichas.test.ts`,
 * e pela mesma razão.
 */

/**
 * Kinds declarados no `KindType` que **não têm builder** no Composer, com o
 * motivo. Construir o builder é pagar a dívida; apagar a linha sem construir é
 * desligar o portão.
 */
const SEM_BUILDER: Record<string, string> = {
  "linking-cubes": "Palco legado (`LinkingCubes`), desenhado pelo FichaRenderer a partir de `question.groups` — nunca teve caminho pelo Composer.",
  "missing-addend-frame": "Nomeado no cânone (parcela desconhecida na moldura) e sem componente nenhum: dívida de primitiva, não só de builder.",
  "multiple_choice": "Genérico herdado. Não é primitiva: é a ausência de uma. Ficha que precise de alternativa simples usa `plain`.",
  "sentencebuilder": "`SentenceBuilder` existe em `components/primitives/` e não é alcançável por ninguém — a quinta primitiva órfã. Ver PRIMITIVAS_SAGA.md §4.",
  "sequence": "Herdado dos geradores legados (`order`); nenhuma ficha do cânone o nomeia.",
  "singaporebars": "`SingaporeBars` só é alcançado pelo kind legado `singapore-bars`, direto do gerador — o Composer nunca o montou.",
  "subvis": "Kind aritmético dos geradores legados, anterior às fichas.",
  "take-apart": "Palco legado (`TakeApart`), desenhado a partir de `question.a/b/n` — mesmo caso do `linking-cubes`.",
  "visual-addition": "Palco legado (`VisualAddition`), idem.",
};

/** Os `case` do `switch` que escolhe o builder, lidos do próprio Composer. */
function kindsComBuilder(): Set<string> {
  const fonte = readFileSync(join(__dirname, "Composer.ts"), "utf8");
  return new Set([...fonte.matchAll(/case ["']([a-z_-]+)["']/g)].map(m => m[1]));
}

/** Todo valor do `KindType`, lido do próprio schema. */
function todosOsKinds(): string[] {
  const fonte = readFileSync(join(__dirname, "schema.ts"), "utf8");
  const linha = /export type KindType = ([^;]+);/.exec(fonte);
  if (!linha) throw new Error("KindType não encontrado em schema.ts");
  return [...linha[1].matchAll(/"([a-z_-]+)"/g)].map(m => m[1]);
}

describe("todo kind do KindType ou tem builder, ou é dívida declarada", () => {
  const comBuilder = kindsComBuilder();
  const todos = todosOsKinds();

  it("o KindType não está vazio nem foi lido errado", () => {
    // Se a regex quebrar, os dois testes abaixo passariam varrendo nada.
    expect(todos.length).toBeGreaterThan(30);
    expect(todos).toContain("moldura");
    // F04 já é cadeia executável: declarar TouchPlace como isolado em qualquer
    // inventário volta a criar a dessincronia que este bloco acabou de encontrar.
    expect(comBuilder).toContain("touchplace");
  });

  it("⚠️ nenhum kind novo entra no tipo sem builder e sem registro", () => {
    // Este é o portão. Declarar a primitiva no tipo é prometer que uma ficha
    // pode pedi-la; sem builder, a promessa quebra na geração da questão.
    const orfaos = todos.filter(k => !comBuilder.has(k) && !(k in SEM_BUILDER));
    expect(orfaos, `kind(s) sem builder e fora da dívida declarada: ${orfaos.join(", ")}`)
      .toEqual([]);
  });

  it("a dívida ainda é dívida — kind que ganhou builder sai da lista", () => {
    // Escrito ao contrário de propósito: sem isto a lista vira anistia
    // permanente e o portão segue desligado para quem já está são.
    for (const [kind, motivo] of Object.entries(SEM_BUILDER)) {
      expect(
        comBuilder.has(kind),
        `"${kind}" já tem builder no Composer — apague a entrada de SEM_BUILDER.\n${motivo}`,
      ).toBe(false);
      expect(todos, `"${kind}" nem está no KindType — a entrada está morta`).toContain(kind);
    }
  });

  it("o motivo de cada dívida é uma frase, não um TODO", () => {
    // "TODO" e "" documentam que alguém passou por ali, não por que ficou.
    for (const [kind, motivo] of Object.entries(SEM_BUILDER)) {
      expect(motivo.length, kind).toBeGreaterThan(30);
    }
  });

  it("⚠️ o Composer QUEBRA alto quando o kind não tem builder", () => {
    // Alto é o comportamento certo: silencioso, a criança receberia uma tela
    // qualquer com o nome da competência certa — que é pior que tela faltando,
    // porque o Radar registraria domínio do que ela nunca fez.
    const kindMorto = Object.keys(SEM_BUILDER)[0];
    const ficha = {
      id: "TESTE.01",
      nome: "ficha só para este teste",
      strand: "N1",
      faixa: "F0",
      prereqs: [],
      bncc: "—",
      howto: "—",
      explain: "—",
      niveis: { 1: { primitiva: kindMorto as KindType, micro: "m" } },
      micros: [{
        id: "m", fonte: "—", alvo: "—",
        kinds: [kindMorto as KindType], params: {},
        dominio: { acertos: 3, de: 3, sessoes: 1 },
      }],
    } as unknown as FichaCompetencia;

    expect(() => Composer.generate(ficha, 1)).toThrow(/builder/);
  });
});
