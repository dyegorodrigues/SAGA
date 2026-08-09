# Briefing operacional — continue daqui

> **VIGENTE em 9/ago/2026.** Fonte principal: `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`. Próximo bloqueante único: **auditoria sistêmica de gamificação / economia / mascote**.

## Leia

1. `CHECKPOINT_SIMULACAO_LONGITUDINAL_FECHADA_2026-08-09.md`
2. `RETOMADA.md`
3. `CHECKPOINT_CLOUD_RECONCILIATION_FECHADA_2026-08-09.md`
4. `INVENTARIO_LIMBO_E_COBERTURA_2026-08-09.md`
5. `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`

Repo `dyegorodrigues/SAGA`; branch única `codex/integrar-bloco-f0`; PR #29 open + draft + unmerged. Não tocar na main `68fad4c575e28959b2ca4776e9a541d6828b63f3`, no Creature Engine, nem criar branch auxiliar. Reancorar PR/head remoto antes de editar.

## Não reabra

Cânone, Tutor↔Dojo, QA Chrome, Jardim causal, banco composto, telemetria/Leitner, `LENTO_DEDOS`, timezone, recomendador por estrelas, Misto elegível, Matrícula adaptativa, Cloud Reconciliation e **Simulação Longitudinal** estão fechados.

Simulação funcional:

- head `1353dcd515d2f0dcb44abbc67de6f7fafc24cf9d`;
- CI #778 / run `31321595071`;
- 152 arquivos / 2.340 testes;
- build/TypeScript/auditores/higiene/binários/Chrome verdes;
- artefato `9040333829`.

Bugs longitudinais provados/corrigidos:

1. fallback podia virar fronteira dominante do Sensei e criar beco sem saída;
2. Oficina bem-sucedida podia reaparecer porque a misconception resolvida do alvo continuava ativa.

Contratos longitudinais agora permanentes:

- iniciante recebe alvo realmente ensinável;
- ritmo típico tolera erro isolado sem distorcer a escada;
- alta facilidade não compra domínio: coroa exige evidência madura e sessão espaçada;
- RT lento não reprova compreensão;
- revisão/retorno respeitam dia civil;
- Oficina tem saída causal;
- Misto só usa repertório dominado + praticado;
- Matrícula não concede `dom`;
- Dojo livre não move ponteiro adaptativo;
- Dojo prescrito move somente seu estado;
- Jardim exige fraqueza observada e sai após recuperação;
- pré-requisito conceitual vence Jardim;
- persistir/recarregar não muda a próxima decisão nem mistura conceito e automaticidade.

## Faça agora — gamificação / economia / mascote

Audite a cadeia real antes de redesenhar qualquer coisa:

`answer/terminal → estrelas/moedas/XP/eventos → carteira/economia → álbum/mascote → UI/consumo → persistência → efeitos sobre progressão`.

Prove explicitamente:

1. estrelas/moedas/XP/streak cosmético/mascote não concedem `dom`, unlock, nível conceitual ou avanço adaptativo do Dojo;
2. recompensa por velocidade não ganha autoridade conceitual;
3. retry, warmup, review e telas intermediárias não duplicam prêmio indevidamente;
4. compra/equipamento/álbum não altera learner state curricular;
5. saldo/álbum sobrevivem persistência/reload/cloud e continuam escopados por UID;
6. recompensa é idempotente quando um terminal é reprocessado ou uma tela remonta;
7. qualquer vínculo com Creature Engine é apenas inventariado — **não tocar naquele módulo**.

Primeiro inventário + regressões. Patch somente para bug realmente provado.

## Dívida curricular continua inventariada

26/90 Composer; 25 prontos em legado; 39 prontos em fallback; 21 divergências ficha↔tela; 12 trocas visuais; 44 estreias; primitivas incompletas no inventário. Não iniciar fábrica antes da Coverage Matrix.

## Depois

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
