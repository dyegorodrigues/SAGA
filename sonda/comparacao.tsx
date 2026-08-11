import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { ComparacaoSimbolicaStage } from "../src/components/primitives/ComparacaoSimbolicaStage";
import type { ComparacaoSimbolicaSpec, SimboloComparacao } from "../src/curriculum/procedimentos/comparacaoSimbolicaContract";
import { generateRegisteredFichaQuestion } from "../src/curriculum/motores/composerCanary";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 3) || 3));
const question = generateRegisteredFichaQuestion("N2.03", level);
const spec = question.uiProps as ComparacaoSimbolicaSpec;

interface Receipt {
  value: SimboloComparacao;
  meta?: AnswerMeta;
}

function Probe() {
  const [receipt, setReceipt] = React.useState<Receipt | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 px-2 py-5">
      <section
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white px-2 py-5 shadow-sm"
        data-comparacao-probe
        data-level={spec.nivel}
        data-correct={spec.resposta}
        data-lados={JSON.stringify(spec.lados)}
        data-answer={receipt?.value ?? ""}
        data-misconception={receipt?.meta?.misconception ?? ""}
        data-evidencias={(receipt?.meta?.evidencias ?? []).join("|")}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{question.prompt}</p>
        <ComparacaoSimbolicaStage
          spec={spec}
          onAnswer={(value, meta) => setReceipt({ value, meta })}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
