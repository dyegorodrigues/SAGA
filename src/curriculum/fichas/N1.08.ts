import { FichaCompetencia } from "../schema";

export const N1_08: FichaCompetencia = {
  id: "N1.08",
  nome: "Subitização com Estrutura (Caixa Mágica)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.03", "N1.04"],
  bncc: "EI03ET07",
  micros: [
    {
      id: "a",
      alvo: "reconhecer quantidades em dezena incompleta via estrutura de cinco",
      kinds: ["tenframe"],
      params: { 
        n_min: 5, 
        n_max: 10,
        flash_ms: 1500,
        audio_prompt: "A Caixa Mágica abriu e fechou! Quantos você viu?",
        tutorial: [{ say: "Esta é a caixa mágica! Tente ver os números sem contar um por um!" }]
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
