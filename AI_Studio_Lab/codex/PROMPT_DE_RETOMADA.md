# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia este arquivo integralmente antes de editar. O GitHub remoto vence memória de conversa, prompt antigo, SHA histórico ou status presumido.

---

## 1. Âncora remota

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch viva: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`

Antes de qualquer edição:

1. confirme PR, branch e HEAD remoto;
2. confirme que `main` continua intocada;
3. consulte os workflows do **SHA exato** relevante;
4. se CI + Certificação transversal já estiverem `completed/success`, **não espere novamente: execute o próximo passo**;
5. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca inventar SHA, run ID, contagem de testes ou delta de Matrix. Conclusão global de workflow e evidência de job/log são fatos distintos.

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
- `ficha_runtime_map.cjs` deve ser completado **ainda no estágio inativo**, antes do portão de promoção, quando a nova ficha introduzir kind/builder/renderer/palco composto.
- Em palco composto, a realização física é explicitada em todas as primitivas canônicas pertinentes; não inferir cadeia inexistente só para ficar verde.
- Tag emitida por ficha só é funcional se o Radar a reconhecer; tags novas precisam nascer no catálogo canônico e ser provadas por teste nominal.
- Não tocar/mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.

### 3.1 Cânone compartilhado é aditivo

Os seguintes arquivos são **cânone compartilhado aditivo**:

- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- `src/curriculum/evidencias.ts`
- `src/curriculum/misconceptions.ts`
- `src/constants/misconceptions.ts`
- `AI_Studio_Lab/tools/coverage_matrix_core.ts`

**Cânone não se comprime.** Nova onda acrescenta o mínimo necessário sem apagar, resumir, reformatar semanticamente ou substituir documentação/rationale/aliases/notas/observabilidade preexistentes. Uma linha nova em array declarativo não é “reescrever o arquivo”.

A regressão da W36 provou por que esta regra é vinculante: comprimir `ficha_runtime_map.cjs` removeu literais e rationale que os auditores usam como contrato. O reparo foi forward, restaurando o texto integral antes da promoção. A auditoria pós-promoção da W37 reforçou a mesma regra no catálogo do Radar: diagnóstico correto fora do catálogo é silenciosamente descartado.

---

## 4. Estado curricular vivo pós-W39

Ondas **W1–W39 fechadas**.

Coverage Matrix observada após o fechamento final da W39:

- **64 Composer**
- **15 legado**
- **11 fallback**
- **79 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Canário ativo: **64 competências**.

### Últimos recibos técnicos

| Onda | Competência / ficha | Matrix após fechamento | Recibo técnico final |
|---|---|---|---|
| W31 | `PE.03 / F83` | `56/15/19/71/11` | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd` — CI `31908549456` + transversal `31908549471`, success |
| W32 | `GM.09 / F82` | `57/15/18/72/11` | `40ef8eb13cd93d1a0b2e60375964853e62118e24` — CI `31913688446` + transversal `31913688438`, success |
| W33 | `GE.07 / F79` | `58/15/17/73/11` | `5fa072c84e69687491a21d0e6f975d7b9da3fd44` — CI `31916781563` + transversal `31916781644`, success |
| W34 | `GE.08 / F80` | `59/15/16/74/11` | `da00831f80f38550835501a45e0374ee526d316f` — CI `31918571578` + transversal `31918570753`, success |
| W35 | `GM.06 / F62` | `60/15/15/75/11` | `c7d21d50eb85939e190f29c3a3dbabc17bed4cd8` — CI `31934324465` + transversal `31934324470`, success |
| W36 | `GM.10 / F93` | `61/15/14/76/11` | `a7423641c2be7c6bc5f221de7db8531e7655b1bc` — CI `31954561791` + transversal `31954561716`, success |
| W37 | `N7.02 / F85` | `62/15/13/77/11` | `cdb57bcba6eec5f9e5b73243ac326e49594535f6` — CI `31956662185` + transversal `31956662195`, success |
| W38 | `AL.07 / F89` | `63/15/12/78/11` | `80543525d17ee1a4d24b8150131907fcb64f206c` — CI `31959513580` + transversal `31959513510`, success |
| W39 | `N2.07 / F66` | `64/15/11/79/11` | `e86627b779a6fb6bbd29807fa520533132df8a44` — CI `31977192229` + transversal `31977192249`, success |

---

## 5. W35 — GM.06 / F62 — Horas e Minutos — fechamento

Pré-requisitos: `GM.04 + AL.03`.  
Primitivas canônicas: `Relogio + NumberLine`.  
Realização: `HorasMinutosStage` / `horas-minutos-f62`.

Contrato: meia hora/quartos → 5 em 5 com apoio → 5 em 5 sem apoio → minuto a minuto → duração. Diagnósticos `MINUTO_COMO_NUMERO`, `IGNORA_HORA_NA_DURACAO`, `SUBTRAI_DECIMAL`; domínio 3/3 em 2 sessões.

Histórico técnico que deve permanecer auditável:

1. regression-first `93b5e28cf7a65fad03ade3dfc6db22c9a1d24a7b`;
2. inativo inicial `779f40349328728b92a9a4969537ed4982625e8e` — CI `31932785122` + transversal `31932785057`, success;
3. primeira promoção `7d7689aceb459cdf4b62c816c69723990b7e89f8` revelou dívida real de onboarding (`params.tutorial` em formato incorreto);
4. forward rollback `917e68f209a69dd08b6b9b57796d9335dec51435` restaurou só os três governantes;
5. inativo reparado `c30f6d291ac70d8cb0054d2da96dde7b44d003b1` — CI `31933937338` + transversal `31933937332`, success;
6. promoção final `c7d21d50eb85939e190f29c3a3dbabc17bed4cd8` — CI `31934324465` + transversal `31934324470`, success; Matrix `60/15/15/75/11`.

**W35 fechada sem relaxar gate, Matrix ou baseline.**

---

## 6. W36 — GM.10 / F93 — Conversão de Unidades — fechamento

Pré-requisitos: `GM.05 + N2.04`.  
Primitivas canônicas: `NumberLine + Balanca`.  
Realização: `ConversaoUnidadesStage` / `conversao-unidades-f93`.

Escada: conversão comprimento → massa/capacidade → conversão decimal → escolha da unidade adequada → problema contextual. Diagnósticos `INVERTE_OPERACAO`, `MISTURA_GRANDEZAS`, `IGNORA_DECIMAL`; domínio 3/3 em 2 sessões incluindo decimal.

Histórico técnico vinculante:

1. regression-first/documentação pós-W35: `d9da40162d5655353db57863a2e7447769facc57`;
2. materialização inativa inicial `ea005de46eb54307c82b3d3d3eecfaf18542cb00`; o Gates detectou compressão indevida do cânone em `ficha_runtime_map.cjs`;
3. reparo forward inativo `49487995db80affc5ae36c611b82f048e02d4853` restaurou integralmente comentários/notas/literais canônicos e preservou GM.10; CI `31947628546` + transversal `31947628547`, success;
4. promoção atômica `61c99d7f04bd4d2f42aea42ca24f947867f5df9b` alterou somente os três governantes e fez a Matrix observar `61/15/14/76/11`, mas o contrato genérico do canário ainda impunha `Number.isInteger` a toda ficha;
5. o vermelho real foi **um** teste: `GM.10 L1: número não inteiro` em `canaryContract.test.ts`; não houve falha de content audit nem anomalia `src/content`;
6. reparo final `a7423641c2be7c6bc5f221de7db8531e7655b1bc`: `dominioNumerico` ganhou `"racionais"`, GM.10 declarou esse domínio e o contrato passou a exigir inteiro apenas onde o conjunto é inteiro. Finitude nunca relaxou: `NaN` e `Infinity` continuam barrados em qualquer ficha;
7. recertificação final no SHA exato `a7423641...`: CI `31954561791` + transversal `31954561716`, ambos `completed/success`.

**W36 fechada em `61/15/14/76/11`.**

---

## 7. Seleção fallback-first pós-W36 — histórico preservado

Restavam **14 fallbacks**:

`AL.07, AL.08, GE.09, GE.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Critério vinculante:

1. candidato só é elegível quando todos os prereqs estão servidos;
2. maximizar ganho imediato de desbloqueio;
3. empate → ordem causal executável da Matrix/DAG (`causalWave` crescente, depois maior impacto downstream, depois ID);
4. empate residual → menor delta estrutural / continuidade local.

Próximas três seleções calculadas no estado pós-W36:

1. **W37 = `N7.02 / F85 — Operar com Negativos`** — prereqs `N7.01 + N3.13`, primitiva `InteractiveNumberLine`;
2. **W38 = `AL.07 / F89 — A Linguagem das Letras`** — prereqs `AL.06 + AL.04`, primitivas `SingaporeBars + plain`; servir N7.02 aproxima `AL.08` do desbloqueio total;
3. **W39 = `N2.07 / F66 — A Fábrica de Retângulos`** — prereqs `N4.02 + N2.06`, primitiva `ArrayGrid`.

Recalcular Matrix/DAG após cada promoção. Estes alvos são fila calculada, não licença para ignorar uma deriva nova.

### 7.1 Contrato obrigatório da W37

F85 — **Operar com Negativos**:

- `dominioNumerico: "inteiros"` deve nascer já no estágio inativo;
- níveis: soma positivo+negativo → soma negativo+positivo → dois negativos → subtração de negativo → expressões mistas com 3+ operações;
- diagnósticos: `IGNORA_SINAL`, `DIRECAO_ERRADA`, `SUBTRAIR_NEGATIVO`;
- domínio: 3/3 em 2 sessões, incluindo item que cruza o zero;
- em `a − (−b)`, explicar como **cancelar uma dívida**; não usar a regra vaga “mover na direção do sinal”.

### 7.2 Fechamento técnico da W37

- regression-first/documentação: `4a7bac1cc7fa28723debbb5f61a0afeb6afd0ce2`; vermelho nominal por ausência da N7.02, com os demais 3.157 testes verdes;
- materialização inativa: `e7d7268b07d1027f48200ca21215dadd563e69a5`; CI `31955540067` + transversal `31955540080`, success;
- promoção atômica: `bc4fbc63cbec661b28183a218a82aacb12fa20fd`; Matrix `62/15/13/77/11`; CI `31956022774` + transversal `31956022841`, success;
- auditoria pós-promoção encontrou duas tags F85 ausentes do catálogo efetivo do Radar (`IGNORA_SINAL`, `SUBTRAIR_NEGATIVO`; `DIRECAO_ERRADA` já existia);
- reparo forward final: `cdb57bcba6eec5f9e5b73243ac326e49594535f6`, adicionando somente as duas tags faltantes e asserção nominal de reconhecimento pelo Radar; CI `31956662185` + transversal `31956662195`, ambos `completed/success`.

**W37 fechada em `62/15/13/77/11`.**

### 7.3 Seleção pós-W37 e contrato da W38

Restam **13 fallbacks**: `AL.07, AL.08, GE.09, GE.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

**W38 = `AL.07 / F89 — A Linguagem das Letras`** — prereqs `AL.06 + AL.04`, primitivas `SingaporeBars + plain`. Com N7.02 já servida, promover AL.07 completa os prereqs de AL.08.

Contrato F89:

- caixa vazia → letra → expressão simples → expressão em contexto → regra de padrão → equivalência de expressões;
- a letra guarda o lugar de um número; notação não é conceito novo;
- regra geral testada em pelo menos dois casos;
- diagnósticos `LETRA_COMO_OBJETO`, `SO_CASO_PARTICULAR`, `NAO_GENERALIZA` precisam estar no catálogo do Radar ainda inativo;
- domínio 3/3 em 2 sessões, incluindo L4;
- runtime map registra as duas entradas de composição `SingaporeBars + plain` antes da promoção.

### 7.4 Fechamento técnico da W38

- regression-first/documentação: `158c7407ed37310336daa9451750c8455d1d67f8`; CI `31957225134` vermelho nominal com **1** teste F89 falhando por ausência de `AL.07` e os demais 3.173 testes verdes; transversal `31957225131` success;
- materialização inativa: `0da3ecea9519b46f582dcc8d8670dfc642cd8473`; `LinguagemLetrasStage` compõe fisicamente `SingaporeBars + plain`, e as três tags F89 entram aditivamente no Radar; CI `31959023444` + transversal `31959023443`, success;
- promoção atômica final: `80543525d17ee1a4d24b8150131907fcb64f206c`, alterando somente canário + ledger + contrato Matrix; CI `31959513580` + transversal `31959513510`, ambos `completed/success`;
- Matrix observada: `63 Composer / 15 legado / 12 fallback / 78 servidas / 11 divergências`; `modeSwaps=12`, `toolIntroductions=44`.

**W38 fechada em `63/15/12/78/11`.**

### 7.5 Seleção pós-W38 e contrato da W39

Restam **12 fallbacks**: `AL.08, GE.09, GE.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

O recálculo preserva **W39 = `N2.07 / F66 — A Fábrica de Retângulos`** — prereqs `N4.02 + N2.06`, primitiva `ArrayGrid`. `AL.08` tornou-se elegível após W38, mas permanece em onda causal mais profunda; o desempate executável mantém N2.07.

Contrato F66:

- fatores são as formas de arrumar um total em retângulos completos, sem sobras;
- níveis: pares até 12 com dica de quantidade → todos os pares até 24 → listar fatores sem dica → identificar primo pelo único retângulo `1×n` → maior fator comum de dois números;
- diagnósticos `ESQUECE_TRIVIAIS`, `PARA_CEDO`, `CONFUNDE_FATOR_MULTIPLO` precisam nascer no Radar ainda inativo;
- domínio 3/3 em 2 sessões, incluindo identificação de um primo no L4;
- a realização deve reutilizar o `ArrayGrid` real; helper/palco não cria uma falsa primitiva paralela;
- tentativa que deixa sobra deve permanecer visivelmente inválida; encontrar um retângulo não autoriza parar antes de esgotar as formações.

### 7.6 Fechamento técnico da W39

- regression-first/documentação pós-W38: `5eba881d5f20946674122a45ed19fc48868126c0`; CI `31960036621` vermelho nominal com falha única por ausência da `N2.07`, transversal `31960036647` success;
- materialização inativa: `eb194d4b42e97274989c9cf1d3c2522c4fbcffe5`; `FatoresRetangulosStage` reutiliza fisicamente `ArrayGrid`, mantém a sobra visível fora do retângulo completo e registra as três tags F66 aditivamente no Radar; CI `31976660344` + transversal `31976660441`, ambos `completed/success`;
- promoção atômica final: `e86627b779a6fb6bbd29807fa520533132df8a44`, alterando somente canário + ledger + contrato Matrix; CI `31977192229` + transversal `31977192249`, ambos `completed/success`;
- Matrix observada: `64 Composer / 15 legado / 11 fallback / 79 servidas / 11 divergências`; `modeSwaps=12`, `toolIntroductions=44`.

**W39 fechada em `64/15/11/79/11`.**

### 7.7 Seleção pós-W39 e contrato da W40

Restam **11 fallbacks**:

`AL.08, GE.09, GE.10, GM.11, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, PE.04`.

Todos os candidatos elegíveis têm ganho imediato de desbloqueio zero neste estado; `N5.05` ainda exige simultaneamente `N5.04 + N6.04`. O desempate causal executável da Matrix/DAG produz as próximas três seleções:

1. **W40 = `GE.09 / F91 — Círculo e Áreas`** — prereqs `GM.08 + GE.06`, primitiva `ShapeCanvas`, `causalWave=12`;
2. **W41 = `GE.10 / F92 — Volume e Vistas`** — prereqs `GE.04 + GM.08`, primitiva `ArrayGrid` em modo 3D, `causalWave=12`;
3. **W42 = `N4.11 / F70 — Primos e Divisores`** — prereqs `N4.07 + N4.10`, primitivas `ArrayGrid + Quadrado100`, `causalWave=13`.

Contrato F91:

- área deve ser **derivada visualmente**, não entregue como fórmula decorada;
- L1: dois triângulos iguais formam um retângulo e tornam visível a metade;
- L2: fórmula do triângulo `base × altura ÷ 2`, preservando a derivação;
- L3: cortar uma ponta do paralelogramo e encaixar do outro lado forma retângulo de mesma área;
- L4: círculo — raio, diâmetro e circunferência;
- L5: área do círculo por aproximação/rearranjo de setores;
- diagnósticos canônicos: `ESQUECE_DIVIDIR_POR_2`, `ALTURA_ERRADA`, `CONFUNDE_RAIO_DIAMETRO`; tags novas precisam nascer no Radar ainda inativo;
- domínio 3/3 em 2 sessões, incluindo pelo menos uma derivação de fórmula;
- a realização física deve reutilizar `ShapeCanvas`; palco/helper especializado não cria uma primitiva paralela;
- qualquer manipulação motora deve preservar alternativa por toque e tolerância generosa; precisão de dedo nunca prova conceito.

---

## 8. Branches de rascunho / dívida de limpeza

As branches abaixo são descartáveis, não são linha viva e nunca devem ser mergeadas:

- `codex/w24-dominio-inteiros`
- `codex/w31-promotion-staging`
- `codex/w33-promotion-staging`
- `codex/w33-docs-staging`
- `codex/w33-promotion-canonical-staging`
- `codex/w34-inactive-staging`
- `codex/w34-promotion-staging`
- `codex/blob-stage-w35`

O conector pode não expor remoção de branch/ref em todas as sessões. Até limpeza explícita, ignorar essas branches como fonte de verdade.

Não classificar `claude/w24-canary-contract-negative-j4kt89` como descartável por inferência: ela contém o commit de origem `a7423641...` já integrado na linha viva.

---

## 9. Design, cores e tipografia

- UI/ficha/palco novo usa papéis de `src/styles/tokens.ts` e classes já estabelecidas; não introduzir cor literal nova.
- Não regenerar baseline para silenciar catraca.
- Fredoka e Nunito permanecem as famílias escolhidas.
- Tipografia local está resolvida; não reabrir Google Fonts.
- A exceção binária continua restrita a `public/fonts/*.woff2`.

---

## 10. Protocolo vinculante de cada nova onda

### 10.1 Reancoragem

Antes de editar: PR/HEAD, Matrix, DAG, ficha canônica, runtime, mapa físico e precedentes.

### 10.2 Regression-first

Criar teste nominal do nó ainda não materializado. A falha precisa ser a ausência esperada de registro/contrato, não expectativa frouxa inventada para falhar.

### 10.3 Classificação de CI

Registrar separadamente conclusão global de cada workflow, evidência de Gates/job/log e falha regression-first vs falha real de implementação.

### 10.4 Materialização inativa

Criar ficha runtime, contrato/builder, palco, catálogo, renderer e wiring necessários **sem ativar canário**.

### 10.5 Runtime map antes da promoção

Se houver novo kind, specialized builder, renderer, modo ou palco composto, registrar a cadeia física em `ficha_runtime_map.cjs` ainda inativa. Respeitar §3.1: adicionar sem comprimir o cânone.

### 10.6 Auditoria pedagógica

Comparar implementação com a ficha canônica integral, níveis 1–5, tags, domínio, onboarding, exposição motora e resolução. CI estrutural verde não prova fidelidade pedagógica.

### 10.7 Gates determinísticos

Auditorias, TypeScript, suíte, build, guarda textual/binária e Matrix permanecem estritos. Não relaxar expectativa para ficar verde.

### 10.8 Portão inativo exato

**A promoção só é autorizada quando CI + Certificação transversal do MESMO SHA inativo estão ambos `completed/success`.** Consultar a API do SHA exato e, se ambos já estiverem verdes, executar imediatamente sem pedir confirmação.

### 10.9 Promoção atômica

Canário + ledger nominal + contrato Matrix no mesmo SHA. Depois:

1. deixar a Matrix observar o delta real;
2. investigar qualquer diferença antes de ajustar expectativa;
3. certificar CI + transversal do SHA final;
4. só então fechar checkpoint/porta/corpo do PR.

### 10.10 Cadência W35+

- Não reportar a cada onda; reportar somente a cada 5 ondas, salvo parada real comprovada.
- Fechamento documental da onda N e regression-first da onda N+1 entram no **mesmo push**.
- O SHA regression-first é vermelho por desenho e não substitui o recibo técnico final da onda N.
- Em cada recálculo, calcular as três próximas seleções de uma vez pelo critério determinístico.
- Serialização obrigatória: materialização inativa → dois workflows verdes → promoção atômica → Matrix honesta → dois workflows finais verdes.

---

## 11. Autonomia e restrições

Pode agir autonomamente dentro deste protocolo: investigar, testar, corrigir e avançar ondas sem pedir confirmação a cada passo.

Não pode:

- tocar/mergear `main`;
- marcar PR #35 ready;
- habilitar auto-merge;
- tocar Creature Engine/Tamagotchi;
- mergear branches de staging/rascunho;
- relaxar testes, Matrix, auditorias ou sondas;
- inventar recibos;
- comprimir cânone compartilhado;
- introduzir cores literais sem decisão semântica;
- ampliar a exceção de binários além de `public/fonts/*.woff2`;
- reabrir tipografia já resolvida.

---

## 12. Próximo passo em uma nova retomada

1. reancorar o PR #35 no remoto;
2. confirmar que W39 continua fechada em `64/15/11/79/11` e 64 canários, com recibo final `e86627b...` / CI `31977192229` / transversal `31977192249`;
3. localizar o regression-first nominal da W40 no HEAD atual;
4. reancorar F91/GE.09 integralmente, inclusive tags do Radar e reutilização física do `ShapeCanvas`;
5. seguir §§10.1–10.10 sem pular runtime map, portão inativo ou promoção atômica;
6. após W40 final verde, recalcular Matrix/DAG e atualizar porta/corpo do PR;
7. preservar a fila calculada W41 `GE.10/F92` e W42 `N4.11/F70`, salvo deriva real observada.
