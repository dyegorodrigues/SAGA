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

**Regra de evidência:** nunca registrar ID de run, SHA, contagem de testes ou delta de Matrix sem consultar a fonte que o prova. Se a evidência não puder ser aberta, escrever `não verificado`. Número plausível não é recibo.

**Regra de classificação:** conclusão de workflow e evidência de job/log são fatos distintos. Um workflow `cancelled` continua `cancelled` mesmo quando um job já terminou `failure` e deixou a falha regression-first registrada.

---

## 2. Documentos de continuidade

Ler, quando a tarefa tocar a área correspondente:

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
- `codex/w31-promotion-staging` é rascunho redundante anterior à promoção atômica da W31; **não mergear**.

### Design, cores e tipografia

A catraca de cores está vinculante:

- ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline só para silenciar a catraca;
- se faltar papel semântico, ampliar o sistema de tokens de forma deliberada.

A família tipográfica continua decisão estética do dono: **Fredoka e Nunito permanecem exatamente as famílias escolhidas**.

A origem do arquivo é infraestrutura, não design. Está liberado remover a dependência de rede hospedando as mesmas fontes localmente. Caminho autorizado:

- exceção **estreita** em `AI_Studio_Lab/tools/pr_text_guard.cjs` para `public/fonts/*.woff2` somente;
- nenhuma exceção geral para binários, outros diretórios ou outras extensões;
- baixar arquivos oficiais de Fredoka/Nunito e verificar integridade antes de commit;
- se o transporte/download não for confiável no ambiente, registrar o bloqueio e **seguir a fábrica curricular**; não improvisar bytes, não trocar família e não usar fonte não verificável.

A evidência que motivou essa dívida está registrada nos documentos de design: 27 respostas HTTP 404 em 27 navegações da dependência externa; o fechamento anterior só ocorreu no attempt 2.

---

## 4. Estado curricular vivo após W31

Ondas **W1–W31 fechadas**.

Coverage Matrix observada no gate da promoção W31:

- **56 Composer**
- **15 legado**
- **19 fallback**
- **71 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Suíte observada no SHA promovido W31: **218 arquivos / 3.072 testes**, todos verdes.

A catraca de cores passou e a W31 adicionou **zero cores literais novas**.

### Últimas ondas

- W24 `N7.01/F84`: final `083632d1cf24826cb94c3bc3450245a76333b60d`; CI `31840606795` + transversal `31840606811`, ambos `success`.
- W25 `PE.02/F64`: final `650ac6464a209a723d47e734c648f25c9766dc62`; CI `31843453601` + transversal `31843453565`, ambos `success`.
- W26 `GM.08/F81`: final `bb44915264ff55e8f26282e910c9952712ce28f0`; CI `31853166671` + transversal `31853166653`, ambos `success`.
- W27 `AL.06/F77`: fechamento `25b0307291f70cd97a886794efe060a24bf7aa2e`; CI `31857701286` + transversal `31857701285`, ambos `success`.
- W28 `GE.05/F60`: promoção `2377aafc1b0ae7f8652c4af1f20197d3904b8f1f`; CI `31858733127` + transversal `31858733049`, ambos `success`.
- W29 `GE.04/F59`: promoção `3a705e28de30e6a785645864957727134c213256`; CI `31864419504` + transversal `31864419499`, ambos `success`.
- W30 `N2.06/F38`: fechamento corrigido `05b7787e7239db4c687b5fa7cc47ee0b4f256447`; CI `31883452067` + transversal `31883452082`, ambos `success`.
- W31 `PE.03/F83`: promoção `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`; CI `31908549456` + transversal `31908549471`, ambos `completed/success`, attempt 1.

### W29/W30 — padrão de evidência que permanece vinculante

Quando um run termina `cancelled` por concorrência mas o job Gates já falhou pelo contrato regression-first, registrar **os dois fatos separadamente**. Não rebatizar o workflow.

### W31 — PE.03 / F83 — Média e Chance

Pré-requisitos canônicos: `PE.02`, `N4.10`, `N5.02`.  
Primitiva autoral: `SingaporeBars`.  
Realização: `MediaChanceStage` / kind `media-chance-f83`.

Escada preservada:

1. nivelar três torres preservando o total;
2. nivelar cinco torres;
3. calcular média inteira;
4. introduzir chance como favoráveis/total e a ponte de média fracionária;
5. comparar chances preservando a ponte de média fracionária, inclusive média que não coincide com valor observado.

Diagnósticos: `MEDIA_IMPOSSIVEL`, `ESQUECEU_DIVIDIR`, `IGNORA_TOTAL`.  
Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

#### Regression-first

SHA `5a2831f6519456ffaf77e93dc6bcdd988f223149`.

- workflow CI `31907540508`: **`cancelled`**;
- job `Gates do SAGA` `95067597810`: **`failure`** antes do cancelamento;
- o log mostra exatamente os 2 testes W31 vermelhos:
  - `hasComposerFicha("PE.03") === false`;
  - tentativa de ativação rejeitada porque PE.03 ainda não estava em `COMPOSER_FICHAS`;
- **217 arquivos / 3.055 testes anteriores passaram**;
- transversal `31907540753`: `success`.

Formulação correta: **o log do job prova a falha desenhada; o workflow CI terminou `cancelled`**.

#### Materialização inativa

Cadeia de implementação:

- `ed6ff4b0aeba922ec50b7781c21a0117f12dc063` — materializa ficha, contrato, palco, renderer e registro inativo;
- `e5fc7c4481f80bd49e0e319a0fc87f8729e3870d` — completa `rt_alvo` L5;
- `81ffa9b608ecc25a5579c7e906bafa8889dbf101` — reconcilia o mapa runtime `SingaporeBars → MediaChanceStage`.

Portão inativo final no SHA `81ffa9b608ecc25a5579c7e906bafa8889dbf101`:

- CI `31908108818`: `success`;
- transversal `31908108833`: `success`.

#### Promoção atômica e fechamento

SHA `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`.

No mesmo SHA entraram somente:

- `PE.03` no canário declarativo;
- `W31-PE.03` no ledger;
- contrato executável da Matrix para o novo baseline.

Evidência do job Gates:

- Matrix **56/15/19/71/11**;
- `PE.03 / F83` aparece `padrao-ouro`, `SingaporeBars`, conformidade `ok`;
- suíte **218 arquivos / 3.072 testes**;
- TypeScript, build, catálogo, fichas, conformidade, grafo e `pr:check` verdes;
- catraca de cores verde; zero cor literal nova na W31.

Conclusão global dos workflows do mesmo SHA:

- CI `31908549456`: `completed/success`, attempt 1;
- Certificação transversal `31908549471`: `completed/success`, attempt 1.

**W31 está fechada.**

---

## 5. Dois workflows e regra anti-espera

Cada SHA que funciona como portão deve ser julgado pelos dois workflows:

1. `CI`;
2. `Certificação transversal`.

A separação por SHA já foi provada. Não refazer o teste de concorrência por rotina.

Antes de dizer “aguardando”, consultar `fetch_commit_workflow_runs`/API equivalente para o **SHA exato**. Se ambos já estiverem `completed/success`, o próximo passo é executar, não aguardar. Esta regra existe porque a fábrica já perdeu throughput ao parar após recibos que já estavam verdes.

---

## 6. Ledger, Matrix e runtime map

O ledger nominal em `AI_Studio_Lab/tools/coverage_matrix_core.ts` vai até **W31-PE.03**.

Regras:

- linha nova no array declarativo é atualização normal;
- canário + ledger entram no mesmo SHA da promoção;
- a Matrix observa o delta real;
- `ficha_runtime_map.cjs` descreve cadeia física comprovada;
- divergência só muda quando a fonte real justificar;
- nenhuma mutação por side effect/import.

---

## 7. Seleção fallback-first — estado pós-W31

Restam **19 fallbacks**:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.09, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Elegibilidade: fallback só é candidato quando **todos** os prereqs já estão servidos.

Valor de desbloqueio: contar apenas fallbacks adicionais que passam a ter **todos** os prereqs servidos após a promoção hipotética.

No recálculo vivo pós-W31:

- **GM.09** é o único elegível com ganho imediato **1**, pois torna `GM.11` elegível;
- os outros 15 elegíveis têm ganho imediato 0.

Portanto, sem deriva remota, **W32 = `GM.09` — Conversões e problemas de medida**.

Esta linha registra o estado vivo observado; antes de codificar, faça apenas a reancoragem mínima para detectar deriva, não reinicie a seleção já resolvida sem evidência nova.

---

## 8. Regression-first

Cada onda nasce com teste nominal que deve falhar pelo motivo desejado antes da materialização.

No SHA regression-first:

- observe a falha correta no job/log;
- não espere verde nesse mesmo commit;
- não relaxe expectativa;
- depois da prova, materialize inativo.

Se o workflow for cancelado por concorrência depois que Gates já falhou, registre conclusão do workflow e evidência do job separadamente.

---

## 9. Protocolo de uma onda

1. **Reancorar** HEAD, PR, Matrix, DAG, ficha, runtime e workflows.
2. **Recalcular apenas se houver deriva**; caso contrário siga a seleção já provada.
3. Ler ficha canônica + DAG + runtime + implementação análoga + design.
4. **Regression-first**: teste nominal, commit, observar falha desenhada.
5. **Materializar INATIVO**: ficha/builder/stage/renderer/runtime, sem ID no canário.
6. Rodar/observar gates determinísticos: auditorias, fichas, conformidade, grafo, TypeScript, suíte, Matrix, cores, build.
7. **Portão inativo remoto**: CI + transversal verdes no mesmo SHA. Antes de aguardar, consultar API.
8. **Promover**: ID no canário.
9. **Ledger no mesmo SHA**: delta esperado `{ composer: +1, fallback: -1, served: +1 }`.
10. **Matrix observa**; se divergir, investigar.
11. **Certificar promoção/final**: CI + transversal verdes no SHA exato. Antes de aguardar, consultar API.
12. **Documentar** somente depois da prova.
13. Se runtime da onda for corrigido depois da promoção, o SHA corrigido vira o recibo final e precisa dos dois workflows verdes.

O bloco W30–W34 continua em curso no checkpoint correspondente.

---

## 10. Throughput e uso correto do tempo

Sondas longas provam runtime real. Use o tempo para preparar análise em staging/blobs não referenciados, mas não mova a branch se isso invalidar portão em curso.

Não fique ocioso após recibo já verde.

Não empilhe promoções: cada onda mantém causalidade e recibos próprios.

Infraestrutura não bloqueante — como self-host de fonte — não deve interromper a fábrica se o ambiente não permitir transporte verificável do asset.

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
- NÃO regenerar baseline de cores só para silenciar a catraca.
- NÃO trocar Fredoka/Nunito por conveniência de infraestrutura.
- NÃO aceitar binário de fonte sem integridade verificada.
- NÃO inventar ID de run, SHA, contagem ou delta.

---

## 13. Autonomia e próximo passo

Há autonomia para executar o ciclo técnico completo sem pedir confirmação a cada microetapa.

### Próxima ação ao retomar

1. confirme o HEAD remoto e os workflows do SHA atual;
2. confirme Matrix viva em torno de **56/15/19/71/11**;
3. se nada derivou, abra **W32 `GM.09`** por regression-first;
4. leia contrato canônico de GM.09/F82, DAG, runtime e `DESIGN_ESTADO_E_DECISOES.md`;
5. siga o protocolo integral, incluindo catraca de cores;
6. mantenha tipografia como infraestrutura paralela: só commitar WOFF2 se o transporte e a integridade forem verificáveis;
7. após fechar W32, atualizar checkpoint/PR/porta de retomada e continuar fallback-first.

Não transforme reancoragem em diagnóstico longo quando o próximo passo já está autorizado. Confirme o necessário e execute.
