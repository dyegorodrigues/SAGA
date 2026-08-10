import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import { EventoManipulacao, podeGerarDiagnostico } from "./filtroMotor";
import type { ReguaSpec } from "./reguaContract";

export interface SolturaReguaInput {
  /** left da régua no mesmo plano do objeto, em px. */
  rulerLeft: number;
  /** left da ponta inicial do objeto, em px. */
  objectLeft: number;
  /** distância física entre duas marcas inteiras da régua, em px. */
  unitPx: number;
  duracaoMs?: number;
}

export interface AcaoDeRegua {
  alinhado: boolean;
  marcaAlinhada: number;
  alinhouManualmente?: boolean;
  valorEscolhido?: number;
  valorCerto?: number;
  unidadeEscolhida?: string;
  unidadeCerta?: string;
  itemEscolhido?: string;
  itemCerto?: string;
  estimouAntes?: boolean;
  estimativa?: number;
  manipulacao?: EventoManipulacao;
}

/**
 * Resolve a geometria do alinhamento ANTES de qualquer julgamento conceitual.
 *
 * A régua começa no zero. O que importa é qual MARCA caiu sobre a ponta do
 * objeto. Solturas perto do zero recebem snap generoso; solturas precisas sobre
 * outra marca são decisões conceituais observáveis. Na dúvida, o filtro motor
 * continua soberano (§8.3-bis da Bíblia).
 */
export function resolverSolturaRegua(
  input: SolturaReguaInput,
  _spec: ReguaSpec,
): AcaoDeRegua {
  const unitPx = Math.max(1, Math.abs(input.unitPx));
  const rawMark = (input.objectLeft - input.rulerLeft) / unitPx;
  const nearest = Math.round(rawMark);
  const raioDeSnap = unitPx * 0.45;
  const distanciaDoZeroCorreto = Math.abs(input.rulerLeft - input.objectLeft);

  // Perto do zero: a intenção está correta; a régua trava no lugar certo.
  if (Math.abs(rawMark) <= 0.45) {
    return {
      alinhado: true,
      marcaAlinhada: 0,
      manipulacao: {
        distanciaDoAlvoCorreto: distanciaDoZeroCorreto,
        raioDeSnap,
        duracaoMs: input.duracaoMs,
      },
    };
  }

  // Uma marca inteira deliberadamente pousou na ponta: decisão observável.
  if (nearest >= 0 && Math.abs(rawMark - nearest) <= 0.28) {
    return {
      alinhado: false,
      marcaAlinhada: nearest,
      manipulacao: {
        distanciaDoAlvoCorreto: distanciaDoZeroCorreto,
        raioDeSnap,
        duracaoMs: input.duracaoMs,
        precisoEmDestinoErrado: nearest !== 0,
      },
    };
  }

  // Nem sequer escolheu uma marca: é soltura motora, não conceito.
  return {
    alinhado: false,
    marcaAlinhada: nearest,
    manipulacao: {
      distanciaDoAlvoCorreto: distanciaDoZeroCorreto,
      raioDeSnap,
      duracaoMs: input.duracaoMs,
      foraDeAlvoValido: true,
    },
  };
}

export function diagnosticarRegua(
  acao: AcaoDeRegua,
  _spec: ReguaSpec,
): string | undefined {
  if (!podeGerarDiagnostico(acao.manipulacao)) return undefined;

  if (
    acao.unidadeEscolhida !== undefined
    && acao.unidadeCerta !== undefined
    && acao.unidadeEscolhida !== acao.unidadeCerta
  ) {
    return MisconceptionTag.CONFUNDE_UNIDADE;
  }

  if (acao.marcaAlinhada === 1) return MisconceptionTag.COMECA_NO_UM;

  if (acao.marcaAlinhada !== 0 && !acao.alinhado) {
    return MisconceptionTag.REGUA_DESALINHADA;
  }

  return undefined;
}

export function evidenciasDaRegua(
  acao: AcaoDeRegua,
  _spec: ReguaSpec,
): string[] {
  const evidencias: string[] = [];
  if (acao.alinhado && acao.marcaAlinhada === 0 && acao.alinhouManualmente) {
    evidencias.push(Evidencia.ALINHOU_ZERO);
  }
  return evidencias;
}
