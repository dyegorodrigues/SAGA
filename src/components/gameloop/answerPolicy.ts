import { diagnosticar as diagnosticarPareamento } from "../../curriculum/procedimentos/pareamentoProcedure";
import { AcaoDeClassificacao, diagnosticar as diagnosticarClassificacao, evidenciasDe as evidenciasDaClassificacao } from "../../curriculum/procedimentos/classificacaoProcedure";
import { AcaoDeProducao, diagnosticar as diagnosticarProducao } from "../../curriculum/procedimentos/producaoProcedure";
import { AcaoDePosicao, diagnosticar as diagnosticarPosicao } from "../../curriculum/procedimentos/posicaoProcedure";
import { AcaoDeForma, diagnosticar as diagnosticarForma } from "../../curriculum/procedimentos/formaProcedure";
import { AcaoDeGrandeza, diagnosticar as diagnosticarGrandeza, evidenciasDe as evidenciasDaGrandeza } from "../../curriculum/procedimentos/grandezaProcedure";
import { AcaoDeContagem, evidenciasDe as evidenciasDaContagem } from "../../curriculum/procedimentos/touchCountProcedure";
import { AcaoDaMoldura, diagnosticar as diagnosticarMoldura, evidenciasDe as evidenciasDaMoldura } from "../../curriculum/procedimentos/tenFrameProcedure";
import { RespostaOuvidaRuntime, diagnosticarAudioChoiceRuntime, evidenciasAudioChoiceRuntime } from "../../curriculum/procedimentos/audioChoiceRuntime";
import { AcaoDeProducao as AcaoP, evidenciasDe as evidenciasDaProducao } from "../../curriculum/procedimentos/producaoProcedure";
import { AcaoDeForma as AcaoF, evidenciasDe as evidenciasDaForma } from "../../curriculum/procedimentos/formaProcedure";
import { classificarErro, podeGerarDiagnostico } from "../../curriculum/procedimentos/filtroMotor";
import { prepareAulaSourceForAnswer } from "../../curriculum/motores/aulaProgressContext";
import { recordSenseiDojoAttempt } from "../../curriculum/motores/senseiDojoProgressContext";
import { prepareMatriculaForAnswer } from "../../utils/matricula";
import { AnswerMeta, Question } from "../../types";
import { bundleMisconceptions } from "./misconceptionBundle";

type ProducaoComHistorico = AcaoDeProducao & { diagnosticosLongitudinais?: string[] };
const AUTORIAIS = new Set(["material-dourado","numberline-f19","quadrado100-f36","skip-count-f30","equal-groups-f97","detetive-formas-f58","regra-sequencia-f57","partes-iguais-f45","fracao-numero-f72","decimos-centesimos-f75","fracoes-equivalentes-f73","divisao-longa-f69","perimetro-f63","igualdade-equilibrio-f46","soma-fracoes-f74","razao-proporcao-f88","equacoes-f90","contas-virgula-f76"]);

export function isMotorSlip(meta?: AnswerMeta): boolean { return meta?.manipulacao !== undefined && classificarErro(meta.manipulacao) === "motor"; }
export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  if (value === "__timeout__") return false;
  if (isMotorSlip(meta)) return true;
  if (AUTORIAIS.has(q.kind as string) || q.kind === "regua-f61") return true;
  return Boolean(q.options || q.groups || meta?.source);
}
function isFormaQuestion(q: Question): boolean { return q.kind === "shapecanvas" && q.uiProps != null && typeof q.uiProps === "object" && "opcoes" in q.uiProps; }
function isPosicaoQuestion(q: Question): boolean { return q.kind === "shapecanvas" && q.uiProps != null && typeof q.uiProps === "object" && "referencial" in q.uiProps && !("opcoes" in q.uiProps); }
export function ownsAuthorialRetry(q: Question, meta?: AnswerMeta): boolean {
  return AUTORIAIS.has(q.kind as string) || q.kind === "counting-on-f14"
    || (q.kind === "regua-f61" && meta?.source === "medidas") || (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined) || (isPosicaoQuestion(q) && meta?.posicao !== undefined)
    || (isFormaQuestion(q) && meta?.forma !== undefined) || (q.kind === "grandeza" && meta?.grandeza !== undefined)
    || (q.kind === "medidas" && meta?.source === "medidas");
}
export function ownsAuthorialFeedback(q: Question, meta?: AnswerMeta): boolean {
  return AUTORIAIS.has(q.kind as string)
    || (q.kind === "regua-f61" && meta?.source === "medidas") || (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined) || (isPosicaoQuestion(q) && meta?.posicao !== undefined)
    || (isFormaQuestion(q) && meta?.forma !== undefined) || (q.kind === "grandeza" && meta?.grandeza !== undefined)
    || (q.kind === "medidas" && meta?.source === "medidas");
}
export function authorialFeedbackHoldMs(q: Question, meta?: AnswerMeta): number {
  if (q.kind === "material-dourado") return 3000;
  if (q.kind === "quadrado100-f36") return 2200;
  if (["numberline-f19","skip-count-f30","equal-groups-f97","detetive-formas-f58","regra-sequencia-f57","partes-iguais-f45","fracao-numero-f72","decimos-centesimos-f75","fracoes-equivalentes-f73","divisao-longa-f69","perimetro-f63","igualdade-equilibrio-f46","soma-fracoes-f74","razao-proporcao-f88","equacoes-f90","contas-virgula-f76"].includes(q.kind as string)) return 1800;
  if (q.kind === "regua-f61" && meta?.source === "medidas") return 2600;
  if (isPosicaoQuestion(q) && meta?.posicao !== undefined) return 3300;
  if (isFormaQuestion(q) && meta?.forma !== undefined) return 3700;
  if (q.kind === "grandeza" && meta?.grandeza !== undefined) return 3300;
  if (q.kind === "medidas" && meta?.source === "medidas") return 3300;
  return 1500;
}
export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
  prepareAulaSourceForAnswer(q); recordSenseiDojoAttempt(q); prepareMatriculaForAnswer(q);
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;
  if (meta?.audiochoice) return diagnosticarAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime);
  if (meta?.pareamento && q.uiProps && "receptores" in q.uiProps) {
    const cena = { receptores: (q.uiProps as { receptores: { quantidade: number } }).receptores.quantidade, itens: (q.uiProps as { itens: { quantidade: number } }).itens.quantidade };
    const daAcao = diagnosticarPareamento(meta.pareamento, cena); if (daAcao) return daAcao;
  }
  if (meta?.classificacao) { const v=diagnosticarClassificacao(meta.classificacao as AcaoDeClassificacao); if(v) return v; }
  if (meta?.touchplace) { const acao=meta.touchplace as ProducaoComHistorico; const v=bundleMisconceptions([diagnosticarProducao(acao),...(acao.diagnosticosLongitudinais??[])]); if(v) return v; }
  if (meta?.posicao) { const v=diagnosticarPosicao(meta.posicao as AcaoDePosicao); if(v) return v; }
  if (meta?.forma) { const v=diagnosticarForma(meta.forma as AcaoDeForma); if(v) return v; }
  if (meta?.grandeza) { const v=diagnosticarGrandeza(meta.grandeza as AcaoDeGrandeza); if(v) return v; }
  if (meta?.moldura) { const v=diagnosticarMoldura(meta.moldura as AcaoDaMoldura); if(v) return v; }
  const pickedOption=q.options?.find(option=>option.value===value);
  return pickedOption?.misconception ? pickedOption.tag || pickedOption.misconception : meta?.misconception;
}
/**
 * Palcos que desenham as próprias alternativas — a casca não pode desenhá-las
 * de novo.
 *
 * O defeito original: `pareamento` e `touchcount` mostravam a resposta duas
 * vezes, o teclado do palco e a barra da casca embaixo. Pior que feio: a barra
 * deixava responder sem contar e sem distribuir, que é a única coisa que essas
 * duas fichas medem.
 *
 * Foi corrigido escrevendo dois nomes aqui, e a lista ficou para trás. Quando a
 * frente de reparo da CLASS-007 fechou as alternativas DENTRO dos palcos —
 * prisma construído em `volume-prismas-f94`, transformação feita em
 * `circulo-areas-f91`, experimento rodado em `solidos-geometricos-f59` — a
 * barra de fora continuou aberta e continuou vendendo o acerto. O portão do
 * palco virava enfeite: a criança encontrava o mesmo rótulo logo abaixo.
 *
 * Esta lista não é o detector. O detector é `portaDeFora.test.tsx`, que
 * renderiza a casca inteira e reprova quando o rótulo da resposta aparece em
 * dois botões. Esquecer de listar um palco novo não abre mais um buraco
 * silencioso: abre um teste vermelho que nomeia o `kind`.
 */
export const PALCOS_QUE_RESPONDEM = new Set([
  "pareamento","touchcount","fileira","classificacao","audiochoice","touchplace","shapecanvas","grandeza","comparacao-simbolica","medidas","moldura","material-dourado",
  "numberline-f19","regua-f61","quadrado100-f36","visual-addition-f13","emojirow-riscar-f15","counting-on-f14","skip-count-f30","equal-groups-f97","detetive-formas-f58","regra-sequencia-f57","partes-iguais-f45","fracao-numero-f72","decimos-centesimos-f75","fracoes-equivalentes-f73","divisao-longa-f69","perimetro-f63","igualdade-equilibrio-f46","soma-fracoes-f74","razao-proporcao-f88","equacoes-f90","contas-virgula-f76",
  // Medidos pela varredura da CLASS-007: o palco já desenha a alternativa e a
  // fecha até a ação da ficha acontecer.
  "poligonos-f79","solidos-geometricos-f59","circulo-areas-f91","volume-prismas-f94","fatores-retangulos-f66",
  // GE.10/F92: o palco desenha as alternativas em L1, L2 e L4, e em L3 e L5 a
  // criança constrói e desenha. Ali a barra da casca era pura porta dos fundos
  // — e ainda por cima com o rótulo "Construção que reproduz as três vistas",
  // que dizia estar certo. Tocar nele pulava a reconstrução inteira.
  "volume-vistas-f92",
  // N4.12/F71: o palco é produção no InteractiveVertical — estimar, testar,
  // confirmar. Os `options` da questão são nomes de erro para o Radar, e a
  // barra da casca os desenhava como alternativas: "quociente ajustado" estava
  // num botão e acertava os cinco níveis para sempre, sem nenhuma estimativa.
  "divisao-dois-digitos-f71",
  // N2.06/F38 desenha "Par" e "Ímpar" no próprio palco. A exclusão logo abaixo
  // fala de `drag-group`, com hífen — o kind desta ficha é `draggroup`, sem —,
  // então a barra da casca vinha desenhando o mesmo par de botões por fora.
  "draggroup",
  // CLASS-010, medida por comportamento: em cada um destes o palco JÁ desenha
  // as alternativas, e a barra da casca desenhava as mesmas por baixo. Não era
  // só feio — eram dois caminhos para o mesmo acerto, e o de baixo não conhecia
  // portão, cena nem manipulação. A varredura clicou botão por botão e contou
  // dois que vendiam o acerto em todos os cinco níveis destes palcos.
  "primos-divisores-f70", "multiplicar-fracoes-f86", "porcentagem-f87",
  "reta-completa-f84", "operar-negativos-f85", "expressao-f77", "voltar-contando-f31", "dobros-f32", "fazer-dez-f33", "familia-aditiva-f16", "voltar-pelo-dez-f34", "pictograma-f56", "dinheiro-f53", "centena-f37", "repartir-medir-f99", "numeros-grandes-f65", "dezena-desmonta-f40", "calculo-mental-f41",
  "linguagem-letras-f89", "mapa-tesouro-f60", "angulos-f78",
  "plano-cartesiano-f80", "horas-minutos-f62", "area-f81",
  "problemas-medida-f82", "conversao-unidades-f93", "jornal-turma-f64",
  "media-chance-f83", "estatistica-chance-f95",
]);
export function shouldRenderQuestionOptions(q: Question): boolean { return Boolean(q.options) && q.kind !== "vertical" && q.kind !== "numberline-interactive" && q.kind !== "drag-group" && q.kind !== "array" && !PALCOS_QUE_RESPONDEM.has(q.kind as string); }
/**
 * Tudo o que a tentativa CERTA provou, para o motor de maestria.
 *
 * A questão é obrigatória, e não por capricho de assinatura: é dela que sai a
 * `evidenciaDeFamilia` da CLASS-008 — qual das famílias do nível integrador
 * esta tentativa exercitou. Deixá-la opcional era o convite a esquecê-la no
 * único lugar que chama esta função, e aí o requisito de diversidade viaja até
 * o motor sem nunca receber uma família para contar: a coroa não chegaria
 * nunca, o que é o defeito espelhado do que a classe veio corrigir.
 */
export function evidenciasDaResposta(meta: AnswerMeta | undefined, question: Question): string[] {
  const achadas:string[]=[];
  if (question.evidenciaDeFamilia) achadas.push(question.evidenciaDeFamilia);
  if (!meta) return achadas;
  if(meta.classificacao) achadas.push(...evidenciasDaClassificacao(meta.classificacao as AcaoDeClassificacao));
  if(meta.touchcount) achadas.push(...evidenciasDaContagem(meta.touchcount as AcaoDeContagem));
  if(meta.audiochoice) achadas.push(...evidenciasAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime));
  if(meta.touchplace) achadas.push(...evidenciasDaProducao(meta.touchplace as AcaoP));
  if(meta.forma) achadas.push(...evidenciasDaForma(meta.forma as AcaoF));
  if(meta.grandeza) achadas.push(...evidenciasDaGrandeza(meta.grandeza as AcaoDeGrandeza));
  if(meta.moldura) achadas.push(...evidenciasDaMoldura(meta.moldura as AcaoDaMoldura));
  if(meta.evidencias) achadas.push(...meta.evidencias);
  return [...new Set(achadas)];
}
