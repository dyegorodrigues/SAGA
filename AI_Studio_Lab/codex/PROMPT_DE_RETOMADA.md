# PROMPT DE RETOMADA — SAGA

> **Uso:** copie e cole integralmente este arquivo em uma conversa nova com `@GitHub`.
> **Manutenção:** Matrix/ledger em toda onda, sempre depois da observação real. Checkpoint + este prompt a cada bloco de 5 ondas, ou imediatamente se regra/protocolo mudar.

@GitHub Continue o desenvolvimento do SAGA a partir do estado remoto atual.

Repo: `dyegorodrigues/SAGA`
PR: `#35`
Branch: `codex/fechamento-curricular`

## 1. Fonte da verdade e reancoragem obrigatória

O **GitHub remoto é a fonte da verdade**. NÃO confie apenas neste prompt, em memória, em SHA antigo ou em CI de outro commit.

Antes de qualquer edição:

1. confirme PR #35 `open + draft + unmerged`;
2. confirme a branch `codex/fechamento-curricular` e o HEAD remoto atual;
3. confirme `main` intocada em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`;
4. confira **os dois workflows** do HEAD exato, jobs, reviews e review threads;
5. se houver deriva, investigue antes de editar — o remoto vence este arquivo.

## 2. Dois workflows — certificação por SHA + sementes paralelas

| Workflow | Jobs | Concorrência |
|---|---|---|
| **CI** | Gates do SAGA · Sonda real Sensei · Higiene · Binários | grupo por `ref`, cancelável |
| **Certificação transversal** | 8 jobs paralelos de 390 px, uma semente canônica por job · 1 job 320/900 px × 1 semente | grupo por `head.sha`, `cancel-in-progress: false` |

Sementes canônicas em `sonda/cenas.tsx`: `[1, 7, 42, 99, 123, 777, 2024, 31415]`.

`?sementes=N` / `SONDA_SEMENTES=N` continua significando **prefixo**. Cada job torna sua semente alcançável pelo prefixo e filtra nominalmente `[semente X]`. `src/curriculum/sondaSeedCoverage.test.ts` prova cobertura exata e unicidade.

A prova de concorrência entre SHAs já passou: runs `31719520999` e `31721098530` coexistiram vivos. **Não refazer.**

**Recibo válido = os dois workflows verdes no MESMO SHA.** Na transversal, os oito jobs 390 + responsivo precisam estar verdes.

## 3. Ordem de leitura

1. este arquivo;
2. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W15_W19_FECHADA_2026-08-14.md`;
3. `AI_Studio_Lab/codex/RETOMADA.md`;
4. `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`;
5. `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`;
6. `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`;
7. `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`;
8. `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`.

Precedência: **GitHub remoto atual → gates executáveis → este prompt/checkpoint mais novo → documentos anteriores**.

## 4. Estado curricular — verificado no remoto em 15/08, 01h30 UTC

> ⚠️ **Este bloco foi reescrito a partir do repositório, não de relatório.**
> Os números vêm do ledger, do canário vivo e dos portões executados no HEAD
> `dbd9c4c`.
>
> Registro do episódio que criou esta regra: em 14/08 um relatório de
> fechamento descreveu W22–W26 como concluídas e a Matrix como `51/15/24/66/11`
> quando o remoto tinha apenas W22 e W23 promovidas e as fichas `PE.02`/`GM.08`
> sequer existiam. O texto estava **à frente** do runtime. As ondas foram
> executadas de verdade depois, e só por isso os números coincidem hoje —
> coincidência não é evidência. Continue exigindo canário + ledger + dois
> workflows verdes no mesmo SHA.

Fechadas e promovidas: **W15** `N5.01/F45` · **W16** `N5.02/F72` · **W17**
`N6.01/F75` · **W18** `N5.03/F73` · **W19** `N4.10/F69` · **W20** `GM.07/F63` ·
**W21** `AL.05/F46` · **W22** `N6.03/F87` · **W23** `GE.06/F78` · **W24**
`N7.01/F84` · **W25** `PE.02/F64` · **W26** `GM.08/F81`.

Matrix vigente, derivada do ledger e conferida contra o canário vivo
(51 ids ativos em `composerCanaryIds.ts`):

`51 Composer / 15 legado / 24 fallback / 66 servidas / 11 divergências / 12 swaps / 44 estreias`

**Restam 24 fallbacks.** Legado conta como servido e não deve ser migrado só por estética.

### Recibos das ondas W24–W26

- **W24 `N7.01/F84`** — regression `241a894`; inativo `1f912c8f` (CI
  `31825522496`, transversal `31825522510`); promoção com ledger atômico
  `57bef7e`; **recibo final `083632d`** (CI `31840606795`, transversal
  `31840606811`). O SHA intermediário `13ed81e` ficou **vermelho** e não serve
  de recibo — ver a lição de gate abaixo.
- **W25 `PE.02/F64`** — regression `b34b194`; inativo `748724d` (CI
  `31842370575`, transversal `31842370542`); promoção `a24bbb0`; **recibo final
  `650ac64`** (CI `31843453601`, transversal `31843453565`).
- **W26 `GM.08/F81`** — regression `c787d85` (CI vermelho intencional);
  inativo `3d6a636` (CI `31852463035`, transversal `31852463034`); promoção
  `92e0a1e`; **recibo final `bb44915`** (CI `31853166671`, transversal
  `31853166653`).

### Onda em curso — W27 `AL.06 / F77`

**Materializada e INATIVA. O portão do §9.7 JÁ ESTÁ CUMPRIDO.**

- regression-first `a46ca9f`; materialização inativa
  `dbd9c4c9ed97efdaed852669f5c372e30054c55a`;
- o SHA inativo `dbd9c4c` está com **os dois workflows verdes**: CI
  `31853918490` e Certificação transversal `31853918503`;
- `AL.06` está **fora** de `DEFAULT_COMPOSER_CANARY_IDS` e **não** há linha
  `W27-AL.06` no ledger — correto para o estado inativo;
- portões locais no mesmo SHA: 212 arquivos / 2.986 testes, `tsc` limpo,
  `auditar`, `fichas:auditar`, `grafo:check` e `build` verdes.

**Próximo passo, §9.8/§9.9:** promover `AL.06` em alteração isolada do canário,
com a linha do ledger no mesmo SHA; deixar a Matrix observar o delta real
(esperado `{ composer +1, fallback −1, served +1 }` → `52/15/23/67/11`); e só
então abrir a W28.

### Lição de gate — contrato transversal envelhece com o currículo

O CI de `13ed81e` (W24) caiu porque o contrato genérico do canário exigia
`>= 0` de todo número em qualquer nó promovido. A regra era correta enquanto o
currículo vivia nos naturais, e passou a recusar o `-3` que é o gabarito
legítimo da F84 no L1.

A correção (`083632d`) não removeu a regra nem abriu exceção por id: a ficha
declara o conjunto que ensina (`dominioNumerico`) e o contrato pergunta a ela
qual é o piso. Quem não declara nada segue nos naturais, então os demais
canários continuam protegidos. O palco `reta-completa-f84` ganhou contrato
próprio — gabarito posicional cabe na reta desenhada, gabarito de distância
continua proibido de ser negativo, e a reta cruza o zero.

**Regra:** ao abrir faixa numérica nova — inteiros agora, racionais depois —
verifique antes se algum invariante genérico já proíbe o conteúdo novo.
Derivar o invariante da declaração da ficha custa uma linha e evita tanto o
falso verde quanto a exceção por id.

### Como se seleciona — a conta que engana

O §7.3 pede a elegível que destrava mais fallbacks descendentes. A contagem
ingênua — filhos diretos que estão em fallback — **superestima**: credita ao
candidato filhos que continuam bloqueados por outro pré-requisito. `GM.08`
parecia destravar `GE.09` e `GE.10`, mas `GE.10` também dependia de `GE.04`.

Critério certo: **quantos fallbacks passam a ter _todos_ os pré-requisitos
servidos**. Recalcule no estado vivo a cada onda; a cascata total não desempata,
porque o grafo restante é alcançável por qualquer porta.

### Regra reforçada — relatório não fecha onda

Onda fechada é onda cujo `id` está no canário **e** no ledger **e** cujo SHA
passou nos dois workflows. Texto de fechamento não é evidência; se o relatório
e o repositório divergirem, o repositório vence e o texto se corrige.

Recibo de código do bloco: `ecdbd3251fa1cc7b170e57bf6da2ad38c4aa6354` — CI `31799848732` ✅ + transversal `31799848715` ✅.

### Recibos resumidos

- W15: regression `43373a1f` → final `2ca2fb0a`; Matrix `40/15/35/55/11`.
- W16: regression `bb1ef0e9`; inativo `4789636c` (CI `31764367753`, transversal `31764367742`); promoção `a3bcf427`; final `138da994` (CI `31765155011`, transversal `31765155010`); Matrix `41/15/34/56/11`.
- W17: regression `536780b9`; inativo `f52d74aa` (CI `31766412517`, transversal `31766412457`); promoção `b9dc5999`; final `30744492` (CI `31766921778`, transversal `31766921781`); Matrix `42/15/33/57/11`.
- W18: regression `4354372a`; uma versão de ledger antecipou a promoção por engano. Promoção remota real e isolada: `ecdecfec`; CI `31795872830` observou `43/15/32/58/11` e todas as falhas de W18 desapareceram; restou só a regressão intencional da W19.
- W19: regression `31ecbd6a`; inativo `4ed4858d` (CI `31798437057`, transversal `31798437091`); promoção `056c19e3`; Matrix observou `44/15/31/59/11` **antes** do ledger; recibo final de código `ecdbd325`.

## 5. Regra reforçada após a correção da W18

A W18 expôs uma inversão proibida: texto dizia que a promoção/Matrix já tinham ocorrido antes de o canário existir no remoto.

**Ordem obrigatória, sem exceção:**

`promoção remota real → Matrix observa o delta real → ledger/checkpoint`

Documento nunca pode antecipar canário, Matrix, CI ou recibo. Se o texto estiver à frente do runtime, corrija o runtime/prova primeiro ou retire a afirmação; não use o texto como evidência.

## 6. Matrix e mapa runtime são declarativos

Foi removido o atalho que mutava `COVERAGE_BASELINE`/`COVERAGE_MIGRATIONS` por efeito de import e o wrapper `.map()` do mapa runtime.

Estado vigente:

- `coverage_matrix.ts` é re-exportação pura;
- `coverage_matrix_core.ts` declara estaticamente o ledger W1–W19 e deriva `COVERAGE_BASELINE` a partir de `COVERAGE_CLOSED_BASELINE + deltas`;
- `ficha_runtime_map.cjs` é array declarativo explícito;
- `ficha_runtime_map_core.cjs` não existe mais.

**Invariante:** auditoria, Matrix, baseline e mapa runtime NÃO devem depender de mutação como efeito de import nem de ordem de carregamento.

## 6-A. Cânone não se comprime — e agora existe portão

`src/constants/evidencias.ts` foi de **156 linhas para 3** no commit `008ac01`
(materialização da W16) e seguiu minificado por todo o bloco W15–W19. Os 2.851
testes ficaram verdes o tempo inteiro, porque comentário não é executável.

O que se perdeu não era enfeite: era a frase que explica, para cada condição da
§9, qual ficha a exige, em que nível, e **por que acertar sem ela não provaria
a competência**. Restaurado em `12c7cf4d`, com os 22 valores conferidos
idênticos por comparação automática — só a documentação voltou.

`src/constants/evidencias.doc.test.ts` agora reprova entrada sem bloco de
documentação e reprova o arquivo comprimido. A trava foi verificada nos dois
sentidos: falha no minificado, passa no restaurado.

**Regra:** ao materializar uma ficha, não reescreva arquivos de cânone
compartilhado em forma comprimida. Acrescente a sua entrada e preserve as
existentes. Vale para `evidencias.ts`, `misconceptions.ts`,
`ficha_runtime_map.cjs` e `coverage_matrix_core.ts` — os quatro já perderam
documentação uma vez.

**Pendência FECHADA:** `src/curriculum/fichas/jornada/N5.03.ts` estava inteiro
em 4 linhas. Foi restaurada em `5e97df9` e hoje tem 108 linhas, com o bloco
pedagógico da F73 legível. Nenhuma ficha da Jornada segue minificada.

## 7. Critério de seleção — fallback-first

1. priorize competências em FALLBACK;
2. só escolha fallback cujos pré-requisitos estejam servidos;
3. entre elegíveis, escolha a que destrava mais fallbacks descendentes;
4. legado só passa à frente quando bloqueia uma fallback ou não há fallback elegível;
5. recalcule Matrix + DAG depois de **cada** onda. Lista histórica nunca vence estado vivo.

Antes da W20, recalcular tudo. Não inferir a próxima competência deste prompt.

## 8. Portões locais antes de push

Quando houver checkout local funcional, antes de qualquer push que deva ser verde:

```bash
npm test
npx tsc --noEmit
npm run auditar
npm run build
SONDA_SEMENTES=1 npm run sonda
```

Regression-first vermelho é a exceção intencional. Se a sessão não tiver checkout local executável, **não invente resultado local**; declare a limitação e use os gates remotos obrigatórios por SHA exato.

## 9. Protocolo obrigatório de cada onda

1. reancorar ficha canônica, grafo, Matrix e runtime;
2. regression-first executável, vermelho pelo motivo correto;
3. implementar registrada e **INATIVA**;
4. toda ficha nova nasce com `resolucao()` declarativa tipada sob R0-A;
5. reutilizar primitivas canônicas; não inventar segunda linguagem visual;
6. portões locais da §8 quando houver checkout;
7. Gates + sonda Chrome real da ficha + transversal no mesmo SHA inativo;
8. promover somente após os dois workflows verdes nesse SHA;
9. promoção em alteração isolada do canário;
10. deixar a Matrix observar o delta real — nunca presumir;
11. **só então** reconciliar `COVERAGE_MIGRATIONS`;
12. exigir os dois workflows verdes no HEAD final exato;
13. checkpoint + prompt só a cada 5 ondas, salvo mudança imediata de regra.

**Não certificar várias ondas em lote.** Cada onda tem seu próprio inativo certificado, promoção isolada, observação, ledger e fechamento.

## 10. Série de tempo fallback × legado

Metodologia: regression-first → recibo final, no histórico real.

- legado: `n=9`, média `3,49 h`, mediana `2,78 h`;
- fallback limpo mensurável: W5 `2,84 h`, W13 `3,02 h`, W14 `3,07 h`, W15 `0,75 h`, W16 `0,91 h`, W17 `0,43 h` → `n=6`, média **1,84 h**, mediana **1,87 h**.

W18/W19 ficam fora da média de throughput porque atravessaram interrupção de sessão/conector e reparo de protocolo; o tempo bruto mede mais que custo de engenharia. A queda de W15–W17 é compatível com a paralelização das sementes, mas a amostra segue pequena.

## 11. Sonda F14 / fonte externa

A dependência de Google Fonts continua dívida de produto. A sonda F14 ignora somente HTTP >=400 de recurso `font` vindo de `https://fonts.gstatic.com/`; falhas do aplicativo continuam fatais. Hospedar a fonte localmente continua devido, mas não faz parte do caminho crítico curricular atual.

## 12. Definição de pronto

Autoridade: `AI_Studio_Lab/codex/DEFINICAO_DE_PRONTO.md`.

Fábrica curricular pronta = **grafo integralmente servido, fallback=0, nenhum `Em construção`, cadeia autoral auditável e os dois workflows verdes no mesmo SHA**. Não é necessário migrar todo legado para Composer.

Fora da fábrica: player da resolução · Oficina · conta armada · mascote / Creature Engine · Thinking Engine runtime.

## 13. Restrições duras

- NÃO tocar `main`.
- NÃO mergear, marcar ready ou ativar auto-merge.
- NÃO reabrir onda fechada sem regressão comprovada.
- NÃO tocar Creature Engine.
- Thinking Engine runtime NÃO autorizado.
- NÃO fazer faxina oportunista.
- NÃO enfraquecer gate para obter verde.
- NÃO tratar falha/404 como flake sem evidência.
- NÃO alterar snapshot histórico P21.1; evolução é pelo ledger nominal.
- NÃO usar import-time mutation/order dependence para estado de auditoria.
- NÃO escrever ledger/checkpoint antes da prova remota que ele afirma registrar.
- NÃO certificar várias ondas em lote.

## 14. Autonomia e reporte

Executar autonomamente, recalculando Matrix/DAG em toda onda.

Próximo lote: **concluir a W24 e seguir até a W28**. Reportar somente ao fechamento das cinco ondas, salvo condição de parada real comprovada ou mudança de protocolo que exija registro imediato.

Se a conversa saturar, preserve no remoto o último estado válido e registre apenas o necessário para retomada sem ambiguidade.
