const GRAPHQL_URL = "https://spriteserver.pmdcollab.org/graphql";
const STARTERS = [1, 4, 7, 25, 133, 447];

async function main() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const query = `
      query SagaCreatureSmoke($filter: [Int!]) {
        monster(filter: $filter) {
          rawId
          name
          forms {
            canon
            isShiny
            isFemale
            sprites { animDataXml phaseRaw }
          }
        }
      }
    `;
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "SAGA-Creature-Engine-CI/1.0",
      },
      body: JSON.stringify({ query, variables: { filter: STARTERS } }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`GraphQL HTTP ${response.status}`);
    const envelope = await response.json();
    if (envelope.errors?.length) {
      throw new Error(envelope.errors.map((error) => error.message).join("; "));
    }
    const monsters = envelope.data?.monster || [];
    const missing = STARTERS.filter(
      (id) => !monsters.some((monster) => Number(monster.rawId) === id),
    );
    if (missing.length) throw new Error(`Starter(s) ausente(s): ${missing.join(", ")}`);

    const pikachu = monsters.find((monster) => Number(monster.rawId) === 25);
    const form = pikachu?.forms?.find(
      (candidate) =>
        candidate.canon &&
        !candidate.isShiny &&
        !candidate.isFemale &&
        candidate.sprites?.animDataXml,
    ) || pikachu?.forms?.find((candidate) => candidate.sprites?.animDataXml);
    if (!form?.sprites?.animDataXml) throw new Error("Pikachu não possui AnimData.xml disponível.");

    const xmlResponse = await fetch(form.sprites.animDataXml, {
      headers: { "User-Agent": "SAGA-Creature-Engine-CI/1.0" },
      signal: controller.signal,
    });
    if (!xmlResponse.ok) throw new Error(`AnimData HTTP ${xmlResponse.status}`);
    const xml = await xmlResponse.text();
    if (!xml.includes("<AnimData>")) throw new Error("Resposta não contém <AnimData>.");
    if (!xml.includes("<Name>Idle</Name>")) throw new Error("AnimData não contém a ação Idle esperada.");

    console.log(
      `[Creature PMD smoke] OK: ${monsters.length} starters; Pikachu phase=${form.sprites.phaseRaw}; AnimData=${xml.length} bytes.`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((error) => {
  console.error(`[Creature PMD smoke] FALHOU: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
