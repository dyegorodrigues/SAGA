import React from "react";
import type { AnswerMeta } from "../../types";
import type { FracaoNumeroF72Spec } from "../../curriculum/procedimentos/fracaoNumeroContract";
import { evidenciasFracaoNumero } from "../../curriculum/procedimentos/fracaoNumeroProcedure";
import { SingaporeFractionBar } from "./SingaporeBars";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";

interface Props {
  spec: FracaoNumeroF72Spec;
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

function Colecao({ spec }: { spec: FracaoNumeroF72Spec }) {
  return (
    <div className="mx-auto grid max-w-md grid-cols-6 gap-3 rounded-3xl bg-slate-50 p-5" data-f72-collection>
      {Array.from({ length: spec.totalColecao ?? spec.denominador }, (_, i) => (
        <span key={i} aria-hidden className={`mx-auto block h-10 w-10 rounded-full border-2 border-slate-400 ${i < spec.numerador ? "bg-sky-400" : "bg-white"}`} />
      ))}
    </div>
  );
}

function rotuloTick(spec: FracaoNumeroF72Spec, tick: number): string {
  if (tick === 0) return "0";
  if (tick === spec.denominador) return "1";
  if (tick === spec.denominador * 2) return "2";
  return `${tick}/${spec.denominador}`;
}

export function FracaoNumeroStage({ spec, disabled, onAnswer }: Props) {
  const [posicao, setPosicao] = React.useState(0);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPosicao(0);
    setFeedback(null);
  }, [spec]);

  const responder = (valor: string, misconception?: string, veioDaReta = false) => {
    if (disabled) return;
    const correta = valor === spec.resposta;
    const evidencias = evidenciasFracaoNumero({ nivel: spec.nivel, correta });
    setFeedback(correta ? "Isso: a fração ocupa exatamente esse lugar." : "Use os intervalos da reta: o denominador divide e o numerador diz quantos avançar.");
    onAnswer(valor, {
      ...(misconception && !correta ? { misconception } : {}),
      ...(evidencias.length ? { evidencias } : {}),
      ...(veioDaReta ? { manipulacao: correta ? { distanciaDoAlvoCorreto: 0, raioDeSnap: 24 } : { foraDeAlvoValido: true } } : {}),
    });
  };

  const responderTick = (tick: number) => {
    setPosicao(tick);
    responder(`${tick}/${spec.denominador}`, tick === spec.numerador ? undefined : (tick < spec.numerador ? "nao-ordena-fracao-como-numero" : "conta-marcas-em-vez-de-intervalos"), true);
  };

  const labels = Array.from({ length: spec.retaFim + 1 }, (_, tick) => {
    if (spec.modo === "reta-parcial") {
      const metade = spec.denominador / 2;
      if (![0, metade, spec.denominador].includes(tick)) return "";
    }
    return rotuloTick(spec, tick);
  });

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f72-stage data-f72-level={spec.nivel} data-f72-mode={spec.modo} data-f72-support={spec.suporte}>
      <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6">
        <p className="mb-4 text-center text-sm font-bold text-slate-600">A barra inteira e o trecho de 0 a 1 representam a mesma quantidade.</p>

        {spec.modo === "colecao" ? <Colecao spec={spec} /> : (
          <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={Math.min(spec.numerador, spec.denominador)} rotulo={spec.modo === "barra" ? spec.resposta : undefined} />
        )}

        {spec.nivel >= 3 && (
          <div className="mt-2" data-f72-line>
            <InteractiveNumberLineSurface
              start={0}
              end={spec.retaFim}
              position={posicao}
              emoji="◆"
              disabled={Boolean(disabled)}
              numeraisVisiveis={[]}
              onTapTick={tick => responderTick(tick)}
              onDragRelease={(clientX, rect) => {
                const pct = rect.width ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
                responderTick(Math.round(pct * spec.retaFim));
              }}
            />
            <div className="relative mx-8 -mt-5 h-8" data-f72-labels>
              {labels.map((label, tick) => label ? (
                <span key={tick} className="absolute -translate-x-1/2 text-xs font-black text-slate-700 sm:text-sm" style={{ left: `${(tick / spec.retaFim) * 100}%` }} data-f72-label={tick}>{label}</span>
              ) : null)}
            </div>
          </div>
        )}

        {spec.nivel <= 2 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3" data-f72-options>
            {spec.opcoes.map(opcao => (
              <button key={opcao.value} type="button" disabled={disabled} data-f72-option={opcao.value} onClick={() => responder(opcao.value, opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black text-slate-800 shadow-sm hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-40">
                {opcao.label}
              </button>
            ))}
          </div>
        )}

        <p className="mt-3 min-h-6 text-center text-sm font-bold text-slate-600" aria-live="polite">{feedback ?? " "}</p>
      </div>
    </section>
  );
}
