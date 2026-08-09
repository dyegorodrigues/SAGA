# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Próximo bloqueante: **Misto por repertório elegível**.

## Leia

1. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 draft/unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone e recomendador secundário por estrelas estão fechados.

Evidências recentes:

- banco: CI #682 / `31308424789`;
- telemetria/Leitner: CI #691 / `31308774424`;
- `LENTO_DEDOS`: CI #702 / `31309761131`;
- timezone: CI #717 / `31310499361`;
- recomendador paralelo: CI #720 / `31310675620`;
- head funcional mais novo: `fc6227f14be69fcf95cd173a973a24a800479800`.

## Faça agora — Misto por repertório elegível

O runtime ainda monta o Misto com `SUBJECTS[mat].tracks[kid.grade]`; o construtor mistura banco/pior precisão/aleatórias de tudo que recebe sem um filtro canônico de segurança conceitual.

### Cadeia

`DAG + Progress → repertório elegível → pool Misto → banco/pior/aleatória → Question → GameLoop → persistência`.

### Sequência

1. universo possível = matemática canônica, não série;
2. derivar elegibilidade do estado/progresso real e DAG existente;
3. nunca incluir track nunca praticada/sem segurança;
4. banco, pior precisão e aleatórias usam o mesmo pool elegível;
5. pool insuficiente deve produzir indisponibilidade/composição explícita, nunca conteúdo arbitrário;
6. Misto continua opcional e não altera mastery/unlock;
7. regressões para dominada, só desbloqueada, nunca praticada e fora da antiga grade;
8. gates completos + Chrome se UI mudar;
9. checkpoint.

## Conteúdo continua inventariado

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; primitivas incompletas no inventário. Não iniciar a fábrica antes da Coverage Matrix.

## Depois

Matrícula sem grade rígida → cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

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
