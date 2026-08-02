# Handoff de continuidade — estado após o Lote C

## Base e publicação

- A base obrigatória deste salvamento é `origin/main = c9e4757` (`c9e4757275d7d12ef06b7a781966459dd03918a6`).
- Os Lotes A e B já estão na `main`; o Lote C (F98/N4.02 e ArrayGrid autoral) está sendo salvo por este PR.
- O Lote D **não foi implementado**. Não publicar `e03f187` diretamente: esse commit local antigo partia de `b56f5a6` e reapresentaria uma base superada.
- `gN4_02` permanece em produção. N4.02 não ganhou canário neste lote.

## Ponto exato de parada

O ArrayGrid autoral está ligado ao Composer, N4.02 está registrada e exercitável
no Sandbox/caminho de ficha, e o legado continua sendo o caminho de produção.
Pare aqui: não iniciar barras, narrativa ou migração de N3.10 neste PR.

## Lote D aprovado, ainda não implementado

- `StoryPanel` será responsável pela narrativa de N3.10.
- `SingaporeBars` será responsável pela representação matemática.
- As quatro estruturas são `join`, `separate`, `compare` e `complete`.
- O nível 5 terá incógnita variável.
- `gN3_10` permanece em produção.
- O Lote D deve começar no Sandbox, sem expansão para frações ou razão e sem criar canário no mesmo lote.

## Ordem segura de retomada

1. Confirmar que este PR foi incorporado e criar branch inédita da nova `origin/main`.
2. Revalidar o contrato e a ficha autoral de N3.10 sem tocar no legado.
3. Tipar o builder e separar StoryPanel de SingaporeBars.
4. Exercitar `join`, `separate`, `compare` e `complete` no Sandbox, incluindo incógnita variável no nível 5.
5. Validar acessibilidade, áudio, viewport e paridade.
6. Encerrar o lote ainda com `gN3_10` em produção; qualquer canário pertence a outro PR.

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
git diff --numstat origin/main..HEAD
git rev-list --count origin/main..HEAD
git diff --name-only origin/main..HEAD
git diff --name-only origin/main..HEAD | wc -l
git status --short --branch
git diff origin/main..HEAD | rg '^<<<<<<< |^=======|^>>>>>>> '
git rev-parse HEAD^
git rev-parse origin/main
```
