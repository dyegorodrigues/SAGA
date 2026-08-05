import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

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

/** Critério de FLUÊNCIA, não de compreensão: velocidade e consistência. */
const dominio = { acertos: 8, de: 10, sessoes: 3 };

export const N4_03: FichaCompetencia = {
  id: "N4.03",
  nome: "Tabuadas do 2, 5 e 10",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N4.01"],
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
      dominio,
    },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.SOMA_OS_FATORES, descricao: "Somou os dois fatores em vez de multiplicar." },
    { id: MisconceptionTag.TABUADA_TROCADA, descricao: "Devolveu um múltiplo vizinho: memorizou a lista sem o padrão que a gera." },
  ],
};
