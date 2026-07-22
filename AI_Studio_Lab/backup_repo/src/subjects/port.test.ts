import { describe, it, expect } from "vitest";
import {
  TRACKS_PORT_PRE,
  TRACKS_PORT_ANO1,
  RIMAS,
  SILABAS,
  gPortRimas,
  gPortPalmas,
  gPortSilabas,
  gPortSons,
  INICIAIS_VOGAL,
  INICIAIS_CONS,
} from "./port";

const ALL = [...TRACKS_PORT_PRE, ...TRACKS_PORT_ANO1];

describe("Português 📖 — contrato do gerador", () => {
  for (const track of ALL) {
    for (const lvl of [1, 2, 3, 4, 5]) {
      it(`${track.id} nível ${lvl}: 60 questões válidas`, () => {
        for (let i = 0; i < 60; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl} #${i}] ${JSON.stringify(q)}`;
          expect(typeof q.kind, ctx).toBe("string");
          expect(Array.isArray(q.options), ctx).toBe(true);
          expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
          const values = q.options.map((o) => o.value);
          expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);
          expect(values.filter((v) => v === q.answer).length, `resposta única ${ctx}`).toBe(1);
        }
      });
    }
  }
});

describe("Caça-Rimas 🎵 — a resposta certa RIMA e os distratores NÃO", () => {
  const familiaDe = (palavra: string) => RIMAS.find((f) => f.palavras.some(([w]) => w === palavra));

  it("valida a fonologia de 200 questões", () => {
    for (let i = 0; i < 200; i++) {
      const q = gPortRimas(1 + (i % 5));
      const alvoMatch = /O que rima com (\S+)\?/.exec(q.story || "");
      expect(alvoMatch, q.story).toBeTruthy();
      const famAlvo = familiaDe(alvoMatch![1])!;
      const famCerta = familiaDe(q.answer as string)!;
      expect(famCerta.fim, `resposta não rima: ${q.story} → ${q.answer}`).toBe(famAlvo.fim);
      for (const o of q.options) {
        if (o.value !== q.answer) {
          const famD = familiaDe(o.value as string)!;
          expect(famD.fim, `distrator que rima: ${q.story} → ${o.value}`).not.toBe(famAlvo.fim);
        }
      }
    }
  });
});

describe("Fábrica de Sílabas 🏭 — anatomia GraphoGame (kind blend)", () => {
  it("N1-3: fusão visual, resposta = C+V e NUNCA visível no enunciado", () => {
    for (let i = 0; i < 150; i++) {
      const lvl = 1 + (i % 3);
      const q = gPortSilabas(lvl);
      const ctx = JSON.stringify(q);
      expect(q.kind, ctx).toBe("blend");
      expect(q.shown?.length, ctx).toBe(2);
      expect(q.answer, ctx).toBe(q.shown![0] + q.shown![1]);
      expect(q.audibleOptions, ctx).toBe(true);
      // a sílaba-resposta não pode aparecer escrita no que fica na tela
      expect(q.big ?? null, ctx).toBeNull();
      expect(q.prompt.includes(String(q.answer)), ctx).toBe(false);
    }
  });

  it("N5: a palavra completa fica escondida até acertar (bigCompleted)", () => {
    for (let i = 0; i < 80; i++) {
      const q = gPortSilabas(5);
      const ctx = JSON.stringify(q);
      expect(q.bigCompleted, ctx).toBeTruthy();
      // o big visível não contém a sílaba-resposta
      expect(String(q.big).includes(String(q.answer)), ctx).toBe(false);
    }
  });
});

describe("Sons Mágicos 🔤 — fonema↔letra TTS-seguro (nunca consoante isolada)", () => {
  it("N1-2: alvo é vogal, falado (sayTarget) mas nunca escrito na tela", () => {
    for (let i = 0; i < 120; i++) {
      const q = gPortSons(1 + (i % 2));
      const ctx = JSON.stringify(q);
      expect("AEIOU".includes(String(q.answer)), ctx).toBe(true);
      expect(q.sayTarget, ctx).toBeTruthy();
      // o texto visível (prompt+story) não contém a resposta como letra SOLTA
      // (dentro de palavras como "Escute" não é vazamento)
      expect(new RegExp(`\\b${q.answer}\\b`).test(q.prompt + " " + q.story), ctx).toBe(false);
    }
  });

  it("N3-5: a resposta é a PRIMEIRA letra da palavra falada", () => {
    const bancos = [...INICIAIS_VOGAL, ...INICIAIS_CONS];
    for (let i = 0; i < 200; i++) {
      const lvl = 3 + (i % 3);
      const q = gPortSons(lvl);
      const ctx = JSON.stringify(q);
      const palavra = /^(\S+)\.\.\./.exec(q.sayTarget || "")![1].toUpperCase();
      const w = bancos.find((x) => x.p === palavra);
      expect(w, `palavra fora do banco: ${ctx}`).toBeTruthy();
      expect(q.answer, ctx).toBe(w!.p[0]);
      // a palavra nunca aparece escrita (só o emoji dá a pista)
      expect((q.prompt + " " + q.story).toUpperCase().includes(palavra), ctx).toBe(false);
    }
  });

  it("N5: o par surda/sonora confusável está entre as opções", () => {
    const PARES: Record<string, string> = { P: "B", B: "P", T: "D", D: "T", F: "V", V: "F" };
    for (let i = 0; i < 120; i++) {
      const q = gPortSons(5);
      const par = PARES[String(q.answer)];
      if (!par) continue; // consoantes sem par (M, N, L, S) não exigem
      const vals = q.options.map((o) => o.value);
      expect(vals, JSON.stringify(q)).toContain(par);
    }
  });
});

describe("Palminhas 👏 — a resposta é o número real de sílabas", () => {
  it("valida a contagem de 200 questões", () => {
    for (let i = 0; i < 200; i++) {
      const q = gPortPalmas(1 + (i % 5));
      const m = /A palavra é (\S+)\./.exec(q.story || "");
      expect(m, q.story).toBeTruthy();
      const w = SILABAS.find((x) => x.p === m![1])!;
      expect(q.answer, `${q.story}`).toBe(w.s.length);
    }
  });
});
