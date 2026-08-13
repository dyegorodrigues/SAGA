const path = require("node:path");

const component = (name) => path.join("src/components/primitives", `${name}.tsx`);

/**
 * Ponte explícita entre a nomenclatura autoral das fichas e o runtime.
 *
 * `primitive` é SEMPRE vocabulário canônico das fichas. Um helper físico como
 * `Arranjo` pode aparecer em `componentFiles` para provar como `ArrayGrid` é
 * realizado, mas não ganha uma falsa linha canônica só porque existe no DOM.
 *
 * `builderKinds` são cases comprovados em src/curriculum/Composer.ts. Em palco
 * composto, o MESMO builder kind pode aparecer nas linhas de todas as primitivas
 * que ele realmente carrega. `specializedBuilderIds` segue a mesma regra para
 * builders locais de composerCanary.ts.
 *
 * `rendererKinds` são kinds comprovados em FichaRenderer ou
 * GameLoopExerciseRenderer. A convenção de composição é deliberadamente
 * redundante: se um Stage renderiza A + B, o mesmo renderer kind aparece na
 * linha de A e na linha de B. O observador deve unir essas linhas; nunca escolher
 * apenas a primeira. Essa é a "segunda entrada por composição" usada por
 * CountingOnStage e pelos demais palcos compostos abaixo.
 *
 * Uma primitiva autoral pode ser realizada por um Stage/helper com outro nome.
 * Nesses casos o alias/substituição fica provado em `componentFiles` e explicado
 * em `note`. Componentes auxiliares que NÃO correspondem a uma primitiva da ficha
 * não viram primitiva por inferência.
 *
 * **Regra de integridade:** arrays vazios continuam sendo lacunas reais, nunca
 * inferências silenciosas. O mapa descreve cadeia comprovada; não fabrica
 * builder, renderer, primitiva ou alias para fazer a Matrix ficar verde.
 */
const FICHA_RUNTIME_MAP = [
  {
    primitive: "ArrayGrid",
    kinds: ["array", "area", "area-model", "tabuada", "decomposicao", "ancora"],
    componentFiles: [
      component("ArrayGrid"), component("AreaStage"), component("Arranjo"),
      component("TabuadaStage"), component("DecomposicaoStage"), component("AncoraStage"),
    ],
    builderKinds: ["arraygrid", "area", "tabuada", "decomposicao", "ancora"],
    rendererKinds: ["array", "area", "tabuada", "decomposicao", "ancora"],
    note: "F68/N4.09 usa AreaStage. F42/N4.03, F43/N4.04 e F44/N4.07 realizam o vocabulário canônico ArrayGrid pelo helper físico Arranjo; Arranjo não é promovido artificialmente a primitiva canônica.",
  },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  { primitive: "Balanca", kinds: ["balanca", "medidas"], componentFiles: [component("Balanca"), component("MedidasStage")], builderKinds: ["balanca", "medidas"], rendererKinds: ["balanca", "medidas"] },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  { primitive: "DragGroup", kinds: ["draggroup", "pareamento", "classificacao"], componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage")], builderKinds: ["draggroup", "pareamento", "classificacao"], rendererKinds: ["draggroup", "pareamento", "classificacao"] },
  { primitive: "EmojiRow", kinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15"], componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage"), component("EmojiRowRiscarStage")], builderKinds: ["emojirow", "fileira", "moldura"], specializedBuilderIds: ["N3.02"], rendererKinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15"] },
  {
    primitive: "Grupo",
    kinds: ["groups", "grandeza", "comparacao-simbolica", "equal-groups-f97"],
    componentFiles: [component("Grupo"), component("GrandezaStage"), component("ComparacaoSimbolicaStage"), "src/curriculum/procedimentos/equalGroupsStage.ts"],
    builderKinds: ["grandeza"],
    specializedBuilderIds: ["N2.03", "N4.01"],
    rendererKinds: ["grandeza", "comparacao-simbolica", "equal-groups-f97"],
    note: "W12/F97 reutiliza a primitiva física Grupo em equalGroupsStage; a linguagem visual canônica não é duplicada.",
  },
  {
    primitive: "InteractiveNumberLine",
    kinds: ["numberline", "numberline-f19", "skip-count-f30"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage"), component("SkipCountStage")],
    builderKinds: ["numberline"], specializedBuilderIds: ["AL.03"],
    rendererKinds: ["numberline", "numberline-f19", "skip-count-f30"],
    note: "W11/F30 reutiliza InteractiveNumberLineSurface dentro de SkipCountStage; não existe uma segunda reta paralela."
  },
  { primitive: "InteractiveVertical", kinds: ["vertical"], componentFiles: [component("InteractiveVertical"), component("VerticalPlaceValueStage")], builderKinds: ["vertical"], rendererKinds: ["vertical"], note: "VerticalPlaceValueStage compõe InteractiveVertical + MaterialDourado; vertical aparece também na linha MaterialDourado." },
  {
    primitive: "LinkingCubes",
    kinds: ["linking-cubes", "counting-on-f14"],
    componentFiles: [component("LinkingCubes"), component("CountingOnStage")],
    builderKinds: [], specializedBuilderIds: ["N3.03"],
    rendererKinds: ["linking-cubes", "counting-on-f14"],
    note: "W10/F14: CountingOnStage compõe LinkingCubes + NumberLine; owner especializado N3.03."
  },
  {
    primitive: "MaterialDourado",
    kinds: ["tens", "material-dourado", "vertical", "deslocamento"],
    componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage"), component("VerticalPlaceValueStage"), component("DeslocamentoStage")],
    builderKinds: ["tens", "vertical", "deslocamento"],
    rendererKinds: ["tens", "material-dourado", "vertical", "deslocamento"],
    note: "MaterialDouradoStage compõe MaterialDourado + TenFrame; VerticalPlaceValueStage compõe MaterialDourado + InteractiveVertical. DeslocamentoStage usa MaterialDourado e PromocaoDeOrdem, mas PromocaoDeOrdem é helper da cena, não primitiva canônica adicional."
  },
  { primitive: "Moedas", kinds: ["money"], componentFiles: ["src/components/Mascot.tsx"], componentExports: ["MoneyCoin", "MoneyNote"], builderKinds: [], rendererKinds: ["money"] },
  {
    primitive: "NumberBond",
    kinds: ["bond", "familia"],
    componentFiles: [component("NumberBond"), component("FamiliaStage"), component("TrianguloDeFatos")],
    builderKinds: ["bond", "familia"],
    rendererKinds: ["bond", "familia"],
    note: "F96/N4.06 realiza NumberBond em linguagem triangular pelo helper TrianguloDeFatos; o modo multiplicativo continua uma exigência separada da ficha, não é inferido só pela presença do helper."
  },
  {
    primitive: "NumberLine",
    kinds: ["numberline", "counting-on-f14", "tabuada"],
    componentFiles: [component("NumberLine"), component("CountingOnStage"), component("TabuadaStage")],
    builderKinds: ["numberline", "tabuada"],
    specializedBuilderIds: ["N3.03"],
    rendererKinds: ["numberline", "counting-on-f14", "tabuada"],
    note: "W10/F14 renderiza NumberLine dentro de CountingOnStage. F42/N4.03 também renderiza NumberLine para os saltos do primeiro degrau; é entrega física adicional, embora a identidade canônica F42 nomeie ArrayGrid + Quadrado100."
  },
  {
    primitive: "Quadrado100",
    kinds: ["hundred-chart", "frac-shade", "quadrado100-f36", "tabuada", "skip-count-f30"],
    componentFiles: [component("Quadrado100"), component("Quadrado100Stage"), component("TabuadaStage"), component("SkipCountStage")],
    builderKinds: ["tabuada"], specializedBuilderIds: ["N2.02", "AL.03"],
    rendererKinds: ["quadrado100-f36", "tabuada", "skip-count-f30"],
    note: "W7/F36 usa builder especializado. F42/N4.03 compõe Quadrado100 dentro de TabuadaStage. W11/F30 compõe Quadrado100 com a reta compartilhada no L3; skip-count-f30 aparece também em InteractiveNumberLine."
  },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  { primitive: "Relogio", kinds: ["relogio"], componentFiles: [component("Relogio")], builderKinds: ["relogio"], rendererKinds: ["relogio"] },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  { primitive: "ShapeCanvas", kinds: ["shapes", "symmetry", "geo-transform"], componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage")], builderKinds: ["shapecanvas"], rendererKinds: ["shapecanvas"] },
  {
    primitive: "SingaporeBars",
    kinds: ["singapore-bars", "ratio-table", "story-bars"],
    componentFiles: [component("SingaporeBars"), component("SingaporeBarsStage"), component("StoryBarsStage")],
    builderKinds: ["storypanel"],
    rendererKinds: ["singapore-bars", "story-bars"],
    note: "N3.10/F20: StoryBarsStage compõe StoryPanelStage + SingaporeBarsStage; story-bars aparece nas duas linhas canônicas."
  },
  {
    primitive: "StoryPanel",
    kinds: ["story", "scene", "storypanel", "story-bars"],
    componentFiles: [component("StoryPanel"), component("StoryPanelStage"), component("StoryBarsStage")],
    builderKinds: ["storypanel"],
    rendererKinds: ["story-bars"],
    note: "N3.10/F20: Composer constrói storypanel e o renderer final story-bars compõe StoryPanel + SingaporeBars."
  },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], note: "MaterialDouradoStage compõe MaterialDourado + TenFrame; MolduraStage realiza diretamente TenFrame em seus modos autorais." },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];

module.exports = { FICHA_RUNTIME_MAP };
