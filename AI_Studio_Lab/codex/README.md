# SAGA — continuidade e auditoria Codex

Esta pasta preserva **fontes operacionais atuais** e **documentos históricos**. Para evitar deriva, este README é deliberadamente um índice estável: ele não registra onda corrente, Matrix, SHA curricular nem “próxima competência”.

## Para retomar trabalho

1. Reancore diretamente no GitHub o repo `dyegorodrigues/SAGA`, PR #35, branch `codex/fechamento-curricular`, HEAD, base `main`, workflows, reviews e review threads.
2. Leia **integralmente** [`PROMPT_DE_RETOMADA.md`](./PROMPT_DE_RETOMADA.md). Essa é a porta operacional principal.
3. Use [`ESTADO_DO_FECHAMENTO.md`](./ESTADO_DO_FECHAMENTO.md) somente como índice vivo resumido.
4. [`RETOMADA.md`](./RETOMADA.md), [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md) e [`BRIEFING_CODEX.md`](./BRIEFING_CODEX.md) são pontes atemporais e não devem duplicar estado curricular.
5. Abra apenas os checkpoints e auditorias que a porta operacional atual indicar como relevantes.

Se qualquer texto divergir do GitHub remoto, do DAG, do canário, da Coverage Matrix, do runtime map ou dos gates executáveis do SHA relevante, as fontes executáveis vencem.

## Como interpretar o diretório

Arquivos datados, checkpoints de ondas anteriores, auditorias antigas e roteiros preservam proveniência histórica. **Não os modernize para fingir que sempre refletiram o estado atual** e não os use como handoff vivo só porque o nome contém “checkpoint”, “final”, “continuidade” ou “nova conversa”.

Uma mudança de fase corrente deve ser refletida em `PROMPT_DE_RETOMADA.md`, em `ESTADO_DO_FECHAMENTO.md` quando pertinente e no corpo do PR #35. As pontes estáveis acima não carregam números de onda por design.

## Invariantes de continuidade

- `main` não recebe patch direto nem merge desta fábrica;
- PR #35 permanece draft/open/unmerged até o fechamento integral;
- nenhum auto-merge ou ready sem autorização adequada;
- Creature Engine/Tamagotchi fica fora desta linha;
- vermelho regression-first é evidência e não deve ser “corrigido” relaxando contrato;
- verde só vale para o SHA ao qual pertence;
- não misturar recibos entre SHAs;
- snapshots/checkpoints históricos permanecem históricos;
- canário, ledger e Matrix seguem o protocolo da porta operacional viva.