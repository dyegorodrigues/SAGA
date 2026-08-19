# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional de verdade do PR #35 no pós-90/90.** GitHub remoto, fontes executáveis, Issue #47 e documentos canônicos especializados vencem memória de conversa, roadmap histórico ou checkpoint desatualizado.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada
- HEAD de entrada do Gate B · Lote 4: `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`; o HEAD remoto vivo sempre vence este valor se avançar
- A API pode reportar `main` como `protected:false`; a regra vinculante permanece **não tocar `main`**.

Antes de QUALQUER escrita futura:

1. reancore PR, branch, HEAD e `main` no remoto;
2. confira reviews e review threads;
3. consulte CI + Certificação transversal do HEAD relevante;
4. leia a Issue #47 e `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
5. para Gate B, leia a Issue #48 e **todos os documentos de lotes já concluídos** antes de abrir outro domínio;
6. abra somente fontes canônicas/executáveis do lote autorizado;
7. trate roadmap/auditoria antiga como histórico até revalidação;
8. nunca misture recibos entre SHAs nem invente estado atual a partir de memória.

## 2. Modo operacional

A Fábrica Curricular Principal terminou formalmente. O modo do projeto é **Integração Sistêmica e Child-Ready**.

Isso não significa que o produto esteja Child-Ready. A Definition of Child-Ready e a ordem oficial dos gates pertencem à **Issue #47**.

`AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md` é índice executivo, não substituto das autoridades especializadas.

## 3. Gate A — FECHADO-COM-RECIBO

Gate A da Issue #47 está **FECHADO-COM-RECIBO**.

### Promoção técnica final W50

- SHA: `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` — completed/success;
- Certificação transversal `32196855356` — completed/success, 9/9;
- Coverage Matrix: **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**;
- cobertura final: **90 competências / 94 fichas autorais**.

### Fechamento documental independente

- SHA: `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` — completed/success;
- Certificação transversal `32197697050` — completed/success, 9/9.

W1–W50 e a cadeia da fábrica não devem ser refeitas sem causa nova observável.

## 4. Estado dos gates pós-90/90

- **Gate A:** FECHADO-COM-RECIBO.
- **Gate B:** **ABERTO EM LOTES**.
- **Gates C–J:** **NÃO INICIADOS**.

### Gate B · Lote 1 — N1

- escopo: 13/13;
- snapshot: `ad1b239457371a1f411001fd8521984eeadb94fe`;
- 10 candidatas `GAP-002`–`GAP-011`, todas `HIPÓTESE-A-PROVAR`;
- vias: 7 CODIGO / 0 SIMULACAO / 3 CRIANCA;
- CI `32209683689` success + transversal `32209683699` success 9/9;
- correções: 0.

### Gate B · Lote 2 — N2

- escopo: 7/7;
- snapshot: `a5101b362ae6d4896258f994ed14145b37950b98`;
- 10 candidatas `GAP-012`–`GAP-021`, todas `HIPÓTESE-A-PROVAR`;
- vias: 9 CODIGO / 1 SIMULACAO / 0 CRIANCA;
- CI `32216926616` success + transversal `32216926610` success 9/9;
- correções: 0.

### Gate B · Lote 3 — N3

- escopo: 13/13;
- snapshot: `9c6b6d47cbe2bb74f2d342b2bbe01aa40260d84b`;
- `CLASS-001`: `CONFIRMADO-ATUAL`, via CODIGO, 18 geradores com `lvl` declarado e não consumido;
- 7 candidatas `GAP-022`–`GAP-028`, todas `HIPÓTESE-A-PROVAR`;
- vias: 7 CODIGO / 0 SIMULACAO / 0 CRIANCA;
- CI `32218633036` success + transversal `32218633032` success 9/9;
- correções: 0.

### Gate B · Lote 4 — N4

Escopo auditado neste snapshot: **N4.01–N4.12, 12/12**.

Documento:

`AI_Studio_Lab/codex/GATE_B_LOTE_4_N4_AUDITORIA.md`

Resultado materializado:

- `CLASS-002` — `CONFIRMADO-ATUAL`, via `CODIGO`: divergência de prereqs ficha↔DAG em N4.03/N4.06/N4.07/N4.08; o unlock atual continua usando o DAG completo;
- `CLASS-003` — `CONFIRMADO-ATUAL`, via `CODIGO`: N4.10/N4.11/N4.12 possuem um único caso especializado fixo por nível sob mastery repetida;
- 4 candidatas N4 `GAP-029`–`GAP-032`;
- classe das 4: `HIPÓTESE-A-PROVAR`;
- vias: **3 CODIGO / 0 SIMULACAO / 1 CRIANCA**;
- correções: 0;
- runtime, Matrix, canário e DAG intocados;
- N5 **não iniciado**.

O snapshot documental do Lote 4 precisa de **CI success + Certificação transversal success 9/9 no mesmo SHA**. Ler os recibos do remoto no SHA exato; não reutilizar runs anteriores.

## 5. Proposta de governança — Gate B′

Antes de auditar N4, foi registrada na Issue #47 a proposta pedida pelo usuário:

- comentário `5342129190`;
- estado: **PROPOSTA**, não decisão implementada;
- a §15 da Issue #47 **não foi alterada**;
- propõe uma fase `Gate B′` entre B e C;
- candidatas via `CODIGO` seriam investigadas/fechadas primeiro, incluindo `CLASS-001` como classe única com o gate estático já proposto;
- `SIMULACAO` migraria como entrada do Gate G;
- `CRIANCA` migraria como roteiro do Gate J;
- regra proposta: nenhuma candidata `CODIGO` aberta quando Gate J começar.

Essa proposta **não altera a ordem oficial hoje**, não inicia C–J e não autoriza correções.

## 6. Disciplina de evidência do Gate B

Classes da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Na Issue #48:

- suspeita curricular nasce `CANDIDATA`;
- fato observável não transforma automaticamente uma hipótese em dívida;
- lote audit-only não cria ficha, micronível, aresta, regra de mastery ou correção para sua própria descoberta;
- mudança de estado exige investigação/decisão adequada.

### Achado de classe

Padrão estrutural objetivamente revalidado pode ser `ACHADO-DE-CLASSE` + `CONFIRMADO-ATUAL`, separado de candidatos individuais.

Achados de classe vigentes após N4:

- `CLASS-001` — 18 geradores com `lvl` morto; via CODIGO;
- `CLASS-002` — prereqs ficha↔DAG divergentes em quatro fichas N4; via CODIGO;
- `CLASS-003` — contratos especializados N4.10/N4.11/N4.12 com caso único por nível sob mastery repetida; via CODIGO.

Não expandir artificialmente achado de classe em um GAP por competência quando a causa é a mesma.

### VIA DE RESOLUÇÃO

- **`CODIGO`** — encerra por prova de fonte executável/cânone/DAG/mastery;
- **`SIMULACAO`** — encerra em campanha do Aprendiz Simulado / Gate G;
- **`CRIANCA`** — encerra por observação infantil / Gate J.

A via é requisito de evidência, não autorização de execução.

## 7. Estado acumulado do Gate B após N4

Sem promover hipótese a dívida:

- competências auditadas: **45/90**;
- candidatas individuais: **31**;
- vias individuais: **26 CODIGO / 1 SIMULACAO / 4 CRIANCA**;
- achados de classe: **3**, todos `CONFIRMADO-ATUAL` e via `CODIGO`;
- correções executadas pelo Gate B: **0**.

As quatro candidatas N4 são:

- GAP-029 — N4.02 legado não exige comutatividade/rotação e colapsa L2–L5;
- GAP-030 — N4.05 não serve o significado de divisão por medida;
- GAP-031 — N4.05 L3–L5 repetem partição simbólica exata e não constroem resto/ponte para N4.10;
- GAP-032 — N4.07 estreia ×7 apenas no misto L4 quando o apoio da estratégia já saiu; via CRIANCA.

## 8. CLASS-001 — gate proposto, não implementado

O padrão confirmado no Lote 3 permanece em 18 geradores. `generatorsVisual.ts` é 6/6 afetado.

Gate proposto, **não implementado**: teste AST/estático falha quando gerador declara parâmetro literal `lvl` sem referência executável ao identificador; wrappers que encaminham `lvl` passam; `_lvl` é supressão explícita; falha informa `arquivo :: função`.

Nenhuma correção nem implantação desse gate ocorreu no Lote 4.

## 9. Resíduos preservados

- 15 competências legado — `CONFIRMADO-ATUAL`;
- 11 divergências ficha↔screen — `CONFIRMADO-ATUAL`;
- `Moedas` / GM.03 — `CONFIRMADO-ATUAL`;
- hardening/performance + warning de bundle — `CONFIRMADO-ATUAL`;
- Issue #48 — `DÍVIDA-REGISTRADA` como registro vivo; suas candidatas não são dívidas confirmadas;
- Observatório / Research Foundry — `DÍVIDA-REGISTRADA`, subordinado à Issue #47 e sem autorização de implementação.

N4.02 e N4.05 permanecem servidos pelo legado; isso é fato atual, não autorização automática de migração.

## 10. Gate J — precondição de linha de base

Antes do primeiro uso sério por cada criança, permanece a precondição de uma **linha de base fora do motor adaptativo, em papel**.

A exigência vem da Research Foundry, D067, e de `03_architecture/OBSERVATORIO_E_AUDITORIA.md` Parte 2. A linha de base é recurso não renovável: depois do primeiro uso sério, o ponto inicial é irrecuperável.

A obrigação está registrada; a coleta **não foi iniciada** no Gate B.

## 11. Hierarquia de autoridade pós-90/90

1. GitHub remoto e autoridades executáveis do HEAD;
2. Issue #47 para fase e Definition of Child-Ready;
3. documentos canônicos especializados de cada gate;
4. Issue #48 como registro vivo dos gaps/achados do Gate B;
5. `ROADMAP_90_90_CHILD_READY.md` como índice executivo;
6. documentos dos lotes Gate B como auditorias de escopo;
7. documentos históricos somente como evidência a revalidar.

A proposta Gate B′ é comentário de governança, não altera essa hierarquia até decisão posterior.

## 12. Regras invioláveis do PR #35

- GitHub remoto vence memória/checkpoint;
- `main` não é área de trabalho;
- PR permanece draft + open + unmerged;
- nunca marcar ready, habilitar auto-merge ou mergear;
- não tocar Creature Engine/Tamagotchi;
- um único writer ativo na branch;
- não misturar recibos entre SHAs;
- não relaxar testes, P13, Matrix, Radar, DAG, contratos ou sondas para obter verde;
- não editar baseline para encobrir observação real;
- erro motor não vira misconception conceitual;
- RT conceitual não compra/reprova mastery salvo contrato específico de fluência;
- ajuda/resolução assistida não compra mastery independente;
- dívida real não é apagada por troca de fase;
- CI verde isolado nunca significa Child-Ready;
- Gate B é serializado por domínio/lote;
- lote audit-only **não implementa a própria descoberta**;
- via `SIMULACAO`/`CRIANCA` não autoriza Gate G/J;
- não implementar o gate de `CLASS-001` neste lote;
- Gate B′ permanece proposta, não gate ativo.

## 13. Condição de parada do Gate B · Lote 4/N4

Este lote deve conter somente:

- comentário de proposta Gate B′ na Issue #47;
- auditoria/documentação de N4;
- atualização documental da porta/índice;
- registro de `CLASS-002`, `CLASS-003` e candidatas N4 na Issue #48.

Exigir **CI success + Certificação transversal success 9/9 no mesmo SHA** do snapshot documental do Lote 4. Depois dos dois verdes:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` intocada;
3. reportar achados de classe separadamente dos individuais;
4. reportar N4 por classe e por via;
5. mencionar N5 apenas como próximo domínio natural, sem iniciá-lo;
6. **parar**.

Não corrigir `CLASS-001`–`CLASS-003` nem GAP-002–GAP-032. Não iniciar N5, Gate C, Gate G, Gate J, Observatório ou outra grande frente.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`
- o mesmo Ledger está em v0.99 e contém também D066, referente ao manifesto histórico
- status: `PRE-CANONICAL` · `implementation_authorized: false`

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada dela entra no runtime sem autorização explícita do usuário conforme `00_governance/WORKFLOW.md`. Ela não altera onda, canário, Matrix, ledger curricular nem runtime map. Não interromper a fila curricular por causa dela.

**Atualização de governança — D067:** a Research Foundry registrou que a **Issue #47 é a autoridade do pós-90/90**. O Observatório passa a ser material subordinado às gates de #47 e **não abre fila paralela**; onde houver divergência, #47 vence. A contribuição exclusiva preservada é a medição de aprendizagem fora do motor adaptativo, incluindo a linha de base anterior ao primeiro uso sério.