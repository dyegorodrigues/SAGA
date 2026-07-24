# 🧭 Plano Diretor v2 — Matemágica

> ⚠️ **DOCUMENTO HISTÓRICO (cumprido).** As correções e sessões aqui planejadas foram EXECUTADAS (sessões 0-12, ver CLAUDE.md). Preservado como registro. Estado atual: `sala-de-situacao.md`.
**Auditoria da versão atual + soluções desenhadas + prompts prontos para colar no AI Studio**

---

## PARTE A — Por que os mascotes estão saindo ruins (o diagnóstico técnico)

O Gemini te vendeu como "correção genial" algo que é, na verdade, **a causa raiz do problema visual**. A cadeia do erro:

1. **As imagens foram salvas como JPG** (`dragao_fogo_stage1_nobg_….jpg`). JPG **não suporta transparência** — nunca suportou. O "nobg" no nome é ilusão.
2. Sem transparência real, ele gerou com **fundo preto** e aplicou `mixBlendMode: "screen"` para "apagar" o preto.
3. Só que `screen` não apaga o preto: ele **clareia tudo**. Qualquer pixel escuro do personagem (contornos, olhos, sombras, a barriga vermelha-escura do dragão) fica semitransparente ou desaparece sobre o fundo claro do app. Resultado: personagem lavado, fantasmagórico, "não combina com o aplicativo" — exatamente o que você viu.
4. Bônus do estrago: são **385KB a 859KB por imagem** (quase 3MB por tema!) porque JPG 1024×1024 a 300 DPI com pixel art comprime mal e cria artefatos ao redor dos "pixels".

### A correção definitiva (3 regras)
1. **Personagem é IMAGEM PNG com canal alfa real. UI e formas são SVG. Nunca misturar os papéis.** Parar de pedir pro AI Studio "desenhar personagem em SVG na mão" — o arquivo `MascotBases.tsx` tem 103KB de código tentando desenhar anatomia com fórmula matemática; é por isso que "vive bugando". Nenhum estúdio profissional faz personagem assim.
2. **Gerar a arte FORA do AI Studio** (Gemini app / Whisk / qualquer gerador de imagem) pedindo: *"sticker die-cut, fundo transparente, PNG"*. Se vier com fundo, gerar sobre **branco puro** e remover com removedor gratuito. Nunca fundo preto.
3. **Comprimir antes de subir**: PNG 512×512 (personagens) já resolve; converter pra WebP se quiser (<80KB cada). O Gemini acertou numa coisa: 512 é suficiente para exibição a 100–200px.

### Prompt pronto para colar no AI Studio (a cirurgia no código)
> "No arquivo `MascotRenderer.tsx`: remova completamente o `mixBlendMode: 'screen'` e o pipeline de fundo preto. Os mascotes agora são PNGs com transparência real importados de `src/assets/mascotes/{tema}-{estagio}.png`, renderizados com `<img>` simples (or `<image>` no SVG, sem blend mode). Mantenha as animações CSS existentes (flutuação, auras, partículas) aplicadas ao contêiner da imagem. Delete os JPGs antigos da pasta assets."

### Sobre o estilo "pixel art bonito"
O que você quer não é pixel art clássica (que fica serrilhada mesmo) — é **"pixel art renderizada"** ou o **voxel fofo** do guia anterior. Termos que funcionam no gerador: *"pixel art HD estilizada, blocos suaves com iluminação 3D, acabamento premium de brinquedo, alta nitidez, cores vibrantes, sem serrilhado"*. Mantém o prompt-mestre congelado e a folha de personagem (4 poses numa imagem) para consistência.

---

## PARTE B — 🔴 A segurança foi REABERTA (corrigir antes de tudo)

A regra atual do Firestore tem esta linha:
```
) || ( userId.startsWith("usr_email_") )
```
Tradução: **qualquer pessoa na internet, sem senha nenhuma, pode ler e escrever TODOS os perfis criados por e-mail** — basta digitar o e-mail de alguém na tela de login (que não pede senha). O comentário no próprio código admite: "remain open". É a mesma vulnerabilidade que fechamos antes, de volta com outro nome — e agora com e-mails (dado pessoal) junto dos nomes das crianças.

### Correção (ordem exata)
1. Ativar **Anonymous** em Authentication → Sign-in method (além do Google que já existe).
2. Colar no AI Studio:
> "Remova o login por e-mail sem senha (fluxo `usr_email_`). O app passa a ter dois caminhos: (a) 'Entrar com Google' — já existe; (b) 'Começar sem conta' — usa `signInAnonymously` do Firebase Auth, e o documento do usuário fica em `userStates/usr_cloud_{auth.uid}`, mesmo prefixo do Google. Na primeira vez que um usuário anônimo fizer login Google depois, migre o documento anônimo para o novo uid. Ajuste `getDeviceUserId`/`loadStateFromCloud` para esse fluxo."
3. Publicar o **firestore.rules** que entreguei junto deste plano (fecha o buraco e nega todo o resto).
4. Testar: abrir aba anônima → tentar carregar um perfil alheio → tem que falhar.

---

## PARTE C — 🎨 Escola de Desenho do Motor SVG (o motor secundário)

O motor vetorial que o AI Studio desenvolveu **vale a pena manter** — como motor secundário, no papel certo. O teto dele é o estilo "flat fofo/kawaii"; personagem renderizado estilo videogame é trabalho do pipeline de imagem (Parte A). Mas dentro do teto dele, dá pra ensiná-lo a desenhar MUITO melhor.

### Onde o motor SVG é imbatível (usar sem medo)
- **Acessórios e roupinhas** (formas simples, recolorem por CSS de graça)
- **Cenários** (colinas, céu, castelos — vetor escala infinito e pesa quase nada)
- **Ícones de UI, formas geométricas, moedas estilizadas**
- **Efeitos**: auras, partículas, chamas animadas por cima dos PNGs (isso ele já faz bonito)
- **Variações de tema**: o mesmo desenho muda de cor via CSS — impossível com PNG

### As 6 lições (cole no AI Studio como regra permanente)
> "A partir de agora, ao desenhar qualquer coisa em SVG, siga estas regras fixas:
> 1. **Paleta fechada**: antes de desenhar, declare 6-8 cores nomeadas e use SOMENTE elas.
> 2. **Receita de construção**: proporção chibi (cabeça ≈ corpo), olhos sempre em posições simétricas fixas, traço uniforme de 3px com `strokeLinejoin='round'`, cantos sempre arredondados.
> 3. **Orçamento de formas**: máximo 40 elements por desenho. Se precisar de mais, o design está complexo demais — simplifique.
> 4. **Camadas declaradas**: antes do código, liste a ordem (fundo → corpo → rosto → detalhes → brilhos) e desenhe nessa ordem.
> 5. Um desenho por sessão; ao aprovar, o código vira referência de estilo dos próximos.
> 6. Nunca tente anatomia realista, sombreamento volumétrico ou cabelo detalhado em SVG — esses pertencem ao pipeline de imagem."

### O pulo do gato: dar OLHOS ao motor
O maior defeito do desenho por código é que o modelo desenha **às cegas** — ele escreve coordenadas sem ver o resultado. Solução: **tire print do desenho renderizado e cole a imagem de volta no chat do AI Studio**, apontando o defeito ("o braço quebrou aqui", "esse olho está torto"). O Gemini é multimodal: vendo o print, ele finalmente enxerga o próprio trabalho e corrige com precisão. Esse loop de feedback visual é o que separa os desenhos "abobados" dos bonitinhos que ele às vezes acertava — quando acertava, era sorte; com print, vira método.

---

## PARTE D — Tamagotchi 2.0: economia e balanceamento (o design completo)

### O problema atual (dois erros de economia)
1. **Moeda única fazendo três papéis**: estrela = XP de evolução = dinheiro do álbum = comida do pet ("Gastar 2 XP" para alimentar). Gastar a mesma coisa que mede progresso é anti-design: a criança alimenta o pet e vê o "progresso" diminuir. Confusão garantida.
2. **Curva rasa**: estágios em 15/45/90/140 estrelas. Uma missão rende ~7-11 estrelas → o estágio 5 chega em ~15-18 missões, ou seja, **uma semana de uso animado e o pet "acabou"**. Morre o gancho de longo prazo.

### O design correto: DUAS moedas
| Moeda | Como ganha | Para que serve | Regra de ouro |
|---|---|---|---|
| ⭐ **Estrelas (XP)** | 1 por acerto + bônus | Evolução do mascote, recordes | **NUNCA se gasta.** Só acumula, a vida toda |
| 🪙 **Moedinhas** | 1 por acerto + 3 por missão + 5 na missão do dia | Álbum, comida do pet, acessórios, cenários | Gastar é a graça — sem culpa, sem regressão |

### Curva de evolução rebalanceada (alvo: ~3 meses até o topo, jogando saudável)
| Estágio | XP | Tempo estimado (2 missões/dia) |
|---|---|---|
| 1 → 2 (Ovo → Filhote) | 15 | **no 1º dia** (o gancho: evoluir JÁ na estreia) |
| 2 → 3 (Filhote → Jovem) | 75 | ~4-5 dias |
| 3 → 4 (Jovem → Adulto) | 250 | ~2-3 semanas |
| 4 → 5 (Adulto → Lendário) | 700 | ~2-3 meses 🏆 |

### Alimentação e humor (sem punição, NUNCA)
- **Comida**: comprada com moedinhas (2 🪙) ou 1 grátis/dia ao completar a Missão do Dia. Alimentar enche a barrinha de energia → pet fica saltitante, solta partículas, fala frases extras. Barra vazia = pet **sonolento** (boceja), nada além disso.
- **Humor** = streak (já calculado no código): jogou hoje = feliz; 1 dia parado = sonolento; 2+ = "com saudade" (olhos pidões). **O pet jamais adoece, morre ou regride** — criança de 4 anos não pode carregar culpa.
- **Evolução é só XP.** Comida e humor são cosméticos. Assim nenhum caminho "trava" o pet.

### Prompt pronto para o AI Studio
> "Refatore a economia: crie o campo `coins` (moedinhas) por criança, separado de estrelas. Estrelas viram XP vitalício que nunca é gasto (evolução usa os marcos 15/75/250/700). Todo gasto (álbum, comida ⁠— 2 coins ⁠—, acessórios) passa a debitar `coins`, creditadas 1/acerto + 3/missão completa + 5 na primeira missão do dia. Alimentar enche uma barra `energia` (decai 1/dia, mínimo 0) que só muda animação/frases do mascote — nunca bloqueia evolução nem regride estágio. Migração: coins iniciais = carteira atual de estrelas."

---

## PARTE E — Algoritmo: aquecimento, nivelamento e missões combinadas

### 1. Aquecimento de sessão (o "não brochar na primeira")
Hoje a missão abre já no nível salvo. Design novo:
- **Questões 1 e 2 de cada missão: nível salvo − 1** (mínimo 1). Vitória fácil de entrada = confiança.
- Acertou as duas → volta ao nível salvo na questão 3. Errou no aquecimento → **não conta** para o rebaixamento (bad streak), só ajusta o ritmo.
- O nível salvo continua sendo a memória verdadeira da criança — o aquecimento é rampa, não regressão.

### 2. O nivelamento que já existe (e está certo)
Subir com 3 acertos seguidos / descer com 2 erros / revisão espaçada dos erros até dominar 2× — esse motor sobreviveu a todas as migrações e é o coração pedagógico. Não deixar o AI Studio "otimizá-lo".

### 3. Missões combinadas (o módulo que falta) — "Desafio Misto 👑"
- Disponível 1×/dia (card especial na home, visual de troféu).
- **10 questões montadas assim**: 40% do banco de revisão (todas as trilhas), 30% da trilha com pior precisão, 30% sorteadas das demais no nível de cada uma.
- Recompensa: moedinhas em dobro + selo no calendário.
- É simultaneamente o "chefão" divertido E a sessão de reforço inteligente disfarçada.

### Prompt pronto
> "Implemente: (1) aquecimento — as 2 primeiras questões de cada missão usam nível max(1, lvl−1) e erros nelas não incrementam o contador de rebaixamento; (2) nova missão 'Desafio Misto', 1×/dia, 10 questões: 40% amostradas dos bancos de revisão de todas as trilhas da criança, 30% da trilha de pior precisão (mín. 8 respondidas), 30% aleatórias nas demais, cada qual no nível salvo da sua trilha; recompensa em moedinhas ×2."

---

## PARTE F — Varredura de UX (checklist de teste por tela)

Não consigo executar o app aqui (análise estática) — então este é o roteiro pra VOCÊ testar em 10 minutos, com a correção genérica de cada praga:

| Tela | Testar | Se falhar, colar no AI Studio |
|---|---|---|
| Login | Botão Google e "sem conta" visíveis sem sobreposição; voltar não trava | "Crie um componente `AppHeader` único (voltar + título + ações) e use em TODAS as telas; remova headers duplicados" |
| Pick/perfis | Trocar de perfil não vaza tema/estado do anterior | "Ao trocar de kid, resete estados locais com `key={kid.id}` nos componentes de tela" |
| Home da criança | Botões não sobrepostos em tela pequena (testar num celular estreito) | "Padronize z-index: header=30, modais=50, toasts=60; nunca position:absolute para botões de layout — use flex/grid" |
| Jogo | 💡 dica funciona; voz lê; sair no meio salva | — |
| Tamagotchi | Alimentar, evoluir, trocar cenário — 3× seguidas sem travar | "Cenários: pré-carregue as imagens dos backgrounds com `<link rel=preload>` e troque por classe CSS, não por remontagem" |
| Painel dos pais | Gráficos carregam com perfil novo (sem dados) sem quebrar | — |
| Geral | Rodar `npm run build` — zero erros; abrir no celular real, não só no preview | — |

**Higiene de código:** `MascotBases.tsx` (103KB) deve praticamente sumir após a Parte A/C — personagens viram PNG. `AdminGodPanel` não pode ir para produção: esconder atrás de flag de ambiente.

---

## PARTE G — Ordem de execução (o plano em si)

0. **⚠️ SESSÃO 0 — Verificação de integridade (OBRIGATÓRIA, antes de qualquer coisa).** A última sessão do AI Studio foi interrompida por erros de cota NO MEIO de uma cirurgia: ele deletou as 5 imagens antigas do dragão e editou o `MascotRenderer.tsx` sem conseguir concluir/validar. Cirurgia pela metade = imports apontando pra arquivos que não existem mais = build quebrado ou tela branca esperando pra acontecer. Prompt pra colar ANTES de tudo:
> "Sessão de verificação: rode o build completo. Procure em todo o projeto imports de arquivos de imagem que não existem mais (os JPGs do dragão foram deletados). Confirme que MascotRenderer.tsx compila, que nenhum tema referencia asset ausente, e que o app abre em todas as telas. Liste o que encontrou e corrija apenas o que estiver quebrado — não refatore nada além disso nesta sessão."
Depois disso: **commit no GitHub** antes de prosseguir.

1. **Segurança** (Parte B) — hoje. É a única coisa com relógio correndo.
2. **Pipeline de arte** (Parte A) — remove o hack, entra PNG real. Gera o tema Dragão de novo do jeito certo (5 PNGs transparentes) como piloto.
3. **Escola SVG** (Parte C) — cola as 6 lições como regra permanente e realoca o motor vetorial pro papel dele: acessórios, cenários, ícones e efeitos.
4. **Economia + Tamagotchi** (Parte D) — uma sessão de AI Studio com o prompt pronto.
5. **Aquecimento + Desafio Misto** (Parte E) — outra sessão.
6. **Varredura UX** (Parte F) — teu roteiro de 10 minutos + correções pontuais.
7. Só depois: novas trilhas (Ditado de Números continua sendo a melhor aposta) e novas matérias.

Regra de sobrevivência no AI Studio, sempre: **commit no GitHub antes de cada sessão, um prompt = uma mudança, e testar as 4 vitais depois (voz, revisão 🧠, salvar/recarregar, álbum).**

---

## PARTE H — Insights finais da auditoria de código

**1. 🔴 Endpoints do Gemini desprotegidos (custo em risco).** O `server.ts` expõe `/api/tutor` e `/api/analyze-progress` sem autenticação nem limite de requisições. Qualquer pessoa que descobrir a URL do Cloud Run pode martelar os endpoints e **torrar tua fatura do Gemini**. Prompt pronto:
> "No server.ts: (1) exija o token do Firebase Auth no header Authorization e valide com `verifyIdToken` do firebase-admin antes de chamar o Gemini; (2) adicione rate limit por uid: máximo 20 chamadas de tutor e 5 relatórios por dia por usuário, com contador em memória."

**2. Componentes gigantes — dividir.** `GameLoop.tsx` (37KB), `Mascot.tsx` (38KB), `ParentDashboard.tsx` (36KB), `MascotEvolution.tsx` (34KB). Arquivo grande = AI Studio erra mais nas edições (mais contexto pra ele se perder). Prompt:
> "Refatore sem mudar comportamento: extraia de GameLoop um hook `useGameEngine` (toda a lógica de estado/adaptação) e componentes `QuestionVisual` + `AnswerOptions`; divida ParentDashboard em `ChartsPanel`, `StatsChips` e `AIReport`; alvo: nenhum arquivo acima de 15KB."

**3. Dividir `generators.ts`** em `generatorsPre.ts` + `generatorsAno1.ts` + `generatorsShared.ts` — segue a filosofia "1 trilha = 1 gerador" e prepara a chegada de novas matérias.

**4. Design tokens no lugar certo.** A paleta `C` mora dentro de `MascotThemes.ts` — mover para `src/theme/tokens.ts` e importar de lá em todo lugar. Hoje qualquer mexida em mascote arrisca as cores do app inteiro.

**5. Suíte de testes (a cinta de segurança).** O AI Studio edita com codemods cegos — sem testes, uma trilha quebra em silêncio e a criança encontra o bug antes de você. Entreguei junto deste plano o arquivo `generators.test.ts` pronto: valida todas as trilhas × 5 níveis × 60 questões (resposta presente e única, opções sem duplicata, somas/dinheiro/dezenas coerentes). Instalação: `npm i -D vitest`, script `"test": "vitest run"`, arquivo em `src/utils/generators.test.ts`. Rodar após TODA sessão de AI Studio.

**6. Vigiar o tamanho do documento na nuvem.** O estado inteiro (banco de revisão + log de 366 dias × crianças) vive num único documento Firestore com limite de 1MB. Longe do teto hoje, mas ao adicionar matérias/anos, migrar para subcoleções (`userStates/{uid}/kids/{kidId}`).

**7. `AdminGodPanel` fora da produção** — esconder atrás de variável de ambiente (`import.meta.env.DEV`), senão é porta de fundos no app das crianças.
