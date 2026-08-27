import { afterEach, describe, expect, it } from "vitest";
import { construirEstatisticaChanceF95Spec } from "./estatisticaChanceContract";

/**
 * CLASS-003, segunda dimensão — PE.04/F95.
 *
 * A resposta certa era "certo", "Saco B", "3/5", "continua 1/2" e 6 — nessa
 * ordem, em todo sorteio. Cinco rótulos decorados venciam a competência, e a
 * ficha cobra 3 acertos de 3 em 2 sessões.
 *
 * A medição encontrou dois defeitos que o caso fixo escondia:
 *
 * 1. O palco desenhava os dois sacos de L2 com números escritos à mão —
 *    `favoraveis={2} total={6}` — sem olhar o spec. Sortear o contrato sem
 *    mexer no palco deixaria a barra desenhada mentindo sobre o enunciado.
 * 2. Em L2 a tag `TUDO_CINQUENTA` estava no saco errado. Quem acha que tudo é
 *    cinquenta por cento responde "iguais", não "Saco A": o distrator nomeava
 *    um erro que ninguém que o comete escolheria.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x3ea1c65) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirEstatisticaChanceF95Spec(nivel));
}

describe("CLASS-003 — PE.04/F95: o experimento muda, a escada não", () => {
  it("nenhum nível responde sempre a mesma coisa", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => String(s.resposta))).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo e o total sempre cabe o favorável", () => {
    const modos = ["certo-possivel-impossivel", "mais-menos-provavel", "chance-fracao", "frequencia-independencia", "contar-possibilidades"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.total, `L${nivel} sem total`).toBeGreaterThan(0);
        expect(spec.favoraveis, `L${nivel}: favoráveis além do total`).toBeLessThanOrEqual(spec.total);
      }
    }
  });

  it("L1 só pergunta os dois casos que o nível ensina, e 'possível' é sempre a armadilha", () => {
    // Certo é "acontece em todos", impossível é "em nenhum". Deixar o caso
    // intermediário entrar tornaria "possível" a resposta às vezes — e aí o
    // distrator TUDO_CINQUENTA, que é justamente quem responde "possível" para
    // tudo, ficaria sem casa naquele sorteio: a rodada não diagnosticaria nada.
    const respostas = new Set<string>();
    for (const spec of amostrar(1)) {
      respostas.add(String(spec.resposta));
      expect(["certo", "impossível"]).toContain(String(spec.resposta));
      expect(spec.favoraveis === spec.total || spec.favoraveis === 0, "L1 é tudo ou nada").toBe(true);
      const armadilha = spec.opcoes.find(o => o.misconception === "tudo-cinquenta");
      expect(armadilha?.value, "a armadilha de L1 é 'possível'").toBe("possível");
    }
    expect(respostas.size, "L1 precisa dos dois casos").toBe(2);
  });

  it("L2 desenha os dois sacos do spec, e quem acha que é tudo cinquenta erra", () => {
    for (const spec of amostrar(2)) {
      const sacos = spec.sacos!;
      expect(sacos, "o palco precisa dos sacos do spec para não desenhar número escrito à mão").toHaveLength(2);
      expect(sacos[0].total, "L2 compara sacos de mesmo tamanho: o degrau é contar favoráveis").toBe(sacos[1].total);
      expect(sacos[0].favoraveis).not.toBe(sacos[1].favoraveis);
      const vencedor = sacos.find(s => s.favoraveis === Math.max(sacos[0].favoraveis, sacos[1].favoraveis))!;
      expect(spec.resposta).toBe(vencedor.label);
      expect(spec.opcoes.find(o => o.misconception === "tudo-cinquenta")?.value, "quem acha que tudo é cinquenta responde 'iguais'").toBe("iguais");
    }
    expect(new Set(amostrar(2).map(s => String(s.resposta))).size, "o saco certo não pode ser sempre o mesmo").toBe(2);
  });

  it("L3 escreve a fração do próprio sorteio", () => {
    for (const spec of amostrar(3)) {
      expect(spec.favoraveis).toBeGreaterThan(0);
      expect(spec.favoraveis).toBeLessThan(spec.total);
      expect(spec.resposta).toBe(`${spec.favoraveis}/${spec.total}`);
    }
  });

  it("L4 mantém a chance do experimento sorteado depois do histórico", () => {
    for (const spec of amostrar(4)) {
      expect(spec.historico!.length, "sem histórico não há falácia a desmentir").toBeGreaterThan(2);
      expect(spec.experimento, "o palco precisa saber de que experimento fala").toBeDefined();
      for (const resultado of spec.historico!) expect(spec.experimento!.resultados).toContain(resultado);
      expect(spec.resposta).toBe(`continua ${spec.favoraveis}/${spec.total}`);
      expect(spec.opcoes.filter(o => o.misconception === "falacia-apostador").length, "os dois erros de L4 são a falácia").toBe(2);
    }
    expect(new Set(amostrar(4).map(s => s.experimento!.nome)).size, "um experimento só volta a ser um caso único").toBeGreaterThan(1);
  });

  it("L5 conta a grade que desenha", () => {
    for (const spec of amostrar(5)) {
      const grade = spec.grade!;
      expect(grade.rotulosLinhas).toHaveLength(grade.linhas);
      expect(grade.rotulosColunas).toHaveLength(grade.colunas);
      expect(spec.resposta, "a resposta é o produto da grade").toBe(grade.linhas * grade.colunas);
      expect(spec.total).toBe(grade.linhas * grade.colunas);
      // Somar em vez de multiplicar precisa dar OUTRO número, senão o erro mais
      // comum do nível acerta por acidente.
      expect(grade.linhas + grade.colunas).not.toBe(grade.linhas * grade.colunas);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => String(o.value) === String(spec.resposta) && o.misconception).length, `L${nivel} marcou a certa como erro`).toBe(0);
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa por colisão`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
