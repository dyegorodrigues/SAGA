import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

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
 * A medição usa o RÓTULO da alternativa certa, não o `answer`. Vários contratos
 * respondem por id posicional — `value: 1` para "o nome do sólido" —, e ali o
 * `answer` fica constante enquanto o que a criança lê muda a cada sorteio.
 *
 * Gate por descoberta com catraca nos dois sentidos, como os irmãos: entrada
 * nova reprova sem ninguém inscrever nada, e entrada que ganhou variedade
 * também, para o registro encolher a cada reparo.
 */
type Motivo = "OPCOES-NAO-RENDERIZADAS" | "A-REPARAR";

const REGISTRO: Record<string, { motivo: Motivo; niveis: number[]; porque: string }> = {
  // O palco não desenha estas alternativas: elas documentam o espaço
  // diagnóstico do contrato para o Radar, e o rótulo é uma descrição fixa do
  // erro, não algo que a criança lê e escolhe. Decorar não ajuda porque não há
  // o que decorar na tela.
  "N4.12": { motivo: "OPCOES-NAO-RENDERIZADAS", niveis: [1, 2, 3, 4, 5], porque: "F71 é produção física no InteractiveVertical; os rótulos são nomes de erro, não alternativas na tela" },

  // A reparar: a criança escolhe entre rótulos, e o certo é sempre o mesmo.
  "AL.01": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4], porque: "a resposta é sempre 'separado'" },
  "AL.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 5], porque: "o número que equilibra é sempre o mesmo por nível" },
  "AL.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "o valor da expressão é sempre o mesmo por nível" },
  "AL.07": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a letra generalizada é sempre a mesma por nível" },
  "GE.03": { motivo: "OPCOES-NAO-RENDERIZADAS", niveis: [5], porque: "em L5 a resposta é o id do ponto tocado na malha; o que a criança escolhe é a casa, e a malha é sorteada" },
  "GE.05": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a casa do mapa é sempre a mesma por nível" },
  "GE.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a classe do ângulo é sempre a mesma por nível" },
  "GE.08": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "o par ordenado é sempre o mesmo por nível" },
  "GE.10": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a vista pedida é sempre a mesma por nível" },
  "GM.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a hora lida é sempre a mesma por nível" },
  "GM.09": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "o resultado do problema de medida é sempre o mesmo por nível" },
  "GM.12": { motivo: "A-REPARAR", niveis: [5], porque: "L5 responde sempre 'ordenado'" },
  "N1.01": { motivo: "A-REPARAR", niveis: [1, 2], porque: "o pareamento dá sempre 'deu certinho' em L1 e sempre 'sobrou' em L2" },
  "N1.02": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a quantidade contada é sempre a mesma por nível" },
  "N1.10": { motivo: "A-REPARAR", niveis: [1], porque: "a parte que falta é sempre 1 em L1" },
  "N2.06": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a paridade perguntada é sempre a mesma por nível" },
  "N5.01": { motivo: "A-REPARAR", niveis: [2, 4], porque: "a partição perguntada dá sempre a mesma resposta" },
  "N5.03": { motivo: "A-REPARAR", niveis: [1, 2], porque: "os três pares de L1/L2 são todos equivalentes: a resposta é sempre 'igual'" },
  "N5.04": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a soma de frações dá sempre o mesmo resultado por nível" },
  "PE.02": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a leitura do gráfico dá sempre a mesma resposta por nível" },
  "PE.03": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a média e a chance dão sempre a mesma resposta por nível" },
  "PE.04": { motivo: "A-REPARAR", niveis: [1, 2, 3, 4, 5], porque: "a estatística e a chance dão sempre a mesma resposta por nível" },
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

function cobraRepeticao(question: ReturnType<typeof generateRegisteredFichaQuestion>): boolean {
  const regra = question.masteryRule;
  if (!regra) return false;
  return (regra.de ?? 1) > 1 || (regra.sessoes ?? 1) > 1;
}

/** O que a criança lê e escolhe quando acerta. */
function rotuloCerto(question: ReturnType<typeof generateRegisteredFichaQuestion>): string {
  const opcoes = question.options ?? [];
  const certa = opcoes.find(option => question.evaluate?.(option.value)) ?? opcoes.find(option => option.value === question.answer);
  return String(certa?.label ?? certa?.value ?? question.answer);
}

function varrer(): Map<string, number[]> {
  const invariaveis = new Map<string, number[]>();
  const ids = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
  for (const id of ids) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const rotulos = new Set<string>();
      let cobra = false;
      for (const semente of SEMENTES) {
        semear(semente);
        for (let i = 0; i < AMOSTRAS; i += 1) {
          const question = generateRegisteredFichaQuestion(id, nivel);
          rotulos.add(rotuloCerto(question));
          cobra = cobra || cobraRepeticao(question);
        }
      }
      if (cobra && rotulos.size === 1) invariaveis.set(id, [...(invariaveis.get(id) ?? []), nivel]);
    }
  }
  return invariaveis;
}

describe("CLASS-003 — a resposta certa não pode ser sempre o mesmo rótulo", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    const servidas = JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha);
    expect(servidas.length).toBeGreaterThanOrEqual(75);
  });

  it("nenhuma ficha responde sempre igual fora do registro, e nenhuma entrada está obsoleta", { timeout: 180000 }, () => {
    const invariaveis = varrer();

    const novas = [...invariaveis.keys()].filter(id => !REGISTRO[id]).sort();
    const obsoletas = Object.keys(REGISTRO).filter(id => !invariaveis.has(id)).sort();
    const niveisMudaram = [...invariaveis.entries()]
      .filter(([id]) => REGISTRO[id])
      .filter(([id, niveis]) => niveis.join(",") !== REGISTRO[id].niveis.join(","))
      .map(([id, niveis]) => `${id}: registro [${REGISTRO[id].niveis}], medido [${niveis}]`)
      .sort();

    expect(novas, `fichas novas com resposta decorável: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas que passaram a variar — remova-as: ${obsoletas.join(", ")}`).toEqual([]);
    expect(niveisMudaram, `níveis divergem do registro:\n${niveisMudaram.join("\n")}`).toEqual([]);
  });

  it("cada entrada declara por que está ali", () => {
    for (const [id, item] of Object.entries(REGISTRO)) {
      expect(item.porque.length, `${id} sem justificativa`).toBeGreaterThan(20);
      expect(item.niveis.length, `${id} sem níveis`).toBeGreaterThan(0);
    }
  });
});
