# PROMPT DE RETOMADA — Integração Sistêmica e Child-Ready SAGA

> **Porta operacional de verdade do PR #35 no pós-90/90.** GitHub remoto, fontes executáveis, Issue #47 e documentos canônicos especializados vencem memória de conversa, roadmap histórico ou checkpoint desatualizado.

## 1. Âncora remota obrigatória

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada pela fábrica
- HEAD de entrada desta transição: `dc6c21c2ba013e104813a534c55de804c546b770`; o HEAD remoto vivo sempre vence este valor se avançar
- Observação: a API do GitHub reporta `main` como `protected:false`; não fingir proteção técnica. A regra de governança vinculante permanece **não tocar `main`**.

Antes de QUALQUER escrita futura:

1. reancore PR, branch, HEAD e `main` no remoto;
2. confira reviews e review threads;
3. consulte CI + Certificação transversal do HEAD relevante;
4. leia a Issue #47 e este índice: `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
5. abra somente as fontes canônicas do gate realmente autorizado;
6. trate roadmap antigo/auditoria antiga como histórico até revalidação;
7. nunca misture recibos entre SHAs nem invente estado atual a partir de memória.

## 2. Transição formal de modo

A **Fábrica Curricular Principal** terminou formalmente. O modo operacional do projeto passa de:

**Fábrica Curricular**

para:

**Integração Sistêmica e Child-Ready**.

Isso não significa que o produto esteja Child-Ready. A Definition of Child-Ready e a ordem dos gates são autoridade da **Issue #47 — Integração Sistêmica e Child-Ready**.

O arquivo `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md` é somente índice executivo: aponta para as fontes canônicas, registra estados/classes e não substitui a Issue #47 nem documentos especializados.

## 3. Gate A — FECHADO-COM-RECIBO

Gate A da Issue #47 está **FECHADO-COM-RECIBO**.

### Promoção técnica final W50

- SHA: `efd270b732752ebe0d38a47efff47d958e352802`;
- CI `32196855192` — **completed/success**;
- Certificação transversal `32196855356` — **completed/success, 9/9**;
- Coverage Matrix observada: **75 Composer / 15 legado / 0 fallback / 90 servidas / 11 divergências**;
- cobertura final: **90 competências / 94 fichas autorais**.

### Fechamento documental independente

- SHA: `dc6c21c2ba013e104813a534c55de804c546b770`;
- CI `32197697198` — **completed/success**;
- Certificação transversal `32197697050` — **completed/success, 9/9**.

Os recibos técnicos e documentais são independentes e permanecem vinculados aos respectivos SHAs.

Fontes de detalhe da fábrica fechada:

- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W50_N5_05_F86_FECHADA_2026-08-18.md`;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_FINAL_90_DE_90_2026-08-18.md`;
- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`.

**W1–W50 e a cadeia da fábrica não devem ser refeitas sem causa nova observável.**

## 4. Estado dos gates pós-90/90

- **Gate A:** FECHADO-COM-RECIBO.
- **Gates B–J:** **NÃO INICIADOS** nesta transição.
- A ordem e os critérios pertencem à Issue #47.
- Gate B é o próximo gate recomendado pela §15 da Issue #47, mas permanece não iniciado até uma execução posterior explicitamente dedicada a ele.

Esta transição autoriza somente o snapshot/índice executivo e a mudança formal de modo. Não iniciar mega-auditoria, Issue #48, Player/Tutor, Child-Ready operacional, Observatório, piloto ou hardening agora.

## 5. Disciplina de evidência

Usar obrigatoriamente as classes da Issue #47 §0.2:

- `CONFIRMADO-ATUAL`;
- `DÍVIDA-REGISTRADA`;
- `HISTÓRICO-A-REVALIDAR`;
- `HIPÓTESE-A-PROVAR`;
- `FECHADO-COM-RECIBO`;
- `FORA-DE-ESCOPO`.

Regra: documento antigo não vira estado atual por existir no repositório. Revalidar no HEAD relevante antes de afirmar que algo ainda funciona, ainda falha ou ainda possui a mesma magnitude.

## 6. Resíduos preservados na transição

O índice executivo classifica explicitamente os resíduos que sobreviveram ao fechamento curricular:

- 15 competências legado — `CONFIRMADO-ATUAL`;
- 11 divergências ficha↔screen — `CONFIRMADO-ATUAL`;
- `Moedas` / GM.03 — `CONFIRMADO-ATUAL`;
- hardening/performance + warning de bundle — `CONFIRMADO-ATUAL`;
- Issue #48 — `DÍVIDA-REGISTRADA`;
- Observatório / Research Foundry — `DÍVIDA-REGISTRADA`, subordinado à Issue #47 e sem autorização de implementação.

Essas classificações registram evidência/estado. Não autorizam abrir as frentes neste commit.

## 7. Gate J — precondição de linha de base

Antes do primeiro uso sério por cada criança, o roadmap registra como precondição do Gate J uma **linha de base fora do motor adaptativo, em papel**.

A exigência vem da Research Foundry, D067, e de `03_architecture/OBSERVATORIO_E_AUDITORIA.md` Parte 2. A linha de base é recurso não renovável: depois do primeiro uso sério, o ponto de partida é irrecuperável e o ganho deixa de ser interpretável de forma limpa em relação ao estado inicial.

A obrigação está registrada; a coleta **não foi iniciada** nesta transição.

## 8. Hierarquia de autoridade pós-90/90

1. GitHub remoto e autoridades executáveis do HEAD relevante;
2. Issue #47 para governança da fase e Definition of Child-Ready;
3. documentos canônicos especializados de cada gate;
4. `ROADMAP_90_90_CHILD_READY.md` como índice executivo;
5. documentos históricos somente como evidência a revalidar.

A Issue #48 é o registro vivo de gaps do Gate B; uma entrada `CANDIDATA` continua hipótese e não pode ser chamada de dívida confirmada sem prova.

A Foundry não cria uma segunda autoridade. D067 determina que a Issue #47 vence em qualquer divergência e que o Observatório passa a ser material de apoio das gates, não fila concorrente.

## 9. Regras invioláveis do PR #35

- GitHub remoto vence memória, checkpoint e esta porta;
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
- CI verde isolado nunca significa Child-Ready.

## 10. Condição de parada desta transição

Este snapshot de transição deve conter somente:

- criação de `AI_Studio_Lab/codex/ROADMAP_90_90_CHILD_READY.md`;
- esta mudança formal de modo no `PROMPT_DE_RETOMADA.md`.

Exigir **CI success + Certificação transversal success 9/9 no mesmo SHA** deste snapshot. Depois dos dois verdes, **parar**.

Não iniciar Gate B, Issue #48, Child-Ready operacional, Observatório ou outra grande frente neste fechamento de transição.

## Frente paralela — Observatório (P&D, não runtime)

Existe uma frente registrada na `SAGA-Research-Foundry`, fora desta fila curricular e sem autoridade sobre ela:

- documento: `03_architecture/OBSERVATORIO_E_AUDITORIA.md`
- decisões diretamente correlatas: D057–D065 no `05_decisions/DECISION_LEDGER.md`
- o mesmo Ledger está em v0.99 e contém também D066, referente ao manifesto histórico
- status: `PRE-CANONICAL` · `implementation_authorized: false`

Escopo: Recibo de Sessão, avaliação de aprendizagem fora do motor adaptativo, sete auditorias de motor, personas sintéticas e costuras de expansão.

Nada dela entra no runtime sem autorização explícita do usuário conforme `00_governance/WORKFLOW.md`. Ela não altera onda, canário, Matrix, ledger curricular nem runtime map. Não interromper a fila curricular por causa dela.

**Atualização de governança — D067:** a Research Foundry registrou que a **Issue #47 é a autoridade do pós-90/90**. O Observatório passa a ser material subordinado às gates de #47 e **não abre fila paralela**; onde houver divergência, #47 vence. A contribuição exclusiva preservada é a medição de aprendizagem fora do motor adaptativo, incluindo a linha de base anterior ao primeiro uso sério.