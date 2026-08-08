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

P22.1 e P22.2 estão concluídas. P22.3A é o próximo lote.

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

Estado atual:

- N1.07 já está ativo no Composer e tem rollback legado;
- ficha TS cobre predominantemente +1/sucessor;
- faltam cobertura equivalente de antecessor e ordenação;
- grafo usa prereqs `N1.02 + N1.06`;
- ficha TS usa `N1.04 + N1.06`.

JD4 “Próximo Passo” é automaticidade ligada a N1.07, não novo nó do grafo.

**Decisão:**

- P22.3A: corrigir/completar a Jornada N1.07 primeiro;
- P22.3B: só depois registrar JD4 no Jardim.

O Jardim não pode compensar lacuna conceitual da Jornada.

## 4. P22.1 — GM.12 CONCLUÍDA

`GM.12` foi promovida em `DEFAULT_COMPOSER_CANARY_IDS`.

Gate final `31276881058`: **success**.

Comprovado:

- teste específico + contrato genérico de canário;
- estreia→rollback para placeholder→reativação;
- sonda promovida 390/320/900 px;
- Composer ativo 23/90;
- servido sem placeholder 50/90;
- fallback real 40/90;
- suíte 125 arquivos / 2.145 testes;
- TypeScript, grafo, build, `pr:check` e diff check verdes.

Cleanup: `35493c012b96aaf64e919babba47cc5f5a4171cf`.

## 5. P22.2 — N4.09 CONCLUÍDA

N4.09 foi adicionada ao contrato genérico e promovida.

### Defeito encontrado pelo primeiro gate

Run `31277083778` falhou corretamente porque o gabarito de área trazia misconception sentinela `"correta"`. A política global interpreta qualquer tag do option selecionado como diagnóstico; portanto um acerto contaminava o Radar.

### Correção causal

- `areaProcedure.ts`: resposta correta não recebe tag;
- `areaContract.ts`: propaga tag somente quando existe;
- `areaContract.test.ts`: prova gabarito sem diagnóstico e distratores com hipótese;
- `canaryContract.test.ts`: N4.09 entrou em `REGISTRO`;
- `composerCanaryIds.ts`: N4.09 entrou na lista ativa.

O contrato não foi relaxado.

### Gate final

Run `31277213310`: **success**.

Comprovado:

- focal: 3 arquivos / 339 testes;
- sonda N4.09 promovida verde;
- Composer registrado: **24/90**;
- Composer ativo: **24/90**;
- registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- `fichas:conferir`: 9/9;
- suíte completa: **125 arquivos / 2.160 testes**;
- TypeScript, grafo, build, `pr:check` e `git diff --check`: verdes.

Cleanup concluído; head pós-limpeza `e259ccd19d10ec00ed6e4a35e2ce24967796d4f1`.

## 6. P22.3A — próxima execução

Objetivo: fazer a Jornada N1.07 corresponder à competência que o grafo promete, sem criar JD4 ainda.

Antes da implementação:

1. reconstruir a ficha/cânone autoral N1.07;
2. comparar grafo, ficha Markdown, TS ativa e legado;
3. decidir a escada de 5 níveis e micros para sucessor, antecessor e ordenação;
4. reconciliar prereqs para o grafo;
5. reaproveitar primitivas existentes quando suficientes;
6. preservar o canário ativo, rollback e telemetria.

Critério de fechamento:

- a Journey deve observar os três componentes da competência, não apenas +1;
- a ficha TS não pode divergir silenciosamente dos prereqs canônicos;
- acerto não gera misconception;
- perguntas/distratores válidos nos cinco níveis;
- sonda N1.07 e gates completos verdes.

Somente depois abrir P22.3B/JD4.

## 7. Regra de fechamento P22

P22 só termina quando:

- N1.07 ensinar o conceito inteiro e JD4 estiver separado como automaticidade;
- N1.09 e GM.02 deixarem de ser lacunas autorais sem reduzir o cânone;
- todos os auditores, testes, sondas afetadas, TypeScript, build e guards estiverem verdes.

> **Promoção e automaticidade são consequências de evidência; não atalhos para uma tabela verde.**
