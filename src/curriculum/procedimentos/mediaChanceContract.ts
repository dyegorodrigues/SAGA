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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * CLASS-003 — as torres e os sacos são sorteados, a escada não.
 *
 * As torres eram sempre as mesmas — [2,4,6], [3,4,5,6,7], [2,5,8] — e as
 * chances sempre 3/5 e "Saco B". Decorar 4, 5, 5, 3/5 e "Saco B" vencia a
 * competência inteira, e a ficha cobra 3 acertos de 3 em 2 sessões.
 *
 * O degrau continua sendo QUANTAS torres e se a média cai no meio: três,
 * cinco, três com conta, e depois o meio-bloco com a chance. Sortear isso
 * mudaria o nível; sortear as alturas só tira o gabarito da memória.
 */

/**
 * Torres cuja média é inteira e cuja soma não é uniforme.
 *
 * Alturas todas iguais fariam "nivelar" não ter o que nivelar — a criança
 * olharia a resposta pronta. E a média precisa ser inteira porque até L3 o
 * nível ainda não conhece o meio bloco.
 */
function sortearTorres(quantas: number, minimo: number, maximo: number): number[] {
  for (;;) {
    const torres = Array.from({ length: quantas }, () => ri(minimo, maximo));
    const soma = torres.reduce((total, torre) => total + torre, 0);
    if (soma % quantas !== 0) continue;
    if (new Set(torres).size === 1) continue;
    return torres;
  }
}

/**
 * Torres cuja média cai exatamente no meio — o que L4 e L5 existem para
 * mostrar: *"a média também pode ficar entre dois números"*.
 */
function sortearTorresComMeio(quantas: number, minimo: number, maximo: number): number[] {
  for (;;) {
    const torres = Array.from({ length: quantas }, () => ri(minimo, maximo));
    const soma = torres.reduce((total, torre) => total + torre, 0);
    if ((soma * 2) % quantas !== 0) continue;
    if (((soma * 2) / quantas) % 2 === 0) continue;
    return torres;
  }
}

const mediaDe = (torres: number[]) => torres.reduce((total, torre) => total + torre, 0) / torres.length;

export function construirMediaChanceSpec(level: number): MediaChanceF83Spec {
  const nivel = clamp(level);

  if (nivel <= 3) {
    const quantas = nivel === 2 ? 5 : 3;
    const torres = sortearTorres(quantas, 1, nivel === 1 ? 8 : nivel === 2 ? 9 : 11);
    const soma = torres.reduce((total, torre) => total + torre, 0);
    const media = soma / quantas;
    // A "média impossível" é impossível porque cai FORA do intervalo das
    // torres: nivelar nunca produz altura maior que a torre mais alta. Um
    // número qualquer maior que a resposta não seria impossível, seria só
    // outro. E ela precisa diferir da soma, senão os dois erros que a ficha
    // nomeia viram uma alternativa só.
    let impossivel = Math.max(...torres) + 1;
    if (impossivel === soma) impossivel += 1;
    return {
      nivel, modo: nivel === 1 ? "nivelar-3" : nivel === 2 ? "nivelar-5" : "calcular-media",
      primitiva: "SingaporeBars", torres, media, meioBloco: false, resposta: media,
      opcoes: nivel === 3
        ? opts(media, [{ value: soma, misconception: MediaChanceMisconception.ESQUECEU_DIVIDIR }, { value: impossivel, misconception: MediaChanceMisconception.MEDIA_IMPOSSIVEL }])
        : opts(media, [{ value: impossivel, misconception: MediaChanceMisconception.MEDIA_IMPOSSIVEL }, { value: soma, misconception: MediaChanceMisconception.ESQUECEU_DIVIDIR }]),
    };
  }

  if (nivel === 4) {
    const torres = sortearTorresComMeio(2, 2, 9);
    const exemploMediaFracionaria: ExemploMediaFracionariaF83 = { torres, media: mediaDe(torres), meioBloco: true };
    const total = ri(4, 9);
    const favoraveis = ri(2, total - 1);
    // `favoraveis/favoraveis` é quem toma os casos favoráveis como se fossem o
    // total; `total/favoraveis` é a fração de cabeça para baixo. As duas
    // precisam diferir da certa e uma da outra — `opts` deduplica por valor.
    return {
      nivel, modo: "chance-fracao", primitiva: "SingaporeBars",
      torres, media: exemploMediaFracionaria.media, meioBloco: true,
      chance: { favoraveis, total, fracao: `${favoraveis}/${total}` }, exemploMediaFracionaria,
      resposta: `${favoraveis}/${total}`,
      opcoes: opts(`${favoraveis}/${total}`, [
        { value: `${favoraveis}/${favoraveis}`, misconception: MediaChanceMisconception.IGNORA_TOTAL },
        { value: `${total}/${favoraveis}`, misconception: MediaChanceMisconception.IGNORA_TOTAL },
      ]),
    };
  }

  const torres = sortearTorresComMeio(4, 1, 9);
  const exemploMediaFracionaria: ExemploMediaFracionariaF83 = { torres, media: mediaDe(torres), meioBloco: true, mediaPodeNaoSerValor: true };
  // O saco de MAIOR chance precisa ter MENOS bolas marcadas.
  //
  // O caso fixo não tinha isso: 2/4 contra 3/5, e o saco certo era também o de
  // mais marcadas. Quem ignora o total — o erro que este nível existe para
  // pegar — contava só as marcadas, escolhia o certo e acertava. O distrator
  // estava na tela sem nunca descrever ninguém.
  const sacos = sortearSacosQuePrendem();
  return {
    nivel, modo: "comparar-chances", primitiva: "SingaporeBars",
    torres, media: exemploMediaFracionaria.media, meioBloco: true,
    // Na tela os sacos aparecem em ordem de rótulo, não na ordem em que o
    // sorteio os produziu: A antes de B sempre, senão a posição entrega a
    // resposta a quem reparar que o certo é o segundo.
    sacos: [...sacos].sort((um, outro) => um.label.localeCompare(outro.label)),
    exemploMediaFracionaria, resposta: sacos[1].label,
    opcoes: opts(sacos[1].label, [{ value: sacos[0].label, misconception: MediaChanceMisconception.IGNORA_TOTAL }]),
  };
}

/**
 * Dois sacos em que contar só as marcadas leva ao errado.
 *
 * Devolve `[armadilha, certo]` — o primeiro com mais bolas marcadas, o segundo
 * com a chance maior. Qual dos dois se chama "Saco A" é sorteado: pôr o certo
 * sempre no B faria a resposta ser sempre "Saco B", que é a CLASS-003 de novo
 * um degrau abaixo.
 */
function sortearSacosQuePrendem(): [SacoChanceF83Spec, SacoChanceF83Spec] {
  for (;;) {
    const totalArmadilha = ri(6, 12);
    const favArmadilha = ri(2, totalArmadilha - 1);
    const totalCerto = ri(3, 9);
    const favCerto = ri(1, totalCerto - 1);
    if (favCerto >= favArmadilha) continue;
    if (favCerto / totalCerto <= favArmadilha / totalArmadilha) continue;
    const certoEhA = Math.random() < 0.5;
    const armadilha = { label: certoEhA ? "Saco B" : "Saco A", favoraveis: favArmadilha, total: totalArmadilha, fracao: `${favArmadilha}/${totalArmadilha}` };
    const certo = { label: certoEhA ? "Saco A" : "Saco B", favoraveis: favCerto, total: totalCerto, fracao: `${favCerto}/${totalCerto}` };
    return [armadilha, certo];
  }
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
    : spec.modo === "chance-fracao" ? `Há ${spec.chance?.favoraveis} bolas azuis entre ${spec.chance?.total} bolas. Qual fração representa a chance de sair azul?`
    : "Qual saco dá maior chance de tirar uma bola marcada?";
  const options: Option[] = spec.opcoes;
  return { kind: "media-chance-f83", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirMediaChanceResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => String(a) === String(spec.resposta) };
}
