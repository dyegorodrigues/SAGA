# GATE B — LOTE 4 · Mega-auditoria de microprogressão N4

**Data:** 2026-08-19  
**Modo:** AUDIT-ONLY  
**Escopo curricular:** somente domínio `N4` (`N4.01`–`N4.12`)  
**Autoridade:** Issue #47 §0.2/§3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhum achado deste documento autoriza correção de código, runtime, Matrix, canário, DAG ou implementação de gates.

## 0. Âncora e método

A auditoria foi aberta a partir do HEAD remoto `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`, com PR #35 **open + draft + unmerged**, sem reviews/threads, e `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.

Antes da auditoria curricular, foi registrada na Issue #47 a proposta de governança pedida pelo usuário:

- comentário: `5342129190`;
- estado: **PROPOSTA**;
- conteúdo: `Gate B′` entre B e C para fechar primeiro candidatas via `CODIGO`, migrar `SIMULACAO` para Gate G e `CRIANCA` para Gate J, com a regra proposta de nenhuma candidata `CODIGO` aberta no início do Gate J;
- a §15 **não foi alterada**;
- Gates C–J **não foram iniciados**;
- nada foi implementado.

Foram revalidados no HEAD, conforme a autoridade específica de cada fonte:

- `curriculum/N4.yaml`;
- `src/curriculum/grafo_saga.ts` e `src/utils/grafoSaga.ts`;
- `src/curriculum/motores/curriculum.ts`, `composerCanary.ts`, `composerCanaryIds.ts` e `unlockEngine.ts`;
- fichas TS vivas N4.01, N4.02, N4.03, N4.04, N4.06, N4.07, N4.08, N4.09, N4.10, N4.11 e N4.12;
- `src/utils/generatorsF2.ts` para os legados servidos N4.02 e N4.05;
- fichas canônicas F42/F43/F44/F67/F68/F69/F70/F71/F96/F97/F98/F99 quando necessárias para reconciliar intenção e execução;
- `src/curriculum/Composer.ts`;
- contratos/procedimentos especializados de grupos iguais, tabuada, família ×÷, âncora, deslocamento, área, divisão longa, primos/divisores e divisão por dois dígitos;
- Issue #47 §0.2/§3, Issue #48 e os lotes N1–N3.

Documentos históricos foram usados apenas como contexto. Onde a execução viva divergiu de documento antigo, a execução venceu.

### 0.1 Disciplina de evidência

Achado individual curricular nasce:

- estado na Issue #48: `CANDIDATA`;
- classe §0.2: `HIPÓTESE-A-PROVAR`, salvo prova suficiente de outra classe;
- via `CODIGO`, `SIMULACAO` ou `CRIANCA` conforme a evidência mínima necessária para encerramento.

Padrões estruturais objetivamente revalidados são registrados separadamente como `ACHADO-DE-CLASSE`, para não multiplicar a mesma causa em um GAP por competência.

---

## 1. Resultado executivo

- competências N4 auditadas: **12/12**;
- proveniência: **10 Composer / 2 legado**;
- novos achados de classe: **2** — `CLASS-002` e `CLASS-003`;
- classe dos dois achados de classe: **`CONFIRMADO-ATUAL`**;
- via dos dois achados de classe: **`CODIGO`**;
- candidatas curriculares novas: **4** — `GAP-029` a `GAP-032`;
- classe das 4: **`HIPÓTESE-A-PROVAR`**;
- vias das candidatas: **3 CODIGO / 0 SIMULACAO / 1 CRIANCA**;
- correções executadas: **0**.

Proveniência observada:

- Composer ativo: `N4.01`, `N4.03`, `N4.04`, `N4.06`, `N4.07`, `N4.08`, `N4.09`, `N4.10`, `N4.11`, `N4.12`;
- legado servido: `N4.02`, `N4.05`.

O estado legado é resíduo global já `CONFIRMADO-ATUAL`; os déficits semânticos específicos abaixo continuam candidatas.

---

## 2. Achados de classe

### CLASS-002 — prereqs declarados nas fichas N4 divergem do DAG autoritativo

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

Quatro fichas Composer N4 declaram conjunto de `prereqs` estritamente menor que `src/curriculum/grafo_saga.ts` / `curriculum/N4.yaml`:

| Competência | ficha TS | DAG/YAML |
|---|---|---|
| N4.03 | `N4.01` | `N4.01 + AL.03` |
| N4.06 | `N4.03` | `N4.03 + N4.05` |
| N4.07 | `N4.04` | `N4.04 + N4.06` |
| N4.08 | `N4.07` | `N4.07 + N2.04 + N3.11` |

A divergência **não cria bypass de unlock no HEAD atual**: `unlockEngine.ts` consulta `GrafoSaga.nodes`, e `src/utils/grafoSaga.ts` deriva esse mapa de `src/curriculum/grafo_saga.ts`. Portanto o desbloqueio usa hoje o conjunto completo do DAG.

O achado é estrutural: há duas declarações vivas que divergem e podem enganar testes, documentação ou futuros consumidores. Encerramento via `CODIGO`: decidir/registrar autoridade única ou conformance explícita e provar que nenhum consumidor usa a declaração reduzida como regra autônoma. Nenhuma mudança foi feita neste lote.

### CLASS-003 — contratos especializados N4 com um único caso fixo por nível sob mastery repetida

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

Três contratos especializados ativos retornam **um único caso determinístico por nível**, enquanto a ficha exige múltiplos acertos por múltiplas sessões:

- `N4.10 / F69` — `divisaoLongaContract.ts`: casos fixos `24÷4`, `29÷4`, `84÷4`, `156÷3`, `612÷6` para L1–L5;
- `N4.11 / F70` — `primosDivisoresContract.ts`: um cenário fixo em cada modo/nível (múltiplos de 6, divisores de 18, relação 4↔12, primo 13, crivo fixo);
- `N4.12 / F71` — `divisaoDoisDigitosContract.ts`: casos fixos `840÷20`, `399÷19`, `736÷23`, `745÷23`, `2424÷24` para L1–L5.

As regras de mastery continuam sendo 3/3 ou 4/4 por 2–3 sessões conforme a ficha, mas a fonte especializada pode repetir exatamente o mesmo estímulo em toda a janela daquele nível.

`N4.01` foi explicitamente **refutado como membro desta classe**: `equalGroupsContract.ts` recebe `Math.random` e sorteia `grupos`/`porGrupo` dentro de limites por nível.

Encerramento via `CODIGO`: provar requisito mínimo de variedade por nível/mastery e substituir caso único por família de casos ou evidência de cobertura equivalente. Nenhuma correção foi feita.

---

## 3. Auditoria competência por competência

### N4.01 — Multiplicação como grupos iguais

- **Conceito/faixa:** multiplicação como número de grupos × quantidade por grupo; `F2`.
- **Pré-requisitos:** `N3.03 + AL.03`, coerentes ficha↔DAG.
- **CPA/representação:** soma repetida → ponte soma/multiplicação → notação multiplicativa; o contrato especializado altera representação conforme o nível.
- **L1–L5:** limites crescem e o apoio simbólico muda de soma repetida para multiplicação; L3+ exige evidência de notação multiplicativa.
- **Diversidade:** `equalGroupsContract.ts` sorteia grupos e itens por grupo dentro de faixas por nível; não é caso fixo.
- **Transferência:** sustenta N4.02, N4.03, N4.05.
- **Misconceptions:** soma fatores, conta um grupo, perde um grupo.
- **Mastery:** 3/3 ×2; RT separado.
- **Motor/onboarding/resolução:** representação é observável sem precisão fina como requisito conceitual; resolução reconstrói grupos e operação.
- **Dojo/Jardim:** sem conflito N4-específico observado.
- **Resultado:** nenhuma CANDIDATA nova.

### N4.02 — Arranjos retangulares e comutatividade

- **Conceito/faixa:** array como multiplicação e rotação como prova visual da comutatividade; `F2`.
- **Pré-requisito:** N4.01.
- **Proveniência:** há ficha TS autoral N4.02, mas o nó não está ativo no canário; produção serve o legado `gN4_02`.
- **Ficha TS/cânone:** L1 contar → L2 ligar arranjo à multiplicação → L3 **girar obrigatoriamente** → L4 expressão → L5 ponte para área; a micro `giro` declara `allow_rotate:true` e `require_rotate:true`.
- **Runtime legado:** L1 conta; **L2–L5 compartilham a mesma tarefa** “qual conta mostra o total?”, com `nlEnd:1` como hack para exibir botão de giro. A resposta correta permanece a expressão da orientação inicial; girar não é necessário para acertar.
- **Mastery/transferência:** a execução servida não prova que a criança reconheceu `a×b = b×a` nem a ponte para área.
- **Resultado:** **GAP-029**.

### N4.03 — Tabuadas 2, 5 e 10

- **Conceito/faixa:** padrões de ×10, ×5 e ×2 antes de memorização; `F2`.
- **Pré-requisitos:** ficha declara N4.01; DAG também exige AL.03 — divergência capturada uma única vez em `CLASS-002`.
- **L1–L5:** ×10 → ×5 → ×2 → mistura → fluência sem apoio.
- **Diversidade:** Composer enumera combinações válidas e sorteia entre elas; não repete caso fixo.
- **Mastery:** 8/10 ×3; velocidade é fluência, não domínio conceitual.
- **Transferência:** alimenta N4.04/N4.06 e fornece âncoras a N4.07.
- **Resultado:** nenhuma CANDIDATA individual nova.

### N4.04 — Tabuadas 3 e 4

- **Conceito/faixa:** decompor ×4 como dobro do ×2 e ×3 como ×2 + um grupo; `F2`.
- **Pré-requisito:** N4.03, coerente com DAG.
- **L1–L5:** ×4 visual → ×4 simbólico → ×3 visual → misto → mental.
- **Diversidade:** Composer sorteia casos diagnósticos dentro das famílias permitidas.
- **Transferência:** prepara as âncoras de N4.07.
- **Misconceptions/resolução:** procedimentos explicitam parar na decomposição, soma equivocada e troca de tabuada.
- **Resultado:** nenhuma CANDIDATA nova.

### N4.05 — Divisão: repartir e medir

- **Conceito/faixa:** os dois significados de divisão — partição e medida; `F2`.
- **Pré-requisitos:** `N4.01 + N3.02`.
- **Proveniência:** legado `gN4_05`; não há ficha TS N4.05 ativa/registrada na Jornada.
- **Runtime:** todos os casos são múltiplos exatos. L1–L2 pedem repartir igualmente entre caixas; L3–L5 continuam **partição**, agora em `math`: “repartir N doces para D amigos”.
- **Cânone F99:** L1 partição concreta → L2 partição → L3 **medida** (“quantos grupos de 4 cabem?”) → L4 mistura partição/medida → L5 resto, com mastery incluindo os dois modos.
- **Transferência:** N4.06 depende de divisão como inversa; N4.10 depende de N4.05 e introduz algoritmo/resto.
- **Resultado:** **GAP-030 e GAP-031**.

### N4.06 — Família × ↔ ÷

- **Conceito/faixa:** quatro fatos do mesmo trio multiplicativo; `F2`.
- **Pré-requisitos:** ficha declara N4.03; DAG acrescenta N4.05 — divergência em `CLASS-002`. O unlock usa o DAG completo.
- **L1–L5:** produto pequeno → multiplicações → multiplicação+divisão → quatro vértices → deduzir divisão mentalmente.
- **Diversidade:** Composer enumera famílias/fatores e vértices diagnósticos, sorteando entre casos válidos.
- **Mastery:** 3/3 ×2; níveis com apoio exigem que exista apoio real.
- **Transferência:** base direta de N4.07 e N4.10.
- **Resultado:** nenhuma CANDIDATA individual nova.

### N4.07 — Tabuadas 6–9 por âncoras

- **Conceito/faixa:** partir de fato fácil e ajustar; `F2`.
- **Pré-requisitos:** ficha declara N4.04; DAG acrescenta N4.06 — divergência em `CLASS-002`, sem bypass atual de unlock.
- **Estratégias codificadas:** ×9 = ×10−1 grupo; ×6 = ×5+1; ×7 = ×5+2; ×8 = dobro de ×4.
- **L1–L5:** L1 ensina ×9, L2 ×6, L3 ×8; L4 mistura 7/6/8/9; L5 tabuada completa.
- **Salto observado:** `tabuadasDoNivel(4)` introduz ×7 pela primeira vez **junto das outras três**, enquanto `mostraEstrategia(nivel)` devolve `false` a partir do L4. Logo a estratégia ×7 existe na fonte, mas não possui um degrau guiado próprio antes de entrar no misto sem apoio.
- **Mastery:** 8/10 ×3; a suficiência desse salto para criança real não é decidível só pela inspeção de código.
- **Resultado:** **GAP-032**, via `CRIANCA`.

### N4.08 — ×10/×100 e multiplicação por um dígito

- **Conceito/faixa:** deslocamento posicional em ×10/×100 e posterior multiplicação por um dígito; `F3`.
- **Pré-requisitos:** ficha declara N4.07; DAG acrescenta N2.04 + N3.11 — divergência em `CLASS-002`, sem bypass atual.
- **CPA/representação:** material posicional → mistura ×10/×100 → conta por um dígito.
- **L1–L5:** a progressão separa deslocamento posicional de reagrupamento por um dígito; tutorial explicita que “acrescentar zero” não é a regra conceitual.
- **Diversidade:** Composer sorteia números/multiplicadores dentro das famílias autorizadas e filtra casos diagnósticos.
- **Transferência:** alimenta N4.09 e várias competências posteriores.
- **Resultado:** nenhuma CANDIDATA individual nova.

### N4.09 — Multiplicação de dois dígitos pelo modelo de área

- **Conceito/faixa:** distributiva concreta/pictórica antes do algoritmo; `F3`.
- **Pré-requisito:** N4.08, coerente.
- **CPA/representação:** corte marcado → corte imaginado → área+algoritmo → quatro regiões → algoritmo sem área.
- **Onboarding:** tutorial explícito alfabetiza a linguagem do modelo de área antes do conteúdo novo.
- **Contrato:** `areaContract.ts` retira as regiões no L5 e mantém apenas a conta, sem revelar o total previamente.
- **Diversidade:** casos vêm de `areaProcedure`, não de tabela fixa por nível.
- **Transferência:** prepara algoritmo distributivo e sustenta cálculo posterior.
- **Resultado:** nenhuma CANDIDATA nova.

### N4.10 — Divisão com resto e algoritmo

- **Conceito/faixa:** divisão longa como estimar → multiplicar → subtrair → baixar; `F3`.
- **Pré-requisitos:** `N4.06 + N4.05 + N3.12`, coerentes com DAG.
- **Proveniência:** Composer especializado `divisaoLongaContract`, não cai no `vertical` genérico.
- **L1–L5:** arranjo exato → resto → ponte algoritmo → algoritmo → zero no quociente.
- **Representação/resolução:** contrato próprio materializa quociente/resto e preservação posicional; L5 exige evidência de zero no quociente.
- **Variedade:** um único caso fixo por nível; isso é tratado como `CLASS-003`, não GAP individual repetido.
- **Relação com GAP-025:** `revelacaoProgressiva` já possui investigação estacionada no Lote 3; não duplicada aqui.
- **Resultado:** nenhuma CANDIDATA individual nova.

### N4.11 — Múltiplos, divisores e primos

- **Conceito/faixa:** múltiplo ↔ divisor → primo → crivo; `F3`.
- **Pré-requisitos:** `N4.07 + N4.10`, coerentes.
- **Representação:** contrato combina ArrayGrid e Quadrado100 conforme o modo.
- **L1–L5:** múltiplos → divisores → distinguir → primo → crivo.
- **Misconceptions:** inversão divisor/múltiplo, primalidade incorreta, tratamento de 1.
- **Variedade:** `primosDivisoresContract.ts` fixa um único cenário por nível; capturado em `CLASS-003`.
- **Resultado:** nenhuma CANDIDATA individual adicional.

### N4.12 — Divisão por divisor de dois dígitos

- **Conceito/faixa:** estimar com divisor arredondado, testar pelo divisor real, ajustar, lidar com resto e zero posicional; `F3`.
- **Pré-requisitos:** `N4.10 + N2.04`, coerentes.
- **L1–L5:** divisor redondo → quase redondo → geral → resto → zero no quociente.
- **Motor/acessibilidade:** contrato declara toque alternativo, snap generoso, alvo ≥80px e erro motor sem tag.
- **Evidência:** o contrato possui emissor explícito para ajuste da primeira estimativa quando exigido.
- **Variedade:** um único caso fixo por nível; capturado em `CLASS-003`.
- **Resultado:** nenhuma CANDIDATA individual adicional.

---

## 4. Candidatas individuais do Lote 4

### GAP-029 — N4.02: o legado não exige comutatividade e colapsa L2–L5

- **Estado:** `CANDIDATA`
- **Classe:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `MICRONÍVEL-AUSENTE`, `TRANSFERÊNCIA-AUSENTE`, `VARIEDADE-DE-MASTERY`
- **Fato observado:** produção serve `gN4_02`; L2–L5 são a mesma tarefa de selecionar `rows × cols`. O botão de giro é opcional e a resposta não exige rotação.
- **Contraste vivo/autoral:** N4.02 TS declara L3 `require_rotate:true`, L4 expressão e L5 área.
- **Provar/refutar:** traçar o binding servido e provar, com testes do contrato, se alguma outra camada exige rotação/equivalência ou área antes de considerar correção.

### GAP-030 — N4.05: significado de divisão por medida não é servido

- **Estado:** `CANDIDATA`
- **Classe:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `CONCEITO-AUSENTE`, `TRANSFERÊNCIA-AUSENTE`
- **Fato observado:** `gN4_05` sempre pergunta partição (“repartir igualmente entre caixas/amigos”). Nenhum branch pergunta quantos grupos de tamanho conhecido cabem no total.
- **Contraste canônico:** F99 declara explicitamente os dois rostos, com medida em L3 e mistura dos modos em L4.
- **Provar/refutar:** inventariar qualquer outro contrato servido para N4.05 e demonstrar se a semântica de medida é exigida antes de N4.06/N4.10.

### GAP-031 — N4.05: L3–L5 repetem partição simbólica e não constroem resto/ponte para N4.10

- **Estado:** `CANDIDATA`
- **Classe:** `HIPÓTESE-A-PROVAR`
- **Via:** `CODIGO`
- **Tipos:** `MICRONÍVEL-AUSENTE`, `TRANSFERÊNCIA-AUSENTE`, `VARIEDADE-DE-MASTERY`
- **Fato observado:** L3, L4 e L5 de `gN4_05` entram no mesmo branch `math`, sempre com múltiplos exatos. Não há resto nem mudança de tarefa entre os três níveis.
- **Contraste canônico:** F99 usa L4 para discriminar partição↔medida e L5 para resto; N4.10 depende de N4.05 e abre algoritmo/resto.
- **Provar/refutar:** mapear a primeira exposição real a resto e demonstrar se existe ponte executável antes de N4.10.

### GAP-032 — N4.07: ×7 estreia apenas no nível misto, quando o apoio da estratégia já saiu

- **Estado:** `CANDIDATA`
- **Classe:** `HIPÓTESE-A-PROVAR`
- **Via:** `CRIANCA`
- **Tipos:** `SALTO-DE-NÍVEL`, `ONBOARDING-DE-ESTRATÉGIA`
- **Fato observado:** L1 ensina ×9, L2 ×6, L3 ×8; L4 adiciona ×7 junto às quatro difíceis. `mostraEstrategia` é verdadeiro apenas até L3, embora `ESTRATEGIA_DE[7]` exista como ×5 + dois grupos.
- **Por que a via é CRIANCA:** código prova o salto, mas não prova se uma criança que já generalizou a forma “âncora + ajuste” transfere espontaneamente para ×7 sem um degrau guiado próprio.
- **Provar/refutar:** observação controlada da primeira exposição L3→L4, distinguindo desconhecimento de ×7 de falha geral em âncoras; isso não autoriza Gate J agora.

---

## 5. Resumo por classe e por via

### Achados de classe novos

| ID | Classe §0.2 | Via | Escopo |
|---|---|---|---|
| CLASS-002 | CONFIRMADO-ATUAL | CODIGO | prereqs ficha↔DAG: N4.03, N4.06, N4.07, N4.08 |
| CLASS-003 | CONFIRMADO-ATUAL | CODIGO | caso único por nível sob mastery: N4.10, N4.11, N4.12 |

**Contagem de classe:** 2 `CONFIRMADO-ATUAL`; 2 `CODIGO`.

`CLASS-001` permanece válido globalmente, mas **não é achado novo deste lote** e não foi recontado.

### Achados individuais novos

- `HIPÓTESE-A-PROVAR`: **4**;
- demais classes §0.2: **0**;
- `CODIGO`: **3** — GAP-029, GAP-030, GAP-031;
- `SIMULACAO`: **0**;
- `CRIANCA`: **1** — GAP-032.

### Acumulado após N4, sem promover hipótese a dívida

- competências auditadas: **45/90**;
- candidatas individuais abertas registradas pelos Lotes 1–4: **31**;
- vias individuais acumuladas: **26 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- achados de classe: **3** — CLASS-001, CLASS-002, CLASS-003; todos `CONFIRMADO-ATUAL`, via `CODIGO`;
- correções do Gate B: **0**.

A proposta `Gate B′` registrada na Issue #47 continua apenas **PROPOSTA** e não altera o estado/ordem oficial dos gates.

---

## 6. Governança e parada

Este lote não:

- corrigiu `CLASS-001`, `CLASS-002`, `CLASS-003` ou qualquer GAP;
- implementou o gate estático de `lvl`;
- alterou runtime, Matrix, canário ou DAG;
- tocou `main`;
- marcou o PR ready, habilitou auto-merge ou mergeou;
- iniciou Gate C, D, E, F, G, H, I ou J;
- tocou Creature Engine/Tamagotchi.

O snapshot documental do Lote 4 deve receber **CI success + Certificação transversal success 9/9 no mesmo SHA**. Depois disso, confirmar novamente PR #35 `open + draft + unmerged`, `main` intocada e **parar em N4**.

Próximo domínio natural, apenas como proposta de continuidade e **não iniciado neste lote**: `N5`.