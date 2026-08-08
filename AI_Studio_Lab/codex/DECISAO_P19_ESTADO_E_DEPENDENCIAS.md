# Decisão P19 — migrador único, integridade de estado e dependências

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado:** **RESOLVIDA**

## 1. Problema 1 — dois migradores com semânticas diferentes

O projeto tinha simultaneamente:

- uma função `migrate` local em `src/App.tsx`, usada de verdade na carga local/nuvem;
- `src/utils/migrator.ts`, arquivo aparentemente canônico, mas sem consumidor ativo.

Eles não eram equivalentes.

O migrador do App completava:

- pet/energia/nome;
- moedas/wallet legado;
- álbum/log;
- `bank`, `maxLvl`, coroas legadas;
- `dojoTracks`;
- defaults de criança.

O utilitário praticamente só validava `schemaVersion` e retornava o payload.

Isso era uma armadilha estrutural: um mantenedor poderia importar o arquivo “óbvio” e perder migrações silenciosamente.

## 2. Decisão — um único migrador real

`src/utils/migrator.ts` passou a ser a fonte única.

Commit funcional:

`86ecea6b932ee174f81f9b2914d3ffade9088798`

O App agora importa:

- `defaultState`;
- `localDay`;
- `migrate`.

A cópia local foi removida.

### Garantias adicionadas

`src/utils/migrator.test.ts` prova:

1. default atual inclui `dojoTracks` e `customTracks`;
2. schema incompatível preserva a política Fase 1 de reset limpo;
3. save v1 antigo mantém progresso e recebe contratos novos;
4. wallet antigo tem precedência no saldo inicial;
5. sem wallet, moedas derivam das estrelas históricas;
6. `dojoTracks` existente é preservado;
7. coroa legada recebe `masteryEvidence` de migração;
8. energia do mascote é migrada deterministicamente;
9. migrar **não muta o objeto bruto recebido**;
10. `App.tsx` não pode voltar a declarar outro `migrate`/`defaultState`.

### Melhoria de integridade

A implementação antiga fazia clone superficial e podia completar mapas internos em referências compartilhadas do payload carregado.

O novo migrador clona os mapas antes de completar defaults. A migração deixa de ter efeito colateral sobre o objeto bruto vindo da reconciliação local/nuvem.

## 3. Problema 2 — vulnerabilidades npm

`npm ci` reportava:

- 1 low;
- 3 high.

Foi executado diagnóstico em duas árvores:

- `npm audit --json`;
- `npm audit --omit=dev --json`.

Relatório detalhado:

`AI_Studio_Lab/codex/AUDITORIA_P19_DEPENDENCIAS.md`

### Cadeias identificadas

- `js-yaml` — direto, dev-only, usado pelos auditores do SAGA;
- `nanoid` — transitivo de `postcss`;
- `postcss` — transitivo de Vite / Tailwind build tooling;
- `body-parser` — transitivo de Express, servidor de produção.

A separação evitou tratar “aparece em audit produção” como sinônimo automático de “vai para o browser”.

## 4. Advisories e versões mínimas seguras

Advisories oficiais verificados:

- `GHSA-pm4m-ph32-ghv5` — js-yaml: corrigido em 5.2.2;
- `GHSA-28wg-ghj8-5hjv` + `GHSA-2v37-7h3g-55p8` — nanoid 3.x: corrigido em 3.3.17;
- `GHSA-r28c-9q8g-f849` + `GHSA-fxqj-rqcc-2cmp` — postcss: correção completa na linha 8.5 em 8.5.23;
- `GHSA-v422-hmwv-36x6` — body-parser 1.x: corrigido em 1.20.6.

## 5. Remediação escolhida — lockfile mínimo, sem major

As ranges já declaradas no projeto aceitavam versões corrigidas.

Portanto não foi executado `npm audit fix` e não foi alterada nenhuma range do `package.json`.

O workflow transacional executou:

```bash
npm update js-yaml nanoid postcss body-parser --package-lock-only --ignore-scripts
rm -rf node_modules
npm ci
npm audit --audit-level=low
npm audit --omit=dev --audit-level=low
```

Resoluções publicadas:

- `js-yaml` → `5.2.3`;
- `nanoid` → `3.3.18`;
- `postcss` → `8.5.26`;
- `body-parser` → `1.20.6`.

Commit:

`bd17e42d55eae3bbff1afd08f137ea001f76b91e`

Depois da atualização:

- audit completo: **0 vulnerabilidades**;
- audit produção: **0 vulnerabilidades**;
- instalação limpa via `npm ci`: OK;
- auditorias do SAGA: OK;
- grafo: OK;
- TypeScript: OK;
- suíte completa: OK;
- build: OK.

## 6. O que não foi feito

- não subiu `schemaVersion`;
- não mudou o formato externo do save;
- não aplicou `npm audit fix`;
- não fez major upgrade de Express/Vite/Tailwind;
- não mexeu na `main`;
- não tocou GM.12;
- não reabriu P17/P8.

## 7. Invariantes permanentes

1. **Existe uma única função de migração de save usada pelo App.**
2. **Migração não muta o payload bruto recebido.**
3. **Todo campo novo de estado precisa entrar no migrador e em teste.**
4. **Vulnerabilidade npm é classificada por cadeia e superfície antes da correção.**
5. **Preferir atualização mínima dentro da range já declarada quando ela resolve o advisory.**
6. **Nunca usar `npm audit fix` como substituto de engenharia de dependência.**
7. **Lockfile corrigido precisa reinstalar do zero e atravessar a suíte inteira.**

## 8. Próxima pergunta sistêmica

Com o migrador unificado, a próxima fronteira lógica é a reconciliação **local × nuvem**:

- qual payload vence por revisão;
- se todos os campos (`dojoTracks`, progresso, inventário, customTracks etc.) viajam juntos;
- comportamento offline/online;
- conflito entre save mais novo local e cloud;
- se a migração acontece no ponto correto antes/depois da reconciliação;
- testes existentes para esses cenários.

Essa auditoria deve ser feita antes de qualquer alteração de persistência.

**Um save só é seguro quando existe uma fonte de migração e uma regra inequívoca de reconciliação.**
