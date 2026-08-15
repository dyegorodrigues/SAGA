# PROMPT DE RETOMADA — fechamento curricular do SAGA

> **Autoridade:** GitHub remoto. Este arquivo é a porta de entrada operacional, não uma licença para confiar em SHAs antigos. Ao retomar, confirme o HEAD real da branch, o PR e os workflows do SHA exato antes de editar.

Repo: `dyegorodrigues/SAGA`  
PR: `#35` — deve permanecer **open + draft + unmerged**  
Branch de trabalho: `codex/fechamento-curricular`  
Base protegida: `main` — não editar, não mergear, não marcar o PR como ready.

---

## 1. Fonte da verdade e reancoragem

O remoto vence memória de conversa, prompt antigo, SHA copiado ou CI de outro commit.

Ao iniciar uma sessão:

1. leia **integralmente este arquivo**;
2. confirme o HEAD remoto atual de `codex/fechamento-curricular`;
3. confirme PR #35 open + draft + unmerged;
4. confirme que `main` segue intocada;
5. consulte CI e Certificação transversal do **SHA exato** relevante para a fase em curso;
6. só investigue deriva real. Não refaça provas já registradas aqui por hábito.

A concorrência dos dois workflows já foi provada anteriormente em SHAs diferentes; não repita esse experimento.

---

## 2. Dois workflows e significado dos recibos

Há dois recibos independentes:

- **CI** (`.github/workflows/ci.yml`): gates determinísticos, testes, build, higiene/binários e sonda real Sensei;
- **Certificação transversal**: sondas longas 390 px em múltiplas sementes e 320/900 px.

Regra: quando o protocolo exige “os dois verdes”, isso significa **os dois workflows concluídos com success no mesmo SHA exato**.

Um run cancelado, vermelho, pertencente a outro SHA ou ainda em execução não serve como recibo daquele estado.

### Concorrência

A separação por SHA está provada: pushes posteriores não cancelam a certificação transversal de um SHA anterior. Portanto é permitido materializar a próxima onda somente nos pontos autorizados pelo protocolo; não é permitido, porém, promover um canário antes de o SHA inativo ter os dois recibos verdes.

---

## 3. Ordem de leitura complementar

Depois deste arquivo, quando precisar de contexto histórico, leia somente o que for necessário, nesta ordem:

1. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
2. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W11_AL03_F30_FECHADA_2026-08-13.md`;
3. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W15_W19_FECHADA_2026-08-14.md`;
4. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W20_W24_FECHADA_2026-08-15.md`;
5. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
6. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
7. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

Coverage Matrix, DAG, canário e runtime atuais continuam superiores a checkpoints históricos.

---

## 4. ESTADO VIVO APÓS A W28

### Fechamento curricular

- **W1–W28 fechadas.**
- W24 — `N7.01 / F84`, recibo final `083632d`.
- W25 — `PE.02 / F64`, recibo final `650ac64`.
- W26 — `GM.08 / F81`, recibo final `bb44915`.
- W27 — `AL.06 / F77`:
  - materialização inativa `dbd9c4c`;
  - portão inativo: CI `31853918490` + transversal `31853918503`, verdes;
  - promoção atômica inicial `f4c3df2` revelou dívida de observabilidade;
  - fechamento reconciliado `25b0307`: CI `31857701286` + transversal `31857701285`, verdes;
  - Matrix observada: `52 Composer / 15 legado / 23 fallback / 67 servidas / 11 divergências`.
- W28 — `GE.05 / F60 — O Mapa do Tesouro`:
  - regression-first `e3d41ac`: vermelho **por desenho**, somente no contrato novo;
  - materialização inativa `e4c9349`;
  - portão inativo: CI `31858284059` + transversal `31858284068`, verdes;
  - promoção atômica `2377aaf`: `GE.05` + `W28-GE.05` + contrato da Matrix no mesmo SHA;
  - recibos da promoção: CI `31858733127` + transversal `31858733049`, verdes;
  - Matrix observada: **`53 Composer / 15 legado / 22 fallback / 68 servidas / 11 divergências`**.

Contadores estruturais preservados: 90 competências, 94 fichas autorais, 12 trocas visuais e 44 estreias de ferramenta conforme a Matrix executável.

### O que a W28 materializou

`GE.05/F60` reutiliza `ShapeCanvas#grade` em `MapaTesouroStage` e preserva a escada canônica:

1. grade 3×3 — achar objeto;
2. grade 5×5 — dizer coordenada;
3. colocar objeto na coordenada;
4. descrever caminho horizontal/vertical;
5. ponte pré-cartesiana com dois eixos numéricos.

Ordem pedagógica dura: **coluna primeiro, linha depois**. Diagnósticos canônicos: `inverte-coordenadas`, `so-uma-coordenada`, `confunde-linha-coluna`. Resolução declarativa R0-A e domínio 3/3 em 2 sessões.

### Auditoria histórica W20/W21

O checkpoint W20–W24 registra a evidência sem maquiar o histórico:

- W20 final `74c6f0e`: transversal verde, mas CI final vermelho — recibo final **não plenamente verificado**; o portão inativo da onda foi verde e o código persistiu em heads posteriores certificados;
- W21 final `35cd96b`: existe par histórico verde no SHA exato (`31811526114` + `31811526141`); tentativas posteriores canceladas no mesmo SHA não anulam esse par. Recibo **verificado**.

### Branch duplicada

`codex/w24-dominio-inteiros` é trabalho duplicado da W24 e conflita em `canaryContract.test.ts`. **Não mergear.** Pode ser removida quando houver mecanismo seguro para apagar a branch, mas não é dependência do fechamento.

---

## 5. Regra de correção: observação vem antes do ledger

A sequência correta para qualquer mudança de estado da Matrix é:

1. implementar/ativar a mudança real;
2. deixar a Matrix observar a fonte real;
3. se o gate ficar vermelho por delta real esperado, registrar o delta no ledger;
4. atualizar a expectativa executável;
5. nunca reduzir divergência ou inventar contador por intenção.

W18 ensinou que texto não pode correr na frente do runtime. W21 ensinou que promoção não pode correr na frente do ledger. W27 ensinou que o mapa de observabilidade também é parte da prova: `expressao-f77` precisava existir declarativamente no runtime map antes de a Matrix aceitar a promoção.

---

## 6. Estruturas declarativas — regra dura

São declarativas:

- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` (`COVERAGE_MIGRATIONS`);
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- expectativas executáveis da Coverage Matrix.

### Proibido

- mutação por efeito colateral de `import`;
- “arquivo de extensão” que só funciona se alguém lembrar de importá-lo;
- empurrar `push`, `splice` ou alteração de referência no import;
- duplicar a fonte declarativa para “não reescrever arquivo”.

Adicionar **uma linha nova ao array canônico** é a operação correta.

### Atomicidade da promoção

Desde W22, e obrigatoriamente daqui em diante, **canário e ledger entram no mesmo SHA de promoção**. A expectativa nominal da Matrix deve acompanhar a mesma promoção quando necessária para codificar o delta já estabelecido pelo contrato.

O ledger vigente chega até `W28-GE.05`.

---

## 6-A. Gate documental do cânone

A ficha canônica em `AI_Studio_Lab/pedagogia/fichas/` é contrato pedagógico, não decoração.

Antes de materializar uma competência:

1. localizar a ficha autoral e sua proveniência;
2. localizar o nó no DAG e os prereqs vivos;
3. identificar primitiva/modo canônicos;
4. derivar a escada dos cinco níveis;
5. manter diagnósticos e domínio;
6. usar o runtime map para provar qual componente físico realiza cada primitiva;
7. se houver divergência entre ficha e screen, não escondê-la: ou alinhar o runtime ou registrar dívida objetiva.

Não inventar ficha, primitiva, modo ou pedagogia para fazer o gate ficar verde.

---

## 7. Seleção fallback-first — estado pós-W28

### Objetivo

Drenar fallbacks reais com máximo ganho causal, respeitando o DAG.

### Elegibilidade

Um fallback é candidato quando **todos os seus prereqs já estão servidos** (`Composer` ou `legacy`).

### Valor de desbloqueio — regra crítica

Ao avaliar um candidato X, conte quantos fallbacks adicionais passariam a ter **TODOS os prereqs servidos** se X fosse promovido.

Não conte simplesmente “filhos diretos que estão em fallback”: isso superestima nós cujo filho ainda depende de outro prereq não servido.

### Estado após GE.05

Restam 22 fallbacks:

`AL.07, AL.08, GE.04, GE.07, GE.08, GE.09, GE.10, GM.06, GM.09, GM.10, GM.11, N2.06, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.03, PE.04`.

A promoção de `GE.05` tornou `GE.08` elegível.

Na fila recalculada pós-W28, os candidatos com ganho imediato 1 são:

- `GE.04` → torna `GE.10` elegível;
- `GM.09` → torna `GM.11` elegível;
- `N2.06` → torna `N2.07` elegível;
- `PE.03` → torna `PE.04` elegível.

Pelo desempate causal determinístico da Matrix/DAG, a **W29 começa por `GE.04`**, salvo se o estado vivo tiver derivado antes da próxima sessão. Recalcule antes de codificar; não transforme esta linha em fila estática.

---

## 8. Regression-first: vermelho correto não é falha de operação

Cada onda nasce com um contrato executável que falha pelo motivo desejado.

No SHA de regression-first:

- CI vermelho é **esperado e necessário**;
- verifique que a falha está restrita ao novo contrato;
- não espere esse CI “ficar verde”; ele nunca ficará verde sem novo commit;
- não relaxe a expectativa;
- depois de observar o vermelho correto, materialize a implementação inativa.

O erro operacional que já ocorreu mais de uma vez foi esperar um workflow que, por desenho, não pode ficar verde. Não repetir.

---

## 9. Protocolo de uma onda

### 9.1 Reancorar

HEAD remoto, PR, Matrix, DAG, ficha, runtime e estado dos workflows.

### 9.2 Recalcular seleção

Aplicar §7 no estado vivo; não usar fila histórica sem recalcular.

### 9.3 Ler contrato pedagógico

Ficha canônica + DAG + runtime map + implementações análogas.

### 9.4 Regression-first

Criar teste nominal que codifica prereqs, fallback inicial, escada L1–L5, diagnósticos, resolução/domínio e invariantes visuais relevantes. Publicar e observar o vermelho correto.

### 9.5 Materializar INATIVO

Registrar ficha/builder/stage/renderer/mapa de runtime necessários, **sem adicionar o ID ao canário default**.

### 9.6 Gates locais/determinísticos

Rodar/observar, no mínimo:

- testes focados;
- suíte completa;
- `tsc`;
- `npm run auditar`;
- `npm run fichas:auditar`;
- `npm run fichas:conferir`;
- `npm run grafo:check`;
- Coverage Matrix;
- build.

Nunca apagar/afrouxar teste para obter verde.

### 9.7 Portão inativo remoto

O SHA inativo precisa dos **dois workflows verdes no mesmo SHA**. Antes de “esperar”, consulte o estado real dos runs daquele SHA. Se já estão verdes, prossiga imediatamente.

### 9.8 Promover

Adicionar exatamente o ID da competência ao array declarativo do canário.

### 9.9 Ledger no MESMO SHA

Adicionar a linha nominal da onda em `COVERAGE_MIGRATIONS`, com delta fallback-first esperado `{ composer: +1, fallback: -1, served: +1 }`, sem presumir mudança em divergências.

### 9.10 Matrix observa

Deixar o gate ler a fonte real. Se o delta real for diferente, investigar; a Matrix vence a expectativa humana.

### 9.11 Certificar promoção

CI + transversal verdes no SHA promovido/reconciliado.

### 9.12 Documentação

Atualizar checkpoint/PR/porta de retomada sem inventar recibo.

### 9.13 Blocos

A cada bloco operacional de cinco ondas, criar checkpoint consolidado. O checkpoint W20–W24 agora existe. O próximo bloco consolidável é W25–W29, portanto será fechado quando W29 encerrar.

---

## 10. Throughput e uso correto do tempo

As sondas longas existem para provar o runtime real. Use o tempo delas para preparar análise, ficha, DAG e documentação **fora do ref ativo**, mas não mova a branch se isso puder invalidar o portão em curso.

Não fique ocioso depois de um recibo já verde. Diagnosticar “está na hora de promover” não é executar.

Não empilhe promoções: cada onda mantém seus próprios recibos e causalidade.

---

## 11. Sondas reais, fontes e ambiente

Falhas de sonda real devem ser classificadas pela causa concreta. Uma falha externa de fonte/asset não é automaticamente flake. Não rerodar indefinidamente para obter verde estatístico; corrigir a causa quando ela pertence ao projeto ou registrar a evidência quando externa.

Preservar Chrome real e larguras 320/390/900 quando o contrato visual exigir. Não substituir sonda real por teste unitário para encurtar o gate.

---

## 12. Definition of Done de uma onda

Uma onda só está fechada quando:

- seleção foi recalculada pelo DAG vivo;
- regression-first falhou pelo motivo correto;
- implementação inativa respeita ficha/runtime;
- CI + transversal do SHA inativo estão verdes;
- promoção + ledger são atômicos;
- Matrix observou o delta real;
- CI + transversal da promoção/final estão verdes;
- documentação/porta de retomada não está atrasada em relação ao estado fechado;
- nenhum merge na `main` ocorreu.

---

## 13. Restrições duras

- NÃO tocar `main`.
- NÃO mergear PR #35.
- NÃO marcar ready.
- NÃO habilitar auto-merge.
- NÃO tocar o Creature Engine/Tamagotchi.
- NÃO mergear `codex/w24-dominio-inteiros`.
- NÃO relaxar testes, Matrix, auditorias ou sondas para conseguir verde.
- NÃO trocar fonte da verdade por comentário/checkpoint antigo.
- NÃO promover uma ficha só porque ela foi registrada no Composer.
- NÃO criar ledger mutável por import.
- NÃO contar filho direto como desbloqueio sem verificar todos os prereqs.
- NÃO esperar verde no commit regression-first.

---

## 14. Autonomia e próximo passo

Há autonomia para executar o ciclo técnico completo sem pedir confirmação a cada microetapa, desde que as restrições acima sejam respeitadas.

### Próxima ação ao retomar

1. confirme o HEAD remoto e os dois workflows do último SHA;
2. confirme a Matrix viva em torno de **53/15/22/68/11**;
3. recalcule §7; se nada derivou, abra **W29 `GE.04`** por regression-first;
4. siga §9 integralmente;
5. ao fechar W29, crie o checkpoint W25–W29 e atualize esta porta novamente;
6. prossiga fallback-first enquanto os gates permanecerem íntegros.

Não transforme a reancoragem em uma hora de diagnóstico quando o próximo passo já está autorizado. Confirme o necessário e execute.
