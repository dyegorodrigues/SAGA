# Gate B · Lote 8 — AL · Auditoria de microprogressão

**Modo:** `AUDIT-ONLY`  
**Escopo:** `AL.01–AL.08`  
**HEAD de entrada reancorado:** `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`  
**Gate A:** `FECHADO-COM-RECIBO`  
**Gate B:** aberto em lotes  
**Gates C–J:** não iniciados

> Este lote registra evidência. Não corrige código, não implementa gates, não ativa Gate B′ e não inicia o domínio seguinte.

## 1. Reancoragem e pré-condição da catraca documental

Antes da auditoria AL foram confirmados no remoto:

- PR #35 `open + draft + unmerged`;
- branch `codex/fechamento-curricular`;
- `main` intocada em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
- HEAD inicial `a0438611420d6567a4c6a7ae24f028f9036b48dd`;
- branch externa `claude/saga-empresa-educacional-visao-ty4jpy` em `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`, exatamente um commit à frente e com merge-base em `a043861...`;
- diff da ampliação limitado a `src/governance/documentacaoRuntime.test.ts` e `src/governance/documentacao-runtime.baseline.json`;
- reviews e review threads sem pendência nova.

A ampliação da catraca foi inspecionada e integrada por fast-forward não forçado. A política executável passou de lista fixa para descoberta automática:

- todo runtime não-teste em `src/` e `AI_Studio_Lab/tools/`, extensões `.ts/.tsx/.cjs/.mjs`, com **≥20 linhas de comentário** precisa ter baseline;
- o cânone nominal fica protegido sempre, mesmo abaixo do limiar;
- cânone nominal atual: `Composer.ts`, `GameLoop.tsx`, `composerCanaryIds.ts`, `misconceptions.ts`, `evidencias.ts`, `ficha_runtime_map.cjs`, `coverage_matrix_core.ts`;
- baseline observada: **108 arquivos / 7.468 linhas**;
- `emojiRowProcedure.ts=300`, `emojiRowContract.ts=264`, `composerCanaryIds.ts=54`;
- quatro invariantes executáveis: arquivo documentado fora da baseline reprova; caminho inexistente na baseline reprova; perda reprova com `anterior → atual`; ganho sem subida da baseline reprova.

Recibos do mesmo SHA `c4fd3f2...` antes de abrir AL:

- CI #1541 / run `32339472724` — `completed/success`, 4/4 jobs;
- Certificação transversal #277 / run `32339472777` — `completed/success`, 9/9 jobs;
- TypeScript limpo;
- `grafo:check` verde;
- build verde;
- **248 arquivos / 3.463 testes**;
- Matrix **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**.

Somente depois desses dois recibos verdes o Lote 8 foi iniciado.

## 2. Fontes da auditoria AL

Foram revalidados no HEAD:

1. Issue #47, incluindo §0.2 e disciplina AUDIT-ONLY;
2. Issue #48 como registro vivo;
3. `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
4. `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
5. `AI_Studio_Lab/codex/GATE_B_LOTE_7_N7_AUDITORIA.md`;
6. `curriculum/AL.yaml` e DAG runtime;
7. fichas vivas `AL.01.ts`–`AL.08.ts`;
8. cânones F0–F4 correspondentes a F51, F52, F30, F57, F46, F77, F89 e F90;
9. contratos e procedimentos especializados de classificação, padrão, skip-count, regra de sequência, igualdade/equilíbrio, expressão, linguagem de letras e equações;
10. `ClassificacaoStage`, `EmojiRowStage`, `IgualdadeEquilibrioStage`, `ExpressaoF77Stage`, `LinguagemLetrasStage`, `EquacoesStage`;
11. `Composer.ts`, `composerCanary.ts`, `composerCanaryIds.ts`, `FichaRenderer.tsx`, `GameLoop.tsx` e `GameLoopExerciseRenderer.tsx`;
12. `class005006ShufflePolicy.test.ts` e `shuffle.ts` para revalidar CLASS-005/006 após o reparo externo.

Documento histórico não foi promovido a fato atual sem confirmação em fonte viva.

## 3. Resultado executivo AL

- competências auditadas: **8/8**;
- proveniência: **8 Composer / 0 legado / 0 fallback**;
- ficha↔DAG: prereqs/faixas coerentes nas oito competências; AL não adiciona membro à CLASS-002;
- `CLASS-003`: ampliada com **AL.06/F77 e AL.07/F89**;
- `CLASS-004`: nenhum membro AL novo;
- `CLASS-005`: reparo externo revalidado; gate atual proíbe o comparador aleatório em todo `src/`; **FECHADO-COM-RECIBO no runtime atual**, sem correção do Gate B;
- `CLASS-006`: reparo externo é parcial/nominal; AL revela membros residuais fora dos 25 IDs cobertos;
- novas candidatas individuais: **4 — GAP-041 a GAP-044**, todas via `CODIGO`;
- novas vias individuais: **4 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- correções executadas pelo Gate B: **0**;
- runtime, Matrix, canário, Radar e DAG: **intocados neste lote**.

## 4. Proveniência, DAG e escada AL

| Competência | Ficha | Faixa | Prereqs | Origem |
|---|---|---:|---|---|
| AL.01 | F51 | F0 | `[]` | Composer |
| AL.02 | F52 | F0 | `[AL.01]` | Composer |
| AL.03 | F30 | F1 | `[N1.09, N2.01]` | Composer |
| AL.04 | F57 | F2 | `[AL.03, N3.09]` | Composer |
| AL.05 | F46 | F2 | `[N2.03, N3.05]` | Composer |
| AL.06 | F77 | F3 | `[AL.05, N4.06]` | Composer |
| AL.07 | F89 | F4 | `[AL.06, AL.04]` | Composer |
| AL.08 | F90 | F4 | `[AL.07, N7.02]` | Composer |

A macroprogressão observada é coerente: classificar → reconhecer padrões → contar por saltos → inferir regra → igualdade/equilíbrio → expressões → linguagem algébrica → equações. Nenhum bypass de prereq foi observado.

## 5. CLASS-003 — caso único por nível sob mastery repetida · ampliação AL

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

### AL.06/F77

`expressaoF77Contract.ts` possui exatamente um caso determinístico por nível:

- L1: `18 ÷ 3 × 2`;
- L2: `2 + 3 × 4`;
- L3: `(2 + 3) × 4`;
- L4: `3 + □ × 2 = 11`;
- L5: `(4 + 3) × 5 = 4×5 + 3×5`.

A mastery é `3/3 × 2 sessões`. Embaralhar alternativas não cria novo estímulo conceitual.

### AL.07/F89

`linguagemLetrasContract.ts` também possui um caso determinístico por nível:

- L1: `□ → n`;
- L2: dobro de `n` → `2n`;
- L3: três pacotes de `n` → `3n`;
- L4: tabela `3,5,7,9...` → `2n+1`;
- L5: `2n + 2n` → `4n`.

A mastery é `3/3 × 2 sessões`.

Membros observados de CLASS-003 após AL:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- N5.04/F74;
- N5.05/F86;
- N7.01/F84;
- N7.02/F85;
- **AL.06/F77**;
- **AL.07/F89**.

AL.03 não entra: embora L1–L3 fixem famílias de salto, o contrato varia comprimento da sequência e L4/L5 variam salto/início; a ficha exige `evidenciasDistintas`. AL.04 também gera variações por nível e exige evidência distinta em caso decrescente/lacuna.

Não foi criado GAP individual apenas por CLASS-003.

## 6. CLASS-005 — comparador aleatório · reparo externo revalidado

**Estado atual §0.2:** `FECHADO-COM-RECIBO`  
**Via:** `CODIGO`

A classe nasceu no Lote 7 como fato atual. Depois, fora do Gate B audit-only, houve reparo funcional preservado no histórico atual:

- `src/utils/shuffle.ts` fornece Fisher–Yates;
- `class005006ShufflePolicy.test.ts` varre todo `src/` e reprova a sequência `.sort(() => Math.random() - 0.5)` por arquivo/linha;
- o teste está verde no HEAD de entrada deste lote;
- CI e transversal de `c4fd3f2...` estão verdes.

Portanto, no runtime auditado do Lote 8 não há membro AL atual de CLASS-005. Isso **não** conta como correção do Gate B; o Gate B continua com zero correções.

## 7. CLASS-006 — posição invariável do gabarito no fluxo fresco · reparo parcial revelado por AL

**Estado:** `ACHADO-DE-CLASSE`  
**Classe §0.2:** `CONFIRMADO-ATUAL`  
**Via:** `CODIGO`  
**Correção neste lote:** 0

O título histórico da classe no Lote 7 era “gabarito sempre primeiro no fluxo fresco N7”. O princípio do gate proposto, porém, era mais geral: **o gabarito não pode ter posição invariável ao longo do corpus gerável**, salvo exceção diagnóstica explícita.

O reparo externo posterior criou `CLASS_006_IDS` com 25 competências. Em AL, apenas **AL.06 e AL.07** estão nessa lista e o teste comprova que nelas a posição varia em 5 níveis × 8 seeds.

A auditoria AL encontrou quatro regiões residuais fora da cobertura nominal:

### AL.01/F51 — L5

`classificacaoContract.ts` constrói as alternativas do nível “descobrir critério” como:

`[criterioCorreto, ...distratores]`

sem shuffle posterior no caminho fresco. Logo o L5 mantém a resposta correta na primeira posição.

### AL.03/F30 — L2–L4

`skipCountContract.ts` constrói candidatos e termina com ordenação numérica crescente. Nos níveis L2, L3 e L4 o corpus atual sempre possui pelo menos um distrator abaixo e um acima da resposta; a correta fica, portanto, **sempre na segunda posição**. Aqui a fuga não é “correta primeiro”, mas continua sendo **posição invariável**.

### AL.05/F46

`igualdadeEquilibrioContract.ts` serializa alternativas com a correta primeiro. AL.05 não está em `CLASS_006_IDS`; `IgualdadeEquilibrioStage` mapeia `spec.opcoes` diretamente. O fluxo fresco preserva a posição.

### AL.08/F90

`equacoesContract.ts` sorteia três casos por nível — diversidade conceitual existe —, mas em cada caso cria `opcoes` como `[correta, ...distratores]`. AL.08 não está em `CLASS_006_IDS`; `EquacoesStage` preserva a ordem recebida. Portanto variedade de equações não elimina o vazamento posicional.

Conclusão: CLASS-006 foi **parcialmente reparada**, mas não pode ser fechada. A própria lista nominal de 25 IDs permitiu membros fora da cobertura.

### Gate futuro — NÃO IMPLEMENTADO

A direção já proposta deve ser generalizada de lista nominal para propriedade observável:

1. descobrir automaticamente questões frescas de múltipla escolha;
2. provar que a posição correta varia no corpus/seeds quando posição não é semântica;
3. reportar `competência/nível/kind/posição`;
4. exigir justificativa explícita para exceção diagnóstica;
5. evitar lista manual que deixe contratos novos ou antigos fora.

Nenhuma alteração foi feita neste lote.

## 8. GAP-041 — AL.05/F46 troca construção do equilíbrio por escolha de peso

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `INTERAÇÃO-AUSENTE` + `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` + `REPRESENTAÇÃO-DIVERGENTE`  
**Via:** `CODIGO`

O cânone F46 define a igualdade como ação sobre a balança: a criança adiciona/remove objetos/pesos dos pratos até formar o mesmo valor; a resposta física do equilíbrio é a evidência central antes da escrita simbólica.

O runtime atual:

- renderiza a `Balanca` e a equação;
- recebe `spec.opcoes` numéricas;
- a criança toca um peso candidato;
- o palco recalcula a balança com o candidato e envia a alternativa como resposta;
- não existe ação de construir os dois lados ou manipular os pratos.

O fato visual “a balança existe” não é suficiente para refutar a hipótese: a evidência motora/conceitual prescrita é **formar** a igualdade, não reconhecer qual número a completa.

Provar/refutar pela via CODIGO: mapear a evidência canônica F46 e demonstrar uma ação executável que produza igualdade/equilíbrio, com alternativa por toque e filtro motor conforme o adendo F2. Nenhuma correção foi criada.

## 9. GAP-042 — AL.06/F77 perde a transformação visível da ordem de operações

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `REPRESENTAÇÃO-AUSENTE` + `RESOLUÇÃO-DIVERGENTE` + `CONTEÚDO-SÓ-EXPLICADO`  
**Via:** `CODIGO`

O cânone F77 trata a ordem das operações como resolução por etapas visível: o “pacote” prioritário é destacado, resolvido e **colapsa no resultado**, encurtando a expressão antes do próximo passo.

O próprio contrato declarativo ainda preserva esse desenho:

- `destacarPrioridade`;
- `colapsarPrioridade`;
- `equilibrar`.

Mas `ExpressaoF77Stage.tsx` não consome esses estados. O palco atual mostra:

- expressão estática;
- rótulo textual `primeiro: ...`;
- balança;
- alternativas numéricas.

A regra é nomeada, mas a transformação que deveria tornar a precedência observável não é materializada.

Provar/refutar pela via CODIGO: fazer o caminho de resolução executar/mostrar os estados declarados e verificar que a criança vê o subgrupo prioritário se transformar antes do restante. Nenhuma correção foi criada.

## 10. GAP-043 — AL.07/F89 mede reconhecimento onde o cânone pede produção/generalização

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `PRODUÇÃO-TROCADA-POR-RECONHECIMENTO` + `INTERAÇÃO-AUSENTE` + `TRANSFERÊNCIA-INSUFICIENTE`  
**Via:** `CODIGO`

O cânone F89 faz a passagem “caixa → letra → expressão geral” e inclui níveis em que a criança deve **escrever uma expressão simples**, **descobrir a regra de um padrão** e reconhecer equivalência. A estrutura canônica usa padrão/tabela/expressão como ponte para generalização.

O runtime atual `LinguagemLetrasStage`:

- mostra `SingaporeBars`;
- mostra expressão/tabela em `plain`;
- oferece uma grade de alternativas textuais;
- responde por seleção de uma das expressões prontas.

O contrato de resolução declara “testar generalização” em dois valores, mas o palco especializado não materializa um ato de construir/escrever a expressão nem uma etapa interativa de testar a regra em novos valores.

Hipótese: acertar `2n`, `2n+1` ou `4n` entre opções prova reconhecimento de notação, mas não necessariamente a produção/generalização declarada pelos níveis 2 e 4.

Provar/refutar pela via CODIGO: mapear a evidência mínima dos níveis de produção e demonstrar entrada/assemblagem de expressão e teste da regra em valores não idênticos ao exemplo, sem transformar precisão de digitação em requisito motor. Nenhuma correção foi criada.

## 11. GAP-044 — AL.08/F90 preserva a escolha correta, mas não materializa a transformação física central

**Estado:** `CANDIDATA`  
**Classe §0.2:** `HIPÓTESE-A-PROVAR`  
**Tipos:** `REPRESENTAÇÃO-DIVERGENTE` + `RESOLUÇÃO-DIVERGENTE`  
**Via:** `CODIGO`

A auditoria **refuta** uma formulação excessiva: AL.08 não é simplesmente “reconhecimento sem ação”. O runtime oferece transformações por toque — por exemplo “−3 nos dois lados” — e isso é compatível com a regra de acessibilidade que dispensa arrasto obrigatório.

A divergência restante é mais estreita e central ao cânone F90:

- o cânone manda os pesos saírem **simultaneamente dos dois pratos**;
- a balança deve oscilar e retornar ao equilíbrio;
- a equação deve se atualizar junto;
- uma operação unilateral deve produzir desequilíbrio visível e reversível;
- a criança deve perceber fisicamente por que “fazer o mesmo nos dois lados” preserva a igualdade.

`EquacoesStage.tsx` atual apresenta:

- estado inicial equilibrado;
- seleção de uma transformação textual;
- preview estático de preservação/quebra de equilíbrio;
- após acerto, estado final + lista textual de passos.

Não há transição executável sincronizada dos objetos entre “antes” e “depois”.

Provar/refutar pela via CODIGO: demonstrar que a resolução materializa a transformação dos dois pratos e o estado de desequilíbrio/restauração, preservando toque alternativo e filtro motor. Nenhuma correção foi criada.

## 12. Auditoria por competência

### AL.01/F51 — Classificação e o Intruso

- DAG/faixa/prereqs: coerentes;
- produção real de classificação preservada nos níveis 1–4;
- reclassificação usa as mesmas peças com critério anterior válido;
- interseção tem cena garantida;
- mastery exige evidência `NAO_PERTENCE`;
- `CLASS-006`: residual no L5, correta primeira;
- **sem candidata individual nova**.

### AL.02/F52 — Padrões

- DAG/faixa/prereq: coerentes;
- escada AB → AAB/ABB → ABC → lacuna interna → padrão crescente;
- palco `EmojiRowStage` em modo padrão faz a criança escolher a peça que preenche a lacuna;
- suspeita de “faltou arrastar” **REFUTADA**: o cânone não torna arrasto a evidência conceitual desta ficha; seleção da peça preserva a decisão central;
- divergência textual histórica “copie o padrão” vs “preencha a lacuna” permanece documentada na ficha viva e a implementação segue título/§3/§5/§8;
- **sem candidata individual nova**.

### AL.03/F30 — Contagem por Saltos

- DAG/faixa/prereqs: coerentes;
- L1–L3 famílias fixas, mas sequência varia; L4 varia salto; L5 varia salto e início deslocado;
- mastery exige pelo menos duas evidências distintas de skip-count;
- `CLASS-003`: não;
- `CLASS-006`: residual L2–L4, correta sempre na segunda posição por ordenação numérica;
- **sem candidata individual nova**.

### AL.04/F57 — Regra da Sequência

- DAG/faixa/prereqs: coerentes;
- variação executável por nível;
- inclui decrescente, lacuna no meio e multiplicativa;
- mastery exige evidência distinta em decrescente/lacuna;
- não usa múltipla escolha posicional no caminho especializado;
- **sem candidata individual nova**.

### AL.05/F46 — Igualdade e Equilíbrio

- DAG/faixa/prereqs: coerentes;
- L4 possui variedade de casos e exigência de evidência distinta;
- `CLASS-006`: residual, correta primeiro no fluxo fresco;
- `GAP-041`: candidata individual de produção/interação/representação.

### AL.06/F77 — Expressões e Propriedades

- DAG/faixa/prereqs: coerentes;
- `CLASS-003`: sim, um caso fixo por nível;
- reparo externo de `CLASS-006`: coberto entre os 25 IDs, posição agora varia;
- `GAP-042`: candidata individual de representação/resolução.

### AL.07/F89 — Linguagem Algébrica e Generalização

- DAG/faixa/prereqs: coerentes;
- `CLASS-003`: sim, um caso fixo por nível;
- reparo externo de `CLASS-006`: coberto entre os 25 IDs, posição agora varia;
- `GAP-043`: candidata individual de produção/generalização.

### AL.08/F90 — Equações do 1º Grau

- DAG/faixa/prereqs: coerentes;
- três casos por nível; não entra em CLASS-003;
- L3+ exige evidência específica de equações;
- escolha da transformação por toque existe — suspeita de “nenhuma ação” refutada;
- `CLASS-006`: residual, correta serializada primeiro fora dos 25 IDs;
- `GAP-044`: candidata individual restrita à transformação física/sincronizada da balança.

## 13. Estado acumulado após AL

Sem promover hipótese a dívida:

- competências auditadas: **64/90**;
- candidatas individuais: **39**;
- vias individuais: **34 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais inventariadas: **6 — CLASS-001 a CLASS-006**;
- `CLASS-005`: revalidada `FECHADO-COM-RECIBO` no runtime atual após reparo externo;
- `CLASS-006`: permanece `CONFIRMADO-ATUAL`, reparo parcial com membros residuais AL;
- `DECISAO-001/GM.04`: separada, `PENDENTE-DE-DECISÃO-HUMANA`;
- correções executadas pelo Gate B: **0**.

A conta parte de 35 candidatas após N7 e adiciona GAP-041–GAP-044, todas CODIGO.

## 14. Governança preservada

Neste lote:

- `main` não foi tocada;
- PR não foi marcado ready;
- auto-merge/merge não foram usados;
- nenhum código funcional foi corrigido;
- nenhum gate foi implementado;
- Gate B′ não foi ativado;
- Gates C–J não foram iniciados;
- Creature Engine/Tamagotchi não foram tocados;
- testes/Matrix/Radar/DAG/sondas não foram enfraquecidos;
- recibos não foram misturados entre SHAs.

## 15. Certificação e parada

O snapshot documental final deste lote deve receber:

- CI `completed/success`;
- Certificação transversal `completed/success` com 9/9 jobs;
- ambos no **mesmo SHA final**.

Os IDs dos runs finais devem ser registrados na Issue #48 após a certificação, sem novo commit.

Depois da certificação:

1. revalidar PR #35 `open + draft + unmerged`;
2. revalidar `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
3. reportar classes separadas das candidatas individuais e por via;
4. registrar que faltam, na ordem natural, **GE, GM e PE**;
5. **PARAR**.

Não iniciar GE, GM, PE, Gate C, Gate G, Gate J, Observatório ou outra frente.