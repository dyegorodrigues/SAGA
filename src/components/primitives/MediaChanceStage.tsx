import React from "react";
import type { AnswerMeta } from "../../types";
import type { MediaChanceF83Spec } from "../../curriculum/procedimentos/mediaChanceContract";

interface Props {
  spec: MediaChanceF83Spec;
  disabled?: boolean;
  onAnswer: (valor: string | number, meta?: AnswerMeta) => void;
}

function Torres({ spec }: { spec: MediaChanceF83Spec }) {
  const max = Math.max(...spec.torres, Math.ceil(spec.media), 1);
  return (
    <div className="relative mx-auto flex min-h-56 w-full max-w-xl items-end justify-center gap-3 rounded-3xl bg-slate-50 px-4 pb-5 pt-10" aria-label={`torres de blocos; média ${spec.media}`}>
      <div className="pointer-events-none absolute left-3 right-3 border-t-2 border-dashed border-sky-600" style={{ bottom: `${20 + (spec.media / max) * 160}px` }} aria-hidden="true" />
      <div className="absolute right-3 top-3 rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">média {Number.isInteger(spec.media) ? spec.media : spec.media.toFixed(1)}</div>
      {spec.torres.map((altura, torre) => (
        <div key={`${torre}-${altura}`} className="flex min-w-12 flex-1 max-w-20 flex-col-reverse gap-1" aria-label={`torre ${torre + 1}: ${altura} blocos`}>
          {Array.from({ length: altura }, (_, bloco) => (
            <div key={bloco} className="h-7 rounded-lg border-2 border-sky-700 bg-sky-200 shadow-sm" />
          ))}
        </div>
      ))}
    </div>
  );
}

function Chance({ spec }: { spec: MediaChanceF83Spec }) {
  if (spec.modo === "chance-fracao" && spec.chance) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-slate-50 p-5 text-center" data-f83-chance>
        <div className="mb-4 text-sm font-black text-slate-600">Casos favoráveis sobre o total</div>
        <div className="flex flex-wrap justify-center gap-3" aria-label={`${spec.chance.favoraveis} favoráveis de ${spec.chance.total}`}>
          {Array.from({ length: spec.chance.total }, (_, i) => (
            <div key={i} className={`h-14 w-14 rounded-full border-4 ${i < spec.chance!.favoraveis ? "border-sky-700 bg-sky-200" : "border-slate-400 bg-white"}`} aria-label={i < spec.chance.favoraveis ? "favorável" : "outro caso"} />
          ))}
        </div>
        {/* CLASS-009: os círculos já mostram favoráveis e total. Escrever a
            fração ao lado respondia a pergunta antes de ela ser feita. */}
        <div className="mt-4 text-2xl font-black text-slate-800">?</div>
      </div>
    );
  }

  if (spec.modo === "comparar-chances" && spec.sacos) {
    return (
      <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2" data-f83-compare>
        {spec.sacos.map(saco => (
          <div key={saco.label} className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-5 text-center">
            <div className="text-lg font-black text-slate-800">{saco.label}</div>
            <div className="mt-2 text-3xl font-black text-sky-700">{saco.fracao}</div>
            <div className="mt-1 text-xs font-bold text-slate-500">{saco.favoraveis} favoráveis em {saco.total}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function MediaChanceStage({ spec, disabled, onAnswer }: Props) {
  const send = (value: string | number, misconception?: string) =>
    onAnswer(value, misconception && String(value) !== String(spec.resposta) ? { misconception } : undefined);
  const chanceMode = spec.modo === "chance-fracao" || spec.modo === "comparar-chances";

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f83-stage data-singapore-bars data-f83-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-1 text-center text-sm font-black uppercase tracking-widest text-slate-500">Média e chance</div>
        <div className="mb-5 text-center text-xl font-black text-slate-800">{chanceMode ? "Compare a parte com o total" : "Nivele as torres sem perder blocos"}</div>
        {chanceMode ? <Chance spec={spec} /> : <Torres spec={spec} />}
        {spec.meioBloco && (
          <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-900" data-f83-fractional-mean>
            Às vezes a média fica entre dois números. A linha mostra exatamente onde ela fica.
          </div>
        )}
        {chanceMode && spec.exemploMediaFracionaria && (
          <details className="mx-auto mt-4 max-w-xl rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <summary className="cursor-pointer font-black">Ponte com a média</summary>
            <div className="mt-3"><Torres spec={{ ...spec, torres: spec.exemploMediaFracionaria.torres, media: spec.exemploMediaFracionaria.media, meioBloco: true }} /></div>
          </details>
        )}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.opcoes.map(opcao => (
            <button key={String(opcao.value)} type="button" disabled={disabled} onClick={() => send(opcao.value, opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40">
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
