import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  FALA_DO_REPETIDO,
  alvosDaMaoFantasma,
  arranjoDoToque,
  baloesDoNivel,
  comecaDe,
  contagemPerfeita,
  diagnosticar,
  marcaComCor,
  mostraNumeral,
  temMaoFantasma,
  tetoDoTeclado,
  tetoDoToque,
} from "./touchCountProcedure";

const NIVEIS = [1, 2, 3, 4, 5];

describe("modo `toque` — a escada da ficha F01 §5", () => {
  it("as quantidades sobem 3, 5, 5, 10, 10", () => {
    expect(NIVEIS.map(tetoDoToque)).toEqual([3, 5, 5, 10, 10]);
  });

  it("o arranjo endurece: fila, fila, grade, disperso, disperso", () => {
    expect(NIVEIS.map(arranjoDoToque))
      .toEqual(["fila", "fila", "grade", "disperso", "disperso"]);
  });

  it("o teclado acompanha o escopo — não se oferece o 10 a quem viu três", () => {
    expect(NIVEIS.map(tetoDoTeclado)).toEqual([3, 5, 5, 10, 10]);
    for (const n of NIVEIS) expect(tetoDoTeclado(n)).toBe(tetoDoToque(n));
  });

  it("só o nível 5 tira a marcação de cor — é o desmame do andaime", () => {
    // Manter a cor no 5 apagaria a única coisa que o nível 5 ensina: segurar
    // mentalmente quais já foram contados.
    expect(NIVEIS.map(marcaComCor)).toEqual([true, true, true, true, false]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) =>
      `${tetoDoToque(n)}|${arranjoDoToque(n)}|${marcaComCor(n)}|${temMaoFantasma(n)}`;
    expect(new Set(NIVEIS.map(assinatura)).size).toBe(5);
  });
});

describe("modo `ritmico` — a escada da ficha F27 §5", () => {
  it("os balões sobem 3, 5, 10, 10, 10", () => {
    expect(NIVEIS.map(baloesDoNivel)).toEqual([3, 5, 10, 10, 10]);
  });

  it("o numeral escrito some no nível 4 — a competência é ORAL", () => {
    expect(NIVEIS.map(mostraNumeral)).toEqual([true, true, true, false, false]);
  });

  it("só o nível 5 começa de outro número — é a ponte para somar", () => {
    for (const n of [1, 2, 3, 4]) expect(comecaDe(n), `nível ${n}`).toBe(1);
    const inicios = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(s => comecaDe(5, s)));
    expect(inicios.has(1), "o nível 5 nunca recomeça do 1").toBe(false);
    expect(inicios.size, "o sorteio precisa variar o ponto de partida").toBeGreaterThan(1);
  });

  it("o começo do nível 5 cabe no escopo de dez", () => {
    for (let s = 0; s < 40; s += 1) {
      const inicio = comecaDe(5, s);
      expect(inicio).toBeGreaterThanOrEqual(2);
      expect(inicio + baloesDoNivel(5) - 1).toBeLessThanOrEqual(14);
    }
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) =>
      `${baloesDoNivel(n)}|${mostraNumeral(n)}|${comecaDe(n)}|${temMaoFantasma(n)}`;
    expect(new Set(NIVEIS.map(assinatura)).size).toBe(5);
  });
});

describe("a Mão Fantasma, nos dois modos", () => {
  it("só existe no nível 1", () => {
    expect(NIVEIS.map(temMaoFantasma)).toEqual([true, false, false, false, false]);
  });

  it("toca DOIS no modo toque e UM no rítmico — e isso não é descuido", () => {
    // No canhão, um disparo já ensina o ritmo inteiro. Na contagem, dois toques
    // são precisos para mostrar que o numeral AVANÇA; um só mostraria o numeral
    // aparecendo, não a sequência.
    expect(alvosDaMaoFantasma(1, "toque")).toBe(2);
    expect(alvosDaMaoFantasma(1, "ritmico")).toBe(1);
  });

  it("some do nível 2 em diante nos dois modos", () => {
    for (const n of [2, 3, 4, 5]) {
      expect(alvosDaMaoFantasma(n, "toque"), `toque nível ${n}`).toBe(0);
      expect(alvosDaMaoFantasma(n, "ritmico"), `rítmico nível ${n}`).toBe(0);
    }
  });
});

describe("o diagnóstico — F01 §6 e F27 §6", () => {
  it("recontar para responder é o marco: NAO_TEM_CARDINALIDADE", () => {
    // O erro mais importante da matemática inicial: ela contou tudo, ouviu
    // "cinco", e mesmo assim contou de novo para responder "quantos são?".
    expect(diagnosticar({
      marcados: 5, total: 5, toquesRepetidos: 0,
      recontouAntesDeResponder: true, resposta: 5,
    })).toBe(MisconceptionTag.NAO_TEM_CARDINALIDADE);
  });

  it("e ele aparece MESMO quando ela acerta o número", () => {
    // Acertar não apaga o que a ação revelou. Diagnosticar só pelo número
    // escolhido deixaria passar exatamente o que a F01 existe para detectar.
    const a = {
      marcados: 4, total: 4, toquesRepetidos: 0,
      recontouAntesDeResponder: true, resposta: 4,
    };
    expect(contagemPerfeita(a)).toBe(false);
    expect(diagnosticar(a)).toBe(MisconceptionTag.NAO_TEM_CARDINALIDADE);
  });

  it("responder um a mais é ter recontado algum", () => {
    expect(diagnosticar({ marcados: 5, total: 5, toquesRepetidos: 2, resposta: 6 }))
      .toBe(MisconceptionTag.RECONTOU);
  });

  it("responder um a menos é ter pulado algum", () => {
    expect(diagnosticar({ marcados: 5, total: 5, toquesRepetidos: 0, resposta: 4 }))
      .toBe(MisconceptionTag.PULOU);
  });

  it("errar no disperso quem já acerta em fila é depender do apoio espacial", () => {
    expect(diagnosticar({
      marcados: 8, total: 8, toquesRepetidos: 0, resposta: 5,
      arranjo: "disperso", acertouEmFila: true,
    })).toBe(MisconceptionTag.DEPENDE_DE_ORDEM);
  });

  it("mas não se diz isso de quem nunca acertou em lugar nenhum", () => {
    // Sem o histórico da fila, é só um erro. Chamar de "depende de ordem" seria
    // inventar um diagnóstico e mandar a Oficina resgatar o que não é o problema.
    expect(diagnosticar({
      marcados: 8, total: 8, toquesRepetidos: 0, resposta: 5,
      arranjo: "disperso", acertouEmFila: false,
    })).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("disparar mais vezes que os balões é não monitorar o alvo", () => {
    expect(diagnosticar({ marcados: 12, total: 10, toquesRepetidos: 0 }))
      .toBe(MisconceptionTag.EXCESSO_ACAO);
  });

  it("parar antes de acabar, sem pergunta, é contagem incompleta", () => {
    expect(diagnosticar({ marcados: 6, total: 10, toquesRepetidos: 0 }))
      .toBe(MisconceptionTag.CONTAGEM_INCOMPLETA);
  });

  it("no nível 5 rítmico, começar do 1 é não desacoplar a sequência do início", () => {
    expect(diagnosticar({ marcados: 10, total: 10, toquesRepetidos: 0, comecouDe: 1 }))
      .toBe(MisconceptionTag.NAO_CONTA_A_PARTIR_DE);
  });

  it("continuar do número pedido não gera diagnóstico nenhum", () => {
    expect(diagnosticar({ marcados: 10, total: 10, toquesRepetidos: 0, comecouDe: 4 }))
      .toBeUndefined();
  });

  it("a contagem certa não vira hipótese no Radar", () => {
    expect(diagnosticar({ marcados: 5, total: 5, toquesRepetidos: 0, resposta: 5 }))
      .toBeUndefined();
    expect(contagemPerfeita({ marcados: 5, total: 5, toquesRepetidos: 0, resposta: 5 }))
      .toBe(true);
  });

  it("tocar repetido não é erro — é sinal, e nunca vira penalidade sozinho", () => {
    // F01 §4: "sem penalidade, sem X". O toque repetido informa; quem julga é
    // o número que ela responde.
    expect(diagnosticar({ marcados: 5, total: 5, toquesRepetidos: 4, resposta: 5 }))
      .toBeUndefined();
  });
});

describe("as falas — F01 §7", () => {
  it("o toque repetido tem resposta: silêncio é proibido", () => {
    // Um toque que não responde ensina que o app quebrou, não que o objeto já
    // foi contado.
    expect(FALA_DO_REPETIDO.length).toBeGreaterThan(0);
    expect(FALA_DO_REPETIDO.toLowerCase()).toContain("já");
  });
});
