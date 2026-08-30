import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F53 — O TESOURO DO PIRATA. Reconhecer e compor dinheiro.
 *
 * É a primeira vez no currículo em que a criança lida com **valor simbólico
 * atribuído**: a moeda de 50 centavos é menor que a de 25 no dinheiro de
 * verdade. O valor não se lê no tamanho — precisa ser reconhecido.
 *
 * **A composição é o coração:** entender que um real pode ser duas de 50, ou
 * quatro de 25, ou dez de 10 — é aqui que dinheiro vira matemática em vez de
 * memorização.
 *
 * A competência só abre depois de N3.09, somar até 100 sem reagrupar. A criança
 * chega aqui sabendo somar; o que ela ainda não sabe é atribuir valor.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §9 da F53: o domínio inclui um caso de **montagem de troco com moedas**.
 *
 * No L5, o único que mistura denominações livremente, isso vira a exigência de
 * duas famílias: um caso resolvido com uma denominação só e um com
 * denominações diferentes. Sem ela a criança fecharia o nível somando sempre
 * moedas iguais — que é o L2 outra vez, e não prova a estratégia de ordenar.
 */
const dominioMisturado = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "GM.03",
    "No nível misturado, demonstrar os dois casos: um com uma denominação só e um com denominações diferentes.",
  ),
};

const tutorial = [
  { fala: "Esta moeda vale cinquenta centavos.", show: { destacarMoeda: 50 } },
  { fala: "Esta vale vinte e cinco.", show: { destacarMoeda: 25 } },
  { fala: "Olhe o número escrito, não o tamanho da moeda.", show: { destacarNumero: true } },
];

export const GM_03: FichaCompetencia = {
  id: "GM.03",
  nome: "O Tesouro do Pirata",
  strand: "GM",
  faixa: "F1",
  prereqs: ["N2.01", "N3.09"],

  howto: "Comece pela moeda de maior valor e vá somando as menores.",
  explain: "Olhe o número escrito na moeda, não o tamanho dela.",

  distratores: [
    { regra: "conta_moedas_nao_valores", tag: "CONTA_MOEDAS" },
    { regra: "julga_pelo_tamanho", tag: "VALOR_PELO_TAMANHO" },
    { regra: "nao_compoe", tag: "SEM_EQUIVALENCIA" },
  ],

  niveis: {
    1: { primitiva: "grandeza", micro: "reconhecer", andaime: "mao_fantasma" },
    2: { primitiva: "grandeza", micro: "moedas-iguais", andaime: "alto" },
    3: { primitiva: "grandeza", micro: "duas-denominacoes", andaime: "medio" },
    4: { primitiva: "grandeza", micro: "compor-um-real", andaime: "minimo" },
    5: { primitiva: "grandeza", micro: "misturadas", andaime: "nenhum", rt_alvo: 20000 },
  },

  micros: [
    { id: "reconhecer", fonte: "F53", alvo: "reconhecer o valor de uma moeda pelo número gravado, não pelo tamanho", kinds: ["grandeza"], params: { tutorial }, dominio },
    { id: "moedas-iguais", fonte: "F53", alvo: "somar moedas de mesma denominação", kinds: ["grandeza"], params: {}, dominio },
    { id: "duas-denominacoes", fonte: "F53", alvo: "somar duas denominações de múltiplos compatíveis", kinds: ["grandeza"], params: {}, dominio },
    { id: "compor-um-real", fonte: "F53", alvo: "descobrir quanto falta para fechar um real", kinds: ["grandeza"], params: {}, dominio },
    { id: "misturadas", fonte: "F53", alvo: "somar denominações misturadas ordenando da maior para a menor", kinds: ["grandeza"], params: {}, dominio: dominioMisturado },
  ],

  erros_tipicos: [
    { id: "conta_moedas", descricao: "Conta moedas em vez de valores: três moedas viram três." },
    { id: "valor_pelo_tamanho", descricao: "Julga pelo tamanho da moeda. É o erro específico do dinheiro." },
    { id: "sem_ordenacao", descricao: "Soma fora de ordem e se perde no meio do caminho." },
    { id: "sem_equivalencia", descricao: "Não reconhece que quatro de 25 fazem um real." },
  ],
};
