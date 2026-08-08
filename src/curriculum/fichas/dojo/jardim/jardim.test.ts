import { describe, expect, it } from "vitest";
import { JARDIM, JD1, JD2, JD3, JD5 } from "./index";
import { JOURNEY_FICHAS } from "../../index";
import { Composer } from "../../../Composer";
import { ALL_MATH_TRACKS } from "../../../motores/curriculum";
import { EmojiRowSpec } from "../../../procedimentos/emojiRowContract";
import { configuracaoDaMao, quantidadeDaMao } from "../../../procedimentos/emojiRowProcedure";
import { MolduraSpec } from "../../../procedimentos/tenFrameContract";

/**
 * O Jardim do Dojo — e a pendência P7.
 *
 * A JD2 §5 tem cinco degraus; a Jornada do N1.08 comportava dois, porque três
 * dos cinco níveis dela pertencem à F02. **Nenhum exercício se perde:** os
 * outros três vivem aqui, na trilha que a própria ficha diz ser a casa deles
 * (*"Também é trilha do Dojo (JD2)"*).
 *
 * Este teste é o que impede a alegação de virar promessa: se os cinco níveis
 * não gerarem questão, a P7 não está resolvida, está escondida.
 */

describe("Jardim do Dojo — as trilhas de automaticidade", () => {
  it("cada trilha gera questão executável nos CINCO níveis, na sua própria primitiva", () => {
    for (const { ficha } of JARDIM) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const q = Composer.generate(ficha, nivel);
        expect(q.kind, `${ficha.id} n${nivel}`).toBe(ficha.niveis[nivel].primitiva);
        expect(q.evaluate(q.answer), `${ficha.id} n${nivel} responde`).toBe(true);
        if (q.kind === "fileira") {
          expect(q.options?.length, `${ficha.id} n${nivel}`).toBeGreaterThanOrEqual(2);
        } else if (q.kind === "moldura") {
          expect((q.uiProps as MolduraSpec).alternativas.length, `${ficha.id} n${nivel}`)
            .toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it("JD3 preserva o vazio disperso no topo e JD5 preserva a etapa sem moldura", () => {
    const jd3 = Composer.generate(JD3, 5).uiProps as MolduraSpec;
    const jd5 = Composer.generate(JD5, 5).uiProps as MolduraSpec;
    expect(jd3.disperso).toBe(true);
    expect(jd5.semMoldura).toBe(true);
  });

  it("JD2 serve os TRÊS degraus de duas mãos que a Jornada não comporta — a P7", () => {
    // §5, níveis 3 a 5: duas mãos com uma cheia, duas livres, duas sem cheia.
    for (let nivel = 3; nivel <= 5; nivel += 1) {
      const spec = Composer.generate(JD2, nivel).uiProps as EmojiRowSpec;
      expect(spec.config, `n${nivel}`).toBe(configuracaoDaMao(nivel));
      const faixa = quantidadeDaMao(nivel);
      expect(spec.total!).toBeGreaterThanOrEqual(faixa.min);
      expect(spec.total!).toBeLessThanOrEqual(faixa.max);
    }
  });

  it("o nível 3 do JD2 traz sempre a mão cheia — o andaime da âncora", () => {
    for (let i = 0; i < 40; i += 1) {
      const spec = Composer.generate(JD2, 3).uiProps as EmojiRowSpec;
      expect(spec.maos!.some(m => m.cheia)).toBe(true);
    }
  });

  it("as trilhas do Jardim NÃO são nós da Jornada", () => {
    // Elas medem automaticidade, não compreensão: entrar no grafo faria o
    // desbloqueio depender de velocidade, que o §5.1-bis proíbe.
    const idsDoGrafo = new Set((ALL_MATH_TRACKS as { id: string }[]).map(t => t.id));
    for (const { ficha } of JARDIM) {
      expect(idsDoGrafo.has(ficha.id), `${ficha.id} entrou no grafo`).toBe(false);
      expect(JOURNEY_FICHAS.some(f => f.id === ficha.id), `${ficha.id} na Jornada`).toBe(false);
    }
  });

  it("toda trilha aponta para uma competência-mãe que existe", () => {
    const idsDoGrafo = new Set((ALL_MATH_TRACKS as { id: string }[]).map(t => t.id));
    for (const trilha of JARDIM) {
      expect(idsDoGrafo.has(trilha.mae), `mãe ${trilha.mae}`).toBe(true);
      expect(trilha.ficha.prereqs).toContain(trilha.mae);
    }
  });

  it("o rt_alvo CAI a cada nível — é o instrumento do Jardim", () => {
    // Na Jornada o relógio é silencioso (§5.1-bis). Aqui ele é o exercício:
    // a trilha existe para a criança ficar mais rápida no que já entende.
    for (const { ficha } of JARDIM) {
      const alvos = [1, 2, 3, 4, 5].map(n => ficha.niveis![n].rt_alvo!);
      for (let i = 1; i < alvos.length; i += 1) {
        expect(alvos[i], `${ficha.id} n${i + 1}`).toBeLessThan(alvos[i - 1]);
      }
    }
  });

  it("a voz da JD2 nunca manda contar — o veto da §7 vale no Dojo também", () => {
    expect(JD2.explain).not.toMatch(/\bconte\b/i);
    expect(JD1.explain).not.toMatch(/\bconte\b/i);
  });
});
