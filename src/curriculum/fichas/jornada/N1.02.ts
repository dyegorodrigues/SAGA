import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F27 — O canhão de balões. O canto numérico vira ato.
 *
 * ---
 *
 * **O que a criança aprende:** a **sequência estável** — que os números vêm
 * sempre na mesma ordem e que cada um corresponde a **uma** ação.
 *
 * **Por que trava:** ela recita "um, dois, três, quatro" como quem canta, mas ao
 * contar objetos pula, repete ou não para. O problema não é a memória da
 * sequência — é a **sincronia entre falar e agir**.
 *
 * **Por que o canhão funciona:** cada disparo produz **exatamente um** estouro e
 * **exatamente um** número. Ela não conta olhando: conta **fazendo**, no tempo
 * certo. É contagem como ritmo motor, que é como ela realmente internaliza.
 *
 * ### ⚠️ A regra inviolável (§4)
 *
 * > **um disparo = um balão = um número.** Nunca dois balões num tiro.
 *
 * Dois balões num tiro quebrariam a correspondência um-a-um, que é o coração da
 * competência — e desfariam o N1.01, que acabou de ensiná-la.
 *
 * ### Por que não há teclado
 *
 * Esta competência é **oral**. O fecho não é uma pergunta de múltipla escolha: é
 * a voz repetindo a sequência inteira. Pôr teclado aqui trocaria contagem oral
 * por leitura de numeral, que é outra ficha (N1.06).
 *
 * ### O que esta versão corrigiu
 *
 * A ficha manda `TouchCount (modo rítmico)`. A primitiva não existia e o runtime
 * servia `emojirow`/`plain`. Faltavam o canhão, a regra um-tiro-um-balão, o
 * sumiço do numeral no nível 4 e — o mais importante — o **nível 5**, que é a
 * ponte para somar: continuar de um número dado, em vez de recomeçar do 1, é a
 * estratégia `counting-on`, pré-requisito da adição.
 */

const dominio = { acertos: 3, de: 3, sessoes: 2 };

/** A coreografia da F27 §8. No canhão, UM disparo já ensina o ritmo inteiro. */
const tutorial = [
  { fala: "Olha os balões!", show: { destacarGrupo: true } },
  { fala: "Vou estourar um.", show: { maoFantasma: 0 } },
  { fala: "UM!", show: { maoFantasma: 0, numeral: 1 } },
  { fala: "Agora você estoura!", show: { pulsarRestantes: true } },
];

export const N1_02: FichaCompetencia = {
  id: "N1.02",
  nome: "Canto numérico (sequência oral)",
  strand: "N1",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET07",
  // Sobe por automaticidade e ritmo, não por abstração: não existe "canto
  // numérico abstrato".
  excecaoCPA: "perceptual",

  howto: "Um tiro de cada vez. Fale o número junto comigo quando o balão estourar.",
  explain: "Cada tiro estoura um balão só. Conte devagar comigo.",
  distratores: [],

  niveis: {
    1: { primitiva: "touchcount", micro: "tres_com_mao", andaime: "mao_fantasma" },
    2: { primitiva: "touchcount", micro: "cinco_sozinha", andaime: "alto" },
    3: { primitiva: "touchcount", micro: "dez", andaime: "medio" },
    4: { primitiva: "touchcount", micro: "sem_numeral", andaime: "minimo" },
    5: { primitiva: "touchcount", micro: "continuar_de", andaime: "nenhum", rt_alvo: 20000 },
  },

  micros: [
    {
      id: "tres_com_mao",
      alvo: "sentir o ritmo: um disparo, um balão, um número",
      kinds: ["touchcount"],
      params: { modo: "ritmico", audio_prompt: "Estoure os balões contando junto!", tutorial },
      dominio,
    },
    {
      id: "cinco_sozinha",
      alvo: "manter o ritmo sozinha, até cinco",
      kinds: ["touchcount"],
      params: { modo: "ritmico", audio_prompt: "Estoure os balões contando junto!" },
      dominio,
    },
    {
      id: "dez",
      alvo: "sustentar a sequência quando o escopo dobra",
      kinds: ["touchcount"],
      params: { modo: "ritmico", audio_prompt: "Estoure os balões contando junto!" },
      dominio,
    },
    {
      id: "sem_numeral",
      alvo: "contar SEM o numeral escrito: a sequência fica só na voz e na cabeça",
      kinds: ["touchcount"],
      params: { modo: "ritmico", audio_prompt: "Agora sem os números na tela. Conte comigo!" },
      dominio,
    },
    {
      id: "continuar_de",
      alvo: "CONTINUAR de um número dado, sem recomeçar do 1 — a ponte para somar",
      kinds: ["touchcount"],
      params: { modo: "ritmico", audio_prompt: "Não comece do um! Continue de onde eu parei." },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.EXCESSO_ACAO, descricao: "Disparou mais vezes que havia balões: não monitora o que resta." },
    { id: MisconceptionTag.CONTAGEM_INCOMPLETA, descricao: "Parou antes de acabar: perdeu o fio ou o engajamento." },
    { id: MisconceptionTag.NAO_CONTA_A_PARTIR_DE, descricao: "Mandada continuar do 4, começou do 1: não desacoplou a sequência do início." },
  ],
};
