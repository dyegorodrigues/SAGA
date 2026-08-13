import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { SkipCountF30Spec } from "../src/curriculum/procedimentos/skipCountContract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 1) || 1));
const seed = Number(params.get("seed") ?? 30) || 30;
const requestedTutorialStep = params.has("tutorialStep") ? Number(params.get("tutorialStep")) : null;

function seededRandom(initial: number): () => number {
  let state = initial >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

const originalRandom = Math.random;
Math.random = seededRandom(seed + level * 1031);
const question = generateRegisteredFichaQuestion("AL.03", level);
Math.random = originalRandom;
const spec = question.uiProps as SkipCountF30Spec;
const tutorialStep = requestedTutorialStep != null
  && Number.isInteger(requestedTutorialStep)
  && requestedTutorialStep >= 0
  && requestedTutorialStep < (question.tutorial?.length ?? 0)
    ? requestedTutorialStep
    : null;
const tutorialAtivo = tutorialStep == null ? null : question.tutorial?.[tutorialStep] ?? null;

interface Receipt {
  value: number;
  correct: boolean;
  meta?: AnswerMeta;
}

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  return (
    <main className="min-h-screen bg-slate-50 px-1 py-4 sm:px-2">
      <section
        className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-2 py-4 shadow-sm sm:px-4"
        data-skip-count-probe
        data-level={spec.nivel}
        data-support={spec.apoio}
        data-step={spec.salto}
        data-start={spec.inicio}
        data-answer={spec.resposta}
        data-limit={spec.limite}
        data-sequence={JSON.stringify(spec.sequencia)}
        data-options={JSON.stringify(spec.opcoes)}
        data-tutorial={question.tutorial?.length ?? 0}
        data-tutorial-step={tutorialStep ?? ""}
        data-tutorial-show={JSON.stringify(tutorialAtivo?.show ?? null)}
        data-rt={question.rt_max_s ?? ""}
        data-resolution-steps={question.resolucao?.passos.length ?? 0}
        data-generic-options={shouldRenderQuestionOptions(question) ? "true" : "false"}
        data-receipts={JSON.stringify(receipts)}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <FichaRenderer
          question={question}
          mostrar={tutorialAtivo?.show}
          onAnswer={(value, correct, meta) => setReceipts(current => [
            ...current,
            { value: Number(value), correct, meta },
          ])}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
