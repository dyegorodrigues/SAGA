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
 * Divergências que NÃO se resolvem escrevendo código.
 *
 * Uma entrada aqui não é anistia: é a declaração de que alinhar os
 * pré-requisitos escolheria em silêncio qual autoridade curricular vence e
 * redistribuiria escopo entre competências. Vem com catraca dos dois lados —
 * uma divergência nova reprova, e uma entrada que parou de divergir reprova
 * também, pedindo para ser removida.
 *
 * A `GM.04` morou aqui como `DECISAO-001` e saiu resolvida: a competência é a
 * hora cheia e a meia hora, os minutos são da GM.06. O porquê, as quatro
 * autoridades comparadas e o caminho de volta estão escritos no cabeçalho da
 * própria ficha `GM.04.ts` — perto de quem for mexer nela, não num documento
 * que ninguém abre.
 *
 * O registro está vazio hoje. Vazio é o estado saudável: a prova de vida do
 * teste é a contagem de fichas varridas, não o tamanho desta lista.
 */
const PENDENTE_DE_DECISAO_HUMANA: Record<string, string> = {};

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
