import { FichaCompetencia } from "../../schema";

const dominio = { acertos: 4, de: 4, sessoes: 3 };
const tutorial = [
  { fala: "Vamos somar os cubinhos.", show: { destacarColuna: "unidades" } },
  { fala: "Dez cubinhos viram uma barra.", show: { fundirEmBarra: 10 } },
  { fala: "A barra sobe pras dezenas.", show: { subirBarra: true } },
];

export const N3_11: FichaCompetencia = {
  id: "N3.11",
  nome: "Adição com reagrupamento",
  strand: "N3",
  faixa: "F2",
  prereqs: ["N2.01", "N3.07", "N3.09"],
  howto: "Some as unidades. Troque dez cubinhos por uma barra nas dezenas.",
  explain: "Junte os cubinhos. Se passar de dez, faça uma barra.",
  distratores: [
    { regra: "nao_reagrupa", tag: "NAO_REAGRUPA" },
    { regra: "ignora_vai_um", tag: "IGNORA_VAI_UM" },
    { regra: "vai_um_errado", tag: "VAI_UM_ERRADO" },
    { regra: "comeca_esquerda", tag: "ORDEM_INVERTIDA" },
  ],
  niveis: {
    1: { primitiva: "vertical", micro: "dois_mais_um_guiado", andaime: "mao_fantasma" },
    2: { primitiva: "vertical", micro: "dois_mais_um", andaime: "alto" },
    3: { primitiva: "vertical", micro: "duas_ordens_concreto", andaime: "medio" },
    4: { primitiva: "vertical", micro: "duas_ordens_abstrato", andaime: "minimo" },
    5: { primitiva: "vertical", micro: "reagrupamento_duplo", andaime: "nenhum", rt_alvo: 12000 },
  },
  micros: [
    { id: "dois_mais_um_guiado", alvo: "trocar dez unidades por uma dezena com demonstração", kinds: ["vertical"], params: { top_min: 15, top_max: 89, bottom_min: 2, bottom_max: 9, operation: "+", require_regroup: true, result_max: 99, show_place_value: true, show_regroup: true, show_algorithm: false, tutorial }, dominio },
    { id: "dois_mais_um", alvo: "reagrupar unidades em soma com uma parcela de um algarismo", kinds: ["vertical"], params: { top_min: 15, top_max: 89, bottom_min: 2, bottom_max: 9, operation: "+", require_regroup: true, result_max: 99, show_place_value: true, show_regroup: true, show_algorithm: false, tutorial }, dominio },
    { id: "duas_ordens_concreto", alvo: "somar duas ordens com uma troca explícita", kinds: ["vertical"], params: { top_min: 15, top_max: 89, bottom_min: 11, bottom_max: 79, operation: "+", require_regroup: true, result_max: 99, show_place_value: true, show_regroup: true, tutorial }, dominio },
    { id: "duas_ordens_abstrato", alvo: "registrar o reagrupamento na conta armada", kinds: ["vertical"], params: { top_min: 15, top_max: 89, bottom_min: 11, bottom_max: 79, operation: "+", require_regroup: true, result_max: 99 }, dominio },
    { id: "reagrupamento_duplo", alvo: "reagrupar unidades e dezenas em soma de três algarismos", kinds: ["vertical"], params: { top_min: 155, top_max: 799, bottom_min: 155, bottom_max: 799, operation: "+", require_regroup: true, require_double_regroup: true, result_max: 999 }, dominio },
  ],
  erros_tipicos: [
    { id: "nao_reagrupa", descricao: "Escreve a soma das unidades inteira na mesma coluna." },
    { id: "ignora_vai_um", descricao: "Faz a troca, mas não soma a nova dezena." },
    { id: "vai_um_errado", descricao: "Registra a nova dezena na coluna errada." },
    { id: "ordem_invertida", descricao: "Começa a conta pela esquerda." },
  ],
};
