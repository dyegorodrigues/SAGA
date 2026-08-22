# CHECKPOINT — Fábrica Curricular W46 · AL.08/F90 FECHADA · 2026-08-18

> Recibo humano da onda W46. As autoridades continuam sendo GitHub remoto, canário, DAG, Coverage Matrix, runtime map e workflows do SHA exato.

## 1. Âncora

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — preservado `open + draft + unmerged`
- Branch: `codex/fechamento-curricular`
- `main` protegida: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- W45 reconhecida como fechada; não foi reaberta.
- Regression-first W46 preservado: `d68edc718f4bcaa53da66a58e87e680450ea2d0c`.

## 2. Regression-first W46

Contrato: `src/curriculum/equacoesW46.test.ts`.

Recibos do SHA `d68edc718f4bcaa53da66a58e87e680450ea2d0c`:

- CI `32076649252` — `completed/failure` nominal;
- Certificação transversal `32076649256` — `completed/success`;
- único vermelho: ausência real de `AL.08/F90` em `JOURNEY_FICHAS`;
- demais gates, TypeScript, Sensei, higiene e binários verdes.

O regression-first não foi relaxado nem reescrito.

## 3. Materialização inativa F90 — vinculante

SHA inativo:

`f3c7c4d4e044fd275bee0e5f6985497fd2c20ced`.

Recibos do **mesmo SHA inativo**:

- CI `32085678926` — `completed/success`;
- Certificação transversal `32085678976` — `completed/success`.

Nesse SHA `AL.08` permanecia fora do canário e do ledger. A materialização já continha ficha/contrato/palco F90, resolução causal, Radar/misconceptions, evidência L3+, runtime map e testes, mas ainda não estava servida em produção.

## 4. Promoção atômica e regressão real exposta

SHA de promoção:

`d4c22e59c2e600570c705f9d0a46ff9cc38c9630`.

O compare remoto `f3c7c4d4… → d4c22e59…` provou **um commit e exatamente três arquivos**:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `AL.08`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — adiciona o ledger W46;
3. `src/curriculum/coverageMatrix.test.ts` — reconcilia o contrato Matrix.

Logo, a promoção foi estritamente atômica. Nenhuma materialização técnica foi misturada a ela.

Recibos:

- Certificação transversal `32086538164` — `completed/success`;
- CI `32086538316` — `completed/failure`.

Classificação do vermelho: **A — regressão real da materialização, exposta pela ativação**.

Job/step: `Gates do SAGA` → `Testes`.

Erro exato:

`src/curriculum/motores/canaryContract.test.ts:237` — `AL.08 L1: 5 opções: expected 5 to be less than or equal to 4`.

Causa: F90 montava gabarito + quatro distratores = cinco opções. O canário inativo não exercitava AL.08 no contrato universal; a ativação expôs a violação. O teto de quatro opções foi preservado; nenhum gate foi ampliado.

## 5. Reparo F90 sem relaxar contratos

O reparo manteve quatro opções por tela: gabarito + três misconceptions, alternadas pelos níveis para preservar a cobertura agregada das quatro misconceptions canônicas.

Histórico relevante:

- `f29adf94ac32bf826c335e6c1e802c0e2304291b` — primeiro reparo do teto; transversal `32093659261` success, CI `32093659260` cancelado por push posterior e portanto **não é recibo final**;
- `3cc05e5e4da101f0bca9f3e2574a5a8fba3abf67` — ajuste de rotação que resolveu o canário, mas o CI expôs outra regressão real: o L3 deixou de oferecer `RESPONDE_O_TODO`, quebrando o contrato executável de retry/mastery em `equacoesW46Stage.test.tsx`; não foi aceito como final;
- `c2cf5b29639ce5a13d9d190ed312cad4df797dac` — reparo cirúrgico final: L3 omite `NAO_APLICA_AOS_DOIS` e preserva `OPERACAO_INVERSA_ERRADA + QUEBRA_EQUILIBRIO + RESPONDE_O_TODO`, exatamente o conjunto exercitado pelo palco. `NAO_APLICA_AOS_DOIS` continua coberta em outros níveis.

Nenhum teste, Matrix, sonda ou contrato foi relaxado. O contrato universal de no máximo quatro opções continuou intacto.

## 6. Certificação final W46

SHA técnico final vinculante:

`c2cf5b29639ce5a13d9d190ed312cad4df797dac` — `fix: preservar retry F90 no L3`.

Recibos do **mesmo SHA final**:

- CI `32094469085` — `completed/success`;
- Certificação transversal `32094469058` — `completed/success`, 9/9.

No CI final:

- catálogo, fichas, conformidade e DAG verdes;
- TypeScript verde;
- `239` arquivos de teste / `3.347` testes — todos verdes;
- `canaryContract.test.ts` — 924 testes verdes;
- `equacoesW46Stage.test.tsx` — 8 testes verdes;
- `equacoesW46.test.ts` verde;
- build verde;
- guarda textual do PR verde;
- Sonda real Sensei verde;
- higiene e binários verdes.

**W46 está FECHADA. Não reabrir AL.08/F90 sem causa nova observável.**

## 7. Matrix REAL pós-W46

A Coverage Matrix executável observada no Gates do SHA final registrou:

- **71 Composer**
- **15 legado**
- **4 fallback**
- **86 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Fallbacks reais:

`GM.11, N5.05, N6.02, PE.04`.

## 8. Recalculo causal e seleção W47

Prereqs atuais no DAG remoto:

- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `N5.05` ← `N5.04 + N6.04`;
- `PE.04` ← `PE.03 + N6.03`.

Todos estão servidos. Nenhum dos quatro fallbacks é prerequisito imediato de outro fallback restante, portanto o ganho imediato de desbloqueio empata em zero.

No recálculo anterior, `AL.08` e `N6.02` eram os únicos empatados na menor `causalWave` relevante. W46 não alterou o DAG; apenas removeu `AL.08` do conjunto de fallback. Assim, após observar a Matrix real pós-W46, `N6.02` torna-se o candidato de menor onda causal entre os quatro restantes. A decisão não depende de fila antiga e foi revalidada contra o DAG remoto atual.

**W47 = `N6.02 / F76 — Contas com Vírgula`.**

## 9. Contrato canônico F76 para o regression-first

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md`.

- competência: `N6.02 — operações com decimais`;
- ficha: `F76 — Contas com Vírgula`;
- primitivas autorais: `InteractiveVertical + Quadrado100`;
- prereqs: `N6.01 + N3.11 + N3.12`;
- fundamento: somar/subtrair decimais alinhando **a vírgula**, não os dígitos da direita; décimo com décimo, unidade com unidade;
- L1: mesma quantidade de casas;
- L2: casas diferentes, com zeros de preenchimento;
- L3: subtração;
- L4: reagrupamento;
- L5: multiplicação por 10/100;
- misconceptions: `ALINHA_PELA_DIREITA`, `IGNORA_ZEROS`, `VIRGULA_PERDIDA`;
- domínio: `{ acertos: 3, de: 3, sessoes: 2 }`, incluindo ao menos um caso de **casas diferentes (L2)**;
- resolução deve preservar o sentido de valor posicional e da vírgula como eixo das ordens;
- RT fora da autoridade conceitual; não comprar mastery por resolução assistida;
- interação motora deve manter alternativa por toque quando houver manipulação.

Contrato regression-first: `src/curriculum/contasVirgulaW47.test.ts`.

## 10. Cadência seguinte

O fechamento documental W46 abre apenas o regression-first W47. **Não materializar F76 neste mesmo commit.**

O vermelho nominal esperado é exclusivamente:

`JOURNEY_FICHAS.find(item => item.id === "N6.02")` retornando `undefined` em `contasVirgulaW47.test.ts`.

Depois de classificar o regression-first:

1. não relaxar o teste;
2. materializar `N6.02/F76` completa e **inativa**;
3. manter N6.02 fora do canário e W47 fora do ledger enquanto inativa;
4. exigir CI + transversal verdes no mesmo SHA inativo;
5. só então promover atomicamente canário + ledger + contrato Matrix;
6. recertificar e recalcular W48 pelo estado real.
