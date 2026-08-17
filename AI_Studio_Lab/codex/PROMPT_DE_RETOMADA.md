# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia este arquivo integralmente antes de editar. O GitHub remoto vence memória de conversa, prompt antigo, SHA histórico ou status presumido.

## 1. Âncora remota

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch viva: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Estado curricular fechado: **W1–W44**
- W45 selecionada e aberta em regression-first: **N6.04 / F88 — Razão e Proporção**.

Antes de qualquer escrita:

1. confirme PR, branch e HEAD remoto;
2. confirme que `main` continua no SHA acima;
3. consulte reviews/threads e workflows do **SHA exato** relevante;
4. se o HEAD tiver derivado, investigue antes de editar — o remoto vence este documento;
5. nunca misture CI de SHAs diferentes nem invente recibos, contagens ou delta da Matrix.

## 2. Estado vivo e autoridades

Coverage Matrix do fechamento certificado W44:

- **69 Composer ativos**
- **15 legado**
- **6 fallback**
- **84 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Fallbacks pós-W44:

`AL.08, GM.11, N5.05, N6.02, N6.04, PE.04`.

Autoridades executáveis:

- canário: `src/curriculum/motores/composerCanaryIds.ts`
- ledger e baseline derivado: `AI_Studio_Lab/tools/coverage_matrix_core.ts`
- contrato: `src/curriculum/coverageMatrix.test.ts`
- runtime físico: `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- ficha/Composer: `src/curriculum/fichas/`
- DAG: `curriculum/grafo_saga.yaml` + artefatos gerados

Checkpoint é recibo humano; Matrix, canário, DAG, runtime e CI do SHA exato vencem o texto.

## 3. Invariantes arquiteturais

- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- **Promoção + linha nominal do ledger + contrato Matrix entram no mesmo SHA.**
- Ledger, Matrix, runtime map e canário são declarativos; nada de mutação por efeito colateral de import.
- `ficha_runtime_map.cjs`, `evidencias.ts`, `misconceptions.ts`, `constants/misconceptions.ts` e `coverage_matrix_core.ts` são cânone compartilhado **aditivo**; não apagar, condensar ou reescrever história anterior.
- Matrix observa o delta real. Baseline não pode ser relaxado para fabricar verde.
- Tag emitida pela ficha só vale se Radar/catálogo a reconhecer e houver teste nominal.
- Palco autoral não pode entregar a resposta antes da decisão da criança.
- Exposição motora alta exige alternativa por toque/snap, alvo generoso e separação entre erro motor e misconception.
- RT/velocidade não governa domínio conceitual.
- Não tocar/mergear `main`.
- Não marcar PR ready, não habilitar auto-merge.
- Não tocar Creature Engine/Tamagotchi neste fluxo.

## 4. W44 — fechamento vinculante

Competência/ficha: `N5.04 / F74 — Somar Frações`  
Primitiva canônica: `SingaporeBars`.

### 4.1 Regression-first

SHA `34b6b3a5ed3fde597564685e7b2a820c2beca0f7`:

- CI `32050560773` — `completed/failure`, vermelho nominal exclusivamente pela ausência real de `N5.04/F74`;
- transversal `32050560782` — `completed/success`;
- 3.279/3.280 testes verdes.

### 4.2 Materialização inativa

A primeira materialização `4f1f8c702e431cb9ee7b306e39eccd7c4e7e7314` expôs incompatibilidade de mutabilidade TypeScript na resolução F74; não é recibo final.

Recibo técnico inativo vinculante: `a41e6e9e6317efcec230b879722a8ae3fcafd8ae`.

- CI `32052726802` — `completed/success`;
- Certificação transversal `32052726430` — `completed/success`;
- 235 arquivos / 3.287 testes verdes;
- TypeScript, build, catálogo, fichas, conformidade, grafo, higiene e binários verdes;
- `N5.04` registrada e ainda inativa nesse SHA.

### 4.3 Promoção final

SHA final: `5da29dc4078d67f71012daf21c435be622163957` (`feat: promover W44 N5.04 F74`).

A promoção alterou **somente os três governantes**:

- `composerCanaryIds.ts` — ativa `N5.04`;
- `coverage_matrix_core.ts` — adiciona `W44-N5.04`, preservando o histórico;
- `coverageMatrix.test.ts` — reconcilia sequência/última migração/baseline.

Recibos:

- CI `32062255308` — `completed/success`;
- Certificação transversal `32062255294` — `completed/success`;
- Matrix executável observada: **69 Composer / 15 legado / 6 fallback / 84 servidas / 11 divergências**;
- Composer registrado/ativo `69/69`;
- suíte: **235 arquivos / 3.300 testes verdes**;
- TypeScript, build, auditorias, higiene, binários e sonda Sensei verdes.

**W44 está FECHADA. Não reabrir sem causa nova observável.**

## 5. F74 — contrato preservado

Escada:

1. soma com barras;
2. soma simbólica;
3. subtração;
4. fração imprópria / resultado maior que 1;
5. simplificação como **mesma quantidade, outro nome**.

Restrições:

- somente denominadores iguais em F74;
- denominador representa tamanho da parte e permanece fixo;
- `SingaporeBars` realiza fisicamente as partes sem pré-renderizar a resposta;
- diagnósticos: `soma-denominador`, `nao-simplifica`, `impropria-invalida`;
- domínio `{ acertos: 3, de: 3, sessoes: 2 }`;
- acerto imediatamente precedido por `SOMA_DENOMINADOR` na mesma questão/sessão continua correto para a missão, mas não recebe crédito de mastery; a implementação reutiliza `masteryDisqualifier`.

## 6. Seleção causal da W45

Critério vivo:

1. prereqs servidos;
2. maior ganho imediato de desbloqueio;
3. menor `causalWave`;
4. maior downstream;
5. ID / menor delta estrutural como desempate residual.

Após a Matrix W44 `69/15/6/84/11`, os fallbacks são:

`AL.08, GM.11, N5.05, N6.02, N6.04, PE.04`.

DAG relevante:

- `N6.02` prereqs `N6.01 + N3.11 + N3.12` — elegível;
- `N6.04` prereqs `N6.03 + N4.06` — elegível;
- `AL.08` prereqs `AL.07 + N7.02` — elegível;
- `PE.04` prereqs `PE.03 + N6.03` — elegível;
- `GM.11` prereqs `GM.09 + N4.02` — elegível;
- `N5.05` prereqs `N5.04 + N6.04` — ainda bloqueada por `N6.04`.

**Seleção W45: `N6.04 / F88 — Razão e Proporção`.**

Rationale: entre os elegíveis, N6.04 tem ganho imediato de desbloqueio porque sua promoção torna `N5.05` elegível. Não copiar fila antiga; após W45, recalcular novamente.

## 7. Contrato canônico F88 — vinculante para W45

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`.

Identidade:

- competência: `N6.04 — razão e proporcionalidade`;
- ficha: `F88 — Razão e Proporção`;
- primitiva: `SingaporeBars`;
- faixa: F4;
- prereqs DAG: `N6.03 + N4.06`.

Fundamento:

- duas quantidades podem crescer juntas mantendo a relação;
- erro central: **somar em vez de escalar**;
- imagem causal: duas barras que escalam juntas;
- se a criança tenta mudar só uma, a outra acompanha; a relação proporcional deve ser fisicamente imposta pela interface, não apenas escrita em texto.

Cinco níveis:

1. dobrar a receita;
2. triplicar;
3. escala qualquer;
4. razão como fração;
5. regra de três.

Diagnósticos canônicos:

- `SOMA_EM_VEZ_DE_ESCALAR` — erro central;
- `ESCALA_UM_LADO`;
- `INVERTE_RAZAO`.

Falas canônicas:

- howto: “Se um dobra, o outro dobra também. Eles crescem juntos.”
- explain: “Olhe as barras: elas mantêm a mesma proporção sempre.”

Domínio:

- `{ acertos: 3, de: 3, sessoes: 2 }`;
- deve incluir pelo menos uma **escala não-inteira**.

Regras transversais continuam valendo: erro motor não vira misconception, touch/snap generoso quando houver gesto, resolução não compra mastery, resposta não pode vazar, reduced motion/acessibilidade devem preservar o conceito.

## 8. W45 — regression-first já aberto

O HEAD de retomada contém `src/curriculum/razaoProporcaoW45.test.ts` e **não contém a materialização F88**.

O contrato regression-first exige, após a futura materialização:

- N6.04 sai do fallback somente quando a ficha existir;
- registro Composer real;
- kind especializado `razao-proporcao-f88`;
- modos `dobrar → triplicar → escala-geral → razao-fracao → regra-de-tres`;
- `SingaporeBars` como primitiva física;
- barras vinculadas/escala conjunta;
- domínio 3/3×2 com escala não-inteira;
- tags runtime `soma-em-vez-de-escalar`, `escala-um-lado`, `inverte-razao` reconhecidas pelo Radar;
- resolução sem fallback e semanticamente alinhada aos cinco níveis.

### Estado esperado do regression-first

A primeira ação da próxima conversa é conferir os workflows do HEAD exato.

O vermelho esperado do CI é **somente** `razaoProporcaoW45.test.ts` falhando porque `JOURNEY_FICHAS.find(item => item.id === "N6.04")` ainda é `undefined` / F88 ainda não existe no Composer.

A Certificação transversal deve permanecer verde. Qualquer outro vermelho é falha real e deve ser investigado antes de materializar.

**Não “consertar” o regression-first relaxando expectativa.**

## 9. Próxima ação autorizada — materialização INATIVA W45

Somente depois de classificar corretamente o regression-first:

1. materializar `N6.04/F88` completa e **inativa**;
2. criar ficha Jornada, contrato/builder, kind, palco/helper especializado quando necessário, renderer/wiring, resolução, Radar/misconceptions e testes;
3. realizar fisicamente `SingaporeBars` com duas quantidades vinculadas por um mesmo fator de escala;
4. preservar os cinco níveis e uma escala não-inteira real;
5. não transformar a regra de três em decoreba cruzada sem relação visível;
6. manter `N6.04` fora de `DEFAULT_COMPOSER_CANARY_IDS`;
7. não adicionar `W45-N6.04` ao ledger nem mudar baseline de promoção enquanto inativa;
8. atualizar `ficha_runtime_map.cjs` antes da promoção se houver kind/builder/stage novo;
9. registrar novas tags no Radar/cânone de forma aditiva antes da promoção;
10. auditar resposta vazando, diversidade, resolução, domínio, onboarding, acessibilidade e filtro motor;
11. publicar SHA inativo e exigir **CI + Certificação transversal completed/success no mesmo SHA**;
12. só então promover atomicamente canário + ledger + contrato Matrix;
13. aceitar o delta real da Matrix, nunca um número presumido;
14. recertificar o SHA final e só então fechar W45;
15. recalcular DAG/Matrix para W46.

Se apenas a ativação de N6.04 mudar, o delta teórico seria `70 Composer / 15 legado / 5 fallback / 85 servidas / 11 divergências`, mas **não force esse número**; a Matrix executável é a autoridade.

## 10. Cadência e serialização

- Uma onda por vez.
- Não escrever a próxima onda enquanto o SHA relevante da atual não tiver o portão exigido.
- Fechamento documental da onda N + regression-first da onda N+1 entram no mesmo ciclo quando não houver bloqueio real.
- Regression-first vermelho por design não substitui o recibo técnico verde da onda anterior.
- Recalcular a fila após cada promoção; não perpetuar previsão como verdade.

## 11. Documentos de continuidade

Ler quando necessário:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_INATIVA_CERTIFICADA_2026-08-17.md` — histórico do portão inativo
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W43_N4_12_F71_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

Issues `#47` e `#48` continuam pós-90/90 e **não interrompem W45–W50**.

## 12. Restrições absolutas

- PR #35: open + draft + unmerged.
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.
- Sem auto-merge/ready.
- Sem Creature Engine/Tamagotchi.
- Sem apagar rationale/aliases/notas do cânone.
- Sem enfraquecer testes, sondas, Matrix ou auditores.
- Sem baseline para mascarar deriva.
- Sem misturar recibos de SHAs distintos.
- Sem inventar resultado de workflow que ainda não terminou.

**Resumo operacional:** W44/F74 está fechada no recibo final `5da29dc…`, Matrix `69/15/6/84/11`. W45 é N6.04/F88 e o HEAD de retomada abre seu regression-first nominal. A próxima conversa deve classificar esse vermelho e, se ele for exclusivamente a ausência F88, materializar N6.04 completa e inativa sem ativar canário nem ledger.