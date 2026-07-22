# 🚨 Mega Auditoria de Erros Atuais

**Objetivo:** Centralizar todos os bugs, falhas pedagógicas e inconsistências de interface relatadas ou observadas para que os agentes transversais (QA, UX, Pedagogo, Dev) resolvam sem gerar loops infinitos.

## Status: Refatoração Estrutural (Julho 2026)

### 1. Inconsistência Pedagógica (Resolvido na Arquitetura)
*   **Erro:** O usuário relatou que a organização do currículo parecia "jogada", sem apresentar de forma clara a evolução do ensino e com exercícios idênticos sendo repetidos.
*   **Causa Raiz:** A lógica matemática estava fragmentada. O componente visual apenas agrupava trilhas de 4 em 4 indiscriminadamente. Além disso, o documento central da pedagogia havia se perdido, causando amnésia na IA sobre o Método de Singapura (onde o mesmo modelo, ex: Grade 2x5, ensina conceitos diferentes em épocas diferentes - Subitização vs Number Bonds).
*   **Correção Atual:** O arquivo `curriculum.ts` foi recategorizado por Ilhas (módulos). A UI `LearningPath.tsx` reflete isso. Os documentos `ARQUITETURA_PEDAGOGICA_COMPLETA.md` e `mega_auditoria_organizacao_trilhas.md` foram criados para servir de bússola definitiva aos agentes.

### 2. A Falha dos Micro-Tutoriais e Scaffolding (A Ser Desenvolvido)
*   **Erro:** A criança inicia o exercício e é testada sem antes ser ensinada a mecânica (I Do / We Do). Não há "Mão Fantasma" ou Scaffold visual forte no nível 1 de cada microcompetência.
*   **Causa Raiz:** O motor do `KidDojo` não possui a variável de estado de Tutorial e o componente `GhostHand` (framer-motion) nunca foi construído. O feedback atual para respostas erradas é muito fraco (apenas vibra a tela em vez de exibir dicas visuais sensíveis e usar a string `explain`).
*   **Ação Requerida (Agente de UX/Motion + Arquiteto):** Construir o sistema de Tutorial no loop do jogo, conforme documentado no `plano_de_acao_tutoriais.md`.

### 3. Falta de Telemetria de Frustração (Iniciado)
*   **Erro:** Se a criança clica no mascote 50 vezes para entender um exercício, mas passa, o algoritmo considera "sucesso perfeito", não avaliando a dependência do auxílio.
*   **Correção Atual:** Adicionados os campos `helpClicks` e `skips` na interface `Progress` em `src/types.ts`.
*   **Próximo Passo:** Implementar o incremento de contadores nas interfaces do Mascote e conectar isso ao sistema de cálculo de ELO/Rankings.

### 4. Gestão de Arquivos (Em Sincronia)
*   **Erro:** A IA anterior gerava e espalhava documentos, causando caos informacional. O usuário pontuou que "fica tanto documento que fica uma bagunça".
*   **Solução Central (Regra Ouro):** Toda pesquisa, mapa e documentação vive exclusivamente no diretório `AI_Studio_Lab/`. Nunca mais criaremos subpastas soltas na raiz do projeto ou substituiremos arquivos indevidamente. O laboratório é o cérebro; a pasta `src/` é a execução.

*(Auditoria contínua - Atualizar este documento conforme os bugs forem sendo eliminados do sistema principal)*
