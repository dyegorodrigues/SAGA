# CHECKPOINT — Fábrica Curricular W30–W34 fechada

Data de fechamento: 15/08/2026 (America/Sao_Paulo; recibos GitHub em UTC de 16/08).  
Repo: `dyegorodrigues/SAGA` · PR `#35` · branch viva `codex/fechamento-curricular`.

Este checkpoint encerra o bloco **W30–W34**. A autoridade executável continua sendo o estado remoto de Matrix, canário, DAG e runtime; este arquivo registra os recibos humanos do bloco.

---

## 1. Estado ao final do bloco

Coverage Matrix observada no Gates final da W34:

- **59 Composer**
- **15 legado**
- **16 fallback**
- **74 servidas**
- **11 divergências**
- 90 competências / 94 fichas autorais
- `modeSwaps=12`
- `toolIntroductions=44`
- primitiva ainda ausente: `Moedas`
- **59 canários ativos**

Gates final W34 `95094560886`: **success**.

Suíte no mesmo Gates:

- **221 arquivos de teste passed**
- **3.123 testes passed**
- TypeScript limpo
- auditoria de catálogo, fichas, conformidade e grafo verdes
- build verde
- guarda textual e guarda de binários verdes

---

## 2. Ondas do bloco

| Onda | Competência / ficha | Estado após onda | Recibo técnico final |
|---|---|---|---|
| W30 | `N2.06 / F38 — Pares e Ímpares` | `55/15/20/70/11` | `05b7787e7239db4c687b5fa7cc47ee0b4f256447`; CI `31883452067` + transversal `31883452082`, success |
| W31 | `PE.03 / F83 — Média e Chance` | `56/15/19/71/11` | `7f6208ce50d902cae8ab373e664c8d6fc06c5bdd`; CI `31908549456` + transversal `31908549471`, success |
| W32 | `GM.09 / F82 — Conversões e Problemas de Medida` | `57/15/18/72/11` | `40ef8eb13cd93d1a0b2e60375964853e62118e24`; CI `31913688446` + transversal `31913688438`, success |
| W33 | `GE.07 / F79 — Polígonos` | `58/15/17/73/11` | `5fa072c84e69687491a21d0e6f975d7b9da3fd44`; CI `31916781563` + transversal `31916781644`, success |
| W34 | `GE.08 / F80 — O Plano Cartesiano` | `59/15/16/74/11` | `da00831f80f38550835501a45e0374ee526d316f`; CI `31918571578` + transversal `31918570753`, success |

---

## 3. W34 — cronologia executável

### 3.1 Regression-first

SHA `2da66a0a2d7552610a9129f01d585082f1a7c060` — `test: abrir W34 GE.08 F80 regression-first`.

- CI `31917269091`: **completed/failure**;
- transversal `31917269087`: **completed/success**;
- Gates `95091180378`: failure exatamente nos dois testes desenhados;
- causa: GE.08 ainda não registrada e ativação recusada antes de `COMPOSER_FICHAS`.

A falha foi regression-first válida, não defeito de implementação.

### 3.2 Materialização inativa

SHA `0fb800ac64ca3598d39e6513ae3f213e7938c03d` — `feat: materializar W34 GE.08 F80 inativa`.

Entraram ficha/contrato/palco/wiring e runtime map, mantendo GE.08 fora do canário.

- CI `31917798514`: **completed/success**, attempt 1;
- transversal `31917798507`: **completed/success**, attempt 1;
- transversal: **9/9 jobs success**;
- Gates `95092529668`: success.

O runtime map já estava correto no estágio inativo: `ShapeCanvas#grade → PlanoCartesianoStage / plano-cartesiano-f80`.

### 3.3 Promoção atômica

SHA `75211643cba6388d67aa5bb09e022f09710ae118` — `feat: promover W34 GE.08 F80 no canario`.

Filho direto do SHA inativo certificado. Compare provou somente três arquivos governantes:

1. GE.08 no canário;
2. `W34-GE.08` no ledger;
3. contrato Matrix `59/15/16/74/11`.

O catálogo observou 59 Composer ativos / 16 fallbacks, mas Gates `95094103205` falhou por uma lacuna de **observabilidade da Matrix**: `plano-cartesiano-f80` era traduzido apenas para `ShapeCanvas`, sem qualificar `#grade`. O job observou uma falsa 12ª divergência.

Conclusões globais desse SHA:

- CI `31918416662`: **completed/cancelled**;
- transversal `31918416664`: **completed/success**.

Preservar a distinção: o Gates havia falhado; o workflow CI global terminou `cancelled` após o push corretivo.

### 3.4 Correção de observabilidade e recibo final

SHA `da00831f80f38550835501a45e0374ee526d316f` — `fix: qualificar ShapeCanvas grade da W34 na Matrix`.

Delta: **1 linha / 1 arquivo** em `AI_Studio_Lab/tools/coverage_matrix_core.ts`:

- `plano-cartesiano-f80 → ShapeCanvas#grade`.

Não houve alteração de canário, ledger, baseline, ficha ou runtime físico.

Gates `95094560886`: **success** e observou:

- Matrix **59/15/16/74/11**;
- GE.08 `padrao-ouro ShapeCanvas#grade`;
- 221 arquivos / 3.123 testes;
- build e guards verdes.

Conclusões globais do SHA final:

- CI `31918571578`: **completed/success**;
- Certificação transversal `31918570753`: **completed/success**;
- transversal: 8 sementes em 390px + responsiva 320/900px, todas verdes.

**W34 fechada. Bloco W30–W34 fechado.**

---

## 4. Contrato canônico F80 preservado

- prereqs: `GE.05 + N1.12`;
- primitiva: `ShapeCanvas#grade`;
- realização: `PlanoCartesianoStage` / `plano-cartesiano-f80`;
- progressão: ler ponto → colocar ponto → caminho → completar/desenhar figura por coordenadas → padrão em pontos alinhados;
- regra visual: primeiro x, depois y;
- tags: `INVERTE_XY`, `IGNORA_ORIGEM`, `CONTA_MARCAS`;
- domínio: 3/3 em 2 sessões;
- exposição motora alta: snap generoso e alternativa por toque;
- erro motor não gera misconception conceitual;
- L4 não vaza o quarto vértice-alvo.

---

## 5. Infraestrutura preservada no bloco

A tipografia local Fredoka/Nunito está resolvida desde a W33:

- quatro WOFF2 variáveis em `public/fonts/`;
- magic bytes `wOF2` validados;
- exceção binária apenas para `public/fonts/*.woff2`;
- Google Fonts removido de `src/index.css`;
- famílias Fredoka/Nunito inalteradas.

Não reabrir essa frente.

O padrão do runtime map também ficou consolidado: **novo kind/builder/renderer/palco composto entra no mapa ainda no estágio inativo**, antes de certificar a promoção.

---

## 6. Estado pós-bloco e próxima onda

Restam **16 fallbacks**:

`AL.07, AL.08, GE.09, GE.10, GM.06, GM.10, GM.11, N2.07, N4.11, N4.12, N5.04, N5.05, N6.02, N6.04, N7.02, PE.04`.

Bloqueados imediatamente:

- `AL.08` por `AL.07 + N7.02`;
- `N5.05` por `N5.04 + N6.04`.

Recalculo pela Matrix/DAG pós-W34 seleciona:

**W35 = `GM.06 / F62 — Horas e Minutos`**

- prereqs: `GM.04 + AL.03`;
- primitivas: `Relogio + NumberLine`;
- `causalWave=7`.

A W35 deve começar por leitura integral da F62 + **regression-first nominal**. Nenhuma materialização W35 faz parte deste checkpoint.

---

## 7. Dívida de limpeza de branches

Rascunhos Codex remotos identificados, todos **descartáveis e nunca mergeáveis**:

- `codex/w24-dominio-inteiros`
- `codex/w31-promotion-staging`
- `codex/w33-promotion-staging`
- `codex/w33-docs-staging`
- `codex/w33-promotion-canonical-staging`
- `codex/w34-inactive-staging`
- `codex/w34-promotion-staging`

O conector disponível neste fechamento não oferece remoção de branch/ref. Apagar essas sete quando houver mecanismo apropriado; até lá, não tratá-las como linha viva.

---

## 8. Restrições que permanecem

- `main` continua protegida e não deve ser tocada/mergeada;
- PR #35 continua draft + unmerged;
- não habilitar auto-merge;
- não tocar Creature Engine/Tamagotchi;
- não relaxar Matrix, testes, auditorias ou sondas;
- não inventar recibos;
- não ampliar exceção de binários;
- promoção futura continua exigindo portão inativo exato + promoção atômica + certificação final.
