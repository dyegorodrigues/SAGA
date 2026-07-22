# 🎓 CURRÍCULO-MESTRE — a hierarquia completa: Matéria → Módulo → Trilha → Habilidade

*O documento que cruza O PLANO (catálogo) com O APP REAL (código): toda matéria, todo
módulo, toda trilha, com STATUS honesto e o DELTA (o que falta pra chegar no catálogo).
É a "ementa da faculdade" gamificada que o Zeus pediu. Detalhe de cada exercício
("o que aparece na tela"): `catalogo-atividades.md`. Anatomia: `arquitetura-pedagogica.md`.*

**Hierarquia oficial:** MATÉRIA (📐📖🇺🇸🔬🧩) → MÓDULO (unidade curricular, agrupa
trilhas irmãs) → TRILHA (o card que a criança toca) → NÍVEL 1-5 (uma habilidade por
nível — nunca "a mesma coisa 5×", régua anti-exaustão).

**Status:** ✅ no ar completo · 🟡 no ar, mas aquém do catálogo (delta anotado) ·
🔧 no ar, precisa reorganizar · 🔮 planejado, não construído

---

# 🧭 O MODELO DE PROGRESSÃO (a decisão de engenharia pedagógica — 13ª rodada)

**A percepção do Zeus (correta):** GraphoGame/Duolingo NÃO trancam por idade. Começam
no "nível zero conceitual" e o algoritmo adaptativo descobre onde a criança está e a
leva adiante. A idade é uma DICA de entrada, não um muro.

**A nossa síntese (o que já temos + o que ativar na Fase C):**
1. **A idade vira só o ponto de PARTIDA sugerido**, não uma lista separada. Hoje
   `tracksForGrade` divide pré/ano1 como paredes — vira um único CONTINUUM; a idade
   escolhe o nó de entrada, não o teto.
2. **O algoritmo já é adaptativo POR TRILHA** (ZDP: 3 acertos sobe, 2 erros desce;
   maxLvl nunca regride; dom 👑 = maestria). Falta operar no NÍVEL DO GRAFO: sugerir a
   PRÓXIMA trilha e destravar por pré-requisito (Fase C).
3. **Destravar por LIMIAR, não por perfeição** (a dúvida do Zeus, respondida): exigir
   100% (todas as estrelas) pra avançar DESMOTIVA e é pedagogicamente errado. A trilha
   seguinte abre quando as alicerces chegam a um limiar (ex.: nível ≥2), e a Revisão
   Esperta 🧠 mantém o antigo vivo. **Maestria absoluta 👑 = prestígio/troféu, NÃO
   portão.** (É o modelo "crown levels" do Duolingo + mastery learning de Bloom.)
4. **Caminho sugerido + escolha manual** (os dois): o motor recomenda o próximo nó
   (já temos a "Jornada Mágica"); o seletor 🎯 deixa pai/criança escolher à mão.
5. **Sem retroceder de nível conquistado** (maxLvl), mas com revisão que ressurge.

**Os 5 níveis ganham SIGNIFICADO fixo** (adotado do dossiê externo — dá consistência à
régua anti-exaustão): **N1 Reconhecer · N2 Conectar · N3 Executar com apoio · N4 Variar
· N5 Transferir** (usar sem suporte). Toda trilha nova segue essa maturação.

**Princípio novo — DESPERTAR FASCÍNIO** (não só ensinar): a criança aprende mais
encantada. Missões que provocam "uau" (viajar a Saturno, por que o céu é azul) valem
mais que drills. Entra na bíblia como 8º princípio pedagógico.

**Funções executivas explícitas:** atenção, memória de trabalho, inibição,
flexibilidade — treinadas EMBUTIDAS nas missões (não como "app de treino chato"). O
Detetive Lógico 🕵️ é a semente; ficam mapeadas como alvo transversal.

---

# 🔭 DOSSIÊ EXTERNO ANALISADO (ChatGPT — o que adotamos e o que recusamos)

*Um estudo externo propôs reorganizar o app como "mapa adaptativo de competências"
(Domínio→Via→Trilha→Nível→Missão→Cena→Exercício), 8-10 domínios, home como mapa,
rebrand "Matemágica Atlas". Análise honesta — o bom entra, o que estoura escopo fica
para depois. Regra: adotar a VISÃO, escalonar a CONSTRUÇÃO.*

| Proposta | Veredito | Porquê |
|---|---|---|
| Competência > idade (idade = porta de entrada) | ✅ JÁ É nossa decisão | convergiu com o modelo acima |
| Senso de quantidade ANTES do número (muito/pouco→contar) | ✅ JÁ É o M0 Meu Mundo | convergência total |
| Tempo & Espaço como domínio próprio | ✅ adotado | vira o M0 (espaço) + M5 (tempo) |
| Áudio em 3 camadas (base reutilizável + TTS + conteúdo crítico) | ✅ JÁ É o plano do Luna | convergência |
| Reconfigurar "vivo/morto" | ✅ JÁ feito (Mundo Vivo) | convergência |
| **Astronomia desde o início** (dentro de "Mundo e Universo") | ✅ ADOTADO | era lacuna que o Zeus sentiu — expandido abaixo |
| 5 níveis semânticos (Reconhecer→Transferir) | ✅ adotado | acima |
| "Despertar fascínio" como princípio | ✅ adotado | acima |
| Kind = "mecânica cognitiva" (função clara) | ✅ JÁ É a Constituição regra 2 | só um bom apelido |
| Posicionamento comercial ("base intelectual dos 4-10", não "app de matemática") | ✅ adotado como norte de marca | ver bíblia |
| "Via" entre Matéria e Trilha | 🟡 = nosso "Módulo" | mesma coisa, mantemos "Módulo" (não renomear à toa) |
| Hierarquia de 7 camadas (Competência→Micro­conceito→Mecânica→…) | ❌ recusado AGORA | over-engineering; 4 camadas (Matéria→Módulo→Trilha→Nível) bastam e já funcionam |
| Grafo de conhecimento (conceito reusado em N missões) | 🔮 v3, não agora | lindo, mas é reescrever o motor que já provamos; `prereqs` já dá 80% |
| Home como MAPA de regiões/planetas | 🔮 fase de design | rebuild de UI grande; a home atual funciona |
| Rebrand "Matemágica Atlas" | ❄️ engavetado | cosmético e prematuro; decidir com o produto maduro |
| Construir 8-10 domínios já | ❌ armadilha de escopo | MVP = 7 pilares que a gente JÁ tem quase todos |

**A verdade que isso revela:** o dossiê pinta a catedral de 5 anos; nós já temos a
fundação e três paredes. Nada nele exige DEMOLIR o que temos — nosso motor agnóstico já
suporta tudo. O risco real dele é escopo: multiplicar frentes por 5 num projeto de um
pai + IA. Por isso: adotamos a visão e os preenchimentos de lacuna (astronomia,
fascínio, funções executivas), e recusamos o rebuild.

---

# 🌍 CONCEITOS VITAIS — "Meu Mundo" (o VERDADEIRO nível zero, antes de toda matéria)

*A lacuna mais importante que o Zeus nomeou: noções de vida que a criança precisa
ANTES de número e letra — e que estavam espalhadas/mal-arquivadas (perto/longe não é
geografia; é conceito vital). É um módulo LEVE, conceitual, transversal — pré-aquece o
cérebro e alimenta a leitura inicial do algoritmo. O "nível zero" do GraphoGame
aplicado ao mundo, não só à leitura.*

### Módulo M0 — Meu Mundo 🌍 (👶 o alicerce de TODOS)
| Trilha | Ensina | Status |
|---|---|---|
| Onde Está? 🧭 (espaço) | dentro/fora, em cima/embaixo, frente/atrás, perto/longe | 🔮 |
| Grande ou Pequeno? 📏 (tamanho/medida intuitiva) | grande/pequeno, alto/baixo, pesado/leve, cheio/vazio, curto/comprido | 🔮 |
| Muito ou Pouco? ⚖️ (quantidade intuitiva) | muito/pouco, mais/menos SEM contar (a ponte pro numeral↔quantidade) | 🔮 |
| Igual ou Diferente? 🔍 (classificação-base) | parear, achar o igual, o diferente (a operação-mãe de toda ciência) | 🔮 |
| Meu Dia ☀️🌙 (tempo vivido) | dia/noite, antes/depois, a rotina em ordem (kind `order`) | 🔮 |

**Por que junto:** são os "opostos e relações" que estruturam o pensamento aos 3-4
anos — a base de espaço (matemática/geografia futura), de medida, de número (muito/pouco
→ contar), de ciência (igual/diferente → classificar) e de tempo (antes/depois →
sequência). Nada aqui é "de uma matéria": é o solo comum. Entra como a PRIMEIRA
experiência do app pro Benjamin.

---

# 📐 MATEMÁTICA

### Módulo M1 — Números & Contagem (👶 o alicerce: numeral ↔ quantidade)
| Trilha | Ensina | Status | Delta p/ catálogo |
|---|---|---|---|
| Contar 🔢 | correspondência 1-a-1, cardinalidade (ESTA é a trilha numeral↔quantidade) | 🟡 | N4 conservação ("juntas vs espalhadas = iguais!") e N5 contar-a-partir-de |
| Olhômetro 👀 | subitizar (ver sem contar) | 🔮 | kind `flash` (mostra 2s→esconde) |
| Moldura de 10 🔟 | âncoras do 5 e do 10 | ✅ | — |
| Amigos dos Números 🤝 | compor/decompor, fazer-10 | ✅ | — |

### Módulo M2 — Operações
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Somar ➕ (pré e ano1) | juntar, termo faltante | ✅ | — |
| Tirar/Subtrair ➖ | tirar, termo faltante | 🟡 | N5 = sentido de COMPARAÇÃO ("quantos a mais?") |
| Probleminhas 🗣️ | história falada → conta | 🟡 | N5 modelo de barras; falta `explain` |

### Módulo M3 — Estrutura do Número
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Vizinho (pré) / Antes-Depois (ano1) | reta numérica mental | ✅ | — |
| Maior ou Menor ⚖️ | comparação, > < = | ✅ | — |
| Contar Pulando 🦘 | skip counting (pré-multiplicação) | ✅ | — |
| Dezenas 🧱 | valor posicional | ✅ | — |

### Módulo M4 — Mundo Matemático
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Formas 🔷 | reconhecer→nomear (Van Hiele) | 🟡 | N5 sólidos (🎲→cubo); falta `explain` |
| Padrões 🎨 | regularidades AB/AAB | 🟡 | falta `explain` |
| Dinheirinho 💰 | **RESEQUENCIADO** (crítica do Zeus): o pré-conceito "100 centavos = 1 real" PRIMEIRO → cédulas inteiras (1, 2, 5, 10 reais — só números redondos) → só MUITO depois centavos/moedas | 🔧 | prereq DURO = Contar até 100 + Dezenas (não dá moeda de 25/50¢ pra quem mal soma — "buga a cabeça"). Fica na matemática (é aplicação de número); fio financeiro = o "porquê" |
| Gráficos 📊 | ler pictograma | 🟡 | falta `explain` |

### Módulo M5 — TEMPO (o relógio é o ÚLTIMO degrau, não o primeiro)
*Espaço/tamanho/rotina saíram daqui → viraram o M0 Conceitos Vitais. Aqui fica só a
escada do TEMPO, e ela é estrita: a criança "não sabe nem ler as horas" justamente
porque o relógio costuma vir cedo demais — aqui ele vem por ÚLTIMO.*
| Trilha | Ensina (a escada N1→N5) | Status | Delta |
|---|---|---|---|
| Senhor do Tempo ⏰ | N1 dia/noite → N2 ontem/hoje/amanhã → N3 dias da semana EM ORDEM (quantos tem) → N4 mês/ano + a hierarquia (seg→min→hora→dia) → **N5 LER O RELÓGIO** (hora cheia/meia) | 🔮 | animação orbital (kind `orbit`); o Relógio 🟡 que já existe vira este N5. **Estações do ano SAÍRAM daqui → Ciências (ciclo da natureza)** |

### Ponte 2º ano (Modo Gênio 🚀): reagrupamento ("vai um") · multiplicação como grupos · frações com pizza · quartos de hora · medidas.

---

# 📖 PORTUGUÊS (Alfabetização — método fônico GraphoGame)

### Módulo P0 — Consciência Fonológica (👶 SEM letras)
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Caça-Rimas 🎵 | sons finais iguais | 🟡 | N3 "qual NÃO rima?", N4 completar versinho, N5 produzir |
| Palminhas 👏 | segmentar sílabas | 🟡 | N4 "qual a 1ª sílaba?", N5 juntar sílabas ditas |

### Módulo P1 — Letras & Sons (o ALFABETO COMPLETO — a lacuna que o Zeus apontou)
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Sons Mágicos 🔤 | vogais → 1ª letra (vogal) → 1ª letra (consoante) → pares surda/sonora | 🟡 | maiúscula↔minúscula (A↔a); cobrir TODAS as 26 letras por som inicial (hoje: vogais + 10 regulares); Traçar com o Dedo ✍️ (motor) |

### Módulo P2 — Sílabas & Palavras
| Trilha | Ensina | Status | Delta |
|---|---|---|---|
| Fábrica de Sílabas 🏭 | fusão CV (cena blend), famílias | 🟡 | N5 do catálogo = CVC (POR, MAR); hoje N5 = completar palavra |
| Fábrica de Palavras 📦 | montar CVCV, ler→figura, ditado montado | 🔮 | trilha inteira |
| Ditado Mágico 🔊 | pares mínimos (BOLA/BOTA) | 🟡 | falta `explain` |

### Módulo P3 — Fluência: LEITOR VELOZ 🚀 (o momento do Heitor — prioridade nº1 do catálogo)
| Trilha | Ensina | Status |
|---|---|---|
| Cola-Sílabas 🧲 | blending acelerando (BO...LA→BOLA) | 🔮 |
| Palavras-Relâmpago ⚡ | 100 palavras mais frequentes automatizadas | 🔮 |
| Leitura em Eco 🎭 | prosódia (ler com emoção) | 🔮 |
| Livrinhos Mágicos 📚 | mini-histórias decodáveis | 🔮 |

### Módulo P4 — As Manhas do Português 🇧🇷 (as armadilhas, uma a uma)
Dança do C (CA/CE) · Os Três R · G e o U escondido · Letras-Espelho (b/d) · Pares
Vibrantes (F/V) · Família do Nariz (ÃO) · Sílabas Travadas — tudo 🔮; a sequência
completa das nuances está no `graphogame-blueprint.md` §3. *(N5 dos Sons Mágicos já
é a porta de entrada dos pares surda/sonora ✅.)*

---

# 🇺🇸 INGLÊS (TPR — ouvir antes de falar, zero tradução)

| Trilha | Status | Delta |
|---|---|---|
| Hello! 👋 · Colors 🌈 · Numbers 🔢 · Animals 🐶 | ✅ (com 🔊 por opção — ouvir até decorar) | — |
| My Family & Food 🍎 | 🔮 | banco + emoji |
| Listen & Touch 🎧 ("Touch your nose!") | 🔮 | TPR físico |
| Word of the Day ⭐ | 🔮 | 1 palavra/dia na revisão 🧠 |

---

# 🔬 CIÊNCIAS — REORGANIZADA (a crítica do "vivo,morto,vivo,morto virou trilha inteira")

**A correção de granularidade:** as 4 trilhas atuais são finas demais para viverem
soltas — viram MÓDULOS de duas trilhas ricas com progressão real:

### Trilha ÚNICA: Mundo Vivo 🌱 (🔧 reorganizar as atuais Vivo/Casas/Origem)
N1 vivo ou não (óbvios) → N2 pega-ratões (sol/rio/nuvem) + "já foi vivo" (tronco) →
N3 o que todo vivo PRECISA (comida/água/ar) → N4 ciclo de vida em cena ORDENÁVEL
(semente→broto→árvore→fruto · ovo→pinto→galinha) → N5 quem mora onde + de onde vem
(o habitat e a origem como consequência de ser vivo).
*As trilhas atuais continuam funcionando até a migração; nada se perde — os bancos
de itens são reaproveitados como níveis.*

### Trilha: Meu Corpo 👂 (🔧 absorve 5 Sentidos)
N1-2 sentidos → N3 partes do corpo → N4 prato saudável → N5 corpo em movimento.
**🧠 fio:** inglês (body), matemática (contar dedos).

### Trilha: O Ciclo da Vida 🐣 (🔮 — o "nascer, crescer, morrer" que o Zeus pediu)
N1 o que nasce/cresce → N2 bebês dos animais (filhote→adulto) → N3 a planta
(semente→broto→árvore→fruto→semente de novo) → N4 as fases da pessoa (bebê→criança→
adolescente→adulto→idoso) → N5 o ciclo se fecha (todo ser vivo nasce, cresce, gera
outro e morre — vida e morte com naturalidade e delicadeza).
**🧠 fio:** história ("Linha do Tempo da Minha Vida" — meu crescimento, as gerações da
família); é o mesmo conceito visto por dois ângulos (ciência = o ciclo universal;
história = a MINHA linha). **📚** conceito-âncora da infância (a pergunta que todo
filho faz); tratado sem susto, como parte natural do mundo vivo.

### Trilha: Estações & Ciclos da Natureza 🍂 (🔮 — VEIO do tempo, é ciência)
As 4 estações, a roupa/natureza de cada uma, o ciclo da água (chuva→rio→nuvem→chuva).
**🧠 fio:** tempo (o ano é um ciclo — mesma ideia de ciclo, matéria diferente).
**Por que aqui e não no tempo:** estação é fenômeno da NATUREZA (por que esfria, por
que a árvore perde folha), não medição de calendário. O ano-como-número fica no tempo;
o porquê-da-estação fica aqui.

### Futuras: Água Mágica 💧 (estados da matéria) 🔮

### Módulo — MUNDO E UNIVERSO 🌎🔭 (astronomia desde o começo — a lacuna que o Zeus sentiu)
*Não é matéria isolada: é o "despertar fascínio" em ação. A astronomia desenvolve
raciocínio espacial, percepção de escala, noção de ciclos e pensamento científico — por
OBSERVAÇÃO, nunca decoreba. Ordem: observar → reconhecer → comparar → curiosidade.*
| Trilha | Ensina | Status |
|---|---|---|
| O Céu 🌤️ | céu, nuvem, sol, lua, estrela (toque no Sol; dia ou noite?) | 🔮 |
| Dia e Noite 🌅 | nascer/pôr do sol, por que existe dia/noite (observar antes de explicar rotação) | 🔮 |
| Nossa Terra 🌍 | o planeta, continentes, oceanos, montanhas, rios; "moramos na Terra" | 🔮 |
| Sistema Solar 🪐 | Sol + 8 planetas (reconhecer → comparar → curiosidades; sem decorar ordem de cara) | 🔮 (tinha seed) |
| A Lua 🌙 | fases, crateras, satélite | 🔮 |
| Movimento 🔄 | Terra gira=dia, translada=ano, estação — **a MESMA animação orbital do Senhor do Tempo** (o fio tempo↔astronomia) | 🔮 |
| Espaço 🚀 | foguete, astronauta, satélite, telescópio, estação espacial | 🔮 |
| Universo ✨ | estrelas, galáxias, cometas, buraco negro — só despertar fascínio | 🔮 |

### Grandes Perguntas 💡❓ (a via da curiosidade — todo "por quê?" da criança)
Por que chove? por que faz frio? por que a Lua muda? por que o céu é azul? por que o
gelo derrete? A criança investiga, levanta hipótese, observa (ciência de verdade, aos 5
anos). **🧠 fio:** atravessa Ciências, Tempo e Mundo Vivo. **Kind:** `story` + observação.

---

# 🧩 LÓGICA
| Trilha | Status | Delta |
|---|---|---|
| Detetive Lógico 🕵️ | 🟡 | N4 sudoku 4×4 real (kind `grid`) |

---

# 🌐 MISSÕES DO MUNDO (multidisciplinar — ilhas onde as matérias se encontram) — tudo 🔮
Mercadinho 🛒 (mat+financeira+leitura) · Cozinha Mágica 👩‍🍳 · Cidade dos Ajudantes 🏙️
(+ A Turma Vota 🗳️) · Pequeno Explorador 🌍 · Linha do Tempo da Minha Vida 📅 ·
Guardiões do Planeta ♻️ · Festas e Lendas 🎉. *Pré-requisito técnico: Fase C (grafo
ativo), pois cada ilha exige trilhas-base dominadas. Detalhe: catálogo §Missões.*

# 🔮 MATÉRIAS FUTURAS (desenhadas, não construídas)
Mundo Digital & IA 💻 (Comande o Mascote = código pré-leitura) · Filosofia 🦉 (P4C,
kind SEM resposta certa) · Música 🎵 · Financeira 💰 como FIO (Cofrinho com Meta).

---

# 🕸️ O GRAFO (quem destrava quem — prereqs; Fase C torna isso visível no app)

```
MAT:  Contar → Olhômetro → Moldura → Amigos → Somar → Tirar → Probleminhas
      Contar → Vizinho → Maior/Menor → Pulando → Dezenas → (2º ano)
      Meu Dia → Senhor do Tempo → Relógio
PORT: Rimas + Palminhas → Sons Mágicos → Fábrica de Sílabas → Fábrica de Palavras
      → Ditado → LEITOR VELOZ (4 trilhas) → Manhas do Português
CIÊN: Mundo Vivo → Água → Sistema Solar     ENG: Hello → Colors/Animals → Numbers → frases
MISSÕES: cada ilha lista as trilhas-base que exige
```

# ⚙️ SISTEMAS TRANSVERSAIS (motor — valem pra toda matéria)
Revisão 🧠 ✅ · ZDP ✅ · Aquecimento ✅ · Desafio Misto 👑 ✅ · Seletor 🎯 ✅ ·
Domínio 👑 ✅ · Economia ⭐🪙 ✅ · **Modo Gênio 🚀 / Alicerce 🧱 🔮 (Fase C)** ·
Modo Relâmpago ⚡ 🔮 · Perfis de Apresentação ♿ 🔮 · Traçar com o Dedo ✍️ 🔮 ·
Voz total (responder falando) 🔮.

---

# 🌾 COLHEITA DE CONTEÚDO NOVO (garimpado do dossiê — o que NÃO estava na nossa lista)

*Itens genuinamente novos que o estudo externo trouxe e a gente não tinha pensado.
É BACKLOG priorizado (não ordem de build — a regra "escalonar a construção" continua).
Nada some; cada um vira trilha quando chegar a vez.*

**🟢 Alto valor + barato + é nível-zero (entram cedo, perto do M0 Meu Mundo):**
- **Consciência Auditiva 👂🔊** (PRÉ-fonológica — vem ANTES das rimas!): alto/baixo,
  forte/fraco, som da natureza × som da cidade, que animal é esse?, que instrumento é?
  É o degrau que faltava antes do Caça-Rimas. Usa só `story` + áudio. Perfeito p/ Benjamin.
- **Conhecimento de Mundo 🌐 (vocabulário)** — a MELHOR sacada do dossiê: nomear o mundo
  (ponte, túnel, farol, ímã, bússola, arco-íris, vulcão, satélite…). Vocabulário →
  compreensão de leitura → tudo melhora. Não tínhamos NADA disso. Kind `story`. Ouro.
- **Emoções 😊😢 (socioemocional)** — reconhecer feliz/triste/bravo/com medo. Vital aos 4,
  ausente. Fio com Meu Corpo. Kind `story`/`plain`.
- **Jogo da Memória 🧠🃏** (função executiva memória) — parear cartas viradas. Kind novo `memory`.
- **Seriação 📊** (ordenar por tamanho: do menor ao maior) — função executiva, pré-medida. Kind `order`.
- **Mistura de Cores 🎨** (arte + ciência): azul+amarelo=verde. Encanta e ensina. Kind `plain`.

**🟡 Enriquecem Ciências (quando o módulo crescer):**
- Grupos de animais (mamífero/ave/peixe/réptil/anfíbio/inseto) — mais rico que "Mundo Vivo".
- Cadeia alimentar (quem come quem) · Materiais e propriedades (madeira/metal/plástico;
  duro/mole) · Luz e sombra · O som (o que faz barulho) · Máquinas simples · Reciclagem (classificar lixo).

**🟡 Enriquecem Medidas/Matemática (M0/M4):**
- Temperatura (quente/morno/frio) — faltava nos opostos do M0.
- Metade/Dobro — intuição de fração antes do símbolo.
- Comprido/curto, largo/estreito — completam os opostos de medida.

**🟡 Domínio Sociedade (novo, leve):**
- Transportes 🚗✈️🚢 · Família (quem é quem) · Regras & Segurança (trânsito, estranho, atravessar).
  Parte já vive nas Missões (Cidade dos Ajudantes); estes são conteúdos-semente.
- **Meu Lugar no Mundo 🌎 (espaço geográfico por ENCAIXE/ZOOM)** — pedido do Zeus.
  NÃO é o "Onde Está" do M0 (esse é perto/longe perceptivo); é escala geográfica:
  casa ⊂ rua ⊂ bairro ⊂ cidade ⊂ estado ⊂ país (Brasil, estados no mapa) ⊂ continente
  ⊂ mundo ⊂ planeta. N5 conecta na astronomia "Mundo e Universo". Mecânica: `order`
  (do menor pro maior) ou kind novo `nest`/`zoom` (a câmera afasta; cada nível contém
  o anterior — ensina o encaixe visualmente).

**💡 PADRÃO "ENCAIXE/ZOOM" = um MOTOR que paga por 6+ trilhas** (candidato Balde 1).
O esquema "tudo mora dentro de algo maior" transfere entre domínios (é o nível
semântico 5 = transferir). Reusa o mesmo motor `nest`/`zoom`:
- Espaço: casa→rua→cidade→país→mundo (Meu Lugar no Mundo).
- Tempo: segundo→minuto→hora→dia→semana→mês→ano (a "escada do tempo").
- Tamanho: formiga<gato<pessoa<casa<prédio<montanha (seriação por grandeza).
- Corpo: célula⊂órgão⊂sistema⊂corpo (Ciências "Meu Corpo").
- Número: unidade⊂dezena⊂centena (reforça valor posicional — já é matemática!).
- Social: eu→família→escola→comunidade (círculos socioemocionais).
- Taxonomia: este cão⊂cães⊂mamíferos⊂animais (classificação de Ciências).

**🔮 Maiores / futuro (não subestimar o custo):**
- **Oralidade** (contar história, descrever, explicar) — produção falada, exige
  reconhecimento de voz; é fase avançada.
- **Vida Prática & Autonomia** (esperar a vez, guardar, cuidar do material — linhagem
  Montessori) — domínio socioemocional inteiro, futuro.
- **Rotação/visualização mental** (qual peça encaixa) — raciocínio espacial avançado.

---

# 📋 RESUMO EXECUTIVO DO DELTA (o que este cruzamento revelou)

1. **Deltas baratos** (subir trilhas 🟡→✅): explains que faltam (formas, padrões,
   dinheiro, gráficos, ditado, probleminhas) · N4-5 do catálogo em Contar, Sub,
   Rimas, Palminhas, Sons (A↔a), Sílabas (CVC).
2. **Reorganizações** 🔧: Ciências (2 trilhas ricas no lugar de 4 finas) · Senhor do
   Tempo absorve Relógio/Calendário.
3. **Construções novas** 🔮 por prioridade do catálogo: **Leitor Veloz** (janela do
   Heitor AGORA) · Olhômetro · Meu Dia/Senhor do Tempo/Onde Está · Fábrica de
   Palavras · Manhas · Missões do Mundo (pós-Fase C).
4. **Motor** 🔮: kinds `flash`, `order` ✅, `orbit`, `grid`, `nest`/`zoom` (cada um com
   2+ usos já mapeados aqui — Constituição regra 2 satisfeita de antemão). O `nest`/`zoom`
   é o de MAIOR alavancagem: 6+ trilhas (geografia, tempo, corpo, número, social, taxonomia).
