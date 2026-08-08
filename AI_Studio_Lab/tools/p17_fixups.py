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

# ---------------------------------------------------------------------------
# 1. Diagnóstico: manter o comportamento global existente. As fichas parte-todo
#    têm builders semânticos próprios e por isso não precisam do catálogo n+/-1.
# ---------------------------------------------------------------------------
replace_once(
    "src/curriculum/Composer.ts",
    '''  return options.map(option => {
    // O builder pode conhecer uma hipotese mais especifica que n+/-1. O
    // generico nunca apaga esse diagnostico.
    if (option.misconception) return option;
    const tag = typeof option.value === "number" ? taggedValues.get(option.value) : undefined;
    return tag ? { ...option, misconception: tag } : option;
  });''',
    '''  return options.map(option => {
    const tag = typeof option.value === "number" ? taggedValues.get(option.value) : undefined;
    return tag ? { ...option, misconception: tag } : option;
  });''',
)

for ficha_path in [
    "src/curriculum/fichas/jornada/N1.10.ts",
    "src/curriculum/fichas/jornada/N1.11.ts",
]:
    replace_once(
        ficha_path,
        '''  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],''',
        "  distratores: [],",
    )

# O Map preserva a ÚLTIMA ocorrência; diagnóstico específico precisa vencer.
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

# ---------------------------------------------------------------------------
# 2. MasteryRule é contrato NOVO, mas domínio era opcional em fixtures/fichas
#    antigas. Só anexar a regra quando a micro realmente a declara.
# ---------------------------------------------------------------------------
replace_once(
    "src/curriculum/Composer.ts",
    '''      masteryRule: {
        acertos: micro.dominio.acertos,
        de: micro.dominio.de,
        sessoes: micro.dominio.sessoes,
      },''',
    '''      ...(micro.dominio ? {
        masteryRule: {
          acertos: micro.dominio.acertos,
          de: micro.dominio.de,
          sessoes: micro.dominio.sessoes,
        },
      } : {}),''',
)

# Retenção multidimensional: a segunda sessão amadurece como a primeira.
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

# ---------------------------------------------------------------------------
# 3. Testes da moldura: N1.11 L3-L5 já NÃO pertencem ao palco da moldura.
#    A trilha JD3 do Jardim é a dona da escada perceptual completa.
# ---------------------------------------------------------------------------
p = Path("src/components/primitives/MolduraStage.test.tsx")
s = p.read_text()
s = s.replace(
    'import { N1_11 } from "../../curriculum/fichas/jornada/N1.11";\n',
    'import { N1_11 } from "../../curriculum/fichas/jornada/N1.11";\nimport { JD3 } from "../../curriculum/fichas/dojo/jardim";\n',
)
s = s.replace(
    'for (const [ficha, nivel] of [[N1_11, 1], [N1_11, 5], [N1_08, 4]] as const) {',
    'for (const [ficha, nivel] of [[N1_11, 1], [N1_11, 2], [JD3, 5], [N1_08, 4]] as const) {',
)
s = s.replace(
    '<MolduraStage spec={spec(N1_11, 5)} onAnswer={onAnswer} fase="perguntando" />);',
    '<MolduraStage spec={spec(JD3, 5)} onAnswer={onAnswer} fase="perguntando" />);',
)
s = s.replace(
    'for (const [ficha, nivel] of [[N1_08, 3], [N1_08, 5], [N1_10, 4], [N1_11, 5]] as const) {',
    'for (const [ficha, nivel] of [[N1_08, 3], [N1_08, 5], [N1_10, 4], [N1_11, 2], [JD3, 5]] as const) {',
)
s = s.replace(
    '''      [N1_08, 3], [N1_08, 4], [N1_08, 5], [N1_10, 1], [N1_10, 4], [N1_10, 5],
      [N1_11, 1], [N1_11, 3], [N1_11, 5],''',
    '''      [N1_08, 3], [N1_08, 4], [N1_08, 5], [N1_10, 1], [N1_10, 4],
      [N1_11, 1], [N1_11, 2], [JD3, 3], [JD3, 5],''',
)
p.write_text(s)

# ---------------------------------------------------------------------------
# 4. Jardim agora é polimórfico: JD1/JD2 usam fileira, JD3/JD5 usam moldura.
#    O teste deve validar a primitiva declarada e a resposta executável.
# ---------------------------------------------------------------------------
p = Path("src/curriculum/fichas/dojo/jardim/jardim.test.ts")
s = p.read_text()
s = s.replace(
    'import { JARDIM, JD1, JD2 } from "./index";',
    'import { JARDIM, JD1, JD2, JD3, JD5 } from "./index";',
)
s = s.replace(
    'import { configuracaoDaMao, quantidadeDaMao } from "../../../procedimentos/emojiRowProcedure";\n',
    'import { configuracaoDaMao, quantidadeDaMao } from "../../../procedimentos/emojiRowProcedure";\nimport { MolduraSpec } from "../../../procedimentos/tenFrameContract";\n',
)
old_test = '''  it("cada trilha gera questão nos CINCO níveis", () => {
    for (const { ficha } of JARDIM) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const q = Composer.generate(ficha, nivel);
        expect(q.kind, `${ficha.id} n${nivel}`).toBe("fileira");
        expect(q.options?.length, `${ficha.id} n${nivel}`).toBeGreaterThanOrEqual(2);
      }
    }
  });'''
new_test = '''  it("cada trilha gera questão executável nos CINCO níveis, na sua própria primitiva", () => {
    for (const { ficha } of JARDIM) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const q = Composer.generate(ficha, nivel);
        expect(q.kind, `${ficha.id} n${nivel}`).toBe(ficha.niveis[nivel].primitiva);
        expect(q.evaluate(q.answer), `${ficha.id} n${nivel} responde`).toBe(true);
        if (q.kind === "fileira") {
          expect(q.options?.length, `${ficha.id} n${nivel}`).toBeGreaterThanOrEqual(2);
        } else if (q.kind === "moldura") {
          expect((q.uiProps as MolduraSpec).alternativas.length, `${ficha.id} n${nivel}`)
            .toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it("JD3 preserva o vazio disperso no topo e JD5 preserva a etapa sem moldura", () => {
    const jd3 = Composer.generate(JD3, 5).uiProps as MolduraSpec;
    const jd5 = Composer.generate(JD5, 5).uiProps as MolduraSpec;
    expect(jd3.disperso).toBe(true);
    expect(jd5.molduraVisivel).toBe(false);
  });'''
if s.count(old_test) != 1:
    raise SystemExit(f"jardim.test: teste-base {s.count(old_test)}x")
s = s.replace(old_test, new_test)
p.write_text(s)

print("fixups pós-patch aplicados")
