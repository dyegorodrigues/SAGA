# CHECKPOINT — W42 N4.11/F70 FECHADA — 2026-08-17

## Estado remoto vinculante

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858` — intocada
- Recibo técnico final W42: `f24c875aa4a0261bb98fc3c25f8bcec5cddcb84e`
- CI final: `32035785217` — `completed/success`
- Certificação transversal final: `32035785210` — `completed/success`

## Coverage Matrix observada

- 90 competências / 94 fichas autorais
- **67 Composer**
- **15 legado**
- **8 fallback**
- **82 servidas**
- **11 divergências**
- **67 canários ativos**
- `modeSwaps=12`
- `toolIntroductions=44`

O delta observado pela Matrix foi o nominal da promoção de `N4.11`: `+1 Composer / -1 fallback / +1 servida`, sem delta de divergência. Os números foram observados pelo executável; não foram fabricados por baseline.

## Cadeia técnica W42

1. **Regression-first:** `36b6ffe1c361fad509a30ce0783ea44bfc18073d`
   - Certificação transversal `32003601880` = `completed/success`;
   - CI `32003601902` = `completed/failure` nominal;
   - único vermelho: `src/curriculum/primosDivisoresW42.test.ts`, pela ausência real de `N4.11/F70` em `JOURNEY_FICHAS`.
2. **Primeira materialização inativa:** `b8c5e7e17b3e83da5c67ce32f428d8db1e7f0233`.
   - trouxe ficha, contrato, palco, renderer, Radar, runtime map, extensão conservadora do Quadrado100 e testes físicos;
   - acusou apenas incompatibilidades de tipagem/vocabulário (`hundred-chart` vs `quadrado100` e `AnswerMeta.source` restrito), sem mudança do contrato pedagógico.
3. **Materialização inativa final:** `6129c5c8cb94ff83735a9c0ea5d2bbb35f8cff27`
   - CI `32034443674` = `completed/success`;
   - Certificação transversal `32034443648` = `completed/success`;
   - N4.11 permaneceu fora do canário durante esse portão.
4. **Promoção atômica final:** `f24c875aa4a0261bb98fc3c25f8bcec5cddcb84e`
   - no mesmo SHA: canário `N4.11` + ledger nominal `W42-N4.11` + contrato/baseline Matrix;
   - CI `32035785217` + transversal `32035785210`, ambos `completed/success`.

## Auditoria pedagógica e física F70

Contrato canônico preservado:

- competência `N4.11`;
- prereqs `N4.07 + N4.10`;
- primitivas `ArrayGrid + Quadrado100`;
- cinco níveis: múltiplos no quadro → divisores por retângulos → distinguir divisor/múltiplo → identificar primos → Crivo de Eratóstenes;
- relação causal explícita: divisor cabe sem sobra; múltiplo é destino de repetição/salto;
- `1` é divisor universal positivo e não é primo;
- primo não é sinônimo de ímpar;
- Crivo ocorre nas próprias casas do Quadrado100;
- domínio `3/3` em `2` sessões incluindo identificação de primos;
- resolução declarativa ensina o mecanismo, não apenas a regra verbal.

Diagnósticos efetivos no Radar:

- `inverte-divisor-multiplo`;
- `esquece-um`;
- `primo-errado`.

Testes físicos comprovam que:

- testar divisores no ArrayGrid é exploração e não compra resposta;
- o resto/sobra permanece observável;
- o Crivo risca múltiplos compostos e preserva os primos-base;
- toque motor não vira misconception;
- alvo de toque é generoso;
- a regra do `1` aparece sem revelar antecipadamente a classificação do número-alvo.

## Regressões preservadas

No SHA final W42 passaram:

- Gates do SAGA: catálogo, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual;
- Sonda real Sensei;
- sondas reais F19, F61, F29, F36/Quadrado100, F13, F15, F14, F30 e F97;
- guarda de binários;
- higiene do diff;
- nove sondas transversais, incluindo 320/900px e oito sementes em 390px.

A passagem de F36 é particularmente relevante: a extensão `crossedNumbers` do Quadrado100 usada por F70 preservou compatibilidade retroativa.

## Fila residual pós-W42

Restam **8 fallbacks**:

`AL.08, GM.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

A autoridade de ordenação continua sendo a Matrix/DAG executável: profundidade causal crescente, depois impacto downstream e ID. A candidata confirmada para a próxima onda é:

- **W43 — `N4.12 / F71 — Dividir por Dois Dígitos`**
- prereqs: `N4.10 + N2.04`;
- primitiva: `InteractiveVertical`;
- fundamento: estimar o quociente, testar por multiplicação e ajustar;
- domínio: `4/4` em `3` sessões, incluindo ajuste da primeira estimativa;
- exposição motora alta: alternativa por toque, snap generoso, alvo ≥80px e erro motor fora do Radar.

## Governança pós-90/90

Issues `#47` e `#48` permanecem registradas e **não autorizam interromper W43–W50**. Só viram portas obrigatórias quando a Matrix chegar a `fallback=0 / 90 servidas` e a última onda estiver certificada.

## Restrições preservadas

- não tocar/mergear `main`;
- PR #35 permanece draft + unmerged;
- não marcar ready;
- não habilitar auto-merge;
- não tocar Creature Engine/Tamagotchi;
- não enfraquecer testes, Matrix, sondas ou auditores;
- não mascarar deriva com baseline;
- não misturar recibos de SHAs diferentes;
- cânone compartilhado permanece aditivo.
