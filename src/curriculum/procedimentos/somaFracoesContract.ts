import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import type { FichaCompetencia } from "../schema";
import {
  SomaFracoesMisconception,
  type SomaFracoesMisconceptionTag,
} from "../../constants/somaFracoesMisconceptions";

export { SomaFracoesMisconception } from "../../constants/somaFracoesMisconceptions";
export type { SomaFracoesMisconceptionTag } from "../../constants/somaFracoesMisconceptions";

export type SomaFracoesModo =
  | "somar-barras"
  | "somar-simbolico"
  | "subtrair"
  | "fracao-impropria"
  | "simplificar";

export interface SomaFracoesOpcao extends Option {
  value: string;
  label: string;
  misconception?: SomaFracoesMisconceptionTag;
}

export interface SomaFracoesF74Spec {
  nivel: number;
  modo: SomaFracoesModo;
  primitivas: ["SingaporeBars"];
  denominadoresIguais: true;
  restricaoDominio: "sem-soma-denominador-precedente";
  operacao: "+" | "-";
  aNumerador: number;
  bNumerador: number;
  denominador: number;
  resultadoNumeradorBruto: number;
  resultadoBruto: string;
  resposta: string;
  opcoes: SomaFracoesOpcao[];
}

interface SomaFracoesShow {
  denominador: number;
  aNumerador?: number;
  bNumerador?: number;
  resultadoNumerador?: number;
  operacao?: "+" | "-";
  equivalencia?: [string, string];
  inteiroUltrapassado?: boolean;
}

const CASOS = [
  { modo: "somar-barras", operacao: "+", a: 1, b: 2, d: 4 },
  { modo: "somar-simbolico", operacao: "+", a: 2, b: 1, d: 5 },
  { modo: "subtrair", operacao: "-", a: 5, b: 2, d: 7 },
  { modo: "fracao-impropria", operacao: "+", a: 3, b: 2, d: 4 },
  { modo: "simplificar", operacao: "+", a: 2, b: 2, d: 8 },
] as const satisfies ReadonlyArray<{ modo: SomaFracoesModo; operacao: "+" | "-"; a: number; b: number; d: number }>;

function mdc(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function formatar(n: number, d: number): string {
  return `${n}/${d}`;
}

function simplificar(n: number, d: number): string {
  const divisor = mdc(n, d);
  return formatar(n / divisor, d / divisor);
}

function alternativas(spec: Omit<SomaFracoesF74Spec, "opcoes">): SomaFracoesOpcao[] {
  const numeradorErrado = Math.max(0, spec.resultadoNumeradorBruto - 1);
  const denominadorOperado = spec.denominador * 2;
  const candidatos: SomaFracoesOpcao[] = [
    { value: spec.resposta, label: spec.resposta },
    {
      value: formatar(spec.resultadoNumeradorBruto, denominadorOperado),
      label: formatar(spec.resultadoNumeradorBruto, denominadorOperado),
      misconception: SomaFracoesMisconception.SOMA_DENOMINADOR,
    },
    { value: formatar(numeradorErrado, spec.denominador), label: formatar(numeradorErrado, spec.denominador) },
  ];

  if (spec.modo === "fracao-impropria") {
    candidatos.splice(2, 0, {
      value: "invalida",
      label: "Não existe: passou de 1",
      misconception: SomaFracoesMisconception.IMPROPRIA_INVALIDA,
    });
  }
  if (spec.modo === "simplificar") {
    candidatos.splice(2, 0, {
      value: spec.resultadoBruto,
      label: spec.resultadoBruto,
      misconception: SomaFracoesMisconception.NAO_SIMPLIFICA,
    });
  }

  return candidatos.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index).slice(0, 4);
}

export function construirSomaFracoesF74Spec(level: number): SomaFracoesF74Spec {
  const nivel = Math.max(1, Math.min(5, Math.round(level)));
  const caso = CASOS[nivel - 1];
  const resultadoNumeradorBruto = caso.operacao === "+" ? caso.a + caso.b : caso.a - caso.b;
  const resultadoBruto = formatar(resultadoNumeradorBruto, caso.d);
  const resposta = caso.modo === "simplificar" ? simplificar(resultadoNumeradorBruto, caso.d) : resultadoBruto;
  const base: Omit<SomaFracoesF74Spec, "opcoes"> = {
    nivel,
    modo: caso.modo,
    primitivas: ["SingaporeBars"],
    denominadoresIguais: true,
    restricaoDominio: "sem-soma-denominador-precedente",
    operacao: caso.operacao,
    aNumerador: caso.a,
    bNumerador: caso.b,
    denominador: caso.d,
    resultadoNumeradorBruto,
    resultadoBruto,
    resposta,
  };
  return { ...base, opcoes: alternativas(base) };
}

export function construirSomaFracoesResolucao(
  spec: SomaFracoesF74Spec,
): ResolucaoDeclarativa<SomaFracoesShow, string, SomaFracoesMisconceptionTag> {
  const juntarOuRetirar = spec.operacao === "+" ? "junte" : "retire";
  const passos: Array<ResolucaoDeclarativa<SomaFracoesShow, string, SomaFracoesMisconceptionTag>["passos"][number]> = [
    {
      id: "fixar-tamanho-da-parte",
      say: `O inteiro continua dividido em ${spec.denominador} partes iguais. O denominador diz o tamanho da parte e não muda quando você ${juntarOuRetirar} partes.`,
      show: { denominador: spec.denominador, aNumerador: spec.aNumerador, bNumerador: spec.bNumerador, operacao: spec.operacao },
      corrige: [SomaFracoesMisconception.SOMA_DENOMINADOR],
      parcial: formatar(spec.aNumerador, spec.denominador),
    },
    {
      id: "operar-quantidade-de-partes",
      say: spec.operacao === "+"
        ? `Junte ${spec.aNumerador} partes com ${spec.bNumerador} partes do mesmo tamanho: ficam ${spec.resultadoNumeradorBruto} partes de tamanho ${spec.denominador}.`
        : `Retire ${spec.bNumerador} das ${spec.aNumerador} partes do mesmo tamanho: ficam ${spec.resultadoNumeradorBruto} partes de tamanho ${spec.denominador}.`,
      show: { denominador: spec.denominador, resultadoNumerador: spec.resultadoNumeradorBruto, operacao: spec.operacao },
      corrige: [SomaFracoesMisconception.SOMA_DENOMINADOR],
      parcial: spec.resultadoBruto,
    },
  ];

  if (spec.modo === "fracao-impropria") {
    passos.push({
      id: "aceitar-mais-de-um-inteiro",
      say: `${spec.resultadoBruto} significa ${spec.resultadoNumeradorBruto} partes de tamanho 1/${spec.denominador}. Ter mais partes que um inteiro não torna a fração inválida.`,
      show: { denominador: spec.denominador, resultadoNumerador: spec.resultadoNumeradorBruto, inteiroUltrapassado: true },
      corrige: [SomaFracoesMisconception.IMPROPRIA_INVALIDA],
      parcial: spec.resultadoBruto,
    });
  }
  if (spec.modo === "simplificar") {
    passos.push({
      id: "mesma-quantidade-outro-nome",
      say: `${spec.resultadoBruto} e ${spec.resposta} ocupam a mesma quantidade da mesma barra. Simplificar troca o nome da fração, não a quantidade.`,
      show: { denominador: spec.denominador, resultadoNumerador: spec.resultadoNumeradorBruto, equivalencia: [spec.resultadoBruto, spec.resposta] },
      corrige: [SomaFracoesMisconception.NAO_SIMPLIFICA],
      parcial: spec.resposta,
    });
  }

  return {
    estadoInicial: { denominador: spec.denominador, aNumerador: spec.aNumerador, bNumerador: spec.bNumerador, operacao: spec.operacao },
    passos,
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N5.04 sem micro L${nivel}`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirSomaFracoesQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N5.04") throw new Error(`somaFracoesContract recebeu ${ficha.id}`);
  const spec = construirSomaFracoesF74Spec(level);
  const simbolo = spec.operacao;
  const prompt = spec.modo === "simplificar"
    ? `Resolva ${spec.aNumerador}/${spec.denominador} ${simbolo} ${spec.bNumerador}/${spec.denominador} e dê a resposta simplificada.`
    : `Resolva ${spec.aNumerador}/${spec.denominador} ${simbolo} ${spec.bNumerador}/${spec.denominador}.`;
  return {
    kind: "soma-fracoes-f74",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    masteryRule: mastery(ficha, spec.nivel),
    resolucao: construirSomaFracoesResolucao(spec),
    uiProps: spec,
    options: spec.opcoes,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
