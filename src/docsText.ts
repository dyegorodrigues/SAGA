export const DOCS_TEXT = `# BÍBLIA DO SAGA

# 📖 A BÍBLIA DO SAGA
**Versão 1.0 · Julho 2026 · Fonte única de verdade do projeto**

> **Cláusula de supremacia.** Este documento + \`GRAFO_DE_CONHECIMENTO_SAGA.md\` + \`MANUAL_DIDATICO_SAGA.md\` + \`DOJO_SAGA.md\` + \`grafo_saga.yaml\` substituem TODOS os anteriores: \`BIBLE_PEDAGOGICA_UNIFICADA.md\`, \`MAB_CONSTITUICAO_MESTRE.md\`, \`MANUAL_PEDAGOGICO_MESTRE.md\`, \`biblia-do-matemagica.md\`, \`curriculo-mestre.md\`, \`mapa-mestre.md\`, \`grafo_competencias.md\`, \`catalogo-atividades.md\`, os 8 docs de didática soltos (\`adicao.md\`, \`subtracao.md\`, \`multiplicacao.md\`, \`divisao.md\`, \`fracoes.md\`, \`geometria.md\`, \`medidas.md\`, \`logica-e-padroes.md\` — absorvidos e costurados ao Grafo pelo Manual) e variantes espalhadas em \`AI_Studio_Lab/\`. Os antigos viram **arquivo histórico** (mover para \`AI_Studio_Lab/arquivo_morto/\`), nunca mais fonte. Nenhuma IA cria documento paralelo: se falta algo, **edita-se AQUI**.

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
8. **Contrato imutável do gerador:** \`gen(nível 1-5) → { kind, prompt, ..., options[], answer }\`, resposta presente exatamente uma vez, valores dentro das restrições do micro (Grafo). Herdada da Constituição antiga — permanece inviolável.
9. **Determinismo na aula, IA na autoria.** A lição roda offline e barata; a IA preenche contratos (§12), não inventa trilhas.
10. **Um prompt = uma mudança; teste nasce junto; ritual de fechamento** (build ✅ → test ✅ → commit → atualizar estado). Herdado do CLAUDE.md — permanece.

---

## §3. ARQUITETURA: OS 4 MOTORES + A CAMADA NARRATIVA

\`\`\`
GRAFO DE COMPETÊNCIAS  →  MOTOR PEDAGÓGICO  →  MOTOR DE GERAÇÃO  →  MOTOR ADAPTATIVO
(o que existe e em      (como se ensina:      (fabrica questões,   (lê telemetria, escolhe
 que ordem — o YAML)     CRA, tutoria,         tutoriais e sessões   o próximo passo, agenda
                         feedback, dose)       dentro dos contratos) revisão, destrava nós)
\`\`\`

**Camada narrativa (a "SAGA"):** por cima dos motores, o mundo do jogo. Mapeamento fixo: **Mundo = strand** (N1, N3, GE… cada um com bioma e cor próprios) · **Ilha = competência** · **Missão = sessão** · **Chefão = checkpoint de domínio (nível 5 + coroa 👑)**. O mapa mostra vários mundos abertos ao mesmo tempo — a criança VÊ que nunca está presa. Mascote, economia dupla (⭐ XP / 🪙 moedas), álbum e evolução permanecem como estão (funcionam e estão documentados no código).

### §3.1 As TRÊS funções (onde a criança está) — e o Motor acima de todas

Os 4 motores acima são a máquina interna. Para a criança e para os pais, a experiência se organiza em **três funções distintas**, e o **Motor Adaptativo fica ACIMA das três, decidindo quando a criança faz cada uma** (ela nunca precisa escolher; o sistema roteia — embora possa escolher treinar por conta própria):

\`\`\`
                    MOTOR ADAPTATIVO  (decide o que, quando, quanto)
                            │
        ┌───────────────────┼───────────────────┐
     ACADEMIA             DOJO               OFICINA
     (aprender)          (treinar)          (recuperar)
\`\`\`

- **🎓 ACADEMIA — aprender.** Onde a competência NOVA é ensinada pela primeira vez: trilha, missão do dia, CRA, microtutoria, animação, o "bizu" da conta, o conceito. É o modo Tutor. A criança progride por competência, e dentro de cada uma sobe a proficiência 1→5. Aqui o filho de 6 anos passa por TODAS as etapas para atingir domínio máximo — mesmo as fáceis que ele "já sabe", para consolidar e o sistema medir a proficiência real.
- **🥋 DOJO — treinar.** Onde o que já foi aprendido vira reflexo. NÃO ensina — mede, fortalece, mistura, automatiza, revisa, acelera. Duas famílias (fatos FD + procedimentos PD) e o Jardim do Dojo pré-simbólico. É o coração do uso diário: é onde a criança passa a maior parte do tempo. Spec: \`DOJO_SAGA.md\`.
- **🔧 OFICINA — recuperar.** Onde uma lacuna REAL é reconstruída, devagar e no concreto. É a "casa" da remediação profunda (Camada 2). **Ela é híbrida (§8.4):** para tropeço pequeno, é um ESTADO invisível — o exercício só fica mais concreto e lento dentro da própria tela, a criança não percebe "lugar" nenhum; para lacuna teimosa, vira um LUGAR visível e positivo — a Missão de Resgate ("o Guardião da Ponte precisa de você!"), uma ilha antiga com recompensa própria, nunca cara de castigo. Sempre visível no painel dos pais, mesmo quando invisível para a criança.

**Por que três e não dois:** separar "treinar" de "recuperar" impede o Dojo de perder o ritmo parando para dar aula a cada erro. O Dojo continua veloz; quem ensina é a Academia (primeira vez) e quem conserta é a Oficina (quando há lacuna). O Motor é quem manda a criança de um para o outro — a criança só sente o jogo fluindo.

---

## §4. HIERARQUIA E NOMENCLATURA

\`Domínio → Strand → Competência → Microcompetência → Experiência → Sessão\`

- **IDs novos:** \`STRAND.NN\` e \`STRAND.NNx\` para micros (\`N3.07b\`). Esquema completo, tabela de migração dos IDs velhos e as 84 competências: \`GRAFO_DE_CONHECIMENTO_SAGA.md\`. **IDs antigos (C0001, C_LOG2…) ficam proibidos em código novo** — só aparecem na tabela de migração.
- **Experiência** = um tipo de encontro com a competência: \`tutor\` (microtutoria), \`guiada\`, \`autonoma\`, \`dojo\`, \`revisao\`, \`historia\`, \`chefao\`. A mesma competência gera experiências diferentes conforme o nível.
- **Track (código)** passa a ser: *a materialização de UMA competência* — nunca mais um saco de 3 competências espremidas em 5 níveis (o defeito do "Contar" atual, corrigido na migração).

---

## §5. A ESCADA DE PROFICIÊNCIA (5 níveis por competência)

Unifica o CRA com o que o \`progressEngine\` já faz:

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
- \`maxLvl\` (bolinhas) só sobe com **acerto no nível** — conquista nunca regride.
- **Domínio 👑 (\`dom\`)**: 3 acertos seguidos no nível 5 **e** \`helpClicks = 0\` no nível **e** rt dentro da meta da trilha de fluência. (A regra completa da Bíblia antiga, agora obrigatória no código — hoje só o streak é checado.)
- **Desbloqueio de nó do grafo:** todos os pré-reqs com \`maxLvl ≥ 3\` ou \`dom\` (igual ao \`dominated()\` do composer — uma regra só, em um lugar só: o futuro \`unlock_engine\`).

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

1. **Mão Fantasma (I DO)** — obrigatória no nível 1 de toda competência: uma mão translúcida faz o exercício inteiro, narrado, com a tela travada. *(Status: conceito aprovado, componente \`<GhostHand/>\` ainda não construído — prioridade da migração, §13.)*
2. **TutSteps (aula narrada)** — o sistema de \`tutorials.ts\` (passos \`say\` + \`show\`), generalizado: **todo kind declara seus passos**. Padrão de roteiro (30–90s): *gancho* (1 frase que liga ao mundo da criança) → *demonstração* (worked example completo, narrado, com a cena mudando junto da voz — o padrão Meu Dia/Ciclo da Planta) → *"sua vez"* (1 item guiado).
3. **Exemplos com lacuna (faded examples)** — no nível 2-3, o app resolve 80% e a criança fecha o último passo; a lacuna cresce até o nível 4. É a ponte científica entre ver e fazer.

**Regra da dose:** microtutoria completa só na estreia da competência e na remediação (§8). Reprises: versão de 15s. Criança que já sabe odeia ser reensinada.

---

## §8. FEEDBACK E ERRO (duas camadas — o fluxo é sagrado)

**Princípio-mãe:** errar é parte de aprender; a criança tem de continuar SE MOVENDO. A resposta ao erro NUNCA para a sessão para dar aula a cada tropeço. Duas camadas separadas, que não se misturam: uma leve dentro da questão, outra profunda disparada por PADRÃO. Campos \`howto\` (COMO, falado na 1ª questão) e \`explain\` (PORQUÊ) permanecem obrigatórios em todo gerador.

### 8.1 Camada 1 — resposta imediata (leve, preserva o fluxo)
No máximo dois toques antes de seguir; a criança fica no comando o tempo todo:
1. **1ª tentativa errada** → auto-correção: feedback gentil que convida a tentar de novo ("olha de novo!") + esconder 1 opção absurda. Sem aula — a maioria dos erros é deslize e a criança conserta sozinha.
2. **2ª tentativa errada** → UMA dica estratégica falada (\`explain\` aponta o caminho, nunca a resposta).
3. **Ainda errou** → mostra a resposta com uma frase de porquê, marca o item/fato como frágil e **AVANÇA na hora**. Nada de demonstração longa no meio do fluxo. Nunca trava.

*Deslize vs. dificuldade (o motor decide o peso do toque):* erro rápido (\`rt\` baixo) num distrator qualquer = provável deslize → toque mínimo. Erro lento OU num distrator com tag de misconception = dificuldade real → a dica do passo 2 já é a específica daquela confusão.

### 8.2 Camada 2 — remediação profunda (por PADRÃO, no momento certo)
A demonstração narrada, a Mão Fantasma (fazer junto) e o microtutorial vivem AQUI — e **não disparam na questão isolada**. Disparam quando o Radar de Lacunas (§11.4) detecta padrão, e são entregues no momento que respeita o fluxo: **numa pausa natural, no fim da sessão, ou como Missão de Resgate na sessão seguinte** — jamais engasgando a criança no meio de uma questão. É o "depois de alguns exercícios, verificar os erros e aí trabalhar pontualmente".
- Conteúdos (o QUÊ; o QUANDO é sempre §11.4): **dica** aponta a estratégia · **demonstração** = o app resolve um gêmeo narrando (mini Mão Fantasma), a criança assiste · **fazer junto** = a criança executa com o tutor sustentando.

### 8.3 Distratores são o sensor
Cada opção errada deve ser um erro típico do Grafo, etiquetado com sua tag de misconception (ex.: 42−38 oferece 16, tag \`inverte-coluna\`; 1/4+2/4 oferece 3/8, tag \`soma-em-cima-e-embaixo\`). Distrator aleatório é desperdício de diagnóstico — o distrator escolhido REVELA o que a criança pensou e é o que alimenta o Radar (§11.4) que dispara a Camada 2.

**Exceção — modo ensino:** na 1ª vez de um conceito e dentro de um microtutorial, o andaime Eu-faço → Fazemos-juntos → Você-faço é o esperado (a criança está aprendendo, não sendo avaliada). Andaime em aula ≠ punição por erro.

### 8.4 A Oficina é híbrida (invisível para o pequeno, visível para o grande)
A remediação (Camada 2) mora na Oficina (§3.1), e ela aparece de dois jeitos, conforme o tamanho da lacuna:
- **Tropeço pequeno → Oficina INVISÍVEL (estado).** Sem troca de tela, sem "você foi para outro lugar". O motor só faz os próximos itens ficarem mais concretos e lentos dentro da própria cena (traz de volta o bloquinho, a animação, a dica). A criança sente apenas "o jogo ajudou um pouquinho agora" — a sensação Super Nintendo: a máquina trabalha sem aparecer. É a evolução natural do \`getScaffoldLevel\` que já existe.
- **Lacuna teimosa → Oficina VISÍVEL (lugar).** Quando o Radar (§11.4) confirma padrão persistente, nasce a **Missão de Resgate**: um lugar com cara de aventura numa ilha antiga (*"o Guardião da Ponte precisa de você!"*), tudo lento e concreto, 5 minutos, recompensa própria, e volta ao fluxo. Nunca tem cara de castigo, nunca usa vermelho de reprovação.
- **Sempre visível para os pais.** Mesmo quando foi invisível para a criança, o painel registra ("reforçou 'completar o 10' por 5 min"). O pai enxerga a máquina; a criança, só o jogo.

**Regra de decisão:** pequeno e pontual → invisível; persistente e conceitual (confirmado por padrão) → Missão de Resgate visível. O que separa os dois é o Radar detectar PADRÃO, não o erro solto.

**Regras de tom (mantidas):** acerto = elogio curto ("Isso!"), mais curto em streak; elogia esforço/estratégia, não "gênio"; transição rápida (250ms); erro nunca tem som agressivo; energia/mascote jamais punem.

---

## §9. CATÁLOGO DE KINDS (renderizadores de exercício)

Kind = o "molde de interação". Regra viva: **kind novo só com 2+ usos previstos** (Constituição). Todo kind declara: mecânica, competências que serve, comportamento de áudio, tutorial (TutSteps) e acessibilidade de não-leitor.

### 9.1 Existentes no código (validados — manter e especificar)
| Kind | Mecânica | Serve principalmente |
|---|---|---|
| \`plain\` | pergunta + 3-4 opções tocáveis (texto/emoji/numeral) | universal (o coringa) |
| \`math\` | expressão simbólica + opções | N2-N7 abstrato |
| \`count\` | tocar objetos 1 a 1 com trava e dedo-guia 👉 | N1.01, N1.04 (padrão-ouro) |
| \`sum\` / \`subvis\` | juntar grupos / esconder objetos, animado | N3.01-04 concreto |
| \`groups\` | grupos iguais em cena | N4.01, N1.05 |
| \`tenframe\` | moldura de 10 interativa | N1.08, N1.11, N3.07-08 |
| \`bond\` | círculo parte-todo (number bond) | N1.10-11, N3.05 |
| \`flash\` | quantidade pisca ~2s e some | N1.03 |
| \`pattern\` | sequência para continuar/corrigir | AL.02, AL.04, AL.07c |
| \`shapes\` | formas para reconhecer/classificar | GE.02-03, GE.07 |
| \`order\` | ordenar cartas/sequências | N1.07, N2.02, AL.03-04 |
| \`conserv\` | espalhamento animado (conservação) | N1.05c |
| \`tens\` | material dourado (barras/cubinhos) | N2.01, N2.04, N3.11-12a |
| \`money\` / \`clock\` | moedas-cédulas / relógio | GM.03-04, GM.06, N6.02b |
| \`picto\` | pictogramas/tabelas/barras | PE.01-02 |
| \`story\` | probleminha 100% narrado com cena | N3.10, N4.05, F3-F4 contexto |
| \`scene\`/\`journey\`/\`daypart\`… | cenas vivas narradas | GM.02, GE.01, tutoriais |
| \`rapid-fire\` | dojo cronometrado | todas as FD |
| \`singapore-bars\` | barras de Singapura | N3.10, N5, N6.04 |

### 9.2 Novos necessários (o backlog oficial, por prioridade)
**P1 — destravam F1-F2 (construir primeiro):**
- \`numberline\` — reta interativa com saltos animados. Serve 10+ competências (N1.12, N3.03-08, N6.01, N7.01-02…). **É o buraco mais grave do motor atual.**
- \`vertical\` — conta armada interativa, dígito a dígito, com reagrupamento animado e vírgula (N3.11-12, N4.08-10, N4.12, N6.02).

**P2 — destravam o mundo multiplicativo e frações:**
- \`array\` (arranjo retangular giratório; N4.02-08, GM.08) · \`drag-group\` (arrastar para repartir/classificar; N4.05, AL.01d) · \`frac-shade\` (partir/pintar frações; N5.*, N6.01, N6.03) · \`balance\` (balança da igualdade; AL.05, AL.08, GM.01c) · \`part-whole\`/\`fact-family\` (variações do bond) · \`build-number\` (compor números com placas/barras/vírgula) · \`trace\` (traçado do numeral com guia) · \`drag-match\` (parear).

**P3 — F3-F4 e medidas:**
- \`grid\` (malha/plano cartesiano) · \`measure\` (régua arrastável) · \`clock-set\` (arrastar ponteiros) · \`hundred-chart\` · \`bar-build\` · \`angle\` (transferidor) · \`area-model\` · \`ratio-table\` · \`chip-model\` (fichas ±) · \`geo-transform\` · \`blocks-3d\` · \`symmetry\` · \`input\` (**teclado numérico para resposta aberta** — a partir de F2 nem tudo pode ser múltipla escolha; distratores viram análise do valor digitado).

---

## §10. ÁUDIO-FIRST E UX DO NÃO-LEITOR (regras duras)

1. **Todo enunciado se auto-narra** ao carregar; o balão 🔊 sempre reproduz (com o \`lang\` correto — bug já corrigido, regra registrada).
2. **Toda opção é audível quando o conteúdo é simbólico/verbal** (\`audibleOptions\` + \`Option.say\`): a criança escolhe pelo SOM antes de ler. Emojis/imagens autoevidentes dispensam.
3. **\`sayTarget\`:** o alvo sonoro é falado e NUNCA escrito quando escrever entregaria a resposta (herdado do Português — vale para "toque no cinco").
4. **Botões de navegação falam.** Home, mapa, álbum: primeiro toque em ícone desconhecido = fala o nome; toque no rótulo = repete. Nenhuma tela do fluxo da criança exige leitura para navegar — **auditar a home atual com esse critério (pendência, §13)**.
5. **Toque corta a voz** e avança (fluidez — regra conquistada na 7ª rodada, inviolável).
6. **Misclick-lock** durante transições e primeiros 300ms de áudio (mantida).
7. **Touch targets ≥ 80px**, uma ação por tela, contraste alto (mantidas).
8. **Instruções ≤ 12 palavras** por frase falada em F0-F1; frases curtas, ritmo de conversa, zero jargão ("vamos JUNTAR" antes de "somar" — o símbolo chega com a voz apresentando).
9. **Voz:** TTS pt-BR como fallback permanente; banco neural (pipeline Luna: MP3 pré-gerados em \`public/audio/\` + fallback TTS) é a rota oficial. O hack de fonemas TTS segue **proibido** (causa raiz de bug já diagnosticada).
10. **Texto sempre presente, nunca exigido:** o rótulo escrito acompanha a fala (alfabetização incidental) — exceto quando viola a regra 3.

---

## §11. O MOTOR ADAPTATIVO

### 11.1 O que ele lê (telemetria — campos já existentes)
\`lvl, maxLvl, dom, streak, bad, ok/tot, rt\` (média móvel 70/30), \`helpClicks\`, \`skips\`, \`lastDay\`, banco de erros (\`bank\`). Novo campo por implementar: \`errKind\` (qual distrator-tipo a criança escolhe — alimenta §8.3).

### 11.2 O que ele decide
1. **Desbloqueio** (unlock_engine): regra única do §5. O mapa pinta ilhas: 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada.
2. **Seleção da fronteira** (composer, mantido): entre abertas e não dominadas, a de pior precisão; se tudo dominado, a próxima virgem do grafo.
3. **Revisão espaçada** (review_planner): intervalos **2 → 4 → 7 → 12 → 21 → 45 dias** por competência dominada (já especificados no código — agora executados de verdade). Falhou na revisão? Recolocar na fila de resgate e, se falhar 2×, reabrir como fronteira (decair \`dom\` visualmente é proibido — a coroa fica, o treino volta).
4. **Dojo:** pilar autônomo (a criança entra direto e treina à vontade) que também cede 1 bloco diário à aula; treina DUAS famílias de fluência — fatos (FD) e procedimentos armados multi-dígito (PD) — mais o Jardim do Dojo pré-simbólico. Spec completa em \`DOJO_SAGA.md\`.
5. **Anti-travamento (a resposta ao teu medo):**
   - Sempre ≥ 3 strands com ilha aberta. Se o grafo afunilar, abrir a próxima raiz de outra strand.
   - Frustração detectada (2 sessões seguidas com precisão < 50% na mesma fronteira, ou \`skips\` ≥ 2) → trocar a fronteira de strand na próxima sessão + injetar microtutoria do pré-req mais frágil (menor \`maxLvl\` entre os pré-reqs).
   - **Nunca** exigir nível 5 para destravar o próximo nó (3 basta) — fluência amadurece em paralelo no Dojo, não segura a fila.
6. **Modo Gênio (existente como ideia):** o seletor de nível 🎯 permite pular com honestidade (bolinha só pinta com acerto — regra mantida). Para o pai destravar faixas acima da idade: liberar por strand, nunca global.

### 11.3 A Bússola de Posicionamento (onde a criança COMEÇA)
O problema real: um filho de 6-7 anos entra no app — por qual competência começar? Perguntar a idade e chutar a faixa erra pros dois lados (quem tem lacunas afoga; quem está adiantado boceja). A resposta: **a idade dá o palpite inicial; a evidência decide.**

- **Formato:** a primeira sessão é a "Expedição do Mapa" — 10-15 min disfarçados de jogo de exploração, sem cara de prova. 2-3 itens por strand principal (N1/N3 primeiro, depois AL, GE, GM), começando no ponto que a idade sugere.
- **Movimento tipo busca binária:** acertou com folga → pula 2-3 competências à frente na strand; errou → recua até achar chão firme. Cada strand fecha quando encontra a **fronteira** (acerta aqui, hesita ali).
- **Regras duras:** nenhum feedback de erro na expedição (toda resposta ganha "hmm, interessante!" do explorador); sinais de frustração (Manual §Criança Real) encerram a strand na hora e assumem a fronteira conservadora; pode pausar e continuar amanhã; o resultado NUNCA é mostrado como nota — vira o mapa inicial (ilhas já 👑 pelo que demonstrou, 🔥 na fronteira).
- **Competências puladas na expedição ficam \`presumido_dom\`** (coroa cinza): valem como pré-requisito, MAS a primeira vez que aparecerem em revisão/resgate são testadas de verdade — se falharem, viram fronteira sem drama. Confiança com verificação.
- **Reposicionamento contínuo:** a Bússola nunca "termina". Cada entrada em strand nova dispara uma mini-expedição (3-4 itens). Errar é dado, nunca dano.

### 11.4 O Radar de Lacunas (como detecta ONDE está falhando — e resgata)
O motor não pergunta "quantos erros?"; pergunta **"qual é o PADRÃO do erro?"**. **Este radar é o gatilho da Camada 2 do §8** — a remediação profunda (demonstração, Mão Fantasma, microtutorial) só acontece quando um destes sensores acende, e é entregue numa pausa/fim de sessão/resgate, nunca no meio de uma questão. Erro solto na questão é tratado pela Camada 1 leve; é o PADRÃO que este radar captura que merece trabalho focado. Quatro sensores, em ordem de precisão:

1. **Tag de misconception no distrator (o sensor de ouro).** Todo distrator gerado carrega a tag do erro que representa (o Grafo define os "Erros" de cada competência; o gerador etiqueta: \`off-by-one\`, \`soma-em-cima-e-embaixo\`, \`inverte-coluna\`, \`pensamento-aditivo\`…). **2× a mesma tag em 5 questões = misconception ATIVA** → dispara o microtutorial específico daquela confusão (não o genérico da competência). É a diferença entre "errou divisão" e "está somando denominadores".
2. **Erro na competência ≠ lacuna na competência.** 2 erros no mesmo micro → o motor testa a HIPÓTESE pré-requisito: injeta 1-2 questões-sonda do pré-req mais frágil (menor maxLvl) **dentro da própria aula** (os slots de resgate do composer, §6 — já existem, agora com este gatilho). Sonda falhou → a lacuna é lá atrás: nasce uma **Missão de Resgate**.
3. **rt e ajuda como sismógrafo:** acerto com rt 3× acima do padrão da criança = domínio frágil (conta como meio-erro para revisão); helpClicks repetidos no mesmo tipo = pedir o microtutorial antes que o erro aconteça.
4. **Ferrugem programada:** a revisão espaçada (11.2.3) é o radar do esquecimento — falha na revisão reabre treino, nunca rebaixa coroa.

**A Missão de Resgate (como o "voltar" funciona):** a competência frágil vira uma missão especial na ilha antiga — *"o Guardião da Ponte precisa de você de novo!"* — com 4-6 questões + microtutorial. **Enquanto isso a fronteira atual NÃO fecha:** a criança segue avançando em outra strand em paralelo (anti-travamento, 11.2.5). Resgate concluído → a competência de cima destrava de novo o degrau que tinha ficado difícil. Na prática: o app volta SEM a criança sentir que voltou.

### 11.5 IDADE NUNCA TRAVA (a regra de ouro da progressão)
As faixas F0-F4 do Grafo são **calibragem, não catraca**: elas ajustam o palpite da Bússola, a duração da sessão, o tom narrativo e o tamanho dos alvos — e NADA mais. O que abre e fecha competência é uma única coisa: **pré-requisito dominado (regra do §5)**. Consequências explícitas:
- O filho de 7 com lacunas de F0 treina competências de F0 — apresentadas com narrativa da idade dele (o resgate é missão de herói, não "voltinha pro jardim"; os temas visuais são por idade, o conteúdo é por evidência).
- A criança de 6 que voa entra em F2-F3 sem nenhuma trava etária. O sistema **nunca segura** por "não é da sua série": se os pré-reqs estão 👑, abre. (O Modo Gênio de 11.2.6 vira só um atalho de exploração para o pai — a progressão normal já não conhece teto de idade.)
- Estar "adiantado" ou "atrasado" não existe no vocabulário do app — nem nas telas, nem no painel dos pais. Existe fronteira: onde a criança está aprendendo AGORA. O painel dos pais mostra o mapa por strand (pode estar em F3 de números e F1 de geometria — e isso é dito como normal).

### 11.6 Como tudo isso APARECE NA TELA
- **O mapa é o estado mental do motor, traduzido:** 🔒 travada · 🌱 aberta · 🔥 fronteira ativa · 👑 dominada · 👑cinza presumida · ✨ missão de resgate (ilha antiga brilhando com um "!").
- **Voltar nunca parece voltar:** resgate = missão especial com recompensa própria; recuo de nível dentro da competência = invisível (a próxima sessão simplesmente flui melhor).
- **Proibições visuais:** nada de vermelho de reprovação, nada de "nível caiu", nada de barra de "atraso", nenhuma comparação com idade/série em NENHUMA tela da criança.
- **O tutor fala o diagnóstico como convite:** *"percebi que os amigos do 10 estão escorregadios — bora afiar eles rapidinho?"* (nomeia a lacuna com carinho e já oferece o caminho).

### 11.7 O que ele NUNCA faz
Não pune, não rebaixa \`maxLvl\`, não tranca tudo atrás de uma competência, não decide com IA em tempo real (determinismo, §2.9).

### 11.8 Como funciona na prática (a jornada que o esquema produz)

Para ver o esquema vivo — as três funções, as duas escadas e o fading operando juntos ao longo do tempo. Dois personagens: **Téo, 4 anos** (não sabe nada) e **Rocha, 6 anos** (já faz continhas fáceis).

**Téo — dia 1.** Cria o aventureiro (nome, idade, mascote). Uma "expedição do mapa" curtinha, disfarçada de brincadeira, descobre que ele está em F0 puro. O mapa abre com a Ilha das Quantidades 🌱. **Academia:** primeira missão — dar um osso para cada cachorro (N1.01), o Canhão de Balões para contar (N1.02), o Olhômetro piscando (N1.03). Tudo som e imagem, zero leitura, 6 minutos, fecha em festa. **Dojo:** ainda quase não aparece — no nível dele, o Jardim do Dojo traz só o Olhômetro-relâmpago, 2 minutos. Sem Oficina (não há lacuna, ele está aprendendo do zero).

**Téo — semanas depois.** Ele domina contagem e cardinalidade (👑), o grafo destrava os Amigos do 10 e a soma concreta. A Academia agora ensina "juntar" com rosquinhas; o número e o símbolo aparecem JUNTO das rosquinhas (concreto+abstrato sincronizado) e vão desbotando ao longo dos dias até sobrar só \`2+1\`. O Dojo começa a crescer: trilha FD de amigos do 10, blocos de 3 minutos. Um dia ele erra "qual tem mais" três vezes seguidas por causa da ilusão piagetiana → **Oficina invisível**: os próximos itens ficam lentos e concretos, com o gesto de parear, sem ele perceber que "mudou de lugar". Volta ao fluxo sozinho.

**Rocha — dia 1.** A expedição descobre que ele já conta, já soma até 10, mas conta nos dedos e não sabe os amigos do 10. O mapa abre já adiantado — várias ilhas de F0/F1 saem marcadas 👑 (ele provou que sabe), a fronteira 🔥 fica em "amigos do 10" e "ponte do 10". **Ele NÃO precisa refazer o bebê:** a idade não trava, mas a proficiência também não o obriga a repetir o que dominou. Onde ficou coroa cinza (presumido), a Academia testa de verdade uma vez; se passa, segue. Nos degraus que ele tem frágeis, a Academia ensina e o Dojo treina até virar reflexo.

**Rocha — curto/médio/longo prazo.** *Curto:* a ponte do 10 destrava a soma de 2 dígitos; a Academia ensina a conta armada com o bloco de dezena que explode; o Dojo (trilha PD-A) treina o procedimento até sair liso. *Médio:* multiplicação começa por "grupos de", vira array, vira tabuada; a fluência da tabuada acontece no Dojo (FD4→FD5), não na aula. Ele fica forte em multiplicação e fraco em subtração com troca — o Motor **não trava tudo:** avança na multiplicação e, em paralelo, abre Missão de Resgate 🔧 na subtração. *Longo:* divisão, frações, decimais — sempre o mesmo ciclo (aprende na Academia, automatiza no Dojo, conserta na Oficina), com o degrau de 4 dígitos abrindo só quando os pré-requisitos amadurecem. Aos 4 dígitos ele pode ter 9 anos; Téo, na mesma idade, estará onde a proficiência dele permitir — cada um no seu degrau × proficiência, nunca comparados.

**O aquecimento nunca some.** Todo dia, mesmo o Rocha avançado começa a sessão com um degrau fácil já dominado (§6) — a ginástica leve que aquece a mente e dá a vitória inicial. Fácil demais entedia se for a sessão inteira; fácil no aquecimento acalma e prepara. É pedagogia, não enchimento.

**O que os pais veem, sem precisar operar nada.** O Plano do Dia já vem montado; o painel mostra, por strand, onde cada filho está (Rocha pode estar em F3 de números e F1 de geometria — e isso é dito como normal), os fatos/passos frágeis pelo nome, e as dimensões de domínio (§11.9). O pai acompanha; o app conduz.

### 11.9 O estado de domínio é multidimensional (não é só "acertou")
"Dominou" não é um sim/não. O Motor modela cada microcompetência em dimensões que ele já coleta em cru — só as torna explícitas no painel:
- **Compreensão** (acerta com apoio? entende o porquê?) · **Fluência** (velocidade + precisão — o \`rt\` e a força do Dojo) · **Retenção** (sobrevive à revisão espaçada dias depois?) · **Independência** (precisa de \`helpClicks\`?).
A coroa 👑 exige as quatro maduras (é o que a regra de \`dom\` já pede: streak no nível 5 + helpClicks 0 + rt na meta + sobreviver à revisão). Isso mata o "acertou uma vez = aprendeu": uma criança pode ter compreensão alta e fluência baixa (entende mas é lenta → mais Dojo), ou fluência alta e retenção baixa (rápido hoje, esquece semana que vem → mais revisão espaçada). O painel dos pais mostra as quatro barras por competência.

---

## §12. CONTRATOS DE GERAÇÃO (a IA preenche, não inventa)

### 12.1 Arquivo de competência (\`curriculum/NX.NN.yaml\`)
\`\`\`yaml
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
\`\`\`

### 12.2 Contrato do gerador (imutável — §2.8)
\`gen(lvl 1-5) → Question\` com: \`kind\` do catálogo §9; params dentro do micro ativo; resposta exatamente 1× nas options; distratores = \`erros_tipicos\` (aleatório só completa); \`howto\` + \`explain\` sempre; \`prompt\` ≤ 12 palavras faladas (F0-F1); nunca valores negativos antes de N7; função pura ~30 linhas com helpers (\`ri\`, \`pick\`, \`numOpts\`).

### 12.3 Prompt-contrato para a IA de autoria
Ao pedir conteúdo novo a qualquer IA (Gemini/Claude), o prompt é sempre: *"Preencha o contrato YAML da competência X seguindo a Bíblia §12 e o Grafo. NÃO crie competências, IDs, kinds ou faixas de parâmetros novos. Se algo parecer faltar no grafo, PARE e reporte a lacuna."* — a IA como operária do contrato, jamais arquiteta improvisada. (As skills \`.claude/skills/nova-trilha\` e \`nova-materia\` devem ser atualizadas para apontar para este documento.)

---

## §13. DIAGNÓSTICO DO ESTADO ATUAL E PLANO DE MIGRAÇÃO

### 13.1 O que a auditoria encontrou (julho/2026)
1. **Cinco+ "fontes únicas de verdade" concorrentes**, com currículos que se contradizem, e três cópias da árvore de docs (\`AI_Studio_Lab/\`, \`backup_legado/\`, \`backup_repo/docs/\`). O sintoma clássico de autoria multi-IA sem contrato.
2. **IDs incoerentes e colidentes:** \`C0001\` = Subitização no doc legado, mas = Contar 1-a-1 no código; \`C0003\` = Cardinalidade no doc, = Caixa Mágica no código. Cinco esquemas de ID convivendo. *(Resolvido: esquema novo + tabela de migração no Grafo §3.)*
3. **Grafo sem arestas:** \`Track.prereqs\` existe mas está vazio em quase tudo (3 trilhas de ~35 declaram pré-req); o \`GraphValidator\`/inter-ilhas admitidamente não existe. A "adaptatividade" real hoje é só o ZDP por trilha. *(Resolvido no papel: 84 nós com arestas; falta o unlock_engine.)*
4. **Trilhas-sanfona:** uma trilha comprime várias competências nos seus 5 níveis (Contar = 1-a-1 + cardinalidade + subitização + até 20), quebrando a semântica dos níveis CRA. *(Resolvido: 1 track = 1 competência; migração abaixo.)*
5. **Cobertura para até ~7 anos:** \`grade: "pre" | "ano1"\` no tipo \`Kid\`; nada de reagrupamento, multiplicação, divisão, frações, decimais (C0106/C0206 declarados e nunca implementados). *(Resolvido no papel: F2-F4 no Grafo.)*
6. **Tudo é múltipla escolha** e falta o kind mais importante da aritmética (reta numérica) e o da conta armada. *(Backlog §9.2, P1.)*
7. **Regra de domínio incompleta no código** (só streak; a Bíblia antiga exigia helpClicks=0 + latência — nunca implementado).
8. **Riqueza real a preservar:** composer com receita de aula excelente, ZDP com bônus de latência, telemetria já nos tipos, howto/explain, TutSteps, cenas vivas, economia dupla, mascote, skills de autoria, ritual de fechamento, lições de segurança do Firestore. **A fundação é boa — o problema era organização da autoria, não pedagogia.**

### 13.2 Migração em 6 fases (cada uma cabe em 1-3 sessões de trabalho)
- **M1 — Congelar e limpar.** Mover docs antigos para \`arquivo_morto/\`; commitar Bíblia+Grafo+YAML como únicos; atualizar CLAUDE.md e as skills para apontarem para cá. *Critério: grep por "fonte da verdade" retorna 1 lugar.*
- **M2 — Grafo executável.** Criar \`curriculum/*.yaml\` a partir do \`grafo_saga.yaml\` (F0-F1 primeiro); escrever \`unlock_engine.ts\` (regra §5) + testes; \`graphId\` novo em todas as tracks via tabela de migração (saves antigos migram por de-para).
- **M3 — Desfazer as trilhas-sanfona de F0.** Contar → N1.01/N1.04; canto → N1.02; etc. Progresso existente herda pelo de-para (nível atual vira nível da competência mais avançada da antiga trilha).
- **M4 — Kinds P1.** \`numberline\` e \`vertical\` + TutSteps + Mão Fantasma (\`<GhostHand/>\`) genérica. Com eles, F1 fecha inteira e F2 abre.
- **M5 — F2 no ar.** Competências N2.04–PE.02 geradas por contrato (§12.3), uma por sessão de autoria, teste junto.
- **M6 — Revisão espaçada e Dojo formais.** \`review_planner\` com os intervalos 2-4-7-12-21-45; trilhas FD; regra completa de domínio 👑; painel dos pais lendo o grafo (mapa de calor por strand).
- **F3-F4** entram depois de M6, cartucho a cartucho, pelo mesmo ritual — o grafo já está pronto esperando.

---

## §14. GOVERNANÇA
- **Mudança pedagógica** → edita Bíblia/Grafo primeiro, código depois (nunca o inverso).
- **Toda sessão de IA** começa lendo: CLAUDE.md (estado) → Bíblia (regras) → Grafo (conteúdo do dia). Termina com o ritual (§2.10).
- **Conflito entre documentos** = bug de documentação: resolver na hora, na fonte única.
- Versões: bump no topo deste arquivo a cada mudança material, com uma linha de changelog abaixo.

*Changelog: v1.0 (jul/2026) — unificação total pós-auditoria; renomeação Matemágica → SAGA; escopo 4-12; grafo de 84 competências (inclui N4.12, divisor de 2 dígitos, e divisão de decimais em N6.02 — fecha o algoritmo de divisão por completo).*
*v1.1 (jul/2026) — §11 expandido: Bússola de Posicionamento (11.3), Radar de Lacunas com tags de misconception e Missões de Resgate (11.4), regra Idade Nunca Trava (11.5), representação na tela (11.6); Dojo promovido a documento próprio (\`DOJO_SAGA.md\`); Manual Didático v2 completo integrado ao cânone.*
*v1.2 (jul/2026) — modelo de erro reformulado para DUAS CAMADAS (§8): resposta imediata leve na questão (preserva o fluxo, nunca trava) + remediação profunda disparada por PADRÃO via Radar (§11.4), entregue em pausa/fim de sessão/resgate. Princípio 5 refinado ("o fluxo é sagrado"). Correção da rigidez do escalonamento E1→E2→E3 por questão.*
*v1.3 (jul/2026) — regra do FADING (§5): o andaime some conforme a proficiência sobe (aula é exceção, não enfeite). §6: aula é feita de prática, não palestra; distinção entender-a-matéria vs entender-o-exercício com gatilhos separados. §11.2.4: Dojo como pilar autônomo com DUAS famílias de fluência (FD fatos + PD procedimentos armados).*
*v1.4 (jul/2026) — TRÊS FUNÇÕES (§3.1): Academia (aprender) / Dojo (treinar) / Oficina (recuperar), com o Motor Adaptativo acima das três. Oficina HÍBRIDA (§8.4): invisível para tropeço pequeno, Missão de Resgate visível para lacuna teimosa, sempre visível aos pais. §5: as DUAS escadas (competências × proficiência) — resposta a "quantos níveis tem uma conta". §6: Plano do Dia (pai não opera) + limite saudável que não engaiola quem quer mais. §11.8: simulação da jornada (Téo 4 / Rocha 6) no curto/médio/longo prazo. §11.9: estado de domínio multidimensional (compreensão/fluência/retenção/independência).*


# DOJO SAGA

# 🥋 DOJO SAGA — A Academia de Fluência

**Este documento é a especificação completa do Dojo — a semente original do projeto.** A ideia nasceu assim: um "Kumon digital" para treinar aritmética até o domínio absoluto. O projeto cresceu ao redor (o Grafo ensina, o Manual explica), mas o Dojo continua sendo o coração do treino: **o lugar onde o que foi COMPREENDIDO nas aulas vira REFLEXO**. Compreensão sem fluência trava a criança nos problemas grandes (a memória de trabalho lota calculando o básico); fluência sem compreensão é a decoreba que quebra. O SAGA exige as duas — em lugares diferentes: a aula ensina, o Dojo automatiza.

**O Dojo é um PILAR autônomo, não um apêndice da aula.** A criança entra nele direto (o templo no mapa) e treina o quanto quiser — como quem senta com o caderno do Kumon e "mete ficha". Ele TAMBÉM cede 1 bloco diário para a aula (Bíblia §6), mas isso é secundário: o principal é ser o ginásio onde se treina à vontade, no ritmo próprio.

**Fluência tem duas formas — e o Dojo treina as duas** (esta é a correção-chave sobre o Kumon, que fazia ambas nas folhas):
- **Fluência de FATO** — recordar \`7×8\` na hora, sem calcular (§3, trilhas FD).
- **Fluência de PROCEDIMENTO** — executar a conta armada de vários dígitos lisa, rápida e sem erro (§3-B, trilhas PD). É a espinha das folhas do Kumon: 2 algarismos, depois 3, depois 4, multiplicação e divisão longas.

E abaixo das duas, para os pequenos que ainda não leem numerais, o **Jardim do Dojo** (§7) treina a fluência pré-simbólica (o olhômetro, a mão, a moldura). Três camadas, uma escada natural: primeiro o olho (Jardim) → depois o fato (FD) → depois o procedimento (PD).

---

## §1. O KUMON DISSECADO — o que copiamos, o que corrigimos

O método Kumon acertou coisas que quase ninguém acerta. E errou coisas que só um sistema vivo consegue corrigir. O Dojo é a resposta ponto a ponto:

**Forças do Kumon (absorvidas):**
1. **Prática diária curta** — melhor 5 minutos todo dia que 1 hora no sábado. → Dojo: 1 bloco por sessão, 3-5 min.
2. **Incrementos minúsculos, do fato ao procedimento** — do 1+1 à divisão longa, em milhares de degraus quase imperceptíveis; as folhas treinavam tanto o fato solto quanto o algoritmo armado de vários dígitos. → Dojo: trilhas FD (fato) E trilhas PD (procedimento), ambas decompostas em micro-degraus (§4).
3. **Maestria antes de avançar** — só sobe quem domina. → Dojo: força por fato ≥ alvo antes do próximo degrau.
4. **Voltar ao fácil de propósito** — quando trava, recua para reconstruir confiança. → Dojo: rounds de aquecimento sempre abaixo do nível atual + recuo automático sem cerimônia.
5. **Autonomia e ritmo próprio** — cada criança na sua folha. → Dojo: nada de turma, nada de comparação.

**Fraquezas do Kumon (corrigidas):**
1. **Repetição cega e tediosa** — a folha não sabe QUAIS fatos você erra; repete tudo. → Dojo: rastreio POR FATO (§3): treina o que está fraco, não o que está forte. É a vantagem estrutural que papel nunca terá.
2. **Zero ensino conceitual** — Kumon treina, não explica; a criança automatiza sem entender. → Dojo: **nenhuma trilha FD abre antes da competência-mãe estar em nível ≥ 4 nas aulas** (a compreensão SEMPRE vem primeiro — regra de desbloqueio do Grafo, Apêndice A).
3. **Sequência fixa e igual pra todos** — ignora o padrão individual de erro. → Dojo: o Treino do Mestre monta cada sessão do estado real da criança (§5).
4. **Feedback binário e tardio** — certo/errado corrigido depois, sem estratégia. → Dojo: erro dispara a estratégia do fato na hora (o "quebra o bloco" do 7×6, a "ponte" do 8+5 — as MESMAS estratégias do Manual, agora em velocidade).
5. **Volume que esmaga** — folhas longas geram choro e desistência. → Dojo: rounds de 10-20 itens, término SEMPRE em vitória, sem lição de casa.
6. **Inútil para quem não lê nem conta** — Kumon começa onde a criança já opera símbolos. → Dojo: o Jardim do Dojo (§7) treina fluência PRÉ-simbólica (subitização flash, molduras) desde os 4 anos.

---

## §2. OS MODOS DO DOJO

O Dojo tem **quatro modos**. Nos dois primeiros o algoritmo decide tudo; nos dois últimos a criança tem controle. Todos valem para as duas famílias (FD fatos e PD procedimentos).

**🥋 Jornada (o treino diário padrão).** O Treino do Mestre monta o bloco do dia (§5) — equilibrado: um pouco de fronteira, revisão intercalada, fila quente. É o que entra na sessão da Academia (Bíblia §6) e o que a criança faz ao abrir o Dojo sem pedir nada. Senta e treina, como no tatame.

**🎯 Reforço (só os pontos fracos).** O algoritmo puxa APENAS as trilhas/itens de menor força — se a subtração está em 42%, vem subtração. É o modo para afiar o que está frágil, sem diluir com o que já é forte. Pode ser sugerido pelo Motor ou escolhido pela criança.

**⚡ Livre (a criança escolhe).** Ela pega qualquer trilha destravada, de qualquer família ("hoje quero tabuada do 7" ou "quero treinar divisão armada"). Autonomia real: dá senso de controle e serve para treinar para o "teste de amanhã". Dentro da trilha escolhida, o algoritmo ainda escolhe os itens (os fracos dela). Escolha do quê; ciência do como.

**🔥 Mestre (o desafio).** O algoritmo pega tudo o que ela já domina, mistura, aperta a dificuldade e cronometra — como uma prova de faixa ou um treino de atleta. Para a criança mais velha ou motivada que quer se testar. Fecha com recorde pessoal, nunca com comparação entre crianças.

Em todos: sem nota, sem ranking entre crianças, sem punição. O adversário é o próprio tempo de ontem.

---

## §3. O CORAÇÃO: DUAS UNIDADES DE FLUÊNCIA

O Dojo rastreia fluência em duas granularidades diferentes, porque treinar \`7×8\` e treinar \`4.037 ÷ 23\` são coisas distintas.

### 3-A. Força por FATO (trilhas FD)
A unidade não é "a tabuada do 7" — é **cada fato individual** (7×6 é um registro; 7×8 é outro). Cada fato tem:

\`\`\`
FactStrength {
  fact_id        // ex: "mul:7x6" (comutativos compartilham: 6x7 → mesmo registro)
  forca: 0-5     // 0 = nunca visto · 5 = reflexo consolidado
  rt_medio       // média móvel (70% histórico / 30% última)
  ultima_vez     // para o decaimento
  erros_seguidos
}
\`\`\`

**Como a força se move:**
- Acerto DENTRO do rt-alvo da trilha → +1 (máx 5).
- Acerto LENTO (acima do alvo) → mantém (contou, mas ainda não é reflexo).
- Erro → −1 (mín 0) e o fato entra na fila quente da sessão (reaparece 2-3 itens depois, e de novo no fim).
- **Decaimento:** força 4-5 sem treino por 14+ dias decai 1 ao reaparecer errado — a ferrugem existe e o sistema respeita (é o mesmo espírito da revisão espaçada da Bíblia §11, na escala do fato).

**rt-alvo por trilha** (do Grafo, Apêndice A): FD1-FD2 3s · FD3-FD4 4s · FD5-FD6 5s · FD7-FD8 6s. Nos primeiros degraus de cada trilha o alvo é 2× mais folgado e aperta gradualmente — a velocidade é conquistada, nunca exigida de partida.

**Um fato "vale faixa"** quando força = 5. Uma trilha FD avança de degrau quando ~90% dos fatos do degrau estão em força ≥ 4.

### 3-B. Força por PROCEDIMENTO (trilhas PD)
Um algoritmo armado não é "um fato" — é uma sequência de passos aplicada. Não se mede por recordação instantânea (ninguém faz \`4.037÷23\` em 3s), e sim por **precisão + fluidez**: a conta sai certa, e sai sem travar em cada passo. A unidade é o **tipo de procedimento** (ex.: \`sub:3dig:zeros\`, \`mul:x2dig\`):

\`\`\`
ProcStrength {
  proc_id        // ex: "div:1dig:resto", "mul:x2dig"
  precisao       // média móvel da taxa de acerto do RESULTADO final (70/30)
  passo_fraco    // qual passo mais falha (opcional): "reserva", "quociente_zero", "alinhar_virgula"
  tempo_medio    // relativo ao alvo do degrau (folgado no início, aperta)
  forca: 0-5     // derivada de precisão sustentada dentro do tempo-alvo
  ultima_vez
}
\`\`\`

**Como a força se move:**
- Resultado certo dentro do tempo-alvo → +1 (máx 5).
- Certo mas lento → mantém (executa, ainda não flui).
- Erro → −1 e o procedimento volta à fila quente. **Onde o passo falhou é registrado** (\`passo_fraco\`) — é o que permite a intervenção cirúrgica (§5), não "refaz tudo".
- **Decaimento** igual ao dos fatos (a mão enferruja como a memória).

**tempo-alvo** cresce com o número de passos, não é fixo (uma divisão longa pode ter alvo de 40-60s e ainda ser "fluente"). O que importa é a curva caindo, não um número mágico.

**Um procedimento "vale faixa"** quando força = 5 (precisão ~95%+ no tempo-alvo). Uma trilha PD avança de degrau quando o degrau atual está em força ≥ 4.

**A diferença que importa:** no fato, o inimigo é a lentidão da recordação; no procedimento, o inimigo é o erro num passo específico (esquecer a reserva, engolir o zero do quociente, desalinhar a vírgula). Por isso o \`passo_fraco\` existe — ele conecta direto à estratégia CPA daquele passo no Manual.

---

## §4. OS DEGRAUS — as trilhas decompostas (o espírito Kumon, granulado)

### Trilhas de FATO (FD)
Cada trilha FD do Grafo se abre em micro-degraus. A progressão canônica (exemplo completo da FD3, +/− até 20; as demais seguem o mesmo desenho):

\`\`\`
FD3.1  +1/+2 e −1/−2 (vizinhos da reta)        FD3.6  −e depois do 10 (voltar pelo 10)
FD3.2  +0/−0 e o próprio número (n−n=0)        FD3.7  mistos ± até 20, lote equilibrado
FD3.3  dobros até 20                           FD3.8  o buraco: 8+__=15, 14−__=6
FD3.4  quase-dobros                            FD3.9  três parcelas rápidas (2+5+3)
FD3.5  +atravessando o 10 (ponte)              FD3.10 faixa-preta: tudo misturado, rt no alvo
\`\`\`

**Receita de cada round FD (10-20 itens):** ~60% do degrau atual · ~20% revisão dos degraus anteriores (intercalada — interleaving, que consolida mais que bloco puro) · ~10% fatos da fila quente (errados recentes) · ~10% UM degrau acima, como amostra grátis (se acerta, acelera a promoção). Sempre: **os 3 últimos itens são fáceis** — toda sessão termina em vitória.

### Trilhas de PROCEDIMENTO (PD)
Mesma filosofia de micro-degraus, agora sobre o algoritmo armado. Exemplo completo da **PD-D (divisão armada)** — a espinha exata do Kumon, do exato ao decimal:

\`\`\`
PD-D.1  ÷1díg exata, quociente 1 díg (48÷4)         PD-D.6  ÷1díg com zero no quociente (816÷4=204)
PD-D.2  ÷1díg exata, quociente 2 díg (96÷3)          PD-D.7  ÷2díg por estimativa, sem ajuste (96÷23)
PD-D.3  ÷1díg com resto (58÷5)                       PD-D.8  ÷2díg com ajuste do chute (a mais/a menos)
PD-D.4  ÷1díg, dividendo 3 díg (738÷6)               PD-D.9  quociente decimal (75÷4 = 18,75)
PD-D.5  interpretar/checar (q×d+r)                   PD-D.10 faixa-preta: dividendos grandes, tempo-alvo
\`\`\`

*(PD-A, PD-S, PD-M seguem o mesmo padrão — a coluna "Progressão interna" do Apêndice A do Grafo lista os degraus de cada uma.)*

**Receita de cada round PD (5-10 itens — procedimento cansa mais que fato):** ~60% do degrau atual · ~20% revisão dos anteriores · ~10-20% da fila quente (procedimentos com passo errado recente), **entrando pelo passo fraco** (se o erro é sempre a reserva, os itens de revisão são escolhidos para exercitar a reserva). Último item sempre mais leve — fecha em vitória.

**Recuo sem cerimônia (ambas as famílias):** 2 rounds seguidos com precisão < 60% no degrau → o próximo treino começa um degrau abaixo, sem aviso, sem "você caiu". A criança só sente que "hoje fluiu". (Kumon fazia isso com folhas; aqui é invisível e instantâneo.)

---

## §5. O TREINO DO MESTRE — o algoritmo da sessão

Ao montar um treino, o Mestre decide em ordem:

1. **Qual família e qual trilha?** Primeiro a família com maior necessidade (uma trilha FD ou PD com fila quente não zerada tem prioridade), depois a trilha mais "necessitada" dentro dela, por prioridade: (a) fila quente não zerada → ela; (b) senão, a mais enferrujada (maior tempo sem treino × mais itens decaídos); (c) senão, a mais avançada ativa (progresso). Alterna para nunca abandonar trilha velha (máx 3 treinos seguidos na mesma) e equilibra as famílias ao longo da semana (não deixa PD parada enquanto só treina FD). No Treino Livre, a criança escolhe a trilha; o Mestre ainda escolhe os itens dentro dela.
2. **Quais itens?** A receita do §4 (FD ou PD conforme a trilha), escolhendo dentro de cada fatia os de MENOR força (o oposto exato do papel: o Kumon repete o que você já sabe; o Mestre caça o que você não sabe). Em PD, a fila quente entra **pelo passo fraco** registrado.
3. **Que formato?** Em FD, rotação de formatos para o mesmo fato (7×6 direto · 42÷7 · 7×__=42 · o array relâmpago) — fluência é reconhecer o fato de qualquer ângulo. Em PD, a conta armada no formato canônico, ocasionalmente com um passo pré-preenchido para isolar o passo que falha.
4. **Que ritmo?** rt/tempo-alvo do degrau; sem cronômetro VISÍVEL antes dos 7 anos (a pressa visual gera pânico motor — o tempo é medido em silêncio). 7+ anos: o cronômetro é opcional e a criança escolhe ligá-lo (muitos ADORAM — mas é escolha).

**O erro isolado é toque leve** (o mesmo modelo de duas camadas da Bíblia §8, na velocidade do Dojo): um item errado apenas volta pra fila quente e reaparece adiante — sem parar o round, sem aula. Só o PADRÃO merece intervenção. **Quando um item erra 2× na mesma sessão:** o Dojo pausa a velocidade e injeta a ESTRATÉGIA daquele item (10-15s) — **a mesma do Manual, encurtada**. Em FD: o 7×6 abre no quebra-bloco 5×6+2×6; o 8+5 abre na ponte do 10. Em PD: abre no PASSO exato que falhou (a subtração trava na troca → a barra de dezena explode em 10 cubinhos; a divisão engole o zero do quociente → a Chave Viva mostra a casa vazia). Depois, o item volta em velocidade. Se a estratégia-mãe também falhar, o problema não é de fluência: o Mestre encerra o treino da trilha e sinaliza a competência-mãe como frágil (vira resgate na próxima aula — Bíblia §11). O Dojo NUNCA vira aula à força; ele devolve pra aula.

---

## §6. FAIXAS, RITUAL E MOTIVAÇÃO (a metáfora completa)

O Dojo usa a metáfora até o fim — treino é identidade, não obrigação:

- **Faixas por trilha:** branca → amarela → laranja → verde → azul → roxa → marrom → **preta** (os degraus da trilha mapeados nas faixas; faixa-preta = degrau final no rt-alvo). A faixa NUNCA regride — recuo de degrau é treino, não rebaixamento.
- **O ritual:** todo treino abre com a reverência (1 respiração animada, 2s — foco, e um truque real de autorregulação) e fecha com o carimbo no pergaminho do dia.
- **Sequência de dias (streak):** a chama do dragão cresce por dia treinado. Se apagar — *"o dragão dormiu, vamos acordá-lo"* — SEM perder faixa, sem culpa (a chama celebra presença; a ausência não é punida, é reconvidada).
- **Recordes pessoais:** "seu melhor round de FD4: 14 acertos!" — o único adversário é o eu de ontem. Zero comparação entre irmãos/usuários (regra dura).
- **A Prova de Faixa:** ao completar um degrau, um round-cerimônia de 12 itens com música própria. Passou (≥90% no alvo) → cerimônia da faixa. Não passou → *"quase! o Mestre diz que faltam 2 golpes"* — e treina os 2 fatos exatos que faltaram.

---

## §7. O JARDIM DO DOJO — fluência para quem não lê nem conta (4-6 anos)

A resposta ao "e o meu filho de 4?": fluência pré-simbólica existe, e é a MAIS importante — é o alicerce perceptual de todo cálculo mental futuro (a linhagem do soroban/anzan: primeiro o olho, depois a imagem mental, por último o símbolo). Trilhas do Jardim (destravam pelas competências N1, como as FD):

- **JD1 · Olhômetro Relâmpago** (mãe: N1.03): bolinhas piscam 1,5s → some → toca a quantidade (respostas como conjuntos de bolinhas, depois numerais quando N1.06 ≥ 3). Progressão: 1-3 → 1-5 → arranjos de dado → arranjos irregulares → **flash de 0,8s** (o olho ficando anzan).
- **JD2 · A Mão Relâmpago** (mãe: N1.08): mãos/dedos piscam → quanto? (a sub-base 5 virando reflexo: 4 é "mão sem polegar" SEM contar).
- **JD3 · Moldura Relâmpago** (mãe: N1.11): a moldura de 10 pisca com 7 → *"quantos FALTAM pra encher?"* — os amigos do 10 nascendo como percepção de vazio, não como conta.
- **JD4 · O Passo Seguinte** (mãe: N1.07/N1.09): "cinco!" (áudio) → toca o que vem depois, cada vez mais rápido; depois contar de 2 em 2 no ritmo do tambor (semente de AL.03 e das tabuadas).
- **JD5 · Ver e Imaginar** (mãe: N1.08, o degrau anzan): mostra 3 bolinhas, esconde, *"chegaram mais 2"* (só áudio + som de plim-plim) → quanto tem AGORA atrás da cortina? A criança opera sobre a IMAGEM MENTAL — o começo do cálculo de cabeça de verdade, aos 5 anos, sem um símbolo na tela.

Regras do Jardim: tudo áudio-first, rounds de 6-10 itens, 2-3 min, zero cronômetro visível, o flash é o único relógio. Erro → a cena reaparece parada para contar com o dedo (o concreto sempre disponível como rede).

---

## §8. NA TELA E NOS DADOS

**UI:** o Dojo é um LUGAR no mapa (o templo no topo da montanha) que a criança **entra direto e treina o quanto quiser** — não depende de estar numa aula. Dentro: as duas alas (Fatos e Procedimentos), o pergaminho de faixas por trilha, o botão único "Treinar" (Mestre monta) e a estante de trilhas (Livre). Métricas visíveis para a criança: faixa, chama, recorde. Métricas do painel dos pais: força média por trilha nas duas famílias, os itens mais fracos nominalmente (os "7×8 da vida" dela nos fatos; "trava na troca com zero" nos procedimentos), minutos treinados, gráfico de rt/tempo caindo — a prova visual da fluência chegando.

**Contratos de dados (novos, a implementar):**
\`\`\`
FactStrength     (§3-A — por fato:      fact_id, forca, rt_medio, ultima_vez, erros_seguidos)
ProcStrength     (§3-B — por procedimento: proc_id, precisao, passo_fraco, tempo_medio, forca, ultima_vez)
DojoTrackState   { track_id, familia: "FD"|"PD", degrau_atual, faixa, ultima_prova }
DojoSession      { track_id, familia, itens[], acertos, rt_ou_tempo_medio, fila_quente_restante }
\`\`\`
O composer da aula (Bíblia §6) pede ao Dojo 1 bloco pronto (secundário); o principal é o treino avulso no templo. O Dojo lê o Grafo (unlocks das FD/PD/JD — Apêndice A) e escreve telemetria que o motor adaptativo consome (§11 da Bíblia) — itens cronicamente fracos (fato ou passo de procedimento) são sinal de competência-mãe frágil.

**O que o Dojo NUNCA faz:** não abre trilha (FD ou PD) sem a mãe dominada nas aulas · não mostra cronômetro antes dos 7 · não compara crianças · não tira faixa · não passa de 5 min por bloco · não substitui a aula (devolve pra ela quando o problema é conceito).

*Changelog: v1.0 (jul/2026) — especificação inaugural: análise Kumon, força por fato, degraus FD, Treino do Mestre, faixas, Jardim do Dojo (JD1-JD5), contratos de dados.*
*v1.1 (jul/2026) — segunda família de fluência: trilhas de PROCEDIMENTO (PD-A/S/M/D/Dec) para os algoritmos armados multi-dígito (a espinha do Kumon), com modelo ProcStrength (precisão + passo fraco + tempo) e intervenção pelo passo exato que falha; Dojo reafirmado como pilar autônomo (entra-se direto, treina-se à vontade), não apêndice da aula; três camadas explícitas (Jardim → Fato → Procedimento).*
*v1.2 (jul/2026) — QUATRO modos (§2): Jornada (diário), Reforço (só fracos), Livre (criança escolhe), Mestre (desafio cronometrado). Alinhado à Bíblia §3.1 (Dojo como uma das três funções).*


# MANUAL DIDÁTICO

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

**2. A RESPOSTA AO ERRO — DOIS NÍVEIS QUE NÃO SE MISTURAM.** Este é o ponto mais delicado do design, e a regra-mãe é: **o fluxo é sagrado.** Errar faz parte de aprender; a criança precisa continuar SE MOVENDO, não parar para uma aula a cada tropeço. Por isso a resposta ao erro trabalha em duas camadas separadas — uma leve e imediata (dentro da questão), outra profunda e adiada (disparada por PADRÃO, no momento certo).

> **A regra de uma frase:** *o erro num exercício recebe um toque leve e o fluxo continua; o PADRÃO de erros recebe trabalho focado, na hora certa.*

**CAMADA 1 — Resposta imediata (leve, preserva o fluxo).** Dentro da própria questão, no máximo dois toques antes de seguir:
- **1ª tentativa errada → deixa a criança se auto-corrigir.** Nada de aula. Feedback gentil que convida a tentar de novo ("hmm, olha de novo!") + esconder 1 opção absurda. A maioria dos erros é deslize (pressa, dedo torto) e a própria criança conserta sozinha — interromper isso com explicação é chato e ensina dependência.
- **2ª tentativa errada → UMA dica estratégica (a "E1").** Agora vale um empurrão: uma pergunta curta que aponta a estratégia do nível (*"quantos espaços vazios sobraram na moldura?"*). A criança continua no comando, ainda resolvendo.
- **Ainda errou → mostra a resposta com uma frase de porquê e SEGUE.** Sem cerimônia, sem demonstração longa no meio do fluxo. A questão é "estacionada" (marcada como frágil no fato/competência) e a criança AVANÇA na hora. **Nunca trava.**
- *Deslize vs. dificuldade:* o motor separa os dois pelo tempo de resposta e pelo tipo de distrator — erro rápido num distrator qualquer = provável deslize (toque mais leve ainda); erro lento ou num distrator de misconception = dificuldade real (a dica da 2ª tentativa já é a certeira daquela confusão).

**CAMADA 2 — Remediação profunda (por padrão, no momento certo).** É AQUI que mora o ensino pesado — a demonstração narrada, a Mão Fantasma (fazer junto) e o microtutorial. Mas ele **NÃO dispara na questão isolada**; dispara quando o Radar de Lacunas (Bíblia §11.4) detecta um PADRÃO — a mesma tag de misconception 2× em poucas questões, ou um fato cronicamente fraco. E entrega a remediação no momento que respeita o fluxo: numa pausa natural, no fim da sessão, ou como Missão de Resgate na sessão seguinte — nunca engasgando a criança no meio de uma questão. É exatamente o "depois de alguns exercícios, verificar os erros e aí trabalhar pontualmente".
- **Os três conteúdos de remediação** (o que cada nível CONTÉM, disparados pela Camada 2, não a cada erro): **Dica** aponta a estratégia · **Demonstração** = worked example, o tutor resolve um gêmeo narrando, a criança assiste · **Fazer Junto** = Mão Fantasma, a criança executa com o tutor sustentando. Quando um assunto abaixo diz "E1/E2/E3", está descrevendo o CONTEÚDO de cada nível — o QUANDO é governado por este modelo de duas camadas, sempre.

**Exceção — modo ensino (não é erro, é aula).** Na PRIMEIRA vez de um conceito e dentro de um microtutorial, o andaime Eu-faço → Fazemos-juntos → Você-faço é o esperado e bem-vindo: ali a criança está aprendendo, não sendo avaliada. Andaime em aula ≠ punição por erro. A Camada 1 leve vale para as questões de prática; o andaime vale para o ensino.

**3. OS MICROTUTORIAIS (worked → faded).** Micro-aula de 20-40 segundos, disparada quando um conceito é **novo** OU quando a **Camada 2** pede (padrão detectado) — nunca como reação automática ao 2º erro de uma questão solta. Estrutura fixa: **Eu faço (I do)** — tutor resolve narrando → **Fazemos juntos (We do)** — criança executa com apoio → **Você faz (You do)** — criança sozinha, mesmo tipo, número trocado. Cada assunto abaixo lista os microtutoriais que precisa.

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
\`\`\`
 Nível 5: Milhar, arredondamento, números grandes           → N2.04, N2.05
 Nível 4: Dezena/unidade — o "10" como pacote               → N2.01, N2.02, N2.03
 Nível 3: Parte-todo, amigos do 10, reta numérica           → N1.10, N1.11, N1.12
 Nível 2: Subitização conceitual + contar de qualquer ponto → N1.08, N1.09
 Nível 1: Cardinalidade, numerais, ordem, comparação        → N1.04-N1.07
 Nível 0: Correspondência 1-a-1, canto numérico, olhômetro  → N1.01, N1.02, N1.03
\`\`\`

## ▶️ Primeira vez (a primeiríssima sessão do app, 4 anos)
Sem número nenhum na tela. Três potinhos, três peixinhos nadando. Tutor: *"Cada peixinho quer o SEU potinho. Um peixinho... um potinho. Pode dar?"* A criança arrasta um peixe pra cada pote. *"Olha! Cada um tem o seu. Nenhum sobrou, nenhum ficou sem."* — isso é correspondência 1-a-1, o átomo da matemática. Números falados só entram depois; numerais escritos, muito depois.

## Nível a nível

### Nível 0 — os três músculos primitivos (N1.01, N1.02, N1.03)
- **Correspondência 1-a-1 (N1.01):** parear objetos (tampa↔pote, peixe↔aquário). Mecânica: arrastar com snap. 🧒 *O que dá errado:* ela dá 2 peixes pro mesmo pote — o pote "cheio" balança e devolve, o tutor: *"Esse já tem! Quem ainda está vazio?"* (E1 embutido na física da cena).
- **Canto numérico (N1.02):** a sequência falada como ritmo — o app canta junto, a criança completa a próxima palavra ("um, dois, ___!"). Sem objetos ainda: é música motora. 🧒 *Erro comum:* pular o "quatro" ou inventar ("um, dois, três, cinco") — o app repete o trecho cantando MAIS devagar, nunca diz "errou".
  - **Exercício-âncora: O Canhão de Balões.** Um canhão antigo e engraçado. A criança toca no botão → BUM, um tiro estoura um balão, o numeral **1** salta no visor e os pedaços do balão caem no chão com um som gostoso. Toca de novo → **2**, mais um balão explode e cai. E assim por diante. Depois o tutor pede: *"Estoure 4 balões!"* — e ela dá 4 tiros contando 1, 2, 3, 4, cada tiro casando o estouro + o numeral + o som. Ensina três coisas de uma vez, ligadas: a palavra-número, o SÍMBOLO (o numeral no visor) e a AÇÃO de contar um-a-um (cada tiro = um item, base da correspondência 1-a-1). *Melhorias sobre a ideia crua:* o visor mostra o numeral grande e a quantidade de balões restantes; o áudio conta junto; se ela dá um tiro a mais do que o pedido, o canhão "tosse" fumaça (sem estourar nada) e o tutor ri *"opa, já chegou no 4!"* — o próprio limite físico ensina a parar na conta certa (semente da cardinalidade). Vira também item de treino no Jardim do Dojo (JD, ver \`DOJO_SAGA.md\`).
  - 🧒 **A ordem certa: o 1 vem MUITO antes do 0.** Conta-se 1, 2, 3… primeiro (quantidade de coisas que existem). O ZERO só entra bem depois, quando a criança já tem cardinalidade — porque "nada/vazio" é mais abstrato que "uma coisa". O zero nasce concreto: o canhão sem nenhum balão na tela, ou o cesto vazio → *"quantos sobraram? Nenhum. Isso é zero."* Nunca se apresenta "0, 1, 2" nessa ordem para um pré-leitor; primeiro o mundo tem coisas (1+), depois se descobre o vazio (0).
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

---

# ➕ ADIÇÃO — DO CONCRETO AO CÁLCULO MENTAL → N1.10, N1.11, N3.01-N3.13
*Fonte: \`adicao.md\`, expandido e costurado ao Grafo.*

## Por que trava
A escola foca cedo demais na memorização de símbolos e na conta armada. Sintoma: a criança decora \`8+5=13\` ou conta freneticamente nos dedos; diante de \`18+15\`, trava ou "sobe 1" sem saber por quê. Causa: pular os degraus cognitivos naturais — a mão antes do papel, a estrutura do 10 antes do algoritmo.

## A escada
\`\`\`
 Nível 5: Algoritmo formal — o "vai 1" como empacotamento   → N3.11
 Nível 4: Decomposição posicional mental (24+13 = 30+7)     → N3.09, N3.13
 Nível 3: A Ponte do 10 (8+5 = 8+2+3)                       → N3.07
 Nível 2: Amigos do 10, moldura de 10, dobros               → N1.11, N3.06
 Nível 1: Counting-on — contar a partir do maior            → N3.03
 Nível 0: Juntar concreto (2 patinhos + 1 patinho)          → N3.01
\`\`\`

## ▶️ Primeira vez
Dois grupos de patinhos entram nadando (2 e 1). Tutor: *"Os patinhos querem nadar todos juntos!"* A criança arrasta um grupo ao encontro do outro — fundem com um "poof!". *"Você JUNTOU! Dois patinhos e mais um... viraram três!"* O sinal \`+\` aparece depois, como legenda da junção que ela já fez. Dois sentidos desde cedo: **juntar** (dois grupos viram um) e **acrescentar** (um grupo cresce — 3 pássaros no fio, chegam mais 2).

## Nível a nível

### Nível 0-1 — juntar e o salto do counting-on (N3.01, N3.03)
- **Juntar/acrescentar concreto (N3.01):** params total ≤ 10; a cena sempre conta a história antes do número.
- **Counting-on (N3.03) — a primeira grande estratégia.** O jeito antigo: somar 4+2 contando "1,2,3,4...5,6" (tudo do zero). O jeito certo: **o 4 fica fixo e fechado** (uma caixinha lacrada com "4" escrito), a criança pousa o dedo nela e conta só o resto: *"quaaatro... 5, 6!"*. Metade do esforço de memória.
- 🧒 *Simulação do erro central (off-by-one):* a criança diz "4... 4, 5" — ela CONTA o próprio 4 como primeiro passo. Distrator canônico de N3.03: resposta−1. **E1:** *"O 4 já está guardado na caixinha! Comece a contar DEPOIS dele."* **E2:** tutor demonstra com a caixinha lacrada. Regra de design: o primeiro número NUNCA aparece como objetos soltos contáveis neste nível — sempre lacrado — senão o app convida ao erro.
- 🧒 *Outro erro:* começar pelo menor (2+7 contando 7 pulos). O tutor ensina o giro: *"Pega o MAIOR na caixinha, é menos caminho!"* (comutatividade usada na prática antes de ser nomeada).

### Nível 2 — o poder do 10 (N1.11, N3.06)
- **A moldura de 10** é a lente principal: o 8 na grade 2×5 mostra fisicamente **2 buracos vazios**. A criança não calcula "quanto falta pra 10" — ela VÊ.
- **Dobros como estacas (N3.06):** 4+4, 5+5... memorizados por simetria visual (espelho). Quase-dobros derivam: 5+6 = (5+5)+1. 🧒 *Erro:* derivar pro lado errado (5+6 = 10−1=9). E1: *"6 é MAIS que 5 ou MENOS?"*
- Params: molduras sempre preenchidas da esquerda pra direita, linha de cima primeiro (a estrutura canônica é o que vira imagem mental).

### Nível 3 — a Ponte do 10 (N3.07) — o segredo asiático
Como somar 8+5 de cabeça: **(1)** olha pro 8: *"de quanto você precisa pra virar 10?"* → 2. **(2)** espatifa o 5 em 2+3 (efeito de divisão de célula na tela). **(3)** o 2 voa pro 8 → fecha a barra dourada de 10. **(4)** sobra 10+3 = 13.
- 🧒 *Simulação:* isto exige DOIS pré-requisitos automáticos ao mesmo tempo — amigos do 10 (N1.11) e amigos dos números (N1.10, para partir o 5). Se qualquer um estiver frágil, a ponte desaba com cara de "não sei somar". **Por isso o radar de lacunas (Bíblia §11) olha os pré-reqs, não a competência atual, quando N3.07 falha 2×.**
- 🧒 *Erro típico:* partir o número errado (espatifar o 8 em vez do 5). E1: *"Quem está mais perto do 10? Ele fica parado — o OUTRO se parte."*
- **Microtutorial "Chamar o Amigo"**: I do — tutor faz 9+4 narrando os 4 passos. We do — 8+6 juntos. You do — 7+5.

### Nível 4 — cálculo mental posicional (N3.09, N3.13)
24+13 sem papel: *"dezenas com dezenas (20+10=30), unidades com unidades (4+3=7), junta: 37."* As famílias se somam separadas e se reencontram. 🧒 *Erro:* misturar as famílias (24+13 = 24+1=25+3...). O visual: as dezenas de cada número se atraem magneticamente por cor.

### Nível 5 — a conta armada com alma (N3.11)
\`15+17\` vertical, material dourado ao lado. Ela soma 5+7 = 12 unidades. **A cerca elétrica:** *"a coluna das unidades só aguenta 9!"*. Ela é obrigada a laçar 10 unidades → fundem numa barra → a barra **flutua e pousa no topo da coluna das dezenas**. O "vai 1" acabou de virar uma ação física de empacotamento. Sobram 2 unidades, 3 dezenas: 32.
- **Sincronia inegociável:** o "1" pequenino aparece na conta no MESMO frame em que a barra pousa.
- 🧒 *Erros:* escrever "12" inteiro na coluna das unidades (a cerca impede fisicamente antes de virar hábito no papel); esquecer de somar o 1 que subiu (o 1 pisca até ser incluído — E1 visual).

## Microtutoriais
"Chamar o Amigo" (acima) · **"A Caixinha Lacrada"** (N3.03, counting-on) · **"A Cerca Elétrica"** (N3.11, reagrupamento).

## Regras de implementação
1. Priorizar moldura-de-10 e number bonds sobre emojis soltos para todo número < 20.
2. Áudio de erro NUNCA genérico — sempre a estratégia do nível (E1 específicos acima).
3. Paleta posicional global (dezena quente, unidade fria) idêntica à da Fundação.
4. O primeiro somando lacrado no counting-on; a cerca elétrica ativa em todo kind vertical.

---

# ➖ SUBTRAÇÃO — OS TRÊS SENTIDOS E O FIM DO "EMPRESTA 1" → N3.02, N3.04, N3.05, N3.08, N3.12
*Fonte: \`subtracao.md\`, expandido e costurado ao Grafo.*

## Por que trava
Ensina-se subtração só como "perder", e logo se decora o "corta o vizinho e pega 1 emprestado". A criança faz a mecânica sem saber que o "1" emprestado VALE 10 — e diante de \`100−45\` entra em pânico aplicando regras erradas. Causa: falta de ancoragem física da troca dezena↔unidades, e ignorar que subtração tem TRÊS sentidos, não um.

## A escada
\`\`\`
 Nível 5: Reagrupamento físico (quebrar a dezena)           → N3.12
 Nível 4: Decomposição subtrativa (45−23 = 45−20−3)         → N3.13
 Nível 3: Voltar pelo 10 (14−6 = 14−4−2)                    → N3.08
 Nível 2: Parte-todo — a inversa da adição                  → N3.05
 Nível 1: Comparação — a diferença como "buraco"            → N3.04
 Nível 0: Tirar concreto (take-away)                        → N3.02
\`\`\`

## ▶️ Primeira vez
5 patinhos na lagoa. Tutor: *"Dois patinhos foram nadar pra longe!"* A criança arrasta 2 pra fora da cena. *"Tiramos 2... sobraram 3."* O sinal \`−\` como legenda. 

## Os três sentidos (a chave de tudo)
1. **Tirar** (N3.02): algo sai, quanto sobra.
2. **Comparar** (N3.04): NADA sai. Leo tem 5 moedas, Luna tem 3 — as duas barras alinhadas, e a diferença é o **buraco visível** de 2 na barra da Luna. Subtrair = medir o vazio entre duas quantidades.
3. **Completar** (N3.04c): "tenho 3, quero 8, quanto FALTA?" — subtração disfarçada de adição.
🧒 *Por que isso importa:* a criança que só conhece "tirar" lê o problema de comparação ("quantos a mais?") e não sabe QUAL conta fazer. Os três sentidos são treinados com as três cenas desde cedo, e os problemas de N3.10 misturam os tipos de propósito.

## Nível a nível

### Nível 2 — a ponte inversa (N3.05)
O laço parte-todo: o TODO é 10, uma parte é 7 — a outra é...? A criança **não conta pra trás**: ela resgata o amigo do 10 que já sabe. \`10−3\` responde-se lembrando \`7+3=10\`. E o **counting-up**: para \`12−9\`, contar 9 passos pra trás é sofrimento e erro; contar PRA FRENTE do 9 até o 12 ("10, 11, 12" — 3 passos) é rápido e seguro. 🧒 *Erro clássico do contar-pra-trás:* off-by-one duplo ("12, 11, 10..." incluindo o 12). O counting-up existe pra substituir isso, não pra conviver com isso.

### Nível 3 — voltar pelo 10 (N3.08)
\`14−6\` de cabeça: **(1)** mira a estação segura: do 14, tirar 4 chega no 10. **(2)** espatifa o 6 em 4+2. **(3)** 14−4=10, depois 10−2=8. Visual: o sapo na reta dá o pulão até o 10 e o pulinho final. 🧒 *Erro:* espatifar errado e passar do 10 (tirar 5). E1: *"Quantos degraus até o 10? Tire SÓ esses primeiro."* Pré-reqs frágeis que derrubam isso: N1.11 e N3.04c.

### Nível 5 — o fim do "empresta 1" (N3.12)
\`32−17\` vertical, blocos ao lado. Tutor: *"Precisamos tirar 7 unidades, mas só temos 2 cubinhos. E agora?"* A criança **toca na barra de dezena → ela EXPLODE em 10 cubinhos** que se juntam aos 2 (agora 12). **Sincronia mágica:** no MESMO milissegundo, na conta, o 3 é riscado e vira 2, e o 2 vira 12. Ela tira 7 dos 12 (sobram 5), tira 1 dezena (sobra 1): 15.
- **Linguagem obrigatória:** NUNCA "pegar emprestado" (não se devolve nada!). Sempre: *"vamos TRANSFORMAR 1 dezena em 10 unidades"*.
- 🧒 **O erro-monstro que este nível existe para prevenir:** \`42−38\` respondido \`16\` — a criança inverte a coluna ("2−8 não dá, então faço 8−2"). O distrator |a−b| por coluna é obrigatório em todo gerador de N3.12, e a remediação E2 SEMPRE volta pros blocos: *"você TEM 2 cubinhos. Dá pra tirar 8 deles? Não! Então quebramos uma dezena."*
- 🧒 *O caso do zero:* \`100−45\` — quebrar a centena em dezenas E uma dezena em unidades, em cascata. Merece questões próprias (micro c) porque é onde as regras decoradas explodem.

## Microtutoriais
**"O Detetive do Buraco"** (N3.04, comparação com barras) · **"A Estação 10"** (N3.08) · **"Quebra a Dezena"** (N3.12 — I do: tutor faz 23−15 explodindo a barra e narrando a troca; We do: 41−26; You do: 32−17).

## Regras de implementação
1. Comparação SEMPRE com barras alinhadas pela base — nunca objetos espalhados.
2. A explosão da dezena e a alteração dos algarismos no papel no mesmo frame (regra de sincronia global).
3. Proibido liberar N3.12 sem N2.01 nível ≥3 atestando que "1 dezena = 10 unidades" (o grafo já garante — o gerador confere).
4. Os três sentidos aparecem misturados nos problemas de história desde F1 (N3.10).

---

# ✖️ MULTIPLICAÇÃO — A GEOMETRIA DA ESCALA → N4.01-N4.04, N4.07-N4.09, N4.11, AL.03
*Fonte: \`multiplicacao.md\`, expandido e costurado ao Grafo.*

## Por que trava
A tabuada decorada treina o cérebro FONETICAMENTE (como música), não matematicamente. Sintoma: esqueceu 7×8 → trava ou recita desde 7×1; diante de 12×15, não faz ideia do que a conta armada representa. O SAGA constrói **senso de escala**: a criança VÊ a forma da multiplicação (grupos → arrays → área) e a tabuada vira consequência, com a memorização chegando por cima da compreensão (no Dojo).

## A escada
\`\`\`
 Nível 5: Modelo de área e algoritmo (14×23 fatiado)        → N4.09
 Nível 4: Escalar por 10/100 — a roda posicional            → N4.08
 Nível 3: Derivação distributiva (7×6 = 5×6 + 2×6)          → N4.07
 Nível 2: Arrays e a comutatividade girada                  → N4.02
 Nível 1: Adição repetida e saltos na reta                  → N4.01b, AL.03
 Nível 0: Grupos iguais concretos (3 potes de 4)            → N4.01a
\`\`\`

## ▶️ Primeira vez
3 potes de vidro. A criança põe exatamente 4 vagalumes em cada. Tutor: *"Temos 3 GRUPOS DE 4 vagalumes."* **A palavra "vezes" e o símbolo × NÃO existem ainda** — só "grupos de". O símbolo entra em N4.01c como abreviação de algo que ela já domina falar: *"escrever '3 grupos de 4' dá trabalho... os matemáticos inventaram um atalho: 3×4."*

## Nível a nível

### Nível 0-1 — grupos e ritmo (N4.01, AL.03)
- **Grupos iguais:** montar e LER cenas ("2 pratos com 5 morangos"). 🧒 *Erro-conceito central:* somar os números da cena (3 potes de 4 → "7"). Distrator canônico: a+b. E1: *"3 e 4 contam coisas DIFERENTES: 3 conta os potes, 4 conta o que tem DENTRO."*
- **Saltos na reta:** o canguru pula de 3 em 3 — multiplicar é escalar distâncias iguais, ligando com a contagem rítmica de AL.03 (2 em 2, 5 em 5, 10 em 10) que já vem sendo cantada desde F1. 🧒 *Erro:* contar o ponto de partida como primeiro salto (o zero é a largada, não um pulo).

### Nível 2 — o Eureka dos arrays (N4.02)
Soldadinhos em formação: 3 fileiras de 4. A mesma quantidade, agora ESTRUTURA. **A comutatividade não se decreta — se GIRA:** a criança rotaciona a formação 90° e 3×4 vira 4×3 com os MESMOS soldados. *"Ninguém entrou, ninguém saiu!"* O cérebro ganha flexibilidade multiplicativa de graça (a tabuada pela metade!).
- Regra dura: arrays sempre perfeitamente alinhados — assimetria quebra a percepção da matriz.

### Nível 2½ — as primeiras tabuadas (N4.03, N4.04)
2, 5 e 10 primeiro (as que já têm ritmo cantado em AL.03), depois 3 e 4. Cada fato NASCE do array e da reta antes de ir pro Dojo virar reflexo. 🧒 *Erro:* ×10 "é botar zero" — proibido ensinar assim (quebra nos decimais: 2,5×10 ≠ 2,50). Ver Nível 4.

### Nível 3 — a quebra da tabuada (N4.07) — o fim do medo de esquecer
Esqueceu 7×6? **A espada ninja fatia o retângulo:** 7×6 vira um bloco de 5×6 (que ela sabe: 30) + um bloco de 2×6 (12) → 30+12=42. Ela acabou de usar a propriedade distributiva SEM ouvir o nome. As âncoras: ×9 = ×10 menos 1 grupo; ×6 = ×5 mais 1 grupo; quadrados (7×7=49) como postes de luz. **Se a memória falhar, a lógica resgata — para sempre.**
- 🧒 *Fatos-colisão famosos:* 7×8 (54? 56? 48?), 6×9 vs 7×8. Distratores SEMPRE de fatos vizinhos, nunca números aleatórios — o erro real é confundir vizinhos.
- **Microtutorial "Quebra o Bloco"**: I do — tutor fatia 6×7 em 5×7+1×7 narrando. We do — 8×6. You do — 7×8.

### Nível 3½ — a tabuada que continua (N4.11)
Múltiplos: o trem do 4 não para no ×10 — segue 44, 48, 52... Divisores pelo caminho inverso: quais arranjos retangulares o 12 aceita? (1×12, 2×6, 3×4). Par/ímpar e os critérios do 2, 5 e 10 lidos na tabela de 100 pintada. E os **primos**: o número teimoso que só aceita UMA fileira (11 soldados: fila única ou nada) — caçados pintando o crivo na tabela de 100. 🧒 *Erros:* confundir múltiplo com divisor — fala-âncora do tutor: *"múltiplo é MAIOR ou igual (ele contém); divisor CABE dentro"* — e achar que 1 é primo.

### Nível 4 — a roda posicional (N4.08)
Multiplicar por 10 é **empurrar de casa**: o 5 das unidades desliza pra casa das dezenas; a casa vazia é preenchida pelo zero que "cai do céu". A criança entende MUDANÇA DE ORDEM DE GRANDEZA — que sobrevive intacta quando os decimais chegarem. Multiplicação por 1 dígito (34×6) com blocos: 6 grupos de 3 barras + 6 grupos de 4 cubinhos, reagrupando como na adição.

### Nível 5 — o modelo de área (N4.09)
\`14×23\`: o retângulo com lados decompostos (10+4) e (20+3) → 4 áreas: 200, 30, 80, 12 → soma 322. Isso EXPLICA a conta armada (cada parcial é uma área) e — bônus gigante — prepara o cérebro para multiplicar polinômios daqui a anos: (a+b)(c+d) é literalmente este desenho.
- 🧒 *Erros do algoritmo:* esquecer o deslocamento da 2ª linha (o "zero-fantasma" — no modelo de área ele é a área ×10, visível!); somar as parciais errado.
- Fatiamento animado: a linha tracejada abre suave, mostrando que NADA mudou de quantidade, só o empacotamento.

## Microtutoriais
**"Grupos De"** (N4.01, primeira vez) · **"Gira o Exército"** (N4.02) · **"Quebra o Bloco"** (N4.07) · **"O Retângulo Gigante"** (N4.09, modelo de área).

## Regras de implementação
1. "Vezes"/× proibidos no primeiro contato — "grupos de" até a leitura de cena estar sólida.
2. Arrays com alinhamento pixel-perfect; rotação da comutatividade como interação real (girar), não como animação passiva.
3. Distratores de tabuada = fatos vizinhos (±1 grupo, fato colidente), jamais aleatórios.
4. A fluência (memorização) NÃO acontece nas aulas — acontece no Dojo (FD4, FD5), depois que a compreensão nasce aqui. As aulas ensinam; o Dojo automatiza.

---

# 🔢 DIVISÃO — DA PARTILHA JUSTA À CHAVE VIVA → N4.05, N4.06, N4.10, N4.12

*Fonte: \`divisao.md\`, expandido e costurado ao Grafo. Foi o primeiro assunto tratado em profundidade total — e definiu o padrão que todos os outros seguem.*

## Por que a divisão trava as crianças

Na escola clássica, a divisão é o bicho-papão: ensina-se um procedimento robótico na chave "L" — "baixa, divide, multiplica, subtrai, vê o resto". Se a criança erra a ordem ou esquece um zero no quociente, a conta inteira explode. Ela manipula algarismos soltos, não grandezas reais. **A causa:** apresentar o algoritmo abstrato antes de garantir fluência nos dois sentidos reais da divisão.

No SAGA, a divisão vira dois jogos intuitivos — **Distribuir Tesouros** (partição) e **Fazer Pacotes** (medida) — com o resto sempre visível como coisa física. A criança só chega na "chave" depois de ter feito tudo isso com a mão.

## A escada completa (o que a criança percorre)

\`\`\`
 Nível 5: Algoritmo da divisão longa com blocos (a "chave viva")   → N4.10 c-e
 Nível 4: O resto ganha significado físico                         → N4.10 a-b
 Nível 3: O lado oculto do retângulo (fator que falta)             → N4.06 b-c
 Nível 2: Divisão é a multiplicação de ré (família de fatos)       → N4.06 a
 Nível 1: Medida — "fazer pacotes" (quantos grupos cabem?)         → N4.05 b
 Nível 0: Partição — "repartir justo" (quanto cada um ganha?)      → N4.05 a
\`\`\`

---

## ▶️ PRIMEIRA VEZ — como a divisão aparece antes de qualquer símbolo

*(Isto é literalmente o roteiro de "como explico pro meu filho agora no papel".)*

A criança nunca viu o sinal \`÷\`. A tela mostra **12 moedas de ouro e 3 baús vazios**. O tutor fala, sem nenhum número escrito:

> *"Três piratas acharam um tesouro de 12 moedas. Eles querem dividir TUDO igualzinho, ninguém pode ganhar mais que o outro senão vira briga. Bora repartir?"*

A criança arrasta as moedas para os baús (ou toca e o mascote distribui uma a uma, como quem dá cartas). Quando o monte seca, cada baú tem 4. O tutor nomeia o que ela acabou de fazer:

> *"Olha só! Cada pirata ficou com 4 moedas. Foi isso que você fez: pegou 12, repartiu entre 3, e descobriu que cabe 4 pra cada. Isso tem um nome: DIVISÃO."*

Só nesse momento, e só depois de ela ver acontecer, o símbolo aparece embaixo da cena: \`12 ÷ 3 = 4\`. **A vivência primeiro, o símbolo como legenda do que já foi sentido.** Esta é a regra de ouro — nunca o contrário.

---

## OS DOIS ROSTOS DA DIVISÃO → competência N4.05

Muita gente adulta não sabe que a divisão resolve **dois problemas diferentes** na vida real. A criança precisa viver os dois fisicamente, porque a pergunta que ela se faz é diferente em cada um.

### Micro (a) — Partição Justa: "quanto cada um ganha?"
- **A pergunta interna:** sei em quantos grupos vou dividir; quero saber o *tamanho* de cada grupo.
- **História + ação:** 12 moedas, 3 baús. Arrasta uma a uma (**drag-and-drop**) até secar. Descobre: 4 por baú.
- **Fala do tutor:** *"Você já sabe QUANTOS piratas são. O que você quer descobrir é QUANTO cada um leva."*
- **Restrições p/ o gerador:** total ≤ 20, divisor ∈ [2, 4], sempre exato nesta fase.

### Micro (b) — Medida / Fazer Pacotes: "quantos grupos cabem?"
- **A pergunta interna:** sei o tamanho de cada grupo; quero saber *quantos grupos* dá pra fazer.
- **História + ação:** 12 ovos, cada caixa cabe 4. A criança **laça** (lasso) ou circunda ovos de 4 em 4, e cada laço vira uma caixa fechada. No fim, conta as caixas: 3.
- **Fala do tutor:** *"Agora é o contrário: você sabe QUANTO cabe em cada caixa. Quer descobrir QUANTAS caixas vai precisar."*
- **Detalhe de interação que importa:** partição usa arrastar-um-a-um; medida usa laçar-grupos. A mecânica DIFERENTE ajuda o cérebro a sentir que são duas perguntas diferentes com a mesma conta.

### Micro (c) — Escrever a divisão da cena
A criança conecta a história ao símbolo: vê \`12 ÷ 3 = 4\` e entende cada número (o que virou o 12, o que virou o 3, o que virou o 4).

### Micro (d) — E quando SOBRA?
Primeiro contato com o resto, ainda concreto, ainda sem notação de resto. 13 balas, 3 amigos: reparte 4 pra cada, sobra 1 piscando. O tutor: *"Sobrou uma. Não dá pra cortar agora. Guarda no cestinho."* (Prepara o terreno para N4.10 e, lá na frente, para frações.)

**Erros típicos (viram distratores e gatilhos de remediação):**
- Distribuir desigual e não conferir → **E1:** *"Todos os baús têm a mesma quantidade? Confere contando."*
- Confundir divisor com quociente na fala ("12 dividido EM 3" vs "POR 3") → a voz do tutor SEMPRE reencena a história, nunca corrige seco.

---

## DIVISÃO É A MULTIPLICAÇÃO DE RÉ → competência N4.06

O objetivo aqui é **destruir a ideia de que a divisão é matéria nova**. É só a multiplicação ao contrário. Se essa ponte não é construída, a criança carrega a divisão como um peso separado a vida toda.

### Micro (a) — A Família de Fatos (o Triângulo Mágico)
- **Visual:** um triângulo. No topo, o \`12\`. Nos cantos de baixo, \`3\` e \`4\`.
- **A lição:** esses três números *moram juntos*. \`3×4=12\`, \`4×3=12\`, e portanto \`12÷3=4\` e \`12÷4=3\`. São quatro histórias do mesmo retângulo.
- **Fala do tutor:** *"Esses três são uma família. Se você conhece dois, sempre descobre o terceiro."*

### Micro (b) — O Lado Oculto do Retângulo (fator que falta)
- Na multiplicação, \`3×4\` era um retângulo cheio de 12 blocos. Agora \`12÷3\` mostra o MESMO retângulo de 12 blocos, mas com só um lado revelado (o 3). O outro lado está escondido atrás de nuvens.
- **A ação:** a criança adivinha o comprimento do lado escondido. Ela liga área espacial com divisão. *"Quantos blocos de altura para dar 12 no total, se a base é 3?"*

### Micro (c) — Dividir "pensando na tabuada"
\`12 ÷ 4\` é respondido como *"4 vezes quanto dá 12?"*. A divisão vira uma pergunta de multiplicação. É aqui que a fluência da tabuada (N4.03, N4.07) começa a pagar dividendo na divisão.

**Microtutorial necessário:** *"O Detetive do Número que Falta"* — I do: tutor acha o lado oculto de 15÷3 falando "3 vezes quanto dá 15? ...5!". We do: criança acha 20÷4 com apoio. You do: 18÷3 sozinha.

**Erro típico:** achar que divisão é conteúdo desconectado. **Esta competência existe exatamente para impedir isso** — se a criança trava aqui, a remediação puxa de volta N4.02 (arranjos) e a tabuada correspondente.

---

## O RESTO GANHA SIGNIFICADO → competência N4.10, micros (a-b)

O resto NÃO é um erro na conta. É uma entidade física, algo que sobrou do processo.

### Micro (a) — Algoritmo com resultado EXATO primeiro
**Aqui está a correção crítica que faltava:** antes de qualquer resto, a criança aprende a *mecânica pura* do algoritmo com uma conta que fecha redondinho. Divisor de 1 dígito, resultado exato (ex.: \`84 ÷ 4 = 21\`). O ritmo: **divide → multiplica → subtrai → desce o próximo**. Sem sobra atrapalhando, ela internaliza a dança dos passos.

*Por que exato primeiro:* introduzir o algoritmo já com resto é empilhar duas dificuldades novas ao mesmo tempo (a mecânica + o que fazer com a sobra). Uma de cada vez.

### Micro (b) — Agora com sobra: o resto físico
- **História + ação:** 14 maçãs para 3 cavalos. A criança distribui 12 (4 pra cada). Ficam 2 maçãs soltas piscando.
- **Diálogo do tutor:** *"Sobraram duas maçãs inteiras. Se der pra 2 cavalos, um fica com ciúme — injustiça. E não dá pra cortar agora. O que a gente faz? Guarda no cesto do Resto!"*
- A notação \`14 ÷ 3 = 4 R 2\` nasce com significado óbvio, porque a criança VIU a sobra.

**Linguagem obrigatória:** nunca "erro" quando sobra. Use *"sobra"* ou *"não dá pra dividir igual ainda"*. Isso prepara o terreno cognitivo para frações.

---

## A CHAVE VIVA — o algoritmo da divisão longa → competência N4.10, micros (c-e)

A consagração do CPA. O fim da decoreba cega. A tela é dividida: **à esquerda a chave de papel, à direita os blocos** (material dourado). A criança só avança um passo numérico DEPOIS de fazer a ação física correspondente.

**O exemplo canônico: \`75 ÷ 3\`**

- **Direita:** 7 barras douradas (dezenas) e 5 cubinhos (unidades) + 3 pratos vazios no rodapé.

**Passo 1 — As dezenas primeiro.** Tutor: *"Vamos repartir as barras grandes primeiro!"* A criança distribui as 7 barras nos 3 pratos. Cabem 2 em cada. Sobra 1 barra no ar.
> *Reflexo no papel:* na chave, embaixo do 3 aparece \`2\` (quociente); embaixo do 7 aparece \`6\` (barras usadas) e sobra \`1\`. **O papel narra exatamente o que a mão fez.**

**Passo 2 — O desagrupamento (o momento mágico).** A barra que sobrou "explode" e vira 10 cubinhos, que se juntam aos 5 que já estavam lá → 15 unidades soltas.
> *Isto é exatamente o momento em que a escola diz seco "baixa o 5 e junta com o 1".* Aqui a criança ENTENDE por que o 5 desceu: foi a dezena que sobrou virando unidades.

**Passo 3 — Finalização.** Distribui os 15 cubinhos nos 3 pratos: 5 pra cada. Zera. O quociente anota \`5\`. Resultado: \`25\`.

**Micro (c)** cobre CDU÷U incluindo o caso do **zero no quociente** (ex.: \`816÷4=204\` — o zero que a escola "engole"). **Micro (d)** é interpretar o resto no problema (sobe ou desce? "4 pessoas por barco, 13 pessoas → precisa de 4 barcos, não 3"). **Micro (e)** é a checagem \`quociente × divisor + resto = dividendo\`.

**Regra de implementação inegociável:** a animação dos números na chave acontece no MESMO frame da ação nos blocos. Sincronia absoluta, senão a mágica se perde.

**Microtutorial necessário:** *"A Chave Viva"* — I do: tutor faz 48÷2 inteiro, narrando cada barra. We do: criança faz 69÷3 com o tutor sustentando cada passo. You do: 84÷4 sozinha.

**Erros típicos:** zero no meio do quociente engolido (\`816÷4=24\`); resto maior que o divisor (não terminou de repartir); interpretação cega do resto.

---

## O DNA DOS NÚMEROS — múltiplos, divisores e primos → competência N4.11
A divisão madura abre a porta da estrutura interna dos números. **Múltiplos:** a tabuada que continua para sempre (a reta pintada de 4 em 4). **Divisores:** todos os retângulos possíveis — 12 blocos se organizam em 1×12, 2×6, 3×4 (e as versões giradas): os divisores de 12 são os lados possíveis. **Primos:** o número teimoso que só forma UMA fileira (7 = só 1×7) — descoberto pintando o crivo na tabela de 100, não decorado numa lista. 🧒 *Erros:* confundir múltiplo com divisor (fala-âncora: *"múltiplo é MAIOR ou igual — divisor CABE dentro"*); achar que 1 é primo (ele só tem UM retângulo de um jeito só — não conta); achar que todo ímpar é primo (o 9 desmente com 3×3).

## EXTENSÃO — divisor de 2 dígitos → competência N4.12

O degrau que separa "sei dividir" de "sei dividir de verdade". Aqui entra a **estimativa**: não dá pra saber de cabeça quantas vezes 23 cabe em 96, então a criança aprende a chutar-e-testar com números compatíveis.

- **Micro (a)** — estimar por números redondos: *"23 é quase 25, 25 cabe em 96 umas 3-4 vezes. Testa o 4: 23×4=92, coube!"*
- **Micro (b)** — algoritmo sem ajuste (a estimativa acerta de primeira).
- **Micro (c)** — algoritmo COM ajuste: a tentativa estourou (23×5=115 > 96) → desce 1 no quociente. Ou sobrou demais (resto ≥ divisor) → sobe 1. **Este é o coração da dificuldade.**
- **Micro (d)** — checagem q×d+r. **Micro (e)** — problemas reais.

**Erro típico central:** estimar sem testar de volta. A remediação SEMPRE volta pra ação: multiplica o chute pelo divisor e confere antes de escrever.

---

# 🍕 FRAÇÕES — DO CORTE JUSTO À EQUIVALÊNCIA → N5.01-N5.05
*Fonte: \`fracoes.md\`, expandido e costurado ao Grafo.*

## Por que trava
A escola desenha a pizza, escreve "1/4" e manda decorar "o de cima é o que pego, o de baixo é o total". Sintoma-diagnóstico: *"o que é maior, 1/4 ou 1/8?"* → a criança responde 1/8, "porque 8 é maior que 4". Ela aplicou a lógica dos inteiros num universo novo sem nunca ter SENTIDO uma fração. Causa: símbolo antes da manipulação física de áreas.

## A escada
\`\`\`
 Nível 5: Equivalência na malha (1/2 = 2/4, mesma área)     → N5.03
 Nível 4: Operar peças iguais (1/4 + 2/4 = 3/4)             → N5.04
 Nível 3: Numerador como contador de peças (3 × a peça 1/4) → N5.02
 Nível 2: A unidade fracionária 1/n — o paradoxo do corte   → N5.01c, N5.02
 Nível 1: Justo vs injusto — partes IGUAIS                  → N5.01b
 Nível 0: Cortar/dobrar ao meio (ação física)               → N5.01a
\`\`\`
*(Além da escada: N5.05 — multiplicar/dividir frações — em F4, ancorado em N6.04.)*

## ▶️ Primeira vez
Uma barra de chocolate. Tutor: *"Você e seu irmão vão dividir. Corte no meio — mas tem que ser JUSTO, os dois pedaços iguaizinhos!"* A criança passa o dedo cortando. Se cortar torto, os dois pedaços aparecem lado a lado e um é visivelmente maior: *"Hmm, alguém ia reclamar... tenta de novo!"* Quando acerta: *"Duas partes IGUAIS. Cada uma se chama METADE."* Zero notação — só imagem, corte e voz.

## Nível a nível

### Nível 0-1 — a justiça primeiro (N5.01a-b)
Fração NÃO nasce do número; nasce da **partilha justa**. Jogo do detector: várias formas cortadas, algumas em partes iguais, outras num pedação e num pedacinho — *"qual bolo foi dividido de forma justa para 2 pessoas?"*. 🧒 *Confusão real:* achar que "cortou em 2" já é metade, mesmo torto. A palavra metade/terço/quarto SÓ vale para partes idênticas em área — o app repete esse critério em toda cena.

### Nível 2 — o paradoxo do denominador (N5.01c → N5.02)
Três barras idênticas: uma cortada em 2, outra em 4, outra em 8. A criança alimenta mascotes: o macaco quer 1/2, o passarinho quer 1/8. Ela VÊ que a peça 1/8 é minúscula perto da 1/2, e **deduz sozinha a regra**: *"quanto mais vezes eu corto, menor fica o pedacinho"* — o antídoto definitivo contra "1/8 > 1/4".
- 🧒 *A raiz do erro clássico:* o cérebro dela aplica "número maior = mais coisa" (verdade a vida toda até aqui!). Não é burrice — é transferência indevida de uma regra boa. A cura NUNCA é falar a regra nova; é a experiência visual repetida das barras. Distrator canônico de comparação: escolher a fração de denominador maior.
- Nesta fase, só frações unitárias (1/n). O nome fala primeiro ("um quarto"), o símbolo 1/4 entra como legenda.

### Nível 3 — o numerador conta peças (N5.02)
3/4 não é um número mágico: é **3 vezes a peça de 1/4**. Pedido: *"sirva 3/4 de pizza"* — ela arrasta 1/4, mais 1/4, mais 1/4, e a notação acompanha: 1/4+1/4+1/4 = 3/4. O denominador é o SOBRENOME da peça (a família do corte); o numerador é QUANTAS peças. Fração na reta (N5.02c): a peça vira comprimento, 3/4 mora entre 0 e 1. 🧒 *Erro:* achar que 3/4 e 4/3 são a mesma coisa — a reta desmonta (um mora antes do 1, o outro depois).

### Nível 4 — operar peças da MESMA família (N5.04)
1/4 + 2/4: juntar fatias do mesmo tamanho = 3/4. Simples — SE a base anterior existe. 🧒 **O erro-monstro que este design previne:** somar em cima E embaixo (1/4+2/4 = 3/8). Por que a criança faz isso? Porque trata a fração como dois inteiros empilhados. A vacina: as peças físicas — juntar 1 fatia com 2 fatias dá 3 FATIAS, e as fatias continuam sendo quartos (o corte não mudou!). Distrator obrigatório: (a+c)/(b+d). Denominadores diferentes só DEPOIS, via equivalência (transformar as peças na mesma família primeiro).

### Nível 5 — equivalência: a troca de moedas (N5.03)
A parede de frações: a barra de 1/2 em cima, uma grade de quartos vazia embaixo. Missão: cobrir a 1/2 perfeitamente com peças de 1/4. Ela encaixa 2 e vê o encaixe milimétrico → a tela brilha: **1/2 = 2/4**. Ela não decorou "multiplica em cima e embaixo" — ela VIU a mesma área com nomes diferentes. A regra formal chega depois como descrição do que os olhos já sabem.
- 🧒 *Erro:* aceitar quase-encaixes (2/5 "quase" cobre 1/2). O snap magnético rejeita com haptic — ou encaixa exato, ou não é equivalente.

## Microtutoriais
**"O Corte Justo"** (N5.01) · **"A Família da Peça"** (N5.02 — I do: tutor serve 2/3 contando peças; We do: 3/4; You do: 2/4) · **"Cobre a Barra"** (N5.03, equivalência).

## Regras de implementação
1. **Barras, não pizzas** — criança não compara ângulos; barra vira comprimento e conecta direto à reta numérica. (Pizza só como tempero narrativo ocasional, nunca como modelo principal.)
2. Zero notação no nível 0-1; nome falado antes do símbolo sempre.
3. Snap de equivalência binário: encaixe perfeito ou rejeição háptica.
4. Frações sempre de um TODO visível — nunca soltas no ar (o todo de referência é metade do conceito).

---

# 💰 DECIMAIS, PORCENTAGEM E PROPORÇÃO → N6.01-N6.04
*Didática construída nesta versão (era a 1ª lacuna apontada no \`ANALISE_E_BIBLIOGRAFIA.md\`). A missão: amarrar R\$ 1,50 ↔ 1½ ↔ 150% num sistema só.*

## Por que trava
Decimais chegam como "números com vírgula" — uma notação sem corpo. Sintomas clássicos: achar que **0,45 > 0,5** ("45 é maior que 5"); alinhar 2,5+0,25 pela direita como inteiros; ler R\$ 1,50 sem ligar com "um real e meio". Causa: ninguém mostrou que o decimal é só a CONTINUAÇÃO do sistema de pacotes (N2) para baixo — se 10 unidades fazem 1 dezena, então 1 unidade se parte em 10 décimos. A mesma fábrica, agora ao contrário.

## A escada
\`\`\`
 Nível 5: Razão e proporção (receita, escala, velocidade)   → N6.04
 Nível 4: Porcentagem — a fração de 100 universal           → N6.03
 Nível 3: As 4 operações com decimais                       → N6.02
 Nível 2: A trinca fração ↔ decimal ↔ dinheiro              → N6.01c
 Nível 1: Décimos e centésimos no quadro posicional         → N6.01a-b
 Nível 0: O dinheiro como decimal vivido (R\$ 1,50)          → GM.03 (ponte)
\`\`\`

## ▶️ Primeira vez
A barra de 1 inteiro (a mesma das frações!) fatiada em 10. Tutor: *"Lembra do pacote de 10? Agora é o contrário: vamos ABRIR o 1 em 10 pedacinhos. Cada pedacinho é um DÉCIMO."* A criança pinta 3 → *"três décimos"* → e a notação 0,3 entra como legenda: *"a vírgula é a portinha: à esquerda, inteiros; à direita, os pedacinhos."* No quadro posicional, a casa nova aparece à DIREITA da unidade — a fábrica de pacotes estendida.

## Nível a nível

### Nível 1-2 — o corpo do decimal (N6.01)
- Décimos e centésimos na barra e no quadrado de 100 (o mesmo quadrado da centena, agora como 1 inteiro repartido — simetria proposital). A trinca sagrada treinada como jogo de ligar: **1/2 ↔ 0,5 ↔ R\$ 0,50** · **1/4 ↔ 0,25** · **3/4 ↔ 0,75** · **1/10 ↔ 0,1**.
- 🧒 **O erro-fundador (0,5 vs 0,45):** ela lê "cinco" contra "quarenta e cinco". A cura visual: as duas barras pintadas lado a lado — 0,5 cobre METADE, 0,45 cobre menos. Regra deduzida: comparar decimal é comparar ÁREA/posição, casa por casa da esquerda pra direita — nunca "o número todo". Distrator canônico: escolher o decimal com mais algarismos.
- 🧒 *Outro:* achar que 0,3 e 0,30 são diferentes (o quadrado de 100 mostra: 30 centésimos cobrem exatamente 3 décimos).

### Nível 3 — operar com a vírgula (N6.02)
+/− com a vírgula ALINHADA (a portinha em cima da portinha — o app trava o desalinhamento e mostra as barras do porquê); ×10/÷10 como o deslize de casa (herdado de N4.08 — nunca "anda a vírgula" decorado: são os ALGARISMOS que mudam de casa); decimal×inteiro com barras; decimal÷inteiro no contexto de troco (7,50÷5); decimal÷decimal igualando as casas (4,8÷0,4 → 48÷4). 🧒 *Erros mapeados no Grafo N6.02 — cada um com seu distrator.*

### Nível 4 — porcentagem: a fração de elite (N6.03)
Por cento = **por cada 100** — e o quadrado de 100 já é velho amigo. 50% pinta metade dele; 25% um quarto; 10% uma coluna. A trinca vira quarteto: 1/2 ↔ 0,5 ↔ 50% ↔ metade de qualquer coisa. Os atalhos nascem do visual: 10% = dividir por 10 (uma coluna); 50% = metade; 5% = metade dos 10%; 25% = metade da metade. Daí compõe qualquer coisa: 15% = 10% + 5%.
- 🧒 *Erro:* "30% de 50" respondido 30 (ignora o "de"). E1: *"30% é 30 de cada 100. Aqui só tem 50 — então é a METADE de 30."* Problemas sempre com âncora concreta (desconto na loja, bateria do celular, barra de vida do jogo).

### Nível 5 — proporção: o pensamento em pares (N6.04)
A receita: 2 xícaras de farinha para 3 ovos. Dobrou a farinha? Dobra os ovos. A **tabela de razão** (ratio table) como ferramenta visual: colunas que crescem juntas multiplicando. 🧒 **O erro-definidor (pensamento aditivo):** "2 pra 3, então 4 pra 5" (somou 2 dos dois lados em vez de dobrar). Distrator obrigatório: a versão aditiva. A cura: a receita QUEBRA na tela (bolo solado) quando a proporção é aditiva — o gosto do erro antes da regra. Proporção fecha o ciclo: é a ponte para N5.05 (multiplicar frações = "de" como operador) e para toda a física escolar futura.

## Microtutoriais
**"Abrindo o Inteiro"** (N6.01) · **"A Corrida das Barras"** (N6.01, comparação 0,5 vs 0,45) · **"O Quadrado dos 100"** (N6.03) · **"A Receita do Dragão"** (N6.04, ratio table).

## Regras de implementação
1. O quadrado de 100 é o MESMO objeto visual da centena (N2.04), das frações /100 e da porcentagem — uma imagem mental, três leituras.
2. Dinheiro (GM.03) é o laboratório permanente de decimais: todo micro de N6 tem versão com R\$.
3. Vírgula brasileira sempre (1,5) — ponto decimal nunca aparece.
4. Comparações de decimais SEMPRE com barra/área disponível até nível 4 da competência.

---

# 🌡️ INTEIROS — O MUNDO ABAIXO DO ZERO → N7.01, N7.02
*Didática construída nesta versão. Fecha a última strand numérica (F4): a reta que a criança conhece desde N1.12 finalmente abre o lado esquerdo.*

## Por que trava
Os negativos chegam na escola como regras de sinal decoradas — e a regra da multiplicação VAZA para a adição (−2 + −3 = +5?). Sintoma-diagnóstico: *"−5 > −2, porque 5 é maior que 2"*. Causa: a reta numérica mental da criança termina no zero; ninguém abriu o lado de baixo com contextos que ela já vive.

## A escada
\`\`\`
 Nível 2: Operar — movimento na reta, fichas, subtrair dívida → N7.02
 Nível 1: A reta completa — comparar, oposto, zero no centro  → N7.01b-d
 Nível 0: Contextos vividos — elevador, termômetro, saldo     → N7.01a
\`\`\`

## ▶️ Primeira vez
O elevador do prédio: térreo (0), andares 1, 2, 3... e a garagem embaixo. Tutor: *"O elevador DESCEU pra garagem. Que andar é esse? É o andar MENOS UM — um abaixo do térreo."* Depois o termômetro num dia de inverno: *"três graus ABAIXO de zero"*. O sinal − nasce como **endereço** (o lado de baixo/esquerda do zero), não como operação. Só então a velha reta de N1.12 volta — espelhada, com o zero virando o CENTRO do mundo.

## Nível a nível

### Nível 0-1 — morar na reta completa (N7.01)
- Comparar: 🧒 **o erro-chefão dos inteiros:** −5 > −2 "porque 5 > 2" (a lógica dos naturais vazando — igualzinho ao 1/8 > 1/4 das frações). A cura nunca é a regra falada: é o termômetro (−5 é MAIS FRIO) e o elevador (−5 é MAIS FUNDO). Regra deduzida: **mais à esquerda = menor.** Distrator canônico: a comparação pelos módulos.
- Oposto e distância ao zero (módulo informal): −3 e 3 são vizinhos do zero à MESMA distância, em lados opostos — o espelho da reta.

### Nível 2 — operar com corpo (N7.02)
- **Somar/subtrair como movimento:** ganhar/perder, subir/descer — saltos bidirecionais na reta. −3 + 5: começa no −3, anda 5 pra direita, chega no 2.
- **O modelo de fichas:** ficha +1 e ficha −1 se ANULAM em par (poof!). −3 + 5 = três pares somem, sobram 2 positivas. 🧒 *Erros mapeados:* −3+5 tratado como −(3+5); "menos com menos dá menos" na SOMA (−2 + −3 = +5?) — as fichas desmontam: juntar dívida com dívida dá dívida maior.
- **Subtrair negativo:** *"tirar uma dívida é GANHAR"* — o mascote deve 3 moedas; a dívida é perdoada (sai da tela) → ele ficou 3 moedas mais rico. A cena antes do símbolo, como sempre.
- **Regras de sinal da × e ÷ por padrão observado, nunca por decreto:** a tabela viva 3×(−2)=−6, 2×(−2)=−4, 1×(−2)=−2, 0×(−2)=0, (−1)×(−2)=... — a sequência REVELA o +2. 🧒 *O vazamento clássico:* decorar a regra da × e aplicá-la na adição — atacado mostrando lado a lado a conta de + (fichas) e a de × (padrão): mundos diferentes, ferramentas diferentes.

## Microtutoriais
**"O Elevador"** (N7.01) · **"As Fichas que Somem"** (N7.02 — I do: tutor resolve −4+6 anulando pares; We do: −3+5; You do: −2+6) · **"A Dívida Perdoada"** (N7.02c).

## Regras de implementação
1. O − de endereço (negativo) e o − de operação (subtração) nascem separados — a fala do tutor SEMPRE distingue ("menos três" vs "tirar três").
2. Termômetro/elevador disponíveis como apoio em toda comparação até nível 4 da competência.
3. Regras de sinal só por padrão observado na tabela viva.
4. Fichas com anulação animada em pares — o par que some é a alma do modelo.

---

# 🧠 LÓGICA, PADRÕES E ÁLGEBRA — O BERÇO DO X → AL.01-AL.08
*Fonte: \`logica-e-padroes.md\`, expandido e costurado ao Grafo.*

## Por que trava
A escola reduz matemática a contas e joga o raciocínio lógico pra "passatempo". Sintoma: o aluno calcula rápido, mas trava em *"o dobro de um número secreto é 10 — que número é?"*. Causa: nunca treinou reconhecer padrões nem manipular o desconhecido. No SAGA a álgebra começa aos 4 anos — sem uma letra sequer — como detetive de padrões e equilibrista de balanças.

## A escada
\`\`\`
 Nível 5: O valor oculto — pré-álgebra e equações            → AL.05, AL.06, AL.07, AL.08
 Nível 4: Padrões numéricos (sequências e regra)             → AL.04
 Nível 3: Padrões crescentes visuais (a escadinha)           → AL.04a
 Nível 2: Padrões ABC/AAB — chunks                           → AL.02b
 Nível 1: Padrão AB e o intruso                              → AL.01b, AL.02a
 Nível 0: Classificação por atributo                         → AL.01a
\`\`\`

## ▶️ Primeira vez
O trem: vagão azul, vagão verde, azul, verde... e um engate vazio. **O app NÃO explica o padrão.** Cada vagão certo toca uma nota (bip-BOP-bip-BOP). A criança escolhe a cor do próximo — se acerta, a música continua; o cérebro dela internalizou a unidade que se repete sem uma palavra de teoria. *Regra de ouro do assunto: padrão se SENTE antes de se explicar.*

## Nível a nível

### Nível 0-1 — o detetive de atributos (AL.01, AL.02a)
Classificar é filtrar o caos: *"ponha no frasco só os insetos de asa vermelha"*. A criança aprende a isolar UMA variável ignorando as outras — a habilidade que anos depois se chamará "isolar o x". O intruso: 3 triângulos azuis e 1 vermelho — qual não pertence? 🧒 *Limite real:* aos 4-5 anos, UM eixo de exceção por vez (cor OU forma). Dois eixos cruzados (o quadrado azul entre triângulos azuis e quadrados vermelhos) só em níveis altos — antes disso é chute, não dedução.

### Nível 2-3 — do que repete ao que cresce (AL.02b, AL.04a)
Padrões AAB/ABC: a criança aprende a ver BLOCOS (chunks) — "triângulo-triângulo-círculo" é uma unidade, não três coisas. 🧒 *Erro:* continuar por espelhamento em vez de repetição (ABC-CBA). E1: *"canta o padrão comigo — o que vem depois do círculo, lá no COMEÇO da música?"*. Depois, o pulo conceitual: **padrões que CRESCEM.** A escadinha: fase 1 = 1 bloco, fase 2 = 3, fase 3 = 5. *"Construa a fase 4."* Ela descobre "ganha 2 por degrau" — acabou de VER a função y=2x+1 sem saber que existe função. 🧒 *Erro:* copiar a última fase em vez de crescer. E1: *"quantos blocos NOVOS chegaram da fase 2 pra 3? Então..."*

### Nível 4 — padrões viram números (AL.04b-c)
5, 10, 15, __, 25 nas ilhas do sapo. A ponte: ela conecta o salto (+5) com os trens e escadas de antes. Regra de formação verbalizada: *"anda de 5 em 5"*. E a matriz de Sudoku 4×4 (símbolos): dedução por EXCLUSÃO pura — *"se o 3 já está na linha, aqui só pode ser o 1"*. 🧒 *Sinal de chute:* preencher rápido sem olhar linha E coluna — o motor detecta pelo rt baixo + erro e injeta o microtutorial da exclusão.

### Nível 5 — a incógnita no corpo (AL.05 → AL.08)
**A balança é a alma da álgebra.** Prato esquerdo: 2 maçãs. Direito: peso de 10kg. Equilibrada. *"Quanto pesa 1 maçã?"* Depois: 1 maçã + peso de 2kg = 10kg. A criança ARRASTA os 2kg pra fora → a balança PENDE (física real, inegociável) → ela precisa tirar 2 do outro lado pra reequilibrar. Acabou de fazer x+2=10 → x=8 **com as mãos**. A igualdade deixa de ser "onde sai a resposta" e vira EQUILÍBRIO — a correção do maior mal-entendido da aritmética escolar.
- 🧒 **O erro-monstro (o = como "resultado"):** \`5+3 = __+4\` respondido 8. A criança lê "= me dá a resposta". A balança é a vacina: 5+3 de um lado, __+4 do outro — 8 no espaço deixa a balança torta na frente dos olhos dela. Distrator obrigatório em AL.05: a soma do lado esquerdo.
- AL.06-AL.08 (F3-F4): a maçã vira caixinha misteriosa, a caixinha vira x, e as equações do 1º grau se resolvem com os MESMOS gestos da balança (tirar dos dois lados, repartir dos dois lados). A linguagem algébrica chega como taquigrafia do que o corpo já sabe.

## Microtutoriais
**"O Frasco do Detetive"** (AL.01) · **"A Música do Padrão"** (AL.02) · **"A Escadinha que Cresce"** (AL.04) · **"A Balança Justa"** (AL.05 — I do: tutor resolve 🍎+3=8 tirando 3 dos dois lados; We do: 🍎+2=9; You do: 🍎+4=10).

## Regras de implementação
1. Cada atributo de padrão tem um SOM próprio (bip/bop) — o cérebro infantil pega padrão sonoro antes do visual.
2. A balança tem física real: desequilíbrio SEMPRE pende visivelmente.
3. Intruso: 1 eixo de exceção no fácil, 2 cruzados só no avançado.
4. Nunca apresentar "x" antes de AL.06; antes disso, objetos e caixinhas misteriosas.

---

# 📐 GEOMETRIA — VAN HIELE E O RACIOCÍNIO ESPACIAL → GE.01-GE.10
*Fonte: \`geometria.md\`, expandido e costurado ao Grafo.*

## Por que trava
A escola ensina o MOLDE, não a propriedade: a criança decora o triângulo equilátero de base reta e, diante de um escaleno de ponta-cabeça, diz *"isso não é triângulo, parece um dente"*. Van Hiele mostrou que o pensamento geométrico sobe níveis inquebráveis: visual → análise de propriedades → relações. O SAGA obriga a mão a girar, desmontar e reconstruir as formas ANTES de nomeá-las.

## A escada
\`\`\`
 Nível 5: 3D — sombras, vistas, volume                       → GE.10, GE.04
 Nível 4: Simetria e transformações                          → GE.03b, GE.09
 Nível 3: Compor e decompor (Tangram)                        → GE.03a, GE.07
 Nível 2: Propriedades — vértices e lados                    → GE.02b, GE.07
 Nível 1: Reconhecimento universal (o teste do giro)         → GE.02a
 Nível 0: Topologia — aberto/fechado, dentro/fora            → GE.01
\`\`\`

## ▶️ Primeira vez
Cercas de fazenda na tela — algumas fechadas, uma com abertura. *"Coloque os porquinhos onde eles NÃO podem fugir!"* A criança testa; do chiqueiro aberto o porquinho escapa correndo (e ri). Ela descobre a propriedade primordial de toda forma geométrica: **é um laço fechado**. Dentro/fora, aberto/fechado, curva/reta — a topologia antes da geometria, como o cérebro realmente desenvolve.

## Nível a nível

### Nível 1 — o teste do giro (GE.02a)
Meteoros geométricos caem: triângulos de cabeça pra baixo, esmagados, esticados. *"Atire em TODOS os triângulos!"* 🧒 **O erro que define o nível:** deixar passar o escaleno fininho ("parece um dente") e atirar no losango "porque parece". A forma é inviolável à rotação e à escala — e isso só entra girando DE VERDADE: o gerador aplica rotação aleatória em TODA forma renderizada nos níveis 1-2 (regra dura). E1: *"gira ele na sua cabeça... quantas pontas tem?"*

### Nível 2 — a anatomia da forma (GE.02b)
O polvo detetive: *"ponha uma estrela-do-mar em cada PONTA da figura"*. Cada vértice é um hotspot que faz "plim!". Três estrelas grudadas → a figura ganha vida: *"TRÊS pontas! Isso é um TRI-ângulo!"* **A definição nasce da anatomia, não do dicionário.** Depois: contar lados, achar lados iguais (o quadrado como retângulo especial — plantada cedo a semente da hierarquia). 🧒 *Erro:* contar o mesmo vértice duas vezes girando sem método — o app apaga a estrela se já tem, ensinando varredura ordenada.

### Nível 3 — o motor de composição (GE.03a, GE.07)
Tangram dinâmico: a silhueta do foguete vazada, peças soltas embaixo. **A mágica: dois triângulos iguais unidos pela hipotenusa FUNDEM num quadrado** (colisão e fusão de polígonos — regra de software). A criança entende que áreas grandes são feitas de blocos menores — a mente sendo preparada para o cálculo de área (GM.08) sem saber. 🧒 *Frustração típica:* peça certa, rotação errada — o snap sugere leve rotação quando a peça está a ≤15° do encaixe.

### Nível 4 — o espelho e as transformações (GE.03b, GE.09)
Metade de uma borboleta, a linha de simetria brilhando no meio. Construir o outro lado — com a INVERSÃO certa (o bloco que aponta pra fora, aponta pra fora do outro lado também). 🧒 **O erro universal:** copiar em vez de espelhar (translação em vez de reflexão). O app mostra o "fantasma" do reflexo correto ao errar 2× (E2 visual). Rotação e translação como movimentos nomeados: girar, deslizar, espelhar — os três verbos das transformações.

### Interlúdio — o espaço navegável (GE.05, GE.06, GE.08)
Entre as formas e o 3D, o ESPAÇO vira mapa: dar e seguir caminhos ("2 pra frente, vira à direita" — o pensamento computacional de AL entrando na geometria), localizar na grade (batalha-naval simplificada: casa B3), e — em F3-F4 — o giro vira ÂNGULO (GE.06: reto como "canto de porta", agudo "bico", obtuso "aberto"; o transferidor só depois do corpo girar) e a grade vira plano cartesiano (GE.08: o par ordenado como endereço "anda X, sobe Y" — a caça ao tesouro que prepara os gráficos de função). 🧒 *Erro clássico do par ordenado:* inverter (3,2)↔(2,3) — a fala canônica "primeiro ANDA, depois SOBE" + o distrator invertido obrigatório.

### Nível 5 — a terceira dimensão (GE.04, GE.10)
Sólidos como objetos da casa (lata=cilindro, dado=cubo, casquinha=cone). **O jogo das sombras:** a lanterna em cima do cilindro → sombra círculo; de lado → retângulo. A criança ARRASTA a lanterna e vê a sombra mudar em tempo real — a relação 3D↔2D no músculo. Planificação: desdobrar a caixa de presente e ver as 6 faces abertas. Vistas (de cima, de frente, de lado) e volume por empilhamento de cubinhos (GE.10, ligado a GM.08). 🧒 *Erro:* confundir face com forma ("o cilindro é um círculo") — o jogo da sombra existe pra isso: o cilindro TEM sombra círculo, mas não É um círculo.

### O ramo do espaço — mapas, ângulos e coordenadas (GE.05, GE.06, GE.08)
- **Localização (GE.05):** seguir e dar caminhos na grade (*"2 pra frente, vira à direita"*) e a coordenada informal estilo batalha-naval (casa B3). 🧒 *O erro que é um marco de desenvolvimento:* a esquerda DO PERSONAGEM vs a MINHA esquerda (descentração) — o micro (d) existe pra isso: primeiro o boneco de costas (as esquerdas coincidem), só depois de frente.
- **Ângulos (GE.06):** reto/agudo/obtuso com o canto da folha como gabarito físico; o giro como ângulo (¼ de volta = 90° — o corpo gira junto). 🧒 *Erros:* "ângulo maior = lados mais compridos" (cura: dois ângulos IGUAIS com lados de tamanhos diferentes, sobrepostos — ângulo é ABERTURA, não comprimento); a leitura do duplo-arco do transferidor (60° vs 120°) — E1: *"é agudo ou obtuso? Então qual número faz sentido?"* — estimar SEMPRE antes de ler.
- **Plano cartesiano (GE.08):** ler e marcar (x, y) com a fala-âncora **"primeiro ANDA, depois SOBE"**; a caça ao tesouro em que a sequência de pontos desenha uma figura surpresa. 🧒 *O erro único e universal:* inverter (x, y) — distrator canônico obrigatório: o ponto invertido.

## Microtutoriais
**"O Chiqueiro"** (GE.01) · **"Caça-Pontas"** (GE.02) · **"Funde as Peças"** (GE.03/Tangram) · **"O Espelho Mágico"** (GE.03b) · **"A Lanterna"** (GE.04/GE.10).

## Regras de implementação
1. Rotação aleatória em TODA forma dos níveis 1-2 (transform: rotate() no gerador — nunca a forma "de livro").
2. Vértices são hotspots interativos, não cantos mortos do SVG.
3. Tangram com snap-to-grid + fusão real de polígonos + haptic no encaixe.
4. Nome da forma SEMPRE depois da propriedade contada (pontas → nome), nunca antes.

---

# 📏 GRANDEZAS E MEDIDAS — TAMANHO, TEMPO E DINHEIRO → GM.01-GM.09
*Fonte: \`medidas.md\`, expandido e costurado ao Grafo.*

## Por que trava
A escola começa pela régua e pelo "1 hora tem 60 minutos". Sintoma: a criança lê "3 cm" mas não sabe se 3 cm é uma formiga ou um ônibus; lê o relógio mas não sente a duração. Causa: pular a comparação direta e as unidades não-padronizadas — os estágios onde o conceito de MEDIR nasce.

## A escada
\`\`\`
 Nível 5: Instrumentos formais — régua, relógio completo     → GM.05c, GM.06
 Nível 4: O valor do dinheiro (fiduciário)                   → GM.03
 Nível 3: Unidades não-padronizadas — iteração               → GM.05a
 Nível 2: Tempo — sequência e rotina                         → GM.02, GM.04
 Nível 1: Transitividade e conservação                       → GM.01b
 Nível 0: Comparação direta                                  → GM.01a
\`\`\`

## ▶️ Primeira vez
Dois prédios tortos na tela. *"Qual é o mais alto?"* A criança tenta responder de olho — mas os prédios estão em alturas diferentes da tela. Ela descobre que precisa **arrastar e alinhar as bases no chão** primeiro. *"Agora sim dá pra ver!"* O primeiro princípio físico da medição: só se compara a partir da mesma linha de largada.

## Nível a nível

### Nível 0-1 — comparar sem números (GM.01)
Mais alto/baixo, mais pesado/leve (a gangorra), mais comprido/curto, cabe/não cabe. **Conservação (o teste de Piaget):** dois galhos idênticos alinhados; o app desliza um pra direita — *"algum ficou maior?"*. 🧒 *A ilusão é NORMAL até ~6 anos:* a criança jura que o deslocado cresceu. O app devolve o galho ao alinhamento em animação lenta, quantas vezes ela quiser — a reversibilidade vista cura a ilusão com o tempo, não com bronca. **Transitividade:** se a torre A > B e B > C... A > C sem precisar juntar A com C — o primeiro raciocínio dedutivo em cadeia.

### Nível 2 — o tempo que se sente (GM.02, GM.04)
Antes do relógio, a SEQUÊNCIA: ordenar a rotina (acordar → escovar → escola) em cartões; dia/noite; ontem/hoje/amanhã; os dias da semana como música. Depois o relógio SÓ de horas: um ponteiro, o céu mudando de cor conforme gira (sol, entardecer, estrelas). 🧒 *Por que sem minutos:* ler minutos exige contar de 5 em 5 (AL.03b) — apresentar os dois ponteiros juntos é sobrecarga clássica. O ponteiro dos minutos chega em GM.06, e ao girá-lo flores nascem e o contador canta "5 minutos! 10 minutos!" — a duração como coisa viva, não número decorado.

### Nível 3 — a invenção da unidade (GM.05a)
*"Qual a largura do rio?"* — a criança enfileira **tartarugas idênticas** casco com casco, sem vãos, sem sobrepor, até formar a ponte: *"o rio mede 6 tartarugas!"* 🧒 *Os dois erros que ENSINAM:* deixar vão (as tartarugas caem no rio!) e sobrepor (tartaruga esmagada reclama). A regra intelectual deduzida: **medir = repetir uma unidade igual, em linha, sem buraco nem sobra.** Depois, a crise que pede o padrão: *"meu rio mede 6 tartarugas, o seu mede 9 minhocas — qual é maior?"* Não dá pra saber! → nasce a NECESSIDADE do centímetro (GM.05b-c), não a imposição dele.

### Nível 4 — o dinheiro pensa diferente (GM.03)
🧒 **A armadilha fiduciária:** 6 moedas de 1 "valem mais" que 3 moedas de 10 — porque 6 objetos é mais que 3 (a lógica da contagem, correta a vida inteira, aplicada onde não vale). **O Supermercado Mágico:** a maçã custa 5; ela paga com 5 moedas de 1 — funciona; a máquina SUGA as 5 moedinhas e cospe UMA moeda de 5 brilhante. O tamanho encolheu, o poder de compra ficou. Troco como completar (ligando com N3.04c): paguei 10, custou 7 — o vendedor conta PRA FRENTE: 8, 9, 10 → troco 3. Centavos como ponte viva para os decimais (N6.01).

### Nível 5 — os instrumentos com alma (GM.05c, GM.06)
**Perímetro (GM.07) — a régua dando a volta:** a formiguinha caminha o CONTORNO do jardim; perímetro = a viagem dela, somando lado a lado. 🧒 *Erro que define o par perímetro/área:* confundir os dois — a formiga anda na CERCA (perímetro), a grama pintada é a ÁREA (GM.08, ladrilhada com quadradinhos — que reencontra o modelo de área de N4.09!). Os dois sempre ensinados em contraste, nunca isolados.

**A régua quebrada** — o teste supremo: régua com o 0, 1 e 2 apagados; o lápis alinhado no 3, terminando no 8. *"Quanto mede?"* 🧒 *Quem decorou responde 8; quem ENTENDEU conta os pulos: 8−3 = 5 cm.* Distrator canônico: a leitura da ponta. Relógio completo, duração ("o filme começa às 3h e dura 1h30 — termina quando?"), e as conversões de GM.09 SÓ com âncoras corporais: 1 cm = unha do dedão, 1 m = um passo grande de adulto, 1 kg = pacote de arroz, 1 L = caixa de leite. Estimar antes de medir, SEMPRE — o senso de grandeza é o objetivo final, o número é só o registro.

### O contorno — perímetro (GM.07)
A formiguinha anda EM VOLTA da figura na malha quadriculada, deixando rastro: perímetro é o caminho do contorno. Somar lados dados; deduzir o lado oculto do retângulo (*"se este mede 5, o de lá mede..."*). 🧒 *O erro que define o design:* contar os quadradinhos DE DENTRO em vez do contorno — a colisão frontal com área, e o motivo de área (GM.08) só chegar DEPOIS, quando o contorno estiver firme. Fecho do nível: duas figuras DIFERENTES com o MESMO perímetro (a formiguinha anda o mesmo tanto!) — separando de vez contorno de "tamanho da figura".

## Microtutoriais
**"A Linha de Largada"** (GM.01) · **"A Ponte de Tartarugas"** (GM.05) · **"A Máquina de Trocar"** (GM.03) · **"A Régua Quebrada"** (GM.05c).

## Regras de implementação
1. Comparações de nível 0 forçam o alinhamento de base antes de aceitar resposta.
2. Iteração de unidades com snap ponta-a-ponta; vão ou sobreposição têm consequência física narrada, não "X vermelho".
3. Relógio: horas primeiro, SEMPRE; minutos só com AL.03b dominado (o grafo garante via GM.06).
4. Toda unidade padrão nasce de uma crise de comunicação (tartarugas vs minhocas), nunca por decreto.

---

# 📊 DADOS E PROBABILIDADE — ORGANIZAR O CAOS → PE.01-PE.04
*Didática construída nesta versão (era a 2ª lacuna apontada no \`ANALISE_E_BIBLIOGRAFIA.md\`).*

## Por que trava
Gráficos chegam prontos na prova, e a criança nunca COLETOU um dado na vida. Sintoma: lê a barra mais alta mas não sabe responder "quantos a mais?"; acha que no dado "o 6 é mais difícil de sair". Causa: pular a experiência de contar o mundo real e transformar bagunça em desenho — e tratar o acaso como mágica em vez de fração.

## A escada
\`\`\`
 Nível 5: Média, moda e a probabilidade como fração          → PE.03, PE.04
 Nível 4: Possível, impossível, provável                     → PE.02b
 Nível 3: Gráfico de barras — construir e LER                → PE.02a
 Nível 2: Pictograma — um desenho por coisa                  → PE.01b
 Nível 1: Risquinhos de contagem (tally)                     → PE.01a
 Nível 0: A pergunta e a coleta                              → PE.01a
\`\`\`

## ▶️ Primeira vez
*"Os bichos da floresta vão votar: qual a fruta favorita?"* Os bichos passam um a um declarando (áudio): "Banana!" "Maçã!" "Banana!"... A criança faz um **risquinho** na coluna certa a cada voto — e o quinto risco corta o feixe (a portinha do 5, ligando com a sub-base 5). No fim: *"quem venceu?"* — ela olha os feixes e VÊ. Acabou de coletar, registrar e ler dados. O gráfico ainda nem existe.

## Nível a nível

### Nível 1-2 — do risquinho ao pictograma (PE.01)
Tally com feixes de 5 → contar de 5 em 5 (AL.03 pagando dividendo). Depois o pictograma: cada voto vira UMA figurinha empilhada na coluna. 🧒 *Erro de leitura:* responder "qual tem mais" pelo desenho mais LARGO em vez de mais figurinhas — por isso figurinhas de tamanho idêntico e colunas alinhadas pela base (o mesmo princípio de GM.01!). Pergunta de ouro em toda coleta: *"quantos a MAIS?"* — que é comparação/subtração (N3.04) disfarçada de gráfico.

### Nível 3 — a barra abstrata (PE.02a)
As figurinhas se fundem numa BARRA sólida (animação: o pictograma derrete na barra) — e nasce o eixo com escala. Construir primeiro, ler depois. Escala de 2 em 2: cada quadradinho vale 2 votos. 🧒 *Erro clássico:* ler a barra na escala errada (altura 4 quadradinhos = "4" quando vale 8). E1: *"quanto vale CADA degrau da escada do lado?"* Distrator canônico: a leitura em escala unitária.

### Nível 4 — o vocabulário do acaso (PE.02b)
O saquinho transparente: 5 bolinhas vermelhas, 1 azul. *"Se pescar de olho fechado, qual PROVAVELMENTE sai?"* Certo/possível/impossível/provável/improvável — sentidos no corpo antes do número: tirar bolinha verde desse saco é IMPOSSÍVEL (não tem!); tirar vermelha é provável (tem mais). 🧒 *Erro-raiz (o pensamento mágico):* "azul vai sair porque é a minha cor favorita" / "o 6 é difícil". O app deixa PESCAR de verdade 10 vezes e anota (tally!) — o dado experimental combatendo a superstição. E o contra-erro do adulto: sair vermelha 3 vezes NÃO garante azul agora (a falácia do jogador, plantada cedo como "a bolinha não tem memória").

### Nível 5 — o acaso vira fração, os dados viram um número (PE.03, PE.04)
Probabilidade como fração (N5.02 pagando dividendo): 1 azul em 6 bolinhas = 1/6 de chance. Experimento vs teoria: gira a roleta 20 vezes, compara o tally com a previsão — *"parecido, mas não igualzinho — o acaso é assim!"*. **Média como nivelamento físico:** 3 torres de altura 2, 5 e 8 — a criança MOVE cubinhos das altas pras baixas até ficarem iguais (altura 5). A média é "se todo mundo dividisse igual" — repartição (N4.05!) antes da fórmula somar-e-dividir. Moda = o mais frequente (o campeão do tally). 🧒 *Erro:* confundir média com o maior valor, ou achar que a média tem que ser um dos números da lista.

## Microtutoriais
**"A Votação da Floresta"** (PE.01) · **"Derretendo o Pictograma"** (PE.02a) · **"O Saquinho da Sorte"** (PE.02b) · **"Nivelando as Torres"** (PE.03, média).

## Regras de implementação
1. Todo gráfico que a criança LÊ, ela antes CONSTRUIU de dados coletados na cena (regra construir-antes-de-ler, por competência).
2. Pictogramas com ícones de tamanho idêntico, colunas com base alinhada.
3. Probabilidade sempre com o experimento disponível (pescar/girar de verdade) ao lado da teoria.
4. Falácia do jogador tratada explicitamente: "a bolinha não tem memória" é fala canônica do tutor.

---

# 🎯 O MÉ MÉTODO DE BARRAS — RESOLVER PROBLEMAS DE VERDADE (transversal)
*Didática construída nesta versão (era a 3ª lacuna do \`ANALISE_E_BIBLIOGRAFIA.md\` — e a maior dor do fundamental: "QUAL conta eu uso?").*

## Por que trava
A criança sabe as quatro operações, mas o problema em texto é um muro: ela caça os dois números e chuta uma operação (geralmente a última que treinou). Causa: ninguém ensinou a etapa do MEIO — traduzir a história em DESENHO antes de traduzi-la em conta. O Bar Model de Singapura é essa ponte, e no SAGA ele atravessa todos os assuntos a partir de F1 (N3.10) até F4.

## A escada (transversal — cresce junto com as operações)
\`\`\`
 Estágio 4: Duas etapas e frações/porcentagem na barra       → F3-F4 (N5, N6)
 Estágio 3: Barra de comparação multiplicativa (3× mais)     → F2-F3 (N4)
 Estágio 2: Barra de comparação aditiva (a mais / a menos)   → F1-F2 (N3.04, N3.10)
 Estágio 1: Barra parte-todo (junta, tira, completa)         → F1 (N3.10)
 Estágio 0: A cena vira barra (objetos → retângulo)          → F1 (ponte de N1.10)
\`\`\`

## ▶️ Primeira vez
Problema falado: *"Leo tem 3 carrinhos. Ganhou mais 2. Quantos tem agora?"* Os carrinhos aparecem NA CENA — e então deslizam para dentro de uma barra: 3 carrinhos viram um bloco laranja [3], os 2 novos viram um bloco verde [2] colado nele, e uma chave abraça os dois com "?". *"Olha: a história virou um DESENHO. O desenho mostra qual conta fazer."* A barra é a fotografia da história.

## O protocolo CUBOS (o ritual de 5 passos, sempre o mesmo)
1. **C**ena — ouvir/ler a história inteira (o app esconde os números na 1ª audição! — anti-caça-números: primeiro entender O QUE aconteceu).
2. **U**nidades — quem são as quantidades? (nomear as barras: "esta é do Leo, esta é da Luna").
3. **B**arras — desenhar/montar o modelo (arrastar blocos proporcionais).
4. **O**peração — o desenho REVELA a conta (a chave do "?" abraça o todo? → soma. O buraco entre barras? → subtração).
5. **S**olução — calcular e voltar pra história: *"faz sentido? 5 carrinhos, ele GANHOU, tinha que ter mais que 3 mesmo!"* (o teste do absurdo).

## Os quatro esqueletos (e como o desenho escolhe a conta)
- **Parte-todo:** duas partes conhecidas, todo desconhecido → soma. Todo conhecido, uma parte escondida → subtração/completar. **É o mesmo desenho** — só muda ONDE está o "?". 🧒 *Este é o insight que mata o "qual conta eu uso":* a operação não vem de palavra-chave, vem da POSIÇÃO do mistério no desenho.
- **Comparação aditiva:** duas barras alinhadas pela base, o "?" no buraco (N3.04 pagando dividendo). 🧒 **Armadilha das palavras-chave:** *"Leo tem 5, tem 2 A MAIS que Luna. Quantos tem Luna?"* — o "a mais" grita SOMA, mas a resposta é 5−2. O SAGA NUNCA ensina "palavra-chave = operação" (proibição pedagógica formal); a barra desenhada mostra que a Luna é a barra CURTA. Distrator obrigatório: a operação da palavra-chave.
- **Comparação multiplicativa:** *"Leo tem 3× os carrinhos da Luna"* → a barra do Leo são 3 CÓPIAS da barra da Luna. 🧒 *Erro:* desenhar "3 a mais" (aditivo) em vez de "3 vezes" (cópias) — o mesmo demônio aditivo de N6.04.
- **Duas etapas:** o resultado da primeira barra vira peça da segunda. O app dobra o problema em dois quadros ("primeiro descobrimos X... agora usamos X").

## Nível a nível (como o rigor cresce)
- **F1:** a cena SEMPRE se transforma em barra automaticamente (a criança assiste à tradução). Ela só escolhe onde vai o "?".
- **F2:** ela monta a barra com blocos prontos; números até 100; comparação aditiva entra.
- **F3:** ela DESENHA a barra do zero (blocos proporcionais livres); multiplicativa e duas etapas; o problema some e fica só o modelo (e vice-versa: dado um modelo, INVENTE uma história — a via de mão dupla que prova compreensão).
- **F4:** frações e porcentagem NA barra ("gastou 2/5 de 40 reais": a barra de 40 cortada em 5, pinta 2) — o Bar Model virando a ferramenta universal que resolve até problema de proporção.

## Microtutoriais
**"A História Vira Desenho"** (estágio 0) · **"Onde Mora o Mistério?"** (parte-todo, posição do "?") · **"A Pegadinha do A Mais"** (comparação — I do: tutor desenha o problema-armadilha e mostra a barra curta; We do: variação; You do: sozinho) · **"O Problema de Dois Andares"** (duas etapas).

## Regras de implementação
1. Números OCULTOS na primeira audição do problema (anti-caça-números) — aparecem na 2ª.
2. Proibido qualquer material que ensine "palavra-chave → operação". O distrator da palavra-chave é obrigatório nos geradores de N3.10 em diante.
3. Blocos de barra sempre proporcionais ao valor (a barra do 6 é visivelmente o dobro da do 3) — a proporção visual É o conteúdo.
4. Toda solução fecha com o teste do absurdo falado pelo tutor (ou, em níveis altos, perguntado à criança).
5. O modo "invente a história" (modelo → texto) é obrigatório a partir de F3 — é o detector definitivo de compreensão.

---
---

# 🔗 COMO TUDO SE AMARRA (o mapa das confluências)

As strands não são silos — elas se pagam dividendos o tempo todo, e o grafo codifica isso nas arestas. As confluências mestras, para nunca perder de vista:

- **A sub-base 5 e a moldura de 10** (Fundação) sustentam counting-on, amigos do 10, pontes de adição/subtração E o tally de Dados.
- **A contagem por saltos** (AL.03) é o motor rítmico das tabuadas, do relógio de minutos e da escala dos gráficos.
- **O pacote de 10** (N2.01) é O conceito central do app: explica o "vai 1", o "quebra a dezena", o ×10 que desliza de casa, os décimos que abrem o inteiro e o dinheiro.
- **A família de fatos** aparece duas vezes (aditiva N3.05, multiplicativa N4.06) — o mesmo triângulo, a mesma lição: operações inversas moram juntas.
- **Repartir** (N4.05) renasce nas frações (N5.01), na média (PE.03) e na balança algébrica (dividir os dois lados).
- **O quadrado de 100** é um só objeto: centena (N2.04), centésimos (N6.01), porcentagem (N6.03).
- **Barras alinhadas pela base** — comparação (GM.01), diferença (N3.04), pictograma (PE.01), Bar Model: o mesmo gesto visual, da pré-escola ao problema de F4.
- **A balança** (AL.05) é a igualdade encarnada — e o antídoto permanente contra "= significa resposta".

Quando o gerador de uma competência precisa de um visual, ele usa O MESMO objeto visual das confluências acima — nunca inventa um paralelo. Uma imagem mental, muitas leituras: é assim que o conhecimento vira rede em vez de gavetas.

---

# ✅ FECHO — O QUE ESTE MANUAL GARANTE

Cada assunto do Grafo agora tem: a primeira explicação roteirizada, a escada CPA nível a nível com a fala do tutor e a mecânica de interação, a simulação dos erros e limites reais da criança em cada degrau (🧒), os distratores canônicos que os geradores DEVEM usar, os microtutoriais nomeados com estrutura Eu faço → Fazemos juntos → Você faz, e as regras de implementação inegociáveis. As três lacunas apontadas na tua análise original (Decimais/Porcentagem, Dados, Método de Barras) estão construídas. A fundação dos 4 anos (N1/N2) ganhou didática própria. Os Inteiros (N7), o ramo do espaço (mapas, ângulos, coordenadas), o perímetro e os múltiplos/primos ganharam cobertura própria — **nenhuma das 84 competências do Grafo ficou sem casa didática.**

**Divisão de papéis definitiva:** o **Grafo** é a estrutura (o quê, em que ordem, com quais pré-requisitos e distratores) · o **Manual** é a alma (como se ensina, o que se fala, o que a criança sente e erra) · a **Bíblia** é o comportamento do sistema (motores, sessão, adaptatividade, regras duras) · o **Dojo** (doc próprio) é a academia de fluência · o **YAML** é o grafo executável. Cinco peças, uma linguagem: os IDs.

*Changelog: v2.0 (jul/2026) — detalhamento completo de todos os assuntos no padrão da divisão; novas didáticas: Fundação N1/N2, Decimais/Porcentagem/Proporção, Inteiros (N7), Dados/Probabilidade, Método de Barras; seção A Criança Real (limites de desenvolvimento); mapa de confluências.*
*v2.1 (jul/2026) — Contrato de Ensino: modelo de erro reformulado para duas camadas (resposta imediata leve que preserva o fluxo + remediação profunda por padrão, no momento certo). Regra-mãe "o fluxo é sagrado". Os E1/E2/E3 por assunto passam a descrever o CONTEÚDO de cada nível; o QUANDO é governado centralmente. Andaime de ensino distinguido de resposta a erro.*
*v2.2 (jul/2026) — Fundação N1.02: exercício-âncora Canhão de Balões (contar = tiro + numeral + som, semente da correspondência 1-a-1 e da cardinalidade) e a ordem correta da contagem (o 1 antes do 0; zero nasce concreto como "vazio", depois da cardinalidade).*
`;
