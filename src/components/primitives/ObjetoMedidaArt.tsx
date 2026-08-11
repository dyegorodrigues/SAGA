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
 * Não são emojis nem sprites esticados. As famílias escolhidas aceitam variação
 * longitudinal plausível: pontas/caps mantêm tamanho fixo e somente o corpo
 * central absorve o comprimento. `data-regua-visible-start/end` ficam em partes
 * realmente visíveis, para a sonda medir a silhueta percebida pela criança.
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
      <div {...comum} className="relative h-11 w-full drop-shadow-[0_3px_2px_rgba(15,23,42,0.18)]">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[13px] h-[18px] w-[10px] rounded-l-[4px] border border-rose-800 bg-gradient-to-b from-rose-300 via-rose-400 to-rose-500" />
        <span aria-hidden className="absolute left-[9px] top-[13px] h-[18px] w-[8px] border-y border-slate-500 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400" />
        <span aria-hidden className="absolute left-[16px] right-[18px] top-[13px] h-[18px] border-y border-amber-700 bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-400" />
        <span aria-hidden className="absolute left-[21px] right-[24px] top-[16px] h-[3px] rounded-full bg-white/60" />
        <span aria-hidden className="absolute right-[5px] top-[13px] h-[18px] w-[14px] bg-gradient-to-r from-amber-100 to-orange-100" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[19px] h-[6px] w-[7px] bg-slate-800" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
        <span aria-hidden className="absolute left-[18px] right-[17px] top-[29px] h-[2px] bg-amber-700/35" />
      </div>
    );
  }

  if (tipo === "pincel") {
    return (
      <div {...comum} className="relative h-11 w-full drop-shadow-[0_3px_2px_rgba(15,23,42,0.18)]">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[18px] h-[9px] w-[11px] rounded-l-full border border-amber-950 bg-amber-800" />
        <span aria-hidden className="absolute left-[8px] right-[35px] top-[18px] h-[9px] rounded-full border-y border-amber-900 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700" />
        <span aria-hidden className="absolute right-[29px] top-[13px] h-[19px] w-[18px] border border-slate-500 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400" />
        <span aria-hidden className="absolute right-[27px] top-[15px] h-[2px] w-[14px] bg-white/70" />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[8px] h-[30px] w-[30px] bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700" style={{ clipPath: "polygon(0 15%,62% 6%,100% 50%,62% 94%,0 85%)" }} />
        <span aria-hidden className="absolute right-[8px] top-[15px] h-[3px] w-[12px] rotate-[-8deg] rounded-full bg-white/30" />
      </div>
    );
  }

  if (tipo === "giz") {
    return (
      <div {...comum} className="relative h-11 w-full drop-shadow-[0_3px_2px_rgba(15,23,42,0.18)]">
        {/* Base chata + corpo de cera: evita a silhueta de cápsula/comprimido. */}
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[12px] h-[22px] w-[8px] rounded-l-[2px] border border-violet-900 bg-violet-700" />
        <span aria-hidden className="absolute left-[7px] right-[18px] top-[12px] h-[22px] border-y border-violet-900 bg-gradient-to-b from-violet-300 via-violet-500 to-violet-700" />
        {/* Papel do giz: bordas em V e duas faixas, como um crayon real. */}
        <span aria-hidden className="absolute left-[18%] right-[30%] top-[10px] h-[26px] border-y border-violet-800 bg-gradient-to-b from-amber-50 via-white to-amber-100" style={{ clipPath: "polygon(3% 0,97% 0,100% 18%,97% 36%,100% 54%,97% 72%,100% 100%,3% 100%,0 82%,3% 64%,0 46%,3% 28%,0 10%)" }} />
        <span aria-hidden className="absolute left-[23%] right-[35%] top-[14px] h-[5px] rounded-full bg-violet-500" />
        <span aria-hidden className="absolute left-[24%] right-[36%] top-[25px] h-[4px] rounded-full bg-violet-300" />
        {/* Ponta de cera chanfrada, claramente diferente de uma cápsula. */}
        <span aria-hidden className="absolute right-[5px] top-[12px] h-[22px] w-[14px] bg-gradient-to-r from-violet-500 to-violet-400" style={{ clipPath: "polygon(0 0,64% 0,100% 50%,64% 100%,0 100%)" }} />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[19px] h-[8px] w-[7px] bg-violet-600" style={{ clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
        <span aria-hidden className="absolute left-[10px] right-[18px] top-[15px] h-[3px] rounded-full bg-white/28" />
      </div>
    );
  }

  if (tipo === "marcador") {
    return (
      <div {...comum} className="relative h-11 w-full drop-shadow-[0_3px_2px_rgba(15,23,42,0.18)]">
        <span data-regua-visible-start aria-hidden className="absolute left-0 top-[11px] h-[24px] w-[17px] rounded-l-[7px] border-2 border-slate-800 bg-gradient-to-b from-cyan-400 to-cyan-700" />
        <span aria-hidden className="absolute left-[15px] right-[24px] top-[11px] h-[24px] border-y-2 border-slate-800 bg-gradient-to-b from-white via-slate-100 to-slate-300" />
        <span aria-hidden className="absolute left-[24%] right-[36%] top-[18px] h-[7px] rounded-full border border-cyan-700 bg-cyan-100" />
        <span aria-hidden className="absolute right-[19px] top-[11px] h-[24px] w-[12px] border-y-2 border-slate-800 bg-gradient-to-r from-slate-500 to-slate-700" />
        <span data-regua-visible-end aria-hidden className="absolute right-0 top-[17px] h-[12px] w-[20px] bg-slate-900" style={{ clipPath: "polygon(0 0,62% 0,100% 50%,62% 100%,0 100%)" }} />
        <span aria-hidden className="absolute left-[19px] right-[28px] top-[14px] h-[3px] rounded-full bg-white/80" />
      </div>
    );
  }

  // Fita de treino: faixa de tecido com costura, não uma cápsula arredondada.
  return (
    <div {...comum} className="relative h-11 w-full drop-shadow-[0_3px_2px_rgba(15,23,42,0.16)]">
      <span data-regua-visible-start aria-hidden className="absolute left-0 top-[12px] h-[22px] w-[8px] border border-emerald-900 bg-emerald-700" />
      <span aria-hidden className="absolute left-[7px] right-[7px] top-[12px] h-[22px] border-y border-emerald-900 bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700" />
      <span data-regua-visible-end aria-hidden className="absolute right-0 top-[12px] h-[22px] w-[8px] border border-emerald-900 bg-emerald-700" />
      <span aria-hidden className="absolute left-[10px] right-[10px] top-[15px] border-t border-dashed border-emerald-950/70" />
      <span aria-hidden className="absolute left-[10px] right-[10px] bottom-[12px] border-t border-dashed border-emerald-950/70" />
      <span aria-hidden className="absolute left-[14%] top-[15px] h-[16px] w-[18px] border border-emerald-950 bg-slate-900/80" />
      <span aria-hidden className="absolute left-[15%] top-[18px] h-[2px] w-[13px] bg-emerald-300/70" />
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
      className="relative block shrink-0 rounded-full border-2 border-slate-900 bg-gradient-to-br from-white via-slate-50 to-slate-200 shadow-[inset_-3px_-3px_4px_rgba(15,23,42,0.12),0_2px_2px_rgba(15,23,42,0.16)]"
      style={{ width: UNIDADE_INFORMAL_PX, height: UNIDADE_INFORMAL_PX, flexBasis: UNIDADE_INFORMAL_PX }}
    >
      <span className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rotate-12 bg-slate-900" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute left-[3px] top-[6px] h-[7px] w-[7px] rotate-[-18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute right-[3px] top-[6px] h-[7px] w-[7px] rotate-[18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute bottom-[3px] left-[7px] h-[7px] w-[7px] rotate-[18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute bottom-[3px] right-[7px] h-[7px] w-[7px] rotate-[-18deg] bg-slate-800" style={{ clipPath: "polygon(50% 0,98% 35%,80% 100%,20% 100%,2% 35%)" }} />
      <span className="absolute left-[7px] top-[4px] h-[5px] w-[8px] rotate-[-20deg] rounded-full bg-white/90" />
    </span>
  );
}
