import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * JD3 — A moldura relâmpago. *O vazio como quantidade.*
 *
 * ---
 *
 * **O que a criança aprende (§2):** ver **o vazio** de uma moldura de 10 como
 * quantidade — e responder *quantos faltam* sem contar as casas vazias uma a
 * uma.
 *
 * **Por que é a ficha mais estratégica do Jardim:**
 *
 * > *"Os amigos do 10 são a estratégia-rainha do cálculo mental. Mas em F28
 * > eles nascem como **conta** — 'sete mais quanto dá dez?'. Aqui eles nascem
 * > antes disso, como **percepção de vazio**. A criança que *vê* que faltam três
 * > nunca mais precisa calcular que faltam três."*
 *
 * **Por que trava:** *"o olho humano é treinado para contar o que **está lá**.
 * Contar o que **não está** é uma inversão perceptual."*
 *
 * ---
 *
 * ### Esta competência não tinha ficha nenhuma
 *
 * A N1.11 é servida por `gN1_11` e tem **duas** fichas escritas no cânone — a
 * F28 (os amigos do 10 como conta) e esta. Nenhuma das duas existia em código.
 *
 * ### ⚠️ O que o `explain` desta ficha NÃO pode dizer
 *
 * A §7 proíbe duas frases pelo nome:
 *
 * - *"conte as casas vazias"* — devolve a criança à contagem, que é o que a
 *   ficha existe para dispensar;
 * - *"faça dez menos sete"* — a subtração é a F28/F31. Aqui é percepção.
 *
 * ### A escada da §5 — perceptual, sobe por automaticidade
 *
 * | Nível | Preenchimento | Exposição | Apoio |
 * |---|---|---|---|
 * | 1 | 8 ou 9 | 1,5s | fileira de cima completa |
 * | 2 | 6 a 9 | 1,2s | fileira de cima completa |
 * | 3 | 5 a 9 | 1,2s | a âncora do 5 **explícita** |
 * | 4 | 1 a 9 | 1,0s | sem destaque |
 * | 5 | 1 a 9 | 0,7s | vazio **disperso** |
 */

/**
 * §9: `{ acertos: 4, de: 5, sessoes: 2 }` — critério frouxo, coerente com JD1 e
 * JD2, e **sem critério de tempo** (§5.1-bis).
 *
 * Sem `exige`: a §9 desta ficha não pede condição extra, e declarar o que a
 * ficha não pede seria endurecer o cânone por conta própria. A velocidade é
 * treinada na trilha FD1 do Dojo, não aqui.
 */
const dominio = { acertos: 4, de: 5, sessoes: 2 };

/** §8, transcrita. */
const coreografia = [
  { fala: "Prepare o olho!", show: { moldura: { vazia: true } } },
  { fala: "Já!", show: { flash: { tenframe: 8, ms: 1500 } } },
  { fala: "Faltavam dois.", show: { preencherFaltantes: 2 } },
];

export const N1_11: FichaCompetencia = {
  id: "N1.11",
  nome: "A moldura relâmpago (amigos do 10 como percepção)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.08", "N1.10"],
  bncc: "EF01MA06",

  // §2: "sobe por automaticidade, não por abstração. A forma abstrata dos
  // amigos do 10 é a competência F28, que é outra ficha."
  excecaoCPA: "perceptual",

  howto: FALAS.faltam.howto,
  explain: FALAS.faltam.explain,

  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],

  niveis: {
    1: { primitiva: "moldura", micro: "faltam_um_dois", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "faltam_ate_quatro", andaime: "alto" },
    3: { primitiva: "moldura", micro: "ancora_explicita", andaime: "medio" },
    4: { primitiva: "moldura", micro: "sem_destaque", andaime: "minimo" },
    5: { primitiva: "moldura", micro: "vazio_disperso", andaime: "nenhum", rt_alvo: 4000 },
  },

  micros: [
    {
      id: "faltam_um_dois",
      fonte: "JD3",
      alvo: "ver que falta pouco — o vazio como figura pequena e óbvia",
      kinds: ["moldura"],
      params: { modo: "faltam", audio_prompt: FALAS.faltam.audioPrompt, tutorial: coreografia },
      dominio,
    },
    {
      id: "faltam_ate_quatro",
      fonte: "JD3",
      alvo: "o buraco cresce, e continua sendo uma figura só",
      kinds: ["moldura"],
      params: { modo: "faltam", audio_prompt: FALAS.faltam.audioPrompt },
      dominio,
    },
    {
      id: "ancora_explicita",
      fonte: "JD3",
      alvo: "a fileira cheia como unidade: cinco não se conta, se vê",
      kinds: ["moldura"],
      params: { modo: "faltam", audio_prompt: FALAS.faltam.audioPrompt },
      dominio,
    },
    {
      id: "sem_destaque",
      fonte: "JD3",
      alvo: "sem apoio nenhum, e mais rápido",
      kinds: ["moldura"],
      params: { modo: "faltam", audio_prompt: FALAS.faltam.audioPrompt },
      dominio,
    },
    {
      id: "vazio_disperso",
      fonte: "JD3",
      alvo: "o vazio perde a FORMA e ela precisa integrar — o degrau mais difícil",
      kinds: ["moldura"],
      params: { modo: "faltam", audio_prompt: FALAS.faltam.audioPrompt },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_CHEIO, descricao: "Disse quantas fichas há, não quantas faltam: fez o que o olho pede." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Tentou contar as casas vazias e perdeu o fio." },
    { id: MisconceptionTag.DEPENDE_DE_FORMATO, descricao: "Acerta com o vazio contíguo e erra com ele espalhado: percebe a figura, não a quantidade." },
    { id: MisconceptionTag.SEM_ANCORA_CINCO, descricao: "Erra quando faltam mais de cinco: não usa a fileira como unidade — voltar à JD2." },
  ],
};
