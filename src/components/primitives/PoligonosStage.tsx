import React from "react";
import type { AnswerMeta } from "../../types";
import type { PoligonoFiguraF79, PoligonosF79Spec } from "../../curriculum/procedimentos/poligonosContract";
import { tokens } from "../../styles/tokens";
import { DragGroup } from "./DragGroup";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: PoligonosF79Spec;
  disabled?: boolean;
  onAnswer: (answer: string, meta?: AnswerMeta) => void;
}

function pontosFigura(figura: PoligonoFiguraF79): string {
  if (figura.familia === "quadrado") return "48,38 132,38 132,122 48,122";
  if (figura.familia === "paralelogramo") return "58,38 142,38 122,122 38,122";
  if (figura.familia === "losango") return "90,26 146,80 90,134 34,80";
  if (figura.familia === "retangulo") return "34,48 146,48 146,112 34,112";
  if (figura.classeAngulos === "retangulo") return "40,122 40,42 142,122";
  return "90,28 146,124 34,124";
}

function FiguraSvg({ figura, destaque = false }: { figura: PoligonoFiguraF79; destaque?: boolean }) {
  return (
    <svg width="180" height="156" viewBox="0 0 180 156" role="img" aria-label={`${figura.familia}, ${figura.lados} lados, girada ${figura.giro} graus`}>
      <polygon
        points={pontosFigura(figura)}
        fill={tokens.cor.elementos.preenchimento}
        stroke={destaque ? tokens.cor.elementos.marcador : tokens.cor.elementos.borda}
        strokeWidth={destaque ? 6 : 4}
        strokeLinejoin="round"
        transform={`rotate(${figura.giro} 90 80)`}
      />
    </svg>
  );
}

function CartaoFigura({ figura, destaque = false }: { figura: PoligonoFiguraF79; destaque?: boolean }) {
  const propriedades = [
    `${figura.lados} lados`,
    figura.ladosIguais ? `${figura.ladosIguais} iguais` : undefined,
    figura.angulosRetos ? `${figura.angulosRetos} ângulo${figura.angulosRetos > 1 ? "s" : ""} reto${figura.angulosRetos > 1 ? "s" : ""}` : undefined,
    figura.paresParalelos ? `${figura.paresParalelos} pares paralelos` : undefined,
  ].filter(Boolean).join(" · ");
  return (
    <div className="rounded-2xl border p-2 flex flex-col items-center gap-1" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }} data-f79-figura={figura.id}>
      <FiguraSvg figura={figura} destaque={destaque} />
      <span className="text-xs font-bold text-center" style={{ color: tokens.cor.texto.secundario }}>{propriedades}</span>
    </div>
  );
}

function LacosAninhados({ spec }: { spec: PoligonosF79Spec }) {
  if (!spec.hierarquia) return null;
  return (
    <div className="rounded-3xl border p-3 space-y-2" style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.borda }} data-f79-lacos>
      <p className="font-black" style={{ color: tokens.cor.texto.principal }}>Laços aninhados — uma classe pode ficar dentro de outra</p>
      <div className="rounded-3xl border p-3" style={{ borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Quadriláteros</p>
        <div className="rounded-3xl border p-3 mt-2" style={{ borderColor: tokens.cor.elementos.marcador }}>
          <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Paralelogramos</p>
          <div className="rounded-3xl border p-3 mt-2" style={{ borderColor: tokens.cor.elementos.borda }}>
            <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>{spec.modo === "hierarquia" ? "Retângulos" : "Losangos"}</p>
            {spec.modo === "hierarquia" && (
              <div className="rounded-3xl border p-3 mt-2 text-center font-black" style={{ borderColor: tokens.cor.elementos.marcador, color: tokens.cor.texto.principal }}>
                Quadrados
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {spec.lacosAninhados.map(laco => <span key={laco} className="rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: tokens.cor.elementos.borda, color: tokens.cor.texto.secundario }}>{laco}</span>)}
      </div>
    </div>
  );
}

export function PoligonosStage({ spec, disabled = false, onAnswer }: Props) {
  const responder = (value: string, misconception?: string) => {
    if (disabled) return;
    onAnswer(value, misconception ? { misconception } : undefined);
  };

  return (
    <section className="w-full max-w-3xl mx-auto space-y-5" data-f79-stage data-f79-level={spec.nivel} data-f79-mode={spec.modo}>
      <header className="rounded-2xl border p-4 space-y-2" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Classifique pela propriedade, não pela posição do desenho.</p>
        <p className="text-lg font-black" style={{ color: tokens.cor.texto.principal }}>{spec.criterios.join(" · ")}</p>
        {spec.quadradoTambemRetangulo && <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Quadrado ⊂ retângulo ⊂ paralelogramo: as classes se sobrepõem.</p>}
      </header>

      <div className="rounded-2xl border p-3" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }}>
        <p className="px-2 pb-2 font-bold" style={{ color: tokens.cor.texto.principal }}>ShapeCanvas — veja a mesma propriedade mesmo quando a forma gira</p>
        <div className="flex justify-center overflow-x-auto">
          <ShapeCanvas cena={{ pecas: [], largura: 280, altura: 190 }}>
            <div className="absolute inset-0 flex items-center justify-center" aria-label="campo de classificação de polígonos">
              <div className="scale-90"><FiguraSvg figura={spec.figuras[0]} destaque /></div>
            </div>
          </ShapeCanvas>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2" data-f79-exemplos>
        {spec.figuras.map((figura, index) => <CartaoFigura key={figura.id} figura={figura} destaque={index === 0} />)}
      </div>

      <div className="rounded-2xl border p-4" style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.borda }} data-f79-draggroup>
        <p className="font-black" style={{ color: tokens.cor.texto.principal }}>DragGroup — agrupe usando o critério pedido</p>
        <p className="text-sm" style={{ color: tokens.cor.texto.secundario }}>Arraste ou toque na peça e depois no grupo. Girar a figura não muda sua classe.</p>
        <DragGroup
          sourceCount={4}
          destCount={2}
          sourceEmoji="🔷"
          destEmoji="⭕"
          boxCapacity={2}
          tutorialText="Compare lados e ângulos; use mais de uma propriedade quando a tarefa pedir."
          disabled={disabled}
          onAnswer={() => undefined}
        />
      </div>

      <LacosAninhados spec={spec} />

      {spec.propriedadesCombinadas && (
        <div className="rounded-2xl border p-3" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }} data-f79-criterios-combinados>
          <p className="font-black" style={{ color: tokens.cor.texto.principal }}>Use pelo menos {spec.criteriosMinimos} propriedades ao mesmo tempo.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {spec.criterios.map(criterio => <span key={criterio} className="rounded-full border px-3 py-1 text-sm font-bold" style={{ borderColor: tokens.cor.elementos.marcador, color: tokens.cor.texto.secundario }}>{criterio}</span>)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-f79-options>
        {spec.opcoes.map(option => (
          <button
            key={`${option.value}-${option.label}`}
            type="button"
            disabled={disabled}
            onClick={() => responder(option.value, option.misconception)}
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
