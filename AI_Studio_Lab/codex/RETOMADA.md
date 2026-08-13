# Retomada — comece por aqui

> **PORTA DE ENTRADA OPERACIONAL ATUAL.**
>
> Não retome a fábrica por documentos históricos datados. GitHub remoto é a fonte
> da verdade e todo agente deve reancorar PR/HEAD/CI antes de editar.

## Primeiro movimento

1. abrir `dyegorodrigues/SAGA` PR #35;
2. confirmar `open + draft + unmerged`;
3. confirmar branch `codex/fechamento-curricular` e HEAD remoto;
4. conferir o CI completo do HEAD, os seis jobs e review threads;
5. ler `CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-12.md`;
6. ler `ESTADO_DO_FECHAMENTO.md`;
7. ler o checkpoint W10, a auditoria de palcos compostos e as pendências do player.

Se houver divergência entre estes arquivos e o GitHub, o remoto vence e a deriva
deve ser investigada antes de qualquer implementação.

## Estado curricular de retomada

W7, W8, W9 e W10 estão fechadas; R0-A está concluída.

Recibo de produto W10:
`0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`,
CI #1195 / run `31655630072`, seis jobs verdes no mesmo SHA.

Matrix:
`35 Composer / 17 legado / 38 fallback / 52 servidas / 13 divergências / 12 swaps / 44 estreias`.

Próxima onda: **W11 `AL.03/F30`**.  
Depois: W12 `N4.01/F97`.

## Remote-first dos rascunhos

Scratch branch: `codex/w11-w12-drafts`.

Os rascunhos W11/W12 são não executáveis, fora do PR #35 e não são fonte de
verdade. Reancore-os contra ficha, grafo, Matrix e código atual; não faça merge
cego da scratch branch.

## Protocolo permanente

`regression-first → implementação INATIVA → gates + Chrome real no mesmo SHA →
promoção → Matrix observa → reconciliação de observabilidade, se necessária →
ledger → checkpoint → CI do HEAD exato`.

Nunca fechar por procuração usando o verde de outro SHA.

## Escopo

- não tocar `main`;
- PR #35 permanece draft;
- nenhum merge/ready/auto-merge sem autorização humana explícita;
- Creature Engine fora desta fila;
- Thinking Engine runtime não autorizado;
- políticas de player ficam em `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
- nenhuma faxina P2 oportunista.

## Documentos históricos

Checkpoints e roteiros datados anteriores continuam preservados como proveniência.
Eles não são apagados nem reescritos para parecer atuais. Para estado corrente,
use apenas as portas de entrada acima.
