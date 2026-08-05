import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F01 — Contar tocando. Onde o número deixa de ser palavra e vira quantidade.
 *
 * ---
 *
 * **O marco cognitivo mais importante da matemática inicial.** A criança conta
 * "um, dois, três" apontando certo e, quando você pergunta *"quantos são?"*, ela
 * **conta de novo**. Ainda não sabe que o "três" respondeu à pergunta — para ela
 * o "três" foi o nome do último objeto, não a quantidade do conjunto.
 *
 * **Por que o toque resolve:** o dedo marca o que já passou. Sem isso a criança
 * de 4 anos perde o fio — reconta o mesmo, pula outro. O toque é o **andaime
 * motor** que sustenta o raciocínio até ele virar mental, e o nível 5 o retira.
 *
 * ### O que esta versão corrigiu
 *
 * A ficha F01 manda `TouchCount`. A primitiva **não existia**, e o runtime
 * servia `emojirow`/`tenframe`/`plain`: a criança olhava uma fileira e escolhia
 * um número. Ou seja, o app entregava exatamente a conduta que esta ficha existe
 * para superar, com o nome da certa. Faltava tudo o que a F01 pede:
 *
 * - **o toque como ato** — não havia gesto nenhum, só escolha de alternativa
 * - **o numeral como produto do ato** (§4, regra inviolável nº 3)
 * - **a escada de arranjo** fila → grade → disperso (§5)
 * - **o desmame do nível 5**, sem marcação de cor
 * - **`NAO_TEM_CARDINALIDADE`**, o marco — nenhum dos três erros declarados
 *   antes correspondia a ele
 *
 * Ver `AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md` §5.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * A coreografia da F01 §8, aplicada ao nível 1.
 *
 * **As falas são neutras de tema.** A cena sorteia dinossauros, peixinhos ou
 * estrelas; um passo que dissesse "olha os dinossauros" ficaria errado na maioria
 * das vezes.
 *
 * A Mão Fantasma toca **dois** e para. Um só mostraria o numeral aparecendo;
 * dois mostram que ele **avança** — que é o assunto da ficha. Três já contariam
 * a cena inteira por ela.
 */
const tutorial = [
  { fala: "Vamos contar juntos.", show: { destacarGrupo: true } },
  { fala: "UM.", show: { maoFantasma: 0, numeral: 1 } },
  { fala: "DOIS.", show: { maoFantasma: 1, numeral: 2 } },
  { fala: "Agora você conta!", show: { pulsarRestantes: true } },
];

export const N1_04: FichaCompetencia = {
  id: "N1.04",
  nome: "Contar tocando (cardinalidade)",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.01", "N1.02"],
  bncc: "EI03ET07",

  howto: "Toque um de cada vez. Quando tocar, fale o número comigo.",
  // Aponta o caminho sem entregar o número. E não elogia.
  explain: "Toque devagar, um por um. Os que já brilharam, você já contou.",
  // Ficha de PRODUÇÃO: o diagnóstico vem da ação — de quantos alvos ela marcou e
  // de ela ter voltado a contar para responder —, não de alternativas fabricadas.
  distratores: [],

  niveis: {
    1: { primitiva: "touchcount", micro: "fila_com_mao", andaime: "mao_fantasma" },
    2: { primitiva: "touchcount", micro: "fila_sozinha", andaime: "alto" },
    3: { primitiva: "touchcount", micro: "grade", andaime: "medio" },
    4: { primitiva: "touchcount", micro: "disperso", andaime: "minimo" },
    5: { primitiva: "touchcount", micro: "sem_marcacao", andaime: "nenhum", rt_alvo: 15000 },
  },

  micros: [
    {
      id: "fila_com_mao",
      alvo: "aprender o gesto: um toque, um número — com a Mão Fantasma começando",
      kinds: ["touchcount"],
      params: { modo: "toque", audio_prompt: "Conte comigo, toque em cada um.", tutorial },
      dominio,
    },
    {
      id: "fila_sozinha",
      alvo: "contar sozinha em fila e responder quantos foram",
      kinds: ["touchcount"],
      params: { modo: "toque", audio_prompt: "Conte e me diga quantos foram." },
      dominio,
    },
    {
      id: "grade",
      alvo: "contar em linhas e colunas, sem perder o fio",
      kinds: ["touchcount"],
      params: { modo: "toque", audio_prompt: "Conte e me diga quantos foram." },
      dominio,
    },
    {
      id: "disperso",
      alvo: "contar sem apoio espacial — o degrau que exige estratégia",
      kinds: ["touchcount"],
      params: { modo: "toque", audio_prompt: "Eles estão espalhados. Conte todos." },
      dominio,
    },
    {
      id: "sem_marcacao",
      alvo: "contar SEM o objeto mudar de cor: segurar mentalmente quais já contou",
      kinds: ["touchcount"],
      params: { modo: "toque", audio_prompt: "Agora sem pista. Conte com atenção." },
      // A F01 §9 pede uma regra extra: pelo menos um acerto no arranjo disperso.
      // Contar em fila não prova cardinalidade — prova que ela segue um caminho.
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.NAO_TEM_CARDINALIDADE, descricao: "Contou tudo e recontou para responder: o último número não respondeu à pergunta." },
    { id: MisconceptionTag.RECONTOU, descricao: "Contou o mesmo objeto duas vezes: o dedo não marcou o que já passou." },
    { id: MisconceptionTag.PULOU, descricao: "Perdeu um objeto pelo caminho: o fio se rompeu no arranjo difícil." },
    { id: MisconceptionTag.DEPENDE_DE_ORDEM, descricao: "Acerta em fila e erra no disperso: conta só com apoio espacial." },
  ],
};
