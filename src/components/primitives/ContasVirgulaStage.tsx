import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../../curriculum/masterySignals";
import {
  ContasVirgulaMisconception,
  type ContasVirgulaF76Opcao,
  type ContasVirgulaF76Spec,
} from "../../curriculum/procedimentos/contasVirgulaContract";
import { evidenciasContasVirgulaF76 } from "../../curriculum/procedimentos/contasVirgulaEvidence";
import { InteractiveVerticalDecimalSurface } from "./InteractiveVertical";
import { Quadrado100 } from "./Quadrado100";

interface Props {
  spec: ContasVirgulaF76Spec;
  disabled?: boolean;
  onAnswer: (value: string, meta?: AnswerMeta) => void;
}

const pintados = (n?: number) => Array.from({ length: Math.max(0, Math.min(100, Math.round(n ?? 0))) }, (_, i) => i + 1);

function feedbackDa(tag?: string): string {
  if (tag === ContasVirgulaMisconception.ALINHA_PELA_DIREITA) return "Os últimos algarismos encostaram, mas as vírgulas ficaram em eixos diferentes. Alinhe as ordens pela vírgula.";
  if (tag === ContasVirgulaMisconception.IGNORA_ZEROS) return "A casa ausente precisa ficar visível: complete com zero para manter décimos com décimos e centésimos com centésimos.";
  if (tag === ContasVirgulaMisconception.VIRGULA_PERDIDA) return "A aritmética não apaga o valor posicional. A vírgula continua marcando onde começam as partes do inteiro.";
  return "Confira o valor posicional de cada coluna.";
}

/** F76 — conta decimal armada com a vírgula como eixo físico de alinhamento. */
export function ContasVirgulaStage({ spec, disabled = false, onAnswer }: Props): React.ReactElement {
  const [selecionada, setSelecionada] = useState<ContasVirgulaF76Opcao | undefined>();
  const [revelarResultado, setRevelarResultado] = useState(false);
  const [ultimoErro, setUltimoErro] = useState<string | undefined>();

  const alinhamento = selecionada?.misconception === ContasVirgulaMisconception.ALINHA_PELA_DIREITA ? "direita" as const : "virgula" as const;
  const ignoraZeros = selecionada?.misconception === ContasVirgulaMisconception.IGNORA_ZEROS;
  const superficieA = ignoraZeros ? spec.parcelaA : spec.alinhadoA;
  const superficieB = ignoraZeros ? spec.parcelaB : spec.alinhadoB;
  const grids = useMemo(() => ({ a: pintados(spec.fracaoVisualA), b: pintados(spec.fracaoVisualB) }), [spec]);

  const responder = (option: ContasVirgulaF76Opcao) => {
    if (disabled) return;
    setSelecionada(option);
    const correta = option.value === spec.resposta;
    if (!correta) {
      setRevelarResultado(false);
      setUltimoErro(option.misconception);
      onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined);
      return;
    }

    const evidencias = evidenciasContasVirgulaF76(spec, true);
    if (ultimoErro) evidencias.push(masteryDisqualifier(`f76-${ultimoErro}-precedente`));
    setRevelarResultado(true);
    onAnswer(option.value, evidencias.length ? { evidencias } : undefined);
  };

  return <section
    className="mx-auto w-full max-w-3xl px-2"
    data-f76-stage=""
    data-f76-level={spec.nivel}
    data-f76-mode={spec.modo}
    data-sem-arrasto-obrigatorio={spec.acessibilidade.semArrastoObrigatorio ? "true" : "false"}
    data-erro-motor-nao-tag={spec.acessibilidade.erroMotorNaoTag ? "true" : "false"}
  >
    <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center">
      <p className="font-black text-rose-950">A vírgula é o eixo das ordens.</p>
      <p className="mt-1 text-sm font-semibold text-rose-900">Unidade com unidade, décimo com décimo, centésimo com centésimo.</p>
    </div>

    <div data-f76-before="" data-answer-revealed="false">
      <InteractiveVerticalDecimalSurface
        parcelaA={spec.parcelaA}
        parcelaB={spec.parcelaB}
        alinhadoA={superficieA}
        alinhadoB={superficieB}
        operacao={spec.operacao}
        fator={spec.fator}
        alinhamento={alinhamento}
        zerosPreenchimento={spec.zerosPreenchimento && !ignoraZeros}
        destacarReagrupamento={spec.exigeReagrupamento}
      />
    </div>

    <div className={`mt-4 grid gap-3 ${spec.parcelaB ? "grid-cols-2" : "grid-cols-1"}`} data-f76-place-value="">
      <div className="rounded-2xl border border-slate-200 bg-white p-2">
        <p className="mb-1 text-center text-xs font-bold text-slate-600">Parte decimal de {spec.parcelaA}</p>
        <Quadrado100 showNumbers={false} highlightedNumbers={grids.a} />
      </div>
      {spec.parcelaB ? <div className="rounded-2xl border border-slate-200 bg-white p-2">
        <p className="mb-1 text-center text-xs font-bold text-slate-600">Parte decimal de {spec.parcelaB}</p>
        <Quadrado100 showNumbers={false} highlightedNumbers={grids.b} />
      </div> : null}
    </div>

    {selecionada && !revelarResultado ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center font-bold text-amber-950" data-f76-feedback="" data-misconception={selecionada.misconception ?? ""}>
      {feedbackDa(selecionada.misconception)}
    </div> : null}

    {revelarResultado ? <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4" data-f76-after="" data-answer-revealed="true">
      <p className="mb-3 text-center font-bold text-emerald-950">As ordens ficaram alinhadas. Agora o resultado pode aparecer.</p>
      <InteractiveVerticalDecimalSurface
        parcelaA={spec.parcelaA}
        parcelaB={spec.parcelaB}
        alinhadoA={spec.alinhadoA}
        alinhadoB={spec.alinhadoB}
        operacao={spec.operacao}
        fator={spec.fator}
        resultado={spec.resposta}
        alinhamento="virgula"
        zerosPreenchimento={spec.zerosPreenchimento}
        destacarReagrupamento={spec.exigeReagrupamento}
      />
    </div> : null}

    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Resultados possíveis">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        disabled={disabled}
        onClick={() => responder(option)}
        className="min-h-20 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-lg font-black text-slate-800 active:scale-[0.99] disabled:opacity-50"
        data-f76-option={option.value}
        data-misconception={option.misconception ?? ""}
      >{option.label}</button>)}
    </div>
  </section>;
}
