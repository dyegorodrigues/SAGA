import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * F68 — O Modelo de Área. Partir para multiplicar.
 *
 * ---
 *
 * **O que a criança aprende:** que `13 × 4` se resolve **partindo** em
 * `(10 × 4) + (3 × 4)`.
 *
 * **Por que o modelo vem ANTES do algoritmo.** Sem ele, o "zero da segunda
 * linha" da conta armada é mágica: a criança escreve um zero porque mandaram.
 * Com ele, ela vê que aquela linha é o retângulo das DEZENAS, e o zero deixa de
 * ser regra e passa a ser consequência.
 *
 * **A propriedade que aparece sozinha.** Isto é a distributiva. A criança a usa
 * anos antes de saber o nome — e quando o nome chegar, ela já sabe o que
 * significa. `(a+b)×c` é o mesmo retângulo partido, e quem entendeu aqui
 * entende em álgebra.
 *
 * Este arquivo é **procedimento puro**: só matemática e decisão pedagógica,
 * nenhuma tela. O que ele decide é testável sem renderizar nada.
 */

export interface Conta {
  /** O número que se parte. Sempre de dois dígitos. */
  a: number;
  /** O multiplicador. Um dígito nos níveis 1–3, dois nos níveis 4–5. */
  b: number;
}

export interface Regiao {
  linhas: number;
  colunas: number;
  /** O produto parcial desta região. */
  valor: number;
  /** Como se fala esta região em voz alta, sem símbolo. */
  fala: string;
}

/** O menor e o maior `a` da ficha: dois dígitos, sempre. */
export const A_MIN = 11;
export const A_MAX = 29;

/**
 * Parte um número em dezenas e unidades.
 *
 * É o corte do retângulo. `13` vira `[10, 3]` — e é **10**, não **1**: partir
 * pelo algarismo em vez de pelo valor é exatamente o erro `CORTE_ERRADO`.
 */
export function partir(n: number): [number, number] {
  const dezenas = Math.floor(n / 10) * 10;
  return [dezenas, n - dezenas];
}

/** O multiplicador tem dois dígitos? É isso que dobra o número de regiões. */
export function multiplicadorDeDoisDigitos(b: number): boolean {
  return b >= 10;
}

/**
 * As regiões do retângulo partido.
 *
 * Uma partição por fator: com `b` de um dígito são **duas** regiões (o
 * multiplicador não se parte); com `b` de dois dígitos são **quatro** — e é aí
 * que a multiplicação de dois dígitos passa a fazer sentido, porque cada região
 * é uma das parcelas do algoritmo.
 *
 * Regiões de valor zero são descartadas: `20 × 4` não tem região das unidades,
 * e desenhar um retângulo de largura zero mostraria uma borda sem conteúdo —
 * moldura vazia lida como bug (Padrão Ouro §6.6).
 */
export function regioes(c: Conta): Regiao[] {
  const [aDez, aUni] = partir(c.a);
  const colunasDe = [aDez, aUni].filter(x => x > 0);
  const linhasDe = multiplicadorDeDoisDigitos(c.b) ? partir(c.b).filter(x => x > 0) : [c.b];
  const fora: Regiao[] = [];
  for (const linhas of linhasDe) {
    for (const colunas of colunasDe) {
      fora.push({
        linhas,
        colunas,
        valor: linhas * colunas,
        fala: `${linhas} vezes ${colunas} é ${linhas * colunas}`,
      });
    }
  }
  return fora;
}

export function resolver(c: Conta): number {
  return c.a * c.b;
}

/** A soma das regiões é sempre o produto. É o teorema que a tela desenha. */
export function somaDasRegioes(c: Conta): number {
  return regioes(c).reduce((s, r) => s + r.valor, 0);
}

/* ------------------------------------------------------------------ *
 *  A escada dos cinco níveis, transcrita da tabela da ficha F68 §5.
 *  Transcrita, não parafraseada: escrever a própria distribuição e depois
 *  testá-la contra si mesma foi o erro §6.11.
 * ------------------------------------------------------------------ */

/** Níveis 1–3 usam multiplicador de um dígito; 4 e 5, de dois. */
export function digitosDoMultiplicador(nivel: number): 1 | 2 {
  return nivel >= 4 ? 2 : 1;
}

/** O corte já vem marcado no nível 1; do 2 em diante a criança o faz. */
export function corteVemMarcado(nivel: number): boolean {
  return nivel <= 1;
}

/** A conta armada aparece ao lado da área a partir do nível 3. */
export function mostraAlgoritmo(nivel: number): boolean {
  return nivel >= 3;
}

/** No nível 5 só sobra o algoritmo: a área já foi internalizada. */
export function mostraArea(nivel: number): boolean {
  return nivel <= 4;
}

/* ------------------------------------------------------------------ *
 *  Diagnóstico — ficha F68 §6
 * ------------------------------------------------------------------ */

export interface Distrator {
  valor: number;
  tag: MisconceptionTagType;
}

/** Multiplicou a região grande e parou: não somou as partes. */
export function parcelaUnica(c: Conta): number {
  const rs = regioes(c);
  return Math.max(...rs.map(r => r.valor));
}

/**
 * Partiu pelo ALGARISMO em vez do valor: leu o 1 de 13 como um, não como dez.
 *
 * `13 × 4` vira `(1×4) + (3×4) = 16`. É o erro que o corte existe para tornar
 * visível — e some sozinho quando a criança vê que a região grande tem dez
 * colunas, não uma.
 */
export function corteErrado(c: Conta): number {
  const [aDez, aUni] = partir(c.a);
  return (aDez / 10 + aUni) * c.b;
}

/**
 * Esqueceu o zero da segunda linha da conta armada.
 *
 * Só existe com multiplicador de dois dígitos — e é, segundo a ficha, **o erro
 * que o modelo de área previne**. `13 × 14` vira `52 + 13 = 65` em vez de
 * `52 + 130 = 182`.
 */
export function zeroEsquecido(c: Conta): number | null {
  if (!multiplicadorDeDoisDigitos(c.b)) return null;
  const [bDez, bUni] = partir(c.b);
  return c.a * bUni + c.a * (bDez / 10);
}

export function distratores(c: Conta): Distrator[] {
  const certo = resolver(c);
  const candidatos: Distrator[] = [
    { valor: parcelaUnica(c), tag: MisconceptionTag.PARCELA_UNICA },
    { valor: corteErrado(c), tag: MisconceptionTag.CORTE_ERRADO },
  ];
  const zero = zeroEsquecido(c);
  if (zero !== null) candidatos.push({ valor: zero, tag: MisconceptionTag.ZERO_ESQUECIDO });

  const vistos = new Set<number>([certo]);
  return candidatos.filter(d => {
    if (d.valor <= 0 || vistos.has(d.valor)) return false;
    vistos.add(d.valor);
    return true;
  });
}

/**
 * A pergunta produz diagnóstico?
 *
 * Uma conta em que os dois erros característicos colidem com a resposta — ou
 * entre si — não distingue nada: a criança erra e o Radar não aprende. Melhor
 * não perguntar do que perguntar sem poder ler o erro.
 */
export function ehPergunavelComDiagnostico(c: Conta): boolean {
  if (c.a < A_MIN || c.a > A_MAX) return false;
  // Sem região de unidades não há corte para ensinar: 20 × 4 é deslocamento
  // (N4.08), não modelo de área.
  if (partir(c.a)[1] === 0) return false;
  const tags = distratores(c).map(d => d.tag);
  return tags.includes(MisconceptionTag.PARCELA_UNICA)
    && tags.includes(MisconceptionTag.CORTE_ERRADO);
}

/** As alternativas na tela, no teto de 3–4 do cânone §9.1. */
export function alternativas(c: Conta): Distrator[] {
  const certo: Distrator = { valor: resolver(c), tag: "correta" as MisconceptionTagType };
  const outras = distratores(c).slice(0, 3);
  return [certo, ...outras];
}

/**
 * As contas de um nível.
 *
 * Devolve a lista inteira em vez de sortear aqui: sortear dentro do
 * procedimento tornaria o teste dependente do acaso, e o Composer já é o dono
 * do sorteio.
 */
export function contasDoNivel(nivel: number): Conta[] {
  const bs = digitosDoMultiplicador(nivel) === 2
    ? [11, 12, 13, 14, 15, 21, 22, 23, 24, 25]
    : [2, 3, 4, 5, 6, 7, 8, 9];
  const fora: Conta[] = [];
  for (let a = A_MIN; a <= A_MAX; a += 1) {
    for (const b of bs) {
      const c = { a, b };
      if (ehPergunavelComDiagnostico(c)) fora.push(c);
    }
  }
  return fora;
}

/** A fala do corte, sem dizer o resultado. */
export function falaDoCorte(c: Conta): string {
  const [dez, uni] = partir(c.a);
  return `Vamos partir o ${c.a} em ${dez} mais ${uni}.`;
}
