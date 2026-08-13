import React, { useEffect, useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import type {
  SkipCountF30Spec,
  SkipCountResolutionShow,
} from "../../curriculum/procedimentos/skipCountContract";
import {
  metaSkipCount,
  type AcaoSkipCount,
} from "../../curriculum/procedimentos/skipCountProcedure";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";
import { Quadrado100 } from "./Quadrado100";

interface Props {
  spec: SkipCountF30Spec;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

function asResolutionShow(value: unknown): SkipCountResolutionShow | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SkipCountResolutionShow>;
  return Array.isArray(candidate.sequencia)
    && typeof candidate.salto === "number"
    && typeof candidate.apoio === "string"
    ? candidate as SkipCountResolutionShow
    : null;
}

function tutorialPosition(mostrar: unknown, fallback: number): number {
  if (!mostrar || typeof mostrar !== "object") return fallback;
  const show = mostrar as Record<string, unknown>;
  if (typeof show.para === "number") return show.para;
  if (typeof show.marcarPonto === "number") return show.marcarPonto;
  return fallback;
}

export function SkipCountStage({
  spec,
  disabled = false,
  promptDone = true,
  mostrar,
  falar,
  onAnswer,
}: Props) {
  const [aviso, setAviso] = useState("");
  const resolutionShow = useMemo(() => asResolutionShow(mostrar), [mostrar]);
  const demonstracao = Boolean(mostrar);

  useEffect(() => setAviso(""), [spec.nivel, spec.salto, spec.inicio, spec.resposta]);

  const sequenciaVisual = resolutionShow?.sequencia ?? spec.sequencia;
  const ultimo = sequenciaVisual.at(-1) ?? spec.sequencia.at(-1)!;
  const posicao = resolutionShow?.respostaRevelada
    ?? tutorialPosition(mostrar, ultimo);
  const destacados = resolutionShow?.multiplosDestacados
    ?? (spec.mostrarQuadrado100
      ? Array.from({ length: Math.floor(spec.limite / spec.salto) }, (_, index) => (index + 1) * spec.salto)
      : []);

  const responder = (valor: number) => {
    if (disabled || !promptDone || demonstracao) return;
    const correta = valor === spec.resposta;
    const acao: AcaoSkipCount = {
      nivel: spec.nivel,
      valor,
      esperado: spec.resposta,
      salto: spec.salto,
      inicio: spec.inicio,
      correta,
    };
    const meta = metaSkipCount(acao, spec);
    const texto = correta
      ? `${spec.resposta}. O salto continuou de ${spec.salto} em ${spec.salto}.`
      : `Mantenha o mesmo salto de ${spec.salto}.`;
    setAviso(texto);
    falar?.(texto);
    onAnswer(valor, meta);
  };

  const arcos = spec.apoio === "reta-arcos"
    ? spec.sequencia.slice(0, -1).map((from, index) => ({ from, to: spec.sequencia[index + 1] }))
    : [];

  return (
    <section
      data-skip-count-stage
      data-nivel={spec.nivel}
      data-apoio={spec.apoio}
      data-salto={spec.salto}
      data-inicio={spec.inicio}
      className="mx-auto w-full max-w-4xl space-y-4 text-center"
      aria-label={`Contagem de ${spec.salto} em ${spec.salto}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-2xl font-black text-slate-900 sm:text-3xl" data-sequencia-escrita>
        {sequenciaVisual.map((valor, index) => (
          <React.Fragment key={`${valor}-${index}`}>
            {index > 0 && <span aria-hidden className="text-slate-400">→</span>}
            <span>{valor}</span>
          </React.Fragment>
        ))}
        {resolutionShow?.respostaRevelada == null && <><span aria-hidden className="text-slate-400">→</span><span data-proximo-termo>?</span></>}
      </div>

      {spec.mostrarReta && (
        <div data-skip-count-line className="relative rounded-3xl bg-white px-1 shadow-sm">
          {arcos.map(({ from, to }) => (
            <span
              key={`${from}-${to}`}
              data-salto-arco={`${from}-${to}`}
              aria-hidden
              className="pointer-events-none absolute z-20 h-6 rounded-[50%] border-t-2 border-dashed border-blue-500"
              style={{
                left: `${(from / spec.limite) * 100}%`,
                width: `${((to - from) / spec.limite) * 100}%`,
                top: 38,
              }}
            />
          ))}
          <InteractiveNumberLineSurface
            start={0}
            end={spec.limite}
            position={posicao}
            emoji="🚀"
            disabled={disabled}
            interactionDisabled={!promptDone || demonstracao}
            numeraisVisiveis={[...new Set([...spec.sequencia, spec.resposta, 0, spec.limite])]}
            target={spec.resposta}
            pulsarTarget={!demonstracao}
            onTapTick={responder}
          />
        </div>
      )}

      {spec.mostrarQuadrado100 && (
        <div data-skip-count-hundred-chart className="rounded-3xl bg-slate-50 p-2 sm:p-4">
          <p className="mb-2 text-sm font-extrabold text-slate-700">Olhe o padrão dos múltiplos de {spec.salto}.</p>
          <Quadrado100 highlightedNumbers={destacados} interactive={false} />
        </div>
      )}

      {!spec.mostrarReta && !demonstracao && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-skip-count-options aria-label="Opções para o próximo número">
          {spec.opcoes.map(opcao => (
            <button
              key={opcao.valor}
              type="button"
              disabled={disabled || !promptDone}
              onClick={() => responder(opcao.valor)}
              className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-3 text-xl font-black text-slate-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {opcao.valor}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite" className="min-h-6 text-sm font-bold text-slate-700">{aviso}</div>
    </section>
  );
}
