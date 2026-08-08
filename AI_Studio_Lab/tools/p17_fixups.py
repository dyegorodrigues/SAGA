from pathlib import Path
import sys


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {n}x")
    p.write_text(s.replace(old, new))


if "--post" not in sys.argv:
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
    print("fixups pre-patch preparados")
    raise SystemExit(0)

# O Map construído de pares [valor, opção] preserva a ÚLTIMA ocorrência. Isso
# é errado para diagnóstico: se 10 já significa RESPONDE_O_TODO e também cai
# por coincidência em n+1, a hipótese específica deve vencer. Deduplica mantendo
# a PRIMEIRA ocorrência. Há dois builders novos com a mesma linha (bond/plain).
p = Path("src/curriculum/Composer.ts")
s = p.read_text()
old = '''options = [...new Map(candidatos.map(o => [String(o.value), o])).values()]
            .slice(0, 4)'''
new = '''options = candidatos
            .filter((opcao, indice) => candidatos.findIndex(item => String(item.value) === String(opcao.value)) === indice)
            .slice(0, 4)'''
if s.count(old) != 2:
    raise SystemExit(f"Composer: deduplicação esperada 2x, encontrada {s.count(old)}x")
p.write_text(s.replace(old, new))

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
