# Briefing operacional — continue daqui

> **VIGENTE em 8/ago/2026 após P17 + P8 + P19.**
>
> Leia primeiro [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md). Depois leia `DECISAO_P17_N110.md`, `DECISAO_P8_JARDIM.md` e `DECISAO_P19_ESTADO_E_DEPENDENCIAS.md`.

## 0. Estado que não deve ser redescoberto

- Repo: `dyegorodrigues/SAGA`.
- Trabalho: **`codex/integrar-bloco-f0`**.
- `main`: `68fad4c575e28959b2ca4776e9a541d6828b63f3` — **não tocar**.
- Cumulativa: última comparação **266 commits à frente / 0 atrás**.
- PR #29: open + draft, base `main`, só comparação/CI, nunca auto-merge.
- Creature Engine: fora deste fluxo.
- Não criar branches auxiliares.

## 1. P17 — fechada

- `N1.10`: JD5 → retirada real de moldura → NumberBond; `SEM_MOLDURA` gate antes de L5.
- `N1.11`: JD3 → F28 NumberBond → `n + □ = 10`.
- N1.10/N1.11 ativos e revalidados em CI normal separada.
- `MasteryRule` executa `acertos/de/sessoes` da ficha.

## 2. P8 — fechada

Jardim real:

- JD1 → N1.03
- JD2 → N1.08
- JD3 → N1.11
- JD5 → N1.10

Regras:

- JD fora do DAG;
- unlock pela mãe já ter conquistado nível 3 ou domínio;
- estado em `dojoTracks`, nunca `progress[JD*]`;
- GameLoop Garden não chama `applyJourneyAnswer`;
- round atual 8 itens;
- 2 rounds ≥80% precisão **e** ≥80% fluência → avança;
- 2 rounds <60% → recua treino sem retirar conquista;
- lentidão não é misconception;
- primeira resposta cognitiva mede automaticidade;
- erros reais vão para Radar da mãe;
- sem level picker no Garden.

QA permanente passou 320/390/900; o shell visual atual não é arte premium final.

## 3. P19 — fechada

### Migrador

`src/utils/migrator.ts` é agora a **única** fonte de migração; App importa `migrate/defaultState/localDay`.

Commit funcional: `86ecea6b932ee174f81f9b2914d3ffade9088798`.

Testes cobrem save v1, `dojoTracks`, wallet/estrelas, coroa legada, pet, defaults, não-mutação e proibição de migrador duplicado no App.

### Dependências

Relatório: `AUDITORIA_P19_DEPENDENCIAS.md`.

Lockfile remediado sem alterar ranges do `package.json`:

- js-yaml 5.2.3
- nanoid 3.3.18
- postcss 8.5.26
- body-parser 1.20.6

Commit: `bd17e42d55eae3bbff1afd08f137ea001f76b91e`.

Após reinstalação limpa:

- audit completo = **0**;
- audit produção = **0**;
- TS/suíte/build/auditorias = verdes.

Decisão: `DECISAO_P19_ESTADO_E_DEPENDENCIAS.md`.

## 4. Canários ativos/revalidados desta retomada

`AL.01`, `N1.06`, `N1.13`, `GE.01`, `GE.02`, `GM.01`, `N1.10`, `N1.11`.

Única lista declarativa: `src/curriculum/motores/composerCanaryIds.ts`.

Promoção futura = **um id por commit**.

## 5. GM.12 continua desligada

F50/GM.12 está implementada e visualmente revisada, mas em observação.

**Não promover por momentum.**

## 6. Próxima frente — P20 / sync local × nuvem

### Começar audit-only

App importa `loadStateFromCloud`, `reconcileStateByRevision` e `saveStateToCloud` de `./services/storageSync`, mas o conector não localizou diretamente esse path enquanto TS/build continuam verdes.

Não concluir nada por 404 do conector. Primeiro inventariar o checkout real.

Responder:

1. qual arquivo real resolve o import;
2. consumidores e rotas de load/save/reconcile;
3. precedência por `revision` e regra de empate;
4. se todos os campos do State viajam juntos;
5. migração antes/depois da reconciliação;
6. offline/reconexão;
7. service worker / `SAVE_REQUEST`;
8. risco de payload stale/equal revision apagar campo novo;
9. testes existentes/ausentes.

Só depois decidir patch.

## 7. Portões

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

## 8. Não fazer

- não tocar `main`;
- não tocar Creature Engine;
- não reabrir P17/P8/P19 sem falha objetiva;
- não criar currículo paralelo nem `progress[JD*]`;
- não promover GM.12 no embalo;
- não alterar sync antes da auditoria P20;
- não usar `npm audit fix` cegamente;
- não tratar sonda como arte final;
- não deixar workflow/script temporário órfão.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
