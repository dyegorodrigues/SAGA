import { afterEach, describe, expect, it } from "vitest";
import { Track } from "../../types";
import { prescribeMisconceptionRescue } from "./rescuePlanner";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./composerCanary";
import { ALL_MATH_TRACKS, getTrackById } from "./curriculum";

/**
 * O intervalo entre implementar e ativar.
 *
 * O Padrão Ouro exige que sejam PRs distintos, e por isso existe um estado
 * normal em que a ficha autoral já está no catálogo mas o nó ainda é servido
 * pelo gerador anterior. Esse estado escondia um defeito real:
 *
 * `contentStatus` era derivado de **ter ficha registrada** em vez de **o que é
 * servido**. No intervalo, o nó se anunciava "explicit" enquanto caía no
 * fallback. Como a Oficina só prescreve resgate em trilhas com
 * `contentStatus !== "fallback"`, ela mandaria a criança treinar numa
 * competência sem conteúdo autoral — exatamente o que
 * `prescribeMisconceptionRescue` promete nunca fazer.
 *
 * Mesma família da armadilha 6.7: estado derivado do registro, não da resolução.
 *
 * **Este teste PRODUZ o estado em vez de esperar encontrá-lo.** A primeira
 * versão dependia de existir, por acaso, alguma ficha implementada e não
 * ativada — e passou a falhar no instante em que N4.03 foi promovida, que é
 * justamente quando o guarda mais precisava continuar valendo. Fazer o rollback
 * de um canário ativo produz exatamente o mesmo estado, de forma determinística.
 */

const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

/** Nós com ficha no catálogo — ativos ou não. Todos podem entrar no intervalo. */
const COM_FICHA = ALL_MATH_TRACKS
  .map(t => t.graphId || t.id)
  .filter(hasComposerFicha);

describe("implementar não é ativar", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("há fichas registradas para exercer o intervalo", () => {
    expect(COM_FICHA.length).toBeGreaterThan(0);
  });

  it.each(COM_FICHA)("%s: com ficha registrada e canário desligado, não é servido pelo Composer", id => {
    rollbackComposerCanary(id);
    expect(hasComposerFicha(id), "a ficha continua no catálogo").toBe(true);
    expect(getTrackById(id)?.generatorSource).not.toBe("composer");
  });

  it.each(COM_FICHA)("%s: nesse intervalo não se anuncia como conteúdo autoral", id => {
    rollbackComposerCanary(id);
    const track = getTrackById(id);
    // Só é "fallback" quando não há nem legado: um nó que tinha gerador próprio
    // continua tendo conteúdo de verdade, ainda que não o autoral.
    const esperado = track?.generatorSource === "fallback" ? "fallback" : "explicit";
    expect(track?.contentStatus).toBe(esperado);
  });

  it("uma estreia desligada não atrai Missão de Resgate", () => {
    // N4.03 não tem gerador legado: desligada, ela cai no placeholder. A Oficina
    // não pode mandar a criança treinar ali.
    rollbackComposerCanary("N4.03");
    expect(getTrackById("N4.03")?.contentStatus).toBe("fallback");

    const progresso = { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    const prescricao = prescribeMisconceptionRescue(
      "N4.03", ALL_MATH_TRACKS as Track[], { "N4.03": progresso },
    );
    expect(prescricao?.targetNodeId).not.toBe("N4.03");
  });

  it("ativar muda proveniência e status de uma vez", () => {
    rollbackComposerCanary("N4.03");
    expect(getTrackById("N4.03")?.contentStatus).toBe("fallback");

    enableComposerCanary("N4.03");

    expect(getTrackById("N4.03")?.generatorSource).toBe("composer");
    expect(getTrackById("N4.03")?.contentStatus).toBe("explicit");
  });

  it("o rollback devolve os dois juntos, e não só a proveniência", () => {
    enableComposerCanary("N4.03");
    expect(getTrackById("N4.03")?.contentStatus).toBe("explicit");

    rollbackComposerCanary("N4.03");

    // Se `contentStatus` fosse congelado na carga do módulo, ficaria "explicit"
    // depois do rollback e a Oficina continuaria prescrevendo sobre placeholder.
    expect(getTrackById("N4.03")?.contentStatus).toBe("fallback");
    expect(getTrackById("N4.03")?.generatorSource).not.toBe("composer");
  });
});
