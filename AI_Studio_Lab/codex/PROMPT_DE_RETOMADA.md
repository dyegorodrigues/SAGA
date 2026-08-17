# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia este arquivo integralmente antes de editar. O GitHub remoto vence memória de conversa, prompt antigo, SHA histórico ou status presumido.

---

## 1. Âncora remota

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch viva: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`

Antes de qualquer escrita:

1. confirme PR, branch e HEAD remoto;
2. confirme que `main` continua intocada;
3. consulte reviews/threads e os workflows do **SHA exato** relevante;
4. se CI + Certificação transversal já estiverem `completed/success`, execute o passo autorizado imediatamente;
5. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca inventar SHA, run ID, contagem de testes, recibo ou delta de Matrix. Conclusão global de workflow e evidência de job/log são fatos distintos.

---

## 2. Documentos de continuidade

Ler conforme a área:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`
- `AI_Studio_Lab/codex/ROADMAP_PRODUTO_E_EXPANSAO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W20_W24_FECHADA_2026-08-15.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W25_W29_FECHADA_2026-08-15.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W30_W34_FECHADA_2026-08-15.md`

Checkpoint é recibo humano. **Coverage Matrix, canário, DAG e runtime vivos são a autoridade executável.**

---

## 3. Invariantes arquiteturais

- `composerCanaryIds.ts`, `coverage_matrix_core.ts` e `ficha_runtime_map.cjs` são declarativos.
- Não criar mutação por efeito colateral de import para canário, ledger, Matrix ou mapa runtime.
- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- Promoção + linha nominal do ledger + contrato Matrix entram no **mesmo SHA**.
- A Matrix observa o delta real; baseline não mascara deriva.
- `ficha_runtime_map.cjs` deve ser completado **ainda no estágio inativo**, antes do portão de promoção, quando houver novo kind/builder/renderer/modo/palco composto.
- Em palco composto, a realização física é explicitada em todas as primitivas canônicas pertinentes; não inferir cadeia inexistente só para ficar verde.
- Tag emitida por ficha só é funcional se o Radar a reconhecer; tags novas precisam nascer no catálogo canônico e ser provadas por teste nominal.
- Onboarding de mode swap é contrato pedagógico; não confundir reutilização da primitiva com dispensa de ensinar o novo modo.
- Exposição motora alta exige alternativa por toque, snap generoso e separação entre erro motor e misconception.
- Não tocar/mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.

### 3.1 Cânone compartilhado é aditivo

Os seguintes arquivos são **cânone compartilhado aditivo**:

- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- `src/curriculum/evidencias.ts`
- `src/curriculum/misconceptions.ts`
- `src/constants/misconceptions.ts`
- `AI_Studio_Lab/tools/coverage_matrix_core.ts`

**Cânone não se comprime.** Nova onda acrescenta o mínimo necessário sem apagar, resumir, reformatar semanticamente ou substituir rationale, aliases, notas, documentação ou observabilidade preexistentes.

---

## 4. Estado curricular vivo pós-W41

Ondas **W1–W41 fechadas**.

Coverage Matrix observada no recibo técnico final da W41:

- **66 Composer**
- **15 legado**
- **9 fallback**
- **81 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **66 competências**.

### Últimos recibos técnicos

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W36 | `GM.10 / F93` | `61/15/14/76/11` | `a7423641c2be7c6bc5f221de7db8531e7655b1bc` — CI `31954561791` + transversal `31954561716`, success |
| W37 | `N7.02 / F85` | `62/15/13/77/11` | `cdb57bcba6eec5f9e5b73243ac326e49594535f6` — CI `31956662185` + transversal `31956662195`, success |
| W38 | `AL.07 / F89` | `63/15/12/78/11` | `80543525d17ee1a4d24b8150131907fcb64f206c` — CI `31959513580` + transversal `31959513510`, success |
| W39 | `N2.07 / F66` | `64/15/11/79/11` | `e86627b779a6fb6bbd29807fa520533132df8a44` — CI `31977192229` + transversal `31977192249`, success |
| W40 | `GE.09 / F91` | `65/15/10/80/11` | `d8b9076eb4efdc98943b03bdc9bec72b6559ed03` — CI `31982352120` + transversal `31982352153`, success |
| W41 | `GE.10 / F92` | `66/15/9/81/11` | `52216b78ed4536760dbbc4029e34cf5e714e3aa1` — CI `32002124635` + transversal `32002124625`, success |

### 4.1 Fechamento técnico vinculante da W41

`GE.10 / F92 — Volume e Vistas`; prereqs `GE.04 + GM.08`; primitiva canônica `ArrayGrid#3D`.

Cadeia vinculante:

1. fechamento documental pós-W40 + regression-first W41 em `3e2107d0b28bcbe1809e824f4466263ffe482f5b`;
2. materialização inativa final `33ff7d34155fad9af3c2904a8c0c4c631d976ee6` — `VolumeVistasStage`, `ArrayGrid#3D`, runtime map/Radar e auditor preservados; CI `32001192111` + transversal `32001192091`, ambos `completed/success`;
3. promoção atômica final `52216b78ed4536760dbbc4029e34cf5e714e3aa1` — canário + ledger + contrato Matrix; Matrix observada `66/15/9/81/11`; CI `32002124635` + transversal `32002124625`, ambos `completed/success`.

**Não reabrir W41 sem causa nova observável.**

---

## 5. Fallbacks pós-W41 e fila causal

Restam **9 fallbacks**:

`AL.08, GM.11, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → `causalWave` crescente, depois maior impacto downstream, depois ID;
4. empate residual → menor delta estrutural / continuidade local.

No estado executável pós-W41, a fila de referência permanece:

1. **W42 = `N4.11 / F70 — Primos e Divisores`** — prereqs `N4.07 + N4.10`; `causalWave=13`;
2. **W43 = `N4.12 / F71 — Divisão com divisor de 2 dígitos`** — prereqs `N4.10 + N2.04`; `causalWave=13`.

Recalcular depois de cada promoção. A fila é determinística no estado observado, não licença para ignorar deriva futura.

---

## 6. W42 — contrato canônico obrigatório

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md`, F70.

**Identidade:** `N4.11 / F70 — Primos e Divisores`.  
**Primitivas:** `ArrayGrid + Quadrado100`.  
**Fundamento:** divisor **cabe dentro**; múltiplo é **onde se chega**; primo é o número para o qual só existe o retângulo `1 × n`.

Escada integral:

1. múltiplos no quadro de 100;
2. divisores por retângulo;
3. distinguir divisor de múltiplo;
4. identificar primos;
5. crivo de Eratóstenes no quadro de 100.

Diagnósticos canônicos autorais:

- `INVERTE_DIVISOR_MULTIPLO` → runtime `inverte-divisor-multiplo`;
- `ESQUECE_UM` → runtime `esquece-um`;
- `PRIMO_ERRADO` → runtime `primo-errado`.

As três tags precisam pertencer ao catálogo efetivo do Radar antes da promoção.

Falas:

- howto: `Divisor cabe dentro do número. Múltiplo é onde você chega pulando.`
- explain: `Tente montar retângulos. Quantos jeitos diferentes existem?`

Coreografia mínima:

1. mostrar as peças;
2. montar retângulos possíveis;
3. tornar explícito o caso `1 × n` para primo;
4. no crivo, eliminar múltiplos no `Quadrado100` sem transformar a tarefa em múltipla escolha abstrata.

Domínio: `{ acertos: 3, de: 3, sessoes: 2 }`, incluindo identificação de primos.

---

## 7. Estado operacional da W42

O fechamento documental da W41 e o **regression-first nominal da W42** entram juntos no próximo SHA da branch.

O regression-first deve provar, sem expectativa artificial:

- `N4.11` ainda parte do fallback;
- prereqs vivos exatos `N4.07 + N4.10`;
- ausência atual da ficha/runtime F70;
- cinco níveis e kind especializado `primos-divisores-f70` quando materializados;
- realização física de `ArrayGrid + Quadrado100`;
- distinção semântica divisor↔múltiplo, identificação de primos e crivo;
- domínio 3/3 em 2 sessões;
- as três tags F70 reconhecidas pelo Radar.

O primeiro CI vermelho esperado é a ausência nominal da `N4.11/F70`. **Qualquer vermelho adicional é falha real e deve ser investigado.**

Após classificar o regression-first:

1. materializar F70 inativa;
2. atualizar runtime map/Radar ainda inativos;
3. auditar fidelidade pedagógica e realização física;
4. exigir CI + transversal verdes do mesmo SHA inativo;
5. só então promoção atômica;
6. Matrix deve observar o delta real — se a única mudança for a promoção de N4.11, o delta esperado é `+1 Composer / -1 fallback / +1 servida`, mas a saída executável vence a expectativa;
7. certificar CI + transversal do SHA final;
8. fechar documentação e abrir W43 regression-first no mesmo ciclo.

---

## 8. Branches de rascunho / dívida de limpeza

Branches de staging/rascunho antigas não são linha viva e não devem ser mergeadas. A fonte de verdade é sempre `codex/fechamento-curricular` + PR #35. Não inferir que `claude/w24-canary-contract-negative-j4kt89` seja descartável: ela contém origem já integrada do reparo W36.

---

## 9. Design, cores e tipografia

- UI/ficha/palco novo usa papéis de `src/styles/tokens.ts` e classes estabelecidas; não introduzir cor literal nova.
- Não regenerar baseline para silenciar catraca.
- Fredoka e Nunito permanecem as famílias escolhidas.
- Tipografia local está resolvida; não reabrir Google Fonts.
- A exceção binária continua restrita a `public/fonts/*.woff2`.

---

## 10. Protocolo vinculante de cada nova onda

### 10.1 Reancoragem
Antes de cada escrita: PR/HEAD/main, reviews/threads, Matrix, DAG, ficha canônica, runtime, mapa físico e precedentes. Se o HEAD mudou, reconciliar antes de mover branch.

### 10.2 Regression-first
Criar teste nominal do nó ainda não materializado. A falha precisa ser a ausência esperada de registro/contrato, não expectativa frouxa inventada para falhar.

### 10.3 Classificação de CI
Registrar separadamente conclusão global de cada workflow, evidência de Gates/job/log e falha regression-first versus falha real de implementação.

### 10.4 Materialização inativa
Criar ficha runtime, contrato/builder, palco, catálogo, renderer e wiring necessários **sem ativar canário** e sem antecipar ledger/Matrix.

### 10.5 Auditoria de fidelidade
Conferir escada, primitivas físicas, resolução, misconceptions/Radar, domínio, tutorial/onboarding, acessibilidade motora e ausência de atalhos por múltipla escolha quando a ficha exige manipulação.

### 10.6 Portão inativo
Somente avançar com **CI + Certificação transversal `completed/success` no mesmo SHA inativo**.

### 10.7 Promoção atômica
No mesmo SHA: adicionar competência ao canário, linha nominal do ledger e contrato Matrix. Não promover em commit separado do ledger.

### 10.8 Matrix como observador
Executar Matrix e aceitar o delta observado; jamais editar baseline para fabricar o delta esperado.

### 10.9 Portão final
Somente fechar a onda com **CI + Certificação transversal `completed/success` no SHA final de promoção**.

### 10.10 Continuidade
Fechar documentalmente a onda e abrir regression-first da seguinte no mesmo ciclo. Recalcular DAG/Matrix a cada promoção.

---

## 11. Restrições absolutas

- PR #35 permanece `draft + open + unmerged`.
- `main` permanece intocada em `106dfe0d796babebe40ebc36e5a84d4a80b9a858` enquanto este fluxo estiver ativo.
- Não habilitar auto-merge.
- Não marcar ready for review.
- Não tocar Creature Engine/Tamagotchi.
- Não apagar rationale/aliases/notas do cânone compartilhado.
- Não inventar recibos.
- Não misturar CI de SHAs diferentes.

---

## 12. Próxima ação ao retomar

1. reancorar no remoto;
2. confirmar que o SHA de fechamento W41 `52216b78ed4536760dbbc4029e34cf5e714e3aa1` permanece certificado por CI `32002124635` + transversal `32002124625`, ambos success;
3. confirmar que o HEAD atual contém o fechamento documental W41 e o regression-first nominal W42;
4. classificar o vermelho do regression-first W42: esperado exclusivamente pela ausência real de `N4.11/F70`;
5. materializar F70 inativa seguindo §§10.1–10.10;
6. após W42 final verde, recalcular Matrix/DAG antes de abrir W43 `N4.12/F71`.
