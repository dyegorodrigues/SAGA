# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional de verdade do PR #35 no pós-90/90.** GitHub remoto, fontes executáveis, Issue #47 e documentos canônicos especializados vencem memória de conversa, roadmap histórico ou checkpoint desatualizado.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada
- HEAD de entrada do Gate B · Lote 6: `fac6abb79200e3ae45493d17ea09f9bca41689e4`; o HEAD remoto vivo sempre vence este valor se avançar
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

## 4. Estado dos gates pós-90/90

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
- documento `GATE_B_LOTE_4_N4_AUDITORIA.md`;
- snapshot `4a2ad53ca31008bce66e25730b3bf37b6d11e395`;
- proveniência 10 Composer / 2 legado;
- `CLASS-002` aberta inicialmente para prereqs reduzidos em quatro fichas N4;
- `CLASS-003` aberta para N4.10/N4.11/N4.12 com um caso fixo por nível sob mastery repetida;
- 4 candidatas `GAP-029`–`GAP-032`, vias 3 CODIGO / 0 SIMULACAO / 1 CRIANCA;
- CI `32254266799` — success;
- transversal `32254266804` — success 9/9;
- correções: 0.

### Lote 5 — N5

- 5/5;
- documento `AI_Studio_Lab/codex/GATE_B_LOTE_5_N5_AUDITORIA.md`;
- snapshot `fac6abb79200e3ae45493d17ea09f9bca41689e4`;
- proveniência 5 Composer / 0 legado / 0 fallback;
- `CLASS-002` reconciliada globalmente e fechada para descoberta, não reparada;
- `DECISAO-001 / GM.04` isolada como contradição pedagógica pendente humana;
- `CLASS-003` ampliada com N5.04/F74 e N5.05/F86;
- candidatas N5 `GAP-033`–`GAP-035`;
- vias originais N5 3 CODIGO / 0 SIMULACAO / 0 CRIANCA;
- CI `32260196527` — success;
- transversal `32260196519` — success 9/9;
- correções: 0.

`GAP-034` foi posteriormente absorvido/reclassificado em `CLASS-004` no Lote 6; não foi corrigido.

### Lote 6 — N6

Escopo auditado neste snapshot: **N6.01–N6.04, 4/4**.

Documento:

`AI_Studio_Lab/codex/GATE_B_LOTE_6_N6_AUDITORIA.md`

Resultado materializado:

- proveniência: **4 Composer / 0 legado / 0 fallback**;
- prereqs/faixas N6 coerentes ficha↔DAG;
- diagnóstico externo GM.04 registrado na Issue #48 comentário `5346694044`, sem decisão nem correção;
- contagem correta CLASS-002 confirmada: 10 divergências de campo em 9 competências; classe simples = 8 casos;
- `CLASS-004` criada para viés posicional de gabarito em comparações; `GAP-034` absorvido/reclassificado;
- `GAP-025` ampliado para incluir F76/N6.02, sem novo ID;
- 3 candidatas N6 novas `GAP-036`–`GAP-038`;
- classe das três: `HIPÓTESE-A-PROVAR`;
- vias N6: **3 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- N6.04 não abriu candidata nova;
- correções: 0;
- runtime, Matrix, canário e DAG intocados;
- N7 **não iniciado**.

Registro Issue #48 do Lote 6: `5346763254`.

O snapshot documental do Lote 6 precisa de **CI success + Certificação transversal success 9/9 no mesmo SHA**. Ler os recibos do remoto no SHA exato; não reutilizar runs anteriores.

## 5. Proposta de governança — Gate B′

Issue #47 comentário `5342129190`:

- estado **PROPOSTA**;
- §15 não alterada;
- propõe Gate B′ entre B e C;
- CODIGO fecharia primeiro;
- SIMULACAO migraria para Gate G;
- CRIANCA migraria para Gate J;
- regra proposta: nenhuma candidata CODIGO aberta quando Gate J começar.

Gate B′ **não está ativo** e não autoriza reparos.

## 6. Disciplina de evidência e vias

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

## 7. Classes estruturais vigentes após N6

### CLASS-001 — gerador declara `lvl` e não consome

- `CONFIRMADO-ATUAL`;
- via `CODIGO`;
- 18 geradores: 4 `generators.ts`, 4 `generatorsF1.ts`, 4 `generatorsF2.ts`, 6/6 `generatorsVisual.ts`;
- gate AST/estático proposto, **não implementado**.

### CLASS-002 — conformance FichaCompetencia ↔ DAG

- estado: **FECHADA PARA DESCOBERTA / inventário registrado**;
- §0.2: `CONFIRMADO-ATUAL`;
- via `CODIGO`;
- **não reparada**;
- unlock precoce refutado: `unlockEngine` usa `GrafoSaga.nodes`/`node.prereqs`; ficha não participa do unlock;
- inventário simples: **8 casos**;
- contagem total: **10 divergências de campo em 9 competências**, pois GM.04 possui 2 campos;
- `GAP-007`, `GAP-021`, `GAP-026` absorvidos/reclassificados;
- teste ficha↔DAG proposto, não implementado.

### DECISAO-001 — GM.04

- estado `PENDENTE-DE-DECISÃO-HUMANA`;
- fato de fonte `CONFIRMADO-ATUAL`;
- via técnica posterior `CODIGO`, bloqueada por decisão humana;
- comentário de diagnóstico: `5346694044`;
- diagnóstico: ficha contém micro invasor de avanço em frações de 15 minutos, semanticamente pertencente a GM.06;
- recomendação externa: hora cheia em GM.04 sob N1.06/F1; minutos em GM.06;
- ordem futura, se aprovada: corrigir escopo → alinhar metadata → verificar cobertura GM.06;
- **não** alinhar metadata isoladamente;
- nenhuma decisão nem correção executada.

### CLASS-003 — caso único por nível sob mastery repetida

- `CONFIRMADO-ATUAL`;
- via `CODIGO`;
- membros revalidados: N4.10/F69, N4.11/F70, N4.12/F71, N5.04/F74, N5.05/F86;
- nenhum novo membro N6.

### CLASS-004 — viés posicional de gabarito em comparações

- `CONFIRMADO-ATUAL`;
- via `CODIGO`;
- membros observados: N5.03/F73 e N6.01/F75;
- `GAP-034` absorvido/reclassificado nesta classe;
- N6.01 L4 possui quatro pares e em todos a esquerda é maior;
- teste de equilíbrio de lados + simetria proposto, **não implementado**.

## 8. Candidatas/reclassificações vigentes do Lote 6

### GAP-025 — ampliado para F76/N6.02

- permanece `CANDIDATA` / `HIPÓTESE-A-PROVAR`;
- via CODIGO;
- F76 é normativamente obrigada a `revelacaoProgressiva: true`, mas o contrato executável observado não materializa o eixo e o palco expõe conta vertical + Quadrado100 simultaneamente.

### GAP-036 — N6.02 L3 introduz reagrupamento antes do L4

- `HIPÓTESE-A-PROVAR`;
- tipos SALTO-DE-DIFICULDADE + MICRONÍVEL-AUSENTE + RESOLUÇÃO-INSUFICIENTE;
- via CODIGO;
- 2 de 3 casos L3 exigem empréstimo, sem flag/andaime de reagrupamento; explicação explícita vive no L4.

### GAP-037 — N6.03 não exige equivalência entre as quatro notações centrais

- `HIPÓTESE-A-PROVAR`;
- tipos CONTEÚDO-SÓ-EXPLICADO + REPRESENTAÇÃO-AUSENTE + TRANSFERÊNCIA-AUSENTE + MISCONCEPTION-NÃO-COBERTA;
- via CODIGO;
- cânone F87 ancora `25% = 25/100 = 0,25 = 1/4`, mas nenhuma resposta executável observada exige a ponte completa.

### GAP-038 — N6.03 L4 pode avançar sem acréscimo

- `HIPÓTESE-A-PROVAR`;
- tipo VARIEDADE-DE-MASTERY;
- via CODIGO;
- corpus L4 = 2 descontos + 1 acréscimo, sem evidência de diversidade obrigatória.

## 9. Estado acumulado do Gate B após N6

Sem promover hipótese a dívida:

- competências auditadas: **54/90**;
- candidatas individuais: **33**;
- vias individuais: **28 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- classes estruturais: `CLASS-001`, `CLASS-002`, `CLASS-003`, `CLASS-004`;
- `DECISAO-001/GM.04` separada e pendente humana;
- correções executadas pelo Gate B: **0**.

A contagem parte de 31 após N5, absorve `GAP-034` em CLASS-004 (-1) e adiciona `GAP-036`–`GAP-038` (+3).

## 10. Resíduos preservados

- 15 competências legado — `CONFIRMADO-ATUAL`;
- 11 divergências ficha↔screen — `CONFIRMADO-ATUAL`;
- `Moedas` / GM.03 — `CONFIRMADO-ATUAL`;
- hardening/performance + warning de bundle — `CONFIRMADO-ATUAL`;
- Issue #48 — `DÍVIDA-REGISTRADA` como registro vivo;
- Observatório / Research Foundry — `DÍVIDA-REGISTRADA`, subordinado à Issue #47 e sem autorização de implementação.

## 11. Gate J — linha de base não renovável

Antes do primeiro uso sério por cada criança, permanece a precondição de linha de base **fora do motor adaptativo, em papel**.

A obrigação está registrada; a coleta não foi iniciada no Gate B.

## 12. Hierarquia de autoridade

1. GitHub remoto e fontes executáveis do HEAD;
2. Issue #47;
3. documentos canônicos especializados;
4. Issue #48;
5. `ROADMAP_90_90_CHILD_READY.md`;
6. auditorias dos lotes;
7. histórico somente após revalidação.

Gate B′ continua proposta, não autoridade nova.

## 13. Regras invioláveis do PR #35

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
- não implementar gates de CLASS-001/002/004 neste lote;
- Gate B′ permanece proposta;
- Gates C–J não iniciados.

## 14. Condição de parada do Gate B · Lote 6/N6

Este lote deve conter somente:

- comentário de diagnóstico externo GM.04 na Issue #48;
- auditoria/documentação de N6;
- atualização documental da porta/índice;
- registro de CLASS-004, ampliação do GAP-025 e GAP-036–038 na Issue #48.

Exigir **CI success + Certificação transversal success 9/9 no mesmo SHA** do snapshot documental do Lote 6. Depois dos dois verdes:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` intocada;
3. reportar classes separadas dos individuais;
4. reportar N6 por classe e via;
5. mencionar N7 apenas como próximo domínio natural, sem iniciá-lo;
6. **PARAR**.

Não corrigir CLASS-001–004, DECISAO-001 ou GAPs. Não iniciar N7, Gate C, Gate G, Gate J, Observatório ou outra frente.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`;
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`;
- o mesmo Ledger está em v0.99 e contém D066, referente ao manifesto histórico;
- status: `PRE-CANONICAL` · `implementation_authorized: false`.

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada entra no runtime sem autorização explícita conforme `00_governance/WORKFLOW.md`. A frente não altera onda, canário, Matrix, ledger curricular nem runtime map.

**D067:** Issue #47 é a autoridade do pós-90/90. O Observatório é material subordinado às gates de #47 e não abre fila paralela; onde houver divergência, #47 vence. A contribuição exclusiva preservada é a medição de aprendizagem fora do motor adaptativo, incluindo a linha de base anterior ao primeiro uso sério.