import { gN1_01, gN1_07 } from "./src/utils/generators";
import { gN1_11 } from "./src/utils/generatorsF1";

console.log("=========================================");
console.log("PADRÃO OURO DE 3 COMPETÊNCIAS (N1.01, N1.07, N1.11)");
console.log("Abaixo está a saída EXATA e LITERAL gerada para todos os 5 níveis.");
console.log("=========================================\n");

const toInspect = [
  { id: "N1.01 (Correspondência 1-a-1 - Exceção Perceptual)", gen: gN1_01 },
  { id: "N1.07 (Sucessor - Reta para Símbolo)", gen: gN1_07 },
  { id: "N1.11 (Amigos do 10 - Moldura para Bond para Símbolo)", gen: gN1_11 }
];

for (const comp of toInspect) {
  console.log(`\n>>> COMPETÊNCIA: ${comp.id}`);
  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = comp.gen(lvl);
    console.log(`\n--- Nível ${lvl} ---`);
    console.log(`Kind:        ${q.kind}`);
    console.log(`Exceção CPA: ${q.excecaoCPA || "Nenhuma (Segue CPA Rigoroso)"}`);
    console.log(`Prompt:      ${q.prompt}`);
    console.log(`AudioPrompt: ${q.audioPrompt}`);
    console.log(`HowTo (Dica):${q.howto}`);
    console.log(`Explain:     ${q.explain}`);
    if (q.tutorial) {
      console.log(`Tutorial (Mão Fantasma):`);
      q.tutorial.forEach((t: any, i: number) => {
        let showStr = t.show ? JSON.stringify(t.show) : "";
        console.log(`  Passo ${i+1}: say="${t.say}" show="${showStr}"`);
      });
    } else {
      console.log(`Tutorial (Mão Fantasma): Nenhum (Andaime Faded)`);
    }
  }
}
