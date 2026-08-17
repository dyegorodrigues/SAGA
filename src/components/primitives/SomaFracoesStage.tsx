import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../../curriculum/masterySignals";
import {
  SomaFracoesMisconception,
  type SomaFracoesF74Spec,
  type SomaFracoesOpcao,
} from "../../curriculum/procedimentos/somaFracoesContract";
import { SingaporeFractionBar } from "./SingaporeBars";

interface Props {
  spec: SomaFracoesF74Spec;
  disabled?: boolean;
  onAnswer: (value: string, meta?: AnswerMeta) => void;
}

const DISQUALIFIER_SOMA_DENOMINADOR = "f74-soma-denominador-precedente";

function fracaoPartes(value: string): [number, number] | undefined {
  const match = /^(\d+)\/(\d+)$/.exec(value);
  if (!match) return undefined;
  return [Number(match[1]), Number(match[2])];
}

/**
 * F74 — SingaporeBars como “tanque” de partes de tamanho fixo.
 *
 * A representação mostra os operandos e a partição, nunca o resultado antes da
 * decisão. O palco possui retry autoral: errar não troca a questão. Se o erro
 * imediatamente anterior ao acerto foi `soma-denominador`, o acerto continua
 * correto para a missão, mas recebe `masteryDisqualifier` e não compra domínio.
 */
export function SomaFracoesStage({ spec, disabled = false, onAnswer }: Props): React.ReactElement {
  const [ultimoErro, setUltimoErro] = useState<string | undefined>();
  const [revelarResultado, setRevelarResultado] = useState(false);

  const responder = (option: SomaFracoesOpcao) => {
    if (disabled) return;
    const correta = option.value === spec.resposta;
    if (!correta) {
      setUltimoErro(option.misconception);
      onAnswer(option.value, option.misconception ? { misconception: option.misconception } : undefined);
      return;
    }

    const evidencias = [`f74-${spec.modo}`];
    if (ultimoErro === SomaFracoesMisconception.SOMA_DENOMINADOR) {
      evidencias.push(masteryDisqualifier(DISQUALIFIER_SOMA_DENOMINADOR));
    }
    setRevelarResultado(true);
    onAnswer(option.value, { evidencias });
  };

  const mostrarOperandos = spec.modo !== "somar-simbolico";
  const resultadoPartes = fracaoPartes(spec.resposta);
  const brutoCabeEmUm = spec.resultadoNumeradorBruto <= spec.denominador;

  return <section className="mx-auto w-full max-w-3xl px-2" data-soma-fracoes-stage="" data-modo={spec.modo}>
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center" data-f74-denominador-fixo={spec.denominador}>
      <p className="font-bold text-slate-700">O inteiro continua dividido em {spec.denominador} partes iguais.</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">O denominador diz o tamanho da parte. Juntar ou retirar partes não muda esse tamanho.</p>
    </div>

    <div className="space-y-3" data-f74-operands="">
      {mostrarOperandos ? <>
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.aNumerador} rotulo={`${spec.aNumerador}/${spec.denominador}`} />
        <div className="text-center text-3xl font-black text-slate-700" aria-label={spec.operacao === "+" ? "mais" : "menos"}>{spec.operacao}</div>
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.bNumerador} rotulo={`${spec.bNumerador}/${spec.denominador}`} />
      </> : <>
        <p className="text-center font-mono text-3xl font-black text-slate-800">{spec.aNumerador}/{spec.denominador} {spec.operacao} {spec.bNumerador}/{spec.denominador}</p>
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={0} rotulo={`partes de 1/${spec.denominador}`} />
      </>}
    </div>

    {revelarResultado ? <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-4" data-f74-result="">
      <p className="text-center font-bold text-slate-700">Resultado: {spec.resposta}</p>
      {spec.modo === "simplificar" && resultadoPartes ? <>
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.resultadoNumeradorBruto} rotulo={spec.resultadoBruto} />
        <p className="text-center text-sm font-semibold text-slate-600">Mesma quantidade, outro nome:</p>
        <SingaporeFractionBar denominador={resultadoPartes[1]} destacarQuantidade={resultadoPartes[0]} rotulo={spec.resposta} />
      </> : brutoCabeEmUm ? <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.resultadoNumeradorBruto} rotulo={spec.resposta} /> : <>
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.denominador} rotulo="1 inteiro" />
        <SingaporeFractionBar denominador={spec.denominador} destacarQuantidade={spec.resultadoNumeradorBruto - spec.denominador} rotulo={`${spec.resultadoNumeradorBruto - spec.denominador}/${spec.denominador}`} />
        <p className="text-center text-sm font-semibold text-slate-600">Passar de um inteiro não torna a fração inválida.</p>
      </>}
    </div> : null}

    <div className="mt-5 grid grid-cols-2 gap-3" aria-label="Respostas da operação com frações">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        disabled={disabled}
        onClick={() => responder(option)}
        className="min-h-20 rounded-2xl border-2 border-slate-300 bg-white px-3 py-3 text-lg font-black text-slate-800 disabled:opacity-50"
        data-f74-option={option.value}
      >{option.label}</button>)}
    </div>
  </section>;
}
