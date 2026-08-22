import type { FichaCompetencia, FichaDominio } from "../../schema";
import { PrimosDivisoresMisconception } from "../../procedimentos/primosDivisoresContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorialQuadro = [
  { say: "No quadro, múltiplos são as casas onde chegamos repetindo o mesmo salto.", show: { foco: "Quadrado100", alfabetizarModo: "multiplos" }, sync: "junto" },
  { say: "O número de partida também é múltiplo dele mesmo.", show: { destacarPrimeiroMultiplo: true }, sync: "depois" },
];
const tutorialRetangulo = [
  { say: "Divisor é uma medida que cabe no número sem deixar sobra.", show: { foco: "ArrayGrid", alfabetizarModo: "divisores" }, sync: "junto" },
  { say: "Teste uma largura: se o retângulo fecha, essa largura é divisor.", show: { destacarSobra: true }, sync: "junto" },
  { say: "Um sempre divide qualquer número, mas um não é primo.", show: { destacarUm: true }, sync: "depois" },
];
const tutorialCrivo = [
  { say: "No crivo, preserve o primo e risque os múltiplos maiores dele.", show: { foco: "Quadrado100", alfabetizarModo: "crivo" }, sync: "junto" },
  { say: "Repita com o próximo número ainda não riscado.", show: { proximoNaoRiscado: true }, sync: "depois" },
];

/** F70 — divisor cabe sem sobra; múltiplo é onde o salto chega; primo tem exatamente dois divisores positivos. */
export const N4_11: FichaCompetencia = {
  id: "N4.11",
  nome: "Primos e Divisores",
  strand: "N4",
  faixa: "F3",
  prereqs: ["N4.07", "N4.10"],
  howto: "Divisor cabe dentro do número. Múltiplo é onde você chega pulando.",
  explain: "Tente montar retângulos. Quantos jeitos diferentes existem?",
  distratores: [
    { regra: "inverte a direção da relação e chama múltiplo de divisor ou divisor de múltiplo", tag: PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO },
    { regra: "esquece que 1 divide todos os números ou trata 1 como primo", tag: PrimosDivisoresMisconception.ESQUECE_UM },
    { regra: "classifica composto como primo ou usa ímpar como sinônimo de primo", tag: PrimosDivisoresMisconception.PRIMO_ERRADO },
  ],
  niveis: {
    1: { primitiva: "quadrado100", micro: "multiplos-quadro", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "divisores-retangulo", andaime: "alto" },
    3: { primitiva: "arraygrid", micro: "distinguir", andaime: "medio" },
    4: { primitiva: "arraygrid", micro: "identificar-primos", andaime: "minimo" },
    5: { primitiva: "quadrado100", micro: "crivo-eratostenes", andaime: "nenhum", rt_alvo: 18000 },
  },
  micros: [
    { id: "multiplos-quadro", fonte: "F70", alvo: "reconhecer múltiplos como destinos de saltos iguais no quadro de 100", kinds: ["quadrado100"], params: { modo: "multiplos-quadro", tutorial: tutorialQuadro }, dominio },
    { id: "divisores-retangulo", fonte: "F70", alvo: "reconhecer divisores pelas formações retangulares que fecham sem sobra", kinds: ["arraygrid"], params: { modo: "divisores-retangulo", tutorial: tutorialRetangulo }, dominio },
    { id: "distinguir", fonte: "F70", alvo: "distinguir causalmente divisor de múltiplo usando retângulo e saltos", kinds: ["arraygrid", "quadrado100"], params: { modo: "distinguir", tutorial: [...tutorialRetangulo, ...tutorialQuadro] }, dominio },
    { id: "identificar-primos", fonte: "F70", alvo: "identificar primo por ter exatamente dois divisores positivos, 1 e ele mesmo, sem confundir primo com ímpar", kinds: ["arraygrid"], params: { modo: "identificar-primos", tutorial: tutorialRetangulo }, dominio },
    { id: "crivo-eratostenes", fonte: "F70", alvo: "executar visualmente o Crivo de Eratóstenes riscando múltiplos no quadro de 100", kinds: ["quadrado100"], params: { modo: "crivo-eratostenes", tutorial: tutorialCrivo }, dominio },
  ],
  erros_tipicos: [
    { id: PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO, descricao: "Inverteu a relação: divisor cabe sem sobra; múltiplo é resultado de repetir o número." },
    { id: PrimosDivisoresMisconception.ESQUECE_UM, descricao: "Esqueceu o divisor 1 ou tratou 1 como primo, embora ele tenha apenas um divisor positivo." },
    { id: PrimosDivisoresMisconception.PRIMO_ERRADO, descricao: "Chamou composto de primo ou usou ímpar como critério, ignorando os divisores." },
  ],
};