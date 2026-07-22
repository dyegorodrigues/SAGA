import { ThemeConfig } from "../../types";

export const BODY_COLORS: Record<string, string> = {
  classico: "#C4B5FD",          // Purple
};

export const THEME_EMOJIS: Record<string, string> = {
  classico: "🥋",
};

export const PRAISE = [
  "Incrível! Você tem superpoderes matemáticos! ⚡",
  "Super acerto! Você é o herói do dia! 💥",
  "Uau! Você salvou o dia com essa inteligência brilhante! 🦸",
  "Parabéns! Que força mental incrível! 💪",
  "Espetacular! Você brilha mais que o sol! 🌟"
];

export const EMO = ["🌟", "🔥", "🚀", "💎", "⚡", "✨", "🎯", "👑", "🌈", "⭐"];

export const THEMES: Record<string, ThemeConfig> = {
  classico: { 
    nome: "Dojo", 
    icon: "🥋", 
    emojis: EMO, 
    praise: PRAISE, 
    bg: ["#E4F0FF", "#F1F7FF"], 
    burst: ["⭐", "✨", "🎉", "💛", "🌟"] 
  }
};
