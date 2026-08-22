import type { Quadrado100Spec } from "./quadrado100Contract";
import { Quadrado100Evidence, Quadrado100Misconception } from "./quadrado100Semantics";

/**
 * Assinatura processual F36. A resposta final sozinha não diz se a criança
 * leu a coluna, tentou caminhar horizontalmente ou precisou revisar o percurso.
 */
export interface AcaoQuadrado100 {
  modo: Quadrado100Spec["modo"];
  inicio: number;
  caminho: number[];
  /** Todos os toques, corretos e incorretos, em ordem temporal. */
  toques: number[];
  /** Apenas destinos incorretos, preservados para diagnóstico longitudinal. */
  erros: number[];
  esperado: number;
  ultimoToque: number;
  acertosParciais: number;
  revisoes: number;
  completo: boolean;
}

function origemAtual(acao: AcaoQuadrado100): number {
  if (acao.acertosParciais <= 0) return acao.inicio;
  return acao.caminho[Math.min(acao.acertosParciais - 1, acao.caminho.length - 1)] ?? acao.inicio;
}

function errosConsecutivosUmAUm(acao: AcaoQuadrado100): boolean {
  if (acao.erros.length < 2) return false;
  const dois = acao.erros.slice(-2);
  return Math.abs(dois[1] - dois[0]) === 1;
}

/**
 * Diagnóstico só usa decisão precisa em casa errada. Erro motor de toque é
 * filtrado antes no boundary comum; aqui se interpreta apenas a semântica do
 * destino escolhido.
 */
export function diagnosticarQuadrado100(
  acao: AcaoQuadrado100,
  spec: Quadrado100Spec,
): string | undefined {
  if (acao.completo || acao.ultimoToque === acao.esperado) return undefined;

  const origem = origemAtual(acao);
  const deltaEscolhido = acao.ultimoToque - origem;

  if (spec.modo === "vertical") {
    // Dois destinos errados consecutivos andando de um em um sustentam uma
    // hipótese de estratégia; um único erro lateral continua sendo só direção.
    if (errosConsecutivosUmAUm(acao)) return Quadrado100Misconception.SO_CONTA_UM_A_UM;
    if (Math.abs(deltaEscolhido) === 1) return Quadrado100Misconception.CONFUNDE_DIRECAO;
    return Quadrado100Misconception.NAO_VE_PADRAO_DEZENA;
  }

  if (spec.modo === "vizinho" && Math.abs(spec.passo) === 10) {
    if (Math.abs(deltaEscolhido) === 1) return Quadrado100Misconception.CONFUNDE_DIRECAO;
    return Quadrado100Misconception.NAO_VE_PADRAO_DEZENA;
  }

  return undefined;
}

export function evidenciasQuadrado100(
  acao: AcaoQuadrado100,
  spec: Quadrado100Spec,
): string[] {
  if (acao.completo && spec.modo === "vertical") {
    return [Quadrado100Evidence.PERCURSO_VERTICAL];
  }
  return [];
}
