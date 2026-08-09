# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Próximo bloqueante único: timezone / identidade do dia (`lastDay`).

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de qualquer edição.

## Primeira leitura

1. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17/P8/P18/P19/P20/P21/P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner e autoridade indevida de velocidade (`LENTO_DEDOS`).

Evidências mais novas:

- banco composto: CI #682 / run `31308424789`;
- telemetria/Leitner: CI #691 / run `31308774424`;
- `LENTO_DEDOS`: CI #702 / run `31309761131`;
- head funcional do fechamento: `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`.

O Radar conceitual aceita somente tags canônicas e ignora `LENTO_DEDOS`, inclusive em saves legados. A escada conceitual rejeita mutação imperativa externa de `streak`; rápido/lento correto têm a mesma autoridade curricular. RT, estrelas e Dojo continuam separados.

## Próxima tarefa — timezone / `lastDay`

Pré-auditoria encontrou geração de `YYYY-MM-DD` por `toISOString().slice(0, 10)` em runtime, incluindo `GameLoop.tsx`, `radarEngine.ts` e `matricula.ts`. Essa chave representa o dia UTC e pode divergir do dia local da criança perto da meia-noite.

### Riscos a provar

- `practiceDay`/mastery session mudar de dia cedo ou tarde;
- `lastDay` do Leitner/revisão ser adiantado/atrasado;
- rounds de Jardim/Dojo discordarem de Jornada;
- primeiro bônus/log diário usar outro conceito de “hoje”;
- cálculo de diferença de dias sofrer com horário/DST.

### Método

1. mapear a cadeia `relógio → day key → writers → estado → consumers → save/cloud`;
2. helper puro único de chave de dia local, sem timezone hardcoded;
3. helper puro de distância entre dias de calendário;
4. regressões em virada UTC/local, offsets negativo/positivo e DST;
5. migrar todos os writers/consumers relevantes;
6. preservar semântica Leitner e separação conceitual/fluência;
7. gates completos + Chrome;
8. atualizar checkpoint/handoff.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias a classificar; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
