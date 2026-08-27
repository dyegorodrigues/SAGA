import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX = "igualdade-equilibrio-l4-";

export const IgualdadeEquilibrioMisconception = {
  IGUAL_E_RESULTADO: "igual-e-resultado",
  SOMA_TUDO: "soma-tudo",
  IGNORA_TERMO: "ignora-termo",
} as const;
export type IgualdadeEquilibrioMisconceptionTag = typeof IgualdadeEquilibrioMisconception[keyof typeof IgualdadeEquilibrioMisconception];

export type IgualdadeEquilibrioModo = "igualdade-simples" | "soma-um-lado" | "incognita-meio" | "somas-dois-lados" | "saco-fechado";
export interface IgualdadeTermo { valor: number; oculto?: boolean; saco?: boolean; }
export interface IgualdadeOpcao { value: number; label: string; misconception?: IgualdadeEquilibrioMisconceptionTag; }
export interface IgualdadeEquilibrioF46Spec {
  nivel: number;
  modo: IgualdadeEquilibrioModo;
  caso: string;
  esquerda: IgualdadeTermo[];
  direita: IgualdadeTermo[];
  resposta: number;
  equacao: string;
  opcoes: IgualdadeOpcao[];
}
interface Show { esquerda: IgualdadeTermo[]; direita: IgualdadeTermo[]; equacao: string; equilibrar?: boolean; destacarIgual?: boolean; }

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
/** Inteiro no intervalo, pelo mesmo `rng` injetado que o resto do contrato usa. */
function ri(min: number, max: number, rng: () => number): number {
  const bruto = rng();
  const seguro = Number.isFinite(bruto) ? Math.max(0, Math.min(0.999999, bruto)) : 0;
  return min + Math.floor(seguro * (max - min + 1));
}

function escolher<T>(xs: readonly T[], rng: () => number): T {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return xs[Math.floor(safe * xs.length)] ?? xs[0];
}

const CASOS_L4 = [
  { caso: "caixa-mais-2-igual-5-mais-1", esquerda: [{ valor: 4, oculto: true }, { valor: 2 }], direita: [{ valor: 5 }, { valor: 1 }], resposta: 4, equacao: "□ + 2 = 5 + 1" },
  { caso: "3-mais-caixa-igual-4-mais-5", esquerda: [{ valor: 3 }, { valor: 6, oculto: true }], direita: [{ valor: 4 }, { valor: 5 }], resposta: 6, equacao: "3 + □ = 4 + 5" },
  { caso: "caixa-mais-4-igual-6-mais-2", esquerda: [{ valor: 4, oculto: true }, { valor: 4 }], direita: [{ valor: 6 }, { valor: 2 }], resposta: 4, equacao: "□ + 4 = 6 + 2" },
] as const;

function alternativas(resposta: number): IgualdadeOpcao[] {
  const candidatos: IgualdadeOpcao[] = [
    { value: resposta, label: String(resposta) },
    { value: resposta + 2, label: String(resposta + 2), misconception: IgualdadeEquilibrioMisconception.IGUAL_E_RESULTADO },
    { value: resposta + 3, label: String(resposta + 3), misconception: IgualdadeEquilibrioMisconception.SOMA_TUDO },
    { value: Math.max(0, resposta - 1), label: String(Math.max(0, resposta - 1)), misconception: IgualdadeEquilibrioMisconception.IGNORA_TERMO },
  ];
  return candidatos.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index);
}

export function construirIgualdadeEquilibrioSpec(level: number, rng: () => number = Math.random): IgualdadeEquilibrioF46Spec {
  const nivel = clamp(level);
  let modo: IgualdadeEquilibrioModo;
  let caso: string;
  let esquerda: IgualdadeTermo[];
  let direita: IgualdadeTermo[];
  let resposta: number;
  let equacao: string;

  if (nivel === 1) {
    // O peso é sorteado; o que o nível ensina é que a caixa vale o MESMO que
    // está do outro lado, e isso não depende de qual número está lá.
    const peso = ri(2, 9, rng);
    modo = "igualdade-simples"; caso = `${peso}-igual-caixa`; esquerda = [{ valor: peso }]; direita = [{ valor: peso, oculto: true }]; resposta = peso; equacao = `${peso} = □`;
  } else if (nivel === 2) {
    const primeira = ri(2, 8, rng);
    const segunda = ri(2, 8, rng);
    modo = "soma-um-lado"; caso = `${primeira}-mais-${segunda}-igual-caixa`; esquerda = [{ valor: primeira }, { valor: segunda }]; direita = [{ valor: primeira + segunda, oculto: true }]; resposta = primeira + segunda; equacao = `${primeira} + ${segunda} = □`;
  } else if (nivel === 3) {
    const visivel = ri(2, 8, rng);
    const escondida = ri(2, 8, rng);
    modo = "incognita-meio"; caso = `${visivel}-mais-caixa-igual-${visivel + escondida}`; esquerda = [{ valor: visivel }, { valor: escondida, oculto: true }]; direita = [{ valor: visivel + escondida }]; resposta = escondida; equacao = `${visivel} + □ = ${visivel + escondida}`;
  } else if (nivel === 4) {
    const escolhido = escolher(CASOS_L4, rng);
    modo = "somas-dois-lados"; caso = escolhido.caso; esquerda = escolhido.esquerda.map(item => ({ ...item })); direita = escolhido.direita.map(item => ({ ...item })); resposta = escolhido.resposta; equacao = escolhido.equacao;
  } else {
    const foraDoSaco = ri(2, 8, rng);
    const dentroDoSaco = ri(2, 8, rng);
    modo = "saco-fechado"; caso = `saco-mais-${foraDoSaco}-igual-${foraDoSaco + dentroDoSaco}`; esquerda = [{ valor: dentroDoSaco, oculto: true, saco: true }, { valor: foraDoSaco }]; direita = [{ valor: foraDoSaco + dentroDoSaco }]; resposta = dentroDoSaco; equacao = `saco + ${foraDoSaco} = ${foraDoSaco + dentroDoSaco}`;
  }

  return { nivel, modo, caso, esquerda, direita, resposta, equacao, opcoes: alternativas(resposta) };
}

export function evidenciasIgualdadeEquilibrio(spec: IgualdadeEquilibrioF46Spec, correta: boolean): string[] {
  return correta && spec.nivel === 4 ? [`${IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX}${spec.caso}`] : [];
}

export function construirIgualdadeEquilibrioResolucao(spec: IgualdadeEquilibrioF46Spec): ResolucaoDeclarativa<Show, number, IgualdadeEquilibrioMisconceptionTag> {
  return {
    estadoInicial: { esquerda: spec.esquerda, direita: spec.direita, equacao: spec.equacao },
    passos: [
      {
        id: "ler-dois-lados",
        say: "Leia cada prato como um lado separado da igualdade.",
        show: { esquerda: spec.esquerda, direita: spec.direita, equacao: spec.equacao },
        corrige: [IgualdadeEquilibrioMisconception.SOMA_TUDO],
        parcial: spec.resposta,
      },
      {
        id: "equilibrar",
        say: `Complete o lado que tem a caixa com ${spec.resposta}, até os dois pratos valerem o mesmo.`,
        show: { esquerda: spec.esquerda, direita: spec.direita, equacao: spec.equacao, equilibrar: true },
        corrige: [IgualdadeEquilibrioMisconception.IGNORA_TERMO],
        parcial: spec.resposta,
      },
      {
        id: "igual-e-equilibrio",
        say: "Agora a balança fica horizontal: o sinal de igual diz que os dois lados têm o mesmo valor.",
        show: { esquerda: spec.esquerda, direita: spec.direita, equacao: spec.equacao, equilibrar: true, destacarIgual: true },
        corrige: [IgualdadeEquilibrioMisconception.IGUAL_E_RESULTADO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.05 sem micro L${nivel}`);
  const diversidade = micro.dominio.evidenciasDistintas;
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(diversidade ? { evidenciasDistintas: { ...diversidade } } : {}),
  };
}

export function construirIgualdadeEquilibrioQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.05") throw new Error(`igualdadeEquilibrioContract recebeu ${ficha.id}`);
  const spec = construirIgualdadeEquilibrioSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.05 sem micro L${spec.nivel}`);
  const prompt = spec.nivel === 5 ? "Quanto pesa o saco para a balança continuar equilibrada?" : `Qual número deixa ${spec.equacao} em equilíbrio?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "igualdade-equilibrio-f46",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirIgualdadeEquilibrioResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
