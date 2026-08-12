import { describe, expect, it, vi } from "vitest";
import { State } from "../types";
import { ATRASO_PADRAO_MS, criarSincronizador } from "./sincronizadorDeNuvem";

const save = (marca: string): State => ({
  schemaVersion: 1, updatedAt: marca,
  kids: [], progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true,
});

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
      for (const [id, t] of [...tarefas]) if (t.quando <= agora) { tarefas.delete(id); t.fn(); }
    },
    pendentes: () => tarefas.size,
  };
}

describe("amortecedor de gravações na nuvem", () => {
  it("dez questões viram uma gravação, com o estado final", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    for (let i = 1; i <= 10; i++) s.agendar(save(`q${i}`));
    expect(gravar).not.toHaveBeenCalled();
    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();
    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar.mock.calls[0][0].updatedAt).toBe("q10");
  });

  it("mantém o UID junto do estado que venceu o debounce", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("a"), "uid-a");
    s.agendar(save("b"), "uid-b");
    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();
    expect(gravar).toHaveBeenCalledWith(expect.objectContaining({ updatedAt: "b" }), "uid-b");
  });

  it("cancelarPendencia numa troca de conta elimina trabalho antigo", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("a"), "uid-a");
    s.cancelarPendencia();
    t.avancar(ATRASO_PADRAO_MS * 2);
    await Promise.resolve();
    expect(gravar).not.toHaveBeenCalled();
    expect(s.temPendencia()).toBe(false);
  });

  it("descarregar sobe na hora e mantém contexto", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("fim"), "uid-a");
    await s.descarregar();
    expect(gravar).toHaveBeenCalledWith(expect.objectContaining({ updatedAt: "fim" }), "uid-a");
    expect(t.pendentes()).toBe(0);
  });

  it("falha não marcada para retry não derruba a aula e o estado seguinte ainda sobe", async () => {
    const gravar = vi.fn().mockRejectedValueOnce(new Error("erro-permanente")).mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("tentativa-1"));
    await expect(s.descarregar()).resolves.toBeUndefined();
    s.agendar(save("tentativa-2"));
    await s.descarregar();
    expect(gravar).toHaveBeenCalledTimes(2);
  });

  it("H6: falha offline permanece pendente por padrão e volta sozinha após reconexão", async () => {
    const gravar = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });

    s.agendar(save("offline"));
    await s.descarregar();

    expect(s.temPendencia()).toBe(true);
    expect(t.pendentes()).toBe(1);

    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();
    await Promise.resolve();

    expect(gravar).toHaveBeenCalledTimes(2);
    expect(s.temPendencia()).toBe(false);
  });

  it("write novo agendado durante falha suplanta o retry antigo", async () => {
    let rejeitar!: (erro: unknown) => void;
    const primeiro = new Promise<void>((_resolve, reject) => { rejeitar = reject; });
    const gravar = vi.fn()
      .mockImplementationOnce(() => primeiro)
      .mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({
      gravar,
      agendar: t.agendar,
      cancelar: t.cancelar,
      deveRepetir: () => true,
    });

    s.agendar(save("antigo"));
    const emVoo = s.descarregar();
    s.agendar(save("novo"));
    rejeitar(new Error("offline"));
    await emVoo;

    expect(s.temPendencia()).toBe(true);
    expect(t.pendentes()).toBe(1);
    await s.descarregar();
    expect(gravar.mock.calls[1][0].updatedAt).toBe("novo");
  });

  it("troca de UID enquanto write está em voo impede retry ressuscitar", async () => {
    let rejeitar!: (erro: unknown) => void;
    const primeiro = new Promise<void>((_resolve, reject) => { rejeitar = reject; });
    const gravar = vi.fn().mockImplementationOnce(() => primeiro);
    const t = relogio();
    const s = criarSincronizador<string>({
      gravar,
      agendar: t.agendar,
      cancelar: t.cancelar,
      deveRepetir: () => true,
    });

    s.agendar(save("uid-a"), "uid-a");
    const emVoo = s.descarregar();
    s.cancelarPendencia();
    rejeitar(new Error("offline"));
    await emVoo;

    expect(s.temPendencia()).toBe(false);
    expect(t.pendentes()).toBe(0);
  });
});
