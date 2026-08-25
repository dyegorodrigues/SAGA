// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { FichaRenderer } from "../components/FichaRenderer";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

/**
 * CLASS-009 — a tela não pode declarar a própria resposta.
 *
 * A varredura renderiza cada ficha servida pelo Composer, apaga os botões e
 * pergunta se o rótulo da alternativa correta ainda está escrito no suporte.
 * Se estiver, a criança lê em vez de resolver.
 *
 * O gate é fechado por descoberta, não por lista de inclusão (D068): qualquer
 * ficha nova que vaze reprova sem ninguém precisar lembrar de inscrevê-la. O
 * registro abaixo existe só para segurar o estado medido, e tem catraca nos
 * dois sentidos — entrada nova reprova, entrada que parou de vazar também.
 */
type Motivo = "LEGITIMO" | "A-REPARAR";
const REGISTRO: Record<string, { motivo: Motivo; porque: string }> = {
  // Legítimos: o rótulo é o nome de um objeto que a tela precisa nomear para
  // que a pergunta faça sentido — régua, eixo, categoria, peça.
  "AL.02": { motivo: "LEGITIMO", porque: "a fileira do padrão é o próprio objeto observado; escondê-la apaga a pergunta" },
  "AL.03": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta numérica" },
  "GM.02": { motivo: "LEGITIMO", porque: "os ícones da cena são o objeto da comparação" },
  "GE.04": { motivo: "LEGITIMO", porque: "o enunciado nomeia a propriedade testada (rola/empilha); a alternativa a ecoa" },
  "GE.05": { motivo: "LEGITIMO", porque: "o enunciado dita a casa do mapa; a habilidade é executar a coordenada" },
  "GE.08": { motivo: "LEGITIMO", porque: "o enunciado dita o par ordenado; a habilidade é localizá-lo no plano" },
  "GE.10": { motivo: "LEGITIMO", porque: "as vistas precisam de rótulo A/B/C para poderem ser escolhidas" },
  "N2.06": { motivo: "LEGITIMO", porque: "\"paridade\" no apoio contém \"par\" por acaso de substring" },
  "N7.01": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta dos inteiros" },
  "N7.02": { motivo: "LEGITIMO", porque: "rótulos de marcação da reta dos inteiros" },
  "PE.02": { motivo: "LEGITIMO", porque: "as barras do gráfico precisam de rótulo de categoria" },
  "PE.04": { motivo: "LEGITIMO", porque: "os sacos precisam de rótulo A/B para poderem ser escolhidos" },
  "N4.03": { motivo: "LEGITIMO", porque: "a contagem saltada é a estratégia ensinada em L1, não um gabarito impresso" },
  "N4.09": { motivo: "LEGITIMO", porque: "produtos parciais da decomposição; coincidem com a resposta só quando a parcela é o total" },

  // A reparar: o suporte afirma a resposta que o enunciado pergunta.
  "N4.10": { motivo: "A-REPARAR", porque: "exibe o quociente pronto e a prova real da divisão pedida" },
  "N6.01": { motivo: "A-REPARAR", porque: "escreve \"4/10 = 0,4\" enquanto pergunta quanto está pintado" },
  "N5.01": { motivo: "A-REPARAR", porque: "escreve o nome da parte que o enunciado pede" },
  "N5.02": { motivo: "A-REPARAR", porque: "escreve a fração que o enunciado pede" },
  "PE.03": { motivo: "A-REPARAR", porque: "escreve a fração de chance que o enunciado pede" },
};

const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4];
const norm = (t: string) => t.replace(/\s+/g, "").replace(/×/g, "x").toLowerCase();
const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

function varrer(): Set<string> {
  const vazam = new Set<string>();
  const ids = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
  for (const semente of SEMENTES) {
    semear(semente);
    for (const id of ids) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const question = generateRegisteredFichaQuestion(id, nivel);
        const certa = (question.options ?? []).find(option => question.evaluate?.(option.value));
        const rotulo = norm(String(certa?.label ?? certa?.value ?? ""));
        if (!certa || rotulo.length < 2) continue;
        const { container, unmount } = render(<FichaRenderer question={question} onAnswer={() => undefined} />);
        const copia = container.cloneNode(true) as HTMLElement;
        for (const botao of [...copia.querySelectorAll("button")]) botao.remove();
        if (norm(copia.textContent ?? "").includes(rotulo)) vazam.add(id);
        unmount();
      }
    }
  }
  return vazam;
}

describe("CLASS-009 — nenhuma tela declara a resposta que ela mesma pergunta", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    const servidas = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
    expect(servidas.length).toBeGreaterThanOrEqual(75);
  });

  it("nenhuma ficha vaza fora do registro medido, e nenhuma entrada do registro está obsoleta", { timeout: 180000 }, () => {
    const vazam = varrer();
    const novas = [...vazam].filter(id => !REGISTRO[id]).sort();
    const obsoletas = Object.keys(REGISTRO).filter(id => !vazam.has(id)).sort();

    expect(novas, `fichas novas declarando a própria resposta: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas do registro que pararam de vazar — remova-as: ${obsoletas.join(", ")}`).toEqual([]);
  });

  it("a fila de reparo do Gate B′ é explícita e não some sem recibo", () => {
    const aReparar = Object.entries(REGISTRO).filter(([, item]) => item.motivo === "A-REPARAR").map(([id]) => id).sort();
    expect(aReparar).toEqual(["N4.10", "N5.01", "N5.02", "N6.01", "PE.03"]);
    for (const [, item] of Object.entries(REGISTRO)) expect(item.porque.length).toBeGreaterThan(20);
  });
});
