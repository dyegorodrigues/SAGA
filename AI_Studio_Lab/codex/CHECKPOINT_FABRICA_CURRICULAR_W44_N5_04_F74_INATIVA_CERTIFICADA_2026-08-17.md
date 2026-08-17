# CHECKPOINT — W44 N5.04 / F74 INATIVA E CERTIFICADA — 2026-08-17

## Status

A W44 **não está fechada/promovida ainda**. O ponto salvo é deliberadamente anterior à promoção: `N5.04 / F74 — Somar Frações` está materializada, registrada no Composer e **inativa**, com portão técnico completo em verde.

Este checkpoint existe para permitir retomada segura em nova conversa sem repetir regression-first/materialização e sem promover antes da hora.

## Âncora do repositório

- Repo: `dyegorodrigues/SAGA`
- PR: `#35` — `open + draft + unmerged`
- Branch: `codex/fechamento-curricular`
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`
- Última onda fechada: W43 `N4.12/F71`
- Matrix de produção vigente: `68 Composer / 15 legado / 7 fallback / 83 servidas / 11 divergências`

## Regression-first W44

SHA: `34b6b3a5ed3fde597564685e7b2a820c2beca0f7`

- CI `32050560773`: `completed/failure`;
- transversal `32050560782`: `completed/success`;
- falha nominal: ausência real de `N5.04/F74`;
- 3.279/3.280 testes verdes;
- nenhuma segunda falha autorizou mudança de escopo.

## Materialização

Primeira materialização: `4f1f8c702e431cb9ee7b306e39eccd7c4e7e7314`.

Ela expôs uma incompatibilidade TypeScript localizada na mutabilidade do array de passos da resolução declarativa. Esse SHA não é recibo final.

Reparo mínimo:

- SHA `a41e6e9e6317efcec230b879722a8ae3fcafd8ae`
- commit `fix: alinhar mutabilidade da resolucao F74`

## Recibo inativo vinculante

No SHA `a41e6e9e6317efcec230b879722a8ae3fcafd8ae`:

- CI `32052726802`: **completed/success**;
- Certificação transversal `32052726430`: **completed/success**;
- Gates do SAGA: success;
- catálogo: success;
- auditoria de fichas: success;
- conformidade: success;
- grafo: success;
- TypeScript: success;
- suíte: **235 arquivos / 3.287 testes, todos verdes**;
- build: success;
- guarda textual: success;
- higiene do diff: success;
- guarda de binários: success.

A auditoria do mesmo SHA observa:

- Composer registrado: 69/90;
- Composer ativo: 68/90;
- registrado e inativo: `N5.04`;
- fallback real ainda: `AL.08, GM.11, N5.04, N5.05, N6.02, N6.04, PE.04`;
- Matrix de produção: `68/15/7/83/11`.

## O que F74 materializou

Identidade: `N5.04 / F74 — Somar Frações`  
Prereq: `N5.03`  
Primitiva: `SingaporeBars`  
Kind: `soma-fracoes-f74`

Escada integral:

1. soma com barras;
2. soma simbólica;
3. subtração;
4. fração imprópria / mais de um inteiro;
5. simplificação como mesma quantidade com outro nome.

Contrato causal:

- somente denominadores iguais;
- denominador permanece como tamanho fixo da parte;
- soma/subtração alteram quantidade de partes, não a partição;
- fração imprópria não é tratada como inválida;
- simplificação reutiliza o significado físico de equivalência da F73;
- resposta não é pré-renderizada antes da decisão.

Diagnósticos F74:

- `soma-denominador`;
- `nao-simplifica`;
- `impropria-invalida`.

Domínio:

- `3/3` em `2` sessões;
- um acerto imediatamente precedido por `SOMA_DENOMINADOR` permanece correto para a missão, mas é desqualificado do crédito de mastery via `masteryDisqualifier`;
- não existe segunda autoridade de mastery.

A materialização cobre ficha Jornada N5.04, contrato/builder, palco `SomaFracoesStage`, renderer/wiring, runtime map SingaporeBars, política autoral de resposta, misconceptions/Radar e testes nominal/físico.

## O que NÃO foi feito

- `N5.04` **não** foi adicionada ao canário ativo;
- `W44-N5.04` **não** foi adicionada ao ledger `COVERAGE_MIGRATIONS`;
- o contrato/baseline da Matrix **não** foi promovido para 69/15/6/84/11;
- W44 **não** deve ser chamada de fechada;
- W45 **não** foi escolhida.

Isso é intencional: promoção só pode ocorrer depois do portão inativo duplamente verde, e esse portão agora está cumprido.

## Próxima ação exata

1. reancorar PR/HEAD/main/reviews/threads;
2. confirmar que a materialização F74 continua presente e inativa;
3. não repetir regression-first nem materialização;
4. promover **atomicamente no mesmo SHA**:
   - `src/curriculum/motores/composerCanaryIds.ts` → adicionar `N5.04`, citando recibo inativo `a41e6e9e…`, CI `32052726802`, transversal `32052726430`;
   - `AI_Studio_Lab/tools/coverage_matrix_core.ts` → acrescentar `W44-N5.04` ao array declarativo, sem alterar história anterior;
   - `src/curriculum/coverageMatrix.test.ts` → acrescentar W44 à sequência e atualizar última migração/baseline;
5. observar Matrix real. Se somente a ativação mudar, o delta esperado é `+1 Composer / -1 fallback / +1 servida`, resultando em `69/15/6/84/11`; a observação executável vence a expectativa;
6. exigir CI + transversal do SHA final da promoção, ambos `completed/success`;
7. então criar checkpoint **W44 FECHADA**, atualizar `PROMPT_DE_RETOMADA.md` e PR body;
8. recalcular DAG/Matrix para selecionar W45. `N5.05` depende de `N5.04 + N6.04`, portanto não reutilizar fila antiga sem recálculo.

## Governança que continua valendo

- `main` intocada;
- PR #35 draft/unmerged;
- sem auto-merge/ready;
- sem Creature Engine/Tamagotchi;
- cânone compartilhado aditivo, sem compressão de rationale/aliases/notas;
- sem relaxar testes/sondas/Matrix;
- sem misturar recibos entre SHAs;
- issues #47 e #48 permanecem pós-90/90 e não interrompem a fábrica curricular.

**Conclusão:** o código F74 está completo e salvo no estágio inativo, e o portão técnico para promoção está cumprido. O único passo curricular pendente da W44 é a promoção atômica + recertificação final.