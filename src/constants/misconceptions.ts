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
  SO_RESOLVE_CANONICO: "so-resolve-canonico",

  /** Tabuada: somou os dois fatores em vez de multiplicar (5×4 → 9) */
  SOMA_OS_FATORES: "soma-os-fatores",

  /** Tabuada: devolveu um múltiplo vizinho — memorizou a lista sem o padrão que a gera (5×4 → 15 ou 25) */
  TABUADA_TROCADA: "tabuada-trocada",

  /** Decomposição: dobrou uma vez e parou, sem completar a estratégia (7×4 → 14) */
  PAROU_NO_DOBRO: "parou-no-dobro",

  /** Decomposição: aplicou a OUTRA estratégia — dobrou o dobro onde cabia dobro mais um grupo, ou o contrário (7×3 → 28) */
  TROCOU_ESTRATEGIA: "trocou-estrategia",

  /** Âncora: devolveu o fato fácil sem fazer o ajuste (7×9 → 70, que é 7×10) */
  PAROU_NA_ANCORA: "parou-na-ancora",

  /** Âncora: ajustou para o lado errado — somou onde era tirar, ou o contrário (7×9 → 77) */
  DIRECAO_ERRADA: "direcao-errada",

  /** Família ×÷: respondeu o divisor em vez do quociente (12÷3 → 3) */
  INVERTE_DIVISAO: "inverte-divisao",

  /** Família ×÷: tratou a divisão como subtração (12÷3 → 9) */
  DIVIDE_SUBTRAINDO: "divide-subtraindo",

  /** Valor posicional: aplicou "acrescenta zero" sem entender — um zero no ×100 (23×100 → 230) */
  ACRESCENTA_ZERO_SEM_ENTENDER: "acrescenta-zero-sem-entender",

  /** Valor posicional: deslocou o número errado de ordens (12×30 → 36, esqueceu a dezena) */
  ORDEM_ERRADA: "ordem-errada",

  /** Multiplicação armada: esqueceu de somar o "vai um" da ordem anterior (27×3 → 61) */
  ESQUECE_REAGRUPAMENTO: "esquece-reagrupamento",

  /** Modelo de área: multiplicou só uma região e parou, sem somar as partes (13×4 → 40) */
  PARCELA_UNICA: "parcela-unica",

  /** Modelo de área: partiu pelo ALGARISMO, não pelo valor — leu o 1 de 13 como um, não como dez (13×4 → 16) */
  CORTE_ERRADO: "corte-errado",

  /** Multiplicação armada por 2 dígitos: esqueceu o zero da segunda linha (13×14 → 65) */
  ZERO_ESQUECIDO: "zero-esquecido"
} as const;

export type MisconceptionTagType = typeof MisconceptionTag[keyof typeof MisconceptionTag];
