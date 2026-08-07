from pathlib import Path

# Pós-patch de compatibilidade. Ele roda depois do candidato F49 somente no
# workspace do runner. Ações novas usam os nomes atuais; replays/testes antigos
# continuam aceitos sem tornar a definição curricular do degrau opcional.
p=Path('src/curriculum/procedimentos/grandezaProcedure.ts')
s=p.read_text(encoding='utf-8')
old_ref='''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia: boolean;\n  atributo: Atributo;'''
new_ref='''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia?: boolean;\n  /** @deprecated nome da primeira implementação, mantido para replays/telemetria antigos de altura. */\n  antesDoChao?: boolean;\n  /** Opcional só para ações persistidas antes da modelagem por eixo; o runtime novo sempre emite. */\n  atributo?: Atributo;'''
if s.count(old_ref) != 1:
    raise SystemExit(f'AcaoDeGrandeza: assinatura esperada não encontrada ({s.count(old_ref)})')
s=s.replace(old_ref,new_ref,1)
old_diag='''  if (acao.antesDaReferencia) return MisconceptionTag.BASE_DESALINHADA;'''
new_diag='''  if (acao.antesDaReferencia || acao.antesDoChao) return MisconceptionTag.BASE_DESALINHADA;'''
if s.count(old_diag) != 1:
    raise SystemExit('AcaoDeGrandeza: diagnóstico da referência mudou')
s=s.replace(old_diag,new_diag,1)
p.write_text(s,encoding='utf-8')

# Em L3+, durante o erro, a cena mostra UMA comparação animada entre escolha e
# correto. O guia estático de ajuda não deve coexistir por baixo dela.
p=Path('src/components/primitives/GrandezaStage.tsx')
s=p.read_text(encoding='utf-8')
old='''  const mostrarGuiaNormal = referenciaPronta && (\n    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)\n  );'''
new='''  const mostrarGuiaNormal = referenciaPronta && fase !== "erro" && (\n    spec.reguaFantasma || fase === "fecho" || Boolean(emAula && mostrar?.subirLinhaTracejada)\n  );'''
if s.count(old) != 1:
    raise SystemExit('GrandezaStage: bloco mostrarGuiaNormal mudou')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

print('GM01 compatibility fix applied')
