import { afterEach, describe, expect, it } from "vitest";
import { construirHorasMinutosSpec } from "./horasMinutosContract";

/**
 * CLASS-003, segunda dimensão — GM.06/F62.
 *
 * O relógio marcava sempre a mesma hora: 3h30, 4h25, 7h40, 2h17 e a duração
 * 9:35→10:50. O caso não variava e a resposta menos ainda — decorar "30" vencia
 * L1 sem ler ponteiro nenhum.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x18d40b7) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirHorasMinutosSpec(nivel));
}

describe("CLASS-003 — GM.06/F62: o relógio muda, e a resposta com ele", () => {
  it("nenhum nível marca sempre a mesma hora nem responde sempre igual", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      // Os dois ponteiros, medidos separados. Medir só o par `hora:minuto`
      // deixava passar um relógio preso às 3 com o minuto sorteado: a mutação
      // que congela a hora ficava verde. O ponteiro pequeno também anda com os
      // minutos, e um mostrador que só aparece numa posição é caso único —
      // mesmo quando a pergunta é sobre o outro ponteiro.
      expect(new Set(specs.map(s => s.horario.horas)).size, `L${nivel} marca sempre ${specs[0].horario.horas} horas`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.horario.minutos)).size, `L${nivel} marca sempre ${specs[0].horario.minutos} minutos`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => String(s.resposta))).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["meia-hora-quartos", "cinco-em-cinco-com-apoio", "cinco-em-cinco", "minuto-a-minuto", "duracao"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("o minuto sorteado respeita o passo que o nível ensina", () => {
    for (const spec of amostrar(1)) {
      expect(spec.intervaloMinutos).toBe(15);
      expect(spec.horario.minutos % 15, "L1 é meia hora e quartos").toBe(0);
      expect(spec.horario.minutos, "0 minutos não exercita o quarto de hora").toBeGreaterThan(0);
    }
    for (const nivel of [2, 3]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.intervaloMinutos).toBe(5);
        expect(spec.horario.minutos % 5, `L${nivel} conta de cinco em cinco`).toBe(0);
        expect(spec.horario.minutos).toBeGreaterThan(0);
      }
    }
    for (const spec of amostrar(4)) {
      expect(spec.intervaloMinutos).toBe(1);
      expect(spec.horario.minutos % 5, "L4 existe para o minuto que NÃO cai na marca de cinco").not.toBe(0);
    }
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.horario.horas).toBeGreaterThanOrEqual(1);
        expect(spec.horario.horas).toBeLessThanOrEqual(12);
        expect(spec.horario.minutos).toBeLessThan(60);
      }
    }
  });

  it("L5 mede uma duração que atravessa a hora, e a conta fecha", () => {
    for (const spec of amostrar(5)) {
      const duracao = spec.duracao!;
      expect(duracao.minutos, "atravessar a hora é o degrau de L5").toBeGreaterThan(60);
      expect(spec.resposta).toBe(duracao.minutos);
      const [hi, mi] = duracao.inicio.split(":").map(Number);
      const [hf, mf] = duracao.fim.split(":").map(Number);
      expect((hf * 60 + mf) - (hi * 60 + mi), `${duracao.inicio}→${duracao.fim} não dá ${duracao.minutos}`).toBe(duracao.minutos);
      expect(`${String(spec.horario.horas).padStart(2, "0")}:${String(spec.horario.minutos).padStart(2, "0")}`,
        "o relógio precisa mostrar o início da duração").toBe(duracao.inicio);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor em ${spec.horario.horas}:${spec.horario.minutos}`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
