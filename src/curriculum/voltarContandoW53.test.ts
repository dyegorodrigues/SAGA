import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { construirVoltarContandoSpec, metaDoCaminho, VoltarContandoMisconception } from "./procedimentos/voltarContandoContract";

/**
 * W53 regression-first — N3.04/F31 Voltar Contando.
 *
 * O que a F31 promete e este teste cobra, na ordem em que a ficha diz:
 * a escada de alcance, os dois caminhos, o custo de cada um, e a exigência de
 * que a coroa não venha de uma estratégia só.
 *
 * Nenhum caso é fixado à mão: o par `(total, sai)` é sorteado a cada chamada, e
 * o que o teste afirma é a propriedade — que foi o reparo da CLASS-003 em toda
 * ficha deste repositório.
 */
describe("W53 regression-first — N3.04/F31 Voltar Contando", () => {
  afterEach(() => rollbackComposerCanary("N3.04"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.04");
    expect(getTrackById("N3.04")?.prereqs).toEqual(["N3.02", "N1.02", "N1.12"]);
    expect(hasComposerFicha("N3.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.04")).toBe("voltar-contando-f31");
  });

  it("materializa a escada da F31: alcance, escolha e reta que some", () => {
    enableComposerCanary("N3.04");
    const modos = ["so-voltar", "escolher", "comparar", "escolha-cobrada", "mental"];

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.04", nivel);
        const spec = q.uiProps as ReturnType<typeof construirVoltarContandoSpec>;

        expect(q.kind).toBe("voltar-contando-f31");
        expect(spec.nivel).toBe(nivel);
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.resposta).toBe(spec.total - spec.sai);

        // O alcance é o degrau: os dois primeiros ficam dentro do dez, os três
        // seguintes começam acima dele.
        if (nivel <= 2) expect(spec.total, `L${nivel} saiu do alcance de dez`).toBeLessThanOrEqual(10);
        else expect(spec.total, `L${nivel} devia passar do dez`).toBeGreaterThan(10);

        // L1 é só voltar, e a ficha manda o subtraendo pequeno.
        if (nivel === 1) {
          expect(spec.sai).toBeLessThanOrEqual(3);
          expect(spec.curto).toBe("voltar");
          expect(spec.exigeEscolha).toBe(false);
          expect(q.prompt, "o L1 não oferece escolha e não pode perguntar por ela").not.toContain("caminho");
        } else {
          expect(spec.exigeEscolha).toBe(true);
        }

        // A reta some no nível mental — é o que ele mede.
        expect(spec.mostrarReta).toBe(nivel <= 4);

        // O custo de cada caminho é o que a lição compara.
        expect(spec.passosVoltando).toBe(spec.sai);
        expect(spec.passosCompletando).toBe(spec.resposta);
        expect(spec.curto).toBe(spec.passosVoltando < spec.passosCompletando ? "voltar" : "completar");
        expect(spec.passosVoltando, "empate deixaria o nível sem resposta").not.toBe(spec.passosCompletando);
      }
    }
  });

  it("as duas famílias aparecem, e a coroa exige as duas do L2 em diante", () => {
    enableComposerCanary("N3.04");

    for (let nivel = 2; nivel <= 5; nivel += 1) {
      const familias = new Set<string>();
      for (let amostra = 0; amostra < 60; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.04", nivel);
        familias.add(String(q.evidenciaDeFamilia));
        expect(
          q.masteryRule?.evidenciasDistintas,
          `L${nivel} oferece os dois caminhos e não exige os dois`,
        ).toMatchObject({ prefixo: "familia:N3.04:", minimo: 2 });
      }
      expect(familias, `L${nivel} só produziu uma família`).toEqual(
        new Set(["familia:N3.04:voltar-curto", "familia:N3.04:completar-curto"]),
      );
    }

    // O L1 não oferece escolha: exigir duas famílias ali seria cobrar uma
    // decisão que o nível ainda não apresentou.
    const l1 = generateRegisteredFichaQuestion("N3.04", 1);
    expect(l1.masteryRule?.evidenciasDistintas).toBeUndefined();
  });

  it("escolher o caminho longo é diagnóstico, não erro de conta", () => {
    const spec = construirVoltarContandoSpec(3);
    const longo = spec.curto === "voltar" ? "completar" : "voltar";
    expect(metaDoCaminho(spec, spec.curto)).toBeUndefined();
    expect(metaDoCaminho(spec, longo)).toEqual({ misconception: VoltarContandoMisconception.ESTRATEGIA_INEFICIENTE });
  });

  it("os distratores nomeiam os erros que a ficha nomeia", () => {
    enableComposerCanary("N3.04");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.04", nivel);
        for (const opcao of q.options ?? []) if (opcao.misconception) tags.add(String(opcao.misconception));
        // CLASS-009 na origem: nenhuma alternativa pode repetir a resposta.
        const valores = (q.options ?? []).map(o => o.value);
        expect(new Set(valores).size, "alternativa repetida").toBe(valores.length);
      }
    }
    expect(tags).toEqual(new Set(["off-by-one", "inverte-direcao"]));
  });
});
