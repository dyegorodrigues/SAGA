# CHECKPOINT — Fábrica Curricular W50 · N5.05/F86 — FECHADA TECNICAMENTE

Data: 2026-08-18  
Repo: `dyegorodrigues/SAGA`  
PR: `#35`  
Branch: `codex/fechamento-curricular`

## 1. Correção de auditoria

Este checkpoint foi criado prematuramente numa sessão anterior, antes de existir o commit técnico de promoção de W50. A irregularidade foi detectada, registrada no corpo do PR e corrigida sem apagar o histórico.

Os commits documentais prematuros permanecem rastreáveis:

- `f208a1750d9084aeabf7ac3c1efdff63f5d5ebe5`;
- `a6b19c05ce20bf3aaf0cac53caf3ec9d2122c8e2`.

Eles não são recibos de promoção W50 e não devem ser reutilizados como tal.

## 2. Competência

- onda: **W50**;
- competência: `N5.05`;
- ficha: **F86 — Multiplicar Frações**;
- primitiva/runtime reutilizado: `ArrayGrid#área` / `MultiplicarFracoesStage`;
- estado técnico final: **promovida para Composer**.

Escada canônica preservada: fração de inteiro → modelo de área → fração × fração pela interseção → generalização simbólica → divisão como “quantas frações cabem”.

## 3. Cadeia técnica real

### Regression-first

`609217223cd3ab29e264762d32ec8c5ef01d78f1`

Não foi refeito durante a correção.

### Materialização inativa

- núcleo: `3e2b9e1ac6bfd79ea043c847f8d7b33ec9d086bc`;
- candidato completo: `bc865d5c037242bedd433b90a298e944c260aa54`.

### Reparos reais de acessibilidade

- `50d74e93c96dc88628f208be787e3fc853ea1136`;
- `2d250b39ea8d32d4a9aa92b2797a44d5da49efa4`.

Os reparos corrigiram problemas ARIA reais detectados pela auditoria; testes e critérios de acessibilidade não foram relaxados.

### Portão inativo final

SHA: `340f219a8eae3b3a71215d7a23e8e81a032afe1b`

- CI `32191494936` — **completed/success**;
- Certificação transversal `32191494957` — **completed/success, 9/9**.

## 4. Promoção atômica corrigida

SHA técnico final W50:

`efd270b732752ebe0d38a47efff47d958e352802`

O commit contém simultaneamente os três governantes da promoção:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `N5.05`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger nominal `W50-N5.05` com delta `{ composer:+1, fallback:-1, served:+1 }` e rationale do portão inativo;
3. `src/curriculum/coverageMatrix.test.ts` — contrato reconciliado com a fonte real.

Nenhum baseline foi alterado para fabricar verde.

## 5. Recibos técnicos finais do próprio SHA

- CI `32196855192` — **completed/success**;
- Certificação transversal `32196855356` — **completed/success, 9/9**.

No CI técnico:

- Gates verdes;
- catálogo, fichas, conformidade e DAG verdes;
- TypeScript verde;
- **245 arquivos / 3.429 testes** verdes;
- build verde;
- Sonda real Sensei verde;
- higiene do diff verde;
- guarda de binários verde.

O build continua emitindo warning de tamanho do bundle; isso permanece dívida explícita de hardening/performance, não foi escondido nem convertido em falso verde.

## 6. Coverage Matrix observada

A fonte executável observou no SHA técnico final:

- **90 competências**;
- **94 fichas autorais**;
- **75 Composer**;
- **15 legado**;
- **0 fallback**;
- **90 servidas**;
- **11 divergências ficha↔screen**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- primitiva bloqueadora ainda ausente: `Moedas`, em GM.03.

Portanto W50 está **tecnicamente FECHADA** e a fábrica curricular principal atingiu tecnicamente `fallback=0` e `90/90 servidas`.

## 7. O que este checkpoint NÃO declara sozinho

O fechamento **formal/documental** da fábrica exige um HEAD documental posterior contendo este checkpoint reconciliado, `CHECKPOINT_FABRICA_CURRICULAR_FINAL_90_DE_90_2026-08-18.md`, `ESTADO_DO_FECHAMENTO.md` e `PROMPT_DE_RETOMADA.md`, seguido por CI e Certificação transversal próprios desse HEAD.

Os recibos técnicos `32196855192` / `32196855356` não certificam o commit documental posterior.

## 8. Dívidas preservadas

Mesmo com `fallback=0`:

- 15 competências legado permanecem observadas;
- 11 divergências ficha↔screen permanecem observadas;
- `Moedas` / GM.03 permanece dívida real;
- hardening/performance e warning de bundle permanecem abertos;
- Issue #47 — Integração Sistêmica e Child-Ready — permanece pós-fábrica;
- Issue #48 — lacunas microcurriculares/microprogressão — permanece pós-fábrica;
- Observatório na `SAGA-Research-Foundry` permanece P&D com `implementation_authorized: false`;
- qualquer dívida futura observada por gates/runtime continua vinculante.

`fallback=0` **não significa Child-Ready**.

Nenhuma fase pós-90/90 foi iniciada neste fechamento.