# Plano do bloco F0 — a análise que vem ANTES de construir

> Este documento existe porque a forma errada de trabalhar já foi tentada:
> construir uma ficha, descobrir o problema na tela, corrigir, construir a
> próxima, descobrir o mesmo problema outra vez. O §6.36 do Padrão Ouro é o
> registro dessa falha — cada tela era conferida contra a **própria** ficha e
> nunca contra a **história da criança**.
>
> Aqui a ordem se inverte. Primeiro o bloco inteiro é lido; depois se constrói.
> O que este documento contém não é intenção, é **restrição**: cada linha abaixo
> ou já virou teste executável, ou está marcada como pendência com dono.

---

## §1 — As arestas abertas, encontradas antes de tocar em qualquer ficha

### §1.1 A porta dos fundos do canário — **7 nós, não 6**

O mecanismo de canário (`composerCanary.ts`) promete uma coisa: uma ficha
autoral só chega à criança se o id estiver em `COMPOSER_CANARIES`, e o rollback
é a retirada do id — sem rebuild, valendo na próxima questão.

A varredura mostrou que **sete nós furavam esse mecanismo**, chamando
`Composer.generate` direto de dentro do gerador legado:

| Nó | Onde | Desde |
|----|------|-------|
| N1.01 | `generators.ts:707` | `2550a2b` (migração de julho) |
| N1.03 | `generators.ts:715` | `2550a2b` |
| N1.04 | `generators.ts:719` | `2550a2b` |
| N1.07 | `generators.ts:787` | `2550a2b` |
| N1.08 | `generators.ts:797` | `16e18f4` |
| AL.01 | `generators.ts:801` | `16e18f4` |
| **N1.10** | **`generatorsF1.ts:18`** | `16e18f4` |

O N1.10 estava num **segundo arquivo** e não aparecia na lista que eu vinha
carregando. É a prova de que a varredura por arquivo não serve: só a varredura
por *mecanismo* encontra o que se esconde.

**Consequência real, não hipotética.** `selectGenerator` classificava esses nós
como `source: "legacy"` enquanto servia conteúdo de ficha. Três efeitos:

1. **O rollback era um no-op.** Tirar `N1.01` de `COMPOSER_CANARIES` não mudava
   nada — a ficha continuava sendo servida pelo "legado".
2. **A proveniência mentia.** A Oficina lê `generatorSource`; ela via `legacy`
   onde havia ficha autoral.
3. **Minha própria mensagem de commit mentiu.** Escrevi "implementada e não
   ativada" no commit do N1.01. Estava errado: a tela nova foi para produção no
   mesmo commit que a escreveu, que é exatamente o que a regra dos PRs separados
   existe para impedir.

**Exceção legítima:** `SandboxModal.tsx:35` chama `Composer.generate` de
propósito — é a pré-visualização administrativa, cujo trabalho é justamente
mostrar a ficha independentemente do canário. Fica declarada no gate.

### §1.2 O que o rollback deve alcançar

Princípio, para não decidir caso a caso: **o alvo de rollback é a última tela
que a produção serviu antes desta mudança.**

- Para os seis nós cuja ficha **não** mudou (N1.03, N1.04, N1.07, N1.08, AL.01,
  N1.10), a produção de hoje já é a ficha. Regularizar = registrar a ficha e
  ativar o canário: **zero mudança de comportamento**, mecanismo honesto.
- Para o **N1.01**, cuja ficha eu reescrevi de `draggroup`/contagem para
  `pareamento`, o alvo de rollback é a ficha **anterior** — congelada em
  arquivo. Cair no gerador de contagem de julho seria pior que o bug: perguntaria
  *"quantos?"* numa competência pré-numérica.

---

## §2 — O bloco F0 inteiro, numa tabela

Extraído das fichas autorais em `AI_Studio_Lab/pedagogia/`, não de memória.

| Nó | Ficha | Primitiva (modo) | Existe? | Regra dura |
|----|-------|------------------|---------|-----------|
| N1.01 | F07 | `DragGroup` (parear) | ✅ (novo `PareamentoStage`) | ⚠️ **nenhum numeral em nenhum nível** |
| N1.02 | F27 | `TouchCount` (rítmico) | ❌ **não existe** | um número por batida |
| N1.03 | JD1 | `EmojiRow` (flash) | ✅ / modo ❌ | ⚠️ `excecaoCPA: perceptual` |
| N1.04 | F01, F03 | `TouchCount`, `EmojiRow`, `ScatteredItems` | ❌ **não existe** | o último número dito É o total |
| N1.05 | F06 | `Grupo ×2` | ✅ | ⚠️ containers do **mesmo tamanho** |
| N1.06 | F05 | `AudioChoice` | ✅ | ⚠️ tela **deliberadamente vazia** |
| N1.07 | JD4 | `AudioChoice` + `NumberLine` | ✅ | — |
| N1.08 | F02, JD2 | `TenFrame`, `EmojiRow` (flash, skin mão) | ✅ / modo ❌ | ⚠️ `perceptual` |
| N1.09 | F04 | `TouchPlace` | ✅ | — |
| N1.10 | JD5 | `TenFrame` + `EmojiRow` (flash duplo) | ✅ / modo ❌ | — |
| N1.11 | F28, JD3 | `TenFrame` (flash) | ✅ / modo ❌ | ⚠️ `perceptual` |
| N1.12 | F19 | `InteractiveNumberLine` | ✅ | ⚠️ contam-se os **saltos**, não as casas |
| AL.01 | F51 | `DragGroup` (caixas/laços) | ✅ / modo ❌ | — |
| AL.02 | F52 | `EmojiRow` (padrão) | ✅ / modo ❌ | — |
| GE.01 | F47 | `ShapeCanvas` (cena) | ✅ / modo ❌ | ⚠️ **um único referente** na cena |
| GE.02 | F48 | `ShapeCanvas` | ✅ | — |
| GM.01 | F49 | `Grupo ×2` | ✅ | ⚠️ bases na **mesma linha horizontal** |
| GM.02 | F50 | `Balanca` + `ShapeCanvas` | ✅ | — |

---

## §3 — As estreias de modo, que é onde o §6.36 morde

Uma primitiva com modo novo **é um desenho novo para a criança**, ainda que o
componente já exista no código. A regra que governa tudo:

> Uma tela introduz no máximo UMA coisa nova. Conteúdo novo → desenho velho.
> Desenho novo → conteúdo que a criança já domina.

Dentro do próprio F0 há quatro escadas de modo:

- `EmojiRow`: **plain** → **flash** (N1.03) → **flash + skin mão** (N1.08/JD2) → **padrão** (AL.02)
- `TenFrame`: **plain** (N1.08/F02) → **flash** (N1.11/JD3)
- `DragGroup`: **parear** (N1.01/F07) → **caixas/laços** (AL.01/F51)
- `ShapeCanvas`: **cena** (GE.01/F47) → **plain** (GE.02/F48)

**Achado que muda a ordem de construção:** o `TenFrame` estreia em modo *plain*
no N1.08 e em modo *flash* no N1.11 — mas o N1.11 tem o N1.08 como pré-requisito
(`N1.11 ← N1.08, N1.10`). A escada existe e está na ordem certa. Já o
`EmojiRow` estreia direto em **flash** no N1.03, que **não tem pré-requisito
nenhum** — a criança encontra o desenho piscando antes de ter visto o desenho
parado. Isso é uma estreia de modo sem alfabetização visual, dentro do primeiro
nó que ela toca.

→ **Pendência P1**, registrada abaixo. Não é bug de código: é decisão
pedagógica sobre a ficha JD1, e a ficha é adaptável.

---

## §4 — As três fichas perceptuais não sobem a escada CPA

N1.03 (JD1), N1.08 (JD2) e N1.11 (JD3) trazem `excecaoCPA: "perceptual"`. Elas
**não têm forma abstrata** — progridem por automaticidade (tempo de flash
caindo), não por abstração. Construí-las com a escada padrão
Concreto→Pictórico→Abstrato as quebraria.

O gate de conformidade precisa **saber disso**, ou vai cobrar delas um nível
abstrato que a ficha proíbe. → **Pendência P2**.

---

## §5 — `TouchCount` bloqueia as duas competências mais fundamentais

`TouchCount` não existe em `src/components/primitives/`. Ele é a primitiva de:

- **N1.02** (F27) — contagem rítmica, um número por batida
- **N1.04** (F01) — cardinalidade: o último número dito É o total

Estes são, literalmente, o começo da matemática. E `N1.02` é pré-requisito de
N1.04, N1.06, N1.07 e N1.09 — metade do bloco N1 depende dele.

**Portanto `TouchCount` é o primeiro código a ser escrito depois de fechar a
porta dos fundos.** Construir qualquer outra coisa antes é construir sobre um
buraco.

---

## §6 — A ordem de construção, e o que cada escolha previne

Agrupada por primitiva, não por numeração: quem constrói `TenFrame` uma vez
constrói os três nós que o usam, e a coerência sai de graça em vez de sair de
revisão.

| # | Passo | Nós | O que esta posição previne |
|---|-------|-----|---------------------------|
| 0 | **Fechar a porta dos fundos** | os 7 | Sem isto, toda ficha que eu escrever vai para produção no mesmo commit, sem rollback. Previne repetir o erro do commit do N1.01. |
| 1 | **`TouchCount`** | N1.02, N1.04 | Desbloqueia metade do bloco. Construído antes, os nós que dependem dele nascem certos; depois, nascem com gambiarra. |
| 2 | **`EmojiRow` — a escada de modos** | N1.03, N1.08(JD2), AL.02 | Resolve a estreia-em-flash (P1) de uma vez para os três, em vez de descobri-la três vezes. |
| 3 | **`TenFrame` — plain e flash** | N1.08, N1.10, N1.11 | A escada plain→flash já está na ordem de pré-requisitos; construir junto garante que o desenho seja **o mesmo** nos dois modos. |
| 4 | **`Grupo ×2`** | N1.05, GM.01 | As duas regras duras são a mesma regra (tamanho igual / base alinhada): comparar quantidade e comparar altura só funcionam se a moldura não der a dica. |
| 5 | **`AudioChoice` (+ `NumberLine`)** | N1.06, N1.07 | A tela vazia do N1.06 é intencional; construída junto com o N1.07 fica claro o que é ausência de cenário e o que é falta de implementação. |
| 6 | **`TouchPlace`, `InteractiveNumberLine`** | N1.09, N1.12 | Ficam por último em N1 porque dependem de contagem já automatizada. |
| 7 | **`DragGroup` (caixas/laços), `ShapeCanvas`, `Balanca`** | AL.01, GE.01, GE.02, GM.02 | Ramos laterais sem dependência do tronco N1; entram depois sem bloquear ninguém. |

**Por que não uma ficha por vez, na ordem do número:** porque `EmojiRow` apareceria
no passo 3, 8 e 14, e nas três vezes eu decidiria de novo o que já tinha decidido —
que é precisamente como as quatro rejeições do modelo de área aconteceram.

---

## §7 — Pendências abertas por esta análise

| id | Pendência | Tipo | Estado |
|----|-----------|------|--------|
| P0 | Porta dos fundos do canário (7 nós) | mecanismo | **fechada neste commit** |
| P1 | `EmojiRow` estreia em modo *flash* no N1.03, que não tem pré-requisito | **não era pedagógica** | **fechada no passo 2** — ver §8 |
| P2 | Gate de conformidade não conhece `excecaoCPA: "perceptual"` | mecanismo | **latente** — o gate não cobra nível abstrato de ninguém hoje, então não morde; morderá quando alguém escrever essa verificação sem a exceção |
| P3 | `TouchCount` inexistente bloqueia N1.02 e N1.04 | código | aberta — é o passo 1 |
| P4 | Falha de teste intermitente vista uma vez, não reproduzida em 7 execuções, nome não capturado | desconhecida | **aberta e sem pista** |

P4 fica escrita porque não foi resolvida. Não reproduzir não é o mesmo que não
existir, e apagar a linha seria transformar ignorância em confiança.


---

## §8 — Como a P1 fechou, e por que a resposta não era a esperada

A pendência foi escrita como **decisão pedagógica sobre a ficha JD1**: o
`EmojiRow` estreando em modo *flash* num nó raiz, e a pergunta era se o cânone
precisava de uma competência nova só para alfabetizar o desenho.

Não precisava. Ao abrir a JD1 inteira — e não só a §5, que é o que eu vinha
lendo — o degrau que faltava já estava escrito nela:

| Seção | O que ela manda | Estava no código? |
|---|---|---|
| §4 Preparação | *"um ponto pisca no centro da área (fixa o olhar)"* | ❌ |
| §4 Contagem regressiva | *"três pulsos suaves: 3… 2… 1, **só visual**"* | ❌ |
| §4 A pergunta | *"400ms de silêncio, depois os botões sobem da base"* | ❌ |
| §4 Acerto | *"os objetos **reaparecem** por 800ms confirmando o que ela viu"* | ❌ |
| §4 Erro suave | *"reaparecem **agrupados no padrão de dado**"* | ❌ |
| §8 Coreografia | `{ fala: "Viu? Eram dois.", mostra: { revelar: 2 } }` | ❌ |

Cada `revelar` **é a fileira parada** — o degrau *plain*. A criança vê o
desenho em repouso três vezes por questão; só nunca **antes** do relance, que é
precisamente o que protege a competência (§2: *"se os objetos ficam na tela, a
criança conta um a um e a competência não é treinada"*).

E a primeira exposição de todas é a **micro-aula do nível 1**, que pisca uma
quantidade de **demonstração**, diz quanto era e mostra parada — sem cobrar
nada. É o *"nível zero que ensina o desenho antes de cobrar a matemática"* do
Padrão Ouro §6.36, escrito pela própria ficha antes de eu chegar.

> **P1 não era decisão pedagógica: era ficha lida pela metade.**

O mecanismo que impede a volta está em `emojiRowProcedure.test.ts`: todo nível
onde um modo de relance **estreia** precisa declarar coreografia com um beat de
`revelar`. Sem ele, a escada perde o primeiro degrau outra vez — e o defeito é
invisível na tela, porque ela continua correta, testada e acessível.

### A lição de método, que é maior que a pendência

Eu tinha lido a §5 (a tabela dos níveis) e pulado a §4 e a §8. É **exatamente**
o mesmo erro que fez o canhão da F27 ficar faltando — registrado na RETOMADA §7
como *"li a ficha pela metade"* — e eu o repeti no passo seguinte, com outra
ficha, sem perceber.

Honrar a ficha é a ficha **inteira**. Quando uma pendência parecer pedir decisão
pedagógica, o primeiro passo é reler todas as nove seções: a resposta costuma
estar numa seção que ninguém abriu.

---

## §9 — P5 e P7 fechadas, e o degrau que faltava no padrão

Três decisões tomadas no mesmo lote, todas nascidas de olhar a tela pronta.

### §9.1 — P5: uma competência, duas fichas, **uma voz só**

`FichaCompetencia` tem um `howto` e um `explain`. Bastava enquanto cada
competência vinha de uma ficha. Não vem:

| Competência | Fichas | O conflito |
|---|---|---|
| **N1.08** | F02 + JD2 | o `explain` da F02 diz *"continue **contando** os de baixo"*; a JD2 §7 **proíbe em negrito** dizer "conte" na tela dela |
| N1.04 | F01 + F03 | — |
| N1.11 | F28 + JD3 | — |
| N1.10 | JD5 + F02 | — |

Sem separar as vozes, a tela da mão herdava a fala da moldura e **ensinava o
erro que a ficha combate**.

**A solução:** a micro declara `fonte` — de que ficha do cânone ela veio — e
pode carregar a própria voz em `params.howto` / `params.explain`. O que fecha a
pendência não é o override (esse já existia, improvisado): é o **portão** em
`conformidadeDeFichas.test.ts` — *micros de fontes diferentes não podem falar
com a mesma boca*. E o levantamento ao lado imprime as competências de duas
fichas que ainda têm uma voz só, para a dívida não envelhecer calada.

### §9.2 — P7: o Jardim do Dojo não existia em código

A JD2 §5 tem **cinco** degraus; a Jornada do N1.08 comporta dois, porque três
dos cinco níveis dela pertencem à F02. Três degraus ficavam sem lugar.

Ao procurar onde eles moravam, a descoberta: **o Jardim do Dojo não existia**.
`fichas/dojo/` tinha só as quatro trilhas Sensei (FD), e mesmo elas como `Track`
solto, sem ficha. As trilhas JD1–JD5 viviam apenas no Markdown — e o `DOJO_SAGA
§7` as chama de *"a camada MAIS importante"* para quem tem 4 anos.

**A solução:** `fichas/dojo/jardim/` nasce com JD1 e JD2 completas, cinco níveis
cada. A Jornada instala a âncora do 5 (níveis 1-2, uma mão); o Jardim automatiza
a decomposição *"uma mão cheia e dois — sete"* até virar reflexo, com os três
degraus de duas mãos. **Nenhum exercício se perde**, e um teste prova que os
cinco níveis geram questão — senão a alegação vira promessa.

O que NÃO foi construído, e por quê: o motor que apresenta o Jardim à criança.
Ele é um pilar autônomo do Dojo e merece o próprio passo, não uma carona no
passo da primitiva. JD3 e JD5 dependem do `TenFrame` e entram no passo 3.

**A diferença que justifica a separação:** a Jornada mede compreensão e o
relógio é silencioso (§5.1-bis); o Jardim mede automaticidade e o relógio **é**
o instrumento. Por isso as trilhas não entram no grafo — entrar faria o
desbloqueio depender de velocidade, que o cânone proíbe.

### §9.3 — O nível 5 do padrão fazia DUAS mudanças de uma vez

A F52 §5 escreve o nível 5 como *"padrão crescente (1 bola, 2 bolas, 3
bolas…)"*. Implementado ao pé da letra, o degrau tem o defeito do §6.36:

| | níveis 1 a 4 | nível 5 (só `CRESCENTE`) |
|---|---|---|
| o objeto | **alterna** | para de alternar |
| a quantidade | uma por casa | **começa a crescer** |

Uma coisa some e outra entra — duas mudanças, e a regra manda no máximo uma. A
criança que passou quatro níveis lendo *"o que muda é o desenho"* chega num
nível onde o desenho parou de mudar.

**A solução:** `CRESCENTE_ALTERNADO` — *1 🐶, 2 🐱, 3 🐶, ?* — mantém a
alternação que ela domina e acrescenta só o crescimento. Duas regras compostas,
que é o que a §2 chama de *"encontrar a regra geral"*. Os dois formatos convivem
no nível 5, sorteados, pelo mesmo recurso que a ficha usa no nível 2 (*"AAB **ou**
ABB"*).

**E o defeito que só o print mostrou:** o banco por *"uma de cada tipo usado"*
(§3) não continha a peça que continua **só o crescimento** e ignora a troca —
`4 🐶` quando a certa é `4 🐱`. Essa é a alternativa mais informativa do nível,
e sem ela a tag `SO_UM_ATRIBUTO` existia no procedimento e nunca chegava à tela.

> **Distrator que não está no banco é diagnóstico que não acontece.**

No crescente o banco passou a ser **diagnóstico**, não inventário: a certa, a
anterior (`COPIA_ULTIMO`, o alvo da ficha) e as duas meias-regras. Quatro peças
— o teto do cânone §9.1 —, e cada uma carrega uma hipótese.

### §9.4 — Pendências que ficam

| id | O que é | Onde |
|----|---------|------|
| P8 | O motor do Jardim do Dojo: as trilhas existem e nada as apresenta | `fichas/dojo/jardim/index.ts` |
| P9 | `AllFichas` mistura `FichaCompetencia` e `Track` — iterar aquilo rebenta com TypeError em vez de reprovar | `fichas/index.ts` |
| P10 | 12 competências trocam de MODO sem aviso (levantamento do `fichas:conferir`); `N3.02` faz `EmojiRow` virar "riscar" vindo de 7 nós | `conformidadeDeFichas.test.ts` |
| P11 | `DragGroup` estreia em DOIS modos (parear/laços) a partir de dois nós-raiz sem pré-requisito entre eles | `N1.01.ts`, `AL.01.ts` |
| P12 | N1.09: a ficha e o grafo discordam de quem é a competência — quatro arestas dependem da leitura do grafo, que ficha nenhuma escreve | `§10.1` |

---

## §10 — As competências que estavam **ativas servindo outra coisa**

O passo 2 fechou a escada do `EmojiRow`. Antes do passo 3 (`TenFrame`), uma
varredura pelo que cada nó **realmente entrega hoje** achou seis competências
ligadas em produção cuja tela não é a da ficha. Não é tela faltando: é tela
errada com o nome da certa, que é pior — o Radar registra domínio de uma
competência que a criança nunca praticou.

| nó | o que a ficha manda | o que o gerador servia | estado |
|----|---------------------|------------------------|--------|
| AL.01 | F51: separar peças em laços | `intruso_math`: "qual é o diferente?" | ✅ reescrita, `06fa24d` |
| N1.06 | F05: ouvir e escolher | `plain` com **"🔊 TRÊS" escrito na tela** | ✅ reescrita, `5e9b112` |
| N1.09 | F04: produzir quantidade | `gVis_Sequence`: "conte a partir do 47" | ✅ este commit |
| GE.01 | F47: onde está? | `plain` com dois emojis | ⏳ |
| GE.02 | F48: que forma é essa? | `plain`: "🔴 ou 🟥?" | ⏳ |
| GM.02 | F50: cabe mais ou menos? | `plain`: "Manhã ou Noite?" | ⏳ |

Duas dessas três já corrigidas repetem o **mesmo achado estrutural**: a
primitiva que a ficha nomeia — `AudioChoice` na F05, `TouchPlace` na F04 —
existia no código, pronta, e **não tinha `case` em lugar nenhum**. Nem no
Composer, nem no renderizador. Primitiva órfã é o defeito mais barato de
procurar e o mais caro de não ver: ela faz o inventário parecer completo.

### §10.1 — N1.09: a divergência que **não** é minha para resolver

Dois documentos do cânone discordam sobre quem é N1.09:

| documento | o que diz |
|---|---|
| `fichas/FICHAS_F0_COMPLETAS.md` | N1.09 = **produzir quantidade** (índice, §1 da F04 e lista de fechamento) |
| `GRAFO_DE_CONHECIMENTO_SAGA.md` | N1.09 = **contagem até 20 e a partir de qualquer número**; "produzir conjunto: me dá N" é micro (d) da **N1.04** |

Segui a **ficha** — é ela que especifica uma tela, é o que a tabela do §2 deste
plano mapeia, e a F04 não caberia na N1.04, cujos cinco degraus já são da F01 e
que ainda recebe a F03.

**O que fica em aberto (P12):** quatro arestas do grafo — `N1.12`, `N2.01`,
`N3.03`, `AL.03` — declaram N1.09 como pré-requisito querendo dizer *"conta até
20 e continua de qualquer número"*. Nenhuma ficha do cânone escreve essa
competência. Nada se perde agora (o legado `gVis_Sequence` segue como alvo de
rollback, e o nó não foi ativado), mas **dar um nó próprio a "contar até 20" é
decisão curricular**, e é do dono do cânone.

### §10.2 — A §4 e a §5 da F04 se contradizem, e a §9 desempata

A §4 diz que o objeto excedente *"não cola"*. A §5 diz que no nível 4 a criança
*"precisa saber parar sozinha"*. Não dá para as duas valerem no mesmo nível: se
a tela para por ela, ela nunca precisa parar.

Quem decide é a §9, ao exigir **um acerto sem vaga fantasma**: num nível onde a
tela trava o excedente, todo mundo acerta — a evidência que ela pede seria
impossível de *não* obter, e o critério de domínio não significaria nada. Logo o
limite físico vale **onde há vaga**, porque a vaga **é** o limite. Some a vaga,
some o limite: é isso que "sem andaime" quer dizer.

> Terceira vez no bloco que a própria ficha responde à dúvida em outra seção
> (P1 na JD1, o degrau do padrão na F52, este). **Ler a ficha inteira continua
> sendo mais barato que decidir.**

### §10.3 — Duas divergências declaradas na F04

| o que a ficha diz | o que fiz | por quê |
|---|---|---|
| §3 lista três elementos, nenhum botão | acrescentei **"Pronto!"**, visível só depois do 1º objeto | sem ele *"parou antes"* (§6) não é observável e a tela dos níveis 4-5 espera para sempre — e a §2 proíbe encerrar por tempo |
| §8 fala *"Preciso de três estrelas"* | falas neutras de número e de tema | o nível 1 sorteia 1 a 3 em três temas: a fala literal estaria errada na maioria das vezes (mesma decisão da F01) |
| §4 descreve **arrasto** (*"o objeto segue o dedo"*, ímã de 70px) | só toque: tocar a bandeja → tocar a vaga, área de 80px | o adendo §8.3-bis prevalece sobre a ficha e nomeia a F04 na lista de exposição motora alta. A vaga responde ao toque em vez de acender na aproximação — sem arrasto não há aproximação |

### §10.4 — P13: a regra extra da §9 não tem onde morar no schema

Três fichas do bloco já trazem, na §9, uma **segunda** condição de domínio além
do `acertos/de/sessoes`:

| ficha | regra extra |
|---|---|
| F01 (N1.04) | pelo menos um acerto no arranjo **disperso** |
| F05 (N1.06) | pelo menos um acerto **na primeira audição** |
| F04 (N1.09) | pelo menos um acerto **sem vaga fantasma** |

Nas três a regra está implementada e testada no procedimento (`dominou`), e nas
três ela **não chega ao motor de maestria**: `FichaDominio` só carrega
`acertos`, `de` e `sessoes`. O efeito é o mesmo nos três casos — a criança pode
receber domínio da competência sem nunca ter feito a única questão que a prova.

Não é defeito de ficha nem de procedimento: é o schema assumindo que domínio é
sempre contagem de acertos. Enquanto não houver campo, a regra é documentação
executável esperando um ponto de ligação.
