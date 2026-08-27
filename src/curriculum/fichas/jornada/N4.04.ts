import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F43 — Tabuadas do 3 e do 4. Dobrar e dobrar de novo.
 *
 * **Nenhuma tabuada nova, só combinação.** Quem sabe ×2 já sabe ×4 (dobra de
 * novo) e quase sabe ×3 (dobro mais um grupo). Ensinar as duas como fatos
 * independentes desperdiça a base que a criança já tem — e é por isso que
 * costuma travar: ninguém ensina a decomposição.
 *
 * A escada troca a FORMA do apoio em vez de só retirá-lo: arranjo que duplica,
 * depois decomposição escrita, depois a outra estratégia, depois nada.
 */

/** Critério de FLUÊNCIA: velocidade e consistência, não acerto único. */
const dominio = { acertos: 8, de: 10, sessoes: 3 };

/**
 * CLASS-008 — o nível integrador não coroa quem demonstrou uma família só.
 *
 * Os níveis 4 e 5 misturam as tabuadas que se decompõem com as que já
 * estavam dominadas.
 * O gerador sorteia entre elas a cada tentativa, e a regra de domínio contava
 * apenas acertos, janela e sessões: dava para satisfazer o mastery inteiro sem
 * nunca sair de uma delas. A coroa dizia "integrou" sobre quem não integrou.
 */
const dominioIntegrador = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N4.04",
    "Acertar em pelo menos duas tabuadas diferentes.",
  ),
};

export const N4_04: FichaCompetencia = {
  id: "N4.04",
  nome: "Tabuadas do 3 e do 4",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N4.03"],
  howto: "Quatro é o dobro de dois. Faça o dobro e dobre de novo.",
  explain: "Comece pelo dobro que você já sabe. Depois dobre esse resultado.",
  distratores: [
    { regra: "parou_no_dobro", tag: MisconceptionTag.PAROU_NO_DOBRO },
    { regra: "trocou_estrategia", tag: MisconceptionTag.TROCOU_ESTRATEGIA },
    { regra: "soma_os_fatores", tag: MisconceptionTag.SOMA_OS_FATORES },
  ],
  niveis: {
    1: { primitiva: "decomposicao", micro: "quatro_arranjo", andaime: "alto" },
    2: { primitiva: "decomposicao", micro: "quatro_escrito", andaime: "alto" },
    3: { primitiva: "decomposicao", micro: "tres_arranjo", andaime: "medio" },
    4: { primitiva: "decomposicao", micro: "misturadas", andaime: "minimo" },
    5: { primitiva: "decomposicao", micro: "fluencia", andaime: "nenhum", rt_alvo: 5000 },
  },
  micros: [
    {
      id: "quatro_arranjo",
      alvo: "ver o ×4 como o dobro do dobro, com o arranjo à vista",
      kinds: ["decomposicao"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "quatro_escrito",
      alvo: "completar a decomposição do ×4 a partir da âncora escrita",
      kinds: ["decomposicao"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "tres_arranjo",
      alvo: "ver o ×3 como o dobro mais um grupo",
      kinds: ["decomposicao"],
      params: { audio_prompt: "Escute e responda." },
      dominio,
    },
    {
      id: "misturadas",
      alvo: "escolher a estratégia certa entre ×3 e ×4, sem apoio",
      kinds: ["decomposicao"],
      params: { audio_prompt: "Escute e responda." },
      dominio: dominioIntegrador,
    },
    {
      id: "fluencia",
      alvo: "recuperar o fato em ×2, ×3, ×4, ×5 e ×10, venha ele de padrão ou de decomposição",
      kinds: ["decomposicao"],
      params: { audio_prompt: "Escute e responda." },
      dominio: dominioIntegrador,
    },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.PAROU_NO_DOBRO, descricao: "Dobrou uma vez e parou, sem completar a estratégia." },
    { id: MisconceptionTag.TROCOU_ESTRATEGIA, descricao: "Aplicou a estratégia da outra tabuada." },
    { id: MisconceptionTag.SOMA_OS_FATORES, descricao: "Somou os dois fatores em vez de multiplicar." },
  ],
};
