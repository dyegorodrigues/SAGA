import { FichaCompetencia } from "../schema";

export const N1_02: FichaCompetencia = {
  id: "N1.02",
  nome: "Canto Numérico (Recitar a sequência verbal)",
  strand: "N1",
  faixa: "F0",
  prereqs: [], 
  bncc: "EI03ET07", 
  excecaoCPA: "perceptual", // É apenas recitação verbal, sem correspondência física 1-a-1
  micros: [
    {
      id: "a",
      alvo: "recitar até 5 cantando junto com o mascote",
      kinds: ["emojirow"], 
      params: { 
        n_min: 5, 
        n_max: 5,
        audio_prompt: "Vamos contar juntos? Toque em um de cada vez!", tutorial: [{ say: "Toque nas figuras para cantarmos juntos!" }], interactive_count: true 
      },
      dominio: { acertos: 1, de: 1, sessoes: 1 }
    }
  ],
  erros_tipicos: [
    {
      id: "pula_numero",
      descricao: "Pula números na sequência verbal (ex: 1, 2, 4, 5)."
    }
  ]
};
