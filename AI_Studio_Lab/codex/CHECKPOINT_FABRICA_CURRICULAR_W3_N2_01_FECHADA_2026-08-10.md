# CHECKPOINT — FÁBRICA CURRICULAR W3 / N2.01 FECHADA — 2026-08-10

> Fonte de retomada da fábrica curricular depois da W3. Este documento substitui qualquer indicação anterior de que a W3 já estava fechada antes do CI terminal verde.

## 1. Estado remoto reancorado

- repositório: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- PR #29: comparação/CI somente, **open + draft + unmerged**;
- base protegida: `main@68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine fora desta fila;
- nenhuma branch auxiliar;
- sem merge, rebase, ready ou auto-merge.

## 2. Correção de continuidade importante

A primeira descrição de W3 como “fechada” foi prematura.

Ao reancorar o GitHub remoto, o HEAD real ainda estava em uma meia-migração: os testes já cobravam a F21 canônica, mas parte da implementação continuava no modelo provisório `ler|produzir`, e o checkpoint W3 citado na PR sequer existia.

A sequência de gates expôs a diferença antes que W4 começasse. A W3 foi então refeita/terminada regression-first e só recebeu promoção depois de um HEAD **inativo** integralmente verde.

Isso vira regra operacional reforçada:

> nenhum texto, comentário ou resposta de agente fecha uma onda; o fechamento existe somente quando HEAD remoto + Matrix + gates + sonda do mesmo estado comprovam o contrato.

## 3. F21 / N2.01 — contrato canônico materializado

**Competência:** N2.01 — dezena e unidades.

**Ideia nuclear:** dez unidades podem ser agrupadas e tratadas como **uma unidade de ordem superior**. Ver uma barra pronta não basta; a criança precisa produzir a troca.

**Primitivas canônicas:** `MaterialDourado + TenFrame`.

### Progressão dos cinco níveis

1. **L1 — 10–19:** agrupamento manual com moldura/TenFrame;
2. **L2 — 20–39:** ciclos repetidos de agrupamento manual com moldura;
3. **L3 — 10–99:** agrupamento manual sem a moldura de apoio;
4. **L4 — numeral → material:** recebe o numeral e monta barras + cubinhos;
5. **L5 — decomposição mental:** `47 = ☐ dezenas + ☐ unidades`, sem material.

L5 não é “mistura leitura/produção”. Essa hipótese provisória foi descartada ao reler a ficha integral antes da promoção.

### Domínio

- `{ acertos: 3, de: 3, sessoes: 2 }`;
- regra extra da ficha: pelo menos um acerto no L4;
- evidência catalogada: `montou-do-numeral`.

### Diagnósticos canônicos

- `IGNORA_VALOR` — trata barra e cubinho como se tivessem o mesmo valor;
- `INVERTE_ORDENS` — troca dezenas e unidades;
- `NAO_AGRUPA` — continua contando de um em um e não adota a dezena como unidade composta.

As quatro tags provisórias usadas durante a construção (`IGNORA_DEZENA`, `CONCATENA`, `CONTA_TUDO`, `TROCA_DU`) foram mantidas apenas como **aliases históricos/deprecated** para não invalidar eventual telemetria já gravada. Novos emissores usam exclusivamente a taxonomia canônica.

## 4. Implementação real

A cadeia servida ficou:

`F21 → specialized builder → material-dourado → MaterialDouradoStage → MaterialDourado + TenFrame → ação observável → diagnóstico/evidência → AnswerMeta → GameLoop/Radar`

### Palco

- cubinhos começam soltos;
- cada ação move um cubinho para a zona de troca;
- somente o décimo fecha o grupo;
- a troca cria uma barra e permite novo ciclo;
- L1/L2 usam TenFrame real;
- L3 preserva a ação e retira a moldura;
- L4 inverte a direção e deixa a criança montar D/U;
- L5 remove o material e pede decomposição mental;
- toque/teclado continuam alternativas ao gesto de drag;
- a barra inteira é um único alvo acessível ao inspecionar, não dez focos separados;
- recontar uma barra formada é observável e pode produzir `NAO_AGRUPA` mesmo se o número final estiver correto.

### Microaula

Coreografia canônica L1:

1. `pulsarMoldura`;
2. `preencherAte: 10`;
3. `fundirEmBarra`;
4. `destacarBarra`.

A demonstração não contamina o estado da tentativa real.

### Boundary especializado

`N2.01` continua pertencendo à família autoral `tens`, mas o Question runtime se identifica como `material-dourado` porque entrega explicitamente a composição `MaterialDourado + TenFrame`.

O override de kind especializado passou a ser contrato no registro do Composer, em vez de `if` escondido em teste.

## 5. Gates que encontraram dívida real durante W3

A W3 não foi “levada ao verde” alterando expectativas. Os gates revelaram costuras e elas foram corrigidas na fonte:

- implementação provisória não correspondia aos cinco níveis canônicos;
- tags canônicas ainda não existiam no catálogo;
- evidência L4 existia conceitualmente mas não no catálogo/emissor global;
- teste genérico do Composer não conhecia builder com runtime kind especializado;
- mapa de runtime não declarava `material-dourado` em MaterialDourado + TenFrame;
- alvo visual L3 tinha `aria-label` sem role semântico;
- testes negativos do Composer mutavam chaves inexistentes (`qtd`, `op`, `rowsMax`) e portanto não testavam o boundary real; foram corrigidos para `audio_prompt`, `operation`, `rows_max` e para o contrato de rotação;
- teste de tutorial verificava `.fala`, enquanto o contrato normalizado de `Question` usa `.say`.

## 6. Promotion gate

A promoção ocorreu somente depois do estado **inativo** ficar integralmente verde:

- HEAD inativo: `ccd4d35b68f4d5049f9485f7cd8088d5fd6af700`;
- CI #912 — success integral.

Depois disso N2.01 entrou em:

- `DEFAULT_COMPOSER_CANARY_IDS`;
- `canaryContract.test.ts`.

A Matrix ficou vermelha de modo esperado porque a fonte real havia mudado e o ledger ainda não.

### Delta observado antes do ledger

A observação foi limpa e isolada:

- Composer: `27 → 28`;
- legado: `24 → 23`;
- fallback: `39 → 39`;
- servidas: `51 → 51`;
- divergências ficha↔screen: `19 → 18`;
- swaps: `12 → 12`;
- estreias: `44 → 44`;
- blockers: `Moedas`, `Regua` — inalterados.

Só então entrou a migração `W3-N2.01` no `COVERAGE_MIGRATIONS`.

## 7. Coverage Matrix vigente

Snapshot P21.1 continua histórico e imutável:

- 26 Composer;
- 25 legado;
- 39 fallback;
- 51 servidas;
- 21 divergências.

Migrações fechadas:

- `W1-N1.04`: divergências −1;
- `W2-N1.05`: Composer +1, legado −1, divergências −1;
- `W3-N2.01`: Composer +1, legado −1, divergências −1.

Baseline vigente:

- **28 Composer**;
- **23 legado**;
- **39 fallback**;
- **51 servidas**;
- **18 divergências**;
- **12 trocas visuais**;
- **44 estreias de ferramenta**;
- blockers `Moedas` e `Regua`.

## 8. Recibo funcional real

HEAD funcional promovido:

`929dc5b234a842116b31b998850ceacabe2248dd`

CI:

- **#916 / run `31386605676` — success integral**;
- TypeScript verde;
- **166 arquivos / 2.443 testes passando**;
- build verde;
- `pr:check` verde;
- guarda de binários verde;
- higiene do diff verde;
- sonda real Sensei verde.

### Sonda real

Chrome 150 validou:

- prescrição do Sensei no Dojo;
- gate do Mestre;
- Jardim causal;
- matrícula / primeira sonda real;
- phone + tablet.

Artefato:

- nome: `sonda-sensei-929dc5b234a842116b31b998850ceacabe2248dd`;
- ID: `9061964350`;
- 16 arquivos;
- 1.006.220 bytes;
- SHA-256: `cb0bd490ab0b6576043bab8869d8c55e9786513767f102c0e5a9b7a38e5b1fcb`.

## 9. Thinking Lab — impacto arquitetural paralelo

Foi feita uma leitura paralela apenas como **risk review**, sem permitir que hipótese externa reescrevesse a fila curricular.

Até este checkpoint **não apareceu sinal de que o SAGA precise ser reconstruído do zero**.

A direção útil do Thinking Lab é majoritariamente complementar ao que já existe:

- simulador de criança/learner trajectories;
- property-based testing de geradores;
- QA visual/áudio;
- agentes especializados de engenharia/validação;
- observabilidade/telemetria tipada;
- governança de proposta → teste → revisão → cânone.

Essas camadas cabem incrementalmente sobre a arquitetura atual.

### Invariantes que qualquer proposta futura precisa respeitar

Não aceitar sem revisão explícita:

- LLM soberano decidindo aula em runtime;
- geração online não determinística substituindo contrato autoral;
- telemetria reescrevendo automaticamente o Curriculum Graph;
- idade, RT ou recompensa de jogo concedendo mastery;
- IA alterando cânone/código em produção sem testes, CI e revisão;
- infraestrutura como Neo4j/Kafka/vector DB sendo tratada como requisito só por ser “moderna”.

Loop seguro continua:

`Curriculum Graph canônico → ficha/contratos → runtime → learner state → telemetria → análise/hipótese → proposta de IA → testes/CI/revisão → cânone`

Não:

`telemetria → LLM → mutação direta do grafo/runtime`.

Se o relatório aprofundado do Thinking Lab trouxer proposta nova, ela deve passar por uma **Invariant Impact Review** antes de virar backlog de implementação: impacto em grafo, learner state, evidência, runtime offline/determinístico, privacidade, custo, QA, migração de dados, rollback e compatibilidade com fichas já fechadas.

## 10. Próxima tarefa única — W4

A próxima onda deve ser escolhida pela Coverage Matrix vigente, não pela ordem numérica.

A auditoria preliminar aponta **N1.12 / F19 — reta numérica até 20** como candidato muito forte porque:

- continua legado + divergente;
- pré-requisitos N1.07/N1.09 já são autorais;
- o próprio YAML a classifica como `Prioridade 1 (kind novo)`;
- o legado atual ensina outra progressão (`antes/depois/entre`, números altos, ±10), divergente da F19;
- `InteractiveNumberLine` já existe e deve ser evoluída/reutilizada, não duplicada;
- a F19 instala número como posição e movimento e prepara adição/subtração.

Antes de editar W4, confirmar pela Matrix/DAG que N1.12 vence os demais candidatos em impacto causal + risco pedagógico + dívida.

### Contratos F19 já identificados para a auditoria W4

- L1: localizar 0–10;
- L2: localizar 0–20;
- L3: saltos +1/+2;
- L4: saltos −1/−2;
- L5: misto +1/+2/−1/−2;
- gesto principal produtivo na reta;
- snap generoso;
- toque alternativo ao drag;
- imprecisão motora não pode virar erro matemático;
- percurso permanece visível;
- erro balança sem mover o personagem;
- áudio dos números acompanha movimento real;
- domínio 3/3 em duas sessões;
- RT L5 7s;
- diagnósticos a reconciliar no catálogo: `CONTA_SEM_POSICAO`, `DIRECAO_INVERTIDA`, `ERRO_DE_UM`, `SO_SEQUENCIA`.

Fluxo W4 obrigatório:

`Matrix vigente → F19 inteira → DAG/runtime inteiro → regressão vermelha → contract/procedure → evolução do InteractiveNumberLine → stage/boundary/telemetria/a11y → registro inativo → CI → canário → Matrix observa → ledger W4 → gates → checkpoint`.

## 11. Regra de continuidade

**A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**

Não abrir nova frente sem evidência causal. Não reabrir frente fechada sem falha objetiva. Não declarar onda fechada antes do recibo remoto integral.