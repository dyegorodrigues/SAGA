import { FichaCompetencia } from "../schema";

export const N1_09: FichaCompetencia = {
  id: "N1.09",
  nome: "Counting-On (Contar a partir de)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.07"],
  bncc: "EF01MA01",
  
  howto: "Guarde o primeiro número na cabeça e continue contando.",
  explain: "Não precisa começar do um de novo. Comece do número guardado e conte os próximos.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" },
    { regra: "n", tag: "ESQUECEU_DE_SOMAR" }
  ],
  niveis: {
    1: { primitiva: "emojirow", andaime: "mao_fantasma" },
    2: { primitiva: "emojirow", andaime: "alto" },
    3: { primitiva: "numberline", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 4000 }
  },

  micros: [
    {
      id: "a",
      alvo: "continuar a contagem a partir de um número dado",
      kinds: ["plain"], // Plain here because we might just say "Continue do 5"
      params: { 
        start: 3, 
        end: 8,
        audio_prompt: "Continue contando!",
        tutorial: [{ fala: "Não volte pro um! Continue contando de onde parou." }]
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "reinicia_no_um",
      descricao: "Em vez de continuar, a criança recomeça do número 1."
    }
  ]
};
