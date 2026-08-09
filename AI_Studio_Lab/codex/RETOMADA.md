# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`. Tudo até Cloud Reconciliation está fechado; próxima tarefa única: **simulação longitudinal**.

## Leia primeiro

1. `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md` — fonte operacional mais nova;
2. `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md` — checkpoint histórico imediatamente anterior;
3. `PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md` — hipóteses e matriz que originaram o bloco agora fechado;
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia pedagógica.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- GitHub remoto é a fonte da verdade.

## Fechado — não reabrir sem falha objetiva

- P17–P22/cânone;
- Radar/source/persist/DAG/Oficina causal;
- Tutor↔Dojo `manual | prescribed`;
- QA Chrome real;
- Jardim causal;
- banco composto por source + `review/sig`;
- telemetria v2 + Leitner no source real;
- `LENTO_DEDOS` sem autoridade conceitual;
- timezone/dia civil;
- recomendador paralelo por estrelas removido;
- Misto por repertório dominado/elegível;
- Matrícula adaptativa sem teto de série;
- **Cloud Reconciliation**: stale writer transacional, isolamento de UID, anonymous→Google, materialização, round-trip, offline/retry, duas abas e dois dispositivos.

Cloud funcional: `f76017e3a8ed2a15fb5561f2fc886f6445964168`, CI #766 / run `31319778442`, **150 arquivos / 2.325 testes**, build/TypeScript/auditores/higiene/binários/Chrome verdes; artefato `9039831130`.

## Próxima tarefa — simulação longitudinal

Não abrir gamificação, mascote ou fábrica curricular antes dela.

Construir simulação determinística e longitudinal do Learner Model/Sensei cobrindo pelo menos:

- iniciante absoluto;
- ritmo típico;
- alta facilidade/avanço rápido;
- dificuldade persistente e remediação causal;
- esquecimento + revisão/Leitner;
- retorno após intervalo;
- interação Sensei ↔ Dojo ↔ Jardim ↔ Oficina ↔ Misto elegível;
- Matrícula → sessões posteriores;
- persistência/reload entre sessões sem alterar a causalidade pedagógica.

Método: estado inicial → eventos/respostas → motor → persistência → próxima sessão → invariantes. Primeiro regressões/invariantes, depois somente patches de bugs realmente provados.

## Dívida curricular não perdida

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 prontos em legado;
- 39 prontos em fallback;
- 21 divergências ficha↔tela;
- 12 trocas visuais;
- 44 estreias a classificar;
- primitivas incompletas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100, Regua.

A fábrica curricular continua depois da Coverage Matrix.

## Fila

simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.

## Gates

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

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
