# Handoff de continuidade — SAGA

> **VIGENTE — 10/ago/2026.** W5 materializou **GM.05 / F61 / Regua** e a Matrix já contém `W5-GM.05`. Não iniciar W6 sem reancorar HEAD/CI e sem reler a retificação visual F61.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- PR #29 open + draft + unmerged;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- não merge/rebase/ready/auto-merge;
- nenhuma branch auxiliar;
- Creature Engine fora desta fila;
- GitHub remoto é a fonte da verdade.

## Ordem de leitura

1. `CHECKPOINT_FABRICA_CURRICULAR_W5_GM_05_FECHADA_2026-08-10.md`;
2. `AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`;
3. `RETOMADA.md`;
4. `BRIEFING_CODEX.md`;
5. reconciliação pré-W5 + W4/W3/W2/W1 + Coverage Matrix;
6. cânone pedagógico + `curriculum/grafo_saga.yaml`.

## Estado curricular atual

Snapshot P21.1 imutável:
`26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias`.

Após W1–W5, projeção vigente:

- **30 Composer**;
- **22 legado**;
- **38 fallback**;
- **52 servidas**;
- **17 divergências**;
- **12 swaps**;
- **44 estreias**;
- blocker restante: **Moedas**.

Ledger W5: `{ composer: +1, fallback: -1, served: +1 }`. Não inventar `toolIntroductions +1`: Regua já era estreia visual antes da promoção do canário.

## W5 / GM.05 / F61

GM.05 foi escolhida pela Matrix+DAG após a reconciliação pré-W5. A implementação atravessou regression-first, registro inativo, CI/Chrome real, ativação, Matrix observada e ledger.

Pré-requisitos vigentes: `GM.12 + N2.02`.

Progressão vigente:

- L1 bolas iguais tangentes como unidade informal;
- L2 régua alinhada + cm inteiros;
- L3 alinhar zero + medir;
- L4 medir/comparar dois objetos distintos;
- L5 estimar inteiro → medir → escolher unidade.

### Invariantes visuais F61

A revisão humana do artifact encontrou problemas que o primeiro gate não enxergava. Eles foram tratados como bugs de produto/pedagogia e convertidos em regressões:

- não usar cápsula genérica/emoji para representar objeto;
- não esticar objetos de proporção rígida, como carrinho ou borracha;
- não repetir o mesmo objeto na comparação;
- não deixar rótulo final sair da régua;
- não usar emoji de clipe como unidade física;
- não mostrar meia marca `0,5 cm` nesta progressão;
- não validar só container: medir a silhueta visível;
- decoração/border não pode deslocar tick 0.

Estado atual:

- objetos procedurais plausíveis: lápis, pincel, giz de cera, marcador, fita de treino;
- extremos visíveis instrumentados;
- `extremo inicial = tick 0`;
- `extremo final = tick inteiro correto`;
- apenas marcas inteiras;
- L1: bolas procedurais, diâmetro constante, `gap=0`, sem emoji/sprite, largura total exata;
- snap generoso + alternativa de toque;
- imprecisão motora não vira misconception;
- `ALINHOU_ZERO` só por ação da criança.

A autoridade normativa é `RETIFICACAO_W5_F61_GM_05_2026-08-10.md`. Frases antigas conflitantes no monolito F2 são proveniência histórica e não definem o runtime atual.

## QA obrigatório

A sonda F61 mede Chrome real em 320/390/900 px e L1–L5. Ela falha por:

- overflow;
- tick/rótulo decimal;
- unidade informal com gap/overlap;
- silhueta sem extremos auditáveis;
- ponta visível que não bate no tick;
- L4 com objetos iguais ou rígidos;
- falha de tap/drag/estimativa;
- label final fora da madeira.

Screenshots de todos os níveis/larguras fazem parte do artifact. Não trocar esse gate por jsdom.

## Dívida viva

- legados: 22;
- fallback: 38;
- divergências: 17;
- `Moedas`: único blocker; renderer-sem-builder, GM.03;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer-sem-builder;
- `Quadrado100`: componente isolado;
- inventário: 21 executáveis / 4 renderer-sem-builder / 1 isolada / 0 ausentes.

## Próxima onda

**W6 não está selecionada.** Recalcular a partir das fontes atuais:

1. PR/head/CI;
2. Matrix viva;
3. DAG e descendentes;
4. fallback/legado/divergência;
5. blocker/reuso de primitive;
6. onboarding, motor/a11y e risco pedagógico;
7. custo e evidência.

`Moedas/GM.03` deve receber peso alto por ser o último blocker, mas a seleção não pode ser hardcoded.

Depois repetir:

`regressão → implementação inativa → gates → browser quando aplicável → canário → Matrix observa → ledger → checkpoint`.

## Alvos de encerramento da fábrica curricular

O projeto só chega ao fechamento curricular quando:

- nenhuma competência permanece fallback sem conteúdo real;
- todo legado é migrado ou explicitamente aceito com justificativa/evidência;
- divergências ficha↔screen chegam a zero ou exceções normativas explícitas;
- não há primitive bloqueadora;
- cada primitive usada tem ownership/build/render/test coerentes;
- onboarding visual existe nas estreias/trocas que precisam dele;
- geometria/motor/a11y passam em browser real onde necessário;
- learner state, reward, persistência, telemetry e DAG mantêm os invariantes;
- Coverage Matrix final é derivada das fontes, não editada para ficar verde.

## Invariantes permanentes

- learner state é autoridade;
- nível curricular pertence à criança/perfil;
- XP lifetime não gastável; moeda spendable atômica;
- RT não multiplica mastery/XP;
- fallback não recompensa nem gera evidência real;
- Misto dobra só moedas;
- Atlas/insígnias derivam graph + learner state;
- retry/replay idempotentes;
- snapshots da Matrix são históricos e imutáveis;
- telemetria não reescreve o Curriculum Graph;
- LLM não é soberano em runtime;
- alterações Thinking Lab de graph/state/evidence/persist/privacy/offline/rollback exigem Invariant Impact Review.

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

**Não avance por aparência de progresso: avance somente quando fonte, comportamento real e recibos do mesmo HEAD concordarem.**
