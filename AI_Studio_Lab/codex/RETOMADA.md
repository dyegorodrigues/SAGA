# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Tudo até `LENTO_DEDOS` está fechado; próxima tarefa única: timezone / identidade do dia (`lastDay`).

## Leia primeiro

1. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md` — fonte operacional mais nova, reconstruída do GitHub após a trava do chat;
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
3. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md` — checkpoint anterior, histórico a partir do fechamento de `LENTO_DEDOS`;
4. `AUDITORIA_MOTORES_ADAPTATIVOS_FECHAMENTO_2026-08-09.md` — fechamento histórico até Jardim;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 open + draft + não mesclar;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head remoto antes de editar.

## Fechado — não reabrir sem falha objetiva

- P17/P8/P18/P19/P20/P21/P22;
- 90 competências / 94 fichas / cobertura 90/90;
- cânone Bíblia/Manual/Método + guard;
- Radar/source/persist/DAG/Oficina causal;
- Tutor↔Dojo `manual | prescribed`;
- Dojo prescrito separado da Aula;
- QA real Chrome integrado ao CI;
- Jardim causal por DAG + evidência JD;
- banco composto por source + `review/sig` preservados — CI #682 / `31308424789`;
- telemetria da Aula composta em v2 com `trackId` = competência-fonte;
- Leitner provado no source real sem `progress.aula` persistido — CI #691 / `31308774424`;
- `LENTO_DEDOS` sem autoridade conceitual: Radar aceita apenas tags canônicas, saves legados não abrem Oficina, mutação externa de `streak` não acelera `lvl`, rápido/lento têm a mesma autoridade curricular — CI #702 / `31309761131`.

Head funcional do fechamento: `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`.

## Próxima tarefa — timezone / `lastDay`

Pré-auditoria provou escritores de day key por UTC em `GameLoop.tsx`, `radarEngine.ts` e `matricula.ts`. `new Date().toISOString().slice(0, 10)` representa o dia UTC, não necessariamente o dia local da criança.

### Faça

1. mapear todos os escritores e consumidores de `YYYY-MM-DD`;
2. seguir a cadeia `relógio local → day key → motores → Progress/mastery/log → Radar/Composer/bônus → save/cloud`;
3. centralizar chave de dia local em helper puro, sem hardcode de timezone;
4. centralizar distância entre dias de calendário sem erro por DST/horário;
5. regressões em viradas UTC/local, inclusive UTC−3 e offset positivo;
6. alinhar GameLoop, Jardim, Dojo, mastery, Leitner, log e bônus diário sobre a mesma identidade de “hoje”;
7. preservar os intervalos Leitner — corrigir identidade do dia, não reinventar o algoritmo;
8. gates completos + Chrome se runtime/UI/persistência forem tocados;
9. checkpoint.

## Dívida curricular não perdida

- Composer ativo 26/90;
- servido sem placeholder 51/90;
- 25 prontos em legado;
- 39 prontos em fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- primitivas incompletas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100, Regua.

A fábrica curricular continua depois da Coverage Matrix.

## Depois

recomendador paralelo → Misto elegível → Matrícula → cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

## Gates

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
npm run sonda:sensei-dojo
```

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
