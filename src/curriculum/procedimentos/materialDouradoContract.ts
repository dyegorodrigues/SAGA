import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { Question } from "../../types";
import { ModoMaterialDourado } from "./materialDouradoProcedure";

export interface MaterialDouradoSpec {
  nivel: number;
  modo: ModoMaterialDourado;
  dezenas: number;
  unidades: number;
  resposta: number;
  alvoNumeral: number;
  /** L1: antes de responder, dez cubinhos precisam virar uma barra. */
  exigeTroca: boolean;
  equivalencia: "10 unidades = 1 dezena";
  alternativas: number[];
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  return min + Math.floor(sorteio() * (max - min + 1));
}

function alternativas(dezenas: number, unidades: number): number[] {
  const correta = dezenas * 10 + unidades;
  const candidatas = [
    correta,
    unidades, // IGNORA_DEZENA
    dezenas * 100 + unidades, // CONCATENA: 3 dezenas + 4 unidades → 304
    correta - 1,
    correta + 1,
  ].filter(valor => valor >= 0);
  return [...new Set(candidatas)].slice(0, 4);
}

export function construirMaterialDouradoSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): MaterialDouradoSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  let modo: ModoMaterialDourado;
  let dezenas: number;
  let unidades: number;

  if (clamped === 1) {
    modo = "ler";
    dezenas = 1;
    unidades = inteiro(1, 9, sorteio);
  } else if (clamped === 2) {
    modo = "ler";
    dezenas = inteiro(2, 5, sorteio);
    unidades = inteiro(0, 9, sorteio);
  } else if (clamped === 3) {
    modo = "ler";
    dezenas = inteiro(1, 9, sorteio);
    unidades = inteiro(0, 9, sorteio);
  } else if (clamped === 4) {
    modo = "produzir";
    dezenas = inteiro(1, 9, sorteio);
    unidades = inteiro(0, 9, sorteio);
  } else {
    modo = sorteio() < 0.5 ? "ler" : "produzir";
    dezenas = inteiro(1, 9, sorteio);
    unidades = inteiro(0, 9, sorteio);
  }

  const resposta = dezenas * 10 + unidades;
  const exigeTroca = clamped === 1;
  return {
    nivel: clamped,
    modo,
    dezenas,
    unidades,
    resposta,
    alvoNumeral: resposta,
    exigeTroca,
    equivalencia: "10 unidades = 1 dezena",
    alternativas: alternativas(dezenas, unidades),
    enunciado: modo === "produzir"
      ? `Monte o número ${resposta} com dezenas e unidades.`
      : exigeTroca
        ? "Junte dez cubinhos para formar uma dezena. Depois descubra o número."
        : `Tenho ${dezenas} ${dezenas === 1 ? "dezena" : "dezenas"} e ${unidades} ${unidades === 1 ? "unidade" : "unidades"}. Que número é?`,
    falado: modo === "produzir"
      ? `Monte o número ${resposta} com barras de dezena e cubinhos de unidade.`
      : exigeTroca
        ? "Junte dez unidades. Quando completar dez, elas viram uma dezena. Depois descubra o número."
        : `Tenho ${dezenas} ${dezenas === 1 ? "dezena" : "dezenas"} e ${unidades} ${unidades === 1 ? "unidade" : "unidades"}. Que número é?`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N2.01 sem micro do nível ${nivel}.`);
  return micro;
}

/** Specialized builder: F21 é transformação/manipulação, não `tens` estático. */
export function construirDezenaUnidadesQuestion(
  ficha: FichaCompetencia,
  level: number,
): Question {
  if (ficha.id !== "N2.01") throw new Error(`materialDouradoContract recebeu ${ficha.id}.`);
  const spec = construirMaterialDouradoSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "tens",
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
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
    // O palco autoral responde. Duplicar `options` aqui faria a tela ter dois
    // boundaries concorrentes e perderia a ação que o diagnóstico precisa.
    options: undefined,
  };
}
