# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional de verdade do PR #35 no pós-90/90.** GitHub remoto, fontes executáveis, Issue #47 e documentos canônicos especializados vencem memória de conversa, roadmap histórico ou checkpoint desatualizado.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada
- HEAD de entrada do Gate B · Lote 3: `a5101b362ae6d4896258f994ed14145b37950b98`; o HEAD remoto vivo sempre vence este valor se avançar
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

A Fábrica Curricular Principal terminou formalmente. O modo do projeto é:

**Integração Sistêmica e Child-Ready**.

Isso não significa que o produto esteja Child-Ready. A Definition of Child-Ready e a ordem dos gates pertencem à **Issue #47 — Integração Sistêmica e Child-Ready**.

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

- escopo: N1.01–N1.13, 13/13;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_1_N1_AUDITORIA.md`;
- snapshot: `ad1b239457371a1f411001fd8521984eeadb94fe`;
- 10 candidatas `GAP-002`–`GAP-011`, todas `HIPÓTESE-A-PROVAR`;
- vias retroativas: 7 CODIGO / 0 SIMULACAO / 3 CRIANCA;
- CI `32209683689` success;
- transversal `32209683699` success 9/9;
- correções: 0.

### Gate B · Lote 2 — N2

- escopo: N2.01–N2.07, 7/7;
- documento: `AI_Studio_Lab/codex/GATE_B_LOTE_2_N2_AUDITORIA.md`;
- snapshot: `a5101b362ae6d4896258f994ed14145b37950b98`;
- 10 candidatas `GAP-012`–`GAP-021`, todas `HIPÓTESE-A-PROVAR`;
- vias: 9 CODIGO / 1 SIMULACAO / 0 CRIANCA;
- CI `32216926616` success;
- transversal `32216926610` success 9/9;
- correções: 0.

### Gate B · Lote 3 — N3

Escopo auditado neste snapshot: **N3.01–N3.13, 13/13**, precedido pela varredura estrutural de geradores autorizada pelo usuário.

Documento:

`AI_Studio_Lab/codex/GATE_B_LOTE_3_N3_AUDITORIA.md`

Resultado materializado:

- `CLASS-001` — achado de classe `CONFIRMADO-ATUAL`, via `CODIGO`: **18 geradores** declaram `lvl` sem o consumir diretamente;
- 7 candidatas N3 `GAP-022`–`GAP-028`;
- todas as 7 candidatas: `HIPÓTESE-A-PROVAR`;
- vias das candidatas: **7 CODIGO / 0 SIMULACAO / 0 CRIANCA**;
- correções: 0;
- runtime, Matrix, canário e DAG intocados;
- N4 **não iniciado**.

O snapshot documental deste Lote 3 precisa de **CI success + Certificação transversal success 9/9 no mesmo SHA**. Ler os recibos do remoto no SHA exato; não reutilizar runs anteriores.

Próximo lote proposto, **não autorizado automaticamente**: **Gate B · Lote 4 — N4**.

## 5. Disciplina de evidência do Gate B

Usar as classes da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Para Issue #48:

- suspeita curricular nasce `CANDIDATA`;
- fato observável que sustenta a suspeita não transforma automaticamente a conclusão em dívida;
- não criar ficha, micronível, aresta, regra de mastery ou correção no mesmo lote audit-only;
- só mudar estado da candidata quando a investigação/decisão adequada produzir evidência suficiente.

### Achado de classe

Um achado estrutural objetivamente revalidado pode ser registrado como `ACHADO-DE-CLASSE` e `CONFIRMADO-ATUAL`, separado das candidatas curriculares. No Lote 3 isso vale para `CLASS-001`; **não criar um GAP por competência apenas porque seu gerador participa do padrão**.

### VIA DE RESOLUÇÃO

Toda candidata deve declarar uma das três vias:

- **`CODIGO`** — fecha por inspeção/prova de fonte executável, cânone, DAG ou mastery; não exige criança nem gate futuro.
- **`SIMULACAO`** — só fecha por campanha de Aprendiz Simulado no Gate G.
- **`CRIANCA`** — só fecha por observação de criança real no Gate J.

A via é requisito de evidência, não autorização de execução. Uma candidata `SIMULACAO` não abre Gate G; uma `CRIANCA` não abre Gate J.

Regra permanente: documento antigo não vira estado atual por existir no repositório. Revalidar no HEAD antes de afirmar que algo ainda funciona/falha ou mantém a mesma magnitude.

## 6. CLASS-001 — contrato estrutural de nível

No HEAD de entrada do Lote 3, a varredura de `generators.ts`, `generatorsF1.ts`, `generatorsF2.ts` e `generatorsVisual.ts` confirmou **18 geradores** cujo parâmetro se chama `lvl` e não é referenciado no próprio corpo.

Distribuição:

- `generators.ts`: 4;
- `generatorsF1.ts`: 4;
- `generatorsF2.ts`: 4;
- `generatorsVisual.ts`: 6.

A lista nominal e os falsos positivos recusados estão no documento do Lote 3.

Gate proposto, **não implementado**: teste AST/estático deve falhar quando um gerador declara `lvl` e não possui referência executável ao identificador; wrappers que encaminham `lvl` passam; `_lvl` é supressão explícita. A ativação só pode ocorrer em frente de correção autorizada, não neste lote.

## 7. Resíduos preservados

- 15 competências legado — `CONFIRMADO-ATUAL`;
- 11 divergências ficha↔screen — `CONFIRMADO-ATUAL`;
- `Moedas` / GM.03 — `CONFIRMADO-ATUAL`;
- hardening/performance + warning de bundle — `CONFIRMADO-ATUAL`;
- Issue #48 — `DÍVIDA-REGISTRADA` como registro vivo; suas candidatas não são dívidas confirmadas;
- Observatório / Research Foundry — `DÍVIDA-REGISTRADA`, subordinado à Issue #47 e sem autorização de implementação.

Oito nós N3 permanecem servidos pelo legado; isso é parte do resíduo confirmado. `CLASS-001` e as candidatas N3 não autorizam migração/correção neste lote.

## 8. Gate J — precondição de linha de base

Antes do primeiro uso sério por cada criança, permanece a precondição de uma **linha de base fora do motor adaptativo, em papel**.

A exigência vem da Research Foundry, D067, e de `03_architecture/OBSERVATORIO_E_AUDITORIA.md` Parte 2. A linha de base é recurso não renovável: depois do primeiro uso sério, o ponto inicial é irrecuperável.

A obrigação está registrada; a coleta **não foi iniciada** no Gate B.

## 9. Hierarquia de autoridade pós-90/90

1. GitHub remoto e autoridades executáveis do HEAD;
2. Issue #47 para fase e Definition of Child-Ready;
3. documentos canônicos especializados de cada gate;
4. Issue #48 como registro vivo dos gaps/achados do Gate B;
5. `ROADMAP_90_90_CHILD_READY.md` como índice executivo;
6. documentos dos lotes Gate B como auditorias de escopo;
7. documentos históricos somente como evidência a revalidar.

A Foundry não cria segunda autoridade. D067 determina que Issue #47 vence divergências e que o Observatório é material de apoio das gates, não fila concorrente.

## 10. Regras invioláveis do PR #35

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
- `CLASS-001` é achado, não autorização para editar geradores ou criar seu gate agora.

## 11. Condição de parada do Gate B · Lote 3/N3

Este lote deve conter somente:

- varredura/auditoria documental do padrão estrutural `lvl`;
- auditoria/documentação de N3;
- atualização documental da porta/índice;
- registro de `CLASS-001` e das candidatas N3 na Issue #48.

Exigir **CI success + Certificação transversal success 9/9 no mesmo SHA** do snapshot documental do Lote 3. Depois dos dois verdes:

1. confirmar PR #35 open + draft + unmerged;
2. confirmar `main` intocada;
3. reportar `CLASS-001` separadamente dos achados individuais;
4. reportar candidatas N3 por classe e por via;
5. propor **N4** como lote seguinte, sem iniciá-lo;
6. **parar**.

Não corrigir `CLASS-001` nem GAP-022–GAP-028. Não iniciar N4, Gate C, Gate G, Gate J, Observatório ou outra grande frente.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`
- o mesmo Ledger está em v0.99 e contém também D066, referente ao manifesto histórico
- status: `PRE-CANONICAL` · `implementation_authorized: false`

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada dela entra no runtime sem autorização explícita do usuário conforme `00_governance/WORKFLOW.md`. Ela não altera onda, canário, Matrix, ledger curricular nem runtime map. Não interromper a fila curricular por causa dela.

**Atualização de governança — D067:** a Research Foundry registrou que a **Issue #47 é a autoridade do pós-90/90**. O Observatório passa a ser material subordinado às gates de #47 e **não abre fila paralela**; onde houver divergência, #47 vence. A contribuição exclusiva preservada é a medição de aprendizagem fora do motor adaptativo, incluindo a linha de base anterior ao primeiro uso sério.