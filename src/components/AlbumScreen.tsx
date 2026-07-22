import React, { useState } from "react";
import { Kid } from "../types";
import { C, FONT, CoinChip, sfx, speak, TOTAL_STICKERS, COLLECTIONS } from "./Mascot";

interface AlbumProps {
  kid: Kid;
  coins: number;
  owned: string[];
  onBuy: (id: string, cost: number) => void;
  onBack: () => void;
}

export function AlbumScreen({ kid, coins, owned, onBuy, onBack }: AlbumProps) {
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const handleBuy = (id: string, cost: number, emo: string) => {
    if (owned.includes(id)) return;

    if (coins >= cost) {
      onBuy(id, cost);
      setPurchasedId(id);
      sfx.buy();
      speak(`Oba! Você liberou o amigo ${emo}!`);
      setTimeout(() => setPurchasedId(null), 1000);
    } else {
      setShakingId(id);
      sfx.wrong();
      speak(`Falta pouquinho! Você precisa de mais moedinhas.`);
      setTimeout(() => setShakingId(null), 500);
    }
  };

  return (
    <div className="mk-pop">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sfx.tick();
            onBack();
          }}
          className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-full"
          style={{
            background: C.card,
            color: C.ink,
            borderColor: C.line,
            boxShadow: `0 4px 0 ${C.line}`,
          }}
        >
          ✕
        </button>
        <div className="flex-1 text-center" style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.ink }}>
          Álbum de {kid.name} 🎁
        </div>
        <CoinChip n={coins} />
      </div>

      <p style={{ color: C.sub, fontWeight: 700, fontSize: 14, margin: "0 0 16px", textAlign: "center" }}>
        Junte moedinhas 🪙 nas missões e troque por amigos novos para a sua coleção!
      </p>

      {COLLECTIONS.map((col) => {
        const got = col.items.filter((_, i) => owned.includes(col.id + "-" + i)).length;
        const complete = got === col.items.length;

        return (
          <div
            key={col.id}
            className="mb-5 relative"
            style={{
              background: C.card,
              borderRadius: 24,
              boxShadow: `0 5px 0 ${C.line}`,
              padding: 16,
              border: complete ? "2px solid #FFC531" : "none",
            }}
          >
            {complete && (
              <span className="absolute -top-3.5 -right-2 text-2xl animate-bounce">
                👑
              </span>
            )}

            <div className="flex items-center justify-between">
              <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.ink }}>
                {col.name} {complete && "🏆"}
              </span>
              <span style={{ color: complete ? C.mintDark : C.sub, fontWeight: 800, fontSize: 13 }}>
                {got}/{col.items.length}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {col.items.map(([emo, cost], i) => {
                const id = col.id + "-" + i;
                const has = owned.includes(id);
                const isPurchasing = purchasedId === id;
                const isShaking = shakingId === id;

                return (
                  <button
                    key={id}
                    disabled={has}
                    onClick={() => handleBuy(id, Number(cost), String(emo))}
                    className={`relative select-none cursor-pointer transition-all active:translate-y-0.5 border-2 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center ${
                      isShaking ? "mk-shake border-rose-400" : ""
                    } ${isPurchasing ? "mk-pop border-amber-400" : ""}`}
                    style={{
                      background: has ? "#FFF9E8" : C.soft,
                      borderColor: has ? C.sun : C.line,
                    }}
                  >
                    {isPurchasing && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 text-xl animate-ping">
                        ✨
                      </div>
                    )}
                    <div
                      className="text-4xl filter drop-shadow transition-all"
                      style={{
                        filter: has ? "none" : "grayscale(1) opacity(0.45)",
                      }}
                    >
                      {emo}
                    </div>

                    {has ? (
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: C.sunDark, marginTop: 4 }}>
                        obtido!
                      </div>
                    ) : (
                      <div
                        className="mt-1 px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1"
                        style={{
                          background: coins >= Number(cost) ? "#FFEDD5" : "#E2E8F0",
                          color: coins >= Number(cost) ? "#9A3412" : C.sub,
                        }}
                      >
                        🪙 {cost}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
