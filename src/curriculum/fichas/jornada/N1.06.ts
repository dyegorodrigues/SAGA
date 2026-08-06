import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/audioChoiceProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F05 — Ouvir e escolher. *O único exercício que uma criança que não lê nada
 * consegue fazer sozinha.*
 *
 * ---
 *
 * **O que a criança aprende (§2):** ligar o **som** do número (*"três"*) ao
 * **símbolo escrito** (`3`).
 *
 * **Por que trava:** são dois sistemas separados na cabeça dela. Sabe recitar
 * *"um, dois, três"* e vê rabiscos na tela — mas a ponte não é automática. Ela
 * pode contar até 10 perfeitamente e não reconhecer o `7` escrito.
 *
 * **Por que este formato é obrigatório no SAGA:**
 *
 * > *"É o **único** exercício do app onde a pergunta não depende de leitura.
 * > Sem ele, uma criança de 4 anos precisa de um adulto ao lado para tudo. Com
 * > ele, ela joga sozinha."*
 *
 * ---
 *
 * ### O que esta versão corrigiu, e era o pior defeito que encontrei
 *
 * O `gN1_06` **escrevia o número por extenso na tela**:
 *
 * ```ts
 * big: "🔊 " + words[ans].toUpperCase()    // "🔊 TRÊS"
 * ```
 *
 * A única competência do app que existe para **não** depender de leitura era
 * resolvida **lendo**. Quem reconhece a palavra escrita acerta sem ouvir nada;
 * quem não lê fica sem a informação que a tela prometeu dar pelo ouvido. Para
 * as duas crianças, o exercício mede o oposto do que a ficha pede.
 *
 * E a primitiva que a ficha nomeia — `AudioChoice` — **existia no código e não
 * estava ligada a lugar nenhum**: nem `case` no Composer, nem no renderer.
 * Pronta, órfã, enquanto a competência dela servia texto.
 *
 * Terceiro achado, menor e da mesma família: o botão era **âmbar**, e a §7
 * manda a voz dizer *"aperte o botão **azul**"*. A fala prometia uma cor que a
 * tela não tinha — e cor é como uma criança de 4 anos acha o alvo.
 *
 * ### A escada da §5
 *
 * | Nível | Escopo | Opções | O que muda |
 * |---|---|---|---|
 * | 1 | 1 a 3 | 2 | números bem distintos **no som** |
 * | 2 | 1 a 5 | 3 | entram os vizinhos |
 * | 3 | 1 a 10 | 3 | o escopo dobra |
 * | 4 | 1 a 10 | 4 | **pares confundíveis** — *"seis"* e *"sete"* |
 * | 5 | 1 a 20 | 4 | a voz fala **mais rápido** |
 *
 * > *"O nível 4 é onde mora a dificuldade real: distinguir 'seis' de 'sete' no
 * > som exige atenção fonológica, não só numérica."*
 */

/**
 * §9: 3 de 3 em 2 sessões — **e a regra extra**: pelo menos um acerto **na
 * primeira audição**, sem repetir.
 *
 * *"Acertar depois de ouvir cinco vezes não prova reconhecimento."* É por isso
 * que o palco conta as repetições e a tag `PRECISA_REPETICAO` existe.
 */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  /** §9: *"acertar depois de ouvir cinco vezes não prova reconhecimento"*. */
  exige: {
    evidencia: Evidencia.PRIMEIRA_AUDICAO,
    descricao: "Acertar ouvindo uma vez só, sem pedir de novo.",
  },
};

/** §8, transcrita. */
const coreografia = [
  { fala: "Aperte aqui pra escutar.", show: { pulsar: "botaoSom" } },
  { fala: "TRÊS.", show: { ondasSonoras: true } },
  { fala: "Agora ache o três.", show: { pulsarOpcoes: true } },
];

export const N1_06: FichaCompetencia = {
  id: "N1.06",
  nome: "Ouvir e escolher o numeral",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.02", "N1.04"],
  bncc: "EI03ET07",

  howto: FALAS.howto,
  explain: FALAS.explain,

  distratores: [
    { regra: "n+1", tag: MisconceptionTag.CONFUNDE_VIZINHO },
    { regra: "n-1", tag: MisconceptionTag.CONFUNDE_VIZINHO },
  ],

  // A escada cresce em ESCOPO e em DISCRIMINAÇÃO — não em quantidade de coisas
  // na tela. A tela é sempre a mesma: um botão e alguns numerais (§3).
  niveis: {
    1: { primitiva: "audiochoice", micro: "distintos", andaime: "mao_fantasma" },
    2: { primitiva: "audiochoice", micro: "vizinhos", andaime: "alto" },
    3: { primitiva: "audiochoice", micro: "ate_dez", andaime: "medio" },
    4: { primitiva: "audiochoice", micro: "fonologico", andaime: "minimo" },
    5: { primitiva: "audiochoice", micro: "rapido", andaime: "nenhum", rt_alvo: 6000 },
  },

  micros: [
    {
      id: "distintos",
      fonte: "F05",
      alvo: "ligar o som ao símbolo, com números que não se parecem no som",
      kinds: ["audiochoice"],
      params: { audio_prompt: FALAS.audioPrompt, tutorial: coreografia },
      dominio,
    },
    {
      id: "vizinhos",
      fonte: "F05",
      alvo: "distinguir vizinhos: o símbolo tem de ser reconhecido, não deduzido",
      kinds: ["audiochoice"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "ate_dez",
      fonte: "F05",
      alvo: "o escopo dobra: dez símbolos, e nenhum apoio de contagem",
      kinds: ["audiochoice"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "fonologico",
      fonte: "F05",
      alvo: "'seis' e 'sete' — atenção fonológica, que é a dificuldade real desta ficha",
      kinds: ["audiochoice"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
    {
      id: "rapido",
      fonte: "F05",
      alvo: "até vinte, e a voz mais rápida: o reconhecimento virando automático",
      kinds: ["audiochoice"],
      params: { audio_prompt: FALAS.audioPrompt },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.CONFUNDE_VIZINHO, descricao: "Ouviu certo e não reconhece o símbolo." },
    { id: MisconceptionTag.CONFUSAO_FONOLOGICA, descricao: "Não distinguiu o som: 'seis' e 'sete', 'três' e 'treze'." },
    { id: MisconceptionTag.NAO_ESCUTOU, descricao: "Escolheu a primeira opção sem apertar o botão." },
    { id: MisconceptionTag.PRECISA_REPETICAO, descricao: "Acerta ouvindo várias vezes: o reconhecimento ainda não é automático." },
  ],
};
