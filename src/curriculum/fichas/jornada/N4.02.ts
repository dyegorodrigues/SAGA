import { FichaCompetencia } from "../../schema";

const dominio = { acertos: 3, de: 3, sessoes: 2 };
const params = (overrides: Record<string, unknown>) => ({
  rows_min: 2, rows_max: 5, cols_min: 2, cols_max: 5,
  allow_rotate: false, require_rotate: false, area_mode: false,
  show_equation: false, answer_mode: "total", ...overrides,
});

export const N4_02: FichaCompetencia = {
  id: "N4.02",
  nome: "Arranjos retangulares e comutatividade",
  strand: "N4",
  faixa: "F2",
  prereqs: ["N4.01"],
  howto: "Conte as linhas e quantos quadradinhos há em cada linha. Depois multiplique.",
  explain: "Olhe uma linha. Todas as outras têm a mesma quantidade.",
  distratores: [
    { regra: "soma_dimensoes", tag: "SOMA_DIMENSOES" },
    { regra: "conta_uma_linha", tag: "CONTA_UMA_LINHA" },
    { regra: "nao_ve_comutativa", tag: "NAO_VE_COMUTATIVA" },
  ],
  niveis: {
    1: { primitiva: "arraygrid", micro: "contagem", andaime: "alto" },
    2: { primitiva: "arraygrid", micro: "multiplicacao", andaime: "medio" },
    3: { primitiva: "arraygrid", micro: "giro", andaime: "medio" },
    4: { primitiva: "arraygrid", micro: "expressao", andaime: "minimo" },
    5: { primitiva: "arraygrid", micro: "area", andaime: "nenhum", rt_alvo: 12000 },
  },
  micros: [
    { id: "contagem", alvo: "contar o total em arranjos de até três por quatro", kinds: ["arraygrid"], params: params({ rows_max: 3, cols_max: 4 }), dominio },
    { id: "multiplicacao", alvo: "ligar linhas iguais à multiplicação", kinds: ["arraygrid"], params: params({ show_equation: true }), dominio },
    { id: "giro", alvo: "observar a comutatividade ao girar", kinds: ["arraygrid"], params: params({ allow_rotate: true, require_rotate: true, show_equation: true }), dominio },
    { id: "expressao", alvo: "escolher a expressão que representa o arranjo", kinds: ["arraygrid"], params: params({ rows_max: 10, cols_max: 10, answer_mode: "equation", show_equation: true }), dominio },
    { id: "area", alvo: "reconhecer a ponte do arranjo para a área", kinds: ["arraygrid"], params: params({ rows_max: 10, cols_max: 10, area_mode: true, show_equation: true }), dominio },
  ],
  erros_tipicos: [
    { id: "soma_dimensoes", descricao: "Soma linhas e colunas." },
    { id: "conta_uma_linha", descricao: "Conta somente uma linha." },
    { id: "nao_ve_comutativa", descricao: "Acha que o giro muda o total." },
  ],
};
