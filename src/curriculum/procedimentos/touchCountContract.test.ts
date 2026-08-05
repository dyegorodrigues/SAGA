import { describe, expect, it } from "vitest";
import {
  TEMAS,
  TEMA_DO_CANHAO,
  construirTouchCountSpec,
  enunciadoDoToque,
  enunciadoNaoEntregaResposta,
  posicionar,
} from "./touchCountContract";
import { ModoDeContagem, baloesDoNivel, tetoDoToque } from "./touchCountProcedure";

const NIVEIS = [1, 2, 3, 4, 5];
const MODOS: ModoDeContagem[] = ["toque", "ritmico"];

/** Um sorteio preso, para a cena ser a mesma em duas execuções. */
function semente(s0: number): () => number {
  let s = s0 >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Toda cena de todo nível, nos dois modos, em oito sementes. */
const TUDO = MODOS.flatMap(modo =>
  NIVEIS.flatMap(n =>
    [1, 7, 42, 99, 123, 777, 2024, 31415].map(s => ({
      modo, n, s, spec: construirTouchCountSpec(modo, n, semente(s)),
    }))));

describe("o enunciado nunca entrega a resposta", () => {
  it("em nenhum nível, de nenhum modo, em nenhuma semente", () => {
    // O número é o PRODUTO DO ATO (F01 §4). Escrevê-lo no enunciado trocaria
    // contar por ler.
    for (const { spec, modo, n } of TUDO) {
      expect(enunciadoNaoEntregaResposta(spec), `${modo} nível ${n}: "${spec.enunciado}"`)
        .toBe(true);
    }
  });

  it("o único numeral admitido é o ponto de partida do nível 5 rítmico", () => {
    for (const { spec, modo, n } of TUDO) {
      const numerais = (spec.enunciado.match(/\d+/g) ?? []).map(Number);
      if (numerais.length === 0) continue;
      expect(`${modo}${n}`).toBe("ritmico5");
      expect(numerais).toEqual([spec.jaFeitos]);
    }
  });

  it("o falado é igual ao escrito: quem não lê ouve a mesma coisa", () => {
    for (const { spec } of TUDO) expect(spec.falado).toBe(spec.enunciado);
  });

  it("o artigo concorda com o nome — 'as lagartas', nunca 'os lagartas'", () => {
    // A criança de 4 anos OUVE. Erro de concordância soa errado antes de
    // parecer errado. Eu já tinha aprendido isto na F07 ("uma banana", não "um
    // banana") e repeti assim mesmo — Padrão Ouro §6.34.
    const femininos = ["maçãs", "estrelas", "lagartas"];
    for (const t of [...TEMAS, TEMA_DO_CANHAO]) {
      expect(t.artigo, t.nome).toBe(femininos.includes(t.nome) ? "as" : "os");
    }
    for (const { spec, modo } of TUDO) {
      if (modo !== "toque") continue;
      if (spec.total === 1) continue;
      expect(spec.enunciado, spec.nome).toContain(`Conte ${spec.artigo} ${spec.nome}`);
    }
  });

  it("com UM alvo, a frase iria para o singular", () => {
    // "Conte os peixinhos" com um peixinho na tela é a primeira frase que a
    // criança de 4 anos ouviria do app. Nenhum teste pergunta se a frase faz
    // sentido — foi o print que mostrou.
    //
    // A cena de um alvo não ocorre mais (ver o teste do piso, abaixo). A guarda
    // fica porque a regra de concordância é da LÍNGUA, não do sorteio: quem
    // mexer no piso amanhã não deve reencontrar a frase errada.
    for (const t of TEMAS) {
      const frase = enunciadoDoToque(t, 1);
      expect(frase, t.nome).toContain(t.singular);
      expect(frase, t.nome).not.toContain(t.nome);
      expect(frase.startsWith(t.artigo === "as" ? "Conte a " : "Conte o "), t.nome).toBe(true);
    }
  });

  it("o nome do tema é plural e não traz número", () => {
    for (const { spec } of TUDO) expect(spec.nome).not.toMatch(/\d/);
    for (const t of [...TEMAS, TEMA_DO_CANHAO]) expect(t.nome).not.toMatch(/\d/);
  });
});

describe("a escada chega ao spec", () => {
  it("o rítmico dá o número exato de balões da tabela F27", () => {
    for (const { spec, modo, n } of TUDO) {
      if (modo !== "ritmico") continue;
      expect(spec.total, `nível ${n}`).toBe(baloesDoNivel(n));
    }
  });

  it("o toque respeita o teto da F01 e nunca põe uma cena de um alvo só", () => {
    // O piso de dois é desvio declarado da faixa "1 a 3": com um objeto, a Mão
    // Fantasma faz o exercício inteiro e sobra nada para a criança. Ver o
    // comentário de `totalDoToque`.
    for (const { spec, modo, n } of TUDO) {
      if (modo !== "toque") continue;
      expect(spec.total, `nível ${n}`).toBeGreaterThanOrEqual(2);
      expect(spec.total, `nível ${n}`).toBeLessThanOrEqual(tetoDoToque(n));
    }
  });

  it("a Mão Fantasma sempre deixa alvo para a criança", () => {
    // Se ela toca a cena inteira, o "agora você conta!" da coreografia aponta
    // para o vazio.
    for (const { spec, modo, n } of TUDO) {
      if (spec.maoFantasma === 0) continue;
      expect(spec.maoFantasma, `${modo} nível ${n}`).toBeLessThan(spec.total);
    }
  });

  it("o teclado só existe no modo toque — o rítmico é ORAL", () => {
    // Pôr teclado no canhão trocaria uma competência oral por uma de leitura.
    for (const { spec, modo } of TUDO) {
      if (modo === "ritmico") {
        expect(spec.tecladoAte).toBe(0);
        expect(spec.pergunta).toBeNull();
      } else {
        expect(spec.tecladoAte).toBeGreaterThan(0);
        expect(spec.pergunta).toBeTruthy();
      }
    }
  });

  it("o teclado nunca é menor que o total que ela vai contar", () => {
    // Um teclado que não contém a resposta é um exercício sem saída.
    for (const { spec, modo, n } of TUDO) {
      if (modo !== "toque") continue;
      expect(spec.tecladoAte, `nível ${n}`).toBeGreaterThanOrEqual(spec.total);
    }
  });

  it("o ato é `estourar` no canhão e `colorir` no toque — some no nível 5", () => {
    // Não é a mesma marca com outra cor: são atos diferentes. O balão explode e
    // sai; o objeto contado ganha cor e fica. O nível 5 do toque não marca nada.
    for (const { spec, modo, n } of TUDO) {
      const esperado = modo === "ritmico" ? "estourar" : (n === 5 ? "nada" : "colorir");
      expect(spec.aoMarcar, `${modo} nível ${n}`).toBe(esperado);
    }
  });

  it("o gabarito é o total de alvos, sempre", () => {
    for (const { spec } of TUDO) {
      expect(spec.resposta).toBe(spec.total);
      expect(spec.alvos).toHaveLength(spec.total);
    }
  });

  it("cada nível produz uma cena observavelmente diferente", () => {
    for (const modo of MODOS) {
      const assinatura = (n: number) => {
        const s = construirTouchCountSpec(modo, n, semente(42));
        return `${s.arranjo}|${s.aoMarcar}|${s.mostraNumeral}|${s.jaFeitos}|${s.maoFantasma}`;
      };
      expect(new Set(NIVEIS.map(assinatura)).size, modo).toBeGreaterThanOrEqual(4);
    }
  });

  it("a mesma semente devolve a mesma cena — a sonda precisa disso", () => {
    for (const modo of MODOS) {
      for (const n of NIVEIS) {
        const a = construirTouchCountSpec(modo, n, semente(99));
        const b = construirTouchCountSpec(modo, n, semente(99));
        expect(JSON.stringify(a), `${modo} nível ${n}`).toBe(JSON.stringify(b));
      }
    }
  });
});

describe("os alvos cabem na tela e dá para tocar um por um", () => {
  it("nenhum alvo sai da área, em nenhuma cena", () => {
    for (const { spec, modo, n, s } of TUDO) {
      for (const a of spec.alvos) {
        expect(a.x, `${modo} n${n} s${s}`).toBeGreaterThanOrEqual(0);
        expect(a.x, `${modo} n${n} s${s}`).toBeLessThanOrEqual(100);
        expect(a.y, `${modo} n${n} s${s}`).toBeGreaterThanOrEqual(0);
        expect(a.y, `${modo} n${n} s${s}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it("dois alvos nunca se sobrepõem — em TODOS os arranjos, de 1 a 10 alvos", () => {
    // Alvos sobrepostos fariam a criança contar um objeto que ela não consegue
    // tocar separadamente — e o erro seria do app, não dela.
    //
    // Este teste só cobria `disperso`, e com dez alvos fixos. A fila passou
    // batida: dez balões numa linha só de 390px se sobrepõem em 27%, e foi a
    // SONDA que pegou, não este arquivo. Um teste que cobre um caso e nomeia
    // todos é pior que teste nenhum — ele afirma o que não verificou.
    for (const arranjo of ["fila", "grade", "disperso"] as const) {
      for (let total = 1; total <= 10; total += 1) {
        for (let s = 1; s <= 12; s += 1) {
          const alvos = posicionar(total, arranjo, semente(s * 7919));
          for (let i = 0; i < alvos.length; i += 1) {
            for (let j = i + 1; j < alvos.length; j += 1) {
              const d = Math.hypot(alvos[i].x - alvos[j].x, alvos[i].y - alvos[j].y);
              expect(d, `${arranjo}, ${total} alvos, semente ${s}: ${i} e ${j} colados`)
                .toBeGreaterThan(10);
            }
          }
        }
      }
    }
  });

  it("a fila é uma linha só enquanto cabe, e quebra quando não cabe", () => {
    const cabe = posicionar(5, "fila", semente(1));
    expect(new Set(cabe.map(a => a.y)).size, "cinco cabem numa linha").toBe(1);
    for (let i = 1; i < cabe.length; i += 1) {
      expect(cabe[i].x).toBeGreaterThan(cabe[i - 1].x);
    }

    // Dez não cabem: insistir na linha única produz sobreposição de 27%.
    const naoCabe = posicionar(10, "fila", semente(1));
    expect(new Set(naoCabe.map(a => a.y)).size, "dez precisam quebrar").toBeGreaterThan(1);
  });

  it("a grade tem linha E coluna — senão é uma fila com outro nome", () => {
    // O nível 3 ensina a organização em linhas e colunas. Uma "grade" de uma
    // linha só não ensinaria nada de novo em relação ao nível 2.
    const alvos = posicionar(5, "grade", semente(1));
    expect(new Set(alvos.map(a => a.y)).size).toBeGreaterThan(1);
    expect(new Set(alvos.map(a => a.x)).size).toBeGreaterThan(1);
  });

  it("a linha incompleta fica CENTRADA sob as outras", () => {
    // Três alvos na grade davam dois nas pontas e um embaixo à esquerda: a
    // criança lê isso como disperso, não como "linhas e colunas" — que é
    // exatamente o que o nível 3 ensina.
    for (const total of [3, 5, 7]) {
      const alvos = posicionar(total, "grade", semente(1));
      const porY = new Map<number, number[]>();
      for (const a of alvos) {
        const y = Math.round(a.y);
        porY.set(y, [...(porY.get(y) ?? []), a.x]);
      }
      for (const [y, xs] of porY) {
        const centro = (Math.min(...xs) + Math.max(...xs)) / 2;
        expect(Math.abs(centro - 50), `${total} alvos, linha y=${y} descentrada`)
          .toBeLessThan(2);
      }
    }
  });

  it("poucos alvos ficam agrupados, não esticados nas duas pontas", () => {
    // Dois alvos nas pontas fazem a criança varrer a tela inteira para ver que
    // são dois. O conjunto tem de ser lido como conjunto.
    const dois = posicionar(2, "fila", semente(1));
    expect(Math.abs(dois[1].x - dois[0].x), "dois alvos esticados").toBeLessThanOrEqual(21);
    const centro = (dois[0].x + dois[1].x) / 2;
    expect(Math.abs(centro - 50), "o par não ficou centrado").toBeLessThan(2);
  });

  it("um alvo só fica no meio, e não grudado na margem", () => {
    for (const arranjo of ["fila", "grade", "disperso"] as const) {
      const [a] = posicionar(1, arranjo, semente(5));
      expect(a.x, arranjo).toBeGreaterThan(5);
      expect(a.x, arranjo).toBeLessThan(95);
    }
  });
});
