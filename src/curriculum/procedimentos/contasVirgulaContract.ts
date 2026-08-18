import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import {
  ContasVirgulaMisconception,
  type ContasVirgulaMisconceptionTag,
} from "../../constants/contasVirgulaMisconceptions";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { ContasVirgulaMisconception } from "../../constants/contasVirgulaMisconceptions";
export type { ContasVirgulaMisconceptionTag } from "../../constants/contasVirgulaMisconceptions";

export type ContasVirgulaF76Modo = "mesmas-casas" | "casas-diferentes" | "subtracao" | "reagrupamento" | "vezes-dez-cem";

export interface ContasVirgulaF76Opcao extends Option {
  value: string;
  label: string;
  misconception?: ContasVirgulaMisconceptionTag;
}

export interface ContasVirgulaF76Spec {
  ficha: "F76";
  nivel: number;
  modo: ContasVirgulaF76Modo;
  caso: string;
  primitivas: ["InteractiveVertical", "Quadrado100"];
  operacao: "+" | "-" | "×";
  parcelaA: string;
  parcelaB?: string;
  fator?: 10 | 100;
  resposta: string;
  alinhadoA: string;
  alinhadoB?: string;
  casasA: number;
  casasB: number;
  casasDiferentes: boolean;
  zerosPreenchimento: boolean;
  exigeReagrupamento: boolean;
  fracaoVisualA: number;
  fracaoVisualB?: number;
  opcoes: ContasVirgulaF76Opcao[];
  acessibilidade: {
    alvoMinPx: 80;
    toqueAlternativo: true;
    semArrastoObrigatorio: true;
    erroMotorNaoTag: true;
  };
}

interface ContasVirgulaShow {
  destacarVirgulas?: boolean;
  alinharOrdens?: boolean;
  adicionarZeros?: boolean;
  destacarColuna?: string;
  reagrupar?: boolean;
  subirOrdens?: number;
}

type DistratorF76 = { value: string; tag: ContasVirgulaMisconceptionTag };
type CasoF76 = {
  id: string;
  a: string;
  b?: string;
  operacao: "+" | "-" | "×";
  fator?: 10 | 100;
  resposta: string;
  reagrupa?: boolean;
  distratores: DistratorF76[];
};

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = {
  alvoMinPx: 80 as const,
  toqueAlternativo: true as const,
  semArrastoObrigatorio: true as const,
  erroMotorNaoTag: true as const,
};

function escolher<T>(itens: readonly T[], rng: () => number): T {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(safe * itens.length)] ?? itens[0];
}

const D = ContasVirgulaMisconception;
const CASOS: Record<number, readonly CasoF76[]> = {
  1: [
    { id: "035-mais-042", a: "0,35", b: "0,42", operacao: "+", resposta: "0,77", distratores: [{ value: "77", tag: D.VIRGULA_PERDIDA }, { value: "7,7", tag: D.VIRGULA_PERDIDA }] },
    { id: "124-mais-235", a: "1,24", b: "2,35", operacao: "+", resposta: "3,59", distratores: [{ value: "359", tag: D.VIRGULA_PERDIDA }, { value: "35,9", tag: D.VIRGULA_PERDIDA }] },
    { id: "260-mais-115", a: "2,60", b: "1,15", operacao: "+", resposta: "3,75", distratores: [{ value: "375", tag: D.VIRGULA_PERDIDA }, { value: "37,5", tag: D.VIRGULA_PERDIDA }] },
  ],
  2: [
    { id: "35-mais-125", a: "3,5", b: "1,25", operacao: "+", resposta: "4,75", distratores: [{ value: "1,60", tag: D.ALINHA_PELA_DIREITA }, { value: "4,30", tag: D.IGNORA_ZEROS }, { value: "475", tag: D.VIRGULA_PERDIDA }] },
    { id: "08-mais-035", a: "0,8", b: "0,35", operacao: "+", resposta: "1,15", distratores: [{ value: "0,43", tag: D.ALINHA_PELA_DIREITA }, { value: "1,3", tag: D.IGNORA_ZEROS }, { value: "115", tag: D.VIRGULA_PERDIDA }] },
    { id: "12-mais-35", a: "12", b: "3,5", operacao: "+", resposta: "15,5", distratores: [{ value: "4,7", tag: D.ALINHA_PELA_DIREITA }, { value: "12,35", tag: D.IGNORA_ZEROS }, { value: "155", tag: D.VIRGULA_PERDIDA }] },
  ],
  3: [
    { id: "575-menos-23", a: "5,75", b: "2,3", operacao: "-", resposta: "3,45", distratores: [{ value: "5,52", tag: D.ALINHA_PELA_DIREITA }, { value: "3,72", tag: D.IGNORA_ZEROS }, { value: "345", tag: D.VIRGULA_PERDIDA }] },
    { id: "840-menos-215", a: "8,40", b: "2,15", operacao: "-", resposta: "6,25", distratores: [{ value: "8,19", tag: D.ALINHA_PELA_DIREITA }, { value: "6,35", tag: D.IGNORA_ZEROS }, { value: "625", tag: D.VIRGULA_PERDIDA }] },
    { id: "100-menos-346", a: "10,0", b: "3,46", operacao: "-", resposta: "6,54", distratores: [{ value: "2,46", tag: D.ALINHA_PELA_DIREITA }, { value: "7,54", tag: D.IGNORA_ZEROS }, { value: "654", tag: D.VIRGULA_PERDIDA }] },
  ],
  4: [
    { id: "32-mais-185", a: "3,2", b: "1,85", operacao: "+", resposta: "5,05", reagrupa: true, distratores: [{ value: "2,17", tag: D.ALINHA_PELA_DIREITA }, { value: "4,15", tag: D.IGNORA_ZEROS }, { value: "505", tag: D.VIRGULA_PERDIDA }] },
    { id: "64-menos-275", a: "6,4", b: "2,75", operacao: "-", resposta: "3,65", reagrupa: true, distratores: [{ value: "2,11", tag: D.ALINHA_PELA_DIREITA }, { value: "4,35", tag: D.IGNORA_ZEROS }, { value: "365", tag: D.VIRGULA_PERDIDA }] },
    { id: "258-mais-067", a: "2,58", b: "0,67", operacao: "+", resposta: "3,25", reagrupa: true, distratores: [{ value: "3,35", tag: D.ALINHA_PELA_DIREITA }, { value: "2,125", tag: D.IGNORA_ZEROS }, { value: "325", tag: D.VIRGULA_PERDIDA }] },
  ],
  5: [
    { id: "047-vezes-10", a: "0,47", operacao: "×", fator: 10, resposta: "4,7", distratores: [{ value: "0,470", tag: D.IGNORA_ZEROS }, { value: "47", tag: D.VIRGULA_PERDIDA }, { value: "0,047", tag: D.ALINHA_PELA_DIREITA }] },
    { id: "125-vezes-100", a: "1,25", operacao: "×", fator: 100, resposta: "125", distratores: [{ value: "1,2500", tag: D.IGNORA_ZEROS }, { value: "12,5", tag: D.ALINHA_PELA_DIREITA }, { value: "1250", tag: D.VIRGULA_PERDIDA }] },
    { id: "306-vezes-10", a: "3,06", operacao: "×", fator: 10, resposta: "30,6", distratores: [{ value: "3,060", tag: D.IGNORA_ZEROS }, { value: "306", tag: D.VIRGULA_PERDIDA }, { value: "0,306", tag: D.ALINHA_PELA_DIREITA }] },
  ],
};

function casas(valor?: string): number {
  if (!valor) return 0;
  return valor.includes(",") ? valor.split(",")[1].length : 0;
}

function alinhar(valor: string, casasAlvo: number): string {
  if (casasAlvo === 0) return valor.split(",")[0];
  const [inteiro, decimais = ""] = valor.split(",");
  return `${inteiro},${decimais.padEnd(casasAlvo, "0")}`;
}

function fracaoVisual(valor?: string): number | undefined {
  if (!valor) return undefined;
  const numero = Number(valor.replace(",", "."));
  const parte = ((numero % 1) + 1) % 1;
  return Math.round(parte * 100);
}

export function construirContasVirgulaF76Spec(level: number, rng: () => number = Math.random): ContasVirgulaF76Spec {
  const nivel = clamp(level);
  const modo = ["mesmas-casas", "casas-diferentes", "subtracao", "reagrupamento", "vezes-dez-cem"][nivel - 1] as ContasVirgulaF76Modo;
  const caso = escolher(CASOS[nivel], rng);
  const casasA = casas(caso.a);
  const casasB = casas(caso.b);
  const casasAlvo = Math.max(casasA, casasB);
  const opcoes: ContasVirgulaF76Opcao[] = [
    { value: caso.resposta, label: caso.resposta },
    ...caso.distratores.map(item => ({ value: item.value, label: item.value, misconception: item.tag })),
  ].filter((item, index, todos) => todos.findIndex(other => other.value === item.value) === index).slice(0, 4);

  return {
    ficha: "F76",
    nivel,
    modo,
    caso: caso.id,
    primitivas: ["InteractiveVertical", "Quadrado100"],
    operacao: caso.operacao,
    parcelaA: caso.a,
    parcelaB: caso.b,
    fator: caso.fator,
    resposta: caso.resposta,
    alinhadoA: alinhar(caso.a, casasAlvo),
    alinhadoB: caso.b ? alinhar(caso.b, casasAlvo) : undefined,
    casasA,
    casasB,
    casasDiferentes: Boolean(caso.b) && casasA !== casasB,
    zerosPreenchimento: Boolean(caso.b) && casasA !== casasB,
    exigeReagrupamento: Boolean(caso.reagrupa),
    fracaoVisualA: fracaoVisual(caso.a) ?? 0,
    fracaoVisualB: fracaoVisual(caso.b),
    opcoes,
    acessibilidade,
  };
}

export function construirContasVirgulaF76Resolucao(spec: ContasVirgulaF76Spec): ResolucaoDeclarativa<ContasVirgulaShow, string, ContasVirgulaMisconceptionTag> {
  const base = [
    { id: "marcar-virgulas", say: "Use a vírgula como eixo: unidade fica com unidade, décimo com décimo e centésimo com centésimo.", show: { destacarVirgulas: true, alinharOrdens: true }, corrige: [D.ALINHA_PELA_DIREITA], parcial: "ordens-alinhadas" },
  ];
  if (spec.nivel === 1) return { estadoInicial: { destacarVirgulas: true }, passos: base, fallback: 0 };
  if (spec.nivel === 2) return {
    estadoInicial: { destacarVirgulas: true },
    passos: [...base, { id: "preencher-zero", say: "Se uma parcela não tem uma casa decimal, escreva zero nessa casa. O valor não muda e as ordens ficam visíveis.", show: { adicionarZeros: true, destacarColuna: "casa-ausente" }, corrige: [D.IGNORA_ZEROS], parcial: "casas-completas" }],
    fallback: 0,
  };
  if (spec.nivel === 3) return {
    estadoInicial: { destacarVirgulas: true },
    passos: [...base, ...(spec.zerosPreenchimento ? [{ id: "zero-na-subtracao", say: "Complete a casa decimal ausente com zero antes de subtrair.", show: { adicionarZeros: true }, corrige: [D.IGNORA_ZEROS], parcial: "subtracao-com-casas-completas" }] : []), { id: "subtrair-por-ordem", say: "Subtraia cada ordem da mesma ordem e mantenha a vírgula no eixo da conta.", show: { destacarColuna: "da-menor-para-a-maior" }, corrige: [D.VIRGULA_PERDIDA], parcial: "subtracao-posicional" }],
    fallback: 0,
  };
  if (spec.nivel === 4) return {
    estadoInicial: { destacarVirgulas: true },
    passos: [...base, { id: "reagrupar-ordem", say: "Quando uma coluna precisa, troque uma unidade da ordem maior por dez unidades da ordem imediatamente menor; a vírgula continua no mesmo eixo.", show: { reagrupar: true, destacarColuna: "reagrupamento" }, corrige: [D.IGNORA_ZEROS, D.VIRGULA_PERDIDA], parcial: "reagrupamento-posicional" }],
    fallback: 0,
  };
  const ordens = spec.fator === 100 ? 2 : 1;
  return {
    estadoInicial: { destacarVirgulas: true },
    passos: [
      { id: "valor-posicional", say: `Multiplicar por ${spec.fator} faz cada algarismo valer ${spec.fator} vezes mais.`, show: { destacarVirgulas: true }, corrige: [D.ALINHA_PELA_DIREITA], parcial: "valor-posicional-identificado" },
      { id: "subir-ordens", say: `Cada algarismo sobe ${ordens === 1 ? "uma ordem" : "duas ordens"} de valor posicional; use a vírgula apenas para registrar onde ficaram unidades e partes do inteiro.`, show: { subirOrdens: ordens, alinharOrdens: true }, corrige: [D.IGNORA_ZEROS, D.VIRGULA_PERDIDA], parcial: "ordens-subidas" },
    ],
    fallback: 0,
  };
}

function masteryRuleDaFicha(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.02 sem micro do nível ${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirContasVirgulaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N6.02") throw new Error(`contasVirgulaContract recebeu ${ficha.id}.`);
  const spec = construirContasVirgulaF76Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.02 sem micro do nível ${spec.nivel}.`);
  const prompt = spec.nivel === 5
    ? `Quanto vale ${spec.parcelaA} × ${spec.fator}? Pense no valor posicional.`
    : `Resolva ${spec.parcelaA} ${spec.operacao} ${spec.parcelaB}, alinhando as ordens pela vírgula.`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "contas-virgula-f76",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirContasVirgulaF76Resolucao(spec),
    masteryRule: masteryRuleDaFicha(ficha, spec.nivel),
    exigeEvidencia: micro.dominio.exige?.evidencia,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
