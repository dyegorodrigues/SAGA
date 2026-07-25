# Análise de Motores Pedagógicos: SAGA vs. IXL Learning

## Introdução
A pedido do usuário, analisamos os *screenshots* do IXL Learning contendo exercícios de Adição Visual, Desconstrução de Números, Contagem Espalhada e Frações.
O IXL adota uma linguagem visual baseada em "cenários emoldurados" (white canvas logic), focando menos na densidade e mais no agrupamento espacial e fidelidade visual ao concreto (ex: cubos conectáveis Unifix). O SAGA focava antes na densidade rápida (usando EmojiRow e NumberLine).

## Diagnóstico: Por que não estavam no SAGA?
1. **Falta de Primitivas Direcionadas**: O SAGA tinha `TenFrame` e `EmojiRow` como primitivas coringas. Faltava:
   - `ScatteredItems` (para treino de rastreamento ocular e pareamento 1-a-1 não linear, como contar estrelas soltas).
   - `VisualAddition` (onde a sentença matemática é acoplada às caixas que contém os conjuntos disjuntos).
   - `LinkingCubes` (cubos de matemática Unifix, cruciais para demonstrar continuidade vs unidade).
2. **Falta de Motores Específicos (Generators)**: O SAGA não tinha lógicas como "Encontre uma maneira diferente de separar o N", pois as missões do SAGA paravam na equação (ex: resolva a+b=?). 
3. **Restrições de Assets (Vector vs Emoji)**: O IXL usa assets proprietários (coala, pássaros, lápis em grade). O SAGA foi projetado em torno de Emojis do OS por velocidade, sacrificando um pouco a consistência visual.

## O Que Faltava na Arquitetura para Suportar Isso?
- **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
- **Evolução do Tipo `Option`**: O SAGA assumia que `Options` (botões de resposta) seriam Texto, Números ou Emojis (ShapeSVG). Adicionamos suporte a `groups` dentro de `Option` para permitir que *o próprio botão seja desenhado como blocos de Unifix cubes* (como pedido no exercício "Which shows 7+1=8?").

## Como os novos componentes se comunicam?
1. `generatorsIXL.ts` contém a lógica matemática pura, isolada. Ele injeta dados (quantos itens, qual o total, que cor).
2. `GameLoop.tsx` (linha 1109+) detecta os novos `kind`s (`visual-addition`, `scattered`, etc) e chama as Primitivas de renderização (`src/components/primitives/`).
3. As Primitivas (ex: `TakeApart.tsx`, `LinkingCubes.tsx`) não têm lógica de resposta; elas só renderizam os React Nodes com animações css de Tailwind e flexbox (com overlap para parecerem encaixadas).
4. `curriculum.ts` expõe a lista para o aplicativo e `subjects/index.ts` joga na aba "Escola" (Matemática).

## Conclusão
A pedagogia SAGA subiu de nível. As interações IXL-like cobrem a lacuna do *método CPA (Concreto-Pictórico-Abstrato)*. Usamos Emojis de alta-qualidade empacotados em Cards Brancos sombreados para emular o design premium limpo do concorrente, mantendo os componentes nativos de React-Tailwind ultra rápidos e sem dependências gráficas pesadas.
