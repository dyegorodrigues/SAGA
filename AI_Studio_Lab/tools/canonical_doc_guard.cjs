const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const fail = (message) => {
  console.error(`[FALHA CANÔNICA] ${message}`);
  process.exitCode = 1;
};

const manual = read("AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md");
const progressEngine = read("src/curriculum/motores/progressEngine.ts");

// O runtime é a autoridade executável desta regra. O guard documental existe
// para impedir o mesmo falso-verde encontrado na reconciliação pós-P22:
// documento antigo dizia 2 erros enquanto o motor já exigia 3.
if (!/bad\s*>=\s*3/.test(progressEngine)) {
  fail("progressEngine deixou de declarar descida conceitual em 3 erros; revisar contrato antes de alterar o Manual.");
}
if (!/3 acertos sobe,\s*3 erros desce/i.test(manual)) {
  fail("Manual não espelha a descida conceitual do runtime: esperado '3 acertos sobe, 3 erros desce'.");
}
if (/3 acertos sobe,\s*2 erros desce/i.test(manual)) {
  fail("Manual regrediu para a antiga descida conceitual em 2 erros.");
}

if (!process.exitCode) {
  console.log("[RESULTADO] Guard documental canônico aprovado: Manual e runtime concordam na escada conceitual 3/3.");
}
