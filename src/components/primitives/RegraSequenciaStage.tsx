import React from "react";
import type { AnswerMeta } from "../../types";
import type { RegraSequenciaF57Spec } from "../../curriculum/procedimentos/regraSequenciaContract";
import {
  acertouRegraSequencia,
  diagnosticarRegraSequencia,
  evidenciasRegraSequencia,
} from "../../curriculum/procedimentos/regraSequenciaProcedure";
import { NumberLine } from "./NumberLine";

interface Props {
  spec: RegraSequenciaF57Spec;
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

function termosCompletos(spec: RegraSequenciaF57Spec): number[] {
  return spec.termos.map((termo, indice) => indice === spec.indiceLacuna ? spec.resposta : termo) as number[];
}

export function RegraSequenciaStage({ spec, disabled, onAnswer }: Props) {
  const [entrada, setEntrada] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const completos = termosCompletos(spec);

  React.useEffect(() => {
    setEntrada("");
    setFeedback(null);
  }, [spec]);

  const responder = () => {
    if (disabled || entrada.trim() === "") return;
    const valor = Number(entrada);
    if (!Number.isFinite(valor) || !Number.isInteger(valor)) {
      setFeedback("Digite um número inteiro.");
      return;
    }

    const acao = { nivel: spec.nivel, resposta: valor, respostaCorreta: spec.resposta, spec };
    const correto = acertouRegraSequencia(acao);
    const misconception = diagnosticarRegraSequencia(acao);
    const evidencias = evidenciasRegraSequencia(acao);
    setFeedback(correto ? `Isso! A regra é ${spec.regra.rotulo} a cada passo.` : "Confira a mudança em todos os pares, não só em um deles.");
    onAnswer(String(valor), {
      ...(misconception ? { misconception } : {}),
      ...(evidencias.length ? { evidencias } : {}),
    });
    if (!correto) setEntrada("");
  };

  const retaMin = Math.min(...completos);
  const retaMax = Math.max(...completos);
  const retaStep = spec.regra.operacao === "somar" ? Math.max(1, Math.abs(spec.regra.valor)) : 1;

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f57-stage data-f57-level={spec.nivel} data-f57-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white px-2 py-5 shadow-sm sm:px-5">
        <div className="flex items-start justify-center gap-1 overflow-hidden sm:gap-2" role="group" aria-label="sequência numérica">
          {spec.termos.map((termo, indice) => (
            <React.Fragment key={indice}>
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex h-14 w-full max-w-20 items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-xl font-black tabular-nums text-slate-800 sm:h-16 sm:text-2xl">
                  {termo === null ? (
                    <input
                      data-f57-input
                      aria-label="número que falta"
                      inputMode="numeric"
                      value={entrada}
                      disabled={disabled}
                      onChange={event => setEntrada(event.target.value.replace(/[^0-9-]/g, ""))}
                      onKeyDown={event => { if (event.key === "Enter") responder(); }}
                      className="h-full w-full min-w-0 rounded-2xl bg-transparent px-1 text-center text-xl font-black outline-none focus:ring-4 focus:ring-sky-200 sm:text-2xl"
                    />
                  ) : termo}
                </div>
              </div>
              {indice < spec.termos.length - 1 && (
                <div className="flex w-8 shrink-0 flex-col items-center justify-center self-center sm:w-12" aria-hidden>
                  <span className="text-lg font-black text-slate-400">→</span>
                  {spec.diferencasVisiveis && <span data-f57-rule-arc className="text-xs font-black text-sky-700 sm:text-sm">{spec.regra.rotulo}</span>}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {spec.diferencasVisiveis && spec.regra.operacao === "somar" && (
          <div className="mt-2" data-f57-numberline>
            <NumberLine
              min={retaMin}
              max={retaMax}
              step={retaStep}
              currentValue={completos[0]}
              targetValue={spec.resposta}
              larguraPorPonto={44}
            />
          </div>
        )}

        <div className="mt-3 flex min-h-14 flex-col items-center justify-center gap-2">
          <button
            type="button"
            data-f57-submit
            disabled={disabled || entrada.trim() === ""}
            onClick={responder}
            className="rounded-full bg-sky-600 px-7 py-3 text-lg font-black text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            CONFERIR
          </button>
          <p className="min-h-6 text-center text-sm font-bold text-slate-600" aria-live="polite">{feedback ?? " "}</p>
        </div>
      </div>
    </section>
  );
}
