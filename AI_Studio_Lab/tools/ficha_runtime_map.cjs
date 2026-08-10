const path = require("node:path");

const component = (name) => path.join("src/components/primitives", `${name}.tsx`);

/**
 * Ponte explícita entre a nomenclatura autoral das fichas e o runtime.
 *
 * `builderKinds` são cases comprovados em src/curriculum/Composer.ts.
 * `rendererKinds` são kinds comprovados em FichaRenderer ou GameLoopExerciseRenderer.
 * Uma primitiva autoral pode ser realizada por um Stage mais específico do que o
 * componente que herdou seu nome. Nesses casos o alias/substituição fica listado
 * aqui, com nota de proveniência; arrays vazios continuam sendo lacunas reais,
 * nunca inferências silenciosas.
 */
const FICHA_RUNTIME_MAP = [
  {
    primitive: "ArrayGrid",
    kinds: ["array", "area", "area-model"],
    componentFiles: [component("ArrayGrid"), component("AreaStage")],
    builderKinds: ["arraygrid", "area"],
    rendererKinds: ["array", "area"],
    note: "F68/N4.09: a ficha nomeia ArrayGrid em modo área; o Composer emite kind area e o renderer entrega AreaStage. O array direto continua atendido por ArrayGrid.",
  },
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
  {
    primitive: "DragGroup",
    kinds: ["draggroup", "pareamento", "classificacao"],
    componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage")],
    builderKinds: ["draggroup", "pareamento", "classificacao"],
    rendererKinds: ["draggroup", "pareamento", "classificacao"],
    note: "A primitiva autoral foi especializada no runtime: F07/N1.01 usa pareamento (produção um-pra-cada sem numerais) e F51/AL.01 usa classificacao; draggroup permanece disponível para o contrato direto legado.",
  },
  {
    primitive: "EmojiRow",
    kinds: ["emojirow", "fileira", "moldura"],
    componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage")],
    builderKinds: ["emojirow", "fileira", "moldura"],
    rendererKinds: ["emojirow", "fileira", "moldura"],
    note: "JD1/N1.03, JD2/N1.08 e F52/AL.02 realizam EmojiRow via fileira; JD5/N1.10 usa moldura como palco composto. O alias é por ficha-fonte, não por semelhança de nome.",
  },
  {
    primitive: "Grupo",
    kinds: ["groups", "grandeza"],
    componentFiles: [component("Grupo"), component("GrandezaStage")],
    builderKinds: ["grandeza"],
    rendererKinds: ["grandeza"],
    note: "F49/GM.01 nomeia Grupo no cânone, mas o runtime substitui deliberadamente o Grupo genérico por grandeza/GrandezaStage para alinhar as bases e não ensinar comparação visual errada. Grupo.tsx permanece não ligado diretamente.",
  },
  {
    primitive: "InteractiveNumberLine",
    kinds: ["numberline", "numberline-f19"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage")],
    builderKinds: ["numberline"],
    rendererKinds: ["numberline", "numberline-f19"],
    note: "F19/N1.12 usa specialized builder e emite numberline-f19 sobre a mesma superfície InteractiveNumberLine; o wrapper numberline legado permanece intacto para N1.07 e demais consumidores.",
  },
  { primitive: "InteractiveVertical", kinds: ["vertical"], componentFiles: [component("InteractiveVertical")], builderKinds: ["vertical"], rendererKinds: ["vertical"] },
  {
    primitive: "LinkingCubes",
    kinds: ["linking-cubes"],
    componentFiles: [component("LinkingCubes")],
    builderKinds: [],
    rendererKinds: ["linking-cubes"],
    note: "Renderer existe no FichaRenderer/GameLoop, mas a cadeia autoral ainda não possui builder Composer comprovado.",
  },
  {
    primitive: "MaterialDourado",
    kinds: ["tens", "material-dourado"],
    componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage")],
    builderKinds: ["tens"],
    rendererKinds: ["tens", "material-dourado"],
    note: "F21/N2.01 usa specialized builder registrado no canário e emite material-dourado: palco manipulativo sobre o MaterialDourado existente. O kind tens permanece o contrato estático legado/genérico.",
  },
  {
    primitive: "Moedas",
    kinds: ["money"],
    componentFiles: ["src/components/Mascot.tsx"],
    componentExports: ["MoneyCoin", "MoneyNote"],
    builderKinds: [],
    rendererKinds: ["money"],
    note: "Renderização existente é inline no GameLoop; falta builder Composer/contrato autoral comprovado.",
  },
  { primitive: "NumberBond", kinds: ["bond"], componentFiles: [component("NumberBond")], builderKinds: ["bond"], rendererKinds: ["bond"] },
  { primitive: "NumberLine", kinds: ["numberline"], componentFiles: [component("NumberLine")], builderKinds: ["numberline"], rendererKinds: ["numberline"] },
  {
    primitive: "Quadrado100",
    kinds: ["hundred-chart", "frac-shade"],
    componentFiles: [component("Quadrado100")],
    builderKinds: [],
    rendererKinds: [],
    note: "Componente existe, porém nenhum builder Composer nem dispatch hundred-chart/frac-shade foi comprovado; importar o componente sem case não conta como runtime executável.",
  },
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
  {
    primitive: "SingaporeBars",
    kinds: ["singapore-bars", "ratio-table"],
    componentFiles: [component("SingaporeBars")],
    builderKinds: [],
    rendererKinds: ["singapore-bars"],
    note: "GameLoop renderiza singapore-bars, mas não há case Composer comprovado para as fichas autorais que o nomeiam.",
  },
  {
    primitive: "StoryPanel",
    kinds: ["story", "scene", "storypanel", "story-bars"],
    componentFiles: [component("StoryPanel"), component("StoryBarsStage")],
    builderKinds: ["storypanel"],
    rendererKinds: ["story-bars"],
    note: "F20/N3.10: Composer constrói storypanel e normaliza o kind final para story-bars; FichaRenderer/GameLoop entregam StoryBarsStage. StoryPanel.tsx não é o dispatch final desta ficha.",
  },
  {
    primitive: "TenFrame",
    kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"],
    componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")],
    builderKinds: ["tenframe", "moldura", "bond", "plain"],
    rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"],
    note: "F02/JD3/JD5 realizam a moldura autoral pelo MolduraStage; F28/N1.11 usa bond/plain. F21/N2.01 usa TenFrame como organizador explícito da troca 10 unidades→1 dezena dentro de MaterialDouradoStage.",
  },
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
  {
    primitive: "VisualAddition",
    kinds: ["visual-addition", "subvis"],
    componentFiles: [component("VisualAddition")],
    builderKinds: [],
    rendererKinds: ["visual-addition"],
    note: "Renderer visual-addition existe, mas não há builder Composer comprovado para F13/N3.01; subvis continua um kind legado separado.",
  },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];

module.exports = { FICHA_RUNTIME_MAP };