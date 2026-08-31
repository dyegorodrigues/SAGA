# Como pôr o SAGA no ar, e no tablet da criança

Três coisas, uma vez só. Depois disso o app se republica sozinho a cada
mudança, e o endereço nunca muda.

---

## 1. Ligar o Pages (é o único passo obrigatório)

No celular ou no computador, aberto o repositório no GitHub:

**Settings** → no menu da esquerda, **Pages** → em *Build and deployment*,
**Source: Deploy from a branch** → *Branch:* **`gh-pages`** → *pasta:* **`/ (root)`**
→ **Save**.

Se a branch `gh-pages` ainda não aparecer na lista, é porque a publicação
automática ainda não rodou nenhuma vez. Vá para o passo 2, rode, e volte aqui.

Um a três minutos depois, o endereço fica de pé:

```
https://dyegorodrigues.github.io/SAGA/
```

> **O que fica público.** A página do app. O repositório continua com a
> visibilidade que já tem — ligar o Pages não abre o código.

---

## 2. Publicar (automático, mas dá para forçar)

A publicação roda sozinha a cada envio de código. Para forçar na mão:

**Actions** → na lista da esquerda, **Publicar o app** → botão **Run workflow**
→ **Run workflow**.

A execução roda a suíte inteira ANTES de publicar. **Se um teste falhar, nada
vai ao ar** — de propósito: a criança abrir e não funcionar é pior do que
esperar. Quando termina em verde, o resumo da execução mostra o endereço.

---

## 3. Pôr na tela do tablet (vira ícone, como aplicativo de loja)

Abra o endereço no tablet e:

- **Android / Chrome:** menu `⋮` → *Adicionar à tela inicial* → *Instalar*.
- **iPad / Safari:** botão de compartilhar → *Adicionar à Tela de Início*.

Aparece a raposa em fundo azul, com o nome **SAGA**. Abrindo por ali, o app
ocupa a tela inteira, sem barra de navegador — a criança não vê que é um site.

---

## O que já funciona e o que ainda não

**Funciona sem conta nenhuma.** Tocar em *Começar sem Conta* cria o perfil da
criança e guarda tudo no próprio aparelho. Fecha, abre de novo, e ela continua
lá — isso é testado a cada publicação, pelo `npm run passeio`.

**A conta Google ainda não foi exercitada de ponta a ponta.** O código existe,
mas nunca rodou de verdade contra o Firebase. Duas consequências práticas:

1. Enquanto isso, use *Começar sem Conta*. O progresso fica NO APARELHO — se a
   criança trocar de tablet, ele não vai junto.
2. Para a conta funcionar depois, o domínio precisa ser autorizado no Firebase:
   console do projeto → *Authentication* → *Settings* → *Authorized domains* →
   adicionar `dyegorodrigues.github.io`.

---

## Se der errado

| O que você vê | O que é | O que fazer |
|---|---|---|
| Página em branco | O build saiu com a base errada | Confira que a execução usou `SAGA_BASE=/SAGA/` — o workflow já faz isso sozinho |
| `404` no endereço | O Pages não está ligado, ou a branch `gh-pages` ainda não existe | Passo 1, depois passo 2 |
| A execução falha em *Suíte inteira* | Algum teste quebrou | É o portão funcionando: nada foi publicado. O log da execução diz qual teste |
| O ícone no tablet é uma letra num círculo | O atalho foi criado antes desta versão | Apague o atalho e adicione de novo |
