# CHECKPOINT — Fábrica Curricular W30–W34 em curso

Data de abertura do bloco: 2026-08-15 UTC  
PR: #35 · branch: `codex/fechamento-curricular`

## Escopo

Este checkpoint acompanha o bloco fallback-first W30–W34. Ele não substitui a Coverage Matrix executável nem `PROMPT_DE_RETOMADA.md`; funciona como recibo humano do bloco em curso.

Regra de evidência: **conclusão global de workflow e evidência de job/log são fatos distintos**. Antes de registrar espera, consultar os workflows do SHA exato; se já estiverem verdes, executar.

## Estado atual do bloco

| Onda | Competência / ficha | Estado | Matrix após fechamento | Recibo final consultado |
|---|---|---|---|---|
| W30 | N2.06 / F38 — Pares e Ímpares | **fechada** | **55 / 15 / 20 / 70 / 11** | `05b7787e7239db4c687b5fa7cc47ee0b4f256447` · CI `31883452067` + transversal `31883452082`, `success` |
| W31 | PE.03 / F83 — Média e Chance | **fechada** | **56 / 15 / 19 / 71 / 11** | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd` · CI `31908549456` + transversal `31908549471`, `success`, attempt 1 |
| W32 | GM.09 / F82 — Conversões e problemas de medida | **fechada** | **57 / 15 / 18 / 72 / 11** | `40ef8eb13cd93d1a0b2e60375964853e62118e24` · CI `31913688446` + transversal `31913688438`, `success`, attempt 1 |
| W33 | GE.07 / F79 — Polígonos: triângulos e quadriláteros | **selecionada** | — | — |
| W34 | — | não selecionada | — | — |

## Design e infraestrutura vinculantes

- ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline só para silenciar a catraca;
- W30, W31 e W32 fecharam sem introduzir dívida nova de cor.

Fredoka e Nunito permanecem as famílias. Self-host local está liberado, mas o asset só pode entrar com integridade verificada e eventual exceção binária deve ser **somente `public/fonts/*.woff2`**. O transporte confiável não foi obtido neste ambiente; tipografia está bloqueada por rede/transporte e **não bloqueia a fábrica**.

---

## W30 — N2.06 / F38 — Pares e Ímpares

Fechamento final `05b7787e7239db4c687b5fa7cc47ee0b4f256447`:

- Matrix `55/15/20/70/11`;
- suíte 217 arquivos / 3.055 testes;
- CI `31883452067`: `success`;
- transversal `31883452082`: `success`.

Regression `9dc0e61df21f780249f42aaf66785ff69c6d6e76`:

- workflow CI `31882060323`: `cancelled`;
- Gates `95005940004`: `failure` antes do cancelamento;
- exatamente os testes regression-first provaram N2.06 ainda não materializada.

Padrão preservado: conclusão global e job são separados.

---

## W31 — PE.03 / F83 — Média e Chance

### Regression-first

SHA `5a2831f6519456ffaf77e93dc6bcdd988f223149`:

- CI `31907540508`: `cancelled`;
- Gates `95067597810`: `failure` antes do cancelamento;
- exatamente 2 testes W31 vermelhos;
- 217 arquivos / 3.055 testes anteriores verdes;
- transversal `31907540753`: `success`.

### Inativo

SHA `81ffa9b608ecc25a5579c7e906bafa8889dbf101`:

- CI `31908108818`: `success`;
- transversal `31908108833`: `success`.

### Promoção

SHA `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`:

- canário + `W31-PE.03` + contrato Matrix no mesmo SHA;
- Matrix `56/15/19/71/11`;
- suíte 218 arquivos / 3.072 testes;
- CI `31908549456` + transversal `31908549471`, `success`, attempt 1;
- zero cor literal nova.

**W31 fechada.**

---

## W32 — GM.09 / F82 — Conversões e problemas de medida

### Seleção e contrato

Pré-requisitos: `GM.05`, `N4.08`, `N6.01`.  
Primitivas: `NumberLine + Balanca`.  
Realização: `ProblemasMedidaStage` / `problemas-medida-f82`.

Escada:

1. cm↔m;
2. g↔kg e ml↔L;
3. comparar só depois de converter;
4. operar unidades mistas após conversão;
5. problema multietapas de medida.

Diagnósticos: `COMPARA_SEM_CONVERTER`, `INVERTE_OPERACAO`, `MISTURA_GRANDEZAS`.  
Resolução: R0-A.  
Domínio: 3/3 em 2 sessões.

### Regression-first — classificação correta

SHA `fd05ef22ead9c01f8c274d69bba37e2e25422bd4`.

**Conclusão global:**

- CI `31912881313`: **`failure`**;
- transversal `31912881318`: `success`.

**Evidência do job:**

- Gates `95080511297`: `failure`;
- exatamente os 2 testes W32 falharam porque GM.09 ainda não estava registrada/ativável;
- 218 arquivos / 3.072 testes anteriores verdes.

Aqui o workflow CI realmente terminou `failure`; não houve cancelamento.

### Materialização inativa

SHA `ddaf40bfa1ac88ddd3c8c60046b058958963c0e5`.

Entraram ficha, contrato, palco, renderer, Composer e mapa runtime. GM.09 ficou registrada, mas fora do canário. O runtime map prova as duas entradas físicas `NumberLine + Balanca`; o palco usa tokens.

Portão inativo:

- CI `31913279161`: `success`;
- transversal `31913279171`: `success`.

Gates inativo:

- 57 Composer registradas / 56 ativas / 1 inativa (GM.09);
- Matrix `56/15/19/71/11`;
- suíte 219 arquivos / 3.076 testes;
- auditorias, conformidade, grafo, TypeScript, build, guarda textual e cores verdes.

### Promoção atômica e fechamento

SHA `40ef8eb13cd93d1a0b2e60375964853e62118e24`.

Entraram somente:

- GM.09 no canário declarativo;
- `W32-GM.09` no ledger;
- contrato executável da Matrix.

O contrato executável exige e o Gates `95082366897` aprovou o baseline **57 Composer / 15 legado / 18 fallback / 72 servidas / 11 divergências**. O job também concluiu com sucesso auditoria do catálogo, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual.

Conclusão global do mesmo SHA:

- CI `31913688446`: `completed/success`, attempt 1;
- transversal `31913688438`: `completed/success`, attempt 1.

**W32 fechada.**

---

## Seleção pós-W32 — W33

Restam **18 fallbacks**:

`AL.07, AL.08, GE.07, GE.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Estado de elegibilidade:

- 16 estão imediatamente elegíveis;
- `AL.08` ainda exige `AL.07 + N7.02`;
- `N5.05` ainda exige `N5.04 + N6.04`;
- todos os 16 elegíveis têm ganho imediato 0.

Desempate pelo critério vinculante da Matrix/DAG:

1. maior ganho imediato;
2. empate → `causalWave` crescente, depois maior impacto downstream, depois ID;
3. empate residual → menor delta estrutural/continuidade local.

`GE.07` é o primeiro dos empatados (`causalWave=4`).

Portanto **W33 = GE.07 / F79 — Polígonos: triângulos e quadriláteros**.

### Contrato F79 já reancorado

Pré-requisitos: `GE.03`, `GE.06`.  
Primitivas: `ShapeCanvas + DragGroup`.

Escada:

1. polígono = figura fechada com lados retos; incluir não-exemplo aberto;
2. triângulos em diferentes orientações;
3. quadriláteros;
4. classificação por propriedades, preservando que quadrado também é retângulo;
5. construção/classificação sob pelo menos duas condições simultâneas.

Diagnósticos: `NAO_FECHA`, `CONTA_LADOS_ERRADO`, `CONFUNDE_CLASSE`.  
Resolução: R0-A.  
Domínio: reconhecimento/classificação 3/3 em 2 sessões; construção 2/3 em 2 sessões.  
Acessibilidade: contornos visíveis, rótulo além de cor e alternativa por toque ao arrasto.

---

## Invariantes para W33–W34

1. Reancorar no remoto antes de editar.
2. Antes de aguardar workflow, consultar a conclusão do **SHA exato**; se já estiver verde, executar.
3. Regression-first precisa de falha desenhada observada; conclusão global e job são registrados separadamente.
4. Materialização permanece inativa até CI + transversal verdes no mesmo SHA.
5. Canário, ledger, Matrix e runtime map são declarativos.
6. Promoção e ledger entram no mesmo SHA.
7. Matrix observa o delta real; baseline não mascara deriva.
8. Contar desbloqueio somente quando todos os prereqs do novo fallback ficam servidos.
9. Ler `DESIGN_ESTADO_E_DECISOES.md` antes de UI.
10. Usar `tokens.ts`; zero cor literal nova.
11. Correção posterior de runtime cria novo recibo final e exige CI + transversal verdes.
12. Tipografia local não bloqueia a fábrica enquanto o transporte não for verificável.
13. Não tocar `main`, não mergear PR #35, não marcar ready, não habilitar auto-merge, não tocar Creature Engine/Tamagotchi.
14. Não mergear `codex/w31-promotion-staging`.

## Continuidade

Retomar por:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- este checkpoint;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` quando houver UI;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `src/curriculum/coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- workflows do SHA exato do HEAD.

Próxima onda autorizada: **W33 = GE.07 / F79**.
