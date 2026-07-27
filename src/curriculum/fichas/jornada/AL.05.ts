import { FichaCompetencia } from "../../schema";

export const AL_05: FichaCompetencia = {
  id: "AL.05",
  nome: "Igualdade e Conservação (Balança de Pratos)",
  strand: "AL",
  faixa: "F2",
  prereqs: ["N1.11", "N3.01"],
  bncc: "EF01MA11",
  
  howto: "Os dois lados da balança precisam ter o mesmo peso total para ela ficar reta.",
  explain: "Se um lado está mais baixo, significa que ele está mais pesado. Adicione no outro lado para equilibrar.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" }
  ],
  niveis: {
    1: { primitiva: "balanca", andaime: "mao_fantasma" },
    2: { primitiva: "balanca", andaime: "alto" },
    3: { primitiva: "plain", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 5000 }
  },

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
