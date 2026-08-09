# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Próxima tarefa única: `LENTO_DEDOS` / autoridade indevida da velocidade. Banco composto e telemetria/Leitner já estão fechados.

## Leia primeiro

1. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md` — fonte operacional mais nova;
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
3. `AUDITORIA_MOTORES_ADAPTATIVOS_FECHAMENTO_2026-08-09.md` — fechamento histórico até Jardim;
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia.

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
- Leitner provado no source real sem `progress.aula` persistido — CI #691 / `31308774424`.

## Próxima tarefa — `LENTO_DEDOS`

Dois bugs já provados no `GameLoop.tsx`:

1. resposta correta lenta (>10s) em rapid-fire chama `trackMisconception(p, "LENTO_DEDOS")`; duas ocorrências iguais podem entrar no Radar e produzir resgate conceitual apesar de a resposta estar correta;
2. rapid-fire correto ≤3s força `p.streak = 3`; o valor persistido pode fazer a resposta seguinte subir `lvl`, dando à velocidade autoridade conceitual.

Isso viola o cânone: RT mede automaticidade, não compreensão.

### Faça

1. regressões primeiro para os dois efeitos;
2. separar `LENTO_DEDOS` de `Progress.misconceptions`/Radar conceitual;
3. remover bônus de RT sobre `streak/lvl/dom/masteryEvidence`;
4. preservar estrelas, RT e Dojo/strength como sinais de fluência;
5. provar que acerto rápido e lento têm a mesma autoridade conceitual;
6. provar que Dojo prescrito continua medindo fluência normalmente;
7. gates completos + Chrome;
8. checkpoint.

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

timezone/`lastDay` → recomendador paralelo → Misto elegível → Matrícula → cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

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
