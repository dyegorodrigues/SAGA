import { FichaCompetencia } from "../schema";

export const N1_09: FichaCompetencia = {
  id: "N1.09",
  nome: "Counting-On (Contar a partir de)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.07"],
  bncc: "EF01MA01",
  micros: [
    {
      id: "a",
      alvo: "continuar a contagem a partir de um número dado",
      kinds: ["plain"],
      params: { 
        start: 3, 
        end: 8,
        audio_prompt: "Continue contando!",
        tutorial: [{ say: "Não volte pro um! Continue contando de onde parou." }]
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
