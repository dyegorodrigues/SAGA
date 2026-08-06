import { describe, expect, it } from "vitest";
import {
  EMOJIS_DO_RELANCE,
  PADRAO_DE_DADO,
  chaveDaPeca,
  construirEmojiRowSpec,
  dedosDe,
  enunciadoNaoEntregaResposta,
  falaDaRevelacao,
  maoCanonica,
  maosDaCena,
  montarSequencia,
  porExtenso,
  posicionarFileira,
  respostaApareceUmaVez,
  roteiroDoNivel,
} from "./emojiRowContract";
import { quantidadeDaMao, quantidadeDoOlhometro } from "./emojiRowProcedure";

/** Um sorteio preso: mesma semente, mesma cena — é o que torna a sonda portão. */
function semente(s: number): () => number {
  let x = s >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

describe("o roteiro cinematográfico — §4", () => {
  it("os tempos fixos são os da ficha", () => {
    const r = roteiroDoNivel("flash", 1);
    expect(r.preparacao).toBe(1200);
    expect(r.regressiva).toBe(900);
    expect(r.silencio).toBe(400);
    expect(r.revelacaoNoAcerto).toBe(800);
    expect(r.revelacaoNoErro).toBe(1500);
  });

  it("a JD2 revela por mais tempo — há mais coisa para ler", () => {
    // §4 da JD2: 1,4s no acerto e 1,8s no erro, porque a revelação mostra a mão
    // cheia em bloco e os dedos extras piscando separados.
    const r = roteiroDoNivel("flash-mao", 1);
    expect(r.revelacaoNoAcerto).toBe(1400);
    expect(r.revelacaoNoErro).toBe(1800);
  });

  it("o flash vem do NÍVEL, não do modo", () => {
    expect(roteiroDoNivel("flash", 1).flash).toBe(1500);
    expect(roteiroDoNivel("flash", 5).flash).toBe(600);
    expect(roteiroDoNivel("flash-mao", 5).flash).toBe(700);
  });
});

describe("as posições", () => {
  it("o padrão de dado é a figura do dado, e é fixa", () => {
    // Uma disposição "quase de dado", sorteada, não seria reconhecível — e o
    // nível 3 perderia justamente o apoio que o distingue do 5.
    for (let n = 1; n <= 5; n += 1) {
      expect(posicionarFileira(n, "dado", semente(1))).toEqual(PADRAO_DE_DADO[n]);
      expect(posicionarFileira(n, "dado", semente(999))).toEqual(PADRAO_DE_DADO[n]);
    }
  });

  it("a fila fica centrada e não se esparrama nas pontas", () => {
    // Dois objetos nas duas pontas fariam a criança varrer a tela para ver que
    // são dois — numa ficha cujo exercício é ver o conjunto de uma vez.
    const dois = posicionarFileira(2, "fila", semente(1));
    expect(Math.abs(dois[1].x - dois[0].x)).toBeLessThanOrEqual(18.001);
    expect((dois[0].x + dois[1].x) / 2).toBeCloseTo(50, 5);
  });

  it("nada sai da área, em nenhum arranjo nem semente", () => {
    for (const s of SEMENTES) {
      for (const arranjo of ["fila", "dado", "disperso"] as const) {
        for (let n = 1; n <= 5; n += 1) {
          for (const p of posicionarFileira(n, arranjo, semente(s))) {
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.x).toBeLessThanOrEqual(100);
            expect(p.y).toBeGreaterThanOrEqual(0);
            expect(p.y).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });

  it("no disperso os objetos não se sobrepõem", () => {
    // Dois objetos colados fariam a criança ver um só — e o erro seria do app.
    for (const s of SEMENTES) {
      const pts = posicionarFileira(5, "disperso", semente(s));
      for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
          expect(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)).toBeGreaterThan(12);
        }
      }
    }
  });
});

describe("a mão — JD2 §3 e §5", () => {
  it("a canônica levanta a partir do polegar, sempre", () => {
    expect(maoCanonica(1).levantados).toEqual(["polegar"]);
    expect(maoCanonica(3).levantados).toEqual(["polegar", "indicador", "medio"]);
    expect(maoCanonica(5).cheia).toBe(true);
  });

  it("o nível 3 SEMPRE traz uma mão cheia — é o andaime da âncora", () => {
    for (const s of SEMENTES) {
      const { min, max } = quantidadeDaMao(3);
      for (let total = min; total <= max; total += 1) {
        const maos = maosDaCena(total, "duas-com-cheia", semente(s));
        expect(maos.some(m => m.cheia), `total ${total}`).toBe(true);
        expect(maos.reduce((a, m) => a + dedosDe(m), 0)).toBe(total);
      }
    }
  });

  it("o nível 5 tira o andaime — nenhuma mão cheia, quando é possível", () => {
    for (const s of SEMENTES) {
      for (let total = 2; total <= 8; total += 1) {
        const maos = maosDaCena(total, "duas-sem-cheia", semente(s));
        expect(maos.some(m => m.cheia), `total ${total}`).toBe(false);
        expect(maos.reduce((a, m) => a + dedosDe(m), 0)).toBe(total);
      }
    }
  });

  it("com 10 dedos a mão cheia é inevitável, e o total continua certo", () => {
    // 10 só existe como 5+5. Preferir uma mão cheia a mentir sobre o total.
    for (const s of SEMENTES) {
      const maos = maosDaCena(10, "duas-sem-cheia", semente(s));
      expect(maos.reduce((a, m) => a + dedosDe(m), 0)).toBe(10);
    }
  });

  it("quando o total não enche duas mãos, a cena mostra UMA", () => {
    // Um punho fechado ao lado de uma mão com um dedo não é "duas mãos": é
    // ruído que a criança tenta ler. O nível 5 abre a faixa para 1 a 10.
    for (const s of SEMENTES) {
      expect(maosDaCena(1, "duas-sem-cheia", semente(s))).toHaveLength(1);
      expect(maosDaCena(1, "duas-livres", semente(s))).toHaveLength(1);
      expect(maosDaCena(5, "duas-com-cheia", semente(s))).toHaveLength(1);
    }
  });

  it("nenhuma mão passa de cinco dedos, nem fica vazia, em nenhuma configuração", () => {
    for (const s of SEMENTES) {
      for (const config of ["livre", "duas-com-cheia", "duas-livres", "duas-sem-cheia"] as const) {
        const { min, max } = { min: 1, max: config === "livre" ? 5 : 10 };
        for (let total = min; total <= max; total += 1) {
          for (const m of maosDaCena(total, config, semente(s))) {
            expect(dedosDe(m)).toBeGreaterThanOrEqual(1);
            expect(dedosDe(m)).toBeLessThanOrEqual(5);
          }
        }
      }
    }
  });
});

describe("o padrão — F52", () => {
  it("a lacuna do nível 4 fica no meio, com sequência dos dois lados", () => {
    // Uma lacuna "no meio" sem nada à direita é uma lacuna no fim com outro nome.
    for (const s of SEMENTES) {
      const seq = montarSequencia(4, semente(s));
      expect(seq.lacuna).toBeGreaterThan(0);
      expect(seq.lacuna).toBeLessThan(seq.casas.length - 1);
      expect(seq.casas[seq.lacuna]).toBeNull();
      expect(seq.casas.filter(c => c === null)).toHaveLength(1);
    }
  });

  it("a peça certa continua a regra, em todos os níveis e sementes", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const seq = montarSequencia(nivel, semente(s));
        if (seq.unidade === "CRESCENTE") {
          expect(seq.correta.quantidade).toBe(seq.anterior.quantidade + 1);
        } else {
          const tam = seq.unidade.length;
          const referencia = seq.casas[seq.lacuna - tam];
          expect(referencia, `nível ${nivel}`).not.toBeNull();
          expect(chaveDaPeca(seq.correta)).toBe(chaveDaPeca(referencia!));
        }
      }
    }
  });

  it("o banco traz a peça certa e a anterior — o distrator é o alvo da ficha", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const seq = montarSequencia(nivel, semente(s));
        const chaves = seq.banco.map(chaveDaPeca);
        expect(chaves, `nível ${nivel}`).toContain(chaveDaPeca(seq.correta));
        expect(chaves).toContain(chaveDaPeca(seq.anterior));
      }
    }
  });

  it("a moldura da unidade enquadra pelo menos duas repetições", () => {
    // §4: "a moldura DESLIZA mostrando cada repetição". Um enquadramento só
    // mostraria um pedaço; dois mostram que o pedaço se repete.
    for (const s of SEMENTES) {
      const seq = montarSequencia(1, semente(s));
      expect(seq.molduras.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("no crescente, peças do mesmo emoji não colidem na chave", () => {
    for (const s of SEMENTES) {
      const seq = montarSequencia(5, semente(s));
      const chaves = seq.banco.map(chaveDaPeca);
      expect(new Set(chaves).size).toBe(chaves.length);
    }
  });
});

describe("o spec, nos três modos e nas oito sementes", () => {
  it("500 amostras sem exceção nem laço infinito", () => {
    for (const modo of ["flash", "flash-mao", "padrao"] as const) {
      for (let i = 0; i < 500; i += 1) {
        const nivel = (i % 5) + 1;
        expect(() => construirEmojiRowSpec(modo, nivel, semente(i + 1))).not.toThrow();
      }
    }
  });

  it("a resposta aparece exatamente uma vez entre as alternativas", () => {
    for (const modo of ["flash", "flash-mao", "padrao"] as const) {
      for (const s of SEMENTES) {
        for (let nivel = 1; nivel <= 5; nivel += 1) {
          const spec = construirEmojiRowSpec(modo, nivel, semente(s));
          expect(respostaApareceUmaVez(spec), `${modo} n${nivel} s${s}`).toBe(true);
        }
      }
    }
  });

  it("o enunciado nunca traz o numeral", () => {
    for (const modo of ["flash", "flash-mao", "padrao"] as const) {
      for (const s of SEMENTES) {
        for (let nivel = 1; nivel <= 5; nivel += 1) {
          expect(enunciadoNaoEntregaResposta(construirEmojiRowSpec(modo, nivel, semente(s)))).toBe(true);
        }
      }
    }
  });

  it("o falado é igual ao escrito — quem não lê ouve a mesma coisa", () => {
    for (const modo of ["flash", "flash-mao", "padrao"] as const) {
      const spec = construirEmojiRowSpec(modo, 1, semente(1));
      expect(spec.falado).toBe(spec.enunciado);
    }
  });

  it("o total respeita a faixa do nível", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const olho = construirEmojiRowSpec("flash", nivel, semente(s));
        const faixaOlho = quantidadeDoOlhometro(nivel);
        expect(olho.total).toBeGreaterThanOrEqual(faixaOlho.min);
        expect(olho.total).toBeLessThanOrEqual(faixaOlho.max);

        const mao = construirEmojiRowSpec("flash-mao", nivel, semente(s));
        const faixaMao = quantidadeDaMao(nivel);
        expect(mao.total).toBeGreaterThanOrEqual(faixaMao.min);
        expect(mao.total).toBeLessThanOrEqual(faixaMao.max);
      }
    }
  });

  it("no relance, a quantidade de pontos é a quantidade da resposta", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const spec = construirEmojiRowSpec("flash", nivel, semente(s));
        expect(spec.pontos).toHaveLength(spec.total!);
        expect(spec.pontosDaRevelacao).toHaveLength(spec.total!);
      }
    }
  });

  it("o desenho vem da lista da ficha — nada traz numeral", () => {
    for (const s of SEMENTES) {
      const spec = construirEmojiRowSpec("flash", 1, semente(s));
      expect(EMOJIS_DO_RELANCE).toContain(spec.emoji);
    }
  });

  it("a revelação do ERRO usa o padrão de dado — ela ensina o formato", () => {
    // §4: "os objetos reaparecem AGRUPADOS NO PADRÃO DE DADO". Repetir o
    // disperso ali seria repetir a pergunta que ela acabou de errar.
    for (const s of SEMENTES) {
      const spec = construirEmojiRowSpec("flash", 5, semente(s));
      expect(spec.arranjo).toBe("disperso");
      expect(spec.pontosDaRevelacao).toEqual(PADRAO_DE_DADO[spec.total!]);
    }
  });
});

describe("as falas da revelação — §4", () => {
  it("o erro da JD1 é a frase da ficha, com o número por extenso", () => {
    // Total fixado: o sorteio pode devolver 1, e o singular tem teste próprio.
    const spec = { ...construirEmojiRowSpec("flash", 3, semente(1)), total: 3 };
    expect(falaDaRevelacao(spec, false)).toBe(`eram ${porExtenso(3)} — olha o formato`);
  });

  it("uma unidade não diz 'eram um'", () => {
    // Concordância de número em fala gerada é a armadilha §6.5 — ela já custou
    // "1 estrelas" uma vez.
    const spec = { ...construirEmojiRowSpec("flash", 1, semente(1)), total: 1 };
    expect(falaDaRevelacao(spec, false)).toBe("era um — olha o formato");
  });

  it("o acerto da JD1 é silencioso — a ficha não escreve fala ali", () => {
    // §4 confirma o acerto VISUALMENTE ("os objetos reaparecem por 800ms").
    // Inventar uma frase seria acrescentar ao cânone.
    expect(falaDaRevelacao(construirEmojiRowSpec("flash", 2, semente(1)), true)).toBeNull();
  });

  it("a JD2 nomeia a âncora quando ela existe, e cala quando não existe", () => {
    const comCheia = construirEmojiRowSpec("flash-mao", 3, semente(1));
    expect(falaDaRevelacao(comCheia, true)).toContain("mão cheia");

    // Sem mão cheia não há âncora para nomear: dizer "uma mão inteira" com três
    // dedos na tela seria descrever outra cena.
    const semCheia = { ...comCheia, maos: [{ levantados: ["polegar", "indicador"] as never, cheia: false }], total: 2 };
    expect(falaDaRevelacao(semCheia, true)).toBeNull();
    expect(falaDaRevelacao(semCheia, false)).toBe("Olha: eram dois dedos.");
  });
});
