# 📝 Registro de Auditoria e Correção de Bugs (SAGA)

Este documento registra minuciosamente todos os problemas, reclamações do usuário, falhas lógicas e correções implementadas no projeto. O objetivo é manter um histórico detalhado para evitar regressões e guiar os agentes (QA, Pedagogo, Engenheiro) nos próximos desenvolvimentos.

## 🐛 Bug 1: "Number Bonds" gerando números negativos
- **Relato do Usuário**: O exercício de "Amigos dos Números" (Parte-todo) estava gerando respostas negativas, tornando a questão impossível e sem lógica para uma criança (e até para adultos).
- **Causa Técnica (Engenharia)**: No gerador `gN1_10` (em `src/utils/generatorsF1.ts`), as propriedades enviadas para o componente visual `<NumberBond>` estavam invertidas. O componente esperava `whole` (o todo, número maior) e `part` (a parte, número menor). O código estava enviando a parte no lugar do todo, fazendo com que a renderização visual subtraísse o maior do menor (ex: 2 - 5 = -3), exibindo um "-3" na interface.
- **Análise Pedagógica**: Inaceitável. A pedagogia infantil inicial (CRA) não introduz números negativos nessa fase. O conceito de "Number Bonds" visa mostrar que um número maior é composto por duas partes menores. 
- **Correção Implementada**: O mapeamento de propriedades no `gN1_10` foi corrigido. Agora, `a: whole, b: part` garante que o número no topo do círculo seja sempre a soma das duas partes na base.

## 🐛 Bug 2: Sapinho (Reta Numérica) pulando etapas
- **Relato do Usuário**: No exercício da reta numérica interativa (sapinho), ao arrastar para a resposta certa, o jogo dizia que acertou mas já pulava imediatamente para a próxima tela, sem dar tempo de ver o resultado ou entender o que aconteceu. Também havia relatos de começar "já com a resposta".
- **Causa Técnica (Engenharia e UX)**: O componente `InteractiveNumberLine.tsx` chamava a função `onAnswer` imediatamente nos eventos `handleDragEnd` (ao soltar o arraste) e `handleClick` (ao clicar). Como o `GameLoop.tsx` processa o acerto assim que `onAnswer` recebe o valor correto, a tela avançava sem que a criança pudesse processar o feedback visual do sapinho pousando no lugar certo.
- **Análise de UX Infantil**: Em jogos educativos, o feedback positivo precisa de um tempo de respiro ("dwell time"). A ação motora não deve engatilhar a transição de estado imediatamente sem a confirmação cognitiva da criança.
- **Correção Implementada**: O disparo automático de `onAnswer` foi removido. Foi adicionado um botão explícito **"Confirmar"**. Agora a criança arrasta o sapinho, visualiza onde ele parou, e depois clica em confirmar. Isso respeita o tempo cognitivo infantil.

## 📚 Alinhamento Pedagógico e DAG
- A árvore curricular (`src/utils/curriculum.ts`) foi revisada e a ordem do 1º Ano foi ajustada para seguir uma progressão mais lógica, evitando saltos cognitivos bruscos.
- As explicações verbais (`explain` e `howto`) foram aprimoradas para os exercícios de Number Bonds, ensinando a relação de "família de números" (ex: "Os dois pedaços de baixo se juntam para formar o grandão lá em cima").

---
*Status: Registrado e Corrigido.*
*Data: Julho de 2026*

### Fase M1 e M2 - Consagração da Fonte da Verdade e Grafo Executável
**Data:** $(date)
**Problema Relatado:** O usuário indicou fragmentação dos documentos, arquivos legados se misturando com as novas regras (JSON/YAMLs perdidos) e a ausência da criação do Grafo Executável em YAML, o que impedia o início da implementação real da arquitetura SAGA.
**Causa:** Ausência dos Manuais Didáticos formalizados, ausência do manual DOJO SAGA e manutenção de arquivos obsoletos na raiz do projeto e na pasta `AI_Studio_Lab/pedagogia/`.
**Solução (O que foi feito):**
1. **Documentação Completada:** Criado o `DOJO_SAGA.md` para explicar a mecânica de fluência.
2. **Manuais Didáticos Criados:** Escritos `MANUAL_DIDATICO_SAGA_part1.md`, `part2.md` e `part3.md`, traduzindo a escada CPA (Concreto, Pictórico, Abstrato) em instruções de tela, tutorial do tutor e simulação dos erros das crianças.
3. **M1 (Congelar e Limpar) Finalizado:** Movidos `grafo_saga.json`, `grafo_saga.yaml`, as interações antigas e os backups antigos para dentro de `AI_Studio_Lab/arquivo_morto/`. Nada ficou de fora. Apenas a `BIBLIA`, o `GRAFO`, o `DOJO` e os `MANUAIS` ficaram em `pedagogia/`.
4. **M2 (Grafo Executável) Finalizado:** Um script customizado foi criado para varrer o `GRAFO_DE_CONHECIMENTO_SAGA.md` (a Bíblia) e extrair programaticamente todos os domínios (N1 a N7, AL, GE, GM, PE) para a nova pasta oficial `/curriculum/` na raiz do app, gerando arquivos `[STRAND].yaml` (`N1.yaml`, `N2.yaml`, etc.) estruturados de forma declarativa e com as chaves corretas, conforme estipulado pela Bíblia.
