import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("artefatos derivados do grafo canônico", () => {
  it("permanecem sincronizados com curriculum/grafo_saga.yaml", () => {
    const script = path.resolve(process.cwd(), "scripts/generate-graph-artifacts.cjs");
    const output = execFileSync(process.execPath, [script, "--check"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("Artefatos do grafo sincronizados");
  });
});

