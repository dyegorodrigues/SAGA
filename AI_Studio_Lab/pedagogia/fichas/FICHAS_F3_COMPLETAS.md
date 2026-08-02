# 🎬 FICHAS COMPLETAS — BLOCO F3
**A abstração · 9 a 11 anos · onde o número deixa de ser inteiro**

*Mesmo padrão de 9 seções dos blocos anteriores.*

---

# 📑 ÍNDICE — BLOCO F3 (19 fichas · 19 competências)

| # | Ficha | Competência | O marco cognitivo | Status |
|---|---|---|---|---|
| 1 | **F65** — Números Grandes | N2.05 | arredondar é estimar com regra | ✅ |
| 2 | **F66** — A Fábrica de Retângulos | N2.07 | fatores são formas de arrumar | ✅ |
| 3 | **F67** — Multiplicar por 10 | N4.08 | o zero que desloca a ordem | ✅ |
| 4 | **F68** — O Modelo de Área | N4.09 | **partir para multiplicar** | ✅ |
| 5 | **F69** — A Divisão Longa | N4.10 | o único algoritmo que vai da esquerda | ✅ |
| 6 | **F70** — Primos e Divisores | N4.11 | quem só tem um retângulo | ✅ |
| 7 | **F71** — Dividir por Dois Dígitos | N4.12 | estimar, ajustar, confirmar | ✅ |
| 8 | **F72** — A Fração é um Número | N5.02 | **fração na reta numérica** | ✅ |
| 9 | **F73** — Frações Equivalentes | N5.03 | o mesmo pedaço, outro nome | ✅ |
| 10 | **F74** — Somar Frações | N5.04 | o denominador não soma | ✅ |
| 11 | **F75** — Décimos e Centésimos | N6.01 | **o quadrado que vira 1 inteiro** | ✅ |
| 12 | **F76** — Contas com Vírgula | N6.02 | alinhar a vírgula, não os dígitos | ✅ |
| 13 | **F77** — A Expressão | AL.06 | a ordem das operações | ✅ |
| 14 | **F78** — Ângulos | GE.06 | ângulo é giro, não desenho | ✅ |
| 15 | **F79** — Polígonos | GE.07 | classificar por propriedade | ✅ |
| 16 | **F80** — O Plano Cartesiano | GE.08 | primeiro anda, depois sobe | ✅ |
| 17 | **F81** — Área | GM.08 | o chão, não a volta | ✅ |
| 18 | **F82** — Problemas de Medida | GM.09 | converter para poder comparar | ✅ |
| 19 | **F83** — Média e Chance | PE.03 | **média é nivelar, não fórmula** | ✅ |

**Legenda:** ✅ **19 de 19 completas — bloco F3 fechado**

---
---

---

# ⚠️ ADENDO NORMATIVO v3.1 *(agosto/2026)*
**Regras que valem para TODA ficha deste bloco, vindas da Bíblia v3.1. Onde a ficha divergir, o adendo prevalece.**

| Regra | Bíblia | O que muda na prática |
|---|---|---|
| **Filtro motor** | §8.3-bis | Erro de arrasto/corte/alinhamento **não gera tag** de misconception. Todo arrasto tem alternativa por toque (tocar origem → tocar destino), snap com tolerância generosa e área ≥ 80px. Precisão de dedo **nunca** é requisito para demonstrar compreensão. |
| **Radar probabilístico** | §11.4-bis | Uma tag é hipótese com peso, não veredito. Erro isolado = 0.2; só a partir de 1.5 acumulado abre Missão de Resgate. Acerto limpo subtrai 0.3. |
| **Relógio silencioso** | §5.1-bis | Nenhuma ficha usa tempo como critério de domínio conceitual. O `rt_alvo` existe para alimentar a trilha FD do Dojo — não para reprovar na Jornada. Cronômetro visível: só no Dojo, só 7+, opcional. |
| **Mão Fantasma esmaecida** | §7.1-bis | A mão demonstra **o primeiro item** (≤10s) e **devolve a tela**. Nunca resolve o exercício inteiro travado. Toque durante a demonstração **encurta** a demonstração; nunca vira erro nem `skip`. |
| **Divulgação progressiva** | §12.3-bis | Ficha com 3+ representações simultâneas revela em degraus na primeira exposição: material → transformação → material+conta → conta com apoio → só conta. Eixo independente do nível. |
| **Casca visual por idade** | §12.5-ter | O vocabulário e o tema desta ficha são **cosméticos**. A mesma competência roda em casca Kids (4-6), Explorer (7-9) ou Lab (10+), escolhida pela idade real, nunca pela faixa da competência. Nenhuma ficha pode assumir vocabulário infantil como obrigatório. |

**Fichas deste bloco obrigadas a declarar `revelacaoProgressiva: true`:** F68, F69, F76
**Fichas deste bloco com exposição motora alta (exigem toque alternativo + snap):** F71, F78, F80

---


# FICHA F72 — A FRAÇÃO É UM NÚMERO
*O salto que quase todo currículo erra: fração tem lugar na reta.*

## 1. Identidade
**Competência:** N5.02 (fração: parte-todo, coleção e reta) · **Primitiva:** `SingaporeBars` + `InteractiveNumberLine` · **Faixa:** F3

## 2. Fundamento

**O que a criança aprende:** que 3/4 não é "um desenho de pedaços" — é **um número**, com posição na reta, entre 0 e 1.

**Por que quase todo mundo erra:** fração é ensinada só como parte de figura. A criança pinta pizzas por dois anos e nunca vê 3/4 num lugar. Aí, quando aparece 1/2 + 1/2 = 1, ela não entende — porque para ela fração não é quantidade, é imagem.

**Os três significados que ela precisa juntar:**
| Significado | Exemplo | Representação |
|---|---|---|
| **parte-todo** | 3 de 4 pedaços da barra | barra dividida |
| **parte de coleção** | 3 de 12 bolinhas | conjunto agrupado |
| **número na reta** | o ponto entre 0 e 1 | reta numérica |

**O terceiro é o que falta na maioria dos materiais — e é o mais importante.**

## 3. Estrutura da tela
1. **Enunciado** — "Onde fica 3/4 na reta?"
2. **A barra** em cima, dividida e pintada
3. **A reta** embaixo, **do mesmo comprimento da barra**, alinhada verticalmente
4. **Marcador arrastável**

```
Onde fica 3/4 na reta?

+----+----+----+----+
|####|####|####|    |     <- a barra
+----+----+----+----+

|----+----+----+----|
0                   1     <- a reta, mesmo comprimento
         ^ arraste
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **Abertura** | a barra se desenha e se divide em partes iguais. As partes pintadas se preenchem uma a uma. | 1,5s |
| **A transformação** | a barra **se estica e se achata**, virando a reta — as divisões viram marcas. **É a mesma coisa mudando de forma.** | 2s |
| **A âncora** | o 0 e o 1 acendem nas pontas. A voz: *"a barra inteira é o 1"* | 1,3s |
| **O arrasto** | ao mover o marcador, a **parte correspondente da barra se pinta em tempo real** — as duas representações sincronizadas | contínuo |
| **Acerto** | o marcador trava na marca certa, e **uma linha vertical liga a barra à reta** naquele ponto | 2s |
| **Erro suave** | a barra **conta suas partes em voz alta** e cada uma **projeta uma linha** até a reta, marcando as divisões | 2,5s |
| **Fecho** | barra e reta alinhadas, com o ponto marcado nas duas | 1,8s |

**A transformação da barra em reta é a ficha inteira.** Ver a barra virar reta é entender que fração é número.

## 5. Os 5 níveis

| Nível | Representação | Tarefa |
|---|---|---|
| **1** | barra | identificar a fração pintada |
| **2** | coleção (12 bolinhas, 3 vermelhas) | dizer a fração |
| **3** | **reta com marcas** | localizar a fração |
| **4** | reta com **marcas parciais** (só 0, 1/2, 1) | estimar a posição |
| **5** | **frações maiores que 1** (5/4 na reta até 2) | fração imprópria |

**O nível 5 quebra a ideia de que fração é sempre "menos que um inteiro"** — e é essencial antes de operar com frações.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| contou as marcas em vez dos intervalos | `CONTA_MARCAS` | erro clássico da reta |
| posicionou 3/4 antes de 1/2 | `NAO_ORDENA_FRACAO` | não trata como número |
| na coleção, contou o total errado | `DENOMINADOR_ERRADO` | não identifica o denominador |
| achou que 5/4 não existe | `FRACAO_SO_MENOR_QUE_UM` | conceito incompleto |

## 7. Falas

**audioPrompt:** *"Onde fica três quartos na reta?"*
**howto:** *"O de baixo diz em quantos pedaços a reta foi dividida. O de cima diz quantos pedaços andar."*
**explain:** *"Divida o caminho de 0 até 1 em quatro partes iguais. Agora ande três."*

## 8. Coreografia (nível 3)
```
[
  { fala: "A barra inteira é um.",     mostra: { destacarBarra: true },        sync: "junto" },
  { fala: "Ela vira a reta assim.",    mostra: { transformarEmReta: true },    sync: "junto" },
  { fala: "Quatro partes iguais.",     mostra: { marcarDivisoes: 4 },          sync: "junto" },
  { fala: "Ande três: três quartos!",  mostra: { moverMarcador: 0.75 },        sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo **pelo menos um na reta** (nível 3+). Identificar fração em barra não prova que é número.

---
---

# FICHA F75 — DÉCIMOS E CENTÉSIMOS
*O mesmo quadrado que foi centena agora é o inteiro.*

## 1. Identidade
**Competência:** N6.01 (décimos, centésimos, fração↔decimal) · **Primitiva:** `Quadrado100` · **Faixa:** F3

## 2. Fundamento

**O que a criança aprende:** que o sistema decimal **continua depois da vírgula** com a mesma lógica de agrupamento de dez.

**A sacada visual que faz tudo funcionar:** o **mesmo quadrado de 100** que representou a centena agora representa **1 inteiro**. Uma coluna = 0,1. Um quadradinho = 0,01. **Décimo e centésimo ficam visíveis no objeto que ela já conhece há anos.**

**Por que isso resolve a confusão mais comum:** a criança acha que 0,5 é menor que 0,25 "porque 5 é menor que 25". Vendo os dois no quadrado — metade contra um quarto — o erro é impossível.

**A ponte com fração:** 0,1 e 1/10 são **o mesmo desenho**. Não são assuntos diferentes; são notações diferentes da mesma coisa.

## 3. Estrutura da tela
1. **Enunciado** — "Quanto está pintado?"
2. **Quadrado de 100** com parte pintada
3. **Três formas de resposta** *(nível 4+)*: fração, decimal, porcentagem

```
Quanto esta pintado?

+--+--+--+--+--+--+--+--+--+--+
|##|##|##|  |  |  |  |  |  |  |
|##|##|##|  |  |  |  |  |  |  |
|##|##|##|  |  |  |  |  |  |  |
|##|##|##|  |  |  |  |  |  |  |
+--+--+--+--+--+--+--+--+--+--+
     ^ 3 colunas = 0,3 = 3/10
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **A reciclagem** *(primeira vez)* | o quadrado aparece **rotulado como "100"**, e então o rótulo **se transforma em "1"**. A voz: *"lembra deste quadrado? Antes era cem. Agora ele é UM inteiro."* | 2,5s |
| **A coluna** | uma coluna **se destaca e se separa** do quadrado, mostrando que são 10 quadradinhos. Rótulo: 0,1 | 1,8s |
| **O quadradinho** | um quadradinho se destaca. Rótulo: 0,01 | 1,2s |
| **A pintura** | ao pintar, o valor **sobe em tempo real** em três formatos simultâneos: 3/10 · 0,3 · 30% | contínuo |
| **Acerto** | as três notações **acendem juntas** com uma linha ligando-as ao mesmo desenho | 2,2s |
| **Erro suave** | as colunas pintadas são **contadas em voz alta**, e a vírgula aparece com a casa destacada | 2,5s |

**A transformação do rótulo 100 → 1 é o momento da ficha.** É a criança vendo que o sistema continua.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| **1** | décimos (colunas inteiras) |
| **2** | centésimos (quadradinhos) |
| **3** | **fração ↔ decimal** (3/10 = 0,3) |
| **4** | **comparar decimais** (0,5 vs 0,25 no quadrado) |
| **5** | ordenar decimais na reta |

**O nível 4 é onde o erro clássico morre:** ver 0,5 e 0,25 lado a lado no quadrado torna impossível achar que 0,25 é maior.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| 0,25 > 0,5 | `DECIMAL_COMO_INTEIRO` | **o erro central** |
| leu 0,3 como "zero vírgula três" sem valor | `SEM_VALOR_POSICIONAL` | não sabe que é 3/10 |
| confundiu décimo com centésimo | `ORDEM_TROCADA` | |

## 7. Falas

**audioPrompt:** *"Quanto está pintado do quadrado?"*
**howto:** *"O quadrado inteiro é um. Cada coluna é um décimo. Cada quadradinho, um centésimo."*
**explain:** *"Conte as colunas pintadas. Cada uma vale zero vírgula um."*

## 8. Coreografia
```
[
  { fala: "Este quadrado agora é UM.",  mostra: { rotular: "1" },           sync: "junto" },
  { fala: "Uma coluna é um décimo.",    mostra: { destacarColuna: 0 },      sync: "junto" },
  { fala: "Zero vírgula um!",           mostra: { mostrarDecimal: 0.1 },    sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **comparação** (nível 4).

---
---

# FICHA F68 — O MODELO DE ÁREA
*Partir para multiplicar. E entender de onde vem o algoritmo.*

## 1. Identidade
**Competência:** N4.09 (multiplicação com 2 dígitos) · **Primitiva:** `ArrayGrid` (modo área) · **Faixa:** F3

## 2. Fundamento

**O que a criança aprende:** que 13×4 pode ser resolvido **partindo** em (10×4) + (3×4).

**Por que o modelo de área precede o algoritmo:** sem ele, o "zero da segunda linha" na multiplicação armada é mágica sem sentido. Com ele, a criança **vê** que está multiplicando dezenas separadamente.

**A propriedade que aparece sozinha:** isso é a distributiva. A criança a **usa** anos antes de conhecer o nome — e quando o nome vier, ela já sabe o que significa.

**Por que é a ponte para a álgebra:** (a+b)×c é o mesmo retângulo partido. Quem entendeu aqui entende lá.

## 3. Estrutura da tela
1. **Enunciado** — "13 × 4"
2. **Retângulo** de 13 por 4, com uma **linha de corte** separando o 10 do 3
3. **As duas parcelas** aparecendo em cada região
4. **A soma final**

```
13 x 4

+----------+---+
|          |   |
|  10 x 4  |3x4|
|   = 40   |=12|
|          |   |
+----------+---+

     40 + 12 = [    ]
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **Abertura** | o retângulo se desenha inteiro, 13 por 4, com a malha visível | 1,5s |
| **O corte** | uma **linha vertical desce** separando as 10 primeiras colunas das 3 últimas. Som de corte. | 1,2s |
| **A região grande** | a parte de 10×4 **acende** e o resultado aparece dentro: 40. A voz: *"dez vezes quatro é quarenta"* | 1,8s |
| **A região pequena** | idem para 3×4 = 12 | 1,5s |
| **A soma** | as duas regiões **deslizam juntando-se** e os números somam | 1,5s |
| **Acerto** | o retângulo inteiro brilha com o total | 1,8s |
| **A ponte com o algoritmo** *(nível 4)* | a conta armada aparece **ao lado**, e cada linha dela **se ilumina junto com a região correspondente** do retângulo | 2,5s |
| **Erro suave** | as regiões são contadas por linhas, em voz alta | 2,8s |

**A sincronia região↔linha do algoritmo é o que dá sentido à conta armada.** A criança vê de onde vem cada número.

## 5. Os 5 níveis

| Nível | Operação | Representação |
|---|---|---|
| **1** | 2 díg × 1 díg | área com corte marcado |
| **2** | 2 díg × 1 díg | área, criança faz o corte |
| **3** | 2 díg × 1 díg | área + algoritmo lado a lado |
| **4** | 2 díg × 2 díg | área com **4 regiões** |
| **5** | 2 díg × 2 díg | só algoritmo, tempo-alvo |

**O nível 4 com quatro regiões é onde a multiplicação de dois dígitos faz sentido** — cada região é uma das parcelas do algoritmo.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| multiplicou só uma região | `PARCELA_UNICA` | não somou as partes |
| cortou em partes desiguais sem ajustar | `CORTE_ERRADO` | |
| no algoritmo, esqueceu o zero | `ZERO_ESQUECIDO` | **o erro que o modelo de área previne** |

## 7. Falas

**audioPrompt:** *"Treze vezes quatro."*
**howto:** *"Parta o treze em dez mais três. Multiplique cada parte e some."*
**explain:** *"Olhe as duas regiões do retângulo. Quanto vale cada uma?"*

## 8. Coreografia
```
[
  { fala: "Vamos partir o treze.",    mostra: { cortarRetangulo: 10 },    sync: "junto" },
  { fala: "Dez vezes quatro: quarenta.", mostra: { destacarRegiao: 0 },   sync: "junto" },
  { fala: "Três vezes quatro: doze.",  mostra: { destacarRegiao: 1 },     sync: "junto" },
  { fala: "Somando: cinquenta e dois!", mostra: { juntarRegioes: true },  sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um no nível 3 (área + algoritmo sincronizados).

---
---

# FICHA F69 — A DIVISÃO LONGA
*O único algoritmo que anda da esquerda para a direita.*

## 1. Identidade
**Competência:** N4.10 (divisão com resto e algoritmo) · **Primitiva:** `ArrayGrid` + `InteractiveVertical` · **Faixa:** F3

## 2. Fundamento

**O que a criança aprende:** o algoritmo da divisão — e **por que** ele funciona.

**Por que trava mais que qualquer outro algoritmo:** três motivos combinados. É o único que vai da **esquerda para a direita**. Mistura **quatro operações** (dividir, multiplicar, subtrair, baixar). E exige **estimar** — não há regra automática para escolher o quociente parcial.

**A abordagem que dá sentido: divisão por partes.** Em vez de "quantas vezes 6 cabe em 7", pergunta-se *"quantos grupos de 6 dá para tirar de 738?"* — e a criança tira **100 grupos**, depois **20**, depois **3**. É a mesma resposta, com significado.

**Por que o retângulo funciona:** dividir 738 por 6 é achar o lado de um retângulo de área 738 e altura 6. A criança **tira pedaços grandes** até esgotar.

## 3. Estrutura da tela
1. **Enunciado** — "738 ÷ 6"
2. **Retângulo** de área conhecida e altura dada, com o lado a descobrir
3. **A conta armada** ao lado *(nível 3+)*
4. **Registro das parcelas** tiradas

```
738 / 6

  +---------------+---+--+
6 |   600 (100)   |120|18|
  +---------------+---+--+
      100     +   20 + 3  = 123

     Ou na conta armada:
       738 | 6
      -600 |---
       138 | 123
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **Abertura** | o retângulo aparece com a área escrita (738) e a altura (6). O lado é uma **interrogação pulsante** | 1,5s |
| **A pergunta** | a voz: *"quantos grupos de seis cabem aqui?"* | 1,3s |
| **A primeira retirada** | ao escolher 100, um **bloco de 600 se destaca e sai** do retângulo, deslizando para o lado. O que sobra (138) fica marcado. | 2s |
| **O registro** | o "100" aparece no lado do retângulo, acumulando | 800ms |
| **As retiradas seguintes** | repete até sobrar menos que 6 | por etapa |
| **O resto** | o que sobra fica **piscando** e é nomeado: *"sobrou zero"* ou *"sobraram 2"* | 1,5s |
| **A ponte com o algoritmo** *(nível 3+)* | a conta armada aparece e **cada retirada do retângulo ilumina a linha correspondente** | 2,5s |
| **Erro suave** | se a estimativa foi grande demais, o bloco **não cabe** e volta. Voz: *"esse pedaço é maior que o total. Tente menos."* | 2,2s |

**O bloco que não cabe é o feedback perfeito.** Estimar demais é fisicamente impossível — a criança ajusta sozinha.

## 5. Os 5 níveis

| Nível | Divisor | Método |
|---|---|---|
| **1** | 1 dígito, divisão exata | retângulo, retiradas grandes |
| **2** | 1 dígito, com resto | retângulo |
| **3** | 1 dígito | retângulo + algoritmo lado a lado |
| **4** | 1 dígito | só algoritmo |
| **5** | com **zero no quociente** (612÷6) | algoritmo |

**O nível 5 traz o caso mais traiçoeiro:** quando um dígito do quociente é zero, quase toda criança pula e erra a ordem de grandeza.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| esqueceu o zero no quociente | `ZERO_PULADO` | **o erro do nível 5** |
| começou pela direita | `ORDEM_INVERTIDA` | aplicou o hábito da adição |
| resto maior que o divisor | `RESTO_INVALIDO` | não esgotou as retiradas |
| não baixou o próximo dígito | `NAO_BAIXOU` | perdeu o passo |

## 7. Falas

**audioPrompt:** *"Setecentos e trinta e oito dividido por seis."*
**howto:** *"Vá tirando grupos grandes primeiro. Cem grupos de seis são seiscentos."*
**explain:** *"Quantos grupos de seis cabem no que sobrou?"*

## 8. Coreografia
```
[
  { fala: "Temos 738 para repartir.",   mostra: { mostrarArea: 738 },       sync: "junto" },
  { fala: "Cem grupos de seis: 600.",   mostra: { retirarBloco: 600 },      sync: "junto" },
  { fala: "Sobraram 138.",              mostra: { destacarResto: 138 },     sync: "junto" },
  { fala: "Quantos ainda cabem?",       mostra: { pulsarResto: true },      sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 4, de: 4, sessoes: 3 }` — **rigoroso**, incluindo um com resto e um com zero no quociente.

---
---

# FICHA F83 — MÉDIA E CHANCE
*Média se ensina movendo blocos, não com fórmula.*

## 1. Identidade
**Competência:** PE.03 (média e probabilidade como fração) · **Primitiva:** `SingaporeBars` · **Faixa:** F3

## 2. Fundamento

**O que a criança aprende:** que média é o valor que **todos teriam se fosse igualmente repartido**.

**Por que a fórmula não ensina nada:** "soma e divide" é um procedimento. A criança calcula a média de 2, 4 e 9 e obtém 5, sem entender o que 5 significa ali — nem perceber que é impossível a média ser maior que o maior valor.

**A definição visual que ensina:** torres de alturas diferentes que a criança **nivela movendo blocos**. Tira do alto, põe no baixo, até todas ficarem iguais. **A altura final é a média.** Ela vê o significado antes da fórmula.

**Sobre probabilidade como fração:** 3 bolas azuis em 5 é a chance 3/5. Só faz sentido depois que fração é número (N5.02) — e o pré-requisito garante.

## 3. Estrutura da tela
**Modo média:** torres de blocos com alturas diferentes, e blocos arrastáveis entre elas.
**Modo chance:** um saco com bolas de cores, e a pergunta da probabilidade.

```
Iguale as torres. Qual a altura de todas?

  #
  #     #
  #  #  #
  #  #  #
  2  4  9   <- alturas

  Media: [    ]
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **Abertura** | as torres crescem de baixo para cima, alturas diferentes | 1,3s |
| **Instrução** | a voz: *"deixe todas do mesmo tamanho, sem tirar nem colocar blocos novos"* | 1,6s |
| **A movimentação** | ao arrastar um bloco do topo de uma torre para outra, ele **voa em arco** e assenta. As alturas atualizam. | 500ms cada |
| **A linha da média** | uma **linha horizontal tracejada** aparece na altura média, como alvo — as torres precisam chegar nela | contínuo |
| **O nivelamento** | quando todas ficam iguais, elas **brilham juntas** e a linha vira sólida | 2s |
| **A revelação da fórmula** *(nível 3+)* | a voz: *"todos os blocos juntos são 15. Dividido por 3 torres: 5 cada."* A conta aparece **confirmando** o que ela já fez com as mãos | 2,5s |
| **Erro suave** | a linha da média pulsa, mostrando o alvo | 1,8s |

**A fórmula aparece DEPOIS de a criança nivelar.** Ela confirma a experiência, não a substitui.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| **1** | nivelar 3 torres, valores pequenos |
| **2** | nivelar 4-5 torres |
| **3** | **calcular** a média (fórmula, confirmada pelo nivelamento) |
| **4** | **chance como fração** (3 de 5 bolas = 3/5) |
| **5** | comparar chances (qual saco tem mais chance de azul?) |

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| média maior que o maior valor | `MEDIA_IMPOSSIVEL` | não entende o significado |
| somou sem dividir | `ESQUECEU_DIVIDIR` | |
| na chance, contou só os favoráveis | `IGNORA_TOTAL` | não forma a fração |

## 7. Falas

**audioPrompt:** *"Iguale as torres. Qual fica a altura de todas?"*
**howto:** *"Tire dos mais altos e coloque nos mais baixos, até ficarem iguais."*
**explain:** *"Nenhum bloco entra nem sai. Só muda de torre."*

> **⚠️ Restrição v3.1 — níveis 1 a 3 usam APENAS conjuntos de média inteira.** A metáfora de nivelar torres é fisicamente honesta só quando a média é inteira: se a média der 4,5, blocos inteiros não nivelam e a criança percebe que a frase não fecha — e ela está certa. A partir do nível 4, introduzir o **meio bloco** explicitamente, com a fala *"às vezes a média fica entre dois números"*, e permitir mostrar **a linha da média** sobre as torres sem exigir que os blocos fracionem. Deixar claro, no nível 5, que a média pode não ser nenhum valor real do conjunto.

## 8. Coreografia
```
[
  { fala: "Estas torres são diferentes.", mostra: { destacarTorres: true },  sync: "junto" },
  { fala: "Vou tirar deste alto...",      mostra: { moverBloco: [2,0] },     sync: "junto" },
  { fala: "E colocar no baixo.",          mostra: { assentarBloco: 0 },      sync: "junto" },
  { fala: "Até todas ficarem iguais!",    mostra: { linhaMedia: true },      sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **cálculo** (nível 3) e um de **chance** (nível 4).

---
---

# FICHA F65 — NÚMEROS GRANDES

## 1. Identidade
**Competência:** N2.05 (números grandes e arredondamento) · **Primitiva:** `NumberLine` + `Quadrado100` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** ler números até milhares e **arredondar com critério**.

**Por que arredondar é uma competência, não um truque:** arredondar é decidir **qual precisão importa**. É a base de estimativa, de checagem de resultado e de senso numérico.

**A regra que faz sentido visual:** na reta, arredondar é ver **de qual marca o número está mais perto**. O "5 arredonda para cima" deixa de ser arbitrário quando ela vê que está exatamente no meio.

## 3. Estrutura da tela
Reta numérica com as dezenas/centenas marcadas, e o número posicionado entre duas marcas.

## 4. Roteiro cinematográfico
O número **aparece na reta** entre duas marcas. Duas setas mostram a distância até cada uma, com os valores. A mais curta **pisca** — é o arredondamento. No caso do 5 exato, as duas setas ficam **iguais** e a voz explica a convenção: *"empatou! A regra diz: vai para cima."*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | arredondar dezena |
| 2 | centena |
| 3 | milhar |
| 4 | **escolher a precisão** (arredondar 3.847 para qual?) |
| 5 | estimar operação com arredondamento |

## 6. Diagnóstico
`ARREDONDA_SEMPRE_BAIXO` · `IGNORA_DISTANCIA` · `ORDEM_ERRADA` (arredonda para a ordem errada)

## 7. Falas
**howto:** *"Veja de qual marca o número está mais perto na reta."*
**explain:** *"Olhe as duas marcas ao redor. Qual está mais perto?"*

## 8. Coreografia
```
[
  { fala: "O 47 está aqui.",         mostra: { marcarPonto: 47 },        sync: "junto" },
  { fala: "Entre 40 e 50.",          mostra: { destacarMarcas: [40,50] }, sync: "junto" },
  { fala: "Mais perto do 50!",       mostra: { setaDistancia: 50 },      sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }`

---
---

# FICHA F66 — A FÁBRICA DE RETÂNGULOS

## 1. Identidade
**Competência:** N2.07 (fatores) · **Primitiva:** `ArrayGrid` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que os fatores de um número são **as formas de arrumá-lo em retângulo**.

**Por que a definição visual vence a lista:** decorar "os fatores de 12 são 1, 2, 3, 4, 6, 12" não diz de onde vieram. Montar os retângulos 1×12, 2×6, 3×4 **produz** a lista — e ela nunca mais é esquecida.

## 3. Estrutura da tela
Quadradinhos soltos e uma área para montar retângulos, com registro dos pares encontrados.

## 4. Roteiro cinematográfico
A criança arrasta quadradinhos formando retângulos. **Se o retângulo não fecha** (sobra quadradinho), ele **balança e não trava**. Cada retângulo completo **registra o par de fatores** numa lista lateral. Ao esgotar, a voz recapitula: *"12 pode virar três retângulos diferentes!"*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | até 12, com dica de quantos existem |
| 2 | até 24 |
| 3 | sem dica |
| 4 | **descobrir se um número é primo** (só um retângulo) |
| 5 | maior fator comum de dois números |

## 6. Diagnóstico
`ESQUECE_TRIVIAIS` (esquece 1 e o próprio) · `PARA_CEDO` (não esgota) · `CONFUNDE_FATOR_MULTIPLO`

## 7. Falas
**howto:** *"Tente arrumar todos os quadradinhos num retângulo perfeito, sem sobrar nenhum."*
**explain:** *"Se sobrou quadradinho, esse formato não serve. Tente outro."*

## 8. Coreografia
```
[
  { fala: "Temos doze quadradinhos.",  mostra: { mostrarPecas: 12 },     sync: "junto" },
  { fala: "Dá pra fazer 3 por 4.",     mostra: { montarRetangulo: [3,4] }, sync: "junto" },
  { fala: "3 e 4 são fatores de 12!",  mostra: { registrarPar: [3,4] },  sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo a identificação de um **primo**.

---
---

# FICHA F67 — MULTIPLICAR POR DEZ

## 1. Identidade
**Competência:** N4.08 (multiplicação por 1 dígito e ×10/×100) · **Primitiva:** `MaterialDourado` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que multiplicar por 10 **desloca cada algarismo uma ordem** — não "acrescenta zero".

**Por que a regra do zero é perigosa:** funciona com inteiros e **quebra com decimais** (0,5 × 10 não é "0,50"). Ensinar deslocamento em vez de acrescentar zero evita um erro que aparece anos depois.

**A visualização:** cada cubinho **vira uma barra**, cada barra **vira uma placa**. Todo o material sobe uma ordem de uma vez.

## 3. Estrutura da tela
Material dourado antes e depois, com as ordens rotuladas.

## 4. Roteiro cinematográfico
Ao multiplicar por 10, **todos os elementos do material se transformam simultaneamente** — cubinhos viram barras, barras viram placas — com uma animação de "promoção" e som ascendente. A voz: *"cada quantidade ficou dez vezes maior — por isso ela mudou de casa!"* Na conta, a coluna à esquerda **acende** recebendo o novo valor.

> **⚠️ Correção v3.1 — fala.** A versão anterior dizia que *"o algarismo desliza para a coluna à esquerda"*. Isso troca uma misconception por outra: a criança passa a acreditar que **dígitos se movem fisicamente**, o que quebra assim que aparecem decimais (0,5 × 10 não é "0,50"). A causa é o valor ter decuplicado; a mudança de casa é a **consequência**, e a fala tem de dizer nessa ordem. Formulações aceitas: *"cada quantidade fica dez vezes maior, por isso muda de casa"* · *"o valor sobe uma ordem; a escrita mostra isso"*. Formulação **proibida**: *"o número anda"*, *"o algarismo desliza"*, *"é só acrescentar um zero"*.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | ×10 com material |
| 2 | ×100 |
| 3 | ×10 sem material |
| 4 | n × 1 dígito com reagrupamento |
| 5 | combinado (×30, ×400) |

## 6. Diagnóstico
`ACRESCENTA_ZERO_SEM_ENTENDER` · `ORDEM_ERRADA` · `ESQUECE_REAGRUPAMENTO`

## 7. Falas
**howto:** *"Multiplicar por dez faz cada algarismo subir uma casa."*
**explain:** *"Veja o material: cada peça virou a peça de cima."*

## 8. Coreografia
```
[
  { fala: "Temos 23.",                mostra: { mostrarMaterial: 23 },   sync: "junto" },
  { fala: "Vezes dez: tudo sobe!",    mostra: { promoverOrdens: true },  sync: "junto" },
  { fala: "Virou 230!",               mostra: { numeral: 230 },          sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }`

---
---

# FICHA F70 — PRIMOS E DIVISORES

## 1. Identidade
**Competência:** N4.11 (múltiplos, divisores e primos) · **Primitiva:** `ArrayGrid` + `Quadrado100` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** a distinção entre **divisor** (cabe dentro) e **múltiplo** (chega-se lá), e o que torna um número primo.

**A definição visual de primo:** um número é primo quando **só existe um retângulo possível** (1 × ele mesmo). É a definição mais elegante que existe, e a criança a descobre montando.

**A distinção que resolve a confusão:** *divisor cabe dentro; múltiplo é onde você chega.* 3 é divisor de 12 (cabe 4 vezes). 12 é múltiplo de 3 (chega-se lá pulando).

## 3. Estrutura da tela
Quadro de 100 para múltiplos (pintar os saltos) e ArrayGrid para divisores (montar retângulos).

## 4. Roteiro cinematográfico
**Modo múltiplos:** os saltos pintam o quadro de 100, revelando o padrão em colunas.
**Modo divisores:** monta retângulos; se só um for possível, o número **brilha em dourado** e a voz anuncia: *"esse é primo! Só tem um jeito."*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | múltiplos no quadro |
| 2 | divisores por retângulo |
| 3 | distinguir os dois |
| 4 | **identificar primos** |
| 5 | crivo de Eratóstenes no quadro de 100 **O nível 5 é uma das atividades mais bonitas da matemática elementar** — a criança pinta os múltiplos e o que sobra são os primos. |

## 6. Diagnóstico
`INVERTE_DIVISOR_MULTIPLO` · `ESQUECE_UM` (não conta 1 como divisor) · `PRIMO_ERRADO`

## 7. Falas
**howto:** *"Divisor cabe dentro do número. Múltiplo é onde você chega pulando."*
**explain:** *"Tente montar retângulos. Quantos jeitos diferentes existem?"*

## 8. Coreografia
```
[
  { fala: "Sete quadradinhos.",       mostra: { mostrarPecas: 7 },      sync: "junto" },
  { fala: "Só dá um retângulo!",      mostra: { montarRetangulo: [1,7] }, sync: "junto" },
  { fala: "Sete é primo!",            mostra: { brilharDourado: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo identificação de primos.

---
---

# FICHA F71 — DIVIDIR POR DOIS DÍGITOS

## 1. Identidade
**Competência:** N4.12 (divisão com divisor de 2 dígitos) · **Primitiva:** `InteractiveVertical` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** dividir estimando o quociente parcial e **ajustando**.

**Por que é a operação mais difícil do currículo elementar:** não há regra automática. Ela precisa **estimar**, testar, e corrigir. É a primeira vez que a matemática exige tentativa e ajuste.

**A estratégia que torna possível:** arredondar o divisor. Para 738 ÷ 23, pensar "23 é quase 20, então uns 30 grupos" — e ajustar a partir daí.

## 3. Estrutura da tela
Conta armada com área de rascunho lateral onde a criança testa multiplicações.

## 4. Roteiro cinematográfico
Ao estimar, a **multiplicação de teste aparece no rascunho**. Se o resultado passar do total, o número **fica vermelho** e a voz: *"passou! Tente menos."* Se ficar muito abaixo, *"cabe mais."* A criança ajusta até acertar — **e o ajuste é a competência**, não um erro.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | divisor redondo (÷20, ÷30) |
| 2 | divisor próximo de redondo (÷19, ÷21) |
| 3 | qualquer divisor |
| 4 | com resto |
| 5 | com zero no quociente |

## 6. Diagnóstico
`NAO_ESTIMA` (tenta chutar sem arredondar) · `NAO_AJUSTA` (desiste no primeiro erro) · `RESTO_INVALIDO`

## 7. Falas
**howto:** *"Arredonde o divisor para estimar. Depois teste e ajuste."*
**explain:** *"Multiplique sua estimativa e veja se cabe. Se passar, diminua."*

## 8. Coreografia
```
[
  { fala: "23 é quase 20.",           mostra: { arredondar: 23 },        sync: "junto" },
  { fala: "Chuto uns 30 grupos.",     mostra: { testarQuociente: 30 },   sync: "junto" },
  { fala: "Vamos conferir!",          mostra: { multiplicarTeste: true },sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 4, de: 4, sessoes: 3 }` — incluindo um que exija **ajuste** da primeira estimativa.

---
---

# FICHA F73 — FRAÇÕES EQUIVALENTES

## 1. Identidade
**Competência:** N5.03 (equivalência e comparação de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que a mesma quantidade pode ser escrita de várias formas — e como comparar frações diferentes.

**A imagem que resolve:** duas barras **do mesmo comprimento**, uma em 2 partes e outra em 4. Pinta 1 e 2: **ocupam o mesmo espaço**.

**A regra que emerge sozinha:** cortar cada pedaço ao meio dobra os dois números. Ela descobre cortando, não decorando.

**O erro clássico da comparação:** achar que 1/5 > 1/3 porque 5 > 3. Com as barras lado a lado, é impossível manter esse erro.

## 3. Estrutura da tela
Duas ou mais barras de comprimento idêntico, com divisões diferentes, sobrepostas ou lado a lado.

## 4. Roteiro cinematográfico
Ao acertar uma equivalência, as duas barras **se sobrepõem** mostrando que as partes pintadas coincidem exatamente. Na comparação, a barra maior **avança sobre a menor**, com a diferença destacada.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | equivalência com barras sobrepostas |
| 2 | equivalência sem sobreposição |
| 3 | **comparar mesmo denominador** |
| 4 | **comparar mesmo numerador** (o degrau contraintuitivo) |
| 5 | comparar denominadores diferentes |

## 6. Diagnóstico
`MAIS_PARTES_MAIS_QUANTIDADE` (**o erro central**) · `COMPARA_SO_DENOMINADOR` · `MULTIPLICA_SO_UM` (dobra numerador sem denominador)

## 7. Falas
**howto:** *"Corte cada pedaço ao meio: o número de pedaços dobra, mas a quantidade é a mesma."*
**explain:** *"Sobreponha as barras. As partes pintadas ocupam o mesmo espaço?"*

## 8. Coreografia
```
[
  { fala: "Uma barra em dois.",       mostra: { dividirBarra: 2 },       sync: "junto" },
  { fala: "Outra em quatro.",         mostra: { dividirBarra: 4 },       sync: "junto" },
  { fala: "Um meio é igual a dois quartos!", mostra: { sobreporBarras: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **mesmo numerador** (nível 4).

---
---

# FICHA F74 — SOMAR FRAÇÕES

## 1. Identidade
**Competência:** N5.04 (adição e subtração de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que ao juntar partes do mesmo tamanho, **o tamanho da parte não muda**.

**O erro que a ficha existe para curar:** somar os denominadores (1/4 + 2/4 = 3/8). Ele vem de tratar fração como dois números independentes.

**A frase que ancora:** *"o de baixo diz o tamanho do pedaço. Juntar pedaços não muda o tamanho deles."*

**A regra dura:** só mesmo denominador nesta ficha. Denominador diferente exige equivalência (N5.03) antes — e o pré-requisito garante.

## 3. Estrutura da tela
Um "tanque" dividido em partes iguais, que se enche conforme a criança adiciona.

## 4. Roteiro cinematográfico
Ao somar, as partes **entram no tanque uma a uma**, e o denominador **permanece fixo e destacado** o tempo todo — visualmente imóvel, enquanto só o numerador cresce. Se a criança errar somando denominadores, o tanque **muda de tamanho absurdamente** e a voz aponta: *"o tanque não muda! Só o quanto está cheio."*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | somar com barras |
| 2 | somar simbolicamente |
| 3 | subtrair |
| 4 | resultado maior que 1 (fração imprópria) |
| 5 | simplificar o resultado |

## 6. Diagnóstico
`SOMA_DENOMINADOR` (**o erro central**) · `NAO_SIMPLIFICA` · `IMPROPRIA_INVALIDA` (acha que não pode passar de 1)

## 7. Falas
**howto:** *"Some só os de cima. O de baixo diz o tamanho do pedaço e não muda."*
**explain:** *"Olhe o tanque: ele continua dividido em quatro. Só encheu mais."*

## 8. Coreografia
```
[
  { fala: "O tanque tem quatro partes.", mostra: { destacarDenominador: 4 }, sync: "junto" },
  { fala: "Uma cheia, mais duas...",     mostra: { encherPartes: [1,2] },    sync: "junto" },
  { fala: "Três quartos!",               mostra: { mostrarFracao: "3/4" },   sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — nenhum precedido de erro `SOMA_DENOMINADOR` na mesma sessão.

---
---

# FICHA F76 — CONTAS COM VÍRGULA

## 1. Identidade
**Competência:** N6.02 (operações com decimais) · **Primitiva:** `InteractiveVertical` + `Quadrado100` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** somar e subtrair decimais — alinhando **a vírgula**, não os dígitos da direita.

**O erro que domina esta competência:** alinhar 3,5 + 12 pela direita, obtendo 3,5 + 1,2. A criança aplica o hábito da adição de inteiros.

**A regra que faz sentido:** só se soma o que é da mesma ordem. Décimo com décimo, unidade com unidade. **A vírgula é o marco que alinha as ordens.**

## 3. Estrutura da tela
Conta armada com **a coluna da vírgula destacada em vermelho**, servindo de eixo de alinhamento.

## 4. Roteiro cinematográfico
Ao montar a conta, as vírgulas **se atraem magneticamente** e alinham. Se a criança tentar alinhar pela direita, os números **balançam e não travam**, e a voz: *"as vírgulas precisam ficar uma sobre a outra."* Zeros de preenchimento aparecem **em cinza claro** onde faltam casas.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | mesma quantidade de casas |
| 2 | **casas diferentes** (com zeros de preenchimento) |
| 3 | subtração |
| 4 | com reagrupamento |
| 5 | multiplicação por 10/100 |

## 6. Diagnóstico
`ALINHA_PELA_DIREITA` (**o erro central**) · `IGNORA_ZEROS` · `VIRGULA_PERDIDA` (esquece no resultado)

## 7. Falas
**howto:** *"Alinhe as vírgulas uma embaixo da outra. Complete com zeros se faltar casa."*
**explain:** *"Décimo soma com décimo. A vírgula mostra onde cada ordem começa."*

## 8. Coreografia
```
[
  { fala: "Alinhe as vírgulas.",       mostra: { destacarVirgulas: true }, sync: "junto" },
  { fala: "Faltou uma casa aqui.",     mostra: { adicionarZero: true },    sync: "junto" },
  { fala: "Agora some normalmente!",   mostra: { destacarColuna: 0 },      sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um com **casas diferentes** (nível 2).

---
---

# FICHA F77 — A EXPRESSÃO

## 1. Identidade
**Competência:** AL.06 (expressões, propriedades e incógnita) · **Primitiva:** `Balanca` + `plain` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que uma expressão tem **ordem de resolução**, e que a incógnita pode estar em qualquer posição.

**Por que a ordem das operações não é arbitrária:** multiplicação é soma repetida — ela representa um "pacote" que precisa ser resolvido antes de somar. Explicar assim faz mais sentido que "é a regra".

**A conexão com a balança (AL.05):** a igualdade continua sendo equilíbrio. Agora com expressões dos dois lados.

## 3. Estrutura da tela
Expressão com as operações, e **parênteses visuais** que agrupam as partes.

## 4. Roteiro cinematográfico
As partes que devem ser resolvidas primeiro aparecem **dentro de bolhas** que se destacam. Ao resolver, a bolha **colapsa no resultado** e a expressão encurta. É resolução por etapas, visível.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | duas operações mesma ordem |
| 2 | mistura + e × |
| 3 | com parênteses |
| 4 | **incógnita no meio** |
| 5 | propriedades (comutativa, associativa, distributiva) |

## 6. Diagnóstico
`RESOLVE_DA_ESQUERDA` (ignora precedência) · `IGNORA_PARENTESES` · `SO_INCOGNITA_NO_FIM`

## 7. Falas
**howto:** *"Multiplicação e divisão vêm primeiro. Elas são pacotes fechados."*
**explain:** *"Resolva o que está dentro da bolha antes de continuar."*

## 8. Coreografia
```
[
  { fala: "Aqui tem uma multiplicação.", mostra: { bolha: [2,4] },        sync: "junto" },
  { fala: "Ela vem primeiro.",           mostra: { destacarBolha: true }, sync: "junto" },
  { fala: "Agora somamos o resto.",      mostra: { colapsarBolha: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um com **incógnita no meio**.

---
---

# FICHA F78 — ÂNGULOS

## 1. Identidade
**Competência:** GE.06 (ângulos e retas) · **Primitiva:** `ShapeCanvas` (modo ângulo) · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que ângulo é **abertura**, medida de giro — não um desenho de duas linhas.

**Por que a definição dinâmica importa:** a criança que vê ângulo como desenho estático acha que um ângulo com lados mais longos é "maior". **Ângulo não depende do tamanho dos lados.**

**A demonstração que resolve:** um raio **gira** em torno do vértice, e a abertura cresce. Os lados podem ser esticados sem mudar o ângulo.

## 3. Estrutura da tela
Vértice fixo, um raio fixo e outro **arrastável em giro**, com o arco da abertura destacado.

## 4. Roteiro cinematográfico
Ao arrastar, o **arco entre os raios cresce ou diminui** e o valor em graus acompanha. No nível 4+, os lados podem ser **esticados** — e o ângulo **não muda**, o que é demonstrado explicitamente.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | reto / agudo / obtuso (sem grau) |
| 2 | comparar dois ângulos |
| 3 | **lados de tamanhos diferentes** (a armadilha) |
| 4 | medir em graus |
| 5 | ângulos em polígonos |

## 6. Diagnóstico
`ANGULO_PELO_LADO` (**o erro central** — julga pelo tamanho dos lados) · `CONFUNDE_AGUDO_OBTUSO` · `TRANSFERIDOR_INVERTIDO`

## 7. Falas
**howto:** *"Ângulo é o quanto abriu, não o tamanho dos lados."*
**explain:** *"Olhe só a abertura entre as duas linhas, perto do vértice."*

## 8. Coreografia
```
[
  { fala: "Este raio pode girar.",     mostra: { girarRaio: true },      sync: "junto" },
  { fala: "Quanto mais gira, maior o ângulo.", mostra: { crescerArco: true }, sync: "junto" },
  { fala: "Mas o lado não importa!",   mostra: { esticarLado: true },    sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um com **lados de tamanhos diferentes**.

---
---

# FICHA F79 — POLÍGONOS

## 1. Identidade
**Competência:** GE.07 (triângulos e quadriláteros) · **Primitiva:** `ShapeCanvas` + `DragGroup` (laços) · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** classificar polígonos por lados e ângulos — e entender a **hierarquia** entre eles.

**A confusão que a ficha resolve, e que confunde adulto também:** todo quadrado **é** retângulo. Todo retângulo **é** paralelogramo. A criança acha que são categorias separadas.

**A ferramenta que resolve:** o **diagrama de laços** (da F51, em F0). Laços dentro de laços mostram a hierarquia visualmente.

## 3. Estrutura da tela
Formas para classificar e laços aninhados rotulados.

## 4. Roteiro cinematográfico
Ao colocar um quadrado no laço "retângulos", ele **é aceito** — e a voz explica: *"sim! Quadrado é um retângulo especial, com todos os lados iguais."* O laço menor (quadrados) aparece **dentro** do maior (retângulos), mostrando a inclusão.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | classificar triângulos por lados |
| 2 | por ângulos |
| 3 | quadriláteros |
| 4 | **hierarquia** (quadrado é retângulo) |
| 5 | propriedades combinadas |

## 6. Diagnóstico
`CATEGORIAS_EXCLUSIVAS` (**o erro central** — nega que quadrado seja retângulo) · `SO_UM_CRITERIO` · `ORIENTACAO_FIXA`

## 7. Falas
**howto:** *"Conte os lados e olhe os ângulos. Uma forma pode pertencer a mais de um grupo."*
**explain:** *"O quadrado tem quatro ângulos retos? Então ele também é retângulo."*

## 8. Coreografia
```
[
  { fala: "Este quadrado tem 4 ângulos retos.", mostra: { destacarAngulos: true }, sync: "junto" },
  { fala: "Isso o torna um retângulo!",         mostra: { moverParaLaco: "ret" }, sync: "junto" },
  { fala: "Um retângulo especial.",             mostra: { lacoAninhado: true },   sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **hierarquia** (nível 4).

---
---

# FICHA F80 — O PLANO CARTESIANO

## 1. Identidade
**Competência:** GE.08 (plano cartesiano, 1º quadrante) · **Primitiva:** `ShapeCanvas` (modo grade) · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** localizar pontos com **par ordenado** (x, y).

**Por que é a continuação natural de GE.05 (malhas):** a mesma lógica de duas coordenadas, agora com números nos dois eixos e origem no zero.

**A regra que evita o erro para sempre:** **primeiro anda, depois sobe.** A ordem do par não é arbitrária, e estabelecê-la desde o começo evita a inversão que persiste até o ensino médio.

## 3. Estrutura da tela
Plano com eixos numerados, origem marcada, e ponto a localizar ou colocar.

## 4. Roteiro cinematográfico
Ao inserir a coordenada x, um **marcador anda pelo eixo horizontal** até a posição. Ao inserir y, ele **sobe**. O caminho fica desenhado em duas etapas — **primeiro andar, depois subir** fica visualmente gravado.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | ler ponto marcado |
| 2 | colocar ponto |
| 3 | **caminho entre dois pontos** |
| 4 | desenhar figura por coordenadas |
| 5 | identificar padrão em pontos alinhados |

## 6. Diagnóstico
`INVERTE_XY` (**o erro clássico**) · `IGNORA_ORIGEM` · `CONTA_MARCAS`

## 7. Falas
**howto:** *"Primeiro ande no eixo de baixo. Depois suba."*
**explain:** *"O primeiro número diz quanto andar. O segundo, quanto subir."*

## 8. Coreografia
```
[
  { fala: "Primeiro ando três.",      mostra: { andarEixoX: 3 },       sync: "junto" },
  { fala: "Depois subo dois.",        mostra: { subirEixoY: 2 },       sync: "junto" },
  { fala: "Cheguei no ponto (3,2)!",  mostra: { marcarPonto: [3,2] },  sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **colocar** o ponto.

---
---

# FICHA F81 — ÁREA

## 1. Identidade
**Competência:** GM.08 (área) · **Primitiva:** `ArrayGrid` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** que área é **o chão** — a quantidade de quadradinhos que preenche a figura.

**A confusão que persiste desde o perímetro (GM.07):** área e perímetro são trocados constantemente. A ficha reforça a distinção com uma frase e uma imagem: **perímetro é a volta; área é o chão.** Uma se anda, a outra se preenche.

**A conexão com multiplicação:** área de retângulo é o mesmo arranjo retangular de N4.02. **Não é fórmula nova** — é a multiplicação com outro nome.

## 3. Estrutura da tela
Figura sobre malha, com preenchimento por quadradinhos.

## 4. Roteiro cinematográfico
Os quadradinhos **preenchem a figura** um a um (ou linha a linha), contados. No nível 4+, aparece o **contraste explícito**: a mesma figura com a borda acesa (perímetro) e depois com o interior preenchido (área), lado a lado.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | contar quadradinhos |
| 2 | **contar uma linha e multiplicar** |
| 3 | fórmula |
| 4 | **distinguir de perímetro** |
| 5 | figuras compostas (somar áreas) |

## 6. Diagnóstico
`CONFUNDE_PERIMETRO` · `CONTA_UM_A_UM` (não usa multiplicação) · `IGNORA_UNIDADE` (não usa cm²)

## 7. Falas
**howto:** *"Conte quantos quadradinhos cabem numa linha e multiplique pelo número de linhas."*
**explain:** *"Área é o que preenche por dentro, não a volta."*

## 8. Coreografia
```
[
  { fala: "Vamos preencher o chão.",  mostra: { preencherLinha: 0 },   sync: "junto" },
  { fala: "Quatro por linha.",        mostra: { contarLinha: 4 },      sync: "junto" },
  { fala: "Três linhas: doze!",       mostra: { multiplicar: [3,4] },  sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **distinção com perímetro**.

---
---

# FICHA F82 — PROBLEMAS DE MEDIDA

## 1. Identidade
**Competência:** GM.09 (conversões e problemas de medida) · **Primitiva:** `NumberLine` + `Balanca` · **Faixa:** F3

## 2. Fundamento
**O que a criança aprende:** resolver problemas que exigem **converter antes de comparar ou operar**.

**Por que trava:** o problema diz "uma corda de 2 m e outra de 150 cm — qual é maior?". A criança compara 2 e 150 e erra. **Falta o passo de converter.**

**A pergunta que orienta a conversão:** *"a unidade nova é maior ou menor? Se é menor, vou precisar de mais delas."* Isso decide multiplicar ou dividir sem decoreba.

## 3. Estrutura da tela
Régua com **duas escalas sobrepostas** (cm e m na mesma linha), ou balança com g e kg.

## 4. Roteiro cinematográfico
A régua mostra **100 cm ocupando exatamente o mesmo espaço que 1 m** — as duas escalas alinhadas visualmente. A quantidade não mudou; mudou o nome. Ao converter, os números **deslizam** entre as escalas.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | converter cm↔m |
| 2 | g↔kg, ml↔L |
| 3 | comparar após converter |
| 4 | **operar com unidades mistas** |
| 5 | problemas de várias etapas |

## 6. Diagnóstico
`COMPARA_SEM_CONVERTER` (**o erro central**) · `INVERTE_OPERACAO` (multiplica quando deveria dividir) · `MISTURA_GRANDEZAS`

## 7. Falas
**howto:** *"Deixe as duas na mesma unidade antes de comparar."*
**explain:** *"A unidade nova é maior ou menor? Se for menor, vai precisar de mais delas."*

## 8. Coreografia
```
[
  { fala: "Um metro tem cem centímetros.", mostra: { alinharEscalas: true }, sync: "junto" },
  { fala: "Mesma distância, outro nome.",  mostra: { destacarIgualdade: true }, sync: "junto" },
  { fala: "Agora dá pra comparar!",        mostra: { converterValor: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **comparação após conversão**.

---
---

# 📋 O QUE ESTE BLOCO COBRE

**O fio condutor de F3:** a criança entra sabendo operar com inteiros e sai entendendo que **número é mais que contagem**. Os quatro marcos que sustentam o resto são:

| | Marco | Por quê |
|---|---|---|
| **F72** | fração é número, tem lugar na reta | sem isso, fração nunca opera |
| **F75** | o quadrado de 100 vira 1 inteiro | conecta decimal, fração e porcentagem numa imagem |
| **F68** | partir para multiplicar (modelo de área) | dá sentido ao algoritmo e abre a álgebra |
| **F83** | média é nivelar, não fórmula | estatística com significado |

## Próximo bloco
**F4** — as 12 competências finais: multiplicar e dividir frações, porcentagem, razão, números negativos, equações, círculo, volume e estatística.

---

## 📋 CHANGELOG DESTE BLOCO

*v3.1 (ago/2026) — **F67 (Multiplicar por 10)** — fala corrigida: *"o algarismo desliza para a coluna à esquerda"* trocava uma misconception por outra (dígitos que se movem fisicamente, que quebra em decimais). Agora a causa vem antes da consequência: *"cada quantidade ficou dez vezes maior — por isso mudou de casa"*. **F83 (Média)** — níveis 1 a 3 restritos a conjuntos de **média inteira**: a metáfora de nivelar torres é fisicamente honesta só assim; o meio bloco entra no nível 4. Adendo normativo v3.1 acrescentado; **F68, F69 e F76** obrigadas a declarar `revelacaoProgressiva: true`.*

*v3.0 (jul/2026) — bloco fechado no formato de 9 seções, auditado estruturalmente (9 seções em todas, 5 níveis em todas, tag de misconception em todas, `explain` que não elogia e não entrega a resposta, coreografia completa, critério de domínio declarado).*
