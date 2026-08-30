import { FichaCompetencia } from "../../schema";

/**
 * F41 — CÁLCULO MENTAL E ESTIMATIVA. O mecanismo de autocorreção.
 *
 * A criança que calcula `38 + 45` e responde 73 não percebe que está errado. Se
 * tivesse estimado — *"quarenta mais quarenta é oitenta, então dá uns oitenta e
 * poucos"* — teria detectado o erro sozinha.
 *
 * **Estimativa é o mecanismo de autocorreção**, e é por isso que ela é uma
 * competência e não um enfeite: sem ela, todo erro de conta sobrevive até
 * alguém de fora apontar.
 *
 * O `IGNORA_CONFLITO` é o erro mais interessante da ficha — estimar oitenta,
 * calcular setenta e três, e seguir sem notar que as duas coisas não combinam.
 * Um nível que só pede estimativa não pega isso; pega só quem não sabe estimar.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

const tutorial = [
  { fala: "Antes de calcular, chute mais ou menos quanto vai dar.", show: { destacarEstimativa: true } },
  { fala: "Arredonde cada número para a dezena mais perto.", show: { arredondar: true } },
  { fala: "Se a conta der muito longe disso, alguma coisa está errada.", show: { destacarEstimativa: true } },
];

export const N3_13: FichaCompetencia = {
  id: "N3.13",
  nome: "Cálculo Mental e Estimativa",
  strand: "N3",
  faixa: "F2",
  prereqs: ["N3.11", "N3.12"],

  howto: "Arredonde para a dezena mais perto. Quarenta e quarenta dá oitenta, então a resposta é perto de oitenta.",
  explain: "Antes de calcular, chute mais ou menos quanto vai dar.",

  distratores: [
    { regra: "calcula_direto", tag: "NAO_ESTIMA" },
    { regra: "chuta_sem_criterio", tag: "ESTIMATIVA_ALEATORIA" },
    { regra: "nao_usa_a_propria_estimativa", tag: "IGNORA_CONFLITO" },
  ],

  niveis: {
    1: { primitiva: "numberline", micro: "arredondar", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "estimar-soma", andaime: "alto" },
    3: { primitiva: "numberline", micro: "estimar-e-calcular", andaime: "medio" },
    4: { primitiva: "numberline", micro: "detectar-absurdo", andaime: "minimo" },
    5: {
      primitiva: "numberline",
      micro: "mental-com-estrategia",
      andaime: "nenhum",
      rt_alvo: 15000,
      acaoProbatoria: {
        id: "declarar-a-estrategia",
        porque: "Num nível de cálculo mental, chutar e acertar é indistinguível do domínio. Dizer por onde foi é o que separa quem estimou de quem teve sorte.",
      },
    },
  },

  micros: [
    { id: "arredondar", fonte: "F41", alvo: "achar a dezena mais próxima de um número", kinds: ["numberline"], params: { tutorial }, dominio },
    { id: "estimar-soma", fonte: "F41", alvo: "estimar a soma de dois números arredondando os dois", kinds: ["numberline"], params: {}, dominio },
    { id: "estimar-e-calcular", fonte: "F41", alvo: "estimar primeiro e depois dar o resultado exato", kinds: ["numberline"], params: {}, dominio },
    { id: "detectar-absurdo", fonte: "F41", alvo: "usar a estimativa para reconhecer qual resposta não pode estar certa", kinds: ["numberline"], params: {}, dominio },
    { id: "mental-com-estrategia", fonte: "F41", alvo: "calcular de cabeça declarando por onde foi", kinds: ["numberline"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: "nao_estima", descricao: "Calcula direto, sem estimar: fica sem referência para se checar." },
    { id: "estimativa_aleatoria", descricao: "Chuta um número sem critério, em vez de arredondar." },
    { id: "ignora_conflito", descricao: "Estima oitenta, calcula setenta e três, e não usa a própria estimativa para se corrigir." },
  ],
};
