# Checkpoint — Seleção causal da W6

**Data:** 11/08/2026  
**Status:** W6 SELECIONADA · IMPLEMENTAÇÃO NÃO INICIADA  
**Alvo:** `N2.03 / F29 — Maior, Menor, Igual`  
**Branch:** `codex/integrar-bloco-f0`  
**Escopo deste commit:** decisão e handoff; **nenhuma alteração de runtime/currículo executável**.

> Este checkpoint é posterior ao fechamento da reconciliação pós-W5/pré-W6. Ele tem precedência **somente** sobre frases anteriores que dizem “W6 não selecionada”. Todo o restante de `RETOMADA.md`, `BRIEFING_CODEX.md`, `HANDOFF_CONTINUIDADE_IA.md`, checkpoint W5, retificação F61 e checkpoint da reconciliação continua vigente.
>
> GitHub remoto, PR #29, CI do HEAD e fontes executáveis vencem este texto se houver deriva.

## 1. Âncora usada para selecionar

A seleção só foi feita depois de o corpo do PR #29 registrar o recibo canônico da reconciliação:

- HEAD de base da decisão: `12981f0042d658f5cd6004189de7d8aee5eaaaf7`;
- PR #29: `open + draft + unmerged`;
- main protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- CI #1073 / run `31497310509`: **6/6 jobs verdes**;
- suíte: **172 arquivos / 2.516 testes**;
- Matrix: **30 Composer / 22 legado / 38 fallback / 52 servidas / 17 divergências / 12 swaps / 44 estreias**;
- único blocker de primitive: `Moedas`;
- Sensei/F19/F61 verdes;
- transversal `390px × 8 sementes` verde;
- transversal `320/900px × 1 semente` verde;
- review threads abertas: `0`.

A seleção não altera esse snapshot histórico; o próximo CI deve apenas provar que este commit documental não quebrou mecanismos.

## 2. Método — sem score mágico

Não foi criado um peso numérico arbitrário. Os candidatos foram comparados por Pareto usando os fatores já vigentes:

1. **descendentes / alavancagem causal no DAG**;
2. estado `legado`/`fallback`;
3. divergência ficha ↔ tela real;
4. blocker de primitive;
5. onboarding/troca de linguagem visual;
6. motor/a11y e risco pedagógico;
7. reuso de primitive;
8. custo/evidência para implementar com regression-first.

`downstream` fica explícito, mas não é soberano. Da mesma forma, “último blocker” não vira atalho automático.

## 3. Descendentes dos 22 legados

Contagem transitiva derivada do DAG vigente (`curriculum/grafo_saga.yaml`), sem incluir o próprio nó:

| ordem | competência | descendentes |
|---:|---|---:|
| 1 | `N2.02` | **45** |
| 2 | `N3.01` | **44** |
| 3 | `N2.03` | **38** |
| 4 | `N3.03` | **36** |
| 5 | `AL.03` | **34** |
| 6 | `N3.02` | **33** |
| 7 | `N4.01` | **31** |
| 8 | `N3.07` | 24 |
| 9 | `N4.05` | 23 |
| 10 | `N3.11` | 18 |
| 11 | `N3.04` | 17 |
| 12 | `N2.04` | 13 |
| 13 | `N3.08` | 10 |
| 14 | `N3.12` | 9 |
| 15 | `N4.02` | 5 |
| 16 | `N3.05` | 4 |
| 17 | `PE.01` | 3 |
| 18 | `N3.13` | 2 |
| 19 | `GM.04` | 1 |
| 20 | `N3.06` | 0 |
| 21 | `GM.03` | 0 |
| 22 | `N2.05` | 0 |

A contagem explica por que `GM.03/Moedas` não pode ser escolhida só por ser o último blocker: ela tem valor arquitetural real, mas **zero descendentes** no DAG atual.

## 4. Shortlist reconciliada

| candidato | downstream | divergência atual | primitive/custo estrutural | leitura |
|---|---:|---|---|---|
| `N2.02 / F36` | **45** | não | `Quadrado100` é componente isolado; aparece em 10 fichas | maior downstream e grande reuso potencial, mas exige integrar uma primitive ainda fora do builder/renderer do Composer; mudança estrutural maior e a tela legada hoje já é classificada como conforme |
| `N3.01 / F13` | **44** | não | `VisualAddition` tem renderer, sem builder; 1 ficha | quase máximo downstream, mas precisa inaugurar builder e a tela atual não está na lista das 17 divergências |
| `N2.03 / F29` | **38** | **sim** | `Grupo` já é executável | combina downstream muito alto, dívida legado, defeito visível real e caminho de implementação com primitive já governada |
| `N3.03 / F14` | **36** | **sim** | `LinkingCubes` renderer-sem-builder + `NumberLine` | alto impacto, mas carrega primitive incompleta e composição mais complexa |
| `AL.03 / F30` | **34** | **sim** | `InteractiveNumberLine` + `Quadrado100` isolado | alto impacto, porém depende da integração estrutural do Quadrado100 |
| `N3.02 / F15` | **33** | **sim + mode swap** | `EmojiRow` já executável; modo `riscar` | candidato forte e barato; a troca de linguagem visual é séria, mas downstream menor que N2.03 e fica excelente contrafactual para a próxima onda |
| `N4.01 / F97` | **31** | **sim** | `Grupo` já executável | bom custo/benefício, mas mais abaixo na cadeia que N2.03 |
| `GM.03 / F53+F54` | **0** | **sim + blocker** | `Moedas` renderer-sem-builder; 2 fichas | fecha o último blocker e merece frente próxima, mas baixa alavancagem causal nesta rodada |

## 5. Decisão — W6 = `N2.03 / F29`

### Por que vence

`N2.03` está no melhor ponto de compromisso entre impacto e risco:

- é **#3 entre todos os 22 legados em descendência**, com **38 descendentes**;
- é uma das **17 divergências ficha ↔ tela**: F29 pede `Grupo ×2 + símbolo`, mas o runtime atual entrega apenas pergunta/alternativas;
- sua ficha autoral está completa e o conceito é claro: **comparar quantidades primeiro; símbolo depois**;
- a primitive `Grupo` já é **executável** no mapa runtime, portanto a onda não precisa criar/regularizar `Quadrado100`, `VisualAddition`, `LinkingCubes` ou `Moedas` para começar;
- corrige experiência real da criança, não apenas proveniência arquitetural;
- remove simultaneamente uma dívida `legado` e uma divergência, sem introduzir uma linguagem visual inédita desnecessária;
- é upstream de uma parte ampla da estrutura aditiva/multiplicativa, então melhorar sua fidelidade reduz risco conceitual propagado.

### Efeito esperado após ativação, se e somente se a Matrix observar

Não editar a Matrix à mão. O efeito esperado é:

- Composer: `30 → 31`;
- legado: `22 → 21`;
- fallback: `38`;
- servidas: `52`;
- divergências: `17 → 16`;
- swaps: sem mudança esperada;
- estreias: sem mudança esperada;
- blocker `Moedas`: continua aberto.

Esses números são **hipótese de ledger**, não fato, até a implementação ser ativada e a Coverage Matrix derivada confirmar.

## 6. Contrafactuais preservados

### Por que não `N2.02` agora

Tem 45 descendentes e merece prioridade alta, mas a migração Composer exige resolver `Quadrado100` como componente isolado/builder e a tela legada não aparece entre as 17 divergências atuais. É uma frente com ganho arquitetural/reuso enorme, porém maior raio de mudança. Não misturar a integração do `Quadrado100` com a primeira onda pós-reconciliação sem necessidade.

### Por que não `N3.01` agora

Tem 44 descendentes, mas `VisualAddition` ainda é renderer-sem-builder e a tela legada atual não aparece como divergente. É ótima candidata depois de criar uma estratégia explícita para builders faltantes.

### Por que não `N3.02` agora

É divergência + `mode swap` perigoso e usa primitive existente. Fica como candidato de altíssimo valor para a onda seguinte. `N2.03` vence por cinco descendentes adicionais e por hoje entregar **nenhuma** representação da ficha, não apenas o modo visual errado.

### Por que não `GM.03/Moedas` agora

Fechar o último blocker é valioso, mas o nó tem zero descendentes. `Moedas` deve permanecer prioridade arquitetural explícita — potencialmente uma frente de primitive — sem sequestrar a ordem causal da fábrica.

## 7. Contrato pedagógico mínimo da W6

Fonte: F29 — **Maior, Menor, Igual**.

Invariantes que a implementação não pode simplificar para “um quiz de > < =”:

1. a criança **compara antes de simbolizar**;
2. L1: dois grupos de objetos + jacaré/ponte semântica;
3. L2: grupo vs numeral;
4. L3: dois numerais até 20;
5. L4: numerais até 100, só símbolo;
6. L5: comparar expressões — calcular antes de comparar;
7. `>`, `<` e `=` precisam manter a orientação semanticamente correta;
8. erro invertido deve gerar `INVERTE_SIMBOLO`, não ruído motor;
9. acerto com objetos e erro com numerais deve poder evidenciar `NAO_COMPARA_SIMBOLO`;
10. domínio exige evidência no nível 3 ou superior;
11. filtro motor, relógio silencioso, Radar probabilístico, divulgação/casca visual e demais adendos normativos continuam vigentes.

A metáfora do jacaré é um andaime semântico da ficha. Não torná-la dependência cultural rígida da casca: a casca pode variar, mas a passagem **quantidade → relação → símbolo** deve sobreviver.

## 8. Próxima conversa — ponto exato de entrada

**Não começar por código.** Reancorar primeiro:

1. abrir PR #29;
2. confirmar `open + draft + unmerged`;
3. confirmar branch `codex/integrar-bloco-f0` e HEAD remoto;
4. conferir CI do HEAD e todos os jobs;
5. conferir review threads;
6. ler este checkpoint + `RETOMADA.md` + checkpoint da reconciliação + F29.

Se o remoto ainda concordar, iniciar W6 por:

`regression-first N2.03 → ficha TS/contract/procedure/stage usando Grupo existente → registro INATIVO → suíte + Chrome real/sonda transversal dirigida → canário → Matrix observa → ledger → checkpoint`.

Antes da implementação, escrever testes que provem pelo menos:

- progressão L1→L5 e transição quantidade→símbolo;
- orientação correta de `>`/`<`/`=`;
- igualdade real;
- L5 compara valores de expressões, não strings;
- nenhuma resposta correta é revelada visualmente antes da ação;
- diagnóstico `INVERTE_SIMBOLO` e `NAO_COMPARA_SIMBOLO` quando aplicável;
- tap/área motora/acessibilidade;
- fallback/rollback permanecem íntegros enquanto o canário está inativo;
- Matrix só muda após ativação real.

## 9. Proibições durante a W6

- não tocar main;
- não criar branch auxiliar;
- não tocar Creature Engine;
- não ativar Thinking Engine;
- não aproveitar a onda para resolver bundle, Foundry archive, mascotes ou `Moedas`;
- não introduzir `Quadrado100`/`VisualAddition`/`LinkingCubes` só porque aparecem nos contrafactuais;
- não alterar pré-requisitos para fazer a escolha parecer melhor;
- não editar snapshots históricos da Matrix;
- não considerar “teste verde” suficiente sem tela/experiência e Matrix do mesmo HEAD.

## 10. Regra de parada

Este checkpoint encerra **seleção**, não implementação.

O estado correto ao fim desta conversa é:

- W5 fechada;
- reconciliação pós-W5/pré-W6 fechada;
- **W6 = N2.03 / F29 selecionada**;
- W6 runtime **não iniciado**;
- PR continua draft/unmerged;
- próxima conversa pode começar diretamente pela regressão da F29 depois da reancoragem obrigatória.
