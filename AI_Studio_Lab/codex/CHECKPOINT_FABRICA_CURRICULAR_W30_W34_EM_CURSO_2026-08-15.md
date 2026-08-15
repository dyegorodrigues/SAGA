# CHECKPOINT — Fábrica Curricular W30–W34 em curso

Data de abertura do bloco: 2026-08-15 UTC  
PR: #35 · branch: `codex/fechamento-curricular`

## Escopo

Este checkpoint acompanha o bloco fallback-first W30–W34. Ele não substitui a Coverage Matrix executável nem `PROMPT_DE_RETOMADA.md`; funciona como recibo humano do bloco em curso e será consolidado quando W34 fechar.

Regra de evidência aplicada: nenhum ID de run, SHA, contagem de testes ou delta é registrado sem consulta à fonte correspondente. **Conclusão de workflow e evidência de job/log são registradas separadamente.** Workflow `cancelled` permanece `cancelled`, mesmo quando um job já havia terminado `failure`.

## Estado atual do bloco

| Onda | Competência / ficha | Estado | Matrix após fechamento | Recibo final consultado |
|---|---|---|---|---|
| W30 | N2.06 / F38 — Pares e Ímpares | **fechada** | **55 / 15 / 20 / 70 / 11** | `05b7787e7239db4c687b5fa7cc47ee0b4f256447` · CI `31883452067` + transversal `31883452082`, ambos `success` |
| W31 | PE.03 / F83 — Média e Chance | **fechada** | **56 / 15 / 19 / 71 / 11** | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd` · CI `31908549456` + transversal `31908549471`, ambos `success`, attempt 1 |
| W32 | GM.09 / F82 — Conversões e problemas de medida | **selecionada** | — | — |
| W33 | — | não selecionada | — | — |
| W34 | — | não selecionada | — | — |

## Design e infraestrutura vinculantes

A catraca de cores continua ativa:

- ficha/palco usa papéis de `src/styles/tokens.ts`;
- baseline não pode crescer por conveniência;
- W30 e W31 fecharam sem introduzir dívida nova de cor; na W31 foram **zero cores literais novas**.

A redação de `DESIGN_ESTADO_E_DECISOES.md` foi corrigida para separar duas decisões:

- **qual família usar** é estética e continua com o dono;
- **de onde o arquivo é servido** é infraestrutura.

Fredoka e Nunito permanecem as famílias. É permitido self-host local das mesmas fontes. A guarda binária só pode receber exceção estreita para `public/fonts/*.woff2`; qualquer asset precisa ter integridade verificada antes de commit. Se o ambiente não permitir download confiável, a tarefa fica bloqueada por acesso a rede e **não bloqueia a fábrica curricular**.

A evidência da dependência externa ficou registrada: 27 HTTP 404 em 27 navegações.

---

## W30 — N2.06 / F38 — Pares e Ímpares

### Contrato canônico

Pré-requisito: `N2.03`.  
Primitiva: `DragGroup#duplas`.

Escada:

1. formar duplas até 10;
2. formar duplas até 20;
3. decidir par/ímpar sem formar fisicamente;
4. usar a regra do último algarismo;
5. raciocinar sobre paridade de somas.

Diagnósticos: `CONFUNDE_TAMANHO`, `ZERO_IMPAR`, `DECORA_SEM_ENTENDER`.  
Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

### Regression-first

SHA `9dc0e61df21f780249f42aaf66785ff69c6d6e76`.

- workflow CI `31882060323`: `cancelled` por concorrência;
- job `Gates do SAGA` `95005940004`: `failure` antes do cancelamento;
- log: os 2 testes novos falharam porque N2.06 ainda não existia no Composer; testes anteriores verdes.

### Portão inativo e promoção

Portão inativo final `c62beaadfe10b903d6054aa56ef688c269ff5288`:

- CI `31882628417`: `success`;
- transversal `31882628429`: `success`.

Promoção atômica `c1e7512e912421d3d1923838bf3050218e92fc59`:

- canário + `W30-N2.06` no ledger + baseline Matrix;
- Matrix `55/15/20/70/11`;
- suíte 216 arquivos / 3.053 testes;
- CI `31883028645` + transversal `31883028668`, ambos `success`.

### Correção de runtime pós-promoção

Fechamento final `05b7787e7239db4c687b5fa7cc47ee0b4f256447` estabilizou a notificação de progresso do `DragGroup`, adicionou teste de montagem, tutorial semântico de duplas e manteve cores tokenizadas.

No SHA final:

- Matrix `55/15/20/70/11`;
- suíte 217 arquivos / 3.055 testes;
- `coresLiterais.test.ts`, build, TypeScript, catálogo, fichas, conformidade, grafo, higiene e binários verdes;
- CI `31883452067`: `success`;
- transversal `31883452082`: `success`.

---

## W31 — PE.03 / F83 — Média e Chance

### Seleção

No estado pós-W30, `PE.03` e `GM.09` eram os únicos candidatos com ganho imediato 1. Pela ordem causal executável da Matrix/DAG, PE.03 precedia GM.09, portanto W31 foi PE.03.

Pré-requisitos: `PE.02`, `N4.10`, `N5.02`.  
Primitiva: `SingaporeBars`.  
Realização: `MediaChanceStage`, kind `media-chance-f83`.

Escada:

1. nivelar três torres preservando o total;
2. nivelar cinco torres;
3. calcular média inteira;
4. chance como favoráveis/total + ponte de média fracionária;
5. comparar chances + média fracionária que pode não coincidir com valor observado.

Diagnósticos: `MEDIA_IMPOSSIVEL`, `ESQUECEU_DIVIDIR`, `IGNORA_TOTAL`.  
Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

### Regression-first — classificação correta

SHA `5a2831f6519456ffaf77e93dc6bcdd988f223149`.

**Conclusão dos workflows:**

- CI `31907540508`: **`cancelled`**;
- Certificação transversal `31907540753`: `success`.

**Evidência do job:**

- `Gates do SAGA` `95067597810`: **`failure`** antes do cancelamento do workflow;
- o log mostra exatamente 2 testes W31 vermelhos:
  - `hasComposerFicha("PE.03")` retornava `false`;
  - ativação era rejeitada porque PE.03 ainda não estava registrada em `COMPOSER_FICHAS`;
- **217 arquivos / 3.055 testes anteriores passaram**.

A formulação canônica é: **o job/log prova a falha desenhada; o workflow CI terminou `cancelled`**.

### Materialização inativa

A materialização foi construída sem ativar o canário:

- `ed6ff4b0aeba922ec50b7781c21a0117f12dc063` — ficha F83, contrato, `MediaChanceStage`, renderer e registro;
- `e5fc7c4481f80bd49e0e319a0fc87f8729e3870d` — acrescenta `rt_alvo: 18000` no L5;
- `81ffa9b608ecc25a5579c7e906bafa8889dbf101` — reconcilia o mapa declarativo `SingaporeBars → MediaChanceStage → media-chance-f83`.

Portão inativo final do SHA exato `81ffa9b608ecc25a5579c7e906bafa8889dbf101`:

- CI `31908108818`: `success`;
- transversal `31908108833`: `success`.

### Promoção atômica

SHA `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`.

Entraram somente os três governantes da promoção:

- `PE.03` no canário;
- `W31-PE.03` no ledger;
- contrato executável da Matrix atualizado.

A Matrix observou:

- **56 Composer**;
- **15 legado**;
- **19 fallback**;
- **71 servidas**;
- **11 divergências**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- `missingPrimitives=["Moedas"]`.

O job Gates do SHA promovido mostrou:

- `PE.03 / F83` como `padrao-ouro`, `SingaporeBars`, conformidade `ok`;
- suíte completa **218 arquivos / 3.072 testes**, todos verdes;
- TypeScript, build, catálogo, fichas, conformidade, grafo e guarda textual verdes;
- catraca de cores verde e **zero cor literal nova** na W31.

Conclusão global dos workflows do mesmo SHA:

- CI `31908549456`: `completed/success`, attempt 1;
- transversal `31908549471`: `completed/success`, attempt 1.

**W31 fechada.**

A branch auxiliar `codex/w31-promotion-staging` (`79801d5`, `b434045`, `5242926`) é rascunho redundante da preparação anterior à promoção atômica. Não mergear.

---

## Correções de evidência que continuam vinculantes

### W28

No SHA regression-first `e3d41ac72a6a474253e73b4756dabdbb5099201f`, o CI `31858118039` terminou `cancelled`, não `failure`. O fechamento posterior permanece certificado por recibos próprios.

### W29

No SHA regression-first `52bdb4e249b5d9a9f9535cda46f244ccc1dc52c3`:

- workflow CI `31863719586`: `cancelled` por concorrência;
- job Gates `94961316286`: `failure`;
- log: falha desenhada porque GE.04 ainda não estava registrada, com 213 arquivos / 3.016 testes anteriores verdes.

Padrão vinculante para W31 e ondas seguintes: **separar conclusão do workflow da evidência do job**.

---

## Seleção pós-W31 — W32

Restam **19 fallbacks**:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.09, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

No recálculo do estado vivo:

- `GM.09` é o **único elegível com ganho imediato 1**;
- promover `GM.09` torna `GM.11` elegível;
- os outros 15 elegíveis têm ganho 0.

Portanto, sem deriva do remoto, **W32 = GM.09 / F82 — Conversões e problemas de medida**.

---

## Invariantes para W32–W34

1. Reancorar no remoto antes de editar.
2. Antes de aguardar workflow, consultar a conclusão do **SHA exato** pela API; se já estiver verde, executar.
3. Regression-first precisa de falha desenhada observada; workflow cancelado nunca é rebatizado como `failure`.
4. Materialização permanece inativa até CI + transversal verdes no mesmo SHA.
5. Canário, ledger, Matrix e runtime map são declarativos.
6. Promoção e ledger entram no mesmo SHA.
7. Matrix observa o delta real; baseline não mascara deriva.
8. Contar desbloqueio apenas quando **todos** os prereqs do novo fallback ficam servidos.
9. Ler `DESIGN_ESTADO_E_DECISOES.md` antes de tocar em UI.
10. Usar `tokens.ts`; zero cor literal nova.
11. Correção posterior de runtime cria novo recibo final e exige CI + transversal verdes.
12. Tipografia local não bloqueia a fábrica se o download não for verificável.
13. Não tocar `main`, não mergear PR #35, não marcar ready, não habilitar auto-merge, não tocar Creature Engine/Tamagotchi.
14. Não mergear `codex/w31-promotion-staging`.

## Continuidade

Retomar sempre por:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- este checkpoint;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` quando houver UI;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `src/curriculum/coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- workflows do SHA exato do HEAD.

Próxima onda autorizada: **W32 = GM.09 / F82**.
