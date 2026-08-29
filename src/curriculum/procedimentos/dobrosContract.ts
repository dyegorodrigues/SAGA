import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F32 / N3.06 — dobros e quase-dobros.
 *
 * ## A joia da ficha
 *
 * Os dobros são âncoras de memória: duas fileiras iguais têm simetria visual, e
 * a criança reconhece a imagem antes de contar. Os quase-dobros são o que a
 * ficha existe para ensinar — `6 + 7` não se calcula, **deduz-se** de `6 + 6`.
 *
 * É a primeira vez no currículo que a criança usa um fato que já sabe para
 * descobrir outro que não sabe. O erro-alvo, o que a ficha chama
 * `NAO_USA_DOBRO`, é justamente tratar `6 + 7` como problema novo e contar tudo
 * de novo.
 *
 * ## Por que a âncora nunca é a mesma
 *
 * CLASS-003: se o dobro fosse fixo, `6 + 6 = 12` viraria a resposta decorada e
 * o quase-dobro deixaria de ser dedução. O que fica fixo é a ESTRUTURA de cada
 * nível — só dobros, dobros grandes, quase-dobro com apoio escrito, quase-dobro
 * sem apoio, mistura — e a âncora é sorteada dentro dela.
 */
export const DobrosMisconception = {
  ESQUECEU_O_EXTRA: "esqueceu-o-extra",
  DOBROU_ERRADO: "dobrou-errado",
} as const;
export type DobrosMisconceptionTag = typeof DobrosMisconception[keyof typeof DobrosMisconception];

export type DobrosModo = "dobro-pequeno" | "dobro-grande" | "quase-dobro-com-apoio" | "quase-dobro-sem-apoio" | "misto";
export type FamiliaDobro = "dobro" | "quase-dobro";

export interface DobrosF32Spec {
  nivel: number;
  modo: DobrosModo;
  /** A âncora: o número que aparece nas duas fileiras iguais. */
  ancora: number;
  /** A segunda parcela — igual à âncora no dobro, um a mais ou a menos no quase-dobro. */
  segunda: number;
  /** Quanto o quase-dobro se afasta do dobro: −1, 0 ou +1. */
  extra: number;
  /** O fato conhecido de onde a dedução parte. */
  dobroAncora: number;
  resposta: number;
  /** L3 escreve `a + a = 2a` na tela; do L4 em diante a criança recupera sozinha. */
  mostrarApoio: boolean;
  familia: FamiliaDobro;
  opcoes: Array<{ value: number; label: string; misconception?: DobrosMisconceptionTag }>;
}

interface DobrosShow {
  ancora: number;
  segunda: number;
  extra: number;
  destacarExtra?: boolean;
  numeral?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: DobrosMisconceptionTag }>): DobrosF32Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

export function construirDobrosSpec(level: number, familiaPedida?: FamiliaDobro): DobrosF32Spec {
  const nivel = clamp(level);
  const DM = DobrosMisconception;

  // O L5 é o único que mistura; nos outros a família é a do próprio nível.
  const familia: FamiliaDobro = nivel <= 2
    ? "dobro"
    : nivel <= 4
      ? "quase-dobro"
      : familiaPedida ?? (Math.random() < 0.5 ? "dobro" : "quase-dobro");

  // A escada da F32 é de tamanho e de apoio. O L2 começa acima do L1: se as
  // duas faixas se sobrepusessem, o degrau existiria só no papel.
  // O piso do L1 é dois, não um. Com âncora 1 o distrator "dobrou errado para
  // menos" vale zero e é descartado: sobravam duas alternativas, e duas
  // alternativas são cara ou coroa — o nível deixaria de medir.
  const ancora = nivel === 1 ? ri(2, 5) : nivel === 2 ? ri(6, 10) : ri(3, 9);
  // O L3 é só o mais-um, que é a dedução mais simples. O L4 acrescenta o
  // menos-um, e é aí que a criança precisa decidir a direção do ajuste.
  const extra = familia === "dobro" ? 0 : nivel === 3 ? 1 : (Math.random() < 0.5 ? 1 : -1);
  const segunda = ancora + extra;
  const dobroAncora = ancora + ancora;
  const resposta = ancora + segunda;

  return {
    nivel,
    modo: nivel === 1 ? "dobro-pequeno" : nivel === 2 ? "dobro-grande" : nivel === 3 ? "quase-dobro-com-apoio" : nivel === 4 ? "quase-dobro-sem-apoio" : "misto",
    ancora,
    segunda,
    extra,
    dobroAncora,
    resposta,
    mostrarApoio: nivel === 3,
    familia,
    opcoes: opcoes(resposta, [
      // Usou a âncora e parou: respondeu o dobro. Só existe quando há extra —
      // no dobro puro esta alternativa SERIA a resposta certa.
      ...(extra !== 0 ? [{ value: dobroAncora, misconception: DM.ESQUECEU_O_EXTRA }] : []),
      // A âncora não está memorizada: dobrou errado e depois ajustou certo.
      { value: dobroAncora + 2 + extra, misconception: DM.DOBROU_ERRADO },
      { value: dobroAncora - 2 + extra, misconception: DM.DOBROU_ERRADO },
    ]),
  };
}

export function construirDobrosResolucao(spec: DobrosF32Spec): ResolucaoDeclarativa<DobrosShow, number, DobrosMisconceptionTag> {
  const cena: DobrosShow = { ancora: spec.ancora, segunda: spec.segunda, extra: spec.extra };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "ver-o-dobro",
        say: `Olhe as duas fileiras iguais: ${spec.ancora} e ${spec.ancora}.`,
        show: cena,
        corrige: [DobrosMisconception.DOBROU_ERRADO],
        parcial: spec.dobroAncora,
      },
      {
        id: "lembrar-a-ancora",
        say: `Esse dobro você já sabe: é ${spec.dobroAncora}.`,
        show: { ...cena, numeral: spec.dobroAncora },
        corrige: [DobrosMisconception.DOBROU_ERRADO],
        parcial: spec.dobroAncora,
      },
      {
        id: "ajustar",
        say: spec.extra === 0
          ? "Aqui as duas fileiras são iguais: o dobro já é a resposta."
          : spec.extra > 0
            ? "E tem mais um aqui: some um ao dobro."
            : "Aqui falta um para o dobro: tire um.",
        show: { ...cena, destacarExtra: spec.extra !== 0, numeral: spec.resposta },
        corrige: [DobrosMisconception.ESQUECEU_O_EXTRA],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.06 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    // CLASS-008: o §9 da F32 diz que só dobros não prova a estratégia. A
    // exigência precisa chegar ao motor junto com a questão.
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirDobrosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.06") throw new Error(`dobrosContract recebeu ${ficha.id}.`);
  const spec = construirDobrosSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.06 sem micro L${spec.nivel}.`);

  // O enunciado do quase-dobro lembra a âncora — é a estratégia sendo ensinada,
  // não gabarito: quem lê "você já sabe 6 + 6?" ainda precisa saber quanto é.
  const prompt = spec.extra === 0
    ? `${spec.ancora} + ${spec.segunda}. Quanto é o dobro?`
    : `${spec.ancora} + ${spec.segunda}. Você já sabe ${spec.ancora} + ${spec.ancora}?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "dobros-f32",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDobrosResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
