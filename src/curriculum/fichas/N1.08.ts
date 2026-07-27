import { FichaCompetencia } from "../schema";

export const N1_08: FichaCompetencia = {
  id: "N1.08",
  nome: "Subitização com Estrutura (Caixa Mágica)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.03", "N1.04"],
  bncc: "EI03ET07",
  
  howto: "Use a fileira cheia para não precisar contar do começo. A fileira inteira vale cinco.",
  explain: "A fileira de cima está cheia, então são cinco. Continue contando os de baixo.",
  distratores: [
    { regra: "n+1", tag: "OFF_BY_ONE" },
    { regra: "n-1", tag: "OFF_BY_ONE" },
    { regra: "n-5", tag: "IGNOROU_BASE_5" }
  ],
  niveis: {
    1: { primitiva: "tenframe", andaime: "mao_fantasma" },
    2: { primitiva: "tenframe", andaime: "alto" },
    3: { primitiva: "tenframe", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 2500 }
  },

  micros: [
    {
      id: "a",
      alvo: "reconhecer quantidades em dezena incompleta via estrutura de cinco",
      kinds: ["tenframe"],
      params: { 
        n_min: 5, 
        n_max: 10,
        flash_ms: 1500,
        moldura: 10,
        escopo_teclado: "1-10",
        audio_prompt: "A Caixa Mágica abriu e fechou! Quantos você viu?",
        tutorial: [{ fala: "Esta é a caixa mágica! Tente ver os números sem contar um por um!" }]
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "precisa_contar",
      descricao: "A criança tenta contar um por um os pontos no tenframe."
    }
  ]
};
