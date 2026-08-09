# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`. Coverage Matrix e **W1/N1.04** estão fechadas. Próximo bloqueante único: **continuar a fábrica curricular pelo próximo nó causal da matriz**.

## Leia

1. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`
4. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
5. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
6. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
7. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
8. cânone em `AI_Studio_Lab/pedagogia/`: `BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md`, `DOJO_SAGA.md`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 deve permanecer open + draft + unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head remoto e CI antes de editar.

## Não reabra sem falha objetiva

Cânone P17–P22; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04** estão fechados.

### Recibo funcional da W1

`4637d205bc6d5b144dddc926e9f669d835f40d70`, CI #842/run `31340827946`: success integral — higiene, binários, Matrix/auditorias, grafo, TypeScript, testes, build, `pr:check` e sonda real Sensei verdes.

O conector não expôs o corpo detalhado do log para uma transcrição confiável da nova contagem total de testes. Não inferir esse número; usar o run #842 como recibo canônico.

## Coverage Matrix — autoridade operacional da fábrica

A matriz executável vive em `AI_Studio_Lab/tools/coverage_matrix.ts`, protegida por `src/curriculum/coverageMatrix.test.ts` e integrada a `npm run auditar`.

Ela deriva, para todas as 90 competências:

`grafo → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

Snapshot histórico P21.1:

- 90 competências / 94 fichas autorais;
- 26 Composer;
- 25 legado;
- 39 fallback;
- 51/90 servidas;
- **21** divergências ficha↔tela;
- 12 trocas visuais;
- 44 estreias;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Baseline vigente após W1:

- 90 / 94;
- 26 Composer;
- 25 legado;
- 39 fallback;
- 51 servidas;
- **20** divergências;
- 12 trocas visuais;
- 44 estreias;
- blockers `Moedas`, `Regua` inalterados.

`COVERAGE_CLOSED_BASELINE` preserva o fechamento histórico. `COVERAGE_MIGRATIONS` registra mudanças reais posteriores; `W1-N1.04` reduz divergências em 1 porque F03 foi reconciliada com `TouchCount`. Nunca editar baseline cosmeticamente para satisfazer o teste.

## W1/N1.04 — o que ficou provado

- o runtime `TouchCount` estava pedagogicamente mais correto do que a identidade stale da F03;
- F03 já mandava executar a contagem como F01; portanto sua primitiva canônica foi retificada para `TouchCount`;
- F01 e F03 agora têm proveniência explícita por micro e falas próprias;
- níveis 1–2 = F01; níveis 3–5 = F03;
- a divergência N1.04 saiu da Matrix: 21 → 20;
- teste nominal nasceu antes da correção;
- um detalhe lateral de F07 removido acidentalmente pela API foi detectado por diff e restaurado antes do fechamento.

## Faça agora — próximo nó da fábrica

Escolher o próximo alvo pela Matrix, combinando:

1. profundidade no DAG;
2. impacto em descendentes;
3. primitiva/builder bloqueador;
4. legado/fallback;
5. divergência ficha↔screen;
6. onboarding visual;
7. risco pedagógico de propagar uma base errada.

Fluxo obrigatório:

`investigar cânone + runtime → regressão primeiro → corrigir fonte real → Matrix/gates → governar delta → checkpoint → próximo nó`.

Não assumir que toda divergência significa runtime errado: W1 provou que o cânone também pode estar stale. A investigação decide.

## Contratos permanentes

- learner state decide aprendizagem/mastery/unlock/prescrição;
- Nível SAGA 1–100 é do perfil da criança;
- XP não compra competência;
- velocidade/RT não compra mastery;
- Dojo/Jardim têm estado de automaticidade separado;
- fallback não gera evidência nem recompensa real;
- Misto dobra moeda, não XP/mastery;
- Atlas/insígnias derivam do Curriculum Graph + learner state;
- telemetria observa e abre investigação; não reescreve automaticamente o grafo;
- Creature Engine permanece fora desta fila.

## Visão futura — preservada, fora da fila

Companheiro/NPC meta-inteligente, widget, emoções/retratos, animais lutadores humanoides/pixel art, fighting game, beat ’em up 2.5D e Thinking Lab permanecem documentados em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

## Depois

`Coverage Matrix FECHADA → fábrica curricular por ondas (W1 fechada; continuar) → mega auditoria integrada → hardening/performance → release`.

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
