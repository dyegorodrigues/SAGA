# CHECKPOINT — FÁBRICA CURRICULAR W15–W19 FECHADA — 2026-08-14

## Estado certificado do bloco

Repo: `dyegorodrigues/SAGA` · PR #35 · branch `codex/fechamento-curricular`.

Código curricular fechado no SHA `ecdbd3251fa1cc7b170e57bf6da2ad38c4aa6354` com os dois workflows verdes no MESMO SHA:

- CI `31799848732` — Gates, Sonda real Sensei, Higiene e Binários: **success**;
- Certificação transversal `31799848715` — oito sementes 390 px + 320/900 px: **success**.

Matrix pós-W19 observada e reconciliada:

`44 Composer / 15 legado / 31 fallback / 59 servidas / 11 divergências / 12 swaps / 44 estreias`

**Restam 31 fallbacks.** Legado continua contando como servido; não migrar por estética.

## W15 — N5.01 / F45 — Partes iguais

- regression-first: `43373a1f502fdb8484f55485b27c9c3fe03b03a9` — 2026-08-14 01:06:50Z;
- implementação: `PartesIguaisStage`, compondo `ShapeCanvas#partição` + `SingaporeBars`, com equipartição real e alternativa por toque;
- inativo certificado: `b32bee4ce065c7276e0473aef345576bd5d5fee6` — CI `31760839221` + transversal `31760839210`;
- promoção isolada: `baa382a073861f49e4cdd971b722d056cee704b0`;
- recibo final: `2ca2fb0a960309a8a88cc5b171a359e2bcbfde8e` — CI `31761922513` + transversal `31761922470`;
- Matrix: `40 / 15 / 35 / 55 / 11`;
- tempo regression→recibo: **0,75 h**.

## W16 — N5.02 / F72 — A fração é um número

- regression-first: `bb1ef0e900cf0f72bfa9ba0f54964873d7fd1be5` — 2026-08-14 01:59:49Z;
- implementação: `FracaoNumeroStage`, compondo `SingaporeBars` + `InteractiveNumberLine` e preservando barra, coleção e reta;
- inativo certificado: `4789636c` — CI `31764367753` + transversal `31764367742`;
- promoção isolada: `a3bcf4278691c4706e4a6ef1ce21d94b6fc67530`;
- recibo final: `138da994072c7ec9c735381dc56188646771a27f` — CI `31765155011` + transversal `31765155010`;
- Matrix: `41 / 15 / 34 / 56 / 11`;
- tempo regression→recibo: **0,91 h**.

## W17 — N6.01 / F75 — Décimos e centésimos

- regression-first: `536780b962cbd8b0a2d7e7831aaa80ae4c97d7b1` — 2026-08-14 03:02:49Z;
- implementação: `DecimalStage`, relendo o `Quadrado100` inteiro como unidade, décimo e centésimo;
- inativo certificado: `f52d74aa` — CI `31766412517` + transversal `31766412457`;
- promoção isolada: `b9dc5999f1906cb929f3661c8e45889ac99e2e7f`;
- recibo final: `307444929371a91c29c444bf3314402904a1640f` — CI `31766921778` + transversal `31766921781`;
- Matrix: `42 / 15 / 33 / 57 / 11`;
- tempo regression→recibo: **0,43 h**.

## W18 — N5.03 / F73 — Frações equivalentes

- regression-first: `4354372a8ef97b8c6e01182cc49333511cf5c3db` — 2026-08-14 03:36:46Z;
- implementação: `FracoesEquivalentesStage`, usando `SingaporeBars` de mesmo comprimento para equivalência e comparação;
- houve uma inversão operacional: o ledger foi escrito como se a promoção já existisse, mas o remoto ainda mantinha N5.03 fora de `composerCanaryIds.ts`;
- correção: promoção real e isolada em `ecdecfec30981e34bb8eb0162c72bee467e5cb71`;
- prova imediatamente posterior, antes de novo ledger: CI `31795872830` observou **43 Composer / 15 legado / 32 fallback / 58 servidas / 11 divergências**; as falhas de W18/Matrix/onboarding desapareceram e restou somente a regressão intencional da W19;
- o fechamento verde integral de W18 fica subsumido pelo recibo final do bloco em `ecdbd325...`, após a W19.

### Regra reforçada pela W18

**Runtime/prova primeiro; texto depois.** A ordem obrigatória é: promoção remota real → Matrix observa delta real → ledger/checkpoint. Documento não pode antecipar canário, Matrix ou recibo.

## W19 — N4.10 / F69 — Divisão longa

- regression-first: `31ecbd6a4f50ad85e9625d75e0cf4f2b22b1086b` — 2026-08-14 04:01:05Z;
- ficha canônica: `ArrayGrid + InteractiveVertical`, com revelação progressiva;
- implementação registrada e inativa: `DivisaoLongaStage`, `divisaoLongaContract`, procedimento de resto válido, evidência do zero posicional e `InteractiveVerticalDivisionSurface`;
- sonda Chrome real própria: 15 cenários = 320/390/900 × L1–L5;
- inativo certificado: `4ed4858d83d34180243edd5a8646c9feea64ace2` — CI `31798437057` + transversal `31798437091`;
- promoção isolada: `056c19e3642aeb768b89b456d2b71ebb714dee0e`;
- Matrix observou **44 / 15 / 31 / 59 / 11** antes do ledger;
- reconciliação declarativa: `e07c4b8fb44f8f8788622cea45d77f2561dc960c`;
- correção final do contrato de `contentStatus` (`explicit`, não `served`): `ecdbd3251fa1cc7b170e57bf6da2ad38c4aa6354`;
- recibo de código da W19/bloco: CI `31799848732` + transversal `31799848715`, ambos **success** no mesmo SHA.

## Correção arquitetural — Matrix e mapa runtime voltam a ser declarativos

Durante W16–W18 apareceu um atalho de implementação que mutava `COVERAGE_BASELINE`/`COVERAGE_MIGRATIONS` por efeito de import (`push` + `Object.assign`) e transformava o mapa runtime com wrapper `.map()`.

Isso foi removido. Não havia uma razão arquitetural que justificasse dependência de ordem de carregamento num instrumento de auditoria. Estado atual:

- `coverage_matrix.ts` é apenas re-exportação;
- `coverage_matrix_core.ts` contém o ledger W1–W19 estaticamente declarado e deriva `COVERAGE_BASELINE` de `COVERAGE_CLOSED_BASELINE + deltas` sem mutação de import;
- `ficha_runtime_map.cjs` voltou a ser array declarativo explícito;
- `ficha_runtime_map_core.cjs` foi removido.

**Invariante novo:** estado de auditoria/Matrix/mapa runtime não deve depender de efeitos colaterais de import nem de ordem de carregamento.

## Sonda F14 e fonte externa

Uma execução real voltou a encontrar 404 de `fonts.gstatic.com`. A causa de produto — fonte externa — continua dívida conhecida. A instrumentação F14 agora ignora somente resposta >=400 cujo `resourceType` seja `font` e cuja origem seja `https://fonts.gstatic.com/`; falhas HTTP do aplicativo continuam derrubando a sonda. Hospedar a fonte localmente continua sendo a correção de produto devida, fora do caminho crítico curricular deste bloco.

## Medição fallback × legado

Metodologia: tempo de parede entre regression-first e recibo final da onda. Série histórica de legado permanece `n=9`, média **3,49 h**, mediana **2,78 h**.

Para fallback, as ondas limpas mensuráveis agora são W5 `2,84 h`, W13 `3,02 h`, W14 `3,07 h`, W15 `0,75 h`, W16 `0,91 h`, W17 `0,43 h`: `n=6`, média **1,84 h**, mediana **1,87 h**.

W18 e W19 não entram nessa média de throughput: atravessaram interrupção de sessão, recuperação do conector e reparo do protocolo, portanto o tempo de parede bruto mede indisponibilidade/orquestração além do custo da onda. A queda forte em W15–W17 é compatível com o ganho da paralelização das oito sementes, mas a amostra ainda é pequena.

## Ambiente e invariantes

Nesta sessão não havia checkout local executável; portanto não há alegação de portões locais. A certificação usada foi a remota, por SHA exato, com os dois workflows obrigatórios.

PR #35 permanece draft; `main` não foi tocada; nenhum merge/ready/auto-merge foi executado.

## Próximo passo

Abrir W20 somente após reancorar no HEAD remoto e recalcular Matrix + DAG vivos. A lista histórica não escolhe a próxima competência. O próximo bloco de reporte é **W20–W24**, salvo condição de parada real ou descoberta que altere protocolo.
