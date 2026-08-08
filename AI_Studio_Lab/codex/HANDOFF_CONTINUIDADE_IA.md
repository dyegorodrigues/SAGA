# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. P21 concluída; P22 em execução; P22.1/GM.12 ainda aguarda rerun final.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: `codex/integrar-bloco-f0`.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, comparação/CI; não mesclar e não ativar auto-merge.
- Não tocar em `agent/creature-engine-tamagotchi` nem `codex/criar-branch-para-creature-engine-tamagotchi`.
- Não criar branch auxiliar desta linha.
- Bancada temporária deve desaparecer no lote que publica.

## Leia nesta ordem

1. `RETOMADA.md`
2. `DECISAO_P22_DIVIDAS_CURRICULARES.md`
3. `DECISAO_P21_FONTES_DE_VERDADE.md`
4. `AUDITORIA_P21_FONTES_DE_VERDADE.md` — baseline histórico anterior às correções
5. `MAPA_MESTRE_POS_P20.md`

`ROTEIRO_ATE_O_FIM.md` e `PLANO_DO_BLOCO_F0.md` são históricos.

## Fechado

- P17 — N1.10/N1.11;
- P8 — Jardim/automaticidade;
- P18 — `KindType`;
- P19 — migrador/dependências;
- P20 — save/sync por UID;
- P21.1 — registries/cobertura/proveniência;
- P21.2 — mapa autoral de primitivas.

### P21 final

- 90 nós canônicos;
- 92 fichas Markdown / 88 competências cobertas;
- lacunas explícitas: N1.09 e GM.02;
- Journey TS: 29/29 registrada administrativamente;
- Composer registrado: 24;
- Composer ativo antes da P22.1: 22;
- fallback real antes da P22.1: 41;
- primitivas: 20 executáveis, 4 renderer-sem-builder, 1 isolada, 1 ausente.

Gate P21.2 `31276118716`: success; 125 arquivos / 2.132 testes.

## P22 — decisões já auditadas

Audit P22 run `31276442048`: success.

### N1.09

É “Contagem até 20 e a partir de qualquer número”. O legado cobre apenas continuação de sequência. Precisa ficha autoral e TS completas; não reutilizar N1.13.

### GM.02

É “Tempo cotidiano”: partes do dia, ontem/hoje/amanhã, dias da semana e ordenação. O legado atual “Manhã ou Noite?” com resposta fixa não representa o cânone. Precisa ficha autoral/TS pré-leitora.

### N1.07 / JD4

N1.07 canônico exige sucessor, antecessor e ordenação. A ficha ativa cobre majoritariamente sucessor. Corrigir Jornada e pré-requisitos primeiro; JD4 só depois como automaticidade da competência-mãe.

### N4.09

Ficha pronta, sem legado, registrada e inativa. Contrato atual resolveu o antigo risco do nível 4; sonda atual verde em 390/320/900 px. Promoção autorizada em lote próprio, incluindo registro no contrato genérico de canário.

### GM.12

Ficha pronta, sem legado, registrada e inativa no início da P22. Stage, teste focal e sonda atual verdes. Promoção autorizada em lote próprio.

## P22.1 — GM.12, estado provisório

`GM.12` foi adicionado a `DEFAULT_COMPOSER_CANARY_IDS`.

Primeiro gate: run `31276688133`.

Passou:

- `GM.12.test.ts`;
- `canaryContract.test.ts`;
- proveniência: 23 ativos / 50 servidos sem placeholder / 40 fallbacks;
- sonda GM.12 em 390/320/900 px;
- `fichas:auditar`, `fichas:conferir` 9/9, `grafo:check`, TypeScript;
- suíte completa: 125 arquivos / 2.145 testes;
- build e `pr:check`.

Falhou somente em `git diff --check`, por whitespace final nos documentos de checkpoint. Não houve regressão funcional.

A bancada temporária se removeu corretamente. A promoção não é considerada fechada até o rerun completo ficar verde.

## Próxima ação

1. terminar a limpeza de whitespace documental;
2. rerodar P22.1 sem alterar o escopo funcional;
3. só com gate 100% verde, fechar GM.12;
4. seguir para P22.2 N4.09.

## Portões padrão

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada exige sonda real.

**Ausência explícita é dívida gerenciável; ausência silenciosa ou gate ignorado é falha de governança.**
