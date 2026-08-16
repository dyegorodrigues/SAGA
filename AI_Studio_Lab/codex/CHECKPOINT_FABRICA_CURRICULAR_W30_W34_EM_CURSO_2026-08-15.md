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
| W33 | GE.07 / F79 — Polígonos: triângulos e quadriláteros | **fechada** | **58 / 15 / 17 / 73 / 11** | `5fa072c84e69687491a21d0e6f975d7b9da3fd44` · CI `31916781563` + transversal `31916781644`, `success` |
| W34 | GE.08 / F80 — O Plano Cartesiano | **selecionada** | — | — |

## Design e infraestrutura vinculantes

- ficha/palco novo usa papéis de `src/styles/tokens.ts`;
- não introduzir cor literal nova;
- não regenerar baseline só para silenciar a catraca;
- W30–W33 não exigiram relaxamento da catraca de cores.

### Tipografia local resolvida

Fredoka e Nunito permanecem as famílias escolhidas. O commit `d1101e5db6147c50f3131996b1595005c9bf874b`, integrado durante o estágio inativo da W33, trouxe quatro WOFF2 variáveis oficiais (`latin` + `latin-ext`), validou os bytes mágicos `wOF2`, removeu o `@import` do Google Fonts e restringiu a exceção binária a `public/fonts/*.woff2`. O build serve os assets por `dist/fonts/`.

Não reabrir download externo nem trocar as famílias. A dívida de 27 HTTP 404 em 27 navegações permanece apenas como registro histórico da dependência externa.

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

### Regression-first — classificação correta

SHA `fd05ef22ead9c01f8c274d69bba37e2e25422bd4`.

**Conclusão global:** CI `31912881313`: **`failure`**; transversal `31912881318`: `success`.

**Evidência do job:** Gates `95080511297`: `failure`, exatamente os 2 testes W32; 218 arquivos / 3.072 testes anteriores verdes.

### Materialização inativa

SHA `ddaf40bfa1ac88ddd3c8c60046b058958963c0e5`:

- GM.09 registrada e fora do canário;
- cadeia física `NumberLine + Balanca → ProblemasMedidaStage` declarada;
- CI `31913279161` + transversal `31913279171`, ambos `success`.

### Promoção e fechamento

SHA `40ef8eb13cd93d1a0b2e60375964853e62118e24`:

- somente canário + `W32-GM.09` + contrato Matrix;
- Gates `95082366897`: `success`;
- Matrix `57/15/18/72/11`;
- CI `31913688446` + transversal `31913688438`, `completed/success`.

**W32 fechada.**

---

## W33 — GE.07 / F79 — Polígonos

### Regression-first

SHA `139b1b077781c97bf76f7f5c157f9e2463373683`.

**Conclusão global:** CI `31914303708`: `cancelled`.

**Evidência do job:** Gates `95083874446`: `failure`, somente os 2 testes W33; 219 arquivos / 3.089 testes anteriores verdes. As falhas foram exatamente GE.07 não registrada e ativação recusada antes do registro em `COMPOSER_FICHAS`.

### Primeiro estágio inativo

SHA `702e62d8ec0f4f85d699ded8bb213dbdc95b32d3`:

- materialização inicial registrada e inativa;
- CI `31914591177` + transversal `31914591199`, ambos `success`, attempt 1.

### Tipografia + runtime map ainda inativos

- `d1101e5db6147c50f3131996b1595005c9bf874b`: self-host Fredoka/Nunito, guarda binária estreita e build local das fontes;
- `af1e657ac72d5a353f7ea1416ee52aa183819f7e`: cadeia física `ShapeCanvas + DragGroup → PoligonosStage` adicionada ao `ficha_runtime_map.cjs`.

### Reconciliação canônica antes da promoção

A implementação inicial divergia da ficha F79 canônica. Ela foi corrigida ainda inativa em `04865f6a05a362110e035772bbd0b617cb55263c` para a escada correta:

1. triângulos por lados;
2. triângulos por ângulos;
3. quadriláteros;
4. hierarquia `quadrado ⊂ retângulo ⊂ paralelogramo`;
5. propriedades combinadas.

Diagnósticos canônicos: `CATEGORIAS_EXCLUSIVAS`, `SO_UM_CRITERIO`, `ORIENTACAO_FIXA`.  
Domínio: 3/3 em 2 sessões.  
Primitivas: `ShapeCanvas + DragGroup`.  
Alternativa por toque preservada.

Portão inativo canônico `04865f6a05a362110e035772bbd0b617cb55263c`:

- CI `31916409189`: `success`;
- transversal `31916409203`: `success`;
- Gates `95088772299`: `success`;
- 58 Composer registradas / 57 ativas / GE.07 única inativa;
- Matrix ainda `57/15/18/72/11`;
- suíte **220 arquivos / 3.093 testes**;
- auditorias, TypeScript, build, runtime map, fontes locais e guards verdes.

### Promoção atômica e fechamento

SHA `5fa072c84e69687491a21d0e6f975d7b9da3fd44`.

Entraram somente:

- GE.07 no canário declarativo;
- `W33-GE.07` no ledger;
- contrato executável da Matrix.

**Evidência do job:** Gates `95089806659`: `success`; Matrix observada **58 Composer / 15 legado / 17 fallback / 73 servidas / 11 divergências**; GE.07 `padrao-ouro`; suíte **220 arquivos / 3.106 testes**; auditoria, fichas, conformidade, grafo, TypeScript, testes, build e guarda textual verdes.

**Conclusão global do mesmo SHA:** CI `31916781563` + transversal `31916781644`, ambos `completed/success`.

**W33 fechada.**

---

## Seleção pós-W33 — W34

Restam **17 fallbacks**:

`AL.07, AL.08, GE.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Estado de elegibilidade:

- 15 estão imediatamente elegíveis;
- `AL.08` ainda exige `AL.07 + N7.02`;
- `N5.05` ainda exige `N5.04 + N6.04`;
- todos os 15 elegíveis têm ganho imediato 0.

Desempate pelo critério vinculante da Matrix/DAG:

1. maior ganho imediato;
2. empate → `causalWave` crescente, depois maior impacto downstream, depois ID;
3. empate residual → menor delta estrutural/continuidade local.

`GE.08` é o primeiro elegível na ordem causal (`causalWave=5`).

Portanto **W34 = GE.08 / F80 — O Plano Cartesiano**.

### Contrato F80 já reancorado

Pré-requisitos: `GE.05`, `N1.12`.  
Primitiva: `ShapeCanvas` em modo grade.  
Regra visual: **primeiro anda, depois sobe**.

Escada:

1. ler ponto marcado;
2. colocar ponto;
3. caminho entre dois pontos;
4. desenhar figura por coordenadas;
5. identificar padrão em pontos alinhados.

Diagnósticos: `INVERTE_XY`, `IGNORA_ORIGEM`, `CONTA_MARCAS`.  
Domínio: 3/3 em 2 sessões, incluindo pelo menos um de colocar o ponto.  
F80 tem exposição motora alta: alternativa por toque + snap generoso são obrigatórios.

---

## Invariantes para W34

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
12. Tipografia local já está resolvida; não reabrir download externo.
13. Não tocar `main`, não mergear PR #35, não marcar ready, não habilitar auto-merge, não tocar Creature Engine/Tamagotchi.
14. Não mergear branches temporárias de staging.

## Continuidade

Retomar por:

- `AI_Studio_Lab/codex/PROMPT_DE_RETOMADA.md`;
- este checkpoint;
- `AI_Studio_Lab/codex/DESIGN_ESTADO_E_DECISOES.md` quando houver UI;
- `AI_Studio_Lab/tools/coverage_matrix_core.ts` / `src/curriculum/coverageMatrix.test.ts`;
- `src/curriculum/motores/composerCanaryIds.ts`;
- `AI_Studio_Lab/tools/ficha_runtime_map.cjs`;
- workflows do SHA exato do HEAD.

Próxima onda autorizada: **W34 = GE.08 / F80**.
