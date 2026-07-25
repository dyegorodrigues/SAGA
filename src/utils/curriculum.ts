import { Track } from "../types";
import { Question } from "../types";
import {
  gN1_12, gN3_03, gN3_04, gN2_03, gAL_03, gN2_01, gGM_03, gGM_04, gN3_10, gPE_01,
  gN1_01, gN1_02, gN1_03, gN1_04, gN1_05, gN1_06, gN1_07, gN1_08, gN1_09, gAL_01, gAL_02, gGE_01, gGE_02, gGM_02,
  gN3_01, gN3_02
} from "./generators";
import { gN1_10, gN1_11, gN2_02, gN3_05, gN3_06, gN3_07, gN3_08, gN3_09 } from "./generatorsF1";
import { gN2_04, gN2_05, gN3_11, gN3_12, gN3_13, gN4_01, gN4_02, gN4_05 } from "./generatorsF2";
import { C } from "../components/Mascot";
import { gIXL_VisualAddition, gIXL_Scattered, gIXL_LinkingCubesSentence, gIXL_TakeApart, gIXL_Sequence, gIXL_MissingAddendFrame } from "./generatorsIXL";
import { GrafoSaga } from "./grafoSaga";

export interface CurriculumModule {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
}

const gFallback = (lvl: number): Question => {
  return {
    kind: "multiple_choice",
    isFallback: true,
    prompt: "Em construção!",
    options: [{ label: "Ok", value: "ok" }],
    answer: "ok",
  };
};

const GENERATOR_MAP: Record<string, (lvl: number) => Question> = {
  "N1.01": gN1_01,
  "N1.02": gN1_02,
  "N1.03": gN1_03,
  "N1.04": gN1_04,
  "N1.05": gN1_05,
  "N1.06": gN1_06,
  "N1.07": gN1_07,
  "N1.08": gN1_08,
  "N1.09": gN1_09,
  "AL.01": gAL_01,
  "AL.02": gAL_02,
  "GE.01": gGE_01,
  "GE.02": gGE_02,
  "GM.02": gGM_02,
  "N1.12": gN1_12,
  "N3.01": gN3_01,
  "N3.02": gN3_02,
  "N1.10": gN1_10,
  "N1.11": gN1_11,
  "N3.03": gN3_03,
  "N3.04": gN3_04,
  "N2.01": gN2_01,
  "N2.02": gN2_02,
  "N2.03": gN2_03,
  "N3.05": gN3_05,
  "N3.06": gN3_06,
  "N3.07": gN3_07,
  "N3.08": gN3_08,
  "N3.09": gN3_09,
  "AL.03": gAL_03,
  "GM.03": gGM_03,
  "GM.04": gGM_04,
  "N3.10": gN3_10,
  "PE.01": gPE_01,
  "N2.04": gN2_04,
  "N2.05": gN2_05,
  "N3.12": gN3_12,
  "N3.13": gN3_13,

  "N3.11": gN3_11,
  "N4.01": gN4_01,
  "N4.02": gN4_02,
  "N4.05": gN4_05,
};

const ISLAND_INFO: Record<string, { icon: string, color: string, dark: string, islandId: string, lvlSkills: string[] }> = {
  "N1": { icon: "🔢", color: C.pink, dark: C.pinkDark, islandId: "num", lvlSkills: ["Visual", "Mental", "Abstrato", "Dojo"] },
  "N2": { icon: "💯", color: C.ocean, dark: C.oceanDark, islandId: "num", lvlSkills: ["Material", "Identificar", "Compor", "Dojo"] },
  "N3": { icon: "➕", color: C.mint, dark: C.mintDark, islandId: "op", lvlSkills: ["Concreto", "Mental", "Armado", "Dojo"] },
  "N4": { icon: "✖️", color: C.grape, dark: C.grapeDark, islandId: "op", lvlSkills: ["Grupos", "Arranjos", "Mental", "Dojo"] },
  "N5": { icon: "🍕", color: C.melon, dark: C.melonDark, islandId: "num", lvlSkills: ["Partes", "Comparar", "Somar", "Dojo"] },
  "N6": { icon: "📊", color: C.sun, dark: C.sunDark, islandId: "num", lvlSkills: ["Fração", "Decimal", "Porcento", "Dojo"] },
  "N7": { icon: "➖", color: C.pink, dark: C.pinkDark, islandId: "num", lvlSkills: ["Reta", "Somar", "Subtrair", "Dojo"] },
  "AL": { icon: "⚖️", color: C.sun, dark: C.sunDark, islandId: "logica", lvlSkills: ["Padrões", "Equilíbrio", "Equação", "Dojo"] },
  "GE": { icon: "🔺", color: C.melon, dark: C.melonDark, islandId: "logica", lvlSkills: ["Formas", "Espaço", "Sólidos", "Dojo"] },
  "GM": { icon: "📏", color: "#2E8B57", dark: "#1E5E3A", islandId: "real", lvlSkills: ["Medidas", "Horas", "Dinheiro", "Dojo"] },
  "PE": { icon: "📈", color: C.ocean, dark: C.oceanDark, islandId: "logica1", lvlSkills: ["Gráficos", "Tabelas", "Média", "Dojo"] },
};

const FAIXAS_INFO: Record<string, { id: string, name: string, description: string }> = {
  "F0": { id: "F0", name: "Pré-escola (4 a 5 anos)", description: "Percepção, contagem até 10, noções básicas." },
  "F1": { id: "F1", name: "1º Ano (6 a 7 anos)", description: "Números até 100, adição/subtração iniciais, relógio, dinheiro." },
  "F2": { id: "F2", name: "2º e 3º Ano (7 a 9 anos)", description: "Reagrupamento e mundo multiplicativo." },
  "F3": { id: "F3", name: "3º e 4º Ano (9 a 10 anos)", description: "Multiplicativo completo, frações e decimais." },
  "F4": { id: "F4", name: "5º e 6º Ano (10 a 12 anos)", description: "Proporcionalidade, inteiros e pré-álgebra." },
};

// Build CURRICULUM dynamically from GrafoSaga.nodes
export const CURRICULUM: CurriculumModule[] = [];

Object.keys(FAIXAS_INFO).forEach(faixaId => {
  const mod: CurriculumModule = {
    ...FAIXAS_INFO[faixaId],
    tracks: []
  };
  
  const nodes = GrafoSaga.nodes.filter(n => n.faixa === faixaId);
  nodes.forEach(n => {
    const strandPrefix = n.id.substring(0, 2);
    const info = ISLAND_INFO[strandPrefix] || ISLAND_INFO["N1"];
    const generator = GENERATOR_MAP[n.id] || gFallback;
    
    mod.tracks.push({
      id: n.id,
      name: n.nome,
      graphId: n.id,
      island: info.islandId,
      icon: info.icon,
      color: info.color,
      dark: info.dark,
      gen: generator,
      lvlSkills: info.lvlSkills,
      prereqs: n.prereqs
    });
  });
  
  CURRICULUM.push(mod);
});

export function getTrackById(id: string): Track | undefined {
  for (const mod of CURRICULUM) {
    const t = mod.tracks.find(x => x.id === id);
    if (t) return t;
  }
  return undefined;
}

export const TRACKS_PRE = CURRICULUM.find(m => m.id === 'F0')?.tracks || [];
export const TRACKS_ANO1 = CURRICULUM.find(m => m.id === 'F1')?.tracks || [];
export const TRACKS_ANO2 = CURRICULUM.find(m => m.id === 'F2')?.tracks || [];
export const TRACKS_IXL: Track[] = [
  { id: "IXL.06", name: "IXL: Faltam para 10", icon: "🔳", color: C.pink, dark: C.pinkDark, island: "num", gen: gIXL_MissingAddendFrame },
  { id: "IXL.01", name: "IXL: Soma Visual", icon: "🐦", color: C.pink, dark: C.pinkDark, island: "num", gen: gIXL_VisualAddition },
  { id: "IXL.02", name: "IXL: Contagem Espalhada", icon: "⭐", color: C.ocean, dark: C.oceanDark, island: "num", gen: gIXL_Scattered },
  { id: "IXL.03", name: "IXL: Unifix Cubes", icon: "🔗", color: C.mint, dark: C.mintDark, island: "op", gen: gIXL_LinkingCubesSentence },
  { id: "IXL.04", name: "IXL: Decomposição", icon: "🧩", color: C.grape, dark: C.grapeDark, island: "op", gen: gIXL_TakeApart },
  { id: "IXL.05", name: "IXL: Sequência", icon: "🔢", color: C.sun, dark: C.sunDark, island: "num", gen: gIXL_Sequence }
];
CURRICULUM.push({ id: "IXL", name: "Demonstração IXL", description: "Testes dos motores pedagógicos IXL", tracks: TRACKS_IXL });

export const ISLAND_DEFS: Record<string, { title: string, subtitle: string, color: string }> = {
  "alfa": { title: "Alfabetização Numérica", subtitle: "A base de tudo", color: "from-green-400 to-emerald-600" },
  "grand": { title: "Noções de Grandeza", subtitle: "Comparar e ordenar", color: "from-blue-400 to-indigo-600" },
  "logica": { title: "Raciocínio Lógico & Espaço", subtitle: "Padrões, formas e posições", color: "from-amber-400 to-orange-600" },
  "tempo": { title: "Noções de Tempo", subtitle: "Dias e calendários", color: "from-sky-400 to-blue-600" },
  "op": { title: "Primeiras Operações", subtitle: "Juntar e tirar", color: "from-rose-400 to-pink-600" },
  "num": { title: "Números e Sequências", subtitle: "Até 100 e além", color: "from-blue-500 to-indigo-700" },
  "op1": { title: "Operações e Estratégias", subtitle: "Somas rápidas e lógicas", color: "from-rose-500 to-pink-700" },
  "logica1": { title: "Lógica Aplicada", subtitle: "Problemas e gráficos", color: "from-amber-500 to-orange-700" },
  "real": { title: "Mundo Real", subtitle: "Dinheiro e horas", color: "from-emerald-500 to-teal-700" },
  "default": { title: "Novas Aventuras", subtitle: "Módulos extras", color: "from-purple-400 to-fuchsia-600" }
};
