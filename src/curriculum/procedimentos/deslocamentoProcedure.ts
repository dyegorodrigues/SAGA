import { MisconceptionTag } from "../../constants/misconceptions";
import { Distrator } from "./tabuadaProcedure";

/**
 * Procedimento do deslocamento de ordens — ficha F67, competência N4.08.
 *
 * **A ideia central, e ela é uma correção:** multiplicar por 10 **desloca cada
 * algarismo uma ordem**. Não "acrescenta zero".
 *
 * **Por que a regra do zero é perigosa.** Ela funciona com inteiros e **quebra
 * com decimais**: 0,5 × 10 não é "0,50". Uma criança que decora "acrescenta
 * zero" acerta por três anos e erra no quarto, sem entender por quê. Ensinar
 * deslocamento evita um erro que só aparece muito depois.
 *
 * **A visualização que sustenta isso:** cada cubinho vira uma barra, cada barra
 * vira uma placa. Todo o material sobe uma ordem de uma vez — e a criança vê
 * que nada foi "acrescentado", tudo foi PROMOVIDO.
 */

export type TipoDeConta = "potencia" | "digito" | "multiplo";

export interface Conta {
  /** O número que sofre a operação. */
  numero: number;
  /** Por quanto: 10, 100, um dígito de 2 a 9, ou um múltiplo como 30 e 400. */
  multiplicador: number;
}

export function tipoDe(multiplicador: number): TipoDeConta {
  if (multiplicador === 10 || multiplicador === 100) return "potencia";
  if (multiplicador < 10) return "digito";
  return "multiplo";
}

export function resolver({ numero, multiplicador }: Conta): number {
  return numero * multiplicador;
}

/** Quantas ordens o número sobe. Dez sobe uma; cem sobe duas. */
export function ordensDeslocadas(multiplicador: number): number {
  if (multiplicador % 100 === 0) return 2;
  if (multiplicador % 10 === 0) return 1;
  return 0;
}

/** O material dourado do número ANTES da operação — nunca o depois. */
export function materialDe(numero: number): { centenas: number; dezenas: number; unidades: number } {
  return {
    centenas: Math.floor(numero / 100),
    dezenas: Math.floor((numero % 100) / 10),
    unidades: numero % 10,
  };
}

/**
 * Como a voz descreve a promoção, sem dizer o resultado.
 *
 * **O texto tem que cobrir as MESMAS viagens que o desenho mostra.** A versão
 * anterior dizia "cada peça sobe duas casas: cubinho vira placa" — prometia
 * *cada* e entregava *uma*. Numa pergunta como `33 × 100`, a criança tem barras
 * e cubinhos, e o texto explicava só metade do material dela.
 */
export function falaDaPromocao(multiplicador: number): string {
  const ordens = ordensDeslocadas(multiplicador);
  if (ordens === 2) {
    return "cada peça sobe duas casas: o cubinho vira placa, a barra vira cubão";
  }
  if (ordens === 1) {
    return "cada peça sobe uma casa: o cubinho vira barra, a barra vira placa, a placa vira cubão";
  }
  return "";
}

/** O que cada nível apresenta, na ordem da ficha F67. */
export function multiplicadoresDoNivel(nivel: number): number[] {
  switch (nivel) {
    case 1: return [10];
    case 2: return [100];
    case 3: return [10];
    case 4: return [2, 3, 4, 5, 6, 7, 8, 9];
    default: return [20, 30, 40, 50, 200, 300, 400];
  }
}

/** O material aparece enquanto a promoção está sendo construída. */
export function mostraMaterial(nivel: number): boolean {
  return nivel <= 2;
}

/**
 * O maior número que o nível apresenta.
 *
 * Onde há material, o número fica pequeno: **85 vira oito barras e cinco
 * cubinhos**, e treze peças numa tela de 390px são ruído, não apoio. A ficha
 * exemplifica com 23 justamente por isso. Sem material, o número pode crescer —
 * o que se treina ali já é o deslocamento, não a leitura das peças.
 */
export function numeroMaximoDoNivel(nivel: number): number {
  return mostraMaterial(nivel) ? 39 : 99;
}

/**
 * O resultado de esquecer o "vai um" da ordem das unidades.
 *
 * Em 27 × 3: sete vezes três é 21, escreve 1 e leva 2; dois vezes três é 6, mais
 * os 2 que vieram dá 8 — resultado 81. Quem esquece o que veio responde 61.
 */
export function semReagrupar({ numero, multiplicador }: Conta): number {
  const dezenas = Math.floor(numero / 10);
  const unidades = numero % 10;
  return dezenas * multiplicador * 10 + ((unidades * multiplicador) % 10);
}

/**
 * Erros com significado.
 *
 * `ACRESCENTA_ZERO_SEM_ENTENDER` só existe onde a regra do zero **falha**: no
 * ×100, quem decorou "acrescenta zero" acrescenta UM e responde 230 em vez de
 * 2300. Com ×10 a regra acerta por acaso, e por isso não há o que diagnosticar
 * ali — a ficha precisa do ×100 para revelar quem decorou.
 */
export function distratores(c: Conta): Distrator[] {
  const certo = resolver(c);
  const tipo = tipoDe(c.multiplicador);
  const candidatos: Distrator[] = [];

  if (tipo === "potencia" && c.multiplicador === 100) {
    candidatos.push({ valor: c.numero * 10, tag: MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER });
    candidatos.push({ valor: c.numero * 1000, tag: MisconceptionTag.ORDEM_ERRADA });
  } else if (tipo === "potencia") {
    candidatos.push({ valor: c.numero * 100, tag: MisconceptionTag.ORDEM_ERRADA });
    candidatos.push({ valor: c.numero, tag: MisconceptionTag.ORDEM_ERRADA });
  } else if (tipo === "multiplo") {
    // Fez a tabuada e esqueceu de deslocar: 12 × 30 vira 36.
    candidatos.push({ valor: certo / (c.multiplicador % 10 === 0 ? 10 : 1), tag: MisconceptionTag.ORDEM_ERRADA });
    candidatos.push({ valor: certo * 10, tag: MisconceptionTag.ORDEM_ERRADA });
  } else {
    candidatos.push({ valor: semReagrupar(c), tag: MisconceptionTag.ESQUECE_REAGRUPAMENTO });
    candidatos.push({ valor: c.numero + c.multiplicador, tag: MisconceptionTag.SOMA_OS_FATORES });
  }
  candidatos.push({ valor: certo - c.multiplicador, tag: MisconceptionTag.TABUADA_TROCADA });

  const vistos = new Set<number>([certo]);
  return candidatos.filter(d => {
    if (!Number.isInteger(d.valor) || d.valor <= 0) return false;
    if (vistos.has(d.valor)) return false;
    vistos.add(d.valor);
    return true;
  }).slice(0, 3);
}

/**
 * Serve para perguntar?
 *
 * Exige que o erro CARACTERÍSTICO do tipo de conta sobreviva. Sem ele a questão
 * distingue quem acertou de quem chutou, mas não diz nada sobre o que a criança
 * entendeu — que é o serviço desta ficha.
 */
export function ehPergunavelComDiagnostico(c: Conta): boolean {
  if (c.numero < 2) return false;
  const tipo = tipoDe(c.multiplicador);
  const tags = new Set(distratores(c).map(d => d.tag));
  if (tipo === "digito") {
    // Sem reagrupamento não há o que a ficha queira diagnosticar no nível 4.
    if ((c.numero % 10) * c.multiplicador < 10) return false;
    return tags.has(MisconceptionTag.ESQUECE_REAGRUPAMENTO);
  }
  if (c.multiplicador === 100) return tags.has(MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER);
  return tags.has(MisconceptionTag.ORDEM_ERRADA);
}

export function alternativas(c: Conta): Distrator[] {
  return [{ valor: resolver(c), tag: "" }, ...distratores(c)];
}
