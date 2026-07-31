# 🏗️ SPEC DE CONSTRUÇÃO DOS EXERCÍCIOS — SAGA
**Documento autossuficiente. Não precisa de imagem: cada exercício está desenhado em texto.**

Este documento substitui as 130 capturas de tela. Cada ficha abaixo tem: o desenho da tela, a lista de elementos, o fluxo de interação passo a passo, e a competência que atende.

**Como usar:** entregue este arquivo ao agente de desenvolvimento junto com a Bíblia e o Grafo. Ele tem tudo o que precisa para construir sem ver nenhuma imagem.

---

## ⚠️ COMO LER OS ESQUEMAS DESTE DOCUMENTO — leia antes de construir

Cada ficha traz **duas coisas complementares**:

1. **ESTRUTURA DA TELA** — a descrição por escrito, elemento por elemento, de cima para baixo. **É esta que manda:** é a especificação exata, sem ambiguidade.
2. **COMO FICA NA TELA** — um esquema desenhado, para dar a noção visual da disposição.

**Se as duas divergirem, siga a ESTRUTURA.** O desenho é aproximado: não representa proporção real, tamanho de fonte nem espaçamento — serve para você enxergar o arranjo geral.

**Convenções dos desenhos:**
- `O` = objeto do tema (dino, estrela, bola — conforme o tema da sessão)
- `X` = objeto riscado/marcado · `*` = objeto na bandeja · `#` = bloco preenchido
- `[  ]` = caixa de resposta vazia · `( )` = botão ou vaga fantasma
- `+---+` e `|` = contêiner com borda visível na tela
- `<-` = anotação explicativa, não aparece na tela

Quando aparecer **"contêiner"**, significa: retângulo com borda fina (1px), cantos arredondados, fundo branco, com folga interna suficiente para nenhum objeto encostar na borda.

---

# ⚙️ REGRAS DE COMPOSIÇÃO — valem para TODOS os exercícios

Antes de qualquer ficha, estas sete regras definem como toda tela do SAGA se monta. Elas não são estética: cada uma carrega significado matemático.

**R1 — Enunciado de uma linha.** Nunca duas frases. A palavra que decide a resposta vem em **negrito**.
✅ `Qual grupo tem **mais**?` ❌ `Olhe os dois grupos com atenção. Agora responda qual deles tem mais elementos.`

**R2 — Um contêiner por grupo lógico.** Toda quantidade que precisa ser vista como unidade ganha borda leve (1px, cinza-claro, cantos arredondados, fundo branco). Sem a borda, dois grupos viram um monte só.

**R3 — Alinhamento vertical entre representações.** O numeral fica na MESMA coluna do grupo que representa. É isso que ensina a correspondência sem palavra nenhuma.

**R4 — O operador mora no espaço da operação.** `+` fica ENTRE os grupos, `=` antes do resultado. Nunca só dentro da conta.

**R5 — Fundo branco.** Cena colorida só em história e em jogo. No exercício comum nada compete com o objeto matemático.

**R6 — Um tipo de objeto por exercício.** Só estrelas, ou só dinos. Nunca misturado (exceto quando classificar é o objetivo).

**R7 — Área de resposta sempre na base.** A criança nunca procura onde responder.

**R8 — Teclado escala com o escopo.** Competência que conta até 3 mostra `(1)(2)(3)`. Nunca 10 botões para quem conta até 3.

---

---

# 📜 CONTRATO UNIVERSAL DA FICHA

**Vale para TODAS as fichas deste documento.** Definido uma vez aqui para não repetir 31 vezes. Cada ficha depois declara só os seus valores específicos.

Sem estas quatro costuras, a ficha vira desenho de tela e não conversa com o motor adaptativo.

## Costura 1 — A escada de proficiência (níveis 1 a 5)

Toda competência tem 5 níveis (Bíblia §5). **A mesma ficha muda de comportamento em cada um:**

| Nível | O que muda na tela | Andaime |
|---|---|---|
| **1 — Tutoria** | Mão Fantasma resolve na frente da criança, narrando cada passo, com exemplo de outros números | máximo |
| **2 — Concreto** | objetos manipuláveis, dica disponível no botão, feedback imediato | alto |
| **3 — Pictórico** | representação estruturada (moldura, barra, reta) — sem objeto solto para arrastar | médio |
| **4 — Abstrato** | só símbolos e numerais, sem apoio visual por padrão | mínimo |
| **5 — Fluência** | abstrato + tempo-alvo (rt) — vira item de treino do Dojo | nenhum |

**Regra:** a ficha declara qual `kind`/primitiva usa em cada nível. Usar a mesma nos 5 é erro — exceto competências **perceptuais** (subitização, canto numérico, pareamento), que declaram `excecaoCPA: "perceptual"` e sobem por **automaticidade** (mais itens, menos tempo), não por abstração.

## Costura 2 — Distratores com tag de misconception

Toda opção errada é um **erro típico documentado no Grafo**, nunca um número aleatório.

- **Kinds de seleção** (múltipla escolha, tocar opção): cada distrator carrega sua `tag`, importada do registro `MisconceptionTag` — nunca string solta.
- **Kinds de produção** (arrastar, tocar, montar): não há distratores. A ficha declara `misconceptionFrom(produzido, alvo) → tag` — uma regra que traduz o que a criança fez em diagnóstico.

Sem tag, o Radar fica cego e a Oficina nunca dispara.

## Costura 3 — Protocolo de feedback (duas camadas)

**Camada 1 — dentro da questão, leve, o fluxo não para:**

| Tentativa | O que acontece |
|---|---|
| 1ª errada | feedback gentil; se houver opção absurda, ela some; deixa tentar de novo |
| 2ª errada | UMA dica estratégica falada (o `explain` — nomeia a estratégia, **nunca** entrega a resposta, **nunca** elogia) |
| 3ª errada | mostra a resposta, marca o item como frágil, **avança** |

**Camada 2 — depois, por PADRÃO detectado (nunca por erro isolado):**
quando o Radar vê 2 ocorrências da mesma tag em janela próxima → agenda demonstração (Mão Fantasma) ou Missão de Resgate na Oficina, numa pausa natural.

**Proibido:** X vermelho, som de erro agressivo, travar a sessão, repetir a mesma questão até acertar.

## Costura 4 — Params fechados por micro

Cada micro declara os **limites numéricos**, e o gerador nunca sai deles.

```yaml
N1.04a: { params: { n: [1,3] },  escopo_teclado: "1-3" }
N1.04b: { params: { n: [1,5] },  escopo_teclado: "1-5" }
N1.04c: { params: { n: [1,10] }, escopo_teclado: "1-10" }
```

Sem isso, um agente gera "conte os 15 dinossauros" para uma criança de 4 anos no micro que vai até 3.

## O bloco que cada ficha declara

```yaml
competencia: N1.04
niveis:
  1: { primitiva: TouchCount, andaime: mao_fantasma }
  2: { primitiva: TouchCount }
  3: { primitiva: TenFrame }
  4: { primitiva: plain }
  5: { primitiva: plain, rt_alvo: 3000 }
params: { n: [1,5] }
audioPrompt: "..."
howto: "..."        # como pensar — do Manual
explain: "..."      # dica de erro — nomeia a estratégia
distratores:
  - { regra: "n+1", tag: OFF_BY_ONE }
  - { regra: "n-1", tag: OFF_BY_ONE }
tutorial:           # coreografia do nível 1
  - { fala: "...", mostra: { destacarItem: 0 }, sync: junto }
```

# 📦 F0 — ALFABETIZAÇÃO NUMÉRICA (4-5 anos)

## FICHA 01 — CONTAR TOCANDO ⭐ *(a mais importante)*
**Competência:** N1.04 · **Primitiva:** `TouchCount` · **Tema:** qualquer

### Como fica na tela
```
Conte os dinossauros. Toque em cada um!

     O     O     O     O
   (todos cinza, esperando toque)

   ao tocar:  [1]
              (O)    O     O     O
              ^colorido, numeral salta

   depois de todos:
        (1)  (2)  (3)  (4)  (5)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Conte os dinossauros. Toque em cada um!"
2. **Área de objetos** — N objetos do tema, dispostos conforme o campo `arranjo` (fila, grade ou disperso). Todos nascem **acinzentados** (opacidade 35%, sem cor).
3. **Teclado numérico** — só aparece DEPOIS que todos os objetos foram tocados. Escala conforme `escopo_teclado`.

### Fluxo de interação
1. Objetos nascem **acinzentados** (opacity 0.35, grayscale)
2. Criança toca em **qualquer** objeto ainda não contado
3. Nesse instante, simultaneamente: o objeto **ganha cor**, **cresce** (scale 1.3 e volta), o numeral **salta grande acima dele** (1, 2, 3...), e a voz **fala o número**
4. Tocar em objeto já contado → ele balança de leve + voz: *"esse já contamos!"*
5. Quando todos estiverem coloridos → pausa de 800ms → voz: *"quantos foram?"* → teclado aparece
6. Criança responde

### Regras duras
- **Ordem livre.** Qualquer objeto não contado responde ao toque. Nunca exigir sequência.
- **Silêncio é proibido.** Todo toque produz alguma resposta.
- O numeral é o **produto** do ato — é isso que separa contar de parear.

### Erro comum a evitar
Se o código só aceita o "próximo da fila" (`if (idx === contados)`), a criança toca em outro e nada acontece. É o bug clássico.

---

## FICHA 02 — CONTAR NA MOLDURA
**Competência:** N1.08 · **Primitiva:** `TenFrame` · **Tema:** estrelas, ovos, medalhas

### Como fica na tela
```
Quantas estrelas voce ve?

+----+----+----+----+----+
| ** | ** | ** |    |    |
+----+----+----+----+----+

      (1) (2) (3) (4) (5)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Quantas estrelas você vê?"
2. **A moldura** — retângulo dividido em células iguais (5 numa fileira, ou 10 em duas fileiras de 5). As N primeiras células, **da esquerda para a direita e de cima para baixo**, contêm um objeto cada. As demais ficam vazias. **Nunca deixar buraco no meio.**
3. **Teclado numérico** — na base.

### Fluxo
1. Moldura aparece com N células preenchidas, da esquerda para a direita, sem buraco
2. Criança responde no teclado

### Explicação (quando pedida, ou no nível 1)
- Voz: *"olha a fileira de cima"* + **a fileira de cima acende**
- Voz: *"cheia, já são cinco!"* + **as 5 células piscam juntas**
- Voz: *"agora a de baixo"* + **a segunda fileira acende**

### Variações por parâmetro
`moldura: 5 | 10` · `escopo_teclado: 1-5 | 1-10` · tema

---

## FICHA 03 — CONTAR EM FILA / GRADE / DISPERSO
**Competência:** N1.04 · **Primitiva:** `EmojiRow` · **Campo novo:** `arranjo`

### Como fica na tela
```
arranjo: fila (facil)          arranjo: grade (medio)

   O   O   O   O                  O   O   O
                                  O   O   O

arranjo: disperso (dificil)

      O            O
              O
   O                    O
         O        O
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Quantos foguetes?"
2. **Área de objetos** — N objetos, dispostos conforme o campo `arranjo`:
   - `fila`: todos numa única linha horizontal, espaçamento igual
   - `grade`: linhas e colunas regulares (ex.: 2 linhas de 3)
   - `disperso`: posições aleatórias dentro da área, sem alinhamento, sem sobreposição
3. **Teclado numérico** — na base, escalado ao escopo.

### Por que o arranjo é degrau de dificuldade
Contar 6 em fila é fácil. Contar 6 espalhados exige estratégia — não perder o fio. **Mesma quantidade, dificuldade completamente diferente.** No disperso, combinar com o toque que marca (Ficha 01) resolve o "perdi a conta".

---

## FICHA 04 — PRODUZIR QUANTIDADE ⭐
**Competência:** N1.05, N1.09 · **Primitiva:** `TouchPlace`

### Como fica na tela
```
Coloque 3 estrelas no ceu!

+---------------------------+
| .    .       .      .   . |  <- ceu noturno
|                           |
|    ( )     ( )     ( )    |  <- vagas fantasma
|                           |
+---------------------------+
|  *    *    *    *    *    |  <- bandeja
+---------------------------+
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Coloque 3 estrelas no céu!"
2. **Cena** — retângulo grande com ilustração de fundo (céu noturno, vale, campo — conforme o tema). Dentro dela, **N vagas fantasma**: contornos pontilhados, vazios, do tamanho do objeto, espalhados pela cena.
3. **Bandeja** — faixa horizontal na base da cena, contendo mais objetos do que o necessário (ex.: 5 objetos para uma tarefa de 3).

### Fluxo
1. Cena com **N vagas fantasma** (contorno pontilhado, sem preenchimento)
2. Criança toca numa estrela da bandeja → ela voa para a próxima vaga → a vaga se preenche
3. Voz conta a cada colocação: *"uma... duas..."*
4. Quando a última vaga enche → celebração → completa sozinho
5. Se tentar colocar além → a estrela **não cola** e volta para a bandeja (limite físico ensina a parar)

### Por que é diferente de contar
Aqui ela **produz** a quantidade em vez de ler uma dada. É o inverso cognitivo, e mais difícil.

### Auto-encerramento sem timer
As vagas fantasma tornam o alvo visível e encerram o exercício sozinhas. **Nunca usar debounce por tempo** — criança lenta seria penalizada.

---

## FICHA 05 — OUVIR E ESCOLHER ⭐
**Competência:** N1.06 · **Primitiva:** `AudioChoice`

### Como fica na tela
```
Aperte e escute. Que numero voce ouviu?

          +---------+
          |   SOM   |     <- botao grande
          +---------+

        (1)    (2)    (3)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Aperte e escute. Que número você ouviu?"
2. **Botão de áudio** — um único botão grande e centralizado (mínimo 120px), com ícone de alto-falante. É o elemento dominante da tela.
3. **Opções numéricas** — 2 a 4 botões com numerais, na base.

Não há nenhum outro elemento visual. A tela é deliberadamente vazia — o áudio é a pergunta.

### Fluxo
1. Ao carregar, toca automaticamente **uma vez**
2. Botão fica disponível para repetir quantas vezes quiser
3. Criança escolhe o numeral

### Por que este exercício é obrigatório
É o **único formato 100% acessível a quem não lê nada**. Sem ele, uma criança de 4 anos depende de adulto para tudo.

---

## FICHA 06 — COMPARAR DOIS GRUPOS
**Competência:** N1.05 · **Primitiva:** `Grupo` ×2

### Como fica na tela
```
Qual grupo tem MAIS?

+---------------+   +---------------+
|               |   |    O   O      |
|    O    O     |   |    O   O      |
|               |   |      O        |
+---------------+   +---------------+
 <-- mesmo tamanho, sempre -->
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Qual grupo tem **mais**?" (palavra-chave em negrito)
2. **Dois contêineres lado a lado**, de **tamanho idêntico**, separados por espaço. Cada um contém seus objetos distribuídos internamente com folga — **nenhum objeto encosta na borda ou escapa do contêiner**.
3. Não há botões separados: **cada contêiner inteiro é a área clicável**.

**Regra de tamanho:** os dois contêineres têm exatamente a mesma largura e altura, independentemente de quantos objetos cada um contém. Se um for maior, a criança escolhe pelo tamanho da caixa em vez de contar.

### Parâmetro `proximidade`
- `facil`: 2 vs 8 (diferença óbvia)
- `medio`: 3 vs 5
- `dificil`: 5 vs 6 (exige contar de verdade)

### ⚠️ A armadilha pedagógica deste exercício
A criança tende a julgar por **espaço ocupado**, não por quantidade. 4 bolas espalhadas parecem mais que 5 juntinhas. **O exercício existe para curar isso.**

**Portanto:** a dica NUNCA pode dizer "olhe qual lado tem mais coisas amontoadas". Tem que ensinar a **parear**: *"faça um par de cada vez: um daqui, um dali. Quem sobrar tem mais."*

**Melhoria sobre o IXL:** oferecer o pareamento como ação — a criança pode ligar um-a-um e ver quem sobra.

---

## FICHA 07 — PAREAR UM PRA CADA
**Competência:** N1.01 · **Primitiva:** `DragGroup` (modo parear)

### Como fica na tela
```
De um capacete para cada bombeiro!

   A     A     A     A          <- bombeiros

   c     c     c     c     c    <- capacetes (sobra 1)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Dê um capacete para cada bombeiro!"
2. **Fileira A** — os receptores (bombeiros), em linha horizontal, espaçamento igual
3. **Fileira B** — os itens a distribuir (capacetes), em linha horizontal logo abaixo, **com uma quantidade diferente da fileira A** (para haver sobra ou falta)

A criança arrasta cada item da fileira B até um receptor da fileira A. **Nenhum numeral aparece em tela nenhum momento.**

### Fluxo
1. Criança arrasta um capacete até um bombeiro → encaixa
2. Ao final: *"sobrou algum? tinha capacete para todos?"*

### ⚠️ Distinção crítica
**Isto NÃO é contar.** Nenhum numeral aparece. É correspondência um-a-um — a competência que vem ANTES de contar. Se aparecer número, virou a Ficha 01.

---

## FICHA 08 — UM A MAIS / UM A MENOS
**Competência:** N1.07, N1.09 · **Primitiva:** `EmojiRow` + `NumberLine`

### Como fica na tela
```
Conte as estrelas deste grupo.

     O   O   O   O   O

Qual grupo tem UMA A MENOS?

+-----------------------+
|  O  O  O  O  O  O     |
+-----------------------+

+-----------------------+
|  O  O  O  O           |
+-----------------------+
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Primeiro enunciado** — "Conte as estrelas deste grupo."
2. **Grupo de referência** — N objetos em fila, sem contêiner
3. **Segundo enunciado** — "Qual grupo tem **uma a menos**?"
4. **Duas opções empilhadas verticalmente**, cada uma num contêiner de largura idêntica: uma com N+1 objetos, outra com N−1 objetos

### Melhoria sobre o IXL
No nível pictórico, mostrar **a reta numérica com o salto** — a criança vê o "um a menos" como movimento, não só como grupo diferente.

---

## FICHA 09 — SEQUÊNCIA E PADRÃO
**Competência:** AL.01, AL.02, AL.04 · **Primitiva:** `EmojiRow` (modo padrão)

### Como fica na tela
```
Copie o padrao!

   O     ^     O     ^     O     ^

 [   ] [   ] [   ] [   ] [   ] [   ]
   ^cada vaga sob o elemento do modelo

        banco:   [O]    [^]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Copie o padrão!"
2. **Linha modelo** — a sequência completa do padrão (ex.: círculo, triângulo, círculo, triângulo, círculo, triângulo)
3. **Linha de vagas** — mesma quantidade de posições da linha modelo, todas vazias, alinhadas verticalmente **uma sob cada elemento do modelo**
4. **Banco de peças** — na base, uma peça de cada tipo usado no padrão

**Regra de alinhamento:** cada vaga fica exatamente sob o elemento correspondente do modelo. É isso que mostra a correspondência posição a posição.

### Variações por parâmetro (aqui está a riqueza)
`AB` (●▲●▲) · `AAB` (●●▲●●▲) · `ABB` · `ABC` (●▲■) · **crescente** (1,2,3 objetos)

**Melhoria sobre o IXL:** eles usam só AB e ABC fixos. Nós geramos todos por parâmetro — variedade infinita sem código novo.

---

## FICHA 10 — POSIÇÃO NO ESPAÇO
**Competência:** GE.01, GE.02 · **Primitiva:** `ShapeCanvas` (cena)

### Como fica na tela
```
Qual objeto esta EMBAIXO da mesa?

+-----------------------------+
|                             |
|             O               |  <- em cima
|     ===================     |  <- A mesa (unica)
|             O               |  <- embaixo
|                             |
+-----------------------------+
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Qual objeto está **embaixo** da mesa?" (preposição em negrito)
2. **Cena única** — UM retângulo contendo UMA ilustração de referência (uma mesa, uma caixa, uma árvore) e **dois objetos**: um posicionado acima do referencial, outro abaixo.
3. Não há botões: **a criança toca diretamente no objeto** que responde à pergunta.

**Regra:** um único referencial na cena. Desenhar dois referenciais (duas mesas) torna a pergunta ambígua — a criança não sabe de qual mesa se fala.

### Variações
`em cima/embaixo` · `na frente/atrás` · `dentro/fora` · `esquerda/direita` · `topo/meio/base`

### Melhoria sobre o IXL
Eles usam cena estática com duas opções. **Nós deixamos a criança MOVER o objeto** para a posição pedida — produzir em vez de reconhecer.

---

## FICHA 11 — CLASSIFICAR EM CATEGORIAS
**Competência:** AL.01, PE.01 · **Primitiva:** `DragGroup` (modo caixas)

### Como fica na tela
```
Separe os dinossauros.

   O   X   O   X   O   X   O

+----------------+  +----------------+
|  come planta   |  |  come carne    |
+----------------+  +----------------+
|                |  |                |
|                |  |                |
+----------------+  +----------------+

Quantos comem planta?
      (1) (2) (3) (4) (5)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Separe os dinossauros."
2. **Área de objetos soltos** — os objetos misturados, em fila ou grade, na parte de cima
3. **Duas ou três caixas de destino**, lado a lado, de **tamanho idêntico**, cada uma com um rótulo no topo ("come planta", "come carne") e uma linha divisória sob o rótulo. O corpo da caixa começa vazio.
4. **Segundo enunciado e teclado** — aparecem só DEPOIS de classificar tudo: "Quantos comem planta?" + teclado

### Melhoria sobre o IXL
Eles param na classificação. **Nós emendamos a contagem** — classificar vira a base para dados e gráficos (PE).

---

## FICHA 12 — TAMANHO, PESO E CAPACIDADE
**Competência:** GM.01 · **Primitiva:** `Grupo` ×2 ou `Balança`

### Como fica na tela
```
Qual dinossauro e MAIS ALTO?

+---------------+   +---------------+
|               |   |       O       |
|       O       |   |       O       |
|       O       |   |       O       |
+===============+   +===============+
 ^ bases na MESMA linha horizontal
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Qual dinossauro é **mais alto**?" (atributo em negrito)
2. **Dois contêineres lado a lado**, de largura idêntica, cada um com um objeto.

**Regra pedagógica obrigatória:** os objetos precisam ter a **base alinhada na mesma linha horizontal** (ambos "apoiados no chão" da caixa). Comparar altura com bases desalinhadas ensina errado — é o equivalente visual de comparar quantidade por espaço ocupado.

### Melhoria sobre o IXL
Para peso, usar a **Balança de verdade** — a criança põe os objetos e vê pender. A física ensina, não a legenda.

---

# 📦 F1 — PRIMEIRAS OPERAÇÕES (5-7 anos)

## FICHA 13 — JUNTAR DOIS GRUPOS ⭐ *(o "passarinho vermelho")*
**Competência:** N3.01, N3.02 · **Primitiva:** `Sentenca`

### ESTRUTURA (é isto que manda)

A tela tem **3 faixas horizontais**, de cima para baixo:

**Faixa 1 — enunciado:** uma linha curta ("Junte:")

**Faixa 2 — a linha visual.** Cinco elementos lado a lado, centralizados, na ordem:
| Posição | Elemento | Propriedade |
|---|---|---|
| 1 | contêiner com borda | contém A objetos do tema |
| 2 | símbolo `+` | fora dos contêineres, centralizado verticalmente |
| 3 | contêiner com borda | contém B objetos do tema |
| 4 | símbolo `=` | fora dos contêineres |
| 5 | caixa de resposta vazia | mesma altura dos contêineres |

**Faixa 3 — a linha numérica.** Cinco elementos, **cada um centralizado na mesma coluna vertical do elemento correspondente da Faixa 2**:
| Posição | Conteúdo |
|---|---|
| 1 | o numeral A — centralizado sob o contêiner 1 |
| 2 | `+` — sob o `+` de cima |
| 3 | o numeral B — centralizado sob o contêiner 3 |
| 4 | `=` — sob o `=` de cima |
| 5 | a caixa de entrada — sob a caixa vazia |

**A regra que define este exercício:** cada numeral da Faixa 3 tem que estar na **mesma coordenada horizontal** do grupo que ele representa na Faixa 2. Se o alinhamento quebrar, o exercício perde a função pedagógica.

### Como fica na tela
```
+---------+       +-----+       +-----+
| O  O  O |   +   |  O  |   =   |     |
+---------+       +-----+       +-----+
     3        +      1       =    [ ]
```

### As 4 regras que fazem isto funcionar
1. **Cada grupo dentro de uma caixa** — é a caixa que faz ver duas quantidades, não uma fileira de 4
2. **O `+` ENTRE as caixas** — no espaço onde a operação acontece
3. **O numeral DIRETAMENTE ABAIXO** de cada grupo, mesma coluna
4. **A conta é a segunda linha do mesmo desenho** — não um bloco separado embaixo

### O erro a não cometer
```
O O O O
3 + 1 = ?
```
*(o mesmo conteúdo sem contêiner e sem alinhamento)* — sem contêiner separando os grupos, e com a conta solta embaixo sem alinhamento nenhum. Assim a criança vê **um monte de quatro objetos** (não dois grupos) e uma conta que não se relaciona visualmente com o que está acima.

### Melhoria sobre o IXL
Adicionar a **barra de Singapura como terceira linha** no nível pictórico: objeto → barra → símbolo, os três alinhados.

---

## FICHA 14 — TREM DE CUBOS
**Competência:** N3.01, N3.03 · **Primitiva:** `ArrayGrid` (modo trem)

### Como fica na tela
```
Ha 2 cubos azuis e 3 cubos amarelos.

+--+--+--+--+--+
|AA|AA|MM|MM|MM|   <- encostados, sem espaco
+--+--+--+--+--+

Some para achar quantos cubos ha ao todo.

        2 + 3 = [  ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Frase descritiva** — "Há 2 cubos azuis e 3 cubos amarelos."
2. **O trem** — cubos quadrados **encostados uns nos outros, sem espaço entre eles**, formando uma barra contínua. Os A primeiros de uma cor, os B seguintes de outra cor.
3. **Segundo enunciado** — "Some para achar quantos cubos há ao todo."
4. **A equação** — "2 + 3 = [caixa vazia]"

**Regra:** os cubos são encostados, não espaçados. É a conexão física que mostra que 2 e 3 formam **uma coisa só** de 5.

### Por que os cubos são encaixados
Encaixados mostram que 2 e 3 formam **uma coisa só** de 5. Separados, seriam dois grupos. A conexão física é o conceito.

### Melhoria sobre o IXL
Eles mostram o trem pronto. **Nós deixamos a criança montar** — ela encaixa e vê a soma virar comprimento.

---

## FICHA 15 — SUBTRAIR RISCANDO
**Competência:** N3.09 · **Primitiva:** `EmojiRow` (modo riscar)

### Como fica na tela
```
Risque 2 baloes para estourar.

    O     O     X     X     O
                ^ja estourados

Depois complete:    5 - 2 = [  ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Risque 2 balões para estourar."
2. **Fileira de objetos** — N objetos em linha, todos íntegros no início
3. **Equação** — aparece só DEPOIS que a criança riscar a quantidade pedida: "5 − 2 = [caixa vazia]"

Ao tocar num objeto, ele estoura (animação + som) e passa a exibir um X sobreposto.

### Fluxo
1. Criança toca num balão → ele **estoura** com animação e som, e fica marcado com ✕
2. Ao riscar a quantidade pedida, a conta aparece
3. Ela completa

### Variante FANTASMA (segunda forma de mostrar o "tirar")

O dossiê traz duas maneiras visuais de representar a subtração, e elas ensinam coisas diferentes:

**Forma A — riscar (X sobre o objeto):** o objeto continua lá, marcado. Bom para *"quantos sobraram?"* — a criança vê o total original e o que saiu.

**Forma B — fantasma (contorno tracejado):** o objeto vira um contorno vazio, como se tivesse evaporado. Bom para *"quantos foram embora?"* — enfatiza a ausência.

```
     Forma A (riscar):     O   O   X   X   O

     Forma B (fantasma):   O   O   .   .   O
                                   ^contorno tracejado, vazio
```

**Quando usar cada uma:** a forma A no nível 1-2 (o objeto ainda está visível, apoia a contagem). A forma B no nível 3-4 (exige imaginar a quantidade que sumiu — mais abstrato).

### Melhoria sobre o IXL
Eles mostram já riscado. **Nós deixamos a criança riscar** — o ato de tirar É o conceito de subtração.

---

## FICHA 16 — DECOMPOR NÚMERO (parte-parte-todo)
**Competência:** N1.10, N3.05, N3.06 · **Primitiva:** `TenFrame` + `BarModel`

### Como fica na tela
```
Uma maneira de separar o 4:   4 = 3 + 1

Mostre uma maneira DIFERENTE de separar o 4.

              ( 4 )        <- o todo
             /     \
         [    ]  [    ]    <- as partes

        (1) (2) (3) (4) (5)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Exemplo dado** — "Uma maneira de separar o 4:  4 = 3 + 1"
2. **Enunciado** — "Mostre uma maneira **diferente** de separar o 4."
3. **O number bond** — um círculo no topo com o número-alvo, e **duas linhas diagonais descendo** dele até dois círculos vazios embaixo, lado a lado
4. **Teclado numérico** — na base

**Regra:** a estrutura é sempre um-em-cima-dois-embaixo, ligados por linhas. É essa forma que torna parte-todo explícito.

### Por que o number bond visual importa
A estrutura círculo-em-cima/dois-embaixo torna **parte-todo explícito**. É a base do bar model e de toda a álgebra depois.

---

## FICHA 17 — ESCOLHER A SENTENÇA
**Competência:** N3.04 · **Primitiva:** `multiple_choice`

### Como fica na tela
```
Qual imagem mostra 4 - 2 = 2?

+-----------------------+
|  O   O   X   X   X    |
+-----------------------+

+-----------------------+
|  O   O   X   X        |
+-----------------------+

+-----------------------+
|  O   O   X            |
+-----------------------+
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Qual imagem mostra 4 − 2 = 2?" (a conta aparece escrita no enunciado)
2. **Três ou quatro opções empilhadas verticalmente**, cada uma num contêiner de largura idêntica. Cada opção mostra uma fileira de objetos, alguns com X sobreposto.

A criança toca no contêiner que corresponde à conta do enunciado.

### Por que este tipo existe
Inverte o raciocínio: em vez de calcular, ela **interpreta**. Detecta quem decorou o resultado sem entender a operação.

---

## FICHA 18 — ESCREVER A SENTENÇA
**Competência:** N3.04, N3.10 · **Primitiva:** `SentenceBuilder`

### Como fica na tela
```
Escreva a conta que combina com a imagem.

     O     X     X     X

  [   ] [ ] [   ] [ ] [   ]
   num  sin  num  sin  num

  banco:  (1)(2)(3)(4)(5)   [-]  [=]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Escreva a conta que combina com a imagem."
2. **A imagem** — fileira de objetos, alguns riscados com X
3. **Linha de caixas vazias** — 5 caixas em linha horizontal, do tamanho de um caractere cada, para receber: número, sinal, número, sinal, número
4. **Banco de peças** — na base: botões com numerais, e botões com os sinais (−, =)

A criança arrasta ou toca as peças para preencher as caixas na ordem que quiser.

### Melhoria sobre o IXL
Eles dão as caixas na ordem certa. **Nós deixamos ela decidir onde vai cada peça** — e se puser o sinal no lugar errado, o tutor pergunta *"tem certeza que o sinal fica aí?"*

---

## FICHA 19 — RETA NUMÉRICA COM SALTOS
**Competência:** N1.12, N3.07, N3.08, N7.01 · **Primitiva:** `InteractiveNumberLine`

### Como fica na tela
```
Qual reta mostra 9 + 2?

+-------------------------------------+
|            __    __                 |
|           /  \  /  \                |
| <--+--+--+--+--+--+--+--+--+--+---> |
|    5  6  7  8 [9] 10 11 [12] 13     |
+-------------------------------------+

Some:    9 + 2 = [  ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Qual reta mostra 9 + 2?"
2. **Duas retas numéricas empilhadas**, cada uma num contêiner de largura idêntica. Cada reta tem: uma linha horizontal com setas nas pontas, marcas verticais igualmente espaçadas, numerais sob as marcas, o número de partida destacado com moldura, e **arcos curvos acima da linha** ligando cada salto.
3. **A equação** — na base: "9 + 2 = [caixa vazia]"

**No modo interativo (nosso diferencial):** em vez de duas opções prontas, mostrar UMA reta e deixar a criança arrastar o marcador, com som a cada salto.

### 🏆 A nossa maior vantagem
A reta do IXL é **desenho estático**. **A nossa é interativa** — a criança arrasta o marcador e **vê o salto acontecer**, com som a cada pulo. É a mesma ferramenta que ela vai usar para números negativos lá no N7.

---

## FICHA 20 — HISTÓRIA EM 3 PAINÉIS
**Competência:** N3.10 · **Primitiva:** `StoryPanel`

### Como fica na tela
```
Escute a historia.

+-----------------------------+
|        O    O    O          |
+-----------------------------+
| "Havia 3 dinos no vale."    |
+-----------------------------+

+-----------------------------+
|   O  O  O     O  O  O  O    |
+-----------------------------+
| "Entao chegaram mais 4."    |
+-----------------------------+

Some para achar quantos dinos ha ao todo.

        3 + 4 = [  ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Escute a história."
2. **Painel 1** — contêiner com duas partes: em cima a ilustração da cena inicial, embaixo a frase ("Havia 3 dinos no vale.")
3. **Painel 2** — mesmo formato: ilustração da cena **modificada** (agora com mais objetos), e a frase ("Então chegaram mais 4.")
4. **Terceiro enunciado** — "Some para achar quantos dinos há ao todo."
5. **A equação** — "3 + 4 = [caixa vazia]"

**Regra:** sempre exatamente 3 blocos, sempre nesta ordem — situação inicial, mudança, pergunta. O formato nunca muda, para a criança aprender a estrutura e focar no conteúdo.

### Estrutura fixa e obrigatória
Sempre 3 painéis, sempre nesta ordem: situação inicial → mudança → pergunta. A criança aprende o **formato** e passa a focar no **conteúdo**.

### Melhoria sobre o IXL
Cada painel é **narrado** (criança que não lê consegue sozinha) e a cena **anima a mudança** entre o painel 1 e o 2.

---

# 📦 F2 — ESTRUTURA DO NÚMERO (7-9 anos)

## FICHA 21 — VALOR POSICIONAL COM BLOCOS
**Competência:** N2.01–N2.05 · **Primitiva:** `Quadrado100` + `ArrayGrid`

### Como fica na tela
```
Conte os blocos de 10 em 10.

   ##    ##    ##    ##      #
   ##    ##    ##    ##      #
   ##    ##    ##    ##      #
   ##    ##    ##    ##
   ##    ##    ##    ##
  torre  torre torre torre  soltas
   (10)  (10)  (10)  (10)

Quantos blocos ha?    [    ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Conte os blocos de 10 em 10."
2. **Área das torres** — cada torre é uma coluna vertical de 10 quadradinhos empilhados e **encostados**. As torres ficam separadas entre si por espaço. Unidades avulsas (se houver) ficam soltas à direita, sem formar coluna.
3. **Caixa de resposta** — na base.

**Regra:** dentro da torre os quadradinhos se tocam (formam uma unidade); entre torres há espaço (são unidades distintas).

### Melhoria sobre o IXL
Eles mostram blocos prontos. **Nós deixamos a criança agrupar 10 unidades soltas e ver virar uma torre** — a troca é o conceito, não o resultado.

---

## FICHA 22 — CONTA ARMADA
**Competência:** N3.11, N3.12, N4.08+ · **Primitiva:** `InteractiveVertical`

### Como fica na tela
```
Conta armada — preenche da DIREITA para a ESQUERDA

        [1]           <- vai-um
         4  7
      +  2  5
      ---------
              [_]     <- coluna ATIVA (unidades primeiro)

   (0)(1)(2)(3)(4)(5)(6)(7)(8)(9)
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **A conta armada** — números alinhados à direita, um sob o outro, com o sinal da operação à esquerda do segundo número, e uma linha horizontal embaixo. Cada dígito ocupa uma coluna.
2. **Linha de resposta** — abaixo da linha horizontal, uma caixa vazia por coluna. **A coluna ativa fica destacada** (borda ou fundo diferente).
3. **Espaço do vai-um** — acima da coluna à esquerda da ativa, uma caixinha pequena onde o "1" aparece quando há reagrupamento.
4. **Teclado numérico** — 0 a 9, na base.

**Regra crítica de ordem:** a coluna ativa começa na **mais à direita** (unidades) e caminha para a esquerda a cada dígito respondido.

### ⚠️ Regra crítica de direção
Preenche **da DIREITA para a ESQUERDA**. Unidade primeiro, depois dezena, depois centena. É assim no papel e é assim que o vai-um existe. Forçar esquerda→direita contraria o algoritmo que ela está aprendendo.

### 🏆 Melhoria enorme sobre o IXL
Eles não têm isto. **A nossa dezena explode visualmente**: 10 unidades se juntam, viram 1 bloco e **sobem** para a coluna da dezena. A criança vê o reagrupamento acontecer.

---

## FICHA 23 — FRAÇÕES
**Competência:** N5.01–N5.05 · **Primitiva:** `ShapeCanvas` (modo partição)

### Como fica na tela
```
Que fracao das formas sao triangulos?

    []    []    []    /\

+------+  +------+  +------+  +------+
|  1   |  |  1   |  |  1   |  |  1   |
|  -   |  |  -   |  |  -   |  |  -   |
|  4   |  |  3   |  |  2   |  |  5   |
+------+  +------+  +------+  +------+
```

### ESTRUTURA DA TELA — modo reconhecer
1. **Enunciado** — "Que fração das formas são triângulos?"
2. **Fileira de formas** — objetos de dois tipos misturados em linha
3. **Opções** — 3 ou 4 contêineres lado a lado, cada um com uma fração escrita (numerador sobre denominador, com linha entre eles)

### ESTRUTURA DA TELA — modo produzir *(preferível)*
1. **Exemplo** — "Este retângulo está cortado em quartos." + a figura já dividida
2. **Enunciado** — "Corte em quartos de um jeito **diferente**."
3. **Figura limpa** com pontos de corte arrastáveis nas bordas

### Melhoria sobre o IXL
Eles perguntam qual fração. **Nós deixamos cortar** — ela descobre que mais cortes = pedaço menor. Vê a regra em vez de decorar.

---

## FICHA 24 — RELÓGIO
**Competência:** GM.04, GM.06 · **Primitiva:** `Relogio`

### Como fica na tela
```
Que horas o relogio mostra?

        +-------------+
        |      12     |
        |  11      1  |
        |  10  |   2  |
        |   9  +---3  |   <- ponteiros arrastaveis
        |   8      4  |
        |    7   5    |
        |      6      |
        +-------------+

   +--------+  +--------+  +--------+
   |  8:00  |  |  4:00  |  | 12:00  |
   +--------+  +--------+  +--------+
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Que horas o relógio mostra?"
2. **O relógio** — círculo grande com os numerais de 1 a 12 na posição correta, marcas menores entre eles, e **dois ponteiros de cores diferentes** partindo do centro (o das horas mais curto e grosso, o dos minutos mais longo e fino).
3. **Opções** — 3 contêineres lado a lado com horários escritos ("8:00", "4:00", "12:00")

**No modo produzir:** sem opções — os ponteiros são arrastáveis e a criança põe a hora pedida.

### Melhoria sobre o IXL
Eles usam relógio estático só para leitura. **Os nossos ponteiros são arrastáveis** — ela pode *pôr* a hora, não só ler. Ponteiro de hora e minuto em cores diferentes.

---

## FICHA 25 — DINHEIRO
**Competência:** GM.07 · **Primitiva:** `Moedas`

### Como fica na tela
```
Quanto dinheiro ha aqui?

     (c)   (c)   (c)
     (c)   (c)

     R$ [        ]
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Quanto dinheiro há aqui?"
2. **Área das moedas** — moedas espalhadas ou em grade, tamanhos proporcionais aos valores reais
3. **Caixa de resposta** — com o símbolo "R$" à esquerda da caixa

Usar moedas brasileiras reais (5, 10, 25, 50 centavos e R$ 1).

### Melhoria sobre o IXL
Usar **moedas brasileiras reais** (5, 10, 25, 50 centavos, R$1). E permitir **arrastar para agrupar** — juntar as de 25 para fazer 1 real é o conceito.

---

## FICHA 26 — DADOS E GRÁFICOS
**Competência:** PE.01–PE.04 · **Primitiva:** `SingaporeBars` (modo vertical)

### Como fica na tela
```
Complete o grafico com os dados da tabela.

+------------+--------+
| Dia        |   Km   |
+------------+--------+
| Segunda    |    3   |
| Terca      |    6   |
| Quarta     |    5   |
+------------+--------+

Segunda  |#####
Terca    |##########
Quarta   |- - - - -          <- barra faltando
         +--+--+--+--+--+--+
         0  1  2  3  4  5  6
```

### ESTRUTURA DA TELA
De cima para baixo:
1. **Enunciado** — "Complete o gráfico com os dados da tabela."
2. **A tabela** — duas colunas com cabeçalho ("Dia" e "Km"), e uma linha por item
3. **O gráfico** — eixo vertical com os rótulos à esquerda, eixo horizontal com a escala numérica embaixo, e uma barra horizontal por item. **Uma das barras está faltando** — no lugar dela, um contorno pontilhado arrastável.

**Regra:** a escala do eixo tem que ser visível e regular, senão a criança não consegue medir a barra.

### Melhoria sobre o IXL
Eles pedem só para completar. **Nós emendamos com a coleta**: a criança conta os objetos, preenche a tabela, e o gráfico se constrói. Ela vê **de onde vem o dado**.

---

---

## FICHA 27 — CANTO NUMÉRICO (Canhão de Balões)
**Competência:** N1.02 · **Primitiva:** `TouchCount` (modo rítmico) · **Tema:** pirata e canhão

### Como fica na tela
```
     Estoure os baloes contando junto!

     +---------------------------+
     |   O   O   O   O   O       |   <- baloes voando
     |                           |
     |                           |
     |         /^\               |   <- canhao
     +---------------------------+

            [ DISPARAR ]
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Estoure os balões contando junto!"
2. **Cena** — balões flutuando na parte de cima, canhão na base
3. **Botão de disparo** — grande, na base

### Fluxo
1. Criança aperta o canhão → tiro sai → **um** balão estoura
2. No instante do estouro: o numeral salta grande na tela **e** a voz fala ("um!")
3. Repete a cada disparo — "dois!", "três!"
4. Quando o último balão estoura, celebração

### Por que este exercício é diferente de contar objetos parados
Aqui a contagem é **ritmo motor**: cada ação produz exatamente um número, em sequência. É assim que a criança internaliza o canto numérico — não olhando, mas **fazendo no tempo certo**.

### Regra crítica
Um disparo = um balão = um número. **Nunca dois balões num tiro** — quebraria a correspondência um-a-um que é o coração da competência.

### Escada
| Nível | Balões | Apoio |
|---|---|---|
| 1 | 3 | numeral grande + voz + Mão Fantasma disparando junto |
| 2 | 5 | numeral + voz |
| 3 | 10 | numeral + voz |
| 4 | 10 | só voz, sem numeral na tela |
| 5 | 10, começando de outro número | "continue de 4: cinco, seis..." |

---

## FICHA 28 — AMIGOS DO 10 (Fechadura Mágica)
**Competência:** N1.11 · **Primitiva:** `TenFrame` · **Tema:** dojo (pergaminho, lanterna)

### Como fica na tela
```
     Quantos faltam para fechar a caixa?

     +----+----+----+----+----+
     | ** | ** | ** | ** | ** |
     +----+----+----+----+----+
     | ** | ** | ** |    |    |
     +----+----+----+----+----+

     (1)(2)(3)(4)(5)(6)(7)(8)(9)(10)
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantos faltam para fechar a caixa?"
2. **Moldura de 10** — N células preenchidas, as demais **visivelmente vazias**
3. **Opções** — numerais

### Por que é a competência mais importante de F1
Os amigos do 10 são o que permite calcular **de cabeça**. Sem eles, toda soma que atravessa a dezena vira contagem nos dedos. O Manual chama de "estratégia-rainha".

### Escada
| Nível | Formato |
|---|---|
| 1 | moldura, com Mão Fantasma contando os vazios |
| 2 | moldura, sozinha |
| 3 | number bond (10 em cima, uma parte dada, outra vazia) |
| 4 | símbolo: "7 + ☐ = 10" |
| 5 | símbolo, com tempo-alvo (vira trilha FD1 do Dojo) |

### Distratores
- `10 − n − 1` e `10 − n + 1` → tag `OFF_BY_ONE`
- o próprio `n` (repetir o que viu) → tag `REPETE_A_PARTE`

---

## FICHA 29 — MAIOR, MENOR, IGUAL (o Jacaré)
**Competência:** N2.03 · **Primitiva:** `Grupo` ×2 + símbolo · **Tema:** jacaré comilão

### Como fica na tela
```
     O jacare come sempre o MAIOR. Para onde ele olha?

     +-----------+           +-----------+
     |     7     |           |     4     |
     +-----------+           +-----------+

              (  >  )  (  <  )  (  =  )
```

### ESTRUTURA DA TELA
1. **Enunciado** — "O jacaré come sempre o maior. Para onde ele olha?"
2. **Dois números** em contêineres de tamanho idêntico
3. **Três opções de símbolo** — `>`, `<`, `=`

### Por que o jacaré funciona
A boca aberta aponta para o maior. É mnemônico **e** semântico: o símbolo tem forma de boca. A criança não decora "maior que" — ela vê o bicho comendo.

### Escada
| Nível | O que compara |
|---|---|
| 1 | dois grupos de objetos (concreto) |
| 2 | grupo vs numeral |
| 3 | dois numerais até 20 |
| 4 | dois numerais até 100 |
| 5 | expressões ("3+4" vs "5+1") |

---

## FICHA 30 — CONTAGEM POR SALTOS
**Competência:** AL.03 · **Primitiva:** `InteractiveNumberLine` · **Tema:** espaço (foguete pulando planetas)

### Como fica na tela
```
     Pule de 2 em 2!

     <--+--+--+--+--+--+--+--+--+--+-->
        0  1  2  3  4  5  6  7  8  9

          _/\_    _/\_    _/\_
        0 --> 2 --> 4 --> [ ? ]
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Pule de 2 em 2!"
2. **Reta numérica** com os saltos já feitos desenhados em arco
3. **Caixa de resposta** — o próximo número da sequência

### Por que é a ponte para a multiplicação
Contar de 2 em 2, 5 em 5, 10 em 10 é **multiplicação antes do símbolo**. E é o que faz o relógio de minutos e a tabuada fazerem sentido depois.

### Escada
| Nível | Salto | Apoio |
|---|---|---|
| 1 | de 2 em 2 até 10 | reta + arcos desenhados |
| 2 | de 10 em 10 até 100 | reta |
| 3 | de 5 em 5 até 50 | reta |
| 4 | qualquer, sem reta | só a sequência escrita |
| 5 | começando de número diferente ("de 3 em 3 a partir do 6") | nenhum |

---

## FICHA 31 — GRUPOS IGUAIS (entrada da multiplicação)
**Competência:** N4.01 · **Primitiva:** `ArrayGrid` · **Tema:** resgate (caixas de equipamento)

### Como fica na tela
```
     Quantas caixas ao todo?

     +-------+  +-------+  +-------+
     | O  O  |  | O  O  |  | O  O  |
     +-------+  +-------+  +-------+

     3 grupos de 2

          3 x 2 = [    ]
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantas caixas ao todo?"
2. **Grupos idênticos** — cada um num contêiner, **todos com a mesma quantidade**
3. **Frase de leitura** — "3 grupos de 2" (é o que dá nome à operação)
4. **A conta** — "3 × 2 = ☐"

### Por que a frase "3 grupos de 2" é obrigatória
É ela que ensina o que a multiplicação **significa**. Sem ela, "3 × 2" é só um símbolo novo. Com ela, a criança lê a conta em voz alta e entende.

### Escada
| Nível | Formato |
|---|---|
| 1 | grupos separados em contêineres, conta soma repetida (2+2+2) |
| 2 | grupos separados, conta multiplicação |
| 3 | arranjo retangular (linhas × colunas) |
| 4 | só o símbolo |
| 5 | símbolo com tempo-alvo (trilha FD do Dojo) |

# 🌱 O JARDIM DO DOJO — TREINO PRÉ-SIMBÓLICO (4-6 anos)

**Por que esta seção existe:** as fichas F0-F2 são de **aula** (Academia — onde a criança aprende). O Jardim é de **treino** (Dojo — onde ela automatiza). Uma criança de 4-5 anos ainda não lê numeral com fluência, então não pode treinar nas trilhas FD (que exigem símbolo). O Jardim é a ala do Dojo feita para ela: **rápido, visual, sem leitura, sem conta escrita.**

**Diferença de ritmo:** a aula é longa e explicativa. O Jardim é **curto e veloz** — rodadas de 60 a 90 segundos, item aparece e some, sem tutorial no meio. É academia, não sala de aula.

**Regras do Jardim (valem para as 5 fichas):**
- rodada curta: 8 a 12 itens, nunca mais
- **sem cronômetro visível** antes dos 7 anos (o tempo existe no motor, não na tela)
- os **3 últimos itens são sempre fáceis** — a rodada termina em vitória
- erro nunca interrompe: mostra o certo por um instante e segue
- sem comparação com outras crianças, nunca

---

## FICHA JD1 — OLHÔMETRO RELÂMPAGO
**Competência:** N1.03 (subitização perceptual) · **Primitiva:** `EmojiRow` (modo flash) · **Trilha Dojo:** JD1

### Como fica na tela
```
        Quantos voce viu?

     +---------------------+
     |                     |
     |      O     O        |   <- aparece por 0,8s e SOME
     |                     |
     +---------------------+

        (1)    (2)    (3)
```

### ESTRUTURA DA TELA
1. **Enunciado curto** — "Quantos você viu?" (falado, aparece antes do flash)
2. **Área de flash** — retângulo neutro. Os objetos aparecem por **0,8 a 1,5 segundo** e desaparecem. A área fica vazia enquanto ela responde.
3. **Opções** — 2 a 3 numerais, na base

### Por que o tempo curto é a competência
Subitizar é reconhecer a quantidade **sem contar**. Se o objeto fica na tela, a criança conta um por um e a competência não é treinada. **O sumiço é o exercício.**

### Escada (perceptual — sobe por automaticidade)
| Nível | Quantidade | Tempo de exposição | Arranjo |
|---|---|---|---|
| 1 | 1 a 2 | 1,5s | fila |
| 2 | 1 a 3 | 1,2s | fila |
| 3 | 1 a 4 | 1,0s | padrão de dado |
| 4 | 1 a 5 | 0,8s | padrão de dado |
| 5 | 1 a 5 | 0,6s | disperso |

`excecaoCPA: "perceptual"` — não vira abstrato; vira mais rápido.

### Distratores
`n+1` e `n−1` (tag `OFF_BY_ONE`) — o erro clássico de quem tentou contar e perdeu.

---

## FICHA JD2 — MÃO RELÂMPAGO
**Competência:** N1.08 (sub-base 5) · **Primitiva:** `EmojiRow` (modo flash, tema mão) · **Trilha Dojo:** JD2

### Como fica na tela
```
        Quantos dedos?

     +---------------------+
     |                     |
     |       (mao)         |   <- pisca 1s e some
     |                     |
     +---------------------+

     (1) (2) (3) (4) (5)
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantos dedos?"
2. **Área de flash** — uma mão desenhada com N dedos levantados, aparece por ~1s e some
3. **Opções** — numerais de 1 a 5 (ou até 10 com as duas mãos)

### Por que a mão e não bolinhas
A mão é o **primeiro ábaco da criança** e tem estrutura fixa: 5 de um lado, 5 do outro. Treinar aqui constrói a **âncora do 5**, que é pré-requisito da moldura de 10 e dos amigos do 10.

### Escada
| Nível | O que mostra |
|---|---|
| 1 | 1 a 3 dedos, uma mão |
| 2 | 1 a 5 dedos, uma mão |
| 3 | 5 + N (uma mão cheia + alguns) — ensina o "5 e mais" |
| 4 | duas mãos, até 10 |
| 5 | duas mãos, até 10, 0,6s |

**O nível 3 é o mais importante:** ver "5 e mais 2" em vez de contar 7 é a semente do cálculo mental.

---

## FICHA JD3 — MOLDURA RELÂMPAGO
**Competência:** N1.08, N1.11 · **Primitiva:** `TenFrame` (modo flash) · **Trilha Dojo:** JD3

### Como fica na tela
```
        Quantos pontos?

     +----+----+----+----+----+
     | ** | ** | ** | ** |    |   <- pisca 1s e some
     +----+----+----+----+----+
     |    |    |    |    |    |
     +----+----+----+----+----+

     (1)(2)(3)(4)(5)(6)(7)(8)(9)(10)
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantos pontos?"
2. **A moldura de 10** — preenchida da esquerda para a direita, aparece por ~1s e some (a moldura vazia permanece, só os pontos somem)
3. **Opções** — numerais até 10

### Por que a moldura vazia continua na tela
A criança usa a **estrutura** para lembrar: "a fileira de cima estava cheia, então eram 5, e mais 2 embaixo". A moldura é o andaime de memória.

### Variação de nível 4-5 — "quantos faltam?"
Mesma tela, pergunta invertida: *"Quantos faltam para encher?"* — é a **semente direta dos amigos do 10** (N1.11).

---

## FICHA JD4 — PRÓXIMO PASSO
**Competência:** N1.02, N1.07 (canto numérico e sucessor) · **Primitiva:** `AudioChoice` + `NumberLine` · **Trilha Dojo:** JD4

### Como fica na tela
```
     Escute e diga o que vem DEPOIS.

          +---------+
          |   SOM   |     <- fala "cinco..."
          +---------+

        (4)    (6)    (7)
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Escute e diga o que vem depois."
2. **Botão de áudio** — a voz fala um número ("cinco")
3. **Opções** — 3 numerais, um deles o sucessor

### Por que é áudio e não texto
O canto numérico é **ritmo oral** antes de ser símbolo. A criança de 4 anos sabe recitar "um, dois, três..." muito antes de reconhecer o "3" escrito. Treinar por áudio respeita a ordem real do desenvolvimento.

### Escada
| Nível | O que treina |
|---|---|
| 1 | sucessor até 5, com a reta visível como apoio |
| 2 | sucessor até 10, reta visível |
| 3 | sucessor até 10, **sem** reta |
| 4 | antecessor ("o que vem antes") |
| 5 | alternando sucessor e antecessor, mais rápido |

---

## FICHA JD5 — VER E IMAGINAR
**Competência:** N1.10, N3.01 (parte-todo mental) · **Primitiva:** `TenFrame` + `EmojiRow` (flash duplo) · **Trilha Dojo:** JD5

### Como fica na tela
```
     Quantos ficaram escondidos?

     +---------------------+
     |   O  O  O  O  O     |   <- mostra 5 por 1s
     +---------------------+
              |
              v
     +---------------------+
     |   O  O  [ ? ? ? ]   |   <- parte fica coberta
     +---------------------+

        (1) (2) (3) (4) (5)
```

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantos ficaram escondidos?"
2. **Primeiro flash** — o grupo completo aparece por ~1s
3. **Segundo estado** — uma parte do grupo fica **coberta por uma tampa**; a outra continua visível
4. **Opções** — numerais

### Por que esta é a mais avançada do Jardim
Exige **manter a quantidade total na cabeça** e deduzir a parte que sumiu. É subtração e parte-todo **antes de existir símbolo**. É a ponte direta para N1.10 (number bond) e para toda a adição mental.

### Escada
| Nível | Total | O que esconde |
|---|---|---|
| 1 | até 3 | esconde 1 |
| 2 | até 5 | esconde 1 ou 2 |
| 3 | até 5 | esconde qualquer parte |
| 4 | até 10 | esconde qualquer parte |
| 5 | até 10 | mais rápido, sem a moldura de apoio |

---

## COMO O JARDIM SE LIGA AO RESTO DO APP

| Situação | O que acontece |
|---|---|
| Criança de 4-5 anos entra no Dojo | vê **só o Jardim** (JD1-JD5). As trilhas FD e PD nem aparecem. |
| Uma competência-mãe chega ao nível 4 | a trilha FD correspondente **abre** e passa a aparecer ao lado do Jardim |
| Criança de 6 anos travada no nível 2-3 dos Amigos do 10 | a trilha FD1 **não abre** — mas o **JD3 (Moldura Relâmpago)** está disponível e treina exatamente o pré-requisito. **É esta a ponte que faltava.** |
| Radar detecta padrão de erro | Missão de Resgate na Oficina, com o item do Jardim correspondente |

**A regra que resolve o caso do filho de 6 anos:** quando uma trilha FD está bloqueada por falta de nível na competência-mãe, o Dojo oferece **a ficha do Jardim que treina aquele pré-requisito**. A criança nunca fica sem ter o que treinar.

---

---

# 📦 F2/F3 — MULTIPLICAÇÃO, DIVISÃO, FRAÇÕES E LÓGICA
*(fichas 32 a 43 — construídas a partir do Manual + pesquisa nas listas de habilidades do IXL)*

## FICHA 32 — QUADRO DE 100
**Competência:** N2.02, AL.03 · **Primitiva:** `Quadrado100` · **Tema:** dojo (pergaminho numerado)

### ESTRUTURA DA TELA
1. **Enunciado** — "Comece no 34 e conte de 10 em 10."
2. **Quadro de 100** — grade 10×10 com os números de 1 a 100. A casa de partida vem **destacada**. As casas do caminho ficam vazias para a criança tocar.
3. **Sem teclado** — a resposta é tocar nas casas certas do próprio quadro

### Como fica na tela
```
     Comece no 34 e conte de 10 em 10.

      1  2  3  4  5  6  7  8  9 10
     11 12 13 14 15 16 17 18 19 20
     21 22 23 24 25 26 27 28 29 30
     31 32 33[34]35 36 37 38 39 40
     41 42 43 [ ] 45 46 47 48 49 50
     51 52 53 [ ] 55 56 57 58 59 60
```

### Por que este é um instrumento e não um exercício
O quadro de 100 **mostra a estrutura do sistema decimal**: andar uma casa para a direita é +1, andar uma linha para baixo é +10. A criança vê o padrão em vez de decorar. É a ponte entre contar e valor posicional.

### Variações
`contar de 2/5/10 em 10` · `achar o vizinho de baixo (+10)` · `casas escondidas para preencher` · `caminho do 1 ao 100`

---

## FICHA 33 — GRUPOS IGUAIS (multiplicação como repetição)
**Competência:** N4.01 · **Primitiva:** `Grupo` ×N · **Tema:** resgate (kits de bombeiro)

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantos ao todo?"
2. **N contêineres idênticos**, cada um com a mesma quantidade
3. **Frase de leitura** — "3 grupos de 2" *(obrigatória — é ela que nomeia a operação)*
4. **A conta** — nível 1-2: soma repetida (2+2+2). Nível 3+: multiplicação (3×2)

### Como fica na tela
```
     Quantos ao todo?

     +-------+  +-------+  +-------+
     | O  O  |  | O  O  |  | O  O  |
     +-------+  +-------+  +-------+

           3 grupos de 2

        2 + 2 + 2 = [    ]     <- nivel 1-2
            3 x 2 = [    ]     <- nivel 3+
```

### A transição que ensina
No nível 1-2 a criança escreve a **soma repetida**. No nível 3 a mesma tela mostra as duas formas lado a lado. No nível 4, só a multiplicação. **É assim que × deixa de ser símbolo novo e vira atalho de algo conhecido.**

---

## FICHA 34 — ARRANJO RETANGULAR
**Competência:** N4.02 · **Primitiva:** `ArrayGrid` · **Tema:** esporte (bolas na caixa) ou espaço (painel solar)

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantas bolas há na caixa?"
2. **Grade retangular** de objetos, linhas × colunas regulares
3. **A conta** — "4 × 3 = ☐"

### Como fica na tela
```
     Quantas bolas ha na caixa?

     O  O  O  O
     O  O  O  O      <- 3 linhas de 4
     O  O  O  O

           3 x 4 = [    ]
```

### Por que o arranjo é a representação-rainha da multiplicação
Girando o retângulo, 3×4 vira 4×3 **com os mesmos objetos**. A comutatividade deixa de ser regra decorada e vira fato visível. **A ficha deve ter um botão de girar** no nível 3+.

### Ligação com área
O mesmo arranjo, com quadradinhos encostados, é a fórmula da área. Não precisa exercício novo: é parâmetro (`modo: area`).

---

## FICHA 35 — DIVIDIR REPARTINDO (partição)
**Competência:** N4.05 · **Primitiva:** `DragGroup` (modo repartir) · **Tema:** resgate (dividir suprimentos)

### ESTRUTURA DA TELA
1. **Enunciado** — "Reparta 12 caixas igualmente entre 3 caminhões."
2. **Estoque** — os 12 objetos juntos, em cima
3. **N destinos** — 3 contêineres vazios, embaixo
4. **A conta** — aparece ao terminar: "12 ÷ 3 = ☐"

### Como fica na tela
```
     Reparta 12 caixas entre 3 caminhoes.

     O O O O O O O O O O O O      <- estoque

     +--------+ +--------+ +--------+
     |        | |        | |        |
     +--------+ +--------+ +--------+
```

### A regra da distribuição
A criança arrasta **um de cada vez, rodando pelos destinos** (um pra cada, como no pareamento). Se ela puser 5 num e 2 noutro, o sistema não bloqueia — deixa terminar e pergunta: *"ficaram iguais?"*. **Descobrir o desequilíbrio é o aprendizado.**

### ⚠️ Esta ficha e a 36 NÃO podem ser a mesma
Repartir ("12 entre 3") e medir ("quantos grupos de 3 cabem em 12") dão o mesmo resultado e são perguntas cognitivamente diferentes. Tratá-las como um exercício só é o erro clássico do ensino de divisão.

---

## FICHA 36 — DIVIDIR MEDINDO (quantos cabem)
**Competência:** N4.06 · **Primitiva:** `DragGroup` (modo laçar) · **Tema:** dojo (formar equipes)

### ESTRUTURA DA TELA
1. **Enunciado** — "Quantas equipes de 3 dá para formar com 12 alunos?"
2. **Estoque** — os 12 objetos espalhados
3. **A ação** — a criança **laça grupos de 3** (arrasta um círculo em volta, ou toca 3 e eles se agrupam)
4. **Contador de grupos** — aparece à medida que ela forma
5. **A conta** — "12 ÷ 3 = ☐"

### Como fica na tela
```
     Quantas equipes de 3 da para formar?

     (O O O)  (O O O)   O  O  O   O  O  O
      equipe   equipe    <- ainda soltos

     Equipes formadas: 2
```

### A diferença que importa
Na Ficha 35 a criança sabe **quantos grupos** e descobre **o tamanho**. Aqui ela sabe **o tamanho** e descobre **quantos grupos**. São os dois rostos da divisão — e a criança precisa reconhecer os dois para resolver problemas.

### O resto aparece naturalmente
Se sobrarem objetos que não formam grupo completo, eles ficam **piscando de lado**. É assim que o resto entra: como o que sobrou, visível.

---

## FICHA 37 — BARRAS DE FRAÇÃO
**Competência:** N5.01, N5.02 · **Primitiva:** `SingaporeBars` (modo fração)

### ESTRUTURA DA TELA
1. **Enunciado** — "Qual barra mostra 3/4?"
2. **Opções** — 3 barras horizontais de **mesmo comprimento**, divididas em partes iguais, com algumas partes preenchidas
3. Ou, no modo produzir: **uma barra** e a criança pinta as partes

### Como fica na tela
```
     Qual barra mostra 3/4?

     +----+----+----+----+
     |####|####|####|    |     <- 3 de 4
     +----+----+----+----+

     +----+----+----+----+
     |####|####|    |    |     <- 2 de 4
     +----+----+----+----+
```

### ⚠️ PIZZA PARA APRESENTAR, BARRA PARA OPERAR

Cada formato serve a um momento, e trocá-los é o erro:

**A pizza (ou bolo, ou chocolate) — níveis 1 e 2.** É a experiência de vida da criança: ela já dividiu pizza, já brigou por pedaço maior. O círculo carrega significado concreto e afetivo que a barra não tem. **Para apresentar a ideia de fração, a pizza é insubstituível.**

**A barra — níveis 3 em diante.** Para *comparar* (1/3 vs 2/5) e para *operar*, a barra vence: comprimentos se comparam direto, ângulos não. E a barra tem a mesma forma da reta numérica — então 3/4 na barra e 3/4 na reta são visivelmente a mesma coisa, o que a pizza nunca consegue mostrar.

**A transição é ela própria um exercício.** Mostrar a mesma fração como pizza e como barra, lado a lado, e perguntar "são iguais?" — é assim que a criança entende que fração não é um desenho, é uma quantidade.

```
     A mesma fracao, dois formatos:

        (pizza 3/4)        +----+----+----+----+
                           |####|####|####|    |
                           +----+----+----+----+
```

---

## FICHA 38 — PARTES IGUAIS
**Competência:** N5.01 · **Primitiva:** `ShapeCanvas` (modo partição)

### ESTRUTURA DA TELA
1. **Enunciado** — "Estas figuras estão divididas em partes IGUAIS?"
2. **Figuras** — algumas com divisões iguais, outras com divisões desiguais
3. **Resposta** — tocar nas que estão certas (seleção múltipla)

### Como fica na tela
```
     Quais estao divididas em partes IGUAIS?

     +---+---+     +---+------+     +--+--+--+
     |   |   |     |   |      |     |  |  |  |
     +---+---+     +---+------+     +--+--+--+
       (sim)         (nao)            (sim)
```

### Por que vem antes de nomear a fração
"Um meio" só faz sentido se as duas partes forem iguais. Criança que não vê isso acha que qualquer divisão em 2 é metade. **Esta ficha cura essa confusão antes de introduzir o símbolo.**

---

## FICHA 39 — FRAÇÃO NA RETA NUMÉRICA
**Competência:** N5.03 · **Primitiva:** `InteractiveNumberLine` (modo fração)

### ESTRUTURA DA TELA
1. **Enunciado** — "Onde fica 3/4 na reta?"
2. **Reta de 0 a 1** com marcas nos quartos
3. **Marcador arrastável**

### Como fica na tela
```
     Onde fica 3/4 na reta?

     |----+----+----+----|
     0                   1
             ^ arraste o marcador
```

### A ideia que esta ficha instala
Fração **é número**, tem lugar na reta. Sem isso, a criança trata fração como "desenho de pedaço" e nunca entende por que 1/2 + 1/2 = 1.

---

## FICHA 40 — SEPARAR POR ATRIBUTO (Diagrama de Laços)
**Competência:** AL.01, PE.01 · **Primitiva:** `DragGroup` (modo laços)

### ESTRUTURA DA TELA
1. **Enunciado** — "Coloque cada peça no lugar certo."
2. **Objetos variados** — diferem em forma, cor e tamanho
3. **Um ou dois laços** (círculos grandes) rotulados: "vermelhos", "grandes"
4. **Área de fora** — o que não pertence a nenhum laço fica fora, e isso é parte da resposta

### Como fica na tela
```
     Coloque cada peca no lugar certo.

     O  #  O  #  O                <- pecas variadas

       +-----------+
       | vermelhos |
       |           |
       +-----------+
                      <- o que nao e vermelho fica FORA
```

### O que se ensina aqui, e quase ninguém ensina
O **"não pertence"** é tão importante quanto o "pertence". Colocar corretamente fora do laço é resposta certa. No nível 4-5, **dois laços que se cruzam** — e a interseção (vermelho E grande) é o degrau mais difícil do raciocínio lógico infantil.

---

## FICHA 41 — DESCOBRIR A ORDEM (dedução)
**Competência:** AL.02 · **Primitiva:** `DragGroup` (modo ordenar)

### ESTRUTURA DA TELA
1. **Enunciado** — "Use as pistas para descobrir a ordem."
2. **Pistas** — 2 a 3 frases curtas, narradas: *"O dino verde chegou antes do azul."* · *"O vermelho chegou por último."*
3. **Pódio/fila** com posições vazias
4. **Peças** para arrastar

### Como fica na tela
```
     Use as pistas para descobrir a ordem.

     "O verde chegou antes do azul."
     "O vermelho chegou por ultimo."

      1o      2o      3o
     [   ]   [   ]   [   ]

       (verde) (azul) (vermelho)
```

### Por que isto é matemática
Dedução lógica é o alicerce da demonstração e da álgebra. E é a única ficha do app onde **não existe conta nenhuma** — é raciocínio puro. Vale como respiro na sessão.

---

## FICHA 42 — COMPLETAR O PADRÃO NUMÉRICO
**Competência:** AL.03, AL.04 · **Primitiva:** `EmojiRow` + `NumberLine`

### ESTRUTURA DA TELA
1. **Enunciado** — "Qual é o próximo número?"
2. **Sequência** com uma lacuna no fim (ou no meio, mais difícil)
3. **Opções** ou teclado

### Como fica na tela
```
     Qual e o proximo numero?

      2    4    6    8   [ ? ]

     (9)   (10)   (12)
```

### Progressão de dificuldade
| Nível | Padrão |
|---|---|
| 1 | +1 (1,2,3,4...) |
| 2 | +2, +5, +10 |
| 3 | lacuna **no meio** (2, 4, ☐, 8) |
| 4 | decrescente (20, 18, 16...) |
| 5 | multiplicativo (2, 4, 8, 16...) |

---

## FICHA 43 — GRÁFICO DE PONTOS (line plot)
**Competência:** PE.02, PE.03 · **Primitiva:** `SingaporeBars` (modo pontos)

### ESTRUTURA DA TELA
1. **Enunciado** — "Cada X é um aluno. Quantos têm 3 irmãos?"
2. **Reta numérica horizontal** com marcas
3. **Pilhas de X** acima de cada marca
4. **Caixa de resposta**

### Como fica na tela
```
     Cada X e um aluno. Quantos tem 3 irmaos?

           X
     X     X     X
     X     X     X     X
     +-----+-----+-----+
     1     2     3     4
        numero de irmaos

     Resposta: [    ]
```

### Por que este formato importa
É o primeiro gráfico onde **cada dado é um indivíduo visível** — a criança conta X, não lê uma barra abstrata. Ponte natural entre contar e estatística.

---

# ⚠️ NOTA SOBRE MULTIPLICAÇÃO E DIVISÃO

**O dossiê do IXL não cobre estas operações.** Verificado: zero exercícios de multiplicação ou divisão nas 130 telas. O material vai de Pre-K (75 telas) a Grade 1 (22 telas), e multiplicação/divisão só começam no 2º-3º ano.

**O que isso significa na prática:**

- As fichas de **adição e subtração** deste documento têm respaldo visual de um produto real, testado com milhões de crianças.
- As fichas de **multiplicação e divisão** (F31 e F33 a F36) foram construídas a partir do **Manual Didático + pesquisa nas listas de habilidades do IXL**, já que as telas não estavam no dossiê.

**Por que isso é bom, e não ruim:** o Manual do SAGA trata multiplicação e divisão com profundidade que o IXL não tem — os "dois rostos" da divisão (repartir vs medir), o arranjo retangular, a comutatividade visual. Nesta parte do currículo **nós somos a referência**, não o IXL.

**A ordem correta de construção destas fichas:**

| Ordem | Competência | Ficha | Mecânica base |
|---|---|---|---|
| 1 | N4.01 grupos iguais | **F31** (já escrita) | `ArrayGrid` — grupos em contêineres |
| 2 | N4.02 arranjo retangular | a escrever | `ArrayGrid` — linhas × colunas, comutatividade |
| 3 | N4.05 divisão por partição | a escrever | `DragGroup` — repartir igualmente entre caixas |
| 4 | N4.06 divisão por medida | a escrever | `DragGroup` — laçar grupos de tamanho fixo |
| 5 | N4.08+ algoritmos | a escrever | `InteractiveVertical` |

**O ponto crítico da divisão (do Manual):** partição ("reparta 12 entre 3 amigos") e medida ("quantos grupos de 3 cabem em 12") **dão o mesmo resultado mas são perguntas diferentes**. Precisam de fichas separadas, com mecânicas distintas — arrastar-um-a-um vs laçar-grupos. Tratar como um só exercício é o erro clássico.

# 🗺️ SEQUÊNCIA DE APRENDIZADO — a ordem em que a criança encontra as fichas

Esta é a espinha do app: **o que vem antes do quê**. Cada linha só abre quando a anterior está firme (nível ≥3 nos pré-requisitos).

## Trilha do começo absoluto (4 anos, nunca usou o app)

| # | Ficha | Competência | O que a criança conquista |
|---|---|---|---|
| 1 | **F07** Parear um pra cada | N1.01 | "tem um pra cada?" — antes de existir número |
| 2 | **F27** Canto Numérico (canhão) | N1.02 | recitar a ordem: um, dois, três... |
| 3 | **JD1** Olhômetro Relâmpago | N1.03 | bater o olho e saber quantos (até 3) |
| 4 | **F01** Contar tocando | N1.04 | tocar cada um e chegar no total |
| 5 | **F03** Contar (fila → grade → disperso) | N1.04 | contar sem perder o fio |
| 6 | **F06** Comparar dois grupos | N1.05 | mais / menos / igual |
| 7 | **F05** Ouvir e escolher | N1.06 | ligar o som do número ao símbolo |
| 8 | **JD4** Próximo Passo | N1.07 | o que vem depois |
| 9 | **F02 / JD2 / JD3** Moldura e Mão | N1.08 | a âncora do 5 e do 10 |
| 10 | **F04** Produzir quantidade | N1.09 | "me dê 3" — produzir, não só ler |
| 11 | **JD5** Ver e Imaginar | N1.10 | parte-todo mental |
| 12 | **F28** Amigos do 10 | N1.11 | a estratégia-rainha |
| 13 | **F19** Reta com saltos | N1.12 | o número como posição |

**Em paralelo, sem depender da trilha acima:** F10 (posição), F09 (padrões), F11 (classificar), F12 (tamanho e peso). São as strands GE, AL e GM — abrem cedo e dão variedade.

## Trilha das operações (5-7 anos)

| # | Ficha | Competência | Conquista |
|---|---|---|---|
| 14 | **F13** Juntar dois grupos | N3.01 | a adição como juntar |
| 15 | **F14** Trem de cubos | N3.03 | contar a partir do maior |
| 16 | **F16** Decompor número | N3.05 | o mesmo número de várias formas |
| 17 | **F15** Subtrair riscando | N3.09 | a subtração como tirar |
| 18 | **F17 / F18** Escolher e escrever a sentença | N3.04 | ler e escrever a linguagem da conta |
| 19 | **F20** História em 3 painéis | N3.10 | traduzir situação em conta |
| 20 | **F29** Maior, menor, igual | N2.03 | comparar com símbolo |
| 21 | **F30** Contagem por saltos | AL.03 | a ponte para a multiplicação |
| 22 | **F21** Valor posicional | N2.01 | dezena como grupo de dez |
| 23 | **F22** Conta armada | N3.11 | o algoritmo, com a dezena explodindo |

## Trilha do mundo multiplicativo (7-9 anos)

| # | Ficha | Competência | Conquista |
|---|---|---|---|
| 24 | **F31** Grupos iguais | N4.01 | multiplicação como grupos |
| 25 | **F23** Frações | N5.01 | a parte do todo |
| 26 | **F24 / F25** Relógio e dinheiro | GM.04, GM.07 | medida no cotidiano |
| 27 | **F26** Dados e gráficos | PE.01 | ler e produzir informação |

## Onde o Dojo entra

O Jardim (JD1-JD5) roda **em paralelo desde o dia 1** — é onde a criança treina o que já viu na aula. As trilhas FD (fatos) só abrem quando a competência-mãe chega ao nível 4.

**Regra da ponte:** se uma trilha FD está bloqueada, o Dojo oferece a ficha do Jardim que treina aquele pré-requisito. **A criança nunca fica sem ter o que treinar.**

# 🛠️ ORDEM DE CONSTRUÇÃO RECOMENDADA

| Ordem | O que construir | Por quê |
|---|---|---|
| 1 | `Grupo` (contêiner com borda) | Barato, e muda a cara de metade dos exercícios |
| 2 | `Sentenca` (alinhamento vertical) | É o "passarinho vermelho" — a Ficha 13 |
| 3 | `TouchCount` (ordem livre) | Resolve o "toca e não acontece nada" |
| 4 | `TouchPlace` | Completa a base de F0 |
| 5 | `AudioChoice` | Nossa premissa áudio-first exige |
| 6 | Campos `arranjo` / `escopo_teclado` na ficha | Multiplica variedade sem código novo |
| 7 | `SentenceBuilder`, `StoryPanel` | Abrem F1 |
| 8 | Balança, Relógio, Quadrado100, ShapeCanvas | Abrem F2 e GE/GM |

---

*Este documento é autossuficiente: contém o desenho, os elementos, o fluxo e a regra pedagógica de cada exercício. Não requer as imagens originais.*

---
---

# 📕 PARTE II — AS 40 FICHAS COMPLEMENTARES
*Organizadas a partir da análise de lacunas (IXL Pre-K a Grade 5, Common Core, BNCC). O documento original tinha numeração duplicada e dois rascunhos sobrepostos — aqui está deduplicado e sequenciado.*

## ⚠️ ANTES: 11 COMPETÊNCIAS NOVAS QUE O GRAFO PRECISA GANHAR

A análise revelou lacunas no **currículo**, não só nas fichas. Estas competências são referenciadas pelas fichas novas e **não existem no Grafo atual (84 nós)**:

| Nova | Nome | Onde encaixa |
|---|---|---|
| **N2.06** | Números pares e ímpares | depois de N2.03 (comparar) |
| **N2.07** | Fatores de um número | depois de N4.02 (arranjo) |
| **N2.08** | Múltiplos e contagem por saltos | ao lado de AL.03 |
| **N5.06** | Adição e subtração de frações (mesmo denominador) | depois de N5.03 |
| **N5.07** | Frações equivalentes | depois de N5.02 |
| **N5.08** | Comparar frações (denominadores diferentes) | depois de N5.07 |
| **N7.03** | Razão e proporção | depois de N4.12 |
| **N7.04** | Porcentagem | depois de N6.03 |
| **GM.10** | Conversão de unidades | depois de GM.05 |
| **GM.11** | Volume de prismas | depois de GM.09 |
| **PE.05** | Probabilidade e chance | depois de PE.04 |

**O Grafo passa de 84 para 95 nós.** Isso exige atualizar `GRAFO_DE_CONHECIMENTO_SAGA.md` e `grafo_saga.yaml` com os nós, pré-requisitos e faixas.

---

# 🅰️ BLOCO F0/F1 — FUNDAMENTOS QUE FALTAVAM (C01–C05)

## C01 — FORMAS 2D E 3D: RECONHECER E NOMEAR
**Competências:** GE.01, GE.02 · **Primitiva:** `ShapeCanvas` · **Faixa:** F0

**Tela:** enunciado ("Qual é o círculo?") + 3 formas em contêineres idênticos.
**Escada:** 1-2 formas puras coloridas → 3 formas no mundo real (roda, janela, bola) → 4 nomear sem apoio → 5 formas 3D (cubo, esfera, cilindro).
**Melhoria:** a mesma forma aparece **girada** em ângulos diferentes desde o nível 2. Criança que só vê o triângulo "em pé" não reconhece de cabeça pra baixo.

## C02 — COMPOR FORMAS (Quebra-Cabeça)
**Competência:** GE.03 · **Primitiva:** `ShapeCanvas` (modo tangram) · **Faixa:** F1

**Tela:** silhueta-alvo em cima, peças soltas embaixo, a criança arrasta e encaixa.
**Escada:** 1 duas peças com contorno guia → 3 quatro peças sem guia → 5 peças que precisam girar.
**Por que importa:** compor e decompor formas é a base geométrica de fração e área.

## C03 — MEDIR COM OBJETOS NÃO-PADRÃO (Fita de Dino)
**Competência:** GM.02 · **Primitiva:** `Regua` (modo informal) · **Faixa:** F0

**Tela:** um objeto e uma fileira de "unidades" (pegadas, clipes, cubos) para enfileirar embaixo dele.
**A regra que se ensina:** as unidades precisam ficar **encostadas e sem sobra** — se houver buraco, a medida está errada. É o conceito de unidade de medida antes da régua.

## C04 — RECONHECER DINHEIRO (O Tesouro do Pirata)
**Competência:** GM.07 · **Primitiva:** `Moedas` · **Faixa:** F1

**Tela:** moedas espalhadas, pergunta pelo valor ou pela moeda ("qual vale 50 centavos?").
**Escada:** 1 reconhecer a moeda → 2 somar moedas iguais → 3 somar diferentes → 4 até R$ 5 → 5 comparar dois conjuntos.
**Detalhe:** moedas brasileiras reais, tamanho proporcional ao real.

## C05 — DIA E NOITE, DIAS DA SEMANA (O Calendário do Dojo)
**Competência:** GM.03 · **Primitiva:** `ShapeCanvas` (cena) · **Faixa:** F0

**Tela:** cena (café da manhã, escola, dormir) + opções de período; ou calendário semanal com um dia faltando.
**Por que vem antes do relógio:** tempo é primeiro **sequência de eventos**, depois número. A criança entende "depois do almoço" muito antes de "14 horas".

---

# 🅱️ BLOCO F2 — OPERAÇÕES E ALGORITMOS (C06–C15)

## C06 — ADIÇÃO COM REAGRUPAMENTO (A Dezena Explode)
**Competências:** N3.11, N3.12 · **Primitiva:** `InteractiveVertical` + `MaterialDourado` · **Faixa:** F2

**A ficha mais importante deste bloco.** A escada é o coração:
| Nível | O que a criança faz |
|---|---|
| 1 | monta 27+35 com material dourado; junta as unidades; vê 12 unidades; **troca 10 por 1 barra** com a mão |
| 2 | mesma coisa, com a Mão Fantasma sugerindo a troca |
| 3 | material dourado ao lado da conta armada, os dois sincronizados |
| 4 | só a conta armada, com o vai-um aparecendo animado |
| 5 | conta armada limpa, com tempo-alvo |

**A regra crítica:** a coluna ativa é sempre a da **direita** (unidades). E quando 10 unidades se juntam, elas **viram uma barra e sobem** visualmente para a coluna da dezena. Sem ver essa troca, a criança decora "vai um" sem entender.

## C07 — SUBTRAÇÃO COM REAGRUPAMENTO (A Dezena Desmonta)
**Competência:** N3.12 · **Primitiva:** `InteractiveVertical` + `MaterialDourado` · **Faixa:** F2

O espelho da C06: quando não dá para tirar, a criança **pega uma barra da dezena e quebra em 10 unidades**. A animação de desmontar é o conceito.
**Erro típico a detectar:** subtrair o menor do maior em cada coluna (fazer 5−3 quando é 3−5). Tag: `SUBTRAI_INVERTIDO`.

## C08 — PROPRIEDADES DAS OPERAÇÕES (O Equilibrista)
**Competências:** AL.05, N3.05 · **Primitiva:** `Balanca` + `ArrayGrid` · **Faixa:** F2

**Comutativa:** o arranjo retangular **gira** — 3×4 e 4×3, mesmos objetos.
**Associativa:** três grupos, a criança escolhe quais juntar primeiro e vê que dá igual.
**Distributiva:** o arranjo 7×6 **se parte** em 7×5 + 7×1 — é o modelo de área nascendo.
**Por que importa:** propriedade não é regra decorada, é **fato visível**. E a distributiva é a base de toda a multiplicação de 2 dígitos.

## C09 — PROBLEMAS DE DOIS PASSOS (A Ponte dos Números)
**Competência:** N3.10 · **Primitiva:** `StoryPanel` (modo duplo) · **Faixa:** F2

**Tela:** história em 3 painéis, mas com **duas perguntas encadeadas** — a resposta da primeira alimenta a segunda.
**O andaime que resolve:** no nível 1-2, a tela mostra **uma caixa intermediária** rotulada "primeiro descubra quantos sobraram". A criança preenche antes de responder a final. No nível 4 a caixa some.
**Por que trava tanta criança:** ela resolve o primeiro passo e responde aquilo, esquecendo a pergunta real.

## C10 — ATRIBUTOS DE FORMAS (O Detetive)
**Competências:** GE.04, GE.05 · **Primitiva:** `ShapeCanvas` · **Faixa:** F2

**Tela:** uma forma + afirmações com caixas de seleção múltipla ("tem 4 lados", "tem cantos quadrados", "tem parte curva").
**Melhoria:** ao selecionar, o atributo **acende na figura** — marcou "4 lados", os 4 lados piscam contados. O feedback é visual, não só certo/errado.

## C11 — MEDIR COM RÉGUA (O Arquiteto)
**Competência:** GM.05 · **Primitiva:** `Regua` · **Faixa:** F2

**Tela:** régua arrastável + objeto a medir.
**O erro que a ficha existe para curar:** começar a medir do "1" e não do **zero**. Nível 1-2 a régua já vem alinhada; nível 3+ a criança precisa alinhar, e se começar errado o tutor pergunta *"onde começa a régua?"*.

## C12 — TEMPO: MEIA-HORA E QUARTO DE HORA
**Competências:** GM.04, GM.06 · **Primitiva:** `Relogio` · **Faixa:** F2

**Escada:** 1 horas exatas → 2 meia-hora → 3 quartos → 4 de 5 em 5 minutos → 5 minuto a minuto.
**Detalhe visual obrigatório:** ponteiro das horas **curto e grosso**, minutos **longo e fino**, cores diferentes. E no nível 2+, o ponteiro das horas fica **entre dois números** quando é meia hora — é o que a criança precisa aprender a ler.

## C13 — TEMPO DECORRIDO (A Viagem do Foguete)
**Competência:** GM.06 · **Primitiva:** `Relogio` + `NumberLine` · **Faixa:** F3

**Tela:** relógio de partida, relógio de chegada, pergunta "quanto tempo passou?".
**A ferramenta que ensina:** uma **reta numérica de tempo** embaixo, onde a criança dá saltos de hora e de minuto. Transforma tempo decorrido em contagem, que ela já sabe.

## C14 — DINHEIRO: TROCO (O Caixa do Mercado)
**Competência:** GM.07 · **Primitiva:** `Moedas` + `NumberLine` · **Faixa:** F3

**Tela:** preço, valor pago, e a criança monta o troco com moedas.
**A estratégia que se ensina:** contar **para cima** a partir do preço (custou 7, pagou 10 → 8, 9, 10 = 3). É subtração por complemento — mais fácil e mais real que o algoritmo.

## C15 — PICTOGRAMA (O Contador de Animais)
**Competências:** PE.01, PE.02 · **Primitiva:** `SingaporeBars` (modo ícones) · **Faixa:** F2

**Tela:** tabela com ícones representando quantidades + perguntas.
**O degrau difícil:** quando **um ícone = 2 unidades** (a legenda). É a primeira vez que a criança lida com escala, e é onde quase todas erram. Nível 1-3 usa 1:1; nível 4-5 introduz a escala.

---

# 🅲 BLOCO F3 — MULTIPLICAÇÃO E DIVISÃO PROFUNDAS (C16–C21)

## C16 — FATOS DE MULTIPLICAÇÃO: FLUÊNCIA (Tabuada Relâmpago)
**Competência:** N4.03 · **Primitiva:** `plain` (modo rápido) · **Faixa:** F3 · **Também é trilha do Dojo**

**Escada por família, não por ordem:** 1 (×2, ×5, ×10 — as fáceis) → 2 (×1, ×0 — as regras) → 3 (×3, ×4) → 4 (×6, ×7, ×8, ×9 — as difíceis) → 5 (todas misturadas, com tempo).
**Por que essa ordem:** ×2, ×5 e ×10 têm padrão visível e cobrem metade da tabuada. Ensinar em ordem numérica (×1, ×2, ×3...) desperdiça isso.

## C17 — MODELO DE ÁREA (O Jardim)
**Competência:** N4.09 · **Primitiva:** `ArrayGrid` (modo área) · **Faixa:** F3

**Tela:** retângulo dividido em regiões, cada uma com sua conta parcial.
**O que resolve:** 13×4 vira (10×4) + (3×4). A criança **vê** a decomposição em vez de decorar o algoritmo.
**É a ponte para:** multiplicação de 2 dígitos, distributiva, e depois álgebra.

## C18 — MULTIPLICAÇÃO POR MÚLTIPLOS DÍGITOS (A Torre)
**Competência:** N4.10 · **Primitiva:** `InteractiveVertical` + `ArrayGrid` · **Faixa:** F3

**Escada:** 1-2 modelo de área com as parcelas visíveis → 3 área + algoritmo lado a lado → 4-5 só o algoritmo.
**A regra crítica:** nunca introduzir o algoritmo antes do modelo de área. Sem ele, o "zero da segunda linha" é mágica sem sentido.

## C19 — FAMÍLIA DE FATOS (A Família da Tabuada)
**Competências:** N4.04, N4.07 · **Primitiva:** `NumberBond` (modo triângulo) · **Faixa:** F3

**Tela:** um triângulo com três números (3, 4, 12) e as quatro contas que eles formam: 3×4=12, 4×3=12, 12÷3=4, 12÷4=3.
**O que instala:** multiplicação e divisão são **a mesma relação vista de lados diferentes**. Criança que entende isso não precisa decorar a tabuada de divisão.

## C20 — DIVISÃO COM RESTO (A Caixa de Suprimentos)
**Competência:** N4.11 · **Primitiva:** `DragGroup` (modo laçar) · **Faixa:** F3

**Tela:** objetos para agrupar; os que sobram ficam visíveis e **piscando de lado**.
**A pergunta que dá sentido:** o contexto define o que fazer com o resto. *"12 crianças, vans de 5 — quantas vans?"* precisa de 3 vans, não 2 e um resto. **Nível 4-5 traz problemas onde o resto muda a resposta.**

## C21 — DIVISÃO LONGA COM MODELO DE ÁREA (O Terreno)
**Competência:** N4.12 · **Primitiva:** `ArrayGrid` + `InteractiveVertical` · **Faixa:** F4

**A escada:** 1-2 retângulo de área conhecida, descobrir o lado, tirando pedaços grandes (÷ por partes) → 3 área + algoritmo lado a lado → 4-5 algoritmo puro.
**Por que a divisão longa trava tanta gente:** é o único algoritmo que vai da **esquerda para a direita** e mistura 4 operações. O modelo de área dá significado a cada passo.

---

# 🅳 BLOCO F3/F4 — FRAÇÕES E DECIMAIS (C22–C26)

## C22 — FRAÇÕES EQUIVALENTES (A Pizza Mágica)
**Competência:** N5.07 *(nova)* · **Primitiva:** `SingaporeBars` + `ShapeCanvas` · **Faixa:** F3

**Tela:** duas barras de mesmo comprimento, uma dividida em 2 e outra em 4; a criança pinta e compara.
**O momento de descoberta:** 1/2 e 2/4 **ocupam o mesmo espaço**. Aqui a pizza volta a ser útil — o corte extra é visível.
**A regra que emerge:** cortar cada pedaço ao meio dobra numerador e denominador.

## C23 — COMPARAR FRAÇÕES (A Balança)
**Competência:** N5.08 *(nova)* · **Primitiva:** `Balanca` + `SingaporeBars` · **Faixa:** F3

**Escada:** 1 mesmo denominador → 2 mesmo numerador (o degrau contraintuitivo: 1/3 > 1/5) → 3 comparar com 1/2 como referência → 4-5 denominadores diferentes.
**O erro clássico:** achar que 1/5 > 1/3 porque 5 > 3. A ficha existe para curar isso — com as barras lado a lado, é impossível não ver.

## C24 — ADIÇÃO DE FRAÇÕES (O Tanque de Combustível)
**Competência:** N5.06 *(nova)* · **Primitiva:** `SingaporeBars` · **Faixa:** F4

**Tela:** um tanque dividido em partes iguais; a criança enche 1/4 + 2/4 e vê 3/4.
**Regra dura:** só mesmo denominador nesta ficha. Denominador diferente exige equivalência (C22) primeiro.
**O erro a detectar:** somar os denominadores (1/4 + 2/4 = 3/8). Tag: `SOMA_DENOMINADOR`.

## C25 — DECIMAIS: VALOR POSICIONAL (A Máquina)
**Competência:** N6.01 · **Primitiva:** `Quadrado100` · **Faixa:** F4

**A sacada visual:** o mesmo quadrado de 100 que representou centena agora representa **1 inteiro**. Uma coluna = 0,1. Um quadradinho = 0,01. **Décimo e centésimo ficam visíveis no mesmo objeto que a criança já conhece.**
**A ponte com fração:** 0,1 e 1/10 são o mesmo desenho.

## C26 — PORCENTAGEM (O Desconto)
**Competência:** N7.04 *(nova)* · **Primitiva:** `Quadrado100` + `SingaporeBars` · **Faixa:** F4

**Tela:** o quadrado de 100 com N quadradinhos pintados.
**A tríade que se ensina junto:** 25% = 25/100 = 0,25 = 1/4. **As quatro representações no mesmo objeto visual.**

---

# 🅴 BLOCO F3/F4 — GEOMETRIA E MEDIDA (C27–C32)

## C27 — ÂNGULOS (O Transferidor)
**Competências:** GE.05, GE.06 · **Primitiva:** `ShapeCanvas` (modo ângulo) · **Faixa:** F3
Ângulo como **giro**, não como desenho estático: a criança arrasta o raio e vê o ângulo abrir. Reto/agudo/obtuso antes de medir em graus.

## C28 — TRIÂNGULOS E QUADRILÁTEROS (O Classificador)
**Competências:** GE.07, GE.08 · **Primitiva:** `ShapeCanvas` · **Faixa:** F3
Classificar por lado e por ângulo. **Diagrama de laços** (da Ficha 40) para mostrar que quadrado É retângulo — a hierarquia que confunde adulto também.

## C29 — SIMETRIA (O Espelho)
**Competência:** GE.09 · **Primitiva:** `ShapeCanvas` (modo espelho) · **Faixa:** F3
A criança **desenha a outra metade**. O eixo é uma linha arrastável, e ela testa dobrando (animação de dobra).

## C30 — PERÍMETRO E ÁREA (O Arquiteto)
**Competências:** GM.08, GM.09 · **Primitiva:** `ArrayGrid` · **Faixa:** F3
**A confusão que a ficha resolve:** perímetro é **a volta** (andar pela borda, contando passos); área é **o chão** (preencher com quadradinhos). Duas ações diferentes na mesma figura.
**Nível 5:** duas figuras com mesmo perímetro e áreas diferentes — quebra a intuição errada.

## C31 — CONVERSÃO DE UNIDADES (A Máquina)
**Competência:** GM.10 *(nova)* · **Primitiva:** `NumberLine` + `Balanca` · **Faixa:** F4
Régua com cm e m sobrepostos; a criança vê 100 cm ocuparem o mesmo espaço que 1 m.

## C32 — VOLUME (A Caixa d'Água)
**Competência:** GM.11 *(nova)* · **Primitiva:** `ArrayGrid` (modo 3D) · **Faixa:** F4
Encher a caixa com cubinhos, camada por camada. Descobrir que basta contar uma camada e multiplicar pela altura.

---

# 🅵 BLOCO F4 — DADOS, ÁLGEBRA E NÚMEROS (C33–C40)

## C33 — MÉDIA, MEDIANA E MODA (O Estatístico)
**Competências:** PE.03, PE.04 · **Faixa:** F4
**Média como nivelamento:** torres de alturas diferentes que a criança **iguala movendo blocos**. É a definição visual de média, não a fórmula.

## C34 — PROBABILIDADE (A Roda da Sorte)
**Competência:** PE.05 *(nova)* · **Faixa:** F4
Roleta com setores; girar muitas vezes e ver a frequência se aproximar da previsão. Certo / provável / improvável / impossível antes de fração.

## C35 — GRÁFICO DE BARRAS E FREQUÊNCIA (O Jornal)
**Competências:** PE.02, PE.04 · **Faixa:** F3
Ciclo completo: coletar → tabular → representar → interpretar. A criança faz os quatro passos.

## C36 — COORDENADAS (O Mapa do Tesouro)
**Competência:** GE.10 · **Faixa:** F4
Plano cartesiano como mapa. **A regra que se ensina:** primeiro anda, depois sobe (x antes de y).

## C37 — EXPRESSÕES COM VARIÁVEIS (O Código Secreto)
**Competências:** AL.06, AL.07 · **Faixa:** F4
A balança com um saco fechado: o saco é o **x**. Descobrir o peso do saco é resolver a equação.

## C38 — PARES, ÍMPARES E PRIMOS (O Detector)
**Competências:** N2.06 *(nova)*, N2.07 *(nova)* · **Faixa:** F3
Par = dá para formar pares sem sobrar. Primo = só dá para fazer **um** arranjo retangular. Definição visual, não decorada.

## C39 — FATORES E MÚLTIPLOS (A Árvore)
**Competências:** N2.07, N2.08 *(novas)* · **Faixa:** F4
Fator: de quantas formas o retângulo pode ser montado. Múltiplo: saltos na reta numérica.

## C40 — RAZÃO E PROPORÇÃO (A Receita)
**Competência:** N7.03 *(nova)* · **Faixa:** F4
Receita que dobra e triplica, com barras proporcionais. Base de porcentagem, escala e álgebra.

---

# 🥋 TRÊS FICHAS NOVAS DO JARDIM/DOJO

## JD6 — FATOS RELÂMPAGO (Multiplicação)
**Competência:** N4.03 · flash de fato × resposta rápida, por família (×2, ×5, ×10 primeiro).

## JD7 — DECIMAL RELÂMPAGO
**Competência:** N6.01 · reconhecer 0,3 / 0,03 / 3,0 no flash. Treina o valor posicional decimal.

## JD8 — ÂNGULO RELÂMPAGO
**Competência:** GE.05 · flash de ângulo, classificar em agudo/reto/obtuso sem medir.

---

# 📊 RESUMO DO CATÁLOGO COMPLETO

| Bloco | Fichas | Faixa |
|---|---|---|
| Parte I — aula (F01–F43) | 43 | F0 a F3 |
| Parte I — Jardim (JD1–JD5) | 5 | F0/F1 |
| Parte II — complementares (C01–C40) | 40 | F0 a F4 |
| Parte II — Jardim (JD6–JD8) | 3 | F3/F4 |
| **TOTAL** | **91 fichas** | |

**Cobertura:** as 84 competências atuais + as 11 novas = **95 competências**, todas com pelo menos uma ficha especificada.
