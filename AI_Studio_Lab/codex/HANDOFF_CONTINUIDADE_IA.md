# Handoff de continuidade — SAGA

> **VIGENTE — 8/ago/2026. P21 concluída; P22.1 e P22.2 concluídas; próximo passo P22.3A/N1.07.**

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
- P22.2 — N4.09 promovida e telemetria de área corrigida.

## Estado atual

- 90 nós canônicos;
- 92 fichas Markdown / 88 competências cobertas;
- lacunas autorais: N1.09 e GM.02;
- Journey TS: 29/29 registrada administrativamente;
- Composer: **24 registrados / 24 ativos / 0 inativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- primitivas: 20 executáveis, 4 renderer-sem-builder, 1 isolada, 1 ausente.

## P22.1 — GM.12

Gate final `31276881058`: success.

- estreia Composer com rollback para placeholder;
- sonda 390/320/900 verde;
- suíte completa: 125 arquivos / 2.145 testes;
- cleanup: `35493c012b96aaf64e919babba47cc5f5a4171cf`.

## P22.2 — N4.09

O primeiro gate `31277083778` revelou um bug real: a resposta correta carregava misconception `"correta"`.

A causa foi corrigida na origem:

- `areaProcedure.ts`: resposta correta sem tag;
- `areaContract.ts`: propaga tags só de distratores;
- `areaContract.test.ts`: prova acerto sem diagnóstico e erros com hipótese;
- `canaryContract.test.ts`: N4.09 passou a obedecer ao contrato genérico;
- `composerCanaryIds.ts`: N4.09 promovida.

Gate final `31277213310`: success.

- focal: 3 arquivos / 339 testes;
- sonda N4.09 promovida verde;
- full suite: **125 arquivos / 2.160 testes**;
- auditores, TypeScript, build, `pr:check` e diff check verdes;
- cleanup concluído; head pós-limpeza `e259ccd19d10ec00ed6e4a35e2ce24967796d4f1`;
- PR #29 segue draft/unmerged e a `main` no SHA protegido.

## Próximo passo — P22.3A N1.07

N1.07 canônico é **Ordem, sucessor e antecessor até 10**.

Problemas já provados:

- ficha TS ativa cobre majoritariamente sucessor/+1;
- falta cobertura equivalente de antecessor e ordenação;
- prereqs da ficha TS (`N1.04 + N1.06`) divergem do grafo (`N1.02 + N1.06`).

Sequência:

1. reconstruir o contrato autoral N1.07 pela ficha Markdown/grafo;
2. reconciliar prereqs;
3. completar micros de sucessor, antecessor e ordenação;
4. preservar canário/rollback/telemetria;
5. validar sonda e gates completos;
6. só então criar P22.3B/JD4 como automaticidade de N1.07.

Não usar JD4 para compensar ensino conceitual ausente.

## Depois

- P22.3B — JD4;
- P22.4 — N1.09;
- P22.5 — GM.02;
- auditoria dos motores adaptativos;
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
