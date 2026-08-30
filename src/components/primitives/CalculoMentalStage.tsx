import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { CalculoMentalF41Spec } from "../../curriculum/procedimentos/calculoMentalContract";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";

/**
 * F41 / N3.13 — a reta da estimativa, e a estimativa que a criança declara.
 *
 * ## A estimativa não aparece pronta
 *
 * A tela mostra a reta com as dezenas marcadas e os números onde eles caem. O
 * valor estimado não é escrito em lugar nenhum antes de a criança responder:
 * escrever "é perto de 80" seria dar a resposta nos níveis que pedem a
 * estimativa, e seria dar a ferramenta pronta nos que pedem a checagem.
 *
 * ## Por que o L5 pede a estratégia declarada
 *
 * A ficha canônica chama o último nível de "cálculo mental com estratégia
 * declarada". Dizer por onde foi é o que separa quem estimou de quem chutou e
 * acertou — e chutar acertando, num nível de cálculo mental, é indistinguível
 * do domínio sem essa declaração.
 */
interface Props {
  spec: CalculoMentalF41Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

const ESTRATEGIAS = [
  { id: "arredondar", rotulo: "Arredondei e somei" },
  { id: "dezenas-primeiro", rotulo: "Somei as dezenas primeiro" },
  { id: "fazer-dez", rotulo: "Fiz dez e somei o resto" },
] as const;

export function CalculoMentalStage({ spec, disabled, onAnswer }: Props) {
  const [estrategia, setEstrategia] = useState<string | null>(null);
  const exigeEstrategia = spec.modo === "mental-com-estrategia";
  const respostasFechadas = Boolean(disabled) || (exigeEstrategia && estrategia === null);

  const responder = (valor: number, misconception?: string) => {
    if (respostasFechadas) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  // A reta cobre as dezenas ao redor dos números, para que "perto de qual
  // dezena" seja uma distância vista, não uma regra decorada.
  const inicio = Math.max(0, Math.floor(Math.min(spec.a, spec.b ?? spec.a) / 10) * 10 - 10);
  const fim = Math.ceil(Math.max(spec.a, spec.b ?? spec.a) / 10) * 10 + 10;
  const marcas = Array.from({ length: Math.floor((fim - inicio) / 10) + 1 }, (_, i) => inicio + i * 10);

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f41-stage data-f41-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        Antes de calcular, estime
      </div>

      {spec.mostrarReta
        ? <InteractiveNumberLineSurface
            start={inicio}
            end={fim}
            position={0}
            disabled={true}
            interactionDisabled={true}
            numeraisVisiveis={marcas}
            target={spec.a}
            pulsarTarget={false}
          />
        : <p className="py-3 text-center text-lg font-black text-slate-700">
            Sem a reta: estime de cabeça antes de responder.
          </p>}

      {spec.modo === "detectar-absurdo" && <div className="mt-4 flex flex-wrap justify-center gap-2" data-f41-candidatas>
        {(spec.candidatas ?? []).map(valor => (
          <span key={valor} className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-lg font-black text-slate-700">
            {valor}
          </span>
        ))}
      </div>}

      {exigeEstrategia && <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3" data-f41-estrategias>
        {ESTRATEGIAS.map(item => (
          <button
            key={item.id}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => setEstrategia(item.id)}
            aria-pressed={estrategia === item.id}
            data-f41-estrategia={item.id}
            className={`min-h-14 rounded-2xl border-2 px-3 py-2 font-black ${estrategia === item.id ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-slate-50 text-slate-800"} disabled:opacity-40`}
          >
            {item.rotulo}
          </button>
        ))}
      </div>}

      {respostasFechadas && !disabled && <p className="mt-3 text-center font-bold text-sky-800">
        Diga por onde você foi antes de responder.
      </p>}

      <div role="group" aria-label="Alternativas" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spec.opcoes.map(opcao => (
          <button
            key={String(opcao.value)}
            type="button"
            disabled={respostasFechadas}
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
