import { Question, Track } from "../types";
import { ri, pick, shuffle } from "../utils/generators";

/**
 * CIÊNCIAS 🔬 (4+) — catálogo linhas 212-231.
 * Objetivo: o mundo tem padrões observáveis e CLASSIFICÁVEIS.
 * Degrau zero = classificar (a operação que funda toda ciência).
 * Tudo com kinds existentes (plain/story + emojis) — risco baixo.
 */

const VIVOS = ["🐶", "🐱", "🌳", "🌻", "🐟", "🦋", "🐘", "🌸", "🐰", "🐦"];
const NAO_VIVOS = ["🪨", "🚗", "⚽", "🪑", "📱", "🧱", "🥄", "🚲", "🧸", "✏️"];
// Os "pega-ratão": coisas da natureza que SE MOVEM mas NÃO têm vida
// (o erro clássico: achar que se mexe = vivo). Entram nos níveis mais altos.
const NATUREZA_SEM_VIDA = ["☁️", "🌊", "🏔️", "🌬️", "☀️", "🌙", "💧"];

/* Plantas: os seres vivos que a criança mais confunde com "não vivo" */
const PLANTAS = ["🌳", "🌻", "🌸", "🌵", "🌷"];
/* Coisas que JÁ FORAM vivas (a categoria do meio — N4) */
const JA_FOI_VIVO = ["🪵", "🍂", "🪶", "🐚", "🦴"];
/* O que todo ser vivo precisa para viver (N3) × coisas que não são necessidade vital */
const PRECISA = [{ e: "🍎", n: "comida" }, { e: "💧", n: "água" }, { e: "☀️", n: "sol e luz" }, { e: "💨", n: "ar" }];
const NAO_PRECISA = ["📱", "🚗", "⚽", "🧸", "📺", "🪀"];

/* Vivo ou Não-Vivo? 🌱 — REORGANIZADO pela régua anti-exaustão: cada nível é uma
   HABILIDADE diferente (não a mesma pergunta com mais opções). */
export function gSciVivo(lvl: number): Question {
  // N3 — o que todo ser vivo PRECISA para viver (necessidades vitais)
  if (lvl === 3) {
    const need = pick(PRECISA);
    const distr = shuffle(NAO_PRECISA).slice(0, 2);
    return {
      kind: "plain",
      prompt: "O que todo ser vivo PRECISA para viver? 🌱",
      big: null,
      howto: "Pense no que você, os bichos e as plantas precisam todo dia!",
      explain: `Todo ser vivo precisa de ${need.n}! Sem isso não vive. Um brinquedo não precisa de nada.`,
      options: shuffle([need.e, ...distr]).map((e) => ({ label: e, value: e })),
      answer: need.e,
    };
  }
  // N4 — a categoria do MEIO: coisas que JÁ FORAM vivas (tronco, folha seca)
  if (lvl === 4) {
    const foi = pick(JA_FOI_VIVO);
    const obj = pick(NAO_VIVOS);
    const vivo = pick([...VIVOS, ...PLANTAS]);
    return {
      kind: "plain",
      prompt: "Qual JÁ FOI vivo, mas não é mais? 🍂",
      big: null,
      howto: "Uma coisa pode ter tido vida um dia... o tronco já foi uma árvore!",
      explain: "O tronco já foi árvore, a folha seca já foi verdinha! Não vivem mais, mas um dia viveram. 🍂",
      options: shuffle([foi, obj, vivo]).map((e) => ({ label: e, value: e })),
      answer: foi,
    };
  }
  // N1 óbvio · N2 pega-ratão (nuvem/rio se mexem!) · N5 detetive (a planta é viva)
  const pediuVivo = lvl === 5 ? true : Math.random() < 0.5;
  let alvo: string, distr: string[];
  if (lvl === 1) {
    alvo = pediuVivo ? pick(VIVOS) : pick(NAO_VIVOS);
    distr = shuffle((pediuVivo ? NAO_VIVOS : VIVOS).filter((e) => e !== alvo)).slice(0, 2);
  } else if (lvl === 2) {
    if (pediuVivo) { alvo = pick(VIVOS); distr = shuffle([...NATUREZA_SEM_VIDA, ...NAO_VIVOS]).slice(0, 2); }
    else { alvo = pick(NATUREZA_SEM_VIDA); distr = shuffle(VIVOS).slice(0, 2); }
  } else {
    // N5 detetive: a resposta viva é uma PLANTA, cercada de natureza-sem-vida e objetos
    alvo = pick(PLANTAS);
    distr = shuffle([...NATUREZA_SEM_VIDA, ...NAO_VIVOS]).slice(0, 3);
  }
  const ehPlanta = PLANTAS.includes(alvo);
  const ehNatureza = NATUREZA_SEM_VIDA.includes(alvo);
  return {
    kind: "plain",
    prompt: pediuVivo ? "Toque no que TEM VIDA 🌱" : "Toque no que NÃO tem vida 🪨",
    big: null,
    howto:
      lvl === 2
        ? "Cuidado: a nuvem e o rio se mexem, mas não têm vida!"
        : pediuVivo
          ? "Ser vivo nasce, cresce, come ou bebe água."
          : "Sem vida é o que não nasce nem cresce.",
    explain: pediuVivo
      ? ehPlanta
        ? "A planta É viva: cresce e bebe água pela raiz! 🌱"
        : "É um ser vivo: nasce, cresce e precisa de comida e água! 🐾"
      : ehNatureza
        ? "Se mexe, mas não nasce nem cresce sozinho — não tem vida! ☁️"
        : "É um objeto: não nasce nem cresce, não tem vida. 🪨",
    options: shuffle([alvo, ...distr]).map((e) => ({ label: e, value: e })),
    answer: alvo,
  };
}

/* Quem mora aqui? 🏠 — habitats (pergunta reversa, mais clara p/ criança) */
const HABITATS: { casa: string; nome: string; moradores: string[]; fora: string[] }[] = [
  { casa: "🌊", nome: "na água", moradores: ["🐟", "🐙", "🐬", "🦀"], fora: ["🐶", "🦁", "🐦", "🐴"] },
  { casa: "🪹", nome: "no ninho", moradores: ["🐦", "🐤", "🦅"], fora: ["🐟", "🐘", "🐛", "🐶"] },
  { casa: "🌳", nome: "na árvore", moradores: ["🐒", "🐿️", "🦉", "🐦"], fora: ["🐠", "🐄", "🐊", "🦭"] },
];
export function gSciCasas(lvl: number): Question {
  const nOpts = lvl <= 2 ? 3 : 4;
  const h = pick(HABITATS);
  const alvo = pick(h.moradores);
  const distr = shuffle(h.fora).slice(0, nOpts - 1);
  return {
    kind: "story",
    prompt: "Quem mora aqui? 🏠",
    story: `Quem mora ${h.nome}? ${h.casa}`,
    emoji: h.casa,
    howto: "Pense em qual bichinho vive nesse lugar!",
    explain: `Isso! Esse bichinho vive ${h.nome}. 🏠`,
    options: shuffle([alvo, ...distr]).map((e) => ({ label: e, value: e })),
    answer: alvo,
  };
}

/* De Onde Vem? 🥛 — origem das coisas */
const ORIGENS: { produto: string; nome: string; fonte: string; distr: string[] }[] = [
  { produto: "🥛", nome: "o leite", fonte: "🐄", distr: ["🐔", "🐝", "🌳"] },
  { produto: "🥚", nome: "o ovo", fonte: "🐔", distr: ["🐄", "🐑", "🐝"] },
  { produto: "🍯", nome: "o mel", fonte: "🐝", distr: ["🐄", "🐔", "🐜"] },
  { produto: "🧶", nome: "a lã", fonte: "🐑", distr: ["🐄", "🐔", "🐍"] },
  { produto: "🍎", nome: "a maçã", fonte: "🌳", distr: ["🐄", "🌊", "🪨"] },
  { produto: "🍞", nome: "o pão", fonte: "🌾", distr: ["🐄", "🐔", "🐝"] },
];
export function gSciOrigem(lvl: number): Question {
  const o = pick(ORIGENS);
  const nDistr = lvl <= 2 ? 2 : 3;
  return {
    kind: "story",
    prompt: "De onde vem? 🥛",
    story: `De onde vem ${o.nome}? ${o.produto}`,
    emoji: o.produto,
    howto: "Pense de qual animal ou planta isso vem!",
    explain: `Isso mesmo! ${o.produto} vem daí. 🎉`,
    options: shuffle([o.fonte, ...o.distr.slice(0, nDistr)]).map((e) => ({ label: e, value: e })),
    answer: o.fonte,
  };
}

/* Os 5 Sentidos 👂 — corpo humano */
const SENTIDOS: { acao: string; parte: string }[] = [
  { acao: "OUVE", parte: "👂" },
  { acao: "VÊ", parte: "👁️" },
  { acao: "CHEIRA", parte: "👃" },
  { acao: "PROVA o sabor", parte: "👅" },
  { acao: "PEGA e sente", parte: "✋" },
];
export function gSciSentidos(lvl: number): Question {
  const nOpts = lvl <= 2 ? 3 : 5;
  const alvo = pick(SENTIDOS);
  const distr = shuffle(SENTIDOS.filter((s) => s.parte !== alvo.parte)).slice(0, nOpts - 1);
  return {
    kind: "story",
    prompt: "Com o que você...? 🧠",
    story: `Com o que você ${alvo.acao}?`,
    emoji: "🧑",
    howto: "Pense na parte do corpo que usamos para isso!",
    explain: `Isso! A gente ${alvo.acao.toLowerCase()} com ${alvo.parte}.`,
    options: shuffle([alvo, ...distr]).map((s) => ({ label: s.parte, value: s.parte })),
    answer: alvo.parte,
  };
}

/* ---------------- Cenas Vivas: O Tempo 🌦️ e o Ciclo da Planta 🌳 ----------------
   Não usam emoji cru — usam cenas SVG construídas (WeatherScene/GrowthScene) que a
   criança LÊ de olho (o "teste do floquinho"). A cena é o enunciado visual; as opções
   são as palavras (a criança lê a cena e NOMEIA — concept→word). */

const TEMPOS: { t: string; label: string; dica: string }[] = [
  { t: "frio", label: "Frio ❄️", dica: "a neve caindo e o casaco quentinho" },
  { t: "calor", label: "Calor ☀️", dica: "o sol forte e o suor escorrendo" },
  { t: "chuva", label: "Chuva 🌧️", dica: "as gotas caindo e o guarda-chuva aberto" },
  { t: "sol", label: "Sol 🌞", dica: "o céu azul e o sol brilhando" },
];
/** O Tempo 🌦️ — olhar a CENA do clima e nomear (frio/calor/chuva/sol). */
export function gSciTempo(lvl: number): Question {
  const nOpts = lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
  const alvo = pick(TEMPOS);
  const distr = shuffle(TEMPOS.filter((x) => x.t !== alvo.t)).slice(0, nOpts - 1);
  return {
    kind: "weather",
    prompt: "Como está o tempo?",
    big: alvo.t, // WeatherScene lê isto (a cena mostra; a criança nomeia)
    howto: "Olhe bem a cena e descubra o tempo!",
    explain: `Veja: ${alvo.dica}... está ${alvo.t}!`,
    options: shuffle([alvo, ...distr]).map((x) => ({ label: x.label, value: x.t })),
    answer: alvo.t,
  };
}

const FASES = ["Semente", "Broto", "Arvorezinha", "Árvore com frutos"];
const faseNome = (i: number) => FASES[i - 1];
/** Ciclo da Planta 🌳 — a sementinha que cresce (cena viva), nomear e prever a ordem. */
export function gSciCiclo(lvl: number): Question {
  if (lvl === 5) {
    return {
      kind: "order",
      prompt: "Coloque a planta na ordem! 🌰➡️🌳",
      big: "grow",
      howto: "Toque da semente até a árvore com frutos, na ordem!",
      explain: "A planta cresce assim: semente, broto, arvorezinha, árvore com frutos!",
      options: shuffle([1, 2, 3, 4]).map((v) => ({ value: v })),
      answer: [1, 2, 3, 4],
    };
  }
  if (lvl === 4) {
    // o que vem DEPOIS (prever a próxima fase)
    const s = ri(1, 3);
    return {
      kind: "grow",
      prompt: "O que vem DEPOIS?",
      n: s,
      howto: "Veja a fase da plantinha e diga o que vem a seguir!",
      explain: `Depois de ${faseNome(s).toLowerCase()} vem ${faseNome(s + 1).toLowerCase()}!`,
      options: shuffle([1, 2, 3, 4].map((i) => ({ label: faseNome(i), value: i }))),
      answer: s + 1,
    };
  }
  // identificar a fase mostrada
  const s = ri(1, 4);
  const nOpts = lvl === 1 ? 3 : 4;
  const correct = { label: faseNome(s), value: s };
  const distr = shuffle([1, 2, 3, 4].filter((i) => i !== s)).slice(0, nOpts - 1).map((i) => ({ label: faseNome(i), value: i }));
  return {
    kind: "grow",
    prompt: "Que fase é esta?",
    n: s,
    howto: "Olhe a plantinha e descubra em que fase ela está!",
    explain: `Esta é a fase: ${faseNome(s).toLowerCase()}! A planta cresce assim: semente, broto, arvorezinha, árvore.`,
    options: shuffle([correct, ...distr]),
    answer: s,
  };
}

/* As Fases da Vida 👶 — o ciclo da vida da PESSOA (bebê→criança→adulto→idoso). */
const VIDA = ["Bebê", "Criança", "Adulto", "Idoso"];
const vidaNome = (i: number) => VIDA[i - 1];
export function gSciFases(lvl: number): Question {
  if (lvl === 5) {
    // ORDENAR toda a vida (mecânica nova: toque na sequência bebê→idoso)
    return {
      kind: "order",
      prompt: "Coloque na ordem da vida! 👶➡️👴",
      big: "lifestage",
      howto: "Toque do bebê até o idoso, na ordem certa!",
      explain: "A vida é assim: bebê, criança, adulto, idoso!",
      options: shuffle([1, 2, 3, 4]).map((v) => ({ value: v })),
      answer: [1, 2, 3, 4],
    };
  }
  if (lvl === 4) {
    const s = ri(1, 3);
    return {
      kind: "lifestage",
      prompt: "O que vem DEPOIS?",
      n: s,
      howto: "Veja a fase da vida e diga o que vem a seguir!",
      explain: `Depois de ${vidaNome(s).toLowerCase()} vem ${vidaNome(s + 1).toLowerCase()}! A vida é assim: bebê, criança, adulto, idoso.`,
      options: shuffle([1, 2, 3, 4].map((i) => ({ label: vidaNome(i), value: i }))),
      answer: s + 1,
    };
  }
  const s = ri(1, 4);
  const nOpts = lvl === 1 ? 3 : 4;
  const correct = { label: vidaNome(s), value: s };
  const distr = shuffle([1, 2, 3, 4].filter((i) => i !== s)).slice(0, nOpts - 1).map((i) => ({ label: vidaNome(i), value: i }));
  return {
    kind: "lifestage",
    prompt: "Que fase da vida é esta?",
    n: s,
    howto: "Olhe a pessoa e descubra em que fase da vida ela está!",
    explain: `Esta é a fase: ${vidaNome(s).toLowerCase()}! Todos nascem bebê, crescem e um dia ficam idosos.`,
    options: shuffle([correct, ...distr]),
    answer: s,
  };
}

/* Ciclo Animal 🐣 — o ciclo da vida do animal (ovo→pintinho→galinha), fecha a trilogia. */
const ANIM = ["Ovo", "Ovo rachando", "Pintinho", "Galinha"];
const animNome = (i: number) => ANIM[i - 1];
export function gSciAnimal(lvl: number): Question {
  if (lvl === 5) {
    return {
      kind: "order",
      prompt: "Coloque o ciclo na ordem! 🥚➡️🐔",
      big: "animal",
      howto: "Toque do ovo até a galinha, na ordem!",
      explain: "O ciclo é: ovo, ovo rachando, pintinho, galinha!",
      options: shuffle([1, 2, 3, 4]).map((v) => ({ value: v })),
      answer: [1, 2, 3, 4],
    };
  }
  if (lvl === 4) {
    const s = ri(1, 3);
    return {
      kind: "animal",
      prompt: "O que vem DEPOIS?",
      n: s,
      howto: "Veja a fase do bichinho e diga o que vem a seguir!",
      explain: `Depois de ${animNome(s).toLowerCase()} vem ${animNome(s + 1).toLowerCase()}!`,
      options: shuffle([1, 2, 3, 4].map((i) => ({ label: animNome(i), value: i }))),
      answer: s + 1,
    };
  }
  const s = ri(1, 4);
  const nOpts = lvl === 1 ? 3 : 4;
  const correct = { label: animNome(s), value: s };
  const distr = shuffle([1, 2, 3, 4].filter((i) => i !== s)).slice(0, nOpts - 1).map((i) => ({ label: animNome(i), value: i }));
  return {
    kind: "animal",
    prompt: "Que fase é esta?",
    n: s,
    howto: "Olhe o bichinho e descubra em que fase ele está!",
    explain: `Esta é a fase: ${animNome(s).toLowerCase()}! O ciclo: ovo, pintinho, galinha.`,
    options: shuffle([correct, ...distr]),
    answer: s,
  };
}

const SK_ANIMAL = ["Conhecer as fases", "Ovo e pintinho", "Todas as fases", "O que vem depois", "Ordenar o ciclo"];
const SK_FASES = ["Conhecer as fases", "Bebê e criança", "Todas as fases", "O que vem depois", "Mestre da vida"];
const SK_TEMPO = ["Frio ou calor", "Três tempos", "Todos os tempos", "Tempos parecidos", "Mestre do tempo"];
const SK_CICLO = ["Conhecer as fases", "Semente e broto", "Todas as fases", "O que vem depois", "Mestre do ciclo"];

const SK_VIVO = ["Vivo ou objeto (fácil)", "Pega-ratão: nuvem e rio se mexem!", "O que o ser vivo precisa", "Já foi vivo (tronco, folha)", "Detetive: a planta é viva!"];
const SK_CASAS = ["Casas bem conhecidas", "Mais animais", "Casas parecidas", "Animais da água e do céu", "Mestre das moradias"];
const SK_ORIGEM = ["De onde vem (fácil)", "Mais alimentos", "Origens parecidas", "Animal ou planta?", "Mestre das origens"];
const SK_SENTIDOS = ["Ver e ouvir", "Cheirar e provar", "Tocar", "Sentidos misturados", "Mestre dos sentidos"];

export const TRACKS_SCI_PRE: Track[] = [
  { id: "sci_vivo", name: "Vivo ou Não?", icon: "🌱", color: "#22C55E", dark: "#15803D", gen: gSciVivo, prereqs: [], lvlSkills: SK_VIVO },
  { id: "sci_casas", name: "Quem Mora Aqui?", icon: "🏠", color: "#0EA5E9", dark: "#0369A1", gen: gSciCasas, prereqs: [], lvlSkills: SK_CASAS },
  { id: "sci_sentidos", name: "Os 5 Sentidos", icon: "👂", color: "#F59E0B", dark: "#B45309", gen: gSciSentidos, prereqs: [], lvlSkills: SK_SENTIDOS },
  { id: "sci_tempo", name: "O Tempo", icon: "🌦️", color: "#38BDF8", dark: "#0369A1", gen: gSciTempo, prereqs: [], lvlSkills: SK_TEMPO },
  { id: "sci_ciclo", name: "Ciclo da Planta", icon: "🌳", color: "#22C55E", dark: "#15803D", gen: gSciCiclo, prereqs: [], lvlSkills: SK_CICLO },
  { id: "sci_fases", name: "As Fases da Vida", icon: "👶", color: "#F472B6", dark: "#BE185D", gen: gSciFases, prereqs: [], lvlSkills: SK_FASES },
  { id: "sci_animal", name: "Ciclo Animal", icon: "🐣", color: "#FBBF24", dark: "#B45309", gen: gSciAnimal, prereqs: [], lvlSkills: SK_ANIMAL },
];

export const TRACKS_SCI_ANO1: Track[] = [
  { id: "sci_vivo", name: "Vivo ou Não?", icon: "🌱", color: "#22C55E", dark: "#15803D", gen: gSciVivo, prereqs: [], lvlSkills: SK_VIVO },
  { id: "sci_casas", name: "Animais e Casas", icon: "🏠", color: "#0EA5E9", dark: "#0369A1", gen: gSciCasas, prereqs: [], lvlSkills: SK_CASAS },
  { id: "sci_origem", name: "De Onde Vem?", icon: "🥛", color: "#8B5CF6", dark: "#6D28D9", gen: gSciOrigem, prereqs: [], lvlSkills: SK_ORIGEM },
  { id: "sci_sentidos", name: "Os 5 Sentidos", icon: "👂", color: "#F59E0B", dark: "#B45309", gen: gSciSentidos, prereqs: [], lvlSkills: SK_SENTIDOS },
  { id: "sci_tempo", name: "O Tempo", icon: "🌦️", color: "#38BDF8", dark: "#0369A1", gen: gSciTempo, prereqs: [], lvlSkills: SK_TEMPO },
  { id: "sci_ciclo", name: "Ciclo da Planta", icon: "🌳", color: "#22C55E", dark: "#15803D", gen: gSciCiclo, prereqs: ["sci_vivo"], lvlSkills: SK_CICLO },
  { id: "sci_fases", name: "As Fases da Vida", icon: "👶", color: "#F472B6", dark: "#BE185D", gen: gSciFases, prereqs: [], lvlSkills: SK_FASES },
  { id: "sci_animal", name: "Ciclo Animal", icon: "🐣", color: "#FBBF24", dark: "#B45309", gen: gSciAnimal, prereqs: [], lvlSkills: SK_ANIMAL },
];
