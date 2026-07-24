# 🤖 AI Studio Agent Memory & Project Rules

## Sincronização do AI Studio Lab
Você está trabalhando em sincronia com o Cloud Code (Claude) que faz o desenvolvimento externo.
Para não perder informações e manter as melhores práticas de engenharia de software educacional:
1. Todo o histórico, auditorias, análise de bugs, erros cometidos e definições de arquitetura **DEVEM** ser centralizados na pasta `/AI_Studio_Lab/`.
2. A **BÍBLIA DO SAGA** (`/AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` - Versão Atual: 2.5) e o **GRAFO DE CONHECIMENTO** (`/AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`) são as **ÚNICAS FONTES DE VERDADE**. Quaisquer documentos legados foram movidos para `arquivo_morto/` e **não devem ser usados nem recriados**.
3. **REGISTRO OBRIGATÓRIO DE ERROS E EVOLUÇÕES:** Todas as interações profundas, dúvidas questionadas pelo usuário, erros de IAs em outras interações, testes reprovados, descobertas do simulador e backlogs **DEVEM** ser minuciosamente documentados em `AI_Studio_Lab/DIARIO_DE_BORDO.md` e `AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md`. Nada deve ficar apenas no histórico do chat.
4. Ao gerar ideias, não as deixe apenas no chat. Salve-as em arquivos `.md` dentro do `/AI_Studio_Lab/`.

## Diretrizes do Projeto SAGA (ex-Matemágica)
- **Público Alvo**: Crianças (4-12 anos).
- **Linguagem**: PT-BR, áudio-first (não bloqueia no texto), feedback positivo e didático (nunca punitivo).
- **Pedagogia**: Método CRA (Concreto → Representacional → Abstrato), Grafo DAG de progressão adaptativa (1 experiência/microcompetência por sessão).

## Estrutura de Agentes Especializados e Evolutivos
Sempre que auditar, testar ou desenvolver novas mecânicas (Kinds) ou interfaces, incorpore a visão transversal de todos estes especialistas:
1. **O Auditor de Qualidade (QA Human-Like Tester)**
2. **O Neuro-Pedagogo e Tutor**
3. **O Arquiteto e Engenheiro de Software**
4. **O Diretor de Animação (Motion)**
5. **O UX Infantil**

## Governança e Regras Críticas
- Nenhuma contagem de testes importa se as suítes corretas (`unlockEngine`, `composer`, `generators`) não foram rodadas ou se estão rodando em pastas de backup (`arquivo_morto`).
- Ferramentas de auditoria (`catalog_auditor.cjs`) devem ser sempre baseadas na leitura dos arquivos canônicos.
- O simulador precisa de uma *linha de base de plausibilidade*; números internamente incoerentes significam que a ferramenta precisa ser investigada.
