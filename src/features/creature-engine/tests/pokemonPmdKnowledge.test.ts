import { describe, expect, it } from 'vitest';
import { POKEMON_PMD_ASSETS, getPokemonPmdAsset, listPokemonPmdLocalPaths } from '../pokemonPmdKnowledge';

describe('pokemon PMD knowledge', () => {
  it('keeps PMD binary sprites as local pipeline outputs only', () => {
    expect(POKEMON_PMD_ASSETS).toHaveLength(3);
    expect(listPokemonPmdLocalPaths()).toEqual([
      'public/assets/creatures/pokemon-pmd/bulbasaur.png',
      'public/assets/creatures/pokemon-pmd/charmander.png',
      'public/assets/creatures/pokemon-pmd/squirtle.png',
    ]);
  });

  it('resolves known species metadata without importing image binaries', () => {
    expect(getPokemonPmdAsset('charmander')).toMatchObject({
      species: 'Charmander',
      localPng: 'public/assets/creatures/pokemon-pmd/charmander.png',
    });
  });
});
