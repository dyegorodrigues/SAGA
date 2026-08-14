const { FICHA_RUNTIME_MAP: BASE } = require("./ficha_runtime_map_core.cjs");

/**
 * Extensões físicas do bloco W17–W19.
 *
 * A regra de composição permanece a mesma: o mesmo renderer kind aparece em
 * cada primitiva que o palco carrega — esta é a segunda entrada por composição;
 * o observador deve unir essas linhas. Helpers não são promovidos a primitivas.
 * arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas.
 */
const FICHA_RUNTIME_MAP = BASE.map(entry => {
  if (entry.primitive === "Quadrado100") {
    return {
      ...entry,
      kinds: [...entry.kinds, "decimos-centesimos-f75"],
      componentFiles: [...entry.componentFiles, "src/components/primitives/DecimalStage.tsx"],
      specializedBuilderIds: [...(entry.specializedBuilderIds || []), "N6.01"],
      rendererKinds: [...entry.rendererKinds, "decimos-centesimos-f75"],
      note: `${entry.note || ""} W17/F75 relê a mesma malha 10×10 como um inteiro, sem criar uma segunda primitiva.`,
    };
  }
  return entry;
});

module.exports = { FICHA_RUNTIME_MAP };
