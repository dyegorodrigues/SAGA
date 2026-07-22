# 🚨 Mega Auditoria de Erros Atuais e Lacunas (Julho 2026)

Esta é a compilação de todos os problemas estruturais, lógicos e pedagógicos identificados na versão atual, que precisam de refatoração urgente para que a aplicação seja viável e coerente para o público infantil (especialmente 4 anos).

## 🛑 1. Nivelamento e Avaliação Inicial (Assessment)
- [x] **Erro Crítico (Encontrado)**: Criança de 4 anos com perfil "Iniciante" está recebendo exercícios de **subtração** na primeira avaliação. Deve testar apenas Subitização e Cardinalidade (C0001, C0003).
- [x] **Fluxo Errado**: Após terminar a avaliação de nivelamento, o sistema pergunta "Deseja jogar de novo?". Uma avaliação só se faz uma vez para definir o nível, não deve entrar em loop de jogo.
- [ ] **Falta de Adaptação**: Se a criança erra várias vezes (ex: exercício de pular), a dificuldade não diminui e não há dicas visuais adaptativas facilitando o entendimento.

## 🧮 2. Lógica Pedagógica (Micro-conhecimentos)
- [ ] **Erro de Contagem Contínua**: Na explicação de soma, ao contar elementos de dois grupos (ex: 3 + 2), o sistema conta "1, 2, 3", mostra o sinal "+", e depois recomeça "1, 2" no segundo grupo. O correto pedagógico para mostrar adição contínua seria continuar a sequência: "1, 2, 3" ... "4, 5", para a criança entender a totalidade.
- [ ] **Visão de Aplicativo ao invés de Sistema Cognitivo**: A estrutura atual ainda foca em "Trilha de Adição" em vez de microcompetências modulares do Knowledge Graph (MAB).
- [ ] **Ignorando o Grafo de Conhecimento**: As lógicas de dependência de habilidades não foram aplicadas. A progressão de conteúdo está aleatória/incoerente.

## 🗣️ 3. Feedback e Comunicação (Áudios e Textos)
- [ ] **Feedback Muito Complexo**: Quando a criança acerta, recebe uma explicação textual gigantesca, técnica e desnecessária (ex: usando termos como "reator"). Para crianças de 4 anos, o reforço deve ser curto, lúdico e imediato.
- [ ] **Erros de Português e Concordância**: Textos (e possivelmente as falas geradas via TTS) estão com erros graves de concordância verbal e nominal (gênero/número).
- [ ] **Travamentos no Áudio**: O áudio trava durante explicações longas. É necessário encurtar as explicações.

## 🛠️ 4. Arquitetura e Funcionalidades (MAB)
- [ ] **Falta do Flow Estruturado de Sessão (15-20 min)**: A sessão não respeita o funil (Abertura -> Microtutorial -> Prática Guiada -> Dojo -> Mini-revisão).
- [ ] **Modo Dojo Ausente/Desconexado**: O Dojo deve focar puramente em automatização e fluência, com ritmo de videogame.

---
**Status**: Todas as tarefas acima estão **PENDENTES**. Conforme o desenvolvimento evoluir entre Cloud Code e AI Studio, este documento será atualizado com `[x]` para itens concluídos.
