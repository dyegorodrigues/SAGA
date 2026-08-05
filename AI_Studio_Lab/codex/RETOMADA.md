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
npm run sonda             # tela quebrada que o jsdom não vê (~280 tomadas)
npx vitest run            # o resto (1354 testes)
npx tsc --noEmit          # o Vitest NÃO faz typecheck
```

**Rode os quatro de uma vez, não um por defeito encontrado.** Ver §7.

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

**Passo 0.** Sete nós do F0 serviam ficha autoral chamando `Composer.generate`
de dentro do gerador "legado": o rollback era um no-op e a proveniência mentia.
Agora todos passam por `COMPOSER_FICHAS`, o legado de verdade está congelado em
`utils/legadoF0.ts`, e `portaDosFundos.test.ts` varre o **mecanismo** (não uma
lista — foi uma lista que deixou o N1.10 escapar).

**Passo 1.** `TouchCount` não existia e bloqueava as duas competências mais
fundamentais do app. Os dois modos e por que são a mesma primitiva estão
documentados em `procedimentos/touchCountProcedure.ts`.

### O próximo passo

**Passo 2 — a escada de modos do `EmojiRow`:** N1.03 (flash), N1.08/JD2 (flash
com skin de mão), AL.02 (padrão). Junto vem a **pendência P1** do plano: o
`EmojiRow` estreia em modo *flash* no N1.03, que **não tem pré-requisito
nenhum** — a criança encontra o desenho piscando antes de ter visto o desenho
parado. É decisão pedagógica sobre a ficha JD1, e a ficha é adaptável.

O `EmojiRow` que já existe **não é ponto de partida confiável**: entra como
suspeito, igual a todo o resto (§1).

### Estado dos canários

Ativos: `N3.09 N3.10 N4.03 N4.04 N4.06 N4.07 N4.08 N1.03 N1.07 N1.08 N1.10 AL.01`

Implementados e **NÃO** ativados — a tela existe e não chega à criança:
`N1.01` (pareamento, F07), `N1.02` (canhão, F27), `N1.04` (contar tocando, F01).

Ativar cada um é **PR próprio**. Sempre.

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

A branch está **segura para merge**. Nenhuma tela nova chega à criança: N1.01,
N1.02 e N1.04 estão implementados e desativados.

A única mudança que uma criança percebe é o **N1.04**, que saiu dos canários
porque a ficha dele foi reescrita neste trabalho. Ele volta ao legado congelado
— outra tela de "olhar e escolher um número", da mesma família da que servia
antes. Não é regressão pedagógica; é o mesmo patamar, esperando o PR de
ativação, que é quando a criança finalmente ganha o contar-tocando da F01.

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
| P1 | `EmojiRow` estreia em *flash* no N1.03, sem pré-requisito | `PLANO_DO_BLOCO_F0.md §7` |
| P2 | Gate de conformidade não conhece `excecaoCPA: "perceptual"` | idem |
| P4 | Falha de teste intermitente, vista uma vez, **não reproduzida** | idem |
| — | `scripts/e2e-screenshots.mjs` não chega à tela de exercício (seed velho) | commit `a2d6c87` |
| — | N4.09 ativação; N4.10–N4.12; coreografia faltando em N3.10, N4.03/04/06/07 | `ROTEIRO_ATE_O_FIM.md §4-bis` |

## 9. Branch

`claude/install-superpowers-repo-bst25i`. Nunca empurre para outra.
