import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const MapaTesouroMisconception = {
  INVERTE_COORDENADAS: "inverte-coordenadas",
  SO_UMA_COORDENADA: "so-uma-coordenada",
  CONFUNDE_LINHA_COLUNA: "confunde-linha-coluna",
} as const;
export type MapaTesouroMisconceptionTag = typeof MapaTesouroMisconception[keyof typeof MapaTesouroMisconception];
export type MapaTesouroModo = "achar-objeto" | "dizer-coordenada" | "colocar-objeto" | "descrever-caminho" | "pre-cartesiano";

export interface MapaTesouroOpcao { value: number; label: string; misconception?: MapaTesouroMisconceptionTag }
export interface MapaTesouroF60Spec {
  nivel: number;
  modo: MapaTesouroModo;
  gradeSize: number;
  colunas: string[];
  linhas: string[];
  alvoColuna: number;
  alvoLinha: number;
  objetivo: string;
  resposta: number;
  opcoes: MapaTesouroOpcao[];
}
interface MapaTesouroShow {
  gradeSize: number;
  coluna: number;
  linha: number;
  destacarColuna?: boolean;
  destacarLinha?: boolean;
  piscarIntersecao?: boolean;
}

const specs: readonly MapaTesouroF60Spec[] = [
  { nivel: 1, modo: "achar-objeto", gradeSize: 3, colunas: ["A", "B", "C"], linhas: ["1", "2", "3"], alvoColuna: 2, alvoLinha: 2, objetivo: "Ache a coluna B e depois a linha 2.", resposta: 22, opcoes: [{ value: 22, label: "B2" }, { value: 12, label: "A2", misconception: MapaTesouroMisconception.SO_UMA_COORDENADA }, { value: 21, label: "B1", misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA }, { value: 33, label: "C3" }] },
  { nivel: 2, modo: "dizer-coordenada", gradeSize: 5, colunas: ["A", "B", "C", "D", "E"], linhas: ["1", "2", "3", "4", "5"], alvoColuna: 3, alvoLinha: 4, objetivo: "Diga a coordenada do tesouro.", resposta: 34, opcoes: [{ value: 34, label: "C4" }, { value: 43, label: "D3", misconception: MapaTesouroMisconception.INVERTE_COORDENADAS }, { value: 30, label: "C", misconception: MapaTesouroMisconception.SO_UMA_COORDENADA }, { value: 24, label: "B4", misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA }] },
  { nivel: 3, modo: "colocar-objeto", gradeSize: 5, colunas: ["A", "B", "C", "D", "E"], linhas: ["1", "2", "3", "4", "5"], alvoColuna: 4, alvoLinha: 2, objetivo: "Coloque o tesouro em D2.", resposta: 42, opcoes: [{ value: 42, label: "D2" }, { value: 24, label: "B4", misconception: MapaTesouroMisconception.INVERTE_COORDENADAS }, { value: 41, label: "D1", misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA }, { value: 20, label: "linha 2", misconception: MapaTesouroMisconception.SO_UMA_COORDENADA }] },
  { nivel: 4, modo: "descrever-caminho", gradeSize: 5, colunas: ["A", "B", "C", "D", "E"], linhas: ["1", "2", "3", "4", "5"], alvoColuna: 4, alvoLinha: 2, objetivo: "Saia de A4 e chegue a D2.", resposta: 1, opcoes: [{ value: 1, label: "3 à direita, 2 para cima" }, { value: 2, label: "2 à direita, 3 para cima", misconception: MapaTesouroMisconception.INVERTE_COORDENADAS }, { value: 3, label: "3 à direita", misconception: MapaTesouroMisconception.SO_UMA_COORDENADA }, { value: 4, label: "3 à esquerda, 2 para baixo", misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA }] },
  { nivel: 5, modo: "pre-cartesiano", gradeSize: 5, colunas: ["1", "2", "3", "4", "5"], linhas: ["1", "2", "3", "4", "5"], alvoColuna: 3, alvoLinha: 2, objetivo: "Use os dois eixos numéricos.", resposta: 32, opcoes: [{ value: 32, label: "(3, 2)" }, { value: 23, label: "(2, 3)", misconception: MapaTesouroMisconception.INVERTE_COORDENADAS }, { value: 30, label: "3", misconception: MapaTesouroMisconception.SO_UMA_COORDENADA }, { value: 42, label: "(4, 2)", misconception: MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA }] },
] as const;

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
export function construirMapaTesouroF60Spec(level: number): MapaTesouroF60Spec {
  const spec = specs[clamp(level) - 1];
  return { ...spec, colunas: [...spec.colunas], linhas: [...spec.linhas], opcoes: spec.opcoes.map(option => ({ ...option })) };
}

export function construirMapaTesouroResolucao(spec: MapaTesouroF60Spec): ResolucaoDeclarativa<MapaTesouroShow, number, MapaTesouroMisconceptionTag> {
  const base = { gradeSize: spec.gradeSize, coluna: spec.alvoColuna, linha: spec.alvoLinha };
  return {
    estadoInicial: base,
    passos: [
      { id: "localizar-coluna", say: `Primeiro ache a coluna ${spec.colunas[spec.alvoColuna - 1]}.`, show: { ...base, destacarColuna: true }, corrige: [MapaTesouroMisconception.CONFUNDE_LINHA_COLUNA, MapaTesouroMisconception.INVERTE_COORDENADAS], parcial: spec.resposta },
      { id: "localizar-linha", say: `Agora ache a linha ${spec.linhas[spec.alvoLinha - 1]}.`, show: { ...base, destacarColuna: true, destacarLinha: true }, corrige: [MapaTesouroMisconception.SO_UMA_COORDENADA], parcial: spec.resposta },
      { id: "cruzar-informacoes", say: "A posição é a célula onde as duas faixas se cruzam.", show: { ...base, destacarColuna: true, destacarLinha: true, piscarIntersecao: true }, corrige: [MapaTesouroMisconception.INVERTE_COORDENADAS], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.05 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirMapaTesouroQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.05") throw new Error(`mapaTesouroContract recebeu ${ficha.id}.`);
  const spec = construirMapaTesouroF60Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.05 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "colocar-objeto" ? spec.objetivo : spec.modo === "descrever-caminho" ? `${spec.objetivo} Qual caminho funciona?` : spec.modo === "pre-cartesiano" ? "Onde está o tesouro? Responda na ordem horizontal, vertical." : "Onde está o tesouro? Primeiro a coluna, depois a linha.";
  const options: Option[] = spec.opcoes;
  return {
    kind: "mapa-tesouro-f60",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirMapaTesouroResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
