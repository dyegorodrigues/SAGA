# GATE B — LOTE 5 · Mega-auditoria de microprogressão N5

**Data:** 2026-08-19  
**Modo:** AUDIT-ONLY  
**Escopo curricular:** somente domínio `N5` (`N5.01`–`N5.05`)  
**Autoridade:** Issue #47 §0.2/§3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhum achado deste documento autoriza correção de código, runtime, Matrix, canário, DAG, implementação de gates ou ativação do Gate B′.

## 0. Âncora e método

A auditoria foi aberta a partir do HEAD remoto `4a2ad53ca31008bce66e25730b3bf37b6d11e395`, com PR #35 **open + draft + unmerged**, sem reviews/threads, e `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.

O HEAD de entrada já possuía recibos próprios do Lote 4:

- CI `32254266799` — completed/success;
- Certificação transversal `32254266804` — completed/success 9/9.

Foram revalidados no HEAD:

- Issue #47 §0.2/§3 e Issue #48;
- `curriculum/N5.yaml`;
- `src/curriculum/grafo_saga.ts` e `src/utils/grafoSaga.ts`;
- `src/curriculum/motores/unlockEngine.ts`, `composerCanaryIds.ts` e `progressEngine.ts`;
- fichas TS vivas `N5.01.ts`–`N5.05.ts`;
- contratos especializados `partesIguaisContract.ts`, `fracaoNumeroContract.ts`, `fracaoEquivalenteContract.ts`, `somaFracoesContract.ts` e `multiplicarFracoesContract.ts`;
- fichas canônicas F45, F72, F73, F74 e F86;
- documentação/gates dos Lotes 1–4 apenas como contexto já revalidado.

Documentos antigos não foram usados como estado atual sem confirmação na fonte viva.

### 0.1 Disciplina de evidência

Achado individual curricular:

- nasce `CANDIDATA` na Issue #48;
- recebe classe §0.2, normalmente `HIPÓTESE-A-PROVAR`;
- recebe via `CODIGO`, `SIMULACAO` ou `CRIANCA` conforme a evidência mínima necessária para encerrar/refutar;
- não é corrigido no mesmo lote audit-only.

Achado estrutural repetido é registrado como `ACHADO-DE-CLASSE`; não se cria um GAP por competência quando a causa já pertence à classe.

---

## 1. Revalidação pré-N5 — conformance ficha↔DAG

Antes da auditoria curricular de N5, a verificação externa do Lote 4 foi revalidada e registrada na Issue #48 no comentário `5342994164`.

### 1.1 Unlock: refutação de liberação precoce confirmada

`src/curriculum/motores/unlockEngine.ts`:

- importa `GrafoSaga` de `src/utils/grafoSaga.ts`;
- percorre `GrafoSaga.nodes`;
- testa diretamente `node.prereqs`.

`src/utils/grafoSaga.ts` define `GrafoSaga.nodes = grafoSaga`, importado de `src/curriculum/grafo_saga.ts`.

Logo, `FichaCompetencia.prereqs` **não participa do desbloqueio**. A hipótese de que prereqs reduzidos nas fichas liberariam conteúdo cedo fica **refutada no HEAD atual**.

### 1.2 CLASS-002 — conformance ficha↔DAG fechada para descoberta

**Estado operacional:** `FECHADA PARA DESCOBERTA / INVENTÁRIO REGISTRADO`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Reparada?:** NÃO  
**Gate implementado?:** NÃO

A varredura externa informou dez divergências de **campo** e os dez campos nominados foram confirmados individualmente na fonte.

Há uma correção aritmética necessária: `GM.04` responde por **duas** dessas dez divergências (`prereqs` e `faixa`). Como `GM.04` é isolada por ser contradição pedagógica, a classe simples possui **8 casos**, não 9.

Casos absorvidos:

| ID | Campo | Ficha | DAG | Estado |
|---|---|---|---|---|
| N3.10 | prereqs | `[N3.03]` | `[N3.03, N3.04]` | subconjunto; absorve GAP-026 |
| N4.03 | prereqs | `[N4.01]` | `[N4.01, AL.03]` | subconjunto |
| N4.06 | prereqs | `[N4.03]` | `[N4.03, N4.05]` | subconjunto |
| N4.07 | prereqs | `[N4.04]` | `[N4.04, N4.06]` | subconjunto |
| N4.08 | prereqs | `[N4.07]` | `[N4.07, N2.04, N3.11]` | subconjunto |
| N1.08 | faixa | `F1` | `F0` | divergência; absorve parte de GAP-007 |
| N1.12 | faixa | `F0/F1` | `F1` | divergência; absorve parte de GAP-007 |
| N2.07 | faixa | `F2` | `F3` | divergência; absorve GAP-021 |

`GAP-007`, `GAP-021` e `GAP-026` deixam de existir como candidatas independentes por **reclassificação/absorção**, não por correção de código.

A classe fica fechada **para descoberta**, pois o inventário global foi reconciliado; ela não deve crescer nos lotes restantes salvo nova deriva de fonte em SHA posterior.

#### Teste proposto — NÃO IMPLEMENTADO

Futura frente autorizada pode criar teste de conformance que:

1. itere fichas de Jornada com ID no DAG;
2. compare conjuntos normalizados de `prereqs` por igualdade exata;
3. compare `faixa` segundo política explicitamente decidida, sem normalizar `F0/F1` silenciosamente;
4. falhe com `ID · campo · ficha · DAG`;
5. não permita allowlist sem rationale/decisão registrada;
6. não transforme `GM.04` em baseline antes da decisão humana.

Nenhum teste/gate foi implementado neste lote.

### 1.3 DECISAO-001 — GM.04 fora da CLASS-002

**Estado:** `PENDENTE-DE-DECISÃO-HUMANA`  
**Fato de fonte / classe §0.2:** `CONFIRMADO-ATUAL`  
**Via técnica posterior:** `CODIGO`, bloqueada por decisão humana prévia

Contradição viva:

- ficha GM.04: faixa `F2`, prereqs `[N2.01, AL.01]`;
- DAG: faixa `F1`, prereqs `[N1.06]`;
- prereqs são **disjuntos**, sem interseção;
- também há divergência de faixa.

Isso não é simples higiene de metadata. São duas teses pedagógicas diferentes sobre **quando Relógio: Horas e Minutos pode ser ensinado**.

Pergunta preservada para decisão humana futura: GM.04 deve entrar após numeral (`N1.06`, F1), após valor posicional + classificação (`N2.01 + AL.01`, F2), ou sob terceira formulação explicitamente justificada?

Nenhum lado foi escolhido.

---

## 2. Resultado executivo N5

- competências N5 auditadas: **5/5**;
- proveniência: **5 Composer / 0 legado / 0 fallback**;
- `CLASS-003` revalidada e ampliada com **N5.04/F74 + N5.05/F86**;
- candidatas N5 novas: **3** — `GAP-033`–`GAP-035`;
- classe das três: **`HIPÓTESE-A-PROVAR`**;
- vias das três: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- correções executadas: **0**.

Composer ativo confirmado para `N5.01`, `N5.02`, `N5.03`, `N5.04`, `N5.05` em `composerCanaryIds.ts`.

---

## 3. Achado de classe revalidado em N5

### CLASS-003 — caso único por nível sob mastery repetida

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

O padrão do Lote 4 alcança mais dois contratos especializados:

- `N5.04 / F74` — `somaFracoesContract.ts` possui array `CASOS` com exatamente um cenário por nível:
  - L1 `1/4 + 2/4`;
  - L2 `2/5 + 1/5`;
  - L3 `5/7 − 2/7`;
  - L4 `3/4 + 2/4`;
  - L5 `2/8 + 2/8`, simplificando para `1/2`.
- `N5.05 / F86` — `multiplicarFracoesContract.ts` devolve exatamente um cenário por nível:
  - L1 `1/2 × 8`;
  - L2 `2/3 × 12`;
  - L3 `1/2 × 3/4`;
  - L4 `2/3 × 3/5`;
  - L5 `2 ÷ 1/4`.

Ambas usam mastery repetida 3/3 ×2 sem família alternativa de itens dentro do nível. A classe passa a conter, no mínimo:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- N5.04/F74;
- N5.05/F86.

Essa ampliação **não** cria GAPs individuais para N5.04/N5.05: a causa já é a mesma classe.

---

## 4. Auditoria competência por competência

### N5.01 — Metade, Terço e Quarto / partes iguais

- **Conceito/faixa:** fração unitária nasce de equipartição; `F2`.
- **Pré-requisito:** N4.05, coerente ficha↔DAG.
- **CPA/representação:** reconhecer igualdade de partes → sobrepor → nomear → produzir partição → símbolo.
- **L1–L5:** escada observável, com mudança de círculo para barra e retirada progressiva do apoio.
- **Diversidade:** denominadores 2/3/4 são sorteados; L1 alterna partições iguais/desiguais; L4 exige produção.
- **Mastery:** 3/3 ×2; evidência `PARTES_IGUAIS_DIVISAO` é acumulável e protege a exigência de produção real.
- **Motor:** L4 possui toque alternativo; precisão motora não é conceito.
- **Onboarding/resolução:** tutorial explicita comparar tamanho antes de contar; resolução reconstrói igualdade e nome da parte.
- **Transferência:** sustenta N5.02 e a leitura de fração como número.
- **Resultado:** nenhuma CANDIDATA nova.

### N5.02 — A Fração é um Número

- **Conceito/faixa:** parte-todo, coleção e posição na reta; `F3`.
- **Pré-requisitos:** N5.01 + N4.05, coerentes ficha↔DAG.
- **CPA/representação:** barra → coleção → reta completa → reta parcial → reta até 2.
- **L1:** denominadores 2/3/4 e numeradores próprios variados.
- **L2:** coleção de 12 com numeradores 3/4/6/8/9.
- **L3:** reta completa, denominadores 3/4/5 e numeradores próprios variados.
- **L4:** runtime fixa denominador `4` e só sorteia numerador `1` ou `3`: portanto os únicos alvos são `1/4` e `3/4`.
- **L5:** frações impróprias com denominadores 3/4 e numerador `d+1` ou `d+2`.
- **Mastery:** 3/3 ×2; evidência de reta existe, mas não exige diversidade de denominadores no L4.
- **Resultado:** **GAP-033**.

#### GAP-033 — N5.02 L4 reduz “reta parcial/estimar” a 1/4 ou 3/4

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `VARIEDADE-DE-MASTERY`, `TRANSFERÊNCIA-AUSENTE`  
**Via:** `CODIGO`

A ficha/cânone define L4 como localizar/estimar fração numa reta em que apenas `0`, `1/2` e `1` ficam nomeados. O builder vivo usa somente quartos (`1/4` ou `3/4`), ambos exatamente no meio de um dos dois intervalos visíveis.

Hipótese: a criança pode dominar o caso “escolher o ponto médio entre âncoras” sem demonstrar generalização da fração como posição em reta parcialmente marcada.

Provar/refutar: enumerar o espaço de itens L4 e decidir qual diversidade mínima de denominadores/posições a competência exige; nenhuma expansão foi implementada.

### N5.03 — Frações Equivalentes e comparação

- **Conceito/faixa:** equivalência como mesma quantidade com outro nome; comparação pelo espaço ocupado; `F3`.
- **Pré-requisito:** N5.02.
- **L1/L2:** três famílias equivalentes possíveis; sobreposição sai no L2.
- **L3:** mesmo denominador; builder sempre constrói `1/d` à esquerda e `(d−1)/d` à direita, portanto **a direita é sempre maior**.
- **L4:** mesmo numerador; builder sempre coloca o denominador menor à esquerda, portanto **a esquerda é sempre maior**.
- **L5:** três pares de denominadores diferentes; dois produzem esquerda maior, um direita maior; não há permutação de lados.
- **Mastery:** 3/3 ×2; evidência `FRACAO_MESMO_NUMERADOR` não distingue entendimento de uma heurística posicional que acerte o caso do nível.
- **Resultado:** **GAP-034** e participação na ponte sistêmica `GAP-035`.

#### GAP-034 — N5.03 permite heurística de lado por nível

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `VARIEDADE-DE-MASTERY`, `OUTRO — viés posicional de gabarito`  
**Via:** `CODIGO`

No L3, “direita” é sempre a resposta correta. No L4, “esquerda” é sempre a resposta correta. No L5, a distribuição continua enviesada e os pares nunca trocam de lado.

Como a progressão conceitual sobe após sequência de acertos e a evidência é emitida sobre acerto no caso apresentado, a fonte não prova que o aluno comparou as frações em vez de memorizar a posição do maior naquele nível.

Provar/refutar: permutar lados em teste/enumeração e exigir invariância do diagnóstico/mastery; nenhuma mudança foi feita.

### N5.04 — Somar Frações

- **Conceito/faixa:** somar/subtrair partes do mesmo tamanho mantendo denominador; `F3`.
- **Pré-requisito:** N5.03.
- **Cânone:** explicita regra dura de **mesmo denominador nesta ficha** e diz que denominador diferente “exige equivalência (N5.03) antes”.
- **L1–L5:** barras → soma simbólica → subtração → resultado impróprio → simplificação.
- **Runtime:** `denominadoresIguais: true` em todos os níveis; nenhum cenário transforma duas frações de denominadores diferentes em equivalentes com denominador comum antes de operar.
- **Diversidade intranível:** caso único por nível; absorvido por `CLASS-003`.
- **Transferência:** a dependência N5.03 existe no DAG, mas a execução N5.04 não exige aplicar a equivalência aprendida para tornar denominadores compatíveis.
- **Resultado:** `CLASS-003` + **GAP-035**.

#### GAP-035 — N5.03→N5.04 não exercita equivalência para operar denominadores diferentes

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `TRANSFERÊNCIA-AUSENTE`, `MICRONÍVEL-AUSENTE`  
**Via:** `CODIGO`

F73/N5.03 ensina equivalência e chega a comparar denominadores diferentes. F74/N5.04 declara N5.03 como prerequisito e o próprio cânone diz que denominador diferente exige equivalência antes. Porém o contrato executável de N5.04 restringe **todos** os níveis a denominadores iguais, e não foi encontrado outro nó N5 que execute a ponte “reescrever como equivalentes → somar/subtrair”.

A hipótese é sistêmica: conhecer equivalência como pré-requisito não prova transferência para operação. O Gate B §3 exige verificar transferência entre competências vizinhas.

Provar/refutar: inventariar toda entrega executável de operação de frações e demonstrar onde uma criança precisa converter denominadores antes de somar/subtrair; se não existir, decidir o micronível/ponte apropriado. Nada foi criado neste lote.

### N5.05 — Multiplicar Frações

- **Conceito/faixa:** ler multiplicação por fração como “de”, usar interseção de áreas e interpretar divisão como quantas partes cabem; `F4`.
- **Pré-requisitos:** N5.04 + N6.04, coerentes ficha↔DAG.
- **L1:** fração × inteiro (`1/2 × 8`).
- **L2:** fração × inteiro com modelo (`2/3 × 12`).
- **L3:** fração × fração por área (`1/2 × 3/4`) com evidência específica.
- **L4:** multiplicação simbólica (`2/3 × 3/5`) e simplificação.
- **L5:** divisão de frações como medida (`2 ÷ 1/4`).
- **Cânone F86:** os cinco níveis observados coincidem com a escada declarada, inclusive o exemplo de divisão “quantos 1/4 cabem em 2?”.
- **Diversidade intranível:** um caso determinístico por nível; absorvido por `CLASS-003`.
- **Motor/acessibilidade:** contrato declara toque alternativo, sem arrasto obrigatório, alvo mínimo e erro motor sem tag conceitual.
- **Resultado:** `CLASS-003`; nenhuma CANDIDATA individual adicional.

---

## 5. Achados recusados / falsos positivos

### 5.1 “N5.01 exige evidência L4 enquanto a coroa ocorre no L5” — REFUTADO

`progressEngine.ts` acumula `evidenciasVistas` entre níveis e só avalia coroa multidimensional no nível 5. Logo evidência produzida no L4 pode legitimamente satisfazer a exigência final; não é necessário repetir a ação motora no L5.

### 5.2 “N5.05 deveria ensinar algoritmo geral inverter-e-multiplicar” — NÃO ABERTO

O cânone F86 observado define explicitamente L5 como divisão de frações no significado de medida, com o exemplo “quantos 1/4 cabem em 2?”. O runtime materializa exatamente esse contrato. Não foi usada expectativa externa para ampliar o escopo canônico.

### 5.3 “N5.04 viola a ficha por usar só denominadores iguais” — REFUTADO COMO VIOLAÇÃO LOCAL

A própria F74 determina que esta ficha opere apenas denominadores iguais. O achado `GAP-035` é diferente: trata da **transferência sistêmica ausente** entre equivalência e operação, não de descumprimento local de F74.

---

## 6. Resumo por classe e por via

### Classes / achados não individuais

- `CLASS-001` — permanece `CONFIRMADO-ATUAL`, via `CODIGO`; não reaberta neste lote.
- `CLASS-002` — inventário ficha↔DAG **FECHADO PARA DESCOBERTA**, `CONFIRMADO-ATUAL`, via `CODIGO`; 8 casos simples; gate proposto não implementado.
- `DECISAO-001 / GM.04` — contradição pedagógica `CONFIRMADO-ATUAL`, pendente de decisão humana; via técnica posterior `CODIGO`.
- `CLASS-003` — `CONFIRMADO-ATUAL`, via `CODIGO`; ampliada de 3 para **5 competências** com N5.04 e N5.05.

### Individuais N5

| ID | Competência | Síntese | Classe §0.2 | Via |
|---|---|---|---|---|
| GAP-033 | N5.02 | L4 de reta parcial só usa 1/4 ou 3/4 | HIPÓTESE-A-PROVAR | CODIGO |
| GAP-034 | N5.03 | direção do maior é fixa por nível / viés de lado | HIPÓTESE-A-PROVAR | CODIGO |
| GAP-035 | N5.03→N5.04 | equivalência não é aplicada para operar denominadores diferentes | HIPÓTESE-A-PROVAR | CODIGO |

**Totais do Lote 5:** 3 candidatas; **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**.

---

## 7. Estado acumulado após N5

Competências auditadas: **50/90**.

Antes da reclassificação pré-N5 havia 31 candidatas individuais. A absorção de `GAP-007`, `GAP-021` e `GAP-026` por `CLASS-002` reduz o conjunto a 28. As três novas candidatas N5 levam o total novamente a **31 candidatas individuais**.

Vias individuais acumuladas:

- **26 CODIGO**;
- **1 SIMULACAO**;
- **4 CRIANCA**.

Achados estruturais de classe: `CLASS-001`, `CLASS-002`, `CLASS-003`. `DECISAO-001/GM.04` fica separada porque requer julgamento pedagógico humano.

Correções executadas pelo Gate B: **0**.

---

## 8. Governança e parada

Este lote é exclusivamente audit-only.

Não foi feito:

- correção de código;
- alteração de runtime, Matrix, canário ou DAG;
- implementação de teste/gate de `lvl`;
- implementação do teste ficha↔DAG;
- ativação do Gate B′;
- início de Gates C–J;
- alteração de `main`;
- ready/automerge/merge;
- trabalho em Creature Engine/Tamagotchi.

O snapshot documental deste lote deve possuir **CI success + Certificação transversal success 9/9 no mesmo SHA**.

Depois dos dois recibos:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
3. reportar classes separadas dos individuais;
4. reportar N5 por classe e por via;
5. mencionar N6 apenas como próximo domínio natural, sem iniciá-lo;
6. **PARAR**.

N6 **não foi iniciado**.