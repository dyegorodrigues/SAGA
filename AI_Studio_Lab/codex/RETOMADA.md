# Retomada — comece por aqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`. Coverage Matrix e ondas **W1/N1.04, W2/N1.05, W3/N2.01 e W4/N1.12** estão fechadas com recibo remoto. Próxima tarefa única: escolher W5 pela Coverage Matrix/DAG vigente — não por ordem numérica nem por memória do chat.

## Leia primeiro

1. `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
2. `BRIEFING_CODEX.md` e `HANDOFF_CONTINUIDADE_IA.md`;
3. checkpoints W3, W2, W1 e `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`;
4. cânone em `AI_Studio_Lab/pedagogia/`, especialmente `BIBLIA_DO_SAGA.md` e as fichas autorais.

GitHub remoto + gates executáveis vencem qualquer texto antigo ou memória de conversa.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 deve permanecer **open + draft + unmerged**;
- não ready, não auto-merge, não merge/rebase na main;
- não tocar no Creature Engine nesta fila;
- não criar branch auxiliar;
- antes de editar: reancorar PR/head/CI e resolver qualquer falha objetiva primeiro.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01; W4/N1.12**.

## Recibo funcional W4

Head funcional: `841a4a3691662829b9d1432ff070191522fd9a6e`.

CI **#975 / run `31404572801` — success integral**:

- 90 competências / 94 fichas autorais;
- Composer **29**; legado **22**; fallback **39**; servidas **51**;
- divergências **17**; swaps **12**; estreias **44**;
- blockers `Moedas`, `Regua`;
- TypeScript verde;
- **169 arquivos de teste / 2480 testes passando**;
- build e `pr:check` verdes;
- higiene do diff e guarda de binários verdes;
- sonda Sensei/Matrícula verde;
- sonda F19 Chrome real verde em 320/390/900 px, níveis 1–5, tap + drag.

Artefato F19: ID `9069082798`, SHA-256 `65a1d3ab456f4320709547dcc98f87958f8ed083fb978b8a80322059e03629f3`.

Artefato Sensei: ID `9069071435`, SHA-256 `d8b4060ee5bc98feb64a0bc56f7d4b7c0fc5c8ca85f8416730657a83976cf38b`.

## Coverage Matrix — snapshot + ledger

Snapshot P21.1 é imutável: **26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias**, blockers `Moedas`, `Regua`.

Ledger:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1;
- `W4-N1.12`: Composer +1, legado −1, divergências −1.

Baseline vigente: **29 / 22 / 39 / 51 / 17**, 12 swaps, 44 estreias e os mesmos blockers.

Regra: fonte real muda primeiro → Matrix observa → migração nomeada governa. Nunca reescrever snapshot ou expectativa só para ficar verde.

## W4/F19 — o que ficou fechado

N1.12 agora é Composer ativo e entrega uma reta numérica produtiva/responsiva:

- mesma `InteractiveNumberLineSurface` reutilizada, sem primitive duplicada;
- tap físico resolvido pelo plano da reta + geometria/snap;
- drag real pode começar sobre o foguete;
- `pointercancel` não publica resposta;
- soltura fora da reta nunca vira acerto por clamp;
- imprecisão motora não vira misconception;
- L2 mostra arcos unitários; L3+ retira esse andaime;
- salto por tap anima casa a casa, bipa em cada casa e publica só no fim;
- drag bipa as casas atravessadas e publica na soltura;
- TTS é uma única frase de chegada para evitar autocancelamento;
- `CONTA_MARCAS` é assinatura por tentativa e não vaza em retry;
- sonda Chrome permanente mede geometria e colisão de rótulos.

No phone, todas as marcas 0–20 continuam presentes/interativas; para manter legibilidade em 320/390 px, rótulos ímpares 11/13/15/17/19 são ocultados visualmente. Em largura maior, 0–20 permanecem integralmente rotulados.

Não reabrir W4 sem falha objetiva.

## Faça agora — escolher W5

1. reancorar PR #29, HEAD e CI;
2. gerar/inspecionar `npm run coverage:matrix:markdown` ou JSON;
3. ranquear dívida por profundidade/impacto no DAG, legado/fallback, divergência, blocker de primitive, onboarding/motor/a11y e risco pedagógico;
4. escolher **uma competência**;
5. ler ficha integral + runtime integral;
6. regression-first;
7. implementar inativo;
8. testar/sondar no nível apropriado;
9. promover canário somente com estado inativo verde;
10. deixar a Matrix observar o delta;
11. atualizar ledger só depois do delta real;
12. fechar checkpoint.

Blockers que merecem peso alto: `Moedas`/GM.03 e `Regua`/GM.05. A ordem final, porém, deve sair da Matrix/DAG.

## Dívida objetiva atual

- **22 legados**;
- **39 fallback**;
- **17 divergências ficha↔screen**;
- `Moedas`: renderer sem builder;
- `Regua`: ausente;
- `Quadrado100`: componente isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer sem builder;
- bundle >500 kB e warnings jsdom de canvas continuam hardening, não blockers da W4.

A lista completa está no checkpoint W4.

## Thinking Lab — regra de impacto

Pesquisa externa/Thinking Lab pode propor simuladores, property-based tests, QA visual/áudio, agentes e observabilidade. Isso **não** muda o cânone automaticamente.

Qualquer proposta que altere grafo, learner state, evidência, runtime determinístico/offline, persistência, privacidade ou rollback passa por **Invariant Impact Review**. Telemetria observa; não reescreve Curriculum Graph. IA propõe; não muta produção sem contracts/CI/revisão.

## Contratos permanentes

- learner state decide mastery/unlock/prescrição;
- RT/velocidade não compra mastery nem XP;
- fallback não gera evidência/recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam do grafo + learner state;
- Coverage Matrix é projeção derivada;
- Creature Engine fora desta fila.

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
```

**Para primitives responsivas em que gesto/geometria importam: unit/jsdom + sonda Chrome real.**

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**