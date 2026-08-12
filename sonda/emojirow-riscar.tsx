import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { EmojiRowRiscarSpec } from "../src/curriculum/procedimentos/emojiRowRiscarContract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 1) || 1));
const seed = Number(params.get("seed") ?? 15) || 15;
const requestedTutorialStep = params.has("tutorialStep") ? Number(params.get("tutorialStep")) : null;

function seededRandom(initial: number): () => number {
  let state = initial >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

const originalRandom = Math.random;
Math.random = seededRandom(seed + level * 1019);
const question = generateRegisteredFichaQuestion("N3.02", level);
Math.random = originalRandom;
const spec = question.uiProps as EmojiRowRiscarSpec;
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
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white px-2 py-4 shadow-sm sm:px-4"
        data-emojirow-riscar-probe
        data-level={spec.nivel}
        data-representation={spec.representacao}
        data-total={spec.total}
        data-remover={spec.remover}
        data-restante={spec.restante}
        data-tutorial={question.tutorial?.length ?? 0}
        data-tutorial-step={tutorialStep ?? ""}
        data-tutorial-fala={tutorialAtivo?.say ?? ""}
        data-tutorial-show={JSON.stringify(tutorialAtivo?.show ?? null)}
        data-rt={question.rt_max_s ?? ""}
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
