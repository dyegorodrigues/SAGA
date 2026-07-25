import { FichaCompetencia } from "../schema";

export const AL_05: FichaCompetencia = {
  id: "AL.05",
  nome: "Igualdade e Conservação (Balança de Pratos)",
  strand: "AL",
  faixa: "F2",
  prereqs: ["N1.11", "N3.01"],
  bncc: "EF01MA11", // Descrever, por escrito ou oralmente, padroes e elementos ausentes em sequencias matematicas
  micros: [
    {
      id: "a",
      alvo: "equilibrar a balança com quantidades iguais",
      kinds: ["balanca"],
      params: { 
        peso_alvo_min: 2, 
        peso_alvo_max: 8,
        audio_prompt: "A balança está torta! Coloque o mesmo peso do outro lado para ela ficar reta." 
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    },
    {
      id: "b",
      alvo: "equilibrar a balança com soma equivalente (incógnita simples)",
      kinds: ["balanca"],
      params: { 
        peso_alvo_min: 5, 
        peso_alvo_max: 12,
        tipo: "soma_simples",
        audio_prompt: "Falta um pedaço para ficar igual. Qual bloco nós devemos colocar?" 
      }
    }
  ],
  erros_tipicos: [
    {
      id: "ignora_acumulado",
      descricao: "A criança olha apenas para o último bloco colocado e não para a soma total do prato."
    }
  ]
};
