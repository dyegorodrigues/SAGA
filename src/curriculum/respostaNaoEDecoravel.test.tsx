// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";
import { GameLoopExerciseRenderer } from "../components/gameloop/GameLoopExerciseRenderer";
import type { Question } from "../types";

/**
 * CLASS-003, segunda dimensão — o caso muda, mas a resposta não.
 *
 * Sortear o caso não basta. Se o rótulo da alternativa certa é sempre o mesmo,
 * a criança decora o rótulo e vence o nível sem fazer a conta — e o motor
 * conclui domínio depois de três acertos em duas sessões.
 *
 * Não é hipótese. Aconteceu em `GE.04`, onde a esfera estava sempre na rampa e
 * o cubo sempre na pilha: "sim" acertava L3 e L4 para sempre. E em `GE.07`,
 * onde a resposta era sempre "isósceles" em L1. Os dois só apareceram porque
 * alguém foi olhar; esta varredura passa a olhar sozinha.
 *
 * ### A medição, e a correção que ela sofreu
 *
 * A primeira versão media o RÓTULO da alternativa certa e parava aí. Vários
 * contratos respondem por id posicional — `value: 1` para "o nome do sólido" —,
 * e ali o `answer` fica constante enquanto o que a criança lê muda a cada
 * sorteio; medir o rótulo resolveu esse lado.
 *
 * Só que o rótulo existe no `Question` mesmo quando **ninguém o desenha**. Onde
 * a criança arrasta peças, conta com o dedo ou constrói no palco, o `options`
 * ou vem vazio, ou vem preenchido com nomes de erro que alimentam o Radar e não
 * chegam à tela. Nesses lugares não há o que decorar: a medição inventava
 * defeito, e eu inscrevia a ficha num registro `OPCOES-NAO-RENDERIZADAS`
 * escrito à mão — exatamente a lista positiva que o D068 proíbe.
 *
 * Agora quem decide é a tela. O candidato sai da varredura barata; quem
 * confirma é uma renderização da casca inteira, contando se existe um botão
 * clicável carregando aquele rótulo. Sem botão, não há escolha, e não há
 * CLASS-003 nesta dimensão — o caso único é a outra, e tem gate próprio.
 *
 * A correção mudou o veredito em dois sentidos, o que é o ponto de ter feito:
 * `AL.01`, `N1.01`, `N1.02`, `GE.03` e `GM.12` saíram (ninguém desenha o
 * rótulo), e `N4.12` entrou — eu tinha escrito à mão que a F71 não renderiza
 * alternativas, e a casca renderiza: "quociente ajustado" está num botão, e
 * acerta os cinco níveis para sempre.
 *
 * Gate por descoberta com catraca nos dois sentidos, como os irmãos: entrada
 * nova reprova sem ninguém inscrever nada, e entrada que ganhou variedade
 * também, para o registro encolher a cada reparo.
 */
const REGISTRO: Record<string, { niveis: number[]; porque: string }> = {
  "AL.05": { niveis: [1, 2, 3], porque: "o número que equilibra a balança é sempre o mesmo por nível" },
  "AL.06": { niveis: [1, 2, 3, 4, 5], porque: "o valor da expressão é sempre o mesmo por nível" },
  "AL.07": { niveis: [1, 2, 3, 4, 5], porque: "a letra generalizada é sempre a mesma por nível" },
  "GM.09": { niveis: [1, 2, 3, 4, 5], porque: "o resultado do problema de medida é sempre o mesmo por nível" },
  "N2.06": { niveis: [1, 2, 3, 4, 5], porque: "a paridade perguntada é sempre a mesma por nível" },
  "N4.12": { niveis: [1, 2, 3, 4, 5], porque: "a casca desenha os nomes de erro como alternativas, e 'quociente ajustado' acerta sempre" },
  "N5.01": { niveis: [2], porque: "as duas partes de L2 são sempre iguais: 'encaixam' acerta sempre" },
  "N5.03": { niveis: [1, 2], porque: "os pares de L1/L2 são todos equivalentes: a resposta é sempre 'São iguais'" },
  "N5.04": { niveis: [1, 2, 3, 4, 5], porque: "a soma de frações dá sempre o mesmo resultado por nível" },
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

/** A casca, com o mínimo que o renderizador exige para desenhar um exercício. */
const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

function cobraRepeticao(question: Question): boolean {
  const regra = question.masteryRule;
  if (!regra) return false;
  return (regra.de ?? 1) > 1 || (regra.sessoes ?? 1) > 1;
}

/** O que a criança lê e escolhe quando acerta. */
function rotuloCerto(question: Question): string {
  const opcoes = question.options ?? [];
  const certa = opcoes.find(option => question.evaluate?.(option.value)) ?? opcoes.find(option => option.value === question.answer);
  return String(certa?.label ?? certa?.value ?? question.answer);
}

/** Existe um botão clicável com esse rótulo na tela? É o que decide. */
function rotuloEstaNaTela(question: Question, rotulo: string): boolean {
  const { container, unmount } = render(<GameLoopExerciseRenderer {...casca} q={question} handlePick={vi.fn()} />);
  const achou = [...container.querySelectorAll("button")].some(botao => (botao.textContent ?? "").trim() === rotulo);
  unmount();
  return achou;
}

function amostrar(id: string, nivel: number): Question[] {
  const questoes: Question[] = [];
  for (const semente of SEMENTES) {
    semear(semente);
    for (let i = 0; i < AMOSTRAS; i += 1) questoes.push(generateRegisteredFichaQuestion(id, nivel) as Question);
  }
  Math.random = original;
  return questoes;
}

interface Varredura {
  /** Rótulo invariável E desenhado: a criança decora e vence. */
  decoraveis: Map<string, number[]>;
  /** Rótulo invariável mas que ninguém desenha: não há escolha a decorar. */
  semEscolha: string[];
}

function varrer(): Varredura {
  const decoraveis = new Map<string, number[]>();
  const semEscolha: string[] = [];
  const ids = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
  for (const id of ids) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const questoes = amostrar(id, nivel);
      const rotulos = new Set(questoes.map(rotuloCerto));
      if (!questoes.some(cobraRepeticao) || rotulos.size > 1) continue;

      // Candidato. Quem confirma é a tela: um rótulo que ninguém desenha não é
      // uma alternativa, é documentação do espaço diagnóstico para o Radar.
      const rotulo = [...rotulos][0];
      if (questoes.some(questao => rotuloEstaNaTela(questao, rotulo))) {
        decoraveis.set(id, [...(decoraveis.get(id) ?? []), nivel]);
      } else {
        semEscolha.push(`${id}|${nivel}`);
      }
    }
  }
  return { decoraveis, semEscolha };
}

describe("CLASS-003 — a resposta certa não pode ser sempre o mesmo rótulo", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    const servidas = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
    expect(servidas.length).toBeGreaterThanOrEqual(75);
  });

  it("nenhuma ficha responde sempre igual fora do registro, e nenhuma entrada está obsoleta", { timeout: 300000 }, () => {
    const { decoraveis, semEscolha } = varrer();

    const novas = [...decoraveis.keys()].filter(id => !REGISTRO[id]).sort();
    const obsoletas = Object.keys(REGISTRO).filter(id => !decoraveis.has(id)).sort();
    const niveisMudaram = [...decoraveis.entries()]
      .filter(([id]) => REGISTRO[id])
      .filter(([id, niveis]) => niveis.join(",") !== REGISTRO[id].niveis.join(","))
      .map(([id, niveis]) => `${id}: registro [${REGISTRO[id].niveis}], medido [${niveis}]`)
      .sort();

    expect(novas, `fichas novas com resposta decorável: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas que passaram a variar — remova-as: ${obsoletas.join(", ")}`).toEqual([]);
    expect(niveisMudaram, `níveis divergem do registro:\n${niveisMudaram.join("\n")}`).toEqual([]);

    // Os descartados existem para serem lidos, não para serem inscritos: se a
    // lista esvaziar de repente, o filtro de tela parou de filtrar e as
    // varreduras seguintes passariam a acusar defeito onde não há escolha.
    expect(semEscolha.length, "o filtro de tela parou de descartar rótulo nenhum").toBeGreaterThan(0);
  });

  it("cada entrada declara por que está ali", () => {
    for (const [id, item] of Object.entries(REGISTRO)) {
      expect(item.porque.length, `${id} sem justificativa`).toBeGreaterThan(20);
      expect(item.niveis.length, `${id} sem níveis`).toBeGreaterThan(0);
    }
  });
});
