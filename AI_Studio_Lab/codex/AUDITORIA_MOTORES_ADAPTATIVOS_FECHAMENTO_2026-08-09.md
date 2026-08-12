# Fechamento autoritativo — auditoria dos motores adaptativos

**Data:** 9/ago/2026  
**Complementa:** `AUDITORIA_MOTORES_ADAPTATIVOS.md`  
**Fonte operacional vigente:** `CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`

> O arquivo original de auditoria preserva a sequência histórica de hipóteses, bugs e correções. As seções antigas que ainda chamam reconciliação, origem do Dojo, sonda real ou Jardim causal de “pendentes” são **históricas**. Este fechamento registra o estado efetivamente provado depois daqueles diagnósticos.

## 1. Fechado depois da auditoria original

### Cânone

- Bíblia/Manual/Método reconciliados;
- grafo 90 / fichas 94 / cobertura 90/90;
- RT separado de domínio conceitual;
- regra 3/3 alinhada ao runtime;
- guard documental incorporado ao CI.

### Tutor ↔ Dojo

- origem de sessão explícita `manual | prescribed`;
- manual nunca move ponteiro adaptativo;
- prescribed pode mover ponteiro pelo motor existente;
- manual continua atualizando força/RT/precisão/volume;
- round parcial não mistura origens;
- prescrição materializada com `source="prescribed"`;
- UI preserva Aula conceitual, Dojo prescrito e treino livre como portas distintas;
- `utils/dojoMode.ts` deixou de ser autoridade do Tutor.

### QA real

A sonda deixou de ser intenção e virou gate do CI existente:

- Chrome real;
- telefone 390×844;
- tablet 768×1024;
- screenshots;
- overflow;
- HTTP/page errors;
- fluxo até o exercício real.

### Jardim causal

Novo planner: `jardimCausalPrescription.ts`.

Não existe roteamento arbitrário `misconception → Jardim`. A prescrição exige:

1. misconception ativa;
2. mãe JD no próprio nó observado ou em seu caminho de pré-requisitos;
3. mãe conceitualmente elegível;
4. fraqueza JD já observada;
5. ausência de `prerequisite-gap` conceitual mais prioritário.

Fraqueza JD é evidência de automaticidade — `weakRounds`, recuo de degrau ou precisão histórica baixa com amostra mínima —, não idade, estrela, ausência de treino ou um acerto lento isolado.

Prioridade vigente:

`prerequisite-gap conceitual → Jardim causal provado → misconception/Oficina → Aula normal`.

## 2. Evidência de fechamento

Head funcional: `15f73542ddb1f005fd228ac02461c5a71ea8adec`.

CI #671 / run `31307946962` = **SUCCESS integral**:

- auditores;
- grafo;
- TypeScript;
- 142 arquivos / 2.278 testes;
- build;
- pr:check;
- higiene;
- guarda de binários;
- Chrome real.

Artefato visual: `9036527545`, com Dojo prescrito e Jardim causal em telefone/tablet.

## 3. Próxima auditoria longitudinal

**Identidade do banco de erros composto.**

Hipótese já localizada em `composer.ts`:

- `bankQs` é global e mistura bancos de vários sources;
- `rescueQueue` cria closure para cada resgate;
- `error-bank` consome `bankQs.pop()` sem filtrar pelo source do `RescuePlanItem`.

A próxima conversa deve provar ou refutar:

`resgate A → item de banco B`.

Cadeia completa:

`planAula(error-bank source) → bankQs/rescueQueue → questão/source → GameLoop/review → progressEngine/materialize → bank mutation → próximo planAula`.

Não corrigir antes de uma regressão determinística com dois bancos-fonte.

## 4. Depois

telemetria/Leitner da Aula composta → `LENTO_DEDOS` → timezone → recomendador paralelo → Misto elegível → Matrícula → cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

A dívida curricular detalhada está em `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.
