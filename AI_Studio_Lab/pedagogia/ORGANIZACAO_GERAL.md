# 🗂️ ORGANIZAÇÃO GERAL — O QUE FALTA E EM QUE ORDEM
**Consolidação de tudo que foi levantado + achados novos + próximos passos**

---

# 1. O BUG DO "50+7 NO NÍVEL 1" — encontrei a causa

Você viu no Dojo. Fui atrás e achei uma **inconsistência arquitetural real**: existem **dois caminhos diferentes** para entrar numa academia do Dojo, e eles se comportam de formas diferentes.

`App.tsx`, linhas 709 e 710:

```js
onTrack={(t) => setScreen({ name: "game", kid, track: t.id })}              // ← SEM nível
onTrackLvl={(t, lvl) => setScreen({ name: "game", kid, track: t.id, lvl })} // ← COM nível
```

**Caminho A — tocar no card da academia** (`onTrack`): não passa nível. Consequências:
- usa o `lvl` **guardado no progresso** daquela trilha (que pode ser qualquer um)
- e liga `exactLvl = false`, que faz o jogo **misturar níveis** (aquecimento com `lvl−1`)

**Caminho B — escolher no seletor de níveis** (`onTrackLvl`): passa o nível escolhido, `exactLvl = true`, conteúdo puro daquela faixa.

**Por que você viu 50+7:** ou o progresso guardado da Academia da Adição já estava na faixa 5 (de testes anteriores), ou você entrou pelo card e o rótulo da tela não correspondia ao conteúdo real.

**A correção:** o caminho A deveria abrir o **seletor de faixas**, nunca entrar direto. Ou, se entrar direto, mostrar claramente qual faixa está rodando. Hoje o rótulo e o conteúdo podem divergir — e foi isso que te confundiu.

**Insight mais amplo:** dois caminhos para a mesma ação, com comportamentos diferentes, é uma armadilha que vai gerar mais bugs. **Um caminho só.**

---

# 2. OS OBJETOS E TEMAS — o que falta construir

Você tem razão: hoje é sempre maçã, cachorro e frutinha. Isso cansa e desperdiça a chance de engajar.

## O que existe hoje
Uma lista de emojis solta dentro de `generators.ts` (`animais`, `frutas`, `ONDE_ANIM`), escolhida aleatoriamente **por questão**. Sem tema, sem coerência, sem narrativa.

## O que precisa existir: um REGISTRO DE TEMAS

Um arquivo de dados (não código) onde cada tema declara seus objetos, o vocabulário do áudio e o cenário:

```yaml
tema: espaco
  nome_singular: "planeta"      # o áudio usa isto
  nome_plural: "planetas"
  objetos: [planeta, estrela, foguete, meteoro, satelite, astronauta]
  cenario: fundo_estrelado
  som_acerto: bip_espacial

tema: selva
  nome_singular: "animal"
  nome_plural: "animais"
  objetos: [tigre, leao, lobo, elefante, aguia, macaco, cobra]
  cenario: floresta

tema: herois
  objetos: [capa, escudo, raio, mascara, medalha, robo]

tema: resgate
  objetos: [bombeiro, policial, medico, ambulancia, capacete, mangueira]

tema: esporte
  objetos: [bola_futebol, bola_basquete, trofeu, medalha, chuteira, apito]

tema: dojo
  objetos: [faixa, katana, pergaminho, lanterna, dragao, shuriken]

tema: videogame
  objetos: [controle, moeda, cogumelo, espada, pocao, bau]

tema: ciencias
  objetos: [tubo_ensaio, microscopio, imã, foguete, lupa, atomo]
```

## As três regras que fazem o tema funcionar

**1. O tema é escolhido POR SESSÃO, não por questão.** Trocar de tema a cada item vira caos visual e quebra a narrativa. A criança entra e "hoje é dia de espaço".

**2. O tema fornece o vocabulário do áudio.** Se o tema é selva, a voz diz *"quantos animais?"*, não *"quantos objetos?"*. Isso hoje é hardcoded e é por isso que às vezes a fala não bate com a figura.

**3. O tema é 100% cosmético.** Nunca altera a lógica, a resposta ou a dificuldade. Trocar o tema não pode mudar o que a criança está aprendendo.

## Bônus pedagógico que o tema permite
Alguns temas casam melhor com certos conceitos: **resgate** com divisão (repartir suprimentos entre caminhões), **espaço** com dezenas (planetas em órbita de 10), **esporte** com dados e gráficos (placar do campeonato). A ficha pode **sugerir** temas preferidos, sem obrigar.

---

# 3. O PROBLEMA DE LAYOUT NO TABLET

Você relatou: *"as coisas estão muito grandes, tem que ficar rolando pra cima e pra baixo"*.

**A causa provável (sem ter auditado a fundo):** o app foi desenhado para caber numa tela e cresceu sem um sistema de tamanhos que responda ao dispositivo. Cada componente tem seu próprio tamanho fixo.

**A correção estrutural:** os tamanhos precisam vir dos **tokens** (§10.11 da Bíblia), e os tokens precisam ter **três perfis**: celular pequeno, tablet, tablet grande. Aí um ajuste no dicionário conserta o app inteiro em vez de tela por tela.

**A regra dura que falta:** *a tela do exercício NUNCA rola.* Enunciado, área visual e área de resposta cabem sempre. Se não cabe, o conteúdo diminui — não a tela cresce. Uma criança de 4 anos não descobre que precisa rolar.

Isso é a **Frente 3** da auditoria (visual), e é o que te incomoda todo dia.

---

# 4. OS MOTORES — o mapa que você pediu

Você disse que não sabe quais existem nem quem é o "tutor mestre". Aqui está:

| Motor | Onde | O que faz | Estado |
|---|---|---|---|
| **unlockEngine** | `curriculum/motores/` | decide o que está travado/aberto no mapa, olhando os pré-requisitos | ✅ real, testado |
| **radarEngine** | idem | detecta padrão de erro (2 tags iguais em janela curta) e agenda resgate | ✅ real, testado |
| **dojoEngine** | idem | calcula força de fato (FD) e de procedimento (PD), monta o aquecimento | ✅ real, testado |
| **composer** | idem | **é o "tutor mestre"** — monta a aula do dia com os 5 blocos | ✅ real, testado |
| **progressEngine** | idem | atualiza nível, streak, domínio depois de cada resposta | ✅ real |
| **Composer (ficha)** | `curriculum/Composer.ts` | converte uma ficha em questão concreta | ✅ real |
| **mixedChallenge** | motores/ | monta o Desafio do Mestre (misto) | ✅ real |

**Quem é o tutor mestre:** é o **composer**. Ele é quem, todo dia, olha o progresso da criança, pergunta ao unlockEngine o que está aberto, ao radarEngine o que precisa de resgate, ao dojoEngine o que precisa de treino — e monta a sessão. **O "Sensei" da tela é a cara dele.**

**O que ainda falta nos motores:**
- o **eixo Y no Dojo** (trazer o concreto de volta quando erra) — está no seu documento de proposta, não no código
- a **telemetria fina** que você mencionou (tempo por clique, hesitação) — não existe ainda
- o **cold start** (matrícula) merece auditoria própria: como o sistema decide onde colocar uma criança que nunca usou

---

# 5. AS 12 QUESTÕES — a resposta honesta

Sua intuição está certa em duas frentes, e elas se resolvem diferente.

## Frente A — o tamanho da sessão deve escalar com a idade
`AULA_TOTAL = 12` é fixo. Proposta: **F0: 8 · F1: 12 · F2: 16 · F3+: 20**. Uma criança de 4 anos satura em 5-8 minutos; uma de 9 faz 20 questões sem cansar.

## Frente B — "12 questões bastam para dominar?" — não, e não deveriam
Aqui está a parte importante, e ela já está resolvida no desenho:

**Domínio não acontece numa sessão.** O sistema exige, na ficha, algo como `dominio: { acertos: 3, de: 3, sessoes: 2 }` — ou seja: acertar 3 de 3, **em duas sessões diferentes**. Isso força o espaçamento.

**E a consolidação não é trabalho da Jornada.** A Jornada leva do nível 1 ao 3 (entender). O **Dojo** leva do 3 ao 5 (automatizar), com revisão espaçada por Leitner. Se a Jornada tivesse que consolidar sozinha, aí sim 12 seria pouco — teria que repetir até cansar.

**A regra que protege contra falso domínio:** o `unlockEngine` opens a próxima competência com nível **3**, não 5. Então a criança avança **enquanto ainda consolida** a anterior — em lugares diferentes, ao mesmo tempo.

**O que ainda falta:** o campo `dominio` existe em **algumas** fichas e não em todas. Sem ele, o sistema pode marcar domínio cedo demais. **Isso precisa virar obrigatório no schema.**

---

# 6. O PAINEL ADMIN

Você disse que está bugado, popups não fecham, não dá pra ver as variáveis.

**Por que isso importa mais do que parece:** sem o painel funcionando, **você está cego**. Não consegue auditar exercício, não vê o estado do motor, não testa ficha sem criar conta e jogar. Todo bug vira caça no escuro.

**O que o painel precisa ter, no mínimo:**
- lista das 95 competências, clicável, mostrando: tem ficha? tem gerador? quantos micros? qual primitiva?
- **preview do exercício rodando**, por nível — os 5 níveis lado a lado
- estado do progresso da criança selecionada (todas as variáveis: lvl, maxLvl, mast, streak, força FD/PD)
- log do que o composer decidiu e **por quê** ("escolheu N1.04 porque é fronteira e o radar apontou lacuna em N1.02")
- botão de resetar/forçar nível para testar

Isso é a **Frente 5**, e eu subiria ela de prioridade — porque ela **multiplica** sua capacidade de achar os outros problemas.

---

# 7. A PARTE CINEMATOGRÁFICA DAS FICHAS

Você mencionou e vale registrar como pendência clara: cada ficha precisa detalhar **a sequência temporal completa**, não só o layout.

O que falta especificar em cada ficha:
- **abertura** — como o exercício entra na tela (animação de entrada, o mascote apresenta?)
- **a coreografia** — batida a batida: o que a voz fala, o que se move, e se é junto ou depois
- **o momento do acerto** — o que acontece, quanto tempo dura, e como escala com a idade
- **o momento do erro** — o feedback suave, e como a dica aparece
- **a transição** — como sai um exercício e entra o próximo (sem tela branca, sem susto)
- **o fecho** — a celebração final e o que ela mostra de progresso

Hoje o SPEC tem a estrutura da tela e o fluxo de interação. **Falta o roteiro temporal.** É o que separa "funciona" de "é gostoso de usar".

---

# 8. PRÓXIMOS PASSOS — na ordem que eu faria

## Agora (curto, destrava muito)
| # | O quê | Por quê |
|---|---|---|
| 1 | **Unificar os dois caminhos do Dojo** (`onTrack` sempre abre o seletor) | mata o bug do 50+7 e evita a próxima classe de bug |
| 2 | **Tornar `dominio` obrigatório no schema da ficha** | protege contra falso domínio |
| 3 | **Escalar `AULA_TOTAL` por faixa** (8/12/16/20) | ajusta o tamanho da sessão à idade |

## Em seguida (o que multiplica capacidade)
| # | O quê | Por quê |
|---|---|---|
| 4 | **Frente 5 — consertar o painel Admin** | sem ele você audita no escuro |
| 5 | **Registro de temas** (o arquivo de dados com os 8 temas) | acaba a monotonia de maçã e cachorro |
| 6 | **Frente 3 — visual e responsivo** | a tela do exercício nunca deve rolar |

## Depois (o volume)
| # | O quê |
|---|---|
| 7 | fichas para os 7 geradores que ainda repetem sempre |
| 8 | as fichas do Jardim (JD1-JD5) — o filho de 4 anos ganha treino |
| 9 | roteiro cinematográfico nas fichas existentes |
| 10 | as 40 fichas complementares (C01-C40) |

---

# 9. MINHAS PERCEPÇÕES — coisas que você não perguntou

**A. O maior risco do projeto agora não é técnico, é de foco.** Existe muita infraestrutura boa e pouco conteúdo que chega na criança. Cada rodada nova adiciona mais infraestrutura. **A pergunta a fazer antes de cada tarefa: isso muda o que meu filho vê amanhã?**

**B. Você tem um ativo raro e não está usando.** Você testa com criança real, de idades diferentes, criando contas novas. **Isso é pesquisa de usuário de verdade** — coisa que empresa grande paga caro para ter. Vale anotar as observações num arquivo (`OBSERVACOES_DE_USO.md`): o que a criança fez, onde travou, o que ela falou. Vira o dado mais valioso do projeto.

**C. O sistema de temas resolve mais do que monotonia.** Ele também permite **personalização por criança** — um filho escolhe dinossauros, o outro escolhe espaço. Isso aumenta muito o vínculo, e o custo é o mesmo.

**D. A auditoria em 6 frentes talvez não deva ser feita toda.** Olhando o estado real, as frentes que importam agora são a **5 (admin)** e a **3 (visual)**. As frentes 1 (motores) e 2 (conteúdo) já foram bastante cobertas nas auditorias anteriores. A frente 6 (arquitetura da trilha) só faz sentido quando houver conteúdo suficiente para navegar.

**E. Sobre a "meta-inteligência" que você mencionou:** o composer já é isso — ele orquestra os outros motores. O que falta não é um cérebro novo, é **dar mais dados a ele**: telemetria de tempo, hesitação, padrão de abandono. Antes de construir inteligência nova, alimentar melhor a que existe.
