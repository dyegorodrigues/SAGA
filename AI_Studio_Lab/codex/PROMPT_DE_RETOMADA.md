# PROMPT DE RETOMADA — Fechamento Curricular SAGA

> **Porta operacional de verdade do PR #35.** Leia este arquivo integralmente antes de editar. O GitHub remoto vence memória de conversa, prompt antigo, SHA histórico ou status presumido.

## 1. Âncora remota

- Repositório: `dyegorodrigues/SAGA`
- PR: `#35` — deve permanecer **open + draft + unmerged**
- Branch viva: `codex/fechamento-curricular`
- Base protegida: `main` em `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Estado curricular fechado: **W1–W43**
- W44: **N5.04 / F74 — Somar Frações**, materializada e inativa, aguardando promoção atômica.

Antes de qualquer escrita:

1. confirme PR, branch e HEAD remoto;
2. confirme que `main` continua no SHA acima;
3. consulte reviews/threads e workflows do **SHA exato** relevante;
4. se o HEAD tiver derivado, investigue antes de editar — o remoto vence este documento;
5. nunca misture CI de SHAs diferentes nem invente recibos, contagens ou delta da Matrix.

## 2. Estado vivo e autoridades

Coverage Matrix do último fechamento certificado (W43):

- **68 Composer ativos**
- **15 legado**
- **7 fallback**
- **83 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva autoral ainda ausente: `Moedas`

Na materialização inativa W44, o catálogo observa **69 Composer registrados / 68 ativos / 1 registrado-inativo (`N5.04`)**; a Matrix de produção permanece `68/15/7/83/11` até a promoção.

Autoridades executáveis:

- canário: `src/curriculum/motores/composerCanaryIds.ts`
- ledger e baseline derivado: `AI_Studio_Lab/tools/coverage_matrix_core.ts`
- contrato: `src/curriculum/coverageMatrix.test.ts`
- runtime físico: `AI_Studio_Lab/tools/ficha_runtime_map.cjs`
- ficha/Composer: `src/curriculum/fichas/`
- DAG: `curriculum/grafo_saga.yaml` + artefatos gerados

Checkpoint é recibo humano; Matrix, canário, DAG, runtime e CI do SHA exato vencem o texto.

## 3. Invariantes arquiteturais

- Registrar ficha no Composer **não ativa** competência.
- Promoção acontece somente no array declarativo do canário.
- **Promoção + linha nominal do ledger + contrato Matrix entram no mesmo SHA.**
- Ledger, Matrix, runtime map e canário são declarativos; nada de mutação por efeito colateral de import.
- `ficha_runtime_map.cjs`, `evidencias.ts`, `misconceptions.ts`, `constants/misconceptions.ts` e `coverage_matrix_core.ts` são cânone compartilhado **aditivo**; não apagar, condensar ou reescrever história anterior.
- Matrix observa o delta real. Baseline não pode ser relaxado para fabricar verde.
- Tag emitida pela ficha só vale se Radar/catálogo a reconhecer e houver teste nominal.
- Palco autoral não pode entregar a resposta antes da decisão da criança.
- Exposição motora alta exige alternativa por toque/snap e separação entre erro motor e misconception.
- Não tocar/mergear `main`.
- Não marcar PR ready, não habilitar auto-merge.
- Não tocar Creature Engine/Tamagotchi neste fluxo.

## 4. Último fechamento completo — W43

`N4.12 / F71 — Dividir por Dois Dígitos` está fechada no SHA final `83c18fd6902bb3d23a77fca04c051cd417b103b7`.

Recibos finais:

- CI `32048810747` — `completed/success`
- Certificação transversal `32048810884` — `completed/success`
- Matrix `68/15/7/83/11`

Não reabrir W43 sem causa nova observável.

## 5. W44 — cadeia já executada

Competência/ficha: `N5.04 / F74 — Somar Frações`  
Prereq: `N5.03`  
Primitiva canônica: `SingaporeBars`  
Kind: `soma-fracoes-f74`

### 5.1 Regression-first

SHA `34b6b3a5ed3fde597564685e7b2a820c2beca0f7`:

- CI `32050560773` — `completed/failure`, vermelho nominal exclusivamente pela ausência real de `N5.04/F74`;
- transversal `32050560782` — `completed/success`;
- 3.279/3.280 testes verdes no regression-first;
- Matrix permaneceu `68/15/7/83/11`.

### 5.2 Materialização inativa

A primeira materialização foi `4f1f8c702e431cb9ee7b306e39eccd7c4e7e7314`; encontrou uma incompatibilidade de mutabilidade TypeScript na resolução F74. Não usar esse SHA como recibo final.

Reparo mínimo de tipagem: `a41e6e9e6317efcec230b879722a8ae3fcafd8ae` (`fix: alinhar mutabilidade da resolucao F74`).

**Este é o recibo técnico inativo vinculante da W44:** 

- CI `32052726802` — `completed/success`;
- Certificação transversal `32052726430` — `completed/success`;
- Gates: catálogo, fichas, conformidade, grafo, TypeScript, **235 arquivos / 3.287 testes**, build e guarda textual verdes;
- higiene e binários verdes;
- `N5.04` registrada no Composer e **INATIVA**;
- Matrix de produção ainda `68/15/7/83/11`.

A materialização inclui contrato/builder F74, ficha Jornada N5.04, `SomaFracoesStage`, renderer/wiring, runtime map SingaporeBars, política de resposta, misconceptions/Radar e testes nominal/físico.

## 6. Contrato pedagógico F74 que já está materializado

Escada:

1. soma com barras;
2. soma simbólica;
3. subtração;
4. fração imprópria / resultado maior que 1;
5. simplificação como **mesma quantidade, outro nome**.

Restrições:

- somente denominadores iguais em F74;
- denominador representa tamanho da parte e permanece fixo;
- não introduzir denominadores diferentes oportunisticamente;
- `SingaporeBars` realiza fisicamente o tanque/partes, sem pré-renderizar resposta;
- diagnósticos: `soma-denominador`, `nao-simplifica`, `impropria-invalida`;
- domínio `{ acertos: 3, de: 3, sessoes: 2 }`;
- acerto imediatamente precedido por `SOMA_DENOMINADOR` na mesma questão/sessão continua correto para a missão, mas não recebe crédito de mastery; a implementação reutiliza `masteryDisqualifier`, não cria segunda autoridade de domínio.

F73/N5.03 é o precedente físico de equivalência e SingaporeBars.

## 7. Próxima ação obrigatória — NÃO repetir materialização

Ao retomar:

1. reancorar PR/HEAD/main/reviews/threads;
2. confirmar que o estado materializado de `a41e6e9e…` está presente no HEAD e que os recibos inativos acima continuam válidos;
3. **não refazer regression-first nem materialização F74**;
4. promover W44 atomicamente no mesmo SHA alterando somente o necessário:
   - adicionar `N5.04` a `DEFAULT_COMPOSER_CANARY_IDS` em `composerCanaryIds.ts`, citando o portão inativo `a41e6e9e…`, CI `32052726802` + transversal `32052726430`;
   - adicionar `W44-N5.04` ao array `COVERAGE_MIGRATIONS` em `coverage_matrix_core.ts`, preservando todo o histórico anterior;
   - atualizar a sequência/última migração/baseline esperado em `coverageMatrix.test.ts`;
5. executar/observar Matrix e aceitar **o delta real**. Se nada além da ativação mudou, o esperado é `69 Composer / 15 legado / 6 fallback / 84 servidas / 11 divergências`, mas a saída executável vence essa expectativa;
6. exigir **CI + Certificação transversal completed/success do SHA final de promoção**;
7. só então declarar W44 fechada, criar checkpoint `...W44...FECHADA...`, atualizar esta porta e PR body;
8. recalcular DAG/Matrix e escolher W45 pelo critério causal antes de abrir o regression-first seguinte.

## 8. Fila ainda não fechada

FallBacks do estado pós-W43: `AL.08, GM.11, N5.04, N5.05, N6.02, N6.04, PE.04`.

`N5.05` depende de `N5.04 + N6.04`; portanto a promoção W44 altera a elegibilidade downstream e a fila deve ser **recalculada**, não copiada de memória.

Critério:

1. prereqs servidos;
2. maior ganho imediato de desbloqueio;
3. menor `causalWave`;
4. maior downstream;
5. ID / menor delta estrutural como desempate residual.

Não escolher W45 antes de W44 final verde e Matrix/DAG observados.

## 9. Documentos de continuidade

Ler quando necessário:

- `AI_Studio_Lab/codex/ESTADO_DO_FECHAMENTO.md`
- `AI_Studio_Lab/codex/AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`
- `AI_Studio_Lab/codex/AUDITORIA_MOTOR_DE_RESOLUCAO_2026-08-12.md`
- `AI_Studio_Lab/codex/PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W42_N4_11_F70_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W43_N4_12_F71_FECHADA_2026-08-17.md`
- `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W44_N5_04_F74_INATIVA_CERTIFICADA_2026-08-17.md`

Issues `#47` e `#48` continuam pós-90/90 e não interrompem W44–W50.

## 10. Restrições absolutas

- PR #35: open + draft + unmerged.
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.
- Sem auto-merge/ready.
- Sem Creature Engine/Tamagotchi.
- Sem apagar rationale/aliases/notas do cânone.
- Sem enfraquecer testes, sondas, Matrix ou auditores.
- Sem baseline para mascarar deriva.
- Sem misturar recibos de SHAs distintos.
- Sem inventar resultado de workflow que ainda não terminou.

**Resumo operacional:** W43 está fechada. W44/F74 está materializada, inativa e duplamente verde no recibo `a41e6e9e…`. O próximo passo é exclusivamente a promoção atômica W44, seguida de Matrix observada e dupla recertificação final.