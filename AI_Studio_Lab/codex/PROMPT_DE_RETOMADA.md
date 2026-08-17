# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia integralmente antes de editar. GitHub remoto, gates executáveis, DAG, canário e Matrix do SHA exato vencem memória, prompt antigo ou checkpoint.

## 1. Âncora remota

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Estado curricular fechado: **W1–W45**
- Último SHA final certificado: `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`
- W46 selecionada: **AL.08 / F90 — Equações**

Antes de qualquer escrita:

1. confirme PR, branch, HEAD e base remotos;
2. confirme que `main` continua no SHA acima;
3. consulte workflows, reviews e review threads do SHA relevante;
4. se houver deriva, investigue antes de editar — o remoto vence este arquivo;
5. nunca misture recibos entre SHAs nem invente contagens ou delta da Matrix.

## 2. Estado vivo pós-W45

Coverage Matrix executável final W45:

- **70 Composer**
- **15 legado**
- **5 fallback**
- **85 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Fallbacks pós-W45:

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

## 4. W44 — não reabrir

W44 `N5.04/F74 — Somar Frações` permanece fechada. Recibo final:

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_FECHADA_2026-08-17.md`.

Promoção final W44 `5da29dc4078d67f71012daf21c435be622163957`, CI `32062255308` + transversal `32062255294`, ambos success. Não reabrir sem causa nova observável.

## 5. W45 — N6.04/F88 FECHADA

Regression-first preservado:

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
- evidência `escala-nao-inteira-f88` integrada ao catálogo P13 e ao mesmo emissor puro usado no runtime;
- N6.04 ainda inativa nesse SHA.

Promoção atômica final:

- SHA `b6f9ecc24f5d1d08dc25df35b737fcbd71a5123b`;
- parent `fd93358b42d3b8cb791a4048c11f7b5a5479f4e5`;
- compare remoto: **1 commit / exatamente 3 arquivos** — canário N6.04 + ledger W45-N6.04 + contrato Matrix;
- CI `32075578757` — `completed/success`;
- transversal `32075578696` — `completed/success`, 9/9;
- Matrix real: **70/15/5/85/11**.

**W45 está FECHADA. Não reabrir F88 sem causa nova observável.**

Checkpoint detalhado:

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`.

## 6. F88 — contrato preservado

- prereqs `N6.03 + N4.06`;
- primitiva `SingaporeBars`;
- níveis: dobrar → triplicar → escala geral → razão como fração → regra de três;
- duas barras derivadas pelo **mesmo fator**; sem controle independente;
- escala não-inteira como evidência P13;
- tags `soma-em-vez-de-escalar`, `escala-um-lado`, `inverte-razao`;
- mastery `3/3` em 2 sessões;
- resolução causal, sem multiplicação cruzada decorada como substituto de compreensão;
- correção após erro conceitual não compra mastery independente;
- RT fora da autoridade conceitual.

## 7. Seleção causal W46

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

Nenhum deles destrava outro fallback restante imediatamente. `AL.08` e `N6.02` empatam na menor onda causal relevante e não possuem downstream fallback útil; o desempate residual favorece `AL.08`. F90 ainda reutiliza a primitiva existente `Balanca` e a linguagem visual já introduzida por F46.

**W46 = `AL.08 / F90 — Equações`.**

Não perpetuar essa fila como previsão depois da próxima promoção: recalcular novamente.

## 8. Contrato canônico F90 — vinculante

Fonte: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`.

Identidade:

- competência: `AL.08 — Equações do 1º grau`;
- ficha: `F90 — Equações`;
- primitiva: `Balanca`;
- prereqs DAG: `AL.07 + N7.02`;
- linguagem visual herdada de F46; **não criar primitiva paralela**.

Fundamento:

- equação é equilíbrio;
- operação aplicada a um lado precisa ser aplicada ao outro;
- imagem causal: balança com incógnita/saco fechado, removendo/adicionando/dividindo igualmente nos dois pratos.

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
- essa condição deve ser evidência executável, não texto morto.

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

## 9. W46 — regression-first

O fechamento documental W45 e o regression-first W46 devem entrar no mesmo ciclo, **sem materializar F90**.

Teste: `src/curriculum/equacoesW46.test.ts`.

Estado nominal esperado do commit regression-first:

- `AL.08` continua fallback;
- `JOURNEY_FICHAS.find(item => item.id === "AL.08")` continua `undefined`;
- CI deve ficar vermelho **somente** nessa expectativa;
- Certificação transversal deve permanecer verde;
- auditorias, fichas, conformidade, DAG, TypeScript, Sensei, higiene e binários devem permanecer verdes.

Não relaxar o teste. Qualquer outro vermelho é falha real e deve ser investigado antes da materialização.

Após materialização futura, o mesmo contrato exige:

- ficha Journey F90;
- Composer real;
- kind `equacoes-f90`;
- `Balanca` física e `equilibrioFisico=true`;
- alvos generosos e sem arrasto obrigatório;
- mastery 4/4×3;
- evidência de L3+;
- quatro tags reconhecidas pelo Radar;
- resolução `fallback=0` semanticamente coerente com cada nível;
- resposta não vazando.

## 10. Próxima ação autorizada

1. publicar e classificar o regression-first W46;
2. se o único vermelho for AL.08/F90 ausente e a transversal estiver verde, **não refazer**;
3. materializar AL.08/F90 completa e **inativa**;
4. criar ficha, contrato/builder, kind, palco/helper reutilizando `Balanca`, renderer/wiring, resolução, Radar/misconceptions, evidência P13, testes e onboarding apenas se a linguagem visual realmente mudar;
5. manter `AL.08` fora de `DEFAULT_COMPOSER_CANARY_IDS`;
6. não adicionar `W46-AL.08` ao ledger nem mudar baseline enquanto inativa;
7. atualizar runtime map/tag/evidência ainda na fase inativa;
8. auditar cinco níveis, equilíbrio físico, L3+, diversidade, resposta vazando, mastery, resolução, acessibilidade e filtro motor;
9. exigir **CI + transversal completed/success no mesmo SHA inativo**;
10. só então promover atomicamente canário + ledger + contrato Matrix;
11. aceitar apenas o delta real da Matrix;
12. recertificar o SHA final e somente então fechar W46;
13. recalcular W47 pelo estado real.

## 11. Cadência e governança

- Uma onda por vez; não escrever a seguinte enquanto o portão exigido estiver vivo.
- Fechamento documental da onda N + regression-first da onda N+1 entram no mesmo ciclo quando seguro.
- Regression-first vermelho por design não substitui recibo técnico verde da onda anterior.
- Issues #47 e #48 continuam obrigatórias na transição pós-90/90, mas não interrompem W46–W50.
- Não usar baseline para fabricar verde.
- Não inventar recibos nem misturar SHAs.

## 12. Documentos de continuidade

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`

`RETOMADA.md` continua sendo ponte para esta porta operacional.
