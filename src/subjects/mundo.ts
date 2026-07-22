import { Question, Track } from "../types";
import { ri, pick, shuffle } from "../utils/generators";

/**
 * MEU MUNDO 🌍 — os Conceitos Vitais (o verdadeiro "nível zero", antes de número e
 * letra). Noções de vida que a criança precisa cedo: as partes do dia (tempo vivido) e
 * as emoções (socioemocional). Tudo em CENAS VIVAS (DayPartScene/EmotionScene) — a
 * criança LÊ a cena e nomeia, nunca emoji cru. Ver docs/curriculo-mestre §M0.
 */

/* ---------------- Meu Dia ☀️🌙 (partes do dia) ---------------- */
const DIAS: { t: string; label: string; ceu: string }[] = [
  { t: "manha", label: "Manhã 🌅", ceu: "o sol nascendo e o céu alaranjado" },
  { t: "tarde", label: "Tarde ☀️", ceu: "o sol lá no alto e o céu bem azul" },
  { t: "noite", label: "Noite 🌙", ceu: "a lua, as estrelas e as janelas acesas" },
];
const ORDEM = ["manha", "tarde", "noite"];
const nomeDia = (t: string) => DIAS.find((d) => d.t === t)!.label.split(" ")[0].toLowerCase();

export function gMundoDia(lvl: number): Question {
  if (lvl === 5) {
    return {
      kind: "order",
      prompt: "Coloque o dia na ordem! 🌅➡️🌙",
      big: "daypart",
      howto: "Toque na manhã, depois na tarde, depois na noite!",
      explain: "O dia passa assim: manhã, tarde, noite!",
      options: shuffle(ORDEM.slice()).map((v) => ({ value: v })),
      answer: ORDEM.slice(),
    };
  }
  if (lvl === 4) {
    const i = ri(0, 1); // mostra manhã/tarde, pergunta o que vem depois
    const cur = ORDEM[i], next = ORDEM[i + 1];
    return {
      kind: "daypart",
      prompt: "O que vem DEPOIS?",
      big: cur,
      howto: "Veja a parte do dia e diga o que vem a seguir!",
      explain: `Depois da ${nomeDia(cur)} vem a ${nomeDia(next)}! O dia é assim: manhã, tarde, noite.`,
      options: shuffle(DIAS.map((d) => ({ label: d.label, value: d.t }))),
      answer: next,
    };
  }
  const nOpts = lvl === 1 ? 2 : 3;
  const alvo = pick(DIAS);
  const distr = shuffle(DIAS.filter((d) => d.t !== alvo.t)).slice(0, nOpts - 1);
  return {
    kind: "daypart",
    prompt: "Que parte do dia é?",
    big: alvo.t,
    howto: "Olhe o céu na cena e descubra a parte do dia!",
    explain: `Veja ${alvo.ceu}... é ${nomeDia(alvo.t)}!`,
    options: shuffle([alvo, ...distr]).map((d) => ({ label: d.label, value: d.t })),
    answer: alvo.t,
  };
}

/* ---------------- Como Me Sinto 😊 (emoções) ---------------- */
const EMO: { t: string; label: string; frase: string; nome: string }[] = [
  { t: "feliz", label: "Feliz 😊", frase: "sorrindo, todo contente", nome: "feliz" },
  { t: "triste", label: "Triste 😢", frase: "com uma lágrima, cabisbaixo", nome: "triste" },
  { t: "bravo", label: "Bravo 😠", frase: "com a testa franzida, zangado", nome: "bravo" },
  { t: "medo", label: "Com medo 😨", frase: "de olhos arregalados, assustado", nome: "com medo" },
];
export function gMundoEmo(lvl: number): Question {
  const nOpts = lvl === 1 ? 2 : lvl <= 3 ? 3 : 4;
  const pool = lvl === 1 ? EMO.slice(0, 2) : EMO; // N1 só feliz/triste (os mais claros)
  const alvo = pick(pool);
  const distr = shuffle(pool.filter((e) => e.t !== alvo.t)).slice(0, nOpts - 1);
  return {
    kind: "emotion",
    prompt: "Como ele se sente?",
    big: alvo.t,
    howto: "Olhe bem o rostinho e descubra o sentimento!",
    explain: `Veja: ${alvo.frase}. Ele está ${alvo.nome}!`,
    options: shuffle([alvo, ...distr]).map((e) => ({ label: e.label, value: e.t })),
    answer: alvo.t,
  };
}

/* ---------------- Muito ou Pouco? ⚖️ (senso de quantidade ANTES do número) ----------------
   Perceptual: olhar dois grupos e sentir MAIS/MENOS/MUITO/POUCO SEM contar (a ponte para
   o numeral↔quantidade). Diferenças grandes no começo, mais finas nos níveis altos. */
const QEMO = ["🍎", "🐟", "⭐", "🎈", "🍬", "🌸", "🐥", "🍓"];
export function gMundoQuant(lvl: number): Question {
  const modes: { mais: boolean; w: string }[] = [
    { mais: true, w: "MAIS" },
    { mais: false, w: "MENOS" },
    { mais: true, w: "MUITO" },
    { mais: false, w: "POUCO" },
    { mais: true, w: "MAIS" },
  ];
  const m = modes[(lvl - 1) % 5];
  const maxN = [7, 7, 8, 8, 9][lvl - 1];
  const gap = [4, 4, 3, 3, 2][lvl - 1];
  let a = ri(1, maxN), b = ri(1, maxN), g = 0;
  while (Math.abs(a - b) < gap && g++ < 80) { a = ri(1, maxN); b = ri(1, maxN); }
  if (Math.abs(a - b) < gap) b = a > gap ? a - gap : a + gap;
  const ea = pick(QEMO);
  let eb = pick(QEMO);
  while (eb === ea) eb = pick(QEMO);
  const answer = m.mais ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
  return {
    kind: "groups",
    prompt: `Toque no grupo com ${m.w}`,
    groups: [{ emoji: ea, n: a }, { emoji: eb, n: b }],
    howto: `Olhe rápido, sem contar: onde tem ${m.w.toLowerCase()}?`,
    explain: m.mais
      ? `${Math.max(a, b)} é MUITO — mais que ${Math.min(a, b)}!`
      : `${Math.min(a, b)} é POUCO — menos que ${Math.max(a, b)}!`,
    options: [{ value: 0 }, { value: 1 }],
    answer,
  };
}

/* ---------------- Meu Lugar no Mundo 🌎 (espaço geográfico por COMPOSIÇÃO) ---------------
   v2 (reformulação do Zeus + trajetória em docs/trajetoria-meu-lugar-no-mundo.md):
   NÃO é "encaixe/ordenar" (inclusão de classes, abstrata p/ 4-7a — falhou 4×). É
   COMPOSIÇÃO: "MUITAS casas formam um bairro". Concreto, contável, visível. A mecânica
   é uma VIAGEM NARRADA (kind `journey`): a criança viaja casa→bairro→…→Terra vendo cada
   lugar (cena pronta, transição suave — a nova cena entra), a voz explica a composição,
   e no fim ela responde o que os lugares formaram. Cenas em PlaceScene.tsx. */
type PlaceMeta = { label: string; intro: string; formed: string; ask: string };
const PLACES: Record<string, PlaceMeta> = {
  casa: { label: "Casa 🏠", intro: "Essa é a sua CASA — é onde você mora! Vamos viajar pra ver o mundo?", formed: "", ask: "" },
  bairro: { label: "Bairro 🏘️", intro: "Olha o seu BAIRRO, cheio de casas!", formed: "Muitas casas juntinhas formam um BAIRRO!", ask: "Muitas casas formam um...?" },
  cidade: { label: "Cidade 🏙️", intro: "Uma CIDADE bem grande!", formed: "Muitos bairros juntos formam uma CIDADE!", ask: "Muitos bairros formam uma...?" },
  estado: { label: "Estado 🗺️", intro: "Um ESTADO, com muitas cidades!", formed: "Muitas cidades formam um ESTADO!", ask: "Muitas cidades formam um...?" },
  brasil: { label: "Brasil 🇧🇷", intro: "O nosso país: o BRASIL!", formed: "Muitos estados formam o nosso país: o BRASIL!", ask: "Muitos estados formam o nosso país...?" },
  americasul: { label: "América do Sul 🌎", intro: "A AMÉRICA DO SUL, o nosso continente!", formed: "O Brasil e os países vizinhos formam a AMÉRICA DO SUL!", ask: "O Brasil e os vizinhos formam a...?" },
  mundo: { label: "Mundo 🌍", intro: "O MUNDO inteiro, com todos os continentes!", formed: "Todos os continentes formam o nosso MUNDO!", ask: "Todos os continentes formam o...?" },
  terra: { label: "Terra 🪐", intro: "A TERRA, o nosso planeta, vista lá do espaço!", formed: "E o nosso mundo é o planeta TERRA, visto lá do espaço! ✨", ask: "O nosso mundo é o planeta...?" },
};
// as viagens por nível (cada uma termina no lugar que a pergunta cobra)
const CHAINS: string[][] = [
  ["casa", "bairro"],
  ["casa", "bairro", "cidade"],
  ["bairro", "cidade", "estado"],
  ["cidade", "estado", "brasil"],
  ["brasil", "americasul", "mundo", "terra"],
];
// distratores "longe" (evita o par quase-sinônimo mundo↔terra virar pegadinha)
const farFrom = (target: string) =>
  Object.keys(PLACES).filter((s) => s !== target && !(target === "terra" && s === "mundo") && !(target === "mundo" && s === "terra"));

export function gMundoLugar(lvl: number): Question {
  const chain = CHAINS[(lvl - 1) % 5];
  const target = chain[chain.length - 1];
  const meta = PLACES[target];
  const distr = shuffle(farFrom(target)).slice(0, 2);
  const options = shuffle([target, ...distr].map((s) => ({ label: PLACES[s].label, value: s })));
  return {
    kind: "journey",
    prompt: meta.ask,
    big: target, // (satisfaz o contrato; a viagem é renderizada por `journey`)
    journey: chain.map((slot, i) => ({
      slot,
      label: PLACES[slot].label,
      say: i === 0 ? PLACES[slot].intro : PLACES[slot].formed,
    })),
    howto: "Assista à viagem e descubra o que os lugares formam!",
    explain: meta.formed,
    options,
    answer: target,
  };
}

const SK_LUGAR = ["Casa e bairro", "Chega a cidade", "Cidade e estado", "O Brasil", "Até a Terra 🌍"];

const SK_QUANT = ["Muito ou pouco (bem diferente)", "Mais ou menos", "Cheio de coisas", "Pouquinho", "Diferença fininha"];
const SK_DIA = ["Manhã ou noite", "As três partes do dia", "Todas as partes", "O que vem depois", "Mestre do dia"];
const SK_EMO = ["Feliz ou triste", "Mais sentimentos", "Todos os sentimentos", "Sentimentos parecidos", "Mestre das emoções"];

/* ✅ mundo_lugar DE VOLTA AO AR (v2, 22ª rodada): as 4 tentativas de "encaixe/ordenar"
   falharam (inclusão de classes é abstrata p/ 4-7a). v2 = COMPOSIÇÃO por VIAGEM NARRADA
   (kind `journey`) — cenas prontas de lugar (PlaceScene) + transição suave, a voz explica
   "muitas casas formam um bairro". Trajetória em docs/trajetoria-meu-lugar-no-mundo.md. */
const TRK_LUGAR: Track = { id: "mundo_lugar", name: "Meu Lugar no Mundo", icon: "🌎", color: "#0EA5E9", dark: "#0369A1", gen: gMundoLugar, prereqs: ["mundo_quant"], lvlSkills: SK_LUGAR };
export const TRACKS_MUNDO_PRE: Track[] = [
  { id: "mundo_quant", name: "Muito ou Pouco", icon: "⚖️", color: "#14B8A6", dark: "#0F766E", gen: gMundoQuant, prereqs: [], lvlSkills: SK_QUANT },
  { id: "mundo_dia", name: "Meu Dia", icon: "☀️", color: "#F59E0B", dark: "#B45309", gen: gMundoDia, prereqs: [], lvlSkills: SK_DIA },
  { id: "mundo_emo", name: "Como Me Sinto", icon: "😊", color: "#EC4899", dark: "#BE185D", gen: gMundoEmo, prereqs: [], lvlSkills: SK_EMO },
  TRK_LUGAR,
];
export const TRACKS_MUNDO_ANO1: Track[] = [
  { id: "mundo_quant", name: "Muito ou Pouco", icon: "⚖️", color: "#14B8A6", dark: "#0F766E", gen: gMundoQuant, prereqs: [], lvlSkills: SK_QUANT },
  { id: "mundo_dia", name: "Meu Dia", icon: "☀️", color: "#F59E0B", dark: "#B45309", gen: gMundoDia, prereqs: [], lvlSkills: SK_DIA },
  { id: "mundo_emo", name: "Como Me Sinto", icon: "😊", color: "#EC4899", dark: "#BE185D", gen: gMundoEmo, prereqs: [], lvlSkills: SK_EMO },
  TRK_LUGAR,
];
