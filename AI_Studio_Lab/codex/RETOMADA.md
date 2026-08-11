# Retomada — comece por aqui

> **VIGENTE em 11/ago/2026.** W1–W5 estão fechadas. Está em **validação final a reconciliação pós-W5/pré-W6**. **W6 NÃO está selecionada.** Antes de qualquer seleção/edição curricular, leia o checkpoint desta reconciliação e confirme no corpo do PR #29 a receita verde do HEAD remoto corrente.

## Ordem de leitura

1. `CHECKPOINT_RECONCILIACAO_POS_W5_PRE_W6_2026-08-11.md`;
2. corpo atual do PR #29 — estado/HEAD/CI e receita final;
3. `CHECKPOINT_FABRICA_CURRICULAR_W5_GM_05_FECHADA_2026-08-10.md`;
4. `AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`;
5. `ERRATA_PADRAO_OURO_N4_09_2026-08-11.md`;
6. `BRIEFING_CODEX.md` + `HANDOFF_CONTINUIDADE_IA.md`;
7. cânone em `AI_Studio_Lab/pedagogia/` + `curriculum/grafo_saga.yaml`.

GitHub remoto + código + gates executáveis vencem memória de conversa e texto histórico conflitante.

## Git — regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 **open + draft + unmerged**;
- não ready, auto-merge, merge ou rebase na main;
- não criar branch auxiliar;
- não tocar Creature Engine nesta fila;
- reancorar PR/head/CI antes de editar.

`FLUXO_GIT_SEM_BUG.md` é histórico e está explicitamente marcado como **SUPERADO para o PR #29**.

## Estado curricular preservado após W5

Snapshot histórico P21.1 continua imutável:

`26 Composer / 25 legado / 39 fallback / 51 servidas / 21 divergências / 12 swaps / 44 estreias`.

Baseline viva observada após W5:

- **30 Composer**;
- **22 legado**;
- **38 fallback**;
- **52 servidas**;
- **17 divergências ficha↔screen**;
- **12 swaps**;
- **44 estreias**;
- única primitive bloqueadora: **`Moedas`**.

W5/GM.05 alterou Composer/fallback/servidas. Não inventar `toolIntroductions +1`: `Regua` já era contabilizada como estreia visual quando nasceu inativa.

## W5 / F61 — não reabrir sem evidência objetiva

Pré-requisitos executáveis: `GM.12 + N2.02`. N2.04 não é prereq da F61 vigente.

Progressão:

- L1: bolas iguais tangentes como unidade informal;
- L2: régua alinhada + leitura em centímetros inteiros;
- L3: alinhar zero + medir;
- L4: medir/comparar dois objetos distintos;
- L5: estimar inteiro → alinhar → medir → unidade.

Invariantes visuais permanecem os da retificação F61: objeto procedural plausível, sem emoji/sprite definindo comprimento, extremos visíveis contra ticks reais, somente centímetros inteiros, L1 sem gaps, tap + drag, filtro motor e `ALINHOU_ZERO` apenas por ação da criança.

Durante a reconciliação a sonda F61 revelou uma corrida de medição na transição L5. O **instrumento** passou a aguardar estabilidade geométrica sem relaxar tolerância nem alterar a régua. Sensei/F19/F61 voltaram a ficar verdes no HEAD comprovado `153634079b7af77415ebb9cfea77e0c144cb2025`, run `31494057998`.

## Reconciliação pós-W5 / pré-W6

### Foundry / originais

A auditoria externa encontrou corrupção do transporte Base64. A afirmação anterior `originals_archive_verified: true` foi retirada. Os **10/10 arquivos-fonte foram localizados individualmente**, inclusive os dois protótipos considerados perdidos pela auditoria; portanto não há perda intelectual irreversível conhecida.

A recuperação byte-a-byte exata permanece no **Issue #1 da `SAGA-Research-Foundry`**. Thinking permanece `DEFERRED`; protótipos recuperados não são código produtivo.

### Mascotes

- runtime registry agora aceita apenas `src/assets/mascotes/*.png` com alfa real;
- JPG `_nobg_` não é considerado asset definitivo;
- enquanto PNG válido não existir, usar fallback SVG;
- chroma-key/canvas morto `TransparentMascotImage` foi removido;
- ~5,4 MB de JPGs históricos deixaram de ser emitidos pelo build por esse caminho;
- condição morta `.jpg` em `MascotRenderer.tsx` fica como limpeza P2, hoje inalcançável.

### Progressão visual §6.36

Gate regression-safe ativo em `src/curriculum/visualOnboardingGate.test.ts`.

Baseline Gold explícita:

`N1.07, N1.09, N3.10, N4.03, N4.06`.

Nova dívida falha; dívida resolvida deve sair da baseline. A suíte comprovada passou a **172 arquivos / 2.516 testes**.

N4.09 já foi corrigida pedagogicamente; a errata separa a regra geral vigente da pendência histórica já resolvida.

### CI do mesmo HEAD

Todos os jobs de PR fazem checkout explícito do `${{ github.event.pull_request.head.sha }}` onde aplicável. Não misturar merge-ref sintético com head real em uma mesma receita.

## Portão transversal de layout

`npm run sonda` continua sendo o contrato transversal completo do script. Para caber de forma determinística no GitHub Actions sem reduzir cobertura, o CI o executa em paralelo:

- **Sonda transversal — 390px × 8 sementes**;
- **Sonda transversal — 320/900px × 1 semente**.

Esses dois jobs juntos equivalem ao contrato original: largura canônica com 8 sementes + larguras responsivas com 1 semente.

Evidência anterior à paralelização, run `31494057998`:

- 390px × 8 sementes terminou integralmente sem achado;
- o job seguiu em 320px com resultados `ok` e foi cancelado exatamente pelo timeout de 30 min;
- portanto aquele vermelho foi timeout do mecanismo, não layout.

Sondas dirigidas continuam obrigatórias:

```bash
npm run sonda:sensei-dojo
npm run sonda:reta20
npm run sonda:regua
```

## Gates de fechamento

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
npm run sonda
```

No CI, `npm run sonda` é distribuído entre os dois jobs transversais acima; localmente o comando sem variáveis continua executando o contrato completo sequencial.

## Dívida viva e explicitamente controlada

- 22 legados;
- 38 fallback;
- 17 divergências;
- `Moedas`: último blocker;
- cinco dívidas Gold de onboarding baselineadas;
- chunk JS ~2,349 MB minificado / ~664,6 kB gzip;
- Foundry archive transport exato no Issue #1;
- condição `.jpg` morta no renderer;
- manutenção futura das Actions/runtime e ruído `canvas.getContext()` do harness axe/jsdom.

Esses itens não somem do workflow, mas não devem ser confundidos com falha da reconciliação quando estão mecanizados/quarentenados.

## Próxima ação permitida

**Não implementar W6 ainda.** Primeiro o PR #29 deve registrar a receita verde do HEAD final desta reconciliação. Depois:

1. gerar Coverage Matrix viva + DAG;
2. recalcular seleção por **profundidade/descendentes + legado/fallback + divergência + blocker + onboarding + motor/a11y + risco pedagógico + reuso de primitive + custo/evidência**;
3. tornar `downstream` explícito na justificativa, sem fazê-lo soberano;
4. registrar a escolha W6 e seu contrafactual;
5. só então iniciar regression-first da competência escolhida.

## Invariantes permanentes

- learner state decide mastery/unlock/prescrição;
- nível curricular pertence à criança/perfil;
- XP lifetime não gastável; moeda spendable atômica;
- RT/velocidade não compram mastery nem XP;
- fallback sem evidência/recompensa real;
- Misto dobra moedas, não XP/mastery;
- Atlas/insígnias derivam graph + learner state;
- retry/replay idempotentes;
- Coverage Matrix é projeção derivada;
- telemetria observa e não reescreve o grafo automaticamente;
- LLM não é soberano em runtime;
- Thinking invasivo exige Invariant Impact Review e autorização explícita;
- Creature Engine permanece fora desta fila.

**Uma competência só está pronta quando fonte, comportamento real, experiência da criança, Matrix e CI do mesmo HEAD concordam.**
