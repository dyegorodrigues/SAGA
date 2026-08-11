# Checkpoint — Reconciliação pós-W5 / pré-W6

**Data:** 11/08/2026 · **Status:** EM ANDAMENTO · **Escopo:** saneamento antes de selecionar W6

Este checkpoint é a continuação operacional da reconciliação iniciada antes da W5. A W5 (`GM.05 / F61 / Regua`) está fechada; o estado correto agora é **pós-W5 / pré-W6**.

## 1. Fonte de verdade reancorada

Estado remoto verificado antes de qualquer correção:

- repo: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- HEAD observado: `2e48bb985e2e896e4d61834075fcb7de16696ecf`;
- main protegida de referência: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: **open + draft + unmerged**;
- branch: **937 commits à frente / 0 atrás** da referência observada;
- review threads abertas: **0**;
- CI do HEAD: run `31444601708`, conclusão **success**, 4/4 jobs verdes;
- produto: 90 competências, 30 Composer, 22 legado, 38 fallback, 52 servidas, 17 divergências, 12 swaps, 44 estreias;
- única primitiva bloqueadora vigente: `Moedas`.

GitHub remoto + código + gates executáveis vencem este documento se houver deriva posterior.

## 2. Auditoria externa recebida

Entrada de reconciliação: auditoria técnica/curricular de 11/08/2026 sobre:

- `dyegorodrigues/SAGA@2e48bb9`;
- `dyegorodrigues/SAGA-Research-Foundry@4b89c51`.

A auditoria é **fonte de achados e hipóteses**, não autoridade. Cada item abaixo foi classificado contra código, workflow, documentação ou material de proveniência disponível.

## 3. Achados reconciliados

### R01 · Foundry: arquivo de originais inconsistente — P0 / fora do runtime do produto

**Veredito:** CONFIRMADO COM CORREÇÃO DE SEVERIDADE.

- `CURRENT_STATE.yaml` da Foundry declara `originals_archive_verified: true`;
- `MIGRATION_FROM_TEMP_ARCHIVE.md` declara hashes/manifesto verificados;
- existe `tools/verify_integrity.py` + `MANIFEST.sha256.json` para tornar a afirmação verificável;
- a auditoria executou essa ferramenta e registrou divergência em `part05` e `part08`;
- a Foundry não possui workflow de CI para executar o verificador automaticamente.

**Correção importante:** os **10 arquivos-fonte** listados no README do pacote estão disponíveis individualmente na File Library de origem, inclusive `thinking-extensions (1).ts` e `thinking-integration.test (1).ts`. Logo, não há perda intelectual irreversível conhecida. O que permanece crítico é a **falsa atestação de integridade byte-a-byte do transporte ZIP/Base64**.

**Critério de fechamento:** Foundry deixa de declarar `verified=true` enquanto o arquivo não passar no verificador; recuperação fica registrada; verificação passa a ter mecanismo automático. Não promover protótipos recuperados a runtime.

### R02 · Sonda transversal: script, runbook e CI discordam — P1

**Veredito:** CONFIRMADO, mas a formulação da auditoria precisava correção.

- `scripts/sonda-layout.mjs` chama `npm run sonda` de **O PORTÃO** e define 8 sementes como portão completo;
- `RETOMADA.md` vigente lista apenas `sonda:sensei-dojo`, `sonda:reta20` e `sonda:regua` nos gates de fechamento;
- `.github/workflows/ci.yml` executa essas três sondas dirigidas, mas não `npm run sonda`.

Portanto não é simplesmente "o CI não roda o que a RETOMADA manda": há uma **inconsistência normativa tripla**. O mecanismo e o runbook precisam convergir.

**Critério de fechamento:** definir explicitamente sonda transversal PR/smoke versus sonda transversal completa; automatizar ambas no nível adequado; RETOMADA e script descrevem exatamente o mesmo contrato.

### R03 · Mascotes: contrato de arte violado pelo runtime — P1

**Veredito:** CONFIRMADO E MAIS AMPLO QUE O LAUDO.

- `src/assets/mascotes/README.md` exige PNG 512×512, alfa real e <80KB; JPG é proibido;
- `src/components/mascots/mascotAssets.ts` registra `../../assets/images/*.jpg` apesar do próprio cabeçalho dizer JPG proibido;
- o build inclui 10 JPGs totalizando aproximadamente 5,4 MB;
- arquivos com `_nobg_` são JPG e portanto não possuem canal alfa;
- `MascotRenderer.tsx` usa `mixBlendMode: "multiply"` quando a URL termina em `.jpg`, embora o cabeçalho do próprio renderer proíba JPG e mistura/remoção de fundo em runtime;
- o renderer já possui fallback SVG quando `getMascotPng()` retorna `null`.

**Correção segura:** parar de registrar JPG como arte definitiva e remover o workaround `mixBlendMode`; enquanto não houver PNG transparente válido, usar o fallback vetorial já existente.

**Critério de fechamento:** nenhum JPG é carregado pelo registro de mascotes, nenhum `mixBlendMode` tenta simular transparência e o build deixa de empacotar os 10 assets por esse caminho.

### R04 · Progressão de linguagem visual §6.36 detecta, mas não bloqueia — P1

**Veredito:** CONFIRMADO COM NUANCE.

O mecanismo não está "ausente" por completo:

- `conformidadeDeFichas.test.ts` já calcula ancestrais e imprime troca de modo/ferramenta nova sem precedente;
- `coverage_matrix.ts` já calcula `visualOnboarding` (`presente`, `nao-comprovado`, etc.);
- a Coverage Matrix já carrega `downstream` e profundidade causal.

A lacuna real é que o levantamento **não falha** quando um canário Padrão Ouro estreia linguagem visual sem onboarding comprovado. O próprio teste comenta que é apenas levantamento.

**Critério de fechamento:** criar mecanismo regression-safe: dívida atual explicitamente baselineada; nenhuma nova promoção pode aumentar a dívida; entradas resolvidas precisam sair do baseline. Depois zerar a dívida já ativa, sem esconder legado/fallback.

### R05 · N4.09: doutrina textual ficou velha — P2

**Veredito:** CONFIRMADO.

`PADRAO_OURO.md §6.36` ainda diz que F68 precisa ser revista antes de N4.09 ser ativado. O runtime atual de `N4.09.ts` já contém:

- nível 1 dedicado a alfabetizar o modelo de área;
- tutorial explícito de seis passos;
- comentário normativo referenciando §6.36.

**Critério de fechamento:** manter a lição geral de §6.36, mas marcar a pendência específica de N4.09 como resolvida e apontar a implementação vigente.

### R06 · Documento Git histórico contradiz a política atual — P1 documental

**Veredito:** CONFIRMADO.

`AI_Studio_Lab/codex/FLUXO_GIT_SEM_BUG.md` ainda manda `merge → apagar branch → fetch → branch nova`, enquanto o protocolo vigente do PR #29 usa branch cumulativa única, main protegida e PR draft sem merge.

**Critério de fechamento:** preservar o documento como histórico, mas marcá-lo de forma inequívoca como **SUPERADO para o PR #29/fábrica atual**, apontando `RETOMADA.md` como autoridade.

### R07 · Bundle pesado — P2 engenharia

**Veredito:** CONFIRMADO.

No CI reancorado:

- `index.js`: ~2,35 MB minificado / ~665 kB gzip;
- Vite emite aviso de chunk grande;
- os JPGs de mascote adicionam ~5,4 MB de assets.

Remover o caminho JPG resolve uma parcela imediata. O chunk JS permanece dívida separada e requer análise de bundle/lazy loading antes de otimização cega.

### R08 · CI "mesmo HEAD" não é uniforme — P1 governança

**Veredito:** NOVO ACHADO.

No workflow atual:

- `sonda-sensei-dojo`, `higiene-diff` e `guarda-textual` fazem checkout explícito de `${{ github.event.pull_request.head.sha }}`;
- `gates` usa `actions/checkout@v4` sem `ref`, portanto em `pull_request` o GitHub testa o merge-ref sintético por padrão.

Hoje a branch está 0 atrás da main observada, então isso não explica falha atual. Porém o protocolo afirma que código/gates/CI do **mesmo HEAD** devem concordar. Se main mover, o job principal pode testar árvore diferente do HEAD que os demais jobs testam.

**Critério de fechamento:** decidir e documentar uma política única. Para o protocolo atual de branch cumulativa/main congelada, o job `gates` deve testar explicitamente o PR head; compatibilidade com main pode continuar sendo um sinal separado, não uma ambiguidade silenciosa.

### R09 · Alavancagem downstream — melhoria de seleção, não bug comprovado — P1 método

**Veredito:** PARCIALMENTE ACEITO.

A auditoria mostrou queda de impacto downstream nas ondas já escolhidas e destacou legados F1 de alto alcance. Isso é informação estratégica relevante.

Porém a `RETOMADA.md` vigente **já exige** que a W6 seja recalculada por profundidade/descendentes junto com fallback/legado, divergência, blocker, onboarding, motor/a11y, risco pedagógico, reuso de primitive e custo. A W5 também teve objetivo de infraestrutura/risco visual (`Regua`), não apenas cobertura downstream.

**Regra reconciliada:** `downstream` ganha peso explícito e precisa aparecer na evidência de seleção, mas não vira critério soberano. Não declarar W5 erro retroativamente sem contrafactual executável.

### R10 · Foundry: plano futuro não pode ficar operacionalmente invisível — P2 / DEFER

**Veredito:** CONFIRMADO COMO GOVERNANÇA DE P&D.

A Foundry está corretamente em `pre_canonical` e a decisão vigente continua sendo **não ativar Thinking no runtime agora**. Entretanto `09_integration/FUTURE_PROOFING.md` é muito mais raso do que os materiais preservados de integração.

**Critério de fechamento:** registrar um plano legível/versionado em `09_integration/` como material **DEFERRED / não autorizativo**, com precedência clara e sem tocar no runtime do SAGA.

### R11 · Foundry: Evidence Ledger não sustenta ainda o nome "ledger" — P2

**Veredito:** CONFIRMADO.

`06_research/evidence/EVIDENCE_LEDGER.md` enumera temas, mas não traz referências bibliográficas completas nem vínculo claim→fonte. As referências já existem em materiais históricos/apêndices e devem ser promovidas para o ledger versionado quando a Foundry for saneada.

### R12 · Foundry: protótipos recuperados continuam sendo protótipos — regra de segurança

Os arquivos recuperados `thinking-extensions`, `thinking-integration.test` e `audit-thinking-reuse` **não são patches aprovados**. O teste de integração contém stubs/asserções locais que não provam integração real, e o audit de reuse contém inventário/percentuais hardcoded. Preservar como proveniência; não copiar para `src/` do produto.

## 4. Itens adicionais observados, ainda não bloqueadores

- runner do GitHub emite aviso de transição de runtime Node das actions; manutenção preventiva, não falha atual;
- a suíte imprime mensagens `HTMLCanvasElement.getContext()` não implementado no jsdom; investigar origem antes de silenciar, porque mock cego pode esconder defeito;
- existe stderr de teste de Composer com fallback de micro; classificar antes de alterar;
- comentários quantitativos antigos da sonda podem ter derivado do número atual de cenas; output executado vence comentário.

Nenhum desses itens autoriza abrir frente paralela antes dos P0/P1.

## 5. Ordem de saneamento antes da W6

1. registrar este checkpoint e congelar seleção da W6;
2. corrigir contradições documentais objetivas (`FLUXO_GIT_SEM_BUG`, N4.09, RETOMADA/gates);
3. corrigir contrato de assets dos mascotes usando fallback existente;
4. alinhar CI ao HEAD explícito e mecanizar sonda transversal em dois níveis;
5. transformar progressão visual em gate regression-safe, sem apagar dívida histórica;
6. sanear a Foundry: verdade de integridade, recuperação registrada, CI de integridade, plano de integração visível, evidence ledger;
7. reexecutar CI e gates do produto no novo HEAD;
8. só então gerar Matrix viva e selecionar W6 com ranking reconciliado.

## 6. Regra de parada

**W6 permanece NÃO SELECIONADA enquanto este checkpoint estiver `EM ANDAMENTO`.**

Não tocar main. Não tocar Creature Engine. Não implementar Thinking Engine. Não alterar learner state/mastery por causa desta reconciliação.

## 7. Critério de fechamento da reconciliação

A reconciliação pode virar `FECHADA` quando:

- nenhum P0/P1 acima estiver sem mecanismo ou dívida explicitamente baselineada;
- documentação operacional não se contradizer;
- CI do PR executar o contrato acordado no HEAD correto;
- build/test/typecheck/gates estiverem verdes;
- a Foundry deixar de afirmar integridade que sua própria ferramenta não prova;
- o novo HEAD remoto e o run de CI forem registrados em `RETOMADA.md`;
- a W6 continuar não selecionada até o fechamento formal.
