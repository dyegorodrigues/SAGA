import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Preparo comum dos testes de componente.
 *
 * Sem a limpeza entre casos, cada `render` acumula no mesmo documento e as
 * consultas passam a encontrar elementos de testes anteriores — falha que
 * aparece como "found multiple elements" e não como defeito real.
 */
afterEach(() => cleanup());

/**
 * O jsdom não implementa `matchMedia`, de que depende a detecção de
 * `prefers-reduced-motion`. O padrão é movimento permitido; cada teste que
 * precise do contrário sobrescreve o retorno.
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
