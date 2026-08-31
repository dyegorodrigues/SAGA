// @vitest-environment jsdom
import React from "react";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ALL_MATH_TRACKS } from "../../curriculum/motores/curriculum";
import { ICONE_DA_ILHA, Icone, NomeDoIcone, PASTA_DOS_ICONES } from "./Icone";

/**
 * Toda ilha do mapa tem arte — e a arte existe no disco.
 *
 * ## O risco que este portão cobre
 *
 * Os ícones deixaram de ser desenho embutido no código e passaram a ser arquivo
 * servido (`public/icones/*.svg`). Isso troca um tipo de defeito por outro: não
 * dá mais para "esquecer de desenhar", mas dá para o arquivo não subir no
 * deploy, ou o nome divergir de uma letra. O sintoma é o pior possível — a
 * criança abre o mapa e vê o ícone de imagem quebrada, e nenhum teste de
 * unidade percebe, porque em JSDOM `<img>` nunca carrega nada.
 *
 * Então aqui se mede o DISCO, não o DOM.
 *
 * ## Por que por varredura, e não por lista
 *
 * A tentação era escrever as onze ilhas que existem hoje. Seria um teste que
 * passa para sempre: quando alguém abrir a décima segunda ilha, a lista
 * continua com onze e o teste continua verde — enquanto a criança encontra um
 * buraco no mapa. A origem da verdade é o currículo REAL (`ALL_MATH_TRACKS`); a
 * lista é o que se COBRA, nunca o que se consulta.
 */

const PUBLICO = resolve(__dirname, "..", "..", "..", "public", PASTA_DOS_ICONES);

/** As ilhas como o currículo realmente as serve — não uma cópia escrita à mão. */
function ilhasServidas(): string[] {
  return [...new Set(ALL_MATH_TRACKS.map(t => t.island).filter(Boolean) as string[])];
}

/** Todo nome que o componente aceita, lido do próprio tipo publicado. */
const TODOS_OS_NOMES: NomeDoIcone[] = [
  "tutor", "jornada", "dojo", "oficina",
  "travada", "coroa", "fronteira", "estrela", "moeda",
  "contagem", "posicional", "adicao", "multiplicacao", "fracao",
  "porcento", "reta", "balanca", "formas", "regua", "barras",
];

describe("a arte dos ícones", () => {
  it("a varredura enxerga as ilhas do currículo", () => {
    // Prova de vida: uma varredura que não achou ilha nenhuma passa calada.
    expect(ilhasServidas().length, "o mapa precisa ter as onze ilhas").toBeGreaterThanOrEqual(11);
  });

  it("toda ilha servida aponta para um ícone", () => {
    const sem = ilhasServidas().filter(i => !ICONE_DA_ILHA[i]);
    expect(sem, `ilhas sem ícone — o nó fica vazio no mapa:\n${sem.join(", ")}`).toEqual([]);
  });

  it("todo nome de ícone tem arquivo em public/icones", () => {
    const faltando = TODOS_OS_NOMES.filter(n => !existsSync(resolve(PUBLICO, `${n}.svg`)));
    expect(faltando, `arte que o código pede e o disco não tem:\n${faltando.join("\n")}`).toEqual([]);
  });

  it("o arquivo é um SVG de verdade, não um lugar reservado vazio", () => {
    // Um arquivo de zero byte passa em `existsSync` e quebra na tela igual.
    const suspeitos = TODOS_OS_NOMES
      .map(n => ({ n, conteudo: readFileSync(resolve(PUBLICO, `${n}.svg`), "utf8") }))
      .filter(({ conteudo }) => !conteudo.includes("<svg") || conteudo.length < 200)
      .map(({ n, conteudo }) => `${n}.svg (${conteudo.length} bytes)`);
    expect(suspeitos, `arquivos que não são arte:\n${suspeitos.join("\n")}`).toEqual([]);
  });

  it("nenhuma ilha usa a arte de outra", () => {
    const porArte = new Map<NomeDoIcone, string[]>();
    for (const ilha of ilhasServidas()) {
      const nome = ICONE_DA_ILHA[ilha];
      porArte.set(nome, [...(porArte.get(nome) || []), ilha]);
    }
    const repetidos = [...porArte.entries()]
      .filter(([, ilhas]) => ilhas.length > 1)
      .map(([nome, ilhas]) => `${nome}: ${ilhas.join(" e ")}`);
    expect(repetidos, `ilhas dividindo a mesma arte:\n${repetidos.join("\n")}`).toEqual([]);
  });

  it("o caminho que o componente pede é o arquivo que existe", () => {
    // Amarra o DOM ao disco: se `caminhoDoIcone` mudar de forma e a pasta não,
    // os dois testes acima continuariam verdes e a tela quebraria mesmo assim.
    const { container } = render(<Icone nome="tutor" />);
    const src = container.querySelector("img")?.getAttribute("src") || "";
    const arquivo = src.split("/").slice(-2).join("/");
    expect(arquivo).toBe(`${PASTA_DOS_ICONES}/tutor.svg`);
    expect(existsSync(resolve(PUBLICO, "..", arquivo))).toBe(true);
  });

  it("o ícone não fala com o leitor de tela — quem nomeia é o texto ao lado", () => {
    // Regra igual à das cores: a arte é reforço. Se a imagem se anunciasse, o
    // leitor leria o estado duas vezes ("cadeado, Travada").
    const { container } = render(<Icone nome="travada" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
    expect(img?.getAttribute("alt")).toBe("");
  });
});
