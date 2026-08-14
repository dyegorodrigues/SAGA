import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { PerimetroF63Spec } from "../src/curriculum/procedimentos/perimetroContract";
import type { AnswerMeta } from "../src/types";

const level = Math.max(1, Math.min(5, Number(new URLSearchParams(location.search).get("level") || 1)));
const question = generateRegisteredFichaQuestion("GM.07", level);
const spec = question.uiProps as PerimetroF63Spec;
type Receipt = { value: string; correct: boolean; meta?: AnswerMeta };

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  return <main className="min-h-screen bg-slate-50 px-1 py-4">
    <section
      className="mx-auto max-w-4xl rounded-3xl bg-white px-2 py-4"
      data-f63-probe
      data-level={level}
      data-mode={spec.modo}
      data-answer={spec.resposta}
      data-perimeter={spec.perimetro}
      data-area={spec.area}
      data-generic={shouldRenderQuestionOptions(question) ? "true" : "false"}
      data-steps={question.resolucao?.passos.length ?? 0}
      data-final={String(question.resolucao?.passos.at(-1)?.parcial ?? "")}
      data-evidence={question.exigeEvidencia ?? ""}
      data-receipts={JSON.stringify(receipts)}
    >
      <p className="text-center font-black">{question.prompt}</p>
      <FichaRenderer
        question={question}
        onAnswer={(value, correct, meta) => setReceipts(current => [...current, { value: String(value), correct, meta }])}
      />
    </section>
  </main>;
}

createRoot(document.getElementById("root")!).render(<Probe />);
