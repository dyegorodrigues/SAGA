# Errata normativa — N4.09 / F68 / §6.36

**Data:** 11/08/2026 · **Status:** VIGENTE enquanto a redação histórica de `PADRAO_OURO.md §6.36` não for consolidada diretamente.

## O que ficou velho

`PADRAO_OURO.md §6.36` registra corretamente a causa-raiz da estreia de uma linguagem visual nova sem alfabetização prévia, mas termina com uma pendência específica que já foi resolvida:

> F68 precisaria ser revista antes de N4.09 ser ativado.

Essa frase não descreve mais o runtime vigente.

## Estado real de N4.09

`src/curriculum/fichas/jornada/N4.09.ts` já materializa a correção de §6.36:

- nível 1: `corte_marcado`, explicitamente dedicado a **aprender a ler o retângulo**;
- tutorial runtime de seis passos;
- medidas em cima/lateral são ensinadas antes de cobrar a operação;
- regiões dezenas/unidades são apresentadas explicitamente;
- o comentário do nível 1 referencia a alfabetização do desenho e a causa-raiz de §6.36.

Portanto:

- **a regra geral de §6.36 continua vigente**;
- **a pendência específica de N4.09 está RESOLVIDA**;
- não reabrir N4.09 apenas porque o parágrafo histórico usa tempo futuro;
- reabrir somente se código, ficha, tutorial, sonda ou evidência objetiva mostrarem regressão.

## O que ainda NÃO está resolvido

O caso N4.09 foi corrigido manualmente, mas a classe de defeito ainda não possui gate completo: `conformidadeDeFichas.test.ts` e `coverage_matrix.ts` detectam estreias/trocas de modo e onboarding, porém a dívida ativa de Padrão Ouro ainda não bloqueia promoção por mecanismo regression-safe.

Fonte operacional desta errata: `CHECKPOINT_RECONCILIACAO_POS_W5_PRE_W6_2026-08-11.md`.
