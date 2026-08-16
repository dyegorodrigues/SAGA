import React from "react";
import { NumberLine } from "./NumberLine";
import { Relogio } from "./Relogio";
import { tokens } from "../../styles/tokens";
import type { HorasMinutosF62Spec } from "../../curriculum/procedimentos/horasMinutosContract";
import type { AnswerMeta } from "../../types";

interface Props {
  spec: HorasMinutosF62Spec;
  disabled?: boolean;
  onAnswer: (answer: number, meta?: AnswerMeta) => void;
}

const parseHorario = (value: string) => {
  const [horas, minutos] = value.split(":").map(Number);
  return { horas, minutos };
};

export function HorasMinutosStage({ spec, disabled = false, onAnswer }: Props) {
  const fim = spec.duracao ? parseHorario(spec.duracao.fim) : undefined;
  const supportStep = spec.intervaloMinutos === 1 ? 5 : spec.intervaloMinutos;
  const ghost = Array.from({ length: 12 }, (_, i) => ({ numero: i + 1, minutos: (i + 1) * 5 }));

  return (
    <section className="w-full max-w-3xl mx-auto space-y-5" data-f62-stage data-f62-level={spec.nivel} data-f62-mode={spec.modo}>
      <header className="rounded-2xl border p-4 space-y-2" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Cada número do mostrador vale 5 minutos</p>
        <p className="text-lg font-black" style={{ color: tokens.cor.texto.principal }}>
          {spec.duracao ? `${spec.duracao.inicio} → ${spec.duracao.fim}` : `${String(spec.horario.horas).padStart(2, "0")}:${String(spec.horario.minutos).padStart(2, "0")}`}
        </p>
        <p className="text-sm" style={{ color: tokens.cor.texto.secundario }}>
          {spec.duracao ? "Conte primeiro a hora inteira e depois complete os minutos na reta de tempo." : "Siga o ponteiro grande desde o 12 e conte os minutos no intervalo pedido."}
        </p>
      </header>

      <div className={`grid gap-4 ${spec.duracao ? "sm:grid-cols-2" : "grid-cols-1"}`} data-f62-clocks>
        <div className="rounded-2xl border p-3 flex justify-center overflow-hidden" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }}>
          <Relogio initialHours={spec.horario.horas} initialMinutes={spec.horario.minutos} />
        </div>
        {fim && (
          <div className="rounded-2xl border p-3 flex justify-center overflow-hidden" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }}>
            <Relogio initialHours={fim.horas} initialMinutes={fim.minutos} />
          </div>
        )}
      </div>

      {spec.numeracaoFantasma && (
        <div className="rounded-2xl border p-3" style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.borda }} data-f62-ghost-minutes>
          <p className="font-bold mb-2" style={{ color: tokens.cor.texto.principal }}>Numeração fantasma de 5 em 5</p>
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-black" style={{ color: tokens.cor.texto.secundario }}>
            {ghost.map(item => <span key={item.numero}>{item.numero}→{item.minutos}</span>)}
          </div>
        </div>
      )}

      {(spec.duracao || spec.intervaloMinutos <= 5) && (
        <div className="rounded-2xl border p-3 min-w-0 overflow-x-auto" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }} data-f62-timeline>
          <p className="font-bold px-2" style={{ color: tokens.cor.texto.principal }}>{spec.duracao ? "Reta de duração" : "Contagem de minutos"}</p>
          <NumberLine
            min={0}
            max={spec.duracao?.minutos ?? 60}
            step={spec.duracao ? 15 : supportStep}
            targetValue={spec.resposta}
            larguraPorPonto={48}
            highlightedRanges={[{ start: 0, end: spec.resposta, color: tokens.cor.elementos.base_A }]}
          />
          {spec.saltosHorasAntesDosMinutos && (
            <p className="px-2 text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>60 min + 15 min = 75 min</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3" data-f62-options>
        {spec.opcoes.map(option => (
          <button
            key={`${option.value}-${option.label}`}
            type="button"
            disabled={disabled}
            onClick={() => onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined)}
            className="min-h-14 rounded-2xl border px-3 py-2 font-black disabled:opacity-50"
            style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda, color: tokens.cor.texto.principal }}
            data-misconception={option.misconception}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
