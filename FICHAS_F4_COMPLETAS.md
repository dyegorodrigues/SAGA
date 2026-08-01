# 🎬 FICHAS COMPLETAS — BLOCO F4
**A generalização · 11 a 12 anos · onde o número vira letra e a matemática vira linguagem**

*Mesmo padrão de 9 seções dos blocos anteriores. Último bloco do currículo.*

---

# 📑 ÍNDICE — BLOCO F4 (12 fichas · 12 competências)

| # | Ficha | Competência | O marco cognitivo | Status |
|---|---|---|---|---|
| 1 | **F84** — A Reta Completa | N7.01 | **existe número abaixo do zero** | ✅ |
| 2 | **F85** — Operar com Negativos | N7.02 | dever e pagar na mesma reta | ✅ |
| 3 | **F86** — Multiplicar Frações | N5.05 | multiplicar pode **diminuir** | ✅ |
| 4 | **F87** — Porcentagem | N6.03 | 25% = 25/100 = 0,25 = 1/4 | ✅ |
| 5 | **F88** — Razão e Proporção | N6.04 | crescer junto, não somar junto | ✅ |
| 6 | **F89** — A Linguagem das Letras | AL.07 | a letra guarda o que não se sabe | ✅ |
| 7 | **F90** — Equações | AL.08 | **a balança com um saco fechado** | ✅ |
| 8 | **F91** — Círculo e Áreas | GE.09 | de onde vem a fórmula | ✅ |
| 9 | **F92** — Volume e Vistas | GE.10 | o objeto por três olhares | ✅ |
| 10 | **F93** — Conversão de Unidades | GM.10 | a unidade menor exige mais delas | ✅ |
| 11 | **F94** — Volume de Prismas | GM.11 | contar uma camada e multiplicar | ✅ |
| 12 | **F95** — Estatística e Chance | PE.04 | contar possibilidades | ✅ |

**Legenda:** ✅ **12 de 12 completas — bloco F4 fechado · CURRÍCULO COMPLETO**

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

**Fichas deste bloco obrigadas a declarar `revelacaoProgressiva: true`:** *(nenhuma — F4 já opera no simbólico)*
**Fichas deste bloco com exposição motora alta (exigem toque alternativo + snap):** F92, F95

---


# FICHA F84 — A RETA COMPLETA
*Existe número abaixo do zero. E a reta que ela usa desde os 5 anos só cresceu para a esquerda.*

## 1. Identidade
**Competência:** N7.01 (negativos e a reta completa) · **Primitiva:** `InteractiveNumberLine` · **Faixa:** F4 · **Tema:** termômetro, elevador, dívida

## 2. Fundamento

**O que a criança aprende:** que a reta numérica **continua para a esquerda do zero**, e que esses números representam quantidades reais.

**Por que é um choque conceitual:** por seis anos, o zero foi o fim — "não dá para tirar 5 de 3". Agora dá. **Isso contradiz tudo que ela aprendeu**, e precisa de contexto forte para fazer sentido.

**Os três contextos que funcionam** (e a ordem importa):
| Contexto | Por que funciona |
|---|---|
| **Termômetro** | vertical, familiar, e o negativo é fisicamente sentido (frio) |
| **Elevador** | subsolo é concreto e visitável |
| **Dinheiro** | dever é a experiência mais próxima da criança |

**A continuidade que dá segurança:** é a **mesma reta** da F19 (F0/F1). Ela não está aprendendo uma ferramenta nova — a ferramenta cresceu.

## 3. Estrutura da tela
1. **Enunciado** — "Onde fica o −3?"
2. **A reta** — agora **estendida para a esquerda**, com o zero destacado no centro
3. **Contexto visual** — termômetro ao lado, ou prédio com subsolo
4. **Marcador arrastável**

```
Onde fica o -3?

  <--+--+--+--+--+--+--+--+-->
    -4 -3 -2 -1 [0] 1  2  3

         termometro:
              | 3
              | 2
              | 1
              |[0]  <- congelamento
              |-1
              |-2
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **A extensão** *(primeira vez)* | a reta aparece **como ela sempre foi** (0 a 10). Então **cresce para a esquerda**, desenhando −1, −2, −3... A voz: *"a reta sempre continuou. Você só não tinha visto este lado."* | 3s |
| **O zero como fronteira** | o zero **pulsa** e ganha destaque permanente — é a origem, não o fim | 1,2s |
| **O contexto** | o termômetro aparece **alinhado verticalmente** com a reta, e os valores se correspondem. Ao arrastar o marcador, **a coluna de mercúrio acompanha** | contínuo |
| **Acerto** | a posição acende, e o contexto reage: o termômetro mostra gelo, o elevador desce ao subsolo | 2s |
| **Erro suave** | o marcador volta ao zero e **caminha passo a passo** para a esquerda, contado em voz alta: *"menos um, menos dois, menos três"* | 2,5s |
| **Fecho** | reta e contexto alinhados, com o ponto marcado nos dois | 1,8s |

**A extensão da reta na primeira vez é o momento da ficha.** Ver a reta conhecida crescer, em vez de aparecer uma reta nova, faz o negativo ser uma continuação e não uma exceção.

## 5. Os 5 níveis

| Nível | Tarefa | Contexto |
|---|---|---|
| **1** | localizar negativos na reta | termômetro |
| **2** | **comparar** dois negativos (−5 < −2) | termômetro |
| **3** | ordenar mistos (−3, 2, −7, 5) | reta pura |
| **4** | **distância entre pontos** (de −3 a 2 são 5) | reta |
| **5** | módulo — distância ao zero | reta |

**O nível 2 é o degrau contraintuitivo:** −5 é **menor** que −2, embora 5 seja maior que 2. Sem o termômetro, quase toda criança erra.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| −5 > −2 | `NEGATIVO_COMO_POSITIVO` | **o erro central** — ignora o sinal na comparação |
| contou o zero como um passo | `ZERO_COMO_PASSO` | erro de distância |
| posicionou negativo à direita | `LADO_ERRADO` | não internalizou a direção |

## 7. Falas

**audioPrompt:** *"Onde fica o menos três na reta?"*
**howto:** *"À esquerda do zero os números ficam menores. Quanto mais longe, menor."*
**explain:** *"Olhe o termômetro: menos cinco é mais frio que menos dois. Então é menor."*

## 8. Coreografia (nível 1)
```
[
  { fala: "A reta continua pra esquerda.", mostra: { estenderReta: -5 },    sync: "junto" },
  { fala: "Aqui é o zero.",                mostra: { destacarPonto: 0 },    sync: "junto" },
  { fala: "Menos um, menos dois, menos três!", mostra: { caminharAte: -3 }, sync: "junto" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo pelo menos uma **comparação entre negativos** (nível 2).

---
---

# FICHA F90 — EQUAÇÕES
*A balança com um saco fechado. Aos 11 anos, ela resolve equação sem saber que é álgebra.*

## 1. Identidade
**Competência:** AL.08 (equações do 1º grau) · **Primitiva:** `Balanca` · **Faixa:** F4

## 2. Fundamento

**O que a criança aprende:** encontrar o valor desconhecido mantendo o **equilíbrio**.

**Por que a balança carrega tudo:** é a mesma ferramenta da F46 (AL.05, em F2), onde ela aprendeu que `=` significa equilíbrio. Agora um dos pratos tem um **saco fechado** — e o saco é o **x**.

**A operação fundamental, e ela é visual:** para descobrir o peso do saco, **tira-se a mesma coisa dos dois lados**. A balança continua equilibrada. Isso É o princípio de equivalência das equações — e a criança o executa com as mãos antes de escrever.

**Por que quem aprendeu com a balança nunca esquece:** "passa para o outro lado trocando o sinal" é uma regra sem sentido. "Tira dos dois lados para continuar equilibrado" é uma ação com significado.

## 3. Estrutura da tela
1. **Enunciado** — "Quanto pesa o saco?"
2. **A balança** — um prato com o saco + pesos, outro com pesos
3. **A equação espelhada** — escrita abaixo, atualizando conforme a criança age
4. **Ferramentas** — botão de "tirar dos dois lados"

```
Quanto pesa o saco?

        /\
   ____/  \____
   |          |
 [saco][3]   [8]
   \          /
     equilibrada

    x + 3 = 8
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **Abertura** | a balança entra **já equilibrada**, com o saco e os pesos. A equação aparece embaixo, espelhando exatamente o que está nos pratos | 1,8s |
| **A pergunta** | a voz. O saco **pulsa** com um ponto de interrogação | 1,3s |
| **A operação** | ao usar "tirar dos dois lados", a criança escolhe quanto. Os pesos **saem simultaneamente dos dois pratos**, com animação sincronizada | 1,5s |
| **O equilíbrio mantido** | a balança **oscila levemente e volta ao equilíbrio** — mostrando que a operação foi válida. A equação embaixo **se atualiza sozinha** | 1,2s |
| **A revelação** | quando sobra só o saco de um lado, ele **fica transparente** mostrando os pesos dentro. Voz: *"o saco pesa cinco!"* | 2s |
| **Erro suave** | se tirar de um lado só, a balança **desequilibra dramaticamente** e a voz: *"opa! Precisa tirar dos dois lados para continuar justo."* Os pesos voltam. | 2,5s |
| **Fecho** | balança equilibrada com o valor revelado, e a equação resolvida escrita | 2s |

**O desequilíbrio ao operar em um lado só é a lição mais valiosa da ficha.** A criança **sente** por que a regra existe.

## 5. Os 5 níveis

| Nível | Formato | Exemplo |
|---|---|---|
| **1** | soma simples | x + 3 = 8 |
| **2** | subtração | x − 2 = 5 |
| **3** | **sacos iguais** (coeficiente) | 2x = 10 |
| **4** | combinado | 2x + 1 = 9 |
| **5** | **incógnita nos dois lados** | x + 5 = 2x + 1 |

**O nível 5 é o fecho do currículo inteiro** — e ainda é a mesma balança que ela usou aos 7 anos.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| tirou de um lado só | `QUEBRA_EQUILIBRIO` | não entendeu o princípio |
| somou quando devia tirar | `OPERACAO_INVERSA_ERRADA` | |
| com 2x, dividiu só um lado | `NAO_APLICA_AOS_DOIS` | |
| respondeu o total em vez do saco | `RESPONDE_O_TODO` | |

## 7. Falas

**audioPrompt:** *"Quanto pesa o saco?"*
**howto:** *"Tire a mesma coisa dos dois lados. A balança continua equilibrada."*
**explain:** *"O que você tirar de um lado, tire do outro também. Senão desequilibra."*

## 8. Coreografia (nível 1)
```
[
  { fala: "A balança está equilibrada.", mostra: { equilibrada: true },       sync: "junto" },
  { fala: "Quanto pesa o saco?",         mostra: { pulsarSaco: true },        sync: "junto" },
  { fala: "Tiro três dos dois lados.",   mostra: { removerAmbos: 3 },         sync: "junto" },
  { fala: "Sobrou o saco e cinco!",      mostra: { revelarSaco: 5 },          sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 4, de: 4, sessoes: 3 }` — **rigoroso**, incluindo um do nível 3 (coeficiente) ou acima.

---
---

# FICHA F87 — PORCENTAGEM
*Quatro notações, um desenho só.*

## 1. Identidade
**Competência:** N6.03 (porcentagem) · **Primitiva:** `Quadrado100` + `SingaporeBars` · **Faixa:** F4

## 2. Fundamento

**O que a criança aprende:** que porcentagem é **parte de cem** — e que é a mesma coisa que fração e decimal, escrita de outro jeito.

**A imagem que unifica tudo:** o **quadrado de 100**, que ela usou para centena (F2) e para decimais (F3), agora mostra porcentagem. **25 quadradinhos pintados são, ao mesmo tempo:**

| 25% | 25/100 | 0,25 | 1/4 |
|---|---|---|---|

**As quatro no mesmo desenho.** Isso impede que ela trate como assuntos separados — que é exatamente o que acontece no ensino tradicional.

**Por que trava:** porcentagem é tratada como operação nova. "50% de 20" vira 50−20 ou 50+20. Faltou entender que % é **notação**, não operação.

## 3. Estrutura da tela
Quadrado de 100 com parte pintada, e as quatro notações aparecendo simultaneamente.

```
Quanto esta pintado?

+--+--+--+--+--+--+--+--+--+--+
|##|##|##|##|##|  |  |  |  |  |
|##|##|##|##|##|  |  |  |  |  |
|##|##|##|##|##|  |  |  |  |  |
|##|##|##|##|##|  |  |  |  |  |
|##|##|##|##|##|  |  |  |  |  |
+--+--+--+--+--+--+--+--+--+--+

  50%  =  50/100  =  0,5  =  1/2
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **A reciclagem** | o quadrado aparece com os três rótulos que já teve: *"foi 100... foi 1 inteiro... agora é 100%"* — a mesma imagem, três significados | 2,5s |
| **A pintura** | ao pintar, as **quatro notações sobem juntas** em tempo real, lado a lado | contínuo |
| **A âncora visual** *(níveis 1-2)* | ao atingir 50%, 25% ou 10%, o quadrado **destaca a divisão correspondente** (metade, quarto, uma coluna) | 1,5s |
| **A aplicação** *(nível 3+)* | "25% de 80": o quadrado vira uma **barra de 80**, e um quarto dela se destaca | 2,2s |
| **Acerto** | as quatro notações **acendem juntas** com linhas ligando ao mesmo desenho | 2,2s |
| **Erro suave** | o quadrado é dividido visualmente e a fração equivalente é destacada | 2,5s |

**As quatro notações subindo juntas é a ficha inteira.** É impossível tratá-las como assuntos diferentes vendo isso.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| **1** | pintar N de 100 e ler a porcentagem |
| **2** | **as âncoras** (50%, 25%, 10%, 75%) |
| **3** | porcentagem de uma quantidade (25% de 80) |
| **4** | **desconto e acréscimo** |
| **5** | porcentagem inversa (20% é 15, qual o total?) |

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| tratou % como inteiro (50% de 20 = 30) | `PORCENTO_COMO_NUMERO` | **o erro central** |
| confundiu "50% de" com "50 a menos" | `DESCONTO_ABSOLUTO` | |
| não relacionou com fração | `NOTACOES_SEPARADAS` | |

## 7. Falas

**audioPrompt:** *"Quanto por cento está pintado?"*
**howto:** *"Por cento significa 'de cada cem'. Conte quantos quadradinhos de 100 estão pintados."*
**explain:** *"Metade do quadrado são 50 quadradinhos. Isso é 50 por cento."*

## 8. Coreografia
```
[
  { fala: "O quadrado inteiro é 100%.",  mostra: { rotular: "100%" },       sync: "junto" },
  { fala: "Metade pintada.",             mostra: { pintar: 50 },            sync: "junto" },
  { fala: "50%, meio, zero vírgula cinco!", mostra: { mostrarQuatro: true },sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **aplicação** (nível 3).

---
---

# FICHA F86 — MULTIPLICAR FRAÇÕES
*Multiplicar pode diminuir. E isso quebra tudo que ela sabia.*

## 1. Identidade
**Competência:** N5.05 (multiplicação e divisão de frações) · **Primitiva:** `ArrayGrid` (modo área) · **Faixa:** F4

## 2. Fundamento

**O que a criança aprende:** que multiplicar por uma fração menor que 1 **diminui** o resultado.

**Por que é o maior choque conceitual do currículo:** por cinco anos, "multiplicar" significou "ficar maior". Agora 1/2 × 8 = 4. **Isso contradiz uma intuição profundamente instalada.**

**A tradução que resolve:** `×` aqui significa **"de"**. Metade **de** 8. Um terço **de** 12. A criança já sabe fazer isso desde F2 (metade, terço, quarto) — só não sabia que era multiplicação.

**O modelo que mostra:** o retângulo de área. 1/2 × 3/4 é pintar metade de três quartos — e o resultado é a **interseção**, visivelmente menor que os dois.

## 3. Estrutura da tela
Retângulo com divisões nos dois sentidos: horizontal para uma fração, vertical para a outra. A interseção é o produto.

```
1/2 x 3/4

+---+---+---+---+
|///|///|///|   |   <- 3/4 na horizontal
+---+---+---+---+
|###|###|###|   |   <- 1/2 na vertical
+---+---+---+---+
     ^ interseccao = 3/8
```

## 4. Roteiro cinematográfico

| Momento | O que acontece | Tempo |
|---|---|---|
| **A tradução** *(primeira vez)* | a voz diz: *"vezes quer dizer 'de'. Metade DE oito."* E o número 8 aparece com metade destacada | 2s |
| **A primeira fração** | o retângulo se divide **verticalmente** e 3/4 se pintam com listras | 1,5s |
| **A segunda** | divide-se **horizontalmente** e 1/2 se pinta com outra textura | 1,5s |
| **A interseção** | a área onde as duas se cruzam **acende sólida** — é o produto | 1,8s |
| **A contagem** | o retângulo mostra 8 partes no total, 3 na interseção: **3/8** | 1,5s |
| **O choque produtivo** | a voz aponta: *"olha! O resultado é menor que os dois. Multiplicar por menos de um diminui."* | 2s |
| **Erro suave** | as duas frações são pintadas separadamente e a interseção é destacada com contorno | 2,5s |

**Nomear o choque em voz alta é importante.** Se o app não disser "isso é estranho, e é assim mesmo", a criança acha que errou.

## 5. Os 5 níveis

| Nível | Operação |
|---|---|
| **1** | fração × inteiro (1/2 × 8) |
| **2** | fração × inteiro, com o modelo |
| **3** | **fração × fração** com área |
| **4** | fração × fração simbólico |
| **5** | **divisão de frações** (quantos 1/4 cabem em 2?) |

**O nível 5 é o mais difícil do currículo.** Dividir por fração aumenta — outro choque. A pergunta "quantos cabem" é o que dá sentido.

## 6. Diagnóstico

| Erro | Tag | Significado |
|---|---|---|
| esperou resultado maior | `MULTIPLICAR_AUMENTA` | **o choque não resolvido** |
| somou as frações | `SOMA_EM_VEZ_DE_MULTIPLICAR` | |
| na divisão, esperou diminuir | `DIVIDIR_DIMINUI` | idem, ao contrário |

## 7. Falas

**audioPrompt:** *"Metade de três quartos."*
**howto:** *"Vezes quer dizer 'de'. Pinte a primeira fração e depois pegue a parte pedida dela."*
**explain:** *"Multiplicar por menos de um sempre diminui. Metade de algo é menor que esse algo."*

## 8. Coreografia
```
[
  { fala: "Vezes quer dizer 'de'.",     mostra: { traduzirSimbolo: true },  sync: "junto" },
  { fala: "Aqui estão três quartos.",   mostra: { pintarVertical: 0.75 },   sync: "junto" },
  { fala: "Agora a metade disso.",      mostra: { pintarHorizontal: 0.5 },  sync: "junto" },
  { fala: "Três oitavos!",              mostra: { destacarInterseccao: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **fração × fração** (nível 3).

---
---

# FICHA F88 — RAZÃO E PROPORÇÃO

## 1. Identidade
**Competência:** N6.04 (razão e proporcionalidade) · **Primitiva:** `SingaporeBars` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** que duas quantidades podem **crescer juntas** mantendo a relação.

**O erro que domina:** somar em vez de multiplicar. "A receita usa 2 de farinha para 3 de leite. Se usar 4 de farinha?" — ela responde 5 (somou 2), não 6.

**A imagem que impede o erro:** duas barras que **dobram juntas**. Visualmente é impossível somar só de um lado.

## 3. Estrutura da tela
Duas barras proporcionais lado a lado, com controle de escala.

## 4. Roteiro cinematográfico
Ao dobrar a escala, **as duas barras crescem simultaneamente**, mantendo a proporção visível. Se a criança tentar mudar só uma, a outra **acompanha automaticamente** — a proporção é fisicamente imposta pela interface.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | dobrar a receita |
| 2 | triplicar |
| 3 | escala qualquer |
| 4 | **razão como fração** |
| 5 | regra de três |

## 6. Diagnóstico
`SOMA_EM_VEZ_DE_ESCALAR` (**o erro central**) · `ESCALA_UM_LADO` · `INVERTE_RAZAO`

## 7. Falas
**howto:** *"Se um dobra, o outro dobra também. Eles crescem juntos."*
**explain:** *"Olhe as barras: elas mantêm a mesma proporção sempre."*

## 8. Coreografia
```
[
  { fala: "Dois de farinha, três de leite.", mostra: { mostrarBarras: [2,3] }, sync: "junto" },
  { fala: "Vou dobrar a receita.",           mostra: { escalar: 2 },           sync: "junto" },
  { fala: "As duas dobram juntas!",          mostra: { destacarProporcao: true }, sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de escala não-inteira.

---
---

# FICHA F85 — OPERAR COM NEGATIVOS

## 1. Identidade
**Competência:** N7.02 (operações com inteiros) · **Primitiva:** `InteractiveNumberLine` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** somar e subtrair na reta completa.

**A regra que dá sentido, e evita decoreba:** somar é **andar para a direita**; subtrair é **andar para a esquerda**. Vale para qualquer número, positivo ou negativo. **Uma regra só, em vez de quatro casos.**

**O contexto que ancora:** dever e pagar. −5 + 3 é "devia 5, paguei 3, ainda devo 2".

## 3. Estrutura da tela
Reta completa com marcador, contexto de dívida/saldo visível.

## 4. Roteiro cinematográfico
O marcador **anda na direção da operação**, com o rastro desenhado. O saldo/dívida atualiza em tempo real ao lado. Ao cruzar o zero, há um **destaque especial** — a voz marca o momento: *"passou do zero!"*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | positivo + negativo |
| 2 | negativo + positivo |
| 3 | dois negativos |
| 4 | subtração de negativo |
| 5 | expressões mistas |

## 6. Diagnóstico
`IGNORA_SINAL` · `DIRECAO_ERRADA` · `SUBTRAIR_NEGATIVO` (o caso mais confuso)

## 7. Falas
**howto:** *"Somar aumenta a posição. Subtrair diminui. Se você tira uma dívida, sua posição aumenta."*

> **⚠️ Correção v3.1 — fala.** A versão anterior dizia *"somar anda para a direita, subtrair anda para a esquerda, **sempre**"*. A regra quebra em `5 − (−3)`: a criança que a decorou anda para a esquerda e chega em 2, e a regra que a ajudou passa a atrapalhar. Como a própria ficha diagnostica `SUBTRAIR_NEGATIVO` como o caso mais confuso, a fala não pode ser a fonte do erro. Usar sempre o contexto de dívida: *"subtrair um negativo é cancelar uma dívida — você fica mais rico"*. O nível que introduz `a − (−b)` deve ter animação de **remoção de peso/dívida**, não de deslocamento na reta.
**explain:** *"Comece no primeiro número e ande na direção da operação."*

## 8. Coreografia
```
[
  { fala: "Começo no menos cinco.",   mostra: { marcarPonto: -5 },      sync: "junto" },
  { fala: "Somar anda pra direita.",  mostra: { andarDireita: 3 },      sync: "junto" },
  { fala: "Cheguei no menos dois!",   mostra: { destacarPonto: -2 },    sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um que **cruze o zero**.

---
---

# FICHA F89 — A LINGUAGEM DAS LETRAS

## 1. Identidade
**Competência:** AL.07 (linguagem algébrica e generalização) · **Primitiva:** `SingaporeBars` + `plain` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** que uma letra **guarda o lugar** de um número desconhecido ou variável.

**A ponte natural:** ela já usou a caixa vazia (☐) desde F1. A letra é a mesma coisa com outro símbolo. **Não é conceito novo — é notação nova.**

**A generalização que abre o pensamento:** "o dobro de qualquer número" é `2n`. Uma expressão que vale para infinitos casos. É a primeira vez que a matemática fala do **geral**, não do particular.

## 3. Estrutura da tela
Padrão de figuras crescente, tabela de valores, e a expressão a descobrir.

## 4. Roteiro cinematográfico
Um padrão cresce (1 quadrado, depois 3, depois 5...). A tabela se preenche. A criança busca a regra. Ao acertar, a expressão aparece e a voz demonstra: *"vale para o caso 10? E para o 100?"* — e o padrão **se projeta** para casos grandes, mostrando o poder da generalização.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | caixa vazia vira letra |
| 2 | escrever expressão simples (o dobro de n) |
| 3 | ler expressão em contexto |
| 4 | **descobrir a regra de um padrão** |
| 5 | equivalência de expressões (2n+2n = 4n) |

## 6. Diagnóstico
`LETRA_COMO_OBJETO` (acha que n significa "número de nozes") · `SO_CASO_PARTICULAR` · `NAO_GENERALIZA`

## 7. Falas
**howto:** *"A letra guarda o lugar de qualquer número. Se n for 5, quanto vale 2n?"*
**explain:** *"Teste sua regra em dois casos da tabela. Funciona nos dois?"*

## 8. Coreografia
```
[
  { fala: "A caixa vazia virou letra.",  mostra: { transformarCaixa: "n" }, sync: "junto" },
  { fala: "n pode ser qualquer número.", mostra: { testarValores: true },   sync: "junto" },
  { fala: "2n é sempre o dobro!",        mostra: { generalizar: true },     sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **descobrir a regra** (nível 4).

---
---

# FICHA F91 — CÍRCULO E ÁREAS

## 1. Identidade
**Competência:** GE.09 (círculo; áreas de triângulo e paralelogramo) · **Primitiva:** `ShapeCanvas` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** de onde vêm as fórmulas de área — em vez de decorá-las.

**A demonstração do triângulo:** dois triângulos iguais **formam um retângulo**. Por isso a área é base × altura **dividido por 2**. A criança monta e vê.

**A demonstração do paralelogramo:** cortar um triângulo de uma ponta e **encaixar do outro lado** vira um retângulo. Mesma área, forma diferente.

**Por que isso importa:** fórmula decorada se esquece. Fórmula **derivada** se reconstrói.

## 3. Estrutura da tela
Figuras manipuláveis com cortes e encaixes.

## 4. Roteiro cinematográfico
No triângulo: uma **cópia espelhada** desliza e encaixa, formando o retângulo. A fórmula aparece **derivada da montagem**. No paralelogramo: o corte acontece com animação de tesoura, e a peça **viaja** para o outro lado.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | área do triângulo por montagem |
| 2 | fórmula do triângulo |
| 3 | paralelogramo por corte |
| 4 | círculo: raio, diâmetro, circunferência |
| 5 | área do círculo (aproximação por setores) |

## 6. Diagnóstico
`ESQUECE_DIVIDIR_POR_2` · `ALTURA_ERRADA` (usa o lado em vez da altura) · `CONFUNDE_RAIO_DIAMETRO`

## 7. Falas
**howto:** *"Dois triângulos iguais formam um retângulo. Por isso divide por dois."*
**explain:** *"A altura é a linha perpendicular à base, não o lado inclinado."*

## 8. Coreografia
```
[
  { fala: "Faço uma cópia do triângulo.", mostra: { duplicarEspelhado: true }, sync: "junto" },
  { fala: "As duas formam um retângulo!", mostra: { encaixar: true },          sync: "junto" },
  { fala: "Então a área é a metade.",     mostra: { mostrarFormula: true },    sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo a **derivação** de pelo menos uma fórmula.

---
---

# FICHA F92 — VOLUME E VISTAS

## 1. Identidade
**Competência:** GE.10 (volume e vistas) · **Primitiva:** `ArrayGrid` (modo 3D) · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** representar um objeto tridimensional por suas **vistas** (frente, lado, cima) e reconstruí-lo a partir delas.

**Por que é uma competência espacial distinta:** exige **rotação mental** — imaginar o objeto de outro ângulo sem vê-lo. É uma das habilidades mais preditivas de sucesso em engenharia e matemática avançada.

## 3. Estrutura da tela
Construção de cubinhos rotacionável, e as três vistas ao lado.

## 4. Roteiro cinematográfico
Ao girar a construção, **a vista correspondente se destaca** no painel lateral. No modo reconstrução, a criança monta a partir das vistas, e a construção **se compara automaticamente** com o alvo.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | identificar a vista frontal |
| 2 | as três vistas |
| 3 | **reconstruir a partir das vistas** |
| 4 | contar cubinhos ocultos |
| 5 | desenhar as vistas de uma construção dada **O nível 4 é o mais difícil:** contar cubos que não se vê exige modelo mental completo. |

## 6. Diagnóstico
`IGNORA_OCULTOS` · `VISTA_TROCADA` · `SEM_ROTACAO_MENTAL`

## 7. Falas
**howto:** *"Imagine olhando de cima. O que você veria?"*
**explain:** *"Gire a construção e compare com a vista pedida."*

## 8. Coreografia
```
[
  { fala: "Esta é a construção.",     mostra: { mostrar3D: true },      sync: "junto" },
  { fala: "Olhando de frente...",     mostra: { girarPara: "frente" },  sync: "junto" },
  { fala: "Vemos este desenho!",      mostra: { destacarVista: 0 },     sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo uma **reconstrução**.

---
---

# FICHA F93 — CONVERSÃO DE UNIDADES

## 1. Identidade
**Competência:** GM.10 (conversão de unidades) · **Primitiva:** `NumberLine` + `Balanca` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** converter entre unidades da mesma grandeza com critério.

**A pergunta que decide multiplicar ou dividir:** *"a unidade nova é maior ou menor? Se é menor, vou precisar de mais delas."* Isso substitui a decoreba do "para a direita multiplica".

**A conexão com decimais:** converter é multiplicar ou dividir por potências de 10 — a mesma operação da F67 (×10). Não é conteúdo novo.

## 3. Estrutura da tela
Régua com escalas sobrepostas, ou balança com dois pratos em unidades diferentes.

## 4. Roteiro cinematográfico
As duas escalas aparecem **alinhadas na mesma linha** — 100 cm ocupando o mesmo espaço que 1 m. Ao converter, os números **deslizam entre as escalas** e a quantidade física **não muda de tamanho**, só de nome.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | cm↔m |
| 2 | g↔kg, ml↔L |
| 3 | com decimais (1,5 m = 150 cm) |
| 4 | **escolher a unidade adequada** |
| 5 | problemas com conversão embutida |

## 6. Diagnóstico
`INVERTE_OPERACAO` · `MISTURA_GRANDEZAS` · `IGNORA_DECIMAL`

## 7. Falas
**howto:** *"Unidade menor: você precisa de mais delas. Unidade maior: menos."*
**explain:** *"A quantidade é a mesma. Só o nome e o número mudam."*

## 8. Coreografia
```
[
  { fala: "Um metro e cem centímetros.", mostra: { alinharEscalas: true },  sync: "junto" },
  { fala: "É a mesma distância!",        mostra: { destacarIgual: true },   sync: "junto" },
  { fala: "Só mudou o nome.",            mostra: { trocarUnidade: true },   sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um com **decimais**.

---
---

# FICHA F94 — VOLUME DE PRISMAS

## 1. Identidade
**Competência:** GM.11 (volume de prismas) · **Primitiva:** `ArrayGrid` (modo 3D) · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** que volume é **quantos cubinhos cabem** — e que basta contar uma camada e multiplicar.

**O erro clássico:** somar as três dimensões em vez de multiplicar. Vem de não visualizar o preenchimento.

**A descoberta que a criança faz sozinha:** ao encher camada por camada, ela percebe que **todas as camadas são iguais**. Contar uma e multiplicar pela altura é dedução dela, não regra dada.

**A conexão com área:** a primeira camada É a área da base. Volume = área da base × altura. A fórmula se constrói sobre o que ela já sabe.

## 3. Estrutura da tela
Caixa transparente e cubinhos para encher, camada por camada.

## 4. Roteiro cinematográfico
Ao encher a primeira camada, ela **se destaca e é contada** — e a voz nomeia: *"esta é a área da base"*. Ao adicionar a segunda camada, a voz pergunta: *"precisa contar de novo?"* A criança percebe que não. As camadas seguintes se **preenchem automaticamente** quando ela responde certo.

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | contar cubinhos um a um |
| 2 | **contar uma camada e multiplicar** |
| 3 | fórmula |
| 4 | dimensão faltante |
| 5 | prismas não retangulares |

## 6. Diagnóstico
`SOMA_DIMENSOES` (**o erro central**) · `CONFUNDE_COM_AREA` · `IGNORA_UNIDADE_CUBICA`

## 7. Falas
**howto:** *"Conte quantos cabem numa camada. Depois multiplique pelo número de camadas."*
**explain:** *"Todas as camadas são iguais. Não precisa contar todas."*

## 8. Coreografia
```
[
  { fala: "Vamos encher a primeira camada.", mostra: { encherCamada: 0 },   sync: "junto" },
  { fala: "Doze cubinhos. Essa é a base.",   mostra: { contarCamada: 12 },  sync: "junto" },
  { fala: "E cabem três camadas!",           mostra: { empilharCamadas: 3 },sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um com **dimensão faltante** (nível 4).

---
---

# FICHA F95 — ESTATÍSTICA E CHANCE

## 1. Identidade
**Competência:** PE.04 (estatística e probabilidade por contagem) · **Primitiva:** `SingaporeBars` + `ArrayGrid` · **Faixa:** F4

## 2. Fundamento
**O que a criança aprende:** contar possibilidades e calcular chance como fração.

**A falácia que a ficha existe para quebrar:** *"deu cara cinco vezes, agora vai dar coroa"*. Ela aparece cedo e persiste na vida adulta.

**A experiência que quebra:** girar a roleta **muitas vezes** e ver que cada giro **não lembra do anterior**. A frequência se aproxima da previsão no longo prazo, mas cada evento é independente. **Sem viver isso, a intuição errada permanece.**

**A contagem de possibilidades:** com 3 camisetas e 2 calças, quantas combinações? A árvore de possibilidades torna visível.

## 3. Estrutura da tela
Roleta ou saco de bolas, com histórico de resultados e gráfico de frequência acumulada.

## 4. Roteiro cinematográfico
Ao girar repetidamente, o **gráfico de frequência se constrói em tempo real**. Com poucos giros, ele oscila muito. Com muitos, **converge para a previsão**. A voz narra a descoberta: *"olha, com poucos giros varia bastante. Com muitos, chega perto do esperado."*

Se a criança apostar na falácia (esperar compensação), o app **mostra o histórico** e aponta: *"cada giro é independente. A roleta não lembra."*

## 5. Os 5 níveis

| Nível | Conteúdo |
|---|---|
| 1 | certo / possível / impossível |
| 2 | mais provável / menos provável |
| 3 | **chance como fração** |
| 4 | frequência com muitas repetições |
| 5 | **contar possibilidades** (árvore) |

## 6. Diagnóstico
`FALACIA_APOSTADOR` (**o alvo**) · `TUDO_CINQUENTA` (acha que tudo é 50/50) · `IGNORA_TOTAL` (não forma a fração)

## 7. Falas
**howto:** *"Conte quantos resultados favoráveis e quantos possíveis. A chance é a fração."*
**explain:** *"Cada giro é independente. O que aconteceu antes não muda o próximo."*

## 8. Coreografia
```
[
  { fala: "Três bolas azuis de cinco.",  mostra: { mostrarSaco: [3,5] },   sync: "junto" },
  { fala: "A chance é três quintos.",    mostra: { mostrarFracao: "3/5" }, sync: "junto" },
  { fala: "Vamos testar cem vezes!",     mostra: { simularGiros: 100 },    sync: "depois" }
]
```

## 9. Domínio
`{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um de **chance como fração** (nível 3).

---
---

# 📋 O QUE ESTE BLOCO COBRE — E O QUE FECHA

**O fio condutor de F4:** a criança entra sabendo operar e sai **generalizando**. Três marcos fecham o currículo:

| | Marco | Por quê |
|---|---|---|
| **F84/F85** | a reta cresce para a esquerda | o número deixa de ser quantidade e vira posição com direção |
| **F86** | multiplicar pode diminuir | quebra a última intuição do mundo dos inteiros |
| **F90** | a balança com o saco fechado | **álgebra, com a mesma ferramenta que ela usa desde os 7 anos** |

## O ciclo completo

A criança que percorreu os cinco blocos:
- começou **parando de contar** para comparar (F07, aos 4 anos)
- descobriu que **o último número é a quantidade** (F01)
- aprendeu que **dez viram um** (F21) — e depois que **dez dezenas viram cem** (F37), e que isso **continua depois da vírgula** (F75)
- entendeu que **igualdade é equilíbrio** (F46, aos 8) — e usou isso para **resolver equações** (F90, aos 12)
- usou **a mesma reta numérica** dos 5 aos 12 anos, que só cresceu (F19 → F72 → F84)

**Nenhuma ferramenta foi descartada. Todas cresceram junto com ela.**

---

## 📋 CHANGELOG DESTE BLOCO

*v3.1 (ago/2026) — **F85 (Operar com negativos)** — howto corrigido: *"somar anda para a direita, subtrair anda para a esquerda, sempre"* quebra em `5 − (−3)` e era a provável fonte da própria misconception `SUBTRAIR_NEGATIVO` que a ficha diagnostica. Substituído pelo contexto de dívida. Adendo normativo v3.1 acrescentado.*

*v3.0 (jul/2026) — bloco fechado no formato de 9 seções, auditado estruturalmente (9 seções em todas, 5 níveis em todas, tag de misconception em todas, `explain` que não elogia e não entrega a resposta, coreografia completa, critério de domínio declarado).*
