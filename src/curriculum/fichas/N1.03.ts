import { FichaCompetencia } from "../schema";

export const N1_03: FichaCompetencia = {
  id: "N1.03",
  nome: "Subitização (Olhômetro)",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.01", "N1.02"],
  bncc: "EI03ET07",
  excecaoCPA: "perceptual",
  
  howto: "Bata o olho e confie, não tente contar.",
  explain: "Foi muito rápido para contar, tente ver o formato.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" }
  ],
  
  niveis: {
    1: { primitiva: "emojirow", andaime: "alto" }, // 1.5s fila
    2: { primitiva: "emojirow", andaime: "medio" }, // 1.2s fila
    3: { primitiva: "emojirow", andaime: "medio" }, // 1.0s dado
    4: { primitiva: "emojirow", andaime: "minimo" }, // 0.8s dado
    5: { primitiva: "scattered", rt_alvo: 1500 } // 0.6s disperso
  },

  micros: [
    {
      id: "a",
      alvo: "reconhecimento imediato de pequenas quantidades (flash)",
      kinds: ["emojirow"],
      params: { 
        n_min: 1, 
        n_max: 3,
        arranjo: "fila",
        flash_ms: 1500, // Pisca e esconde após 1.5s
        audio_prompt: "Rápido! Quantos têm aqui?", 
        tutorial: [{ fala: "Preste atenção, eles vão sumir rapidinho!" }] 
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
