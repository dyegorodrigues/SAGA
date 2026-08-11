# Fluxo Git sem bug — guia bem simples

> [!WARNING]
> **DOCUMENTO HISTÓRICO / SUPERADO PARA A FÁBRICA ATUAL DO PR #29.**
> O ritual `merge → apagar branch → fetch → branch nova` abaixo **não se aplica** ao fluxo vigente de `codex/integrar-bloco-f0`.
> Enquanto o PR #29 estiver no protocolo cumulativo atual, a autoridade operacional é `AI_Studio_Lab/codex/RETOMADA.md`: branch única, main protegida, PR **open + draft + unmerged**, sem merge/rebase/branch auxiliar. Este arquivo é preservado apenas como proveniência de uma política anterior.

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

## Como continuar — na mesma conversa ou em outra

Não é obrigatório abrir conversa nova. O que é obrigatório é o **estado Git novo**:
o PR anterior já mesclado, `origin/main` atualizada e uma branch inédita criada
diretamente dela. Se o Codex conseguir provar essas três coisas, pode continuar na
mesma conversa sem risco de carregar a branch anterior.

Se preferir abrir outra conversa, ou se o ambiente parecer confuso, cole:

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
4. Na mesma conversa, informe que houve conflito e peça a reconstrução direta da
   `origin/main` atual. Abrir outra conversa é opcional, não é uma correção Git.

## Regra de ouro

**Merge → apagar branch → fetch → branch nova.** A conversa nova é opcional; a
branch nova é obrigatória.

Seguindo sempre esta ordem, nenhum lote velho entra escondido no lote novo.

## Canário curricular e rollback

- Troque somente um nó por PR e registre `generatorSource` no Track.
- Um toque durante a questão nunca cria uma escrita Firestore; apenas o evento
  terminal leva o resumo agregado das tentativas.
- Para reverter o canário atual, retire `N3.09` de `COMPOSER_CANARIES` — ou chame
  `rollbackComposerCanary("N3.09")` — em `src/curriculum/motores/composerCanary.ts`;
  não mova N3.11 de `gN3_11` e não use Update branch.
- Para promover um nó novo a canário, registre a ficha em `COMPOSER_FICHAS` e chame
  `enableComposerCanary`. Não existe lista de ids em `curriculum.ts`: ativar um
  canário não exige editar o currículo.

> Correção de 3/ago/2026: até esta data o rollback não surtia efeito em produção.
> `CURRICULUM` congelava a decisão na carga do módulo e o currículo só consultava a
> ponte para `N3.09` e `N3.11`, de modo que qualquer outro id no conjunto era
> ignorado em silêncio. A origem do gerador passou a ser resolvida a cada questão
> gerada, e há testes que provam rollback e ativação por `getTrackById`.

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

## Fechamento de bloco — a lista que não depende de memória

Três falhas desta natureza já ocorreram: um lote declarado concluído sem reler a
própria lista, um canário promovido com padrão mais fraco que o seguinte e o
grafo de código deixado quatro commits para trás. Nenhuma foi por desconhecimento
— todas por confiar num passo de rotina à memória de quem executava.

Antes de dizer que um bloco terminou:

1. **Reabrir a lista do bloco** no roteiro e conferir item a item, preenchendo a
   coluna de evidência. Tabela não se preenche de memória.
2. **Rodar os gates**: `auditar`, `fichas:auditar`, `grafo:check`, `lint`,
   `pr:check`, `test`, `build`.
3. **Atualizar o grafo de código**: `npm run grafo:codigo`, e comparar
   `Built from commit` com `git rev-parse HEAD`.
4. **Provar a base**: `git status --short --branch` e `git rev-list --count
   origin/main..HEAD`.
5. **Verificar publicação**: local e remoto no mesmo commit.

Onde a verificação puder virar código, ela deve virar. O contrato do canário é o
exemplo: em vez de confiar que cada promoção repita as onze checagens, a suíte
enumera `COMPOSER_CANARIES` e aplica o padrão a quem estiver lá. Promover sem
declarar falha na hora.

**Regra geral:** se um passo precisa ser lembrado, ele precisa de mecanismo. Se
não couber num teste, cabe numa tabela de evidência; se não couber na tabela,
cabe num script com nome descobrível.