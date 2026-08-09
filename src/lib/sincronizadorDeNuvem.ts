import { State } from "../types";

export interface OpcoesDoSincronizador<C = undefined> {
  gravar: (estado: State, contexto?: C) => Promise<void>;
  atrasoMs?: number;
  agendar?: (fn: () => void, ms: number) => unknown;
  cancelar?: (handle: unknown) => void;
  /** Só erros transitórios devem manter trabalho pendente para retry. */
  deveRepetir?: (erro: unknown) => boolean;
}

export interface Sincronizador<C = undefined> {
  agendar: (estado: State, contexto?: C) => void;
  descarregar: () => Promise<void>;
  cancelarPendencia: () => void;
  temPendencia: () => boolean;
}

export const ATRASO_PADRAO_MS = 8000;

export function criarSincronizador<C = undefined>(opcoes: OpcoesDoSincronizador<C>): Sincronizador<C> {
  const atrasoMs = opcoes.atrasoMs ?? ATRASO_PADRAO_MS;
  const agendarTimer = opcoes.agendar ?? ((fn, ms) => setTimeout(fn, ms));
  const cancelarTimer = opcoes.cancelar ?? (h => clearTimeout(h as ReturnType<typeof setTimeout>));

  let pendente: { estado: State; contexto?: C } | null = null;
  let handle: unknown = null;
  // Geração muda em cancelamento explícito (ex.: troca de UID). Um write que já
  // estava em voo não pode ressuscitar depois de a identidade ter mudado.
  let geracao = 0;

  const limparTimer = () => {
    if (handle !== null) {
      cancelarTimer(handle);
      handle = null;
    }
  };

  const agendarRetry = () => {
    if (!pendente || handle !== null) return;
    handle = agendarTimer(() => {
      handle = null;
      void subir();
    }, atrasoMs);
  };

  const subir = () => {
    if (!pendente) return Promise.resolve();
    const trabalho = pendente;
    const geracaoDoTrabalho = geracao;
    pendente = null;

    return opcoes.gravar(trabalho.estado, trabalho.contexto).catch(err => {
      console.warn("[Nuvem] Sincronização adiada:", err);
      if (!opcoes.deveRepetir?.(err) || geracao !== geracaoDoTrabalho) return;

      // Se outro estado foi agendado enquanto este write estava em voo, o mais
      // novo já é a pendência autoritativa. Nunca o substitua pelo retry velho.
      if (!pendente) pendente = trabalho;
      agendarRetry();
    });
  };

  return {
    agendar(estado: State, contexto?: C) {
      pendente = { estado, contexto };
      limparTimer();
      handle = agendarTimer(() => {
        handle = null;
        void subir();
      }, atrasoMs);
    },
    descarregar() {
      limparTimer();
      return subir();
    },
    cancelarPendencia() {
      geracao += 1;
      limparTimer();
      pendente = null;
    },
    temPendencia() {
      return pendente !== null;
    },
  };
}
