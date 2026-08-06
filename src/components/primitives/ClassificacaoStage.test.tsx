// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { ClassificacaoStage } from "./ClassificacaoStage";
import { PecaDeAtributo, nomeDaPeca } from "./PecaDeAtributo";
import { Composer } from "../../curriculum/Composer";
import { AL_01 } from "../../curriculum/fichas/jornada/AL.01";
import { ClassificacaoSpec } from "../../curriculum/procedimentos/classificacaoContract";
import { AcaoDeClassificacao, destinoCerto } from "../../curriculum/procedimentos/classificacaoProcedure";

const spec = (lvl: number) => Composer.generate(AL_01, lvl).uiProps as ClassificacaoSpec;

/**
 * Toca a peça e depois o alvo — o gesto da ficha, nunca arrastar.
 *
 * A peça é buscada entre as que ainda estão NA BANDEJA, e pelo primeiro
 * casamento: duas peças de mesma forma, cor e tamanho são de fato idênticas e
 * partilham o rótulo. Isso não é defeito — elas vão para o mesmo lugar e uma
 * distinção artificial ("quadrado azul grande 2") só teria serventia para o
 * teste, nunca para a criança.
 */
function por(container: HTMLElement, rotuloDaPeca: string, rotuloDoAlvo: string) {
  const bandeja = container.querySelector('[aria-label="Peças para separar"]')!;
  const peca = [...bandeja.querySelectorAll("button")]
    .find(b => b.getAttribute("aria-label") === rotuloDaPeca);
  if (!peca) throw new Error(`peça "${rotuloDaPeca}" não está na bandeja`);
  fireEvent.click(peca);
  fireEvent.click(screen.getByLabelText(rotuloDoAlvo));
}

describe("ClassificacaoStage — a tela de AL.01 (F51)", () => {
  it("NÃO imprime o enunciado: quem o desenha é o app, acima do palco", () => {
    const s = spec(1);
    const { container } = render(<ClassificacaoStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
  });

  it("⚠️ 'fica fora' é um ALVO, não a ausência de ação", () => {
    // §2: colocar corretamente FORA é resposta certa. Se ficar de fora fosse
    // não fazer nada, o app não distinguiria "ela decidiu" de "ela parou".
    render(<ClassificacaoStage spec={spec(1)} />);
    expect(screen.getByLabelText("Deixar fora dos laços")).toBeTruthy();
  });

  it("a peça que NÃO pertence entra na prateleira do fora, e brilha", () => {
    const s = spec(1);
    const criterios = s.lacos.map(l => l.criterio);
    const deFora = s.pecas.find(p => destinoCerto(p, criterios).length === 0)!;
    const { container } = render(<ClassificacaoStage spec={s} />);

    por(container, nomeDaPeca(deFora), "Deixar fora dos laços");
    // §4: "a voz confirma: isso, essa não é vermelha".
    expect(container.textContent).toContain("Isso!");
  });

  it("⚠️ a peça no laço errado é EMPURRADA DE VOLTA — sem X, sem penalidade", () => {
    // §4, erro suave. E é por isso que o diagnóstico lê as TENTATIVAS: o estado
    // final está sempre certo.
    const s = spec(1);
    const criterios = s.lacos.map(l => l.criterio);
    const deFora = s.pecas.find(p => destinoCerto(p, criterios).length === 0)!;
    const { container } = render(<ClassificacaoStage spec={s} />);

    por(container, nomeDaPeca(deFora), `Laço: ${s.lacos[0].rotulo}`);
    // Continua na bandeja: o laço não a aceitou.
    expect(screen.getByLabelText(nomeDaPeca(deFora))).toBeTruthy();
    expect(container.textContent).toContain("Este laço é só dos");
  });

  it("a tentativa recusada CHEGA ao diagnóstico", () => {
    // O fio inteiro: tentar → recusar → guardar → reportar. Sem ele,
    // `TUDO_CABE` — o alvo da ficha — existiria no procedimento e nunca
    // aconteceria na vida.
    const s = spec(1);
    const criterios = s.lacos.map(l => l.criterio);
    const deFora = s.pecas.find(p => destinoCerto(p, criterios).length === 0)!;
    const onAnswer = vi.fn();
    const { container } = render(<ClassificacaoStage spec={s} onAnswer={onAnswer} />);

    // Uma tentativa errada, e depois a rodada inteira certa.
    por(container, nomeDaPeca(deFora), `Laço: ${s.lacos[0].rotulo}`);
    for (const p of s.pecas) {
      const certo = destinoCerto(p, criterios);
      por(container, nomeDaPeca(p), certo.length === 0
        ? "Deixar fora dos laços"
        : `Laço: ${s.lacos[certo[0]].rotulo}`);
    }

    expect(onAnswer).toHaveBeenCalled();
    const acao = onAnswer.mock.calls.at(-1)![1] as AcaoDeClassificacao;
    const daPeca = acao.colocacoes.find(c => c.peca.id === deFora.id)!;
    expect(daPeca.tentativas.length).toBeGreaterThan(0);
  });

  it("o nível 4 desenha os laços CRUZADOS, com a zona dos dois", () => {
    // §5: "dois laços que se cruzam". Três caixas lado a lado com uma legenda
    // "os dois" seria correto e ilegível — uma criança de 4 anos não lê.
    const s = spec(4);
    render(<ClassificacaoStage spec={s} />);
    expect(screen.getByLabelText("Laço: os dois")).toBeTruthy();
    expect(screen.getByLabelText(`Laço: ${s.lacos[0].rotulo}`)).toBeTruthy();
    expect(screen.getByLabelText(`Laço: ${s.lacos[1].rotulo}`)).toBeTruthy();
  });

  it("o nível 5 pergunta o CRITÉRIO, e as alternativas não são peças", () => {
    const s = spec(5);
    render(<ClassificacaoStage spec={s} />);
    for (const a of s.alternativas!) {
      expect(screen.getByText(a.rotulo)).toBeTruthy();
    }
    // Não há bandeja nem prateleira: não se separa nada neste nível.
    expect(screen.queryByLabelText("Deixar fora dos laços")).toBeNull();
  });

  it("o rótulo da peça nomeia os três atributos, e não diz onde ela vai", () => {
    // Aqui, ao contrário do relance, os atributos NÃO são a resposta: são o
    // dado que o exercício usa. Escondê-los tiraria de quem ouve a tela a única
    // informação com que se decide. O que o rótulo nunca diz é o destino.
    const { container } = render(
      <PecaDeAtributo peca={{ id: 0, cor: "vermelho", forma: "circulo", tamanho: "grande" }} />);
    const rotulo = container.querySelector("button")?.getAttribute("aria-label");
    expect(rotulo).toBe("círculo vermelho grande");
  });

  it("a peça pequena continua com alvo de dedo de 52px", () => {
    // Dedo de criança de 4 anos não acerta 26px, e errar o alvo viraria erro
    // dela — §8.3-bis: precisão nunca é requisito para demonstrar compreensão.
    const { container } = render(
      <PecaDeAtributo peca={{ id: 0, cor: "azul", forma: "quadrado", tamanho: "pequeno" }} />);
    const botao = container.querySelector("button")!;
    expect(botao.style.width).toBe("52px");
    expect(botao.style.height).toBe("52px");
  });

  it("a bandeja vazia se explica — §6.6", () => {
    const s = spec(1);
    const { container } = render(<ClassificacaoStage spec={s} resolvidas={s.pecas.length} />);
    expect(container.textContent).toContain("Acabou!");
  });

  it("axe não acusa violação, nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const { container, unmount } = render(<ClassificacaoStage spec={spec(nivel)} />);
      const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
      expect(r.violations.map(v => v.id), `nível ${nivel}`).toEqual([]);
      unmount();
    }
  }, 60000);
});
