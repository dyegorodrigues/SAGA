import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_MATH_TRACKS } from "./curriculum";
import { JOURNEY_FICHAS } from "../fichas";
import { NIVEIS_POR_COMPETENCIA } from "../schema";

/**
 * A escada que a criança VÊ é a escada que a competência TEM.
 *
 * ## O defeito que este gate existe para impedir
 *
 * O seletor de nível derivava quantos degraus mostrar do comprimento de
 * `lvlSkills` — um array de **rótulos** decorativos, um por ilha:
 *
 * ```ts
 * const levels = pickerTrack.lvlSkills ? pickerTrack.lvlSkills.map((_, i) => i + 1) : [1, 2, 3, 4, 5];
 * ```
 *
 * As onze ilhas tinham quatro rótulos. A competência tem cinco níveis. Resultado
 * medido: **o seletor oferecia 4 de 5 degraus em TODAS as noventa
 * competências**, e o degrau que sumia era o quinto — justamente aquele onde a
 * coroa é decidida e onde mora o `rt_alvo` (86 fichas o declaram no nível 5, e
 * nenhuma em outro). Uma criança que chegasse ao nível 5 não conseguia
 * reabri-lo pelo mapa.
 *
 * É a mesma doença da CLASS-001: um dado decorativo governando alcance
 * curricular sem ninguém perceber, porque ninguém comparava os dois lados.
 *
 * ## O que se cobra aqui
 *
 * Que os dois lados batam, por descoberta: a ficha diz quantos níveis existem,
 * a trilha diz quantos rótulos a tela tem, e este teste recusa a diferença.
 * Ilha nova com rótulo a menos reprova sozinha.
 */
describe("a escada do seletor bate com a do currículo", () => {
  it("toda ficha declara os cinco níveis que a constante afirma", () => {
    expect(JOURNEY_FICHAS.length, "a varredura precisa ver a Jornada inteira").toBeGreaterThanOrEqual(90);

    const fora: string[] = [];
    for (const ficha of JOURNEY_FICHAS) {
      const declarados = Object.keys(ficha.niveis ?? {}).map(Number).sort((a, b) => a - b);
      const esperados = Array.from({ length: NIVEIS_POR_COMPETENCIA }, (_, i) => i + 1);
      if (JSON.stringify(declarados) !== JSON.stringify(esperados)) {
        fora.push(`${ficha.id}: níveis ${declarados.join(",") || "(nenhum)"}`);
      }
    }
    expect(fora, `fichas cuja escada não tem ${NIVEIS_POR_COMPETENCIA} degraus:\n${fora.join("\n")}`).toEqual([]);
  });

  it("toda trilha tem um rótulo para cada degrau — nenhum degrau fica invisível", () => {
    const trilhas = ALL_MATH_TRACKS.filter(t => t.graphId);
    expect(trilhas.length, "a varredura precisa ver as trilhas do grafo").toBeGreaterThanOrEqual(90);

    const curtas: string[] = [];
    for (const trilha of trilhas) {
      const rotulos = trilha.lvlSkills?.length ?? 0;
      if (rotulos !== NIVEIS_POR_COMPETENCIA) {
        curtas.push(`${trilha.id} (ilha ${trilha.island}): ${rotulos} rótulo(s) para ${NIVEIS_POR_COMPETENCIA} níveis`);
      }
    }
    // Uma linha por ilha basta para ler o erro; a lista inteira seria noventa
    // repetições do mesmo defeito.
    const porIlha = [...new Set(curtas.map(linha => linha.replace(/^[^ ]+ /, "")))];
    expect(porIlha, `ilhas com rótulos a menos — degraus somem do seletor:\n${porIlha.join("\n")}`).toEqual([]);
  });

  it("o seletor conta os degraus pelo currículo, não pelos rótulos", () => {
    // Com cinco rótulos no lugar, derivar dos rótulos ou da constante dá o mesmo
    // número — os dois testes acima garantem isso. Mas a dependência em si é o
    // defeito: enquanto a tela contar degraus por um array decorativo, basta
    // alguém mexer nos rótulos para o alcance curricular mudar junto, sem que
    // ninguém tenha decidido isso. Aqui se cobra a origem, não o resultado.
    const fonte = readFileSync(resolve(__dirname, "../../components/home/LevelPickerModal.tsx"), "utf8");
    const linhaDosNiveis = fonte.split("\n").find(l => /const levels =/.test(l)) ?? "";

    expect(linhaDosNiveis, "o seletor precisa declarar de onde vem a escada").toBeTruthy();
    expect(linhaDosNiveis, "a escada vem da constante do currículo").toContain("NIVEIS_POR_COMPETENCIA");
    expect(linhaDosNiveis, "a escada NÃO pode ser derivada do array de rótulos").not.toContain("lvlSkills");
  });

  it("o último degrau é o de fluência, que é onde o rt_alvo mora", () => {
    // O `rt_alvo` é o alvo de tempo, e a Bíblia (§11.9) o trata como fluência.
    // Ele está declarado no nível 5 e em nenhum outro; o rótulo de fluência
    // precisa acompanhá-lo, ou a tela nomeia de Dojo um degrau que não é.
    const comAlvo = new Map<number, number>();
    for (const ficha of JOURNEY_FICHAS) {
      for (const [nivel, def] of Object.entries(ficha.niveis ?? {})) {
        if (typeof (def as { rt_alvo?: number }).rt_alvo === "number") {
          comAlvo.set(Number(nivel), (comAlvo.get(Number(nivel)) ?? 0) + 1);
        }
      }
    }
    const niveis = [...comAlvo.keys()];
    expect(niveis.length, "nenhuma ficha declara rt_alvo — a descoberta parou de observar").toBeGreaterThan(0);
    expect(niveis, `rt_alvo espalhado por vários níveis: ${niveis.join(", ")}`).toEqual([NIVEIS_POR_COMPETENCIA]);

    const rotulosFinais = new Set(
      ALL_MATH_TRACKS.filter(t => t.graphId && t.lvlSkills?.length).map(t => t.lvlSkills![t.lvlSkills!.length - 1]),
    );
    expect(rotulosFinais, "o rótulo do último degrau precisa ser o de fluência em todas as ilhas").toEqual(new Set(["Dojo"]));
  });
});
