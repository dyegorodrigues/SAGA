import { State } from "../types";

export interface OpcoesDoSincronizador<C = undefined> {
  gravar: (estado: State, contexto?: C) => Promise<void>;
  atrasoMs?: number;
  agendar?: (fn: () => void, ms: number) => unknown;
  cancelar?: (handle: unknown) => void;
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

  const subir = () => {
    if (!pendente) return Promise.resolve();
    const trabalho = pendente;
    pendente = null;
    return opcoes.gravar(trabalho.estado, trabalho.contexto).catch(err => {
      console.warn("[Nuvem] Sincronização adiada:", err);
    });
  };

  const limparTimer = () => {
    if (handle !== null) {
      cancelarTimer(handle);
      handle = null;
    }
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
      limparTimer();
      pendente = null;
    },
    temPendencia() {
      return pendente !== null;
    },
  };
}
