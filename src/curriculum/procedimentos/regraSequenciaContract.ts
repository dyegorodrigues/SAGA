import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const RegraSequenciaMisconception = {
  SO_ULTIMO_PAR: "so-ultimo-par",
  SOMA_QUANDO_MULTIPLICA: "soma-quando-multiplica",
  IGNORA_DIRECAO: "ignora-direcao",
} as const;

export type RegraSequenciaMisconceptionTag = typeof RegraSequenciaMisconception[keyof typeof RegraSequenciaMisconception];

export const REGRA_SEQUENCIA_DESAFIO_PREFIX = "regra-sequencia-desafio:";

export type RegraSequenciaModo =
  | "aditiva-curta"
  | "aditiva-ampla"
  | "aditiva-decrescente"
  | "lacuna-meio"
  | "multiplicativa";

export interface RegraSequenciaRegra {
  operacao: "somar" | "multiplicar";
  valor: number;
  rotulo: string;
}

export interface RegraSequenciaF57Spec {
  nivel: number;
  modo: RegraSequenciaModo;
  termos: Array<number | null>;
  indiceLacuna: number;
  resposta: number;
  regra: RegraSequenciaRegra;
  diferencasVisiveis: boolean;
}

export interface RegraSequenciaResolutionShow {
  termos: Array<number | null>;
  arcosVisiveis: boolean;
  regra?: string;
  resposta?: number;
  verificarTodos?: boolean;
}

const clampLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level)));

function safeIndex(rng: () => number, length: number): number {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return Math.floor(safe * length);
}

export function aplicarRegraSequencia(regra: RegraSequenciaRegra, valor: number): number {
  return regra.operacao === "somar" ? valor + regra.valor : valor * regra.valor;
}

function montarSpec(
  nivel: number,
  modo: RegraSequenciaModo,
  inicio: number,
  regra: RegraSequenciaRegra,
  quantidade: number,
  indiceLacuna: number,
  diferencasVisiveis: boolean,
): RegraSequenciaF57Spec {
  const completos = [inicio];
  while (completos.length < quantidade) {
    completos.push(aplicarRegraSequencia(regra, completos[completos.length - 1]));
  }
  const resposta = completos[indiceLacuna];
  return {
    nivel,
    modo,
    termos: completos.map((valor, indice) => indice === indiceLacuna ? null : valor),
    indiceLacuna,
    resposta,
    regra,
    diferencasVisiveis,
  };
}

export function construirRegraSequenciaSpec(level: number, rng: () => number = Math.random): RegraSequenciaF57Spec {
  const nivel = clampLevel(level);
  if (nivel === 1) {
    const passo = [1, 2][safeIndex(rng, 2)];
    const inicio = 1 + safeIndex(rng, 4);
    return montarSpec(nivel, "aditiva-curta", inicio, { operacao: "somar", valor: passo, rotulo: `+${passo}` }, 4, 3, true);
  }
  if (nivel === 2) {
    const passo = [3, 5, 10][safeIndex(rng, 3)];
    const inicio = safeIndex(rng, 4);
    return montarSpec(nivel, "aditiva-ampla", inicio, { operacao: "somar", valor: passo, rotulo: `+${passo}` }, 4, 3, true);
  }
  if (nivel === 3) {
    const passo = [2, 3, 5][safeIndex(rng, 3)];
    const inicio = 20 + safeIndex(rng, 8);
    return montarSpec(nivel, "aditiva-decrescente", inicio, { operacao: "somar", valor: -passo, rotulo: `−${passo}` }, 4, 3, false);
  }
  if (nivel === 4) {
    const passo = [3, 4, 5][safeIndex(rng, 3)];
    const inicio = 2 + safeIndex(rng, 3);
    return montarSpec(nivel, "lacuna-meio", inicio, { operacao: "somar", valor: passo, rotulo: `+${passo}` }, 4, 1, false);
  }

  const fator = [2, 3][safeIndex(rng, 2)];
  const inicio = 1 + safeIndex(rng, 2);
  return montarSpec(nivel, "multiplicativa", inicio, { operacao: "multiplicar", valor: fator, rotulo: `×${fator}` }, 5, 4, false);
}

export function construirRegraSequenciaResolucao(spec: RegraSequenciaF57Spec): ResolucaoDeclarativa<RegraSequenciaResolutionShow, string, RegraSequenciaMisconceptionTag> {
  const corrige: RegraSequenciaMisconceptionTag[] = [RegraSequenciaMisconception.SO_ULTIMO_PAR];
  if (spec.nivel === 3) corrige.push(RegraSequenciaMisconception.IGNORA_DIRECAO);
  if (spec.nivel === 5) corrige.push(RegraSequenciaMisconception.SOMA_QUANDO_MULTIPLICA);

  const completos = spec.termos.map((termo, indice) => indice === spec.indiceLacuna ? spec.resposta : termo);
  return {
    estadoInicial: { termos: spec.termos, arcosVisiveis: spec.diferencasVisiveis },
    passos: [
      {
        id: "verificar-todos-os-pares",
        say: "Compare o primeiro com o segundo e depois cada par seguinte. A mesma regra precisa funcionar em todos.",
        show: { termos: spec.termos, arcosVisiveis: true, regra: spec.regra.rotulo, verificarTodos: true },
        corrige,
        parcial: "regra-verificada",
      },
      {
        id: "aplicar-a-mesma-regra",
        say: `A regra é ${spec.regra.rotulo} a cada passo. Aplique a mesma regra na lacuna.`,
        show: { termos: completos, arcosVisiveis: true, regra: spec.regra.rotulo, resposta: spec.resposta, verificarTodos: true },
        corrige,
        parcial: String(spec.resposta),
      },
    ],
    fallback: 0,
  };
}

function masteryRuleDaFicha(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.04 sem micro do nível ${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirRegraSequenciaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.04") throw new Error(`regraSequenciaContract recebeu ${ficha.id}.`);
  const spec = construirRegraSequenciaSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.04 sem micro do nível ${spec.nivel}.`);
  const rt = ficha.niveis?.[spec.nivel]?.rt_alvo;
  const prompt = spec.nivel === 4 ? "Qual número está faltando no meio da sequência?" : "Qual é o próximo número da sequência?";

  return {
    kind: "regra-sequencia-f57",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirRegraSequenciaResolucao(spec),
    masteryRule: masteryRuleDaFicha(ficha, spec.nivel),
    ...(typeof rt === "number" && rt > 0 ? { rt_max_s: rt / 1000 } : {}),
    uiProps: spec,
    answer: String(spec.resposta),
    evaluate: answer => String(answer).trim() === String(spec.resposta),
  };
}
