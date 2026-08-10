# Retomada — comece por aqui

> **VIGENTE em 10/ago/2026.** W1–W4 estão fechadas e a W5 selecionou causalmente **GM.05 / F61 / Regua**. O runtime W5 está ativo e a Coverage Matrix já registrou a migração observada. Antes de iniciar W6, confirme o CI do HEAD remoto e leia o checkpoint W5 + a retificação normativa visual F61.

## Leia primeiro

1. `CHECKPOINT_FABRICA_CURRICULAR_W5_GM_05_FECHADA_2026-08-10.md`;
2. `AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`;
3. `CHECKPOINT_RECONCILIACAO_DOCUMENTAL_PRE_W5_FECHADA_2026-08-10.md`;
4. `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
5. `BRIEFING_CODEX.md` e `HANDOFF_CONTINUIDADE_IA.md`;
6. checkpoints W3/W2/W1 + `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`;
7. cânone em `AI_Studio_Lab/pedagogia/` e `curriculum/grafo_saga.yaml`.

GitHub remoto + gates executáveis vencem memória de conversa ou texto histórico conflitante.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 permanece **open + draft + unmerged**;
- não ready, não auto-merge, não merge/rebase na main;
- não tocar no Creature Engine nesta fila;
- não criar branch auxiliar;
- reancorar PR/head/CI antes de qualquer nova edição.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; Coverage Matrix; **W1/N1.04; W2/N1.05; W3/N2.01; W4/N1.12; W5/GM.05**.

## Coverage Matrix vigente após W5

Snapshot P21.1 continua histórico e imutável:

`26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias`, blockers históricos `Moedas`, `Regua`.

Ledger vigente:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1;
- `W4-N1.12`: Composer +1, legado −1, divergências −1;
- `W5-GM.05`: Composer +1, fallback −1, servidas +1.

Baseline observado vigente:

- **30 Composer**;
- **22 legado**;
- **38 fallback**;
- **52 servidas**;
- **17 divergências ficha↔screen**;
- **12 swaps**;
- **44 estreias**;
- única primitiva bloqueadora: **`Moedas`**.

Importante: W5 **não** aumentou estreias para 45. `Regua` já era contabilizada como estreia visual quando a primitive física nasceu ainda com GM.05 inativa; a promoção curricular alterou somente Composer/fallback/servidas.

## W5 — GM.05 / F61 / Regua

Seleção causal: GM.05 combinava fallback real, primitive estruturalmente ausente, pré-requisitos já servidos e impacto descendente em medidas. `Moedas/GM.03`, N5.01 e nós legados/divergentes também foram avaliados; W5 não foi escolhida apenas por ser blocker.

Fluxo comprovado:

`regression-first → ficha/contract/procedure/stage → registro inativo → suíte + Chrome real → ativação canário → Matrix observa delta → ledger`.

GM.05 usa os pré-requisitos vigentes:

- `GM.12`;
- `N2.02`.

A frase histórica de F61 que exigia N2.04 foi formalmente aposentada pela retificação normativa; nenhum arco do DAG foi alterado.

### Progressão vigente F61

- **L1:** medida informal com bolas iguais, tangentes, sem gaps/overlap;
- **L2:** régua já alinhada; leitura em centímetros inteiros;
- **L3:** alinhar a marca 0 e medir;
- **L4:** medir dois objetos distintos e comparar;
- **L5:** estimar em cm inteiros, alinhar, medir e conferir unidade.

A F61 atual **não ensina 0,5 cm**. Ticks/rótulos/respostas de meia unidade são proibidos nesta progressão.

### Retificação visual obrigatória

A primeira versão da W5 passou gates insuficientes e a revisão visual encontrou defeitos reais: cápsula genérica com emoji, carrinho esticado, borracha repetida, rótulo 12 vazando, clipes emoji incapazes de medir ponta a ponta, meia marca 0,5, teste da caixa invisível em vez da silhueta e deslocamento de ~2 px do tick 0 pela borda CSS.

Esses defeitos viraram contratos executáveis. O estado vigente:

- nenhum emoji/sprite define o comprimento do objeto;
- objetos usados são longitudinalmente plausíveis: lápis, pincel, giz de cera, marcador e fita de treino;
- pontas/caps têm tamanho fixo; o corpo longitudinal absorve variação;
- `ponta visível inicial = tick 0`;
- `ponta visível final = tick inteiro da resposta`;
- régua usa apenas marcas inteiras na F61;
- L1 usa bolas procedurais de diâmetro constante, `gap=0`, extensão total exatamente igual à do objeto;
- rótulo final permanece dentro da madeira;
- drag + alternativa por toque preservados;
- imprecisão motora não vira misconception;
- `ALINHOU_ZERO` só nasce por ação real da criança.

Fonte normativa: `AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`.

### QA obrigatório F61

`npm run sonda:regua` é gate permanente em Chrome real e verifica:

- 320 / 390 / 900 px;
- L1–L5;
- ausência de overflow;
- somente ticks/rótulos inteiros;
- unidades L1 tangentes e extensão correta;
- extremos **visíveis** do objeto contra ticks reais;
- L4 com tipos/comprimentos distintos;
- tap, drag e estimar→medir;
- screenshots de todos os níveis/larguras.

Para primitive geométrica infantil, **CI unitário verde não substitui inspeção/sonda visual real**.

## Dívida objetiva após W5

- **22 legados**;
- **38 fallback**;
- **17 divergências**;
- `Moedas`: única primitive bloqueadora; renderer sem builder, afeta GM.03;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer sem builder;
- `Quadrado100`: componente isolado;
- inventário: **21 executáveis / 4 renderer-sem-builder / 1 isolada / 0 ausentes**.

Legados vigentes (22):
`N2.02, N2.03, N3.01, N3.02, N3.03, N3.04, N3.05, N3.06, N3.07, N3.08, AL.03, GM.03, GM.04, PE.01, N2.04, N3.11, N3.12, N3.13, N4.01, N4.02, N4.05, N2.05`.

Fallback vigentes (38):
`N5.01, AL.04, AL.05, GE.03, GE.04, GE.05, GM.06, GM.07, PE.02, N2.06, N4.10, N4.11, N4.12, N5.02, N5.03, N5.04, N6.01, N6.02, AL.06, GE.06, GE.07, GE.08, GM.08, GM.09, PE.03, N2.07, N6.03, N6.04, N5.05, N7.01, N7.02, AL.07, AL.08, GE.09, GE.10, PE.04, GM.10, GM.11`.

Divergências vigentes (17):
`N2.03, N3.02, N3.03, N3.04, N3.05, N3.06, N3.08, AL.03, GM.03, PE.01, N2.04, N3.13, N4.01, N4.03, N4.06, N4.07, N2.05`.

## Próxima ação — W6 ainda NÃO selecionada

1. reancorar PR #29, HEAD e CI exato;
2. gerar/inspecionar Coverage Matrix viva + DAG;
3. recalcular ranking por profundidade/descendentes, fallback/legado, divergência, blocker, onboarding, motor/a11y, risco pedagógico, reuso de primitive e custo;
4. dar peso alto a `Moedas/GM.03`, sem hardcode;
5. escolher **uma** competência W6;
6. repetir o workflow regression-first/inativo/CI/browser/canário/Matrix/ledger.

## Contratos permanentes

- learner state decide mastery/unlock/prescrição;
- curricular level pertence ao perfil/criança;
- XP lifetime não é gastável; moedas gastáveis são atômicas;
- RT/velocidade não multiplicam mastery nem XP;
- fallback não gera evidência/recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam do grafo + learner state;
- retry/replay são idempotentes;
- Coverage Matrix é projeção derivada e snapshots históricos são imutáveis;
- telemetria observa, não reescreve o grafo automaticamente;
- LLM não é soberano do runtime;
- mudança invasiva de Thinking Lab exige Invariant Impact Review;
- Creature Engine permanece fora desta fila.

## Gates de cada fechamento

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
npm run sonda:reta20
npm run sonda:regua
```

**Uma competência só está pronta quando código, ficha, learner state/evidência, diagnóstico, a11y, experiência visual real, Matrix e CI do mesmo HEAD concordam.**
