# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`. Coverage Matrix e **W1/N1.04** estão fechadas. Próximo bloqueante único: **continuar a fábrica curricular pelo próximo nó causal da Coverage Matrix**.

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

1. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `BRIEFING_CODEX.md`
4. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`
5. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
6. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
7. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
8. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
9. cânone: `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md`, `DOJO_SAGA.md`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04**.

### Recibo funcional verificável da W1

Head funcional: `4637d205bc6d5b144dddc926e9f669d835f40d70`.

CI #842 / run `31340827946`: **success integral** — higiene, binários, Coverage Matrix/auditorias, grafo, TypeScript, testes, build, `pr:check` e sonda real Sensei verdes.

O conector GitHub não expôs de forma confiável nesta sessão o corpo detalhado do log para transcrever a nova contagem total de testes. Não inferir. O run #842 é o recibo canônico.

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
- `COVERAGE_CLOSED_BASELINE` é histórico; evolução usa `COVERAGE_MIGRATIONS`;
- Creature Engine permanece fora desta fila.

## Coverage Matrix — FECHADA, COM LEDGER EVOLUTIVO

A matriz executável conecta as 90 competências por:

`grafo → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

Implementação/gates:

- `AI_Studio_Lab/tools/coverage_matrix.ts`;
- `src/curriculum/coverageMatrix.test.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- `npm run coverage:matrix`;
- `npm run coverage:matrix:markdown`;
- `npm run coverage:matrix:json`;
- `npm run auditar` inclui a matriz.

Snapshot histórico P21.1:

- 90 competências / 94 fichas autorais;
- Composer 26/90;
- 25 legado;
- 39 fallback;
- 51/90 servidas;
- **21** divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Baseline vigente após `W1-N1.04`:

- 90 / 94;
- Composer 26;
- legado 25;
- fallback 39;
- servidas 51;
- **20** divergências;
- 12 trocas visuais;
- 44 estreias;
- `Moedas` e `Regua` seguem bloqueadoras.

O fechamento de 21 não foi apagado: `W1-N1.04` registra `delta.divergences = -1` no ledger. Toda mudança futura de contagem precisa nascer da fonte real, aparecer na Matrix e só então ser governada por migração nomeada.

## W1/N1.04 — FECHADA

- teste nominal regression-first;
- `TouchCount` preservado como gramática correta de contagem;
- `fonte` explícita: níveis 1–2 F01, níveis 3–5 F03;
- falas pedagógicas separadas por origem;
- nível 5 não promete marcação visual retirada;
- F03 autoral reconciliada de `EmojiRow / ScatteredItems` para `TouchCount` porque seu próprio roteiro exige o comportamento da F01;
- divergência N1.04 removida objetivamente: 21 → 20;
- alteração lateral acidental em F07 detectada por diff e restaurada antes do fechamento.

## Próxima tarefa — CONTINUAR A FÁBRICA

A próxima competência deve ser escolhida pela Matrix, não por série ou conveniência. Ordem de raciocínio:

1. profundidade no DAG;
2. impacto causal/descendentes;
3. primitiva/builder bloqueador;
4. base legado/fallback;
5. divergência ficha↔screen;
6. onboarding/ponte visual;
7. risco de propagar um modelo pedagógico errado.

Fluxo por nó:

`investigar cânone + runtime → regressão primeiro → corrigir fonte real → Matrix/gates → governar eventual delta → checkpoint → próximo nó`.

N1.04 deixou uma lição operacional: divergência não implica automaticamente runtime errado. O cânone também pode estar stale; a investigação precisa decidir antes da implementação.

Dívida ainda viva:

- 25 legados;
- 39 fallbacks;
- 20 divergências;
- 12 trocas visuais;
- 44 estreias;
- `Moedas`/GM.03;
- `Regua`/GM.05;
- `Quadrado100` componente isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition` renderer sem builder completo.

Não massificar dependentes sobre base/primitiva quebrada. Não usar idade/série como ordem causal. Não transformar fábrica, meta-jogo ou telemetria em autoridade paralela ao Tutor.

## Visão futura preservada

`VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md` continua guardando a direção de produto: companheiro/NPC persistente, widget, emoções/retratos, necessidades suaves, animais lutadores humanoides em HD pixel art, futuro fighting game/beat ’em up 2.5D e `Laboratório de Raciocínio / Thinking Lab`.

Nada disso autoriza tocar no Creature Engine nesta fila.

## Fila

`Coverage Matrix FECHADA → fábrica curricular por ondas (W1/N1.04 fechada; seguir próximo nó) → mega auditoria integrada → hardening/performance → release`.

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
