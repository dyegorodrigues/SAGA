import { State } from "../types";

/**
 * Amortecedor de gravações na nuvem.
 *
 * O aparelho grava a cada questão — e deve mesmo, é o save que a criança usa.
 * A nuvem não precisa disso: ela é a cópia de segurança, e reescrever o
 * documento inteiro depois de cada questão sobe o save completo dezenas de
 * vezes por sessão para mudar meia dúzia de números.
 *
 * Medido no save modelado (1 criança, 1 ano de uso, 88 nós): 127 KB por
 * gravação, ~1,2 MB de upload por missão de 10 questões, ~1,3 GB por ano de uso
 * diário. Num tablet com dados móveis isso é caro em bateria e em franquia, sem
 * nenhum ganho — o estado intermediário da missão não interessa a ninguém.
 *
 * Coalescer só é seguro porque a abertura do app reconcilia pelo carimbo
 * (`reconciliacaoDeSaves.ts`): se o app fechar com gravação pendente, o save
 * local é o mais recente e vence. Sem aquela correção, isto perderia progresso.
 */

export interface OpcoesDoSincronizador {
  /** A gravação de verdade. */
  gravar: (estado: State) => Promise<void>;
  /** Janela de espera antes de subir. */
  atrasoMs?: number;
  agendar?: (fn: () => void, ms: number) => unknown;
  cancelar?: (handle: unknown) => void;
}

export interface Sincronizador {
  /** Enfileira o estado; a gravação sai depois da janela de espera. */
  agendar: (estado: State) => void;
  /** Sobe agora o que estiver pendente. Use ao fim da missão e ao fechar o app. */
  descarregar: () => Promise<void>;
  temPendencia: () => boolean;
}

/** Fim de missão e fechamento do app descarregam na hora; o resto espera. */
export const ATRASO_PADRAO_MS = 8000;

export function criarSincronizador(opcoes: OpcoesDoSincronizador): Sincronizador {
  const atrasoMs = opcoes.atrasoMs ?? ATRASO_PADRAO_MS;
  const agendar = opcoes.agendar ?? ((fn, ms) => setTimeout(fn, ms));
  const cancelar = opcoes.cancelar ?? (h => clearTimeout(h as ReturnType<typeof setTimeout>));

  let pendente: State | null = null;
  let handle: unknown = null;

  const subir = () => {
    if (!pendente) return Promise.resolve();
    // Só o ÚLTIMO estado sobe: os intermediários da missão não interessam, e o
    // último já contém tudo o que os anteriores continham.
    const estado = pendente;
    pendente = null;
    return opcoes.gravar(estado).catch(err => {
      // Falhar aqui não pode derrubar a aula. O save local já tem o progresso, e
      // a próxima gravação bem-sucedida sobe o estado acumulado.
      console.warn("[Nuvem] Sincronização adiada:", err);
    });
  };

  const limparTimer = () => {
    if (handle !== null) {
      cancelar(handle);
      handle = null;
    }
  };

  return {
    agendar(estado: State) {
      pendente = estado;
      limparTimer();
      handle = agendar(() => {
        handle = null;
        void subir();
      }, atrasoMs);
    },

    descarregar() {
      limparTimer();
      return subir();
    },

    temPendencia() {
      return pendente !== null;
    },
  };
}
