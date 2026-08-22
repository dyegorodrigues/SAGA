# CHECKPOINT — Fábrica Curricular W25–W29 fechada

Data de consolidação: 2026-08-15 UTC  
PR: #35 · branch: `codex/fechamento-curricular`

## Escopo

Este checkpoint consolida as ondas fallback-first W25–W29. Não substitui a Coverage Matrix executável nem o `PROMPT_DE_RETOMADA.md`; funciona como recibo humano do bloco e aplica a regra de evidência vigente: nenhum ID de run, SHA, contagem ou delta é registrado sem consulta à fonte correspondente.

## Estado do bloco

| Onda | Competência / ficha | Materialização | Matrix após fechamento | Recibo final consultado |
|---|---|---|---|---|
| W25 | PE.02 / F64 — Jornal da Turma | `JornalTurmaStage`, realização de `SingaporeBars#vertical` | 50 Composer / 15 legado / 25 fallback / 65 servidas / 11 divergências | `650ac6464a209a723d47e734c648f25c9766dc62` · CI `31843453601` + transversal `31843453565`, ambos `success` |
| W26 | GM.08 / F81 — Área | `AreaF81Stage`, reutilizando `ArrayGrid` como unidade quadrada | 51 / 15 / 24 / 66 / 11 | `bb44915264ff55e8f26282e910c9952712ce28f0` · CI `31853166671` + transversal `31853166653`, ambos `success` |
| W27 | AL.06 / F77 — Expressões numéricas | `ExpressaoF77Stage`, com ordem operacional progressiva e resolução R0-A | 52 / 15 / 23 / 67 / 11 | `25b0307291f70cd97a886794efe060a24bf7aa2e` · CI `31857701286` + transversal `31857701285`, ambos `success` |
| W28 | GE.05 / F60 — O Mapa do Tesouro | `MapaTesouroStage`, realizando `ShapeCanvas#grade` | 53 / 15 / 22 / 68 / 11 | `2377aafc1b0ae7f8652c4af1f20197d3904b8f1f` · CI `31858733127` + transversal `31858733049`, ambos `success` |
| W29 | GE.04 / F59 — Sólidos Geométricos | `SolidosGeometricosStage`, realizando `ShapeCanvas#3D` | 54 / 15 / 21 / 69 / 11 | `3a705e28de30e6a785645864957727134c213256` · CI `31864419504` + transversal `31864419499`, ambos `success` |

## W25 — PE.02 / F64

O fechamento final consultado é `650ac6464a209a723d47e734c648f25c9766dc62`. No SHA exato, CI `31843453601` e Certificação transversal `31843453565` terminaram `success`.

A onda consolidou o Jornal da Turma com tabela, barras verticais, comparação, construção e linguagem de probabilidade, mantendo o runtime declarativo e o delta fallback-first observado pela Matrix.

## W26 — GM.08 / F81

O fechamento final consultado é `bb44915264ff55e8f26282e910c9952712ce28f0`. No SHA exato, CI `31853166671` e transversal `31853166653` terminaram `success`.

A F81 preserva a progressão contar unidades quadradas → linhas×colunas → fórmula → separar área de perímetro → compor áreas, com `ArrayGrid` como chão em unidades quadradas.

## W27 — AL.06 / F77

A primeira promoção expôs dívida de observabilidade no runtime map e no contrato executável da Matrix; o fechamento reconciliado é `25b0307291f70cd97a886794efe060a24bf7aa2e`. No SHA exato, CI `31857701286` e transversal `31857701285` terminaram `success`.

A Matrix fechou em **52/15/23/67/11**. A correção não relaxou o gate; tornou explícita a cadeia física real de `expressao-f77`.

## W28 — GE.05 / F60

A materialização inativa foi `e4c9349`; a promoção atômica final consultada é `2377aafc1b0ae7f8652c4af1f20197d3904b8f1f`, com CI `31858733127` e transversal `31858733049` em `success`.

### Correção de evidência da regression-first

O SHA regression-first é `e3d41ac72a6a474253e73b4756dabdbb5099201f`. O CI `31858118039` terminou **cancelled**, não `failure`; a transversal `31858118099` terminou `success`. Portanto, este checkpoint não descreve esse CI como “vermelho pelo motivo correto”. O fechamento posterior permanece certificado pelos portões inativo e promovido.

## W29 — GE.04 / F59

### Regression-first

SHA `52bdb4e249b5d9a9f9535cda46f244ccc1dc52c3`.

- workflow CI `31863719586`: terminou **`cancelled` por concorrência**;
- dentro dele, o job `Gates do SAGA` `94961316286` terminou `failure`;
- o log desse job mostra a falha desenhada antes do cancelamento: os 2 testes novos de `solidosGeometricosW29.test.ts` falharam porque `GE.04` ainda não estava registrada no Composer, enquanto **213 arquivos / 3.016 testes anteriores passaram**.

A prova regression-first foi, portanto, observada no job/log antes da materialização, sem reclassificar o status final do workflow.

### Materialização inativa

SHA `9bec4f26a11e26c4489c95fff3523d444ab1f3f6`.

Entraram juntos, sem ativar o canário default:

- ficha `GE.04`;
- contrato `solidosGeometricosContract`;
- `SolidosGeometricosStage`;
- registro no Composer;
- renderer;
- mapa runtime `ShapeCanvas#3D`.

Portão remoto do mesmo SHA:

- CI `31864008893`: `success`;
- transversal `31864008795`: `success`.

### Promoção atômica e Matrix observada

SHA `3a705e28de30e6a785645864957727134c213256`.

Canário, `W29-GE.04` no ledger e contrato executável da Matrix entraram no mesmo SHA. O gate observou:

- **54 Composer**;
- **15 legado**;
- **21 fallback**;
- **69 servidas**;
- **11 divergências**;
- **214 arquivos / 3.033 testes**, todos verdes.

Recibos do SHA promovido:

- CI `31864419504`: `success`;
- transversal `31864419499`: `success`.

A F59 preserva nomeação de cubo/esfera/cilindro/cone/pirâmide, experimento de rampa, teste de empilhamento, ponte entre face do sólido e figura plana, contagem de faces/vértices/arestas, alvo mínimo de 48px, alternativa por toque, domínio 3/3 em 2 sessões e diagnósticos canônicos.

## Auditoria histórica incorporada

A correção de evidência do bloco anterior permanece vinculante:

- W20 final `74c6f0eba896ec884a1d88542c8790d679b0e2cb`: CI `31805123752` = `failure`; **nenhum run transversal localizado para esse SHA**. Recibo final não plenamente verificado.
- W21 final `35cd96b27f9621d9882dfdd83a1f7442142ebb92`: CI `31814487722` + transversal `31814487733`, ambos `success`; execução posterior CI `31819865662` = `cancelled` com transversal `31819865551` = `success`.

Nenhum ID 404 anteriormente citado deve reaparecer como prova.

## Invariantes confirmados pelo bloco

1. Regression-first precisa de evidência observada; `cancelled` nunca é rebatizado como `failure`. Quando o workflow termina cancelado mas um job já falhou, registrar separadamente o status do workflow e a evidência do job/log.
2. Materialização fica inativa até CI + transversal do mesmo SHA ficarem verdes.
3. Canário, ledger e Matrix são declarativos; promoção e ledger caminham no mesmo SHA.
4. A Matrix observa o delta real; baseline não é usado para mascarar comportamento inesperado.
5. Runtime map descreve cadeia física comprovada e não inventa alias para fechar divergência.
6. Seleção fallback-first conta apenas filhos que passam a ter **todos** os prereqs servidos.
7. IDs de run, SHAs, contagens e deltas só entram em checkpoint depois de consulta direta.

## Continuidade pós-W29

Restam **21 fallbacks**. A promoção de `GE.04` tornou `GE.10` elegível, porém com ganho imediato 0.

O recálculo pós-W29 encontrou ganho 1 em:

- `N2.06` → `N2.07`;
- `PE.03` → `PE.04`;
- `GM.09` → `GM.11`.

Pela ordem causal executável da Matrix/DAG, a próxima onda é **W30 `N2.06`**, sujeita à reancoragem e novo recálculo se o remoto derivar.

O estado vivo deve ser retomado por:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `src/curriculum/coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- workflows do SHA exato do HEAD.
