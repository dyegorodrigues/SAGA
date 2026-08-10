import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { Question } from "../../types";
import { ModoMaterialDourado } from "./materialDouradoProcedure";

export interface MaterialDouradoSpec {
  nivel: number;
  modo: ModoMaterialDourado;
  /** Quantidade total representada/produzida. */
  total: number;
  dezenas: number;
  unidades: number;
  resposta: number;
  alvoNumeral: number;
  /** L1/L2: a moldura de dez organiza cada ciclo de troca. L3 retira o apoio. */
  usarMoldura: boolean;
  equivalencia: "10 unidades = 1 dezena";
  alternativas: number[];
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function construirAlternativas(total: number, dezenas: number, unidades: number): number[] {
  const invertido = unidades * 10 + dezenas;
  const candidatas = [
    total,
    dezenas + unidades,
    invertido,
    total - 1,
    total + 1,
  ].filter(valor => valor >= 0 && valor <= 99);
  return [...new Set(candidatas)].slice(0, 4);
}

export function construirMaterialDouradoSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): MaterialDouradoSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));

  let modo: ModoMaterialDourado;
  let total: number;
  let usarMoldura = false;

  switch (clamped) {
    case 1:
      modo = "agrupar";
      total = inteiro(10, 19, sorteio);
      usarMoldura = true;
      break;
    case 2:
      modo = "agrupar";
      total = inteiro(20, 39, sorteio);
      usarMoldura = true;
      break;
    case 3:
      modo = "agrupar";
      total = inteiro(10, 99, sorteio);
      usarMoldura = false;
      break;
    case 4:
      modo = "montar";
      total = inteiro(10, 99, sorteio);
      break;
    default:
      modo = "decompor";
      total = inteiro(10, 99, sorteio);
      break;
  }

  const dezenas = Math.floor(total / 10);
  const unidades = total % 10;

  const enunciado = modo === "agrupar"
    ? "Junte os cubinhos de dez em dez!"
    : modo === "montar"
      ? `Monte o número ${total} com dezenas e unidades.`
      : `${total} = quantas dezenas e quantas unidades?`;

  const falado = modo === "agrupar"
    ? "Junte os cubinhos de dez em dez!"
    : modo === "montar"
      ? `Monte o número ${total} com barras de dezena e cubinhos de unidade.`
      : `Decomponha ${total} em dezenas e unidades.`;

  return {
    nivel: clamped,
    modo,
    total,
    dezenas,
    unidades,
    resposta: total,
    alvoNumeral: total,
    usarMoldura,
    equivalencia: "10 unidades = 1 dezena",
    alternativas: construirAlternativas(total, dezenas, unidades),
    enunciado,
    falado,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N2.01 sem micro do nível ${nivel}.`);
  return micro;
}

/**
 * Specialized builder: F21 é transformação/manipulação, não o `tens` estático
 * antigo. O kind próprio mantém a conformidade capaz de distinguir os dois.
 */
export function construirDezenaUnidadesQuestion(
  ficha: FichaCompetencia,
  level: number,
): Question {
  if (ficha.id !== "N2.01") throw new Error(`materialDouradoContract recebeu ${ficha.id}.`);
  const spec = construirMaterialDouradoSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "material-dourado",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
    },
    ...(micro.dominio.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    answer: spec.total,
    evaluate: answer => Number(answer) === spec.total,
    options: undefined,
  };
}
