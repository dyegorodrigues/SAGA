// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { TouchCount } from "./TouchCount";
import { construirTouchCountSpec } from "../../curriculum/procedimentos/touchCountContract";
import { MisconceptionTag } from "../../constants/misconceptions";
import { diagnosticar } from "../../curriculum/procedimentos/touchCountProcedure";

function semente(s0: number): () => number {
  let s = s0 >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const toque = (n: number, s = 42) => construirTouchCountSpec("toque", n, semente(s));
const ritmico = (n: number, s = 42) => construirTouchCountSpec("ritmico", n, semente(s));

/** O canhão do modo rítmico. */
function canhao(container: HTMLElement) {
  return container.querySelector('[aria-label^="Disparar"], [aria-label^="Acabaram"]') as HTMLButtonElement;
}

/** Toca todos os alvos, na ordem em que aparecem. */
function contarTudo(container: HTMLElement) {
  const alvos = [...container.querySelectorAll('[aria-label*="ainda não contei"]')];
  alvos.forEach(b => fireEvent.click(b));
  return alvos.length;
}

/**
 * Uma cena do nível com pelo menos `minimo` alvos.
 *
 * A F01 dá FAIXA ("1 a 5"), não número fixo: o nível 2 pode legitimamente
 * sortear um alvo só. Testes que presumiam três alvos quebravam por isso — e a
 * lição não é afrouxar o teste, é parar de presumir o que a ficha não promete.
 */
function toqueCom(nivel: number, minimo: number) {
  for (let s = 1; s < 500; s += 1) {
    const spec = construirTouchCountSpec("toque", nivel, semente(s));
    if (spec.total >= minimo) return spec;
  }
  throw new Error(`nível ${nivel} nunca chega a ${minimo} alvos`);
}

/** A tecla do teclado, e não o numeral que flutua sobre o alvo. */
function tecla(container: HTMLElement, n: number) {
  const teclado = container.querySelector('[aria-label="Teclado"]')!;
  const alvo = [...teclado.querySelectorAll("button")].find(b => b.textContent === String(n));
  if (!alvo) throw new Error(`tecla ${n} não existe`);
  return alvo;
}

describe("a gramática: uma ação = um alvo = um numeral", () => {
  it("um toque marca UM alvo e produz UM numeral", () => {
    const { container } = render(<TouchCount spec={toque(2)} />);
    const primeiro = container.querySelectorAll("button")[0];
    fireEvent.click(primeiro);
    expect(primeiro.getAttribute("aria-label")).toContain("já contei: 1");
    expect(container.querySelectorAll('[aria-label*="já contei"]')).toHaveLength(1);
  });

  it("o numeral avança a cada alvo, na ordem em que ela tocou", () => {
    const { container } = render(<TouchCount spec={toqueCom(2, 3)} />);
    const alvos = [...container.querySelectorAll("button")];
    fireEvent.click(alvos[2]);
    fireEvent.click(alvos[0]);
    expect(alvos[2].getAttribute("aria-label")).toContain("já contei: 1");
    expect(alvos[0].getAttribute("aria-label")).toContain("já contei: 2");
  });

  it("ORDEM LIVRE: começar pelo último alvo funciona igual", () => {
    // Regra inviolável nº 1 da F01 §4. Exigir esquerda-para-direita ensinaria
    // que contar é seguir um caminho, não percorrer um conjunto.
    const { container } = render(<TouchCount spec={toqueCom(3, 3)} />);
    const alvos = [...container.querySelectorAll("button")];
    fireEvent.click(alvos[alvos.length - 1]);
    expect(alvos[alvos.length - 1].getAttribute("aria-label")).toContain("já contei: 1");
  });

  it("nada pulsa sugerindo por onde começar", () => {
    // A ordem é livre; destacar um alvo transformaria a liberdade em pegadinha.
    const { container } = render(<TouchCount spec={toque(1)} />);
    expect(container.querySelector('[aria-label*="ainda não contei"]')).toBeTruthy();
    const estilos = [...container.querySelectorAll("button")].map(b => b.getAttribute("style"));
    expect(new Set(estilos.map(e => (e ?? "").includes("scale"))).size).toBe(1);
  });
});

describe("SILÊNCIO É PROIBIDO — o toque repetido responde e não pune", () => {
  it("tocar de novo fala 'esse já contamos', sem desmarcar", () => {
    const { container } = render(<TouchCount spec={toque(2)} />);
    const primeiro = container.querySelectorAll("button")[0];
    fireEvent.click(primeiro);
    fireEvent.click(primeiro);
    expect(container.textContent).toContain("já contamos");
    // Não desmarca: no pareamento o segundo toque devolve a peça; aqui, não.
    // Desmarcar faria a criança "descontar" um objeto que ela já contou.
    expect(primeiro.getAttribute("aria-label")).toContain("já contei: 1");
  });

  it("o repetido não vira erro sozinho", () => {
    const s = toqueCom(2, 2);
    const onAnswer = vi.fn();
    const { container } = render(<TouchCount spec={s} onAnswer={onAnswer} />);
    const alvos = [...container.querySelectorAll("button")];
    fireEvent.click(alvos[0]);
    fireEvent.click(alvos[0]);
    contarTudo(container);
    fireEvent.click(tecla(container, s.total));
    const [, acao] = onAnswer.mock.calls[0];
    expect(acao.toquesRepetidos).toBeGreaterThan(0);
    expect(diagnosticar(acao)).toBeUndefined();
  });
});

describe("o teclado sobe só no fim — e é onde o marco aparece", () => {
  it("a pergunta não existe antes do último alvo", () => {
    const { container } = render(<TouchCount spec={toque(2)} />);
    expect(container.textContent).not.toContain("Quantos foram");
    contarTudo(container);
    expect(container.textContent).toContain("Quantos foram");
  });

  it("o teclado nunca é menor que a resposta", () => {
    // Um teclado sem a resposta é um exercício sem saída.
    for (const n of [1, 2, 3, 4, 5]) {
      const s = toque(n);
      const { container, unmount } = render(<TouchCount spec={s} />);
      contarTudo(container);
      expect(tecla(container, s.total), `nível ${n}`).toBeTruthy();
      unmount();
    }
  });

  it("voltar a tocar para responder é NAO_TEM_CARDINALIDADE — mesmo acertando", () => {
    // O marco cognitivo da F01: o último número não respondeu à pergunta, ele
    // soou como o nome do último objeto. Acertar não apaga isso.
    const s = toqueCom(2, 2);
    const onAnswer = vi.fn();
    const { container } = render(<TouchCount spec={s} onAnswer={onAnswer} />);
    contarTudo(container);
    fireEvent.click(container.querySelectorAll("button")[0]);
    fireEvent.click(tecla(container, s.total));

    const [valor, acao] = onAnswer.mock.calls[0];
    expect(valor).toBe(s.total);
    expect(acao.recontouAntesDeResponder).toBe(true);
    expect(diagnosticar(acao)).toBe(MisconceptionTag.NAO_TEM_CARDINALIDADE);
  });

  it("contar uma vez cada e responder certo não gera diagnóstico", () => {
    const s = toqueCom(2, 2);
    const onAnswer = vi.fn();
    const { container } = render(<TouchCount spec={s} onAnswer={onAnswer} />);
    contarTudo(container);
    fireEvent.click(tecla(container, s.total));
    const [, acao] = onAnswer.mock.calls[0];
    expect(acao.recontouAntesDeResponder).toBe(false);
    expect(diagnosticar(acao)).toBeUndefined();
  });
});

describe("o desmame do nível 5", () => {
  it("do 1 ao 4 o alvo contado deixa de ser cinza", () => {
    for (const n of [1, 2, 3, 4]) {
      const { container, unmount } = render(<TouchCount spec={toque(n)} />);
      const alvo = container.querySelectorAll("button")[0];
      const antes = alvo.querySelector("span")?.getAttribute("style") ?? "";
      expect(antes, `nível ${n}`).toContain("grayscale");
      fireEvent.click(alvo);
      expect(alvo.querySelector("span")?.getAttribute("style") ?? "", `nível ${n}`)
        .not.toContain("grayscale");
      unmount();
    }
  });

  it("o balão que a CRIANÇA estoura some de vez — ela viu explodir", () => {
    // A F27 diz "o balão explode em partículas". Um balão que continua ali,
    // só que colorido, desfaz a metáfora e esconde da criança quantos faltam —
    // que é exatamente o que o diagnóstico EXCESSO_ACAO observa.
    const { container } = render(<TouchCount spec={ritmico(2)} />);
    const alvo = container.querySelectorAll("button")[0];
    fireEvent.click(canhao(container));
    expect(alvo.querySelector("span")?.getAttribute("style") ?? "").toContain("opacity: 0");
  });

  it("no nível 5 nenhum alvo é cinza — ela segura de cabeça", () => {
    // Manter a marcação aqui apagaria a única coisa que o nível 5 ensina.
    const { container } = render(<TouchCount spec={toque(5)} />);
    for (const s of container.querySelectorAll("button span")) {
      expect(s.getAttribute("style") ?? "").not.toContain("grayscale");
    }
  });

  it("mas o numeral continua marcando: cor e número são coisas distintas", () => {
    const { container } = render(<TouchCount spec={toque(5)} />);
    const alvo = container.querySelectorAll("button")[0];
    fireEvent.click(alvo);
    expect(alvo.getAttribute("aria-label")).toContain("já contei: 1");
  });
});

describe("o modo rítmico — ficha F27: quem dispara é o CANHÃO", () => {
  it("o balão não é botão — a criança não escolhe alvo", () => {
    // A primeira versão fazia a criança tocar cada balão, que é a interação do
    // modo `toque`. A F27 §3 põe um canhão na base, e a §4 descreve o disparo:
    // um toque no canhão, uma bala, um balão, um número. Colapsar os dois modos
    // apagou o que a ficha ensina — contar é AGIR NO TEMPO CERTO, não mirar.
    const { container } = render(<TouchCount spec={ritmico(2)} />);
    const baloes = [...container.querySelectorAll("button")]
      .filter(b => (b.getAttribute("aria-label") ?? "").includes("balões"));
    expect(baloes.length).toBeGreaterThan(0);
    for (const b of baloes) expect(b.hasAttribute("disabled"), "balão clicável").toBe(true);
  });

  it("cada disparo estoura UM balão e produz UM número", () => {
    // A regra inviolável da §4: nunca dois balões num tiro.
    const { container } = render(<TouchCount spec={ritmico(2)} />);
    fireEvent.click(canhao(container));
    expect(container.querySelectorAll('[aria-label*="já contei"]')).toHaveLength(1);
  });

  it("o numeral SALTA no centro da cena, no instante do estouro", () => {
    // Sem isso o número não é o produto do ato: ele aparecia direto no
    // contador, longe do balão, e a criança não ligava um ao outro.
    const { container } = render(<TouchCount spec={ritmico(2)} />);
    fireEvent.click(canhao(container));
    const cena = container.querySelector('[role="group"][aria-label^="Os balões"]')!;
    expect(cena.textContent).toContain("1");
  });

  it("dois tiros rápidos: o canhão ENGASGA e não dispara", () => {
    // "Não existe erro nesta ficha. Limite físico ensina o ritmo." (§4). É a
    // única coisa que ensina sincronia entre falar e agir — sem ela a criança
    // metralha e a correspondência um-a-um nunca se forma.
    const { container } = render(<TouchCount spec={ritmico(2)} />);
    fireEvent.click(canhao(container));
    fireEvent.click(canhao(container));
    expect(container.querySelectorAll('[aria-label*="já contei"]'),
      "o segundo tiro imediato não podia estourar nada").toHaveLength(1);
    expect(container.textContent).toContain("Devagar");
  });

  it("a voz fala o número junto com o estouro — a competência é ORAL", () => {
    const falar = vi.fn();
    const { container } = render(<TouchCount spec={ritmico(2)} falar={falar} />);
    fireEvent.click(canhao(container));
    expect(falar).toHaveBeenCalledWith("1");
  });

  it("não tem teclado: o fecho é a sequência, não uma escolha", () => {
    const s = ritmico(2);
    const { container } = render(<TouchCount spec={s} preenchidos={s.total} />);
    expect(container.textContent).not.toContain("Quantos foram");
    expect(container.textContent).toContain(`Foram ${s.total}`);
  });

  it("a sequência fica visível no contador conforme ela estoura", () => {
    const { container } = render(<TouchCount spec={ritmico(2)} preenchidos={2} />);
    const contador = container.querySelector('[aria-label="Números que já saíram"]');
    expect(contador?.textContent).toBe("12");
  });

  it("no nível 4 o numeral some da tela — ela segura a sequência de cabeça", () => {
    const { container } = render(<TouchCount spec={ritmico(4)} preenchidos={1} />);
    expect(container.querySelector('[aria-label="Números que já saíram"]')).toBeNull();
  });

  it("no nível 5 a cena ABRE com balões já estourados — é a âncora", () => {
    // A ponte para somar: continuar de um número dado é `counting-on`. Sem a
    // âncora visível, "continue de 2" não quer dizer nada para quem tem 4 anos
    // e não lê número.
    const s = ritmico(5);
    expect(s.jaFeitos).toBeGreaterThan(0);
    const { container } = render(<TouchCount spec={s} />);
    const rastros = [...container.querySelectorAll("button")]
      .filter(b => (b.getAttribute("aria-label") ?? "").includes("este já estourei"));
    expect(rastros).toHaveLength(s.jaFeitos);
    expect(container.textContent).toContain(`Continue de ${s.jaFeitos}`);

    // O já-estourado deixa RASTRO: sumir sem marca transformaria a âncora num
    // buraco, e um buraco não conta nada.
    const estilo = rastros[0].querySelector("span")!.getAttribute("style") ?? "";
    expect(estilo, "o balão já estourado sumiu sem deixar rastro").toMatch(/opacity: 0\.2/);
  });

  it("e o que ela estoura continua a sequência, sem passar de dez", () => {
    const s = ritmico(5);
    const { container } = render(<TouchCount spec={s} />);
    fireEvent.click(canhao(container));
    expect(container.querySelectorAll('[aria-label*="já contei"]')).toHaveLength(1);
    expect(s.total).toBeLessThanOrEqual(10);
  });
});

describe("a micro-aula da F01 §8", () => {
  it("destacar o grupo acende todos, inclusive os não contados", () => {
    const { container } = render(
      <TouchCount spec={toque(1)} mostrar={{ destacarGrupo: true }} />);
    for (const s of container.querySelectorAll("button span")) {
      expect(s.getAttribute("style") ?? "").not.toContain("grayscale");
    }
  });

  it("a Mão Fantasma aparece sobre o alvo que a coreografia indica", () => {
    const { container } = render(
      <TouchCount spec={toque(1)} mostrar={{ maoFantasma: 0 }} />);
    expect(container.textContent).toContain("👆");
  });

  it("o numeral da coreografia CHEGA à tela, e não fica só na prop", () => {
    // A F01 §8 declara `{ fala: "UM.", mostra: { maoFantasma: 0, numeral: 1 } }`.
    // O componente aceitava `numeral` e nunca o desenhava: a aula prometia um
    // número que a tela não mostrava.
    const { container } = render(
      <TouchCount spec={toque(1)} mostrar={{ maoFantasma: 0, numeral: 1 }} />);
    const alvo = container.querySelectorAll("button")[0];
    expect(alvo.textContent).toContain("1");
  });

  it("sem coreografia, nenhum numeral aparece antes do toque", () => {
    // Senão o número deixaria de ser o produto do ato e viraria rótulo.
    const { container } = render(<TouchCount spec={toque(1)} />);
    expect(container.querySelector('[role="group"]')?.textContent ?? "").not.toMatch(/\d/);
  });

  it("pulsar os restantes só acontece quando a aula devolve a vez", () => {
    const { container } = render(
      <TouchCount spec={toque(1)} mostrar={{ pulsarRestantes: true }} />);
    expect(container.querySelectorAll("button").length).toBeGreaterThan(0);
  });
});

describe("acessibilidade e travamento", () => {
  it("nenhuma violação nos cinco níveis, nos dois modos", async () => {
    for (const modo of ["toque", "ritmico"] as const) {
      for (const lvl of [1, 2, 3, 4, 5]) {
        const spec = modo === "toque" ? toque(lvl) : ritmico(lvl);
        const { container, unmount } = render(<TouchCount spec={spec} />);
        const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
        expect(violations.map(v => `${modo} L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
        unmount();
      }
    }
  });

  it("desabilitado, nenhum toque conta", () => {
    const { container } = render(<TouchCount spec={toque(2)} disabled />);
    fireEvent.click(container.querySelectorAll("button")[0]);
    expect(container.querySelectorAll('[aria-label*="já contei"]')).toHaveLength(0);
  });

  it("todo alvo diz, em texto, se já foi contado", () => {
    // Quem usa leitor de tela não vê a cor nem o numeral flutuante.
    const { container } = render(<TouchCount spec={toque(3)} />);
    for (const b of container.querySelectorAll("button")) {
      expect(b.getAttribute("aria-label")).toMatch(/já contei|ainda não contei/);
    }
  });
});
