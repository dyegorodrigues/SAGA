import { Question, Track } from "../types";
import { ri, numOpts, pickEmo } from "../utils/generators";
import { C } from "../components/Mascot";

/**
 * MATEMÁTICA DE ELITE (Método Singapura) — as ferramentas que criam
 * "calculadora mental". Ver docs/relatorio-expansao-pedagogica.md §1.2-1.3.
 *
 * Cada uma estreia uma CENA VIVA nova (renderizador SVG por código, no espírito
 * Synthesis: construída uma vez, serve infinitas questões, custo zero, offline):
 *  - kind "bond"      → círculo de Amigos dos Números (número no topo, dois braços)
 *  - kind "tenframe"  → caixa mágica (caixa 2×5) para subitização
 */

/* ---------------- Amigos dos Números 🤝 (Number Bonds) ----------------
 * Progressão do catálogo (docs/catalogo-atividades.md, linhas 43-50):
 *  N1 amigos do 5 · N2 pares do 5 · N3 pares do 10 (os mais importantes)
 *  N4 decompor (whole variado) · N5 a ESTRATÉGIA MENTAL asiática (fazer 10)
 * É a trilha que mais transfere para a conta de cabeça vitalícia. */
export function gMatBond(lvl: number): Question {
  // N5 — a estratégia mental de fazer 10 (o topo), agora com explicação falada
  if (lvl === 5) {
    // "8 + 5 → 8 precisa de 2 para virar 10, sobra 3 → 13" (bridging through ten)
    const a = ri(6, 9); // parcela que "quase" chega a 10
    const toTen = 10 - a; // quanto falta para o 10 (1 a 4)
    const b = ri(toTen + 1, 9); // garante que a soma ATRAVESSA a dezena (sobra ≥ 1)
    const rest = b - toTen; // o que sobra depois de fazer 10
    return {
      kind: "tenframe",
      prompt: `Complete o 10 e some o resto: ${a} + ${b}`,
      n: a,
      u: b,
      big: "add",
      howto: `Encha a moldura: ${a} mais ${toTen} faz 10. Sobram ${rest}. Então dá ${a + b}!`,
      explain: `${a} com ${toTen} faz 10, e mais ${rest} dá ${a + b}. Esse é o truque de fazer 10!`,
      options: numOpts(a + b, 4, 10, 18),
      answer: a + b,
    };
  }

  // N1-N4 — CONCRETO na caixa mágica: a criança CONTA os quadradinhos vazios.
  // Dificuldade cresce deixando menos casas cheias (mais para contar).
  const known = lvl === 1 ? ri(7, 9) : lvl === 2 ? ri(5, 8) : lvl === 3 ? ri(2, 8) : ri(1, 9);
  const missing = 10 - known;
  return {
    kind: "tenframe",
    prompt: "Quantas bolinhas faltam para encher os 10? 🤝",
    n: known,
    big: "tofill",
    howto: "Conte os quadradinhos vazios da moldura!",
    explain: `${known} e ${missing} são amigos: juntos eles fazem 10! 🤝`,
    options: numOpts(missing, 4, 0, 10),
    answer: missing,
  };
}

/* ---------------- Caixa Mágica 🔟 (Ten Frame / subitização) ----------------
 * Foco ÚNICO e claro: ENXERGAR a quantidade na moldura ("quantos você vê?").
 * O "fazer 10" mora na trilha Amigos. Dificuldade cresce na faixa e no arranjo. */
export function gMatTenFrame(lvl: number): Question {
  const faixa = [
    [1, 4],
    [3, 6],
    [5, 8],
    [7, 10],
    [4, 10],
  ][Math.min(4, lvl - 1)];
  const n = ri(faixa[0], faixa[1]);
  return {
    kind: "tenframe",
    prompt: "Quantos você vê? 👀",
    n,
    howto: lvl <= 2 ? "Olhe a fileira cheia e conte as bolinhas!" : "Dica: uma fileira cheia já é 5!",
    explain: n > 5 ? `São ${n}: uma fileira de 5 mais ${n - 5}!` : `São ${n} bolinhas!`,
    options: numOpts(n, lvl <= 1 ? 3 : 4, 1, 10),
    answer: n,
  };
}

/* ---------------- Olhômetro 👀 (subitização por FLASH) ----------------
 * kind "flash": o grupo aparece por ~2s, some, e a criança diz "quantos eram?".
 * Treina RECONHECER a quantidade num relance (sem contar um a um) — a raiz do
 * senso numérico (Clements & Sarama). Faixas pequenas de propósito: subitização
 * real é ≤ ~5; N4-5 usam subgrupos ("vi um 3 e mais 2"). Ver catálogo §Olhômetro. */
export function gMatOlho(lvl: number): Question {
  const faixa = [
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 8],
  ][Math.min(4, lvl - 1)];
  const n = ri(faixa[0], faixa[1]);
  const dica = n <= 3 ? "Bateu o olho, já sabe quantos!" : `Um grupinho de 3 e mais ${n - 3}? Isso é ${n}!`;
  return {
    kind: "flash",
    prompt: "Quantos você viu? 👀",
    n,
    emoji: pickEmo(),
    howto: "Olhe RÁPIDO e adivinhe — sem contar um por um!",
    explain: `Eram ${n}! ${dica}`,
    options: numOpts(n, lvl <= 1 ? 3 : 4, 1, 9),
    answer: n,
  };
}

const SK_AMIGOS = ["Amigos do 5 (na moldura)", "Amigos do 10", "Qual par falta?", "Amigos de vários números", "Estratégia: fazer 10 primeiro"];
const SK_MOLDURA = ["Ver quantos tem (até 5)", "Ver quantos tem (até 10)", "Quantos faltam para 10?", "Enxergar sem contar", "Somar na moldura"];
const SK_OLHO = ["Um relance (até 3)", "Bater o olho (até 4)", "Ver rápido (até 5)", "Grupinhos (até 6)", "Dois grupos (até 8)"];

export const TRACKS_MAT_ELITE_PRE: Track[] = [
  { id: "olho", name: "Olhômetro (Flash)", graphId: "C0001_B", island: "alfa", icon: "👀", color: C.grape, dark: C.grapeDark, gen: gMatOlho, prereqs: [], lvlSkills: SK_OLHO },
  { id: "amigos", name: "Amigos do 10", graphId: "C0103", island: "op1", icon: "🤝", color: C.mint, dark: C.mintDark, gen: gMatBond, prereqs: ["soma"], lvlSkills: SK_AMIGOS },
  { id: "moldura", name: "Caixa Mágica", graphId: "C0003", island: "alfa", icon: "🔟", color: C.ocean, dark: C.oceanDark, gen: gMatTenFrame, prereqs: ["contar"], lvlSkills: SK_MOLDURA },
];

export const TRACKS_MAT_ELITE_ANO1: Track[] = [
  { id: "olho", name: "Olhômetro (Flash)", graphId: "C0001_B", island: "alfa", icon: "👀", color: C.grape, dark: C.grapeDark, gen: gMatOlho, prereqs: [], lvlSkills: SK_OLHO },
  { id: "amigos", name: "Amigos dos Números", graphId: "C0104", island: "op1", icon: "🤝", color: C.mint, dark: C.mintDark, gen: gMatBond, prereqs: ["soma"], lvlSkills: SK_AMIGOS },
  { id: "moldura", name: "Caixa Mágica", graphId: "C0003", island: "alfa", icon: "🔟", color: C.ocean, dark: C.oceanDark, gen: gMatTenFrame, prereqs: ["seq"], lvlSkills: SK_MOLDURA },
];
