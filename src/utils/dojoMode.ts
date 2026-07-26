import { Progress } from "../types";
type ProgOf = (trackId: string) => Progress;
import { Question, Track } from "../types";
import { FLUENCY_IDS } from "./composer";

export function buildDojoTrack(tracks: Track[], progOf: ProgOf): Track {
  // Apenas trilhas de fluência (soma, subtração) que possuem rapid-fire
  const fluPool = tracks.filter((t) => FLUENCY_IDS.includes(t.id));
  const activeTracks = fluPool.length > 0 ? fluPool : tracks; // fallback

  return {
    id: "dojo",
    name: "Dojo Matemático",
    icon: "🥋",
    color: "#E11D48", // Rose 600
    dark: "#9F1239", // Rose 800
    totalQ: 10,
    gen: (lvl: number) => {
      // Força a geração de exercícios rapid-fire se possível
      const track = activeTracks[Math.floor(Math.random() * activeTracks.length)];
      
      // Tentamos gerar a questão até vir um rapid-fire (alguns geradores dependem do level)
      // Level 4 e 5 costumam ser rapid-fire para soma/sub.
      const q = track.gen(Math.max(4, lvl)); 
      
      // Força o tipo como rapid-fire para garantir que use o layout Dojo (sem frescura)
      // if it's already an equation. Se for count, não faz sentido.
      if (q.expr) {
         return { ...q, kind: "rapid-fire", rt_max_s: 5 };
      }
      return q;
    },
  };
}
