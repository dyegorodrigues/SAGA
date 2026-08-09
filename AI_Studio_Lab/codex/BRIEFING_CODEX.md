# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Próximo bloqueante: `LENTO_DEDOS` / autoridade indevida da velocidade.

## Leia

1. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 draft/unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto e telemetria/Leitner da Aula composta estão fechados.

- banco: CI #682 / `31308424789`;
- telemetria/Leitner: CI #691 / `31308774424`;
- telemetria v2 usa `trackId` = competência-fonte da questão composta;
- Leitner materializa `reviewForce/lastDay` no source real.

## Faça agora — `LENTO_DEDOS`

Dois bugs já provados em `GameLoop.tsx`:

1. rapid-fire correto >10s chama `trackMisconception(p, "LENTO_DEDOS")`; duas ocorrências iguais podem entrar no Radar e acionar remediação conceitual por lentidão;
2. rapid-fire correto ≤3s força `p.streak = 3`; isso persiste e pode fazer a próxima resposta subir `lvl` por velocidade.

Ambos violam o cânone: RT é automaticidade, não domínio conceitual.

### Sequência obrigatória

1. testes/regressões que provem os dois efeitos;
2. tirar `LENTO_DEDOS` de `Progress.misconceptions`/Radar conceitual;
3. remover bônus de velocidade sobre `streak/lvl/dom/masteryEvidence`;
4. preservar RT, estrelas e Dojo/strength como sinais de fluência;
5. provar rápido vs lento correto = mesma autoridade conceitual;
6. provar Dojo prescrito intacto;
7. gates completos + Chrome;
8. checkpoint.

Não reintroduzir `TAG_TO_NODE`.

## Conteúdo continua inventariado

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; primitivas incompletas listadas no inventário. Não iniciar a fábrica antes da Coverage Matrix.

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
