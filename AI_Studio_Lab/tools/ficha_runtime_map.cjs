const path = require("node:path");

const component = (name) => path.join("src/components/primitives", `${name}.tsx`);

/**
 * Ponte explícita entre a nomenclatura autoral das fichas e o runtime.
 *
 * `builderKinds` são cases comprovados em src/curriculum/Composer.ts.
 * `rendererKinds` são kinds comprovados em FichaRenderer ou GameLoopExerciseRenderer.
 * Arrays vazios são lacunas deliberadamente visíveis, nunca inferências silenciosas.
 */
const FICHA_RUNTIME_MAP = [
  { primitive: "ArrayGrid", kinds: ["array", "area-model"], componentFiles: [component("ArrayGrid")], builderKinds: [], rendererKinds: ["array"] },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice")], builderKinds: [], rendererKinds: [] },
  { primitive: "Balanca", kinds: ["balanca"], componentFiles: [component("Balanca")], builderKinds: ["balanca"], rendererKinds: ["balanca"] },
  { primitive: "DragGroup", kinds: ["draggroup"], componentFiles: [component("DragGroup")], builderKinds: ["draggroup"], rendererKinds: ["draggroup"] },
  { primitive: "EmojiRow", kinds: ["emojirow"], componentFiles: [component("EmojiRow")], builderKinds: ["emojirow"], rendererKinds: ["emojirow"] },
  { primitive: "Grupo", kinds: ["groups"], componentFiles: [component("Grupo")], builderKinds: [], rendererKinds: [] },
  { primitive: "InteractiveNumberLine", kinds: ["numberline"], componentFiles: [component("InteractiveNumberLine")], builderKinds: ["numberline"], rendererKinds: ["numberline"] },
  { primitive: "InteractiveVertical", kinds: ["vertical"], componentFiles: [component("InteractiveVertical")], builderKinds: ["vertical"], rendererKinds: ["vertical"] },
  { primitive: "LinkingCubes", kinds: ["linking-cubes"], componentFiles: [component("LinkingCubes")], builderKinds: [], rendererKinds: ["linking-cubes"] },
  { primitive: "MaterialDourado", kinds: ["tens"], componentFiles: [component("MaterialDourado")], builderKinds: ["tens"], rendererKinds: ["tens"] },
  {
    primitive: "Moedas",
    kinds: ["money"],
    componentFiles: ["src/components/Mascot.tsx"],
    componentExports: ["MoneyCoin", "MoneyNote"],
    builderKinds: [],
    rendererKinds: ["money"],
    note: "Renderização existente é inline; falta extrair contrato e builder.",
  },
  { primitive: "NumberBond", kinds: ["bond"], componentFiles: [component("NumberBond")], builderKinds: ["bond"], rendererKinds: ["bond"] },
  { primitive: "NumberLine", kinds: ["numberline"], componentFiles: [component("NumberLine")], builderKinds: ["numberline"], rendererKinds: ["numberline"] },
  { primitive: "Quadrado100", kinds: ["hundred-chart", "frac-shade"], componentFiles: [component("Quadrado100")], builderKinds: [], rendererKinds: [] },
  {
    primitive: "Regua",
    kinds: ["measure"],
    componentFiles: [],
    builderKinds: [],
    rendererKinds: [],
    note: "Lacuna real: requer régua alinhável no zero e alternativa por toque.",
  },
  { primitive: "Relogio", kinds: ["relogio"], componentFiles: [component("Relogio")], builderKinds: ["relogio"], rendererKinds: ["relogio"] },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  { primitive: "ShapeCanvas", kinds: ["shapes", "symmetry", "geo-transform"], componentFiles: [component("ShapeCanvas")], builderKinds: [], rendererKinds: [] },
  { primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table"], componentFiles: [component("SingaporeBars")], builderKinds: [], rendererKinds: ["singapore-bars"] },
  { primitive: "StoryPanel", kinds: ["story", "scene"], componentFiles: [component("StoryPanel")], builderKinds: [], rendererKinds: [] },
  { primitive: "TenFrame", kinds: ["tenframe"], componentFiles: [component("TenFrame")], builderKinds: ["tenframe"], rendererKinds: ["tenframe"] },
  {
    primitive: "TouchCount",
    kinds: ["emojirow"],
    componentFiles: [component("EmojiRow")],
    builderKinds: ["emojirow"],
    rendererKinds: ["emojirow"],
    note: "Alias autoral semântico: EmojiRow já oferece contagem por toque e áudio.",
  },
  { primitive: "TouchPlace", kinds: ["touch-place"], componentFiles: [component("TouchPlace")], builderKinds: [], rendererKinds: [] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "subvis"], componentFiles: [component("VisualAddition")], builderKinds: [], rendererKinds: ["visual-addition"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];

module.exports = { FICHA_RUNTIME_MAP };
