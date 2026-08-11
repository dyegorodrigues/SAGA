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

  /**
   * F01 (N1.04): um acerto no arranjo **disperso**.
   *
   * *"Contar em fila não prova cardinalidade — prova que ela segue um caminho."*
   */
  ARRANJO_DISPERSO: "arranjo-disperso",

  /**
   * F05 (N1.06): um acerto **na primeira audição**, sem repetir.
   *
   * *"Acertar depois de ouvir cinco vezes não prova reconhecimento."*
   */
  PRIMEIRA_AUDICAO: "primeira-audicao",

  /**
   * F04 (N1.13): um acerto **sem vaga fantasma**.
   *
   * *"Produzir com o alvo visível não prova cardinalidade produtiva."* Com as
   * vagas na tela, preencher todas é correspondência um-a-um — outra ficha.
   */
  SEM_ANDAIME: "sem-andaime",

  /**
   * F48 (GE.02): um acerto com a forma **girada**.
   *
   * É a ficha inteira: *"sem isso, o app ensina a reconhecer desenhos, não
   * formas"*. E é a evidência que obriga a colheita fora do nível 5 — o nível 5
   * da F48 é o dos sólidos, onde giro não existe.
   */
  FORMA_GIRADA: "forma-girada",

  /**
   * F49 (GM.01): um acerto com **diferença pequena**.
   *
   * Acertar três diferenças gritantes mostra que ela enxerga, não que compara.
   */
  DIFERENCA_PEQUENA: "diferenca-pequena",

  /**
   * F50 (GM.12): um acerto em caso **contraintuitivo** — formato/tamanho aponta para o lado errado.
   * A competência é conservação; sem este caso, três acertos óbvios não a provam.
   */
  CASO_CONTRAINTUITIVO: "caso-contraintuitivo",

  /**
   * F02 (N1.08): um acerto com quantidade **entre 6 e 10**.
   *
   * É o que exige usar a estrutura das DUAS fileiras — abaixo de seis, a
   * criança resolve na fileira de cima e a moldura de dez não é testada.
   */
  ESTRUTURA_DAS_DUAS_FILEIRAS: "estrutura-das-duas-fileiras",

  /**
   * JD5 (N1.10): um acerto com total **acima de cinco**.
   *
   * §9: *"pelo menos um acerto no nível 4+, que exige memória de trabalho
   * real"*. Guardar três na cabeça é subitização; guardar oito é memória.
   */
  TOTAL_ALEM_DE_CINCO: "total-alem-de-cinco",

  /**
   * JD5 (N1.10): um acerto com os objetos realmente SOLTOS, sem a geometria
   * residual da moldura. É a prova de retirada do andaime antes da notação.
   */
  SEM_MOLDURA: "sem-moldura",

  /**
   * F21 (N2.01): no nível 4, a criança recebeu o NUMERAL e construiu o material
   * correto a partir dele. É a prova bidirecional explícita da §9: reconhecer
   * material pronto não basta; precisa saber produzir dezenas/unidades.
   */
  MONTOU_DO_NUMERAL: "montou-do-numeral",

  /**
   * F19 (N1.12): pelo menos um acerto em um salto para trás.
   * A §9 exige esta direção explicitamente para impedir que três acertos só
   * avançando sejam confundidos com domínio bidirecional da reta.
   */
  SALTO_PARA_TRAS: "salto-para-tras",

  /**
   * F61 (GM.05): a criança posicionou a régua — por arrasto ou pela alternativa
   * motora equivalente — com a marca ZERO na ponta do objeto antes de ler.
   * Régua já alinhada pelo app não satisfaz esta evidência.
   */
  ALINHOU_ZERO: "alinhou-zero",

  /**
   * F29 (N2.03): um acerto simbólico no L3+ sem objetos de apoio.
   *
   * É a retirada verificável do andaime concreto: comparar grupos não basta
   * para provar que >, < e = foram compreendidos como registro da relação.
   */
  COMPARACAO_SIMBOLICA_SEM_OBJETOS: "comparacao-simbolica-sem-objetos",
} as const;

export type EvidenciaType = typeof Evidencia[keyof typeof Evidencia];
