import { Progress, Question } from "../types";

export interface CommitResult {
  p: Progress;
  right: boolean;
  starGain: number;
  durationMs: number;
}

export type ScaffoldLevel = 'full' | 'partial' | 'none';

/**
 * Motor de Fading (Andaimes).
 * A Pedagogia CRA exige que o apoio visual/concreto suma gradualmente.
 * O ProgressEngine dita o nível de andaime baseado no 'lvl' atual.
 */
export function getScaffoldLevel(lvl: number): ScaffoldLevel {
  if (lvl <= 2) return 'full';    // Nível 1 e 2: Material Dourado/Imagens na tela, super guiado.
  if (lvl <= 4) return 'partial'; // Nível 3 e 4: Numérico com suporte opcional ou semi-guiado.
  return 'none';                  // Nível 5 (Domínio Absoluto): Totalmente abstrato.
}

export function commitProgress(
  p: Progress,
  q: Question,
  right: boolean,
  durationMs: number,
  isLast: boolean,
  totalQuestions: number,
  isWarmup: boolean
): CommitResult {
  const newP = { ...p, bank: p.bank ? [...p.bank] : [] };
  
  newP.lastDay = new Date().toISOString().slice(0, 10);
  newP.rt = Math.round(newP.rt ? newP.rt * 0.7 + durationMs * 0.3 : durationMs);

  const starGain = right ? 1 : 0;
  newP.stars = (newP.stars || 0) + starGain;

  if (right) {
    newP.ok = (newP.ok || 0) + 1;
    newP.streak = (newP.streak || 0) + 1;
    newP.bad = 0;
    
    // Nivelamento com latência (Dojo/Rapid-Fire)
    // Se respondeu muito rápido (subitização), pode pular de nível mais cedo
    const fastBonus = durationMs < 3000 ? 1 : 0; 
    
    // ZDP normal: 3 acertos seguidos sobem o nível
    if (newP.streak + fastBonus >= 3 && newP.lvl < 5) {
      newP.lvl++;
      newP.streak = 0;
    } else if (newP.streak >= 3 && newP.lvl === 5 && !newP.dom) {
      newP.dom = true;
    }
    newP.maxLvl = Math.max(newP.maxLvl || 1, newP.lvl);
  } else {
    newP.streak = 0;
    if (!isWarmup) {
      newP.bad = (newP.bad || 0) + 1;
      // 2 erros seguidos rebaixam o nível para não frustrar
      if (newP.bad >= 2 && newP.lvl > 1) {
        newP.lvl--;
        newP.bad = 0;
      }
    }
    
    // Track misconceptions for Radar (Camada 2)
    if (q.options) {
      // Find what the child actually clicked (not passed in this signature though... wait, we need it)
      // For now we just prepare the array.
    }
  }

  // Bonus de fim de trilha (missão perfeita)
  let extraStars = 0;
  if (isLast && newP.ok === totalQuestions) {
    extraStars = 5;
    newP.stars += 5;
  }

  return {
    p: newP,
    right,
    starGain: starGain + extraStars,
    durationMs
  };
}
