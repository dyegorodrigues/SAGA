import React from "react";

interface Props {
  max: number;
  unitPx?: number;
  destacarZero?: boolean;
  destacarMarca?: number | null;
  ariaLabel?: string;
}

/**
 * Régua visual pura. Currículo e diagnóstico ficam fora deste componente.
 * A marca 0 está exatamente no x=0 do plano da régua: o Stage pode comparar
 * geometria real sem compensação invisível de padding.
 */
export function Regua({
  max,
  unitPx = 22,
  destacarZero = false,
  destacarMarca = null,
  ariaLabel = "Régua em centímetros",
}: Props) {
  const width = max * unitPx;
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-regua
      data-regua-max={max}
      data-regua-unit-px={unitPx}
      className="relative h-[70px] rounded-b-xl border-2 border-amber-500 bg-amber-100 shadow-sm"
      style={{ width }}
    >
      {Array.from({ length: max * 2 + 1 }, (_, i) => i / 2).map(valor => {
        const inteiro = Number.isInteger(valor);
        const x = valor * unitPx;
        const destaque = destacarMarca === valor || (valor === 0 && destacarZero);
        return (
          <span
            key={valor}
            aria-hidden
            className="absolute top-0 block border-l-2 border-amber-800"
            style={{
              left: x,
              height: inteiro ? 28 : 16,
              borderLeftWidth: destaque ? 4 : 2,
              opacity: destaque ? 1 : 0.82,
            }}
          >
            {inteiro && (
              <span
                className={`absolute top-[29px] -translate-x-1/2 text-xs font-black ${destaque ? "text-blue-700" : "text-amber-950"}`}
              >
                {valor}
              </span>
            )}
          </span>
        );
      })}
      <span aria-hidden className="absolute bottom-1 right-2 text-[10px] font-black text-amber-900">cm</span>
    </div>
  );
}
