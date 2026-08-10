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
  ZERO_ESQUECIDO: "zero-esquecido",

  /** Pareamento: pôs dois ou mais itens no mesmo receptor — não tem a regra "um e só um" */
  DISTRIBUICAO_DESIGUAL: "distribuicao-desigual",

  /** Pareamento: deixou receptor vazio com item sobrando — perdeu o fio, não varreu todos */
  PAREAMENTO_INCOMPLETO: "pareamento-incompleto",

  /** Pareamento: disse que sobrou quando não sobrou — julgou pela aparência, não pelo pareamento */
  COMPARACAO_VISUAL: "comparacao-visual",

  /* --- comparação de quantidades (ficha F06 / N1.05) --------------- */

  /** F06: julgou o tamanho físico dos itens como se fosse quantidade. */
  CONFUNDE_TAMANHO_QUANTIDADE: "confunde-tamanho-quantidade",

  /** F06: julgou a área ocupada/espalhamento como se fosse quantidade. */
  CONSERVACAO_ESPACO: "conservacao-espaco",

  /** F06: escolheu pela impressão global sem contar ou parear quando a diferença deixou de ser óbvia. */
  COMPARA_SEM_CONTAR: "compara-sem-contar",

  /* --- contagem (fichas F01 e F27) ---------------------------------- */

  /** Contar tocando: contou o mesmo objeto duas vezes — o dedo não marcou o que já passou */
  RECONTOU: "recontou",

  /** Contar tocando: perdeu um objeto pelo caminho — o fio se rompeu no arranjo difícil */
  PULOU: "pulou",

  /**
   * Contar tocando: **o marco cognitivo**. Ela contou tudo, ouviu o último número,
   * e ainda assim recontou para responder "quantos são?". Não sabe que o último
   * número dito É a quantidade — ele soou como o nome do último objeto.
   */
  NAO_TEM_CARDINALIDADE: "nao-tem-cardinalidade",

  /** Contar tocando: acerta em fila e erra no disperso — conta só com apoio espacial */
  DEPENDE_DE_ORDEM: "depende-de-ordem",

  /** Contagem rítmica: disparou mais vezes que havia alvos — não monitora o que resta */
  EXCESSO_ACAO: "excesso-acao",

  /** Contagem rítmica: parou antes de acabar — perdeu o fio ou o engajamento */
  CONTAGEM_INCOMPLETA: "contagem-incompleta",

  /** Contagem rítmica: mandada continuar do 4, começou do 1 — não desacoplou a sequência do início */
  NAO_CONTA_A_PARTIR_DE: "nao-conta-a-partir-de",

  /* --- subitização e padrões (fichas JD1, JD2 e F52) ----------------- */

  /**
   * Relance: escolheu a alternativa do MEIO sem ter visto.
   *
   * É uma hipótese sobre posição, não sobre valor — e por isso o construtor de
   * alternativas precisa variar onde a resposta cai. Com a certa sempre no meio,
   * chutar o meio acertaria sempre e a tag nunca poderia existir.
   */
  CHUTE_SEGURO: "chute-seguro",

  /**
   * Relance: acerta com apoio de formato (fila, padrão de dado, mão canônica) e
   * erra sem ele. Subitiza a FIGURA, não a quantidade.
   */
  DEPENDE_DE_FORMATO: "depende-de-formato",

  /** Mão relâmpago: responde 5 a qualquer mão com o polegar levantado — fixou "mão = 5" */
  ANCORA_CINCO_RIGIDA: "ancora-cinco-rigida",

  /** Mão relâmpago: com duas mãos, responde o de uma só — não integra os dois conjuntos */
  IGNORA_SEGUNDA_MAO: "ignora-segunda-mao",

  /** Padrões: repetiu o último elemento visto em vez de continuar a regra — **o alvo da F52** */
  COPIA_ULTIMO: "copia-ultimo",

  /** Padrões: não identifica o pedaço que se repete */
  NAO_VE_UNIDADE: "nao-ve-unidade",

  /** Padrões: só resolve o AB; erra assim que a unidade cresce */
  SO_AB: "so-ab",

  /**
   * Padrões: no crescente alternado, continuou UMA das duas regras e esqueceu a
   * outra — acertou a quantidade e errou o objeto, ou o contrário.
   *
   * Não é "não vê a unidade": ela viu o padrão, e viu metade dele. O tratamento
   * é a moldura deslizando sobre as duas regras, não voltar ao AB.
   */
  SO_UM_ATRIBUTO: "so-um-atributo",

  /* --- classificação (ficha F51) ------------------------------------ */

  /**
   * Classificar: força tudo para dentro do laço.
   *
   * É o erro que a F51 §2 chama de *"o que quase ninguém ensina"*: a criança
   * acha que **tudo tem que caber em alguma caixa**. Deixar corretamente de
   * fora é resposta certa, e esta tag existe para o app perceber quando ela
   * ainda não sabe disso.
   */
  TUDO_CABE: "tudo-cabe",

  /** Classificar: agrupou por outro atributo — separou por forma onde o critério era cor */
  CRITERIO_ERRADO: "criterio-errado",

  /** Classificar: o critério mudou e ela continuou no anterior — não reclassifica */
  NAO_RECLASSIFICA: "nao-reclassifica",

  /** Classificar: não aceita que uma peça pertença a DOIS grupos ao mesmo tempo */
  SEM_INTERSECAO: "sem-intersecao",

  /* --- ouvir e escolher (ficha F05) --------------------------------- */

  /** Ouvir e escolher: escolheu o numeral vizinho — ouviu certo, não reconhece o símbolo */
  CONFUNDE_VIZINHO: "confunde-vizinho",

  /**
   * Ouvir e escolher: escolheu um número que SOA parecido (seis/sete, três/treze).
   *
   * Não é o mesmo que vizinho numérico: 3 e 13 estão a dez de distância e
   * confundem mais que 3 e 4. Tratar as duas coisas como uma faria o Radar
   * mandar treinar contagem quando o que falhou foi o ouvido.
   */
  CONFUSAO_FONOLOGICA: "confusao-fonologica",

  /** Ouvir e escolher: escolheu a primeira opção sem ter ouvido de novo */
  NAO_ESCUTOU: "nao-escutou",

  /** Ouvir e escolher: acertou depois de repetir muitas vezes — reconhecimento ainda não automático */
  PRECISA_REPETICAO: "precisa-repeticao",

  /* --- produzir quantidade (ficha F04) ------------------------------ */

  /** Produzir: parou antes do pedido — perdeu a conta durante a ação */
  PRODUCAO_INCOMPLETA: "producao-incompleta",

  /** Produzir: tentou colocar mais que o pedido — não segurou o número na memória enquanto agia */
  NAO_MONITORA_ALVO: "nao-monitora-alvo",

  /**
   * Produzir: despejou a bandeja inteira — não processou o número, agiu por impulso.
   *
   * É um caso particular de `NAO_MONITORA_ALVO` e por isso vem antes dele no
   * diagnóstico (§6.8): quem esvazia a bandeja também passou do pedido, e
   * testar o genérico primeiro apagaria este para sempre. As aulas são
   * diferentes — uma criança perdeu a conta, a outra nem começou a contar.
   */
  IGNORA_QUANTIDADE: "ignora-quantidade",

  /**
   * Produzir: acerta com as vagas fantasma na tela e erra sem elas.
   *
   * A única tag do bloco que **nenhuma questão isolada** produz: é a comparação
   * entre duas questões. É também o que a §9 da F04 exige para dar domínio —
   * "produzir com o alvo visível não prova cardinalidade produtiva".
   */
  DEPENDE_DE_ANDAIME: "depende-de-andaime",

  /* --- posição no espaço (ficha F47) -------------------------------- */

  /** Posição: trocou a preposição pela oposta — em cima por embaixo, dentro por fora */
  INVERTE_PAR: "inverte-par",

  /**
   * Posição: escolheu sem olhar em relação a quê — tocou o próprio referencial.
   *
   * Com dois objetos na cena, todo erro de escolha é o objeto oposto: se o
   * diagnóstico só olhasse os objetos, `INVERTE_PAR` seria a única tag possível.
   * É por isso que o referencial também é tocável.
   */
  IGNORA_REFERENCIAL: "ignora-referencial",

  /** Posição: errou no par que exige lateralidade — outra aula, não vocabulário */
  ESQUERDA_DIREITA: "esquerda-direita",

  /* --- formas planas (ficha F48) ------------------------------------ */

  /**
   * Formas: não reconhece a forma girada — **o alvo da ficha**.
   *
   * A assinatura é dupla: a certa estava GIRADA e ela escolheu uma que estava
   * EM PÉ. É a conduta que a §2 descreve nome por nome — "ela memorizou uma
   * imagem, não a propriedade".
   */
  SO_ORIENTACAO_PADRAO: "so-orientacao-padrao",

  /** Formas: trocou quadrado por retângulo — não comparou o comprimento dos lados */
  CONFUNDE_QUADRADO_RETANGULO: "confunde-quadrado-retangulo",

  /** Formas: escolheu pela aparência geral, sem contar os lados */
  IGNORA_LADOS: "ignora-lados",

  /* --- comparação de grandezas (ficha F49) -------------------------- */

  /**
   * Grandezas: julgou sem a referência do chão.
   *
   * A §2 da F49 obriga a tela a alinhar as bases — e com elas alinhadas, quem
   * sobe mais É o mais alto: a condição que produz este erro foi removida da
   * tela de propósito. A assinatura que sobra vem da §4: a linha de chão **se
   * desenha** na abertura, e responder antes dela é decidir sem referência.
   */
  BASE_DESALINHADA: "base-desalinhada",

  /** Grandezas: comparou largura quando a pergunta era altura — julgou o volume */
  CONFUNDE_ATRIBUTOS: "confunde-atributos",

  /** Grandezas: acerta a diferença gritante e erra a pequena — enxerga, não compara */
  SO_DIFERENCA_GRANDE: "so-diferenca-grande",

  /* --- massa e capacidade (ficha F50 / GM.12) ----------------------- */

  /** Massa/capacidade: julgou pela aparência mesmo quando a referência contradizia. */
  JULGA_PELO_TAMANHO: "julga-pelo-tamanho",

  /** Massa: usou volume/tamanho aparente como substituto do peso. */
  CONFUNDE_PESO_VOLUME: "confunde-peso-volume",

  /** Capacidade: comparou a altura do líquido sem neutralizar o formato do recipiente. */
  IGNORA_FORMATO: "ignora-formato",

  /* --- a moldura de dez (fichas F02, JD3 e JD5) ---------------------- */

  /** Moldura: somou as casas vazias às cheias — não distingue ocupado de vago */
  CONTA_VAZIOS: "conta-vazios",

  /**
   * Moldura: acerta até 5 e erra de 6 a 10 — **o mais importante da F02**.
   *
   * Não vê a fileira cheia como unidade: conta as dez de uma em uma, e a
   * estrutura que a ficha existe para instalar não se instalou.
   */
  NAO_USA_ESTRUTURA: "nao-usa-estrutura",

  /**
   * Moldura relâmpago: disse quantas fichas HÁ, não quantas faltam.
   *
   * A JD3 §6 chama de "a tag-chave": *"não é descuido — é a criança fazendo
   * exatamente o que o olho pede"*. O olho é treinado para contar o que está
   * lá; contar o que não está é uma inversão perceptual.
   */
  /** Parte-todo/amigos do 10: repetiu a parte que ja estava dada. */
  REPETE_A_PARTE: "repete-a-parte",

  /**
   * Amigos do 10: funciona em material/diagrama, mas ainda nao transferiu para
   * a sentenca simbolica. E diagnostico longitudinal, nunca de um clique so.
   */
  SO_FUNCIONA_VISUAL: "so-funciona-visual",

  RESPONDE_O_CHEIO: "responde-o-cheio",

  /** Moldura relâmpago: erra quando faltam mais de 5 — não usa a fileira como unidade */
  SEM_ANCORA_CINCO: "sem-ancora-cinco",

  /**
   * Moldura de dez, nível 5: respondeu quantos TEM onde a pergunta era quantos
   * faltam — *"não processou o complemento"* (F02 §6).
   *
   * ⚠️ É o mesmo gesto que a `RESPONDE_O_CHEIO` da JD3, e são duas tags de
   * propósito. Cada ficha nomeia a sua, e o nome é o que a Oficina lê: na F02 o
   * tratamento é a moldura mostrando os dois números fechando dez; na JD3 é a
   * ficha inteira, porque lá a inversão **é** a competência. Unificar as duas
   * mandaria a criança da F02 para a oficina errada.
   */
  INVERTE_PERGUNTA: "inverte-pergunta",

  /** Ver e imaginar: respondeu o número de visíveis — leu a tela, não operou */
  RESPONDE_O_VISIVEL: "responde-o-visivel",

  /** Ver e imaginar: respondeu o total — não entendeu que a pergunta é sobre a parte oculta */
  RESPONDE_O_TODO: "responde-o-todo",

  /** Ver e imaginar: acerta com moldura e erra sem — não tem imagem mental estável */
  DEPENDE_DE_ESTRUTURA: "depende-de-estrutura"
} as const;

export type MisconceptionTagType = typeof MisconceptionTag[keyof typeof MisconceptionTag];