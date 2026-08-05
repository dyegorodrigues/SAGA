export interface StarterCreatureSpec {
  numericId: string;
  name: string;
  emoji: string;
  element: string;
  accent: string;
  softAccent: string;
  description: string;
  defaultNickname: string;
}

export const DEFAULT_CREATURE_ID = "0025";

export const STARTER_CREATURES: readonly StarterCreatureSpec[] = [
  {
    numericId: "0001",
    name: "Bulbasaur",
    emoji: "🌱",
    element: "Natureza",
    accent: "#16A34A",
    softAccent: "#DCFCE7",
    description: "Calmo, curioso e ótimo companheiro para estudar com paciência.",
    defaultNickname: "Broto",
  },
  {
    numericId: "0004",
    name: "Charmander",
    emoji: "🔥",
    element: "Fogo",
    accent: "#EA580C",
    softAccent: "#FFEDD5",
    description: "Animado e corajoso; adora comemorar cada nova conquista.",
    defaultNickname: "Brasa",
  },
  {
    numericId: "0007",
    name: "Squirtle",
    emoji: "💧",
    element: "Água",
    accent: "#0284C7",
    softAccent: "#E0F2FE",
    description: "Brincalhão, concentrado e sempre pronto para uma nova missão.",
    defaultNickname: "Bolha",
  },
  {
    numericId: "0025",
    name: "Pikachu",
    emoji: "⚡",
    element: "Elétrico",
    accent: "#CA8A04",
    softAccent: "#FEF9C3",
    description: "Expressivo e rápido; transforma progresso em energia positiva.",
    defaultNickname: "Faísca",
  },
  {
    numericId: "0133",
    name: "Eevee",
    emoji: "✨",
    element: "Adaptação",
    accent: "#A16207",
    softAccent: "#FEF3C7",
    description: "Versátil e afetuoso; cresce junto com o jeito único de cada criança.",
    defaultNickname: "Lumi",
  },
  {
    numericId: "0447",
    name: "Riolu",
    emoji: "🥋",
    element: "Aura",
    accent: "#2563EB",
    softAccent: "#DBEAFE",
    description: "Disciplinado e parceiro do Dojo; celebra esforço e persistência.",
    defaultNickname: "Aura",
  },
] as const;

export function getStarterCreature(numericId: string): StarterCreatureSpec {
  const normalized = String(numericId).replace(/\D/g, "").padStart(4, "0");
  return STARTER_CREATURES.find((creature) => creature.numericId === normalized) || STARTER_CREATURES[3];
}
