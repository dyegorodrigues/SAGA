# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47  
**Estado atual:** Gate A fechado; Gate B fechado; Gate B′ ativo; Gates C–J não iniciados.

Este arquivo é índice executivo. GitHub remoto, Issue #47, Issue #48 e fontes executáveis/canônicas vencem este resumo.

## 1. Estado dos gates

| Gate | Estado | Recibo/entrada |
|---|---|---|
| A — fechamento curricular 90/90 | **FECHADO-COM-RECIBO** | W50 + Matrix + workflows |
| B — mega-auditoria curricular | **FECHADO-COM-RECIBO** | `c710719cbd50f0f1eef4cc82536a1264da7daf67` |
| B′ — reparação das saídas CODIGO | **ATIVO** | autorização humana pós-auditoria + Issue #47 |
| C — Player/Tutor | NÃO INICIADO | Issue #47 §4 |
| D — orquestração adaptativa | NÃO INICIADO | Issue #47 §5 |
| E — telemetria/dados | NÃO INICIADO | Issue #47 §6 |
| F — UX/UI | NÃO INICIADO | Issue #47 §7 |
| G — Aprendiz Simulado | NÃO INICIADO | recebe 1 candidata SIMULACAO |
| H — E2E | NÃO INICIADO | Issue #47 §9 |
| I — hardening/release | NÃO INICIADO | Issue #47 §10 |
| J — piloto infantil | NÃO INICIADO | recebe 4 candidatas CRIANCA |

## 2. Gate A — fechamento executável

- 90 competências / 94 fichas autorais;
- 75 Composer / 15 legado servido / 0 fallback / 90 servidas / 11 divergências;
- técnico W50 `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` + transversal `32196855356` success 9/9;
- documental `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` + transversal `32197697050` success 9/9.

## 3. Gate B — mega-auditoria 90/90

Snapshot final:
`c710719cbd50f0f1eef4cc82536a1264da7daf67`

Recibos do próprio SHA:
- CI #1549 / `32437320278` — completed/success, 4/4;
- Certificação transversal #285 / `32437320274` — completed/success, 9/9;
- 248 arquivos / 3.437 testes;
- Matrix 90/94/75/15/0/90/11;
- Sensei e sondas reais verdes.

Resultado:
- **90/90 competências auditadas**;
- **54 candidatas individuais ativas**;
- **49 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- **8 classes estruturais**;
- correções feitas dentro do Gate B: **0**;
- `DECISAO-001/GM.04` pendente humana.

Autoridades detalhadas:
- `GATE_B_FECHAMENTO_90_90.md`;
- auditorias Lote 1–11;
- `GATE_B_CLASS_007_DIMENSIONAMENTO_90.md`;
- `GATE_B_CLASS_008_MASTERY_FAMILIAS.md`;
- Issue #48.

## 4. Classes estruturais

| Classe | Estado B′ | Medição/nota |
|---|---|---|
| CLASS-001 | ABERTA | `lvl` declarado e não consumido |
| CLASS-002 | ABERTA PARA REPARO | descoberta/inventário encerrados; divergências não reparadas |
| CLASS-003 | ABERTA | caso único por nível; 18 competências conhecidas |
| CLASS-004 | ABERTA | viés posicional comparativo |
| CLASS-005 | **FECHADA-COM-RECIBO** | gate global |
| CLASS-006 | **FECHADA-COM-RECIBO** | descoberta/medição global; sem allowlist positiva |
| CLASS-007 | ABERTA | 7/90 = 7,78% |
| CLASS-008 | ABERTA | 6/90 = 6,67% |

CLASS-008 atual: N1.09, N3.09, N4.03, N4.04, N4.07, GM.02. `evidenciasDistintas` já existe; B′ deve provar emissão/transporte/aplicação sem alterar fichas não opt-in.

## 5. Gate B′ — reparo causal

B′ foi adotado operacionalmente depois do fechamento certificado do Gate B e da autorização humana para seguir o workflow autonomamente.

### Entrada

- 49 candidatas individuais CODIGO;
- classes abertas CLASS-001/002/003/004/007/008;
- CLASS-005/006 como precedentes fechados;
- `DECISAO-001/GM.04` bloqueada por decisão humana;
- 1 SIMULACAO estacionada para Gate G;
- 4 CRIANCA estacionadas para Gate J.

### Regra de saída

- toda candidata CODIGO deve terminar `REFUTADA`, `ACEITA/FORA-DE-ESCOPO` com rationale autorizado, ou `RESOLVIDA-COM-RECIBO`;
- classes fecham por invariante/propriedade, nunca por lista positiva escrita à mão;
- nenhuma candidata CODIGO chega aberta ao Gate J.

### Ordem de prioridade

1. vazamento de resposta/gabarito e qualquer defeito que invalide assessment/mastery;
2. bypass/falsa evidência de domínio;
3. variedade/mastery estrutural;
4. divergências de representação/progressão;
5. decisões humanas bloqueantes permanecem estacionadas.

Primeiro alvo: **GAP-054 — GM.06/F62**, vazamento de gabarito no enunciado/suporte.

## 6. Protocolo por item B′

1. reancorar remoto e ler cânone/runtime/testes;
2. provar/refutar a causa;
3. regression-first vermelho para defeito confirmado;
4. preservar recibo vermelho;
5. correção mínima e causal;
6. CI + Certificação transversal no SHA final;
7. navegador real quando UI/touch/geometria estiver no caminho;
8. atualizar Issue #48 + porta operacional somente após recibo;
9. um reparo causal por vez, sem modernização lateral.

## 7. Resíduos executáveis atuais

- 15 competências servidas por legado;
- 11 divergências ficha↔screen;
- `Moedas`/GM.03 sem builder;
- warning de bundle/performance;
- candidatas/classes de B′ ainda abertas;
- `DECISAO-001/GM.04` humana.

“Geradores legados existentes” e “15 competências servidas por legado” são métricas diferentes e não devem ser confundidas.

## 8. Gates posteriores e preservação de evidência

- 1 candidata SIMULACAO permanece hipótese para Gate G; não fabricar conclusão estática.
- 4 candidatas CRIANCA permanecem perguntas para Gate J; não tratá-las como defeitos confirmados antes de observação adequada.
- linha de base infantil anterior ao primeiro uso sério continua requisito de Gate J.
- Gate C só começa quando a governança de B′ permitir transição; B′ não autoriza antecipar C–J.

## 9. Governança

- `main` intocada;
- PR #35 open + draft + unmerged;
- sem ready/auto-merge/merge;
- Creature Engine/Tamagotchi fora de escopo;
- remoto vence memória;
- recibo sempre do SHA exato;
- não enfraquecer testes/P13/Matrix/Radar/DAG/sondas;
- erro motor não vira misconception conceitual;
- ajuda/resolução não compra mastery independente;
- RT não compra mastery conceitual fora de fluência explicitamente governada;
- Observatório/Research Foundry permanece subordinado, `implementation_authorized: false`.
