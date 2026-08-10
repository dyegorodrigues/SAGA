/**
 * Catálogo Centralizado de Tags de Misconception (Radar de Lacunas)
 * NENHUM gerador ou componente deve usar strings soltas.
 */
export const MisconceptionTag = {
  /** Esqueceu de somar a dezena transferida ("vai um") na adição com reagrupamento */
  ESQUECEU_VAI_UM: "esqueceu-vai-um",
  
  /** Concatenou dígitos diretamente em vez de aplicar reagrupamento (ex: 27+15 = 312) */
  CONCATENOU_DIGITOS: "concatenou-digitos",

  /** Subtraiu o menor dígito do maior em cada coluna ignorando o reagrupamento */
  INVERTE_COLUNA: "inverte-coluna",

  /** Emprestou a dezena mas esqueceu de decrementar 1 da coluna das dezenas */
  ESQUECEU_DESCONTO_DEZENA: "esqueceu-desconto-dezena",

  /** Erro de contagem por uma unidade a mais ou a menos (+1 ou -1) */
  OFF_BY_ONE: "off-by-one",

  /** Trocou a operação */
  CONFUSAO_SINAL: "confusao-sinal",

  /** Erro ao contar elementos iniciais */
  CONTAGEM_INICIAL_ERRADA: "contagem-inicial-errada",

  /** Problemas aditivos: escolheu a operação pela palavra do enunciado, não pela estrutura */
  PALAVRA_CHAVE: "palavra-chave",

  /** Problemas aditivos: devolveu um dos números da história sem operar */
  REPETE_DADO: "repete-dado",

  /** Problemas aditivos: somou numa comparação, sem entendê-la como diferença */
  COMPARA_SOMANDO: "compara-somando",

  /** Problemas aditivos: só resolve com a incógnita no fim */
  SO_RESOLVE_CANONICO: "so-resolve-canonico",

  /** Tabuada: somou os dois fatores em vez de multiplicar */
  SOMA_OS_FATORES: "soma-os-fatores",

  /** Tabuada: devolveu um múltiplo vizinho */
  TABUADA_TROCADA: "tabuada-trocada",

  /** Decomposição: dobrou uma vez e parou */
  PAROU_NO_DOBRO: "parou-no-dobro",

  /** Decomposição: aplicou a outra estratégia */
  TROCOU_ESTRATEGIA: "trocou-estrategia",

  /** Âncora: devolveu o fato fácil sem fazer o ajuste */
  PAROU_NA_ANCORA: "parou-na-ancora",

  /** Âncora: ajustou para o lado errado */
  DIRECAO_ERRADA: "direcao-errada",

  /** Família ×÷: respondeu o divisor em vez do quociente */
  INVERTE_DIVISAO: "inverte-divisao",

  /** Família ×÷: tratou a divisão como subtração */
  DIVIDE_SUBTRAINDO: "divide-subtraindo",

  /** Valor posicional: aplicou "acrescenta zero" sem entender */
  ACRESCENTA_ZERO_SEM_ENTENDER: "acrescenta-zero-sem-entender",

  /** Valor posicional: deslocou o número errado de ordens */
  ORDEM_ERRADA: "ordem-errada",

  /** Multiplicação armada: esqueceu de somar o reagrupamento */
  ESQUECE_REAGRUPAMENTO: "esquece-reagrupamento",

  /** Modelo de área: multiplicou só uma região e parou */
  PARCELA_UNICA: "parcela-unica",

  /** Modelo de área: partiu pelo algarismo e não pelo valor */
  CORTE_ERRADO: "corte-errado",

  /** Multiplicação armada por 2 dígitos: esqueceu o zero da segunda linha */
  ZERO_ESQUECIDO: "zero-esquecido",

  /** Pareamento: pôs dois ou mais itens no mesmo receptor */
  DISTRIBUICAO_DESIGUAL: "distribuicao-desigual",

  /** Pareamento: deixou receptor vazio com item sobrando */
  PAREAMENTO_INCOMPLETO: "pareamento-incompleto",

  /** Pareamento: julgou por aparência, não por pareamento */
  COMPARACAO_VISUAL: "comparacao-visual",

  /* --- comparação de quantidades (ficha F06 / N1.05) --------------- */
  CONFUNDE_TAMANHO_QUANTIDADE: "confunde-tamanho-quantidade",
  CONSERVACAO_ESPACO: "conservacao-espaco",
  COMPARA_SEM_CONTAR: "compara-sem-contar",

  /* --- sistema decimal (ficha F21 / N2.01) -------------------------- */
  IGNORA_VALOR: "ignora-valor",
  INVERTE_ORDENS: "inverte-ordens",
  NAO_AGRUPA: "nao-agrupa",
  /** @deprecated Compatibilidade com telemetria W3 provisória. */
  IGNORA_DEZENA: "ignora-dezena",
  /** @deprecated Compatibilidade com telemetria W3 provisória. */
  CONCATENA: "concatena-dezena-unidade",
  /** @deprecated Compatibilidade com telemetria W3 provisória. */
  CONTA_TUDO: "conta-tudo-material-dourado",
  /** @deprecated Compatibilidade com telemetria W3 provisória. */
  TROCA_DU: "troca-dezenas-unidades",

  /* --- reta numérica (ficha F19 / N1.12) ---------------------------- */
  /** Saltou para o lado oposto ao pedido. */
  INVERTE_DIRECAO: "inverte-direcao",
  /** Contou marcas/casas em vez dos intervalos entre elas. */
  CONTA_MARCAS: "conta-marcas",
  /** No nível de numerais parciais, posicionou longe da região proporcional esperada. */
  SEM_SENSO_ESPACIAL: "sem-senso-espacial",

  /* --- contagem (fichas F01 e F27) ---------------------------------- */
  RECONTOU: "recontou",
  PULOU: "pulou",
  NAO_TEM_CARDINALIDADE: "nao-tem-cardinalidade",
  DEPENDE_DE_ORDEM: "depende-de-ordem",
  EXCESSO_ACAO: "excesso-acao",
  CONTAGEM_INCOMPLETA: "contagem-incompleta",
  NAO_CONTA_A_PARTIR_DE: "nao-conta-a-partir-de",

  /* --- subitização e padrões ---------------------------------------- */
  CHUTE_SEGURO: "chute-seguro",
  DEPENDE_DE_FORMATO: "depende-de-formato",
  ANCORA_CINCO_RIGIDA: "ancora-cinco-rigida",
  IGNORA_SEGUNDA_MAO: "ignora-segunda-mao",
  COPIA_ULTIMO: "copia-ultimo",
  NAO_VE_UNIDADE: "nao-ve-unidade",
  SO_AB: "so-ab",
  SO_UM_ATRIBUTO: "so-um-atributo",

  /* --- classificação (ficha F51) ------------------------------------ */
  TUDO_CABE: "tudo-cabe",
  CRITERIO_ERRADO: "criterio-errado",
  NAO_RECLASSIFICA: "nao-reclassifica",
  SEM_INTERSECAO: "sem-intersecao",

  /* --- ouvir e escolher (ficha F05) --------------------------------- */
  CONFUNDE_VIZINHO: "confunde-vizinho",
  CONFUSAO_FONOLOGICA: "confusao-fonologica",
  NAO_ESCUTOU: "nao-escutou",
  PRECISA_REPETICAO: "precisa-repeticao",

  /* --- produzir quantidade (ficha F04) ------------------------------ */
  PRODUCAO_INCOMPLETA: "producao-incompleta",
  NAO_MONITORA_ALVO: "nao-monitora-alvo",
  IGNORA_QUANTIDADE: "ignora-quantidade",
  DEPENDE_DE_ANDAIME: "depende-de-andaime",

  /* --- posição no espaço (ficha F47) -------------------------------- */
  INVERTE_PAR: "inverte-par",
  IGNORA_REFERENCIAL: "ignora-referencial",
  ESQUERDA_DIREITA: "esquerda-direita",

  /* --- formas planas (ficha F48) ------------------------------------ */
  SO_ORIENTACAO_PADRAO: "so-orientacao-padrao",
  CONFUNDE_QUADRADO_RETANGULO: "confunde-quadrado-retangulo",
  IGNORA_LADOS: "ignora-lados",

  /* --- comparação de grandezas (ficha F49) -------------------------- */
  BASE_DESALINHADA: "base-desalinhada",
  CONFUNDE_ATRIBUTOS: "confunde-atributos",
  SO_DIFERENCA_GRANDE: "so-diferenca-grande",

  /* --- massa e capacidade (ficha F50 / GM.12) ----------------------- */
  JULGA_PELO_TAMANHO: "julga-pelo-tamanho",
  CONFUNDE_PESO_VOLUME: "confunde-peso-volume",
  IGNORA_FORMATO: "ignora-formato",

  /* --- moldura de dez / parte-todo ---------------------------------- */
  CONTA_VAZIOS: "conta-vazios",
  NAO_USA_ESTRUTURA: "nao-usa-estrutura",
  REPETE_A_PARTE: "repete-a-parte",
  SO_FUNCIONA_VISUAL: "so-funciona-visual",
  RESPONDE_O_CHEIO: "responde-o-cheio",
  SEM_ANCORA_CINCO: "sem-ancora-cinco",
  INVERTE_PERGUNTA: "inverte-pergunta",
  RESPONDE_O_VISIVEL: "responde-o-visivel",
  RESPONDE_O_TODO: "responde-o-todo",
  DEPENDE_DE_ESTRUTURA: "depende-de-estrutura"
} as const;

export type MisconceptionTagType = typeof MisconceptionTag[keyof typeof MisconceptionTag];