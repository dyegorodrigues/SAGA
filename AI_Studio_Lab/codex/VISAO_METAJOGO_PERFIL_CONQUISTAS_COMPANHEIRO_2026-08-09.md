# SAGA — Visão de meta-jogo, perfil, conquistas e companheiro

Data: 2026-08-09

> Documento de visão. Não autoriza tocar no Creature Engine nesta frente. O núcleo pedagógico continua soberano e a arte/mascote atual é provisória.

## 1. Visão em uma frase

O SAGA deve funcionar como um sistema operacional educacional infantil: um Tutor/Sensei meta-inteligente ensina de verdade, acompanha evidências de aprendizagem e escolhe a próxima dose pedagógica; por cima dele existe um meta-jogo persistente que transforma progresso real em identidade, exploração, coleção e vínculo com um companheiro vivo — sem permitir que XP, moeda, velocidade ou compra substituam aprendizagem.

## 2. Três progressões que nunca devem ser confundidas

### 2.1 Progressão do aprendiz — verdade pedagógica

Fonte: Curriculum Graph + `Progress` + mastery evidence + Dojo/Jardim/Oficina.

Responde: **o que a criança sabe fazer?**

- compreensão conceitual;
- independência;
- retenção;
- automaticidade/fluência quando aplicável;
- pré-requisitos;
- misconceptions;
- domínios adquiridos.

Essa camada destrava currículo. XP/moedas não têm autoridade aqui.

### 2.2 Progressão do jogador — identidade SAGA

Fonte: XP vitalício legitimamente ganho.

Responde: **quanto a criança já viveu/construiu no SAGA?**

- nível de jogador 1–100;
- título/rank cosmético;
- marcos de jornada;
- acesso a cosméticos, ambientes e celebrações que não alteram mastery.

**Decisão:** o nível 1–100 pertence à criança/perfil, não ao mascote. Trocar mascote, skin ou futuro jogo não pode apagar/trocar a identidade acumulada da criança.

### 2.3 Progressão do companheiro — vínculo e fantasia

Responde: **como o companheiro está crescendo com a criança?**

Pode ter, no futuro:

- forma/evolução;
- vínculo/amizade;
- energia/estado de animação;
- alimentação, carinho, banho, sono, treino físico e estudo;
- roupas/equipamentos/cenários;
- emoções e retratos;
- personalidade e memória narrativa;
- skills de jogo.

Ela não deve ser a mesma coisa que o nível do jogador. O companheiro pode reagir ao nível/XP/conquistas, mas tem estado próprio e substituível.

## 3. Perfil da criança

O perfil infantil deve mostrar uma leitura simples e orgulhosa do progresso, sem ranking público nem comparação humilhante.

Proposta de componentes:

1. avatar + nome;
2. **Nível SAGA 1–100**;
3. barra de XP para o próximo nível;
4. sequência/ritmo saudável, sem punição por ausência;
5. companheiro atual e seu estado;
6. carteira de moedas;
7. últimas conquistas;
8. resumo do mapa de competências;
9. botão `Meu Mapa` / `Atlas de Habilidades`;
10. coleção/álbum separado.

## 4. Atlas de Habilidades — skill map curricular

A melhor forma de aproveitar o Curriculum Graph é transformar sua leitura infantil num mapa visual de habilidades. O mapa não é uma árvore decorativa paralela: ele é uma projeção do grafo pedagógico real.

### 4.1 Nó curricular

Cada microcompetência pode assumir estados visuais derivados, por exemplo:

- descoberta/bloqueada;
- em aprendizagem;
- praticada;
- consolidada;
- domínio absoluto/coroa;
- fluência associada disponível;
- revisão necessária.

Nenhum desses estados nasce de XP.

### 4.2 Insígnias de domínio

**Insígnia curricular = evidência de competência**, não prêmio por quantidade de cliques.

Uma insígnia deve ter metadados auditáveis:

- `achievementId`;
- competência/domínio correspondente;
- critério de conquista;
- data;
- evidências que sustentaram a conquista;
- tier opcional;
- versão do critério.

Preferir estado derivado do learner state; persistir somente o recibo de desbloqueio quando for necessário para celebração/histórico.

Possível taxonomia visual:

- microinsígnias por habilidade;
- medalhas de conjunto por módulo;
- brasões grandes por domínio matemático;
- coroas raras por domínio maduro e transferível.

### 4.3 Achievements de jogo — separados das insígnias curriculares

Podem celebrar:

- primeira missão;
- recuperar uma habilidade que estava difícil;
- concluir uma Oficina;
- explorar modalidades diferentes;
- praticar por escolha própria;
- completar um grande arco;
- perseverança/metacognição;
- marcos de nível;
- coleção.

Não criar achievements que incentivem spam, velocidade cega, horas excessivas ou medo de perder sequência.

## 5. Álbum/coleção

O álbum atual permanece como **consumidor provisório de economia e bancada de teste**. Ele não deve definir o motor econômico.

Arquitetura futura deve permitir trocar a coleção por:

- criaturas/personagens;
- Pokémon apenas se houver decisão jurídica/licenciamento apropriada;
- bestiário próprio;
- cartas/lore;
- troféus;
- cenários;
- equipamentos;
- skins;
- itens de quarto/dojo.

A compra de coleção/cosmético nunca altera mastery.

## 6. Economia

### 6.1 XP

- vitalício;
- não gastável;
- alimenta Nível SAGA;
- ganho por eventos educacionais válidos;
- velocidade pode gerar **bônus pequeno de fluência**, nunca multiplicador explosivo;
- criança lenta e correta continua progredindo;
- replay legítimo pode render atividade normal, mas não duplicar bônus únicos;
- retries intermediários, double tap, remount técnico, sync/retry cloud não duplicam prêmio.

### 6.2 Moedas

- gastáveis;
- recompensa complementar;
- usadas apenas no meta-jogo/cosméticos/coleção/cuidados;
- compra precisa ser transação atômica: saldo insuficiente rejeita, não `clamp` silencioso;
- nenhuma compra compra mastery, unlock curricular ou prescrição do Sensei.

### 6.3 Futuro: outras moedas

Evitar múltiplas moedas enquanto uma única carteira resolver. Não adicionar gema premium/loot box/roleta para crianças. Caso exista monetização futura, ela deve ser separada do desempenho pedagógico e revisada juridicamente/eticamente.

## 7. Dose saudável da gamificação

Princípios de produto:

- competência: mostrar claramente progresso real;
- autonomia: a criança pode escolher treinar/explorar, mas o Sensei preserva a prescrição quando ela segue o Tutor;
- vínculo: companheiro e mundo respondem ao esforço da criança;
- surpresa narrativa pode existir, mas **não recompensa probabilística comprada**;
- não usar culpa, morte/doença, perda de evolução ou ameaça por ausência;
- não usar leaderboard público infantil como núcleo;
- não tornar o prêmio mais importante que compreender.

Cenários obrigatórios de balanceamento: 1 missão/dia; 2–3 missões/dia; uso intensivo; lenta/correta; rápida; dificuldade/retries; Oficina; Jardim; Dojo manual/prescrito; Misto; Matrícula; review; replay; offline; meses de uso.

## 8. Curva de Nível SAGA 1–100

A curva deve ser calculada a partir de XP vitalício e ser configurável/telemetricamente recalibrável. A versão inicial deve obedecer:

- níveis iniciais rápidos para mostrar movimento;
- meio de jogo progressivamente mais longo;
- nível 100 na ordem de muitos meses de uso saudável com uma missão diária;
- uso voluntário extra acelera de forma aproximadamente proporcional;
- nenhuma atividade trivial/abaixo da competência pode comprimir meses em uma tarde.

A curva é de identidade de jogador; não é escala de capacidade matemática.

## 9. Companheiro vivo / NPC meta-inteligente

Visão futura: o companheiro deixa de ser um cartão e vira um agente persistente no ecossistema SAGA.

### 9.1 Contrato de estado

Separar pelo menos:

- identidade visual;
- forma/evolução;
- vínculo;
- necessidades suaves;
- emoção;
- ação/animação atual;
- inventário/equipamentos;
- memória narrativa;
- capacidades de jogo.

O agente não lê nem escreve mastery diretamente. Ele recebe eventos do domínio educacional e reage.

### 9.2 Necessidades suaves

Comer, dormir, tomar banho, receber carinho, estudar, correr e treinar podem tornar o personagem vivo, mas devem gerar **estados expressivos**, não culpa. Ex.: cansado → dorme/boceja; não utilizado → sente saudade de modo acolhedor; nunca morre, perde nível ou pune a criança.

### 9.3 Widget futuro

Objetivo possível: widget/companheiro visível no celular, com estado sincronizado e pequenas interações.

Requisitos futuros:

- consumo mínimo de bateria;
- animação degradável/pausável;
- privacidade infantil;
- funcionamento offline parcial;
- notificações não manipulativas;
- mesma fonte de verdade do estado do companheiro no app.

## 10. Futuro jogo com os personagens

A visão contém dois formatos compatíveis.

### 10.1 Dojo Duel — fighting game

- 1×1;
- socos/chutes/garras/mordidas/especiais;
- combos;
- defesa/esquiva;
- ataques aéreos;
- poderes temáticos;
- animações e hitboxes consistentes.

Referência de gênero: fighting game de arena/2D; a menção a Marvel vs. Capcom serve como referência de sensação/combos, não como arte a copiar.

### 10.2 Expedição — 2.5D belt-scroll beat ’em up

É o formato descrito como andar lateralmente com alguma profundidade para cima/baixo da tela: personagem avança por fases, pode deslocar-se no eixo de profundidade e enfrenta inimigos em sequência.

Referência de gênero: Final Fight / Streets of Rage / beat ’em up de fliperama/SNES, com visual autoral HD pixel art moderno.

### 10.3 Contrato de animação reutilizável

O personagem futuro deve ser preparado para reutilização em Tamagotchi/widget/duelo/beat ’em up por meio de ações semânticas, por exemplo:

`idle`, `walk`, `run`, `turn`, `sleep`, `eat`, `happy`, `sad`, `hurt`, `ko`, `guard`, `dodge`, `jump`, `punch_light`, `punch_heavy`, `kick_light`, `kick_heavy`, `air_kick`, `special_1..n`, `victory`.

Arte e engine continuam projeto posterior; este documento registra a visão para não forçar o motor pedagógico a depender dos sprites atuais.

## 11. Matemática, raciocínio e preparação para um mundo de IA

O SAGA não deve ensinar apenas procedimentos aritméticos. A expansão curricular deve incluir explicitamente um eixo transversal de **pensar, modelar e resolver problemas**.

Futuro `Laboratório de Raciocínio` / `Thinking Lab` pode desenvolver, de forma apropriada à idade:

- decomposição de problemas;
- reconhecimento/generalização de padrões;
- abstração;
- sequenciamento e algoritmos;
- lógica e inferência;
- classificação e relações;
- pensamento espacial;
- estimativa e plausibilidade;
- múltiplas estratégias;
- problemas abertos;
- modelagem;
- dados e representação;
- pensamento probabilístico inicial;
- depuração: encontrar por que uma solução falhou;
- pensamento sistêmico/causal;
- criatividade de soluções;
- metacognição: explicar como pensou;
- fundamentos posteriores de programação, engenharia, robótica e IA.

Princípio: a tecnologia é contexto e ferramenta; primeiro vem a capacidade de raciocinar. O Tutor deve aprender a pedir justificativas, comparar estratégias, variar representação e ajustar scaffolding, não apenas verificar resposta final.

## 12. Fontes externas que informam a visão

- Li, Hew & Du (2024), meta-análise sobre gamificação e motivação intrínseca: efeitos positivos pequenos no total e importância de autonomia/relatedness/competência. DOI: `10.1007/s11423-023-10337-7`.
- Frontiers in Education (2026), revisão/meta-análise de ambientes gamificados apoiados por IA: recomenda skill maps/achievement indicators ligados a qualidade disciplinar, recompensas como feedback informativo e rejeição de mecânicas tipo loot box para menores. DOI: `10.3389/feduc.2026.1754080`.
- Graf et al. (2026), dashboards interativos de aprendizagem: visualização de competências e reflexão sobre domínio. Education and Information Technologies.
- ISTE Computational Thinking Competencies / Standards: decomposição, dados, abstração, algoritmos, design, resolução de problemas e integração transversal.
- OECD PISA 2025 Assessment and Analytical Framework: `Learning in the Digital World` trata construção iterativa de conhecimento e resolução de problemas com ferramentas computacionais; ciência inclui avaliação de evidências, design de investigação e pensamento sistêmico/criativo.

## 13. Sequência de execução — não inverter

1. fechar gamificação/economia/meta-progressão com regressões e CI verde;
2. registrar checkpoint/handoff;
3. Coverage Matrix;
4. fábrica curricular;
5. mega auditoria integrada;
6. hardening/performance/release;
7. somente depois evoluir com profundidade o companheiro/Creature Engine/jogo.

O Creature Engine não deve ser modificado nesta frente.
