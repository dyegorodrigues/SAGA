# CHECKPOINT — Fábrica Curricular W44 FECHADA — N5.04 / F74

**Data:** 17/08/2026  
**Status:** W44 FECHADA E CERTIFICADA  
**Competência:** `N5.04 — Soma e subtração de frações`  
**Ficha:** `F74 — Somar Frações`  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — permanece draft + open + unmerged

## 1. Cadeia vinculante da W44

### Regression-first

SHA `34b6b3a5ed3fde597564685e7b2a820c2beca0f7`.

- CI `32050560773`: `completed/failure`;
- Certificação transversal `32050560782`: `completed/success`;
- vermelho nominal exclusivamente pela ausência de `N5.04/F74`;
- 3.279/3.280 testes verdes.

### Materialização inativa

A primeira materialização `4f1f8c702e431cb9ee7b306e39eccd7c4e7e7314` encontrou incompatibilidade de mutabilidade TypeScript na resolução F74 e não vale como recibo final.

Recibo inativo final: `a41e6e9e6317efcec230b879722a8ae3fcafd8ae`.

- CI `32052726802`: `completed/success`;
- Certificação transversal `32052726430`: `completed/success`;
- 235 arquivos / 3.287 testes verdes;
- TypeScript, build, catálogo, fichas, conformidade, grafo, higiene e binários verdes;
- N5.04 registrada no Composer, porém ainda fora do canário nesse SHA.

### Promoção final

SHA `5da29dc4078d67f71012daf21c435be622163957` — `feat: promover W44 N5.04 F74`.

A promoção foi atômica e alterou somente:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativação N5.04;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger `W44-N5.04` aditivo;
3. `src/curriculum/coverageMatrix.test.ts` — sequência/última migração/baseline.

Recibos finais:

- CI `32062255308`: `completed/success`;
- Certificação transversal `32062255294`: `completed/success`;
- 235 arquivos / 3.300 testes verdes;
- TypeScript e build verdes;
- catálogo/fichas/conformidade/grafo verdes;
- Sonda real Sensei verde;
- higiene e binários verdes;
- nove sondas transversais verdes.

Matrix real observada:

**69 Composer / 15 legado / 6 fallback / 84 servidas / 11 divergências**.

Não houve baseline artificial, queda de gate, mistura de recibos ou promoção parcial.

## 2. Realização pedagógica fechada

F74 usa `SingaporeBars` com denominador fixo e preserva a escada:

1. soma com barras;
2. soma simbólica;
3. subtração;
4. fração imprópria;
5. simplificação como mesma quantidade/outro nome.

Diagnósticos runtime:

- `soma-denominador`;
- `nao-simplifica`;
- `impropria-invalida`.

Domínio 3/3 em 2 sessões. A política especial após `SOMA_DENOMINADOR` reutiliza `masteryDisqualifier`: o acerto pode encerrar corretamente a questão, mas não compra evidência independente de mastery imediatamente após a correção.

## 3. Estado pós-W44

- W1–W44 fechadas;
- Composer ativo: 69;
- legado: 15;
- fallback: 6;
- servidas: 84;
- divergências: 11;
- fallbacks: `AL.08, GM.11, N5.05, N6.02, N6.04, PE.04`;
- primitiva ainda ausente registrada pela Matrix: `Moedas`.

## 4. Recálculo causal para W45

Critério vigente:

1. prereqs servidos;
2. maior ganho imediato de desbloqueio;
3. menor causalWave;
4. maior downstream;
5. ID / menor delta estrutural como desempate residual.

Elegíveis pós-W44:

- `N6.02` — prereqs `N6.01 + N3.11 + N3.12`;
- `N6.04` — prereqs `N6.03 + N4.06`;
- `AL.08` — prereqs `AL.07 + N7.02`;
- `PE.04` — prereqs `PE.03 + N6.03`;
- `GM.11` — prereqs `GM.09 + N4.02`.

`N5.05` depende de `N5.04 + N6.04`, portanto ainda está bloqueada somente por N6.04.

### Seleção

**W45 = `N6.04 / F88 — Razão e Proporção`.**

Motivo: N6.04 é elegível e sua promoção tem ganho imediato de desbloqueio sobre o fallback N5.05. O restante da fila não deve ser congelado: após W45, recalcular novamente.

## 5. Contrato canônico de entrada da W45

F88:

- primitiva: `SingaporeBars`;
- duas quantidades crescem juntas mantendo relação;
- erro central: somar em vez de escalar;
- a interface deve escalar as duas barras simultaneamente;
- níveis: dobrar → triplicar → escala qualquer → razão como fração → regra de três;
- misconceptions: `SOMA_EM_VEZ_DE_ESCALAR`, `ESCALA_UM_LADO`, `INVERTE_RAZAO`;
- mastery `{ acertos: 3, de: 3, sessoes: 2 }`, incluindo escala não-inteira.

O fechamento documental W44 e o regression-first nominal W45 entram no mesmo ciclo de retomada. Não implementar F88 antes de classificar o vermelho regression-first no SHA exato.

## 6. Restrições

- não tocar/mergear `main`;
- PR #35 continua draft/unmerged;
- sem ready/auto-merge;
- cânone compartilhado aditivo;
- sem relaxar testes/Matrix/auditores;
- sem Creature Engine/Tamagotchi;
- issues #47/#48 permanecem pós-90/90 e não interrompem a fábrica atual.
