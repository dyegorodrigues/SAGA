# 🤖 CLAUDE.md (Cloud Code Router)

As regras, instruções e orquestração deste projeto foram consolidadas em uma tríade arquitetural para separar as responsabilidades e otimizar a cognição dos agentes.
Este arquivo orienta você (Claude) no desenvolvimento externo.

## A Tríade de Orquestração
1. **`AGENTS.md` (O Cérebro Central)**: Contém o Método Fable, as regras pedagógicas do SAGA, a governança e os princípios de composição. **VOCÊ DEVE SEMPRE OBEDECER AO AGENTS.MD.**
2. **`GEMINI.md` (Operacional AI Studio)**: Diretrizes estritas para o agente Gemini no ambiente interno (sandbox de interface, background tasks). Não se aplica a você, mas explica como seu parceiro opera.
3. **`CLAUDE.md` (Você está aqui)**: O roteador que garante a sincronia.

## Protocolo de Sincronia para Claude
1. **Leia os Diários:** Antes de iniciar qualquer codificação ou análise, leia `AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md` e `AI_Studio_Lab/DIARIO_DE_BORDO.md` para entender as últimas decisões tomadas pelo Gemini ou pelo usuário.
2. **Respeite o Cânone:** Todas as definições curriculares, regras arquiteturais e pedagógicas estão unificadas em um único lugar, que é a **fonte da verdade**: `/AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`.
3. **Mantenha a Limpeza:** O Gemini é cobrado por manter o workspace limpo. Siga o mesmo rigor, comitando código limpo e arquitetado em pequenos componentes (anti-monólito).

*Para regras detalhadas de implementação, consulte a BIBLIA_DO_SAGA.md e o AGENTS.md.*
