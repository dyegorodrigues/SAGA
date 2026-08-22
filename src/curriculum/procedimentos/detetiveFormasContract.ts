import { Evidencia } from "../../constants/evidencias";
import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const DetetiveFormasMisconception = {
  CONTA_ERRADO_LADOS: "conta-errado-lados",
  CONFUNDE_LADO_CANTO: "confunde-lado-canto",
  EIXO_ERRADO: "eixo-errado",
  SO_EIXO_VERTICAL: "so-eixo-vertical",
} as const;

export type DetetiveFormasMisconceptionTag = typeof DetetiveFormasMisconception[keyof typeof DetetiveFormasMisconception];

/**
 * Apelido local do catálogo central, nunca uma segunda string.
 *
 * O nome da condição vive em `constants/evidencias.ts` porque ficha e emissor
 * moram longe um do outro: declarar aqui um literal próprio é exatamente a
 * divergência silenciosa que o catálogo existe para impedir.
 */
export const DetetiveFormasEvidence = {
  SIMETRIA_NIVEL_4: Evidencia.SIMETRIA_EIXO,
} as const;

export type DetetiveFormasModo =
  | "atributos-lados"
  | "atributos-cantos"
  | "atributos-contorno"
  | "simetria-eixo"
  | "simetria-completar";

export type DetetiveFormasEixo = "vertical" | "horizontal" | "diagonal" | "diagonal-oposta";
export type DetetiveFormasFigura = "circulo" | "quadrado" | "triangulo" | "retangulo";

export interface DetetiveFormasAfirmacao {
  id: string;
  texto: string;
  correta: boolean;
}

export interface DetetiveFormasPonto {
  id: string;
  x: number;
  y: number;
  origem?: boolean;
  resposta?: boolean;
}

export interface DetetiveFormasF58Spec {
  nivel: number;
  modo: DetetiveFormasModo;
  figura: DetetiveFormasFigura;
  giro: number;
  resposta: string;
  afirmacoes?: DetetiveFormasAfirmacao[];
  eixoCorreto?: DetetiveFormasEixo;
  eixosDisponiveis?: DetetiveFormasEixo[];
  pontos?: DetetiveFormasPonto[];
  eixoGrade?: number;
}

export interface DetetiveFormasResolutionShow {
  figura: DetetiveFormasFigura;
  giro: number;
  ladosDestacados?: number[];
  cantosDestacados?: boolean;
  contornoDestacado?: boolean;
  eixo?: DetetiveFormasEixo;
  dobrar?: boolean;
  completarSimetria?: boolean;
  resposta?: string;
}

const clampLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level)));

const canonicalSelection = (ids: string[]) => [...ids].sort().join("|");

function attrSpec(nivel: 1 | 2 | 3): DetetiveFormasF58Spec {
  if (nivel === 1) {
    const afirmacoes: DetetiveFormasAfirmacao[] = [
      { id: "3-lados", texto: "Tem 3 lados.", correta: false },
      { id: "4-lados", texto: "Tem 4 lados.", correta: true },
      { id: "nenhum-lado-reto", texto: "Não tem lado reto.", correta: false },
    ];
    return { nivel, modo: "atributos-lados", figura: "quadrado", giro: 0, afirmacoes, resposta: canonicalSelection(afirmacoes.filter(a => a.correta).map(a => a.id)) };
  }

  if (nivel === 2) {
    const afirmacoes: DetetiveFormasAfirmacao[] = [
      { id: "4-lados", texto: "Tem 4 lados.", correta: true },
      { id: "4-cantos-quadrados", texto: "Tem 4 cantos quadrados.", correta: true },
      { id: "3-cantos", texto: "Tem 3 cantos.", correta: false },
    ];
    return { nivel, modo: "atributos-cantos", figura: "retangulo", giro: 0, afirmacoes, resposta: canonicalSelection(afirmacoes.filter(a => a.correta).map(a => a.id)) };
  }

  const afirmacoes: DetetiveFormasAfirmacao[] = [
    { id: "contorno-curvo", texto: "O contorno é curvo.", correta: true },
    { id: "tem-cantos", texto: "Tem cantos.", correta: false },
    { id: "tem-lados-retos", texto: "Tem lados retos.", correta: false },
  ];
  return { nivel, modo: "atributos-contorno", figura: "circulo", giro: 0, afirmacoes, resposta: canonicalSelection(afirmacoes.filter(a => a.correta).map(a => a.id)) };
}

function symmetryAxisSpec(rng: () => number): DetetiveFormasF58Spec {
  const eixosDisponiveis: DetetiveFormasEixo[] = ["vertical", "horizontal", "diagonal", "diagonal-oposta"];
  const eixosValidos: DetetiveFormasEixo[] = ["vertical", "horizontal", "diagonal"];
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  const eixoCorreto = eixosValidos[Math.floor(safe * eixosValidos.length)];
  const giroPorEixo: Record<DetetiveFormasEixo, number> = {
    vertical: 0,
    horizontal: 90,
    diagonal: 45,
    "diagonal-oposta": 135,
  };
  return {
    nivel: 4,
    modo: "simetria-eixo",
    figura: "triangulo",
    giro: giroPorEixo[eixoCorreto],
    resposta: eixoCorreto,
    eixoCorreto,
    eixosDisponiveis,
  };
}

function symmetryCompleteSpec(): DetetiveFormasF58Spec {
  const pontos: DetetiveFormasPonto[] = [
    { id: "origem-a", x: 1, y: 1, origem: true },
    { id: "origem-b", x: 1, y: 3, origem: true },
    { id: "reflexo-a", x: 5, y: 1 },
    { id: "candidato-correto", x: 5, y: 3, resposta: true },
    { id: "candidato-alto", x: 5, y: 2 },
    { id: "candidato-perto", x: 4, y: 3 },
  ];
  return {
    nivel: 5,
    modo: "simetria-completar",
    figura: "quadrado",
    giro: 0,
    resposta: "candidato-correto",
    pontos,
    eixoGrade: 3,
  };
}

export function construirDetetiveFormasSpec(level: number, rng: () => number = Math.random): DetetiveFormasF58Spec {
  const nivel = clampLevel(level);
  if (nivel <= 3) return attrSpec(nivel as 1 | 2 | 3);
  if (nivel === 4) return symmetryAxisSpec(rng);
  return symmetryCompleteSpec();
}

export function construirDetetiveFormasResolucao(spec: DetetiveFormasF58Spec): ResolucaoDeclarativa<DetetiveFormasResolutionShow, string, DetetiveFormasMisconceptionTag> {
  const inicial: DetetiveFormasResolutionShow = { figura: spec.figura, giro: spec.giro };
  const corrigePorNivel: Record<number, DetetiveFormasMisconceptionTag[]> = {
    1: [DetetiveFormasMisconception.CONTA_ERRADO_LADOS],
    2: [DetetiveFormasMisconception.CONFUNDE_LADO_CANTO],
    3: [],
    4: [DetetiveFormasMisconception.EIXO_ERRADO, DetetiveFormasMisconception.SO_EIXO_VERTICAL],
    5: [DetetiveFormasMisconception.EIXO_ERRADO],
  };

  const showFinal: DetetiveFormasResolutionShow = spec.nivel === 1
    ? { ...inicial, ladosDestacados: [0, 1, 2, 3], resposta: spec.resposta }
    : spec.nivel === 2
      ? { ...inicial, cantosDestacados: true, resposta: spec.resposta }
      : spec.nivel === 3
        ? { ...inicial, contornoDestacado: true, resposta: spec.resposta }
        : spec.nivel === 4
          ? { ...inicial, eixo: spec.eixoCorreto, dobrar: true, resposta: spec.resposta }
          : { ...inicial, completarSimetria: true, resposta: spec.resposta };

  return {
    estadoInicial: inicial,
    passos: [
      {
        id: spec.nivel <= 3 ? "observar-propriedade" : "observar-simetria",
        say: spec.nivel <= 3
          ? "Olhe a forma e procure propriedades que não mudam."
          : "Imagine a dobra: as duas metades precisam coincidir.",
        show: inicial,
        corrige: corrigePorNivel[spec.nivel],
        parcial: "observado",
      },
      {
        id: spec.nivel <= 3 ? "provar-pelo-desenho" : "provar-pela-dobra",
        say: spec.nivel <= 3
          ? "Confira a propriedade diretamente no contorno da figura."
          : "Faça a dobra mental e confira se cada ponto encontra seu reflexo.",
        show: showFinal,
        corrige: corrigePorNivel[spec.nivel],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

export function construirDetetiveFormasQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.03") throw new Error(`detetiveFormasContract recebeu ${ficha.id}.`);
  const spec = construirDetetiveFormasSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.03 sem micro do nível ${spec.nivel}.`);
  const rt = ficha.niveis?.[spec.nivel]?.rt_alvo;
  const prompt = spec.nivel <= 3
    ? "Como você descreve esta forma? Marque TODAS as afirmações verdadeiras."
    : spec.nivel === 4
      ? "Encontre um eixo de simetria. Ajuste o eixo e depois toque em Dobrar."
      : "Complete a metade que falta para a figura ficar simétrica.";

  return {
    kind: "detetive-formas-f58",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDetetiveFormasResolucao(spec),
    masteryRule: { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes },
    exigeEvidencia: DetetiveFormasEvidence.SIMETRIA_NIVEL_4,
    ...(typeof rt === "number" && rt > 0 ? { rt_max_s: rt / 1000 } : {}),
    uiProps: spec,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
