# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47 — `Integração Sistêmica e Child-Ready`  
**Estado:** Gate A fechado; Gate B aberto em lotes; Gates C–J não iniciados.

Este arquivo é um **índice executivo**. Ele aponta para fontes canônicas e registra estado/classificação; não substitui Issue #47, Issue #48 nem documentos especializados. GitHub remoto e autoridades executáveis do HEAD vencem este índice se houver divergência.

## 1. Modo operacional

A Fábrica Curricular Principal foi formalmente concluída em `fallback=0` e `90/90` competências servidas. O modo do projeto é **Integração Sistêmica e Child-Ready**.

Isso não declara o produto Child-Ready. A Definition of Child-Ready e a ordem dos gates pertencem à Issue #47.

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

- escopo curricular: `N3.01–N3.13`, **13/13**;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_3_N3_AUDITORIA.md`;
- achado estrutural prévio: **`CLASS-001`**, `CONFIRMADO-ATUAL`, via `CODIGO`;
- `CLASS-001`: **18 geradores** declaram `lvl` sem referenciá-lo diretamente no corpo;
- candidatas N3: **7**, `GAP-022`–`GAP-028`;
- classe das 7: `HIPÓTESE-A-PROVAR`;
- vias das 7: **7 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- correções: 0;
- runtime/Matrix/canário/DAG: intocados.

#### CLASS-001 — distribuição

- `src/utils/generators.ts`: 4;
- `src/utils/generatorsF1.ts`: 4;
- `src/utils/generatorsF2.ts`: 4;
- `src/utils/generatorsVisual.ts`: 6.

Gate proposto, não implementado: teste estático/AST deve falhar para gerador que declara `lvl` e não o referencia no corpo executável. Wrappers que encaminham `lvl` passam; `_lvl` funciona como supressão explícita. O gate não pode ser ativado até uma frente autorizada reconciliar os casos existentes.

#### Candidatas N3

- GAP-022 — N3.04 não exige a flexibilidade voltar↔completar que o cânone usa como critério de domínio;
- GAP-023 — N3.06 pode satisfazer a janela sem provar quase-dobros;
- GAP-024 — N3.07 colapsa L2–L5 numa única família de reta e não materializa `bond/math` declarados;
- GAP-025 — F35/F39/F40 exigem `revelacaoProgressiva: true`, mas a norma não possui consumo executável observável no HEAD;
- GAP-026 — N3.10 diverge em prereqs: ficha TS só N3.03; DAG/YAML N3.03+N3.04;
- GAP-027 — N3.10 possui `coversDistinctStructures`, mas a cobertura das quatro estruturas não foi encontrada na concessão real de mastery;
- GAP-028 — N3.13 serve problema de dois passos em vez de cálculo mental/estimativa/seleção de estratégia.

**Próximo lote proposto, não iniciado:** **Gate B · Lote 4 — N4**.

## 5. Disciplina de evidência e VIA DE RESOLUÇÃO

Classes obrigatórias da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Na Issue #48, `CANDIDATA` continua hipótese e não vira dívida confirmada sem prova/decisão suficiente.

Um achado estrutural revalidado pode existir como `ACHADO-DE-CLASSE` separado das candidatas. `CLASS-001` é o primeiro registro desse tipo e **não deve ser expandido artificialmente em um GAP por competência**.

Cada candidata também recebe uma via:

- `CODIGO` — prova de fonte/cânone/DAG/mastery;
- `SIMULACAO` — campanha Gate G;
- `CRIANCA` — observação Gate J.

A via não inicia gate futuro nem autoriza correção.

## 6. Dívidas preservadas — classificação de evidência

| Item | Classe atual | Base |
|---|---|---|
| **15 competências legado** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica |
| **11 divergências ficha↔screen** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica |
| **`Moedas` / GM.03** | **CONFIRMADO-ATUAL** | dívida preservada |
| **hardening/performance + warning de bundle** | **CONFIRMADO-ATUAL** | build final |
| **Issue #48** | **DÍVIDA-REGISTRADA** | registro vivo Gate B |
| **Observatório / Research Foundry** | **DÍVIDA-REGISTRADA** | PRE-CANONICAL; subordinado a #47 |

Oito dos 13 nós N3 permanecem legados; o Lote 3 não os migrou nem corrigiu.

## 7. Gate J — precondição não renovável: LINHA DE BASE

**Estado:** `DÍVIDA-REGISTRADA` — requisito registrado, coleta não iniciada.

Antes do primeiro uso sério por cada criança, coletar uma **linha de base fora do motor adaptativo, em papel**. Depois do primeiro uso sério, o ponto inicial é irrecuperável.

Isso não inicia Observatório nem Gate J.

## 8. Mapa de autoridades pós-90/90

- governança/Child-Ready: Issue #47;
- estado operacional: `PROMPT_DE_RETOMADA.md`;
- Gate B/gaps: Issue #48;
- Lote 1: `GATE_B_LOTE_1_N1_AUDITORIA.md`;
- Lote 2: `GATE_B_LOTE_2_N2_AUDITORIA.md`;
- Lote 3: `GATE_B_LOTE_3_N3_AUDITORIA.md`;
- índice executivo: este arquivo;
- fontes executáveis: Coverage Matrix, DAG, fichas, runtime map, Radar/misconceptions, canário e testes conforme autoridade específica;
- Observatório Foundry: apoio subordinado à Issue #47 por D067.

## 9. Governança vigente

- `main` não é área de trabalho;
- PR #35 permanece `open + draft + unmerged`;
- não marcar ready;
- não habilitar auto-merge;
- não mergear;
- Gate B serializado por domínio/lote;
- lote audit-only não corrige a própria descoberta;
- não alterar runtime/Matrix/canário/DAG;
- não implementar o gate de `CLASS-001` neste lote;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de o snapshot do **Lote 3/N3** possuir **CI + Certificação transversal verdes no mesmo SHA**, confirmar governança, propor N4 sem iniciar e parar.
