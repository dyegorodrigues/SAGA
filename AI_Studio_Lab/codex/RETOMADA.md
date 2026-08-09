# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md`. Tudo até timezone e remoção do recomendador paralelo por estrelas está fechado; próxima tarefa única: **Misto por repertório elegível**.

## Leia primeiro

1. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md` — fonte operacional mais nova;
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
3. `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md` — checkpoint histórico;
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
- banco composto por source + `review/sig` — CI #682 / `31308424789`;
- telemetria v2 + Leitner no source real — CI #691 / `31308774424`;
- `LENTO_DEDOS` sem autoridade conceitual — CI #702 / `31309761131`;
- timezone/dia civil unificado entre Journey/Jardim/Dojo/Leitner/Matrícula/migração, com round-trip preservado — CI #717 / `31310499361`;
- recomendador secundário por estrelas removido do Sensei; treino livre continua nas portas próprias — CI #720 / `31310675620`.

Head funcional mais novo: `fc6227f14be69fcf95cd173a973a24a800479800`.

## Próxima tarefa — Misto por repertório elegível

Pré-auditoria provou que `App.tsx` ainda constrói o Misto a partir de `tracks[kid.grade]`, enquanto `mixedChallenge.ts` mistura banco/pior precisão/aleatórias sem filtrar explicitamente segurança conceitual.

### Faça

1. seguir `DAG + Progress → repertório elegível → pool do Misto → questão → GameLoop → persistência`;
2. usar universo matemático canônico, não `kid.grade`, como universo possível;
3. derivar elegibilidade de evidência/progresso real sem criar árvore paralela;
4. excluir conteúdo nunca praticado/sem segurança;
5. banco, pior precisão e aleatórias devem usar o MESMO pool elegível;
6. tratar pool insuficiente explicitamente, sem pergunta arbitrária;
7. preservar Misto como opcional e sem autoridade de mastery/unlock;
8. regressões: dominada, apenas desbloqueada, nunca praticada e fora da antiga grade;
9. gates completos + Chrome se CTA/disponibilidade mudar;
10. checkpoint.

## Dívida curricular não perdida

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 prontos em legado;
- 39 prontos em fallback;
- 21 divergências ficha↔tela;
- 12 trocas visuais;
- primitivas incompletas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100, Regua.

A fábrica curricular continua depois da Coverage Matrix.

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

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
