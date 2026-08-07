from pathlib import Path

ROOT = Path('.')

# Este script roda DEPOIS de f48_repair_candidate.py, ainda só no workspace do
# runner. Ele corrige descobertas dos portões antes de qualquer publicação:
# sintaxe do YAML no teste, discriminação forte F47/F48 e a leitura visual dos
# lados em rotações específicas.

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

# 4) Chromium/8 sementes encontrou rótulos de lados cobertos em giros extremos.
# A primeira tentativa de elevar stacking-context não bastou: o problema era a
# própria numeração girar junto com a figura. Pedagogicamente, a leitura mais
# forte é o oposto: A FIGURA gira, mas a CONTAGEM permanece estável. Os badges
# ficam na periferia segura do contêiner e não rodam; a criança vê 1-2-3/4 em
# qualquer orientação sem o desenho esconder os números.
p = ROOT / 'src/components/primitives/FormaStage.tsx'
s = p.read_text(encoding='utf-8')
old_positions = '''const MARCADORES: Record<Forma, Array<{ left: string; top: string }>> = {\n  circulo: [],\n  triangulo: [\n    { left: "50%", top: "8%" },\n    { left: "18%", top: "70%" },\n    { left: "82%", top: "70%" },\n  ],\n  quadrado: [\n    { left: "50%", top: "9%" },\n    { left: "88%", top: "50%" },\n    { left: "50%", top: "88%" },\n    { left: "12%", top: "50%" },\n  ],\n  retangulo: [\n    { left: "50%", top: "18%" },\n    { left: "88%", top: "50%" },\n    { left: "50%", top: "82%" },\n    { left: "12%", top: "50%" },\n  ],\n};'''
new_positions = '''const MARCADORES: Record<Forma, Array<{ left: string; top: string }>> = {\n  circulo: [],\n  triangulo: [\n    { left: "50%", top: "6%" },\n    { left: "8%", top: "88%" },\n    { left: "92%", top: "88%" },\n  ],\n  quadrado: [\n    { left: "50%", top: "6%" },\n    { left: "94%", top: "50%" },\n    { left: "50%", top: "94%" },\n    { left: "6%", top: "50%" },\n  ],\n  retangulo: [\n    { left: "50%", top: "6%" },\n    { left: "94%", top: "50%" },\n    { left: "50%", top: "94%" },\n    { left: "6%", top: "50%" },\n  ],\n};'''
if s.count(old_positions) != 1:
    raise SystemExit('FormaStage: mapa de marcadores mudou')
s = s.replace(old_positions, new_positions, 1)
old_layer = '''      className="pointer-events-none absolute inset-0"\n      style={{ transform: `rotate(${giro}deg)`, transformOrigin: "center" }}'''
new_layer = '''      className="pointer-events-none absolute inset-0"\n      style={{ zIndex: 60 }}'''
if s.count(old_layer) != 1:
    raise SystemExit('FormaStage: camada de marcadores mudou')
s = s.replace(old_layer, new_layer, 1)
old_badge = '''          className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow"\n          style={p}'''
new_badge = '''          className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-black text-white shadow"\n          style={{ ...p, zIndex: 70 }}'''
if s.count(old_badge) != 1:
    raise SystemExit('FormaStage: badge de marcador mudou')
s = s.replace(old_badge, new_badge, 1)
old_style = 'padding: 0,\n                }}'
new_style = 'padding: 0,\n                  zIndex: mostraLados ? 20 : undefined,\n                }}'
if s.count(old_style) != 1:
    raise SystemExit('FormaStage: style do botão mudou')
s = s.replace(old_style, new_style, 1)
# O parâmetro de giro continua no contrato do componente porque a figura usa o
# mesmo dado; a camada de números deliberadamente não usa o giro.
s = s.replace(
    'function MarcadoresDeLados({ forma, giro }: { forma: Forma; giro: number }) {',
    'function MarcadoresDeLados({ forma, giro: _giro }: { forma: Forma; giro: number }) {',
    1,
)
p.write_text(s, encoding='utf-8')

print('F48 candidate fixes applied')
