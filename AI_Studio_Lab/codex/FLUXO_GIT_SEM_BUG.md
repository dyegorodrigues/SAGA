# Fluxo Git sem bug — guia bem simples

Este é o ritual para o proprietário usar depois que o Codex terminar um lote.
Pense em cada PR como **uma caixa fechada de brinquedos**: primeiro conferimos a
caixa, depois guardamos na estante `main`, e só então abrimos uma caixa nova.

## O que fazer quando o Codex entregar um PR

1. Abra o PR indicado pelo Codex.
2. Confira se o destino escrito no topo é **`main`**.
3. Espere os checks ficarem verdes.
4. Leia o resumo e veja se o PR contém só o lote combinado.
5. Clique em **Merge pull request**.
6. Confirme o merge.
7. Só depois clique em **Delete branch**.

Apagar a branch depois do merge é seguro: o conteúdo já está guardado na `main`.
Não use **Update branch** e não resolva conflitos no editor web.

## Como começar a conversa seguinte

Cole esta mensagem:

```text
O PR anterior já foi mesclado em main e a branch foi apagada.
Comece obrigatoriamente com git fetch origin --prune.
Prove que a nova branch nasceu da origin/main atual.
Leia AGENTS.md, Plano Mestre e as últimas 120 linhas do Diário.
Trabalhe somente no próximo lote registrado, rode toda a suíte, faça commit e PR.
Não reutilize branch antiga e não use Update branch.
```

O Codex deve então buscar a `main`, criar **uma branch nova** e provar a base antes
de editar. Se `origin/main` ainda não contiver o merge, ele deve parar e não criar
outro lote em cima de história antiga.

## Quando agrupar e quando separar

- **Agrupe** mudanças pequenas que provam a mesma entrega, por exemplo ficha F39,
  testes de F39 e registro de F39 no Diário.
- **Separe** troca de produção, array, barras, redesign, Firestore e mascote. Cada
  tema desses vira outro PR.
- Não deixe cinco PRs abertos em cadeia. Termine uma caixa antes de começar outra.

## Se aparecer conflito

1. Não clique em Update branch.
2. Não edite o conflito no GitHub.
3. Não faça merge “só para ver”.
4. Abra uma conversa nova dizendo que houve conflito e peça reconstrução direta
   da `origin/main` atual.

## Regra de ouro

**Merge → apagar branch → conversa nova → fetch → branch nova.**

Seguindo sempre esta ordem, nenhum lote velho entra escondido no lote novo.

## Regra para imagens e outros binários

O criador de PR deste ambiente não aceita arquivos binários no diff. Portanto:

- não adicionar PNG, JPG, GIF, ZIP, PDF ou vídeo como evidência de uma tarefa;
- fazer a inspeção visual localmente e registrar no Diário as medidas e o que foi
  observado;
- antes do commit, rodar uma auditoria dos tipos de arquivo adicionados;
- assets reais do produto só entram por um fluxo explicitamente compatível com
  binários, nunca misturados ao PR textual de código.

Se aparecer a placa vermelha de binário, não tente Update branch: reconstrua o
diff sobre uma branch nova de `origin/main`, sem o arquivo incompatível.

## Plugin Superpowers

O projeto citado é `obra/superpowers`. A documentação oficial do próprio projeto
informa que ele está no marketplace oficial do Codex.

- **Codex App:** abra **Plugins** na barra lateral, procure **Superpowers** na
  categoria Coding e clique no botão `+`.
- **Codex CLI:** abra `/plugins`, procure `superpowers` e escolha **Install Plugin**.
- Instalação vale para o ambiente Codex em que foi feita; outro aplicativo precisa
  de instalação própria.
- Depois de instalar, comece uma conversa nova para as skills carregarem desde a
  primeira mensagem.

Fonte verificada em 2/ago/2026:
<https://github.com/obra/superpowers#codex-app>.

O plugin melhora o ritual de planejamento, TDD, revisão e verificação, mas não
substitui `AGENTS.md`, a Bíblia, o Plano Mestre nem as travas Git do SAGA. Em caso
de conflito, as regras do repositório continuam mandando.
