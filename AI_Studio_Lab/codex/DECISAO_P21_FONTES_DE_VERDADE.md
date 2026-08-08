# Decisão P21 — fontes de verdade e backlog derivado

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Baseline histórico:** `AUDITORIA_P21_FONTES_DE_VERDADE.md`

## Estado — P21 FECHADA

As três etapas da P21 estão concluídas:

- **P21.A — inventário read-only:** run `31274280464` = **success**;
- **P21.1 — registries, cobertura e proveniência:** run `31275660948` = **success**;
- **P21.2 — mapa autoral→runtime:** run `31276118716` = **success**.

Bancada final P21.2 removida no próprio run: `e7206a5afe6c002c1daf4fe8ff86e822f09c0e8b`.

Guardrails preservados:

- `main` não foi alterada;
- PR #29 permaneceu draft/no-merge;
- Creature Engine não foi tocado;
- nenhuma ficha foi promovida por tabela;
- nenhuma lacuna de primitiva foi implementada só para deixar auditor verde;
- decisões pedagógicas de P22 não foram antecipadas.

A próxima execução é **P22 — audit-first**.

## 1. Fontes canônicas e proveniência após P21.1

### Grafo

- 90 nós no YAML;
- 90 nós no JSON;
- 90 nós no TypeScript;
- zero divergência nos artefatos derivados.

### Cânone Markdown

- 92 fichas em 5 blocos;
- 88 competências únicas cobertas em 90;
- lacunas canônicas temporárias explícitas: **N1.09 e GM.02**.

O auditor deriva o universo do grafo. Nova competência sem ficha e sem exceção explícita quebra o fiscal; exceção stale ou apontando para nó inexistente também quebra.

### Jornada TS / catálogos / Composer

- 29 fichas TS de Jornada no disco;
- `JOURNEY_FICHAS`: **29/29**;
- Jornada em `AllFichas`: **29/29**;
- Dojo no disco/registrado: **4/4**;
- fichas do disco fora de `AllFichas`: **0**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- registradas e inativas: **N4.09, GM.12**;
- TS ainda fora do registro Composer: **AL.05, GM.04, N2.01, N3.11, N4.02**.

Estar no catálogo administrativo não ativa produção. Estar fora do Composer não implica bug nem autoriza promoção automática.

### Proveniência executável

- gerador legado explícito: **42/90**;
- Composer registrado: **24/90**;
- Composer ativo: **22/90**;
- registrado/inativo: **2/90 — N4.09, GM.12**;
- servido sem placeholder (`legado ∪ Composer ativo`): **49/90**;
- fallback real sem conteúdo servido: **41/90**.

Fallback real = **sem gerador legado explícito && sem Composer ativo**. Ficha apenas registrada, mas inativa, não conta como conteúdo servido.

## 2. Decisões P21.1 — realizadas

### `JOURNEY_FICHAS` / `AllFichas`

- sincronizados com as 29 fichas TS de Jornada;
- `src/curriculum/fichas/journeyRegistry.test.ts` prova disco↔registry dinamicamente;
- duplicação, omissão ou entrada sem arquivo correspondente quebra o gate.

### Cobertura autoral

- denominador deriva do grafo;
- N1.09 e GM.02 são as duas únicas exceções temporárias explícitas/justificadas;
- nova lacuna silenciosa, exceção stale ou exceção inválida quebram o fiscal.

### Proveniência

`catalog_auditor.cjs` distingue legado, Composer registrado, Composer ativo e fallback real. Canário ativo sem ficha registrada, ID fora do grafo ou duplicação em registry quebram o auditor.

### Comentários N1.10/N1.11

Atualizados para o estado pós-P17 sem alterar runtime.

## 3. P21.2 — metodologia aplicada

A P21.2 não assumiu que `FICHA_RUNTIME_MAP` era verdade. Foram usados dois inventários temporários e auditoria direta dos arquivos para cruzar:

1. ficha autoral Markdown;
2. competência/fonte da ficha TS;
3. `primitiva`/`kinds` efetivamente usados;
4. case real em `src/curriculum/Composer.ts`;
5. normalização do `kind` final;
6. dispatch em `FichaRenderer` / `GameLoopExerciseRenderer`;
7. Stage/componente realmente entregue.

Isso revelou falsos negativos e especializações autorais que o mapa antigo não representava.

## 4. Aliases/substituições comprovados — decisão P21.2

### `DragGroup`

O nome autoral não corresponde sempre ao componente homônimo:

- contrato direto legado: `draggroup`;
- F07/N1.01: `pareamento` → `PareamentoStage`;
- F51/AL.01: `classificacao` → `ClassificacaoStage`.

Mapa final registra os três caminhos.

### `EmojiRow`

- contrato direto: `emojirow`;
- JD1/N1.03, JD2/N1.08 e F52/AL.02: `fileira` → `EmojiRowStage`;
- JD5/N1.10: `moldura` → `MolduraStage` como palco composto.

### `Grupo`

F49/GM.01 nomeia `Grupo` no cânone, mas o runtime **deliberadamente não liga `Grupo.tsx`**: o componente genérico tinha geometria inadequada para comparação de grandezas. A realização correta é:

`Grupo` autoral → builder `grandeza` → renderer `grandeza` → `GrandezaStage`.

Portanto `Grupo` é **executável via substituição pedagógica explícita**, não “componente-isolado”.

### `StoryPanel`

F20/N3.10 provou cadeia completa:

`StoryPanel` autoral → builder `storypanel` → normalização do Composer para `story-bars` → `StoryBarsStage`.

O mapa antigo marcava falso negativo porque procurava renderer `storypanel`.

### `TenFrame`

A realização depende da ficha/micro:

- `tenframe` direto quando realmente emitido;
- F02/JD3/JD5: `moldura`;
- F28/N1.11: `bond` ou `plain` conforme o micro.

Mapa final registra essas realizações sem fingir que todas usam `TenFrame.tsx` diretamente.

## 5. Estado final do `FICHA_RUNTIME_MAP`

Total: **26 primitivas**.

### Executáveis — 20

O mapa passou de 18 para **20 executáveis** após remover falsos negativos de `Grupo` e `StoryPanel` e explicitar aliases já existentes em outras entradas.

### Renderer sem builder — 4

- `LinkingCubes` — renderer `linking-cubes` existe; nenhum builder Composer comprovado;
- `Moedas` — renderer `money` existe inline no GameLoop; sem builder Composer/contrato autoral comprovado;
- `SingaporeBars` — renderer existe; sem case Composer comprovado para as fichas autorais;
- `VisualAddition` — renderer `visual-addition` existe; sem builder Composer comprovado.

### Componente isolado — 1

- `Quadrado100` — componente existe, mas nenhum builder Composer nem dispatch `hundred-chart`/`frac-shade` foi comprovado. Import sem case não conta como runtime executável.

### Ausente — 1

- `Regua` — sem componente, builder ou renderer; lacuna real para GM.05.

**Decisão:** essas seis entradas permanecem dívida explícita. P21.2 não as implementa automaticamente.

## 6. Contrato permanente P21.2

`src/curriculum/fichaRuntimeMap.test.ts` agora exige:

- as cadeias exatas de `DragGroup`, `EmojiRow`, `Grupo`, `StoryPanel` e `TenFrame`;
- `LinkingCubes`, `Moedas`, `SingaporeBars` e `VisualAddition` como renderer-sem-builder;
- `Quadrado100` como componente-isolado;
- `Regua` como ausente;
- distribuição final **20 / 4 / 1 / 1**.

Assim, nem alias real pode voltar a ser falso negativo nem dívida real pode desaparecer silenciosamente.

## 7. Gate final P21.2

Run `31276118716`: **success**.

Validações:

```text
npm run fichas:auditar
npx vitest run src/curriculum/fichaRuntimeMap.test.ts
npm run auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check e2ee44d1d79d910ebbfcb3411d5f65c836616a47..HEAD
```

Resultados:

- `fichas:auditar`: **92 fichas / 88 de 90 / 26 primitivas**;
- mapa: **20 executáveis / 4 renderer-sem-builder / 1 isolado / 1 ausente**;
- teste focal P21.2: **1/1**;
- `fichas:conferir`: **9/9**;
- suíte completa: **125 arquivos / 2.132 testes**;
- build: aprovado;
- `pr:check`: aprovado;
- diff check: aprovado;
- npm install/audit do gate: **0 vulnerabilities**.

A saída diagnóstica de `fichas:conferir` continua mostrando legado, vazio e divergências de tela conhecidas. Isso é backlog para decisões/migrações posteriores, não falha do gate P21.

## 8. P22 — próxima sequência exata, audit-first

Dívidas curriculares deliberadas já delimitadas:

1. **N1.09** — nó do grafo sem ficha Markdown;
2. **GM.02** — Tempo cotidiano sem ficha Markdown;
3. **JD4 ↔ N1.07** — reconciliar cânone, catálogo `JARDIM`, runtime e fronteira compreensão↔automaticidade;
4. **N4.09** — ficha registrada no Composer e inativa;
5. **GM.12** — ficha registrada no Composer e inativa por observação deliberada.

Para cada item, antes de editar:

1. provar estado do cânone/grafo;
2. provar TS/runtime/proveniência;
3. provar pré-requisitos e progressão longitudinal;
4. separar Jornada de Jardim/fluência;
5. registrar decisão explícita;
6. só então implementar/ativar com testes e gate.

P22 **não** deve “resolver a tabela” por contagem.

## 9. Depois de P22

Seguir `MAPA_MESTRE_POS_P20.md`:

1. auditoria dos motores adaptativos/meta-algoritmos;
2. correções dos motores;
3. mega auditoria de engenharia pedagógica;
4. auditoria integrada do Dojo;
5. release hardening.

**Regra consolidada da P21: ausência explícita é dívida gerenciável; ausência silenciosa é falha de governança.**
