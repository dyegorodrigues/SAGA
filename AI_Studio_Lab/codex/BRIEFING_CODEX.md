# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`. Próximo bloqueante: **cloud reconciliation**.

## Leia

1. `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md`
2. `PREAUDITORIA_CLOUD_RECONCILIATION_2026-08-09.md`
3. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
4. `RETOMADA.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 draft/unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head antes de editar e usar o remoto como fonte da verdade.

## Não reabra

Cânone, Tutor↔Dojo, QA real, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone, recomendador por estrelas, Misto elegível e Matrícula adaptativa estão fechados.

Matrícula funcional: `f4ed86fcd70241e6324392b40bd457d44279ba61`, CI #744 / run `31314596574`, 149 arquivos / 2.309 testes, build e Chrome real verdes; artefato `9038385938`.

## Faça agora — cloud reconciliation

Cadeia obrigatória:

`auth/UID → local save → cloud save → reconcile → migrate/materialize → React state → writers local/cloud → logout/troca de conta → anonymous→Google → offline/reconexão → duas abas/dispositivos concorrentes`.

Antes de alterar produção:

1. completar/rodar a matriz do documento de pré-auditoria;
2. provar autoridade de `State.updatedAt` versus horário de chegada do write Firestore;
3. provar isolamento entre UID A e UID B;
4. provar anonymous→Google;
5. provar comportamento offline e reconexão;
6. provar writes fora de ordem;
7. preservar `dojoTracks`, mastery, banco, revisão, `lastDay` e schema em migração/reconcile;
8. não criar merge campo-a-campo sem especificação;
9. regressão antes do patch;
10. gates completos e checkpoint.

### Firebase

Não pedir ao autor token, service account, ID novo nem configuração de Console para começar. O bloco é testável por código/Vitest/mocks usando os contracts atuais. Se uma necessidade exclusiva de Console/deploy aparecer depois, isolar como `DEPLOYMENT-ONLY` e continuar o que independe dela.

## Dívida curricular continua inventariada

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas no inventário. Não iniciar fábrica antes da Coverage Matrix.

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
