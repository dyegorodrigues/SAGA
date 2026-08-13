import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { EqualGroupsF97Spec } from "../src/curriculum/procedimentos/equalGroupsContract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 1) || 1));
const seed = Number(params.get("seed") ?? 97) || 97;

function seededRandom(initial: number): () => number {
  let state = initial >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

const originalRandom = Math.random;
Math.random = seededRandom(seed + level * 1009);
const question = generateRegisteredFichaQuestion("N4.01", level);
Math.random = originalRandom;
const spec = question.uiProps as EqualGroupsF97Spec;

interface Receipt { value: number; correct: boolean; meta?: AnswerMeta }

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  return (
    <main className="min-h-screen bg-slate-50 px-1 py-4 sm:px-2">
      <section
        className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-2 py-4 shadow-sm sm:px-4"
        data-equal-groups-probe
        data-level={spec.nivel}
        data-groups={spec.grupos}
        data-per-group={spec.porGrupo}
        data-total={spec.total}
        data-representation={spec.representacao}
        data-sum={spec.somaRepetida}
        data-multiplication={spec.multiplicacao}
        data-show-sum={spec.mostrarSoma ? "true" : "false"}
        data-show-multiplication={spec.mostrarMultiplicacao ? "true" : "false"}
        data-options={JSON.stringify(question.options ?? [])}
        data-generic-options={shouldRenderQuestionOptions(question) ? "true" : "false"}
        data-resolution-steps={question.resolucao?.passos.length ?? 0}
        data-resolution-final={String(question.resolucao?.passos.at(-1)?.parcial ?? "")}
        data-evidence={question.exigeEvidencia ?? ""}
        data-receipts={JSON.stringify(receipts)}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <FichaRenderer
          question={question}
          onAnswer={(value, correct, meta) => setReceipts(current => [...current, { value: Number(value), correct, meta }])}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
