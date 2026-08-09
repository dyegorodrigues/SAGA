# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Próximo bloqueante único: **Misto por repertório elegível**.

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

P17/P8/P18/P19/P20/P21/P22, cânone, Radar/source/persist, Sensei full DAG, Oficina causal, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone/dia civil e recomendador secundário por estrelas.

Evidências recentes:

- banco composto: CI #682 / run `31308424789`;
- telemetria/Leitner: CI #691 / run `31308774424`;
- `LENTO_DEDOS`: CI #702 / run `31309761131`;
- timezone: CI #717 / run `31310499361`;
- recomendador paralelo: CI #720 / run `31310675620`;
- head funcional mais novo: `fc6227f14be69fcf95cd173a973a24a800479800`.

## Próxima tarefa — Misto por repertório elegível

Pré-auditoria confirmou:

- `App.tsx` ainda usa `SUBJECTS[mat].tracks[kid.grade]` para montar o Misto;
- `mixedChallenge.ts` usa tudo que recebe para banco, pior precisão e sorteio;
- não há filtro explícito de repertório já seguro.

Isso viola a ontologia atual: série não é autoridade curricular e Misto é interleaving opcional do repertório conquistado.

### Método

1. provar `DAG + Progress → pool elegível → questões → persistência`;
2. universo matemático canônico, não grade;
3. usar evidência real de progresso/DAG; não criar nova árvore;
4. excluir nunca praticadas/sem segurança;
5. filtrar banco/pior/aleatórias pelo mesmo pool;
6. tratar pool insuficiente explicitamente;
7. não permitir que Misto compre unlock/mastery;
8. regressões com track dominada, apenas desbloqueada, nunca praticada e fora da antiga grade;
9. gates + Chrome se UI/disponibilidade mudar;
10. checkpoint.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias a classificar; primitivas incompletas no inventário. A fábrica entra depois da Coverage Matrix.

## Fila posterior

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
