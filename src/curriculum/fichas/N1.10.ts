import { FichaCompetencia } from "../schema";

export const N1_10: FichaCompetencia = {
  id: "N1.10",
  nome: "Parte-Todo (Number Bonds)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.08"],
  bncc: "EF01MA06",
  micros: [
    {
      id: "a",
      alvo: "identificar o todo a partir de duas partes",
      kinds: ["bond"],
      params: { 
        soma_max: 5,
        interactive: "whole",
        audio_prompt: "Juntando essas duas partes, qual é o total?" 
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
        audio_prompt: "Nós temos o total. Que parte está faltando?" 
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
