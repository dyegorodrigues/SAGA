# 📘 A BÍBLIA DO MATEMÁGICA
**Visão, pedagogia, arquitetura e história do projeto — o documento que explica o porquê de tudo**

*Este é o registro canônico. Qualquer pessoa — ou qualquer IA — que ler este documento entende o projeto inteiro: o que é, por que cada decisão foi tomada, como escala sem virar bagunça, e para onde vai.*

---

# PARTE I — A VISÃO

O Matemágica nasceu de um pai construindo uma ferramenta de educação para os próprios filhos — Heitor (6, quase 7) e Benjamin (4) — e evoluiu para uma plataforma educacional completa com ambição real: **fazer pela aprendizagem o que os melhores modelos do mundo fazem, numa experiência que criança AMA usar.**

### Os princípios inegociáveis (a ética do projeto)
1. **A dificuldade é problema do sistema, nunca culpa da criança.** O app se adapta a ela; ela nunca é rotulada.
2. **Nada pune.** O mascote nunca morre, nunca adoece, nunca regride. Erro vira revisão, não castigo.
3. **Anti-vício por design.** Sessões curtas, limite gentil ("vamos brincar lá fora?"), ritual de encerramento. O oposto dos apps que prendem.
4. **A voz é inclusão.** Tudo pode ser ouvido — para quem não lê ainda, para quem lê com dificuldade, para quem aprende ouvindo.
5. **Neutralidade absoluta** em temas sociais: ensina-se o PROCESSO (regras, votação, convivência), jamais posição partidária ou ideológica.
6. **Privacidade de criança é sagrada.** Banco fechado por autenticação, voz nunca gravada, nada coletado além do progresso.

---

# PARTE II — OS PILARES (o porquê de cada decisão técnica)

### 1. Geradores procedurais, nunca banco de questões
Cada habilidade é uma FUNÇÃO que gera infinitas variações, não uma lista fixa. **Por quê:** um banco de 190 habilidades escritas à mão é esteira infinita de manutenção; um gerador nunca repete, nunca acaba, e cabe em 30 linhas. É a decisão fundadora do projeto.

### 2. Motor adaptativo = Zona de Desenvolvimento Proximal (Vygotsky)
3 acertos seguidos → sobe de nível; 2 erros seguidos → desce e reforça a base. **Por quê:** aprendizagem acontece no degrau logo ACIMA do domínio atual — nem tédio, nem frustração. As 2 primeiras questões de cada sessão vêm um nível abaixo (aquecimento), para a criança nunca "brochar" na entrada.

### 3. Revisão Esperta = repetição espaçada
O que a criança erra entra num banco de erros e REVOLTA nas missões seguintes (com selo 🧠) até ser acertado 2 vezes ("dominou!"). **Por quê:** é o mecanismo com mais evidência científica para memória de longo prazo — e é o que separa jogo de aprendizado.

### 4. Economia dupla: ⭐ e 🪙
Estrelas = XP vitalício que NUNCA se gasta (evolui o mascote, mede a jornada). Moedinhas = moeda gastável (álbum, comida, acessórios). **Por quê:** gastar a mesma coisa que mede o progresso faz a criança "regredir" ao comprar — confusão e culpa. Separar resolve. (E o gasto sem culpa é, ele mesmo, educação financeira.)

### 5. Tamagotchi ético
5 estágios de evolução por XP (15/75/250/700 — do ovo ao lendário em ~3 meses de uso saudável, com a primeira evolução JÁ no primeiro dia). Humor pelo streak: jogou = feliz; parou = sonolento/com saudade — **nunca doente, nunca morto**. Comida e acessórios são cosméticos; a evolução é só XP: nenhum caminho trava o pet.

### 6. A voz como superpoder
O TTS do navegador (gratuito) lê perguntas, comemora acertos, conta probleminhas para quem não lê, fala inglês trocando uma linha (`lang: en-US`), dita números e palavras, e serve de MODELO de leitura fluente. O reconhecimento de fala do navegador (também gratuito) permite responder falando e **medir leitura em voz alta** (precisão + palavras/minuto). Regra: áudio processado na hora, nunca gravado.

### 7. CPA como regra de design (Método Singapura)
Toda trilha progride Concreto (figuras) → Pictórico (representações) → Abstrato (só símbolos). Complementos de elite internacional: **Amigos dos Números** (7=5+2=4+3 — a base da conta de cabeça), **Moldura de 10**, **subitização** (ver quantidades sem contar), **modelo de barras** para problemas.

### 8. Continuum vertical (a escada dos anos)
O "ano escolar" é porta de entrada, nunca muro. Cada domínio é uma escada que atravessa os anos; cada trilha declara pré-requisitos. Criança travada desce a escada automaticamente ("Missão Turbo de Aquecimento ⚡" — nunca "você voltou pro pré"); criança voando sobe (Modo Gênio, ativado por precisão ≥90% + resposta rápida sustentadas). O mesmo motor serve dos 4 anos ao adulto.

### 9. As duas pontas + neurodiversidade
**Modo Gênio 🚀** (teto removido, conteúdo do ano seguinte, problemas abertos, "ensine o mascote" — efeito protégé). **Modo Alicerce 🧱** (2 rebaixamentos → modo guiado automático, micro-passos, sem rótulo). **Perfis de Apresentação** (Foco/Leitura/Padrão) que ajustam a FORMA para TDAH e dislexia sem tocar no conteúdo. O app jamais diagnostica — suspeitas são conversa para profissionais.

### 10. Arte: personagem é imagem, movimento é código
Lição aprendida a suor: personagem bonito NÃO se desenha em SVG à mão (o modelo desenha às cegas — colapsa acima de ~40 formas). Pipeline definitivo: **PNG com transparência real** (512×512, centralizado, 10-15% de margem), gerado FORA do editor de código com prompt-mestre congelado + refinamento por imagem de referência; efeitos (auras, partículas, flutuação, brilhos) aplicados por código POR CIMA. **Proibido para sempre:** JPG (não tem transparência), fundo preto, `mixBlendMode: screen` (a "película opaca" que lavou os personagens).

### 11. Segurança — as cicatrizes
O Firestore foi encontrado ABERTO duas vezes: primeiro com `allow read, write: if true`; depois com a brecha `usr_email_` (login por e-mail sem senha, documentos abertos ao mundo). Regra permanente: **todo acesso exige autenticação (Google ou anônima) e cada usuário só lê/escreve o próprio documento; todo o resto é negado por padrão.** Endpoints de IA no servidor exigem token e limite de uso por pessoa (senão qualquer um torra a fatura do Gemini). Verificar as rules depois de TODA sessão de IA no código — elas já reabriram sozinhas uma vez.

### 12. Higiene de desenvolvimento com IA
Commit no GitHub ANTES de cada sessão. Um prompt = uma mudança. Suíte de testes dos geradores rodada DEPOIS de toda sessão (a IA edita com codemods cegos; testes são o cinto de segurança). Sessão interrompida por cota = Sessão 0 de verificação de integridade antes de qualquer coisa nova. Arquivo nenhum acima de 15KB.

---

# PARTE III — O CURRÍCULO COMPLETO (mapa de matérias, com idades)

### Núcleo atual
- **Matemática** (pré + 1º ano, ~18 trilhas + expansões: Senhor do Tempo, Amigos dos Números, Moldura de 10, Olhômetro, Detetive Lógico, Dinheirinho, Probleminhas falados, Gráficos)
- **Alfabetização PT 📖 (prioridade nº 1):** método fônico sistemático (linhagem GraphoGame/ciência da leitura). Fase 0 consciência fonológica (4 anos: rimas, palmas de sílaba) → vogais → consoantes → Fábrica de Sílabas → Fábrica de Palavras → primeira leitura → **Leitor Veloz 🚀** (fluência: Cola-Sílabas contra a leitura robótica, Palavras-Relâmpago, eco, leitura repetida, prosódia, Livrinhos Mágicos decodáveis gerados sob medida) → **Manhas do Português** (Dança do C, Três R, letras-espelho, pares FACA/VACA, nasais, sílabas travadas)
- **Inglês 🇺🇸 (4+):** compreensão antes de produção, imagem↔som sem tradução (TPR); Hello!, Colors, Numbers (sinergia com a matemática), Animals, Listen & Touch, Word of the Day
- **Ciências 🔬:** corpo humano/5 sentidos, animais e habitats, de onde vem, vivo/não-vivo, estados da água, sistema solar
- **Missões do Mundo 🌐 (multidisciplinar):** Mercadinho, Cozinha Mágica, Pequeno Explorador, Linha do Tempo da Vida, Cidade dos Ajudantes + A Turma Vota 🗳️, Guardiões do Planeta, Estações, Corpo em Movimento, Grandes Curiosos, Festas e Lendas do Brasil

### Matérias futuras (estudo de viabilidade e idade)
| Matéria | Faz sentido? | A partir de quando | Como entra |
|---|---|---|---|
| **Astronomia 🌌** | SIM — fascínio universal infantil; EUA e China têm space curricula desde cedo. (Nota: astroNOMIA, a ciência dos astros; astroLOGIA/signos não entra — não é ciência.) | 4+: dia/noite, Sol/Lua/estrelas · 6+: planetas em ordem, Terra que gira (dia) e translada (ano) — JÁ conectado ao Senhor do Tempo e à animação orbital · 8+: gravidade, fases da Lua, viagens espaciais | Nasce como expansão de Ciências; vira matéria própria quando engordar |
| **Filosofia 🦉** | SIM — existe um campo consolidado: *Philosophy for Children* (P4C, desde os anos 1970). Para 4-7 não é Platão: é a arte de perguntar | 5+: "Grandes Perguntas" — a voz conta um micro-dilema ("achou um brinquedo no parque; o que faz?"), a criança escolhe, o mascote pergunta "por quê?". **Design especial: dilemas NÃO têm resposta marcada como certa** — o valor está no raciocínio · 8+: verdade × opinião, o jogo do porquê encadeado | Modo próprio (not é quiz!) dentro de Missões do Mundo |
| **Geografia 🗺️** | SIM — já semeada no Pequeno Explorador | 4+: perto/longe, minha casa→rua→cidade (o "espaço vivido" da BNCC) · 6+: Brasil e regiões, primeiro mapa · 8+: continentes, países, relevo/clima | Expansão do Pequeno Explorador |
| **Política/Civismo 🏛️** | SIM, com a régua certa: PROCESSO e convivência, jamais partido | 4-7: regras e combinados, votação da turma (contar votos!), profissões públicas — já coberto em Cidade dos Ajudantes · 8+: como nasce uma regra da cidade, "quem faz / quem cuida / quem julga" (os três poderes em linguagem de criança), imposto como "vaquinha da cidade" | Fio dentro de Missões do Mundo; neutralidade absoluta registrada como regra |
| **Mundo Digital & IA 💻🤖** | SIM — e é urgente e diferenciado (pouquíssimos fazem bem) | 4+: a tela e o corpo (tempo de tela, postura), "o computador não é mágico: pessoas mandam nele" · 6+: o que é a internet ("cartas velocíssimas entre computadores"), senha é segredo, estranho online = chamar adulto, pensamento computacional (Comande o Mascote ⬆️➡️) · 7+: **alfabetização em IA**: "a IA aprende com exemplos", "a IA pode errar — confira!", "nunca conte segredos a um app" | Matéria própria "Mundo Digital", curta e potente |
| **História BR e Mundial 📜** | SIM — mas história para criança pequena é NARRATIVA, não data | 4-6: tempo pessoal e da família (já existe) · 7-8: histórias CONTADAS pela voz (povos indígenas, grandes navegações, independência como aventura) + linha do tempo visual ("o que veio primeiro?") · 9+: causa e consequência | Expansão de Grandes Curiosos; fatos com múltiplas perspectivas simples, sem ufanismo nem revisionismo |
| **Educação Financeira 💰** | SIM — e é o exemplo perfeito de matéria-FIO (atravessa, não isola) | 4-6: moedas, troco, precisa×quer (Dinheirinho + Mercadinho — já existem) · 7-8: **Cofrinho com Meta 🐷** (poupar com objetivo visual) e o pulo do gato: "guarde 5 moedinhas hoje e amanhã viram 6" — **juros e gratificação adiada aos 7 anos**, gamificados · 10+: Investidor Mirim (simulado), inflação como "o monstro que morde o cofrinho" | Fio contínuo: Dinheirinho → Mercadinho → Cofrinho → Investidor. A interconexão holística pedida, materializada |

---

# PARTE IV — A ARQUITETURA DEFINITIVA (como escalar sem virar bagunça)

### O princípio único
**Motor agnóstico, conteúdo plugável.** O núcleo NUNCA sabe o que é "matemática" ou "inglês" — ele só sabe adaptar nível, revisar erros, pagar moedas e falar. Matéria é cartucho; o motor é o console.

### As 5 camadas
```
┌─────────────────────────────────────────────────────┐
│ 5. EXPERIÊNCIA  temas/mascotes · modos (Desafio     │
│    Misto, Aventura, Missões do Mundo) · Tamagotchi  │
├─────────────────────────────────────────────────────┤
│ 4. CONTEÚDO  SUBJECTS = { mat, port, eng, cie, ... }│
│    cada trilha = { id, nome, ícone, prereqs[],      │
│    gen(nível) → Questão }   ← O CONTRATO IMUTÁVEL   │
├─────────────────────────────────────────────────────┤
│ 3. KINDS (renderizadores universais, ~15)           │
│    count · options · pattern · scene · money ·      │
│    picto · story · listen-touch · sort · trace ...  │
│    → reutilizados por TODAS as matérias             │
├─────────────────────────────────────────────────────┤
│ 2. NÚCLEO (engine)  adaptação/ZDP · revisão         │
│    espaçada · economia ⭐🪙 · log/analytics ·        │
│    continuum (grafo de prereqs) · voz TTS/STT       │
├─────────────────────────────────────────────────────┤
│ 1. DADOS  Firestore autenticado · espelho local ·   │
│    hoje: 1 doc/usuário · ao escalar: subcoleções    │
│    userStates/{uid}/kids/{kidId}                    │
└─────────────────────────────────────────────────────┘
```

### A Constituição do Código (as 8 regras anti-bagunça)
1. **O contrato do gerador é imutável**: `gen(nível 1-5) → { kind, prompt, visual…, options[], answer }`. Tudo pluga nele; ninguém o altera.
2. **Kind novo só com 2+ usos previstos.** Se uma mecânica serve a uma trilha só, ela provavelmente está mal desenhada.
3. **Lógica de matéria JAMAIS entra no núcleo.** O motor não pode conter um `if (subject === "mat")`.
4. **Arquivo ≤ 15KB.** Passou, divide. (IA editando arquivo grande = erro garantido.)
5. **Todo gerador nasce com teste.** A suíte roda após toda sessão de IA.
6. **Nomes por convenção** (`materia/trilha`, assets `tema-estagio.png`) — a convenção É a documentação.
7. **Pré-requisitos declarados** em toda trilha nova (senão o continuum quebra).
8. **Fio > matéria isolada** quando o tema atravessa (financeira, civismo): trilhas em matérias existentes conectadas por uma tag de fio, não uma ilha nova.

### Checklist: como nasce uma matéria nova (6 passos)
1. Matriz de habilidades por idade (BNCC + melhor referência internacional)
2. Mapear cada habilidade a um kind existente (criar kind é exceção)
3. Escrever geradores (1 trilha = 1 função) + pré-requisitos
4. Registrar em `SUBJECTS` — o motor faz o resto (adaptação, revisão, economia, voz)
5. Testes + assets pelo pipeline de arte
6. Entrar no Desafio Misto e nas métricas dos pais automaticamente

---

# PARTE V — A HISTÓRIA DO PROJETO (o registro das interações)

1. **A origem:** tentativa de clonar o IXL via outra IA → resultado bugado, casca sem motor. Diagnóstico: clonar a superfície não clona a inteligência. Decisão fundadora: construir ferramenta própria para o Heitor e o Benjamin, com geradores procedurais em vez de banco de questões.
2. **Protótipo v1 (artifact):** 12 trilhas adaptativas (6 por criança), perfis, voz pt-BR lendo tudo, progresso persistente, design de brinquedo. Validado com 2.400 questões de teste.
3. **v2:** Revisão Esperta (repetição espaçada), Álbum de figurinhas (economia), sons sintetizados (WebAudio), gráficos dos pais. A alma pedagógica nasce aqui.
4. **v3:** Fase 1 do currículo (Dinheirinho, Probleminhas falados, Gráficos, Intruso, Onde Está?, Tirar), temas com personagens originais, insights dos pais (melhor trilha/reforçar). 5.400 questões validadas.
5. **v4 ("protótipo fodão"):** vida visual total — mascotes que piscam, tudo animado, tela inicial de jogo, analytics com períodos e tempo de resposta, 36 figurinhas.
6. **Documentos de fundação:** Matriz Curricular (BNCC × IXL × trilhas, roadmap em 3 fases) e Guia de Arte & Design.
7. **Migração ao Google AI Studio:** modularização React+TS+Firebase+Gemini. Ganhos: tutor IA, relatório pedagógico, modo guiado, calendário/relógio, nuvem. Dores (e lições): Firestore aberto 2×, o desastre do JPG/fundo preto/blend, SVGs de personagem à mão (103KB de código cego), scripts-lixo commitados, endpoints de IA sem proteção, sessões interrompidas por cota no meio de cirurgias.
8. **A consolidação:** Plano Diretor v2 (segurança → arte → escola SVG → economia → algoritmo → UX → insights de código), suíte de testes entregue, Relatório de Expansão Pedagógica, Adendo (multidisciplinar, continuum, fluência, voz) e esta Bíblia.

# PARTE VI — GLOSSÁRIO DE BOLSO (para explicar o projeto em 30 segundos)
- **Gerador procedural:** função que cria infinitas questões; o fim do banco de exercícios.
- **ZDP (Vygotsky):** aprender no degrau logo acima do que já se domina — o que o motor adaptativo faz.
- **Repetição espaçada:** rever o erro em intervalos até dominar — a Revisão Esperta 🧠.
- **CPA:** Concreto → Pictórico → Abstrato (Singapura) — a ordem de toda trilha.
- **Método fônico:** alfabetizar pelo SOM das letras (som→sílaba→palavra) — base do GraphoGame e da nossa alfabetização.
- **Consciência fonológica:** brincar com os sons ANTES das letras (rimas, sílabas) — o alicerce dos 4 anos.
- **Fluência leitora:** precisão + velocidade + prosódia — o degrau entre decodificar e compreender (o momento do Heitor).
- **Texto decodável:** historinha que usa só os padrões já ensinados — nossos Livrinhos Mágicos, gerados sob medida.
- **Subitização:** ver a quantidade sem contar — alicerce do senso numérico.
- **TPR:** aprender língua associando som a imagem/ação, sem tradução — nosso inglês.
- **P4C:** filosofia para crianças — perguntar bem, dilemas sem resposta única.
- **Continuum vertical:** o conhecimento como escada contínua entre os anos; a série é só a porta de entrada.
- **Efeito protégé:** quem ensina aprende duas vezes — "ensine o mascote".
