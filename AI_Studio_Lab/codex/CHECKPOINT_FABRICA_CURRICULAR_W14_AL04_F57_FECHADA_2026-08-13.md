# Checkpoint — W14 `AL.04 / F57` fechada

**Data:** 13/08/2026
**Branch:** `codex/fechamento-curricular` · **PR:** #35 (open, draft, unmerged)
**Competência:** `AL.04 — Sequências e regra de formação` · **Ficha:** F57, A Regra da Sequência

---

## 1. Seleção viva da onda

A W14 foi escolhida após recalcular a fila pela Matrix/DAG pós-W13, sem reutilizar a ordem histórica. `AL.04` estava em fallback, seus pré-requisitos `AL.03` e `N3.09` já eram servidos, e ela permaneceu entre as candidatas de maior impacto causal. O desempate preservou a ordem estável da fila viva anterior.

## 2. Recibos da implementação

| Marco | SHA / run |
|---|---|
| regression-first | `dd9edd98` |
| implementação inativa inicial | `078f4f8f` |
| renderer autoral + sonda F57 | `850fe6f7` |
| auditor/runtime map reconciliados | `cc2c3202` |
| snapshot runtime corrigido | `1ff9aea655ff5cbca26bf4432fd0aa7b6cd470c8` |
| **portão inativo certificado** | `1ff9aea6` — `CI` run `31747073742` ✅ · `Certificação transversal` run `31747073736` ✅ |
| promoção isolada | `cfe4e31d680f99f5d4f4f8c14f6f03939017b0e2` |
| Matrix observacional | `CI` run `31756497757`: vermelho esperado apenas por baseline desatualizado |

A Matrix observou, antes do ledger:

`39 Composer / 15 legado / 36 fallback / 54 servidas / 11 divergências / 12 swaps / 44 estreias`

Delta real da W14:

```text
{ composer: +1, fallback: -1, served: +1 }
```

O `legacy` permaneceu em 15. O ledger nominal é `W14-AL.04`.

## 3. Contrato pedagógico e runtime

A F57 preserva as duas primitivas canônicas `EmojiRow + NumberLine`, sem alias semântico artificial. A progressão executável cobre completar padrão, identificar a regra, sequência decrescente, lacuna intermediária e regra multiplicativa. O renderer autoral mantém a identidade curricular da ficha, retry/feedback e emissão de evidência nos degraus difíceis.

A ficha nasceu com `resolucao()` declarativa tipada sob R0-A. O mastery aceita a família difícil prevista pela ficha — evidência de sequência decrescente **ou** de lacuna intermediária — em vez de transformar a fonte canônica num requisito artificialmente mais rígido.

## 4. O que os gates provaram

No SHA inativo `1ff9aea6`:

- suíte completa: **191 arquivos / 2738 testes** verdes;
- TypeScript, build, catálogo, conformidade, grafo e guardas verdes;
- sonda Chrome real F57 passou em 320/390/900 × L1–L5;
- `Certificação transversal` passou em 390 px × 8 sementes e 320/900 px;
- os dois workflows estavam verdes no mesmo SHA antes da promoção.

A promoção foi um commit isolado contendo apenas `"AL.04"` na lista canária. Em seguida a Matrix acusou exatamente `39/15/36/54/11`; o vermelho foi usado como observação, não relaxado.

## 5. Medição de tempo — série histórica

Metodologia mantida: tempo de parede entre o primeiro commit regression-first da onda e o commit de recibo final da onda, medido no histórico real.

Base disponível antes de incorporar a duração final desta própria W14:

- ondas de **legado**: `n=9`, média `3,49 h`, mediana `2,78 h`;
- ondas de **fallback** já fechadas: W5 `2,84 h`, W13 `3,02 h` (`n=2`).

A leitura provisória é que construir fallback e migrar legado estão na mesma ordem de grandeza; o custo dominante está nos portões e na certificação, não na escrita do código. A duração da W14 deve ser adicionada à série no próximo fechamento, quando o timestamp deste recibo final já for histórico observável.

## 6. Próxima onda

Antes da W15, recalcular novamente a fila pela Matrix/DAG viva. `N4.10`, `N5.01`, `AL.05`, `GE.06`, `GM.07` e outras competências entram apenas como candidatas; nenhuma ordem histórica tem precedência.

**Fallback pós-W14: 36.**

## 7. Regra de reporte vigente

O antigo marco “fim do Bloco 1” não governa mais o reporte. A regra agora é:

- executar autonomamente W14–W18;
- reportar somente a cada **5 ondas fechadas**, ou imediatamente em condição de parada real;
- manter o protocolo completo em cada onda, inclusive dois workflows verdes no HEAD final exato.

O recibo final desta W14 é o HEAD que contém este checkpoint, o ledger reconciliado e `PROMPT_DE_RETOMADA.md` atualizado; ele só é válido quando **CI + Certificação transversal** fecharem verdes nesse mesmo SHA.
