# Roteiro até o fim — de 7 competências no Padrão Ouro às 88

> Escrito em 5/ago/2026, depois da pergunta que ninguém tinha feito ainda:
> *"a gente já está na multiplicação, eu nem lembro o porquê. Não consigo
> enxergar o início."* A resposta honesta é que o início existe, funciona, e é
> feito de outro jeito. Este documento decide o que fazer com ele.

---

## 1. Onde estamos, em número

Levantado do próprio código, não de memória (`ALL_MATH_TRACKS`, `contentStatus`,
`COMPOSER_CANARIES`):

| Estado | Quantas | O que significa |
|---|---|---|
| **Padrão Ouro, no ar** | **7** | N3.09, N3.10, N4.03, N4.04, N4.06, N4.07, N4.08 |
| **Legado servindo** | **40** | joga hoje, sem ficha, sem micro-aula, sem diagnóstico |
| **Vazio** | **41** | cai no placeholder "Em construção!" |
| **Total** | **88** | as competências do grafo |

Três estados, não dois. É essa distinção que o painel de telas do começo tornou
visível pela primeira vez.

---

## 2. A pergunta que decide o roteiro

> *"Eles já são existentes, mas eles têm que ver se eles estão compatíveis com
> as fichas, com o novo formato, Padrão Ouro. Não sei se vale a pena tu estar
> gastando todo esse esforço."*

A resposta curta: **não, não vale a pena refazer os 40 legados**. A resposta
longa é o resto desta seção.

### O que o legado NÃO tem

Um gerador legado é uma função que devolve uma pergunta. Ela funciona: a criança
lê, responde, acerta ou erra. O que falta é tudo o que vem depois do erro.

| Camada | Legado | Padrão Ouro |
|---|---|---|
| Pergunta na tela | ✅ | ✅ |
| Escada de 5 níveis | parcial, implícita | declarada na ficha |
| **Micro-aula** (ensina antes de cobrar) | ❌ | coreografia declarada |
| **Distratores diagnósticos** | ❌ genéricos | um erro nomeado por distrator |
| **Radar** (por que errou) | ❌ silêncio | hipótese com peso |
| **Oficina** (resgate) | ❌ nada a prescrever | ficha do pré-requisito |
| Contrato testável | ❌ | contrato + sonda de mutação |

O legado é **correto e mudo**. Ele ensina como um livro de exercícios: propõe e
corrige. Não sabe por que a criança errou, então não sabe o que fazer a seguir —
e "saber o que fazer a seguir" é o app inteiro.

### O critério: refazer onde o diagnóstico paga

Nem toda competência precisa de Radar. Contar cinco peixinhos tem um modo de
errar (contou errado) e a correção é contar de novo. Reagrupar na subtração tem
seis modos de errar, e cada um pede uma aula diferente.

**Regra de decisão:** uma competência sobe para o Padrão Ouro quando existe
**mais de uma maneira previsível de errar** e essas maneiras pedem **respostas
pedagógicas diferentes**. Onde só há "contou errado", o legado basta.

Aplicando a regra aos 40 legados:

| Faixa | Nós | Decisão | Por quê |
|---|---|---|---|
| **N1** (contar, comparar, numeral) | 12 | **fica legado** | erro é contagem; a correção é contar junto. O Radar não teria hipótese que separar |
| **N2** (dezenas, valor posicional) | 5 | **sobe** | "23 tem 2 ou 20 dezenas?" é confusão conceitual clássica, e o material dourado já existe |
| **N3.01–N3.08** (somar, subtrair, reagrupar) | 8 | **sobe** | vai-um esquecido, coluna invertida, desconto esquecido: três erros distintos, três aulas distintas |
| **N4.01, N4.02, N4.05** | 3 | **sobe** | são pré-requisitos dos nós que já subiram; deixar buraco no meio quebra a Oficina |
| **GE / GM / AL / PE** (o que existe) | 9 | **fica legado** | reconhecimento de forma e leitura de gráfico: erro é perceptivo, não conceitual |
| **PE.01** | 1 | fica legado | idem |

**16 sobem. 24 ficam.** É esse o tamanho real da migração — não 40.

### O que os 24 legados ainda precisam

Ficar legado não é ficar largado. Todo nó, legado ou não, precisa passar em:

1. **Sonda de layout** (`npm run sonda`) — nada vazando, colidindo, invisível ou
   coberto, em oito sementes de sorteio
2. **Áudio completo** — toda pergunta falada, porque a criança de 4 anos não lê
3. **Alvo de toque ≥ 44px** e `reduced-motion` respeitado

Isso é manutenção barata, feita em lote. Não é reconstrução.

---

## 3. A ordem, e o porquê de cada passo

### Bloco 1 — Fechar o N4 (4 nós) · *em andamento*

`N4.09` ✅ implementado (F68, modelo de área) — **não ativado**, aguardando o PR
de canário · `N4.10` `N4.11` `N4.12`

Fecham a multiplicação e a divisão, onde a máquina do Padrão Ouro já está
afiada. Reaproveitam `Arranjo`, `TrianguloDeFatos`, `PromocaoDeOrdem` e o
contrato de canário — o custo é conteúdo, não infraestrutura.

**Antes de estimar:** verificar se `pattern` já existe como primitiva. A lição
de N4.06/N4.07 foi que metade da estimativa some quando a primitiva já está lá.

### Bloco 2 — Pagar a dívida de coreografia (6 nós) · *urgente*

`N3.10` `N4.03` `N4.04` `N4.06` `N4.07` + níveis 3–5 de `N4.08`

Seis competências **ensinam sem ter momento de ensino**: a criança olha o
desenho, conta, e a tela não explica nada. Levantado por um adulto, não por um
teste: *"ele olha o desenho, conta, e aí?"*

Isso é dívida do que já foi entregue, e vale mais que qualquer nó novo. Um nó
novo sem aula é um nó a mais na dívida.

### Bloco 3 — O reagrupamento (8 nós) · *o coração do F1*

`N3.01`–`N3.08`

O maior salto pedagógico do app inteiro. Onde a criança trava de verdade, e
onde os seis erros do catálogo (`ESQUECEU_VAI_UM`, `CONCATENOU_DIGITOS`,
`INVERTE_COLUNA`, `ESQUECEU_DESCONTO_DEZENA`, `OFF_BY_ONE`, `CONFUSAO_SINAL`) já
estão nomeados esperando por fichas que os produzam.

Substituição, não estreia: os oito têm gerador legado. **A paridade importa** —
o teste tem de provar que a versão nova cobre tudo o que a antiga cobria antes
de o canário ser ativado.

### Bloco 4 — Valor posicional (5 nós)

`N2.01`–`N2.05` sobem, `N2.06` e `N2.07` estreiam.

Depende do Bloco 3: reagrupar é valor posicional em movimento. Fazer na ordem
inversa obriga a explicar o "vai um" antes de a criança saber o que é uma dezena.

### Bloco 5 — Primitivas novas (Andar 7)

`money` `measure` `picto` `area-model` `frac-shade` + consolidar `singapore-bars`

**Regra fixa, aprendida em N4.06:** verificar se a primitiva já existe antes de
estimar. E toda primitiva nova exige **dois usos previstos** — uma primitiva com
um único cliente é um componente disfarçado de infraestrutura.

### Bloco 6 — As 41 estreias

GE (8), GM (8), N5 (5), N6 (4), N7 (2), AL (5), N2.06–07, PE (3)…

Estreias puras: sem legado, "paridade" não quer dizer nada. Aqui o ritmo é o
mais alto do projeto, porque a máquina inteira já existe.

### Bloco 7 — Dojo completo (Andar 8)

Fluência separada de conceito, trilhas, Prancheta com contrato próprio.

### Faixa paralela — manutenção dos 24 legados

Não é um bloco, é um lote: passar os 24 pela sonda e pelo áudio, em uma
varredura. Fazer junto com qualquer bloco, sem ocupar a fila principal.

---

## 4. Quanto custa, medido e não estimado

O que a sessão de 4–5/ago mostrou:

| Competência | O que veio junto | Custo relativo |
|---|---|---|
| N4.03 (primeira) | `Arranjo`, filtro motor, contrato de canário, paleta de operações | **1,0** |
| N4.04 | nada novo | 0,45 |
| N4.07 | nada novo | 0,4 |
| N4.06 | `TrianguloDeFatos` | 0,6 |
| N4.08 | `PromocaoDeOrdem` + 4 iterações de desenho | 0,9 |

**A primeira de cada família paga a infraestrutura; as irmãs pagam só o
conteúdo.** Cinco competências completas numa sessão, e as que custaram caro
foram as que trouxeram primitiva nova.

Consequência para o roteiro: **agrupar por primitiva compartilhada**, nunca pela
ordem numérica do grafo. Os oito nós do reagrupamento compartilham
`InteractiveVertical` e `MaterialDourado` — vão em lote, e o segundo em diante
sai por menos de metade do primeiro.

---

## 4-bis. Aberto neste momento (5/ago/2026, fim da sessão)

Registrado aqui porque a memória da conversa não sobrevive e o repositório sim.

| Aberto | Estado |
|---|---|
| **N4.09** | implementado, testado, sonda verde — **não ativado**. A entrada em `COMPOSER_CANARIES` é o próximo PR |
| **Nível 4 de N4.09** | quatro regiões + conta armada na mesma tela é o ponto mais carregado da ficha. Pergunta em aberto com o autor: aliviar movendo o algoritmo para o nível 5 mudaria a escada da F68, então não se mexe sem decisão dele |
| **Falha intermitente** | uma execução da suíte falhou uma vez; não reproduzida em 7 seguidas e o nome do teste não foi capturado. **Não resolvida** — anotada para não virar "passou" por esquecimento |
| **Dívida de coreografia** | N3.10, N4.03, N4.04, N4.06, N4.07 e os níveis 3–5 de N4.08 ensinam sem momento de ensino |
| **Primitivas inexistentes** | `TouchCount` (bloqueia N1.02 e N1.04), `Moedas` (GM.03), `Regua` (GM.05) |
| **27 divergentes** | competências cuja tela não é a que a ficha descreve. Lista sempre atual em `npm run fichas:conferir` |

**Nenhum número deste documento deve ser confiado de memória.** Os comandos que
recalculam tudo: `npm run fichas:conferir` (conformidade) e `npm run sonda`
(layout).

## 4-ter. A revisão que passou a bloquear N4.09

Levantado em 5/ago pela pergunta *"esse recurso pedagógico é ensinado antes de
forma mais simples?"*. A resposta é não, e isso muda o roteiro.

**O achado:** `ArrayGrid` aparece em N3.06, N4.02, N4.03, N4.04 e N4.07 sempre
como grade **para contar**; em N4.09 aparece como `(modo área)` — medidas nas
bordas, nada para contar. É a única troca de modo do cânone inteiro, e ela não é
ensinada em lugar nenhum.

**O que isso implica:**

1. **N4.09 não pode ser ativado como está.** Não por defeito de código — o código
   passa em tudo — mas porque estreia um idioma visual sem alfabeto.
2. **A F68 precisa de um degrau anterior**: o modelo de área apresentado com um
   fato que a criança já sabe de cor (`10 × 2`), só para aprender a ler o
   desenho. Conteúdo velho, desenho novo — nunca os dois de uma vez.
3. **A mesma pergunta vale para as 27 divergentes e para as 41 estreias.** Toda
   primitiva que estreia precisa de uma competência de alfabetização visual.

**O mecanismo a construir:** `npm run fichas:conferir` verifica hoje QUAL
primitiva a ficha pede. Falta verificar se essa primitiva (e o modo dela) já
apareceu na cadeia de pré-requisitos. É a mesma auditoria, uma camada mais
fundo, e teria pego este caso sozinha.

## 5. As três coisas que este roteiro assume — e que podem estar erradas

1. **Que o legado do N1 é bom o bastante.** Assumido depois de ver as telas, não
   depois de ver uma criança usar. Se a criança de 4 anos travar em N1, a
   decisão muda.
2. **Que 8 sementes de sorteio cobrem a variedade.** Elas pegaram um vazamento
   que 3 sementes não pegavam. Não provam que não há um nono caso.
3. **Que a ordem pedagógica manda mais que a ordem numérica.** Reagrupamento
   antes de geometria porque é onde a criança trava — não porque N3 vem antes
   de GE.

---

## 6. O que já está protegido por mecanismo

Cada defeito desta sessão virou uma trava, não uma anotação:

| Defeito | Trava |
|---|---|
| Texto prometendo mais que o desenho | contagem de "vira" no teste do procedimento (§6.27) |
| Peça vazando e imprimindo o rótulo por cima | `placasDoCubao()` medida em aritmética (§6.28) |
| Sapinho tapando o número da pergunta | faixa própria acima da reta (§6.29) |
| Token de cor usado como classe | 4ª medida da sonda: contraste (§6.30) |
| Material estourando a largura | sonda com 8 sementes (§6.31) |
| Tela desenhada duas vezes | `palcoUnico.test.ts` lendo os dois arquivos (§6.32) |
| Sonda medindo o build antigo | `detached` + kill do grupo de processos |

**O princípio, de novo:** se um passo precisa ser lembrado, ele precisa de
mecanismo. Um documento que pede atenção não é mecanismo.
