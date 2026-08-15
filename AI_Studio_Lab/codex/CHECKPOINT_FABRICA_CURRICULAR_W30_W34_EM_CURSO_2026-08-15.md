# CHECKPOINT — Fábrica Curricular W30–W34 em curso

Data de abertura do bloco: 2026-08-15 UTC  
PR: #35 · branch: `codex/fechamento-curricular`

## Escopo

Este checkpoint acompanha o bloco fallback-first W30–W34. Ele não substitui a Coverage Matrix executável nem `PROMPT_DE_RETOMADA.md`; funciona como recibo humano do bloco em curso e será consolidado quando W34 fechar.

Regra de evidência aplicada: nenhum ID de run, SHA, contagem de testes ou delta é registrado sem consulta à fonte correspondente. Workflow `cancelled` permanece `cancelled`, mesmo quando um job já havia falhado antes do cancelamento.

## Estado atual do bloco

| Onda | Competência / ficha | Estado | Matrix após fechamento | Recibo final consultado |
|---|---|---|---|---|
| W30 | N2.06 / F38 — Pares e Ímpares | **fechada** | **55 Composer / 15 legado / 20 fallback / 70 servidas / 11 divergências** | `05b7787e7239db4c687b5fa7cc47ee0b4f256447` · CI `31883452067` + transversal `31883452082`, ambos `success` |
| W31 | PE.03 | próxima, sujeita a reancoragem | — | — |
| W32 | — | não selecionada | — | — |
| W33 | — | não selecionada | — | — |
| W34 | — | não selecionada | — | — |

## Integração de design antes da W30

O commit `e6bb655` da branch auxiliar foi integrado por fast-forward antes da onda. Ele trouxe:

- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`;
- `src/styles/coresLiterais.test.ts`;
- baseline da catraca;
- `npm run cores:baseline`.

A regra vigente desde então é simples: ficha e palco usam papéis de `src/styles/tokens.ts`; o gate recusa cor literal nova. Se faltar papel semântico, o token é ampliado de forma deliberada em vez de inserir cor solta no componente. A paleta por operação aritmética registrada no documento de design é decisão do dono do projeto e não se reabre na fábrica curricular.

## W30 — N2.06 / F38 — Pares e Ímpares

### Contrato canônico

Pré-requisito: `N2.03`.  
Primitiva: `DragGroup#duplas`.

Escada preservada:

1. formar duplas até 10;
2. formar duplas até 20;
3. decidir par/ímpar sem formar fisicamente;
4. usar a regra do último algarismo;
5. raciocinar sobre paridade de somas.

Diagnósticos preservados:

- `CONFUNDE_TAMANHO`;
- `ZERO_IMPAR`;
- `DECORA_SEM_ENTENDER`.

Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

### Regression-first

SHA `9dc0e61df21f780249f42aaf66785ff69c6d6e76`.

- workflow CI `31882060323`: terminou **`cancelled` por concorrência**;
- job `Gates do SAGA` `95005940004`: terminou `failure` antes do cancelamento;
- o log mostrou a falha desenhada nos 2 testes novos porque `N2.06` ainda não existia no Composer;
- os testes anteriores permaneceram verdes.

A evidência regression-first foi observada no job/log. O status final do workflow não é reclassificado.

### Materialização inativa

A primeira materialização foi publicada em `5cdbd2e8ff7ba862911910af969607c49267dfcf`. Antes da promoção, a revisão do portão expôs que o alfabeto declarativo de conformidade ainda precisava reconhecer o modo runtime `duplas`.

A linha declarativa foi corrigida sem tocar no canário, gerando o portão inativo final:

`c62beaadfe10b903d6054aa56ef688c269ff5288`.

Recibos do SHA exato:

- CI `31882628417`: `success`;
- transversal `31882628429`: `success`.

A materialização inativa registrou ficha `N2.06`, contrato `paresImparesContract`, `ParesImparesStage`, registro no Composer, renderer e runtime map `DragGroup#duplas`, mantendo `N2.06` fora do canário default.

O palco foi escrito sob a catraca nova: cores de `tokens.ts`, sem cor literal nova.

### Promoção atômica

SHA `c1e7512e912421d3d1923838bf3050218e92fc59`.

No mesmo SHA entraram:

- `N2.06` no canário declarativo;
- `W30-N2.06` no ledger;
- contrato executável da Matrix para o novo baseline.

A Matrix observou:

- **55 Composer**;
- **15 legado**;
- **20 fallback**;
- **70 servidas**;
- **11 divergências**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- `missingPrimitives=["Moedas"]`.

A suíte da promoção reportou **216 arquivos / 3.053 testes**, todos verdes.

Recibos:

- CI `31883028645`: `success`;
- transversal `31883028668`: `success`.

### Correção de runtime pós-promoção

A revisão da implementação detectou uma dívida não capturada pelos testes estruturais: `ParesImparesStage` criava `onProgress` inline e `DragGroup` tinha um efeito dependente da identidade desse callback, combinação capaz de realimentar renderizações ao montar a F38.

A correção isolada foi publicada em:

`05b7787e7239db4c687b5fa7cc47ee0b4f256447`.

Ela:

- estabiliza a notificação de progresso do `DragGroup`;
- adiciona teste de montagem que protege contra o ciclo;
- dá tutorial semanticamente correto ao modo de formar duplas;
- tokeniza o tutorial do `DragGroup` e mantém a nova UI sem cor literal;
- não altera canário, ledger ou Matrix.

No gate desse SHA final:

- Matrix permaneceu **55/15/20/70/11**;
- `src/styles/coresLiterais.test.ts` passou;
- suíte completa: **217 arquivos / 3.055 testes**, todos verdes;
- build, TypeScript, catálogo, fichas, conformidade, grafo, higiene e binários passaram.

Recibos finais do código da W30:

- CI `31883452067`: `success`;
- transversal `31883452082`: `success`.

## Correções de evidência que continuam vinculantes

### W28

No SHA regression-first `e3d41ac72a6a474253e73b4756dabdbb5099201f`, o CI `31858118039` terminou `cancelled`, não `failure`. O fechamento posterior permanece certificado por recibos próprios.

### W29

No SHA regression-first `52bdb4e249b5d9a9f9535cda46f244ccc1dc52c3`:

- workflow CI `31863719586`: `cancelled` por concorrência;
- job `Gates do SAGA` `94961316286`: `failure`;
- log: falha desenhada observada porque `GE.04` ainda não estava registrada, com 213 arquivos / 3.016 testes anteriores verdes.

Formulação correta: **o log mostra a falha desenhada; o run terminou `cancelled` por concorrência**.

## Seleção pós-W30

Restam 20 fallbacks:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.09, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.03, PE.04`.

A promoção de `N2.06` tornou `N2.07` elegível, mas ela não desbloqueia outro fallback imediatamente.

Os únicos candidatos com ganho imediato 1 no recálculo pós-W30 são:

- `PE.03` → torna `PE.04` elegível;
- `GM.09` → torna `GM.11` elegível.

Pela ordem causal executável observada na Matrix/DAG, `PE.03` precede `GM.09`. Portanto, se o remoto não derivar, **W31 = PE.03**.

## Invariantes para W31–W34

1. Reancorar no remoto antes de editar.
2. Regression-first precisa de falha desenhada observada; workflow cancelado nunca é rebatizado como `failure`.
3. Materialização permanece inativa até CI + transversal verdes no mesmo SHA.
4. Canário, ledger, Matrix e runtime map são declarativos.
5. Promoção e ledger entram no mesmo SHA.
6. Matrix observa o delta real; baseline não mascara deriva.
7. Ao avaliar desbloqueio, contar apenas fallbacks cujos **todos** os prereqs passam a estar servidos.
8. Ler `DESIGN_ESTADO_E_DECISOES.md` antes de tocar em cor, fonte ou espaçamento.
9. Usar `tokens.ts`; a catraca `coresLiterais.test.ts` não pode crescer por conveniência.
10. Se uma correção posterior tocar runtime da onda, o SHA corrigido precisa de CI + transversal verdes e vira o recibo final.
11. Não tocar `main`, não mergear PR #35, não marcar ready, não habilitar auto-merge e não tocar Creature Engine/Tamagotchi.

## Continuidade

Retomar sempre por:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- este checkpoint do bloco W30–W34;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` quando houver UI;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `src/curriculum/coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- workflows do SHA exato do HEAD.
