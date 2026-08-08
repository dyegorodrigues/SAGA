# Handoff de continuidade — SAGA / branch cumulativa

> **VIGENTE — 8/ago/2026, após P17 + P8 + P19.**
>
> Este é o ponto de entrada operacional de qualquer nova sessão. Leia este arquivo, `BRIEFING_CODEX.md`, as decisões P17/P8/P19 e a PR #29 antes de editar. O repositório é a fonte de verdade.

## 1. Regra de ouro / Git

- Repo: `dyegorodrigues/SAGA`.
- Linha única de trabalho: **`codex/integrar-bloco-f0`**.
- `main` protegida e imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- Comparação mais recente: cumulativa **266 commits à frente / 0 atrás** da `main`.
- PR #29: **open + draft**, base `main`, só comparação/CI; nunca mesclar nem ativar auto-merge.
- Não tocar nas branches independentes do Creature Engine:
  - `agent/creature-engine-tamagotchi`
  - `codex/criar-branch-para-creature-engine-tamagotchi`
- Não criar branches auxiliares para esta linha.
- Workflows/scripts temporários devem se apagar no commit que publicam.

## 2. P17 — RESOLVIDA

Documento: `DECISAO_P17_N110.md`.

### N1.10

`JD5 perceptual → retirada real da moldura → NumberBond`

- L4 alterna apoio com moldura e objetos realmente soltos;
- `SEM_MOLDURA` é gate antes de L5;
- `TOTAL_ALEM_DE_CINCO` é evidência independente de domínio;
- revalidação com gate real: `37595c73795b45c9e16075749bae51690c5d77ac` — CI normal verde.

### N1.11

`JD3 perceptual → F28 NumberBond → n + □ = 10`

- revalidada sobre N1.10 ativa: `ab5b3b613a3226076b1d967a48cc99ba6c8b50c9` — CI normal verde;
- microtexto “mais quanto dá dez?” corrigido em `e285429745da01478f95269bf683b5a4e6cd675a`.

### Invariantes

- representações da mesma competência não viram nós paralelos;
- Jornada faz a ponte conceitual;
- Jardim preserva automaticidade perceptual;
- `MasteryRule` executa `acertos/de/sessoes` da ficha;
- `rt_alvo` é telemetria/fluência, não reprovação conceitual da Jornada.

## 3. P8 — JARDIM DO DOJO RESOLVIDA

Documento: `DECISAO_P8_JARDIM.md`.

Catálogo implementado:

- JD1 → N1.03
- JD2 → N1.08
- JD3 → N1.11
- JD5 → N1.10

JD4 continua dívida separada.

### Arquitetura

- JD não entra no DAG;
- desbloqueio deriva da competência-mãe já ter conquistado nível 3 (`maxLvl >= 3`) ou domínio;
- estado de automaticidade vive em `state.dojoTracks[kidId][JD*]`;
- **nunca** criar `state.progress[kidId][JD*]`;
- GameLoop em `progressionMode="garden"` compartilha UI/voz/retry, mas não chama `applyJourneyAnswer`;
- round atual: 8 itens (contrato 6–10);
- 2 rounds ≥80% precisão **e** ≥80% fluência → avança;
- 2 rounds <60% → recua `currentStep`, sem retirar `highestStep`;
- acerto lento preserva compreensão e não vira `misconception`;
- primeira resposta cognitiva mede automaticidade;
- erro conceitual real alimenta Radar da mãe.

Motor puro: `5b22e6d4594db68c3f86414dccd18c40faf49619`.

### Cânone/UI/QA

- `DOJO_SAGA.md` v1.5 reconciliou JD5 com N1.10/parte-todo: `3ec25a4007c0e79b89bafcb7887bf270000ca545`;
- `DojoTab` consome `JARDIM` diretamente, sem level picker e sem estrelas como chave de unlock;
- teste permanente cobre unlock, stats, currentStep/highestStep e ausência do Garden CRA;
- primeira sonda reprovou contraste; componente foi corrigido, não o fiscal;
- sonda final passou 320/390/900;
- PNGs 320 inspecionados manualmente;
- QA visual permanente: `21ab21e6c4d7465f66a37136dc15b68970c1f795`;
- caminho CRA morto removido: `37a03a8bbf9d33221b8a3c75c7f8b847fdffbf97`.

A UI funcional/pedagógica está validada; **não é declaração de arte premium final**.

## 4. P19 — ESTADO E DEPENDÊNCIAS RESOLVIDA

Documento: `DECISAO_P19_ESTADO_E_DEPENDENCIAS.md`.
Relatório npm: `AUDITORIA_P19_DEPENDENCIAS.md`.

### 4.1 Migrador único

O projeto tinha dois migradores divergentes:

- `App.tsx` continha o migrador realmente usado;
- `src/utils/migrator.ts` existia, mas não era consumidor ativo e era semanticamente incompleto.

Agora existe **uma única fonte de migração** em `src/utils/migrator.ts`; o App importa `migrate`, `defaultState` e `localDay`.

Commit funcional:

`86ecea6b932ee174f81f9b2914d3ffade9088798`

Testes permanentes provam:

- save v1 antigo;
- `dojoTracks` presente/ausente;
- wallet antigo e derivação por estrelas;
- `bank`, `maxLvl`, coroas legadas;
- defaults/pet/energia;
- payload bruto não é mutado;
- App não pode voltar a declarar outro `migrate/defaultState`.

Não houve bump de `schemaVersion` nem mudança deliberada do formato externo do save.

### 4.2 Dependências npm

Auditoria separou árvore completa e `--omit=dev` e mapeou a cadeia de cada advisory.

Vulnerabilidades iniciais:

- `js-yaml` 5.2.1 — HIGH, dev-only;
- `nanoid` 3.3.15 — HIGH, via PostCSS;
- `postcss` 8.5.16 — HIGH, build tooling Vite/Tailwind;
- `body-parser` 1.20.5 — LOW, via Express/runtime servidor.

Remediação conservadora: **somente lockfile**, dentro das ranges já declaradas; nenhum `npm audit fix` e nenhum major.

Resoluções finais:

- `js-yaml` 5.2.3
- `nanoid` 3.3.18
- `postcss` 8.5.26
- `body-parser` 1.20.6

Commit:

`bd17e42d55eae3bbff1afd08f137ea001f76b91e`

Provas antes de publicar:

- `rm -rf node_modules && npm ci` OK;
- audit completo = **0 vulnerabilidades**;
- audit produção = **0 vulnerabilidades**;
- auditorias SAGA/grafo/TS/suíte completa/build = verdes.

Decisão consolidada em `5de9cb1aa5c7114aff93a8028ff0205a002d9f47`.

As quatro workflows temporárias P19 foram conferidas e estão removidas no head.

## 5. Canários F0 ativos/revalidados

Além dos históricos:

1. `AL.01`
2. `N1.06`
3. `N1.13`
4. `GE.01`
5. `GE.02`
6. `GM.01`
7. `N1.10`
8. `N1.11`

Lista declarativa única:

`src/curriculum/motores/composerCanaryIds.ts`

Promoção futura = **um id por commit**.

## 6. GM.12 / F50 — ainda em observação

Matriz:

`GM.01 comparação direta visível → GM.12 massa/capacidade: comparação e conservação → GM.05 medidas padronizadas`

- GM.12 implementada, registrada e visualmente revisada;
- fora dos canários por decisão deliberada;
- `Recipientes` executável;
- pendências homônimas: `Moedas`, `Regua`;
- F50 é pré-unidade, sem g/kg, L/mL ou cm/m.

**Não promover GM.12 por momentum.**

## 7. P18 — fechada

`KindType` autoral só contém kinds com builder; zero exceções. Legado continua em `Question.kind` string.

Documentos: `AUDITORIA_P18_KINDS.md` e `DECISAO_P18_KINDTYPE.md`.

## 8. Próxima frente — P20: reconciliação local × nuvem

P17/P8/P19 estão fechadas. Não reabrir sem falha objetiva.

### Anomalia já observada

`App.tsx` importa:

```ts
loadStateFromCloud
reconcileStateByRevision
saveStateToCloud
```

de `./services/storageSync`.

O conector GitHub não conseguiu resolver diretamente `src/services/storageSync.ts`, `.tsx` nem o diretório `src/services`, **mas TypeScript/build passam**. Portanto não concluir “arquivo ausente” sem inventário real do checkout.

### Auditoria P20 deve responder antes de editar persistência

1. qual arquivo real resolve `./services/storageSync`;
2. todos os consumidores de `loadStateFromCloud`, `saveStateToCloud`, `reconcileStateByRevision`;
3. regra exata de precedência por `revision`;
4. empate de revisão e payloads divergentes;
5. se o estado inteiro viaja junto (`dojoTracks`, progress, inventory, customTracks, coins, album, log etc.);
6. ordem correta: migração antes/depois da reconciliação;
7. comportamento offline → reconexão;
8. mensagens do service worker (`SAVE_REQUEST` etc.);
9. se payload stale/equal revision pode apagar campo novo;
10. testes existentes/ausentes para conflitos.

**P20 começa read-only/audit-first. Não alterar persistência antes da prova.**

## 9. QA visual — regra de leitura

ZIP de sonda pode conter rollback, fases intermediárias e representações novas. Sonda/layout aprovados ≠ direção artística premium aprovada. Falha objetiva deve corrigir componente, nunca afrouxar fiscal.

## 10. Portões

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

Tela afetada também exige sonda/prints reais.

## 11. Não fazer

- não tocar na `main`;
- não tocar Creature Engine;
- não reabrir P17/P8/P19 por curiosidade;
- não criar `progress[JD*]`;
- não reintroduzir Garden CRA;
- não promover GM.12 no embalo;
- não mudar regra de sync antes da auditoria P20;
- não usar igualdade de `revision` como desempate sem provar semântica atual;
- não tratar sonda como arte final;
- não deixar workflow/script temporário órfão.

**Existir não é estar certo. Divergência pode ser corrigida; divergência silenciosa não.**
