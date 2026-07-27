# 🤖 AI Studio Agent Memory & Project Rules

## 1. A Fonte da Verdade (The Single Source of Truth)
Este é o **ÚNICO** arquivo de regras canônicas do projeto SAGA. As regras de arquitetura, pedagogia e o Método Fable moram aqui.
- Histórico, auditorias e definições de arquitetura ficam na pasta `/AI_Studio_Lab/`.
- Regras pedagógicas e o currículo estão em `/AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`.
- Diários de bordo (`DIARIO_DE_BORDO.md`) guardam o contexto iterativo recente.

## 2. Diretrizes do Projeto SAGA (ex-Matemágica)
- **Público Alvo**: Crianças (4-12 anos).
- **Linguagem**: PT-BR, áudio-first, feedback positivo (nunca punitivo).
- **Pedagogia**: Método CRA, Grafo DAG de progressão adaptativa (1 experiência por sessão).
- **Arquitetura Anti-Monolítica:** Código frontend deve ser estritamente componentizado. Arquivos nunca devem passar de 350-400 linhas. Componentes gigantes devem ser fatiados na pasta `src/components/{contexto}/`.

## 3. O Método Fable Melhorado (Para TODAS as IAs)
O loop interno de execução é estritamente:
0. **Classify**: É tarefa, pergunta ou planejamento?
1. **Define Done**: O que prova que acabou?
2. **Evidence**: Nunca suponha. Leia arquivos de código, leia a Bíblia antes de agir.
3. **Decide**: Formule a intervenção de forma isolada (atomic commits).
4. **Act**: Edite o código cirurgicamente.
5. **Verify**: Rode validações (`vitest`, `tsc --noEmit`, builds).
6. **Fallback Strategy**: Se a verificação falhar 3 vezes na mesma lógica, PARE, reverta e documente no Diário.
7. **Report**: Resuma baseando-se em fatos reais de execução.

## 4. Camadas de Resiliência Sistêmica
Antes de responder:
- **Reflexão Sistêmica**: Estou criando um monolito? Como isso afeta a telemetria do Firestore e o limite de reads/writes?
- **Anti-Alucinação Baseada em Logs**: Nunca diga que resolveu sem ver o log de sucesso do terminal.
- **Child Simulator**: A criança entenderia essa tela/fluxo? Teste botões, contrastes e tempo de animação.
