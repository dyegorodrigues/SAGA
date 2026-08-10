# Handoff de continuidade — SAGA

> **VIGENTE — 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`. Coverage Matrix, W1/N1.04, W2/N1.05 e **W3/N2.01** estão fechadas com recibo remoto. Próxima tarefa única: **W4** por causalidade; N1.12/F19 é candidato preliminar, não escolha automática.

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

1. `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`;
2. `RETOMADA.md`;
3. `BRIEFING_CODEX.md`;
4. checkpoints W2, W1 e Coverage Matrix;
5. cânone em `AI_Studio_Lab/pedagogia/`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01**.

## Recibo funcional W3

Head funcional: `929dc5b234a842116b31b998850ceacabe2248dd`.

CI **#916 / run `31386605676` — success integral**:

- 90 competências / 94 fichas autorais;
- 28 Composer / 23 legado / 39 fallback / 51 servidas;
- 18 divergências / 12 swaps / 44 estreias;
- blockers `Moedas`, `Regua`;
- TypeScript verde;
- **166 arquivos / 2443 testes**;
- build + `pr:check` verdes;
- sonda Sensei real verde em phone+tablet;
- artefato ID `9061964350`, SHA-256 `cb0bd490ab0b6576043bab8869d8c55e9786513767f102c0e5a9b7a38e5b1fcb`.

Importante: a primeira alegação de fechamento W3 foi objetivamente desmentida pela reancoragem. A branch tinha uma meia-migração. O estado inativo só foi promovido depois do CI #912 integralmente verde. O checkpoint W3 registra toda a cronologia; não apagá-la.

## Coverage Matrix

Snapshot histórico P21.1 é imutável:

`26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias`.

Migrações:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1.

Baseline vigente:

`28 Composer / 23 legado / 39 fallback / 51 servidas / 18 divergências / 12 swaps / 44 estreias`.

Blockers continuam `Moedas` e `Regua`.

## W3/F21 — contrato preservado

- 10 unidades realmente agrupadas viram 1 dezena;
- L1/L2 com TenFrame; L3 sem moldura;
- L4 numeral → material;
- L5 decomposição mental D/U;
- 3/3 em duas sessões + `montou-do-numeral` no L4;
- `IGNORA_VALOR`, `INVERTE_ORDENS`, `NAO_AGRUPA` são os emissores canônicos;
- aliases provisórios antigos permanecem deprecated somente para compatibilidade histórica.

Não reabrir sem falha objetiva.

## W4 — como escolher

Ranquear pela Matrix vigente usando DAG/dependentes + dívida + divergência + blocker + onboarding/a11y + risco pedagógico.

### N1.12/F19 — forte candidato já auditado

- legado + divergente;
- prereqs N1.07/N1.09 já autorais;
- YAML marca `Prioridade 1 (kind novo)`;
- legado atual ensina antes/depois/entre e ±10, destoando da F19;
- `InteractiveNumberLine.tsx` existe e deve ser reutilizado/evoluído.

F19:

- L1 localizar 0–10;
- L2 localizar 0–20;
- L3 +1/+2;
- L4 −1/−2;
- L5 misto ±1/±2;
- drag produtivo + toque alternativo;
- snap generoso;
- precisão motora não é competência matemática;
- caminho permanece visível;
- erro balança sem mover;
- áudio acompanha números atravessados;
- 3/3 em duas sessões; RT L5 7s;
- reconciliar tags `CONTA_SEM_POSICAO`, `DIRECAO_INVERTIDA`, `ERRO_DE_UM`, `SO_SEQUENCIA`.

Se confirmado:

`F19 integral + runtime → teste vermelho → contract/procedure → evolução do primitive existente → stage/boundary/telemetria/a11y → registro inativo → CI → canário → Matrix observa → ledger → gates → checkpoint`.

## Thinking Lab — trilha paralela segura

Até W3 não existe sinal de que o SAGA precise ser refeito. Simulador de criança, property-based tests, QA visual/áudio, agentes e observabilidade são adições compatíveis se entrarem incrementalmente.

Proposta que mexa em grafo, learner state, evidência, runtime determinístico/offline, persistência, privacidade ou rollback precisa de **Invariant Impact Review** antes de implementação. Telemetria não reescreve grafo; LLM não é soberano em runtime; RT/idade/gamificação não concedem mastery.

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