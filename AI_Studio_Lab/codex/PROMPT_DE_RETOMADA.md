# PROMPT DE RETOMADA — SAGA

> **Uso:** copie e cole integralmente este arquivo em uma conversa nova com `@GitHub`.
> **Manutenção:** este arquivo é parte obrigatória do fechamento de cada onda. Onda sem este prompt atualizado não está fechada.

@GitHub Continue o desenvolvimento do SAGA a partir do estado remoto atual.

Repo: `dyegorodrigues/SAGA`
PR: `#35`
Branch: `codex/fechamento-curricular`

## 1. Fonte da verdade e reancoragem obrigatória

O **GitHub remoto é a fonte da verdade**. NÃO confie apenas neste prompt, em memória de conversa, em SHA antigo ou em CI de outro commit.

Antes de qualquer edição:

1. confirme que o PR #35 permanece `open + draft + unmerged`;
2. confirme a branch `codex/fechamento-curricular`;
3. confirme o HEAD remoto atual da branch;
4. confirme que `main` continua intocada em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
5. confira **os dois workflows** do HEAD remoto exato, todas as jobs, reviews e review threads;
6. se HEAD/CI/estado tiverem mudado, investigue a deriva antes de editar — o remoto vence este arquivo.

## 2. DOIS WORKFLOWS — infraestrutura já provada

Desde o commit `a63900f` ("ci: separar certificacao transversal por SHA"), o PR é validado por **dois** workflows e não mais por um:

| Workflow | Jobs | Concorrência |
|---|---|---|
| **`CI`** | Gates do SAGA · Sonda real Sensei · Higiene do diff · Guarda de binários | grupo por `ref`, cancelável |
| **`Certificação transversal`** | Sonda transversal 390 px × 8 sementes · Sonda transversal 320/900 px × 1 semente | **grupo por `head.sha`**, `cancel-in-progress: false` |

**Motivo.** O `ci.yml` cancelava a certificação em curso a cada push novo. O grupo por SHA torna a certificação longa independente por commit.

> **CONSEQUÊNCIA CONTRATUAL:** onde este documento, os checkpoints ou os runbooks disserem *"CI integralmente verde"*, leia **"os dois workflows verdes no MESMO SHA"**. Recibo de onda com um workflow só é recibo incompleto.

A prova de concorrência **já foi feita e passou**. Os runs `31719520999` (SHA `94d9075`) e `31721098530` (SHA `0232bcc6`) coexistiram vivos em SHAs diferentes; o push posterior não cancelou o anterior. **Não refazer este teste.**

## 3. Ordem de leitura

1. este arquivo
2. `AI_Studio_Lab/codex/RETOMADA.md`
3. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W14_AL04_F57_FECHADA_2026-08-13.md`
4. `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`
5. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
6. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
7. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
8. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

Documentos antigos são históricos. Em conflito valem: **GitHub remoto atual → gates executáveis → checkpoint mais novo → documentos anteriores**.

## 4. Estado curricular após W14

Fechadas: **W7, W8, W9, R0-A, W10, W11, W12, W13, W14**.

Matrix observada após a promoção da W14 e reconciliada pelo ledger:

`39 Composer / 15 legado / 36 fallback / 54 servidas / 11 divergências / 12 swaps / 44 estreias`

### W14 `AL.04 / F57` — segunda drenagem fallback-first

Checkpoint: `CHECKPOINT_FABRICA_CURRICULAR_W14_AL04_F57_FECHADA_2026-08-13.md`.

O delta observado foi novamente **`{ composer:+1, fallback:−1, served:+1 }`**: `AL.04` vinha de `Em construção`, não de gerador legado. O `legacy` ficou em 15.

Portão inativo certificado no SHA `1ff9aea655ff5cbca26bf4432fd0aa7b6cd470c8`:

- `CI` run `31747073742` ✅
- `Certificação transversal` run `31747073736` ✅

Promoção isolada: `cfe4e31d680f99f5d4f4f8c14f6f03939017b0e2`.

A promoção fez a Matrix ficar vermelha exatamente como previsto no `CI` run `31756497757`, observando `39 Composer / 15 legado / 36 fallback / 54 servidas / 11 divergências`; só depois disso entrou `W14-AL.04` no ledger.

**Restam 36 fallbacks.**

A definição de pronto aceita **legado como servido**. Migração legado → Composer que não destrava fallback é dívida separada, fora do caminho crítico.

## 5. Pendências abertas

Nenhuma falha de CI estrutural conhecida deve ser tratada por memória: sempre verifique o HEAD remoto atual.

**Dívida nomeada, não urgente:** `src/index.css` ainda faz `@import` do Google Fonts. As sondas filtram o ruído de rede externa, mas hospedar a tipografia localmente continua sendo a correção definitiva. Fora do caminho crítico da fábrica.

## 6. Critério de seleção de onda — fallback-first

1. **priorize competências em FALLBACK**;
2. respeite o DAG e só selecione fallback cujos pré-requisitos estejam servidos;
3. entre as elegíveis, priorize a que destrava mais fallbacks descendentes;
4. legado só passa à frente quando for pré-requisito bloqueante de uma fallback, ou quando não houver fallback elegível;
5. recalcule a fila pela Matrix/DAG depois de **cada** onda; lista histórica nunca vence estado vivo.

**Antes da W15, recalcule a fila do zero pela Matrix/DAG pós-W14.** `N4.10`, `N5.01`, `AL.05`, `GE.06`, `GM.07` etc. são apenas candidatas até o cálculo vivo; nenhuma é “a próxima” por registro histórico.

`ROTEIRO_ATE_O_FIM.md` não tem precedência sobre este critério.

## 7. Protocolo obrigatório de cada onda

1. reancorar na ficha canônica, grafo, Matrix e runtime da competência escolhida;
2. contrato **regression-first executável** — vermelho pelo motivo correto, sem relaxar expectativa;
3. implementar no Composer **registrada e INATIVA**;
4. toda ficha nova nasce com `resolucao()` declarativa tipada sob R0-A;
5. reutilizar primitivas do cânone; não criar segunda linguagem visual por conveniência;
6. Gates + sonda Chrome real da ficha + **certificação transversal** no **mesmo SHA inativo**;
7. promover só depois dos **dois workflows verdes** nesse SHA exato;
8. promover em alteração isolada do canário;
9. deixar a Matrix observar o delta real; não presumir números;
10. reconciliar `COVERAGE_MIGRATIONS` somente depois do delta observado;
11. criar checkpoint da onda;
12. atualizar **este arquivo**;
13. exigir os **dois workflows verdes** no HEAD final exato.

**Verde de outro SHA nunca vale por procuração.**

## 8. Série de tempo fallback × legado

Metodologia: tempo de parede entre o primeiro commit regression-first e o commit de recibo final de cada onda, medido no histórico real.

Base consolidada antes de incorporar o timestamp final da própria W14:

- **legado:** `n=9`, média `3,49 h`, mediana `2,78 h`;
- **fallback:** W5 `2,84 h`, W13 `3,02 h` (`n=2`).

A hipótese de que construir fallback seria materialmente mais caro que migrar legado **não foi confirmada**; até aqui as duas classes estão na mesma ordem de grandeza e o custo dominante é atravessar os portões. Continue alimentando a série a cada onda. Não extrapole demais enquanto `n` do fallback for pequeno.

## 9. Definição de pronto

Autoridade: `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`.

Em síntese: fábrica curricular pronta = **grafo integralmente servido, `fallback = 0`, nenhum `Em construção`, cadeia autoral auditável e os dois workflows verdes no mesmo SHA**. Não é necessário converter todo legado para Composer.

Explicitamente fora da fábrica curricular: **player da resolução**, **Oficina**, **conta armada**, **mascote / Creature Engine**, **Thinking Engine runtime**.

## 10. Restrições duras

- NÃO tocar na `main`.
- NÃO fazer merge, marcar ready ou ativar auto-merge.
- NÃO reabrir ondas fechadas sem regressão comprovada.
- NÃO tocar no Creature Engine.
- Thinking Engine runtime NÃO autorizado.
- NÃO fazer faxina oportunista.
- NÃO enfraquecer gates para obter verde.
- NÃO tratar flake/404/falha de CI como transitório sem evidência.
- NÃO alterar o snapshot histórico P21.1; a evolução é pelo ledger nominal.

## 11. Se as mutações do GitHub estiverem bloqueadas

Se uma sessão perder permissão de escrita:

- **não** invente rota alternativa, force-push ou automodificação via CI;
- registre o STOP em comentário no PR #35 com HEAD, runs, falha e próximo passo exato;
- avise o autor: a integração precisa de escrita restaurada.

## 12. Autonomia e regra de reporte

O antigo marco “fim do Bloco 1” morreu com o critério fallback-first e não governa mais o reporte.

Regra vigente:

- executar ondas autonomamente, sempre recalculando a Matrix/DAG;
- **reportar a cada 5 ondas fechadas**, ou imediatamente em condição de parada real comprovada;
- para o lote atual, fechar **W14, W15, W16, W17 e W18** em sequência e reportar somente ao fim da W18;
- no relatório do lote incluir Matrix, fallback restante e série de tempo atualizada dos dois lados.

Se a conversa saturar antes, feche com segurança o último estado no remoto e garanta que o checkpoint e este arquivo representem o último estado válido antes de abrir nova conversa.
