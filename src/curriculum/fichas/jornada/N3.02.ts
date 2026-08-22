import { FichaCompetencia } from "../../schema";
import { EmojiRowRiscarMisconception } from "../../procedimentos/emojiRowRiscarSemantics";

/** F15 — Tirar Riscando. A retirada precisa ser executada antes de ser lida. */
export const N3_02: FichaCompetencia = {
  id: "N3.02",
  nome: "Subtração concreta até 10",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N3.01"],

  howto: "Conte só os que ficaram inteiros. Os riscados já foram embora.",
  explain: "A pergunta é quantos SOBRARAM. Conte só os objetos que não saíram.",
  distratores: [
    { regra: "responder quantos foram removidos", tag: EmojiRowRiscarMisconception.RESPONDE_O_REMOVIDO },
    { regra: "repetir o total original", tag: EmojiRowRiscarMisconception.RESPONDE_O_TODO },
    { regra: "errar o restante por uma unidade", tag: EmojiRowRiscarMisconception.OFF_BY_ONE },
    { regra: "somar total e removidos", tag: EmojiRowRiscarMisconception.SOMOU },
  ],

  niveis: {
    1: { primitiva: "emojirow", micro: "riscar_x_guiado", andaime: "mao_fantasma" },
    2: { primitiva: "emojirow", micro: "riscar_x", andaime: "alto" },
    3: { primitiva: "emojirow", micro: "riscar_fantasma", andaime: "minimo" },
    4: { primitiva: "emojirow", micro: "ler_pre_riscado", andaime: "nenhum" },
    // N3.02 destrava a faixa inicial de subtração em FD3; o alvo normativo de
    // FD3 é 4s. Relógio silencioso: fluência nunca reprova domínio conceitual.
    5: { primitiva: "emojirow", micro: "subtracao_simbolica", andaime: "nenhum", rt_alvo: 4000 },
  },

  micros: [
    {
      id: "riscar_x_guiado",
      fonte: "F15",
      alvo: "executar uma retirada concreta e distinguir o que saiu do que sobrou",
      kinds: ["emojirow"],
      params: {
        tutorial: [
          {
            fala: "Antes da conta: quando um objeto recebe X, ele saiu. O lugar fica para lembrar o todo.",
            show: { alfabetizarModo: "riscar", marcarIndice: 0 },
          },
          { fala: "Primeiro veja o todo inteiro.", show: { destacarTodos: true } },
          { fala: "Eu risco o primeiro. Ele continua no lugar, marcado como o que saiu.", show: { riscar: 0 } },
          { fala: "Agora é sua vez de tirar o que falta.", show: { pulsarRestantes: true } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "riscar_x",
      fonte: "F15",
      alvo: "riscar a quantidade pedida sem ajuda e contar apenas os objetos íntegros",
      kinds: ["emojirow"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "riscar_fantasma",
      fonte: "F15",
      alvo: "interpretar o contorno tracejado como ausência produzida pela retirada",
      kinds: ["emojirow"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "ler_pre_riscado",
      fonte: "F15",
      alvo: "ler uma retirada já representada e completar a equação sem executar o gesto",
      kinds: ["emojirow"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "subtracao_simbolica",
      fonte: "F15",
      alvo: "resolver a subtração como símbolo depois de internalizar a ação de retirar",
      kinds: ["emojirow"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    { id: EmojiRowRiscarMisconception.RESPONDE_O_REMOVIDO, descricao: "Responde quantos saíram em vez de quantos sobraram." },
    { id: EmojiRowRiscarMisconception.RESPONDE_O_TODO, descricao: "Repete o total original e ignora a retirada." },
    { id: EmojiRowRiscarMisconception.OFF_BY_ONE, descricao: "Conta o restante com erro de uma unidade." },
    { id: EmojiRowRiscarMisconception.SOMOU, descricao: "Combina os números por adição em vez de retirar." },
  ],
};
