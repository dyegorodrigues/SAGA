# ESTADO DO FECHAMENTO — Fábrica Curricular SAGA

Atualizado em 2026-08-18 após a correção da promoção W50.

> Autoridade: GitHub remoto + DAG + canário + Coverage Matrix + gates do SHA exato. Este documento registra estado; não substitui as autoridades executáveis.

## 1. Governança vigente

- Repo: `dyegorodrigues/SAGA`;
- PR: `#35` — deve permanecer **open + draft + unmerged**;
- Branch: `codex/fechamento-curricular`;
- `main`: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`, intocada pela fábrica;
- não marcar ready, não habilitar auto-merge e não mergear;
- não tocar Creature Engine/Tamagotchi;
- não enfraquecer P13, Matrix, Radar, DAG, contratos ou sondas;
- não misturar recibos entre SHAs.

## 2. Estado técnico da fábrica

Ondas **W1–W50 tecnicamente fechadas**.

Última onda: **W50 · N5.05/F86 — Multiplicar Frações**.

SHA técnico final W50:

`efd270b732752ebe0d38a47efff47d958e352802`

Recibos do próprio SHA:

- CI `32196855192` — **completed/success**;
- Certificação transversal `32196855356` — **completed/success, 9/9**.

A promoção W50 é atômica no mesmo SHA:

1. canário `N5.05`;
2. ledger `W50-N5.05`, delta `{ composer:+1, fallback:-1, served:+1 }`;
3. contrato da Coverage Matrix reconciliado com a observação real.

## 3. Coverage Matrix observada

No SHA técnico final:

- **90 competências**;
- **94 fichas autorais**;
- **75 Composer**;
- **15 legado**;
- **0 fallback**;
- **90 servidas**;
- **11 divergências ficha↔screen**;
- `modeSwaps=12`;
- `toolIntroductions=44`;
- primitiva ausente: `Moedas`, ainda bloqueando GM.03.

Gates técnicos: catálogo, fichas, conformidade, DAG, TypeScript, **245 arquivos / 3.429 testes**, build e guarda textual verdes. Sonda real Sensei, higiene e binários verdes. O build continua emitindo warning de bundle, preservado como dívida de hardening/performance.

## 4. Cadeia real W50

- regression-first: `609217223cd3ab29e264762d32ec8c5ef01d78f1`;
- materialização inativa: `3e2b9e1ac6bfd79ea043c847f8d7b33ec9d086bc` → `bc865d5c037242bedd433b90a298e944c260aa54`;
- reparos ARIA: `50d74e93c96dc88628f208be787e3fc853ea1136` e `2d250b39ea8d32d4a9aa92b2797a44d5da49efa4`;
- inativo final: `340f219a8eae3b3a71215d7a23e8e81a032afe1b`;
- CI inativo `32191494936` — success;
- transversal inativa `32191494957` — success 9/9;
- promoção técnica: `efd270b732752ebe0d38a47efff47d958e352802`;
- CI técnico `32196855192` — success;
- transversal técnica `32196855356` — success 9/9.

Regression-first, materialização e reparos ARIA não foram refeitos durante a correção.

## 5. Irregularidade documental reconciliada

Os commits `f208a1750d9084aeabf7ac3c1efdff63f5d5ebe5` e `a6b19c05ce20bf3aaf0cac53caf3ec9d2122c8e2` afirmaram prematuramente W50/90-de-90 antes do commit técnico de promoção.

A auditoria foi registrada no PR #35 e o fechamento foi refeito na ordem correta: portão inativo → promoção técnica atômica → CI/transversal técnicos → reconciliação documental. O histórico permanece explícito; não houve tentativa de ocultar a irregularidade.

## 6. Estado formal/documental

A fábrica já atingiu tecnicamente `fallback=0` e `90/90 servidas`.

O commit documental que contém este Estado reconciliado precisa obter **CI + Certificação transversal próprios**. Somente após ambos verdes o fechamento pode ser declarado formalmente concluído. Os recibos técnicos `32196855192` / `32196855356` não certificam esse HEAD documental.

## 7. Dívidas preservadas

Mesmo com `fallback=0`:

- 15 competências legado;
- 11 divergências ficha↔screen;
- `Moedas` / GM.03;
- hardening/performance e warning de bundle;
- Issue #47 — Integração Sistêmica e Child-Ready;
- Issue #48 — lacunas microcurriculares/microprogressão;
- Observatório na `SAGA-Research-Foundry`, P&D, `implementation_authorized: false`;
- qualquer dívida ainda observada por gates/runtime.

`fallback=0` **não significa Child-Ready**.

## 8. Parada

Nenhuma frente pós-90/90 foi iniciada. Depois da certificação documental final, atualizar o corpo do PR com os recibos documentais, manter PR draft/open/unmerged, manter `main` intocada e **parar**.