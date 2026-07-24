import { Question, Progress } from "../../types";
// Importar a primitiva e o tema (skin) que será usado
import { DragGroup } from "../components/DragGroup"; 

/**
 * ============================================================================
 * TEMPLATE PADRÃO SAGA PARA GERADORES DE QUESTÃO (KIND)
 * ============================================================================
 * Todos os geradores (F0, F1, N2, etc.) DEVEM seguir esta estrutura.
 * 
 * Regras do Contrato:
 * 1. O Estado Final define o sucesso (sem reprovação imediata por misclick).
 * 2. Crianças pequenas (F0/F1) não devem perder estrelas por toques acidentais.
 * 3. Falas de áudio devem ser mapeadas nos campos `audioPrompt` e `audioSteps`.
 * 4. Misconceptions devem estar mapeadas nas `options` ou no injetor de erros.
 * ============================================================================
 */

export const generateTemplateKind = (
  lvl: number, 
  prog: Progress,
  isFallback = false
): Question => {
  // 1. DIFICULDADE (Baseada no LVL 1-5)
  // Lvl 1: Até 3 elementos
  // Lvl 2: Até 5 elementos
  // Lvl 5: Até 10 elementos, distratores próximos
  const maxItems = lvl <= 2 ? 3 : lvl <= 4 ? 5 : 10;
  
  // 2. LÓGICA MATEMÁTICA PURA (A primitiva)
  const targetNumber = Math.floor(Math.random() * maxItems) + 1;
  const distractor1 = targetNumber + 1;
  const distractor2 = Math.max(1, targetNumber - 1);

  // 3. SELEÇÃO DO TEMA / SKIN (Contexto visual)
  const themes = ["pirate_balloons", "farmer_apples", "space_stars"];
  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

  // 4. FALAS E ÁUDIO (Pipeline de Áudio TTS/Gravado)
  // Como a criança (F0/F1) não lê, o áudio dita a ação.
  const audioPrompt = `Me dê ${targetNumber} balões!`; 
  // audioSteps seria usado no formato Aulinha (ex: "Um!", "Dois!")
  const audioSteps = Array.from({length: targetNumber}, (_, i) => `${i + 1}!`);

  return {
    isFallback,
    kind: "template_produce_qty", // Identificador único da mecânica (primitiva)
    
    // Instrução textual (secundária para F0/F1, lida pelos pais)
    prompt: `Coloque ${targetNumber} itens no cesto.`,
    
    // Injeção do Tema
    big: selectedTheme, 
    
    // A resposta correta exata esperada pelo motor
    answer: targetNumber, 
    
    // Áudio
    audioPrompt,
    audioSteps,
    
    // Dica se errar (Camada 1)
    explain: `Lembre de contar um por um: ${audioSteps.join(", ")}`,
    
    // Opções (se for de múltipla escolha) com Tags de Misconception
    options: [
      { value: targetNumber, label: `${targetNumber}` },
      { 
        value: distractor1, 
        label: `${distractor1}`, 
        tag: "off-by-one-high", // Erro clássico de contagem
        say: `${distractor1} balões` 
      },
      { 
        value: distractor2, 
        label: `${distractor2}`, 
        tag: "off-by-one-low",
        say: `${distractor2} balões` 
      }
    ].sort(() => Math.random() - 0.5) // Embaralhar
  };
};
