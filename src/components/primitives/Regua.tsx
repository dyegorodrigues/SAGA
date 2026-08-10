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
 * Régua visual pura. Currículo e diagnóstico ficam fora deste componente.
 * A marca 0 está exatamente no x=0 do plano da régua: o Stage pode comparar
 * geometria real sem compensação invisível de padding.
 *
 * Há uma pequena sobra física APÓS a última marca. Ela não altera a escala
 * matemática (`unitPx` continua soberano), apenas impede que o rótulo final
 * fique pendurado para fora da madeira em telas pequenas.
 */
export function Regua({
  max,
  unitPx = 22,
  destacarZero = false,
  destacarMarca = null,
  ariaLabel = "Régua em centímetros",
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
      className="relative h-[66px] rounded-lg border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-sm"
      style={{ width }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-amber-300/70" />
      {Array.from({ length: max * 2 + 1 }, (_, i) => i / 2).map(valor => {
        const inteiro = Number.isInteger(valor);
        const x = valor * unitPx;
        const destaque = destacarMarca === valor || (valor === 0 && destacarZero);
        const borda = valor === 0 ? "start" : valor === max ? "end" : "middle";
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
                data-regua-label={valor}
                data-regua-label-edge={borda}
                className={`absolute top-[29px] whitespace-nowrap text-[11px] font-black ${destaque ? "text-blue-700" : "text-amber-950"}`}
                style={{
                  left: valor === 0 ? 2 : 0,
                  transform: valor === 0 ? "none" : "translateX(-50%)",
                }}
              >
                {valor}
              </span>
            )}
          </span>
        );
      })}
      <span aria-hidden className="absolute bottom-1 right-2 rounded bg-amber-200/80 px-1 text-[9px] font-black uppercase tracking-wide text-amber-900">cm</span>
    </div>
  );
}
