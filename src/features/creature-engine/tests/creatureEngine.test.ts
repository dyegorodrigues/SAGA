import { describe, expect, it } from 'vitest';
import { applyLearningSignal, createCreature } from '../creatureEngine';

describe('creature engine', () => {
  it('creates a deterministic starter creature', () => {
    expect(createCreature('saga-1', 'Lumi')).toEqual({
      id: 'saga-1',
      name: 'Lumi',
      level: 1,
      xp: 0,
      care: 70,
      mood: 'curioso',
    });
  });

  it('rewards effort with positive, non-punitive growth signals', () => {
    const creature = createCreature('saga-1', 'Lumi');
    const next = applyLearningSignal(creature, { correct: false, attempts: 2, streak: 0 });

    expect(next.xp).toBeGreaterThan(creature.xp);
    expect(next.care).toBeGreaterThan(creature.care);
    expect(next.mood).toBe('curioso');
  });

  it('levels up deterministically after enough successful practice', () => {
    const creature = { ...createCreature('saga-1', 'Lumi'), xp: 88 };
    const next = applyLearningSignal(creature, { correct: true, attempts: 1, streak: 3 });

    expect(next.level).toBe(2);
    expect(next.xp).toBe(20);
    expect(next.mood).toBe('confiante');
  });
});
