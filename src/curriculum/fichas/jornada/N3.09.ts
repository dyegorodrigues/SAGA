import { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 };
const tutorial = [
  { fala: "Barras com barras.", show: { agruparBarras: true } },
  { fala: "Cubinhos com cubinhos.", show: { agruparCubinhos: true } },
  { fala: "Comece pelos cubinhos.", show: { destacarColuna: "unidades" } },
];

export const N3_09: FichaCompetencia = {
  id: "N3.09",
  nome: "Somar/subtrair até 100 sem reagrupar",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N2.01", "N3.07"],
  howto: "Some primeiro as unidades, depois as dezenas. Cada tipo com o seu.",
  explain: "Barras somam com barras. Cubinhos com cubinhos. Comece pelos cubinhos.",
  distratores: [
    { regra: "soma_digitos", tag: "SOMA_DIGITOS" },
    { regra: "troca_colunas", tag: "CONFUNDE_ORDEM" },
    { regra: "comeca_esquerda", tag: "ORDEM_INVERTIDA" },
  ],
  niveis: {
    1: { primitiva: "vertical", micro: "dezenas_exatas", andaime: "mao_fantasma" },
    2: { primitiva: "vertical", micro: "soma_unidades", andaime: "alto" },
    3: { primitiva: "vertical", micro: "soma_duas_ordens", andaime: "medio" },
    4: { primitiva: "vertical", micro: "subtracao", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "misto", andaime: "nenhum", rt_alvo: 8000 },
  },
  micros: [
    { id: "dezenas_exatas", alvo: "somar dezenas exatas sem reagrupamento", kinds: ["vertical"], params: { top_min: 10, top_max: 70, bottom_min: 10, bottom_max: 70, operand_step: 10, result_max: 100, operation: "+", forbid_regroup: true, show_place_value: true, show_algorithm: false, tutorial }, dominio },
    { id: "soma_unidades", alvo: "somar um número de dois algarismos e unidades sem reagrupamento", kinds: ["vertical"], params: { top_min: 10, top_max: 99, bottom_min: 1, bottom_max: 9, result_max: 100, operation: "+", forbid_regroup: true, show_place_value: true, tutorial }, dominio },
    { id: "soma_duas_ordens", alvo: "somar dezenas e unidades por coluna sem reagrupamento", kinds: ["vertical"], params: { top_min: 10, top_max: 99, bottom_min: 10, bottom_max: 89, result_max: 100, operation: "+", forbid_regroup: true, show_place_value: true, tutorial }, dominio },
    { id: "subtracao", alvo: "subtrair dezenas e unidades por coluna sem empréstimo", kinds: ["vertical"], params: { top_min: 20, top_max: 99, bottom_min: 10, bottom_max: 89, operation: "-", forbid_regroup: true }, dominio },
    { id: "misto", alvo: "alternar soma e subtração sem reagrupamento", kinds: ["vertical"], params: { top_min: 10, top_max: 99, bottom_min: 1, bottom_max: 89, result_max: 100, operation: "mixed", forbid_regroup: true }, dominio },
  ],
  erros_tipicos: [
    { id: "soma_digitos", descricao: "Soma todos os algarismos sem separar as ordens." },
    { id: "confunde_ordem", descricao: "Troca dezenas e unidades entre as colunas." },
    { id: "ordem_invertida", descricao: "Começa pela esquerda sem ter automatizado unidades primeiro." },
  ],
};
