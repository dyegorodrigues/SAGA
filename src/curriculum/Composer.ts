import { FichaCompetencia, FichaMicro } from "./schema";

export interface ConcreteQuestion {
  fichaId: string;
  microId: string;
  kind: string;
  promptAudio?: string;
  // Dynamic props that will be passed directly to the primitive component
  uiProps: any;
  // Function to evaluate if the answer provided by the primitive is correct
  evaluate: (answer: any) => boolean;
}

export class Composer {
  /**
   * Generates a concrete question instance from a Ficha's micro-competence.
   */
  static generate(ficha: FichaCompetencia, microId: string): ConcreteQuestion {
    const micro = ficha.micros.find(m => m.id === microId);
    if (!micro) {
      throw new Error(`Micro ${microId} not found in Ficha ${ficha.id}`);
    }

    // Select the primary kind for now
    const kind = micro.kinds[0];
    const params = micro.params;

    let uiProps: any = {};
    let evaluate = (ans: any) => false;

    // A simple factory that delegates to specific kind builders based on params
    switch (kind) {
      case "emojirow":
        const min = params.n_min || 1;
        const max = params.n_max || 5;
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        
        uiProps = {
          emoji: "🍎",
          n: target,
          flashDurationMs: params.flash_ms,
          interactiveCount: params.interactive_count
        };
        
        if (params.interactive_count) {
          evaluate = (count) => count === target;
        } else if (params.flash_ms) {
          // For flash mode, we might need external buttons, but for now just pass target
          uiProps.targetNumber = target;
          evaluate = (ans) => ans === target;
        } else {
          evaluate = (ans) => true; // Default observation
        }
        break;
        
      case "numberline":
        const start = params.start || 0;
        const end = params.end || 10;
        const jump = params.jump_size || 1;
        const current = Math.floor(Math.random() * (end - start - jump)) + start;
        const next = current + jump;
        
        uiProps = {
          start,
          end,
          interactive: true,
          showJumps: [{from: current, to: next}]
        };
        evaluate = (ans) => ans === next;
        break;
        
      case "bond":
        const maxSum = params.soma_max || 10;
        const whole = Math.floor(Math.random() * (maxSum - 2)) + 2;
        const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
        const part2 = whole - part1;
        
        if (params.interactive === "whole") {
          uiProps = { whole: '?', part1, part2, interactivePart: 'whole' };
          evaluate = (ans) => ans === whole;
        } else {
          const hide1 = Math.random() > 0.5;
          uiProps = { whole, part1: hide1 ? '?' : part1, part2: hide1 ? part2 : '?', interactivePart: hide1 ? 'part1' : 'part2' };
          evaluate = (ans) => ans === (hide1 ? part1 : part2);
        }
        break;
        
      // We will expand builders as we go
      default:
        uiProps = {};
        evaluate = (ans) => true;
    }

    return {
      fichaId: ficha.id,
      microId: micro.id,
      kind,
      promptAudio: params.audio_prompt,
      uiProps,
      evaluate
    };
  }
}
