// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { CenaDePosicaoStage } from "./CenaDePosicaoStage";
import { Composer } from "../../curriculum/Composer";
import { GE_01 } from "../../curriculum/fichas/jornada/GE.01";
import { PosicaoSpec } from "../../curriculum/procedimentos/posicaoContract";
import { AcaoDePosicao } from "../../curriculum/procedimentos/posicaoProcedure";

const spec = (lvl: number) => Composer.generate(GE_01, lvl).uiProps as PosicaoSpec;

function objetoEm(container: HTMLElement, posicao: string) {
  const b = [...container.querySelectorAll("button")]
    .find(x => (x.getAttribute("aria-label") ?? "").startsWith(`Objeto ${posicao} `));
  if (!b) throw new Error(`não há objeto "${posicao}" na cena`);
  return b;
}

describe("CenaDePosicaoStage — a tela de GE.01 (F47)", () => {
  it("NÃO imprime o enunciado: quem o desenha é o app, acima do palco", () => {
    const s = spec(1);
    const { container } = render(<CenaDePosicaoStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
  });

  it("⚠️ a resposta é o OBJETO, não uma palavra escrita", () => {
    // O gerador antigo dava dois botões: "Em cima" e "Embaixo". Numa faixa em
    // que a criança não lê, isso é a competência trocada por leitura.
    const { container } = render(<CenaDePosicaoStage spec={spec(1)} />);
    const textos = [...container.querySelectorAll("button")].map(b => b.textContent ?? "");
    expect(textos.some(t => /em cima|embaixo/i.test(t))).toBe(false);
  });

  it("a cena traz dois objetos e um referencial tocável", () => {
    const s = spec(1);
    const { container } = render(<CenaDePosicaoStage spec={s} />);
    expect(objetoEm(container, s.objetos[0].posicao)).toBeTruthy();
    expect(objetoEm(container, s.objetos[1].posicao)).toBeTruthy();
    expect(screen.getByLabelText(`${s.referencial.nome} (a referência)`)).toBeTruthy();
  });

  it("tocar o objeto certo responde com a preposição pedida", () => {
    const s = spec(1);
    const recebido: AcaoDePosicao[] = [];
    const { container } = render(
      <CenaDePosicaoStage spec={s} onAnswer={(_v, a) => recebido.push(a)} />,
    );
    fireEvent.click(objetoEm(container, s.pedida));
    expect(recebido[0].escolhida).toBe(s.pedida);
  });

  it("⚠️ o erro DESCREVE a posição do objeto tocado (§4)", () => {
    const s = spec(1);
    const falar = vi.fn();
    const errada = s.objetos.find(o => o.posicao !== s.pedida)!;
    const { container } = render(<CenaDePosicaoStage spec={s} falar={falar} />);
    fireEvent.click(objetoEm(container, errada.posicao));
    expect(falar).toHaveBeenCalledWith(`Esse está ${errada.posicao}. Eu pedi ${s.pedida}.`);
  });

  it("⚠️ tocar o referencial NÃO encerra a questão — vira aula", () => {
    // A §6 precisa do gesto para observar `IGNORA_REFERENCIAL`, mas punir uma
    // criança que ainda está entendendo a pergunta seria cobrar protocolo.
    const s = spec(1);
    const recebido: AcaoDePosicao[] = [];
    const { container } = render(
      <CenaDePosicaoStage spec={s} onAnswer={(_v, a) => recebido.push(a)} />,
    );
    fireEvent.click(screen.getByLabelText(`${s.referencial.nome} (a referência)`));
    expect(recebido[0].escolhida).toBeNull();

    // E ela continua podendo responder.
    fireEvent.click(objetoEm(container, s.pedida));
    expect(recebido[1].escolhida).toBe(s.pedida);
  });

  it("o rótulo da posição só aparece DEPOIS da resposta — antes é gabarito", () => {
    const s = spec(1);
    const { container } = render(<CenaDePosicaoStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(s.pedida);
    fireEvent.click(objetoEm(container, s.pedida));
    expect(container.textContent ?? "").toContain(s.pedida);
  });

  it("o nível 5 abre com a bandeja, e sem objeto na cena", () => {
    const s = spec(5);
    const { container } = render(<CenaDePosicaoStage spec={s} />);
    expect(screen.getByLabelText("Pegar o objeto")).toBeTruthy();
    expect(container.querySelectorAll('[aria-label^="Objeto "]').length).toBe(0);
  });

  it("sem violação de acessibilidade", async () => {
    const { container } = render(<CenaDePosicaoStage spec={spec(1)} />);
    const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(r.violations.map(v => v.id)).toEqual([]);
  });
});
