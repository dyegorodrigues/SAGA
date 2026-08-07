import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  FALAS,
  PARES,
  diagnosticar,
  dominou,
  oposta,
  parDoNivel,
  produzNivel,
} from "./posicaoProcedure";
import {
  ALTURA_DA_CENA,
  LARGURA_DA_CENA,
  cadaObjetoEstaOndeDiz,
  cenaEValida,
  construirPosicaoSpec,
  nomeDoObjeto,
  posicaoDoPonto,
} from "./posicaoContract";
import { GE_01 } from "../fichas/jornada/GE.01";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const FICHAS_MD = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
);

/**
 * O cânone escreve a preposição em **negrito** dentro da frase — "Qual objeto
 * está **embaixo** da mesa?". O negrito é a marca de ÊNFASE NA FALA que a §4
 * pede, não parte da frase. Comparar sem ele é comparar o texto.
 */
const CANONE = FICHAS_MD.replace(/\*\*/g, "");

describe("F47 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, "cima-baixo"],
    [2, "dentro-fora"],
    [3, "frente-atras"],
    [4, "esquerda-direita"],
  ])("nível %i: o par é %s", (nivel, par) => {
    expect(parDoNivel(nivel)).toBe(par);
  });

  it("só o nível 5 PRODUZ — ela coloca em vez de apontar", () => {
    expect([1, 2, 3, 4, 5].map(produzNivel)).toEqual([false, false, false, false, true]);
  });

  it("⚠️ o nível 5 muda o ATO, não a preposição", () => {
    // §6.36: uma tela introduz no máximo uma coisa nova. Estrear o "produzir"
    // junto com um par inédito seriam duas.
    expect(parDoNivel(5)).toBe(parDoNivel(1));
  });

  it("cada preposição tem exatamente uma oposta, e é recíproca", () => {
    for (const [a, b] of Object.values(PARES)) {
      expect(oposta(a)).toBe(b);
      expect(oposta(b)).toBe(a);
    }
  });
});

describe("a cena", () => {
  it("⚠️ cada objeto está mesmo onde a cena diz que ele está", () => {
    // Parece tautologia e não é: era exatamente aqui que o gerador antigo
    // mentia. Ele escrevia "🐈\n📦" e afirmava "em cima" sem que nada na tela
    // sustentasse a afirmação.
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 4; nivel += 1) {
        const spec = construirPosicaoSpec(nivel, semente(s));
        expect(cadaObjetoEstaOndeDiz(spec), `n${nivel} s${s}`).toBe(true);
      }
    }
  });

  it("nada colide e nada sai do campo — todo nível, toda semente", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        expect(cenaEValida(construirPosicaoSpec(nivel, semente(s))), `n${nivel} s${s}`).toBe(true);
      }
    }
  });

  it("⚠️ UM único referencial na cena — a regra dura da §2", () => {
    // "Duas mesas tornam a pergunta ambígua — a criança não sabe de qual mesa
    // se fala." O referencial pode ter várias PEÇAS (tampo e pernas), mas é um.
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const spec = construirPosicaoSpec(nivel, semente(s));
        expect(new Set([spec.referencial.id]).size, `n${nivel} s${s}`).toBe(1);
      }
    }
  });

  it("os níveis de reconhecimento trazem DOIS objetos — §3", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 4; nivel += 1) {
        const spec = construirPosicaoSpec(nivel, semente(s));
        expect(spec.objetos).toHaveLength(2);
        // Um de cada lado do par: sem contraste, a pergunta não tem resposta.
        expect(new Set(spec.objetos.map(o => o.posicao)).size).toBe(2);
      }
    }
  });

  it("⚠️ o emoji não denuncia a posição: qual vai onde é sorteado", () => {
    // Com o macaco sempre em cima, a criança aprende o macaco, não a preposição.
    const deCima = new Set(SEMENTES.map(s => {
      const spec = construirPosicaoSpec(1, semente(s));
      return spec.objetos.find(o => o.posicao === "em cima")!.emoji;
    }));
    expect(deCima.size).toBeGreaterThan(1);
  });

  it("⚠️ o LADO da tela também não denuncia a resposta", () => {
    // O print pegou o que o teste do emoji não pegava: "em cima" era SEMPRE o
    // objeto da esquerda, "atrás" sempre o da esquerda, "fora" sempre o da
    // direita. Três acertos escolhendo por lado dariam domínio de uma
    // competência não praticada.
    for (const [nivel, alvoPrep] of [[1, "em cima"], [2, "fora"], [3, "atrás"]] as const) {
      const lados = new Set(SEMENTES.map(s => {
        const spec = construirPosicaoSpec(nivel, semente(s));
        return spec.objetos.find(o => o.posicao === alvoPrep)!.x < LARGURA_DA_CENA / 2;
      }));
      expect(lados.size, `nível ${nivel}`).toBe(2);
    }
  });

  it("o pedido do nível 5 NOMEIA o objeto — 'este' não aponta para nada", () => {
    for (const s of SEMENTES) {
      const spec = construirPosicaoSpec(5, semente(s));
      expect(spec.enunciado).toContain(nomeDoObjeto(spec.alvoDaProducao!.emoji));
      expect(spec.enunciado).not.toContain("este ");
    }
  });

  it("⚠️ a mesa muda de altura — senão 'embaixo' vira 'a metade de baixo'", () => {
    const alturas = new Set(SEMENTES.map(s =>
      construirPosicaoSpec(1, semente(s)).referencial.pecas[0].y));
    expect(alturas.size).toBeGreaterThan(1);
  });

  it("o nível 5 abre com o objeto FORA do campo", () => {
    // Todo ponto dentro do campo já é uma resposta: no par cima/baixo, um objeto
    // que abre posicionado abre metade das vezes já certo.
    for (const s of SEMENTES) {
      const spec = construirPosicaoSpec(5, semente(s));
      expect(spec.objetos).toHaveLength(0);
      expect(spec.alvoDaProducao).toBeDefined();
    }
  });

  it("o juiz do nível 5 lê a relação, e o destino certo confere", () => {
    for (const s of SEMENTES) {
      const spec = construirPosicaoSpec(5, semente(s));
      expect(posicaoDoPonto(spec, spec.alvoDaProducao!.destinoCerto)).toBe(spec.pedida);
    }
  });

  it("qualquer ponto do campo devolve uma preposição do par — sem zona morta", () => {
    // §8.3-bis: soltar 20px fora de uma zona não pode ser "não fez nada".
    for (const s of SEMENTES) {
      const spec = construirPosicaoSpec(5, semente(s));
      for (const p of [{ x: 4, y: 4 }, { x: LARGURA_DA_CENA - 4, y: ALTURA_DA_CENA - 4 }, { x: 163, y: 95 }]) {
        expect(PARES[spec.par]).toContain(posicaoDoPonto(spec, p));
      }
    }
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirPosicaoSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — o diagnóstico", () => {
  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar({ pedida: "embaixo", escolhida: "embaixo", par: "cima-baixo" })).toBeUndefined();
  });

  it("a oposta é INVERTE_PAR", () => {
    expect(diagnosticar({ pedida: "embaixo", escolhida: "em cima", par: "cima-baixo" }))
      .toBe(MisconceptionTag.INVERTE_PAR);
  });

  it("⚠️ tocar o REFERENCIAL é IGNORA_REFERENCIAL", () => {
    // Com dois objetos, todo erro de escolha é o objeto oposto: sem um gesto
    // próprio, esta tag da §6 não teria como existir no app.
    expect(diagnosticar({ pedida: "embaixo", escolhida: null, par: "cima-baixo" }))
      .toBe(MisconceptionTag.IGNORA_REFERENCIAL);
  });

  it("errar no par esquerda/direita tem tag própria, não INVERTE_PAR", () => {
    // A aula de quem troca os lados é de lateralidade; a de quem troca dentro e
    // fora é de vocabulário. Tag igual mandaria a Oficina errada (§6.8).
    expect(diagnosticar({ pedida: "à direita", escolhida: "à esquerda", par: "esquerda-direita" }))
      .toBe(MisconceptionTag.ESQUERDA_DIREITA);
  });
});

describe("§9 — o domínio cobre DOIS pares", () => {
  const certo = (par: "cima-baixo" | "dentro-fora") =>
    ({ pedida: PARES[par][0], escolhida: PARES[par][0], par } as const);

  it("três acertos no mesmo par NÃO dão domínio", () => {
    // Acertar três vezes "em cima" mostra que ela entendeu um par, não posição.
    expect(dominou([certo("cima-baixo"), certo("cima-baixo"), certo("cima-baixo")])).toBe(false);
  });

  it("três acertos cobrindo dois pares dão domínio", () => {
    expect(dominou([certo("cima-baixo"), certo("cima-baixo"), certo("dentro-fora")])).toBe(true);
  });
});

describe("§7 — as falas são as da ficha, letra por letra", () => {
  it.each([
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
    ["audioPrompt", FALAS.pergunta("embaixo", "da mesa")],
  ])("%s está escrita no Markdown do cânone", (_n, frase) => {
    expect(CANONE).toContain(frase);
  });

  it("⚠️ o erro DESCREVE a posição, não diz 'errou'", () => {
    // §4: "o erro vira aula de vocabulário".
    const fala = FALAS.erroSuave("em cima", "embaixo");
    expect(fala).toBe("Esse está em cima. Eu pedi embaixo.");
    expect(fala.toLowerCase()).not.toContain("errou");
  });
});

describe("a ficha", () => {
  it("os cinco níveis são `shapecanvas` — a primitiva que a §1 nomeia", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(GE_01.niveis![n].primitiva, `nível ${n}`).toBe("shapecanvas");
    }
  });

  it("cada nível tem micro própria: os cinco degraus existem", () => {
    expect(new Set([1, 2, 3, 4, 5].map(n => GE_01.niveis![n].micro)).size).toBe(5);
  });

  it("⚠️ nenhuma micro além da primeira herda a fala da mesa", () => {
    // A §7 escreve o howto do nível 1 — ele nomeia a mesa. Herdado no nível 3, a
    // voz manda olhar uma mesa que não está na tela. É o mecanismo da P5.
    for (const m of GE_01.micros.filter(x => x.id !== "cima_baixo")) {
      expect(m.params.howto, m.id).toBeDefined();
      expect(String(m.params.howto), m.id).not.toContain("mesa");
    }
  });

  it("a ficha não declara distratores — a resposta é o objeto tocado", () => {
    expect(GE_01.distratores).toEqual([]);
  });

  it("as três tags da §6 estão declaradas", () => {
    expect(GE_01.erros_tipicos!.map(e => e.id).sort()).toEqual([
      MisconceptionTag.ESQUERDA_DIREITA,
      MisconceptionTag.IGNORA_REFERENCIAL,
      MisconceptionTag.INVERTE_PAR,
    ].sort());
  });

  it("o nível 1 declara a coreografia da §8", () => {
    const beats = GE_01.micros.find(m => m.id === "cima_baixo")!.params.tutorial as
      { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarReferencial === true)).toBe(true);
    expect(beats.some(b => b.show?.destacarObjeto !== undefined)).toBe(true);
  });
});
