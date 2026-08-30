import { FichaCompetencia } from "../../schema";

/**
 * F40 — A DEZENA DESMONTA. O espelho da adição com reagrupamento.
 *
 * Quando não há unidades suficientes para tirar, uma dezena pode ser desmontada
 * em dez unidades.
 *
 * **Por que é mais difícil que a adição:** ao somar, a criança junta e o
 * excesso é evidente. Ao subtrair, ela precisa **perceber a falta antes de
 * agir** — olhar 42−17 e reconhecer que 2 não dá para tirar 7.
 *
 * **O nível 5 traz o caso mais difícil da aritmética elementar:** emprestar de
 * uma coluna que tem zero exige encadear duas quebras. Por isso o zero no meio
 * é obrigatório ali, não sorteado.
 */
const dominio = { acertos: 4, de: 4, sessoes: 3 };

const tutorial = [
  { fala: "Nas unidades não dá para tirar.", show: { destacarFalta: true } },
  { fala: "Então desmonte uma dezena.", show: { quebrarDezena: true } },
  { fala: "Ela vira dez unidades.", show: { quebrarDezena: true } },
  { fala: "E a dezena que quebrou não está mais lá.", show: { pagarEmprestimo: true } },
];

export const N3_12: FichaCompetencia = {
  id: "N3.12",
  nome: "A Dezena Desmonta",
  strand: "N3",
  faixa: "F2",
  prereqs: ["N3.11", "N3.08"],

  howto: "Se não dá para tirar, desmonte uma dezena em dez unidades.",
  explain: "Olhe as unidades primeiro. Se faltar, quebre uma barra da coluna do lado.",

  distratores: [
    { regra: "inverte_as_unidades", tag: "SUBTRAI_INVERTIDO" },
    { regra: "quebra_sem_descontar", tag: "NAO_PAGA_EMPRESTIMO" },
    { regra: "trava_e_devolve_o_topo", tag: "NAO_OPEROU" },
  ],

  niveis: {
    1: { primitiva: "vertical", micro: "quebra-guiada", andaime: "mao_fantasma" },
    2: { primitiva: "vertical", micro: "crianca-quebra", andaime: "alto" },
    3: { primitiva: "vertical", micro: "duas-ordens-com-material", andaime: "medio" },
    4: { primitiva: "vertical", micro: "so-a-conta", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "zero-no-meio", andaime: "nenhum", rt_alvo: 20000 },
  },

  micros: [
    { id: "quebra-guiada", fonte: "F40", alvo: "ver a dezena ser desmontada numa subtração de dois por um algarismo", kinds: ["vertical"], params: { tutorial }, dominio },
    { id: "crianca-quebra", fonte: "F40", alvo: "desmontar a dezena sozinha, ainda com o material", kinds: ["vertical"], params: {}, dominio },
    { id: "duas-ordens-com-material", fonte: "F40", alvo: "subtrair dois por dois algarismos com o material ao lado da conta", kinds: ["vertical"], params: {}, dominio },
    { id: "so-a-conta", fonte: "F40", alvo: "subtrair com reagrupamento sem o material", kinds: ["vertical"], params: {}, dominio },
    { id: "zero-no-meio", fonte: "F40", alvo: "encadear duas quebras quando a coluna do meio é zero", kinds: ["vertical"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: "subtrai_invertido", descricao: "Faz 7−2 nas unidades: inverte para escapar do impasse. É o erro central." },
    { id: "nao_paga_emprestimo", descricao: "Quebra a dezena e não a desconta da coluna vizinha." },
    { id: "nao_operou", descricao: "Trava no impasse e devolve o próprio minuendo." },
  ],
};
