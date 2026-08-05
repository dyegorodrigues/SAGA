import { Question } from "../types";
import { Composer } from "../curriculum/Composer";
import { N1_01_CONGELADA } from "../curriculum/legado/N1.01.congelada";

/**
 * ⛔ CONGELADO — os alvos de rollback do bloco F0. NÃO SE EDITA, NÃO SE MELHORA.
 *
 * ### Por que este arquivo existe
 *
 * Sete nós do F0 (N1.01, N1.03, N1.04, N1.07, N1.08, N1.10, AL.01) serviam ficha
 * autoral chamando `Composer.generate` de dentro do gerador registrado como
 * *legado*. O efeito era que `selectGenerator` os classificava como `legacy`
 * enquanto entregava conteúdo de ficha — e o rollback do canário, que é a
 * retirada do id de `COMPOSER_CANARIES`, **não devolvia nada**, porque não havia
 * para onde voltar.
 *
 * Este arquivo é o "para onde voltar". Cada função abaixo foi recuperada do git,
 * letra por letra, do estado imediatamente anterior à migração que a apagou
 * (`2550a2b` e `16e18f4`).
 *
 * ### Por que ele não importa nada de `generators.ts`
 *
 * Um alvo de rollback que muda quando o código vivo muda não é alvo de rollback.
 * As três ajudas (`ri`, `pickEmo`, `numOpts`) estão copiadas aqui de propósito:
 * se amanhã `numOpts` mudar de comportamento em `generators.ts`, o rollback
 * continua devolvendo exatamente a tela que a produção servia.
 *
 * Isso também evita um ciclo de importação real — `generators.ts` importa este
 * arquivo, e se este importasse aquele de volta, quem carregasse `legadoF0`
 * primeiro receberia funções `undefined`.
 *
 * ### O que fazer quando algo aqui estiver errado
 *
 * Nada. Consertar é na ficha viva, em `curriculum/fichas/jornada/`. Estas telas
 * são inferiores de propósito: são o que existia antes, não o que deveria
 * existir. A única pergunta que elas respondem é *"a criança consegue continuar
 * jogando se a tela nova quebrar?"*.
 */

/* --- as ajudas, congeladas junto ------------------------------------- */

const EMOJIS_CONGELADOS = ["🍎", "🍌", "⭐", "🐶", "🐱", "🚗", "🎈", "🌸"];

const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickEmo = () => pick(EMOJIS_CONGELADOS);

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function numOpts(ans: number, count: number, min: number, max: number) {
  const lo = Math.min(min, ans);
  const hi = Math.max(max, ans);
  const d = new Set<number>();
  let guard = 0;
  while (d.size < count - 1 && guard++ < 400) {
    const v = Math.random() < 0.7 ? ans + pick([-3, -2, -1, 1, 2, 3]) : ri(lo, hi);
    if (v !== ans && v >= lo && v <= hi) d.add(v);
  }
  let v = lo;
  while (d.size < count - 1) {
    if (v !== ans) d.add(v);
    v += 1;
  }
  return shuffle([ans, ...d]).map(n => ({ label: String(n), value: n }));
}

/* --- os alvos de rollback -------------------------------------------- */

/**
 * N1.01 — pareamento.
 *
 * ⚠️ Exceção deliberada à recuperação literal. O gerador de julho que este
 * substituiria era `kind: "count"` e perguntava *"Quantos temos aqui?"* — numa
 * competência **pré-numérica**, onde a ficha F07 proíbe qualquer numeral. Cair
 * nele seria pior que a falha que o rollback tenta conter.
 *
 * O alvo correto é a ficha `draggroup` que a produção servia até o commit
 * anterior, congelada em `curriculum/legado/N1.01.congelada.ts` e servida por
 * `Composer` a partir dali. É o princípio do PLANO_DO_BLOCO_F0 §1.2: o alvo de
 * rollback é a última tela que a produção serviu, não a mais antiga que existe.
 */
export function legadoN1_01(lvl: number): Question {
  return Composer.generate(N1_01_CONGELADA, lvl, lvl <= 2 ? "a" : "b");
}

/** N1.03 — subitização. Recuperado de `2550a2b^`. */
export function legadoN1_03(lvl: number): Question {
  const n = ri(2, 5);
  return {
    tutorial: lvl === 1 ? [{ say: "Olhe rápido, a caixa vai fechar!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "flash",
    prompt: "Quantos tinham ali?",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, 5, 10),
    answer: n,
    howto: "Preste atenção para não pular.",
    audioPrompt: "Quantos são?",
    explain: "Olhe o desenho todo de uma vez — que formato as bolinhas fizeram?",
  };
}

/** N1.04 — cardinalidade. Recuperado de `2550a2b^`. */
export function legadoN1_04(lvl: number): Question {
  const n = ri(3, 5);
  return {
    tutorial: lvl === 1 ? [{ say: "O último número que você fala é o total!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "count",
    prompt: "Conte tudo e me diga: Quantos SÃO no total?",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, 1, 6),
    answer: n,
    howto: "O último número falado é o total da brincadeira.",
    audioPrompt: "Qual o total?",
    explain: "Conte todos os objetos: o último número que você falar é a resposta total.",
  };
}

/** N1.07 — sucessor na reta. Recuperado de `2550a2b^`. */
export function legadoN1_07(lvl: number): Question {
  const base = ri(1, 8);
  const ans = base + 1;

  if (lvl <= 2) {
    return {
      tutorial: lvl === 1 ? [
        { say: "A reta numérica nos ajuda a ver a ordem." },
        { say: `O que vem logo depois do ${base}?`, show: { saltarDe: base } },
      ] : undefined,
      kind: "numberline",
      nlStart: Math.max(1, base - 2),
      nlEnd: base + 4,
      nlStartPos: base,
      prompt: `Quem vem logo DEPOIS do ${base}?`,
      options: numOpts(ans, 3, 1, 10),
      answer: ans,
      howto: "Dê um salto para a frente na reta numérica.",
      audioPrompt: "Quem vem depois?",
      explain: "Olha para a reta e dê um salto para a frente a partir do número.",
    };
  }
  return {
    tutorial: undefined,
    kind: "plain",
    prompt: `Quem vem logo DEPOIS do ${base}?`,
    big: `${base} ➔ ?`,
    options: numOpts(ans, 3, 1, 10),
    answer: ans,
    howto: "O sucessor é sempre um a mais.",
    audioPrompt: "Quem vem logo depois?",
    explain: "Pense no número que você fala em seguida ao contar para a frente.",
  };
}

/** N1.08 — a caixa mágica (tenframe em flash). Recuperado de `16e18f4^`. */
export function legadoN1_08(lvl: number): Question {
  const n = ri(5, 10);
  return {
    tutorial: lvl === 1
      ? [{ say: "Esta é a caixa mágica! Se a primeira linha estiver cheia, tem 5!" }]
      : undefined,
    excecaoCPA: "perceptual",
    kind: "tenframe",
    uiProps: { flashDurationMs: 1500 },
    prompt: "A Caixa Mágica abriu e fechou! Quantos você viu?",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, 1, 8),
    answer: n,
    howto: "Preste muita atenção e tente não contar um por um.",
    audioPrompt: "Quantos viu?",
    explain: "Tente lembrar da imagem que piscou na caixa sem contar de um em um.",
  };
}

/**
 * N1.10 — decompor. Recuperado de `16e18f4^`, onde era `gVis_TakeApart(lvl)`.
 *
 * A chamada indireta foi resolvida aqui: `gVis_TakeApart` continua vivo em
 * `generatorsVisual.ts` e pode mudar. Congelar significa não depender dele.
 */
export function legadoN1_10(lvl: number): Question {
  const total = ri(4, lvl <= 2 ? 6 : 9);
  const parte = ri(1, total - 1);
  return {
    tutorial: lvl === 1 ? [{ say: "Vamos separar o grupo em duas partes!" }] : undefined,
    kind: "takeapart",
    n: total,
    emoji: pickEmo(),
    prompt: `Separei ${parte}. Quantos ficaram do outro lado?`,
    options: numOpts(total - parte, 3, 1, total),
    answer: total - parte,
    howto: "O todo se separa em duas partes.",
    audioPrompt: "Quantos ficaram?",
    explain: "As duas partes juntas voltam a ser o total.",
  };
}

/** AL.01 — o intruso. Recuperado de `16e18f4^`, onde era `gPreIntruso(lvl)`. */
export function legadoAL_01(_lvl: number): Question {
  return {
    kind: "plain",
    big: "🐶",
    prompt: "Quem não é animal?",
    options: [{ label: "Gato", value: "gato" }, { label: "Carro", value: "carro" }],
    answer: "carro",
  } as Question;
}
