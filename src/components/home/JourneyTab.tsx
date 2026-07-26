import React from "react";
import { Track } from "../../types";
import { FONT, FRESH } from "../Mascot";
import { LearningPath } from "../LearningPath";
import { SUBJECTS } from "../../subjects";

interface Props {
  prog: Record<string, any>;
  onTrack: (t: Track) => void;
}

export function JourneyTab({ prog, onTrack }: Props) {
  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-10">
         <div className="text-center mb-6 mt-8">
           <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Mundo SAGA</h2>
           <p className="text-sm font-bold text-slate-500 mt-1">Siga a trilha para dominar os números!</p>
         </div>
         <LearningPath 
             tracks={(() => {
              const mat = SUBJECTS.find(s => s.id === 'mat');
              if (!mat) return [];
              const allMat = ["pre", "ano1", "ano2"].flatMap(g => mat.tracks[g as "pre" | "ano1" | "ano2"] || []);
              return Array.from(new Map(allMat.map(t => [t.id, t])).values());
            })()}
            progOf={(id) => prog[id] || FRESH()}
            onSelectTrack={onTrack}
         />
      </div>
    </div>
  );
}
