import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./index";

const JOURNEY_DIR = path.resolve(process.cwd(), "src/curriculum/fichas/jornada");
const COMPETENCE_ID = /\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/;

function journeyIdsOnDisk(): string[] {
  return fs.readdirSync(JOURNEY_DIR)
    .filter(file => file.endsWith(".ts") && !file.endsWith(".test.ts"))
    .map(file => fs.readFileSync(path.join(JOURNEY_DIR, file), "utf8").match(COMPETENCE_ID)?.[1])
    .filter((id): id is string => Boolean(id))
    .sort((a, b) => a.localeCompare(b));
}

describe("registry administrativo das fichas de Jornada", () => {
  it("espelha exatamente as fichas de competência existentes no disco", () => {
    const diskIds = journeyIdsOnDisk();
    const registryIds = JOURNEY_FICHAS.map(ficha => ficha.id).sort((a, b) => a.localeCompare(b));

    expect(new Set(diskIds).size, "há IDs de Jornada duplicados no disco").toBe(diskIds.length);
    expect(new Set(registryIds).size, "há IDs duplicados em JOURNEY_FICHAS").toBe(registryIds.length);
    expect(registryIds).toEqual(diskIds);
  });
});
