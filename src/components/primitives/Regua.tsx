import React from "react";

interface Props {
  max: number;
  unitPx?: number;
  destacarZero?: boolean;
  destacarMarca?: number | null;
  ariaLabel?: string;
}

const END_PAD_PX = 10;

/**
 * Régua visual da F61.
 *
 * A progressão atual trabalha centímetros inteiros. Portanto a régua não
 * desenha meia marca de 0,5 cm: isso evita introduzir precisão decimal que a
 * ficha ainda não está ensinando. A marca 0 fica em x=0; a marca N fica em
 * x=N*unitPx. A pequena sobra final é apenas madeira após a última marca.
 */
export function Regua({
  max,
  unitPx = 22,
  destacarZero = false,
  destacarMarca = null,
  ariaLabel = "Régua em centímetros inteiros",
}: Props) {
  const width = max * unitPx + END_PAD_PX;
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-regua
      data-regua-max={max}
      data-regua-unit-px={unitPx}
      data-regua-end-pad={END_PAD_PX}
      data-regua-step="1"
      className="relative h-[66px] rounded-lg border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-sm"
      style={{ width }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-amber-300/70" />
      {Array.from({ length: max + 1 }, (_, valor) => {
        const x = valor * unitPx;
        const destaque = destacarMarca === valor || (valor === 0 && destacarZero);
        const borda = valor === 0 ? "start" : valor === max ? "end" : "middle";
        return (
          <span
            key={valor}
            aria-hidden
            data-regua-tick={valor}
            className="absolute top-0 block border-l-2 border-amber-800"
            style={{
              left: x,
              height: 29,
              borderLeftWidth: destaque ? 4 : 2,
              opacity: destaque ? 1 : 0.86,
            }}
          >
            <span
              data-regua-label={valor}
              data-regua-label-edge={borda}
              className={`absolute top-[30px] whitespace-nowrap text-[11px] font-black ${destaque ? "text-blue-700" : "text-amber-950"}`}
              style={{
                left: valor === 0 ? 2 : 0,
                transform: valor === 0 ? "none" : "translateX(-50%)",
              }}
            >
              {valor}
            </span>
          </span>
        );
      })}
      <span aria-hidden className="absolute bottom-1 right-2 rounded bg-amber-200/80 px-1 text-[9px] font-black uppercase tracking-wide text-amber-900">cm</span>
    </div>
  );
}
