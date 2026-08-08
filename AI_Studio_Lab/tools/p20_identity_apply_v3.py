from pathlib import Path

path = Path("AI_Studio_Lab/tools/p20_identity_apply.py")
code = path.read_text()

old_first = '''replace_once(\n    "src/components/LoginScreen.tsx",\n    \'\'\'      onLoginSuccess(email, state);\'\'\',\n    \'\'\'      onLoginSuccess(email);\'\'\',\n)\n'''
if code.count(old_first) != 1:
    raise SystemExit(f"wrapper P20: bloco callback inicial esperado 1x, encontrado {code.count(old_first)}x")
code = code.replace(old_first, "")

old_second = '''# segunda ocorrência do callback anônimo\np = Path("src/components/LoginScreen.tsx")\ntext = p.read_text()\nif text.count(\'      onLoginSuccess(email, state);\') != 1:\n    raise SystemExit(f"LoginScreen: callback anônimo esperado 1x, encontrado {text.count(\'      onLoginSuccess(email, state);\')}x")\np.write_text(text.replace(\'      onLoginSuccess(email, state);\', \'      onLoginSuccess(email);\'))\n'''
new_second = '''# As duas rotas de autenticação convergem no mesmo callback. Exigimos duas:\n# Google + anônima. Qualquer terceira rota nova obriga esta bancada a ser revista.\np = Path("src/components/LoginScreen.tsx")\ntext = p.read_text()\ncount = text.count(\'      onLoginSuccess(email, state);\')\nif count != 2:\n    raise SystemExit(f"LoginScreen: callbacks de estado esperados 2x, encontrado {count}x")\np.write_text(text.replace(\'      onLoginSuccess(email, state);\', \'      onLoginSuccess(email);\'))\n'''
if code.count(old_second) != 1:
    raise SystemExit(f"wrapper P20: bloco callback final esperado 1x, encontrado {code.count(old_second)}x")
code = code.replace(old_second, new_second)

exec(compile(code, str(path), "exec"))

# Os testes abaixo protegiam corretamente a arquitetura anterior. P20 muda o
# contrato de identidade, então o fiscal precisa mudar junto — sem perder a
# intenção: mesmo carimbo nos dois destinos e leitura dos dois lados antes da
# escolha.
test_path = Path("src/lib/reconciliacaoDeSaves.test.ts")
test = test_path.read_text()
old_local_assert = '''    expect(corpo).toContain('setStorage("mk-state-v1", JSON.stringify(carimbado))');\n    expect(corpo, "a nuvem recebe o MESMO estado carimbado").toContain("nuvem.agendar(carimbado)");'''
new_local_assert = '''    expect(corpo).toContain("setStorage(stateKeyForUid(uid), JSON.stringify(carimbado))");\n    expect(corpo, "a nuvem recebe o MESMO estado carimbado e o mesmo dono").toContain("nuvem.agendar(carimbado, uid)");'''
if test.count(old_local_assert) != 1:
    raise SystemExit(f"P20: guarda do mesmo carimbo esperado 1x, encontrado {test.count(old_local_assert)}x")
test = test.replace(old_local_assert, new_local_assert)

old_bootstrap_test = '''  it("lê o armazenamento local mesmo quando a nuvem respondeu", () => {\n    const posNuvem = app.indexOf("await loadStateFromCloud()");\n    const posEscolha = app.indexOf("escolherSaveMaisRecente(cloudState, localState)");\n    const posLocal = app.indexOf('getStorage("mk-state-v1")', posNuvem);\n\n    expect(posNuvem).toBeGreaterThan(-1);\n    expect(posLocal).toBeGreaterThan(posNuvem);\n    // A leitura local não pode estar dentro de um `if (!loadedState)`: era\n    // exatamente essa guarda que fazia a nuvem vencer incondicionalmente.\n    expect(posEscolha).toBeGreaterThan(posLocal);\n    expect(app.slice(posNuvem, posEscolha)).not.toMatch(/if\\s*\\(\\s*!loadedState\\s*\\)/);\n  });'''
new_bootstrap_test = '''  it("lê cloud, local escopado e legado antes do bootstrap decidir", () => {\n    const posNuvem = app.indexOf("await loadStateFromCloud()");\n    const posScoped = app.indexOf("getStorage(stateKeyForUid(uid))");\n    const posLegacy = app.indexOf("getStorage(LEGACY_STATE_KEY)");\n    const posResolve = app.indexOf("resolveBootstrapState({");\n\n    expect(posNuvem).toBeGreaterThan(-1);\n    expect(posScoped).toBeGreaterThan(-1);\n    expect(posLegacy).toBeGreaterThan(-1);\n    expect(posResolve).toBeGreaterThan(posNuvem);\n    expect(posResolve).toBeGreaterThan(posScoped);\n    expect(posResolve).toBeGreaterThan(posLegacy);\n  });'''
if test.count(old_bootstrap_test) != 1:
    raise SystemExit(f"P20: guarda do bootstrap esperado 1x, encontrado {test.count(old_bootstrap_test)}x")
test = test.replace(old_bootstrap_test, new_bootstrap_test)
test_path.write_text(test)
