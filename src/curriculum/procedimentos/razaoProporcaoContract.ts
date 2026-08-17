import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import {
  RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA,
  RazaoProporcaoMisconception,
  type RazaoProporcaoMisconceptionTag,
} from "../../constants/razaoProporcaoMisconceptions";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { RazaoProporcaoMisconception } from "../../constants/razaoProporcaoMisconceptions";
export type { RazaoProporcaoMisconceptionTag } from "../../constants/razaoProporcaoMisconceptions";

export type RazaoProporcaoF88Modo = "dobrar" | "triplicar" | "escala-geral" | "razao-fracao" | "regra-de-tres";

export interface RazaoProporcaoF88Opcao extends Option {
  value: string;
  label: string;
  misconception?: RazaoProporcaoMisconceptionTag;
}

export interface RazaoProporcaoF88Spec {
  ficha: "F88";
  nivel: number;
  modo: RazaoProporcaoF88Modo;
  primitivas: ["SingaporeBars"];
  barrasVinculadas: true;
  baseA: number;
  baseB: number;
  fatorEscala: number;
  alvoA: number;
  alvoB: number;
  fatorConhecidoAntes: boolean;
  escalaNaoInteira: boolean;
  resposta: string;
  opcoes: RazaoProporcaoF88Opcao[];
  acessibilidade: {
    toqueAlternativo: true;
    alvoMinPx: 80;
    erroMotorNaoTag: true;
  };
}

interface RazaoProporcaoF88Show {
  baseA: number;
  baseB: number;
  fator?: number;
  alvoA?: number;
  alvoB?: number;
  razao?: string;
  regraDeTres?: boolean;
}

type CasoF88 = { baseA: number; baseB: number; fator: number; alvoA?: number };

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = { toqueAlternativo: true as const, alvoMinPx: 80 as const, erroMotorNaoTag: true as const };

function escolher<T>(itens: readonly T[], rng: () => number): T {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(safe * itens.length)] ?? itens[0];
}

function normalizar(n: number): number {
  return Number(n.toFixed(6));
}

function numero(n: number): string {
  return String(normalizar(n));
}

function rotuloNumero(n: number): string {
  return numero(n).replace(".", ",");
}

function par(a: number, b: number): string {
  return `${numero(a)}|${numero(b)}`;
}

function rotuloPar(a: number, b: number): string {
  return `${rotuloNumero(a)} e ${rotuloNumero(b)}`;
}

function opcoes(
  correta: { value: string; label: string },
  soma: { value: string; label: string },
  umLado: { value: string; label: string },
  invertida: { value: string; label: string },
): RazaoProporcaoF88Opcao[] {
  const candidatas: RazaoProporcaoF88Opcao[] = [
    correta,
    { ...soma, misconception: RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR },
    { ...umLado, misconception: RazaoProporcaoMisconception.ESCALA_UM_LADO },
    { ...invertida, misconception: RazaoProporcaoMisconception.INVERTE_RAZAO },
  ];
  const unicas = candidatas.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index);
  if (unicas.length !== 4) throw new Error("F88 gerou alternativas colidentes; o espaço diagnóstico precisa preservar as três misconceptions.");
  return unicas;
}

const CASOS: Record<number, readonly CasoF88[]> = {
  1: [
    { baseA: 2, baseB: 3, fator: 2 },
    { baseA: 3, baseB: 4, fator: 2 },
    { baseA: 4, baseB: 5, fator: 2 },
  ],
  2: [
    { baseA: 2, baseB: 5, fator: 3 },
    { baseA: 3, baseB: 4, fator: 3 },
    { baseA: 4, baseB: 7, fator: 3 },
  ],
  3: [
    { baseA: 4, baseB: 6, fator: 1.5 },
    { baseA: 6, baseB: 8, fator: 1.5 },
    { baseA: 4, baseB: 10, fator: 2.5 },
  ],
  4: [
    { baseA: 2, baseB: 3, fator: 2 },
    { baseA: 3, baseB: 5, fator: 2 },
    { baseA: 4, baseB: 7, fator: 2 },
  ],
  5: [
    { baseA: 4, baseB: 6, fator: 2.5, alvoA: 10 },
    { baseA: 3, baseB: 5, fator: 4, alvoA: 12 },
    { baseA: 6, baseB: 9, fator: 7 / 3, alvoA: 14 },
  ],
};

export function construirRazaoProporcaoF88Spec(level: number, rng: () => number = Math.random): RazaoProporcaoF88Spec {
  const nivel = clamp(level);
  const modo: RazaoProporcaoF88Modo = ["dobrar", "triplicar", "escala-geral", "razao-fracao", "regra-de-tres"][nivel - 1] as RazaoProporcaoF88Modo;
  const caso = escolher(CASOS[nivel], rng);
  const fatorEscala = normalizar(caso.fator);
  const alvoA = normalizar(caso.alvoA ?? caso.baseA * fatorEscala);
  const alvoB = normalizar(caso.baseB * fatorEscala);
  const fatorConhecidoAntes = nivel <= 3;
  const escalaNaoInteira = !Number.isInteger(fatorEscala);

  let resposta: string;
  let alternativas: RazaoProporcaoF88Opcao[];
  if (nivel <= 3) {
    resposta = par(alvoA, alvoB);
    alternativas = opcoes(
      { value: resposta, label: rotuloPar(alvoA, alvoB) },
      { value: par(caso.baseA + fatorEscala, caso.baseB + fatorEscala), label: rotuloPar(caso.baseA + fatorEscala, caso.baseB + fatorEscala) },
      { value: par(alvoA, caso.baseB), label: rotuloPar(alvoA, caso.baseB) },
      { value: par(alvoB, alvoA), label: rotuloPar(alvoB, alvoA) },
    );
  } else if (nivel === 4) {
    resposta = `${numero(caso.baseA)}/${numero(caso.baseB)}`;
    alternativas = opcoes(
      { value: resposta, label: resposta },
      { value: `${numero(caso.baseA + fatorEscala)}/${numero(caso.baseB + fatorEscala)}`, label: `${numero(caso.baseA + fatorEscala)}/${numero(caso.baseB + fatorEscala)}` },
      { value: `${numero(alvoA)}/${numero(caso.baseB)}`, label: `${numero(alvoA)}/${numero(caso.baseB)}` },
      { value: `${numero(caso.baseB)}/${numero(caso.baseA)}`, label: `${numero(caso.baseB)}/${numero(caso.baseA)}` },
    );
  } else {
    resposta = numero(alvoB);
    const somaAbsoluta = normalizar(caso.baseB + (alvoA - caso.baseA));
    const invertida = normalizar(alvoA * caso.baseA / caso.baseB);
    alternativas = opcoes(
      { value: resposta, label: rotuloNumero(alvoB) },
      { value: numero(somaAbsoluta), label: rotuloNumero(somaAbsoluta) },
      { value: numero(caso.baseB), label: rotuloNumero(caso.baseB) },
      { value: numero(invertida), label: rotuloNumero(invertida) },
    );
  }

  return {
    ficha: "F88",
    nivel,
    modo,
    primitivas: ["SingaporeBars"],
    barrasVinculadas: true,
    baseA: caso.baseA,
    baseB: caso.baseB,
    fatorEscala,
    alvoA,
    alvoB,
    fatorConhecidoAntes,
    escalaNaoInteira,
    resposta,
    opcoes: alternativas,
    acessibilidade,
  };
}

export function construirRazaoProporcaoF88Resolucao(
  spec: RazaoProporcaoF88Spec,
): ResolucaoDeclarativa<RazaoProporcaoF88Show, string, RazaoProporcaoMisconceptionTag> {
  const fator = rotuloNumero(spec.fatorEscala);
  const passos: Array<ResolucaoDeclarativa<RazaoProporcaoF88Show, string, RazaoProporcaoMisconceptionTag>["passos"][number]> = [
    {
      id: "encontrar-fator-comum",
      say: spec.modo === "regra-de-tres"
        ? `Compare a primeira quantidade: ${rotuloNumero(spec.baseA)} precisa virar ${rotuloNumero(spec.alvoA)}. O fator que faz isso é ${fator}. Regra de três aqui começa pela relação, não por multiplicação cruzada decorada.`
        : `A relação é um par. A mesma escala precisa agir nas duas quantidades; aqui o fator é ${fator}.`,
      show: { baseA: spec.baseA, baseB: spec.baseB, fator: spec.fatorEscala, ...(spec.modo === "regra-de-tres" ? { alvoA: spec.alvoA, regraDeTres: true } : {}) },
      corrige: [RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR, RazaoProporcaoMisconception.ESCALA_UM_LADO],
      parcial: fator,
    },
    {
      id: "escalar-as-duas-barras",
      say: `Use o mesmo fator ${fator} nas duas barras: ${rotuloNumero(spec.baseA)} vira ${rotuloNumero(spec.alvoA)} e ${rotuloNumero(spec.baseB)} vira ${rotuloNumero(spec.alvoB)}. As duas crescem juntas e a relação é preservada.`,
      show: { baseA: spec.baseA, baseB: spec.baseB, fator: spec.fatorEscala, alvoA: spec.alvoA, alvoB: spec.alvoB },
      corrige: [RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR, RazaoProporcaoMisconception.ESCALA_UM_LADO],
      parcial: spec.modo === "razao-fracao" ? `${numero(spec.baseA)}/${numero(spec.baseB)}` : spec.resposta,
    },
  ];

  if (spec.modo === "razao-fracao") {
    passos.push({
      id: "ler-razao-como-fracao",
      say: `Razão como fração mantém a ordem: primeira quantidade sobre segunda. ${rotuloNumero(spec.baseA)} para ${rotuloNumero(spec.baseB)} é ${numero(spec.baseA)}/${numero(spec.baseB)}. Escalar as duas pelo mesmo fator produz uma fração equivalente.`,
      show: { baseA: spec.baseA, baseB: spec.baseB, fator: spec.fatorEscala, alvoA: spec.alvoA, alvoB: spec.alvoB, razao: spec.resposta },
      corrige: [RazaoProporcaoMisconception.INVERTE_RAZAO],
      parcial: spec.resposta,
    });
  }

  if (spec.modo === "regra-de-tres") {
    passos.push({
      id: "aplicar-fator-na-incognita",
      say: `Agora aplique o mesmo fator ${fator} à segunda quantidade. ${rotuloNumero(spec.baseB)} vezes ${fator} dá ${rotuloNumero(spec.alvoB)}. Isso resolve a regra de três pela relação proporcional causal.`,
      show: { baseA: spec.baseA, baseB: spec.baseB, fator: spec.fatorEscala, alvoA: spec.alvoA, alvoB: spec.alvoB, regraDeTres: true },
      corrige: [RazaoProporcaoMisconception.INVERTE_RAZAO, RazaoProporcaoMisconception.ESCALA_UM_LADO],
      parcial: spec.resposta,
    });
  }

  return { estadoInicial: { baseA: spec.baseA, baseB: spec.baseB }, passos, fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.04 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirRazaoProporcaoQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N6.04") throw new Error(`razaoProporcaoContract recebeu ${ficha.id}.`);
  const spec = construirRazaoProporcaoF88Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.04 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "dobrar"
    ? `A relação começa em ${rotuloPar(spec.baseA, spec.baseB)}. Dobre a receita. Qual par mantém a relação?`
    : spec.modo === "triplicar"
      ? `A relação começa em ${rotuloPar(spec.baseA, spec.baseB)}. Triplique as duas quantidades. Qual par mantém a relação?`
      : spec.modo === "escala-geral"
        ? `A relação começa em ${rotuloPar(spec.baseA, spec.baseB)}. Use o mesmo fator ${rotuloNumero(spec.fatorEscala)} nas duas quantidades. Qual par resulta?`
        : spec.modo === "razao-fracao"
          ? `A primeira quantidade é ${rotuloNumero(spec.baseA)} e a segunda é ${rotuloNumero(spec.baseB)}. Qual fração representa a razão primeira/segunda?`
          : `${rotuloNumero(spec.baseA)} unidades correspondem a ${rotuloNumero(spec.baseB)}. Se a primeira quantidade passa para ${rotuloNumero(spec.alvoA)}, quanto deve valer a segunda para manter a proporção?`;

  return {
    kind: "razao-proporcao-f88",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirRazaoProporcaoF88Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options: spec.opcoes,
    answer: spec.resposta,
    exigeEvidencia: spec.nivel === 3 ? RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA : undefined,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
