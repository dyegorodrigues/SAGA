# Briefing operacional — continue daqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`. Coverage Matrix e W1–W4 estão fechadas com CI remoto real. Próxima tarefa única: **escolher W5 pela Matrix/DAG vigente**.

## Leia

1. `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
2. `RETOMADA.md`;
3. `HANDOFF_CONTINUIDADE_IA.md`;
4. checkpoints W3/W2/W1 + Coverage Matrix;
5. cânone em `AI_Studio_Lab/pedagogia/`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 sempre open + draft + unmerged. Main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`. Não tocar no Creature Engine, não criar branch auxiliar, não merge/rebase/ready/auto-merge. Reancorar PR/head/CI antes de qualquer edição.

## Não reabra sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01; W4/N1.12**.

## Recibo W4

Head funcional: `841a4a3691662829b9d1432ff070191522fd9a6e`  
CI #975 / run `31404572801`: success integral.

- **29 Composer / 22 legado / 39 fallback / 51 servidas**;
- **17 divergências / 12 swaps / 44 estreias**;
- blockers `Moedas`, `Regua`;
- **169 arquivos / 2480 testes verdes**;
- build, `pr:check`, higiene e binários verdes;
- sonda Sensei/Matrícula verde;
- sonda F19 Chrome real verde em 320/390/900 px, níveis 1–5, tap + drag;
- artefato F19 `9069082798`, SHA-256 `65a1d3ab456f4320709547dcc98f87958f8ed083fb978b8a80322059e03629f3`;
- artefato Sensei `9069071435`, SHA-256 `d8b4060ee5bc98feb64a0bc56f7d4b7c0fc5c8ca85f8416730657a83976cf38b`.

## Coverage Matrix

Snapshot P21.1 imutável: `26 / 25 / 39 / 51 / 21`.

Ledger fechado:

- W1 N1.04: divergência −1;
- W2 N1.05: Composer +1, legado −1, divergência −1;
- W3 N2.01: Composer +1, legado −1, divergência −1;
- W4 N1.12: Composer +1, legado −1, divergência −1.

Baseline vigente: **29 / 22 / 39 / 51 / 17**, 12 swaps, 44 estreias, blockers `Moedas` e `Regua`.

Fonte muda primeiro → Matrix observa → ledger por último. Nunca mascarar divergência ajustando baseline sem causalidade.

## W4/F19 — contratos que agora são permanentes

- `InteractiveNumberLineSurface` é compartilhada; não duplicar primitive;
- F19 é responsiva e não usa `PalcoEscalado`;
- tap físico passa pelo plano da reta + snap/filtro motor;
- drag inicia sobre o foguete e diferencia tap por limiar;
- `pointercancel` não publica resposta;
- out-of-bounds não pode virar acerto por clamp;
- erro motor não vira misconception;
- L2 usa arcos; L3+ os remove;
- salto por tap anima/bipa casa a casa e só publica ao final;
- drag bipa ticks atravessados e publica na soltura;
- TTS é uma fala única de chegada;
- `CONTA_MARCAS` reseta por tentativa;
- a sonda `npm run sonda:reta20` mede geometria real e colisão de rótulos.

No phone, todas as marcas 0–20 permanecem; rótulos 11/13/15/17/19 são ocultados visualmente para legibilidade. Desktop/tablet amplo mantém 0–20 rotulados no L5.

## W5 — decisão e execução

Antes de escrever código:

1. reancorar remoto;
2. inspecionar `npm run coverage:matrix:markdown`/JSON;
3. ranquear profundidade/descendentes + legado/fallback + divergência + blocker + onboarding/motor/a11y + risco pedagógico;
4. escolher **um nó**.

Depois:

`ficha integral + runtime → regressão vermelha → contract/procedure → stage/boundary/telemetria/a11y → registro inativo → CI/sonda → canário → Matrix observa → ledger → gates → checkpoint`.

`Moedas`/GM.03 e `Regua`/GM.05 são blockers importantes, mas não hardcode a ordem sem consultar a Matrix.

## Dívida atual

- 22 legados;
- 39 fallback;
- 17 divergências;
- `Moedas` renderer-sem-builder;
- `Regua` ausente;
- `Quadrado100` componente-isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition` renderer-sem-builder.

Lista completa no checkpoint W4.

## Thinking Lab / arquitetura

Trate como risk review. Simulador de learner, property-based testing, QA visual/áudio, agentes e observabilidade podem entrar incrementalmente. Telemetria não reescreve grafo; LLM não é soberano em runtime; RT/idade/gamificação não concedem mastery. Mudança de invariantes exige Invariant Impact Review.

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
npm run sonda:reta20
```

**Regression-first. Fonte real primeiro. Matrix depois. Ledger por último. Para geometria infantil responsiva, browser real faz parte do contrato.**