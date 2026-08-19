# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47 — `Integração Sistêmica e Child-Ready`  
**Estado:** Gate A fechado; Gate B aberto em lotes; Gates C–J não iniciados.

Este arquivo é um **índice executivo**. Ele aponta para fontes canônicas e registra estado/classificação; não substitui Issue #47, Issue #48 nem documentos especializados. GitHub remoto e autoridades executáveis do HEAD vencem este índice se houver divergência.

## 1. Modo operacional

A Fábrica Curricular Principal foi formalmente concluída em `fallback=0` e `90/90` competências servidas. O modo do projeto é:

**Integração Sistêmica e Child-Ready**.

Isso não declara o produto Child-Ready. A Definition of Child-Ready e a ordem dos gates pertencem à Issue #47.

## 2. Gates A–J — estado atual

| Gate | Estado atual | Fonte canônica / próxima autoridade |
|---|---|---|
| **A — Fechamento curricular executável 90/90** | **FECHADO-COM-RECIBO** | Coverage Matrix + checkpoints finais + workflows dos SHAs `efd270b…` e `dc6c21c…` |
| **B — Mega-auditoria curricular e de microprogressão** | **ABERTO EM LOTES** | Issue #47 §3 + Issue #48 + auditorias de lote |
| **C — Player/Tutor e política de ajuda** | **NÃO INICIADO** | Issue #47 §4 + `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md` — revalidar antes de usar |
| **D — Orquestração adaptativa como uma única vida pedagógica** | **NÃO INICIADO** | Issue #47 §5 + runtime/Sensei/estado real a revalidar |
| **E — Telemetria, observabilidade, dados e recuperação** | **NÃO INICIADO** | Issue #47 §6 + `AI_Studio_Lab/DADOS_E_RETENCAO.md` — histórico a revalidar |
| **F — UX/UI/Design System e operação sem adulto** | **NÃO INICIADO** | Issue #47 §7 + `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` — revalidar |
| **G — Aprendiz Simulado como catraca longitudinal** | **NÃO INICIADO** | Issue #47 §8 + `AI_Studio_Lab/arquitetura/ENGENHARIA_DE_SIMULACAO.md` + implementação real a revalidar |
| **H — Campanha E2E da vida completa** | **NÃO INICIADO** | Issue #47 §9 + sondas/E2E reais |
| **I — Performance, robustez e release hardening** | **NÃO INICIADO** | Issue #47 §10 + build/CI/runtime |
| **J — Piloto infantil silencioso e calibração** | **NÃO INICIADO** | Issue #47 §11 + precondição de linha de base |

A ordem recomendada permanece a da Issue #47 §15. Gate B está sendo serializado por domínio; nenhum lote autoriza automaticamente o seguinte.

## 3. Gate A — recibo de fechamento

Classificação: **FECHADO-COM-RECIBO**.

### Promoção técnica final W50

- SHA técnico: `efd270b732752ebe0d38a47efff47d958e352802`;
- CI: `32196855192` — `completed/success`;
- Certificação transversal: `32196855356` — `completed/success`, 9/9;
- Matrix observada: **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**;
- cobertura final: **90 competências / 94 fichas autorais**.

### Fechamento documental independente

- SHA documental: `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI: `32197697198` — `completed/success`;
- Certificação transversal: `32197697050` — `completed/success`, 9/9.

Fontes de detalhe:

- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W50_N5_05_F86_FECHADA_2026-08-18.md`;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_FINAL_90_DE_90_2026-08-18.md`;
- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`.

## 4. Gate B — mega-auditoria em lotes

**Estado:** ABERTO, não fechado.

### Lote 1 — N1

- escopo: `N1.01–N1.13`, **13/13**;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_1_N1_AUDITORIA.md`;
- snapshot: `ad1b239457371a1f411001fd8521984eeadb94fe`;
- achados: **10 CANDIDATAS**, `GAP-002`–`GAP-011`;
- classe dos 10: `HIPÓTESE-A-PROVAR`;
- certificação: CI `32209683689` success + transversal `32209683699` success 9/9;
- correções: 0.

Classificação retroativa de **VIA DE RESOLUÇÃO**, registrada na Issue #48 sem alterar o SHA/estado das candidatas:

- `CODIGO`: **7** — GAP-002, 003, 004, 007, 008, 010, 011;
- `CRIANCA`: **3** — GAP-005, 006, 009;
- `SIMULACAO`: **0**.

### Lote 2 — N2

- escopo: `N2.01–N2.07`, **7/7**;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_2_N2_AUDITORIA.md`;
- estado neste snapshot: auditoria materializada; certificação do SHA deste lote é obrigatória antes da parada;
- achados novos: **10 CANDIDATAS**, `GAP-012`–`GAP-021`;
- classe dos 10: `HIPÓTESE-A-PROVAR`;
- vias: **9 CODIGO / 1 SIMULACAO / 0 CRIANCA**;
- correções: 0.

Resumo dos achados N2:

- N2.02: produção/escrita prometida pelo contrato sem evidência executável; mastery de vizinhos sem cobertura obrigatória das quatro direções; relação longitudinal +5 com AL.03 a provar por simulação;
- N2.03: mastery pode não amostrar `>`, `<` e `=`;
- N2.04: legado colapsa a escada F37 e não realiza a troca 10 dezenas→1 centena; casos C/D/U excluem zeros internos;
- N2.05: legado ignora `lvl` e só arredonda dezenas em números de duas casas, divergindo da escada F65;
- N2.06: um caso fixo por nível dentro de mastery;
- N2.07: um caso fixo por nível e divergência de faixa `F2` TS ↔ `F3` grafo/F66.

**Próximo lote proposto, não iniciado:** **Gate B · Lote 3 — N3**.

## 5. Disciplina de evidência e VIA DE RESOLUÇÃO

Classes obrigatórias da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Na Issue #48, `CANDIDATA` continua hipótese e não pode ser chamada de dívida confirmada sem prova/decisão suficiente.

Cada candidata do Gate B também recebe uma **via de resolução**:

- `CODIGO` — encerra por prova de fonte executável/cânone/DAG/mastery;
- `SIMULACAO` — encerra somente em campanha do Aprendiz Simulado / Gate G;
- `CRIANCA` — encerra somente em observação infantil / Gate J.

A via não inicia o gate futuro nem autoriza correção. Ela apenas estaciona o tipo de evidência necessário.

## 6. Dívidas preservadas — classificação de evidência

| Item | Classe atual | Base |
|---|---|---|
| **15 competências legado** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica. |
| **11 divergências ficha↔screen** | **CONFIRMADO-ATUAL** | Coverage Matrix final técnica. |
| **`Moedas` / GM.03** | **CONFIRMADO-ATUAL** | primitiva autoral ausente/dívida preservada. |
| **hardening/performance + warning de bundle** | **CONFIRMADO-ATUAL** | build final verde com warning preservado. |
| **Issue #48** | **DÍVIDA-REGISTRADA** | registro vivo do Gate B; candidatas internas não são dívidas confirmadas. |
| **Observatório / Research Foundry** | **DÍVIDA-REGISTRADA** | PRE-CANONICAL, implementação não autorizada; subordinado à Issue #47 por D067. |

Documento antigo não vira `CONFIRMADO-ATUAL` por existir. O Lote 2 explicitamente rejeitou transformar uma afirmação histórica de F61 sobre N2.04 em gap quando GM.05 TS + DAG vivos já descrevem outro contrato.

## 7. Gate J — precondição não renovável: LINHA DE BASE

**Estado:** `DÍVIDA-REGISTRADA` — requisito registrado, coleta não iniciada.

Antes do **primeiro uso sério** por cada criança, coletar uma **linha de base fora do motor adaptativo, em papel**. Depois do primeiro uso sério, o ponto inicial é irrecuperável e medidas de ganho perdem interpretação limpa em relação ao estado de partida.

Fontes de apoio subordinadas à Issue #47:

- `dyegorodrigues/SAGA-Research-Foundry` — `05_decisions/DECISION_LEDGER.md`, D067;
- `dyegorodrigues/SAGA-Research-Foundry` — `03_architecture/OBSERVATORIO_E_AUDITORIA.md`, Parte 2.

Isso não inicia Observatório nem Gate J.

## 8. Mapa de autoridades pós-90/90

- **Governança/Definition of Child-Ready:** Issue #47.
- **Estado operacional:** `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.
- **Gate B / gaps:** Issue #48.
- **Auditoria N1:** `GATE_B_LOTE_1_N1_AUDITORIA.md`.
- **Auditoria N2:** `GATE_B_LOTE_2_N2_AUDITORIA.md`.
- **Índice executivo:** este arquivo.
- **Gate C:** `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`, após revalidação.
- **Gate E:** `DADOS_E_RETENCAO.md`, após revalidação.
- **Gate F:** `DESIGN_ESTADO_E_DECISOES.md`, após revalidação.
- **Gate G:** `ENGENHARIA_DE_SIMULACAO.md` + implementação/testes reais, somente quando autorizado.
- **Fontes executáveis:** Coverage Matrix, DAG, fichas, runtime map, evidências, Radar/misconceptions, canário e testes conforme autoridade específica.
- **Observatório Foundry:** apoio subordinado à Issue #47; D067 vence a leitura antiga de fila paralela.

## 9. Governança vigente

- `main` não é área de trabalho;
- PR #35 permanece `open + draft + unmerged`;
- não marcar ready;
- não habilitar auto-merge;
- não mergear;
- Gate B é serializado por domínio/lote;
- lote audit-only não corrige a própria descoberta;
- não alterar runtime/Matrix/canário/DAG durante lote audit-only;
- não iniciar Gates C–J por causa da via registrada;
- não tocar Creature Engine/Tamagotchi;
- nenhuma candidata vira dívida confirmada sem evidência/decisão da classe adequada;
- CI verde isolado nunca significa Child-Ready.

Depois de o snapshot do **Lote 2/N2** possuir **CI + Certificação transversal verdes no mesmo SHA**, confirmar governança e parar. N3 precisa de nova autorização explícita.
