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

- escopo `N5.01–N5.05`, **5/5**;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_5_N5_AUDITORIA.md`;
- proveniência **5 Composer / 0 legado / 0 fallback**;
- auditoria somente, zero correções;
- CLASS-002 reconciliada globalmente e fechada para descoberta;
- DECISAO-001/GM.04 isolada;
- CLASS-003 ampliada com N5.04 e N5.05;
- candidatas novas **GAP-033–GAP-035**;
- vias N5: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- runtime/Matrix/canário/DAG intocados.

O snapshot documental deste Lote 5 exige CI + Certificação transversal verdes no mesmo SHA antes da parada final.

**Próximo domínio natural, não iniciado:** N6.

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
- `GrafoSaga.nodes` é `grafoSaga` de `src/curriculum/grafo_saga.ts`;
- ficha não participa do unlock.

Portanto prereqs reduzidos na ficha **não liberam conteúdo cedo hoje**.

A varredura externa indicou 10 divergências de campo; todos os campos nominados foram revalidados. Como GM.04 possui dois campos divergentes e foi isolada, CLASS-002 simples contém **8 casos**:

- prereqs/subconjunto: N3.10, N4.03, N4.06, N4.07, N4.08;
- faixa: N1.08, N1.12, N2.07.

Correção de contagem: são 10 campos em 9 competências totais; removendo GM.04 restam 8 casos simples, não 9.

GAP-007, GAP-021 e GAP-026 foram absorvidos por reclassificação.

Teste proposto, não implementado: comparar ficha e DAG por ID, igualdade de prereqs e política explícita de faixa, falhando com `ID/campo/ficha/DAG`; nenhuma allowlist silenciosa.

Registro: Issue #48 comentário `5342994164`.

## 7. DECISAO-001 — GM.04

**Estado:** `PENDENTE-DE-DECISÃO-HUMANA`.  
**Fato:** `CONFIRMADO-ATUAL`.  
**Via técnica posterior:** CODIGO, bloqueada por decisão humana.

- ficha: faixa F2, prereqs `[N2.01, AL.01]`;
- DAG: faixa F1, prereqs `[N1.06]`;
- prereqs disjuntos, interseção vazia;
- divergência simultânea de faixa.

Pergunta pendente: qual tese pedagógica deve governar o momento de entrada de GM.04? Nenhum lado foi escolhido.

## 8. CLASS-003 — caso único por nível sob mastery repetida

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros revalidados até N5:

- N4.10/F69;
- N4.11/F70;
- N4.12/F71;
- **N5.04/F74**;
- **N5.05/F86**.

N5.04 usa exatamente um caso por nível em `CASOS`; N5.05 também devolve um cenário determinístico por nível. A causa pertence à classe, não a GAPs separados.

## 9. Candidatas N5

### GAP-033 — N5.02 · reta parcial estreita

- classe `HIPÓTESE-A-PROVAR`;
- tipos VARIEDADE-DE-MASTERY + TRANSFERÊNCIA-AUSENTE;
- via CODIGO;
- L4 só usa 1/4 ou 3/4 apesar de representar “estimar” em reta com apenas 0, 1/2 e 1 nomeados.

### GAP-034 — N5.03 · viés posicional de resposta

- classe `HIPÓTESE-A-PROVAR`;
- tipos VARIEDADE-DE-MASTERY + viés posicional;
- via CODIGO;
- L3: direita sempre maior; L4: esquerda sempre maior; L5 sem permutação de lados.

### GAP-035 — N5.03→N5.04 · transferência de equivalência para operação

- classe `HIPÓTESE-A-PROVAR`;
- tipos TRANSFERÊNCIA-AUSENTE + MICRONÍVEL-AUSENTE;
- via CODIGO;
- F74 opera somente denominadores iguais; nenhum item N5 exige reescrever duas frações com denominadores diferentes como equivalentes antes de somar/subtrair.

## 10. Estado acumulado após N5

- competências auditadas: **50/90**;
- candidatas individuais: **31**;
- vias individuais: **26 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes: CLASS-001, CLASS-002, CLASS-003;
- DECISAO-001 separada;
- correções Gate B: 0.

A contagem já remove GAP-007/GAP-021/GAP-026 absorvidos e adiciona GAP-033–035.

## 11. Dívidas preservadas

| Item | Classe |
|---|---|
| 15 competências legado | CONFIRMADO-ATUAL |
| 11 divergências ficha↔screen | CONFIRMADO-ATUAL |
| Moedas / GM.03 | CONFIRMADO-ATUAL |
| hardening/performance + warning bundle | CONFIRMADO-ATUAL |
| Issue #48 | DÍVIDA-REGISTRADA como registro vivo |
| Observatório / Foundry | DÍVIDA-REGISTRADA, subordinado a #47 |

## 12. Gate J — linha de base

**DÍVIDA-REGISTRADA**: antes do primeiro uso sério por cada criança, coletar linha de base fora do motor adaptativo, em papel. A coleta não foi iniciada.

## 13. Autoridades

- Issue #47: governança/Child-Ready;
- PROMPT_DE_RETOMADA.md: estado operacional;
- Issue #48: gaps/classes Gate B;
- auditorias Lotes 1–5: evidência de escopo;
- este roadmap: índice;
- fontes executáveis/canônicas: autoridade técnica específica;
- Foundry: apoio subordinado a #47.

## 14. Governança vigente

- não tocar `main`;
- PR #35 permanece open + draft + unmerged;
- não ready/automerge/merge;
- Gate B serializado por domínio;
- audit-only não corrige achado;
- runtime/Matrix/canário/DAG intocados;
- não implementar gate CLASS-001 nem ficha↔DAG neste lote;
- não ativar Gate B′;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de CI + transversal verdes no mesmo SHA do Lote 5, confirmar governança e **parar**. N6 exige nova autorização explícita.