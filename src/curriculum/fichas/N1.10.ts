import { FichaCompetencia } from "../schema";

export const N1_10: FichaCompetencia = {
  id: "N1.10",
  nome: "Parte-Todo (Number Bonds)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.08"],
  bncc: "EF01MA06",
  
  howto: "O círculo de cima é o total. Os dois de baixo formam ele juntos.",
  explain: "Se juntar as duas partes de baixo, tem que dar o número total de cima.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" },
    { regra: "part+whole", tag: "SOMA_TUDO" }
  ],
  niveis: {
    1: { primitiva: "bond", andaime: "mao_fantasma" },
    2: { primitiva: "bond", andaime: "alto" },
    3: { primitiva: "bond", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 4000 }
  },

  micros: [
    {
      id: "a",
      alvo: "identificar o todo a partir de duas partes",
      kinds: ["bond"],
      params: { 
        soma_max: 5,
        interactive: "whole",
        audio_prompt: "Juntando as duas partes, qual é o total?", 
        tutorial: [{fala: "Esses dois números menores se juntam para formar o número grande em cima!"}] 
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    },
    {
      id: "b",
      alvo: "identificar uma parte faltando (subtração inicial)",
      kinds: ["bond"],
      params: { 
        soma_max: 7,
        interactive: "part",
        audio_prompt: "Nós temos o total. Que parte está faltando?", 
        tutorial: [{fala: "Qual número junta com essa parte para dar o total lá de cima?"}] 
      }
    }
  ],
  erros_tipicos: [
    {
      id: "soma_tudo",
      descricao: "A criança soma o total com a parte que ela já tem (ex: tem 7 no topo e 3 em baixo, responde 10)."
    }
  ]
};
