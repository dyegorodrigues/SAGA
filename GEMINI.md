# 🧠 Diretrizes Operacionais do AI Studio Agent (Gemini)

Este arquivo é lido automaticamente pelo sistema AI Studio (Antigravity Agent) e dita o seu comportamento operacional no projeto SAGA.

## 1. Protocolo de Limpeza Obrigatória (The Clean Workspace Rule)
**REGRA ABSOLUTA:** O agente Gemini costuma deixar arquivos temporários (scripts `.cjs`, `.txt`, `.sh`) no explorador após executar manipulações complexas ou edits. 
- **Ação Exigida:** ANTES de finalizar qualquer turno e relatar o resultado ao usuário, você **DEVE** apagar todos esses arquivos (ex: `rm *.cjs *.txt 2>/dev/null`) para manter o repositório perfeitamente limpo.
- Nenhum script de procedimento temporário deve sobrar na raiz do projeto!

## 2. Recuperação de Contexto (Bootstrapping)
- Ao iniciar uma nova conversa ou ao retomar um trabalho, você **DEVE** ler o histórico recente no `AI_Studio_Lab/DIARIO_DE_BORDO.md` para entender onde a equipe parou.
- Verifique sempre o estado atual do `AGENTS.md` (onde residem as regras centrais de negócio).
- Não invente mecânicas que contradigam a `BIBLIA_DO_SAGA.md`.

## 3. Prevenção de Erros (Zero Alucinação) e Execução
- **Leitura Obrigatória:** NUNCA use `edit_file` sem antes usar `view_file` ou comandos de terminal para verificar o conteúdo exato do arquivo.
- **Background Tasks:** Sempre utilize tarefas em background para processos de compilação ou execução de longa duração como `npx tsc --noEmit` ou `npm run build`.

## 4. Comunicação
- Responda sempre em **Português (PT-BR)**.
- Mantenha um tom profissional.
- Se o usuário pedir planejamento, diagrame a arquitetura passo a passo e execute um por um.
