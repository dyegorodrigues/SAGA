# Handoff de continuidade — SAGA

> **VIGENTE em 11/ago/2026.** W1–W5 estão fechadas. A reconciliação pós-W5/pré-W6 está em **validação final**. **Não selecionar nem implementar W6 até o PR #29 registrar a receita verde do HEAD corrente.**

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- PR #29 **open + draft + unmerged**;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- não merge/rebase/ready/auto-merge;
- não criar branch auxiliar;
- Creature Engine fora desta fila;
- Thinking Engine continua DEFERRED;
- GitHub remoto é a fonte da verdade.

## Ordem de retomada

1. PR #29: estado, HEAD, jobs e corpo do PR;
2. `CHECKPOINT_RECONCILIACAO_POS_W5_PRE_W6_2026-08-11.md`;
3. `RETOMADA.md`;
4. `BRIEFING_CODEX.md`;
5. checkpoint W5 + retificação F61 + errata N4.09;
6. cânone pedagógico + `curriculum/grafo_saga.yaml`.

`FLUXO_GIT_SEM_BUG.md` é proveniência histórica e está marcado como superado para o protocolo cumulativo atual.

## Estado curricular

Baseline observada após W5:

- **30 Composer**;
- **22 legado**;
- **38 fallback**;
- **52 servidas**;
- **17 divergências**;
- **12 swaps**;
- **44 estreias**;
- blocker restante: **`Moedas`**.

W5 = `GM.05 / F61 / Regua`; prereqs `GM.12 + N2.02`.

## Estado da reconciliação

### Produto

- `gates` e sondas usam PR head explícito;
- `src/curriculum/visualOnboardingGate.test.ts` baselineia a dívida Gold de §6.36: `N1.07,N1.09,N3.10,N4.03,N4.06`;
- suíte comprovada: **172 arquivos / 2.516 testes**;
- N4.09 já possui onboarding real e a pendência histórica foi corrigida por errata;
- mascote runtime registry é PNG-only; JPG histórico `_nobg_` não entra mais como arte definitiva; fallback SVG é o caminho seguro;
- chroma-key/canvas morto foi removido;
- os ~5,4 MB de JPGs deixaram de ser emitidos pelo build por esse caminho;
- chunk JS continua dívida ~2,349 MB / ~664,6 kB gzip;
- F61 ganhou espera de estabilidade geométrica na sonda, sem relaxar tolerância nem alterar UI/pedagogia.

### Sonda transversal

O portão completo continua semanticamente o mesmo:

- 390px com 8 sementes;
- 320px com 1 semente;
- 900px com 1 semente.

No CI ele é paralelizado em dois jobs:

1. `Sonda transversal — 390px × 8 sementes`;
2. `Sonda transversal — 320/900px × 1 semente`.

No run `31494057998`, HEAD `153634079b7af77415ebb9cfea77e0c144cb2025`, 390×8 terminou integralmente limpa. O job único expirou somente depois, já medindo 320px, por timeout de 30 min. Sensei/F19/F61 ficaram verdes nesse mesmo HEAD.

A receita final deve ser a do HEAD corrente do PR, após a paralelização e documentação reconciliada.

### Foundry

A auditoria externa estava certa sobre a quebra de integridade do archive transport, mas exagerou a perda: **10/10 arquivos-fonte estão localizados individualmente**, inclusive os dois protótipos considerados perdidos.

A Foundry agora:

- declara archive transport como `unverified`;
- possui manifesto/verificador dedicado aos originais;
- possui workflow de integridade;
- preserva plano futuro em `DEFERRED_IMPLEMENTATION_PLAN.md` sem autorizar runtime;
- possui Evidence Ledger melhorado;
- separa namespaces de IDs e universos de inventário;
- mantém recuperação byte-a-byte no Issue #1.

Não copiar protótipos `.ts` recuperados para `src/` do SAGA.

## Dívida controlada, não apagar do radar

- 22 legados;
- 38 fallbacks;
- 17 divergências;
- `Moedas` blocker;
- cinco dívidas Gold de onboarding baselineadas;
- bundle JS grande;
- Foundry Issue #1;
- condição morta `.jpg` em `MascotRenderer.tsx`, hoje inalcançável;
- warnings de runtime das GitHub Actions;
- ruído `canvas.getContext()` do harness axe/jsdom, sem falha funcional conhecida.

## Fechamento da reconciliação

O corpo do PR #29 é o recibo final. Ele precisa registrar, no **mesmo HEAD**:

- PR open + draft + unmerged;
- Gates verdes;
- 172 arquivos / 2.516 testes ou contagem superior coerente;
- Sensei/F19/F61 verdes;
- transversal 390×8 verde;
- transversal 320/900×1 verde;
- W6 ainda não selecionada.

Quando isso ocorrer, considerar `CHECKPOINT_RECONCILIACAO_POS_W5_PRE_W6_2026-08-11.md` **FECHADO operacionalmente** pela condição que ele próprio define.

## Próxima tarefa após o fechamento

**Selecionar W6**, ainda sem implementar.

Gerar Matrix+DAG atual e documentar ranking/contrafactual usando:

`profundidade/descendentes + legado/fallback + divergência + blocker + onboarding + motor/a11y + risco pedagógico + reuso de primitive + custo/evidência`.

Downstream deve estar explícito, mas não domina sozinho. `Moedas/GM.03` merece peso pelo último blocker, sem seleção hardcoded.

Depois de registrar a decisão:

`regressão → implementação inativa → gates → browser → canário → Matrix observa → ledger → checkpoint`.

## Gates permanentes

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

**Nenhum agente deve “continuar a fábrica” a partir deste arquivo sem reancorar o PR #29 primeiro.**
