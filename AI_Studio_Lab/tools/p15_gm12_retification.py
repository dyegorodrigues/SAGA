from pathlib import Path
import re

ROOT = Path('.')

def load(path: str) -> str:
    return (ROOT / path).read_text(encoding='utf-8')

def save(path: str, text: str) -> None:
    (ROOT / path).write_text(text, encoding='utf-8')

def once(text: str, old: str, new: str, label: str) -> str:
    n = text.count(old)
    if n != 1:
        raise SystemExit(f'{label}: esperado 1, encontrado {n}')
    return text.replace(old, new, 1)

# ---------------------------------------------------------------------------
# 1) Fonte executável do grafo: 89 -> 90, GM.12 em F0, GM.05 depende dele.
# ---------------------------------------------------------------------------
p = 'curriculum/grafo_saga.yaml'
s = load(p)
s = once(s,
    '# Versão executável do GRAFO_DE_CONHECIMENTO_SAGA.md (fonte humana). 88 nós.',
    '# Versão executável do GRAFO_DE_CONHECIMENTO_SAGA.md (fonte humana). 90 nós.',
    'grafo agregado/cabeçalho')
anchor = '  - { id: GM.01, nome: "Comparação direta de grandezas",         strand: GM, faixa: F0, prereqs: [] }\n'
insert = anchor + '''  # GM.12 — F50. O ID GM.02 é tempo cotidiano e GM.05 já era medidas\n  # padronizadas antes da P15. Massa/capacidade são uma competência própria,\n  # conceitualmente entre comparação direta e unidades convencionais.\n  - { id: GM.12, nome: "Massa e capacidade: comparação e conservação", strand: GM, faixa: F0, prereqs: [GM.01] }\n'''
s = once(s, anchor, insert, 'grafo agregado/GM.12')
s = once(s,
    '- { id: GM.05, nome: "Medidas padronizadas (cm/m, g/kg, L)",   strand: GM, faixa: F2, prereqs: [GM.01, N2.02] }',
    '- { id: GM.05, nome: "Medidas padronizadas (cm/m, g/kg, L)",   strand: GM, faixa: F2, prereqs: [GM.12, N2.02] }',
    'grafo agregado/GM.05 prereq')
save(p, s)

# ---------------------------------------------------------------------------
# 2) YAML humano da strand GM.
# ---------------------------------------------------------------------------
p = 'curriculum/GM.yaml'
s = load(p)
old_gm01 = '''  GM.01:\n    title: "Comparação direta de grandezas"\n    objective: "comprido/curto, alto/baixo, pesado/leve, cheio/vazio, grande/pequeno — comparando dois objetos lado a lado."\n    prereqs:\n    kinds:\n      - "plain"\n      - "scene"\n      - "balance (balança visual para peso)."\n    micros:\n'''
new_gm01 = '''  GM.01:\n    title: "Comparação direta de grandezas"\n    objective: "comprido/curto, alto/baixo e grande/pequeno — dimensões diretamente visíveis comparadas a partir da mesma referência."\n    prereqs:\n    kinds:\n      - "groups"\n      - "scene"\n    micros:\n  GM.12:\n    title: "Massa e capacidade: comparação e conservação"\n    objective: "comparar pesado/leve e mais/menos capacidade sem julgar pelo tamanho aparente e sem depender de unidades padronizadas."\n    prereqs:\n      - "GM.01"\n    kinds:\n      - "balance (comparação física)"\n      - "containers (despejo em recipiente de referência)."\n    micros:\n'''
s = once(s, old_gm01, new_gm01, 'GM.yaml/GM01+12')
s = once(s,
'''    prereqs:\n      - "GM.01"\n      - "N2.02"\n    kinds:\n      - "measure (régua arrastável — PRIORIDADE 3)"''',
'''    prereqs:\n      - "GM.12"\n      - "N2.02"\n    kinds:\n      - "measure (régua arrastável — PRIORIDADE 3)"''',
    'GM.yaml/GM05 prereq')
save(p, s)

# ---------------------------------------------------------------------------
# 3) Grafo humano canônico: v1.3, 90 competências e fronteiras GM explícitas.
# ---------------------------------------------------------------------------
p = 'AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md'
s = load(p)
s = once(s, '**Versão 1.2 · Agosto 2026 · Documento-irmão da BÍBLIA DO SAGA (ler junto)**',
         '**Versão 1.3 · Agosto 2026 · Documento-irmão da BÍBLIA DO SAGA (ler junto)**',
         'grafo humano/versão')
pat = re.compile(r'> \*\*v1\.2 \(ago/2026\).*?(?=\n\nEste documento substitui:)', re.S)
m = pat.search(s)
if not m:
    raise SystemExit('grafo humano/nota v1.2 não encontrada')
new_note = '''> **v1.3 (ago/2026) — retificação GM.12.** O grafo tem **90 competências** e **13 trilhas de fluência**. A N1.13 já havia separado “produzir quantidade” de “contar até 20”; agora a GM.12 separa **massa/capacidade sem unidades** da GM.01 (dimensões diretamente visíveis), preservando também GM.02 (tempo cotidiano) e GM.05 (medidas padronizadas). IDs antigos permanecem estáveis; novos conceitos recebem novos IDs. O histórico 84→88 continua documentado na §15.8 da Bíblia.'''
s = s[:m.start()] + new_note + s[m.end():]
old_row = '| **GM** | Grandezas e Medidas | esmeralda | ●● | ●● | ●●● | ●● | |'
new_row = '| **GM** | Grandezas e Medidas | esmeralda | ●●● | ●● | ●●● | ●● | |'
s = once(s, old_row, new_row, 'grafo humano/tabela GM')
pat_total = re.compile(r'\*\*Total: 89 competências\.\*\*.*?Cada ● é uma competência \(uma "ilha" no mapa do app\)\.', re.S)
m = pat_total.search(s)
if not m:
    raise SystemExit('grafo humano/total 89 não encontrado')
new_total = '''**Total: 90 competências.** *(88 no fechamento da reconciliação original; 89 após a N1.13; 90 após a GM.12.)* IDs novos são acrescentados sem renumerar os antigos. Cada ● é uma competência (uma "ilha" no mapa do app).'''
s = s[:m.start()] + new_total + s[m.end():]
pat_gm01 = re.compile(r'### GM\.01 — Comparação direta de grandezas\n.*?(?=\n### GM\.02 —)', re.S)
m = pat_gm01.search(s)
if not m:
    raise SystemExit('grafo humano/bloco GM.01 não encontrado')
new_gm = '''### GM.01 — Comparação direta de grandezas\n**Objetivo:** comparar dimensões diretamente visíveis — grande/pequeno, alto/baixo e comprido/curto — usando uma referência justa.\n**Pré-req:** nenhum. **Kinds:** groups, scene.\n**Micros:** a) grande/pequeno, alto/baixo · b) comprido/curto com os pontos de início alinhados · c) diferença pequena · d) objetos de identidades diferentes · e) seriação de três por tamanho.\n**Erros típicos:** comparar comprimento sem alinhar o início; usar “maior” sem identificar o atributo; julgar pela dimensão errada.\n\n### GM.12 — Massa e capacidade: comparação e conservação\n**Objetivo:** comparar pesado/leve e capacidade/volume sem confiar no tamanho aparente e sem depender ainda de g/kg ou mL/L.\n**Pré-req:** GM.01. **Kinds:** balance (comparação física), containers* (despejo em recipiente comum de referência).\n**Micros:** a) peso com diferença óbvia · b) capacidade em recipientes iguais · c) capacidade em formatos diferentes, verificando por despejo · d) peso contraintuitivo (pequeno mais pesado) · e) ordenar três por massa ou capacidade.\n**Erros típicos:** `JULGA_PELO_TAMANHO`; confundir peso com volume; achar que recipiente mais alto sempre “cabe mais”; ignorar a transformação de conservação.\n**Ponte:** depois de comparar/conservar a grandeza sem número, GM.05 introduz ferramentas e unidades padronizadas.\n'''
s = s[:m.start()] + new_gm + s[m.end():]
# GM.05 is unique in the human graph; change only inside its block.
pat_gm05 = re.compile(r'(### GM\.05 — Medidas padronizadas.*?\n\*\*Pré-req:\*\* )GM\.01(, N2\.02\.)', re.S)
s, n = pat_gm05.subn(r'\1GM.12\2', s, count=1)
if n != 1:
    raise SystemExit(f'grafo humano/GM05 prereq: {n}')
save(p, s)

# ---------------------------------------------------------------------------
# 4) Bíblia: fonte suprema precisa acompanhar a nova contagem e o changelog.
# ---------------------------------------------------------------------------
p = 'AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md'
s = load(p)
s = once(s, '**Versão 3.2 · Agosto 2026 · Fonte única de verdade do projeto**',
         '**Versão 3.3 · Agosto 2026 · Fonte única de verdade do projeto**',
         'Bíblia/versão')
s = once(s, 'Esquema completo, tabela de migração dos IDs velhos e as 89 competências:',
         'Esquema completo, tabela de migração dos IDs velhos e as 90 competências:',
         'Bíblia/contagem §4')
sentinel = '### v3.3 — GM.12 separa massa/capacidade de tempo e de unidades'
if sentinel not in s:
    s += '''\n\n---\n\n### v3.3 — GM.12 separa massa/capacidade de tempo e de unidades\n\nA auditoria do bloco F0 encontrou uma colisão de IDs: F50 dizia GM.02 embora GM.02 seja **Tempo cotidiano**, e a P15 posterior tentou movê-la para GM.05 embora GM.05 já fosse **Medidas padronizadas**. A matriz passa a ter **90 competências** com o novo `GM.12 — Massa e capacidade: comparação e conservação` (F0, pré-req GM.01). `GM.05` passa a depender de GM.12 + N2.02. A progressão canônica é: comparação visível → massa/capacidade sem unidades → medição padronizada. Ver `AI_Studio_Lab/codex/DECISAO_P15_F50.md`.\n'''
save(p, s)

# ---------------------------------------------------------------------------
# 5) F50 canônica: identidade correta e capacidade sem vazar unidades de GM.05.
# ---------------------------------------------------------------------------
p = 'AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md'
s = load(p)
s = once(s,
'| 17 | **F50** — Cabe mais ou menos? | GM.02 | peso e capacidade independem do tamanho | ✅ |',
'| 17 | **F50** — Cabe mais ou menos? | GM.12 | peso e capacidade independem do tamanho | ✅ |',
'F0/index F50')
old_legend = '**Legenda de progresso:** ✅ **21 fichas · 15 competências · bloco F0 COMPLETO** *(v3.1: JD2 e JD3 escritas — o Jardim do Dojo fica completo, JD1 a JD5)*'
new_legend = '**Legenda de progresso:** ✅ **21 fichas autorais completas.** A auditoria de IDs tornou visível uma lacuna do grafo: **GM.02 (tempo cotidiano) ainda não tem ficha autoral própria**. Portanto “fichas escritas” não é sinônimo de “cobertura integral do F0”. *(JD1 a JD5 permanecem completos.)*'
s = once(s, old_legend, new_legend, 'F0/legenda cobertura')
start = s.find('# FICHA F50 — CABE MAIS OU MENOS?')
end = s.find('# FICHA F51 —', start)
if start < 0 or end < 0:
    raise SystemExit('F50: limites da seção não encontrados')
sec = s[start:end]
sec = once(sec,
'**Competência:** GM.02 (capacidade e massa) · **Primitiva:** `Balanca` + `ShapeCanvas` · **Faixa:** F0',
'**Competência:** GM.12 (massa e capacidade: comparação e conservação) · **Primitiva:** `Balanca` + `Recipientes` · **Faixa:** F0',
'F50/identidade')
identity = '**Competência:** GM.12 (massa e capacidade: comparação e conservação) · **Primitiva:** `Balanca` + `Recipientes` · **Faixa:** F0'
ret = identity + '''\n\n> **Retificação P15 — ago/2026.** A ficha antiga dizia GM.02, mas esse ID pertence a **tempo cotidiano**. A tentativa posterior de usar GM.05 também foi rejeitada porque GM.05 já é **medidas padronizadas**. F50 recebe o novo ID estável GM.12. A criança aprende primeiro a comparar/conservar massa e capacidade sem unidade; g/kg e mL/L ficam para GM.05.'''
sec = once(sec, identity, ret, 'F50/nota P15')
sec = sec.replace('`ShapeCanvas`', '`Recipientes`')
sec = sec.replace('recipiente-padrão graduado', 'recipiente-padrão transparente **sem marcações numéricas**')
# If wording uses a unicode/non-backtick version, cover it too without hiding failure.
sec = sec.replace('recipiente-padrão **graduado**', 'recipiente-padrão transparente **sem marcações numéricas**')
verify_anchor = '**O despejo no recipiente-padrão é o que ensina.**'
if verify_anchor not in sec:
    raise SystemExit('F50: âncora do despejo não encontrada')
sec = sec.replace(verify_anchor,
    '**O despejo no recipiente-padrão é o que ensina.** Em F0 esse recipiente NÃO tem números nem unidade: ele só coloca as duas quantidades sob a mesma referência. Graduação em mL/L pertence a GM.05.', 1)
s = s[:start] + sec + s[end:]
save(p, s)

# ---------------------------------------------------------------------------
# 6) Comentário vivo da F49: P15 já não é pendência sem casa.
# ---------------------------------------------------------------------------
p = 'src/curriculum/fichas/jornada/GM.01.ts'
s = load(p)
pat = re.compile(r' \* ### ⚠️ Onde fica a F50 — pendência P15\n.*?(?= \* ### A escada da §5)', re.S)
m = pat.search(s)
if not m:
    raise SystemExit('GM.01.ts: bloco P15 antigo não encontrado')
new_comment = ''' * ### F50 / P15 — decisão retificada\n *\n * A F50 não divide mais este nó. A auditoria provou duas colisões históricas:\n * GM.02 já é tempo cotidiano e GM.05 já é medidas padronizadas. F50 passa a\n * `GM.12 — Massa e capacidade: comparação e conservação`, pré-requisito de\n * GM.05. Assim esta ficha F49 permanece dona de UMA escada: dimensões\n * diretamente visíveis; massa/capacidade ganham maestria e diagnóstico próprios.\n *\n'''
s = s[:m.start()] + new_comment + s[m.end():]
save(p, s)

# ---------------------------------------------------------------------------
# 7) Mapa de primitivas: Recipientes fica honestamente AUSENTE, com 2 clientes.
# ---------------------------------------------------------------------------
p = 'AI_Studio_Lab/tools/ficha_runtime_map.cjs'
s = load(p)
anchor = '  { primitive: "Balanca", kinds: ["balanca"], componentFiles: [component("Balanca")], builderKinds: ["balanca"], rendererKinds: ["balanca"] },\n'
rec = anchor + '''  {\n    primitive: "Recipientes",\n    kinds: ["containers"],\n    componentFiles: [],\n    builderKinds: [],\n    rendererKinds: [],\n    note: "Planejada para F50/GM.12 (conservação/comparação sem unidades) e F61/GM.05 (capacidade graduada mL/L). Não reutilizar ShapeCanvas para líquidos.",\n  },\n'''
s = once(s, anchor, rec, 'runtime map/Recipientes')
save(p, s)

# ---------------------------------------------------------------------------
# 8) Handoffs: não apagar a decisão antiga; marcá-la explicitamente superada.
# ---------------------------------------------------------------------------
appendices = {
'AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md': '''\n\n---\n\n## §13.3 — P15 REABERTA E RETIFICADA: F50 = GM.12, não GM.05\n\nA conclusão anterior da P15 foi invalidada por auditoria histórica: `GM.05` já significava **Medidas padronizadas** antes de a P15 tentar reutilizar o ID. `GM.02` continua **Tempo cotidiano**. A F50 recebe `GM.12 — Massa e capacidade: comparação e conservação`, F0, pré-req `GM.01`; `GM.05` passa a depender de `GM.12` + `N2.02`. A decisão completa e as fontes estão em `AI_Studio_Lab/codex/DECISAO_P15_F50.md`.\n\nA primitiva de capacidade passa a se chamar `Recipientes`, com dois clientes previstos: F50/GM.12 e F61/GM.05. Ela permanece ausente até a etapa de implementação; o grafo pode e deve mostrar GM.12 em fallback enquanto isso.\n''',
'AI_Studio_Lab/codex/BRIEFING_CODEX.md': '''\n\n---\n\n## ADENDO VIGENTE — tarefa 6 / F50\n\nA instrução antiga que destinava F50 a `GM.05` está **SUPERADA**. Auditoria posterior provou que `GM.05` já era Medidas padronizadas e que `GM.02` é Tempo cotidiano. O alvo correto da F50 é o novo **`GM.12 — Massa e capacidade: comparação e conservação`**, F0, pré-req `GM.01`. Ver `DECISAO_P15_F50.md`. Qualquer execução futura da fila deve usar GM.12 e preservar GM.02/GM.05.\n''',
'AI_Studio_Lab/codex/RETOMADA.md': '''\n\n### Checkpoint Codex — F48/F49 fechadas; P15/F50 retificada\n\n- `GE.02/F48`: correção fechada, não ativada; sólidos permanecem em GE.04; CI original final verde.\n- `GM.01/F49`: correção fechada, não ativada; comprimento usa eixo horizontal real, altura usa base comum, L3 tem régua antes da decisão, erro/retry e seriação são autorais; CI original final verde.\n- P15 foi reaberta por conflito histórico: GM.02=tempo, GM.05=medidas padronizadas. A decisão vigente cria **GM.12** para massa/capacidade conceituais e torna GM.12 pré-requisito de GM.05.\n- Próximo passo: primeiro validar a matriz em 90 nós sem runtime falso; depois implementar F50/GM.12 com Balanca + nova primitiva `Recipientes`.\n'''
}
for path, addition in appendices.items():
    s = load(path)
    marker = addition.strip().splitlines()[0]
    if marker not in s:
        s += addition
        save(path, s)

print('P15/GM.12 retification candidate written')
