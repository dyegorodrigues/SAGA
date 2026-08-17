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
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W42_N4_11_F70_FECHADA_2026-08-17.md`

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

## 4. Estado curricular vivo pós-W42

Ondas **W1–W42 fechadas**.

Coverage Matrix observada no recibo técnico final da W42:

- **67 Composer**
- **15 legado**
- **8 fallback**
- **82 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **67 competências**.

### Últimos recibos técnicos

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W37 | `N7.02 / F85` | `62/15/13/77/11` | `cdb57bcba6eec5f9e5b73243ac326e49594535f6` — CI `31956662185` + transversal `31956662195`, success |
| W38 | `AL.07 / F89` | `63/15/12/78/11` | `80543525d17ee1a4d24b8150131907fcb64f206c` — CI `31959513580` + transversal `31959513510`, success |
| W39 | `N2.07 / F66` | `64/15/11/79/11` | `e86627b779a6fb6bbd29807fa520533132df8a44` — CI `31977192229` + transversal `31977192249`, success |
| W40 | `GE.09 / F91` | `65/15/10/80/11` | `d8b9076eb4efdc98943b03bdc9bec72b6559ed03` — CI `31982352120` + transversal `31982352153`, success |
| W41 | `GE.10 / F92` | `66/15/9/81/11` | `52216b78ed4536760dbbc4029e34cf5e714e3aa1` — CI `32002124635` + transversal `32002124625`, success |
| W42 | `N4.11 / F70` | `67/15/8/82/11` | `f24c875aa4a0261bb98fc3c25f8bcec5cddcb84e` — CI `32035785217` + transversal `32035785210`, success |

### 4.1 Fechamento técnico vinculante da W42

`N4.11 / F70 — Primos e Divisores`; prereqs `N4.07 + N4.10`; primitivas canônicas `ArrayGrid + Quadrado100`.

Cadeia vinculante:

1. fechamento documental pós-W41 + regression-first W42 em `36b6ffe1c361fad509a30ce0783ea44bfc18073d` — CI `32003601902` vermelho nominal exclusivamente pela ausência de `N4.11/F70`; transversal `32003601880` success;
2. primeira materialização inativa `b8c5e7e17b3e83da5c67ce32f428d8db1e7f0233`; o TypeScript acusou apenas incompatibilidades de vocabulário/tipagem, sem necessidade de mudar o contrato pedagógico;
3. materialização inativa final `6129c5c8cb94ff83735a9c0ea5d2bbb35f8cff27` — `PrimosDivisoresStage`, ArrayGrid + Quadrado100, runtime map, renderer, Radar e testes físicos; CI `32034443674` + transversal `32034443648`, ambos `completed/success`;
4. promoção atômica final `f24c875aa4a0261bb98fc3c25f8bcec5cddcb84e` — canário + ledger + contrato Matrix; Matrix observada `67/15/8/82/11`; CI `32035785217` + transversal `32035785210`, ambos `completed/success`.

**Não reabrir W42 sem causa nova observável.**

---

## 5. Fallbacks pós-W42 e fila causal

Restam **8 fallbacks**:

`AL.08, GM.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → `causalWave` crescente, depois maior impacto downstream, depois ID;
4. empate residual → menor delta estrutural / continuidade local.

No estado executável pós-W42, a candidata confirmada é:

1. **W43 = `N4.12 / F71 — Dividir por Dois Dígitos`** — prereqs `N4.10 + N2.04`; `InteractiveVertical`; `causalWave=13`.

Recalcular depois de cada promoção. A fila é determinística no estado observado, não licença para ignorar deriva futura.

---

## 6. W43 — contrato canônico obrigatório

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md`, F71.

**Identidade:** `N4.12 / F71 — Dividir por Dois Dígitos`.  
**Primitiva:** `InteractiveVertical`.  
**Fundamento:** dividir por divisor de dois dígitos exige **estimar, testar por multiplicação e ajustar**. A primeira estimativa não é um palpite descartável nem um erro a punir; o ajuste é parte central da competência.

Escada integral:

1. divisor redondo (`÷20`, `÷30`);
2. divisor próximo de redondo (`÷19`, `÷21`);
3. qualquer divisor de dois dígitos;
4. divisão com resto;
5. zero no quociente.

Diagnósticos canônicos autorais:

- `NAO_ESTIMA` → runtime `nao-estima`;
- `NAO_AJUSTA` → runtime `nao-ajusta`;
- `RESTO_INVALIDO` → reutilizar semanticamente `resto-maior-ou-igual-divisor`, salvo evidência canônica contrária antes da materialização.

As tags emitidas precisam pertencer ao catálogo efetivo do Radar antes da promoção. Não duplicar uma misconception já existente só para dar nome novo à mesma falha matemática.

Falas:

- howto: `Arredonde o divisor para estimar. Depois teste e ajuste.`
- explain: `Multiplique sua estimativa e veja se cabe. Se passar, diminua.`

Coreografia mínima:

1. explicitar o arredondamento do divisor;
2. registrar uma estimativa de quociente;
3. mostrar a multiplicação de teste em área de rascunho;
4. se o produto passar, tornar causalmente visível que é preciso diminuir; se ficar abaixo e ainda couber outro grupo, aumentar;
5. confirmar o quociente somente depois do ajuste;
6. no nível com resto, exigir resto menor que o divisor;
7. no nível 5, preservar zero posicional no quociente.

Domínio: `{ acertos: 4, de: 4, sessoes: 3 }`, incluindo pelo menos um caso que exija **ajuste da primeira estimativa**.

F71 está marcada pelo adendo v3.1 como **exposição motora alta**:

- alternativa integral por toque;
- snap/tolerância generosa;
- área de alvo mínima de 80px;
- precisão de dedo nunca é requisito de compreensão;
- erro motor não gera misconception.

### 6.1 Relação com F69

F69/N4.10 é precedente físico e algorítmico, não molde pedagógico completo para F71. Reutilizar `InteractiveVertical` e helpers semanticamente corretos, mas F71 precisa materializar o ciclo de estimativa/teste/ajuste e sua área de rascunho. Não reduzir F71 a uma cópia da divisão longa nem a múltipla escolha abstrata.

---

## 7. Estado operacional da W43

O fechamento documental da W42 e o **regression-first nominal da W43** entram juntos no próximo SHA da branch.

O regression-first deve provar, sem expectativa artificial:

- `N4.12` ainda parte do fallback;
- prereqs vivos exatos `N4.10 + N2.04`;
- ausência atual da ficha/runtime F71;
- cinco níveis e kind especializado `divisao-dois-digitos-f71` quando materializados;
- realização física em `InteractiveVertical`, com rascunho de multiplicação de teste;
- ciclo estimar → testar → ajustar como relação causal;
- domínio 4/4 em 3 sessões e evidência de ajuste da primeira estimativa;
- acessibilidade motora do adendo v3.1;
- `NAO_ESTIMA`, `NAO_AJUSTA` e resto inválido reconhecidos pelo Radar;
- resolução declarativa sem vazamento antecipado da resposta correta.

O primeiro CI vermelho esperado é a ausência nominal da `N4.12/F71`. **Qualquer vermelho adicional é falha real e deve ser investigado.**

Após classificar o regression-first:

1. materializar F71 inativa;
2. atualizar runtime map/Radar ainda inativos;
3. auditar fidelidade pedagógica, realização física, rascunho, acessibilidade e filtro motor;
4. exigir CI + transversal verdes do mesmo SHA inativo;
5. só então promoção atômica;
6. Matrix deve observar o delta real — se a única mudança for a promoção de N4.12, o delta esperado é `+1 Composer / -1 fallback / +1 servida`, mas a saída executável vence a expectativa;
7. certificar CI + transversal do SHA final;
8. fechar documentação e recalcular a próxima onda antes de abrir o regression-first seguinte.

---

## 8. Branches de rascunho / dívida de limpeza

Branches de staging/rascunho antigas não são linha viva e não devem ser mergeadas. A fonte de verdade é sempre `codex/fechamento-curricular` + PR #35. Não inferir que `claude/w24-canary-contract-negative-j4kt89` seja descartável: ela contém origem já integrada do reparo W36.

---

## 9. Governança pós-90/90, design e tipografia

- Issues `#47` e `#48` são registros permanentes pós-90/90 e **não autorizam interromper W43–W50**.
- Só quando a Matrix executável chegar a `fallback=0 / 90 competências servidas` e a última onda estiver certificada, #47 e #48 viram portas obrigatórias para a transição Fábrica Curricular → Integração Sistêmica e Child-Ready.
- Nesse momento criar/reconciliar índice vivo equivalente a `ROADMAP_90_90_CHILD_READY`, distinguindo `CONFIRMADO-ATUAL`, `DÍVIDA-REGISTRADA`, `HISTÓRICO-A-REVALIDAR`, `HIPÓTESE-A-PROVAR`, `FECHADO-COM-RECIBO` e `FORA-DE-ESCOPO`.
- O exemplo `GM.06/F62 — segundos?` do #48 continua candidato não confirmado; não mexer em GM.06 oportunisticamente.
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
Criar ficha runtime, contrato/builder, palco/helper, catálogo, renderer e wiring necessários **sem ativar canário** e sem antecipar ledger/Matrix.

### 10.5 Auditoria de fidelidade
Conferir escada, primitivas físicas, resolução, misconceptions/Radar, domínio, tutorial/onboarding, acessibilidade motora, vazamento de resposta, evaluate/fallback e filtro motor.

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
- Não enfraquecer testes, sondas, Matrix ou auditores.
- Não mascarar deriva com baseline.
- Não inventar recibos.
- Não misturar CI de SHAs diferentes.
- Não congelar política não decidida do Player por oportunismo.

---

## 12. Próxima ação ao retomar

1. reancorar no remoto;
2. confirmar que o recibo técnico W42 `f24c875aa4a0261bb98fc3c25f8bcec5cddcb84e` permanece certificado por CI `32035785217` + transversal `32035785210`, ambos success;
3. confirmar que o HEAD atual contém o fechamento documental W42 e o regression-first nominal W43;
4. classificar o vermelho do regression-first W43: esperado exclusivamente pela ausência real de `N4.12/F71`;
5. materializar F71 inativa seguindo §§10.1–10.10;
6. após W43 final verde, recalcular Matrix/DAG antes de escolher a próxima onda.
