import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const PoligonosMisconception = {
  CATEGORIAS_EXCLUSIVAS: "categorias-exclusivas",
  SO_UM_CRITERIO: "so-um-criterio",
  ORIENTACAO_FIXA: "orientacao-fixa",
} as const;
export type PoligonosMisconceptionTag = typeof PoligonosMisconception[keyof typeof PoligonosMisconception];
export type PoligonosModo = "triangulos-lados" | "triangulos-angulos" | "quadrilateros" | "hierarquia" | "propriedades-combinadas";
export type PoligonoFamilia = "triangulo" | "quadrilatero" | "quadrado" | "retangulo" | "paralelogramo" | "losango";
export type PoligonoCriterio = "lados" | "angulos" | "quadrilateros" | "hierarquia" | "combinado";

export interface PoligonoFiguraF79 {
  id: string;
  familia: PoligonoFamilia;
  lados: number;
  giro: number;
  ladosIguais?: number;
  angulosRetos?: number;
  paresParalelos?: number;
  classeLados?: "equilatero" | "isosceles" | "escaleno";
  classeAngulos?: "acutangulo" | "retangulo" | "obtusangulo";
}

export interface PoligonosF79Spec {
  nivel: number;
  modo: PoligonosModo;
  primitivas: ["ShapeCanvas", "DragGroup"];
  figuras: PoligonoFiguraF79[];
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: PoligonosMisconceptionTag }>;
  criterio: PoligonoCriterio;
  orientacoesVariadas: true;
  hierarquia: boolean;
  quadradoTambemRetangulo: boolean;
  lacosAninhados: string[];
  propriedadesCombinadas: boolean;
  criterios: string[];
  criteriosMinimos: number;
  alternativaPorToque: true;
}

interface PoligonosShow {
  figura?: PoligonoFiguraF79;
  destacarLados?: boolean;
  destacarAngulos?: boolean;
  mostrarLacos?: string[];
  criterios?: string[];
  girarFigura?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function options(correta: string, label: string, erradas: Array<{ value: string; label: string; misconception: PoligonosMisconceptionTag }>): PoligonosF79Spec["opcoes"] {
  return [{ value: correta, label }, ...erradas]
    .filter((item, index, all) => all.findIndex(other => other.value === item.value) === index)
    .slice(0, 4);
}

const trianguloIsosceles: PoligonoFiguraF79 = {
  id: "tri-isosceles",
  familia: "triangulo",
  lados: 3,
  giro: 37,
  ladosIguais: 2,
  classeLados: "isosceles",
  classeAngulos: "acutangulo",
};
const trianguloRetangulo: PoligonoFiguraF79 = {
  id: "tri-retangulo",
  familia: "triangulo",
  lados: 3,
  giro: 121,
  ladosIguais: 0,
  angulosRetos: 1,
  classeLados: "escaleno",
  classeAngulos: "retangulo",
};
const paralelogramo: PoligonoFiguraF79 = {
  id: "paralelogramo",
  familia: "paralelogramo",
  lados: 4,
  giro: 18,
  ladosIguais: 0,
  angulosRetos: 0,
  paresParalelos: 2,
};
const quadrado: PoligonoFiguraF79 = {
  id: "quadrado",
  familia: "quadrado",
  lados: 4,
  giro: 31,
  ladosIguais: 4,
  angulosRetos: 4,
  paresParalelos: 2,
};
const losango: PoligonoFiguraF79 = {
  id: "losango",
  familia: "losango",
  lados: 4,
  giro: 42,
  ladosIguais: 4,
  angulosRetos: 0,
  paresParalelos: 2,
};

export function construirPoligonosSpec(level: number): PoligonosF79Spec {
  const nivel = clamp(level);
  const base = {
    nivel,
    primitivas: ["ShapeCanvas", "DragGroup"] as ["ShapeCanvas", "DragGroup"],
    orientacoesVariadas: true as const,
    alternativaPorToque: true as const,
  };
  if (nivel === 1) return {
    ...base,
    modo: "triangulos-lados",
    figuras: [trianguloIsosceles, { ...trianguloIsosceles, id: "tri-isosceles-girado", giro: 173 }],
    resposta: "isosceles",
    opcoes: options("isosceles", "Isósceles — 2 lados iguais", [
      { value: "equilatero", label: "Equilátero — 3 lados iguais", misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-triangulo", label: "Não é triângulo nessa posição", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: "lados",
    hierarquia: false,
    quadradoTambemRetangulo: false,
    lacosAninhados: [],
    propriedadesCombinadas: false,
    criterios: ["3 lados", "2 lados iguais"],
    criteriosMinimos: 1,
  };
  if (nivel === 2) return {
    ...base,
    modo: "triangulos-angulos",
    figuras: [trianguloRetangulo, { ...trianguloRetangulo, id: "tri-retangulo-girado", giro: 226 }],
    resposta: "retangulo",
    opcoes: options("retangulo", "Triângulo retângulo — 1 ângulo reto", [
      { value: "obtusangulo", label: "Obtusângulo", misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-triangulo", label: "Deixou de ser triângulo porque girou", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: "angulos",
    hierarquia: false,
    quadradoTambemRetangulo: false,
    lacosAninhados: [],
    propriedadesCombinadas: false,
    criterios: ["3 lados", "1 ângulo reto"],
    criteriosMinimos: 1,
  };
  if (nivel === 3) return {
    ...base,
    modo: "quadrilateros",
    figuras: [paralelogramo, quadrado, losango],
    resposta: "paralelogramo",
    opcoes: options("paralelogramo", "Paralelogramo — 2 pares de lados paralelos", [
      { value: "retangulo", label: "Retângulo — precisa de 4 ângulos retos", misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-quadrilatero", label: "Não é quadrilátero porque está inclinado", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: "quadrilateros",
    hierarquia: false,
    quadradoTambemRetangulo: false,
    lacosAninhados: [],
    propriedadesCombinadas: false,
    criterios: ["4 lados", "2 pares de lados paralelos"],
    criteriosMinimos: 1,
  };
  if (nivel === 4) return {
    ...base,
    modo: "hierarquia",
    figuras: [quadrado],
    resposta: "quadrado-retangulo-paralelogramo",
    opcoes: options("quadrado-retangulo-paralelogramo", "Quadrado, retângulo e paralelogramo", [
      { value: "so-quadrado", label: "Só quadrado", misconception: PoligonosMisconception.CATEGORIAS_EXCLUSIVAS },
      { value: "quadrado-retangulo", label: "Quadrado e retângulo, mas não paralelogramo", misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-retangulo-girado", label: "Só seria retângulo sem estar girado", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: "hierarquia",
    hierarquia: true,
    quadradoTambemRetangulo: true,
    lacosAninhados: ["quadrados⊂retângulos", "retângulos⊂paralelogramos", "paralelogramos⊂quadriláteros"],
    propriedadesCombinadas: true,
    criterios: ["4 lados iguais", "4 ângulos retos", "2 pares de lados paralelos"],
    criteriosMinimos: 2,
  };
  return {
    ...base,
    modo: "propriedades-combinadas",
    figuras: [losango, { ...losango, id: "losango-girado", giro: 137 }],
    resposta: "losango-paralelogramo",
    opcoes: options("losango-paralelogramo", "Losango e paralelogramo", [
      { value: "so-losango", label: "Só losango", misconception: PoligonosMisconception.CATEGORIAS_EXCLUSIVAS },
      { value: "retangulo", label: "Retângulo, porque tem 4 lados", misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-quadrilatero", label: "Não é quadrilátero nessa orientação", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: "combinado",
    hierarquia: true,
    quadradoTambemRetangulo: true,
    lacosAninhados: ["losangos⊂paralelogramos", "paralelogramos⊂quadriláteros"],
    propriedadesCombinadas: true,
    criterios: ["4 lados iguais", "2 pares de lados paralelos", "ângulos não precisam ser retos"],
    criteriosMinimos: 2,
  };
}

/**
 * A conferência que a ficha manda fazer antes de nomear a classe.
 *
 * `howto` diz "conte os lados e olhe os ângulos", e L4/L5 pedem duas
 * propriedades ao mesmo tempo. O ato é conferir cada figura da cena contra cada
 * critério do nível — inclusive a cópia girada, que é o remédio direto do
 * distrator `orientacao-fixa`.
 *
 * Conferir não é acertar: os critérios listados são propriedades que a figura
 * TEM, então a conferência não escolhe classe nenhuma e não imprime o gabarito.
 * Ela produz a informação de que a resposta precisa, que é o que separa um
 * portão CLASS-007 legítimo de um vazamento GAP-054.
 */
export function conferenciasExigidasF79(spec: PoligonosF79Spec): number {
  return spec.criterios.length * spec.figuras.length;
}

export function construirPoligonosResolucao(spec: PoligonosF79Spec): ResolucaoDeclarativa<PoligonosShow, string, PoligonosMisconceptionTag> {
  const figura = spec.figuras[0];
  return {
    estadoInicial: { figura },
    passos: [
      {
        id: "ignorar-orientacao",
        say: "Girar a figura não muda seus lados nem seus ângulos. Classifique pelas propriedades.",
        show: { figura, girarFigura: true },
        corrige: [PoligonosMisconception.ORIENTACAO_FIXA],
        parcial: spec.resposta,
      },
      {
        id: "usar-criterios",
        say: spec.criterio === "angulos" ? "Agora olhe os ângulos, não apenas os lados." : "Conte os lados e confira as propriedades pedidas.",
        show: { figura, destacarLados: true, destacarAngulos: spec.criterio !== "lados", criterios: spec.criterios },
        corrige: [PoligonosMisconception.SO_UM_CRITERIO],
        parcial: spec.resposta,
      },
      {
        id: "ver-hierarquia",
        say: spec.hierarquia ? "Uma forma pode pertencer a mais de uma classe. O laço menor fica dentro do maior." : "Use a propriedade indicada para escolher a classe, mesmo quando a figura estiver girada.",
        show: { figura, destacarLados: true, destacarAngulos: true, mostrarLacos: spec.lacosAninhados, criterios: spec.criterios },
        corrige: [PoligonosMisconception.CATEGORIAS_EXCLUSIVAS],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPoligonosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.07") throw new Error(`poligonosContract recebeu ${ficha.id}.`);
  const spec = construirPoligonosSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.07 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "triangulos-lados" ? "Classifique o triângulo pelo comprimento dos lados."
    : spec.modo === "triangulos-angulos" ? "Classifique o triângulo pelos ângulos."
    : spec.modo === "quadrilateros" ? "Que quadrilátero é este pelas suas propriedades?"
    : spec.modo === "hierarquia" ? "Em quais classes este quadrado também pertence?"
    : "Use pelo menos duas propriedades para classificar a figura.";
  const options: Option[] = spec.opcoes;
  return {
    kind: "poligonos-f79",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPoligonosResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
