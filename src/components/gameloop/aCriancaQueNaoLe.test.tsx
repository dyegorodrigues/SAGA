// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { OuvirDeNovo } from "./OuvirDeNovo";
import { SoundBtn } from "../Mascot";

/**
 * A criança que ainda não lê.
 *
 * ## O que este arquivo trava
 *
 * A Jornada começa no 1º ano, e uma criança de seis anos **não lê o
 * enunciado**. Tudo o que a interface oferece em texto, ela só alcança pelo
 * som. Duas falhas reais, achadas auditando o app de verdade:
 *
 * 1. **Não havia botão de ouvir de novo.** O enunciado era falado uma vez, na
 *    abertura. Quem se distraísse perdia. Existia um caminho — tocar no balão
 *    de fala —, mas o balão é uma `div` com `onClick`: sem `role`, sem nome,
 *    sem borda, sem sombra. Nada nele diz "toque aqui". A criança erra por não
 *    ter ouvido, e o app anota o erro como se fosse de matemática.
 *
 * 2. **O liga/desliga do som perdeu o nome.** Quando o `🔊` virou arte
 *    desenhada, o `<Icone>` entrou `aria-hidden` e o botão — que só tinha o
 *    emoji por conteúdo — ficou mudo para leitor de tela. A auditoria o achou
 *    em toda questão de toda competência: um quadrado de 44×44 sem nome.
 *
 * ## A régua
 *
 * Todo controle de SOM tem nome e mede pelo menos 44px. 44 é o piso do WCAG
 * 2.5.5 para alvo de toque — e o dedo de uma criança é maior que o de um
 * adulto, não menor.
 */

const ALVO_MINIMO = 44;
const lado = (el: HTMLElement) => {
  // JSDOM não faz layout: a medida honesta vem da classe utilitária declarada.
  const m = (el.className.match(/w-(\d+)/) || [])[1];
  return m ? Number(m) * 4 : 0;
};

describe("a criança que ainda não lê alcança o enunciado", () => {
  it("existe um botão de ouvir de novo, com nome", () => {
    const onOuvir = vi.fn();
    const { getByRole } = render(<OuvirDeNovo onOuvir={onOuvir} />);
    const botao = getByRole("button", { name: "Ouvir de novo" });
    expect(botao).toBeTruthy();
    fireEvent.click(botao);
    expect(onOuvir, "tocar no botão precisa repetir a narração").toHaveBeenCalledTimes(1);
  });

  it("o botão de ouvir cabe no dedo de uma criança", () => {
    const { getByRole } = render(<OuvirDeNovo onOuvir={() => {}} />);
    expect(lado(getByRole("button", { name: "Ouvir de novo" }) as HTMLElement))
      .toBeGreaterThanOrEqual(ALVO_MINIMO);
  });

  it("o liga/desliga do som diz o que faz, nos dois estados", () => {
    // Sem isto o botão volta a ser um quadrado mudo: o ícone é `aria-hidden`
    // e não empresta nome nenhum a quem o contém.
    const ligado = render(<SoundBtn on onToggle={() => {}} />);
    expect(ligado.getByRole("button", { name: "Desligar o som" })).toBeTruthy();
    ligado.unmount();

    const desligado = render(<SoundBtn on={false} onToggle={() => {}} />);
    expect(desligado.getByRole("button", { name: "Ligar o som" })).toBeTruthy();
  });

  it("o liga/desliga do som também cabe no dedo", () => {
    const { getByRole } = render(<SoundBtn on onToggle={() => {}} />);
    expect(lado(getByRole("button", { name: "Desligar o som" }) as HTMLElement))
      .toBeGreaterThanOrEqual(ALVO_MINIMO);
  });
});
