/**
 * As condições da §9 — o que cada ficha exige ter visto pelo menos uma vez.
 *
 * ---
 *
 * ### Por que existe um catálogo (pendência P13)
 *
 * Algumas fichas escrevem, na §9, uma segunda condição além da contagem de
 * acertos. Todas dizem a mesma coisa com palavras diferentes:
 *
 * > *acertar não basta; é preciso ter acertado uma vez **na condição que prova
 * > a competência**.*
 *
 * O nome da condição aparece em dois lugares distantes um do outro — a ficha,
 * que a **exige**, e o procedimento, que a **emite**. Uma string solta em cada
 * ponta é a receita para eles divergirem em silêncio: a ficha esperaria
 * `"sem-andaime"`, o palco emitiria `"semAndaime"`, e a coroa nunca viria sem
 * que nada acusasse. Mesma razão do catálogo de `MisconceptionTag`.
 *
 * ### O que NÃO entra aqui
 *
 * Condição garantida pela própria escada de níveis não é evidência — é
 * consequência. A F47 pede *"cobrir pelo menos dois pares diferentes"*, e cada
 * nível dela É um par: chegar ao nível 5 já obriga a ter passado pelos outros.
 * Declarar isso seria pedir ao motor que verificasse o que a estrutura já
 * garante, e todo campo que se verifica sozinho vira ruído.
 */
export const Evidencia = {
  /**
   * F51 (AL.01): uma peça que não satisfaz o critério foi **corretamente deixada
   * fora**. Este é o coração da ficha: "não pertence" é uma decisão certa, não
   * ausência de resposta.
   */
  NAO_PERTENCE: "nao-pertence",

  /** F01 (N1.04): um acerto no arranjo **disperso**. */
  ARRANJO_DISPERSO: "arranjo-disperso",

  /** F05 (N1.06): um acerto **na primeira audição**, sem repetir. */
  PRIMEIRA_AUDICAO: "primeira-audicao",

  /** F04 (N1.13): um acerto **sem vaga fantasma**. */
  SEM_ANDAIME: "sem-andaime",

  /** F48 (GE.02): um acerto com a forma **girada**. */
  FORMA_GIRADA: "forma-girada",

  /** F49 (GM.01): um acerto com **diferença pequena**. */
  DIFERENCA_PEQUENA: "diferenca-pequena",

  /** F50 (GM.12): um acerto em caso **contraintuitivo**. */
  CASO_CONTRAINTUITIVO: "caso-contraintuitivo",

  /** F02 (N1.08): um acerto com quantidade **entre 6 e 10**. */
  ESTRUTURA_DAS_DUAS_FILEIRAS: "estrutura-das-duas-fileiras",

  /** JD5 (N1.10): um acerto com total **acima de cinco**. */
  TOTAL_ALEM_DE_CINCO: "total-alem-de-cinco",

  /** JD5 (N1.10): um acerto com os objetos realmente SOLTOS, sem moldura. */
  SEM_MOLDURA: "sem-moldura",

  /** F21 (N2.01): no nível 4, numeral → material correto. */
  MONTOU_DO_NUMERAL: "montou-do-numeral",

  /** F19 (N1.12): pelo menos um acerto em um salto para trás. */
  SALTO_PARA_TRAS: "salto-para-tras",

  /** F61 (GM.05): posicionou a régua com a marca zero na ponta do objeto. */
  ALINHOU_ZERO: "alinhou-zero",

  /** F29 (N2.03): um acerto simbólico no L3+ sem objetos de apoio. */
  COMPARACAO_SIMBOLICA_SEM_OBJETOS: "comparacao-simbolica-sem-objetos",

  /**
   * F36 (N2.02): concluiu corretamente um percurso vertical de +10 no
   * Quadrado100. Três acertos apenas horizontais não provam a estrutura decimal.
   */
  PERCURSO_VERTICAL_QUADRADO100: "percurso-vertical-quadrado100",

  /**
   * F13 (N3.01): um acerto no L4, em que os contêineres preservam as parcelas
   * mas os objetos já foram retirados. Prova que a adição sobreviveu à retirada
   * do suporte concreto antes do símbolo puro do L5.
   */
  ADICAO_SEM_OBJETOS: "adicao-sem-objetos",
} as const;

export type EvidenciaType = typeof Evidencia[keyof typeof Evidencia];
