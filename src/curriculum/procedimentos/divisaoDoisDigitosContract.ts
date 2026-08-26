import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { DivisaoDoisDigitosMisconception, type DivisaoDoisDigitosMisconceptionTag } from "../../constants/divisaoDoisDigitosMisconceptions";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { DivisaoDoisDigitosMisconception };
export type { DivisaoDoisDigitosMisconceptionTag };

export type DivisaoDoisDigitosF71Modo =
  | "divisor-redondo"
  | "divisor-quase-redondo"
  | "divisor-geral"
  | "com-resto"
  | "zero-quociente";

export interface DivisaoDoisDigitosF71Spec {
  ficha: "F71";
  nivel: number;
  modo: DivisaoDoisDigitosF71Modo;
  primitivas: ["InteractiveVertical"];
  dividendo: number;
  divisor: number;
  divisorArredondado: number;
  /** Referência pedagógica da resolução demonstrada; nunca é pré-preenchida na tela da criança. */
  estimativaInicial: number;
  quociente: number;
  resto: number;
  ajustePrimeiraEstimativaObrigatorio: boolean;
  acessibilidade: {
    toqueAlternativo: true;
    snapGeneroso: true;
    alvoMinPx: 80;
    erroMotorNaoTag: true;
  };
}

interface DivisaoDoisDigitosF71Show {
  dividendo: number;
  divisor: number;
  divisorArredondado?: number;
  estimativa?: number;
  produtoTeste?: number;
  ajuste?: string;
  resto?: number;
  quociente?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = {
  toqueAlternativo: true as const,
  snapGeneroso: true as const,
  alvoMinPx: 80 as const,
  erroMotorNaoTag: true as const,
};

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const MODOS_F71 = ["divisor-redondo", "divisor-quase-redondo", "divisor-geral", "com-resto", "zero-quociente"] as const;

/**
 * A estimativa que o palco oferece de partida: o quociente arredondado POR
 * BAIXO, em dezenas ou centenas. É por baixo de propósito — uma estimativa que
 * passa do dividendo ensina a recuar, e o que a F71 ensina é a avançar.
 */
const estimativaDe = (quociente: number) => {
  const passo = quociente >= 100 ? 100 : 10;
  return Math.floor(quociente / passo) * passo;
};

/**
 * CLASS-003 — a conta do nível é sorteada, a escada não.
 *
 * Era uma conta por nível: 840÷20, 399÷19, 736÷23, 745÷23 e 2424÷24. A criança
 * estimava o MESMO quociente seis vezes.
 *
 * O degrau de cada nível está no DIVISOR e no resto, não no tamanho do número:
 * redondo em L1, arredondando para cima em L2 — que é o que força o ajuste da
 * primeira estimativa —, geral em L3, com resto em L4 e com zero no quociente
 * em L5. Sortear sem essas amarras trocaria os degraus de lugar.
 */
export function construirDivisaoDoisDigitosF71Spec(level: number): DivisaoDoisDigitosF71Spec {
  const nivel = clamp(level);
  const base = { ficha: "F71" as const, nivel, modo: MODOS_F71[nivel - 1], primitivas: ["InteractiveVertical"] as ["InteractiveVertical"], acessibilidade };

  if (nivel === 1) {
    const divisor = ri(2, 5) * 10;
    // Ímpar de propósito: com quociente múltiplo de dez a estimativa por baixo
    // seria o próprio quociente, e a alternativa "manteve a primeira
    // estimativa" viraria uma segunda resposta certa.
    const quociente = ri(21, 48) | 1;
    return {
      ...base, divisor, divisorArredondado: divisor, dividendo: divisor * quociente,
      estimativaInicial: estimativaDe(quociente), quociente, resto: 0,
      ajustePrimeiraEstimativaObrigatorio: false,
    };
  }

  if (nivel === 2) {
    // Divisor logo abaixo da dezena: arredondar para cima subestima o quociente,
    // e a criança precisa ajustar depois do primeiro teste.
    const dezena = ri(2, 5) * 10;
    const divisor = dezena - ri(1, 2);
    // Quociente múltiplo de dez faria a estimativa por baixo já acertar, e o
    // ajuste que este nível existe para ensinar deixaria de ser necessário.
    const quociente = ri(21, 45) | 1;
    return {
      ...base, divisor, divisorArredondado: dezena, dividendo: divisor * quociente,
      estimativaInicial: estimativaDe(quociente), quociente, resto: 0,
      ajustePrimeiraEstimativaObrigatorio: true,
    };
  }

  if (nivel === 3 || nivel === 4) {
    const dezena = ri(2, 5) * 10;
    const divisor = dezena + ri(1, 3);
    const quociente = ri(21, 40) | 1;
    const resto = nivel === 4 ? ri(1, divisor - 1) : 0;
    return {
      ...base, divisor, divisorArredondado: Math.round(divisor / 10) * 10,
      dividendo: divisor * quociente + resto,
      estimativaInicial: estimativaDe(quociente), quociente, resto,
      ajustePrimeiraEstimativaObrigatorio: false,
    };
  }

  // L5: o quociente precisa carregar um zero no meio — é ele que o nível mede.
  const divisor = ri(11, 49);
  const quociente = ri(1, 9) * 100 + ri(1, 9);
  return {
    ...base, divisor, divisorArredondado: Math.round(divisor / 10) * 10,
    dividendo: divisor * quociente,
    estimativaInicial: estimativaDe(quociente), quociente, resto: 0,
    ajustePrimeiraEstimativaObrigatorio: false,
  };
}

export function avaliarEstimativaF71(spec: DivisaoDoisDigitosF71Spec, estimativa: number): {
  produto: number;
  restoProjetado: number;
  relacao: "passou" | "cabe-mais" | "exata";
} {
  const produto = estimativa * spec.divisor;
  const restoProjetado = spec.dividendo - produto;
  if (produto > spec.dividendo) return { produto, restoProjetado, relacao: "passou" };
  if (estimativa === spec.quociente) return { produto, restoProjetado, relacao: "exata" };
  return { produto, restoProjetado, relacao: "cabe-mais" };
}

/**
 * Evidência de domínio da F71. O mesmo emissor puro é usado pelo palco e pelo
 * gate P13 para impedir que a ficha exija uma condição que o runtime não saiba colher.
 */
export function evidenciasDivisaoDoisDigitosF71(ajustouAposPrimeiroTeste: boolean): string[] {
  return ajustouAposPrimeiroTeste ? [Evidencia.AJUSTE_PRIMEIRA_ESTIMATIVA_F71] : [];
}

export function construirDivisaoDoisDigitosF71Resolucao(
  spec: DivisaoDoisDigitosF71Spec,
): ResolucaoDeclarativa<DivisaoDoisDigitosF71Show, number, DivisaoDoisDigitosMisconceptionTag> {
  const primeiro = avaliarEstimativaF71(spec, spec.estimativaInicial);
  const ajuste = spec.estimativaInicial < spec.quociente ? "aumentar" : spec.estimativaInicial > spec.quociente ? "diminuir" : "confirmar";
  const introducao = spec.modo === "divisor-redondo"
    ? `O divisor já é redondo: ${spec.divisor}. Use ${spec.divisorArredondado} para estimar e depois teste a multiplicação.`
    : spec.modo === "divisor-quase-redondo"
      ? `${spec.divisor} está perto de ${spec.divisorArredondado}. Arredonde só para estimar; o teste sempre usa o divisor real ${spec.divisor}.`
      : `Arredonde ${spec.divisor} para cerca de ${spec.divisorArredondado} e use isso para criar uma primeira estimativa, sem tratar o arredondamento como resposta.`;

  return {
    estadoInicial: { dividendo: spec.dividendo, divisor: spec.divisor, divisorArredondado: spec.divisorArredondado, estimativa: spec.estimativaInicial },
    passos: [
      {
        id: "estimar",
        say: introducao,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, divisorArredondado: spec.divisorArredondado, estimativa: spec.estimativaInicial },
        corrige: [DivisaoDoisDigitosMisconception.NAO_ESTIMA],
        parcial: spec.estimativaInicial,
      },
      {
        id: "testar-por-multiplicacao",
        say: `Teste a estimativa ${spec.estimativaInicial}: ${spec.estimativaInicial} × ${spec.divisor} = ${primeiro.produto}. O produto mostra se essa quantidade de grupos cabe.`,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, estimativa: spec.estimativaInicial, produtoTeste: primeiro.produto },
        parcial: spec.estimativaInicial,
      },
      {
        id: "ajustar",
        say: primeiro.relacao === "passou"
          ? "O produto passou do dividendo, então a estimativa precisa diminuir. Ajustar não é erro: é o mecanismo da divisão por dois dígitos."
          : primeiro.relacao === "cabe-mais"
            ? "O produto ficou abaixo e ainda cabe outro grupo do divisor, então aumente a estimativa e teste de novo. Ajustar é parte da competência."
            : "O produto cabe exatamente; a estimativa já está ajustada.",
        show: { dividendo: spec.dividendo, divisor: spec.divisor, estimativa: spec.quociente, produtoTeste: spec.quociente * spec.divisor, ajuste },
        corrige: [DivisaoDoisDigitosMisconception.NAO_AJUSTA],
        parcial: spec.quociente,
      },
      ...(spec.modo === "com-resto" ? [{
        id: "validar-resto",
        say: `Depois do maior produto que cabe, sobra ${spec.resto}. O resto é válido porque ${spec.resto} é menor que o divisor ${spec.divisor}; se fosse maior ou igual, ainda caberia outro grupo.`,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, quociente: spec.quociente, resto: spec.resto },
        corrige: [DivisaoDoisDigitosMisconception.RESTO_INVALIDO],
        parcial: spec.quociente,
      }] : []),
      ...(spec.modo === "zero-quociente" ? [{
        id: "preservar-zero-posicional",
        say: `O quociente é ${spec.quociente}. O zero no quociente preserva a posição em que o divisor não cabe naquela ordem; apagá-lo mudaria o valor do número.`,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, quociente: spec.quociente, resto: spec.resto },
        parcial: spec.quociente,
      }] : []),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N4.12 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirDivisaoDoisDigitosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.12") throw new Error(`divisaoDoisDigitosContract recebeu ${ficha.id}.`);
  const spec = construirDivisaoDoisDigitosF71Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N4.12 sem micro L${spec.nivel}.`);

  // O enunciado sai do spec. Com a conta fixa ele podia ser escrito à mão; com
  // a CLASS-003 sorteando, um enunciado cravado passaria a mentir sobre a conta
  // desenhada logo abaixo.
  const conta = `${spec.dividendo} ÷ ${spec.divisor}`;
  const prompt = spec.modo === "divisor-redondo"
    ? `Estime quantos grupos de ${spec.divisor} cabem em ${spec.dividendo}, teste a multiplicação e ajuste até fechar a divisão.`
    : spec.modo === "divisor-quase-redondo"
      ? `Para ${conta}, use ${spec.divisorArredondado} como referência, teste com ${spec.divisor} e ajuste a primeira estimativa.`
      : spec.modo === "divisor-geral"
        ? `Em ${conta}, faça uma estimativa, teste por multiplicação e ajuste até encontrar o maior número de grupos que cabe.`
        : spec.modo === "com-resto"
          ? `Em ${conta}, estime, teste e ajuste. Depois confira se o resto é menor que o divisor.`
          : `Em ${conta}, estime e ajuste preservando o zero necessário no quociente.`;

  // O palco F71 não renderiza estas opções: elas documentam o espaço diagnóstico
  // do contrato para Radar/testes sem transformar a tarefa física em múltipla escolha.
  const options: Option[] = [
    { value: spec.quociente, label: "quociente ajustado" },
    { value: Math.max(0, spec.estimativaInicial - 3), label: "chute sem estimativa orientada", misconception: DivisaoDoisDigitosMisconception.NAO_ESTIMA },
    { value: spec.estimativaInicial, label: "manteve a primeira estimativa depois do teste", misconception: DivisaoDoisDigitosMisconception.NAO_AJUSTA },
    { value: spec.quociente + 1, label: "aceitou resto que ainda comporta outro grupo", misconception: DivisaoDoisDigitosMisconception.RESTO_INVALIDO },
  ];

  return {
    kind: "divisao-dois-digitos-f71",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDivisaoDoisDigitosF71Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.quociente,
    exigeEvidencia: spec.ajustePrimeiraEstimativaObrigatorio ? Evidencia.AJUSTE_PRIMEIRA_ESTIMATIVA_F71 : undefined,
    evaluate: answer => Number(answer) === spec.quociente,
  };
}
