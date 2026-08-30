import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F56 — O CONTADOR DE ANIMAIS. Pictogramas e tabelas simples.
 *
 * É o começo da estatística: a primeira vez que a criança lê um dado **coletado
 * por outra pessoa**. Ela precisa confiar na representação e extrair informação
 * dela — coisa diferente de contar objetos que estão ali na frente.
 *
 * **O degrau escondido, e é onde quase todas erram:** quando um ícone
 * representa duas unidades. A criança conta os ícones e responde o número de
 * ícones, não a quantidade real. É a primeira noção de escala.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §9 da F56: o domínio precisa incluir um caso **com legenda de escala**.
 *
 * Vale no L5, que é o único que mistura as duas escalas. Nos níveis de escala
 * fixa não há o que diversificar — e no L4, onde a legenda é sempre dois, a
 * exigência se cumpre sozinha.
 *
 * Sem isso a criança fecharia a competência tendo lido só pictogramas
 * um-para-um, onde contar ícones e contar a quantidade dão o mesmo número por
 * acidente — e o acidente viraria a prova.
 */
const dominioComEscala = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "PE.01",
    "No nível que mistura, demonstrar as duas escalas: uma leitura um-para-um e uma com legenda de dois.",
  ),
};

const tutorial = [
  { fala: "Os bichinhos se organizam em linhas.", show: { coletar: true } },
  { fala: "Cada linha tem um nome à esquerda.", show: { acenderRotulos: true } },
  { fala: "Conte os desenhos da linha que a pergunta pede.", show: { acender: 0 } },
];

export const PE_01: FichaCompetencia = {
  id: "PE.01",
  nome: "O Contador de Animais",
  strand: "PE",
  faixa: "F1",
  prereqs: ["N1.04", "N1.05"],

  howto: "Ache a linha certa e conte os desenhos dela.",
  explain: "Olhe a legenda: cada desenho pode valer mais de um.",

  distratores: [
    { regra: "conta_icones_sem_legenda", tag: "IGNORA_ESCALA" },
    { regra: "le_a_linha_errada", tag: "LINHA_TROCADA" },
    { regra: "soma_em_vez_de_comparar", tag: "COMPARA_SOMANDO" },
  ],

  niveis: {
    1: { primitiva: "storypanel", micro: "ler-linha", andaime: "mao_fantasma" },
    2: { primitiva: "storypanel", micro: "comparar-linhas", andaime: "alto" },
    3: { primitiva: "storypanel", micro: "total", andaime: "medio" },
    4: { primitiva: "storypanel", micro: "com-legenda", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "construir", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    { id: "ler-linha", fonte: "F56", alvo: "achar a linha pelo rótulo e contar os desenhos dela", kinds: ["storypanel"], params: { tutorial }, dominio },
    { id: "comparar-linhas", fonte: "F56", alvo: "responder quantos a mais uma linha tem que outra", kinds: ["storypanel"], params: {}, dominio },
    { id: "total", fonte: "F56", alvo: "somar todas as linhas da tabela", kinds: ["storypanel"], params: {}, dominio },
    { id: "com-legenda", fonte: "F56", alvo: "aplicar a legenda em que cada desenho vale dois", kinds: ["storypanel"], params: {}, dominio },
    { id: "construir", fonte: "F56", alvo: "descobrir quantos desenhos a linha precisa ter a partir da quantidade dada", kinds: ["storypanel"], params: {}, dominio: dominioComEscala },
  ],

  erros_tipicos: [
    { id: "ignora_escala", descricao: "Conta os desenhos e ignora a legenda. É o erro do nível 4." },
    { id: "linha_trocada", descricao: "Lê a linha errada: não relaciona o rótulo com a fileira." },
    { id: "compara_somando", descricao: "Na comparação, soma as duas linhas em vez de achar a diferença." },
  ],
};
