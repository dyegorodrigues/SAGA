# Auditoria P18 — KindType promete × Composer entrega

> Gerado automaticamente no head da `codex/integrar-bloco-f0` em 8/ago/2026.
>
> Regra: um nome no `KindType` autoral não ganha builder só porque existe. Primeiro
> provamos quem o declara e qual semântica já existe. O objetivo é reduzir API falsa
> e aliases duplicados, não aumentar o número de caminhos.

## Resumo

| kind | fichas TS | cânone | builder | refs renderer | refs componentes | leitura |
|---|---:|---:|---|---:|---:|---|
| `linking-cubes` | 0 | 0 | não | 2 | 2 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `missing-addend-frame` | 0 | 0 | não | 0 | 0 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `multiple_choice` | 0 | 0 | não | 0 | 0 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `sentencebuilder` | 0 | 0 | não | 0 | 2 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `sequence` | 1 | 0 | não | 1 | 1 | DÍVIDA REAL: ficha TS declara o kind e o Composer não constrói |
| `singaporebars` | 0 | 11 | não | 2 | 25 | CANÔNICO SEM FICHA TS: resolver a ficha antes do builder |
| `subvis` | 0 | 0 | não | 1 | 3 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `take-apart` | 0 | 0 | não | 3 | 3 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |
| `visual-addition` | 0 | 0 | não | 2 | 2 | ALIAS/LEGADO/ÓRFÃO: separar da API autoral antes de construir |

## Critério de decisão

1. **Ficha TS declara** → é dívida executável real; estudar contrato e implementar/normalizar.
2. **Só cânone declara** → escrever/retificar ficha antes de tocar no Composer.
3. **Só legado/componente declara** → não transformar legado em API autoral por acidente; normalizar ou retirar o alias.
4. **Nada declara** → remover do `KindType` é preferível a fabricar um builder sem consumidor.

## Ocorrências encontradas

### `linking-cubes`

```text
AI_Studio_Lab/DIARIO_DE_BORDO.md:221: - **linking-cubes / sequence / sum:** Serão integrados às progressões de adição concreta (N3.01-04) e sequenciamento (N1.07, N2.02).
.github/workflows/audit-p18-kinds.yml:34: 'linking-cubes', 'missing-addend-frame', 'multiple_choice',
AI_Studio_Lab/pedagogia/PRIMITIVAS_SAGA.md:73: | `LinkingCubes` | `linking-cubes` | Composer ainda não constrói o contrato |
AI_Studio_Lab/codex/BRIEFING_CODEX.md:166: 4. `linking-cubes`, `take-apart`, `visual-addition` — embrulhar legado somente se
AI_Studio_Lab/tools/ficha_runtime_map.cjs:36: { primitive: "LinkingCubes", kinds: ["linking-cubes"], componentFiles: [component("LinkingCubes")], builderKinds: [], rendererKinds: ["linking-cubes"] },
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:16: - **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:50: "linking-cubes": "Palco legado (`LinkingCubes`), desenhado pelo FichaRenderer a partir de `question.groups` — nunca teve caminho pelo Composer.",
src/curriculum/kindComBuilder.test.ts:57: "take-apart": "Palco legado (`TakeApart`), desenhado a partir de `question.a/b/n` — mesmo caso do `linking-cubes`.",
src/curriculum/conformidadeDeFichas.test.ts:148: "linking-cubes": ["LinkingCubes"],
src/components/FichaRenderer.tsx:128: case 'linking-cubes':
src/components/gameloop/GameLoopExerciseRenderer.tsx:495: {q.kind === "linking-cubes" && q.groups && <LinkingCubes groups={q.groups.map(g => ({ n: g.n, color: (g as any).color || "bg-blue-400" }))} showNumbers={q.uiProps?.showNumbers} />}
```

### `missing-addend-frame`

```text
.github/workflows/audit-p18-kinds.yml:34: 'linking-cubes', 'missing-addend-frame', 'multiple_choice',
AI_Studio_Lab/codex/BRIEFING_CODEX.md:170: 6. `missing-addend-frame` — construir apenas a partir da ficha que o especifica;
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:16: - **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:51: "missing-addend-frame": "Nomeado no cânone (parcela desconhecida na moldura) e sem componente nenhum: dívida de primitiva, não só de builder.",
```

### `multiple_choice`

```text
.github/workflows/audit-p18-kinds.yml:34: 'linking-cubes', 'missing-addend-frame', 'multiple_choice',
AI_Studio_Lab/codex/BRIEFING_CODEX.md:168: 5. `multiple_choice`, `sequence`, `subvis` — candidatos a remoção do tipo se forem
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:52: "multiple_choice": "Genérico herdado. Não é primitiva: é a ausência de uma. Ficha que precise de alternativa simples usa `plain`.",
src/curriculum/motores/composerCanary.test.ts:12: const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });
src/curriculum/motores/curriculum.ts:23: kind: "multiple_choice",
```

### `sentencebuilder`

```text
.github/workflows/audit-p18-kinds.yml:35: 'sentencebuilder', 'sequence', 'singaporebars', 'subvis',
AI_Studio_Lab/codex/RETOMADA.md:134: `SentenceBuilder`. É o defeito mais barato de procurar e o
AI_Studio_Lab/codex/RETOMADA.md:345: | P18 | **Nove kinds do `KindType` sem builder** no Composer: o tipo promete o que o motor não entrega, e uma ficha que os declare quebra na geração da questão. Travados como dívida declarada — registrados, **não pagos**
AI_Studio_Lab/codex/BRIEFING_CODEX.md:162: 2. **`sentencebuilder`** — componente existe, mas está órfão; primeiro descobrir
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:15: * do TypeScript, então escrever `primitiva: "sentencebuilder"` **compila** — e
src/curriculum/kindComBuilder.test.ts:53: "sentencebuilder": "`SentenceBuilder` existe em `components/primitives/` e não é alcançável por ninguém — a quinta primitiva órfã. Ver PRIMITIVAS_SAGA.md §4.",
src/components/primitives/SentenceBuilder.tsx:5: export interface SentenceBuilderProps {
src/components/primitives/SentenceBuilder.tsx:12: export function SentenceBuilder({ expected, pieces, onComplete, disabled }: SentenceBuilderProps) {
```

### `sequence`

```text
AI_Studio_Lab/DIARIO_DE_BORDO.md:221: - **linking-cubes / sequence / sum:** Serão integrados às progressões de adição concreta (N3.01-04) e sequenciamento (N1.07, N2.02).
.github/workflows/audit-p18-kinds.yml:35: 'sentencebuilder', 'sequence', 'singaporebars', 'subvis',
AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md:347: | N1.09 | F04: produzir quantidade | `gVis_Sequence`: "conte a partir do 47" | ✅ este commit |
AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md:374: competência. Nada se perde agora (o legado `gVis_Sequence` segue como alvo de
AI_Studio_Lab/codex/PLANO_DO_BLOCO_F0.md:587: **E um defeito colhido no caminho:** `gVis_Sequence`, o legado que serve a
AI_Studio_Lab/codex/BRIEFING_CODEX.md:168: 5. `multiple_choice`, `sequence`, `subvis` — candidatos a remoção do tipo se forem
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:16: - **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
src/utils/generators.ts:1: import { gVis_Scattered, gVis_VisualAddition, gVis_LinkingCubesSentence, gVis_Sequence } from "../utils/generatorsVisual";
src/utils/generators.ts:795: return gVis_Sequence(lvl);
src/utils/generatorsVisual.ts:143: export function gVis_Sequence(lvl: number): Question {
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:54: "sequence": "Herdado dos geradores legados (`order`); nenhuma ficha do cânone o nomeia.",
src/curriculum/motores/dojoEngine.ts:185: const finalSequence = [...normalItems, ...easyItems];
src/curriculum/motores/dojoEngine.ts:186: return finalSequence.map(c => c.id).slice(0, totalSize);
src/curriculum/procedimentos/producaoProcedure.test.ts:281: // que o `gVis_Sequence` servia no lugar desta competência.
src/curriculum/fichas/jornada/N1.13.ts:39: * O nó era servido por `gVis_Sequence`: *"Conte a partir do 47. Quais números
src/components/gameloop/GameLoopExerciseRenderer.tsx:743: {shouldRenderQuestionOptions(q) && q.options && (<div className={`gap-3.5 ${(q.kind === "take-apart" || q.kind === "sequence" || q.options.some(o => !!o.groups)) ? "flex flex-col" : "grid grid-cols-2"}`}>
src/engine/mascot-v2/SpriteAnimator.tsx:56: // If exact pose not found, and it's not a sequence like "walk_right_0", try mapping
src/engine/mascot-v2/SpriteAnimator.tsx:66: const isSequence = !!atlas.frames[basePose + '_0'];
src/engine/mascot-v2/SpriteAnimator.tsx:67: const maxFrames = isSequence ? 6 : 1; // Assuming max 6 frames for walk (0 to 5)
src/engine/mascot-v2/SpriteAnimator.tsx:71: if (!isSequence) return;
src/engine/mascot-v2/SpriteAnimator.tsx:78: }, [basePose, isSequence, maxFrames]);
src/engine/mascot-v2/SpriteAnimator.tsx:81: if (!isSequence && basePose.includes('walk')) {
src/engine/mascot-v2/SpriteAnimator.tsx:84: const activePoseName = isSequence ? `${basePose}_${frameIdx}` : basePose;
.claude/skills/graphify/references/extraction-spec.md:61: Node ID format: lowercase, only `[a-z0-9_]`, no dots or slashes. Format: `{stem}_{entity}` where stem is the **full repo-relative path with the extension dropped**, every path segment kept and joined with `_` (each segme
```

### `singaporebars`

```text
AI_Studio_Lab/CADERNO_DE_PERCEPCOES.md:52: **Não reescrever o que já existe.** `StoryPanel` e `SingaporeBars` já estavam no
AI_Studio_Lab/DIARIO_DE_BORDO.md:625: em N3.10, StoryPanel ou SingaporeBars.
AI_Studio_Lab/DIARIO_DE_BORDO.md:626: - A arquitetura planejada do Lote D separa StoryPanel (narrativa) e SingaporeBars
AI_Studio_Lab/DIARIO_DE_BORDO.md:656: como primitiva principal de N3.10, e o `SingaporeBars` existente cobre apenas
AI_Studio_Lab/DIARIO_DE_BORDO.md:657: `A + B = total`. O passo "ligar SingaporeBars ao builder" foi substituído no
AI_Studio_Lab/DIARIO_DE_BORDO.md:693: StoryPanel e SingaporeBars, camada narrativa e builder do Composer.
AI_Studio_Lab/DIARIO_DE_BORDO.md:713: - Ponto exato de parada: faltam o `StoryPanel`, a extensão do `SingaporeBars`
.github/workflows/audit-p18-kinds.yml:35: 'sentencebuilder', 'sequence', 'singaporebars', 'subvis',
AI_Studio_Lab/pedagogia/PRIMITIVAS_SAGA.md:75: | `SingaporeBars` | `singapore-bars` | renderer legado existe; builder autoral ainda não é geral |
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:54: 1. Ligar componentes existentes: `InteractiveVertical`, `ArrayGrid`, `Quadrado100`, `SingaporeBars`.
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:165: narrativa e SingaporeBars da representação de N3.10, cobrindo `join`, `separate`,
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:172: é compreender a transformação entre dois momentos da história; `SingaporeBars` é a
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:173: representação da relação, não o exercício. Além disso, o `SingaporeBars` existente
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:175: completar nem incógnita variável. Executar o passo antigo — "ligar SingaporeBars ao
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:179: 1. Tipar `StorySpec` e `SingaporeBarSpec` como contratos discriminados e criar o
AI_Studio_Lab/pedagogia/PLANO_MESTRE_SAGA.md:182: `SingaporeBars` para separar, comparar, completar e incógnita.
AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md:354: 3. **Primitivas pedagógicas** — NumberLine, TenFrame, DragGroup, InteractiveVertical, ArrayGrid, SingaporeBars, Balança, Relógio, Quadrado100, ShapeCanvas. Cada uma dividida em **lógica** (estado, interação, o que é corr
AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md:669: | Comparação por barras, diferença, Bar Model / CUBOS | N3.04, N3.10, N5.*, N6.04 | SingaporeBars |
AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md:674: | Tally, pictograma, barras de dados | PE.01, PE.02 | SingaporeBars (modo vertical) |
AI_Studio_Lab/codex/PADRAO_OURO.md:86: Repare também que `StorySpec` e `SingaporeBarSpec` são **independentes de
AI_Studio_Lab/codex/PADRAO_OURO.md:106: **Exemplar:** `StoryPanelStage.tsx`, `SingaporeBarsStage.tsx`, `StoryBarsStage.tsx`
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:45: SingaporeBars descreve a matemática.
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:51: A separação é obrigatória. Se `SingaporeBars` carregar personagens e narrativa,
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:80: conhecidos, pergunta, áudio e destaques. `SingaporeBars` representa partes, todo,
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:88: `SingaporeBarSpec` → procedimento puro das quatro estruturas → testes do
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:90: N3.10 → `StoryPanel` → `SingaporeBars` → integrar em `FichaRenderer` e
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:399: `SingaporeBars` existente cobre apenas composição `A + B = total`. O passo "ligar
AI_Studio_Lab/codex/ROTEIRO_DE_CONSTRUCAO_ANDARES.md:400: SingaporeBars ao builder" reduziria as quatro estruturas a uma barra de soma
AI_Studio_Lab/codex/BRIEFING_CODEX.md:164: 3. **`singaporebars`** — confrontar com o caminho vivo `singapore-bars` para não
AI_Studio_Lab/tools/ficha_runtime_map.cjs:68: { primitive: "SingaporeBars", kinds: ["singapore-bars", "ratio-table"], componentFiles: [component("SingaporeBars")], builderKinds: [], rendererKinds: ["singapore-bars"] },
AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:242: **Competência:** N6.03 (porcentagem) · **Primitiva:** `Quadrado100` + `SingaporeBars` · **Faixa:** F4
AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:415: **Competência:** N6.04 (razão e proporcionalidade) · **Primitiva:** `SingaporeBars` · **Faixa:** F4
AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:517: **Competência:** AL.07 (linguagem algébrica e generalização) · **Primitiva:** `SingaporeBars` + `plain` · **Faixa:** F4
AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md:769: **Competência:** PE.04 (estatística e probabilidade por contagem) · **Primitiva:** `SingaporeBars` + `ArrayGrid` · **Faixa:** F4
AI_Studio_Lab/pedagogia/fichas/FICHAS_F1_COMPLETAS.md:1592: **Competência:** PE.01 (pictogramas e tabelas) · **Primitiva:** `SingaporeBars` (modo ícones) · **Faixa:** F1
AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:61: **Competência:** N5.02 (fração: parte-todo, coleção e reta) · **Primitiva:** `SingaporeBars` + `InteractiveNumberLine` · **Faixa:** F3
AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:430: **Competência:** PE.03 (média e probabilidade como fração) · **Primitiva:** `SingaporeBars` · **Faixa:** F3
AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:768: **Competência:** N5.03 (equivalência e comparação de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3
AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md:820: **Competência:** N5.04 (adição e subtração de frações) · **Primitiva:** `SingaporeBars` · **Faixa:** F3
AI_Studio_Lab/pedagogia/fichas/FICHAS_F2_COMPLETAS.md:813: **Competência:** N5.01 (metade, terço, quarto) · **Primitiva:** `ShapeCanvas` (modo partição) + `SingaporeBars` · **Faixa:** F2
```

### `subvis`

```text
curriculum/N3.yaml:23: - "subvis (existente — esconder)"
curriculum/N3.yaml:47: - "subvis"
AI_Studio_Lab/snapshots.json:933: "kind": "subvis",
AI_Studio_Lab/snapshots.json:1714: "kind": "subvis",
AI_Studio_Lab/snapshots.json:1738: "kind": "subvis",
AI_Studio_Lab/snapshots.json:1762: "kind": "subvis",
AI_Studio_Lab/snapshots.json:1786: "kind": "subvis",
AI_Studio_Lab/snapshots.json:1810: "kind": "subvis",
AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md:29: - **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emotic
AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md:39: - **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emotic
AI_Studio_Lab/DIARIO_DE_BORDO_COMPLETO_PARA_CLAUDE.md:60: - **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emotic
.github/workflows/audit-p18-kinds.yml:35: 'sentencebuilder', 'sequence', 'singaporebars', 'subvis',
AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md:325: **Pré-req:** N3.01(b). **Kinds:** subvis (existente — esconder), groups.
AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md:337: **Pré-req:** N3.02, N1.02(e), N1.12. **Kinds:** numberline*, subvis, plain.
AI_Studio_Lab/pedagogia/PRIMITIVAS_SAGA.md:76: | `VisualAddition` | `visual-addition` | `subvis`/variação ainda não entra pelo Composer |
AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md:281: | `sum` / `subvis` | juntar grupos / esconder objetos, animado | N3.01-04 concreto |
AI_Studio_Lab/codex/AUDITORIA_PROFUNDA_COMPLETA.md:280: - **Fato:** há lógica especial de aulas para count, sum, subvis e tens.
AI_Studio_Lab/codex/BRIEFING_CODEX.md:168: 5. `multiple_choice`, `sequence`, `subvis` — candidatos a remoção do tipo se forem
AI_Studio_Lab/tools/ficha_runtime_map.cjs:87: { primitive: "VisualAddition", kinds: ["visual-addition", "subvis"], componentFiles: [component("VisualAddition")], builderKinds: [], rendererKinds: ["visual-addition"] },
src/utils/generators.ts:202: kind: "subvis",
src/utils/generators.ts:356: kind: "subvis",
src/utils/choreographyRegistry.ts:69: subvis: [
src/utils/generators.test.ts:80: if (q.kind === "subvis") {
src/utils/tutorials.test.ts:39: for (const k of ["count", "sum", "subvis", "tens", "grow", "daypart", "emotion"]) {
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:56: "subvis": "Kind aritmético dos geradores legados, anterior às fichas.",
src/curriculum/conformidadeDeFichas.test.ts:159: subvis: ["EmojiRow"],
src/components/GameLoop.tsx:309: else if (q.kind === "subvis") startGuidedSubvis(isAuto);
src/components/GameLoop.tsx:782: const startGuidedSubvis = (isAuto: boolean = true) => {
src/components/gameloop/GameLoopExerciseRenderer.tsx:297: {q.kind === "subvis" && (
```

### `take-apart`

```text
.github/workflows/audit-p18-kinds.yml:36: 'take-apart', 'visual-addition',
AI_Studio_Lab/codex/BRIEFING_CODEX.md:166: 4. `linking-cubes`, `take-apart`, `visual-addition` — embrulhar legado somente se
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:16: - **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
src/utils/generatorsVisual.ts:105: kind: "take-apart",
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:57: "take-apart": "Palco legado (`TakeApart`), desenhado a partir de `question.a/b/n` — mesmo caso do `linking-cubes`.",
src/curriculum/conformidadeDeFichas.test.ts:149: "take-apart": ["TakeApart"],
src/components/FichaRenderer.tsx:130: case 'take-apart':
src/components/gameloop/GameLoopExerciseRenderer.tsx:496: {q.kind === "take-apart" && q.a != null && q.b != null && q.n != null && <TakeApart total={q.n} knownSplit={{a: q.a, b: q.b}} />}
src/components/gameloop/GameLoopExerciseRenderer.tsx:743: {shouldRenderQuestionOptions(q) && q.options && (<div className={`gap-3.5 ${(q.kind === "take-apart" || q.kind === "sequence" || q.options.some(o => !!o.groups)) ? "flex flex-col" : "grid grid-cols-2"}`}>
```

### `visual-addition`

```text
.github/workflows/audit-p18-kinds.yml:36: 'take-apart', 'visual-addition',
AI_Studio_Lab/pedagogia/PRIMITIVAS_SAGA.md:76: | `VisualAddition` | `visual-addition` | `subvis`/variação ainda não entra pelo Composer |
AI_Studio_Lab/codex/BRIEFING_CODEX.md:166: 4. `linking-cubes`, `take-apart`, `visual-addition` — embrulhar legado somente se
AI_Studio_Lab/tools/ficha_runtime_map.cjs:87: { primitive: "VisualAddition", kinds: ["visual-addition", "subvis"], componentFiles: [component("VisualAddition")], builderKinds: [], rendererKinds: ["visual-addition"] },
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:16: - **Novos `Kinds` no Curriculum**: Para ligar o Grafo do SAGA com o UI, adicionamos `visual-addition`, `scattered`, `linking-cubes`, `missing-addend-frame`, `take-apart` e `sequence`.
AI_Studio_Lab/arquitetura/ANALISE_IXL_PEDAGOGICA.md:21: 2. `GameLoop.tsx` (linha 1109+) detecta os novos `kind`s (`visual-addition`, `scattered`, etc) e chama as Primitivas de renderização (`src/components/primitives/`).
src/utils/generatorsVisual.ts:12: kind: "visual-addition",
src/curriculum/schema.ts:4: export type KindType = "tenframe" | "bond" | "numberline" | "vertical" | "draggroup" | "arraygrid" | "singaporebars" | "balanca" | "relogio" | "quadrado100" | "shapecanvas" | "emojirow" | "tens" | "plain" | "subvis" | "v
src/curriculum/kindComBuilder.test.ts:58: "visual-addition": "Palco legado (`VisualAddition`), idem.",
src/curriculum/conformidadeDeFichas.test.ts:147: "visual-addition": ["VisualAddition"],
src/components/FichaRenderer.tsx:124: case 'visual-addition':
src/components/gameloop/GameLoopExerciseRenderer.tsx:489: {q.kind === "visual-addition" && q.a != null && q.b != null && <VisualAddition a={q.a} b={q.b} emojiA={q.uiProps?.emojiA || q.emoji} emojiB={q.uiProps?.emojiB || q.emoji} showNumbers={q.uiProps?.showNumbers !== false} />
```
