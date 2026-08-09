# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`. Coverage Matrix e **W1/N1.04** estão fechadas; próxima tarefa única: **continuar a fábrica curricular pelo próximo nó causal da matriz**.

## Leia primeiro

1. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md` — fonte operacional mais nova;
2. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md` — fechamento histórico da matriz;
3. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md` — checkpoint histórico anterior;
4. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` — visão futura registrada, não fila atual;
5. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — inventário que originou a matriz;
6. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia pedagógica;
7. `../pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md` e `DOJO_SAGA.md` — cânone pedagógico vigente.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 deve permanecer **open + draft + unmerged**;
- não ready, não auto-merge, não rebase/merge na main;
- não tocar no Creature Engine nesta fila;
- não criar branch auxiliar;
- GitHub remoto é a fonte da verdade;
- antes de editar, reancorar PR/head remoto e verificar CI.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina causal; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação / Economia / Meta-jogo; **Coverage Matrix; Fábrica W1/N1.04**.

### Contratos permanentes

- learner state é a verdade pedagógica e única autoridade para mastery/unlock/prescrição;
- **Nível SAGA 1–100 pertence à criança/perfil, não ao mascote**;
- XP é vitalício e nunca compra mastery/unlock;
- moedas são gastáveis e compras são atômicas;
- velocidade não multiplica XP nem concede autoridade conceitual;
- criança lenta e correta recebe o mesmo XP de perfil;
- Misto dobra moedas, não XP/mastery;
- fallback não fornece evidência nem recompensa real;
- Atlas/insígnias curriculares derivam do Curriculum Graph/learner state;
- replay legítimo é prática nova, sem repetir bônus único de primeira missão;
- double tap/retry/reload/materialização repetida não duplicam o mesmo evento técnico;
- Coverage Matrix é projeção derivada das fontes reais, não uma segunda ontologia curricular;
- telemetria pode revelar defeitos, mas não reescreve automaticamente o Curriculum Graph;
- `COVERAGE_CLOSED_BASELINE` é snapshot histórico; evolução posterior entra por migrações causais nomeadas.

### Recibo funcional da W1/N1.04

`4637d205bc6d5b144dddc926e9f669d835f40d70`, CI #842 / run `31340827946`: higiene, binários, Coverage Matrix/auditorias, grafo, TypeScript, testes, build, `pr:check` e sonda real Sensei verdes.

A sessão não transcreveu nova contagem total de testes porque o conector não expôs o corpo detalhado do log de forma confiável; não inferir nem inventar. O run #842 é o recibo canônico.

Documentação de handoff pode estar em commits posteriores; por isso **sempre** verificar o head atual da PR e seu CI antes de editar.

## Coverage Matrix — FECHADA E EVOLUTIVA

Gate executável:

- `AI_Studio_Lab/tools/coverage_matrix.ts`;
- `src/curriculum/coverageMatrix.test.ts`;
- `npm run coverage:matrix`;
- `npm run coverage:matrix:markdown`;
- `npm run coverage:matrix:json`;
- `npm run auditar` executa a matriz.

Snapshot de fechamento P21.1:

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- 51/90 servidas sem placeholder;
- 25 legado;
- 39 fallback;
- **21** divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Baseline vigente após `W1-N1.04`:

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- 51/90 servidas sem placeholder;
- 25 legado;
- 39 fallback;
- **20** divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` e `Regua` continuam bloqueadoras.

O histórico 21 não foi sobrescrito: `COVERAGE_MIGRATIONS` deriva o estado atual por migrações nomeadas. Se os números mudarem, **investigar e reconciliar; nunca ajustar expectativa para ficar verde**.

## W1/N1.04 — FECHADA

- teste nominal nasceu primeiro;
- proveniência F01/F03 passou a ser explícita por micro;
- a voz da F03 assume na grade/disperso sem quebrar o gesto da F01;
- F03 canônica foi reconciliada para `TouchCount`, pois seu próprio roteiro exige a mesma gramática de toque da F01;
- divergência N1.04 saiu da Matrix: 21 → 20;
- o delta foi governado por ledger, preservando o fechamento histórico.

## Faça agora — CONTINUAR A FÁBRICA CURRICULAR

Usar a Coverage Matrix como mapa executável. Escolher o próximo nó por ordem causal real, não por conveniência nem por série:

1. profundidade no DAG e impacto em descendentes;
2. bloqueios de primitiva/builder que impedem competências reais;
3. dívida de bases de alto impacto;
4. legado com divergência ficha↔screen;
5. fallback materializável sem atravessar bloqueador causal;
6. necessidade de onboarding/ponte visual;
7. risco de propagar representação pedagógica errada.

Fluxo obrigatório por nó:

`investigar cânone + runtime → escrever regressão → corrigir fonte real → rodar Matrix/gates → governar eventual delta → checkpoint → próximo nó`.

Não massificar conteúdo em dependentes enquanto uma base/primitiva causal relevante estiver quebrada. Uma competência só sobe para padrão-ouro quando a experiência real da criança concorda com a ficha.

## Visão futura preservada — não executar agora

Companheiro/NPC vivo, widget móvel, emoções/retratos, cuidados suaves, animais lutadores humanoides em HD pixel art, fighting game/beat ’em up 2.5D e `Laboratório de Raciocínio / Thinking Lab` permanecem em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

Não autorizam tocar no Creature Engine nesta fila.

## Fila vigente

`Coverage Matrix FECHADA → fábrica curricular por ondas (W1 N1.04 fechada; seguir próximo nó) → mega auditoria integrada → hardening/performance → release`.

Arte definitiva/Creature Engine/widget/jogo ficam em trilha futura separada até o núcleo matemático estar fechado.

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

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. O meta-jogo celebra o caminho; ele nunca decide o que a criança sabe.**
