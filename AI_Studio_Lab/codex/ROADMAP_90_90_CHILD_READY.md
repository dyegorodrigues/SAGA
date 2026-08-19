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
- snapshot final `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`;
- proveniência **4 Composer / 0 legado / 0 fallback**;
- auditoria somente, zero correções;
- prereqs/faixas N6 coerentes ficha↔DAG;
- diagnóstico GM.04 registrado na Issue #48 comentário `5346694044`, estado humano inalterado;
- CLASS-004 criada para viés posicional comparativo, absorvendo GAP-034;
- GAP-025 ampliado para F76/N6.02;
- candidatas novas **GAP-036–GAP-038**;
- vias novas N6: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- N6.04 sem candidata nova;
- CI `32291510503` success;
- transversal `32291509536` success 9/9;
- runtime/Matrix/canário/DAG intocados.

### Lote 7 — N7

- escopo `N7.01–N7.02`, **2/2**;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_7_N7_AUDITORIA.md`;
- HEAD de entrada `3c2ed8e44e096df154de3e9f89dbdfb21273c3c4`;
- proveniência **2 Composer / 0 legado / 0 fallback**;
- auditoria somente, zero correções;
- prereqs/faixas N7 coerentes ficha↔DAG;
- CLASS-003 ampliada com N7.01/F84 e N7.02/F85;
- CLASS-004 agravada em N6.01/F75: ramo `"direita"` inalcançável no corpus L4 atual; caminho de revisão L5 revalidado com Fisher–Yates correto;
- CLASS-004 ampliada com N7.01/F84 L2;
- CLASS-005 criada para comparador aleatório em `sort`: **27 ocorrências** atuais em `src/`, não 26; distribuição enviesada reproduzida localmente;
- CLASS-006 criada: **10/10** questões frescas canônicas N7 têm gabarito como primeira alternativa;
- candidatas novas **GAP-039–GAP-040**, ambas CODIGO;
- falsas suspeitas de destaque do gabarito via `target` na reta refutadas (`pulsarTarget=false`);
- runtime/Matrix/canário/Radar/DAG intocados;
- gates estruturais somente propostos, não implementados.

O snapshot documental final do Lote 7 exige CI + Certificação transversal verdes **no mesmo SHA final**. Os recibos devem ser registrados na Issue #48 sem novo commit.

**Próximo domínio natural, não iniciado:** `AL`.

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
- N5.05/F86;
- **N7.01/F84**;
- **N7.02/F85**.

N6 não adicionou membro. N7 adicionou os dois contratos especializados: ambos têm um único estímulo determinístico por nível sob mastery `3/3 × 2 sessões`.

## 9. CLASS-004 — viés posicional de gabarito comparativo

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros observados:

- N5.03/F73 — L3 direita sempre maior, L4 esquerda sempre maior, L5 sem permutação no corpus de origem;
- N6.01/F75 — os quatro pares L4 têm a esquerda como maior; o ternário de resposta nunca alcança `"direita"` com o corpus atual;
- **N7.01/F84** — L2 possui apenas `−5 × −2`, com o maior sempre no segundo operando.

GAP-034 foi absorvido/reclassificado nesta classe, sem correção.

Refutação preservada: no caminho de revisão do banco em `GameLoop.tsx`, opções são embaralhadas por Fisher–Yates correto. Isso refuta a hipótese de preservação sistemática da posição original nesse caminho específico, sem generalizar para questões frescas.

Teste proposto, não implementado: exigir ambos os lados como resposta correta no corpus e verificar simetria ao trocar operandos.

## 10. CLASS-005 — embaralhamento enviesado por comparador aleatório

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

No HEAD de entrada do Lote 7 foram confirmadas **27 ocorrências** de `.sort(() => Math.random() - 0.5)` em `src/`:

- Composer: 18;
- generatorsVisual: 3;
- contagem20Contract: 2;
- Dojo add/sub/mul/div: 1 cada.

A contagem externa de 26 estava um abaixo; seus subtotais já somavam 27.

Medição independente de 200 mil permutações, array de quatro elementos:

- comparador aleatório: elemento 0 na posição 0 = ~35,93%; pior desvio ~15,49 p.p.;
- Fisher–Yates: pior desvio ~0,18 p.p.

Gate proposto, não implementado: proibir em `src/` comparador de `Array.sort` que consuma `Math.random()`, reportar arquivo/linha e exigir embaralhamento uniforme quando a posição não for semanticamente intencional. Casos em que posição é parte do diagnóstico devem ser explicitamente preservados, nunca allowlistados em silêncio.

**Prioridade recomendada:** antes do Gate J. Isso não ativa Gate B′ nem autoriza correção durante Gate B audit-only.

## 11. CLASS-006 — gabarito sempre primeiro no fluxo fresco N7

**Classe:** `CONFIRMADO-ATUAL`.  
**Via:** CODIGO.

Membros observados:

- N7.01/F84;
- N7.02/F85.

Nos dois contratos `opts(...)` serializa `[correta, ...erradas]` sem shuffle. Os palcos preservam essa ordem; `FichaRenderer` não reordena; e o `GameLoop` retorna `track.gen(...)` fresco sem embaralhar. Resultado: **10/10** casos canônicos frescos de N7 têm a correta na primeira posição.

O banco de revisão pode embaralhar por Fisher–Yates e não refuta o vazamento do fluxo fresco.

Gate de distribuição posicional de gabarito proposto, não implementado.

## 12. Candidatas/reclassificações mais recentes

### GAP-025 — ampliado para F76/N6.02

- classe `HIPÓTESE-A-PROVAR`;
- via CODIGO;
- F76 está na lista normativa de `revelacaoProgressiva: true`, mas o eixo não aparece executável e o palco expõe conta vertical + Quadrado100 simultaneamente.

### GAP-036 — N6.02 L3 contém reagrupamento antes do L4

- classe `HIPÓTESE-A-PROVAR`;
- tipos SALTO-DE-DIFICULDADE + MICRONÍVEL-AUSENTE + RESOLUÇÃO-INSUFICIENTE;
- via CODIGO.

### GAP-037 — N6.03 não exige equivalência das quatro notações

- classe `HIPÓTESE-A-PROVAR`;
- tipos CONTEÚDO-SÓ-EXPLICADO + REPRESENTAÇÃO-AUSENTE + TRANSFERÊNCIA-AUSENTE + MISCONCEPTION-NÃO-COBERTA;
- via CODIGO.

### GAP-038 — N6.03 L4 pode avançar sem acréscimo

- classe `HIPÓTESE-A-PROVAR`;
- tipo VARIEDADE-DE-MASTERY;
- via CODIGO.

### GAP-039 — N7.01 troca localização na reta por reconhecimento em botões

- classe `HIPÓTESE-A-PROVAR`;
- tipos REPRESENTAÇÃO-AUSENTE + INTERAÇÃO-AUSENTE + PRODUÇÃO-TROCADA-POR-RECONHECIMENTO;
- via CODIGO;
- cânone F84 exige `InteractiveNumberLine`, marcador arrastável e contexto acoplado; palco atual bloqueia a reta e responde por múltipla escolha.

### GAP-040 — N7.02 L4 não materializa remoção de dívida exigida pelo cânone v3.1

- classe `HIPÓTESE-A-PROVAR`;
- tipos REPRESENTAÇÃO-DIVERGENTE + RESOLUÇÃO-DIVERGENTE;
- via CODIGO;
- semântica verbal de cancelar dívida existe, mas não há animação de remoção de dívida/peso e a resolução ainda codifica movimento na reta.

## 13. Estado acumulado após N7

- competências auditadas: **56/90**;
- candidatas individuais: **35**;
- vias individuais: **30 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes: CLASS-001, CLASS-002, CLASS-003, CLASS-004, CLASS-005, CLASS-006;
- DECISAO-001 separada e pendente humana;
- correções Gate B: 0.

A contagem já desconta GAP-007/GAP-021/GAP-026 absorvidos por CLASS-002 e GAP-034 absorvido por CLASS-004, inclui GAP-036–038 e adiciona GAP-039–040.

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
- auditorias Lotes 1–7: evidência de escopo;
- este roadmap: índice;
- fontes executáveis/canônicas: autoridade técnica específica;
- Foundry: apoio subordinado a #47.

## 17. Governança vigente

- não tocar `main`;
- PR #35 permanece open + draft + unmerged;
- não ready/automerge/merge;
- Gate B serializado por domínio;
- audit-only não corrige achado;
- runtime/Matrix/canário/Radar/DAG intocados;
- não implementar gates estruturais neste lote;
- não ativar Gate B′;
- não iniciar Gates C–J;
- não tocar Creature Engine/Tamagotchi;
- CI verde isolado nunca significa Child-Ready.

Depois de CI + transversal verdes no mesmo SHA final do Lote 7, confirmar governança e **parar**. `AL` exige nova autorização explícita.