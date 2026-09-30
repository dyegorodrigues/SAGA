import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { Caminho, VoltarContandoF31Spec } from "../../curriculum/procedimentos/voltarContandoContract";
import { metaDoCaminho } from "../../curriculum/procedimentos/voltarContandoContract";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";

/**
 * F31 / N3.04 — a reta com dois caminhos.
 *
 * ## O portão, e por que ele existe
 *
 * Do nível 2 em diante a barra de respostas só abre depois que a criança
 * escolhe um caminho. Não é capricho de interface: a competência da ficha **é
 * escolher**, e uma tela que aceita o resultado sem a escolha mede subtração,
 * não flexibilidade estratégica — e as duas coisas têm nomes diferentes porque
 * são diferentes.
 *
 * A escolha está declarada em `niveis[n].acaoProbatoria`, e o portão
 * `acaoProbatoriaDeclaradaTemPortao` vem cobrar que esta porta exista.
 *
 * ## O que a tela NÃO mostra
 *
 * A contagem de passos de cada caminho só aparece **depois** da escolha, nos
 * níveis que a ficha manda comparar. Mostrá-la antes entregaria qual é o curto
 * — a resposta da pergunta que o nível faz, desenhada ao lado da pergunta.
 */
interface Props {
  spec: VoltarContandoF31Spec;
  disabled?: boolean;
  /** A voz do app: é ela que lê as alternativas para quem não lê. */
  falar?: (texto: string) => void;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function VoltarContandoStage({ spec, disabled, falar, onAnswer }: Props) {
  const [escolhido, setEscolhido] = useState<Caminho | null>(null);
  const respostasFechadas = Boolean(disabled) || (spec.exigeEscolha && escolhido === null);

  const responder = (valor: number, misconception?: string) => {
    if (respostasFechadas) return;
    const doCaminho = escolhido ? metaDoCaminho(spec, escolhido) : undefined;
    const daAlternativa = misconception && valor !== spec.resposta ? { misconception } : undefined;
    onAnswer(valor, daAlternativa ?? doCaminho);
  };

  const numerais = Array.from({ length: spec.fim - spec.inicio + 1 }, (_, i) => spec.inicio + i);

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f31-stage data-f31-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">Dois caminhos</div>

      {spec.mostrarReta
        ? <InteractiveNumberLineSurface
            start={spec.inicio}
            end={spec.fim}
            position={0}
            disabled={true}
            interactionDisabled={true}
            numeraisVisiveis={numerais}
            target={spec.total}
            pulsarTarget={false}
          />
        : <p className="py-4 text-center text-lg font-black text-slate-700">Sem a reta: faça de cabeça.</p>}

      {spec.exigeEscolha && <div className="mt-4 grid grid-cols-2 gap-3" data-f31-caminhos>
        {(["voltar", "completar"] as const).map(caminho => (
          <button
            key={caminho}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => setEscolhido(caminho)}
            aria-pressed={escolhido === caminho}
            data-f31-caminho={caminho}
            className={`min-h-14 rounded-2xl border-2 px-4 py-3 font-black ${escolhido === caminho ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-slate-50 text-slate-800"} disabled:opacity-40`}
          >
            {caminho === "voltar" ? "↩️ Voltar contando" : "➡️ Completar até o total"}
          </button>
        ))}
      </div>}

      {respostasFechadas && !disabled && <p className="mt-3 text-center font-bold text-sky-800">
        Escolha um caminho antes de responder.
      </p>}

      {spec.mostrarComparacao && escolhido && <p className="mt-3 text-center font-bold text-slate-700" data-f31-comparacao>
        Voltar leva {spec.passosVoltando} {spec.passosVoltando === 1 ? "pulo" : "pulos"}; completar leva {spec.passosCompletando}.
      </p>}

      {/*
        As alternativas passam por `AlternativasQueFalam`: o primeiro toque
        FALA o rótulo e arma, e só o ✓ responde. Escolher entre símbolos que a
        criança não lê é cara ou coroa — e o app anotava como erro de conta.
      */}
      <AlternativasQueFalam
        alternativas={spec.opcoes.map(o => ({ valor: o.value, rotulo: String(o.label) }))}
        onEscolher={valor => {
          const escolhida = spec.opcoes.find(o => o.value === valor);
          responder(valor as never, escolhida?.misconception);
        }}
        falar={falar}
        disabled={respostasFechadas}
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      />
    </div>
  </section>;
}
