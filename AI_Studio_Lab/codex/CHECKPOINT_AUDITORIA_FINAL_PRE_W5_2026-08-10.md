# CHECKPOINT — AUDITORIA FINAL PRÉ-W5 — 2026-08-10

> Auditoria de consistência executada depois do fechamento funcional/documental da W4. Este checkpoint NÃO reabre N1.12/F19: o runtime da W4 permanece verde e coerente com a ficha autoral. Ele registra deriva documental humana encontrada antes da troca de conversa e bloqueia o início da W5 até a reconciliação textual abaixo.

## 1. Estado remoto reancorado

- repo: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- PR #29: **open + draft + unmerged**;
- main protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- HEAD auditado antes deste checkpoint: `e3e3cfdf57c6a4371d6c8bac993411efba2fdd33`;
- CI #979 / run `31405504346`: **success integral**;
- review threads abertas: 0;
- Creature Engine fora desta fila;
- sem branch auxiliar, merge, rebase, ready ou auto-merge.

## 2. O que está tecnicamente alinhado

### F19 autoral ↔ runtime

A ficha autoral `F19 — A Reta Numérica` e o runtime real concordam:

- L1: localizar 0–10;
- L2: saltar **para frente** em 0–10, magnitude 1–3;
- L3: saltar **para trás** em 0–10, magnitude 1–3;
- L4: localizar 0–20 com numerais de referência parciais;
- L5: saltos variáveis bidirecionais em 0–20, magnitude 1–4.

Arquivos que confirmam o contrato:

- `AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md` — F19;
- `src/curriculum/fichas/jornada/N1.12.ts`;
- `src/curriculum/procedimentos/reta20Contract.ts`;
- `src/curriculum/procedimentos/reta20Procedure.ts`;
- `src/components/primitives/Reta20Stage.tsx`;
- testes e sonda Chrome da W4.

Portanto **não corrigir o runtime para imitar texto documental antigo**. O runtime atual segue a ficha autoral detalhada.

### Grafo executável

`curriculum/grafo_saga.yaml` continua correto para N1.12 no que ele governa: ID, nome, strand, faixa e prereqs `[N1.07, N1.09]`. A W4 não altera topologia do DAG; `npm run grafo:check` passou no CI terminal.

### Coverage Matrix

Baseline vigente confirmado no CI terminal:

- 90 competências / 94 fichas autorais;
- 29 Composer;
- 22 legado;
- 39 fallback;
- 51 servidas;
- 17 divergências ficha↔screen;
- 12 swaps;
- 44 estreias;
- blockers `Moedas`, `Regua`.

## 3. Derivas documentais humanas encontradas

### A. `GRAFO_DE_CONHECIMENTO_SAGA.md` — N1.12 está desatualizada

A entrada humana de N1.12 ainda diz:

- `numberline*`;
- “PRIORIDADE 1 de kind novo — hoje a reta é texto”;
- micros antigos com `vizinhos/entre` e uma única etapa agregada de saltos.

Isso não descreve mais o estado canônico materializado pela F19/W4.

**Reconciliação necessária:** retirar o marcador de kind inexistente e alinhar a descrição dos micros à F19 autoral, sem mudar ID/prereqs/topologia.

### B. `BIBLIA_DO_SAGA.md` — §9.2 mantém backlog de implementação obsoleto

A Bíblia ainda chama `numberline` e `vertical` de “novos necessários / backlog oficial / P1”, embora o runtime auditado já tenha `InteractiveNumberLine` e `InteractiveVertical` executáveis.

A própria v3.5 já estabelece que a fila vigente é `Coverage Matrix → fábrica curricular ...`; portanto §9.2 deve virar **registro histórico**, não fonte de status atual.

**Reconciliação necessária:** desnormatizar o backlog antigo e remeter estado de implementação à Coverage Matrix/auditoria de fichas.

### C. `BIBLIA_DO_SAGA.md` — §12.6 usa CI #812 como se ainda fosse a fotografia operacional

O texto datado do CI #812 é útil como histórico, mas a frase de que a Coverage Matrix ainda seria “a próxima fonte executável” ficou obsoleta depois do fechamento da própria Matrix e das ondas W1–W4.

**Reconciliação necessária:** preservar CI #812 como snapshot histórico e declarar que a Matrix executável vigente + ledger de migrações é a fonte operacional atual.

### D. `FICHAS_F0_COMPLETAS.md` — nota de GM.02 ficou velha

O índice do bloco F0 ainda afirma que `GM.02 (tempo cotidiano) ainda não tem ficha autoral própria`.

Isso foi superado por `AI_Studio_Lab/pedagogia/fichas/FICHA_P22_GM_02_TEMPO_COTIDIANO.md`; o catálogo terminal reporta **94 fichas / 90 de 90 competências cobertas**.

**Reconciliação necessária:** trocar a nota por referência à ficha P22 separada, sem mover/duplicar conteúdo.

### E. `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md` — resumo L2 estreito demais

O checkpoint resume L2 como “saltos positivos de 2”. O contrato real/F19 permite magnitude **1–3**. O restante da progressão do checkpoint está compatível.

**Reconciliação necessária:** corrigir apenas essa frase; não há mudança de runtime.

## 4. Por que esta auditoria NÃO fez substituição integral da Bíblia/Grafo

O conector GitHub disponível nesta sessão substitui arquivos de texto inteiros; ele não oferece patch parcial seguro. Bíblia, Grafo humano e bloco F0 são arquivos canônicos grandes. Substituí-los integralmente por uma reconstrução de chat criaria risco de perda/corrupção muito maior do que deixar uma deriva explicitamente bloqueada.

Regra aplicada:

> divergência conhecida e registrada é dívida controlada; regravar um cânone gigante sem patch confiável seria dívida invisível.

Por isso este checkpoint torna a pendência impossível de esquecer e muda a ordem da próxima sessão.

## 5. Próxima tarefa única da nova conversa

**Antes de selecionar W5**, fazer uma microfrente de reconciliação documental canônica, usando ambiente/ferramenta que permita patch textual seguro:

1. reancorar PR/head/CI;
2. ler este checkpoint + checkpoint W4;
3. aplicar somente as correções A–E acima;
4. se `BIBLIA_DO_SAGA.md` for alterada, obedecer a regra de versão do próprio arquivo: cabeçalho e última entrada do changelog devem permanecer iguais;
5. se `GRAFO_DE_CONHECIMENTO_SAGA.md` mudar de versão humana, atualizar sua nota de versão sem alterar topologia YAML desnecessariamente;
6. rodar `npm run auditar`, `npm run fichas:auditar`, `npm run fichas:conferir`, `npm run grafo:check`, TypeScript, testes, build e `pr:check`;
7. confirmar que Matrix permanece `29/22/39/51/17` e que nenhum delta funcional ocorreu;
8. só então ranquear/selecionar W5 pela Matrix/DAG.

## 6. Dívida funcional continua a mesma

Esta auditoria não muda a dívida curricular:

- 22 legados;
- 39 fallback;
- 17 divergências;
- `Moedas` renderer-sem-builder / GM.03;
- `Regua` ausente / GM.05;
- `Quadrado100` componente-isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition` renderer-sem-builder;
- bundle grande e warnings jsdom canvas continuam hardening.

## 7. Regra de retomada

**W4 permanece funcionalmente fechada. W5 ainda não começou. A única pendência pré-W5 é a reconciliação textual canônica A–E acima.**
