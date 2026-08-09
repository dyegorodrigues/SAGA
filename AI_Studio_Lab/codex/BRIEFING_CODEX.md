# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_MISTO_FECHADO_2026-08-09.md`. Próximo bloqueante: **Matrícula adaptativa sem grade rígida**.

## Leia

1. `CHECKPOINT_MISTO_FECHADO_2026-08-09.md`
2. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
3. `RETOMADA.md`
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 draft/unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone, recomendador por estrelas e Misto elegível estão fechados.

Evidência mais nova: Misto em `ae47e417332fb7c02134bdda871c853535863838`, CI #733 / run `31311494765`, integralmente verde inclusive Chrome real.

## Faça agora — Matrícula adaptativa

Problemas provados:

- `App.tsx` passa `tracks[kid.grade]`;
- `CORE_IDS` tem 9 âncoras, mas `MAX_TRACKS=6` corta as finais;
- só trocar para `ALL_MATH_TRACKS` continuaria subposicionando criança avançada;
- `GameLoop` chama `onCommit` antes de gerar a próxima questão, permitindo sessão adaptativa em closure.

### Cadeia

`DAG/conteúdo servido → âncora → pergunta → resposta → próxima âncora → seed → Sensei`.

### Regras

1. série/idade não limita teto;
2. só sondar conteúdo real, nunca fallback;
3. começar gentil;
4. subir após evidência consistente e manter/descer após erros;
5. não obrigar iniciante a conteúdo impossível;
6. placement não concede `dom`;
7. missão curta e lúdica;
8. regressões de iniciante/intermediário/avançado/fallback/seed;
9. gates completos + Chrome se fluxo visual mudar;
10. checkpoint.

## Dívida curricular continua inventariada

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; primitivas incompletas no inventário. Não iniciar fábrica antes da Coverage Matrix.

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
