# Retomada — comece por aqui

> **VIGENTE em 10/ago/2026.** Fonte principal: `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`. Coverage Matrix, W1/N1.04, W2/N1.05 e **W3/N2.01** estão fechadas com recibo remoto real. Próxima tarefa única: **W4**, escolhida pela Matrix/DAG; a auditoria preliminar favorece N1.12/F19, mas só a análise causal completa pode promovê-la à onda.

## Leia primeiro

1. `CHECKPOINT_FABRICA_CURRICULAR_W3_N2_01_FECHADA_2026-08-10.md`;
2. `BRIEFING_CODEX.md` e `HANDOFF_CONTINUIDADE_IA.md`;
3. checkpoints W2, W1 e `CHECKPOINT_COVERAGE_MATRIX_FECHADA_2026-08-09.md`;
4. cânone em `AI_Studio_Lab/pedagogia/`, especialmente `BIBLIA_DO_SAGA.md` e as fichas autorais.

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
- antes de editar: reancorar PR/head/CI e resolver qualquer falha objetiva primeiro.

## Fechado — não reabrir sem falha objetiva

P17–P22/cânone; Radar/source/persist/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto; Matrícula; Cloud Reconciliation; Simulação Longitudinal; Gamificação/Economia/Meta-jogo; **Coverage Matrix; W1/N1.04; W2/N1.05; W3/N2.01**.

## Recibo funcional W3

Head funcional: `929dc5b234a842116b31b998850ceacabe2248dd`.

CI **#916 / run `31386605676` — success integral**:

- 90 competências / 94 fichas autorais;
- Composer 28; legado 23; fallback 39; servidas 51;
- divergências 18; swaps 12; estreias 44;
- blockers `Moedas`, `Regua`;
- TypeScript verde;
- **166 arquivos / 2443 testes passando**;
- build e `pr:check` verdes;
- sonda real Sensei verde em phone + tablet.

Artefato: `sonda-sensei-929dc5b234a842116b31b998850ceacabe2248dd`, ID `9061964350`, SHA-256 `cb0bd490ab0b6576043bab8869d8c55e9786513767f102c0e5a9b7a38e5b1fcb`.

A W3 só foi promovida depois do estado inativo #912 ficar integralmente verde. O checkpoint W3 registra a meia-migração inicialmente encontrada, os gates vermelhos e a correção canônica completa.

## Coverage Matrix — snapshot + ledger

Snapshot P21.1 é imutável: **26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias**, blockers `Moedas`, `Regua`.

Ledger:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1.

Baseline vigente: **28 / 23 / 39 / 51 / 18**, com 12 swaps, 44 estreias e os mesmos blockers.

Regra: fonte real muda primeiro → Matrix observa → migração nomeada governa. Nunca reescrever snapshot ou expectativa só para ficar verde.

## W3/F21 — o que ficou fechado

N2.01 ensina dezena como **unidade composta**:

- L1/L2 agrupamento manual com TenFrame;
- L3 agrupamento manual sem moldura;
- L4 numeral → montar MaterialDourado;
- L5 decomposição mental D/U;
- domínio 3/3 em duas sessões + evidência `montou-do-numeral` no L4;
- diagnósticos canônicos `IGNORA_VALOR`, `INVERTE_ORDENS`, `NAO_AGRUPA`;
- aliases provisórios antigos ficaram deprecated apenas para compatibilidade longitudinal de telemetria.

Não reabrir sem falha objetiva.

## Faça agora — W4

Primeiro gere/inspecione a Coverage Matrix vigente e compare candidatos por:

1. profundidade causal no DAG;
2. número/criticidade de descendentes;
3. legado/fallback;
4. divergência ficha↔screen;
5. blocker de primitive;
6. onboarding/risco motor/a11y;
7. custo de implementação e risco pedagógico.

### Candidato preliminar: N1.12 / F19

A leitura já feita aponta forte prioridade:

- legado + divergente;
- pré-requisitos `N1.07` e `N1.09` já autorais;
- YAML marca `Prioridade 1 (kind novo)`;
- legado `gN1_12` ensina antes/depois/entre, números muito maiores e ±10 — não a progressão F19;
- `InteractiveNumberLine.tsx` já existe e deve ser evoluído/reutilizado, não duplicado.

F19 canônica:

- L1 localizar 0–10;
- L2 localizar 0–20;
- L3 saltos +1/+2;
- L4 saltos −1/−2;
- L5 misto +1/+2/−1/−2;
- gesto produtivo na reta com snap generoso;
- toque alternativo ao drag;
- imprecisão motora não pode virar erro matemático;
- percurso fica visível;
- erro balança sem deslocar o personagem;
- áudio acompanha movimento real;
- domínio 3/3 em duas sessões; RT L5 7s;
- reconciliar tags `CONTA_SEM_POSICAO`, `DIRECAO_INVERTIDA`, `ERRO_DE_UM`, `SO_SEQUENCIA` no catálogo.

Se a Matrix confirmar N1.12 como W4, fluxo:

`F19 inteira → runtime inteiro → teste vermelho → contract/procedure → evolução do InteractiveNumberLine → stage/boundary/telemetria/a11y → registro inativo → CI → canário → Matrix observa → ledger W4 → gates → checkpoint`.

## Thinking Lab — regra de impacto

Pesquisa externa/Thinking Lab pode propor arquitetura, simuladores, property-based tests, QA visual/áudio, agentes e observabilidade. Isso **não** muda o cânone automaticamente.

Qualquer proposta que altere grafo, learner state, evidência, runtime determinístico/offline, persistência, privacidade ou rollback passa primeiro por uma **Invariant Impact Review**. Até W3 não há sinal de reconstrução total: as direções úteis são incrementais; propostas incompatíveis ficam em quarentena até prova.

## Contratos permanentes

- learner state decide mastery/unlock/prescrição;
- RT/velocidade não compra mastery nem XP;
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

**Uma competência só está pronta quando código, telemetria, persistência, ficha canônica e experiência real da criança concordam.**