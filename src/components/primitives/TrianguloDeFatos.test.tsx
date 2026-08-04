// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { TrianguloDeFatos } from "./TrianguloDeFatos";

/**
 * O defeito que estes testes travam foi apontado por um adulto olhando a tela:
 * o triângulo multiplicativo é a MESMA figura do "amigos do dez", e sem marca
 * nenhuma a criança soma por hábito. O cânone reusa a forma de propósito — a
 * transferência é o objetivo — mas transferência sem sinal vira interferência.
 */

describe("o triângulo declara a própria operação", () => {
  it("a família multiplicativa mostra × entre as bases e ÷ nas pernas", () => {
    const { container } = render(
      <TrianguloDeFatos topo="?" esquerda={6} direita={2} tipo="multiplicativa" />);
    expect(container.textContent).toContain("×");
    expect(container.textContent).toContain("÷");
    expect(container.textContent, "sinal de soma numa família multiplicativa")
      .not.toContain("+");
  });

  it("a família aditiva mostra + entre as bases e − nas pernas", () => {
    const { container } = render(
      <TrianguloDeFatos topo="?" esquerda={3} direita={4} tipo="aditiva" />);
    expect(container.textContent).toContain("+");
    expect(container.textContent).toContain("−");
    expect(container.textContent, "sinal de vezes numa família aditiva")
      .not.toContain("×");
  });

  it("as duas famílias nunca se confundem: nenhum sinal aparece nas duas", () => {
    const aditiva = render(<TrianguloDeFatos topo={7} esquerda={3} direita={4} tipo="aditiva" />);
    const sinaisAditiva = new Set((aditiva.container.textContent ?? "").replace(/[\d?]/g, ""));
    aditiva.unmount();

    const mult = render(<TrianguloDeFatos topo={12} esquerda={3} direita={4} tipo="multiplicativa" />);
    const sinaisMult = new Set((mult.container.textContent ?? "").replace(/[\d?]/g, ""));
    mult.unmount();

    const comuns = [...sinaisAditiva].filter(s => sinaisMult.has(s) && s.trim());
    expect(comuns, "sinal compartilhado entre as duas famílias").toEqual([]);
  });

  it("o rótulo falado também diz a operação, para quem não lê", () => {
    const mult = render(<TrianguloDeFatos topo="?" esquerda={6} direita={2} tipo="multiplicativa" />);
    expect(mult.container.querySelector('[role="img"]')?.getAttribute("aria-label"))
      .toContain("multiplicados");
    mult.unmount();

    const soma = render(<TrianguloDeFatos topo="?" esquerda={3} direita={4} tipo="aditiva" />);
    expect(soma.container.querySelector('[role="img"]')?.getAttribute("aria-label"))
      .toContain("somados");
  });

  it("o vértice desconhecido chega como interrogação, sem valor escondido", () => {
    const { container } = render(
      <TrianguloDeFatos topo="?" esquerda={6} direita={2} tipo="multiplicativa" />);
    expect(container.textContent).toContain("?");
    expect((container.textContent ?? "").match(/\d+/g)).toEqual(["6", "2"]);
  });

  it("não apresenta violações de acessibilidade", async () => {
    const { container } = render(
      <TrianguloDeFatos topo="?" esquerda={6} direita={2} tipo="multiplicativa" />);
    const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
