// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ComparacaoQuantidadeStage } from "./ComparacaoQuantidadeStage";
import { construirComparacaoQuantidadeSpec } from "../../curriculum/procedimentos/comparacaoQuantidadeContract";

// O mesmo construtor que o Composer usa; sorteio preso para a cena não mudar
// entre uma asserção e outra.
const spec = (lvl: number) => construirComparacaoQuantidadeSpec(lvl, () => 0);

/**
 * "Vou ligar um de cada lado" tem de ligar alguma coisa.
 *
 * O pai, sobre esta ficha:
 *
 * > *"fica falando de frase de encadeamento, aí diz que vai ligar, não, mas
 * > não ligou nada, não sei para que que ia ligar."*
 *
 * A aula dizia *"Vou ligar um de cada lado"* e o que aparecia era uma
 * caixinha embaixo com `●—●` repetido — símbolos abstratos, desligados dos
 * objetos na tela. Para quem não lê, e para quem lê também, não havia como
 * saber o que estava sendo ligado a quê. A correspondência um a um é a
 * competência inteira desta ficha; desenhá-la como dois pontinhos genéricos é
 * desenhar outra coisa.
 *
 * O portão cobra a marca NO OBJETO: os que já foram pareados ficam marcados,
 * nos dois grupos, e quem sobrou fica sem marca — que é exatamente a resposta
 * que a ficha pede a criança para enxergar.
 */
describe("a ligação acontece nos objetos, não numa legenda", () => {
  it("⚠️ no passo 'vou ligar um de cada lado', o objeto pareado fica marcado", () => {
    const s = spec(1);
    const { container } = render(
      <ComparacaoQuantidadeStage spec={s} mostrar={{ parear: 0 } as never} />,
    );
    const marcados = container.querySelectorAll("[data-par-do-item]");
    expect(marcados.length, "algum objeto leva a marca do par").toBeGreaterThan(0);
  });

  it("⚠️ a marca aparece nos DOIS grupos, e no mesmo número", () => {
    const s = spec(1);
    const { container } = render(
      <ComparacaoQuantidadeStage spec={s} mostrar={{ parear: 2 } as never} />,
    );
    const porGrupo = [0, 1].map(i =>
      container.querySelector(`[data-comparacao-grupo="${i}"]`)!
        .querySelectorAll("[data-par-do-item]").length);
    expect(porGrupo[0], "o grupo da esquerda tem pares marcados").toBeGreaterThan(0);
    expect(porGrupo[1], "e o da direita tem o MESMO tanto").toBe(porGrupo[0]);
  });

  it("quem sobrou fica SEM marca — é a resposta que a criança tem de ver", () => {
    const s = spec(1);
    const menor = Math.min(s.grupos[0].quantidade, s.grupos[1].quantidade);
    const maior = Math.max(s.grupos[0].quantidade, s.grupos[1].quantidade);
    if (menor === maior) return;
    const { container } = render(
      <ComparacaoQuantidadeStage spec={s} mostrar={{ parear: menor } as never} />,
    );
    const itensDoMaior = [0, 1]
      .map(i => container.querySelector(`[data-comparacao-grupo="${i}"]`)!)
      .find(g => g.querySelectorAll("[data-grupo-quantidade-item]").length === maior)!;
    const total = itensDoMaior.querySelectorAll("[data-grupo-quantidade-item]").length;
    const comMarca = itensDoMaior.querySelectorAll("[data-par-do-item]").length;
    expect(total - comMarca, "sobram os que não têm par").toBe(maior - menor);
  });
});
