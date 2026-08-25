// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ConversaoUnidadesStage } from "./ConversaoUnidadesStage";
import { ProblemasMedidaStage } from "./ProblemasMedidaStage";
import { construirConversaoUnidadesSpec } from "../../curriculum/procedimentos/conversaoUnidadesContract";
import { construirProblemasMedidaSpec } from "../../curriculum/procedimentos/problemasMedidaContract";

const texto = (raiz: HTMLElement) => {
  const copia = raiz.cloneNode(true) as HTMLElement;
  for (const botao of [...copia.querySelectorAll("button")]) botao.remove();
  return (copia.textContent ?? "").replace(/\s+/g, " ");
};

describe("CLASS-009 — GM.10/F93: o lado convertido é a incógnita, não um enunciado", () => {
  it("nenhum nível escreve o valor de destino antes da resposta", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirConversaoUnidadesSpec(nivel);
      const { container, unmount } = render(<ConversaoUnidadesStage spec={spec} onAnswer={() => undefined} />);
      const suporte = texto(container);
      const escrito = `${spec.equivalencia.destino} ${spec.equivalencia.unidadeDestino}`;
      expect(suporte.includes(escrito), `L${nivel} escreveu "${escrito}" na tela`).toBe(false);
      // A pergunta continua legível: o lado de origem e a incógnita ficam.
      expect(suporte).toContain(`${spec.equivalencia.origem} ${spec.equivalencia.unidadeOrigem}`);
      expect(suporte).toContain("?");
      unmount();
    }
  });
});

describe("CLASS-009 — GM.09/F82: a conversão só aparece escrita quando não é a resposta", () => {
  it("esconde o valor convertido exatamente nos níveis em que ele é a resposta", () => {
    let escondidos = 0;
    let mostrados = 0;
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirProblemasMedidaSpec(nivel);
      const { container, unmount } = render(<ProblemasMedidaStage spec={spec} onAnswer={() => undefined} />);
      const suporte = texto(container);
      const escrito = `${spec.conversao.valorConvertido} ${spec.conversao.para}`;
      if (spec.resposta === spec.conversao.valorConvertido) {
        expect(suporte.includes(escrito), `L${nivel} escreveu a própria resposta "${escrito}"`).toBe(false);
        expect(suporte).toContain(`? ${spec.conversao.para}`);
        escondidos += 1;
      } else {
        // Conversão que é só degrau do problema continua visível: é andaime, não gabarito.
        expect(suporte.includes(escrito), `L${nivel} perdeu o andaime de conversão`).toBe(true);
        mostrados += 1;
      }
      unmount();
    }
    expect(escondidos).toBe(3);
    expect(mostrados).toBe(2);
  });
});
