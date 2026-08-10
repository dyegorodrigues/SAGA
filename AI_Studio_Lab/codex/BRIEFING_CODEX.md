# Briefing operacional — continue daqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md`. Coverage Matrix, W1/N1.04 e **W2/N1.05 estão fechadas com CI verde real**. Próxima tarefa única: **W3/N2.01 — Dezena e unidades**.

## Leia

1. `CHECKPOINT_FABRICA_CURRICULAR_W2_N1_05_FECHADA_2026-08-10.md`
2. `RETOMADA.md`
3. `HANDOFF_CONTINUIDADE_IA.md`
4. `CHECKPOINT_FABRICA_CURRICULAR_W1_N1_04_FECHADA_2026-08-09.md`
5. `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`
6. cânone em `AI_Studio_Lab/pedagogia/`, especialmente F21 em `fichas/FICHAS_F1_COMPLETAS.md`.

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 sempre open + draft + unmerged. Main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`. Não tocar no Creature Engine, não criar branch auxiliar, não merge/rebase/ready/auto-merge. Reancorar PR/head/CI antes de qualquer edição.

## Não reabra sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05**.

## Recibo W2

Head: `3af6dc6554d4938adeca4f86bdaf9fe57f6089a9`  
CI #868 / run `31356943271`: success integral.

- 27 Composer / 24 legado / 39 fallback / 51 servidas;
- 19 divergências / 12 swaps / 44 estreias;
- blockers `Moedas`, `Regua`;
- 32/32 fichas Journey com `rt_alvo` L5;
- TypeScript verde;
- **163 arquivos / 2406 testes verdes**;
- build e `pr:check` verdes;
- sonda Sensei verde.

O checkpoint W2 documenta as regressões capturadas antes do fechamento. Não repetir a falha de declarar uma onda fechada antes de o último HEAD remoto estar verde.

## Coverage Matrix

Snapshot P21.1 permanece 26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências. Ledger:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1.

Baseline atual: **27 / 24 / 39 / 51 / 19**. A fonte muda antes; a Matrix observa; o ledger governa. Nunca mascarar uma divergência ajustando baseline sem causalidade.

## W3 — N2.01 / F21

Prioridade causal confirmada: N2.01 é legado + divergente, depende de N1.09/N1.11 já autorais e alimenta grande parte de N2/N3/AL/GM.

F21 exige uma experiência que o `tens` atual não entrega:

- 10 cubinhos soltos;
- ação real de agrupar 10;
- fusão visual em 1 barra de dezena;
- rótulo de equivalência somente depois da fusão;
- leitura de D dezenas + U unidades;
- L4 inverso: produzir material a partir do numeral;
- L5 mistura leitura/produção;
- diagnósticos causais `IGNORA_DEZENA`, `CONCATENA`, `CONTA_TUDO`, `TROCA_DU`.

`MaterialDourado.tsx` já existe e deve ser **reutilizado/evoluído**, não duplicado. Hoje é estático. O renderer `kind: tens` também é estático.

Fluxo obrigatório W3:

1. ler F21 integralmente e confrontar runtime;
2. escrever teste vermelho do contrato real;
3. construir contrato/procedimento de troca e produção;
4. compor palco autoral sobre MaterialDourado existente;
5. garantir tutorial/onboarding e diagnóstico de gesto;
6. registrar ficha/builder sem ativar enquanto incompleto;
7. promover canário somente depois da paridade autoral;
8. Matrix deve observar o delta real;
9. registrar `W3-N2.01` no ledger somente depois;
10. gates completos + checkpoint.

Não basta trocar Quadrado100 por desenho de barras. A competência é **entender a unidade composta**, e isso exige a transformação 10→1 e sua inversa.

## Contratos permanentes

- learner state decide mastery/unlock/prescrição;
- RT/velocidade não compra mastery nem XP conceitual;
- fallback não gera evidência/recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam do grafo + learner state;
- Coverage Matrix é projeção derivada;
- telemetria observa e abre investigação, não muda cânone automaticamente;
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
