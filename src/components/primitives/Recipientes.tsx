import React from "react";
import { motion } from "motion/react";
import { ItemDeMedida } from "../../curriculum/procedimentos/medidasContract";

interface Props {
  itens: ItemDeMedida[];
  verificado: boolean;
  disabled?: boolean;
  ordem?: number[];
  onChoose?: (i: number) => void;
  onVerify?: () => void;
}

function dimensoes(item: ItemDeMedida, compacto: boolean) {
  const baseW = compacto ? 58 : 78;
  const baseH = compacto ? 92 : 126;
  return {
    width: Math.round(baseW * (item.largura ?? 1)),
    height: Math.round(baseH * (item.altura ?? 1)),
  };
}

function Marca({ item }: { item: ItemDeMedida }) {
  return (
    <span
      aria-hidden
      className="flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white px-1 text-lg font-black text-slate-800 shadow-sm"
    >
      {item.marcador ?? item.emoji}
    </span>
  );
}

export function Recipientes({ itens, verificado, disabled, ordem = [], onChoose, onVerify }: Props) {
  const max = Math.max(...itens.map(i => i.valor));
  const compacto = itens.length >= 3;
  return (
    <div className="flex w-full flex-col items-center gap-3" data-recipientes-stage>
      <div className="flex min-h-[164px] w-full items-end justify-center gap-3 px-1">
        {itens.map((item, i) => {
          const d = dimensoes(item, compacto);
          const posto = ordem.indexOf(i);
          return (
            <button
              key={item.id}
              type="button"
              className="relative flex min-h-[84px] min-w-[76px] flex-col items-center justify-end rounded-2xl p-1 focus-visible:outline-4 focus-visible:outline-blue-500 disabled:opacity-70"
              aria-label={`${item.nome} ${i + 1}`}
              disabled={disabled}
              onClick={() => onChoose?.(i)}
            >
              <span className="relative block" style={{ width: d.width, height: d.height }}>
                <span
                  aria-hidden
                  className="absolute inset-0 overflow-hidden border-[4px] border-slate-500 bg-white/70 shadow-inner"
                  style={{ borderRadius: `${Math.max(12, d.width * 0.22)}px ${Math.max(12, d.width * 0.22)}px ${Math.max(18, d.width * 0.38)}px ${Math.max(18, d.width * 0.38)}px` }}
                >
                  <motion.span
                    className="absolute inset-x-0 bottom-0 block bg-sky-400/80"
                    initial={false}
                    animate={{ height: `${Math.round((item.preenchimento ?? 1) * 100)}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </span>
                <span className="absolute -right-3 -top-4"><Marca item={item} /></span>
              </span>
              {posto >= 0 && (
                <span className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow">
                  {posto + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!verificado && (
        <button
          type="button"
          data-recipientes-verify
          className="min-h-[54px] rounded-2xl border-2 border-blue-500 bg-blue-50 px-5 py-2 text-base font-black text-blue-800 shadow-sm focus-visible:outline-4 focus-visible:outline-blue-500"
          onClick={onVerify}
          disabled={disabled}
          aria-label="Despejar para recipientes iguais e comparar"
        >
          🫗 Despejar e comparar
        </button>
      )}

      {verificado && (
        <motion.div
          data-recipientes-standard
          aria-label="As quantidades foram despejadas em recipientes iguais"
          className="flex min-h-[122px] w-full items-end justify-center gap-4 rounded-2xl border-2 border-sky-200 bg-sky-50/70 px-4 py-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {itens.map((item, i) => (
            <div key={`std-${item.id}`} className="flex flex-col items-center gap-1">
              <div className="relative h-[86px] w-[42px] overflow-hidden rounded-b-xl border-[3px] border-slate-500 bg-white">
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-sky-500/80"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(10, Math.round((item.valor / max) * 100))}%` }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                />
              </div>
              <Marca item={item} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
