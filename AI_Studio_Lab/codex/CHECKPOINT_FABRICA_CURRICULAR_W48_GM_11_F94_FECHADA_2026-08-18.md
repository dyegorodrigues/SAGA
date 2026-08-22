# CHECKPOINT — FÁBRICA CURRICULAR W48 · GM.11/F94 FECHADA

**Data:** 18/08/2026  
**Repo:** `dyegorodrigues/SAGA`  
**PR:** #35  
**Branch:** `codex/fechamento-curricular`

## 1. Resultado

**W48 — GM.11 / F94 — Volume de Prismas está FECHADA.**

SHA técnico final:

`adbb4317238ac7224e5e25466a007fb2d5018da2`

Recibos técnicos vinculantes no mesmo SHA:

- CI `32156476415` — **completed/success**;
- Certificação transversal `32156476430` — **completed/success, 9/9**.

No CI final:

- Auditoria do catálogo: success;
- Auditoria das fichas: success;
- Conformidade: success;
- DAG/grafo: success;
- TypeScript: success;
- **242 arquivos / 3.390 testes: success**;
- build: success;
- guarda textual: success;
- Sonda real Sensei: success;
- higiene do diff: success;
- guarda de binários: success.

Este checkpoint formaliza documentalmente o fechamento já certificado tecnicamente. O commit documental que introduz este arquivo também deve obter CI + Certificação transversal próprios antes de qualquer nova onda.

## 2. Intervenção entre ondas — Observatório

Antes da abertura da W48, a existência da frente paralela de P&D foi registrada no SAGA produtivo pelo SHA:

`5defb1a812221ee38987a880778ee1fc93e58ec4`

Esse registro é exclusivamente documental. A `SAGA-Research-Foundry` permanece separada da fábrica curricular, com Observatório `PRE-CANONICAL` e `implementation_authorized: false`. Nenhuma proposta da Foundry entrou no runtime, canário, ledger curricular, Coverage Matrix ou runtime map.

## 3. Cadeia regression-first → inativo → promoção → reparo observacional

### 3.1 Regression-first

SHA:

`e27e5c0f6890817aa802870f275a87263021d8bf`

- Certificação transversal `32151661911` — **completed/success**;
- CI `32151661956` terminou posteriormente como **cancelled** por push mais novo, mas o job `Gates do SAGA` já havia concluído com o vermelho nominal exigido;
- catálogo, fichas, conformidade, DAG e TypeScript passaram antes do teste;
- **241 arquivos passaram e somente `src/curriculum/volumePrismasW48.test.ts` falhou**;
- **3.373 testes anteriores passaram; 1/3.374 falhou**;
- falha exata: `JOURNEY_FICHAS.find(item => item.id === "GM.11")` retornava `undefined` e `expect(ficha).toBeDefined()` falhava;
- Matrix permaneceu `72 Composer / 15 legado / 3 fallback / 87 servidas / 11 divergências`.

O vermelho, portanto, foi nominal e exclusivamente causado pela ausência da materialização GM.11/F94. O contrato não foi relaxado.

### 3.2 Materialização inativa

A F94 foi materializada reutilizando **ArrayGrid em modo 3D** e a alfabetização isométrica já existente na F92/GE.10, sem criar primitiva autoral paralela.

Escada conceitual:

1. contar cubos de um prisma;
2. reconhecer uma camada como área da base;
3. repetir a camada pela altura;
4. aplicar a relação volume = área da base × altura;
5. resolver dimensão faltante e prisma não retangular previsto pela ficha.

Misconceptions canônicas preservadas:

- `SOMA_DIMENSOES`;
- `CONFUNDE_COM_AREA`;
- `IGNORA_UNIDADE_CUBICA`.

Domínio e evidência:

- domínio conceitual `{ acertos: 3, de: 3, sessoes: 2 }`;
- dimensão faltante participa da evidência exigida;
- resposta errada não emite a evidência positiva;
- erro motor não vira misconception conceitual;
- RT não governa mastery conceitual;
- ajuda/resolução assistida não compra mastery independente;
- interação por toque amplo, sem depender de gesto motor fino.

Um primeiro candidato inativo revelou uma lacuna real no gate P13: a evidência `dimensao-faltante-f94` já tinha emissor no runtime, mas o registro explícito de emissores do teste central ainda não incluía F94. O reparo acrescentou a prova positiva do emissor e a prova negativa de que resposta errada não emite evidência, sem remover ou enfraquecer asserções.

SHA inativo final:

`fbc80f764248ee18af87029fa89cda5a41d7e852`

Recibos vinculantes:

- CI `32154072299` — **completed/success**;
- Certificação transversal `32154072327` — **completed/success, 9/9**.

Até esse portão, GM.11 permaneceu fora do canário, sem `W48-GM.11` no ledger e sem antecipação da Matrix.

### 3.3 Promoção atômica

SHA:

`4dd4a9a5e0ac6d26a23f50f423cb5d18abebb44c`

A promoção tocou exatamente os três governantes:

1. `src/curriculum/motores/composerCanaryIds.ts` — ativa `GM.11`;
2. `AI_Studio_Lab/tools/coverage_matrix_core.ts` — ledger `W48-GM.11` com delta `{ composer:+1, fallback:-1, served:+1 }`;
3. `src/curriculum/coverageMatrix.test.ts` — contrato `73/15/2/88/11`.

A Certificação transversal desse SHA (`32156057482`) fechou success. O gate de catálogo do CI observou, corretamente, uma incompatibilidade em vez de fabricar verde: a conformidade contava 12 divergências porque interpretava F94 como `ArrayGrid`, embora a ficha exigisse `ArrayGrid#3D`.

### 3.4 Reparo observacional final

SHA:

`adbb4317238ac7224e5e25466a007fb2d5018da2`

O reparo alterou somente `src/curriculum/conformidadeDeFichas.test.ts` para:

- reconhecer `volume-prismas-f94` como `ArrayGrid`;
- reconhecer os cinco modos F94 — `contar-cubos`, `camada-multiplicar`, `formula`, `dimensao-faltante` e `prisma-nao-retangular` — como modo `3D`.

O runtime não foi alterado nessa correção. O baseline não foi alterado para fabricar verde. A observação passou a refletir a entrega física já existente `ArrayGrid#3D`, e a Matrix voltou a observar as **11 divergências reais**.

## 4. Coverage Matrix observada pós-W48

No SHA técnico final:

- competências: **90**;
- fichas autorais: **94**;
- Composer: **73**;
- legado: **15**;
- fallback: **2**;
- servidas: **88**;
- divergências ficha↔screen: **11**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- primitiva ausente conhecida: **Moedas**.

Fallbacks reais restantes:

- `PE.04` — F95, Estatística e Chance;
- `N5.05` — F86, Multiplicar Frações.

## 5. Próxima seleção — somente candidata

Antes deste fechamento documental, o recálculo técnico deixava `PE.04/F95` causalmente à frente de `N5.05/F86`. Isso **não abre W49**.

Depois que o SHA documental deste fechamento estiver com CI + Certificação transversal verdes, a próxima conversa/etapa deve reancorar o HEAD remoto e recalcular Matrix, DAG, prerequisitos, `causalWave`, downstream e desempates. Somente o resultado desse recálculo autoriza a próxima onda.

## 6. Resíduos conscientemente preservados

O fechamento da W48 não apaga:

- **15 competências legado**;
- **11 divergências ficha↔screen**;
- `Moedas`, ainda ausente e relevante para GM.03;
- warning de tamanho do bundle / hardening de performance;
- Issue #47 — **Integração Sistêmica e Child-Ready**;
- Issue #48 — **lacunas microcurriculares/microprogressão**;
- frente Observatório na Research Foundry, ainda P&D e sem autorização de implementação.

`fallback=0`, quando alcançado, significará encerramento da fábrica curricular principal, não produto Child-Ready.

## 7. Regra de retomada

1. confirmar PR #35 open + draft + unmerged e `main` intocada;
2. confirmar o HEAD remoto e os workflows do SHA documental que introduziu este checkpoint;
3. exigir CI + transversal verdes desse próprio SHA;
4. recalcular Matrix/DAG;
5. executar somente uma onda por vez pelo protocolo regression-first → inativa → promoção atômica → fechamento;
6. existe autorização humana contínua para as ondas residuais até `fallback=0`;
7. ao chegar a `fallback=0`, fazer o fechamento formal da fábrica e **parar antes da fase pós-90/90**.
