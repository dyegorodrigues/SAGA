# Retomada — comece por aqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md`. Coverage Matrix, **W1/N1.04** e **W2/N1.05** estão fechadas. Próxima tarefa única: **W3/N2.01 — Dezena e unidades**, salvo se nova falha objetiva da reancoragem bloquear a fila.

## Leia primeiro

1. `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md` — fonte operacional mais nova;
2. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md` — histórico W1;
3. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md` — snapshot histórico P21.1;
4. `BRIEFING_CODEX.md` e `HANDOFF_CONTINUIDADE_IA.md`;
5. `CHECKPOINT_GAMIFICACAO_ECONOMIA_METAJOGO_FECHADA_2026-08-09.md`;
6. `VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`;
7. cânone em `AI_Studio_Lab/pedagogia/`, especialmente `BIBLIA_DO_SAGA.md` e as fichas autorais.

Checkpoints antigos continuam históricos. Em conflito, vence esta fonte vigente + GitHub remoto + gates executáveis.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 deve permanecer **open + draft + unmerged**;
- não ready, não auto-merge, não merge/rebase na main;
- não tocar no Creature Engine nesta fila;
- não criar branch auxiliar;
- GitHub remoto é a fonte da verdade;
- antes de editar: reancorar PR/head remoto/CI e resolver qualquer falha objetiva primeiro.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05**.

## Recibo funcional W2

Head funcional fechado: `3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`.

CI **#868 / run `31356943271` — success integral**:

- 90 competências / 94 fichas autorais;
- Composer 27; legado 24; fallback 39; servidas 51;
- divergências 19; swaps 12; estreias 44;
- blockers `Moedas`, `Regua`;
- Journey 32/32 com `rt_alvo` L5;
- TypeScript verde;
- **163 arquivos / 2406 testes passando**;
- build verde;
- `pr:check` verde, 254 arquivos no diff integral, nenhum binário;
- sonda real Sensei verde.

Artefato: `sonda-sensei-3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`, ID `9050977700`, SHA-256 `bbd554433de3d7e92890327692c720a291bb5f8bd2f6700c5230073641bff58f`.

O checkpoint W2 registra também os CIs vermelhos que impediram o falso fechamento: `rt_alvo`, ledger W2 ausente, enum de andaime inválido, contrato de canário ausente e harness de retry/axe. Não apagar essa história.

## Coverage Matrix — fechada e evolutiva

Snapshot P21.1 é imutável:

- Composer 26;
- legado 25;
- fallback 39;
- servidas 51;
- divergências 21;
- swaps 12;
- estreias 44;
- blockers `Moedas`, `Regua`.

Ledger vigente:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1.

Baseline atual: **27 / 24 / 39 / 51 / 19**, com 12 swaps, 44 estreias e os mesmos blockers.

Regra: fonte real muda primeiro → Matrix observa → migração nomeada governa. Nunca editar o snapshot histórico ou a expectativa apenas para ficar verde.

## Contratos permanentes

- learner state é a única autoridade para mastery/unlock/prescrição;
- Nível SAGA pertence ao perfil da criança, não ao mascote;
- XP não compra competência;
- moedas são gastáveis e compras são atômicas;
- RT/velocidade é telemetria/automaticidade, nunca autoridade conceitual ou multiplicador de XP;
- criança lenta e correta não é penalizada no XP de perfil;
- Misto dobra moedas, não XP/mastery;
- fallback não fornece evidência nem recompensa real;
- Atlas/insígnias derivam do Curriculum Graph + learner state;
- retry/double tap/reload não duplicam o mesmo evento técnico;
- Coverage Matrix é projeção derivada, não segunda ontologia;
- telemetria pode revelar defeito e abrir investigação, não reescrever automaticamente o grafo;
- Creature Engine permanece desacoplado desta fila.

## Faça agora — W3 / N2.01 / F21

A auditoria causal feita após W2 escolheu **N2.01 — Dezena e unidades** porque é legado + divergente, seus pré-requisitos `N1.09` e `N1.11` já estão autorais e ela alimenta uma parcela grande do DAG: N2, fazer 10, operações sem/com reagrupamento, saltos e o caminho que chega ao sistema monetário.

Cânone F21 exige:

- `MaterialDourado + TenFrame`;
- 10 cubinhos soltos realmente agrupados pela criança;
- fusão visual `10 unidades → 1 dezena`;
- rótulo `10 unidades = 1 dezena` somente depois da fusão;
- leitura D dezenas + U unidades;
- L4 inverso: dado um numeral, produzir barras + cubinhos;
- L5 mistura leitura/produção sem pista de qual operação vem;
- diagnósticos `IGNORA_DEZENA`, `CONCATENA`, `CONTA_TUDO`, `TROCA_DU` com evidência de ação quando necessário.

Infra existente:

- `MaterialDourado.tsx` é visual e estático;
- renderer `kind: tens` apenas desenha `dezenas/unidades`;
- isso **não** satisfaz a ação/fusão/inversão da F21.

Portanto não promover cosmicamente o `tens` atual. Fluxo obrigatório:

`regressão F21 primeiro → contrato procedimental de troca → palco autoral que reutiliza MaterialDourado → diagnóstico/telemetria → specialized builder/canário → Matrix observa → ledger W3 → gates → checkpoint`.

Se a investigação objetiva descobrir que parte dessa cadeia já existe sob outro componente, reutilizar e adaptar; não duplicar primitive.

## Fila

`Coverage Matrix → W1 fechada → W2 fechada → W3/N2.01 → próximas ondas causais → mega auditoria integrada → hardening/performance → release`.

Arte definitiva/Creature Engine/widget/jogo continuam em trilha separada.

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
