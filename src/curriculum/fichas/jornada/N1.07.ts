import { FichaCompetencia } from "../../schema";

export const N1_07: FichaCompetencia = {
  id: "N1.07",
  nome: "Saltos na Reta Numérica (Sucessor/Antecessor)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.06"],
  bncc: "EF01MA01",
  
  howto: "Pense no próximo número da contagem. É o mesmo que dar um salto para frente.",
  explain: "Um a mais é o número que vem logo depois quando contamos.",
  distratores: [
    { regra: "n", tag: "REPETE_ORIGINAL" },
    { regra: "n+2", tag: "ERRO_DE_SALTO" },
    { regra: "n-1", tag: "DIRECAO_ERRADA" }
  ],
  niveis: {
    1: { primitiva: "numberline", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", andaime: "alto" },
    3: { primitiva: "numberline", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 3000 }
  },

  micros: [
    {
      id: "a",
      alvo: "identificar o número que vem imediatamente depois (+1)",
      kinds: ["numberline"],
      params: { 
        start: 1, 
        end: 10,
        jump_size: 1,
        audio_prompt: "O sapinho está no número! Qual número vem DEPOIS?", 
        tutorial: [{fala: "Arraste o sapinho UM número para frente!"}] 
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
