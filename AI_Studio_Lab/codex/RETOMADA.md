# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_MISTO_FECHADO_2026-08-09.md`. Tudo até o Misto elegível está fechado; próxima tarefa única: **Matrícula adaptativa sem grade rígida**.

## Leia primeiro

1. `CHECKPOINT_MISTO_FECHADO_2026-08-09.md` — fonte operacional mais nova;
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
3. `CHECKPOINT_RECUPERACAO_POS_TRAVA_2026-08-09.md` — checkpoint histórico anterior;
4. `AUDITORIA_MOTORES_ADAPTATIVOS_FECHAMENTO_2026-08-09.md` — fechamento histórico até Jardim;
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia.

Checkpoints antigos permanecem históricos. Não usar filas antigas como ordem vigente.

## Git

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main protegida `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29 open + draft + não mesclar;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head remoto antes de editar.

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
- **Misto por repertório dominado/elegível** — CI #733 / run `31311494765`, head `ae47e417332fb7c02134bdda871c853535863838`, Chrome real verde.

## Próxima tarefa — Matrícula adaptativa

Problemas já provados:

- `App.tsx` ainda passa `tracks[kid.grade]` para a Matrícula;
- `matricula.ts` possui 9 âncoras, mas `MAX_TRACKS=6` corta as finais;
- trocar apenas a série por `ALL_MATH_TRACKS` ainda subposiciona crianças avançadas;
- `GameLoop` chama `onCommit` antes de gerar a próxima questão, portanto há uma janela segura para uma sessão de placement adaptativa em closure.

### Faça

1. usar universo canônico/DAG e apenas conteúdo realmente servido;
2. começar gentil;
3. registrar cada resultado e escolher a próxima âncora antes da próxima geração;
4. acertos consistentes permitem subir; erros mantêm a sondagem fundacional, sem expor iniciante a conteúdo impossível;
5. idade/série nunca vira teto;
6. placement semeia ponto de partida, não compra `dom`;
7. preservar missão curta e sem cara de prova;
8. regressões para iniciante, intermediário, avançado, fallback e seed;
9. gates completos + Chrome se o fluxo visual mudar;
10. checkpoint.

## Dívida curricular não perdida

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 prontos em legado;
- 39 prontos em fallback;
- 21 divergências ficha↔tela;
- 12 trocas visuais;
- primitivas incompletas: LinkingCubes, Moedas, SingaporeBars, VisualAddition, Quadrado100, Regua.

A fábrica curricular continua depois da Coverage Matrix.

## Depois

cloud reconciliation → simulação longitudinal → gamificação/economia → Coverage Matrix → fábrica curricular → mega auditoria → hardening.

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
