# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`. Tudo até **Coverage Matrix** está fechado; próxima tarefa única: **fábrica curricular por ondas pedagógicas guiadas pela matriz**.

## Leia primeiro

1. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md` — fonte operacional mais nova;
2. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md` — checkpoint histórico imediatamente anterior;
3. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` — visão futura registrada, não fila atual;
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — inventário que originou a matriz;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia pedagógica;
6. `../pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md` e `DOJO_SAGA.md` — cânone pedagógico vigente.

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

P17–P22/cânone; Radar/source/persist/DAG/Oficina causal; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação / Economia / Meta-jogo; **Coverage Matrix**.

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
- telemetria pode revelar defeitos, mas não reescreve automaticamente o Curriculum Graph.

### Recibo funcional da Coverage Matrix

`38d24c670fde6d432af01b47e09089d7df7c01dd`, CI #832 / run `31334991192`: **160 arquivos / 2.378 testes**, Coverage Matrix, auditorias, grafo, TypeScript, build, `pr:check`, higiene, binários e sonda real Sensei verdes. Artefato da sonda: `9044053557`.

Documentação de handoff pode estar em commits posteriores; por isso **sempre** verificar o head atual da PR e seu CI antes de editar.

## Coverage Matrix — FECHADA

Gate executável:

- `AI_Studio_Lab/tools/coverage_matrix.ts`;
- `src/curriculum/coverageMatrix.test.ts`;
- `npm run coverage:matrix`;
- `npm run coverage:matrix:markdown`;
- `npm run coverage:matrix:json`;
- `npm run auditar` executa a matriz.

Baseline provado:

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- 51/90 servidas sem placeholder;
- 25 legado;
- 39 fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

A matriz também registra onboarding visual por competência, testes nominais, dívida, ação necessária, onda causal e impacto por descendentes no DAG. Se os números mudarem, **investigar e reconciliar; nunca ajustar expectativa para ficar verde**.

## Faça agora — FÁBRICA CURRICULAR POR ONDAS

Usar a Coverage Matrix como mapa executável. Atacar por ordem causal, não por conveniência nem por série:

1. bloqueios de primitiva/builder que impedem competências reais;
2. dívida de bases com maior impacto no DAG;
3. 25 legados, migrados regression-first para ficha/Composer;
4. 39 fallbacks, materializados com ficha + screen/primitiva + onboarding + testes antes da ativação;
5. 21 divergências ficha↔screen;
6. 12 trocas visuais e 44 estreias, classificando onboarding/ponte visual;
7. preservar em cada onda learner state, DAG, Sensei, persistência, telemetria e contratos de domínio.

Não massificar conteúdo em dependentes enquanto uma base/primitiva causal relevante estiver quebrada. Uma competência só sobe para padrão-ouro quando a experiência real da criança concorda com a ficha.

## Visão futura preservada — não executar agora

Companheiro/NPC vivo, widget móvel, emoções/retratos, cuidados suaves, animais lutadores humanoides em HD pixel art, fighting game/beat ’em up 2.5D e `Laboratório de Raciocínio / Thinking Lab` permanecem em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

Não autorizam tocar no Creature Engine nesta fila.

## Fila vigente

`Coverage Matrix FECHADA → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

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
