import { FichaCompetencia, FichaDominio } from "../../schema";
import { MediaChanceMisconception } from "../../procedimentos/mediaChanceContract";

const dominio: FichaDominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorialMedia = [
  { fala: "Estas torres têm alturas diferentes.", show: { destacarTorres: true } },
  { fala: "Tire um bloco de uma torre alta e coloque numa baixa.", show: { moverBloco: true } },
  { fala: "Quando todas ficam niveladas, a altura comum é a média.", show: { linhaMedia: true } },
];
const tutorialChance = [
  { fala: "Conte primeiro quantas bolas existem no total.", show: { destacarTotal: true } },
  { fala: "Agora conte quantas têm a característica pedida.", show: { destacarFavoraveis: true } },
  { fala: "Escreva favoráveis sobre o total.", show: { montarFracao: true } },
];

export const PE_03: FichaCompetencia = {
  id: "PE.03",
  nome: "Média e Chance",
  strand: "PE",
  faixa: "F3",
  prereqs: ["PE.02", "N4.10", "N5.02"],
  howto: "Na média, redistribua sem criar nem perder blocos. Na chance, compare os casos favoráveis com o total.",
  explain: "Média é a altura que todos teriam se o total fosse repartido igualmente. Chance é uma parte do total escrita como fração.",
  distratores: [
    { regra: "aceita uma média fora do intervalo mostrado", tag: MediaChanceMisconception.MEDIA_IMPOSSIVEL },
    { regra: "soma os valores mas esquece de dividir pela quantidade", tag: MediaChanceMisconception.ESQUECEU_DIVIDIR },
    { regra: "usa só os casos favoráveis e ignora o total", tag: MediaChanceMisconception.IGNORA_TOTAL },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "nivelar-3", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "nivelar-5", andaime: "medio" },
    3: { primitiva: "storypanel", micro: "calcular-media", andaime: "minimo" },
    4: { primitiva: "storypanel", micro: "chance-fracao", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "comparar-chances", andaime: "nenhum" },
  },
  micros: [
    { id: "nivelar-3", fonte: "F83", alvo: "nivelar três torres preservando o total", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial: tutorialMedia }, dominio },
    { id: "nivelar-5", fonte: "F83", alvo: "nivelar quatro ou cinco torres com média inteira", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial: tutorialMedia }, dominio },
    { id: "calcular-media", fonte: "F83", alvo: "calcular média inteira depois de compreender a redistribuição", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial: tutorialMedia }, dominio },
    { id: "chance-fracao", fonte: "F83", alvo: "representar chance como fração dos casos favoráveis sobre o total e introduzir média entre inteiros", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial: tutorialChance, mediaFracionaria: true }, dominio },
    { id: "comparar-chances", fonte: "F83", alvo: "comparar chances com totais diferentes e reconhecer média que pode não aparecer nos dados", kinds: ["storypanel"], params: { suporte: "SingaporeBars", tutorial: tutorialChance, mediaFracionaria: true, mediaPodeNaoSerValor: true }, dominio },
  ],
  erros_tipicos: [
    { id: MediaChanceMisconception.MEDIA_IMPOSSIVEL, descricao: "Escolhe uma média incompatível com os valores observados." },
    { id: MediaChanceMisconception.ESQUECEU_DIVIDIR, descricao: "Soma os valores, mas não divide pela quantidade de valores." },
    { id: MediaChanceMisconception.IGNORA_TOTAL, descricao: "Conta os casos favoráveis, mas não usa o total como denominador." },
  ],
};
