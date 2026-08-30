const fs = require("node:fs");
const path = require("node:path");
const { FICHA_RUNTIME_MAP } = require("./ficha_runtime_map.cjs");

const ROOT = path.resolve(__dirname, "../..");
const MAP_PATH = path.join(__dirname, "ficha_runtime_map.cjs");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");

/**
 * Portão da convenção de palcos compostos.
 *
 * O catálogo continua tendo UMA linha por primitiva canônica. Quando um kind
 * renderiza várias primitivas, ele precisa aparecer nas várias linhas e o
 * observador faz a união. Helpers físicos com outro nome ficam como evidência
 * em componentFiles; não viram nova primitiva canônica por conveniência.
 */
const mapSource = fs.readFileSync(MAP_PATH, "utf8");
check(
  mapSource.includes("arrays vazios continuam sendo lacunas reais, nunca")
    && mapSource.includes("inferências silenciosas"),
  "ficha_runtime_map perdeu a regra: arrays vazios são lacunas reais, nunca inferências silenciosas",
);
check(
  mapSource.includes("segunda entrada por composição")
    && mapSource.includes("observador deve unir"),
  "ficha_runtime_map não documenta a convenção executável de composição por união",
);

function primitivesFor(kind) {
  return [...new Set(FICHA_RUNTIME_MAP
    .filter(entry => entry.rendererKinds.includes(kind))
    .map(entry => entry.primitive))].sort();
}

function entryFor(primitive) {
  return FICHA_RUNTIME_MAP.find(entry => entry.primitive === primitive);
}

const composites = [
  {
    kind: "counting-on-f14",
    stage: "src/components/primitives/CountingOnStage.tsx",
    imports: ["./LinkingCubes", "./NumberLine"],
    primitives: ["LinkingCubes", "NumberLine"],
  },
  {
    kind: "skip-count-f30",
    stage: "src/components/primitives/SkipCountStage.tsx",
    imports: ["./InteractiveNumberLine", "./Quadrado100"],
    primitives: ["InteractiveNumberLine", "Quadrado100"],
  },
  {
    kind: "material-dourado",
    stage: "src/components/primitives/MaterialDouradoStage.tsx",
    imports: ["./MaterialDourado", "./TenFrame"],
    primitives: ["MaterialDourado", "TenFrame"],
  },
  {
    // W57/F34: as molduras mostram a decomposição como quantidade — os soltos
    // saem primeiro, a caixa cheia se abre depois — e a reta mostra o mesmo
    // percurso como distância, que é o suporte do erro suave.
    kind: "voltar-pelo-dez-f34",
    stage: "src/components/primitives/VoltarPeloDezStage.tsx",
    imports: ["./TenFrame", "./InteractiveNumberLine"],
    primitives: ["TenFrame", "InteractiveNumberLine"],
  },
  {
    // W54/F32: a grade desenha as duas fileiras espelhadas — a simetria que fixa
    // o dobro — e a moldura mostra UMA fileira dentro do dez. Uma só: preenchida
    // com o total, ela seria a resposta desenhada na tela.
    kind: "dobros-f32",
    stage: "src/components/primitives/DobrosStage.tsx",
    imports: ["./ArrayGrid", "./TenFrame"],
    primitives: ["ArrayGrid", "TenFrame"],
  },
  {
    kind: "medidas",
    stage: "src/components/primitives/MedidasStage.tsx",
    imports: ["./Balanca", "./Recipientes"],
    primitives: ["Balanca", "Recipientes"],
  },
  {
    kind: "story-bars",
    stage: "src/components/primitives/StoryBarsStage.tsx",
    imports: ["./StoryPanelStage", "./SingaporeBarsStage"],
    primitives: ["SingaporeBars", "StoryPanel"],
  },
  {
    kind: "vertical",
    stage: "src/components/primitives/VerticalPlaceValueStage.tsx",
    imports: ["./InteractiveVertical", "./MaterialDourado"],
    primitives: ["InteractiveVertical", "MaterialDourado"],
  },
  {
    kind: "tabuada",
    stage: "src/components/primitives/TabuadaStage.tsx",
    imports: ["./Arranjo", "./NumberLine", "./Quadrado100"],
    // F42 chama o arranjo de ArrayGrid no cânone. NumberLine é entrega física
    // adicional do L1; Quadrado100 é exigência canônica e não pode desaparecer.
    primitives: ["ArrayGrid", "NumberLine", "Quadrado100"],
  },
];

for (const spec of composites) {
  const source = read(spec.stage);
  for (const imported of spec.imports) {
    check(source.includes(`from \"${imported}\"`) || source.includes(`from '${imported}'`), `${spec.kind}: ${spec.stage} deixou de provar composição via ${imported}`);
  }
  const observed = primitivesFor(spec.kind);
  const expected = [...spec.primitives].sort();
  check(
    JSON.stringify(observed) === JSON.stringify(expected),
    `${spec.kind}: mapa composto observa [${observed.join(", ")}] em vez de [${expected.join(", ")}]`,
  );
}

// Aliases físicos que NÃO podem virar primitivas canônicas novas.
const arrayGrid = entryFor("ArrayGrid");
check(Boolean(arrayGrid), "ArrayGrid ausente do mapa runtime");
if (arrayGrid) {
  for (const file of ["Arranjo.tsx", "TabuadaStage.tsx", "DecomposicaoStage.tsx", "AncoraStage.tsx"]) {
    check(arrayGrid.componentFiles.some(item => item.endsWith(file)), `ArrayGrid não documenta a realização física ${file}`);
  }
}
check(!FICHA_RUNTIME_MAP.some(entry => entry.primitive === "Arranjo"), "Arranjo foi promovido indevidamente a primitiva canônica; deve continuar evidência física do ArrayGrid");

// Helpers reais de cena não devem maquiar o vocabulário da ficha.
const deslocamento = read("src/components/primitives/DeslocamentoStage.tsx");
check(deslocamento.includes('from "./PromocaoDeOrdem"'), "DeslocamentoStage deixou de usar PromocaoDeOrdem; reaudite a classificação do helper");
check(!FICHA_RUNTIME_MAP.some(entry => entry.primitive === "PromocaoDeOrdem"), "PromocaoDeOrdem é helper do DeslocamentoStage, não primitiva canônica: não o use para maquiar cobertura");

console.log("SAGA — AUDITORIA DE PALCOS COMPOSTOS (READ-ONLY)");
for (const spec of composites) console.log(`- ${spec.kind}: ${primitivesFor(spec.kind).join(" + ")} — ${spec.stage}`);
console.log("- aliases físicos: ArrayGrid → Arranjo documentado; helpers não são promovidos a primitivas");

if (failures.length) {
  console.error("\n[FALHAS DE OBSERVABILIDADE DE COMPOSIÇÃO]");
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("[RESULTADO] Regra + mapa + evidência física de composição estão sincronizados.");
}
