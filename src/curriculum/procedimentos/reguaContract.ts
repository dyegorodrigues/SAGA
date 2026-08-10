import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { Question } from "../../types";

export type ModoRegua = "informal" | "ler" | "alinhar" | "comparar" | "estimar";
export type UnidadeRegua = "clipes" | "cm";

export interface ItemRegua {
  id: string;
  nome: string;
  emoji: string;
  comprimentoCm: number;
}

export interface ReguaSpec {
  nivel: number;
  modo: ModoRegua;
  unidade: UnidadeRegua;
  itens: ItemRegua[];
  escalaMax: number;
  /** Qual marca começa alinhada à ponta do objeto. Zero é o alinhamento correto. */
  offsetInicialCm: number;
  reguaAlinhada: boolean;
  resposta: string;
  valorCerto?: number;
  unidadeCerta?: "cm";
  itemCerto?: string;
  alternativas: number[];
  estimativas?: number[];
  enunciado: string;
  falado: string;
}

const OBJETOS = [
  { id: "lapis", nome: "lápis", emoji: "✏️" },
  { id: "borracha", nome: "borracha", emoji: "▰" },
  { id: "carrinho", nome: "carrinho", emoji: "🚗" },
  { id: "livro", nome: "livro", emoji: "📕" },
  { id: "pincel", nome: "pincel", emoji: "🖌️" },
] as const;

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function item(
  comprimentoCm: number,
  sorteio: () => number,
  suffix = "",
  excluirBaseId?: string,
): ItemRegua {
  let indice = inteiro(0, OBJETOS.length - 1, sorteio);
  if (excluirBaseId && OBJETOS[indice].id === excluirBaseId) {
    indice = (indice + 1) % OBJETOS.length;
  }
  const base = OBJETOS[indice];
  return { ...base, id: `${base.id}${suffix}`, comprimentoCm };
}

function alternativas(valor: number, min = 1, max = 14): number[] {
  const candidatas = [valor, valor + 1, valor - 1, valor + 2, valor - 2]
    .filter(n => n >= min && n <= max);
  return [...new Set(candidatas)].slice(0, 4);
}

function estimativas(valor: number): number[] {
  const candidatas = [valor - 2, valor, valor + 2, valor + 4]
    .filter(n => n > 0 && n <= 16);
  return [...new Set(candidatas)].slice(0, 4);
}

export function construirReguaSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): ReguaSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));

  if (clamped === 1) {
    const valor = inteiro(3, 6, sorteio);
    const alvo = item(valor, sorteio);
    return {
      nivel: 1,
      modo: "informal",
      unidade: "clipes",
      itens: [alvo],
      escalaMax: 8,
      offsetInicialCm: 0,
      reguaAlinhada: true,
      resposta: `${valor}:clipes`,
      valorCerto: valor,
      alternativas: alternativas(valor, 1, 8),
      enunciado: `Quantos clipes medem o ${alvo.nome}?`,
      falado: `Meça o ${alvo.nome} usando os clipes iguais.`,
    };
  }

  if (clamped === 4) {
    const a = inteiro(4, 8, sorteio);
    let b = inteiro(5, 11, sorteio);
    if (b === a) b = Math.min(12, b + 1);
    const primeiro = item(a, sorteio, "-a");
    const primeiroBaseId = primeiro.id.replace(/-a$/, "");
    const segundo = item(b, sorteio, "-b", primeiroBaseId);
    const itens = [primeiro, segundo];
    const maior = itens[0].comprimentoCm > itens[1].comprimentoCm ? itens[0] : itens[1];
    return {
      nivel: 4,
      modo: "comparar",
      unidade: "cm",
      itens,
      escalaMax: 12,
      offsetInicialCm: 0,
      reguaAlinhada: true,
      resposta: `item:${maior.id}`,
      itemCerto: maior.id,
      alternativas: [],
      enunciado: "Meça os dois objetos. Qual é mais comprido?",
      falado: "Meça os dois objetos a partir do zero e escolha o mais comprido.",
    };
  }

  const valor = clamped === 2 ? inteiro(3, 10, sorteio) : inteiro(4, 12, sorteio);
  const alvo = item(valor, sorteio);

  if (clamped === 2) {
    return {
      nivel: 2,
      modo: "ler",
      unidade: "cm",
      itens: [alvo],
      escalaMax: 12,
      offsetInicialCm: 0,
      reguaAlinhada: true,
      resposta: `${valor}:cm`,
      valorCerto: valor,
      unidadeCerta: "cm",
      alternativas: alternativas(valor),
      enunciado: `Quantos centímetros mede o ${alvo.nome}?`,
      falado: `A régua já está alinhada. Leia onde termina o ${alvo.nome}.`,
    };
  }

  const offset = inteiro(1, 2, sorteio);
  if (clamped === 3) {
    return {
      nivel: 3,
      modo: "alinhar",
      unidade: "cm",
      itens: [alvo],
      escalaMax: 12,
      offsetInicialCm: offset,
      reguaAlinhada: false,
      resposta: `${valor}:cm`,
      valorCerto: valor,
      unidadeCerta: "cm",
      alternativas: alternativas(valor),
      enunciado: `Alinhe a régua e meça o ${alvo.nome}.`,
      falado: `Alinhe o zero da régua com a ponta do ${alvo.nome}. Depois leia onde ele termina.`,
    };
  }

  return {
    nivel: 5,
    modo: "estimar",
    unidade: "cm",
    itens: [alvo],
    escalaMax: 14,
    offsetInicialCm: offset,
    reguaAlinhada: false,
    resposta: `${valor}:cm`,
    valorCerto: valor,
    unidadeCerta: "cm",
    alternativas: alternativas(valor, 1, 14),
    estimativas: estimativas(valor),
    enunciado: `Primeiro estime. Depois meça o ${alvo.nome}.`,
    falado: `Quanto você acha que mede? Faça uma estimativa e depois confira com a régua.`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`GM.05 sem micro do nível ${nivel}.`);
  return micro;
}

/** Builder especializado F61; o contrato procedural não altera outros consumidores de medidas. */
export function construirReguaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.05") throw new Error(`reguaContract recebeu ${ficha.id}.`);
  const spec = construirReguaSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "regua-f61",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
    },
    ...(micro.dominio.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
    options: undefined,
  };
}
