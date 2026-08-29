import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F32 — DOBROS E QUASE-DOBROS. Âncoras de memória.
 *
 * `6 + 7` não se calcula: deduz-se de `6 + 6`. É a primeira vez no currículo
 * que a criança usa um fato que já sabe para descobrir outro que não sabe — o
 * começo do raciocínio aritmético.
 *
 * O que trava: ninguém ensina isso explicitamente. A criança decora `6 + 6` e
 * depois trata `6 + 7` como problema novo, contando tudo de novo. É o erro que
 * a ficha chama `NAO_USA_DOBRO`, e ele é **o alvo** — não um erro lateral.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §9 da F32, com todas as letras: *"no nível 3 ou acima, incluindo
 * quase-dobros. Só dobros não prova a estratégia."*
 *
 * Nos níveis 3 e 4 todo caso já é quase-dobro, então a exigência se cumpre
 * sozinha. É no L5, o único que mistura, que ela morde: sem isso a criança
 * poderia fechar o nível integrador com três dobros seguidos e receber a coroa
 * de "sabe deduzir" sem ter deduzido nada.
 */
const dominioMisto = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N3.06",
    "No nível que mistura, demonstrar as duas: um dobro e um quase-dobro. Só dobros não prova a estratégia.",
  ),
};

const tutorial = [
  { fala: "Olha: duas fileiras iguais.", show: { destacarFileiras: [1, 2] } },
  { fala: "Esse dobro você já sabe.", show: { numeral: "dobro" } },
  { fala: "E tem mais um aqui, fora do dobro.", show: { piscarExtra: true } },
  { fala: "O dobro e mais um: é essa a conta.", show: { numeral: "resposta" } },
];

export const N3_06: FichaCompetencia = {
  id: "N3.06",
  nome: "Dobros e Quase-Dobros",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N3.03"],

  howto: "O dobro você já sabe. Depois é só ajustar o que sobrou ou o que faltou.",
  explain: "Comece pelo dobro que você conhece. Depois some o que sobrou.",

  distratores: [
    { regra: "responde_o_dobro", tag: "ESQUECEU_O_EXTRA" },
    { regra: "dobro_errado_por_dois", tag: "DOBROU_ERRADO" },
  ],

  niveis: {
    1: { primitiva: "arraygrid", micro: "dobros-ate-cinco", andaime: "mao_fantasma" },
    2: { primitiva: "arraygrid", micro: "dobros-ate-dez", andaime: "alto" },
    3: { primitiva: "arraygrid", micro: "quase-dobro-com-apoio", andaime: "medio" },
    4: { primitiva: "arraygrid", micro: "quase-dobro-sem-apoio", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "misto", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    { id: "dobros-ate-cinco", fonte: "F32", alvo: "reconhecer dobros até cinco mais cinco pela simetria das duas fileiras", kinds: ["arraygrid"], params: { tutorial }, dominio },
    { id: "dobros-ate-dez", fonte: "F32", alvo: "recuperar dobros até dez mais dez como fato memorizado", kinds: ["arraygrid"], params: {}, dominio },
    { id: "quase-dobro-com-apoio", fonte: "F32", alvo: "deduzir o quase-dobro de mais um com o dobro escrito na tela", kinds: ["arraygrid"], params: {}, dominio },
    { id: "quase-dobro-sem-apoio", fonte: "F32", alvo: "deduzir quase-dobros de mais um e de menos um sem o dobro escrito", kinds: ["arraygrid"], params: {}, dominio },
    { id: "misto", fonte: "F32", alvo: "alternar dobros e quase-dobros reconhecendo qual é qual", kinds: ["arraygrid"], params: {}, dominio: dominioMisto },
  ],

  erros_tipicos: [
    { id: "esqueceu_o_extra", descricao: "Responde o dobro: usou a âncora e parou antes de ajustar." },
    { id: "nao_usa_dobro", descricao: "Conta tudo do início, sem aproveitar o dobro que já sabia. É o alvo da ficha." },
    { id: "dobrou_errado", descricao: "Erra o próprio dobro-âncora por dois: ele ainda não está memorizado." },
  ],
};
