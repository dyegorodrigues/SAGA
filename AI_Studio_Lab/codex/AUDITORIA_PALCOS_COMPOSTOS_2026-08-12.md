# Auditoria de palcos compostos — 12/08/2026

## Status

**Pré-condição de fechamento da W10.** Esta auditoria não fecha a W10 por si só: o fechamento continua condicionado a CI integralmente verde no **HEAD exato** que contém este registro e o ledger reconciliado.

## Gatilho

A promoção da W10 `N3.03/F14` revelou que a Coverage Matrix via `counting-on-f14` apenas como `LinkingCubes`, embora `CountingOnStage` já compusesse `LinkingCubes + NumberLine`. A primeira correção resolveu N3.03, mas a varredura subsequente mostrou que a classe de cegueira era mais ampla: palcos compostos podem entregar mais de uma primitiva canônica e o observador não pode reduzir a entrega à primeira entrada do mapa.

Também foi detectada uma regressão documental no commit `6b9576ae1bd1c7b92ae217fc0da21980a2f2d172`: a reformatação de `ficha_runtime_map.cjs` havia removido a regra que impedia inferências silenciosas.

## Regra restaurada

`AI_Studio_Lab/tools/ficha_runtime_map.cjs` volta a declarar explicitamente:

- uma linha por **primitiva canônica** da ficha;
- helpers físicos com outro nome ficam em `componentFiles`/`note`, sem virar primitiva canônica por conveniência;
- quando um mesmo Stage compõe duas ou mais primitivas canônicas, o mesmo `rendererKind` aparece nas linhas de todas elas;
- o observador deve **unir** essas entradas — a convenção de “segunda entrada por composição”;
- **arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas**;
- mapa nenhum pode fabricar builder, renderer, alias ou primitiva apenas para deixar a Matrix verde.

A regra agora tem gate executável em `AI_Studio_Lab/tools/composite_stage_auditor.cjs`, incluído em `npm run auditar`.

## Varredura de palcos compostos

O gate prova por código fonte e pelo mapa as seguintes composições:

| kind | Stage | primitivas observáveis |
|---|---|---|
| `counting-on-f14` | `CountingOnStage` | `LinkingCubes + NumberLine` |
| `material-dourado` | `MaterialDouradoStage` | `MaterialDourado + TenFrame` |
| `medidas` | `MedidasStage` | `Balanca + Recipientes` |
| `story-bars` | `StoryBarsStage` | `StoryPanel + SingaporeBars` |
| `vertical` | `VerticalPlaceValueStage` | `InteractiveVertical + MaterialDourado` |
| `tabuada` | `TabuadaStage` | `ArrayGrid + Quadrado100 + NumberLine` |

### Alias físico — não nova primitiva

`TabuadaStage`, `DecomposicaoStage` e `AncoraStage` usam o componente `Arranjo`. No cânone, porém, essa linguagem é `ArrayGrid`. Portanto:

- `Arranjo` é evidência física da realização de `ArrayGrid`;
- `Arranjo` **não** recebe uma linha própria em `FICHA_RUNTIME_MAP`;
- promover `Arranjo` a primitiva apenas para satisfazer auditoria seria maquiar o vocabulário canônico.

### Helper de cena — não nova primitiva

`DeslocamentoStage` usa `PromocaoDeOrdem`, mas a ficha não o declara como primitiva. O novo gate trava a classificação: `PromocaoDeOrdem` continua helper da cena e não pode ser promovido a primitiva canônica para fabricar cobertura.

## Evidência do CI #1191

SHA auditado: `d64a6ad02da6c1800ef1c54ab4fe145f2951df9b`.

O novo `composite_stage_auditor.cjs` passou e imprimiu as seis composições acima antes da Coverage Matrix executar.

A Matrix então reobservou:

- Composer: **35**;
- legado: **17**;
- fallback: **38**;
- servidas: **52**;
- divergências ficha↔screen: **13**.

Baseline pós-W9 anterior à W10: `34 / 18 / 38 / 52 / 15`.

## Reconciliação dos deltas

Dois fatos diferentes explicam o movimento `15 → 13` e ficam separados no ledger:

1. **W10 `N3.03/F14` — mudança curricular real**
   - delta: `{ composer: +1, legacy: -1, divergences: -1 }`;
   - N3.03 saiu do legado para o Composer e sua entrega `LinkingCubes + NumberLine` passou a corresponder à ficha.

2. **OBS-COMPOSITE-N4.03 — mudança somente de observabilidade**
   - delta: `{ divergences: -1 }`;
   - `TabuadaStage` já renderizava `Arranjo`/`ArrayGrid`, `Quadrado100` e `NumberLine` antes desta auditoria;
   - não houve alteração de runtime pedagógico de N4.03;
   - a divergência de N4.03 era falsa porque o observador registrava apenas `ArrayGrid` e perdia `Quadrado100`.

Snapshot histórico P21.1 permanece imutável.

## Integridade do HEAD anterior

O CI #1190 do SHA `dc63d08446771a045d4d0ba1607f22dcb9c764e1` falhou porque aquele commit continha um `coverage_matrix.ts` incompatível que importava `coverage_matrix_ficha_parser.ts`, arquivo inexistente no próprio commit. O reparo `d64a6ad...` restaurou o `coverage_matrix.ts` íntegro antes desta reconciliação; não foi feito rerun cosmético do SHA quebrado.

## Remote-first dos rascunhos seguintes

Os rascunhos preliminares de W11 e W12 foram persistidos remotamente na scratch branch `codex/w11-w12-drafts`, marcada como não executável e fora do PR #35:

- `AI_Studio_Lab/codex/drafts/W11_AL03_F30_DRAFT.md`;
- `AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md`.

Eles não autorizam ativação, não são fonte de verdade e precisam ser reancorados quando cada onda abrir.

## Critério de saída

W10 só pode receber checkpoint de fechamento depois que o **HEAD exato posterior a esta auditoria e ao ledger reconciliado** passar integralmente todos os jobs do CI. Verde de SHA anterior não vale por procuração.
