import { FichaCompetencia } from "../../schema";

export const N1_04: FichaCompetencia = {
  id: "N1.04",
  nome: "Contagem 1-a-1 (Tocando)",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.01", "N1.02"],
  bncc: "EI03ET07",
  
  // Contrato Universal
  howto: "Toque em cada objeto uma única vez e lembre-se do último número falado.",
  explain: "Parece que você pulou um ou contou o mesmo duas vezes. Vamos devagar, um toque de cada vez.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" },
    { regra: "n+2", tag: "OFF_BY_TWO" }
  ],
  niveis: {
    1: { primitiva: "emojirow", andaime: "mao_fantasma" },
    2: { primitiva: "emojirow", andaime: "alto" },
    3: { primitiva: "tenframe", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 3000 }
  },

  micros: [
    {
      id: "a",
      alvo: "contar tocando sequencialmente cada objeto (até 5)",
      kinds: ["emojirow"],
      params: { 
        n_min: 3, 
        n_max: 5,
        arranjo: "fila",
        escopo_teclado: "1-5",
        interactive_count: true,
        audio_prompt: "Conte os bichinhos comigo!", 
        tutorial: [{ fala: "Toque em cada bichinho, um por um, para contar!" }] 
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    },
    {
      id: "b",
      alvo: "contar quantidades maiores tocando (até 10)",
      kinds: ["emojirow"],
      params: { 
        n_min: 6, 
        n_max: 9,
        arranjo: "grade",
        escopo_teclado: "1-10",
        interactive_count: true,
        audio_prompt: "Quantos têm aqui? Toque para contar!" 
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    },
    {
      id: "c",
      alvo: "contar objetos dispersos (até 10)",
      kinds: ["scattered"],
      params: {
        n_min: 5,
        n_max: 10,
        arranjo: "disperso",
        escopo_teclado: "1-10",
        interactive_count: true,
        audio_prompt: "Eles estão espalhados! Conte todos eles."
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "contagem_dessincronizada",
      descricao: "A criança toca mais rápido do que recita, ou vice-versa, perdendo a correspondência."
    }
  ]
};
