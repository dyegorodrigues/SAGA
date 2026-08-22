import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { FichaRenderer } from "../src/components/FichaRenderer";
import { shouldRenderQuestionOptions } from "../src/components/gameloop/answerPolicy";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { PartesIguaisF45Spec } from "../src/curriculum/procedimentos/partesIguaisContract";
import type { AnswerMeta } from "../src/types";

const level = Math.max(1, Math.min(5, Number(new URLSearchParams(location.search).get("level") || 1)));
const question = generateRegisteredFichaQuestion("N5.01", level);
const spec = question.uiProps as PartesIguaisF45Spec;
type Receipt = { value: string; correct: boolean; meta?: AnswerMeta };

function Probe() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  return (
    <main className="min-h-screen bg-slate-50 px-1 py-4 sm:px-2">
      <section
        className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-2 py-4 shadow-sm sm:px-4"
        data-partes-iguais-probe
        data-level={spec.nivel}
        data-mode={spec.modo}
        data-support={spec.suporte}
        data-denominator={spec.denominador}
        data-answer={spec.resposta}
        data-generic-options={shouldRenderQuestionOptions(question) ? "true" : "false"}
        data-resolution-steps={question.resolucao?.passos.length ?? 0}
        data-resolution-final={String(question.resolucao?.passos.at(-1)?.parcial ?? "")}
        data-evidence={question.exigeEvidencia ?? ""}
        data-touch-alternative={spec.toqueAlternativo ? "true" : "false"}
        data-targets={JSON.stringify(spec.cortesAlvo)}
        data-receipts={JSON.stringify(receipts)}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <FichaRenderer question={question} onAnswer={(value, correct, meta) => setReceipts(current => [...current, { value: String(value), correct, meta }])} />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
