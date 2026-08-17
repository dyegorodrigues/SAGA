# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 17/08/2026 — W45 fechada; W46/AL.08/F90 em regression-first VALIDADO  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer **draft + open + unmerged**  
**Base protegida:** `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

> Índice vivo. Para executar trabalho, leia primeiro `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`; histórico detalhado fica nos checkpoints e no Git.

## Estado atual

- Ondas **W1–W45 fechadas**.
- Último SHA técnico final certificado: `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`.
- W46 = `AL.08 / F90 — Equações`.
- Regression-first W46 validado no SHA `d68edc718f4bcaa53da66a58e87e680450ea2d0c`.
- Matrix real preservada: **70 Composer / 15 legado / 5 fallback / 85 servidas / 11 divergências**.
- 90 competências / 94 fichas autorais.
- `modeSwaps=12` · `toolIntroductions=44`.
- primitiva autoral ainda ausente: `Moedas`.

Fallbacks reais:

`AL.08, GM.11, N5.05, N6.02, PE.04`.

## Último fechamento completo — W45 N6.04/F88

Cadeia vinculante:

- regression-first `3bb4b71316725da0f9d81ef41e86f8ecdb68c3d3`: CI `32063476029` failure nominal + transversal `32063475999` success;
- primeira materialização inativa `27c3f8409213c10bfe2baf588e3498b08ff3d5df`: encontrou falha real P13 e **não foi promovida**;
- inativo final reparado `fd93358b42d3b8cb791a4048c11f7b5a5479f4e5`: CI `32074518557` + transversal `32074518604`, ambos success;
- promoção final `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`: somente canário N6.04 + ledger W45-N6.04 + contrato Matrix;
- CI final `32075578757` + transversal final `32075578696`, ambos success;
- Matrix observada `70/15/5/85/11`.

**W45 está fechada. Não reabrir sem causa nova observável.**

Checkpoint: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`.

## W46 regression-first — VALIDADO

Commit:

`d68edc718f4bcaa53da66a58e87e680450ea2d0c` — `test: fechar W45 e abrir W46 regression-first`.

Recibos:

- CI `32076649252` — `completed/failure` nominal;
- Certificação transversal `32076649256` — `completed/success`;
- auditorias, fichas, conformidade, grafo/DAG e TypeScript verdes;
- Sensei, higiene e binários verdes;
- único vermelho: `src/curriculum/equacoesW46.test.ts`;
- falha exata: `JOURNEY_FICHAS.find(item => item.id === "AL.08")` retorna `undefined`;
- suíte: **238 arquivos / 3.323 testes; 237 arquivos e 3.322 testes passam; 1 teste falha**;
- Matrix continua `70/15/5/85/11`.

Conclusão: o vermelho prova exclusivamente a ausência real de AL.08/F90. **Não refazer nem relaxar o regression-first.**

## Contrato W46/F90

- competência `AL.08 — Equações do 1º grau`;
- primitiva `Balanca`;
- prereqs `AL.07 + N7.02`;
- níveis: `x+3=8` → `x-2=5` → `2x=10` → `2x+1=9` → `x+5=2x+1`;
- princípio: operação em um lado precisa ser aplicada ao outro para preservar equilíbrio;
- misconceptions: `QUEBRA_EQUILIBRIO`, `OPERACAO_INVERSA_ERRADA`, `NAO_APLICA_AOS_DOIS`, `RESPONDE_O_TODO`;
- tags runtime: `quebra-equilibrio`, `operacao-inversa-errada`, `nao-aplica-aos-dois`, `responde-o-todo`;
- domínio `{ acertos: 4, de: 4, sessoes: 3 }`, incluindo ao menos um L3 ou acima;
- resolução causal: identificar operação → inversa → aplicar aos dois lados → isolar x → concluir aritmética;
- sem primitiva paralela; herdar linguagem visual de F46;
- toque/alvos ≥80px, arrasto não obrigatório, erro motor separado, RT fora da autoridade conceitual.

Contrato executável: `src/curriculum/equacoesW46.test.ts`.

## Próxima ação obrigatória

1. **não** refazer W46 regression-first;
2. materializar `AL.08/F90` completa e **INATIVA**;
3. criar ficha Journey, contrato/builder, kind `equacoes-f90`, palco/helper reutilizando `Balanca`, renderer/wiring, resolução, Radar/misconceptions, evidência P13 de L3+ quando aplicável, runtime map, answer policy e testes;
4. manter `AL.08` fora do canário e `W46-AL.08` fora do ledger/Matrix enquanto inativa;
5. não antecipar baseline nem declarar AL.08 servida;
6. exigir CI + transversal verdes no mesmo SHA inativo;
7. só então promover atomicamente canário + ledger + contrato Matrix;
8. Matrix executável observa o delta real; expectativa teórica `71/15/4/86/11` só vale se o runtime confirmar;
9. recertificar o SHA final e somente então fechar W46;
10. recalcular W47 pelo estado real.

## Governança

- `main` intocada;
- PR #35 draft/open/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado aditivo;
- não relaxar testes, sondas, P13 ou Matrix;
- não misturar recibos entre SHAs;
- issues #47/#48 continuam pós-90/90 e não interrompem W46–W50.