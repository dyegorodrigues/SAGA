const path = require("node:path");
const component = (name) => path.join("src/components/primitives", `${name}.tsx`);
const FICHA_RUNTIME_MAP = [
  { primitive: "ArrayGrid", kinds: ["array", "area", "area-model"], componentFiles: [component("ArrayGrid"), component("AreaStage")], builderKinds: ["arraygrid", "area"], rendererKinds: ["array", "area"], note: "F68/N4.09: área via AreaStage." },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  { primitive: "Balanca", kinds: ["balanca", "medidas"], componentFiles: [component("Balanca"), component("MedidasStage")], builderKinds: ["balanca", "medidas"], rendererKinds: ["balanca", "medidas"] },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  { primitive: "DragGroup", kinds: ["draggroup", "pareamento", "classificacao"], componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage")], builderKinds: ["draggroup", "pareamento", "classificacao"], rendererKinds: ["draggroup", "pareamento", "classificacao"] },
  { primitive: "EmojiRow", kinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15"], componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage"), component("EmojiRowRiscarStage")], builderKinds: ["emojirow", "fileira", "moldura"], specializedBuilderIds: ["N3.02"], rendererKinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15"] },
  { primitive: "Grupo", kinds: ["groups", "grandeza", "comparacao-simbolica"], componentFiles: [component("Grupo"), component("GrandezaStage"), component("ComparacaoSimbolicaStage")], builderKinds: ["grandeza"], specializedBuilderIds: ["N2.03"], rendererKinds: ["grandeza", "comparacao-simbolica"] },
  { primitive: "InteractiveNumberLine", kinds: ["numberline", "numberline-f19"], componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage")], builderKinds: ["numberline"], rendererKinds: ["numberline", "numberline-f19"] },
  { primitive: "InteractiveVertical", kinds: ["vertical"], componentFiles: [component("InteractiveVertical")], builderKinds: ["vertical"], rendererKinds: ["vertical"] },
  {
    primitive: "LinkingCubes",
    kinds: ["linking-cubes", "counting-on-f14"],
    componentFiles: [component("LinkingCubes"), component("CountingOnStage")],
    builderKinds: [], specializedBuilderIds: ["N3.03"],
    rendererKinds: ["linking-cubes", "counting-on-f14"],
    note: "W10/F14: CountingOnStage compõe LinkingCubes + NumberLine; owner especializado N3.03."
  },
  { primitive: "MaterialDourado", kinds: ["tens", "material-dourado"], componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage")], builderKinds: ["tens"], rendererKinds: ["tens", "material-dourado"] },
  { primitive: "Moedas", kinds: ["money"], componentFiles: ["src/components/Mascot.tsx"], componentExports: ["MoneyCoin", "MoneyNote"], builderKinds: [], rendererKinds: ["money"] },
  { primitive: "NumberBond", kinds: ["bond"], componentFiles: [component("NumberBond")], builderKinds: ["bond"], rendererKinds: ["bond"] },
  {
    primitive: "NumberLine",
    kinds: ["numberline", "counting-on-f14"],
    componentFiles: [component("NumberLine"), component("CountingOnStage")],
    builderKinds: ["numberline"],
    rendererKinds: ["numberline", "counting-on-f14"],
    note: "W10/F14: o kind counting-on-f14 renderiza NumberLine dentro de CountingOnStage; esta segunda entrada torna a composição observável sem inventar novo componente."
  },
  { primitive: "Quadrado100", kinds: ["hundred-chart", "frac-shade", "quadrado100-f36"], componentFiles: [component("Quadrado100"), component("Quadrado100Stage")], builderKinds: [], specializedBuilderIds: ["N2.02"], rendererKinds: ["quadrado100-f36"] },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  { primitive: "Relogio", kinds: ["relogio"], componentFiles: [component("Relogio")], builderKinds: ["relogio"], rendererKinds: ["relogio"] },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  { primitive: "ShapeCanvas", kinds: ["shapes", "symmetry", "geo-transform"], componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage")], builderKinds: ["shapecanvas"], rendererKinds: ["shapecanvas"] },
  { primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table"], componentFiles: [component("SingaporeBars")], builderKinds: [], rendererKinds: ["singapore-bars"] },
  { primitive: "StoryPanel", kinds: ["story", "scene", "storypanel", "story-bars"], componentFiles: [component("StoryPanel"), component("StoryBarsStage")], builderKinds: ["storypanel"], rendererKinds: ["story-bars"] },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"] },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];
module.exports = { FICHA_RUNTIME_MAP };
