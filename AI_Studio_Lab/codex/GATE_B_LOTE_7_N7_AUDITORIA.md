# Gate B · Lote 7 — N7 · Auditoria de microprogressão

**Modo:** `AUDIT-ONLY`  
**Escopo:** `N7.01–N7.02`  
**HEAD de entrada reancorado:** `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`  
**Gate A:** `FECHADO-COM-RECIBO`  
**Gate B:** aberto em lotes  
**Gates C–J:** não iniciados

> Este lote registra evidência. Não corrige código, não implementa gates, não ativa Gate B′ e não inicia o domínio seguinte.

## 1. Reancoragem e fontes

Antes de qualquer escrita foram confirmados no remoto:

- PR #35 `open + draft + unmerged`;
- branch `codex/fechamento-curricular`;
- `main` intocada em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
- HEAD de entrada `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`;
- reviews e review threads sem pendência nova;
- CI `32291510503` e Certificação transversal `32291509536` verdes no HEAD de entrada, esta com 9/9 jobs.

Foram lidos/revalidados:

1. `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
2. `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
3. Issue #47, incluindo §0.2 e a proposta Gate B′ apenas como proposta;
4. Issue #48 inteira como registro vivo;
5. `AI_Studio_Lab/codex/GATE_B_LOTE_6_N6_AUDITORIA.md`;
6. `curriculum/N7.yaml`;
7. `src/curriculum/grafo_saga.ts`;
8. `src/curriculum/motores/composerCanaryIds.ts`;
9. fichas vivas `N7.01.ts` e `N7.02.ts`;
10. cânone F4 de F84/F85;
11. `retaCompletaContract.ts`, `operarNegativosContract.ts`;
12. `RetaCompletaStage.tsx`, `OperarNegativosStage.tsx`, `InteractiveNumberLine.tsx`;
13. `FichaRenderer.tsx`, `GameLoop.tsx` e testes W24/W37;
14. fontes necessárias para revalidar `CLASS-004` e a proposta `CLASS-005`.

Documentos antigos não foram tratados como estado atual sem confirmação em fonte viva.

## 2. Resultado executivo N7

- competências auditadas: **2/2**;
- proveniência: **2 Composer / 0 legado / 0 fallback**;
- ficha↔DAG: faixas e prereqs coerentes nas duas competências;
- `CLASS-003`: ampliada com **N7.01/F84 e N7.02/F85**;
- `CLASS-004`: agravada em N6.01/F75 e ampliada com **N7.01/F84 L2**;
- `CLASS-005`: **nova**, embaralhamento enviesado por comparador aleatório, `CONFIRMADO-ATUAL`, via CODIGO;
- `CLASS-006`: **nova**, gabarito serializado como primeira alternativa em 100% das questões frescas de N7, `CONFIRMADO-ATUAL`, via CODIGO;
- novas candidatas individuais: **2**, `GAP-039` e `GAP-040`;
- vias novas individuais: **2 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- correções executadas: **0**;
- gates implementados: **0**;
- runtime, Matrix, canário, Radar e DAG: **intocados**.

## 3. Proveniência e DAG

### N7.01 — F84 · A Reta Completa

- faixa: `F4`;
- prereqs ficha/DAG: `[N1.12, N3.04]`;
- origem viva: Composer, promovida na W24;
- contrato especializado: `reta-completa-f84`.

### N7.02 — F85 · Operar com Negativos

- faixa: `F4`;
- prereqs ficha/DAG: `[N7.01, N3.13]`;
- origem viva: Composer, promovida na W37;
- contrato especializado: `operar-negativos-f85`.

O DAG ainda usa N7.02 como prerequisito de AL.08. Nenhum bypass de prereq foi observado neste lote.

## 4. CLASS-003 — caso único por nível sob mastery repetida · ampliação N7

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

Os dois contratos N7 têm **um único estímulo determinístico por nível**.

### N7.01/F84

- L1: localizar `−3`;
- L2: comparar `−5` e `−2`;
- L3: ordenar `−3, 2, −7, 5`;
- L4: distância `−3 → 2`;
- L5: módulo de `−6`.

### N7.02/F85

- L1: `4 + (−6)`;
- L2: `−7 + 3`;
- L3: `−3 + (−4)`;
- L4: `−2 − (−5)`;
- L5: `−4 + 7 − (−3) + (−2)`.

A mastery declarada é `3/3 × 2 sessões`; repetir o mesmo caso não prova invariância do conceito a novos operandos/contextos.

Membros conhecidos da `CLASS-003` após N7:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- N5.04/F74;
- N5.05/F86;
- **N7.01/F84**;
- **N7.02/F85**.

Não foram criados GAPs separados apenas por essa causa.

## 5. CLASS-004 — viés posicional em comparações · confirmação agravada

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

### 5.1 N6.01/F75 L4 — confirmação externa revalidada

`decimalContract.ts` usa exatamente os pares:

- `[0.5, 0.25]`;
- `[0.4, 0.35]`;
- `[0.7, 0.62]`;
- `[0.3, 0.28]`.

`par[0]` é sempre o operando da esquerda e `par[0] > par[1]` nos quatro pares. Logo:

```ts
const resposta = par[0] > par[1] ? "esquerda" : "direita";
```

produz **`"esquerda"` em 100% do corpus atual**. O ramo `"direita"` é código morto para esses dados.

Isso é mais forte que “distribuição enviesada”: a criança nunca precisa demonstrar a comparação com o maior à direita nesse nível.

### 5.2 Refutação preservada — preocupação análoga no L5

No caminho de **revisão do banco** em `GameLoop.tsx`, questões com opções são clonadas e passam por `shuffle(q.options)`. O `shuffle` implementado ali é Fisher–Yates correto:

- percorre `i` do fim ao início;
- sorteia `j` uniformemente em `[0, i]`;
- troca `a[i]` e `a[j]`.

Portanto a hipótese de que esse caminho L5/revisão preservaria sistematicamente a posição original das opções fica **REFUTADA**. A refutação não deve ser generalizada para questões frescas, que seguem outro caminho.

### 5.3 N7.01/F84 L2 — novo membro observado

O único caso de comparação é sempre `−5 × −2`; a pergunta é “qual é maior?” e o maior é invariavelmente o segundo operando (`−2`). O caso não é espelhado.

A causa de `CLASS-003` (caso único) e a de `CLASS-004` (posição do maior invariável) coexistem; não são a mesma propriedade.

Membros observados de `CLASS-004` após N7:

- N5.03/F73;
- N6.01/F75;
- **N7.01/F84**.

Gate de equilíbrio/simetria continua apenas proposto; não foi implementado.

## 6. CLASS-005 — `.sort(() => Math.random() - 0.5)`

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

A proposta externa foi confirmada na fonte, com **uma correção de cardinalidade**.

No HEAD de entrada existem **27 ocorrências** do comparador aleatório em `src/`, não 26:

- `src/curriculum/Composer.ts`: **18**;
- `src/utils/generatorsVisual.ts`: **3**;
- `src/curriculum/procedimentos/contagem20Contract.ts`: **2**;
- `dojo_add.ts`: **1**;
- `dojo_sub.ts`: **1**;
- `dojo_mul.ts`: **1**;
- `dojo_div.ts`: **1**.

Subtotal fora do Composer = 9; total = **18 + 9 = 27**.

O diagnóstico matemático também foi reproduzido localmente em Node com 200.000 execuções sobre array de quatro elementos:

- comparador aleatório: elemento 0 na posição 0 = **35,93%**; pior desvio do ideal = **15,49 p.p.**;
- Fisher–Yates: pior desvio = **0,18 p.p.**.

Isso reproduz materialmente a verificação externa (~36,0%, ~15,5 p.p. e ~0,2 p.p.). Comparador aleatório em `sort` não amostra permutações uniformemente.

Impacto pedagógico potencial da classe:

- posição pode vazar informação sobre o gabarito;
- evidência de domínio pode ser inflada por estratégia posicional;
- diagnósticos de misconception baseados em opção podem receber distribuição de exposição enviesada;
- conclusões sobre viés posicional, inclusive `CLASS-004`, precisam distinguir corpus enviesado de embaralhamento enviesado.

### Gate proposto — NÃO IMPLEMENTADO

Em futura frente autorizada, criar gate estático/AST que:

1. falhe se um comparador de `Array.sort` em `src/` consumir `Math.random()`;
2. reporte `arquivo:linha`;
3. exija utilitário de embaralhamento uniforme/Fisher–Yates para opções que realmente devam ser permutadas;
4. preserve explicitamente os casos em que **a posição faz parte do diagnóstico** e, portanto, não deve ser embaralhada;
5. não use allowlist silenciosa.

O `shuffle` de `GameLoop.tsx` é a implementação de referência já existente.

**Prioridade recomendada:** antes do Gate J, pois evidência infantil real não deve nascer sobre distribuição posicional sabidamente enviesada. Esta recomendação não ativa Gate B′ nem autoriza reparo neste lote.

## 7. CLASS-006 — primeira alternativa é o gabarito em 100% das questões frescas N7

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

Esta classe é distinta da `CLASS-005`:

- `CLASS-005`: existe tentativa de embaralhar, mas o algoritmo é enviesado;
- `CLASS-006`: nos contratos N7 observados **não existe embaralhamento no caminho fresco**.

Nos dois contratos, `opts(...)` constrói:

```ts
[{ value: correta, ... }, ...erradas]
```

sem shuffle. Os palcos N7 mapeiam `spec.opcoes` diretamente para botões, preservando a ordem. `FichaRenderer.tsx` encaminha os palcos especializados sem reordenar opções. E `drawQuestion(...)` em `GameLoop.tsx` só embaralha opções quando recupera uma questão do banco de revisão; uma questão fresca retorna diretamente de `track.gen(...)`.

Consequência observada:

- N7.01: gabarito é a primeira opção nos 5 níveis;
- N7.02: gabarito é a primeira opção nos 5 níveis;
- total auditado: **10/10 questões frescas canônicas com gabarito na primeira posição**.

Isso permite uma estratégia “sempre primeira opção” acertar 100% do corpus fresco observado sem demonstrar o conceito. Revisões do banco podem quebrar a posição por Fisher–Yates; isso não refuta o vazamento no fluxo fresco.

### Gate proposto — NÃO IMPLEMENTADO

Futura frente autorizada pode exigir, para contratos de múltipla escolha:

1. que o gabarito não tenha posição invariável ao longo do corpus gerável;
2. que a distribuição de posições seja provada por teste determinístico/estatístico apropriado;
3. que exceções posicionais deliberadas sejam explicitamente justificadas por diagnóstico;
4. que o teste falhe por `competência/nível/kind`.

Nenhum gate foi implementado neste lote.

## 8. GAP-039 — N7.01 troca localização na reta por reconhecimento em botões

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `REPRESENTAÇÃO-AUSENTE` + `INTERAÇÃO-AUSENTE` + `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO`  
**Via:** `CODIGO`

O cânone F84 declara:

- primitiva `InteractiveNumberLine`;
- marcador arrastável;
- contexto visual termômetro/elevador;
- no L1, a criança deve **localizar** o negativo na reta;
- ao arrastar, o contexto deve acompanhar o marcador.

O runtime especializado observado:

- renderiza `InteractiveNumberLineSurface` com `disabled={true}` e `interactionDisabled={true}`;
- mantém a reta como ilustração estática;
- publica a resposta por botões de múltipla escolha;
- não materializa o marcador arrastável nem o contexto acoplado descritos no cânone.

Hipótese: a execução mede reconhecimento de uma alternativa numérica, mas não prova a ação espacial “localizar na reta” que fundamenta F84 e o misconception `LADO_ERRADO`.

Provar/refutar pela via CODIGO: mapear a evidência exigida por cada nível F84 e demonstrar, no runtime executável, uma ação que produza posição na reta sem depender de escolher um botão. Nenhuma correção foi criada neste lote.

## 9. GAP-040 — N7.02 L4 não materializa a remoção de dívida exigida pelo cânone v3.1

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `REPRESENTAÇÃO-DIVERGENTE` + `RESOLUÇÃO-DIVERGENTE`  
**Via:** `CODIGO`

O adendo/cânone F85 v3.1 corrige explicitamente a regra antiga que mandava “subtrair = andar para a esquerda sempre”. Para `a − (−b)`, determina:

- usar contexto de dívida;
- tratar subtrair negativo como cancelar dívida;
- o nível que introduz `a − (−b)` deve ter **animação de remoção de peso/dívida, não deslocamento na reta**.

O runtime observado faz corretamente parte da semântica verbal:

- L4 usa `−2 − (−5)`;
- texto pré-resposta diz que `−(−5)` cancela dívida;
- resolução verbal também diz que subtrair negativo cancela dívida.

Mas a representação executável não materializa a exigência normativa:

- o palco mostra a `InteractiveNumberLineSurface` bloqueada;
- não existe objeto de dívida/peso sendo removido;
- a resolução declara `movimentos: [-2, 3]`, isto é, continua codificando o caso como deslocamento na reta.

Hipótese: o texto está semanticamente corrigido, mas a representação que deveria impedir a decoreba antiga não foi implementada; o aluno pode receber a regra verbal sem executar a transformação conceitual prescrita.

Provar/refutar pela via CODIGO: verificar uma representação executável do cancelamento de dívida/peso no L4 e alinhar resolução/cânone. Nenhuma alteração foi feita neste lote.

## 10. Auditoria por competência

### N7.01/F84 — A Reta Completa

- DAG/faixa/prereqs: coerentes;
- escada nominal L1–L5: coerente com o cânone;
- misconceptions centrais: presentes e exercitáveis por opções;
- mastery: 3/3 ×2;
- `CLASS-003`: sim, caso único por nível;
- `CLASS-004`: sim, L2 fixa o maior no segundo operando;
- `CLASS-006`: sim, gabarito primeira opção em 5/5 questões frescas;
- `GAP-039`: candidata individual de representação/interação;
- falsa suspeita “target revela resposta”: **REFUTADA** — `pulsarTarget=false`, logo `target` não é destacado pela primitiva.

### N7.02/F85 — Operar com Negativos

- DAG/faixa/prereqs: coerentes;
- escada nominal L1–L5: coerente;
- L4 inclui subtração de negativo e a resolução verbal usa semântica de cancelar dívida;
- L5 possui expressão mista com três operações;
- mastery: 3/3 ×2 e há casos que cruzam zero;
- `CLASS-003`: sim, caso único por nível;
- `CLASS-006`: sim, gabarito primeira opção em 5/5 questões frescas;
- `GAP-040`: candidata individual de representação/resolução frente ao cânone v3.1.

## 11. Estado acumulado após N7

Sem promover hipótese a dívida:

- competências auditadas: **56/90**;
- candidatas individuais: **35**;
- vias individuais: **30 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais: **6** — `CLASS-001` a `CLASS-006`;
- `DECISAO-001/GM.04`: separada, `PENDENTE-DE-DECISÃO-HUMANA`;
- correções executadas pelo Gate B: **0**.

A conta parte de 33 candidatas após N6 e adiciona `GAP-039` e `GAP-040`, ambas CODIGO.

## 12. Governança preservada

Neste lote:

- `main` não foi tocada;
- PR não foi marcado ready;
- auto-merge/merge não foram usados;
- nenhum código funcional foi corrigido;
- nenhum gate foi implementado;
- Gate B′ não foi ativado;
- Gates C–J não foram iniciados;
- Creature Engine/Tamagotchi não foram tocados;
- testes/Matrix/Radar/DAG/sondas não foram enfraquecidos;
- recibos não foram misturados entre SHAs.

## 13. Certificação e parada

O snapshot documental final deste lote deve receber:

- CI `completed/success`;
- Certificação transversal `completed/success` com 9/9 jobs;
- ambos no **mesmo SHA final**.

Os IDs dos runs finais devem ser registrados na Issue #48 após a certificação, sem novo commit.

Depois da certificação:

1. revalidar PR #35 `open + draft + unmerged`;
2. revalidar `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
3. reportar classes separadas de candidatas individuais e por via;
4. propor **AL** como próximo domínio natural;
5. **PARAR**.

Não iniciar AL neste lote.