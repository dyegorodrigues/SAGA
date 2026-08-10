# Briefing operacional — continue daqui

> **VIGENTE em 10/ago/2026.** W1–W5 estão funcionalmente materializadas; W5 é **GM.05 / F61 / Regua**. Antes de qualquer W6, reancore o GitHub e confirme CI integral do HEAD remoto. Não confie em memória de chat.

## Leia

1. `CHECKPOINT_FABRICA_CURRICULAR_W5_GM_05_FECHADA_2026-08-10.md`;
2. `AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`;
3. `RETOMADA.md`;
4. `HANDOFF_CONTINUIDADE_IA.md`;
5. checkpoint pré-W5 + W4/W3/W2/W1 + Coverage Matrix;
6. cânone em `AI_Studio_Lab/pedagogia/` e `curriculum/grafo_saga.yaml`.

## Git — não negociar

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- PR #29 open + draft + unmerged;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- não merge/rebase/ready/auto-merge;
- não criar branch auxiliar;
- Creature Engine fora desta fila;
- GitHub remoto é a fonte da verdade.

## Coverage Matrix após W5

Snapshot P21.1 continua imutável: `26 / 25 / 39 / 51 / 21`, 12 swaps, 44 estreias, blockers históricos `Moedas` + `Regua`.

Ledger:

- W1 N1.04: divergência −1;
- W2 N1.05: Composer +1, legado −1, divergência −1;
- W3 N2.01: Composer +1, legado −1, divergência −1;
- W4 N1.12: Composer +1, legado −1, divergência −1;
- **W5 GM.05: Composer +1, fallback −1, servidas +1.**

Baseline vigente observado: **30 Composer / 22 legado / 38 fallback / 52 servidas / 17 divergências / 12 swaps / 44 estreias**. Único blocker de primitive: **Moedas**.

A estreia permanece 44: `Regua` já entrou na linguagem visual quando a implementação física nasceu inativa; a promoção GM.05 não cria uma segunda estreia.

## W5 / F61 — contrato real

Pré-requisitos executáveis: `GM.12 + N2.02`. N2.04 não é prereq da F61 vigente.

Progressão:

- L1: medida informal por bolas iguais tangentes;
- L2: régua alinhada + leitura inteira;
- L3: alinhar zero + medir;
- L4: medir/comparar dois objetos distintos;
- L5: estimar inteiro → alinhar → medir → unidade.

### Regras visuais que viraram invariantes

A revisão visual humana encontrou e rejeitou versões que tecnicamente “passavam” mas eram inadequadas: cápsula+emoji, carrinho-limusine, borracha repetida, `12` fora da régua, clipes emoji com whitespace, meia marca `0,5`, container correto com silhueta errada e tick 0 deslocado por border.

Estado vigente:

- sem emoji/sprite como objeto/unidade métrica;
- objetos longitudinais plausíveis: lápis, pincel, giz de cera, marcador, fita de treino;
- `ponta visível inicial = tick 0` e `ponta visível final = tick correto`;
- apenas centímetros inteiros na F61;
- L1 usa bolas procedurais de diâmetro constante, `gap=0`, extensão total igual ao objeto;
- `Regua` usa sistema de coordenadas sem border deslocando o tick 0;
- rótulo final contido;
- tap e drag equivalentes; filtro motor soberano;
- `ALINHOU_ZERO` nunca é fabricada pelo tutorial.

Fonte normativa: `RETIFICACAO_W5_F61_GM_05_2026-08-10.md`.

## QA F61

`npm run sonda:regua` é gate permanente e precisa rodar em Chrome real:

- 320/390/900 px;
- L1–L5;
- todos os ticks/rótulos inteiros;
- silhueta visível contra ticks reais;
- bolas L1 tangentes;
- L4 com dois tipos/comprimentos distintos;
- tap/drag/estimativa;
- screenshots de todos os níveis/larguras.

**Não declarar qualidade visual com base apenas em jsdom, container geometry ou CI genérico.**

## Dívida atual

- 22 legados;
- 38 fallback;
- 17 divergências;
- `Moedas`: único blocker, renderer-sem-builder, afeta GM.03;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer-sem-builder;
- `Quadrado100`: componente isolado;
- primitives: 21 executáveis / 4 renderer-sem-builder / 1 isolada / 0 ausentes.

## W6 — recalcular, não adivinhar

Antes de código:

1. reancorar PR/head/CI;
2. gerar Coverage Matrix Markdown/JSON;
3. cruzar DAG: profundidade + descendentes;
4. pesar legado/fallback + divergência + blocker + onboarding + motor/a11y + risco pedagógico + primitive reuse + custo/evidência;
5. `Moedas/GM.03` merece peso alto, mas não é seleção hardcoded;
6. escolher uma competência.

Depois:

`regression-first → ficha/contract/procedure → stage/boundary/evidência/a11y → registro INATIVO → suíte + browser se geométrico → CI verde → canário → Matrix observa → ledger → gates → checkpoint`.

## Contratos permanentes

- learner state é autoridade de mastery/unlock/prescrição;
- nível curricular pertence ao perfil/criança;
- XP lifetime não gastável; moedas spendable atômicas;
- RT não multiplica mastery/XP;
- fallback sem evidência/recompensa real;
- Misto dobra moedas apenas;
- Atlas/insígnias derivam graph + learner state;
- retry/replay idempotentes;
- Matrix derivada; snapshots históricos imutáveis;
- telemetria observa; não reescreve currículo automaticamente;
- LLM não é soberano em runtime;
- mudanças invasivas de Thinking Lab exigem Invariant Impact Review.

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
npm run sonda:reta20
npm run sonda:regua
```

**Fonte real primeiro → Matrix observa → ledger por último. Experiência visual real da criança é parte do contrato.**
