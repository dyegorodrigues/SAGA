import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const CirculoAreasMisconception = {
  ESQUECE_DIVIDIR_POR_2: "esquece-dividir-por-2",
  ALTURA_ERRADA: "altura-errada",
  CONFUNDE_RAIO_DIAMETRO: "confunde-raio-diametro",
} as const;
export type CirculoAreasMisconceptionTag = typeof CirculoAreasMisconception[keyof typeof CirculoAreasMisconception];
export type CirculoAreasModo = "triangulo-montagem" | "formula-triangulo" | "paralelogramo-corte" | "circulo-medidas" | "area-circulo";

export interface CirculoAreasF91Spec {
  ficha: "F91";
  nivel: number;
  modo: CirculoAreasModo;
  primitivas: ["ShapeCanvas"];
  base: number;
  altura: number;
  raio?: number;
  diametro?: number;
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: CirculoAreasMisconceptionTag }>;
}

interface CirculoAreasShow {
  foco: "triangulo" | "formula" | "paralelogramo" | "circulo" | "setores";
  montar?: boolean;
  cortar?: boolean;
  rearranjar?: boolean;
  base?: number;
  altura?: number;
  raio?: number;
  diametro?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const option = (value: string, label: string, misconception?: CirculoAreasMisconceptionTag) => ({ value, label, ...(misconception ? { misconception } : {}) });

export function construirCirculoAreasSpec(level: number): CirculoAreasF91Spec {
  const nivel = clamp(level);
  const common = { ficha: "F91" as const, nivel, primitivas: ["ShapeCanvas"] as ["ShapeCanvas"] };
  if (nivel === 1) return {
    ...common,
    modo: "triangulo-montagem",
    base: 8,
    altura: 5,
    resposta: "20",
    opcoes: [
      option("20", "20 unidades quadradas"),
      option("40", "40 unidades quadradas", CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2),
      option("32", "32 unidades quadradas", CirculoAreasMisconception.ALTURA_ERRADA),
    ],
  };
  if (nivel === 2) return {
    ...common,
    modo: "formula-triangulo",
    base: 10,
    altura: 6,
    resposta: "30",
    opcoes: [
      option("30", "10 × 6 ÷ 2 = 30"),
      option("60", "10 × 6 = 60", CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2),
      option("40", "10 × 8 ÷ 2 = 40", CirculoAreasMisconception.ALTURA_ERRADA),
    ],
  };
  if (nivel === 3) return {
    ...common,
    modo: "paralelogramo-corte",
    base: 7,
    altura: 4,
    resposta: "28",
    opcoes: [
      option("28", "28 unidades quadradas"),
      option("22", "22 unidades quadradas", CirculoAreasMisconception.ALTURA_ERRADA),
      option("14", "14 unidades quadradas", CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2),
    ],
  };
  if (nivel === 4) return {
    ...common,
    modo: "circulo-medidas",
    base: 0,
    altura: 0,
    raio: 4,
    diametro: 8,
    resposta: "raio-4-diametro-8",
    opcoes: [
      option("raio-4-diametro-8", "Raio 4; diâmetro 8; circunferência é a volta"),
      option("raio-8-diametro-4", "Raio 8; diâmetro 4", CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO),
      option("raio-4-diametro-4", "Raio e diâmetro medem 4", CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO),
    ],
  };
  return {
    ...common,
    modo: "area-circulo",
    base: 0,
    altura: 0,
    raio: 3,
    diametro: 6,
    resposta: "9π",
    opcoes: [
      option("9π", "9π unidades quadradas"),
      option("6π", "6π unidades quadradas", CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO),
      option("18π", "18π unidades quadradas", CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2),
    ],
  };
}

export function construirCirculoAreasResolucao(spec: CirculoAreasF91Spec): ResolucaoDeclarativa<CirculoAreasShow, string, CirculoAreasMisconceptionTag> {
  if (spec.modo === "triangulo-montagem") return {
    estadoInicial: { foco: "triangulo", base: spec.base, altura: spec.altura },
    passos: [
      { id: "duplicar", say: "Faça uma segunda cópia igual do triângulo e encaixe as duas: juntas elas formam um retângulo.", show: { foco: "triangulo", montar: true, base: spec.base, altura: spec.altura }, corrige: [CirculoAreasMisconception.ALTURA_ERRADA], parcial: spec.resposta },
      { id: "metade", say: "O retângulo inteiro tem base vezes altura. Um dos dois triângulos ocupa exatamente a metade dessa área, então dividimos por 2.", show: { foco: "formula", montar: true, base: spec.base, altura: spec.altura }, corrige: [CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "formula-triangulo") return {
    estadoInicial: { foco: "formula", base: spec.base, altura: spec.altura },
    passos: [
      { id: "reconstruir-retangulo", say: `Dois triângulos iguais formam o retângulo: base ${spec.base} multiplicada pela altura ${spec.altura} dá o produto da área inteira.`, show: { foco: "triangulo", montar: true, base: spec.base, altura: spec.altura }, corrige: [CirculoAreasMisconception.ALTURA_ERRADA], parcial: spec.resposta },
      { id: "derivar-metade", say: "Como queremos apenas um triângulo, tomamos a metade do produto: base × altura dividido por 2. A fórmula vem da montagem, não de uma regra decorada.", show: { foco: "formula", montar: true, base: spec.base, altura: spec.altura }, corrige: [CirculoAreasMisconception.ESQUECE_DIVIDIR_POR_2], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "paralelogramo-corte") return {
    estadoInicial: { foco: "paralelogramo", base: spec.base, altura: spec.altura },
    passos: [
      { id: "cortar", say: "Corte o triângulo de uma ponta do paralelogramo. Nenhuma área desaparece.", show: { foco: "paralelogramo", cortar: true, base: spec.base, altura: spec.altura }, corrige: [CirculoAreasMisconception.ALTURA_ERRADA], parcial: spec.resposta },
      { id: "encaixar", say: "Encaixe a peça cortada do outro lado: agora há um retângulo com a mesma área, a mesma base e a mesma altura perpendicular.", show: { foco: "paralelogramo", cortar: true, montar: true, base: spec.base, altura: spec.altura }, parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "circulo-medidas") return {
    estadoInicial: { foco: "circulo", raio: spec.raio, diametro: spec.diametro },
    passos: [
      { id: "raio", say: "Raio é o segmento do centro até a borda do círculo.", show: { foco: "circulo", raio: spec.raio, diametro: spec.diametro }, corrige: [CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO], parcial: spec.resposta },
      { id: "diametro", say: "Diâmetro atravessa o centro de uma borda à outra e mede dois raios: o diâmetro é o dobro do raio.", show: { foco: "circulo", raio: spec.raio, diametro: spec.diametro }, corrige: [CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO], parcial: spec.resposta },
      { id: "circunferencia", say: "Circunferência é a volta, o contorno do círculo; não é o raio nem o diâmetro dentro dele.", show: { foco: "circulo", raio: spec.raio, diametro: spec.diametro }, corrige: [CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  return {
    estadoInicial: { foco: "setores", raio: spec.raio, diametro: spec.diametro },
    passos: [
      { id: "fatiar", say: "Divida o círculo em muitos setores iguais. A área total continua a mesma.", show: { foco: "setores", raio: spec.raio, rearranjar: false }, parcial: spec.resposta },
      { id: "rearranjar", say: "Alterne os setores para rearranjar o círculo quase como um retângulo: a altura é o raio e a base se aproxima de π vezes o raio.", show: { foco: "setores", raio: spec.raio, rearranjar: true }, corrige: [CirculoAreasMisconception.CONFUNDE_RAIO_DIAMETRO], parcial: spec.resposta },
      { id: "derivar-area", say: "Por isso a área do círculo é aproximadamente base × altura = πr × r = πr². A fórmula aparece da aproximação pelos setores.", show: { foco: "formula", raio: spec.raio, rearranjar: true }, parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.09 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirCirculoAreasQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.09") throw new Error(`circuloAreasContract recebeu ${ficha.id}.`);
  const spec = construirCirculoAreasSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.09 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "triangulo-montagem" ? "Monte duas cópias do triângulo e descubra a área de uma delas."
    : spec.modo === "formula-triangulo" ? "Reconstrua a fórmula da área do triângulo a partir do retângulo formado por duas cópias."
    : spec.modo === "paralelogramo-corte" ? "Corte e encaixe a ponta para transformar o paralelogramo sem mudar sua área."
    : spec.modo === "circulo-medidas" ? "Relacione raio, diâmetro e circunferência neste círculo."
    : "Rearranje os setores para descobrir de onde vem a área do círculo.";
  const options: Option[] = spec.opcoes;
  return {
    kind: "circulo-areas-f91",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirCirculoAreasResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
