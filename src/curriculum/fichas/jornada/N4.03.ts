import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F42 — Tabuadas Fáceis (×2, ×5, ×10). A ordem certa não é numérica, é por padrão.
 *
 * Ensinar ×1, ×2, ×3, ×4… em sequência desperdiça o fato de que ×2, ×5 e ×10 têm
 * regularidade óbvia e, juntas, cobrem 30 dos 100 fatos. Aprendendo essas três
 * primeiro, a criança ganha âncoras para deduzir as outras — três regras em vez
 * de trinta fatos soltos.
 *
 * A escada não cresce em números: ela **retira apoio**. Arranjo e quadro de 100
 * saem em degraus, até restar só o símbolo. O que se treina no fim é recuperar o
 * fato, não reconstruí-lo.
 */

/**
 * DECISAO-002 — a coroa da Jornada é de compreensão; a fluência é do Dojo.
 *
 * Esta ficha declarava `{ acertos: 8, de: 10, sessoes: 3 }` com a nota
 * "critério de FLUÊNCIA". A nota estava certa sobre o que o número é, e é
 * exatamente por isso que ele não podia estar aqui:
 *
 * - **§11.9 da Bíblia**: "Fluência (velocidade + precisão + força do Dojo) é
 *   estado paralelo e **NÃO participa da decisão da coroa**." A coroa sai de
 *   compreensão + independência + evidência autoral + sessões espaçadas.
 * - **§11.8**: "a fluência da tabuada acontece no Dojo (FD4→FD5), não na aula."
 * - **`DOJO_TRILHAS_COMPLETAS.md` §5.3**: "8 de 10 corretos em 2 rounds
 *   seguidos" é a regra de subida **do Dojo**, não da Jornada.
 * - A própria ficha canônica marca o nível 5 com formato **"Dojo"**, e diz que
 *   o critério é de rodada, "não de questão única".
 *
 * O número do Dojo tinha sido instalado como coroa da Academia. Isso não era só
 * incoerente no papel: uma missão da Jornada tem oito questões e a janela de
 * compreensão zera na virada do dia, então `de: 10` **nunca fechava** para quem
 * joga uma missão por dia. Medido pelo aprendiz sintético: zero coroas em todas
 * as rodadas com uma missão diária, todas as coroas com duas — uma cadência que
 * ficha nenhuma declara e tela nenhuma pede.
 *
 * O que a nova regra preserva, e o que ela devolve:
 *
 * - **A consistência que o autor queria**: 4 de 5 é 80%, a mesma proporção de
 *   8 de 10. Continua não bastando o acerto único.
 * - **A retenção**: `sessoes: 3` fica, porque retenção é dimensão conceitual
 *   pela §11.9, não fluência.
 * - **A fluência**: volta para onde o cânone a põe. O `dojo_mul` já treina
 *   exatamente estas escadas, e o `rt_alvo` do nível 5 continua sendo medido
 *   como metadado — sem nunca reprovar domínio conceitual.
 *
 * A invariante que faltava está trancada em `janelaDeDominioCabeNaMissao.test.ts`.
 */
const dominio = { acertos: 4, de: 5, sessoes: 3 };

/**
 * CLASS-008 — o nível integrador não coroa quem demonstrou uma família só.
 *
 * Os níveis 4 e 5 misturam as tabuadas do ×2, ×5 e ×10.
 * O gerador sorteia entre elas a cada tentativa, e a regra de domínio contava
 * apenas acertos, janela e sessões: dava para satisfazer o mastery inteiro sem
 * nunca sair de uma delas. A coroa dizia "integrou" sobre quem não integrou.
 */
const dominioIntegrador = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N4.03",
    "Acertar em pelo menos duas tabuadas diferentes.",
  ),
};

export const N4_03: FichaCompetencia = {
  id: "N4.03",
  nome: "Tabuadas do 2, 5 e 10",
  strand: "N4",
  faixa: "F2",
  // CLASS-002 — a ficha dizia menos pré-requisitos do que o DAG cobra.
  //
  // Quem tranca a porta é o DAG: é dele que `unlockEngine` e `rescuePlanner`
  // leem. O campo aqui é documentação, e documentação que discorda do que o app
  // faz é pior que documentação ausente — ela convence de uma coisa errada.
  prereqs: ["AL.03", "N4.01"],
  howto: "Conte de cinco em cinco, quatro vezes: cinco, dez, quinze, vinte.",
  explain: "Olhe o quadro: os múltiplos de cinco terminam sempre em zero ou cinco.",
  distratores: [
    { regra: "soma_os_fatores", tag: MisconceptionTag.SOMA_OS_FATORES },
    { regra: "tabuada_trocada", tag: MisconceptionTag.TABUADA_TROCADA },
  ],
  niveis: {
    1: { primitiva: "tabuada", micro: "dez", andaime: "alto" },
    2: { primitiva: "tabuada", micro: "cinco", andaime: "alto" },
    3: { primitiva: "tabuada", micro: "dois", andaime: "medio" },
    4: { primitiva: "tabuada", micro: "misturadas", andaime: "minimo" },
    5: { primitiva: "tabuada", micro: "misturadas", andaime: "nenhum", rt_alvo: 4000 },
  },
  micros: [
    {
      id: "dez",
      alvo: "reconhecer que os múltiplos de dez terminam em zero",
      kinds: ["tabuada"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "cinco",
      alvo: "reconhecer que os múltiplos de cinco terminam em zero ou cinco",
      kinds: ["tabuada"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "dois",
      alvo: "reconhecer que os múltiplos de dois são os números pares",
      kinds: ["tabuada"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "misturadas",
      alvo: "recuperar o fato sem apoio visual, nas três tabuadas",
      kinds: ["tabuada"],
      params: { audio_prompt: "Escute e responda." },
      dominio: dominioIntegrador,
    },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.SOMA_OS_FATORES, descricao: "Somou os dois fatores em vez de multiplicar." },
    { id: MisconceptionTag.TABUADA_TROCADA, descricao: "Devolveu um múltiplo vizinho: memorizou a lista sem o padrão que a gera." },
  ],
};
