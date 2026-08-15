import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import type { PoligonoFiguraF79, PoligonosF79Spec } from "../../curriculum/procedimentos/poligonosContract";
import { tokens } from "../../styles/tokens";
import { DragGroup } from "./DragGroup";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: PoligonosF79Spec;
  disabled?: boolean;
  onAnswer: (answer: string | number, meta?: AnswerMeta) => void;
}

function pontosRegulares(lados: number, raio = 58, cx = 90, cy = 78): string {
  return Array.from({ length: Math.max(3, lados) }, (_, index) => {
    const angulo = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(3, lados);
    return `${cx + Math.cos(angulo) * raio},${cy + Math.sin(angulo) * raio}`;
  }).join(" ");
}

function FiguraSvg({ figura, destaque = false }: { figura: PoligonoFiguraF79; destaque?: boolean }) {
  const pontos = pontosRegulares(Math.max(3, figura.lados));
  return (
    <svg width="180" height="156" viewBox="0 0 180 156" role="img" aria-label={`${figura.familia}, ${figura.fechada ? "fechada" : "aberta"}, ${figura.lados} lados`}>
      {figura.fechada ? (
        <polygon
          points={pontos}
          fill={tokens.cor.elementos.preenchimento}
          stroke={destaque ? tokens.cor.elementos.marcador : tokens.cor.elementos.borda}
          strokeWidth={destaque ? 6 : 4}
          strokeLinejoin="round"
          transform={`rotate(${figura.giro ?? 0} 90 78)`}
        />
      ) : (
        <polyline
          points={pontos.split(" ").slice(0, -1).join(" ")}
          fill="none"
          stroke={tokens.cor.elementos.marcador}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function CartaoFigura({ figura, destaque = false }: { figura: PoligonoFiguraF79; destaque?: boolean }) {
  return (
    <div className="rounded-2xl border p-2 flex flex-col items-center gap-1" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }} data-f79-figura={figura.id}>
      <FiguraSvg figura={figura} destaque={destaque} />
      <span className="text-xs font-bold" style={{ color: tokens.cor.texto.secundario }}>
        {figura.fechada ? `${figura.lados} lados · fechada` : "contorno aberto"}
      </span>
    </div>
  );
}

export function PoligonosStage({ spec, disabled = false, onAnswer }: Props) {
  const [ladosConstruidos, setLadosConstruidos] = useState(3);
  const figuraConstruida = useMemo<PoligonoFiguraF79>(() => ({
    id: "construcao",
    familia: ladosConstruidos === 3 ? "triangulo" : ladosConstruidos === 4 ? "quadrilatero" : "nao-poligono",
    lados: ladosConstruidos,
    fechada: ladosConstruidos > 0,
    ladosRetos: true,
    angulosRetos: ladosConstruidos === 4 ? 4 : 0,
  }), [ladosConstruidos]);

  const responder = (value: string | number, misconception?: string) => {
    if (disabled) return;
    onAnswer(value, misconception ? { misconception } : undefined);
  };

  return (
    <section className="w-full max-w-3xl mx-auto space-y-5" data-f79-stage data-f79-level={spec.nivel} data-f79-mode={spec.modo}>
      <header className="rounded-2xl border p-4 space-y-2" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Polígono = contorno fechado + lados retos</p>
        <p className="text-lg font-black" style={{ color: tokens.cor.texto.principal }}>{spec.condicoes.join(" · ")}</p>
        {spec.quadradoTambemRetangulo && <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>As classes podem se sobrepor: um quadrado também satisfaz as propriedades de um retângulo.</p>}
      </header>

      <div className="rounded-2xl border p-3" style={{ backgroundColor: tokens.cor.superficie.fundo, borderColor: tokens.cor.elementos.borda }}>
        <p className="px-2 pb-2 font-bold" style={{ color: tokens.cor.texto.principal }}>ShapeCanvas — observe o contorno</p>
        <div className="flex justify-center overflow-x-auto">
          <ShapeCanvas cena={{ pecas: [], largura: 280, altura: 190 }}>
            <div className="absolute inset-0 flex items-center justify-center" aria-label="campo de polígonos">
              {spec.construcao ? <FiguraSvg figura={figuraConstruida} destaque={ladosConstruidos === Number(spec.resposta)} /> : <div className="scale-90"><FiguraSvg figura={spec.figuras[0]} destaque /></div>}
            </div>
          </ShapeCanvas>
        </div>
      </div>

      {!spec.construcao && <div className="grid gap-3 sm:grid-cols-2" data-f79-exemplos>{spec.figuras.map((figura, index) => <CartaoFigura key={figura.id} figura={figura} destaque={index === 0} />)}</div>}

      {(spec.modo === "triangulos" || spec.modo === "quadrilateros" || spec.modo === "classificar-propriedades") && (
        <div className="rounded-2xl border p-4" style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.borda }} data-f79-draggroup>
          <p className="font-black" style={{ color: tokens.cor.texto.principal }}>DragGroup — agrupe pelas propriedades</p>
          <p className="text-sm" style={{ color: tokens.cor.texto.secundario }}>Arraste ou toque nas peças; depois confirme a classe abaixo.</p>
          <DragGroup sourceCount={4} destCount={2} sourceEmoji="🔷" destEmoji="📦" boxCapacity={2} tutorialText="Separe as peças olhando número de lados e propriedades." disabled={disabled} onAnswer={() => undefined} />
          <div className="mt-2 flex justify-around text-xs font-bold" style={{ color: tokens.cor.texto.secundario }}><span>3 lados</span><span>4 lados / propriedades</span></div>
        </div>
      )}

      {spec.construcao ? (
        <div className="space-y-3" data-f79-construcao>
          <p className="font-black" style={{ color: tokens.cor.texto.principal }}>Construa por toque: escolha quantos lados terá o contorno fechado.</p>
          <div className="grid grid-cols-3 gap-2">
            {[3, 4, 5].map(lados => (
              <button key={lados} type="button" disabled={disabled} onClick={() => setLadosConstruidos(lados)} className="min-h-12 rounded-xl border font-black" style={{ backgroundColor: ladosConstruidos === lados ? tokens.cor.superficie.destaque : tokens.cor.superficie.cartao, borderColor: ladosConstruidos === lados ? tokens.cor.elementos.marcador : tokens.cor.elementos.borda, color: tokens.cor.texto.principal }}>{lados} lados</button>
            ))}
          </div>
          <button type="button" disabled={disabled} onClick={() => responder(ladosConstruidos, ladosConstruidos === 3 ? "conta-lados-errado" : ladosConstruidos === 5 ? "confunde-classe" : undefined)} className="w-full min-h-14 rounded-2xl border font-black" style={{ backgroundColor: tokens.cor.elementos.preenchimento, borderColor: tokens.cor.elementos.marcador, color: tokens.cor.texto.principal }}>Validar construção</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-f79-options>
          {spec.opcoes.map(option => <button key={`${option.value}-${option.label}`} type="button" disabled={disabled} onClick={() => responder(option.value, option.misconception)} className="min-h-14 rounded-2xl border px-3 py-2 font-black disabled:opacity-50" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda, color: tokens.cor.texto.principal }} data-misconception={option.misconception}>{option.label}</button>)}
        </div>
      )}
    </section>
  );
}
