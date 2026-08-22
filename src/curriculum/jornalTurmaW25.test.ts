import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W25 — PE.02/F64 Jornal da Turma", () => {
  afterEach(() => rollbackComposerCanary("PE.02"));
  it("nasce do fallback com os prereqs do DAG vivo", () => {
    rollbackComposerCanary("PE.02");
    expect(getTrackById("PE.02")?.prereqs).toEqual(["PE.01", "N2.02"]);
    expect(getTrackById("PE.02")?.generatorSource).toBe("fallback");
    expect(getTrackById("PE.02")?.contentStatus).toBe("fallback");
  });
  it("materializa a escada F64 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("PE.02")).toBe(true);
    enableComposerCanary("PE.02");
    const qs=[1,2,3,4,5].map(level=>generateRegisteredFichaQuestion("PE.02",level));
    expect(qs.map(q=>q.kind)).toEqual(Array(5).fill("jornal-turma-f64"));
    expect(qs.map(q=>q.uiProps?.modo)).toEqual(["ler-barra","comparar-barras","completar-barra","construir-grafico","probabilidade"]);
    for(const q of qs){expect(q.evaluate?.(q.answer)).toBe(true);expect(q.options?.filter(o=>o.value===q.answer)).toHaveLength(1);expect(q.resolucao?.fallback).toBe(0);expect(q.masteryRule).toMatchObject({acertos:3,de:3,sessoes:2});}
  });
  it("mantém os três diagnósticos centrais da F64 exercitáveis",()=>{
    enableComposerCanary("PE.02");const tags=new Set<string>();for(let nivel=1;nivel<=5;nivel+=1)for(const o of generateRegisteredFichaQuestion("PE.02",nivel).options??[])if(o.misconception)tags.add(o.misconception);
    expect(tags).toEqual(new Set(["ignora-escala","barra-errada","confunde-possivel-provavel"]));
  });
});
