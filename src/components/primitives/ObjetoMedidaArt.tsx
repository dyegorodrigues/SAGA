import React from "react";
import type { ItemRegua } from "../../curriculum/procedimentos/reguaContract";

export const UNIDADE_INFORMAL_PX = 34;

function tipoBase(id: string): string {
  return id.replace(/-(?:a|b)$/, "");
}

interface ObjetoProps {
  item: ItemRegua;
}

/**
 * Objetos usados pela F61.
 *
 * Não são emojis nem sprites esticados. Cada família foi escolhida porque pode
 * variar de comprimento sem destruir a plausibilidade visual (lápis, pincel,
 * giz, marcador e fita). As peças nas pontas têm largura fixa; apenas o corpo
 * longitudinal cresce. `data-regua-visible-start/end` ficam em elementos
 * VISÍVEIS, para a sonda comparar a silhueta real com os ticks da régua.
 */
export function ObjetoMedidaArt({ item }: ObjetoProps) {
  const tipo = tipoBase(item.id);
  const comum = {
    "data-regua-measure-object": true,
    "data-regua-object-kind": tipo,
    role: "img",
    "aria-label": item.nome,
  } as const;

  if (tipo === "lapis") {
    return (
      <div {...comum} className="relative h-10 w-full drop-shadow-sm">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[12px] h-4 w-3 rounded-l-sm border border-rose-700 bg-rose-400" />
        <span aria-hidden className="absolute left-3 right-4 top-[12px] h-4 border-y border-amber-700 bg-gradient-to-b from-yellow-200 via-yellow-300 to-amber-300" />
        <span aria-hidden className="absolute right-1 top-[12px] h-4 w-4 bg-amber-100" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[17px] h-[6px] w-[7px] bg-slate-800" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
        <span aria-hidden className="absolute left-[30%] right-[28%] top-[15px] h-[2px] rounded-full bg-white/55" />
      </div>
    );
  }

  if (tipo === "pincel") {
    return (
      <div {...comum} className="relative h-10 w-full drop-shadow-sm">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[16px] h-2 w-3 rounded-l-full border border-amber-900 bg-amber-700" />
        <span aria-hidden className="absolute left-2 right-8 top-[16px] h-2 rounded-full border-y border-amber-900 bg-gradient-to-b from-amber-400 to-amber-600" />
        <span aria-hidden className="absolute right-6 top-[12px] h-4 w-5 border border-slate-500 bg-gradient-to-r from-slate-200 to-slate-400" />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[9px] h-8 w-7 bg-gradient-to-r from-sky-500 to-indigo-600" style={{ clipPath: "polygon(0 14%,100% 0,100% 100%,0 86%)" }} />
      </div>
    );
  }

  if (tipo === "giz") {
    return (
      <div {...comum} className="relative h-10 w-full drop-shadow-sm">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[11px] h-[18px] w-3 rounded-l-md border border-violet-700 bg-violet-500" />
        <span aria-hidden className="absolute left-2 right-3 top-[11px] h-[18px] border-y border-violet-700 bg-gradient-to-b from-violet-300 via-violet-400 to-violet-500" />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[11px] h-[18px] w-4 rounded-r-[9px] border border-violet-700 bg-violet-400" />
        <span aria-hidden className="absolute left-[22%] right-[20%] top-[14px] h-[3px] rounded-full bg-white/35" />
      </div>
    );
  }

  if (tipo === "marcador") {
    return (
      <div {...comum} className="relative h-10 w-full drop-shadow-sm">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[10px] h-5 w-5 rounded-l-lg border-2 border-slate-800 bg-cyan-600" />
        <span aria-hidden className="absolute left-4 right-5 top-[10px] h-5 border-y-2 border-slate-800 bg-gradient-to-b from-slate-50 to-slate-200" />
        <span aria-hidden className="absolute right-3 top-[10px] h-5 w-4 border-y-2 border-slate-800 bg-slate-700" />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[14px] h-3 w-4 bg-slate-900" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
      </div>
    );
  }

  return (
    <div {...comum} className="relative h-10 w-full drop-shadow-sm">
      <span data-regua-visible-start aria-hidden className="absolute left-0 top-[10px] h-5 w-3 rounded-l-md border border-emerald-800 bg-emerald-600" />
      <span aria-hidden className="absolute left-2 right-2 top-[10px] h-5 border-y border-emerald-800 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-500" />
      <span data-regua-visible-end aria-hidden className="absolute right-0 top-[10px] h-5 w-3 rounded-r-md border border-emerald-800 bg-emerald-600" />
      <span aria-hidden className="absolute left-[8%] right-[8%] top-[14px] h-[2px] rounded-full bg-white/45" />
    </div>
  );
}

/**
 * Unidade informal premium, sem sprite/emoji. O diâmetro do círculo É a unidade
 * física. `flex: 0 0 34px` + gap zero garante tangência exata e repetível.
 */
export function BolaUnidade({ indice }: { indice: number }) {
  return (
    <span
      aria-hidden
      data-regua-informal-unit
      data-regua-informal-index={indice}
      className="relative block shrink-0 rounded-full border-2 border-slate-900 bg-white shadow-sm"
      style={{ width: UNIDADE_INFORMAL_PX, height: UNIDADE_INFORMAL_PX, flexBasis: UNIDADE_INFORMAL_PX }}
    >
      <span className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rotate-12 bg-slate-900" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute left-[3px] top-[6px] h-[7px] w-[7px] rotate-[-18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute right-[3px] top-[6px] h-[7px] w-[7px] rotate-[18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute bottom-[3px] left-[7px] h-[7px] w-[7px] rotate-[18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute bottom-[3px] right-[7px] h-[7px] w-[7px] rotate-[-18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
    </span>
  );
}
