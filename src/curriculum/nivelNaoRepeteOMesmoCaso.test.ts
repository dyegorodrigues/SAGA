import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

/**
 * CLASS-003 — um nível não pode ser um caso só, sob mastery repetida.
 *
 * As fichas exigem 3 acertos de 3 em 2 sessões (algumas 4/4 em 3). Quando o
 * contrato devolve **um único caso determinístico** para aquele nível, a
 * criança responde o mesmo item seis vezes e o motor conclui domínio. Não é
 * prática distribuída: é memorizar um item.
 *
 * A varredura gera K amostras consecutivas por (ficha, nível) a partir de
 * sementes fixas e conta digitais distintas. A digital ignora a ORDEM das
 * alternativas de propósito — embaralhar é o reparo da CLASS-006, não
 * variedade de caso — e considera enunciado, resposta, conjunto de
 * alternativas e `uiProps`.
 *
 * Gate por descoberta, não lista de inclusão (D068): ficha nova que colapse
 * num caso só reprova sem ninguém inscrevê-la. O registro abaixo segura o
 * estado medido e tem catraca nos dois sentidos — entrada nova reprova, e
 * entrada que ganhou variedade também, para que o registro encolha a cada
 * reparo em vez de apodrecer.
 *
 * Estado medido em `abe71b5`: 31 competências, 151 pares (ficha, nível). O
 * inventário documental anterior falava em 18 competências "conhecidas"; a
 * medição sobre os 75 canários encontrou 13 a mais.
 *
 * `N4.10/F69` foi o primeiro reparo e já saiu daqui: a catraca pegou a saída e
 * cobrou a atualização, que é exatamente o que ela existe para fazer.
 */
type Motivo = "LEGITIMO" | "A-REPARAR";

const REGISTRO: Record<string, { motivo: Motivo; niveis: number[]; porque: string }> = {
  // A reparar: o contrato tem um caso fixo por nível e a ficha cobra repetição.
  // Cinco destas — GE.04, GE.07, GE.09, GM.11, N2.07 — receberam portão de
  // ação na frente da CLASS-007. O portão está certo e continua insuficiente:
  // a criança o atravessa seis vezes com o mesmo item.
  "AL.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 5], porque: "igualdade/equilíbrio com balança fixa por nível; L4 já varia" },
  "AL.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "expressão F77 fixa por nível" },
  "AL.07": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "linguagem/letras com enunciado fixo por nível" },
  "GE.03": { motivo: "A-REPARAR", niveis: [1, 2, 3, 5], porque: "detetive de formas com peça fixa por nível; L4 já varia" },
  "GE.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "mapa do tesouro com coordenada fixa por nível" },
  "GE.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "ângulos com medida fixa por nível" },
  "GE.08": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "plano cartesiano com par ordenado fixo por nível" },
  "GE.10": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "vistas do mesmo sólido por nível" },
  "GM.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "horas/minutos com relógio fixo por nível" },
  "GM.09": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "problema de medida com enunciado fixo por nível" },
  "N1.02": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4], porque: "quantidade fixa por nível; L5 já varia" },
  "N2.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "pares/ímpares com quantidade fixa por nível" },
  "N4.11": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "primos/divisores com número fixo por nível" },
  "N4.12": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "divisão por dois dígitos com conta fixa por nível" },
  "N5.03": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4], porque: "fração equivalente com par fixo por nível; L5 já varia" },
  "N5.04": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "soma de frações com par fixo por nível" },
  "N5.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "multiplicação de frações com par fixo por nível" },
  "PE.02": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "jornal da turma com conjunto de dados fixo por nível" },
  "PE.03": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "média/chance com conjunto fixo por nível" },
  "PE.04": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "estatística/chance com conjunto fixo por nível" },
};

const SEMENTES = [0x2f6e2b1, 0x5bd1e99];
const AMOSTRAS = 8;

const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

/** Enunciado, resposta, conjunto de alternativas e spec. A ordem das opções não entra. */
function digital(question: ReturnType<typeof generateRegisteredFichaQuestion>): string {
  const opcoes = (question.options ?? []).map(option => String(option.value)).sort();
  const spec = question.uiProps
    ? JSON.stringify(question.uiProps, Object.keys(question.uiProps as object).sort())
    : "";
  return [question.prompt, String(question.answer), opcoes.join(","), spec].join("|");
}

/** Domínio que a ficha cobra: mais de um acerto, ou mais de uma sessão. */
function cobraRepeticao(question: ReturnType<typeof generateRegisteredFichaQuestion>): boolean {
  const regra = question.masteryRule;
  if (!regra) return false;
  return (regra.de ?? 1) > 1 || (regra.sessoes ?? 1) > 1;
}

function varrer(): Map<string, number[]> {
  const colapsadas = new Map<string, number[]>();
  const ids = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
  for (const id of ids) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      // Uma digital por semente: cada semente percorre AMOSTRAS gerações
      // consecutivas, então um contrato com variedade muda dentro da própria
      // semente. Repetir a semente do zero mostraria tudo determinístico.
      const vistas = new Set<string>();
      let cobra = false;
      for (const semente of SEMENTES) {
        semear(semente);
        for (let i = 0; i < AMOSTRAS; i += 1) {
          const question = generateRegisteredFichaQuestion(id, nivel);
          vistas.add(digital(question));
          cobra = cobra || cobraRepeticao(question);
        }
      }
      if (vistas.size === 1 && cobra) {
        colapsadas.set(id, [...(colapsadas.get(id) ?? []), nivel]);
      }
    }
  }
  return colapsadas;
}

describe("CLASS-003 — nenhum nível repete o mesmo caso sob mastery repetida", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    const servidas = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
    expect(servidas.length).toBeGreaterThanOrEqual(75);
  });

  it("nenhuma ficha colapsa fora do registro, e nenhuma entrada do registro está obsoleta", { timeout: 180000 }, () => {
    const colapsadas = varrer();

    const novas = [...colapsadas.keys()].filter(id => !REGISTRO[id]).sort();
    const obsoletas = Object.keys(REGISTRO).filter(id => !colapsadas.has(id)).sort();
    const niveisMudaram = [...colapsadas.entries()]
      .filter(([id]) => REGISTRO[id])
      .filter(([id, niveis]) => niveis.join(",") !== REGISTRO[id].niveis.join(","))
      .map(([id, niveis]) => `${id}: registro [${REGISTRO[id].niveis}], medido [${niveis}]`)
      .sort();

    expect(novas, `fichas novas repetindo o mesmo caso: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas que ganharam variedade — remova-as do registro: ${obsoletas.join(", ")}`).toEqual([]);
    expect(niveisMudaram, `níveis divergem do registro:\n${niveisMudaram.join("\n")}`).toEqual([]);
  });

  it("cada entrada declara por que está ali, e a fila de reparo é explícita", () => {
    for (const [id, item] of Object.entries(REGISTRO)) {
      expect(item.porque.length, `${id} sem justificativa`).toBeGreaterThan(20);
      expect(item.niveis.length, `${id} sem níveis`).toBeGreaterThan(0);
    }
    // A fila é grande e conhecida. Ela só pode encolher com recibo: qualquer
    // reparo derruba a entrada e o teste acima cobra a atualização.
    const aReparar = Object.entries(REGISTRO).filter(([, item]) => item.motivo === "A-REPARAR");
    const pares = aReparar.reduce((total, [, item]) => total + item.niveis.length, 0);
    expect(aReparar.length, "competências na fila de reparo da CLASS-003").toBe(20);
    expect(pares, "pares (ficha, nível) na fila de reparo da CLASS-003").toBe(96);
  });
});
