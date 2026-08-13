# Retomada — comece por aqui

> **PORTA DE ENTRADA OPERACIONAL ATUAL.**
>
> GitHub remoto é a fonte da verdade. Antes de qualquer edição, reancore PR,
> branch, HEAD, CI, reviews e review threads. Se houver deriva, o remoto vence.

## Primeiro movimento

1. abrir `dyegorodrigues/SAGA` PR #35;
2. confirmar `open + draft + unmerged`;
3. confirmar branch `codex/fechamento-curricular` e HEAD remoto;
4. conferir o CI completo do HEAD exato e os seis jobs;
5. conferir reviews e review threads;
6. ler `CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-13.md`;
7. ler `ESTADO_DO_FECHAMENTO.md`;
8. ler `CHECKPOINT_FABRICA_CURRICULAR_W11_AL03_F30_FECHADA_2026-08-13.md`;
9. para políticas de resolução/player, ler `AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md` e `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

## Estado curricular de retomada

W7, W8, W9, W10 e **W11** estão fechadas; R0-A está concluída.

### Recibo do canário inativo W11

- SHA `5988403f91a66919463ea478492560c54a8a051d`;
- CI #1219 / run `31662349768`;
- **success 6/6** no mesmo SHA;
- Gates + Sensei/F19/F61/F29/F36/F13/F15/F14/F30 + transversal 390×8 + 320/900 + higiene + binários.

### Promoção W11

- promoção semântica: `7052c93b909883a671e6555e413a6992d4c5e8db`;
- a Matrix observou, antes do ledger: `36 Composer / 16 legado / 38 fallback / 52 servidas / 12 divergências / 12 swaps / 44 estreias`;
- não houve reconciliação adicional de observabilidade;
- ledger: `W11-AL.03 = { composer:+1, legacy:-1, divergences:-1 }`.

A Matrix vigente reconciliada é:

`36 Composer / 16 legado / 38 fallback / 52 servidas / 12 divergências / 12 swaps / 44 estreias`.

## Próxima onda

Próxima onda autorizada: **W12 `N4.01/F97`**.

Scratch branch: `codex/w11-w12-drafts`.

`AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md` é **não executável** e **não fonte de verdade**. Reancore W12 contra a ficha canônica F97, Curriculum Graph, Coverage Matrix e código atual antes do regression-first. Não faça merge cego da scratch branch.

## W11 — fatos que não podem ser regredidos

- `AL.03` tem pré-requisitos canônicos `N1.09 + N2.01`;
- `SkipCountStage` reutiliza `InteractiveNumberLineSurface`; não existe segunda reta;
- L1: 2 em 2 com reta/arcos;
- L2: 10 em 10 com reta;
- L3: 5 em 5 com reta + `Quadrado100`;
- L4: sequência escrita sem manipulável, generalizando saltos 2..10;
- L5: início deslocado, mental; teste determinístico materializa `3 em 3 a partir de 6`;
- `resolucao()` nasce sob R0-A, com snapshots declarativos/idempotentes;
- mastery é `3/3` em duas sessões e exige pelo menos dois saltos distintos via evidências históricas;
- RT/`fluencyStreak` continuam telemetria: não compram mastery, unlock ou XP.

## Protocolo permanente

`regression-first → implementação INATIVA → gates + Chrome real no mesmo SHA → promoção → Matrix observa → reconciliação de observabilidade, se necessária → ledger → checkpoint → CI do HEAD exato`.

Nunca fechar por procuração usando verde de outro SHA.

## Escopo

- não tocar `main`;
- PR #35 permanece draft;
- nenhum merge/ready/auto-merge sem autorização humana explícita;
- Creature Engine fora desta fila;
- Thinking Engine runtime não autorizado;
- políticas de player ficam em `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
- nenhuma faxina P2 oportunista;
- snapshot P21.1 permanece imutável.

## Documentos históricos

Checkpoints anteriores continuam preservados como proveniência. Não os reescreva para parecer atuais. Para o estado corrente, use as portas de entrada desta página e sempre confirme o remoto primeiro.
