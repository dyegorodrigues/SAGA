# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`. Tudo até a Matrícula adaptativa está fechado; próxima tarefa única: **cloud reconciliation**.

## Leia primeiro

1. `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md` — fonte operacional mais nova e registro da recuperação pós-trava;
2. `PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md` — matriz e hipóteses do próximo bloco;
3. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
4. `CHECKPOINT_MISTO_FECHADO_2026-08-09.md` — checkpoint histórico anterior;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 open + draft + não mesclar;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head remoto antes de editar;
- GitHub remoto é a fonte da verdade: não confiar em afirmação de chat sem arquivo/commit/run.

## Fechado — não reabrir sem falha objetiva

- P17–P22/cânone;
- 90 competências / 94 fichas / cobertura 90/90;
- Radar/source/persist/DAG/Oficina causal;
- Tutor↔Dojo `manual | prescribed`;
- QA real Chrome no CI;
- Jardim causal;
- banco composto por source + `review/sig` — CI #682;
- telemetria v2 + Leitner no source real — CI #691;
- `LENTO_DEDOS` sem autoridade conceitual — CI #702;
- timezone/dia civil unificado — CI #717;
- recomendador paralelo por estrelas removido — CI #720;
- Misto por repertório dominado/elegível — CI #733;
- **Matrícula adaptativa sem teto de série** — cabeça funcional `f4ed86fcd70241e6324392b40bd457d44279ba61`, CI #744 / run `31314596574`, 149 arquivos / 2.309 testes + build + Chrome real; artefato `9038385938`.

## Próxima tarefa — cloud reconciliation

Leia `PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md` antes de editar.

Cadeia:

`auth/UID → local save → cloud save → reconcile → migrate/materialize → React state → writers → logout/troca de conta → anonymous→Google → offline/reconexão → concorrência`.

Faça primeiro a matriz de regressão: nenhum save, local-only, cloud-only, local/cloud mais novo, empate, carimbo ausente/inválido, schema antigo, UID divergente, troca de conta, anonymous→Google, offline, duas abas e writes fora de ordem entre dispositivos.

Não inventar merge campo-a-campo sem contrato. Provar perda/corrupção antes de corrigir.

**Não pedir ao autor para abrir Firebase Console, gerar token ou configurar projeto para iniciar este bloco.** A lógica pode e deve ser auditada/testada com código, Vitest e mocks. Qualquer operação futura exclusiva de Console/deploy deve ser isolada como `DEPLOYMENT-ONLY` e não bloquear o desenvolvimento.

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

## Depois

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
