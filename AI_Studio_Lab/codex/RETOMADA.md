# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12, P22.2/N4.09, P22.3A/N1.07 e P22.3B/JD4 concluídas; próxima tarefa exata: P22.4/N1.09.**

## 1. Leia antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P22_DIVIDAS_CURRICULARES.md`](./DECISAO_P22_DIVIDAS_CURRICULARES.md)
3. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
4. [`AUDITORIA_P21_FONTES_DE_VERDADE.md`](./AUDITORIA_P21_FONTES_DE_VERDADE.md) — baseline histórico pré-P21.1/P21.2
5. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md)

Roadmaps de 5/ago são históricos. Não usar fila ou contagens antigas sem recalcular o runtime.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft/no-merge;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- workflow/script temporário deve se apagar no próprio lote.

## 3. Fechado — não reabrir sem falha objetiva

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único e dependências saneadas;
- P20 — save/sync por Firebase UID;
- P21.1 — registries, cobertura e proveniência;
- P21.2 — mapa de primitivas reconciliado com builder→kind→renderer real;
- **P22.1 — GM.12 promovida como estreia Composer**;
- **P22.2 — N4.09 promovida e telemetria de área corrigida**;
- **P22.3A — N1.07 reconciliada com o grafo: sucessor, antecessor, ordenação e prereqs canônicos**;
- **P22.3B — JD4 registrada no Jardim como automaticidade de N1.07, com estado separado da Jornada**.

## 4. Estado após P22.3B

- grafo: 90/90;
- Markdown: 92 fichas cobrindo 88/90 competências;
- lacunas autorais restantes: N1.09 e GM.02;
- Journey TS: 29/29 em `JOURNEY_FICHAS` e `AllFichas`;
- Composer registrado: **24/90**;
- Composer ativo: **24/90**;
- Composer registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- Jardim: **JD1–JD5 presentes**;
- mapa de primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

JD4 não altera contagem de competências do grafo nem de Composer: é uma trilha de automaticidade do Jardim, não um nó curricular novo.

## 5. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.

## 6. P22.2 — N4.09 CONCLUÍDA

Gate final `31277213310`: **success**.

Correção causal preservada: gabarito de área sem tag diagnóstica; somente distratores carregam misconception.

## 7. P22.3A — N1.07 CONCLUÍDA

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: **success**.
Clean follow-up: `31281842046`: **success**.

N1.07 agora cobre sucessor até 5/10, antecessor até 5/10 e ordenação de 3–4 numerais, com prereqs `N1.02 + N1.06`.

## 8. P22.3B — JD4 CONCLUÍDA

Commit permanente: `40c571e2d642f80deabb697ebe1d24e3ece450e7`.
Gate transacional: `31282358997`: **success**.

Comprovado:

- `JD4` está em `JARDIM` com `mae: "N1.07"` e `destravaNoNivel: 3`;
- não entra no grafo nem em `JOURNEY_FICHAS`;
- progresso permanece em `dojoTracks`;
- projeção da sessão do Jardim continua `dom=false`, `mast=0`, sem `bank` conceitual;
- L1 sucessor até 5 com reta — 4,00s;
- L2 sucessor até 10 com reta — 3,75s;
- L3 sucessor até 20 sem reta — 3,50s;
- L4 antecessor até 10 — 3,25s;
- L5 alterna sucessor/antecessor até 20 — 3,00s;
- `rt_alvo` é estritamente decrescente e continua metadado de fluência, nunca domínio;
- `plain/neighbor_alternating` é opt-in;
- `DojoTab` agora exibe as cinco trilhas e estatísticas derivadas de `dojoTracks`;
- `DOJO_SAGA.md` foi retificado: JD4 é exclusivamente N1.07; a sobrecarga histórica N1.09/contar de 2 em 2 foi removida de JD4 sem apagar essa ideia do currículo futuro;
- teste permanente `src/curriculum/fichas/dojo/jardim/JD4.test.ts`;
- sonda permanente ganhou home JD4 + cinco níveis de exercício;
- sonda real JD4 passou em 390/320/900;
- TypeScript, suíte completa, build e guarda textual verdes;
- scripts temporários removidos e `ci.yml` restaurado ao blob estável.

## 9. PRÓXIMA TAREFA EXATA — P22.4 N1.09

N1.09 canônica é **Contagem até 20 e a partir de qualquer número**.

Contrato do lote:

1. prereqs canônicos `N1.04 + N1.02`;
2. ensinar/observar contagem de conjuntos 10–20;
3. iniciar contagem em número interno, sem voltar ao 1;
4. contagem regressiva simples;
5. criar ficha autoral Markdown + Journey TS + teste permanente;
6. registrar no Journey/Composer e promover com rollback legado preservado;
7. remover somente a exceção explícita N1.09 do auditor de cobertura;
8. não reutilizar N1.13 e não devolver a N1.09 para JD4;
9. sonda real + gates completos antes de P22.5.

O legado `gVis_Sequence` é apenas rollback: cobre continuação parcial, não a competência inteira.

## 10. Depois de P22.4

- P22.5 — GM.02: Tempo cotidiano pré-leitor;
- depois: auditoria longitudinal dos motores adaptativos;
- somente após invariantes dos motores: Coverage Matrix executável e fábrica curricular em ondas;
- depois: mega auditoria pedagógica e release hardening.

## 11. Portões

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

> **Automaticidade treina o que já foi compreendido; nunca deve esconder uma lacuna conceitual da Jornada.**
