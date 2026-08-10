# Handoff de continuidade — SAGA

> **VIGENTE — 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md`. Coverage Matrix, **W1/N1.04** e **W2/N1.05** estão fechadas com recibo remoto verde. Próxima tarefa única: **W3/N2.01 — Dezena e unidades**.

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

1. `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md`;
2. `RETOMADA.md`;
3. `BRIEFING_CODEX.md`;
4. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`;
5. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`;
6. cânone em `AI_Studio_Lab/pedagogia/`, especialmente F21 em `fichas/FICHAS_F1_COMPLETAS.md`.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05**.

## Recibo funcional verificável da W2

Head funcional: `3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`.

CI **#868 / run `31356943271` — success integral**:

- 90 competências / 94 fichas autorais;
- Composer 27; legado 24; fallback 39; servidas 51;
- divergências 19; swaps 12; estreias 44;
- blockers `Moedas`, `Regua`;
- Journey fichas 32/32 com `rt_alvo` positivo no nível 5;
- TypeScript verde;
- **163 arquivos / 2406 testes passando**;
- build e `pr:check` verdes;
- sonda real Sensei verde.

Artefato: `sonda-sensei-3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`, ID `9050977700`, SHA-256 `bbd554433de3d7e92890327692c720a291bb5f8bd2f6700c5230073641bff58f`.

O checkpoint W2 registra os CIs vermelhos que impediram o fechamento prematuro; não apagar nem substituir essa cronologia.

## Coverage Matrix — snapshot + ledger

Snapshot histórico P21.1 é imutável:

- Composer 26;
- legado 25;
- fallback 39;
- servidas 51;
- divergências 21;
- swaps 12;
- estreias 44;
- blockers `Moedas`, `Regua`.

Migrações:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1.

Baseline vigente: **27 Composer / 24 legado / 39 fallback / 51 servidas / 19 divergências**, 12 swaps, 44 estreias, mesmos blockers.

Regra permanente: a fonte real muda primeiro; a Matrix observa; só então entra migração nomeada. Nunca editar expectativa para esconder uma divergência.

## W3 — N2.01 / F21

A prioridade foi escolhida por causalidade, não por série:

- N2.01 é legado + divergente;
- depende de N1.09 e N1.11, já autorais/ativos;
- instala a dezena como unidade composta;
- alimenta grande parte do DAG N2/N3/AL/GM, incluindo o caminho até reagrupamento e sistema monetário.

A F21 exige `MaterialDourado + TenFrame` e uma experiência manipulativa real:

- 10 cubinhos soltos;
- criança agrupa os 10;
- fusão visual `10 unidades → 1 dezena`;
- rótulo `10 unidades = 1 dezena` somente depois da fusão;
- leitura D dezenas + U unidades;
- L4 inverso: numeral → produzir barras + cubinhos;
- L5 mistura leitura/produção sem pista de qual operação vem;
- diagnósticos causais `IGNORA_DEZENA`, `CONCATENA`, `CONTA_TUDO`, `TROCA_DU`.

Infra atual:

- `MaterialDourado.tsx` existe e deve ser reutilizado;
- hoje é somente visual/estático;
- renderer `kind: tens` apenas desenha dezenas/unidades;
- o legado atual de N2.01 entrega `Quadrado100` e não satisfaz a transformação 10→1.

Fluxo obrigatório:

`F21 integral + runtime → teste vermelho → procedimento/contrato de troca → palco autoral reutilizando MaterialDourado → diagnóstico/telemetria → registro sem ativação → canário só após cadeia completa → Matrix observa → W3 entra no ledger → gates → checkpoint`.

Não promover apenas trocando o desenho. A competência é compreender e usar a **unidade composta**.

## Contratos permanentes

- learner state é soberano para mastery/unlock/prescrição;
- Nível SAGA é do perfil da criança;
- XP não compra aprendizagem;
- RT/velocidade é telemetria/automaticidade, nunca autoridade conceitual;
- fallback não gera evidência nem recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam do Curriculum Graph + learner state;
- Coverage Matrix é projeção derivada, não segunda ontologia;
- telemetria pode abrir investigação, não reescrever automaticamente grafo/cânone;
- Creature Engine permanece fora desta fila.

## Fila

`Coverage Matrix → W1 fechada → W2 fechada → W3/N2.01 → próximas ondas causais → mega auditoria integrada → hardening/performance → release`.

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
