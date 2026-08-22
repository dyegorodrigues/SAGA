export type RandomSource = () => number;

/**
 * Fisher–Yates uniforme, não mutante e injetável por fonte pseudoaleatória.
 *
 * O default deliberadamente usa Math.random: as sondas do SAGA já substituem
 * Math.random por um LCG determinístico a partir da semente da cena, portanto
 * a mesma seed reproduz também a permutação sem introduzir um segundo PRNG.
 */
export function fisherYates<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
