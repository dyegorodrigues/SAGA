# ROADMAP 90/90 → CHILD-READY — Índice executivo

**Status:** ATIVO — Integração Sistêmica e Child-Ready  
**Autoridade de fase:** Issue #47 — `Integração Sistêmica e Child-Ready`  
**Estado:** Gate A fechado; Gate B aberto em lotes; Gates C–J não iniciados.

Este arquivo é índice executivo. GitHub remoto, Issue #47, Issue #48 e fontes executáveis/canônicas especializadas vencem este resumo em caso de divergência.

## 1. Modo operacional

A Fábrica Curricular Principal terminou em `fallback=0` e 90/90 competências servidas. Isso inicia **Integração Sistêmica e Child-Ready**, mas não declara o produto Child-Ready.

## 2. Gates A–J

| Gate | Estado | Autoridade |
|---|---|---|
| A — fechamento curricular 90/90 | **FECHADO-COM-RECIBO** | Matrix + W50 + workflows |
| B — mega-auditoria curricular | **ABERTO EM LOTES** | Issue #47 §3 + Issue #48 + auditorias |
| C — Player/Tutor | NÃO INICIADO | Issue #47 §4 |
| D — orquestração adaptativa | NÃO INICIADO | Issue #47 §5 |
| E — telemetria/dados | NÃO INICIADO | Issue #47 §6 |
| F — UX/UI | NÃO INICIADO | Issue #47 §7 |
| G — Aprendiz Simulado | NÃO INICIADO | Issue #47 §8 |
| H — E2E | NÃO INICIADO | Issue #47 §9 |
| I — hardening/release | NÃO INICIADO | Issue #47 §10 |
| J — piloto infantil | NÃO INICIADO | Issue #47 §11 + linha de base |

Gate B é serializado por domínio; nenhum lote autoriza automaticamente o seguinte.

### Proposta Gate B′ — NÃO ATIVA

Issue #47 comentário `5342129190` propõe fase entre B e C para fechar primeiro itens via CODIGO, migrar SIMULACAO para G e CRIANCA para J e não iniciar J com candidatas CODIGO abertas. A §15 não foi alterada; Gate B′ não foi ativado.

## 3. Gate A — recibos

- técnico W50 `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` success;
- transversal `32196855356` success 9/9;
- Matrix: 75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências;
- documental `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` + transversal `32197697050` success 9/9.

## 4. Gate B — lotes

### Lote 1 — N1

- 13/13;
- snapshot `ad1b239457371a1f411001fd8521984eeadb94fe`;
- 10 candidatas originais GAP-002–011;
- CI `32209683689` + transversal `32209683699` success 9/9.

GAP-007 foi depois absorvido por CLASS-002.

### Lote 2 — N2

- 7/7;
- snapshot `a5101b362ae6d4896258f994ed14145b37950b98`;
- 10 candidatas originais GAP-012–021;
- CI `32216926616` + transversal `32216926610` success 9/9.

GAP-021 foi depois absorvido por CLASS-002.

### Lote 3 — N3

- 13/13;
- snapshot `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`;
- CLASS-001 criada: 18 geradores com `lvl` morto, CONFIRMADO-ATUAL, CODIGO;
- 7 candidatas originais GAP-022–028;
- CI `32218633036` + transversal `32218633032` success 9/9.

GAP-026 foi depois absorvido por CLASS-002.

### Lote 4 — N4

- 12/12;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_4_N4_AUDITORIA.md`;
- snapshot `4a2ad53ca31008bce66e25730b3bf37b6d11e395`;
- 10 Composer / 2 legado;
- CLASS-002 + CLASS-003 abertas/revalidadas;
- GAP-029–032;
- CI `32254266799` + transversal `32254266804` success 9/9.

### Lote 5 — N5

- 5/5;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_5_N5_AUDITORIA.md`;
- snapshot `fac6abb79200e3ae45493d17ea09f9bca41689e4`;
- 5 Composer / 0 legado / 0 fallback;
- CLASS-002 reconciliada/fechada para descoberta;
- DECISAO-001/GM.04 isolada;
- CLASS-003 ampliada com N5.04/N5.05;
- GAP-033–035 originais;
- CI `32260196527` + transversal `32260196519` success 9/9.

GAP-034 foi depois absorvido por CLASS-004 no Lote 6.

### Lote 6 — N6

- 4/4;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_6_N6_AUDITORIA.md`;
- snapshot `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`;
- 4 Composer / 0 legado / 0 fallback;
- CLASS-004 criada para viés posicional comparativo, absorvendo GAP-034;
- GAP-025 ampliado para F76/N6.02;
- GAP-036–038, 3 CODIGO;
- DECISAO-001/GM.04 permanece pendente humana;
- CI `32291510503` + transversal `32291509536` success 9/9;
- correções: 0.

### Lote 7 — N7

- 2/2;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_7_N7_AUDITORIA.md`;
- 2 Composer / 0 legado / 0 fallback;
- CLASS-003 ampliada com N7.01/F84 e N7.02/F85;
- CLASS-004 agravada em N6.01/F75 e ampliada com N7.01/F84 L2;
- CLASS-005 criada para comparador aleatório em `sort`;
- CLASS-006 criada para posição invariável de gabarito no fluxo fresco N7;
- GAP-039–040, 2 CODIGO;
- correções: 0.

### Infra pós-Lote 7 antes do Lote 8

Reparos externos, **não executados pelo Gate B**, foram revalidados no HEAD de entrada AL:

- `shuffle.ts` + `class005006ShufflePolicy.test.ts` preservados;
- CLASS-005: gate global em `src/` verde, sem comparador aleatório produtivo;
- CLASS-006: reparo nominal de 25 IDs; AL.06 e AL.07 entre os protegidos;
- catraca documental ampliada em `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`: descoberta automática de runtime ≥20 comentários + cânone nominal sempre protegido;
- baseline **108 arquivos / 7.468 linhas**;
- CI #1541 `32339472724` success 4/4;
- transversal #277 `32339472777` success 9/9;
- **248 arquivos / 3.463 testes**, TypeScript/build/grafo verdes;
- Matrix 75/15/0/90/11.

### Lote 8 — AL

- escopo `AL.01–AL.08`, **8/8**;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_8_AL_AUDITORIA.md`;
- HEAD de entrada `c4fd3f2c5a35a324c15a0b87414a54e68258e7d0`;
- proveniência **8 Composer / 0 legado / 0 fallback**;
- prereqs/faixas AL coerentes ficha↔DAG;
- CLASS-003 ampliada com **AL.06/F77 e AL.07/F89**;
- CLASS-004 sem membro AL novo;
- CLASS-005 revalidada **FECHADO-COM-RECIBO** no runtime atual após reparo externo;
- CLASS-006 permanece `CONFIRMADO-ATUAL`: o reparo nominal cobre AL.06/AL.07, mas deixa resíduos em **AL.01-L5, AL.03-L2–L4, AL.05 e AL.08**;
- GAP-041 — AL.05/F46: construção do equilíbrio trocada por escolha de peso;
- GAP-042 — AL.06/F77: transformação visual da prioridade/colapso não materializada;
- GAP-043 — AL.07/F89: produção/generalização trocada por seleção de expressão pronta;
- GAP-044 — AL.08/F90: transformação por toque existe, mas a transformação física sincronizada dos dois pratos não é materializada;
- GAP-041–044: **4 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- AL.01–AL.04 sem candidata individual nova;
- correções Gate B: 0;
- runtime/Matrix/canário/Radar/DAG intocados pelo lote.

O snapshot documental final do Lote 8 exige CI + Certificação transversal verdes **no mesmo SHA final**. Os recibos devem ser registrados na Issue #48 sem novo commit.

**Faltam no Gate B, nesta ordem natural e ainda não iniciados:** `GE`, `GM`, `PE`.

## 5. CLASS-001 — contrato estrutural de nível

- `CONFIRMADO-ATUAL`, CODIGO;
- 18 geradores legados afetados;
- gate estático/AST proposto, não implementado.

## 6. CLASS-002 — conformance FichaCompetencia ↔ DAG

**Estado:** **FECHADA PARA DESCOBERTA**, não reparada.  
**Classe §0.2:** `CONFIRMADO-ATUAL`.  
**Via:** `CODIGO`.

Inventário reconciliado: **10 divergências de campo em 9 competências**, com GM.04 isolada por possuir dois campos; casos simples: prereqs/subconjunto em N3.10, N4.03, N4.06, N4.07, N4.08 e faixa em N1.08, N1.12, N2.07. AL não adicionou caso.

GAP-007, GAP-021 e GAP-026 foram absorvidos por reclassificação.

## 7. DECISAO-001 — GM.04

**Estado:** `PENDENTE-DE-DECISÃO-HUMANA`.  
**Fato:** `CONFIRMADO-ATUAL`.  
**Via técnica posterior:** CODIGO, bloqueada por decisão humana.

Diagnóstico registrado: a ficha GM.04 contém micro de avanço em frações de 15 minutos, semanticamente pertencente a GM.06. Se a direção humana for aprovada, a ordem futura é escopo → metadata → cobertura GM.06. Não alinhar metadata isoladamente.

## 8. CLASS-003 — caso único por nível sob mastery repetida

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros após AL:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- N5.04/F74;
- N5.05/F86;
- N7.01/F84;
- N7.02/F85;
- **AL.06/F77**;
- **AL.07/F89**.

## 9. CLASS-004 — viés posicional em comparações

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros: N5.03/F73, N6.01/F75, N7.01/F84. AL não adicionou membro.

## 10. CLASS-005 — comparador aleatório em `sort`

**Estado atual:** `FECHADO-COM-RECIBO`.  
**Via:** CODIGO.

A classe era atual no Lote 7. O reparo externo posterior substituiu comparadores produtivos e criou gate global em `src/`. O teste está verde no HEAD de entrada AL e os dois workflows de `c4fd3f2...` passaram. A correção não foi executada pelo Gate B.

## 11. CLASS-006 — posição invariável do gabarito no fluxo fresco

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

O reparo externo cobre 25 IDs por lista nominal e corrige os membros nela presentes. O Lote 8 demonstrou que a propriedade ainda escapa fora da lista:

- AL.01/F51 L5 — correta primeira;
- AL.03/F30 L2–L4 — correta sempre segunda após ordenação numérica;
- AL.05/F46 — correta primeira;
- AL.08/F90 — correta primeira apesar de três casos por nível.

AL.06/F77 e AL.07/F89 estão entre os 25 IDs e têm posição variável no gate atual.

Direção futura já proposta: gate por descoberta/propriedade observável, reportando competência/nível/kind/posição, sem allowlist silenciosa. **Não implementado no Gate B.**

## 12. Candidatas/reclassificações mais recentes

### GAP-025 — F76/N6.02

- `HIPÓTESE-A-PROVAR`, CODIGO;
- revelação progressiva normativa não aparece executável.

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

### GAP-041 — AL.05/F46 construção do equilíbrio trocada por escolha

- `HIPÓTESE-A-PROVAR`, CODIGO;
- INTERAÇÃO-AUSENTE + PRODUÇÃO-TROCADA-POR-RECONHECIMENTO + REPRESENTAÇÃO-DIVERGENTE.

### GAP-042 — AL.06/F77 transformação visual da prioridade ausente

- `HIPÓTESE-A-PROVAR`, CODIGO;
- REPRESENTAÇÃO-AUSENTE + RESOLUÇÃO-DIVERGENTE + CONTEÚDO-SÓ-EXPLICADO.

### GAP-043 — AL.07/F89 produção/generalização trocada por seleção

- `HIPÓTESE-A-PROVAR`, CODIGO;
- PRODUÇÃO-TROCADA-POR-RECONHECIMENTO + INTERAÇÃO-AUSENTE + TRANSFERÊNCIA-INSUFICIENTE.

### GAP-044 — AL.08/F90 transformação física sincronizada ausente

- `HIPÓTESE-A-PROVAR`, CODIGO;
- REPRESENTAÇÃO-DIVERGENTE + RESOLUÇÃO-DIVERGENTE;
- escolha de transformação por toque existe e fica preservada como refutação parcial.

## 13. Estado acumulado após AL

- competências auditadas: **64/90**;
- candidatas individuais: **39**;
- vias individuais: **34 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais inventariadas: CLASS-001 a CLASS-006;
- CLASS-005 fechada com recibo após reparo externo; CLASS-006 ainda atual/parcial;
- DECISAO-001 separada e pendente humana;
- correções Gate B: 0.

A conta parte de 35 após N7 e adiciona GAP-041–044, todas CODIGO.

## 14. Dívidas preservadas

| Item | Classe |
|---|---|
| 15 competências legado | CONFIRMADO-ATUAL |
| 11 divergências ficha↔screen | CONFIRMADO-ATUAL |
| Moedas / GM.03 | CONFIRMADO-ATUAL |
| hardening/performance + warning bundle | CONFIRMADO-ATUAL |
| Issue #48 | DÍVIDA-REGISTRADA como registro vivo |
| Observatório / Foundry | DÍVIDA-REGISTRADA, subordinado a #47 |

## 15. Gate J — linha de base

**DÍVIDA-REGISTRADA**: antes do primeiro uso sério por cada criança, coletar linha de base fora do motor adaptativo, em papel. A coleta não foi iniciada.

## 16. Autoridades

- Issue #47: governança/Child-Ready;
- `PROMPT_DE_RETOMADA.md`: estado operacional;
- Issue #48: gaps/classes Gate B;
- auditorias Lotes 1–8: evidência de escopo;
- este roadmap: índice;
- fontes executáveis/canônicas: autoridade técnica específica;
- Foundry: apoio subordinado a #47.

## 17. Governança vigente e parada

- não tocar `main`;
- PR #35 permanece open + draft + unmerged;
- não ready/automerge/merge;
- Gate B serializado por domínio;
- audit-only não corrige achado;
- não implementar/reparar classes ou GAPs durante lote;
- não ativar Gate B′;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de CI + transversal verdes no mesmo SHA final do Lote 8, confirmar governança e **parar**. `GE`, `GM` e `PE` permanecem não iniciados até nova autorização explícita.