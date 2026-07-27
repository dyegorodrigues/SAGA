import { FichaCompetencia } from "../../schema";

export const N1_01: FichaCompetencia = {
  id: "N1.01",
  nome: "Parear 1-a-1 (um pra cada)",
  strand: "N1",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET07",
  excecaoCPA: "perceptual",
  
  howto: "Um para cada. Coloque com cuidado para não faltar nem sobrar nas vagas.",
  explain: "Você colocou mais de um no mesmo lugar. É só UM para cada!",
  distratores: [], // Produção
  
  niveis: {
    1: { primitiva: "draggroup", andaime: "mao_fantasma" },
    2: { primitiva: "draggroup", andaime: "alto" },
    3: { primitiva: "draggroup", andaime: "medio" },
    4: { primitiva: "draggroup", andaime: "minimo" },
    5: { primitiva: "draggroup", rt_alvo: 4000 }
  },

  micros: [
    {
      id: "a",
      alvo: "pareamento simples com poucos elementos",
      kinds: ["draggroup"],
      params: { 
        n_min: 3, 
        n_max: 5,
        audio_prompt: "Dê uma comidinha para cada bichinho!", 
        tutorial: [{ fala: "Toque nas caixinhas para colocar uma comidinha em cada!" }] 
      },
      dominio: { acertos: 3, de: 3, sessoes: 1 }
    },
    {
      id: "b",
      alvo: "pareamento com excesso (sobra no destino)",
      kinds: ["draggroup"],
      params: { 
        n_min: 5, 
        n_max: 7,
        audio_prompt: "Entregue uma comidinha para cada. Será que vai sobrar?", 
        tutorial: [{ fala: "Lembre-se de colocar só UMA comidinha em cada bichinho!" }],
        tem_sobra: true 
      }
    }
  ],
  erros_tipicos: [
    {
      id: "duplo_click",
      descricao: "Tenta parear dois no mesmo lugar"
    }
  ]
};
