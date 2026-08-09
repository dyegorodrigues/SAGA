# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`. Próximo bloqueante único: **fábrica curricular por ondas pedagógicas guiadas pela Coverage Matrix**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + **não mesclar/ready/auto-merge**;
- não tocar Creature Engine nesta fila;
- não criar branch auxiliar;
- reancorar PR/head/CI antes de editar;
- GitHub remoto é a fonte da verdade.

## Leia primeiro

1. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `BRIEFING_CODEX.md`
4. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
5. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
6. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
7. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
8. cânone: `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md`, `DOJO_SAGA.md`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix**.

### Recibo funcional verificável

Coverage Matrix fechada funcionalmente em `38d24c670fde6d432af01b47e09089d7df7c01dd`.

CI #832 / run `31334991192`: **success integral** — **160 arquivos / 2.378 testes**, matriz executável, auditorias, grafo, TypeScript, build, `pr:check`, higiene, binários e sonda real Sensei verdes; artefato `9044053557`.

Esse SHA é recibo funcional. A documentação de continuidade pode avançar em commits posteriores; portanto a próxima IA deve reancorar o **head remoto atual** da PR e seu CI em vez de pressupor que qualquer SHA narrado continua sendo o head.

### Contratos permanentes

- learner state é soberano para mastery/unlock/prescrição;
- Nível SAGA 1–100 é do perfil da criança, não do mascote;
- XP é vitalício e não compra aprendizagem;
- moedas são gastáveis e compras são atômicas;
- velocidade/RT não concede autoridade conceitual;
- criança lenta e correta não recebe menos XP;
- Misto 2× afeta moedas, não XP/mastery;
- fallback não gera evidência nem recompensa real;
- Atlas/insígnias vêm do Curriculum Graph + learner state;
- retry/double tap/reload/materialização repetida não duplicam o mesmo evento técnico;
- Coverage Matrix é projeção derivada, não segunda fonte de verdade curricular;
- telemetria pode abrir investigação, mas não reescreve automaticamente grafo/cânone;
- Creature Engine permanece fora desta fila.

## Coverage Matrix — FECHADA

A matriz executável conecta as 90 competências por:

`grafo → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

Implementação/gates:

- `AI_Studio_Lab/tools/coverage_matrix.ts`;
- `src/curriculum/coverageMatrix.test.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs` reconciliado com N4.09/`area`;
- `npm run coverage:matrix`;
- `npm run coverage:matrix:markdown`;
- `npm run coverage:matrix:json`;
- `npm run auditar` inclui a matriz.

Baseline confirmado:

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- 25 legado;
- 39 fallback;
- 51/90 servidas sem placeholder;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

A matriz classifica ainda onboarding visual, testes nominais, onda causal e impacto por descendentes. Mudança de contagem exige investigação/reconciliação, nunca edição cosmética do baseline.

## Próxima tarefa — FÁBRICA CURRICULAR POR ONDAS

Usar a matriz como fila executável. Ordem obrigatória de raciocínio:

1. primitiva/builder bloqueador antes da competência que depende dele;
2. bases com maior impacto causal antes de folhas de baixo impacto na mesma onda;
3. 25 legados → ficha/Composer por regression-first;
4. 39 fallbacks → implementação real + screen/primitiva + onboarding + testes antes da ativação;
5. corrigir as 21 divergências ficha↔screen;
6. tratar as 12 trocas visuais e 44 estreias conscientemente, sem assumir que ferramenta nova é autoinstrutiva;
7. preservar learner state, DAG, Sensei, persistência, telemetria e domínio multidimensional em cada onda.

Não massificar dependentes sobre uma base/primitiva quebrada. Não usar idade/série como ordem causal. Não transformar fábrica em autoridade paralela ao Tutor.

## Visão futura preservada

`VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` continua guardando a direção de produto: companheiro/NPC persistente, widget, emoções/retratos, necessidades suaves, animais lutadores humanoides em HD pixel art, futuro fighting game/beat ’em up 2.5D e `Laboratório de Raciocínio / Thinking Lab`.

Tudo pode ser refinado. Nada disso autoriza tocar no Creature Engine nesta fila.

## Fila

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

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**
