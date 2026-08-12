import React from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import { Reta20Stage } from "../src/components/primitives/Reta20Stage";
import { construirReta20Spec } from "../src/curriculum/procedimentos/reta20Contract";
import type { AcaoReta20 } from "../src/curriculum/procedimentos/reta20Procedure";
import type { EventoManipulacao } from "../src/curriculum/procedimentos/filtroMotor";

const params = new URLSearchParams(location.search);
const level = Math.max(1, Math.min(5, Number(params.get("level") ?? 2) || 2));
const raw = Math.max(0, Math.min(0.999, Number(params.get("r") ?? 0.4) || 0.4));
const spec = construirReta20Spec(level, () => raw);

interface Receipt {
  value: number;
  action: AcaoReta20;
  manipulation: EventoManipulacao;
}

function Probe() {
  const [receipt, setReceipt] = React.useState<Receipt | null>(null);
  const [spoken, setSpoken] = React.useState<string[]>([]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white px-3 py-6 shadow-sm"
        data-reta20-probe
        data-level={spec.nivel}
        data-origem={spec.posicaoInicial}
        data-alvo={spec.alvo}
        data-salto={spec.salto}
        data-answer={receipt?.value ?? ""}
        data-gesture={receipt?.action.gesto ?? ""}
        data-outside={receipt?.manipulation.foraDeAlvoValido ? "true" : "false"}
        data-spoken={spoken.join("|")}
      >
        <p className="mb-3 text-center text-xl font-black text-slate-800">{spec.enunciado}</p>
        <Reta20Stage
          spec={spec}
          falar={texto => setSpoken(prev => [...prev, texto])}
          onAnswer={(value, action, manipulation) => setReceipt({ value, action, manipulation })}
        />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Probe />);
