/**
 * A chave de uma fala — a mesma no gerador e no navegador.
 *
 * O pacote de vozes nasce de um script em Node e é lido pelo app no navegador.
 * Os dois têm de chegar ao MESMO nome de arquivo a partir do mesmo texto, ou o
 * app procura um clipe que existe com outro nome e cai na voz do aparelho sem
 * necessidade. Por isso a normalização e o hash moram aqui, num módulo só, e
 * não duplicados dos dois lados.
 *
 * O hash é FNV-1a de 64 bits em duas metades de 32. Não é criptografia — é só
 * um nome curto e estável para o arquivo. Precisa ser SÍNCRONO: `speak()` é
 * chamado no meio de um clique e não pode esperar uma `Promise` (que é o que
 * `crypto.subtle.digest` devolveria).
 */

/**
 * Emoji não se fala.
 *
 * O `AudioPlayer` já tirava os emoji antes de mandar para o sintetizador; se a
 * chave não tirasse também, "Muito bem! 🎉" e "Muito bem!" virariam dois
 * clipes do mesmo áudio.
 */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{FE0F}\u{200D}]/gu;

/** O texto como o sintetizador o receberia: sem emoji, sem espaço sobrando. */
export function textoFalado(texto: string): string {
  return texto.replace(EMOJI, "").replace(/\s+/g, " ").trim();
}

/** O nome do arquivo de áudio desta fala. 16 dígitos hexadecimais. */
export function chaveDaFala(texto: string): string {
  const limpo = textoFalado(texto);
  let a = 0x811c9dc5;
  let b = 0x01000193;
  for (let i = 0; i < limpo.length; i += 1) {
    const c = limpo.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ (c + i), 0x85ebca6b) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}
