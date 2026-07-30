import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Anti-Regression Specs', () => {
  it('1. Counting Animation should pulse, not shrink to 0', () => {
    const emojiRowCode = fs.readFileSync(path.join(__dirname, '../components/primitives/EmojiRow.tsx'), 'utf-8');
    expect(emojiRowCode).not.toMatch(/scale-0/);
    expect(emojiRowCode).toMatch(/1\.35/);
  });

  it('2. Magic Box (TenFrame) must expose its Visual API', () => {
    const tenFrameCode = fs.readFileSync(path.join(__dirname, '../components/primitives/TenFrame.tsx'), 'utf-8');
    expect(tenFrameCode).toMatch(/destacarFileira/);
    expect(tenFrameCode).toMatch(/destacarCelula/);
    expect(tenFrameCode).toMatch(/preencherAte/);
  });

  it('3. GameLoop must not have duplicate "Como faz?" buttons', () => {
    const gameLoopCode = fs.readFileSync(path.join(__dirname, '../components/GameLoop.tsx'), 'utf-8');
    const comoFazCount = (gameLoopCode.match(/Como faz\?/g) || []).length;
    expect(comoFazCount).toBeLessThanOrEqual(1);
  });

  it('4. Mascot framing must be a rounded rectangle, not a circular clip-path', () => {
    const mascotEvolutionCode = fs.readFileSync(path.join(__dirname, '../components/MascotEvolution.tsx'), 'utf-8');
    const mascotRendererCode = fs.readFileSync(path.join(__dirname, '../components/mascots/MascotRenderer.tsx'), 'utf-8');
    expect(mascotEvolutionCode).toMatch(/rounded-[23]xl/);
    expect(mascotRendererCode).not.toMatch(/<clipPath id="bg-clip"><circle/);
  });
});
