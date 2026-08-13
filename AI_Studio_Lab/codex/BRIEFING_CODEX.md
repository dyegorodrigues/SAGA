# Briefing operacional — SAGA

> **Não use números/PRs antigos deste diretório por memória.**
> A porta canônica é `RETOMADA.md`.

## Reancoragem obrigatória

- repo `dyegorodrigues/SAGA`;
- PR #35;
- branch `codex/fechamento-curricular`;
- confirmar `open + draft + unmerged`;
- confirmar HEAD remoto, CI completo do próprio HEAD e review threads;
- ler `CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-12.md` e
  `ESTADO_DO_FECHAMENTO.md`.

## Estado resumido

- W7–W10 fechadas; R0-A concluída;
- Matrix pós-W10: `35/17/38/52/13`, com `12 swaps / 44 estreias`;
- próxima onda: W11 `AL.03/F30`;
- rascunhos W11/W12 estão em `codex/w11-w12-drafts` e são não executáveis;
- políticas do player continuam estacionadas.

## Regra de execução

Para W11:

`regression-first → registrada/inativa → gates + Chrome real no mesmo SHA →
promoção → Matrix observa → ledger → checkpoint → CI do HEAD exato`.

Não criar segunda reta: reusar `InteractiveNumberLineSurface`.
Não inventar primitiva para satisfazer Matrix.
Não enfraquecer gate.
Não fechar por verde de SHA anterior.

## Limites

Não tocar `main`, Creature Engine ou Thinking Engine runtime.
PR #35 continua draft e nenhum merge ocorre sem autorização humana explícita.
