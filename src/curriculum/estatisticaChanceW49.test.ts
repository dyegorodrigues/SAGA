import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { isCanonicalMisconceptionTag } from "./motores/radarEngine";

describe("W49 regression-first — PE.04/F95 Estatística e Chance", () => {
  afterEach(() => rollbackComposerCanary("PE.04"));

  it("parte do fallback com prereqs servidos e exige a F95 inteira antes da promoção", () => {
    rollbackComposerCanary("PE.04");
    expect(getTrackById("PE.04")?.prereqs).toEqual(["PE.03", "N6.03"]);
    expect(getTrackById("PE.04")?.generatorSource).toBe("fallback");

    // Regression-first deliberado: PE.04/F95 ainda não existe na Journey.
    // A primeira falha deve permanecer exatamente aqui até a materialização inativa.
    const ficha = JOURNEY_FICHAS.find(item => item.id === "PE.04");
    expect(ficha).toBeDefined();

    expect(ficha?.nome).toBe("Estatística e Chance");
    expect(ficha?.prereqs).toEqual(["PE.03", "N6.03"]);
    expect(hasComposerFicha("PE.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("PE.04")).toBe("estatistica-chance-f95");

    enableComposerCanary("PE.04");
    const modos = ["certo-possivel-impossivel", "mais-menos-provavel", "chance-fracao", "frequencia-independencia", "contar-possibilidades"];
    const tags = new Set<string>();
    let provouChanceFracao = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("PE.04", nivel);
      const spec = q.uiProps as any;

      expect(q.kind).toBe("estatistica-chance-f95");
      expect(spec?.ficha).toBe("F95");
      expect(spec?.nivel).toBe(nivel);
      expect(spec?.modo).toBe(modos[nivel - 1]);
      expect(spec?.primitivas).toEqual(["SingaporeBars", "ArrayGrid"]);
      expect(spec?.acessibilidade).toMatchObject({ toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80 });
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.rt_max_s).toBeUndefined();

      if (nivel === 3 && q.exigeEvidencia) provouChanceFracao = true;
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(provouChanceFracao, "F95 precisa exigir evidência no nível 3 para satisfazer o domínio canônico").toBe(true);
    expect(tags).toEqual(new Set([
      "falacia-apostador",
      "tudo-cinquenta",
      "ignora-total",
    ]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F95 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("PE.04", 1).resolucao)).toMatch(/certo|poss[ií]vel|imposs[ií]vel|resultado/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("PE.04", 2).resolucao)).toMatch(/prov[aá]vel|favor[aá]vel|total/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("PE.04", 3).resolucao)).toMatch(/fra[cç][aã]o|favor[aá]vel|total/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("PE.04", 4).resolucao)).toMatch(/independen|frequ[eê]ncia|hist[oó]rico|longo prazo/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("PE.04", 5).resolucao)).toMatch(/possibil|combina|grade|produto/i);
  });
});
