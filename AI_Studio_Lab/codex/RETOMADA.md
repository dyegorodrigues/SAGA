# Retomada — ponte para a porta operacional viva

> **Este arquivo é deliberadamente atemporal.** Ele não contém número de onda, Matrix, SHA curricular, fila nem próxima competência. Isso evita que uma ponte antiga concorra com o estado vivo.

## Único procedimento de retomada

1. abrir `dyegorodrigues/SAGA`, PR #35;
2. confirmar que o PR continua `open + draft + unmerged`;
3. confirmar branch `codex/fechamento-curricular`, HEAD remoto e `main` protegida;
4. conferir workflows do SHA relevante, reviews e review threads;
5. ler **integralmente** `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md` — esta é a porta operacional principal;
6. usar `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md` apenas como índice vivo resumido;
7. abrir somente os checkpoints que a porta operacional atual indicar como relevantes;
8. se qualquer texto divergir de GitHub remoto, canário, DAG, Coverage Matrix, runtime map ou gates executáveis, as fontes executáveis vencem.

## Regra de manutenção

- Não adicionar aqui estado curricular duplicado.
- Não congelar aqui “próxima onda”, contagens ou recibos.
- Checkpoints datados são históricos e não devem ser reinterpretados como porta viva.
- Toda mudança de fase deve ser registrada em `PROMPT_DE_RETOMADA.md` e, quando pertinente, em `ESTADO_DO_FECHAMENTO.md` e no corpo do PR #35.

Assim, `RETOMADA.md` permanece apenas uma ponte estável e não volta a virar fonte de memória obsoleta.