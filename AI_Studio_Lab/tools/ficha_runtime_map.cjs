const path = require("node:path");

const component = (name) => path.join("src/components/primitives", `${name}.tsx`);

/** Ponte explícita ficha → builder → renderer → componente físico. */
const FICHA_RUNTIME_MAP = [
  {
    primitive: "ArrayGrid",
    kinds: ["array", "area", "area-model", "tabuada", "decomposicao", "ancora"],
    componentFiles: [component("ArrayGrid"), component("AreaStage"), component("Arranjo"), component("TabuadaStage"), component("DecomposicaoStage"), component("AncoraStage")],
    builderKinds: ["arraygrid", "area", "tabuada", "decomposicao", "ancora"],
    rendererKinds: ["array", "area", "tabuada", "decomposicao", "ancora"],
    note: "F68/N4.09 usa AreaStage. F42/N4.03, F43/N4.04 e F44/N4.07 realizam ArrayGrid pelo helper físico Arranjo.",
  },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  { primitive: "Balanca", kinds: ["balanca", "medidas"], componentFiles: [component("Balanca"), component("MedidasStage")], builderKinds: ["balanca", "medidas"], rendererKinds: ["balanca", "medidas"] },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  { primitive: "DragGroup", kinds: ["draggroup", "pareamento", "classificacao"], componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage")], builderKinds: ["draggroup", "pareamento", "classificacao"], rendererKinds: ["draggroup", "pareamento", "classificacao"] },
  {
    primitive: "EmojiRow",
    kinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage"), component("EmojiRowRiscarStage"), component("RegraSequenciaStage")],
    builderKinds: ["emojirow", "fileira", "moldura"],
    specializedBuilderIds: ["N3.02", "AL.04"],
    rendererKinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    note: "W14/F57 realiza a fileira numérica canônica e compõe NumberLine nos dois primeiros degraus.",
  },
  {
    primitive: "Grupo",
    kinds: ["groups", "grandeza", "comparacao-simbolica", "equal-groups-f97"],
    componentFiles: [component("Grupo"), component("GrandezaStage"), component("ComparacaoSimbolicaStage"), "src/curriculum/procedimentos/equalGroupsStage.ts"],
    builderKinds: ["grandeza"], specializedBuilderIds: ["N2.03", "N4.01"],
    rendererKinds: ["grandeza", "comparacao-simbolica", "equal-groups-f97"],
  },
  {
    primitive: "InteractiveNumberLine",
    kinds: ["numberline", "numberline-f19", "skip-count-f30"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage"), component("SkipCountStage")],
    builderKinds: ["numberline"], specializedBuilderIds: ["AL.03"],
    rendererKinds: ["numberline", "numberline-f19", "skip-count-f30"],
  },
  { primitive: "InteractiveVertical", kinds: ["vertical"], componentFiles: [component("InteractiveVertical"), component("VerticalPlaceValueStage")], builderKinds: ["vertical"], rendererKinds: ["vertical"] },
  {
    primitive: "LinkingCubes", kinds: ["linking-cubes", "counting-on-f14"],
    componentFiles: [component("LinkingCubes"), component("CountingOnStage")], builderKinds: [], specializedBuilderIds: ["N3.03"],
    rendererKinds: ["linking-cubes", "counting-on-f14"],
  },
  {
    primitive: "MaterialDourado", kinds: ["tens", "material-dourado", "vertical", "deslocamento"],
    componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage"), component("VerticalPlaceValueStage"), component("DeslocamentoStage")],
    builderKinds: ["tens", "vertical", "deslocamento"], rendererKinds: ["tens", "material-dourado", "vertical", "deslocamento"],
  },
  { primitive: "Moedas", kinds: ["money"], componentFiles: ["src/components/Mascot.tsx"], componentExports: ["MoneyCoin", "MoneyNote"], builderKinds: [], rendererKinds: ["money"] },
  {
    primitive: "NumberBond", kinds: ["bond", "familia"],
    componentFiles: [component("NumberBond"), component("FamiliaStage"), component("TrianguloDeFatos")],
    builderKinds: ["bond", "familia"], rendererKinds: ["bond", "familia"],
  },
  {
    primitive: "NumberLine", kinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57"],
    componentFiles: [component("NumberLine"), component("CountingOnStage"), component("TabuadaStage"), component("RegraSequenciaStage")],
    builderKinds: ["numberline", "tabuada"], specializedBuilderIds: ["N3.03", "AL.04"],
    rendererKinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57"],
  },
  {
    primitive: "Quadrado100", kinds: ["hundred-chart", "frac-shade", "quadrado100-f36", "tabuada", "skip-count-f30"],
    componentFiles: [component("Quadrado100"), component("Quadrado100Stage"), component("TabuadaStage"), component("SkipCountStage")],
    builderKinds: ["tabuada"], specializedBuilderIds: ["N2.02", "AL.03"],
    rendererKinds: ["quadrado100-f36", "tabuada", "skip-count-f30"],
  },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  { primitive: "Relogio", kinds: ["relogio"], componentFiles: [component("Relogio")], builderKinds: ["relogio"], rendererKinds: ["relogio"] },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  {
    primitive: "ShapeCanvas",
    kinds: ["shapes", "symmetry", "geo-transform", "detetive-formas-f58", "partes-iguais-f45"],
    componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage"), component("DetetiveFormasStage"), component("PartesIguaisStage")],
    builderKinds: ["shapecanvas"], specializedBuilderIds: ["GE.03", "N5.01"],
    rendererKinds: ["shapecanvas", "detetive-formas-f58", "partes-iguais-f45"],
    note: "W15/F45 compõe FiguraDesenhada de ShapeCanvas nos círculos e SingaporeBars nos degraus de barra; owner especializado N5.01.",
  },
  {
    primitive: "SingaporeBars",
    kinds: ["singapore-bars", "ratio-table", "story-bars", "partes-iguais-f45"],
    componentFiles: [component("SingaporeBars"), component("SingaporeBarsStage"), component("StoryBarsStage"), component("PartesIguaisStage")],
    builderKinds: ["storypanel"], specializedBuilderIds: ["N5.01"],
    rendererKinds: ["singapore-bars", "story-bars", "partes-iguais-f45"],
    note: "W15/F45 usa SingaporeFractionBar, exportação da própria SingaporeBars, para representar o inteiro em partes iguais.",
  },
  {
    primitive: "StoryPanel", kinds: ["story", "scene", "storypanel", "story-bars"],
    componentFiles: [component("StoryPanel"), component("StoryPanelStage"), component("StoryBarsStage")],
    builderKinds: ["storypanel"], rendererKinds: ["story-bars"],
  },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"] },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];

module.exports = { FICHA_RUNTIME_MAP };
