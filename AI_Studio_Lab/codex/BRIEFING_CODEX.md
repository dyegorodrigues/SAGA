# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Próximo bloqueante: timezone / identidade do dia (`lastDay`).

## Leia

1. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 draft/unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner e `LENTO_DEDOS` estão fechados.

Evidências:

- banco: CI #682 / `31308424789`;
- telemetria/Leitner: CI #691 / `31308774424`;
- `LENTO_DEDOS`: CI #702 / `31309761131`;
- head funcional desse fechamento: `d3ffd4f5ca7981b32ffc4b2c90cc963e69231c5a`.

`LENTO_DEDOS` não pertence ao Radar conceitual; tags não canônicas são ignoradas, inclusive em saves legados. Mutação imperativa externa de `streak` não pode acelerar a escada conceitual. RT/estrelas/Dojo permanecem sinais separados.

## Faça agora — timezone / `lastDay`

Há múltiplos escritores de `YYYY-MM-DD` por `new Date().toISOString().slice(0, 10)` em runtime. Isso usa **dia UTC**, não necessariamente o calendário local da criança.

### Cadeia obrigatória

`relógio local → day key → GameLoop/Jardim/Dojo/Leitner → Progress.lastDay/masteryEvidence/log → Radar/Composer/bônus → save/cloud`.

### Sequência

1. inventariar todos os escritores/consumidores de day key;
2. criar helper puro único para “dia local” sem hardcode de timezone;
3. criar distância entre dias de calendário resistente a DST;
4. testes de virada UTC/local em offsets negativos e positivos;
5. migrar writers/consumers relevantes para o helper;
6. alinhar revisão espaçada, mastery session day, Dojo/Jardim e bônus/log diário;
7. não mudar os intervalos Leitner por acidente;
8. gates completos + Chrome quando tocar runtime;
9. checkpoint.

## Conteúdo continua inventariado

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; primitivas incompletas listadas no inventário. Não iniciar a fábrica antes da Coverage Matrix.

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
