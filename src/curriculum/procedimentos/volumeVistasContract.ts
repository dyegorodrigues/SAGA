import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const VolumeVistasMisconception = {
  IGNORA_OCULTOS: "ignora-ocultos",
  VISTA_TROCADA: "vista-trocada",
  SEM_ROTACAO_MENTAL: "sem-rotacao-mental",
} as const;
export type VolumeVistasMisconceptionTag = typeof VolumeVistasMisconception[keyof typeof VolumeVistasMisconception];
export type VolumeVistasModo = "vista-frontal" | "tres-vistas" | "reconstruir-vistas" | "cubos-ocultos" | "desenhar-vistas";
export type VolumeVista = "frente" | "lado" | "cima";

export interface VolumeVistaGrid {
  rows: number;
  cols: number;
  activeCells: number[];
}

export interface VolumeVistasF92Spec {
  ficha: "F92";
  nivel: number;
  modo: VolumeVistasModo;
  primitivas: ["ArrayGrid"];
  visualizacao: "3D";
  alturas: number[][];
  vistas: Record<VolumeVista, VolumeVistaGrid>;
  orientacaoInicial: VolumeVista;
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: VolumeVistasMisconceptionTag }>;
  acessibilidade: { toqueAlternativo: true; snapGeneroso: true; alvoMinPx: 80 };
}

interface VolumeVistasShow {
  mostrar3D?: boolean;
  alfabetizarModo?: "arraygrid-3d";
  girarPara?: VolumeVista;
  destacarVista?: number;
  foco?: "frente" | "tres-vistas" | "reconstrucao" | "ocultos" | "desenho";
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const option = (value: string, label: string, misconception?: VolumeVistasMisconceptionTag) => ({ value, label, ...(misconception ? { misconception } : {}) });

function gridFromColumnHeights(heights: number[]): VolumeVistaGrid {
  const rows = Math.max(...heights, 1);
  const cols = heights.length;
  const activeCells: number[] = [];
  for (let col = 0; col < cols; col += 1) {
    for (let h = 0; h < heights[col]; h += 1) {
      const row = rows - 1 - h;
      activeCells.push(row * cols + col);
    }
  }
  return { rows, cols, activeCells };
}

function topView(alturas: number[][]): VolumeVistaGrid {
  const rows = alturas.length;
  const cols = Math.max(...alturas.map(row => row.length));
  const activeCells: number[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((alturas[row]?.[col] ?? 0) > 0) activeCells.push(row * cols + col);
    }
  }
  return { rows, cols, activeCells };
}

function projetar(alturas: number[][]): Record<VolumeVista, VolumeVistaGrid> {
  const depth = alturas.length;
  const width = Math.max(...alturas.map(row => row.length));
  const frente = Array.from({ length: width }, (_, col) => Math.max(...alturas.map(row => row[col] ?? 0)));
  const lado = Array.from({ length: depth }, (_, row) => Math.max(...(alturas[row] ?? [0])));
  return { frente: gridFromColumnHeights(frente), lado: gridFromColumnHeights(lado), cima: topView(alturas) };
}

function key(grid: VolumeVistaGrid): string {
  return `${grid.rows}x${grid.cols}:${grid.activeCells.join(".")}`;
}

function specBase(nivel: number, modo: VolumeVistasModo, alturas: number[][]): Omit<VolumeVistasF92Spec, "resposta" | "opcoes"> {
  return {
    ficha: "F92",
    nivel,
    modo,
    primitivas: ["ArrayGrid"],
    visualizacao: "3D",
    alturas,
    vistas: projetar(alturas),
    orientacaoInicial: "frente",
    acessibilidade: { toqueAlternativo: true, snapGeneroso: true, alvoMinPx: 80 },
  };
}

export function construirVolumeVistasSpec(level: number): VolumeVistasF92Spec {
  const nivel = clamp(level);
  if (nivel === 1) {
    const base = specBase(nivel, "vista-frontal", [[1, 2, 1], [0, 1, 1]]);
    return {
      ...base,
      resposta: `frente:${key(base.vistas.frente)}`,
      opcoes: [
        option(`frente:${key(base.vistas.frente)}`, "Vista da frente"),
        option(`lado:${key(base.vistas.lado)}`, "Vista do lado", VolumeVistasMisconception.VISTA_TROCADA),
        option(`cima:${key(base.vistas.cima)}`, "Vista de cima", VolumeVistasMisconception.SEM_ROTACAO_MENTAL),
      ],
    };
  }
  if (nivel === 2) {
    const base = specBase(nivel, "tres-vistas", [[2, 1, 0], [1, 2, 1], [0, 1, 1]]);
    return {
      ...base,
      resposta: "frente-lado-cima",
      opcoes: [
        option("frente-lado-cima", "Frente → lado → cima"),
        option("frente-cima-lado", "Frente → cima → lado", VolumeVistasMisconception.VISTA_TROCADA),
        option("mesma-vista", "As três vistas são iguais", VolumeVistasMisconception.SEM_ROTACAO_MENTAL),
      ],
    };
  }
  if (nivel === 3) {
    const base = specBase(nivel, "reconstruir-vistas", [[1, 2], [0, 1]]);
    const target = base.alturas.flat().join("-");
    return {
      ...base,
      resposta: `reconstruir:${target}`,
      opcoes: [
        option(`reconstruir:${target}`, "Construção que reproduz as três vistas"),
        option("reconstruir:2-1-1-0", "Construção girada", VolumeVistasMisconception.VISTA_TROCADA),
        option("reconstruir:1-1-0-1", "Construção sem rotação mental", VolumeVistasMisconception.SEM_ROTACAO_MENTAL),
      ],
    };
  }
  if (nivel === 4) {
    const base = specBase(nivel, "cubos-ocultos", [[3, 1], [2, 1]]);
    const total = base.alturas.flat().reduce((sum, value) => sum + value, 0);
    const aparentes = base.alturas.flat().filter(value => value > 0).length;
    return {
      ...base,
      resposta: String(total),
      opcoes: [
        option(String(total), `${total} cubos`),
        option(String(aparentes), `${aparentes} cubos`, VolumeVistasMisconception.IGNORA_OCULTOS),
        option(String(total - 1), `${total - 1} cubos`, VolumeVistasMisconception.SEM_ROTACAO_MENTAL),
      ],
    };
  }
  const base = specBase(nivel, "desenhar-vistas", [[1, 2, 1], [2, 1, 0]]);
  const resposta = `desenhar:${key(base.vistas.frente)}|${key(base.vistas.lado)}|${key(base.vistas.cima)}`;
  return {
    ...base,
    resposta,
    opcoes: [
      option(resposta, "As três vistas desenhadas corretamente"),
      option(`desenhar:${key(base.vistas.lado)}|${key(base.vistas.frente)}|${key(base.vistas.cima)}`, "Frente e lado trocados", VolumeVistasMisconception.VISTA_TROCADA),
      option("desenhar:sem-rotacao", "Repete a mesma vista três vezes", VolumeVistasMisconception.SEM_ROTACAO_MENTAL),
    ],
  };
}

export function construirVolumeVistasResolucao(spec: VolumeVistasF92Spec): ResolucaoDeclarativa<VolumeVistasShow, string, VolumeVistasMisconceptionTag> {
  if (spec.modo === "vista-frontal") return {
    estadoInicial: { mostrar3D: true, foco: "frente" },
    passos: [
      { id: "girar-frente", say: "Gire a construção até a frente ficar voltada para você; a vista frontal conserva largura e altura, mas esconde a profundidade.", show: { mostrar3D: true, girarPara: "frente", foco: "frente" }, corrige: [VolumeVistasMisconception.VISTA_TROCADA], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "tres-vistas") return {
    estadoInicial: { mostrar3D: true, foco: "tres-vistas" },
    passos: [
      { id: "frente", say: "Primeiro observe a frente: largura e altura aparecem nesta projeção.", show: { girarPara: "frente", destacarVista: 0, foco: "tres-vistas" }, parcial: spec.resposta },
      { id: "lado", say: "Depois gire para o lado: a largura anterior vira profundidade e surge outra silhueta.", show: { girarPara: "lado", destacarVista: 1, foco: "tres-vistas" }, corrige: [VolumeVistasMisconception.VISTA_TROCADA], parcial: spec.resposta },
      { id: "cima", say: "Por fim olhe de cima: vemos quais posições do chão estão ocupadas. Frente, lado e cima descrevem o mesmo objeto.", show: { girarPara: "cima", destacarVista: 2, foco: "tres-vistas" }, corrige: [VolumeVistasMisconception.SEM_ROTACAO_MENTAL], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "reconstruir-vistas") return {
    estadoInicial: { foco: "reconstrucao" },
    passos: [
      { id: "ler-vistas", say: "Leia as três vistas antes de montar: frente dá alturas por coluna, lado confirma profundidade e cima mostra onde existe pilha.", show: { destacarVista: 0, foco: "reconstrucao" }, corrige: [VolumeVistasMisconception.SEM_ROTACAO_MENTAL], parcial: spec.resposta },
      { id: "montar", say: "Reconstrua a construção colocando cubos nas posições do chão até as três vistas coincidirem ao mesmo tempo.", show: { mostrar3D: true, foco: "reconstrucao" }, corrige: [VolumeVistasMisconception.VISTA_TROCADA], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  if (spec.modo === "cubos-ocultos") return {
    estadoInicial: { mostrar3D: true, foco: "ocultos" },
    passos: [
      { id: "camadas", say: "Não conte só o que aparece na superfície. Cada coluna pode esconder cubos atrás ou embaixo; use as vistas para completar o modelo mental.", show: { destacarVista: 0, foco: "ocultos" }, corrige: [VolumeVistasMisconception.IGNORA_OCULTOS], parcial: spec.resposta },
      { id: "total", say: "Some as alturas de todas as pilhas, inclusive os cubos ocultos que não se vêem de uma única direção.", show: { mostrar3D: true, foco: "ocultos" }, corrige: [VolumeVistasMisconception.IGNORA_OCULTOS], parcial: spec.resposta },
    ],
    fallback: 0,
  };
  return {
    estadoInicial: { mostrar3D: true, foco: "desenho" },
    passos: [
      { id: "desenhar-frente", say: "Desenhe por toque a vista da frente, marcando uma célula para cada posição ocupada na projeção.", show: { girarPara: "frente", destacarVista: 0, foco: "desenho" }, parcial: spec.resposta },
      { id: "desenhar-lado", say: "Gire mentalmente para o lado e desenhe a segunda vista sem copiar a primeira.", show: { girarPara: "lado", destacarVista: 1, foco: "desenho" }, corrige: [VolumeVistasMisconception.VISTA_TROCADA], parcial: spec.resposta },
      { id: "desenhar-cima", say: "Finalize desenhando a vista de cima: ela registra as posições ocupadas no chão da construção.", show: { girarPara: "cima", destacarVista: 2, foco: "desenho" }, corrige: [VolumeVistasMisconception.SEM_ROTACAO_MENTAL], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.10 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirVolumeVistasQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.10") throw new Error(`volumeVistasContract recebeu ${ficha.id}.`);
  const spec = construirVolumeVistasSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.10 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "vista-frontal" ? "Qual desenho mostra esta construção olhando de frente?"
    : spec.modo === "tres-vistas" ? "Relacione corretamente as vistas da frente, do lado e de cima."
    : spec.modo === "reconstruir-vistas" ? "Monte a construção que produz estas três vistas."
    : spec.modo === "cubos-ocultos" ? "Quantos cubos existem ao todo, incluindo os que ficam ocultos?"
    : "Desenhe as vistas da frente, do lado e de cima desta construção.";
  const options: Option[] = spec.opcoes;
  return {
    kind: "volume-vistas-f92",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirVolumeVistasResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
