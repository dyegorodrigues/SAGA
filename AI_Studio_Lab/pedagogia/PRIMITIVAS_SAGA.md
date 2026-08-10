# 🧱 INVENTÁRIO DE PRIMITIVAS SAGA
**Versão 1.4 · Agosto 2026 · estado medido da cadeia ficha → Composer → renderer**

> **Fonte executável de verdade:** `AI_Studio_Lab/tools/ficha_runtime_map.cjs`.
> Este documento explica o mapa; não substitui o mapa. O auditor
> `AI_Studio_Lab/tools/ficha_catalog_auditor.cjs` valida os dois sentidos da
> integração: o que o mapa declara precisa existir **e** um kind convencional que
> já ganhou builder + renderer não pode continuar documentado como “isolado”.

---

# §1. O RESULTADO QUE IMPORTA

O catálogo autoral F0–F4 usa **26 primitivas mapeadas**. No estado atual da branch
cumulativa, com a infraestrutura da F61/GM.05 implementada mas o canário ainda
inativo:

| Estado comprovado | Total | O que significa |
|---|---:|---|
| **Executável** | **21** | ficha pode chegar a builder — genérico ou especializado — e renderer reais |
| **Renderer sem builder** | **4** | app sabe desenhar, Composer ainda não produz o contrato |
| **Componente isolado** | **1** | componente existe, mas ainda não forma cadeia executável |
| **Ausente** | **0** | nenhuma primitiva autoral usada pelas fichas está sem componente/cadeia suficiente |

A leitura correta não é “faltam dezenas de primitivas”. O gargalo real é misto:
algumas peças precisam apenas de ligação, outras precisam de contrato novo, e
várias que antes constavam como “faltando ligar” **já foram ligadas**.

Importante: **primitive executável não significa competência ativada**. `Regua`
já existe e possui builder especializado + Stage, mas GM.05 continua em fallback
enquanto o canário W5 estiver inativo. Infraestrutura e entrega curricular são
estados diferentes e a Coverage Matrix os mede separadamente.

---

# §2. MAPA AUTORAL → RUNTIME

## 2.1 🟢 Executáveis — 21

| Primitiva autoral | Dispatch/runtime | Observação |
|---|---|---|
| `ArrayGrid` | `arraygrid` → `array` | arranjos/área |
| `AudioChoice` | `audiochoice` | **F05/N1.06**; autoplay, retry e feedback temporal autoral |
| `Balanca` | `balanca` | igualdade |
| `Recipientes` | `medidas` | **F50/GM.12**; capacidade sem unidade: fontes cheias → despejo → recipientes iguais de referência |
| `DragGroup` | `draggroup` | agrupamento por arrasto |
| `EmojiRow` | `emojirow` | contagem/subitização |
| `Grupo` | `grandeza` → `GrandezaStage` | F49/GM.01; cadeia autoral especializada substitui o grupo genérico para manter bases alinhadas |
| `InteractiveNumberLine` | `numberline` / `numberline-f19` | reta interativa compartilhada; F19 usa builder especializado |
| `InteractiveVertical` | `vertical` | algoritmo vertical |
| `MaterialDourado` | `tens` / `material-dourado` | valor posicional; F21 usa Stage manipulativo especializado |
| `NumberBond` | `bond` | parte–todo |
| `NumberLine` | `numberline` | reta numérica |
| `Regua` | `regua-f61` | **F61/GM.05**; alinhamento no zero, drag + alternativa por toque, filtro motor e sonda Chrome |
| `Relogio` | `relogio` | tempo |
| `ScatteredItems` | `scattered` | conservação/contagem dispersa |
| `ShapeCanvas` | `shapecanvas` | **F47/GE.01 + F48/GE.02**; despacha para Stage específico |
| `StoryPanel` | `storypanel` → `story-bars` | F20/N3.10; builder e Stage narrativo especializados |
| `TenFrame` | `tenframe` | moldura de dez |
| `TouchCount` | `touchcount` | **F27/N1.02 + F01/N1.04**; primitiva própria de contagem por toque |
| `TouchPlace` | `touchplace` | **F04/N1.13**; produção de quantidade, arrasto, retry autoral |
| `plain` | `plain` | alternativa/simbólico básico |

### Ligações que não podem voltar a aparecer como “faltando”

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
- **`Regua`** deixou de ser lacuna estrutural na W5. `Regua.tsx` é a superfície
  visual, `ReguaStage.tsx` governa a interação e `reguaContract.ts` é o builder
  especializado da GM.05. O canário curricular continua independente desse fato.

## 2.2 🟡 Renderer existe, builder falta — 4

| Primitiva | Runtime já existente | Dívida real |
|---|---|---|
| `LinkingCubes` | `linking-cubes` | Composer ainda não constrói o contrato |
| `Moedas` | `money` | extrair contrato/builder; render inline já existe |
| `SingaporeBars` | `singapore-bars` | renderer legado existe; builder autoral ainda não é geral |
| `VisualAddition` | `visual-addition` | `subvis`/variação ainda não entra pelo Composer |

## 2.3 🟠 Componente isolado — 1

| Primitiva | Estado |
|---|---|
| `Quadrado100` | componente existe; falta builder/renderer autoral para os kinds declarados |

## 2.4 🔴 Ausentes — 0

Nenhuma das 26 primitivas autorais mapeadas está atualmente sem componente ou
cadeia suficiente para ser classificada acima. Isso **não** elimina dívida de
builder: `Moedas`, `LinkingCubes`, `SingaporeBars` e `VisualAddition` continuam
sem builder autoral, e `Quadrado100` continua isolado.

---

# §3. KINDS MAIS AMPLOS DA BÍBLIA

A Bíblia também nomeia modos/kinds que não correspondem 1:1 às 26 primitivas
autorais acima. Não contar cada nome como “um componente faltando”. Antes de
construir, classificar em uma destas categorias:

1. **alias** de primitiva existente;
2. **modo** de componente existente (`flash`, `clock-set`, `fact-family`);
3. **renderer legado** que precisa de builder;
4. **mecânica realmente nova**.

Exemplos de mecânicas relevantes fora do mapa autoral atual:

| Kind/mecânica | Situação |
|---|---|
| `measure` | realizado pela `Regua`/F61 na cadeia especializada GM.05; não criar segundo componente homônimo |
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
| builder especializado conta como cadeia real quando o auditor prova ID→builder→renderer | evitar `case` genérico morto apenas para satisfazer inventário |

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
kinds convencionais. Na W5 o gate ganhou ainda a noção explícita de **builder
especializado por competência**, para não forçar um builder genérico morto quando
uma primitive possui um único consumidor autoral real.

Se Composer/builder especializado + renderer já provam a cadeia e o mapa não a
reconhece, **o gate falha**.

Isso transforma este inventário de memória humana em contrato verificável.

---

*Changelog: v1.4 (ago/2026) — W5/F61 implementa `Regua` com builder especializado,
Stage responsivo, filtro motor, alternativa por toque e sonda Chrome; estado
medido passa a 21 executáveis / 4 renderer-sem-builder / 1 isolada / 0 ausentes,
sem confundir primitive pronta com canário GM.05 ativo. v1.3 — adiciona
`Recipientes` como a 26ª primitiva mapeada e 18ª executável após F50/GM.12
validada em Chromium e por inspeção visual; mantém unidades padronizadas fora de
F0. v1.2 — sincroniza `AudioChoice`, `TouchCount`, `TouchPlace` e `ShapeCanvas`
com o runtime real; adiciona guarda reversa no auditor. v1.1 — introduziu o mapa
autoral→runtime auditável e resolveu semanticamente `Moedas` e `Regua`. v1.0 —
inventário inaugural.*