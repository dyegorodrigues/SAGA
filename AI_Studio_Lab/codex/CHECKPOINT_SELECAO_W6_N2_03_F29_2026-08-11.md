# Checkpoint — Seleção causal da W6

**Data:** 11/08/2026  
**Status:** W6 SELECIONADA · IMPLEMENTAÇÃO NÃO INICIADA  
**Alvo:** `N2.03 / F29 — Maior, Menor, Igual`  
**Branch:** `codex/integrar-bloco-f0`  
**Escopo:** decisão e handoff; **nenhuma alteração de runtime/currículo executável**.

> Este checkpoint é posterior ao fechamento da reconciliação pós-W5/pré-W6. Ele tem precedência **somente** sobre frases anteriores que dizem “W6 não selecionada”. Todo o restante de `RETOMADA.md`, `BRIEFING_CODEX.md`, `HANDOFF_CONTINUIDADE_IA.md`, checkpoint W5, retificação F61 e checkpoint da reconciliação continua vigente.
>
> GitHub remoto, PR #29, CI do HEAD e fontes executáveis vencem este texto se houver deriva.

## 0. Errata interna incorporada antes do fechamento

A primeira versão deste checkpoint classificou `Grupo` de forma imprecisa como “primitive já executável para F29”. A revisão adversarial feita **antes de encerrar a rodada** mostrou que isso misturava dois universos:

- `Grupo.tsx` existe e é um componente-base funcional (`items`, clique, seleção e referências geométricas);
- porém `AI_Studio_Lab/tools/ficha_runtime_map.cjs` prova que **não existe hoje builder/renderer genérico de `Grupo` ligado ao Composer**;
- o único caminho runtime classificado como executável para a primitive autoral `Grupo` é a substituição deliberada `grandeza/GrandezaStage` da F49/GM.01;
- portanto F29 **não pode** simplesmente “usar o Grupo já governado” sem nova integração.

A decisão W6 foi recalculada com essa correção. Ela **permanece N2.03**, mas o custo correto é: **builder/Stage especializado F29 composto a partir do componente-base `Grupo`**, ou outra solução igualmente estreita e provada. Não declarar um `groups` genérico só para fazer a Matrix ficar verde sem antes reconciliar as demais fichas que nomeiam `Grupo`.

A mesma revisão eliminou outro falso atalho: `N3.02/F15` usa `EmojiRow#riscar`, mas a escada governada de `emojiRowProcedure.ts` contém hoje `plain → flash → flash-mao → padrao`; `riscar` é um **modo novo**, não uma configuração já pronta.

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

A seleção não altera esse snapshot histórico.

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

`downstream` fica explícito, mas não é soberano. “Último blocker” também não vira atalho automático.

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

| candidato | downstream | divergência atual | custo estrutural comprovado | leitura |
|---|---:|---|---|---|
| `N2.02 / F36` | **45** | não | `Quadrado100` é componente isolado, sem builder/renderer; aparece em 10 fichas | maior downstream e reuso potencial enorme, mas abre frente transversal de primitive e a tela legada hoje está conforme |
| `N3.01 / F13` | **44** | não | `VisualAddition` tem renderer, sem builder; 1 ficha | quase máximo downstream, mas requer integrar builder e não corrige uma das 17 divergências atuais |
| `N2.03 / F29` | **38** | **sim** | `Grupo.tsx` existe, mas sem dispatch genérico; requer Stage/builder especializado F29 ou integração equivalente estreita | combina downstream muito alto + legado + defeito visual real; a matéria-prima existe e a especialização pode ficar confinada a uma ficha |
| `N3.03 / F14` | **36** | **sim** | `LinkingCubes` renderer-sem-builder + `NumberLine` | alto impacto, porém composição mais larga e primitive incompleta |
| `AL.03 / F30` | **34** | **sim** | `InteractiveNumberLine` + `Quadrado100` isolado | alto impacto, mas herda a frente estrutural do Quadrado100 |
| `N3.02 / F15` | **33** | **sim + mode swap** | `EmojiRow` existe, porém o modo autoral `riscar` **não existe** na escada governada | corrigiria divergência séria, mas introduz nova linguagem visual dentro de primitive compartilhada; exige onboarding e regressões de escada |
| `N4.01 / F97` | **31** | **sim** | também nomeia `Grupo`; não pode assumir dispatch genérico já existente | bom impacto, mas mais abaixo na cadeia e compartilha a mesma necessidade de reconciliação de `Grupo` |
| `N3.07 / F33` | **24** | não | `TenFrame` já possui builder/renderer | tecnicamente mais barato e causalmente relevante, porém corrige só legado/proveniência, não uma divergência visível atual |
| `N3.04 / F31` | **17** | **sim** | `InteractiveNumberLine` já possui builder/renderer | alternativa de menor risco técnico, mas com menos da metade do downstream de N2.03 |
| `GM.03 / F53+F54` | **0** | **sim + blocker** | `Moedas` renderer-sem-builder; 2 fichas | fecha o último blocker, mas baixa alavancagem causal nesta rodada |

## 5. Decisão — W6 = `N2.03 / F29`

### Por que continua vencendo depois da errata

`N2.03` permanece no melhor ponto de compromisso entre impacto, defeito real e raio controlável:

- é **#3 entre todos os 22 legados em descendência**, com **38 descendentes**;
- é uma das **17 divergências ficha ↔ tela**: F29 pede a sequência quantidade→comparação→símbolo; o legado entrega L1–L2 como comparação de dois **numerais por opções**, e só depois usa `> < =`;
- F29 está autorada de ponta a ponta e deixa a pedagogia testável;
- `Grupo.tsx` já fornece a matéria-prima visual/interativa; a lacuna é de **integração**, não de inventar uma primitive do zero;
- um Stage/builder especializado F29 pode ser isolado, como já ocorre legitimamente com outras fichas, sem prometer genericidade para as demais fichas `Grupo`;
- corrige experiência real da criança e remove simultaneamente uma dívida `legado` e uma divergência;
- evita, nesta onda, as frentes mais transversais `Quadrado100`, `Moedas` e a escada compartilhada `EmojiRow#riscar`;
- mantém `N3.04` como fallback de baixo risco caso regression-first prove que a especialização F29 exige raio maior do que o previsto.

### Condição de invalidação da escolha

A seleção **não é dogma**. Antes de implementar, regression-first deve provar que F29 consegue ser materializada com um contrato especializado e escopo local. Se para fazê-la corretamente for necessário:

- criar um `groups` genérico que mude múltiplas fichas;
- alterar o contrato público de `Grupo` de forma incompatível com F49;
- introduzir nova regra global de renderer;
- ou tocar pré-requisitos/learner state para acomodar a UI,

**parar e reabrir a seleção**. Nesse caso, `N3.04/F31` é o contrafactual técnico mais conservador e a Matrix+DAG deve ser novamente registrada antes de trocar a W6.

### Efeito esperado após ativação, se e somente se a Matrix observar

Não editar a Matrix à mão. Hipótese de ledger:

- Composer: `30 → 31`;
- legado: `22 → 21`;
- fallback: `38`;
- servidas: `52`;
- divergências: `17 → 16`;
- swaps: sem mudança esperada;
- estreias: **recalcular**, não assumir; um Stage especializado pode ou não contar como nova linguagem dependendo da gramática visual efetivamente introduzida;
- blocker `Moedas`: continua aberto.

Esses números não são fato até a implementação ser ativada e a Coverage Matrix derivada confirmar.

## 6. Contrafactuais preservados

### `N2.02`

45 descendentes. Prioridade estrutural altíssima, mas `Quadrado100` está isolado e aparece em 10 fichas. Integrá-lo merece desenho transversal próprio, não carona na primeira onda pós-reconciliação.

### `N3.01`

44 descendentes. `VisualAddition` possui renderer, sem builder. É excelente candidata, mas a tela legada não está na lista das divergências atuais; N2.03 corrige arquitetura **e** experiência observada.

### `N3.02`

33 descendentes + divergência + mode swap. A revisão mostrou que `riscar` não é modo existente da escada `EmojiRow`; introduzi-lo exige decisão/onboarding/regressão de uma primitive compartilhada. Não é o atalho barato que parecia pelo inventário resumido.

### `N3.04`

17 descendentes + divergência e `InteractiveNumberLine` já governada. É o melhor **fallback técnico** se a especialização F29 extrapolar o raio local previsto.

### `GM.03/Moedas`

Último blocker, duas fichas, zero descendentes. Deve continuar prioridade arquitetural explícita, possivelmente numa frente de primitive, sem sequestrar a ordem causal da fábrica.

## 7. Contrato pedagógico mínimo da W6

Fonte: F29 — **Maior, Menor, Igual**.

Invariantes que a implementação não pode simplificar para “um quiz de > < =”:

1. a criança **compara antes de simbolizar**;
2. L1: dois grupos de objetos + ponte semântica do jacaré;
3. L2: grupo vs numeral;
4. L3: dois numerais até 20;
5. L4: numerais até 100, só símbolo;
6. L5: comparar expressões — calcular antes de comparar;
7. `>`, `<` e `=` mantêm orientação semanticamente correta;
8. igualdade precisa aparecer de verdade, não como opção decorativa;
9. erro invertido deve poder gerar `INVERTE_SIMBOLO`, sem confundir ruído motor;
10. acerto com objetos e erro com numerais deve poder evidenciar `NAO_COMPARA_SIMBOLO`;
11. domínio exige evidência no nível 3 ou superior;
12. filtro motor, relógio silencioso, Radar probabilístico, casca visual e demais adendos normativos continuam vigentes.

A metáfora do jacaré é andaime semântico, não dependência cultural rígida da casca. A relação **quantidade → relação → símbolo** é o invariante.

## 8. Estratégia arquitetural preferida para iniciar W6

Não começar criando um `groups` genérico.

Preferência inicial, a ser validada por testes:

1. ficha TS F29 com contrato explícito;
2. `comparacaoSimbolicaContract/Procedure` ou nomenclatura equivalente;
3. Stage especializado F29 que **compõe** dois `Grupo` nos níveis concretos e faz fading até símbolo puro;
4. kind especializado apenas se necessário, com renderer explícito;
5. builder especializado registrado no canário para `N2.03`;
6. registro **inativo** primeiro;
7. nenhuma alteração em F49/GM.01 nem nas outras fichas que nomeiam `Grupo` sem evidência própria.

Se a implementação revelar uma abstração genérica legítima compartilhável, documentar primeiro os contratos das fichas afetadas; não generalizar retrospectivamente por conveniência de código.

## 9. Próxima conversa — ponto exato de entrada

**Não começar por código.** Reancorar primeiro:

1. abrir PR #29;
2. confirmar `open + draft + unmerged`;
3. confirmar branch `codex/integrar-bloco-f0` e HEAD remoto;
4. conferir CI do HEAD e todos os jobs;
5. conferir review threads;
6. ler este checkpoint + `RETOMADA.md` + checkpoint da reconciliação + F29 + `ficha_runtime_map.cjs` + `Grupo.tsx`.

Se o remoto ainda concordar, iniciar W6 por:

`regression-first N2.03 → contrato/procedure/Stage especializado e local → ficha TS → registro INATIVO → suíte + Chrome real/sonda dirigida → canário → Matrix observa → ledger → checkpoint`.

Antes da implementação, escrever testes que provem pelo menos:

- paridade/rollback do legado enquanto canário inativo;
- progressão L1→L5 e transição quantidade→símbolo;
- L1 realmente mostra duas quantidades comparáveis, não só dois numerais;
- L2 contém uma representação quantitativa e uma simbólica;
- orientação correta de `>`/`<`/`=`;
- igualdade real;
- L5 compara valores de expressões, não strings;
- resposta correta não é revelada antes da ação;
- diagnóstico `INVERTE_SIMBOLO` e `NAO_COMPARA_SIMBOLO` quando aplicável;
- área motora, teclado/leitor e acessibilidade;
- Stage especializado não altera F49 nem outras fichas `Grupo`;
- Matrix só muda após ativação real.

## 10. Proibições durante a W6

- não tocar main;
- não criar branch auxiliar;
- não tocar Creature Engine;
- não ativar Thinking Engine;
- não aproveitar a onda para resolver bundle, Foundry archive, mascotes ou `Moedas`;
- não introduzir `Quadrado100`/`VisualAddition`/`LinkingCubes` por carona;
- não criar `groups` genérico sem reconciliar consumers;
- não alterar pré-requisitos para fazer a escolha parecer melhor;
- não editar snapshots históricos da Matrix;
- não considerar “teste verde” suficiente sem tela/experiência e Matrix do mesmo HEAD.

## 11. Regra de parada

Este checkpoint encerra **seleção**, não implementação.

Estado correto ao fim desta conversa:

- W5 fechada;
- reconciliação pós-W5/pré-W6 fechada;
- **W6 = N2.03 / F29 selecionada com condição de invalidação explícita**;
- W6 runtime **não iniciado**;
- PR continua draft/unmerged;
- manutenção P2 fica fora da onda;
- próxima conversa começa pela regressão da F29 após reancoragem obrigatória.
