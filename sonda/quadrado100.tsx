import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { Quadrado100Spec } from "../src/curriculum/procedimentos/quadrado100Contract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 2) || 2));
const seed = Number(params.get("seed") ?? 36) || 36;

function seededRandom(initial: number): () => number {
  let state = initial >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

const originalRandom = Math.random;
Math.random = seededRandom(seed + level * 1009);
const question = generateRegisteredFichaQuestion("N2.02", level);
Math.random = originalRandom;
const spec = question.uiProps as Quadrado100Spec;

interface Receipt {
  value: number;
  correct: boolean;
  meta?: AnswerMeta & { quadrado100?: unknown };
}

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);

  return (
    <main className="min-h-screen bg-slate-50 px-1 py-4 sm:px-2">
      <section
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white px-1 py-4 shadow-sm sm:px-3"
        data-quadrado100-probe
        data-level={spec.nivel}
        data-mode={spec.modo}
        data-start={spec.inicio}
        data-step={spec.passo}
        data-path={JSON.stringify(spec.caminho)}
        data-hidden={JSON.stringify(spec.casasOcultas)}
        data-tutorial={question.tutorial?.length ?? 0}
        data-rt={question.rt_max_s ?? ""}
        data-receipts={JSON.stringify(receipts)}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <FichaRenderer
          question={question}
          onAnswer={(value, correct, meta) => setReceipts(current => [
            ...current,
            { value: Number(value), correct, meta: meta as Receipt["meta"] },
          ])}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
