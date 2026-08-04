import { afterEach, describe, expect, it } from "vitest";
import { Track } from "../../types";
import { prescribeMisconceptionRescue } from "./rescuePlanner";
import { COMPOSER_CANARIES, enableComposerCanary, hasComposerFicha } from "./composerCanary";
import { ALL_MATH_TRACKS, getTrackById } from "./curriculum";

/**
 * O intervalo entre implementar e ativar.
 *
 * O Padrão Ouro exige que sejam PRs distintos, e por isso existe um estado
 * normal em que a ficha autoral já está no catálogo mas o nó ainda é servido
 * pelo gerador genérico. Esse estado nunca havia sido exercido — os dois
 * canários anteriores foram registrados e ativados no mesmo commit — e
 * escondia um defeito real:
 *
 * `contentStatus` era derivado de **ter ficha registrada** em vez de **o que é
 * servido**. No intervalo entre os dois PRs, o nó se anunciava "explicit"
 * enquanto caía no fallback. Como a Oficina só prescreve resgate em trilhas
 * com `contentStatus !== "fallback"`, ela mandaria a criança treinar numa
 * competência sem conteúdo autoral — exatamente o que `prescribeMisconceptionRescue`
 * promete nunca fazer.
 *
 * É a mesma família da armadilha 6.7: estado derivado do registro em vez da
 * resolução.
 */

const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

/** Nós com ficha no catálogo que ainda NÃO foram promovidos. */
const IMPLEMENTADOS_SEM_ATIVAR = ALL_MATH_TRACKS
  .map(t => t.graphId || t.id)
  .filter(id => hasComposerFicha(id) && !COMPOSER_CANARIES.has(id));

describe("implementar não é ativar", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("existe pelo menos um nó neste estado, senão o teste não prova nada", () => {
    // Se um dia todas as fichas registradas estiverem ativas, este teste vira
    // decorativo — e é melhor falhar do que dar falsa segurança.
    expect(
      IMPLEMENTADOS_SEM_ATIVAR.length,
      "nenhuma ficha implementada e não ativada: o intervalo deixou de ser exercido",
    ).toBeGreaterThan(0);
  });

  it.each(IMPLEMENTADOS_SEM_ATIVAR)("%s continua sendo servido pelo gerador anterior", id => {
    expect(getTrackById(id)?.generatorSource).not.toBe("composer");
  });

  it.each(IMPLEMENTADOS_SEM_ATIVAR)("%s não se anuncia como conteúdo autoral", id => {
    // O defeito exato: ficha registrada flipava contentStatus para "explicit"
    // enquanto o nó caía no fallback genérico.
    const track = getTrackById(id);
    expect(track?.contentStatus).toBe("fallback");
  });

  it.each(IMPLEMENTADOS_SEM_ATIVAR)("a Oficina não manda a criança para %s antes da ativação", id => {
    const progresso = { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    const tracks = ALL_MATH_TRACKS as Track[];
    const prescricao = prescribeMisconceptionRescue(id, tracks, { [id]: progresso });
    // Sem conteúdo autoral servido, a Missão de Resgate não pode existir: o
    // motor não substitui ficha ausente por fallback.
    expect(prescricao?.targetNodeId).not.toBe(id);
  });

  it("ativar o nó muda os três de uma vez", () => {
    const id = IMPLEMENTADOS_SEM_ATIVAR[0];
    expect(getTrackById(id)?.contentStatus).toBe("fallback");

    enableComposerCanary(id);

    expect(getTrackById(id)?.generatorSource).toBe("composer");
    expect(getTrackById(id)?.contentStatus).toBe("explicit");
  });

  it("o rollback devolve o nó ao estado de não-ativado, inclusive o contentStatus", () => {
    const id = IMPLEMENTADOS_SEM_ATIVAR[0];
    enableComposerCanary(id);
    expect(getTrackById(id)?.contentStatus).toBe("explicit");

    COMPOSER_CANARIES.delete(id);

    // Se `contentStatus` fosse congelado na carga do módulo, ficaria "explicit"
    // depois do rollback e a Oficina continuaria prescrevendo sobre fallback.
    expect(getTrackById(id)?.contentStatus).toBe("fallback");
    expect(getTrackById(id)?.generatorSource).not.toBe("composer");
  });
});
