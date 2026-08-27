import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const ExpressaoF77Misconception = {
  RESOLVE_DA_ESQUERDA: "resolve-da-esquerda",
  IGNORA_PARENTESES: "ignora-parenteses",
  SO_INCOGNITA_NO_FIM: "so-incognita-no-fim",
} as const;
export type ExpressaoF77MisconceptionTag = typeof ExpressaoF77Misconception[keyof typeof ExpressaoF77Misconception];
export type ExpressaoF77Modo = "mesma-ordem" | "precedencia" | "parenteses" | "incognita-meio" | "propriedades";

export interface ExpressaoF77Opcao { value: number; label: string; misconception?: ExpressaoF77MisconceptionTag }
export interface ExpressaoF77Spec {
  nivel: number;
  modo: ExpressaoF77Modo;
  expressao: string;
  ladoDireito: string;
  prioridade: string;
  resposta: number;
  opcoes: ExpressaoF77Opcao[];
}
interface ExpressaoF77Show { expressao: string; ladoDireito: string; prioridade: string; destacarPrioridade?: boolean; colapsarPrioridade?: boolean; equilibrar?: boolean }

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

/**
 * As quatro alternativas, se e só se forem quatro números distintos e positivos.
 *
 * Devolve `null` quando o sorteio colidiu — é o chamador que tenta de novo. Um
 * remendo no valor deslocaria o distrator para longe do erro que ele nomeia, e
 * a alternativa deixaria de descrever alguém.
 */
function alternativas(certa: number, erradas: ExpressaoF77Opcao[]): ExpressaoF77Opcao[] | null {
  const todas = [{ value: certa, label: String(certa) }, ...erradas];
  const valores = todas.map(item => item.value);
  if (new Set(valores).size !== todas.length) return null;
  if (valores.some(valor => valor <= 0 || !Number.isInteger(valor))) return null;
  return todas;
}
const erro = (value: number, misconception?: ExpressaoF77MisconceptionTag): ExpressaoF77Opcao =>
  ({ value, label: String(value), ...(misconception ? { misconception } : {}) });

/**
 * CLASS-003 — os números mudam, a ordem não.
 *
 * A expressão era uma só por nível: 18÷3×2, 2+3×4, (2+3)×4, 3+□×2=11 e
 * (4+3)×5. As respostas certas eram 12, 14, 20, 4 e 35, para sempre.
 *
 * A escada é a ORDEM que cada nível ensina — mesma ordem, precedência,
 * parênteses, incógnita no meio, distributiva — e a forma da expressão continua
 * a mesma em cada degrau. O que passa a variar são os números dentro dela.
 */
export function construirExpressaoF77Spec(level: number): ExpressaoF77Spec {
  const nivel = clamp(level);

  for (let tentativa = 0; tentativa < 200; tentativa += 1) {
    if (nivel === 1) {
      // A divisão precisa ser exata: "mesma ordem" com resto produziria um
      // número quebrado que o nível ainda não sabe escrever.
      const divisor = ri(2, 9);
      const quociente = ri(2, 9);
      const dividendo = divisor * quociente;
      const fator = ri(2, 9);
      const opcoes = alternativas(quociente * fator, [
        erro(quociente), erro(dividendo), erro(divisor * fator),
      ]);
      if (!opcoes) continue;
      return {
        nivel, modo: "mesma-ordem", expressao: `${dividendo} ÷ ${divisor} × ${fator}`,
        ladoDireito: "?", prioridade: `${dividendo} ÷ ${divisor}`,
        resposta: quociente * fator, opcoes,
      };
    }

    if (nivel === 2) {
      const parcela = ri(2, 9);
      const fatorA = ri(2, 9);
      const fatorB = ri(2, 9);
      const opcoes = alternativas(parcela + fatorA * fatorB, [
        // Somar antes de multiplicar: o erro que o nível existe para pegar.
        erro((parcela + fatorA) * fatorB, ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA),
        erro(fatorA * fatorB), erro(parcela + fatorA),
      ]);
      if (!opcoes) continue;
      return {
        nivel, modo: "precedencia", expressao: `${parcela} + ${fatorA} × ${fatorB}`,
        ladoDireito: "?", prioridade: `${fatorA} × ${fatorB}`,
        resposta: parcela + fatorA * fatorB, opcoes,
      };
    }

    if (nivel === 3) {
      const primeira = ri(2, 9);
      const segunda = ri(2, 9);
      const fator = ri(2, 9);
      const opcoes = alternativas((primeira + segunda) * fator, [
        // Ignorar o parêntese devolve exatamente a conta de L2.
        erro(primeira + segunda * fator, ExpressaoF77Misconception.IGNORA_PARENTESES),
        erro(primeira * fator), erro(primeira + segunda + fator),
      ]);
      if (!opcoes) continue;
      return {
        nivel, modo: "parenteses", expressao: `(${primeira} + ${segunda}) × ${fator}`,
        ladoDireito: "?", prioridade: `(${primeira} + ${segunda})`,
        resposta: (primeira + segunda) * fator, opcoes,
      };
    }

    if (nivel === 4) {
      const parcela = ri(2, 9);
      const fator = ri(2, 6);
      const incognita = ri(2, 9);
      const resultado = parcela + incognita * fator;
      const opcoes = alternativas(incognita, [
        // Quem trata a incógnita como último operando resolve "a + □ = total".
        erro(resultado - parcela, ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM),
        erro(resultado - fator), erro(fator),
      ]);
      if (!opcoes) continue;
      return {
        nivel, modo: "incognita-meio", expressao: `${parcela} + □ × ${fator}`,
        ladoDireito: String(resultado), prioridade: `□ × ${fator}`,
        resposta: incognita, opcoes,
      };
    }

    const primeira = ri(2, 9);
    const segunda = ri(2, 9);
    const fator = ri(2, 9);
    const opcoes = alternativas((primeira + segunda) * fator, [
      erro(primeira + segunda * fator), erro(primeira * fator), erro(segunda * fator),
    ]);
    if (!opcoes) continue;
    return {
      nivel, modo: "propriedades", expressao: `(${primeira} + ${segunda}) × ${fator}`,
      ladoDireito: `${primeira} × ${fator} + ${segunda} × ${fator}`, prioridade: "distributiva",
      resposta: (primeira + segunda) * fator, opcoes,
    };
  }
  throw new Error(`AL.06 L${nivel}: não achei quatro alternativas distintas.`);
}

export function construirExpressaoF77Resolucao(spec: ExpressaoF77Spec): ResolucaoDeclarativa<ExpressaoF77Show, number, ExpressaoF77MisconceptionTag> {
  const base = { expressao: spec.expressao, ladoDireito: spec.ladoDireito, prioridade: spec.prioridade };
  return {
    estadoInicial: base,
    passos: [
      { id: "encontrar-pacote", say: `Primeiro encontre o pacote: ${spec.prioridade}.`, show: { ...base, destacarPrioridade: true }, corrige: [ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA, ExpressaoF77Misconception.IGNORA_PARENTESES], parcial: spec.resposta },
      { id: "resolver-pacote", say: "Resolva esse pacote antes de continuar com o restante.", show: { ...base, destacarPrioridade: true, colapsarPrioridade: true }, corrige: [ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA], parcial: spec.resposta },
      { id: "preservar-equilibrio", say: "A incógnita pode estar em qualquer lugar; o que importa é manter os dois lados com o mesmo valor.", show: { ...base, equilibrar: true }, corrige: [ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirExpressaoF77Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.06") throw new Error(`expressaoF77Contract recebeu ${ficha.id}.`);
  const spec = construirExpressaoF77Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.06 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "incognita-meio" ? `Qual número torna ${spec.expressao} = ${spec.ladoDireito}?` : spec.modo === "propriedades" ? `As duas formas são equivalentes. Quanto vale ${spec.expressao}?` : `Quanto vale ${spec.expressao}?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "expressao-f77",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirExpressaoF77Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
