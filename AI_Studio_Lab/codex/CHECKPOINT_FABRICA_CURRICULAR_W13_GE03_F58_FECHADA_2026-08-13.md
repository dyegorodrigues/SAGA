# Checkpoint — W13 `GE.03 / F58` fechada

**Data:** 13/08/2026
**Branch:** `codex/fechamento-curricular` · **PR:** #35 (open, draft, unmerged)
**Competência:** `GE.03 — Atributos de figuras e simetria` · **Ficha:** F58, O Detetive de Formas

---

## 1. O que esta onda tem de diferente

**É a primeira onda sob o critério fallback-first, e o delta observado prova a diferença.**

As doze migrações anteriores tinham todas a mesma assinatura — `{ composer:+1, legacy:−1, divergences:−1 }` — porque trocavam a proveniência de telas **que já existiam**. O fallback saiu de 39 para 38 em duas semanas: uma única competência.

A `GE.03` não vinha de gerador legado. Vinha de placeholder `Em construção`. Por isso o delta é outro:

```
{ composer: +1, fallback: −1, served: +1 }
```

**É a primeira vez que uma criança deixa de encontrar "Em construção" nesta linha de trabalho.** O `legacy` fica intocado de propósito.

## 2. Recibos

| | |
|---|---|
| regression-first | `5169d9b46f150079e8e29240d47961fc88699ca3` |
| implementação inativa | `8d47963f148e42f642474b5db2c68738f703b991` |
| `fallback` tipado como índice | `4f0dca1cc5ba2c4daecae40ec28515c7f314f1e2` |
| evidência F58 no catálogo + emissor extraído | `6092da5acad1bdb3cd8aec4a0f6c8afe21ab3546` |
| **portão inativo certificado** | `6092da5a` — `CI` run `31735133641` ✅ · `Certificação transversal` run `31735133586` ✅ |
| promoção do canário | `09efe1e` |

**Matrix pós-W13:** `38 Composer / 15 legado / 37 fallback / 53 servidas / 11 divergências / 12 swaps / 44 estreias`

Snapshot P21.1 imutável; ledger nominal `W13-GE.03`.

## 3. Conteúdo

`DetetiveFormasStage` desenha por `FiguraDesenhada` do próprio `ShapeCanvas` — **uma primitiva só, sem composição, sem segunda linguagem visual**. Escada: contar lados → cantos quadrados → curvos vs. retos → eixo de simetria → completar a metade simétrica. Nasce com `resolucao()` declarativa tipada sob R0-A.

**A §9 exige o eixo de simetria no L4.** Contar lados e cantos é leitura de atributo: a figura fica parada e basta olhar. O eixo é o único degrau em que a criança precisa dobrar a figura mentalmente e conferir se cada ponto encontra o seu reflexo. Três acertos distribuídos pelos níveis de atributo não provam essa passagem.

## 4. Dois defeitos achados no caminho, corrigidos na fonte

**`fallback: ""` no contrato de resolução.** O R0-A define `fallback?: number` — o índice do passo onde a explicação começa quando nenhum equívoco casa com um passo. A F58 declarava string vazia. Corrigido para `0`, que é o valor de todos os outros contratos sob R0-A e da fixture `27+15`.

**A evidência da §9 fora do catálogo central.** `detetive-formas-simetria-nivel-4` existia como literal local no contrato e era montada em linha dentro do palco. São exatamente os dois defeitos que o catálogo existe para impedir: ficha e emissor moram longe um do outro, e string solta em cada ponta diverge em silêncio — a coroa nunca vem e nada acusa; e condição construída dentro do componente só pode ser conferida abrindo navegador, então o portão que compara exigência com emissão não a alcança.

Correção: `Evidencia.SIMETRIA_EIXO` no catálogo central, `DetetiveFormasEvidence` virou apelido, `detetiveFormasProcedure.ts` concentra a decisão em funções puras, o palco usa essas funções, e o emissor entrou no portão transversal **com os dois casos negativos** — eixo errado não emite, eixo certo fora do L4 também não.

**Um terceiro, achado pelo `tsc` e não pelos testes:** ao extrair a emissão, sobrou uso de `DetetiveFormasMisconception` sem import em três pontos do palco. A suíte passou mesmo assim — nenhum teste exercita aqueles caminhos —, mas quebraria no navegador, ou seja, na sonda. Registro do padrão: *2717 testes verdes não medem o que a criança vê.*

## 5. Observabilidade

A Matrix acusou `GE.03: kind sem tradução: detetive-formas-f58`. O kind entrou na linha canônica do `ShapeCanvas` em `ficha_runtime_map.cjs`, com `specializedBuilderIds: ["GE.03"]` — **não numa entrada nova**, porque o palco entrega uma primitiva só. A regra "arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas" continua valendo.

## 6. Nota de processo — esta onda foi fechada fora do fluxo normal

As integrações de escrita do GitHub falharam em duas ferramentas diferentes no meio da onda. A implementação inativa chegou a existir como commit órfão sem referência; o reparo da evidência chegou a existir apenas em working tree de sandbox e **foi perdido** — teve de ser refeito do zero a partir do diagnóstico.

O que salvou a onda: **o diagnóstico estava escrito**, com arquivo, teste e causa. Trabalho não commitado morre; diagnóstico escrito sobrevive.

O PR #39 foi fechado sem merge — sua árvore era `b73f756b`, idêntica à de `4f0dca1c`, porque o reparo nunca chegou a ser commitado no ambiente de origem.

## 7. Verificação local no SHA da promoção

```
npx vitest run  (suíte completa)   ->  190 files, 2730 passed
npx tsc --noEmit                   ->  limpo
npm run auditar                    ->  passou
npm run build                      ->  passou
```

O recibo final da onda exige os **dois workflows verdes no HEAD exato** desta linha. Verde de outro SHA não vale por procuração.

## 8. Próxima onda

Recalcular a fila pela Matrix/DAG — lista histórica não vence estado vivo. Registro pós-W12: `AL.04 (2)`, `GE.04 (1)`, `GE.05 (1)`, `N2.06 (1)`, agora sem a `GE.03`. **37 fallbacks restantes.**
