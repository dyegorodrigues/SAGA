# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`. Próximo bloqueante único: **fábrica curricular por ondas pedagógicas guiadas pela Coverage Matrix**.

## Leia

1. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`
4. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`
5. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
6. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`
7. cânone em `AI_Studio_Lab/pedagogia/`: `BIBLIA_DO_SAGA.md`, `GRAFO_DE_CONHECIMENTO_SAGA.md`, `MANUAL_DIDATICO_SAGA.md`, `METODO_SAGA.md`, `DOJO_SAGA.md`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 deve permanecer open + draft + unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head remoto e CI antes de editar.

## Não reabra sem falha objetiva

Cânone P17–P22; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix** estão fechados.

### Recibo funcional verificável da Coverage Matrix

`38d24c670fde6d432af01b47e09089d7df7c01dd`, CI #832/run `31334991192`: **160 arquivos / 2.378 testes**, Coverage Matrix, auditorias, grafo, TypeScript, build, `pr:check`, higiene, binários e sonda real Sensei verdes; artefato `9044053557`.

Esse SHA é recibo funcional, não promessa de head eterno. Handoffs podem estar em commits posteriores: reancore o head atual da PR e o CI correspondente antes de qualquer edição.

## Coverage Matrix — autoridade operacional da fábrica

A matriz executável vive em `AI_Studio_Lab/tools/coverage_matrix.ts`, protegida por `src/curriculum/coverageMatrix.test.ts` e integrada a `npm run auditar`.

Ela deriva, para todas as 90 competências:

`grafo → ficha canônica → implementação real → screen/primitiva → Composer/Sensei → testes/auditoria → status → dívida/bloqueio → ação → ordem causal`.

Baseline provado:

- 90 competências / 94 fichas autorais;
- 26 padrão-ouro / Composer ativo;
- 25 legado;
- 39 fallback;
- 51/90 servidas sem placeholder;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

Também classifica onboarding visual, cobertura nominal de testes, onda causal e impacto por descendentes. Se mudar, investigar a fonte real; **não editar baseline para satisfazer o teste**.

## Faça agora — fábrica curricular por ondas

A fábrica deve obedecer à ordem causal da matriz e continuar regression-first.

Regras:

1. pagar primitiva/builder bloqueador antes de ativar competências dependentes;
2. priorizar bases com maior impacto no DAG dentro da onda causal;
3. migrar os 25 legados para ficha/Composer com prova de paridade ou justificativa pedagógica explícita;
4. materializar os 39 fallbacks somente com ficha, screen/primitiva, onboarding e testes prontos;
5. corrigir as 21 divergências ficha↔screen, não mascará-las;
6. tratar conscientemente as 12 trocas visuais e 44 estreias, incluindo microtutorial/ponte quando necessário;
7. não permitir que fábrica, meta-jogo ou telemetria criem segunda autoridade curricular — learner state + DAG permanecem soberanos.

A matriz é viva porque é derivada do repositório. Telemetria pode futuramente enriquecer observabilidade e abrir investigações; não reescreve automaticamente o Curriculum Graph.

## Contratos permanentes

- learner state decide aprendizagem/mastery/unlock/prescrição;
- Nível SAGA 1–100 é do perfil da criança;
- XP não compra competência;
- velocidade/RT não compra mastery;
- Dojo/Jardim têm estado de automaticidade separado;
- fallback não gera evidência nem recompensa real;
- Misto dobra moeda, não XP/mastery;
- Atlas/insígnias derivam do Curriculum Graph + learner state;
- Creature Engine permanece fora desta fila.

## Visão futura — preservada, fora da fila

Companheiro/NPC meta-inteligente, widget, emoções/retratos, animais lutadores humanoides/pixel art, fighting game, beat ’em up 2.5D e Thinking Lab permanecem documentados em `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`.

## Depois

`Coverage Matrix FECHADA → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

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
