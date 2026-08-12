# Estado do Fechamento Curricular — SAGA

**Data de abertura desta linha:** 11/08/2026  
**Última atualização:** 12/08/2026 — fechamento final da W8 / abertura regression-first da W9  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — draft  
**Fonte de verdade:** GitHub remoto + gates executáveis. Este arquivo é um checkpoint de retomada, não substitui evidência remota.

## Estado operacional

HEAD comprovado antes deste checkpoint: `46dd06d40bec980e25ec87a3581e9e95f2710d02`; o próprio checkpoint/regression-first cria o SHA seguinte.  
CI comprovado desse HEAD: #1163 / run `31590118288` — **success em 6/6 jobs**, incluindo Gates, Sensei real, 320/900 e transversal `390px × 8 sementes`.  
Bloco 0 — **CONCLUÍDO**.  
Bloco 1 — **EM EXECUÇÃO**. W7 e W8 fechadas; W9 selecionada e iniciada por regression-first.  
Matrix após W8: `33 Composer / 19 legado / 38 fallback / 52 servidas / 16 divergências / 12 swaps / 44 estreias`.  
Ondas fechadas nesta linha: W7 `N2.02/F36`; W8 `N3.01/F13`.  
Próxima sequência autorizada: W9 `N3.02/F15` → W10 `N3.03/F14` → W11 `AL.03/F30` → W12 `N4.01/F97`, sem consulta intermediária salvo condição de parada.

## Recibo do Bloco 0

1. PR #29 foi reancorado no remoto ainda `open + draft + unmerged`, com head exato `5d3daa1b5735be725319e0d463af13f0f5d17fce`.
2. CI #1085 / run `31548303226` do head tinha `success` em 6/6 jobs, incluindo transversal `390px × 8 sementes`.
3. Review threads abertas: `0`; reviews submetidas: `0`.
4. W6 `N2.03 / F29` estava fechada e o checkpoint de retificação pós-auditoria estava presente. A retificação observada no código preservava L2 até 10, L5 com parcela compartilhada e posição da parcela compartilhada sorteada, RT silencioso de 8 s e nenhum delta de Matrix.
5. `main` permanecia em `68fad4c575e28959b2ca4776e9a541d6828b63f3`; a branch estava `964` commits à frente e `0` atrás.
6. `firestore.rules` tinha o mesmo blob SHA `fab313c11e0d3f1a55aa568818625e372bf40fa9` em `main` e na branch. O único workflow de publicação é `deploy-rules.yml`, condicionado a push em `main` com mudança em `firestore.rules` ou no próprio workflow. O merge não alterou esses arquivos.
7. O autor autorizou expressamente o portão humano do Bloco 0 nesta retomada e os documentos de Claude Code de 11/08/2026 mandavam, sob essas precondições, merge por **merge commit**, sem squash.
8. PR #29 foi retirado de draft e mesclado com `expected_head_sha=5d3daa1b...`. Merge commit: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.
9. A branch histórica `codex/integrar-bloco-f0` foi preservada.
10. `codex/fechamento-curricular` foi criada exatamente de `106dfe0d...`.
11. O novo PR não pôde ser aberto enquanto a branch era idêntica à `main`; não foi criado commit vazio artificial.
12. O primeiro CI pós-merge em `main` (#1086) expôs flake em `reta20Boundary.test.tsx`: F19 nível 3 podia sortear `1 → 0`, deixando o helper do teste sem vizinho ±1 distinto da origem. A causa era fixture aleatória do gate, não runtime nem expectativa pedagógica.
13. O reparo foi feito apenas na nova branch em `102699fb`: a fixture do teste foi tornada determinística com `Math.random = 0.5` via spy local; runtime e contrato F19 ficaram intocados.
14. A reexecução do mesmo SHA da `main` passou no Gates, confirmando a natureza amostral do defeito. O reparo determinístico permanece na linha nova para remover a recorrência.
15. Com o primeiro diff real, o PR #35 foi aberto em draft para `main`.

## W7 — N2.02 / F36 — FECHADA

- `Quadrado100` ganhou owner executável por specialized builder local e `Quadrado100Stage`, sem criar dispatch genérico morto.
- A estreia visual recebeu onboarding explícito e a ficha preservou +1 horizontal, +10 vertical, +5, vizinhos e lacunas, com evidência de percurso vertical.
- O legado saiu de produção somente após suíte completa, Chrome 320/390/900 e transversal 390×8 verdes.
- Recibo final: HEAD `88fbeb40…`, CI #1129 **6/6 verde**.
- Delta observado e registrado no ledger: `{ composer: +1, legacy: -1 }`.
- Matrix pós-W7: `32 / 20 / 38 / 52 / 16`.

## W8 — N3.01 / F13 — FECHADA

- `VisualAddition` foi mantida como superfície compartilhada; F13 ganhou specialized builder e `VisualAdditionStage` próprios. Não houve promoção mecânica do renderer legado.
- Escada autoral comprovada: objetos+numerais → numerais nos contêineres no L4 → símbolo puro no L5; L4 emite evidência `adicao-sem-objetos`; L5 usa relógio silencioso de 5 s.
- O onboarding da estreia foi validado em Chrome real. Uma duplicação visual da equação em L5 foi descoberta por screenshot e corrigida antes da promoção.
- A cadeia inativa passou 6/6. Depois da promoção, o gate genérico detectou que `visual-addition-f13` possuía teclado autoral mas não estava declarado em `PALCOS_QUE_RESPONDEM`, permitindo uma segunda superfície genérica de resposta. Foi corrigida a **fonte**, adicionando o kind autoral ao boundary, sem afrouxar o teste.
- O teste regression-first da W8 foi então convertido em contrato pós-promoção, pois a expectativa de canário inativo havia cumprido sua função e se tornara historicamente obsoleta.
- Recibo final: HEAD `46dd06d40bec980e25ec87a3581e9e95f2710d02`, CI #1163 / run `31590118288` — **6/6 verde**.
- Delta observado e registrado no ledger: `{ composer: +1, legacy: -1 }`.
- Matrix pós-W8: `33 Composer / 19 legado / 38 fallback / 52 servidas / 16 divergências / 12 swaps / 44 estreias`.

## W9 — N3.02 / F15 — SELEÇÃO E PRECEDENTE

- Seleção causal confirmada: `N3.02` depende diretamente de `N3.01`; W8 precisa estar fechada antes da promoção de W9.
- F15 exige `EmojiRow#riscar`, enquanto o legado `subvis` apresenta a leitura pronta em vez de fazer a criança executar o ato de tirar.
- Esta é a primeira **troca de modo visual** tratada como precedente: o gate de estreia de ferramenta não basta, porque um `tutorial` genérico pode existir sem ensinar o significado novo do X.
- Regra dura desta onda: o primeiro degrau do modo `riscar` precisa ensinar que **X = saiu / foi removido**, mantendo o item marcado no mesmo lugar, **antes** de existir cobrança de conteúdo ou superfície de resposta.
- O acerto corrigido depois de `RESPONDE_O_REMOVIDO` continua sendo tentativa real e continua alimentando feedback/Radar, mas não pode comprar a sequência 3/3 de domínio da ficha.
- Implementação prevista: `EmojiRow` estendido de forma retrocompatível + `EmojiRowRiscarStage` autoral + specialized builder local + runtime kind próprio. N3.02 permanece fora do canário durante todo o portão inativo.
- O regression-first desta atualização deve ficar vermelho apenas porque ficha/owner especializado ainda não existem; nenhuma expectativa funcional será relaxada para torná-lo verde.

## Ordem causal restante do Bloco 1

- W10 `N3.03/F14` — `LinkingCubes + NumberLine`; deve declarar builder e owner de `LinkingCubes`.
- W11 `AL.03/F30` — `InteractiveNumberLine + Quadrado100`; herda a infraestrutura comprovada na W7. Neste mesmo escopo, reconciliar os falsos negativos de observabilidade de `Quadrado100` já renderizado em N4.03/N4.07, se a prova runtime confirmar no HEAD da onda.
- W12 `N4.01/F97` — `Grupo ×N`; só pode fechar depois de N3.03 + AL.03 porque ambos são pré-requisitos diretos no DAG.

## Critério de saída do Bloco 1

- 6 nós do bloco em Padrão Ouro;
- legados ≤ 15;
- divergências ≤ 10;
- `Quadrado100`, `VisualAddition` e `LinkingCubes` com builder e owner declarados;
- nenhuma promoção sem portão inativo + Chrome real + CI do mesmo SHA;
- snapshots históricos permanecem imutáveis; somente o ledger registra deltas observados.

## Decisões autônomas

- **Merge do Bloco 0 executado** sob autorização humana, por merge commit e `expected_head_sha`.
- **Nenhum patch direto na `main`**; toda correção desta linha vive em `codex/fechamento-curricular`.
- **Flake tratado como defeito da fixture**, sem mudar runtime ou expectativa pedagógica.
- **W8 corrigiu a fonte, não a expectativa:** a duplicidade de superfície de resposta foi eliminada no boundary de autoria.
- **Modo visual ≠ ferramenta nova:** W9 cria um gate de alfabetização de modo em vez de reutilizar silenciosamente o onboarding genérico.
- **Creature Engine e Thinking Engine runtime continuam fora do escopo.**

## Discordâncias / correções ao plano externo

1. `PLANO_ATE_O_FIM.md` agrupava `ShapeCanvas` entre primitivas "renderer sem builder". O remoto contradiz essa classificação: `ShapeCanvas` já possui builder/renderer executável e atende F47/GE.01 e F48/GE.02. No Bloco 2, as seis competências GE pendentes são conteúdo/contrato, não criação de primitiva.
2. Os renderer-sem-builder reais antes destas ondas eram `VisualAddition`, `LinkingCubes`, `SingaporeBars` e `Moedas`; W8 resolveu `VisualAddition` por owner especializado local.
3. Em CI de `push` para `main`, não declarar 6/6 quando os jobs condicionados a PR são `skipped`. Em PR, o recibo 6/6 exige efetivamente os seis jobs concluídos em `success`.

## Condições de parada

Só escalar ao autor antes do fechamento do Bloco 1 se ocorrer uma destas condições:

1. rejeição humana de versão visual;
2. necessidade real de afrouxar um gate;
3. condição de invalidação do plano;
4. decisão que altere arquitetura ou pré-requisitos.

Fora disso, decidir localmente, registrar aqui, provar no remoto e seguir a próxima onda.
