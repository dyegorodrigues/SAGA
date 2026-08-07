# Handoff de continuidade — estado após a correção do canário

> ## ⛔ SUPERADO EM 7/AGO/2026 — leia a [`RETOMADA.md`](./RETOMADA.md)
>
> **Este arquivo descreve o repositório de 3/ago e não vale mais como estado.**
> A afirmação *"N3.09 segue como único canário"* estava certa naquele dia e hoje
> são **treze** canários ativos; o "Lote D não implementado" também foi
> ultrapassado pelo bloco F0.
>
> Fica no repositório porque o **raciocínio** dele continua válido — em especial
> por que não republicar um commit local antigo sobre uma base superada. Mas
> nenhum número aqui deve ser usado para decidir nada.

## Base e publicação

- Base desta atualização: `origin/main = 3c9acbd` (`Revise AGENTS.md with new SAGA guidelines`).
- Os Lotes A, B e C estão na `main`. O PR #19 foi mesclado; o Lote C
  (F98/N4.02 e ArrayGrid autoral) está incorporado, não mais "sendo salvo".
- O Lote D **não foi implementado**. Não publicar `e03f187` diretamente: aquele
  commit local antigo partia de `b56f5a6` e reapresentaria uma base superada.
- `gN4_02` e `gN3_10` permanecem em produção. N3.09 segue como único canário.

## Ponto exato de parada

O mecanismo de canário do Composer foi corrigido e comprovado pelo caminho de
produção. O Lote D continua **não iniciado**: nenhum `StoryPanel`, nenhum
`SingaporeBars` estendido e nenhuma ficha N3.10 autoral foram criados.

## Correções recentes que mudam o plano

### Canário do Composer — corrigido

O rollback documentado no Lote B não funcionava em produção, apesar de o teste
passar. `CURRICULUM` congelava a decisão na carga do módulo, e o curriculum só
consultava a ponte para `N3.09` e `N3.11`; qualquer outro id no conjunto de
canários era ignorado em silêncio.

`verticalMigration.ts` foi substituído por `composerCanary.ts`:

- a origem do gerador é resolvida a cada questão, não na carga do módulo;
- `generatorSource` é getter e acompanha o rollback;
- não existe lista de ids privilegiados no curriculum;
- `enableComposerCanary` recusa nó sem ficha registrada;
- há testes de regressão que provam rollback e ativação via `getTrackById`.

Consequência para o Andar 4: promover N3.10 a canário agora exige apenas registrar
a ficha em `COMPOSER_FICHAS` e ativar o id — sem editar `curriculum.ts`.

### Lote D — arquitetura corrigida

A ficha canônica **F20** define `StoryPanel` como primitiva **principal** de N3.10.
O `SingaporeBars` existente representa apenas `A + B = total` e precisa ser
estendido para separar, comparar, completar e incógnita variável. O passo antigo
"ligar SingaporeBars ao builder" produziria uma ficha pedagogicamente incorreta e
foi substituído no `PLANO_MESTRE_SAGA.md`.

## Ordem segura de retomada

1. Criar branch inédita da `origin/main` atualizada.
2. Tipar `StorySpec` e `SingaporeBarSpec` e escrever o procedimento puro das quatro
   estruturas, com testes, antes de qualquer componente visual.
3. Implementar `StoryPanel` como primitiva principal e estender `SingaporeBars`.
4. Compor as duas em uma única tela: uma pergunta, uma ação dominante.
5. Exercitar `join`, `separate`, `compare` e `complete` no Sandbox, com incógnita
   variável no nível 5.
6. Validar acessibilidade, áudio, viewport infantil e paridade.
7. Encerrar o lote com `gN3_10` ainda em produção; o canário pertence a outro PR.

## Roteiro completo

O roteiro por andares, o sistema de design, o motor de mascotes, as regras de
animação e o pipeline de áudio/TTS estão em
[`ROTEIRO_DE_CONSTRUCAO_ANDARES.md`](./ROTEIRO_DE_CONSTRUCAO_ANDARES.md).

## Validação reproduzível completa

```bash
npm run auditar
npm run fichas:auditar
npm run grafo:check
npm run lint
npm test -- --run
npm run build
npm run pr:check
git diff --check
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git merge-base HEAD origin/main
```
