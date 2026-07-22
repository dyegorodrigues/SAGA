# 🎓 BLUEPRINT: O PROFESSOR MÁGICO — de "menu de trilhas" para ESCOLA de verdade

*A resposta ao segundo despejo do Zeus (2026-07-18, áudio de 8 min perdido — reconstruído
do que sobrou): "o app está bagunçado, sem coerência com o aprendizado; escola de verdade
não deixa a criança escolher — o professor SABE o que ela tem que treinar; competência
importa mais que idade; o tutor tem que ENSINAR a conta armada; e tudo isso adaptável."
Este doc é a trajetória-mestra dessa virada, escrita ANTES do código (regra da 20ª rodada),
mapeada peça por peça no código REAL — nada aqui exige demolir o que funciona.*

---

## 1. O DIAGNÓSTICO (por que a sensação de bagunça é CORRETA)

O que temos hoje: um **motor adaptativo bom POR TRILHA** (ZDP sobe/desce, banco de revisão
🧠, aquecimento, Desafio Misto, maxLvl/dom) — mas a **EXPERIÊNCIA é um cardápio**: a home
lista ~30 trilhas soltas por matéria e alguém escolhe na mão. Três consequências ruins:
1. **Pula fundamento** (dá pra ir no Subtrair sem nunca ter visto Contar direito);
2. **Paradoxo da escolha** (criança de 5 anos diante de 30 botões = ansiedade ou aleatório);
3. **Ninguém garante o treino chato-e-vital** (cálculo básico DIÁRIO até virar reflexo —
   nenhuma criança escolhe treinar; escola boa IMPÕE com carinho).

A divisão pré/ano1 foi útil no começo, mas é **eixo errado como organização final**: o
eixo certo é DOMÍNIO DE HABILIDADE. (Convergência total: nós já tínhamos decidido isso na
Fase C/prereqs; o dossiê Gemini e o ChatGPT também; agora vira o CENTRO, não um adendo.)

## 2. O QUE O MERCADO JÁ PROVOU (os pontos fortes que vamos fundir)

| Referência | O que ela acerta | O que pegamos |
|---|---|---|
| **Kumon** | fluência por repetição diária curta; avançar SÓ com domínio; começa ABAIXO do nível (confiança) | bloco de fluência diário obrigatório + placement que começa fácil |
| **Math Academy / Khan mastery** | diagnóstico de entrada → grafo de conhecimento → tarefas do dia geradas → revisão espaçada automática | a MATRÍCULA (placement) + a AULA DO DIA composta por algoritmo |
| **IXL (SmartScore)** | pontuação por HABILIDADE, não por idade/série | já temos (maxLvl + dom 👑) — vira o combustível do professor |
| **Duolingo (path)** | UM caminho visível, unidade a unidade, sem menu-buffet | a home manual reorganizada em TRILHO por módulos (M0→M5), com cadeado suave |
| **Synthesis Tutor** | tutor que ENSINA o conceito conversando | nossas Aulinhas 🎬 + roteiros com voz natural (Luna) + 💡 IA pontual |
| O que NINGUÉM faz bem | ensinar a CONTA ARMADA (empréstimo, vai-um) visual e sincronizada | **VerticalMathTutor** (a joia da Fase C) |

## 3. A ARQUITETURA DA ESCOLA (4 peças, todas encaixam no código atual)

### Peça 1 — A MATRÍCULA 🎒 (placement disfarçado de brincadeira)
Primeira vez no perfil (ou botão "recalibrar" no painel dos pais): missão especial
"O [mascote] quer te conhecer!" — 10-14 questões atravessando o grafo em escada
(contar → comparar → somar → tirar → dezenas…), começando FÁCIL pela idade declarada
(idade = só o ponto de partida do teste, nada mais). Adaptativa: acertou rápido → pula
2 degraus; errou → desce 1 e proíbe frustração (para com festa após 2 erros seguidos).
**Saída:** semeia `Progress.lvl/maxLvl` POR TRILHA (fim do "todo mundo começa do 1") .
*Código: gerador especial estilo `mixedChallenge` + escrita nos Progress. Sem UI nova
além de 1 card. Nada de "prova" na cara da criança — é jogo.*

### Peça 2 — A AULA DO DIA 📚 (o professor exigente — o coração da virada)
Um card-herói no topo da home: **"▶️ MINHA AULA"**. A criança toca UM botão; o
**Compositor** monta a playlist do dia (10-12 questões) com a receita pedagógica:
- **2 de aquecimento** (nível−1 da melhor habilidade — dopamina, entrada fácil SEMPRE);
- **2-3 de RESGATE** (banco 🧠 de erros + habilidade "fria": dominada mas não praticada
  há N dias — agenda de esquecimento 2d→4d→8d→16d, Ebbinghaus);
- **4-5 de FRONTEIRA** (a habilidade prioritária = a mais fraca cujos prereqs estão
  dominados — é aqui que o professor "não deixa escolher");
- **1-2 de FLUÊNCIA ⚡** (cálculo básico contra o relógio — o treino Kumon inegociável,
  presente TODO dia, com meta de tempo de reação);
- **1 fecho lúdico** (lógica/padrões — sair sorrindo).
**Oscilação fácil/médio/difícil dentro da aula é a receita, não acaso.** O manual
continua existindo embaixo (autonomia também educa + seletor 🎯 dos pais), mas
reorganizado (Peça 3) e o professor é o caminho-padrão.
*Código: generalização do `mixedChallenge.ts` (já faz 40/30/30!) + `lastPracticed` por
trilha (o `log` diário já existe — falta ler por trilha) + tempo de reação agregado
(o `durationMs` já é medido por questão! falta guardar média por trilha).*

### Peça 3 — COMPETÊNCIA > IDADE 🧭 (o grafo assume; a home manual vira TRILHO)
- `prereqs` (declarados em toda trilha desde a era do conteúdo) **ATIVAM**: trilha com
  fundamento não-dominado aparece acinzentada com cadeado SUAVE ("o professor recomenda
  X primeiro" — pode espiar, não é muro).
- Home manual reorganizada por **MÓDULOS do currículo-mestre em ordem de aprendizagem**
  (M0 Fundamentos → M1 Números → M2 Operações → M3 Estrutura → M4 Mundo → M5 Tempo),
  não mais por matéria×idade. Pré/ano1 vira filtro de PARTIDA, não de teto.
- **Modo Gênio 🚀 pra frente** (dom 👑 destrava conteúdo "de mais velho" sem teto) e
  **downgrade invisível pra trás** (travou 2× na mesma habilidade → a Aula do Dia injeta
  o FUNDAMENTO dela disfarçado, sem letreiro de "voltar nível" — nivelamento sem trauma).

### Peça 4 — O TUTOR QUE ENSINA 🎬 (das aulinhas à conta armada)
- **Aulinhas 🎬** (já construídas na 24ª): automática na 1ª vez, re-oferta após 2 erros,
  imagens trocando com a voz, mãozinha com numerais. **Elas usam OS NÚMEROS da questão**
  (o TutBuilder recebe a questão) — já são "auto-adaptáveis", sem IA em tempo real.
- **Roteiros com voz natural**: quando o Luna destravar (billing), os textos das
  aulinhas/explicações viram banco de áudio gravado — já escrevemos falando "roteirizável".
- **VerticalMathTutor** (a coroa, Fase C): tela dividida — conta ARMADA à esquerda,
  material dourado à direita; a criança TOCA na dezena, ela se espatifa em 10 cubinhos
  E NO MESMO INSTANTE o número risca e ganha o "1" emprestado. O empréstimo/vai-um
  deixa de ser regra decorada e vira coisa VISTA. (2º ano — depois da base redonda.)
- **IA em tempo real NÃO é necessária** para nada disso: o professor é ALGORITMO
  determinístico (barato, offline, previsível); o 💡 Gemini segue como socorro pontual;
  a "IA" cara (voz) é banco PRÉ-gerado. Analytics finos com vários alunos = fase futura.

## 4. ORDEM DE CONSTRUÇÃO (etapas pequenas, sem quebrar nada — cada uma testável)

1. **E1 Telemetria da habilidade** *(fundação invisível)*: `lastPracticed` + tempo médio
   de reação + total dominado, agregados por trilha no Progress. (Barato: dados já fluem.)
2. **E2 O Compositor + card "▶️ MINHA AULA"** *(a virada visível)*: generaliza o Desafio
   Misto com a receita da Peça 2. Desafio Misto 👑 continua como o "extra" diário.
3. **E3 A Matrícula** (placement disfarçado) ao criar perfil + recalibrar no painel.
4. **E4 Grafo ativo + home em TRILHO por módulos** (cadeado suave, Modo Gênio, downgrade
   invisível). *— aqui morre oficialmente a organização por idade.*
5. **E5 Fluência de elite**: Dojo Relâmpago ⚡ como modo próprio + numpad (kind `type`) +
   metas de tempo (Domínio 👑 passa a exigir rapidez, não só acerto).
6. **E6 VerticalMathTutor + Modo Gênio 2º ano** (reagrupamento, multiplicação como
   grupos, frações-pizza) — com trajetória própria pela receita de 6 passos antes.
*(Dinheirinho resequenciado continua na fila como conteúdo, independente das etapas —
pode entrar junto com E1.)*

**Por que nessa ordem:** E1-E2 entregam a SENSAÇÃO de escola em ~2 rodadas usando 80%
de peças prontas; E3-E4 fazem a promessa "competência>idade" virar real; E5-E6 são a
elite. Em nenhum momento o app quebra ou o motor é reescrito (o ELO contínuo continua
RECUSADO — nosso ZDP+dom é o "ELO discreto" que a criança entende).

---

## 5. A METODOLOGIA DAS MICROAULAS (absorvida do dossiê GPT de 2026-07-18 — o "como ensinar")

**Toda aulinha/microaula segue as 6 FASES universais** (nunca inverter a ordem):
1. **Diagnóstico** — descobrir o que já sabe (observa tempo, erro, estratégia), nunca supor;
2. **Exploração concreta** — manipular objetos (blocos, moldura, moedas); ZERO símbolo aqui;
3. **Pictórica** — objetos viram desenho (🍎🍎🍎 → ●●● → 3): a mesma quantidade em 3 roupas;
4. **Abstrata** — o símbolo SÓ quando o significado existe (8+7 nunca antes das maçãs);
5. **Reflexão (metacognição)** — o tutor PERGUNTA ("como você descobriu? tem outro jeito?");
6. **Generalização** — o mesmo conceito mudado de roupa (4+5 → 40+50 → 400+500: padrões!).

**Os 5 NÍVEIS DE AJUDA do tutor** (scaffolding gradual — mapeiam direto no nosso código):
N0 observa (silêncio) → N1 pergunta ("temos certeza?") → N2 dica ("olhe as unidades") →
N3 mostra parcial (destaca um pedaço) → N4 ensina completo (aulinha inteira).
*Hoje já temos N2 (howto), N4 (aulinha/explain) e o 💡 IA; faltam N1 e N3 como degraus
formais — o algoritmo sobe de nível de ajuda conforme os erros se repetem, nunca começa no N4.*

**As PROGRESSÕES por operação** (a escada exata de cada microaula; bate com nosso catálogo):
- **Adição:** juntar → completar 10 → contar a partir do maior → decompor dezenas → algoritmo;
- **Subtração:** retirar → comparar → completar ("de 7 pra 10 faltam?") → diferença → reagrupamento → algoritmo;
- **Multiplicação:** grupos iguais → adição repetida → arrays/retângulos → propriedades → tabuada → algoritmo;
- **Divisão:** distribuir (partição justa) → agrupar → resto → operação inversa → algoritmo.

**Critérios de avanço (domínio de VERDADE, não só acerto):** precisão ~90-95% + 
**transferência** (mesmo conceito em objetos/desenho/número) + **explicação** ("como você
pensou?") + **estabilidade** (segura na revisão espaçada). Falhou um → volta à representação
necessária SEM tratar como erro.

**A dose diária:** 15-20 min ≈ 10-15 exercícios (menos de 10 min não consolida; mais de 30
exaure). Arco emocional: ~3 min aquecimento fácil → ~12 min forja no limite → ~5 min fecho
lúdico. **Espaçamento dinâmico pelo TEMPO DE REAÇÃO:** acertou RÁPIDO → revisa em ~12 dias
(sinapse forte); acertou LENTO (contando nos dedos) → revisa em ~4 dias (frágil). Escada
Leitner: 2→4→7→12→21→45 dias. *(Por isso a E1/telemetria vem primeiro.)*

**Cold start (dias 1-5):** dia 1 = matrícula invisível (Peça 1); dias 2-4 = calibração fina
(acertos rápidos sobem forte, lentidão desce silencioso); dia 5 em diante = regime normal.

## 6. VERTICALMATHTUTOR — a coreografia canônica (espec da E6, exemplo 32−17)

Tela dividida: conta ARMADA à esquerda (sinal à esquerda, linha embaixo, como na escola) ·
material dourado à direita (3 barras de 10 + 2 cubinhos). O tutor é SOCRÁTICO — pergunta
antes de explicar: (1) destaca a coluna das unidades: "temos 2… precisamos tirar 7. Dá?"
→ a CRIANÇA percebe o conflito; (2) "uma dezena vale quanto?"; (3) a criança TOCA na barra
→ animação: a barra se ESPATIFA em 10 cubinhos (não some — TRANSFORMA); (4) **sincronia
sagrada**: no mesmo instante, o 3 é riscado→2 e o 2 vira ¹2 (a criança VÊ que o "1" não
caiu do céu); (5) ela ARRASTA 7 cubinhos fora → sobram 5 → digita 5; (6) tira 1 barra →
sobra 1 → digita 1; (7) fecho: 10+5=15; (8) generalização: "sempre que faltarem unidades,
trocamos uma dezena por 10 unidades". Pré-requisitos NA ESCADA antes desta aula (o alerta
certeiro do Zeus): amigos do número/completar 10 → contar do maior (3+8 = 8…9,10,11) →
dezena como unidade (Dezenas ✔) → SÓ ENTÃO o empréstimo. Camera-follow por coluna, resto
esmaecido (carga cognitiva mínima).

## 7. DOUTRINA DE IA (canonizada — o dossiê confirmou o que já praticamos)

**Durante a lição: ZERO IA generativa.** O professor é um motor DETERMINÍSTICO (tabela
erro→microaula: errou 8+7=13? → não completa 10 → aulinha de completar 10). Latência zero,
offline, custo zero — é o que torna o "grátis pro mundo" possível. **A IA fica no TOPO:**
gerar conteúdo/roteiros EM LOTE (antes, não durante), analisar analytics de madrugada,
relatórios pros pais, e (fase 4) o copiloto de perguntas abertas. **Voz = banco pré-gravado**
(as frases se repetem; Luna gera uma vez, o app toca pra sempre). Gemma local = opcional
futuro, NUNCA dependência. Roadmap de 4 fases do dossiê ≈ nossas etapas E1-E6 (fase 1 =
soma/subtração até 20 PERFEITAS pros filhos — bate com Matemática-Primeiro).

## 8. Miudezas registradas do dossiê (não perder)
- **Cool-off pós-erro:** input já bloqueado no nosso `status`+`answeredRef` ✔; manter ~2s de
  respiro com a explicação antes do Avançar (já é o comportamento com `onEnd`).
- **Anti-spam como dado:** cliques <1s em rajada não devem contar como "fluência" (tratar
  na E5, no Dojo).
- **Acessórios do mascote com "sockets"** (âncoras por tema×estágio): a reclamação é da
  versão AI Studio; nosso app tem outfits — validar no aparelho e, quando os sprites
  chegarem, adotar dicionário de âncoras por estágio. (Frente 3/arte.)
- **UDL:** múltiplas representações SEM rotular a criança por "estilo" — metáfora muda,
  conceito não.

---
*Aguarda leitura do Zeus (agora com §§5-8 absorvendo o dossiê GPT). Aprovado = E1+E2
(+Dinheirinho). E1 (telemetria) JÁ CONSTRUÍDA em 2026-07-18 (rt médio + lastDay por trilha).
Irmãos: `parecer-auditorias-externas.md` (ondas), `curriculo-mestre.md` (o quê),
`arquitetura-pedagogica.md` (anatomia).*
