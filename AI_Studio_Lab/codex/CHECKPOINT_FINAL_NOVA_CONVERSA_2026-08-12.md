# Checkpoint final para nova conversa — SAGA

> **PORTA DE HANDOFF DA CONVERSA.**
>
> Este arquivo organiza o que a próxima conversa precisa saber. Ele não substitui
> a regra remote-first: ao retomar, o PR #35 e o CI do HEAD remoto corrente são
> a fonte da verdade.

## Identidade

- repo: `dyegorodrigues/SAGA`;
- linha de trabalho: `codex/fechamento-curricular`;
- PR: #35;
- PR deve permanecer `open + draft + unmerged`;
- base protegida: `main`;
- nenhum merge/ready/auto-merge sem autorização humana explícita;
- Creature Engine fora do escopo;
- Thinking Engine runtime não autorizado.

## Estado curricular consolidado

Fechadas nesta linha:

- W7 `N2.02 / F36`;
- W8 `N3.01 / F13`;
- W9 `N3.02 / F15`;
- R0-A — contrato técnico de resolução, sem delta curricular;
- W10 `N3.03 / F14`.

Recibo de produto da W10:

- SHA: `0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`;
- CI: #1195 / run `31655630072`;
- critério: seis jobs verdes no mesmo SHA.

Matrix vigente pós-W10:

`35 Composer / 17 legado / 38 fallback / 52 servidas / 13 divergências / 12 swaps / 44 estreias`.

Ledger:

- `W10-N3.03`: mudança curricular real;
- `OBS-COMPOSITE-N4.03`: correção somente de observabilidade;
- snapshot histórico P21.1 imutável.

## Dívidas e decisões preservadas

- A regra “arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas” foi restaurada e mecanizada.
- Palcos compostos têm gate executável; `TabuadaStage` é observado como
  `ArrayGrid/Arranjo + Quadrado100 + NumberLine`, sem inventar `Arranjo` como
  nova primitiva canônica.
- `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md` continua sendo a quarentena das decisões
  de política do player. Não congelar limiares de erro/teto por sessão dentro da W11.
- Gate vermelho é evidência; não reduzir expectativa para fabricar verde.
- Verde de SHA anterior nunca vale por procuração.
- Não fazer faxina P2 oportunista.

## Rascunhos remotos

Scratch branch: `codex/w11-w12-drafts`.

Arquivos:

- `AI_Studio_Lab/codex/drafts/W11_AL03_F30_DRAFT.md`;
- `AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md`.

Eles são **NÃO EXECUTÁVEIS, NÃO SÃO FONTE DE VERDADE E NÃO INTEGRAM O PR #35**.
Servem apenas para não depender do estado de uma sessão. Não fazer merge/cherry-pick
cego da scratch branch.

## Próxima ação — W11 AL.03 / F30

Antes de editar:

1. abrir PR #35 e confirmar `open + draft + unmerged`;
2. confirmar branch e HEAD remoto;
3. confirmar CI completo do HEAD e todos os seis jobs;
4. confirmar review threads/comentários;
5. ler, nesta ordem:
   - `RETOMADA.md`;
   - `ESTADO_DO_FECHAMENTO.md`;
   - `CHECKPOINT_FABRICA_CURRICULAR_W10_N3_03_FECHADA_2026-08-12.md`;
   - `AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
   - `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
   - rascunho W11 na scratch branch;
   - ficha canônica F30 + grafo + Matrix.

Depois, protocolo W11:

1. regression-first específico: provar que `AL.03/F30` ainda não está registrada
   no Composer e segue pela proveniência legada; não fabricar falha visual;
2. implementar registrada e **INATIVA**;
3. reusar `InteractiveNumberLineSurface` — não criar uma segunda reta;
4. usar `Quadrado100` no L3 conforme F30 e retirar manipulável em L4–L5;
5. nascer com `resolucao()` tipada sob R0-A;
6. preservar diagnósticos `ERRO_PASSO`, `PERDE_PADRAO`, `CONFUNDE_SEQUENCIA`,
   evidência de processo e mastery por passos 2/5/10 + início deslocado;
7. rodar auditorias, TypeScript, suíte, build e Chrome real no mesmo SHA;
8. somente após o SHA inativo integralmente verde, promover canário;
9. deixar a Matrix observar o delta factual;
10. reconciliar observabilidade se necessário sem maquiar a entrega;
11. registrar ledger;
12. fechar W11 apenas com CI integralmente verde no HEAD exato.

W12 `N4.01/F97` só vem depois do fechamento formal da W11.

## Regra de retomada

Se qualquer SHA, CI, branch ou documento acima divergir do remoto, **não tente
forçar este checkpoint sobre o GitHub**. Reancore, investigue a deriva e atualize
o checkpoint com evidência.
