# Decisão P22 — dívidas curriculares deliberadas

**Data:** 8/ago/2026
**Branch:** `codex/integrar-bloco-f0`
**Pré-requisito:** P21 fechada e governança de fontes de verdade estabilizada.

## Estado

P22 audit-first foi aberta no run `31276442048` = success.

Ordem deliberada:

1. P22.1 — GM.12;
2. P22.2 — N4.09;
3. P22.3A — N1.07 Jornada;
4. P22.3B — JD4 Jardim;
5. P22.4 — N1.09;
6. P22.5 — GM.02.

**P22.1, P22.2 e P22.3A estão concluídas. P22.3B/JD4 é o próximo lote.**

## 1. N1.09 — decisão mantida

`N1.09` é **Contagem até 20 e a partir de qualquer número**.

Pré-requisitos: `N1.04` e `N1.02`.

O legado cobre apenas continuação de sequência e não prova contagem de conjuntos 10–20 nem regressiva. Não há ficha Markdown/TS/Composer.

**Decisão:** manter o nó e construir ficha autoral + TS completas; não reutilizar N1.13.

## 2. GM.02 — decisão mantida

`GM.02` é **Tempo cotidiano**: partes do dia, ontem/hoje/amanhã, dias da semana e ordenação de eventos.

O legado atual reduz a competência a “Manhã ou Noite?” com resposta fixa `morning`.

**Decisão:** manter Tempo cotidiano e construir ficha autoral + TS pré-leitora, com áudio/cenas/ordenação/iconografia como linguagem primária.

## 3. N1.07 ↔ JD4 — decisão mantida e dividida em dois lotes

N1.07 canônico é **Ordem, sucessor e antecessor até 10**.

JD4 “Próximo Passo” é automaticidade ligada a N1.07, não novo nó do grafo.

Invariante:

- Jornada N1.07 = compreensão conceitual;
- JD4 = treino posterior de acesso rápido a sucessor/antecessor;
- `dojoTracks` permanece separado do progresso da Jornada;
- tempo nunca concede domínio conceitual.

O Jardim não pode compensar lacuna conceitual da Jornada.

## 4. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.

- Composer ativo 23/90 à época;
- servido sem placeholder 50/90;
- fallback real 40/90;
- sonda e gates completos verdes.

## 5. P22.2 — N4.09 CONCLUÍDA

Gate final `31277213310`: **success**.

Defeito encontrado e corrigido: o gabarito de área carregava misconception sentinela `"correta"`. A resposta correta passou a ficar sem tag; somente distratores carregam hipótese diagnóstica.

Estado após P22.2:

- Composer registrado: **24/90**;
- Composer ativo: **24/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**.

## 6. P22.3A — N1.07 CONCLUÍDA

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: **success**.

### Correções realizadas

- faixa da ficha: F0;
- prereqs: `N1.02 + N1.06`;
- L1: sucessor até 5 com reta;
- L2: sucessor até 10 com apoio reduzido;
- L3: antecessor até 5;
- L4: antecessor até 10;
- L5: ordenar 3–4 numerais consecutivos;
- `numberline`: salto positivo/negativo sem escapar do intervalo;
- `plain`: salto positivo/negativo com prompt coerente;
- novo `plain/ordering` opt-in para esta necessidade;
- gabarito de ordenação sem misconception; distratores com `ORDEM_ERRADA`;
- teste permanente `N1.07.test.ts`;
- ficha autoral passa a declarar explicitamente Jornada conceitual ≠ JD4 automático.

### Portões

No lote transacional passaram:

- auditores curriculares;
- TypeScript;
- suíte completa;
- build;
- sonda real N1.07;
- guarda textual/diff check.

A bancada temporária foi removida e `ci.yml` restaurado ao blob estável.

P22.3A não aumenta os contadores de Composer porque N1.07 já era registrada/ativa antes; elimina uma divergência semântica real.

## 7. P22.3B — PRÓXIMA EXECUÇÃO

Objetivo: registrar JD4 como trilha real do Jardim **sem contaminar o domínio da Jornada**.

Contrato proposto:

1. `id: "JD4"`;
2. `mae: "N1.07"`;
3. `destravaNoNivel` somente depois de compreensão suficiente da mãe;
4. cinco níveis de automaticidade com retirada de apoio;
5. sucessor 1–5 → sucessor 1–10 → sucessor 1–20 → antecessor 2–10 → alternância sucessor/antecessor 1–20;
6. `rt_alvo` decrescente como metadado de fluência;
7. progresso em `dojoTracks`, nunca em mastery da Jornada;
8. JD4 não entra no grafo nem em `JOURNEY_FICHAS`;
9. teste permanente + sonda real + gates completos.

Somente depois abrir P22.4/N1.09.

## 8. Regra de fechamento P22

P22 só termina quando:

- N1.07 ensinar o conceito inteiro e JD4 estiver separado como automaticidade;
- N1.09 e GM.02 deixarem de ser lacunas autorais sem reduzir o cânone;
- todos os auditores, testes, sondas afetadas, TypeScript, build e guards estiverem verdes.

> **Promoção e automaticidade são consequências de evidência; não atalhos para uma tabela verde.**
