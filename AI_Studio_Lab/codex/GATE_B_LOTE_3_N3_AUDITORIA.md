# GATE B — LOTE 3 · Mega-auditoria de microprogressão N3

**Data:** 2026-08-19  
**Modo:** AUDIT-ONLY  
**Escopo curricular:** somente domínio `N3` (`N3.01`–`N3.13`)  
**Escopo estrutural prévio autorizado:** varredura de geradores do projeto para o padrão `lvl` declarado e não consumido  
**Autoridade:** Issue #47 §0.2/§3 + Issue #48  
**Estado do Gate B:** ABERTO, **não fechado**  
**Regra:** nenhum achado deste documento autoriza correção de código, runtime, Matrix, canário ou DAG.

## 0. Âncora e método

A auditoria foi aberta a partir do HEAD remoto `a5101b362ae6d4896258f994ed14145b37950b98`, com PR #35 **open + draft + unmerged**, sem reviews/threads, e `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.

Foram revalidados no HEAD:

- `curriculum/N3.yaml`;
- `src/curriculum/grafo_saga.ts`;
- `src/curriculum/motores/composerCanaryIds.ts` e a proveniência efetiva Composer/legado;
- fichas TS vivas de N3 disponíveis no catálogo/Composer;
- fichas canônicas F13/F15/F14/F31/F16/F32/F33/F34/F35/F20 e F39/F40/F41;
- `src/curriculum/Composer.ts` e `src/curriculum/procedimentos/additiveProcedure.ts` quando necessários para N3.09/N3.10;
- todos os arquivos de geradores de produção encontrados em `src/utils`: `generators.ts`, `generatorsF1.ts`, `generatorsF2.ts`, `generatorsVisual.ts`;
- `src/utils/legadoF0.ts` como alvo de rollback congelado, para distinguir exceção deliberada de violação do padrão;
- Issue #47 §0.2/§3 e Issue #48.

Documentos históricos foram usados apenas como contexto. Quando uma afirmação não foi revalidada no HEAD, ela não foi promovida a estado atual.

### 0.1 Classes e vias

Achados individuais do currículo seguem a disciplina dos lotes anteriores:

- estado na Issue #48: `CANDIDATA`;
- classe §0.2: `HIPÓTESE-A-PROVAR`, salvo prova que justifique outra classe;
- via `CODIGO`, `SIMULACAO` ou `CRIANCA` conforme a evidência mínima necessária para encerramento.

O achado estrutural pedido para abrir este lote é registrado separadamente como **ACHADO-DE-CLASSE**, e não como uma candidata por competência.

---

## 1. Achado de classe — `CLASS-001` · gerador declara `lvl` e não o consome

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via de resolução:** `CODIGO`  
**Correção neste lote:** **PROIBIDA / 0 alterações executáveis**

### 1.1 Resultado externo revalidado

O resultado externo foi **confirmado** no HEAD `a5101b3` em `src/utils/generatorsF2.ts`:

- `gN3_11(lvl)` — `lvl` não é referenciado no corpo;
- `gN3_12(lvl)` — `lvl` não é referenciado no corpo;
- `gN2_05(lvl)` — `lvl` não é referenciado no corpo;
- `gN3_13(lvl)` — `lvl` não é referenciado no corpo.

Em particular, `gN2_05` fixa `base = ri(1, 9) * 10`, escolhe apenas unidade 1–9 e sempre pede arredondamento para a **dezena**. Logo a conclusão do Lote 2 de que todos os níveis colapsam para a mesma família foi novamente confirmada.

### 1.2 Varredura estendida a todos os arquivos de geradores

A regra literal usada para a varredura foi: **função geradora declara parâmetro chamado exatamente `lvl` e não possui referência executável a esse identificador no corpo**. Encaminhar `lvl` para outro gerador conta como uso; comentários, strings e a própria declaração não contam.

Foram encontrados **18 geradores diretamente afetados**:

#### `src/utils/generators.ts` — 4

- `gAL_02`
- `gGE_01`
- `gGE_02`
- `gGM_02`

#### `src/utils/generatorsF1.ts` — 4

- `gN2_02`
- `gN3_05`
- `gN3_08`
- `gN3_09`

#### `src/utils/generatorsF2.ts` — 4

- `gN3_11`
- `gN3_12`
- `gN2_05`
- `gN3_13`

#### `src/utils/generatorsVisual.ts` — 6

- `gVis_VisualAddition`
- `gVis_Scattered`
- `gVis_LinkingCubesSentence`
- `gVis_TakeApart`
- `gVis_Sequence`
- `gVis_MissingAddendFrame`

**Total: 18.**

### 1.3 Não-falsos-positivos importantes

- wrappers como `gN3_01(lvl) { return gVis_VisualAddition(lvl); }` **referenciam `lvl`** e não violam diretamente a regra, ainda que o gerador chamado possa ignorá-lo;
- o mesmo vale para wrappers que encaminham `lvl` a `Composer`, `legadoF0` ou outro gerador;
- `legadoAL_01(_lvl)` usa o identificador deliberado `_lvl` e vive em arquivo congelado de rollback; não entra na regra literal pedida para `lvl`.

### 1.4 Consequência no domínio N3

O padrão alcança diretamente ou por gerador subjacente vários nós N3, mas **não foi aberto um GAP por competência** apenas por isso. N3.05, N3.08, N3.11 e N3.12, por exemplo, aparecem na auditoria abaixo com referência a `CLASS-001` quando a perda de progressão é a mesma causa estrutural.

### 1.5 Gate proposto — NÃO IMPLEMENTADO

Formato recomendado para uma futura catraca de CI:

1. teste estático/AST, por exemplo `generatorLevelContract.test.ts`;
2. escanear os arquivos de geradores de produção;
3. detectar `function` e arrow exports cujo parâmetro se chame `lvl`;
4. exigir pelo menos uma referência ao identificador `lvl` dentro do corpo executável;
5. ignorar declaração, comentários, strings e type annotations;
6. wrappers que encaminham `lvl` passam;
7. `_lvl` permanece uma supressão explícita/deliberada, especialmente em legado congelado;
8. falha deve informar `arquivo :: função`;
9. a CI deve falhar se surgir novo gerador com `lvl` morto.

A futura ativação desse gate deve ocorrer **depois** de uma frente autorizada corrigir/reconciliar os 18 casos atuais; não foi implementada neste lote audit-only.

---

## 2. Resultado executivo N3

- competências N3 auditadas: **13/13**;
- achado de classe: **1** — `CLASS-001`, `CONFIRMADO-ATUAL`, via `CODIGO`;
- candidatas curriculares novas: **7** — `GAP-022` a `GAP-028`;
- classe das 7: **`HIPÓTESE-A-PROVAR`**;
- via `CODIGO`: **7**;
- via `SIMULACAO`: **0**;
- via `CRIANCA`: **0**;
- correções executadas: **0**.

Proveniência N3 observada:

- Composer ativo: `N3.01`, `N3.02`, `N3.03`, `N3.09`, `N3.10`;
- legado servido: `N3.04`, `N3.05`, `N3.06`, `N3.07`, `N3.08`, `N3.11`, `N3.12`, `N3.13`.

Os oito legados são parte do resíduo global já `CONFIRMADO-ATUAL`; as conclusões pedagógicas específicas continuam candidatas quando abertas abaixo.

---

## 3. Auditoria competência por competência

### N3.01 — Adição concreta até 10

- **Conceito/faixa:** juntar/acrescentar como composição de duas parcelas; `F1`.
- **Pré-requisitos:** `N1.04 + N1.10`, coerentes entre ficha e DAG.
- **CPA/representação:** grupos+numerais → retirada de objetos → símbolo.
- **L1–L5:** estreia guiada até 5 → até 5 → até 10 → sem objetos → simbólico.
- **Diversidade:** Composer especializado varia parcelas/tema; a evidência `SEM_OBJETOS` garante a ponte no L4.
- **Mastery:** 3/3 ×2; RT L5 silencioso.
- **Onboarding/resolução:** tutorial explícito da gramática grupo↔numeral e da ação de juntar.
- **Transferência:** alimenta N3.02/N3.03.
- **Resultado:** nenhuma CANDIDATA nova. O gerador visual legado subjacente aparece em `CLASS-001`, mas isso não foi duplicado como GAP N3.01.

### N3.02 — Subtração concreta até 10

- **Conceito/faixa:** retirar e distinguir o que saiu do que sobrou; `F1`.
- **Pré-requisito:** N3.01.
- **CPA/representação:** ação de riscar → contorno fantasma → leitura de retirada pronta → símbolo.
- **L1–L5:** progressão observável e coerente.
- **Mastery:** 3/3 ×2; fluência separada.
- **Motor:** gesto é parte da ação conceitual e depois é retirado; não se exige precisão como conceito.
- **Onboarding/resolução:** tutorial explícito.
- **Resultado:** nenhuma CANDIDATA nova.

### N3.03 — Counting on

- **Conceito/faixa:** confiar na parcela maior e contar apenas a parcela menor; `F1`.
- **Pré-requisitos:** `N3.01 + N1.09 + N2.03`, coerentes com DAG.
- **CPA/representação:** cubos+reta → reta → reta só após erro → mental.
- **L1–L5:** retirada progressiva do apoio observável na ficha viva.
- **Mastery:** 3/3 ×2; alvo mental separado de RT.
- **Onboarding:** tutorial explícito da correspondência cubo↔salto.
- **Resultado:** nenhuma CANDIDATA nova. O rollback visual subjacente que ignora `lvl` fica somente em `CLASS-001`.

### N3.04 — Contar para trás e completar

- **Conceito canônico:** duas estratégias e **escolha eficiente** entre voltar e completar.
- **Pré-requisitos:** `N3.02 + N1.02 + N1.12`.
- **Proveniência:** legado `gN3_04`.
- **Runtime observado:** L1 retirada visual; L2/L3 subtração simbólica por magnitude; L4 `a − □ = resultado`; L5 dois dígitos menos unidades. A explicação dominante ensina voltar; não existe contrato que exija escolher completar quando esse caminho é mais curto.
- **Cânone F31:** mastery exige 4/4 ×2 e **duas das quatro** em casos onde completar é o caminho mais curto.
- **Resultado:** **GAP-022**.

### N3.05 — Família de fatos

- **Conceito:** um trio parte-parte-todo gera duas adições e duas subtrações.
- **Pré-requisitos:** `N1.10 + N3.03 + N3.04`.
- **Proveniência:** legado `gN3_05`.
- **Runtime:** uma única forma `a+b=s → s−a=?`; `lvl` não é consumido.
- **Cânone:** exige progressão até deduzir subtrações e mastery com ao menos uma subtração deduzida.
- **Resultado:** a perda de níveis/direções é consequência direta de **CLASS-001** e não foi duplicada como candidata individual.

### N3.06 — Dobros e quase-dobros

- **Conceito:** memorizar dobros e **deduzir** quase-dobros a partir deles.
- **Pré-requisito:** N3.03.
- **Proveniência:** legado `gN3_06`.
- **Runtime:** L1–L2 só dobros; L3–L5 sorteiam entre dobro e quase-dobro com `50%`, usando a mesma faixa `n=2..5`.
- **Cânone F32:** no nível 3+ o domínio precisa **incluir quase-dobro**; só dobrar não prova a estratégia.
- **Mastery/variedade:** o gerador não carrega evidência que obrigue amostrar quase-dobro na janela de mastery; por acaso, uma janela pode conter apenas dobros.
- **Resultado:** **GAP-023**.

### N3.07 — Fazer 10

- **Conceito:** decompor a segunda parcela para completar 10 e somar o restante.
- **Pré-requisitos:** `N1.11 + N1.10 + N2.01`.
- **Proveniência:** legado `gN3_07`.
- **Contrato N3/cânone:** declara `tenframe`, `bond` e `math`, com retirada progressiva do apoio.
- **Runtime:** L1 usa `tenframe`; **L2–L5 usam a mesma família `numberline-interactive`**, com a mesma distribuição básica `a/comp/rem`; não há os degraus `bond` e `math` declarados pela competência.
- **Resultado:** **GAP-024**.

### N3.08 — Voltar pelo 10

- **Conceito:** decompor o subtraendo para chegar primeiro a 10 e depois retirar o restante.
- **Pré-requisitos:** `N3.07 + N3.04`.
- **Proveniência:** legado `gN3_08`.
- **Runtime:** uma única família de reta interativa; `lvl` não é consumido.
- **Resultado:** a ausência de escada por nível é registrada somente em **CLASS-001**, sem candidata duplicada.

### N3.09 — Somar/subtrair até 100 sem reagrupar

- **Conceito/faixa:** operar por valor posicional sem carry/borrow; `F1`.
- **Proveniência:** Composer ativo.
- **L1–L5:** dezenas exatas → 2d+unidades → duas ordens → subtração → misto, todos com `forbid_regroup`.
- **Mastery:** 3/3 ×2; parâmetros distinguem efetivamente os níveis.
- **Norma de representação:** o adendo canônico F1 exige que F35 declare `revelacaoProgressiva: true`; a busca no HEAD encontrou `revelacaoProgressiva` apenas em documentos normativos/canônicos, não em fonte executável.
- **Relação com F39/F40:** o adendo F2 exige a mesma declaração para as fichas de reagrupamento N3.11/N3.12.
- **Resultado:** **GAP-025**, compartilhado por F35/F39/F40, sobre a norma de divulgação progressiva ainda não possuir contrato executável observável.

### N3.10 — Problemas aditivos

- **Conceito:** reconhecer juntar, separar, comparar e completar; no L5 variar a posição da incógnita.
- **Proveniência:** Composer ativo.
- **DAG/YAML:** prereqs `N3.03 + N3.04`.
- **Ficha TS viva:** declara apenas `N3.03`.
- **Builder:** `structuresForLevel(lvl)` entrega quatro estruturas a partir do L3; L5 usa `unknownSlotsForLevel` para deslocar a incógnita.
- **Mastery da ficha:** 4/4 ×2 em cada micro, sem requisito declarado por estrutura.
- **Procedimento canônico:** existe `coversDistinctStructures`, documentado como regra de domínio — quatro acertos precisam cobrir estruturas diferentes — mas a busca no HEAD encontrou seu uso apenas no próprio procedimento/testes, não na concessão real de mastery.
- **Resultados:** **GAP-026** e **GAP-027**.

### N3.11 — Adição com reagrupamento

- **Conceito canônico F39:** dez unidades viram uma dezena; material → algoritmo; L5 chega a 3 dígitos com reagrupamento duplo.
- **Pré-requisitos:** `N2.01 + N3.07 + N3.09`.
- **Proveniência:** legado `gN3_11`.
- **Runtime:** sempre dois dígitos + dois dígitos, carry forçado apenas nas unidades; `lvl` não é consumido.
- **Resultado:** colapso de níveis fica em **CLASS-001**; a ausência da declaração normativa de divulgação progressiva participa de **GAP-025**. Nenhum terceiro GAP duplicado foi aberto.

### N3.12 — Subtração com reagrupamento

- **Conceito canônico F40:** desmontar uma dezena em 10 unidades e ligar a troca ao algoritmo.
- **Pré-requisitos:** `N3.11 + N3.08`.
- **Proveniência:** legado `gN3_12`.
- **Runtime:** sempre dois dígitos − dois dígitos com borrow nas unidades; `lvl` não é consumido.
- **Resultado:** colapso de níveis fica em **CLASS-001**; norma de divulgação progressiva participa de **GAP-025**.

### N3.13 — Cálculo mental e estimativa aditiva

- **Conceito vigente:** `curriculum/N3.yaml`, DAG e F41 nomeiam **cálculo mental e estimativa**, escolhendo estratégias como compensar/arredondar/decompor em vez de armar sempre.
- **Pré-requisitos:** `N3.11 + N3.12`.
- **Proveniência:** legado `gN3_13`.
- **Runtime observado:** o próprio comentário do gerador o descreve como `Problemas de dois passos (+ e -)` e gera somente a história `start + gain - loss`.
- **Divergência:** mesmo que `lvl` passasse a ser referenciado, a tarefa continuaria medindo um problema aditivo de dois passos e não seleção de estratégia mental/estimativa. Por isso este achado é **independente** de CLASS-001.
- **Resultado:** **GAP-028**.

---

## 4. Registro das candidatas individuais

### GAP-022 — N3.04 não exige flexibilidade voltar ↔ completar

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `CONCEITO-AUSENTE`, `VARIEDADE-DE-MASTERY`
- Evidência: F31 exige duas estratégias e dois casos onde completar é mais curto; `gN3_04` não expressa essa cobertura/seleção.
- Encerramento: mapear a concessão real de mastery e provar/refutar que a flexibilidade estratégica é exigida antes de domínio.

### GAP-023 — N3.06 pode dominar sem provar quase-dobro

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `VARIEDADE-DE-MASTERY`, `MICROPROGRESSÃO-COLAPSADA`
- Evidência: L3–L5 sorteiam dobro/quase-dobro; F32 exige quase-dobro em nível 3+.
- Encerramento: provar a janela real de mastery e a existência/ausência de requisito de evidência para quase-dobro.

### GAP-024 — N3.07 L2–L5 colapsam para uma única família de reta

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `MICROPROGRESSÃO-COLAPSADA`, `REPRESENTAÇÃO-AUSENTE`
- Evidência: contrato declara `tenframe + bond + math`; legado usa tenframe só em L1 e `numberline-interactive` indistinto em L2–L5.
- Encerramento: reconciliar cada nível canônico com representação executável real.

### GAP-025 — F35/F39/F40: divulgação progressiva é normativa, mas não executável no HEAD

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `PONTE-CPA-AUSENTE`, `CONTRATO-NÃO-EXECUTÁVEL`
- Evidência: adendos F1/F2 obrigam `revelacaoProgressiva: true`; busca atual localiza a declaração somente em documentos, não no código executável.
- Encerramento: localizar eventual equivalente semântico já executado ou confirmar ausência de suporte/consumo antes de propor implementação.

### GAP-026 — N3.10 diverge nos pré-requisitos ficha ↔ DAG/YAML

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `PRÉ-REQUISITO-DIVERGENTE`, `FICHA↔RUNTIME`
- Evidência: DAG/YAML exigem `N3.03 + N3.04`; ficha TS viva declara somente `N3.03`.
- Encerramento: identificar a autoridade consumida em cada fluxo e reconciliar sem alterar DAG neste lote.

### GAP-027 — N3.10 possui helper de cobertura das quatro estruturas, mas mastery não o consome

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `VARIEDADE-DE-MASTERY`, `CONTEÚDO-NÃO-EXIGIDO`
- Evidência: `coversDistinctStructures` diz explicitamente que quatro acertos da mesma estrutura não provam competência; não foi encontrado consumo desse helper na concessão real de domínio.
- Encerramento: traçar telemetria/evidência de mastery do N3.10 e provar/refutar cobertura obrigatória por estrutura.

### GAP-028 — N3.13 serve problema de dois passos no lugar de cálculo mental/estimativa

- Estado: `CANDIDATA`
- Classe: `HIPÓTESE-A-PROVAR`
- Via: `CODIGO`
- Tipos: `CONCEITO-AUSENTE`, `FICHA↔RUNTIME`, `MICROPROGRESSÃO-AUSENTE`
- Evidência: fonte executável `gN3_13` gera `start + gain - loss`; contrato/cânone vigentes definem seleção de estratégia mental e estimativa.
- Encerramento: provar o binding servido e reconciliar o conceito executável com N3.13; adicionar mera referência a `lvl` não resolve esta candidata.

---

## 5. Resumo por classe e por via

### Achado de classe

- `CLASS-001`: **1**
- classe: `CONFIRMADO-ATUAL`: **1**
- via `CODIGO`: **1**
- geradores afetados: **18**

### Achados individuais N3

- `HIPÓTESE-A-PROVAR`: **7**
- demais classes §0.2 como novas candidatas: **0**
- via `CODIGO`: **7**
- via `SIMULACAO`: **0**
- via `CRIANCA`: **0**

Nenhuma candidata foi promovida a `PROVADA` ou dívida confirmada neste lote.

---

## 6. Falsos positivos / não-duplicações recusadas

1. **Não abrir um GAP para cada gerador com `lvl` morto.** O usuário determinou e a auditoria respeita `CLASS-001` como um único achado de classe.
2. **Não marcar wrapper que encaminha `lvl` como violação direta.** A regra estática deve observar referência executável, não efeito semântico transitivo.
3. **Não transformar todo legado N3 em candidata automaticamente.** Legado é resíduo confirmado; só há candidata quando existe divergência pedagógica específica revalidada.
4. **Não duplicar N3.11/N3.12 só porque seus cinco níveis colapsam.** Essa causa já está em CLASS-001; apenas a obrigação independente de divulgação progressiva entra em GAP-025.
5. **Não tratar RT como mastery.** Nenhum achado usa velocidade conceitual como prova de domínio.

---

## 7. Governança e parada

Este lote alterou/alterará somente documentação do Gate B e comentários da Issue #48.

Permanece proibido:

- corrigir `CLASS-001` ou GAP-022–GAP-028;
- alterar runtime, Matrix, canário, DAG, fichas, geradores ou testes executáveis;
- tocar `main`;
- marcar PR ready, auto-mergear ou mergear;
- iniciar Gates C–J;
- tocar Creature Engine/Tamagotchi.

O snapshot documental do Lote 3 deve possuir **CI success + Certificação transversal success 9/9 no mesmo SHA**.

Depois dos dois verdes:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` intocada;
3. reportar separadamente `CLASS-001` e GAP-022–GAP-028 por classe/via;
4. propor **Gate B · Lote 4 — N4** como próximo lote, sem iniciá-lo;
5. **PARAR**.
