# 🧱 INVENTÁRIO DE PRIMITIVAS SAGA
**Versão 1.1 · Agosto 2026 · o que existe, o que está ligado, o que falta construir**

> **Para que serve.** A pergunta "as primitivas já foram criadas ou faltam?" precisava de uma
> resposta medida, não de impressão. Este documento é o mapa: cada `kind` do catálogo §9 da Bíblia,
> o componente que o desenha, e o estado real no repositório.
>
> **Como foi medido:** listagem de `src/components/primitives/`, extração dos `case` do
> `Composer.ts`, e extração dos kinds da §9 da Bíblia. Reprodutível.

---

# §1. O RESULTADO EM UMA LINHA

| | Quantos |
|---|---:|
| Kinds no catálogo §9 da Bíblia | **47** |
| Componentes de primitiva já escritos | **24** |
| Kinds efetivamente **ligados** ao Composer | **11** |

**A leitura correta disso não é "faltam 36".** É:

> **Metade das primitivas já está construída. O gargalo não é construir — é LIGAR.**
> Há 13 componentes prontos no disco que o Composer não sabe chamar. Ligar um componente pronto é
> trabalho de horas; construir do zero é trabalho de dias.

---

# §2. AS TRÊS PILHAS

## 2.1 🟢 PRONTO E LIGADO — funciona hoje *(11)*

| Kind | Componente | Onde aparece |
|---|---|---|
| `emojirow` | `EmojiRow` | contar, agrupar, subitizar |
| `numberline` | `NumberLine` / `InteractiveNumberLine` | reta numérica, saltos, arredondamento |
| `tenframe` | `TenFrame` | moldura de dez, amigos do 10 |
| `bond` | `NumberBond` | parte-todo, família de fatos |
| `draggroup` | `DragGroup` | arrastar para grupos |
| `scattered` | `ScatteredItems` | contagem dispersa, conservação |
| `tens` | `MaterialDourado` | dezena, centena, trocas |
| `relogio` | `Relogio` | horas, minutos |
| `balanca` | `Balanca` | igualdade, equação |
| `plain` | — | conta simbólica pura |
| `intruso_math` | — *(mapeia para `plain`)* | o intruso |

## 2.2 🟡 COMPONENTE EXISTE, FALTA LIGAR — o trabalho barato *(13)*

**Esta é a lista mais importante do documento.** Cada linha aqui é um componente já escrito,
testado ou não, esperando um `case` no Composer.

| Componente | Kind(s) que ele destrava | Por que importa |
|---|---|---|
| **`InteractiveVertical`** | `vertical` | **A CONTA ARMADA.** É a primitiva mais crítica de F2-F4. Estava na lista de "buracos P1" das auditorias — mas o componente **existe**. Sem ligar, F2 inteiro fica travado. |
| **`ArrayGrid`** | `array`, `area-model` | arranjo retangular, modelo de área, volume. É a ferramenta persistente que atravessa N4.02 → N4.09 → GM.11. |
| **`Quadrado100`** | `hundred-chart`, `frac-shade` | centena, décimos, centésimos, porcentagem. A mesma figura em três idades. |
| **`SingaporeBars`** | `singapore-bars`, `ratio-table` | método de barras, razão e proporção |
| **`TraceCanvas`** | `trace` | traçado — **e é a base da Prancheta (§9.3 da Bíblia)** |
| **`ShapeCanvas`** | `shapes`, `symmetry`, `geo-transform` | formas, simetria, transformações |
| **`StoryPanel`** | `story`, `scene` | problemas em painéis, histórias |
| **`SentenceBuilder`** | `math`, `sum` | montar a sentença matemática |
| **`TakeApart`** | `part-whole` | decompor quantidade |
| **`LinkingCubes`** | `bar-build` | cubinhos que encaixam, barras |
| **`VisualAddition`** | `subvis` | soma visual |
| **`TouchPlace`** | `count` | tocar para contar |
| **`AudioChoice`** | *(áudio)* | escolha por som — a base do F0 não leitor |
| **`Grupo`** | `groups` | grupos iguais |

## 2.3 🔴 NÃO EXISTE — precisa ser construído

| Kind | O que desenha | Prioridade | Onde trava sem ele |
|---|---|---|---|
| `money` | moedas e notas do Real | **P1** | GM.03 dinheiro e troco — F1, os filhos chegam nisso já |
| `measure` | régua, fita, alinhamento no zero | **P1** | GM.05 medidas padronizadas, F2 |
| `picto` | pictograma, gráfico de barras | **P1** | PE.01 e PE.02 — dados, F1 e F2 |
| `pattern` | sequência de padrão | **P1** | AL.02 padrões (F0!) e AL.04 sequências |
| `grid` | malha, mapa, coordenadas | P2 | GE.05 mapas (F2), GE.08 plano cartesiano (F3) |
| `angle` | transferidor, giro | P2 | GE.06 ângulos, F3 |
| `chip-model` | fichas de sinal (positivo/negativo) | P2 | N7.01 e N7.02 negativos, F4 |
| `blocks-3d` | sólidos, vistas | P2 | GE.04 sólidos, GE.10 volume e vistas |
| `daypart` | partes do dia | P3 | GM.02 tempo cotidiano, F0 |
| `journey` | mapa da jornada | P3 | navegação, não é exercício |
| `build-number` | compor número por ordens | P3 | N2.02, tem alternativa com `tens` |
| `order` | ordenar sequência | P3 | N1.07, tem alternativa com `numberline` |
| `conserv` | conservação lado a lado | P3 | N1.05, hoje resolvido com `scattered` |
| `flash` | modo flash | — | **é um MODO do `EmojiRow` e do `TenFrame`, não componente próprio** — usado por JD1, JD2, JD3 |
| `rapid-fire` | round cronometrado do Dojo | 🟢 | `RapidFire.tsx` **existe** em `components/exercises/` |
| `drag-match` | ligar par a par | 🟡 | é variação do `DragGroup` |
| `clock-set` | ajustar ponteiros | 🟡 | é modo do `Relogio` |
| `fact-family` | triângulo de fatos | 🟡 | é modo do `NumberBond` |
| `count`, `groups`, `sum`, `subvis`, `part-whole` | — | 🟡 | cobertos pelos componentes de §2.2 |

## 2.4 Mapa medido das 25 primitivas autorais

O catálogo F0–F4 usa nomes autorais de componente, enquanto o runtime despacha por
`kind`. O mapa executável e auditado mora em
`AI_Studio_Lab/tools/ficha_runtime_map.cjs`; ele impede considerar igualdade de nome
como prova de integração.

| Estado comprovado | Total | Significado |
|---|---:|---|
| Executável | **13** | há builder e renderer comprovados |
| Renderer sem builder | **5** | a tela sabe desenhar, mas o Composer ainda não gera os dados |
| Componente isolado | **6** | componente existe, mas não está na cadeia builder/renderer |
| Ausente | **1** | não existe componente, builder nem renderer |

As três divergências de nome foram resolvidas semanticamente:

- `TouchCount` não é uma primitiva ausente: usa `EmojiRow`/`emojirow`, que já oferece
  contagem por toque e áudio;
- `Moedas` já possui `MoneyCoin`/`MoneyNote` e renderer inline de `money`, mas ainda
  precisa de contrato extraído e builder;
- `Regua`/`measure` é a única lacuna realmente ausente entre as 25 primitivas usadas
  pelas fichas recebidas.

O primeiro desbloqueio após o inventário foi concluído: `vertical` agora possui
builder tipado, geração opcional com reagrupamento e contrato de resposta única para
o `InteractiveVertical`.

**Primitiva nova declarada na Bíblia v3.2 e ainda não construída:**

| Primitiva | Kind | Estado |
|---|---|---|
| **Prancheta** | `prancheta` *(camada, não kind de exercício)* | 🔴 a construir — base é o `TraceCanvas` que já existe |
| **Mão Fantasma** | `<GhostHand/>` *(camada)* | 🔴 a construir — spec em §7.1-bis, com o contrato de esmaecimento |

---

# §3. A ORDEM QUE EU FARIA

Ordenada por **desbloqueio por hora de trabalho**, não por elegância.

| # | O quê | Custo | Desbloqueia |
|---|---|---|---|
| 1 | Ligar `InteractiveVertical` → `vertical` | horas | **conta armada** — F2 inteiro |
| 2 | Ligar `ArrayGrid` → `array`, `area-model` | horas | multiplicação, área, volume — F2 a F4 |
| 3 | Ligar `Quadrado100` → `hundred-chart`, `frac-shade` | horas | centena, decimais, porcentagem |
| 4 | Ligar `SingaporeBars`, `ShapeCanvas`, `StoryPanel`, `SentenceBuilder` | 1 dia | frações, geometria, problemas |
| 5 | Construir `money`, `measure`, `picto`, `pattern` | dias | fecha F1 e boa parte de F2 |
| 6 | Construir a **Prancheta** sobre o `TraceCanvas` | 1-2 dias | conta armada usável de verdade |
| 7 | Construir a **Mão Fantasma** com o contrato esmaecido | 2 dias | o ensino do nível 1 em toda competência |
| 8 | Construir `grid`, `angle`, `chip-model`, `blocks-3d` | dias | F3 e F4 |

**Os passos 1 a 4 são 13 componentes prontos ganhando um `case`.** É o maior retorno por hora do
projeto inteiro, e é o que estava sendo contado como "buraco crítico" nas auditorias.

---

# §4. A REGRA PARA NÃO BAGUNÇAR

> **Primitiva é infraestrutura, não conteúdo.** Ela não sabe qual competência está sendo ensinada,
> não sabe o tema, não sabe a idade. Recebe dados e desenha.

| Regra | Bíblia |
|---|---|
| A primitiva **não escolhe cor, emoji nem tema** — recebe do skin | §10.11, camada visual |
| O gerador **não desenha** — produz dados puros | §10.11 |
| Uma primitiva serve **muitas** competências; nunca criar primitiva para uma competência só | §12.6 |
| Toda primitiva publica sua **API visual** para a coreografia | §7.4 |
| Kind novo passa pelo **§15.4 (TIPO C — mecânica nova)** | §15 |
| Toda mecânica de arrasto oferece **alternativa por toque** e snap | §8.3-bis |

**Antes de criar primitiva nova, o teste obrigatório:** existe componente que já faz isso com outro
nome? Este documento existe justamente porque `InteractiveVertical` e `TraceCanvas` estavam
construídos e sendo listados como "faltando".

---

*Changelog: v1.1 (ago/2026) — adiciona mapa autoral→runtime auditável e resolve semanticamente
`TouchCount`, `Moedas` e `Regua`. v1.0 — inventário inaugural, medido diretamente do repositório no branch
`codex/realizar-auditoria-completa-do-repositorio-saga-fovec6`. Corrige a percepção de que faltavam
primitivas críticas: `InteractiveVertical` (conta armada), `TraceCanvas` (traçado) e `RapidFire`
(Dojo) já existem — não estão ligados ao Composer.*
