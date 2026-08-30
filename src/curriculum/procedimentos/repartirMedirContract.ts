import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F99 / N4.05 — repartir e medir. Os dois rostos da divisão.
 *
 * ## A mesma conta, duas perguntas
 *
 * `12 ÷ 3` responde a duas coisas diferentes:
 *
 * | sentido | a pergunta | o que se sabe | o que se descobre |
 * |---|---|---|---|
 * | partição | 12 doces para 3 crianças, quantos cada uma? | quantos GRUPOS | o TAMANHO do grupo |
 * | medida | 12 doces em sacos de 3, quantos sacos? | o TAMANHO do grupo | quantos GRUPOS |
 *
 * O alvo da ficha é o `SO_UM_SENTIDO`: a criança acerta partição e erra medida,
 * porque só conhece um rosto. Por isso o L4 pede que ela **identifique qual é**
 * antes de resolver, e não só resolva.
 *
 * ## O resto muda a resposta, e é o nível mais importante
 *
 * *"12 crianças, vans de 5 — quantas vans?"* precisa de **três vans**, não
 * "duas e sobra dois". O contexto decide o que fazer com o resto, e é isso que
 * o L5 mede: não a conta, a decisão sobre ela.
 */
export const RepartirMedirMisconception = {
  DIVISAO_DESIGUAL: "divisao-desigual",
  IGNORA_TAMANHO: "ignora-tamanho",
  CONFUNDE_RESTO: "confunde-resto",
} as const;
export type RepartirMedirMisconceptionTag = typeof RepartirMedirMisconception[keyof typeof RepartirMedirMisconception];

export type RepartirMedirModo = "particao" | "medida" | "alternando" | "identificar" | "resto-decide";
export type SentidoDaDivisao = "particao" | "medida";

export interface RepartirMedirF99Spec {
  nivel: number;
  modo: RepartirMedirModo;
  /** O sentido deste item — é também o nome da família. */
  sentido: SentidoDaDivisao;
  total: number;
  divisor: number;
  quociente: number;
  resto: number;
  /** O L4 pede que a criança diga qual sentido é, antes de resolver. */
  exigeIdentificar: boolean;
  /** No L5 o contexto decide o que fazer com o resto: arredondar para cima. */
  restoDecide: boolean;
  /** O enunciado em palavras — é ele que carrega o sentido. */
  historia: string;
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: RepartirMedirMisconceptionTag }>;
}

interface RepartirMedirShow {
  total: number;
  divisor: number;
  sentido: SentidoDaDivisao;
  distribuir?: boolean;
  agrupar?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

const CENARIOS_PARTICAO = [
  { objeto: "figurinhas", grupo: "amigos" },
  { objeto: "biscoitos", grupo: "crianças" },
  { objeto: "lápis", grupo: "mesas" },
] as const;
const CENARIOS_MEDIDA = [
  { objeto: "figurinhas", pacote: "pacotes" },
  { objeto: "ovos", pacote: "caixas" },
  { objeto: "livros", pacote: "prateleiras" },
] as const;
const CENARIOS_RESTO = [
  { objeto: "crianças", veiculo: "vans" },
  { objeto: "convidados", veiculo: "mesas" },
  { objeto: "livros", veiculo: "caixas" },
] as const;

function opcoes(correta: number, erradas: Array<{ value: number; misconception: RepartirMedirMisconceptionTag }>): RepartirMedirF99Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

export function construirRepartirMedirSpec(level: number, sentidoPedido?: SentidoDaDivisao): RepartirMedirF99Spec {
  const nivel = clamp(level);
  const RM = RepartirMedirMisconception;

  // L1 é só partição, L2 é só medida, e do L3 em diante os dois alternam — que
  // é onde o SO_UM_SENTIDO, o alvo da ficha, fica visível.
  const sentido: SentidoDaDivisao = nivel === 1
    ? "particao"
    : nivel === 2
      ? "medida"
      : sentidoPedido ?? (Math.random() < 0.5 ? "particao" : "medida");

  // A escada é de tamanho e de resto: exato até o L3, com resto do L4 em diante.
  const comResto = nivel >= 4;
  const divisor = nivel <= 2 ? ri(2, 3) : nivel === 3 ? ri(2, 4) : ri(3, 6);
  const quociente = nivel <= 2 ? ri(2, 4) : nivel === 3 ? ri(3, 6) : ri(2, 9);
  const resto = comResto ? ri(1, divisor - 1) : 0;
  const total = divisor * quociente + resto;

  if (nivel === 5) {
    // O resto decide: quantos veículos são precisos para levar todo mundo.
    // Sobrar gente exige mais um veículo — não "dois e sobra dois".
    const cenario = escolher(CENARIOS_RESTO);
    const necessarios = quociente + (resto > 0 ? 1 : 0);
    return {
      nivel, modo: "resto-decide", sentido: "medida", total, divisor, quociente, resto,
      exigeIdentificar: false, restoDecide: true,
      historia: `${total} ${cenario.objeto} e ${cenario.veiculo} de ${divisor} lugares. Quantas ${cenario.veiculo} são precisas?`,
      resposta: necessarios,
      opcoes: opcoes(necessarios, [
        // Parou no quociente e deixou a sobra de fora — a van que falta.
        { value: quociente, misconception: RM.CONFUNDE_RESTO },
        // Respondeu o resto em vez do que se pede.
        { value: resto, misconception: RM.CONFUNDE_RESTO },
        { value: necessarios + 1, misconception: RM.IGNORA_TAMANHO },
      ]),
    };
  }

  const historia = sentido === "particao"
    ? (() => {
        const c = escolher(CENARIOS_PARTICAO);
        return `${total} ${c.objeto} repartidas igualmente entre ${divisor} ${c.grupo}. Quantas para cada um?`;
      })()
    : (() => {
        const c = escolher(CENARIOS_MEDIDA);
        return `${total} ${c.objeto} em ${c.pacote} de ${divisor}. Quantos ${c.pacote}?`;
      })();

  return {
    nivel,
    modo: nivel === 1 ? "particao" : nivel === 2 ? "medida" : nivel === 3 ? "alternando" : "identificar",
    sentido,
    total,
    divisor,
    quociente,
    resto,
    exigeIdentificar: nivel === 4,
    restoDecide: false,
    historia,
    resposta: quociente,
    opcoes: opcoes(quociente, [
      // Respondeu o resto em vez do quociente: inverteu o que se pede.
      ...(resto > 0 ? [{ value: resto, misconception: RM.CONFUNDE_RESTO }] : []),
      // Não fixou o divisor: formou grupos do tamanho errado.
      { value: divisor, misconception: RM.IGNORA_TAMANHO },
      // Distribuiu desigual e aceitou: sobrou mais do que podia.
      { value: quociente + 1, misconception: RM.DIVISAO_DESIGUAL },
      { value: Math.max(1, quociente - 1), misconception: RM.DIVISAO_DESIGUAL },
    ]),
  };
}

export function construirRepartirMedirResolucao(spec: RepartirMedirF99Spec): ResolucaoDeclarativa<RepartirMedirShow, number, RepartirMedirMisconceptionTag> {
  const cena: RepartirMedirShow = { total: spec.total, divisor: spec.divisor, sentido: spec.sentido };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "qual-pergunta",
        say: spec.sentido === "particao"
          ? "Aqui você sabe quantos GRUPOS. O que falta é o tamanho de cada um."
          : "Aqui você sabe o TAMANHO do grupo. O que falta é quantos grupos dá.",
        show: cena,
        corrige: [RepartirMedirMisconception.IGNORA_TAMANHO],
        parcial: spec.divisor,
      },
      {
        id: "fazer",
        say: spec.sentido === "particao"
          ? "Distribua um a um, sempre igual, até acabar."
          : "Vá tirando grupos desse tamanho até não dar mais.",
        show: { ...cena, ...(spec.sentido === "particao" ? { distribuir: true } : { agrupar: true }) },
        corrige: [RepartirMedirMisconception.DIVISAO_DESIGUAL],
        parcial: spec.quociente,
      },
      {
        id: "o-que-sobra",
        say: spec.restoDecide
          ? "Sobrou gente? Então precisa de mais um — ninguém fica para trás."
          : "O que sobra é o resto, e não é ele que a pergunta pede.",
        show: cena,
        corrige: [RepartirMedirMisconception.CONFUNDE_RESTO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N4.05 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirRepartirMedirQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.05") throw new Error(`repartirMedirContract recebeu ${ficha.id}.`);
  const spec = construirRepartirMedirSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N4.05 sem micro L${spec.nivel}.`);

  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "repartir-medir-f99",
    prompt: spec.historia,
    audioPrompt: spec.historia,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirRepartirMedirResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // O sentido só é evidência onde o nível alterna entre os dois. Nos níveis
    // de sentido fixo, etiquetá-lo afirmaria um reconhecimento que o nível não
    // pediu — e o L5 é sempre medida, por definição do problema.
    ...(spec.nivel === 3 || spec.nivel === 4 ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.sentido) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
