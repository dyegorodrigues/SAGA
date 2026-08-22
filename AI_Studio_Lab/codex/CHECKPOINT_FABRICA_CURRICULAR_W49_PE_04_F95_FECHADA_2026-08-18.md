# CHECKPOINT — FÁBRICA CURRICULAR W49 · PE.04/F95 FECHADA

**Data:** 18/08/2026  
**Repo:** `dyegorodrigues/SAGA`  
**PR:** #35  
**Branch:** `codex/fechamento-curricular`

## 1. Resultado

**W49 — PE.04 / F95 — Estatística e Chance está FECHADA tecnicamente.**

SHA técnico final:

`2bc6424205ce6bafe377a0290e7d242ce73042f5`

Recibos técnicos vinculantes no mesmo SHA:

- CI `32186216685` — **completed/success**;
- Certificação transversal `32186216686` — **completed/success, 9/9**.

No SHA técnico final:

- Auditoria do catálogo: success;
- Auditoria das fichas: success;
- Conformidade: success;
- DAG/grafo: success;
- TypeScript: success;
- **243 arquivos / 3.407 testes: success**;
- build: success;
- guarda textual: success;
- Sonda real Sensei: success;
- higiene do diff: success;
- guarda de binários: success.

Este checkpoint formaliza documentalmente o fechamento técnico. O commit documental que introduz checkpoint + Estado + porta de retomada deve obter CI + Certificação transversal próprios antes de abrir W50.

## 2. Seleção causal

Depois do fechamento documental verde da W48 (`bca18663b9d7b9f683af78962f238ac80d2f35f3`, CI `32166792755`, transversal `32166792851`), a Matrix e o DAG foram recalculados.

- `PE.04`: prerequisitos `PE.03 + N6.03` servidos; `causalWave=15`;
- `N5.05`: prerequisitos `N5.04 + N6.04` servidos; `causalWave=16`;
- downstream residual empatado em zero.

O menor `causalWave` decidiu corretamente: **W49 = PE.04/F95**.

## 3. Cadeia regression-first → inativo → promoção

### 3.1 Regression-first

SHA:

`a98f091801c0b2585ff57586d073eb706fd65465`

Recibos:

- CI `32167817721` — **completed/failure nominal**;
- Certificação transversal `32167817676` — **completed/success**.

No CI, catálogo, fichas, conformidade, DAG e TypeScript passaram. A falha exclusiva ocorreu em `src/curriculum/estatisticaChanceW49.test.ts` porque `JOURNEY_FICHAS.find(item => item.id === "PE.04")` retornava `undefined`.

- **242 arquivos anteriores passaram; somente o novo arquivo regression-first falhou**;
- **3.390 testes anteriores passaram; 1/3.391 falhou**;
- Matrix permaneceu `73 Composer / 15 legado / 2 fallback / 88 servidas / 11 divergências`.

O vermelho foi nominal e exclusivamente causado pela ausência de PE.04. O contrato não foi relaxado.

### 3.2 Materialização inativa

A F95 foi materializada como continuação causal de PE.03/F83, reutilizando **SingaporeBars + ArrayGrid** sem criar primitiva autoral paralela.

Escada conceitual:

1. certo / possível / impossível;
2. mais provável / menos provável;
3. chance como fração dos casos favoráveis sobre o total;
4. frequência observada após repetições;
5. contagem de possibilidades.

Misconceptions canônicas:

- `FALACIA_APOSTADOR`;
- `TUDO_CINQUENTA`;
- `IGNORA_TOTAL`.

A materialização preserva:

- domínio 3/3 em 2 sessões;
- evidência P13 real de chance como fração no L3;
- prova negativa de que resposta errada não emite essa evidência;
- resolução declarativa;
- Radar canônico;
- ajuda/resolução assistida sem crédito de mastery independente;
- interação por toque amplo e separação entre erro motor e misconception.

Primeiro candidato inativo:

`eecb65c050c39ce69f18c42f504c160d02238fb3`

O wiring P13 central foi então completado, sem tocar promoção, no SHA inativo final:

`ba03c90bab7dd49b580338a0c6df2a912e3716c7`

Recibos vinculantes do inativo final:

- CI `32169040052` — **completed/success**;
- Certificação transversal `32169040050` — **completed/success, 9/9**.

Até esse portão, `PE.04` permaneceu fora do canário e não existiam `W49-PE.04` nem baseline de promoção.

### 3.3 Promoção atômica

SHA:

`2bc6424205ce6bafe377a0290e7d242ce73042f5`

O diff contra o inativo final contém exatamente os três governantes:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `PE.04`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger `W49-PE.04`, delta `{ composer:+1, fallback:-1, served:+1 }`;
3. `src/curriculum/coverageMatrix.test.ts` — contrato `74/15/1/89/11`.

A Matrix executável observou exatamente esse delta. Não houve reparo de runtime, observador ou baseline.

## 4. Coverage Matrix observada pós-W49

- competências: **90**;
- fichas autorais: **94**;
- Composer: **74**;
- legado: **15**;
- fallback: **1**;
- servidas: **89**;
- divergências ficha↔screen: **11**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- primitiva ausente conhecida: **Moedas**.

Único fallback real restante:

- `N5.05` — F86, Multiplicar Frações.

## 5. Próxima seleção — somente candidata

`N5.05/F86` é a única candidata residual observada neste estado, mas **W50 ainda não está aberta**.

Somente depois que o SHA documental deste fechamento obtiver CI + Certificação transversal verdes deve-se reancorar o remoto, recalcular Matrix/DAG e confirmar prerequisitos/autoridades antes do regression-first da W50.

## 6. Resíduos conscientemente preservados

O fechamento da W49 não apaga:

- **15 competências legado**;
- **11 divergências ficha↔screen**;
- `Moedas`, ainda ausente e relevante para GM.03;
- warning de tamanho de bundle / hardening de performance;
- Issue #47 — **Integração Sistêmica e Child-Ready**;
- Issue #48 — **lacunas microcurriculares/microprogressão**;
- frente Observatório na Research Foundry, ainda P&D e sem autorização de implementação.

`fallback=0`, quando alcançado na onda final, significará encerramento da fábrica curricular principal, não produto Child-Ready.

## 7. Regra de retomada

1. confirmar PR #35 open + draft + unmerged e `main` intocada;
2. confirmar o HEAD remoto e os workflows deste fechamento documental;
3. exigir CI + transversal verdes desse próprio SHA;
4. recalcular Matrix/DAG;
5. executar W50 somente se N5.05 continuar sendo o fallback residual real;
6. preservar o protocolo regression-first → inativa → promoção atômica → fechamento;
7. ao alcançar `fallback=0`, fazer o fechamento formal da fábrica e **parar antes da fase pós-90/90**.
