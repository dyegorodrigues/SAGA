import { FichaCompetencia } from "../schema";

export const N1_07: FichaCompetencia = {
  id: "N1.07",
  nome: "Saltos na Reta Numérica (Sucessor/Antecessor)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.06"],
  bncc: "EF01MA01",
  micros: [
    {
      id: "a",
      alvo: "identificar o número que vem imediatamente depois (+1)",
      kinds: ["numberline"],
      params: { 
        start: 1, 
        end: 10,
        jump_size: 1,
        audio_prompt: "Dê um pulo para frente. Onde fomos parar?" 
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "conta_posicao_atual",
      descricao: "Ao pular, a criança conta a posição onde está como '1', em vez de contar o deslocamento."
    }
  ]
};
