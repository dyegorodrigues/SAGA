import React from "react";
import { Balanca, type BalancaItem } from "./Balanca";
import { NumberLine } from "./NumberLine";
import { tokens } from "../../styles/tokens";
import type { ProblemasMedidaF82Spec } from "../../curriculum/procedimentos/problemasMedidaContract";
import type { AnswerMeta } from "../../types";

interface Props {
  spec: ProblemasMedidaF82Spec;
  disabled?: boolean;
  onAnswer: (answer: number, meta?: AnswerMeta) => void;
}

const textoMedida = (valor: number, unidade: string) => `${valor} ${unidade}`;

export function ProblemasMedidaStage({ spec, disabled = false, onAnswer }: Props) {
  const escalaMax = spec.grandeza === "comprimento" ? Math.max(2, spec.conversao.valorInicial) : 3;
  const passo = escalaMax <= 3 ? 1 : Math.max(1, Math.round(escalaMax / 5));
  const alvoEscala = Math.min(escalaMax, spec.conversao.valorInicial);
  const leftItems: BalancaItem[] = [{ id: "origem", weight: 1, label: textoMedida(spec.conversao.valorInicial, spec.conversao.de), color: tokens.cor.elementos.base_A }];
  const rightItems: BalancaItem[] = [{ id: "convertida", weight: 1, label: textoMedida(spec.conversao.valorConvertido, spec.conversao.para), color: tokens.cor.elementos.base_B }];

  return (
    <section className="w-full max-w-3xl mx-auto space-y-5" data-f82-stage data-f82-level={spec.nivel} data-f82-mode={spec.modo}>
      <header className="rounded-2xl border p-4 space-y-2" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Mesma quantidade, outra unidade</p>
        <p className="text-lg font-black" style={{ color: tokens.cor.texto.principal }}>
          {textoMedida(spec.conversao.valorInicial, spec.conversao.de)} = {textoMedida(spec.conversao.valorConvertido, spec.conversao.para)}
        </p>
        <p className="text-sm" style={{ color: tokens.cor.texto.secundario }}>
          {spec.exigeConversaoAntes ? "Converta primeiro. Só depois compare ou opere." : "A unidade muda, mas a quantidade representada continua a mesma."}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-3 min-w-0" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }} data-f82-numberline>
          <p className="font-bold px-2" style={{ color: tokens.cor.texto.principal }}>Reta de referência</p>
          <NumberLine min={0} max={escalaMax} step={passo} targetValue={alvoEscala} larguraPorPonto={48} highlightedRanges={[{ start: 0, end: alvoEscala, color: tokens.cor.elementos.base_A }]} />
          <div className="flex items-center justify-between gap-3 px-2 text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>
            <span>{spec.conversao.de}</span>
            <span>× {spec.conversao.fator}</span>
            <span>{spec.conversao.para}</span>
          </div>
        </div>

        <div className="rounded-2xl border p-3" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }} data-f82-balanca>
          <p className="font-bold px-2" style={{ color: tokens.cor.texto.principal }}>Equivalência</p>
          <Balanca leftItems={leftItems} rightItems={rightItems} />
          <p className="text-center text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>
            A balança fica equilibrada: as duas escritas representam a mesma quantidade.
          </p>
        </div>
      </div>

      {spec.valoresOriginais && (
        <div className="rounded-2xl border p-4" style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.borda }} data-f82-original-values>
          <p className="font-black" style={{ color: tokens.cor.texto.principal }}>Valores do problema</p>
          <p className="mt-1" style={{ color: tokens.cor.texto.secundario }}>
            {textoMedida(spec.valoresOriginais[0].valor, spec.valoresOriginais[0].unidade)} · {textoMedida(spec.valoresOriginais[1].valor, spec.valoresOriginais[1].unidade)}
          </p>
          {spec.unidadesMistas && <p className="mt-1 text-sm font-bold" style={{ color: tokens.cor.feedback.erro_suave }}>Não opere enquanto as unidades estiverem diferentes.</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3" data-f82-options>
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
