# Briefing para o Codex — o que fazer, na ordem

> Escrito em 7/ago/2026 pelo Claude, ao fim do passo 3, para ser executado por
> outro agente **sem acesso à conversa que produziu o estado atual**.
>
> Este arquivo é auto-suficiente de propósito. Se algo aqui contradisser sua
> intuição, a intuição perde: cada regra abaixo custou um defeito que chegou à
> tela de uma criança.

---

## 0. Antes de qualquer coisa

**Leia, nesta ordem, e inteiro:**

1. `AI_Studio_Lab/codex/RETOMADA.md` — onde o trabalho parou
2. `AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md` — §14 é o último passo fechado;
   §10 a §13 são as decisões que reorganizaram o grafo
3. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` — **a fonte da verdade**
4. `AI_Studio_Lab/codex/PADRAO_OURO.md` — §1 (o trilho de sete passos) e §6
   (as armadilhas, todas numeradas e todas nascidas de um erro real)
5. `AGENTS.md` — a governança

**Depois execute os quatro portões**, para ver o estado real com os próprios
olhos em vez de confiar neste texto:

```bash
npm run fichas:conferir && npm run sonda && npx vitest run && npx tsc --noEmit
```

Estado esperado hoje: **9/9 · 1170 tomadas sem vazamento · 1908 testes · tsc
limpo**. O CI da `main` roda ainda `auditar`, `fichas:auditar`, `grafo:check` e
`build` — rode-os também antes de abrir PR, porque os quatro portões locais não
os cobrem (foi assim que o invariante de 89 competências escapou). Se algo estiver vermelho **antes** de você tocar em qualquer coisa,
pare e registre — não conserte às cegas.

---

## 1. Branch

**Branch nova, saindo de `main`.** Todo o trabalho anterior já está mesclado
(PR #24), e a branch que o produziu foi apagada — não procure por ela.

```bash
git fetch origin
git checkout -b codex/<nome-curto-do-trabalho> origin/main
```

Um trabalho, uma branch, um PR. Commits pequenos, mensagem dizendo **por quê**,
não o quê — o diff já diz o quê.

⚠️ **Duas branches no remoto NÃO são suas e não podem ser tocadas nem
apagadas:** `agent/creature-engine-tamagotchi` (35 commits, ~4.000 linhas do
Creature Lab) e `codex/criar-branch-para-creature-engine-tamagotchi` (3 commits,
guardas de binário PMD). Nenhuma das duas está na `main`, e são independentes
entre si. São outro assunto, com outro dono.

## 2. As cinco regras que não se negociam

Cada uma existe porque foi violada e custou caro.

### 2.1 Existir não é estar certo

Todo código que você encontrar entra como **suspeito**. As primitivas herdadas
já foram encontradas erradas quatro vezes; o `TenFrame` tinha cinco divergências
em relação às fichas que o nomeiam.

### 2.2 Honrar a ficha é a ficha INTEIRA

Não só a §5 (os níveis). **Todas** as nove seções:

| § | o que é | o que acontece se você pular |
|---|---|---|
| §1 | identidade, temas | o enunciado fala de estrelas e a tela desenha bolinha (aconteceu) |
| §3 | estrutura da tela | a moldura sai com 10 casas onde a ficha pede 5 (aconteceu) |
| §4 | roteiro **e interação** | a tampa não levanta no erro, escondendo a resposta (aconteceu) |
| §5 | os cinco níveis, **transcritos** | três degraus viram a mesma pergunta (aconteceu) |
| §6 | diagnóstico | a tag que existe só num nível vira a tag errada (aconteceu) |
| §7 | falas | o `explain` diz o que a ficha proíbe dizer |
| §8 | coreografia | declarar a aula e ela não aparecer na tela |
| §9 | domínio | a coroa fica inalcançável e nada acusa |

> No passo 3, **quatro dos cinco defeitos eram §4 ou §6 lidas pela metade** — e
> passaram pelo compilador e por 1786 testes.

### 2.3 Divergir da ficha é permitido; divergir em silêncio, não

Você pode discordar do cânone e implementar diferente — o cânone é adaptável.
O que não pode é a divergência existir sem estar escrita. Padrão do repositório:
comentário `⚠️ Divergência declarada` no código, com a **citação da ficha** ao
lado e o motivo. Veja `tenFrameContract.ts` para o formato.

### 2.4 Implementação e ativação são dois PRs

Ficha nova é escrita, medida, olhada em print — e fica **desligada**. A ativação
(entrar em `COMPOSER_CANARIES`) é um PR separado, depois.

O intervalo com a tela desligada é o que pega os defeitos: foi assim que
apareceram o canhão que faltava na F27, a barra de alternativas duplicada e a
moldura vazia deixando a criança contar o que não devia.

### 2.5 Junte os defeitos, rode o portão UMA vez

A sonda leva onze minutos. Rodar o portão inteiro a cada conserto já
transformou o instrumento de medida em gargalo — três vezes.

> construir → **um** print por cena → juntar **todos** os defeitos → **um**
> lote de correções → sonda filtrada → portão inteiro **uma** vez

Filtros existem: `npm run sonda -- "N1.03"`, `SONDA_SEMENTES=1 npm run sonda`.

### 2.6 Teste que falha se conserta corrigindo o CÓDIGO

Padrão Ouro §2-bis: só se muda um teste quando a lista dentro dele **é a
especificação**. Se for inventário (uma lista de ids, de kinds, de nós), o certo
é **derivar** da fonte, não reescrever a mão. Um teste ajustado para passar é
um portão desligado.

---

## 3. A fila, na ordem

### ✅ Tarefa 1 — FEITA (commit `HEAD~1`, `kindComBuilder.test.ts`)

Ficou pronta antes de o crédito acabar. Está aqui só para você saber o que
existe — **não refaça**. Comece pela tarefa 2.

`KindType` em `src/curriculum/schema.ts` declara 39 primitivas. **Nove não têm
builder no Composer** — uma ficha que as declare quebra na geração da questão,
na frente da criança:

```
linking-cubes · missing-addend-frame · multiple_choice · sentencebuilder
sequence · singaporebars · subvis · take-apart · visual-addition
```

O tipo promete o que o motor não entrega. É a mesma família de defeito que este
repositório já encontrou quatro vezes (primitiva órfã, tag testada e nunca
emitida, distrator ausente do banco): **declarado num lugar, esperado noutro, e
nada ligando os dois.**

`src/curriculum/kindComBuilder.test.ts` trava os nove como **dívida
declarada**, cada um com o motivo, e é escrito ao contrário: falha se aparecer
um kind novo sem builder **e** falha se um da lista ganhar builder sem a linha
ser removida. Os builders **não** foram implementados — a dívida está registrada,
não paga.

Achado de lado: `SentenceBuilder` é a **quinta primitiva órfã** (existe em
`components/primitives/` e não é alcançável por ninguém). Virou a pendência
**P18**.

### 🟡 Tarefa 2 — Os PRs de ativação, um por vez

**Risco: médio — isto chega à criança.** Só faça depois da tarefa 1 verde.

Oito nós estão implementados e **desligados**. Seis já cumpriram o intervalo de
observação e estão prontos:

| nó | ficha | o que a produção serve hoje |
|----|-------|------------------------------|
| `AL.01` | F51, separar por atributo | o intruso de múltipla escolha |
| `N1.06` | F05, ouvir e escolher | o número **escrito** na tela |
| `N1.13` | F04, produzir quantidade | nada — o nó é novo (P12) |
| `GE.01` | F47, onde está? | a resposta em **palavras** |
| `GE.02` | F48, que forma é essa? | dois emojis, que **não giram** |
| `GM.01` | F49, maior/menor/mais alto | nada — o nó não tinha gerador |

⚠️ **`N1.10` e `N1.11` NÃO entram.** Foram escritas no passo 3, hoje. Ativá-las
agora viola a regra 2.4 — a tela estrearia no mesmo dia em que foi escrita, sem
intervalo de observação nenhum.

**O procedimento, para cada nó, um PR:**

1. `node scripts/prints.mjs "<id do nó>"` e **olhe cada print**. Não passe
   adiante um print que você não abriu. Enquadramento certo é a área do
   exercício dentro do app, que é o que a sonda já monta.
2. Achou defeito → conserte, registre, e **não ative**. A ativação fica para o
   PR seguinte.
3. Tudo limpo → adicione o id a `COMPOSER_CANARIES` em
   `src/curriculum/motores/composerCanary.ts`, com um comentário dizendo **o que
   a criança passa a receber** e **qual é o alvo de rollback**.
4. Portão inteiro, uma vez.
5. Commit e PR com o print no corpo, se possível.

### 🟠 Tarefa 3 — A ficha F50 no nó `GM.05`

**Risco: alto — exige julgamento pedagógico.** Só se as duas anteriores
estiverem fechadas e você tiver lido o trilho do `PADRAO_OURO.md §1` inteiro.

A F50 ("Cabe mais ou menos?" — capacidade e massa) reivindica a `GM.02` na §1
dela. **Não é a GM.02**: aquele nó é "tempo cotidiano", é o que `gGM_02` serve, e
a `GM.04` (Horas) depende dessa leitura. A decisão já está tomada e registrada
em `PLANO_DO_BLOCO_F0.md §13.2`: a F50 vai para um nó **novo**, `GM.05 —
Capacidade e massa`, faixa F0, pré-requisito `GM.01`.

Duas coisas a saber antes de começar:

- **O nó nasce junto com a ficha, nunca antes.** Um nó sem ficha e sem gerador
  cai no fallback genérico — que é exatamente o defeito que a `GM.01` tinha e
  que este bloco passou o dia removendo.
- **O grafo é GERADO.** Edite `curriculum/grafo_saga.yaml` e rode
  `node scripts/generate-graph-artifacts.cjs`. Editar `src/curriculum/grafo_saga.ts`
  direto é perda de trabalho — `graphArtifacts.test.ts` pega.

O trilho, na ordem, sem pular etapa: ficha → procedimento → contrato → conteúdo
→ primitiva → Composer → canário (**e o canário fica desligado**).

### 🔴 Não faça

- **P8** (o motor do Jardim do Dojo) — é decisão de arquitetura e afeta a
  jornada inteira; fica para quando o autor estiver presente.
- **Editar as fichas do cânone** (`AI_Studio_Lab/pedagogia/fichas/*.md`) sem o
  autor. Divergir do cânone no código é permitido e documentável; reescrever o
  cânone não é decisão de agente.
- **Renumerar competências ou mexer em aresta do grafo** sem ler o §13 do plano.
  Duas competências já quase foram destruídas assim.
- **Ativar `N1.10` ou `N1.11`.**
- **Empurrar para a branch do Claude.**

---

## 4. Onde estão as coisas

| o quê | onde |
|---|---|
| as fichas (cânone) | `AI_Studio_Lab/pedagogia/fichas/FICHAS_F*_COMPLETAS.md` |
| procedimentos (§5, §6, §7 em código) | `src/curriculum/procedimentos/*Procedure.ts` |
| contratos (o que a tela recebe pronto) | `src/curriculum/procedimentos/*Contract.ts` |
| palcos | `src/components/primitives/*Stage.tsx` |
| o Composer | `src/curriculum/Composer.ts` |
| os canários | `src/curriculum/motores/composerCanary.ts` |
| as cenas da sonda | `sonda/cenas.tsx` |
| tags de diagnóstico | `src/constants/misconceptions.ts` |
| evidências da §9 (a coroa) | `src/constants/evidencias.ts` |

**Um exemplo completo e recente do trilho inteiro**, para copiar o formato:
`tenFrameProcedure.ts` + `tenFrameContract.ts` + `MolduraStage.tsx` +
`N1.11.ts` + os dois arquivos de teste. Três fichas, uma primitiva, todas as
divergências declaradas.

---

## 5. Definição de pronto

Uma tarefa só está pronta quando **todas** valem:

- [ ] os quatro portões passam, rodados **uma vez** no fim
- [ ] os prints das cenas afetadas foram **abertos e olhados**
- [ ] cada divergência da ficha está escrita no código, com citação
- [ ] nenhum teste foi ajustado para passar (regra 2.6)
- [ ] a `RETOMADA.md` registra o que mudou e o que ficou aberto
- [ ] commit e push na **sua** branch
