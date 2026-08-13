import React, { useMemo, useState } from "react";
import type { VisualAdditionSpec } from "../../curriculum/procedimentos/visualAdditionContract";
import type { AcaoVisualAddition } from "../../curriculum/procedimentos/visualAdditionProcedure";
import { VisualAddition } from "./VisualAddition";

export interface VisualAdditionStageProps {
  spec: VisualAdditionSpec;
  mostrar?: unknown;
  disabled?: boolean;
  onAnswer: (value: number, action: AcaoVisualAddition) => void;
}

type TutorialShow = {
  destacarGrupo?: "A" | "B";
  fundirGrupos?: boolean;
};

function asTutorialShow(value: unknown): TutorialShow {
  if (!value || typeof value !== "object") return {};
  return value as TutorialShow;
}

/**
 * Palco F13. A superfície compartilhada continua sendo `VisualAddition`; este
 * componente adiciona apenas a sequência autoral e a observação de processo.
 */
export function VisualAdditionStage({ spec, mostrar, disabled, onAnswer }: VisualAdditionStageProps) {
  const [juntou, setJuntou] = useState(false);
  const [usouAjuda, setUsouAjuda] = useState(false);
  const [ultimaResposta, setUltimaResposta] = useState<number | null>(null);
  const [revisoes, setRevisoes] = useState(0);
  const tutorial = asTutorialShow(mostrar);
  const fundidoVisualmente = juntou || tutorial.fundirGrupos === true;
  const modo = spec.representacao === "numerais" ? "numerals" : "objects";
  const teclado = useMemo(() => Array.from({ length: spec.tecladoAte }, (_, value) => value), [spec.tecladoAte]);

  const juntarComAjuda = () => {
    if (disabled) return;
    setUsouAjuda(true);
    setJuntou(true);
  };

  const responder = (value: number) => {
    if (disabled) return;
    const novaRevisao = ultimaResposta !== null && ultimaResposta !== value
      ? revisoes + 1
      : revisoes;
    const correta = value === spec.total;
    setUltimaResposta(value);
    setRevisoes(novaRevisao);
    if (correta && spec.representacao !== "simbolo") setJuntou(true);
    onAnswer(value, {
      nivel: spec.nivel,
      resposta: value,
      correta,
      juntou: correta ? true : juntou,
      usouAjuda,
      revisoes: novaRevisao,
    });
  };

  return (
    <section
      aria-label="Juntar dois grupos"
      data-testid="visual-addition-f13"
      data-nivel={spec.nivel}
      data-representacao={spec.representacao}
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-1 py-2 sm:px-3"
    >
      {spec.representacao === "simbolo" ? (
        <div
          className="rounded-3xl border-2 border-slate-200 bg-white px-6 py-7 text-center text-5xl font-black text-slate-900 shadow-sm sm:text-6xl"
          data-simbolo-puro
        >
          {spec.a} + {spec.b} = ?
        </div>
      ) : (
        <VisualAddition
          a={spec.a}
          b={spec.b}
          emojiA={spec.emoji}
          emojiB={spec.emoji}
          mode={modo}
          showNumbers={spec.representacao === "objetos"}
          merged={fundidoVisualmente}
          highlightGroup={tutorial.destacarGrupo}
        />
      )}

      {spec.mostrarBotaoJuntar && !fundidoVisualmente && (
        <button
          type="button"
          disabled={disabled}
          onClick={juntarComAjuda}
          className="min-h-14 rounded-2xl border-2 border-blue-300 bg-blue-50 px-6 py-3 text-lg font-black text-blue-900 shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 disabled:opacity-60"
          data-juntar-ajuda
        >
          Quer juntar?
        </button>
      )}

      {spec.maoFantasma && (
        <p className="sr-only" data-mao-fantasma>Na primeira demonstração, a mão fantasma mostra uma única vez como os grupos se juntam.</p>
      )}

      <fieldset className="w-full max-w-md" disabled={disabled}>
        <legend className="mb-2 text-center text-sm font-bold text-slate-600">Quantos ficam ao todo?</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {teclado.map(value => (
            <button
              key={value}
              type="button"
              onClick={() => responder(value)}
              aria-label={`Responder ${value}`}
              data-resposta={value}
              className="min-h-16 rounded-2xl border-2 border-slate-300 bg-white text-2xl font-black text-slate-900 shadow-sm transition-transform active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 disabled:opacity-60"
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
