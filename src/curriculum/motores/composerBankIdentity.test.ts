import { afterEach, describe, expect, it, vi } from "vitest";
import type { Progress, Question, Track } from "../../types";
import type { AulaQuestion } from "./aulaProgressContext";
import { composeAula } from "./composer";

const question = (prompt: string): Question => ({
  kind: "plain",
  prompt,
  options: [{ label: "1", value: 1 }, { label: "2", value: 2 }],
  answer: 1,
});

const track = (id: string, graphId: string): Track => ({
  id,
  graphId,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  prereqs: [],
  gen: () => question(`gerada-${id}`),
});

const progress = (bankPrompt: string): Progress => ({
  lvl: 3,
  maxLvl: 3,
  dom: true,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 8,
  tot: 8,
  bank: [{ sig: `sig-${bankPrompt}`, hits: 0, q: question(bankPrompt) }],
  mast: 0,
});

afterEach(() => vi.restoreAllMocks());

describe("Aula composta — identidade do banco de erros", () => {
  it("um resgate error-bank serve item do MESMO source e preserva identidade de review", () => {
    const a = track("A", "N1.01");
    const b = track("B", "N1.02");
    const byId: Record<string, Progress> = {
      A: progress("bank-A"),
      B: progress("bank-B"),
    };

    // Com dois itens, 0.99 mantém [A,B] no shuffle. Um pop global devolveria B,
    // embora planAula tenha escolhido A como o primeiro bankTrack.
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const { plan, qs } = composeAula([a, b], id => byId[id]);
    const rescue = plan.resgates.find(item => item.reason === "error-bank");
    expect(rescue?.track.id).toBe("A");

    const bankQuestions = qs.filter(q => q.prompt === "bank-A" || q.prompt === "bank-B") as AulaQuestion[];
    expect(bankQuestions).toHaveLength(1);
    expect(bankQuestions[0].prompt).toBe("bank-A");
    expect(bankQuestions[0].sourceTrackId).toBe("A");
    expect(bankQuestions[0].sourceGraphId).toBe("N1.01");
    expect(bankQuestions[0].review).toBe(true);
    expect(bankQuestions[0].sig).toBe("sig-bank-A");
  });
});
