import React from "react";
import type { AnswerMeta } from "../../types";
import type { PorcentagemF87Spec } from "../../curriculum/procedimentos/porcentagemContract";
import { Quadrado100 } from "./Quadrado100";
import { SingaporeFractionBar } from "./SingaporeBars";

interface Props { spec: PorcentagemF87Spec; disabled?: boolean; onAnswer: (valor: number, meta?: AnswerMeta) => void; }
const pintados = (n: number) => Array.from({ length: Math.max(0, Math.min(100, Math.round(n))) }, (_, i) => i + 1);
const denominadorDaAncora = (p: number) => p === 50 ? 2 : p === 25 || p === 75 ? 4 : p === 20 ? 5 : p === 10 ? 10 : 100;
const partesDaAncora = (p: number) => Math.round(p * denominadorDaAncora(p) / 100);

export function PorcentagemStage({ spec, disabled, onAnswer }: Props) {
  const responder = (value: number, misconception?: string) => {
    const correta = value === spec.resposta;
    onAnswer(value, misconception && !correta ? { misconception } : undefined);
  };
  const usaQuadro = spec.modo === "parte-de-cem" || spec.modo === "ancoras";
  const denominador = denominadorDaAncora(spec.percentual);
  const partes = partesDaAncora(spec.percentual);

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f87-stage data-f87-level={spec.nivel} data-f87-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6">
        <div className="mb-4 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">A mesma parte, outra escrita</div>
          <div className="text-2xl font-black text-slate-800">100% é o inteiro</div>
          <div className="mt-1 text-sm font-bold text-slate-600">% significa “de cada cem”</div>
        </div>

        {usaQuadro ? (
          <div data-f87-hundred-grid>
            <Quadrado100 showNumbers={false} highlightedNumbers={pintados(spec.percentual)} />
          </div>
        ) : (
          <div className="space-y-3" data-f87-bar>
            <SingaporeFractionBar denominador={denominador} destacarQuantidade={partes} />
            <div className="text-center text-sm font-bold text-slate-600">
              {spec.percentual}% da barra representa a mesma fração do inteiro.
            </div>
            {spec.modo === "desconto-acrescimo" && (
              <div className="text-center text-lg font-black text-slate-800" data-f87-operation>
                {spec.operacao === "desconto" ? "Desconto" : "Acréscimo"}: primeiro encontre a parte percentual, depois ajuste o total.
              </div>
            )}
            {spec.modo === "percentual-inverso" && (
              <div className="text-center text-lg font-black text-slate-800" data-f87-inverse>
                A parte conhecida vale {spec.percentual}% do inteiro. Reconstrua a barra completa.
              </div>
            )}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" data-f87-options>
          {spec.opcoes.map(opcao => (
            <button
              key={opcao.value}
              type="button"
              disabled={disabled}
              data-f87-option={opcao.value}
              onClick={() => responder(opcao.value, opcao.misconception)}
              className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-3 text-base font-black text-slate-800 shadow-sm hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-40"
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
