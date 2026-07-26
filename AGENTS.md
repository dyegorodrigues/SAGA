# 🤖 AI Studio Agent Memory & Project Rules

## 1. A Fonte da Verdade (The Single Source of Truth)
Este é o **ÚNICO** arquivo de regras canônicas do projeto. Tanto o Cloud Code (Claude) no desenvolvimento externo quanto o AI Studio Agent (Gemini) no ambiente interno **DEVEM** ler e obedecer este documento. 
- Histórico, auditorias e definições de arquitetura ficam na pasta `/AI_Studio_Lab/`.
- Regras pedagógicas e o currículo estão em `/AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`.
- Diários de bordo (`DIARIO_DE_BORDO.md`) guardam o contexto iterativo recente.

## 2. Diretrizes do Projeto SAGA (ex-Matemágica)
- **Público Alvo**: Crianças (4-12 anos).
- **Linguagem**: PT-BR, áudio-first, feedback positivo (nunca punitivo).
- **Pedagogia**: Método CRA, Grafo DAG de progressão (1 experiência por sessão).
- **Arquitetura Anti-Monolítica:** Código frontend deve ser estritamente componentizado. Componentes grandes devem ser fatiados em `src/components/{contexto}/`.

## 3. O Método Fable Melhorado (Para TODAS as IAs)
O loop interno de execução é estritamente:
0. **Classify**: É tarefa, pergunta ou planejamento?
1. **Define Done**: O que prova que acabou?
2. **Evidence**: Nunca suponha. Leia arquivos de código, leia a Bíblia antes de agir.
3. **Decide**: Formule a intervenção de forma isolada (atomic commits).
4. **Act**: Edite o código cirurgicamente.
5. **Verify**: Rode validações (`vitest`, `tsc --noEmit`, builds).
6. **Fallback Strategy**: Se a verificação falhar 3 vezes na mesma lógica, PARE, reverta e documente no Diário.
7. **Report**: Resuma baseando-se em fatos.

## 4. Diretrizes Operacionais Específicas: AI Studio Agent (Gemini)
Estas regras ditam como o agente operando dentro do Google AI Studio deve se comportar:
- **[CRÍTICO] A Regra do Espaço Limpo:** O Gemini costuma criar arquivos temporários (ex: `patch.cjs`, `script.cjs`, `regex.txt`) para manipular código. ANTES de finalizar qualquer turno, você **DEVE** apagar todos esses arquivos (ex: `rm *.cjs *.txt 2>/dev/null`). **Nenhum script de procedimento deve sobrar na raiz.**
- **Zero Alucinação:** NUNCA use ferramentas de edição sem antes usar `view_file` ou `sed -n` para verificar as linhas reais.
- **Background Tasks:** Sempre utilize tarefas em background para processos lentos como `npm run build` ou `npx tsc --noEmit`.

## 5. Diretrizes Operacionais Específicas: Cloud Code (Claude)
Estas regras ditam como o agente operando externamente (Cursor/CLI) deve se comportar:
- **Respeite o Cânone:** Não reescreva currículo ou invente regras sem base no `/AI_Studio_Lab/pedagogia/`.
- **Handshake de Contexto:** Sempre comece seu turno lendo o `AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md` para entender as últimas mudanças feitas pelo Gemini.

## 6. Camadas de Resiliência Sistêmica
Antes de responder:
- **Reflexão Sistêmica**: Estou criando um monolito? Como isso afeta a telemetria?
- **Anti-Alucinação Baseada em Logs**: Nunca diga que resolveu sem ver o log de sucesso do terminal.
- **Child Simulator**: A criança entenderia essa tela/fluxo?
