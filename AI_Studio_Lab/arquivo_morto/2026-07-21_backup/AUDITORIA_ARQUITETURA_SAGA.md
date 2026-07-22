# 🔍 AUDITORIA DE ARQUITETURA E TRANSIÇÃO SAGA
**Data:** $(date)
**Gatilho:** Inserção dos novos Manuais Didáticos (Partes 1, 2 e 3) e Dojo Saga, além da atualização final da Bíblia e Grafo de Conhecimento.
**Executores:** Enxame de Agentes (Arquiteto, Neuro-Pedagogo, QA, UX Infantil).

## 1. Status dos Arquivos (A Fonte da Verdade)
- **ARQUIVADOS:** O antigo `grafo_saga.json`, `grafo_saga.yaml` e as antigas documentações de metodologia foram movidos definitivamente para `AI_Studio_Lab/arquivo_morto/`. Eles NÃO influenciam mais o código.
- **ATIVOS (Novos/Atualizados):**
  - `BIBLIA_DO_SAGA.md` (Atualizado)
  - `GRAFO_DE_CONHECIMENTO_SAGA.md` (Atualizado)
  - `DOJO_SAGA.md` (Novo)
  - `MANUAL_DIDATICO_SAGA_part1.md`, `part2.md`, `part3.md` (Novos)
- **PROCESSADOS:** O Grafo de Conhecimento foi convertido pelo Arquiteto em arquivos `[STRAND].yaml` dentro de `/curriculum/` para consumo direto pelo motor de TypeScript.

## 2. Diagnóstico de Discrepância (Código Atual vs Nova Documentação)
Após varredura no código atual (`src/types.ts`, `src/components/GameLoop.tsx`, `src/utils/generators.ts`), o Enxame identificou os seguintes abismos entre a nova pedagogia e a implementação atual:

### A. Visão do Neuro-Pedagogo (A Escada de Erro e o Dojo)
- **Ausência da Escada de Erro (E1, E2, E3):** Os novos manuais exigem que o erro não seja tratado com um simples "tente novamente". O erro 1 deve dar Dica (E1), o erro 2 deve ser Demonstração do Tutor (E2) e o erro 3 deve ser Fazer Junto (E3 - Ghost Hand). Atualmente, o `GameLoop.tsx` não suporta essa máquina de estados de remediação.
- **O Dojo e a Fluência (Força por Fato):** O `DOJO_SAGA.md` introduz a métrica `FactStrength` com `rt_medio` (tempo de reação alvo por trilha: 3s a 6s) e fila quente para erros. Nada disso existe no banco de dados do usuário atual (Firestore) nem no `src/types.ts`. A prática atualmente é estática e não baseada em decaimento de memória individual por fato matemático.

### B. Visão do Arquiteto (Estrutura de Dados e Engine)
- **Tipagens Inexistentes:** Precisamos implementar as tipagens descritas no Dojo:
  ```typescript
  interface FactStrength {
    fact_id: string; // ex: "mul:7x6"
    forca: 0 | 1 | 2 | 3 | 4 | 5;
    rt_medio: number;
    ultima_vez: number;
    erros_seguidos: number;
  }
  interface DojoSession {
    fd_id: string;
    itens: string[];
    acertos: number;
    rt_medio: number;
    fila_quente_restante: string[];
  }
  ```
- **Separação Aula vs Dojo:** O `GameLoop.tsx` hoje mistura o conceito de aprender e treinar. A nova Bíblia separa isso: A Aula desbloqueia o conceito (nível >=4); O Dojo treina a fluência (Tempo de Reação). Precisamos criar um `DojoEngine.ts` separado do `GameLoop.tsx`.

### C. Visão do UX Infantil & Motion
- **O Ritual do Dojo:** O documento exige um ritual de reverência (1 respiração, 2s) e um cronômetro que é *invisível antes dos 7 anos*, tornando-se opcional depois. Nossa UI atual de treino/quiz não possui esses estados de "tatame".
- **Visualização CPA (Concreto-Pictórico-Abstrato):** Os Manuais Didáticos exigem que as animações de "reagrupamento" (ex: N3.12 - barra explodindo em 10 unidades) aconteçam *no mesmo frame* em que o número na chave é cortado. A UI precisa de um componente `SplitScreen` (Material Dourado + Algoritmo).

## 3. Plano de Ação e Refatoração
1. **Fase 1 (Banco de Dados e Tipos):** Atualizar `src/types.ts` e `firebase.ts` para suportar `FactStrength`, `DojoTrackState`, e o modelo de competências baseado nos YAMLs de `/curriculum/`.
2. **Fase 2 (Motor do Dojo):** Criar `src/utils/dojoEngine.ts` responsável por gerar os rounds misturando (60% alvo, 20% revisão, 10% quente, 10% amostra) e processando o RT (Reaction Time).
3. **Fase 3 (GameLoop CPA):** Refatorar o `GameLoop.tsx` para interceptar erros e disparar E1 (Dica), E2 (Worked Example) e E3 (Ghost Hand).
