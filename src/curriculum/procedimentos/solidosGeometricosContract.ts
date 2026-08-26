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

/**
 * CLASS-003 — o sólido do nível é sorteado, a escada não.
 *
 * Cada nível tinha um sólido só: cubo, cone, esfera, cubo, cubo. A ficha cobra
 * 3 acertos de 3 em 2 sessões, e a frente da CLASS-007 tornou o experimento
 * obrigatório — a criança testava a MESMA esfera na MESMA rampa seis vezes.
 *
 * Sortear o sólido conserta junto um defeito que o caso fixo escondia: com uma
 * esfera sempre na rampa e um cubo sempre empilhado, a resposta certa era
 * SEMPRE a primeira alternativa, "sim". Uma criança que responde "sim" sem
 * olhar acertava L3 e L4 para sempre. Agora o cubo também vai à rampa e a
 * esfera também vai à pilha, e "não" é resposta certa em parte dos sorteios.
 *
 * `contagem` só vale para cubo e pirâmide. Faces, vértices e arestas de esfera,
 * cilindro e cone não têm resposta única nesta faixa etária — pedir isso seria
 * cobrar convenção, não geometria. É por isso que L5 tem tabela própria.
 */
interface PerfilSolido {
  solido: SolidoF59;
  nome: string;
  /** Figura plana com que a criança confunde o sólido. */
  plano: string;
  facePlana?: "quadrado" | "circulo" | "triangulo";
  rola: boolean;
  empilha: boolean;
  contagem?: { faces: number; vertices: number; arestas: number };
}

const PERFIS: readonly PerfilSolido[] = [
  { solido: "cubo", nome: "cubo", plano: "quadrado", facePlana: "quadrado", rola: false, empilha: true, contagem: { faces: 6, vertices: 8, arestas: 12 } },
  { solido: "esfera", nome: "esfera", plano: "círculo", rola: true, empilha: false },
  { solido: "cilindro", nome: "cilindro", plano: "retângulo", facePlana: "circulo", rola: true, empilha: true },
  { solido: "cone", nome: "cone", plano: "triângulo", facePlana: "circulo", rola: true, empilha: true },
  { solido: "piramide", nome: "pirâmide", plano: "triângulo", facePlana: "quadrado", rola: false, empilha: true, contagem: { faces: 5, vertices: 5, arestas: 8 } },
];

const perfilDe = (solido: SolidoF59) => PERFIS.find(perfil => perfil.solido === solido)!;
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/** Outro sólido, para o distrator que reconhece a forma só numa orientação. */
function outroSolido(perfil: PerfilSolido): PerfilSolido {
  const candidatos = PERFIS.filter(outro => outro.solido !== perfil.solido && outro.nome !== perfil.plano);
  return escolher(candidatos);
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

export function construirSolidosGeometricosF59Spec(level: number): SolidosGeometricosF59Spec {
  const nivel = clamp(level);
  const base = { nivel, acessibilidade: { ...acessibilidade } };

  if (nivel === 1 || nivel === 2) {
    const perfil = nivel === 1
      ? escolher(PERFIS.filter(p => p.solido === "cubo" || p.solido === "esfera"))
      : escolher(PERFIS.filter(p => p.solido !== "cubo" && p.solido !== "esfera"));
    const outro = outroSolido(perfil);
    return {
      ...base,
      modo: nivel === 1 ? "nomear-basicos" : "nomear-familia",
      solido: perfil.solido,
      objetivo: nivel === 1 ? "Qual é o nome deste sólido?" : "Gire mentalmente o sólido. Qual é o nome dele?",
      resposta: 1,
      opcoes: [
        { value: 1, label: perfil.nome },
        { value: 2, label: perfil.plano, misconception: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO },
        // Antes este distrator não tinha tag: errar aqui não gerava hipótese
        // nenhuma no Radar, e trocar um sólido por outro é justamente o erro de
        // quem reconhece a forma só numa orientação.
        { value: 3, label: outro.nome, misconception: SolidosGeometricosMisconception.SO_UM_ANGULO },
      ],
      facePlana: perfil.facePlana,
    };
  }

  if (nivel === 3 || nivel === 4) {
    const rolagem = nivel === 3;
    const perfil = escolher(PERFIS);
    const acontece = rolagem ? perfil.rola : perfil.empilha;
    const sim = rolagem ? "rola" : "empilha";
    const nao = rolagem ? "não rola" : "sempre rola";
    return {
      ...base,
      modo: rolagem ? "testar-rolagem" : "testar-empilhamento",
      solido: perfil.solido,
      objetivo: rolagem
        ? `Faça uma previsão e depois teste: o ${perfil.nome} rola na rampa?`
        : `O ${perfil.nome} fica estável quando empilhado sobre uma face?`,
      // A resposta acompanha o sólido: com a esfera sempre na rampa e o cubo
      // sempre na pilha, "sim" acertava para sempre sem olhar a figura.
      resposta: acontece ? 1 : 2,
      opcoes: [
        { value: 1, label: sim, ...(acontece ? {} : { misconception: SolidosGeometricosMisconception.PROPRIEDADE_ERRADA }) },
        { value: 2, label: nao, ...(acontece ? { misconception: SolidosGeometricosMisconception.PROPRIEDADE_ERRADA } : {}) },
        { value: 3, label: "só funciona nesta posição", misconception: SolidosGeometricosMisconception.SO_UM_ANGULO },
      ],
      experimento: rolagem ? "rampa" : "empilhar",
      resultadoExperimento: acontece,
      facePlana: perfil.facePlana,
    };
  }

  const perfil = escolher(PERFIS.filter(p => p.contagem));
  const { faces, vertices, arestas } = perfil.contagem!;
  return {
    ...base,
    modo: "contar-elementos",
    solido: perfil.solido,
    objetivo: `Conte os elementos do ${perfil.nome} em qualquer orientação.`,
    resposta: 1,
    opcoes: [
      { value: 1, label: `${faces} faces, ${vertices} vértices e ${arestas} arestas` },
      { value: 2, label: `${faces} faces, ${arestas} vértices e ${vertices} arestas`, misconception: SolidosGeometricosMisconception.SO_UM_ANGULO },
      { value: 3, label: `${faces - 2} lados e ${faces - 2} cantos`, misconception: SolidosGeometricosMisconception.CONFUNDE_PLANO_SOLIDO },
    ],
    contagem: { faces, vertices, arestas },
    facePlana: perfil.facePlana,
  };
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
