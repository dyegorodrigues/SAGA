import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import {
  ehPrimo,
  fatoresDe,
  FatoresRetangulosMisconception,
  type FatoresRetangulosMisconceptionTag,
  maiorFatorComum,
  paresDeFatores,
  tentativaRetangulo,
} from "./fatoresRetangulosProcedure";

export type FatoresRetangulosF66Modo =
  | "pares-com-dica"
  | "todos-pares"
  | "listar-fatores"
  | "identificar-primo"
  | "maior-fator-comum";

export interface FatoresRetangulosF66Option {
  value: number;
  label: string;
  misconception?: FatoresRetangulosMisconceptionTag;
}

export interface FatoresRetangulosF66Spec {
  ficha: "F66";
  nivel: number;
  modo: FatoresRetangulosF66Modo;
  primitivas: ["ArrayGrid"];
  total: number;
  segundoTotal?: number;
  fatores: number[];
  pares: Array<{ linhas: number; colunas: number }>;
  dicaQuantidadePares?: number;
  primo?: boolean;
  maiorFatorComum?: number;
  divisorInicial: number;
  previewDivisorByValue: Record<string, number>;
  resposta: number;
  opcoes: FatoresRetangulosF66Option[];
}

interface FatoresRetangulosF66Show {
  total: number;
  segundoTotal?: number;
  divisor?: number;
  linhasCompletas?: number;
  sobra?: number;
  pares?: Array<{ linhas: number; colunas: number }>;
  fatores?: number[];
  destacarTriviais?: boolean;
  destacarPrimo?: boolean;
  destacarComuns?: number[];
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const option = (value: number, label: string, misconception?: FatoresRetangulosMisconceptionTag): FatoresRetangulosF66Option => ({
  value,
  label,
  ...(misconception ? { misconception } : {}),
});

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];
const listar = (numeros: readonly number[]) => numeros.join(", ");
const parEmTexto = (par: { linhas: number; colunas: number }) => `${par.linhas}×${par.colunas}`;
const PRIMOS_F66 = [11, 13, 17, 19, 23, 29, 31, 37] as const;

/**
 * Divisor de abertura que não desenha o MDC — nem como linha, nem como coluna.
 *
 * Devolve `null` quando o par sorteado não tem abertura segura nenhuma: em
 * 27 com MDC 9, os únicos divisores são 3 e 9, e 27 ÷ 3 é o próprio 9. Esses
 * pares são recusados na origem, não remendados depois.
 */
function aberturaLongeDoMdc(total: number, mdc: number): number | null {
  for (let divisor = 2; divisor < total; divisor += 1) {
    if (total % divisor !== 0) continue;
    if (divisor === mdc || total / divisor === mdc) continue;
    return divisor;
  }
  return null;
}

const PARES_MDC = [[2, 3], [3, 2], [2, 5], [3, 4], [4, 3]] as const;

function sortearParaMdc(): { mdc: number; total: number; segundoTotal: number; abertura: number } {
  for (let tentativa = 0; tentativa < 60; tentativa += 1) {
    const mdc = escolher([6, 8, 9, 12] as const);
    const [a, b] = escolher(PARES_MDC);
    const total = mdc * a;
    const abertura = aberturaLongeDoMdc(total, mdc);
    if (abertura !== null) return { mdc, total, segundoTotal: mdc * b, abertura };
  }
  return { mdc: 6, total: 12, segundoTotal: 18, abertura: 2 };
}

/** Menor número que NÃO divide o total: serve de tentativa que deixa sobra. */
function naoDivisor(total: number): number {
  for (let candidato = 5; candidato < total; candidato += 1) if (total % candidato !== 0) return candidato;
  return total - 1;
}

function totalCom(paresMin: number, faixa: [number, number]): number {
  for (let tentativa = 0; tentativa < 60; tentativa += 1) {
    const total = ri(faixa[0], faixa[1]);
    if (paresDeFatores(total).length >= paresMin) return total;
  }
  return paresMin >= 4 ? 24 : 12;
}

/**
 * CLASS-003 — o número do nível é sorteado, a escada não.
 *
 * Cada nível tinha um total só: 12, 24, 18, 13 e o par 18/24. A ficha cobra 3
 * acertos de 3 em 2 sessões, e a frente da CLASS-007 tornou a fábrica de
 * retângulos operável — a criança operava a fábrica sobre o MESMO número seis
 * vezes.
 *
 * Sortear aqui custa mais que nos outros contratos porque os rótulos eram
 * strings escritas à mão ("1×24, 2×12, 3×8 e 4×6"). Agora rótulo e distrator
 * saem do próprio número, e cada distrator continua nomeando o mesmo erro de
 * antes: parar cedo, esquecer os triviais, tratar múltiplo como fator.
 *
 * Os pisos de quantidade não são estéticos. Com poucos pares os valores dos
 * distratores colidem entre si — em L2, `contagem - 1` encosta no `1` de
 * "parar cedo" — e duas alternativas com o mesmo valor quebram a leitura da
 * resposta. Por isso L2 pede 4 pares, L3 pede 5 fatores e o MDC de L5 fica em
 * 6 ou mais.
 */
export function construirFatoresRetangulosF66Spec(level: number): FatoresRetangulosF66Spec {
  const nivel = clamp(level);
  const base = { ficha: "F66" as const, nivel, primitivas: ["ArrayGrid"] as ["ArrayGrid"] };

  if (nivel === 1) {
    const total = totalCom(3, [8, 40]);
    const pares = paresDeFatores(total);
    const ultimo = pares[pares.length - 1];
    const penultimo = pares[pares.length - 2];
    const sobra = naoDivisor(total);
    const opcoes = [
      option(ultimo.linhas, parEmTexto(ultimo)),
      option(sobra, `${sobra} × ${Math.floor(total / sobra)} e sobram ${total % sobra}`, FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      option(penultimo.linhas, `Parar em ${parEmTexto(penultimo)}`, FatoresRetangulosMisconception.PARA_CEDO),
      option(total, `Esquecer 1 × ${total}`, FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
    ];
    return {
      ...base,
      modo: "pares-com-dica",
      total,
      fatores: fatoresDe(total),
      pares,
      dicaQuantidadePares: pares.length,
      divisorInicial: 2,
      previewDivisorByValue: {
        [String(ultimo.linhas)]: ultimo.linhas,
        [String(sobra)]: sobra,
        [String(penultimo.linhas)]: penultimo.linhas,
        [String(total)]: 1,
      },
      resposta: ultimo.linhas,
      opcoes,
    };
  }

  if (nivel === 2) {
    const total = totalCom(4, [16, 60]);
    const pares = paresDeFatores(total);
    const semTriviais = pares.slice(1);
    const espurio = naoDivisor(total);
    return {
      ...base,
      modo: "todos-pares",
      total,
      fatores: fatoresDe(total),
      pares,
      divisorInicial: pares[pares.length - 1].linhas,
      previewDivisorByValue: {
        [String(pares.length)]: pares[pares.length - 1].linhas,
        [String(pares.length - 1)]: semTriviais[0].linhas,
        "1": pares[pares.length - 1].linhas,
        [String(pares.length + 1)]: espurio,
      },
      resposta: pares.length,
      opcoes: [
        option(pares.length, pares.map(parEmTexto).join(", ")),
        option(pares.length - 1, semTriviais.map(parEmTexto).join(", "), FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
        option(1, `Só ${parEmTexto(pares[pares.length - 1])}`, FatoresRetangulosMisconception.PARA_CEDO),
        option(pares.length + 1, `${pares.map(parEmTexto).join(", ")} e ${espurio}×${Math.floor(total / espurio)}`, FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 3) {
    const total = totalCom(3, [16, 60]);
    const fatores = fatoresDe(total);
    const semTriviais = fatores.slice(1, -1);
    const espurio = naoDivisor(total);
    const comEspurio = [...fatores, espurio].sort((a, b) => a - b);
    return {
      ...base,
      modo: "listar-fatores",
      total,
      fatores,
      pares: paresDeFatores(total),
      divisorInicial: fatores[1],
      previewDivisorByValue: {
        [String(fatores.length)]: fatores[1],
        [String(semTriviais.length)]: semTriviais[0],
        "2": fatores[1],
        [String(fatores.length + 1)]: espurio,
      },
      resposta: fatores.length,
      opcoes: [
        option(fatores.length, listar(fatores)),
        option(semTriviais.length, listar(semTriviais), FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
        option(2, `${fatores[0]}, ${fatores[1]} e parar`, FatoresRetangulosMisconception.PARA_CEDO),
        option(fatores.length + 1, listar(comEspurio), FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 4) {
    const total = escolher(PRIMOS_F66);
    return {
      ...base,
      modo: "identificar-primo",
      total,
      fatores: fatoresDe(total),
      pares: paresDeFatores(total),
      primo: ehPrimo(total),
      divisorInicial: 1,
      previewDivisorByValue: { "1": 1, "0": 2 },
      resposta: 1,
      opcoes: [
        option(1, `Sim — só existe 1 × ${total}`),
        option(0, "Não — deve existir outro retângulo", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  const { mdc, total, segundoTotal, abertura } = sortearParaMdc();
  // Fator comum menor que o MDC, para "parou cedo" ser um erro plausível.
  const comuns = fatoresDe(mdc).filter(fator => fator > 2 && fator < mdc);
  const paraCedo = comuns.length ? comuns[comuns.length - 1] : 2;
  // Fator do segundo número que não divide o primeiro: o múltiplo confundido.
  // ...e diferente de 2, que já é o distrator dos triviais: dois valores iguais
  // apagariam uma das alternativas.
  const naoComum = fatoresDe(segundoTotal).find(fator => fator > 2 && total % fator !== 0 && fator !== paraCedo && fator !== mdc) ?? segundoTotal;
  return {
    ...base,
    modo: "maior-fator-comum",
    total,
    segundoTotal,
    fatores: fatoresDe(total),
    pares: paresDeFatores(total),
    maiorFatorComum: mdc,
    // CLASS-009: a tela não pode abrir mostrando o MDC. Não basta evitar o MDC
    // como divisor — o COMPLEMENTO também o entrega: com total 24 e divisor 2,
    // a grade escreve "12 linhas × 2 colunas", e 12 era a resposta. Com o caso
    // fixo o MDC era 6, de um caractere só, e o gate da CLASS-009 nem olhava;
    // o sorteio trouxe MDC de dois dígitos e o vazamento apareceu.
    divisorInicial: abertura,
    previewDivisorByValue: {
      [String(mdc)]: mdc,
      [String(paraCedo)]: paraCedo,
      [String(naoComum)]: naoComum,
      "2": 2,
    },
    resposta: mdc,
    opcoes: [
      option(mdc, String(mdc)),
      option(paraCedo, String(paraCedo), FatoresRetangulosMisconception.PARA_CEDO),
      option(naoComum, String(naoComum), FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      option(2, "2", FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
    ],
  };
}

export function construirFatoresRetangulosF66Resolucao(
  spec: FatoresRetangulosF66Spec,
): ResolucaoDeclarativa<FatoresRetangulosF66Show, number, FatoresRetangulosMisconceptionTag> {
  const tentativaInvalida = tentativaRetangulo(spec.total, spec.modo === "identificar-primo" ? 2 : 5);
  const comuns = spec.segundoTotal ? spec.fatores.filter(fator => spec.segundoTotal! % fator === 0) : undefined;
  return {
    estadoInicial: { total: spec.total, segundoTotal: spec.segundoTotal, pares: spec.pares },
    passos: [
      {
        id: "fechar-retangulos",
        say: "Um fator fecha um retângulo completo: se sobrar quadradinho, essa medida não é fator.",
        show: { total: spec.total, divisor: tentativaInvalida.divisor, linhasCompletas: tentativaInvalida.linhasCompletas, sobra: tentativaInvalida.sobra },
        corrige: [FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO],
        parcial: spec.resposta,
      },
      {
        id: "varrer-formacoes",
        say: "Continue procurando até esgotar as formações e não esqueça os retângulos triviais 1 × n.",
        show: { total: spec.total, pares: spec.pares, fatores: spec.fatores, destacarTriviais: true },
        corrige: [FatoresRetangulosMisconception.PARA_CEDO, FatoresRetangulosMisconception.ESQUECE_TRIVIAIS],
        parcial: spec.resposta,
      },
      ...(spec.modo === "identificar-primo" ? [{
        id: "ver-primo",
        say: "Número primo é o que tem um único par de fatores: um retângulo trivial 1 × n. Para 13, só existe 1 × 13.",
        show: { total: spec.total, pares: spec.pares, fatores: spec.fatores, destacarTriviais: true, destacarPrimo: true },
        parcial: spec.resposta,
      }] : []),
      ...(spec.modo === "maior-fator-comum" ? [{
        id: "comparar-fatores",
        say: "Liste os fatores dos dois números e escolha o maior que aparece nos dois conjuntos.",
        show: { total: spec.total, segundoTotal: spec.segundoTotal, fatores: spec.fatores, destacarComuns: comuns },
        parcial: spec.resposta,
      }] : []),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N2.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirFatoresRetangulosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.07") throw new Error(`fatoresRetangulosContract recebeu ${ficha.id}.`);
  const spec = construirFatoresRetangulosF66Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N2.07 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "pares-com-dica"
    ? `A dica diz que ${spec.total} tem ${spec.dicaQuantidadePares} formações. Qual completa a lista?`
    : spec.modo === "todos-pares"
      ? `Quais são todos os pares de fatores de ${spec.total}?`
      : spec.modo === "listar-fatores"
        ? `Qual lista contém todos os fatores de ${spec.total}?`
        : spec.modo === "identificar-primo"
          ? `${spec.total} é primo? Use os retângulos para decidir.`
          : `Qual é o maior fator comum de ${spec.total} e ${spec.segundoTotal}?`;

  const options: Option[] = spec.opcoes;
  return {
    kind: "fatores-retangulos-f66",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirFatoresRetangulosF66Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
