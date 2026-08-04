# Padrão Ouro — como nasce uma competência no SAGA

Trilho único, do zero até o nó servindo criança de verdade. **N3.10 é o exemplar
de referência**: cada passo abaixo aponta para o arquivo real onde ele foi
cumprido, não para um exemplo inventado.

## Por que este documento existe

Restam **46 competências em fallback** (contra 42 com conteúdo próprio). Fazer
as 46 descobrindo o caminho de novo a cada uma é o jeito caro. As armadilhas do
§6 foram encontradas construindo N3.10 — cada uma custou uma rodada de medição, e
cada uma voltaria de graça na competência seguinte se não estivesse escrita.

Este documento é o investimento que torna as 46 restantes baratas.

---

## 1. O trilho, em sete passos

```
  ficha  →  procedimento  →  contrato  →  conteúdo  →  primitiva  →  Composer  →  canário
 (o quê)     (a regra)      (a forma)    (as palavras)  (a tela)    (a ligação)   (a estreia)
```

Cada passo produz algo testável **antes** do próximo começar. Quem pula a ordem
descobre no fim que a tela precisa de um dado que o procedimento não calcula.

### Passo 1 — Ficha: o que a criança precisa aprender

**Produz:** um `FichaCompetencia`.
**Exemplar:** `src/curriculum/fichas/jornada/N3.10.ts`

Declara `id`, `nome`, `strand`, `faixa`, `prereqs`, `howto`, `explain`, os
`distratores` com suas tags, os cinco `niveis` e os `micros`.

**A regra que governa:** a escada dos cinco níveis cresce em **estrutura**, não
em números. N3.10 vai de "juntar sozinho" até "a incógnita muda de lugar" — o
tamanho dos números quase não muda. Escada que só aumenta números é escada falsa:
a criança fica melhor em contar, não em entender.

**Verificado por:** `npm run fichas:auditar`.

### Passo 2 — Procedimento: a regra, pura, sem tela

**Produz:** funções puras, sem React, sem aleatoriedade escondida.
**Exemplar:** `src/curriculum/procedimentos/additiveProcedure.ts`

É onde mora o conhecimento matemático: quais estruturas existem, qual incógnita
cabe em cada nível, como se resolve, o que conta como alternativa plausível.

**A regra que governa:** o procedimento **não sabe que existe tela**. Se ele
menciona pixel, cor ou componente, a camada está errada. Isso é o que permite
testá-lo com 500 amostras em milissegundos.

### Passo 3 — Contrato: o que a tela recebe

**Produz:** tipos que descrevem a cena, e nada além.
**Exemplar:** `src/curriculum/procedimentos/storyBarsContract.ts`

**A regra que governa, e é a mais importante do documento:**

> **A fatia da incógnita não carrega valor.**

Em N3.10 o `BarSlot` desconhecido literalmente não tem campo de valor. Não é
disciplina — é impossibilidade: o componente **não consegue** entregar a
resposta, porque ela não chega até ele. Contrato que confia na boa vontade do
renderizador vaza a resposta no dia em que alguém mexe no componente.

Repare também que `StorySpec` e `SingaporeBarSpec` são **independentes de
propósito**: a história descreve o mundo, a barra descreve a matemática. Um não
deriva do outro.

### Passo 4 — Conteúdo: as palavras que a criança ouve

**Produz:** narrativa, objetos, falas.
**Exemplar:** `src/curriculum/procedimentos/additiveNarrative.ts`

**A regra que governa:** os trechos da história são derivados **da posição da
incógnita**, nunca de posições fixas. Ver armadilha 6.1 — foi assim que todo o
nível 5 quase estreou entregando a resposta.

Português de verdade: concordância de gênero e número ("Quantas estrelas",
"Quantos dinos", "1 estrela" e não "1 estrelas"). Criança de 6 anos ouve, não lê
— erro de concordância soa errado antes de parecer errado.

### Passo 5 — Primitiva: a tela

**Produz:** componentes React, um por responsabilidade.
**Exemplar:** `StoryPanelStage.tsx`, `SingaporeBarsStage.tsx`, `StoryBarsStage.tsx`

Três componentes, não um: o painel narra, a barra modela, o terceiro compõe. Um
componente monolítico impede testar a barra sem a história.

**A regra que governa:** toda parte que a pergunta interroga precisa **anunciar
seu papel** — no texto e no rótulo de acessibilidade. Ver armadilha 6.4.

**Verificado por:** teste de componente + `axe-core` (WCAG 2 A/AA) + verificação
de que a tela renderizada não fala o número pedido.

### Passo 6 — Composer: ligar sem quebrar o resto

**Produz:** um `case` no `Composer.ts` que traduz a primitiva declarada na ficha
para o `kind` de runtime.

**A regra que governa:** o Composer **rejeita e sorteia de novo** quando a
questão gerada é ambígua — por exemplo, quando a resposta coincide com um número
visível na cena. Ver armadilha 6.2.

### Passo 7 — Canário: estrear sem apostar tudo

**Produz:** o id em `COMPOSER_CANARIES` **e** o registro em
`canaryContract.test.ts`.

> **Implementação e ativação NUNCA são o mesmo passo.** São dois PRs.

**Verificado por:** `canaryContract.test.ts`, que **enumera** `COMPOSER_CANARIES`
em vez de listar nós à mão — promover um nó sem registrá-lo derruba a suíte na
hora. O padrão não depende de ninguém lembrar dele.

---

## 2. A lista de verificação

Um nó só está pronto quando as doze do contrato do canário passam:

- [ ] registrado no contrato, com ficha e gerador legado declarados
- [ ] servido pelo Composer, com `generatorSource === "composer"` e `contentStatus === "explicit"`
- [ ] rollback devolve ao legado; reativação traz de volta
- [ ] paridade: autoral e legado geram questão utilizável nos cinco níveis
- [ ] promoção não altera `id`, `graphId` nem pré-requisitos
- [ ] progresso salvo antes da promoção continua válido
- [ ] resposta certa não gera diagnóstico
- [ ] tag emitida é aceita pelo Radar sem erro
- [ ] a questão traz tudo que o GameLoop exige
- [ ] a resposta correta aparece exatamente uma vez entre as alternativas
- [ ] nenhuma alternativa numérica é negativa
- [ ] 500 amostras sem laço infinito nem exceção

E, para nós com tela nova, mais três:

- [ ] `axe-core` sem violação nos cinco níveis
- [ ] a tela renderizada **não fala** o número que a pergunta pede
- [ ] cabe em 390×844 sem rolagem

---

## 3. Portões antes de qualquer commit

```
npx tsc --noEmit        # o Vitest NÃO checa tipos — só o tsc pega assinatura errada
npx vitest run
npm run build
npm run grafo:codigo    # fechar o bloco com o grafo em dia
```

---

## 4. Ordem sugerida para as 46 restantes

| Família | Nós | Por que nesta ordem |
|---|---|---|
| **N4** (9) | N4.03-04, N4.06-12 | grupos iguais e arranjos são pré-requisito de tabuada e divisão; a primitiva `array` **já existe** |
| **N2** (2) | N2.06-07 | só dois nós, e `tens` já existe — vitória rápida que valida o trilho |
| **AL** (5) | AL.04-08 | `pattern` já existe |
| **N5** (5) | N5.01-05 | depende de N4 pronto |
| **GM** (8) | GM.01, GM.05-11 | exige primitivas novas (`measure`, `money`) — Andar 7 |
| **GE** (8) | GE.03-10 | idem |
| **N6** (4), **N7** (2), **PE** (3) | | dependem das camadas acima |

**Começar por N2 (2 nós) antes de N4.** Contradiz a tabela de propósito: dois nós
pequenos com primitiva pronta são o teste barato de que este documento funciona.
Se o trilho tiver defeito, é melhor descobrir gastando dois nós, não nove.

---

## 5. O que NUNCA fazer

- Converter automaticamente as 92 fichas Markdown em runtime. Ficha é decisão
  pedagógica, não dado a transformar.
- Criar `kind` novo com menos de dois usos previstos.
- Implementar e ativar no mesmo PR.
- Declarar um andar concluído de memória — reler a lista. Já aconteceu: um andar
  foi dado por pronto com 5 de 9 itens.
- Deixar fallback silencioso passar por conteúdo autoral. Sem ficha real, o motor
  retorna `null`; não inventa.

---

## 6. Armadilhas já pagas

Cada uma foi encontrada em N3.10, custou uma rodada de medição, e voltaria de
graça na competência seguinte.

### 6.1 A narrativa entrega a resposta
Trechos construídos a partir de posições **fixas**: com a incógnita deslocada, a
história enunciava justamente o número perguntado. **Todo o nível 5 teria
estreado dando a resposta de graça.**
→ Derive os trechos da posição da incógnita. Teste lendo a **tela renderizada**,
não a estrutura de dados.

### 6.2 Coincidência numérica destrói o distrator
Quando as duas partes são iguais, a resposta coincide com um número visível — e
o distrator "repete um dado da história" vira acidentalmente correto.
→ O construtor descarta esses trios e sorteia de novo.

### 6.3 O nível 4 não era mais difícil que o 3
A opção desligava a *animação* mas não a *ilustração*. Os dois níveis eram
idênticos na prática.
→ Cheque a diferença observável entre níveis adjacentes, não a intenção.

### 6.4 A parte perguntada não se identificava
Na estrutura de comparação, o segmento da diferença — exatamente o que a
pergunta pede — não tinha rótulo algum.
→ Toda parte interrogada anuncia seu papel, no texto e no rótulo de acessibilidade.

### 6.5 "Quantas peixes", "1 estrelas"
O campo `feminino` existia e nunca era usado; não havia forma singular.
→ Concordância de gênero e número em toda fala gerada.

### 6.6 Moldura vazia lida como bug
Sem ilustração, o quadro aparecia vazio. Uma pessoa que **conhece o projeto** leu
como defeito — logo uma criança lê também.
→ Sem ilustração, renderize só texto. Nunca deixe moldura vazia.

### 6.7 Rollback de canário inerte
`CURRICULUM` era construído uma vez, com o gerador congelado no closure, e havia
uma lista de ids fixa no código. Retirar o nó do `Set` **não fazia nada** — o
rollback existia só no papel.
→ Despacho preguiçoso, resolvido por questão. Prove com sonda executável.

### 6.8 Tags de diagnóstico em conflito
Com a incógnita na primeira parte, "somou os números visíveis" e "aplicou o
procedimento canônico fora de hora" davam o mesmo valor — e a tag genérica
vencia, escondendo a específica.
→ Ordene os distratores do mais específico para o mais genérico.

### 6.9 Repetição imediata na missão
95,3% das missões tinham duas questões idênticas em sequência.
→ Guarda por assinatura + comparar contra a questão realmente anterior. **Meça
antes de declarar resolvido:** esta levou três rodadas de medição para chegar a 0%.

### 6.10 O Vitest não checa tipos
`applyJourneyAnswer(salvo, true, 1500)` passou no Vitest — o terceiro parâmetro
é `isWarmup: boolean`. Só o `tsc` pegou.
→ `npx tsc --noEmit` é portão obrigatório, não opcional.
