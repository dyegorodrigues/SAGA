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
