# W11 — AL.03 / F30 — RASCUNHO REMOTO

> **NÃO EXECUTÁVEL · NÃO É FONTE DE VERDADE · NÃO INTEGRA O PR #35.**
>
> Rascunho técnico persistido antecipadamente apenas para não depender de estado local de sessão. A onda só pode ser aberta após o fechamento formal da W10 no **mesmo SHA** que passe todos os gates. Antes de qualquer implementação, este documento deve ser reancorado novamente contra GitHub remoto, ficha canônica F30, Curriculum Graph, Coverage Matrix e estado atual da branch `codex/fechamento-curricular`.

## Identidade reancorada

- onda: W11;
- competência: `AL.03` — contagem por saltos;
- ficha: `F30` — Contagem por Saltos — 2, 5 e 10;
- primitiva canônica: `InteractiveNumberLine + Quadrado100`;
- módulo: 1;
- strand: Álgebra;
- pré-requisito declarado: `N2.02` — sequências no 100;
- progressão: concreta → pictórica → abstrata;
- sequência autorizada: somente depois de W10 `N3.03/F14` formalmente fechada;
- Motor de Resolução: obrigatório desde o nascimento da competência, usando o contrato R0-A.

## Escada canônica F30

| Nível | Passo / padrão | Apoio canônico | Retirada de andaime |
|---|---|---|---|
| L1 | 2 em 2, pares até 20 | `InteractiveNumberLine` | todos os saltos explícitos |
| L2 | 10 em 10, dezenas até 100 | `InteractiveNumberLine` | saltos visíveis, mas nem todos os numerais rotulados |
| L3 | 5 em 5, até 100 | `Quadrado100` | posições/múltiplos destacados, sem setas |
| L4 | mistura 2/5/10 | sequência escrita | **sem reta e sem manipulável visível** |
| L5 | mistura 2/5/10 com início deslocado não-zero | nenhum | mental; `rt_alvo=8s`, sem domínio por velocidade |

Regras duras:

- L1–L2 usam a reta; L3 usa o quadro de 100; L4–L5 retiram manipulável;
- suporte visual cai monotonicamente ao longo da escada;
- touch targets previstos pela ficha: pelo menos 56×56;
- movimento reduzido: mudança de estado sem animação de salto;
- timing não participa do critério de domínio;
- fórmula conceitual: `a_n = a_0 + n·p`.

## Diagnóstico e correção canônicos

- `ERRO_PASSO` → reensino com reta numérica;
- `PERDE_PADRAO` → mais prática preservando o mesmo passo;
- `CONFUNDE_SEQUENCIA` → voltar para 2 em 2 com objetos;
- após erro: explicar o passo (ex.: “Está pulando de 5 em 5…”) e mostrar a sequência-modelo completa;
- item seguinte muda o número inicial, mas preserva o mesmo passo para distinguir aprendizagem de memorização do item.

Mastery da ficha exige, além da taxa recente:

- pelo menos uma sequência correta em cada passo 2, 5 e 10;
- pelo menos uma sequência correta com início deslocado;
- evidência em duas sessões distintas;
- nenhuma dependência de tempo/RT.

## Hipótese arquitetural a validar

1. Reusar **`InteractiveNumberLineSurface` controlada**; **não criar segunda reta**.
2. L1–L2 usam a superfície compartilhada para expressar os saltos; o Stage é dono da estratégia, diagnóstico e evidência, não a primitive.
3. L3 usa `Quadrado100` como linguagem prescrita da própria progressão — não como atividade paralela ou substituto da reta nos outros níveis.
4. L4–L5 precisam existir como estados autorais sem manipulável, não como fallback `plain` desconectado da mesma família.
5. O gesto/percurso deve gerar evidência de processo; resposta final isolada não pode apagar estratégia incorreta.
6. A implementação precisa preservar `prefers-reduced-motion` sem criar caminho semântico diferente.
7. Velocidade/RT continua sem comprar mastery, unlock ou XP.

## Motor de Resolução — requisitos preliminares

- cada questão nasce com `resolucao()` tipada;
- snapshots visuais declarativos e idempotentes por passo;
- acesso direto a qualquer passo, sem rebobinar estado imperativamente;
- entrada por misconception quando houver evidência diagnóstica suficiente;
- os snapshots precisam representar tanto a reta quanto o Quadrado100 e o estado abstrato sem exigir React/DOM no contrato;
- passo final termina na resposta efetiva do item;
- nenhum limiar de política do player (`2º erro`, `3º erro`, teto por sessão) deve ser congelado nesta onda: continuam **PENDENTE — FASE DO PLAYER**.

## Legado observado antes de abrir a onda

`AL.03` ainda é servido por `gAL_03` em `src/utils/generators.ts`. O legado escolhe o passo por nível, mas a auditoria de conformidade o classifica como entrega sem as primitivas prescritas — hoje a Matrix mantém `AL.03` entre as divergências reais.

Isso torna o regression-first barato e específico: o primeiro vermelho da W11 deve provar que `AL.03/F30` ainda **não está registrada no Composer** / segue pela proveniência legada. Não vale fabricar uma falha visual ou alterar o canário para obter o vermelho.

## Protocolo quando a onda abrir

1. reancorar no remoto e reler F30 integralmente;
2. regression-first específico de AL.03/F30, falhando pela ausência deliberada do registro autoral;
3. implementar ficha + contrato + specialized builder/Stage **registrados e inativos**;
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
- criar primitiva/reta redundante para satisfazer Matrix;
- tocar Creature Engine ou Thinking Engine runtime.
