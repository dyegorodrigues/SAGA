import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F55 / GM.04 — que horas são. A hora cheia e a meia hora.
 *
 * ## O escopo, e de onde ele vem
 *
 * A `DECISAO-001`, registrada no cabeçalho da ficha `GM.04.ts`, resolveu que
 * esta competência é a hora cheia e a meia hora; os minutos — quartos em diante
 * — são da `GM.06`. Este contrato é a escada dentro desse escopo, e não sai
 * dele em nível nenhum.
 *
 * ## Por que trava, segundo a própria ficha
 *
 * Dois ponteiros de tamanhos diferentes fazendo coisas diferentes, num
 * mostrador circular onde os números **não são o que a criança pensa**. E o
 * nível dois tem a dificuldade escondida: às três e meia, o ponteiro das horas
 * está **entre** o 3 e o 4. Quem aprendeu "aponta para o número" fica perdida,
 * e responde quatro e meia.
 *
 * `MEIA_HORA_ARREDONDA` é esse erro, e ele é o motivo de a meia hora ser um
 * nível próprio em vez de um caso a mais do primeiro.
 */
export const QueHorasSaoMisconception = {
  PONTEIRO_TROCADO: "ponteiro-trocado",
  MEIA_HORA_ARREDONDA: "meia-hora-arredonda",
} as const;
export type QueHorasSaoMisconceptionTag = typeof QueHorasSaoMisconception[keyof typeof QueHorasSaoMisconception];

export type QueHorasSaoModo = "hora-cheia" | "meia-hora" | "misturado" | "problema-de-horas" | "em-palavras";
export type FamiliaDoRelogio = "hora-cheia" | "meia-hora";

export interface QueHorasSaoF55Spec {
  nivel: number;
  modo: QueHorasSaoModo;
  horas: number;
  /** Zero ou trinta. Nunca outro valor: os minutos são da GM.06. */
  minutos: number;
  /** No nível do problema, quantas horas inteiras se avança. */
  avanco?: number;
  /** As horas de chegada, no nível do problema. */
  horasFinais?: number;
  familia: FamiliaDoRelogio;
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: QueHorasSaoMisconceptionTag }>;
}

interface QueHorasSaoShow {
  horas: number;
  minutos: number;
  destacarPonteiro?: "hora" | "minuto";
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const hhmm = (horas: number, minutos: number) => `${horas}:${String(minutos).padStart(2, "0")}`;
const proximaHora = (h: number) => (h === 12 ? 1 : h + 1);
const horaAnterior = (h: number) => (h === 1 ? 12 : h - 1);

/** Em palavras, como se fala: "três horas", "três e meia". */
export function porExtenso(horas: number, minutos: number): string {
  return minutos === 30 ? `${horas} e meia` : `${horas} horas`;
}

function opcoes(correta: string, erradas: Array<{ value: string; misconception: QueHorasSaoMisconceptionTag }>): QueHorasSaoF55Spec["opcoes"] {
  return [
    { value: correta, label: correta },
    ...erradas.map(x => ({ value: x.value, label: x.value, misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .slice(0, 4);
}

export function construirQueHorasSaoSpec(level: number, familiaPedida?: FamiliaDoRelogio): QueHorasSaoF55Spec {
  const nivel = clamp(level);
  const QM = QueHorasSaoMisconception;

  // A escada da família: L1 só hora cheia, L2 só meia hora, e do L3 em diante
  // as duas se misturam — que é onde a criança precisa OLHAR o ponteiro grande
  // em vez de supor.
  const familia: FamiliaDoRelogio = nivel === 1
    ? "hora-cheia"
    : nivel === 2
      ? "meia-hora"
      : familiaPedida ?? (Math.random() < 0.5 ? "hora-cheia" : "meia-hora");
  const horas = ri(1, 12);
  const minutos = familia === "meia-hora" ? 30 : 0;

  if (nivel === 4) {
    // Problema de tempo com horas INTEIRAS: avançar meia hora sairia do escopo
    // que a DECISAO-001 fixou para esta competência.
    const inicio = ri(1, 8);
    const avanco = ri(1, 4);
    const chegada = inicio + avanco;
    const resposta = hhmm(chegada, 0);
    return {
      nivel, modo: "problema-de-horas", horas: inicio, minutos: 0,
      avanco, horasFinais: chegada, familia: "hora-cheia", resposta,
      opcoes: opcoes(resposta, [
        // Contou uma hora a mais ou a menos.
        { value: hhmm(chegada + 1, 0), misconception: QM.MEIA_HORA_ARREDONDA },
        { value: hhmm(chegada - 1, 0), misconception: QM.MEIA_HORA_ARREDONDA },
        // Respondeu a hora de partida: não avançou nada.
        { value: hhmm(inicio, 0), misconception: QM.PONTEIRO_TROCADO },
      ]),
    };
  }

  if (nivel === 5) {
    // Ler em palavras. O auge da ficha, e ainda dentro do escopo.
    const resposta = porExtenso(horas, minutos);
    return {
      nivel, modo: "em-palavras", horas, minutos, familia, resposta,
      // As etiquetas seguem o caso, não a forma. Na meia hora, ler a hora
      // seguinte é o MEIA_HORA_ARREDONDA — o ponteiro pequeno está entre dois
      // números e ela pega o da frente. Na hora cheia esse erro não existe: ler
      // o vizinho ali é ter olhado o ponteiro errado, e é o que a etiqueta diz.
      opcoes: opcoes(resposta, minutos === 30
        ? [
            { value: porExtenso(proximaHora(horas), 30), misconception: QM.MEIA_HORA_ARREDONDA },
            { value: porExtenso(horas, 0), misconception: QM.PONTEIRO_TROCADO },
            { value: porExtenso(horaAnterior(horas), 30), misconception: QM.PONTEIRO_TROCADO },
          ]
        : [
            { value: porExtenso(horas, 30), misconception: QM.PONTEIRO_TROCADO },
            { value: porExtenso(proximaHora(horas), 0), misconception: QM.PONTEIRO_TROCADO },
            { value: porExtenso(horaAnterior(horas), 0), misconception: QM.PONTEIRO_TROCADO },
          ]),
    };
  }

  const resposta = hhmm(horas, minutos);
  return {
    nivel,
    modo: nivel === 1 ? "hora-cheia" : nivel === 2 ? "meia-hora" : "misturado",
    horas,
    minutos,
    familia,
    resposta,
    opcoes: opcoes(resposta, [
      // O erro do nível dois: às três e meia o ponteiro das horas está entre o
      // 3 e o 4, e quem aprendeu "aponta para o número" responde quatro e meia.
      { value: hhmm(proximaHora(horas), minutos), misconception: QM.MEIA_HORA_ARREDONDA },
      // Trocou os ponteiros: leu a meia hora onde era hora cheia, ou o
      // contrário.
      { value: hhmm(horas, minutos === 30 ? 0 : 30), misconception: QM.PONTEIRO_TROCADO },
      { value: hhmm(horaAnterior(horas), minutos), misconception: QM.PONTEIRO_TROCADO },
    ]),
  };
}

export function construirQueHorasSaoResolucao(spec: QueHorasSaoF55Spec): ResolucaoDeclarativa<QueHorasSaoShow, string, QueHorasSaoMisconceptionTag> {
  const cena: QueHorasSaoShow = { horas: spec.horas, minutos: spec.minutos };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "o-ponteiro-pequeno",
        say: "O ponteiro pequeno e grosso mostra a hora.",
        show: { ...cena, destacarPonteiro: "hora" },
        corrige: [QueHorasSaoMisconception.PONTEIRO_TROCADO],
        parcial: String(spec.horas),
      },
      {
        id: "o-ponteiro-grande",
        say: spec.minutos === 30
          ? "O ponteiro grande está no 6: é meia hora."
          : "O ponteiro grande está no 12: é hora cheia.",
        show: { ...cena, destacarPonteiro: "minuto" },
        corrige: [QueHorasSaoMisconception.MEIA_HORA_ARREDONDA],
        parcial: spec.resposta,
      },
      {
        id: "entre-dois-numeros",
        say: spec.minutos === 30
          ? "Na meia hora o ponteiro pequeno fica ENTRE dois números. Vale o que ficou para trás."
          : "Na hora cheia o ponteiro pequeno aponta direto para o número.",
        show: { ...cena, destacarPonteiro: "hora" },
        corrige: [QueHorasSaoMisconception.MEIA_HORA_ARREDONDA],
        parcial: spec.resposta,
      },
    ],
    // `fallback` é índice de passo, não valor de resposta.
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.04 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirQueHorasSaoQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.04") throw new Error(`queHorasSaoContract recebeu ${ficha.id}.`);
  const spec = construirQueHorasSaoSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.04 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "problema-de-horas"
    ? `Agora são ${spec.horas} horas. Daqui a ${spec.avanco} ${spec.avanco === 1 ? "hora" : "horas"}, que horas serão?`
    : spec.modo === "em-palavras"
      ? "Que horas são? Responda como se fala."
      : "Que horas o relógio mostra?";
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "que-horas-sao-f55",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirQueHorasSaoResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // A família só é evidência nos níveis que misturam as duas leituras. O L1 é
    // só hora cheia, o L2 só meia hora e o L4 é problema de horas inteiras:
    // nenhum deles põe a criança diante da escolha.
    ...(spec.nivel === 3 || spec.nivel === 5 ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => String(a) === spec.resposta,
  };
}
