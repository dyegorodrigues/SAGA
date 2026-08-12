# Checkpoint — Reconciliação pós-W5 / pré-W6

**Data:** 11/08/2026 · **Status:** FECHAMENTO EM VALIDAÇÃO FINAL · **Escopo:** saneamento antes de selecionar W6

A W5 (`GM.05 / F61 / Regua`) permanece fechada. A W6 permanece **NÃO SELECIONADA**. Este checkpoint reconcilia a auditoria externa de 11/08 com o código, o CI, a documentação e a Foundry reais.

> GitHub remoto + código + gates executáveis vencem este texto se houver deriva. A **receita final de fechamento** deve ser registrada no corpo do PR #29 contra o HEAD corrente, para evitar um commit documental auto-referente que dispare outro portão longo.

## 1. Reancoragem inicial

Antes de qualquer correção foi verificado:

- repo: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- HEAD inicial auditado: `2e48bb985e2e896e4d61834075fcb7de16696ecf`;
- main protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: **open + draft + unmerged**;
- review threads abertas: **0**;
- CI inicial: run `31444601708`, verde;
- Coverage Matrix: **30 Composer / 22 legado / 38 fallback / 52 servidas / 17 divergências / 12 swaps / 44 estreias**;
- única primitive bloqueadora: `Moedas`.

## 2. Auditoria externa: vereditos reconciliados

### R01 · Foundry / originais — CONFIRMADO, mas não há perda intelectual conhecida

A auditoria provou divergência de hashes em `part05` e `part08` do transporte Base64 e desmentiu a antiga declaração `originals_archive_verified: true`.

Correção decisiva: os **10/10 arquivos-fonte** listados pela Foundry foram localizados individualmente na File Library de origem, inclusive `thinking-extensions (1).ts` e `thinking-integration.test (1).ts`. Portanto o incidente restante é **proveniência/transporte byte-a-byte**, não desaparecimento conhecido do conteúdo intelectual.

Na `SAGA-Research-Foundry` foram instalados:

- `CURRENT_STATE.yaml` com `originals_archive_verified: false`;
- `06_research/external_reviews/RECOVERY_STATUS_2026-08-11.md`;
- `ORIGINALS_MANIFEST.sha256.json` dedicado aos originais;
- `tools/verify_originals_integrity.py`;
- workflow automático `.github/workflows/integrity.yml`;
- Issue #1 para a recuperação exata do archive transport.

Os hashes esperados de `part05`/`part08` **não foram alterados para fazer o teste passar**. Thinking continua DEFERRED e os `.ts` recuperados continuam protótipos, não patches de produção.

### R02 · Sonda transversal — CONFIRMADO E MECANIZADO

A auditoria encontrou uma inconsistência real: `scripts/sonda-layout.mjs` chama a varredura transversal de **O PORTÃO**, enquanto runbooks e CI só exigiam sondas dirigidas.

O primeiro mecanismo automático foi deliberadamente executado inteiro num job de 30 min. Resultado no run `31494057998`, HEAD `153634079b7af77415ebb9cfea77e0c144cb2025`:

- **390 px × 8 sementes terminou completamente limpa**;
- o job entrou em 320 px, continuou imprimindo `ok`, e foi cancelado exatamente pelo timeout de 30 min;
- não houve achado de layout antes do cancelamento.

Logo, o vermelho era **timeout do mecanismo**, não defeito de produto.

Contrato final, sem redução de cobertura:

- job A: `390 px × 8 sementes`;
- job B: `320 + 900 px × 1 semente`;
- os dois rodam em paralelo e juntos equivalem exatamente ao contrato de `npm run sonda`;
- sondas dirigidas Sensei, F19 e F61 continuam permanentes.

### R03 · Mascotes / JPG — CONFIRMADO E CORRIGIDO NO CAMINHO EXECUTÁVEL

Foi confirmado que o contrato exigia PNG com alfa real, mas o registro importava JPGs `_nobg_`, impossível fisicamente ter canal alfa.

Correções:

- `mascotAssets.ts` agora registra somente `src/assets/mascotes/*.png`;
- enquanto PNG definitivo não existir, o renderer usa o fallback SVG já governado;
- os 10 JPGs históricos (~5,4 MB) deixaram de aparecer no build por esse caminho;
- `TransparentMascotImage.tsx`, código morto de chroma-key/canvas em runtime que também violava a regra, foi removido.

Residual P2: `MascotRenderer.tsx` ainda contém uma condição morta `pngUrl.endsWith(".jpg")` para `mixBlendMode`; ela é hoje inalcançável porque `getMascotPng()` só pode devolver `.png`. Não reescrever um renderer grande apenas para limpeza cosmética durante esta reconciliação; remover numa manutenção de baixo risco futura.

### R04 · §6.36 / progressão visual — CONFIRMADO E TRANSFORMADO EM REGRESSÃO

A detecção já existia na conformidade e na Coverage Matrix, mas não bloqueava dívida nova.

Foi adicionado `src/curriculum/visualOnboardingGate.test.ts` com baseline explícito da dívida Padrão Ouro:

`N1.07, N1.09, N3.10, N4.03, N4.06`.

O gate:

- falha se surgir nova dívida Gold;
- falha se uma dívida resolvida continuar anistiada;
- não mascara legado/fallback.

Prova executada: a suíte subiu de **171 arquivos / 2.514 testes** para **172 arquivos / 2.516 testes**, com o novo arquivo realmente descoberto e verde.

### R05 · N4.09 / texto antigo — CONFIRMADO E DOCUMENTADO

O runtime de N4.09 já contém nível 1 e tutorial que alfabetizam o modelo de área. A pendência específica antiga foi marcada como resolvida em `ERRATA_PADRAO_OURO_N4_09_2026-08-11.md`; a regra geral de §6.36 continua vigente.

### R06 · Fluxo Git histórico — CONFIRMADO E MARCADO COMO SUPERADO

`FLUXO_GIT_SEM_BUG.md` foi preservado como proveniência, mas agora avisa explicitamente que o ritual `merge → apagar branch → branch nova` é **superado para o PR #29**. `RETOMADA.md` é autoridade operacional.

### R07 · Bundle — CONFIRMADO / DÍVIDA CONTROLADA

Após remover o caminho JPG, o build deixou de emitir aqueles ~5,4 MB. O chunk JS permanece em aproximadamente **2,349 MB minificado / 664,6 kB gzip** e o Vite continua alertando. Não otimizar às cegas: analisar bundle/lazy-loading em frente própria.

### R08 · CI do mesmo HEAD — NOVO ACHADO, CORRIGIDO

`gates` usava o merge-ref sintético enquanto as outras jobs usavam o PR head. Agora o checkout do PR head é explícito também nos gates, garantindo que typecheck/test/build/guardas/sondas provem o mesmo commit.

### R09 · downstream / alavancagem — ACEITO COMO MÉTRICA, NÃO COMO DITADOR

A queda histórica de downstream é um sinal útil e deve aparecer explicitamente na seleção W6. Porém o método vigente já combina **profundidade/descendentes + legado/fallback + divergência + blocker + onboarding + motor/a11y + risco pedagógico + reuso de primitive + custo/evidência**.

Não declarar W5 errada retroativamente e não substituir o método por “maior downstream vence”.

### R10 · Foundry / plano invisível — CONFIRMADO E PRESERVADO SEM ATIVAR

`09_integration/DEFERRED_IMPLEMENTATION_PLAN.md` torna o plano de seis mudanças legível/versionado. O documento é explicitamente **DEFERRED / não autorizativo**. Thinking não entra no runtime durante a fábrica curricular.

### R11 · Evidence Ledger — CONFIRMADO E MELHORADO

O ledger recebeu classificação de claims, referências, implicações e limites (“o que não prova”). Pendências bibliográficas restantes ficam explícitas em vez de números sem fonte.

### R12 · IDs e inventários da Foundry — NOVOS CONTRATOS

Foram adicionados:

- `03_architecture/IDENTIFIER_NAMESPACES.md` para distinguir `FD-Dxxx`, IDs históricos externos e IDs SAGA;
- `03_architecture/PRIMITIVE_INVENTORY_CONTRACT.md` para impedir comparação indevida entre “26 nomes declarados”, “21 executáveis”, “30 competências Composer” e inventários históricos.

## 3. Incidente encontrado durante a própria reconciliação: F61

Ao fortalecer o CI, `sonda:regua` reproduziu duas vezes `L5 / 390px / scrollWidth=397`.

A investigação mostrou uma corrida de estabilização na transição `estimativa → medição`: o palco troca dimensão e `PalcoEscalado` reage via `ResizeObserver`, enquanto a sonda media cedo demais.

Correção em `scripts/sonda-regua.mjs`:

- esperar **estabilidade geométrica observável** após preparar cada nível e após a transição L5;
- manter a asserção de overflow rígida;
- não aumentar tolerância;
- não alterar a régua/pedagogia.

No run `31494057998`, Sensei + F19 + **F61 passaram verdes** após essa correção.

## 4. Ruídos classificados, não silenciados

- `HTMLCanvasElement.getContext()` no jsdom aparece associado sobretudo a axe/WCAG e os testes passam; é ruído/harness de acessibilidade, não defeito funcional conhecido. Não instalar `canvas` nem mockar cegamente.
- stderr de fallback de micro/Firestore em testes negativos é exercitado deliberadamente e os testes passam.
- GitHub Actions avisa que actions v4 estão sendo forçadas a runtime Node 24; manutenção preventiva, não falha atual.

## 5. Dívida controlada que NÃO bloqueia a reconciliação

Esses itens continuam reais e devem permanecer visíveis, mas não são falhas de saneamento desta etapa:

- 22 legados;
- 38 fallbacks;
- 17 divergências;
- `Moedas` como última primitive bloqueadora;
- cinco dívidas Gold de onboarding explicitamente baselineadas;
- chunk JS ~2,349 MB / 664,6 kB gzip;
- recuperação byte-a-byte da Foundry no Issue #1;
- condição morta de JPG em `MascotRenderer.tsx`;
- manutenção futura das actions/harness jsdom.

## 6. Regra de parada e fechamento

**W6 continua NÃO SELECIONADA.** Não tocar main, Creature Engine ou Thinking Engine.

Este checkpoint passa de `FECHAMENTO EM VALIDAÇÃO FINAL` para **FECHADO operacionalmente** quando o corpo do PR #29 registrar uma receita do HEAD final mostrando:

1. PR open + draft + unmerged;
2. todos os jobs do CI concluídos verdes no mesmo HEAD;
3. Gates com 172 arquivos / 2.516 testes ou contagem superior coerente;
4. Sensei/F19/F61 verdes;
5. sonda transversal `390px × 8 sementes` verde;
6. sonda transversal `320/900px × 1 semente` verde;
7. W6 ainda não selecionada.

Depois disso, a próxima ação permitida é **selecionar W6 pela Matrix+DAG reconciliada**. Selecionar não significa implementar automaticamente: primeiro registrar a evidência causal da escolha.
