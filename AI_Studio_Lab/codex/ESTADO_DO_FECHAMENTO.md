# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 18/08/2026 — W46/AL.08/F90 fechada; W47/N6.02/F76 selecionada para regression-first  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer **draft + open + unmerged**  
**Base protegida:** `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

> Índice vivo. Para executar trabalho, leia primeiro `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`; histórico detalhado fica nos checkpoints e no Git.

## Estado atual

- Ondas **W1–W46 fechadas**.
- Último SHA técnico final certificado: `c2cf5b29639ce5a13d9d190ed312cad4df797dac`.
- W46 = `AL.08 / F90 — Equações` — **FECHADA**.
- CI final W46 `32094469085` — `completed/success`.
- Certificação transversal final W46 `32094469058` — `completed/success`, 9/9.
- Matrix real: **71 Composer / 15 legado / 4 fallback / 86 servidas / 11 divergências**.
- 90 competências / 94 fichas autorais.
- `modeSwaps=12` · `toolIntroductions=44`.
- primitiva autoral ainda ausente: `Moedas`.

Fallbacks reais:

`GM.11, N5.05, N6.02, PE.04`.

## W46 — fechamento vinculante

Cadeia principal:

- regression-first `d68edc718f4bcaa53da66a58e87e680450ea2d0c`: CI `32076649252` failure nominal + transversal `32076649256` success;
- materialização inativa `f3c7c4d4e044fd275bee0e5f6985497fd2c20ced`: CI `32085678926` + transversal `32085678976`, ambos success;
- promoção atômica `d4c22e59c2e600570c705f9d0a46ff9cc38c9630`: somente canário AL.08 + ledger W46 + contrato Matrix; transversal `32086538164` success e CI `32086538316` failure real;
- causa do vermelho: F90 tinha 5 opções por tela, violando o teto universal de 4; promoção não era a causa;
- reparos preservaram o gate e os contratos de retry/mastery; nenhum teste foi relaxado;
- SHA técnico final `c2cf5b29639ce5a13d9d190ed312cad4df797dac`: CI `32094469085` + transversal `32094469058`, ambos success.

Matrix observada no SHA final: `71/15/4/86/11`.

Checkpoint: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W46_AL_08_F90_FECHADA_2026-08-18.md`.

**W46 está fechada. Não reabrir sem causa nova observável.**

## Seleção W47

No DAG remoto atual todos os quatro fallbacks restantes têm prereqs servidos:

- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `N5.05` ← `N5.04 + N6.04`;
- `PE.04` ← `PE.03 + N6.03`.

Nenhum destrava outro fallback restante imediatamente. O recálculo anterior tinha `AL.08` e `N6.02` empatados na menor `causalWave`; W46 não alterou o DAG e removeu apenas AL.08 do conjunto de fallback. Revalidado contra o remoto pós-W46, o próximo candidato é:

**W47 = `N6.02 / F76 — Contas com Vírgula`.**

## Contrato W47/F76

- competência `N6.02 — operações com decimais`;
- ficha `F76 — Contas com Vírgula`;
- primitivas `InteractiveVertical + Quadrado100`;
- prereqs `N6.01 + N3.11 + N3.12`;
- princípio: alinhar a vírgula como eixo de valor posicional, não os dígitos da direita;
- níveis: mesmas casas → casas diferentes/zeros → subtração → reagrupamento → ×10/×100;
- misconceptions: `ALINHA_PELA_DIREITA`, `IGNORA_ZEROS`, `VIRGULA_PERDIDA`;
- domínio `{ acertos: 3, de: 3, sessoes: 2 }`, incluindo um L2 de casas diferentes;
- resolução deve ensinar valor posicional, zeros de preenchimento e preservação da vírgula no resultado;
- RT fora da autoridade conceitual; resolução assistida não compra mastery independente.

Regression-first: `src/curriculum/contasVirgulaW47.test.ts`.

## Próxima ação obrigatória

1. publicar e classificar o regression-first W47 sem materializar F76;
2. o vermelho nominal esperado é somente `JOURNEY_FICHAS.find(item => item.id === "N6.02")` retornando `undefined`;
3. não relaxar o teste;
4. depois, materializar `N6.02/F76` completa e **INATIVA**;
5. manter N6.02 fora do canário e W47 fora do ledger/Matrix enquanto inativa;
6. exigir CI + transversal verdes no mesmo SHA inativo;
7. só então promover atomicamente canário + ledger + contrato Matrix;
8. recertificar e recalcular W48 pelo estado real.

## Governança

- `main` intocada;
- PR #35 draft/open/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado aditivo;
- não relaxar testes, sondas, P13 ou Matrix;
- não misturar recibos entre SHAs;
- issues #47/#48 continuam pós-90/90 e não interrompem W47–W50.
