import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { getTrackById } from "./motores/curriculum";

/**
 * CLASS-002 — a ficha e o DAG precisam contar a mesma história.
 *
 * Quem tranca a porta é o DAG: é dele que `unlockEngine` e `rescuePlanner`
 * leem os pré-requisitos. O campo `prereqs` da ficha é documentação — e
 * documentação que discorda do que o app faz é pior que documentação ausente,
 * porque convence de uma coisa errada.
 *
 * Seis fichas discordavam. Cinco diziam MENOS do que o DAG cobra: `N3.10`,
 * `N4.03`, `N4.06`, `N4.07` e `N4.08`. Nelas o DAG é a autoridade operante e a
 * ficha foi alinhada.
 *
 * O nome NÃO é comparado, de propósito: `nome` na ficha é o nome que a criança
 * vê — "O Mapa do Tesouro" — e no DAG é o rótulo curricular — "Localização em
 * malhas e mapas". São dois registros da mesma coisa, e igualá-los perderia um
 * dos dois.
 */

/**
 * A divergência que NÃO se resolve escrevendo código.
 *
 * `GM.04` é a `DECISAO-001`: as autoridades curriculares divergem sobre o
 * escopo — o YAML reserva os minutos para GM.06, a F55 canônica os inclui, e a
 * ficha TS traz um micro de avançar 15 minutos. Alinhar os pré-requisitos aqui
 * seria escolher em silêncio qual autoridade vence e redistribuir escopo entre
 * duas competências.
 *
 * Fica registrada como pendência de decisão humana, com catraca: no dia em que
 * as duas concordarem, esta entrada reprova pedindo para ser removida.
 */
const PENDENTE_DE_DECISAO_HUMANA: Record<string, string> = {
  "GM.04": "DECISAO-001: YAML, F55 e a ficha TS divergem sobre o escopo dos minutos entre GM.04 e GM.06",
};

describe("CLASS-002 — conformance ficha ↔ DAG", () => {
  it("os pré-requisitos documentados são os que o DAG cobra", () => {
    const divergem: string[] = [];
    let comparadas = 0;

    for (const ficha of JOURNEY_FICHAS) {
      const track = getTrackById(ficha.id);
      expect(track, `${ficha.id} não existe no DAG`).toBeDefined();
      const naFicha = [...(ficha.prereqs ?? [])].sort().join(",");
      const noDag = [...(track!.prereqs ?? [])].sort().join(",");
      comparadas += 1;
      if (naFicha !== noDag) divergem.push(`${ficha.id}: ficha [${naFicha}], DAG [${noDag}]`);
    }

    const novas = divergem.filter(linha => !PENDENTE_DE_DECISAO_HUMANA[linha.split(":")[0]]).sort();
    const resolvidas = Object.keys(PENDENTE_DE_DECISAO_HUMANA)
      .filter(id => !divergem.some(linha => linha.startsWith(`${id}:`))).sort();

    expect(novas, `ficha e DAG discordam nos pré-requisitos:\n${novas.join("\n")}`).toEqual([]);
    expect(resolvidas, `divergências que se resolveram — remova a pendência: ${resolvidas.join(", ")}`).toEqual([]);
    // A Jornada tem 78 fichas escritas para as 90 competências do DAG; o que
    // este número guarda é a varredura, não a cobertura.
    expect(comparadas, "a varredura parou de comparar fichas").toBeGreaterThanOrEqual(75);
  });

  it("cada pendência de decisão humana diz sobre o que é a decisão", () => {
    for (const [id, porque] of Object.entries(PENDENTE_DE_DECISAO_HUMANA)) {
      expect(porque.length, `${id} sem justificativa`).toBeGreaterThan(30);
    }
  });
});
