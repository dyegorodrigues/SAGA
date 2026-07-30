import { describe, it, expect } from "vitest";
import { planAula, composeAula, buildAulaTrack, getAulaTotal } from "../curriculum/motores/composer";
import { Track, Progress } from "../types";

/** trilha-fantasma: toda questão assina o id da trilha no prompt (rastreável) */
const trk = (id: string, graphId: string = ""): Track =>
  ({
    id,
    name: id,
    graphId,
    icon: "🔹",
    color: "#000",
    dark: "#000",
    prereqs: [],
    gen: (lvl: number) => ({
      kind: "plain",
      prompt: id,
      big: `${id}-${lvl}`,
      options: [{ value: 1 }, { value: 2 }, { value: 3 }],
      answer: 1,
    }),
  } as Track);

const P0: Progress = { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
const prog = (over: Partial<Progress>): Progress => ({ ...P0, ...over });
const progOfMap = (m: Record<string, Progress>) => (id: string) => m[id] || { ...P0 };

const TRACKS_BASE = [
  trk("t1", "N1.01"),
  trk("t2", "N1.02"),
];
const M_BASE = {
  t1: prog({ dom: true }),
  t2: prog({ dom: true })
};

describe("Compositor da Minha Aula 📚 (E2 do Professor Mágico)", () => {
  it("criança NOVA: 10 questões válidas, abre pela 1ª trilha sem pré-requisito", () => {
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("soma", "N1.05"), trk("padroes", "AL.01")];
    const { qs, plan } = composeAula(tracks, progOfMap({ ...M_BASE }));
    expect(qs.length).toBe(getAulaTotal());
    for (const q of qs) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.some((o: any) => o.value === q.answer)).toBe(true);
    }
    // warmup is t1 or t2 because they are the first without prereqs (since they are in TRACKS_BASE)
    // Actually warmup logic defaults to one of the basics. If not found, tracks[0] which is t1.
    expect(plan.aquecimento!.id).toBe("t1");
    
    // fronteira should NOT be N1.05 (soma) because N1.04 (contar) is NOT practiced, so contar should be fronteira (fresh)
    expect(plan.fronteira!.id).toBe("contar");
  });

  it("FRONTEIRA = a mais fraca praticada com fundamentos ok; prereq trava mesmo", () => {
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("soma", "N1.05"), trk("sub", "PE.01")];
    const m = {
      ...M_BASE,
      contar: prog({ tot: 20, ok: 19, maxLvl: 4, dom: true, lvl: 4 }), // dominada
      soma: prog({ tot: 12, ok: 5, maxLvl: 2, lvl: 2 }), // fraca, prereq ok (contar) → FRONTEIRA
      sub: prog({ tot: 10, ok: 2, maxLvl: 1, lvl: 1 }), // pior ainda, MAS prereq (soma) não dominada
    };
    const { plan } = composeAula(tracks, progOfMap(m));
    expect(plan.fronteira!.id).toBe("soma");
    // warmup should be contar because best acc and tot >= 4
    expect(plan.aquecimento!.id).toBe("contar");
  });

  it("tudo dominado → fronteira vira conteúdo NOVO (nunca praticado com prereqs ok)", () => {
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("soma", "N1.05"), trk("dezenas", "PE.01")];
    const m = {
      ...M_BASE,
      contar: prog({ tot: 30, ok: 29, maxLvl: 5, dom: true, lvl: 5 }),
      soma: prog({ tot: 30, ok: 28, maxLvl: 5, dom: true, lvl: 5 }),
    };
    const { plan } = composeAula(tracks, progOfMap(m));
    // dezenas is PE.01 which requires N1.04 and N1.05. Both are dom: true.
    expect(plan.fronteira!.id).toBe("dezenas");
  });

  it("RESGATE prioriza banco de erros e a trilha mais FRIA (lastDay mais antigo)", () => {
    const bankQ = { kind: "plain", prompt: "erro-antigo", options: [{ value: 1 }, { value: 2 }], answer: 1 };
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("vizinhos", "N1.07"), trk("padroes", "AL.01")];
    const m = {
      ...M_BASE,
      contar: prog({ tot: 10, ok: 9, lastDay: "2026-07-17", maxLvl: 3, dom: true, bank: [{ sig: "s", hits: 0, q: bankQ as any }] }),
      vizinhos: prog({ tot: 10, ok: 8, lastDay: "2026-07-01", maxLvl: 2 }), // a mais FRIA (mas não a mais fraca)
      padroes: prog({ tot: 10, ok: 5, lastDay: "2026-07-10", maxLvl: 2 }), // a mais fraca → FRONTEIRA
    };
    const { qs, plan } = composeAula(tracks, progOfMap(m));
    expect(plan.fronteira!.id).toBe("padroes");
    // a fria vira resgate (a fronteira nunca conta como resgate)
    expect(plan.resgates.find((r) => !r.fromBank)?.track.id).toBe("vizinhos");
    // o erro do banco aparece na aula (o passado nunca se perde)
    expect(qs.some((q) => q.prompt === "erro-antigo")).toBe(true);
  });

  it("FECHO lúdico fecha a aula quando existe trilha divertida", () => {
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("soma", "N1.05"), trk("padroes", "AL.01")];
    const m = { ...M_BASE, contar: prog({ tot: 10, ok: 9, maxLvl: 3, dom: true }), soma: prog({ tot: 6, ok: 3 }) };
    const { qs, plan } = composeAula(tracks, progOfMap(m));
    expect(plan.fecho!.id).toBe("padroes");
    expect(qs[qs.length - 1].prompt).toBe("padroes");
    expect(plan.resumo).toContain("soma");
  });

  it("buildAulaTrack entrega trilha sintética que serve as questões NA ORDEM", () => {
    const tracks = [...TRACKS_BASE, trk("contar", "N1.04"), trk("padroes", "AL.01")];
    const { track } = buildAulaTrack(tracks, progOfMap({ ...M_BASE }));
    expect(track.id).toBe("aula");
    expect(track.totalQ).toBe(getAulaTotal());
    const seen: string[] = [];
    for (let i = 0; i < getAulaTotal(); i++) seen.push(track.gen(1).prompt);
    expect(seen[0]).toBe("t1");
    expect(seen.length).toBe(getAulaTotal());
  });

  it("planAula é barato e nunca explode com listas vazias", () => {
    expect(() => planAula([], () => ({ ...P0 }))).not.toThrow();
    const plan = planAula([], () => ({ ...P0 }));
    expect(plan.resumo.length).toBeGreaterThan(0);
  });
});
