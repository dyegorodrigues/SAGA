# Retomada — comece por aqui

> Este arquivo é o ponto de entrada de qualquer sessão nova. Ele existe porque a
> memória de uma conversa não sobrevive e o repositório sim. **Leia-o inteiro
> antes de tocar em código.** Depois execute o comando do §3 — ele recalcula o
> estado real, e nenhum número deste arquivo precisa ser confiado de memória.

## 1. A regra que vale acima de todas

> **Existir não é estar certo.**

Nada aqui está pronto por existir: nem as competências de alfabetização numérica
(N1), nem as primitivas, nem os `kind` herdados, nem as fichas. Tudo é suspeito
até ser olhado. As fichas são o cânone e o cânone é **adaptável** — mudar é
permitido com estudo, registro e o autor sabendo. Detalhe completo em
`ROTEIRO_ATE_O_FIM.md §0`.

E a pergunta que fecha todo bloco: *isto está coerente com o aplicativo que o
autor começou a construir?*

## 2. A descoberta que reorganizou o projeto (5/ago/2026)

Quatro versões seguidas do modelo de área foram reprovadas pelo autor, todas com
os testes verdes. A causa-raiz não era falta de cuidado:

> **Cada tela era verificada contra a própria ficha, isolada — nunca contra a
> HISTÓRIA da criança.**

Faltava a pergunta *"a linguagem visual desta tela apareceu antes, na cadeia de
pré-requisitos?"*. Sem ela, qualquer competência estreia um idioma novo com cara
de continuidade, e a tela sai **correta, testada, acessível e incompreensível**.

A regra que saiu daí, e que governa toda construção nova:

> **Uma tela não introduz mais de UMA coisa nova por vez.**
> Conteúdo novo → desenho velho. Desenho novo → conteúdo que a criança já sabe
> de cor.

Ver `PADRAO_OURO.md §6.36`. O caso resolvido está em N4.09, cujo nível 1 deixou
de cobrar multiplicação e passou a **alfabetizar no desenho**.

## 3. O primeiro comando de toda sessão

```bash
npm run fichas:conferir
```

Ele imprime, do próprio código:

- as **trocas de modo sem aviso** — a classe mais perigosa, onde a criança acha
  que sabe ler o desenho e não sabe (N4.09 já resolvida; as demais, não)
- as **estreias sem precedente**
- as competências cuja **tela diverge da ficha**
- as **primitivas que a ficha exige e não existem**

Outros dois portões:

```bash
npm run sonda        # tela quebrada que o jsdom não vê (152 tomadas)
npx vitest run       # o resto
```

## 4. Onde continuar

`ROTEIRO_ATE_O_FIM.md §3-bis` tem os blocos em ordem. O **bloco 1** é a
**alfabetização matemática**: construir os módulos iniciais (F0/N1) desde o
começo, conforme as fichas.

**Cuidado para não confundir dois nomes parecidos:**

- **Alfabetização MATEMÁTICA** = os módulos iniciais, N1, onde a criança entra no
  app. Decisão do autor: construir desde o começo conforme as fichas, mesmo que
  já exista alguma coisa rodando. É o bloco 1.
- **Alfabetização VISUAL** = ensinar a LER um desenho novo antes de cobrar
  matemática nova (§6.36). É transversal, atinge todas as faixas, e vale como
  regra em qualquer competência.

Honrar a ficha não é só usar a primitiva certa: é o roteiro cinematográfico, as
falas, os cinco níveis transcritos, o diagnóstico e a coreografia. A tabela
completa está no `ROTEIRO_ATE_O_FIM.md §2`, no aviso de decisão revogada.

`ROTEIRO_ATE_O_FIM.md §4-bis` lista as pendências pontuais, inclusive uma falha
intermitente de teste **não resolvida** que não deve virar "passou" por
esquecimento.

## 5. Como se trabalha aqui

O trilho de sete passos está em `PADRAO_OURO.md §1`, a lista de verificação no
§2, e as **36 armadilhas** no §6 — cada uma custou uma rodada de erro e volta de
graça se não for lida.

Três hábitos que não são negociáveis:

1. **Capturar a tela e olhar**, nos cinco níveis. Teste verde não prova
   legibilidade — foi um adulto olhando que achou todos os defeitos graves.
2. **Mandar o print ao autor assim que montar**, antes de finalizar.
3. **Implementação e ativação são dois PRs.** Sempre.

## 6. Branch

`claude/install-superpowers-repo-bst25i`. Nunca empurre para outra.
