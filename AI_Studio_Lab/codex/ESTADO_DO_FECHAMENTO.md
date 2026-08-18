# Estado do Fechamento Curricular — SAGA

**Última atualização operacional:** 18/08/2026 — W46/AL.08/F90 fechada; W47/N6.02/F76 regression-first validado; materialização inativa autorizada  
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
- W47 = `N6.02 / F76 — Contas com Vírgula` — regression-first **VALIDADO**.
- Recibo regression-first W47: `073bfab1469aeb86bdc0c3376634cba559880961`.
- CI W47 regression-first `32095359960` — `completed/failure nominal` exclusivo da ausência F76.
- Certificação transversal W47 regression-first `32095359969` — `completed/success`, 9/9.
- Matrix real preservada: **71 Composer / 15 legado / 4 fallback / 86 servidas / 11 divergências**.
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

## W47 regression-first — recibo vinculante

SHA `073bfab1469aeb86bdc0c3376634cba559880961` — `test: fechar W46 e abrir W47 regression-first`.

- CI `32095359960` — `completed/failure nominal`;
- Certificação transversal `32095359969` — `completed/success`, 9/9;
- Sonda real Sensei, higiene e binários — success;
- catálogo, fichas, conformidade, DAG e TypeScript — success;
- Matrix preservada `71/15/4/86/11`;
- 240 arquivos / 3.348 testes: 239 arquivos e 3.347 testes passam; **1 teste falha**;
- único vermelho: `src/curriculum/contasVirgulaW47.test.ts`;
- erro: `expected undefined to be defined` em `:23`, pois `JOURNEY_FICHAS.find(item => item.id === "N6.02")` retorna `undefined`.

Classificação: **regression-first válido**. A falha prova somente a ausência real de N6.02/F76. Não rerodar para fabricar verde e não relaxar o contrato.

Checkpoint: `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W47_N6_02_F76_REGRESSION_FIRST_2026-08-18.md`.

## Próxima ação obrigatória

1. materializar `N6.02/F76` completa e **INATIVA**;
2. manter N6.02 fora do canário e W47 fora do ledger/Matrix enquanto inativa;
3. preservar mastery, evidência L2, misconceptions, resolução causal, acessibilidade e RT fora da autoridade conceitual;
4. exigir CI + transversal verdes no mesmo SHA inativo;
5. só então promover atomicamente canário + ledger + contrato Matrix;
6. recertificar e recalcular W48 pelo estado real.

## Pós-90/90 — governança já preservada

- Issue #47: **Integração Sistêmica e Child-Ready — roadmap autoritativo de fechamento**. `90/90 servido` não equivale a produto pronto para criança.
- Issue #48: **registro vivo de lacunas microcurriculares/microprogressão**. A hipótese `GM.06/F62 — segundos?` está corretamente classificada como `CANDIDATA`, não dívida provada.
- Essas frentes não interrompem W47–W50; entram em uso forte após `fallback=0` e fechamento da última onda.

## Governança

- `main` intocada;
- PR #35 draft/open/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado aditivo;
- não relaxar testes, sondas, P13 ou Matrix;
- não misturar recibos entre SHAs.
