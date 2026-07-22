# 📖 MANUAL DIDÁTICO DO SAGA — Como Ensinar Cada Conta

**A camada que faltava.** O Grafo diz *o que* ensinar e em que ordem. A Bíblia diz *como o sistema se comporta*. Este Manual diz **como se ENSINA** — a fala do tutor, a primeira explicação, o passo a passo no material, os erros que a criança vai cometer e como resgatá-la. É o "professor no papel": se você tivesse que sentar com seu filho agora e explicar o que é uma divisão do zero, está tudo aqui.

Fundamentação: **CPA de Singapura** (Concreto → Pictórico → Abstrato), **Trajetórias de Clements & Sarama**, **Van Hiele** (geometria), **Teoria da Carga Cognitiva**. Os 8 documentos de didática originais foram absorvidos, expandidos e **costurados ao Grafo** (cada escada vira IDs de competência); quatro didáticas novas foram construídas para fechar as lacunas (Fundação N1/N2, Decimais/Porcentagem, Dados/Probabilidade, Método de Barras). Cada assunto formaliza: a primeira explicação, o nível a nível com a fala do tutor, a simulação dos erros reais da criança (🧒), os distratores canônicos, os microtutoriais e as regras de implementação.

**Sumário:** 🧒 A Criança Real · 🌱 Fundação (N1/N2) · ➕ Adição · ➖ Subtração · ✖️ Multiplicação · 🔢 Divisão · 🍕 Frações · 💰 Decimais/Porcentagem/Proporção · 🌡️ Inteiros · 🧠 Lógica/Padrões/Álgebra · 📐 Geometria · 📏 Medidas · 📊 Dados/Probabilidade · 🎯 Método de Barras · 🔗 Confluências.

---

## COMO ESTE MANUAL SE CONECTA AO RESTO

Havia duas "escadas" que nunca tinham sido reconciliadas — e era isso que fazia parecer bagunçado:

1. **A escada pedagógica (Nível 0→5 CPA)** dos seus documentos: é a jornada *dentro de um assunto*, do concreto físico ao abstrato. Não é a mesma coisa que "dificuldade".
2. **A escada de proficiência (níveis 1→5 / ZDP)** da Bíblia: é *quão bem* a criança domina uma competência específica, medida pelo motor (3 acertos sobe, 2 erros desce).

**Como elas se encaixam:** cada degrau CPA de um assunto vira **uma ou mais competências do Grafo**. Dentro de cada competência, a criança sobe a escada de proficiência 1→5 no seu próprio ritmo. Exemplo com divisão:

| Degrau CPA (didática) | Vira competência(s) no Grafo | Idade |
|---|---|---|
| Nível 0-1: Partição justa + Medida | **N4.05** | 7 |
| Nível 2-3: Inversa da × + lado oculto | **N4.06** | 7-8 |
| Nível 4: Compreensão do resto | **N4.10 (micros a-b)** | 9 |
| Nível 5: Algoritmo longo com blocos | **N4.10 (micros c-e)** | 9-10 |
| (extensão) Divisor de 2 dígitos | **N4.12** | 10 |

Então quando a criança está "na competência N4.10", o app sabe: puxar a escada CPA de divisão, começar pela primeira explicação (abaixo), e se ela errar, subir a escada de remediação. **É essa amarração que estava faltando.**

---

## O CONTRATO DE ENSINO (vale para TODA competência)

Antes de cada assunto, três coisas são sempre definidas. É o gabarito que todo gerador e todo microtutorial preenche:

**1. A PRIMEIRA EXPLICAÇÃO (first-contact).** Como o conceito aparece pela *primeiríssima* vez, quando a criança ainda não sabe nada. Sempre: uma história concreta + uma ação física + o tutor nomeando o que ela acabou de ver (nunca o símbolo antes da vivência). Formalizada aqui para cada assunto no bloco "▶️ Primeira vez".

**2. OS NÍVEIS DE EXPLICAÇÃO (a escada do erro).** Quando a criança erra, o sistema NÃO repete "tente de novo". Ele sobe degraus:
- **E1 · Dica estratégica** (1º erro): uma pergunta que aponta a estratégia do nível. *"Quantos espaços vazios sobraram na moldura?"*
- **E2 · Demonstração** (2º erro): o tutor faz UM exemplo parecido, falando em voz alta o raciocínio, a criança só assiste (worked example).
- **E3 · Fazer junto** (3º erro): o tutor conduz a mão da criança passo a passo no mesmo problema (Ghost Hand / faded example — a criança executa, o tutor sustenta).
- **Nunca trava:** depois de E3, a questão é marcada como "frágil" (vira revisão espaçada e microtutoria do pré-requisito), mas a criança AVANÇA. O bloqueio nunca é punição.

**3. OS MICROTUTORIAIS (worked → faded).** Micro-aula de 20-40 segundos, disparada quando um conceito é novo OU quando E2 é atingido. Estrutura fixa: **Eu faço (I do)** — tutor resolve narrando → **Fazemos juntos (We do)** — criança executa com apoio → **Você faz (You do)** — criança sozinha, mesmo tipo, número trocado. Cada assunto abaixo lista os microtutoriais que precisa.

---
---

# 🧒 A CRIANÇA REAL — as limitações que TODO gerador e TODA tela respeitam

Antes de qualquer assunto: o SAGA não ensina para uma "criança ideal". Ele ensina para uma criança real, com um cérebro em construção. Estas são as restrições de hardware que todos os geradores, tutores e telas obedecem — ignorar qualquer uma delas produz frustração que parece "falta de capacidade" mas é só design errado.

**Memória de trabalho.** Aos 4-5 anos a criança segura ~2-3 informações ao mesmo tempo; aos 6-7, ~3-4; aos 8+, ~4-5. Consequência dura: **nenhuma instrução com mais de 2 passos para F0-F1**. "Pegue as maçãs vermelhas E conte E arraste pro cesto" = 3 comandos = travamento garantido. Uma ação por vez, o tutor guia a próxima.

**Atenção útil.** F0: 4-6 minutos de foco real (sessão de 6-8 questões). F1: 8-12 min. F2: 12-15. F3-F4: 15-20. Passou disso, o rendimento despenca e o erro vira ruído, não sinal — o motor NÃO interpreta erros de fim de sessão longa como lacuna.

**Leitura: ZERO até ~6 anos.** Todo o F0 e boa parte do F1 operam 100% por áudio e imagem (Bíblia §10). A criança de 6-7 em alfabetização lê palavras soltas — o texto aparece, mas o áudio carrega tudo. Só em F2+ o texto vira canal principal (com 🔊 sempre disponível).

**Motor fino.** Dedos de 4 anos erram alvo pequeno. Alvos ≥ 80px, arrastar em distâncias curtas, snap magnético generoso, **nunca** duplo-toque ou gestos compostos. Um toque errado por imprecisão motora NÃO conta como erro pedagógico (o misclick-lock da Bíblia §10 existe pra isso).

**Os marcos piagetianos que mudam o que faz sentido ensinar:**
- **Conservação de quantidade (~5-6):** antes disso, espalhar 5 fichas faz a criança achar que "virou mais". Por isso N1 tem exercícios de conservação explícitos — e por isso comparações visuais em F0 sempre alinham os objetos.
- **Conservação de comprimento (~6-7):** o galho deslocado "parece maior" (GM.01 ataca isso de frente).
- **Reversibilidade (~6-7):** entender que 3+4 desfaz 7−4 é pré-requisito cognitivo real da família de fatos (N3.05) — não adianta apresentar antes.

**Dedos são LEGÍTIMOS.** Contar nos dedos não é vício, é a sub-base 5 do cérebro funcionando. O app nunca proíbe; ele torna os dedos desnecessários construindo estratégias melhores (subitização, amigos do 10, pontes). A fluência chega por sedução, não por proibição.

**Sinais de fadiga/frustração que o motor lê como "parar", não como "não sabe":** tempo de resposta subindo 2×+ na mesma sessão; toques aleatórios rápidos (spam); 2+ pedidos de ajuda seguidos sem tentar. Resposta do app: fechar a sessão com uma vitória fácil e uma celebração — nunca espremer "só mais uma".

---

# 🌱 FUNDAÇÃO — SENSO NUMÉRICO E SISTEMA DECIMAL → N1.01-N1.12, N2.01-N2.05

*Didática construída nesta versão (não havia doc-fonte). É o chão de tudo: o caminho do seu filho de 4 anos, do zero absoluto até entender o que um número É.*

## Por que trava
A escola apresenta o numeral "3" como se o símbolo fosse o número. A criança decora a forma, canta a sequência "1,2,3..." como música — e não sabe que o TRÊS é uma quantidade que mora nos objetos. Sintoma clássico: conta "1,2,3,4,5" apontando certinho e, quando você pergunta "então quantos são?", ela **reconta** — porque não entendeu que a última palavra dita É a resposta (o princípio da cardinalidade). Outra armadilha: contar dois objetos duas vezes ou pular um (falha na correspondência 1-a-1).

## A escada
```
 Nível 5: Milhar, arredondamento, números grandes           → N2.04, N2.05
 Nível 4: Dezena/unidade — o "10" como pacote               → N2.01, N2.02, N2.03
 Nível 3: Parte-todo, amigos do 10, reta numérica           → N1.10, N1.11, N1.12
 Nível 2: Subitização conceitual + contar de qualquer ponto → N1.08, N1.09
 Nível 1: Cardinalidade, numerais, ordem, comparação        → N1.04-N1.07
 Nível 0: Correspondência 1-a-1, canto numérico, olhômetro  → N1.01, N1.02, N1.03
```

## ▶️ Primeira vez (a primeiríssima sessão do app, 4 anos)
Sem número nenhum na tela. Três potinhos, três peixinhos nadando. Tutor: *"Cada peixinho quer o SEU potinho. Um peixinho... um potinho. Pode dar?"* A criança arrasta um peixe pra cada pote. *"Olha! Cada um tem o seu. Nenhum sobrou, nenhum ficou sem."* — isso é correspondência 1-a-1, o átomo da matemática. Números falados só entram depois; numerais escritos, muito depois.

## Nível a nível

### Nível 0 — os três músculos primitivos (N1.01, N1.02, N1.03)
- **Correspondência 1-a-1 (N1.01):** parear objetos (tampa↔pote, peixe↔aquário). Mecânica: arrastar com snap. 🧒 *O que dá errado:* ela dá 2 peixes pro mesmo pote — o pote "cheio" balança e devolve, o tutor: *"Esse já tem! Quem ainda está vazio?"* (E1 embutido na física da cena).
- **Canto numérico (N1.02):** a sequência falada como ritmo — o app canta junto, a criança completa a próxima palavra ("um, dois, ___!"). Sem objetos ainda: é música motora. 🧒 *Erro comum:* pular o "quatro" ou inventar ("um, dois, três, cinco") — o app repete o trecho cantando MAIS devagar, nunca diz "errou".
- **Olhômetro (N1.03):** subitização perceptual — 2 ou 3 bolinhas piscam 1,5s, somem: *"Quantas eram?"* A criança responde tocando na quantidade (opções com bolinhas, não numerais). Treina a retina a VER quantidade sem contar. Params: 1-3 itens, arranjos de dado.

### Nível 1 — o salto da cardinalidade (N1.04-N1.07)
- **N1.04 é a competência mais importante do app inteiro.** Contar objetos E saber que a última palavra é o total. Mecânica-chave: os objetos se **acendem um a um conforme ela toca**, o áudio conta junto, e no final o tutor pergunta *"Então quantos são?"* — se ela recontar, tudo bem; quando responder direto "cinco!", a cardinalidade nasceu. 🧒 *Simulação do erro:* tocar dois no mesmo objeto (o objeto já aceso não conta de novo — feedback físico), pular um (o pulado pisca no final: *"E esse aqui?"*).
- **Comparação (N1.05):** mais/menos/igual SEM contar quando possível (percepção), depois contando para confirmar. 🧒 *Armadilha piagetiana:* 4 objetos espalhados "parecem mais" que 5 juntinhos — o app ensina o gesto de PAREAR (linha com linha) para decidir sem se enganar.
- **Numerais (N1.06):** só AGORA o símbolo entra — e sempre no trio **símbolo ↔ quantidade ↔ nome falado**. Jogo de ligar os três. Traçado do numeral com o dedo (trace kind) para gravar no motor.
- **Ordem/sucessor (N1.07):** "quem vem depois do 6?" na trilha do sapo. 🧒 *Erro:* precisar voltar ao 1 para achar o sucessor — o exercício de N1.09 (contar a partir de qualquer número) cura isso.

### Nível 2 — ver grupos dentro de grupos (N1.08, N1.09)
- **Caixa Mágica (N1.08):** subitização conceitual — 6 aparece como 3+3, 7 como 5+2 (sub-base 5: uma mão cheia + dois). A criança vê a estrutura interna dos números. Este é o berço direto dos amigos dos números.
- **Contar de qualquer ponto (N1.09):** "comece do 7 e conte até 12"; contar pra trás de 10 até 0 (o foguete decolando). Pré-requisito motor do counting-on da adição.

### Nível 3 — a arquitetura parte-todo (N1.10, N1.11, N1.12)
- **Amigos dos Números (N1.10):** todo número até 10 se abre em pares (o 7 se parte em 6+1, 5+2, 4+3 — o laço/number bond visual). **Amigos do 10 (N1.11):** o par que fecha a dezena, treinado até virar reflexo (fechadura mágica: toca o 7, ela precisa do 3). **Reta até 20 (N1.12):** o número vira POSIÇÃO e distância, não só quantidade — o sapo mora na reta agora.

### Nível 4-5 — o segredo do sistema decimal (N2.01-N2.05)
- **A grande ideia: o 10 é um PACOTE.** 10 cubinhos soltos se fundem numa barra (animação metalúrgica — a mesma que depois explica o "vai 1"). O número 23 = 2 barras + 3 cubinhos. 🧒 *O erro que define tudo:* achar que no "23" o 2 vale dois. Exercício-chave: *"quanto vale o 2 AQUI?"* apontando pra dezena. Distrator canônico: 23 = 2+3.
- **Zero como guardador de lugar (N2.02):** 40 tem "nada" nas unidades mas o zero segura a casa. 🧒 *Erro:* escrever "quarenta e dois" como "402" (escrita aditiva) — o quadro posicional com casas físicas impede.
- **Comparação simbólica (N2.03):** o jacaré come o maior — mas SÓ depois da comparação por barras estar sólida; o símbolo é legenda. **Centena/milhar (N2.04, N2.05):** o pacote de pacotes (10 barras fundem num quadrado de 100), e arredondar como "de qual dezena/centena esse número está mais perto?" na reta.

## Microtutoriais
- **"Um pra Cada"** (N1.01): I do — tutor pareia 3 peixes narrando. We do — 4 peixes juntos. You do — 5 sozinha.
- **"A Palavra Mágica"** (N1.04, cardinalidade): I do — tutor conta 4 estrelas e diz *"contei até QUATRO, então SÃO quatro!"*. We/You do na sequência.
- **"A Fábrica de Pacotes"** (N2.01): I do — tutor junta 10 cubinhos, funde na barra, *"dez soltos = um pacote de dez"*. You do — ela fabrica a barra do 14 (1 pacote + 4 soltos).

## Regras de implementação
1. Numerais escritos NUNCA antes da cardinalidade estar em nível ≥ 3 (o gerador de N1.06 checa N1.04).
2. Todo objeto contável é tocável e acende ao toque — contar É tocar, nesta fase.
3. Arranjos de subitização seguem padrões de dado/moldura — nunca nuvens aleatórias (a estrutura é o que treina).
4. Dezenas sempre na MESMA cor quente, unidades na mesma cor fria, em TODOS os kinds do app (a diferenciação neurológica de valor posicional é global, não por exercício).
