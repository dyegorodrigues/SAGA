import { Track } from "../types";
import { TRACKS_PRE, TRACKS_ANO1, TRACKS_ANO2, TRACKS_IXL } from "../utils/curriculum";
import { TRACKS_MAT_ELITE_PRE, TRACKS_MAT_ELITE_ANO1 } from "./matElite";
import { TRACKS_LOGICA_ANO1 } from "./logica";
import { TRACKS_PORT_PRE, TRACKS_PORT_ANO1 } from "./port";
import { TRACKS_ENG_PRE, TRACKS_ENG_ANO1 } from "./eng";
import { TRACKS_SCI_PRE, TRACKS_SCI_ANO1 } from "./sci";
import { TRACKS_MUNDO_PRE, TRACKS_MUNDO_ANO1 } from "./mundo";

/**
 * SUBJECTS — o registro de cartuchos do console (bíblia, Parte IV, camada 4).
 * Matéria nova = 1 arquivo de geradores + 1 entrada aqui. O motor não muda.
 */
export interface Subject {
  id: string;
  nome: string;
  icon: string;
  novo?: boolean;
  tracks: { pre: Track[]; ano1: Track[]; ano2: Track[] };
}

export const SUBJECTS: Subject[] = [
  {
    id: "mundo",
    nome: "Meu Mundo",
    icon: "🌍",
    novo: true,
    tracks: { pre: TRACKS_MUNDO_PRE, ano1: TRACKS_MUNDO_ANO1, ano2: [] },
  },
  {
    id: "mat",
    nome: "Matemática",
    icon: "🔢",
    tracks: {
      pre: [...TRACKS_PRE, ...TRACKS_MAT_ELITE_PRE, ...TRACKS_IXL],
      ano1: [...TRACKS_ANO1, ...TRACKS_MAT_ELITE_ANO1, ...TRACKS_LOGICA_ANO1],
      ano2: [...TRACKS_ANO2],
    },
  },
  {
    id: "port",
    nome: "Português",
    icon: "📖",
    novo: true,
    tracks: { pre: TRACKS_PORT_PRE, ano1: TRACKS_PORT_ANO1, ano2: [] },
  },
  {
    id: "eng",
    nome: "Inglês",
    icon: "🇺🇸",
    novo: true,
    tracks: { pre: TRACKS_ENG_PRE, ano1: TRACKS_ENG_ANO1, ano2: [] },
  },
  {
    id: "sci",
    nome: "Ciências",
    icon: "🔬",
    novo: true,
    tracks: { pre: TRACKS_SCI_PRE, ano1: TRACKS_SCI_ANO1, ano2: [] },
  },
];

/** Todas as trilhas de uma série, atravessando as matérias. */
export function tracksForGrade(grade: "pre" | "ano1" | "ano2"): Track[] {
  return SUBJECTS.flatMap((s) => s.tracks[grade]);
}
