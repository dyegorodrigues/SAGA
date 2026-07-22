# 🔀 Fluxo de trabalho entre 2 IAs (Gemini/AI Studio + Claude Code) sem perder nada

*Como o Zeus trabalha com duas IAs ao mesmo tempo sem uma sobrescrever a outra.*

## A ideia em 1 frase
**Cada IA escreve na SUA própria branch. O Claude é o editor-chefe que junta o que
presta na branch oficial. Ninguém sobrescreve ninguém.**

## A analogia (pra nunca esquecer)
Imagine um livro escrito por dois autores:
- Cada autor escreve num **caderno próprio** (uma branch).
- Existe **UM livro oficial** (a branch de verdade).
- Um **editor-chefe** (o Claude) lê os dois cadernos, escolhe os melhores trechos e
  passa a limpo no livro oficial — descartando o que ficou bugado ou repetido.
- Assim, mesmo que um autor escreva besteira no caderno dele, o **livro oficial nunca
  é estragado**.

## O mapa das branches
| Branch | Quem escreve | O que é |
|---|---|---|
| `claude/ai-studio-github-sync-889al1` | **só o Claude** | **o livro oficial** (fonte da verdade) |
| `gemini-lab` | **só o Gemini/AI Studio** | o caderno de rascunho do Gemini |

## O ciclo (o "círculo perfeito" que o Zeus quer)
1. **Zeus + Gemini** trabalham no AI Studio (ideias, exercícios, design).
2. **Gemini faz push só para `gemini-lab`** (nunca para a branch do Claude).
3. **Zeus avisa o Claude:** "o Gemini mexeu no `gemini-lab`, dá uma olhada e junta o
   que for bom." O Claude faz `git fetch` e **lê/compara** o caderno do Gemini a
   qualquer momento — mesmo enquanto o Zeus ainda edita lá.
4. **Claude integra a dedo** (cherry-pick) o que presta na branch oficial, testa
   (`npm run test`), e commita. O que está bugado (ex.: o hack de fonemas) fica de fora.
5. **Gemini puxa a branch oficial** de volta pro container, pra partir sempre da versão
   verdadeira e atualizada — nunca de uma versão velha.

## As 3 regras de ouro (nunca quebrar)
1. **O AI Studio/Gemini NUNCA faz push para a branch do Claude.** Só para `gemini-lab`.
   (Um sync bruto do container do AI Studio para a branch oficial = apaga o trabalho do
   Claude. É o maior perigo.)
2. **Antes de começar algo novo, puxar (pull) a branch oficial.** Assim ninguém trabalha
   em cima de coisa velha.
3. **Quem junta é sempre o Claude** (o editor-chefe). O Gemini propõe; o Claude integra.

## Instrução pronta para colar no AI Studio (Gemini)
> "A partir de agora, faça o push/sync das suas mudanças SEMPRE para uma branch
> chamada `gemini-lab`. NUNCA faça push para a branch `claude/ai-studio-github-sync-889al1`
> — ela é a oficial e é gerida por outra IA. Antes de começar qualquer trabalho novo,
> faça pull da branch `claude/ai-studio-github-sync-889al1` para partir da versão mais
> atual. Não sobrescreva a branch oficial em hipótese alguma."

## Instrução pronta para dar ao Claude
> "O Gemini atualizou a branch `gemini-lab`. Faça `git fetch`, compare com a oficial,
> e integre (cherry-pick) só o que estiver bom e não bugado. Me liste o que pegou e o
> que descartou, e por quê. Depois commita e faz push na oficial."

## 📥 A RECEITA DO "PUXAR" (colar no AI Studio quando quiser ver a versão do Claude)

O problema clássico: o AI Studio "puxa pela metade", instala coisas por conta, ou
"melhora" código no caminho — e o Zeus acha um monte de problema que NÃO existe na
branch oficial. A solução é dar uma ordem FECHADA, sem espaço pra criatividade:

> **Colar exatamente isto no AI Studio:**
>
> "NÃO crie, NÃO modifique e NÃO 'melhore' nada. Sua única tarefa é sincronizar este
> projeto com o GitHub, espelhando EXATAMENTE a branch oficial. Rode, nesta ordem:
> `git fetch origin` ·
> `git checkout claude/ai-studio-github-sync-889al1` ·
> `git reset --hard origin/claude/ai-studio-github-sync-889al1` ·
> `npm install` (a única instalação permitida — não instale mais nada) ·
> `npm run dev`.
> Se qualquer arquivo local for diferente da branch, DESCARTE o local (o remoto é a
> verdade). Não gere arquivos novos, não formate código, não atualize dependências.
> Ao final me mostre a saída de `git log --oneline -1` e `git status`."

**Como o Zeus CONFERE se puxou certo (30 segundos):**
1. O `git log --oneline -1` que ele mostrar deve bater com o último commit da branch no
   GitHub (abrir a página da branch e comparar o código do commit, ex.: `e84a56a`).
   **Hash diferente = não puxou certo. Repetir a ordem.**
2. O `git status` deve dizer "nothing to commit, working tree clean". Se listar arquivos
   modificados, ele inventou coisa — repetir o `git reset --hard`.
3. Se ele PEDIR pra instalar algo além do `npm install`: **negar**. O projeto roda só
   com `npm install && npm run dev`.

**Regra de direção (pra nunca mais esquecer):** GitHub → AI Studio é só LEITURA.
O AI Studio nunca faz push pra oficial (regra de ouro nº 1). Se o Gemini criar algo
que preste, vai pra `gemini-lab` ou pra um doc — e o Claude integra a dedo.

## Plano B (se o AI Studio não deixar escolher a branch)
Se o AI Studio só sincronizar para uma branch fixa, então **o Gemini NÃO usa o GitHub**
— ele escreve as mudanças/códigos num documento (como `docs/backup-gemini-aistudio.md`),
o Zeus traz esse documento para o Claude, e o Claude integra a dedo. É mais manual, mas
100% seguro contra sobrescrita (o Gemini nunca toca na branch oficial).

## 📨 Comunicação cruzada EFICIENTE (sem gastar tokens relendo tudo)

O segredo é cada IA manter UM arquivo-índice curto que a outra lê primeiro. Assim
ninguém relê o repositório inteiro — só olha o índice e, se precisar, o diff de UM arquivo.

**Gemini → Claude:** o Gemini mantém `docs/CHANGELOG-GEMINI.md` na branch `gemini-lab`.
A cada mudança, ele ADICIONA no topo uma linha curta: `data · o quê · por quê · arquivo`.
O Claude lê SÓ esse arquivo (barato), e depois faz `git diff origin/gemini-lab -- <arquivo>`
apenas nos arquivos citados — nunca relê o repo todo.

**Claude → Gemini:** o Claude mantém o `CLAUDE.md` (estado vivo) + mensagens de commit
claras. Quando o Gemini puxa a branch oficial, lê o `CLAUDE.md` pra saber o que mudou.

Resultado: leitura barata dos dois lados. O Claude só abre arquivos de código quando vai
INTEGRAR algo específico, ou quando precisa TESTAR/VISUALIZAR no navegador (screenshot,
som, layout) — que é quando o custo se justifica.

### Instrução pronta pra colar no AI Studio (Gemini) — o changelog
> "Além de trabalhar na branch `gemini-lab`, mantenha SEMPRE um arquivo
> `docs/CHANGELOG-GEMINI.md` nessa branch. A cada alteração que fizer, adicione no TOPO
> do arquivo uma entrada curta com: a data, o QUE mudou, POR QUE mudou, e em QUAL arquivo.
> Também registre os bugs que o Zeus relatou e como você tentou resolver. Isso serve para
> a outra IA (Claude) ler rápido e integrar só o que for bom, sem reler o projeto todo."

## Por que assim?
- **Nada se perde:** o trabalho de cada um vive na sua branch; o Claude só ADICIONA.
- **Nada buga:** o Claude testa (227 testes) antes de juntar; o que estiver quebrado
  não entra.
- **O Zeus vê tudo:** as duas branches ficam no GitHub, lado a lado, pra comparar.
