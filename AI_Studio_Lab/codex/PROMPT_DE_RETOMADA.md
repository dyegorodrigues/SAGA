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

1. confirme HEAD remoto da branch e estado do PR;
2. confira os workflows do SHA exato que pretende usar como recibo;
3. reancore Matrix, DAG, ficha e runtime no estado vivo;
4. se houver deriva, investigue antes de escrever — o remoto vence este documento.

**Regra de evidência:** nunca registrar ID de run, SHA, contagem de testes ou delta de Matrix sem ter consultado a fonte que o prova. Se a evidência não puder ser aberta, escrever `não verificado`. Número plausível não é recibo.

---

## 2. Documentos de continuidade

Ler, quando a tarefa tocar a área correspondente:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` — **leia antes de tocar em qualquer cor, fonte ou espaçamento**. A paleta por operação aritmética foi decidida pelo dono do projeto e não se reabre;
- checkpoints de fábrica já fechados W20–W24 e W25–W29;
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W30_W34_EM_CURSO_2026-08-15.md` enquanto o bloco atual estiver aberto.

O checkpoint é recibo humano; **Coverage Matrix, canário, DAG e runtime vivos são a autoridade executável**.

---

## 3. Arquitetura operacional que não pode regredir

- `composerCanaryIds.ts`, `coverage_matrix_core.ts` e `ficha_runtime_map.cjs` são **declarativos**.
- Não criar mutação por efeito colateral de import para canário, ledger, Matrix ou mapa runtime.
- Registrar ficha no Composer **não ativa** competência. Promoção acontece somente no array declarativo do canário.
- Promoção e linha nominal do ledger caminham no **mesmo SHA**.
- Não tocar nem mergear `main`.
- Não tocar Creature Engine/Tamagotchi neste fluxo.
- Não mergear `codex/w24-dominio-inteiros`; é trabalho duplicado da W24.

### Catraca de cores

A integração de `e6bb655` trouxe `DESIGN_ESTADO_E_DECISOES.md`, `src/styles/coresLiterais.test.ts`, baseline e `npm run cores:baseline`.

A partir dela:

- ao materializar ficha ou palco, usar os papéis de `src/styles/tokens.ts` em vez de escrever cor literal;
- o gate recusa cor literal nova;
- se faltar papel semântico, acrescentar o token ao sistema em vez de espalhar cor solta em componente;
- `npm run cores:baseline` não é atalho para fazer o gate aceitar dívida nova: baseline só muda quando a decisão de design correspondente é deliberada e justificada;
- a paleta por operação aritmética registrada em `DESIGN_ESTADO_E_DECISOES.md` é decisão do dono do projeto e não deve ser reaberta pela fábrica curricular.

---

## 4. Estado curricular vivo após W30

Ondas **W1–W30 fechadas**.

Coverage Matrix observada no gate final da W30:

- **55 Composer**
- **15 legado**
- **20 fallback**
- **70 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

A suíte observada no fechamento corrigido da W30 é **217 arquivos / 3.055 testes**, todos verdes. `src/styles/coresLiterais.test.ts` passou.

### Últimas ondas

- W24 `N7.01/F84`: final `083632d1cf24826cb94c3bc3450245a76333b60d`; CI `31840606795` + transversal `31840606811`, ambos `success`.
- W25 `PE.02/F64`: final `650ac6464a209a723d47e734c648f25c9766dc62`; CI `31843453601` + transversal `31843453565`, ambos `success`.
- W26 `GM.08/F81`: final `bb44915264ff55e8f26282e910c9952712ce28f0`; CI `31853166671` + transversal `31853166653`, ambos `success`.
- W27 `AL.06/F77`: fechamento reconciliado `25b0307291f70cd97a886794efe060a24bf7aa2e`; CI `31857701286` + transversal `31857701285`, ambos `success`.
- W28 `GE.05/F60`: promoção `2377aafc1b0ae7f8652c4af1f20197d3904b8f1f`; CI `31858733127` + transversal `31858733049`, ambos `success`.
- W29 `GE.04/F59`: promoção `3a705e28de30e6a785645864957727134c213256`; CI `31864419504` + transversal `31864419499`, ambos `success`.
- W30 `N2.06/F38`: promoção `c1e7512e912421d3d1923838bf3050218e92fc59`; CI `31883028645` + transversal `31883028668`, ambos `success`; fechamento corrigido `05b7787e7239db4c687b5fa7cc47ee0b4f256447`; CI `31883452067` + transversal `31883452082`, ambos `success`.

### W28 — correção de classificação da regression-first

No SHA `e3d41ac72a6a474253e73b4756dabdbb5099201f`, o CI `31858118039` terminou **cancelled**, não `failure`; a transversal `31858118099` terminou `success`. O fechamento posterior da W28 continua certificado pelo inativo e pela promoção, mas o run cancelado permanece registrado exatamente como cancelado.

### W29 — correção de classificação consolidada

No SHA regression-first `52bdb4e249b5d9a9f9535cda46f244ccc1dc52c3`:

- workflow CI `31863719586` terminou **`cancelled` por concorrência**;
- o job `Gates do SAGA` `94961316286` terminou `failure` antes do cancelamento;
- o log desse job mostra a falha desenhada: os 2 testes novos falharam porque `GE.04` ainda não estava registrada, enquanto **213 arquivos / 3.016 testes anteriores passaram**.

Nunca reclassificar o workflow cancelado como `failure`; registrar separadamente a conclusão do run e a evidência do job/log.

### W30 — N2.06 / F38 — Pares e Ímpares

Regression-first `9dc0e61df21f780249f42aaf66785ff69c6d6e76`:

- workflow CI `31882060323` terminou **`cancelled` por concorrência**;
- o job `Gates do SAGA` `95005940004` terminou `failure` antes do cancelamento;
- o log mostrou a falha desenhada nos 2 testes novos porque `N2.06` ainda não existia no Composer; os testes anteriores permaneceram verdes.

Portão inativo final `c62beaadfe10b903d6054aa56ef688c269ff5288`:

- CI `31882628417`: `success`;
- transversal `31882628429`: `success`.

A materialização registra `N2.06/F38`, `ParesImparesStage`, contrato canônico, renderer e runtime `DragGroup#duplas` sem ativar o canário até o portão inativo. A escada preservada é: formar duplas até 10 → até 20 → decidir sem formar → regra do último algarismo → paridade de somas; diagnósticos `CONFUNDE_TAMANHO`, `ZERO_IMPAR`, `DECORA_SEM_ENTENDER`; resolução R0-A e domínio 3/3 em 2 sessões.

Promoção atômica `c1e7512e912421d3d1923838bf3050218e92fc59`:

- canário + `W30-N2.06` no ledger + baseline executável da Matrix no mesmo SHA;
- Matrix observada: **55/15/20/70/11**;
- suíte observada: **216 arquivos / 3.053 testes**;
- CI `31883028645`: `success`;
- transversal `31883028668`: `success`.

Revisão de runtime após a promoção encontrou um ciclo possível causado pela identidade inline de `onProgress` no `DragGroup`. O fechamento final `05b7787e7239db4c687b5fa7cc47ee0b4f256447` corrige isso de forma isolada, estabiliza a notificação de progresso, dá tutorial semântico ao modo `duplas` e mantém cores via `tokens.ts`. O teste de montagem novo protege a regressão.

No SHA corrigido:

- Matrix permaneceu **55/15/20/70/11**;
- `coresLiterais.test.ts` passou;
- suíte: **217 arquivos / 3.055 testes**, todos verdes;
- CI `31883452067`: `success`;
- transversal `31883452082`: `success`.

### Auditoria histórica W20/W21 — evidência corrigida

**W20 final `74c6f0eba896ec884a1d88542c8790d679b0e2cb`: não plenamente verificado.**

- CI `31805123752`: `failure`;
- Certificação transversal: **nenhum run localizado para esse SHA** nas consultas feitas.

Não fabricar um par verde para preencher a lacuna.

**W21 final `35cd96b27f9621d9882dfdd83a1f7442142ebb92`: verificado.**

- CI `31814487722`: `success`;
- transversal `31814487733`: `success`;
- execução posterior: CI `31819865662` `cancelled` + transversal `31819865551` `success`.

O par verde anterior no mesmo SHA é recibo válido; o cancelamento posterior não o apaga.

---

## 5. Dois workflows e concorrência

Cada SHA que funciona como portão deve ser julgado pelos **dois workflows**:

1. `CI` — gates determinísticos, Sensei real, higiene, binários;
2. `Certificação transversal` — 390px × sementes + 320/900px.

A separação por SHA já foi provada. Não refazer teste de concorrência por rotina. Antes de esperar, consulte o estado real do SHA exato: se já está verde, execute o próximo passo.

---

## 6. Ledger, Matrix e runtime map

O ledger nominal vive em `AI_Studio_Lab/tools/coverage_matrix_core.ts` e vai até **W30-N2.06**.

Regras:

- uma linha nova no array declarativo é atualização normal; não criar arquivo de extensão que precise ser importado para “valer”;
- canário + ledger entram no mesmo SHA da promoção;
- a Matrix observa o delta real; não editar baseline para esconder comportamento inesperado;
- `ficha_runtime_map.cjs` descreve cadeia física comprovada; array vazio é lacuna, não licença para inferir;
- divergência só cai quando a fonte real justificar.

---

## 7. Seleção fallback-first — estado pós-W30

### Objetivo

Drenar fallbacks reais com máximo ganho causal, respeitando o DAG.

### Elegibilidade

Um fallback é candidato quando **todos os seus prereqs já estão servidos** (`Composer` ou `legacy`).

### Valor de desbloqueio — regra crítica

Ao avaliar um candidato X, conte quantos fallbacks adicionais passariam a ter **TODOS os prereqs servidos** se X fosse promovido.

Não conte simplesmente “filhos diretos que estão em fallback”: isso superestima nós cujo filho ainda depende de outro prereq não servido.

### Estado após N2.06

Restam 20 fallbacks:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.09, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.03, PE.04`.

A promoção de `N2.06` tornou `N2.07` elegível. `N2.07` não desbloqueia outro fallback imediatamente.

No recálculo pós-W30, os candidatos de **ganho imediato 1** são:

- `PE.03` → torna `PE.04` elegível;
- `GM.09` → torna `GM.11` elegível.

Pela ordem causal executável observada na Matrix/DAG, `PE.03` está antes de `GM.09`; portanto, **W31 = `PE.03`**, salvo deriva no estado vivo antes da próxima sessão. Recalcule antes de codificar; esta linha não é fila estática.

---

## 8. Regression-first: falha observada não é falha de operação

Cada onda nasce com contrato executável que deve falhar pelo motivo desejado antes da materialização.

No SHA regression-first:

- obtenha evidência real de que o contrato novo falha pela ausência esperada;
- não espere esse run “ficar verde” sem novo commit;
- não relaxe a expectativa;
- depois da prova, materialize a implementação inativa.

**Não chamar `cancelled` de `failure`.** Se um job falhou antes de um workflow ser cancelado por concorrência, registrar as duas coisas separadamente: conclusão do run = `cancelled`; evidência do job/log = falha desenhada observada.

---

## 9. Protocolo de uma onda

### 9.1 Reancorar

HEAD remoto, PR, Matrix, DAG, ficha, runtime e workflows.

### 9.2 Recalcular seleção

Aplicar §7 no estado vivo; não usar fila histórica sem recalcular.

### 9.3 Ler contrato pedagógico e design

Ficha canônica + DAG + runtime map + implementações análogas. Antes de tocar em cor, fonte ou espaçamento, ler `DESIGN_ESTADO_E_DECISOES.md`.

### 9.4 Regression-first

Criar teste nominal que codifica prereqs, fallback inicial, escada L1–L5, diagnósticos, resolução/domínio e invariantes visuais relevantes. Publicar e observar a falha correta.

### 9.5 Materializar INATIVO

Registrar ficha/builder/stage/renderer/mapa runtime necessários, **sem adicionar o ID ao canário default**. Usar `tokens.ts`; não introduzir cor literal nova.

### 9.6 Gates determinísticos

Observar no mínimo:

- testes focados;
- suíte completa;
- TypeScript;
- `npm run auditar`;
- `npm run fichas:auditar`;
- `npm run fichas:conferir`;
- `npm run grafo:check`;
- Coverage Matrix;
- `src/styles/coresLiterais.test.ts` dentro da suíte;
- build.

Nunca apagar ou afrouxar teste para obter verde.

### 9.7 Portão inativo remoto

O SHA inativo precisa de **CI + transversal verdes no mesmo SHA**. Antes de esperar, consulte os runs daquele SHA. Se já estão verdes, prossiga imediatamente.

### 9.8 Promover

Adicionar exatamente o ID ao array declarativo do canário.

### 9.9 Ledger no MESMO SHA

Adicionar a linha nominal em `COVERAGE_MIGRATIONS`, com delta fallback-first esperado `{ composer: +1, fallback: -1, served: +1 }`, sem presumir divergência.

### 9.10 Matrix observa

Deixar o gate ler a fonte real. Se o delta for diferente, investigar; a Matrix vence a expectativa humana.

### 9.11 Certificar promoção/final

CI + transversal verdes no SHA promovido/reconciliado. Se uma correção posterior alterar runtime da onda, esse SHA corrigido também vira o recibo final e precisa dos dois workflows verdes.

### 9.12 Documentação

Somente depois da prova: atualizar checkpoint/PR/porta de retomada. Não escrever recibo à frente da evidência.

### 9.13 Blocos

Checkpoint W20–W24 existe. Checkpoint W25–W29 existe. O bloco **W30–W34 está em curso** em `CHECKPOINT_FABRICA_CURRICULAR_W30_W34_EM_CURSO_2026-08-15.md`; consolidar/fechar o bloco quando W34 terminar.

---

## 10. Throughput e uso correto do tempo

Sondas longas provam runtime real. Use o tempo para preparar análise, ficha, DAG e documentação **fora do ref ativo**, mas não mova a branch se isso puder invalidar o portão em curso.

Não fique ocioso depois de recibo já verde. Diagnosticar “está na hora de promover” não é executar.

Não empilhe promoções: cada onda mantém seus próprios recibos e causalidade.

---

## 11. Sondas reais, fontes e ambiente

Falhas de sonda real devem ser classificadas pela causa concreta. Falha externa de fonte/asset não é automaticamente flake. Não rerodar indefinidamente para obter verde estatístico; corrigir a causa quando pertence ao projeto ou registrar honestamente a evidência externa.

Preservar Chrome real e larguras 320/390/900 quando o contrato visual exigir. Não substituir sonda real por unitário para encurtar o gate.

---

## 12. Definition of Done de uma onda

Uma onda só está fechada quando:

- seleção foi recalculada pelo DAG vivo;
- regression-first produziu evidência da falha pretendida;
- implementação inativa respeita ficha/runtime/design;
- nenhuma cor literal nova escapou da catraca;
- CI + transversal do SHA inativo estão verdes;
- promoção + ledger são atômicos;
- Matrix observou o delta real;
- CI + transversal da promoção/final estão verdes;
- documentação/porta de retomada está alinhada ao estado fechado;
- nenhum merge na `main` ocorreu.

---

## 13. Restrições duras

- NÃO tocar `main`.
- NÃO mergear PR #35.
- NÃO marcar ready.
- NÃO habilitar auto-merge.
- NÃO tocar Creature Engine/Tamagotchi.
- NÃO mergear `codex/w24-dominio-inteiros`.
- NÃO relaxar testes, Matrix, auditorias ou sondas para conseguir verde.
- NÃO trocar fonte da verdade por comentário/checkpoint antigo.
- NÃO promover ficha apenas porque foi registrada no Composer.
- NÃO criar ledger mutável por import.
- NÃO contar filho direto como desbloqueio sem verificar todos os prereqs.
- NÃO esperar verde no commit regression-first.
- NÃO chamar workflow `cancelled` de `failure`.
- NÃO introduzir cor literal nova em ficha/palco; usar `tokens.ts`.
- NÃO regenerar baseline de cores apenas para silenciar a catraca.
- NÃO inventar ID de run, SHA, contagem de testes ou delta de Matrix. Se não foi consultado, escrever `não verificado`.

---

## 14. Autonomia e próximo passo

Há autonomia para executar o ciclo técnico completo sem pedir confirmação a cada microetapa, respeitando as restrições acima.

### Próxima ação ao retomar

1. confirme o HEAD remoto e os dois workflows do último SHA;
2. confirme a Matrix viva em torno de **55/15/20/70/11**;
3. recalcule §7; se nada derivou, abra **W31 `PE.03`** por regression-first;
4. leia o contrato canônico de `PE.03` e `DESIGN_ESTADO_E_DECISOES.md` antes de materializar;
5. siga §9 integralmente, incluindo catraca de cores;
6. mantenha checkpoint/PR/porta de retomada sincronizados somente após a prova de cada fechamento;
7. prossiga fallback-first enquanto os gates permanecerem íntegros.

Não transforme reancoragem em uma hora de diagnóstico quando o próximo passo já está autorizado. Confirme o necessário e execute.