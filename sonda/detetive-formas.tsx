import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { DetetiveFormasF58Spec } from "../src/curriculum/procedimentos/detetiveFormasContract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") || 1)));
const question = generateRegisteredFichaQuestion("GE.03", level);
const spec = question.uiProps as DetetiveFormasF58Spec;

type Receipt = { value: string; correct: boolean; meta?: AnswerMeta };

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  return (
    <main className="min-h-screen bg-slate-50 px-1 py-4 sm:px-2">
      <section
        className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-2 py-4 shadow-sm sm:px-4"
        data-detetive-formas-probe
        data-level={spec.nivel}
        data-mode={spec.modo}
        data-answer={spec.resposta}
        data-generic-options={shouldRenderQuestionOptions(question) ? "true" : "false"}
        data-resolution-steps={question.resolucao?.passos.length ?? 0}
        data-resolution-final={String(question.resolucao?.passos.at(-1)?.parcial ?? "")}
        data-evidence={question.exigeEvidencia ?? ""}
        data-receipts={JSON.stringify(receipts)}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <FichaRenderer question={question} onAnswer={(value, correct, meta) => setReceipts(current => [...current, { value: String(value), correct, meta }])} />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
