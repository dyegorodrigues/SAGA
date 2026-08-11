# CHECKPOINT — Retificação W6 — N2.03 / F29

**Data:** 2026-08-11  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 (`open + draft + unmerged`)  
**Checkpoint pai:** `CHECKPOINT_FABRICA_CURRICULAR_W6_N2_03_FECHADA_2026-08-11.md`  
**Natureza:** retificação de conteúdo dentro da W6 fechada; não reabre a onda e não altera Coverage Matrix.

> Este checkpoint só é válido se o CI do mesmo HEAD estiver integralmente verde. GitHub remoto continua sendo a fonte da verdade.

## 1. Origem da retificação

A revisão externa pós-W6 aprovou a sequência regression-first, a arquitetura specialized builder Grupo-backed, a promoção do canário e o ledger, mas contestou duas decisões pedagógicas do contrato F29:

1. L2 mudava simultaneamente a representação (`grupo → numeral`) e a faixa (`10 → 20`), acumulando duas novidades no mesmo degrau;
2. L5 gerava duas decomposições aditivas independentes, podendo exigir cálculo de somas de dois dígitos embora competências de adição N3 não sejam ancestrais de `N2.03` no DAG.

O RT silencioso de L5 em 8 s foi mantido apenas porque a correção abaixo transforma a tarefa em comparação relacional, não cálculo de duas somas.

## 2. Reancoragem antes da edição

Antes da retificação, o remoto confirmou:

- HEAD `a5a697af5ab61de3e104dc8d301709a053f167fb`;
- CI #1084 / run `31538841060`: success, 6/6;
- PR #29 aberto, draft e não mesclado;
- base `main` ainda em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- review threads abertas: 0.

Nenhuma mudança foi feita em `main`, Creature Engine, Thinking Engine ou no DAG.

## 3. Regressões fixadas

A retificação adiciona duas regressões que falham contra o contrato do HEAD pai:

- **L2:** uma semente determinística que antes produzia valores acima de 10 agora exige `max(valor) <= 10`;
- **L5:** uma semente determinística que antes produzia duas decomposições sem parcela compartilhada agora exige que os dois lados compartilhem a primeira ou a segunda parcela, preservando exatamente o valor de cada expressão.

Como a revisão pediu **um único commit de retificação**, teste e correção entram no mesmo commit. Não existe SHA vermelho intermediário remoto; as sementes foram escolhidas para que as novas asserções sejam falsificáveis contra o parent `a5a697af...`, sem afrouxar testes existentes.

## 4. Contrato pedagógico retificado

A progressão vigente de F29 passa a ser:

- **L1:** `grupo × grupo`, valores até 10;
- **L2:** `grupo × numeral`, valores até 10 — muda somente a representação;
- **L3:** `numeral × numeral`, valores até 20 — muda somente a faixa;
- **L4:** `numeral × numeral`, valores até 100;
- **L5:** `expressão × expressão`, valores até 100, com **uma parcela compartilhada na mesma posição**.

Exemplos válidos de L5:

```text
12 + 5   ×   12 + 8
7 + 30   ×   9 + 30
20 + 6   ×   20 + 6
```

A relação entre os valores continua sendo a autoridade de `>`, `<` ou `=`. A estrutura compartilhada permite resolver por pensamento relacional: a criança compara apenas as parcelas que variam, sem exigir domínio prévio de adição de dois dígitos.

## 5. Implementação e proteção

- `comparacaoSimbolicaContract.ts` usa teto 10 até L2, teto 20 no L3 e 100 no L4–L5;
- o L5 gera o par de expressões de forma coordenada, não duas decomposições aleatórias independentes;
- `comparacaoSimbolicaContract.test.ts` fixa as duas regressões;
- a sonda Chrome real recebe os dois lados do spec e também valida:
  - L2 nunca acima de 10;
  - L5 com parcela compartilhada;
  - cada texto de expressão preserva seu valor semântico.

Nenhuma mudança foi necessária em `Grupo`, no renderer, em misconceptions, evidências, learner state, mastery, unlock, recompensa ou topologia do grafo.

## 6. Matrix e escopo

A retificação não troca fonte de runtime nem estreia competência. Portanto a Matrix permanece:

- **31 Composer**;
- **21 legado**;
- **38 fallback**;
- **52 servidas**;
- **16 divergências**;
- **12 swaps**;
- **44 estreias**;
- missing primitive: `Moedas` apenas.

W6 continua fechada após CI verde desta retificação. `N2.02` permanece apenas candidata causal à W7; nenhuma implementação W7 começa neste checkpoint.
