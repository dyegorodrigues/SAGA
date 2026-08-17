import React, { useState } from "react";
import { Question } from "../../types";
import { tokens, UIState } from "../../styles/tokens";
import { motion, PanInfo } from "motion/react";

interface Props {
  q: Question;
  onAnswer: (val: any) => void;
  disabled: boolean;
  state?: UIState;
}

export function SingaporeBars({ q, onAnswer, disabled, state = 'ocioso' }: Props) {
  const [snapped, setSnapped] = useState(false);
  const blockA = q.a || 3;
  const blockB = q.b || 2;
  const total = blockA + blockB;
  const unitWidth = parseInt(tokens.tamanho.base) || 40;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > unitWidth * blockA * 0.4) {
      setSnapped(true);
      setTimeout(() => onAnswer(total), 1000);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 ${tokens.estado[state]}`}>
      <div className="relative flex items-center w-full justify-center" style={{ height: tokens.tamanho.grande }}>
        <div
          className="absolute left-1/2 flex items-center justify-center font-bold text-2xl shadow-sm z-10"
          style={{
            width: blockA * unitWidth,
            height: tokens.tamanho.grande,
            backgroundColor: tokens.cor.elementos.base_A,
            borderColor: tokens.cor.elementos.borda,
            borderWidth: 2,
            borderRightWidth: 0,
            borderTopLeftRadius: tokens.tamanho.raio,
            borderBottomLeftRadius: tokens.tamanho.raio,
            color: tokens.cor.texto.inverso,
            transform: 'translateX(-100%)'
          }}
        >
          {blockA}
        </div>

        {!snapped && (
          <div
            className="absolute left-1/2 border-dashed"
            style={{
              width: blockB * unitWidth,
              height: tokens.tamanho.grande,
              backgroundColor: tokens.cor.superficie.fundo,
              borderColor: tokens.cor.elementos.borda,
              borderWidth: 2,
              borderTopRightRadius: tokens.tamanho.raio,
              borderBottomRightRadius: tokens.tamanho.raio,
            }}
          />
        )}

        <motion.div
          drag={!snapped && !disabled ? "x" : false}
          dragConstraints={{ left: 0, right: blockA * unitWidth }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={snapped ? { x: 0 } : {}}
          className="absolute flex items-center justify-center font-bold text-2xl shadow-md cursor-grab active:cursor-grabbing"
          style={{
            width: blockB * unitWidth,
            height: tokens.tamanho.grande,
            backgroundColor: tokens.cor.elementos.base_B,
            borderColor: tokens.cor.elementos.borda,
            borderWidth: 2,
            borderTopRightRadius: tokens.tamanho.raio,
            borderBottomRightRadius: tokens.tamanho.raio,
            borderTopLeftRadius: snapped ? 0 : tokens.tamanho.raio,
            borderBottomLeftRadius: snapped ? 0 : tokens.tamanho.raio,
            color: tokens.cor.texto.inverso,
            left: `calc(50% + ${snapped ? 0 : 80}px)`,
            zIndex: 20
          }}
        >
          {blockB}
        </motion.div>

        {snapped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 font-black text-4xl"
            style={{ color: tokens.cor.texto.principal }}
          >
            {blockA} + {blockB} = {total}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export interface SingaporeFractionBarProps {
  denominador: number;
  /** Posições normalizadas 0..1 das divisões internas. */
  marcas?: number[];
  destacarPrimeira?: boolean;
  /** Quantas partes iniciais ficam pintadas. Quando ausente, preserva o contrato F45. */
  destacarQuantidade?: number;
  rotulo?: string;
}

/**
 * A mesma linguagem de barra de Singapura, agora exposta como inteiro
 * particionado. Não resolve a ficha: apenas desenha as partes que o palco calcula,
 * mantendo a representação canônica compartilhada entre F45 e F72.
 */
export function SingaporeFractionBar({ denominador, marcas, destacarPrimeira = true, destacarQuantidade, rotulo }: SingaporeFractionBarProps) {
  const internas = [...(marcas ?? Array.from({ length: denominador - 1 }, (_, i) => (i + 1) / denominador))]
    .filter(v => Number.isFinite(v) && v > 0 && v < 1)
    .sort((a, b) => a - b);
  const bordas = [0, ...internas, 1];
  const larguras = bordas.slice(1).map((fim, i) => Math.max(0.02, fim - bordas[i]));
  const quantidade = destacarQuantidade === undefined ? (destacarPrimeira ? 1 : 0) : Math.max(0, Math.min(denominador, Math.round(destacarQuantidade)));

  return (
    <div className="mx-auto w-full max-w-xl" data-singapore-fraction-bar data-denominator={denominador} data-highlighted={quantidade}>
      <div
        role="img"
        aria-label={`barra dividida em ${denominador} partes; ${quantidade} destacada${quantidade === 1 ? "" : "s"}${rotulo ? `; fração ${rotulo}` : ""}`}
        className="flex h-24 w-full overflow-hidden rounded-2xl border-3 border-slate-700 bg-white shadow-sm"
      >
        {larguras.map((largura, index) => {
          const destacada = index < quantidade;
          return (
            <div
              key={`${index}-${largura}`}
              className={`flex items-center justify-center border-r-2 border-slate-700 text-lg font-black last:border-r-0 ${destacada ? "bg-sky-300 text-slate-900" : "bg-sky-50 text-slate-500"}`}
              style={{ width: `${largura * 100}%` }}
              data-fraction-part={index}
              data-highlighted={destacada ? "true" : "false"}
            >
              {destacada && index === 0 && rotulo ? rotulo : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface SingaporeLinkedScaleBarsProps {
  baseA: number;
  baseB: number;
  fator?: number;
  alvoA?: number;
  alvoB?: number;
  revelarEscaladas?: boolean;
}

function barWidth(value: number, max: number): string {
  return `${Math.max(12, Math.min(100, (value / Math.max(1, max)) * 100))}%`;
}

/**
 * F88 — realização física da invariância proporcional.
 *
 * Não há controles independentes por barra: o palco fornece um único fator e,
 * quando a decisão já ocorreu, as duas barras derivadas aparecem juntas. Assim
 * a própria estrutura impede “escalar um lado” por gesto de interface.
 */
export function SingaporeLinkedScaleBars({
  baseA,
  baseB,
  fator,
  alvoA,
  alvoB,
  revelarEscaladas = false,
}: SingaporeLinkedScaleBarsProps): React.ReactElement {
  const mostrarEscaladas = Boolean(revelarEscaladas && fator !== undefined && alvoA !== undefined && alvoB !== undefined);
  const max = Math.max(baseA, baseB, mostrarEscaladas ? (alvoA as number) : 0, mostrarEscaladas ? (alvoB as number) : 0, 1);
  const fmt = (n: number) => String(Number(n.toFixed(6))).replace(".", ",");
  const aria = mostrarEscaladas
    ? `duas barras vinculadas: ${fmt(baseA)} e ${fmt(baseB)}; o mesmo fator ${fmt(fator as number)} produz ${fmt(alvoA as number)} e ${fmt(alvoB as number)}`
    : `duas barras vinculadas com quantidades ${fmt(baseA)} e ${fmt(baseB)}${fator !== undefined ? `; o mesmo fator ${fmt(fator)} será aplicado às duas` : ""}`;

  const Pair = ({ a, b, scaled = false }: { a: number; b: number; scaled?: boolean }) => <div className="space-y-2" data-linked-pair={scaled ? "scaled" : "base"}>
    <div className="flex min-h-20 items-center rounded-2xl border-2 border-slate-700 bg-sky-50 px-3">
      <div className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black text-slate-900" style={{ width: barWidth(a, max), backgroundColor: tokens.cor.elementos.base_A }} data-linked-bar="a">{fmt(a)}</div>
    </div>
    <div className="flex min-h-20 items-center rounded-2xl border-2 border-slate-700 bg-amber-50 px-3">
      <div className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black text-slate-900" style={{ width: barWidth(b, max), backgroundColor: tokens.cor.elementos.base_B }} data-linked-bar="b">{fmt(b)}</div>
    </div>
  </div>;

  return <div
    className="mx-auto w-full max-w-2xl space-y-4"
    role="img"
    aria-label={aria}
    data-singapore-linked-scale=""
    data-bars-linked="true"
    data-scale-factor={fator === undefined ? "unknown" : numeroSeguro(fator)}
  >
    <Pair a={baseA} b={baseB} />
    {fator !== undefined ? <div className="text-center text-base font-black text-slate-700" data-shared-scale-factor="">Mesmo fator × {fmt(fator)} nas duas barras</div> : <div className="text-center text-base font-black text-slate-700">Descubra um único fator para o par.</div>}
    {mostrarEscaladas ? <div data-scaled-pair=""><Pair a={alvoA as number} b={alvoB as number} scaled /></div> : null}
  </div>;
}

function numeroSeguro(n: number): string {
  return String(Number(n.toFixed(6)));
}
