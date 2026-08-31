import React, { useState } from "react";
import { Icone } from "../icones/Icone";
import { Kid } from "../../types";
import { FONT, sfx, CoinChip, Mascote } from "../Mascot";

interface WardrobeItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: "bg";
}

const WARDROBE_ITEMS: WardrobeItem[] = [
  // Cenários de Fundo
  { id: "none", name: "Fundo Padrão", emoji: "🏠", cost: 0, type: "bg" },
  { id: "parque", name: "Parque Verdejante", emoji: "🌳", cost: 6, type: "bg" },
  { id: "campo", name: "Campo de Futebol", emoji: "🏟️", cost: 12, type: "bg" },
  { id: "espaco", name: "Espaço Cósmico", emoji: "🌌", cost: 18, type: "bg" },
  { id: "castelo", name: "Castelo Encantado", emoji: "🏰", cost: 25, type: "bg" },
];

interface WardrobeModalProps {
  kid: Kid;
  stageNum: number;
  onClose: () => void;
  onUpdateKid: (kid: Kid, coinsSpent?: number) => void;
  tempBg: string;
  setTempBg: (bg: string) => void;
  tempInventory: string[];
  setTempInventory: (inv: string[]) => void;
  tempCoins: number;
  setTempCoins: (c: number) => void;
  coinsSpent: number;
  setCoinsSpent: (c: number) => void;
}

export function WardrobeModal({
  kid,
  stageNum,
  onClose,
  onUpdateKid,
  tempBg,
  setTempBg,
  tempInventory,
  setTempInventory,
  tempCoins,
  setTempCoins,
  coinsSpent,
  setCoinsSpent,
}: WardrobeModalProps) {
  
  const [tempOutfit] = useState("none");

  const handleBuyOrEquip = (item: WardrobeItem) => {
    const isUnlocked = item.cost === 0 || tempInventory.includes(item.id);

    if (isUnlocked) {
      sfx.tick();
      setTempBg(item.id);
    } else {
      if (tempCoins >= item.cost) {
        sfx.level();
        setTempCoins(tempCoins - item.cost);
        setCoinsSpent(coinsSpent + item.cost);
        setTempInventory([...tempInventory, item.id]);
        setTempBg(item.id);
      } else {
        sfx.wrong();
        alert("Faltam moedinhas para este item. Faça mais missões para ganhar mais!");
      }
    }
  };

  const handleSaveWardrobe = () => {
    sfx.level();
    const updatedKid = {
      ...kid,
      outfit: tempOutfit,
      bgAccessory: tempBg,
      inventory: tempInventory,
    };
    onUpdateKid(updatedKid, coinsSpent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white card-block border-4 border-amber-300 p-6 max-w-md w-full shadow-2xl relative mk-pop select-none flex flex-col max-h-[90vh]">
        <button
          onClick={() => {
            sfx.tick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-md border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
        >
          ×
        </button>
        <div className="text-center mb-4">
          <h3 className="text-xl font-black text-amber-950" style={{ fontFamily: FONT }}>
            Cenário Mágico
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Mude o cenário de fundo do seu mascote com suas estrelas!
          </p>
        </div>
        <div className="relative w-40 h-40 rounded-md mx-auto bg-slate-50 border-4 border-slate-100 flex items-center justify-center shadow-inner mb-4 overflow-hidden">
          <Mascote theme={kid.theme} size={140} outfit="none" bgAccessory={tempBg} stage={stageNum} kid={kid} />
        </div>
        <div className="flex items-center justify-between gap-2 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-slate-600 uppercase" style={{ fontFamily: FONT }}>Suas Moedinhas:</span>
          <CoinChip n={tempCoins} />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {WARDROBE_ITEMS.map((item) => {
            const isUnlocked = item.cost === 0 || tempInventory.includes(item.id);
            const isSelected = tempBg === item.id;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "bg-amber-50/70 border-amber-400 shadow-sm"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    {item.emoji}
                  </span>
                  <div>
                    <div className="text-xs font-black text-slate-800" style={{ fontFamily: FONT }}>
                       {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      {item.cost === 0 ? "Grátis / Padrão" : `Custa ${item.cost} moedinhas`}
                    </div>
                  </div>
                </div>
                <div>
                  {isSelected ? (
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border-2 border-emerald-300/60 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      Equipado
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleBuyOrEquip(item)}
                      className="text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 px-4 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      Usar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyOrEquip(item)}
                      disabled={tempCoins < item.cost}
                      className={`text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all ${
                        tempCoins >= item.cost
                          ? "text-amber-900 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300"
                          : "text-slate-400 bg-slate-100 border-2 border-slate-200 cursor-not-allowed"
                      }`}
                    >
                      Comprar por {item.cost}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={handleSaveWardrobe}
            className="w-full bg-emerald-500 text-white font-black py-3.5 px-5 rounded-2xl shadow-md border-b-4 border-emerald-700 active:translate-y-0.5 active:border-b-2 transition-all text-sm cursor-pointer"
            style={{ fontFamily: FONT }}
          >
            Confirmar Cenário
          </button>
        </div>
      </div>
    </div>
  );
}
