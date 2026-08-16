const path = require("node:path");
const component = (name) => path.join("src/components/primitives", `${name}.tsx`);

/**
 * Ponte explícita entre a nomenclatura autoral das fichas e o runtime.
 * `primitive` é vocabulário canônico; palcos compostos repetem o mesmo kind nas primitivas que realizam.
 * Arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas.
 * O arquivo é declarativo: nenhuma mutação acontece como efeito colateral do import.
 */
const FICHA_RUNTIME_MAP = [
  {
    primitive: "ArrayGrid",
    kinds: ["array", "area", "area-model", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81"],
    componentFiles: [component("ArrayGrid"), component("AreaStage"), component("Arranjo"), component("TabuadaStage"), component("DecomposicaoStage"), component("AncoraStage"), component("DivisaoLongaStage"), component("PerimetroStage"), component("AreaF81Stage")],
    builderKinds: ["arraygrid", "area", "tabuada", "decomposicao", "ancora"], specializedBuilderIds: ["N4.10", "GM.07", "GM.08"],
    rendererKinds: ["array", "area", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81"],
    note: "F68/N4.09 usa AreaStage. F69/N4.10 compõe ArrayGrid com InteractiveVertical. F63/GM.07 compõe ArrayGrid + ShapeCanvas. F81/GM.08 reutiliza ArrayGrid como unidade quadrada.",
  },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  {
    primitive: "Balanca",
    kinds: ["balanca", "medidas", "igualdade-equilibrio-f46", "expressao-f77", "problemas-medida-f82", "conversao-unidades-f93"],
    componentFiles: [component("Balanca"), component("MedidasStage"), component("IgualdadeEquilibrioStage"), component("ExpressaoF77Stage"), component("ProblemasMedidaStage"), component("ConversaoUnidadesStage")],
    builderKinds: ["balanca", "medidas"], specializedBuilderIds: ["AL.05", "AL.06", "GM.09", "GM.10"],
    rendererKinds: ["balanca", "medidas", "igualdade-equilibrio-f46", "expressao-f77", "problemas-medida-f82", "conversao-unidades-f93"],
    note: "F46/AL.05 usa Balanca para igualdade; F77/AL.06 para equivalência; F82/GM.09 compõe Balanca + NumberLine; W36/F93 preserva a quantidade física ao trocar de unidade.",
  },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  {
    primitive: "DragGroup",
    kinds: ["draggroup", "pareamento", "classificacao", "poligonos-f79"],
    componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage"), component("PoligonosStage")],
    builderKinds: ["draggroup", "pareamento", "classificacao"], specializedBuilderIds: ["GE.07"], rendererKinds: ["draggroup", "pareamento", "classificacao", "poligonos-f79"],
    note: "W33/F79 compõe ShapeCanvas + DragGroup.",
  },
  {
    primitive: "EmojiRow",
    kinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    componentFiles: [component("EmojiRow"), component("EmojiRowStage"), component("MolduraStage"), component("EmojiRowRiscarStage"), component("RegraSequenciaStage")],
    builderKinds: ["emojirow", "fileira", "moldura"], specializedBuilderIds: ["N3.02", "AL.04"], rendererKinds: ["emojirow", "fileira", "moldura", "emojirow-riscar-f15", "regra-sequencia-f57"],
    note: "W14/F57 compõe NumberLine nos dois primeiros degraus.",
  },
  { primitive: "Grupo", kinds: ["groups", "grandeza", "comparacao-simbolica", "equal-groups-f97"], componentFiles: [component("Grupo"), component("GrandezaStage"), component("ComparacaoSimbolicaStage"), "src/curriculum/procedimentos/equalGroupsStage.ts"], builderKinds: ["grandeza"], specializedBuilderIds: ["N2.03", "N4.01"], rendererKinds: ["grandeza", "comparacao-simbolica", "equal-groups-f97"], note: "W12/F97 reutiliza Grupo." },
  {
    primitive: "InteractiveNumberLine",
    kinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage"), component("SkipCountStage"), component("FracaoNumeroStage"), component("RetaCompletaStage")],
    builderKinds: ["numberline"], specializedBuilderIds: ["AL.03", "N5.02", "N7.01"], rendererKinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84"],
    note: "W11/F30, W16/F72 e W24/F84 reutilizam InteractiveNumberLineSurface.",
  },
  { primitive: "InteractiveVertical", kinds: ["vertical", "divisao-longa-f69"], componentFiles: [component("InteractiveVertical"), component("VerticalPlaceValueStage"), component("DivisaoLongaStage")], builderKinds: ["vertical"], specializedBuilderIds: ["N4.10"], rendererKinds: ["vertical", "divisao-longa-f69"], note: "F69 usa InteractiveVerticalDivisionSurface." },
  { primitive: "LinkingCubes", kinds: ["linking-cubes", "counting-on-f14"], componentFiles: [component("LinkingCubes"), component("CountingOnStage")], builderKinds: [], specializedBuilderIds: ["N3.03"], rendererKinds: ["linking-cubes", "counting-on-f14"], note: "W10/F14 compõe LinkingCubes + NumberLine." },
  { primitive: "MaterialDourado", kinds: ["tens", "material-dourado", "vertical", "deslocamento"], componentFiles: [component("MaterialDourado"), component("MaterialDouradoStage"), component("VerticalPlaceValueStage"), component("DeslocamentoStage")], builderKinds: ["tens", "vertical", "deslocamento"], rendererKinds: ["tens", "material-dourado", "vertical", "deslocamento"], note: "MaterialDouradoStage compõe MaterialDourado + TenFrame." },
  { primitive: "Moedas", kinds: ["money"], componentFiles: ["src/components/Mascot.tsx"], componentExports: ["MoneyCoin", "MoneyNote"], builderKinds: [], rendererKinds: ["money"] },
  { primitive: "NumberBond", kinds: ["bond", "familia"], componentFiles: [component("NumberBond"), component("FamiliaStage"), component("TrianguloDeFatos")], builderKinds: ["bond", "familia"], rendererKinds: ["bond", "familia"], note: "F96/N4.06 realiza NumberBond pelo TrianguloDeFatos." },
  {
    primitive: "NumberLine",
    kinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57", "problemas-medida-f82", "horas-minutos-f62", "conversao-unidades-f93"],
    componentFiles: [component("NumberLine"), component("CountingOnStage"), component("TabuadaStage"), component("RegraSequenciaStage"), component("ProblemasMedidaStage"), component("HorasMinutosStage"), component("ConversaoUnidadesStage")],
    builderKinds: ["numberline", "tabuada"], specializedBuilderIds: ["N3.03", "AL.04", "GM.06", "GM.09", "GM.10"], rendererKinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57", "problemas-medida-f82", "horas-minutos-f62", "conversao-unidades-f93"],
    note: "W32/F82 usa NumberLine + Balanca; W35/F62 usa NumberLine + Relogio; W36/F93 usa NumberLine + Balanca em escalas alinhadas.",
  },
  {
    primitive: "Quadrado100",
    kinds: ["hundred-chart", "frac-shade", "quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "porcentagem-f87"],
    componentFiles: [component("Quadrado100"), component("Quadrado100Stage"), component("TabuadaStage"), component("SkipCountStage"), component("DecimalStage"), component("PorcentagemStage")],
    builderKinds: ["tabuada"], specializedBuilderIds: ["N2.02", "AL.03", "N6.01", "N6.03"], rendererKinds: ["quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "porcentagem-f87"],
    note: "W7/F36 usa builder especializado; W11/F30 compõe Quadrado100; W17/F75 relê-o como inteiro; W22/F87 compõe SingaporeBars.",
  },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  { primitive: "Relogio", kinds: ["relogio", "horas-minutos-f62"], componentFiles: [component("Relogio"), component("HorasMinutosStage")], builderKinds: ["relogio"], specializedBuilderIds: ["GM.06"], rendererKinds: ["relogio", "horas-minutos-f62"], note: "W35/F62 compõe Relogio + NumberLine." },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  {
    primitive: "ShapeCanvas",
    kinds: ["shapes", "symmetry", "geo-transform", "detetive-formas-f58", "solidos-geometricos-f59", "partes-iguais-f45", "perimetro-f63", "angulos-f78", "mapa-tesouro-f60", "poligonos-f79", "plano-cartesiano-f80"],
    componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage"), component("DetetiveFormasStage"), component("SolidosGeometricosStage"), component("PartesIguaisStage"), component("PerimetroStage"), component("AngulosStage"), component("MapaTesouroStage"), component("PoligonosStage"), component("PlanoCartesianoStage")],
    builderKinds: ["shapecanvas"], specializedBuilderIds: ["GE.03", "GE.04", "GE.05", "N5.01", "GM.07", "GE.06", "GE.07", "GE.08"], rendererKinds: ["shapecanvas", "detetive-formas-f58", "solidos-geometricos-f59", "partes-iguais-f45", "perimetro-f63", "angulos-f78", "mapa-tesouro-f60", "poligonos-f79", "plano-cartesiano-f80"],
    note: "ShapeCanvas realiza os modos autorais já auditados, incluindo #partição, #ângulo, #3D e #grade.",
  },
  {
    primitive: "SingaporeBars",
    kinds: ["singapore-bars", "ratio-table", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64", "media-chance-f83"],
    componentFiles: [component("SingaporeBars"), component("SingaporeBarsStage"), component("StoryBarsStage"), component("PartesIguaisStage"), component("FracaoNumeroStage"), component("FracoesEquivalentesStage"), component("PorcentagemStage"), component("JornalTurmaStage"), component("MediaChanceStage")],
    builderKinds: ["storypanel"], specializedBuilderIds: ["N5.01", "N5.02", "N5.03", "N6.03", "PE.02", "PE.03"], rendererKinds: ["singapore-bars", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64", "media-chance-f83"],
    note: "W15/F45, W16/F72, W18/F73, W22/F87, W25/F64 e W31/F83 reutilizam SingaporeBars.",
  },
  { primitive: "StoryPanel", kinds: ["story", "scene", "storypanel", "story-bars"], componentFiles: [component("StoryPanel"), component("StoryPanelStage"), component("StoryBarsStage")], builderKinds: ["storypanel"], rendererKinds: ["story-bars"], note: "N3.10/F20 compõe StoryPanel + SingaporeBars." },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], note: "MaterialDouradoStage compõe MaterialDourado + TenFrame." },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain"], componentFiles: [], builtin: true, builderKinds: ["plain"], rendererKinds: ["plain"] },
];
module.exports = { FICHA_RUNTIME_MAP };
