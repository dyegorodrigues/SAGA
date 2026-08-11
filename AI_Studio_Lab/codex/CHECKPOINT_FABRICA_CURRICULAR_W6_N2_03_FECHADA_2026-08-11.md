# CHECKPOINT — Fábrica Curricular W6 fechada — N2.03 / F29 / comparação simbólica

**Data:** 2026-08-11  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 (`open + draft + unmerged`)  
**Main protegida de referência:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora do escopo e intocado.  
**Thinking Engine runtime:** permanece `DEFERRED` / não autorizado.

> Este checkpoint só é válido quando o CI do **HEAD que o contém** estiver integralmente verde. GitHub remoto é a autoridade; recibos intermediários servem como prova da ordem do workflow, não substituem o CI final do SHA atual.

## 1. Reancoragem e autorização

Antes de editar a W6, o remoto confirmou:

- PR #29 aberto, draft e não mesclado;
- branch `codex/integrar-bloco-f0`;
- HEAD inicial da onda `00a2eebc7c5cb603cf1be51b52adbcf0a5580129`;
- CI #1075 / run `31509113460`: 6/6 verde;
- nenhuma review thread aberta;
- Matrix vigente pré-W6: `30 Composer / 22 legado / 38 fallback / 52 servidas / 17 divergências`;
- main protegida permaneceu em `68fad4c575e28959b2ca4776e9a541d6828b63f3`.

A diretriz operacional vigente para esta onda foi `CODEX_UNICO.md`, emitida em 11/08/2026 após auditoria remota independente.

## 2. Seleção causal W6 — argumento decisivo

A escolha de `N2.03 / F29` não depende apenas do downstream nem de precedentes visuais genéricos.

O DAG executável determina:

```text
N2.01  prereqs: [N1.09, N1.11]     ← Padrão Ouro W3
N2.02  prereqs: [N2.01]            ← legado fiel
N2.03  prereqs: [N2.02, N1.05]     ← N1.05 é Padrão Ouro W2, Grupo-backed
```

O argumento forte da §6.36 é portanto estrutural: **N1.05/W2 é pré-requisito DIRETO de N2.03 e já ensinou a linguagem concreta `Grupo`.**

A W6 introduz conteúdo novo — comparação simbólica `>`, `<`, `=` — com desenho já aprendido. A continuidade `quantidade → comparação → símbolo` é verificável no DAG, não uma analogia de implementação.

A condição de invalidação da onda **não foi atingida**:

- não foi criado dispatch genérico `groups`;
- a API pública de `Grupo` não mudou;
- F49/GM.01 não foi reescrita;
- learner state não mudou;
- pré-requisitos/topologia do DAG não mudaram;
- não houve regra global nova de renderer para acomodar a ficha.

O contrafactual conservador `N3.04 / F31` não precisou ser acionado.

## 3. Regression-first comprovada

Commit vermelho:

`1eb06191003cd7aded42b4bea913ecafe23868ff` — `test: fixar regressao W6 N2.03 F29`

O CI #1076 / run `31535677965` falhou pelo motivo esperado: `N2.03` ainda não possuía ficha Composer registrada e a porta real de canário recusou sua ativação.

A regressão fixou antes da implementação:

- default ainda legado;
- ativação apenas pela mesma porta real do canário;
- runtime kind especializado local;
- L1 `grupo × grupo`;
- L2 `grupo × numeral`;
- L3 numerais até 20;
- L4 numerais até 100;
- L5 comparação de expressões;
- alternativas exatamente `>`, `<`, `=`;
- igualdade real aparecendo na geração;
- distratores diagnósticos reais;
- evidência de domínio somente no L3+;
- RT sem participar do critério de correção.

Nenhuma expectativa foi afrouxada para copiar a implementação posterior.

## 4. Arquitetura implementada — specialized builder local Grupo-backed

Principais fontes W6:

- `src/curriculum/fichas/jornada/N2.03.ts`;
- `src/curriculum/procedimentos/comparacaoSimbolicaContract.ts`;
- `src/curriculum/procedimentos/comparacaoSimbolicaProcedure.ts`;
- `src/components/primitives/ComparacaoSimbolicaStage.tsx`;
- testes do contract, procedure/stage e regressão W6;
- `sonda/comparacao.html`;
- `sonda/comparacao.tsx`;
- `scripts/sonda-comparacao.mjs`;
- registro especializado em `composerCanary.ts`;
- renderer local em `FichaRenderer.tsx`;
- runtime map explícito em `AI_Studio_Lab/tools/ficha_runtime_map.cjs`.

O builder é proprietário de `N2.03`. Ele reutiliza `Grupo` onde há quantidade concreta e emite `kind: "comparacao-simbolica"` para o palco especializado.

**Não existe novo `case groups` genérico no Composer.**

`src/components/primitives/Grupo.tsx` permaneceu sem alteração nesta W6.

## 5. Contrato pedagógico F29 materializado

A progressão executável ficou:

- **L1:** dois grupos concretos;
- **L2:** um grupo concreto comparado a um numeral;
- **L3:** dois numerais, valores até 20;
- **L4:** dois numerais, valores até 100;
- **L5:** duas expressões, comparadas pelo valor calculado.

A resposta é sempre derivada dos valores dos lados. A metáfora do jacaré não participa do cálculo e não é dependência estrutural.

Andaime visual:

- L1: jacaré animado;
- L2: jacaré;
- L3: jacaré estático;
- L4–L5: sem jacaré.

Assim, a metáfora é retirada antes do domínio avançado em vez de virar mecanismo obrigatório para reconhecer o sinal.

## 6. Misconceptions e Radar — incidente encontrado e corrigido antes da promoção

A implementação inicialmente materializou as tags F29 em um catálogo local. A revisão do boundary revelou que o Radar aceita apenas tags do catálogo canônico `MisconceptionTag`; manter um catálogo paralelo faria distratores aparecerem na UI, mas poderia descartar silenciosamente o diagnóstico longitudinal.

Isso foi corrigido **antes da ativação** no commit:

`d2d1ff846ab390d2f4b710c307781700fe12d1b0` — `fix: canonicalizar misconceptions F29 no Radar`

As tags F29 agora pertencem ao catálogo central:

- `INVERTE_SIMBOLO` → `inverte-simbolo`;
- `IGNORA_DIFERENCA` → `ignora-diferenca`;
- `NAO_COMPARA_SIMBOLO` → `nao-compara-simbolo`.

O teste do contract exige que todo distrator incorreto emitido pela F29 pertença a `Object.values(MisconceptionTag)`.

## 7. Evidência de domínio e processo

Foi adicionada a evidência canônica:

`COMPARACAO_SIMBOLICA_SEM_OBJETOS = "comparacao-simbolica-sem-objetos"`.

Ela só é emitida quando:

- a resposta está correta; e
- o nível é L3 ou superior.

L1/L2 não podem satisfazer essa condição, mesmo com acerto.

O gate P13 também passou a provar que a evidência exigida pela ficha possui emissor real e que resposta errada não a produz.

Além do resultado, `AnswerMeta` conserva evidência de processo para evitar retrofit futuro do Thinking Engine:

- nível;
- ordem dos lados tocados/inspecionados;
- número de revisões de símbolo;
- símbolo escolhido;
- correção da escolha.

Esses dados são observacionais: não substituem mastery, prereqs ou learner state.

## 8. Motor, resposta e acessibilidade

O palco W6:

- usa `Grupo` para os lados concretos;
- oferece exatamente três alvos `>`, `<`, `=`;
- usa alvos grandes para toque;
- possui nomes acessíveis `maior que`, `menor que`, `igual a`;
- registra inspeção dos lados e escolha do símbolo;
- mantém misconception cognitiva separada de classificação motora;
- não usa RT para conceder acerto/domínio;
- passou teste `axe-core` nos cinco níveis.

O `answerPolicy` reconhece `comparacao-simbolica` como palco que responde por conta própria, evitando alternativa duplicada fora do palco.

## 9. Registro INATIVO antes do canário

A implementação foi registrada sem ativação no commit:

`5496658d239f32c0a4519adfb630a9735f4d3515` — `feat: implementar W6 N2.03 sem ativar canario`

A lista `DEFAULT_COMPOSER_CANARY_IDS` permaneceu intocada nessa fase.

Depois foi criado um harness isolado de Chrome real no commit:

`8f9d69ed6c29521cfc47d748fa0e10dae70478b3` — `test: adicionar sonda Chrome real F29 inativa`

A página-laboratório chama `generateRegisteredFichaQuestion("N2.03", level)` diretamente. Isso permite observar a ficha **registrada e inativa** sem rota/backdoor de produto e sem ativar o canário.

Falhas encontradas nessa fase foram corrigidas sem afrouxar gates:

- emissor F29 faltava na sentinela P13;
- runtime-map test ainda congelava a assinatura pré-W6 de `Grupo`;
- favicon da página-laboratório gerava `console.error` 404;
- as misconceptions locais precisavam ser canonicalizadas no Radar.

## 10. Prova inativa — suíte + Chrome real

O HEAD inativo `d2d1ff846ab390d2f4b710c307781700fe12d1b0` foi submetido ao CI #1080 / run `31538070477` antes de qualquer promoção.

Nesse run:

- Gates do SAGA passaram;
- suíte passou;
- TypeScript passou;
- catálogo/fichas/conformidade/grafo passaram;
- job Sonda real Sensei passou;
- F19 passou;
- F61 passou;
- **F29 registrada e inativa passou a sonda Chrome real**.

A sonda F29 cobre 15 cenários:

- 320 / 390 / 900 px;
- L1–L5;
- overflow;
- representação esperada por nível;
- três alvos de símbolo e dimensões mínimas;
- presença/retirada do andaime;
- resposta correta;
- ausência de misconception no acerto;
- evidência somente no L3+;
- `pageerror`/`console.error`;
- screenshot por cenário + `report.json`.

Essa prova precede materialmente a ativação.

## 11. Promoção do canário

Somente depois da prova inativa, `N2.03` entrou em `DEFAULT_COMPOSER_CANARY_IDS`:

`a25b2bc2a9c1281c395aa68d3dbb45f1080307e0` — `feat: promover canario W6 N2.03 F29`

O contrato de canários passou a enumerar `N2.03`, usando a mesma porta real de produção e o mesmo specialized builder.

Rollback continua disponível por remoção/`rollbackComposerCanary("N2.03")`, retornando ao gerador legado.

## 12. Matrix observou antes do ledger

No CI #1081 / run `31538295485`, a Coverage Matrix foi deliberadamente deixada sem ledger após a promoção.

O gate ficou vermelho mostrando o delta **observado**, não presumido:

- Composer: 30 → **31**;
- legado: 22 → **21**;
- fallback: **38**;
- servidas: **52**;
- divergências ficha↔screen: 17 → **16**;
- swaps: **12**;
- estreias: **44**.

O vermelho ocorreu porque o baseline derivado ainda esperava W1–W5. Isso é a prova de que a Matrix viu a fonte mudar antes de o ledger ser atualizado.

## 13. Ledger W6

Depois da observação entrou a migração:

```text
W6-N2.03
competence: N2.03
delta: { composer: +1, legacy: -1, divergences: -1 }
```

Commit do ledger:

`2ccca97207c77716689b8d4af3f077dba51fab5b` — `docs: registrar ledger W6 N2.03`

O próprio cálculo da Matrix passou a imprimir `SAGA — COVERAGE MATRIX: OK` com:

- **31 Composer**;
- **21 legado**;
- **38 fallback**;
- **52 servidas**;
- **16 divergências**;
- **12 swaps**;
- **44 estreias**;
- missing primitives: **`Moedas` apenas**.

O primeiro run do ledger ainda ficou vermelho porque `coverageMatrix.test.ts` congelava explicitamente a lista exata W1–W5. O teste foi então atualizado para reconhecer a sexta migração e o baseline derivado W6, sem alterar o snapshot fechado P21.1 nem esconder qualquer divergência observacional.

Commit dessa sentinela:

`03cae9430920f7c199d5a4f64e6a085c80b1f3e5` — `test: registrar migração W6 na Matrix`

## 14. Coverage Matrix vigente após W6

Estado esperado/observado a ser confirmado pelo CI integral do HEAD deste checkpoint:

- 90 competências;
- 94 fichas autorais;
- **31 Composer**;
- **21 legado**;
- **38 fallback**;
- **52 servidas**;
- **16 divergências ficha↔screen**;
- **12 swaps**;
- **44 estreias**;
- missing primitives: **`Moedas` apenas**.

A W6 não altera `served` porque substitui um legado real por Composer real; não estreia uma competência antes em fallback.

A W6 também não cria nova ferramenta visual: `Grupo` já existia e já era linguagem aprendida diretamente em N1.05/W2.

## 15. Invariant Impact Review W6

- learner state permanece autoridade de mastery/unlock/prescrição;
- DAG IDs e topologia permaneceram intactos;
- prereqs de N2.03 continuam `N2.02 + N1.05`;
- `Grupo` não ganhou segunda API nem semântica global;
- F49/GM.01 permaneceu isolada da nova ficha;
- Composer continua com specialized builder local, sem `groups` genérico;
- fallback/legado continuam distinguíveis por proveniência;
- RT permanece silencioso/observacional;
- misconceptions passam pelo catálogo canônico aceito pelo Radar;
- evidência de processo não concede mastery por conta própria;
- nenhum LLM/serviço externo virou autoridade runtime;
- nenhuma mudança foi feita em XP lifetime, moedas, Atlas, insígnias ou Creature Engine;
- rollback do canário permanece possível.

## 16. Scope guard e merge

Nesta W6:

- main não foi editada;
- nenhuma branch auxiliar foi criada;
- PR #29 não foi marcado ready;
- PR #29 não foi mesclado;
- não houve rebase na main;
- Creature Engine não foi migrado para `src/`;
- Thinking Engine runtime não foi implementado;
- snapshot histórico P21.1 não foi reescrito;
- nenhum gate foi pulado/afrouxado para obter verde.

A decisão de merge permanece exclusivamente do autor depois do fechamento comprovado desta W6.

## 17. Decisões ainda contestáveis

Três escolhas locais merecem refutação explícita antes de virarem precedente para outras fichas:

1. `rt_alvo` de L5 foi materializado em **8 s**; o princípio "RT silencioso" é canônico, mas esse valor específico merece validação pedagógica/empírica.
2. L2 usa a faixa gerativa até **20** para a ponte `grupo × numeral`; o contrato da onda fixa a representação, não explicitou no handoff um teto próprio de L2.
3. L5 usa expressões aditivas simples para garantir comparação de valores; pode ser desejável ampliar a família de expressões em onda futura, desde que isso não transforme F29 em treino de operação.

Esses pontos não autorizam refactor ou expansão nesta W6; são itens para contestação.

## 18. Próxima onda

W7 candidata: `N2.02` — não implementada nesta onda.

---

**Critério de validade deste checkpoint:** CI integralmente verde do HEAD remoto que contém este arquivo + PR #29 ainda `open/draft/unmerged` + Matrix vigente `31/21/38/52/16` coerente com o ledger W6. Ao satisfazer esse critério, PARAR e devolver a decisão de merge ao autor.
