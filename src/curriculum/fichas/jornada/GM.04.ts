import { FichaCompetencia } from "../../schema";

export const GM_04: FichaCompetencia = {
  id: "GM.04",
  nome: "Relógio: Horas e Minutos",
  strand: "GM",
  faixa: "F2",
  prereqs: ["N2.01", "AL.01"],
  bncc: "EF02MA18", 
  
  howto: "O ponteiro pequeno marca a hora. O grande marca os minutos.",
  explain: "Cuidado para não confundir: o ponteiro curto e grosso aponta a hora. O ponteiro longo aponta os minutos.",
  distratores: [
    { regra: "inverte_ponteiros", tag: "TROCA_PONTEIROS" }
  ],
  niveis: {
    1: { primitiva: "relogio", andaime: "mao_fantasma" },
    2: { primitiva: "relogio", andaime: "alto" },
    3: { primitiva: "relogio", andaime: "medio" }, // Reading instead of dragging
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 5000 }
  },

  micros: [
    {
      id: "a",
      alvo: "ler horas exatas no relógio analógico",
      kinds: ["relogio"],
      params: { 
        apenas_horas_exatas: true,
        audio_prompt: "Que horas o relógio está marcando?" 
      },
      dominio: { acertos: 3, de: 4, sessoes: 1 }
    },
    {
      id: "b",
      alvo: "avançar o tempo em frações de 15 minutos",
      kinds: ["relogio"],
      params: { 
        interativo: true,
        minutos_step: 15,
        audio_prompt: "Ajuste o relógio para avançar 15 minutos." 
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "troca_ponteiros",
      descricao: "Confunde o ponteiro maior (minutos) com o ponteiro menor (horas)."
    }
  ]
};
