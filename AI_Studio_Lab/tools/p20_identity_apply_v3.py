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
