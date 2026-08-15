# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Fonte operacional de verdade para retomar o PR #35.**
> Leia este arquivo integralmente antes de editar. O remoto vence memória de conversa, prompt antigo e SHA histórico.

---

## 1. Âncora remota

Repositório: `dyegorodrigues/SAGA`  
PR: `#35` — deve permanecer **open + draft + unmerged**  
Branch: `codex/fechamento-curricular`  
Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`

Antes de editar:

1. confirme o HEAD remoto da branch e o estado do PR;
2. consulte os workflows do **SHA exato** que pretende usar como recibo;
3. se o SHA já tiver CI + transversal `success`, **não aguarde de novo: execute o próximo passo**;
4. reancore Matrix, DAG, ficha e runtime no estado vivo;
5. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca registrar ID de run, SHA, contagem de testes ou delta de Matrix sem fonte que o prove. Número plausível não é recibo.

**Regra de classificação:** conclusão de workflow e evidência de job/log são fatos distintos. Workflow `cancelled` continua `cancelled` mesmo quando um job já terminou `failure`. Workflow `failure` só é chamado de `failure` quando a API global assim o classifica.

---

## 2. Documentos de continuidade

Ler, conforme a área:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md`;
- `AI_Studio_Lab/codex/ROADMAP_PRODUTO_E_EXPANSAO.md`;
- checkpoints fechados W20–W24 e W25–W29;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W30_W34_EM_CURSO_2026-08-15.md`.

O checkpoint é recibo humano; **Coverage Matrix, canário, DAG e runtime vivos são a autoridade executável**.

---

## 3. Arquitetura operacional que não pode regredir

- `composerCanaryIds.ts`, `coverage_matrix_core.ts` e `ficha_runtime_map.cjs` são **declarativos**.
- Não criar mutação por efeito colateral de import para canário, ledger, Matrix ou mapa runtime.
- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- Promoção e linha nominal do ledger caminham no **mesmo SHA**.
- A Matrix observa o delta real; baseline não mascara deriva.
- Não tocar nem mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.
- Não mergear `codex/w24-dominio-inteiros`.
- `codex/w31-promotion-staging` é rascunho redundante da W31; **não mergear**.

### Design, cores e tipografia

A catraca de cores é vinculante:

- ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline para silenciar a catraca;
- se faltar papel semântico, ampliar tokens deliberadamente.

A família tipográfica continua estética do dono: **Fredoka e Nunito permanecem exatamente as famílias escolhidas**.

A origem do arquivo é infraestrutura. Self-host das mesmas fontes está liberado, mas:

- eventual exceção em `AI_Studio_Lab/tools/pr_text_guard.cjs` deve aceitar **somente `public/fonts/*.woff2`**;
- não liberar binários em geral, outros diretórios ou outras extensões;
- só versionar fonte oficial com integridade conferida;
- se download/transporte não for confiável no ambiente, registrar bloqueio e **seguir a fábrica curricular**.

Estado atual: o transporte confiável dos WOFF2 não foi obtido neste ambiente; tipografia está **bloqueada por acesso de rede/transporte e não bloqueia a fábrica**. Não improvisar bytes e não trocar Fredoka/Nunito.

A dívida de rede está comprovada por 27 HTTP 404 em 27 navegações da dependência externa.

---

## 4. Estado curricular vivo após W32

Ondas **W1–W32 fechadas**.

Coverage Matrix do SHA promovido W32:

- **57 Composer**
- **15 legado**
- **18 fallback**
- **72 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

A suíte do bloco W32 contém **219 arquivos / 3.076 testes**. O gate do SHA promovido passou integralmente: auditoria do catálogo, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual.

A catraca de cores permaneceu verde; a W32 não introduziu cor literal nova no palco novo.

### Últimas ondas

- W24 `N7.01/F84`: final `083632d1cf24826cb94c3bc3450245a76333b60d`; CI `31840606795` + transversal `31840606811`, `success`.
- W25 `PE.02/F64`: final `650ac6464a209a723d47e734c648f25c9766dc62`; CI `31843453601` + transversal `31843453565`, `success`.
- W26 `GM.08/F81`: final `bb44915264ff55e8f26282e910c9952712ce28f0`; CI `31853166671` + transversal `31853166653`, `success`.
- W27 `AL.06/F77`: final `25b0307291f70cd97a886794efe060a24bf7aa2e`; CI `31857701286` + transversal `31857701285`, `success`.
- W28 `GE.05/F60`: promoção `2377aafc1b0ae7f8652c4af1f20197d3904b8f1f`; CI `31858733127` + transversal `31858733049`, `success`.
- W29 `GE.04/F59`: promoção `3a705e28de30e6a785645864957727134c213256`; CI `31864419504` + transversal `31864419499`, `success`.
- W30 `N2.06/F38`: final `05b7787e7239db4c687b5fa7cc47ee0b4f256447`; CI `31883452067` + transversal `31883452082`, `success`.
- W31 `PE.03/F83`: promoção `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`; CI `31908549456` + transversal `31908549471`, `success`, attempt 1.
- W32 `GM.09/F82`: promoção `40ef8eb13cd93d1a0b2e60375964853e62118e24`; CI `31913688446` + transversal `31913688438`, ambos `completed/success`, attempt 1.

### Padrão vinculante de evidência

- W29/W31 demonstram por que conclusão global e job devem ser separados.
- Antes de qualquer “aguardando workflow”, consultar `fetch_commit_workflow_runs` ou API equivalente no **SHA exato**.
- Se os dois workflows já estiverem `completed/success`, execute imediatamente.

---

## 5. W31 — PE.03 / F83 — resumo fechado

Pré-requisitos `PE.02`, `N4.10`, `N5.02`; primitiva `SingaporeBars`; `MediaChanceStage` / `media-chance-f83`.

Regression `5a2831f6519456ffaf77e93dc6bcdd988f223149`:

- CI `31907540508`: `cancelled`;
- Gates `95067597810`: `failure`, exatamente os 2 testes W31 desenhados;
- 217 arquivos / 3.055 testes anteriores verdes;
- transversal `31907540753`: `success`.

Portão inativo `81ffa9b608ecc25a5579c7e906bafa8889dbf101`:

- CI `31908108818`: `success`;
- transversal `31908108833`: `success`.

Promoção `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`:

- canário + `W31-PE.03` + contrato Matrix no mesmo SHA;
- Matrix `56/15/19/71/11`;
- 218 arquivos / 3.072 testes;
- CI `31908549456` + transversal `31908549471`, `success`.

**W31 fechada.**

---

## 6. W32 — GM.09 / F82 — Conversões e problemas de medida

Pré-requisitos canônicos: `GM.05`, `N4.08`, `N6.01`.  
Primitivas autorais: `NumberLine + Balanca`.  
Realização: `ProblemasMedidaStage` / kind `problemas-medida-f82`.

Escada preservada:

1. converter cm↔m;
2. converter g↔kg e ml↔L;
3. comparar somente após converter para a mesma unidade;
4. operar unidades mistas após conversão;
5. resolver problema multietapas de medida.

Diagnósticos: `COMPARA_SEM_CONVERTER`, `INVERTE_OPERACAO`, `MISTURA_GRANDEZAS`.  
Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

### Regression-first

SHA `fd05ef22ead9c01f8c274d69bba37e2e25422bd4`.

**Conclusão global:**

- CI `31912881313`: **`failure`**;
- transversal `31912881318`: `success`.

**Evidência do job:**

- Gates `95080511297`: `failure`;
- exatamente os 2 testes W32 falharam porque GM.09 ainda não estava registrada/ativável no Composer;
- **218 arquivos / 3.072 testes anteriores verdes**.

Aqui, diferentemente de W31, o workflow CI realmente terminou `failure`; não houve reclassificação de cancelamento.

### Materialização inativa

SHA final inativo `ddaf40bfa1ac88ddd3c8c60046b058958963c0e5`.

A materialização contém ficha F82, contrato, `ProblemasMedidaStage`, renderer, registro no Composer e mapa runtime. O palco compõe fisicamente `NumberLine + Balanca`, usa tokens e GM.09 permanece fora do canário.

Gate inativo:

- CI `31913279161`: `success`;
- transversal `31913279171`: `success`.

Gates do SHA inativo:

- 57 fichas Composer registradas, 56 ativas, GM.09 única registrada/inativa;
- Matrix ainda `56/15/19/71/11`;
- suíte **219 arquivos / 3.076 testes**;
- auditorias, conformidade, grafo, TypeScript, build, guarda textual e cores verdes.

### Promoção atômica e fechamento

SHA `40ef8eb13cd93d1a0b2e60375964853e62118e24`.

Entraram somente:

- `GM.09` no canário declarativo;
- `W32-GM.09` no ledger;
- contrato executável da Matrix atualizado para `57/15/18/72/11`.

O job Gates `95082366897` terminou `success`, com auditoria do catálogo, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual verdes. Como o contrato da Matrix exige o baseline exato e o gate passou, o estado promovido é **57 Composer / 15 legado / 18 fallback / 72 servidas / 11 divergências**.

Conclusão global do mesmo SHA:

- CI `31913688446`: `completed/success`, attempt 1;
- Certificação transversal `31913688438`: `completed/success`, attempt 1.

**W32 está fechada.**

---

## 7. Ledger, Matrix e runtime map

O ledger nominal em `AI_Studio_Lab/tools/coverage_matrix_core.ts` vai até **W32-GM.09**.

Regras:

- linha nova no array declarativo é atualização normal;
- canário + ledger entram no mesmo SHA da promoção;
- a Matrix observa o delta real;
- `ficha_runtime_map.cjs` descreve cadeia física comprovada;
- divergência só muda quando a fonte real justificar;
- nenhuma mutação por side effect/import.

---

## 8. Seleção fallback-first — estado pós-W32

Restam **18 fallbacks**:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Elegibilidade: candidato somente quando **todos** os prereqs já estão servidos.

Valor de desbloqueio: contar apenas fallbacks adicionais que passam a ter todos os prereqs servidos após a promoção hipotética.

Pós-W32:

- 16 fallbacks estão imediatamente elegíveis;
- `AL.08` continua bloqueado por `AL.07 + N7.02`;
- `N5.05` continua bloqueado por `N5.04 + N6.04`;
- os 16 elegíveis têm ganho imediato **0**.

Desempate vinculante:

1. maior ganho imediato;
2. empate → ordem causal executável da Matrix/DAG (`causalWave` crescente, depois maior impacto downstream, depois ID);
3. empate residual → menor delta estrutural / continuidade local.

No estado vivo pós-W32, **GE.07** é o primeiro dos empatados na ordem causal (`causalWave=4`).

Portanto, sem deriva remota, **W33 = `GE.07 / F79 — Polígonos: triângulos e quadriláteros`**.

---

## 9. Contrato canônico já reancorado para W33

Competência: `GE.07`.  
Ficha: `F79 — Polígonos: triângulos e quadriláteros`.  
Pré-requisitos: `GE.03`, `GE.06`.  
Primitivas: `ShapeCanvas + DragGroup`.

Escada:

1. identificar polígono por fechamento + lados retos, com não-exemplo aberto;
2. reconhecer triângulos em orientações variadas;
3. reconhecer/agrupar quadriláteros;
4. classificar por propriedades, preservando que **quadrado também é retângulo**;
5. construir e classificar polígono sob pelo menos duas condições simultâneas.

Diagnósticos: `NAO_FECHA`, `CONTA_LADOS_ERRADO`, `CONFUNDE_CLASSE`.  
Resolução: R0-A.  
Domínio: reconhecimento/classificação 3/3 em 2 sessões; construção 2/3 em 2 sessões.  
Acessibilidade: contornos visíveis, rótulo além de cor e alternativa por toque ao arrasto.

A W33 deve nascer por regression-first; GE.07 não pode ser colocada no canário antes do portão inativo.

---

## 10. Protocolo de uma onda

1. Reancorar HEAD, PR, Matrix, DAG, ficha, runtime e workflows.
2. Recalcular seleção apenas se houver deriva; caso contrário siga a seleção provada.
3. Ler ficha canônica + DAG + runtime + análogo + design.
4. **Regression-first**: teste nominal, commit, observar falha desenhada.
5. **Materializar INATIVO**: ficha/builder/stage/renderer/runtime, sem ID no canário.
6. Rodar/observar auditorias, fichas, conformidade, grafo, TypeScript, suíte, Matrix, cores e build.
7. **Portão inativo**: CI + transversal verdes no mesmo SHA. Antes de aguardar, consultar API.
8. **Promover**: ID no canário.
9. **Ledger no mesmo SHA**: `{ composer:+1, fallback:-1, served:+1 }` salvo se a Matrix provar outra coisa.
10. Matrix observa o delta real.
11. **Certificar promoção/final**: CI + transversal verdes no SHA exato. Antes de aguardar, consultar API.
12. Documentar somente depois da prova.
13. Correção posterior de runtime cria novo recibo final e exige os dois workflows verdes.

---

## 11. Definition of Done

Uma onda só fecha quando:

- seleção está correta no DAG vivo;
- regression-first deixou evidência da falha pretendida;
- implementação inativa respeita ficha/runtime/design;
- nenhuma cor literal nova escapou;
- CI + transversal do SHA inativo estão verdes;
- promoção + ledger são atômicos;
- Matrix observou o delta real;
- CI + transversal da promoção/final estão verdes;
- documentação/porta de retomada está sincronizada;
- `main` continua intocada.

---

## 12. Restrições duras

- NÃO tocar `main`.
- NÃO mergear PR #35.
- NÃO marcar ready.
- NÃO habilitar auto-merge.
- NÃO tocar Creature Engine/Tamagotchi.
- NÃO mergear `codex/w24-dominio-inteiros`.
- NÃO mergear `codex/w31-promotion-staging`.
- NÃO relaxar testes, Matrix, auditorias ou sondas para conseguir verde.
- NÃO promover ficha só porque foi registrada.
- NÃO criar ledger mutável por import.
- NÃO contar filho direto como desbloqueio sem verificar todos os prereqs.
- NÃO esperar verde no commit regression-first.
- NÃO chamar workflow `cancelled` de `failure`.
- NÃO introduzir cor literal nova.
- NÃO regenerar baseline de cores para silenciar a catraca.
- NÃO trocar Fredoka/Nunito por conveniência de infraestrutura.
- NÃO aceitar binário de fonte sem integridade verificada.
- NÃO inventar ID de run, SHA, contagem ou delta.

---

## 13. Autonomia e próximo passo

Há autonomia para executar o ciclo técnico completo sem pedir confirmação a cada microetapa.

### Próxima ação ao retomar

1. confirme HEAD/PR e workflows do SHA atual;
2. confirme Matrix viva em torno de **57/15/18/72/11**;
3. se nada derivou, abra **W33 `GE.07/F79`** por regression-first;
4. preserve `ShapeCanvas + DragGroup`, classificação por propriedades, quadrado⊂retângulo e alternativa por toque;
5. siga o protocolo integral, incluindo catraca de cores;
6. mantenha tipografia como infraestrutura paralela bloqueada até haver transporte verificável;
7. após fechar W33, atualizar checkpoint/PR/porta de retomada e seguir fallback-first.

Não transforme reancoragem em diagnóstico longo quando o próximo passo já está autorizado. Confirme o necessário e execute.
