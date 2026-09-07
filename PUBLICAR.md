# Como usar o SAGA, e como pôr no ar

Há **dois caminhos**. O primeiro já funciona e não pede nada de você. O
segundo dá um endereço público e definitivo, e pede um clique.

---

## Caminho 1 — o link que já existe (nenhum passo)

O app inteiro cabe num arquivo `.html`. Ele está publicado e é só abrir:

> **https://claude.ai/code/artifact/3303a25a-024f-46a5-bd1c-77993a2d24b5**

Abra no tablet, toque em **Começar sem Conta**, e a criança joga.

- **Serve para**: mostrar o app agora, testar com a criança, mandar para
  alguém ver.
- **Não serve para**: guardar o progresso na nuvem. Sem servidor não há
  domínio autorizado no Firebase, então este caminho é sempre o do VISITANTE:
  o progresso fica **no navegador que abriu**. Trocou de aparelho, começa do
  zero.
- **Quem enxerga**: só você, até compartilhar pelo menu da própria página.

Para gerar de novo, depois de qualquer mudança:

```
node scripts/gerar-arquivo-unico.mjs
```

Sai um `dist/saga-arquivo-unico.html` que roda até offline, com dois toques.

---

## Caminho 2 — o endereço definitivo (um clique, uma vez só)

```
https://dyegorodrigues.github.io/SAGA/
```

Hoje esse endereço dá **404**. O app já está construído e guardado na branch
`gh-pages`; falta ligar o interruptor, e só o dono da conta pode ligar.

### Onde clicar

1. Abra **github.com/dyegorodrigues/SAGA**
2. No topo, a aba **Settings** (no celular pode estar dentro de um menu `⋯`)
3. Na lista da esquerda, role até **Pages**
4. Em **Source**, troque para **Deploy from a branch**
5. Duas caixinhas: na primeira **`gh-pages`**, na segunda **`/ (root)`**
6. **Save**

Dois minutos depois o endereço responde.

> **O que fica público**: a página do app. O repositório mantém a visibilidade
> que já tem — ligar o Pages não abre o código.

### Depois disso, nada

A publicação roda sozinha a cada mudança no código. Para forçar na mão:
**Actions → Publicar o app → Run workflow**.

Antes de publicar, o robô roda os 4005 testes. **Se um falhar, nada vai ao
ar** — de propósito: a criança abrir e não funcionar é pior do que esperar.

---

## Pôr na tela do tablet (vale para os dois caminhos)

Abra o endereço no tablet e:

- **Android / Chrome**: menu `⋮` → *Adicionar à tela inicial* → *Instalar*
- **iPad / Safari**: botão de compartilhar → *Adicionar à Tela de Início*

Aparece a raposa em fundo azul, com o nome **SAGA**. Abrindo por ali, o app
ocupa a tela inteira, sem barra de navegador.

---

## O que está pronto e o que não está

**Pronto e verificado a cada publicação.** Entrar, criar o perfil, jogar uma
missão inteira, fechar o app, abrir de novo e a criança continuar lá com o
progresso. É o `npm run passeio`: 19 verificações, 0 falhas. As 90
competências, cinco níveis cada.

**Não está**: a conta Google. O código existe e nunca rodou de verdade contra
o Firebase. Enquanto isso, o progresso é do aparelho. Para a conta funcionar,
depois do caminho 2: console do Firebase → *Authentication* → *Settings* →
*Authorized domains* → adicionar `dyegorodrigues.github.io`.

**Também não está**: a arte dos mascotes. A pasta `src/assets/mascotes/` tem
só o README — os PNGs nunca foram feitos, e o app cai no desenho de emergência.
Não é defeito de código: o encaixe funciona e usa o PNG assim que ele existir.

---

## Se der errado

| O que você vê | O que é | O que fazer |
|---|---|---|
| Página em branco | Build com a base errada | O workflow já cuida disso sozinho; refaça a execução |
| `404` no endereço do GitHub | O Pages não está ligado | Caminho 2, passo a passo acima |
| A execução falha em *Suíte inteira* | Um teste quebrou | É o portão funcionando: nada foi publicado. O log diz qual |
| Ícone do atalho é uma letra num círculo | O atalho é anterior a esta versão | Apague o atalho e adicione de novo |
| Progresso sumiu | Trocou de navegador ou de aparelho | Esperado enquanto a conta Google não funciona |
