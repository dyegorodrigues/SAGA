import { Progress } from "../types";
type ProgOf = (trackId: string) => Progress;
import { Question, Track } from "../types";
import { FLUENCY_IDS } from "../curriculum/motores/composer";

/**
 * @deprecated Rota genérica de free-play mantida apenas por compatibilidade com
 * telas/links antigos que ainda apontem para `track="dojo"`.
 *
 * NÃO é autoridade curricular, NÃO implementa a prescrição do Sensei e NÃO
 * pode mover o ponteiro adaptativo dos templos. A inteligência atual vive em
 * `senseiDojoPrescription` + `senseiDojoSession`; a porta livre canônica usa os
 * templos `dojo_add/sub/mul/div` com `source="manual"`.
 */
export function buildDojoTrack(tracks: Track[], progOf: ProgOf): Track {
  // Heurística histórica. Mantida somente para compatibilidade do free-play.
  const fluPool = tracks.filter((t) => FLUENCY_IDS.includes(t.id));
  const activeTracks = fluPool.length > 0 ? fluPool : tracks;

  return {
    id: "dojo",
    name: "Dojo Matemático",
    icon: "🥋",
    color: "#E11D48", // Rose 600
    dark: "#9F1239", // Rose 800
    totalQ: 10,
    gen: (lvl: number) => {
      // Compatibilidade histórica: gera rapid-fire quando o tipo permite.
      const track = activeTracks[Math.floor(Math.random() * activeTracks.length)];
      const q = track.gen(Math.max(4, lvl));

      if (q.expr) {
         return { ...q, kind: "rapid-fire", rt_max_s: 5 };
      }
      return q;
    },
  };
}
