/**
 * Catálogo Centralizado de Tags de Misconception (Radar de Lacunas)
 * NENHUM gerador ou componente deve usar strings soltas.
 */
export const MisconceptionTag = {
  /** Esqueceu de somar a dezena transferida ("vai um") na adição com reagrupamento */
  ESQUECEU_VAI_UM: "esqueceu-vai-um",
  
  /** Concatenou dígitos diretamente em vez de aplicar reagrupamento (ex: 27+15 = 312) */
  CONCATENOU_DIGITOS: "concatenou-digitos",

  /** Subtraiu o menor dígito do maior em cada coluna ignorando o reagrupamento (ex: 42 - 15 = 37 com 2-5 -> 5-2) */
  INVERTE_COLUNA: "inverte-coluna",

  /** Emprestou a dezena mas esqueceu de decrementar 1 da coluna das dezenas */
  ESQUECEU_DESCONTO_DEZENA: "esqueceu-desconto-dezena",

  /** Erro de contagem por uma unidade a mais ou a menos (+1 ou -1) */
  OFF_BY_ONE: "off-by-one",

  /** Trocou a operação (somou onde era para subtrair ou vice-versa) */
  CONFUSAO_SINAL: "confusao-sinal",

  /** Erro ao contar elementos iniciais */
  CONTAGEM_INICIAL_ERRADA: "contagem-inicial-errada",

  /** Problemas aditivos: escolheu a operação pela palavra do enunciado, não pela estrutura */
  PALAVRA_CHAVE: "palavra-chave",

  /** Problemas aditivos: devolveu um dos números da história sem operar */
  REPETE_DADO: "repete-dado",

  /** Problemas aditivos: somou numa comparação, sem entendê-la como diferença */
  COMPARA_SOMANDO: "compara-somando",

  /** Problemas aditivos: só resolve com a incógnita no fim; erra quando ela muda de posição */
  SO_RESOLVE_CANONICO: "so-resolve-canonico"
} as const;

export type MisconceptionTagType = typeof MisconceptionTag[keyof typeof MisconceptionTag];
