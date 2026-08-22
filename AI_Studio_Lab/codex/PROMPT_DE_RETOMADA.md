# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional viva do PR #35.** GitHub remoto e fontes executáveis do HEAD vencem memória, prompts antigos e snapshots históricos. Issue #47 governa a fase; Issue #48 registra lacunas; este arquivo organiza a retomada.

## 1. Reancoragem obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada
- último fechamento auditado antes desta atualização: `c710719cbd50f0f1eef4cc82536a1264da7daf67`

Antes de qualquer escrita:
1. confirme PR/branch/HEAD/main no remoto;
2. confira reviews e review threads;
3. confira CI + Certificação transversal do HEAD relevante;
4. leia Issue #47, Issue #48 e `ROADMAP_90_90_CHILD_READY.md`;
5. abra as fontes canônicas/executáveis do reparo atual;
6. não misture recibos entre SHAs;
7. histórico é evidência, não estado vivo automático.

## 2. Estado global

### Gate A — FECHADO-COM-RECIBO

Fábrica curricular principal concluída:
- 90 competências / 94 fichas autorais;
- 75 Composer / 15 legado servido / 0 fallback / 90 servidas / 11 divergências;
- W50 técnico `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` + transversal `32196855356` success 9/9;
- fechamento documental `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` + transversal `32197697050` success 9/9.

### Gate B — FECHADO-COM-RECIBO

Mega-auditoria completa no snapshot:
`c710719cbd50f0f1eef4cc82536a1264da7daf67`

Recibos próprios do mesmo SHA:
- CI #1549 / run `32437320278` — completed/success, 4/4;
- Certificação transversal #285 / run `32437320274` — completed/success, 9/9;
- 248 arquivos / 3.437 testes;
- TypeScript, catálogo, fichas, conformance, DAG, build, higiene e binários verdes;
- Sonda real Sensei verde, incluindo F30 e F97;
- Matrix observada: 90/94/75/15/0/90/11.

Resultado do Gate B:
- **90/90 competências auditadas**;
- **54 candidatas individuais ativas**;
- vias: **49 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- **8 classes estruturais** (`CLASS-001`–`CLASS-008`);
- correções executadas dentro do Gate B: **0**;
- `DECISAO-001/GM.04`: **PENDENTE-DE-DECISÃO-HUMANA**.

Documentos de fechamento:
- `GATE_B_FECHAMENTO_90_90.md`;
- `GATE_B_CLASS_007_DIMENSIONAMENTO_90.md`;
- `GATE_B_CLASS_008_MASTERY_FAMILIAS.md`;
- auditorias de Lote 1–11.

## 3. Classes estruturais

- `CLASS-001`: `lvl` declarado e não consumido — aberta para reparo/prova B′.
- `CLASS-002`: inventário/conformance fechado para descoberta; divergências ainda não reparadas. `DECISAO-001` fica separada.
- `CLASS-003`: caso único por nível sob mastery repetida — 18 competências conhecidas; aberta.
- `CLASS-004`: viés posicional em comparação — aberta.
- `CLASS-005`: **FECHADO-COM-RECIBO**.
- `CLASS-006`: **FECHADO-COM-RECIBO** por gate global de descoberta/medição; não restaurar allowlist positiva.
- `CLASS-007`: bypass de interação conceitual prescrita — 7/90 = 7,78%; aberta.
- `CLASS-008`: nível integrador mistura famílias sem diversidade no mastery — 6/90 = 6,67%; aberta.

CLASS-008 no HEAD auditado: `N1.09`, `N3.09`, `N4.03`, `N4.04`, `N4.07`, `GM.02`. O mecanismo `evidenciasDistintas` existe; a lacuna observada é aplicação/emissão/transporte. Os thresholds não são uniformes: N3.09 = 3/3 × 2; N4.07 = 8/10 × 3.

## 4. Gate B′ — ATIVO

A proposta de Gate B′ registrada na Issue #47 foi adotada operacionalmente após o fechamento certificado do Gate B e autorização humana de continuidade em 2026-08-21.

B′ é **reparo causal das saídas CODIGO do Gate B**. Não é Gate C e não reabre o Gate B AUDIT-ONLY.

Fila herdada:
- 49 candidatas individuais via CODIGO — provar/refutar antes de reparar;
- classes estruturais abertas: CLASS-001/002/003/004/007/008;
- CLASS-005/006 ficam apenas como precedentes fechados;
- 1 SIMULACAO permanece para Gate G;
- 4 CRIANCA permanecem para Gate J;
- `DECISAO-001/GM.04` permanece bloqueada por decisão humana.

### Prioridade operacional

Reparar primeiro defeitos que podem invalidar a própria medição/mastery:
1. vazamento de resposta/gabarito;
2. falsa evidência ou bypass de ação probatória;
3. invariantes estruturais de variedade/mastery;
4. divergências de representação/progressão sem decisão humana pendente.

**Primeiro alvo B′:** `GAP-054 — GM.06/F62`, vazamento de resposta no enunciado/suporte. É um defeito CODIGO diretamente observável e não depende de decisão curricular humana.

## 5. Protocolo obrigatório de cada reparo B′

1. reancorar no HEAD remoto;
2. provar a candidata contra cânone + runtime + teste;
3. se refutada, registrar `REFUTADA` e não editar runtime;
4. se confirmada, criar **regression-first** que falhe pela causa correta;
5. preservar o recibo vermelho; não chamar de flake sem evidência;
6. aplicar correção mínima, sem modernização oportunista;
7. evitar allowlist positiva escrita à mão em gates de invariante — usar descoberta ou medição; listas, quando inevitáveis, só de exceções explícitas e ainda medidas;
8. testar localmente pelo que estiver disponível e exigir CI + Certificação transversal no SHA final;
9. para UI/touch/geometria, exigir navegador real/sonda adequada;
10. registrar resultado/recibo na Issue #48 e atualizar a porta operacional somente após o verde;
11. manter reparos independentes em SHAs independentes quando não compartilham a mesma causa.

### Restrições de mastery

- ajuda/resolução assistida não compra mastery independente;
- erro motor não vira misconception conceitual;
- RT conceitual não reprova/compra mastery salvo fluência explicitamente governada;
- `evidenciasDistintas` é opt-in e não pode alterar fichas que não a declaram.

## 6. Gates posteriores

- Gate C — NÃO INICIADO.
- Gate D — NÃO INICIADO.
- Gate E — NÃO INICIADO.
- Gate F — NÃO INICIADO.
- Gate G — NÃO INICIADO; recebe a 1 candidata SIMULACAO quando chegar sua fase.
- Gate H — NÃO INICIADO.
- Gate I — NÃO INICIADO.
- Gate J — NÃO INICIADO; recebe as 4 candidatas CRIANCA. Nenhuma candidata CODIGO deve chegar aberta ao piloto.

## 7. Resíduos atuais que não podem ser apagados por conveniência

- 15 competências ainda servidas por legado;
- 11 divergências ficha↔screen;
- `Moedas` / GM.03 (`renderer-sem-builder`);
- warning de bundle/performance;
- 54 candidatas individuais de Gate B enquanto não forem provadas/refutadas/reparadas;
- classes estruturais abertas;
- `DECISAO-001/GM.04` humana.

Nota: o auditor de catálogo pode informar mais geradores legados **existentes** que 15; isso não contradiz a Matrix. `legacy=15` mede competências **atualmente servidas por legado**, não quantidade de funções/geradores legados ainda presentes no código.

## 8. Governança inviolável

- não tocar `main`;
- PR #35 permanece open + draft + unmerged;
- nunca ready, auto-merge ou merge;
- não tocar Creature Engine/Tamagotchi;
- um writer por vez;
- remoto vence memória;
- não relaxar testes, P13, Matrix, Radar, DAG, contratos ou sondas para obter verde;
- não reutilizar recibo de outro SHA;
- snapshots históricos não são reescritos para parecer atuais; apenas portas/índices vivos são reconciliados.

## Frente paralela — Observatório (P&D, não runtime)

A `SAGA-Research-Foundry` permanece frente subordinada, `PRE-CANONICAL`, `implementation_authorized: false`. Issue #47 é a autoridade do pós-90/90. Nada do Observatório entra no runtime, Matrix, canário ou fila B′ sem autorização específica.
