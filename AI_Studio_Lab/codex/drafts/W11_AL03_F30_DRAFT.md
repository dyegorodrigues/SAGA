# W11 — AL.03 / F30 — RASCUNHO REMOTO

> **NÃO EXECUTÁVEL · NÃO É FONTE DE VERDADE · NÃO INTEGRA O PR #35.**
>
> Rascunho técnico persistido antecipadamente apenas para não depender de estado local de sessão. A onda só pode ser aberta após o fechamento formal da W10 no **mesmo SHA** que passe todos os gates. Antes de qualquer implementação, este documento deve ser reancorado contra GitHub remoto, ficha canônica F30, Curriculum Graph, Coverage Matrix e estado atual da branch `codex/fechamento-curricular`.

## Identidade preliminar

- onda: W11;
- competência: `AL.03`;
- ficha: `F30`;
- tema: contagem por saltos;
- sequência autorizada: somente depois de W10 `N3.03/F14` formalmente fechada;
- Motor de Resolução: obrigatório desde o nascimento da competência, usando o contrato R0-A.

## Hipótese arquitetural a validar

1. Reusar a superfície controlada de `InteractiveNumberLine`/`InteractiveNumberLineSurface`; **não criar segunda reta**.
2. `Quadrado100` entra apenas como resgate/apoio previsto pela ficha e pela progressão — não como segunda atividade concorrente.
3. A progressão deve retirar andaimes ao longo dos cinco níveis, preservando a mesma ideia matemática: contar em passos iguais.
4. O gesto/percurso deve gerar evidência de processo; resposta final isolada não pode apagar estratégia incorreta.
5. Velocidade/RT continua sem comprar mastery, unlock ou XP.

## Motor de Resolução — requisitos preliminares

- cada questão deve nascer com `resolucao()` tipada;
- snapshots visuais declarativos e idempotentes por passo;
- acesso direto a qualquer passo, sem rebobinar estado imperativamente;
- entrada por misconception quando houver evidência diagnóstica suficiente;
- passo final termina na resposta efetiva do item;
- nenhum limiar de política do player (`2º erro`, `3º erro`, teto por sessão) deve ser congelado nesta onda: continuam **PENDENTE — FASE DO PLAYER**.

## Protocolo quando a onda abrir

1. reancorar no remoto e reler F30 integralmente;
2. regression-first específico de AL.03/F30;
3. implementar registrada/inativa;
4. suíte + TypeScript + auditorias + Chrome real + sondas transversais no mesmo SHA;
5. somente então promover canário;
6. deixar Coverage Matrix observar o delta real;
7. reconciliar observabilidade se necessário — nunca ajustar expectativa para fabricar verde;
8. registrar ledger somente depois da observação factual;
9. fechar checkpoint W11 somente com CI integralmente verde no HEAD exato.

## Não autorizado por este rascunho

- ativar `AL.03`;
- modificar learner state;
- alterar políticas do player;
- reabrir W7–W10;
- criar primitiva redundante para satisfazer Matrix;
- tocar Creature Engine ou Thinking Engine runtime.
