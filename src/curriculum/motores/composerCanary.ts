import { Composer } from "../Composer";
import { FichaCompetencia } from "../schema";
import { N1_01 } from "../fichas/jornada/N1.01"; import { N1_02 } from "../fichas/jornada/N1.02"; import { N1_03 } from "../fichas/jornada/N1.03"; import { N1_04 } from "../fichas/jornada/N1.04"; import { N1_05 } from "../fichas/jornada/N1.05"; import { N1_06 } from "../fichas/jornada/N1.06"; import { N1_07 } from "../fichas/jornada/N1.07"; import { N1_08 } from "../fichas/jornada/N1.08"; import { N1_09 } from "../fichas/jornada/N1.09"; import { N1_10 } from "../fichas/jornada/N1.10"; import { N1_11 } from "../fichas/jornada/N1.11"; import { N1_12 } from "../fichas/jornada/N1.12"; import { N1_13 } from "../fichas/jornada/N1.13";
import { N2_01 } from "../fichas/jornada/N2.01"; import { N2_02 } from "../fichas/jornada/N2.02"; import { N2_03 } from "../fichas/jornada/N2.03"; import { N2_06 } from "../fichas/jornada/N2.06"; import { N2_07 } from "../fichas/jornada/N2.07";
import { N3_01 } from "../fichas/jornada/N3.01"; import { N3_02 } from "../fichas/jornada/N3.02"; import { N3_03 } from "../fichas/jornada/N3.03"; import { N3_09 } from "../fichas/jornada/N3.09"; import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_01 } from "../fichas/jornada/N4.01"; import { N4_03 } from "../fichas/jornada/N4.03"; import { N4_04 } from "../fichas/jornada/N4.04"; import { N4_06 } from "../fichas/jornada/N4.06"; import { N4_07 } from "../fichas/jornada/N4.07"; import { N4_08 } from "../fichas/jornada/N4.08"; import { N4_09 } from "../fichas/jornada/N4.09"; import { N4_10 } from "../fichas/jornada/N4.10"; import { N4_11 } from "../fichas/jornada/N4.11"; import { N4_12 } from "../fichas/jornada/N4.12";
import { N5_01 } from "../fichas/jornada/N5.01"; import { N5_02 } from "../fichas/jornada/N5.02"; import { N5_03 } from "../fichas/jornada/N5.03"; import { N5_04 } from "../fichas/jornada/N5.04"; import { N6_01 } from "../fichas/jornada/N6.01"; import { N6_03 } from "../fichas/jornada/N6.03"; import { N6_04 } from "../fichas/jornada/N6.04"; import { N7_01 } from "../fichas/jornada/N7.01"; import { N7_02 } from "../fichas/jornada/N7.02";
import { AL_01 } from "../fichas/jornada/AL.01"; import { AL_02 } from "../fichas/jornada/AL.02"; import { AL_03 } from "../fichas/jornada/AL.03"; import { AL_04 } from "../fichas/jornada/AL.04"; import { AL_05 } from "../fichas/jornada/AL.05"; import { AL_06 } from "../fichas/jornada/AL.06"; import { AL_07 } from "../fichas/jornada/AL.07"; import { AL_08 } from "../fichas/jornada/AL.08";
import { GE_01 } from "../fichas/jornada/GE.01"; import { GE_02 } from "../fichas/jornada/GE.02"; import { GE_03 } from "../fichas/jornada/GE.03"; import { GE_04 } from "../fichas/jornada/GE.04"; import { GE_05 } from "../fichas/jornada/GE.05"; import { GE_06 } from "../fichas/jornada/GE.06"; import { GE_07 } from "../fichas/jornada/GE.07"; import { GE_08 } from "../fichas/jornada/GE.08"; import { GE_09 } from "../fichas/jornada/GE.09"; import { GE_10 } from "../fichas/jornada/GE.10";
import { GM_01 } from "../fichas/jornada/GM.01"; import { GM_02 } from "../fichas/jornada/GM.02"; import { GM_05 } from "../fichas/jornada/GM.05"; import { GM_06 } from "../fichas/jornada/GM.06"; import { GM_07 } from "../fichas/jornada/GM.07"; import { GM_08 } from "../fichas/jornada/GM.08"; import { GM_09 } from "../fichas/jornada/GM.09"; import { GM_10 } from "../fichas/jornada/GM.10"; import { GM_12 } from "../fichas/jornada/GM.12";
import { PE_02 } from "../fichas/jornada/PE.02"; import { PE_03 } from "../fichas/jornada/PE.03";
import { construirComparacaoQuantidadeQuestion } from "../procedimentos/comparacaoQuantidadeContract"; import { construirComparacaoSimbolicaQuestion } from "../procedimentos/comparacaoSimbolicaContract"; import { construirContagem20Question } from "../procedimentos/contagem20Contract"; import { construirReta20Question } from "../procedimentos/reta20Contract"; import { construirReguaQuestion } from "../procedimentos/reguaContract"; import { construirDezenaUnidadesQuestion } from "../procedimentos/materialDouradoContract"; import { construirQuadrado100Question } from "../procedimentos/quadrado100Contract"; import { construirTempoCotidianoQuestion } from "../procedimentos/tempoCotidianoContract"; import { construirVisualAdditionQuestion } from "../procedimentos/visualAdditionContract"; import { construirEmojiRowRiscarQuestion } from "../procedimentos/emojiRowRiscarContract"; import { construirCountingOnQuestion } from "../procedimentos/countingOnContract"; import { construirSkipCountF30Question } from "../procedimentos/skipCountContract"; import { construirEqualGroupsQuestion } from "../procedimentos/equalGroupsContract"; import { construirDetetiveFormasQuestion } from "../procedimentos/detetiveFormasContract"; import { construirSolidosGeometricosQuestion } from "../procedimentos/solidosGeometricosContract"; import { construirParesImparesQuestion } from "../procedimentos/paresImparesContract"; import { construirRegraSequenciaQuestion } from "../procedimentos/regraSequenciaContract"; import { construirPartesIguaisQuestion } from "../procedimentos/partesIguaisContract"; import { construirFracaoNumeroQuestion } from "../procedimentos/fracaoNumeroContract"; import { construirDecimalQuestion } from "../procedimentos/decimalContract"; import { construirPorcentagemQuestion } from "../procedimentos/porcentagemContract"; import { construirFracaoEquivalenteQuestion } from "../procedimentos/fracaoEquivalenteContract"; import { construirDivisaoLongaQuestion } from "../procedimentos/divisaoLongaContract"; import { construirPerimetroQuestion } from "../procedimentos/perimetroContract"; import { construirIgualdadeEquilibrioQuestion } from "../procedimentos/igualdadeEquilibrioContract"; import { construirAngulosQuestion } from "../procedimentos/angulosContract"; import { construirRetaCompletaQuestion } from "../procedimentos/retaCompletaContract"; import { construirOperarNegativosQuestion } from "../procedimentos/operarNegativosContract"; import { construirJornalTurmaQuestion } from "../procedimentos/jornalTurmaContract"; import { construirAreaF81Question } from "../procedimentos/areaF81Contract"; import { construirExpressaoF77Question } from "../procedimentos/expressaoF77Contract"; import { construirLinguagemLetrasQuestion } from "../procedimentos/linguagemLetrasContract"; import { construirMapaTesouroQuestion } from "../procedimentos/mapaTesouroContract"; import { construirMediaChanceQuestion } from "../procedimentos/mediaChanceContract"; import { construirProblemasMedidaQuestion } from "../procedimentos/problemasMedidaContract"; import { construirPoligonosQuestion } from "../procedimentos/poligonosContract"; import { construirPlanoCartesianoQuestion } from "../procedimentos/planoCartesianoContract"; import { construirHorasMinutosQuestion } from "../procedimentos/horasMinutosContract"; import { construirConversaoUnidadesQuestion } from "../procedimentos/conversaoUnidadesContract"; import { construirFatoresRetangulosQuestion } from "../procedimentos/fatoresRetangulosContract"; import { construirCirculoAreasQuestion } from "../procedimentos/circuloAreasContract"; import { construirVolumeVistasQuestion } from "../procedimentos/volumeVistasContract"; import { construirPrimosDivisoresQuestion } from "../procedimentos/primosDivisoresContract"; import { construirDivisaoDoisDigitosQuestion } from "../procedimentos/divisaoDoisDigitosContract"; import { construirSomaFracoesQuestion } from "../procedimentos/somaFracoesContract"; import { construirRazaoProporcaoQuestion } from "../procedimentos/razaoProporcaoContract"; import { construirEquacoesQuestion } from "../procedimentos/equacoesContract";
import { Question, Track } from "../../types";
import { DEFAULT_COMPOSER_CANARY_IDS } from "./composerCanaryIds";
type Generator=(level:number)=>Question; type SpecializedBuilder=(ficha:FichaCompetencia,level:number)=>Question; export type GeneratorSource=NonNullable<Track["generatorSource"]>;
const COMPOSER_FICHAS: Record<string, FichaCompetencia> = {
  "N3.01":N3_01,"N3.02":N3_02,"N3.03":N3_03,"N3.09":N3_09,"N3.10":N3_10,
  "N4.01":N4_01,"N4.03":N4_03,"N4.04":N4_04,"N4.06":N4_06,"N4.07":N4_07,"N4.08":N4_08,"N4.09":N4_09,"N4.10":N4_10,"N4.11":N4_11,"N4.12":N4_12,
  "N5.01":N5_01,"N5.02":N5_02,"N5.03":N5_03,"N5.04":N5_04,"N6.01":N6_01,"N6.03":N6_03,"N6.04":N6_04,"N7.01":N7_01,"N7.02":N7_02,
  "N1.01":N1_01,"N1.02":N1_02,"N1.03":N1_03,"N1.04":N1_04,"N1.05":N1_05,"N1.06":N1_06,"N1.07":N1_07,"N1.08":N1_08,"N1.09":N1_09,"N1.10":N1_10,"N1.11":N1_11,"N1.12":N1_12,"N1.13":N1_13,
  "N2.01":N2_01,"N2.02":N2_02,"N2.03":N2_03,"N2.06":N2_06,"N2.07":N2_07,
  "AL.01":AL_01,"AL.02":AL_02,"AL.03":AL_03,"AL.04":AL_04,"AL.05":AL_05,"AL.06":AL_06,"AL.07":AL_07,"AL.08":AL_08,
  "GE.01":GE_01,"GE.02":GE_02,"GE.03":GE_03,"GE.04":GE_04,"GE.05":GE_05,"GE.06":GE_06,"GE.07":GE_07,"GE.08":GE_08,"GE.09":GE_09,"GE.10":GE_10,
  "GM.01":GM_01,"GM.02":GM_02,"GM.05":GM_05,"GM.06":GM_06,"GM.07":GM_07,"GM.08":GM_08,"GM.09":GM_09,"GM.10":GM_10,"GM.12":GM_12,
  "PE.02":PE_02,"PE.03":PE_03,
};
const SPECIALIZED_BUILDERS: Partial<Record<string, SpecializedBuilder>> = {
  "N1.05": construirComparacaoQuantidadeQuestion,
  "N1.09": construirContagem20Question,
  "N1.12": construirReta20Question,
  "N2.01": construirDezenaUnidadesQuestion,
  "N2.02": construirQuadrado100Question,
  "N2.03": construirComparacaoSimbolicaQuestion,
  "N2.06": construirParesImparesQuestion,
  "N2.07": construirFatoresRetangulosQuestion,
  "N3.01": construirVisualAdditionQuestion,
  "N3.02": construirEmojiRowRiscarQuestion,
  "N3.03": construirCountingOnQuestion,
  "N4.01": construirEqualGroupsQuestion,
  "N4.10": construirDivisaoLongaQuestion,
  "N4.11": construirPrimosDivisoresQuestion,
  "N4.12": construirDivisaoDoisDigitosQuestion,
  "N5.01": construirPartesIguaisQuestion,
  "N5.02": construirFracaoNumeroQuestion,
  "N5.03": construirFracaoEquivalenteQuestion,
  "N5.04": construirSomaFracoesQuestion,
  "N6.01": construirDecimalQuestion,
  "N6.03": construirPorcentagemQuestion,
  "N6.04": construirRazaoProporcaoQuestion,
  "N7.01": construirRetaCompletaQuestion,
  "N7.02": construirOperarNegativosQuestion,
  "AL.03": construirSkipCountF30Question,
  "AL.04": construirRegraSequenciaQuestion,
  "AL.05": construirIgualdadeEquilibrioQuestion,
  "AL.06": construirExpressaoF77Question,
  "AL.07": construirLinguagemLetrasQuestion,
  "AL.08": construirEquacoesQuestion,
  "GE.03": construirDetetiveFormasQuestion,
  "GE.04": construirSolidosGeometricosQuestion,
  "GE.05": construirMapaTesouroQuestion,
  "GE.06": construirAngulosQuestion,
  "GE.07": construirPoligonosQuestion,
  "GE.08": construirPlanoCartesianoQuestion,
  "GE.09": construirCirculoAreasQuestion,
  "GE.10": construirVolumeVistasQuestion,
  "GM.02": construirTempoCotidianoQuestion,
  "GM.05": construirReguaQuestion,
  "GM.06": construirHorasMinutosQuestion,
  "GM.07": construirPerimetroQuestion,
  "GM.08": construirAreaF81Question,
  "GM.09": construirProblemasMedidaQuestion,
  "GM.10": construirConversaoUnidadesQuestion,
  "PE.02": construirJornalTurmaQuestion,
  "PE.03": construirMediaChanceQuestion,
};
const SPECIALIZED_RUNTIME_KIND:Partial<Record<string,string>>={"N1.12":"numberline-f19","N2.01":"material-dourado","N2.02":"quadrado100-f36","N2.03":"comparacao-simbolica","N2.07":"fatores-retangulos-f66","N3.01":"visual-addition-f13","N3.02":"emojirow-riscar-f15","N3.03":"counting-on-f14","N4.01":"equal-groups-f97","N4.10":"divisao-longa-f69","N4.11":"primos-divisores-f70","N4.12":"divisao-dois-digitos-f71","N5.01":"partes-iguais-f45","N5.02":"fracao-numero-f72","N5.03":"fracoes-equivalentes-f73","N5.04":"soma-fracoes-f74","N6.01":"decimos-centesimos-f75","N6.03":"porcentagem-f87","N6.04":"razao-proporcao-f88","N7.01":"reta-completa-f84","N7.02":"operar-negativos-f85","AL.03":"skip-count-f30","AL.04":"regra-sequencia-f57","AL.05":"igualdade-equilibrio-f46","AL.06":"expressao-f77","AL.07":"linguagem-letras-f89","AL.08":"equacoes-f90","GE.03":"detetive-formas-f58","GE.04":"solidos-geometricos-f59","GE.05":"mapa-tesouro-f60","GE.06":"angulos-f78","GE.07":"poligonos-f79","GE.08":"plano-cartesiano-f80","GE.09":"circulo-areas-f91","GE.10":"volume-vistas-f92","GM.05":"regua-f61","GM.06":"horas-minutos-f62","GM.07":"perimetro-f63","GM.08":"area-f81","GM.09":"problemas-medida-f82","GM.10":"conversao-unidades-f93","PE.02":"jornal-turma-f64","PE.03":"media-chance-f83"};
export function registeredFichaRuntimeKindOverride(id:string):string|undefined{return SPECIALIZED_RUNTIME_KIND[id]}
export const COMPOSER_CANARIES=new Set<string>(DEFAULT_COMPOSER_CANARY_IDS);
export interface GeneratorBinding{gen:Generator;source():GeneratorSource}
export function hasComposerFicha(id:string):boolean{return Object.prototype.hasOwnProperty.call(COMPOSER_FICHAS,id)}
export function generateRegisteredFichaQuestion(id:string,level:number):Question{const ficha=COMPOSER_FICHAS[id];if(!ficha)throw new Error(`Ficha Composer não registrada: ${id}.`);const specialized=SPECIALIZED_BUILDERS[id];return specialized?specialized(ficha,level):Composer.generate(ficha,level)}
function resolveSource(id:string,legacy:Generator|undefined):GeneratorSource{if(COMPOSER_CANARIES.has(id)&&hasComposerFicha(id))return"composer";return legacy?"legacy":"fallback"}
export function selectGenerator(id:string,legacy:Generator|undefined,fallback:Generator):GeneratorBinding{return{gen:level=>{switch(resolveSource(id,legacy)){case"composer":return generateRegisteredFichaQuestion(id,level);case"legacy":return(legacy as Generator)(level);default:return fallback(level)}},source:()=>resolveSource(id,legacy)}}
export function enableComposerCanary(id:string):void{if(!hasComposerFicha(id))throw new Error(`Canário inválido para ${id}: registre a ficha autoral em COMPOSER_FICHAS antes de ativar.`);COMPOSER_CANARIES.add(id)}
export function rollbackComposerCanary(id:string):void{COMPOSER_CANARIES.delete(id)}
