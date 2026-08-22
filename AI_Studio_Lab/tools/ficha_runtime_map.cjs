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
    kinds: ["array", "area", "area-model", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81", "fatores-retangulos-f66", "volume-vistas-f92", "volume-prismas-f94", "estatistica-chance-f95", "multiplicar-fracoes-f86", "primos-divisores-f70"],
    componentFiles: [component("ArrayGrid"), component("AreaStage"), component("Arranjo"), component("TabuadaStage"), component("DecomposicaoStage"), component("AncoraStage"), component("DivisaoLongaStage"), component("PerimetroStage"), component("AreaF81Stage"), component("FatoresRetangulosStage"), component("VolumeVistasStage"), component("VolumePrismasStage"), component("EstatisticaChanceStage"), component("MultiplicarFracoesStage"), component("PrimosDivisoresStage")],
    builderKinds: ["arraygrid", "area", "tabuada", "decomposicao", "ancora"], specializedBuilderIds: ["N4.10", "GM.07", "GM.08", "N2.07", "GE.10", "GM.11", "PE.04", "N5.05", "N4.11"],
    rendererKinds: ["array", "area", "tabuada", "decomposicao", "ancora", "divisao-longa-f69", "perimetro-f63", "area-f81", "fatores-retangulos-f66", "volume-vistas-f92", "volume-prismas-f94", "estatistica-chance-f95", "multiplicar-fracoes-f86", "primos-divisores-f70"],
    note: "F68/N4.09 usa AreaStage. F69/N4.10 compõe ArrayGrid com InteractiveVertical na ponte concreto→algoritmo. F63/GM.07 compõe ArrayGrid + ShapeCanvas para separar chão e volta. F81/GM.08 reutiliza ArrayGrid como unidade quadrada do chão, inclusive em composição de retângulos. W39/F66/N2.07 reutiliza o ArrayGrid físico em FatoresRetangulosStage e mantém qualquer sobra visível fora do retângulo completo. W41/F92/GE.10 realiza ArrayGrid#3D em VolumeVistasStage: o ArrayGrid físico permanece a superfície canônica das projeções e da reconstrução; o palco acrescenta visualização/rotação 3D, onboarding explícito do mode swap e interação por toque com alvos mínimos de 80px, sem criar primitiva autoral paralela. W48/F94/GM.11 reutiliza a mesma alfabetização ArrayGrid#3D e o helper isométrico da F92 em VolumePrismasStage: a criança preenche cubos/camadas por toque amplo, conecta uma camada à área da base e repete pela altura, inclusive no caso de dimensão faltante e base não retangular, sem criar primitiva autoral paralela nem transformar gesto motor em misconception. W49/F95/PE.04 compõe SingaporeBars + ArrayGrid em EstatisticaChanceStage; o ArrayGrid organiza explicitamente a enumeração de combinações, sem criar uma linguagem paralela nem usar precisão motora como evidência. W50/F86/N5.05 reutiliza ArrayGrid#área em MultiplicarFracoesStage: fração de inteiro e fração×fração permanecem no mesmo chão quadriculado, a interseção de duas partições torna o produto visível, o L4 retira o preenchimento para generalização simbólica e o L5 relê as partições como quantas frações cabem, com toque amplo e sem criar primitiva paralela. W42/F70/N4.11 reutiliza ArrayGrid em PrimosDivisoresStage para testar divisores por retângulos que fecham sem sobra; a exploração por toque é separada da evidência conceitual e qualquer sobra permanece visível.",
  },
  { primitive: "AudioChoice", kinds: ["audiochoice"], componentFiles: [component("AudioChoice"), component("AudioChoiceStage")], builderKinds: ["audiochoice"], rendererKinds: ["audiochoice"] },
  {
    primitive: "Balanca",
    kinds: ["balanca", "medidas", "igualdade-equilibrio-f46", "expressao-f77", "problemas-medida-f82", "conversao-unidades-f93", "equacoes-f90"],
    componentFiles: [component("Balanca"), component("MedidasStage"), component("IgualdadeEquilibrioStage"), component("ExpressaoF77Stage"), component("ProblemasMedidaStage"), component("ConversaoUnidadesStage"), component("EquacoesStage")],
    builderKinds: ["balanca", "medidas"], specializedBuilderIds: ["AL.05", "AL.06", "GM.09", "GM.10", "AL.08"],
    rendererKinds: ["balanca", "medidas", "igualdade-equilibrio-f46", "expressao-f77", "problemas-medida-f82", "conversao-unidades-f93", "equacoes-f90"],
    note: "F46/AL.05 reutiliza Balanca como significado físico do sinal de igualdade. F77/AL.06 reutiliza a mesma balança para preservar equivalência enquanto explicita precedência, agrupamento e incógnita. F82/GM.09 compõe Balanca + NumberLine para manter equivalência visível durante conversões e problemas de medida. W36/F93 preserva a quantidade física ao trocar de unidade. W46/F90/AL.08 reutiliza Balanca em EquacoesStage para tornar física a preservação da igualdade: a mesma transformação mantém os pratos equilibrados e uma alteração unilateral inclina a balança; não há primitiva paralela nem arrasto obrigatório.",
  },
  { primitive: "Recipientes", kinds: ["containers", "medidas"], componentFiles: [component("Recipientes"), component("MedidasStage")], builderKinds: ["medidas"], rendererKinds: ["medidas"] },
  {
    primitive: "DragGroup",
    kinds: ["draggroup", "pareamento", "classificacao", "poligonos-f79"],
    componentFiles: [component("DragGroup"), component("PareamentoStage"), component("ClassificacaoStage"), component("PoligonosStage")],
    builderKinds: ["draggroup", "pareamento", "classificacao"], specializedBuilderIds: ["GE.07"],
    rendererKinds: ["draggroup", "pareamento", "classificacao", "poligonos-f79"],
    note: "W33/F79 compõe ShapeCanvas + DragGroup em PoligonosStage; DragGroup realiza seleção, classificação e alternativa por toque sem criar primitiva nova.",
  },
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
    primitive: "InteractiveNumberLine", kinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84", "operar-negativos-f85"],
    componentFiles: [component("InteractiveNumberLine"), component("Reta20Stage"), component("SkipCountStage"), component("FracaoNumeroStage"), component("RetaCompletaStage"), component("OperarNegativosStage")],
    builderKinds: ["numberline"], specializedBuilderIds: ["AL.03", "N5.02", "N7.01", "N7.02"], rendererKinds: ["numberline", "numberline-f19", "skip-count-f30", "fracao-numero-f72", "reta-completa-f84", "operar-negativos-f85"],
    note: "W11/F30, W16/F72 e W24/F84 reutilizam InteractiveNumberLineSurface; F72 alinha a barra à mesma escala e F84 estende a reta para negativos. W37/F85 reutiliza a mesma superfície para operar com inteiros, incluindo cruzamento do zero e cancelamento de dívida em a − (−b)."
  },
  {
    primitive: "InteractiveVertical", kinds: ["vertical", "divisao-longa-f69", "divisao-dois-digitos-f71", "contas-virgula-f76"],
    componentFiles: [component("InteractiveVertical"), component("VerticalPlaceValueStage"), component("DivisaoLongaStage"), component("DivisaoDoisDigitosStage"), component("ContasVirgulaStage")],
    builderKinds: ["vertical"], specializedBuilderIds: ["N4.10", "N4.12", "N6.02"], rendererKinds: ["vertical", "divisao-longa-f69", "divisao-dois-digitos-f71", "contas-virgula-f76"],
    note: "VerticalPlaceValueStage compõe InteractiveVertical + MaterialDourado. F69 usa InteractiveVerticalDivisionSurface no mesmo arquivo da primitiva. W43/F71/N4.12 reutiliza a mesma InteractiveVertical por DivisaoDoisDigitosStage e InteractiveVerticalDivisionEstimateSurface: a criança registra uma estimativa, testa pela multiplicação do divisor real e ajusta por toque; o rascunho não revela o quociente correto e o erro motor fica separado de misconception. W47/F76/N6.02 estende o mesmo arquivo com InteractiveVerticalDecimalSurface: a vírgula é eixo visual das ordens, zeros de preenchimento explicitam casas ausentes e o alinhamento pela direita produz wobble em vez de travar; ContasVirgulaStage compõe essa superfície com Quadrado100, sem primitiva paralela nem arrasto obrigatório.",
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
    primitive: "NumberLine",
    kinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57", "problemas-medida-f82", "horas-minutos-f62", "conversao-unidades-f93"],
    componentFiles: [component("NumberLine"), component("CountingOnStage"), component("TabuadaStage"), component("RegraSequenciaStage"), component("ProblemasMedidaStage"), component("HorasMinutosStage"), component("ConversaoUnidadesStage")],
    builderKinds: ["numberline", "tabuada"], specializedBuilderIds: ["N3.03", "AL.04", "GM.06", "GM.09", "GM.10"], rendererKinds: ["numberline", "counting-on-f14", "tabuada", "regra-sequencia-f57", "problemas-medida-f82", "horas-minutos-f62", "conversao-unidades-f93"],
    note: "W10/F14 renderiza NumberLine dentro de CountingOnStage; W14/F57 usa NumberLine só nos níveis 1–2. W32/F82 compõe NumberLine + Balanca para converter antes de comparar ou operar. W35/F62 compõe NumberLine + Relogio para leitura de minutos e duração. W36/F93 usa NumberLine + Balanca em escalas alinhadas.",
  },
  {
    primitive: "Quadrado100", kinds: ["hundred-chart", "frac-shade", "quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "contas-virgula-f76", "porcentagem-f87", "primos-divisores-f70"],
    componentFiles: [component("Quadrado100"), component("Quadrado100Stage"), component("TabuadaStage"), component("SkipCountStage"), component("DecimalStage"), component("ContasVirgulaStage"), component("PorcentagemStage"), component("PrimosDivisoresStage")],
    builderKinds: ["tabuada"], specializedBuilderIds: ["N2.02", "AL.03", "N6.01", "N6.02", "N6.03", "N4.11"], rendererKinds: ["quadrado100-f36", "tabuada", "skip-count-f30", "decimos-centesimos-f75", "contas-virgula-f76", "porcentagem-f87", "primos-divisores-f70"],
    note: "W7/F36 usa builder especializado; W11/F30 compõe Quadrado100; W17/F75 relê o mesmo quadro como um inteiro em décimos e centésimos. W47/F76/N6.02 preserva essa mesma leitura do Quadrado100 como um inteiro enquanto InteractiveVertical explicita a conta e o eixo da vírgula; o quadro mostra as partes decimais sem antecipar o resultado. W22/F87 compõe Quadrado100 + SingaporeBars. W42/F70/N4.11 usa o próprio Quadrado100 para múltiplos e para o Crivo de Eratóstenes: o palco risca fisicamente as casas dos múltiplos compostos e preserva os primos-base, em vez de substituir o quadro/crivo por texto abstrato."
  },
  { primitive: "Regua", kinds: ["measure", "regua", "regua-f61"], componentFiles: [component("Regua"), component("ReguaStage")], builderKinds: [], specializedBuilderIds: ["GM.05"], rendererKinds: ["regua", "regua-f61"] },
  {
    primitive: "Relogio",
    kinds: ["relogio", "horas-minutos-f62"],
    componentFiles: [component("Relogio"), component("HorasMinutosStage")],
    builderKinds: ["relogio"], specializedBuilderIds: ["GM.06"], rendererKinds: ["relogio", "horas-minutos-f62"],
    note: "W35/F62 reutiliza Relogio e o compõe com NumberLine em HorasMinutosStage; não cria primitiva autoral nova.",
  },
  { primitive: "ScatteredItems", kinds: ["scattered"], componentFiles: [component("ScatteredItems")], builderKinds: ["scattered"], rendererKinds: ["scattered"] },
  {
    primitive: "ShapeCanvas", kinds: ["shapes", "symmetry", "geo-transform", "detetive-formas-f58", "solidos-geometricos-f59", "partes-iguais-f45", "perimetro-f63", "angulos-f78", "mapa-tesouro-f60", "poligonos-f79", "plano-cartesiano-f80", "circulo-areas-f91"],
    componentFiles: [component("ShapeCanvas"), component("CenaDePosicaoStage"), component("FormaStage"), component("DetetiveFormasStage"), component("SolidosGeometricosStage"), component("PartesIguaisStage"), component("PerimetroStage"), component("AngulosStage"), component("MapaTesouroStage"), component("PoligonosStage"), component("PlanoCartesianoStage"), component("CirculoAreasStage")],
    builderKinds: ["shapecanvas"], specializedBuilderIds: ["GE.03", "GE.04", "GE.05", "N5.01", "GM.07", "GE.06", "GE.07", "GE.08", "GE.09"], rendererKinds: ["shapecanvas", "detetive-formas-f58", "solidos-geometricos-f59", "partes-iguais-f45", "perimetro-f63", "angulos-f78", "mapa-tesouro-f60", "poligonos-f79", "plano-cartesiano-f80", "circulo-areas-f91"], note: "W13/F58 usa FiguraDesenhada; W29/F59 realiza o modo 3D em SolidosGeometricosStage, preservando ShapeCanvas como superfície e acrescentando rampa/empilhamento com alternativa por toque; W15/F45 compõe ShapeCanvas + SingaporeBars; F63/GM.07 compõe ShapeCanvas + ArrayGrid. F78/GE.06 realiza o modo ângulo em AngulosStage com vértice, raios e arco SVG. F60/GE.05 realiza o modo grade em MapaTesouroStage, reutilizando ShapeCanvas como superfície espacial com coluna, linha e interseção explícitas. W33/F79 compõe ShapeCanvas + DragGroup em PoligonosStage para identificar, classificar e construir polígonos por propriedades. W34/F80 realiza ShapeCanvas#grade em PlanoCartesianoStage com a regra primeiro x, depois y, alternativa por toque e snap generoso. W40/F91 realiza triângulo, paralelogramo e círculo dentro da superfície física ShapeCanvas em CirculoAreasStage; montagem, corte/encaixe e rearranjo de setores usam ações por toque amplo, sem primitiva paralela nem precisão de arrasto como evidência conceitual.",
  },
  {
    primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64", "media-chance-f83", "estatistica-chance-f95", "linguagem-letras-f89", "soma-fracoes-f74", "razao-proporcao-f88"],
    componentFiles: [component("SingaporeBars"), component("SingaporeBarsStage"), component("StoryBarsStage"), component("PartesIguaisStage"), component("FracaoNumeroStage"), component("FracoesEquivalentesStage"), component("PorcentagemStage"), component("JornalTurmaStage"), component("MediaChanceStage"), component("EstatisticaChanceStage"), component("LinguagemLetrasStage"), component("SomaFracoesStage"), component("RazaoProporcaoStage")],
    builderKinds: ["storypanel"], specializedBuilderIds: ["N5.01", "N5.02", "N5.03", "N5.04", "N6.03", "N6.04", "PE.02", "PE.03", "PE.04", "AL.07"], rendererKinds: ["singapore-bars", "story-bars", "partes-iguais-f45", "fracao-numero-f72", "fracoes-equivalentes-f73", "porcentagem-f87", "jornal-turma-f64", "media-chance-f83", "estatistica-chance-f95", "linguagem-letras-f89", "soma-fracoes-f74", "razao-proporcao-f88"],
    note: "W15/F45, W16/F72 e W18/F73 reutilizam SingaporeBars; F73 compara barras de mesmo comprimento. W22/F87 compõe Quadrado100 + SingaporeBars. W25/F64 realiza o modo vertical em JornalTurmaStage; não cria primitiva nova. W31/F83 realiza média e chance em MediaChanceStage, preservando SingaporeBars como primitiva autoral. W49/F95/PE.04 cresce o mesmo alfabeto em EstatisticaChanceStage e o compõe com ArrayGrid: favoráveis e total continuam legíveis como barras, enquanto a grade enumera combinações sem abstração paralela. W38/F89 compõe SingaporeBars + plain para ligar quantidade visível e regra algébrica geral. W44/F74/N5.04 reutiliza SingaporeFractionBar como tanque de partes de tamanho fixo: soma/subtração alteram a quantidade de partes sem alterar o denominador; fração imprópria usa mais de uma barra e simplificação reapresenta a mesma quantidade em partições equivalentes, sem pré-renderizar o resultado. W45/F88/N6.04 reutiliza SingaporeBars por SingaporeLinkedScaleBars em RazaoProporcaoStage: um único fator deriva simultaneamente as duas barras; não há controle independente por lado e o par escalado só aparece depois da decisão.",
  },
  { primitive: "StoryPanel", kinds: ["story", "scene", "storypanel", "story-bars"], componentFiles: [component("StoryPanel"), component("StoryPanelStage"), component("StoryBarsStage")], builderKinds: ["storypanel"], rendererKinds: ["story-bars"], note: "N3.10/F20 compõe StoryPanel + SingaporeBars." },
  { primitive: "TenFrame", kinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], componentFiles: [component("TenFrame"), component("MolduraStage"), component("NumberBond"), component("MaterialDouradoStage")], builderKinds: ["tenframe", "moldura", "bond", "plain"], rendererKinds: ["tenframe", "moldura", "bond", "plain", "material-dourado"], note: "MaterialDouradoStage compõe MaterialDourado + TenFrame." },
  { primitive: "TouchCount", kinds: ["touchcount"], componentFiles: [component("TouchCount")], builderKinds: ["touchcount"], rendererKinds: ["touchcount"] },
  { primitive: "TouchPlace", kinds: ["touchplace"], componentFiles: [component("TouchPlace"), component("TouchPlaceStage")], builderKinds: ["touchplace"], rendererKinds: ["touchplace"] },
  { primitive: "VisualAddition", kinds: ["visual-addition", "visual-addition-f13", "subvis"], componentFiles: [component("VisualAddition"), component("VisualAdditionStage")], builderKinds: [], specializedBuilderIds: ["N3.01"], rendererKinds: ["visual-addition", "visual-addition-f13"] },
  { primitive: "plain", kinds: ["plain", "linguagem-letras-f89"], componentFiles: [component("LinguagemLetrasStage")], builtin: true, builderKinds: ["plain"], specializedBuilderIds: ["AL.07"], rendererKinds: ["plain", "linguagem-letras-f89"], note: "W38/F89 compõe SingaporeBars + plain; LinguagemLetrasStage mantém a expressão simbólica visível enquanto a barra concretiza a generalização." },
];
module.exports = { FICHA_RUNTIME_MAP };