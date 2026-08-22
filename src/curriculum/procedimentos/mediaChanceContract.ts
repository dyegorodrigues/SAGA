import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const MediaChanceMisconception = {
  MEDIA_IMPOSSIVEL: "media-impossivel",
  ESQUECEU_DIVIDIR: "esqueceu-dividir",
  IGNORA_TOTAL: "ignora-total",
} as const;
export type MediaChanceMisconceptionTag = typeof MediaChanceMisconception[keyof typeof MediaChanceMisconception];
export type MediaChanceModo = "nivelar-3" | "nivelar-5" | "calcular-media" | "chance-fracao" | "comparar-chances";

export interface ChanceF83Spec {
  favoraveis: number;
  total: number;
  fracao: string;
}

export interface SacoChanceF83Spec extends ChanceF83Spec {
  label: string;
}

export interface ExemploMediaFracionariaF83 {
  torres: number[];
  media: number;
  meioBloco: true;
  mediaPodeNaoSerValor?: boolean;
}

export interface MediaChanceF83Spec {
  nivel: number;
  modo: MediaChanceModo;
  primitiva: "SingaporeBars";
  torres: number[];
  media: number;
  meioBloco: boolean;
  chance?: ChanceF83Spec;
  sacos?: SacoChanceF83Spec[];
  exemploMediaFracionaria?: ExemploMediaFracionariaF83;
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: MediaChanceMisconceptionTag }>;
}

interface MediaChanceShow {
  torres: number[];
  media: number;
  chance?: ChanceF83Spec;
  sacos?: SacoChanceF83Spec[];
  linhaMedia?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function opts(correta: string | number, erradas: Array<{ value: string | number; misconception: MediaChanceMisconceptionTag }>): MediaChanceF83Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(x => ({ ...x, label: String(x.value) }))]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .slice(0, 4);
}

export function construirMediaChanceSpec(level: number): MediaChanceF83Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    nivel, modo: "nivelar-3", primitiva: "SingaporeBars", torres: [2, 4, 6], media: 4, meioBloco: false, resposta: 4,
    opcoes: opts(4, [{ value: 7, misconception: MediaChanceMisconception.MEDIA_IMPOSSIVEL }, { value: 12, misconception: MediaChanceMisconception.ESQUECEU_DIVIDIR }]),
  };
  if (nivel === 2) return {
    nivel, modo: "nivelar-5", primitiva: "SingaporeBars", torres: [3, 4, 5, 6, 7], media: 5, meioBloco: false, resposta: 5,
    opcoes: opts(5, [{ value: 8, misconception: MediaChanceMisconception.MEDIA_IMPOSSIVEL }, { value: 25, misconception: MediaChanceMisconception.ESQUECEU_DIVIDIR }]),
  };
  if (nivel === 3) return {
    nivel, modo: "calcular-media", primitiva: "SingaporeBars", torres: [2, 5, 8], media: 5, meioBloco: false, resposta: 5,
    opcoes: opts(5, [{ value: 15, misconception: MediaChanceMisconception.ESQUECEU_DIVIDIR }, { value: 9, misconception: MediaChanceMisconception.MEDIA_IMPOSSIVEL }]),
  };
  if (nivel === 4) {
    const exemploMediaFracionaria: ExemploMediaFracionariaF83 = { torres: [4, 5], media: 4.5, meioBloco: true };
    return {
      nivel, modo: "chance-fracao", primitiva: "SingaporeBars", torres: exemploMediaFracionaria.torres, media: exemploMediaFracionaria.media, meioBloco: true,
      chance: { favoraveis: 3, total: 5, fracao: "3/5" }, exemploMediaFracionaria, resposta: "3/5",
      opcoes: opts("3/5", [{ value: "3/3", misconception: MediaChanceMisconception.IGNORA_TOTAL }, { value: "5/3", misconception: MediaChanceMisconception.IGNORA_TOTAL }]),
    };
  }
  const exemploMediaFracionaria: ExemploMediaFracionariaF83 = { torres: [2, 5, 6, 9], media: 5.5, meioBloco: true, mediaPodeNaoSerValor: true };
  return {
    nivel, modo: "comparar-chances", primitiva: "SingaporeBars", torres: exemploMediaFracionaria.torres, media: exemploMediaFracionaria.media, meioBloco: true,
    sacos: [
      { label: "Saco A", favoraveis: 2, total: 4, fracao: "2/4" },
      { label: "Saco B", favoraveis: 3, total: 5, fracao: "3/5" },
    ],
    exemploMediaFracionaria, resposta: "Saco B",
    opcoes: opts("Saco B", [{ value: "Saco A", misconception: MediaChanceMisconception.IGNORA_TOTAL }]),
  };
}

export function construirMediaChanceResolucao(spec: MediaChanceF83Spec): ResolucaoDeclarativa<MediaChanceShow, string | number, MediaChanceMisconceptionTag> {
  const show: MediaChanceShow = { torres: spec.torres, media: spec.media, chance: spec.chance, sacos: spec.sacos, linhaMedia: true };
  const sayMedia = spec.meioBloco ? "A média também pode ficar entre dois números; a linha marca esse ponto." : "Mova blocos das torres altas para as baixas até todas ficarem na mesma altura.";
  const sayChance = spec.modo === "chance-fracao" || spec.modo === "comparar-chances" ? "Na chance, o total fica embaixo e os casos favoráveis ficam em cima." : "Nenhum bloco entra nem sai: só muda de torre.";
  return { estadoInicial: show, passos: [
    { id: "nivelar", say: sayMedia, show, corrige: [MediaChanceMisconception.MEDIA_IMPOSSIVEL, MediaChanceMisconception.ESQUECEU_DIVIDIR], parcial: spec.resposta },
    { id: "ligar-chance", say: sayChance, show, corrige: [MediaChanceMisconception.IGNORA_TOTAL], parcial: spec.resposta },
  ], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.03 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirMediaChanceQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.03") throw new Error(`mediaChanceContract recebeu ${ficha.id}.`);
  const spec = construirMediaChanceSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.03 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "nivelar-3" ? "Se repartir os blocos igualmente entre as três torres, com quantos blocos fica cada uma?"
    : spec.modo === "nivelar-5" ? "Depois de nivelar as cinco torres, qual é a altura comum?"
    : spec.modo === "calcular-media" ? "Some os blocos e divida pela quantidade de torres. Qual é a média?"
    : spec.modo === "chance-fracao" ? "Há 3 bolas azuis entre 5 bolas. Qual fração representa a chance de sair azul?"
    : "Qual saco dá maior chance de tirar uma bola marcada?";
  const options: Option[] = spec.opcoes;
  return { kind: "media-chance-f83", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirMediaChanceResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => String(a) === String(spec.resposta) };
}
