# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47 — `Integração Sistêmica e Child-Ready`  
**Estado deste snapshot:** Gate A fechado; **Gate B aberto em lotes — Lote 1/N1 auditado**; Gates C–J não iniciados.

Este arquivo é um **índice executivo**. Ele aponta para as fontes canônicas e registra estado/classificação; não copia nem substitui os documentos especializados. GitHub remoto, fontes executáveis e a Issue #47 vencem este índice se houver divergência.

## 1. Modo operacional

A Fábrica Curricular Principal foi formalmente concluída em `fallback=0` e `90/90` competências servidas. O modo do projeto é:

**Integração Sistêmica e Child-Ready**.

Isso não declara o produto Child-Ready. Significa apenas que a porta de governança pós-fábrica da Issue #47 está ativa.

## 2. Gates A–J — estado atual

| Gate | Estado atual | Fonte canônica / próxima autoridade |
|---|---|---|
| **A — Fechamento curricular executável 90/90** | **FECHADO-COM-RECIBO** | Coverage Matrix + checkpoints finais + workflows dos SHAs `efd270b…` e `dc6c21c…` |
| **B — Mega-auditoria curricular e de microprogressão** | **ABERTO EM LOTES · Lote 1/N1 auditado · Gate não fechado** | Issue #47 §3 + Issue #48 + `AI_Studio_Lab/codex/GATE_B_LOTE_1_N1_AUDITORIA.md` |
| **C — Player/Tutor e política de ajuda** | **NÃO INICIADO** | Issue #47 §4 + `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md` — revalidar antes de usar |
| **D — Orquestração adaptativa como uma única vida pedagógica** | **NÃO INICIADO** | Issue #47 §5 + runtime/Sensei/estado real a revalidar |
| **E — Telemetria, observabilidade, dados e recuperação** | **NÃO INICIADO** | Issue #47 §6 + `AI_Studio_Lab/DADOS_E_RETENCAO.md` — histórico a revalidar |
| **F — UX/UI/Design System e operação sem adulto** | **NÃO INICIADO** | Issue #47 §7 + `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` — revalidar no HEAD relevante |
| **G — Aprendiz Simulado como catraca longitudinal** | **NÃO INICIADO** | Issue #47 §8 + `AI_Studio_Lab/arquitetura/ENGENHARIA_DE_SIMULACAO.md` + implementação real a revalidar |
| **H — Campanha E2E da vida completa** | **NÃO INICIADO** | Issue #47 §9 + sondas/E2E reais a definir e certificar |
| **I — Performance, robustez e release hardening** | **NÃO INICIADO** | Issue #47 §10 + build/CI/runtime; warning de bundle atual permanece evidência |
| **J — Piloto infantil silencioso e calibração** | **NÃO INICIADO** | Issue #47 §11 + precondição de linha de base registrada abaixo |

A ordem recomendada permanece a da Issue #47 §15. Gate B deve avançar por lotes explicitamente autorizados. Este snapshot **não abre N2** e não inicia Gate C ou posteriores.

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

Fontes de detalhe/histórico da fábrica:

- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W50_N5_05_F86_FECHADA_2026-08-18.md`;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_FINAL_90_DE_90_2026-08-18.md`;
- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.

## 4. Gate B — lotes de mega-auditoria

Gate B está **ABERTO**, mas não pode ser tratado como frente monolítica. Cada lote precisa auditar um escopo fechado, registrar candidatas na Issue #48 e parar antes do domínio seguinte.

### Lote 1 — N1 · fundamentos numéricos

- escopo auditado: **N1.01–N1.13, 13/13 competências**;
- documento de evidência: `AI_Studio_Lab/codex/GATE_B_LOTE_1_N1_AUDITORIA.md`;
- candidatas: **GAP-002–GAP-011 = 10**;
- classe §0.2 de todos os achados: **`HIPÓTESE-A-PROVAR`**;
- nenhuma candidata foi promovida a `PROVADA`, `CONFIRMADO-ATUAL` ou dívida confirmada;
- runtime/Matrix/canário/DAG não foram alterados;
- N2 não foi iniciado.

O lote só é considerado materializado com **CI + Certificação transversal success no mesmo SHA** que introduz este snapshot documental. Os recibos devem ser lidos diretamente do remoto; não reutilizar runs de outro SHA.

Próximo lote proposto, **não iniciado**: Gate B · Lote 2 — **N2**.

## 5. Dívidas preservadas — classificação de evidência

As classes abaixo são as da Issue #47 §0.2. Classificar aqui não autoriza iniciar a correção.

| Item | Classe atual | Base da classificação |
|---|---|---|
| **15 competências legado** | **CONFIRMADO-ATUAL** | Coverage Matrix observada no SHA técnico final registra 15 legado. |
| **11 divergências ficha↔screen** | **CONFIRMADO-ATUAL** | Coverage Matrix observada no SHA técnico final registra 11 divergências. |
| **`Moedas` / GM.03** | **CONFIRMADO-ATUAL** | Estado final vigente registra `Moedas` como primitiva autoral ausente/dívida de GM.03. |
| **hardening/performance + warning de bundle** | **CONFIRMADO-ATUAL** | O build do fechamento técnico permaneceu verde com warning de tamanho de bundle explicitamente preservado. |
| **Issue #48 — lacunas microcurriculares/microprogressão** | **DÍVIDA-REGISTRADA** | Issue #48 é o registro vivo do Gate B. Entradas `CANDIDATA` permanecem hipóteses até prova causal/executável. |
| **Observatório / Research Foundry** | **DÍVIDA-REGISTRADA** | Frente `PRE-CANONICAL`, sem autorização de implementação; D067 determina que é material subordinado à Issue #47, não fila paralela. |

Nenhum item `HISTÓRICO-A-REVALIDAR` deve ser promovido a `CONFIRMADO-ATUAL` apenas por existir em roadmap/documento antigo.

## 6. Gate J — precondição não renovável: LINHA DE BASE

**Estado:** `DÍVIDA-REGISTRADA` — requisito registrado, coleta não iniciada.

Antes do **primeiro uso sério** por cada criança, coletar uma **linha de base fora do motor adaptativo, em papel**. Essa medição registra o ponto de partida antes de o SAGA alterar a aprendizagem ou a familiaridade com seus formatos.

A linha de base é um **recurso não renovável**: depois do primeiro uso sério, o dado de partida é irrecuperável e medidas posteriores de ganho deixam de ter interpretação causal limpa em relação ao ponto inicial.

Fontes de apoio subordinadas à Issue #47:

- `dyegorodrigues/SAGA-Research-Foundry` — `05_decisions/DECISION_LEDGER.md`, **D067**;
- `dyegorodrigues/SAGA-Research-Foundry` — `03_architecture/OBSERVATORIO_E_AUDITORIA.md`, **Parte 2 — Avaliar a criança** e seção **Recurso não renovável**.

A precondição deve estar satisfeita **antes do Gate J/piloto infantil**. Este registro não inicia o Observatório nem o piloto.

## 7. Mapa de autoridades pós-90/90

- **Governança geral e Definition of Child-Ready:** Issue #47.
- **Estado operacional / porta de retomada:** `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.
- **Índice executivo:** este arquivo.
- **Gate B / gaps:** Issue #48; documentos de lote são evidência auditável, não segunda autoridade.
- **Gate C:** `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`, após revalidação.
- **Gate E:** `AI_Studio_Lab/DADOS_E_RETENCAO.md`, após revalidação.
- **Gate F:** `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`, após revalidação.
- **Gate G:** `AI_Studio_Lab/arquitetura/ENGENHARIA_DE_SIMULACAO.md` + implementação/testes reais.
- **Fontes executáveis transversais:** Coverage Matrix, DAG, fichas, runtime map, evidências, Radar/misconceptions, canário e testes nominais conforme sua autoridade específica.
- **Roadmaps/auditorias antigos:** evidência histórica até revalidação; nunca estado vivo automático.
- **Observatório Foundry:** apoio subordinado à Issue #47; D067 vence a antiga leitura de fila paralela.

## 8. Governança vigente

- `main` não é área de trabalho;
- PR #35 permanece `open + draft + unmerged`;
- não marcar ready;
- não habilitar auto-merge;
- não mergear;
- Gate B avança apenas no lote explicitamente autorizado;
- não corrigir `CANDIDATA` no mesmo lote audit-only que a descobriu;
- não iniciar Gates C–J por oportunismo;
- não iniciar Observatório;
- não tocar Creature Engine/Tamagotchi;
- nenhuma dívida vira “resolvida” sem evidência da classe adequada;
- CI verde isolado não satisfaz Definition of Child-Ready.

Depois do lote N1 possuir **CI + Certificação transversal verdes no mesmo SHA**, parar. A execução seguinte deve reancorar o remoto e só abrir N2 se houver autorização explícita.