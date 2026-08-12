# Checkpoint — seleção W8 · N3.01 / F13

Data: 2026-08-12
Branch: `codex/fechamento-curricular`

## Estado de entrada

- W7 `N2.02 / F36` fechada no HEAD `88fbeb40c2f26733a5cab3a4b08ace15646389e1`.
- CI #1129 / run `31555281941`: 6/6 verde, incluindo sonda transversal 390px × 8 sementes.
- Coverage Matrix pós-W7: 32 Composer / 20 legado / 38 fallback / 52 servidas / 16 divergências.
- `N2.02` retirado da fila de legados.

## Recalculo causal

Entre os legados remanescentes, `N3.01` é o maior impacto transitivo elegível: 44 descendentes. A ordem explícita do Bloco 1 também fixa W8 em `N3.01`, e os pré-requisitos diretos `N1.04` e `N1.10` já estão em Padrão Ouro.

## Ficha canônica

F13 — Juntar Dois Grupos.

Requisitos que não podem ser reduzidos ao renderer legado:

1. juntar dois grupos é uma ação, não só uma imagem;
2. cada parcela permanece dentro de seu contêiner até a ação de juntar;
3. objetos e numeral correspondente ocupam a mesma coluna perceptual;
4. L1–L3: objetos + numerais com redução progressiva de andaime;
5. L4: somente numerais em contêineres, sem objetos;
6. L5: símbolo puro; `rt_alvo=5s` é telemetria de fluência, nunca critério de domínio na Jornada;
7. domínio: `3/3 × 2 sessões` e pelo menos um acerto L4 sem objetos;
8. diagnóstico canônico: repetiu parcela, off-by-one, subtraiu e conta-tudo;
9. estreia visual de `VisualAddition` exige onboarding real antes da cobrança.

## Estado real de VisualAddition

`VisualAddition.tsx` existe e `FichaRenderer` renderiza `visual-addition`, mas o runtime map ainda registra `builderKinds: []`. O legado `gVis_VisualAddition` sorteia parcelas e oferece alternativas; não materializa a ação autoral da F13 nem a transição objetos→numerais→símbolo.

## Decisão arquitetural W8

- criar builder **especializado** em `N3.01`;
- criar kind próprio `visual-addition-f13`;
- criar `VisualAdditionStage` autoral sobre a superfície `VisualAddition`;
- preservar `visual-addition` legado para outros usos;
- registrar N3.01 de forma INATIVA primeiro;
- não adicionar `N3.01` a `DEFAULT_COMPOSER_CANARY_IDS` até contrato, boundary, a11y, onboarding e Chrome real ficarem verdes;
- declarar `VisualAddition` como executável com owner especializado `N3.01` no runtime map somente quando a cadeia real existir.

## Condições de invalidação

Reabrir a arquitetura antes de promover se a solução exigir:

- dispatch genérico que altere todos os consumidores de `visual-addition`;
- mudança de pré-requisitos do grafo;
- alteração global do learner state/mastery;
- remoção da separação entre builder especializado e renderer legado;
- afrouxamento de gate para acomodar a implementação.
