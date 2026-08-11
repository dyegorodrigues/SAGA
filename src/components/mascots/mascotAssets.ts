/// <reference types="vite/client" />
/**
 * Registro de PNGs de mascote — o encaixe do pipeline de arte definitivo.
 *
 * Convenção (Constituição, regra 6): arquivos em src/assets/mascotes/ com nome
 * `{tema}-{estagio}*.png` (ex.: dragao-1-ovo.png, dragao-2-filhote.png ...).
 * Requisitos de arte (docs/plano-diretor-v2.md, Parte A): PNG com transparência
 * REAL, 512×512, personagem centralizado com 10-15% de margem. JPG é PROIBIDO.
 *
 * Quando um PNG existir para o tema+estágio, o MascotRenderer o usa
 * automaticamente; senão, cai no desenho SVG (DragonMascot / bases antigas).
 *
 * IMPORTANTE: assets históricos em `src/assets/images/*.jpg` não participam
 * deste registro. JPG não possui canal alfa e um sufixo `_nobg_` não transforma
 * o formato em imagem transparente. Manter o fallback SVG é mais correto do que
 * maquiar fundo opaco em runtime.
 */

const pngModules = import.meta.glob("../../assets/mascotes/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/** Apelidos: id do tema no código → prefixo do arquivo de arte. */
const ALIAS: Record<string, string> = {
  dragao_fogo: "dragao",
};

export function getMascotPng(theme: string, stage: number): string | null {
  const prefixes = [`${ALIAS[theme] || theme}-${stage}`, `${theme}-${stage}`];
  for (const [path, url] of Object.entries(pngModules)) {
    const file = path.split("/").pop() || "";
    if (prefixes.some((p) => file.startsWith(p))) return url;
  }
  return null;
}
