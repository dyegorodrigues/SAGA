# Fechamento — banco composto + telemetria/Leitner

**Data:** 9/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Fonte operacional:** `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`

## Banco de erros composto — CORRIGIDO

Bug provado:

`planAula` elegia A como `error-bank`, porém `composeAula` misturava bancos A/B num pool global e fazia `pop()`. Além disso `shuffleOpts()` removia `review/sig` e esses metadados não voltavam.

Correção:

- pool por `track.id`;
- `error-bank` consome somente o source do próprio `RescuePlanItem`;
- `review=true` e `sig` original são restaurados depois do shuffle/stamp;
- regressão determinística com dois bancos-fonte.

Evidência: CI #682 / run `31308424789` = SUCCESS integral.

## Telemetria da Aula composta — CORRIGIDA

Bug de identidade provado:

questão composta carregava `sourceTrackId`, mas a telemetria usava `track.id` do envelope (`"aula"`).

Correção:

- `prepareAulaSourceForAnswer()` publica source efêmero;
- `telemetryIdentityContext.ts` normaliza o evento antes do Firestore;
- `trackId` passa a significar competência-fonte;
- formato sobe de v1 para **v2** porque o significado do campo mudou;
- questão comum limpa o source antigo para impedir vazamento entre questões.

## Leitner — PROVADO OK NO SOURCE REAL

A chamada histórica ainda usa uma chave temporária `aula` num mapa local, mas o valor é o `Progress` source já roteado/marcado. Regressão ponta a ponta prova:

- `reviewForce` e `lastDay` são atualizados;
- `carimbar()` materializa no source real;
- `progress.aula` não persiste.

Não houve razão para reconstruir o Leitner.

Evidência conjunta: CI #691 / run `31308774424` = SUCCESS integral, inclusive Chrome real.

## Próximo bloqueante

`LENTO_DEDOS` / autoridade indevida da velocidade.

Pré-auditoria já provou em `GameLoop.tsx`:

1. rapid-fire correto >10s grava `LENTO_DEDOS` em `misconceptions`, podendo alimentar Radar conceitual;
2. rapid-fire correto ≤3s força `p.streak=3`, podendo acelerar `lvl` na resposta seguinte.

Ambos contradizem o cânone: **RT/fluência não pode governar domínio conceitual**.

A próxima execução deve começar com regressões desses dois efeitos e remover a autoridade curricular da velocidade sem perder RT/estrelas/Dojo/strength.
