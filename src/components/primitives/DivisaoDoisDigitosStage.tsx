import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import { Evidencia } from "../../constants/evidencias";
import {
  avaliarEstimativaF71,
  DivisaoDoisDigitosMisconception,
  type DivisaoDoisDigitosF71Spec,
} from "../../curriculum/procedimentos/divisaoDoisDigitosContract";
import { InteractiveVerticalDivisionEstimateSurface } from "./InteractiveVertical";

interface Props {
  spec: DivisaoDoisDigitosF71Spec;
  disabled?: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

type Teste = ReturnType<typeof avaliarEstimativaF71>;

/**
 * F71 — superfície processual da InteractiveVertical.
 *
 * A primeira estimativa nasce da criança: os controles por toque constroem o
 * número antes do primeiro teste. Testar e ajustar são exploração pedagógica e
 * nunca emitem misconception. Só confirmar conscientemente uma estimativa que
 * o próprio teste já refutou produz diagnóstico conceitual.
 */
export function DivisaoDoisDigitosStage({ spec, disabled = false, onAnswer }: Props): React.ReactElement {
  const [estimativa, setEstimativa] = useState<number | undefined>();
  const [teste, setTeste] = useState<Teste | undefined>();
  const [estimativaTestada, setEstimativaTestada] = useState<number | undefined>();
  const [primeiraEstimativa, setPrimeiraEstimativa] = useState<number | undefined>();
  const [ajustouAposPrimeiroTeste, setAjustouAposPrimeiroTeste] = useState(false);

  const alterarEstimativa = (delta: -100 | -10 | -1 | 1 | 10 | 100) => {
    if (disabled) return;
    const atual = estimativa ?? 0;
    const proxima = Math.max(0, atual + delta);
    if (proxima === atual) return;
    if (primeiraEstimativa !== undefined && estimativaTestada === estimativa) {
      setAjustouAposPrimeiroTeste(true);
    }
    setEstimativa(proxima);
    setTeste(undefined);
    setEstimativaTestada(undefined);
  };

  const testar = () => {
    if (disabled || estimativa === undefined || estimativa <= 0) return;
    const resultado = avaliarEstimativaF71(spec, estimativa);
    setTeste(resultado);
    setEstimativaTestada(estimativa);
    if (primeiraEstimativa === undefined) setPrimeiraEstimativa(estimativa);
  };

  const confirmar = () => {
    if (disabled || estimativa === undefined || !teste || estimativaTestada !== estimativa) return;
    if (teste.relacao !== "exata") {
      const primeiraFoiChute = primeiraEstimativa === estimativa
        && Math.abs(estimativa - spec.estimativaInicial) > Math.max(2, Math.ceil(spec.estimativaInicial * 0.25));
      onAnswer(estimativa, {
        source: "vertical-column",
        misconception: primeiraFoiChute
          ? DivisaoDoisDigitosMisconception.NAO_ESTIMA
          : DivisaoDoisDigitosMisconception.NAO_AJUSTA,
        evidencias: [`f71-${spec.modo}-confirmacao-refutada`],
      });
      return;
    }

    const evidencias = [`f71-${spec.modo}`];
    if (spec.ajustePrimeiraEstimativaObrigatorio && primeiraEstimativa !== undefined && ajustouAposPrimeiroTeste) {
      evidencias.push(Evidencia.AJUSTE_PRIMEIRA_ESTIMATIVA_F71);
    }
    onAnswer(spec.quociente, { source: "vertical-column", evidencias });
  };

  const testeAtual = estimativa !== undefined && estimativaTestada === estimativa ? teste : undefined;
  const confirmacaoPronta = Boolean(testeAtual);
  const podeTestar = estimativa !== undefined && estimativa > 0;

  const controles: Array<{ delta: -100 | -10 | -1 | 1 | 10 | 100; label: string }> = [
    { delta: -100, label: "−100" },
    { delta: -10, label: "−10" },
    { delta: -1, label: "−1" },
    { delta: 1, label: "+1" },
    { delta: 10, label: "+10" },
    { delta: 100, label: "+100" },
  ];

  return <section className="mx-auto w-full max-w-3xl px-2" data-divisao-dois-digitos-stage="" data-modo={spec.modo}>
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center" data-mode-literacy="estimativa-teste-ajuste">
      <p className="font-bold text-slate-700">{spec.divisor} é aproximadamente {spec.divisorArredondado}. Use essa referência para criar sua estimativa.</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">Depois multiplique pelo divisor real e ajuste. Mudar a primeira estimativa faz parte da divisão.</p>
    </div>

    {estimativa === undefined ? <div className="mx-auto max-w-md rounded-3xl border-2 border-slate-200 bg-white p-5 text-center shadow-inner" data-f71-problem="">
      <p className="text-sm font-black uppercase tracking-wide text-slate-500">Conta armada</p>
      <p className="mt-2 font-mono text-4xl font-black text-slate-800">{spec.dividendo} ÷ {spec.divisor}</p>
      <p className="mt-3 text-sm font-semibold text-slate-600">Monte abaixo uma primeira estimativa para o quociente.</p>
    </div> : <InteractiveVerticalDivisionEstimateSurface
      dividendo={spec.dividendo}
      divisor={spec.divisor}
      divisorArredondado={spec.divisorArredondado}
      estimativa={estimativa}
      produtoTeste={testeAtual?.produto}
      relacao={testeAtual?.relacao}
    />}

    <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Construir e ajustar a estimativa">
      {controles.map(({ delta, label }) => <button
        key={label}
        type="button"
        disabled={disabled || ((estimativa ?? 0) === 0 && delta < 0)}
        onClick={() => alterarEstimativa(delta)}
        className="min-h-20 min-w-20 rounded-2xl border-2 border-slate-300 bg-white px-2 py-3 text-lg font-black text-slate-800 disabled:opacity-50"
        data-f71-motor-control={`ajuste-${delta}`}
        aria-label={`${delta > 0 ? "Adicionar" : "Diminuir"} ${Math.abs(delta)} na estimativa`}
      >{label}</button>)}
    </div>

    <button
      type="button"
      disabled={disabled || !podeTestar}
      onClick={testar}
      className="mt-3 min-h-20 w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-lg font-black text-slate-800 disabled:opacity-50"
      data-f71-motor-control="testar"
    >Testar estimativa</button>

    {testeAtual ? <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-center" aria-live="polite" data-f71-causal-feedback={testeAtual.relacao}>
      {testeAtual.relacao === "passou" ? <p className="font-bold text-slate-700">O produto passou. Diminua a estimativa e teste novamente.</p> : null}
      {testeAtual.relacao === "cabe-mais" ? <p className="font-bold text-slate-700">Ainda cabe outro grupo. Aumente a estimativa e teste novamente.</p> : null}
      {testeAtual.relacao === "exata" ? <>
        <p className="font-bold text-slate-700">Esta é a maior quantidade de grupos que cabe.</p>
        {spec.resto > 0 ? <p className="mt-1 text-sm font-semibold text-slate-600" data-f71-remainder={spec.resto}>Sobra {spec.resto}; como {spec.resto} é menor que {spec.divisor}, o resto é válido.</p> : null}
        {spec.modo === "zero-quociente" ? <p className="mt-1 text-sm font-semibold text-slate-600" data-f71-zero-position="">Ao registrar o quociente, preserve o zero da posição em que o divisor não cabe.</p> : null}
      </> : null}
    </div> : null}

    <button
      type="button"
      disabled={disabled || !confirmacaoPronta}
      onClick={confirmar}
      className="mt-5 min-h-20 w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-lg font-black text-slate-800 disabled:opacity-50"
      data-f71-motor-control="confirmar"
    >Confirmar esta estimativa</button>
  </section>;
}
