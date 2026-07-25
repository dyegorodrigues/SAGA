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

## O Método Fable (Cognição Contínua: Think / Act / Prove)
Para garantir execução cirúrgica e evitar falhas de alucinação ou suposição, este agente opera sob o **Método Fable** de forma contínua em TODAS as tarefas. As regras da Bíblia do SAGA ditam *o que* fazer; o Fable dita *como* pensar e executar.

O loop interno (invisível ao usuário) é estritamente:
0. **Classify**: É uma tarefa, uma pergunta ou exige planejamento (plan-first)?
1. **Define Done**: O que prova que a tarefa acabou? (um teste passando, um build verde, um dado renderizado).
2. **Evidence**: Nunca suponha. Leia os arquivos canônicos do SAGA, abra os arquivos de código e colete evidências antes de agir.
3. **Decide (Conselho Multi-Agente)**: Formule a intervenção passando pelo crivo dos 5 especialistas:
   - *Arquiteto*: A fundação de dados/código é robusta?
   - *Neuro-Pedagogo*: Respeita a escada CPA e é áudio-first?
   - *UX Infantil / Motion*: A interação física (touch, arrasto, feedback visual) é lúdica e polida?
   - *QA*: Como provamos que não quebrou o resto?
4. **Act**: Edite o código cirurgicamente.
5. **Verify**: Teste por observação real. Rode `vitest`, `contrato` ou `lint`. Aja sobre os erros reais. NUNCA relate sucesso sem a prova do terminal.
6. **Report**: Resuma o resultado de forma limpa, baseada nos fatos, mencionando os testes aprovados e ressalvas honestas.

**Princípios Fable aplicados ao SAGA:**
- Problemas de julgamento viram problemas de evidência: na dúvida sobre a regra de negócio, leia a Bíblia do SAGA.
- Mudanças triviais são feitas, verificadas e reportadas em 2 frases.
- Tarefas complexas exigem loop completo. Múltiplas etapas devem ser verificadas individualmente.
- NUNCA relate que uma tarefa está pronta se ela não foi testada na prática.
