import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F99 — REPARTIR E MEDIR. Os dois rostos da divisão.
 *
 * `12 ÷ 3` responde a duas perguntas diferentes, e a criança precisa reconhecer
 * as duas:
 *
 * - **partição** — 12 doces para 3 crianças: sabe-se quantos GRUPOS, descobre-se
 *   o TAMANHO de cada um;
 * - **medida** — 12 doces em sacos de 3: sabe-se o TAMANHO, descobre-se quantos
 *   GRUPOS.
 *
 * **O alvo da ficha é o `SO_UM_SENTIDO`:** acertar partição e errar medida,
 * porque só se conhece um rosto. Por isso o L4 pede que ela identifique qual é
 * antes de resolver — resolver sozinho não distingue quem reconheceu de quem
 * resolveu tudo como partição e acertou metade por sorte.
 *
 * **O L5 é o mais importante:** *"12 crianças, vans de 5 — quantas vans?"*
 * precisa de três vans, não "duas e sobra dois". O contexto decide o que fazer
 * com o resto, e é essa decisão que o nível mede.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * Os níveis que alternam entre os dois sentidos precisam demonstrar os dois.
 * É a CLASS-008 aplicada ao alvo da própria ficha: sem a exigência, quem só
 * conhece partição fecha o nível com três partições e recebe a coroa de "sabe
 * os dois rostos".
 */
const dominioComOsDoisSentidos = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N4.05",
    "Demonstrar os dois rostos da divisão: um problema de partição e um de medida.",
  ),
};

const tutorial = [
  { fala: "Doze maçãs para repartir.", show: { total: 12 } },
  { fala: "Sei quantos grupos: são três cestas.", show: { distribuir: true } },
  { fala: "O que descubro é quanto cabe em cada uma.", show: { agrupar: true } },
];

export const N4_05: FichaCompetencia = {
  id: "N4.05",
  nome: "Repartir e Medir",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N4.01", "N3.02"],

  howto: "Veja o que a pergunta já conta: quantos grupos, ou o tamanho de cada grupo.",
  explain: "Se você sabe quantos grupos, descobre o tamanho. Se sabe o tamanho, descobre quantos grupos.",

  distratores: [
    { regra: "distribui_desigual", tag: "DIVISAO_DESIGUAL" },
    { regra: "nao_fixa_o_divisor", tag: "IGNORA_TAMANHO" },
    { regra: "responde_o_resto", tag: "CONFUNDE_RESTO" },
  ],

  niveis: {
    1: { primitiva: "draggroup", micro: "particao", andaime: "mao_fantasma" },
    2: { primitiva: "draggroup", micro: "medida", andaime: "alto" },
    3: { primitiva: "draggroup", micro: "alternando", andaime: "medio" },
    4: {
      primitiva: "draggroup",
      micro: "identificar",
      andaime: "minimo",
      acaoProbatoria: {
        id: "identificar-o-sentido",
        porque: "O alvo da ficha é quem só conhece um rosto da divisão. Resolver sem declarar o sentido deixa esse erro invisível: quem trata tudo como partição acerta metade por sorte e ninguém fica sabendo.",
      },
    },
    5: { primitiva: "draggroup", micro: "resto-decide", andaime: "nenhum", rt_alvo: 25000 },
  },

  micros: [
    { id: "particao", fonte: "F99", alvo: "repartir igualmente entre um número conhecido de grupos", kinds: ["draggroup"], params: { tutorial }, dominio },
    { id: "medida", fonte: "F99", alvo: "descobrir quantos grupos de tamanho conhecido cabem no total", kinds: ["draggroup"], params: {}, dominio },
    { id: "alternando", fonte: "F99", alvo: "alternar entre os dois sentidos da divisão", kinds: ["draggroup"], params: {}, dominio: dominioComOsDoisSentidos },
    { id: "identificar", fonte: "F99", alvo: "reconhecer qual sentido a pergunta pede antes de resolver", kinds: ["draggroup"], params: {}, dominio: dominioComOsDoisSentidos },
    // O L5 carrega a exigência porque é a regra do L5 que a coroa lê: o motor
    // decide o domínio com a regra da questão na tela, e só a consulta quando o
    // progresso já está no último nível. Declarada apenas nos níveis que
    // sorteiam as famílias, ela ficava escrita e nunca era cobrada — medido: a
    // coroa saía para quem demonstrou uma família só.
    { id: "resto-decide", fonte: "F99", alvo: "decidir o que fazer com o resto conforme o contexto pede", kinds: ["draggroup"], params: {}, dominio: dominioComOsDoisSentidos },
  ],

  erros_tipicos: [
    { id: "divisao_desigual", descricao: "Distribui desigual e aceita: não entende o 'igualmente'." },
    { id: "ignora_tamanho", descricao: "Na medida, forma grupos de tamanho errado: não fixou o divisor." },
    { id: "confunde_resto", descricao: "Responde o resto em vez do quociente." },
    { id: "so_um_sentido", descricao: "Acerta partição e erra medida. É o alvo da ficha: só conhece um rosto." },
  ],
};
