import React from "react";
import type { AnswerMeta } from "../../types";
import type { EstatisticaChanceF95Spec } from "../../curriculum/procedimentos/estatisticaChanceContract";
import { evidenciasEstatisticaChanceF95 } from "../../curriculum/procedimentos/estatisticaChanceContract";

interface Props {
  spec: EstatisticaChanceF95Spec;
  disabled?: boolean;
  onAnswer: (valor: string | number, meta?: AnswerMeta) => void;
}

function BarraChance({ favoraveis, total, label }: { favoraveis: number; total: number; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4" data-singapore-bars>
      <div className="mb-2 text-sm font-black text-slate-700">{label}</div>
      <div className="flex min-h-12 overflow-hidden rounded-xl border-2 border-slate-300" aria-label={`${favoraveis} casos favoráveis em ${total} resultados`}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`min-w-8 flex-1 border-r border-white last:border-r-0 ${i < favoraveis ? "bg-sky-300" : "bg-slate-200"}`} aria-label={i < favoraveis ? "favorável" : "outro resultado"} />
        ))}
      </div>
      <div className="mt-2 text-xs font-bold text-slate-500">favoráveis em relação ao total</div>
    </div>
  );
}

function GradePossibilidades({ spec }: { spec: EstatisticaChanceF95Spec }) {
  if (!spec.grade) return null;
  const { linhas, colunas, rotulosLinhas, rotulosColunas } = spec.grade;
  return (
    <div className="mx-auto max-w-xl rounded-3xl border-2 border-slate-200 bg-slate-50 p-4" data-array-grid data-f95-combinations>
      <div className="mb-3 text-center text-sm font-black text-slate-700">Grade de possibilidades</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }} aria-label={`${linhas} linhas por ${colunas} colunas de combinações`}>
        {rotulosLinhas.flatMap((linha, i) => rotulosColunas.map((coluna, j) => (
          <div key={`${i}-${j}`} className="flex min-h-20 items-center justify-center rounded-xl border-2 border-sky-300 bg-white px-2 text-center text-xs font-black text-slate-700">
            {linha} + {coluna}
          </div>
        )))}
      </div>
    </div>
  );
}

function Historico({ historico, experimento }: { historico?: string[]; experimento?: { nome: string; artigo: string } }) {
  if (!historico) return null;
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-amber-50 p-4" data-f95-history>
      <div className="mb-2 text-sm font-black text-amber-900">Resultados anteriores</div>
      <div className="flex flex-wrap justify-center gap-2" aria-label={`histórico: ${historico.join(", ")}`}>
        {historico.map((resultado, i) => <span key={`${resultado}-${i}`} className="rounded-full border-2 border-amber-300 bg-white px-4 py-2 font-black text-amber-900">{resultado}</span>)}
      </div>
      <p className="mt-3 text-center text-sm font-bold text-amber-900">
        O histórico descreve o que aconteceu; ele não altera {experimento?.artigo ?? "uma"} {experimento?.nome ?? "moeda justa"} na próxima jogada.
      </p>
    </div>
  );
}

export function EstatisticaChanceStage({ spec, disabled, onAnswer }: Props) {
  const correta = (value: string | number) => String(value) === String(spec.resposta);
  const send = (value: string | number, misconception?: string) => {
    const ok = correta(value);
    const meta: AnswerMeta = {};
    const evidencias = evidenciasEstatisticaChanceF95(spec, ok);
    if (evidencias.length) meta.evidencias = evidencias;
    if (!ok && misconception) meta.misconception = misconception;
    onAnswer(value, Object.keys(meta).length ? meta : undefined);
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f95-stage data-f95-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-1 text-center text-sm font-black uppercase tracking-widest text-slate-500">Estatística e chance</div>
        <div className="mb-5 text-center text-xl font-black text-slate-800">
          {spec.modo === "contar-possibilidades" ? "Organize todas as combinações" : spec.modo === "frequencia-independencia" ? "Histórico não muda uma tentativa independente" : "Compare favoráveis com o total"}
        </div>

        {spec.modo === "mais-menos-provavel" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Os sacos vêm do spec. Estavam escritos à mão aqui — 2 de 6 e 4
                de 6 —, e a barra desenhada teria passado a mentir sobre o
                enunciado assim que a CLASS-003 sorteou o contrato. */}
            {(spec.sacos ?? []).map(saco => (
              <BarraChance key={saco.label} favoraveis={saco.favoraveis} total={saco.total} label={saco.label} />
            ))}
          </div>
        ) : spec.modo === "contar-possibilidades" ? <GradePossibilidades spec={spec} /> : (
          <div className="space-y-4">
            <BarraChance favoraveis={spec.favoraveis} total={spec.total} label={spec.modo === "chance-fracao" ? "Casos da experiência" : "Resultados possíveis"} />
            <Historico historico={spec.historico} experimento={spec.experimento} />
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.opcoes.map(opcao => (
            <button
              key={String(opcao.value)}
              type="button"
              disabled={disabled}
              onClick={() => send(opcao.value, opcao.misconception)}
              className="min-h-20 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40"
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
