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

## 2. DOIS WORKFLOWS — mudança estrutural, leia antes de tudo

Desde o commit `a63900f` ("ci: separar certificacao transversal por SHA"), o PR é validado por **dois** workflows e não mais por um:

| Workflow | Jobs | Concorrência |
|---|---|---|
| **`CI`** | Gates do SAGA · Sonda real Sensei · Higiene do diff · Guarda de binários | grupo por `ref`, cancelável |
| **`Certificação transversal`** | Sonda transversal 390 px × 8 sementes · Sonda transversal 320/900 px × 1 semente | **grupo por `head.sha`**, `cancel-in-progress: false` |

**Motivo.** O `ci.yml` cancelava a certificação em curso a cada push novo. Isso forçava uma parada obrigatória de ~28 min ao fim de cada onda e permitia que um push distraído destruísse a prova de uma onda inteira — o histórico acumulava dezenas de execuções canceladas por isso. Desligar só `cancel-in-progress` num grupo compartilhado não bastaria: um grupo comum mantém apenas um run em execução e um pendente, substituindo o pendente anterior. O grupo por SHA garante independência real.

> **CONSEQUÊNCIA CONTRATUAL:** onde este documento, os checkpoints ou os runbooks disserem *"CI integralmente verde"*, leia **"os dois workflows verdes no MESMO SHA"**. Recibo de onda com um workflow só é recibo incompleto.

Este commit foi feito **enquanto o run `31719520999` (Certificação transversal, SHA `94d9075`) estava `in_progress`**, propositalmente, como segundo push da prova de concorrência. A sessão que retomar deve verificar pela API se aquele run sobreviveu e concluiu. Se sobreviveu, a separação está provada e pode ser tratada como verdade. Se foi cancelado, a separação falhou e precisa ser corrigida na fonte antes de qualquer onda nova.

## 3. Ordem de leitura

1. este arquivo
2. `AI_Studio_Lab/codex/RETOMADA.md`
3. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W12_N4_01_F97_FECHADA_2026-08-13.md`
4. `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`
5. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
6. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
7. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
8. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

Documentos antigos são históricos. Em conflito valem: **GitHub remoto atual → gates executáveis → checkpoint mais novo → documentos anteriores**.

## 4. Estado curricular após W12

Fechadas: **W7, W8, W9, R0-A, W10, W11, W12**.

Matrix observada após a promoção da W12:

`37 Composer / 15 legado / 38 fallback / 52 servidas / 11 divergências / 12 swaps / 44 estreias`

Marcos da W12 para conferência:

- regression-first de abertura: `281ce120aa1bdc7e0c887e5700211952df4fb671`
- HEAD **inativo** comprovado: `3c80162716c40117e1faf5583fb33fe7ec23013b` — CI #1256 / run `31701736784`, 6/6
- promoção de `N4.01`: `0452b2ed16c67ac32cc30e25ee59bfec46356264`
- HEAD funcional final: `d902ba9e7ea198ab424ea572b70e6c4edf1a9c93` — CI #1262 / run `31712225756`, 6/6

`W12 N4.01/F97` migrou legado → Composer e foi mantida no caminho crítico porque o DAG prova **23 descendentes ainda em fallback**.

A definição de pronto aceita **legado como servido**. Migração legado → Composer que não destrava fallback é dívida separada, fora do caminho crítico.

## 5. Pendência aberta — falha do `CI` no HEAD `94d9075`

O run `31719520955` (`CI`) falhou. Gates, Higiene e Binários passaram; a **`Sonda real Sensei` falhou em `scripts/sonda-matricula.mjs`** porque o navegador recebeu **HTTP 404 de um `.woff2` do Google Fonts**.

Contexto para o diagnóstico, já verificado no código:

- `src/index.css:1` faz `@import url('https://fonts.googleapis.com/css2?...')` — o app depende de rede externa para tipografia;
- `scripts/sonda-sensei-dojo.mjs` **já possui** o filtro que classifica `fonts.gstatic.com` como ruído externo não funcional (ver linhas ~137–143);
- `scripts/sonda-matricula.mjs` aparentemente **não possui** esse filtro.

Trate como defeito real, não como flake. Duas rotas possíveis, a decidir com evidência:

1. **paridade de sonda** — levar o mesmo filtro de ruído externo já existente para `sonda-matricula.mjs`, mantendo a falha para qualquer 404 que não seja de fonte externa;
2. **remover a dependência externa** — hospedar a tipografia localmente, o que também elimina a fragilidade offline do app para a criança.

A rota 2 é a correção da fonte do problema; a rota 1 é a correção do instrumento. Se escolher a 1, registre a 2 como dívida nomeada.

## 6. Critério de seleção de onda — vigente da W13 em diante

1. **priorize competências em FALLBACK**;
2. respeite o DAG e só selecione fallback cujos pré-requisitos estejam servidos;
3. entre as elegíveis, priorize a que destrava mais fallbacks descendentes;
4. legado só passa à frente quando for pré-requisito bloqueante de uma fallback, ou quando não houver fallback elegível;
5. recalcule a fila pela Matrix/DAG depois de **cada** onda; lista histórica nunca vence estado vivo.

Fila registrada no pós-W12: `GE.03 (3)`, `AL.04 (2)`, `GE.04 (1)`, `GE.05 (1)`, `N2.06 (1)`.

Próxima onda: **W13 = `GE.03 / F58`**, salvo deriva comprovada no remoto antes da edição.

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

## 8. Medição ainda devida

Falta entregar: **horas por onda de FALLBACK (construir) contra onda de LEGADO (migrar)**, medidas no histórico real de commits, não estimadas. É o que transforma o prazo até `fallback = 0` em conta em vez de chute. Entregar no fechamento da próxima onda.

## 9. Definição de pronto

Autoridade: `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`.

Em síntese: fábrica curricular pronta = **grafo integralmente servido, `fallback = 0`, nenhum `Em construção`, cadeia autoral auditável e os dois workflows verdes no mesmo SHA**. Não é necessário converter todo legado para Composer.

Explicitamente fora da fábrica curricular: **player da resolução**, **Oficina**, **conta armada**, **mascote / Creature Engine**, **Thinking Engine runtime**.

## 10. Restrições duras

- NÃO tocar na `main`.
- NÃO fazer merge, marcar ready ou ativar auto-merge.
- NÃO reabrir W7–W12.
- NÃO tocar no Creature Engine.
- Thinking Engine runtime NÃO autorizado.
- NÃO fazer faxina oportunista.
- NÃO enfraquecer gates para obter verde.
- NÃO tratar flake/404/falha de CI como transitório sem evidência.
- NÃO alterar o snapshot histórico P21.1; a evolução é pelo ledger nominal.

## 11. Se as mutações do GitHub estiverem bloqueadas

Já aconteceu: uma sessão perdeu a permissão de escrita (`update_ref`, `create_file`, `update_file` e rerun bloqueados, sem `gh` nem token local). Nesse caso:

- **não** invente rota alternativa, force-push ou automodificação via CI;
- registre o STOP em comentário no PR #35 com HEAD, runs, falha e próximo passo exato;
- avise o autor: a integração precisa de escrita restaurada, e `.github/workflows/` exige permissão de workflows separada, que integrações normalmente não têm.

## 12. Autonomia

Autonomia para executar as ondas sem consulta intermediária **até o fim do Bloco 1**, obedecendo o critério fallback-first e todas as restrições acima. Reporte somente no fechamento do bloco, salvo condição de parada real comprovada no remoto.

Se a conversa saturar antes, feche com segurança o último estado no remoto e garanta que o checkpoint e este arquivo representem o último estado válido antes de abrir nova conversa.
