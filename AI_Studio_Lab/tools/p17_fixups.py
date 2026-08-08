from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {n}x")
    p.write_text(s.replace(old, new))

# O p17_apply original foi escrito antes de vermos o comentário multilinha real.
# Troca a âncora do patch pela propriedade, preservando o comentário da JD3.
p = Path("AI_Studio_Lab/tools/p17_apply.py")
s = p.read_text()
old_anchor = "    '  /** Moldura relâmpago: disse quantas fichas HÁ, não quantas faltam. */\\n',"
new_anchor = "    '  RESPONDE_O_CHEIO: \\\"responde-o-cheio\\\",\\n',"
if s.count(old_anchor) != 1:
    raise SystemExit(f"p17_apply: âncora tag {s.count(old_anchor)}x")
s = s.replace(old_anchor, new_anchor)
old_tail = '  /** Moldura relâmpago: disse quantas fichas HÁ, não quantas faltam. */\n\'\'\','
new_tail = '  RESPONDE_O_CHEIO: "responde-o-cheio",\n\'\'\','
if s.count(old_tail) != 1:
    raise SystemExit(f"p17_apply: cauda tag {s.count(old_tail)}x")
s = s.replace(old_tail, new_tail)
old_l5 = '    5: { primitiva: "bond", micro: "formaliza_bond", andaime: "nenhum" },'
new_l5 = '    5: { primitiva: "bond", micro: "formaliza_bond", andaime: "nenhum", rt_alvo: 8000 },'
if s.count(old_l5) != 1:
    raise SystemExit(f"p17_apply: L5 N1.10 {s.count(old_l5)}x")
p.write_text(s.replace(old_l5, new_l5))

# Executar este script NOVAMENTE depois do p17_apply com --post faz os ajustes
# que só existem nos arquivos gerados.
if __name__ == "__main__":
    import sys
    if "--post" not in sys.argv:
        print("fixups pre-patch preparados")
        raise SystemExit(0)

    # A F28 tem diagnóstico semântico próprio nos builders; não deixar o
    # catálogo genérico n+/-1 recategorizar os distratores específicos.
    replace_once(
        "src/curriculum/fichas/jornada/N1.11.ts",
        '''  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],''',
        "  distratores: [],",
    )

    # Retenção multidimensional: a segunda sessão amadurece como a primeira;
    # uma única questão dois dias depois não pode satisfazer 3/3.
    replace_once(
        "src/curriculum/motores/progressEngine.test.ts",
        '''    const retained = applyJourneyAnswer(current, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).toBe(true);
    expect(retained.progress.masteryEvidence?.crownedBy).toBe("multidimensional");
    expect(retained.transition).toEqual({ type: "multidimensional-crown" });''',
        '''    let retained = applyJourneyAnswer(current, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).not.toBe(true);
    retained = applyJourneyAnswer(retained.progress, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).not.toBe(true);
    retained = applyJourneyAnswer(retained.progress, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).toBe(true);
    expect(retained.progress.masteryEvidence?.crownedBy).toBe("multidimensional");
    expect(retained.transition).toEqual({ type: "multidimensional-crown" });''',
    )
    print("fixups pós-patch aplicados")
