import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F65 — NÚMEROS GRANDES. Ler até milhares e arredondar com critério.
 *
 * **Arredondar é competência, não truque:** é decidir qual precisão importa, e
 * é a base da estimativa, da checagem de resultado e do senso numérico.
 *
 * **A regra que faz sentido visual:** na reta, arredondar é ver de qual marca o
 * número está mais perto. O "cinco arredonda para cima" deixa de ser arbitrário
 * quando a criança vê que ali está exatamente no meio — e que subir é
 * convenção, não distância.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * O caso do meio exato precisa aparecer, e por isso é exigido.
 *
 * Quem só praticou números claramente mais perto de uma das marcas nunca
 * encontrou a convenção do cinco — e é justamente nela que o
 * `ARREDONDA_SEMPRE_BAIXO` aparece, porque nos outros casos a distância já
 * decide e o erro fica escondido atrás do acerto.
 *
 * Vale nos três níveis que arredondam um número. O L4 pergunta precisão e o L5
 * pede estimativa: nenhum dos dois coloca a criança diante do empate.
 */
const dominioComOMeio = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N2.05",
    "Demonstrar os dois casos da reta: um número claramente mais perto de uma marca e um bem no meio, onde a convenção decide.",
  ),
};

const tutorial = [
  { fala: "Olhe as duas marcas ao redor do número.", show: { destacarMarcas: true } },
  { fala: "De qual delas ele está mais perto?", show: { medirDistancia: true } },
  { fala: "Quando fica bem no meio, a regra manda subir.", show: { destacarMeio: true } },
];

export const N2_05: FichaCompetencia = {
  id: "N2.05",
  nome: "Números Grandes",
  strand: "N2",
  faixa: "F3",
  prereqs: ["N2.04"],

  howto: "Veja de qual marca o número está mais perto na reta.",
  explain: "Olhe as duas marcas ao redor. Qual está mais perto?",

  distratores: [
    { regra: "sempre_para_baixo", tag: "ARREDONDA_SEMPRE_BAIXO" },
    { regra: "nao_mede_a_distancia", tag: "IGNORA_DISTANCIA" },
    { regra: "arredonda_na_ordem_errada", tag: "ORDEM_ERRADA" },
  ],

  niveis: {
    1: { primitiva: "numberline", micro: "dezena", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "centena", andaime: "alto" },
    3: { primitiva: "numberline", micro: "milhar", andaime: "medio" },
    4: { primitiva: "numberline", micro: "escolher-precisao", andaime: "minimo" },
    5: { primitiva: "numberline", micro: "estimar-operacao", andaime: "nenhum", rt_alvo: 20000 },
  },

  micros: [
    { id: "dezena", fonte: "F65", alvo: "arredondar para a dezena mais próxima olhando a reta", kinds: ["numberline"], params: { tutorial }, dominio: dominioComOMeio },
    { id: "centena", fonte: "F65", alvo: "arredondar para a centena mais próxima", kinds: ["numberline"], params: {}, dominio: dominioComOMeio },
    { id: "milhar", fonte: "F65", alvo: "arredondar para o milhar mais próximo", kinds: ["numberline"], params: {}, dominio: dominioComOMeio },
    { id: "escolher-precisao", fonte: "F65", alvo: "decidir para qual ordem arredondar faz sentido", kinds: ["numberline"], params: {}, dominio },
    // O L5 carrega a exigência porque é a regra do L5 que a coroa lê: o motor
    // decide o domínio com a regra da questão na tela, e só a consulta quando o
    // progresso já está no último nível. Declarada apenas nos níveis que
    // sorteiam as famílias, ela ficava escrita e nunca era cobrada — medido: a
    // coroa saía para quem demonstrou uma família só.
    { id: "estimar-operacao", fonte: "F65", alvo: "estimar uma soma arredondando as duas parcelas", kinds: ["numberline"], params: {}, dominio: dominioComOMeio },
  ],

  erros_tipicos: [
    { id: "arredonda_sempre_baixo", descricao: "Corta os dígitos e desce sempre, sem olhar a distância." },
    { id: "ignora_distancia", descricao: "Vai para a marca errada apesar de o número estar mais perto da outra." },
    { id: "ordem_errada", descricao: "Arredonda para a ordem errada: dá a centena quando se pedia o milhar." },
  ],
};
