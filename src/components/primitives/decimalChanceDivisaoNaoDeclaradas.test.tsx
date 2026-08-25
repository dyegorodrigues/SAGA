// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DecimalStage } from "./DecimalStage";
import { MediaChanceStage } from "./MediaChanceStage";
import { DivisaoLongaStage } from "./DivisaoLongaStage";
import { construirDecimalSpec } from "../../curriculum/procedimentos/decimalContract";
import { construirMediaChanceSpec } from "../../curriculum/procedimentos/mediaChanceContract";
import { construirDivisaoLongaSpec } from "../../curriculum/procedimentos/divisaoLongaContract";

const suporte = (raiz: HTMLElement) => {
  const copia = raiz.cloneNode(true) as HTMLElement;
  for (const botao of [...copia.querySelectorAll("button")]) botao.remove();
  const rotulos = [...copia.querySelectorAll("[aria-label]")].map(el => el.getAttribute("aria-label") ?? "");
  return [copia.textContent ?? "", ...rotulos].join(" ").replace(/\s+/g, " ");
};

describe("CLASS-009 — N6.01/F75: a ponte fração→decimal não pode trazer o decimal pronto", () => {
  it("nenhum nível escreve o decimal que o enunciado pergunta", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirDecimalSpec(nivel);
      if (!spec.fracao) continue;
      const { container, unmount } = render(<DecimalStage spec={spec} onAnswer={() => undefined} />);
      const rotuloCerto = spec.opcoes.find(opcao => opcao.value === spec.resposta)?.label ?? spec.resposta;
      expect(suporte(container).includes(rotuloCerto), `L${nivel} escreveu "${rotuloCerto}"`).toBe(false);
      // A fração continua na tela: ela é o dado, não a resposta.
      expect(suporte(container)).toContain(spec.fracao);
      unmount();
    }
  });
});

describe("CLASS-009 — PE.03/F83: a chance pedida não pode estar escrita", () => {
  it("chance-fracao não imprime favoráveis/total", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirMediaChanceSpec(nivel);
      if (spec.modo !== "chance-fracao" || !spec.chance) continue;
      const { container, unmount } = render(<MediaChanceStage spec={spec} onAnswer={() => undefined} />);
      const fracao = `${spec.chance.favoraveis}/${spec.chance.total}`;
      expect(suporte(container).includes(fracao), `L${nivel} escreveu a chance "${fracao}"`).toBe(false);
      unmount();
    }
  });
});

describe("CLASS-009 — N4.10/F69: a conta armada não pode vir resolvida", () => {
  it("a superfície de divisão não mostra quociente, produto nem prova real", () => {
    for (let nivel = 3; nivel <= 5; nivel += 1) {
      const spec = construirDivisaoLongaSpec(nivel);
      const { container, unmount } = render(<DivisaoLongaStage spec={spec} disabled={false} onAnswer={() => undefined} />);
      const texto = suporte(container);
      expect(texto.includes(`Quociente ${spec.quociente}`), `L${nivel} rotulou o quociente`).toBe(false);
      expect(texto.includes(`${spec.quociente} × ${spec.divisor} + ${spec.resto} = ${spec.dividendo}`), `L${nivel} imprimiu a prova real`).toBe(false);
      // A conta continua armada: dividendo e divisor são o enunciado visual.
      expect(texto).toContain(String(spec.dividendo));
      unmount();
    }
  });
});
