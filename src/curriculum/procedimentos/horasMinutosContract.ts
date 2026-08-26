import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const HorasMinutosMisconception = {
  MINUTO_COMO_NUMERO: "minuto-como-numero",
  IGNORA_HORA_NA_DURACAO: "ignora-hora-na-duracao",
  SUBTRAI_DECIMAL: "subtrai-decimal",
} as const;
export type HorasMinutosMisconceptionTag = typeof HorasMinutosMisconception[keyof typeof HorasMinutosMisconception];
export type HorasMinutosModo = "meia-hora-quartos" | "cinco-em-cinco-com-apoio" | "cinco-em-cinco" | "minuto-a-minuto" | "duracao";

export interface HorarioF62 { horas: number; minutos: number; }
export interface DuracaoF62 { inicio: string; fim: string; minutos: number; }
export interface HorasMinutosF62Spec {
  nivel: number;
  modo: HorasMinutosModo;
  primitivas: ["Relogio", "NumberLine"];
  horario: HorarioF62;
  intervaloMinutos: number;
  numeracaoFantasma: boolean;
  duracao?: DuracaoF62;
  saltosHorasAntesDosMinutos: boolean;
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: HorasMinutosMisconceptionTag }>;
}

interface HorasMinutosShow {
  horario: HorarioF62;
  duracao?: DuracaoF62;
  intervaloMinutos: number;
  numeracaoFantasma: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const options = (correta: number, erradas: Array<{ value: number; label?: string; misconception: HorasMinutosMisconceptionTag }>): HorasMinutosF62Spec["opcoes"] => [
  { value: correta, label: `${correta} min` },
  ...erradas.map(x => ({ value: x.value, label: x.label ?? `${x.value} min`, misconception: x.misconception })),
].filter((x, i, a) => a.findIndex(y => y.value === x.value) === i).slice(0, 4);

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];
const hhmm = (horas: number, minutos: number) => `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

/**
 * CLASS-003 — o relógio do nível é sorteado, a escada não.
 *
 * Marcava sempre a mesma hora: 3h30, 4h25, 7h40, 2h17 e a duração 9:35→10:50.
 * Decorar "30" vencia L1 sem ler ponteiro nenhum.
 *
 * O passo do minuto é o degrau, e continua fixo: quartos de hora em L1, cinco
 * em cinco em L2 e L3, minuto a minuto em L4. Em L4 o minuto sorteado NÃO cai
 * na marca de cinco — se caísse, o nível viraria uma repetição de L3.
 */
export function construirHorasMinutosSpec(level: number): HorasMinutosF62Spec {
  const nivel = clamp(level);
  const primitivas = ["Relogio", "NumberLine"] as ["Relogio", "NumberLine"];
  const HM = HorasMinutosMisconception;

  if (nivel <= 4) {
    const horas = ri(1, 12);
    const minutos = nivel === 1 ? escolher([15, 30, 45] as const)
      : nivel === 4 ? escolher([2, 3, 7, 8, 12, 13, 17, 18, 22, 23, 27, 28, 37, 43, 47, 52, 58] as const)
      : ri(1, 11) * 5;
    const intervaloMinutos = nivel === 1 ? 15 : nivel === 4 ? 1 : 5;
    // Ler o ponteiro como se fosse o número da hora: 30 minutos vira "6".
    const comoNumero = Math.max(1, Math.round(minutos / 5));
    // Vizinho no passo do nível: o erro de contar uma marca a mais ou a menos.
    // Se o vizinho cair em cima do "leu como número" — acontece nos minutos
    // baixos de L4 —, anda mais um passo: duas alternativas iguais apagariam
    // um dos dois erros que a ficha nomeia.
    let vizinho = minutos - intervaloMinutos > 0 ? minutos - intervaloMinutos : minutos + intervaloMinutos;
    if (vizinho === comoNumero || vizinho === minutos) vizinho = minutos + intervaloMinutos * 2;
    return {
      nivel,
      modo: nivel === 1 ? "meia-hora-quartos" : nivel === 2 ? "cinco-em-cinco-com-apoio" : nivel === 3 ? "cinco-em-cinco" : "minuto-a-minuto",
      primitivas,
      horario: { horas, minutos },
      intervaloMinutos,
      numeracaoFantasma: nivel <= 2,
      saltosHorasAntesDosMinutos: false,
      resposta: minutos,
      opcoes: options(minutos, [
        { value: comoNumero, misconception: HM.MINUTO_COMO_NUMERO },
        { value: vizinho, misconception: HM.SUBTRAI_DECIMAL },
      ]),
    };
  }

  // L5: a duração precisa atravessar a hora — é o que o nível ensina.
  const horas = ri(1, 10);
  const minutos = ri(1, 11) * 5;
  const duracaoMinutos = ri(13, 23) * 5;
  const fimTotal = horas * 60 + minutos + duracaoMinutos;
  const fim = { horas: Math.floor(fimTotal / 60), minutos: fimTotal % 60 };
  // Tratar hh:mm como decimal: 1h15 vira "115".
  const comoDecimal = Math.floor(duracaoMinutos / 60) * 100 + duracaoMinutos % 60;
  return {
    nivel,
    modo: "duracao",
    primitivas,
    horario: { horas, minutos },
    intervaloMinutos: 5,
    numeracaoFantasma: false,
    duracao: { inicio: hhmm(horas, minutos), fim: hhmm(fim.horas, fim.minutos), minutos: duracaoMinutos },
    saltosHorasAntesDosMinutos: true,
    resposta: duracaoMinutos,
    opcoes: options(duracaoMinutos, [
      { value: duracaoMinutos % 60, misconception: HM.IGNORA_HORA_NA_DURACAO },
      { value: comoDecimal, misconception: HM.SUBTRAI_DECIMAL },
      { value: fim.minutos, misconception: HM.MINUTO_COMO_NUMERO },
    ]),
  };
}

export function construirHorasMinutosResolucao(spec: HorasMinutosF62Spec): ResolucaoDeclarativa<HorasMinutosShow, number, HorasMinutosMisconceptionTag> {
  const show: HorasMinutosShow = { horario: spec.horario, duracao: spec.duracao, intervaloMinutos: spec.intervaloMinutos, numeracaoFantasma: spec.numeracaoFantasma };
  return { estadoInicial: show, passos: [
    { id: "cinco-em-cinco", say: "No ponteiro dos minutos, cada número do mostrador vale cinco minutos.", show, corrige: [HorasMinutosMisconception.MINUTO_COMO_NUMERO], parcial: spec.horario.minutos },
    { id: "hora-inteira", say: "Se o intervalo atravessa uma hora, conte primeiro a hora inteira: ela vale sessenta minutos.", show, corrige: [HorasMinutosMisconception.IGNORA_HORA_NA_DURACAO, HorasMinutosMisconception.SUBTRAI_DECIMAL], parcial: spec.duracao ? 60 : spec.horario.minutos },
    { id: "reta-tempo", say: "Depois complete os minutos restantes na reta de tempo e some os saltos.", show, corrige: [HorasMinutosMisconception.IGNORA_HORA_NA_DURACAO, HorasMinutosMisconception.SUBTRAI_DECIMAL], parcial: spec.resposta },
  ], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirHorasMinutosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.06") throw new Error(`horasMinutosContract recebeu ${ficha.id}.`);
  const spec = construirHorasMinutosSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.06 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "duracao"
    ? `Quanto tempo passou de ${spec.duracao?.inicio} até ${spec.duracao?.fim}?`
    : "Observe o relógio. Quantos minutos o ponteiro grande marca?";
  const options: Option[] = spec.opcoes;
  return {
    kind: "horas-minutos-f62", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirHorasMinutosResolucao(spec), masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec, options, answer: spec.resposta, evaluate: a => Number(a) === spec.resposta,
  };
}
