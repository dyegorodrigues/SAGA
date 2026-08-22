# Checkpoint — Seleção causal da W7

**Data:** 11/08/2026  
**Status:** W7 SELECIONADA · IMPLEMENTAÇÃO NÃO INICIADA  
**Alvo:** `N2.02 / F36 — Números até 100`  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — draft  
**Escopo deste commit:** decisão causal e arquitetura de entrada; nenhuma ativação de currículo.

> Este checkpoint fixa a primeira onda somente depois do merge seguro do PR #29 e do fechamento do Bloco 0. GitHub remoto, gates executáveis, Matrix derivada e DAG vigente vencem este texto se houver deriva.

## 1. Âncora pós-W6

Estado usado para selecionar:

- `main` consolidada pelo merge commit `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
- nova linha `codex/fechamento-curricular` em PR #35 draft;
- reparo de flake F19 isolado em `102699fb`, sem alteração de runtime;
- CI `main` #1086 / run `31550459281`, attempt 2: Gates `success`;
- Matrix sem delta curricular desde W6: **31 Composer / 21 legado / 38 fallback / 52 servidas / 16 divergências / 12 swaps / 44 estreias**;
- blocker de primitive física continua `Moedas`; `Quadrado100` existe fisicamente, mas o runtime map o classifica como **componente isolado**, com `builderKinds: []` e `rendererKinds: []`;
- `N2.01` já está em Padrão Ouro e é o único pré-requisito direto de `N2.02`;
- `N2.03`, dependente direto de `N2.02`, já foi materializado na W6, de modo que fechar N2.02 também remove uma base legada sob um nó downstream já autoral.

## 2. Recalculo do DAG — 21 legados restantes

Contagem transitiva derivada de `curriculum/grafo_saga.yaml`, sem incluir o próprio nó:

| ordem | competência | descendentes |
|---:|---|---:|
| 1 | `N2.02` | **45** |
| 2 | `N3.01` | **44** |
| 3 | `N3.03` | **36** |
| 4 | `AL.03` | **34** |
| 5 | `N3.02` | **33** |
| 6 | `N4.01` | **31** |
| 7 | `N3.07` | 24 |
| 8 | `N4.05` | 23 |
| 9 | `N3.11` | 18 |
| 10 | `N3.04` | 17 |
| 11 | `N2.04` | 13 |
| 12 | `N3.08` | 10 |
| 13 | `N3.12` | 9 |
| 14 | `N4.02` | 5 |
| 15 | `N3.05` | 4 |
| 16 | `PE.01` | 3 |
| 17 | `N3.13` | 2 |
| 18 | `GM.04` | 1 |
| 19 | `N3.06` | 0 |
| 20 | `GM.03` | 0 |
| 21 | `N2.05` | 0 |

A retirada de `N2.03` da fila após a W6 faz `N2.02` ocupar o topo absoluto dos legados pendentes.

## 3. Pareto pós-W6

| candidato | downstream | estado Matrix | primitive/runtime | risco principal |
|---|---:|---|---|---|
| `N2.02 / F36` | **45** | legado, sem divergência atual | `Quadrado100` existe, mas isolado; builder+renderer precisam nascer com dono | primeira integração real da primitive; onboarding obrigatório |
| `N3.01 / F13` | **44** | legado, sem divergência atual | `VisualAddition` tem renderer e não tem builder | custo estrutural menor, mas alcance ligeiramente menor e reuso menor |
| `N3.03 / F14` | **36** | legado + divergência | `LinkingCubes` renderer-sem-builder + `NumberLine` | composição mais larga de duas primitives |
| `AL.03 / F30` | **34** | legado + divergência | `InteractiveNumberLine` + `Quadrado100` | depende justamente da integração de Quadrado100 que F36 pode estabelecer primeiro |
| `N3.02 / F15` | **33** | legado + divergência + mode swap | `EmojiRow#riscar` é modo novo | exige degrau explícito §6.36 e precedente de swap |
| `N4.01 / F97` | **31** | legado + divergência | `Grupo` com precedente especializado W2/W6 | barato, mas causalmente inferior aos cinco acima |

## 4. Decisão — W7 = `N2.02 / F36`

A escolha foi confirmada por Matrix + DAG, e não adotada mecanicamente do plano externo.

Motivos cumulativos:

1. é o **maior downstream restante: 45**;
2. seu pré-requisito `N2.01` já foi materializado na W3;
3. é pré-requisito de `N2.03`, já materializado na W6, portanto remove uma fundação legada sob conteúdo autoral ativo;
4. F36 é a dona natural de `Quadrado100`: a própria ficha ensina a estrutura 10×10, o deslocamento `+1` horizontal e `+10` vertical; a primitive não é acessório cosmético;
5. `Quadrado100` é hoje componente isolado e aparece novamente em competências posteriores, especialmente `AL.03` e `N2.04`; pagar sua integração em F36 reduz custo futuro sem criar um dispatch genérico sem semântica;
6. a alternativa `N3.01` tem impacto quase igual, mas `VisualAddition` atende uma família mais estreita e não resolve a dependência estrutural que `AL.03/N2.04` já têm de Quadrado100;
7. a W7 não introduz mudança de prereq, learner state, reward ou contrato público global.

## 5. Contrato pedagógico mínimo de F36

Fonte normativa: `FICHAS_F1_COMPLETAS.md`, F36.

Invariantes que a implementação não pode reduzir ao legado `tens` atual:

- objetivo: **ler, escrever, ordenar e localizar números até 100** percebendo o padrão decimal;
- superfície 10×10 numerada de 1 a 100;
- deslocar uma casa à direita corresponde a `+1`; descer uma linha na mesma coluna corresponde a `+10`;
- a criança precisa tocar/produzir o caminho, não apenas escolher uma alternativa numérica;
- L1: contagem de 1 em 1 com lacunas na mesma linha;
- L2: contagem de 10 em 10 em trajetória vertical;
- L3: contagem de 5 em 5;
- L4: vizinhos `+1`, `-1`, `+10`, `-10` a partir de uma célula válida;
- L5: lacunas espalhadas no quadro para completar;
- a coreografia deve tornar a gramática visual explícita antes de cobrá-la: coluna preserva o algarismo das unidades e mover uma linha altera uma dezena;
- erro de direção não é o mesmo que não perceber padrão nem o mesmo que contar um-a-um; o Radar precisa receber hipóteses distintas apoiadas em ação observável;
- domínio: `3/3 × 2 sessões`, com evidência de pelo menos um acerto em percurso vertical, conforme a ficha;
- onboarding visual é obrigatório porque a Matrix classifica F36 como estreia de `Quadrado100` e o gate §6.36 rejeita novo Padrão Ouro sem tutorial runtime explícito.

## 6. Arquitetura preferida e limite de raio

A implementação deve seguir o padrão comprovado de W3–W6:

1. regressão nominal W7 primeiro;
2. ficha TS `N2.02` com micros e tutorial explícito;
3. `quadrado100Contract` com geração dos cinco níveis;
4. `quadrado100Procedure` para semântica de deslocamento, diagnóstico e evidência de processo;
5. `Quadrado100Stage` composto sobre a primitive visual existente, sem alterar consumidores inexistentes nem prometer genericidade;
6. builder especializado **somente para `N2.02`** em `composerCanary.ts`;
7. kind runtime especializado (`quadrado100-f36` ou equivalente explícito) com renderer próprio;
8. registro da ficha **INATIVO** primeiro;
9. runtime map passa a declarar `N2.02` como owner/builder especializado de `Quadrado100`, sem criar `hundred-chart` genérico morto;
10. suíte + a11y + Chrome real no canário temporário;
11. só depois, promoção declarativa em `composerCanaryIds.ts`;
12. Matrix observa o delta; só então ledger.

### Condição de invalidação

Reabrir a seleção antes de promover se F36 exigir qualquer um destes itens:

- dispatch `hundred-chart` genérico para múltiplas fichas sem contratos delas;
- quebra do contrato público de `Quadrado100` para acomodar a ficha;
- regra global de renderer;
- alteração de learner state, mastery global ou prereqs para acomodar UI;
- onboarding dispensado/afrouxado apenas para deixar o gate verde.

Nesse caso, recalcular novamente Matrix + DAG; `N3.01/F13` é o contrafactual de maior impacto, não uma troca automática.

## 7. Efeito esperado — hipótese, não baseline manual

Se e somente se a promoção W7 for observada pela Matrix:

- Composer: `31 → 32`;
- legado: `21 → 20`;
- fallback: `38`;
- servidas: `52`;
- divergências: `16` (N2.02 não está divergente hoje; a onda troca legado por contrato autoral sem maquiar screen mismatch);
- swaps: sem delta esperado;
- estreias: recalcular no runtime; não editar baseline por previsão.

A presença física de Quadrado100 já existe. O que muda nesta onda é propriedade de runtime/serviço autoral, não a existência do arquivo.

## 8. Próximo passo exato

Criar a regressão W7 que prove simultaneamente:

- rollback continua `legacy` antes da promoção;
- a porta de canário, quando a ficha estiver registrada, precisa entregar um kind especializado Quadrado100;
- os 5 níveis respeitam a escada F36;
- onboarding/tutorial existe;
- ações distinguem deslocamento horizontal/vertical e produzem evidência de percurso, sem usar velocidade como acerto/mastery.

Só então implementar o contrato inativo.
