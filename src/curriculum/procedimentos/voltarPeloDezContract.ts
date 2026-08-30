import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { AnswerMeta, MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F34 / N3.08 — voltar pelo dez. O espelho da F33.
 *
 * ## A mesma estação, na direção contrária
 *
 * `13 − 5` vira `13 − 3 − 2`, que vira `10 − 2`, que é 8. É a mesma lógica de
 * usar o dez como estação intermediária que a F33 ensina na soma — quem domina
 * fazer dez tem meio caminho andado aqui.
 *
 * ## O erro que vira problema anos depois
 *
 * A criança tenta tirar cinco de três, na coluna das unidades, e trava; ou
 * inverte e faz `5 − 3`. A ficha canônica é explícita sobre o que isso vira:
 * **é o erro clássico que depois aparece como o problema do reagrupamento na
 * conta armada.** Por isso `SUBTRAI_INVERTIDO` não é um distrator qualquer —
 * é o que esta ficha existe para pegar cedo.
 *
 * ## A escolha estratégica volta
 *
 * `13 − 8` é mais fácil completando — do 8 ao 13 são cinco — do que voltando
 * oito passos. É a mesma competência da F31, agora cruzando a dezena, e é por
 * isso que do L3 em diante a criança escolhe o caminho.
 */
export const VoltarPeloDezMisconception = {
  PAROU_NO_DEZ: "parou-no-dez",
  SUBTRAI_INVERTIDO: "subtrai-invertido",
  ESTRATEGIA_INEFICIENTE: "estrategia-ineficiente",
} as const;
export type VoltarPeloDezMisconceptionTag = typeof VoltarPeloDezMisconception[keyof typeof VoltarPeloDezMisconception];

export type VoltarPeloDezModo = "subtraendo-pequeno" | "voltar-pelo-dez" | "escolher-caminho" | "escolha-cobrada" | "mental";
export type CaminhoDaSubtracao = "voltar" | "completar";

export interface VoltarPeloDezF34Spec {
  nivel: number;
  modo: VoltarPeloDezModo;
  /** O total de onde se parte: entre 11 e 20, sempre acima do dez. */
  total: number;
  /** Quanto sai. Maior que as unidades soltas, senão não se cruza o dez. */
  sai: number;
  /** As unidades soltas acima do dez — o primeiro passo da decomposição. */
  soltos: number;
  /** O que ainda falta tirar depois de chegar ao dez. */
  restante: number;
  resposta: number;
  /** Quantos passos custa cada caminho: voltar é `sai`, completar é `resposta`. */
  passosVoltando: number;
  passosCompletando: number;
  curto: CaminhoDaSubtracao;
  mostrarMolduras: boolean;
  mostrarReta: boolean;
  /** Onde as molduras existem, chegar ao dez é a ação probatória. */
  exigeChegarAoDez: boolean;
  /** Do L3 em diante a criança escolhe por onde vai. */
  exigeEscolha: boolean;
  opcoes: Array<{ value: number; label: string; misconception?: VoltarPeloDezMisconceptionTag }>;
}

interface VoltarPeloDezShow {
  total: number;
  sai: number;
  soltos: number;
  restante: number;
  removerSoltos?: number;
  abrirMoldura?: boolean;
  numeral?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: VoltarPeloDezMisconceptionTag }>): VoltarPeloDezF34Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

export function construirVoltarPeloDezSpec(level: number, familiaPedida?: CaminhoDaSubtracao): VoltarPeloDezF34Spec {
  const nivel = clamp(level);
  const VM = VoltarPeloDezMisconception;

  // A escada é de tamanho do subtraendo. No L1 sai pouco — `12−3`, `13−4` — e a
  // decomposição tem o segundo passo curto; do L2 em diante qualquer subtraendo
  // que cruze o dez entra.
  // O teto é 18, não 20, e a sonda mostrou por quê: com total 19 ou 20 os
  // "soltos" seriam 9 ou 10, e o subtraendo precisaria passar de nove para
  // cruzar a dezena. Aí não há mais unidade solta a tirar primeiro — a
  // decomposição que a ficha ensina simplesmente não existe naquele caso.
  // Todos os exemplos da F34 são de subtraendo de um algarismo: 12−3, 13−4,
  // 18−9, 13−5, 13−8.
  const total = nivel === 1 ? ri(11, 14) : ri(11, 18);
  const soltos = total - 10;
  // `sai` tem que ser MAIOR que os soltos: se coubesse nas unidades, a conta não
  // cruzaria a dezena e a ficha não teria o que ensinar. E não passa de nove,
  // pelo mesmo motivo.
  const saiMax = nivel === 1 ? Math.min(soltos + 2, 9) : 9;
  const sai = ri(soltos + 1, Math.max(soltos + 1, saiMax));
  const restante = sai - soltos;
  const resposta = total - sai;

  const curto: CaminhoDaSubtracao = sai < resposta ? "voltar" : "completar";
  // O caminho pedido só existe para escolher o caso; o que a família registra é
  // qual dos dois é o curto naquele item.
  const familia = familiaPedida ?? curto;

  return {
    nivel,
    modo: nivel === 1 ? "subtraendo-pequeno" : nivel === 2 ? "voltar-pelo-dez" : nivel === 3 ? "escolher-caminho" : nivel === 4 ? "escolha-cobrada" : "mental",
    total,
    sai,
    soltos,
    restante,
    resposta,
    passosVoltando: sai,
    passosCompletando: resposta,
    curto: familia,
    mostrarMolduras: nivel <= 2,
    mostrarReta: nivel <= 4,
    exigeChegarAoDez: nivel <= 2,
    exigeEscolha: nivel >= 3 && nivel <= 4,
    opcoes: opcoes(resposta, [
      // Chegou ao dez e parou: esqueceu o segundo passo.
      { value: 10, misconception: VM.PAROU_NO_DEZ },
      // Inverteu nas unidades: fez `sai − soltos` em vez de `soltos − sai`, e
      // somou de volta. É o erro que vira o problema do reagrupamento.
      { value: 10 + restante, misconception: VM.SUBTRAI_INVERTIDO },
      // Contou os intervalos com um a mais.
      { value: resposta + 1, misconception: VM.PAROU_NO_DEZ },
    ]),
  };
}

export function construirVoltarPeloDezResolucao(spec: VoltarPeloDezF34Spec): ResolucaoDeclarativa<VoltarPeloDezShow, number, VoltarPeloDezMisconceptionTag> {
  const cena: VoltarPeloDezShow = { total: spec.total, sai: spec.sai, soltos: spec.soltos, restante: spec.restante };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "tirar-os-soltos",
        say: `Tire primeiro os ${spec.soltos} que estão soltos.`,
        show: { ...cena, removerSoltos: spec.soltos },
        corrige: [VoltarPeloDezMisconception.SUBTRAI_INVERTIDO],
        parcial: 10,
      },
      {
        id: "chegamos-no-dez",
        say: "Chegamos no dez!",
        show: { ...cena, removerSoltos: spec.soltos, numeral: 10 },
        corrige: [VoltarPeloDezMisconception.SUBTRAI_INVERTIDO],
        parcial: 10,
      },
      {
        id: "tirar-o-resto",
        say: `E ainda faltam tirar ${spec.restante}. A moldura cheia se abre.`,
        show: { ...cena, abrirMoldura: true, numeral: spec.resposta },
        corrige: [VoltarPeloDezMisconception.PAROU_NO_DEZ],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.08 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirVoltarPeloDezQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.08") throw new Error(`voltarPeloDezContract recebeu ${ficha.id}.`);
  const spec = construirVoltarPeloDezSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.08 sem micro L${spec.nivel}.`);

  // O enunciado só manda "voltar até o dez" onde as molduras mostram o dez.
  const prompt = spec.mostrarMolduras
    ? `${spec.total} − ${spec.sai}. Vamos voltar até o dez!`
    : spec.exigeEscolha
      ? `${spec.total} − ${spec.sai}. Qual caminho é mais curto?`
      : `${spec.total} − ${spec.sai}. Quanto sobra?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "voltar-pelo-dez-f34",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirVoltarPeloDezResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // CLASS-008, e o portão achou antes de mim: a evidência de família só faz
    // sentido onde a criança ESCOLHE o caminho. Nos níveis 1, 2 e 5 a ficha
    // prescreve passar pelo dez ou pede a conta de cabeça — não há escolha a
    // fazer, e etiquetar "voltar-curto" ali afirmaria que ela demonstrou uma
    // estratégia que ninguém lhe ofereceu.
    ...(spec.exigeEscolha ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, `${spec.curto}-curto`) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}

/** Escolher o caminho longo é diagnóstico de estratégia, não erro de conta. */
export function metaDoCaminhoF34(spec: VoltarPeloDezF34Spec, escolhido: CaminhoDaSubtracao): AnswerMeta | undefined {
  if (escolhido === spec.curto) return undefined;
  return { misconception: VoltarPeloDezMisconception.ESTRATEGIA_INEFICIENTE };
}
