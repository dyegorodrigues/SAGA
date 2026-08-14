import React from "react";
import type { AnswerMeta } from "../../types";
import type { PartesIguaisF45Spec } from "../../curriculum/procedimentos/partesIguaisContract";
import { cortesSaoPartesIguais, evidenciasPartesIguais } from "../../curriculum/procedimentos/partesIguaisProcedure";
import { FiguraDesenhada } from "./ShapeCanvas";
import { SingaporeFractionBar } from "./SingaporeBars";

interface Props {
  spec: PartesIguaisF45Spec;
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

function ParticaoCircular({ spec }: { spec: PartesIguaisF45Spec }) {
  const tamanho = 220;
  const centro = tamanho / 2;
  const raio = tamanho / 2 - 8;
  const marcas = [0, ...spec.cortes];
  return (
    <div className="relative mx-auto" style={{ width: tamanho, height: tamanho }} data-f45-circle>
      <FiguraDesenhada figura="circulo" tamanho={tamanho} cor="#BAE6FD" />
      <svg className="pointer-events-none absolute inset-0" width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`} aria-hidden>
        {marcas.map((marca, indice) => {
          const angulo = marca * Math.PI * 2;
          const x = centro + Math.cos(angulo) * raio;
          const y = centro + Math.sin(angulo) * raio;
          return <line key={`${indice}-${marca}`} x1={centro} y1={centro} x2={x} y2={y} stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />;
        })}
      </svg>
      {spec.sobrepor && (
        <div className="pointer-events-none absolute inset-8 rounded-full border-4 border-dashed border-fuchsia-500" data-f45-overlay aria-hidden />
      )}
    </div>
  );
}

function limitarMarca(valor: number, indice: number, atuais: number[]) {
  const passo = 1 / 12;
  const minimo = indice === 0 ? passo : atuais[indice - 1] + passo;
  const maximo = indice === atuais.length - 1 ? 1 - passo : atuais[indice + 1] - passo;
  return Math.max(minimo, Math.min(maximo, valor));
}

export function PartesIguaisStage({ spec, disabled, onAnswer }: Props) {
  const [marcas, setMarcas] = React.useState(spec.cortes);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMarcas(spec.cortes);
    setFeedback(null);
  }, [spec]);

  const responderOpcao = (valor: string, misconception?: string) => {
    if (disabled) return;
    const correto = valor === spec.resposta;
    setFeedback(correto ? "Isso! Primeiro garantimos partes do mesmo tamanho." : "Compare o tamanho das partes antes de contar quantas existem.");
    onAnswer(valor, misconception && !correto ? { misconception } : undefined);
  };

  const atualizarMarca = (indice: number, valor: number) => {
    if (disabled) return;
    setMarcas(atuais => atuais.map((atual, i) => i === indice ? limitarMarca(valor, indice, atuais) : atual));
  };

  const conferirDivisao = () => {
    if (disabled) return;
    const correto = cortesSaoPartesIguais(marcas, spec.denominador);
    const evidencias = evidenciasPartesIguais({ nivel: spec.nivel, denominador: spec.denominador, cortes: marcas });
    setFeedback(correto ? "Perfeito: todas as partes ficaram do mesmo tamanho." : "As partes ainda têm tamanhos diferentes. Ajuste as marcas e compare de novo.");
    onAnswer(correto ? spec.resposta : "ajustar", {
      ...(evidencias.length ? { evidencias } : {}),
      manipulacao: correto
        ? { distanciaDoAlvoCorreto: 0, raioDeSnap: 18 }
        : { foraDeAlvoValido: true },
    });
  };

  const barraMarcas = spec.modo === "produzir" ? marcas : spec.cortesAlvo;

  return (
    <section
      className="mx-auto w-full max-w-3xl px-1 py-2"
      data-f45-stage
      data-f45-level={spec.nivel}
      data-f45-mode={spec.modo}
      data-f45-support={spec.suporte}
    >
      <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6">
        <p className="mb-4 text-center text-sm font-bold text-slate-600">
          O número de pedaços só vale depois que o tamanho de cada parte foi conferido.
        </p>

        {spec.suporte === "circulo" ? (
          <ParticaoCircular spec={spec} />
        ) : (
          <SingaporeFractionBar
            denominador={spec.denominador}
            marcas={barraMarcas}
            destacarPrimeira={spec.modo !== "produzir"}
            rotulo={spec.modo === "nomear" ? spec.rotulo : spec.modo === "simbolo" ? `1/${spec.denominador}` : undefined}
          />
        )}

        {spec.modo === "produzir" && (
          <div className="mt-5 space-y-4" data-f45-controls>
            {marcas.map((marca, indice) => {
              const passo = 1 / 12;
              return (
                <div key={indice} className="rounded-2xl bg-slate-50 p-3">
                  <label className="mb-2 block text-center text-sm font-black text-slate-700" htmlFor={`f45-marca-${indice}`}>
                    Marca {indice + 1}
                  </label>
                  <input
                    id={`f45-marca-${indice}`}
                    data-f45-range
                    data-f45-target={spec.cortesAlvo[indice]}
                    type="range"
                    min={1}
                    max={11}
                    step={1}
                    value={Math.round(marca * 12)}
                    disabled={disabled}
                    onChange={event => atualizarMarca(indice, Number(event.target.value) / 12)}
                    className="w-full accent-sky-600"
                    aria-label={`posição da marca ${indice + 1}`}
                  />
                  {spec.toqueAlternativo && (
                    <div className="mt-2 flex justify-center gap-3">
                      <button type="button" disabled={disabled} data-f45-nudge="left" onClick={() => atualizarMarca(indice, marca - passo)} className="min-h-12 min-w-20 rounded-2xl border-2 border-slate-300 bg-white text-xl font-black text-slate-700">←</button>
                      <button type="button" disabled={disabled} data-f45-nudge="right" onClick={() => atualizarMarca(indice, marca + passo)} className="min-h-12 min-w-20 rounded-2xl border-2 border-slate-300 bg-white text-xl font-black text-slate-700">→</button>
                    </div>
                  )}
                </div>
              );
            })}
            <button type="button" data-f45-submit disabled={disabled} onClick={conferirDivisao} className="mx-auto block min-h-12 rounded-full bg-sky-600 px-8 py-3 text-lg font-black text-white shadow-sm disabled:opacity-40">
              CONFERIR AS PARTES
            </button>
          </div>
        )}

        {spec.modo !== "produzir" && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3" data-f45-options>
            {spec.opcoes.map(opcao => (
              <button
                key={opcao.value}
                type="button"
                data-f45-option={opcao.value}
                disabled={disabled}
                onClick={() => responderOpcao(opcao.value, opcao.misconception)}
                className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-black text-slate-800 shadow-sm transition hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-40"
              >
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
