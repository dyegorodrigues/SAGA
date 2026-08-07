from pathlib import Path

# ---------------------------------------------------------------------------
# Auditor curricular: 90 nós + invariantes semânticos GM.12.
# ---------------------------------------------------------------------------
p = Path('AI_Studio_Lab/tools/catalog_auditor.cjs')
s = p.read_text(encoding='utf-8')

old = '''// 88 até ago/2026. A P12 separou "produzir quantidade" (F04) de "contar até\n// 20": duas competências disputavam a N1.09, e quatro arestas do grafo\n// dependiam do segundo significado. A F04 ganhou a N1.13. Ver §15.8 da Bíblia.\nconst EXPECTED_COMPETENCIES = 89;'''
new = '''// 88 no fechamento da reconciliação original. A P12 criou N1.13 ao separar\n// “produzir quantidade” de “contar até 20” (89). A auditoria P15 criou GM.12\n// ao separar massa/capacidade de GM.02 (tempo) e GM.05 (unidades) (90).\n// Ver Bíblia v3.3 e DECISAO_P15_F50.md.\nconst EXPECTED_COMPETENCIES = 90;'''
if s.count(old) != 1:
    raise SystemExit('catalog_auditor: bloco EXPECTED_COMPETENCIES mudou')
s = s.replace(old, new, 1)

anchor = '''for (const rejectedId of REJECTED_DUPLICATE_IDS) {\n  check(!yamlIdSet.has(rejectedId), `${rejectedId} foi rejeitado por duplicação e reapareceu no grafo`);\n}\n'''
addition = anchor + '''\n// P15/GM.12: não basta contar 90. Protegemos a SEMÂNTICA da separação para\n// impedir que uma edição futura recicle um ID ocupado e volte a mascarar nós.\nconst gm01 = yamlNodes.find((node) => node.id === "GM.01");\nconst gm02 = yamlNodes.find((node) => node.id === "GM.02");\nconst gm05 = yamlNodes.find((node) => node.id === "GM.05");\nconst gm12 = yamlNodes.find((node) => node.id === "GM.12");\ncheck(Boolean(gm01), "GM.01 ausente — comparação direta é a base de grandezas");\ncheck(Boolean(gm12), "GM.12 ausente — F50 precisa de nó próprio para massa/capacidade");\ncheck(gm02?.nome === "Tempo cotidiano", "GM.02 foi sequestrado: deve continuar Tempo cotidiano");\ncheck(\n  JSON.stringify(gm12?.prereqs || []) === JSON.stringify(["GM.01"]),\n  `GM.12 deve depender apenas de GM.01; recebeu ${JSON.stringify(gm12?.prereqs || [])}`\n);\ncheck(\n  JSON.stringify(gm05?.prereqs || []) === JSON.stringify(["GM.12", "N2.02"]),\n  `GM.05 deve depender de GM.12 + N2.02; recebeu ${JSON.stringify(gm05?.prereqs || [])}`\n);\n'''
if s.count(anchor) != 1:
    raise SystemExit('catalog_auditor: âncora REJECTED_DUPLICATE_IDS mudou')
s = s.replace(anchor, addition, 1)

s = s.replace('/as 89 competências:/', '/as 90 competências:/')
s = s.replace('/\\*\\*Total: 89 competências\\.\\*\\*/', '/\\*\\*Total: 90 competências\\.\\*\\*/')
if 'as 89 competências:' in s or 'Total: 89 competências' in s:
    raise SystemExit('catalog_auditor: ainda há invariante vivo de 89 competências')
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# Auditor de fichas: Recipientes é uma dívida NOVA e proposital. A igualdade
# exata desta lista força a remoção assim que o componente real for construído.
# ---------------------------------------------------------------------------
p = Path('src/curriculum/conformidadeDeFichas.test.ts')
s = p.read_text(encoding='utf-8')
old = 'export const PRIMITIVAS_PENDENTES = ["Moedas", "Regua"];'
new = 'export const PRIMITIVAS_PENDENTES = ["Moedas", "Recipientes", "Regua"];'
if s.count(old) != 1:
    raise SystemExit('conformidadeDeFichas: PRIMITIVAS_PENDENTES mudou')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# ---------------------------------------------------------------------------
# Contrato do mapa autoral: agora são 26 primitivas declaradas e Recipientes
# precisa aparecer explicitamente como AUSENTE até a implementação F50. O teste
# não pode congelar a contagem anterior nem deixar a dívida desaparecer.
# ---------------------------------------------------------------------------
p = Path('src/curriculum/fichaRuntimeMap.test.ts')
s = p.read_text(encoding='utf-8')
old = '''  it("mantém as 25 primitivas declaradas explicitamente mapeadas", () => {'''
new = '''  it("mantém as 26 primitivas declaradas explicitamente mapeadas", () => {'''
if s.count(old) != 1:
    raise SystemExit('fichaRuntimeMap: título com 25 primitivas mudou')
s = s.replace(old, new, 1)
old = '''    expect(output).toContain("Primitivas declaradas: 25");'''
new = '''    expect(output).toContain("Primitivas declaradas: 26");'''
if s.count(old) != 1:
    raise SystemExit('fichaRuntimeMap: assert de 25 primitivas mudou')
s = s.replace(old, new, 1)
anchor = '''    expect(output).toContain("Moedas: renderer-sem-builder");\n    expect(output).toContain("Regua: ausente");'''
replacement = '''    expect(output).toContain("Moedas: renderer-sem-builder");\n    expect(output).toContain("Recipientes: ausente");\n    expect(output).toContain("Regua: ausente");'''
if s.count(anchor) != 1:
    raise SystemExit('fichaRuntimeMap: âncora Moedas/Regua mudou')
s = s.replace(anchor, replacement, 1)
p.write_text(s, encoding='utf-8')

print('catalog/conformidade/runtime-map auditors retified for 90/GM.12')
