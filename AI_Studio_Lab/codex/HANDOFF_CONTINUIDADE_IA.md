# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. P21 e P22 concluídas. Próxima fase: auditoria longitudinal da máquina adaptativa.**

## Regra de ouro

- Repo: `dyegorodrigues/SAGA`.
- Branch: `codex/integrar-bloco-f0`.
- `main` protegida/imóvel: `68fad4c575e28959b2ca4776e9a541d6828b63f3`.
- PR #29: open + draft, comparação/CI; não mesclar e não ativar auto-merge.
- Não tocar no Creature Engine.
- Não criar branch auxiliar desta linha.
- Bancada temporária deve desaparecer no lote que publica.

## Leia nesta ordem

1. `RETOMADA.md`
2. `DECISAO_P22_DIVIDAS_CURRICULARES.md`
3. `DECISAO_P21_FONTES_DE_VERDADE.md`
4. `PLANO_POS_P22_FABRICA_CURRICULAR.md`
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
- P22.1 — GM.12;
- P22.2 — N4.09 + telemetria de área;
- P22.3A — N1.07 completa;
- P22.3B — JD4 automática separada da Jornada;
- P22.4 — N1.09 autoral completa;
- **P22.5 — GM.02 autoral completa.**

## Estado final após P22

- **90 nós canônicos**;
- **94 fichas Markdown / 90 de 90 competências cobertas**;
- **0 exceções autorais**;
- Journey TS/registry/AllFichas: **31/31**;
- Composer: **26 registrados / 26 ativos / 0 inativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- primitivas: **20 executáveis, 4 renderer-sem-builder, 1 isolada, 1 ausente**.

Dívida runtime ainda explícita: LinkingCubes, Moedas, SingaporeBars e VisualAddition sem builder; Quadrado100 isolado; Regua ausente.

## Evidência de P22.4 — N1.09

- baseline semântico: `31286476155` = success;
- sonda rota real: `31286955931` = success;
- clean follow-up: `31287106974` = success.

A sonda encontrou e corrigiu colisão real em `ScatteredItems`; o palco passou a usar dispersão determinística sem sobreposição e ganhou teste geométrico permanente.

## Evidência de P22.5 — GM.02

- CI semântico: `31287744035` = success;
- primeira sonda: `31287813598` — encontrou contraste 4,22:1 no aviso audível e selo 🔊 cobrindo conteúdo;
- correção compartilhada no renderer/CSS de opções audíveis;
- sonda corrigida: `31288014568` = success;
- clean follow-up sem `postbuild`/injetor: `31288136803` = success;
- suíte do lote: **131 arquivos / 2.205 testes**.

GM.02 cobre manhã/tarde/noite, ontem/hoje/amanhã, semana, ordem de eventos e recuperação mista. Toda linguagem essencial chega por áudio; texto é apoio. O legado permanece rollback parcial.

## Fortalecimentos estruturais colhidos em P22

- nenhum auditor de fichas depende mais de contagem fixa 92/93/94;
- testes globais de Journey usam a mesma porta autoral da produção;
- builders especializados N1.09/GM.02 propagam `rt_alvo → rt_max_s`;
- micro explicitamente `misto` pode emitir apenas a união de kinds já ensinados pela própria ficha;
- resposta correta nunca deve carregar misconception;
- tempo continua metadado de fluência/revisão, não gate de domínio conceitual.

## Próxima fase — auditoria longitudinal dos motores

Traçar e provar, nesta ordem:

`GameLoop answer → misconception/evidence → mastery/progression → persistence → Radar/review → recommendation → unlock`.

Primeiros pontos de risco a resolver por evidência:

1. `GameLoop` pode mutar um mapa de progresso com mais de um nó; confirmar que `App` não reduz esse mapa ao nó atual antes de persistir;
2. verificar se `reviewForce` e `lastDay` escritos pelo Leitner sobrevivem ao commit;
3. comparar strings reais de `MisconceptionTag` com `TAG_TO_NODE` do Radar;
4. provar se `getDueReviews` realmente alimenta a recomendação diária;
5. provar se Radar resgata o nó correto;
6. confirmar unlock pelo DAG e separação Jardim→mãe;
7. validar persistência local/cloud dessas dimensões.

Não alterar algoritmo antes de demonstrar a discrepância e escrever teste de regressão.

## Depois

Seguir `PLANO_POS_P22_FABRICA_CURRICULAR.md`:

1. Coverage Matrix executável;
2. fábrica curricular por ondas;
3. mega auditoria pedagógica;
4. Dojo completo;
5. release hardening.

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

**Uma competência só está pronta quando código, telemetria, persistência e experiência real da criança concordam.**