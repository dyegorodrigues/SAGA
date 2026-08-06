// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { EmojiRowStage } from "./EmojiRowStage";
import { MaoDeDedos } from "./MaoDeDedos";
import { Composer } from "../../curriculum/Composer";
import { N1_03 } from "../../curriculum/fichas/jornada/N1.03";
import { N1_08 } from "../../curriculum/fichas/jornada/N1.08";
import { AL_02 } from "../../curriculum/fichas/jornada/AL.02";
import { FichaCompetencia } from "../../curriculum/schema";
import { EmojiRowSpec, chaveDaPeca, maoCanonica } from "../../curriculum/procedimentos/emojiRowContract";

const spec = (ficha: FichaCompetencia, lvl: number) =>
  Composer.generate(ficha, lvl).uiProps as EmojiRowSpec;

describe("EmojiRowStage — o palco das três fichas da fileira", () => {
  it("NÃO imprime o enunciado: quem o desenha é o app, acima do palco", () => {
    // `GameLoop.tsx` já desenha `q.prompt` numa caixa acima do renderizador.
    // Imprimir de novo punha a pergunta duas vezes na tela — §6.32.
    const s = spec(N1_03, 1);
    const { container } = render(<EmojiRowStage spec={s} fase="perguntando" />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
  });

  /* ---------------------------------------------------------------- *
   *  A regra dura da JD1 §2: o sumiço É o exercício
   * ---------------------------------------------------------------- */

  it("⚠️ com a pergunta no ar, os objetos NÃO estão no DOM", () => {
    // Não é opacidade nem `visibility`: se os objetos continuassem montados,
    // a criança (ou qualquer inspeção) poderia contá-los, e a competência
    // deixaria de existir. §2: "se os objetos ficam na tela, a criança conta
    // um a um e a competência não é treinada".
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const s = spec(N1_03, nivel);
      const { container, unmount } = render(<EmojiRowStage spec={s} fase="perguntando" />);
      const texto = container.textContent ?? "";
      expect(texto.includes(s.emoji!), `nível ${nivel}`).toBe(false);
      unmount();
    }
  });

  it("⚠️ durante o relance NÃO existe alternativa nenhuma na tela", () => {
    // §4: os botões só sobem depois do silêncio. Alternativas visíveis durante
    // o flash trocariam "olhe" por "compare o desenho com os números".
    for (const fase of ["preparando", "regressiva", "flash", "silencio"] as const) {
      const { container, unmount } = render(
        <EmojiRowStage spec={spec(N1_03, 2)} fase={fase} />);
      expect(container.querySelectorAll("button"), fase).toHaveLength(0);
      unmount();
    }
  });

  it("a área nunca fica um retângulo vazio — §6.6", () => {
    // Moldura vazia lida como bug: "uma pessoa que conhece o projeto leu como
    // defeito — logo uma criança lê também".
    const { container } = render(<EmojiRowStage spec={spec(N1_03, 1)} fase="perguntando" />);
    expect(container.textContent ?? "").toContain("Sumiram");
  });

  it("a marca da área vazia é ÚNICA — nada contável onde a pergunta é contar", () => {
    const { container } = render(<EmojiRowStage spec={spec(N1_03, 1)} fase="perguntando" />);
    const marcas = (container.textContent ?? "").match(/🙈/g) ?? [];
    expect(marcas).toHaveLength(1);
  });

  it("a contagem regressiva não escreve número nenhum", () => {
    // §4: "três pulsos suaves: 3… 2… 1 (só visual, sem número escrito)".
    // Três numerais no ar logo antes das alternativas seriam dica falsa para
    // quem lê, e ruído para quem não lê.
    const { container } = render(<EmojiRowStage spec={spec(N1_03, 1)} fase="regressiva" />);
    expect(container.textContent ?? "").not.toMatch(/\d/);
  });

  /* ---------------------------------------------------------------- *
   *  A revelação — o degrau *plain* da escada (P1)
   * ---------------------------------------------------------------- */

  it("responder revela a fileira PARADA, com a quantidade escrita", () => {
    const s = spec(N1_03, 2);
    const { container } = render(<EmojiRowStage spec={s} fase="perguntando" />);
    fireEvent.click(screen.getByText(String(s.resposta)));
    expect(container.textContent).toContain(s.emoji!);
    expect(container.textContent).toContain(`${s.total === 1 ? "Era" : "Eram"} ${s.total}`);
  });

  it("uma unidade não diz 'Eram 1'", () => {
    // Concordância de número em texto gerado — §6.5.
    const s = { ...spec(N1_03, 1), total: 1, resposta: 1, alternativas: [{ valor: 1, rotulo: "1" }], central: null };
    const { container } = render(<EmojiRowStage spec={s} fase="revelando" />);
    expect(container.textContent).toContain("Era 1");
    expect(container.textContent).not.toContain("Eram 1");
  });

  it("a micro-aula mostra a quantidade da §8, não a da pergunta", () => {
    // Se o `revelar` usasse o total sorteado, a aula viraria gabarito.
    const s = { ...spec(N1_03, 5), total: 5, resposta: 5 };
    const { container } = render(<EmojiRowStage spec={s} mostrar={{ revelar: 2 }} />);
    expect(container.textContent).toContain("Eram 2");
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("a voz fala a frase da ficha no erro, e cala no acerto", () => {
    const s = spec(N1_03, 2);
    const errada = s.alternativas.find(a => a.valor !== s.resposta)!;

    const vozErro = vi.fn();
    const { unmount } = render(<EmojiRowStage spec={s} fase="perguntando" falar={vozErro} />);
    fireEvent.click(screen.getByText(errada.rotulo));
    expect(vozErro).toHaveBeenCalledWith(expect.stringContaining("olha o formato"));
    unmount();

    // §4 confirma o acerto VISUALMENTE ("os objetos reaparecem por 800ms").
    const vozAcerto = vi.fn();
    render(<EmojiRowStage spec={s} fase="perguntando" falar={vozAcerto} />);
    fireEvent.click(screen.getByText(String(s.resposta)));
    expect(vozAcerto).not.toHaveBeenCalled();
  });

  it("a resposta chega ao GameLoop uma vez só", () => {
    const s = spec(N1_03, 2);
    const onAnswer = vi.fn();
    render(<EmojiRowStage spec={s} fase="perguntando" onAnswer={onAnswer} />);
    const botao = screen.getByText(String(s.resposta));
    fireEvent.click(botao);
    fireEvent.click(botao);
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  /* ---------------------------------------------------------------- *
   *  A mão — JD2
   * ---------------------------------------------------------------- */

  it("o rótulo da mão NÃO conta os dedos antes da resposta", () => {
    // A tela renderizada não fala o número que a pergunta pede — item da
    // lista de verificação do canário. Vale para quem ouve a tela também.
    const { container } = render(<MaoDeDedos mao={maoCanonica(3)} />);
    const rotulo = container.querySelector("svg")?.getAttribute("aria-label") ?? "";
    expect(rotulo).toBe("uma mão");
    expect(rotulo).not.toMatch(/\d/);
  });

  it("na revelação o rótulo pode contar — o olho já viu", () => {
    const { container } = render(<MaoDeDedos mao={maoCanonica(3)} revelando />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toContain("3");
  });

  it("a mão desenha os cinco dedos sempre — dobrado é dedo, não ausência", () => {
    // §3: "dedos levantados em contraste forte contra os dobrados". Um dedo
    // dobrado que some faz a criança ver uma mão de três dedos.
    for (let n = 1; n <= 5; n += 1) {
      const { container, unmount } = render(<MaoDeDedos mao={maoCanonica(n)} />);
      // 4 dedos + polegar + palma. O bloco do erro suave não está ativo aqui.
      expect(container.querySelectorAll("rect"), `mão de ${n}`).toHaveLength(6);
      unmount();
    }
  });

  it("a mão relâmpago não imprime numeral nenhum antes da resposta", () => {
    for (let nivel = 1; nivel <= 2; nivel += 1) {
      const s = spec(N1_08, nivel);
      const { container, unmount } = render(<EmojiRowStage spec={s} fase="flash" />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      expect(`${container.textContent ?? ""} ${rotulos}`, `nível ${nivel}`).not.toMatch(/\d/);
      unmount();
    }
  });

  /* ---------------------------------------------------------------- *
   *  O padrão — F52
   * ---------------------------------------------------------------- */

  it("a sequência tem exatamente UMA lacuna, e ela é escolhível", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const s = spec(AL_02, nivel);
      const { container, unmount } = render(<EmojiRowStage spec={s} fase="perguntando" />);
      expect((container.textContent ?? "").match(/\?/g) ?? [], `nível ${nivel}`).toHaveLength(1);
      unmount();
    }
  });

  it("a peça do banco é o MESMO desenho da casa — §6.33", () => {
    // Com o rótulo em texto, três bolas saíam em fila no banco e em cacho na
    // sequência: duas figuras para a mesma peça.
    const s = spec(AL_02, 5);
    const { container } = render(<EmojiRowStage spec={s} fase="perguntando" />);
    const chaves = s.sequencia!.banco.map(chaveDaPeca);
    const rotulos = [...container.querySelectorAll("button [aria-label]")]
      .map(el => el.getAttribute("aria-label"));
    // Toda peça do banco desenha um grupo rotulado, nunca uma string solta.
    expect(rotulos.length).toBe(chaves.length);
  });

  it("a moldura da unidade enquadra as casas que a coreografia pede", () => {
    const s = spec(AL_02, 1);
    const { container } = render(
      <EmojiRowStage spec={s} mostrar={{ molduraUnidade: [0, 1] }} />);
    const emolduradas = [...container.querySelectorAll("div")]
      .filter(el => (el.getAttribute("style") ?? "").includes("rgb(180, 83, 9)"));
    expect(emolduradas).toHaveLength(2);
  });

  /* ---------------------------------------------------------------- *
   *  Acessibilidade
   * ---------------------------------------------------------------- */

  it("axe não acusa violação, nos três modos e nas fases que a criança vê", async () => {
    const casos: [FichaCompetencia, number][] = [
      [N1_03, 1], [N1_03, 3], [N1_03, 5], [N1_08, 1], [N1_08, 2],
      [AL_02, 1], [AL_02, 4], [AL_02, 5],
    ];
    for (const [ficha, nivel] of casos) {
      for (const fase of ["flash", "perguntando", "revelando"] as const) {
        const { container, unmount } = render(
          <EmojiRowStage spec={spec(ficha, nivel)} fase={fase} />);
        const r = await axe.run(container, {
          rules: { "color-contrast": { enabled: false } },
        });
        expect(r.violations.map(v => v.id), `${ficha.id} n${nivel} ${fase}`).toEqual([]);
        unmount();
      }
    }
  }, 60000);
});
