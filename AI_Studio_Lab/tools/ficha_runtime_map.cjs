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
 *
 * O arquivo é deliberadamente declarativo: nenhuma transformação ou mutação
 * acontece como efeito colateral do import.
 */
const FICHA_RUNTIME_MAP = [
  {
    primitive: "ArrayGrid",
    kinds: ["array", "area", "area-model", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81"],
    componentFiles: [component("ArrayGrid"), component("AreaStage"), component("Arranjo"), component("TabuadaStage"), component("DecomposicaoStage"), component("AncoraStage"), component("DivisaoLongaStage"), component("PerimetroStage"), component("AreaF81Stage")],
    builderKinds: ["arraygrid", "area", "tabuada", "decomposicao", "ancora"], specializedBuilderIds: ["N4.10", "GM.07", "GM.08"],
    rendererKinds: ["array", "area", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81"],
    note: "F68/N4.09 usa AreaStage. F69/N4.10 compõe ArrayGrid com InteractiveVertical na ponte concreto→algoritmo. F63/GM.07 compõe ArrayGrid + ShapeCanvas para separar chão e volta. F81/GM.08 reutiliza ArrayGrid como unidade quadrada do chão, inclusive em composição de retângulos.",
  },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  {
    primitive: "Balanca",
    kinds: ["balanca", "medidas", "igualdade-equilibrio-f46"],
    componentFiles: [component("Balanca"), component("MedidasStage"), component("IgualdadeEquilibrioStage")],
    builderKinds: ["balanca", "medidas"], specializedBuilderIds: ["AL.05"],
    rendererKinds: ["balanca", "medidas", "igualdade-equilibrio-f46"],
    note: "F46/AL.05 reutiliza Balanca como significado físico do sinal de igualdade: dois lados têm o mesmo valor.",
  },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  { primitive: "DragGroup", kinds: ["draggroup", "pareamento", "classificacao"], componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage")], builderKinds: ["draggroup", "pareamento", "classificacao"], rendererKinds: ["draggroup", "pareamento", "classificacao"] },
  {
    primitive: "EmojiRow",
    kinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage"), component("EmojiRowRiscarStage"), component("RegraSequenciaStage")],
    builderKinds: ["emojirow", "fileira", "moldura"], specializedBuilderIds: ["N3.02", "AL.04"], rendererKinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    note: "W14/F57 usa RegraSequenciaStage e compõe NumberLine nos dois primeiros degraus.",
  },
  {
    primitive: "Grupo", kinds: ["groups", "grandeza", "comparacao-simbolica", "equal-groups-f97"],
    componentFiles: [component("Grupo"), component("GrandezaStage"), component("ComparacaoSimbolicaStage"), "src/curriculum/procedimentos/equalGroupsStage.ts"],
    builderKinds: ["grandeza"], specializedBuilderIds: ["N2.03", "N4.01"], rendererKinds: ["grandeza", "comparacao-simbolica", "equal-groups-f97"], note: "W12/F97 reutiliza Grupo em equalGroupsStage.",
  },
  {
    primitive: "InteractiveNumberLine", kinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage"), component("SkipCountStage"), component("FracaoNumeroStage"), component("RetaCompletaStage")],
    builderKinds: ["numberline"], specializedBuilderIds: ["AL.03", "N5.02", "N7.01"], rendererKinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84"],
    note: "W11/F30, W16/F72 e W24/F84 reutilizam InteractiveNumberLineSurface; F72 alinha a barra à mesma escala e F84 estende a reta para negativos."
  },
  {
    primitive: "InteractiveVertical", kinds: ["vertical", "divisao-longa-f69"],
    componentFiles: [component("InteractiveVertical"), component("VerticalPlaceValueStage"), component("DivisaoLongaStage")],
    builderKinds: ["vertical"], specializedBuilderIds: ["N4.10"], rendererKinds: ["vertical", "divisao-longa-f69"],
    note: "VerticalPlaceValueStage compõe InteractiveVertical + MaterialDourado. F69 usa InteractiveVerticalDivisionSurface no mesmo arquivo da primitiva."
  },
  { primitive: "LinkingCubes", kinds: ["linking-cubes", "counting-on-f14"], componentFiles: [component("LinkingCubes"), component("CountingOnStage")], builderKinds: [], specializedBuilderIds: ["N3.03"], rendererKinds: ["linking-cubes", "counting-on-f14"], note: "W10/F14: CountingOnStage compõe LinkingCubes + NumberLine." },
  {
    primitive: "MaterialDourado", kinds: ["tens", "material-dourado", "vertical", "deslocamento"],
    componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage"), component("VerticalPlaceValueStage"), component("DeslocamentoStage")],
    builderKinds: ["tens", "vertical", "deslocamento"], rendererKinds: ["tens", "material-dourado", "vertical", "deslocamento"],
    note: "MaterialDouradoStage compõe MaterialDourado + TenFrame; VerticalPlaceValueStage compõe MaterialDourado + InteractiveVertical."
  },
  { primitive: "Moedas", kinds: ["money"], componentFiles: ["src/components/Mascot.tsx"], componentExports: ["MoneyCoin", "MoneyNote"], builderKinds: [], rendererKinds: ["money"] },
  { primitive: "NumberBond", kinds: ["bond", "familia"], componentFiles: [component("NumberBond"), component("FamiliaStage"), component("TrianguloDeFatos")], builderKinds: ["bond", "familia"], rendererKinds: ["bond", "familia"], note: "F96/N4.06 realiza NumberBond em linguagem triangular pelo helper TrianguloDeFatos." },
  {
    primitive: "NumberLine", kinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57"],
    componentFiles: [component("NumberLine"), component("CountingOnStage"), component("TabuadaStage"), component("RegraSequenciaStage")],
    builderKinds: ["numberline", "tabuada"], specializedBuilderIds: ["N3.03", "AL.04"], rendererKinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57"], note: "W10/F14 renderiza NumberLine dentro de CountingOnStage; W14/F57 usa NumberLine só nos níveis 1–2.",
  },
  {
    primitive: "Quadrado100", kinds: ["hundred-chart", "frac-shade", "quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "porcentagem-f87"],
    componentFiles: [component("Quadrado100"), component("Quadrado100Stage"), component("TabuadaStage"), component("SkipCountStage"), component("DecimalStage"), component("PorcentagemStage")],
    builderKinds: ["tabuada"], specializedBuilderIds: ["N2.02", "AL.03", "N6.01", "N6.03"], rendererKinds: ["quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "porcentagem-f87"],
    note: "W7/F36 usa builder especializado; W11/F30 compõe Quadrado100; W17/F75 relê o mesmo quadro como um inteiro em décimos e centésimos. W22/F87 compõe Quadrado100 + SingaporeBars."
  },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  { primitive: "Relogio", kinds: ["relogio"], componentFiles: [component("Relogio")], builderKinds: ["relogio"], rendererKinds: ["relogio"] },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  {
    primitive: "ShapeCanvas", kinds: ["shapes", "symmetry", "geo-transform", "detetive-formas-f58", "partes-iguais-f45", "perimetro-f63", "angulos-f78"],
    componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage"), component("DetetiveFormasStage"), component("PartesIguaisStage"), component("PerimetroStage"), component("AngulosStage")],
    builderKinds: ["shapecanvas"], specializedBuilderIds: ["GE.03", "N5.01", "GM.07", "GE.06"], rendererKinds: ["shapecanvas", "detetive-formas-f58", "partes-iguais-f45", "perimetro-f63", "angulos-f78"], note: "W13/F58 usa FiguraDesenhada; W15/F45 compõe ShapeCanvas + SingaporeBars; F63/GM.07 compõe ShapeCanvas + ArrayGrid. F78/GE.06 realiza o modo ângulo em AngulosStage com vértice, raios e arco SVG declarados pelo palco especializado."
  },
  {
    primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64"],
    componentFiles: [component("SingaporeBars"), component("SingaporeBarsStage"), component("StoryBarsStage"), component("PartesIguaisStage"), component("FracaoNumeroStage"), component("FracoesEquivalentesStage"), component("PorcentagemStage"), component("JornalTurmaStage")],
    builderKinds: ["storypanel"], specializedBuilderIds: ["N5.01", "N5.02", "N5.03", "N6.03", "PE.02"], rendererKinds: ["singapore-bars", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64"],
    note: "W15/F45, W16/F72 e W18/F73 reutilizam SingaporeBars; F73 compara barras de mesmo comprimento. W22/F87 compõe SingaporeBars com Quadrado100. W25/F64 realiza o modo vertical em JornalTurmaStage; não cria primitiva nova."
  },
  { primitive: "StoryPanel", kinds: ["story", "scene", "storypanel", "story-bars"], componentFiles: [component("StoryPanel"), component("StoryPanelStage"), component("StoryBarsStage")], builderKinds: ["storypanel"], rendererKinds: ["story-bars"], note: "N3.10/F20 compõe StoryPanel + SingaporeBars." },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], note: "MaterialDouradoStage compõe MaterialDourado + TenFrame." },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];
module.exports = { FICHA_RUNTIME_MAP };
