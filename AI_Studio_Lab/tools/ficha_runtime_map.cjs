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
  { primitive: "ArrayGrid", kinds: ["array", "area-model"], componentFiles: [component("ArrayGrid")], builderKinds: ["arraygrid"], rendererKinds: ["array"] },
  {
    primitive: "AudioChoice",
    kinds: ["audiochoice"],
    componentFiles: [component("AudioChoice"), component("AudioChoiceStage")],
    builderKinds: ["audiochoice"],
    rendererKinds: ["audiochoice"],
    note: "F05/N1.06: som→símbolo; Stage possui autoplay/retry/feedback temporal e GameLoop mantém autoria única do enunciado.",
  },
  { primitive: "Balanca", kinds: ["balanca", "medidas"], componentFiles: [component("Balanca"), component("MedidasStage")], builderKinds: ["balanca", "medidas"], rendererKinds: ["balanca", "medidas"] },
  {
    primitive: "Recipientes",
    kinds: ["containers", "medidas"],
    componentFiles: [component("Recipientes"), component("MedidasStage")],
    builderKinds: ["medidas"],
    rendererKinds: ["medidas"],
    note: "F50/GM.12: conservação/comparação sem unidades; o mesmo componente poderá receber graduação apenas em GM.05.",
  },
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
  {
    primitive: "ShapeCanvas",
    kinds: ["shapes", "symmetry", "geo-transform"],
    componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage")],
    builderKinds: ["shapecanvas"],
    rendererKinds: ["shapecanvas"],
    note: "F47/GE.01 e F48/GE.02 compartilham o ShapeCanvas; Composer seleciona modo cena/formas e o renderer despacha ao Stage correspondente.",
  },
  { primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table"], componentFiles: [component("SingaporeBars")], builderKinds: [], rendererKinds: ["singapore-bars"] },
  { primitive: "StoryPanel", kinds: ["story", "scene"], componentFiles: [component("StoryPanel")], builderKinds: [], rendererKinds: [] },
  { primitive: "TenFrame", kinds: ["tenframe"], componentFiles: [component("TenFrame")], builderKinds: ["tenframe"], rendererKinds: ["tenframe"] },
  {
    primitive: "TouchCount",
    kinds: ["touchcount"],
    componentFiles: [component("TouchCount")],
    builderKinds: ["touchcount"],
    rendererKinds: ["touchcount"],
    note: "N1.02/F27 e N1.04/F01: primitiva própria de contagem por toque; compartilha gramática visual com EmojiRow, mas possui contrato/runtime distintos.",
  },
  {
    primitive: "TouchPlace",
    kinds: ["touchplace"],
    componentFiles: [component("TouchPlace"), component("TouchPlaceStage")],
    builderKinds: ["touchplace"],
    rendererKinds: ["touchplace"],
    note: "F04/N1.13: produção de quantidade; Stage possui gesto, feedback e retry autoral, GameLoop registra progresso/Radar.",
  },
  { primitive: "VisualAddition", kinds: ["visual-addition", "subvis"], componentFiles: [component("VisualAddition")], builderKinds: [], rendererKinds: ["visual-addition"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];

module.exports = { FICHA_RUNTIME_MAP };
