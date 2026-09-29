// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GM_01 } from "../../curriculum/fichas/jornada/GM.01";
import { GrandezaSpec } from "../../curriculum/procedimentos/grandezaContract";
import { GrandezaStage } from "./GrandezaStage";

const spec=(lvl:number)=>Composer.generate(GM_01,lvl).uiProps as GrandezaSpec;
const botoes=(c:HTMLElement)=>[...c.querySelectorAll<HTMLButtonElement>('button[aria-label]')];
afterEach(()=>vi.useRealTimers());

describe("GrandezaStage — F49",()=>{
  it("trocar spec zera seleção, ordem e fase",()=>{
    vi.useFakeTimers(); const s1=spec(1),s2=spec(2);
    const {container,rerender}=render(<GrandezaStage spec={s1}/>);
    fireEvent.click(botoes(container)[s1.resposta]);
    expect(botoes(container)[0].disabled).toBe(true);
    rerender(<GrandezaStage spec={s2}/>);
    expect(botoes(container)[0].disabled).toBe(false);
    expect(container.querySelector('[data-grandeza-order]')).toBeNull();
  });

  it("erro pertence ao palco e devolve retry após 2,2s",()=>{
    vi.useFakeTimers(); const s=spec(1); const onAnswer=vi.fn();
    const {container}=render(<GrandezaStage spec={s} onAnswer={onAnswer}/>);
    const errada=s.resposta===0?1:0;
    fireEvent.click(botoes(container)[errada]);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(botoes(container)[0].disabled).toBe(true);
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
    act(()=>vi.advanceTimersByTime(2200));
    expect(botoes(container)[0].disabled).toBe(false);
  });

  it("acerto mostra seta de medida e fecha com a linha de comparação",()=>{
    vi.useFakeTimers(); const s=spec(1); const {container}=render(<GrandezaStage spec={s}/>);
    fireEvent.click(botoes(container)[s.resposta]);
    expect(container.querySelector('[data-grandeza-measure-arrow]')).toBeTruthy();
    act(()=>vi.advanceTimersByTime(1800));
    expect(container.querySelector('[data-grandeza-measure-arrow]')).toBeNull();
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
  });

  it("L2 usa linha de início vertical; L1 usa chão horizontal",()=>{
    const a=render(<GrandezaStage spec={spec(1)}/>);
    expect(a.container.querySelector('[data-grupo-referencia="chao"]')).toBeTruthy();
    expect(a.container.querySelector('[data-grupo-referencia="inicio"]')).toBeNull(); a.unmount();
    const b=render(<GrandezaStage spec={spec(2)}/>);
    expect(b.container.querySelector('[data-grupo-referencia="inicio"]')).toBeTruthy();
    expect(b.container.querySelector('[data-grupo-referencia="chao"]')).toBeNull();
  });

  it("L3 mostra a régua fantasma antes da resposta depois da abertura",()=>{
    vi.useFakeTimers(); const {container}=render(<GrandezaStage spec={spec(3)}/>);
    expect(container.querySelector('[data-grandeza-guide]')).toBeNull();
    act(()=>vi.advanceTimersByTime(1200));
    expect(container.querySelector('[data-grandeza-guide]')).toBeTruthy();
  });

  it("ordem errada que começa pelo item certo continua ERRADA e volta para retry",()=>{
    vi.useFakeTimers(); const s=spec(5); const onAnswer=vi.fn();
    const {container}=render(<GrandezaStage spec={s} onAnswer={onAnswer}/>);
    const errada=[s.ordemCerta[0],s.ordemCerta[2],s.ordemCerta[1]];
    errada.forEach(i=>fireEvent.click(botoes(container)[i]));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][0]).toBe(-1);
    act(()=>vi.advanceTimersByTime(2200));
    expect(botoes(container)[0].disabled).toBe(false);
    expect(container.querySelector('[data-grandeza-order]')).toBeNull();
  });

  /**
   * ⚠️ "Este é mais alto!" precisa MARCAR o mais alto, e de um jeito visível.
   *
   * A catraca da coreografia acusou `GM.01 n1 p2` de não mudar a tela. Ela
   * acusou por uma cegueira própria — o efeito vivia só em `transform` —, mas
   * quando fui olhar o efeito, ele era **`scale: 1.08`**. Oito por cento, num
   * palco onde os dois objetos JÁ têm alturas diferentes de propósito: é essa
   * diferença que a ficha inteira pede para a criança notar.
   *
   * Oito por cento em cima de uma diferença de altura não é destaque; é ruído
   * dentro do sinal. A voz dizia *"Este é mais alto!"* e a criança de quatro
   * anos não tinha como saber qual dos dois. Esta é a mesma família do balão
   * que não estourava — só que mais sutil, e por isso passou.
   *
   * O portão cobra a MARCA, não o pixel: exatamente um objeto marcado, e é o
   * da resposta. A ficha declara o passo; o teste descobre qual é.
   */
  it("⚠️ o passo que diz 'este é mais alto' marca um objeto, e é o certo", () => {
    const passos = (GM_01.micros ?? [])
      .flatMap(m => ((m.params as { tutorial?: unknown[] } | undefined)?.tutorial ?? []))
      .map(p => (p as { show?: Record<string, unknown> }).show ?? {})
      .filter(s => s.destacarMaior === true);

    expect(passos.length, "a GM.01 declara o passo que aponta o maior").toBeGreaterThan(0);

    for (const show of passos) {
      const s = spec(1);
      const { container, unmount } = render(<GrandezaStage spec={s} mostrar={show as never} />);
      const marcados = [...container.querySelectorAll("[data-grandeza-object]")]
        .map((e, i) => [i, e.getAttribute("data-grandeza-destaque")] as const)
        .filter(([, v]) => v === "true")
        .map(([i]) => i);
      expect(marcados, "exatamente o objeto da resposta marcado").toEqual([s.resposta]);
      unmount();
    }
  });

});
