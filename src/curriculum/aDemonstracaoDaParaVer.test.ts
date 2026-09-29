import { describe, expect, it } from "vitest";
import { ALL_MATH_TRACKS } from "./motores/curriculum";
import { hasTutorial, tutorialSteps } from "../utils/tutorials";
import { PISO_DO_PASSO_MS, tempoMinimoDoPasso } from "../components/gameloop/ritmoDaAulinha";

/**
 * A demonstração dá para ver.
 *
 * ## O defeito que este portão existe para impedir
 *
 * O "Como faz?" da N1.01 mostra a banana indo para o macaco em quatro passos.
 * O ritmo vinha só do fim da fala — e num aparelho sem voz pt-BR instalada a
 * fala "acaba" no mesmo quadro em que começa. Os quatro passos passavam em
 * menos de um segundo. O pai abriu o primeiro exercício e descreveu
 * exatamente isso: "não aparece indo a banana pro macaco".
 *
 * O ritmo agora é `tempoMinimoDoPasso`, e este portão cobra o que ele promete
 * em TODA competência, não só na que foi consertada à mão.
 *
 * ## O que NÃO é cobrado aqui, e é dívida conhecida
 *
 * Das 450 combinações, **169 têm demonstração e 281 não têm** — medido, não
 * estimado. Onde não há, o botão "Como faz?" nem aparece, e a criança que não
 * entende o enunciado não tem a quem recorrer. Escrever 281 demonstrações é
 * trabalho de fichas, não de portão; fica registrado para não passar por
 * esquecimento.
 */

const NIVEIS = [1, 2, 3, 4, 5];
/** Abaixo disto a criança não chega a acompanhar a cena inteira. */
const DURACAO_MINIMA_MS = 4000;

const COMBINACOES = ALL_MATH_TRACKS
  .filter(t => t.graphId)
  .flatMap(t => NIVEIS.map(nivel => ({ track: t, nivel })));

function comDemonstracao() {
  const achadas: { id: string; nivel: number; passos: ReturnType<typeof tutorialSteps> }[] = [];
  for (const { track, nivel } of COMBINACOES) {
    let q: unknown;
    try { q = track.gen(nivel); } catch { continue; }
    if (!hasTutorial(q as never)) continue;
    achadas.push({ id: track.id, nivel, passos: tutorialSteps(q as never) });
  }
  return achadas;
}

describe("a demonstração dá para ver", () => {
  it("a varredura encontra demonstrações — senão não mede nada", () => {
    // Prova de vida: sem esta linha, apagar todas as aulinhas faria os testes
    // abaixo passarem calados.
    expect(comDemonstracao().length).toBeGreaterThan(100);
  }, 120000);

  it("nenhum passo passa rápido demais para ser visto", () => {
    const rapidos: string[] = [];
    for (const { id, nivel, passos } of comDemonstracao()) {
      passos.forEach((passo, i) => {
        const ms = tempoMinimoDoPasso(passo);
        if (ms < PISO_DO_PASSO_MS) rapidos.push(`${id} n${nivel} passo ${i + 1}: ${ms}ms`);
      });
    }
    expect(rapidos, `passos rápidos demais para a criança acompanhar:\n${rapidos.join("\n")}`).toEqual([]);
  }, 120000);

  it("nenhuma demonstração inteira passa em menos de quatro segundos", () => {
    const curtas: string[] = [];
    for (const { id, nivel, passos } of comDemonstracao()) {
      const total = passos.reduce((soma, p) => soma + tempoMinimoDoPasso(p), 0);
      if (total < DURACAO_MINIMA_MS) curtas.push(`${id} n${nivel}: ${total}ms em ${passos.length} passo(s)`);
    }
    expect(curtas, `demonstrações curtas demais:\n${curtas.join("\n")}`).toEqual([]);
  }, 120000);

  it("todo passo tem o que dizer ou o que mostrar", () => {
    const vazios: string[] = [];
    for (const { id, nivel, passos } of comDemonstracao()) {
      passos.forEach((passo, i) => {
        const fala = String(passo.say ?? "").trim();
        const mostra = passo.show !== undefined && passo.show !== null;
        if (!fala && !mostra) vazios.push(`${id} n${nivel} passo ${i + 1}`);
      });
    }
    expect(vazios, `passos que não dizem nem mostram nada:\n${vazios.join("\n")}`).toEqual([]);
  }, 120000);
});
