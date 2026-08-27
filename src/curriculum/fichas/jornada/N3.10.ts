import { FichaCompetencia } from "../../schema";

/**
 * F20 — História em Painéis. Traduzir uma situação do mundo em uma operação.
 *
 * A escada não cresce em números, e sim em estrutura: juntar sozinho, juntar com
 * separar, as quatro situações, as quatro sem a ilustração da mudança e, por
 * fim, a incógnita mudando de lugar. É a competência mais difícil de F1 porque
 * exige compreender a narrativa, identificar a estrutura e traduzir em símbolos.
 */

const dominio = { acertos: 4, de: 4, sessoes: 2 };

export const N3_10: FichaCompetencia = {
  id: "N3.10",
  nome: "Problemas aditivos em painéis",
  strand: "N3",
  faixa: "F1",
  // CLASS-002 — a ficha dizia menos pré-requisitos do que o DAG cobra.
  //
  // Quem tranca a porta é o DAG: é dele que `unlockEngine` e `rescuePlanner`
  // leem. O campo aqui é documentação, e documentação que discorda do que o app
  // faz é pior que documentação ausente — ela convence de uma coisa errada.
  prereqs: ["N3.03", "N3.04"],
  howto: "Veja o que aconteceu: chegou mais ou foi embora? Se chegou, junte. Se foi, tire.",
  explain: "Olhe de novo o que mudou entre as duas cenas.",
  distratores: [
    { regra: "palavra_chave", tag: "PALAVRA_CHAVE" },
    { regra: "repete_dado", tag: "REPETE_DADO" },
    { regra: "compara_somando", tag: "COMPARA_SOMANDO" },
    { regra: "so_resolve_canonico", tag: "SO_RESOLVE_CANONICO" },
  ],
  niveis: {
    1: { primitiva: "storypanel", micro: "juntar", andaime: "alto" },
    2: { primitiva: "storypanel", micro: "juntar_separar", andaime: "alto" },
    3: { primitiva: "storypanel", micro: "quatro_estruturas", andaime: "medio" },
    4: { primitiva: "storypanel", micro: "sem_ilustracao", andaime: "minimo" },
    5: { primitiva: "storypanel", micro: "incognita_variavel", andaime: "nenhum", rt_alvo: 15000 },
  },
  micros: [
    {
      id: "juntar",
      alvo: "reconhecer a situação de juntar e responder pelo total",
      kinds: ["storypanel"],
      params: { result_max: 10, audio_prompt: "Escute a história." },
      dominio,
    },
    {
      id: "juntar_separar",
      alvo: "distinguir o que chegou do que foi embora",
      kinds: ["storypanel"],
      params: { result_max: 10, audio_prompt: "Escute a história." },
      dominio,
    },
    {
      id: "quatro_estruturas",
      alvo: "reconhecer juntar, separar, comparar e completar",
      kinds: ["storypanel"],
      params: { result_max: 12, audio_prompt: "Escute a história." },
      dominio,
    },
    {
      id: "sem_ilustracao",
      alvo: "identificar a estrutura apenas pela narração",
      kinds: ["storypanel"],
      params: { result_max: 15, audio_prompt: "Escute a história com atenção." },
      dominio,
    },
    {
      id: "incognita_variavel",
      alvo: "resolver com a incógnita em qualquer posição da relação",
      kinds: ["storypanel"],
      params: { result_max: 18, audio_prompt: "Escute a história com atenção." },
      dominio,
    },
  ],
  erros_tipicos: [
    { id: "palavra_chave", descricao: "Escolhe a operação pela palavra do enunciado, não pela estrutura." },
    { id: "repete_dado", descricao: "Devolve um dos números da história sem operar." },
    { id: "compara_somando", descricao: "Soma numa comparação, sem entendê-la como diferença." },
    { id: "so_resolve_canonico", descricao: "Só resolve com a incógnita no fim." },
  ],
};
