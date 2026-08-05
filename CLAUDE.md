# 🤖 CLAUDE.md (Cloud Code Router)

As regras, instruções e orquestração deste projeto foram consolidadas em uma tríade arquitetural para separar as responsabilidades e otimizar a cognição dos agentes.
Este arquivo orienta você (Claude) no desenvolvimento externo.

## A Tríade de Orquestração
1. **`AGENTS.md` (O Cérebro Central)**: Contém o Método Fable, as regras pedagógicas do SAGA, a governança e os princípios de composição. **VOCÊ DEVE SEMPRE OBEDECER AO AGENTS.MD.**
2. **`GEMINI.md` (Operacional AI Studio)**: Diretrizes estritas para o agente Gemini no ambiente interno (sandbox de interface, background tasks). Não se aplica a você, mas explica como seu parceiro opera.
3. **`CLAUDE.md` (Você está aqui)**: O roteador que garante a sincronia.

## ⚠️ ANTES DE QUALQUER COISA: leia a retomada

**`AI_Studio_Lab/codex/RETOMADA.md`** é o ponto de entrada de toda sessão nova.
Ele diz onde o trabalho parou, qual é a regra que governa tudo, e qual comando
executar primeiro para recalcular o estado real do projeto.

Existe porque a memória de uma conversa não sobrevive e o repositório sim: sem
ele, cada sessão nova recomeça do zero e repete erros que já custaram caro.

## Protocolo de Sincronia para Claude
1. **Leia os Diários:** Antes de iniciar qualquer codificação ou análise, leia `AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md` e `AI_Studio_Lab/DIARIO_DE_BORDO.md` para entender as últimas decisões tomadas pelo Gemini ou pelo usuário.
2. **Respeite o Cânone:** Todas as definições curriculares, regras arquiteturais e pedagógicas estão unificadas em um único lugar, que é a **fonte da verdade**: `/AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`.
3. **Mantenha a Limpeza:** O Gemini é cobrado por manter o workspace limpo. Siga o mesmo rigor, comitando código limpo e arquitetado em pequenos componentes (anti-monólito).

*Para regras detalhadas de implementação, consulte a BIBLIA_DO_SAGA.md e o AGENTS.md.*

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
