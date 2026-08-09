# 📖 A BÍBLIA DO SAGA
**Versão 3.4 · Agosto 2026 · Fonte única de verdade do projeto**
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

Os 4 motores acima são a máquina interna. Para a criança e para os pais, a experiência se organiza em **três funções distintas**, e o **Motor Adaptativo fica ACIMA das três, decidindo quando a criança faz cada uma** (ela nunca precisa escolher a própria sequência curricular; embora possa escolher treinar por conta própria):

```
                    MOTOR ADAPTATIVO  (decide o que, quando, quanto)
                            │
        ┌───────────────────┼───────────────────┐
     ACADEMIA             DOJO               OFICINA
     (aprender)          (treinar)          (recuperar)
```

- **🎓 ACADEMIA — aprender.** Onde a competência NOVA é ensinada pela primeira vez: trilha, missão do dia, CRA, microtutoria, animação, o "bizu" da conta, o conceito. É o modo Tutor. A criança progride por competência, e dentro de cada uma sobe a proficiência conceitual 1→5. **A Bússola/evidência pode reconhecer o que ela já sabe; ninguém é obrigado a refazer degraus por idade ou ritual.**
- **🥋 DOJO — treinar.** Onde o que já foi aprendido vira reflexo. NÃO ensina — mede, fortalece, mistura, automatiza, revisa, acelera. Duas famílias (fatos FD + procedimentos PD) e o Jardim do Dojo pré-simbólico. **Tem estado próprio de automaticidade (`dojoTracks`) e não move `lvl`, `maxLvl`, `dom` nem a coroa conceitual.** Spec: `DOJO_SAGA.md`.
- **🔧 OFICINA — recuperar.** Onde uma lacuna REAL é reconstruída, devagar e no concreto. É a "casa" da remediação profunda (Camada 2). **Ela é híbrida (§8.4):** para tropeço pequeno, é um ESTADO invisível — o exercício só fica mais concreto e lento dentro da própria tela, a criança não percebe "lugar" nenhum; para lacuna teimosa, vira um LUGAR visível e positivo — a Missão de Resgate ("o Guardião da Ponte precisa de você!"), uma ilha antiga com recompensa própria, nunca cara de castigo. Sempre visível no painel dos pais, mesmo quando invisível para a criança.

**A navegação tem CINCO abas.** As três funções continuam sendo o modelo mental; a quinta aba é a porta de entrada:
🦊 **Sensei** (a missão do dia — **aba inicial**, o app abre nela) · 🎓 **Jornada** (Academia) · 🥋 **Dojo** (treino) · 🔧 **Oficina** (só acende com resgate aberto) · 👤 **Perfil**.
O Sensei não é uma quarta função: é a **apresentação** do que o Motor Adaptativo montou para hoje. A criança abre o app e vê "sua missão", não um mapa.

**A rota principal é prescrita pelo Sensei.** A **Jornada é o mapa do conhecimento**, não o sequenciador principal; o Dojo pode ser prescrito pelo Sensei ou aberto manualmente dentro de repertório seguro; a Oficina é recuperação causal. A criança continua livre para explorar/treinar, mas treino livre não redefine o que o Tutor deve ensinar.

**As três funções são também a NAVEGAÇÃO do app.** Nada de lista vertical infinita dentro do perfil: a casca do aplicativo (app shell) tem uma barra fixa embaixo com as funções como abas — 🎓 **Jornada** (Academia, o mapa do conhecimento) · 🥋 **Dojo** (treino livre, revisão e o Desafio Misto) · 🔧 **Oficina** (só acende quando há resgate aberto) · 👤 **Perfil** (mascote, cenários, trocar de criança). O motor de jogo é renderizado *dentro* da aba em que a criança entrou e não sabe em qual está — ele só recebe questões. Assim se acrescenta ou reordena aba sem tocar em pedagogia.
- **Onde foram parar os modos antigos:** a "Jornada Mágica" **é** a Academia (mesmo conceito, nome de tela). O "Desafio Misto" vive como retrieval/interleaving opcional dentro do ecossistema de treino; nunca vira autoridade curricular. Nada se perde — deixam de ser itens soltos numa lista e viram lugares com identidade.

**Por que três e não dois:** separar "treinar" de "recuperar" impede o Dojo de perder o ritmo parando para dar aula a cada erro. O Dojo continua veloz; quem ensina é a Academia (primeira vez) e quem conserta é a Oficina (quando há lacuna). O Motor é quem manda a criança de um para o outro — a criança só sente o jogo fluindo.

---

## §4. HIERARQUIA E NOMENCLATURA

`Domínio → Strand → Competência → Microcompetência → Experiência → Sessão`

- **IDs novos:** `STRAND.NN` e `STRAND.NNx` para micros (`N3.07b`). Esquema completo, tabela de migração dos IDs velhos e as 90 competências: `GRAFO_DE_CONHECIMENTO_SAGA.md`. **IDs antigos (C0001, C_LOG2…) ficam proibidos em código novo** — só aparecem na tabela de migração.
- **Experiência** = um tipo de encontro com a competência: `tutor` (microtutoria), `guiada`, `autonoma`, `dojo`, `revisao`, `historia`, `chefao`. A mesma competência gera experiências diferentes conforme o nível.
- **Track (código)** passa a ser: *a materialização de UMA competência* — nunca mais um saco de 3 competências espremidas em 5 níveis (o defeito do "Contar" atual, corrigido na migração).

---

## §5. A ESCADA DE PROFICIÊNCIA (5 níveis por competência)

Unifica o CRA com o que o `progressEngine` já faz, **sem usar velocidade/Dojo como degrau de domínio conceitual**:

| Nível | Nome | Natureza | Quem faz |
|---|---|---|---|
| 1 | Tutoria | Concreto guiado — **Mão Fantasma** (I DO): o app resolve na frente da criança, narrando | O app |
| 2 | Concreto | Manipulável com apoio (WE DO): dicas ativas, dedo-guia disponível | Juntos |
| 3 | Pictórico | Representações estruturadas (moldura, barra, reta), apoio só ao errar | A criança |
| 4 | Abstrato | Símbolos; sem apoio visual por padrão (YOU DO) | A criança |
| 5 | Consolidação / generalização | Abstrato independente, variação/transferência e evidência autoral; **RT não é gate** | A criança |

**Regras de movimento (mantidas do código, agora canônicas):**
- Sobe na Jornada: 3 acertos seguidos. **RT não acrescenta streak nem acelera nível conceitual.**
- Desce: **3 erros** seguidos (nunca no aquecimento). Piso: nível 1.
- `maxLvl` (bolinhas) só sobe com **acerto no nível** — conquista nunca regride.
- **Domínio 👑 (`dom`) multidimensional:** no último nível, a janela de compreensão precisa satisfazer a regra autoral (`acertos/de`), com independência sem ajuda, a evidência específica da ficha quando exigida e confirmação em sessões espaçadas (`sessoes`, mínimo de 2 no runtime atual). **RT/`fluencyStreak` não participa da coroa conceitual.** A rota `legacy-crown` existe apenas para compatibilidade de saves/fluxos antigos sem `masteryAttempt`, não como norma nova de autoria.
- **Desbloqueio de nó do grafo:** todos os pré-reqs com `maxLvl ≥ 3` ou `dom` (igual ao `dominated()` do composer — uma regra só, em um lugar só: o futuro `unlock_engine`).

**O andaime desaparece conforme a criança sobe (regra do fading — evita a aula chata para quem já sabe).** A quantidade de ensino é função inversa da proficiência, e isso está embutido nos próprios níveis: no nível 1-2 há Mão Fantasma e apoio ativo (a criança está aprendendo); no nível 3 o apoio só aparece ao errar; no nível 4 é execução limpa sem apoio; no nível 5 é consolidação/generalização independente. **Fluência/automaticidade amadurece em paralelo no Dojo, em estado próprio.**

**Quantos "níveis" tem uma conta? DUAS estruturas que não compartilham a mesma escala.** Não existe uma lista única de 5 ou 7 níveis para "adição". Existem duas estruturas que se cruzam:
1. **A escada de COMPETÊNCIAS (os degraus de dificuldade real).** É a sequência de nós do Grafo, do fácil ao difícil. Para adição/subtração, por exemplo: juntar concreto → counting-on → amigos do 10 → ponte do 10 → decomposição mental → 2 dígitos sem reserva → 2 díg com reserva → 3 díg → 4 díg. Cada um é um NÓ separado (N3.01, N3.03, N3.07…), destravado por pré-requisito. É aqui que mora o "do 1+0 até 4 algarismos" — são ~13 degraus de conteúdo, não 5.
2. **A escada de PROFICIÊNCIA (1→5), DENTRO de cada competência.** Em cada degrau de conteúdo, a criança sobe do concreto guiado à consolidação/generalização conceitual. **Separadamente**, o Dojo usa faixas/força próprias para automaticidade.

**Como isso responde à sua pergunta:** um filho de 7 anos pode estar no degrau "2 dígitos com reserva" em proficiência 3, enquanto o degrau "4 dígitos" ainda está 🔒 travado (pré-requisito não cumprido) — e isso é normal e correto. O sistema SEMPRE sabe em que degrau × que proficiência a criança está, destrava o próximo só quando o atual amadurece, e pode continuar puxando degraus fáceis já dominados como aquecimento/revisão quando isso tiver função pedagógica. Um de 4 anos nem chega perto do degrau de 4 dígitos se os pré-requisitos ainda não existem; se uma criança pequena excepcionalmente demonstrar toda a cadeia, a idade não a segura. A progressão de procedimento no Dojo espelha repertórios seguros sem alterar o mastery conceitual.

### 5.1-bis O RELÓGIO É SILENCIOSO NA JORNADA — velocidade não tranca compreensão *(v3.1; reafirmado v3.4)*

O `rt` (tempo de resposta) é medido em **toda** resposta, sempre. Mas na Jornada ele alimenta **apenas a dimensão *fluência*** e a prescrição de treino. Ele **nunca**:

- bloqueia a subida de nível;
- bloqueia a abertura da competência seguinte;
- aparece como cronômetro visível;
- conta como erro;
- participa da coroa conceitual.

**Uma criança que resolve pela estratégia certa, devagar, DOMINOU o conceito.** Ela pode estar processando, ouvindo o áudio, com dificuldade motora, ou simplesmente ser mais reflexiva. Nenhuma dessas coisas é falta de compreensão.

| Onde | O relógio | Cronômetro visível |
|---|---|---|
| **Jornada (Academia)** | medido em silêncio, alimenta só a dimensão fluência | **nunca** |
| **Oficina** | medido em silêncio, ignorado na decisão de alta | **nunca** |
| **Dojo, antes dos 7 anos** | medido em silêncio | **nunca** |
| **Dojo, 7 anos ou mais** | medido | **opcional**, a criança liga e desliga |

**Consequência normativa para as fichas:** nenhuma ficha pode declarar tempo como critério de domínio conceitual. O campo `rt_alvo` da ficha existe para alimentar o `rt_max_s` da trilha FD correspondente no Dojo — **não** para reprovar a criança na Jornada. Ficha que declarar "os acertos precisam ter tempo abaixo de X" no bloco Domínio está em violação e deve ser corrigida.

**Nunca mostrar comparação com outras crianças.** Só "seu melhor tempo".

---

## §6. ANATOMIA DA SESSÃO — política atual pós-P22

**Norma atual:** a Aula do Dia tem **uma meta conceitual dominante** e a dose é decidida pelo Learner Model/Sensei conforme estado, fricção, revisão vencida, lacuna causal e evidência recente. **Idade/série não escolhem a dose nem podam o currículo**; servem apenas a UX, linguagem e limites confortáveis de sessão. Um bloco de fluência só entra quando houver prescrição de Dojo pedagogicamente segura — não existe quota obrigatória.

| Bloco possível | Função | Regra pós-P22 |
|---|---|---|
| 🔥 Aquecimento | ativar repertório forte / vitória inicial | curto e opcional, quando útil |
| 🧠 Revisão | retenção espaçada realmente vencida | entra por evidência, não por receita fixa |
| ⚔️ Fronteira | **meta conceitual dominante** | núcleo quando o estado pede ensino/continuidade |
| 🔧 Resgate/Oficina | reconstruir causa provada | pode ser micro-resgate ou **converter a própria Aula do Dia em Oficina** |
| 🥋 Fluência | automatizar fato/procedimento já seguro | só com prescrição explícita do Sensei/Dojo |
| 🎉 Fecho | encerrar com sucesso apropriado | preserva arco emocional sem criar currículo paralelo |

- **Se a Fronteira é uma competência em nível 1:** a sessão ABRE com a microtutoria (§7) antes de exigir execução autônoma — nunca jogar a criança num conceito virgem sem o I DO.
- **Baixa precisão conceitual não vira cronômetro.** O Sensei reduz representação, sonda pré-requisito ou abre Oficina. **Alta precisão + RT lento** é sinal de fluência e pode gerar Dojo prescrito sem reprovar domínio.
- **Fadiga/fricção alta reduz dose.** Domínio rápido pode aumentar variação/transferência em vez de simplesmente aumentar quantidade.

**Registro histórico da receita pré-P22 — preservado, mas NÃO normativo:**

| Bloco | O quê | F0 (4-5) | F1-F2 | F3-F4 |
|---|---|---|---|---|
| 🔥 Aquecimento | trilha forte, um nível abaixo; erro não pune | 1 | 2 | 2 |
| 🧠 Resgate | banco de erros + trilha "fria" (mais dias sem prática) | 1 | 2 | 2 |
| ⚔️ Fronteira | A competência-alvo (pré-reqs ok, menor precisão) — **aqui se aprende** | 3 | 4 | 4-5 |
| ⚡ Fluência | Dojo diário (fatos da FD ativa) | 1 | 1 | 1-2 |
| 🎉 Fecho | lógica/padrões — sair sorrindo | 1 | 1 | 1 |
| **Total** | | **7 (~5-8 min)** | **10 (~10-12 min)** | **11-12 (~15 min)** |

A tabela acima documenta a arquitetura que originou o composer e ajuda a entender seus blocos, mas **não governa mais quantidade por idade**. Também não autoriza misturar objetivos: o Sensei recalcula a missão por estado.

**A aula é feita de PRÁTICA, não de palestra.** Dos blocos possíveis, a Fronteira é o principal lugar de aprender; o resto existe quando tem função explícita. E mesmo na Fronteira, a explicação aparece na dose certa: microtutoria completa só quando a competência é virgem (nível 1) ou a Oficina a exige; nos níveis seguintes, a criança resolve e a ajuda entra pontual (Camada 1, §8) — o Tutor vai sumindo conforme ela sobe (fading, §5). O padrão é fluxo de exercícios; o ensino é a exceção oportuna.

**O Plano do Dia (o pai não precisa organizar nada).** Ao abrir, a criança encontra a missão do dia já montada pelo Motor — ela só toca em "Jogar". Nenhum adulto precisa escolher o que ela estuda; o sistema decide pela telemetria. O painel dos pais mostra, em uma linha, o que foi feito e o que vem — para acompanhar, não para operar.

**Limite saudável, sem engaiolar quem quer mais.** A sessão do dia fecha em vitória e o app NÃO empurra "mais uma" (sem padrões de vício, sem nag — coerente com o cuidado de bem-estar). Mas se a criança QUISER continuar, ela pode: o app oferece, por iniciativa dela, treino livre no Dojo, uma prévia do próximo degrau, ou refazer/reforçar o que já sabe. A regra: o app nunca puxa para prender; ele libera quando a criança pede. Um controle opcional dos pais pode definir um teto de tempo. Excesso de dificuldade nova é barrado (a fadiga vira ruído, não sinal — §11); mas treinar o fácil à vontade é sempre permitido, porque aquece e não cansa.

---

## §7. MICROTUTORIAIS (o momento de ensino)

Três camadas, todas offline:

1. **Mão Fantasma (I DO)** — obrigatória no nível 1 de toda competência: uma mão translúcida demonstra **o primeiro item**, narrada, e devolve a tela imediatamente. **Nunca resolve o exercício inteiro com a tela travada** (regra 7.1-bis). *(Status: conceito aprovado, componente `<GhostHand/>` ainda não construído — prioridade da migração, §13.)*
2. **TutSteps (aula narrada)** — o sistema de `tutorials.ts` (passos `say` + `show`), generalizado: **todo kind declara seus passos**. Padrão de roteiro (30–90s): *gancho* (1 frase que liga ao mundo da criança) → *demonstração* (worked example completo, narrado, com a cena mudando junto da voz — o padrão Meu Dia/Ciclo da Planta) → *"sua vez"* (1 item guiado).
3. **Exemplos com lacuna (faded examples)** — no nível 2-3, o app resolve 80% e a criança fecha o último passo; a lacuna cresce até o nível 4. É a ponte científica entre ver e fazer.

**Formato da demonstração: sobreposição com exemplo GÊMEO.** A demonstração (I do) aparece como um painel **por cima do próprio exercício**, resolvendo um caso **com outros números** — nunca o que a criança tem de responder (senão ela copia em vez de aprender). Nele o processo inteiro acontece à vista: o objeto sendo tocado/contado um a um, o numeral saltando a cada passo, a narração acompanhando. Terminada a demonstração, o painel sai e a criança faz o SEU caso. A contagem passo a passo ("um... dois...") permanece disponível como **dica**, se ela pedir ou errar — não como a aula inteira repetida.

**Regra da dose:** microtutoria completa só na estreia da competência e na remediação (§8). Reprises: versão de 15s. Criança que já sabe odeia ser reensinada.

### 7.1-bis A Mão Fantasma é exemplo ESMAECIDO, nunca filme *(v3.1)*

A Mão Fantasma **demonstra um item e sai**. Nunca resolve o exercício completo com a tela travada.

| Momento | O que a mão faz | Teto de tempo |
|---|---|---|
| Estreia da competência (nível 1) | resolve **o primeiro item**, narrando a intenção (*"um capacete para este bombeiro"*) | **10s** |
| Devolução | a tela **destrava no mesmo instante** e o próximo alvo **pulsa** | imediata |
| Se a criança erra o segundo item | a mão volta e demonstra **aquele item**, não o exercício | 8s |
| Nível 2-3 | a mão só entra a pedido, ou depois de 12s de inatividade | 8s |
| Nível 4-5 | não existe | — |

**Por que a regra é dura.** Criança de 4 a 5 anos tem foco contínuo de 4 a 6 minutos e urgência motora. Tela travada por 40 segundos produz **toque-spam** — o motor lê como desistência e a criança aprende que tocar não adianta. O andaime vira obstáculo.

**Contrato com o motor:** enquanto a Mão Fantasma estiver ativa, todo toque da criança é **absorvido sem penalidade** (nunca vira erro, nunca vira `skip`), e um toque na área ativa **encurta a demonstração** em vez de ser ignorado. Isso é a mesma regra da robustez gentil do §8.

**Estado de implementação:** `<GhostHand/>` ainda não foi construída. Esta é a especificação **antes** do código — o momento barato de acertar.

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

**3. Um único player executa todas as coreografias.** Ele lê o timeline, dispara o áudio e envia os comandos à primitiva. Uma implementação só, usada por todas as fichas/exercícios autorais — nunca lógica de tutorial dentro da primitiva (ela é "burra" de propósito) nem espalhada pelo GameLoop.

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

*Deslize vs. dificuldade (o motor decide o peso do toque):* erro rápido (`rt` baixo) num distrator qualquer = provável deslize → toque mínimo. **Lentidão isolada não é erro conceitual.** Distrator com tag de misconception repetida/padrão confirmado = dificuldade real → a dica do passo 2 já é a específica daquela confusão.

### 8.2 Camada 2 — remediação profunda (por PADRÃO, no momento certo)
A demonstração narrada, a Mão Fantasma (fazer junto) e o microtutorial vivem AQUI — e **não disparam na questão isolada**. Disparam quando o Radar de Lacunas (§11.4) detecta padrão, e são entregues no momento que respeita o fluxo: **numa pausa natural, no fim da sessão, ou como Missão de Resgate na sessão seguinte** — jamais engasgando a criança no meio de uma questão. É o "depois de alguns exercícios, verificar os erros e aí trabalhar pontualmente".
- Conteúdos (o QUÊ; o QUANDO é sempre §11.4): **dica** aponta a estratégia · **demonstração** = o app resolve um gêmeo narrando (mini Mão Fantasma), a criança assiste · **fazer junto** = a criança executa com o tutor sustentando.

### 8.3 Distratores são o sensor
Cada opção errada deve ser um erro típico do Grafo, etiquetado com sua tag de misconception (ex.: 42−38 oferece 16, tag `inverte-coluna`; 1/4+2/4 oferece 3/8, tag `soma-em-cima-e-embaixo`). Distrator aleatório é desperdício de diagnóstico — o distrator escolhido REVELA o que a criança pensou e é o que alimenta o Radar (§11.4) que dispara a Camada 2.

**Exceção — modo ensino:** na 1ª vez de um conceito e dentro de um microtutorial, o andaime Eu-faço → Fazemos-juntos → Você-faço é o esperado (a criança está aprendendo, não sendo avaliada). Andaime em aula ≠ punição por erro.

### 8.3-bis FILTRO MOTOR — erro de dedo não é erro de cabeça *(v3.1)*

**Nenhuma tag de misconception é aplicada a partir de um evento isolado de manipulação.** Antes de registrar qualquer erro vindo de arrasto, corte, alinhamento, giro ou posicionamento, o motor separa dois padrões:

| Padrão | Assinatura observável | O que o motor faz |
|---|---|---|
| **Erro motor** | mira o alvo certo e solta perto dele (dentro de 1,5× a área de snap) · solta fora de qualquer alvo válido · corrige sozinha na sequência · arrasto abortado antes de 200ms | **não pontua, não vira tag, não alimenta o Radar, não aparece no painel dos pais** |
| **Erro conceitual** | completa o gesto com precisão e escolhe o destino errado · repete o mesmo destino errado · ignora alvos vazios | pontua e recebe tag normalmente |

**Regra de ouro:** na dúvida entre os dois, o motor classifica como **motor**. Falso negativo (deixar passar um erro conceitual) custa uma questão. Falso positivo (acusar a criança de não entender quando ela só escorregou o dedo) contamina o Radar, dispara Oficina injusta e ensina a criança que ela é ruim naquilo.

**Contrato de UI que torna isto verificável.** Toda mecânica de arrasto DEVE oferecer: (a) **alternativa por toque** — tocar na origem, tocar no destino; (b) **snap** com tolerância generosa; (c) área de toque ≥ 80px (§10); (d) nenhum critério de tempo em tarefa motora. Ficha que exige precisão fina para demonstrar compreensão **não passa na Definição de Pronto** (§12.7).

*(Fichas com maior exposição: F07, F04, F19, F51, F45, F61, F78, F92.)*

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

### 9.3 A PRANCHETA — rascunho à mão por cima do exercício *(v3.2)*

Uma **camada transparente sobre o exercício**, onde a criança rabisca como faria no caderno. Botão ✏️ no canto. Abre, ela risca, fecha, responde.

**Por que é primitiva e não enfeite.** Conta armada de vários dígitos **não se faz de cabeça**. Uma criança sem onde rascunhar ou calcula na memória e erra por sobrecarga — não por não saber — ou desiste. O rascunho **é parte do procedimento**. Retirá-lo é como pedir a conta e proibir o papel.

| Regra | Porquê |
|---|---|
| Enquanto fechada, a prancheta **não existe para o input** | jamais captura toque destinado ao exercício |
| Fechar **não apaga** o rascunho | a criança volta e continua |
| O rascunho é descartado ao mudar de item | é rascunho, não histórico |
| Dedo, caneta e mouse se comportam **igual** | tablet e desktop não podem divergir |
| **Usar a prancheta NUNCA conta como ajuda** | não afeta a dimensão *independência* do domínio (§11.9). Rascunhar é fazer conta, não pedir socorro. |
| A sessão registra `usou_prancheta` | dado, não julgamento: mostra quando a conta ficou pesada demais para a cabeça |

**Ferramentas (mínimo viável):** lápis em 3 cores (grafite, azul, vermelho) · borracha · limpar tudo · desfazer. **Sem** formas, régua ou texto — é caderno, não editor.

**Onde aparece:** Dojo em faixas de procedimento (disponível e incentivada, pisca na estreia da faixa) · Dojo em faixas de fato (disponível, pouco usada) · Jornada nos níveis 3-5 de conta armada · **nunca** nos níveis 1-2 da Jornada (ali a criança manipula material) · **nunca** no Jardim do Dojo (4 anos não rascunha).

**Base de implementação:** o componente `TraceCanvas` já existe no repositório. A Prancheta é ele promovido a camada de sobreposição com paleta e borracha.

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

**Catálogo de exercícios (gerado, nunca escrito à mão).** Um script varre o `GENERATOR_MAP` e produz a tabela: competência → nível → kind → primitiva → skin → tem coreografia? → tem áudio? Essa tabela alimenta o painel Admin, onde cada linha é clicável e leva ao exercício rodando com suas anotações. **O catálogo é também um detector de entulho** e deve sinalizar três patologias: **duplicatas** (dois exercícios distintos fazendo a mesma coisa para a mesma competência), **órfãos** (exercício ou asset alcançável que não pertence a competência nenhuma — inclusive cenário de mascote fora do registro de temas), **buracos** (competência cujo único exercício é o fallback) e **deriva de nomenclatura** (gerador servindo um nó sob nome herdado — ex.: `gA1Dez` servindo `N2.01`). O nome da função geradora espelha o ID do nó (`gN2_01` → `N2.01`); nomes antigos só sobrevivem numa tabela de equivalência explícita, com data de aposentadoria. Sem essa varredura o conteúdo apodrece em silêncio. É o que permite enxergar as 90 competências de cima, achar buracos (exercício sem coreografia, kind repetido nos 5 níveis) e editar com segurança sem caçar arquivo.

---

## §11. O MOTOR ADAPTATIVO

### 11.1 O que ele lê (telemetria — campos já existentes)
`lvl, maxLvl, dom, streak, bad, ok/tot, rt` (média móvel 70/30), `helpClicks`, `skips`, `lastDay`, banco de erros (`bank`). Novo campo por implementar: `errKind` (qual distrator-tipo a criança escolhe — alimenta §8.3). **No estado pós-P22, o Learner Model também materializa evidência multidimensional e `dojoTracks`; RT permanece sinal de fluência, não de compreensão.**

### 11.2 O que ele decide
1. **Desbloqueio** (unlock_engine): regra única do §5. O mapa pinta ilhas: 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada.
2. **Seleção da fronteira** (composer, mantido): entre abertas e não dominadas, a de pior precisão; se tudo dominado, a próxima virgem do grafo.
3. **Revisão espaçada** (review_planner): intervalos **2 → 4 → 7 → 12 → 21 → 45 dias** por competência dominada (já especificados no código — agora executados de verdade). Falhou na revisão? Recolocar na fila de resgate e, se falhar 2×, reabrir como fronteira (decair `dom` visualmente é proibido — a coroa fica, o treino volta).
4. **Dojo:** pilar autônomo (a criança entra direto e treina à vontade) **e também prescritível pelo Sensei quando o estado de fluência pedir**; treina famílias de fluência/fatos/procedimentos e Jardim pré-simbólico. **Não existe quota diária obrigatória e o estado do Dojo não concede domínio conceitual.** Spec completa em `DOJO_SAGA.md`.
5. **Anti-travamento (a resposta ao teu medo):**
   - Sempre ≥ 3 strands com ilha aberta. Se o grafo afunilar, abrir a próxima raiz de outra strand.
   - Frustração detectada (2 sessões seguidas com precisão < 50% na mesma fronteira, ou `skips` ≥ 2) → trocar a fronteira de strand na próxima sessão + injetar microtutoria do pré-req mais frágil (menor `maxLvl` entre os pré-reqs).
   - **Nunca** exigir nível 5 para destravar o próximo nó (3 basta) — fluência amadurece em paralelo no Dojo, não segura a fila.
6. **Modo Gênio (existente como ideia):** o seletor de nível 🎯 permite pular com honestidade (bolinha só pinta com acerto — regra mantida). Para o pai explorar faixas acima da idade: liberar por strand, nunca global. **Isso não cria teto etário; é apenas atalho de exploração.**

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
3. **Ajuda como sismógrafo; RT como fluência:** `helpClicks` repetidos no mesmo tipo podem pedir microtutorial antes que o erro aconteça. **Acerto lento não conta como meio-erro conceitual e não alimenta o Radar por si só:** RT alto com compreensão correta alimenta fluência/Dojo. RT baixo combinado com erro pode ajudar a distinguir chute/deslize, mas não substitui a evidência causal da misconception.
4. **Ferrugem programada:** a revisão espaçada (11.2.3) é o radar do esquecimento — falha na revisão reabre treino, nunca rebaixa coroa.

**A Missão de Resgate (como o "voltar" funciona):** a competência frágil vira uma missão especial na ilha antiga — *"o Guardião da Ponte precisa de você de novo!"* — com 4-6 questões + microtutorial. **Enquanto isso a fronteira atual NÃO fecha:** a criança segue avançando em outra strand em paralelo (anti-travamento, 11.2.5). Resgate concluído → a competência de cima destrava de novo o degrau que tinha ficado difícil. Na prática: o app volta SEM a criança sentir que voltou.

### 11.4-bis O Radar é PROBABILÍSTICO — a tag é hipótese, não veredito *(v3.1)*

Uma tag não é um fato sobre a criança; é uma **hipótese que acumula força**. Cada ocorrência entra com peso:

| Evidência | Peso |
|---|---:|
| erro isolado | 0.2 |
| mesmo erro em **duas fichas diferentes** | 0.5 |
| erro com `rt` muito curto (chute provável ou automatismo errado a confirmar por padrão) | 0.7 |
| erro com padrão consistente dentro da mesma sessão | 0.9 |
| erro que **persiste depois da dica** (`explain` já foi dado e a criança repete) | 1.0 |

**Limiares de ação:**

| Soma acumulada | O que o motor faz |
|---|---|
| < 0.5 | nada. Registra e segue. |
| 0.5 a 1.5 | **Oficina invisível**: as próximas questões daquela competência ficam mais concretas, sem anúncio. |
| ≥ 1.5 | **Missão de Resgate visível** (§8.4), com o anti-loop de 3 do `rescuePlanner`. |

**Decaimento:** um acerto limpo na mesma competência subtrai 0.3 da soma. Sete dias sem reincidência zeram a hipótese. A criança de ontem não condena a de hoje.

**Linguagem obrigatória.** O sistema, o painel dos pais e qualquer log dizem *"há indício de que a criança está somando os denominadores"* — **nunca** *"a criança tem SOMA_DENOMINADOR"*. Tag é instrumento de diagnóstico, não rótulo de criança.

*(Esta seção substitui a aplicação de tag por evento único. Combina com o filtro motor do §8.3-bis: erro motor nem chega a gerar peso.)*

### 11.5 IDADE NUNCA TRAVA (a regra de ouro da progressão)
As faixas F0-F4 do Grafo são **calibragem, não catraca**: elas ajustam o palpite da Bússola, a duração confortável da sessão, o tom narrativo e o tamanho dos alvos — e NADA mais. O que abre e fecha competência é uma única coisa: **pré-requisito/evidência pela regra do grafo (§5)**. Consequências explícitas:
- O filho de 7 com lacunas de F0 treina competências de F0 — apresentadas com narrativa da idade dele (o resgate é missão de herói, não "voltinha pro jardim"; os temas visuais são por idade, o conteúdo é por evidência).
- A criança de 6 que voa entra em F2-F3 sem nenhuma trava etária. O sistema **nunca segura** por "não é da sua série": se os pré-reqs estão prontos, abre. (O Modo Gênio de 11.2.6 vira só um atalho de exploração para o pai — a progressão normal já não conhece teto de idade.)
- Estar "adiantado" ou "atrasado" não existe no vocabulário do app — nem nas telas, nem no painel dos pais. Existe fronteira: onde a criança está aprendendo AGORA. O painel dos pais mostra o mapa por strand (pode estar em F3 de números e F1 de geometria — e isso é NORMAL e dito assim).

### 11.6 Como tudo isso APARECE NA TELA
- **O mapa é o estado mental do motor, traduzido:** 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada · 👑cinza presumida · ✨ missão de resgate (ilha antiga brilhando com um "!").
- **Voltar nunca parece voltar:** resgate = missão especial com recompensa própria; recuo de nível dentro da competência = invisível (a próxima sessão simplesmente flui melhor).
- **Proibições visuais:** nada de vermelho de reprovação, nada de "nível caiu", nada de barra de "atraso", nenhuma comparação com idade/série em NENHUMA tela da criança.
- **O tutor fala o diagnóstico como convite:** *"percebi que os amigos do 10 estão escorregadios — bora afiar eles rapidinho?"* (nomeia a lacuna com carinho e já oferece o caminho).

### 11.7 O que ele NUNCA faz
Não pune, não rebaixa `maxLvl`, não tranca tudo atrás de uma competência, não decide com IA em tempo real (determinismo, §2.9), não usa RT para reprovar compreensão e não usa idade como teto curricular.

### 11.8 Como funciona na prática (a jornada que o esquema produz)

Para ver o esquema vivo — as três funções, as duas estruturas e o fading operando juntos ao longo do tempo. Dois personagens: **Téo, 4 anos** (não sabe nada) e **Rocha, 6 anos** (já faz continhas fáceis).

**Téo — dia 1.** Cria o aventureiro (nome, idade, mascote). Uma "expedição do mapa" curtinha, disfarçada de brincadeira, descobre que ele está em F0 puro. O mapa abre com a Ilha das Quantidades 🌱. **Academia:** primeira missão — dar um osso para cada cachorro (N1.01), o Canhão de Balões para contar (N1.02), o Olhômetro piscando (N1.03). Tudo som e imagem, zero leitura, 6 minutos, fecha em festa. **Dojo:** ainda quase não aparece — no nível dele, o Jardim do Dojo traz só o Olhômetro-relâmpago, 2 minutos. Sem Oficina (não há lacuna, ele está aprendendo do zero).

**Téo — semanas depois.** Ele domina contagem e cardinalidade (👑), o grafo destrava os Amigos do 10 e a soma concreta. A Academia agora ensina "juntar" com rosquinhas; o número e o símbolo aparecem JUNTO das rosquinhas (concreto+abstrato sincronizado) e vão desbotando ao longo dos dias até sobrar só `2+1`. O Dojo começa a crescer: trilha FD de amigos do 10, blocos de 3 minutos quando o Sensei prescreve ou a criança escolhe treinar. Um dia ele erra "qual tem mais" três vezes seguidas por causa da ilusão piagetiana → **Oficina invisível**: os próximos itens ficam lentos e concretos, com o gesto de parear, sem ele perceber que "mudou de lugar". Volta ao fluxo sozinho.

**Rocha — dia 1.** A expedição descobre que ele já conta, já soma até 10, mas conta nos dedos e não sabe os amigos do 10. O mapa abre já adiantado — várias ilhas de F0/F1 saem marcadas 👑 (ele provou que sabe), a fronteira 🔥 fica em "amigos do 10" e "ponte do 10". **Ele NÃO precisa refazer o bebê:** a idade não trava, mas a proficiência também não o obriga a repetir o que dominou. Onde ficou coroa cinza (presumido), a Academia testa de verdade uma vez; se passa, segue. Nos degraus que ele tem frágeis, a Academia ensina e o Dojo treina quando há necessidade de automaticidade.

**Rocha — curto/médio/longo prazo.** *Curto:* a ponte do 10 destrava a soma de 2 dígitos; a Academia ensina a conta armada com o bloco de dezena que explode; o Dojo (trilha PD-A) pode treinar o procedimento até sair liso. *Médio:* multiplicação começa por "grupos de", vira array, vira tabuada; a fluência da tabuada acontece no Dojo (FD4→FD5), não na aula. Ele fica forte em multiplicação e fraco em subtração com troca — o Motor **não trava tudo:** avança na multiplicação e, em paralelo, abre Missão de Resgate 🔧 na subtração. *Longo:* divisão, frações, decimais — sempre o mesmo ciclo (aprende na Academia, automatiza no Dojo quando necessário, conserta na Oficina), com o degrau de 4 dígitos abrindo só quando os pré-requisitos amadurecem. Aos 4 dígitos ele pode ter 9 anos; Téo, na mesma idade, estará onde a proficiência dele permitir — cada um no seu degrau × proficiência, nunca comparados.

**O aquecimento nunca vira catraca.** Todo dia pode começar com um degrau fácil já dominado quando o Sensei julgar útil — a ginástica leve que aquece a mente e dá a vitória inicial. Fácil demais entedia se for a sessão inteira; fácil no aquecimento acalma e prepara. É pedagogia, não enchimento — e não uma quota fixa por idade.

**O que os pais veem, sem precisar operar nada.** O Plano do Dia já vem montado; o painel mostra, por strand, onde cada filho está (Rocha pode estar em F3 de números e F1 de geometria — e isso é dito como normal), os fatos/passos frágeis pelo nome, e as dimensões de domínio (§11.9). O pai acompanha; o app conduz.

### 11.9 O estado de domínio conceitual é multidimensional; fluência é paralela
"Dominou" não é um sim/não. O Motor modela cada microcompetência em evidências que o runtime já coleta:
- **Compreensão** — janela de acertos no último nível segundo a regra autoral (`acertos/de`);
- **Independência** — sequência válida sem `helpClicks`;
- **Evidência da ficha** — condição específica quando a competência exige uma prova particular;
- **Retenção/estabilidade** — confirmação em sessões separadas pelo espaçamento exigido.

A coroa 👑 multidimensional exige essas dimensões conceituais maduras. **Fluência (velocidade + precisão + força do Dojo) é estado paralelo e NÃO participa da decisão da coroa.** O runtime ainda registra `fluencyStreak`, mas `updateMasteryEvidence` coroa por compreensão + independência + evidência autoral + sessões espaçadas.

Isso mata dois falsos diagnósticos: uma criança pode ter compreensão alta e fluência baixa (**entende mas é lenta → mais Dojo, sem reprová-la**), ou pode responder rápido sem evidência de conceito (**velocidade nunca compra mastery**). O painel dos pais mostra o estado conceitual e a fluência separadamente.

---

### 11.10 NÓS DE CONVERGÊNCIA — quando três caminhos se encontram

Dez competências do grafo exigem **três pré-requisitos** (N3.03, N3.04, N3.05, N3.07, N3.11, N4.08, N4.10, N6.02, GM.09, PE.03). São os pontos onde várias linhas de aprendizagem convergem — e por isso são os **maiores candidatos a travamento**: basta falhar em um dos três para o nó não abrir.

Isso não é defeito de modelagem: é a realidade do currículo. Adição com reagrupamento **realmente** exige dezena, fazer-10 e somar sem reagrupar. O que o sistema precisa é tratar esses nós com cuidado especial.

**As quatro regras dos nós de convergência:**

**1. Abertura parcial (dois de três).** Quando a criança atinge nível 3 em **dois** dos três pré-requisitos, o nó de convergência **abre em modo restrito**: só os níveis 1 e 2 (concreto guiado), e apenas nos micros que não dependem do pré-requisito faltante. Ela conhece o território antes de dominá-lo, e a lacuna vira motivação em vez de muro.

**2. O Radar prioriza a lacuna bloqueante.** Se dois pré-requisitos estão firmes e um está fraco, esse terceiro sobe ao **topo da fila de resgate** — ele não está bloqueando um nó qualquer, está bloqueando um cruzamento. O peso na fila é proporcional a quantos nós ele destrava.

**3. Nunca três frentes ao mesmo tempo.** O Composer **jamais** coloca os três pré-requisitos faltantes numa mesma sessão. Escolhe o mais próximo do domínio e trabalha nele até destravar. Atacar três frentes divide o esforço e nenhuma avança.

**4. Rota alternativa sempre visível.** Enquanto um nó de convergência está bloqueado, o mapa **destaca uma trilha paralela aberta** (outra strand). A criança nunca vê só cadeados — sempre há caminho, e ela sente que está avançando.

---

### 11.11 COMPETÊNCIAS DE ENRIQUECIMENTO — visitar sem obrigar

Algumas competências são **valiosas mas não são pré-requisito de nada** (ex.: GM.03, dinheiro). O grafo não as impõe; a criança poderia atravessar o currículo sem nunca encontrá-las.

**A solução não é criar dependência artificial.** Forçar "só faz multiplicação depois de dominar dinheiro" seria falso — e travaria a criança por um motivo que não existe.

**A solução é o Composer:**
- competências de enriquecimento entram na sessão como **bloco de variedade**, com frequência regular
- são **oferecidas, não impostas** — a criança pode adiar sem penalidade
- têm **critério de domínio mais leve** (3 de 4 em vez de 4 de 4), porque o objetivo é contato e utilidade, não fluência
- ficam **sempre visíveis no mapa**, com a coroa disponível — quem quiser dominar, domina

**Por que isso funciona:** a criança que se interessa por dinheiro vai lá e conquista a coroa. A que não se interessa não fica travada. **E ambas encontram a competência** — o que não acontecia quando ela era invisível.

---

### 11.12 PRIMEIRO CONTATO — a mesma competência, entradas de UX diferentes; domínio nunca reservado por idade

Uma competência disponível cedo (relógio, dinheiro) pode ser encontrada por uma criança de 5 anos e por uma de 8. **A mesma matemática e os mesmos pré-requisitos valem para as duas.** O que pode variar é a porta de entrada: linguagem, skin, ritmo, tamanho dos alvos, quantidade inicial de andaime e escopo da primeira exposição conforme o Learner Model — nunca uma catraca etária de domínio.

| | Entrada mais concreta/assistida | Entrada mais enxuta |
|---|---|---|
| Escopo | começa pelo mínimo conceitual que a evidência pede | pode entrar no escopo normal se a evidência sustenta |
| Andaime | Mão Fantasma/narração quando necessária | demonstração breve ou nenhuma |
| Ritmo | mais pausado quando o estado pede | ritmo padrão |
| Objetivo | **evidência real da competência** | **evidência real da competência** |

**Exemplo — o relógio (GM.04):** uma criança que ainda está construindo a ideia de hora encontra primeiro horas exatas, com o ponteiro dos minutos no 12. Outra que já demonstra isso pode avançar para meia-hora. A decisão vem da evidência/pré-requisitos, não do aniversário.

**Exemplo — o dinheiro (GM.03):** reconhecer moedas pode ser o primeiro contato; somar valores entra quando a criança já soma — o que o pré-requisito N3.09 garante.

**A regra dura:** idade escolhe apresentação e conforto de UX; **não reserva domínio pleno para o futuro**. Se a criança demonstrar os pré-requisitos e as evidências da ficha, pode dominar a competência. Uma criança mais velha em conteúdo inicial recebe a mesma matemática em uma casca apropriada à idade (§12.5-ter).

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

### 12.2-bis VOCABULÁRIO: NÍVEL (competência curricular) × FAIXA (Dojo) — não confundir

Duas estruturas coexistem no sistema e medem coisas diferentes. Usar a mesma palavra para as duas foi fonte real de confusão; ficam nomes distintos **e não formam uma escada compartilhada 1→5**:

| | **NÍVEL** — competência/Jornada | **FAIXA** — Dojo |
|---|---|---|
| Quantos | **1 a 5** | **1 a 10** |
| Mede | **proficiência conceitual/representação** | **dificuldade + automaticidade** do repertório seguro |
| Eixo | concreto → pictórico → abstrato → generalização | magnitude/família + FactStrength/ProcStrength/RT |
| Pergunta | *"ela ENTENDE e demonstra esta competência?"* | *"o que já entendeu está automático em qual faixa?"* |
| Estado | `Progress.lvl/maxLvl/dom/masteryEvidence` | `dojoTracks` e forças do Dojo |

**São independentes.** Uma criança pode estar no nível 5 conceitual de uma competência e ainda ter fluência baixa numa faixa do Dojo; também pode praticar manualmente a faixa atual sem isso mover `lvl`, `dom` ou o ponteiro adaptativo.

**Divisão de trabalho:** a **Jornada** mostra o mapa e oferece experiências conceituais; o **Sensei** prescreve o próximo passo; o **Dojo** automatiza em estado separado; a **Oficina** recupera a causa de uma lacuna. Dojo nunca “leva do nível 3 ao 5” da mesma escala curricular.

### 12.3 O nível dita a REPRESENTAÇÃO, não só o tamanho do número
Erro clássico de implementação: tratar `lvl` apenas como "números maiores". Isso destrói o CPA e deixa o fading (§5) sem nada para operar. **O nível muda primeiro COMO o conteúdo aparece, e só depois a magnitude; velocidade é dimensão separada do Dojo:**

| lvl | Representação (o que muda na tela) | Magnitude |
|---|---|---|
| 1 | Concreto guiado — objetos manipuláveis + Mão Fantasma narrando | mínima |
| 2 | Concreto autônomo — objetos manipuláveis, dica ativa | pequena |
| 3 | Pictórico — representação estruturada (moldura, barra, reta), sem objeto solto | média |
| 4 | Abstrato — só símbolos, sem apoio visual por padrão | cheia |
| 5 | Consolidação/generalização — abstrato independente, variação/transferência, evidência autoral | cheia |

Todo gerador declara qual `kind`/primitiva usar **por nível** (pode ser a mesma primitiva com props diferentes). Um gerador que devolve o mesmo `kind` nos 5 níveis está errado, salvo justificativa explícita.

**Nem toda competência tem forma abstrata — e forçar uma é pior que não ter.** Competências **perceptuais/fundacionais** (correspondência 1-a-1, subitização, canto numérico) não possuem versão simbólica: nelas os níveis 4-5 significam **independência, estabilidade e transferência dentro da própria habilidade perceptual**, não "virar símbolo" e nem "mais rápido". Nessas, o gerador declara `excecaoCPA: "perceptual"` com uma linha de justificativa, e a suíte aceita. Automaticidade/RT, quando pertinente, fica no Jardim/Dojo.

**Aviso contra a variação de fachada (armadilha da métrica).** O teste verifica que o `kind` varia; um script pode satisfazer isso mecanicamente e **destruir a pedagogia ao mesmo tempo** — por exemplo, saltar de `count` (concreto) direto para `plain` (abstrato) pulando o degrau pictórico. Isso passa no teste e quebra a escada. **A progressão de cada competência vem da escada CPA daquele assunto no `MANUAL_DIDATICO_SAGA.md`, nunca de uma regra mecânica.** Correção em lote por script é permitida para campos repetitivos (`howto`, `explain`, `audioPrompt`); a escolha de `kind` por nível é decisão pedagógica e passa por revisão humana contra o Manual.

### 12.3-bis DIVULGAÇÃO PROGRESSIVA — uma tela nunca mostra tudo de uma vez *(v3.1)*

Há fichas que reúnem **três ou mais representações simultâneas** — material dourado + conta armada + coluna ativa + vai-um + teclado + fala + duas animações. Isso é excelente para *ensinar* e péssimo para *avaliar*: a criança gasta a memória de trabalho decodificando a tela, não a matemática.

**Regra:** na **primeira exposição** de uma competência, a tela segue uma escada de revelação:

| Degrau | O que está visível |
|---|---|
| 1 | só o material concreto |
| 2 | material + a transformação acontecendo |
| 3 | material + a conta ao lado (ainda sem exigir a conta) |
| 4 | a conta, com o material só como apoio consultável |
| 5 | só a conta |

**A escada de revelação é INDEPENDENTE da escada de níveis.** Uma criança no nível 4 que volta pela Oficina reentra no degrau de revelação apropriado à dificuldade, sem perder o nível conquistado. São dois eixos, e ambos continuam separados da faixa do Dojo (§12.2-bis).

**Fichas obrigadas a declarar a escada de revelação:** F35, F39, F40, F68, F69, F76 — e qualquer ficha nova que empilhe 3+ representações.

**Teste de contrato:** a suíte falha se uma ficha marcada `revelacaoProgressiva: true` não declarar os degraus, ou se o nível 1 dessa ficha renderizar mais de duas representações ao mesmo tempo.

### 12.4 Dois tipos de kind, dois contratos de correção
- **Kinds de SELEÇÃO** (múltipla escolha, tocar a opção): a resposta certa aparece 1× nas `options`; cada distrator carrega sua tag de misconception importada do registro (`MisconceptionTag`, nunca string solta). O Radar lê a tag do que foi escolhido.
- **Kinds de PRODUÇÃO** (arrastar, disparar, montar, compor): **não têm `options`.** A correção compara o ESTADO FINAL produzido com o alvo. Como não há distrator escolhido, o gerador declara uma regra de inferência — `misconceptionFrom(produzido, alvo) → tag | null` — que traduz o que a criança fez em diagnóstico (ex.: produziu 4 quando o alvo era 3 → `off-by-one-high`; distribuiu desigual na partição → `reparticao-desigual`). Sem isso, todo kind de produção fica invisível para o Radar.

### 12.5 Tema/skin: cosmético, coerente e por SESSÃO
O `themeContext` (pirata, fazendeiro, espaço) é 100% cosmético e **nunca** altera lógica ou resposta. Duas regras duras: (a) o tema é escolhido **no nível da sessão**, não por questão — trocar de pirata para fazendeiro a cada item vira caos visual e quebra a narrativa; (b) o tema fornece seu **vocabulário** (substantivo singular/plural, sprite, som) e o áudio compõe a partir dele — nunca hardcode "balões" num gerador que pode renderizar maçãs.

### 12.5-bis Representações de fração: pizza para apresentar, barra para operar

Cada formato serve a um momento; trocá-los é erro.
- **Círculo (pizza/bolo) — níveis 1-2:** é a experiência de vida da criança, carrega significado concreto e afetivo. **Para apresentar a ideia de fração, é insubstituível.**
- **Barra — níveis 3+:** para comparar e operar. Comprimentos se comparam direto, ângulos não. E a barra tem a mesma forma da reta numérica — então 3/4 na barra e 3/4 na reta são visivelmente a mesma coisa.
- **A transição é exercício:** mostrar a mesma fração nos dois formatos lado a lado e perguntar "são iguais?" é o que ensina que fração é quantidade, não desenho.

### 12.5-ter CASCA VISUAL POR IDADE — a trilha é a mesma, a roupa não *(v3.1 · direção futura documentada)*

O grafo é governado por proficiência, nunca por idade (§11.5). Isso cria um caso previsível: **uma criança de 10 anos que ainda está em F1**. Se ela vir dinossauro, balão e mascote falando fininho, ela abandona — não por dificuldade, por vergonha.

**Solução: desacoplar a trilha de proficiência da casca estética.** A matemática é idêntica; muda a embalagem.

| Casca | Idade estética | Características |
|---|---|---|
| **Kids** | 4-6 | cores fortes, mascote presente, sons divertidos, voz cantada |
| **Explorer** | 7-9 | aventura, mapas, missões, mascote discreto |
| **Lab** | 10+ | minimalista, "enigma"/"laboratório"/"desafio", sem mascote, estatísticas pessoais, avatar |

A casca é escolhida pela **idade real**, nunca pela faixa da competência. Uma criança de 11 anos em N1.11 (amigos do 10) recebe a competência inteira, com os mesmos 5 níveis e a mesma ficha, dentro da casca **Lab**.

**Status: direção futura documentada**, como o modo caneta (§12.11-bis). Não bloqueia nada agora — a skin já é cosmética e por sessão (§12.5), então a casca entra como mais uma dimensão do mesmo mecanismo. Registrado aqui para que nenhuma ficha assuma vocabulário infantil como obrigatório.

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
Com 90 competências × 5 níveis, inspeção manual não escala. Uma suíte automática varre **todos** e falha se: a resposta não aparece exatamente 1× nas `options` (kinds de seleção); houver opções duplicadas; algum valor sair dos `params` do micro; faltar `howto`, `explain` ou `audioPrompt`; alguma tag não vier do registro `MisconceptionTag`; o `kind` não existir no catálogo §9; o `prompt` passar de 12 palavras em F0-F1; aparecer negativo antes de N7; ou o gerador devolver o mesmo `kind` nos 5 níveis. Um gerador que não passa não entra no `GENERATOR_MAP`.

### 12.8 DESCOBERTA EM LOTE (as 4 ferramentas que quebram o ciclo de tentativa e erro)

Sintoma a evitar: descobrir problemas **um de cada vez**, por acaso, olhando a criança usar. Isso é lento, caro e desmoralizante. As quatro ferramentas abaixo transformam descoberta acidental em descoberta **em lote**, antes de qualquer criança tocar na tela. Nenhuma produção em massa começa sem elas.

**1. Definição de Pronto (DoD) por competência.** Uma competência só é considerada pronta quando: tem gerador nos 5 níveis **com kinds variando** conforme o CPA (§12.3); tem `howto`, `explain` e `audioPrompt` em todos; tem distratores com tag do registro (seleção) ou `misconceptionFrom` (produção, §12.4); tem **coreografia declarada no nível 1** (§7.4); os params ficam dentro do YAML; e passa a suíte inteira. Sem DoD explícito, produzem-se 90 competências pela metade e ninguém sabe quais.

**2. Snapshot dourado (anti-regressão).** Cada gerador tem sua saída congelada com semente fixa. Qualquer alteração futura aparece como **diff visível** em vez de mudança silenciosa. É a vacina direta contra o caso do destaque da Caixa Mágica: o que funcionava e sumiu passa a quebrar o teste na hora.

**3. Aprendiz simulado (a ferramenta mais poderosa).** Um script cria crianças falsas com perfis definidos — *4 anos do zero*, *6 anos com lacuna em amigos do 10*, *tropeça em reagrupamento*, *acerta tudo rápido* — e roda cada uma por 30/60/90 sessões, respondendo por um modelo de probabilidade (inclusive escolhendo o distrator de misconception às vezes). O relatório responde em segundos o que levaria meses observando: **alguém travou? onde?** · quantas sessões até dominar X? · o Radar disparou demais ou de menos? · a composição da sessão ficou dentro da proporção? · alguma competência nunca foi visitada? · as trilhas do Dojo abriram em tempo razoável? · a dificuldade subiu suave ou em degrau? Isso troca "descobri porque meu filho travou" por "descobri em 1000 sessões simuladas".

**3-bis. Simulação estreita não valida pedagogia.** Um simulador que roda **uma competência isolada**, sem Composer, sem Oficina, sem sonda de pré-requisito e sem outras strands abertas, **não pode ser usado para concluir nada sobre travamento** — nesse recorte a criança com lacuna trava por construção, e isso não prova que o motor funciona; prova que o recorte é incompleto. Para valer como evidência, a simulação exercita a **orquestração inteira**: Composer montando sessões, Radar disparando Camada 2, Oficina resgatando, sonda do pré-requisito e avanço paralelo em outra strand (§11.2.5). Enquanto for estreita, o relatório declara a limitação em destaque.

**3-ter. Uma rodada não é evidência — a simulação é estocástica.** Se o mesmo perfil termina em 55 sessões numa execução e 73 noutra, o número isolado não significa nada. Todo relatório de simulação declara **semente, data/hora e versão dos motores**, e reporta **mediana e faixa sobre ≥30 execuções**, não uma amostra. Conclusão tirada de uma rodada só é anedota com aparência de dado.

**3-quater. O simulador precisa de LINHA DE BASE de plausibilidade.** Número de simulação só vale depois de comparado com o que se espera do mundo real. Se o resultado contraria a realidade pedagógica — ou oscila em ordem de grandeza entre versões — a conclusão não é "o motor é assim", é **"o simulador está errado OU o ritmo do produto está errado"**, e é obrigatório descobrir qual antes de decidir qualquer coisa com aquele dado. Dois sinais de alarme: **(a) incoerência interna** — um perfil COM lacuna dominar mais rápido que um perfil sem lacuna indica métrica medindo trajetos diferentes ou perfis mal configurados; **(b) deriva entre versões** — a mesma medida saltar de 18 → 55 → 73 → 367 sessões significa que ela nunca foi calibrada. Toda métrica declara **o que está medindo** (trajeto completo? só o nó final?) e sua **faixa plausível esperada**; fora da faixa, investiga-se antes de reportar.

**4. Invariantes do sistema (asserções que valem sempre).** Testes que rodam sobre estados aleatórios de progresso e falham se qualquer regra do cânone for violada: a criança **nunca fica sem nada para fazer** (§11.5); a sessão **sempre termina em item fácil** (§6); o Radar **não dispara em erro isolado**, só em padrão (§8.2); o Composer pega **uma única fronteira**; nenhum nó abre com pré-requisito abaixo do limiar; nenhuma trilha de fluência abre sem repertório conceitual seguro. **Prática manual no Dojo nunca move o ponteiro adaptativo do Tutor.**

**Regra contra o falso verde:** todo teste deve verificar **presença**, não apenas validade. Um teste de coreografia que passa porque *nenhum* gerador declara coreografia não está passando — está cego. Se a competência exige coreografia no nível 1, a ausência é falha, não silêncio.

### 12.9 Prompt-contrato para a IA de autoria
Ao pedir conteúdo novo a qualquer IA (Gemini/Claude), o prompt é sempre: *"Preencha o contrato YAML da competência X seguindo a Bíblia §12 e o Grafo. NÃO crie competências, IDs, kinds ou faixas de parâmetros novos. Se algo parecer faltar no grafo, PARE e reporte a lacuna."* — a IA como operária do contrato, jamais arquiteta improvisada. (As skills `.claude/skills/nova-trilha` e `nova-materia` devem ser atualizadas para apontarem para este documento.)

---

### 12.10 FRONTEIRA DA IA EM TEMPO DE EXECUÇÃO (o que a IA pode e não pode fazer com a criança na tela)

O princípio §2.9 (determinismo na aula, IA na autoria) continua valendo — mas agora que existe IA conectada em runtime (endpoint de dica e de relatório), a fronteira precisa ser explícita, senão a pedagogia vira loteria e o app deixa de funcionar sem internet.

**A aula é 100% offline e determinística.** As falas autorais — `howto`, `explain`, `tutorial` — vindas do Manual são o caminho **primário e suficiente**. A criança tem de conseguir aprender a lição inteira com o avião desligado. Se a IA cair, a rede falhar ou a chave expirar, **nada na experiência da criança pode mudar**.

**A IA em runtime NUNCA pode:** substituir a dica autoral · decidir progressão, nível, desbloqueio ou resgate · gerar exercício, distrator ou resposta ao vivo · ser pré-requisito para a aula rodar · introduzir espera perceptível no fluxo (o fluxo é sagrado, §8).

**A IA em runtime PODE:** ser um extra **pedido explicitamente pela criança** ("chama o mascote"), sempre depois de a dica autoral já ter sido oferecida; e gerar **relatório para os pais** — que é assíncrono, fora do fluxo da criança e de baixo risco.

**Guarda-corpos obrigatórios para texto de IA exibido a criança:** nunca entrega a resposta (mesma regra do `explain`, §8.1) · comprimento limitado · resposta validada antes de exibir (se vier fora do formato, cai no fallback autoral) · **fallback determinístico** sempre pronto · nenhum dado pessoal da criança no prompt · **chave geral de desligar** que deixa o app plenamente funcional sem IA · limite de uso por criança (proteção de custo) com resposta lúdica ao atingir o teto.

**Regra de decisão:** se um comportamento pedagógico depende da IA para existir, ele está no lugar errado — vira conteúdo autoral no Manual. A IA acrescenta calor, nunca estrutura.

### 12.11 ENTRADA POSICIONAL — quando o LUGAR da resposta é o conteúdo

Em 28 das 92 fichas históricas mapeadas nesta seção a resposta não é um valor: é **um valor num lugar** (conta armada, divisão longa, number bond, coordenadas, decimais com vírgula). A contagem global atual de fichas é 94; este número de 28 descreve a classe posicional levantada quando a seção foi criada. Nessas fichas, o método de entrada **é decisão pedagógica**, não detalhe de interface.

**A regra: a granularidade da resposta segue o que está sendo ensinado.**

| Nível | O que se ensina | Entrada |
|---|---|---|
| **1-2 concreto** | *a troca* — dez unidades viram uma dezena | **manipular o material.** A criança agrupa e troca com as mãos; o resultado emerge da ação. Não há digitação. |
| **3-4 abstrato** | *o procedimento* — coluna por coluna, direita→esquerda | **opções por coluna.** A coluna ativa acende e mostra 3 opções embaixo. Ela toca. Auto-avança para a próxima coluna. |
| **5 consolidação/generalização** | *o procedimento independente* e sua transferência | **resposta inteira/opções quando isso prova a ficha**, sem RT como gate conceitual. Prática cronometrada pertence ao Dojo. |

**Por que opções por coluna, e não digitação:**
- digitar dígito a dígito exige selecionar campo, e **campo selecionado é a maior fonte de bug** desta classe de exercício
- digitação é lenta e imprecisa no tablet, e pode contaminar a medida do procedimento
- **as opções exigem atenção real**: com distratores bem construídos (12 · 11 · 13), a criança precisa verificar de fato — não é chute
- cada opção errada carrega **tag de misconception** — o que a digitação livre não permite diagnosticar com precisão

**Por que ainda assim é coluna por coluna, e não resposta inteira:**
No nível 3-4, a competência **é o procedimento**. Responder o resultado inteiro de uma vez pula exatamente o que se está ensinando. A coluna ativa preserva a ordem direita→esquerda e força cada decisão.

**O vai-um / empréstimo:** também por toque, numa célula **acima e à esquerda** da coluna ativa, visivelmente **menor** (cerca de 60% do tamanho dos dígitos principais). O tamanho menor não é estética — sinaliza *"isto é anotação de trabalho, não parte do resultado"*, a mesma convenção do caderno.

**Regra de ouro desta seção:** nenhuma ficha exige que a criança **digite** algarismo por algarismo. Ou ela manipula (concreto), ou ela toca em opções (abstrato). **Se a meta for velocidade, a sessão é Dojo e usa estado/política próprios; o nível 5 conceitual não se torna cronômetro.**

### 12.11-bis MODO CANETA — direção futura documentada

A solução ideal para algoritmos armados é a criança **escrever à mão** na tela (dedo ou caneta) e o sistema reconhecer o traçado, com camada de desenho livre para rascunho, borracha e cores.

**Por que é a solução ideal:** elimina toda a mediação — nenhuma escolha de campo, nenhuma opção, nenhum teclado. A criança faz exatamente o que faria no papel. E o rascunho livre permite que ela use estratégias próprias, que hoje o app não consegue capturar.

**Por que NÃO agora:** reconhecimento de escrita infantil é problema difícil (traçado instável, números espelhados, dígitos ambíguos), e um falso negativo é devastador — a criança acertou e o app disse que errou. Implementar mal é pior que não ter.

**Fica registrado como expansão planejada**, não como pendência. Quando entrar, será **um modo adicional** nas fichas de algoritmo armado (F35, F39, F40, F69, F71, F76), sem substituir o modo por opções — que continua servindo ao Dojo quando a fluência exigir resposta rápida.

### 12.11-ter MODO DE RESPOSTA — alternativas hoje, escrita amanhã *(v3.2)*

Como a criança **entrega** a resposta é uma dimensão separada do que ela responde. Três modos, um contrato:

| Modo | Como funciona | Estado |
|---|---|---|
| **Alternativas** | 3 opções, uma correta, distratores com tag obrigatória (§8.3) | ✅ **padrão em tudo hoje** |
| **Teclado estruturado** | resposta inteira ou por coluna, conforme §12.11 | ✅ disponível onde o lugar é o conteúdo |
| **Escrita à mão** | a criança escreve o resultado no espaço da conta; o reconhecimento converte em número e compara | 🔜 direção documentada |

**Regras do modo escrita, quando for construído:**

1. É **opção por perfil**, ligada e desligada a qualquer momento, **em qualquer nível — inclusive o 1**. Não é recompensa por avançar.
2. **Falso negativo é inaceitável.** Traçado infantil mal reconhecido ensina a criança que ela errou quando acertou. Na dúvida, o sistema **pergunta** (*"você quis dizer 14?"*) em vez de reprovar.
3. Erro de reconhecimento **nunca** vira tag de misconception nem alimenta o Radar (mesma lógica do filtro motor, §8.3-bis).
4. Desligar o modo escrita **nunca** perde progresso: é forma de entrada, não conteúdo.
5. O modo escrita **não substitui a Prancheta** (§9.3). A Prancheta é onde ela **calcula**; o modo escrita é onde ela **responde**. Podem coexistir na mesma tela.

*(Complementa o §12.11-bis, que trata da direção geral do modo caneta. Este parágrafo é o contrato de comportamento.)*

---

## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO

### 13.1 O que a auditoria encontrou (julho/2026)
1. **Cinco+ "fontes únicas de verdade" concorrentes**, com currículos que se contradizem, e três cópias da árvore de docs (`AI_Studio_Lab/`, `backup_legado/`, `backup_repo/docs/`). O sintoma clássico de autoria multi-IA sem contrato.
2. **IDs incoerentes e colidentes:** `C0001` = Subitização no doc legado, mas = Contar 1-a-1 no código; `C0003` = Cardinalidade no doc, = Caixa Mágica no código. Cinco esquemas de ID convivendo. *(Resolvido: esquema novo + tabela de migração no Grafo §3.)*
3. **Grafo sem arestas:** `Track.prereqs` existe mas está vazio em quase tudo (3 trilhas de ~35 declaram pré-req); o `GraphValidator`/inter-ilhas admitidamente não existe. A "adaptatividade" real hoje é só o ZDP por trilha. *(Resolvido no papel: 88 nós com arestas; falta o unlock_engine.)*
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

---

## §15. PROTOCOLO DE EXPANSÃO — como crescer sem quebrar

O sistema foi projetado para crescer. Esta seção define **como**, para que nenhuma adição futura corrompa o grafo, duplique conteúdo ou crie conflito.

### 15.1 Os quatro tipos de adição

Antes de adicionar qualquer coisa, identifique **qual dos quatro** é o caso. Cada um tem custo e risco diferentes.

| Tipo | O que é | Toca o grafo? | Risco |
|---|---|---|---|
| **A. Variação de ficha** | outro exercício para uma competência que já existe | não | baixo |
| **B. Competência nova** | um conceito que o grafo ainda não cobre | **sim** | **alto** |
| **C. Mecânica nova** | uma primitiva de interação que não existe | não | médio |
| **D. Jogo** | atividade lúdica que treina competências existentes | não | baixo |

**Regra de ouro:** tente sempre resolver como **A** antes de considerar **B**. A maioria das ideias novas é uma variação, não uma competência.

---

### 15.2 TIPO A — Variação de ficha *(o caso mais comum)*

Uma competência pode ter **várias fichas**. N1.04 (contar) já tem duas: contar tocando e contar em arranjos. GM.03 tem duas: reconhecer dinheiro e dar troco.

**Quando é o caso certo:** você quer ensinar a mesma competência de outro jeito — outra mecânica, outro contexto, outra entrada.

**O que fazer:**
1. Código novo, sequencial (F96, F97...), **nunca reaproveitar código existente**
2. Declarar a **mesma competência** do grafo
3. Preencher as **9 seções** obrigatórias
4. Reusar tags de misconception existentes quando o erro for o mesmo; criar tag nova só se o erro for genuinamente diferente
5. Registrar no índice do bloco da faixa correspondente

**O que ganha:** o Composer passa a ter mais de uma opção para aquela competência, e alterna entre elas — **variedade sem conteúdo novo**.

**O que NÃO precisa:** nada no grafo, nada no Manual, nada no YAML.

---

### 15.3 TIPO B — Competência nova *(o caso perigoso)*

**Antes de qualquer coisa, rodar o teste de duplicação:**

```
Existe competência cujo NOME contenha o mesmo conceito?
Existe competência cuja DESCRIÇÃO cubra o que você quer adicionar?
Se você removesse a nova, alguma existente ficaria "incompleta"?
```

Se qualquer resposta for sim, **não é competência nova — é variação (Tipo A) ou ampliação de escopo de uma existente**.

> *Este teste existe porque o erro já foi cometido: sete competências foram adicionadas duplicando conceitos que já existiam (equivalência de frações, porcentagem, razão, probabilidade, múltiplos). Todas tiveram que ser removidas depois.*

**Se passou no teste, os cinco arquivos que precisam mudar — todos na mesma operação:**

| # | Arquivo | O que entra |
|---|---|---|
| 1 | `GRAFO_DE_CONHECIMENTO_SAGA.md` | seção `### ID — Nome` com strand, faixa, pré-req, kinds, erros típicos |
| 2 | `grafo_saga.yaml` | linha do nó |
| 3 | `grafo_saga.json` | **regerado a partir do YAML**, nunca editado à mão |
| 4 | `MANUAL_DIDATICO_SAGA.md` | a didática: por que trava, a escada, a primeira vez, os erros |
| 5 | ficha do bloco da faixa | pelo menos uma, com as 9 seções |

**As quatro verificações obrigatórias depois:**
```
1. contagem igual nos três arquivos do grafo (.md, .yaml, .json)
2. zero pré-requisitos inexistentes
3. zero ciclos
4. zero inversões de faixa (nenhum pré-req em faixa maior que o nó)
```

---

### 15.4 TIPO C — Mecânica nova

**Antes:** verificar o mapa §12.6. Das mecânicas existentes, **nenhuma serve nem com parâmetro diferente?**

Na maioria dos casos serve. `EmojiRow` com `arranjo: disperso` é uma mecânica visualmente diferente sem código novo. `TenFrame` com `modo: flash` idem.

**Se for realmente nova, ela precisa declarar:**
- a **API visual** que a coreografia pode chamar (`destacarFileira`, `piscarVazias`...) — sem isso, nenhuma ficha consegue coreografar
- os estados do vocabulário (ocioso, ativo, erro-suave, acerto, desabilitado, demo)
- entrada no mapa §12.6 com as competências que a usam

**Regra:** primitiva sem API visual declarada é primitiva que não pode ser usada em ficha nenhuma.

---

### 15.5 TIPO D — Jogo

Jogos são diferentes de fichas e **não seguem a escada CPA**.

**O que um jogo declara:**
- quais competências ele **treina** (não ensina — treina)
- o nível mínimo exigido em cada uma (nunca abaixo de 3: jogo não é lugar de aprender)
- se conta ou não para domínio (**por padrão, não conta**)

**A regra que protege:** jogo nunca substitui ficha. Uma competência cujo único conteúdo é um jogo está **descoberta** — porque jogo não tem os cinco níveis, não tem coreografia de ensino, e não diagnostica misconception com precisão.

---

### 15.6 O QUE NUNCA FAZER

1. **Adicionar competência sem o teste de duplicação** — foi assim que nasceram sete duplicatas
2. **Editar o grafo em um arquivo só** — os três precisam ser alterados na mesma operação, e o JSON regerado do YAML
3. **Editar o `grafo_saga.json` à mão** — ele é derivado, não fonte
4. **Criar ficha sem tag de misconception** — o Radar fica cego naquela competência
5. **Criar primitiva quando uma existente serve com outro parâmetro**
6. **Reaproveitar código de ficha aposentada** — códigos são únicos e permanentes, mesmo depois de a ficha sair de uso
7. **Adicionar pré-requisito "por segurança"** — cada pré-requisito a mais é uma porta a mais para travar. Só entra o que é genuinamente necessário

### 15.7 Checklist único de aceitação

Qualquer adição só é considerada concluída quando:

```
[ ] o tipo (A/B/C/D) foi identificado antes de começar
[ ] se B: passou no teste de duplicação
[ ] se B: os 5 arquivos foram alterados na mesma operação
[ ] as 3 contagens do grafo batem (.md = .yaml = .json)
[ ] zero órfãos, zero ciclos, zero inversões de faixa
[ ] a ficha tem as 9 seções
[ ] a ficha tem explain que NÃO elogia e NÃO entrega a resposta
[ ] a ficha tem pelo menos uma tag de misconception
[ ] a ficha tem critério de domínio
[ ] o código da ficha é novo e único
[ ] o índice do bloco foi atualizado
```

### 15.8 INVARIANTE DE CONTAGEM E TESTE DE DUPLICAÇÃO EXECUTÁVEL *(v3.1)*

**O número de competências é um invariante verificável, não uma frase em prosa.** Esta seção nasce de um incidente real: o changelog da v2.7 anunciou 11 competências novas; 4 sobreviveram à análise e 7 eram duplicatas — mas as 7 chegaram a virar nós no YAML, no JSON, no TypeScript e no grafo do repositório, e ali ficaram por semanas sem que nenhum teste reclamasse.

#### O que o auditor DEVE quebrar

1. **Contagem cruzada.** `count(grafo_saga.yaml.nodes)` = `count(GRAFO_DE_CONHECIMENTO_SAGA.md)` = `count(.json)` = `count(.ts)`. Divergência de um único nó = build vermelho.
   > **Convenção obrigatória para o parser.** IDs citados em texto histórico (candidatas rejeitadas, tabelas de migração, exemplos) ficam entre os marcadores `<!-- IDS_REJEITADOS_INICIO -->` e `<!-- IDS_REJEITADOS_FIM -->` e são **excluídos da contagem**. Sem essa convenção, a própria nota que documenta a rejeição faz o auditor recontar os nós rejeitados — foi o que aconteceu na primeira tentativa de escrever esta seção. Todo ID mencionado fora de uma linha de declaração de nó deve estar dentro do marcador ou escrito com tachado (`~~N5.07~~`).
2. **Prosa × realidade.** O número declarado no corpo desta Bíblia, do Manual, do Método e da Arquitetura Cognitiva tem de bater com a contagem real. **Trechos históricos explicitamente marcados preservam a contagem de sua época; afirmação corrente divergente é inválida.**
3. **Duplicata por assinatura.** Dois nós com **sobreposição semântica no nome** *e* **o mesmo conjunto de pré-requisitos** são duplicata presumida. O auditor lista e falha.
4. **Pré-requisito que contém o próprio nome.** Um nó cujo pré-requisito tem nome contido no seu (`N7.04 Porcentagem` ← `N6.03 Porcentagem`) é ciclo semântico disfarçado: IDs diferentes, mesma competência. O detector de ciclos do DAG não pega isso — este teste pega.
5. **Nó órfão de ficha.** Todo nó do grafo tem exatamente uma ficha responsável; toda ficha aponta para nó existente. Cobertura tem de ser 100%, nos dois sentidos.

#### A lista de espera

**Toda candidata a competência nova entra primeiro numa lista de espera, com o teste de duplicação registrado POR ESCRITO** (§15.3). Só depois vira nó.

**Rejeitar é uma decisão que se documenta, não se esquece.** Se a candidata for recusada, a recusa vai para o changelog **com o nó que já a cobria**. Foi a ausência dessa linha que permitiu que 7 duplicatas atravessassem o pipeline inteiro.

#### Registro histórico — as 11 candidatas de v2.7

| Candidata | Veredito | Nó que já cobria |
|---|---|---|
| `N2.06` Pares e ímpares | ✅ absorvida | — |
| `N2.07` Fatores | ✅ absorvida | — |
| `GM.10` Conversão de unidades | ✅ absorvida | — |
| `GM.11` Volume de prismas | ✅ absorvida | — |
| `N2.08` Múltiplos | ❌ rejeitada | `N4.11` múltiplos, divisores e primos |
| `N5.06` Somar frações (mesmo denom.) | ❌ rejeitada | `N5.04` adição e subtração de frações |
| `N5.07` Frações equivalentes | ❌ rejeitada | `N5.03` equivalência e comparação de frações |
| `N5.08` Comparar frações | ❌ rejeitada | `N5.03` (já inclui comparação) |
| `N7.03` Razão e proporção | ❌ rejeitada | `N6.04` razão e proporcionalidade |
| `N7.04` Porcentagem | ❌ rejeitada | `N6.03` porcentagem |
| `PE.05` Probabilidade e chance | ❌ rejeitada | `PE.03` + `PE.04` |

**Saldo: 84 + 4 = 88 competências.** *(Este era o número até a retificação de ago/2026 logo abaixo — ver P12.)*

#### Retificação de ago/2026 — o grafo passa a **89** na P12

A ficha **F04** ("Produzir Quantidade") declarava na §1 dela ser a `N1.09`. Não
é. Quatro arestas do grafo — `N1.12`, `N2.01`, `N3.03` e `AL.03` — dependem de a
`N1.09` significar *"contar até 20 e a partir de qualquer número"*, e todo o
material didático já a descrevia assim. Nenhuma delas precisa de *"me dá cinco"*;
todas precisam de contar além do dez.

São **duas competências reais**, e o próprio grafo já dizia isso ao listar
*"produzir conjunto: me dá N"* como micro (d) da `N1.04`. Dar a `N1.09` para a
F04 faria as quatro arestas mentirem em silêncio.

Cada uma ganhou seu nó: a `N1.09` continua sendo a contagem, e a F04 passou a ser
a **`N1.13` — Produzir quantidade** (F0, pré-req `N1.02` e `N1.04`).

> **Saldo histórico da P12: 88 + 1 = 89 competências.** Nenhuma ficha foi
> removida, nenhuma foi renumerada, e nenhuma aresta existente mudou de
> significado — o grafo **ganhou** um nó que já estava descrito no cânone sem ter
> casa. Registro completo em `codex/PLANO_DO_BLOCO_F0.md §13.1` (P12).

#### Retificação de ago/2026 — o grafo fecha em **90** na P15/P22

A auditoria do bloco F0 encontrou a colisão de IDs de F50: `GM.02` já era **Tempo cotidiano** e `GM.05` já era **Medidas padronizadas**. Massa/capacidade sem unidades era uma competência real sem casa própria.

Foi criado **`GM.12 — Massa e capacidade: comparação e conservação`** (F0, pré-req `GM.01`). `GM.05` passa a depender de `GM.12 + N2.02`. A sequência canônica vira: comparação visível → massa/capacidade sem unidades → medição padronizada.

> **Saldo atual: 89 + 1 = 90 competências. Este é o número canônico vigente.** Grafo/YAML/JSON/TS e cobertura autoral fecham em 90/90; as contagens 88 e 89 acima permanecem como registro histórico explícito.

#### Candidatas em lista de espera *(não são competências — não criar sem passar pelo §15.3)*

Levantadas nas auditorias externas de ago/2026, ainda **sem** teste de duplicação aprovado: moda/mediana/amplitude · plano cartesiano com 4 quadrantes · desigualdades · transformações geométricas (translação, rotação, reflexão) · funções entrada-saída · trilha de problemas de múltiplas etapas.
*Já cobertas, não recriar:* multiplicação e divisão de decimais (`N6.02`) · multiplicação e divisão de negativos (`N7.02`).

---


*Changelog: v1.0 (jul/2026) — unificação total pós-auditoria; renomeação Matemágica → SAGA; escopo 4-12; grafo de 84 competências (inclui N4.12, divisor de 2 dígitos, e divisão de decimais em N6.02 — fecha o algoritmo de divisão por completo).*
*v3.2 (ago/2026) — O DOJO GANHA CORPO. §9.3: **A PRANCHETA** — camada de rascunho à mão por cima do exercício (dedo, caneta ou mouse), promovida a primitiva porque conta armada de vários dígitos não se faz de cabeça; usar a prancheta NUNCA conta como ajuda e não afeta a dimensão independência. §12.11-ter: **MODO DE RESPOSTA** — alternativas (padrão hoje), teclado estruturado, e escrita à mão como direção documentada, com a regra dura de que falso negativo de reconhecimento nunca reprova nem vira tag. Documento novo no cânone: **`DOJO_TRILHAS_COMPLETAS.md`**, com as 5 trilhas de operação × 10 faixas (adição, subtração, multiplicação, divisão, frações e decimais), a janelinha de faixas, os distratores tagueados do Dojo, o `DojoErrorEvent` que liga o Dojo ao Radar, o inventário de fatos gerado, e o protocolo de alteração de faixa. Resolvida a contradição do registro comutativo (força compartilhada, dois tempos separados).*
*v3.1 (ago/2026) — RECONCILIAÇÃO CÂNONE × REPOSITÓRIO. Grafo fixado em **88 competências** (varredura de 84→88 em §4, §10.11, §12.7, §12.8, §13.1; anotação de rejeição no changelog v2.7). §13 recuperada: o cabeçalho da seção havia sumido na edição v2.7→v3.0 e duas referências apontavam para o vazio. §15.8: INVARIANTE DE CONTAGEM E TESTE DE DUPLICAÇÃO EXECUTÁVEL, com o registro histórico das 11 candidatas (4 absorvidas, 7 rejeitadas) e a lista de espera. Cinco correções pedagógicas vindas das auditorias externas: §5.1-bis o relógio é silencioso na Jornada (velocidade nunca tranca compreensão); §7.1-bis a Mão Fantasma é exemplo esmaecido e nunca trava a tela; §8.3-bis FILTRO MOTOR (erro de dedo não gera tag); §11.4-bis o Radar é probabilístico (peso de evidência, limiares, decaimento, linguagem de hipótese); §12.3-bis DIVULGAÇÃO PROGRESSIVA. §12.5-ter: casca visual por idade (Kids/Explorer/Lab) como direção futura documentada.*
*v3.0 (jul/2026) — §15: PROTOCOLO DE EXPANSÃO. Quatro tipos de adição (variação de ficha, competência nova, mecânica nova, jogo), cada um com procedimento e risco próprios. Teste de duplicação obrigatório antes de criar competência (o erro que gerou 7 duplicatas). Os 5 arquivos que mudam juntos, as 4 verificações depois, os 7 nuncas e o checklist único de aceitação. §12.11 reescrita: nenhuma ficha exige digitar algarismo por algarismo — manipular no concreto, opções por coluna no abstrato, resposta inteira na fluência. §12.11-bis: modo caneta como expansão futura documentada.*
*v2.9 (jul/2026) — §12.11: ENTRADA POSICIONAL. Em 28 fichas a resposta é um valor NUM LUGAR. Regra: níveis 1-2 manipulam material (a troca é a ação); níveis 3-4 usam OPÇÕES POR COLUNA com a coluna ativa acesa (não digitação — campo selecionado é a maior fonte de bug, e as opções carregam tag de misconception); nível 5 responde inteiro. NENHUMA ficha exige digitar algarismo por algarismo. Vai-um por toque, célula a 60% do tamanho, acima e à esquerda. §12.11-bis: MODO CANETA registrado como expansão futura — solução ideal, adiada porque falso negativo em reconhecimento de escrita infantil é devastador.*
*v2.8 (jul/2026) — §11.10: NÓS DE CONVERGÊNCIA (os 10 nós com 3 pré-requisitos) ganham abertura parcial com dois de três, prioridade do Radar na lacuna bloqueante, proibição de atacar três frentes na mesma sessão e rota alternativa sempre visível. §11.11: COMPETÊNCIAS DE ENRIQUECIMENTO — oferecidas pelo Composer com domínio mais leve, nunca impostas por dependência artificial. §11.12: PRIMEIRO CONTATO POR IDADE — o nível 1 tem duas entradas (reduzida para faixa inferior, normal para a faixa nominal), evitando que criança de 5 anos trave em relógio ou dinheiro. Grafo: corrigido pré-requisito excessivo de N3.03 (N2.03 simbólico → N1.05 comparação de quantidades) e conectadas 6 folhas órfãs (N3.10→N4.05, N3.06→N3.13, AL.02→AL.03, GM.02→GM.04, GM.06→GM.09, N2.05→GM.10).*
*v2.7 (jul/2026) — Grafo ampliado de 84 para 95 competências (11 novas: N2.06-08 pares/fatores/múltiplos, N5.06-08 operações e comparação de frações, N7.03-04 razão e porcentagem, GM.10-11 conversão e volume, PE.05 probabilidade), com Manual e YAML sincronizados. **[Anotação de ago/2026 — v3.1: das 11 anunciadas, apenas 4 sobreviveram à auditoria de duplicação (N2.06, N2.07, GM.10, GM.11). As outras 7 (N2.08, N5.06, N5.07, N5.08, N7.03, N7.04, PE.05) foram REJEITADAS por duplicarem nós existentes — ver §15.8. O grafo fecha em 88 competências, não 95.]** §12.2-bis: vocabulário NÍVEL (Jornada, 1-5, proficiência) × FAIXA (Dojo, 1-10, dificuldade) — eram chamados igual e confundiam. §12.5-bis: pizza para apresentar, barra para operar (regra anterior era categórica demais). §3.1: a navegação tem 5 abas, com o Sensei como porta de entrada.*
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
*v1.3 (jul/2026) — regra do FADING (§5): o andaime some conforme a proficiência sobe (aula é exceção, não enfeite). §6: aula é feita de prática, não palestra; distinção entender-a-matéria vs entender-o-exercício com gatilhos separados. §11.2.4: Dojo como pilar autônomo com DUAS famílias de fluência (FD fatos + PD procedimentos armados).*
*v1.2 (jul/2026) — modelo de erro reformulado para DUAS CAMADAS (§8): resposta imediata leve na questão (preserva o fluxo, nunca trava) + remediação profunda disparada por PADRÃO via Radar (§11.4), entregue em pausa/fim de sessão/resgate. Princípio 5 refinado ("o fluxo é sagrado"). Correção da rigidez do escalonamento E1→E2→E3 por questão.*
*v1.1 (jul/2026) — §11 expandido: Bússola de Posicionamento (11.3), Radar de Lacunas com tags de misconception e Missões de Resgate (11.4), regra Idade Nunca Trava (11.5), representação na tela (11.6); Dojo promovido a documento próprio (`DOJO_SAGA.md`); Manual Didático v2 completo integrado ao cânone.*


---

### v3.3 — GM.12 separa massa/capacidade de tempo e de unidades

A auditoria do bloco F0 encontrou uma colisão de IDs: F50 dizia GM.02 embora GM.02 seja **Tempo cotidiano**, e a P15 posterior tentou movê-la para GM.05 embora GM.05 já fosse **Medidas padronizadas**. A matriz passa a ter **90 competências** com o novo `GM.12 — Massa e capacidade: comparação e conservação` (F0, pré-req GM.01). `GM.05` passa a depender de GM.12 + N2.02. A progressão canônica é: comparação visível → massa/capacidade sem unidades → medição padronizada. Ver `AI_Studio_Lab/codex/DECISAO_P15_F50.md`.

### v3.4 — Sensei orquestra; Jornada mapeia; Dojo automatiza em estado separado

Reconciliação canônica pós-P22, sem alterar topologia do grafo: §5 remove a associação normativa “nível 5 = Fluência/Dojo”, alinha a descida ao runtime vigente (3 erros) e registra a coroa multidimensional real de `progressEngine` (compreensão + independência + evidência autoral + sessões espaçadas, sem RT); §6 troca dose fixa por idade por política adaptativa por estado, preservando a tabela antiga como registro histórico explícito; §11.4 impede RT lento de virar meio-erro; §11.9 separa mastery conceitual de `dojoTracks`; §11.12 elimina a reserva etária de domínio; §12.2-bis/§12.3/§12.11 separam nível conceitual de faixa/automaticidade do Dojo. Manual fecha em 90/90 com GM.12 e Método em 90 competências/94 fichas. Changelog e diagnóstico históricos foram preservados sem condensação.
