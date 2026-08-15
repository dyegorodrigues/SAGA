# CHECKPOINT — Fábrica Curricular W20–W24 fechada

Data de consolidação: 2026-08-15 UTC  
PR: #35 · branch: `codex/fechamento-curricular`

## Escopo

Este checkpoint consolida as ondas fallback-first W20–W24. Ele não substitui a Coverage Matrix executável nem o `PROMPT_DE_RETOMADA.md`; serve como recibo humano do bloco e registra, inclusive, lacunas históricas de certificação sem reescrever o passado.

## Estado do bloco

| Onda | Competência / ficha | Materialização | Matrix após fechamento | Portão inativo conhecido |
|---|---|---|---|---|
| W20 | GM.07 / F63 — Perímetro | `PerimetroStage`, compondo `ArrayGrid` + `ShapeCanvas` para separar volta de área | 45 Composer / 15 legado / 30 fallback / 60 servidas / 11 divergências | `f68b8bb6` · CI `31803991249` + transversal `31803991246`, ambos verdes |
| W21 | AL.05 / F46 — Igualdade como equilíbrio | `IgualdadeEquilibrioStage`, reutilizando `Balanca`; correção real de overflow em 320 px sem relaxar a sonda | 46 / 15 / 29 / 61 / 11 | `72cf0375` · CI `31808928178` + transversal `31808928379`, ambos verdes |
| W22 | N6.03 / F87 — Porcentagem | palco composto `Quadrado100` + `SingaporeBars`, com resolução R0-A | 47 / 15 / 28 / 62 / 11 | `eed2b8ab` · CI `31820722322` + transversal `31820722277`, ambos verdes |
| W23 | GE.06 / F78 — Ângulos e retas | `AngulosStage`, realização explícita de `ShapeCanvas#ângulo` | 48 / 15 / 27 / 63 / 11 | `e9ea0ede` · CI `31823679254` + transversal `31823679255`, ambos verdes |
| W24 | N7.01 / F84 — Negativos e reta completa | `RetaCompletaStage`, extensão da `InteractiveNumberLine` ao domínio dos inteiros | 49 / 15 / 26 / 64 / 11 | `1f912c8f` · CI `31825522496` + transversal `31825522510`, ambos verdes |

## Recibos finais auditados

### W20 — recibo final não plenamente verificado

O commit final registrado é `74c6f0eba896ec884a1d88542c8790d679b0e2cb`.
No SHA exato, a consulta histórica encontrou:

- CI `31809338980`: **failure**;
- Certificação transversal `31809338978`: **success**.

Portanto, o recibo final da W20 **não possui um par verde completo no SHA exato**. Isso não apaga o portão inativo verde `f68b8bb6`, nem a presença posterior do código em heads certificados, mas a lacuna histórica deve permanecer registrada como tal.

### W21 — recibo final verificado

O commit final registrado é `35cd96b27f9621d9882dfdd83a1f7442142ebb92`.
No SHA exato existe um par histórico verde:

- CI `31811526114`: **success**;
- Certificação transversal `31811526141`: **success**.

Há tentativas posteriores no mesmo SHA que aparecem canceladas (`31811574779` e `31811574813`). Elas não invalidam o par verde anterior; logo, o recibo final da W21 é **verificado**.

### W22–W24

- W22: promoção/ledger declarativos após o portão verde `eed2b8ab`.
- W23: promoção `f865f89a` após o portão verde `e9ea0ede`.
- W24: recibo final `083632d1cf24826cb94c3bc3450245a76333b60d`; no SHA exato, CI `31840606795` e transversal `31840606811` passaram. A correção deriva da própria ficha o domínio numérico permitido e preserva guardas específicas da F84.

## Invariantes confirmados pelo bloco

1. Promoção não substitui portão inativo: primeiro materializa-se sem canário, depois o mesmo SHA precisa de CI + transversal verdes.
2. Canário, ledger e expectativa executável da Matrix são declarativos; nenhum deles depende de mutação por efeito colateral de import.
3. A partir da W22, promoção e ledger caminham atomicamente no mesmo SHA.
4. O delta de fallback-first só é registrado depois de observado pela Matrix; divergência não é reduzida por suposição.
5. O critério de escolha considera quantos fallbacks passam a ter **todos** os pré-requisitos servidos, e não apenas filhos diretos em fallback.
6. Uma falha ou cancelamento histórico é registrado como evidência, não convertido retroativamente em sucesso.

## Continuidade

O bloco W20–W24 está consolidado documentalmente. O estado vivo posterior deve ser lido exclusivamente de:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- workflows do SHA exato do HEAD.
