import { FichaCompetencia } from "../schema";

export const N1_03: FichaCompetencia = {
  id: "N1.03",
  nome: "Subitização (Olhômetro)",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.01", "N1.02"],
  bncc: "EI03ET07",
  micros: [
    {
      id: "a",
      alvo: "reconhecimento imediato de pequenas quantidades (flash)",
      kinds: ["emojirow"],
      params: { 
        n_min: 1, 
        n_max: 3,
        flash_ms: 1500, // Pisca e esconde após 1.5s
        audio_prompt: "Rápido! Quantos têm aqui?" 
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "precisa_contar",
      descricao: "A criança tenta contar um por um e não consegue bater o olho e reconhecer de imediato."
    }
  ]
};
