import { FichaCompetencia } from "../../schema";

/**
 * N1.07 — ordem, sucessor e antecessor até 10.
 * A Jornada mede compreensão; JD4, depois, mede automaticidade.
 */
export const N1_07: FichaCompetencia = {
  id: "N1.07",
  nome: "Ordem, sucessor e antecessor até 10",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.02", "N1.06"],
  bncc: "EF01MA01",
  howto: "Use a ordem da contagem para descobrir quem vem antes, quem vem depois e como colocar os números em sequência.",
  explain: "O antecessor vem imediatamente antes; o sucessor vem imediatamente depois.",
  distratores: [],
  niveis: {
    1: { primitiva: "numberline", micro: "a", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "b", andaime: "alto" },
    3: { primitiva: "plain", micro: "c", andaime: "medio" },
    4: { primitiva: "plain", micro: "d", andaime: "minimo" },
    5: { primitiva: "plain", micro: "e", rt_alvo: 3000 },
  },
  micros: [
    {
      id: "a",
      fonte: "GRAFO_N1.07",
      alvo: "identificar o sucessor até 5 com apoio da reta",
      kinds: ["numberline"],
      params: { start: 1, end: 5, jump_size: 1, audio_prompt: "Qual número vem depois?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "b",
      fonte: "GRAFO_N1.07",
      alvo: "identificar o sucessor até 10 com apoio reduzido",
      kinds: ["numberline"],
      params: { start: 1, end: 10, jump_size: 1, audio_prompt: "Qual número vem depois?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "c",
      fonte: "GRAFO_N1.07",
      alvo: "identificar o antecessor até 5",
      kinds: ["plain"],
      params: { start: 1, end: 5, jump_size: -1, audio_prompt: "Qual número vem antes?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "d",
      fonte: "GRAFO_N1.07",
      alvo: "identificar o antecessor até 10",
      kinds: ["plain"],
      params: { start: 1, end: 10, jump_size: -1, audio_prompt: "Qual número vem antes?" },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "e",
      fonte: "GRAFO_N1.07",
      alvo: "ordenar 3 a 4 numerais consecutivos em ordem crescente",
      kinds: ["plain"],
      params: {
        modo: "ordering",
        start: 1,
        end: 10,
        audio_prompt: "Coloque os números do menor para o maior.",
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
  ],
  erros_tipicos: [
    {
      id: "direcao_invertida",
      descricao: "Confunde antes e depois e se move para o lado oposto na sequência.",
    },
    {
      id: "repete_estimulo",
      descricao: "Repete o número apresentado em vez de escolher seu vizinho.",
    },
    {
      id: "ordem_errada",
      descricao: "Reconhece os numerais isolados, mas não os organiza na sequência crescente.",
    },
  ],
};
