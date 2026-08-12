import { describe, expect, it } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GM_01 } from "../../curriculum/fichas/jornada/GM.01";
import { Question } from "../../types";
import { authorialFeedbackHoldMs, ownsAuthorialFeedback, ownsAuthorialRetry } from "./answerPolicy";

const q=Composer.generate(GM_01,1) as Question;
const meta={grandeza:{escolhido:1,certo:0,vencedorDoOutroAtributo:1,diferencaPequena:false,antesDaReferencia:false,atributo:"altura"}} as any;
describe("F49 — autoria do fluxo",()=>{
  it("GrandezaStage possui erro/retry e cinema próprios",()=>{
    expect(ownsAuthorialRetry(q,meta)).toBe(true);
    expect(ownsAuthorialFeedback(q,meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q,meta)).toBe(3300);
  });
});
