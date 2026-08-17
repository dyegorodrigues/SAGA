import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../../curriculum/masterySignals";
import {
  RazaoProporcaoMisconception,
  type RazaoProporcaoF88Opcao,
  type RazaoProporcaoF88Spec,
} from "../../curriculum/procedimentos/razaoProporcaoContract";
import { RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA } from "../../constants/razaoProporcaoMisconceptions";
import { SingaporeLinkedScaleBars } from "./SingaporeBars";

interface Props {
  spec: RazaoProporcaoF88Spec;
  disabled?: boolean;
  onAnswer: (value: string, meta?: AnswerMeta) => void;
}

/**
 * F88 — palco de razão/proporção.
 *
 * A criança decide por toque em alvos de 80px. Antes da decisão, o palco mostra
 * somente o par inicial e, quando o enunciado já fornece o fator, o fator comum;
 * o par escalado nunca é pré-renderizado. Depois da decisão correta, ambas as
 * barras aparecem juntas pelo mesmo fator — não existe controle independente.
 */
export function RazaoProporcaoStage({ spec, disabled = false, onAnswer }: Props): React.ReactElement {
  const [ultimoErro, setUltimoErro] = useState<string | undefined>();
  const [revelarEscala, setRevelarEscala] = useState(false);

  const responder = (option: RazaoProporcaoF88Opcao) => {
    if (disabled) return;
    const correta = option.value === spec.resposta;
    if (!correta) {
      setUltimoErro(option.misconception);
      onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined);
      return;
    }

    const evidencias = [`f88-${spec.modo}`, "f88-mesmo-fator"];
    if (spec.escalaNaoInteira) evidencias.push(RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA);
    if (ultimoErro) evidencias.push(masteryDisqualifier(`f88-${ultimoErro}-precedente`));
    setRevelarEscala(true);
    onAnswer(option.value, { evidencias });
  };

  const fatorAntes = spec.fatorConhecidoAntes ? spec.fatorEscala : undefined;

  return <section
    className="mx-auto w-full max-w-3xl px-2"
    data-razao-proporcao-stage=""
    data-modo={spec.modo}
    data-barras-vinculadas={spec.barrasVinculadas ? "true" : "false"}
    data-erro-motor-nao-tag={spec.acessibilidade.erroMotorNaoTag ? "true" : "false"}
  >
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="font-bold text-slate-700">As duas barras formam uma relação.</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">Para manter a proporção, qualquer escala usa o mesmo fator nas duas quantidades.</p>
    </div>

    <SingaporeLinkedScaleBars
      baseA={spec.baseA}
      baseB={spec.baseB}
      fator={revelarEscala ? spec.fatorEscala : fatorAntes}
      alvoA={spec.alvoA}
      alvoB={spec.alvoB}
      revelarEscaladas={revelarEscala}
    />

    {revelarEscala ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-center" data-f88-result="">
      {spec.modo === "razao-fracao" ? <p className="font-black text-slate-800">Razão primeira/segunda: {spec.resposta}</p> : null}
      {spec.modo === "regra-de-tres" ? <p className="font-black text-slate-800">O mesmo fator leva a segunda quantidade até {spec.resposta}.</p> : null}
      {spec.modo !== "razao-fracao" && spec.modo !== "regra-de-tres" ? <p className="font-black text-slate-800">As duas quantidades escalaram juntas.</p> : null}
    </div> : null}

    <div className="mt-5 grid grid-cols-2 gap-3" aria-label="Respostas de razão e proporção">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        disabled={disabled}
        onClick={() => responder(option)}
        className="min-h-20 rounded-2xl border-2 border-slate-300 bg-white px-3 py-3 text-lg font-black text-slate-800 disabled:opacity-50"
        data-f88-option={option.value}
      >{option.label}</button>)}
    </div>
  </section>;
}

export const F88_CENTRAL_MISCONCEPTION = RazaoProporcaoMisconception.SOMA_EM_VEZ_DE_ESCALAR;
