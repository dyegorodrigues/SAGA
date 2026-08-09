# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`. Tudo até Simulação Longitudinal está fechado; próxima tarefa única: **auditoria sistêmica de gamificação / economia / mascote**.

## Leia primeiro

1. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md` — fonte operacional mais nova;
2. `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md` — checkpoint histórico imediatamente anterior;
3. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md` — dívida curricular/visual/primitivas;
4. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md` — ontologia pedagógica.

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

P17–P22/cânone; Radar/source/persist/DAG/Oficina causal; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; **Simulação Longitudinal**.

Simulação funcional: `1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`, CI #778 / run `31321595071`, **152 arquivos / 2.340 testes**, build/TypeScript/auditores/higiene/binários/Chrome verdes; artefato `9040333829`.

Bugs longitudinais provados/corrigidos:

- fallback não pode virar fronteira dominante ensinável do Sensei;
- Oficina bem-sucedida precisa resolver a misconception do **alvo** para ter saída, sem apagar a causa do source quando o resgate desce a pré-requisito.

A simulação permanente cobre: iniciante, ritmo típico, alta facilidade, mastery multisessão, RT lento, revisão/retorno, Oficina, Misto, Matrícula, Dojo manual/prescrito, Jardim causal, prioridade de prerequisito e persistência/reload.

## Próxima tarefa — gamificação / economia / mascote

Não redesenhar por estética. Primeiro auditar a cadeia real:

`answer/terminal → estrelas/moedas/XP/eventos → carteira/economia → álbum/mascote → UI/consumo → persistência → eventual efeito sobre progressão`.

Provar especialmente que:

- estrelas, moedas, XP, streaks cosméticos e mascote não concedem `dom`, unlock, nível conceitual ou avanço de Dojo;
- compras/equipamentos/álbum não alteram o currículo;
- recompensas não premiam velocidade de modo que ganhe autoridade conceitual;
- economia não duplica prêmio em retry/warmup/review indevidamente;
- logout/reload/cloud preservam saldos sem misturar UID;
- qualquer vínculo com Creature Engine fica apenas inventariado — **não tocar nele**.

Primeiro inventário + regressões; patch apenas para bug provado.

## Dívida curricular não perdida

Composer 26/90; servido sem placeholder 51/90; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`.

A fábrica continua depois da Coverage Matrix.

## Fila

gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release.

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
