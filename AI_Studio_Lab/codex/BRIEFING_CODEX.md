# Briefing operacional — SAGA

> **Ponte operacional atemporal.** Este arquivo não mantém snapshot curricular próprio. A porta canônica é `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.

## Reancoragem obrigatória

- repo `dyegorodrigues/SAGA`;
- PR #35;
- branch `codex/fechamento-curricular`;
- confirmar `open + draft + unmerged`;
- confirmar HEAD remoto e base `main`;
- conferir workflows do SHA relevante, reviews e review threads;
- ler `PROMPT_DE_RETOMADA.md` integralmente;
- usar `ESTADO_DO_FECHAMENTO.md` como resumo, não como substituto dos gates executáveis.

Não inferir estado a partir de checkpoints datados, nomes como “final”/“nova conversa” ou memória de chat. GitHub remoto, DAG, canário, Coverage Matrix, runtime map e gates do SHA relevante vencem.

## Regra genérica de execução

A fábrica curricular segue o protocolo definido na porta operacional viva. Em linhas gerais:

`regression-first → materialização registrada/inativa → CI + transversal verdes no mesmo SHA inativo → promoção atômica → Matrix observa o delta real → CI + transversal verdes no SHA final → fechamento documental → recálculo causal da próxima onda`.

Não congelar aqui a identidade da onda atual. Não criar primitivas apenas para satisfazer Matrix. Não enfraquecer gates. Não fechar por verde de SHA anterior. Não misturar recibos.

## Limites

Não tocar/mergear `main`, não marcar PR ready, não habilitar auto-merge e não tocar Creature Engine/Tamagotchi nesta linha de trabalho. Cânone compartilhado permanece aditivo.