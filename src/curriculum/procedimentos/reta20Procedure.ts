import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";
import { EventoManipulacao } from "./filtroMotor";
import type { Reta20Spec } from "./reta20Contract";

export type GestoReta20 = "arrasto" | "toque";

export interface AcaoReta20 {
  escolhido: number;
  posicaoInicial: number;
  alvo: number;
  salto: number;
  gesto: GestoReta20;
  /**
   * Assinatura observável de CONTA_MARCAS: antes de concluir um salto, a
   * criança tocou explicitamente a própria marca de partida como se ela fosse
   * o primeiro intervalo. Não inferimos intenção apenas pelo endpoint.
   */
  contouMarcaInicial: boolean;
}

export interface SolturaReta20 {
  x: number;
  left: number;
  width: number;
}

export interface DestinoResolvidoReta20 {
  escolhido: number;
  manipulacao: EventoManipulacao;
}

/**
 * Resolve geometria ANTES de qualquer julgamento matemático.
 *
 * Há duas folgas diferentes de propósito:
 * - margem externa: tolera o dedo escapar um pouco além da ponta da reta;
 * - raio de snap conceitual: protege imprecisão perto do alvo certo sem engolir
 *   o centro da marca vizinha. Assim OFF_BY_ONE continua observável em telas
 *   estreitas e "dedo torto" continua sendo motor, não matemática.
 */
export function resolverSolturaReta(
  soltura: SolturaReta20,
  spec: Reta20Spec,
): DestinoResolvidoReta20 {
  const width = Math.max(1, soltura.width);
  const passos = Math.max(1, spec.fim - spec.inicio);
  const passoPx = width / passos;
  const right = soltura.left + width;
  const margemExterna = Math.max(24, passoPx * 0.65);
  const raioDeSnap = Math.max(8, Math.min(24, passoPx * 0.55));
  const fora = soltura.x < soltura.left - margemExterna || soltura.x > right + margemExterna;
  const xClamped = Math.min(right, Math.max(soltura.left, soltura.x));
  const indice = Math.round((xClamped - soltura.left) / passoPx);
  const escolhido = Math.max(spec.inicio, Math.min(spec.fim, spec.inicio + indice));
  const xAlvo = soltura.left + (spec.alvo - spec.inicio) * passoPx;

  return {
    escolhido,
    manipulacao: {
      distanciaDoAlvoCorreto: Math.abs(soltura.x - xAlvo),
      raioDeSnap,
      foraDeAlvoValido: fora,
    },
  };
}

export function diagnosticarReta20(
  acao: AcaoReta20,
  spec: Reta20Spec,
): MisconceptionTagType | undefined {
  if (acao.escolhido === spec.alvo) return undefined;

  // A ação observável é mais específica que a diferença final. Sem ela, um
  // endpoint a uma casa do alvo permanece OFF_BY_ONE, nunca psicologia inferida.
  if (acao.contouMarcaInicial && Math.abs(acao.escolhido - spec.alvo) === 1) {
    return MisconceptionTag.CONTA_MARCAS;
  }

  if (spec.modo === "saltar" && spec.salto !== 0) {
    const espelho = spec.posicaoInicial - spec.salto;
    if (espelho >= spec.inicio && espelho <= spec.fim && acao.escolhido === espelho) {
      return MisconceptionTag.INVERTE_DIRECAO;
    }
  }

  if (Math.abs(acao.escolhido - spec.alvo) === 1) {
    return MisconceptionTag.OFF_BY_ONE;
  }

  if (spec.nivel === 4 && Math.abs(acao.escolhido - spec.alvo) >= 2) {
    return MisconceptionTag.SEM_SENSO_ESPACIAL;
  }

  return undefined;
}

export function evidenciasReta20(acao: AcaoReta20, spec: Reta20Spec): string[] {
  if (acao.escolhido !== spec.alvo) return [];
  if (spec.modo === "saltar" && spec.salto < 0) return [Evidencia.SALTO_PARA_TRAS];
  return [];
}

export function numerosNoPercurso(origem: number, destino: number): number[] {
  if (origem === destino) return [];
  const direcao = destino > origem ? 1 : -1;
  const numeros: number[] = [];
  for (let atual = origem + direcao; direcao > 0 ? atual <= destino : atual >= destino; atual += direcao) {
    numeros.push(atual);
  }
  return numeros;
}