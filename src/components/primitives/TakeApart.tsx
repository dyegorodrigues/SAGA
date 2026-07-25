import React from "react";
import { FONT } from "../Mascot";
import { LinkingCubes } from "./LinkingCubes";

export interface TakeApartProps {
  total: number;
  knownSplit?: { a: number; b: number };
}

export function TakeApart({ total, knownSplit }: TakeApartProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm gap-8">
      {knownSplit && (
        <div className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-2xl w-full border border-slate-200">
          <p className="text-lg font-bold text-slate-500 mb-2" style={{ fontFamily: FONT }}>
            Aqui está uma maneira de separar {total}:
          </p>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-black text-slate-700" style={{ fontFamily: FONT }}>
              {total} = {knownSplit.a} + {knownSplit.b}
            </div>
            <div className="scale-75 origin-left">
               <LinkingCubes 
                 groups={[
                   { n: knownSplit.a, color: "bg-emerald-400" }, 
                   { n: knownSplit.b, color: "bg-indigo-400" }
                 ]} 
               />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-6 p-4">
        <p className="text-2xl font-black text-indigo-900 text-center" style={{ fontFamily: FONT }}>
          Mostre uma maneira diferente de separar {total}:
        </p>
        <div className="text-5xl font-black text-slate-800 flex items-center gap-4 bg-white p-6 rounded-2xl border-4 border-dashed border-slate-300">
          {total} = <span className="w-16 h-16 bg-slate-100 rounded-xl inline-block" /> + <span className="w-16 h-16 bg-slate-100 rounded-xl inline-block" />
        </div>
      </div>
    </div>
  );
}
