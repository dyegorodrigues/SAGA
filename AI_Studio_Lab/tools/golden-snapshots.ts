// golden-snapshots.ts
import fs from "fs";
import path from "path";

// Simple seeded PRNG
let seed = 12345;
const random = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
Math.random = random;

// Read all exports from src/utils/generators.ts and src/utils/generatorsF1.ts
// For now, we will just import them explicitly or dynamically.
import * as g1 from "../../src/utils/generators";
import * as g2 from "../../src/utils/generatorsF1";

const allGenerators = { ...g1, ...g2 };

const snapshots: any = {};

for (const [name, fn] of Object.entries(allGenerators)) {
  if (name.startsWith("g") && typeof fn === "function") {
    snapshots[name] = [];
    for (let lvl = 1; lvl <= 5; lvl++) {
      // Reset seed for consistency per level
      seed = 12345 + lvl;
      try {
        const q = (fn as any)(lvl);
        snapshots[name].push(q);
      } catch (e: any) {
        snapshots[name].push({ error: e.message });
      }
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, "../snapshots.json"),
  JSON.stringify(snapshots, null, 2)
);
console.log("Snapshots dourados gerados em AI_Studio_Lab/snapshots.json");
