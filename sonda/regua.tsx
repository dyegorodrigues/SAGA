import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { ReguaStage } from "../src/components/primitives/ReguaStage";
import { construirReguaSpec } from "../src/curriculum/procedimentos/reguaContract";
import type { AnswerMeta } from "../src/types";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 3) || 3));
const raw = Math.max(0, Math.min(0.999, Number(params.get("r") ?? 0.5) || 0.5));
const spec = construirReguaSpec(level, () => raw);

interface Receipt {
  value: string;
  meta: AnswerMeta;
}

function Probe() {
  const [receipt, setReceipt] = React.useState<Receipt | null>(null);
  const [spoken, setSpoken] = React.useState<string[]>([]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6">
      <section
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white px-3 py-5 shadow-sm"
        data-regua-probe
        data-level={spec.nivel}
        data-mode={spec.modo}
        data-offset={spec.offsetInicialCm}
        data-correct={spec.resposta}
        data-value={spec.valorCerto ?? ""}
        data-answer={receipt?.value ?? ""}
        data-misconception={receipt?.meta.misconception ?? ""}
        data-evidencias={(receipt?.meta.evidencias ?? []).join("|")}
        data-spoken={spoken.join("|")}
      >
        <p className="mb-3 text-center text-lg font-black text-slate-800">{spec.enunciado}</p>
        <ReguaStage
          spec={spec}
          falar={texto => setSpoken(prev => [...prev, texto])}
          onAnswer={(value, meta) => setReceipt({ value, meta })}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
