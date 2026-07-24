# 🚨 Auditoria Consolidada, Vulnerabilidades e Backlog (Matemágica AI)

Este documento é a fusão unificada de três relatórios vitais: **Mega Auditoria de Erros Atuais**, **Mega Análise de Vulnerabilidades** e o **Parecer de Auditorias Externas**. Ele atua como o backlog de tarefas técnicas e o mapa de riscos do projeto.

---

## 🛑 1. Nivelamento e Lógica de Jogo (GameLoop)
- [x] **Erro de Assessment Inicial**: Criança Iniciante (4 anos) recebendo subtração. Corrigido para testar apenas C0001, C0003.
- [x] **Loop no Assessment**: Corrigido o erro que perguntava "Deseja jogar de novo?" após nivelamento.
- [ ] **Desempenho e Re-renders no `GameLoop`**: O GameLoop concentra muita lógica (timers, áudio, estado). A solução adotada (`aulaTimersRef` com `useRef`) já isolou os timers e mitigou re-renders em grande parte. Se a Sessão 12 (separação física) não for suficiente, aí sim introduziremos Zustand/Jotai (Parecer: Não adicionar libs prematuramente).
- [ ] **Gatilho de "Rajada" (Clique-Metralhadora)**: `answeredRef` já previne duplo clique, mas falta detectar rajadas (3+ cliques em <1s) e forçar uma pausa de 2 segundos.

## 🧠 2. UX, Pedagogia e o "Frustration Engine"
- [ ] **A Lacuna do Silêncio (Hesitação 15s)**: A IA atualmente só reage ao clique errado, não ao silêncio. *Ação Requerida:* Criar um timer de 15s de inação no `GameLoop` que acione dica passiva (brilho na resposta) e regulação emocional ("cheire a flor, assopre a vela"). (Parecer: ADOTAR).
- [ ] **Erro de Contagem Contínua (UI)**: Soma (3+2) contando "1,2,3 ... 1,2". *Ação Requerida:* Refatorar para contagem contínua "1,2,3 ... 4,5".
- [ ] **Feedback Textual e Áudio**: Eliminar jargões nos acertos e não travar a UI com áudios longos.
- [ ] **Daltônicos (Protanopia)**: A Moldura de 10 hoje foca apenas em vermelho/azul. *Ação Requerida:* Adicionar formas/ícones (ex: 🍎 e 🍇) além da cor para acessibilidade. (Parecer: ADOTAR).
- [ ] **Matemática x Letramento (Problemas Nível 5)**: Quando chegar na trilha de Probleminhas, distinguir erro de cálculo de erro de leitura (oferecendo opção 100% falada).

## 🏗️ 3. Arquitetura e Decisões Técnicas (Vereditos)
- **Camadas Arquiteturais e Offline:** O app JÁ trabalha com offline local do Firestore (IndexedDB). CRDT e reestruturações pesadas de pastas foram **Recusadas** (Parecer) por serem over-engineering no atual estágio.
- **Dojo Dual:** Decidido que o Dojo de fluência (Nível 5) operará tanto de modo algorítmico (o sistema escolhe) quanto livre (a criança escolhe para agência).
- **Sprites e PNGs:** Combinações de aura e acessórios continuam sendo via Canvas/SVG por cima do PNG base do mascote (evitando explosão de arquivos).
- **ParentDashboard Preditivo**: Painel dos pais deverá usar os dados (Tempo de Resposta, Horário de Pico) para dar conselhos orgânicos ("Ele joga melhor de manhã"). (Parecer: ADOTAR).

## 🛡️ 4. Regra Anti-Corrupção Multi-IA (Claude ↔ AI Studio)
- Fica proibida a alteração cega do front-end que destrua heurísticas pedagógicas (como a animação de Ponte do 10).
- Os testes (`generators.test.ts`) são a barreira de segurança, e a documentação na pasta `/AI_Studio_Lab/` é leitura obrigatória antes de mexer na lógica matemática.

*(Status: Atualizado em 19/Jul/2026 com a Grande Fusão dos relatórios de vulnerabilidade e pareceres)*
