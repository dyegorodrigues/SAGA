import { Track } from "../../types";
import { Question } from "../../types";
import {
  gN1_12, gN3_03, gN3_04, gN2_03, gAL_03, gN2_01, gGM_03, gGM_04, gN3_10, gPE_01,
  gN1_01, gN1_02, gN1_03, gN1_04, gN1_05, gN1_06, gN1_07, gN1_08, gN1_09, gAL_01, gAL_02, gGE_01, gGE_02, gGM_02,
  gN3_01, gN3_02
} from "../../utils/generators";
import { gN1_10, gN1_11, gN2_02, gN3_05, gN3_06, gN3_07, gN3_08, gN3_09 } from "../../utils/generatorsF1";
import { gN2_04, gN2_05, gN3_11, gN3_12, gN3_13, gN4_01, gN4_02, gN4_05 } from "../../utils/generatorsF2";
import { C } from "../../components/Mascot";
import { GrafoSaga } from "../../utils/grafoSaga";
import { hasComposerFicha, selectGenerator } from "./composerCanary";

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

/**
 * O rótulo de cada degrau da escada, por ilha.
 *
 * São CINCO, um por nível, e o seletor de nível derivava dele quantos degraus
 * mostrar. Enquanto eram quatro, o quinto degrau — onde a coroa é decidida e
 * onde mora o `rt_alvo` — nunca aparecia na tela, em nenhuma das noventa
 * competências.
 *
 * Os dois últimos nomes vêm do que as fichas realmente declaram, medido: no
 * nível 4 o andaime é "minimo" em 78 de 85 fichas — a criança faz quase
 * sozinha; no nível 5 é "nenhum" em 82 de 84, e é o único nível com alvo de
 * tempo. Daí "Sozinho" e "Dojo", nesta ordem.
 *
 * `escadaDoSeletorBateComOCurriculo.test.ts` recusa que voltem a divergir.
 */
const ISLAND_INFO: Record<string, { icon: string, color: string, dark: string, islandId: string, lvlSkills: string[] }> = {
  "N1": { icon: "🔢", color: C.pink, dark: C.pinkDark, islandId: "N1", lvlSkills: ["Visual", "Mental", "Abstrato", "Sozinho", "Dojo"] },
  "N2": { icon: "💯", color: C.ocean, dark: C.oceanDark, islandId: "N2", lvlSkills: ["Material", "Identificar", "Compor", "Sozinho", "Dojo"] },
  "N3": { icon: "➕", color: C.mint, dark: C.mintDark, islandId: "N3", lvlSkills: ["Concreto", "Mental", "Armado", "Sozinho", "Dojo"] },
  "N4": { icon: "✖️", color: C.grape, dark: C.grapeDark, islandId: "N4", lvlSkills: ["Grupos", "Arranjos", "Mental", "Sozinho", "Dojo"] },
  "N5": { icon: "🍕", color: C.melon, dark: C.melonDark, islandId: "N5", lvlSkills: ["Partes", "Comparar", "Somar", "Sozinho", "Dojo"] },
  "N6": { icon: "📊", color: C.sun, dark: C.sunDark, islandId: "N6", lvlSkills: ["Fração", "Decimal", "Porcento", "Sozinho", "Dojo"] },
  "N7": { icon: "➖", color: C.pink, dark: C.pinkDark, islandId: "N7", lvlSkills: ["Reta", "Somar", "Subtrair", "Sozinho", "Dojo"] },
  "AL": { icon: "⚖️", color: C.sun, dark: C.sunDark, islandId: "AL", lvlSkills: ["Padrões", "Equilíbrio", "Equação", "Sozinho", "Dojo"] },
  "GE": { icon: "🔺", color: C.melon, dark: C.melonDark, islandId: "GE", lvlSkills: ["Formas", "Espaço", "Sólidos", "Sozinho", "Dojo"] },
  "GM": { icon: "📏", color: "#2E8B57", dark: "#1E5E3A", islandId: "GM", lvlSkills: ["Medidas", "Horas", "Dinheiro", "Sozinho", "Dojo"] },
  "PE": { icon: "📈", color: C.ocean, dark: C.oceanDark, islandId: "PE", lvlSkills: ["Gráficos", "Tabelas", "Média", "Sozinho", "Dojo"] },
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
    // Todo nó passa pela mesma ponte: promover um canário não exige tocar aqui.
    const binding = selectGenerator(n.id, GENERATOR_MAP[n.id], gFallback);

    mod.tracks.push({
      id: n.id,
      name: n.nome,
      graphId: n.id,
      island: info.islandId,
      icon: info.icon,
      color: info.color,
      dark: info.dark,
      gen: binding.gen,
      // Getter: a proveniência acompanha rollback em vez de congelar na carga.
      get generatorSource() {
        return binding.source();
      },
      lvlSkills: info.lvlSkills,
      prereqs: n.prereqs,
      // Reflete o que é SERVIDO, não o que está registrado. Uma ficha existir no
      // catálogo sem estar ativa é o estado normal entre o PR que implementa e o
      // que ativa — e nesse intervalo o nó continua caindo no fallback genérico.
      // Marcá-lo "explicit" faria a Oficina prescrever resgate sobre conteúdo que
      // não existe, exatamente o que o rescuePlanner promete nunca fazer.
      // Getter pelo mesmo motivo de `generatorSource`: acompanha o rollback.
      get contentStatus() {
        return binding.source() === "fallback" ? "fallback" as const : "explicit" as const;
      },
    });
  });
  
  CURRICULUM.push(mod);
});

/**
 * O gerador legado de um nó, se existir.
 *
 * Existe para que o contrato do canário **descubra** o legado em vez de confiar
 * numa declaração à mão: declarar é uma chance de declarar errado, e um legado
 * errado faria o teste de paridade comparar a ficha nova com a coisa errada,
 * passando sem verificar nada.
 *
 * Devolve `undefined` para os nós que nunca tiveram gerador próprio — os 46 que
 * caem no placeholder genérico. Para esses, promover é ESTREIA, não substituição,
 * e "paridade" não quer dizer nada.
 */
export function geradorLegadoDe(id: string): ((lvl: number) => Question) | undefined {
  return GENERATOR_MAP[id];
}

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

/**
 * Jornada matemática completa. Idade/série orienta a apresentação, mas não remove
 * nós do DAG: pré-requisitos e proficiência decidem o que pode ser iniciado.
 */
export const ALL_MATH_TRACKS = CURRICULUM.flatMap(module => module.tracks);

export const ISLAND_DEFS: Record<string, { title: string, subtitle: string, color: string }> = {
  "N1": { title: "Senso Numérico e Contagem", subtitle: "A base de tudo", color: "from-green-400 to-emerald-600" },
  "N2": { title: "Sistema Decimal", subtitle: "Valor posicional", color: "from-blue-400 to-indigo-600" },
  "N3": { title: "Adição e Subtração", subtitle: "Juntar e tirar", color: "from-rose-400 to-pink-600" },
  "N4": { title: "Multiplicação e Divisão", subtitle: "Agrupar e repartir", color: "from-amber-400 to-orange-600" },
  "N5": { title: "Frações", subtitle: "Partes do todo", color: "from-purple-400 to-fuchsia-600" },
  "N6": { title: "Decimais e Porcentagem", subtitle: "Além do inteiro", color: "from-sky-400 to-blue-600" },
  "N7": { title: "Números Negativos", subtitle: "Abaixo de zero", color: "from-slate-400 to-slate-600" },
  "AL": { title: "Álgebra e Padrões", subtitle: "Lógica matemática", color: "from-yellow-400 to-amber-600" },
  "GE": { title: "Geometria", subtitle: "Formas e espaço", color: "from-pink-400 to-rose-600" },
  "GM": { title: "Grandezas e Medidas", subtitle: "Mundo real", color: "from-teal-400 to-emerald-600" },
  "PE": { title: "Estatística", subtitle: "Dados e gráficos", color: "from-indigo-400 to-violet-600" },
  "port": { title: "Português", subtitle: "Letras, Sons e Palavras", color: "from-pink-400 to-rose-600" },
  "eng": { title: "Inglês", subtitle: "Primeiras palavras", color: "from-blue-400 to-cyan-600" },
  "sci": { title: "Ciências", subtitle: "Descobrindo o mundo", color: "from-lime-400 to-green-600" },
  "mundo": { title: "Meu Mundo", subtitle: "Eu e a natureza", color: "from-orange-400 to-amber-600" },
  "default": { title: "Novas Aventuras", subtitle: "Módulos extras", color: "from-purple-400 to-fuchsia-600" }
};
