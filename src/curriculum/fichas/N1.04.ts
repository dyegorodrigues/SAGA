import { FichaCompetencia } from "../schema";

export const N1_04: FichaCompetencia = {
  id: "N1.04",
  nome: "Contagem 1-a-1 (Tocando)",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.01", "N1.02"],
  bncc: "EI03ET07",
  micros: [
    {
      id: "a",
      alvo: "contar tocando sequencialmente cada objeto",
      kinds: ["emojirow"],
      params: { 
        n_min: 3, 
        n_max: 5,
        interactive_count: true,
        audio_prompt: "Conte os bichinhos comigo!", tutorial: [{ say: "Toque em cada bichinho, um por um, para contar!" }] 
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    },
    {
      id: "b",
      alvo: "contar quantidades maiores tocando",
      kinds: ["emojirow"],
      params: { 
        n_min: 6, 
        n_max: 9,
        interactive_count: true,
        audio_prompt: "Quantos têm aqui? Toque para contar!" 
      }
    }
  ],
  erros_tipicos: [
    {
      id: "contagem_dessincronizada",
      descricao: "A criança toca mais rápido do que recita, ou vice-versa, perdendo a correspondência."
    }
  ]
};
