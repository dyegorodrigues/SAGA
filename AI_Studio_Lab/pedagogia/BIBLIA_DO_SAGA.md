# 📖 A BÍBLIA DO SAGA
**Versão 2.6 · Julho 2026 · Fonte única de verdade do projeto**
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

---

## §6. ANATOMIA DA SESSÃO

A receita do composer atual ("▶️ Minha Aula") é canonizada como estrutura oficial, com dose por idade:

| Bloco | O quê | F0 (4-5) | F1-F2 | F3-F4 |
|---|---|---|---|---|
| 🔥 Aquecimento | trilha forte, um nível abaixo; erro não pune | 1 | 2 | 2 |
| 🧠 Resgate | banco de erros + trilha "fria" (mais dias sem prática) | 1 | 2 | 2 |
| ⚔️ Fronteira | A competência-alvo (pré-reqs ok, menor precisão) — **aqui se aprende** | 3 | 4 | 4-5 |
| ⚡ Fluência | Dojo diário (fatos da FD ativa) | 1 | 1 | 1-2 |
| 🎉 Fecho | lógica/padrões — sair sorrindo | 1 | 1 | 1 |
| **Total** | | **7 (~5-8 min)** | **10 (~10-12 min)** | **11-12 (~15 min)** |

- Ordem fixa com arco emocional (fácil → forja → fecho). Nunca embaralhar.
- **Se a Fronteira é uma competência em nível 1:** a sessão ABRE com a microtutoria (§7) antes do aquecimento — nunca jogar a criança num conceito virgem sem o I DO.
- Sessão de F0 nunca mistura mais de 2 competências além do fecho.

**A aula é feita de PRÁTICA, não de palestra.** Dos blocos acima, só a Fronteira é "aprender"; o resto é a criança FAZENDO. E mesmo na Fronteira, a explicação aparece na dose certa: microtutoria completa só quando a competência é virgem (nível 1); nos níveis seguintes, a criança resolve e a ajuda entra pontual (Camada 1, §8) — o Tutor vai sumindo conforme ela sobe (fading, §5). O padrão é fluxo de exercícios; o ensino é a exceção oportuna.

**O Plano do Dia (o pai não precisa organizar nada).** Ao abrir, a criança encontra a missão do dia já montada pelo Motor — ela só toca em "Jogar". Nenhum adulto precisa escolher o que ela estuda; o sistema decide pela telemetria. O painel dos pais mostra, em uma linha, o que foi feito e o que vem — para acompanhar, não para operar.

**Limite saudável, sem engaiolar quem quer mais.** A sessão do dia fecha em vitória e o app NÃO empurra "mais uma" (sem padrões de vício, sem nag — coerente com o cuidado de bem-estar). Mas se a criança QUISER continuar, ela pode: o app oferece, por iniciativa dela, treino livre no Dojo, uma prévia do próximo degrau, ou refazer/reforçar o que já sabe. A regra: o app nunca puxa para prender; ele libera quando a criança pede. Um controle opcional dos pais pode definir um teto de tempo. Excesso de dificuldade nova é barrado (a fadiga vira ruído, não sinal — §11); mas treinar o fácil à vontade é sempre permitido, porque aquece e não cansa.

---

## §7. MICROTUTORIAIS (o momento de ensino)

Três camadas, todas offline:

1. **Mão Fantasma (I DO)** — obrigatória no nível 1 de toda competência: uma mão translúcida faz o exercício inteiro, narrado, com a tela travada. *(Status: conceito aprovado, componente `<GhostHand/>` ainda não construído — prioridade da migração, §13.)*
2. **TutSteps (aula narrada)** — o sistema de `tutorials.ts` (passos `say` + `show`), generalizado: **todo kind declara seus passos**. Padrão de roteiro (30–90s): *gancho* (1 frase que liga ao mundo da criança) → *demonstração* (worked example completo, narrado, com a cena mudando junto da voz — o padrão Meu Dia/Ciclo da Planta) → *"sua vez"* (1 item guiado).
3. **Exemplos com lacuna (faded examples)** — no nível 2-3, o app resolve 80% e a criança fecha o último passo; a lacuna cresce até o nível 4. É a ponte científica entre ver e fazer.

**Formato da demonstração: sobreposição com exemplo GÊMEO.** A demonstração (I do) aparece como um painel **por cima do próprio exercício**, resolvendo um caso **com outros números** — nunca o que a criança tem de responder (senão ela copia em vez de aprender). Nele o processo inteiro acontece à vista: o objeto sendo tocado/contado um a um, o numeral saltando a cada passo, a narração acompanhando. Terminada a demonstração, o painel sai e a criança faz o SEU caso. A contagem passo a passo ("um... dois...") permanece disponível como **dica**, se ela pedir ou errar — não como a aula inteira repetida.

**Regra da dose:** microtutoria completa só na estreia da competência e na remediação (§8). Reprises: versão de 15s. Criança que já sabe odeia ser reensinada.

### 7.4 CONTRATO DE COREOGRAFIA (a explicação é DADO, não fiação)

A explicação pedagógica não é "o mascote fala" — é uma **coreografia sincronizada** de áudio + destaque visual + tempo (a fileira da moldura acendendo enquanto a voz diz "uma fileira cheia já são cinco"; a dezena explodindo no MESMO frame em que o algarismo muda). Essa sincronia é a alma do CPA. Se ela for fiação improvisada dentro do GameLoop, some silenciosamente na primeira refatoração — e ninguém percebe até a criança ficar perdida. Por isso:

**1. Toda coreografia é declarada como dado**, junto da questão (no gerador ou no YAML da competência), nunca como código solto:
```
tutorial: [
  { say: "Olha a fileira de cima.", show: { destacarFileira: 1 }, sync: "junto" },
  { say: "Cheia, já são cinco!",    show: { destacarFileira: 1, contar: 5 }, sync: "junto" },
  { say: "Agora a de baixo.",       show: { destacarFileira: 2 }, sync: "depois" }
]
```
`sync: "junto"` = áudio e visual no mesmo frame (obrigatório nos momentos de sincronia mágica). `sync: "depois"` = sequencial.

**2. Toda primitiva publica sua API VISUAL** — a lista fechada de comandos que aceita, documentada no próprio componente e visível na galeria. Exemplos: TenFrame → `destacarFileira`, `destacarCelula`, `preencherAte`; InteractiveVertical → `destacarColuna`, `explodirDezena`, `mostrarVaiUm`; NumberLine → `saltarDe/Para`, `marcarPonto`; DragGroup → `piscarOrigem`, `piscarDestino`. É o equivalente visual do vocabulário de estados (§10.11): sem API declarada, cada exercício improvisa e nada é reaproveitável.

**3. Um único player executa todas as coreografias.** Ele lê o timeline, dispara o áudio e envia os comandos à primitiva. Uma implementação só, usada pelos 84 exercícios — nunca lógica de tutorial dentro da primitiva (ela é "burra" de propósito) nem espalhada pelo GameLoop.

**4. Teste que impede a regressão silenciosa (obrigatório, entra na suíte §12.7):** para cada passo de cada coreografia, a chave usada em `show` **tem de existir na API visual da primitiva alvo**. Se alguém refatorar e derrubar `destacarFileira`, o teste quebra o build na hora, em vez da explicação sumir sem aviso. *(Foi exatamente essa a causa do sumiço do destaque da Caixa Mágica — a coreografia continuava mandando o sinal e a primitiva refatorada estava surda.)*

**4-bis. Coreografia sem `show` não é coreografia — é narração.** O ponto inteiro é áudio E visual juntos. Regra testável: **toda coreografia tem ao menos um passo com `show` não-vazio**; se todos os passos só têm `say`, o teste reprova. Sem isso o falso verde volta pela porta dos fundos — a voz fala e nada se move na tela.

**4-ter. Sincronia com TTS é ilusória se amarrada só ao início da fala.** O sintetizador não avisa quando uma palavra *dentro* da frase é pronunciada: prender o visual ao `onPlay` sincroniza com o **começo do enunciado**, não com o momento certo. Se a fala é "o que vem depois do UM?" e o salto deve ocorrer em "depois", o visual dispara cedo demais. Para `sync: "junto"` ser real: **cada batida visual recebe seu próprio enunciado curto** (uma frase por passo, disparando o visual no início dela) ou usa-se **áudio pré-gravado com marcas de tempo**. Sincronia justificada por argumento de arquitetura não vale — vale a observada com olho e ouvido.

**5. A galeria também roda coreografia.** Além de primitiva × estado, a `/galeria` precisa de um modo que **execute a coreografia de qualquer exercício do início ao fim**, para inspeção visual. Sem isso a galeria tem um ponto cego justamente onde a pedagogia mora.

---

## §8. FEEDBACK E ERRO (duas camadas — o fluxo é sagrado)

**Princípio-mãe:** errar é parte de aprender; a criança tem de continuar SE MOVENDO. A resposta ao erro NUNCA para a sessão para dar aula a cada tropeço. Duas camadas separadas, que não se misturam: uma leve dentro da questão, outra profunda disparada por PADRÃO. Campos `howto` (COMO, falado na 1ª questão) e `explain` (PORQUÊ) permanecem obrigatórios em todo gerador.

### 8.1 Camada 1 — resposta imediata (leve, preserva o fluxo)
No máximo dois toques antes de seguir; a criança fica no comando o tempo todo:
1. **1ª tentativa errada** → auto-correção: feedback gentil que convida a tentar de novo ("olha de novo!") + esconder 1 opção absurda. Sem aula — a maioria dos erros é deslize e a criança conserta sozinha.
2. **2ª tentativa errada** → UMA dica estratégica falada (`explain` aponta o caminho, nunca a resposta).
   > **`explain` NUNCA pode descrever uma misconception documentada daquela competência.** Regra testável: se a estratégia sugerida coincide com um dos "Erros típicos" do nó no Grafo, a dica está ensinando o erro. ❌ N1.05 (comparação) com *"olhe qual lado tem um amontoado maior, onde as coisas ocupam mais espaço"* — é exatamente a falha de conservação piagetiana que a competência existe para curar (4 espalhados ocupam mais espaço que 5 juntinhos). ✅ *"Faça um par de cada vez: um daqui, um dali — quem sobrar tem mais."* O antídoto do Manual é PAREAR, não medir área.
   > **`explain` nomeia a ESTRATÉGIA daquela competência (a do Manual), nunca repete o enunciado e nunca contraria a natureza da habilidade.** ❌ N1.03 (subitização) com *"aponte para cada figura e conte com calma"* — destrói a competência, que é justamente reconhecer a quantidade **sem** contar um a um. ✅ *"Olha o desenho todo de uma vez — que formato as bolinhas fizeram?"*. Repetir a tarefa em outras palavras ("compare os grupos e escolha o pedido") não é dica: não diz COMO pensar.
   > **`explain` é DICA DE ERRO, não mensagem de acerto.** Ele só toca quando a criança errou. Portanto: nunca começa com elogio ("Muito bem!", "Você acertou!", "Isso!") e **nunca entrega a resposta**. ❌ *"Você acertou! Tínhamos 9, com mais 1 a caixa fechou 10."* (elogia quem errou e dá o resultado) · ✅ *"Olha os quadradinhos vazios da caixa e conte quantos faltam."* (aponta a estratégia, a criança conclui). O elogio pertence ao feedback de acerto, que é outro campo e outro momento.
3. **Ainda errou** → mostra a resposta com uma frase de porquê, marca o item/fato como frágil e **AVANÇA na hora**. Nada de demonstração longa no meio do fluxo. Nunca trava.

*Deslize vs. dificuldade (o motor decide o peso do toque):* erro rápido (`rt` baixo) num distrator qualquer = provável deslize → toque mínimo. Erro lento OU num distrator com tag de misconception = dificuldade real → a dica do passo 2 já é a específica daquela confusão.

### 8.2 Camada 2 — remediação profunda (por PADRÃO, no momento certo)
A demonstração narrada, a Mão Fantasma (fazer junto) e o microtutorial vivem AQUI — e **não disparam na questão isolada**. Disparam quando o Radar de Lacunas (§11.4) detecta padrão, e são entregues no momento que respeita o fluxo: **numa pausa natural, no fim da sessão, ou como Missão de Resgate na sessão seguinte** — jamais engasgando a criança no meio de uma questão. É o "depois de alguns exercícios, verificar os erros e aí trabalhar pontualmente".
- Conteúdos (o QUÊ; o QUANDO é sempre §11.4): **dica** aponta a estratégia · **demonstração** = o app resolve um gêmeo narrando (mini Mão Fantasma), a criança assiste · **fazer junto** = a criança executa com o tutor sustentando.

### 8.3 Distratores são o sensor
Cada opção errada deve ser um erro típico do Grafo, etiquetado com sua tag de misconception (ex.: 42−38 oferece 16, tag `inverte-coluna`; 1/4+2/4 oferece 3/8, tag `soma-em-cima-e-embaixo`). Distrator aleatório é desperdício de diagnóstico — o distrator escolhido REVELA o que a criança pensou e é o que alimenta o Radar (§11.4) que dispara a Camada 2.

**Exceção — modo ensino:** na 1ª vez de um conceito e dentro de um microtutorial, o andaime Eu-faço → Fazemos-juntos → Você-faço é o esperado (a criança está aprendendo, não sendo avaliada). Andaime em aula ≠ punição por erro.

### 8.4 A Oficina é híbrida (invisível para o pequeno, visível para o grande)
A remediação (Camada 2) mora na Oficina (§3.1), e ela aparece de dois jeitos, conforme o tamanho da lacuna:
- **Tropeço pequeno → Oficina INVISÍVEL (estado).** Sem troca de tela, sem "você foi para outro lugar". O motor só faz os próximos itens ficarem mais concretos e lentos dentro da própria cena (traz de volta o bloquinho, a animação, a dica). A criança sente apenas "o jogo ajudou um pouquinho agora" — a sensação Super Nintendo: a máquina trabalha sem aparecer. É a evolução natural do `getScaffoldLevel` que já existe.
- **Lacuna teimosa → Oficina VISÍVEL (lugar).** Quando o Radar (§11.4) confirma padrão persistente, nasce a **Missão de Resgate**: um lugar com cara de aventura numa ilha antiga (*"o Guardião da Ponte precisa de você!"*), tudo lento e concreto, 5 minutos, recompensa própria, e volta ao fluxo. Nunca tem cara de castigo, nunca usa vermelho de reprovação.
- **Sempre visível para os pais.** Mesmo quando foi invisível para a criança, o painel registra ("reforçou 'completar o 10' por 5 min"). O pai enxerga a máquina; a criança, só o jogo.

**Regra de decisão:** pequeno e pontual → invisível; persistente e conceitual (confirmado por padrão) → Missão de Resgate visível. O que separa os dois é o Radar detectar PADRÃO, não o erro solto.

**A Oficina tem FÍSICA PRÓPRIA — não é a Academia em câmera lenta.** Reaprender é mais rápido que aprender (efeito de economia: o que já foi visto volta com menos repetição). Se o resgate usar o mesmo ritmo da aula, a criança é mandada à Oficina uma dezena de vezes pela mesma lacuna e desiste. Portanto, dentro da Oficina:
- **Escada acelerada:** sobe com **2 acertos** (não 3), porque é desenferrujamento, não primeira aprendizagem.
- **Alvo é destravar, não coroar:** o resgate termina quando o pré-requisito atinge o nível **necessário para a competência dependente andar** — nunca exige nível 5 + coroa. Levar um pré-requisito a domínio pleno é trabalho da Academia, não do resgate.
- **Dose proporcional à lacuna:** lacuna severa toma a maior parte da sessão; lacuna leve toma um punhado de itens. Resgate fatiado fino contra buraco grande só prolonga a agonia.
- **Teto com escalada (anti-loop):** mais de **3 resgates** para o MESMO pré-requisito significa que o buraco é mais fundo. O motor então sonda o pré-requisito **do pré-requisito**, e sinaliza no painel dos pais. Nunca repetir a mesma missão indefinidamente em silêncio — é o "nunca trava" (§11.5) aplicado à própria Oficina.

**Regras de tom (mantidas):** acerto = elogio curto ("Isso!"), mais curto em streak; elogia esforço/estratégia, não "gênio"; transição rápida (250ms); erro nunca tem som agressivo; energia/mascote jamais punem.

---

## §9. CATÁLOGO DE KINDS (renderizadores de exercício)

Kind = o "molde de interação". Regra viva: **kind novo só com 2+ usos previstos** (Constituição). Todo kind declara: mecânica, competências que serve, comportamento de áudio, tutorial (TutSteps) e acessibilidade de não-leitor.

### 9.1 Existentes no código (validados — manter e especificar)
| Kind | Mecânica | Serve principalmente |
|---|---|---|
| `plain` | pergunta + 3-4 opções tocáveis (texto/emoji/numeral) | universal (o coringa) |
| `math` | expressão simbólica + opções | N2-N7 abstrato |
| `count` | tocar objetos 1 a 1 com trava e dedo-guia 👉 | N1.01, N1.04 (padrão-ouro) |
| `sum` / `subvis` | juntar grupos / esconder objetos, animado | N3.01-04 concreto |
| `groups` | grupos iguais em cena | N4.01, N1.05 |
| `tenframe` | moldura de 10 interativa | N1.08, N1.11, N3.07-08 |
| `bond` | círculo parte-todo (number bond) | N1.10-11, N3.05 |
| `flash` | quantidade pisca ~2s e some | N1.03 |
| `pattern` | sequência para continuar/corrigir | AL.02, AL.04, AL.07c |
| `shapes` | formas para reconhecer/classificar | GE.02-03, GE.07 |
| `order` | ordenar cartas/sequências | N1.07, N2.02, AL.03-04 |
| `conserv` | espalhamento animado (conservação) | N1.05c |
| `tens` | material dourado (barras/cubinhos) | N2.01, N2.04, N3.11-12a |
| `money` / `clock` | moedas-cédulas / relógio | GM.03-04, GM.06, N6.02b |
| `picto` | pictogramas/tabelas/barras | PE.01-02 |
| `story` | probleminha 100% narrado com cena | N3.10, N4.05, F3-F4 contexto |
| `scene`/`journey`/`daypart`… | cenas vivas narradas | GM.02, GE.01, tutoriais |
| `rapid-fire` | dojo cronometrado | todas as FD |
| `singapore-bars` | barras de Singapura | N3.10, N5, N6.04 |

### 9.2 Novos necessários (o backlog oficial, por prioridade)
**P1 — destravam F1-F2 (construir primeiro):**
- `numberline` — reta interativa com saltos animados. Serve 10+ competências (N1.12, N3.03-08, N6.01, N7.01-02…). **É o buraco mais grave do motor atual.**
- `vertical` — conta armada interativa, dígito a dígito, com reagrupamento animado e vírgula (N3.11-12, N4.08-10, N4.12, N6.02).

**P2 — destravam o mundo multiplicativo e frações:**
- `array` (arranjo retangular giratório; N4.02-08, GM.08) · `drag-group` (arrastar para repartir/classificar; N4.05, AL.01d) · `frac-shade` (partir/pintar frações; N5.*, N6.01, N6.03) · `balance` (balança da igualdade; AL.05, AL.08, GM.01c) · `part-whole`/`fact-family` (variações do bond) · `build-number` (compor números com placas/barras/vírgula) · `trace` (traçado do numeral com guia) · `drag-match` (parear).

**P3 — F3-F4 e medidas:**
- `grid` (malha/plano cartesiano) · `measure` (régua arrastável) · `clock-set` (arrastar ponteiros) · `hundred-chart` · `bar-build` · `angle` (transferidor) · `area-model` · `ratio-table` · `chip-model` (fichas ±) · `geo-transform` · `blocks-3d` · `symmetry` · `input` (**teclado numérico para resposta aberta** — a partir de F2 nem tudo pode ser múltipla escolha; distratores viram análise do valor digitado).

---

## §10. ÁUDIO-FIRST E UX DO NÃO-LEITOR (regras duras)

1. **Todo enunciado se auto-narra** ao carregar; o balão 🔊 sempre reproduz (com o `lang` correto — bug já corrigido, regra registrada).
2. **Toda opção é audível quando o conteúdo é simbólico/verbal** (`audibleOptions` + `Option.say`): a criança escolhe pelo SOM antes de ler. Emojis/imagens autoevidentes dispensam.
3. **`sayTarget`:** o alvo sonoro é falado e NUNCA escrito quando escrever entregaria a resposta (herdado do Português — vale para "toque no cinco").
4. **Botões de navegação falam.** Home, mapa, álbum: primeiro toque em ícone desconhecido = fala o nome; toque no rótulo = repete. Nenhuma tela do fluxo da criança exige leitura para navegar — **auditar a home atual com esse critério (pendência, §13)**.
5. **Toque corta a voz** e avança (fluidez — regra conquistada na 7ª rodada, inviolável).
6. **Misclick-lock** durante transições e primeiros 300ms de áudio (mantida).
7. **Touch targets ≥ 80px**, uma ação por tela, contraste alto (mantidas).
8. **Instruções ≤ 12 palavras** por frase falada em F0-F1; frases curtas, ritmo de conversa, zero jargão ("vamos JUNTAR" antes de "somar" — o símbolo chega com a voz apresentando).
9. **Voz:** TTS pt-BR como fallback permanente; banco neural (pipeline Luna: MP3 pré-gerados em `public/audio/` + fallback TTS) é a rota oficial. O hack de fonemas TTS segue **proibido** (causa raiz de bug já diagnosticada).
10. **Texto sempre presente, nunca exigido:** o rótulo escrito acompanha a fala (alfabetização incidental) — exceto quando viola a regra 3.

### 10.11 A CAMADA VISUAL (a regra que permite trocar TODA a arte sem quebrar nada)

Objetivo: poder mudar paleta, fonte, elementos e o estilo inteiro do app (ex.: virar pixel-art/dojo) **mexendo em um dicionário**, sem tocar em motor, gerador ou lógica de exercício. Isso só funciona se a separação abaixo for respeitada desde o primeiro componente.

**As 5 camadas (nenhuma enxerga a de baixo):**
1. **Tokens** — um dicionário único: cores, tipografia, espaçamento, raios, sombras, durações de animação, tamanhos de alvo. **Semânticos, nunca literais:** `cor.acao.primaria`, `cor.feedback.acerto`, `cor.superficie.cartao` — jamais `azul500`. Motivo: "azul500" não sobrevive a uma virada pixel-art; "ação.primária" sobrevive a qualquer estilo.
2. **Chrome da UI** — Botão, Cartão, Painel, Modal, Barra de progresso, Ícone. Consomem **só tokens**.
3. **Primitivas pedagógicas** — NumberLine, TenFrame, DragGroup, InteractiveVertical, ArrayGrid, SingaporeBars, Balança, Relógio, Quadrado100, ShapeCanvas. Cada uma dividida em **lógica** (estado, interação, o que é correto — sem UMA cor dentro) e **apresentação** (só tokens + skin).
4. **Skins/temas** — a fantasia narrativa (pirata, fazendeiro, espaço). Um skin é **dado, não código**: sprites, vocabulário (singular/plural para o áudio), sons, fundo. Adicionar tema novo = adicionar um arquivo + assets, sem mexer em componente.
5. **Geradores** — produzem **dados puros** (kind, params, resposta, distratores, áudio). Um gerador que contenha cor, tamanho ou decisão visual é bug.

**A regra de uma frase:** *o gerador diz O QUE perguntar, a primitiva renderiza COM TOKENS, o skin veste com ASSETS.* Trocar tokens muda o visual inteiro; trocar skin muda a narrativa; nenhum dos dois toca em motor ou gerador.

**Vocabulário único de estados visuais** (todo kind implementa os mesmos, com estilo vindo de token): `ocioso · ativo · erro-suave · acerto · desabilitado · demo (Mão Fantasma)`. Sem isso, cada exercício inventa seu próprio "tremer" e seu próprio "verde", e a arte nunca fica coerente nem muda junto.

**O que MACULA o sistema (proibido):**
- Cor, tamanho ou fonte escrita à mão dentro de primitiva pedagógica ou de kind (`bg-blue-500`, `#FF0000`, `14px`).
- Gerador com decisão visual.
- Skin que altere lógica, dificuldade ou resposta (skin é 100% cosmético — §12.5).
- Componente sob medida por exercício (impede restyle global; usar as primitivas, §12.6).
- Asset embutido no componente em vez de vir do registro do skin.

**Contrato para redesenho (inclusive feito por outra IA).** Quem redesenha mexe **apenas** em: (a) o dicionário de tokens, (b) a camada de apresentação das primitivas, (c) os assets dos skins. **Nunca** em motores, geradores, grafo ou coreografia. A `/galeria` é a superfície de teste e de aceite. **Não se cria um segundo conjunto de telas** (`views-v2` e afins) para redesenhar: bifurcar a árvore visual gera dois sistemas para manter e é exatamente o caos que este cânone existe para impedir — troca-se o token e a apresentação, não se clona a aplicação.

**Ordem de execução (importa):** fazer a **passagem de tokens nas primitivas existentes ANTES** de massificar geradores e kinds novos. Converter 7 primitivas agora é barato; converter 40 depois é retrabalho caro. A rota `/galeria` é a sala de controle: renderiza toda primitiva × todo estado × todo tema numa página, para ver o efeito de qualquer mudança de token na hora.

### 10.12 Movimento, mascotes e catálogo

**Animação é token, não improviso.** Duração e easing entram no dicionário (`movimento.rapido: 150ms`, `movimento.suave: 300ms`, `movimento.entrada`, `movimento.saida`). Cada componente que inventa seu próprio tempo faz o app parecer feito por cinco pessoas diferentes. Regras técnicas duras: animar **somente `transform` e `opacity`** (nunca `width`, `height`, `top`, `left` — causam travamento em tablet barato); nada de animação dirigida por frame no JavaScript enquanto a criança pode tocar; a meta é 60fps **no tablet real que as crianças usam**, não no desktop do desenvolvedor. E há duas classes de animação que não podem ser confundidas: **decorativa** (pode ser cortada sem perda) e **pedagógica** (a dezena explodindo, a fileira acendendo — carrega significado, é intocável e testada).

**Mascotes seguem a mesma lei das primitivas.** Cada mascote é uma pasta própria com suas partes em SVG parametrizado (cor vinda de token, nunca fixa), registrado num **registro único** — adicionar mascote novo = adicionar pasta + uma linha no registro, sem tocar em componente. E ele publica seu **vocabulário de expressões** (`ocioso · comemorando · pensando · encorajando · demonstrando`), do mesmo jeito que as primitivas publicam estados: o motor pedagógico comanda a expressão, o mascote só obedece. Assim, trocar toda a arte dos mascotes (inclusive para pixel-art) não toca em uma linha de lógica.

**O mascote VIVE no cenário — palco em camadas, nunca "bolinha".** Errado: fundo com `border-radius: 50%` atrás do personagem, que fica boiando num escudo redondo. Certo: o quadro do mascote é um **palco de três camadas** — (0) **fundo**: a arte do cenário preenchendo o quadro inteiro; (1) **ator**: o mascote com fundo transparente, ancorado no "chão" do cenário, livre para andar; (2) **frente**: elementos que passam na frente dele (morcego voando, confete de vitória). O cenário é o mundo, não um adesivo atrás da cabeça. Cada cenário é declarado no registro com suas três camadas.

**Enquadramento do mascote — especificação fechada (§14.7).** O mascote vive numa **telinha retangular de cantos arredondados**, como a tela de um videogame portátil. Dentro dela: o **cenário preenche o fundo inteiro da telinha** (não é círculo, não é adesivo, não é "bolinha" atrás do personagem) e o **mascote fica solto por cima**, inteiro no quadro, ancorado no chão do cenário, com margem — nunca cortado nem com zoom estourado. Em repouso ele fica parado (estado ocioso); movimento acontece só em acerto, alimentação, interação ou evolução — nada de flutuar/balançar permanentemente. Efeitos e partículas acompanham o personagem, e são a única coisa que pode aparecer "atrás" dele. Qualquer alteração aqui exige atualizar esta linha primeiro.

**Catálogo de exercícios (gerado, nunca escrito à mão).** Um script varre o `GENERATOR_MAP` e produz a tabela: competência → nível → kind → primitiva → skin → tem coreografia? → tem áudio? Essa tabela alimenta o painel Admin, onde cada linha é clicável e leva ao exercício rodando com suas anotações. **O catálogo é também um detector de entulho** e deve sinalizar três patologias: **duplicatas** (dois exercícios distintos fazendo a mesma coisa para a mesma competência), **órfãos** (exercício ou asset alcançável que não pertence a competência nenhuma — inclusive cenário de mascote fora do registro de temas), **buracos** (competência cujo único exercício é o fallback) e **deriva de nomenclatura** (gerador servindo um nó sob nome herdado — ex.: `gA1Dez` servindo `N2.01`). O nome da função geradora espelha o ID do nó (`gN2_01` → `N2.01`); nomes antigos só sobrevivem numa tabela de equivalência explícita, com data de aposentadoria. Sem essa varredura o conteúdo apodrece em silêncio. É o que permite enxergar as 84 competências de cima, achar buracos (exercício sem coreografia, kind repetido nos 5 níveis) e editar com segurança sem caçar arquivo.

---

## §11. O MOTOR ADAPTATIVO

### 11.1 O que ele lê (telemetria — campos já existentes)
`lvl, maxLvl, dom, streak, bad, ok/tot, rt` (média móvel 70/30), `helpClicks`, `skips`, `lastDay`, banco de erros (`bank`). Novo campo por implementar: `errKind` (qual distrator-tipo a criança escolhe — alimenta §8.3).

### 11.2 O que ele decide
1. **Desbloqueio** (unlock_engine): regra única do §5. O mapa pinta ilhas: 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada.
2. **Seleção da fronteira** (composer, mantido): entre abertas e não dominadas, a de pior precisão; se tudo dominado, a próxima virgem do grafo.
3. **Revisão espaçada** (review_planner): intervalos **2 → 4 → 7 → 12 → 21 → 45 dias** por competência dominada (já especificados no código — agora executados de verdade). Falhou na revisão? Recolocar na fila de resgate e, se falhar 2×, reabrir como fronteira (decair `dom` visualmente é proibido — a coroa fica, o treino volta).
4. **Dojo:** pilar autônomo (a criança entra direto e treina à vontade) que também cede 1 bloco diário à aula; treina DUAS famílias de fluência — fatos (FD) e procedimentos armados multi-dígito (PD) — mais o Jardim do Dojo pré-simbólico. Spec completa em `DOJO_SAGA.md`.
5. **Anti-travamento (a resposta ao teu medo):**
   - Sempre ≥ 3 strands com ilha aberta. Se o grafo afunilar, abrir a próxima raiz de outra strand.
   - Frustração detectada (2 sessões seguidas com precisão < 50% na mesma fronteira, ou `skips` ≥ 2) → trocar a fronteira de strand na próxima sessão + injetar microtutoria do pré-req mais frágil (menor `maxLvl` entre os pré-reqs).
   - **Nunca** exigir nível 5 para destravar o próximo nó (3 basta) — fluência amadurece em paralelo no Dojo, não segura a fila.
6. **Modo Gênio (existente como ideia):** o seletor de nível 🎯 permite pular com honestidade (bolinha só pinta com acerto — regra mantida). Para o pai destravar faixas acima da idade: liberar por strand, nunca global.

### 11.3 A Bússola de Posicionamento (onde a criança COMEÇA)
O problema real: um filho de 6-7 anos entra no app — por qual competência começar? Perguntar a idade e chutar a faixa erra pros dois lados (quem tem lacunas afoga; quem está adiantado boceja). A resposta: **a idade dá o palpite inicial; a evidência decide.**

- **Formato:** a primeira sessão é a "Expedição do Mapa" — 10-15 min disfarçados de jogo de exploração, sem cara de prova. 2-3 itens por strand principal (N1/N3 primeiro, depois AL, GE, GM), começando no ponto que a idade sugere.
- **Movimento tipo busca binária:** acertou com folga → pula 2-3 competências à frente na strand; errou → recua até achar chão firme. Cada strand fecha quando encontra a **fronteira** (acerta aqui, hesita ali).
- **Regras duras:** nenhum feedback de erro na expedição (toda resposta ganha "hmm, interessante!" do explorador); sinais de frustração (Manual §Criança Real) encerram a strand na hora e assumem a fronteira conservadora; pode pausar e continuar amanhã; o resultado NUNCA é mostrado como nota — vira o mapa inicial (ilhas já 👑 pelo que demonstrou, 🔥 na fronteira).
- **Competências puladas na expedição ficam `presumido_dom`** (coroa cinza): valem como pré-requisito, MAS a primeira vez que aparecerem em revisão/resgate são testadas de verdade — se falharem, viram fronteira sem drama. Confiança com verificação.
- **Reposicionamento contínuo:** a Bússola nunca "termina". Cada entrada em strand nova dispara uma mini-expedição (3-4 itens). Errar é dado, nunca dano.

### 11.4 O Radar de Lacunas (como detecta ONDE está falhando — e resgata)
O motor não pergunta "quantos erros?"; pergunta **"qual é o PADRÃO do erro?"**. **Este radar é o gatilho da Camada 2 do §8** — a remediação profunda (demonstração, Mão Fantasma, microtutorial) só acontece quando um destes sensores acende, e é entregue numa pausa/fim de sessão/resgate, nunca no meio de uma questão. Erro solto na questão é tratado pela Camada 1 leve; é o PADRÃO que este radar captura que merece trabalho focado. Quatro sensores, em ordem de precisão:

1. **Tag de misconception no distrator (o sensor de ouro).** Todo distrator gerado carrega a tag do erro que representa (o Grafo define os "Erros" de cada competência; o gerador etiqueta: `off-by-one`, `soma-em-cima-e-embaixo`, `inverte-coluna`, `pensamento-aditivo`…). **2× a mesma tag em 5 questões = misconception ATIVA** → dispara o microtutorial específico daquela confusão (não o genérico da competência). É a diferença entre "errou divisão" e "está somando denominadores".
2. **Erro na competência ≠ lacuna na competência.** 2 erros no mesmo micro → o motor testa a HIPÓTESE pré-requisito: injeta 1-2 questões-sonda do pré-req mais frágil (menor maxLvl) **dentro da própria aula** (os slots de resgate do composer, §6 — já existem, agora com este gatilho). Sonda falhou → a lacuna é lá atrás: nasce uma **Missão de Resgate**.
3. **rt e ajuda como sismógrafo:** acerto com rt 3× acima do padrão da criança = domínio frágil (conta como meio-erro para revisão); helpClicks repetidos no mesmo tipo = pedir o microtutorial antes que o erro aconteça.
4. **Ferrugem programada:** a revisão espaçada (11.2.3) é o radar do esquecimento — falha na revisão reabre treino, nunca rebaixa coroa.

**A Missão de Resgate (como o "voltar" funciona):** a competência frágil vira uma missão especial na ilha antiga — *"o Guardião da Ponte precisa de você de novo!"* — com 4-6 questões + microtutorial. **Enquanto isso a fronteira atual NÃO fecha:** a criança segue avançando em outra strand em paralelo (anti-travamento, 11.2.5). Resgate concluído → a competência de cima destrava de novo o degrau que tinha ficado difícil. Na prática: o app volta SEM a criança sentir que voltou.

### 11.5 IDADE NUNCA TRAVA (a regra de ouro da progressão)
As faixas F0-F4 do Grafo são **calibragem, não catraca**: elas ajustam o palpite da Bússola, a duração da sessão, o tom narrativo e o tamanho dos alvos — e NADA mais. O que abre e fecha competência é uma única coisa: **pré-requisito dominado (regra do §5)**. Consequências explícitas:
- O filho de 7 com lacunas de F0 treina competências de F0 — apresentadas com narrativa da idade dele (o resgate é missão de herói, não "voltinha pro jardim"; os temas visuais são por idade, o conteúdo é por evidência).
- A criança de 6 que voa entra em F2-F3 sem nenhuma trava etária. O sistema **nunca segura** por "não é da sua série": se os pré-reqs estão 👑, abre. (O Modo Gênio de 11.2.6 vira só um atalho de exploração para o pai — a progressão normal já não conhece teto de idade.)
- Estar "adiantado" ou "atrasado" não existe no vocabulário do app — nem nas telas, nem no painel dos pais. Existe fronteira: onde a criança está aprendendo AGORA. O painel dos pais mostra o mapa por strand (pode estar em F3 de números e F1 de geometria — e isso é NORMAL e dito assim).

### 11.6 Como tudo isso APARECE NA TELA
- **O mapa é o estado mental do motor, traduzido:** 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada · 👑cinza presumida · ✨ missão de resgate (ilha antiga brilhando com um "!").
- **Voltar nunca parece voltar:** resgate = missão especial com recompensa própria; recuo de nível dentro da competência = invisível (a próxima sessão simplesmente flui melhor).
- **Proibições visuais:** nada de vermelho de reprovação, nada de "nível caiu", nada de barra de "atraso", nenhuma comparação com idade/série em NENHUMA tela da criança.
- **O tutor fala o diagnóstico como convite:** *"percebi que os amigos do 10 estão escorregadios — bora afiar eles rapidinho?"* (nomeia a lacuna com carinho e já oferece o caminho).

### 11.7 O que ele NUNCA faz
Não pune, não rebaixa `maxLvl`, não tranca tudo atrás de uma competência, não decide com IA em tempo real (determinismo, §2.9).

### 11.8 Como funciona na prática (a jornada que o esquema produz)

Para ver o esquema vivo — as três funções, as duas escadas e o fading operando juntos ao longo do tempo. Dois personagens: **Téo, 4 anos** (não sabe nada) e **Rocha, 6 anos** (já faz continhas fáceis).

**Téo — dia 1.** Cria o aventureiro (nome, idade, mascote). Uma "expedição do mapa" curtinha, disfarçada de brincadeira, descobre que ele está em F0 puro. O mapa abre com a Ilha das Quantidades 🌱. **Academia:** primeira missão — dar um osso para cada cachorro (N1.01), o Canhão de Balões para contar (N1.02), o Olhômetro piscando (N1.03). Tudo som e imagem, zero leitura, 6 minutos, fecha em festa. **Dojo:** ainda quase não aparece — no nível dele, o Jardim do Dojo traz só o Olhômetro-relâmpago, 2 minutos. Sem Oficina (não há lacuna, ele está aprendendo do zero).

**Téo — semanas depois.** Ele domina contagem e cardinalidade (👑), o grafo destrava os Amigos do 10 e a soma concreta. A Academia agora ensina "juntar" com rosquinhas; o número e o símbolo aparecem JUNTO das rosquinhas (concreto+abstrato sincronizado) e vão desbotando ao longo dos dias até sobrar só `2+1`. O Dojo começa a crescer: trilha FD de amigos do 10, blocos de 3 minutos. Um dia ele erra "qual tem mais" três vezes seguidas por causa da ilusão piagetiana → **Oficina invisível**: os próximos itens ficam lentos e concretos, com o gesto de parear, sem ele perceber que "mudou de lugar". Volta ao fluxo sozinho.

**Rocha — dia 1.** A expedição descobre que ele já conta, já soma até 10, mas conta nos dedos e não sabe os amigos do 10. O mapa abre já adiantado — várias ilhas de F0/F1 saem marcadas 👑 (ele provou que sabe), a fronteira 🔥 fica em "amigos do 10" e "ponte do 10". **Ele NÃO precisa refazer o bebê:** a idade não trava, mas a proficiência também não o obriga a repetir o que dominou. Onde ficou coroa cinza (presumido), a Academia testa de verdade uma vez; se passa, segue. Nos degraus que ele tem frágeis, a Academia ensina e o Dojo treina até virar reflexo.

**Rocha — curto/médio/longo prazo.** *Curto:* a ponte do 10 destrava a soma de 2 dígitos; a Academia ensina a conta armada com o bloco de dezena que explode; o Dojo (trilha PD-A) treina o procedimento até sair liso. *Médio:* multiplicação começa por "grupos de", vira array, vira tabuada; a fluência da tabuada acontece no Dojo (FD4→FD5), não na aula. Ele fica forte em multiplicação e fraco em subtração com troca — o Motor **não trava tudo:** avança na multiplicação e, em paralelo, abre Missão de Resgate 🔧 na subtração. *Longo:* divisão, frações, decimais — sempre o mesmo ciclo (aprende na Academia, automatiza no Dojo, conserta na Oficina), com o degrau de 4 dígitos abrindo só quando os pré-requisitos amadurecem. Aos 4 dígitos ele pode ter 9 anos; Téo, na mesma idade, estará onde a proficiência dele permitir — cada um no seu degrau × proficiência, nunca comparados.

**O aquecimento nunca sume.** Todo dia, mesmo o Rocha avançado começa a sessão com um degrau fácil já dominado (§6) — a ginástica leve que aquece a mente e dá a vitória inicial. Fácil demais entedia se for a sessão inteira; fácil no aquecimento acalma e prepara. É pedagogia, não enchimento.

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
- **Kinds de PRODUÇÃO** (arrastar, disparar, montar, compor): **não têm `options`.** A correção compara o ESTADO FINAL produzido com o alvo. Como não há distrator escolhido, o gerador declara uma regra de inferência — `misconceptionFrom(produzido, alvo) → tag | null` — que traduz o que a criança fez em diagnóstico (ex.: produziu 4 quando o alvo era 3 → `off-by-one-high`; distribuiu desigual na partição → `reparticao-desigual`). Sem isso, todo kind de produção fica invisível para o Radar.

### 12.5 Tema/skin: cosmético, coerente e por SESSÃO
O `themeContext` (pirata, fazendeiro, espaço) é 100% cosmético e **nunca** altera lógica ou resposta. Duas regras duras: (a) o tema é escolhido **no nível da sessão**, não por questão — trocar de pirata para fazendeiro a cada item vira caos visual e quebra a narrativa; (b) o tema fornece seu **vocabulário** (substantivo singular/plural, sprite, som) e o áudio compõe a partir dele — nunca hardcode "balões" num gerador que pode renderizar maçãs.

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

*Changelog: v1.0 (jul/2026) — unificação total pós-auditoria; renomeação Matemágica → SAGA; escopo 4-12; grafo de 84 competências (inclui N4.12, divisor de 2 dígitos, e divisão de decimais em N6.02 — fecha o algoritmo de divisão por completo).*
*v1.1 (jul/2026) — §11 expandido: Bússola de Posicionamento (11.3), Radar de Lacunas com tags de misconception e Missões de Resgate (11.4), regra Idade Nunca Trava (11.5), representação na tela (11.6); Dojo promovido a documento próprio (`DOJO_SAGA.md`); Manual Didático v2 completo integrado ao cânone.*
*v1.2 (jul/2026) — modelo de erro reformulado para DUAS CAMADAS (§8): resposta imediata leve na questão (preserva o fluxo, nunca trava) + remediação profunda disparada por PADRÃO via Radar (§11.4), entregue em pausa/fim de sessão/resgate. Princípio 5 refinado ("o fluxo é sagrado"). Correção da rigidez do escalonamento E1→E2→E3 por questão.*
*v1.3 (jul/2026) — regra do FADING (§5): o andaime some conforme a proficiência sobe (aula é exceção, não enfeite). §6: aula é feita de prática, não palestra; distinção entender-a-matéria vs entender-o-exercício com gatilhos separados. §11.2.4: Dojo como pilar autônomo com DUAS famílias de fluência (FD fatos + PD procedimentos armados).*
*v2.6 (jul/2026) — §14.5: controle de versão é infraestrutura crítica (git quebrado = parar tudo; commit por mudança; NADA é apagado fisicamente — `arquivo_morto` é túmulo, não incinerador). §14.6: regra de PARIDADE — migração nunca reduz o que a criança alcança; conta-se antes e depois, e o caminho antigo só se desliga com paridade atingida. §14.7: comportamento consertado vira especificação escrita + teste no mesmo commit, senão regride repetidamente. §10.12: especificação fechada do enquadramento do mascote (telinha retangular arredondada, cenário preenchendo o fundo, mascote inteiro e solto por cima, parado em repouso).*
*v2.5 (jul/2026) — cabeçalho corrigido para acompanhar o changelog (divergência entre topo e rodapé causou confusão real de versão). §14.4: contagem de teste não é evidência — o relatório exibe QUAIS suítes rodaram; runner exclui `arquivo_morto/`/`backup*/` (metade das suítes vinha de backup, inflando a contagem); as suítes do cânone (unlockEngine, composer, contrato, coreografia, invariantes) são nominalmente obrigatórias na lista. §12.8 item 3-quater: simulador exige LINHA DE BASE de plausibilidade — incoerência interna (perfil com lacuna mais rápido que sem lacuna) e deriva entre versões (18→55→73→367) indicam simulador ou ritmo quebrado, e exigem investigação antes de qualquer decisão.*
*v2.4 (jul/2026) — §14.4: toda ferramenta de auditoria/simulação tem comando no `package.json` que o DONO roda sozinho e vê a mesma saída — antídoto estrutural contra relatório inventado (terceira ocorrência); todo relatório abre com o comando que o produziu. §14.2: proibido ajustar a ASSERÇÃO para bater com a saída do código (teste vira espelho e a regra evapora) — quando teste e código discordam, decide-se pelo cânone. §10.12: o catálogo passa a detectar também deriva de nomenclatura (gerador servindo nó sob nome herdado); nome da função espelha o ID do nó.*
*v2.3 (jul/2026) — §8.1: `explain` NUNCA pode descrever uma misconception documentada do próprio nó (regra testável contra o Grafo; contraexemplo N1.05, que mandava comparar por espaço ocupado — a própria falha de conservação). §3.1: as três funções viram a NAVEGAÇÃO (barra de abas Jornada/Dojo/Oficina/Perfil) e ficam mapeados os nomes antigos (Jornada Mágica = Academia; Desafio Misto = Dojo modo Mestre). §7: demonstração é sobreposição com exemplo GÊMEO (outros números), com a contagem passo a passo virando dica e não aula repetida. §10.11: contrato de redesenho (só tokens + apresentação + assets; proibido clonar a árvore de telas). §10.12: mascote vive em palco de 3 camadas (fundo/ator/frente), fim da "bolinha"; catálogo passa a detectar duplicatas, órfãos e buracos.*
*v2.2 (jul/2026) — §8.4: a OFICINA GANHA FÍSICA PRÓPRIA (escada de 2 acertos por ser reaprendizagem; alvo é destravar e não coroar; dose proporcional à lacuna; teto de 3 resgates com escalada para o pré-requisito do pré-requisito) — descoberto pela simulação, que expôs 11 resgates para uma única lacuna. §8.1: `explain` nomeia a ESTRATÉGIA do Manual, nunca repete o enunciado nem contraria a natureza da habilidade (contraexemplo N1.03). §12.8 item 3-ter: simulação é estocástica — exige semente, versão e mediana/faixa sobre ≥30 execuções. §7.4 item 4-ter: sincronia com TTS só é real com um enunciado curto por batida visual ou áudio pré-gravado com marcas.*
*v2.1 (jul/2026) — §12.10: FRONTEIRA DA IA EM TEMPO DE EXECUÇÃO. Com IA conectada em runtime (dica do mascote e relatório dos pais), fica explícito: a aula é 100% offline e determinística, a fala autoral é o caminho primário e suficiente; a IA nunca substitui dica, decide progressão, gera exercício ou é pré-requisito para a aula rodar; pode ser extra pedido pela criança e relatório assíncrono aos pais; guarda-corpos obrigatórios (nunca dá resposta, validação, fallback autoral, chave de desligar, sem dado pessoal no prompt, teto de uso).*
*v2.0 (jul/2026) — §8.1: `explain` definido como DICA DE ERRO (nunca elogio, nunca entrega a resposta) com exemplo errado/certo — corrige vício encontrado nos três Padrões-Ouro. §7.4 item 4-bis: coreografia exige ao menos um passo com `show` não-vazio (fecha o falso verde da narração sem visual). §12.8 item 3-bis: simulação estreita não valida pedagogia — só vale como evidência se exercitar a orquestração inteira (Composer + Radar + Oficina + sonda de pré-req + avanço paralelo). §14.3: ferramenta nunca adultera arquivo de produção.*
*v1.9 (jul/2026) — §14.1 REGRA DA EVIDÊNCIA (nenhum resultado aceito sem prova bruta; protótipo se declara antes, nunca depois; números específicos exigem execução real) e §14.2 (corrigir para estar certo, nunca para passar no teste; correção em lote sobre decisão pedagógica passa por revisão humana contra o Manual). §12.3 refinado: competências perceptuais declaram `excecaoCPA` em vez de forjar variação, e alerta contra a variação de fachada que passa no teste e quebra a escada CPA.*
*v1.8 (jul/2026) — §12.8: DESCOBERTA EM LOTE — Definição de Pronto por competência, snapshots dourados anti-regressão, APRENDIZ SIMULADO (roda crianças falsas por dezenas de sessões e acha travamentos/ritmo/disparos do Radar em lote) e invariantes do sistema; mais a regra contra o falso verde (teste tem de verificar presença, não só validade).*
*v1.7 (jul/2026) — §7.4: CONTRATO DE COREOGRAFIA (a explicação é dado, não fiação): timeline declarado, API visual publicada por primitiva, player único, teste que quebra o build se a primitiva perder um comando (causa raiz do sumiço do destaque da Caixa Mágica) e modo coreografia na galeria. §10.12: tokens de movimento (só transform/opacity, 60fps no tablet real, animação decorativa vs pedagógica), mascotes com registro único e vocabulário de expressões, e catálogo de exercícios gerado automaticamente para o painel Admin.*
*v1.6 (jul/2026) — §10.11: arquitetura da CAMADA VISUAL — 5 camadas separadas (tokens semânticos → chrome → primitivas → skins → geradores), vocabulário único de estados visuais, lista do que macula o sistema, e a ordem de execução (passagem de tokens ANTES de massificar). Permite trocar toda a arte (ex.: pixel-art) mexendo num dicionário só.*
*v1.5 (jul/2026) — §12 expandido para a produção em massa: nível dita a REPRESENTAÇÃO CPA e não só a magnitude (12.3); kinds de SELEÇÃO vs PRODUÇÃO com contratos de correção distintos e `misconceptionFrom` para produção (12.4); tema/skin cosmético, por sessão e com vocabulário próprio (12.5); mapa mecânica→primitiva com as 4 primitivas faltantes (12.6); suíte de testes de contrato obrigatória antes de massificar (12.7).*
*v1.4 (jul/2026) — TRÊS FUNÇÕES (§3.1): Academia (aprender) / Dojo (treinar) / Oficina (recuperar), com o Motor Adaptativo acima das três. Oficina HÍBRIDA (§8.4): invisível para tropeço pequeno, Missão de Resgate visível para lacuna teimosa, sempre visível aos pais. §5: as DUAS escadas (competências × proficiência) — resposta a "quantos níveis tem uma conta". §6: Plano do Dia (pai não opera) + limite saudável que não engaiola quem quer mais. §11.8: simulação da jornada (Téo 4 / Rocha 6) no curto/médio/longo prazo. §11.9: estado de domínio multidimensional (compreensão/fluência/retenção/independência).*
