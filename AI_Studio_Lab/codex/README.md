# SAGA — continuidade e auditoria Codex

Esta pasta preserva checkpoints, auditorias, decisões e handoffs do SAGA. Ela
contém tanto **fontes operacionais atuais** quanto **documentos históricos**.

## Para retomar agora

Leia nesta ordem:

1. [`RETOMADA.md`](./RETOMADA.md)
2. [`CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-12.md`](./CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-12.md)
3. [`ESTADO_DO_FECHAMENTO.md`](./ESTADO_DO_FECHAMENTO.md)
4. [`CHECKPOINT_FABRICA_CURRICULAR_W10_N3_03_FECHADA_2026-08-12.md`](./CHECKPOINT_FABRICA_CURRICULAR_W10_N3_03_FECHADA_2026-08-12.md)
5. [`AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`](./AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md)
6. [`PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`](./PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md)

Antes de editar, reancore o PR #35 no GitHub e confirme HEAD/CI/reviews.

## Linha operacional

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/fechamento-curricular`;
- PR: #35, mantido draft/open/unmerged;
- próxima onda: W11 `AL.03/F30`;
- W12 `N4.01/F97` vem depois;
- scratch remota de rascunhos: `codex/w11-w12-drafts`, fora do PR.

## Como interpretar o diretório

Arquivos datados antigos, roteiros e checkpoints anteriores são **proveniência
histórica**. Eles não devem ser apagados nem “modernizados” para esconder o estado
em que foram escritos.

Os arquivos da seção “Para retomar agora” são as portas de entrada correntes.
Mesmo eles não superam o GitHub remoto: se HEAD/CI divergir, investigue primeiro.

## Invariantes

- nenhum patch direto em `main`;
- nenhum merge sem autorização explícita;
- Creature Engine fora desta linha;
- Thinking Engine runtime não autorizado;
- gate vermelho é evidência;
- verde precisa pertencer ao SHA que se pretende fechar;
- snapshots históricos da Coverage Matrix permanecem imutáveis;
- políticas do player são tratadas separadamente da fábrica curricular.
