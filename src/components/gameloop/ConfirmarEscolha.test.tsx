// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ConfirmarEscolha } from "./ConfirmarEscolha";

/**
 * O botão que pulsava e por isso não podia ser tocado.
 *
 * O pai pediu o confirmar "piscando, piscando para a criança entender", e eu
 * fiz o botão INTEIRO pulsar com `scale`. Um alvo que nunca para de se mexer
 * não assenta: o navegador mediu o clique fora do lugar, o toque não virou
 * `click`, e a criança ficava com "É esta: 2" na tela para sempre. Ele
 * descreveu: *"nem confirma (...) fica com a resposta 2 marcada (...) não vai
 * para o próximo exercício, bugou."*
 *
 * Medido no navegador: clicar no botão dava `TimeoutError: element is not
 * stable` em 4s; com `force: true` a questão avançava na hora.
 *
 * O pulso continua — ele é necessário —, mas mora num halo atrás do botão,
 * que não recebe dedo. O alvo fica parado.
 */
describe("ConfirmarEscolha — o alvo não pode se mexer", () => {
  const montar = () => render(
    <ConfirmarEscolha rotulo="2" onOuvirDeNovo={() => {}} onConfirmar={() => {}} onCancelar={() => {}} />,
  );

  it("⚠️ o botão de confirmar NÃO anima geometria — quem pulsa é o halo", () => {
    const { container } = montar();
    const botao = container.querySelector('[aria-label="Confirmar: 2"]') as HTMLElement;
    expect(botao, "o botão existe").toBeTruthy();

    // O framer-motion escreve a animação no `style` do elemento. Transform ou
    // scale no ALVO é o defeito; no halo, é o efeito.
    const estilo = botao.getAttribute("style") ?? "";
    expect(estilo, "sem transform no alvo do dedo").not.toMatch(/transform|scale/);
  });

  it("o halo que pulsa não recebe dedo", () => {
    const { container } = montar();
    const halo = container.querySelector("[data-halo-confirmar]") as HTMLElement;
    expect(halo, "o halo existe").toBeTruthy();
    expect(halo.getAttribute("aria-hidden")).toBe("true");
    expect(halo.className, "e não intercepta o toque").toMatch(/pointer-events-none/);
  });

  it("o clique responde", () => {
    const confirmar = vi.fn();
    const { container } = render(
      <ConfirmarEscolha rotulo="2" onOuvirDeNovo={() => {}} onConfirmar={confirmar} onCancelar={() => {}} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Confirmar: 2"]') as HTMLElement);
    expect(confirmar).toHaveBeenCalledTimes(1);
  });
});

/**
 * Errar tem de aparecer.
 *
 * O pai não chegou a nomear este, mas a sonda que joga encontrou: no
 * "Sistema monetário" e no "Horas", responder ERRADO deixava a tela
 * **byte a byte idêntica**. A criança tocava, confirmava, e não acontecia
 * nada — nem cor, nem dica, nem sinal de que o app tinha ouvido.
 *
 * Medido: com a resposta certa a tela vira "Perfeito! Você brilha como uma
 * estrela" e aparece Avançar; com a errada, nada.
 *
 * Silêncio depois de agir é a pior resposta possível para quem não lê: ela
 * não sabe se errou, se o botão quebrou, ou se ela não apertou direito.
 */
describe("AlternativasQueFalam — errar tem de aparecer", () => {
  it("⚠️ depois de confirmar, a alternativa escolhida fica MARCADA", async () => {
    const { AlternativasQueFalam } = await import("./AlternativasQueFalam");
    const { container } = render(
      <AlternativasQueFalam
        alternativas={[{ valor: 1, rotulo: "um" }, { valor: 2, rotulo: "dois" }]}
        onEscolher={() => {}}
        correta={2}
      />,
    );
    fireEvent.click(container.querySelector('[aria-label="um"]') as HTMLElement);
    fireEvent.click(container.querySelector('[aria-label="Confirmar: um"]') as HTMLElement);

    const escolhida = container.querySelector('[aria-label="um"][data-escolhida]');
    expect(escolhida, "a que ela escolheu leva marca").toBeTruthy();
  });

  it("e errar NÃO tranca a tela: ela pode escolher outra", async () => {
    const { AlternativasQueFalam } = await import("./AlternativasQueFalam");
    const escolhas: unknown[] = [];
    const { container } = render(
      <AlternativasQueFalam
        alternativas={[{ valor: 1, rotulo: "um" }, { valor: 2, rotulo: "dois" }]}
        onEscolher={v => escolhas.push(v)}
        correta={2}
      />,
    );
    fireEvent.click(container.querySelector('[aria-label="um"]') as HTMLElement);
    fireEvent.click(container.querySelector('[aria-label="Confirmar: um"]') as HTMLElement);
    fireEvent.click(container.querySelector('[aria-label="dois"]') as HTMLElement);
    fireEvent.click(container.querySelector('[aria-label="Confirmar: dois"]') as HTMLElement);
    expect(escolhas, "as duas tentativas chegaram").toEqual([1, 2]);
  });
});
