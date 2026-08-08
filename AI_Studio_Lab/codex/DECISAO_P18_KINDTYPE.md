# Decisão P18 — `KindType` autoral só promete o que o Composer entrega

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado:** FECHADA, sem ativação de competências

## Problema

`KindType` é o contrato que uma ficha TypeScript pode declarar. Nove valores estavam nesse tipo sem `case` correspondente no `Composer`, o que permitia uma ficha compilar e falhar apenas em runtime.

Os nove nomes eram:

- `linking-cubes`
- `missing-addend-frame`
- `multiple_choice`
- `sentencebuilder`
- `sequence`
- `singaporebars`
- `subvis`
- `take-apart`
- `visual-addition`

## Auditoria antes da mudança

A auditoria AST em [`AUDITORIA_P18_KINDS.md`](./AUDITORIA_P18_KINDS.md) leu apenas propriedades reais `primitiva:` e `kinds:` das fichas TypeScript; comentários não contam.

Resultado: **0/9 são declarados por fichas TypeScript autorais atuais**.

Classificação:

| categoria | kinds | tratamento |
|---|---|---|
| dívida canônica futura | `linking-cubes`, `singaporebars`, `visual-addition` | continuam no cânone/planejamento; voltam ao `KindType` apenas com ficha TS + contrato + builder + renderer + teste |
| legado ainda válido como `Question.kind` | `multiple_choice`, `sequence`, `subvis`, `take-apart` | geradores/renderers legados permanecem intactos |
| órfão/resíduo sem consumidor autoral | `missing-addend-frame`, `sentencebuilder` | não constituem API autoral só por existir nome/componente |

## Decisão

Os nove nomes foram removidos de `KindType`.

Isso **não remove** `Question.kind` legado: `Question.kind` continua sendo `string`, portanto geradores, saves e renderers legados podem continuar emitindo esses nomes quando necessário.

O que foi removido é somente a promessa de que uma ficha autoral atual pode pedir uma mecânica que o Composer não sabe construir.

## Novo invariante

`src/curriculum/kindComBuilder.test.ts` não possui mais `SEM_BUILDER` nem lista de anistia.

A regra agora é:

> **todo valor de `KindType` deve possuir builder no Composer; zero exceções.**

O teste também garante que os nove nomes não vazem de volta ao contrato autoral e prova que `Question.kind = "multiple_choice"` continua compilando como legado.

## Validação

CI normal da PR #29 no head da mudança:

- guarda de binários ✅
- auditoria do catálogo ✅
- auditoria das fichas ✅
- sincronização do grafo ✅
- TypeScript ✅
- suíte completa ✅
- build ✅

Nenhuma competência foi promovida ou adicionada a `COMPOSER_CANARIES` neste fechamento.

## Regra para o futuro

Um nome canônico futuro como `SingaporeBars` volta à API autoral **no mesmo lote** em que houver:

1. ficha TypeScript concreta que o demande;
2. contrato de dados/procedimento;
3. builder no Composer;
4. renderer autoral;
5. testes de contrato/runtime;
6. QA visual quando perceptível pela criança.

Não reservar antecipadamente nomes no `KindType`.
