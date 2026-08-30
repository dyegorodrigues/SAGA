import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F34 — VOLTAR PELO DEZ. O espelho do fazer dez.
 *
 * `13 − 5` vira `13 − 3 − 2`, que vira `10 − 2`. A mesma estação intermediária
 * da F33, na direção contrária: quem domina fazer dez tem meio caminho andado.
 *
 * **O erro que esta ficha existe para pegar cedo:** a criança tenta tirar cinco
 * de três, na coluna das unidades, e trava — ou inverte e faz `5 − 3`. A ficha
 * canônica diz com todas as letras o que isso vira depois: o problema do
 * reagrupamento na conta armada. Pegá-lo aqui é pegá-lo anos antes.
 *
 * O domínio é o mesmo rigor da F33, pelo mesmo motivo.
 */
const dominio = { acertos: 4, de: 4, sessoes: 3 };

/**
 * Do L3 em diante a ficha traz de volta a escolha estratégica da F31: `13 − 8`
 * é mais fácil completando — do oito ao treze são cinco — do que voltando oito
 * passos.
 *
 * Sem exigir as duas famílias, a criança fecharia o nível tendo escolhido
 * sempre o mesmo caminho, e a coroa diria que ela avalia o custo. É a CLASS-008
 * outra vez, e o `ESTRATEGIA_INEFICIENTE` que a ficha nomeia.
 */
const dominioComEscolha = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N3.08",
    "Demonstrar os dois caminhos cruzando a dezena: um caso em que voltar é mais curto e um em que completar é mais curto.",
  ),
};

const tutorial = [
  { fala: "Temos treze.", show: { destacarTudo: true } },
  { fala: "Tire os que estão soltos, acima do dez.", show: { removerSoltos: 3 } },
  { fala: "Chegamos no dez!", show: { numeral: 10 } },
  { fala: "E ainda faltam tirar o resto: a caixa cheia se abre.", show: { abrirMoldura: true } },
];

export const N3_08: FichaCompetencia = {
  id: "N3.08",
  nome: "Voltar pelo Dez",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N3.07", "N3.04"],

  howto: "Tire primeiro os que estão soltos, até chegar no dez. Depois tire o resto.",
  explain: "Quantos você precisa tirar para chegar no dez? Comece por eles.",

  distratores: [
    { regra: "para_no_dez", tag: "PAROU_NO_DEZ" },
    { regra: "inverte_nas_unidades", tag: "SUBTRAI_INVERTIDO" },
  ],

  niveis: {
    1: {
      primitiva: "tenframe",
      micro: "subtraendo-pequeno",
      andaime: "mao_fantasma",
      acaoProbatoria: {
        id: "chegar-ao-dez",
        porque: "Tirar os soltos é o primeiro passo da estratégia. Aceitar o total antes dele deixa passar exatamente quem contou tudo para trás sem usar a estação do dez.",
      },
    },
    2: {
      primitiva: "tenframe",
      micro: "voltar-pelo-dez",
      andaime: "alto",
      acaoProbatoria: {
        id: "chegar-ao-dez",
        porque: "Com subtraendo maior, o segundo passo fica caro; chegar ao dez na tela é o que mostra onde o subtraendo se parte.",
      },
    },
    3: {
      primitiva: "tenframe",
      micro: "escolher-caminho",
      andaime: "medio",
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "Treze menos oito é mais curto completando. Avaliar o custo do caminho é a competência que este nível acrescenta, e sem registrar a escolha não há o que diagnosticar.",
      },
    },
    4: {
      primitiva: "tenframe",
      micro: "escolha-cobrada",
      andaime: "minimo",
      acaoProbatoria: {
        id: "escolher-caminho",
        porque: "Aqui o caminho longo já conta como estratégia ineficiente; a escolha precisa ser registrada para que o Radar a veja.",
      },
    },
    5: { primitiva: "tenframe", micro: "mental", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    { id: "subtraendo-pequeno", fonte: "F34", alvo: "voltar pelo dez quando sai pouco além dos soltos", kinds: ["tenframe"], params: { tutorial }, dominio },
    { id: "voltar-pelo-dez", fonte: "F34", alvo: "decompor o subtraendo para passar pela estação do dez", kinds: ["tenframe"], params: {}, dominio },
    { id: "escolher-caminho", fonte: "F34", alvo: "escolher entre voltar pelo dez e completar até o total", kinds: ["tenframe"], params: {}, dominio: dominioComEscolha },
    { id: "escolha-cobrada", fonte: "F34", alvo: "escolher o caminho curto sem as molduras", kinds: ["tenframe"], params: {}, dominio: dominioComEscolha },
    { id: "mental", fonte: "F34", alvo: "cruzar a dezena de cabeça", kinds: ["tenframe"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: "parou_no_dez", descricao: "Chegou ao dez e parou: esqueceu o segundo passo." },
    { id: "subtrai_invertido", descricao: "Inverte nas unidades. É o erro que depois vira o problema do reagrupamento." },
    { id: "nao_usa_o_dez", descricao: "Conta tudo para trás, sem usar a estação intermediária." },
    { id: "estrategia_ineficiente", descricao: "Escolhe voltar quando completar custaria menos passos." },
  ],
};
