# CHECKPOINT — Reconciliação documental pré-W5 fechada

**Data:** 2026-08-10  
**PR:** #29  
**Branch:** `codex/integrar-bloco-f0`  
**Escopo:** fechamento documental/canônico anterior à W5; nenhum runtime funcional foi autorizado por esta etapa.

## 1. Reancoragem

A retomada foi reancorada no GitHub remoto antes de qualquer edição.

- PR #29: `open + draft + unmerged`;
- branch: `codex/integrar-bloco-f0`;
- HEAD comprovado no início da reconciliação: `f220d0797fedf9b4a2422e5aaa236ec4614ee79f`;
- CI de referência desse HEAD: #983 / run `31411769222`, sucesso integral;
- main protegida de referência: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- review threads: nenhuma thread aberta encontrada.

GitHub remoto permaneceu a fonte da verdade durante todo o trabalho.

## 2. Derivas A–E reconciliadas

### A — Grafo humano

`AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`

- `N1.12` deixou de tratar `numberline` como primitive/kind inexistente ou prioridade futura;
- micros alinhados a F19/runtime vigente:
  - L1: localizar 0–10;
  - L2: saltos para frente em 0–10, magnitude 1–3;
  - L3: saltos para trás em 0–10, magnitude 1–3;
  - L4: localizar 0–20 com numerais parciais;
  - L5: saltos variáveis bidirecionais em 0–20, magnitude 1–4;
- ID, prereqs e topologia do DAG não foram alterados.

### B — Bíblia §9.2

`AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`

- backlog P1–P3 passou a ser identificado explicitamente como snapshot histórico;
- `numberline` e `vertical` não são mais descritos como backlog futuro vigente;
- status atual de primitives remete à Coverage Matrix/auditoria executável/`PRIMITIVAS_SAGA.md`.

### C — Bíblia §12.6

- CI #812 preservado como snapshot histórico;
- Coverage Matrix registrada como executável;
- evolução vigente documentada como snapshot P21.1 imutável + `COVERAGE_MIGRATIONS`;
- W1–W4 registradas como reconciliadas pelo ledger;
- história não foi reescrita para imitar o runtime atual.

### D — Fichas F0

`AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md`

- removida a nota obsoleta de ausência de ficha autoral para GM.02;
- registrada a ficha separada `FICHA_P22_GM_02_TEMPO_COTIDIANO.md`;
- catálogo vigente explicitado como **90 competências / 94 fichas autorais**.

### E — Checkpoint W4

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`

- L2 corrigido de “saltos positivos de 2” para o contrato correto: saltos para frente de magnitude **1–3** em 0–10, com arcos unitários como andaime.

## 3. Auditoria do delta

Comparação acumulada entre `f220d0797fedf9b4a2422e5aaa236ec4614ee79f` e o HEAD documental validado `63b4233f57bd55f87e571ca5e66eb3dd43387816` mostrou somente quatro arquivos documentais alterados:

1. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
2. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`;
3. `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`;
4. `AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md`.

**Nenhum arquivo funcional em `src/` mudou. Nenhum arquivo do Creature Engine entrou no delta.**

Uma remoção textual lateral detectada durante a substituição integral de `FICHAS_F0_COMPLETAS.md` foi restaurada imediatamente antes do fechamento; o delta agregado ficou restrito à nota D pretendida.

## 4. Gates e Coverage Matrix

Os gates completos foram executados contra uma materialização local do mesmo estado remoto:

- `npm run auditar` ✅
- `npm run fichas:auditar` ✅
- `npm run fichas:conferir` ✅
- `npm run grafo:check` ✅
- `npx tsc --noEmit` ✅
- `npm test -- --run` ✅
- `npm run build` ✅
- `npm run pr:check` ✅
- `npm run sonda:sensei-dojo` ✅
- `npm run sonda:reta20` ✅

A Coverage Matrix permaneceu sem delta funcional:

- Composer: **29**
- legado: **22**
- fallback: **39**
- servidas: **51**
- divergências: **17**
- swaps: **12**
- estreias: **44**
- primitive blockers: **`Moedas`, `Regua`**

## 5. CI remoto

O HEAD documental `63b4233f57bd55f87e571ca5e66eb3dd43387816` foi submetido ao CI #989 / run `31417247869`; a conferência foi feita por HEAD exato e por jobs, sem usar CI antigo como substituto.

Este checkpoint é um commit documental adicional. Pela regra de segurança do projeto, **a W5 só pode começar depois de o CI remoto do HEAD que contém este checkpoint também ficar integralmente verde**.

## 6. Estado de fábrica

- W1–W4: funcionalmente fechadas;
- reconciliação documental A–E: **fechada**;
- F19/runtime: **não reabertos**;
- Creature Engine: **intocado**;
- main: **intocada**;
- W5: **ainda não implementada neste checkpoint**.

Próxima operação autorizável, somente após CI verde deste HEAD: gerar/inspecionar a Coverage Matrix viva, calcular impacto causal no DAG e selecionar **uma** competência para W5 sem hardcode por número ou blocker.
