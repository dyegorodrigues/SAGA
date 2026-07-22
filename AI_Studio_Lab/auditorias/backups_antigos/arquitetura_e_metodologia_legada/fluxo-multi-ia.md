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

## 🔀 MODO ATUAL (a partir de 2026-07-19): AI STUDIO É O PRINCIPAL

*Decisão do Zeus: o ambiente principal (onde o app roda e ele trabalha o visual com o
Gemini) passa a ser o Google AI Studio. O Gemini alimenta o GitHub. O Claude vira o
ARQUITETO/COORDENADOR que dirige, revisa, integra e constrói arquivos sob demanda —
sempre sabendo o que mudou desde a última vez, mesmo sem estar conectado ao vivo.*

### A ÚNICA fonte da verdade: a branch `main` no GitHub
Todo mundo lê e escreve a `main`. O que impede a bagunça são 3 disciplinas simples:

**1. O CHANGELOG é obrigatório (o "diário de bordo" que me conta tudo).**
Sempre que o Gemini muda algo no AI Studio, ele ADICIONA no TOPO de
`docs/auditorias_e_backups/CHANGELOG_AI_STUDIO.md` uma linha curta:
`AAAA-MM-DD · o QUE mudou · por QUÊ · em QUAIS arquivos`.
É esse arquivo que me diz "o progresso todo que ocorreu enquanto eu não estava" —
barato de ler, e sobrevive até se o git do AI Studio bugar.

**2. Meu RITUAL DE RE-SINCRONIZAÇÃO (quando o Zeus me chama de volta):**
   1. `git fetch origin main` + `git checkout -B claude/ai-studio-github-sync-889al1 origin/main`
   2. Leio o TOPO do `CHANGELOG_AI_STUDIO.md` (a narrativa do que o Gemini fez).
   3. `git diff` nos arquivos que o changelog cita (vejo a mudança REAL, não só o resumo).
   4. Reviso, integro, CONSERTO o que veio bugado, rodo `npm run test`, e faço commit.
   5. `git push` na `main` E na minha branch-espelho `claude/...` (belt-and-suspenders:
      meu trabalho nunca some, mesmo se o AI Studio sobrescrever a main).
   6. Registro o que EU fiz no CLAUDE.md (que o Gemini lê quando puxa).

**3. Quem escreve por último PUXA antes de escrever.** (git fetch antes de qualquer push.)

### Como eu te dou comandos pro Gemini (você é o mensageiro)
Quando eu quiser que o Gemini analise ou construa algo, eu escrevo um **briefing**
(um bloco de texto pronto, ou um arquivo `docs/briefings/para-gemini-*.md`) e você
cola lá. Ele executa, você me traz a resposta, eu integro. Já existe o exemplo da
"VALIDAÇÃO CRUZADA" mais abaixo — o mesmo padrão vale pra pedir construções.

### Como eu te entrego arquivos pra levar ao AI Studio
Eu construo/edito no repositório, testo, e te digo EXATAMENTE quais arquivos são novos
ou mudaram (lista clara). Você puxa a `main` no AI Studio (ou joga os arquivos), e o
Gemini parte deles. Nunca precisa adivinhar — a lista + o changelog contam a história.

### Regra de ouro do modo (pra nunca mais dar telefone-sem-fio)
Antes de QUALQUER teste ou trabalho novo no AI Studio, o Gemini PUXA a `main`
(receita fechada abaixo) e confere o hash. Testar sem puxar = testar versão velha.
E o Gemini NUNCA "melhora" código por conta própria ao abrir — só faz o que o
changelog/briefing manda; melhorias espontâneas dele entram na oficial só depois
de eu revisar.

---

## ✅ O PADRÃO QUE FUNCIONA NA PRÁTICA (confirmado em 2026-07-19)

O Zeus testou os dois caminhos. O que realmente funciona pro AI Studio, sem fricção,
é o **Plano B da seção abaixo — não a branch `gemini-lab`.** Motivo: o AI Studio não
oferece um jeito confiável de escolher/empurrar pra uma branch específica do lado do
Zeus; o que ele SABE fazer bem é (a) puxar a branch oficial pra dentro do próprio
ambiente e (b) exportar um ZIP do que construiu lá. Então o ciclo real é este,
repetido quantas vezes o Zeus quiser trabalhar nos dois lugares:

1. **Puxar antes de mexer** — cola a "RECEITA DO PUXAR" (abaixo) no AI Studio ANTES
   de continuar trabalhando lá. Isso evita o telefone-sem-fio (testar bug que o
   Claude já matou 6 rodadas atrás).
2. **Trabalha no AI Studio** à vontade (ideias, docs, código, o que quiser).
3. **Pra trazer de volta:** exporta um ZIP do projeto (ou cola o conteúdo de um
   documento específico, se for só isso) e manda pro Claude nesta conversa.
4. **O Claude absorve**: documentos entram por fusão nos docs oficiais (nunca por
   cima, sempre com veredito registrado); código só entra por cherry-pick explícito,
   nunca substituindo a branch oficial (que pode estar muitas rodadas à frente).
   O Claude sempre finaliza dizendo qual é o commit/hash novo pra conferência.
5. Volta ao passo 1 na próxima vez que o Zeus for abrir o AI Studio.

**Por que isso não vira bagunça:** a branch oficial nunca é escrita por ninguém além
do Claude, e cada rodada de absorção gera um commit rastreável com veredito escrito
(ver `parecer-auditorias-externas.md`) — nada entra sem registro do que foi aceito,
adaptado ou recusado e por quê.

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

## 🔁 VALIDAÇÃO CRUZADA (colar no AI Studio quando quiser o RELATÓRIO do Gemini)

Depois de puxar a branch oficial (receita acima), cole isto pra ele estudar e devolver
um relatório que o Zeus copia de volta pro Claude:

> "Você acabou de sincronizar a versão oficial. NÃO modifique nada. Sua tarefa é SÓ
> estudar e relatar. Leia nesta ordem: `CLAUDE.md` (raiz) → `docs/planejamento/sala-de-situacao.md`
> → `docs/arquitetura/blueprint-professor-magico.md` → `docs/arquitetura/parecer-auditorias-externas.md` →
> os módulos novos `src/utils/composer.ts`, `src/utils/matricula.ts`,
> `src/utils/tutorials.ts`, `src/utils/generators.ts` (gA1Dinheiro) e
> `src/components/GameLoop.tsx`. Depois escreva um RELATÓRIO em markdown com
> exatamente estas seções: (1) BUGS que você encontrou lendo o código (com arquivo e
> linha); (2) RISCOS pedagógicos ou de UX que os documentos não cobrem; (3) SUGESTÕES
> de melhoria concretas (uma frase cada, sem reescrever arquitetura); (4) O QUE VOCÊ
> DISCORDA das decisões registradas e por quê. Não proponha reescritas grandes (ELO,
> XState, rebuild de home) — elas já foram avaliadas e decididas no parecer. Seja
> específico e cite arquivos. NÃO altere nenhum arquivo."

O Zeus cola o relatório de volta pro Claude, que responde item a item (adota/refuta)
no parecer. Assim as múltiplas IAs se fiscalizam sem ninguém sobrescrever ninguém.

## Plano B (se o AI Studio não deixar escolher a branch)
Se o AI Studio só sincronizar para uma branch fixa, então **o Gemini NÃO usa o GitHub**
— ele escreve as mudanças/códigos num documento (como `docs/auditorias_e_backups/backup-gemini-aistudio.md`),
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
