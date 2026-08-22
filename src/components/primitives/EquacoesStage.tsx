import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../../curriculum/masterySignals";
import type {
  EquacoesF90Lado,
  EquacoesF90Opcao,
  EquacoesF90Spec,
} from "../../curriculum/procedimentos/equacoesContract";
import { evidenciasEquacoesF90 } from "../../curriculum/procedimentos/equacoesEvidence";
import { Balanca, type BalancaItem } from "./Balanca";

interface Props {
  spec: EquacoesF90Spec;
  disabled?: boolean;
  onAnswer: (value: string, meta?: AnswerMeta) => void;
}

function itensDoLado(lado: EquacoesF90Lado, x: number, prefixo: string): BalancaItem[] {
  const itens: BalancaItem[] = [];
  for (let i = 0; i < lado.coefX; i += 1) {
    itens.push({ id: `${prefixo}-x-${i}`, weight: x, label: "x" });
  }
  if (lado.constante !== 0) {
    itens.push({
      id: `${prefixo}-c`,
      weight: lado.constante,
      label: lado.constante > 0 ? `+${lado.constante}` : `−${Math.abs(lado.constante)}`,
    });
  }
  return itens;
}

function itensPreview(option: EquacoesF90Opcao): { esquerda: BalancaItem[]; direita: BalancaItem[] } {
  return {
    esquerda: [{ id: "preview-e", weight: option.preview.esquerda, label: "lado E" }],
    direita: [{ id: "preview-d", weight: option.preview.direita, label: "lado D" }],
  };
}

/**
 * F90 — equações como equilíbrio físico.
 *
 * A criança nunca precisa arrastar: todas as transformações possuem alternativa
 * por toque com alvo mínimo de 80px. O valor de x só aparece depois da decisão
 * correta; antes disso, os sacos têm peso interno suficiente para a Balanca
 * representar a igualdade, mas são rotulados apenas como `x`.
 */
export function EquacoesStage({ spec, disabled = false, onAnswer }: Props): React.ReactElement {
  const [selecionada, setSelecionada] = useState<EquacoesF90Opcao | undefined>();
  const [revelarSolucao, setRevelarSolucao] = useState(false);
  const [ultimoErro, setUltimoErro] = useState<string | undefined>();

  const antesEsquerda = useMemo(() => itensDoLado(spec.esquerda, spec.solucao, "antes-e"), [spec]);
  const antesDireita = useMemo(() => itensDoLado(spec.direita, spec.solucao, "antes-d"), [spec]);
  const depoisEsquerda = useMemo(() => itensDoLado(spec.finalEsquerda, spec.solucao, "depois-e"), [spec]);
  const depoisDireita = useMemo(() => itensDoLado(spec.finalDireita, spec.solucao, "depois-d"), [spec]);

  const responder = (option: EquacoesF90Opcao) => {
    if (disabled) return;
    setSelecionada(option);
    const correta = option.value === spec.resposta;
    if (!correta) {
      setUltimoErro(option.misconception);
      setRevelarSolucao(false);
      onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined);
      return;
    }

    const evidencias = evidenciasEquacoesF90(spec, true);
    if (ultimoErro) evidencias.push(masteryDisqualifier(`f90-${ultimoErro}-precedente`));
    setRevelarSolucao(true);
    onAnswer(option.value, { evidencias });
  };

  const preview = selecionada && !revelarSolucao ? itensPreview(selecionada) : undefined;

  return <section
    className="mx-auto w-full max-w-3xl px-2"
    data-equacoes-stage=""
    data-modo={spec.modo}
    data-equilibrio-fisico={spec.equilibrioFisico ? "true" : "false"}
    data-sem-arrasto-obrigatorio={spec.acessibilidade.semArrastoObrigatorio ? "true" : "false"}
    data-erro-motor-nao-tag={spec.acessibilidade.erroMotorNaoTag ? "true" : "false"}
  >
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
      <p className="font-black text-amber-950">Equação é equilíbrio.</p>
      <p className="mt-1 text-sm font-semibold text-amber-900">Se um prato muda, o outro precisa receber a mesma transformação.</p>
      <p className="mt-2 text-2xl font-black tracking-wide text-slate-900">{spec.equacao}</p>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white px-5 pt-4" data-f90-before="" data-balanced="true">
      <p className="text-center text-sm font-bold text-slate-600">Os dois pratos começam com o mesmo valor.</p>
      <div className="w-full px-[62px] sm:px-16">
        <Balanca leftItems={antesEsquerda} rightItems={antesDireita} state="ocioso" />
      </div>
    </div>

    {preview && selecionada ? <div
      className={`mt-4 rounded-3xl border p-4 ${selecionada.preview.preservaEquilibrio ? "border-sky-200 bg-sky-50" : "border-rose-200 bg-rose-50"}`}
      data-f90-preview=""
      data-preview-balanced={selecionada.preview.preservaEquilibrio ? "true" : "false"}
    >
      <p className="text-center font-bold text-slate-800">{selecionada.preview.descricao}</p>
      <div className="w-full px-[62px] sm:px-16">
        <Balanca leftItems={preview.esquerda} rightItems={preview.direita} state="ocioso" />
      </div>
    </div> : null}

    {revelarSolucao ? <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4" data-f90-after="" data-balanced="true">
      <p className="text-center font-bold text-emerald-950">A mesma transformação nos dois pratos preservou a igualdade.</p>
      <div className="w-full px-[62px] sm:px-16">
        <Balanca leftItems={depoisEsquerda} rightItems={depoisDireita} state="acerto" />
      </div>
      <p className="pb-2 text-center text-2xl font-black text-slate-900">{spec.equacaoFinal}</p>
      <ol className="mx-auto mt-2 max-w-xl list-decimal space-y-1 pl-6 text-sm font-semibold text-slate-700">
        {spec.passosCorretos.map(passo => <li key={passo}>{passo}</li>)}
      </ol>
    </div> : null}

    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Transformações possíveis">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        disabled={disabled}
        onClick={() => responder(option)}
        className="min-h-20 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-black text-slate-800 disabled:opacity-50"
        data-f90-option={option.value}
        data-misconception={option.misconception ?? ""}
      >{option.label}</button>)}
    </div>
  </section>;
}
