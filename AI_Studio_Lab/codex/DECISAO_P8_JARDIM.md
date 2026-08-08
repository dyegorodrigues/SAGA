# Decisão P8 — Jardim do Dojo como camada de automaticidade derivada da Jornada

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado:** **RESOLVIDA, integrada e validada**

## 1. Problema encontrado

O repositório já possuía fichas autorais de Jardim (`JD1`, `JD2`, `JD3`, `JD5`) e uma aba chamada **Dojo Garden**, mas as duas coisas não estavam conectadas.

A UI antiga do Garden:

- ignorava `JARDIM`;
- filtrava genericamente `ALL_MATH_TRACKS` por estrelas;
- chamava a lista de revisão CRA;
- reutilizava `state.progress` da Jornada como se fosse estatística de Dojo;
- oferecia seletor manual de nível.

Portanto o nome “Garden” existia, mas o consumidor pedagógico real não.

## 2. Por que não bastava ligar `JD*` ao GameLoop

O GameLoop existente usa `applyJourneyAnswer`, cujo eixo é **compreensão conceitual**:

- acertos/erros movem nível;
- banco de revisão e coroa pertencem à competência curricular;
- `state.progress` representa o nó do DAG.

O Jardim mede outra dimensão: **automaticidade pré-simbólica**.

Misturar os dois motores produziria três erros sistêmicos:

1. uma trilha `JD*` viraria, na prática, um segundo nó curricular;
2. lentidão poderia ser tratada como falha conceitual;
3. treino de fluência poderia subir/descer o nível da Jornada.

A decisão é separar **estado e regra de progressão**, compartilhando apenas a casca de exercício/renderização.

## 3. Arquitetura escolhida

### 3.1 JD não entra no DAG

As mães continuam sendo as competências canônicas:

- JD1 → `N1.03`;
- JD2 → `N1.08`;
- JD3 → `N1.11`;
- JD5 → `N1.10`.

Todas as trilhas implementadas abrem quando a mãe alcança **nível 3 já conquistado** (`maxLvl >= 3`) ou domínio.

`JD4` continua fora desta implementação e permanece dívida curricular separada.

### 3.2 Estado próprio

O estado de automaticidade vive em:

`state.dojoTracks[kidId][JD*]`

Nunca em:

`state.progress[kidId][JD*]`

`DojoTrackState` foi ampliado de forma compatível com saves antigos e pode carregar:

- `family: "JD" | "FD" | "PD"`;
- `currentStep`;
- `highestStep`;
- `goodRounds` / `weakRounds`;
- `rounds`, `attempts`, `correct`;
- `avgCorrectRtMs`;
- `lastDay`.

`currentStep` pode recuar para facilitar o próximo treino; `highestStep`/conquista nunca regride.

### 3.3 Unlock é derivado, não confiado ao save

`unlocked` salvo é cache/apresentação. A autoridade é recalculada a cada leitura a partir da competência-mãe.

Consequências testadas:

- 999 estrelas não abrem JD;
- `unlocked: true` num save não fura a mãe;
- se a criança já conquistou `maxLvl >= 3`, regressão temporária de `lvl` não fecha a porta.

## 4. Motor de round do Jardim

Implementação principal:

`src/curriculum/motores/jardimEngine.ts`

Commit-base do motor puro:

`5b22e6d4594db68c3f86414dccd18c40faf49619`

Contrato:

- round válido: 6–10 itens;
- runtime atual: 8 itens;
- cronômetro invisível;
- `rt_alvo` vem da ficha de cada degrau;
- acerto dentro do alvo = correto + fluente;
- acerto lento = compreensão preservada, automaticidade ainda em treino;
- erro = pode emitir hipótese cognitiva real;
- lentidão **nunca** vira `misconception`.

### Progressão

Um round é bom somente se satisfaz **as duas dimensões**:

- precisão ≥ 80%;
- respostas corretas dentro do `rt_alvo` ≥ 80%.

Então:

- 2 rounds bons consecutivos → avança um degrau;
- 2 rounds bons no topo → `mastered/reflexo`;
- 2 rounds com precisão <60% → recua o próximo treino um degrau;
- recuo nunca diminui `highestStep`.

Isso impede que o Jardim vire uma segunda Jornada baseada apenas em acerto.

## 5. Primeira resposta cognitiva é a medida

O retry suave do SAGA é preservado: a criança pode errar, receber ajuda e recuperar a questão.

Mas para automaticidade:

- erro real + recuperação posterior continua **erro medido** no round;
- erro motor/dedo não entra como tentativa cognitiva;
- recuperação pode receber feedback/recompensa gentil sem inflar precisão.

Essa regra mora em função pura (`tentativaJardimDoTerminal`) e tem teste permanente.

## 6. Integração com GameLoop e App

`jardimSession.ts` é o adaptador explícito:

- ficha JD → `Track` executável;
- save → `JardimTrackState` normalizado;
- estado → projeção efêmera de `Progress` apenas para a casca do GameLoop.

O GameLoop ganhou `progressionMode`:

- `journey` continua default;
- `garden` compartilha renderer, voz, feedback e retry;
- `garden` **não chama `applyJourneyAnswer`**;
- o degrau fica fixo durante todo o round;
- banco/Leitner/coroa da Jornada não são usados;
- `applyJardimRound` só é chamado ao encerrar o round.

O App salva o resultado do round atomicamente em `dojoTracks` e mantém `state.progress` curricular separado.

## 7. Radar sem confundir lentidão com erro

Erros cognitivos reais observados no Jardim são atribuídos à **competência-mãe** no Radar.

Não existe Radar de `JD*` como competência independente.

As ocorrências não são deduplicadas globalmente dentro do round: o Radar precisa saber quando a mesma hipótese apareceu em mais de uma questão.

## 8. Porta autoral do Composer

O fiscal `portaDosFundos.test.ts` detectou que `jardimSession.ts` chama `Composer.generate` fora de `composerCanary.ts`.

Isso **não** foi silenciado com uma exceção genérica.

A porta foi declarada nominalmente no fiscal com a justificativa:

- `composerCanary.ts` é a ponte dos nós da Jornada/DAG e possui rollback legado;
- `jardimSession.ts` é a ponte das fichas JD de automaticidade, que não substituem nós do DAG e não possuem gerador legado a selecionar.

Assim, qualquer nova porta continua quebrando o fiscal.

## 9. Reconciliação do cânone JD5

`DOJO_SAGA.md` v1.4 ainda descrevia JD5 como soma mental (“mostra 3, esconde, chegaram mais 2”) e mãe `N1.08`.

Isso contradizia as fichas F0 e a P17, nas quais JD5 é:

- mãe `N1.10`;
- parte-todo;
- vê o total, uma parte é escondida e a criança infere a parte oculta.

O cânone vivo foi retificado para **DOJO_SAGA v1.5** no commit:

`3ec25a4007c0e79b89bafcb7887bf270000ca545`

A ideia antiga de soma mental não foi apagada da história; ela apenas perdeu o id JD5 e só pode voltar com destino curricular próprio.

## 10. UI real do Garden

`DojoTab.tsx` agora consome diretamente `JARDIM`.

A aba mostra somente as quatro trilhas implementadas:

- Olhômetro Relâmpago;
- Mão Relâmpago;
- Moldura Relâmpago;
- Ver e Imaginar.

Mudanças:

- estrelas não controlam unlock;
- não existe seletor manual de nível para JD;
- clique inicia `currentStep` decidido pelo motor;
- cartão mostra treino atual × melhor conquista;
- `✨ Reflexo` pode coexistir com treino temporariamente recuado;
- estatísticas do Jardim vêm de `dojoTracks`, não do `progress` da Jornada;
- Sensei permanece uma frente separada.

O caminho CRA antigo e suas props/imports mortos foram removidos no commit:

`37a03a8bbf9d33221b8a3c75c7f8b847fdffbf97`

## 11. QA visual e acessibilidade

Foram criadas cenas permanentes de sonda:

1. todas as trilhas bloqueadas;
2. JD1/JD2 abertas;
3. progresso avançado com reflexos.

A primeira sonda falhou corretamente por contraste insuficiente em:

- aba inativa;
- texto de bloqueio;
- “Melhor: x/5”;
- rótulos de estatísticas.

O componente foi corrigido; o fiscal não foi relaxado.

Depois disso a sonda passou em **320, 390 e 900 px** e os PNGs foram inspecionados manualmente.

Commit de QA visual permanente:

`21ab21e6c4d7465f66a37136dc15b68970c1f795`

A informação pedagógica/operacional foi aprovada. O shell visual atual continua **não sendo a direção artística premium final do SAGA**.

## 12. Testes permanentes

`DojoTab.test.tsx` trava contra regressões como:

- voltar a listar a Jornada genérica no Garden;
- estrelas abrirem JD;
- save `unlocked` furar a mãe;
- perda de unlock após regressão de `lvl` já conquistado;
- retorno do seletor manual de nível;
- estatísticas contaminadas por `state.progress`;
- “mastered” forçar o treino a permanecer no topo.

O motor e o adapter possuem testes próprios.

## 13. O que P8 não fez

- não criou JD4;
- não colocou JD no grafo;
- não mexeu em GM.12;
- não transformou lentidão em erro conceitual;
- não reescreveu o Sensei/FD/PD completo;
- não declarou a UI atual como arte final.

## 14. Invariantes que ficam

1. **Compreensão e automaticidade têm estados e motores diferentes.**
2. **Treino derivado não vira nó curricular por conveniência.**
3. **Unlock do treino deriva da competência-mãe, não de estrelas nem de cache.**
4. **Tempo mede automaticidade; não redefine acerto conceitual.**
5. **Retry pedagógico não pode inflar a primeira resposta usada para medir fluência.**
6. **Erro de treino pertence ao Radar da competência que lhe dá significado.**
7. **UI do Garden deve consumir o catálogo JD canônico, não redescobrir trilhas por heurística.**
8. **Uma porta especial do Composer precisa ser explícita e fiscalizada.**
9. **Sonda verde não equivale a direção visual final aprovada.**

**O Jardim não é um segundo currículo: é a camada de treino que transforma uma compreensão já instalada em reflexo.**
