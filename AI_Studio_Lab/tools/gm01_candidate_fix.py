from pathlib import Path

p=Path('src/curriculum/procedimentos/grandezaProcedure.ts')
s=p.read_text(encoding='utf-8')
s=s.replace(
'''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia: boolean;''',
'''  /** A criança decidiu antes de a referência comum terminar de aparecer. */\n  antesDaReferencia?: boolean;\n  /** @deprecated nome da primeira implementação, mantido para replays/telemetria antigos de altura. */\n  antesDoChao?: boolean;''',1)
s=s.replace(
'''  if (acao.antesDaReferencia) return MisconceptionTag.BASE_DESALINHADA;''',
'''  if (acao.antesDaReferencia || acao.antesDoChao) return MisconceptionTag.BASE_DESALINHADA;''',1)
p.write_text(s,encoding='utf-8')
print('GM01 compatibility fix applied')
