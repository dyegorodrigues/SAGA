from pathlib import Path

ROOT = Path('.')

# Este script roda DEPOIS de f48_repair_candidate.py, ainda só no workspace do
# runner. Ele corrige duas coisas que o primeiro portão descobriu antes de
# qualquer publicação: sintaxe do YAML no teste e discriminação forte F47/F48.

# 1) Teste do grafo: curriculum/GE.yaml é mapa `GE.02:`, não lista `id: GE.02`.
p = ROOT / 'src/curriculum/procedimentos/formaProcedure.test.ts'
s = p.read_text(encoding='utf-8')
s = s.replace('.replace(/\\*\\*/g, "")', '.split("**").join("")')
s = s.replace('expect(GRAFO_GE).toContain("id: GE.02");', 'expect(GRAFO_GE).toContain("GE.02:");')
s = s.replace('expect(GRAFO_GE).toContain("titulo: Formas planas básicas");', 'expect(GRAFO_GE).toContain(\'title: "Formas planas básicas"\');')
s = s.replace('expect(GRAFO_GE).toContain("id: GE.04");', 'expect(GRAFO_GE).toContain("GE.04:");')
s = s.replace('expect(GRAFO_GE).toContain("titulo: Sólidos geométricos");', 'expect(GRAFO_GE).toContain(\'title: "Sólidos geométricos"\');')
p.write_text(s, encoding='utf-8')

# 2) answerPolicy: `shapecanvas` atende duas fichas. Meta sozinho não basta:
# uma chamada errada jamais pode transformar uma cena de posição em F48.
p = ROOT / 'src/components/gameloop/answerPolicy.ts'
s = p.read_text(encoding='utf-8')
anchor = '''export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {\n  if (value === "__timeout__") return false;\n  if (isMotorSlip(meta)) return true;\n  return Boolean(q.options || q.groups || meta?.source);\n}\n'''
helpers = anchor + '''\n/**\n * `shapecanvas` é uma família visual, não uma competência. A discriminação\n * segue exatamente a mesma fronteira do renderer: F48 possui `opcoes`; F47\n * possui `referencial`. Isso impede meta incorreto de sequestrar outra ficha.\n */\nfunction isFormaQuestion(q: Question): boolean {\n  return q.kind === "shapecanvas"\n    && q.uiProps != null\n    && typeof q.uiProps === "object"\n    && "opcoes" in q.uiProps;\n}\n\nfunction isPosicaoQuestion(q: Question): boolean {\n  return q.kind === "shapecanvas"\n    && q.uiProps != null\n    && typeof q.uiProps === "object"\n    && "referencial" in q.uiProps\n    && !("opcoes" in q.uiProps);\n}\n'''
if s.count(anchor) != 1:
    raise SystemExit('answerPolicy: ancora dos helpers mudou')
s = s.replace(anchor, helpers, 1)
s = s.replace(
    '(q.kind === "shapecanvas" && meta?.posicao !== undefined)',
    '(isPosicaoQuestion(q) && meta?.posicao !== undefined)',
)
s = s.replace(
    '(q.kind === "shapecanvas" && meta?.forma !== undefined)',
    '(isFormaQuestion(q) && meta?.forma !== undefined)',
)
s = s.replace(
    'if (q.kind === "shapecanvas" && meta?.posicao !== undefined) {',
    'if (isPosicaoQuestion(q) && meta?.posicao !== undefined) {',
)
s = s.replace(
    'if (q.kind === "shapecanvas" && meta?.forma !== undefined) {',
    'if (isFormaQuestion(q) && meta?.forma !== undefined) {',
)
p.write_text(s, encoding='utf-8')

# 3) Regressão cruzada nos dois sentidos.
p = ROOT / 'src/components/gameloop/formaAuthorialPolicy.test.ts'
s = p.read_text(encoding='utf-8')
old = '''  it("meta de forma não sequestra uma cena de posição", () => {\n    expect(ownsAuthorialRetry(q47, { forma: {} } as any)).toBe(false);\n  });'''
new = '''  it("metadado errado não sequestra a outra ficha da família shapecanvas", () => {\n    expect(ownsAuthorialRetry(q47, { forma: {} } as any)).toBe(false);\n    expect(ownsAuthorialFeedback(q47, { forma: {} } as any)).toBe(false);\n    expect(ownsAuthorialRetry(q48, { posicao: {} } as any)).toBe(false);\n    expect(ownsAuthorialFeedback(q48, { posicao: {} } as any)).toBe(false);\n  });'''
if s.count(old) != 1:
    raise SystemExit('formaAuthorialPolicy: teste cruzado mudou')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

print('F48 candidate fixes applied')
