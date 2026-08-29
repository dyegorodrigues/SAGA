import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { AnswerMeta, MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F31 / N3.04 — voltar contando e completar.
 *
 * ## O que a ficha canônica manda
 *
 * Subtração tem dois caminhos, e a competência **é escolher entre eles**:
 * `11 − 3` é curto voltando (três passos) e `11 − 8` é curto completando (três
 * passos) e longo voltando (oito). Quem só aprendeu um caminho leva oito passos
 * onde bastavam três, e erra pelo caminho.
 *
 * A regra que a ficha ensina: *se o número que sai é pequeno, volte; se é
 * grande e perto do total, complete.*
 *
 * ## As duas famílias, e por que elas são exigidas
 *
 * O §9 da F31 não pede só quatro acertos: pede que **duas das quatro** sejam
 * problemas onde completar é o caminho curto. Sem isso a criança demonstra
 * flexibilidade tendo usado sempre a mesma estratégia — que é exatamente a
 * CLASS-008, e exatamente o erro `ESTRATEGIA_UNICA` que a ficha nomeia.
 *
 * Daí as famílias `voltar-curto` e `completar-curto`: o gerador sorteia entre
 * elas, cada questão emite a sua, e a regra de domínio segura a coroa até as
 * duas aparecerem.
 */
export const VoltarContandoMisconception = {
  OFF_BY_ONE: "off-by-one",
  INVERTE_DIRECAO: "inverte-direcao",
  ESTRATEGIA_INEFICIENTE: "estrategia-ineficiente",
} as const;
export type VoltarContandoMisconceptionTag = typeof VoltarContandoMisconception[keyof typeof VoltarContandoMisconception];

export type VoltarContandoModo = "so-voltar" | "escolher" | "comparar" | "escolha-cobrada" | "mental";
export type Caminho = "voltar" | "completar";

export interface VoltarContandoF31Spec {
  nivel: number;
  modo: VoltarContandoModo;
  /** O total de onde se parte — o minuendo. */
  total: number;
  /** Quanto sai — o subtraendo. */
  sai: number;
  resposta: number;
  inicio: number;
  fim: number;
  /** Quantos passos custa cada caminho. Ver os dois lado a lado é a lição. */
  passosVoltando: number;
  passosCompletando: number;
  /** Qual dos dois é o curto neste caso. É também o nome da família. */
  curto: Caminho;
  mostrarReta: boolean;
  mostrarComparacao: boolean;
  /** L2+: escolher o caminho é a ação probatória — sem ela a barra não responde. */
  exigeEscolha: boolean;
  opcoes: Array<{ value: number; label: string; misconception?: VoltarContandoMisconceptionTag }>;
}

interface VoltarContandoShow {
  inicio: number;
  fim: number;
  total: number;
  sai: number;
  caminho?: Caminho;
  passos?: number[];
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: VoltarContandoMisconceptionTag }>): VoltarContandoF31Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value >= 0)
    .slice(0, 4);
}

/**
 * Sorteia o par `(total, sai)` respeitando a família pedida.
 *
 * `voltar-curto` quer `sai` menor que o que fica; `completar-curto` quer o
 * contrário. O empate — `sai` exatamente metade do total — é recusado: ali os
 * dois caminhos custam o mesmo, e o nível que pergunta "qual é mais curto" não
 * teria resposta.
 */
function sortearCaso(total_min: number, total_max: number, sai_max: number, familia: Caminho): { total: number; sai: number } {
  for (let tentativa = 0; tentativa < 200; tentativa += 1) {
    const total = ri(total_min, total_max);
    const sai = ri(1, Math.min(sai_max, total - 1));
    const fica = total - sai;
    if (sai === fica) continue;
    if ((familia === "voltar" ? sai < fica : fica < sai)) return { total, sai };
  }
  // Construção direta para o caso em que o sorteio não encontrou: mantém a
  // família pedida sem entrar em laço infinito.
  const total = total_max;
  const sai = familia === "voltar" ? 1 : total - 1;
  return { total, sai };
}

export function construirVoltarContandoSpec(level: number, familiaPedida?: Caminho): VoltarContandoF31Spec {
  const nivel = clamp(level);
  const VM = VoltarContandoMisconception;

  // O L1 é "só voltar": não há escolha a fazer, então a família é sempre a de
  // voltar — e o subtraendo pequeno que a ficha manda garante isso sozinho.
  const familia: Caminho = nivel === 1 ? "voltar" : familiaPedida ?? (Math.random() < 0.5 ? "voltar" : "completar");
  // A escada da F31 é de alcance: os dois primeiros níveis ficam dentro do dez,
  // os três seguintes vão até vinte. Sem o piso, o L4 sorteava "5 menos 3" e o
  // degrau que o nível promete existia só no papel — CLASS-001 na origem.
  const totalMax = nivel <= 2 ? 10 : 20;
  const totalMin = nivel <= 2 ? 4 : 11;
  const saiMax = nivel === 1 ? 3 : totalMax - 1;
  const { total, sai } = sortearCaso(totalMin, totalMax, familia === "voltar" ? Math.min(saiMax, totalMax) : saiMax, familia);
  const resposta = total - sai;

  return {
    nivel,
    modo: nivel === 1 ? "so-voltar" : nivel === 2 ? "escolher" : nivel === 3 ? "comparar" : nivel === 4 ? "escolha-cobrada" : "mental",
    total,
    sai,
    resposta,
    inicio: 0,
    fim: totalMax,
    passosVoltando: sai,
    passosCompletando: resposta,
    curto: sai < resposta ? "voltar" : "completar",
    // O L5 é mental: a reta some, e é isso que o nível mede.
    mostrarReta: nivel <= 4,
    mostrarComparacao: nivel === 3 || nivel === 4,
    exigeEscolha: nivel >= 2,
    opcoes: opcoes(resposta, [
      // Contou a casa de partida: um passo a mais ou a menos.
      { value: resposta - 1, misconception: VM.OFF_BY_ONE },
      { value: resposta + 1, misconception: VM.OFF_BY_ONE },
      // Foi para o lado errado: juntou em vez de tirar.
      { value: total + sai, misconception: VM.INVERTE_DIRECAO },
    ]),
  };
}

export function construirVoltarContandoResolucao(spec: VoltarContandoF31Spec): ResolucaoDeclarativa<VoltarContandoShow, number, VoltarContandoMisconceptionTag> {
  const cena: VoltarContandoShow = { inicio: spec.inicio, fim: spec.fim, total: spec.total, sai: spec.sai };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "achar-os-dois",
        say: "Ache os dois números na reta: de onde a gente parte e quanto sai.",
        show: cena,
        corrige: [VoltarContandoMisconception.INVERTE_DIRECAO],
        parcial: spec.total,
      },
      {
        id: "contar-intervalos",
        say: "Conte os pulos entre as casas, não as casas. A casa de partida não é pulo.",
        show: { ...cena, caminho: "voltar", passos: [spec.total, spec.resposta] },
        corrige: [VoltarContandoMisconception.OFF_BY_ONE],
        parcial: spec.resposta,
      },
      {
        id: "escolher-o-curto",
        say: spec.curto === "voltar"
          ? "Aqui sai pouco: voltar contando é o caminho curto."
          : "Aqui sai quase tudo: contar do menor até o maior é o caminho curto.",
        show: { ...cena, caminho: spec.curto, passos: [spec.resposta, spec.total] },
        corrige: [VoltarContandoMisconception.ESTRATEGIA_INEFICIENTE],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.04 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    // CLASS-008: a exigência das duas famílias viaja com a questão. Sem esta
    // linha a ficha pede as duas e o motor recebe uma questão que não pede nada.
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirVoltarContandoQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.04") throw new Error(`voltarContandoContract recebeu ${ficha.id}.`);
  const spec = construirVoltarContandoSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.04 sem micro L${spec.nivel}.`);

  // Só pergunta "qual caminho" quem oferece caminho. No L1 a ficha manda voltar
  // e pronto: perguntar a escolha ali seria cobrar uma decisão que a tela não
  // apresenta — e o enunciado passaria a mentir sobre o próprio nível.
  const prompt = spec.exigeEscolha && spec.modo !== "mental"
    ? `${spec.total} menos ${spec.sai}. Qual caminho é mais curto?`
    : `${spec.total} menos ${spec.sai}. Quanto fica?`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "voltar-contando-f31",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirVoltarContandoResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, `${spec.curto}-curto`),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}

/**
 * O caminho escolhido é diagnóstico, e o diagnóstico é do palco.
 *
 * Escolher o caminho longo não é erro de conta — a criança pode chegar ao
 * resultado certo por ele. É a estratégia que está cara, e é isso que a tag
 * `ESTRATEGIA_INEFICIENTE` registra. Por isso ela sai como `meta`, junto da
 * resposta, e não como etiqueta de alternativa.
 */
export function metaDoCaminho(spec: VoltarContandoF31Spec, escolhido: Caminho): AnswerMeta | undefined {
  if (escolhido === spec.curto) return undefined;
  return { misconception: VoltarContandoMisconception.ESTRATEGIA_INEFICIENTE };
}
