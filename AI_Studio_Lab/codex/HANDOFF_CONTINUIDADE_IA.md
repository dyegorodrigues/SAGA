# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_MISTO_FECHADO_2026-08-09.md`. Próximo bloqueante único: **Matrícula adaptativa sem grade rígida**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de qualquer edição.

## Primeira leitura

1. `CHECKPOINT_MISTO_FECHADO_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17–P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone/dia civil, recomendador secundário por estrelas e Misto elegível.

Misto final: head `ae47e417332fb7c02134bdda871c853535863838`, CI #733 / run `31311494765`, integralmente verde inclusive Chrome real; artefato visual `9037510112`.

## Próxima tarefa — Matrícula adaptativa

Pré-auditoria confirmou:

- `App.tsx` ainda chama `buildMatriculaTrack(...tracks[kid.grade])`;
- `CORE_IDS` contém 9 âncoras, mas `MAX_TRACKS=6` elimina as finais;
- trocar só a origem do array não resolve subplacement;
- `GameLoop` chama `onCommit` antes de gerar a próxima questão, então a Matrícula pode adaptar a própria sequência via closure.

### Cadeia

`DAG/conteúdo explícito → âncora → questão → resposta → próxima âncora → seed → Sensei`.

### Método

1. universo canônico, nunca série como teto;
2. usar apenas tracks realmente servidas;
3. começar com sondas gentis;
4. acertos consistentes sobem a escada; erros mantêm/deslocam para bases seguras;
5. não forçar iniciante a questões muito acima;
6. placement não concede `dom`;
7. preservar missão curta e amigável;
8. regressões para criança iniciante, intermediária, avançada, fallback e seed;
9. gates completos + Chrome se fluxo visual mudar;
10. checkpoint.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias a classificar; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
