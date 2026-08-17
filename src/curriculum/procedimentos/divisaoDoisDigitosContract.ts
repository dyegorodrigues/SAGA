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

export function construirDivisaoDoisDigitosF71Spec(level: number): DivisaoDoisDigitosF71Spec {
  const nivel = clamp(level);
  if (nivel === 1) return { ficha: "F71", nivel, modo: "divisor-redondo", primitivas: ["InteractiveVertical"], dividendo: 840, divisor: 20, divisorArredondado: 20, estimativaInicial: 40, quociente: 42, resto: 0, ajustePrimeiraEstimativaObrigatorio: false, acessibilidade };
  if (nivel === 2) return { ficha: "F71", nivel, modo: "divisor-quase-redondo", primitivas: ["InteractiveVertical"], dividendo: 399, divisor: 19, divisorArredondado: 20, estimativaInicial: 20, quociente: 21, resto: 0, ajustePrimeiraEstimativaObrigatorio: true, acessibilidade };
  if (nivel === 3) return { ficha: "F71", nivel, modo: "divisor-geral", primitivas: ["InteractiveVertical"], dividendo: 736, divisor: 23, divisorArredondado: 20, estimativaInicial: 30, quociente: 32, resto: 0, ajustePrimeiraEstimativaObrigatorio: false, acessibilidade };
  if (nivel === 4) return { ficha: "F71", nivel, modo: "com-resto", primitivas: ["InteractiveVertical"], dividendo: 745, divisor: 23, divisorArredondado: 20, estimativaInicial: 30, quociente: 32, resto: 9, ajustePrimeiraEstimativaObrigatorio: false, acessibilidade };
  return { ficha: "F71", nivel, modo: "zero-quociente", primitivas: ["InteractiveVertical"], dividendo: 2424, divisor: 24, divisorArredondado: 20, estimativaInicial: 100, quociente: 101, resto: 0, ajustePrimeiraEstimativaObrigatorio: false, acessibilidade };
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

  const prompt = spec.modo === "divisor-redondo"
    ? "Estime quantos grupos de 20 cabem em 840, teste a multiplicação e ajuste até fechar a divisão."
    : spec.modo === "divisor-quase-redondo"
      ? "Para 399 ÷ 19, use 20 como referência, teste com 19 e ajuste a primeira estimativa."
      : spec.modo === "divisor-geral"
        ? "Em 736 ÷ 23, faça uma estimativa, teste por multiplicação e ajuste até encontrar o maior número de grupos que cabe."
        : spec.modo === "com-resto"
          ? "Em 745 ÷ 23, estime, teste e ajuste. Depois confira se o resto é menor que o divisor."
          : "Em 2424 ÷ 24, estime e ajuste preservando o zero necessário no quociente.";

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
