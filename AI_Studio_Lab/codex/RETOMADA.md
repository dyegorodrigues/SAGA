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

Ver `PADRAO_OURO.md §6.36`.

## 3. O primeiro comando de toda sessão

```bash
npm run fichas:conferir   # o que a FICHA manda × o que o app SERVE
npm run sonda             # tela quebrada que o jsdom não vê (~1170 tomadas, ~15 min)
npx vitest run            # o resto
npx tsc --noEmit          # o Vitest NÃO faz typecheck
```

**Rode os quatro de uma vez, não um por defeito encontrado.** Ver §7.

### O laço de trabalho, que NÃO é o portão

A sonda inteira passa de dez minutos, e o número de tomadas **cresce a cada
competência construída** — 430 quando esta seção foi escrita, 1170 hoje. Rodá-la
a cada conserto transforma o
instrumento de medida em gargalo — e foi o que aconteceu construindo a escada
do `EmojiRow`: três ciclos de print→conserto→print com nove defeitos na mão.

```bash
npm run sonda -- "N1.03"                   # só as cenas dessa competência
SONDA_SEMENTES=1 npm run sonda -- "N1.03"  # uma semente: 25 segundos
```

O portão continua sendo as oito sementes. O que mudou é **poder olhar antes**.
E o método é um só:

> construir → **um** print por cena, uma semente → juntar **todos** os defeitos
> → **um** lote de correções → sonda filtrada → portão inteiro **uma** vez.

## 4. Onde o trabalho está agora (ago/2026)

O plano do bloco inteiro está em **`PLANO_DO_BLOCO_F0.md`** — leia antes de
construir qualquer coisa. Ele traz as 18 competências do F0 com primitiva, modo,
regra dura, a ordem de construção agrupada por primitiva e o que cada escolha de
ordem previne.

### Passos concluídos

| # | Passo | Estado |
|---|-------|--------|
| 0 | Fechar a porta dos fundos do canário | ✅ `6cdb550` |
| 1 | `TouchCount` — N1.02 (F27) e N1.04 (F01) | ✅ `67f679a`, `0fd267b`, `a2d6c87`, `2f2ac29` |
| 2 | `EmojiRow` — a escada de modos: N1.03 (JD1), N1.08 (JD2), AL.02 (F52) | ✅ `696012b` em diante |
| 2 | `EmojiRow` — a escada de modos, e a **P1** | ✅ `696012b`, `422138e` |
| — | A varredura: 6 competências **ativas servindo outra coisa** | ✅ `PLANO §10`, `§12` |
| — | Telas em qualquer aparelho (`PalcoEscalado`); a sonda mede 3 larguras | ✅ `PLANO §11` |
| — | **P12**, **P13**, **P15** fechadas | ✅ `PLANO §10.4`, `§13` |
| 3 | `TenFrame` — a moldura de dez: N1.08 (F02), N1.11 (JD3), N1.10 (JD5) | ✅ `80e5231` |

**Passo 0.** Sete nós do F0 serviam ficha autoral chamando `Composer.generate`
de dentro do gerador "legado": o rollback era um no-op e a proveniência mentia.
Agora todos passam por `COMPOSER_FICHAS`, o legado de verdade está congelado em
`utils/legadoF0.ts`, e `portaDosFundos.test.ts` varre o **mecanismo** (não uma
lista — foi uma lista que deixou o N1.10 escapar).

**Passo 1.** `TouchCount` não existia e bloqueava as duas competências mais
fundamentais do app. Os dois modos e por que são a mesma primitiva estão
documentados em `procedimentos/touchCountProcedure.ts`.

**Passo 2.** Três fichas (JD1/N1.03, JD2/N1.08, F52/AL.02), um palco
(`EmojiRowStage`, composto a partir do próprio `EmojiRow`), um procedimento com
as três tabelas §5 transcritas do Markdown. A AL.02 **não existia em runtime**:
era servida por uma questão fixa que ignorava o nível.

**A P1 fechou, e a resposta não era a esperada.** Ela estava escrita como
decisão pedagógica sobre a ficha JD1. Não era: a §4 e a §8 da própria ficha já
mandavam preparar o olho, contar 3-2-1, revelar o desenho **parado** e dizer
quanto era — e **nada disso tinha sido implementado**. O degrau *plain* que
faltava na escada estava no cânone desde sempre.

> **P1 não era decisão pedagógica: era ficha lida pela metade.**

Detalhe inteiro em `PLANO_DO_BLOCO_F0.md §8`. O guarda contra a volta:
`emojiRowProcedure.test.ts` exige um beat de `revelar` em todo nível onde um
modo de relance estreia.

### O próximo passo

**Antes do passo 3, uma varredura entrou na frente**, e ela está **fechada**:
competências ativas servindo outra coisa — tela errada com o nome da certa, que
é pior que tela faltando, porque o Radar registra domínio do que a criança nunca
fez. Corrigidas: `AL.01`, `N1.06`, `N1.13` *(a F04 — o nó que a P12 criou; ela
reivindicava a `N1.09`, que continua sendo "contar até 20")*, `GE.01`, `GE.02`; e
a `GM.01`, que não era desse grupo — ela não tinha gerador nenhum.

A `GM.02` **não era o caso**, e o §12 do plano registra a correção: ela serve
"tempo cotidiano", que é o que o grafo diz que ela é, e a `GM.04` depende dessa
leitura. Tabela e achados em `PLANO_DO_BLOCO_F0.md §10` e `§12`.

**Cinco primitivas estavam órfãs** — existiam no código e não eram alcançáveis
por nenhuma ficha: `AudioChoice`, `TouchPlace`, `ShapeCanvas` (importado no
`FichaRenderer` sem `case`), `Grupo` e — achada na varredura do `KindType` —
`SentenceBuilder`. É o defeito mais barato de procurar e o
mais caro de não ver: ele faz o inventário parecer completo.

**Passo 3 — `TenFrame`, plain e flash: ✅ FECHADO.** N1.08 (níveis 3-5, ficha
F02), N1.10 (JD5) e N1.11 (JD3). Detalhe inteiro em `PLANO_DO_BLOCO_F0.md §14`.

O `TenFrame` entrou como **suspeito** (§1) e o era: cinco divergências entre a
primitiva e as fichas que a nomeiam. A pior — **o flash escondia a moldura junto
com as fichas**, quando a JD3 §4 manda o contrário (*"a moldura vazia permanece
300ms — o vazio é a última coisa que a criança vê"*). A ficha inteira mora
nesses 300ms.

Três defeitos só apareceram **relendo a ficha depois de o código compilar**:

1. a tampa da JD5 cobria **uma fileira só** — escondendo sete de dez, metade dos
   escondidos continuava à vista e a criança contava a resposta;
2. a tampa ficava **fechada no erro**, quando a §4 manda levantar nos dois casos;
3. a F02 §6 tem uma linha que **só existe no nível 5** (`INVERTE_PERGUNTA`), e
   sem o nível dentro da ação ela virava `CONTA_VAZIOS`.

E um quarto veio do **print**, não de teste nenhum: com a pergunta no ar, eu
tinha deixado a moldura vazia na tela. A JD3 §3 diz *"a área fica vazia enquanto
ela responde"* — e com as dez casas à vista a criança **conta as vazias uma a
uma**, que é o que a §7 proíbe e o que a ficha existe para dispensar.

E um **quinto** veio do print seguinte: o enunciado dizia *"quantas estrelas
você vê?"* e a moldura desenhava discos azuis genéricos (§6.34). A criança desta
faixa **não lê** — a única pergunta é a falada, e voz e tela dizendo coisas
diferentes é defeito. Os três temas da F02 §1 entraram, com concordância (§6.5:
*"Quantas ovos"* saiu da primeira tentativa).

> Cinco defeitos passaram pelo compilador e pelos testes. Quem os pegou foi
> reler a ficha inteira e **olhar a tela**.

Portões deste passo: `fichas:conferir` 9/9 · sonda **1170 tomadas** em três
larguras, sem vazamento nem colisão · `vitest` **1903** · `tsc` limpo.
*(A mensagem do commit `80e5231` diz "1320 tomadas"; o número certo é 1170.)*

### Estado dos canários

Ativos: `N3.09 N3.10 N4.03 N4.04 N4.06 N4.07 N4.08 N1.07` e, desde `ef92f10`,
os seis do bloco F0: `N1.01 N1.02 N1.03 N1.04 N1.08 AL.02`.

Implementados e **NÃO** ativados — a tela existe e não chega à criança:

| nó | ficha | o que a produção serve enquanto isso |
|----|-------|--------------------------------------|
| `AL.01` | F51, separar por atributo | `legadoAL_01` — o intruso de múltipla escolha |
| `N1.06` | F05, ouvir e escolher | `plain` com o número **escrito** na tela |
| `N1.13` | F04, produzir quantidade | **nada** — o nó é novo, criado ao fechar a P12 |
| `GE.01` | F47, onde está? | `plain` com a resposta em **palavras** |
| `GE.02` | F48, que forma é essa? | `plain` com dois emojis, que **não giram** |
| `GM.01` | F49, maior/menor/mais alto | **nada** — o nó não tinha gerador |
| `N1.10` | JD5, ver e imaginar | `gN1_10` — o **number bond** simbólico, que ela servia ATIVA |
| `N1.11` | JD3, moldura relâmpago | `gN1_11` — o nó nunca teve ficha |
| `N4.09` | — | legado |

⚠️ A **`N1.10` saiu dos canários** neste passo. Ela estava **ativa** servindo o
`bond` — o diagrama parte-todo, simbólico, com números escritos — onde a JD5
pede a operação mental *antes* do símbolo. Tela nova não estreia no PR que a
escreve, e a `N1.10` virou tela nova.

A **`N1.08` continua ativa** e é a única exceção do bloco: ela já era canário, e
os níveis 3-5 dela mudam de tela nesta entrega. A troca é consciente — os três
degraus da F02 §5 apontavam para a **mesma micro**, então o que a criança recebia
naqueles níveis era a mesma pergunta três vezes.

Ativar cada um é PR próprio, e o intervalo com a tela desligada é o que pega os
defeitos: foi assim que apareceram o canhão que faltava na F27, o enunciado
saindo duas vezes em três palcos e a mão que não parecia mão.

Ativar cada um é **PR próprio**. Sempre.

### Se outro agente trabalhar aqui antes da próxima sessão

👉 **O roteiro dele é o [`BRIEFING_CODEX.md`](./BRIEFING_CODEX.md)** — a fila de
tarefas por risco crescente, as regras com a cicatriz de cada uma, e o que ele
não deve tocar. Entregue aquele arquivo, não esta seção.

O estado inteiro está no repositório, não em conversa nenhuma. Ordem de leitura:

1. este arquivo;
2. `PLANO_DO_BLOCO_F0.md` — o §14 é o passo 3, e os §10 a §13 são as decisões
   que reorganizaram o grafo (P12, P13, P15);
3. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md` e as fichas em
   `AI_Studio_Lab/pedagogia/fichas/` — **o cânone**;
4. `PADRAO_OURO.md §1` (o trilho de sete passos) e `§6` (as armadilhas).

E as três regras que não se negociam, porque cada uma custou caro:

- **honrar a ficha é a ficha INTEIRA** — §3 estrutura, §4 roteiro *e* interação,
  §5 os cinco níveis transcritos, §6 diagnóstico, §7 falas, §8 coreografia,
  §9 domínio. Quatro dos cinco defeitos do passo 3 eram §4 ou §6 lidas pela
  metade;
- **divergir da ficha é permitido; divergir em silêncio, não** — toda
  divergência deste passo está escrita no código, com a citação ao lado;
- **implementação e ativação são dois PRs.** Tela nova não estreia no PR que a
  escreve.

## 5. Como se trabalha aqui

O trilho de sete passos está em `PADRAO_OURO.md §1`, a lista de verificação no
§2, e as armadilhas no §6 — cada uma custou uma rodada de erro e volta de graça
se não for lida.

Três hábitos que não são negociáveis:

1. **Capturar a tela e olhar**, nos cinco níveis. Teste verde não prova
   legibilidade — foi um adulto olhando que achou todos os defeitos graves.
   `node scripts/prints.mjs "<filtro>"` tira os prints das cenas da sonda.
2. **Mandar o print ao autor assim que montar**, antes de finalizar.
3. **Implementação e ativação são dois PRs.** Sempre.

### Honrar a ficha é a ficha INTEIRA

Não basta usar a primitiva certa. A ficha tem seções, e cada uma vira código:

| Seção | O que ela obriga |
|---|---|
| §3 Estrutura da tela | cada elemento listado existe (foi assim que o **canhão** da F27 ficou faltando) |
| §4 Roteiro | o que acontece em cada momento, e **a interação** — a F27 §4 diz que quem dispara é o canhão, não o dedo no balão |
| §5 Os 5 níveis | a tabela **transcrita**, não parafraseada |
| §6 Diagnóstico | cada linha vira uma tag em `constants/misconceptions.ts` |
| §7 Falas | `howto`, `explain`, `audioPrompt` — e o falado igual ao escrito |
| §8 Coreografia | os passos da micro-aula, e cada campo do `mostra` tem de **chegar à tela** |
| §9 Domínio | `acertos/de/sessoes`, com as regras extras |

Divergir da ficha é permitido; **divergir em silêncio, não.** Ver o desvio
declarado em `touchCountContract.ts → totalDoToque`.

## 6. Merge

A branch está **segura para merge**, e a razão é sempre a mesma: **nenhuma tela
nova chega à criança**. Tudo que foi construído está registrado em
`COMPOSER_FICHAS` e **fora** de `COMPOSER_CANARIES` — a regra dos dois PRs.

Duas mudanças que uma criança percebe, e as duas são para o **legado**, não para
a tela nova:

| nó | o que muda | por quê |
|----|-----------|---------|
| `N1.10` | volta ao `bond` do gerador legado | a ficha dela foi reescrita para a JD5; tela nova não estreia no PR que a escreve |
| `N1.08` níveis 3-5 | ganham a moldura da F02 | **exceção consciente**: o nó já era canário, e os três degraus apontavam para a mesma micro — a criança recebia a mesma pergunta três vezes |

O `N1.10` não é regressão pedagógica: ele volta ao mesmo patamar em que estava,
esperando o PR de ativação, que é quando a criança ganha a operação mental sem
símbolo que a JD5 descreve.

### Depois do merge

Quem retomar **sai de `main`**, não desta branch:

```bash
git fetch origin main && git checkout -b <nova-branch> origin/main
```

Branch de trabalho não é lugar de morar. Ela existe para um bloco, é mesclada, e
o próximo bloco sai do tronco — senão duas cadeias longas divergem e o merge
vira arqueologia.

## 7. Por que esta sessão rendeu menos, e o que mudou

Registrado porque o autor cobrou, e porque a próxima sessão não deve repetir.

**O que deu errado:**

1. **Achei que o legado estava pronto.** Peguei `N1.01`, `N1.04`, o `EmojiRow`,
   os `kind` herdados como base confiável. Não eram. O §1 existe por isso.
2. **Li a ficha pela metade.** A F27 §3 lista o canhão e a §4 descreve o
   disparo; eu implementei a criança tocando os balões — a interação do OUTRO
   modo. Só apareceu quando o autor perguntou.
3. **Corrigi um defeito por vez.** Tinha cinco prints na mão e rodei o portão
   inteiro (1354 testes + ~280 tomadas de sonda) cinco vezes. O certo é olhar
   tudo, juntar as correções, rodar uma vez.
4. **Enquadrei o print errado.** Fotografei o palco solto em vez da área do
   exercício dentro do app — e foi esse enquadramento que escondeu a barra de
   alternativas duplicada, defeito que já estava em produção no N1.01.
5. **Confiei em portão verde.** 1348 testes e a sonda passavam com o canhão
   desenhando peixinhos.

**O que virou mecanismo, para não depender de memória:**

- `portaDosFundos.test.ts` — nenhuma ficha chega à criança por fora do canário
- `fichaQuestionContract.test.ts` — nenhum parâmetro de ficha é descartado em
  silêncio (foi assim que o `modo: "ritmico"` sumiu)
- `PALCOS_QUE_RESPONDEM` em `answerPolicy.ts` — palco que coleta resposta não
  recebe a barra genérica por baixo
- `DIVIDA_DECLARADA` em `conformidadeDeFichas.test.ts` — dívida que deixou de
  existir **falha** e força a remoção da linha
- as cenas da sonda são montadas pelo **renderizador real do app**

## 8. Pendências abertas

| id | O que é | Onde |
|----|---------|------|
| ~~P1~~ | **fechada** no passo 2 — era ficha lida pela metade | `PLANO_DO_BLOCO_F0.md §8` |
| P2 | Gate de conformidade não conhece `excecaoCPA: "perceptual"` — **latente**: nenhum gate cobra nível abstrato hoje, então não morde | `PLANO_DO_BLOCO_F0.md §7` |
| P5 | O `FichaCompetencia` tem **um** `explain` por competência, e o N1.08 é servido por duas fichas cujas §7 se contradizem. Resolvido por override na micro (`params.explain`) — mas o schema continua assumindo uma ficha por competência | `fichaQuestionContract.ts` |
| P6 | A F52 §3 desenha "copie o padrão" e as §1/§5/§7/§8 descrevem "preencha a lacuna". Implementei a lacuna; a contradição segue no cânone | `AL.02.ts` |
| P7 | Os degraus 3-5 da JD2 (duas mãos) não cabem na Jornada do N1.08 e foram alocados à trilha JD2 do **Dojo**, que ainda não os consome | `N1.08.ts` |
| P4 | Falha de teste intermitente, vista uma vez, **não reproduzida** | idem |
| P8 | O motor do Jardim do Dojo: as trilhas JD1-JD5 existem e nada as apresenta à criança | `fichas/dojo/jardim/index.ts` |
| P9 | `AllFichas` mistura `FichaCompetencia` e `Track` — iterar aquilo rebenta com TypeError em vez de reprovar | `fichas/index.ts` |
| P10 | 12 competências trocam de MODO sem aviso; `N3.02` faz `EmojiRow` virar "riscar" vindo de 7 nós | `conformidadeDeFichas.test.ts` |
| P11 | `DragGroup` estreia em dois modos a partir de dois nós-raiz sem pré-requisito entre eles | `N1.01.ts`, `AL.01.ts` |
| ~~P12~~ | **fechada** — a F04 virou `N1.13`; a N1.09 continua sendo "contar até 20", que é o que quatro arestas precisam | `PLANO_DO_BLOCO_F0.md §13.1` |
| ~~P13~~ | **fechada** — a regra extra da §9 virou a terceira dimensão da coroa, no lugar do cronômetro (que violava o §5.1-bis) | `PLANO_DO_BLOCO_F0.md §10.4` |
| ~~P15~~ | **decidida** — a F50 vai para `GM.05` (capacidade e massa); o nó nasce junto com a ficha, não antes | `PLANO_DO_BLOCO_F0.md §13.2` |
| P14 | Palcos novos precisam entrar no `PalcoEscalado` — desenho de tamanho fixo sem ele vaza em tela pequena, e a sonda só acusa se a cena estiver no catálogo | `PalcoEscalado.tsx`, `PLANO_DO_BLOCO_F0.md §11` |
| P16 | A **F28** — a outra ficha da N1.11, os amigos do 10 como *conta*. A JD3 (implementada) é a percepção; a §2 dela diz que a forma simbólica é outra competência. A F28 não tem código | `N1.11.ts`, `PLANO_DO_BLOCO_F0.md §14.7` |
| P17 | O `bond` (parte-todo **simbólico**) é a N1.10 na faixa F1 e hoje só existe no gerador legado. Ativando a JD5, a N1.10 fica sem a forma simbólica até a ficha F1 existir | `N1.10.ts`, `PLANO_DO_BLOCO_F0.md §14.7` |
| P18 | **Nove kinds do `KindType` sem builder** no Composer: o tipo promete o que o motor não entrega, e uma ficha que os declare quebra na geração da questão. Travados como dívida declarada — registrados, **não pagos**. Inclui o `SentenceBuilder`, a **quinta primitiva órfã** | `kindComBuilder.test.ts` |
| — | `scripts/e2e-screenshots.mjs` não chega à tela de exercício (seed velho) | commit `a2d6c87` |
| — | N4.09 ativação; N4.10–N4.12; coreografia faltando em N3.10, N4.03/04/06/07 | `ROTEIRO_ATE_O_FIM.md §4-bis` |

### A fila, na ordem

1. **F50 → nó `GM.05`** (capacidade e massa). Decidida na P15; o nó nasce junto
   com a ficha, nunca antes — nó sem ficha cai no fallback genérico, que é o
   defeito que a `GM.01` tinha.
2. **Os PRs de ativação**, um por nó: `AL.01`, `N1.06`, `N1.13`, `GE.01`,
   `GE.02`, `GM.01`, `N1.10`, `N1.11`. Implementação e ativação são dois PRs.
3. **P8** — o motor do Jardim do Dojo. As cinco trilhas JD1-JD5 agora têm ficha
   (JD2 e JD3 escritas no cânone v3.1, todas implementadas), e **nada as
   apresenta à criança**.

## 9. Branch

**Saia sempre de `main`.** O bloco F0 foi entregue pelo PR #24 e a branch que o
produziu (`claude/install-superpowers-repo-bst25i-hrg5jr`) foi **apagada** depois
do merge — branch de trabalho não é lugar de morar.

```bash
git fetch origin main && git checkout -b <nova-branch> origin/main
```

⚠️ **Duas branches no remoto não pertencem a este trabalho e não devem ser
apagadas:** `agent/creature-engine-tamagotchi` (35 commits, ~4.000 linhas do
Creature Lab — renderer, catálogo de animações PMD, entrada Vite própria) e
`codex/criar-branch-para-creature-engine-tamagotchi` (3 commits, guardas de
binário PMD). **Nenhuma das duas está na `main`, e uma não contém a outra** —
verificado em 7/ago/2026. Apagar qualquer uma perde trabalho.

---

## Registro Codex - N1.06 / F05 (7/ago/2026)

- Branch codex/corrigir-n106, PR #27: CORRECAO FECHADA, NAO ATIVADA.
- F05 auditada de ponta a ponta: ficha -> grafo -> Composer -> audiochoice -> Stage/Renderer -> GameLoop -> Radar -> Chromium.
- Corrigidos: autoplay/convite, retry autoral, feedback concorrente, Radar/evidencia, reset com alvo repetido, tela vazia e grade 2x2 para 4 opcoes.
- Divergencia declarada: NAO_ESCUTOU nao pode nascer da primeira opcao apos autoplay; exige estado temporal anterior ao fim da primeira audicao.
- GameLoop permanece unico dono de q.prompt; Stage apenas sinaliza o fim da primeira audicao.
- questionDiagnostics agora preserva hipotese embutida em acao terminal correta; efeito compartilhado com F51/F04.
- CI final verde: run 31188064450. Visual final: run 31188061774, 8 sementes, Chromium real, prints inspecionados.
- N1.06 segue fora de COMPOSER_CANARIES; ativacao somente em PR separado.
- Auditoria F04/N1.13 ja achou: falta arrasto real, mao fantasma incompleta, reset de spec ausente, corrida no autofecho, conflito de retry e DEPENDE_DE_ANDAIME sem consumidor longitudinal.
- PRIMITIVAS_SAGA.md esta atrasado para AudioChoice/TouchPlace; nao usar esse inventario como verdade de runtime.


### Checkpoint Codex — F48/GE.02: fronteira 2D→3D explicitada

A auditoria sistêmica da F48 encontrou uma contradição entre artefatos canônicos: a ficha punha sólidos no nível 5 de `GE.02`, enquanto `curriculum/GE.yaml` define `GE.02` como **formas planas básicas** e `GE.04` como **sólidos geométricos**; a F59 confirma que cubo/esfera/cilindro pertencem à GE.04. A ficha foi retificada de forma explícita: o nível 5 agora mistura representações planas já aprendidas (pura + objeto do mundo, giro, cor e tamanho), testando transferência sem introduzir vocabulário 3D.

A mesma auditoria encontrou problemas independentes no palco: erro sem retry autoral, abertura cinematográfica ausente, comparação de erro incompleta, coreografia fixa em “triângulo” apesar de alvo sorteado, `destacarTodas` inerte, contagem de lados apenas textual e giro aplicado a todas as opções. A correção mantém `ShapeCanvas` compartilhado com F47 sem misturar as duas semânticas: `AnswerMeta.forma` identifica a autoria da F48; `AnswerMeta.posicao` continua identificando a F47.
