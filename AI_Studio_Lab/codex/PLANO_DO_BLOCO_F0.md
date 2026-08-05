# Plano do bloco F0 — a análise que vem ANTES de construir

> Este documento existe porque a forma errada de trabalhar já foi tentada:
> construir uma ficha, descobrir o problema na tela, corrigir, construir a
> próxima, descobrir o mesmo problema outra vez. O §6.36 do Padrão Ouro é o
> registro dessa falha — cada tela era conferida contra a **própria** ficha e
> nunca contra a **história da criança**.
>
> Aqui a ordem se inverte. Primeiro o bloco inteiro é lido; depois se constrói.
> O que este documento contém não é intenção, é **restrição**: cada linha abaixo
> ou já virou teste executável, ou está marcada como pendência com dono.

---

## §1 — As arestas abertas, encontradas antes de tocar em qualquer ficha

### §1.1 A porta dos fundos do canário — **7 nós, não 6**

O mecanismo de canário (`composerCanary.ts`) promete uma coisa: uma ficha
autoral só chega à criança se o id estiver em `COMPOSER_CANARIES`, e o rollback
é a retirada do id — sem rebuild, valendo na próxima questão.

A varredura mostrou que **sete nós furavam esse mecanismo**, chamando
`Composer.generate` direto de dentro do gerador legado:

| Nó | Onde | Desde |
|----|------|-------|
| N1.01 | `generators.ts:707` | `2550a2b` (migração de julho) |
| N1.03 | `generators.ts:715` | `2550a2b` |
| N1.04 | `generators.ts:719` | `2550a2b` |
| N1.07 | `generators.ts:787` | `2550a2b` |
| N1.08 | `generators.ts:797` | `16e18f4` |
| AL.01 | `generators.ts:801` | `16e18f4` |
| **N1.10** | **`generatorsF1.ts:18`** | `16e18f4` |

O N1.10 estava num **segundo arquivo** e não aparecia na lista que eu vinha
carregando. É a prova de que a varredura por arquivo não serve: só a varredura
por *mecanismo* encontra o que se esconde.

**Consequência real, não hipotética.** `selectGenerator` classificava esses nós
como `source: "legacy"` enquanto servia conteúdo de ficha. Três efeitos:

1. **O rollback era um no-op.** Tirar `N1.01` de `COMPOSER_CANARIES` não mudava
   nada — a ficha continuava sendo servida pelo "legado".
2. **A proveniência mentia.** A Oficina lê `generatorSource`; ela via `legacy`
   onde havia ficha autoral.
3. **Minha própria mensagem de commit mentiu.** Escrevi "implementada e não
   ativada" no commit do N1.01. Estava errado: a tela nova foi para produção no
   mesmo commit que a escreveu, que é exatamente o que a regra dos PRs separados
   existe para impedir.

**Exceção legítima:** `SandboxModal.tsx:35` chama `Composer.generate` de
propósito — é a pré-visualização administrativa, cujo trabalho é justamente
mostrar a ficha independentemente do canário. Fica declarada no gate.

### §1.2 O que o rollback deve alcançar

Princípio, para não decidir caso a caso: **o alvo de rollback é a última tela
que a produção serviu antes desta mudança.**

- Para os seis nós cuja ficha **não** mudou (N1.03, N1.04, N1.07, N1.08, AL.01,
  N1.10), a produção de hoje já é a ficha. Regularizar = registrar a ficha e
  ativar o canário: **zero mudança de comportamento**, mecanismo honesto.
- Para o **N1.01**, cuja ficha eu reescrevi de `draggroup`/contagem para
  `pareamento`, o alvo de rollback é a ficha **anterior** — congelada em
  arquivo. Cair no gerador de contagem de julho seria pior que o bug: perguntaria
  *"quantos?"* numa competência pré-numérica.

---

## §2 — O bloco F0 inteiro, numa tabela

Extraído das fichas autorais em `AI_Studio_Lab/pedagogia/`, não de memória.

| Nó | Ficha | Primitiva (modo) | Existe? | Regra dura |
|----|-------|------------------|---------|-----------|
| N1.01 | F07 | `DragGroup` (parear) | ✅ (novo `PareamentoStage`) | ⚠️ **nenhum numeral em nenhum nível** |
| N1.02 | F27 | `TouchCount` (rítmico) | ❌ **não existe** | um número por batida |
| N1.03 | JD1 | `EmojiRow` (flash) | ✅ / modo ❌ | ⚠️ `excecaoCPA: perceptual` |
| N1.04 | F01, F03 | `TouchCount`, `EmojiRow`, `ScatteredItems` | ❌ **não existe** | o último número dito É o total |
| N1.05 | F06 | `Grupo ×2` | ✅ | ⚠️ containers do **mesmo tamanho** |
| N1.06 | F05 | `AudioChoice` | ✅ | ⚠️ tela **deliberadamente vazia** |
| N1.07 | JD4 | `AudioChoice` + `NumberLine` | ✅ | — |
| N1.08 | F02, JD2 | `TenFrame`, `EmojiRow` (flash, skin mão) | ✅ / modo ❌ | ⚠️ `perceptual` |
| N1.09 | F04 | `TouchPlace` | ✅ | — |
| N1.10 | JD5 | `TenFrame` + `EmojiRow` (flash duplo) | ✅ / modo ❌ | — |
| N1.11 | F28, JD3 | `TenFrame` (flash) | ✅ / modo ❌ | ⚠️ `perceptual` |
| N1.12 | F19 | `InteractiveNumberLine` | ✅ | ⚠️ contam-se os **saltos**, não as casas |
| AL.01 | F51 | `DragGroup` (caixas/laços) | ✅ / modo ❌ | — |
| AL.02 | F52 | `EmojiRow` (padrão) | ✅ / modo ❌ | — |
| GE.01 | F47 | `ShapeCanvas` (cena) | ✅ / modo ❌ | ⚠️ **um único referente** na cena |
| GE.02 | F48 | `ShapeCanvas` | ✅ | — |
| GM.01 | F49 | `Grupo ×2` | ✅ | ⚠️ bases na **mesma linha horizontal** |
| GM.02 | F50 | `Balanca` + `ShapeCanvas` | ✅ | — |

---

## §3 — As estreias de modo, que é onde o §6.36 morde

Uma primitiva com modo novo **é um desenho novo para a criança**, ainda que o
componente já exista no código. A regra que governa tudo:

> Uma tela introduz no máximo UMA coisa nova. Conteúdo novo → desenho velho.
> Desenho novo → conteúdo que a criança já domina.

Dentro do próprio F0 há quatro escadas de modo:

- `EmojiRow`: **plain** → **flash** (N1.03) → **flash + skin mão** (N1.08/JD2) → **padrão** (AL.02)
- `TenFrame`: **plain** (N1.08/F02) → **flash** (N1.11/JD3)
- `DragGroup`: **parear** (N1.01/F07) → **caixas/laços** (AL.01/F51)
- `ShapeCanvas`: **cena** (GE.01/F47) → **plain** (GE.02/F48)

**Achado que muda a ordem de construção:** o `TenFrame` estreia em modo *plain*
no N1.08 e em modo *flash* no N1.11 — mas o N1.11 tem o N1.08 como pré-requisito
(`N1.11 ← N1.08, N1.10`). A escada existe e está na ordem certa. Já o
`EmojiRow` estreia direto em **flash** no N1.03, que **não tem pré-requisito
nenhum** — a criança encontra o desenho piscando antes de ter visto o desenho
parado. Isso é uma estreia de modo sem alfabetização visual, dentro do primeiro
nó que ela toca.

→ **Pendência P1**, registrada abaixo. Não é bug de código: é decisão
pedagógica sobre a ficha JD1, e a ficha é adaptável.

---

## §4 — As três fichas perceptuais não sobem a escada CPA

N1.03 (JD1), N1.08 (JD2) e N1.11 (JD3) trazem `excecaoCPA: "perceptual"`. Elas
**não têm forma abstrata** — progridem por automaticidade (tempo de flash
caindo), não por abstração. Construí-las com a escada padrão
Concreto→Pictórico→Abstrato as quebraria.

O gate de conformidade precisa **saber disso**, ou vai cobrar delas um nível
abstrato que a ficha proíbe. → **Pendência P2**.

---

## §5 — `TouchCount` bloqueia as duas competências mais fundamentais

`TouchCount` não existe em `src/components/primitives/`. Ele é a primitiva de:

- **N1.02** (F27) — contagem rítmica, um número por batida
- **N1.04** (F01) — cardinalidade: o último número dito É o total

Estes são, literalmente, o começo da matemática. E `N1.02` é pré-requisito de
N1.04, N1.06, N1.07 e N1.09 — metade do bloco N1 depende dele.

**Portanto `TouchCount` é o primeiro código a ser escrito depois de fechar a
porta dos fundos.** Construir qualquer outra coisa antes é construir sobre um
buraco.

---

## §6 — A ordem de construção, e o que cada escolha previne

Agrupada por primitiva, não por numeração: quem constrói `TenFrame` uma vez
constrói os três nós que o usam, e a coerência sai de graça em vez de sair de
revisão.

| # | Passo | Nós | O que esta posição previne |
|---|-------|-----|---------------------------|
| 0 | **Fechar a porta dos fundos** | os 7 | Sem isto, toda ficha que eu escrever vai para produção no mesmo commit, sem rollback. Previne repetir o erro do commit do N1.01. |
| 1 | **`TouchCount`** | N1.02, N1.04 | Desbloqueia metade do bloco. Construído antes, os nós que dependem dele nascem certos; depois, nascem com gambiarra. |
| 2 | **`EmojiRow` — a escada de modos** | N1.03, N1.08(JD2), AL.02 | Resolve a estreia-em-flash (P1) de uma vez para os três, em vez de descobri-la três vezes. |
| 3 | **`TenFrame` — plain e flash** | N1.08, N1.10, N1.11 | A escada plain→flash já está na ordem de pré-requisitos; construir junto garante que o desenho seja **o mesmo** nos dois modos. |
| 4 | **`Grupo ×2`** | N1.05, GM.01 | As duas regras duras são a mesma regra (tamanho igual / base alinhada): comparar quantidade e comparar altura só funcionam se a moldura não der a dica. |
| 5 | **`AudioChoice` (+ `NumberLine`)** | N1.06, N1.07 | A tela vazia do N1.06 é intencional; construída junto com o N1.07 fica claro o que é ausência de cenário e o que é falta de implementação. |
| 6 | **`TouchPlace`, `InteractiveNumberLine`** | N1.09, N1.12 | Ficam por último em N1 porque dependem de contagem já automatizada. |
| 7 | **`DragGroup` (caixas/laços), `ShapeCanvas`, `Balanca`** | AL.01, GE.01, GE.02, GM.02 | Ramos laterais sem dependência do tronco N1; entram depois sem bloquear ninguém. |

**Por que não uma ficha por vez, na ordem do número:** porque `EmojiRow` apareceria
no passo 3, 8 e 14, e nas três vezes eu decidiria de novo o que já tinha decidido —
que é precisamente como as quatro rejeições do modelo de área aconteceram.

---

## §7 — Pendências abertas por esta análise

| id | Pendência | Tipo | Estado |
|----|-----------|------|--------|
| P0 | Porta dos fundos do canário (7 nós) | mecanismo | **fechada neste commit** |
| P1 | `EmojiRow` estreia em modo *flash* no N1.03, que não tem pré-requisito | pedagógica (ficha JD1) | aberta — decidir no passo 2 |
| P2 | Gate de conformidade não conhece `excecaoCPA: "perceptual"` | mecanismo | aberta — antes do passo 2 |
| P3 | `TouchCount` inexistente bloqueia N1.02 e N1.04 | código | aberta — é o passo 1 |
| P4 | Falha de teste intermitente vista uma vez, não reproduzida em 7 execuções, nome não capturado | desconhecida | **aberta e sem pista** |

P4 fica escrita porque não foi resolvida. Não reproduzir não é o mesmo que não
existir, e apagar a linha seria transformar ignorância em confiança.
