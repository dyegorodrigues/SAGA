from pathlib import Path

# Este pós-patch roda apenas no workspace do runner depois do candidato F49.
# O runtime novo emite os nomes semânticos atuais, mas replays/testes/telemetria
# da primeira implementação precisam continuar legíveis durante a migração.
p=Path('src/curriculum/procedimentos/grandezaProcedure.ts')
s=p.read_text(encoding='utf-8')
s=s.replace(
'''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia: boolean;''',
'''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia?: boolean;\n  /** @deprecated nome da primeira implementação, mantido para replays/telemetria antigos de altura. */\n  antesDoChao?: boolean;''',1)
s=s.replace(
'''  atributo: Atributo;''',
'''  /** Opcional só para compatibilidade com ações persistidas antes da modelagem por eixo. */\n  atributo?: Atributo;''',1)
s=s.replace(
'''  if (acao.antesDaReferencia) return MisconceptionTag.BASE_DESALINHADA;''',
'''  if (acao.antesDaReferencia || acao.antesDoChao) return MisconceptionTag.BASE_DESALINHADA;''',1)
p.write_text(s,encoding='utf-8')

# Em L3+, durante o erro, a cena precisa mostrar UMA comparação animada entre
# o que foi escolhido e o correto. O guia estático de ajuda não deve ficar
# simultaneamente por baixo, senão duas linhas contam histórias concorrentes.
p=Path('src/components/primitives/GrandezaStage.tsx')
s=p.read_text(encoding='utf-8')
old='''  const mostrarGuiaNormal = referenciaPronta && (\n    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)\n  );'''
new='''  const mostrarGuiaNormal = referenciaPronta && fase !== "erro" && (\n    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)\n  );'''
if s.count(old) != 1:
    raise SystemExit('GrandezaStage: bloco mostrarGuiaNormal mudou')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

print('GM01 compatibility fix applied')
