import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  alternativas, distratores, ehPergunavelComDiagnostico, falaDaPromocao,
  materialDe, mostraMaterial, multiplicadoresDoNivel, numeroMaximoDoNivel, ordensDeslocadas,
  resolver, semReagrupar, tipoDe,
} from "./deslocamentoProcedure";

const NUMEROS = Array.from({ length: 89 }, (_, i) => i + 11); // 11..99

describe("multiplicar por dez é DESLOCAR, não acrescentar zero", () => {
  it("dez sobe uma ordem; cem sobe duas", () => {
    expect(ordensDeslocadas(10)).toBe(1);
    expect(ordensDeslocadas(100)).toBe(2);
    expect(ordensDeslocadas(30)).toBe(1);
    expect(ordensDeslocadas(400)).toBe(2);
    expect(ordensDeslocadas(3)).toBe(0);
  });

  it("a fala descreve a promoção das peças, sem dizer o resultado", () => {
    expect(falaDaPromocao(10)).toContain("cubinho vira barra");
    expect(falaDaPromocao(100)).toContain("duas casas");
    expect(falaDaPromocao(10)).not.toMatch(/\d/);
  });

  it("dizendo 'cada peça', o texto precisa listar TODAS as viagens", () => {
    // O erro anterior: "cada peça sobe duas casas: cubinho vira placa" —
    // prometia CADA e entregava UMA. Numa pergunta como 33 × 100 a criança tem
    // barras e cubinhos, e metade do material dela ficava sem explicação.
    for (const multiplicador of [10, 100]) {
      const texto = falaDaPromocao(multiplicador);
      const viagens = (texto.match(/vira/g) ?? []).length;
      const esperado = 4 - ordensDeslocadas(multiplicador); // 4 casas
      expect(viagens, `${texto} — ${viagens} viagens, esperado ${esperado}`).toBe(esperado);
      expect(texto).toContain("cubinho");
      expect(texto).toContain("barra");
    }
  });

  it("o material representa o número ANTES, nunca o depois", () => {
    expect(materialDe(23)).toEqual({ centenas: 0, dezenas: 2, unidades: 3 });
    expect(materialDe(230)).toEqual({ centenas: 2, dezenas: 3, unidades: 0 });
    // Contar o material de 23 dá 23, não 230 — o apoio não entrega a resposta.
    for (const n of NUMEROS) {
      const m = materialDe(n);
      expect(m.centenas * 100 + m.dezenas * 10 + m.unidades, `${n}`).toBe(n);
    }
  });
});

describe("a escada dos cinco níveis", () => {
  it("segue a tabela da ficha F67", () => {
    expect(multiplicadoresDoNivel(1)).toEqual([10]);
    expect(multiplicadoresDoNivel(2)).toEqual([100]);
    expect(multiplicadoresDoNivel(3)).toEqual([10]);
    expect(multiplicadoresDoNivel(4).every(m => m < 10)).toBe(true);
    expect(multiplicadoresDoNivel(5).some(m => m >= 100)).toBe(true);
  });

  it("o material sai no nível 3 — é o que faz o 3 ser mais difícil que o 1", () => {
    expect([1, 2, 3, 4, 5].map(mostraMaterial)).toEqual([true, true, false, false, false]);
  });

  it("onde há material, o número fica pequeno o bastante para as peças serem lidas", () => {
    // 85 vira oito barras e cinco cubinhos: treze peças numa tela de 390px são
    // ruído, não apoio. A ficha exemplifica com 23 justamente por isso.
    for (const nivel of [1, 2]) {
      const m = materialDe(numeroMaximoDoNivel(nivel));
      expect(m.dezenas + m.unidades, `nível ${nivel} chegaria a ${m.dezenas + m.unidades} peças`)
        .toBeLessThanOrEqual(12);
    }
    // Sem material o número pode crescer: o que se treina já é o deslocamento.
    expect(numeroMaximoDoNivel(3)).toBeGreaterThan(numeroMaximoDoNivel(1));
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) => `${multiplicadoresDoNivel(n).join(",")}|${mostraMaterial(n)}`;
    expect(new Set([1, 2, 3, 4, 5].map(assinatura)).size).toBe(5);
  });

  it("classifica o tipo de conta corretamente", () => {
    expect(tipoDe(10)).toBe("potencia");
    expect(tipoDe(100)).toBe("potencia");
    expect(tipoDe(3)).toBe("digito");
    expect(tipoDe(30)).toBe("multiplo");
  });
});

describe("o erro de quem decorou 'acrescenta zero'", () => {
  it("só é detectável no ×100, onde a regra do zero FALHA", () => {
    // Com ×10 a regra acerta por acaso: 23 × 10 = 230, e "acrescenta zero" dá
    // 230 também. É o ×100 que revela quem decorou sem entender.
    const cem = distratores({ numero: 23, multiplicador: 100 });
    expect(cem.find(d => d.valor === 230)?.tag)
      .toBe(MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER);

    const dez = distratores({ numero: 23, multiplicador: 10 });
    expect(dez.map(d => d.tag)).not.toContain(MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER);
  });

  it("esquecer o vai-um tem valor próprio: 27 × 3 responde 61 em vez de 81", () => {
    expect(resolver({ numero: 27, multiplicador: 3 })).toBe(81);
    expect(semReagrupar({ numero: 27, multiplicador: 3 })).toBe(61);
    expect(distratores({ numero: 27, multiplicador: 3 }).find(d => d.valor === 61)?.tag)
      .toBe(MisconceptionTag.ESQUECE_REAGRUPAMENTO);
  });

  it("fazer a tabuada e esquecer de deslocar: 12 × 30 responde 36", () => {
    expect(resolver({ numero: 12, multiplicador: 30 })).toBe(360);
    expect(distratores({ numero: 12, multiplicador: 30 }).find(d => d.valor === 36)?.tag)
      .toBe(MisconceptionTag.ORDEM_ERRADA);
  });
});

describe("invariantes em toda a ficha", () => {
  const TODAS = [1, 2, 3, 4, 5].flatMap(nivel =>
    multiplicadoresDoNivel(nivel).flatMap(multiplicador =>
      NUMEROS.map(numero => ({ numero, multiplicador }))))
    .filter(ehPergunavelComDiagnostico);

  it("sobra material suficiente para a ficha existir", () => {
    expect(TODAS.length).toBeGreaterThan(300);
  });

  it("a resposta aparece uma vez só, e nada se repete", () => {
    for (const c of TODAS) {
      const alts = alternativas(c);
      expect(alts.filter(a => a.valor === resolver(c)), `${c.numero}×${c.multiplicador}`)
        .toHaveLength(1);
      expect(new Set(alts.map(a => a.valor)).size).toBe(alts.length);
    }
  });

  it("nenhuma alternativa é negativa, zero ou fracionária", () => {
    for (const c of TODAS) {
      for (const a of alternativas(c)) {
        expect(Number.isInteger(a.valor), `${c.numero}×${c.multiplicador} → ${a.valor}`).toBe(true);
        expect(a.valor).toBeGreaterThan(0);
      }
    }
  });

  it("nunca passa de quatro opções — o teto do cânone §9.1", () => {
    for (const c of TODAS) {
      expect(alternativas(c).length).toBeLessThanOrEqual(4);
      expect(alternativas(c).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("todo nível 4 aceito exige mesmo reagrupamento", () => {
    // Sem "vai um" não há o que a ficha queira diagnosticar naquele nível.
    for (const c of TODAS.filter(x => tipoDe(x.multiplicador) === "digito")) {
      expect((c.numero % 10) * c.multiplicador, `${c.numero}×${c.multiplicador}`)
        .toBeGreaterThanOrEqual(10);
    }
  });
});
