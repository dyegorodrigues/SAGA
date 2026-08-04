/**
 * Filtro motor — §8.3-bis da Bíblia: "erro de dedo não é erro de cabeça".
 *
 * Nenhuma tag de misconception pode nascer de um evento isolado de manipulação.
 * Antes de registrar erro vindo de arrasto, corte, alinhamento, giro ou
 * posicionamento, o motor separa dois padrões — e o cânone descreve a assinatura
 * observável de cada um.
 *
 * **Regra de ouro, literal:** na dúvida entre os dois, classificar como motor.
 * Falso negativo custa uma questão. Falso positivo contamina o Radar, dispara
 * Oficina injusta e ensina a criança que ela é ruim naquilo.
 */

export type ClasseDeErro = "motor" | "conceitual";

/** Arrasto abortado antes disto é gesto interrompido, não decisão. */
export const ARRASTO_ABORTADO_MS = 200;

/** Soltar dentro desta folga em torno do alvo certo é mira boa com dedo torto. */
export const FOLGA_DE_SNAP = 1.5;

export interface EventoManipulacao {
  /** Distância entre o ponto de soltura e o centro do alvo **correto**, em px. */
  distanciaDoAlvoCorreto?: number;
  /** Raio de snap do alvo, em px. */
  raioDeSnap?: number;
  /** Soltou fora de qualquer alvo válido. */
  foraDeAlvoValido?: boolean;
  /** A criança se corrigiu sozinha na sequência. */
  corrigiuSozinha?: boolean;
  /** Duração do gesto, em ms. */
  duracaoMs?: number;
  /** Repetiu o mesmo destino errado. */
  repetiuMesmoDestino?: boolean;
  /** Completou o gesto com precisão e escolheu um destino errado. */
  precisoEmDestinoErrado?: boolean;
  /** Passou por cima de alvos vazios disponíveis para empilhar no ocupado. */
  ignorouAlvosVazios?: boolean;
  /** O erro veio do reconhecimento de escrita à mão (§9.3, item 3). */
  deReconhecimentoDeEscrita?: boolean;
}

/**
 * Classifica um evento de manipulação.
 *
 * A ordem importa: as assinaturas de erro motor são verificadas primeiro, porque
 * a regra de ouro manda resolver a dúvida a favor do motor.
 */
export function classificarErro(evento: EventoManipulacao = {}): ClasseDeErro {
  // §9.3: falha de reconhecimento de traçado nunca vira tag, mesma lógica.
  if (evento.deReconhecimentoDeEscrita) return "motor";

  // Soltou no vazio: não escolheu destino algum, então não escolheu errado.
  if (evento.foraDeAlvoValido) return "motor";

  // Corrigir-se sozinha é evidência de que a criança sabia — o dedo é que não.
  if (evento.corrigiuSozinha) return "motor";

  // Gesto interrompido cedo demais para expressar decisão.
  if (typeof evento.duracaoMs === "number" && evento.duracaoMs < ARRASTO_ABORTADO_MS) {
    return "motor";
  }

  // Mirou o alvo certo e soltou perto dele.
  if (
    typeof evento.distanciaDoAlvoCorreto === "number" &&
    typeof evento.raioDeSnap === "number" &&
    evento.distanciaDoAlvoCorreto <= evento.raioDeSnap * FOLGA_DE_SNAP
  ) {
    return "motor";
  }

  // Só então as assinaturas conceituais, que exigem gesto íntegro e destino errado.
  if (evento.repetiuMesmoDestino) return "conceitual";
  if (evento.precisoEmDestinoErrado) return "conceitual";
  if (evento.ignorouAlvosVazios) return "conceitual";

  // Sem assinatura conceitual observada, a dúvida resolve a favor do motor.
  return "motor";
}

/** Atalho de leitura: este erro pode alimentar o Radar? */
export function podeGerarDiagnostico(evento?: EventoManipulacao): boolean {
  if (!evento) return true; // Resposta por alternativa não é manipulação.
  return classificarErro(evento) === "conceitual";
}
