# 🧭 O MÉTODO SAGA
## Uma arquitetura de ensino de matemática para crianças de 4 a 12 anos

---

# O PRINCÍPIO

> **Nenhuma ferramenta é descartada. Todas crescem com a criança.**

Esta é a ideia que organiza tudo o mais.

No ensino tradicional, cada etapa da matemática traz representações novas que substituem as anteriores. A criança aprende a contar com bolinhas, e as bolinhas somem. Aprende fração com pizzas, e as pizzas somem. Aprende equação com "passa para o outro lado trocando o sinal" — uma regra que não se apoia em nada que ela já tenha visto.

**O resultado é uma matemática feita de camadas desconectadas.** A criança não constrói entendimento; ela acumula procedimentos que esquece na mesma velocidade em que aprende.

No Método SAGA, as ferramentas são **poucas, e permanentes**:

| Ferramenta | Aos 5 anos | Aos 8 anos | Aos 12 anos |
|---|---|---|---|
| **A reta numérica** | onde fica o 7 | saltos de adição | números negativos |
| **O quadrado de 100** | contar de 10 em 10 | a centena | décimos, centésimos, porcentagem |
| **A balança** | — | igualdade é equilíbrio | equação do 1º grau |
| **A moldura de dez** | ver 7 como 5+2 | amigos do 10 | fazer dez para cruzar a dezena |
| **O arranjo retangular** | contar organizado | multiplicação e comutatividade | área, fatores, distributiva |

Quando a criança encontra números negativos aos 12 anos, ela não recebe uma ferramenta nova. **A reta que ela usa desde os 5 anos simplesmente cresce para a esquerda.** O conceito é novo; o instrumento é velho conhecido.

---

# OS CINCO PILARES

## 1. A ação precede o símbolo

A criança **faz** antes de escrever.

Ela junta dez cubinhos e vê eles se fundirem numa barra — e só depois escreve o "vai um". Ela tira pesos dos dois lados da balança até descobrir quanto pesa o saco — e só depois escreve `x + 3 = 8`.

**O símbolo registra uma experiência que ela já teve.** Não é o contrário.

*Por que importa:* o "vai um" ensinado como regra de escrita é decorado e esquecido. O "vai um" como registro de uma troca que ela fez com as mãos é reconstruível — se esquecer, ela refaz o raciocínio.

## 2. O erro revela a estratégia

Errar não é punido. **Errar mostra o caminho certo.**

Em quase todas as fichas do método, o erro aciona a demonstração da estratégia — não a resposta:

- Na comparação de quantidades, errar **aciona o pareamento**: a criança vê os objetos sendo ligados um a um, e quem sobra fica evidente.
- No problema com história, errar **repete a animação da mudança**: ela vê os quatro dinossauros chegando de novo.
- No fazer-dez, errar **volta ao primeiro passo**: "vamos fechar esta caixa primeiro".
- Na equação, tirar peso de um lado só faz a balança **desequilibrar dramaticamente** — ela sente por que a regra existe.

**A dica nunca entrega a resposta e nunca elogia.** Ela nomeia a estratégia. Isso está codificado como regra testável: nenhuma dica pode coincidir com um erro documentado da própria competência.

## 3. Dois eixos, não uma escada

O ensino tradicional trata dificuldade como uma linha reta: números maiores, contas mais difíceis.

O Método SAGA separa **dois eixos independentes**:

| | **Eixo da abstração** | **Eixo da automaticidade/magnitude** |
|---|---|---|
| Pergunta | *ela entende?* | *o que já compreendido está estável, rápido e recuperável em qual faixa?* |
| Progressão | concreto → pictórico → abstrato → generalização | fatos/procedimentos seguros → faixas progressivas de prática |
| Onde vive | progresso curricular por competência | estado separado do **Dojo** (`dojoTracks`) |

Uma criança pode estar **abstrata com números pequenos** (faz 7+8 de cabeça) e ainda precisar de apoio concreto quando encontra uma estrutura nova com números maiores. Também pode **entender perfeitamente** uma estratégia e ainda não tê-la automatizado. São coisas diferentes, e o sistema mede e move esses eixos separadamente.

*Por que importa:* tratar como escada única faz a velocidade parecer compreensão e mistura aquisição conceitual com treino. No SAGA, o domínio conceitual pode avançar quando a evidência da competência está madura; a automaticidade continua sendo fortalecida no Dojo sem rebaixar nem coroar a compreensão.

## 4. Entender, automatizar e recuperar são funções diferentes

O método separa três funções, e elas não se misturam. Acima delas está o **Sensei/Tutor**, que lê o Learner Model e prescreve o que a criança deve fazer agora. A criança pode explorar e treinar livremente; quando segue o Sensei, **não escolhe a própria sequência curricular**.

**🎓 Jornada (Academia)** — é o **mapa do conhecimento** e a superfície das experiências conceituais. Torna visíveis competências, pré-requisitos, fronteira e conquistas. A proficiência conceitual 1→5 pertence à competência curricular; a Jornada não é uma grade rígida de aulas e não disputa com o Sensei o papel de sequenciador.

**🥋 Dojo** — onde conhecimento **já compreendido** ganha automaticidade. Possui estado próprio de fatos/procedimentos, força, precisão, RT e **10 faixas por templo aritmético**. Não move `lvl`, `maxLvl`, `dom` nem a coroa conceitual. Pode ser **prescrito pelo Sensei** ou acessado **livremente** dentro do repertório pedagogicamente seguro.

**🔧 Oficina** — onde uma base é **recuperada causalmente**. Abre quando o Radar/Learner Model encontra evidência suficiente de uma lacuna, com alvo, dose e critério de saída; não é castigo nem depósito de erros. Uma lacuna de pré-requisito pode transformar a própria missão prescrita do dia em uma Missão de Resgate.

*Por que importa:* separar aquisição, automaticidade e recuperação impede que a aula conceitual vire repetição exaustiva e impede que velocidade seja usada como atalho de mastery. A próxima competência abre pela política de pré-requisitos/evidência do grafo — hoje, `maxLvl ≥ 3` ou `dom` nos pré-requisitos — enquanto a fluência amadurece em paralelo no Dojo.

## 5. O diagnóstico é por concepção, não por acerto

Quando a criança erra, o sistema não registra "errou". Registra **o que ela pensou**.

Cada opção errada é um erro documentado, com uma etiqueta. **O currículo tem 251 dessas etiquetas.** Alguns exemplos:

| Etiqueta | O que significa |
|---|---|
| `NAO_TEM_CARDINALIDADE` | contou certo, mas não sabe que o último número é a quantidade |
| `CONSERVACAO_ESPACO` | julgou quantidade pelo espaço ocupado |
| `SUBTRAI_INVERTIDO` | fez 7−2 quando era 2−7, para evitar o impasse |
| `SOMA_DENOMINADOR` | 1/4 + 2/4 = 3/8 |
| `IGUAL_E_RESULTADO` | lê `=` como "aqui vem a resposta" |
| `MULTIPLICAR_AUMENTA` | não aceita que 1/2 × 8 seja menor que 8 |

*Por que importa:* saber que a criança errou não diz nada. Saber **como** ela errou diz tudo — e permite que o sistema ofereça exatamente a intervenção que aquela confusão específica exige.

---

# A ARQUITETURA

## O Sensei orquestra; o grafo governa a dependência

A rota principal é o **Sensei/Aula do Dia**. Ele consulta o Learner Model, o DAG completo, revisão, evidências, misconceptions, necessidade de Oficina e estado separado de fluência para escolher **uma meta dominante** e a próxima experiência. Depois das evidências produzidas, a decisão é recalculada; não existe fila fixa de aulas por idade.

A **Jornada** traduz esse continuum em mapa navegável. O **Dojo** automatiza repertório já seguro. A **Oficina** reconstrói a causa de uma lacuna. Nenhum desses painéis substitui a autoridade prescritiva do Sensei quando a criança segue a rota principal.

## O grafo, não a série

O currículo não é organizado por ano escolar. É um **grafo de 90 competências** ligadas por pré-requisitos reais.

**A idade nunca decide.** O que decide é: *os pré-requisitos e as evidências estão firmes?*

Isso significa que uma criança de 6 anos que domina os fundamentos avança; e uma de 9 que tem lacuna no valor posicional recebe apoio ali — sem constrangimento, porque ninguém está "atrasado em relação à turma". Não há turma.

O grafo é auditado: zero pré-requisitos inexistentes, zero ciclos, zero inversões de faixa.

## Os nós de convergência

Dez competências exigem **três pré-requisitos** — são os cruzamentos do currículo (adição com reagrupamento, divisão longa, operações com decimais).

São os maiores candidatos a travamento, e por isso têm regras próprias:

- **abertura parcial:** com dois dos três pré-requisitos firmes, o nó abre em modo restrito — a criança conhece o território antes de dominá-lo
- **prioridade de resgate:** a lacuna que bloqueia um cruzamento sobe ao topo da fila
- **nunca três frentes:** o sistema nunca ataca os três pré-requisitos faltantes na mesma sessão
- **rota alternativa visível:** a criança nunca vê só cadeados

## As fichas

Cada competência é descrita por **uma ou mais fichas autorais** com nove seções obrigatórias: identidade, fundamento pedagógico, estrutura da tela, **roteiro cinematográfico**, os cinco níveis, diagnóstico com etiquetas, falas, coreografia e critério de domínio.

O roteiro cinematográfico é o que diferencia: ele especifica **o que acontece, quando, e por quanto tempo**. Exemplo, da ficha de contar tocando:

> *Ao tocar: três coisas simultâneas — o objeto ganha cor (200ms), cresce e volta (scale 1.0→1.3→1.0, 250ms), e o numeral salta acima dele. A voz fala o número no mesmo instante do salto.*

**São 94 fichas autorais cobrindo as 90 competências do grafo.** A contagem de fichas é derivada: pode haver mais de uma ficha para uma competência e fichas especializadas de treino; cobertura 90/90 é o invariante curricular.

## O domínio é multidimensional

Acertar não é dominar. O critério de domínio exige **evidência de compreensão e independência em sessões diferentes** — o que força o espaçamento — e frequentemente uma condição autoral extra:

- contar objetos: pelo menos um acerto com os objetos **espalhados** (contar em fila não prova cardinalidade)
- comparar quantidades: pelo menos um com quantidades **próximas** (acertar 2 vs 8 não prova nada)
- divisão: **dois acertos de cada sentido** (repartir e medir são cognitivamente diferentes)
- counting on: demonstrar a estratégia exigida sem depender de contar tudo desde o início; **tempo de resposta não é critério de domínio conceitual**. RT é telemetria de fluência e pode justificar treino no Dojo, nunca reprovar compreensão.

No runtime atual, a coroa multidimensional depende da janela de compreensão no último nível, independência, evidência autoral quando exigida e confirmação em sessões espaçadas. `fluencyStreak` continua registrado, mas **não participa da decisão da coroa conceitual**.

---

# O QUE MUDA NA PRÁTICA

| | Ensino tradicional | Método SAGA |
|---|---|---|
| Organização | por série e idade | por pré-requisito e evidência |
| Sequenciamento | grade/aula fixa | **Sensei recalcula pelo Learner Model** |
| Progressão | turma inteira junta | cada criança no seu ponto |
| Representações | substituídas a cada etapa | **permanentes, crescem junto** |
| Erro | penalizado, contado | **diagnosticado e usado para ensinar** |
| Dificuldade | uma escada só | **conceito e automaticidade em estados separados** |
| Fluência | repetição na mesma aula | **lugar separado (Dojo)** |
| Símbolo | apresentado primeiro | **registra uma experiência anterior** |
| Domínio | acertou a prova | multidimensional, com evidência e espaçamento |

---

# A FUNDAMENTAÇÃO

O método não inventa pedagogia. Ele **organiza e implementa** princípios já estabelecidos, que raramente aparecem juntos:

**A progressão concreto-pictórico-abstrato** (Bruner) — a base do método de Singapura, aqui aplicada competência por competência, com o nível declarado em cada ficha.

**A cardinalidade como marco cognitivo** (Gelman) — o entendimento de que o último número dito representa a quantidade do conjunto. O método trata isso como competência própria, com critério de domínio específico, em vez de assumir que "contar" é uma coisa só.

**A conservação de quantidade** (Piaget) — a criança pequena julga quantidade pelo espaço ocupado. O método tem uma ficha dedicada a curar essa confusão, e ensina o pareamento como estratégia confiável.

**A subitização** — reconhecer quantidades pequenas sem contar. Tratada como competência separada, com exposição cronometrada (o objeto aparece e some), porque se ele permanecer na tela a criança conta e a competência não é treinada.

**A prática espaçada e o sistema de repetição por intervalos** (Leitner) — implementados na revisão e no Dojo, com força de memória por fato/procedimento e intervalos crescentes.

**A carga cognitiva** (Sweller) — a razão de a fluência importar: quem calcula 7+8 nos dedos pode gastar memória de trabalho que faria falta num problema mais complexo. O Dojo existe para liberar essa memória **depois que a estratégia está compreendida**.

**O modelo de barras** (Singapura) — usado para fração, razão, proporção e problemas, com a regra de que as barras têm sempre o mesmo comprimento total, para permitir comparação direta.

---

# UM EXEMPLO DO MÉTODO INTEIRO

**A criança tem 4 anos e nunca usou o app.**

Ela começa pareando: *"dê um capacete para cada bombeiro"*. Nenhum número aparece — a competência é pré-numérica. Ao final, a pergunta não é "quantos?", é **"sobrou algum?"**.

Depois vem o canhão de balões: cada disparo estoura **um** balão e produz **um** número. Contagem como ritmo motor.

Então o olhômetro: objetos aparecem por 0,8 segundo e somem. Ela precisa **ver** quantos são, sem contar — e a dica jamais pode dizer "conte com calma", porque isso destruiria a competência.

Em seguida, contar tocando: cada objeto que ela toca ganha cor e **anuncia seu número**. Ao final, uma pausa de 800 milissegundos — o silêncio é deliberado — e então: *"quantos foram?"*.

**A criança tem 8 anos.**

Ela encontra a balança: dois pratos, e ela precisa equilibrar. O sinal `=` aparece **exatamente onde está o fiel da balança**. Ela aprende que igualdade é equilíbrio — não "aqui vem a resposta".

**A criança tem 12 anos.**

A mesma balança volta. Agora um dos pratos tem um saco fechado. Para descobrir quanto pesa, ela tira a mesma coisa dos dois lados — e a balança continua equilibrada.

**Ela acabou de resolver uma equação do primeiro grau. Com a ferramenta que usa desde os 8 anos.**

---

# EM NÚMEROS

| | |
|---|---|
| Competências mapeadas | **90** |
| Fichas autorais | **94** |
| Cobertura autoral | **90 de 90 competências** |
| Faixas de desenvolvimento | 5 (dos 4 aos 12 anos; contexto, não catraca curricular) |
| Etiquetas de diagnóstico | **251** |
| Níveis conceituais por competência | 5 |
| Faixas de automaticidade por templo do Dojo | 10 |
| Roteiros cinematográficos | 90 |

**Estado canônico (ago/2026): 90 competências, 94 fichas autorais e cobertura 90/90. O Sensei é o orquestrador prescritivo; Jornada é mapa; Dojo é automaticidade em estado separado; Oficina é recuperação causal; RT informa fluência e nunca coroa compreensão.**

---

*O Método SAGA foi desenvolvido para o aplicativo SAGA, um sistema adaptativo de ensino de matemática em português brasileiro.*
