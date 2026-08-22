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

export function construirHorasMinutosSpec(level: number): HorasMinutosF62Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    nivel, modo: "meia-hora-quartos", primitivas: ["Relogio", "NumberLine"], horario: { horas: 3, minutos: 30 },
    intervaloMinutos: 15, numeracaoFantasma: true, saltosHorasAntesDosMinutos: false, resposta: 30,
    opcoes: options(30, [{ value: 6, misconception: HorasMinutosMisconception.MINUTO_COMO_NUMERO }, { value: 45, misconception: HorasMinutosMisconception.SUBTRAI_DECIMAL }]),
  };
  if (nivel === 2) return {
    nivel, modo: "cinco-em-cinco-com-apoio", primitivas: ["Relogio", "NumberLine"], horario: { horas: 4, minutos: 25 },
    intervaloMinutos: 5, numeracaoFantasma: true, saltosHorasAntesDosMinutos: false, resposta: 25,
    opcoes: options(25, [{ value: 5, misconception: HorasMinutosMisconception.MINUTO_COMO_NUMERO }, { value: 20, misconception: HorasMinutosMisconception.SUBTRAI_DECIMAL }]),
  };
  if (nivel === 3) return {
    nivel, modo: "cinco-em-cinco", primitivas: ["Relogio", "NumberLine"], horario: { horas: 7, minutos: 40 },
    intervaloMinutos: 5, numeracaoFantasma: false, saltosHorasAntesDosMinutos: false, resposta: 40,
    opcoes: options(40, [{ value: 8, misconception: HorasMinutosMisconception.MINUTO_COMO_NUMERO }, { value: 35, misconception: HorasMinutosMisconception.SUBTRAI_DECIMAL }]),
  };
  if (nivel === 4) return {
    nivel, modo: "minuto-a-minuto", primitivas: ["Relogio", "NumberLine"], horario: { horas: 2, minutos: 17 },
    intervaloMinutos: 1, numeracaoFantasma: false, saltosHorasAntesDosMinutos: false, resposta: 17,
    opcoes: options(17, [{ value: 3, misconception: HorasMinutosMisconception.MINUTO_COMO_NUMERO }, { value: 20, misconception: HorasMinutosMisconception.SUBTRAI_DECIMAL }]),
  };
  return {
    nivel, modo: "duracao", primitivas: ["Relogio", "NumberLine"], horario: { horas: 9, minutos: 35 },
    intervaloMinutos: 5, numeracaoFantasma: false, duracao: { inicio: "09:35", fim: "10:50", minutos: 75 },
    saltosHorasAntesDosMinutos: true, resposta: 75,
    opcoes: options(75, [
      { value: 15, misconception: HorasMinutosMisconception.IGNORA_HORA_NA_DURACAO },
      { value: 115, misconception: HorasMinutosMisconception.SUBTRAI_DECIMAL },
      { value: 50, misconception: HorasMinutosMisconception.MINUTO_COMO_NUMERO },
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
