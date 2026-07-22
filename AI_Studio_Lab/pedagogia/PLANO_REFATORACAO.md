# 🛠️ PLANO DE REFATORAÇÃO SAGA

Análise concluída com sucesso. Todos os documentos antigos foram arquivados em `/AI_Studio_Lab/arquivo_morto/` e substituídos pelas novas versões definitivas (Bíblia, Grafo, Dojo, Manual Didático e o grafo YAML em `/curriculum/`). 

Abaixo apresento o **Plano de Ação** estruturado exatamente na ordem solicitada, detalhando o que muda, o que pode quebrar e os testes necessários. Em seguida, aponto **conflitos e lacunas** identificados na arquitetura atual que precisamos decidir antes de codar.

---

## 📋 FASES DA REFATORAÇÃO

### Passo 1: Modelagem de Dados (`src/types.ts` e Firebase)
- **O que muda:** 
  - Adição das interfaces do Dojo: `FactStrength`, `ProcStrength`, `DojoTrackState` e `DojoSession`.
  - Atualização de `State`: Adição de `dojoTracks` e `dojoFluency` ao estado raiz por criança.
  - Atualização da interface `Option`: Adição do campo `misconception?: string` (a tag sensora do Radar).
  - Atualização de `Progress`: Adição do campo `errKind?: string[]` (para registrar os misconceptions cometidos).
- **O que quebra:** Retrocompatibilidade de dados (saves antigos não terão `dojoTracks`). Precisaremos de uma função de migração/hidratação ao carregar o estado.
- **Teste:** Garantir que o estado inicial (novo usuário) é criado com os campos do Dojo corretos e o Firebase salva/lê as novas interfaces sem corromper.

### Passo 2: Motor de Desbloqueio (`src/utils/unlock_engine.ts`)
- **O que muda:** 
  - Criação do motor que lê `curriculum/grafo_saga.yaml` (precisaremos instalar `js-yaml` ou equivalente para o Vite carregar/processar o YAML).
  - Implementação da regra matemática do Grafo (Apêndice B): Nó abre `⇔` todos os pré-requisitos possuem `maxLvl >= 3` ou `dom = true`.
  - Raízes estáticas hardcoded no topo.
- **O que quebra:** O seletor de missões atual (que mostrava tracks baseado em regras antigas) vai parar de funcionar até ser integrado ao `unlock_engine`.
- **Teste:** Escrever casos de teste unitário validando que (a) Raízes estão sempre abertas; (b) Nó intermediário só abre se dependências = 3+; (c) Nó bloqueado retorna `false`.

### Passo 3: Separação de Motores (`src/utils/DojoEngine.ts` vs `ProgressEngine.ts`)
- **O que muda:** 
  - Criar `DojoEngine.ts` isolado para gerenciar a fluência de Fato (FD) e Procedimento (PD).
  - Ele será responsável por montar a sessão de treino misturando os itens (60% alvo, 20% revisão, 10% quente, 10% amostra) e atualizando `rt_medio` e `precisao`.
  - `ProgressEngine.ts` ficará exclusivamente com o progresso de aula (CRA).
- **O que quebra:** Telas que hoje tentam acessar o progresso de trilhas de Dojo (como `rapid-fire` antigo) precisarão apontar para o `DojoEngine`.
- **Teste:** Gerar um round sintético no DojoEngine e validar a proporção da mistura (alvo vs revisão vs quente).

### Passo 4: Refatoração do `GameLoop.tsx` (Camada 1 - O Fluxo Sagrado)
- **O que muda:** 
  - Fim da máquina de estados punitiva/longa no meio da questão (sem escalonamento E1 -> E2 -> E3 por erro consecutivo na questão).
  - Fluxo Camada 1: 1º erro (auto-correção e esconde distrator absurdo); 2º erro (dica `explain`); 3º erro (mostra reposta, marca falha e avança na hora).
  - Remoção de repetição de questões até acertar. O fluxo empurra a criança adiante.
- **O que quebra:** Os estados internos de `GameLoop` (`errosSeguidos`, `showHint`) precisam ser limpos a cada nova renderização e o componente `<Progress/>` não pode barrar o avanço.
- **Teste:** Forçar 3 erros rápidos em uma questão e verificar se o fluxo avança para a próxima após mostrar o porquê, sem travar a UI.

### Passo 5: Motor de Diagnóstico e Camada 2 (Radar de Lacunas)
- **O que muda:** 
  - Criar `src/utils/radarEngine.ts` para ler a telemetria do `GameLoop` ao final/pausa da sessão.
  - O motor vai contar as `misconception` tags recebidas. Se `tag X` aparece `>= 2` vezes, a *Camada 2* é engatilhada (agendando uma Missão de Resgate ou Microtutoria no próximo bloco).
- **O que quebra:** Precisamos injetar essa intervenção no composer da sessão *antes* da renderização visual ou como um slot extra.
- **Teste:** Simular uma bateria de respostas com a tag `inverte-coluna`. O motor deve disparar a flag `requireIntervention: true` para a próxima aula.

### Passo 6: O Composer da Sessão (A Nova "Anatomia da Sessão")
- **O que muda:** 
  - Refatorar o gerador de sessões (`minha aula`) para entregar exatos 5 blocos (Aquecimento, Resgate, Fronteira, Fluência, Fecho) com as doses baseadas na faixa etária da criança.
  - Injetar a microtutoria (I DO / Mão Fantasma) no início da *Fronteira* apenas se for a 1ª vez que a competência é acessada (nível 1).
- **O que quebra:** A UI do mapa/gerador de aulas. O componente de seleção precisa virar um botão central de "Entrar no Fluxo" que monta tudo por baixo dos panos.
- **Teste:** Validar que uma criança F1 recebe 10 questões (2 de Aquecimento, 4 de Fronteira, etc).

---

## ⚠️ CONFLITOS, LACUNAS E AMBIGUIDADES (Para sua Decisão)

1. **Leitura do arquivo YAML no navegador:** 
   O Vite (React) não processa `.yaml` nativamente em tempo de execução sem plugins extras ou importação direta como string. **Solução sugerida:** Instalar o pacote `js-yaml` e `@rollup/plugin-yaml` (ou converter para JSON via build) para que o import do Grafo funcione diretamente no motor (`import grafo from '../curriculum/grafo_saga.yaml'`). 
   
2. **Distratores nos Geradores (Tags de Misconception):**
   Para o Passo 5 (Radar) funcionar, **todos** os `options` gerados pelos kinds atuais em `generators.ts` precisam ser atualizados para emitir o campo `misconception`. Muitos geradores atuais emitem apenas números ou strings. Isso vai exigir uma refatoração grande dentro do `generators.ts` depois da fundação estar pronta. **Sugestão:** Fazer os passos 1 a 6 com as tags como "opcionais" e depois varrer `generators.ts` atualizando contrato por contrato.

3. **Mão Fantasma / Tutoriais Animados:**
   O componente `<GhostHand />` (I DO) mencionado no Passo 6 / Camada 2 não existe no código atual. Isso afetará temporariamente o Nível 1 das competências até que esse componente seja implementado (será apenas uma UI mockada no início).

4. **Trilhas de Dojo (FD/PD):**
   O `grafo_saga.yaml` possui uma aba `fluency` (FD1 a FD8). As trilhas de PD (Procedimento) mencionadas no Dojo (PD-A, PD-S, etc) não estão codificadas no YAML anexo, mas aparecem nos documentos. **Sugestão:** Focar no motor inicial cobrindo o que está em `fluency` no YAML e depois podemos cadastrar as trilhas de Procedimento manualmente.
