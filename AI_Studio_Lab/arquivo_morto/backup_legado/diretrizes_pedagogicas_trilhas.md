# 🗺️ Diretrizes Arquiteturais: Ilhas e Microcompetências

**Data da Atualização:** Julho 2026
**Autor:** Agente Arquiteto & Neuro-Pedagogo

## 1. Nomenclatura e Ocultação do Grafo
**Problema Relatado:** Letras e códigos como `C000A` e `C000B` vazando para a interface da criança geravam confusão e não eram lúdicos.
**Decisão Arquitetural:** 
- O ID do grafo (ex: `C0001`, `C0102`) agora é um metadado interno (`graphId`). 
- A interface da criança (UI) renderiza apenas nomes lúdicos e literais: "Canto Numérico", "Símbolos Numéricos", "Tirar e Esconder". 

## 2. Hierarquia de Navegação (Módulos Expansíveis)
**Problema Relatado:** A trilha ("Learning Path") estava como uma linha reta massiva e intimidadora, misturando conceitos muito diferentes sem respiro.
**Solução Aplicada (Componente `LearningPath.tsx`):**
- **Camada 1: Ilhas (Módulos/Fases):** Agrupamentos temáticos expansíveis (ex: *Ilha do Início*, *Ilha dos Padrões*, *Ilha das Contas*). Cada Ilha contém de 3 a 5 microcompetências.
- **Camada 2: Microcompetências (Trilhas):** As "bolhas" clicáveis na trilha em zigue-zague, que operam dentro da Ilha selecionada.
- **Camada 3: Níveis (Skills):** Cada trilha tem de 1 a 5 níveis que aprofundam aquele conceito específico.

## 3. Desambiguação de Exercícios (Soma vs Contagem)
**Problema Relatado:** Confusão semântica entre "Contagem Progressiva" e "Soma". Na teoria pedagógica, *Counting On* é uma estratégia para somar, mas no exercício a criança só via a conta de soma. 
**Ajuste:** Os nomes foram corrigidos para refletir a ação real que a criança vê. "Contagem Progressiva" no contexto de C0102 foi renomeada para "Soma (Counting On)" para ser claro aos pais que é soma através da estratégia de contagem. O mesmo para subtração. 

## 4. Telemetria e Rastreamento Futuro (Analytics)
**Registro de Insights:** O usuário solicitou lembrete sobre o rastreamento comportamental profundo da criança:
- **Latência (Tempo de Resposta):** Já rastreado no nível do `KidHomeScreen.tsx` para definir genialidade (ELO).
- **Cliques de Ajuda (Scaffolding):** Se a criança toca no mascote para ouvir de novo, ou erra e ouve o erro, isso deve impactar o domínio daquela microcompetência. (Métrica a ser isolada no motor de repetição espaçada).
- **Abandono/Skips:** Pular o exercício penaliza o domínio para que ele retorne no modo revisão depois.
