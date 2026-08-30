import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F16 — FAMÍLIA DE FATOS. Um trio de números, quatro contas.
 *
 * Três, quatro e sete formam uma relação, e dela saem `3+4=7`, `4+3=7`,
 * `7−3=4` e `7−4=3`. **Isto reduz a carga pela metade:** quem entende a família
 * não precisa decorar subtração separadamente.
 *
 * O que trava é tratar adição e subtração como assuntos diferentes, aprendidos
 * em capítulos diferentes — o dobro do trabalho, e sem enxergar a ligação.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §9 da F16: *"no nível 3 ou acima, ou seja, incluindo pelo menos uma subtração
 * deduzida."*
 *
 * Sem isso a criança fecha o nível com três adições e recebe a coroa de "vê a
 * família" sem nunca ter deduzido nada — que é exatamente o `SEPARA_OPERACOES`
 * que a ficha nomeia como erro: acertar as somas e não ligar as subtrações.
 *
 * Vale do L3 em diante, que são os níveis onde o triângulo esconde às vezes o
 * todo e às vezes uma parte. Nos L1 e L2 só se pergunta o todo, e exigir as
 * duas famílias ali seria pedir uma subtração que o nível não apresenta.
 */
const dominioComSubtracao = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N3.05",
    "Demonstrar as duas direções da família: uma adição e uma subtração deduzida do mesmo trio.",
  ),
};

const tutorial = [
  { fala: "Olhe o triângulo: o de cima é o todo.", show: { pulsarTopo: true } },
  { fala: "Os de baixo são as partes.", show: { pulsarPartes: true } },
  { fala: "As partes juntas fazem o todo.", show: { acenderLinhas: true } },
];

export const N3_05: FichaCompetencia = {
  id: "N3.05",
  nome: "Família de Fatos",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N1.10", "N3.03", "N3.04"],

  howto: "As partes juntas fazem o todo. E tirando uma parte do todo, sobra a outra.",
  explain: "Olhe o triângulo: o de cima é o todo. Os de baixo são as partes.",

  distratores: [
    { regra: "responde_o_todo", tag: "RESPONDE_O_TODO" },
    { regra: "troca_as_partes", tag: "INVERTE_PARTES" },
  ],

  niveis: {
    1: { primitiva: "bond", micro: "somas-ate-cinco", andaime: "mao_fantasma" },
    2: { primitiva: "bond", micro: "somas-ate-dez", andaime: "alto" },
    3: { primitiva: "bond", micro: "soma-e-subtracao", andaime: "medio" },
    4: { primitiva: "bond", micro: "quatro-contas", andaime: "minimo" },
    5: { primitiva: "bond", micro: "descobrir-o-trio", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    { id: "somas-ate-cinco", fonte: "F16", alvo: "ler o triângulo e juntar as duas partes em totais até cinco", kinds: ["bond"], params: { tutorial }, dominio },
    { id: "somas-ate-dez", fonte: "F16", alvo: "juntar as partes em totais até dez", kinds: ["bond"], params: {}, dominio },
    { id: "soma-e-subtracao", fonte: "F16", alvo: "alternar entre juntar as partes e tirar uma delas do todo", kinds: ["bond"], params: {}, dominio: dominioComSubtracao },
    { id: "quatro-contas", fonte: "F16", alvo: "responder qualquer das quatro contas do mesmo trio, até vinte", kinds: ["bond"], params: {}, dominio: dominioComSubtracao },
    { id: "descobrir-o-trio", fonte: "F16", alvo: "recuperar o vértice que falta e reconhecer o trio inteiro", kinds: ["bond"], params: {}, dominio: dominioComSubtracao },
  ],

  erros_tipicos: [
    { id: "responde_o_todo", descricao: "Na subtração, responde o todo: não entendeu a direção da operação." },
    { id: "inverte_partes", descricao: "Troca as partes na subtração: responde 3 para 7 − 3." },
    { id: "nao_usa_familia", descricao: "Refaz a conta em vez de deduzir da relação. É o alvo da ficha." },
    { id: "separa_operacoes", descricao: "Acerta as somas e erra as subtrações: trata como assuntos diferentes." },
  ],
};
