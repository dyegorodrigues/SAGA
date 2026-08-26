import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { CirculoAreasF91Spec } from "../../curriculum/procedimentos/circuloAreasContract";
import { tokens } from "../../styles/tokens";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: CirculoAreasF91Spec;
  disabled?: boolean;
  onAnswer: (answer: string, meta?: AnswerMeta) => void;
}

function TrianguloMontagem({ montado, formula = false }: { montado: boolean; formula?: boolean }) {
  return <svg width="280" height="210" viewBox="0 0 280 210" role="img" aria-label={montado ? "dois triângulos iguais formando um retângulo" : "um triângulo e sua cópia separados"}>
    <g fill={tokens.cor.elementos.preenchimento} stroke={tokens.cor.elementos.borda} strokeWidth="4" strokeLinejoin="round">
      <polygon points="50,160 50,55 170,160" />
      <polygon points={montado ? "50,55 170,55 170,160" : "205,55 205,160 85,55"} opacity="0.72" />
    </g>
    <line x1="50" y1="160" x2="170" y2="160" stroke={tokens.cor.elementos.marcador} strokeWidth="4" />
    <line x1="50" y1="55" x2="50" y2="160" stroke={tokens.cor.elementos.marcador} strokeWidth="4" strokeDasharray="8 6" />
    <text x="108" y="184" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700">base</text>
    <text x="30" y="112" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700" transform="rotate(-90 30 112)">altura</text>
    {formula && <text x="140" y="32" textAnchor="middle" fill={tokens.cor.texto.principal} fontWeight="800">base × altura ÷ 2</text>}
  </svg>;
}

function ParalelogramoCorte({ encaixado }: { encaixado: boolean }) {
  return <svg width="280" height="210" viewBox="0 0 280 210" role="img" aria-label={encaixado ? "peça cortada encaixada formando um retângulo de mesma área" : "paralelogramo com triângulo de corte destacado"}>
    {encaixado ? <>
      <rect x="55" y="55" width="170" height="105" fill={tokens.cor.elementos.preenchimento} stroke={tokens.cor.elementos.borda} strokeWidth="4" />
      <line x1="85" y1="55" x2="85" y2="160" stroke={tokens.cor.elementos.marcador} strokeWidth="4" strokeDasharray="8 6" />
    </> : <>
      <polygon points="85,55 225,55 195,160 55,160" fill={tokens.cor.elementos.preenchimento} stroke={tokens.cor.elementos.borda} strokeWidth="4" strokeLinejoin="round" />
      <polygon points="85,55 55,160 85,160" fill={tokens.cor.superficie.destaque} stroke={tokens.cor.elementos.marcador} strokeWidth="4" strokeLinejoin="round" />
      <line x1="85" y1="55" x2="85" y2="160" stroke={tokens.cor.elementos.marcador} strokeWidth="4" strokeDasharray="8 6" />
    </>}
    <text x="140" y="188" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700">mesma base · mesma altura · mesma área</text>
  </svg>;
}

function CirculoMedidas({ raio = 4, diametro = 8 }: { raio?: number; diametro?: number }) {
  return <svg width="280" height="210" viewBox="0 0 280 210" role="img" aria-label={`círculo com raio ${raio}, diâmetro ${diametro} e circunferência destacada`}>
    <circle cx="140" cy="105" r="72" fill={tokens.cor.superficie.destaque} stroke={tokens.cor.elementos.marcador} strokeWidth="6" />
    <circle cx="140" cy="105" r="6" fill={tokens.cor.elementos.borda} />
    <line x1="140" y1="105" x2="212" y2="105" stroke={tokens.cor.elementos.borda} strokeWidth="5" />
    <line x1="68" y1="105" x2="212" y2="105" stroke={tokens.cor.elementos.preenchimento} strokeWidth="3" strokeDasharray="8 6" />
    <text x="178" y="92" fill={tokens.cor.texto.principal} fontWeight="800">raio {raio}</text>
    <text x="140" y="130" textAnchor="middle" fill={tokens.cor.texto.principal} fontWeight="800">diâmetro {diametro} = 2 raios</text>
    <text x="140" y="25" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700">circunferência = volta / contorno</text>
  </svg>;
}

function SetoresCirculo({ rearranjado }: { rearranjado: boolean }) {
  if (rearranjado) return <svg width="280" height="210" viewBox="0 0 280 210" role="img" aria-label="setores do círculo alternados aproximando um retângulo">
    <g stroke={tokens.cor.elementos.borda} strokeWidth="2" fill={tokens.cor.elementos.preenchimento}>
      {Array.from({ length: 8 }, (_, i) => {
        const x = 32 + i * 27;
        return <polygon key={i} points={i % 2 === 0 ? `${x},145 ${x + 13.5},55 ${x + 27},145` : `${x},55 ${x + 13.5},145 ${x + 27},55`} opacity={i % 2 === 0 ? 1 : 0.72} />;
      })}
    </g>
    <text x="140" y="178" textAnchor="middle" fill={tokens.cor.texto.principal} fontWeight="800">base ≈ πr · altura = r</text>
    <text x="140" y="198" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700">área ≈ πr × r = πr²</text>
  </svg>;
  return <svg width="280" height="210" viewBox="0 0 280 210" role="img" aria-label="círculo dividido em setores iguais antes do rearranjo">
    <circle cx="140" cy="105" r="76" fill={tokens.cor.elementos.preenchimento} stroke={tokens.cor.elementos.borda} strokeWidth="4" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = i * Math.PI / 6;
      const x = 140 + Math.cos(a) * 76;
      const y = 105 + Math.sin(a) * 76;
      return <line key={i} x1="140" y1="105" x2={x} y2={y} stroke={tokens.cor.elementos.borda} strokeWidth="2" />;
    })}
    <text x="140" y="198" textAnchor="middle" fill={tokens.cor.texto.secundario} fontWeight="700">os setores conservam toda a área do círculo</text>
  </svg>;
}

function Diagrama({ spec, transformado }: { spec: CirculoAreasF91Spec; transformado: boolean }) {
  if (spec.modo === "triangulo-montagem") return <TrianguloMontagem montado={transformado} />;
  if (spec.modo === "formula-triangulo") return <TrianguloMontagem montado formula />;
  if (spec.modo === "paralelogramo-corte") return <ParalelogramoCorte encaixado={transformado} />;
  if (spec.modo === "circulo-medidas") return <CirculoMedidas raio={spec.raio} diametro={spec.diametro} />;
  return <SetoresCirculo rearranjado={transformado} />;
}

export function CirculoAreasStage({ spec, disabled = false, onAnswer }: Props) {
  const [transformado, setTransformado] = useState(spec.modo === "formula-triangulo" || spec.modo === "circulo-medidas");
  const podeTransformar = spec.modo === "triangulo-montagem" || spec.modo === "paralelogramo-corte" || spec.modo === "area-circulo";
  const transformarLabel = spec.modo === "triangulo-montagem" ? "Montar as duas cópias"
    : spec.modo === "paralelogramo-corte" ? "Cortar e encaixar a peça"
    : "Rearranjar os setores";
  // CLASS-007: o cabeçalho manda transformar primeiro, mas nada segurava as
  // alternativas. Enquanto a montagem/corte/rearranjo não acontece, elas ficam
  // fechadas — é a transformação que produz a figura de onde a área sai.
  const respostasFechadas = disabled || (podeTransformar && !transformado);
  const responder = (value: string, misconception?: string) => {
    if (respostasFechadas) return;
    onAnswer(value, misconception ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl space-y-4" data-f91-stage data-f91-level={spec.nivel} data-f91-mode={spec.modo}>
    <header className="rounded-2xl border p-4 text-center" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
      <p className="font-black" style={{ color: tokens.cor.texto.principal }}>Transforme primeiro. A fórmula vem depois.</p>
      <p className="mt-1 text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Toda transformação é feita por toque em um botão grande; precisão de arrasto não faz parte desta tarefa.</p>
    </header>

    <div className="flex justify-center overflow-x-auto" data-f91-shapecanvas>
      <ShapeCanvas cena={{ pecas: [], largura: 280, altura: 210 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Diagrama spec={spec} transformado={transformado} />
        </div>
      </ShapeCanvas>
    </div>

    {podeTransformar && <button
      type="button"
      disabled={disabled}
      onClick={() => setTransformado(true)}
      className="min-h-14 w-full rounded-2xl border-2 px-4 py-3 font-black disabled:opacity-50"
      style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.marcador, color: tokens.cor.texto.principal }}
      data-f91-transform
    >{transformarLabel}</button>}

    {respostasFechadas && podeTransformar && !disabled && <p
      className="rounded-2xl p-3 text-center text-sm font-bold"
      style={{ backgroundColor: tokens.cor.superficie.destaque, color: tokens.cor.texto.principal }}
      aria-live="polite"
      data-f91-pendencia
    >Faça a transformação antes de escolher a área.</p>}

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Alternativas de Círculo e Áreas">
      {spec.opcoes.map((opcao, index) => <button
        key={`${opcao.value}-${index}`}
        type="button"
        disabled={respostasFechadas}
        onClick={() => responder(opcao.value, opcao.misconception)}
        className="min-h-14 rounded-2xl border-2 px-4 py-3 font-black disabled:opacity-50"
        style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda, color: tokens.cor.texto.principal }}
        data-f91-option={opcao.value}
      >{opcao.label}</button>)}
    </div>
  </section>;
}
