import { MisconceptionTagF29 } from "../../constants/misconceptionsF29";
import { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";

export type SimboloComparacao = ">" | "<" | "=";
export type TipoLadoComparacao = "grupo" | "numeral" | "expressao";

export interface LadoComparacaoSimbolica {
  tipo: TipoLadoComparacao;
  valor: number;
  texto: string;
}

export interface ComparacaoSimbolicaSpec {
  nivel: number;
  lados: [LadoComparacaoSimbolica, LadoComparacaoSimbolica];
  resposta: SimboloComparacao;
  andaime: "jacare-animado" | "jacare" | "jacare-estatico" | "nenhum";
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function relacao(a: number, b: number): SimboloComparacao {
  return a > b ? ">" : a < b ? "<" : "=";
}

function parComRelacao(max: number, sorteio: () => number): [number, number] {
  const alvo = inteiro(0, 2, sorteio); // >, < e = aparecem de verdade.
  const base = inteiro(1, Math.max(2, max - 2), sorteio);
  const delta = inteiro(1, Math.min(4, Math.max(1, max - base)), sorteio);
  if (alvo === 0) return [Math.min(max, base + delta), base];
  if (alvo === 1) return [base, Math.min(max, base + delta)];
  return [base, base];
}

function expressaoComValor(valor: number, sorteio: () => number): string {
  if (valor <= 1) return `${valor} + 0`;
  const primeira = inteiro(1, valor - 1, sorteio);
  return `${primeira} + ${valor - primeira}`;
}

function lado(tipo: TipoLadoComparacao, valor: number, sorteio: () => number): LadoComparacaoSimbolica {
  return {
    tipo,
    valor,
    texto: tipo === "expressao" ? expressaoComValor(valor, sorteio) : String(valor),
  };
}

/**
 * F29: quantidade → comparação → símbolo. O jacaré é só andaime visual; a
 * resposta é sempre calculada pelos valores e continua válida sem ele.
 */
export function construirComparacaoSimbolicaSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): ComparacaoSimbolicaSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const max = clamped === 1 ? 10 : clamped <= 3 ? 20 : 100;
  const [a, b] = parComRelacao(max, sorteio);

  let lados: [LadoComparacaoSimbolica, LadoComparacaoSimbolica];
  if (clamped === 1) {
    lados = [lado("grupo", a, sorteio), lado("grupo", b, sorteio)];
  } else if (clamped === 2) {
    const grupoNaEsquerda = sorteio() < 0.5;
    lados = grupoNaEsquerda
      ? [lado("grupo", a, sorteio), lado("numeral", b, sorteio)]
      : [lado("numeral", a, sorteio), lado("grupo", b, sorteio)];
  } else if (clamped <= 4) {
    lados = [lado("numeral", a, sorteio), lado("numeral", b, sorteio)];
  } else {
    lados = [lado("expressao", a, sorteio), lado("expressao", b, sorteio)];
  }

  return {
    nivel: clamped,
    lados,
    resposta: relacao(a, b),
    andaime: clamped === 1 ? "jacare-animado" : clamped === 2 ? "jacare" : clamped === 3 ? "jacare-estatico" : "nenhum",
    enunciado: clamped <= 3 ? "Para onde o jacaré olha? Escolha o símbolo." : "Qual símbolo completa a comparação?",
    falado: clamped <= 3
      ? "Compare os dois lados. A boca aberta do jacaré fica virada para o maior."
      : "Compare os valores dos dois lados e escolha maior, menor ou igual.",
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N2.03 sem micro do nível ${nivel}.`);
  return micro;
}

function opcoesDaRelacao(resposta: SimboloComparacao) {
  return ([">", "<", "="] as SimboloComparacao[]).map(value => {
    let misconception: string | undefined;
    if (value !== resposta) {
      if (value === "=" && resposta !== "=") misconception = MisconceptionTagF29.IGNORA_DIFERENCA;
      else if (resposta === "=") misconception = MisconceptionTagF29.NAO_COMPARA_SIMBOLO;
      else misconception = MisconceptionTagF29.INVERTE_SIMBOLO;
    }
    return {
      label: value,
      value,
      ...(misconception ? { tag: misconception, misconception } : {}),
    };
  });
}

/** Builder especializado e local da W6. Não cria dispatch genérico `groups`. */
export function construirComparacaoSimbolicaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.03") throw new Error(`comparacaoSimbolicaContract recebeu ${ficha.id}.`);
  const spec = construirComparacaoSimbolicaSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "comparacao-simbolica",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
    },
    ...(micro.dominio.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options: opcoesDaRelacao(spec.resposta),
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
