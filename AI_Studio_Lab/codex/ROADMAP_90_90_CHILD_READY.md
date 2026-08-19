# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47 — `Integração Sistêmica e Child-Ready`  
**Estado:** Gate A fechado; Gate B aberto em lotes; Gates C–J não iniciados.

Este arquivo é um **índice executivo**. Ele aponta para fontes canônicas e registra estado/classificação; não substitui Issue #47, Issue #48 nem documentos especializados. GitHub remoto e autoridades executáveis do HEAD vencem este índice se houver divergência.

## 1. Modo operacional

A Fábrica Curricular Principal foi formalmente concluída em `fallback=0` e `90/90` competências servidas. O modo do projeto é **Integração Sistêmica e Child-Ready**.

Isso não declara o produto Child-Ready. A Definition of Child-Ready e a ordem oficial dos gates pertencem à Issue #47.

## 2. Gates A–J — estado atual

| Gate | Estado atual | Fonte canônica / próxima autoridade |
|---|---|---|
| **A — Fechamento curricular executável 90/90** | **FECHADO-COM-RECIBO** | Coverage Matrix + checkpoints finais + workflows dos SHAs `efd270b…` e `dc6c21c…` |
| **B — Mega-auditoria curricular e de microprogressão** | **ABERTO EM LOTES** | Issue #47 §3 + Issue #48 + auditorias de lote |
| **C — Player/Tutor e política de ajuda** | **NÃO INICIADO** | Issue #47 §4 + `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md` |
| **D — Orquestração adaptativa** | **NÃO INICIADO** | Issue #47 §5 + runtime/Sensei |
| **E — Telemetria/dados/recuperação** | **NÃO INICIADO** | Issue #47 §6 + `DADOS_E_RETENCAO.md` após revalidação |
| **F — UX/UI/Design System** | **NÃO INICIADO** | Issue #47 §7 + `DESIGN_ESTADO_E_DECISOES.md` após revalidação |
| **G — Aprendiz Simulado** | **NÃO INICIADO** | Issue #47 §8 + `ENGENHARIA_DE_SIMULACAO.md` |
| **H — Campanha E2E** | **NÃO INICIADO** | Issue #47 §9 |
| **I — Performance/release hardening** | **NÃO INICIADO** | Issue #47 §10 |
| **J — Piloto infantil/calibração** | **NÃO INICIADO** | Issue #47 §11 + precondição de linha de base |

Gate B é serializado por domínio; nenhum lote autoriza automaticamente o seguinte.

### Proposta Gate B′ — não oficial

Antes do Lote 4 foi registrado na Issue #47 o comentário `5342129190`, propondo um **Gate B′** entre B e C para reparar/fechar primeiro saídas via `CODIGO`, migrar `SIMULACAO` para Gate G e `CRIANCA` para Gate J, com nenhuma candidata `CODIGO` aberta no início do Gate J.

A proposta é **somente comentário de governança**: a §15 não foi alterada, Gate B′ não foi ativado e Gates C–J seguem não iniciados.

## 3. Gate A — recibo de fechamento

Classificação: **FECHADO-COM-RECIBO**.

- técnico W50: `efd270b732752ebe0d38a47efff47d958e352802`; CI `32196855192` success; transversal `32196855356` success 9/9;
- Matrix: **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**;
- documental: `dc6c21c2ba013e104813a534c55de804c546b770`; CI `32197697198` success; transversal `32197697050` success 9/9.

## 4. Gate B — mega-auditoria em lotes

**Estado:** ABERTO, não fechado.

### Lote 1 — N1

- escopo: 13/13;
- documento: `GATE_B_LOTE_1_N1_AUDITORIA.md`;
- snapshot: `ad1b239457371a1f411001fd8521984eeadb94fe`;
- 10 candidatas `GAP-002`–`GAP-011`, todas `HIPÓTESE-A-PROVAR`;
- vias: 7 CODIGO / 0 SIMULACAO / 3 CRIANCA;
- CI `32209683689` success + transversal `32209683699` success 9/9;
- correções: 0.

### Lote 2 — N2

- escopo: 7/7;
- documento: `GATE_B_LOTE_2_N2_AUDITORIA.md`;
- snapshot: `a5101b362ae6d4896258f994ed14145b37950b98`;
- 10 candidatas `GAP-012`–`GAP-021`, todas `HIPÓTESE-A-PROVAR`;
- vias: 9 CODIGO / 1 SIMULACAO / 0 CRIANCA;
- CI `32216926616` success + transversal `32216926610` success 9/9;
- correções: 0.

### Lote 3 — N3

- escopo: 13/13;
- documento: `GATE_B_LOTE_3_N3_AUDITORIA.md`;
- snapshot: `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`;
- `CLASS-001`: `CONFIRMADO-ATUAL`, via CODIGO, 18 geradores com `lvl` declarado e não consumido;
- 7 candidatas `GAP-022`–`GAP-028`, todas `HIPÓTESE-A-PROVAR`;
- vias: 7 CODIGO / 0 SIMULACAO / 0 CRIANCA;
- CI `32218633036` success + transversal `32218633032` success 9/9;
- correções: 0.

### Lote 4 — N4

- escopo: `N4.01–N4.12`, **12/12**;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_4_N4_AUDITORIA.md`;
- proveniência: **10 Composer / 2 legado** (`N4.02`, `N4.05`);
- novos achados de classe: **2**;
- novas candidatas individuais: **4**, `GAP-029`–`GAP-032`;
- correções: 0;
- runtime/Matrix/canário/DAG: intocados.

#### CLASS-002 — prereqs ficha↔DAG

- classe: `CONFIRMADO-ATUAL`;
- via: `CODIGO`;
- afetados: N4.03, N4.06, N4.07, N4.08;
- as fichas TS declaram subconjuntos dos prereqs do DAG/YAML;
- **impacto limitado revalidado:** `unlockEngine` usa `GrafoSaga`, derivado de `src/curriculum/grafo_saga.ts`; portanto não há bypass de unlock no HEAD atual.

#### CLASS-003 — caso único por nível sob mastery repetida

- classe: `CONFIRMADO-ATUAL`;
- via: `CODIGO`;
- afetados: N4.10/F69, N4.11/F70, N4.12/F71;
- os builders especializados usam um único cenário determinístico em cada nível enquanto as fichas exigem múltiplos acertos/sessões;
- N4.01 foi refutado como membro: seu `equalGroupsContract` sorteia casos por nível.

#### Candidatas N4

- GAP-029 — N4.02 legado não exige giro/comutatividade e colapsa L2–L5; via CODIGO;
- GAP-030 — N4.05 não serve o significado de divisão por medida; via CODIGO;
- GAP-031 — N4.05 L3–L5 repetem partição simbólica exata e não constroem resto/ponte para N4.10; via CODIGO;
- GAP-032 — N4.07 estreia ×7 apenas no misto L4 quando o apoio da estratégia já saiu; via CRIANCA.

Classe das quatro candidatas: **`HIPÓTESE-A-PROVAR`**.

Vias do Lote 4: **3 CODIGO / 0 SIMULACAO / 1 CRIANCA**.

O snapshot documental deste Lote 4 precisa de **CI success + Certificação transversal success 9/9 no mesmo SHA** antes da parada final.

**Próximo domínio natural, não iniciado:** `N5`.

## 5. Estado acumulado após N4

Sem transformar hipótese em dívida:

- competências auditadas: **45/90**;
- candidatas individuais abertas: **31**;
- vias individuais acumuladas: **26 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- achados de classe: **3** — `CLASS-001`, `CLASS-002`, `CLASS-003`;
- classe dos três: `CONFIRMADO-ATUAL`;
- via dos três: `CODIGO`;
- correções do Gate B: **0**.

A projeção de +40–50 candidatas nas 57 competências que restavam antes do Lote 4 foi registrada na proposta Gate B′ apenas como **projeção de planejamento**, não como contagem confirmada.

## 6. Disciplina de evidência e VIA DE RESOLUÇÃO

Classes obrigatórias da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Na Issue #48, `CANDIDATA` continua hipótese e não vira dívida confirmada sem prova/decisão suficiente.

Achado estrutural revalidado pode existir como `ACHADO-DE-CLASSE` separado das candidatas. Não duplicar causa única em um GAP por competência.

Cada candidata recebe uma via:

- `CODIGO` — prova de fonte/cânone/DAG/mastery;
- `SIMULACAO` — campanha Gate G;
- `CRIANCA` — observação Gate J.

A via não inicia gate futuro nem autoriza correção.

## 7. CLASS-001 — contrato estrutural de nível

Confirmado no Lote 3 e externamente verificado pelo usuário:

- `generators.ts`: 4;
- `generatorsF1.ts`: 4;
- `generatorsF2.ts`: 4;
- `generatorsVisual.ts`: **6/6**;
- total: 18.

Gate proposto, não implementado: teste AST/estático falha quando um gerador declara `lvl` e não o referencia no corpo executável; wrappers que encaminham passam; `_lvl` é supressão explícita; erro identifica arquivo/função.

O Lote 4 **não implementou** esse gate.

## 8. Dívidas preservadas — classificação de evidência

| Item | Classe atual | Base |
|---|---|---|
| **15 competências legado** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica |
| **11 divergências ficha↔screen** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica |
| **`Moedas` / GM.03** | **CONFIRMADO-ATUAL** | dívida preservada |
| **hardening/performance + warning de bundle** | **CONFIRMADO-ATUAL** | build final |
| **Issue #48** | **DÍVIDA-REGISTRADA** | registro vivo Gate B |
| **Observatório / Research Foundry** | **DÍVIDA-REGISTRADA** | PRE-CANONICAL; subordinado a #47 |

N4.02 e N4.05 permanecem legados; o Lote 4 não os migrou.

## 9. Gate J — precondição não renovável: LINHA DE BASE

**Estado:** `DÍVIDA-REGISTRADA` — requisito registrado, coleta não iniciada.

Antes do primeiro uso sério por cada criança, coletar uma **linha de base fora do motor adaptativo, em papel**. Depois do primeiro uso sério, o ponto inicial é irrecuperável.

Isso não inicia Observatório nem Gate J.

## 10. Mapa de autoridades pós-90/90

- governança/Child-Ready: Issue #47;
- estado operacional: `PROMPT_DE_RETOMADA.md`;
- Gate B/gaps: Issue #48;
- Lote 1: `GATE_B_LOTE_1_N1_AUDITORIA.md`;
- Lote 2: `GATE_B_LOTE_2_N2_AUDITORIA.md`;
- Lote 3: `GATE_B_LOTE_3_N3_AUDITORIA.md`;
- Lote 4: `GATE_B_LOTE_4_N4_AUDITORIA.md`;
- índice executivo: este arquivo;
- fontes executáveis: Coverage Matrix, DAG, fichas, runtime map, Radar/misconceptions, canário e testes conforme autoridade específica;
- Observatório Foundry: apoio subordinado à Issue #47 por D067.

A proposta Gate B′ é comentário na Issue #47 e não substitui a autoridade da própria Issue.

## 11. Governança vigente

- `main` não é área de trabalho;
- PR #35 permanece `open + draft + unmerged`;
- não marcar ready;
- não habilitar auto-merge;
- não mergear;
- Gate B serializado por domínio/lote;
- lote audit-only não corrige a própria descoberta;
- não alterar runtime/Matrix/canário/DAG;
- não implementar o gate de `CLASS-001` neste lote;
- não ativar Gate B′ sem decisão posterior;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de o snapshot do **Lote 4/N4** possuir **CI + Certificação transversal verdes no mesmo SHA**, confirmar governança e parar. N5 precisa de nova autorização explícita.