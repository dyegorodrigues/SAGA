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

Issue #47 comentário `5342129190` propõe fase entre B e C para fechar primeiro itens via CODIGO, migrar SIMULACAO para G e CRIANCA para J e não iniciar J com candidatas CODIGO abertas.

A §15 não foi alterada; Gate B′ não foi ativado.

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
- CLASS-001: 18 geradores com `lvl` morto, CONFIRMADO-ATUAL, CODIGO;
- 7 candidatas originais GAP-022–028;
- CI `32218633036` + transversal `32218633032` success 9/9.

GAP-026 foi depois absorvido por CLASS-002.

### Lote 4 — N4

- 12/12;
- documento `GATE_B_LOTE_4_N4_AUDITORIA.md`;
- snapshot `4a2ad53ca31008bce66e25730b3bf37b6d11e395`;
- 10 Composer / 2 legado;
- CLASS-002 + CLASS-003 abertas/revalidadas;
- GAP-029–032;
- CI `32254266799` success;
- transversal `32254266804` success 9/9.

### Lote 5 — N5

- 5/5;
- documento `GATE_B_LOTE_5_N5_AUDITORIA.md`;
- snapshot `fac6abb79200e3ae45493d17ea09f9bca41689e4`;
- 5 Composer / 0 legado / 0 fallback;
- CLASS-002 reconciliada/fechada para descoberta;
- DECISAO-001/GM.04 isolada;
- CLASS-003 ampliada com N5.04/N5.05;
- GAP-033–035 originais;
- CI `32260196527` success;
- transversal `32260196519` success 9/9.

GAP-034 foi depois absorvido por CLASS-004 no Lote 6.

### Lote 6 — N6

- escopo `N6.01–N6.04`, **4/4**;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_6_N6_AUDITORIA.md`;
- proveniência **4 Composer / 0 legado / 0 fallback**;
- auditoria somente, zero correções;
- prereqs/faixas N6 coerentes ficha↔DAG;
- diagnóstico GM.04 registrado na Issue #48 comentário `5346694044`, estado humano inalterado;
- CLASS-004 criada para viés posicional comparativo, absorvendo GAP-034;
- GAP-025 ampliado para F76/N6.02;
- candidatas novas **GAP-036–GAP-038**;
- vias novas N6: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- N6.04 sem candidata nova;
- runtime/Matrix/canário/DAG intocados.

Registro de classes/candidatas N6 na Issue #48: `5346763254`.

O snapshot documental deste Lote 6 exige CI + Certificação transversal verdes no mesmo SHA antes da parada final.

**Próximo domínio natural, não iniciado:** `N7`.

## 5. CLASS-001 — contrato estrutural de nível

- classe `CONFIRMADO-ATUAL`;
- via CODIGO;
- 18 geradores afetados: 4 `generators.ts`, 4 `generatorsF1.ts`, 4 `generatorsF2.ts`, 6/6 `generatorsVisual.ts`;
- gate estático/AST proposto, não implementado.

## 6. CLASS-002 — conformance FichaCompetencia ↔ DAG

**Estado:** **FECHADA PARA DESCOBERTA**, não reparada.  
**Classe §0.2:** `CONFIRMADO-ATUAL`.  
**Via:** `CODIGO`.

A verificação independente de unlock foi confirmada:

- `unlockEngine.ts` importa `GrafoSaga`;
- percorre `GrafoSaga.nodes`;
- usa `node.prereqs`;
- ficha não participa do unlock.

Portanto prereqs reduzidos na ficha não liberam conteúdo cedo hoje.

A varredura reconciliada possui **10 divergências de campo em 9 competências**. `GM.04` possui dois campos e foi isolada; CLASS-002 simples contém **8 casos**:

- prereqs/subconjunto: N3.10, N4.03, N4.06, N4.07, N4.08;
- faixa: N1.08, N1.12, N2.07.

GAP-007, GAP-021 e GAP-026 foram absorvidos por reclassificação.

Teste proposto, não implementado: comparar ficha e DAG por ID, igualdade de prereqs e política explícita de faixa, falhando com `ID/campo/ficha/DAG`; nenhuma allowlist silenciosa.

Registro: Issue #48 comentário `5342994164`.

## 7. DECISAO-001 — GM.04

**Estado:** `PENDENTE-DE-DECISÃO-HUMANA`.  
**Fato:** `CONFIRMADO-ATUAL`.  
**Via técnica posterior:** CODIGO, bloqueada por decisão humana.

Diagnóstico externo registrado em `5346694044`:

- metadata divergente é sintoma;
- ficha GM.04 contém micro de avanço em frações de 15 minutos, que pertence semanticamente a GM.06;
- GM.06 já existe como Horas e minutos/duração, F2, prereqs `[GM.04, AL.03]`;
- recomendação externa: escopo nuclear de GM.04 = hora cheia, `F1`, `[N1.06]`; minutos ficam em GM.06;
- se aprovado: corrigir escopo primeiro → metadata depois → verificar cobertura GM.06;
- alinhar só metadata é proibido pela ordem registrada;
- nenhuma decisão foi tomada e nenhum passo foi executado.

Quando o domínio GM for auditado, este diagnóstico é entrada obrigatória.

## 8. CLASS-003 — caso único por nível sob mastery repetida

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros revalidados:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- N5.04/F74;
- N5.05/F86.

Nenhum contrato N6 entrou na classe: todos os quatro possuem famílias de casos por nível.

## 9. CLASS-004 — viés posicional de gabarito comparativo

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros observados:

- N5.03/F73 — L3 direita sempre maior, L4 esquerda sempre maior, L5 sem permutação;
- N6.01/F75 — os quatro pares L4 têm a esquerda como maior.

GAP-034 foi absorvido/reclassificado nesta classe, sem correção.

Teste proposto, não implementado: exigir ambos os lados como resposta correta no corpus e verificar simetria ao trocar operandos.

## 10. Candidatas/reclassificações N6

### GAP-025 — ampliado para F76/N6.02

- classe `HIPÓTESE-A-PROVAR`;
- via CODIGO;
- F76 está na lista normativa de `revelacaoProgressiva: true`, mas o eixo não aparece executável e o palco expõe conta vertical + Quadrado100 simultaneamente.

### GAP-036 — N6.02 L3 contém reagrupamento antes do L4

- classe `HIPÓTESE-A-PROVAR`;
- tipos SALTO-DE-DIFICULDADE + MICRONÍVEL-AUSENTE + RESOLUÇÃO-INSUFICIENTE;
- via CODIGO;
- 2/3 casos L3 exigem empréstimo sem flag/andaime de reagrupamento.

### GAP-037 — N6.03 não exige equivalência das quatro notações

- classe `HIPÓTESE-A-PROVAR`;
- tipos CONTEÚDO-SÓ-EXPLICADO + REPRESENTAÇÃO-AUSENTE + TRANSFERÊNCIA-AUSENTE + MISCONCEPTION-NÃO-COBERTA;
- via CODIGO;
- cânone ancora `25% = 25/100 = 0,25 = 1/4`, mas a tarefa executável observada não exige essa ponte completa.

### GAP-038 — N6.03 L4 pode avançar sem acréscimo

- classe `HIPÓTESE-A-PROVAR`;
- tipo VARIEDADE-DE-MASTERY;
- via CODIGO;
- L4 sorteia 2 descontos e 1 acréscimo sem diversidade obrigatória.

## 11. Estado acumulado após N6

- competências auditadas: **54/90**;
- candidatas individuais: **33**;
- vias individuais: **28 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes: CLASS-001, CLASS-002, CLASS-003, CLASS-004;
- DECISAO-001 separada;
- correções Gate B: 0.

A contagem já desconta GAP-007/GAP-021/GAP-026 absorvidos por CLASS-002 e GAP-034 absorvido por CLASS-004, e inclui GAP-036–038.

## 12. Dívidas preservadas

| Item | Classe |
|---|---|
| 15 competências legado | CONFIRMADO-ATUAL |
| 11 divergências ficha↔screen | CONFIRMADO-ATUAL |
| Moedas / GM.03 | CONFIRMADO-ATUAL |
| hardening/performance + warning bundle | CONFIRMADO-ATUAL |
| Issue #48 | DÍVIDA-REGISTRADA como registro vivo |
| Observatório / Foundry | DÍVIDA-REGISTRADA, subordinado a #47 |

## 13. Gate J — linha de base

**DÍVIDA-REGISTRADA**: antes do primeiro uso sério por cada criança, coletar linha de base fora do motor adaptativo, em papel. A coleta não foi iniciada.

## 14. Autoridades

- Issue #47: governança/Child-Ready;
- `PROMPT_DE_RETOMADA.md`: estado operacional;
- Issue #48: gaps/classes Gate B;
- auditorias Lotes 1–6: evidência de escopo;
- este roadmap: índice;
- fontes executáveis/canônicas: autoridade técnica específica;
- Foundry: apoio subordinado a #47.

## 15. Governança vigente

- não tocar `main`;
- PR #35 permanece open + draft + unmerged;
- não ready/automerge/merge;
- Gate B serializado por domínio;
- audit-only não corrige achado;
- runtime/Matrix/canário/DAG intocados;
- não implementar gates estruturais neste lote;
- não ativar Gate B′;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de CI + transversal verdes no mesmo SHA do Lote 6, confirmar governança e **parar**. N7 exige nova autorização explícita.