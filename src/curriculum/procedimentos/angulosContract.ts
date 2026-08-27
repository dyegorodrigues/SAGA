import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const AngulosMisconception = {
  ANGULO_PELO_LADO: "angulo-pelo-lado",
  CONFUNDE_AGUDO_OBTUSO: "confunde-agudo-obtuso",
  TRANSFERIDOR_INVERTIDO: "transferidor-invertido",
} as const;
export type AngulosMisconceptionTag = typeof AngulosMisconception[keyof typeof AngulosMisconception];
export type AngulosModo = "classificar" | "comparar" | "lados-diferentes" | "medir-graus" | "poligonos";

export interface AngulosF78Spec {
  nivel: number;
  modo: AngulosModo;
  anguloA: number;
  anguloB?: number;
  ladoA?: number;
  ladoB?: number;
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: AngulosMisconceptionTag }>;
}
interface AngulosShow { anguloA: number; anguloB?: number; destacarArco?: boolean; esticarLado?: boolean; mostrarGraus?: boolean; }

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const tipo = (g: number) => g === 90 ? "reto" : g < 90 ? "agudo" : "obtuso";
function options(correta: string | number, erradas: Array<{ value: string | number; misconception: AngulosMisconceptionTag }>): AngulosF78Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(item => ({ ...item, label: String(item.value) }))]
    .filter((item, i, all) => all.findIndex(other => other.value === item.value) === i).slice(0, 4);
}

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/** Uma abertura do tipo pedido, sempre em passos de cinco graus. */
function anguloDoTipo(qual: "agudo" | "reto" | "obtuso"): number {
  if (qual === "reto") return 90;
  return qual === "agudo" ? ri(3, 17) * 5 : ri(19, 34) * 5;
}

/**
 * CLASS-003 — a abertura é sorteada, a escada não.
 *
 * O ângulo era sempre o mesmo: 45°, 65 contra 120, 55 contra 105, 40° e 120°.
 * As respostas certas eram "agudo", "B", "B", 40 e "obtuso", para sempre.
 *
 * O degrau continua sendo o que o nível pergunta: classificar a abertura,
 * comparar duas, comparar quando os lados têm comprimentos diferentes, medir em
 * graus, e classificar o ângulo de um polígono.
 */
export function construirAngulosSpec(level: number): AngulosF78Spec {
  const nivel = clamp(level);

  // Classificar a abertura desenhada — em L1 solta, em L5 dentro de um polígono.
  if (nivel === 1 || nivel === 5) {
    const anguloA = anguloDoTipo(escolher(["agudo", "reto", "obtuso"] as const));
    // A resposta sai do desenho, não do sorteio: se o traço e o rótulo viessem
    // de dois lugares, uma mudança num deles faria a tela mentir.
    const qual = tipo(anguloA);
    const outros = (["agudo", "reto", "obtuso"] as const).filter(item => item !== qual);
    return {
      nivel, modo: nivel === 1 ? "classificar" : "poligonos", anguloA, resposta: qual,
      opcoes: options(qual, [
        { value: outros[0], misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
        { value: outros[1], misconception: nivel === 1 ? AngulosMisconception.CONFUNDE_AGUDO_OBTUSO : AngulosMisconception.TRANSFERIDOR_INVERTIDO },
      ]),
    };
  }

  if (nivel === 2 || nivel === 3) {
    // Uma abertura pequena e uma grande, e qual delas se chama A é sorteado:
    // deixar a maior sempre em B faria a resposta ser sempre "B".
    const menor = ri(5, 16) * 5;
    const maior = ri(Math.floor(menor / 5) + 3, 34) * 5;
    const maiorEhA = Math.random() < 0.5;
    const anguloA = maiorEhA ? maior : menor;
    const anguloB = maiorEhA ? menor : maior;
    const resposta = maiorEhA ? "A" : "B";
    if (nivel === 2) {
      return { nivel, modo: "comparar", anguloA, anguloB, resposta, opcoes: options(resposta, [
        { value: maiorEhA ? "B" : "A", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
        { value: "iguais", misconception: AngulosMisconception.ANGULO_PELO_LADO },
      ]) };
    }
    // L3 existe para desmentir "o lado mais comprido é o ângulo maior": o
    // ângulo MAIOR recebe o lado mais CURTO. Sem isso, quem julga pelo desenho
    // acerta, e o distrator ANGULO_PELO_LADO fica na tela sem nomear ninguém.
    const ladoCurto = ri(60, 85);
    const ladoLongo = ri(120, 150);
    return {
      nivel, modo: "lados-diferentes", anguloA, anguloB,
      ladoA: maiorEhA ? ladoCurto : ladoLongo,
      ladoB: maiorEhA ? ladoLongo : ladoCurto,
      resposta,
      opcoes: options(resposta, [
        { value: maiorEhA ? "B" : "A", misconception: AngulosMisconception.ANGULO_PELO_LADO },
        { value: "iguais", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
      ]),
    };
  }

  // Medir em graus. O reto fica de fora: 90° faria o distrator do ângulo reto
  // virar a resposta, e o suplemento cairia em cima dela.
  let anguloA = ri(3, 34) * 5;
  while (anguloA === 90 || anguloA === 85 || anguloA === 80) anguloA = ri(3, 34) * 5;
  return { nivel, modo: "medir-graus", anguloA, resposta: anguloA, opcoes: options(anguloA, [
    { value: 180 - anguloA, misconception: AngulosMisconception.TRANSFERIDOR_INVERTIDO },
    { value: 90, misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
    { value: anguloA + 10, misconception: AngulosMisconception.ANGULO_PELO_LADO },
  ]) };
}

export function construirAngulosResolucao(spec: AngulosF78Spec): ResolucaoDeclarativa<AngulosShow, string | number, AngulosMisconceptionTag> {
  return {
    estadoInicial: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}) },
    passos: [
      { id: "ver-abertura", say: "Olhe a abertura junto ao vértice.", show: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}), destacarArco: true }, corrige: [AngulosMisconception.CONFUNDE_AGUDO_OBTUSO], parcial: spec.resposta },
      { id: "ignorar-comprimento", say: "Esticar os lados não muda o giro.", show: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}), destacarArco: true, esticarLado: true, mostrarGraus: spec.nivel >= 4 }, corrige: [AngulosMisconception.ANGULO_PELO_LADO, AngulosMisconception.TRANSFERIDOR_INVERTIDO], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}
function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}
export function construirAngulosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.06") throw new Error(`angulosContract recebeu ${ficha.id}.`);
  const spec = construirAngulosSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.06 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "classificar" ? "Este ângulo é agudo, reto ou obtuso?"
    : spec.modo === "comparar" || spec.modo === "lados-diferentes" ? "Qual abertura é maior: A ou B?"
      : spec.modo === "medir-graus" ? "Quantos graus mede esta abertura?"
        : "Como é este ângulo do polígono?";
  const options: Option[] = spec.opcoes;
  return { kind: "angulos-f78", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirAngulosResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec,
    options, answer: spec.resposta, evaluate: answer => String(answer) === String(spec.resposta) };
}
