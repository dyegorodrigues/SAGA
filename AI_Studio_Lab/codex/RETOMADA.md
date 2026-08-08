# Retomada — comece por aqui

> **VIGENTE em 8/ago/2026 — P21 concluída; P22 em execução. P22.1/GM.12, P22.2/N4.09 e P22.3A/N1.07 concluídas; próxima tarefa exata: P22.3B/JD4.**

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
- **P22.3A — N1.07 reconciliada com o grafo: sucessor, antecessor, ordenação e prereqs canônicos**.

## 4. Estado após P22.3A

- grafo: 90/90;
- Markdown: 92 fichas cobrindo 88/90 competências;
- lacunas autorais restantes: N1.09 e GM.02;
- Journey TS: 29/29 em `JOURNEY_FICHAS` e `AllFichas`;
- Composer registrado: **24/90**;
- Composer ativo: **24/90**;
- Composer registrado/inativo: **0/90**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- mapa de primitivas: 20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente.

P22.3A não altera essas contagens porque N1.07 já era registrada/ativa; corrige o **significado real** que a ficha servia.

## 5. P22.1 — GM.12 CONCLUÍDA

Gate final `31276881058`: **success**.

## 6. P22.2 — N4.09 CONCLUÍDA

Gate final `31277213310`: **success**.

Correção causal preservada: gabarito de área sem tag diagnóstica; somente distratores carregam misconception.

## 7. P22.3A — N1.07 CONCLUÍDA

Commit permanente: `d233591dcb7aa4b5a7883430fa769c5e9dae3823`.
Gate transacional: `31281685349`: **success**.

Comprovado:

- faixa canônica F0;
- prereqs `N1.02 + N1.06`;
- L1: sucessor até 5 com reta;
- L2: sucessor até 10 com apoio reduzido;
- L3: antecessor até 5;
- L4: antecessor até 10;
- L5: ordenação de 3–4 numerais;
- `numberline` e `plain` aceitam salto negativo sem escapar do intervalo;
- `plain/ordering` é modo opt-in, sem alterar semântica das demais fichas;
- resposta correta de ordenação não recebe misconception; distratores recebem `ORDEM_ERRADA`;
- teste permanente `src/curriculum/fichas/jornada/N1.07.test.ts`;
- cânone autoral explicita Jornada conceitual ≠ JD4 automático;
- TypeScript, suíte completa, build e sonda real N1.07 verdes;
- bancada temporária e permissão temporária de escrita foram auto-removidas; `ci.yml` voltou ao blob estável.

## 8. PRÓXIMA TAREFA EXATA — P22.3B JD4

Registrar JD4 no Jardim **somente como automaticidade posterior de N1.07**.

Invariantes obrigatórios:

1. mãe: N1.07;
2. destrava somente após compreensão suficiente da competência-mãe;
3. estado em `dojoTracks`, separado do progresso da Jornada;
4. `rt_alvo` e tempo descrevem fluência — nunca concedem domínio conceitual;
5. cinco níveis devem treinar sucessor/antecessor com retirada de apoio e culminar em alternância;
6. JD4 não entra no grafo/Journey registry;
7. teste permanente + sonda real + gates completos antes de P22.4.

## 9. Depois de P22.3B

- P22.4 — N1.09: ficha autoral/TS completa para contagem até 20 e a partir de N;
- P22.5 — GM.02: Tempo cotidiano pré-leitor;
- depois: auditoria longitudinal dos motores adaptativos;
- somente após invariantes dos motores: Coverage Matrix executável e fábrica curricular em ondas;
- depois: mega auditoria pedagógica e release hardening.

## 10. Portões

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
