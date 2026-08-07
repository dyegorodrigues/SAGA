# 🧱 INVENTÁRIO DE PRIMITIVAS SAGA
**Versão 1.2 · Agosto 2026 · estado medido da cadeia ficha → Composer → renderer**

> **Fonte executável de verdade:** `AI_Studio_Lab/tools/ficha_runtime_map.cjs`.
> Este documento explica o mapa; não substitui o mapa. O auditor
> `AI_Studio_Lab/tools/ficha_catalog_auditor.cjs` valida os dois sentidos da
> integração: o que o mapa declara precisa existir **e** um kind convencional que
> já ganhou builder + renderer não pode continuar documentado como “isolado”.

---

# §1. O RESULTADO QUE IMPORTA

O catálogo autoral F0–F4 usa **25 primitivas mapeadas**. No estado atual da branch
cumulativa:

| Estado comprovado | Total | O que significa |
|---|---:|---|
| **Executável** | **17** | ficha pode chegar a builder e renderer reais |
| **Renderer sem builder** | **4** | app sabe desenhar, Composer ainda não produz o contrato |
| **Componente isolado** | **3** | componente existe, mas ainda não forma cadeia executável |
| **Ausente** | **1** | não existe cadeia nem componente suficiente |

A leitura correta não é “faltam dezenas de primitivas”. O gargalo real é misto:
algumas peças precisam apenas de ligação, outras precisam de contrato novo, e
várias que antes constavam como “faltando ligar” **já foram ligadas**.

---

# §2. MAPA AUTORAL → RUNTIME

## 2.1 🟢 Executáveis — 17

| Primitiva autoral | Dispatch/runtime | Observação |
|---|---|---|
| `ArrayGrid` | `arraygrid` → `array` | arranjos/área |
| `AudioChoice` | `audiochoice` | **F05/N1.06**; autoplay, retry e feedback temporal autoral |
| `Balanca` | `balanca` | igualdade |
| `DragGroup` | `draggroup` | agrupamento por arrasto |
| `EmojiRow` | `emojirow` | contagem/subitização |
| `InteractiveNumberLine` | `numberline` | reta interativa |
| `InteractiveVertical` | `vertical` | algoritmo vertical |
| `MaterialDourado` | `tens` | valor posicional |
| `NumberBond` | `bond` | parte–todo |
| `NumberLine` | `numberline` | reta numérica |
| `Relogio` | `relogio` | tempo |
| `ScatteredItems` | `scattered` | conservação/contagem dispersa |
| `ShapeCanvas` | `shapecanvas` | **F47/GE.01 + F48/GE.02**; despacha para Stage específico |
| `TenFrame` | `tenframe` | moldura de dez |
| `TouchCount` | `touchcount` | **F27/N1.02 + F01/N1.04**; primitiva própria de contagem por toque |
| `TouchPlace` | `touchplace` | **F04/N1.13**; produção de quantidade, arrasto, retry autoral |
| `plain` | `plain` | alternativa/simbólico básico |

### Quatro ligações que não podem voltar a aparecer como “faltando”

- **`AudioChoice`** já possui builder, renderer e Stage executável. O fluxo F05 foi
  auditado em Chromium, inclusive abertura → primeira audição → opções → erro →
  retry → fecho.
- **`TouchCount`** não é apenas alias de `EmojiRow`: existe `TouchCount.tsx`,
  builder `touchcount`, renderer `touchcount` e contrato próprio. Ele compartilha
  gramática visual com a fileira, mas mede outra ação.
- **`TouchPlace`** já possui builder, renderer e Stage executável. O gesto canônico
  é arrasto real com alternativa por toque; o ghost sai do `PalcoEscalado` por
  portal para continuar sob o dedo.
- **`ShapeCanvas`** já possui builder `shapecanvas` e renderer. O mesmo contrato é
  especializado por `CenaDePosicaoStage` (F47) e `FormaStage` (F48).

## 2.2 🟡 Renderer existe, builder falta — 4

| Primitiva | Runtime já existente | Dívida real |
|---|---|---|
| `LinkingCubes` | `linking-cubes` | Composer ainda não constrói o contrato |
| `Moedas` | `money` | extrair contrato/builder; render inline já existe |
| `SingaporeBars` | `singapore-bars` | renderer legado existe; builder autoral ainda não é geral |
| `VisualAddition` | `visual-addition` | `subvis`/variação ainda não entra pelo Composer |

## 2.3 🟠 Componente isolado — 3

| Primitiva | Estado |
|---|---|
| `Grupo` | componente existe; falta cadeia autoral completa |
| `Quadrado100` | componente existe; falta builder/renderer autoral para os kinds declarados |
| `StoryPanel` | componente existe; não confundir com palcos narrativos específicos já criados |

## 2.4 🔴 Ausente — 1 entre as 25 primitivas usadas pelas fichas

| Primitiva | Kind | Lacuna |
|---|---|---|
| `Regua` | `measure` | régua/fita alinhável no zero + alternativa motora por toque |

---

# §3. KINDS MAIS AMPLOS DA BÍBLIA

A Bíblia também nomeia modos/kinds que não correspondem 1:1 às 25 primitivas
autorais acima. Não contar cada nome como “um componente faltando”. Antes de
construir, classificar em uma destas categorias:

1. **alias** de primitiva existente;
2. **modo** de componente existente (`flash`, `clock-set`, `fact-family`);
3. **renderer legado** que precisa de builder;
4. **mecânica realmente nova**.

Exemplos de mecânicas ainda relevantes fora do mapa autoral atual:

| Kind/mecânica | Situação |
|---|---|
| `measure` | lacuna real e prioritária |
| `picto` | requer primitiva de dados/gráfico |
| `pattern` | requer contrato próprio ou reutilização comprovada |
| `grid` | malha/mapa; prioridade para GE.05/GE.08 |
| `angle` | ângulos/transferidor |
| `chip-model` | inteiros positivos/negativos |
| `blocks-3d` | sólidos/vistas |
| `flash` | **modo**, não componente independente |
| `rapid-fire` | já existe em `components/exercises/` |
| `drag-match` | verificar reutilização de `DragGroup` antes de criar algo novo |
| `clock-set` | modo do `Relogio` |
| `fact-family` | modo do `NumberBond` |

---

# §4. REGRA DE ENGENHARIA

> **Primitiva é infraestrutura, não conteúdo.** Ela recebe contrato e desenha;
> quem decide competência, nível, diagnóstico e progressão são as camadas
> curriculares/orquestradoras apropriadas.

| Regra | Consequência |
|---|---|
| builder produz dados puros | React não decide currículo |
| Stage possui apenas a interação que a ficha lhe delega | GameLoop não fala por cima de feedback autoral |
| uma primitiva serve várias competências | evitar componente “da competência X” sem necessidade mecânica |
| arrasto sempre tem alternativa por toque e snap generoso | acessibilidade motora §8.3-bis |
| API visual explícita | microaula/Mão Fantasma não depende de seletor improvisado |
| kind novo exige auditoria de cadeia inteira | ficha → contrato → builder → renderer → Stage → Radar/evidência |

Antes de criar primitiva nova, responder obrigatoriamente:

1. já existe componente que faz a mesma mecânica com outro nome?
2. já existe renderer legado sem builder?
3. é apenas um modo de componente existente?
4. a ficha precisa mesmo de mecânica nova ou apenas de composição de primitivas?

---

# §5. PORTÃO CONTRA DERIVA DOCUMENTAL

O problema histórico era unilateral: o auditor verificava “o que o mapa declara
existe”, mas não verificava “o código evoluiu e o mapa ficou velho”. Por isso
`AudioChoice`, `TouchCount`, `TouchPlace` e `ShapeCanvas` puderam evoluir enquanto
a documentação ainda descrevia estados anteriores.

A partir da v1.2, `ficha_catalog_auditor.cjs` também faz a checagem reversa para
kinds convencionais. Se Composer + renderer já provam a cadeia e o mapa não a
reconhece, **o gate falha**.

Isso transforma este inventário de memória humana em contrato verificável.

---

*Changelog: v1.2 (ago/2026) — sincroniza `AudioChoice`, `TouchCount`, `TouchPlace`
e `ShapeCanvas` com o runtime real; corrige os totais do mapa autoral para
17 executáveis / 4 renderer-sem-builder / 3 isoladas / 1 ausente; adiciona guarda
reversa no auditor. v1.1 — introduziu o mapa autoral→runtime auditável e resolveu
semanticamente `Moedas` e `Regua`. v1.0 — inventário inaugural.*
