import { FichaCompetencia } from "../../schema";

export const AL_01: FichaCompetencia = {
  id: "AL.01",
  nome: "Classificar por Atributo (Cor, Forma, Tamanho)",
  strand: "AL",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET05",
  
  howto: "Encontre a figura que é diferente das outras.",
  explain: "Observe bem! Tem um que não combina com os outros.",
  distratores: [
    { regra: "aleatorio", tag: "CHUTE" }
  ],
  niveis: {
    1: { primitiva: "intruso_math", andaime: "mao_fantasma" },
    2: { primitiva: "intruso_math", andaime: "alto" },
    3: { primitiva: "intruso_math", andaime: "medio" },
    4: { primitiva: "intruso_math", andaime: "minimo" },
    5: { primitiva: "intruso_math", rt_alvo: 3000 }
  },

  micros: [
    {
      id: "a",
      alvo: "encontrar o intruso por cor ou forma",
      kinds: ["intruso_math"],
      params: { 
        audio_prompt: "Qual é o diferente?",
        tutorial: [{ fala: "Qual não combina? Toque no diferente!" }]
      },
      dominio: { acertos: 3, de: 3, sessoes: 1 }
    }
  ],
  erros_tipicos: []
};
