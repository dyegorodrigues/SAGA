import { Question, Track } from "../types";
import { ri, pick, shuffle, numOpts } from "../utils/generators";

/**
 * PORTUGUÊS 📖 — o primeiro cartucho novo do console (protótipo da era do conteúdo).
 *
 * Método: instrução fônica sistemática adaptativa (linhagem GraphoGame — ver
 * docs/relatorio-expansao-pedagogica.md §4 e docs/adendo-relatorio-expansao.md §3).
 * Fase 0 (4 anos, PRÉ-requisito de tudo): consciência fonológica SEM letras —
 * rimas e sílabas por SOM. Fases seguintes: sílaba como unidade mínima de voz
 * (o TTS fala "MA", "PO" perfeitamente — resolve 90% do currículo).
 *
 * Regra do motor: o núcleo NÃO sabe que isto é português. Mesmo contrato:
 * gen(nível 1-5) → { kind, prompt, ..., options[], answer }.
 */

/* ---------------- bancos de palavras (emoji = a palavra para quem não lê) ---------------- */

/** Famílias de rima (Fase 0 — por SOM, o emoji carrega o significado) */
export const RIMAS: { fim: string; palavras: [string, string][] }[] = [
  { fim: "ATO", palavras: [["PATO", "🦆"], ["GATO", "🐱"], ["RATO", "🐭"], ["SAPATO", "👟"]] },
  { fim: "ÃO", palavras: [["MÃO", "🖐️"], ["PÃO", "🍞"], ["LEÃO", "🦁"], ["BALÃO", "🎈"], ["CORAÇÃO", "❤️"]] },
  { fim: "OLA", palavras: [["BOLA", "⚽"], ["SACOLA", "🛍️"], ["ESCOLA", "🏫"]] },
  { fim: "EL", palavras: [["MEL", "🍯"], ["ANEL", "💍"], ["PAPEL", "📄"], ["PINCEL", "🖌️"]] },
  { fim: "ELA", palavras: [["ESTRELA", "⭐"], ["JANELA", "🪟"], ["PANELA", "🍳"], ["VELA", "🕯️"]] },
];

/** Palavras com divisão silábica (Fase 0 — bater palmas) */
export const SILABAS: { p: string; e: string; s: string[] }[] = [
  { p: "SOL", e: "☀️", s: ["SOL"] },
  { p: "PÃO", e: "🍞", s: ["PÃO"] },
  { p: "FLOR", e: "🌸", s: ["FLOR"] },
  { p: "MAR", e: "🌊", s: ["MAR"] },
  { p: "BOLA", e: "⚽", s: ["BO", "LA"] },
  { p: "GATO", e: "🐱", s: ["GA", "TO"] },
  { p: "CASA", e: "🏠", s: ["CA", "SA"] },
  { p: "BOLO", e: "🎂", s: ["BO", "LO"] },
  { p: "BANANA", e: "🍌", s: ["BA", "NA", "NA"] },
  { p: "MACACO", e: "🐵", s: ["MA", "CA", "CO"] },
  { p: "SAPATO", e: "👟", s: ["SA", "PA", "TO"] },
  { p: "CAVALO", e: "🐴", s: ["CA", "VA", "LO"] },
  { p: "TOMATE", e: "🍅", s: ["TO", "MA", "TE"] },
  { p: "CHOCOLATE", e: "🍫", s: ["CHO", "CO", "LA", "TE"] },
  { p: "BORBOLETA", e: "🦋", s: ["BOR", "BO", "LE", "TA"] },
  { p: "ELEFANTE", e: "🐘", s: ["E", "LE", "FAN", "TE"] },
  { p: "MELANCIA", e: "🍉", s: ["ME", "LAN", "CI", "A"] },
  { p: "BICICLETA", e: "🚲", s: ["BI", "CI", "CLE", "TA"] },
];

/** Consoantes por fase fônica: contínuas primeiro (dá pra "cantar" o som) */
const CONS_CONTINUAS = ["M", "L", "N", "V", "S"];
const CONS_OCLUSIVAS = ["P", "B", "T", "D", "C"];
const VOGAIS = ["A", "E", "I", "O", "U"];

/** Palavras CVCV transparentes para completar sílaba (Fase 4) */
export const CVCV: { p: string; e: string; s: [string, string] }[] = [
  { p: "SAPO", e: "🐸", s: ["SA", "PO"] },
  { p: "BOLA", e: "⚽", s: ["BO", "LA"] },
  { p: "CASA", e: "🏠", s: ["CA", "SA"] },
  { p: "GATO", e: "🐱", s: ["GA", "TO"] },
  { p: "MALA", e: "🧳", s: ["MA", "LA"] },
  { p: "PATO", e: "🦆", s: ["PA", "TO"] },
  { p: "VACA", e: "🐮", s: ["VA", "CA"] },
  { p: "LUA", e: "🌙", s: ["LU", "A"] },
];

/** Trios de palavras parecidas (pares mínimos) para o Ditado Mágico */
export const DITADO: string[][] = [
  ["BOLA", "BOTA", "BOCA"],
  ["GATO", "GALO", "RATO"],
  ["CASA", "CAMA", "CARA"],
  ["FACA", "VACA", "FADA"],
  ["PÃO", "MÃO", "CÃO"],
  ["DIA", "TIA", "MIA"],
  ["MALA", "MAPA", "MASSA"],
];

/* ---------------- geradores: FASE 0 (4 anos — Benjamin) ---------------- */

/** Caça-Rimas 🎵 — consciência fonológica: o que rima? (por som + emoji) */
export function gPortRimas(lvl: number): Question {
  const fam = pick(RIMAS);
  const alvo = pick(fam.palavras);
  let certa = pick(fam.palavras);
  let g = 0;
  while (certa[0] === alvo[0] && g++ < 30) certa = pick(fam.palavras);

  const nOpts = lvl <= 2 ? 3 : 4;
  const distratores: [string, string][] = [];
  let guard = 0;
  while (distratores.length < nOpts - 1 && guard++ < 60) {
    const outraFam = pick(RIMAS.filter((f) => f.fim !== fam.fim));
    const d = pick(outraFam.palavras);
    if (!distratores.some((x) => x[0] === d[0])) distratores.push(d);
  }

  const opcoes = shuffle([certa, ...distratores]);
  return {
    kind: "story",
    prompt: "Qual palavra rima? 🎵",
    story: `O que rima com ${alvo[0]}? Escute: ${opcoes.map(([w]) => w).join(", ")}.`,
    emoji: alvo[1],
    audibleOptions: true,
    options: opcoes.map(([w, e]) => ({ label: `${e} ${w}`, value: w, say: w.toLowerCase() })),
    answer: certa[0],
    explain: `${certa[0]} rima com ${alvo[0]}! Os dois terminam com o mesmo som: ${fam.fim.toLowerCase()}!`,
  };
}

/** Palminhas de Sílaba 👏 — bater palmas nos pedaços da palavra */
export function gPortPalmas(lvl: number): Question {
  const pools = [
    SILABAS.filter((w) => w.s.length <= 2),
    SILABAS.filter((w) => w.s.length >= 2 && w.s.length <= 3),
    SILABAS.filter((w) => w.s.length === 3),
    SILABAS.filter((w) => w.s.length >= 3),
    SILABAS,
  ];
  const w = pick(pools[(lvl - 1) % pools.length]);
  const n = w.s.length;
  // fala NATURAL (nada de "palavra SOL: SOL!" robótico): apresenta a palavra,
  // bate os pedacinhos com pausas (vírgulas = ritmo das palmas), pergunta no fim
  return {
    kind: "story",
    prompt: "Conte as palminhas! 👏",
    story: `A palavra é ${w.p}. Vamos bater palmas: ${w.s.join(", ")}! Quantas palmas deu?`,
    emoji: w.e,
    options: numOpts(n, 3, 1, Math.max(4, n + 1)),
    answer: n,
    explain:
      n === 1
        ? `${w.p} é curtinha: um pedacinho só. Uma palma!`
        : `${w.p} se separa assim: ${w.s.join(", ")}. São ${n} palmas!`,
  };
}

/* ---------------- gerador: FASES 1-2 — Sons Mágicos 🔤 (consciência fonêmica) ---------------- */

/** Palavras por letra inicial (emoji = significado p/ quem não lê). SEM acento na inicial. */
export const INICIAIS_VOGAL: { p: string; e: string }[] = [
  { p: "ABELHA", e: "🐝" }, { p: "AVIÃO", e: "✈️" }, { p: "ANEL", e: "💍" },
  { p: "ELEFANTE", e: "🐘" }, { p: "ESCOLA", e: "🏫" }, { p: "ESTRELA", e: "⭐" },
  { p: "ILHA", e: "🏝️" }, { p: "IGREJA", e: "⛪" },
  { p: "OVO", e: "🥚" }, { p: "OLHO", e: "👁️" }, { p: "ONDA", e: "🌊" },
  { p: "URSO", e: "🐻" }, { p: "UVA", e: "🍇" }, { p: "UNHA", e: "💅" },
];
export const INICIAIS_CONS: { p: string; e: string }[] = [
  { p: "PATO", e: "🦆" }, { p: "PÃO", e: "🍞" },
  { p: "BOLA", e: "⚽" }, { p: "BANANA", e: "🍌" },
  { p: "TOMATE", e: "🍅" }, { p: "TUBARÃO", e: "🦈" },
  { p: "DADO", e: "🎲" }, { p: "DEDO", e: "☝️" },
  { p: "FADA", e: "🧚" }, { p: "FOCA", e: "🦭" },
  { p: "VACA", e: "🐮" }, { p: "VELA", e: "🕯️" },
  { p: "MALA", e: "🧳" }, { p: "MACACO", e: "🐵" },
  { p: "NAVIO", e: "🚢" }, { p: "NUVEM", e: "☁️" },
  { p: "LUA", e: "🌙" }, { p: "LEÃO", e: "🦁" },
  { p: "SAPO", e: "🐸" }, { p: "SOL", e: "☀️" },
];
/** pares surda/sonora (discriminação fina — blueprint Fase 5, versão inicial) */
const PARES_SONOROS: Record<string, string> = { P: "B", B: "P", T: "D", D: "T", F: "V", V: "F" };

/**
 * Sons Mágicos 🔤 — a ponte fonema↔letra que faltava ANTES da sílaba (GraphoGame Fases 1-2).
 * TTS-seguro: só fala VOGAL isolada (nome da vogal = o som) ou a PALAVRA inteira —
 * nunca consoante isolada (o hack proibido). O alvo vai em `sayTarget`: é FALADO
 * mas nunca escrito (a resposta não aparece na tela).
 */
export function gPortSons(lvl: number): Question {
  if (lvl <= 2) {
    // ouve a VOGAL, acha a letra (nome da vogal = o próprio som — TTS acerta sempre)
    const nOpts = lvl === 1 ? 3 : 5;
    const opcoes = lvl === 1 ? shuffle(VOGAIS).slice(0, 3) : [...VOGAIS];
    const certa = pick(opcoes);
    return {
      kind: "story",
      prompt: "Que letra faz esse som? 🔤",
      story: "Escute o som e ache a letra!",
      sayTarget: `${certa.toLowerCase()}... ${certa.toLowerCase()}!`,
      emoji: "👂",
      audibleOptions: true,
      options: shuffle(opcoes).slice(0, nOpts).map((v) => ({ label: v, value: v, say: v.toLowerCase() })),
      answer: certa,
      explain: `Esse é o som da letra ${certa}! ${certa.toLowerCase()}!`,
    };
  }
  if (lvl === 3) {
    // som INICIAL com vogais: ouve a palavra, acha a primeira letra
    const w = pick(INICIAIS_VOGAL);
    const certa = w.p[0];
    const distr = shuffle(VOGAIS.filter((v) => v !== certa)).slice(0, 3);
    return {
      kind: "story",
      prompt: `Com que letra começa? ${w.e}`,
      story: "Escute a palavra e ache a primeira letra!",
      sayTarget: `${w.p.toLowerCase()}... ${w.p.toLowerCase()}!`,
      emoji: w.e,
      audibleOptions: true,
      options: shuffle([certa, ...distr]).map((v) => ({ label: v, value: v, say: v.toLowerCase() })),
      answer: certa,
      explain: `${certa.toLowerCase()}... ${w.p.toLowerCase()}! ${w.p} começa com ${certa}!`,
    };
  }
  // níveis 4-5: som inicial com CONSOANTES (regulares 1:1 — sem armadilhas)
  const w = pick(INICIAIS_CONS);
  const certa = w.p[0];
  const distratores = new Set<string>();
  if (lvl === 5 && PARES_SONOROS[certa]) distratores.add(PARES_SONOROS[certa]); // o par confusável (F/V, P/B, T/D)
  const CONS_POOL = ["P", "B", "T", "D", "F", "V", "M", "N", "L", "S"];
  let guard = 0;
  while (distratores.size < 3 && guard++ < 40) {
    const d = pick(CONS_POOL);
    if (d !== certa) distratores.add(d);
  }
  return {
    kind: "story",
    prompt: `Com que letra começa? ${w.e}`,
    story: "Escute a palavra e ache a primeira letra!",
    sayTarget: `${w.p.toLowerCase()}... ${w.p.toLowerCase()}!`,
    emoji: w.e,
    // sem 🔊 nas opções aqui: o NOME da consoante ("efe") não é o SOM dela — confundiria
    options: shuffle([certa, ...distratores]).map((v) => ({ label: v, value: v })),
    answer: certa,
    explain: `${w.p} começa com a letra ${certa}! Escute de novo: ${w.p.toLowerCase()}!`,
  };
}

/* ---------------- geradores: FASES 3-4 (6 anos — Heitor) ---------------- */

/** Fábrica de Sílabas 🏭 — montar e reconhecer sílabas (som→escrita) */
export function gPortSilabas(lvl: number): Question {
  const cons = lvl === 1 ? CONS_CONTINUAS : lvl === 2 ? CONS_OCLUSIVAS : [...CONS_CONTINUAS, ...CONS_OCLUSIVAS];

  if (lvl <= 3) {
    // Montagem: junta a consoante com a vogal. A VOZ narra a formação e o SOM.
    const c = pick(cons);
    const v = pick(VOGAIS);
    const certa = c + v;
    const distratores = new Set<string>();
    let guard = 0;
    while (distratores.size < 2 && guard++ < 40) {
      const d = Math.random() < 0.5 ? c + pick(VOGAIS) : pick(cons) + v;
      if (d !== certa) distratores.add(d);
    }
    // Níveis 1-2: a voz LIDERA com o som pronto da sílaba (curto — o "a voz lê o
    // resultado" do método fônico); nível 3: só a pista, a criança junta sozinha.
    // (ttsText lê a sílaba minúscula como SOM — "pa" → "pá" — sem soletrar letra.)
    const falaResultado = lvl <= 2;
    const sil = certa.toLowerCase();
    return {
      // kind `blend`: cena viva da fusão (letras deslizam e viram ❓; a sílaba
      // só aparece ao responder — a resposta nunca fica visível no enunciado)
      kind: "blend",
      prompt: "Que sílaba nasce ao juntar? 🏭",
      shown: [c, v],
      howto: falaResultado ? `Escute: ${sil}! Toque no ${sil}.` : "Junte os sons e ache a sílaba!",
      audibleOptions: true,
      // teaching (falado só ao errar): a fusão explícita das letras no som
      explain: `${c} com ${v} faz ${sil}! ${sil}! 🎉`,
      options: shuffle([certa, ...distratores]).map((s) => ({ label: s, value: s })),
      answer: certa,
    };
  }

  if (lvl === 4) {
    // Reconhecimento auditivo: a voz fala, a criança acha a sílaba escrita
    const c = pick(cons);
    const certa = c + pick(VOGAIS);
    const distratores = new Set<string>();
    let guard = 0;
    while (distratores.size < 3 && guard++ < 40) {
      const d = Math.random() < 0.5 ? c + pick(VOGAIS) : pick(cons) + certa[1];
      if (d !== certa) distratores.add(d);
    }
    return {
      kind: "story",
      prompt: "Escute e ache a sílaba! 👂",
      story: `Toque na sílaba ${certa.toLowerCase()}... ${certa.toLowerCase()}!`,
      emoji: "🔤",
      explain: `Essa é a sílaba ${certa.toLowerCase()}! 🎉`,
      audibleOptions: true,
      options: shuffle([certa, ...distratores]).map((s) => ({ label: s, value: s })),
      answer: certa,
    };
  }

  // Nível 5 — completar a palavra: SA + ▢ = SAPO
  const w = pick(CVCV);
  const certa = w.s[1];
  const distratores = new Set<string>();
  let guard = 0;
  while (distratores.size < 2 && guard++ < 40) {
    const d = Math.random() < 0.5 ? certa[0] + pick(VOGAIS.filter((v) => v !== certa.slice(1))) : pick(CVCV).s[1];
    if (d !== certa) distratores.add(d);
  }
  return {
    kind: "plain",
    prompt: `Qual sílaba completa a palavra? ${w.e}`,
    // esconde a palavra (mostra só o emoji como pista); revela a palavra cheia ao acertar
    big: `${w.s[0]} + ▢ = ${w.e}`,
    bigCompleted: `${w.s[0]} + ${certa} = ${w.p} ${w.e}`,
    howto: `Que sílaba falta para formar ${w.p.toLowerCase()}? ${w.e}`,
    audibleOptions: true,
    explain: `${w.s[0].toLowerCase()} com ${certa.toLowerCase()} faz ${w.p.toLowerCase()}! ${w.e}`,
    options: shuffle([certa, ...distratores]).map((s) => ({ label: s, value: s })),
    answer: certa,
  };
}

/** Ditado Mágico 🔊 — a voz fala, a criança acha a palavra escrita (pares mínimos) */
export function gPortDitado(lvl: number): Question {
  const trio = pick(DITADO);
  const certa = pick(trio);
  const nOpts = lvl <= 2 ? 2 : 3;
  const distratores = shuffle(trio.filter((w) => w !== certa)).slice(0, nOpts - 1);
  // Nos níveis altos, entra uma palavra de OUTRO trio para ampliar a leitura
  if (lvl >= 4) {
    const outra = pick(pick(DITADO.filter((t) => t !== trio)));
    if (!distratores.includes(outra) && outra !== certa) distratores.push(outra);
  }
  return {
    kind: "story",
    prompt: "Escute e ache a palavra! 🔊",
    story: `Escute bem: ${certa}! ... Toque na palavra ${certa}.`,
    audibleOptions: true,
    emoji: "📖",
    options: shuffle([certa, ...distratores]).map((w) => ({ label: w, value: w })),
    answer: certa,
  };
}

/* ---------------- registro (mesmo contrato, mesmo console) ---------------- */

const SK_RIMAS = ["Rimas bem diferentes", "Rimas fáceis", "4 opções para escolher", "Rimas mais sutis", "Mestre das rimas"];
const SK_PALMAS = ["Palavras de 1-2 pedaços", "2-3 pedaços", "3 pedaços", "3+ pedaços", "Palavras grandes"];
const SK_SONS = ["Som das vogais (3 letras)", "Som das 5 vogais", "1ª letra da palavra (vogais)", "1ª letra (consoantes)", "Pares parecidos: F/V, P/B, T/D"];
const SK_SILABAS = ["Montar sílabas cantadas (M, L, N...)", "Montar sílabas de toque (P, B, T...)", "Juntar os sons sozinho", "Achar a sílaba pelo som", "Completar a palavra"];
const SK_DITADO = ["2 palavras parecidas", "2 palavras", "3 palavras parecidas", "Palavras de outros grupos", "Mestre do ditado"];

export const TRACKS_PORT_PRE: Track[] = [
  { id: "port_rimas", name: "Caça-Rimas", icon: "🎵", color: "#8B5CF6", dark: "#6D28D9", gen: gPortRimas, prereqs: [], lvlSkills: SK_RIMAS },
  { id: "port_palmas", name: "Palminhas", icon: "👏", color: "#EC4899", dark: "#BE185D", gen: gPortPalmas, prereqs: [], lvlSkills: SK_PALMAS },
  { id: "port_sons", name: "Sons Mágicos", icon: "🔤", color: "#F59E0B", dark: "#B45309", gen: gPortSons, prereqs: ["port_rimas", "port_palmas"], lvlSkills: SK_SONS },
];

export const TRACKS_PORT_ANO1: Track[] = [
  { id: "port_sons", name: "Sons Mágicos", icon: "🔤", color: "#F59E0B", dark: "#B45309", gen: gPortSons, prereqs: [], lvlSkills: SK_SONS },
  { id: "port_silabas", name: "Fábrica de Sílabas", icon: "🏭", color: "#8B5CF6", dark: "#6D28D9", gen: gPortSilabas, prereqs: ["port_sons"], lvlSkills: SK_SILABAS },
  { id: "port_ditado", name: "Ditado Mágico", icon: "🔊", color: "#EC4899", dark: "#BE185D", gen: gPortDitado, prereqs: ["port_silabas"], lvlSkills: SK_DITADO },
];
