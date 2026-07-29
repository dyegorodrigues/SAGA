import { FichaCompetencia, FichaMicro } from "./schema";
import { Question } from "../types";

export class Composer {
  /**
   * Generates a concrete question instance from a Ficha's micro-competence.
   */
  static generate(ficha: FichaCompetencia, lvl: number, microId?: string): Question {
    let micro = microId ? ficha.micros.find(m => m.id === microId) : null;
    if (!micro) {
      if (microId) console.warn(`Micro ${microId} not found in Ficha ${ficha.id}, falling back to first micro.`);
      micro = ficha.micros[0];
    }

    // Use level to pick primitive from niveis block (CPA progression), fallback to micro.kinds[0]
    const kind = ficha.niveis && ficha.niveis[lvl] ? ficha.niveis[lvl].primitiva : micro.kinds[0];
    const params = micro.params;

    let uiProps: any = {};
    let evaluate = (ans: any) => false;
    let answer: any = null;
    let options: any[] | undefined = undefined;

    // A simple factory that delegates to specific kind builders based on params
    switch (kind) {
      case "emojirow": {
        const min = params.n_min || 1;
        const max = params.n_max || 5;
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        
        uiProps = {
          emoji: ["🍎", "🦴", "🥕", "🐟", "🧀", "🏈", "⚽", "🚗", "🐶", "🐱"][Math.floor(Math.random() * 10)],
          n: target,
          flashDurationMs: params.flash_ms,
          interactiveCount: params.interactive_count
        };
        
        if (params.interactive_count) {
          evaluate = (count) => count === target;
          answer = target;
        } else if (params.flash_ms) {
          uiProps.targetNumber = target;
          evaluate = (ans) => ans === target;
          answer = target;
          // Generate multiple choice options for flash
          options = [];
          const wrong1 = target + 1 > max ? target - 1 : target + 1;
          const wrong2 = target - 1 < min ? target + 2 : target - 1;
          options.push({ label: String(target), value: target });
          if(wrong1 >= min && wrong1 <= max && wrong1 !== target) options.push({ label: String(wrong1), value: wrong1 });
          if(wrong2 >= min && wrong2 <= max && wrong2 !== target && wrong2 !== wrong1) options.push({ label: String(wrong2), value: wrong2 });
          options.sort(() => Math.random() - 0.5);
        } else {
          evaluate = (ans) => true; answer = target; options = [{ label: "Continuar 👍", value: target }];
        }
        break;
      }
        
      case "numberline": {
        const start = params.start || 0;
        const end = params.end || 10;
        const jump = params.jump_size || 1;
        const current = Math.floor(Math.random() * (end - start - jump)) + start;
        const next = current + jump;
        
        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current, showJumps: [{from: current, to: next}]
        };
        evaluate = (ans) => ans === next;
        answer = next;
        break;
      }
        
      case "bond": {
        const maxSum = params.soma_max || 10;
        const whole = Math.floor(Math.random() * (maxSum - 2)) + 2;
        const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
        const part2 = whole - part1;
        
        if (params.interactive === "whole") {
          uiProps = { whole: '?', part1, part2, interactivePart: 'whole' };
          evaluate = (ans) => ans === whole;
          answer = whole;
        } else {
          const hide1 = Math.random() > 0.5;
          uiProps = { whole, part1: hide1 ? '?' : part1, part2: hide1 ? part2 : '?', interactivePart: hide1 ? 'part1' : 'part2' };
          evaluate = (ans) => ans === (hide1 ? part1 : part2);
          answer = hide1 ? part1 : part2;
        }
        
        // Options for number bonds
        options = [];
        const wrong1 = answer + 1;
        const wrong2 = Math.max(1, answer - 1);
        options.push({ label: String(answer), value: answer });
        options.push({ label: String(wrong1), value: wrong1 });
        if(wrong2 !== answer && wrong2 !== wrong1) options.push({ label: String(wrong2), value: wrong2 });
        break;
      }
      
      case "draggroup": {
        const min = params.n_min || 3;
        const max = params.n_max || 5;
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        const sobra = params.tem_sobra ? Math.floor(Math.random() * 2) + 1 : 0;
        
        
        const pairs = [
          { s: "🍎", d: "🐰" },
          { s: "🦴", d: "🐶" },
          { s: "🥕", d: "🐎" },
          { s: "🐟", d: "🐱" },
          { s: "🧀", d: "🐭" }
        ];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        uiProps = {
          sourceCount: target + sobra,
          destCount: target,
          sourceEmoji: pair.s,
          destEmoji: pair.d
        };
  
        evaluate = (ans) => ans === target;
        answer = target;
        break;
      }
        
      case "plain": {
        // We will just return the params for plain rendering
        uiProps = { text: params.big || "" };
        evaluate = (ans) => true; // Default
        break;
      }
      
      case "intruso_math": {
        const pairs = [
          ["🔴", "🔵"],
          ["🍎", "🍌"],
          ["🚗", "🚕"],
          ["🐶", "🐱"],
          ["🌞", "🌙"],
          ["⭐", "💠"]
        ];
        const [A, B] = pairs[Math.floor(Math.random() * pairs.length)];
        
        const intruder = Math.random() > 0.5 ? A : B;
        const normal = intruder === A ? B : A;

        const len = Math.floor(Math.random() * 2) + 4; // 4 or 5
        const intruderPos = Math.floor(Math.random() * len);
        
        let seq = [];
        for (let i = 0; i < len; i++) {
          seq.push(i === intruderPos ? intruder : normal);
        }
        
        uiProps = { text: seq.join(" ") };
        options = [{label: A, value: A}, {label: B, value: B}].sort(() => Math.random() - 0.5);
        evaluate = (ans) => ans === intruder;
        answer = intruder;
        break;
      }
      
      default:
        uiProps = undefined;
        evaluate = (ans) => true;
        answer = null;
    }

    return {
      howto: ficha.howto,
      explain: ficha.explain,
      kind: kind === "intruso_math" ? "plain" : kind,
      prompt: params.audio_prompt || "Responda:",
      audioPrompt: params.audio_prompt,
      tutorial: params.tutorial,
      uiProps,
      evaluate,
      answer,
      options
    };
  }
}
