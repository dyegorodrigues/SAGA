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
 * CORREÇÃO DE MEDIÇÃO. A primeira varredura acusou 31 competências e 151 pares,
 * e estava inflada por um defeito da própria digital: ela usava
 * `JSON.stringify(uiProps, Object.keys(uiProps).sort())` supondo que o segundo
 * argumento ordenasse as chaves. Ele FILTRA — e filtra em qualquer
 * profundidade —, então o conteúdo de objetos aninhados sumia. Ficha que varia
 * só por dentro, como `N5.03` em `esquerda`/`direita`, era contada como caso
 * único.
 *
 * Com serialização profunda, o inventário real é de 3 competências e 13 pares.
 * Os treze reparos já feitos continuam válidos: todos tinham o caso preso em
 * campo de primeiro nível, e a digital antiga os acusava pelo motivo certo.
 *
 * O que a correção NÃO absolve está medido em `respostaNaoEDecoravel.test.ts`:
 * em muitas fichas o caso varia e a RESPOSTA não, e decorar o rótulo vence o
 * nível do mesmo jeito.
 */
type Motivo = "LEGITIMO" | "A-REPARAR";

const REGISTRO: Record<string, { motivo: Motivo; niveis: number[]; porque: string }> = {
  "GE.03": { motivo: "A-REPARAR", niveis: [1, 2, 3, 5], porque: "detetive de formas com peça fixa por nível; L4 já varia" },
  "N1.02": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4], porque: "quantidade fixa por nível; L5 já varia" },
  "N5.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "multiplicação de frações com par fixo por nível" },
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

/**
 * Serialização estável e PROFUNDA do spec.
 *
 * A primeira versão usava `JSON.stringify(uiProps, Object.keys(uiProps).sort())`
 * achando que o segundo argumento ordenava as chaves. Ele filtra: só sobrevive
 * o que estiver na lista, em qualquer profundidade. O conteúdo de objetos
 * aninhados sumia da digital, e ficha que varia só por dentro — `N5.03`, cujo
 * caso mora em `esquerda`/`direita` — era contada como caso único.
 */
function estavel(valor: unknown): string {
  if (Array.isArray(valor)) return `[${valor.map(estavel).join(",")}]`;
  if (valor && typeof valor === "object") {
    return `{${Object.keys(valor as object).sort()
      .map(chave => `${chave}:${estavel((valor as Record<string, unknown>)[chave])}`)
      .join(",")}}`;
  }
  return String(valor);
}

/** Enunciado, resposta, conjunto de alternativas e spec. A ordem das opções não entra. */
function digital(question: ReturnType<typeof generateRegisteredFichaQuestion>): string {
  const opcoes = (question.options ?? []).map(option => String(option.value)).sort();
  return [question.prompt, String(question.answer), opcoes.join(","), estavel(question.uiProps)].join("|");
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
    expect(aReparar.length, "competências na fila de reparo da CLASS-003").toBe(3);
    expect(pares, "pares (ficha, nível) na fila de reparo da CLASS-003").toBe(13);
  });
});
