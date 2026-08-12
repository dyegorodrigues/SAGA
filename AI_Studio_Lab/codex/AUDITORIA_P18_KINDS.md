# Auditoria P18 v2 — declarações reais de KindType

> Esta versão substitui a contagem textual da v1. Fichas TS são lidas pelo AST:
> somente propriedades reais `primitiva:` e `kinds:` contam. Comentários não contam.

## Resultado

| kind | ficha TS real | cânone `Primitiva` | builder | renderer legado | gerador literal | decisão |
|---|---:|---:|---|---:|---:|---|
| `linking-cubes` | 0 | 1 | não | 2 | 0 | DÍVIDA CANÔNICA FUTURA — não há ficha TS atual; retirar do tipo até existir contrato executável |
| `missing-addend-frame` | 0 | 0 | não | 0 | 0 | ÓRFÃO/RESÍDUO — retirar do KindType autoral |
| `multiple_choice` | 0 | 0 | não | 0 | 2 | LEGADO — Question pode usar, mas não pertence ao KindType autoral sem ficha |
| `sentencebuilder` | 0 | 0 | não | 0 | 0 | ÓRFÃO/RESÍDUO — retirar do KindType autoral |
| `sequence` | 0 | 0 | não | 1 | 0 | LEGADO — Question pode usar, mas não pertence ao KindType autoral sem ficha |
| `singaporebars` | 0 | 11 | não | 1 | 0 | DÍVIDA CANÔNICA FUTURA — não há ficha TS atual; retirar do tipo até existir contrato executável |
| `subvis` | 0 | 0 | não | 1 | 2 | LEGADO — Question pode usar, mas não pertence ao KindType autoral sem ficha |
| `take-apart` | 0 | 0 | não | 2 | 1 | LEGADO — Question pode usar, mas não pertence ao KindType autoral sem ficha |
| `visual-addition` | 0 | 1 | não | 2 | 1 | DÍVIDA CANÔNICA FUTURA — não há ficha TS atual; retirar do tipo até existir contrato executável |

## Evidências por kind

### `linking-cubes`

- ficha TS real: nenhuma
- cânone: AI_Studio_Lab/pedagogia/fichas/FICHAS_F1_COMPLETAS.md:244: **Competência:** N3.03 (counting on) · **Primitiva:** `LinkingCubes` + `NumberLine` · **Faixa:** F1 · **Tema:** dojo, espaço
- gerador que emite `Question.kind`: nenhum
- renderer legado: src/components/FichaRenderer.tsx, src/components/gameloop/GameLoopExerciseRenderer.tsx

### `missing-addend-frame`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: nenhum
- renderer legado: nenhum

### `multiple_choice`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: src/curriculum/motores/composerCanary.test.ts:12: const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });; src/curriculum/motores/curriculum.ts:23: kind: "multiple_choice",
- renderer legado: nenhum

### `sentencebuilder`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: nenhum
- renderer legado: nenhum

### `sequence`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: nenhum
- renderer legado: src/components/gameloop/GameLoopExerciseRenderer.tsx

### `singaporebars`

- ficha TS real: nenhuma
- cânone: AI_Studio_Lab/pedagogia/fichas/FICHAS_F1_COMPLETAS.md:1592: **Competência:** PE.01 (pictogramas e tabelas) · **Primitiva:** `SingaporeBars` (modo ícones) · **Faixa:** F1; AI_Studio_Lab/pedagogia/fichas/FICHAS_F2_COMPLETAS.md:813: **Competência:** N5.01 (metade, terço, quarto) · **Primitiva:** `ShapeCanvas` (modo partição) + `SingaporeBars` · **Faixa:** F2; AI_Studio_Lab/pedagogia/fichas/FICHAS_F2_COMPLETAS.md:1677: **Competência:** PE.02 (gráficos de barras; possível/provável) · **Primitiva:** `SingaporeBars` (modo vertical) · **Faixa:** F2; AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:61: **Competência:** N5.02 (fração: parte-todo, coleção e reta) · **Primitiva:** `SingaporeBars` + `InteractiveNumberLine` · **Faixa:** F3; AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:430: **Competência:** PE.03 (média e probabilidade como fração) · **Primitiva:** `SingaporeBars` · **Faixa:** F3; AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:768: **Competência:** N5.03 (equivalência e comparação de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3; AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:820: **Competência:** N5.04 (adição e subtração de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3; AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:242: **Competência:** N6.03 (porcentagem) · **Primitiva:** `Quadrado100` + `SingaporeBars` · **Faixa:** F4; AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:415: **Competência:** N6.04 (razão e proporcionalidade) · **Primitiva:** `SingaporeBars` · **Faixa:** F4; AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:517: **Competência:** AL.07 (linguagem algébrica e generalização) · **Primitiva:** `SingaporeBars` + `plain` · **Faixa:** F4; AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:769: **Competência:** PE.04 (estatística e probabilidade por contagem) · **Primitiva:** `SingaporeBars` + `ArrayGrid` · **Faixa:** F4
- gerador que emite `Question.kind`: nenhum
- renderer legado: src/components/gameloop/GameLoopExerciseRenderer.tsx

### `subvis`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: src/utils/generators.ts:202: kind: "subvis",; src/utils/generators.ts:356: kind: "subvis",
- renderer legado: src/components/gameloop/GameLoopExerciseRenderer.tsx

### `take-apart`

- ficha TS real: nenhuma
- cânone: nenhum
- gerador que emite `Question.kind`: src/utils/generatorsVisual.ts:105: kind: "take-apart",
- renderer legado: src/components/FichaRenderer.tsx, src/components/gameloop/GameLoopExerciseRenderer.tsx

### `visual-addition`

- ficha TS real: nenhuma
- cânone: AI_Studio_Lab/pedagogia/fichas/FICHAS_F1_COMPLETAS.md:67: **Competência:** N3.01 (adição concreta até 10) · **Primitiva:** `VisualAddition` · **Faixa:** F1 · **Temas:** dinos, espaço, esporte
- gerador que emite `Question.kind`: src/utils/generatorsVisual.ts:12: kind: "visual-addition",
- renderer legado: src/components/FichaRenderer.tsx, src/components/gameloop/GameLoopExerciseRenderer.tsx

## Decisão arquitetural

O `KindType` tipa **fichas autorais**, enquanto `Question.kind` é string e continua livre para o legado.
Logo, remover um kind sem ficha TS do `KindType` **não remove o renderer legado** nem quebra saves:
só impede que uma nova ficha autoral compile prometendo um caminho que o Composer não entrega.

A dívida futura deve voltar ao `KindType` no mesmo lote que introduzir contrato, builder, renderer e teste de ficha.
