# Briefing operacional — continue daqui

> **VIGENTE em 11/ago/2026.** W1–W5 estão fechadas. A reconciliação pós-W5/pré-W6 está em **validação final**. **W6 NÃO está selecionada nem autorizada para implementação.**

## Primeiro movimento de qualquer agente

1. abrir o PR #29 e confirmar **open + draft + unmerged**;
2. confirmar branch `codex/integrar-bloco-f0` e HEAD remoto;
3. ler a receita de CI do HEAD registrada no corpo do PR;
4. ler `CHECKPOINT_RECONCILIACAO_POS_W5_PRE_W6_2026-08-11.md`;
5. ler `RETOMADA.md`;
6. só depois decidir se a reconciliação está formalmente fechada.

GitHub remoto e gates executáveis vencem este briefing se houver deriva.

## Git — não negociar

- não tocar main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- não merge/rebase/ready/auto-merge;
- não criar branch auxiliar;
- não tocar Creature Engine;
- `FLUXO_GIT_SEM_BUG.md` é histórico/superado para este PR.

## Baseline curricular após W5

**30 Composer / 22 legado / 38 fallback / 52 servidas / 17 divergências / 12 swaps / 44 estreias**.

Último blocker de primitive: **`Moedas`**.

W5 = `GM.05 / F61 / Regua`, com prereqs executáveis `GM.12 + N2.02`.

## O que a reconciliação corrigiu

- Foundry deixou de declarar archive Base64 como verificado; 10/10 fontes foram localizadas individualmente; recuperação byte-a-byte ficou no Issue #1 da Foundry; Thinking continua DEFERRED.
- Mascotes: registro runtime passou a PNG-only com alfa real; JPGs `_nobg_` deixaram de entrar no build; fallback SVG governa ausência de PNG; chroma-key morto foi removido.
- §6.36: dívida Gold de onboarding agora tem gate regression-safe com baseline `N1.07,N1.09,N3.10,N4.03,N4.06`.
- N4.09: pendência textual histórica marcada como resolvida em errata; regra geral de progressão visual continua vigente.
- CI: Gates agora prova PR head explícito, como as demais jobs.
- F61: sonda passou a esperar estabilidade geométrica na transição L5, sem relaxar overflow/tolerância e sem alterar a régua.
- Sonda transversal: virou mecanismo de CI e foi paralelizada sem reduzir cobertura para evitar timeout.
- Foundry: plano futuro, Evidence Ledger, namespaces de IDs e contrato de inventário ficaram versionados sem ativar runtime.

## Evidência já comprovada antes do HEAD final

No HEAD `153634079b7af77415ebb9cfea77e0c144cb2025`, run `31494057998`:

- Gates verdes;
- **172 arquivos / 2.516 testes** verdes;
- build passa;
- Sensei verde;
- F19 verde;
- F61 verde;
- 390px × 8 sementes da sonda transversal terminou **inteira e limpa**;
- o antigo job único expirou depois, durante 320px, por timeout de 30 min — não por achado de layout.

O CI vigente divide o mesmo contrato em:

- `Sonda transversal — 390px × 8 sementes`;
- `Sonda transversal — 320/900px × 1 semente`.

A receita definitiva é a do **HEAD atual no PR #29**, não a histórica acima.

## Dívida ainda real, mas controlada

- 22 legados;
- 38 fallback;
- 17 divergências;
- `Moedas` blocker;
- cinco dívidas Gold de onboarding baselineadas;
- JS ~2,349 MB minificado / ~664,6 kB gzip;
- Foundry Issue #1 de proveniência exata;
- condição morta `.jpg` no renderer, hoje inalcançável;
- manutenção futura de Actions/jsdom.

Não “limpar” dívida curricular no meio desta reconciliação só para deixar números bonitos.

## Fechamento formal

A reconciliação está fechada quando o corpo do PR #29 registrar no mesmo HEAD:

- todos os jobs CI verdes;
- Gates com 172/2.516 ou contagem superior coerente;
- Sensei/F19/F61 verdes;
- transversal 390×8 verde;
- transversal 320/900×1 verde;
- PR ainda draft/unmerged;
- W6 ainda não selecionada.

## Depois do fechamento: selecionar W6, não adivinhar

Rodar Matrix+DAG e documentar o ranking com nove dimensões:

`profundidade/descendentes + legado/fallback + divergência + blocker + onboarding + motor/a11y + risco pedagógico + reuso de primitive + custo/evidência`.

A auditoria externa mostrou que downstream merece peso explícito — especialmente em legados F1 de grande alcance —, mas ele **não é critério soberano**. `Moedas/GM.03` também recebe peso por ser último blocker, sem hardcode.

Só depois de registrar seleção e contrafactual:

`regression-first → implementação INATIVA → gates/browser → canário → Matrix observa → ledger → checkpoint`.

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
npm run sonda:regua
npm run sonda
```

**Não avance por memória nem aparência de progresso: avance quando fonte, comportamento e recibos do mesmo HEAD concordarem.**
