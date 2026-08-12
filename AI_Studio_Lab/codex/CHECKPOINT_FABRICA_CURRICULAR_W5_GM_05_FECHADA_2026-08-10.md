# CHECKPOINT — Fábrica Curricular W5 fechada — GM.05 / F61 / Regua

**Data:** 2026-08-10  
**Repo:** `dyegorodrigues/SAGA`  
**Branch única:** `codex/integrar-bloco-f0`  
**PR:** #29 (`open + draft + unmerged`)  
**Main protegida de referência:** `68fad4c575e28959b2ca4776e9a541d6828b63f3`  
**Creature Engine:** fora do escopo e intocado.

> Este checkpoint só é válido quando o CI do **HEAD que o contém** estiver integralmente verde. GitHub remoto é a autoridade; recibos antigos ou memória de conversa não vencem o status do SHA atual.

## 1. Pré-condição realmente fechada

A primeira tentativa de fechamento pré-W5 continha recibos incorretos e foi retificada. A reancoragem real encontrou CI vermelho e bloqueou a W5 até a causa ser corrigida.

A reconciliação A–E foi concluída e a sentinela documental foi alinhada à Bíblia v3.6. O fechamento pré-W5 verdadeiro ficou comprovado no HEAD `2258cd23...`, CI #991 / run `31431398361`, integralmente verde.

Somente depois desse recibo a seleção W5 começou.

## 2. Seleção causal W5

A escolha não foi hardcoded por número de ficha nem por nome do blocker. A análise cruzou:

- profundidade e descendentes no DAG;
- legado/fallback;
- divergência ficha↔screen;
- primitive bloqueadora;
- onboarding visual;
- risco motor/a11y;
- risco pedagógico;
- reuso de primitive;
- custo de implementação;
- qualidade da evidência.

### Candidatos relevantes

- `GM.05 / F61 / Regua`;
- `GM.03 / Moedas`;
- `N5.01`;
- legados/divergentes aritméticos centrais.

### Por que GM.05 venceu

- era fallback real;
- `Regua` era a única primitive autoral completamente ausente naquele momento;
- seus pré-requisitos estavam servidos;
- a competência alimenta cadeia descendente de medidas;
- a primitive tem alto valor diagnóstico e motor;
- a migração podia ser isolada e observada causalmente.

## 3. Regression-first

A regressão foi criada antes da implementação e fixou:

- pré-requisitos executáveis `GM.12 + N2.02`;
- progressão L1–L5;
- contrato da régua;
- boundary motor;
- evidência `ALINHOU_ZERO`;
- princípio de que erro motor não vira misconception.

O commit regression-first falhou pelo motivo esperado: módulos GM.05/Regua ainda não existiam. Não houve ajuste de expectativa para copiar a implementação.

## 4. Arquitetura W5

Principais fontes:

- `src/curriculum/fichas/jornada/GM.05.ts`;
- `src/curriculum/procedimentos/reguaContract.ts`;
- `src/curriculum/procedimentos/reguaProcedure.ts`;
- `src/components/primitives/Regua.tsx`;
- `src/components/primitives/ReguaStage.tsx`;
- `src/components/primitives/ObjetoMedidaArt.tsx`;
- testes F61/GM.05;
- `scripts/sonda-regua.mjs`;
- workflow CI com sonda F61.

`Regua` é um specialized builder com dono real GM.05. O gate P18 foi evoluído para aceitar builder genérico ou especializado com consumidor comprovado, sem criar um `case regua` morto no Composer.

## 5. Workflow inativo → ativo

### Fase inativa

Antes de ativar GM.05:

- ficha/contract/procedure/stage foram registrados;
- primitive física passou a existir;
- GM.05 permaneceu fallback;
- `COVERAGE_MIGRATIONS` permaneceu sem W5;
- auditoria distinguiu infraestrutura existente de competência efetivamente servida;
- suíte, TypeScript, conformidade, grafo e sondas foram usados para bloquear promoção prematura.

A sonda F61 real foi criada como gate permanente em Chrome.

### Promoção

Somente após o canário inativo ter prova suficiente, `GM.05` entrou em `DEFAULT_COMPOSER_CANARY_IDS`.

A Coverage Matrix ficou vermelha **antes do ledger** e observou o delta real:

- Composer: 29 → **30**;
- fallback: 39 → **38**;
- servidas: 51 → **52**;
- legado: **22**;
- divergências: **17**;
- swaps: **12**;
- estreias: **44**.

A estreia permaneceu 44 porque a Regua já era contada como nova linguagem visual quando a primitive física nasceu inativa. Ativar GM.05 não cria uma segunda estreia.

Somente depois dessa observação entrou `W5-GM.05` em `COVERAGE_MIGRATIONS`:

```text
{ composer: +1, fallback: -1, served: +1 }
```

O snapshot P21.1 permaneceu imutável.

## 6. Coverage Matrix vigente

Estado após W5:

- 90 competências;
- 94 fichas autorais;
- **30 Composer**;
- **22 legado**;
- **38 fallback**;
- **52 servidas**;
- **17 divergências ficha↔screen**;
- **12 swaps**;
- **44 estreias**;
- missing primitives: **`Moedas` apenas**.

Inventário de primitives observado:

- **21 executáveis**;
- **4 renderer-sem-builder**;
- **1 componente isolado**;
- **0 ausentes**.

`Regua` não é mais blocker. `Moedas` permanece o único blocker estrutural.

## 7. Retificação pedagógica F61

O monolito histórico F2 dizia que GM.05 exigia N2.04/centena. Isso contradizia o DAG/runtime vigentes e criava uma trava artificial.

O cânone normativo atual é:

- prereqs: `GM.12 + N2.02`;
- N2.04 **não** é prerequisite da F61 atual;
- nenhuma aresta/topologia foi alterada.

Fonte normativa permanente:
`AI_Studio_Lab/pedagogia/fichas/RETIFICACAO_W5_F61_GM_05_2026-08-10.md`.

## 8. Incidente de qualidade visual — não esconder

A primeira implementação funcional da Regua passou gates que eram insuficientes para qualidade de produto. A inspeção humana dos artifacts detectou problemas objetivos:

1. cápsula azul genérica com emoji/objeto dentro;
2. carrinho artificialmente alongado, parecido com limusine;
3. borracha repetida/visualmente fraca no L4;
4. rótulo `12` escapando da madeira da régua;
5. clipes emoji inclinados, com whitespace, impossíveis de usar como unidade ponta-a-ponta precisa;
6. meias marcas `0,5 cm` sem pertencer à progressão;
7. teste que validava o container invisível, não a silhueta percebida;
8. tick 0 deslocado ~2 px para dentro por uma `border` CSS.

Esses defeitos foram tratados como **bugs pedagógicos e de produto**, não cosmética.

## 9. Contrato visual definitivo F61

### Unidade informal L1

- unidade visual = bola de treino procedural, não emoji/sprite;
- diâmetro físico constante;
- `gap=0`;
- sem overlap;
- N bolas ocupam exatamente `N × diâmetro`;
- fileira começa e termina exatamente nos extremos do objeto.

### Objetos

Objetos de proporção rígida não podem ser esticados para fabricar comprimento. Famílias vigentes:

- lápis;
- pincel;
- giz de cera;
- marcador;
- fita de treino.

Pontas/caps mantêm tamanho fixo; somente o corpo longitudinal varia.

### Régua

A F61 vigente trabalha **centímetros inteiros**:

- sem ticks/rótulos 0,5;
- tick 0 é a origem física;
- `ponta visível inicial = tick 0`;
- `ponta visível final = tick da resposta correta`;
- sobra depois da última marca só contém o rótulo, sem alterar a escala;
- a moldura usa decoração que não desloca o sistema de coordenadas.

## 10. Motor, evidência e a11y

- drag real e alternativa por toque são equivalentes;
- snap generoso reconhece intenção correta perto do zero;
- soltura motora ambígua não vira misconception;
- alinhamento deliberado no 1 pode gerar `COMECA_NO_UM`;
- `pointercancel` não publica tentativa;
- tutorial pode demonstrar sem fabricar `ALINHOU_ZERO`;
- `ALINHOU_ZERO` exige ação real da criança;
- semântica ARIA e WCAG continuam testadas.

## 11. Sonda real F61

`npm run sonda:regua` é parte permanente do CI e verifica em Chrome real:

- 320 / 390 / 900 px;
- L1–L5;
- overflow;
- ticks/rótulos inteiros;
- label final contido;
- bolas tangentes e mesma extensão do objeto;
- extremos **visíveis** das artes contra ticks reais;
- L4 com tipos/comprimentos distintos;
- tap;
- drag;
- estimar→alinhar→medir→unidade;
- screenshots de todos os níveis/larguras.

A sonda nova encontrou o deslocamento real do tick 0 causado pela borda CSS; o runtime foi corrigido, não o limiar do teste.

## 12. Invariant Impact Review W5

- learner state continua autoridade de mastery/unlock/prescrição;
- nível curricular continua pertencendo ao perfil/criança;
- XP lifetime/moedas não foram alterados;
- RT permanece observacional e não multiplica mastery/XP;
- fallback continua sem evidência/recompensa real;
- Misto não mudou;
- retry/replay/idempotência não foram alterados;
- Atlas/insígnias não ganharam segunda fonte de verdade;
- DAG IDs/topologia permaneceram;
- runtime continua determinístico/offline para esta primitive;
- nenhum LLM/serviço externo tornou-se soberano;
- telemetry continua observacional;
- rollback do canário permanece possível.

## 13. Scope guard

Nesta W5:

- main não foi editada;
- nenhuma branch auxiliar foi criada;
- Creature Engine não foi tocado;
- W4/F19 não foi reescrita para acomodar W5;
- PR #29 deve continuar draft/unmerged.

## 14. Próxima onda

**W6 NÃO está selecionada.**

Antes de escrever código:

1. reancorar PR/head/CI;
2. gerar Coverage Matrix vigente;
3. recalcular DAG/profundidade/descendentes;
4. pesar fallback/legado/divergência/blocker/onboarding/motor/a11y/reuso/custo;
5. dar peso alto a `Moedas/GM.03`, o último blocker, mas sem hardcode;
6. selecionar um único nó.

Depois repetir o workflow:

`regression-first → implementação inativa → gates → browser quando necessário → canário → Matrix observa → ledger → checkpoint`.

## 15. Dívida viva para W6+

- 22 legados;
- 38 fallback;
- 17 divergências;
- `Moedas`: último blocker;
- `LinkingCubes`, `SingaporeBars`, `VisualAddition`: renderer-sem-builder;
- `Quadrado100`: componente isolado.

O objetivo final não é “zerar números artificialmente”; é deixar cada competência servida, pedagogicamente fiel, testável e coerente com DAG/learner state, com toda exceção restante explicitamente justificada.

---

**Critério de validade deste checkpoint:** CI integralmente verde do HEAD remoto que contém este arquivo + PR #29 ainda open/draft/unmerged + Matrix vigente coerente com o ledger. O recibo operacional do run deve ser registrado no PR/handoff sem reescrever snapshots históricos.
