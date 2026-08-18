# CHECKPOINT — Fábrica Curricular W47 · N6.02/F76 regression-first VALIDADO · 2026-08-18

> Recibo humano do regression-first W47. Não substitui GitHub remoto, DAG, Matrix, canário nem workflows do SHA exato.

## 1. Âncora

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — preservado `open + draft + unmerged`
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- W46/AL.08/F90 fechada no SHA técnico final `c2cf5b29639ce5a13d9d190ed312cad4df797dac`.
- Matrix pós-W46: `71 Composer / 15 legado / 4 fallback / 86 servidas / 11 divergências`.

## 2. Seleção causal

Fallbacks reais pós-W46:

`GM.11, N5.05, N6.02, PE.04`.

Prereqs atuais:

- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `N5.05` ← `N5.04 + N6.04`;
- `PE.04` ← `PE.03 + N6.03`.

Todos estão servidos. Nenhum dos quatro destrava imediatamente outro fallback restante. O DAG não mudou com W46; no recálculo anterior AL.08 e N6.02 eram os únicos empatados na menor `causalWave` relevante. Com AL.08 removida do fallback, o remoto pós-W46 seleciona:

**W47 = `N6.02 / F76 — Contas com Vírgula`.**

## 3. Contrato autoral F76

Fonte: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md`.

- competência: `N6.02 — operações com decimais`;
- ficha: `F76 — Contas com Vírgula`;
- primitivas: `InteractiveVertical + Quadrado100`;
- prereqs: `N6.01 + N3.11 + N3.12`;
- ideia central: alinhar a vírgula como eixo do valor posicional, não simplesmente alinhar os dígitos pela direita;
- L1: mesma quantidade de casas;
- L2: casas diferentes + zeros de preenchimento;
- L3: subtração;
- L4: reagrupamento;
- L5: multiplicação por 10/100;
- misconceptions: `ALINHA_PELA_DIREITA`, `IGNORA_ZEROS`, `VIRGULA_PERDIDA`;
- mastery: `{ acertos: 3, de: 3, sessoes: 2 }`, com ao menos um caso L2 de casas diferentes;
- RT fora da autoridade conceitual;
- resolução assistida não compra mastery independente;
- manipulação precisa de alternativa por toque e não pode transformar precisão motora em prova conceitual.

## 4. Commit regression-first

SHA vinculante:

`073bfab1469aeb86bdc0c3376634cba559880961` — `test: fechar W46 e abrir W47 regression-first`.

Esse commit alterou apenas:

1. `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
2. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
3. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W46_AL_08_F90_FECHADA_2026-08-18.md`;
4. `src/curriculum/contasVirgulaW47.test.ts`.

Não materializou F76 e não tocou canário, ledger ou contrato Matrix de W47.

## 5. Recibos

No mesmo SHA `073bfab1469aeb86bdc0c3376634cba559880961`:

- CI `32095359960` — `completed/failure` nominal;
- Certificação transversal `32095359969` — `completed/success`, 9/9;
- Sonda real Sensei — `completed/success`;
- higiene do diff — `completed/success`;
- guarda de binários — `completed/success`.

No job `Gates do SAGA`:

- auditoria do catálogo — success;
- auditoria das fichas — success;
- conformidade das fichas — success;
- sincronia do DAG — success;
- TypeScript — success;
- `Testes` — failure nominal;
- build/guarda textual foram skipped pela falha deliberada anterior, não por erro próprio.

Suíte:

- 240 arquivos de teste;
- 3.348 testes;
- 239 arquivos / 3.347 testes passam;
- **1 arquivo / 1 teste falha**.

Único vermelho:

`src/curriculum/contasVirgulaW47.test.ts`.

Erro exato:

`AssertionError: expected undefined to be defined`

em `src/curriculum/contasVirgulaW47.test.ts:23`, na linha:

`expect(ficha).toBeDefined();`

A variável `ficha` vem de:

`JOURNEY_FICHAS.find(item => item.id === "N6.02")`.

Logo, a falha prova exclusivamente que `N6.02/F76` ainda não foi materializada.

Matrix observada permaneceu `71/15/4/86/11`; N6.02 continuou fallback e nenhum baseline foi antecipado.

## 6. Classificação

**Regression-first W47 VALIDADO.**

Não é regressão funcional, flake nem falha de infraestrutura. É o vermelho nominal deliberado do protocolo.

Não rerodar para buscar verde. Não relaxar ou remover o teste. Não registrar N6.02 como Composer/servida antes da materialização e promoção corretas.

## 7. Próxima ação autorizada

Materializar `N6.02/F76` completa e **INATIVA**:

- Journey ficha;
- contrato/builder;
- kind/palco coerente com `InteractiveVertical + Quadrado100`;
- renderer/wiring;
- resolução causal;
- Radar/misconceptions;
- evidência L2 de casas diferentes;
- runtime map;
- answer policy;
- testes nominais.

Durante a fase inativa:

- N6.02 fica fora do canário;
- W47-N6.02 fica fora do ledger/Matrix;
- baseline não antecipa delta;
- exigir CI + transversal verdes no mesmo SHA inativo.

Só depois promover atomicamente canário + ledger + contrato Matrix, recertificar no mesmo SHA final e recalcular W48 pelo remoto.

## 8. Pós-90/90 preservado sem interferir na fábrica

- Issue #47 governa a transição `90/90 → Integração Sistêmica e Child-Ready`.
- Issue #48 governa lacunas microcurriculares/microprogressão; a hipótese sobre “segundos” em GM.06/F62 permanece `CANDIDATA` até a mega-auditoria.

Esses registros não autorizam interromper W47–W50.
