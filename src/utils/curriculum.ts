import { Track } from "../types";
import {
  gA1Seq, gA1Soma, gA1Sub, gA1Comp, gA1Pular, gA1Dez, gA1Dinheiro, gA1Horas, gA1Problemas, gA1Graficos,
  gN1_01, gN1_02, gN1_03, gN1_04, gN1_05, gN1_06, gN1_07, gN1_09, gAL_01, gAL_02, gGE_01, gGE_02, gGM_02,
  gPreSoma, gPreTirar // we use these for N3.01 and N3.02 in ano1
} from "./generators";
import { gN1_10, gN1_11, gN2_02, gN3_05, gN3_06, gN3_07, gN3_08, gN3_09 } from "./generatorsF1";
import { gN2_04, gN3_11, gN4_01, gN4_02, gN4_05 } from "./generatorsF2";
import { C } from "../components/Mascot";

export interface CurriculumModule {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
}

export const CURRICULUM: CurriculumModule[] = [
  {
    id: "pre",
    name: "Jardim (4 a 5 anos)",
    description: "Despertar o raciocínio numérico, noções espaciais e contagem concreta.",
    tracks: [
      { id: "N1.01", name: "Correspondência 1 a 1", graphId: "N1.01", island: "alfa", icon: "🍎", color: C.pink, dark: C.pinkDark, gen: gN1_01, lvlSkills: ["Até 3", "Até 5"] },
      { id: "N1.02", name: "Canto Numérico", graphId: "N1.02", island: "alfa", icon: "🎤", color: C.pink, dark: C.pinkDark, gen: gN1_02, lvlSkills: ["Ordem até 3", "Ordem até 5", "Ordem até 10", "Ordem Inversa", "Contagem Saltada"] },
      { id: "N1.03", name: "Subitização Perceptual", graphId: "N1.03", island: "alfa", icon: "👁️", color: C.ink, dark: "#101B3D", gen: gN1_03, lvlSkills: ["Até 3 elementos"] },
      { id: "N1.04", name: "Contagem", graphId: "N1.04", island: "alfa", icon: "🔢", color: C.grape, dark: C.grapeDark, gen: gN1_04, lvlSkills: ["Cardinalidade até 5", "Conservação", "Até 10"] },
      { id: "N1.05", name: "Comparar (Visual)", graphId: "N1.05", island: "grand", icon: "⚖️", color: C.ocean, dark: C.oceanDark, gen: gN1_05, lvlSkills: ["Qual tem mais", "Qual tem menos", "Diferença Clara", "Diferença Sutil", "Abstrato (Números)"] },
      { id: "N1.06", name: "Símbolos Numéricos", graphId: "N1.06", island: "alfa", icon: "0️⃣", color: C.ink, dark: "#101B3D", gen: gN1_06, lvlSkills: ["Reconhecer até 3", "Reconhecer até 5", "Reconhecer até 10", "Associar Símbolo/Qtd", "Dojo Símbolos"] },
      { id: "N1.07", name: "Vizinhos", graphId: "N1.07", island: "grand", icon: "➡️", color: C.sun, dark: C.sunDark, gen: gN1_07, lvlSkills: ["Próximo até 5", "Próximo até 10", "Anterior até 5", "Anterior até 10", "Salto e sequências"] },
      { id: "N1.09", name: "Contagem Avançada", graphId: "N1.09", island: "grand", icon: "🚀", color: C.ocean, dark: C.oceanDark, gen: gN1_09, lvlSkills: ["A partir de N", "Até 20"] },
      { id: "AL.01", name: "Qual é o Intruso?", graphId: "AL.01", island: "logica", icon: "🕵️", color: C.ink, dark: "#101B3D", gen: gAL_01, lvlSkills: ["Diferença óbvia", "Categorias fáceis", "Categorias sutis", "Lógica de cor/forma", "Exceção à regra"] },
      { id: "AL.02", name: "Padrões Lógicos", graphId: "AL.02", island: "logica", icon: "🧩", color: C.melon, dark: C.melonDark, gen: gAL_02, lvlSkills: ["Padrão ABAB Cores", "ABAB Formas", "ABCABC", "AABB", "Padrões Lógicos"] },
      { id: "GE.01", name: "Onde Está?", graphId: "GE.01", island: "logica", icon: "🧭", color: C.ocean, dark: C.oceanDark, gen: gGE_01, lvlSkills: ["Em cima / Embaixo", "Dentro / Fora", "Lado", "Esquerda / Direita", "Mapa visual"] },
      { id: "GE.02", name: "Formas Geom.", graphId: "GE.02", island: "logica", icon: "🔷", color: C.mint, dark: C.mintDark, gen: gGE_02, lvlSkills: ["Reconhecer Círculo/Quadrado", "Triângulo", "Atributos visuais", "Formas no dia a dia", "Mistura complexa"] },
      { id: "GM.02", name: "Calendário", graphId: "GM.02", island: "tempo", icon: "📅", color: C.sun, dark: C.sunDark, gen: gGM_02, lvlSkills: ["Dias da semana", "Ontem/Hoje/Amanhã", "Meses", "Ordem cronológica", "Probleminha de tempo"] }
    ]
  },
  {
    id: "ano1",
    name: "1º Ano (6 a 7 anos)",
    description: "Fluência em operações básicas, raciocínio lógico, dezenas e geometria.",
    tracks: [
      { id: "N1.12", name: "Reta Numérica", graphId: "N1.12", island: "num", icon: "🔢", color: C.grape, dark: C.grapeDark, gen: gA1Seq, lvlSkills: ["Vizinhos 1-20", "Ordem crescente", "Ordem decrescente", "Pares e Ímpares", "Reta numérica"] },
      { id: "N3.01", name: "Juntar e Somar (Até 10)", graphId: "N3.01", island: "op", icon: "➕", color: C.pink, dark: C.pinkDark, gen: gPreSoma, lvlSkills: ["Juntar 2 grupos", "Soma + 1", "Soma + 2", "Counting On inicial", "Dojo até 10"] },
      { id: "N3.02", name: "Tirar e Esconder (Até 10)", graphId: "N3.02", island: "op", icon: "➖", color: C.melon, dark: C.melonDark, gen: gPreTirar, lvlSkills: ["Esconder visual", "Diferença até 3", "Tirar 1", "Tirar 2", "Dojo Subtração até 5"] },
      { id: "N1.10", name: "Parte-todo (bonds)", graphId: "N1.10", island: "num", icon: "🔗", color: C.pink, dark: C.pinkDark, gen: gN1_10, lvlSkills: ["Visual", "Achar todo", "Achar parte", "Abstrato", "Dojo"] },
      { id: "N1.11", name: "Amigos do 10", graphId: "N1.11", island: "num", icon: "🔟", color: C.grape, dark: C.grapeDark, gen: gN1_11, lvlSkills: ["Moldura de 10", "Achar parte", "Faltando mental", "Abstrato", "Dojo"] },
      { id: "N3.03", name: "Soma (Counting On)", graphId: "N3.03", island: "op1", icon: "➕", color: C.mint, dark: C.mintDark, gen: gA1Soma, lvlSkills: ["Soma com dedos", "Barras de Singapura", "Amigos do 10", "Counting On Misto", "Dojo de Velocidade"] },
      { id: "N3.04", name: "Subtração Lógica", graphId: "N3.04", island: "op1", icon: "➖", color: C.melon, dark: C.melonDark, gen: gA1Sub, lvlSkills: ["Diferença Visual", "Contar para trás", "Amigos do 10 inversos", "Counting Up", "Dojo de Velocidade"] },
      { id: "N2.01", name: "Dezenas e Unidades", graphId: "N2.01", island: "num", icon: "🧱", color: C.pink, dark: C.pinkDark, gen: gA1Dez, lvlSkills: ["Contar 10", "Formar dezena", "Dezenas puras", "Dezenas + Unidades", "Material Dourado"] },
      { id: "N2.02", name: "Números até 100", graphId: "N2.02", island: "num", icon: "💯", color: C.ocean, dark: C.oceanDark, gen: gN2_02, lvlSkills: ["Dourado", "Identificar", "Compor", "Sequência", "Reta num"] },
      { id: "N2.03", name: "Maior, Menor, Igual", graphId: "N2.03", island: "num", icon: "⚖️", color: C.ocean, dark: C.oceanDark, gen: gA1Comp, lvlSkills: ["Comparar N<10", "Comparar N<30", "Comparar Somas", "Uso do > e <", "Lógica mista"] },
      { id: "N3.05", name: "Família de Fatos", graphId: "N3.05", island: "op1", icon: "👨‍👩‍👧", color: C.mint, dark: C.mintDark, gen: gN3_05, lvlSkills: ["Soma", "Sub", "Bonds", "Abstrato", "Triângulo"] },
      { id: "N3.06", name: "Dobros e Quase", graphId: "N3.06", island: "op1", icon: "🦋", color: C.melon, dark: C.melonDark, gen: gN3_06, lvlSkills: ["Visuais", "Até 10", "Quase-dobros", "Mental", "Dojo"] },
      { id: "N3.07", name: "Fazer 10", graphId: "N3.07", island: "op1", icon: "🚀", color: C.sun, dark: C.sunDark, gen: gN3_07, lvlSkills: ["Moldura 10", "Reta", "Símbolos", "Mental", "Dojo"] },
      { id: "N3.08", name: "Voltar pelo 10", graphId: "N3.08", island: "op1", icon: "🔙", color: C.pink, dark: C.pinkDark, gen: gN3_08, lvlSkills: ["Moldura", "Reta", "Complementar", "Mental", "Dojo"] },
      { id: "N3.09", name: "Soma/Sub s/ Reagrupar", graphId: "N3.09", island: "op1", icon: "🧮", color: C.ocean, dark: C.oceanDark, gen: gN3_09, lvlSkills: ["D+D", "DU+U", "DU+D", "Vertical", "Dojo"] },
      { id: "AL.03", name: "Contar Pulando", graphId: "AL.03", island: "num", icon: "🦘", color: C.sun, dark: C.sunDark, gen: gA1Pular, lvlSkills: ["Pular 2 em 2 (10)", "Pular 2 em 2 (20)", "Pular de 5", "Pular de 10", "Intro à Tabuada"] },
      { id: "GM.03", name: "Sistema Monetário", graphId: "GM.03", island: "real", icon: "💰", color: "#2E8B57", dark: "#1E5E3A", gen: gA1Dinheiro, prereqs: ["N3.03", "N2.01"], lvlSkills: ["Moedas de 1 real", "Conhecer cédulas", "Juntar cédulas", "Notas + moedas", "Centavos"] },
      { id: "GM.04", name: "Lendo as Horas", graphId: "GM.04", island: "real", icon: "⏰", color: C.pink, dark: C.pinkDark, gen: gA1Horas, lvlSkills: ["Ponteiro das horas", "Horas exatas (V)", "Horas exatas (D)", "Meia hora (V)", "Dojo do Tempo"] },
      { id: "N3.10", name: "Probleminhas", graphId: "N3.10", island: "logica1", icon: "🗣️", color: C.grape, dark: C.grapeDark, gen: gA1Problemas, lvlSkills: ["Soma (história)", "Subtração (história)", "Comparação", "Dados irrelevantes", "2 passos"] },
      { id: "PE.01", name: "Ler Gráficos", graphId: "PE.01", island: "logica1", icon: "📊", color: C.sun, dark: C.sunDark, gen: gA1Graficos, lvlSkills: ["Gráfico de blocos", "Barras simples", "Tabela de marcas", "Qual tem mais", "Somar partes"] }
    ]
  },
  {
    id: "ano2",
    name: "2º Ano (7 a 8 anos)",
    description: "Reagrupamento, iniciação à multiplicação e divisão, centenas.",
    tracks: [
      { id: "N2.04", name: "Centena (até 1000)", graphId: "N2.04", island: "num", icon: "💯", color: C.ocean, dark: C.oceanDark, gen: gN2_04, lvlSkills: ["Visual", "Dez", "CDU", "Mental", "Dojo"] },
      { id: "N3.11", name: "Soma c/ Reagrupar", graphId: "N3.11", island: "op1", icon: "➕", color: C.pink, dark: C.pinkDark, gen: gN3_11, lvlSkills: ["Troca mágica", "Material", "Conta armada", "CDU", "Mental"] },
      { id: "N4.01", name: "Grupos Iguais", graphId: "N4.01", island: "op1", icon: "🍎", color: C.melon, dark: C.melonDark, gen: gN4_01, lvlSkills: ["Contar grupos", "Saltos", "Soma", "Montar cena", "Dojo"] },
      { id: "N4.02", name: "Grade Retangular", graphId: "N4.02", island: "op1", icon: "🟦", color: C.grape, dark: C.grapeDark, gen: gN4_02, lvlSkills: ["Contar grade", "Girar (Comutar)", "Triplo", "Decompor", "Dojo"] },
      { id: "N4.05", name: "Divisão Inicial", graphId: "N4.05", island: "op1", icon: "➗", color: C.mint, dark: C.mintDark, gen: gN4_05, lvlSkills: ["Repartir", "Medir", "Escrever", "Resto", "Dojo"] }
    ]
  }
];

export function getTrackById(id: string): Track | undefined {
  for (const mod of CURRICULUM) {
    const t = mod.tracks.find(x => x.id === id);
    if (t) return t;
  }
  return undefined;
}

export const TRACKS_PRE = CURRICULUM.find(m => m.id === 'pre')?.tracks || [];
export const TRACKS_ANO1 = CURRICULUM.find(m => m.id === 'ano1')?.tracks || [];
export const TRACKS_ANO2 = CURRICULUM.find(m => m.id === 'ano2')?.tracks || [];

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
