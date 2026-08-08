import { FichaCompetencia } from "../../schema";
import { MisconceptionTag } from "../../../constants/misconceptions";

/** N1.09 — contagem até 20 e a partir de qualquer número. */
export const N1_09: FichaCompetencia = {
  id: "N1.09",
  nome: "Contagem até 20 e a partir de qualquer número",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.04", "N1.02"],
  bncc: "EF01MA01",
  howto: "Conte cada objeto uma vez ou continue a sequência do número em que ela começou.",
  explain: "A contagem não precisa começar no um. Cada número aponta para o próximo da sequência; para voltar, seguimos a ordem ao contrário.",
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],
  niveis: {
    1: { primitiva: "scattered", micro: "contar15", andaime: "alto" },
    2: { primitiva: "scattered", micro: "contar20", andaime: "medio" },
    3: { primitiva: "plain", micro: "partirDeN", andaime: "medio" },
    4: { primitiva: "plain", micro: "regressiva", andaime: "minimo" },
    5: { primitiva: "plain", micro: "misto", andaime: "minimo" },
  },
  micros: [
    {
      id: "contar15",
      fonte: "GRAFO_N1.09",
      alvo: "contar conjuntos de 10 a 15 objetos com correspondência um-a-um",
      kinds: ["scattered"],
      params: { n_min: 10, n_max: 15, audio_prompt: "Conte os objetos. Quantos há?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "contar20",
      fonte: "GRAFO_N1.09",
      alvo: "contar conjuntos de 10 a 20 objetos sem perder nem repetir itens",
      kinds: ["scattered"],
      params: { n_min: 10, n_max: 20, audio_prompt: "Conte com calma. Quantos objetos há?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "partirDeN",
      fonte: "GRAFO_N1.09",
      alvo: "iniciar a sequência em um número interno e continuar sem voltar ao um",
      kinds: ["plain"],
      params: { modo: "sequence_next", start: 4, end: 17 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "regressiva",
      fonte: "GRAFO_N1.09",
      alvo: "continuar uma contagem regressiva simples até zero",
      kinds: ["plain"],
      params: { modo: "countdown_next", start: 3, end: 10 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "misto",
      fonte: "GRAFO_N1.09",
      alvo: "recuperar flexivelmente contagem de objetos, continuação a partir de N e regressiva",
      kinds: ["plain"],
      params: { modo: "counting_mixed", n_min: 10, n_max: 20, start: 4, end: 10 },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
  ],
  erros_tipicos: [
    { id: "SEQUENCE_BREAK", descricao: "Quebra a sequência ou pula um número." },
    { id: "CANNOT_START_ARBITRARY", descricao: "Precisa voltar ao um para continuar uma contagem iniciada em outro número." },
    { id: "SKIP_NUMBERS", descricao: "Pula ou repete objetos/números durante a contagem." },
  ],
};
