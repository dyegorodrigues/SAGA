# CHECKPOINT — Fábrica Curricular W50 · N5.05/F86 FECHADA · 2026-08-18

## Estado vinculante

W50 = `N5.05 / F86 — Multiplicar Frações`.

A onda encerra a fila fallback-first da fábrica curricular principal. A autoridade executável, após a promoção atômica, deve observar:

- 90 competências no grafo;
- 94 fichas autorais;
- 75 Composer;
- 15 legado;
- 0 fallback;
- 90 servidas;
- 11 divergências ficha↔screen;
- 12 mode swaps;
- 44 tool introductions;
- `Moedas` permanece dívida real conhecida.

`fallback=0` significa **fábrica curricular principal concluída**. Não significa produto Child-Ready.

## Cadeia W50

### Âncora documental anterior

- W49 documental: `5d46a36bfe494ec6af3ccecfda4b4c0658b5e8bf`;
- CI `32187284410` — success;
- Certificação transversal `32187284484` — success 9/9.

### Regression-first

- SHA: `609217223cd3ab29e264762d32ec8c5ef01d78f1`;
- vermelho nominal capturado antes da execução ser supersedida: N5.05/F86 ausente de `JOURNEY_FICHAS`;
- catálogo, fichas, conformidade, DAG e TypeScript passaram;
- 243 arquivos / 3.407 testes preexistentes verdes;
- Matrix permaneceu `74/15/1/89/11`;
- transversal `32188240862` — success.

### Materialização inativa

- núcleo: `3e2b9e1ac6bfd79ea043c847f8d7b33ec9d086bc`;
- primeiro candidato completo: `bc865d5c037242bedd433b90a298e944c260aa54`.

F86 foi materializada reutilizando `ArrayGrid#área`:

1. fração × inteiro como “fração de uma quantidade”;
2. fração × inteiro no modelo de área;
3. fração × fração como interseção real de duas partições;
4. produto simbólico com retirada do preenchimento-resposta;
5. divisão por fração como “quantas partes deste tamanho cabem?”.

Radar canônico:

- `multiplicar-aumenta`;
- `soma-em-vez-de-multiplicar`;
- `dividir-diminui`.

P13: `FRACAO_VEZES_FRACAO_F86`, emitida apenas em acerto real do L3; resposta errada não emite a evidência.

### Reparos reais de acessibilidade — sem enfraquecer gate

O axe gate encontrou duas violações reais `aria-prohibited-attr` em agrupadores rotulados. Em vez de remover o teste:

- `50d74e93c96dc88628f208be787e3fc853ea1136` tornou a malha `ArrayGrid` semanticamente nomeável com `role="img"`;
- `2d250b39ea8d32d4a9aa92b2797a44d5da49efa4` rotulou o grupo de alternativas do `ArrayGrid`;
- `340f219a8eae3b3a71215d7a23e8e81a032afe1b` completou os grupos semânticos da F86.

### Inativo final certificado

- SHA: `340f219a8eae3b3a71215d7a23e8e81a032afe1b`;
- CI `32191494936` — completed/success;
- Certificação transversal `32191494957` — completed/success 9/9;
- Gates, testes com axe intacto, build, Sensei, higiene e binários verdes.

### Promoção atômica

A promoção final foi aplicada somente após o portão inativo verde, contendo no mesmo snapshot:

1. canário `N5.05`;
2. ledger nominal `W50-N5.05`, delta `{ composer:+1, fallback:-1, served:+1 }`;
3. contrato da Coverage Matrix para `75/15/0/90/11`.

Nenhum baseline foi alterado para fabricar verde. A promoção deve ser considerada válida somente com CI + Certificação transversal do próprio HEAD técnico final.

## O que W50 NÃO resolve

Permanecem explicitamente fora do significado de `fallback=0`:

- 15 competências ainda servidas por legado, enquanto observadas;
- 11 divergências ficha↔screen, enquanto observadas;
- primitiva `Moedas` / dívida correlata;
- hardening e performance, inclusive bundle warning quando aplicável;
- Integração Sistêmica e Child-Ready — Issue #47;
- lacunas microcurriculares/microprogressão — Issue #48;
- Observatório da `SAGA-Research-Foundry`, P&D com `implementation_authorized: false`.

Não apagar essas dívidas no fechamento.

## Regra para a próxima conversa

A próxima conversa deve reancorar o remoto e tratar a Fábrica Curricular como concluída somente se o HEAD documental final estiver com CI + transversal verdes e a Matrix continuar em `90/90 servidas` com `fallback=0`.

Depois disso, a próxima fase recomendada é **Integração Sistêmica e Child-Ready**, mas ela não deve ser iniciada automaticamente por este checkpoint.
