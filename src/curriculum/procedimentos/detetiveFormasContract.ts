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

/** O que cada forma realmente tem. As afirmações são conferidas contra isto. */
const FORMAS: Record<DetetiveFormasFigura, { lados: number; cantos: number; curvo: boolean; cantosRetos: boolean }> = {
  circulo: { lados: 0, cantos: 0, curvo: true, cantosRetos: false },
  triangulo: { lados: 3, cantos: 3, curvo: false, cantosRetos: false },
  quadrado: { lados: 4, cantos: 4, curvo: false, cantosRetos: true },
  retangulo: { lados: 4, cantos: 4, curvo: false, cantosRetos: true },
};

const sortear = <T,>(itens: readonly T[], rng: () => number): T => itens[Math.floor(rng() * itens.length)] ?? itens[0];

/**
 * CLASS-003 — a figura do nível é sorteada, e as afirmações verdadeiras com ela.
 *
 * Era uma figura por nível: quadrado, retângulo e círculo. Com a figura fixa,
 * as afirmações verdadeiras eram sempre as mesmas — decorar quais marcar vencia
 * o nível sem olhar a forma desenhada.
 *
 * Cada nível continua olhando para uma propriedade: lados em L1, cantos em L2,
 * contorno em L3. E cada afirmação passa a ser conferida contra `FORMAS`, para
 * que uma figura nova não entre com um enunciado que mente sobre ela.
 */
function attrSpec(nivel: 1 | 2 | 3, rng: () => number): DetetiveFormasF58Spec {
  // O círculo só entra onde a pergunta é sobre contorno: perguntar "quantos
  // lados" de um círculo troca o degrau de L1 por uma pegadinha.
  const figura = nivel === 1
    ? sortear(["quadrado", "retangulo", "triangulo"] as const, rng)
    : nivel === 2
      ? sortear(["quadrado", "retangulo", "triangulo"] as const, rng)
      : sortear(["circulo", "quadrado", "triangulo"] as const, rng);
  const forma = FORMAS[figura];

  const afirmacoes: DetetiveFormasAfirmacao[] = nivel === 1
    ? [
        { id: "3-lados", texto: "Tem 3 lados.", correta: forma.lados === 3 },
        { id: "4-lados", texto: "Tem 4 lados.", correta: forma.lados === 4 },
        { id: "nenhum-lado-reto", texto: "Não tem lado reto.", correta: forma.lados === 0 },
      ]
    : nivel === 2
      ? [
          { id: "4-lados", texto: "Tem 4 lados.", correta: forma.lados === 4 },
          { id: "4-cantos-quadrados", texto: "Tem 4 cantos quadrados.", correta: forma.cantosRetos },
          { id: "3-cantos", texto: "Tem 3 cantos.", correta: forma.cantos === 3 },
        ]
      : [
          { id: "contorno-curvo", texto: "O contorno é curvo.", correta: forma.curvo },
          { id: "tem-cantos", texto: "Tem cantos.", correta: forma.cantos > 0 },
          { id: "tem-lados-retos", texto: "Tem lados retos.", correta: forma.lados > 0 },
        ];

  const modo = nivel === 1 ? "atributos-lados" : nivel === 2 ? "atributos-cantos" : "atributos-contorno";
  return {
    nivel,
    modo,
    figura,
    giro: 0,
    afirmacoes,
    resposta: canonicalSelection(afirmacoes.filter(a => a.correta).map(a => a.id)),
  };
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

/**
 * CLASS-003 — a malha de simetria também é sorteada.
 *
 * O eixo, as origens e o ponto que falta eram fixos, então a criança decorava a
 * casa e acertava sem refletir nada. Os distratores continuam sendo os dois
 * erros que a F58 nomeia: refletir na altura errada e parar antes do eixo.
 */
function symmetryCompleteSpec(rng: () => number = Math.random): DetetiveFormasF58Spec {
  const inteiro = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
  const eixo = inteiro(3, 4);
  const distancia = inteiro(1, eixo - 1);
  const alturaA = inteiro(1, 2);
  const alturaB = alturaA + inteiro(1, 2);
  const espelho = (x: number) => 2 * eixo - x;
  const origemX = eixo - distancia;
  const pontos: DetetiveFormasPonto[] = [
    { id: "origem-a", x: origemX, y: alturaA, origem: true },
    { id: "origem-b", x: origemX, y: alturaB, origem: true },
    { id: "reflexo-a", x: espelho(origemX), y: alturaA },
    { id: "candidato-correto", x: espelho(origemX), y: alturaB, resposta: true },
    // Mesma coluna, altura errada.
    { id: "candidato-alto", x: espelho(origemX), y: alturaB - 1 },
    // Altura certa, mas parou antes de chegar ao espelho.
    { id: "candidato-perto", x: espelho(origemX) - 1, y: alturaB },
  ];
  return { nivel: 5, modo: "simetria-completar", figura: "quadrado", giro: 0, resposta: "candidato-correto", pontos, eixoGrade: eixo };
}

export function construirDetetiveFormasSpec(level: number, rng: () => number = Math.random): DetetiveFormasF58Spec {
  const nivel = clampLevel(level);
  if (nivel <= 3) return attrSpec(nivel as 1 | 2 | 3, rng);
  if (nivel === 4) return symmetryAxisSpec(rng);
  return symmetryCompleteSpec(rng);
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
