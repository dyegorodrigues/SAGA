# Auditoria P21 — fontes de verdade derivadas do runtime

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Modo:** audit-only; nenhum currículo/runtime foi alterado por este inventário.

## 1. Grafo

- YAML: **90** nós, **90** IDs únicos;
- JSON derivado: **90** nós, **90** IDs únicos;
- YAML ausente no JSON: nenhum;
- JSON ausente no YAML: nenhum.

## 2. Cânone Markdown

- blocos Markdown: **5**;
- fichas: **92**;
- competências únicas declaradas pelas fichas: **88/90**;
- nós do grafo sem ficha Markdown identificada: **2** — N1.09, GM.02;
- fichas apontando para ID fora do grafo: nenhuma.

## 3. Runtime autoral TS / Composer

- competências com ficha TS de Jornada: **29**;
- registradas em COMPOSER_FICHAS: **24**;
- canários ativos: **22**;
- registradas e inativas: N4.09, GM.12;
- ativas sem registro: nenhuma;
- fichas TS de Jornada ainda não registradas: AL.05, GM.04, N2.01, N3.11, N4.02;

### Canários ativos

`N3.09`, `N3.10`, `N4.03`, `N4.04`, `N4.07`, `N4.06`, `N4.08`, `N1.07`, `N1.06`, `N1.13`, `N1.10`, `N1.11`, `AL.01`, `GE.01`, `GE.02`, `GM.01`, `N1.01`, `N1.02`, `N1.03`, `N1.04`, `N1.08`, `AL.02`

## 4. Primitivas — mapa runtime

- entradas: **26**;
- executável: **18**;
- renderer-sem-builder: **4**;
- componente-isolado: **3**;
- ausente: **1**;

### Não plenamente executáveis

- `Grupo`: **componente-isolado** (kinds: groups);
- `LinkingCubes`: **renderer-sem-builder** (kinds: linking-cubes);
- `Moedas`: **renderer-sem-builder** (kinds: money);
- `Quadrado100`: **componente-isolado** (kinds: hundred-chart + frac-shade);
- `Regua`: **ausente** (kinds: measure);
- `SingaporeBars`: **renderer-sem-builder** (kinds: singapore-bars + ratio-table);
- `StoryPanel`: **componente-isolado** (kinds: story + scene);
- `VisualAddition`: **renderer-sem-builder** (kinds: visual-addition + subvis);

## 5. Auditor hardcoded — dívida detectada

- `EXPECTED_FICHAS`: **92**;
- `EXPECTED_COMPETENCIES`: **88**;
- grafo atual derivado: **90**;
- o auditor transforma `missingCompetenceFichas` em falha explícita: **não**.

> **P21 confirmado:** o fiscal autoral contém expectativa histórica e/ou não fecha a cobertura do grafo por derivação. Corrigir o fiscal em lote separado depois deste inventário.

## 6. Classificação inicial do backlog

### Confirmado pelo runtime

- registradas mas inativas: N4.09, GM.12;
- primitivas incompletas: Grupo, LinkingCubes, Moedas, Quadrado100, Regua, SingaporeBars, StoryPanel, VisualAddition;
- cobertura Markdown ausente no grafo: N1.09, GM.02;

### Precisa de auditoria semântica, não só contagem

- dívida antiga de coreografia;
- relação JD4 ↔ N1.07;
- adequação de N4.09/GM.12 antes de promoção;
- qualidade longitudinal dos motores adaptativos;
- mega auditoria pedagógica por grafo/ficha/primitiva/trajetória.

## 7. Regra pós-P21

Contagens futuras devem ser derivadas das fontes reais. Constantes históricas podem existir como assert apenas quando o número é uma regra de produto deliberada; nesse caso precisam falhar quando o grafo muda, e não mascarar a mudança.

## 8. Estado dos fiscais existentes

### auditar — exit 0

```text
> matemagica@0.0.0 auditar
> node AI_Studio_Lab/tools/catalog_auditor.cjs

SAGA — AUDITORIA CURRICULAR READ-ONLY
Executado em: 2026-08-08T19:23:03.110Z
Fonte agregada: curriculum/grafo_saga.yaml

[FONTES]
- YAML agregado: 90 nós
- Markdown humano: 90 competências
- JSON derivado: 90 nós
- TypeScript runtime: 90 nós
- YAMLs por strand: 90 nós (11 arquivos)

- Trilhas de fluência: 13
- Fichas autorais documentadas: 92 (5 blocos)

[COBERTURA EXECUTÁVEL]
- Nós com gerador explícito: 42/90
- Nós no fallback "Em construção": 48/90
- Fichas de Jornada no disco: 29/90
- Fichas de Jornada registradas em AllFichas: 19/90
- Fichas de Jornada com rt_alvo no nível 5: 29/29
- Fichas de Dojo no disco/registradas: 4/4
- Fichas no disco fora de AllFichas: 10
- Geradores exportados sem uso no mapa: 0
- Mapeamentos com deriva de nome: 0

[FALLBACKS]
N1.13, GM.01, GM.12, N4.03, N4.04, N4.06, N4.07, N5.01, AL.04, AL.05, GE.03, GE.04, GE.05, GM.05, GM.06, GM.07, PE.02, N4.08, N4.09, N4.10, N4.11, N4.12, N5.02, N5.03, N5.04, N6.01, N6.02, AL.06, GE.06, GE.07, GE.08, GM.08, GM.09, PE.03, N6.03, N6.04, N5.05, N7.01, N7.02, AL.07, AL.08, GE.09, GE.10, PE.04, N2.06, N2.07, GM.10, GM.11

[FICHAS DE JORNADA]
AL.01, AL.02, AL.05, GE.01, GE.02, GM.01, GM.04, GM.12, N1.01, N1.02, N1.03, N1.04, N1.06, N1.07, N1.08, N1.10, N1.11, N1.13, N2.01, N3.09, N3.10, N3.11, N4.02, N4.03, N4.04, N4.06, N4.07, N4.08, N4.09

[FICHAS FORA DE AllFichas]
GE.01, GE.02, GM.01, N1.11, N4.03, N4.04, N4.06, N4.07, N4.08, N4.09

[GERADORES ÓRFÃOS]
Nenhum

[DERIVA DE NOMENCLATURA]
Nenhuma

[RESULTADO] Invariantes canônicos aprovados; lacunas de cobertura permanecem explicitadas acima.
```

### fichas-auditar — exit 0

```text
> matemagica@0.0.0 fichas:auditar
> node AI_Studio_Lab/tools/ficha_catalog_auditor.cjs

SAGA — CATÁLOGO AUTORAL DE FICHAS (READ-ONLY)
Blocos: 5
Fichas: 92
Competências cobertas: 88/90
Primitivas declaradas: 26
Primitivas sem componente homônimo: 2

[COBERTURA POR BLOCO]
- FICHAS_F0_COMPLETAS.md: 21 fichas
- FICHAS_F1_COMPLETAS.md: 18 fichas
- FICHAS_F2_COMPLETAS.md: 22 fichas
- FICHAS_F3_COMPLETAS.md: 19 fichas
- FICHAS_F4_COMPLETAS.md: 12 fichas

[COMPETÊNCIAS SEM FICHA AUTORAL]
N1.09, GM.02

[PRIMITIVAS SEM COMPONENTE HOMÔNIMO]
- Moedas: 2 ficha(s) — F53, F54
- Regua: 1 ficha(s) — F61

[MAPA FICHA → RUNTIME]
- ArrayGrid: executável | kinds=array+area-model | builder=arraygrid | renderer=array | fichas=15
- AudioChoice: executável | kinds=audiochoice | builder=audiochoice | renderer=audiochoice | fichas=2
- Balanca: executável | kinds=balanca+medidas | builder=balanca+medidas | renderer=balanca+medidas | fichas=6
- Recipientes: executável | kinds=containers+medidas | builder=medidas | renderer=medidas | fichas=1
- DragGroup: executável | kinds=draggroup | builder=draggroup | renderer=draggroup | fichas=5
- EmojiRow: executável | kinds=emojirow | builder=emojirow | renderer=emojirow | fichas=7
- Grupo: componente-isolado | kinds=groups | builder=— | renderer=— | fichas=4
- InteractiveNumberLine: executável | kinds=numberline | builder=numberline | renderer=numberline | fichas=6
- InteractiveVertical: executável | kinds=vertical | builder=vertical | renderer=vertical | fichas=6
- LinkingCubes: renderer-sem-builder | kinds=linking-cubes | builder=— | renderer=linking-cubes | fichas=1
- MaterialDourado: executável | kinds=tens | builder=tens | renderer=tens | fichas=6
- Moedas: renderer-sem-builder | kinds=money | builder=— | renderer=money | fichas=2
- NumberBond: executável | kinds=bond | builder=bond | renderer=bond | fichas=2
- NumberLine: executável | kinds=numberline | builder=numberline | renderer=numberline | fichas=10
- Quadrado100: componente-isolado | kinds=hundred-chart+frac-shade | builder=— | renderer=— | fichas=10
- Regua: ausente | kinds=measure | builder=— | renderer=— | fichas=1
- Relogio: executável | kinds=relogio | builder=relogio | renderer=relogio | fichas=2
- ScatteredItems: executável | kinds=scattered | builder=scattered | renderer=scattered | fichas=1
- ShapeCanvas: executável | kinds=shapes+symmetry+geo-transform | builder=shapecanvas | renderer=shapecanvas | fichas=11
- SingaporeBars: renderer-sem-builder | kinds=singapore-bars+ratio-table | builder=— | renderer=singapore-bars | fichas=11
- StoryPanel: componente-isolado | kinds=story+scene | builder=— | renderer=— | fichas=1
- TenFrame: executável | kinds=tenframe | builder=tenframe | renderer=tenframe | fichas=8
- TouchCount: executável | kinds=touchcount | builder=touchcount | renderer=touchcount | fichas=2
- TouchPlace: executável | kinds=touchplace | builder=touchplace | renderer=touchplace | fichas=1
- VisualAddition: renderer-sem-builder | kinds=visual-addition+subvis | builder=— | renderer=visual-addition | fichas=1
- plain: executável | kinds=plain | builder=plain | renderer=plain | fichas=3

[COBERTURA DO MAPA RUNTIME]
- executável: 18
- renderer-sem-builder: 4
- componente-isolado: 3
- ausente: 1

[RESULTADO] 92 fichas válidas, nove seções presentes e 88 competências cobertas.
```

### fichas-conferir — exit 0

```text
 F01 + F03	micros sem fonte declarada

[90mstdout[2m | src/curriculum/conformidadeDeFichas.test.ts[2m > [22m[2mconformidade entre as fichas e o que o app serve[2m > [22m[2mimprime o quadro completo
[22m[39m
competência	ficha	como é servida	primitivas da ficha	conformidade
N1.01	F07	padrao-ouro	DragGroup#parear	ok
N1.02	F27	padrao-ouro	TouchCount#rítmico	ok
N1.03	JD1	padrao-ouro	EmojiRow#flash	ok
N1.04	F01+F03	padrao-ouro	TouchCount, EmojiRow, ScatteredItems	ok
N1.05	F06	legado	Grupo	ok
N1.06	F05	padrao-ouro	AudioChoice	ok
N1.07	JD4	padrao-ouro	AudioChoice, NumberLine	ok
N1.08	JD2+F02	padrao-ouro	EmojiRow#flash, skin mão, TenFrame	ok
N1.09	—	legado	SEM FICHA
N1.13	F04	padrao-ouro	TouchPlace	ok
AL.01	F51	padrao-ouro	DragGroup#caixas/laços	ok
AL.02	F52	padrao-ouro	EmojiRow#padrão	ok
GE.01	F47	padrao-ouro	ShapeCanvas	ok
GE.02	F48	padrao-ouro	ShapeCanvas	ok
GM.01	F49	padrao-ouro	Grupo	ok
GM.12	F50	vazio	Balanca, Recipientes	ok
GM.02	—	legado	SEM FICHA
N1.10	JD5	padrao-ouro	TenFrame, EmojiRow	ok
N1.11	JD3+F28	padrao-ouro	TenFrame#flash, TenFrame	ok
N1.12	F19	legado	InteractiveNumberLine	ok
N2.01	F21	legado	MaterialDourado, TenFrame	ok
N2.02	F36	legado	Quadrado100	ok
N2.03	F29	legado	Grupo	ok
N3.01	F13	legado	VisualAddition	ok
N3.02	F15	legado	EmojiRow#riscar	ok
N3.03	F14	legado	LinkingCubes, NumberLine	ok
N3.04	F31	legado	InteractiveNumberLine	ok
N3.05	F16	legado	NumberBond#triângulo	ok
N3.06	F32	legado	ArrayGrid, TenFrame	ok
N3.07	F33	legado	TenFrame	ok
N3.08	F34	legado	TenFrame, NumberLine	ok
N3.09	F35	padrao-ouro	MaterialDourado, InteractiveVertical	ok
N3.10	F20	padrao-ouro	StoryPanel	ok
AL.03	F30	legado	InteractiveNumberLine, Quadrado100	ok
GM.03	F53+F54	legado	Moedas, NumberLine	FALTA Moedas
GM.04	F55	legado	Relogio	ok
PE.01	F56	legado	SingaporeBars#ícones	ok
N2.04	F37	legado	MaterialDourado, Quadrado100	ok
N3.11	F39	legado	InteractiveVertical, MaterialDourado	ok
N3.12	F40	legado	InteractiveVertical, MaterialDourado	ok
N3.13	F41	legado	NumberLine	ok
N4.01	F97	legado	Grupo	ok
N4.02	F98	legado	ArrayGrid	ok
N4.03	F42	padrao-ouro	ArrayGrid, Quadrado100	ok
N4.04	F43	padrao-ouro	ArrayGrid	ok
N4.05	F99	legado	DragGroup	ok
N4.06	F96	padrao-ouro	NumberBond#triângulo multiplicativo	ok
N4.07	F44	padrao-ouro	ArrayGrid, Quadrado100	ok
N5.01	F45	vazio	ShapeCanvas#partição, SingaporeBars	ok
AL.04	F57	vazio	EmojiRow, NumberLine	ok
AL.05	F46	vazio	Balanca	ok
GE.03	F58	vazio	ShapeCanvas	ok
GE.04	F59	vazio	ShapeCanvas#3D	ok
GE.05	F60	vazio	ShapeCanvas#grade	ok
GM.05	F61	vazio	Regua	FALTA Regua
GM.06	F62	vazio	Relogio, NumberLine	ok
GM.07	F63	vazio	ArrayGrid, ShapeCanvas	ok
PE.02	F64	vazio	SingaporeBars#vertical	ok
N2.06	F38	vazio	DragGroup#duplas	ok
N2.05	F65	legado	NumberLine, Quadrado100	ok
N4.08	F67	padrao-ouro	MaterialDourado	ok
N4.09	F68	vazio	ArrayGrid#área	ok
N4.10	F69	vazio	ArrayGrid, InteractiveVertical	ok
N4.11	F70	vazio	ArrayGrid, Quadrado100	ok
N4.12	F71	vazio	InteractiveVertical	ok
N5.02	F72	vazio	SingaporeBars, InteractiveNumberLine	ok
N5.03	F73	vazio	SingaporeBars	ok
N5.04	F74	vazio	SingaporeBars	ok
N6.01	F75	vazio	Quadrado100	ok
N6.02	F76	vazio	InteractiveVertical, Quadrado100	ok
AL.06	F77	vazio	Balanca	ok
GE.06	F78	vazio	ShapeCanvas#ângulo	ok
GE.07	F79	vazio	ShapeCanvas, DragGroup	ok
GE.08	F80	vazio	ShapeCanvas#grade	ok
GM.08	F81	vazio	ArrayGrid	ok
GM.09	F82	vazio	NumberLine, Balanca	ok
PE.03	F83	vazio	SingaporeBars	ok
N2.07	F66	vazio	ArrayGrid	ok
N6.03	F87	vazio	Quadrado100, SingaporeBars	ok
N6.04	F88	vazio	SingaporeBars	ok
N5.05	F86	vazio	ArrayGrid#área	ok
N7.01	F84	vazio	InteractiveNumberLine	ok
N7.02	F85	vazio	InteractiveNumberLine	ok
AL.07	F89	vazio	SingaporeBars	ok
AL.08	F90	vazio	Balanca	ok
GE.09	F91	vazio	ShapeCanvas	ok
GE.10	F92	vazio	ArrayGrid#3D	ok
PE.04	F95	vazio	SingaporeBars, ArrayGrid	ok
GM.10	F93	vazio	NumberLine, Balanca	ok
GM.11	F94	vazio	ArrayGrid#3D	ok

=== RESUMO ===
competências no grafo: 90
  padrao-ouro: 22
  legado: 25
  vazio: 41
  sem ficha: 2

=== PRIMITIVAS QUE A FICHA EXIGE E NÃO EXISTEM ===
  Moedas → bloqueia 1: GM.03
  Regua → bloqueia 1: GM.05

=== FICHA PRONTA, SERVIDA POR LEGADO (25) ===
  N1.05, N1.12, N2.01, N2.02, N2.03, N3.01, N3.02, N3.03, N3.04, N3.05, N3.06, N3.07, N3.08, AL.03, GM.03, GM.04, PE.01, N2.04, N3.11, N3.12, N3.13, N4.01, N4.02, N4.05, N2.05

=== FICHA PRONTA, SEM CONTEÚDO (41) ===
  GM.12, N5.01, AL.04, AL.05, GE.03, GE.04, GE.05, GM.05, GM.06, GM.07, PE.02, N2.06, N4.09, N4.10, N4.11, N4.12, N5.02, N5.03, N5.04, N6.01, N6.02, AL.06, GE.06, GE.07, GE.08, GM.08, GM.09, PE.03, N2.07, N6.03, N6.04, N5.05, N7.01, N7.02, AL.07, AL.08, GE.09, GE.10, PE.04, GM.10, GM.11

 [32m✓[39m src/curriculum/conformidadeDeFichas.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 38[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m9 passed[39m[22m[90m (9)[39m
[2m   Start at [22m 19:23:03
[2m   Duration [22m 1.44s[2m (transform 882ms, setup 134ms, import 1.14s, tests 38ms, environment 0ms)[22m
```

### grafo — exit 0

```text
> matemagica@0.0.0 grafo:check
> node scripts/generate-graph-artifacts.cjs --check

Artefatos do grafo sincronizados com curriculum/grafo_saga.yaml.
```

