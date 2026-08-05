import {
  Conta, Regiao, alternativas, corteVemMarcado, falaDoCorte,
  algoritmoSoNaAula, mostraAlgoritmo, mostraArea, partir, regioes, resolver, separaRegioes,
} from "./areaProcedure";

/**
 * Contrato da tela de N4.09 — ficha F68, o Modelo de Área.
 *
 * ---
 *
 * **A regra que governa tudo aqui: as regiões não carregam o total.** Cada
 * região anuncia o próprio produto parcial (40, 12), e a soma delas é o que a
 * criança precisa fazer. Escrever `52` em qualquer lugar da tela transformaria
 * a aula em leitura.
 *
 * **O algoritmo entra ao lado, nunca resolvido.** Do nível 3 em diante a conta
 * armada aparece com as parcelas visíveis e o resultado em aberto — é a
 * sincronia entre a região e a linha do algoritmo que dá sentido ao "zero da
 * segunda linha". Uma conta armada já somada seria o gabarito com aparência de
 * andaime (§6.14).
 */

export interface RegiaoSpec {
  linhas: number;
  colunas: number;
  /** O produto parcial. A criança soma; a tela não. */
  valor: number;
  /** "4 fileiras de 10" — descreve a FORMA, nunca o total do retângulo inteiro. */
  descricao: string;
}

export interface LinhaDoAlgoritmo {
  /** "13 × 4" ou "13 × 10", já escrito. */
  conta: string;
  /** O valor da parcela, que a criança confere contra a região. */
  parcela: number;
}

/**
 * O número se abrindo: `15 = 10 + 5`.
 *
 * Existe porque a tela mostrava o RESULTADO da partição sem mostrar a partição:
 * dois quadrados prontos, e a criança sem ver de onde saíram. Esta linha é o
 * primeiro elo do caminho, e cada parte já vem na cor da coluna que vai ocupar.
 */
export interface AberturaSpec {
  inteiro: number;
  dezenas: number;
  unidades: number;
  /** Como se fala, para quem não lê. */
  falado: string;
}

export interface AreaSpec {
  pergunta: string;
  falado: string;
  /** O número se abrindo. Some junto com a área, no nível 5. */
  abertura: AberturaSpec | null;
  /**
   * O MULTIPLICADOR se abrindo, quando ele também tem dois dígitos.
   *
   * No nível 4 os dois fatores se partem: as colunas vêm de `15 = 10 + 5` e as
   * fileiras de `13 = 10 + 3`. A tela mostrava só a primeira abertura, e o `3`
   * das fileiras aparecia do nada — um adulto leu `10 × 3 = 30` e perguntou o
   * que o três tinha a ver com a conta. Tinha tudo, e a tela não dizia.
   */
  aberturaDoMultiplicador: AberturaSpec | null;
  /** As regiões do retângulo. Vazio no nível 5, onde a área já saiu. */
  regioes: RegiaoSpec[];
  /** O corte já vem desenhado (nível 1) ou a criança o imagina? */
  corteMarcado: boolean;
  /** As regiões aparecem afastadas umas das outras? Ver `separaRegioes`. */
  regioesSeparadas: boolean;
  /** A dica do corte, em palavras. Nunca contém o produto. */
  corte: string | null;
  /** A conta armada ao lado, com as parcelas mas SEM o total. */
  algoritmo: LinhaDoAlgoritmo[] | null;
  /**
   * A conta armada só deve aparecer durante a micro-aula (nível 4).
   *
   * Ela existe no spec — a aula precisa dela — mas a tela a esconde enquanto a
   * criança responde. Ver `algoritmoSoNaAula` e Bíblia §12.3-bis.
   */
  algoritmoSoNaAula: boolean;
  alternativas: { valor: number; tag: string }[];
  resposta: number;
  /** A conta fechada — só depois de responder. */
  recapitulacao: string;
}

function descrever(r: Regiao): string {
  return `${r.linhas} ${r.linhas === 1 ? "fileira" : "fileiras"} de ${r.colunas}`;
}

/**
 * As linhas da conta armada. Cada linha é uma FILEIRA de regiões do retângulo —
 * é essa correspondência que a ficha manda iluminar em sincronia.
 *
 * Com `b` de dois dígitos são duas linhas: `13 × 4` e `13 × 10`. Escrever a
 * segunda como `13 × 10`, e não `13 × 1`, é o ponto inteiro da ficha — o zero
 * não é regra de escrita, é o valor do algarismo.
 *
 * **Com `b` de um dígito o retângulo tem uma fileira só, e a linha dela seria
 * `13 × 4 = 52`: a resposta, escrita no andaime.** Nesse caso as linhas passam
 * a ser as COLUNAS — `10 × 4` e `3 × 4` — que é a forma transicional do
 * algoritmo e mostra exatamente as duas regiões. Barrado por aplicar a regra do
 * §6.14, não por ter levado o tombo.
 */
function montarAlgoritmo(c: Conta): LinhaDoAlgoritmo[] {
  // Unidades primeiro: é assim que a conta armada se escreve e se lê, de baixo
  // para cima. O retângulo lê ao contrário (a dezena fica à esquerda, como no
  // número), e está certo assim — a ligação entre linha e região é pelo VALOR,
  // que a coreografia acende, não pela posição na lista.
  const porFileira = partir(c.b).filter(x => x > 0).reverse();
  if (porFileira.length > 1) {
    return porFileira.map(p => ({ conta: `${c.a} × ${p}`, parcela: c.a * p }));
  }
  return partir(c.a)
    .filter(x => x > 0)
    .reverse()
    .map(p => ({ conta: `${p} × ${c.b}`, parcela: p * c.b }));
}

export function construirAreaSpec(c: Conta, nivel: number): AreaSpec {
  const comArea = mostraArea(nivel);
  return {
    pergunta: `${c.a} × ${c.b}`,
    falado: `${c.a} vezes ${c.b}`,
    abertura: comArea
      ? {
          inteiro: c.a,
          dezenas: partir(c.a)[0],
          unidades: partir(c.a)[1],
          falado: `${c.a} é ${partir(c.a)[0]} mais ${partir(c.a)[1]}`,
        }
      : null,
    aberturaDoMultiplicador: comArea && c.b >= 10
      ? {
          inteiro: c.b,
          dezenas: partir(c.b)[0],
          unidades: partir(c.b)[1],
          falado: `${c.b} é ${partir(c.b)[0]} mais ${partir(c.b)[1]}`,
        }
      : null,
    regioes: comArea
      ? regioes(c).map(r => ({ linhas: r.linhas, colunas: r.colunas, valor: r.valor, descricao: descrever(r) }))
      : [],
    corteMarcado: corteVemMarcado(nivel),
    regioesSeparadas: separaRegioes(nivel),
    corte: comArea ? falaDoCorte(c) : null,
    algoritmo: mostraAlgoritmo(nivel) ? montarAlgoritmo(c) : null,
    algoritmoSoNaAula: algoritmoSoNaAula(nivel),
    alternativas: alternativas(c).map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: resolver(c),
    recapitulacao: `${c.a} × ${c.b} = ${resolver(c)}`,
  };
}

/**
 * A tela contém a resposta em algum lugar antes de a criança responder?
 *
 * Vale para o número, não para o formato. `13 × 14 = ?` não revela nada, mas uma
 * parcela de valor 182 revelaria — e foi assim que o apoio de N4.04 entregou o
 * gabarito escondido dentro de uma equação mascarada (§6.20).
 */
export function enunciadoNaoRevela(spec: AreaSpec): boolean {
  const texto = [
    spec.pergunta, spec.falado, spec.corte,
    spec.abertura?.falado, spec.aberturaDoMultiplicador?.falado,
    ...spec.regioes.map(r => r.descricao),
  ].filter(Boolean).join(" ");
  const numeros = (texto.match(/\d+/g) ?? []).map(Number);
  const valores = [
    ...spec.regioes.map(r => r.valor),
    ...(spec.algoritmo ?? []).map(l => l.parcela),
  ];
  return !numeros.includes(spec.resposta) && !valores.includes(spec.resposta);
}
