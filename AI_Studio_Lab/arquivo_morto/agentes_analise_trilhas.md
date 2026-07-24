# 🧠 Auditoria Swarm: Estruturação das Trilhas (Grafo C0XXX)

**Data da Auditoria:** Julho 2026
**Objetivo:** Reorganizar as microcompetências matemáticas (`src/utils/generators.ts`), alinhar o `KidHomeScreen.tsx` com uma navegação no estilo Duolingo (Learning Path) e garantir a qualidade pedagógica.

---

## 1. Relatório do Arquiteto / Engenheiro de Software
**Análise:** Existia uma duplicação perigosa entre `generators.ts` e `curriculum.ts` (exportando ambos `TRACKS_PRE`). Quando modificávamos um, a UI ignorava porque puxava do outro.
**Solução Aplicada:**
- Unificamos o currículo-mestre em `curriculum.ts`. Todos os componentes e subjects agora o respeitam.
- Adicionamos o `LearningPath.tsx`: Um novo componente dedicado à trilha de aprendizagem contínua. As crianças agora podem ver a navegação em zigue-zague (Caminho de Aprendizagem) ou alternar para a visão em lista.

## 2. Relatório do Neuro-Pedagogo
**Análise:** O usuário notou que exercícios como "Canto Numérico" e "Símbolos" não estavam aparecendo e que faltava organização cronológica/cognitiva (Grafo).
**Solução Aplicada:**
- Nomeamos as trilhas no UI com seus respectivos IDs do *Grafo de Microcompetências* (ex: **C000A: Canto Numérico**, **C0101: Somar Juntando**).
- Isso dá visibilidade imediata (tanto para a criança quanto para os pais/admin) da escada cognitiva que está sendo percorrida.
- Asperidade (Concreto -> Representacional -> Abstrato) foi mapeada para os Kinds de UI. O `singapore-bars` está agora integrado à trilha C0102.

## 3. Relatório do Auditor de Qualidade (QA)
**Análise:** O app poderia "bugar" (tela gigantesca cheia de quadradinhos) se apenas continuássemos jogando botões na Home.
**Solução Aplicada:**
- O Toggle *O Mapa de Ilhas* (Saga) x *Todas as Matérias* (Lista) evita superlotação visual.
- A trilha Saga foca na "Matemática", escondendo opções não-essenciais na visão de jornada (onde o progresso realmente acontece).

## 4. Diretor de UX / UI Infantil
**Análise:** Um dashboard de pais / painel administrativo foi solicitado. 
**Plano de Ação:** 
- A UI de Trilhas já acomodou a visão. Para o "Admin God Panel", as trilhas já estão todas catalogadas e visíveis.
- O toque, espaçamento (Touch Targets de 96x96px) no `LearningPath.tsx` estão dimensionados para dedinhos, sem usar sliders finos.

---
**Status da Ação:** Fase 2 (Alinhamento de Currículo e Grafo) Concluída com sucesso na base de código. O "Learning Path" já está vivo.
