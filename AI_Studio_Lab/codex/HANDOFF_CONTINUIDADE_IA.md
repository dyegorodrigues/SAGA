# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. P21 concluída; P22.1, P22.2 e P22.3A concluídas; próximo passo P22.3B/JD4.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: `codex/integrar-bloco-f0`.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, comparação/CI; não mesclar e não ativar auto-merge.
- Não tocar em `agent/creature-engine-tamagotchi` nem `codex/criar-branch-para-creature-engine-tamagotchi`.
- Não criar branch auxiliar desta linha.
- Bancada temporária deve desaparecer no lote que publica.

## Leia nesta ordem

1. `RETOMADA.md`
2. `DECISAO_P22_DIVIDAS_CURRICULARES.md`
3. `DECISAO_P21_FONTES_DE_VERDADE.md`
4. `AUDITORIA_P21_FONTES_DE_VERDADE.md` — baseline histórico anterior às correções
5. `MAPA_MESTRE_POS_P20.md`

Roadmaps de 5/ago são históricos.

## Fechado

- P17 — N1.10/N1.11;
- P8 — Jardim/automaticidade;
- P18 — `KindType`;
- P19 — migrador/dependências;
- P20 — save/sync por UID;
- P21.1 — registries/cobertura/proveniência;
- P21.2 — mapa autoral de primitivas;
- P22.1 — GM.12 promovida;
- P22.2 — N4.09 promovida e telemetria de área corrigida;
- P22.3A — N1.07 completa segundo o grafo canônico.

## Estado atual após P22.3A

- 90 nós canônicos;
- 92 fichas Markdown / 88 competências cobertas;
- lacunas autorais: N1.09 e GM.02;
- Journey TS: 29/29 registrada administrativamente;
- Composer: **24 registrados / 24 ativos / 0 inativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- primitivas: 20 executáveis, 4 renderer-sem-builder, 1 isolada, 1 ausente.

N1.07 já era ativa, então P22.3A não muda contagem de proveniência; muda a fidelidade semântica do que é servido.

## P22.1 — GM.12

Gate final `31276881058`: success.

## P22.2 — N4.09

Gate final `31277213310`: success.

Invariante permanente: acerto de área não gera misconception; somente distratores carregam hipótese diagnóstica.

## P22.3A — N1.07

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: success.

Entregue:

- faixa F0;
- prereqs `N1.02 + N1.06`;
- sucessor até 5 e 10;
- antecessor até 5 e 10;
- ordenação de 3–4 numerais;
- salto negativo range-safe em `numberline` e `plain`;
- `plain/ordering` opt-in;
- teste permanente `N1.07.test.ts`;
- acerto sem misconception e ordenação errada com `ORDEM_ERRADA`;
- cânone autoral separando compreensão da Jornada e fluência do JD4;
- TypeScript, suíte, build e sonda real verdes;
- CI e arquivos temporários restaurados/removidos no mesmo lote.

## Próximo passo — P22.3B JD4

JD4 deve ser registrada no Jardim como **automaticidade de N1.07**, não como nova competência conceitual.

Contrato obrigatório:

1. `mae: "N1.07"`;
2. `destravaNoNivel` coerente com compreensão suficiente da mãe;
3. progresso exclusivamente em `dojoTracks`;
4. nunca chamar o motor de domínio da Jornada para promover N1.07;
5. `rt_alvo` é diagnóstico de fluência, não gate de compreensão;
6. cinco níveis: sucessor com apoio → sucessor sem apoio → antecessor → alternância;
7. teste permanente e sonda real antes de seguir.

Não registrar JD4 em `JOURNEY_FICHAS` nem criar nó no grafo.

## Depois

- P22.4 — N1.09;
- P22.5 — GM.02;
- auditoria longitudinal dos motores adaptativos;
- correções por invariantes/property tests;
- Coverage Matrix executável;
- fábrica curricular em ondas pedagógicas;
- mega auditoria pedagógica;
- auditoria JD/FD/PD;
- release hardening.

## Portões padrão

```bash
npm run auditar
npm run fichas:auditar
npm run fichas:conferir
npm run grafo:check
npx tsc --noEmit
npm test -- --run
npm run build
npm run pr:check
git diff --check
```

Tela afetada exige sonda real.

**Automaticidade treina o que já foi compreendido; não substitui compreensão.**
