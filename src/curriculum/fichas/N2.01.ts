import { FichaCompetencia } from "../schema";

export const N2_01: FichaCompetencia = {
  id: "N2.01",
  nome: "Dezena e Unidades (Sistema Decimal)",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N1.09", "N1.11"],
  bncc: "EF01MA04",
  
  howto: "Cada torre tem dez blocos. Conte as torres de dez em dez e depois junte as unidades soltas.",
  explain: "As torres valem dez. Não precisa contar cada bloquinho de dentro delas.",
  distratores: [
    { regra: "d+u", tag: "IGNORA_DEZENA" }, // Ex: 24 (2 dezenas 4 unidades) -> 6
    { regra: "d*10", tag: "ESQUECEU_UNIDADES" } // Ex: 24 -> 20
  ],
  niveis: {
    1: { primitiva: "tens", andaime: "mao_fantasma" },
    2: { primitiva: "tens", andaime: "alto" },
    3: { primitiva: "tens", andaime: "medio" },
    4: { primitiva: "plain", andaime: "minimo" },
    5: { primitiva: "plain", rt_alvo: 4000 }
  },

  micros: [
    {
      id: "a",
      alvo: "reconhecer dezenas e unidades no material dourado",
      kinds: ["tens"],
      params: { 
        dezenas_max: 5,
        unidades_max: 9,
        audio_prompt: "Quantos blocos temos aqui no total?", 
        tutorial: [{fala: "Lembre-se que cada barra grande vale 10!"}] 
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
