# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia integralmente antes de editar. GitHub remoto, gates executáveis, DAG, canário e Matrix do SHA exato vencem memória, prompt antigo ou checkpoint.

## 1. Âncora remota

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Estado curricular fechado: **W1–W46**
- Último SHA técnico final certificado: `c2cf5b29639ce5a13d9d190ed312cad4df797dac`
- Fase operacional atual: **W47 · N6.02/F76 — Contas com Vírgula · regression-first VALIDADO; materialização inativa autorizada**
- Contrato regression-first: `src/curriculum/contasVirgulaW47.test.ts`
- Recibo regression-first vinculante W47: `073bfab1469aeb86bdc0c3376634cba559880961`

Antes de qualquer escrita:

1. confirme PR, branch, HEAD e base remotos;
2. confirme que `main` continua no SHA acima;
3. consulte workflows, reviews e review threads do SHA relevante;
4. se houver deriva, investigue antes de editar — o remoto vence este arquivo;
5. nunca misture recibos entre SHAs nem invente contagens ou delta da Matrix.

## 2. Estado vivo pós-W46

Coverage Matrix executável observada no SHA final W46 e preservada pelo regression-first W47:

- **71 Composer**
- **15 legado**
- **4 fallback**
- **86 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Fallbacks reais:

`GM.11, N5.05, N6.02, PE.04`.

Autoridades:

- canário: `src/curriculum/motores/composerCanaryIds.ts`
- ledger/baseline: `AI_Studio_Lab/tools/coverage_matrix_core.ts`
- contrato Matrix: `src/curriculum/coverageMatrix.test.ts`
- runtime físico: `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- ficha/Composer: `src/curriculum/fichas/`
- DAG: `curriculum/grafo_saga.yaml` + artefatos gerados

Checkpoint é recibo humano; fontes executáveis vencem texto.

## 3. Invariantes arquiteturais

- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente pelo array declarativo do canário.
- **Canário + ledger nominal + contrato Matrix entram no mesmo SHA de promoção.**
- Ledger, Matrix, runtime map e canário são declarativos; sem mutação por efeito colateral de import.
- `ficha_runtime_map.cjs`, `evidencias.ts`, catálogos de misconceptions e `coverage_matrix_core.ts` são cânone compartilhado **aditivo**; não apagar, condensar ou reescrever história anterior.
- Matrix observa o delta real; baseline não pode fabricar verde.
- Tag emitida só vale se Radar/catálogo reconhecer e houver teste nominal.
- Evidência de domínio deve pertencer ao catálogo central e ter emissor auditável; resposta errada não emite domínio.
- Palco autoral não pode entregar resposta antes da decisão.
- Exposição motora alta exige toque/snap equivalente, alvo generoso e separação erro motor × misconception.
- RT não governa domínio conceitual.
- Não tocar/mergear `main`; não marcar PR ready; não habilitar auto-merge; não tocar Creature Engine/Tamagotchi.

### Domínio numérico da ficha — portão que já parou três ondas

`src/curriculum/motores/canaryContract.test.ts` valida o conjunto numérico de
todo canário ativo. A régua sai da **ficha**, nunca de exceção por id:

| declaração na ficha | o que passa a valer |
|---|---|
| ausente | naturais: recusa negativo e recusa não-inteiro |
| `dominioNumerico: "inteiros"` | admite negativo; ainda exige inteiro |
| `dominioNumerico: "racionais"` | admite decimal/fração; **e negativo também** |

Em qualquer conjunto, `NaN` e `Infinity` continuam sendo defeito de gerador.
Isso nunca se relaxa.

**Histórico — o mesmo erro três vezes:**

- **W24 `N7.01/F84`** — o contrato exigia `>= 0`. A ficha ensina o sinal, e `-3`
  é o gabarito do L1. Corrigido criando `dominioNumerico`.
- **W36 `GM.10/F93`** — o contrato exigia inteiro. Conversão de unidades produz
  `1,5 m` e o distrator `0,01`. Corrigido criando `"racionais"`.
- **W46 `AL.08/F90`** — aqui o gate estava **certo**: 5 opções violavam o teto
  universal de 4. A ficha cedeu, não o contrato.

**A lição das três:** antes de materializar, pergunte *"esta ficha produz número
fora dos naturais?"*. Se sim, declare na ficha **ainda no estágio inativo**. Se
não, não declare. E quando o gate acusar, decida qual dos dois está errado —
contrato ou ficha — em vez de assumir qualquer um dos dois.

**Já declaram:** `N7.01`, `N7.02`, `N5.04`, `N6.04`, `GM.10`, `AL.08`.

⚠️ **W47 = `N6.02/F76 — Contas com Vírgula` opera decimais em todos os cinco
níveis.** Ela vai precisar de `dominioNumerico: "racionais"`. Declare junto com a
materialização inativa; se esquecer, o portão de promoção fecha vermelho e você
perde um ciclo inteiro de certificação.

## 4. W46 — AL.08/F90 FECHADA

Regression-first vinculante:

- SHA `d68edc718f4bcaa53da66a58e87e680450ea2d0c`;
- CI `32076649252` — failure nominal somente por AL.08/F90 ausente;
- transversal `32076649256` — success.

Materialização inativa vinculante:

- SHA `f3c7c4d4e044fd275bee0e5f6985497fd2c20ced`;
- CI `32085678926` — success;
- transversal `32085678976` — success;
- AL.08 ainda fora do canário e do ledger nesse SHA.

Promoção atômica:

- SHA `d4c22e59c2e600570c705f9d0a46ff9cc38c9630`;
- compare remoto provou exatamente três arquivos: canário AL.08 + ledger W46 + contrato Matrix;
- transversal `32086538164` — success;
- CI `32086538316` — failure real.

Diagnóstico do CI vermelho:

- classe **A — regressão real**;
- job `Gates do SAGA`, step `Testes`;
- `src/curriculum/motores/canaryContract.test.ts:237`;
- erro: `AL.08 L1: 5 opções: expected 5 to be less than or equal to 4`;
- causa na materialização F90: gabarito + 4 distratores = 5 opções;
- o gate universal de ≤4 opções estava correto e não foi relaxado.

Reparo:

- F90 passou a oferecer gabarito + três distratores por nível, rotacionando misconceptions;
- `3cc05e5e…` expôs uma segunda regressão real no contrato de retry L3 ao omitir `RESPONDE_O_TODO`;
- o SHA final `c2cf5b29639ce5a13d9d190ed312cad4df797dac` preserva no L3 `OPERACAO_INVERSA_ERRADA + QUEBRA_EQUILIBRIO + RESPONDE_O_TODO`, omitindo `NAO_APLICA_AOS_DOIS` somente nesse nível; a quarta misconception continua exercitada nos demais níveis;
- nenhum teste, sonda, Matrix ou contrato foi enfraquecido.

Certificação final do mesmo SHA `c2cf5b29639ce5a13d9d190ed312cad4df797dac`:

- CI `32094469085` — `completed/success`;
- Certificação transversal `32094469058` — `completed/success`, 9/9;
- 239 arquivos / 3.347 testes verdes;
- canário, palco F90, build, Sensei, higiene e binários verdes;
- Matrix real `71/15/4/86/11`.

**W46 está FECHADA. Não reabrir F90 sem causa nova observável.**

Checkpoint detalhado:

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W46_AL_08_F90_FECHADA_2026-08-18.md`.

## 5. Recalculo causal pós-W46 e seleção W47

Critério vivo:

1. prereqs servidos;
2. maior ganho imediato de desbloqueio;
3. menor `causalWave`;
4. maior downstream;
5. ID / menor delta estrutural como desempate residual.

Quatro fallbacks reais e prereqs atuais do DAG:

- `N6.02` ← `N6.01 + N3.11 + N3.12`;
- `GM.11` ← `GM.09 + N4.02`;
- `N5.05` ← `N5.04 + N6.04`;
- `PE.04` ← `PE.03 + N6.03`.

Todos os prereqs estão servidos. Nenhum dos quatro destrava imediatamente outro fallback restante, portanto o primeiro desempate empata.

No recálculo anterior, `AL.08` e `N6.02` eram os únicos empatados na menor `causalWave` relevante. W46 não alterou o DAG; a Matrix real apenas retirou `AL.08` do conjunto fallback. Revalidado contra o DAG remoto atual, `N6.02` torna-se o candidato de menor onda causal entre os quatro restantes.

**W47 = `N6.02 / F76 — Contas com Vírgula`.**

Não perpetuar fila prevista depois da próxima promoção: recalcular novamente.

## 6. Contrato canônico F76 — vinculante

Fonte autoral: `AI_Studio_Lab/pedagogia/fichas/FICHAS_F3_COMPLETAS.md`.

Identidade:

- competência: `N6.02 — Operações com decimais`;
- ficha: `F76 — Contas com Vírgula`;
- primitivas: `InteractiveVertical + Quadrado100`;
- prereqs DAG: `N6.01 + N3.11 + N3.12`.

Fundamento:

- somar/subtrair decimais alinhando **a vírgula**, não os dígitos da direita;
- só se combinam ordens iguais: décimo com décimo, unidade com unidade;
- a vírgula é o marco que alinha as ordens;
- zeros de preenchimento tornam explícitas casas ausentes sem mudar o valor.

Cinco níveis:

1. mesma quantidade de casas;
2. casas diferentes, com zeros de preenchimento;
3. subtração;
4. reagrupamento;
5. multiplicação por 10/100.

Misconceptions canônicas:

- `ALINHA_PELA_DIREITA`;
- `IGNORA_ZEROS`;
- `VIRGULA_PERDIDA`.

Tags runtime esperadas no Radar:

- `alinha-pela-direita`;
- `ignora-zeros`;
- `virgula-perdida`.

Domínio:

- `{ acertos: 3, de: 3, sessoes: 2 }`;
- incluir ao menos um caso de **casas diferentes (L2)** como evidência executável, não texto morto.

Resolução:

- explicitar valor posicional e alinhamento pela vírgula;
- mostrar zeros de preenchimento quando necessário;
- em subtração/reagrupamento, preservar a lógica de ordens;
- em ×10/×100, ensinar deslocamento de valor posicional, não “mover a vírgula” como regra sem significado;
- não revelar resposta antes da decisão; resolução assistida não compra mastery independente.

Acessibilidade/motor:

- manipulação deve ter alternativa por toque;
- arrasto não pode ser obrigatório para provar conceito;
- erro motor separado de misconception;
- RT fora da autoridade conceitual.

## 7. W47 regression-first — VALIDADO

Contrato: `src/curriculum/contasVirgulaW47.test.ts`.

Recibo vinculante:

- SHA `073bfab1469aeb86bdc0c3376634cba559880961` — `test: fechar W46 e abrir W47 regression-first`;
- CI `32095359960` — `completed/failure` **nominal**;
- Certificação transversal `32095359969` — `completed/success`, 9/9;
- Sonda real Sensei — `completed/success`;
- higiene e guarda de binários — `completed/success`;
- auditoria do catálogo, fichas, conformidade, DAG e TypeScript — success;
- Matrix preservada: `71/15/4/86/11`;
- suíte: 240 arquivos / 3.348 testes; **239 arquivos e 3.347 testes passam; 1 teste falha**;
- único vermelho: `src/curriculum/contasVirgulaW47.test.ts`;
- erro exato: `AssertionError: expected undefined to be defined` em `contasVirgulaW47.test.ts:23`, porque `JOURNEY_FICHAS.find(item => item.id === "N6.02")` retorna `undefined`.

Classificação: **regression-first válido**. O vermelho prova exclusivamente que `N6.02/F76` ainda não foi materializada. Não há regressão funcional paralela e não há motivo para rerun do CI nominal.

O contrato já exige, para a futura materialização:

- prereqs vivos corretos;
- saída real do fallback para Composer;
- mastery 3/3 × 2 sessões;
- evidência L2 de casas diferentes;
- três misconceptions canônicas reconhecidas pelo Radar;
- resolução causal em todos os cinco níveis;
- RT fora da autoridade conceitual.

**Não relaxar, apagar ou reescrever o regression-first para fazê-lo verde.**

Checkpoint do recibo:

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W47_N6_02_F76_REGRESSION_FIRST_2026-08-18.md`.

## 8. Próxima ação autorizada — materialização INATIVA W47

Com o regression-first W47 validado, a próxima alteração técnica é:

1. materializar `N6.02/F76` completa e **INATIVA**;
2. criar ficha Journey, contrato/builder, kind/palco apropriado, renderer/wiring, resolução, Radar/misconceptions, evidência L2, runtime map, answer policy e testes;
3. reutilizar `InteractiveVertical + Quadrado100`; não criar primitiva paralela sem causa;
4. manter `N6.02` fora de `DEFAULT_COMPOSER_CANARY_IDS`;
5. manter `W47-N6.02` fora do ledger/Matrix durante a fase inativa;
6. não antecipar baseline nem declarar N6.02 servida;
7. exigir CI + transversal verdes no mesmo SHA inativo;
8. somente então promover atomicamente canário + ledger + contrato Matrix;
9. deixar a Matrix executável observar o delta real;
10. exigir CI + transversal verdes no SHA final;
11. fechar W47 e recalcular W48 pelo remoto.

## 9. Cadência e governança

- Uma onda por vez; não materializar a seguinte antes do portão correspondente.
- Regression-first vermelho por design não substitui recibo técnico verde da onda anterior.
- Issue #47 é a porta pós-90/90 de **Integração Sistêmica e Child-Ready**; `90/90 servido` não equivale a produto Child-Ready.
- Issue #48 é o registro vivo de **lacunas microcurriculares/microprogressão**; `GM.06/F62 — segundos?` permanece `CANDIDATA`, não dívida confirmada.
- #47/#48 não interrompem W47–W50; entram em uso forte após `fallback=0` e fechamento técnico/documental da última onda.
- Não usar baseline para fabricar verde.
- Não inventar recibos nem misturar SHAs.
- Cânone compartilhado é aditivo.

## 10. Documentos de continuidade

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W47_N6_02_F76_REGRESSION_FIRST_2026-08-18.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W46_AL_08_F90_FECHADA_2026-08-18.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W45_N6_04_F88_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`
- GitHub issues `#47` e `#48` para a fase pós-90/90.

`RETOMADA.md` é deliberadamente uma ponte atemporal para esta porta e não deve duplicar estado curricular.
