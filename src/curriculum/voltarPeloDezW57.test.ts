import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { construirVoltarPeloDezSpec, metaDoCaminhoF34, VoltarPeloDezMisconception } from "./procedimentos/voltarPeloDezContract";
import type { VoltarPeloDezF34Spec } from "./procedimentos/voltarPeloDezContract";

/**
 * W57 regression-first — N3.08/F34 Voltar pelo Dez.
 *
 * A ficha é o espelho da F33 e traz de volta a escolha estratégica da F31. O
 * que este teste cobra é o invariante que faz a decomposição existir: sempre há
 * unidade solta acima do dez, e o subtraendo é sempre maior que ela e menor que
 * dez. Fora disso, a estratégia que a ficha ensina não tem onde acontecer.
 */
describe("W57 regression-first — N3.08/F34 Voltar pelo Dez", () => {
  afterEach(() => rollbackComposerCanary("N3.08"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.08");
    expect(getTrackById("N3.08")?.prereqs).toEqual(["N3.07", "N3.04"]);
    expect(hasComposerFicha("N3.08")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.08")).toBe("voltar-pelo-dez-f34");
  });

  it("toda conta cruza a dezena com subtraendo de um algarismo", () => {
    enableComposerCanary("N3.08");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 60; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.08", nivel);
        const spec = q.uiProps as VoltarPeloDezF34Spec;

        expect(q.kind).toBe("voltar-pelo-dez-f34");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.resposta).toBe(spec.total - spec.sai);
        expect(spec.soltos).toBe(spec.total - 10);
        expect(spec.restante).toBe(spec.sai - spec.soltos);

        // Sem unidade solta acima do dez não há primeiro passo a dar; com
        // subtraendo de dois algarismos a decomposição da ficha não existe.
        expect(spec.soltos, "precisa haver solto a tirar primeiro").toBeGreaterThan(0);
        expect(spec.sai, "o subtraendo é de um algarismo").toBeLessThanOrEqual(9);
        expect(spec.sai, "se coubesse nos soltos, a conta não cruzaria o dez").toBeGreaterThan(spec.soltos);
        expect(spec.resposta, "o resultado precisa ser positivo").toBeGreaterThan(0);
        expect(spec.resposta, "chegar exatamente ao dez pularia o segundo passo").not.toBe(10);
      }
    }
  });

  it("cada degrau tem o seu portão, e o mental não tem nenhum", () => {
    enableComposerCanary("N3.08");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = generateRegisteredFichaQuestion("N3.08", nivel).uiProps as VoltarPeloDezF34Spec;
      expect(spec.exigeChegarAoDez, `L${nivel}: as molduras vão até o L2`).toBe(nivel <= 2);
      expect(spec.exigeEscolha, `L${nivel}: a escolha é dos L3 e L4`).toBe(nivel === 3 || nivel === 4);
      expect(spec.mostrarMolduras).toBe(nivel <= 2);
    }
  });

  it("a família só é emitida onde a criança escolhe, e aí as duas são exigidas", () => {
    enableComposerCanary("N3.08");

    for (const nivel of [1, 2, 5]) {
      const q = generateRegisteredFichaQuestion("N3.08", nivel);
      expect(
        q.evidenciaDeFamilia,
        `L${nivel} não oferece escolha: etiquetar estratégia ali afirmaria o que a criança não fez`,
      ).toBeUndefined();
    }

    for (const nivel of [3, 4]) {
      const familias = new Set<string>();
      for (let amostra = 0; amostra < 80; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.08", nivel);
        familias.add(String(q.evidenciaDeFamilia));
        expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:N3.08:", minimo: 2 });
      }
      expect(familias).toEqual(new Set(["familia:N3.08:voltar-curto", "familia:N3.08:completar-curto"]));
    }
  });

  it("inverter nas unidades está na barra e etiquetado — é o erro que vira o reagrupamento", () => {
    enableComposerCanary("N3.08");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("N3.08", 2);
      const spec = q.uiProps as VoltarPeloDezF34Spec;
      const invertido = (q.options ?? []).find(o => o.value === 10 + spec.restante);
      if (10 + spec.restante === spec.resposta) continue;
      expect(invertido?.misconception).toBe("subtrai-invertido");
    }
  });

  it("escolher o caminho longo é diagnóstico, não erro de conta", () => {
    const spec = construirVoltarPeloDezSpec(3);
    const longo = spec.curto === "voltar" ? "completar" : "voltar";
    expect(metaDoCaminhoF34(spec, spec.curto)).toBeUndefined();
    expect(metaDoCaminhoF34(spec, longo)).toEqual({ misconception: VoltarPeloDezMisconception.ESTRATEGIA_INEFICIENTE });
  });
});
