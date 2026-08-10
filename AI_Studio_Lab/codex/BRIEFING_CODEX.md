# Briefing operacional — continue daqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`. Coverage Matrix, W1/N1.04, W2/N1.05 e **W3/N2.01** estão fechadas com CI remoto real. Próxima tarefa única: **W4**, escolhida pela Matrix/DAG; N1.12/F19 é o candidato preliminar mais forte.

## Leia

1. `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`;
2. `RETOMADA.md`;
3. `HANDOFF_CONTINUIDADE_IA.md`;
4. checkpoints W2, W1 e Coverage Matrix;
5. cânone em `AI_Studio_Lab/pedagogia/`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 sempre open + draft + unmerged. Main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`. Não tocar no Creature Engine, não criar branch auxiliar, não merge/rebase/ready/auto-merge. Reancorar PR/head/CI antes de qualquer edição.

## Não reabra sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01**.

## Recibo W3

Head funcional: `929dc5b234a842116b31b998850ceacabe2248dd`  
CI #916 / run `31386605676`: success integral.

- 28 Composer / 23 legado / 39 fallback / 51 servidas;
- 18 divergências / 12 swaps / 44 estreias;
- blockers `Moedas`, `Regua`;
- TypeScript verde;
- **166 arquivos / 2443 testes verdes**;
- build e `pr:check` verdes;
- sonda real Sensei verde em phone+tablet;
- artefato `9061964350`, SHA-256 `cb0bd490ab0b6576043bab8869d8c55e9786513767f102c0e5a9b7a38e5b1fcb`.

O estado W3 inativo só foi promovido depois do CI #912 integralmente verde. A reancoragem desta sessão corrigiu uma declaração prematura de fechamento e uma meia-migração real; não repetir esse erro.

## Coverage Matrix

Snapshot P21.1: **26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências**.

Ledger:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1.

Baseline vigente: **28 / 23 / 39 / 51 / 18**, 12 swaps, 44 estreias, mesmos blockers.

Fonte muda primeiro → Matrix observa → ledger por último. Nunca mascarar divergência ajustando baseline sem causalidade.

## W4 — decisão e execução

Antes de escrever código, ranquear os nós de dívida pela Matrix vigente + DAG. Critérios: profundidade, descendentes, legado/fallback, divergência, blocker, onboarding/a11y, risco pedagógico e custo.

### N1.12 / F19 — candidato preliminar

Razões já verificadas:

- legado + divergente;
- prereqs `N1.07`, `N1.09` já autorais;
- YAML marca prioridade 1;
- legado atual ensina progressão diferente da ficha;
- `InteractiveNumberLine` já existe, mas não satisfaz a experiência produtiva F19.

F19 exige:

- L1 localizar 0–10;
- L2 localizar 0–20;
- L3 +1/+2;
- L4 −1/−2;
- L5 misto ±1/±2;
- gesto produtivo com snap generoso;
- alternativa por toque ao drag;
- imprecisão motora não vira erro matemático;
- caminho fica visível;
- erro balança sem deslocar;
- fala dos números acompanha movimento real;
- domínio 3/3 em duas sessões; RT L5 7s;
- reconciliar `CONTA_SEM_POSICAO`, `DIRECAO_INVERTIDA`, `ERRO_DE_UM`, `SO_SEQUENCIA`.

Se confirmado como W4:

`regressão → contract/procedure → evoluir InteractiveNumberLine existente → stage/boundary/telemetria/a11y → registro inativo → CI → canário → Matrix observa → ledger → gates → checkpoint`.

Não duplicar primitive e não converter precisão de dedo em evidência de aprendizagem.

## Thinking Lab / arquitetura

Trate como trilha de **risk review**, não como autoridade de runtime. Propostas úteis (simulador de criança, property-based testing, QA visual/áudio, agentes, observabilidade) podem entrar incrementalmente. Qualquer proposta que mexa em grafo, learner state, evidência, runtime determinístico/offline, persistência, privacidade ou rollback precisa de Invariant Impact Review antes de backlog.

Até o checkpoint W3 não há sinal de reconstrução total do SAGA.

## Contratos permanentes

- learner state decide mastery/unlock/prescrição;
- RT/velocidade não compra mastery nem XP;
- fallback não gera evidência/recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam do grafo + learner state;
- Coverage Matrix é projeção derivada;
- telemetria observa e abre investigação, não altera cânone automaticamente;
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
```

**Regression-first. Fonte real primeiro. Matrix depois. Ledger por último.**