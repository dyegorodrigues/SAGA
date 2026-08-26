import React, { useState } from "react";
import { motion } from "motion/react";
import type { AnswerMeta } from "../../types";
import type { SolidoF59, SolidosGeometricosF59Spec } from "../../curriculum/procedimentos/solidosGeometricosContract";
import { FiguraDesenhada, ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: SolidosGeometricosF59Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

function Solido({ tipo }: { tipo: SolidoF59 }) {
  if (tipo === "cubo" || tipo === "esfera" || tipo === "cilindro") {
    return <FiguraDesenhada figura={tipo} tamanho={126} cor="#8B5CF6" />;
  }
  return (
    <svg width="126" height="126" viewBox="0 0 100 100" aria-hidden>
      {tipo === "cone" ? (
        <>
          <path d="M50 8 L18 76 Q50 92 82 76 Z" fill="#8B5CF6" />
          <ellipse cx="50" cy="76" rx="32" ry="10" fill="#6D28D9" />
        </>
      ) : (
        <>
          <polygon points="50,10 16,68 50,86 84,68" fill="#8B5CF6" />
          <polygon points="50,10 50,86 84,68" fill="#6D28D9" />
          <polygon points="16,68 50,86 84,68 50,56" fill="#7C3AED" />
        </>
      )}
    </svg>
  );
}

const nome: Record<SolidoF59, string> = { cubo: "cubo", esfera: "esfera", cilindro: "cilindro", cone: "cone", piramide: "pirâmide" };

export function SolidosGeometricosStage({ spec, disabled, onAnswer }: Props) {
  const [selecionado, setSelecionado] = useState<number>();
  const [testeFeito, setTesteFeito] = useState(false);
  const [faceAberta, setFaceAberta] = useState(false);

  // CLASS-007: "prever e testar" é o alvo dos micros L3 e L4, e o experimento
  // era decorativo — dava para comprar mastery sem encostar nele. Onde há
  // experimento, o toque na alternativa é a PREVISÃO, e é o teste que envia.
  //
  // A ordem importa nos dois sentidos. O texto do resultado ("a superfície
  // curva permite rolar") responde a pergunta; se o teste rodasse antes da
  // previsão, ele deixaria de testar a criança e passaria a informá-la. Por
  // isso o experimento também fica fechado até existir previsão.
  const preverAntes = Boolean(spec.experimento);
  const responder = (valor: number) => {
    if (disabled) return;
    setSelecionado(valor);
    if (preverAntes) return;
    enviar(valor);
  };

  const enviar = (valor: number) => {
    const option = spec.opcoes.find(item => item.value === valor);
    const misconception = valor === spec.resposta ? undefined : option?.misconception;
    onAnswer(valor, misconception ? { misconception } : undefined);
  };

  const testar = () => {
    if (disabled || selecionado === undefined) return;
    setTesteFeito(true);
    enviar(selecionado);
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 overflow-x-hidden" data-f59-stage data-f59-mode={spec.modo}>
      <p className="text-center text-sm font-bold text-slate-700">{spec.objetivo}</p>
      <div className="max-w-full overflow-hidden rounded-2xl">
        <ShapeCanvas cena={{ pecas: [], largura: 280, altura: 220 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              type="button"
              disabled={disabled}
              aria-label={`${nome[spec.solido]}; toque para destacar uma face`}
              onClick={() => setFaceAberta(value => !value)}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-2xl p-2 focus:outline-none focus:ring-4 focus:ring-violet-400"
              animate={testeFeito && spec.experimento === "rampa" ? { x: spec.resultadoExperimento ? [0, 46, 78] : [0, 18, 18], rotate: spec.resultadoExperimento ? [0, 120, 260] : 0 } : { x: 0, rotate: 0 }}
              transition={{ duration: 0.9 }}
              data-f59-solid={spec.solido}
            >
              <Solido tipo={spec.solido} />
            </motion.button>
          </div>
          {spec.experimento === "rampa" && (
            <div aria-hidden className="absolute bottom-7 left-7 h-3 w-52 origin-left -rotate-12 rounded-full bg-slate-400" />
          )}
          {spec.experimento === "empilhar" && testeFeito && (
            <div aria-label="segundo sólido para o teste de empilhamento" className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-2 opacity-45"><Solido tipo={spec.solido} /></div>
          )}
        </ShapeCanvas>
      </div>

      {faceAberta && spec.facePlana && (
        <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm font-bold text-violet-900" data-f59-face>
          Uma face plana deste sólido pode ser vista como {spec.facePlana}.
        </div>
      )}

      {spec.experimento && (
        <button
          type="button"
          disabled={disabled || selecionado === undefined}
          onClick={testar}
          className="min-h-12 rounded-2xl border-2 border-amber-400 bg-amber-50 px-5 py-3 font-black text-amber-900 disabled:opacity-50"
          data-f59-experiment={spec.experimento}
        >
          {spec.experimento === "rampa" ? "Testar na rampa" : "Testar empilhamento"}
        </button>
      )}

      {preverAntes && !testeFeito && !disabled && (
        <p className="text-center text-sm font-bold text-amber-900" aria-live="polite" data-f59-pendencia>
          {selecionado === undefined ? "Faça sua previsão e depois teste." : "Agora teste a sua previsão."}
        </p>
      )}

      {testeFeito && spec.experimento && (
        <p role="status" className="text-center text-sm font-bold text-slate-700">
          {spec.experimento === "rampa"
            ? (spec.resultadoExperimento ? "O teste confirmou: a superfície curva permite rolar." : "O teste confirmou: ele não rola nesta rampa.")
            : (spec.resultadoExperimento ? "O teste confirmou: a face plana dá uma base estável." : "O teste mostrou que não fica estável empilhado.")}
        </p>
      )}

      {spec.contagem && (
        <div className="grid w-full grid-cols-3 gap-2 text-center" aria-label="Elementos a contar">
          <span className="rounded-xl bg-slate-100 p-2 text-sm font-bold">faces</span>
          <span className="rounded-xl bg-slate-100 p-2 text-sm font-bold">vértices</span>
          <span className="rounded-xl bg-slate-100 p-2 text-sm font-bold">arestas</span>
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Respostas sobre o sólido">
        {spec.opcoes.map(option => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => responder(option.value)}
            className={`min-h-12 rounded-2xl border-2 px-3 py-3 font-black ${selecionado === option.value ? "border-violet-500 bg-violet-50 text-violet-900" : "border-slate-200 bg-white text-slate-800"} disabled:opacity-50`}
            data-f59-option={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
