import { describe, expect, it } from "vitest";
import { COMPOSER_CANARIES, generateRegisteredFichaQuestion } from "../motores/composerCanary";
import { resolucaoTerminaNaResposta } from "./resolutionProcedure";

interface CountingOnRegressionSpec { nivel:number; maior:number;menor:number;total:number;representacao:"cubos-reta"|"reta"|"simbolo";maoFantasma:boolean;retaApareceAoErrar:boolean; }

describe("W10 pós-promoção — N3.03 / F14 counting on",()=>{
  it("permanece no canário após a promoção validada",()=>expect(COMPOSER_CANARIES.has("N3.03")).toBe(true));
  it("produz os cinco degraus F14 sem recontar tudo",()=>{for(let nivel=1;nivel<=5;nivel+=1){const q=generateRegisteredFichaQuestion("N3.03",nivel);const spec=q.uiProps as CountingOnRegressionSpec;expect(q.kind).toBe("counting-on-f14");expect(spec.nivel).toBe(nivel);expect(spec.total).toBe(spec.maior+spec.menor);expect(spec.maior).toBeGreaterThan(spec.menor);expect(q.evaluate?.(q.answer)).toBe(true);expect(q.resolucao).toBeDefined();expect(resolucaoTerminaNaResposta(q.resolucao!,q.answer)).toBe(true);if(nivel<=2)expect(spec.representacao).toBe("cubos-reta");if(nivel===3){expect(spec.representacao).toBe("reta");expect(spec.menor).toBeLessThanOrEqual(3);}if(nivel>=4){expect(spec.representacao).toBe("simbolo");expect(spec.menor).toBeLessThanOrEqual(3);}expect(spec.maoFantasma).toBe(nivel===1);expect(spec.retaApareceAoErrar).toBe(nivel===4);if(nivel===5)expect(q.rt_max_s).toBe(6);}});
  it("mantém resolução por equívoco e snapshots completos",()=>{const q=generateRegisteredFichaQuestion("N3.03",3);const spec=q.uiProps as CountingOnRegressionSpec;const r=q.resolucao!;expect(r.passos.length).toBeGreaterThanOrEqual(spec.menor+1);const tags=r.passos.flatMap(p=>[...(p.corrige??[])]);expect(tags).toContain("CONTA_TUDO");expect(tags).toContain("NAO_ESCOLHE_MAIOR");expect(tags).toContain("OFF_BY_ONE");expect(r.passos.at(-1)?.parcial).toBe(spec.total);});
});
