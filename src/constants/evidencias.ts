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

  /**
   * F36 (N2.02): a criança concluiu corretamente um percurso vertical de +10
   * no Quadrado100. Três acertos apenas horizontais não provam que ela leu a
   * estrutura decimal da coluna.
   */
  PERCURSO_VERTICAL_QUADRADO100: "percurso-vertical-quadrado100",

  /**
   * F13 (N3.01): pelo menos um acerto no L4, quando os objetos já saíram e os
   * contêineres preservam apenas os numerais. É a ponte exigida antes do símbolo
   * puro: a operação precisa sobreviver sem o suporte concreto.
   */
  ADICAO_SEM_OBJETOS: "adicao-sem-objetos",

  /**
   * F58 (GE.03): a criança encontrou corretamente o eixo de simetria no L4.
   *
   * Contar lados e cantos é leitura de atributo — a figura fica parada e basta
   * olhar. O eixo é o único degrau da ficha em que ela precisa dobrar a figura
   * mentalmente e conferir se cada ponto encontra o seu reflexo. Três acertos
   * distribuídos pelos níveis de atributo não provam essa passagem.
   */
  SIMETRIA_EIXO: "detetive-formas-simetria-nivel-4",

  /**
   * F45 (N5.01): ao menos uma divisão em partes **realmente iguais** no L4.
   *
   * Cortar em três é fácil; cortar em três partes iguais é a competência. Sem
   * esta condição, a criança que reparte de qualquer jeito e acerta o nome da
   * fração passaria como quem entendeu "metade, terço e quarto".
   */
  PARTES_IGUAIS_DIVISAO: "partes-iguais-corte-nivel-4",

  /**
   * F72 (N5.02): a passagem correta pela **reta numérica**, do L3 em diante.
   *
   * É onde a fração deixa de ser "pedaço de pizza" e vira **número com lugar
   * próprio**. Enquanto ela só pinta partes de um inteiro, dá para acertar sem
   * nunca aceitar que 3/4 fica entre 0 e 1. O equívoco que esta evidência
   * fecha é contar as marcas da reta em vez dos intervalos.
   */
  FRACAO_NUMERO_RETA: "fracao-numero-reta-nivel-3mais",

  /**
   * F75 (N6.01): uma comparação decimal correta no L4.
   *
   * O equívoco alvo tem nome e é teimoso: comparar 25 com 5 e concluir que
   * 0,25 é maior que 0,5, lendo os algarismos como se fossem inteiros. Acertar
   * onde o número mais "comprido" é o menor é o que prova valor posicional.
   */
  DECIMAL_COMPARACAO: "decimal-comparacao-nivel-4",

  /**
   * F73 (N5.03): comparar frações de **mesmo numerador** no L4.
   *
   * É o degrau contraintuitivo da equivalência: com o numerador fixo, quanto
   * maior o denominador, MENOR a fração. Quem julga por "mais partes, mais
   * quantidade" acerta os degraus anteriores e erra exatamente aqui.
   */
  FRACAO_MESMO_NUMERADOR: "fracao-mesmo-numerador-nivel-4",

  /**
   * F69 (N4.10): um quociente correto **com zero no meio**, no L5.
   *
   * O zero intermediário é onde a divisão longa quebra: a criança pula a
   * posição vazia e o quociente encurta um algarismo. Dividir sem nunca
   * encontrar esse caso não prova domínio do algoritmo, prova sorte no sorteio.
   */
  DIVISAO_ZERO_QUOCIENTE: "divisao-zero-quociente-nivel-5",

  /**
   * F63 (GM.07): um acerto no L4 distinguindo a distância da **borda** do
   * número de quadrados do interior.
   *
   * Somar lados em retângulos fáceis não basta para provar perímetro: a criança
   * pode ainda usar a linguagem de área e apenas coincidir com a resposta. O
   * contraste explícito no L4 prova que "a volta" e "o chão" são grandezas
   * diferentes antes de avançar para o lado faltante.
   */
  PERIMETRO_VS_AREA: "perimetro-vs-area-nivel-4",

  /**
   * F71 (N4.12): pelo menos uma divisão em que a **primeira estimativa precisou
   * ser ajustada depois da multiplicação de teste**.
   *
   * Acertar apenas casos em que o primeiro palpite coincide com o quociente não
   * prova o mecanismo central de dividir por dois dígitos. A competência inclui
   * ler o produto de teste, decidir aumentar/diminuir e testar novamente.
   */
  AJUSTE_PRIMEIRA_ESTIMATIVA_F71: "ajuste-primeira-estimativa-f71",

  /**
   * F88 (N6.04): ao menos um acerto em que a relação proporcional foi preservada
   * com um **fator de escala não inteiro**. Dobrar ou triplicar corretamente não
   * prova que a criança entendeu a relação geral; este caso impede domínio por
   * memorização de escalas inteiras familiares.
   */
  ESCALA_NAO_INTEIRA_F88: "escala-nao-inteira-f88",

  /**
   * F90 (AL.08): ao menos um acerto real no L3 ou acima, quando resolver já
   * exige desfazer coeficiente ou encadear transformações equivalentes. A
   * evidência impede domínio composto apenas por x + a = b e x - a = b.
   */
  EQUACAO_L3_MAIS_F90: "equacao-l3-mais-f90",

  /**
   * F76 (N6.02): um acerto no L2 com números que possuem quantidades diferentes
   * de casas decimais. A prova exige alinhar ordens pela vírgula e tornar a casa
   * ausente explícita com zero; acertar só contas com formatos iguais não basta.
   */
  CONTAS_VIRGULA_CASAS_DIFERENTES_F76: "contas-virgula-casas-diferentes-f76",

  /**
   * F94 (GM.11): ao menos uma resposta correta no caso de **dimensão faltante**.
   * A ficha canônica exige explicitamente que o domínio 3/3 em duas sessões
   * inclua esse caso; aqui a evidência conecta a exigência ao palco que de fato
   * observa a criança recuperar a altura por volume ÷ área da base.
   */
  DIMENSAO_FALTANTE_F94: "dimensao-faltante-f94",

  /**
   * F95 (PE.04): ao menos uma chance foi representada corretamente como fração
   * dos casos favoráveis sobre o total. A condição impede domínio apenas por
   * linguagem verbal de "mais provável" sem quantificar a probabilidade.
   */
  CHANCE_FRACAO_F95: "chance-fracao-f95",

  /**
   * F86 (N5.05): ao menos uma multiplicação fração × fração foi resolvida
   * corretamente pela interseção de duas partições do mesmo inteiro. A prova
   * impede domínio apenas por fração de inteiro ou aplicação mecânica da regra.
   */
  FRACAO_VEZES_FRACAO_F86: "fracao-vezes-fracao-f86",
} as const;

export type EvidenciaType = typeof Evidencia[keyof typeof Evidencia];