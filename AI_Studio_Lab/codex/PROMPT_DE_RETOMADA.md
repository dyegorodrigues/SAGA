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

## 4. Estado curricular vivo pós-W40

Ondas **W1–W40 fechadas**.

Coverage Matrix observada no recibo técnico final da W40:

- **65 Composer**
- **15 legado**
- **10 fallback**
- **80 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **65 competências**.

### Últimos recibos técnicos

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W35 | `GM.06 / F62` | `60/15/15/75/11` | `c7d21d50eb85939e190f29c3a3dbabc17bed4cd8` — CI `31934324465` + transversal `31934324470`, success |
| W36 | `GM.10 / F93` | `61/15/14/76/11` | `a7423641c2be7c6bc5f221de7db8531e7655b1bc` — CI `31954561791` + transversal `31954561716`, success |
| W37 | `N7.02 / F85` | `62/15/13/77/11` | `cdb57bcba6eec5f9e5b73243ac326e49594535f6` — CI `31956662185` + transversal `31956662195`, success |
| W38 | `AL.07 / F89` | `63/15/12/78/11` | `80543525d17ee1a4d24b8150131907fcb64f206c` — CI `31959513580` + transversal `31959513510`, success |
| W39 | `N2.07 / F66` | `64/15/11/79/11` | `e86627b779a6fb6bbd29807fa520533132df8a44` — CI `31977192229` + transversal `31977192249`, success |
| W40 | `GE.09 / F91` | `65/15/10/80/11` | `d8b9076eb4efdc98943b03bdc9bec72b6559ed03` — CI `31982352120` + transversal `31982352153`, success |

### 4.1 Fechamento técnico vinculante da W40

`GE.09 / F91 — Círculo e Áreas`; prereqs `GM.08 + GE.06`; primitiva canônica `ShapeCanvas`.

Cadeia verificada:

1. regression-first inicial `9dbf5f02301d48087bee6b40cce8a82bf0df614f` — CI `31977714362` vermelho por desenho; transversal `31977714478` success;
2. contrato regression-first reforçado `33331a77624fc6b4432dd1eab57ea2f43492bd1c` — CI `31980769042` vermelho nominal pela ausência da `GE.09`, com o restante da suíte verde; transversal `31980768980` success;
3. materialização inativa `a771f9606de1b3b05f4e30329939711131f5d6ec` — `CirculoAreasStage` reutiliza fisicamente `ShapeCanvas`, deriva triângulo/paralelogramo/círculo e registra runtime/Radar sem ativar canário; CI `31981350463` + transversal `31981350512`, ambos `completed/success`;
4. promoção atômica final `d8b9076eb4efdc98943b03bdc9bec72b6559ed03` — canário + ledger + contrato Matrix; Matrix observada `65/15/10/80/11`; CI `31982352120` + transversal `31982352153`, ambos `completed/success`.

**Não reabrir W40 sem causa nova observável.**

---

## 5. Fallbacks pós-W40 e fila causal

Restam **10 fallbacks**:

`AL.08, GE.10, GM.11, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → `causalWave` crescente, depois maior impacto downstream, depois ID;
4. empate residual → menor delta estrutural / continuidade local.

O recálculo executável pós-W40 produz:

1. **W41 = `GE.10 / F92 — Volume e Vistas`** — prereqs `GE.04 + GM.08`; `ArrayGrid` em modo 3D; `causalWave=12`;
2. **W42 = `N4.11 / F70 — Primos e Divisores`** — prereqs `N4.07 + N4.10`; `causalWave=13`;
3. **W43 = `N4.12 / F71 — Divisão com divisor de 2 dígitos`** — prereqs `N4.10 + N2.04`; `causalWave=13`.

Recalcular depois de cada promoção. A fila é determinística no estado observado, não uma licença para ignorar deriva futura.

---

## 6. W41 — contrato canônico obrigatório

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F4_COMPLETAS.md`, F92.

**Identidade:** `GE.10 / F92 — Volume e Vistas`.  
**Primitiva:** `ArrayGrid` em **modo 3D**. O modo 3D é `mode swap`, não nova ferramenta; não criar primitiva paralela.  
**Fundamento:** representar objeto tridimensional por vistas frente/lado/cima e reconstruí-lo; exige rotação mental.

Escada integral:

1. identificar a vista frontal;
2. trabalhar as três vistas;
3. **reconstruir a partir das vistas**;
4. contar cubinhos ocultos — nível conceitualmente mais difícil, exige modelo mental completo;
5. desenhar as vistas de uma construção dada.

Diagnósticos canônicos autorais:

- `IGNORA_OCULTOS` → runtime `ignora-ocultos`;
- `VISTA_TROCADA` → runtime `vista-trocada`;
- `SEM_ROTACAO_MENTAL` → runtime `sem-rotacao-mental`.

As três tags precisam pertencer ao catálogo efetivo do Radar antes da promoção.

Falas:

- howto: `Imagine olhando de cima. O que você veria?`
- explain: `Gire a construção e compare com a vista pedida.`

Coreografia mínima:

1. mostrar a construção 3D;
2. girar para frente;
3. destacar a vista correspondente.

Domínio: `{ acertos: 3, de: 3, sessoes: 2 }`, **incluindo uma reconstrução**.

Exposição motora F92 é alta:

- toda interação de arrasto deve ter alternativa toque-origem → toque-destino;
- snap generoso obrigatório;
- alvo motor mínimo **80 px**;
- escorregão de dedo não gera misconception;
- precisão de dedo nunca é evidência conceitual.

Auditoria de primitivas já classifica `ArrayGrid#3D` como **mode swap**. Portanto a materialização precisa de onboarding visual explícito do modo 3D, mesmo reutilizando `ArrayGrid`.

---

## 7. Estado operacional da W41

O fechamento documental da W40 e o **regression-first nominal da W41** devem entrar juntos no próximo SHA da branch.

O regression-first deve provar, sem expectativa artificial:

- `GE.10` ainda parte do fallback;
- prereqs vivos exatos `GE.04 + GM.08`;
- ausência atual da ficha/runtime F92;
- cinco níveis e kind especializado `volume-vistas-f92` quando materializados;
- reutilização da primitiva `ArrayGrid`, visualização 3D, onboarding, domínio, resoluções e acessibilidade motora;
- as três tags F92 reconhecidas pelo Radar.

O primeiro CI vermelho esperado é a ausência nominal da `GE.10/F92`. **Qualquer vermelho adicional é falha real e deve ser investigado.**

Após classificar o regression-first:

1. materializar F92 inativa;
2. atualizar runtime map/Radar ainda inativos;
3. auditar fidelidade pedagógica e realização física;
4. exigir CI + transversal verdes do mesmo SHA inativo;
5. só então promoção atômica;
6. Matrix deve observar o delta real — se a única mudança for a promoção de GE.10, o delta esperado é `+1 Composer / -1 fallback / +1 servida`, mas a saída executável vence a expectativa;
7. certificar CI + transversal do SHA final;
8. fechar documentação e abrir W42 regression-first no mesmo ciclo.

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

### 10.5 Runtime map antes da promoção
Novo kind, specialized builder, renderer, modo ou palco composto entra no mapa ainda inativo. Respeitar §3.1: adicionar sem comprimir o cânone.

### 10.6 Auditoria pedagógica
Comparar implementação com a ficha canônica integral: progressão 1–5, resolução, misconceptions, domínio, onboarding, realização física das primitivas e acessibilidade motora. CI estrutural verde não prova fidelidade pedagógica.

### 10.7 Gates determinísticos
Auditorias, TypeScript, suíte, build, guarda textual/binária e Matrix permanecem estritos. Não relaxar expectativa para ficar verde.

### 10.8 Portão inativo exato
**A promoção só é autorizada quando CI + Certificação transversal do MESMO SHA inativo estão ambos `completed/success`.** Se já estiverem verdes, executar imediatamente sem pedir confirmação.

### 10.9 Promoção atômica
Canário + ledger nominal + contrato Matrix no mesmo SHA. Depois:

1. deixar a Matrix observar o delta real;
2. investigar qualquer diferença antes de ajustar expectativa;
3. certificar CI + transversal do SHA final;
4. só então fechar checkpoint/porta/corpo do PR.

### 10.10 Cadência

- Não parar a cada onda nem pedir `posso prosseguir?`;
- checkpoint/relatório natural a cada 5 ondas, salvo bloqueio real;
- fechamento documental da onda N e regression-first da onda N+1 entram no mesmo push;
- SHA regression-first é vermelho por desenho e não substitui recibo técnico final;
- em cada recálculo, calcular as três próximas seleções;
- serialização obrigatória: regression-first → inativo → dois workflows verdes → promoção atômica → Matrix honesta → dois workflows finais verdes → documentação/próxima regressão.

---

## 11. Autonomia e restrições

Agir autonomamente dentro deste protocolo: investigar, testar, corrigir, acompanhar workflows e avançar ondas sem confirmação humana intermediária.

Só parar por bloqueio real: perda de escrita; conflito remoto sério; fontes canônicas contraditórias; necessidade de mudar contrato pedagógico sem autoridade documental; área proibida; falha cuja correção segura não possa ser inferida.

Não pode:

- tocar/mergear `main`;
- marcar PR #35 ready;
- habilitar auto-merge;
- tocar Creature Engine/Tamagotchi;
- mover branch parcialmente;
- promover antes do portão inativo duplo;
- misturar SHAs ou inventar recibos;
- antecipar canário/ledger/Matrix;
- relaxar testes, Matrix, auditorias, baseline ou sondas;
- comprimir cânone compartilhado;
- criar primitiva paralela quando já existe infraestrutura canônica apropriada.

Se houver vermelho: **investigar, não maquiar**.

---

## 12. Próximo passo em uma nova retomada

1. reancorar PR #35, branch, HEAD, main, reviews/threads e workflows;
2. confirmar W40 final em `d8b9076eb4efdc98943b03bdc9bec72b6559ed03`, Matrix `65/15/10/80/11`, 65 canários, CI `31982352120`, transversal `31982352153`;
3. localizar no HEAD corrente o regression-first nominal da W41 `GE.10/F92` e classificar o CI correspondente;
4. se o regression-first ainda não existir, criá-lo junto do fechamento documental pós-W40;
5. reancorar F92 integralmente e seguir §§10.1–10.10 sem pular onboarding do modo 3D, Radar, runtime map, acessibilidade motora, portão inativo ou promoção atômica;
6. após W41 final verde, recalcular Matrix/DAG; fila corrente de referência: W42 `N4.11/F70`, W43 `N4.12/F71`, salvo deriva real observada.
