import { describe,expect,it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { construirFracaoEquivalenteSpec } from "./fracaoEquivalenteContract";
import { evidenciasFracoesEquivalentes } from "./fracaoEquivalenteProcedure";
describe("F73 — frações equivalentes",()=>{it("mantém a escada visual",()=>{expect([1,2,3,4,5].map(n=>construirFracaoEquivalenteSpec(n,()=>.2).modo)).toEqual(["equivalencia-sobreposta","equivalencia-lado-a-lado","mesmo-denominador","mesmo-numerador","denominadores-diferentes"])});it("só L4 correto emite evidência",()=>{expect(evidenciasFracoesEquivalentes(3,true)).toEqual([]);expect(evidenciasFracoesEquivalentes(4,false)).toEqual([]);expect(evidenciasFracoesEquivalentes(4,true)).toEqual([Evidencia.FRACAO_MESMO_NUMERADOR])})});
