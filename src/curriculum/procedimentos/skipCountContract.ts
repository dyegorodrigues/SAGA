import type { PassoDeResolucao, ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia, FichaMicro } from "../schema";
import {
  SkipCountMastery,
  SkipCountMisconception,
  type SkipCountMisconception as SkipCountMisconceptionTag,
} from "./skipCountSemantics";

export type SkipCountF30Support = "reta-arcos" | "reta" | "reta-quadrado100" | "sequencia" | "mental";

export interface SkipCountF30Option {
  valor: number;
  misconception?: SkipCountMisconceptionTag;
}

export interface SkipCountF30Spec {
  nivel: number;
  salto: number;
  inicio: number;
  sequencia: number[];
  resposta: number;
  apoio: SkipCountF30Support;
  limite: number;
  mostrarReta: boolean;
  mostrarQuadrado100: boolean;
  opcoes: SkipCountF30Option[];
  enunciado: string;
  falado: string;
}

export interface SkipCountResolutionShow {
  apoio: SkipCountF30Support;
  salto: number;
  sequencia: number[];
  respostaRevelada: number | null;
  multiplosDestacados: number[];
}

const SALTOS_DE_GENERALIZACAO = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function escolher<T>(itens: readonly T[], sorteio: () => number): T {
  return itens[inteiro(0, itens.length - 1, sorteio)];
}

function parametrosDoNivel(nivel: number, sorteio: () => number) {
  if (nivel === 1) return { salto: 2, inicio: 0, apoio: "reta-arcos" as const, limite: 10 };
  if (nivel === 2) return { salto: 10, inicio: 0, apoio: "reta" as const, limite: 100 };
  if (nivel === 3) return { salto: 5, inicio: 0, apoio: "reta-quadrado100" as const, limite: 50 };

  // A §4 da F30 muda de treino dos saltos-âncora para GENERALIZAÇÃO: L4 diz
  // "qualquer" e L5 dá explicitamente o exemplo 3 em 3 a partir de 6. Em F1,
  // 2..10 mantém a tarefa legível e permite provar que o padrão, não a tabuada
  // decorada de 2/5/10, é o objeto de aprendizagem.
  const salto = escolher(SALTOS_DE_GENERALIZACAO, sorteio);
  if (nivel === 4) return { salto, inicio: 0, apoio: "sequencia" as const, limite: 100 };

  const maxInicio = Math.max(1, Math.min(20, 100 - salto * 3));
  const inicio = inteiro(1, maxInicio, sorteio);
  return { salto, inicio, apoio: "mental" as const, limite: 100 };
}

function opcoesDoItem(
  nivel: number,
  salto: number,
  inicio: number,
  ultimo: number,
  resposta: number,
  limite: number,
): SkipCountF30Option[] {
  const candidatos: SkipCountF30Option[] = [
    { valor: resposta },
    { valor: Math.min(limite, ultimo + 1), misconception: SkipCountMisconception.PERDE_O_SALTO },
    { valor: Math.min(limite, ultimo + 2 * salto), misconception: SkipCountMisconception.SALTO_DUPLO },
  ];
  if (nivel === 3) candidatos.push({ valor: Math.min(limite, ultimo + 10), misconception: SkipCountMisconception.SO_DEZENAS });
  if (nivel === 5) {
    const ancoradoNoZero = Math.min(limite, Math.ceil((ultimo + 1) / salto) * salto);
    candidatos.push({ valor: ancoradoNoZero, misconception: SkipCountMisconception.NAO_PARTE_DE });
  }

  const porValor = new Map<number, SkipCountF30Option>();
  for (const candidato of candidatos) {
    if (candidato.valor < 0 || candidato.valor > limite) continue;
    const existente = porValor.get(candidato.valor);
    if (!existente || (!existente.misconception && candidato.misconception)) porValor.set(candidato.valor, candidato);
  }

  // Degenerações de borda não podem apagar a superfície de resposta.
  for (let delta = 1; porValor.size < 3 && delta <= salto + 3; delta += 1) {
    const valor = resposta - delta >= 0 ? resposta - delta : resposta + delta;
    if (valor >= 0 && valor <= limite && valor !== resposta && !porValor.has(valor)) {
      porValor.set(valor, { valor, misconception: SkipCountMisconception.PERDE_O_SALTO });
    }
  }
  return [...porValor.values()].sort((a, b) => a.valor - b.valor);
}

export function construirSkipCountF30Spec(
  nivel: number,
  sorteio: () => number = Math.random,
): SkipCountF30Spec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const { salto, inicio, apoio, limite } = parametrosDoNivel(clamped, sorteio);
  const maxConhecidos = Math.max(2, Math.floor((limite - inicio) / salto) - 1);
  const quantidadeConhecida = inteiro(2, Math.min(5, maxConhecidos), sorteio);
  const sequencia = Array.from({ length: quantidadeConhecida + 1 }, (_, index) => inicio + index * salto);
  const ultimo = sequencia.at(-1)!;
  const resposta = ultimo + salto;
  const mostrarReta = apoio === "reta-arcos" || apoio === "reta" || apoio === "reta-quadrado100";
  const mostrarQuadrado100 = apoio === "reta-quadrado100";

  return {
    nivel: clamped,
    salto,
    inicio,
    sequencia,
    resposta,
    apoio,
    limite,
    mostrarReta,
    mostrarQuadrado100,
    opcoes: opcoesDoItem(clamped, salto, inicio, ultimo, resposta, limite),
    enunciado: clamped === 5
      ? `Continue de ${salto} em ${salto}, começando no ${inicio}.`
      : `Pule de ${salto} em ${salto}!`,
    falado: clamped === 5
      ? `Continue contando de ${salto} em ${salto}, a partir do ${inicio}.`
      : `Pule de ${salto} em ${salto}.`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`AL.03 sem micro do nível ${nivel}.`);
  return micro;
}

export function construirSkipCountF30Resolucao(
  spec: SkipCountF30Spec,
): ResolucaoDeclarativa<SkipCountResolutionShow, number, SkipCountMisconceptionTag> {
  const multiplos = spec.mostrarQuadrado100
    ? Array.from({ length: Math.floor(spec.limite / spec.salto) }, (_, index) => (index + 1) * spec.salto)
    : [];
  const estadoInicial: SkipCountResolutionShow = {
    apoio: spec.apoio,
    salto: spec.salto,
    sequencia: [...spec.sequencia],
    respostaRevelada: null,
    multiplosDestacados: [...multiplos],
  };
  const primeiraCorrecao: SkipCountMisconceptionTag[] = [SkipCountMisconception.PERDE_O_SALTO];
  if (spec.nivel === 3) primeiraCorrecao.push(SkipCountMisconception.SO_DEZENAS);
  const segundaCorrecao: SkipCountMisconceptionTag[] = [SkipCountMisconception.SALTO_DUPLO];
  if (spec.nivel === 5) segundaCorrecao.push(SkipCountMisconception.NAO_PARTE_DE);

  const passos: PassoDeResolucao<SkipCountResolutionShow, number, SkipCountMisconceptionTag>[] = [
    {
      id: "fixar-tamanho-do-salto",
      say: `O salto é sempre ${spec.salto}. Leia a sequência sem voltar a contar de um em um.`,
      show: {
        apoio: spec.apoio,
        salto: spec.salto,
        sequencia: [...spec.sequencia],
        respostaRevelada: null,
        multiplosDestacados: [...multiplos],
      },
      corrige: primeiraCorrecao,
      parcial: spec.sequencia.at(-1),
    },
    {
      id: "produzir-proximo-termo",
      say: `${spec.sequencia.at(-1)} mais um salto de ${spec.salto} chega a ${spec.resposta}.`,
      show: {
        apoio: spec.apoio,
        salto: spec.salto,
        sequencia: [...spec.sequencia, spec.resposta],
        respostaRevelada: spec.resposta,
        multiplosDestacados: [...multiplos],
      },
      corrige: segundaCorrecao,
      parcial: spec.resposta,
    },
  ];

  return { estadoInicial, passos, fallback: 0 };
}

/** Builder especializado W11. O palco compõe a reta compartilhada e Quadrado100. */
export function construirSkipCountF30Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.03") throw new Error(`skipCountContract recebeu ${ficha.id}.`);
  const spec = construirSkipCountF30Spec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "skip-count-f30",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirSkipCountF30Resolucao(spec),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
      evidenciasDistintas: { ...SkipCountMastery.evidenciasDistintas },
    },
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options: spec.opcoes.map(opcao => ({
      value: opcao.valor,
      label: String(opcao.valor),
      ...(opcao.misconception ? { misconception: opcao.misconception } : {}),
    })),
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
