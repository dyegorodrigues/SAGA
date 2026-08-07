// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { MolduraStage } from "./MolduraStage";
import { Composer } from "../../curriculum/Composer";
import { N1_08 } from "../../curriculum/fichas/jornada/N1.08";
import { N1_10 } from "../../curriculum/fichas/jornada/N1.10";
import { N1_11 } from "../../curriculum/fichas/jornada/N1.11";
import { FichaCompetencia } from "../../curriculum/schema";
import { MolduraSpec, TEMAS_DA_MOLDURA } from "../../curriculum/procedimentos/tenFrameContract";
import { MisconceptionTag } from "../../constants/misconceptions";

const spec = (ficha: FichaCompetencia, lvl: number) =>
  Composer.generate(ficha, lvl).uiProps as MolduraSpec;

/** As casas da moldura: a grade tem uma `div` por casa. */
const casas = (container: HTMLElement) =>
  container.querySelectorAll('[role="group"][aria-label*="moldura"] > div');

const botoes = (container: HTMLElement) => [...container.querySelectorAll("button")];

describe("MolduraStage — o palco das três fichas da moldura de dez", () => {
  it("NÃO imprime o enunciado: quem o desenha é o app, acima do palco", () => {
    // §6.32 — a caixa do enunciado já existe no `GameLoop`.
    const s = spec(N1_11, 1);
    const { container } = render(<MolduraStage spec={s} fase="perguntando" />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
  });

  /* ---------------------------------------------------------------- *
   *  F02 §3 — o tamanho da moldura É um degrau
   * ---------------------------------------------------------------- */

  it("⚠️ a F02 desenha CINCO casas nos níveis 1-2 e dez nos demais", () => {
    // "5 numa fileira (níveis 1-2) ou 10 em duas fileiras de 5 (níveis 3+)".
    // O modo legado desenhava dez sempre, e o primeiro degrau não existia.
    for (const [nivel, esperado] of [[3, 10], [4, 10], [5, 10]] as const) {
      const { container, unmount } = render(
        <MolduraStage spec={spec(N1_08, nivel)} fase="mostrando" />);
      expect(casas(container).length, `nível ${nivel}`).toBe(esperado);
      unmount();
    }
    const { container } = render(
      <MolduraStage spec={{ ...spec(N1_08, 3), casas: 5, ocupadas: [0, 1, 2] }} fase="perguntando" />);
    expect(casas(container).length).toBe(5);
  });

  it("as casas vazias existem no DOM: o vazio é objeto, não ausência", () => {
    // JD3 §3: "as casas vazias têm contorno visível — o vazio precisa ser um
    // objeto, não ausência de objeto".
    const s = { ...spec(N1_11, 1), casas: 10, ocupadas: [0, 1, 2] };
    const { container } = render(<MolduraStage spec={s} fase="mostrando" />);
    expect(casas(container).length).toBe(10);
  });

  /* ---------------------------------------------------------------- *
   *  JD3 §4 — o vazio é a última coisa que ela vê
   * ---------------------------------------------------------------- */

  it("⚠️ na fase `vazio` a moldura está lá e as fichas não", () => {
    // §4: "as fichas somem. A moldura vazia permanece 300ms e depois some
    // também — o vazio é a última coisa que a criança vê." O modo legado
    // escondia tudo de uma vez e punha um 🙈 no lugar: a ficha inteira mora
    // nesses 300ms.
    const s = spec(N1_11, 2);
    const { container } = render(<MolduraStage spec={s} fase="vazio" />);
    const grupo = container.querySelector('[role="group"][aria-label*="moldura"]');
    expect(grupo?.getAttribute("aria-label")).toBe("a moldura vazia");
    expect(casas(container).length).toBe(s.casas);
  });

  it("⚠️ com a pergunta no ar, a moldura SOME — depois de flash", () => {
    // §3 da JD3: "aparece e some. A área fica vazia enquanto ela responde." Com
    // as dez casas à vista, a criança conta as vazias uma a uma — que é o que a
    // §7 proíbe o `explain` de sugerir e o que a ficha existe para dispensar.
    // Vale também para o nível 4 da F02: "flash de 2 segundos (a moldura some)".
    for (const [ficha, nivel] of [[N1_11, 1], [N1_11, 5], [N1_08, 4]] as const) {
      const { container, unmount } = render(
        <MolduraStage spec={spec(ficha, nivel)} fase="perguntando" />);
      expect(casas(container).length, `${ficha.id} n${nivel}`).toBe(0);
      unmount();
    }
  });

  it("⚠️ sem flash, a moldura FICA: ali ela olha e responde", () => {
    // Os níveis 3 e 5 da F02 não têm flash. Esconder a moldura ali inventaria
    // outra ficha — o relance é a JD2/JD3, não esta.
    for (const nivel of [3, 5]) {
      const s = spec(N1_08, nivel);
      expect(s.flashMs, `nível ${nivel}`).toBeNull();
      const { container, unmount } = render(<MolduraStage spec={s} fase="perguntando" />);
      expect(casas(container).length, `nível ${nivel}`).toBe(s.casas);
      unmount();
    }
  });

  it("a área que sobra não tem nada CONTÁVEL — §6.6 sem trocar o defeito", () => {
    // Retângulo vazio lê como bug; e a marca que o ocupa não pode ser contável,
    // numa tela cuja pergunta é uma quantidade.
    const { container } = render(<MolduraStage spec={spec(N1_11, 2)} fase="perguntando" />);
    expect((container.textContent ?? "").match(/🙈/g) ?? []).toHaveLength(1);
  });

  it("a moldura vazia abre a cena, antes do preenchimento", () => {
    // §4: "a moldura vazia aparece por 600ms — a criança vê o ALVO antes de ver
    // o preenchimento".
    const { container } = render(<MolduraStage spec={spec(N1_11, 1)} fase="preparando" />);
    expect(container.querySelector('[role="group"]')?.getAttribute("aria-label"))
      .toBe("a moldura vazia");
  });

  it("a contagem regressiva não escreve número nenhum", () => {
    // §4: "três pulsos suaves: 3... 2... 1 (só visual)".
    const { container } = render(<MolduraStage spec={spec(N1_11, 1)} fase="regressiva" />);
    expect(container.textContent ?? "").not.toMatch(/[0-9]/);
  });

  it("⚠️ durante o flash NÃO existe alternativa nenhuma na tela", () => {
    // Botões visíveis durante a exposição trocariam "olhe" por "compare o
    // desenho com os números".
    for (const fase of ["preparando", "regressiva", "mostrando", "vazio"] as const) {
      const { container, unmount } = render(<MolduraStage spec={spec(N1_11, 2)} fase={fase} />);
      expect(botoes(container), fase).toHaveLength(0);
      unmount();
    }
  });

  it("a barra de alternativas reserva o espaço dela desde o começo", () => {
    // Sem reserva, a moldura salta para cima quando os botões sobem, e um salto
    // de layout no instante da resposta é o que faz a criança errar o alvo.
    const { container } = render(<MolduraStage spec={spec(N1_11, 2)} fase="mostrando" />);
    const barra = container.querySelector('[aria-label="Números"]') as HTMLElement;
    expect(barra.style.minHeight).toBe("64px");
  });

  /* ---------------------------------------------------------------- *
   *  JD5 §4 — a tampa
   * ---------------------------------------------------------------- */

  it("antes da tampa, o grupo inteiro está à mostra", () => {
    const s = spec(N1_10, 2);
    const { container } = render(<MolduraStage spec={s} fase="mostrando" />);
    expect(container.querySelectorAll('[aria-label="a tampa"]')).toHaveLength(0);
  });

  it("⚠️ com a pergunta no ar, a tampa está lá — e os visíveis também", () => {
    // §4: "os visíveis continuam à mostra".
    const s = spec(N1_10, 2);
    const { container } = render(<MolduraStage spec={s} fase="perguntando" />);
    expect(container.querySelectorAll('[aria-label="a tampa"]').length).toBeGreaterThan(0);
  });

  it("⚠️ a tampa cobre o bloco inteiro quando ele atravessa as duas fileiras", () => {
    // Uma tampa só cobria um trecho de uma linha: escondendo sete de dez,
    // metade dos escondidos continuava à vista e a criança contava a resposta.
    const s: MolduraSpec = {
      ...spec(N1_10, 4),
      casas: 10, ocupadas: Array.from({ length: 10 }, (_, i) => i),
      cheias: 10, total: 10, escondidas: 7, visiveis: 3,
    };
    const { container } = render(<MolduraStage spec={s} fase="perguntando" />);
    expect(container.querySelectorAll('[aria-label="a tampa"]')).toHaveLength(2);
  });

  it("⚠️ a tampa LEVANTA na revelação, mesmo quando ela errou", () => {
    // §4, erro suave: "a tampa levanta devagar, revelando um por um, e a voz
    // conta os escondidos". Mantê-la fechada esconderia exatamente a
    // informação que o erro pediu.
    const s = spec(N1_10, 2);
    const { container } = render(<MolduraStage spec={s} fase="revelando" />);
    expect(container.querySelectorAll('[aria-label="a tampa"]')).toHaveLength(0);
  });

  /* ---------------------------------------------------------------- *
   *  §4 — a voz
   * ---------------------------------------------------------------- */

  it("⚠️ a JD5 conta o total EM VOZ ALTA nos níveis 1-2", () => {
    // §4: "a contagem em voz alta na abertura é obrigatória. Sem ela, a criança
    // não constrói o total na memória e o exercício vira adivinhação."
    const falar = vi.fn();
    const s = { ...spec(N1_10, 1), total: 3, contaEmVozAlta: true };
    render(<MolduraStage spec={s} falar={falar} />);
    expect(falar).toHaveBeenCalledWith("um, dois, três. Três!");
  });

  it("no nível 3 a voz NÃO conta o total: é esse o degrau", () => {
    const falar = vi.fn();
    render(<MolduraStage spec={{ ...spec(N1_10, 3), contaEmVozAlta: false }} falar={falar} />);
    expect(falar).not.toHaveBeenCalled();
  });

  it("o acerto da F02 nomeia a estrutura; o erro devolve a fileira", () => {
    const falar = vi.fn();
    const s: MolduraSpec = { ...spec(N1_08, 3), cheias: 7, ocupadas: [0, 1, 2, 3, 4, 5, 6], resposta: 7, alvo: 7, alternativas: [6, 7, 8] };
    const { container } = render(<MolduraStage spec={s} falar={falar} fase="perguntando" />);
    fireEvent.click(botoes(container).find(b => b.textContent === "7")!);
    expect(falar).toHaveBeenCalledWith("cinco! E mais 2: 7!");
  });

  it("a voz do erro nunca diz que errou", () => {
    const falar = vi.fn();
    const s: MolduraSpec = { ...spec(N1_11, 2), cheias: 7, resposta: 3, alvo: 3, alternativas: [3, 7, 4] };
    const { container } = render(<MolduraStage spec={s} falar={falar} fase="perguntando" />);
    fireEvent.click(botoes(container).find(b => b.textContent === "7")!);
    expect(String(falar.mock.calls[0][0]).toLowerCase()).not.toContain("err");
  });

  /* ---------------------------------------------------------------- *
   *  A resposta e o diagnóstico
   * ---------------------------------------------------------------- */

  it("⚠️ a ação devolvida carrega o NÍVEL — a F02 §6 depende dele", () => {
    // "No nível 5, respondeu quantos tem em vez de quantos faltam" é uma linha
    // que só existe naquele degrau: sem o nível, ela vira `CONTA_VAZIOS`.
    const onAnswer = vi.fn();
    const s = spec(N1_08, 5);
    const { container } = render(<MolduraStage spec={s} onAnswer={onAnswer} fase="perguntando" />);
    fireEvent.click(botoes(container)[0]);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ modo: "contar", nivel: 5, casas: s.casas });
  });

  it("a ação da JD5 leva o visível e o total: são os dois distratores da §6", () => {
    const onAnswer = vi.fn();
    const s = spec(N1_10, 2);
    const { container } = render(<MolduraStage spec={s} onAnswer={onAnswer} fase="perguntando" />);
    fireEvent.click(botoes(container)[0]);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({
      modo: "escondidos", total: s.total, visiveis: s.visiveis,
    });
  });

  it("a ação da JD3 leva o `disperso`: é a assinatura do DEPENDE_DE_FORMATO", () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <MolduraStage spec={spec(N1_11, 5)} onAnswer={onAnswer} fase="perguntando" />);
    fireEvent.click(botoes(container)[0]);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ modo: "faltam", disperso: true });
  });

  it("responder duas vezes não conta duas vezes", () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <MolduraStage spec={spec(N1_11, 2)} onAnswer={onAnswer} fase="perguntando" />);
    fireEvent.click(botoes(container)[0]);
    fireEvent.click(botoes(container)[1]);
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it("`disabled` não deixa responder", () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <MolduraStage spec={spec(N1_11, 2)} onAnswer={onAnswer} disabled fase="perguntando" />);
    fireEvent.click(botoes(container)[0]);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("⚠️ a resposta certa aparece uma vez só entre os botões", () => {
    for (const [ficha, nivel] of [[N1_08, 3], [N1_08, 5], [N1_10, 4], [N1_11, 5]] as const) {
      const s = spec(ficha, nivel);
      const { container, unmount } = render(<MolduraStage spec={s} fase="perguntando" />);
      const certos = botoes(container).filter(b => b.textContent === String(s.resposta));
      expect(certos, `${ficha.id} n${nivel}`).toHaveLength(1);
      unmount();
    }
  });

  /* ---------------------------------------------------------------- *
   *  §8.3-bis — o alvo do dedo
   * ---------------------------------------------------------------- */

  it("os botões de resposta têm alvo grande o bastante para um dedo de 4 anos", () => {
    const { container } = render(<MolduraStage spec={spec(N1_11, 2)} fase="perguntando" />);
    for (const b of botoes(container)) {
      expect(b.className).toContain("h-14");
      expect(b.className).toContain("w-14");
    }
  });

  /* ---------------------------------------------------------------- *
   *  Acessibilidade
   * ---------------------------------------------------------------- */

  it("axe não acusa violação, nas três fichas e nas fases que a criança vê", async () => {
    const casos: [FichaCompetencia, number][] = [
      [N1_08, 3], [N1_08, 4], [N1_08, 5], [N1_10, 1], [N1_10, 4], [N1_10, 5],
      [N1_11, 1], [N1_11, 3], [N1_11, 5],
    ];
    for (const [ficha, nivel] of casos) {
      for (const fase of ["mostrando", "perguntando", "revelando"] as const) {
        const { container, unmount } = render(
          <MolduraStage spec={spec(ficha, nivel)} fase={fase} />);
        const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
        expect(r.violations.map(v => v.id), `${ficha.id} n${nivel} ${fase}`).toEqual([]);
        unmount();
      }
    }
  }, 60000);
});

describe("as três fichas chegam ao palco pelo Composer", () => {
  it("cada uma traz o SEU modo, e o Composer não adivinha pelo id", () => {
    expect(spec(N1_08, 3).modo).toBe("contar");
    expect(spec(N1_11, 1).modo).toBe("faltam");
    expect(spec(N1_10, 1).modo).toBe("escondidos");
  });

  it("⚠️ ficha de moldura sem `modo` QUEBRA — não cai num padrão", () => {
    // A mesma regra do `touchcount` e do `shapecanvas`, e ela existe porque um
    // `?? padrão` já fez o canhão da F27 desenhar peixinhos.
    const torta = {
      ...N1_11,
      micros: N1_11.micros.map(m => ({ ...m, params: { ...m.params, modo: undefined } })),
    } as FichaCompetencia;
    expect(() => Composer.generate(torta, 1)).toThrow(/modo/);
  });

  it("o nível 5 da F02 pergunta o que FALTA, com as palavras da JD3", () => {
    expect(spec(N1_08, 5).enunciado).toBe("Quantos faltam pra encher?");
  });

  it("⚠️ o enunciado da F02 concorda com o tema sorteado", () => {
    // "Quantas ovos você vê?" saiu da primeira versão, que trocava só o
    // substantivo dentro da fala do cânone. A criança não lê a tela, ouve a
    // frase (§6.5).
    for (let i = 0; i < 40; i += 1) {
      const s = spec(N1_08, 3);
      const tema = TEMAS_DA_MOLDURA.find(t => t.emoji === s.emoji)!;
      expect(s.enunciado).toBe(`${tema.genero === "m" ? "Quantos" : "Quantas"} ${tema.plural} você vê?`);
    }
  });

  it("a tag da inversão da F02 tem descrição na ficha", () => {
    expect(N1_08.erros_tipicos?.some(e => e.id === MisconceptionTag.INVERTE_PERGUNTA)).toBe(true);
  });
});
