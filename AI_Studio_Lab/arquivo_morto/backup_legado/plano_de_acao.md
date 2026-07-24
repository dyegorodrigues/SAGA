# 🗺️ Master Plan: Reestruturação Pedagógica e Arquitetural (Matemágica)

Este documento centraliza as etapas para alinhar o código-fonte atual com a verdadeira essência documentada nos manuais (`MANUAL_PEDAGOGICO_MESTRE.md`, `algoritmo_de_adaptacao.md`, `BLUEPRINT_MICROCOMPETENCIAS.md`).

## Fase 1: Correções Imediatas (Concluído)
- [x] **Motor de Recomendação (Dojo e Rotatividade)**: Ajustar `KidHomeScreen.tsx` para não prender a criança eternamente no primeiro nível. (Feito)
- [x] **Bug do Dojo (`TOFILL`)**: Garantir que as atividades visuais (`tenframe`, `singapore-bars`) não quebrem no modo Dojo. (Feito)
- [x] **Bug Áudio TTS x Tutorial**: Sincronização e escape de Emojis do TTS. (Feito)
- [x] **Tutorial "We Do" (Scaffolding)**: O botão "Ajuda" (mãozinha) não pode dar a resposta final; ele deve iniciar a contagem (1, 2...) e passar o bastão para a criança. (Feito)

## Fase 2: Currículo e Microcompetências (Em Andamento)
**Objetivo:** Alinhar `src/utils/generators.ts` com o Grafo de Microcompetências (`C0001` a `C0206`). O sistema atual agrupa atividades por temas de forma muito solta.
- [ ] **Mapeamento Exato:**
  - Auditar `matElite.ts` (as trilhas) para garantir que cada nível aponte para o gerador de microcompetência correto.
  - Criar os geradores ausentes para `C000A` (Canto Numérico), `C000B` (Símbolos).
  - Validar e refinar a progressão de `C0101` (Somar Juntando - Concreto) até `C0106` (Algoritmo Vertical - Abstrato).
- [ ] **Revisão Visual CRA (Concreto -> Representacional -> Abstrato):**
  - Garantir que `singapore-bars` (Representacional) exista antes das equações puras (Abstrato).

## Fase 3: O Verdadeiro Algoritmo Adaptativo
**Objetivo:** Substituir a heurística simples (níveis de 1 a 5) pelo `progressEngine` real.
- [ ] O progresso não deve ser apenas por "trilha" (ex: `math`), mas por microcompetência (`C0101`).
- [ ] Implementar a **Gestão de Frustração (Frustration Engine)** em `GameLoop.tsx`: 3 erros causam downgrade de microcompetência (e não apenas tirar uma estrelinha/nível).
- [ ] Implementar o **Spaced Retrieval** (Revisão Espaçada) baseada em tempo (usando timestamp do Firebase ou localStorage).

## Fase 4: Experiência e UI
- [ ] Consolidar uso de vozes e assets do Luna Studio.
- [ ] Polimento de interações, prevenindo totalmente "double-taps".
