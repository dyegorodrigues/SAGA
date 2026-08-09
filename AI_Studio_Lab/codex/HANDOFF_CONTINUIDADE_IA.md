# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Próximo bloqueante único: `LENTO_DEDOS` / velocidade sem autoridade conceitual.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de qualquer edição.

## Primeira leitura

1. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17/P8/P18/P19/P20/P21/P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto e telemetria/Leitner da Aula.

Evidências mais novas:

- banco composto: CI #682 / run `31308424789`;
- telemetria/Leitner: CI #691 / run `31308774424`;
- head funcional antes do checkpoint documental: `cf925cc239ce7ddad7d33c48e1810a5990aaecd7`.

Telemetria v2 corrige `trackId` para a competência-fonte; Leitner materializa `reviewForce/lastDay` no source real. Banco `error-bank` é por source e preserva `review/sig`.

## Próxima tarefa — `LENTO_DEDOS`

Pré-auditoria provou dois bugs em `GameLoop.tsx`:

### 1. lentidão correta vira misconception

Rapid-fire correto >10s chama:

```ts
trackMisconception(p, "LENTO_DEDOS")
```

Duas ocorrências iguais podem entrar no Radar e provocar resgate conceitual, embora a resposta esteja correta. A string nem pertence ao catálogo `MisconceptionTag`.

### 2. velocidade injeta domínio conceitual

Rapid-fire correto ≤3s executa:

```ts
if (p.streak < 3) p.streak = 3
```

O streak é persistido; na resposta seguinte `applyJourneyAnswer` o herda e pode subir `lvl`. Isso dá à velocidade autoridade sobre a escada conceitual.

### Regra canônica

**RT/fluência mede automaticidade. Não pode criar misconception conceitual, subir/descer `lvl`, nem conceder `dom/masteryEvidence`.**

### Método

1. regressões primeiro;
2. retirar `LENTO_DEDOS` de `Progress.misconceptions`/Radar;
3. remover bônus de RT sobre streak/lvl/dom/mastery;
4. preservar RT, estrelas e Dojo/strength como sinais separados;
5. provar rápido vs lento correto = mesma autoridade conceitual;
6. provar Dojo prescrito intacto;
7. gates completos + Chrome;
8. checkpoint.

Não reintroduzir `TAG_TO_NODE`.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
