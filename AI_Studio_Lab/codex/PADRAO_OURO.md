# Padrão Ouro — como nasce uma competência no SAGA

Trilho único, do zero até o nó servindo criança de verdade. **N3.10 é o exemplar
de referência**: cada passo abaixo aponta para o arquivo real onde ele foi
cumprido, não para um exemplo inventado.

## Por que este documento existe

Descobrir o caminho de novo a cada competência é o jeito caro. As armadilhas do
§6 foram encontradas construindo N3.10 — cada uma custou uma rodada de medição, e
cada uma voltaria de graça na competência seguinte se não estivesse escrita.

Quantas faltam? **Não confie em número escrito aqui** — envelhece a cada
promoção. Conte pelo código: `ALL_MATH_TRACKS.filter(t => t.contentStatus ===
"fallback")`.

Este documento é o investimento que torna as restantes baratas.

**Medido depois de duas competências (N4.03 e N4.04).** O ganho não foi escrever
menos código — foi **barrar armadilhas antes de existirem** em vez de descobri-las
apanhando:

| | N4.03 | N4.04 | N4.07 |
|---|---|---|---|
| Armadilhas descobertas **apanhando** | 4 | 1 | 1 (teto de alternativas) |
| Armadilhas **barradas aplicando o §6** | 0 | 2 | 3 |
| Componentes reusados | 2 | 3 | 4 |

*(A tabela acima substitui a de duas colunas.)*



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

### Passo 4 — Conteúdo: as palavras que a criança ouve E a coreografia que ensina

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

**Produz:** o id em `COMPOSER_CANARIES` **e** a ficha em `canaryContract.test.ts`.

> **Implementação e ativação NUNCA são o mesmo passo.** São dois PRs.

**Dois tipos de promoção, e eles não se verificam igual:**

| | Substituição | Estreia |
|---|---|---|
| O nó antes | tinha gerador próprio | caía no placeholder "Em construção!" |
| O que verificar | **paridade** — a ficha nova cobre o que o legado cobria | **deixou de ser placeholder** |
| Rollback devolve | o gerador legado | o placeholder |
| Quantos são | os já feitos | **todos os que faltam** |

O contrato original só previa substituição, porque os dois primeiros canários
por acaso eram desse tipo. Todas as promoções que faltam são estreias.

O legado **não é declarado**: é descoberto por `geradorLegadoDe(id)`. Declarar à
mão é uma chance de declarar errado — e um legado errado faria a paridade
comparar a ficha nova com a coisa errada, passando sem verificar nada.

**Verificado por:** `canaryContract.test.ts`, que **enumera** `COMPOSER_CANARIES`
em vez de listar nós à mão — promover um nó sem registrá-lo derruba a suíte na
hora. O padrão não depende de ninguém lembrar dele.

---

## 2. A lista de verificação

Um nó só está pronto quando as doze do contrato do canário passam:

- [ ] registrado no contrato (só a ficha — o legado é descoberto)
- [ ] servido pelo Composer, com `generatorSource === "composer"` e `contentStatus === "explicit"`
- [ ] rollback devolve ao legado; reativação traz de volta
- [ ] a ficha autoral gera questão utilizável nos cinco níveis, sem placeholder
- [ ] paridade (substituição) **ou** deixou de ser placeholder (estreia)
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
- [ ] cabe em 390×844 **sem rolagem em nenhuma das duas direções** (§6.16)
- [ ] **declara `tutorial` na micro** e a tela aceita `tutShow` — a ficha ensina, não só pergunta (§6.23)
- [ ] **capturado e olhado** nos cinco níveis — teste verde não prova legibilidade (§6.17)

---

## 2-bis. Lista fixa no teste: quando vale, quando envenena

Varri a suíte inteira atrás deste padrão. A distinção é sutil e vale escrita,
porque errar para qualquer um dos lados custa caro.

**Fixe a lista quando ela É a especificação.** O teste deve quebrar se alguém
mudar aquilo — é esse o serviço dele.

- `[...doNivel(1)]` é `["join"]` → é a tabela da ficha, transcrita. Mudou? A
  pedagogia mudou, e isso precisa de decisão humana.
- 88 competências, 92 fichas → invariante do cânone (Bíblia §15.8). Um 89º nó
  aparecendo sem passar pelo cânone é exatamente o que se quer barrar.
- "a resposta certa aparece uma vez" → regra, expressa como número.

**Derive a lista quando ela é um INVENTÁRIO** — algo que cresce com trabalho
legítimo. Fixá-la faz o teste quebrar a cada avanço correto, e isso é pior do
que inútil: **treina quem lê a "consertar o teste" sem pensar.** No dia em que o
teste quebrar por um motivo real, a mão já vai estar automatizada para silenciá-lo.

- ❌ `expect([...COMPOSER_CANARIES]).toEqual(["N3.09", "N3.10"])` — quebrava a
  cada promoção legítima. Corrigido: hoje o teste percorre o conjunto e verifica
  a **regra** (todo canário é servido pelo Composer; todo canário está
  registrado no contrato).
- ❌ Depender de existir, por acaso, um nó implementado e não ativado. O guarda
  agora **produz** esse estado com rollback.

**O teste de bolso:** *"este teste quebra quando eu faço o trabalho certo?"* Se
sim, ele está medindo inventário e precisa virar regra.

---

## 3. Portões antes de qualquer commit

```
npx tsc --noEmit        # o Vitest NÃO checa tipos — só o tsc pega assinatura errada
npx vitest run
npm run sonda           # o jsdom NÃO faz layout — só o navegador pega tela quebrada
npm run build
npm run grafo:codigo    # fechar o bloco com o grafo em dia
```

**Por que a sonda entrou na lista.** O Vitest roda no jsdom, onde toda caixa
mede zero: `render` + `getByText` acham um rótulo mesmo quando ele está impresso
por baixo de um desenho, fora da tela ou branco no branco. Seis defeitos reais
passaram por 1074 testes por esse buraco (§6.28 a §6.32). A sonda abre cada cena
num Chromium de verdade, a 390px, em oito sementes de sorteio, e mede quatro
coisas que só existem com layout: **vazamento**, **colisão**, **contraste** e
**cobertura**.

Toda competência nova entra em `sonda/cenas.tsx` — pelo menos uma cena por
estado que vale olhar (a pergunta, e a micro-aula se houver). Cena não
cadastrada é cena não medida.

`npm run sonda -- --fotos` salva um `.png` por tomada. É de lá que saem as
capturas para revisão humana — que a sonda **não** substitui: ela pega tela
quebrada, não pega tela burra.

---

## 4. Ordem sugerida para as 46 restantes

| Família | Nós | Por que nesta ordem |
|---|---|---|
| **N4** (9) | N4.03-04, N4.06-12 | grupos iguais e arranjos são pré-requisito de tabuada e divisão; a primitiva `array` **já existe** |
| **N2** (2) | N2.06-07 | **exige primitiva nova** — ver nota abaixo |
| **AL** (5) | AL.04-08 | `pattern` já existe |
| **N5** (5) | N5.01-05 | depende de N4 pronto |
| **GM** (8) | GM.01, GM.05-11 | exige primitivas novas (`measure`, `money`) — Andar 7 |
| **GE** (8) | GE.03-10 | idem |
| **N6** (4), **N7** (2), **PE** (3) | | dependem das camadas acima |

**Correção de rota, registrada em vez de apagada.** Eu havia escolhido N2 como
validação barata do trilho, supondo que `DragGroup` e `ArrayGrid` já serviam.
**Não serviam:** F38 quer formar duplas por arrasto (o `DragGroup` distribui em
caixas, modelo de divisão) e F66 quer *montar* retângulos (o `ArrayGrid` apenas
*exibe* um). N2.06 e N2.07 exigem primitiva nova e pertencem ao Andar 7. N2
tampouco está na lista do Andar 6.

**O nó certo era N4.03** (tabuadas ×2, ×5, ×10 — ficha F42): está na lista do
Andar 6 ("tabuadas"), e as primitivas que a ficha pede — `Quadrado100` e a reta
numérica — existem e servem sem alteração.

**Lição para as próximas 45:** antes de estimar o custo de um nó, abra a
primitiva que a ficha nomeia e confira se ela faz o que a ficha descreve. O
nome bater não significa que o comportamento bata.

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

### 6.10 Registrar a ficha anunciava conteúdo que ainda não era servido
`contentStatus` era derivado de **ter ficha no catálogo**, não do que é
**servido**. No intervalo entre o PR que implementa e o que ativa — o estado que
esta própria regra cria — o nó se dizia `"explicit"` enquanto caía no fallback
genérico. Como a Oficina só prescreve resgate em trilha `!== "fallback"`, ela
mandaria a criança treinar numa competência sem conteúdo autoral.
→ Derive `contentStatus` da resolução (`binding.source()`), com getter, igual a
`generatorSource`. Mesma família da 6.7.
→ **Só apareceu porque a regra dos dois PRs foi seguida de fato.** Os dois
canários anteriores foram registrados e ativados no mesmo commit, e por isso o
intervalo nunca havia existido.

### 6.11 Parafrasear a tabela da ficha em vez de segui-la
A ficha F42 distribui os apoios assim: nível 1 = arranjo + **saltos**; 2 e 3 =
arranjo + **quadro**; 4 e 5 = só símbolo. Eu li "o apoio sai em degraus" e
implementei uma distribuição própria — arranjo em 1-2, quadro em 1-3. Os testes
passaram, porque testavam a minha versão.
→ Transcreva a tabela da ficha para o teste **antes** de escrever o
procedimento. A ficha é a especificação; o resumo dela não é.

### 6.12 Medir a tela sem carregar o estilo mede nada
A primeira medição de altura deu **40.735px** e teria virado uma "correção" de
um defeito inexistente. Os níveis sem apoio visual davam 48px, o que denunciou:
a página de teste não importava o CSS, e sem as classes utilitárias os cem
quadradinhos empilhavam em coluna.
→ Antes de acreditar numa medição de layout, confira um valor que você já
conhece. Se ele estiver errado, o instrumento está errado.

### 6.13 `aria-label` em `div` sem papel é atributo proibido
O axe reprova `aria-prohibited-attr` quando uma `div` sem `role` carrega
`aria-label` **e seus filhos são `aria-hidden`** — a div fica rotulada e vazia.
A mesma construção existia em `TabuadaStage` e NÃO acusava, porque lá havia
conteúdo acessível dentro. Depender desse detalhe é frágil.
→ Toda `div` com `aria-label` declara papel: `role="math"` para expressão,
`role="group"` para agrupamento, `role="img"` para figura.

### 6.14 O apoio que escreve a conta inteira entrega o gabarito
A ficha F43 pede "decomposição escrita" no nível 2, e a decomposição completa é
`7 × 2 = 14` **e** `14 × 2 = 28` — que contém a resposta. Escrever as duas
linhas seria dar o gabarito com aparência de andaime.
→ O andaime correto é o passo conhecido **completo** e o seguinte **em aberto**
(`14 × 2 = ?`). O contrato corta a conta no "=", de modo que o componente nunca
recebe o resultado. Mesma família da regra do `BarSlot` sem valor.
→ **Encontrada aplicando o §3, não apanhando.** Foi a primeira armadilha barrada
antes de existir.

### 6.16 Medir altura não detecta conteúdo cortado na horizontal
A reta de saltos do nível 1 media 600px (10 pontos × 60px) dentro de 390px e
**rolava na horizontal**, escondendo justamente onde a contagem chega — a
estratégia que o nível existe para ensinar. Todos os testes passavam; a medição
de altura dava 316px e aprovava.
→ Meça **as duas dimensões**, e no navegador procure
`el.scrollWidth > el.clientWidth`. Nenhum elemento pode rolar na horizontal.
→ Quando não couber, **não aperte o espaço** — os rótulos colidem. Encolha o
rótulo: `NumberLine` escolhe o tamanho da fonte pela própria densidade.

### 6.17 Apoio pintado de uma cor só vira um bloco sem informação
Os cinco saltos de dez, adjacentes e da mesma cor, formavam **uma barra contínua
de 0 a 50**. A criança via "um trecho", não "cinco saltos" — e contar os saltos
era o objetivo.
→ Elementos adjacentes que precisam ser contados alternam cor.

> **As duas foram achadas OLHANDO A TELA**, com a suíte inteira verde. Teste
> prova que o dado está certo; captura de tela prova que a criança consegue usar.
> Um não substitui o outro.

### 6.18 Distratores demais estouram o teto do cânone
Quatro estratégias com dois vizinhos numéricos davam **cinco alternativas** na
tela. O cânone §9.1 manda 3 a 4 — e a razão não é estética: excesso de escolha
vira ruído para quem tem 8 anos, não dificuldade. Nenhum teste da ficha pegou;
a captura de tela mostrou de cara.
→ Corte pelo fim, mantendo os erros ESPECÍFICOS e sacrificando o genérico. Um
vizinho basta para representar a hipótese.
→ A guarda ficou no **contrato do canário**, valendo para todo nó presente e
futuro, em vez de ficar só na ficha que errou.

### 6.20 Mascarar o formato não basta — filtre pelo NÚMERO
As contas de apoio da família ×÷ eram mostradas com o resultado mascarado
(`14 ÷ 7 = ?`). Parecia seguro. Mas numa pergunta pelo PRODUTO, esse mesmo 14
está do lado esquerdo — e é justamente a resposta. O apoio soletrava o gabarito
enquanto obedecia à regra do formato.
→ Filtre o apoio por **conter o número da resposta**, não por terminar em "?".
A regra é sobre o valor, não sobre a aparência.

### 6.22 Reusar a figura sem reusar o significado
O triângulo da família ×÷ é **a mesma figura** do "amigos do dez" — e isso é
intencional no cânone: "a mesma figura gera as quatro contas", um nível acima.
Mas eu reusei a forma sem nenhuma marca de operação. Uma criança que passou um
ano somando as duas bolinhas de baixo olha e **soma**, porque é isso que a forma
significou para ela até ontem.

> **Transferência sem sinal vira interferência.**

→ A figura precisa **declarar a própria operação**: o sinal grande entre as
bases diz como elas se combinam (`+` ou `×`), e o sinal nas pernas diz o que
acontece ao descer do topo (`−` ou `÷`). Aí a criança reconhece a forma E vê o
que mudou — *"é igual ao dos amigos do dez, mas aqui é vezes"* — que é o
pensamento que se queria provocar.
→ Cores distintas por família reforçam sem depender de leitura.
→ Um teste garante que **nenhum sinal aparece nas duas famílias**.
→ **Apontado por um adulto olhando a tela**, com 1001 testes verdes. Nenhuma
verificação automática pega interferência entre representações: ela mora na
cabeça de quem aprendeu antes, não nos dados.

### 6.23 Construir a PERGUNTA e esquecer a AULA
As seis primeiras competências que construí — N3.10, N4.03, N4.04, N4.06, N4.07,
N4.08 — nasceram sem **nenhum** momento de ensino. Elas perguntam e diagnosticam
muito bem, e não ensinam nada.

Toda ficha do cânone tem **Roteiro cinematográfico** e **Coreografia**, e o
código já tinha a máquina inteira: `params.tutorial` → `normalizeFichaTutorial`
→ `tutorialSteps(q)` → o GameLoop fala cada passo e publica `tutShow`. As fichas
antigas (N1.x, N2.01, N3.09) usam. **Eu li a seção dos níveis e pulei a
coreografia**, seis vezes seguidas.

Faltavam dois fios, e os dois são meus:
1. a ficha não declarava `tutorial` nos `params` da micro;
2. a tela não aceitava `tutShow`, então mesmo declarando não apareceria nada.

→ **Passo 4 do trilho não é só "as palavras da pergunta": é a coreografia.**
→ Levantado por um adulto olhando a tela: *"ele olha o desenho, conta, e aí?"*.
O material parado pede que a criança IMAGINE a transformação — e quem está
aprendendo agora não tem essa imagem ainda. Material sem animação vira decoração.

**A regra da demonstração:** demonstre em **UM** elemento, nunca no conjunto.
Promover as vinte e nove peças da tela mostraria o resultado — seria entregar a
resposta com aparência de aula. Uma peça ensina a regra e deixa a aplicação para
a criança, que é o que se quer treinar.

### 6.25 O apoio visual precisa ser LIDO, não só estar correto
A primeira micro-aula do deslocamento mostrava dois passos lado a lado:
cubinho→barra e barra→placa. Estava tecnicamente certa e era ilegível — a barra
aparecia **duas vezes**, uma como resultado do primeiro passo e outra como
origem do segundo, e o olho lia "duas barras" sem entender por quê.
*(Apontado por um adulto: "por que duas barras dentro do 14 × 10?")*

Pior: o desenho **ignorava quantas ordens sobem**. O ×100 saía idêntico ao ×10,
com outro texto por baixo — dois níveis inteiros com a mesma figura.

→ A forma certa é a **escada das casas** (UNIDADE · DEZENA · CENTENA · MILHAR —
a quarta casa veio depois, ver §6.27), porque é isso que "subir uma casa"
literalmente significa. Cada peça aparece **uma vez**, no lugar dela, e a
criança vê PARA ONDE sobe.
→ **Setas são o caminho; casas são as paradas.** No ×100 as duas setas acendem
(a peça percorre o caminho inteiro) e a dezena fica apagada (a peça não para
nela). Apagar a primeira seta sugeriria que o caminho nem começa na unidade.
→ O rótulo falado nomeia a **peça E a casa**: só casa é abstrato demais para
quem ouve, só peça perde o "para onde", que é o conceito.

**A regra geral:** todo elemento visual precisa responder *"por que ele está
aqui e o que a criança entende ao olhar"*. Correto e ilegível é o mesmo que
errado — e teste nenhum mede isso.

### 6.26 O Vitest não checa tipos
`applyJourneyAnswer(salvo, true, 1500)` passou no Vitest — o terceiro parâmetro
é `isWarmup: boolean`. Só o `tsc` pegou.
→ `npx tsc --noEmit` é portão obrigatório, não opcional.

### 6.27 O texto prometia mais do que o desenho entregava
A escada tinha **três** casas e o ×100 dizia "**cada** peça sobe duas casas: o
cubinho vira placa". O desenho mostrava **uma** viagem: a da barra —
dezena→milhar — caía fora da escada. Numa pergunta como `33 × 100`, metade do
material da criança ficava sem explicação, e a palavra "cada" virava mentira.
*(Apontado por um adulto: "cada uma sobe duas casas, não está errado isso aí?")*

→ A escada precisa de **quatro** casas (UNIDADE · DEZENA · CENTENA · MILHAR)
para que toda peça que sobe tenha para onde ir. Com quatro, o ×10 desenha três
saltos de um degrau e o ×100 desenha dois saltos de dois — e "cada peça" passa a
ser verdade no desenho.
→ O desenho é gerado a partir das viagens (`origem + degraus < casas`), não
escrito à mão. Quantificador em texto (`cada`, `todo`, `sempre`) é **promessa
que o desenho tem que cumprir**: ou o desenho enumera, ou o texto perde o
quantificador.
→ O teste que segura isso conta as viagens no texto falado
(`ocorrências de "vira" === 4 − ordens`), não confere uma frase fixa.

**Regra geral:** antes de escrever qualquer frase de apoio, pergunte *"o desenho
mostra tudo o que esta frase afirma?"*. Se não mostra, a frase está errada
mesmo que a matemática esteja certa.

### 6.28 Peça vazando da caixa imprime o rótulo por cima dela
O cubão do milhar são três placas empilhadas com recuo. A caixa dele tinha a
altura de **uma** placa, então as de trás vazavam por baixo e o rótulo `MILHAR`
saía impresso **por cima da peça** — ilegível justamente na casa nova, a que a
criança precisa aprender.

Nenhum teste pegou: o jsdom **não faz layout**, então `render` + `getByText`
acham o rótulo e passam mesmo com ele escondido atrás do desenho.

→ Quando a geometria é calculada (empilhamento, recuo, sobreposição), ela sai do
JSX e vira **função exportada** (`placasDoCubao()`, `PLACA`, `FAIXA`). Aí a
continência vira aritmética: `left + PLACA ≤ FAIXA`, `top + PLACA ≤ FAIXA`.
→ Sonda de mutação obrigatória: zerar o recuo tem que **quebrar** o teste.
→ Constante mágica (`height: 40` ao lado de uma placa de 41px) é o cheiro. Toda
dimensão que depende de outra se **deriva**, não se digita.

**Irmão de §6.12 e §6.16:** o jsdom não mede nada. Toda vez que o defeito é de
LAYOUT, ou existe uma conta que o teste faz, ou só a captura de tela pega.

### 6.29 O marcador tapava o número que a pergunta manda ler
`N1.07` pergunta *"o sapinho está no número! Qual vem DEPOIS?"* — e o sapinho
ficava impresso **por cima do número em que ele está**. A criança não tinha como
saber de onde partir; a única pergunta da competência virava adivinhação.

A causa: o marcador pendia por deslocamento negativo (`-translate-y-6`) dentro
da MESMA caixa dos rótulos. Qualquer ajuste fino de pixel resolvia para um valor
e quebrava para outro.

→ Elemento que se move sobre uma escala ganha **faixa própria**, e a escala
desce a partir da BASE dele, calculada: `metade do marcador − a subida + folga`.
Assim não existe posição que faça as duas caixas se encontrarem.
→ **Colisão resolvida por construção, nunca por ajuste.** Se a correção é "subir
mais uns pixels", ela vai voltar.

### 6.30 Token de cor usado como classe não pinta nada
O botão CONFIRMAR de `N1.07` era branco no branco. O código fazia:

```tsx
className={`... ${tokens.cor.acao.primaria} text-white`}   // ❌
```

`tokens.cor.acao.primaria` é um **valor** (`var(--cor-acao-primaria, #3b82f6)`),
não uma classe do Tailwind. Interpolado no `className`, vira lixo silencioso. O
TypeScript não vê — string é string — e o `axe` no jsdom também não, porque lá
nada tem cor computada.

A mesma varredura achou mais quatro textos ilegíveis por contraste, todos em
lugares que importam: o enunciado da história (branco sobre âmbar, 1.67:1), os
rótulos DEZENAS/UNIDADES (2.63:1), o sinal da operação (2.77:1) e o botão "Ver
de novo" do relance (1.45:1) — o socorro de quem não conseguiu contar a tempo.

→ Cor entra por `style`, nunca por `className`.
→ Cor pensada para **preencher forma** (`elementos.base_A`) não serve para
**escrever**. Quando o texto é o sinal da operação, use a paleta de operações,
que já nasceu com contraste verificado.
→ A sonda de layout mede contraste como quarta medida, com o cálculo da WCAG.

### 6.31 Uma sonda que muda de resposta não é portão
Os geradores sorteiam os números. A sonda media uma questão diferente a cada
execução: um vazamento aparecia, sumia na seguinte, voltava na terceira.

→ **Semear o sorteio.** Com semente fixa, "passou" quer dizer alguma coisa.
→ **Mais de uma semente.** Três não pegavam o material de 9 dezenas estourando a
largura; oito pegaram, em duas sementes distintas.
→ **Esperar a animação acabar.** Medindo aos 650ms a sonda fotografava o
material no meio da entrada escalonada — barras de alturas diferentes, caixas
ainda crescendo. Medida de tela em movimento não é medida.
→ E o irmão disso: **matar o servidor de verdade**. `npx vite` é um pai que gera
o vite como filho; matar só o pai deixa a porta ocupada e a execução seguinte
reporta o resultado ANTIGO. Passei minutos "consertando" o componente errado por
causa disso.

### 6.31-bis A ficha diz "modo X" de uma primitiva — respeite o "de"
F68 pede `ArrayGrid` **em modo área**. Era tentador desenhar um retângulo novo,
mais fácil de controlar. A razão de não fazer é pedagógica, não técnica: a
criança que chega em N4.09 já leu `7 × 2` como sete fileiras de dois em N4.03.
Ver **o mesmo quadriculado**, partido em duas, mantém a continuidade. Um desenho
novo faria a área parecer outro assunto.

→ Quando a ficha nomeia uma primitiva existente, **componha a partir dela**.
`ModeloDeArea` é feito de `Arranjo`, um por região.
→ O corte é o **vão** entre as regiões, com um traço dentro dele. Uma linha
desenhada por cima de um bloco contínuo mostraria um retângulo riscado, não um
retângulo partido.
→ A conferência de conformidade (`npm run fichas:conferir`) cobra isto: uma
competência que entrega primitiva diferente da que a ficha nomeia aparece na
lista de divergentes, com nome e sobrenome.

### 6.33 Quatro grades vizinhas não formam um retângulo sozinhas
O nível 4 de N4.09 põe quatro regiões lado a lado para formar **um** retângulo
partido. Cada `Arranjo` calculava o próprio lado de quadradinho a partir da
largura que recebia — e a região de 5 colunas saía com células menores que a de
10. As bordas não encostavam, as fileiras não se alinhavam, e o desenho deixava
de ser um retângulo para virar quatro grades soltas com números embaixo.

A criança não tinha como ver a coisa que a ficha existe para mostrar.

→ Quando N peças compõem UMA figura, o tamanho da célula é decidido pela figura
inteira e **imposto** a cada peça (`lado`), nunca derivado peça a peça.
→ O teste mede: todos os quadradinhos da tela têm a mesma `width`. Isso o jsdom
consegue, porque o lado vai em `style` inline — não é layout, é aritmética.
→ Sonda de mutação: devolver o cálculo para dentro de cada peça derruba o teste
(12px contra 7px no nível 1).

**Irmão de §6.25:** correto e ilegível é o mesmo que errado. Aqui cada região
estava matematicamente certa, e o conjunto não comunicava nada.

### 6.32 A tela inteira saía duas vezes
`GameLoopExerciseRenderer` desenha o palco das competências do Padrão Ouro no
topo — é lá que chega o `tutShow`, o fio da micro-aula. Logo abaixo, quem tem
`uiProps` cai no `FichaRenderer`, que tem um `case` para os **mesmos kinds**.

Resultado: a conta, o material e a dica apareciam **duas vezes**, uma embaixo da
outra, em TODAS as seis competências entregues. Nenhum dos 1074 testes viu, e o
motivo é estrutural: todos renderizam o palco direto (`<DeslocamentoStage
spec={...} />`) e **nunca passam pelo caminho que a criança percorre**.

→ Sempre que dois lugares sabem desenhar a mesma coisa, um teste precisa ler os
dois e cobrar a interseção (`palcoUnico.test.ts`).
→ **Testar o componente não é testar a tela.** Pelo menos uma medida tem que
percorrer o caminho inteiro, do gerador ao pixel.
