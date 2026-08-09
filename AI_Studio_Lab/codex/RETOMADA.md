# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Cânone, Tutor↔Dojo, QA real e Jardim causal estão fechados. A próxima tarefa exata é **identidade do banco de erros composto**. Checkpoints anteriores continuam no repositório como histórico; não use suas filas antigas como ordem vigente.

## 1. Primeira leitura

1. [`CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md`](./CHECKPOINT_FINAL_CONTINUIDADE_2026-08-09.md) — **fonte operacional mais nova**;
2. [`INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`](./INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md) — dívida real de conteúdo, primitivas, ficha↔tela e hardening;
3. [`AUDITORIA_MOTORES_ADAPTATIVOS.md`](./AUDITORIA_MOTORES_ADAPTATIVOS.md) — histórico da auditoria longitudinal; suas antigas “próximas tarefas” foram superadas pelo checkpoint novo;
4. [`DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`](./DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md) — ontologia pedagógica;
5. [`PLANO_POS_P22_FABRICA_CURRICULAR.md`](./PLANO_POS_P22_FABRICA_CURRICULAR.md) — plano de fábrica; **não executar a fábrica antes da Coverage Matrix**.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 deve permanecer **open + draft + não mesclada**;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- não usar workflow/publicador temporário residual;
- não reescrever documentação pedagógica rica para “arrumar número”.

Sempre reancorar PR/head remoto antes de editar. Um SHA dito no chat não é fonte de verdade até ser confirmado no GitHub.

## 3. Fechado — não reabrir sem falha objetiva

- P17, P8, P18, P19, P20, P21.1, P21.2, P22.1–P22.5;
- grafo/cânone em 90 competências e 94 fichas;
- cobertura autoral 90/90;
- Radar tag→nó;
- Aula composta → `sourceTrackId` → persist;
- Sensei full DAG, sem série como trilho curricular;
- Oficina causal pela mesma porta do Tutor;
- reconciliação Bíblia/Manual/Método + guard documental;
- Tutor↔Dojo com origem explícita `manual | prescribed`;
- Dojo prescrito separado da Aula e treino livre manual preservado;
- QA real em Chrome integrado ao CI;
- Jardim causal por DAG + evidência JD real.

Head funcional de fechamento destes blocos: `15f73542ddb1f005fd228ac02461c5a71ea8adec`.

CI de fechamento: **#671 / run `31307946962` = SUCCESS integral**, incluindo 2.278 testes e sonda real. Artefato visual: `9036527545`.

## 4. Arquitetura pedagógica vigente

- **Sensei:** professor/tutor prescritivo; uma meta dominante;
- **Jornada:** mapa do conhecimento;
- **Dojo:** automaticidade separada; prescrito + livre/manual;
- **Jardim:** automaticidade perceptual, prescritível apenas por causa provada;
- **Oficina:** recuperação conceitual causal, curta e com saída;
- **Misto:** opcional/interleaving;
- **idade/série:** contexto de apresentação, nunca autoridade de progressão;
- **gamificação:** não compra unlock/mastery;
- **RT/fluência:** não concede nem reprova domínio conceitual.

Prioridade da porta do Sensei quando há dificuldade:

`pré-requisito conceitual → Jardim causal comprovado → misconception/Oficina → Aula normal`.

## 5. Estado de cobertura — não confundir “ficha existe” com “runtime pronto”

- padrão-ouro/Composer ativo: **26/90**;
- servido sem placeholder: **51/90**;
- ficha pronta, servida por legado: **25**;
- ficha pronta, sem conteúdo servido/fallback: **39**;
- divergências ficha↔tela observadas: **21**;
- trocas de linguagem visual sem aviso: **12**;
- estreias de ferramenta a classificar: **44**;
- primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

Lista exata e bloqueios estão em `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`.

**A fabricação de exercícios não foi abandonada.** Ela volta depois de identidade dos motores + Coverage Matrix. Não iniciar 39 fallbacks em massa agora.

## 6. Próxima tarefa exata — banco de erros composto

Pré-auditoria encontrou uma hipótese concreta em `composer.ts`:

- bancos de vários tracks viram um `bankQs` global embaralhado;
- cada `RescuePlanItem` de `error-bank` cria uma closure;
- a closure usa `bankQs.pop()` sem indexar pelo track que originou aquele resgate.

Possível bug: resgate planejado para A pode servir item armazenado por B. A questão pode persistir corretamente em B por `sourceTrackId`, mas a **agenda do resgate** fica incoerente.

### Não corrigir por intuição

Trace primeiro:

`planAula(error-bank source) → bankQs/rescueQueue → questão/source → GameLoop/review → progressEngine/materialize → bank mutation → próximo planAula`.

Depois:

1. regressão determinística com pelo menos dois bancos-fonte;
2. provar/refutar a mistura;
3. se provada, corrigir identidade por source/rescue;
4. provar remoção/atualização do bank certo;
5. gates completos;
6. checkpoint.

Não misturar ainda com telemetria/Leitner; isso é o bloco seguinte.

## 7. Fila depois do banco

1. identidade de telemetria/Leitner na Aula;
2. `LENTO_DEDOS` canônico;
3. timezone/`lastDay`;
4. recomendador paralelo por estrelas — retirar autoridade concorrente;
5. Misto por repertório elegível;
6. Matrícula sem grade rígida;
7. cloud reconciliation;
8. simulação longitudinal;
9. gamificação/economia/mascote;
10. Coverage Matrix executável;
11. fábrica curricular por ondas — 25 legados + 39 vazios + paridade + primitivas;
12. mega auditoria pedagógica;
13. hardening/performance/release.

## 8. Gates

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
npm run sonda:sensei-dojo
```

O CI da PR também executa higiene do diff e guarda de binários.

## 9. Regra de continuidade

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
