import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { varrerCoresLiterais } from "../src/styles/varreduraDeCores";

/**
 * Regenera a baseline da catraca de cores literais.
 *
 * Use depois de migrar um arquivo para os tokens. Nunca use para "consertar" o
 * portão quando ele acusa cor nova: subir o teto é exatamente o que a catraca
 * existe para impedir.
 */
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = resolve(RAIZ, "src/styles/cores-literais.baseline.json");

const contagem = varrerCoresLiterais(RAIZ);
const ordenado = Object.fromEntries(Object.entries(contagem).sort(([a], [b]) => a.localeCompare(b)));
const total = Object.values(ordenado).reduce((soma, n) => soma + n, 0);

writeFileSync(DESTINO, `${JSON.stringify(ordenado, null, 2)}\n`);

console.log(`Baseline: ${Object.keys(ordenado).length} arquivo(s), ${total} cor(es) literal(is).`);
