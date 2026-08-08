import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P20 — contrato de isolamento de conta", () => {
  it("App não volta a persistir produção na chave global", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain("stateKeyForUid(uid)");
    expect(app).not.toMatch(/setStorage\(\s*["']mk-state-v1["']/);
  });

  it("login success não instala default/cloud antes do bootstrap", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    const match = app.match(/const handleLoginSuccess[\s\S]*?\n  };/);
    expect(match?.[0]).toBeTruthy();
    expect(match?.[0]).not.toContain("persist(");
    expect(match?.[0]).not.toContain("defaultState(");
  });

  it("upgrade Google usa linkWithPopup quando existe usuário anônimo", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toMatch(/anonymous[\s\S]*?linkWithPopup\(anonymous, googleProvider\)/);
  });

  it("save cloud verifica o UID que originou o trabalho", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toContain("expectedUid && user.uid !== expectedUid");
  });

  it("troca de auth cancela apenas o trabalho do UID anterior", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain("authUidRef.current !== nextUid");
    expect(app).toContain("nuvem.cancelarPendencia()");
  });
});
