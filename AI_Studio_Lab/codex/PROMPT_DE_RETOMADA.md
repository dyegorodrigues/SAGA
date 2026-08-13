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
4. confirme que `main` continua intocada;
5. confira o CI do HEAD remoto exato, todas as jobs, reviews e review threads;
6. se HEAD/CI/estado tiverem mudado, investigue a deriva antes de editar — o remoto vence este arquivo.

### Marcos W12 para conferência

- HEAD regression-first de abertura da W12: `281ce120aa1bdc7e0c887e5700211952df4fb671`.
- HEAD **inativo** da implementação F97 comprovado: `3c80162716c40117e1faf5583fb33fe7ec23013b`.
- CI inativo de referência: **CI #1256 / run `31701736784` — 6/6 SUCCESS**, incluindo F97 em Chrome real e `390 px × 8 sementes`.
- commit de promoção de `N4.01`: `0452b2ed16c67ac32cc30e25ee59bfec46356264`.

O HEAD de fechamento documental é o HEAD remoto que contém este `PROMPT_DE_RETOMADA.md`; ele deve ser reobtido no GitHub em vez de ser hardcoded aqui, porque este arquivo faz parte do próprio commit que o contém. Verde de SHA anterior nunca vale por procuração para o HEAD remoto atual.

## 2. Ordem de leitura

Leia integralmente, nesta ordem, antes de desenvolver a próxima onda:

1. `AI_Studio_Lab/codex/RETOMADA.md`
2. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W12_N4_01_F97_FECHADA_2026-08-13.md`
3. `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`
4. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
5. `AI_Studio_Lab/codex/CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-13.md`
6. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W11_AL03_F30_FECHADA_2026-08-13.md`
7. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
8. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
9. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

Documentos antigos são históricos. Em conflito, valem: **GitHub remoto atual → gates executáveis → checkpoint W12/mais novo → documentos anteriores**.

## 3. Estado curricular após W12

W7, W8, W9, R0-A, W10, W11 e W12 estão fechadas quando o HEAD remoto documental tiver CI integralmente verde no SHA exato.

A Matrix observada imediatamente após a promoção da W12 foi:

`37 Composer / 15 legado / 38 fallback / 52 servidas / 11 divergências / 12 swaps / 44 estreias`.

W12 `N4.01 / F97` migrou legado → Composer. Ela foi mantida no caminho crítico porque o DAG prova que `N4.01` possui **23 descendentes que ainda estavam em fallback** no estado W12.

A definição de pronto aceita **legado como servido**. Migração legado → Composer que não destrava fallback é dívida separada e está fora do caminho crítico da fábrica.

## 4. Critério de seleção de onda — regra vigente

A partir da W13:

1. **priorize competências em FALLBACK**;
2. respeite o DAG e só selecione fallback cujos pré-requisitos estejam servidos;
3. entre as fallbacks elegíveis, priorize a que destrava mais fallbacks descendentes;
4. legado só passa à frente quando for pré-requisito bloqueante necessário para uma fallback ou quando não houver fallback elegível;
5. recalcule a fila a partir da Matrix/DAG depois de cada onda; listas históricas nunca vencem o estado vivo.

No estado pós-W12, as fallbacks imediatamente elegíveis eram:

`GE.03 (impacto 3)`, `AL.04 (2)`, `GE.04 (1)`, `GE.05 (1)`, `N2.06 (1)`.

Portanto a próxima onda é:

**W13 = GE.03**, salvo deriva comprovada no remoto antes da edição.

O roteiro histórico em `ROTEIRO_ATE_O_FIM.md` não tem precedência sobre este critério novo.

## 5. Protocolo obrigatório de cada onda

Para W13 e seguintes:

1. reancorar na ficha canônica, grafo, Matrix e runtime da competência escolhida;
2. criar/confirmar contrato **regression-first executável** — vermelho pelo motivo correto, sem relaxar expectativa;
3. implementar a competência no Composer **registrada e INATIVA**;
4. toda ficha nova nasce com `resolucao()` declarativa tipada sob R0-A;
5. reutilizar primitivas existentes quando o cânone pedir; não criar segunda linguagem visual por conveniência;
6. rodar Gates + sonda em Chrome real da ficha e portões transversais no **mesmo SHA inativo**;
7. só promover depois de CI integralmente verde no SHA inativo exato;
8. promover em alteração isolada do canário;
9. deixar a Matrix observar o delta real; não presumir números;
10. reconciliar `COVERAGE_MIGRATIONS` somente depois do delta observado;
11. criar checkpoint da onda;
12. atualizar **este `PROMPT_DE_RETOMADA.md`**;
13. exigir CI integralmente verde no HEAD final exato.

**Verde de outro SHA nunca vale por procuração.**

## 6. Definição de pronto da fábrica curricular

A autoridade é `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`.

Em síntese, o caminho crítico termina quando o currículo definido ali estiver servido e **fallback = 0**, com seus gates obrigatórios verdes. Não é necessário converter todo legado para Composer para encerrar a fábrica.

Explicitamente fora da fábrica curricular:

- player da resolução;
- Oficina;
- conta armada;
- mascote / Creature Engine.

## 7. Restrições duras

- NÃO tocar na `main`.
- NÃO fazer merge.
- NÃO marcar PR como ready.
- NÃO ativar auto-merge.
- NÃO reabrir W7–W11.
- NÃO tocar no Creature Engine.
- Thinking Engine runtime NÃO autorizado.
- NÃO fazer faxina oportunista.
- NÃO enfraquecer gates para obter verde.
- NÃO tratar flake/404/falha de CI como transitório sem evidência.
- NÃO alterar snapshot histórico P21.1 para acomodar trabalho novo; a evolução é pelo ledger nominal.

## 8. Autonomia

Há autonomia para executar as ondas sem consulta intermediária **até o fim do Bloco 1**, obedecendo o critério fallback-first e todas as restrições acima. Reporte somente no fechamento do bloco, salvo condição de parada real comprovada no remoto.

Se a conversa saturar antes disso, feche com segurança o último estado alcançado no remoto e garanta que o checkpoint e este `PROMPT_DE_RETOMADA.md` representem o último estado válido antes de abrir nova conversa.
