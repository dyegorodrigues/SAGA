import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { Evidencia } from "../../constants/evidencias";
import { EstatisticaChanceMisconception, type EstatisticaChanceMisconceptionTag } from "../../constants/estatisticaChanceMisconceptions";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export type EstatisticaChanceModo = "certo-possivel-impossivel" | "mais-menos-provavel" | "chance-fracao" | "frequencia-independencia" | "contar-possibilidades";

export interface EstatisticaChanceF95Spec {
  ficha: "F95";
  nivel: number;
  modo: EstatisticaChanceModo;
  primitivas: ["SingaporeBars", "ArrayGrid"];
  acessibilidade: { toqueAlternativo: true; semArrastoObrigatorio: true; alvoMinPx: 80; erroMotorNaoTag: true };
  favoraveis: number;
  total: number;
  historico?: string[];
  grade?: { linhas: number; colunas: number; rotulosLinhas: string[]; rotulosColunas: string[] };
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: EstatisticaChanceMisconceptionTag }>;
}

type Show = Pick<EstatisticaChanceF95Spec, "modo" | "favoraveis" | "total" | "historico" | "grade"> & { destaque: string };

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = { toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true } as const;
function opts(correta: string | number, erradas: Array<{ value: string | number; misconception?: EstatisticaChanceMisconceptionTag }>): EstatisticaChanceF95Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(x => ({ ...x, label: String(x.value) }))]
    .filter((x, i, a) => a.findIndex(y => String(y.value) === String(x.value)) === i)
    .slice(0, 4);
}

export function construirEstatisticaChanceF95Spec(level: number): EstatisticaChanceF95Spec {
  const nivel = clamp(level);
  const base = { ficha: "F95" as const, nivel, primitivas: ["SingaporeBars", "ArrayGrid"] as ["SingaporeBars", "ArrayGrid"], acessibilidade };
  if (nivel === 1) return {
    ...base, modo: "certo-possivel-impossivel", favoraveis: 6, total: 6, resposta: "certo",
    opcoes: opts("certo", [{ value: "possível", misconception: EstatisticaChanceMisconception.TUDO_CINQUENTA }, { value: "impossível" }]),
  };
  if (nivel === 2) return {
    ...base, modo: "mais-menos-provavel", favoraveis: 4, total: 6, resposta: "Saco B",
    opcoes: opts("Saco B", [{ value: "Saco A", misconception: EstatisticaChanceMisconception.TUDO_CINQUENTA }, { value: "iguais" }]),
  };
  if (nivel === 3) return {
    ...base, modo: "chance-fracao", favoraveis: 3, total: 5, resposta: "3/5",
    opcoes: opts("3/5", [{ value: "3/3", misconception: EstatisticaChanceMisconception.IGNORA_TOTAL }, { value: "5/3", misconception: EstatisticaChanceMisconception.IGNORA_TOTAL }]),
  };
  if (nivel === 4) return {
    ...base, modo: "frequencia-independencia", favoraveis: 1, total: 2, historico: ["cara", "cara", "cara", "cara", "coroa"], resposta: "continua 1/2",
    opcoes: opts("continua 1/2", [{ value: "agora coroa é mais provável", misconception: EstatisticaChanceMisconception.FALACIA_APOSTADOR }, { value: "agora cara é mais provável", misconception: EstatisticaChanceMisconception.FALACIA_APOSTADOR }]),
  };
  return {
    ...base, modo: "contar-possibilidades", favoraveis: 6, total: 6,
    grade: { linhas: 3, colunas: 2, rotulosLinhas: ["camisa A", "camisa B", "camisa C"], rotulosColunas: ["calça 1", "calça 2"] },
    resposta: 6,
    opcoes: opts(6, [{ value: 5 }, { value: 3, misconception: EstatisticaChanceMisconception.IGNORA_TOTAL }, { value: 2 }]),
  };
}

export function evidenciasEstatisticaChanceF95(spec: EstatisticaChanceF95Spec, correta: boolean): string[] {
  return correta && spec.modo === "chance-fracao" ? [Evidencia.CHANCE_FRACAO_F95] : [];
}

export function construirEstatisticaChanceResolucao(spec: EstatisticaChanceF95Spec): ResolucaoDeclarativa<Show, string | number, EstatisticaChanceMisconceptionTag> {
  const show: Show = { modo: spec.modo, favoraveis: spec.favoraveis, total: spec.total, historico: spec.historico, grade: spec.grade, destaque: "favoraveis-sobre-total" };
  const say = spec.modo === "certo-possivel-impossivel"
    ? "Compare os resultados possíveis: certo acontece em todos, impossível em nenhum, e possível em parte deles."
    : spec.modo === "mais-menos-provavel"
      ? "O evento mais provável tem mais casos favoráveis em relação ao total de resultados."
      : spec.modo === "chance-fracao"
        ? "Escreva a chance como fração: casos favoráveis em cima e total de resultados embaixo."
        : spec.modo === "frequencia-independencia"
          ? "A frequência do histórico pode oscilar; em eventos independentes, o próximo resultado continua com a mesma chance, e no longo prazo a frequência se aproxima da expectativa."
          : "Organize as combinações numa grade: linhas vezes colunas dão o produto de possibilidades sem repetir nem esquecer casos.";
  return { estadoInicial: show, passos: [{ id: "contar", say, show, corrige: Object.values(EstatisticaChanceMisconception), parcial: spec.resposta }], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): { micro: FichaCompetencia["micros"][number]; rule: MasteryRule } {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.04 sem micro L${nivel}.`);
  return { micro, rule: { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes } };
}

export function construirEstatisticaChanceQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.04") throw new Error(`estatisticaChanceContract recebeu ${ficha.id}.`);
  const spec = construirEstatisticaChanceF95Spec(level);
  const { micro, rule } = mastery(ficha, spec.nivel);
  const prompt = spec.modo === "certo-possivel-impossivel" ? "Se uma caixa contém apenas fichas azuis, tirar uma ficha azul é certo, possível ou impossível?"
    : spec.modo === "mais-menos-provavel" ? "Qual saco é mais provável de dar uma ficha marcada: A com 2 de 6 ou B com 4 de 6?"
    : spec.modo === "chance-fracao" ? "Há 3 resultados favoráveis entre 5 resultados possíveis. Qual fração representa essa chance?"
    : spec.modo === "frequencia-independencia" ? "Depois desse histórico de moeda justa, qual é a chance de cara na próxima jogada?"
    : "Com 3 camisas e 2 calças, quantas combinações diferentes podem ser formadas?";
  const options: Option[] = spec.opcoes;
  return {
    kind: "estatistica-chance-f95",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirEstatisticaChanceResolucao(spec),
    masteryRule: rule,
    exigeEvidencia: micro.dominio.exige?.evidencia,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => String(a) === String(spec.resposta),
  };
}
