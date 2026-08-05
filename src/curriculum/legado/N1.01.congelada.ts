/**
 * ⛔ CONGELADO — alvo de rollback do canário do N1.01. NÃO SE EDITA.
 *
 * Esta é, letra por letra, a ficha que a produção servia antes de o N1.01 ser
 * reescrito para pareamento (ficha F07). Ela existe por um motivo só: se a tela
 * nova quebrar na mão de uma criança, `rollbackComposerCanary("N1.01")` devolve
 * ESTA — que funciona e é pedagogicamente próxima — em vez do gerador de
 * contagem de julho, que perguntaria "quantos?" numa competência pré-numérica.
 *
 * Melhorar este arquivo é um erro de categoria: um alvo de rollback que muda
 * junto com o código novo não é alvo de rollback nenhum. Se algo aqui está
 * errado, o lugar de consertar é a ficha viva em `fichas/jornada/N1.01.ts`.
 */
import { FichaCompetencia } from "../schema";

export const N1_01_CONGELADA: FichaCompetencia = {
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
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "duplo_click",
      descricao: "Tenta parear dois no mesmo lugar"
    }
  ]
};
