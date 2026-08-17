# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 17/08/2026 — W44 fechada; W45/N6.04/F88 aberta em regression-first  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer **draft + open + unmerged**  
**Base protegida:** `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

> Este arquivo é um **índice vivo**, não um ledger histórico. O histórico detalhado permanece nos checkpoints por onda e no Git. Para executar trabalho, leia primeiro `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`.

## Estado atual

- Ondas **W1–W44 fechadas**.
- W45 = `N6.04 / F88 — Razão e Proporção`, aberta em regression-first nominal.
- Matrix fechada pós-W44: **69 Composer / 15 legado / 6 fallback / 84 servidas / 11 divergências**.
- Composer registrado/ativo: **69/69** no fechamento W44.
- 90 competências / 94 fichas autorais.
- `modeSwaps=12`.
- `toolIntroductions=44`.
- primitiva autoral ainda ausente: `Moedas`.

Fallbacks pós-W44:

`AL.08, GM.11, N5.05, N6.02, N6.04, PE.04`.

## Último fechamento completo

### W44 — `N5.04 / F74 — Somar Frações`

Cadeia vinculante:

- regression-first: `34b6b3a5ed3fde597564685e7b2a820c2beca0f7` — CI `32050560773` failure nominal + transversal `32050560782` success;
- materialização inativa final: `a41e6e9e6317efcec230b879722a8ae3fcafd8ae` — CI `32052726802` + transversal `32052726430`, ambos success;
- promoção final: `5da29dc4078d67f71012daf21c435be622163957` — CI `32062255308` + transversal `32062255294`, ambos success;
- Matrix final observada: `69/15/6/84/11`;
- suíte final da promoção: 235 arquivos / 3.300 testes verdes, TypeScript e build verdes.

F74 realiza `SingaporeBars` com denominador fixo, soma/subtração, fração imprópria e simplificação como mesma quantidade/outro nome. Diagnósticos: `soma-denominador`, `nao-simplifica`, `impropria-invalida`. A restrição especial de domínio usa `masteryDisqualifier`, sem segunda autoridade de mastery.

Não reabrir W44 sem causa nova observável.

## Seleção causal da W45

Após W44, os candidatos com prereqs servidos incluem `N6.02`, `N6.04`, `AL.08`, `PE.04` e `GM.11`; `N5.05` ainda depende de `N6.04`.

Pelo critério vigente — prereqs servidos → maior ganho imediato de desbloqueio → menor causalWave → maior downstream → desempate residual — **N6.04/F88** é a W45 porque sua promoção desbloqueia imediatamente o fallback `N5.05`.

DAG canônico:

- `N6.04` prereqs `N6.03 + N4.06`;
- `N5.05` prereqs `N5.04 + N6.04`.

## W45 — contrato regression-first

`N6.04 / F88 — Razão e Proporção`  
Primitiva canônica: `SingaporeBars`  
Faixa: F4.

Cânone F88:

1. dobrar a receita;
2. triplicar;
3. escala qualquer;
4. razão como fração;
5. regra de três.

Diagnósticos: `SOMA_EM_VEZ_DE_ESCALAR` (central), `ESCALA_UM_LADO`, `INVERTE_RAZAO`.

A interface deve tornar física a relação proporcional: as duas barras escalam juntas. Domínio `{ acertos: 3, de: 3, sessoes: 2 }`, incluindo uma escala não-inteira.

O HEAD de retomada contém o regression-first nominal e **não contém materialização F88**. O vermelho esperado é exclusivamente a ausência de N6.04/F88 no Composer/Journey/runtime. Qualquer outro vermelho é falha real.

## Próxima ação obrigatória

1. reancorar PR/HEAD/main/reviews/threads;
2. ler integralmente `PROMPT_DE_RETOMADA.md` e o checkpoint final W44;
3. classificar CI + transversal do SHA regression-first W45;
4. se o CI vermelho for exclusivamente a ausência nominal F88 e a transversal estiver verde, **não refazer o regression-first**;
5. materializar F88 completa e **inativa**: ficha, contrato/builder, kind, palco/helper físico, renderer, Radar/misconceptions, runtime map, resolução, testes e onboarding quando aplicável;
6. manter `N6.04` fora do canário e fora do ledger/Matrix de promoção;
7. exigir CI + transversal verdes no mesmo SHA inativo;
8. só então promover atomicamente canário + ledger + contrato Matrix;
9. recertificar o SHA final antes de fechar W45.

## Documentos vivos de retomada

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md` — porta operacional principal;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_FECHADA_2026-08-17.md` — último fechamento completo;
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

## Governança

- `main` intocada;
- PR #35 permanece draft/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado é aditivo;
- não apagar rationale/aliases/notas históricas;
- não relaxar testes, sondas ou Matrix;
- não misturar recibos de SHAs diferentes;
- issues #47 e #48 permanecem pós-90/90 e não interrompem W45–W50.
