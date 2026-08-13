# W12 — N4.01 / F97 — RASCUNHO REMOTO

> **NÃO EXECUTÁVEL · NÃO É FONTE DE VERDADE · NÃO INTEGRA O PR #35.**
>
> Rascunho técnico persistido antecipadamente apenas para não depender de estado local de sessão. A onda só pode ser aberta após W10 e W11 estarem formalmente fechadas em seus respectivos **SHAs verdes**. Antes de qualquer implementação, este documento deve ser reancorado contra GitHub remoto, ficha canônica F97, Curriculum Graph, Coverage Matrix e estado atual da branch de trabalho.

## Identidade preliminar

- onda: W12;
- competência: `N4.01`;
- ficha: `F97`;
- conceito: multiplicação como grupos iguais;
- hipótese de linguagem visual: `Grupo × N`, preservando a semântica concreta de quantidade de grupos e itens por grupo;
- Motor de Resolução: obrigatório desde o nascimento da competência, usando o contrato R0-A.

## Hipótese arquitetural a validar

1. Usar `Grupo`/palco especializado como owner da semântica de grupos iguais; não substituir por escolha abstrata só para reaproveitar legado.
2. Diferenciar explicitamente:
   - quantidade de grupos;
   - tamanho de cada grupo;
   - total de objetos.
3. O procedimento deve conseguir diagnosticar trocas entre essas grandezas e não inferir estratégia apenas pelo total final.
4. A progressão CPA deve remover suporte sem trocar silenciosamente o conceito ensinado.
5. Velocidade/RT continua sem comprar mastery, unlock ou XP.

## Motor de Resolução — requisitos preliminares

- cada questão nasce com `resolucao()` tipada;
- snapshots visuais declarativos e idempotentes por passo;
- entrada por misconception quando a evidência distinguir o erro;
- resolução calculada do item concreto, não texto/gabarito fixo;
- passo final termina na resposta real do item;
- políticas `2º erro = dica / 3º = resolução?` e `teto de resoluções por sessão` continuam **PENDENTE — FASE DO PLAYER**.

## Protocolo quando a onda abrir

1. reancorar no remoto e reler F97 integralmente;
2. regression-first específico de N4.01/F97;
3. implementar registrada/inativa;
4. suíte + TypeScript + auditorias + Chrome real + sondas transversais no mesmo SHA;
5. somente então promover canário;
6. deixar Coverage Matrix observar o delta real;
7. corrigir cegueira de observabilidade se aparecer, sem maquiar a entrega;
8. registrar ledger somente depois da observação factual;
9. fechar checkpoint W12 somente com CI integralmente verde no HEAD exato.

## Não autorizado por este rascunho

- ativar `N4.01`;
- migrar conta armada/vertical nesta onda por conveniência;
- alterar políticas do player;
- reabrir ondas já fechadas;
- tocar Creature Engine ou Thinking Engine runtime.
