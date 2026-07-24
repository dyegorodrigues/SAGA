/// <reference types="vite/client" />
/**
 * Registro de SVGs de CENA — o encaixe do pipeline de arte das cenas vivas,
 * espelhando `mascotAssets.ts` (que faz o mesmo para os PNGs de mascote).
 *
 * QUANDO existir um SVG seu em `src/assets/scenes/<slot>-<estado>.svg`, a cena o
 * usa AUTOMATICAMENTE no lugar do desenho-código (sem tocar em código). Senão,
 * cai no desenho-código de fallback (WeatherScene, GrowthScene, NestScene…).
 *
 * Convenção de nome: `<slot>-<estado>.svg` — ex.:
 *   weather-sol.svg · weather-chuva.svg · grow-1.svg … grow-4.svg
 *   nest-casa.svg · nest-rua.svg · nest-cidade.svg …
 * Requisitos: fundo TRANSPARENTE, viewBox "0 0 200 200", ≤15KB (otimizar no svgo),
 * cores neutras. Inventário completo em docs/mapa-de-cenas-svg.md.
 */

const svgModules = import.meta.glob("../../assets/scenes/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/**
 * Retorna a URL do SVG plugado para (slot, estado), ou null se não houver
 * (aí a cena desenha o fallback de código).
 * @param slot   a família da cena: "weather", "grow", "daypart", "nest"…
 * @param state  o estado: "sol"/"chuva" (weather), "1".."4" (grow), "casa" (nest)…
 */
export function getSceneSvg(slot: string, state: string | number): string | null {
  const target = `${slot}-${state}`;
  for (const [path, url] of Object.entries(svgModules)) {
    const file = (path.split("/").pop() || "").replace(/\.svg$/, "");
    if (file === target) return url;
  }
  return null;
}
