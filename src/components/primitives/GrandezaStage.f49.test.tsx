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
});
