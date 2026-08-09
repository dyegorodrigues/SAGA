# Retomada — comece por aqui

> **VIGENTE em 9/ago/2026 — P21/P22 fechadas; auditoria longitudinal em curso. Próxima tarefa exata: reconciliação canônica cirúrgica → Tutor ↔ Dojo.**

## 1. Leia antes de editar

1. [`CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-09.md`](./CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-09.md) — **fonte operacional mais nova**; corrige o checkpoint de emergência com o estado real do runtime;
2. [`CHECKPOINT_EMERGENCIA_2026-08-09.md`](./CHECKPOINT_EMERGENCIA_2026-08-09.md) — histórico do salvamento após falha do chat;
3. [`AUDITORIA_MOTORES_ADAPTATIVOS.md`](./AUDITORIA_MOTORES_ADAPTATIVOS.md)
4. [`DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`](./DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md)
5. [`HANDOFF_CONTINUIDADE_IA.md`](./HANDOFF_CONTINUIDADE_IA.md)
6. [`DECISAO_P22_DIVIDAS_CURRICULARES.md`](./DECISAO_P22_DIVIDAS_CURRICULARES.md)
7. [`DECISAO_P21_FONTES_DE_VERDADE.md`](./DECISAO_P21_FONTES_DE_VERDADE.md)
8. [`PLANO_POS_P22_FABRICA_CURRICULAR.md`](./PLANO_POS_P22_FABRICA_CURRICULAR.md)

Roadmaps antigos são históricos. Código/runtime é fonte de verdade para estado implementado; decisões canônicas vigentes governam semântica pedagógica.

## 2. Git — regra de ouro

- repo: `dyegorodrigues/SAGA`;
- branch: `codex/integrar-bloco-f0`;
- `main` protegida: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- PR #29: open + draft + **não mesclar**;
- não tocar no Creature Engine;
- não criar branch auxiliar;
- workflow/script temporário não pode permanecer;
- não reescrever documentação rica para “consertar número”; reconciliação canônica deve ser cirúrgica.

## 3. Fechado — não reabrir sem falha objetiva

- P17 — N1.10/N1.11 e ponte perceptual→simbólica;
- P8 — Jardim e automaticidade separada da Jornada;
- P18 — `KindType` sem promessa autoral falsa;
- P19 — migrador único e dependências saneadas;
- P20 — save/sync por Firebase UID;
- P21.1 — registries, cobertura e proveniência;
- P21.2 — mapa de primitivas reconciliado;
- P22.1 — GM.12 promovida;
- P22.2 — N4.09 promovida e telemetria corrigida;
- P22.3A — N1.07 reconciliada;
- P22.3B — JD4 separada como automaticidade;
- P22.4 — N1.09 reconstruída;
- P22.5 — GM.02 reconstruída/promovida;
- Radar tag→nó;
- Aula composta → `sourceTrackId` → persist;
- Sensei sem `grade` como trilho;
- lacuna causal → Oficina pela mesma porta da Aula do Dia.

## 4. Estado final de P22

- grafo: **90/90**;
- fichas Markdown: **94**;
- cobertura autoral: **90/90**;
- exceções autorais: **0**;
- Journey: **31/31**;
- Composer: **26/26 ativos**;
- servido sem placeholder: **51/90**;
- fallback real: **39/90**;
- Jardim: **JD1–JD5**;
- primitivas: **20 executáveis / 4 renderer-sem-builder / 1 isolada / 1 ausente**.

Dívidas de primitiva ainda visíveis: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`.

## 5. Gates já fechados

- N1.09: `31286476155`; sonda `31286955931`; clean `31287106974`;
- GM.02: `31287744035`; sonda corrigida `31288014568`; clean `31288136803`;
- Radar: `31288516415`;
- Aula source progress: `31290512422` (CI 585);
- Sensei full DAG/dose por estado: `31290796584` (CI 589);
- Oficina causal pela porta do Tutor: `31290937246` (CI 593);
- checkpoint documental anterior: `31292542195` (CI 618) = success.

## 6. Arquitetura pedagógica vigente

- **Sensei:** professor/tutor prescritivo; uma meta dominante por missão;
- **Jornada:** mapa do conhecimento;
- **Dojo:** automaticidade em estado separado; prescrito + livre/manual;
- **Jardim:** bases perceptuais/pré-simbólicas, prescritíveis causalmente;
- **Oficina:** recuperação causal, curta, encorajadora e com saída;
- **Desafio Misto:** opcional/interleaving; nunca autoridade curricular;
- **idade/série:** contexto de apresentação, nunca progressão;
- **gamificação:** não compra unlock/mastery.

## 7. PRÓXIMA TAREFA A — reconciliação canônica cirúrgica

A auditoria final detectou falso verde documental:

- grafo/runtime estão em **90**;
- `MANUAL_DIDATICO_SAGA.md` ainda fecha em **89/89**;
- `METODO_SAGA.md` ainda contém 89/92 e a semântica histórica Jornada 1→3 / Dojo 3→5 + RT conceitual;
- `BIBLIA_DO_SAGA.md` tem uma retificação correta posterior, mas trechos normativos anteriores ainda misturam coroa conceitual com fluência/RT e dose por faixa etária;
- `catalog_auditor.cjs` usa `EXPECTED_COMPETENCIES=90`, mas ainda **exige** `/89 de 89/` no Manual e `/grafo de 89 competências/` no Método.

### Fazer primeiro

1. reconciliar Bíblia preservando histórico e bump de versão/changelog;
2. Manual → 90/90 + GM.12, preservando todo conteúdo didático;
3. Método → 90 competências / 94 fichas + ontologia Sensei/Jornada/Dojo/Oficina atual, preservando exemplos/fundamentação;
4. mudar auditor para falhar se prosa canônica voltar a divergir de 90;
5. gates completos.

**Precedente:** commit `b308151...` resumiu demais o Método e foi rejeitado; `14ebaab8...` restaurou o blob original exato `c172abe...`. Não repetir.

## 8. PRÓXIMA TAREFA B — Tutor ↔ Dojo

### Já implementado

`senseiDojoProgressContext.ts` já conecta tentativa → progressEngine → marcador transitório → `carimbar()` → `dojoTracks`, com testes de round parcial, 10 itens, 20 itens, retry, migração e teto conceitual.

Portanto NÃO reconstruir esse pipeline.

### Bug bloqueante real

A origem `prescribed | manual` ainda não está explícita. Hoje o código pode inferir `adaptive=true` apenas porque `servedStep === currentStep`.

Isso permite que prática manual no próprio `currentStep` mova o ponteiro adaptativo — incorreto.

### Fazer

1. carregar origem da sessão de ponta a ponta;
2. prescrito = `adaptive=true`;
3. manual = `adaptive=false`, mesmo no `currentStep`;
4. teste permanente provando isso;
5. integrar `prescribeSenseiDojo` ao Sensei/Aula do Dia sem misturar metas;
6. manter porta livre/manual;
7. aposentar `utils/dojoMode.ts` como inteligência principal;
8. sonda real + gates.

## 9. Depois

1. Jardim causal;
2. banco de erros composto;
3. identidade de telemetria/Leitner na Aula;
4. `LENTO_DEDOS` no catálogo;
5. timezone/`lastDay`;
6. recomendador paralelo por estrelas;
7. Misto por repertório elegível;
8. Matrícula sem grade rígida;
9. cloud reconciliation;
10. simulação longitudinal;
11. gamificação/economia/mascote;
12. Coverage Matrix;
13. fábrica curricular;
14. mega auditoria pedagógica;
15. hardening.

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

Tela alterada exige sonda real.

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
