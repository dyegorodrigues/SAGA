import { FichaCompetencia } from "../schema";

export const N2_01: FichaCompetencia = {
  id: "N2.01",
  nome: "Dezena e Unidades (Sistema Decimal)",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N1.09", "N1.11"],
  bncc: "EF01MA04",
  micros: [
    {
      id: "a",
      alvo: "reconhecer dezenas e unidades no material dourado",
      kinds: ["tens"],
      params: { 
        dezenas_max: 5,
        unidades_max: 9,
        audio_prompt: "Quantos blocos temos aqui no total?", tutorial: [{say: "Lembre-se que cada barra grande vale 10!"}] 
      },
      dominio: { acertos: 4, de: 5, sessoes: 2 }
    }
  ],
  erros_tipicos: [
    {
      id: "ignora_posicao",
      descricao: "A criança conta as barras como se fossem unidades (ex: 2 barras e 4 cubinhos -> responde 6)."
    }
  ]
};
