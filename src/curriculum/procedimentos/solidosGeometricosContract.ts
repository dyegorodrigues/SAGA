import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const SolidosGeometricosMisconception = {
  CONFUNDE_PLANO_SOLIDO: "confunde-plano-solido",
  SO_UM_ANGULO: "so-um-angulo",
  PROPRIEDADE_ERRADA: "propriedade-errada",
} as const;
export type SolidosGeometricosMisconceptionTag = typeof SolidosGeometricosMisconception[keyof typeof SolidosGeometricosMisconception];
export type SolidoF59 = "cubo" | "esfera" | "cilindro" | "cone" | "piramide";
export type SolidosGeometricosModo = "nomear-basicos" | "nomear-familia" | "testar-rolagem" | "testar-empilhamento" | "contar-elementos";
export interface SolidosGeometricosOpcao { value: number; label: string; misconception?: SolidosGeometricosMisconceptionTag }
export interface SolidosGeometricosF59Spec {
  nivel: number;
  modo: SolidosGeometricosModo;
  solido: SolidoF59;
  objetivo: string;
  resposta: number;
  opcoes: SolidosGeometricosOpcao[];
  experimento?: "rampa" | "empilhar";
  resultadoExperimento?: boolean;
  contagem?: { faces: number; vertices: number; arestas: number };
  facePlana?: "quadrado" | "circulo" | "triangulo";
  acessibilidade: { toqueAlternativo: true; alvoMinPx: 48 };
}
interface SolidosShow { solido: SolidoF59; girar?: boolean; destacarFace?: boolean; testarRampa?: boolean; testarEmpilhar?: boolean }

const acessibilidade = { toqueAlternativo: true, alvoMinPx: 48 } as const;
const specs: readonly SolidosGeometricosF59Spec[] = [
  { nivel: 1, modo: "nomear-basicos", solido: "cubo", objetivo: "Qual é o nome deste sólido?", resposta: 1, opcoes: [{ value: 1, label: "cubo" }, { value: 2, label: "quadrado", misconception: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO }, { value: 3, label: "esfera" }], facePlana: "quadrado", acessibilidade },
  { nivel: 2, modo: "nomear-familia", solido: "cone", objetivo: "Gire mentalmente o sólido. Qual é o nome dele?", resposta: 1, opcoes: [{ value: 1, label: "cone" }, { value: 2, label: "triângulo", misconception: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO }, { value: 3, label: "cilindro", misconception: SolidosGeometricosMisconception.SO_UM_ANGULO }], facePlana: "circulo", acessibilidade },
  { nivel: 3, modo: "testar-rolagem", solido: "esfera", objetivo: "Faça uma previsão e depois teste: a esfera rola na rampa?", resposta: 1, opcoes: [{ value: 1, label: "rola" }, { value: 2, label: "não rola", misconception: SolidosGeometricosMisconception.PROPRIEDADE_ERRADA }], experimento: "rampa", resultadoExperimento: true, acessibilidade },
  { nivel: 4, modo: "testar-empilhamento", solido: "cubo", objetivo: "O cubo fica estável quando empilhado sobre uma face?", resposta: 1, opcoes: [{ value: 1, label: "empilha" }, { value: 2, label: "sempre rola", misconception: SolidosGeometricosMisconception.PROPRIEDADE_ERRADA }, { value: 3, label: "só funciona nesta posição", misconception: SolidosGeometricosMisconception.SO_UM_ANGULO }], experimento: "empilhar", resultadoExperimento: true, facePlana: "quadrado", acessibilidade },
  { nivel: 5, modo: "contar-elementos", solido: "cubo", objetivo: "Conte os elementos do cubo em qualquer orientação.", resposta: 1, opcoes: [{ value: 1, label: "6 faces, 8 vértices e 12 arestas" }, { value: 2, label: "6 faces, 6 vértices e 8 arestas", misconception: SolidosGeometricosMisconception.SO_UM_ANGULO }, { value: 3, label: "4 lados e 4 cantos", misconception: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO }], contagem: { faces: 6, vertices: 8, arestas: 12 }, facePlana: "quadrado", acessibilidade },
] as const;

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
export function construirSolidosGeometricosF59Spec(level: number): SolidosGeometricosF59Spec {
  const spec = specs[clamp(level) - 1];
  return { ...spec, opcoes: spec.opcoes.map(option => ({ ...option })), contagem: spec.contagem ? { ...spec.contagem } : undefined, acessibilidade: { ...spec.acessibilidade } };
}

export function construirSolidosGeometricosResolucao(spec: SolidosGeometricosF59Spec): ResolucaoDeclarativa<SolidosShow, number, SolidosGeometricosMisconceptionTag> {
  const base = { solido: spec.solido };
  return {
    estadoInicial: base,
    passos: [
      { id: "girar", say: "Veja o sólido por mais de um ângulo antes de decidir.", show: { ...base, girar: true }, corrige: [SolidosGeometricosMisconception.SO_UM_ANGULO], parcial: spec.resposta },
      { id: "observar-superficie", say: "Procure faces planas e partes curvas. A face é só uma parte do sólido.", show: { ...base, destacarFace: true }, corrige: [SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO], parcial: spec.resposta },
      ...(spec.experimento === "rampa" ? [{ id: "testar-rampa", say: "Agora a rampa testa a previsão: a geometria do sólido decide o movimento.", show: { ...base, testarRampa: true }, corrige: [SolidosGeometricosMisconception.PROPRIEDADE_ERRADA], parcial: spec.resposta }] : []),
      ...(spec.experimento === "empilhar" ? [{ id: "testar-empilhamento", say: "Teste uma face plana como base e observe se o sólido fica estável.", show: { ...base, testarEmpilhar: true }, corrige: [SolidosGeometricosMisconception.PROPRIEDADE_ERRADA], parcial: spec.resposta }] : []),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.04 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirSolidosGeometricosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.04") throw new Error(`solidosGeometricosContract recebeu ${ficha.id}.`);
  const spec = construirSolidosGeometricosF59Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.04 sem micro L${spec.nivel}.`);
  const options: Option[] = spec.opcoes;
  return {
    kind: "solidos-geometricos-f59",
    prompt: spec.objetivo,
    audioPrompt: spec.objetivo,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirSolidosGeometricosResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
