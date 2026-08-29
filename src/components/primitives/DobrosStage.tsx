import React from "react";
import type { AnswerMeta, Question } from "../../types";
import type { DobrosF32Spec } from "../../curriculum/procedimentos/dobrosContract";
import { ArrayGrid } from "./ArrayGrid";
import { TenFrame } from "./TenFrame";

/**
 * F32 / N3.06 — as duas fileiras espelhadas, e o extra destacado.
 *
 * ## O palco composto que a ficha nomeia
 *
 * A F32 declara `ArrayGrid` + `TenFrame`, e as duas fazem trabalhos diferentes:
 *
 * - o **ArrayGrid** desenha as duas fileiras iguais, uma sob a outra. É a
 *   simetria que fixa o dobro na memória — a criança reconhece a imagem antes
 *   de contar, e é disso que a dedução do quase-dobro vai partir;
 * - a **TenFrame** mostra **uma** fileira dentro da moldura de dez. Uma só, e
 *   por um motivo que não é estético: a moldura preenchida com o TOTAL seria a
 *   resposta desenhada na tela, que é a CLASS-009 exata. Meia fileira apoia sem
 *   entregar.
 *
 * ## Por que o ArrayGrid entra sem alternativas
 *
 * O `ArrayGrid` desenha a própria barra de alternativas quando recebe
 * `options`. Aqui ele recebe uma questão sintética sem nenhuma: quem responde é
 * a barra deste palco, e duas barras dariam dois caminhos para o mesmo acerto —
 * CLASS-010, a resposta comprada duas vezes.
 */
interface Props {
  spec: DobrosF32Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function DobrosStage({ spec, disabled, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  // As duas fileiras da âncora, mais a casa do extra quando ela existe. A casa
  // extra fica fora da grade espelhada de propósito: é ela que a criança precisa
  // enxergar como "o que sobra do dobro".
  const gradeDoDobro = {
    kind: "array",
    prompt: "",
    uiProps: { rows: 2, cols: spec.ancora, allowRotate: false, requireRotate: false, areaMode: false, showEquation: false },
    evaluate: () => false,
  } as unknown as Question;

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f32-stage data-f32-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">Duas fileiras iguais</div>

      <div className="flex justify-center"><ArrayGrid question={gradeDoDobro} onAnswer={() => undefined} disabled={true} /></div>

      {spec.extra !== 0 && <div className="mt-3 flex flex-col items-center gap-1" data-f32-extra={spec.extra}>
        <div
          aria-label={spec.extra > 0 ? "um a mais que o dobro" : "um a menos que o dobro"}
          className={`h-11 w-11 rounded-md border-4 ${spec.extra > 0 ? "border-amber-500 bg-amber-300" : "border-slate-400 border-dashed bg-white"}`}
        />
        <p className="font-bold text-slate-700">{spec.extra > 0 ? "um a mais" : "um a menos"}</p>
      </div>}

      <div className="mt-4 flex flex-col items-center gap-1">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Uma fileira na moldura de dez</p>
        <TenFrame moldura={{ casas: 10, ocupadas: Array.from({ length: Math.min(10, spec.ancora) }, (_, i) => i), emoji: "🔵" }} />
      </div>

      {spec.mostrarApoio && <p className="mt-4 text-center text-xl font-black text-slate-800" data-f32-apoio>
        {spec.ancora} + {spec.ancora} = {spec.dobroAncora}
      </p>}

      <div role="group" aria-label="Alternativas" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spec.opcoes.map(opcao => (
          <button
            key={String(opcao.value)}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => responder(opcao.value, opcao.misconception)}
            className="min-h-16 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xl font-black text-slate-800 hover:border-sky-400 disabled:opacity-40"
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  </section>;
}
