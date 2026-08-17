# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia integralmente antes de editar. GitHub remoto, gates executáveis, DAG, canário e Matrix do SHA exato vencem memória, prompt antigo ou checkpoint.

## 1. Âncora remota

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Estado curricular fechado: **W1–W45**
- Último SHA técnico final certificado: `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`
- Fase operacional atual: **W46 · AL.08/F90 — Equações · regression-first VALIDADO**
- Recibo regression-first W46: `d68edc718f4bcaa53da66a58e87e680450ea2d0c`

Antes de qualquer escrita:

1. confirme PR, branch, HEAD e base remotos;
2. confirme que `main` continua no SHA acima;
3. consulte workflows, reviews e review threads do SHA relevante;
4. se houver deriva, investigue antes de editar — o remoto vence este arquivo;
5. nunca misture recibos entre SHAs nem invente contagens ou delta da Matrix.

Uma reconciliação exclusivamente documental pode existir depois de `d68edc…`; isso **não invalida** o recibo regression-first W46. Não refaça o regression-first sem causa nova observável.

## 2. Estado vivo pós-W45

Coverage Matrix executável final W45 e preservada no regression-first W46:

- **70 Composer**
- **15 legado**
- **5 fallback**
- **85 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Fallbacks reais:

`AL.08, GM.11, N5.05, N6.02, PE.04`.

Autoridades:

- canário: `src/curriculum/motores/composerCanaryIds.ts`
- ledger/baseline: `AI_Studio_Lab/tools/coverage_matrix_core.ts`
- contrato Matrix: `src/curriculum/coverageMatrix.test.ts`
- runtime físico: `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- ficha/Composer: `src/curriculum/fichas/`
- DAG: `curriculum/grafo_saga.yaml` + artefatos gerados

Checkpoint é recibo humano; fontes executáveis vencem texto.

## 3. Invariantes arquiteturais

- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente pelo array declarativo do canário.
- **Canário + ledger nominal + contrato Matrix entram no mesmo SHA de promoção.**
- Ledger, Matrix, runtime map e canário são declarativos; sem mutação por efeito colateral de import.
- `ficha_runtime_map.cjs`, `evidencias.ts`, catálogos de misconceptions e `coverage_matrix_core.ts` são cânone compartilhado **aditivo**; não apagar, condensar ou reescrever história anterior.
- Matrix observa o delta real; baseline não pode fabricar verde.
- Tag emitida só vale se Radar/catálogo reconhecer e houver teste nominal.
- Evidência de domínio deve pertencer ao catálogo central e ter emissor auditável; resposta errada não emite domínio.
- Palco autoral não pode entregar resposta antes da decisão.
- Exposição motora alta exige toque/snap equivalente, alvo generoso e separação erro motor × misconception.
- RT não governa domínio conceitual.
- Não tocar/mergear `main`; não marcar PR ready; não habilitar auto-merge; não tocar Creature Engine/Tamagotchi.

## 4. W45 — N6.04/F88 FECHADA

Regression-first:

- SHA `3bb4b71316725da0f9d81ef41e86f8ecdb68c3d3`;
- CI `32063476029` failure nominal só por N6.04 ausente;
- transversal `32063475999` success.

Primeira materialização inativa:

- SHA `27c3f8409213c10bfe2baf588e3498b08ff3d5df`;
- expôs falha real P13: evidência não-inteira emitida sem catálogo central/emissor puro;
- **não é recibo inativo final e não foi promovida**.

Inativo reparado e vinculante:

- SHA `fd93358b42d3b8cb791a4048c11f7b5a5479f4e5`;
- CI `32074518557` success;
- transversal `32074518604` success 9/9;
- N6.04 ainda inativa nesse SHA.

Promoção atômica final:

- SHA `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`;
- exatamente três governantes: canário N6.04 + ledger W45-N6.04 + contrato Matrix;
- CI `32075578757` — `completed/success`;
- transversal `32075578696` — `completed/success`, 9/9;
- Matrix real: **70/15/5/85/11**.

**W45 está FECHADA. Não reabrir F88 sem causa nova observável.**

Checkpoint detalhado:

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`.

## 5. Seleção causal W46

Critério vivo:

1. prereqs servidos;
2. maior ganho imediato de desbloqueio;
3. menor `causalWave`;
4. maior downstream;
5. ID / menor delta estrutural como desempate residual.

Após W45, todos os cinco fallbacks têm prereqs servidos:

- `AL.08` ← `AL.07 + N7.02`;
- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `PE.04` ← `PE.03 + N6.03`;
- `N5.05` ← `N5.04 + N6.04`.

Nenhum destrava outro fallback restante imediatamente. `AL.08` e `N6.02` empatam na menor onda causal relevante; o desempate residual favorece `AL.08`, que reutiliza a `Balanca` e a linguagem visual já introduzida em F46.

**W46 = `AL.08 / F90 — Equações`.**

Não perpetuar fila prevista depois da próxima promoção: recalcular novamente.

## 6. W46 regression-first — VALIDADO, NÃO REFAZER

Commit de fechamento documental W45 + regression-first W46:

`d68edc718f4bcaa53da66a58e87e680450ea2d0c` — `test: fechar W45 e abrir W46 regression-first`.

O commit não materializa F90 e não antecipa runtime, canário, ledger ou baseline.

Recibos:

- Certificação transversal `32076649256` — **completed/success**;
- CI `32076649252` — **completed/failure nominal**;
- auditoria do catálogo: success;
- fichas/conformidade: success;
- DAG/grafo: success;
- TypeScript: success;
- Sonda real Sensei: success;
- higiene: success;
- binários: success;
- somente a etapa `Testes` do Gates ficou vermelha.

Suíte:

- **238 arquivos**;
- **3.323 testes**;
- **237 arquivos / 3.322 testes passam**;
- **1 arquivo / 1 teste falha**.

Único vermelho:

`src/curriculum/equacoesW46.test.ts`

Falha exata:

`JOURNEY_FICHAS.find(item => item.id === "AL.08")` retorna `undefined` e a expectativa `toBeDefined()` falha.

Coverage Matrix no mesmo run continua **70/15/5/85/11** e os fallbacks continuam `AL.08, GM.11, N5.05, N6.02, PE.04`.

Conclusão: o vermelho prova **exclusivamente a ausência real de AL.08/F90**. Não existe falha lateral aberta no recibo W46. **Não rerodar, não relaxar e não reescrever o regression-first.**

## 7. Contrato canônico F90 — vinculante

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`.

Identidade:

- competência: `AL.08 — Equações do 1º grau`;
- ficha: `F90 — Equações`;
- primitiva: `Balanca`;
- prereqs DAG: `AL.07 + N7.02`;
- linguagem visual herdada de F46; **não criar primitiva paralela**.

Fundamento:

- equação é equilíbrio;
- operação aplicada a um lado precisa ser aplicada ao outro;
- imagem causal: balança com incógnita/saco fechado, removendo/adicionando/dividindo igualmente nos dois pratos;
- não substituir compreensão por “passa para o outro lado trocando o sinal”.

Cinco níveis:

1. `x + 3 = 8` — remover igualmente dos dois lados;
2. `x - 2 = 5` — operação inversa;
3. `2x = 10` — dividir ambos os lados;
4. `2x + 1 = 9` — dois passos;
5. `x + 5 = 2x + 1` — incógnita nos dois lados.

Misconceptions canônicas:

- `QUEBRA_EQUILIBRIO`;
- `OPERACAO_INVERSA_ERRADA`;
- `NAO_APLICA_AOS_DOIS`;
- `RESPONDE_O_TODO`.

Tags runtime esperadas no Radar:

- `quebra-equilibrio`;
- `operacao-inversa-errada`;
- `nao-aplica-aos-dois`;
- `responde-o-todo`.

Domínio:

- `{ acertos: 4, de: 4, sessoes: 3 }`;
- incluir pelo menos um caso do **L3 (coeficiente) ou acima**;
- essa condição deve produzir evidência executável, não texto morto.

Resolução:

1. identificar a operação envolvendo x;
2. escolher a operação inversa;
3. aplicar aos dois lados;
4. isolar x;
5. concluir a aritmética restante.

Não revelar x antes da decisão; resolução assistida não compra mastery independente.

Acessibilidade/motor:

- alvos ≥80px nas ações autorais;
- alternativa por toque; arrasto não obrigatório;
- erro motor separado de misconception;
- RT fora da autoridade conceitual.

O contrato executável já existente é `src/curriculum/equacoesW46.test.ts`. Preserve-o.

## 8. Próxima ação autorizada — MATERIALIZAÇÃO INATIVA F90

A primeira ação de desenvolvimento agora é **materializar `AL.08/F90` completa e INATIVA**.

A materialização deve incluir, conforme a arquitetura exigir:

- ficha Journey AL.08/F90;
- contrato/builder especializado;
- kind `equacoes-f90`;
- palco/helper reutilizando `Balanca`;
- representação física do equilíbrio, com equação espelhada;
- renderer/wiring;
- resolução causal por nível;
- Radar/misconceptions;
- evidência P13 de L3+ com emissor auditável, se necessário;
- runtime map;
- answer policy;
- testes nominais, físicos, acessibilidade e filtro motor;
- onboarding somente se houver mudança real de linguagem visual.

Enquanto inativa:

- **NÃO** adicionar `AL.08` a `DEFAULT_COMPOSER_CANARY_IDS`;
- **NÃO** adicionar `W46-AL.08` ao ledger;
- **NÃO** mudar baseline da Matrix para antecipar promoção;
- **NÃO** declarar AL.08 servida;
- runtime map, Radar e evidências novas devem ser reconciliados ainda nesta fase.

Audite antes de publicar o SHA inativo:

- os cinco níveis canônicos;
- equilíbrio físico real;
- operação nos dois lados;
- caso L3+ como evidência de domínio;
- quatro misconceptions;
- resolução sem vazamento;
- mastery 4/4×3;
- diversidade suficiente;
- acessibilidade ≥80px;
- toque alternativo / sem arrasto obrigatório;
- erro motor separado;
- RT fora da autoridade conceitual.

Depois publique **um SHA inativo** e exija no mesmo SHA:

- CI `completed/success`;
- Certificação transversal `completed/success`.

Somente com os dois verdes promova W46 atomicamente:

1. canário `AL.08`;
2. ledger `W46-AL.08`;
3. contrato Matrix.

A Matrix executável observa o delta real. Se só a ativação mudar, a expectativa teórica é `71/15/4/86/11`, mas **não force esse número**.

Depois da promoção:

- CI final + transversal final no mesmo SHA;
- somente então declarar W46 fechada;
- checkpoint final;
- reconciliar porta/estado/PR;
- recalcular DAG/Matrix;
- escolher W47 pelo estado real;
- fechamento documental W46 + regression-first W47 no mesmo ciclo quando seguro.

## 9. Cadência e governança

- Uma onda por vez; não escrever a seguinte enquanto o portão exigido estiver vivo.
- Regression-first vermelho por design não substitui recibo técnico verde da onda anterior.
- Issues #47 e #48 continuam obrigatórias na transição pós-90/90, mas não interrompem W46–W50.
- Não usar baseline para fabricar verde.
- Não inventar recibos nem misturar SHAs.
- Cânone compartilhado é aditivo.

## 10. Documentos de continuidade

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

`RETOMADA.md` é deliberadamente uma ponte atemporal para esta porta e não deve duplicar estado curricular.