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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];
/** Duas orientações bem separadas: a cópia precisa parecer outra coisa e não ser. */
const giroSorteado = () => ri(10, 80);
const giroDaCopia = (giro: number) => giro + ri(100, 260);

interface ClasseTriangulo {
  classeLados: NonNullable<PoligonoFiguraF79["classeLados"]>;
  classeAngulos: NonNullable<PoligonoFiguraF79["classeAngulos"]>;
  ladosIguais: number;
  angulosRetos: number;
  rotulo: string;
  criterio: string;
}

const POR_LADOS: readonly ClasseTriangulo[] = [
  { classeLados: "equilatero", classeAngulos: "acutangulo", ladosIguais: 3, angulosRetos: 0, rotulo: "Equilátero — 3 lados iguais", criterio: "3 lados iguais" },
  { classeLados: "isosceles", classeAngulos: "acutangulo", ladosIguais: 2, angulosRetos: 0, rotulo: "Isósceles — 2 lados iguais", criterio: "2 lados iguais" },
  { classeLados: "escaleno", classeAngulos: "acutangulo", ladosIguais: 0, angulosRetos: 0, rotulo: "Escaleno — nenhum lado igual", criterio: "nenhum lado igual" },
];

const POR_ANGULOS: readonly ClasseTriangulo[] = [
  { classeLados: "escaleno", classeAngulos: "retangulo", ladosIguais: 0, angulosRetos: 1, rotulo: "Triângulo retângulo — 1 ângulo reto", criterio: "1 ângulo reto" },
  { classeLados: "escaleno", classeAngulos: "acutangulo", ladosIguais: 0, angulosRetos: 0, rotulo: "Acutângulo — todos os ângulos agudos", criterio: "todos os ângulos agudos" },
  { classeLados: "escaleno", classeAngulos: "obtusangulo", ladosIguais: 0, angulosRetos: 0, rotulo: "Obtusângulo — 1 ângulo obtuso", criterio: "1 ângulo obtuso" },
];

interface ClasseQuadrilatero {
  familia: PoligonoFamilia;
  nome: string;
  ladosIguais: number;
  angulosRetos: number;
  paresParalelos: number;
  criterios: string[];
  /** Classes que a figura também é, da mais específica para a mais ampla. */
  tambemE: string[];
}

const QUADRILATEROS: readonly ClasseQuadrilatero[] = [
  { familia: "paralelogramo", nome: "Paralelogramo", ladosIguais: 0, angulosRetos: 0, paresParalelos: 2, criterios: ["4 lados", "2 pares de lados paralelos"], tambemE: ["paralelogramo"] },
  { familia: "losango", nome: "Losango", ladosIguais: 4, angulosRetos: 0, paresParalelos: 2, criterios: ["4 lados iguais", "2 pares de lados paralelos"], tambemE: ["losango", "paralelogramo"] },
  { familia: "retangulo", nome: "Retângulo", ladosIguais: 0, angulosRetos: 4, paresParalelos: 2, criterios: ["4 ângulos retos", "2 pares de lados paralelos"], tambemE: ["retângulo", "paralelogramo"] },
  { familia: "quadrado", nome: "Quadrado", ladosIguais: 4, angulosRetos: 4, paresParalelos: 2, criterios: ["4 lados iguais", "4 ângulos retos", "2 pares de lados paralelos"], tambemE: ["quadrado", "retângulo", "paralelogramo"] },
];

const quadrilateroFigura = (classe: ClasseQuadrilatero, id: string, giro: number): PoligonoFiguraF79 => ({
  id, familia: classe.familia, lados: 4, giro,
  ladosIguais: classe.ladosIguais, angulosRetos: classe.angulosRetos, paresParalelos: classe.paresParalelos,
});

const trianguloFigura = (classe: ClasseTriangulo, id: string, giro: number): PoligonoFiguraF79 => ({
  id, familia: "triangulo", lados: 3, giro,
  ladosIguais: classe.ladosIguais, angulosRetos: classe.angulosRetos,
  classeLados: classe.classeLados, classeAngulos: classe.classeAngulos,
});

const chave = (nomes: string[]) => nomes.join("-").toLowerCase().replace(/[âêôáéíóúãõç]/g, c => "aeoaeiouaoc"["âêôáéíóúãõç".indexOf(c)]);

/**
 * CLASS-003 — a figura do nível é sorteada, a escada não.
 *
 * As figuras eram as mesmas por nível, e a resposta com elas: sempre
 * "isósceles" em L1, sempre "losango e paralelogramo" em L5. A frente da
 * CLASS-007 pôs a conferência de critérios na frente, e a criança conferia as
 * MESMAS figuras seis vezes.
 *
 * Girar não bastaria. Com a classe fixa, decorar o rótulo vence o nível — foi
 * o defeito que apareceu em GE.04, onde "sim" acertava L3 e L4 para sempre.
 * Então a CLASSE é sorteada junto, e o desenho acompanha: `pontosFigura` ganhou
 * traço próprio para equilátero, escaleno e obtusângulo, porque uma classe que
 * caísse no traço genérico seria uma figura mentindo sobre si mesma.
 *
 * A cópia girada continua sendo a MESMA figura em outra orientação: é ela que
 * desmente o distrator `orientacao-fixa`, que a ficha declara.
 */
export function construirPoligonosSpec(level: number): PoligonosF79Spec {
  const nivel = clamp(level);
  const base = {
    nivel,
    primitivas: ["ShapeCanvas", "DragGroup"] as ["ShapeCanvas", "DragGroup"],
    orientacoesVariadas: true as const,
    alternativaPorToque: true as const,
  };
  const giro = giroSorteado();

  if (nivel === 1 || nivel === 2) {
    const familia = nivel === 1 ? POR_LADOS : POR_ANGULOS;
    const alvo = escolher(familia);
    const outro = escolher(familia.filter(c => c !== alvo));
    const valor = nivel === 1 ? alvo.classeLados : alvo.classeAngulos;
    const valorOutro = nivel === 1 ? outro.classeLados : outro.classeAngulos;
    return {
      ...base,
      modo: nivel === 1 ? "triangulos-lados" : "triangulos-angulos",
      figuras: [
        trianguloFigura(alvo, `tri-${valor}`, giro),
        trianguloFigura(alvo, `tri-${valor}-girado`, giroDaCopia(giro)),
      ],
      resposta: valor,
      opcoes: options(valor, alvo.rotulo, [
        { value: valorOutro, label: outro.rotulo, misconception: PoligonosMisconception.SO_UM_CRITERIO },
        { value: "nao-triangulo", label: "Não é triângulo nessa posição", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
      ]),
      criterio: nivel === 1 ? "lados" : "angulos",
      hierarquia: false,
      quadradoTambemRetangulo: false,
      lacosAninhados: [],
      propriedadesCombinadas: false,
      criterios: ["3 lados", alvo.criterio],
      criteriosMinimos: 1,
    };
  }

  if (nivel === 3) {
    const alvo = escolher(QUADRILATEROS.filter(q => q.familia !== "quadrado"));
    const outro = escolher(QUADRILATEROS.filter(q => q !== alvo));
    const acompanham = QUADRILATEROS.filter(q => q !== alvo).slice(0, 2);
    return {
      ...base,
      modo: "quadrilateros",
      figuras: [
        quadrilateroFigura(alvo, alvo.familia, giro),
        ...acompanham.map((q, indice) => quadrilateroFigura(q, `${q.familia}-${indice}`, giroSorteado())),
      ],
      resposta: alvo.familia,
      opcoes: options(alvo.familia, `${alvo.nome} — ${alvo.criterios[alvo.criterios.length - 1]}`, [
        { value: outro.familia, label: `${outro.nome} — precisa de ${outro.criterios[0]}`, misconception: PoligonosMisconception.SO_UM_CRITERIO },
        { value: "nao-quadrilatero", label: "Não é quadrilátero porque está inclinado", misconception: PoligonosMisconception.ORIENTACAO_FIXA },
      ]),
      criterio: "quadrilateros",
      hierarquia: false,
      quadradoTambemRetangulo: false,
      lacosAninhados: [],
      propriedadesCombinadas: false,
      criterios: alvo.criterios,
      criteriosMinimos: 1,
    };
  }

  // L4 e L5 perguntam a inclusão: a figura pertence a mais de uma classe.
  const candidatos = nivel === 4
    ? QUADRILATEROS.filter(q => q.familia === "quadrado" || q.familia === "retangulo")
    : QUADRILATEROS.filter(q => q.familia === "losango" || q.familia === "quadrado");
  const alvo = escolher(candidatos);
  const cadeia = alvo.tambemE;
  const resposta = chave(cadeia);
  const soEle = chave([cadeia[0]]);
  const parcial = chave(cadeia.slice(0, Math.max(1, cadeia.length - 1)));
  return {
    ...base,
    modo: nivel === 4 ? "hierarquia" : "propriedades-combinadas",
    figuras: nivel === 4
      ? [quadrilateroFigura(alvo, alvo.familia, giro)]
      : [quadrilateroFigura(alvo, alvo.familia, giro), quadrilateroFigura(alvo, `${alvo.familia}-girado`, giroDaCopia(giro))],
    resposta,
    opcoes: options(resposta, cadeia.map((nome, indice) => indice === 0 ? nome[0].toUpperCase() + nome.slice(1) : nome).join(", ").replace(/, ([^,]*)$/, " e $1"), [
      { value: soEle, label: `Só ${cadeia[0]}`, misconception: PoligonosMisconception.CATEGORIAS_EXCLUSIVAS },
      { value: parcial, label: `${cadeia[0][0].toUpperCase() + cadeia[0].slice(1)}, mas não ${cadeia[cadeia.length - 1]}`, misconception: PoligonosMisconception.SO_UM_CRITERIO },
      { value: "nao-na-orientacao", label: `Só seria ${cadeia[cadeia.length - 1]} sem estar girado`, misconception: PoligonosMisconception.ORIENTACAO_FIXA },
    ]),
    criterio: nivel === 4 ? "hierarquia" : "combinado",
    hierarquia: true,
    quadradoTambemRetangulo: true,
    lacosAninhados: cadeia.slice(0, -1).map((nome, indice) => `${nome}s⊂${cadeia[indice + 1]}s`).concat("paralelogramos⊂quadriláteros"),
    propriedadesCombinadas: true,
    criterios: alvo.criterios,
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
