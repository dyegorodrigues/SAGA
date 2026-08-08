# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21.A concluída.**

## 1. Leia só isto antes de editar

1. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
2. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
3. [`MAPA_MESTRE_POS_P20.md`](./MAPA_MESTRE_POS_P20.md) para a estratégia das fases grandes.

Os roadmaps de 5/ago são **históricos**. Não use contagens ou “próximo passo” deles como fila atual.

## 2. Git

- repo: `dyegorodrigues/SAGA`;
- branch desta linha: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: draft/no-merge;
- Creature Engine: não tocar;
- não criar branch auxiliar;
- bancada temporária se apaga no próprio lote.

## 3. Blocos já fechados

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim real e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único + dependências auditadas/zeradas;
- P20 — identidade do save local/cloud por Firebase UID.

Não reabrir sem falha objetiva.

## 4. P21.A — inventário já executado

Relatório:

`AUDITORIA_P21_FONTES_DE_VERDADE.md`

Achados derivados do runtime:

- grafo: **90/90** YAML↔JSON;
- cânone Markdown: **92 fichas / 88 competências em 90**;
- sem ficha Markdown: **N1.09, GM.02**;
- fichas TS de Jornada: **29**;
- registradas no Composer: **24**;
- canários ativos: **22**;
- registradas/inativas: **N4.09, GM.12**;
- `JOURNEY_FICHAS` administrativo está atrás do disco e deixa 10 fichas fora;
- `ficha_catalog_auditor` ainda usa expectativa histórica de 88 e não falha pela cobertura faltante;
- mapa de primitivas também contém classificações que precisam ser reconciliadas com builders/Stages atuais.

## 5. PRÓXIMA TAREFA EXATA — P21.1

**Corrigir governança, não pedagogia ainda.**

1. sincronizar `AllFichas/JOURNEY_FICHAS` com as 29 fichas TS existentes;
2. adicionar teste disco↔registry;
3. tornar a cobertura do auditor derivada do grafo;
4. manter N1.09/GM.02 como lacunas explícitas temporárias — nunca silenciosas;
5. separar no auditor: legacy / Composer registrado / Composer ativo / fallback real;
6. limpar comentários antigos de N1.10/N1.11 no `composerCanary.ts`;
7. depois fazer P21.2: reconciliar `FICHA_RUNTIME_MAP` com builder→kind→renderer real.

Documento de decisão:

`DECISAO_P21_FONTES_DE_VERDADE.md`

## 6. Depois de P21

- P22: decidir pedagogicamente N1.09, GM.02, JD4, N4.09 e GM.12;
- auditoria longitudinal dos motores adaptativos/meta-algoritmos;
- correções dos motores;
- mega auditoria de engenharia pedagógica;
- auditoria integrada JD/FD/PD;
- release hardening.

Detalhes: `MAPA_MESTRE_POS_P20.md`.

## 7. Portões

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

> **Existir não é estar certo. Ausência explícita pode ser dívida; ausência silenciosa é falha de governança.**
