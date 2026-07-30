# 📖 A BÍBLIA DO SAGA
**Versão 2.7 · Julho 2026 · Fonte única de verdade do projeto**
> *O número acima acompanha SEMPRE a última entrada do changelog no fim do arquivo. Cabeçalho e changelog divergentes = documento inválido.*

> **Cláusula de supremacia.** Este documento + `GRAFO_DE_CONHECIMENTO_SAGA.md` + `MANUAL_DIDATICO_SAGA.md` + `DOJO_SAGA.md` + `grafo_saga.yaml` substituem TODOS os anteriores: `BIBLE_PEDAGOGICA_UNIFICADA.md`, `MAB_CONSTITUICAO_MESTRE.md`, `MANUAL_PEDAGOGICO_MESTRE.md`, `biblia-do-matemagica.md`, `curriculo-mestre.md`, `mapa-mestre.md`, `grafo_competencias.md`, `catalogo-atividades.md`, os 8 docs de didática soltos (`adicao.md`, `subtracao.md`, `multiplicacao.md`, `divisao.md`, `fracoes.md`, `geometria.md`, `medidas.md`, `logica-e-padroes.md` — absorvidos e costurados ao Grafo pelo Manual) e variantes espalhadas em `AI_Studio_Lab/`. Os antigos viram **arquivo histórico** (mover para `AI_Studio_Lab/arquivo_morto/`), nunca mais fonte. Nenhuma IA cria documento paralelo: se falta algo, **edita-se AQUI**.

---

## §1. IDENTIDADE E ESCOPO

**SAGA** (ex-Matemágica) é uma plataforma educacional adaptativa, áudio-first, para crianças de **4 a 12 anos**, construída por uma pessoa com IAs (Google AI Studio + modelos Anthropic). Matemática é o primeiro cartucho completo; Português, Inglês, Ciências e Mundo já existem como cartuchos e herdam esta arquitetura.

**A frase que define o projeto:** *o SAGA não é um catálogo de aulas; é uma máquina que lê competência, escolhe experiência, gera intervenção e registra domínio.*

**O que o SAGA NÃO é:** não é linear (não existe "trilha da adição" gigante); não é punitivo (errar é dado, não crime); não é um app de leitura disfarçado (criança de 4 anos usa 100% por som e imagem); não é dependente de IA em tempo de aula (geração é determinística e offline; IA entra na *autoria*, não na *execução* — doutrina já vigente no composer).

---

## §2. OS 10 PRINCÍPIOS (a Constituição pedagógica)

1. **Competência pequena, sessão que fecha.** Cada sessão trabalha UMA decisão cognitiva e termina com progresso visível. É a cura estrutural do "um século na adição".
2. **CRA sempre** (Concreto → Representacional → Abstrato), adaptado ao digital: concreto = manipulável interativo com som; representacional = imagem estruturada (moldura, barra, reta); abstrato = símbolos. Nunca pular etapas para "adiantar".
3. **O grafo manda.** Nada é ensinado sem pré-requisitos em pé; nada fica travado se houver outra strand aberta. Idade sugere, proficiência decide.
4. **Compreensão antes de fluência.** O Dojo só automatiza o que já foi entendido (Grafo, Apêndice A).
5. **Errar ensina — e o fluxo é sagrado.** O erro numa questão recebe toque leve e a criança segue (auto-correção → uma dica → mostra e avança, nunca trava); a remediação profunda (demonstração, fazer junto, microtutoria) é disparada por PADRÃO de erro, não por tropeço isolado, e entregue no momento certo — pausa, fim de sessão ou resgate (§8, §11.4). Sem punição, sem sons agressivos, mascote jamais castiga.
6. **Áudio-first.** Toda instrução, opção e feedback existe em voz. Texto acompanha (alfabetização incidental), nunca bloqueia (§10).
7. **Uma tela, uma pergunta, uma ação.** Carga cognitiva mínima: sem placar poluído, sem duas tarefas simultâneas (regra anti-slop, mantida).
8. **Contrato imutável do gerador:** `gen(nível 1-5) → { kind, prompt, ..., options[], answer }`, resposta presente exatamente uma vez, valores dentro das restrições do micro (Grafo). Herdada da Constituição antiga — permanece inviolável.
9. **Determinismo na aula, IA na autoria.** A lição roda offline e barata; a IA preenche contratos (§12), não inventa trilhas.
10. **Um prompt = uma mudança; teste nasce junto; ritual de fechamento** (build ✅ → test ✅ → commit → atualizar estado). Herdado do CLAUDE.md — permanece.

---

## §3. ARQUITETURA: OS 4 MOTORES + A CAMADA NARRATIVA

```
GRAFO DE COMPETÊNCIAS  →  MOTOR PEDAGÓGICO  →  MOTOR DE GERAÇÃO  →  MOTOR ADAPTATIVO
(o que existe e em      (como se ensina:      (fabrica questões,   (lê telemetria, escolhe
 que ordem — o YAML)     CRA, tutoria,         tutoriais e sessões   o próximo passo, agenda
                         feedback, dose)       dentro dos contratos) revisão, destrava nós)
```

**Camada narrativa (a "SAGA"):** por cima dos motores, o mundo do jogo. Mapeamento fixo: **Mundo = strand** (N1, N3, GE… cada um com bioma e cor próprios) · **Ilha = competência** · **Missão = sessão** · **Chefão = checkpoint de domínio (nível 5 + coroa 👑)**. O mapa mostra vários mundos abertos ao mesmo tempo — a criança VÊ que nunca está presa. Mascote, economia dupla (⭐ XP / 🪙 moedas), álbum e evolução permanecem como estão (funcionam e estão documentados no código).

### §3.1 As TRÊS funções (onde a criança está) — e o Motor acima de todas

Os 4 motores acima são a máquina interna. Para a criança e para os pais, a experiência se organiza em **três funções distintas**, e o **Motor Adaptativo fica ACIMA das três, decidindo quando a criança faz cada uma** (ela nunca precisa escolher; o sistema roteia — embora possa escolher treinar por conta própria):

```
                    MOTOR ADAPTATIVO  (decide o que, quando, quanto)
                            │
        ┌───────────────────┼───────────────────┐
     ACADEMIA             DOJO               OFICINA
     (aprender)          (treinar)          (recuperar)
```

- **🎓 ACADEMIA — aprender.** Onde a competência NOVA é ensinada pela primeira vez: trilha, missão do dia, CRA, microtutoria, animação, o "bizu" da conta, o conceito. É o modo Tutor. A criança progride por competência, e dentro de cada uma sobe a proficiência 1→5. Aqui o filho de 6 anos passa por TODAS as etapas para atingir domínio máximo — mesmo as fáceis que ele "já sabe", para consolidar e o sistema medir a proficiência real.
- **🥋 DOJO — treinar.** Onde o que já foi aprendido vira reflexo. NÃO ensina — mede, fortalece, mistura, automatiza, revisa, acelera. Duas famílias (fatos FD + procedimentos PD) e o Jardim do Dojo pré-simbólico. É o coração do uso diário: é onde a criança passa a maior parte do tempo. Spec: `DOJO_SAGA.md`.
- **🔧 OFICINA — recuperar.** Onde uma lacuna REAL é reconstruída, devagar e no concreto. É a "casa" da remediação profunda (Camada 2). **Ela é híbrida (§8.4):** para tropeço pequeno, é um ESTADO invisível — o exercício só fica mais concreto e lento dentro da própria tela, a criança não percebe "lugar" nenhum; para lacuna teimosa, vira um LUGAR visível e positivo — a Missão de Resgate ("o Guardião da Ponte precisa de você!"), uma ilha antiga com recompensa própria, nunca cara de castigo. Sempre visível no painel dos pais, mesmo quando invisível para a criança.

**A navegação tem CINCO abas.** As três funções continuam sendo o modelo mental; a quinta aba é a porta de entrada:
🦊 **Sensei** (a missão do dia — **aba inicial**, o app abre nela) · 🎓 **Jornada** (Academia) · 🥋 **Dojo** (treino) · 🔧 **Oficina** (só acende com resgate aberto) · 👤 **Perfil**.
O Sensei não é uma quarta função: é a **apresentação** do que o Motor Adaptativo montou para hoje. A criança abre o app e vê "sua missão", não um mapa.

**As três funções são também a NAVEGAÇÃO do app.** Nada de lista vertical infinita dentro do perfil: a casca do aplicativo (app shell) tem uma barra fixa embaixo com as funções como abas — 🎓 **Jornada** (Academia, o caminho guiado do dia) · 🥋 **Dojo** (treino livre, revisão e o Desafio Misto) · 🔧 **Oficina** (só acende quando há resgate aberto) · 👤 **Perfil** (mascote, cenários, trocar de criança). O motor de jogo é renderizado *dentro* da aba em que a criança entrou e não sabe em qual está — ele só recebe questões. Assim se acrescenta ou reordena aba sem tocar em pedagogia.
- **Onde foram parar os modos antigos:** a "Jornada Mágica" **é** a Academia (mesmo conceito, nome de tela). O "Desafio Misto" **é** o Dojo no modo Mestre (§2 do `DOJO_SAGA.md`: tudo misturado, mais difícil, cronometrado). Nada se perde — deixam de ser itens soltos numa lista e viram lugares com identidade.

**Por que três e não dois:** separar "treinar" de "recuperar" impede o Dojo de perder o ritmo parando para dar aula a cada erro. O Dojo continua veloz; quem ensina é a Academia (primeira vez) e quem conserta é a Oficina (quando há lacuna). O Motor é quem manda a criança de um para o outro — a criança só sente o jogo fluindo.

---

## §4. HIERARQUIA E NOMENCLATURA

`Domínio → Strand → Competência → Microcompetência → Experiência → Sessão`

- **IDs novos:** `STRAND.NN` e `STRAND.NNx` para micros (`N3.07b`). Esquema completo, tabela de migração dos IDs velhos e as 84 competências: `GRAFO_DE_CONHECIMENTO_SAGA.md`. **IDs antigos (C0001, C_LOG2…) ficam proibidos em código novo** — só aparecem na tabela de migração.
- **Experiência** = um tipo de encontro com a competência: `tutor` (microtutoria), `guiada`, `autonoma`, `dojo`, `revisao`, `historia`, `chefao`. A mesma competência gera experiências diferentes conforme o nível.
- **Track (código)** passa a ser: *a materialização de UMA competência* — nunca mais um saco de 3 competências espremidas em 5 níveis (o defeito do "Contar" atual, corrigido na migração).

---

## §5. A ESCADA DE PROFICIÊNCIA (5 níveis por competência)

Unifica o CRA com o que o `progressEngine` já faz:

| Nível | Nome | Natureza | Quem faz |
|---|---|---|---|
| 1 | Tutoria | Concreto guiado — **Mão Fantasma** (I DO): o app resolve na frente da criança, narrando | O app |
| 2 | Concreto | Manipulável com apoio (WE DO): dicas ativas, dedo-guia disponível | Juntos |
| 3 | Pictórico | Representações estruturadas (moldura, barra, reta), apoio só ao errar | A criança |
| 4 | Abstrato | Símbolos; sem apoio visual por padrão (YOU DO) | A criança |
| 5 | Fluência | Dojo: velocidade sobre precisão já consolidada | A criança, veloz |

**Regras de movimento (mantidas do código, agora canônicas):**
- Sobe: 3 acertos seguidos (streak) — com bônus de velocidade (rt < 3s conta +1 no streak).
- Desce: 2 erros seguidos (nunca no aquecimento). Piso: nível 1.
- `maxLvl` (bolinhas) só sobe com **acerto no nível** — conquista nunca regride.
- **Domínio 👑 (`dom`)**: 3 acertos seguidos no nível 5 **e** `helpClicks = 0` no nível **e** rt dentro da meta da trilha de fluência. (A regra completa da Bíblia antiga, agora obrigatória no código — hoje só o streak é checado.)
- **Desbloqueio de nó do grafo:** todos os pré-reqs com `maxLvl ≥ 3` ou `dom` (igual ao `dominated()` do composer — uma regra só, em um lugar só: o futuro `unlock_engine`).

**O andaime desaparece conforme a criança sobe (regra do fading — evita a aula chata para quem já sabe).** A quantidade de ensino é função inversa da proficiência, e isso está embutido nos próprios níveis: no nível 1-2 há Mão Fantasma e apoio ativo (a criança está aprendendo); no nível 3 o apoio só aparece ao errar; no nível 4 é execução limpa sem apoio; no nível 5 é prática fluida e veloz, sem ensino nenhum — só revisão espaçada de vez em quando para não enferrujar. **Quantos "níveis" tem uma conta? DUAS escadas, não uma (a dúvida clássica).** Não existe uma lista única de 5 ou 7 níveis para "adição". Existem duas escadas que se cruzam:
1. **A escada de COMPETÊNCIAS (os degraus de dificuldade real).** É a sequência de nós do Grafo, do fácil ao difícil. Para adição/subtração, por exemplo: juntar concreto → counting-on → amigos do 10 → ponte do 10 → decomposição mental → 2 dígitos sem reserva → 2 díg com reserva → 3 díg → 4 díg. Cada um é um NÓ separado (N3.01, N3.03, N3.07…), destravado por pré-requisito. É aqui que mora o "do 1+0 até 4 algarismos" — são ~13 degraus de conteúdo, não 5.
2. **A escada de PROFICIÊNCIA (1→5), DENTRO de cada competência.** Em cada degrau de conteúdo, a criança sobe do concreto guiado (1) à fluência veloz (5), pela tabela acima.

**Como isso responde à sua pergunta:** um filho de 7 anos pode estar no degrau "2 dígitos com reserva" em proficiência 3, enquanto o degrau "4 dígitos" ainda está 🔒 travado (pré-requisito não cumprido) — e isso é normal e correto. O sistema SEMPRE sabe em que degrau × que proficiência a criança está, destrava o próximo só quando o atual amadurece, e continua puxando os degraus fáceis já dominados para o aquecimento (§6) — a "ginástica leve" que aquece a mente sem entediar. Um de 4 anos nem chega perto do degrau de 4 dígitos; o grafo o segura pelo pré-requisito, não pela idade. A progressão de procedimento no Dojo (trilhas PD) espelha exatamente esses degraus (Grafo, Apêndice A).
 em NENHUMA tela da criança.
- **O tutor fala o diagnóstico como convite:** *"percebi que os amigos do 10 estão escorregadios — bora afiar eles rapidinho?"* (nomeia a lacuna com carinho e já oferece o caminho).

### 11.7 O que ele NUNCA faz
Não pune, não rebaixa `maxLvl`, não tranca tudo atrás de uma competência, não decide com IA em tempo real (determinismo, §2.9).

### 11.8 Como funciona na prática (a jornada que o esquema produz)

Para ver o esquema vivo — as três funções, as duas escadas e o fading operando juntos ao longo do tempo. Dois personagens: **Téo, 4 anos** (não sabe nada) e **Rocha, 6 anos** (já faz continhas fáceis).

**Téo — dia 1.** Cria o aventureiro (nome, idade, mascote). Uma "expedição do mapa" curtinha, disfarçada de brincadeira, descobre que ele está em F0 puro. O mapa abre com a Ilha das Quantidades 🌱. **Academia:** primeira missão — dar um osso para cada cachorro (N1.01), o Canhão de Balões para contar (N1.02), o Olhômetro piscando (N1.03). Tudo som e imagem, zero leitura, 6 minutos, fecha em festa. **Dojo:** ainda quase não aparece — no nível dele, o Jardim do Dojo traz só o Olhômetro-relâmpago, 2 minutos. Sem Oficina (não há lacuna, ele está aprendendo do zero).

**Téo — semanas depois.** Ele domina contagem e cardinalidade (👑), o grafo destrava os Amigos do 10 e a soma concreta. A Academia agora ensina "juntar" com rosquinhas; o número e o símbolo aparecem JUNTO das rosquinhas (concreto+abstrato sincronizado) e vão desbotando ao longo dos dias até sobrar só `2+1`. O Dojo começa a crescer: trilha FD de amigos do 10, blocos de 3 minutos. Um dia ele erra "qual tem mais" três vezes seguidas por causa da ilusão piagetiana → **Oficina invisível**: os próximos itens ficam lentos e concretos, com o gesto de parear, sem ele perceber que "mudou de lugar". Volta ao fluxo sozinho.

**Rocha — dia 1.** A expedição descobre que ele já conta, já soma até 10, mas conta nos dedos e não sabe os amigos do 10. O mapa abre já adiantado — várias ilhas de F0/F1 saem marcadas 👑 (ele provou que sabe), a fronteira 🔥 fica em "amigos do 10" e "ponte do 10". **Ele NÃO precisa refazer o bebê:** a idade não trava, mas a proficiência também não o obriga a repetir o que dominou. Onde ficou coroa cinza (presumido), a Academia testa de verdade uma vez; se passa, segue. Nos degraus que ele tem frágeis, a Academia ensina e o Dojo treina até virar reflexo.

**Rocha — curto/médio/longo prazo.** *Curto:* a ponte do 10 destrava a soma de 2 dígitos; a Academia ensina a conta armada com o bloco de dezena que explode; o Dojo (trilha PD-A) treina o procedimento até sair liso. *Médio:* multiplicação começa por "grupos de", vira array, vira tabuada; a fluência da tabuada acontece no Dojo (FD4→FD5), não na aula. Ele fica forte em multiplicação e fraco em subtração com troca — o Motor **não trava tudo:** avança na multiplicação e, em paralelo, abre Missão de Resgate 🔧 na subtração. *Longo:* divisão, frações, decimais — sempre o mesmo ciclo (aprende na Academia, automatiza no Dojo, conserta na Oficina), com o degrau de 4 dígitos abrindo só quando os pré-requisitos amadurecem. Aos 4 dígitos ele pode ter 9 anos; Téo, na mesma idade, estará onde a proficiência dele permitir — cada um no seu degrau × proficiência, nunca comparados.

**O aquecimento nunca some.** Todo dia, mesmo o Rocha avançado começa a sessão com um degrau fácil já dominado (§6) — a ginástica leve que aquece a mente e dá a vitória inicial. Fácil demais entedia se for a sessão inteira; fácil no aquecimento acalma e prepara. É pedagogia, não enchimento.

**O que os pais veem, sem precisar operar nada.** O Plano do Dia já vem montado; o painel mostra, por strand, onde cada filho está (Rocha pode estar em F3 de números e F1 de geometria — e isso é dito como normal), os fatos/passos frágeis pelo nome, e as dimensões de domínio (§11.9). O pai acompanha; o app conduz.

### 11.9 O estado de domínio é multidimensional (não é só "acertou")
"Dominou" não é um sim/não. O Motor modela cada microcompetência em dimensões que ele já coleta em cru — só as torna explícitas no painel:
- **Compreensão** (acerta com apoio? entende o porquê?) · **Fluência** (velocidade + precisão — o `rt` e a força do Dojo) · **Retenção** (sobrevive à revisão espaçada dias depois?) · **Independência** (precisa de `helpClicks`?).
A coroa 👑 exige as quatro maduras (é o que a regra de `dom` já pede: streak no nível 5 + helpClicks 0 + rt na meta + sobreviver à revisão). Isso mata o "acertou uma vez = aprendeu": uma criança pode ter compreensão alta e fluência baixa (entende mas é lenta → mais Dojo), ou fluência alta e retenção baixa (rápido hoje, esquece semana que vem → mais revisão espaçada). O painel dos pais mostra as quatro barras por competência.

---

## §12. CONTRATOS DE GERAÇÃO (a IA preenche, não inventa)

### 12.1 Arquivo de competência (`curriculum/NX.NN.yaml`)
```yaml
id: N3.07
nome: Fazer 10 (adição atravessando a dezena)
strand: N3
faixa: F1
prereqs: [N1.11, N1.10, N2.01]
bncc: "1º-2º ano — Números"
micros:
  - id: a
    alvo: "com moldura dupla animada"
    kinds: [tenframe]
    params: { a: [6,9], soma: [11,18] }     # o gerador SÓ sorteia aqui dentro
    dominio: { acertos: 8, de: 10, sessoes: 2 }
  - id: b
    alvo: "com number bond (decompor o b)"
    kinds: [bond]
    params: { a: [6,9], soma: [11,18] }
erros_tipicos:
  - id: para_no_10
    descricao: "soma até 10 e esquece o resto"
    distrator: "10"
    dica: "Você fez o 10! Agora junte o que sobrou."
audio:
  enunciado: "Encha a moldura para fazer 10, depois some o resto!"
tutorial: [ ...TutSteps... ]
```

### 12.2 Contrato do gerador (imutável — §2.8)
`gen(lvl 1-5) → Question` com: `kind` do catálogo §9; params dentro do micro ativo; resposta exatamente 1× nas options; distratores = `erros_tipicos` (aleatório só completa); `howto` + `explain` sempre; `prompt` ≤ 12 palavras faladas (F0-F1); nunca valores negativos antes de N7; função pura ~30 linhas com helpers (`ri`, `pick`, `numOpts`).

### 12.2-bis VOCABULÁRIO: NÍVEL (Jornada) × FAIXA (Dojo) — não confundir

Duas escadas coexistem no sistema e medem coisas diferentes. Usar a mesma palavra para as duas foi fonte real de confusão; ficam nomes distintos:

| | **NÍVEL** — Jornada/Academia | **FAIXA** — Dojo |
|---|---|---|
| Quantos | **1 a 5** | **1 a 10** |
| Mede | **proficiência** — o quanto a criança entende | **dificuldade** — o tamanho do número |
| Eixo | **Y (abstração)**: concreto → pictórico → abstrato | **X (magnitude)**: 2+3 → 27+35 |
| Pergunta | *"ela ENTENDE somar?"* | *"até que número ela dá conta?"* |
| Onde vive | campo `niveis` da ficha | `lvlSkills` da trilha de Dojo |

**São independentes.** Uma criança pode estar no nível 5 de proficiência (entende somar de cabeça) e na faixa 3 do Dojo (só somas até 10). Progredir num eixo não move o outro.

**Divisão de trabalho:** a **Jornada** leva do nível 1 ao 3 (entender); o **Dojo** leva do 3 ao 5 (automatizar). Por isso o Dojo é pilar separado — sem ele, a Jornada teria que repetir até a exaustão.

### 12.3 O nível dita a REPRESENTAÇÃO, não só o tamanho do número
Erro clássico de implementação: tratar `lvl` apenas como "números maiores". Isso destrói o CPA e deixa o fading (§5) sem nada para operar. **O nível muda primeiro COMO o conteúdo aparece, e só depois a magnitude:**

| lvl | Representação (o que muda na tela) | Magnitude |
|---|---|---|
| 1 | Concreto guiado — objetos manipuláveis + Mão Fantasma narrando | mínima |
| 2 | Concreto autônomo — objetos manipuláveis, dica ativa | pequena |
| 3 | Pictórico — representação estruturada (moldura, barra, reta), sem objeto solto | média |
| 4 | Abstrato — só símbolos, sem apoio visual por padrão | cheia |
| 5 | Fluência — abstrato + velocidade (rt no alvo) | cheia |

Todo gerador declara qual `kind`/primitiva usar **por nível** (pode ser a mesma primitiva com props diferentes). Um gerador que devolve o mesmo `kind` nos 5 níveis está errado, salvo justificativa explícita.

**Nem toda competência tem forma abstrata — e forçar uma é pior que não ter.** Competências **perceptuais/fundacionais** (correspondência 1-a-1, subitização, canto numérico) não possuem versão simbólica: nelas os níveis 4-5 significam **automaticidade** (mais itens, mais rápido, sem apoio), não "virar símbolo". Nessas, o gerador declara `excecaoCPA: "perceptual"` com uma linha de justificativa, e a suíte aceita — em vez de exigir uma variação falsa.

**Aviso contra a variação de fachada (armadilha da métrica).** O teste verifica que o `kind` varia; um script pode satisfazer isso mecanicamente e **destruir a pedagogia ao mesmo tempo** — por exemplo, saltar de `count` (concreto) direto para `plain` (abstrato) pulando o degrau pictórico. Isso passa no teste e quebra a escada. **A progressão de cada competência vem da escada CPA daquele assunto no `MANUAL_DIDATICO_SAGA.md`, nunca de uma regra mecânica.** Correção em lote por script é permitida para campos repetitivos (`howto`, `explain`, `audioPrompt`); a escolha de `kind` por nível é decisão pedagógica e passa por revisão humana contra o Manual.

### 12.4 Dois tipos de kind, dois contratos de correção
- **Kinds de SELEÇÃO** (múltipla escolha, tocar a opção): a resposta certa aparece 1× nas `options`; cada distrator carrega sua tag de misconception importada do registro (`MisconceptionTag`, nunca string solta). O Radar lê a tag do que foi escolhido.
- **Kinds de PRODUÇÃO** (arrastar, disparar, montar, compor): **não têm `options`** A correção compara o ESTADO FINAL produzido com o alvo. Como não há distrator escolhido, o gerador declara uma regra de inferência — `misconceptionFrom(produzido, alvo) → tag | null` — que traduz o que a criança fez em diagnóstico (ex.: produziu 4 quando o alvo era 3 → `off-by-one-high`; distribuiu desigual na partição → `reparticao-desigual`). Sem isso, todo kind de produção fica invisível para o Radar.

### 12.5 Tema/skin: cosmético, coerente e por SESSÃO
O `themeContext` (pirata, fazendeiro, espaço) é 100% cosmético e **nunca** altera lógica ou resposta. Duas regras duras: (a) o tema é escolhido **no nível da sessão**, não por questão — trocar de pirata para fazendeiro a cada item vira caos visual e quebra a narrativa; (b) o tema fornece seu **vocabulário** (substantivo singular/plural, sprite, som) e o áudio compõe a partir dele — nunca hardcode "balões" num gerador que pode renderizar maçãs.

### 12.5-bis Representações de fração: pizza para apresentar, barra para operar

Cada formato serve a um momento; trocá-los é erro.
- **Círculo (pizza/bolo) — níveis 1-2:** é a experiência de vida da criança, carrega significado concreto e afetivo. **Para apresentar a ideia de fração, é insubstituível.**
- **Barra — níveis 3+:** para comparar e operar. Comprimentos se comparam direto, ângulos não. E a barra tem a mesma forma da reta numérica — então 3/4 na barra e 3/4 na reta são visivelmente a mesma coisa.
- **A transição é exercício:** mostrar a mesma fração nos dois formatos lado a lado e perguntar "são iguais?" é o que ensina que fração é quantidade, não desenho.

### 12.6 Mapa: mecânica do Manual → primitiva de UI
Reutilizar sempre; criar primitiva nova só quando a interação é genuinamente inédita.

| Mecânica (Manual) | Competências | Primitiva |
|---|---|---|
| Parear 1-a-1 (um pra cada) | N1.01 | DragGroup |
| Flash de subitização (Olhômetro) | N1.03, JD1 | EmojiRow (modo flash) |
| Contar tocando, item acende | N1.04 | EmojiRow (modo contagem) |
| Moldura de 10 / amigos do 10 | N1.08, N1.11, N3.06 | TenFrame |
| Number bond / parte-todo | N1.10, N3.05 | TenFrame + BarModel |
| Reta, saltos, sucessor, ponte do 10 | N1.07, N1.12, N3.07, N3.08, AL.03, N7.* | NumberLine |
| Conta armada, vai-um, troca da dezena | N3.11, N3.12, N4.08, N4.09, N4.10, N6.02 | InteractiveVertical |
| Repartir (partição) / laçar (medida) | N4.05, N5.01 | DragGroup (2 modos) |
| Arranjo retangular, comutatividade, área | N4.02, N4.09 | ArrayGrid |
| Comparação por barras, diferença, Bar Model / CUBOS | N3.04, N3.10, N5.*, N6.04 | SingaporeBars |
| Balança / igualdade / incógnita | AL.05–AL.08 | **Balança** (criar) |
| Relógio, horas e minutos | GM.04, GM.06 | **Relógio** (criar) |
| Centena, centésimos, porcentagem | N2.04, N6.01, N6.03 | **Quadrado100** (criar) |
| Formas, giro, Tangram, simetria | GE.* | **ShapeCanvas** (criar) |
| Tally, pictograma, barras de dados | PE.01, PE.02 | SingaporeBars (modo vertical) |

Faltam 4 primitivas: **Balança, Relógio, Quadrado100, ShapeCanvas.** Nenhuma trava N3 — dá para massificar N3 com o que já existe.

### 12.7 Testes de contrato (obrigatório antes de massificar)
Com 84 geradores × 5 níveis, inspeção manual não escala. Uma suíte automática varre **todos** e falha se: a resposta não aparece exatamente 1× nas `options` (kinds de seleção); houver opções duplicadas; algum valor sair dos `params` do micro; faltar `howto`, `explain` ou `audioPrompt`; alguma tag não vier do registro `MisconceptionTag`; o `kind` não existir no catálogo §9; o `prompt` passar de 12 palavras em F0-F1; aparecer negativo antes de N7; ou o gerador devolver o mesmo `kind` nos 5 níveis. Um gerador que não passa não entra no `GENERATOR_MAP`.

### 12.8 DESCOBERTA EM LOTE (as 4 ferramentas que quebram o ciclo de tentativa e erro)

Sintoma a evitar: descobrir problemas **um de cada vez**, por acaso, olhando a criança usar. Isso é lento, caro e desmoralizante. As quatro ferramentas abaixo transformam descoberta acidental em descoberta **em lote**, antes de qualquer criança tocar na tela. Nenhuma produção em massa começa sem elas.

**1. Definição de Pronto (DoD) por competência.** Uma competência só é considerada pronta quando: tem gerador nos 5 níveis **com kinds variando** conforme o CPA (§12.3); tem `howto`, `explain` e `audioPrompt` em todos; tem distratores com tag do registro (seleção) ou `misconceptionFrom` (produção, §12.4); tem **coreografia declarada no nível 1** (§7.4); os params ficam dentro do YAML; e passa a suíte inteira. Sem DoD explícito, produzem-se 84 competências pela metade e ninguém sabe quais.

**2. Snapshot dourado (anti-regressão).** Cada gerador tem sua saída congelada com semente fixa. Qualquer alteração futura aparece como **diff visível** em vez de mudança silenciosa. É a vacina direta contra o caso do destaque da Caixa Mágica: o que funcionava e sumiu passa a quebrar o teste na hora.

**3. Aprendiz simulado (a ferramenta mais poderosa).** Um script cria crianças falsas com perfis definidos — *4 anos do zero*, *6 anos com lacuna em amigos do 10*, *tropeça em reagrupamento*, *acerta tudo rápido* — e roda cada uma por 30/60/90 sessões, respondendo por um modelo de probabilidade (inclusive escolhendo o distrator de misconception às vezes). O relatório responde em segundos o que levaria meses observando: **alguém travou? onde?** · quantas sessões até dominar X? · o Radar disparou demais ou de menos? · a composição da sessão ficou dentro da proporção? · alguma competência nunca foi visitada? · as trilhas do Dojo abriram em tempo razoável? · a dificuldade subiu suave ou em degrau? Isso troca "descobri porque meu filho travou" por "descobri em 1000 sessões simuladas".

**3-bis. Simulação estreita não valida pedagogia.** Um simulador que roda **uma competência isolada**, sem Composer, sem Oficina, sem sonda de pré-requisito e sem outras strands abertas, **não pode ser usado para concluir nada sobre travamento** — nesse recorte a criança com lacuna trava por construção, e isso não prova que o motor funciona; prova que o recorte é incompleto. Para valer como evidência, a simulação exercita a **orquestração inteira**: Composer montando sessões, Radar disparando Camada 2, Oficina resgatando, sonda do pré-requisito e avanço paralelo em outra strand (§11.2.5). Enquanto for estreita, o relatório declara a limitação em destaque.

**3-ter. Uma rodada não é evidência — a simulação é estocástica.** Se o mesmo perfil termina em 55 sessões numa execução e 73 noutra, o número isolado não significa nada. Todo relatório de simulação declara **semente, data/hora e versão dos motores**, e reporta **mediana e faixa sobre ≥30 execuções**, não uma amostra. Conclusão tirada de uma rodada só é anedota com aparência de dado.

**3-quater. O simulador precisa de LINHA DE BASE de plausibilidade.** Número de simulação só vale depois de comparado com o que se espera do mundo real. Se o resultado contraria a realidade pedagógica — ou oscila em ordem de grandeza entre versões — a conclusão não é "o motor é assim", é **"o simulador está errado OU o ritmo do produto está errado"**, e é obrigatório descobrir qual antes de decidir qualquer coisa com aquele dado. Dois sinais de alarme: **(a) incoerência interna** — um perfil COM lacuna dominar mais rápido que um perfil sem lacuna indica métrica medindo trajetos diferentes ou perfis mal configurados; **(b) deriva entre versões** — a mesma medida saltar de 18 → 55 → 73 → 367 sessões significa que ela nunca foi calibrada. Toda métrica declara **o que está medindo** (trajeto completo? só o nó final?) e sua **faixa plausível esperada**; fora da faixa, investiga-se antes de reportar.

**4. Invariantes do sistema (asserções que valem sempre).** Testes que rodam sobre estados aleatórios de progresso e falham se qualquer regra do cânone for violada: a criança **nunca fica sem nada para fazer** (§11.5); a sessão **sempre termina em item fácil** (§6); o Radar **não dispara em erro isolado**, só em padrão (§8.2); o Composer pega **uma única fronteira**; nenhum nó abre com pré-requisito abaixo do limiar; nenhuma trilha de fluência abre sem a mãe em nível 4.

**Regra contra o falso verde:** todo teste deve verificar **presença**, não apenas validade. Um teste de coreografia que passa porque *nenhum* gerador declara coreografia não está passando — está cego. Se a competência exige coreografia no nível 1, a ausência é falha, não silêncio.

### 12.9 Prompt-contrato para a IA de autoria
Ao pedir conteúdo novo a qualquer IA (Gemini/Claude), o prompt é sempre: *"Preencha o contrato YAML da competência X seguindo a Bíblia §12 e o Grafo. NÃO crie competências, IDs, kinds ou faixas de parâmetros novos. Se algo parecer faltar no grafo, PARE e reporte a lacuna."* — a IA como operária do contrato, jamais arquiteta improvisada. (As skills `.claude/skills/nova-trilha` e `nova-materia` devem ser atualizadas para apontar para este documento.)

---

### 12.10 FRONTEIRA DA IA EM TEMPO DE EXECUÇÃO (o que a IA pode e não pode fazer com a criança na tela)

O princípio §2.9 (determinismo na aula, IA na autoria) continua valendo — mas agora que existe IA conectada em runtime (endpoint de dica e de relatório), a fronteira precisa ser explícita, senão a pedagogia vira loteria e o app deixa de funcionar sem internet.

**A aula é 100% offline e determinística.** As falas autorais — `howto`, `explain`, `tutorial` — vindas do Manual são o caminho **primário e suficiente**. A criança tem de conseguir aprender a lição inteira com o avião desligado. Se a IA cair, a rede falhar ou a chave expirar, **nada na experiência da criança pode mudar**.

**A IA em runtime NUNCA pode:** substituir a dica autoral · decidir progressão, nível, desbloqueio ou resgate · gerar exercício, distrator ou resposta ao vivo · ser pré-requisito para a aula rodar · introduzir espera perceptível no fluxo (o fluxo é sagrado, §8).

**A IA em runtime PODE:** ser um extra **pedido explicitamente pela criança** ("chama o mascote"), sempre depois de a dica autoral já ter sido oferecida; e gerar **relatório para os pais** — que é assíncrono, fora do fluxo da criança e de baixo risco.

**Guarda-corpos obrigatórios para texto de IA exibido a criança:** nunca entrega a resposta (mesma regra do `explain`, §8.1) · comprimento limitado · resposta validada antes de exibir (se vier fora do formato, cai no fallback autoral) · **fallback determinístico** sempre pronto · nenhum dado pessoal da criança no prompt · **chave geral de desligar** que deixa o app plenamente funcional sem IA · limite de uso por criança (proteção de custo) com resposta lúdica ao atingir o teto.

**Regra de decisão:** se um comportamento pedagógico depende da IA para existir, ele está no lugar errado — vira conteúdo autoral no Manual. A IA acrescenta calor, nunca estrutura.

## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO

### 13.1 O que a auditoria encontrou (julho/2026)
1. **Cinco+ "fontes únicas de verdade" concorrentes**, com currículos que se contradizem, e três cópias da árvore de docs (`AI_Studio_Lab/`, `backup_legado/`, `backup_repo/docs/`). O sintoma clássico de autoria multi-IA sem contrato.
2. **IDs incoerentes e colidentes:** `C0001` = Subitização no doc legado, mas = Contar 1-a-1 no código; `C0003` = Cardinalidade no doc, = Caixa Mágica no código. Cinco esquemas de ID convivendo. *(Resolvido: esquema novo + tabela de migração no Grafo §3.)*
3. **Grafo sem arestas:** `Track.prereqs` existe mas está vazio em quase tudo (3 trilhas de ~35 declaram pré-req); o `GraphValidator`/inter-ilhas admitidamente não existe. A "adaptatividade" real hoje é só o ZDP por trilha. *(Resolvido no papel: 84 nós com arestas; falta o unlock_engine.)*
4. **Trilhas-sanfona:** uma trilha comprime várias competências nos seus 5 níveis (Contar = 1-a-1 + cardinalidade + subitização + até 20), quebrando a semântica dos níveis CRA. *(Resolvido: 1 track = 1 competência; migração abaixo.)*
5. **Cobertura para até ~7 anos:** `grade: "pre" | "ano1"` no tipo `Kid`; nada de reagrupamento, multiplicação, divisão, frações, decimais (C0106/C0206 declarados e nunca implementados). *(Resolvido no papel: F2-F4 no Grafo.)*
6. **Tudo é múltipla escolha** e falta o kind mais importante da aritmética (reta numérica) e o da conta armada. *(Backlog §9.2, P1.)*
7. **Regra de domínio incompleta no código** (só streak; a Bíblia antiga exigia helpClicks=0 + latência — nunca implementado).
8. **Riqueza real a preservar:** composer com receita de aula excelente, ZDP com bônus de latência, telemetria já nos tipos, howto/explain, TutSteps, cenas vivas, economia dupla, mascote, skills de autoria, ritual de fechamento, lições de segurança do Firestore. **A fundação é boa — o problema era organização da autoria, não pedagogia.**

### 13.2 Migração em 6 fases (cada uma cabe em 1-3 sessões de trabalho)
- **M1 — Congelar e limpar.** Mover docs antigos para `arquivo_morto/`; commitar Bíblia+Grafo+YAML como únicos; atualizar CLAUDE.md e as skills para apontarem para cá. *Critério: grep por "fonte da verdade" retorna 1 lugar.*
- **M2 — Grafo executável.** Criar `curriculum/*.yaml` a partir do `grafo_saga.yaml` (F0-F1 primeiro); escrever `unlock_engine.ts` (regra §5) + testes; `graphId` novo em todas as tracks via tabela de migração (saves antigos migram por de-para).
- **M3 — Desfazer as trilhas-sanfona de F0.** Contar → N1.01/N1.04; canto → N1.02; etc. Progresso existente herda pelo de-para (nível atual vira nível da competência mais avançada da antiga trilha).
- **M4 — Kinds P1.** `numberline` e `vertical` + TutSteps + Mão Fantasma (`<GhostHand/>`) genérica. Com eles, F1 fecha inteira e F2 abre.
- **M5 — F2 no ar.** Competências N2.04–PE.02 geradas por contrato (§12.3), uma por sessão de autoria, teste junto.
- **M6 — Revisão espaçada e Dojo formais.** `review_planner` com os intervalos 2-4-7-12-21-45; trilhas FD; regra completa de domínio 👑; painel dos pais lendo o grafo (mapa de calor por strand).
- **F3-F4** entram depois de M6, cartucho a cartucho, pelo mesmo ritual — o grafo já está pronto esperando.

---

## §14. GOVERNANÇA
- **Mudança pedagógica** → edita Bíblia/Grafo primeiro, código depois (nunca o inverso).
- **Toda sessão de IA** começa lendo: CLAUDE.md (estado) → Bíblia (regras) → Grafo (conteúdo do dia). Termina com o ritual (§2.10).
- **Conflito entre documentos** = bug de documentação: resolver na hora, na fonte única.
- Versões: bump no topo deste arquivo a cada mudança material, com uma linha de changelog abaixo.

### 14.1 Regra da evidência (nenhum resultado é aceito sem prova)
Agente de IA relatando o próprio trabalho tende a agradar. Proteção estrutural, inegociável:
- **Todo resultado vem com a prova bruta.** "Os testes passaram" só vale acompanhado da **saída literal do terminal**; "migrei 14 coreografias" só vale com a **lista dos 14 IDs**; "criei o arquivo X" só vale com o **caminho e o conteúdo**. Resumo sem evidência não é resultado — é intenção.
- **Protótipo se declara ANTES, nunca depois.** Se um script é mock/simulação de formato, isso é dito **na mesma frase** em que o resultado é apresentado. Relatório de mock apresentado como resultado real é falha grave: contamina decisões e queima confiança. *(Precedente: o relatório do Aprendiz Simulado com números de travamento e disparos do Radar foi mock e só se revelou quando questionado.)*
- **Números específicos exigem execução real.** "Dominou em 4 sessões", "8 disparos do Radar" só podem aparecer se saíram de execução contra os motores reais (Composer, Radar, Dojo). Número inventado é pior que "ainda não medi".
- **Ferramenta que reporta prova que rodou:** todo relatório carrega no cabeçalho a data/hora, a semente usada e as versões dos motores que consultou.

### 14.2 Corrigir para estar certo, nunca para passar no teste
> **Caso especial e o mais perigoso de todos: ajustar a ASSERÇÃO para bater com o que o código devolveu.** Trocar o valor esperado por "o que estava saindo" transforma o teste em espelho: ele passa a confirmar o comportamento em vez de verificá-lo, e a regra que ele deveria proteger evapora sem deixar rastro. Quando teste e código discordam, a pergunta nunca é "qual mudo para ficar verde?", e sim **"qual dos dois contraria o cânone?"** — a resposta vem do Manual/Grafo, não da saída do terminal. Se a mudança de expectativa for legítima (a regra mudou de propósito), isso é registrado com a justificativa pedagógica ao lado da linha alterada.

Quando um teste reprova, a correção é do **conteúdo**, não da aparência. É proibido alterar código apenas para satisfazer a asserção (ex.: variar o `kind` de qualquer jeito só para o teste parar de acusar — §12.3). Se o teste é que está errado, corrige-se o teste **com justificativa escrita**. Toda correção em lote gerada por script sobre decisões pedagógicas passa por **revisão humana contra o Manual** antes de virar verde.

### 14.3 Ferramenta nunca adultera a fonte
Script de teste, dump ou simulação **jamais modifica arquivos de produção** para contornar limitação de ferramental (ex.: mexer em imports do Vite para rodar TS no terminal). Isso já corrompeu a árvore do git mais de uma vez. Se o runner não roda, corrige-se a configuração do runner — nunca o código do app. Toda ferramenta vive em pasta própria e só **lê** a aplicação.

### 14.4 Toda ferramenta tem comando que o DONO do projeto roda sozinho
Relatório narrado por quem executou não é verificável; relatório **reproduzível** é. Por isso toda ferramenta de auditoria, simulação ou verificação declara um comando no `package.json` — `npm run auditar`, `npm run simular`, `npm run contrato` — que **o dono do projeto executa por conta própria e vê a mesma saída**. Sem comando reproduzível, o resultado é narrativa, não evidência.

Isto é o antídoto **estrutural** contra o relatório inventado: quando o dono pode rodar, fabricar deixa de ser possível — não por disciplina, mas por arquitetura. Todo relatório traz, no topo, **o comando exato que o produziu**.

**Contagem de teste não é evidência — a LISTA de suítes é.** Um número grande e verde pode ser inteiramente irrelevante. Por isso todo relatório de teste exibe **quais arquivos rodaram**, e valem três regras duras:
- **O runner ignora código morto.** `arquivo_morto/`, `backup*/`, `*_legado/` e afins ficam fora do escopo do runner (via `exclude` na config). Teste rodando dentro de backup infla a contagem e valida código que ninguém usa. Sintoma real observado: metade das suítes vinha de `backup_repo/`, duplicando a contagem.
- **As suítes do cânone são nominalmente obrigatórias.** O comando de contrato tem de listar, entre os arquivos executados, os testes de: `unlockEngine`, `composer`, contrato dos geradores (§12.7), coreografia (§7.4) e invariantes (§12.8). Se algum não aparecer na lista, o comando está apontando para o alvo errado, por mais verde que esteja.
- **Verde sem as suítes certas é pior que vermelho:** dá confiança sem cobertura.

### 14.5 Controle de versão é infraestrutura crítica, não detalhe
Sem histórico confiável, toda regressão é permanente e nenhum diagnóstico é possível — não dá para saber o que quebrou, quando, nem voltar atrás. Portanto:
- **Git funcionando é pré-requisito de qualquer trabalho.** Repositório corrompido = parar tudo e consertar ANTES de tocar em qualquer arquivo. Nenhuma tarefa nova começa com o histórico quebrado.
- **Commit ao fim de cada mudança**, com mensagem descrevendo o que mudou e por quê. Sessão que termina sem commit é trabalho sem rede.
- **Nada é apagado fisicamente.** `arquivo_morto/` é túmulo, não incinerador: o que entra lá continua existindo. Excluir do runner (§14.4) resolve poluição de métrica; deletar do disco destrói evidência histórica de forma irreversível. Se um arquivo atrapalha, exclui-se do escopo das ferramentas — nunca do disco.

### 14.6 Migração nunca reduz o que a criança alcança (regra de paridade)
Trocar um sistema antigo pelo novo sem medir paridade faz o produto **piorar** aos olhos de quem usa, mesmo com a arquitetura ficando melhor. Antes de desligar qualquer caminho antigo: contar quantas atividades a criança alcançava antes e quantas alcança depois. Se o número cair, a migração **não está pronta** — mantém-se o antigo acessível até a paridade existir. Migração é ponte, não demolição: só se derruba a margem antiga quando a nova sustenta o mesmo peso.

### 14.7 Comportamento consertado vira especificação escrita + teste
Bug corrigido que não vira spec e teste volta — e volta várias vezes, consumindo sessões inteiras e a confiança de quem usa. Todo comportamento de interface que já foi ajustado uma vez (animação de tutorial, destaque de coreografia, quantidade de botões na tela, enquadramento do mascote) ganha, no mesmo commit: **uma linha de especificação** no documento correspondente e **um teste** que falha se regredir. Sem isso, "já tínhamos consertado isso" vira a frase mais repetida do projeto.
