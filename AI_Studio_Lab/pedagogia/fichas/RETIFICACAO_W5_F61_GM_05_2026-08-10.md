# Retificação normativa W5 — F61 / GM.05 / Medir com Régua

**Data:** 2026-08-10  
**Escopo:** F61 / GM.05 somente.  
**Natureza:** retificação canônica de precisão pedagógica, geometria e QA visual.  
**Não cria nova ficha autoral:** o catálogo permanece 90 competências / 94 fichas autorais.

> Para F61/GM.05, este documento prevalece sobre frases históricas conflitantes em `FICHAS_F2_COMPLETAS.md` até a próxima consolidação editorial integral do bloco F2. Runtime, DAG e ficha runtime são as fontes executáveis; divergência exige correção, não adaptação silenciosa do gate.

## 1. Pré-requisitos vigentes

O DAG vigente de GM.05 é:

- `GM.12` — comparação/ordenação de grandezas;
- `N2.02` — leitura/escrita de números de dois dígitos.

**N2.04 (centena) não é pré-requisito de GM.05.** A frase histórica que o exigia por causa de “cm até 100/conversão para metros” não descreve a progressão implementada da F61 e não deve bloquear a criança artificialmente.

Nenhum ID, aresta ou topologia do Curriculum Graph foi alterado por esta retificação.

## 2. Progressão F61 vigente

- **L1 — medida informal:** medir um objeto com **bolas de treino iguais**, colocadas uma encostada na outra, sem gap e sem sobreposição;
- **L2 — leitura:** régua já alinhada; ler comprimento em **centímetros inteiros**;
- **L3 — alinhamento:** mover a régua, fazer a marca **0** coincidir com a ponta inicial e então ler a marca inteira do fim;
- **L4 — comparação:** medir dois objetos visualmente distintos e comparar os comprimentos;
- **L5 — estimar → medir → unidade:** estimativa inteira em cm, alinhamento e conferência.

A F61 atual **não ensina meia unidade/0,5 cm**. Marcas ou respostas `0,5` pertencem a uma progressão posterior e não devem aparecer como ruído visual nesta ficha.

## 3. Unidade informal — contrato visual

Não usar emoji/sprite como unidade de medida quando a caixa tipográfica não coincide com o contorno visível.

A unidade informal da W5 é uma **bola de treino desenhada proceduralmente**:

- diâmetro físico constante;
- nenhuma margem/gap entre unidades;
- unidades tangentes, sem overlap;
- `N` bolas ocupam exatamente `N × diâmetro`;
- a fileira começa exatamente na ponta inicial do objeto e termina exatamente na ponta final;
- a mesma geometria é verificável no navegador real.

O objetivo pedagógico é tornar visível a ideia “unidades iguais repetidas ponta a ponta”. O tema é cosmético; a geometria é normativa.

## 4. Objetos de medida — contrato de plausibilidade

Não usar objetos de **proporção rígida** esticados horizontalmente para fabricar um comprimento. Isso produz caricaturas (por exemplo, um carrinho virando uma limusine) e ensina uma mentira visual.

Famílias permitidas na W5 são objetos cuja dimensão longitudinal pode variar de forma plausível:

- lápis;
- pincel;
- giz de cera;
- marcador;
- fita de treino.

Cada arte é procedural: pontas/caps têm tamanho fixo e apenas o corpo longitudinal cresce. Não há emoji ou sprite com whitespace invisível determinando a medida.

## 5. Invariante geométrico da régua

Quando alinhada:

1. **ponta visível inicial do objeto = tick 0**;
2. **ponta visível final do objeto = tick inteiro da resposta correta**;
3. o comprimento visual não é inferido apenas pela caixa/container;
4. borda, padding, ring ou decoração da régua não podem deslocar o sistema de coordenadas;
5. a sobra física após a última marca serve apenas para conter o último rótulo e não altera `unitPx`;
6. no L4, os dois objetos obedecem ao mesmo contrato individualmente.

O bug encontrado na W5 mostrou por que esta regra é necessária: uma borda CSS de 2 px deslocava o tick 0 para dentro apesar de o contêiner parecer alinhado.

## 6. Motor e diagnóstico

- drag e alternativa por toque são equivalentes para demonstrar compreensão;
- snap generoso perto do zero resolve intenção motora correta;
- soltura imprecisa sem marca deliberada não vira misconception;
- marca 1 deliberadamente alinhada pode gerar `COMECA_NO_UM`;
- evidência `ALINHOU_ZERO` só nasce quando a criança efetivamente alinha, nunca por tutorial automático;
- `pointercancel` não publica tentativa.

## 7. QA visual obrigatório

A sonda `npm run sonda:regua` é gate permanente e deve verificar em Chrome real:

- 320 / 390 / 900 px;
- L1–L5;
- ausência de overflow;
- apenas ticks/rótulos inteiros na progressão atual;
- rótulo final dentro da madeira;
- L1 com unidades tangentes e mesma extensão total do objeto;
- extremos **visíveis** das artes contra os ticks reais, não apenas container;
- L4 com dois tipos de objeto distintos e comprimentos distintos;
- tap de alinhamento;
- drag real;
- estimar → alinhar → medir → unidade;
- screenshots de todos os níveis/larguras no artifact.

**CI verde sem qualidade visual verificável não basta para fechar uma primitive geométrica infantil.**

## 8. Incidente visual W5 registrado

A primeira versão funcional da F61 passou gates que eram insuficientes para qualidade de produto. A revisão visual encontrou, em sequência:

- objeto representado por cápsula genérica com emoji dentro;
- carrinho artificialmente alongado;
- borracha repetida no L4;
- rótulo `12` vazando da régua;
- unidade informal baseada em emoji de clipe inclinado, com whitespace e sem contato geométrico confiável;
- meias marcas de `0,5 cm` aparecendo sem pertencer à progressão;
- teste que validava a caixa do objeto, não sua silhueta visível;
- tick 0 deslocado pela borda CSS da régua.

Esses achados não são tratados como “cosmética”. Foram convertidos em invariantes executáveis e devem permanecer como regressões bloqueadoras.

## 9. Critério de fechamento

F61/GM.05 só pode ser declarada fechada quando o **mesmo HEAD** comprovar:

- auditorias curriculares verdes;
- TypeScript verde;
- suíte completa verde;
- build + `pr:check` verdes;
- Sensei/Matrícula verde;
- F19 verde;
- F61 verde em Chrome real sob os contratos acima;
- Coverage Matrix coerente com o ledger W5;
- PR #29 continua open + draft + unmerged;
- main e Creature Engine permanecem intocados.
