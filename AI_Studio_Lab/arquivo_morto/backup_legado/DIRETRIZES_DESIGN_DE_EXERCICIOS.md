# 🔬 MEGA PESQUISA E DIRETRIZES DE DESIGN DE EXERCÍCIOS (DEEP RESEARCH)

**Status:** Documento de Fundação Arquitetural e Pedagógica.
**Objetivo:** Mapear a anatomia perfeita de cada exercício, micro-aula e áudio do aplicativo Matemágica. Garantir que a engenharia de software reflita exatamente as melhores metodologias do mundo (Singapura, Kumon, GraphoGame) sem gargalos, bugs de interface ou falhas de áudio.

---

## 1. O DIAGNÓSTICO (O Teste de Nivelamento Oculto)
Não faremos uma "prova" que assuste a criança. O diagnóstico inicial é **invisível**.
- **Mecânica:** O primeiro contato (Fase Gênesis) é um mix de 10 interações rápidas.
- **Microcompetências testadas:** 
  1. Tocar no maior (Senso Numérico Visual)
  2. Contar 3 objetos (Correspondência 1-a-1)
  3. Completar padrão (Triângulo, Círculo, ?)
  4. Soma simples visual (2 maçãs + 1 maçã)
- **O Algoritmo:** O código medirá **Acerto + Latência (Tempo de Resposta)**. Se a criança acerta a soma visual em 1 segundo, o ELO dela sobe imediatamente para Nível 2. Se demora 15 segundos, o algoritmo entende que ela não tem subitização e a coloca no Nível 0 (Zero Absoluto).

---

## 2. A ARQUITETURA DO ÁUDIO (Luna Studio Pipeline)
**A Regra de Ouro:** O TTS do navegador (voz robótica e falha) está **BANIDO** do ensino fônico e das interações vitais.
- **Preparação:** Todos os scripts, micro-aulas e feedback serão gerados no *Luna Studio* (com vozes de alta qualidade, afetuosas, expressivas) e salvos como *assets* de áudio reais.
- **Orquestração no Código (`Mascot.tsx`):**
  - O código não chama `window.speechSynthesis`.
  - Ele chama `AudioPlayer.play('feedback_acerto_3')`.
  - **Sincronia Anti-Bug:** Botões de resposta ficam bloqueados (`disabled`) por 0.5s enquanto o áudio da pergunta é introduzido, para evitar que a criança clique antes de ouvir. Animações só avançam quando o evento `onEnded` do áudio dispara.

---

## 3. ANATOMIA DA MICRO-AULA E MICRO-TUTORIAL
Quando uma microcompetência nova é introduzida, a criança nunca é jogada às cegas.
- **O Padrão "I Do, We Do, You Do":**
  1. **I Do (Eu faço):** A tela bloqueia toques. Uma Mão Fantasma (cursor SVG) faz a ação (ex: arrasta a barra 2 para a barra 3). Áudio do Luna Studio: *"Olha só! Dois blocos com três blocos viram cinco!"*.
  2. **We Do (Nós fazemos):** A tela pisca o objeto correto. Áudio: *"Agora é sua vez, puxe o bloco azul"*. Se a criança errar o alvo, a peça volta como mola (física) e a dica visual se intensifica.
  3. **You Do (Você faz):** O scaffolding (apoio) some. A criança faz sozinha.
- **Feedback:** Erros geram feedback específico da microcompetência. Não dizemos "Errado". Dizemos: *"Quase! Lembre de contar devagar: um... dois..."*

---

## 4. O DESIGN DOS EXERCÍCIOS ("KINDS" DA INTERFACE)

Cada operação matemática possui uma jornada visual exata, indo do Concreto ao Abstrato.

### A. Adição e Subtração (O Caminho da Fluência)
1. **Nível Concreto (`count-drag`):** 
   - A criança arrasta maçãs, sapos, carrinhos para dentro de um cesto. 
   - *Microcompetência:* Cardinalidade.
2. **Nível Representacional (`singapore-bars`):**
   - Blocos de Singapura em SVG. Um bloco de "10" é visivelmente maior que um de "3". 
   - *Microcompetência:* Compreensão de Grandezas e Decomposição (Number Bonds).
3. **Nível Abstrato (`equation-builder`):**
   - Números puros. Equações na tela. Mas a criança pode tocar num ícone de "Dica" para ver as barras de Singapura aparecendo fracas no fundo.
4. **O DOJO DE VELOCIDADE (`rapid-fire`):**
   - *A Metodologia Kumon:* Quando a criança chega no nível avançado, a interface muda. Sai o cenário fofo, entra a "Forja de Treino". 
   - Uma conta no centro (`8 + 7`), 3 botões gigantes. 
   - Objetivo: Quebrar o hábito de contar nos dedos. A criança tem que responder em < 3 segundos (Subitização mental). O ELO só aumenta se houver velocidade.

### B. Multiplicação e Divisão (Construção Lógica, Não Decoreba)
- **O Erro Comum:** Obrigar a decorar a tabuada.
- **Nossa Arquitetura:**
  1. **Matrizes Visuais (`grid-painter`):** "Pinte 3 fileiras de 4 quadradinhos". A criança entende que 3x4 é uma área (Geometria).
  2. **Partição Justa (`fair-share`):** Divisão introduzida distribuindo 12 biscoitos para 3 monstros. A criança arrasta 1 a 1, e o app diz: "Cada um ganhou 4. 12 dividido por 3 é igual a 4!".
  3. **Dojo de Multiplicação:** Apenas quando a compreensão geométrica for perfeita, o app libera o Dojo de Reflexo para a tabuada.

---

## 5. RESUMO DE GARANTIAS DE QUALIDADE (QA)
Para evitar os bugs e as perdas documentadas nas auditorias passadas:
1. **Sem estado zumbi:** Componentes React (`GameLoop.tsx`) usarão `key` props atrelados ao ID da questão para forçar re-renderização total a cada nova etapa, evitando que áudios antigos toquem ou animações fiquem presas.
2. **Design System:** Usaremos Framer Motion (`motion/react`) para TODAS as transições (suavidade impecável). Botões (Touch Targets) terão no mínimo `48x48px` para dedos infantis.
3. **Catálogo Integrado:** Cada função no `src/utils/generators.ts` estará ligada 1:1 a uma destas microcompetências. O código NÃO criará exercícios soltos que não estejam neste documento.
