# Handoff de continuidade — SAGA

> **VIGENTE — 10/ago/2026.** Leia primeiro `CHECKPOINT_AUDITORIA_FINAL_PRE_W5_2026-08-10.md`, depois `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`. Coverage Matrix e W1–W4 estão funcionalmente fechadas. **W5 ainda não começou.** A próxima tarefa única é reconciliar as cinco derivas documentais A–E da auditoria final; só depois selecionar W5 pela Coverage Matrix/DAG atual.

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

1. `CHECKPOINT_AUDITORIA_FINAL_PRE_W5_2026-08-10.md`;
2. `CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
3. `RETOMADA.md`;
4. `BRIEFING_CODEX.md`;
5. checkpoints W3/W2/W1 + Coverage Matrix;
6. cânone em `AI_Studio_Lab/pedagogia/`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01; W4/N1.12**.

## Recibo funcional W4

Head funcional: `841a4a3691662829b9d1432ff070191522fd9a6e`.

CI **#975 / run `31404572801` — success integral**:

- 90 competências / 94 fichas;
- **29 Composer / 22 legado / 39 fallback / 51 servidas**;
- **17 divergências / 12 swaps / 44 estreias**;
- blockers `Moedas`, `Regua`;
- **169 arquivos de teste / 2480 testes**;
- build + `pr:check` + higiene + binários verdes;
- sonda Sensei/Matrícula verde;
- sonda F19 Chrome real verde 320/390/900 px, L1–L5, tap + drag;
- F19 artifact ID `9069082798`, SHA-256 `65a1d3ab456f4320709547dcc98f87958f8ed083fb978b8a80322059e03629f3`;
- Sensei artifact ID `9069071435`, SHA-256 `d8b4060ee5bc98feb64a0bc56f7d4b7c0fc5c8ca85f8416730657a83976cf38b`.

Handoff documental anterior: `e3e3cfdf57c6a4371d6c8bac993411efba2fdd33`, CI #979 / run `31405504346` — success integral. A auditoria final feita depois dele encontrou deriva textual, não falha funcional.

## Coverage Matrix

Snapshot histórico P21.1 é imutável:

`26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias`.

Migrações:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1;
- `W4-N1.12`: Composer +1, legado −1, divergências −1.

Baseline vigente:

`29 Composer / 22 legado / 39 fallback / 51 servidas / 17 divergências / 12 swaps / 44 estreias`.

Blockers continuam `Moedas` e `Regua`.

## W4/F19 — arquitetura e progressão preservadas

Fluxo real:

`F19 → reta20Contract/procedure → specialized builder → numberline-f19 → Reta20Stage → InteractiveNumberLineSurface → gesto/geom. motor → AnswerMeta → GameLoop/Radar → canário → Matrix → Chrome real`.

Progressão canônica materializada:

- L1 localizar 0–10;
- L2 saltar para frente em 0–10, magnitude 1–3;
- L3 saltar para trás em 0–10, magnitude 1–3;
- L4 localizar 0–20 com numerais parciais;
- L5 saltos variáveis bidirecionais em 0–20, magnitude 1–4.

Invariantes:

- a primitive é compartilhada, não duplicada;
- F19 é responsiva e não passa por `PalcoEscalado`;
- pointer físico é resolvido pela superfície + snap;
- botões de tick ficam como camada semântica/teclado;
- out-of-bounds não vira acerto por clamp;
- imprecisão motora não vira misconception;
- drag e tap são distintos por limiar;
- cancelamento de pointer não publica matemática;
- L2 usa arcos; L3+ retira;
- tap de salto anima e bipa casa a casa; GameLoop recebe só ao final;
- drag bipa ticks atravessados e publica na soltura;
- fala TTS de chegada é única para não se autocancelar;
- `CONTA_MARCAS` é por tentativa;
- Chrome probe é gate permanente para geometria.

A sonda real encontrou e bloqueou reta colapsada, hitboxes sobrepostos e colisões de rótulos que jsdom não enxergava. Portanto, para primitive infantil responsiva/motora: **unit/jsdom + navegador real**.

No phone todas as marcas 0–20 permanecem presentes. Só rótulos 11/13/15/17/19 são ocultados visualmente para não colidir; em largura maior o L5 rotula 0–20.

## Única pendência pré-W5 — reconciliação textual canônica

O checkpoint `CHECKPOINT_AUDITORIA_FINAL_PRE_W5_2026-08-10.md` é obrigatório porque encontrou cinco derivas que não podem ser esquecidas:

A. `GRAFO_DE_CONHECIMENTO_SAGA.md`: N1.12 ainda marca `numberline*` como inexistente/prioridade 1 e descreve micros antigos. Alinhar à F19 sem alterar ID/prereqs/topologia.

B. `BIBLIA_DO_SAGA.md §9.2`: `numberline`/`vertical` ainda aparecem como backlog oficial. Reclassificar esse backlog como histórico e fazer status atual vir da Coverage Matrix/auditoria.

C. `BIBLIA_DO_SAGA.md §12.6`: CI #812 fica histórico; a Matrix já existe e seu ledger W1–W4 é a fonte operacional atual.

D. `FICHAS_F0_COMPLETAS.md`: nota de GM.02 sem ficha ficou obsoleta; apontar para `FICHA_P22_GM_02_TEMPO_COTIDIANO.md` e cobertura 90/90.

E. checkpoint W4: corrigir “L2 saltos positivos de 2” para magnitude 1–3.

Essa microfrente é **documental apenas**. Não mudar o runtime F19 para imitar texto antigo. Usar patch textual seguro; na Bíblia, sincronizar versão do cabeçalho e changelog conforme a regra interna do próprio arquivo. Rodar gates completos e confirmar Matrix **29/22/39/51/17** sem delta funcional.

## Próxima onda W5 — só depois

Depois que A–E estiverem reconciliadas, consultar a Matrix viva e escolher W5 por DAG/descendentes, legado/fallback, divergência, blocker de primitive, onboarding, risco motor/a11y, risco pedagógico e custo.

Fluxo obrigatório:

`Matrix → ficha integral + runtime integral → regressão → contract/procedure → stage/boundary/telemetria/a11y → registro inativo → CI/sonda → canário → Matrix observa → ledger → checkpoint`.

Blockers fortes já conhecidos: `Moedas`/GM.03 e `Regua`/GM.05, mas a ordem final é causal.

## Dívida objetiva atual

- 22 legados;
- 39 fallback;
- 17 divergências;
- `Moedas`: renderer-sem-builder;
- `Regua`: ausente;
- `Quadrado100`: componente-isolado;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer-sem-builder;
- bundle >500 kB e warnings jsdom canvas são hardening, não regressão W4.

Lista completa no checkpoint W4.

## Thinking Lab — trilha paralela segura

Até W4 não existe evidência de necessidade de reconstrução total do SAGA. Simulador de learner, property-based tests, QA visual/áudio, agentes e observabilidade são adições compatíveis se entrarem incrementalmente.

Proposta que mexa em grafo, learner state, evidência, runtime determinístico/offline, persistência, privacidade ou rollback precisa de **Invariant Impact Review**. Telemetria não reescreve grafo; LLM não é soberano em runtime; RT/idade/gamificação não concedem mastery.

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

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**