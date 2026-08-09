# Handoff de continuidade — SAGA

> **VIGENTE — 9/ago/2026.** Fonte principal: `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`. Próximo bloqueante único: **auditoria sistêmica de gamificação / economia / mascote**.

## Regra de ouro

- repo `dyegorodrigues/SAGA`;
- branch única `codex/integrar-bloco-f0`;
- main `68fad4c575e28959b2ca4776e9a541d6828b63f3` protegida;
- PR #29 open + draft + não mesclar/ready/auto-merge;
- não tocar Creature Engine;
- não criar branch auxiliar;
- reancorar PR/head antes de editar;
- GitHub remoto é a fonte da verdade.

## Leia primeiro

1. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `BRIEFING_CODEX.md`
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

## Fechado

P17–P22/cânone; Radar/source/persist; Sensei/DAG/Oficina; Tutor↔Dojo; QA Chrome; Jardim causal; banco composto; telemetria/Leitner; `LENTO_DEDOS`; timezone; recomendador por estrelas removido; Misto elegível; Matrícula adaptativa; Cloud Reconciliation; **Simulação Longitudinal**.

Simulação funcional:

- head `1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`;
- CI #778 / run `31321595071`;
- 152 arquivos / 2.340 testes;
- build/TypeScript/auditores/higiene/binários/Chrome verdes;
- artefato `9040333829`.

Bugs provados/corrigidos:

- fallback não pode virar fronteira dominante ensinável do Sensei;
- Oficina recuperada limpa a misconception do alvo e tem saída, sem apagar a causa do source quando trabalha um pré-requisito.

Simulações permanentes provam: iniciante, ritmo típico, alta facilidade, domínio multisessão, RT sem autoridade conceitual, revisão/retorno, Oficina, Misto, Matrícula, Dojo manual/prescrito, Jardim causal, prioridade de prerequisito e persistência/reload sem mudar a próxima decisão.

## Próxima tarefa — gamificação / economia / mascote

Trace:

`answer/terminal → estrelas/moedas/XP/eventos → carteira/economia → álbum/mascote → UI/consumo → persistência → efeitos sobre progressão`.

Primeiro inventário e regressões. Provar que:

- gamificação não compra `dom`, unlock, nível curricular nem avanço de Dojo;
- velocidade não ganha autoridade conceitual via recompensa;
- retry/warmup/review/remount não duplicam prêmio;
- compras/equipamentos/álbum não alteram learner state;
- saldos/álbum sobrevivem reload/cloud e continuam por UID;
- terminal reprocessado é idempotente quando necessário;
- qualquer vínculo com Creature Engine é apenas inventariado — **não tocar nele**.

## Dívida curricular não perdida

26 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas no inventário. Fábrica somente depois da Coverage Matrix.

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**
