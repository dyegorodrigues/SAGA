import React from "react";
import { FONT } from "../Mascot";
import { LinkingCubes } from "./LinkingCubes";

export interface TakeApartProps {
  total: number;
  knownSplit?: { a: number; b: number };
}

export function TakeApart({ total, knownSplit }: TakeApartProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-4 gap-6">
      {knownSplit && (
        <div className="flex flex-col items-center gap-4 bg-slate-50 p-5 rounded-2xl w-full border-2 border-slate-200">
          <p className="text-sm md:text-lg font-bold text-slate-500 mb-1 text-center" style={{ fontFamily: FONT }}>
            Aqui está uma maneira de separar {total}:
          </p>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="scale-[0.8] md:scale-90 origin-center">
               <LinkingCubes groups={[{ n: total, color: "bg-purple-400" }]} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="text-3xl md:text-4xl font-black text-slate-700 whitespace-nowrap" style={{ fontFamily: FONT }}>
              <span className="text-purple-600">{total}</span> = <span className="text-blue-500">{knownSplit.a}</span> + <span className="text-rose-500">{knownSplit.b}</span>
            </div>
            <div className="scale-[0.8] md:scale-90 origin-center">
               <LinkingCubes numberAbove showPlus 
                 groups={[
                   { n: knownSplit.a, color: "bg-blue-400" }, 
                   { n: knownSplit.b, color: "bg-rose-400" }
                 ]} 
               />
            </div>
          </div>
        </div>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <p className="text-xl md:text-2xl font-black text-indigo-900 text-center" style={{ fontFamily: FONT }}>
          Mostre uma maneira diferente de separar {total}:
        </p>
        <div className="text-3xl md:text-5xl font-black text-slate-800 flex items-center justify-center gap-3 bg-white p-4 md:p-6 rounded-2xl border-4 border-dashed border-slate-300 w-full whitespace-nowrap">
          {total} = <span className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-xl inline-block" /> + <span className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-xl inline-block" />
        </div>
      </div>
    </div>
  );
}
