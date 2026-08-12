import type { PassoDeResolucao, ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia, FichaMicro } from "../schema";
import { CountingOnMisconception, type CountingOnMisconception as CountingOnMisconceptionTag } from "./countingOnSemantics";

export type CountingOnRepresentation = "cubos-reta" | "reta" | "simbolo";

export interface CountingOnSpec {
  nivel: number;
  maior: number;
  menor: number;
  total: number;
  representacao: CountingOnRepresentation;
  maoFantasma: boolean;
  retaApareceAoErrar: boolean;
  tecladoAte: number;
  enunciado: string;
  falado: string;
}

export interface CountingOnResolutionShow {
  representacao: CountingOnRepresentation;
  marcador: number | null;
  cubosContados: number;
  saltos: readonly { de: number; para: number }[];
  destacarBloco?: "A";
  piscarNumeral?: number;
  resultado?: number;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

/** F14: parcela maior já conhecida + no máximo três novos passos. */
export function construirCountingOnSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): CountingOnSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const limite = clamped <= 2 ? 10 : 20;
  // A ficha só exige menor<=3 a partir do L3; manter o mesmo teto antes disso
  // produz um treino mais focado no salto cognitivo (confiar no maior) e evita
  // que a quantidade de toques se torne a dificuldade dominante.
  const menor = inteiro(1, 3, sorteio);
  const maiorMinimo = Math.max(4, menor + 1);
  const maiorMaximo = limite - menor;
  const maior = inteiro(maiorMinimo, maiorMaximo, sorteio);
  const total = maior + menor;
  const representacao: CountingOnRepresentation = clamped <= 2
    ? "cubos-reta"
    : clamped === 3
      ? "reta"
      : "simbolo";

  return {
    nivel: clamped,
    maior,
    menor,
    total,
    representacao,
    maoFantasma: clamped === 1,
    retaApareceAoErrar: clamped === 4,
    tecladoAte: 20,
    enunciado: `${maior} + ${menor}. De qual número você começa?`,
    falado: `${maior} mais ${menor}. Comece do número maior.`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N3.03 sem micro do nível ${nivel}.`);
  return micro;
}

export function construirCountingOnResolucao(
  spec: CountingOnSpec,
): ResolucaoDeclarativa<CountingOnResolutionShow, number, CountingOnMisconceptionTag> {
  const estadoInicial: CountingOnResolutionShow = {
    representacao: spec.representacao,
    marcador: null,
    cubosContados: 0,
    saltos: [],
  };
  const saltos: { de: number; para: number }[] = [];
  const passos: PassoDeResolucao<CountingOnResolutionShow, number, CountingOnMisconceptionTag>[] = [
    {
      id: "ancorar-no-maior",
      say: `${spec.maior} já está pronto. Não precisa contar de novo.`,
      show: {
        representacao: spec.representacao,
        marcador: spec.maior,
        cubosContados: 0,
        saltos: [],
        destacarBloco: "A",
        piscarNumeral: spec.maior,
      },
      corrige: [
        CountingOnMisconception.CONTA_TUDO,
        CountingOnMisconception.NAO_ESCOLHE_MAIOR,
        CountingOnMisconception.DEPENDE_DA_RETA,
      ],
      parcial: spec.maior,
    },
  ];

  for (let i = 1; i <= spec.menor; i += 1) {
    const de = spec.maior + i - 1;
    const para = spec.maior + i;
    saltos.push({ de, para });
    passos.push({
      id: `salto-${i}`,
      say: i === spec.menor ? `${para}. Chegamos a ${spec.total}.` : String(para),
      show: {
        representacao: spec.representacao,
        marcador: para,
        cubosContados: i,
        saltos: [...saltos],
        ...(i === spec.menor ? { resultado: spec.total } : {}),
      },
      ...(i === 1 ? { corrige: [CountingOnMisconception.OFF_BY_ONE] } : {}),
      parcial: para,
    });
  }

  return { estadoInicial, passos, fallback: 0 };
}

/** Builder especializado da W10. `LinkingCubes` e `NumberLine` são compostos pelo Stage. */
export function construirCountingOnQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.03") throw new Error(`countingOnContract recebeu ${ficha.id}.`);
  const spec = construirCountingOnSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "counting-on-f14",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirCountingOnResolucao(spec),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
    },
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    answer: spec.total,
    evaluate: answer => Number(answer) === spec.total,
  };
}
