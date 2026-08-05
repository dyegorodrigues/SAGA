import React from "react";
import { TrianguloDeFatos } from "./TrianguloDeFatos";
import { FamiliaSpec } from "../../curriculum/procedimentos/familiaContract";

/**
 * A tela de N4.06 — ficha F96, a família multiplicativa.
 *
 * Reusa `NumberBond`, que já aceita `'?'` num vértice: a incógnita chega ao
 * componente como interrogação, nunca como número escondido.
 */

interface Props {
  spec: FamiliaSpec;
  onReplay?: () => void;
}

export function FamiliaStage({ spec, onReplay }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <p className="text-3xl font-black text-slate-800" aria-label={spec.falado}>
          {spec.pergunta}
        </p>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Ouvir a conta de novo"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-50 text-2xl"
          >
            🔊
          </button>
        )}
      </div>

      {/* O "×" grande entre as bases é o que impede a criança de somar por
          hábito: a figura é a mesma do "amigos do dez" de propósito, e o sinal
          é o que transforma o reconhecimento em analogia em vez de confusão.
          Ver Padrão Ouro §6.22. */}
      <TrianguloDeFatos
        topo={spec.triangulo.topo}
        esquerda={spec.triangulo.esquerda}
        direita={spec.triangulo.direita}
        tipo="multiplicativa"
      />

      {spec.apoio.length > 0 && (
        <div
          role="math"
          className="flex flex-col items-center gap-1"
          aria-label={`Os mesmos números também dizem: ${spec.apoio.join(", ")}`}
        >
          {spec.apoio.map(c => (
            <p key={c} className="text-lg font-bold text-slate-500" aria-hidden="true">{c}</p>
          ))}
        </div>
      )}
    </div>
  );
}
