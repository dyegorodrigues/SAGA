// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { computeUnlockStatus } from "./unlockEngine";
import { desligarModoDeTeste, lerChaveDaURL, modoDeTesteLigado } from "./modoDeTeste";
import { GrafoSaga } from "../../utils/grafoSaga";
import { Progress } from "../../types";

const irPara = (busca: string) => {
  window.history.replaceState({}, "", `/${busca}`);
  lerChaveDaURL();
};

afterEach(() => { desligarModoDeTeste(); window.history.replaceState({}, "", "/"); });

describe("modo de teste — a chave que abre as noventa", () => {
  it("sem chave, a jornada continua trancada: só a fronteira abre", () => {
    const status = computeUnlockStatus({} as Record<string, Progress>, false);
    expect(status.locked.length, "há competência trancada para quem começa").toBeGreaterThan(0);
    expect(status.opened.length).toBeLessThan(GrafoSaga.nodes.length);
  });

  it("com a chave certa na URL, TODAS as competências abrem", () => {
    irPara("?destravado=123");
    expect(modoDeTesteLigado()).toBe(true);
    const status = computeUnlockStatus({} as Record<string, Progress>);
    expect(status.opened.length).toBe(GrafoSaga.nodes.length);
    expect(status.locked).toEqual([]);
  });

  it("a chave sobrevive à navegação: o link só precisa ser aberto uma vez", () => {
    irPara("?destravado=123");
    irPara("");
    expect(modoDeTesteLigado()).toBe(true);
  });

  it("chave errada não abre nada", () => {
    irPara("?destravado=456");
    expect(modoDeTesteLigado()).toBe(false);
  });

  it("`off` desliga", () => {
    irPara("?destravado=123");
    irPara("?destravado=off");
    expect(modoDeTesteLigado()).toBe(false);
  });

  /**
   * ⚠️ Abrir tudo não é dominar tudo.
   *
   * Estado de teste que se mistura com estado de aprendizagem contamina a
   * medida — e a medida pedagógica é o produto. `dominated` tem de continuar
   * dizendo o que a criança REALMENTE dominou, senão o Radar passa a planejar
   * em cima de uma mentira.
   */
  it("⚠️ abrir tudo NÃO inventa domínio: o Radar continua vendo a verdade", () => {
    const umNo = GrafoSaga.nodes[0].id;
    const prog = { [umNo]: { dom: true } } as unknown as Record<string, Progress>;
    irPara("?destravado=123");
    const status = computeUnlockStatus(prog);
    expect(status.dominated).toEqual([umNo]);
  });
});
