import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mapa autoral de fichas para o runtime", () => {
  it("mantém o vocabulário canônico completo e todas as primitivas mapeadas sem inferência", () => {
    const auditor = path.resolve(process.cwd(), "AI_Studio_Lab/tools/ficha_catalog_auditor.cjs");
    const output = execFileSync(process.execPath, [auditor], { cwd: process.cwd(), encoding: "utf8" });
    expect(output).toContain("Primitivas declaradas: 26");
    expect(output).toContain("[MAPA FICHA → RUNTIME]");
    for (const primitive of ["ArrayGrid", "InteractiveNumberLine", "InteractiveVertical", "Quadrado100", "ShapeCanvas", "SingaporeBars", "MaterialDourado", "TenFrame"]) {
      expect(output, primitive).toContain(`- ${primitive}: executável`);
    }
    expect(output).toContain("Quadrado100: executável");
    expect(output).toContain("decimos-centesimos-f75");
    expect(output).toContain("special:N6.01");
    // A `Moedas` era a última primitiva com renderer e sem builder — o
    // vocabulário existia e o componente não, e o `money` era um kind órfão
    // apontando para decoração do mascote. Com a F53/GM.03 ela ganhou
    // componente, builder especializado e palco: passou a executável, e o
    // repositório ficou sem nenhuma primitiva pela metade.
    expect(output).toContain("Moedas: executável");
    expect(output).toContain("- executável: 26");
    expect(output).toContain("- renderer-sem-builder: 0");
    expect(output).toContain("- componente-isolado: 0");
    expect(output).toContain("- ausente: 0");
    expect(output).toContain("[RESULTADO]");
    expect(output).toContain("fichas válidas, nove seções presentes");
  });
});
