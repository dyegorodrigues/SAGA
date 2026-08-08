import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mapa autoral de fichas para o runtime", () => {
  it("mantém as 26 primitivas declaradas explicitamente mapeadas", () => {
    const auditor = path.resolve(process.cwd(), "AI_Studio_Lab/tools/ficha_catalog_auditor.cjs");
    const output = execFileSync(process.execPath, [auditor], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Primitivas declaradas: 26");
    expect(output).toContain("[MAPA FICHA → RUNTIME]");
    expect(output).toContain("TouchCount: executável");
    expect(output).toContain("Moedas: renderer-sem-builder");
    expect(output).toContain("Recipientes: ausente");
    expect(output).toContain("Regua: ausente");
    expect(output).toContain("[RESULTADO] 92 fichas válidas");
  });
});
