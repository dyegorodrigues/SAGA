import { describe, expect, it, vi } from "vitest";
import { State } from "../types";
import { ATRASO_PADRAO_MS, criarSincronizador } from "./sincronizadorDeNuvem";

const save = (marca: string): State => ({
  schemaVersion: 1, updatedAt: marca,
  kids: [], progress: {}, coins: {}, album: {}, log: {}, sound: true,
});

/** Relógio manual: nada aqui depende de tempo real passar. */
function relogio() {
  let proximo = 1;
  const tarefas = new Map<number, { fn: () => void; quando: number }>();
  let agora = 0;
  return {
    agendar: (fn: () => void, ms: number) => {
      const id = proximo++;
      tarefas.set(id, { fn, quando: agora + ms });
      return id;
    },
    cancelar: (h: unknown) => { tarefas.delete(h as number); },
    avancar(ms: number) {
      agora += ms;
      for (const [id, t] of [...tarefas]) {
        if (t.quando <= agora) { tarefas.delete(id); t.fn(); }
      }
    },
    pendentes: () => tarefas.size,
  };
}

describe("amortecedor de gravações na nuvem", () => {
  it("dez questões viram UMA gravação, com o estado final", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });

    for (let i = 1; i <= 10; i++) s.agendar(save(`q${i}`));
    expect(gravar, "nada sobe durante a missão").not.toHaveBeenCalled();

    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();

    // O ganho inteiro do amortecedor: 10 gravações do save completo viram 1.
    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar.mock.calls[0][0].updatedAt).toBe("q10");
  });

  it("descarregar sobe na hora, sem esperar a janela", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });

    s.agendar(save("fim-de-missao"));
    await s.descarregar();

    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar.mock.calls[0][0].updatedAt).toBe("fim-de-missao");
    expect(t.pendentes(), "o timer foi cancelado, não vai gravar de novo").toBe(0);
  });

  it("descarregar sem pendência não grava nada", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const s = criarSincronizador({ gravar, ...relogio() });

    await s.descarregar();
    await s.descarregar();

    expect(gravar).not.toHaveBeenCalled();
  });

  it("não grava duas vezes o mesmo estado", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });

    s.agendar(save("unico"));
    await s.descarregar();
    t.avancar(ATRASO_PADRAO_MS * 3);
    await s.descarregar();

    expect(gravar).toHaveBeenCalledTimes(1);
  });

  it("falha de rede não derruba a aula e não some com o estado seguinte", async () => {
    const gravar = vi.fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });

    s.agendar(save("tentativa-1"));
    await expect(s.descarregar()).resolves.toBeUndefined();

    // O save local já tem o progresso; a próxima gravação sobe o acumulado.
    s.agendar(save("tentativa-2"));
    await s.descarregar();
    expect(gravar).toHaveBeenCalledTimes(2);
    expect(gravar.mock.calls[1][0].updatedAt).toBe("tentativa-2");
  });

  it("relata pendência com honestidade", async () => {
    const t = relogio();
    const s = criarSincronizador({ gravar: async () => {}, agendar: t.agendar, cancelar: t.cancelar });

    expect(s.temPendencia()).toBe(false);
    s.agendar(save("x"));
    expect(s.temPendencia()).toBe(true);
    await s.descarregar();
    expect(s.temPendencia()).toBe(false);
  });
});
