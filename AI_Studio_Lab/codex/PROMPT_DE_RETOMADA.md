# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional de verdade do PR #35 no pós-90/90.** GitHub remoto, fontes executáveis, Issue #47 e documentos canônicos especializados vencem memória de conversa, roadmap histórico ou checkpoint desatualizado.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada
- HEAD de entrada auditado do Gate B · Lote 8: `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`; o HEAD remoto vivo sempre vence este valor se avançar
- A API pode reportar `main` como `protected:false`; a regra vinculante permanece **não tocar `main`**.

Antes de QUALQUER escrita futura:

1. reancore PR, branch, HEAD e `main` no remoto;
2. confira reviews e review threads;
3. consulte CI + Certificação transversal do HEAD relevante;
4. leia a Issue #47 e `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
5. para Gate B, leia a Issue #48 e todos os documentos dos lotes concluídos;
6. abra somente fontes canônicas/executáveis do lote autorizado;
7. trate documento antigo como histórico até revalidar no HEAD;
8. nunca misture recibos entre SHAs.

## 2. Modo operacional

A Fábrica Curricular Principal terminou formalmente. O modo do projeto é **Integração Sistêmica e Child-Ready**.

Isso não significa que o produto esteja Child-Ready. A Definition of Child-Ready e a ordem oficial dos gates pertencem à **Issue #47**.

`AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md` é índice executivo, não substituto das autoridades especializadas.

## 3. Gate A — FECHADO-COM-RECIBO

Gate A está **FECHADO-COM-RECIBO**.

### Promoção técnica final W50

- SHA: `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` — success;
- Certificação transversal `32196855356` — success 9/9;
- Coverage Matrix: **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**;
- cobertura: **90 competências / 94 fichas autorais**.

### Fechamento documental final

- SHA: `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` — success;
- Certificação transversal `32197697050` — success 9/9.

W1–W50 não devem ser refeitas sem causa nova observável.

## 4. Infraestrutura pós-Lote 7 revalidada antes de AL

O runtime avançou depois do documento do Lote 7. Antes de abrir AL foram revalidados:

### Reparos CLASS-005/006 preservados

- reparo restaurado em `658011aedf3b00ebb126901c28d27585db4b0b2a`, descendente do estado pós-Lote 7;
- `src/utils/shuffle.ts` fornece Fisher–Yates;
- `src/curriculum/class005006ShufflePolicy.test.ts` mantém gate global para CLASS-005 e gate nominal de 25 IDs para CLASS-006;
- CLASS-005: nenhuma ocorrência produtiva de `.sort(() => Math.random() - 0.5)` em `src/`;
- CLASS-006: os 25 IDs do gate têm posição de gabarito variável; em AL, **AL.06 e AL.07** estão nessa lista;
- o reparo externo não conta como correção executada pelo Gate B.

### Catraca de densidade documental

HEAD de entrada do Lote 8: `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`.

A catraca documental foi ampliada de lista fixa para descoberta automática:

- runtime não-teste em `src/` + `AI_Studio_Lab/tools/` com ≥20 linhas de comentário precisa de baseline;
- cânone nominal sempre protegido, mesmo abaixo do limiar;
- cânone nominal: `Composer.ts`, `GameLoop.tsx`, `composerCanaryIds.ts`, `misconceptions.ts`, `evidencias.ts`, `ficha_runtime_map.cjs`, `coverage_matrix_core.ts`;
- baseline: **108 arquivos / 7.468 linhas**;
- quatro invariantes: documentado fora da baseline reprova; caminho inexistente reprova; perda reprova `anterior → atual`; ganho sem subir baseline reprova.

Recibos de `c4fd3f2...` antes de abrir AL:

- CI #1541 / `32339472724` — completed/success 4/4;
- Certificação transversal #277 / `32339472777` — completed/success 9/9;
- TypeScript, `grafo:check` e build verdes;
- **248 arquivos / 3.463 testes**;
- Matrix **75/15/0/90/11**.

## 5. Estado dos gates pós-90/90

- **Gate A:** FECHADO-COM-RECIBO.
- **Gate B:** **ABERTO EM LOTES**.
- **Gates C–J:** **NÃO INICIADOS**.

### Lote 1 — N1

- 13/13;
- snapshot `ad1b239457371a1f411001fd8521984eeadb94fe`;
- 10 candidatas originais `GAP-002`–`GAP-011`;
- rotas originais 7 CODIGO / 0 SIMULACAO / 3 CRIANCA;
- CI `32209683689` + transversal `32209683699` success 9/9.

`GAP-007` foi absorvido por `CLASS-002`; não foi corrigido.

### Lote 2 — N2

- 7/7;
- snapshot `a5101b362ae6d4896258f994ed14145b37950b98`;
- 10 candidatas originais `GAP-012`–`GAP-021`;
- rotas originais 9 CODIGO / 1 SIMULACAO / 0 CRIANCA;
- CI `32216926616` + transversal `32216926610` success 9/9.

`GAP-021` foi absorvido por `CLASS-002`; não foi corrigido.

### Lote 3 — N3

- 13/13;
- snapshot `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`;
- `CLASS-001`: 18 geradores com `lvl` declarado e não consumido, `CONFIRMADO-ATUAL`, via CODIGO;
- 7 candidatas originais `GAP-022`–`GAP-028`;
- CI `32218633036` + transversal `32218633032` success 9/9.

`GAP-026` foi absorvido por `CLASS-002`; não foi corrigido.

### Lote 4 — N4

- 12/12;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_4_N4_AUDITORIA.md`;
- snapshot `4a2ad53ca31008bce66e25730b3bf37b6d11e395`;
- proveniência 10 Composer / 2 legado;
- `CLASS-002` + `CLASS-003` abertas/revalidadas;
- `GAP-029`–`GAP-032`;
- CI `32254266799` + transversal `32254266804` success 9/9.

### Lote 5 — N5

- 5/5;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_5_N5_AUDITORIA.md`;
- snapshot `fac6abb79200e3ae45493d17ea09f9bca41689e4`;
- proveniência 5 Composer / 0 legado / 0 fallback;
- `CLASS-002` reconciliada/fechada para descoberta;
- `DECISAO-001/GM.04` isolada;
- `CLASS-003` ampliada com N5.04/N5.05;
- `GAP-033`–`GAP-035` originais;
- CI `32260196527` + transversal `32260196519` success 9/9.

`GAP-034` foi depois absorvido por `CLASS-004` no Lote 6.

### Lote 6 — N6

- 4/4;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_6_N6_AUDITORIA.md`;
- snapshot `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`;
- proveniência 4 Composer / 0 legado / 0 fallback;
- `CLASS-004` criada, absorvendo GAP-034;
- `GAP-025` ampliado para F76/N6.02;
- candidatas `GAP-036`–`GAP-038`, 3 CODIGO;
- `DECISAO-001/GM.04` permaneceu pendente humana;
- CI `32291510503` + transversal `32291509536` success 9/9;
- correções: 0.

### Lote 7 — N7

- 2/2;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_7_N7_AUDITORIA.md`;
- proveniência 2 Composer / 0 legado / 0 fallback;
- `CLASS-003` ampliada com N7.01/F84 e N7.02/F85;
- `CLASS-004` agravada em N6.01/F75 e ampliada com N7.01/F84 L2;
- `CLASS-005` criada para comparador aleatório em `sort`;
- `CLASS-006` criada para gabarito com posição invariável no fluxo fresco N7;
- candidatas `GAP-039`–`GAP-040`, ambas CODIGO;
- falsa suspeita de vazamento via `target` na reta refutada;
- correções: 0.

### Lote 8 — AL

Escopo auditado: **AL.01–AL.08, 8/8**.

Documento:

`AI_Studio_Lab/codex/GATE_B_LOTE_8_AL_AUDITORIA.md`

Resultado materializado:

- proveniência: **8 Composer / 0 legado / 0 fallback**;
- prereqs/faixas AL coerentes ficha↔DAG;
- macroprogressão coerente: classificação → padrão → saltos → regra → igualdade → expressão → linguagem algébrica → equações;
- `CLASS-003` ampliada com **AL.06/F77 e AL.07/F89**;
- `CLASS-004`: sem membro AL novo;
- `CLASS-005`: reparo externo revalidado, gate global verde; estado atual **FECHADO-COM-RECIBO**;
- `CLASS-006`: reparo externo é parcial; AL.06/AL.07 estão protegidas entre os 25 IDs, mas membros residuais foram confirmados em AL.01-L5, AL.03-L2–L4, AL.05 e AL.08;
- `GAP-041`: AL.05/F46 troca construção do equilíbrio por escolha de peso, `HIPÓTESE-A-PROVAR`, CODIGO;
- `GAP-042`: AL.06/F77 não materializa o destaque/colapso visual da prioridade declarado pelo cânone e pela própria resolução, `HIPÓTESE-A-PROVAR`, CODIGO;
- `GAP-043`: AL.07/F89 troca produção/generalização de expressão por seleção entre expressões prontas, `HIPÓTESE-A-PROVAR`, CODIGO;
- `GAP-044`: AL.08/F90 preserva escolha de transformação por toque, mas não materializa a transformação física sincronizada dos dois pratos exigida pelo cânone, `HIPÓTESE-A-PROVAR`, CODIGO;
- AL.01–AL.04 sem candidata individual nova;
- correções executadas: 0;
- runtime/Matrix/canário/Radar/DAG intocados pelo lote.

O snapshot documental final do Lote 8 exige **CI success + Certificação transversal success 9/9 no mesmo SHA**. Os recibos finais devem ser registrados na Issue #48 sem novo commit.

**Próximos domínios naturais, não iniciados:** `GE`, depois `GM`, depois `PE`.

## 6. Proposta de governança — Gate B′

Issue #47 comentário `5342129190`:

- estado **PROPOSTA**;
- §15 não alterada;
- propõe Gate B′ entre B e C;
- CODIGO fecharia primeiro;
- SIMULACAO migraria para Gate G;
- CRIANCA migraria para Gate J;
- regra proposta: nenhuma candidata CODIGO aberta quando Gate J começar.

Gate B′ **não está ativo** e não autoriza reparos.

## 7. Disciplina de evidência e vias

Classes §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Na Issue #48:

- suspeita curricular nasce `CANDIDATA`;
- fato observável não transforma automaticamente hipótese em dívida;
- lote audit-only não corrige sua descoberta;
- mudança de estado exige evidência adequada.

Vias:

- **CODIGO** — prova por fonte executável/cânone/DAG/mastery;
- **SIMULACAO** — campanha Aprendiz Simulado / Gate G;
- **CRIANCA** — observação infantil / Gate J.

Via é requisito de evidência, não autorização de gate futuro.

## 8. Classes estruturais vigentes após AL

### CLASS-001 — gerador declara `lvl` e não consome

- `CONFIRMADO-ATUAL`;
- via CODIGO;
- 18 geradores legados inventariados;
- gate estático/AST proposto, não implementado.

### CLASS-002 — conformance FichaCompetencia ↔ DAG

- estado: **FECHADA PARA DESCOBERTA / inventário registrado**;
- §0.2: `CONFIRMADO-ATUAL`;
- via CODIGO;
- não reparada;
- inventário simples: 8 casos; 10 divergências de campo em 9 competências quando GM.04 é contado com seus dois campos;
- AL não adicionou caso.

### DECISAO-001 — GM.04

- estado `PENDENTE-DE-DECISÃO-HUMANA`;
- fato de fonte `CONFIRMADO-ATUAL`;
- via técnica posterior CODIGO, bloqueada por decisão humana;
- diagnóstico: ficha GM.04 contém micro de avanço em frações de 15 minutos, semanticamente pertencente a GM.06;
- se aprovada a direção registrada: corrigir escopo → metadata → verificar cobertura GM.06;
- nenhuma decisão/correção executada.

### CLASS-003 — caso único por nível sob mastery repetida

- `CONFIRMADO-ATUAL`;
- via CODIGO;
- membros: N4.10/F69, N4.11/F70, N4.12/F71, N5.04/F74, N5.05/F86, N7.01/F84, N7.02/F85, **AL.06/F77, AL.07/F89**.

### CLASS-004 — viés posicional em comparações

- `CONFIRMADO-ATUAL`;
- via CODIGO;
- membros: N5.03/F73, N6.01/F75, N7.01/F84;
- AL não adicionou membro.

### CLASS-005 — comparador aleatório em `sort`

- estado atual: **FECHADO-COM-RECIBO**;
- via CODIGO;
- gate atual varre todo `src/` e está verde;
- reparo foi externo ao Gate B; contagem de correções do Gate B continua zero.

### CLASS-006 — posição invariável do gabarito no fluxo fresco

- `CONFIRMADO-ATUAL`;
- via CODIGO;
- reparo parcial nominal de 25 IDs;
- N7.01/N7.02 e AL.06/AL.07 estão cobertos e revalidados;
- membros residuais observados no Lote 8: **AL.01-L5, AL.03-L2–L4, AL.05 e AL.08**;
- AL.03 demonstra que “correta sempre primeiro” era uma formulação estreita: correta sempre segunda também é vazamento posicional;
- gate futuro deve descobrir contratos de múltipla escolha por propriedade, não por lista nominal.

## 9. Candidatas/reclassificações mais recentes

### GAP-025 — F76/N6.02

- `CANDIDATA` / `HIPÓTESE-A-PROVAR`, CODIGO;
- `revelacaoProgressiva: true` normativa não aparece executável.

### GAP-036 — N6.02 L3 reagrupa antes do L4

- `HIPÓTESE-A-PROVAR`, CODIGO.

### GAP-037 — N6.03 não exige equivalência das quatro notações

- `HIPÓTESE-A-PROVAR`, CODIGO.

### GAP-038 — N6.03 L4 pode avançar sem acréscimo

- `HIPÓTESE-A-PROVAR`, CODIGO.

### GAP-039 — N7.01 troca localização na reta por reconhecimento

- `HIPÓTESE-A-PROVAR`, CODIGO.

### GAP-040 — N7.02 L4 não materializa remoção de dívida

- `HIPÓTESE-A-PROVAR`, CODIGO.

### GAP-041 — AL.05/F46 construção do equilíbrio trocada por escolha de peso

- `CANDIDATA` / `HIPÓTESE-A-PROVAR`;
- tipos INTERAÇÃO-AUSENTE + PRODUÇÃO-TROCADA-POR-RECONHECIMENTO + REPRESENTAÇÃO-DIVERGENTE;
- via CODIGO.

### GAP-042 — AL.06/F77 transformação da prioridade não materializada

- `CANDIDATA` / `HIPÓTESE-A-PROVAR`;
- tipos REPRESENTAÇÃO-AUSENTE + RESOLUÇÃO-DIVERGENTE + CONTEÚDO-SÓ-EXPLICADO;
- via CODIGO.

### GAP-043 — AL.07/F89 produção/generalização trocada por seleção

- `CANDIDATA` / `HIPÓTESE-A-PROVAR`;
- tipos PRODUÇÃO-TROCADA-POR-RECONHECIMENTO + INTERAÇÃO-AUSENTE + TRANSFERÊNCIA-INSUFICIENTE;
- via CODIGO.

### GAP-044 — AL.08/F90 transformação física sincronizada ausente

- `CANDIDATA` / `HIPÓTESE-A-PROVAR`;
- tipos REPRESENTAÇÃO-DIVERGENTE + RESOLUÇÃO-DIVERGENTE;
- via CODIGO;
- seleção da transformação por toque existe e foi explicitamente preservada como refutação parcial.

## 10. Estado acumulado do Gate B após AL

Sem promover hipótese a dívida:

- competências auditadas: **64/90**;
- candidatas individuais: **39**;
- vias individuais: **34 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais inventariadas: **CLASS-001 a CLASS-006**;
- CLASS-005 fechada com recibo após reparo externo; CLASS-006 ainda atual/parcial;
- `DECISAO-001/GM.04` separada e pendente humana;
- correções executadas pelo Gate B: **0**.

A conta parte de 35 após N7 e adiciona `GAP-041`–`GAP-044`, todas CODIGO.

## 11. Resíduos preservados

- 15 competências legado — `CONFIRMADO-ATUAL`;
- 11 divergências ficha↔screen — `CONFIRMADO-ATUAL`;
- `Moedas` / GM.03 — `CONFIRMADO-ATUAL`;
- hardening/performance + warning de bundle — `CONFIRMADO-ATUAL`;
- Issue #48 — `DÍVIDA-REGISTRADA` como registro vivo;
- Observatório / Research Foundry — `DÍVIDA-REGISTRADA`, subordinado à Issue #47 e sem autorização de implementação.

## 12. Gate J — linha de base não renovável

Antes do primeiro uso sério por cada criança, permanece a precondição de linha de base **fora do motor adaptativo, em papel**.

A obrigação está registrada; a coleta não foi iniciada no Gate B.

## 13. Hierarquia de autoridade

1. GitHub remoto e fontes executáveis do HEAD;
2. Issue #47;
3. documentos canônicos especializados;
4. Issue #48;
5. `ROADMAP_90_90_CHILD_READY.md`;
6. auditorias dos lotes;
7. histórico somente após revalidação.

Gate B′ continua proposta, não autoridade nova.

## 14. Regras invioláveis do PR #35

- GitHub remoto vence memória/checkpoint;
- `main` não é área de trabalho;
- PR permanece draft + open + unmerged;
- nunca ready/automerge/merge;
- não tocar Creature Engine/Tamagotchi;
- um único writer ativo;
- não misturar recibos entre SHAs;
- não relaxar testes, P13, Matrix, Radar, DAG, contratos ou sondas;
- erro motor não vira misconception conceitual;
- RT conceitual não compra/reprova mastery salvo fluência explícita;
- ajuda/resolução assistida não compra mastery independente;
- Gate B serializado por domínio;
- lote audit-only não implementa a descoberta;
- não implementar/reparar CLASS-001–006 ou GAPs durante auditoria;
- Gate B′ permanece proposta;
- Gates C–J não iniciados.

## 15. Condição de parada do Gate B · Lote 8/AL

Este lote deve conter somente:

- auditoria/documentação de AL;
- atualização documental da porta/índice;
- revalidação do reparo externo de CLASS-005/006 sem novo reparo;
- registro de CLASS-003 ampliada, CLASS-006 residual e GAP-041–044 na Issue #48;
- refutações registradas para AL.02 e para a formulação excessiva de AL.08;
- zero correções funcionais.

Exigir **CI success + Certificação transversal success 9/9 no mesmo SHA final** do snapshot documental do Lote 8. Depois dos dois verdes:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` intocada;
3. reportar classes separadas dos individuais;
4. reportar AL por classe e via;
5. registrar que faltam **GE, GM e PE**, sem iniciar nenhum;
6. **PARAR**.

Não corrigir CLASS-001–006, DECISAO-001 ou GAPs. Não iniciar GE, GM, PE, Gate C, Gate G, Gate J, Observatório ou outra frente.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`;
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`;
- o mesmo Ledger está em v0.99 e contém D066, referente ao manifesto histórico;
- status: `PRE-CANONICAL` · `implementation_authorized: false`.

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada entra no runtime sem autorização explícita conforme `00_governance/WORKFLOW.md`. A frente não altera onda, canário, Matrix, ledger curricular nem runtime map.

**D067:** Issue #47 é a autoridade do pós-90/90. O Observatório é material subordinado às gates de #47 e não abre fila paralela; onde houver divergência, #47 vence. A contribuição exclusiva preservada é a medição de aprendizagem fora do motor adaptativo, incluindo a linha de base anterior ao primeiro uso sério.