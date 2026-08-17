# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 17/08/2026 — W45 fechada; W46/AL.08/F90 selecionada para regression-first  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer **draft + open + unmerged**  
**Base protegida:** `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

> Índice vivo. Para executar trabalho, leia primeiro `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`; histórico detalhado fica nos checkpoints e no Git.

## Estado atual

- Ondas **W1–W45 fechadas**.
- Último SHA final certificado: `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`.
- W46 = `AL.08 / F90 — Equações`.
- Matrix real pós-W45: **70 Composer / 15 legado / 5 fallback / 85 servidas / 11 divergências**.
- 90 competências / 94 fichas autorais.
- `modeSwaps=12` · `toolIntroductions=44`.
- primitiva autoral ainda ausente: `Moedas`.

Fallbacks pós-W45:

`AL.08, GM.11, N5.05, N6.02, PE.04`.

## Último fechamento completo — W45 N6.04/F88

Cadeia vinculante:

- regression-first `3bb4b71316725da0f9d81ef41e86f8ecdb68c3d3`: CI `32063476029` failure nominal + transversal `32063475999` success;
- primeira materialização inativa `27c3f8409213c10bfe2baf588e3498b08ff3d5df`: encontrou falha real P13 na integração da evidência não-inteira e **não foi promovida**;
- inativo final reparado `fd93358b42d3b8cb791a4048c11f7b5a5479f4e5`: CI `32074518557` + transversal `32074518604`, ambos success;
- promoção atômica final `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`: somente canário N6.04 + ledger W45-N6.04 + contrato Matrix;
- CI final `32075578757` + transversal final `32075578696`, ambos success;
- Matrix observada `70/15/5/85/11`.

F88 reutiliza `SingaporeBars` com duas barras vinculadas por um único fator: dobrar → triplicar → escala geral → razão como fração → regra de três. Escala não-inteira pertence ao catálogo P13 e ao mesmo emissor usado no runtime. Tags `soma-em-vez-de-escalar`, `escala-um-lado`, `inverte-razao`; mastery `3/3` em 2 sessões; resposta sem vazamento; RT não governa domínio.

Não reabrir W45 sem causa nova observável.

Checkpoint: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`.

## Seleção causal da W46

Critério: prereqs servidos → maior ganho imediato de desbloqueio → menor causalWave → maior downstream → desempate residual.

Após W45, todos os cinco fallbacks restantes estão elegíveis. Nenhum destrava outro fallback imediatamente. `AL.08` e `N6.02` empatam na menor onda causal relevante; o desempate residual favorece `AL.08`, que ainda reutiliza a `Balanca` existente de F46.

**W46 = `AL.08 / F90 — Equações`.**

DAG: `AL.08` depende de `AL.07 + N7.02`, ambos servidos.

## Contrato W46/F90

- primitiva `Balanca`;
- níveis: `x+3=8` → `x-2=5` → `2x=10` → `2x+1=9` → `x+5=2x+1`;
- princípio: operação em um lado precisa ser aplicada ao outro para preservar equilíbrio;
- misconceptions: `QUEBRA_EQUILIBRIO`, `OPERACAO_INVERSA_ERRADA`, `NAO_APLICA_AOS_DOIS`, `RESPONDE_O_TODO`;
- tags runtime esperadas: `quebra-equilibrio`, `operacao-inversa-errada`, `nao-aplica-aos-dois`, `responde-o-todo`;
- domínio `{ acertos: 4, de: 4, sessoes: 3 }`, incluindo ao menos um L3 ou acima;
- resolução: identificar operação → inversa → aplicar aos dois lados → isolar x → concluir aritmética;
- sem primitiva paralela; herdar linguagem visual de F46;
- toque/alvos generosos, arrasto não obrigatório, erro motor separado, RT fora da autoridade conceitual.

## Próxima ação obrigatória

1. publicar/classificar `src/curriculum/equacoesW46.test.ts` **sem materializar F90**;
2. vermelho nominal esperado: `JOURNEY_FICHAS.find(item => item.id === "AL.08")` ainda `undefined`;
3. transversal deve permanecer verde; qualquer outro vermelho é falha real;
4. depois, materializar AL.08/F90 completa e inativa;
5. manter AL.08 fora do canário e W46 fora do ledger/Matrix enquanto inativa;
6. exigir CI + transversal verdes no mesmo SHA inativo;
7. só então promover atomicamente canário + ledger + contrato Matrix;
8. recertificar e recalcular W47.

## Governança

- `main` intocada;
- PR #35 draft/open/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado aditivo;
- não relaxar testes, sondas, P13 ou Matrix;
- não misturar recibos entre SHAs;
- issues #47/#48 continuam pós-90/90 e não interrompem W46–W50.
