# RELATÓRIO DE DEBUG E TRANSIÇÃO (RECUPERAÇÃO DE CONTEXTO)

Este documento foi gerado após uma falha de continuidade ("bug do agente") onde informações arquiteturais críticas e requisitos de UI foram perdidos ou ignorados durante a sessão. O objetivo deste arquivo é servir como **ponto de partida imediato** para o novo chat.

## 1. O Que Foi Perdido / Ignorado (Para Correção Imediata)

### A. Aba Tutor (SenseiTab) - UI e UX
A interface atual da aba Tutor está confusa, feia e com cores/nomenclaturas desconexas:
- **"A Lição do Dia" (A Aula do Mestre):** O design atual (todo azul) não ficou bom. E a limitação temporal deve ser removida: **Não há limite de 1 por dia.** Se a criança completar a aula e clicar de novo, o sistema deve gerar automaticamente a aula do "próximo dia" (próximo ciclo). A jornada é contínua.
- **Treino Mestre (Desafio Misto):** Atualmente está na aba `DojoTab` (laranja), mas **deve ser movido para a aba Tutor**. 
- **Tarefas do Sensei:** Esta seção dentro da aba Tutor deve agrupar de forma organizada e com design consistente:
  1. O **Treino Mestre** (Desafio do Mestre).
  2. As missões de **Foco Específico** (direcionadas para o Dojo).
  *O nome deve deixar muito claro que essas tarefas remetem às atividades do Dojo.*
- **Oficina:** A oficina de resgate (atualmente verde) deve ficar embaixo de tudo isso, mas com um design, cores e nomenclatura que conversem de forma elegante com o resto da aba. O visual hierárquico atual está feio e bagunçado.

### B. Admin God (Currículo e Testes)
- Foram discutidos ajustes estruturais profundos na aba `Admin God` relacionados ao mapeamento do currículo e painel de testes.
- **Status:** Estas implementações foram esquecidas pelo agente durante a refatoração do código fonte. Elas precisam ser retomadas.

### C. Documentação e Bug de Arquitetura
- O usuário reportou um bug na aba de documentação/arquitetura que eu havia prometido consertar e esqueci. 
- O mapa da arquitetura precisa ser revisto para refletir a nova componentização e corrigir as pendências estruturais indicadas pelo usuário.

### D. Diagnóstico do Programa da Jornada
- Eu havia projetado uma sugestão arquitetural brilhante sobre como estruturar o **diagnóstico do programa da jornada** e o cálculo de tempo.
- **Status:** Esse contexto foi obliterado da memória ativa. Ele deve ser recuperado e documentado corretamente na `BÍBLIA_DO_SAGA` e implementado no fluxo da `JourneyTab`.

## 2. Por que o Agente "Bugou"? (Post-Mortem)
1. **Fadiga de Contexto (Token Overflow):** A extração do monólito `GameLoop.tsx` gerou um volume colossal de diffs de código. Isso empurrou o contexto anterior (discussões de UI, Admin God e Jornada) para fora da janela de atenção do modelo.
2. **Falsa Confirmação:** O agente assumiu que registrar planos vagos na memória era o suficiente, mas falhou em escrevê-los em artefatos persistentes (`DIARIO_DE_BORDO.md` ou `BIBLIA_DO_SAGA.md`) ANTES de iniciar a codificação pesada.
3. **Corrupção de Estado Git:** Houve um erro interno de `.git` corrompido (`inflate: data stream error`), que causou perda de sincronia e pânico na ferramenta, levando a execuções desconexas.

## 3. Plano de Ação para o Novo Chat (Ordem de Execução)
1. **Refatoração Visual e Lógica da Aba Tutor (`SenseiTab.tsx`)**:
   - Redesenhar as cores e cards ("A Lição do Dia", "Tarefas do Sensei", "Oficina").
   - Mover o "Treino Mestre" do DojoTab para o SenseiTab.
   - Implementar a lógica de *Loop Contínuo* na Aula do Dia (remover a trava diária).
2. **Resgatar a Arquitetura da Jornada**:
   - Escrever e implementar o diagnóstico e cálculo de tempo que foi idealizado e perdido.
3. **Aba Admin God e Documentação**:
   - Aplicar as correções de currículo e testes que foram discutidas antes do bug.
   - Consertar o bug reportado na aba de documentação.

***Agente do próximo chat: LEIA ISTO E COMECE IMEDIATAMENTE PELO PASSO 1.***
