# PROMPT DE RETOMADA — SAGA

> **Uso:** copie e cole integralmente este arquivo em uma conversa nova com `@GitHub`.
> **Manutenção:** Matrix e ledger são reconciliados a cada onda. Checkpoint e este prompt são atualizados a cada bloco de **5 ondas fechadas**, ou imediatamente quando uma descoberta muda regra/protocolo.

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

## 2. DOIS WORKFLOWS — certificação por SHA + sementes paralelas

Desde `a63900f`, o PR é validado por dois workflows independentes por SHA. Antes da W15, o gargalo serial de 390 px também foi removido sem reduzir cobertura:

| Workflow | Jobs | Concorrência |
|---|---|---|
| **`CI`** | Gates do SAGA · Sonda real Sensei · Higiene do diff · Guarda de binários | grupo por `ref`, cancelável |
| **`Certificação transversal`** | **8 jobs paralelos** de 390 px, uma semente canônica por job · 1 job 320/900 px × 1 semente | grupo por `head.sha`, `cancel-in-progress: false` |

A lista canônica continua em `sonda/cenas.tsx`: `[1, 7, 42, 99, 123, 777, 2024, 31415]`.

O contrato histórico `?sementes=N` / `SONDA_SEMENTES=N` continua significando **prefixo** e não foi quebrado. Cada job da matrix usa o prefixo necessário apenas para tornar sua semente alcançável e o filtro nominal `[semente X]` faz o driver visitar **somente aquela semente antes do laço caro de 1,5 s**. `src/curriculum/sondaSeedCoverage.test.ts` compara a matrix diretamente com `TODAS_AS_SEMENTES`, exige oito valores únicos e prova o pareamento `semente ↔ prefixo`. Se alguém mudar a lista ou esquecer um job, a suíte fica vermelha.

A prova de concorrência entre SHAs **já foi feita e passou**: runs `31719520999` (SHA `94d9075`) e `31721098530` (SHA `0232bcc6`) coexistiram vivos. **Não refazer esse teste.**

> **CONSEQUÊNCIA CONTRATUAL:** onde documentos antigos disserem “CI integralmente verde”, leia **“os dois workflows verdes no MESMO SHA”**. Na certificação transversal pós-otimização, sucesso do workflow exige os oito jobs de semente e o job responsivo verdes.

## 3. Ordem de leitura

1. este arquivo;
2. `AI_Studio_Lab/codex/RETOMADA.md` (histórico operacional; em conflito este prompt mais novo vence);
3. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W14_AL04_F57_FECHADA_2026-08-13.md`;
4. `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`;
5. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
6. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
7. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
8. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

Em conflito valem: **GitHub remoto atual → gates executáveis → este prompt/checkpoint mais novo → documentos anteriores**.

## 4. Estado curricular após W14

Fechadas: **W7, W8, W9, R0-A, W10, W11, W12, W13, W14**.

Matrix reconciliada pós-W14:

`39 Composer / 15 legado / 36 fallback / 54 servidas / 11 divergências / 12 swaps / 44 estreias`

### W14 `AL.04 / F57` — segunda drenagem fallback-first

- regression-first: `dd9edd98d7e8810dd504fb8fc6a04a1df880da94`;
- portão inativo certificado: `1ff9aea655ff5cbca26bf4432fd0aa7b6cd470c8` — CI `31747073742` ✅ + Certificação transversal `31747073736` ✅;
- promoção isolada: `cfe4e31d680f99f5d4f4f8c14f6f03939017b0e2`;
- Matrix observacional pós-promoção: `39/15/36/54/11`;
- ledger nominal: `W14-AL.04 = { composer:+1, fallback:-1, served:+1 }`;
- correção final do contrato genérico do canário: `25842cb9b6bdbe502b9811d29c6f559c7185f003`;
- recibo final da W14: CI run `31757316279` + Certificação transversal run `31757316244`, ambos no SHA `25842cb9`.

**Restam 36 fallbacks.** O legado permanece servido e não deve ser migrado só por estética.

## 5. Critério de seleção de onda — fallback-first

1. **priorize competências em FALLBACK**;
2. respeite o DAG e só selecione fallback cujos pré-requisitos estejam servidos;
3. entre as elegíveis, priorize a que destrava mais fallbacks descendentes;
4. legado só passa à frente quando for pré-requisito bloqueante de uma fallback, ou quando não houver fallback elegível;
5. recalcule a fila pela Matrix/DAG depois de **cada** onda; lista histórica nunca vence estado vivo.

Antes de fixar W15, W16, W17, W18 ou W19, recalcule de novo. Uma competência verificada anteriormente entra apenas como **candidata**.

## 6. Portões locais antes de empurrar

Para qualquer push que **deva ser verde** (o commit regression-first vermelho é a exceção intencional), quando houver checkout local funcional execute antes do push:

```bash
npm test
npx tsc --noEmit
npm run auditar
npm run build
SONDA_SEMENTES=1 npm run sonda
```

Só depois empurre o lote semântico. O objetivo é descobrir em segundos o que não precisa de uma volta remota de CI.

Se a sessão não possuir checkout local executável, **não invente resultado local**: registre a limitação e use os gates remotos obrigatórios. Isso não autoriza reduzir cobertura nem pular os dois workflows.

## 7. Protocolo obrigatório de cada onda

1. reancorar na ficha canônica, grafo, Matrix e runtime da competência escolhida;
2. contrato **regression-first executável** — vermelho pelo motivo correto;
3. implementar no Composer **registrada e INATIVA**;
4. toda ficha nova nasce com `resolucao()` declarativa tipada sob R0-A;
5. reutilizar primitivas do cânone; não criar segunda linguagem visual por conveniência;
6. antes de push que deve ser verde, executar os portões locais da §6 quando houver checkout;
7. Gates + sonda Chrome real da ficha + **Certificação transversal** no mesmo SHA inativo;
8. promover somente depois dos **dois workflows verdes** nesse SHA exato;
9. promoção em alteração isolada do canário;
10. deixar a Matrix observar o delta real; não presumir números;
11. reconciliar `COVERAGE_MIGRATIONS` **em toda onda**, somente depois do delta observado;
12. exigir os dois workflows verdes no HEAD final exato da onda;
13. **não** criar checkpoint nem atualizar este prompt a cada onda: fazer isso no fechamento de cada grupo de 5 ondas, salvo descoberta que mude regra/protocolo.

**Não certificar várias ondas em lote.** Cada onda continua tendo seu próprio SHA inativo certificado, promoção isolada, Matrix/ledger e HEAD final verde. A paralelização de sementes reduz o custo do portão; não muda a unidade de certificação.

## 8. Série de tempo fallback × legado

Metodologia: tempo de parede entre o primeiro commit regression-first e o commit de recibo final da onda, medido no histórico real.

- **legado:** `n=9`, média `3,49 h`, mediana `2,78 h`;
- **fallback:** W5 `2,84 h`, W13 `3,02 h`, W14 `3,07 h` → `n=3`, média `2,98 h`, mediana `3,02 h`.

A hipótese de que construir fallback seria materialmente mais caro que migrar legado não se confirmou. O custo dominante observado é atravessar portões. Continue alimentando a série em cada onda e reporte-a no fechamento do bloco; `n=3` ainda é pequeno.

## 9. Definição de pronto

Autoridade: `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`.

Fábrica curricular pronta = **grafo integralmente servido, `fallback = 0`, nenhum `Em construção`, cadeia autoral auditável e os dois workflows verdes no mesmo SHA**. Não é necessário converter todo legado para Composer.

Explicitamente fora da fábrica curricular: player da resolução · Oficina · conta armada · mascote / Creature Engine · Thinking Engine runtime.

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
- NÃO certificar várias ondas em lote.

## 11. Se as mutações do GitHub estiverem bloqueadas

Se uma sessão perder permissão de escrita:

- não invente rota alternativa, force-push ou automodificação via CI;
- registre STOP no PR #35 com HEAD, runs, falha e próximo passo exato;
- avise o autor: integração precisa de escrita restaurada.

## 12. Autonomia e regra de reporte

O antigo marco “fim do Bloco 1” morreu com o critério fallback-first.

Regra vigente:

- executar autonomamente, sempre recalculando Matrix/DAG;
- reportar a cada **5 ondas fechadas**, ou imediatamente em condição de parada real comprovada;
- **próximo lote de reporte: W15, W16, W17, W18 e W19**;
- checkpoint de bloco + este prompt são atualizados no fechamento da W19, salvo mudança de regra anterior;
- no relatório da W19 incluir Matrix, fallback restante, ondas escolhidas e a série de tempo atualizada dos dois lados.

Se a conversa saturar antes, preserve no remoto o último estado válido e registre somente o necessário para permitir retomada sem ambiguidade.
