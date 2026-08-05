export interface PokemonPmdAssetSpec {
  readonly slug: string;
  readonly species: string;
  readonly localPng: string;
  readonly attribution: string;
}

export const POKEMON_PMD_ASSET_DIR = 'public/assets/creatures/pokemon-pmd';

export const POKEMON_PMD_ASSETS: readonly PokemonPmdAssetSpec[] = [
  {
    slug: 'bulbasaur',
    species: 'Bulbasaur',
    localPng: `${POKEMON_PMD_ASSET_DIR}/bulbasaur.png`,
    attribution: 'PMD sprite generated locally by the asset pipeline; binary output is not committed.',
  },
  {
    slug: 'charmander',
    species: 'Charmander',
    localPng: `${POKEMON_PMD_ASSET_DIR}/charmander.png`,
    attribution: 'PMD sprite generated locally by the asset pipeline; binary output is not committed.',
  },
  {
    slug: 'squirtle',
    species: 'Squirtle',
    localPng: `${POKEMON_PMD_ASSET_DIR}/squirtle.png`,
    attribution: 'PMD sprite generated locally by the asset pipeline; binary output is not committed.',
  },
];

export function getPokemonPmdAsset(slug: string): PokemonPmdAssetSpec | undefined {
  return POKEMON_PMD_ASSETS.find((asset) => asset.slug === slug);
}

export function listPokemonPmdLocalPaths(): string[] {
  return POKEMON_PMD_ASSETS.map((asset) => asset.localPng);
}
