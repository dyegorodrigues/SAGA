# 🚀 Plano de Ação: O Motor de Micro-Tutoriais e Scaffolding

O problema central detectado é: o aplicativo testa o conhecimento antes de garantir que a criança aprendeu a mecânica (falta a Mão Fantasma, o modo "I Do / We Do"). 

Aqui está o plano de desenvolvimento passo a passo (já planejado e orquestrado no laboratório) para resolver isso nas próximas iterações do código fonte:

## Fase 1: Arquitetura de Estado do Dojo (O Motor)
- **Componente Alvo:** `src/components/KidDojo.tsx` (ou o loop principal de exercícios).
- **Alteração:** Introduzir a variável de estado `tutorialMode` (ex: `tutorialMode: "I_DO" | "WE_DO" | "YOU_DO"`).
- **Gatilho:** Se `progress.lvl === 1` e `progress.xp === 0` (primeira vez na trilha), o exercício **não** inicia no modo "Você Faz". Ele inicia travado no modo "Eu Faço".

## Fase 2: Feedback Sensível de Erro (Scaffolding Reativo)
- **Componente Alvo:** Kinds (`KidBond`, `KidApple`, `KidSequence`, etc.) e o Gerador (`src/utils/generators.ts`).
- **Alteração:** Quando a criança clica na opção errada, a tela não pode apenas balançar e emitir som de erro. 
- **Execução:** O mascote deve aparecer e falar o `prompt` da variável `howto` ou `explain` (que já existem no `generators.ts`, mas hoje só são mostrados depois de responder). A interface deve esconder as opções absurdas (deixando apenas as mais próximas) para evitar o "chute às cegas" contínuo.

## Fase 3: Telemetria de Dúvidas (Analytics de Frustração)
- **Componente Alvo:** `src/types.ts` e `src/App.tsx` (Lógica de salvamento de progresso).
- **Alteração:** O objeto de progresso ganha telemetria profunda.
- **Execução:** 
    - O mascote ganha um botão "?" permanente na tela.
    - Se clicado, ele repete a instrução e incrementa `progress.helpClicks++`.
    - Se a criança errar mais de 2 vezes seguidas na mesma questão, o sistema registra `progress.frustrationEvents++`.
    - Isso afetará a velocidade em que o ELO sobe.

## Fase 4: A Mão Fantasma (UI Motion)
- **Componente Alvo:** `framer-motion` em React.
- **Alteração:** Criar um componente `<GhostHand />` (um cursor infantil translúcido) que se movimenta sozinho da origem ao destino correto na tela, mostrando visualmente como se faz.

## Conclusão de Arquitetura
Esta não é uma mudança banal, é a implementação do núcleo da metodologia CRA na interface. O código atual está pronto estruturalmente (a teia pedagógica, as ilhas, o gerador de questões lúdicas) para receber essa injeção de motor de tutoriais. 
