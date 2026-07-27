# PLANO DE AÇÃO (SESSÃO 2) - ARQUITETURA E CORREÇÕES UI/UX

Este documento consolida o diagnóstico, arquitetura e o planejamento de execução para corrigir os bugs e inconsistências reportados na transição. Ele serve como o guia definitivo ("Memória de Curto Prazo") para o próximo agente iniciar a Sessão 2.

## 1. O Que Foi Diagnosticado e Precisa ser Resolvido

### A. Aba Tutor (SenseiTab)
- **Treino Inteligente (Automático):** Foi esquecido na última refatoração. Ele orquestra os tópicos misturados (Dojo/Jornada) e precisa voltar para o topo (ou em destaque) na aba Tutor.
- **A Lição do Dia:** Falta padronizar o design e o botão de "Iniciar Sessão". O design divergiu do esperado (bordas ausentes ou cores misturadas).
- **Desafio do Mestre & Foco Específico:** Estes itens devem continuar aparecendo aqui, integrados visualmente ao Treino Inteligente e à Lição do Dia.

### B. Aba Dojo (DojoTab - Garden & Sensei)
- **Treino Inteligente (Misto/Geral):** Precisa aparecer acima dos Templos. O botão/banner deve ser estilizado no padrão, indicando o treinamento automático adaptativo.
- **Templos de Operações:** O usuário deve poder clicar para fazer treino inteligente isolado de matemática (adição, subtração, etc).
- **Desafio do Mestre:** Deve aparecer na aba Dojo, no final da rolagem, acima das estatísticas.

### C. Aba Jornada (JourneyTab)
- **Painel de Diagnóstico do Programa:** Ficou ótimo, deve ser mantido.
- **Organização das Trilhas (As Aventuras):** Atualmente está confuso ("muita cor, verde tag maximizar/minimizar"). Não sabemos se todas as aventuras estão listadas na ordem correta da pedagogia e do grafo. 
- **Solução:** Precisamos iterar sobre a `LearningPath` e a renderização em `JourneyTab` para garantir que o layout das ilhas siga rigorosamente o YAML/JSON de dependências e a arquitetura visual anti-monolítica.

### D. Bug do "Sapinho" (InteractiveNumberLine / O que vem depois)
- **Problema Atual:** O arraste não está fluido, e ao soltar o sapinho, ocorrem submissões precoces ("dá resposta errada sem querer e buga"). O botão "Avançar" não aparece no fluxo correto de confirmação de resposta.
- **Solução (Arquitetura do Componente):** 
  1. A `InteractiveNumberLine` não deve disparar `onAnswer` automaticamente no final do drag.
  2. O componente deve ter estado interno de `pos`.
  3. Haverá um botão "Confirmar Resposta". Somente ao clicar nele a resposta é submetida ao GameLoop.
  4. Caso o GameLoop avalie como certo/errado, o componente entra em estado *disabled* (readonly) e o botão "Avançar" (Next) do GameLoop assume o controle da transição (conforme regra de "Avançar" só aparece após submissão de estado).

### E. Fichas Pedagógicas e Catálogo
- As especificações e Fichas (Specs/Activities) devem ser organizadas no padrão de excelência catalogado.
- Tudo deve estar perfeitamente conectado com os templates de design (fácil leitura, sem bugs, sem erros). Isso impacta a estrutura de `src/curriculum/fichas/` e a maneira como `engine.ts` puxa os dados.

## 2. Ordem de Execução para o Próximo Chat

1. **Refatoração UI Sensível (SenseiTab & DojoTab):**
   - Restaurar o **Treino Inteligente** nas duas abas.
   - Corrigir o botão e layout da **Lição do Dia**.
   - Posicionar o **Desafio do Mestre** corretamente no final do DojoTab.
2. **Correção do Bug Interativo (Sapinho / NumberLine):**
   - Refatorar `InteractiveNumberLine.tsx` e `ExerciseRenderer.tsx` para separar o evento de "Arrastar" do evento de "Submeter Resposta".
   - Garantir fluidez no pointer events.
3. **Limpeza da Jornada e Fichas:**
   - Padronizar o catálogo de Fichas (Specs/Activities) com base no YAML/Grafo.
   - Simplificar visualmente a interface da Jornada, reduzindo o excesso de cores ou tags confusas.

## 3. Comando de Ignição

O usuário deve colar o comando fornecido para que o agente carregue este documento imediatamente ao iniciar o novo chat.
