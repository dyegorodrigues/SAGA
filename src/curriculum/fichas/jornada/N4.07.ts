import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";
import { exigirFamiliasDistintas } from "../../procedimentos/familiaIntegradora";

/**
 * F44 — Tabuadas do 6 ao 9. As difíceis; com estratégia, viram poucas.
 *
 * Quem sabe ×2, ×3, ×4, ×5 e ×10, e entende comutatividade, tem **10 fatos
 * genuinamente novos**: 6×6, 6×7, 6×8, 6×9, 7×7, 7×8, 7×9, 8×8, 8×9, 9×9. O
 * resto já está dominado por outro caminho.
 *
 * As quatro estratégias têm a MESMA forma — partir de um fato fácil e ajustar:
 * ×9 é dez menos um grupo, ×6 é cinco mais um grupo, ×7 é cinco mais dois, ×8 é
 * o dobro do quatro.
 */

const dominio = { acertos: 8, de: 10, sessoes: 3 };

/**
 * CLASS-008 — o nível integrador não coroa quem demonstrou uma família só.
 *
 * Os níveis 4 e 5 misturam as tabuadas difíceis — ×6, ×7, ×8 e ×9 — e
 * depois o conjunto completo.
 * O gerador sorteia entre elas a cada tentativa, e a regra de domínio contava
 * apenas acertos, janela e sessões: dava para satisfazer o mastery inteiro sem
 * nunca sair de uma delas. A coroa dizia "integrou" sobre quem não integrou.
 */
const dominioIntegrador = {
  ...dominio,
  evidenciasDistintas: exigirFamiliasDistintas(
    "N4.07",
    "Acertar em pelo menos duas tabuadas diferentes.",
  ),
};

export const N4_07: FichaCompetencia = {
  id: "N4.07",
  nome: "Tabuadas do 6 ao 9",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N4.04"],
  howto: "Nove é quase dez. Faça sete vezes dez e tire um sete.",
  explain: "Comece pelo fato fácil que você sabe. Depois ajuste.",
  distratores: [
    { regra: "parou_na_ancora", tag: MisconceptionTag.PAROU_NA_ANCORA },
    { regra: "direcao_errada", tag: MisconceptionTag.DIRECAO_ERRADA },
    { regra: "tabuada_trocada", tag: MisconceptionTag.TABUADA_TROCADA },
  ],
  niveis: {
    1: { primitiva: "ancora", micro: "nove", andaime: "alto" },
    2: { primitiva: "ancora", micro: "seis", andaime: "alto" },
    3: { primitiva: "ancora", micro: "oito", andaime: "medio" },
    4: { primitiva: "ancora", micro: "dificeis", andaime: "minimo" },
    5: { primitiva: "ancora", micro: "completa", andaime: "nenhum", rt_alvo: 5000 },
  },
  micros: [
    { id: "nove", alvo: "resolver o ×9 como dez menos um grupo", kinds: ["ancora"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "seis", alvo: "resolver o ×6 como cinco mais um grupo", kinds: ["ancora"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "oito", alvo: "resolver o ×8 como o dobro do quatro", kinds: ["ancora"], params: { audio_prompt: "Escute e responda." }, dominio },
    { id: "dificeis", alvo: "escolher a estratégia certa entre as quatro, sem apoio", kinds: ["ancora"], params: { audio_prompt: "Escute e responda." }, dominio: dominioIntegrador },
    { id: "completa", alvo: "recuperar qualquer fato da tabuada completa", kinds: ["ancora"], params: { audio_prompt: "Escute e responda." }, dominio: dominioIntegrador },
  ],
  erros_tipicos: [
    { id: MisconceptionTag.PAROU_NA_ANCORA, descricao: "Devolveu o fato fácil sem fazer o ajuste." },
    { id: MisconceptionTag.DIRECAO_ERRADA, descricao: "Ajustou para o lado errado: somou onde era tirar, ou o contrário." },
    { id: MisconceptionTag.TABUADA_TROCADA, descricao: "Devolveu um múltiplo vizinho, memorizando sem estratégia." },
  ],
};
